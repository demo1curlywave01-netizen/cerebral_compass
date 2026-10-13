import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://dihswtyhpyejmxqmutza.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_gnHbfgkwtkNBfXO1xMev1Q_3CiNL26B';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// =========================================================================
// UNIFIED DATA ACCESS LAYER (SUPABASE + LOCAL FALLBACK)
// =========================================================================

export const fetchAllApplications = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Map postgres snake_case to frontend camelCase
        return data.map(mapFromSupabaseApplication);
      }
      console.warn('Supabase fetch error, fallback to local/server:', error);
    } catch (err) {
      console.warn('Supabase network error:', err);
    }
  }

  // Fallback to Express backend or localStorage
  try {
    const res = await fetch('/api/applications');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json)) return json;
    }
  } catch {
    //
  }

  try {
    const stored = JSON.parse(localStorage.getItem('cerebral_applications') || '[]');
    if (stored.length > 0) return stored;
  } catch {
    //
  }

  return [];
};

export const saveApplicationRecord = async (appData) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const dbRow = mapToSupabaseApplication(appData);
      const { data, error } = await supabase
        .from('applications')
        .insert([dbRow])
        .select()
        .single();

      if (!error && data) {
        return { success: true, application: mapFromSupabaseApplication(data) };
      }
      console.warn('Supabase insert error, falling back:', error);
    } catch (err) {
      console.warn('Supabase insert network error:', err);
    }
  }

  return null; // Signals caller to continue with standard API fallback
};

export const updateApplicationStatus = async (id, updates) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({
          status: updates.status,
          current_stage: updates.currentStage,
          admin_notes: updates.adminNotes,
          assigned_counsellor: updates.counsellor,
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return { success: true, application: mapFromSupabaseApplication(data) };
      }
    } catch (err) {
      console.warn('Supabase update error:', err);
    }
  }

  // Local storage update fallback
  try {
    const existing = JSON.parse(localStorage.getItem('cerebral_applications') || '[]');
    const idx = existing.findIndex((a) => a.id === id);
    if (idx !== -1) {
      existing[idx] = { ...existing[idx], ...updates };
      localStorage.setItem('cerebral_applications', JSON.stringify(existing));
      return { success: true, application: existing[idx] };
    }
  } catch (e) {
    console.error(e);
  }

  return { success: false };
};

export const deleteApplicationRecord = async (id) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (!error) return { success: true };
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
  }

  // Local storage fallback
  try {
    const existing = JSON.parse(localStorage.getItem('cerebral_applications') || '[]');
    const filtered = existing.filter((a) => a.id !== id);
    localStorage.setItem('cerebral_applications', JSON.stringify(filtered));
    return { success: true };
  } catch {
    return { success: false };
  }
};

// =========================================================================
// INQUIRIES LEADS API
// =========================================================================

export const fetchAllInquiries = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase fetch inquiries error:', err);
    }
  }

  try {
    const res = await fetch('/api/inquiries');
    if (res.ok) return await res.json();
  } catch {
    //
  }

  try {
    const stored = JSON.parse(localStorage.getItem('cerebral_inquiries') || '[]');
    if (stored.length > 0) return stored;
  } catch {
    //
  }

  return [];
};

export const updateInquiryStatus = async (id, status) => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);
    } catch (e) {
      console.warn('Supabase update inquiry error:', e);
    }
  }

  try {
    const list = JSON.parse(localStorage.getItem('cerebral_inquiries') || '[]');
    const idx = list.findIndex((i) => i.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem('cerebral_inquiries', JSON.stringify(list));
    }
  } catch {
    //
  }
  return { success: true };
};

export const fetchAllPayments = async (applications = []) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase fetch payments error:', err);
    }
  }

  // Derive and combine payments from confirmed applications
  const appPayments = (applications || [])
    .filter((a) => (a.paymentStatus || '').includes('Paid'))
    .map((a) => ({
      id: `PAY-${a.transactionId || a.id}`,
      application_id: a.id,
      student_name: a.personal?.studentName || 'Student',
      package_name: a.packageSelected || 'Admission Dossier',
      amount: parseInt((a.paidAmount || '999').replace(/\D/g, '')) || 999,
      currency: 'INR',
      payment_method: 'Razorpay UPI / Cards',
      transaction_id: a.transactionId || `pay_rzp_${a.id}`,
      status: 'Completed',
      created_at: a.submittedAt || new Date().toISOString(),
    }));

  return appPayments;
};

// =========================================================================
// OBJECT MAPPERS (POSTGRES SNAKE_CASE <-> JS CAMELCASE)
// =========================================================================

function mapToSupabaseApplication(app) {
  return {
    id: app.id,
    student_name: app.personal?.studentName || 'Student',
    parent_name: app.personal?.parentName || '',
    dob: app.personal?.dob || null,
    mobile: app.personal?.mobile || '',
    whatsapp: app.personal?.whatsapp || '',
    email: app.personal?.email || '',
    aadhaar: app.personal?.aadhaar || '',
    aadhaar_verified: app.aadhaarVerified ?? true,
    address: app.personal?.address || '',
    state: app.personal?.state || 'Delhi NCR',
    course_interested: app.academic?.courseInterested || 'MBBS',
    entrance_exam: app.academic?.entranceExam || '',
    rank_score: app.academic?.rankScore || '',
    category: app.academic?.category || 'General / UR',
    tenth_details: app.academic?.tenthDetails || '',
    twelfth_details: app.academic?.twelfthDetails || '',
    budget: app.academic?.approximateBudget || '',
    preferences: app.preferences || {},
    documents: app.documents || [],
    package_selected: app.packageSelected || 'Standard Counselling Dossier',
    payment_status: app.paymentStatus || 'Paid & Confirmed ✓',
    transaction_id: app.transactionId || null,
    paid_amount: app.paidAmount || '₹999',
    current_stage: app.currentStage || 'Document Verification',
    assigned_counsellor: app.counsellor || {},
    status: app.status || 'Under Review',
  };
}

function mapFromSupabaseApplication(row) {
  return {
    id: row.id,
    submittedAt: row.created_at,
    status: row.status || 'Under Review',
    currentStage: row.current_stage || 'Document Verification',
    paymentStatus: row.payment_status || 'Paid & Confirmed ✓',
    transactionId: row.transaction_id,
    paidAmount: row.paid_amount,
    packageSelected: row.package_selected,
    adminNotes: row.admin_notes,
    personal: {
      studentName: row.student_name,
      parentName: row.parent_name,
      dob: row.dob,
      mobile: row.mobile,
      whatsapp: row.whatsapp,
      email: row.email,
      aadhaar: row.aadhaar,
      address: row.address,
      state: row.state,
    },
    academic: {
      courseInterested: row.course_interested,
      entranceExam: row.entrance_exam,
      rankScore: row.rank_score,
      category: row.category,
      tenthDetails: row.tenth_details,
      twelfthDetails: row.twelfth_details,
      approximateBudget: row.budget,
    },
    preferences: row.preferences || {},
    documents: row.documents || [],
    counsellor: row.assigned_counsellor || {},
    aadhaarVerified: row.aadhaar_verified,
  };
}
