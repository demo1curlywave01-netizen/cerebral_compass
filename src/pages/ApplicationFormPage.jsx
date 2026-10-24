import React, { useState, useEffect } from 'react';
import InstitutionalCertificatesSection from '../components/InstitutionalCertificatesSection';
import { submitApplicationApi, uploadDocumentApi, sendInvoiceEmailApi, getWhatsAppInvoiceUrl } from '../services/api';
import { getCurrentUser, loginWithGoogle, logout } from '../services/authService';
import { fetchUserByUid, saveUserRegistration, createPaymentOrderApi, verifyPaymentApi } from '../services/userService';
import { calculateGstBreakdown, parsePackageGst } from '../utils/gstCalculator';
import { getClientNextReferenceId } from '../utils/referenceId';
import confetti from 'canvas-confetti';
import {
  User,
  GraduationCap,
  Sliders,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  AlertCircle,
  Loader2,
  Trash2,
  ShieldCheck,
  CreditCard,
  Lock,
  Download,
  MessageCircle,
  Sparkles,
  Check,
  LogIn,
} from 'lucide-react';

export default function ApplicationFormPage({
  initialCourse = '',
  initialPackage = '',
  onNavigate,
  onApplicationSuccess,
}) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [userRecord, setUserRecord] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [payingInstallmentNum, setPayingInstallmentNum] = useState(1);

  const tokenGst = calculateGstBreakdown(999);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [touchedFields, setTouchedFields] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res?.success && res?.user) {
        setCurrentUser(res.user);
        setFormData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            studentName: res.user.name || prev.personal.studentName,
            email: res.user.email || prev.personal.email,
            mobile: res.user.phone || prev.personal.mobile,
          },
        }));
      }
    } catch (err) {
      console.warn('Google Sign-In failed:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Selected Fee / Package Amount (including 18% GST)
  const [selectedFee, setSelectedFee] = useState(tokenGst ? tokenGst.totalPayable : 1178.82);
  const [packageFee, setPackageFee] = useState(null);
  const [packageGstInfo, setPackageGstInfo] = useState(null);
  const [feeOption, setFeeOption] = useState('package'); // 'package' | 'dossier'

  // Form State across all steps
  // Form State across all steps
  const [formData, setFormData] = useState({
    personal: {
      studentName: currentUser?.name || '',
      parentName: '',
      dob: '',
      mobile: currentUser?.phone || '',
      whatsapp: currentUser?.phone || '',
      email: currentUser?.email || '',
      aadhaar: '',
      address: '',
      state: '',
    },
    academic: {
      courseInterested: initialCourse ? initialCourse.toUpperCase() : 'MBBS',
      entranceExam: 'NEET UG',
      rankScore: '',
      category: 'General / UR',
      tenthDetails: '',
      twelfthDetails: '',
      preferredStateCity: '',
      approximateBudget: '',
    },
    preferences: {
      countryPreference: 'India Only',
      preferredColleges: '',
      courseSpecialization: 'General Clinical / AI & Data / Finance',
      hostelRequirement: 'Yes, Required',
      educationLoanRequirement: 'Yes, Required',
    },
    documents: [
      { type: 'Photograph', name: '', size: '', status: 'Not uploaded', required: true },
      { type: 'ID Proof (Aadhaar / Passport)', name: '', size: '', status: 'Not uploaded', required: true },
      { type: '10th Certificate', name: '', size: '', status: 'Not uploaded', required: true },
      { type: '12th Certificate / Marksheet', name: '', size: '', status: 'Not uploaded', required: true },
      { type: 'Entrance Scorecard (NEET/JEE/CAT)', name: '', size: '', status: 'Not uploaded', required: true },
      { type: 'Category Certificate (if applicable)', name: '', size: '', status: 'Optional', required: false },
      { type: 'Other Supporting Documents', name: '', size: '', status: 'Optional', required: false },
    ],
    packageSelected: initialPackage || 'Standard Counselling Dossier',
    termsAccepted: false,
    accuracyConfirmed: false,
  });

  // Listen for real-time auth state updates (e.g., from Google OAuth redirect)
  useEffect(() => {
    const handleAuthChange = (e) => {
      const u = e.detail || getCurrentUser();
      setCurrentUser(u);
      if (u) {
        setFormData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            studentName: u.name || prev.personal.studentName,
            email: u.email || prev.personal.email,
            mobile: u.phone || prev.personal.mobile,
          },
        }));
      }
    };
    window.addEventListener('cerebral_auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('cerebral_auth_state_changed', handleAuthChange);
  }, []);

  // Load returning user record by UID and pre-fill ALL form fields
  useEffect(() => {
    const activeUser = currentUser || getCurrentUser();
    if (activeUser?.uid) {
      setLoadingUser(true);
      fetchUserByUid(activeUser.uid).then((res) => {
        if (res.success && res.user) {
          const u = res.user;
          setUserRecord(u);

          // Pre-fill form so user never has to re-fill anything
          setFormData((prev) => ({
            ...prev,
            personal: {
              studentName: u.student_name || u.name || prev.personal.studentName,
              parentName: u.parent_name || prev.personal.parentName,
              dob: u.dob || prev.personal.dob,
              mobile: u.phone || u.mobile || prev.personal.mobile,
              whatsapp: u.whatsapp || u.phone || prev.personal.whatsapp,
              email: u.email || prev.personal.email,
              aadhaar: u.aadhaar || prev.personal.aadhaar,
              address: u.address || prev.personal.address,
              state: u.state || prev.personal.state,
            },
            academic: {
              courseInterested: u.course_interested || prev.academic.courseInterested,
              entranceExam: u.entrance_exam || prev.academic.entranceExam,
              rankScore: u.rank_score || prev.academic.rankScore,
              category: u.category || prev.academic.category,
              tenthDetails: u.tenth_details || prev.academic.tenthDetails,
              twelfthDetails: u.twelfth_details || prev.academic.twelfthDetails,
              preferredStateCity: u.preferred_state_city || prev.academic.preferredStateCity,
              approximateBudget: u.approximate_budget || prev.academic.approximateBudget,
            },
            preferences: u.preferences && Object.keys(u.preferences).length > 0 ? u.preferences : prev.preferences,
            documents: u.documents && u.documents.length > 0 ? u.documents : prev.documents,
            packageSelected: u.package_selected || prev.packageSelected,
            termsAccepted: true,
            accuracyConfirmed: true,
          }));

          // Set package and fee breakdown
          const pkgToParse = u.package_selected || initialPackage;
          if (pkgToParse) {
            const gstBreakdown = parsePackageGst(pkgToParse);
            if (gstBreakdown && gstBreakdown.totalPayable > 0) {
              setPackageGstInfo(gstBreakdown);
              setPackageFee(gstBreakdown.totalPayable);
              setSelectedFee(u.installment1_amount || Math.round(gstBreakdown.totalPayable * 0.35));
            }
          }
        }
      }).catch((e) => {
        console.warn('Error loading returning user record:', e);
      }).finally(() => {
        setLoadingUser(false);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (initialCourse) {
      setFormData((prev) => ({
        ...prev,
        academic: {
          ...prev.academic,
          courseInterested: initialCourse.toUpperCase(),
        },
      }));
    }
  }, [initialCourse]);

  useEffect(() => {
    if (initialPackage) {
      setFormData((prev) => ({
        ...prev,
        packageSelected: initialPackage,
      }));

      // Calculate 18% GST Breakdown
      const gstBreakdown = parsePackageGst(initialPackage);
      if (gstBreakdown && gstBreakdown.totalPayable > 0) {
        setPackageGstInfo(gstBreakdown);
        setPackageFee(gstBreakdown.totalPayable);
        setSelectedFee(gstBreakdown.totalPayable);
        setFeeOption('package');
      }
    }
  }, [initialPackage]);

  // Validation Helpers
  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  };

  const isValidPhone = (phone) => {
    const clean = phone.replace(/\D/g, '');
    return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
  };

  const isValidAadhaar = (aadhaar) => {
    const clean = aadhaar.replace(/\D/g, '');
    return clean.length === 12;
  };

  const formatAadhaarNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  // Input Handlers with Strict Formatting
  const handleStudentNameChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z\s.]/g, '');
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, studentName: val },
    }));
  };

  const handleParentNameChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z\s.]/g, '');
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, parentName: val },
    }));
  };

  const handleMobileChange = (e) => {
    // Only numeric, maximum 10 digits
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, mobile: digits },
    }));
  };

  const handleWhatsappChange = (e) => {
    // Only numeric, maximum 10 digits
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, whatsapp: digits },
    }));
  };

  const copyMobileToWhatsapp = () => {
    if (formData.personal.mobile) {
      setFormData((prev) => ({
        ...prev,
        personal: { ...prev.personal, whatsapp: prev.personal.mobile },
      }));
    }
  };

  const handleEmailChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, email: e.target.value.trim() },
    }));
  };

  const handleAadhaarChange = (e) => {
    const formatted = formatAadhaarNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, aadhaar: formatted },
    }));
  };

  const handlePersonalChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [e.target.name]: e.target.value },
    }));
  };

  const handleAcademicChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      academic: { ...prev.academic, [e.target.name]: e.target.value },
    }));
  };

  const handlePreferencesChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [e.target.name]: e.target.value },
    }));
  };

  // Step 1 Validation Check
  const validateStep1 = () => {
    const errors = [];
    const p = formData.personal;

    if (!p.studentName || p.studentName.trim().length < 3) {
      errors.push('Student Name is required (minimum 3 characters, letters only).');
    }
    if (!p.parentName || p.parentName.trim().length < 3) {
      errors.push('Parent / Guardian Name is required.');
    }
    if (!p.dob) {
      errors.push('Date of Birth is required.');
    }
    if (!isValidPhone(p.mobile)) {
      errors.push('Calling Mobile Number must be exactly 10 digits starting with 6, 7, 8, or 9.');
    }
    if (!isValidPhone(p.whatsapp)) {
      errors.push('WhatsApp Number must be exactly 10 digits.');
    }
    if (!isValidEmail(p.email)) {
      errors.push('A valid Email Address is required (e.g. name@example.com).');
    }
    if (!isValidAadhaar(p.aadhaar)) {
      errors.push('Aadhaar Number must be a valid 12-digit number (XXXX XXXX XXXX).');
    }
    if (!p.address || p.address.trim().length < 5) {
      errors.push('Residential Address is required (minimum 5 characters).');
    }

    return errors;
  };

  // Step 2 Validation Check
  const validateStep2 = () => {
    const errors = [];
    const a = formData.academic;
    if (!a.courseInterested) errors.push('Please select the Course Interested In.');
    if (!a.entranceExam) errors.push('Please select the Entrance Exam.');
    if (!a.rankScore || a.rankScore.trim().length === 0) {
      errors.push('Expected / Actual Rank or Score is required (e.g. Score 590 or Appearing).');
    }
    if (!a.tenthDetails || a.tenthDetails.trim().length === 0) {
      errors.push('10th Board & Percentage is required.');
    }
    if (!a.twelfthDetails || a.twelfthDetails.trim().length === 0) {
      errors.push('12th Board & Stream details are required.');
    }
    return errors;
  };

  // Step 3 Validation Check
  const validateStep3 = () => {
    const errors = [];
    const pr = formData.preferences;
    if (!pr.countryPreference) errors.push('Please select Location Geography preference.');
    if (!pr.hostelRequirement) errors.push('Please select Hostel Requirement.');
    if (!pr.educationLoanRequirement) errors.push('Please select Education Loan requirement.');
    return errors;
  };

  // Step 4 Validation Check
  const validateStep4 = () => {
    const requiredDocs = formData.documents.filter((d) => d.required);
    const unuploaded = requiredDocs.filter((d) => !d.name || d.status === 'Not uploaded');
    if (unuploaded.length > 0) {
      return [`Please upload all ${unuploaded.length} mandatory documents before proceeding.`];
    }
    return [];
  };

  // Step Progression Handler
  const handleNextStep = () => {
    setErrorMsg('');

    if (currentStep === 1) {
      setTouchedFields({
        studentName: true,
        parentName: true,
        dob: true,
        mobile: true,
        whatsapp: true,
        email: true,
        aadhaar: true,
        address: true,
      });

      const errs = validateStep1();
      if (errs.length > 0) {
        setErrorMsg(errs[0]);
        return;
      }
    } else if (currentStep === 2) {
      const errs = validateStep2();
      if (errs.length > 0) {
        setErrorMsg(errs[0]);
        return;
      }
    } else if (currentStep === 3) {
      const errs = validateStep3();
      if (errs.length > 0) {
        setErrorMsg(errs[0]);
        return;
      }
    } else if (currentStep === 4) {
      const errs = validateStep4();
      if (errs.length > 0) {
        setErrorMsg(errs[0]);
        return;
      }

      // Requirement 3: Save ALL registration data in users table against UID before payment step
      const activeUser = currentUser || getCurrentUser();
      let activeUid = activeUser?.uid;
      if (!activeUid) {
        activeUid = `student_${Date.now()}`;
        const guestUser = {
          uid: activeUid,
          name: formData.personal.studentName,
          email: formData.personal.email,
          phone: formData.personal.mobile,
          provider: 'local',
        };
        setCurrentUser(guestUser);
        localStorage.setItem('cerebral_auth_user', JSON.stringify(guestUser));
      }

      saveUserRegistration({
        uid: activeUid,
        name: formData.personal.studentName,
        email: formData.personal.email,
        phone: formData.personal.mobile,
        ...formData,
      }).then((savedRes) => {
        if (savedRes && savedRes.user) {
          setUserRecord(savedRes.user);
        }
      }).catch((e) => {
        console.warn('Error saving registration to users table:', e);
      });
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Navigation tab click protection
  const handleStepClick = (targetStep) => {
    if (targetStep === currentStep) return;

    if (targetStep > currentStep) {
      // Validate step 1 if trying to jump
      if (currentStep === 1 || targetStep > 1) {
        const errs1 = validateStep1();
        if (errs1.length > 0) {
          setErrorMsg('Please fill all required details in Step 1 before navigating forward.');
          return;
        }
      }
      if (targetStep > 2) {
        const errs2 = validateStep2();
        if (errs2.length > 0) {
          setErrorMsg('Please complete Step 2 academic details first.');
          return;
        }
      }
    }

    setErrorMsg('');
    setCurrentStep(targetStep);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Document Upload
  const [uploadingDocIdx, setUploadingDocIdx] = useState(null);

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingDocIdx(index);
    try {
      const res = await uploadDocumentApi(file);
      const updatedDocs = [...formData.documents];
      updatedDocs[index] = {
        ...updatedDocs[index],
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        status: 'Uploaded & Vaulted ✓',
        fileUrl: res.file?.url,
      };
      setFormData({ ...formData, documents: updatedDocs });
    } catch {
      // fallback
    } finally {
      setUploadingDocIdx(null);
    }
  };

  const handleRemoveDoc = (index) => {
    const updatedDocs = [...formData.documents];
    updatedDocs[index] = {
      ...updatedDocs[index],
      name: '',
      size: '',
      status: updatedDocs[index].required ? 'Not uploaded' : 'Optional',
    };
    setFormData({ ...formData, documents: updatedDocs });
  };


  // Server-Verified 2-Installment Payment Handler
  const handlePayInstallment = async (instNum = 1) => {
    setErrorMsg('');
    setSubmitting(true);
    setPayingInstallmentNum(instNum);

    const activeUser = currentUser || getCurrentUser();
    let activeUid = activeUser?.uid;
    if (!activeUid) {
      activeUid = `student_${Date.now()}`;
      const guestUser = {
        uid: activeUid,
        name: formData.personal.studentName || 'Applicant',
        email: formData.personal.email || '',
        phone: formData.personal.mobile || '',
        provider: 'local',
      };
      setCurrentUser(guestUser);
      localStorage.setItem('cerebral_auth_user', JSON.stringify(guestUser));
    }

    try {
      // 1. Save all candidate dossier data to users table against their UID (Requirement 3)
      const saveRes = await saveUserRegistration({
        uid: activeUid,
        name: formData.personal.studentName,
        email: formData.personal.email,
        phone: formData.personal.mobile,
        ...formData,
      });

      if (saveRes?.user) {
        setUserRecord(saveRes.user);
      }

      // 2. Request backend to create Razorpay Order for this specific installment
      // Security: Backend calculates amount strictly on server from the users table (Requirement 6)
      const orderRes = await createPaymentOrderApi(activeUid, instNum);
      if (!orderRes.success) {
        throw new Error(orderRes.error || `Failed to create payment order for Installment ${instNum}`);
      }

      // 3. Ensure Razorpay script is loaded
      const ensureRazorpayScript = () => {
        return new Promise((resolve, reject) => {
          if (typeof window !== 'undefined' && window.Razorpay) return resolve(true);
          const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
          if (existing) {
            existing.onload = () => resolve(true);
            existing.onerror = () => reject(new Error('Razorpay script failed to load.'));
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => reject(new Error('Unable to connect to Razorpay Payment Gateway. Check internet connection.'));
          document.body.appendChild(script);
        });
      };
      await ensureRazorpayScript();

      // 4. Launch Razorpay popup
      const launchRazorpayPopup = () => {
        return new Promise((resolve, reject) => {
          const options = {
            key: orderRes.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || '',
            order_id: orderRes.orderId && !orderRes.orderId.startsWith('order_cc_') ? orderRes.orderId : undefined,
            amount: Math.round(Number(orderRes.amount) * 100),
            currency: 'INR',
            name: 'Cerebral Compass Pvt Ltd',
            description: `Installment ${instNum} (${instNum === 1 ? '35% Advance Registration' : '65% Remaining Balance'}) — ${formData.personal.studentName}`,
            image: '/logo.png',
            handler: function (response) {
              if (!response || !response.razorpay_payment_id) {
                reject(new Error('Transaction could not be verified by bank.'));
                return;
              }
              resolve({
                success: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id || orderRes.orderId,
                signature: response.razorpay_signature || '',
              });
            },
            prefill: {
              name: formData.personal.studentName,
              email: formData.personal.email,
              contact: formData.personal.mobile ? (formData.personal.mobile.startsWith('+91') ? formData.personal.mobile : `+91${formData.personal.mobile}`) : '',
            },
            notes: {
              uid: activeUid,
              installmentNumber: instNum,
              student_name: formData.personal.studentName,
            },
            theme: { color: '#2b7ea4' },
            modal: {
              backdropclose: false,
              escape: false,
              handleback: true,
              ondismiss: function () {
                reject(new Error('Payment window closed. No money was deducted.'));
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (resp) {
            console.error('Razorpay payment failed:', resp.error);
            const errDescription = resp.error?.description || resp.error?.reason || 'Transaction declined by bank.';
            reject(new Error(`Bank Payment Failed: ${errDescription}`));
          });
          rzp.open();
        });
      };

      const paymentResult = await launchRazorpayPopup();

      // 5. Verify payment with server and record in separate payments table (Requirement 6)
      const verifyRes = await verifyPaymentApi({
        uid: activeUid,
        orderId: paymentResult.orderId,
        paymentId: paymentResult.paymentId,
        signature: paymentResult.signature,
        installmentNumber: instNum,
      });

      if (!verifyRes.success) {
        throw new Error(verifyRes.error || 'Server signature verification failed.');
      }

      setUserRecord(verifyRes.user);

      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#2b7ea4', '#38bdf8', '#e0533c', '#10b981'],
      });

      const receiptRecord = {
        id: activeUid,
        personal: formData.personal,
        academic: formData.academic,
        transactionId: paymentResult.paymentId,
        paidAmount: `₹${Number(orderRes.amount).toLocaleString('en-IN')}`,
        installmentNumber: instNum,
        submittedAt: new Date().toISOString(),
      };
      setSubmittedData(receiptRecord);

      if (onApplicationSuccess) {
        onApplicationSuccess(activeUid);
      }
    } catch (err) {
      console.warn('Payment failed:', err);
      setErrorMsg(err.message || 'Payment processing error.');
    } finally {
      setSubmitting(false);
    }
  };

  // Razorpay Checkout Execution (Standard Form Action for Step 5)
  const handleRazorpayPaymentAndSubmit = async () => {
    setErrorMsg('');
    if (!formData.accuracyConfirmed || !formData.termsAccepted) {
      setErrorMsg('Please check both declaration boxes to confirm accuracy and accept terms.');
      return;
    }
    await handlePayInstallment(1);
  };




  const stepLabels = [
    { num: 1, title: 'Personal Details', icon: User },
    { num: 2, title: 'Academic Details', icon: GraduationCap },
    { num: 3, title: 'Preferences', icon: Sliders },
    { num: 4, title: 'Document Upload', icon: UploadCloud },
    { num: 5, title: 'Review & Payment', icon: CreditCard },
  ];

  // =========================================================================
  // SUCCESS RECEIPT VIEW (AFTER PAYMENT & SUBMISSION)
  // =========================================================================
  if (submittedData) {
    return (
      <div className="pt-28 pb-24 light-mesh-bg text-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-sky-100 shadow-2xl space-y-8 animate-fadeIn text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
                Razorpay Payment Verified & Captured
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
                Application Successfully Registered!
              </h1>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Your admission dossier has been securely recorded and verified. Senior counsellor allocation is now complete.
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Application Reference ID</span>
                  <span className="text-brand-700 font-bold text-base">{submittedData.id || 'CC-0126'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Razorpay Payment ID</span>
                  <span className="text-emerald-700 font-bold">{submittedData.transactionId || 'pay_verified'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Applicant Name</span>
                  <strong className="text-slate-900 text-sm">{submittedData.personal?.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Aadhaar Status</span>
                  <strong className="text-emerald-700 text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> UIDAI Verified ✓
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Calling Contact</span>
                  <span className="text-slate-800 font-bold">+91 {submittedData.personal?.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Target Course</span>
                  <span className="text-brand-700 font-bold">{submittedData.academic?.courseInterested}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 font-mono space-y-1.5 text-xs">
                {submittedData.basePackagePrice && (
                  <div className="flex justify-between text-slate-600">
                    <span>Package price:</span>
                    <span className="font-semibold text-slate-900">{submittedData.basePackagePrice}</span>
                  </div>
                )}
                {submittedData.gstAmount && (
                  <div className="flex justify-between text-slate-600">
                    <span>GST 18%:</span>
                    <span className="font-semibold text-coral-600">+{submittedData.gstAmount}</span>
                  </div>
                )}
                <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-800 font-bold">Total Fee Paid via Razorpay:</span>
                  <span className="font-bold text-emerald-700 text-sm">{submittedData.paidAmount}</span>
                </div>
              </div>
            </div>

            {/* Notification alert banner */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-left text-xs text-blue-900 flex items-start gap-2.5">
              <span className="text-base">📧</span>
              <div>
                <strong>Official Invoice Dispatched:</strong> Full text invoice summary and company's <strong>Legal Terms & Conditions PDF</strong> have been sent to{' '}
                <span className="font-mono font-bold underline">{submittedData.personal?.email || 'thecerebralcompass@gmail.com'}</span>.
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Receipt</span>
              </button>

              <a
                href={getWhatsAppInvoiceUrl(submittedData, '916204934005')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send Invoice via WhatsApp</span>
              </a>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('home')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors"
                >
                  Return to Home
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN MULTI-STEP FORM VIEW
  // =========================================================================
  return (
    <div className="pt-28 pb-24 light-mesh-bg text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-700 font-bold bg-sky-100 px-4 py-1.5 rounded-full border border-sky-200">
            Admissions 2026-27 Multi-Stage Dossier
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-slate-900">
            Counselling & Application Form
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Complete your comprehensive candidate profile with verified credentials. All records are encrypted and validated in real time.
          </p>
        </div>

        {/* CANDIDATE PRE-FORM AUTHENTICATION GATE / LOGIN PROMPT */}
        {!currentUser ? (
          <div className="mb-10 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-brand-900 via-sky-950 to-indigo-950 text-white shadow-2xl relative overflow-hidden border border-brand-400/30 animate-fadeIn">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/40 text-sky-200 text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  <span>Recommended Before Filling Form</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  Log In to Auto-Fill & Track Your Admission Dossier
                </h3>
                <p className="text-xs text-sky-200/90 leading-relaxed">
                  Sign in with your verified Google account to auto-populate your details, protect your choice preferences, and track your senior counsellor allocation in real time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M6.62 14.86c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.84H2.18C1.43 9.34 1 11.02 1 12.87s.43 3.53 1.18 5.03l4.44-3.04z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.84l4.44 3.04c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('auth')}
                  className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Email Login</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-white border border-sky-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-brand-500/20 shrink-0 overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (currentUser.name || 'C').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Applying as: <strong className="text-brand-700">{currentUser.name}</strong>
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Logged In Verified</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  {currentUser.email} • Details auto-synced with dossier
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('dashboard')}
                className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold text-xs transition-colors"
              >
                View My History 📋
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setCurrentUser(null);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 font-medium text-xs transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* RETURNING USER FLOW BANNERS & INSTANT ACTIONS (Requirement 4) */}
        {userRecord && (
          <div className="mb-8 space-y-4">
            {/* Condition 1: 35% paid & 65% locked */}
            {userRecord.installment1_status === 'paid' && userRecord.installment2_status === 'locked' && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-blue-50 border-2 border-brand-500 shadow-xl text-slate-800 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-300 text-brand-700 flex items-center justify-center shrink-0">
                      <Lock className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] uppercase font-bold mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 35% Advance Payment Received ✓
                      </div>
                      <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 leading-snug">
                        Your 35% payment is received. The remaining 65% ({userRecord.installment2_amount ? `Rs ${Number(userRecord.installment2_amount).toLocaleString('en-IN')}` : 'Rs ____'}) will open after counselling.
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Your saved registration has been loaded from the database. All fields below are pre-filled so you do not have to fill them again. Senior counsellor profile review is in progress.
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">
                      Stage: <strong className="text-brand-700">{userRecord.stage}</strong>
                    </span>
                    <button
                      disabled
                      title="Your 35% payment is received. The remaining 65% will open after counselling."
                      className="px-5 py-3 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed flex items-center gap-2 border border-slate-300 shadow-inner"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Pay 65% (Locked)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Condition 2: 35% paid & 65% pending (Requirement 4: 35% paid. Rs ____ (65%) is remaining with enabled Pay Now button) */}
            {userRecord.installment1_status === 'paid' && userRecord.installment2_status === 'pending' && (
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-orange-50 border-2 border-amber-400 shadow-2xl text-slate-800 space-y-4 animate-fadeIn ring-4 ring-amber-400/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] uppercase font-bold mb-1">
                        📢 Counselling Completed & Ready For Choice Locking
                      </div>
                      <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 leading-snug">
                        35% paid. {userRecord.installment2_amount ? `Rs ${Number(userRecord.installment2_amount).toLocaleString('en-IN')}` : 'Rs ____'} (65%) is remaining.
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Your senior counselling session has been completed by admin. Complete your remaining 65% payment to finalize official seat allocation without having to re-fill the form.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handlePayInstallment(2)}
                      disabled={submitting}
                      className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-coral-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-sm shadow-xl shadow-amber-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                    >
                      {submitting && payingInstallmentNum === 2 ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Connecting Gateway...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Now ({userRecord.installment2_amount ? `Rs ${Number(userRecord.installment2_amount).toLocaleString('en-IN')}` : '65%'})</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Condition 3: Both paid */}
            {userRecord.installment1_status === 'paid' && userRecord.installment2_status === 'paid' && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-2 border-emerald-500 shadow-xl text-slate-800 space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] uppercase font-bold mb-1">
                        ✓ 100% Comprehensive Mentorship Secured
                      </div>
                      <h3 className="text-xl font-display font-extrabold text-slate-900 leading-snug">
                        Payment complete
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Both installments have been settled in full. Your candidate registration and seat allotment tracking are active.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-slate-50 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Receipt Option</span>
                    </button>
                    <a
                      href={getWhatsAppInvoiceUrl(userRecord, '916204934005')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>WhatsApp Receipt</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Account / Login Status Banner */}
        {!currentUser && (
          <div className="mb-8 p-4 rounded-2xl bg-white border border-sky-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
              <span>
                <strong>Returning Candidate?</strong> Sign in with Google or Email to pre-fill your saved details and track your 35% / 65% installments.
              </span>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('auth')}
              className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold flex items-center gap-1.5 border border-brand-200 shrink-0 self-start sm:self-auto transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          </div>
        )}

        {/* Step Progress Tracker */}
        <div className="mb-10 p-4 sm:p-6 rounded-2xl bg-white border border-sky-100 shadow-sm">
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {stepLabels.map((st) => {
              const Icon = st.icon;
              const isCurrent = currentStep === st.num;
              const isPast = currentStep > st.num;
              return (
                <div
                  key={st.num}
                  onClick={() => handleStepClick(st.num)}
                  className={`flex flex-col items-center text-center cursor-pointer transition-all ${
                    isCurrent
                      ? 'text-brand-700 scale-105'
                      : isPast
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all mb-2 ${
                      isCurrent
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : isPast
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-semibold hidden sm:block">
                    {st.title}
                  </span>
                  <span className="text-[9px] font-mono sm:hidden">
                    Step {st.num}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM CONTAINER */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-sky-100 shadow-xl">
          {/* =========================================================================
              STEP 1: PERSONAL DETAILS & AADHAAR VERIFICATION
             ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-600" />
                  Step 1 — Candidate & Identity Details
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  All fields marked with (*) must be completed with 10-digit mobile numbers, valid email, and 12-digit Aadhaar to proceed to Step 2.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. Student Name */}
                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    placeholder="e.g. Arjun Sharma"
                    value={formData.personal.studentName}
                    onChange={handleStudentNameChange}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-colors ${
                      touchedFields.studentName && (!formData.personal.studentName || formData.personal.studentName.trim().length < 3)
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-brand-500'
                    }`}
                    required
                  />
                  {formData.personal.studentName.length > 0 && formData.personal.studentName.trim().length < 3 && (
                    <span className="text-[11px] text-rose-500 mt-1 block">Minimum 3 alphabetic characters required.</span>
                  )}
                </div>

                {/* 2. Parent Name */}
                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.personal.parentName}
                    onChange={handleParentNameChange}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-colors ${
                      touchedFields.parentName && (!formData.personal.parentName || formData.personal.parentName.trim().length < 3)
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-brand-500'
                    }`}
                    required
                  />
                </div>

                {/* 3. Date of Birth */}
                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.personal.dob}
                    onChange={handlePersonalChange}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-colors ${
                      touchedFields.dob && !formData.personal.dob
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-brand-500'
                    }`}
                    required
                  />
                </div>

                {/* 4. Mobile Number (Strict 10 digits) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono text-slate-700 font-semibold">
                      Mobile Number (Calling) *
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      {formData.personal.mobile.length}/10 digits
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-semibold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      maxLength={10}
                      placeholder="9876543210"
                      value={formData.personal.mobile}
                      onChange={handleMobileChange}
                      className={`w-full pl-12 pr-10 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none font-mono transition-colors ${
                        touchedFields.mobile && !isValidPhone(formData.personal.mobile)
                          ? 'border-rose-400 focus:border-rose-500'
                          : isValidPhone(formData.personal.mobile)
                          ? 'border-emerald-300 focus:border-emerald-500'
                          : 'border-slate-200 focus:border-brand-500'
                      }`}
                      required
                    />
                    {isValidPhone(formData.personal.mobile) && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {formData.personal.mobile.length > 0 && !isValidPhone(formData.personal.mobile) && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      Must be 10 digits starting with 6, 7, 8, or 9.
                    </span>
                  )}
                </div>

                {/* 5. WhatsApp Number (Strict 10 digits) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono text-slate-700 font-semibold">
                      WhatsApp Number (For Alerts) *
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={copyMobileToWhatsapp}
                        className="text-[10px] font-mono text-brand-600 hover:text-brand-800 underline"
                      >
                        Same as calling
                      </button>
                      <span className="text-[10px] font-mono text-slate-400">
                        {formData.personal.whatsapp.length}/10 digits
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-semibold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="whatsapp"
                      maxLength={10}
                      placeholder="9876543210"
                      value={formData.personal.whatsapp}
                      onChange={handleWhatsappChange}
                      className={`w-full pl-12 pr-10 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none font-mono transition-colors ${
                        touchedFields.whatsapp && !isValidPhone(formData.personal.whatsapp)
                          ? 'border-rose-400 focus:border-rose-500'
                          : isValidPhone(formData.personal.whatsapp)
                          ? 'border-emerald-300 focus:border-emerald-500'
                          : 'border-slate-200 focus:border-brand-500'
                      }`}
                      required
                    />
                    {isValidPhone(formData.personal.whatsapp) && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {formData.personal.whatsapp.length > 0 && !isValidPhone(formData.personal.whatsapp) && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      Must be 10 digits starting with 6, 7, 8, or 9.
                    </span>
                  )}
                </div>

                {/* 6. Email Address */}
                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="student@example.com"
                      value={formData.personal.email}
                      onChange={handleEmailChange}
                      className={`w-full px-4 pr-10 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-colors ${
                        touchedFields.email && !isValidEmail(formData.personal.email)
                          ? 'border-rose-400 focus:border-rose-500'
                          : isValidEmail(formData.personal.email)
                          ? 'border-emerald-300 focus:border-emerald-500'
                          : 'border-slate-200 focus:border-brand-500'
                      }`}
                      required
                    />
                    {isValidEmail(formData.personal.email) && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {formData.personal.email.length > 0 && !isValidEmail(formData.personal.email) && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      Please enter a valid email format (e.g. name@gmail.com).
                    </span>
                  )}
                </div>

                {/* 7. Aadhaar Number (12 Digits) */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Aadhaar Number (12 Digits) *
                  </label>
                  <input
                    type="text"
                    name="aadhaar"
                    maxLength={14} // 12 digits + 2 spaces
                    placeholder="5482 1928 3401"
                    value={formData.personal.aadhaar}
                    onChange={handleAadhaarChange}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 font-mono tracking-widest focus:outline-none transition-colors ${
                      touchedFields.aadhaar && !isValidAadhaar(formData.personal.aadhaar)
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-brand-500'
                    }`}
                    required
                  />
                  {formData.personal.aadhaar.length > 0 && !isValidAadhaar(formData.personal.aadhaar) && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      Aadhaar must be exactly 12 numeric digits (e.g. 5482 1928 3401).
                    </span>
                  )}
                </div>

                {/* 8. Address & State of Domicile */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Residential Address & State of Domicile *
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    placeholder="Enter full residential address with PIN code (used for state quota eligibility check)"
                    value={formData.personal.address}
                    onChange={handlePersonalChange}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-sm text-slate-900 focus:outline-none transition-colors ${
                      touchedFields.address && (!formData.personal.address || formData.personal.address.trim().length < 5)
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-brand-500'
                    }`}
                    required
                  />
                  {formData.personal.address.length > 0 && formData.personal.address.trim().length < 5 && (
                    <span className="text-[11px] text-rose-500 mt-1 block">
                      Please enter a complete address with PIN code (min 5 characters).
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: ACADEMIC DETAILS
             ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-600" />
                  Step 2 — Academic Performance & Exam Metrics
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Accurate scores enable us to run historical predictive algorithms across 5-year closing ranks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Course Interested In *
                  </label>
                  <select
                    name="courseInterested"
                    value={formData.academic.courseInterested}
                    onChange={handleAcademicChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="MBBS">MBBS / Medical Sciences</option>
                    <option value="BTECH">B.Tech / Engineering</option>
                    <option value="MBA">MBA / Management</option>
                    <option value="UG_PG">UG / PG Multidisciplinary (CUET/Law)</option>
                    <option value="ABROAD">Study Abroad (Global Admissions)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Entrance Exam Taken / Appearing *
                  </label>
                  <select
                    name="entranceExam"
                    value={formData.academic.entranceExam}
                    onChange={handleAcademicChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="NEET UG">NEET UG 2026/27</option>
                    <option value="JEE Main">JEE Main / JEE Advanced</option>
                    <option value="CAT / XAT">CAT / XAT / SNAP / GMAT</option>
                    <option value="CUET">CUET UG / PG</option>
                    <option value="BITSAT / COMEDK">BITSAT / COMEDK / State CET</option>
                    <option value="IELTS / TOEFL">IELTS / TOEFL / GRE</option>
                    <option value="Other">Other / Direct Merit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Expected / Actual Rank or Score *
                  </label>
                  <input
                    type="text"
                    name="rankScore"
                    placeholder="e.g. NEET Score 590 or AIR 32,400 / Appearing"
                    value={formData.academic.rankScore}
                    onChange={handleAcademicChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Reservation Category *
                  </label>
                  <select
                    name="category"
                    value={formData.academic.category}
                    onChange={handleAcademicChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="General / UR">General / Unreserved (UR)</option>
                    <option value="OBC-NCL">OBC - Non Creamy Layer</option>
                    <option value="EWS">Economically Weaker Section (EWS)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="NRI / Management">NRI / Foreign National / OCI</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    10th Board & Percentage *
                  </label>
                  <input
                    type="text"
                    name="tenthDetails"
                    placeholder="e.g. 91% (CBSE)"
                    value={formData.academic.tenthDetails}
                    onChange={handleAcademicChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    12th Board & Stream Marks *
                  </label>
                  <input
                    type="text"
                    name="twelfthDetails"
                    placeholder="e.g. 88% (PCB) or Appearing"
                    value={formData.academic.twelfthDetails}
                    onChange={handleAcademicChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Preferred State / City Locations
                  </label>
                  <input
                    type="text"
                    name="preferredStateCity"
                    placeholder="e.g. Karnataka, Maharashtra, Delhi NCR, or Any"
                    value={formData.academic.preferredStateCity}
                    onChange={handleAcademicChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Approximate Tuition Budget Frame *
                  </label>
                  <select
                    name="approximateBudget"
                    value={formData.academic.approximateBudget}
                    onChange={handleAcademicChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Under ₹5 Lakhs">Under ₹5 Lakhs (Govt / Merit Quota)</option>
                    <option value="₹5L - ₹15L">₹5 Lakhs – ₹15 Lakhs</option>
                    <option value="₹15L - ₹35L">₹15 Lakhs – ₹35 Lakhs (Private / Deemed)</option>
                    <option value="₹40L - ₹80L">₹40 Lakhs – ₹80 Lakhs (NRI / Premium)</option>
                    <option value="Above ₹80L">Above ₹80 Lakhs</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: PREFERENCES
             ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-brand-600" />
                  Step 3 — Aspirations & Logistic Preferences
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Specify campus housing needs, target institutions, and education loan requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Location Geography *
                  </label>
                  <select
                    name="countryPreference"
                    value={formData.preferences.countryPreference}
                    onChange={handlePreferencesChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="India Only">Pan-India Colleges Only</option>
                    <option value="Abroad Only">Study Abroad (International)</option>
                    <option value="Both India & Abroad">Open to both India & Abroad</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Hostel & Accommodation Need *
                  </label>
                  <select
                    name="hostelRequirement"
                    value={formData.preferences.hostelRequirement}
                    onChange={handlePreferencesChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Yes, Required">Yes, College Hostel Required</option>
                    <option value="No, Day Scholar">No, Local Resident / Day Scholar</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Education Loan Assistance Required? *
                  </label>
                  <select
                    name="educationLoanRequirement"
                    value={formData.preferences.educationLoanRequirement}
                    onChange={handlePreferencesChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Yes, Required">Yes, Need Bank / NBFC Loan Support</option>
                    <option value="Self Funded">Self-Funded by Family</option>
                    <option value="Seeking Scholarships">Seeking Merit Scholarships Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Desired Branch / Specialization
                  </label>
                  <input
                    type="text"
                    name="courseSpecialization"
                    placeholder="e.g. Clinical Surgery / CS AI / FinTech"
                    value={formData.preferences.courseSpecialization}
                    onChange={handlePreferencesChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                    Specific Preferred Colleges (if any)
                  </label>
                  <textarea
                    rows={2}
                    name="preferredColleges"
                    placeholder="e.g. KMC Manipal, Amrita Kochi, DY Patil Pune, or Top Tier-2 NITs"
                    value={formData.preferences.preferredColleges}
                    onChange={handlePreferencesChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 4: DOCUMENT UPLOAD
             ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                      <UploadCloud className="w-5 h-5 text-brand-600" />
                      Step 4 — Secure Document Vault
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload scanned PDFs or images. Mandatory documents must be attached before proceeding.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>256-Bit Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {formData.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-700 shrink-0 shadow-sm">
                        <FileText className="w-5 h-5 text-brand-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-sm text-slate-900">
                            {doc.type}
                          </h4>
                          {doc.required && (
                            <span className="text-[10px] font-mono text-coral-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 font-bold">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {doc.name ? (
                            <span className="text-emerald-600 font-mono font-semibold">
                              {doc.name} ({doc.size})
                            </span>
                          ) : (
                            'PDF, JPG, PNG up to 15MB'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {doc.name ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Vaulted
                          </span>
                          <button
                            onClick={() => handleRemoveDoc(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-coral-500 hover:bg-slate-200"
                            title="Remove Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all shadow-sm">
                          {uploadingDocIdx === idx ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                              <span>Vaulting...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5 text-brand-600" />
                              <span>Select File</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFileUpload(idx, e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 5: REVIEW, AADHAAR CHECK, & RAZORPAY PAYMENT GATEWAY
             ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  Step 5 — Final Dossier Review & Razorpay Payment
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Inspect your summary and complete official application processing via secure Razorpay checkout.
                </p>
              </div>

              {/* Review summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-brand-700 font-mono font-bold pb-2 border-b border-slate-200">
                    <span>1. CANDIDATE & IDENTITY</span>
                    <button onClick={() => setCurrentStep(1)} className="hover:underline text-brand-600">
                      Edit
                    </button>
                  </div>
                  <p><strong className="text-slate-500">Student:</strong> {formData.personal.studentName}</p>
                  <p><strong className="text-slate-500">Guardian:</strong> {formData.personal.parentName || 'N/A'}</p>
                  <p><strong className="text-slate-500">Calling Mobile:</strong> +91 {formData.personal.mobile}</p>
                  <p><strong className="text-slate-500">WhatsApp:</strong> +91 {formData.personal.whatsapp}</p>
                  <p><strong className="text-slate-500">Email:</strong> {formData.personal.email}</p>
                  <p><strong className="text-slate-500">Aadhaar:</strong> {formData.personal.aadhaar}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-brand-700 font-mono font-bold pb-2 border-b border-slate-200">
                    <span>2. ACADEMIC & RANK</span>
                    <button onClick={() => setCurrentStep(2)} className="hover:underline text-brand-600">
                      Edit
                    </button>
                  </div>
                  <p><strong className="text-slate-500">Target Course:</strong> {formData.academic.courseInterested}</p>
                  <p><strong className="text-slate-500">Exam:</strong> {formData.academic.entranceExam}</p>
                  <p><strong className="text-slate-500">Score / Rank:</strong> {formData.academic.rankScore}</p>
                  <p><strong className="text-slate-500">Category:</strong> {formData.academic.category}</p>
                  <p><strong className="text-slate-500">Budget:</strong> {formData.academic.approximateBudget}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-brand-700 font-mono font-bold pb-2 border-b border-slate-200">
                    <span>3. PREFERENCES</span>
                    <button onClick={() => setCurrentStep(3)} className="hover:underline text-brand-600">
                      Edit
                    </button>
                  </div>
                  <p><strong className="text-slate-500">Country:</strong> {formData.preferences.countryPreference}</p>
                  <p><strong className="text-slate-500">Hostel:</strong> {formData.preferences.hostelRequirement}</p>
                  <p><strong className="text-slate-500">Education Loan:</strong> {formData.preferences.educationLoanRequirement}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-brand-700 font-mono font-bold pb-2 border-b border-slate-200">
                    <span>4. CERTIFICATES</span>
                    <button onClick={() => setCurrentStep(4)} className="hover:underline text-brand-600">
                      Edit
                    </button>
                  </div>
                  <p>
                    <strong className="text-slate-500">Files Vaulted:</strong>{' '}
                    {formData.documents.filter((d) => d.name).length} of{' '}
                    {formData.documents.length} certificates
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    Document validation completed.
                  </p>
                </div>
              </div>

              {/* Fee Selection Toggle (When a Package is selected) */}
              {packageGstInfo && (
                <div className="space-y-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block">
                    Select Payment Tier for {formData.packageSelected}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Option 1: Full Package Fee */}
                    <div
                      onClick={() => {
                        setSelectedFee(packageGstInfo.totalPayable);
                        setFeeOption('package');
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        feeOption === 'package'
                          ? 'border-brand-600 bg-sky-50/60 shadow-md ring-2 ring-brand-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-700">
                          Complete Package Fee
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          feeOption === 'package' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                        }`}>
                          {feeOption === 'package' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="mt-2 text-2xl font-display font-black text-slate-900">
                        {packageGstInfo.formattedTotal}{' '}
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          Incl. 18% GST
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                        Full round-by-round personalized strategy, predictive closing ranks, and direct counsellor access.
                      </p>
                    </div>

                    {/* Option 2: Token Dossier Fee */}
                    <div
                      onClick={() => {
                        setSelectedFee(tokenGst ? tokenGst.totalPayable : 1178.82);
                        setFeeOption('dossier');
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        feeOption === 'dossier'
                          ? 'border-brand-600 bg-sky-50/60 shadow-md ring-2 ring-brand-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                          Provisional Dossier Token
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          feeOption === 'dossier' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'
                        }`}>
                          {feeOption === 'dossier' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="mt-2 text-2xl font-display font-black text-slate-900">
                        {tokenGst ? tokenGst.formattedTotal : '₹1,178.82'}{' '}
                        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Token (Incl. 18% GST)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                        Document pre-screening & slot reservation. Remaining package fee balance payable during choice locking.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Razorpay Payment Box with Itemized 2-Installment (35% / 65%) GST Breakdown Table */}
              {(() => {
                const totalFeeNum = userRecord?.total_fee || (packageGstInfo ? packageGstInfo.totalPayable : 82599);
                const inst1AmountNum = userRecord?.installment1_amount || Math.round(totalFeeNum * 0.35);
                const inst2AmountNum = userRecord?.installment2_amount || (totalFeeNum - inst1AmountNum);
                const inst1Status = userRecord?.installment1_status || 'pending';
                const inst2Status = userRecord?.installment2_status || 'locked';

                const isPayingInst2 = inst1Status === 'paid' && inst2Status === 'pending';
                const currentDueAmount = isPayingInst2 ? inst2AmountNum : inst1AmountNum;

                return (
                  <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-brand-950 text-white shadow-xl space-y-6 border border-sky-800/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-sky-400" />
                          <span className="font-mono text-xs uppercase tracking-wider text-sky-300 font-bold">
                            Official Razorpay Payment Gateway
                          </span>
                        </div>
                        <h3 className="font-display font-extrabold text-xl text-white mt-1">
                          {formData.packageSelected || 'Counselling Advisory Package'}
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Total Approved Package Fee: <strong className="text-white">₹{totalFeeNum.toLocaleString('en-IN')}</strong> (18% GST Included)
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs font-mono text-slate-300 block">
                          {inst1Status === 'paid' && inst2Status === 'paid'
                            ? 'Ledger Cleared'
                            : isPayingInst2
                            ? 'Installment 2 Due (65%)'
                            : 'Installment 1 Payable Now (35%)'}
                        </span>
                        <span className="text-3xl font-display font-black text-emerald-400">
                          {inst1Status === 'paid' && inst2Status === 'paid'
                            ? '100% Paid ✓'
                            : `₹${currentDueAmount.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                    </div>

                    {/* 2-Installment Visual Roadmap Cards (35% & 65%) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Installment 1 Card */}
                      <div className={`p-4 rounded-2xl border ${
                        inst1Status === 'paid'
                          ? 'bg-emerald-950/40 border-emerald-500/60'
                          : 'bg-white/5 border-sky-400/40 ring-2 ring-sky-400/20'
                      }`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-mono uppercase font-bold text-sky-200">
                            Installment 1 of 2 (35%)
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            inst1Status === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-sky-400/20 text-sky-300 border border-sky-400/30'
                          }`}>
                            {inst1Status === 'paid' ? 'Paid ✓' : 'Payable Now'}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-white font-display">
                          ₹{inst1AmountNum.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Advance dossier vetting, category rank predictive modeling, and senior counsellor allocation.
                        </p>
                      </div>

                      {/* Installment 2 Card */}
                      <div className={`p-4 rounded-2xl border ${
                        inst2Status === 'paid'
                          ? 'bg-emerald-950/40 border-emerald-500/60'
                          : inst2Status === 'pending'
                          ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-white/5 border-white/10 opacity-75'
                      }`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-mono uppercase font-bold text-slate-300">
                            Installment 2 of 2 (65%)
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                            inst2Status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : inst2Status === 'pending'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                          }`}>
                            {inst2Status === 'paid' ? 'Paid ✓' : inst2Status === 'pending' ? 'Pending (Open)' : 'Locked'}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-white font-display">
                          ₹{inst2AmountNum.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          {inst2Status === 'locked'
                            ? 'Opens after senior counselling session is completed by admin.'
                            : 'Unpinned by admin. Final choice preference locking sheet and allotment support.'}
                        </p>
                      </div>
                    </div>

                    {/* Official Itemized GST Breakdown Table */}
                    <div className="bg-slate-950/80 border border-sky-800/60 rounded-2xl p-4 font-mono text-xs space-y-2 shadow-inner">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-sky-300 font-bold uppercase text-[11px] tracking-wider">
                        <span>Payment Milestone</span>
                        <span>Amount</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Total Package (Incl. 18% GST)</span>
                        <span className="font-semibold text-white">₹{totalFeeNum.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Installment 1 Advance (35%)</span>
                        <span className={`font-semibold ${inst1Status === 'paid' ? 'text-emerald-400' : 'text-sky-300'}`}>
                          ₹{inst1AmountNum.toLocaleString('en-IN')} {inst1Status === 'paid' ? '(Paid ✓)' : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Installment 2 Remaining (65%)</span>
                        <span className={`font-semibold ${inst2Status === 'paid' ? 'text-emerald-400' : inst2Status === 'pending' ? 'text-amber-400' : 'text-slate-400'}`}>
                          ₹{inst2AmountNum.toLocaleString('en-IN')} {inst2Status === 'locked' ? '(Locked)' : inst2Status === 'paid' ? '(Paid ✓)' : '(Due Now)'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Instant Payment Confirmation via SMS & WhatsApp</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Supports UPI, NetBanking (50+ Banks) & Cards</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-sky-400 shrink-0" />
                        <span>256-Bit SSL Encrypted by Razorpay Gateway</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Legally Compliant GST Tax Invoice Dispatched</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Declarations Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accuracyConfirmed}
                    onChange={(e) => setFormData({ ...formData, accuracyConfirmed: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs text-slate-600">
                    I solemnly declare that all personal and academic records provided herein are true, authentic, and accurate to the best of my knowledge.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs text-slate-600">
                    I accept the{' '}
                    <span className="text-brand-600 underline font-semibold">Terms & Conditions</span>,{' '}
                    <span className="text-brand-600 underline font-semibold">Privacy Policy</span>, and understand that seat allocation is strictly determined by official regulatory counselling authorities (MCC, JoSAA, NBE, State DME).
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                onClick={handleNextStep}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {(() => {
                  const inst1Paid = userRecord?.installment1_status === 'paid';
                  const inst2Pending = userRecord?.installment2_status === 'pending';
                  const inst2Paid = userRecord?.installment2_status === 'paid';

                  return inst1Paid && !inst2Pending && !inst2Paid ? (
                    <button
                      disabled
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2 border border-slate-300"
                    >
                      <Lock className="w-4 h-4" />
                      <span>35% Paid (65% Opens After Counselling)</span>
                    </button>
                  ) : inst2Paid ? (
                    <button
                      disabled
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm cursor-default flex items-center justify-center gap-2 border border-emerald-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Payment Complete (100% Paid ✓)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleRazorpayPaymentAndSubmit}
                      disabled={submitting}
                      className={`w-full sm:w-auto px-7 py-3.5 rounded-xl text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                        submitting
                          ? 'bg-slate-400 cursor-not-allowed opacity-75'
                          : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 shadow-emerald-600/30 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing Razorpay Checkout...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>
                            {isPayingInst2
                              ? `Pay Remaining 65% (₹${inst2AmountNum.toLocaleString('en-IN')}) with Razorpay`
                              : `Pay 35% Advance (₹${inst1AmountNum.toLocaleString('en-IN')}) with Razorpay`}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Institutional Accreditations, Legal Compliance & Certificates */}
      <InstitutionalCertificatesSection />
    </div>
  );
}
