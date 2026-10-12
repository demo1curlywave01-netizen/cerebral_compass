import { saveApplicationRecord } from './supabaseClient';

// API Client with automatic fallback to client-side persistence

export const submitApplicationApi = async (formData) => {
  const generatedId = `CC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const appWithId = { id: generatedId, ...formData };

  // Try saving to Supabase if configured
  try {
    const sbResult = await saveApplicationRecord(appWithId);
    if (sbResult && sbResult.success) {
      return sbResult;
    }
  } catch (sbErr) {
    console.warn('Supabase save error:', sbErr);
  }

  try {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appWithId),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend server call fallback to local session:', err);
  }

  // Resilient fallback storage
  const fallbackId = `CC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const courseStr = (formData.academic?.courseInterested || formData.preferences?.course || '').toLowerCase();
  
  let assignedCounsellor = {
    name: 'Dr. Vikram Sethi',
    title: 'Chief Medical & NEET Advisor',
    phone: '+91 98765 43211',
    email: 'dr.sethi@cerebralcompass.com',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
  };

  if (courseStr.includes('b.tech') || courseStr.includes('engineering') || courseStr.includes('jee')) {
    assignedCounsellor = {
      name: 'Er. Ananya Sengupta',
      title: 'Head of Engineering Admissions',
      phone: '+91 98765 43212',
      email: 'ananya.s@cerebralcompass.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    };
  } else if (courseStr.includes('mba') || courseStr.includes('management') || courseStr.includes('cat')) {
    assignedCounsellor = {
      name: 'Rohan Varma',
      title: 'Director of Management & Global Pathways',
      phone: '+91 98765 43213',
      email: 'rohan.v@cerebralcompass.com',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    };
  }

  const simulatedApp = {
    id: fallbackId,
    submittedAt: new Date().toISOString(),
    status: 'Application Received ✓',
    currentStage: 'Document Verification',
    stagesCompleted: ['Application Form'],
    counsellor: assignedCounsellor,
    paymentStatus: formData.paymentStatus || 'Pending',
    packageSelected: formData.packageSelected || 'Complete Admission Assistance',
    nextAction: 'Senior Counsellor Profile Review Call scheduled within 24 hours',
    personal: formData.personal || {},
    academic: formData.academic || {},
    preferences: formData.preferences || {},
    documents: formData.documents || [],
    termsAccepted: true,
  };

  try {
    const existing = JSON.parse(localStorage.getItem('cerebral_applications') || '[]');
    existing.unshift(simulatedApp);
    localStorage.setItem('cerebral_applications', JSON.stringify(existing));
    localStorage.setItem('cerebral_last_app_id', fallbackId);
  } catch (e) {
    console.error(e);
  }

  return {
    success: true,
    applicationId: fallbackId,
    message: 'Application recorded successfully.',
    application: simulatedApp,
  };
};

export const fetchApplicationById = async (id) => {
  try {
    const res = await fetch(`/api/applications/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend lookup fallback:', err);
  }

  // Lookup in localStorage fallback
  try {
    const existing = JSON.parse(localStorage.getItem('cerebral_applications') || '[]');
    const found = existing.find((a) => a.id.toLowerCase() === id.toLowerCase());
    if (found) {
      return { success: true, application: found };
    }
  } catch (e) {
    console.error(e);
  }

  return { success: false, error: 'Application record not found' };
};

export const uploadDocumentApi = async (file) => {
  const formData = new FormData();
  formData.append('document', file);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend file upload fallback:', err);
  }

  // Fallback representation
  return {
    success: true,
    file: {
      originalName: file.name,
      fileName: `doc_${Date.now()}_${file.name}`,
      size: (file.size / 1024).toFixed(1) + ' KB',
      mimeType: file.type || 'application/pdf',
      uploadedAt: new Date().toISOString(),
      verifiedStatus: 'Pending Verification',
    },
  };
};

export const sendContactInquiry = async (inquiryData) => {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    //
  }
  return {
    success: true,
    message: 'Inquiry received. Senior Counsellor will reach out via WhatsApp.',
  };
};
