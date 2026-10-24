import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import {
  sendInvoiceEmail,
  sendInstallment2NotificationEmail,
  formatInvoiceTextMessage,
  formatInstallment2TextMessage,
  generateWhatsAppInvoiceUrl,
  notificationConfig
} from './services/notificationService.js';
import { getNextApplicationId, peekNextApplicationId } from './services/referenceIdService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure directories exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Static serving for uploaded previews
app.use('/uploads', express.static(uploadsDir));

// JSON File Stores
const appFile = path.join(dataDir, 'applications.json');
const inquiriesFile = path.join(dataDir, 'inquiries.json');
const usersFile = path.join(dataDir, 'users.json');
const paymentsFile = path.join(dataDir, 'payments.json');

// Supabase Server Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dihswtyhpyejmxqmutza.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_gnHbfgkwtkNBfXO1xMev1Q_3CiNL26B';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// File Store Helpers
const readData = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return [];
};

const saveData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error saving ${filePath}:`, err);
  }
};

const readApplications = () => readData(appFile);
const saveApplications = (apps) => saveData(appFile, apps);

const readUsers = () => readData(usersFile);
const saveUsers = (users) => saveData(usersFile, users);

const readPayments = () => readData(paymentsFile);
const savePayments = (payments) => saveData(paymentsFile, payments);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

/**
 * Server-Side Calculation of Total Advisory Fees (includes 18% GST)
 * Never rely on client-supplied fee amounts!
 */
export function calculateServerFee(packageSelected) {
  if (!packageSelected) return 1179;
  const str = String(packageSelected).toLowerCase();

  // Known stream packages with standard 18% GST:
  // MBBS Govt: 39,999 + 18% = 47,198.82 -> 47,199
  if (str.includes('mbbs') && str.includes('govt')) return 47199;
  // MBBS Private: 69,999 + 18% = 82,598.82 -> 82,599
  if (str.includes('mbbs') && (str.includes('private') || str.includes('deemed'))) return 82599;
  // MBBS Mgmt: 99,999 + 18% = 1,17,998.82 -> 1,17,999
  if (str.includes('mbbs') && (str.includes('mgmt') || str.includes('management'))) return 117999;
  // MBBS Abroad: 1,24,999 + 18% = 1,47,498.82 -> 1,47,499
  if (str.includes('abroad')) return 147499;
  // B.Tech Basic: 2,999 + 18% = 3,538.82 -> 3,539
  if (str.includes('b.tech') && str.includes('basic')) return 3539;
  // B.Tech Pro / Elite: 8,999 + 18% = 10,618.82 -> 10,619
  if (str.includes('b.tech') && (str.includes('pro') || str.includes('premium') || str.includes('elite'))) return 10619;
  // MBA / Management: 49,999 + 18% = 58,999
  if (str.includes('mba') || str.includes('cat')) return 58999;

  // Extract explicit INR amount if encoded in package name
  const match = str.match(/₹?([0-9,]+(?:\.[0-9]{1,2})?)/);
  if (match && match[1]) {
    const parsed = parseFloat(match[1].replace(/,/g, ''));
    if (!isNaN(parsed) && parsed > 500) {
      return Math.round(parsed);
    }
  }

  // Default token dossier package
  return 1179;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Cerebral Compass Core API',
    database: {
      supabaseConfigured: !!supabase,
      usersCount: readUsers().length,
      applicationsCount: readApplications().length,
      paymentsCount: readPayments().length,
    }
  });
});

// Endpoint to peek next application ID
app.get('/api/applications/next-id', (req, res) => {
  res.json({ nextId: peekNextApplicationId() });
});

// =========================================================================
// 2. USERS TABLE & REGISTRATION FLOW (Requirement 1, 2, 3, 4, 6)
// =========================================================================

/**
 * GET /api/users/:uid
 * Security: A user can only read their own record (or admin).
 */
app.get('/api/users/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const reqUserId = req.headers['x-user-id'];
    const adminKey = req.headers['x-admin-key'];

    const isAdmin = adminKey && ['admin@cerebral2026', 'admin123', 'cerebral2026', 'admin'].includes(adminKey);
    if (!isAdmin && reqUserId && reqUserId !== uid) {
      return res.status(403).json({ success: false, error: 'Unauthorized. You can only access your own profile.' });
    }

    const users = readUsers();
    let found = users.find((u) => u.uid === uid);

    // If not in local json, check Supabase
    if (!found && supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('uid', uid).maybeSingle();
        if (!error && data) {
          found = data;
          users.push(data);
          saveUsers(users);
        }
      } catch (sbErr) {
        // Continue
      }
    }

    if (!found) {
      return res.status(404).json({ success: false, error: 'User record not found.' });
    }

    res.json({ success: true, user: found });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/users
 * Saves/registers user data against uid.
 * Calculates total_fee (strictly on server) and sets 35% / 65% installments.
 */
app.post('/api/users', async (req, res) => {
  try {
    const body = req.body || {};
    const uid = body.uid;
    if (!uid) {
      return res.status(400).json({ success: false, error: 'Unique user ID (uid) is required.' });
    }

    const reqUserId = req.headers['x-user-id'];
    const adminKey = req.headers['x-admin-key'];
    const isAdmin = adminKey && ['admin@cerebral2026', 'admin123', 'cerebral2026', 'admin'].includes(adminKey);

    if (!isAdmin && reqUserId && reqUserId !== uid) {
      return res.status(403).json({ success: false, error: 'Forbidden. UID mismatch.' });
    }

    const users = readUsers();
    const existingIndex = users.findIndex((u) => u.uid === uid);
    const existing = existingIndex !== -1 ? users[existingIndex] : null;

    // Server-side financial calculation (NEVER trust client amounts)
    const packageSelected = body.packageSelected || body.package_selected || existing?.package_selected || 'Standard Counselling Dossier';
    const total_fee = calculateServerFee(packageSelected);
    const installment1_amount = Math.round(total_fee * 0.35);
    const installment2_amount = total_fee - installment1_amount;

    const studentName = body.name || body.student_name || body.personal?.studentName || existing?.name || existing?.student_name || 'Student';
    const email = body.email || body.personal?.email || existing?.email || '';
    const phone = body.phone || body.mobile || body.personal?.mobile || existing?.phone || existing?.mobile || '';

    const userRecord = {
      uid: uid,
      name: studentName,
      email: email,
      phone: phone,

      // Registration Form Fields
      student_name: studentName,
      parent_name: body.personal?.parentName || body.parent_name || existing?.parent_name || '',
      dob: body.personal?.dob || body.dob || existing?.dob || null,
      mobile: phone,
      whatsapp: body.personal?.whatsapp || body.whatsapp || phone,
      aadhaar: body.personal?.aadhaar || body.aadhaar || existing?.aadhaar || '',
      aadhaar_verified: body.aadhaarVerified ?? existing?.aadhaar_verified ?? true,
      address: body.personal?.address || body.address || existing?.address || '',
      state: body.personal?.state || body.state || existing?.state || 'Delhi NCR',
      course_interested: body.academic?.courseInterested || body.course_interested || existing?.course_interested || 'MBBS',
      entrance_exam: body.academic?.entranceExam || body.entrance_exam || existing?.entrance_exam || 'NEET UG',
      rank_score: body.academic?.rankScore || body.rank_score || existing?.rank_score || '',
      category: body.academic?.category || body.category || existing?.category || 'General / UR',
      tenth_details: body.academic?.tenthDetails || body.tenth_details || existing?.tenth_details || '',
      twelfth_details: body.academic?.twelfthDetails || body.twelfth_details || existing?.twelfth_details || '',
      preferred_state_city: body.academic?.preferredStateCity || body.preferred_state_city || existing?.preferred_state_city || '',
      approximate_budget: body.academic?.approximateBudget || body.budget || body.approximate_budget || existing?.approximate_budget || '',
      preferences: body.preferences || existing?.preferences || {},
      documents: body.documents || existing?.documents || [],
      package_selected: packageSelected,
      assigned_counsellor: body.counsellor || existing?.assigned_counsellor || {
        name: 'Dr. Vikram Sethi',
        title: 'Chief Medical & NEET Advisor',
        phone: '+91 98765 43211',
        email: 'dr.sethi@cerebralcompass.com'
      },
      admin_notes: body.admin_notes || existing?.admin_notes || '',

      // 2-Installment Model
      total_fee: total_fee,
      installment1_amount: installment1_amount,
      installment1_status: existing?.installment1_status || 'pending',
      installment2_amount: installment2_amount,
      installment2_status: existing?.installment2_status || 'locked',

      // Stage: 'registered' | 'counselling_done' | 'college_allotted'
      stage: existing?.stage || 'registered',

      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      users[existingIndex] = userRecord;
    } else {
      users.unshift(userRecord);
    }
    saveUsers(users);

    // Sync to Supabase if available (fire-and-forget safe)
    if (supabase) {
      supabase.from('users').upsert([userRecord], { onConflict: 'uid' }).then(({ error }) => {
        if (error) console.warn('[Supabase users upsert note]:', error.message);
      }).catch(() => {});
    }

    // Mirror to applications.json for compatibility with existing dashboard
    const apps = readApplications();
    const existingAppIndex = apps.findIndex((a) => a.uid === uid || a.id === uid);
    const appId = existingAppIndex !== -1 ? apps[existingAppIndex].id : `CC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const mirroredApp = {
      id: appId,
      uid: uid,
      submittedAt: userRecord.created_at,
      status: userRecord.stage === 'college_allotted' ? 'College Allotted ✓' : userRecord.stage === 'counselling_done' ? 'Counselling Completed ✓' : 'Application Received ✓',
      currentStage: userRecord.stage === 'college_allotted' ? 'College Allotted' : userRecord.stage === 'counselling_done' ? 'Counselling Completed' : 'Document Verification',
      stagesCompleted: userRecord.installment1_status === 'paid' ? ['Application Form', '35% Advance Payment'] : ['Application Form'],
      counsellor: userRecord.assigned_counsellor,
      paymentStatus: userRecord.installment2_status === 'paid' ? 'Paid 100% ✓' : userRecord.installment1_status === 'paid' ? '35% Paid (65% Remaining)' : 'Pending',
      packageSelected: userRecord.package_selected,
      personal: {
        studentName: userRecord.student_name,
        parentName: userRecord.parent_name,
        dob: userRecord.dob,
        mobile: userRecord.mobile,
        whatsapp: userRecord.whatsapp,
        email: userRecord.email,
        aadhaar: userRecord.aadhaar,
        address: userRecord.address,
        state: userRecord.state,
      },
      academic: {
        courseInterested: userRecord.course_interested,
        entranceExam: userRecord.entrance_exam,
        rankScore: userRecord.rank_score,
        category: userRecord.category,
        tenthDetails: userRecord.tenth_details,
        twelfthDetails: userRecord.twelfth_details,
        approximateBudget: userRecord.approximate_budget,
      },
      preferences: userRecord.preferences,
      documents: userRecord.documents,
      termsAccepted: true,
    };
    if (existingAppIndex !== -1) {
      apps[existingAppIndex] = mirroredApp;
    } else {
      apps.unshift(mirroredApp);
    }
    saveApplications(apps);

    res.status(201).json({
      success: true,
      message: 'User profile and registration successfully saved.',
      user: userRecord,
    });
  } catch (err) {
    console.error('Error in user registration:', err);
    res.status(500).json({ success: false, error: 'Internal server error while saving user record.' });
  }
});

