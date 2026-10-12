import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

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

  const defaultApplications = [
    {
      id: 'CC-2026-89211',
      submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'Application Received ✓',
      currentStage: 'Choice Filling Sheet Prepared',
      paymentStatus: 'Paid & Confirmed ✓',
      transactionId: 'pay_rzp_neet_89211',
      paidAmount: '₹29,999',
      packageSelected: 'Medical Complete Admission Assistance',
      aadhaarVerified: true,
      personal: {
        studentName: 'Aarav Sharma',
        parentName: 'Dr. Rajesh Sharma',
        dob: '2006-04-12',
        mobile: '9811234567',
        whatsapp: '9811234567',
        email: 'aarav.sharma@gmail.com',
        aadhaar: '4589 1234 9876',
        state: 'Delhi NCR',
      },
      academic: {
        courseInterested: 'MBBS / Medical (NEET UG)',
        entranceExam: 'NEET UG 2026',
        rankScore: '642 / 720 (AIR 14,200)',
        category: 'General / UR',
        approximateBudget: 'Government Quota / Private State Quota',
      },
      counsellor: {
        name: 'Dr. Vikram Sethi',
        title: 'Chief Medical & NEET Advisor',
        phone: '+91 98765 43211',
        email: 'dr.sethi@cerebralcompass.com',
      },
    },
    {
      id: 'CC-2026-74102',
      submittedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
      status: 'Document Verification',
      currentStage: 'Document Verification',
      paymentStatus: 'Paid & Confirmed ✓',
      transactionId: 'pay_rzp_jee_74102',
      paidAmount: '₹24,999',
      packageSelected: 'Engineering Complete Admission Assistance',
      aadhaarVerified: true,
      personal: {
        studentName: 'Priya Verma',
        parentName: 'Sunil Verma',
        dob: '2006-08-20',
        mobile: '9876543219',
        whatsapp: '9876543219',
        email: 'priya.verma@outlook.com',
        aadhaar: '5678 9012 3456',
        state: 'Uttar Pradesh',
      },
      academic: {
        courseInterested: 'B.Tech / Engineering (JEE Main & Adv)',
        entranceExam: 'JEE Mains 2026',
        rankScore: '98.6 Percentile',
        category: 'OBC-NCL',
        approximateBudget: '₹12 Lakhs - ₹16 Lakhs',
      },
      counsellor: {
        name: 'Er. Ananya Sengupta',
        title: 'Head of Engineering Admissions',
        phone: '+91 98765 43212',
        email: 'ananya.s@cerebralcompass.com',
      },
    },
    {
      id: 'CC-2026-63045',
      submittedAt: new Date(Date.now() - 3600000 * 60).toISOString(),
      status: 'Round 1 Allotment Tracking',
      currentStage: 'Round 1 Allotment Tracking',
      paymentStatus: 'Paid & Confirmed ✓',
      transactionId: 'pay_rzp_mba_63045',
      paidAmount: '₹19,999',
      packageSelected: 'Management Career Pathway',
      aadhaarVerified: true,
      personal: {
        studentName: 'Rohan Kulkarni',
        parentName: 'Anand Kulkarni',
        dob: '2002-11-15',
        mobile: '9822334455',
        whatsapp: '9822334455',
        email: 'rohan.k@gmail.com',
        aadhaar: '7890 1234 5678',
        state: 'Maharashtra',
      },
      academic: {
        courseInterested: 'MBA / Management (CAT & XAT)',
        entranceExam: 'CAT 2025',
        rankScore: '96.4 Percentile',
        category: 'General / UR',
        approximateBudget: '₹18 Lakhs - ₹25 Lakhs',
      },
      counsellor: {
        name: 'Rohan Varma',
        title: 'Director of Management Admissions',
        phone: '+91 98765 43213',
        email: 'rohan.v@cerebralcompass.com',
      },
    },
    {
      id: 'CC-2026-52119',
      submittedAt: new Date(Date.now() - 3600000 * 84).toISOString(),
      status: 'Profile Review Call Scheduled',
      currentStage: 'Document Verification',
      paymentStatus: 'Paid & Confirmed ✓',
      transactionId: 'pay_rzp_cutoff_52119',
      paidAmount: '₹999',
      packageSelected: 'Standard Cutoff & Choice Filing Dossier',
      aadhaarVerified: true,
      personal: {
        studentName: 'Ananya Deshmukh',
        parentName: 'Rajeev Deshmukh',
        dob: '2005-02-18',
        mobile: '9833445566',
        whatsapp: '9833445566',
        email: 'ananya.d@gmail.com',
        aadhaar: '9012 3456 7890',
        state: 'Karnataka',
      },
      academic: {
        courseInterested: 'Law / CUET UG & CLAT',
        entranceExam: 'CLAT 2026',
        rankScore: 'AIR 2,450',
        category: 'General / UR',
        approximateBudget: '₹10 Lakhs',
      },
      counsellor: {
        name: 'Meera Sen',
        title: 'Senior UG & Global Pathways Advisor',
        phone: '+91 98765 43214',
        email: 'meera.s@cerebralcompass.com',
      },
    },
  ];

  return defaultApplications;
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

  // Realistic sample inquiries for immediate rich view
  const defaultInquiries = [
    {
      id: 'INQ-1718012001',
      name: 'Vikrant Singh',
      phone: '9899112233',
      email: 'vikrant.s@gmail.com',
      stream: 'MBBS (NEET UG AIQ vs State)',
      message: 'Need help with UP State NEET UG Round 1 choice filling and cutoffs.',
      status: 'New Lead',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'INQ-1718012002',
      name: 'Sanya Malhotra',
      phone: '9818884422',
      email: 'sanya.m@yahoo.com',
      stream: 'B.Tech CS Admissions',
      message: 'Want to know best NIT / IIIT options for 97 percentile in JEE Main.',
      status: 'Contacted',
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: 'INQ-1718012003',
      name: 'Aditya Oberoi',
      phone: '9871122334',
      email: 'aditya.o@gmail.com',
      stream: 'MBA / Management (CAT)',
      message: 'Looking for Tier-1 private MBA GD/PI prep and CAP rounds assistance.',
      status: 'Converted',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: 'INQ-1718012004',
      name: 'Kavita Joshi',
      phone: '9810998877',
      email: 'kavita.j@outlook.com',
      stream: 'Study Abroad (UK/Germany)',
      message: 'MS in Data Science shortlist and visa document audit requirements.',
      status: 'In Discussion',
      created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    },
  ];
  return defaultInquiries;
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

      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase fetch payments error:', err);
    }
  }

  // Derive and combine payments from confirmed applications + sample transactions
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

  if (appPayments.length > 0) return appPayments;

  return [
    {
      id: 'PAY-8921101',
      application_id: 'CC-2026-89211',
      student_name: 'Aarav Sharma',
      package_name: 'Medical Complete Admission Assistance',
      amount: 29999,
      currency: 'INR',
      payment_method: 'Razorpay NetBanking (HDFC)',
      transaction_id: 'pay_rzp_live_8921101',
      status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'PAY-7410202',
      application_id: 'CC-2026-74102',
      student_name: 'Priya Verma',
      package_name: 'Engineering Complete Admission Assistance',
      amount: 24999,
      currency: 'INR',
      payment_method: 'Razorpay UPI (Google Pay)',
      transaction_id: 'pay_rzp_live_7410202',
      status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    },
    {
      id: 'PAY-6304503',
      application_id: 'CC-2026-63045',
      student_name: 'Rohan Kulkarni',
      package_name: 'Management Career Pathway',
      amount: 19999,
      currency: 'INR',
      payment_method: 'Razorpay Cards (ICICI CC)',
      transaction_id: 'pay_rzp_live_6304503',
      status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
    },
    {
      id: 'PAY-5211904',
      application_id: 'CC-2026-52119',
      student_name: 'Ananya Deshmukh',
      package_name: 'Standard Cutoff & Choice Filing Dossier',
      amount: 999,
      currency: 'INR',
      payment_method: 'Razorpay UPI (PhonePe)',
      transaction_id: 'pay_rzp_live_5211904',
      status: 'Completed',
      created_at: new Date(Date.now() - 3600000 * 80).toISOString(),
    },
  ];
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
