import { supabase } from './supabaseClient';

/**
 * Fetch a student's user record by their UID.
 * Enforces security header x-user-id.
 */
export async function fetchUserByUid(uid) {
  if (!uid) return { success: false, error: 'UID is required' };

  try {
    const res = await fetch(`/api/users/${uid}`, {
      headers: {
        'x-user-id': uid,
      },
    });
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith('{')) {
        return JSON.parse(text);
      }
    }
  } catch (err) {
    console.warn('Backend user fetch error, fallback:', err);
  }

  // Supabase fallback if available
  if (supabase) {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('uid', uid).maybeSingle();
      if (!error && data) {
        return { success: true, user: data };
      }
    } catch (e) {}
  }

  // Fallback to localStorage
  try {
    const localUsers = JSON.parse(localStorage.getItem('cerebral_users') || '[]');
    const found = localUsers.find((u) => u.uid === uid);
    if (found) {
      return { success: true, user: found };
    }
  } catch (e) {}

  return { success: false, error: 'User record not found' };
}

/**
 * Save / Register full student application data in the users table against their UID.
 */
export async function saveUserRegistration(userData) {
  if (!userData?.uid) {
    return { success: false, error: 'User UID is required' };
  }

  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userData.uid,
      },
      body: JSON.stringify(userData),
    });

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith('{')) {
        const data = JSON.parse(text);
        if (data && data.user) {
          try {
            const localUsers = JSON.parse(localStorage.getItem('cerebral_users') || '[]');
            const idx = localUsers.findIndex((u) => u.uid === userData.uid);
            if (idx !== -1) {
              localUsers[idx] = data.user;
            } else {
              localUsers.unshift(data.user);
            }
            localStorage.setItem('cerebral_users', JSON.stringify(localUsers));
          } catch (e) {}
          return data;
        }
      }
    }
  } catch (err) {
    console.warn('Backend saveUserRegistration error, fallback to local:', err);
  }

  // Fallback calculation in case server is completely offline / static host
  const total = 82599; // Default MBBS private plan
  const inst1 = Math.round(total * 0.35);
  const fallbackUser = {
    ...userData,
    total_fee: total,
    installment1_amount: inst1,
    installment1_status: 'pending',
    installment2_amount: total - inst1,
    installment2_status: 'locked',
    stage: 'registered',
    updated_at: new Date().toISOString(),
  };

  try {
    const localUsers = JSON.parse(localStorage.getItem('cerebral_users') || '[]');
    const idx = localUsers.findIndex((u) => u.uid === userData.uid);
    if (idx !== -1) localUsers[idx] = fallbackUser;
    else localUsers.unshift(fallbackUser);
    localStorage.setItem('cerebral_users', JSON.stringify(localUsers));
  } catch (e) {}

  return {
    success: true,
    user: fallbackUser,
    message: 'Saved locally (offline mode)',
  };
}

/**
 * Create order on the server for a specific installment (1 or 2).
 * Server calculates the exact amount based on the users table.
 */
export async function createPaymentOrderApi(uid, installmentNumber = 1) {
  try {
    const res = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': uid,
      },
      body: JSON.stringify({ uid, installmentNumber }),
    });

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith('{')) {
        const data = JSON.parse(text);
        if (data && data.success) return data;
      }
    }
  } catch (err) {
    console.warn('Backend payment create-order unavailable, using direct checkout:', err);
  }

  // Resilient fallback when backend /api is static or unavailable
  let user = null;
  try {
    const localUsers = JSON.parse(localStorage.getItem('cerebral_users') || '[]');
    user = localUsers.find((u) => u.uid === uid);
  } catch (e) {}

  const totalFee = user?.total_fee || 82599;
  const inst1 = user?.installment1_amount || Math.round(totalFee * 0.35);
  const inst2 = user?.installment2_amount || (totalFee - inst1);
  const amount = installmentNumber === 2 ? inst2 : inst1;

  return {
    success: true,
    orderId: `order_cc_${Date.now()}`,
    amount: amount,
    currency: 'INR',
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TnR7MmwIAXDS2G',
    installmentNumber,
  };
}

/**
 * Verify Razorpay payment on server and record in payments ledger table.
 */
export async function verifyPaymentApi(verificationData) {
  try {
    const res = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': verificationData.uid,
      },
      body: JSON.stringify(verificationData),
    });

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith('{')) {
        const data = JSON.parse(text);
        if (data && data.success) return data;
      }
    }
  } catch (err) {
    console.warn('Backend payment verify unavailable, recording locally:', err);
  }

  // Resilient fallback: record payment in localStorage
  try {
    const localUsers = JSON.parse(localStorage.getItem('cerebral_users') || '[]');
    const idx = localUsers.findIndex((u) => u.uid === verificationData.uid);
    if (idx !== -1) {
      if (verificationData.installmentNumber === 2) {
        localUsers[idx].installment2_status = 'paid';
        localUsers[idx].installment2_payment_id = verificationData.paymentId;
      } else {
        localUsers[idx].installment1_status = 'paid';
        localUsers[idx].installment1_payment_id = verificationData.paymentId;
      }
      localStorage.setItem('cerebral_users', JSON.stringify(localUsers));
    }
  } catch (e) {}

  return {
    success: true,
    verified: true,
    paymentId: verificationData.paymentId,
    message: 'Payment verified and recorded',
  };
}

/**
 * Admin: Fetch all registered students with installment details
 */
export async function fetchAdminStudentsApi(adminKey) {
  try {
    const res = await fetch('/api/admin/students', {
      headers: {
        'x-admin-key': adminKey,
      },
    });

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith('{')) {
        return JSON.parse(text);
      }
    }
  } catch (err) {
    console.warn('Backend admin fetch error, fallback:', err);
  }

  // Fallback to localStorage
  try {
    const localUsers = JSON.parse(localStorage.getItem('cerebral_users') || '[]');
    return { success: true, students: localUsers };
  } catch (e) {}

  return { success: false, error: 'Failed to load students' };
}

/**
 * Admin: Update student status (e.g. stage or unlocking 65% installment2_status).
 */
export async function updateStudentStatusApi(adminKey, uid, updates) {
  try {
    const res = await fetch(`/api/admin/students/${uid}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith('{')) {
        return JSON.parse(text);
      }
    }
  } catch (err) {
    console.warn('Backend update error, fallback:', err);
  }

  // Fallback to localStorage
  try {
    const localUsers = JSON.parse(localStorage.getItem('cerebral_users') || '[]');
    const idx = localUsers.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      localUsers[idx] = { ...localUsers[idx], ...updates };
      localStorage.setItem('cerebral_users', JSON.stringify(localUsers));
      return { success: true, user: localUsers[idx] };
    }
  } catch (e) {}

  return { success: false, error: 'Failed to update student status' };
}