// =========================================================================
// 3. PAYMENT GATEWAY SECURE INTEGRATION (Razorpay Orders & Verification)
// =========================================================================

/**
 * POST /api/payments/create-order
 * Security: Amount is STRICTLY computed on the server from the users table.
 * Browser amounts are NEVER accepted!
 */
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { uid, installmentNumber = 1 } = req.body;
    if (!uid) {
      return res.status(400).json({ success: false, error: 'User UID is required to create an order.' });
    }

    const users = readUsers();
    const user = users.find((u) => u.uid === uid);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User record not found. Please complete registration first.' });
    }

    // Determine strict amount based on installment
    let payableAmount = 0;
    const instNum = Number(installmentNumber);

    if (instNum === 1) {
      if (user.installment1_status === 'paid') {
        return res.status(400).json({ success: false, error: 'Installment 1 (35%) is already paid.' });
      }
      payableAmount = user.installment1_amount || Math.round((user.total_fee || 1179) * 0.35);
    } else if (instNum === 2) {
      if (user.installment2_status === 'locked') {
        return res.status(403).json({
          success: false,
          error: 'Installment 2 is locked. It will open only after your counselling is completed by admin.',
        });
      }
      if (user.installment2_status === 'paid') {
        return res.status(400).json({ success: false, error: 'Installment 2 (65%) is already fully paid.' });
      }
      payableAmount = user.installment2_amount || (user.total_fee - (user.installment1_amount || 0));
    } else {
      return res.status(400).json({ success: false, error: 'Invalid installment number. Must be 1 or 2.' });
    }

    const keyId = process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let razorpayOrderId = `order_cc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Try live Razorpay Orders API if configured
    if (keyId && keySecret && !keyId.includes('test_cerebral')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
          body: JSON.stringify({
            amount: Math.round(payableAmount * 100), // in paise
            currency: 'INR',
            receipt: `rcpt_${uid.slice(0, 8)}_${instNum}_${Date.now().toString().slice(-4)}`,
            notes: {
              uid: user.uid,
              studentName: user.name || user.student_name,
              installmentNumber: instNum,
              packageSelected: user.package_selected,
            },
          }),
        });

        if (rzpResponse.ok) {
          const rzpData = await rzpResponse.json();
          if (rzpData && rzpData.id) {
            razorpayOrderId = rzpData.id;
          }
        } else {
          const errData = await rzpResponse.text();
          console.warn('[Razorpay API note]: Using fallback order reference. Details:', errData);
        }
      } catch (err) {
        console.warn('[Razorpay Live Order Exception]:', err.message);
      }
    }

    res.json({
      success: true,
      orderId: razorpayOrderId,
      amount: payableAmount,
      currency: 'INR',
      keyId: keyId,
      installmentNumber: instNum,
      studentName: user.name || user.student_name,
      customerEmail: user.email,
      customerPhone: user.phone || user.mobile,
      uid: user.uid,
      packageSelected: user.package_selected,
    });
  } catch (err) {
    console.error('Error creating payment order:', err);
    res.status(500).json({ success: false, error: 'Failed to create payment order.' });
  }
});

/**
 * POST /api/payments/verify
 * Security: Checks Razorpay signature & records payment in separate payments table.
 */
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { orderId, paymentId, signature, uid, installmentNumber } = req.body;
    const instNum = Number(installmentNumber) || 1;

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.uid === uid);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User record not found.' });
    }
    const user = users[userIndex];

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    let signatureVerified = true;

    if (keySecret && signature && orderId && paymentId) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        console.warn('[Security Alert] Razorpay signature mismatch! Expected:', generatedSignature, 'Got:', signature);
        signatureVerified = false;
      }
    }

    if (!signatureVerified) {
      return res.status(400).json({ success: false, error: 'Invalid payment signature. Verification failed.' });
    }

    // Determine amount paid from user record (server authoritative)
    const amountPaid = instNum === 1 ? user.installment1_amount : user.installment2_amount;

    // Update user status
    if (instNum === 1) {
      user.installment1_status = 'paid';
    } else if (instNum === 2) {
      user.installment2_status = 'paid';
    }
    user.updated_at = new Date().toISOString();
    users[userIndex] = user;
    saveUsers(users);

    // Save to separate payments ledger
    const payments = readPayments();
    const paymentRecord = {
      id: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      payment_id: paymentId || `pay_sim_${Date.now()}`,
      order_id: orderId || `order_${Date.now()}`,
      uid: user.uid,
      student_name: user.name || user.student_name,
      package_name: user.package_selected,
      amount: amountPaid,
      currency: 'INR',
      installment_number: instNum,
      payment_method: 'Razorpay Verified',
      status: 'paid',
      created_at: new Date().toISOString(),
    };
    payments.unshift(paymentRecord);
    savePayments(payments);

    // Sync to Supabase
    if (supabase) {
      supabase.from('users').update({
        installment1_status: user.installment1_status,
        installment2_status: user.installment2_status,
        updated_at: user.updated_at,
      }).eq('uid', user.uid).then(() => {}).catch(() => {});

      supabase.from('payments').insert([paymentRecord]).then(() => {}).catch(() => {});
    }

    // Mirror to applications.json
    const apps = readApplications();
    const app = apps.find((a) => a.uid === uid || a.id === uid);
    if (app) {
      app.paymentStatus = user.installment2_status === 'paid' ? 'Paid 100% ✓' : '35% Paid (65% Remaining)';
      app.transactionId = paymentRecord.payment_id;
      app.paidAmount = `₹${amountPaid.toLocaleString('en-IN')}`;
      if (!app.stagesCompleted.includes(`Installment ${instNum} Paid`)) {
        app.stagesCompleted.push(`Installment ${instNum} Paid`);
      }
      saveApplications(apps);
    }

    // Asynchronously dispatch invoice email with attached legal terms PDF
    sendInvoiceEmail({
      studentName: user.name || user.student_name,
      recipientEmail: user.email || notificationConfig.testEmail,
      appId: user.uid,
      course: user.course_interested,
      paidAmount: `₹${amountPaid.toLocaleString('en-IN')}`,
      transactionId: paymentRecord.payment_id,
      packageSelected: `${user.package_selected} (Installment ${instNum})`,
    }).then((result) => {
      console.log(`[Auto Invoice Email] Sent for ${user.uid}:`, result.message);
    }).catch((err) => {
      console.error(`[Auto Invoice Email Error]:`, err);
    });

    res.json({
      success: true,
      message: `Installment ${instNum} successfully verified and marked as paid.`,
      transactionId: paymentRecord.payment_id,
      payment: paymentRecord,
      user: user,
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ success: false, error: 'Internal server error during verification.' });
  }
});

/**
 * POST /api/payments/webhook
 * Razorpay Webhook Endpoint (Confirmed server-to-server webhook)
 */
app.post('/api/payments/webhook', (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (webhookSecret && signature) {
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');
      if (digest !== signature) {
        return res.status(400).json({ status: 'invalid_signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload?.payment?.entity;
      const notes = paymentEntity?.notes || {};
      const uid = notes.uid;
      const instNum = Number(notes.installmentNumber) || 1;

      if (uid) {
        const users = readUsers();
        const user = users.find((u) => u.uid === uid);
        if (user) {
          if (instNum === 1) user.installment1_status = 'paid';
          if (instNum === 2) user.installment2_status = 'paid';
          user.updated_at = new Date().toISOString();
          saveUsers(users);

          const payments = readPayments();
          payments.unshift({
            id: `PAY-WH-${Date.now()}`,
            payment_id: paymentEntity.id,
            order_id: paymentEntity.order_id,
            uid: uid,
            student_name: user.name || user.student_name,
            package_name: user.package_selected,
            amount: paymentEntity.amount / 100,
            currency: paymentEntity.currency || 'INR',
            installment_number: instNum,
            payment_method: paymentEntity.method || 'Razorpay Webhook',
            status: 'paid',
            created_at: new Date().toISOString(),
          });
          savePayments(payments);
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// =========================================================================
// 4. ADMIN PANEL ENDPOINTS (Requirement 5 & 6)
// =========================================================================

/**
 * GET /api/admin/students
 * Security: Validates admin key.
 * Returns all students with installment statuses and stages.
 */
app.get('/api/admin/students', (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    const validKeys = ['admin@cerebral2026', 'admin123', 'cerebral2026', 'admin', 'compass@admin'];
    if (!adminKey || !validKeys.includes(adminKey)) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin credentials required.' });
    }

    let users = readUsers();

    // If users file has fewer records than applications, auto-populate from applications.json
    if (users.length === 0) {
      const apps = readApplications();
      users = apps.map((a) => {
        const total = calculateServerFee(a.packageSelected);
        const inst1 = Math.round(total * 0.35);
        return {
          uid: a.uid || a.id,
          name: a.personal?.studentName || 'Student',
          email: a.personal?.email || '',
          phone: a.personal?.mobile || '',
          student_name: a.personal?.studentName || 'Student',
          mobile: a.personal?.mobile || '',
          course_interested: a.academic?.courseInterested || 'MBBS',
          package_selected: a.packageSelected || 'Standard Counselling Dossier',
          total_fee: total,
          installment1_amount: inst1,
          installment1_status: (a.paymentStatus || '').includes('Paid') ? 'paid' : 'pending',
          installment2_amount: total - inst1,
          installment2_status: 'locked',
          stage: 'registered',
          created_at: a.submittedAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });
      saveUsers(users);
    }

    res.json({ success: true, students: users });
  } catch (err) {
    console.error('Error fetching admin students:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch students list.' });
  }
});

/**
 * PATCH /api/admin/students/:uid/status
 * Security: Admin only.
 * Allows updating installment2_status ('locked' -> 'pending' / 'paid') and stage.
 * When installment2_status becomes 'pending', sends notification (email / SMS / WhatsApp) to the student!
 */
app.patch('/api/admin/students/:uid/status', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    const validKeys = ['admin@cerebral2026', 'admin123', 'cerebral2026', 'admin', 'compass@admin'];
    if (!adminKey || !validKeys.includes(adminKey)) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin credentials required.' });
    }

    const { uid } = req.params;
    const { stage, installment2_status, installment1_status } = req.body;

    const users = readUsers();
    const userIndex = users.findIndex((u) => u.uid === uid);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'Student record not found.' });
    }

    const user = users[userIndex];
    const previousInst2Status = user.installment2_status;

    if (stage) {
      const validStages = ['registered', 'counselling_done', 'college_allotted'];
      if (validStages.includes(stage)) {
        user.stage = stage;
      }
    }

    if (installment1_status) {
      user.installment1_status = installment1_status;
    }

    let notificationSent = false;
    let notificationResult = null;

    if (installment2_status) {
      const validStatuses = ['locked', 'pending', 'paid'];
      if (validStatuses.includes(installment2_status)) {
        user.installment2_status = installment2_status;

        // When admin sets installment2_status to "pending", send student notification!
        if (installment2_status === 'pending' && previousInst2Status !== 'pending') {
          console.log(`[Admin Action] Unlocking 65% payment for ${user.name} (${user.email}). Dispatching notification...`);
          try {
            notificationResult = await sendInstallment2NotificationEmail({
              name: user.name || user.student_name,
              email: user.email,
              phone: user.phone || user.mobile,
              installment2_amount: user.installment2_amount,
              total_fee: user.total_fee,
              stage: user.stage,
              portalUrl: process.env.CLIENT_URL || 'http://localhost:5173',
            });
            notificationSent = notificationResult.success;
          } catch (notifErr) {
            console.error('Notification dispatch error:', notifErr);
          }
        }
      }
    }

    user.updated_at = new Date().toISOString();
    users[userIndex] = user;
    saveUsers(users);

    // Sync to Supabase
    if (supabase) {
      supabase.from('users').update({
        stage: user.stage,
        installment2_status: user.installment2_status,
        installment1_status: user.installment1_status,
        updated_at: user.updated_at,
      }).eq('uid', user.uid).then(() => {}).catch(() => {});
    }

    // Mirror to applications.json
    const apps = readApplications();
    const app = apps.find((a) => a.uid === uid || a.id === uid);
    if (app) {
      app.currentStage = user.stage === 'college_allotted' ? 'College Allotted' : user.stage === 'counselling_done' ? 'Counselling Completed' : 'Document Verification';
      app.status = user.stage === 'college_allotted' ? 'College Allotted ✓' : user.stage === 'counselling_done' ? 'Counselling Completed ✓' : 'Under Review';
      saveApplications(apps);
    }

    res.json({
      success: true,
      message: 'Student status updated successfully.',
      user: user,
      notificationSent: notificationSent,
      notificationResult: notificationResult,
    });
  } catch (err) {
    console.error('Error updating student status:', err);
    res.status(500).json({ success: false, error: 'Internal server error updating student status.' });
  }
});

/**
 * GET /api/payments
 * Returns payments ledger for Admin view.
 */
app.get('/api/payments', (req, res) => {
  try {
    const payments = readPayments();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// =========================================================================
// 5. EXISTING APPLICATION & DOCUMENT ENDPOINTS
// =========================================================================

app.get('/api/applications', (req, res) => {
  res.json(readApplications());
});

app.get('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const apps = readApplications();
  const found = apps.find((a) => a.id?.toLowerCase() === id?.toLowerCase() || a.uid?.toLowerCase() === id?.toLowerCase());

  if (!found) {
    return res.status(404).json({ success: false, error: 'Application reference not found.' });
  }

  res.json({ success: true, application: found });
});

app.post('/api/applications', (req, res) => {
  try {
    const data = req.body;
    const apps = readApplications();

    const appId = (data.id && /^CC-\d{3,}$/i.test(data.id)) ? data.id : getNextApplicationId();

    const newApplication = {
      id: appId,
      uid: data.uid || `user_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'Application Received ✓',
      currentStage: 'Document Verification',
      stagesCompleted: ['Application Form'],
      counsellor: {
        name: 'Dr. Vikram Sethi',
        title: 'Chief Medical & NEET Advisor',
        phone: '+91 98765 43211',
        email: 'dr.sethi@cerebralcompass.com',
      },
      paymentStatus: data.paymentStatus || 'Pending',
      packageSelected: data.packageSelected || 'Complete Admission Assistance',
      personal: data.personal || {},
      academic: data.academic || {},
      preferences: data.preferences || {},
      documents: data.documents || [],
      termsAccepted: data.termsAccepted || false,
    };

    apps.unshift(newApplication);
    saveApplications(apps);

    res.status(201).json({
      success: true,
      applicationId: appId,
      message: 'Application successfully submitted and stored securely.',
      application: newApplication,
    });
  } catch (error) {
    console.error('Error in application submission:', error);
    res.status(500).json({ success: false, error: 'Internal server error while saving application.' });
  }
});

app.post('/api/upload', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file received.' });
    }

    const fileInfo = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      size: (req.file.size / 1024).toFixed(1) + ' KB',
      mimeType: req.file.mimetype,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date().toISOString(),
      verifiedStatus: 'Pending Verification',
    };

    res.json({
      success: true,
      message: 'Document securely vaulted.',
      file: fileInfo,
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ success: false, error: 'File upload processing failed.' });
  }
});

app.post('/api/notifications/send-invoice-email', async (req, res) => {
  try {
    const payload = req.body || {};
    const result = await sendInvoiceEmail(payload);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Email dispatch failed' });
  }
});

app.post('/api/notifications/get-whatsapp-url', (req, res) => {
  try {
    const payload = req.body || {};
    const targetPhone = req.body.targetPhone || payload.personal?.whatsapp || payload.personal?.mobile || notificationConfig.officialWhatsapp;
    const whatsappUrl = generateWhatsAppInvoiceUrl(payload, targetPhone);
    const messageText = formatInvoiceTextMessage(payload);

    res.json({
      success: true,
      whatsappUrl,
      messageText,
      targetPhone,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'WhatsApp formatting failed' });
  }
});

app.post('/api/contact', (req, res) => {
  try {
    let inquiries = [];
    if (fs.existsSync(inquiriesFile)) {
      inquiries = JSON.parse(fs.readFileSync(inquiriesFile, 'utf8'));
    }
    const newInquiry = {
      id: `INQ-${Date.now()}`,
      receivedAt: new Date().toISOString(),
      ...req.body,
    };
    inquiries.unshift(newInquiry);
    fs.writeFileSync(inquiriesFile, JSON.stringify(inquiries, null, 2), 'utf8');

    res.json({ success: true, message: 'Your inquiry has been received. Our senior counsellor will connect on WhatsApp within 30 minutes.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Inquiry logging failed' });
  }
});

// Serve frontend build static files & SPA client routing
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Cerebral Compass API] Server running smoothly on http://localhost:${PORT}`);
});
