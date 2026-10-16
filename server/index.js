import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  sendInvoiceEmail,
  formatInvoiceTextMessage,
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

// Helper for file storage
const appFile = path.join(dataDir, 'applications.json');
const inquiriesFile = path.join(dataDir, 'inquiries.json');

const readApplications = () => {
  try {
    if (fs.existsSync(appFile)) {
      return JSON.parse(fs.readFileSync(appFile, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading applications:', err);
  }
  return [];
};

const saveApplications = (apps) => {
  try {
    fs.writeFileSync(appFile, JSON.stringify(apps, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving applications:', err);
  }
};

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

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Cerebral Compass Core API',
  });
});

// Endpoint to peek next application ID
app.get('/api/applications/next-id', (req, res) => {
  res.json({ nextId: peekNextApplicationId() });
});

// 2. Multi-step Application Submission
app.post('/api/applications', (req, res) => {
  try {
    const data = req.body;
    const apps = readApplications();

    // Auto-generate official application ID (format: CC-<sno><YY>, e.g. CC-0126)
    const appId = (data.id && /^CC-\d{3,}$/i.test(data.id)) ? data.id : getNextApplicationId();

    // Assign appropriate counsellor based on selected course
    let assignedCounsellor = {
      name: 'Dr. Vikram Sethi',
      title: 'Chief Medical & NEET Advisor',
      phone: '+91 98765 43211',
      email: 'dr.sethi@cerebralcompass.com',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    };

    const courseStr = (data.academic?.courseInterested || data.preferences?.course || '').toLowerCase();
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

    const newApplication = {
      id: appId,
      submittedAt: new Date().toISOString(),
      status: 'Application Received ✓',
      currentStage: 'Document Verification',
      stagesCompleted: ['Application Form'],
      counsellor: assignedCounsellor,
      paymentStatus: data.paymentStatus || 'Pending',
      packageSelected: data.packageSelected || 'Complete Admission Assistance',
      nextAction: 'Senior Counsellor Profile Review Call scheduled within 24 hours',
      personal: data.personal || {},
      academic: data.academic || {},
      preferences: data.preferences || {},
      documents: data.documents || [],
      termsAccepted: data.termsAccepted || false,
    };

    apps.unshift(newApplication);
    saveApplications(apps);

    console.log(`[API] New application registered: ${appId} for ${data.personal?.studentName || 'Student'}`);

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

// 3. Application Lookup for Client Dashboard
app.get('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const apps = readApplications();
  const found = apps.find((a) => a.id.toLowerCase() === id.toLowerCase());

  if (!found) {
    return res.status(404).json({ success: false, error: 'Application reference not found.' });
  }

  res.json({ success: true, application: found });
});

// 4. Secure Document Upload Endpoint
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

// 5. Payment Gateway Simulation (Razorpay / Stripe)
app.post('/api/payments/create-order', (req, res) => {
  const { packageId, amount, studentName } = req.body;
  const orderId = `order_cc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  res.json({
    success: true,
    orderId,
    amount: amount || 29999,
    currency: 'INR',
    keyId: process.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TnR7MmwIAXDS2G',
    packageId,
    customerName: studentName || 'Applicant',
  });
});

app.post('/api/payments/verify', (req, res) => {
  const { orderId, paymentId, appId } = req.body;

  if (appId) {
    const apps = readApplications();
    const target = apps.find((a) => a.id === appId);
    if (target) {
      target.paymentStatus = 'Paid & Confirmed ✓';
      target.transactionId = paymentId || `pay_${Date.now()}`;
      if (!target.stagesCompleted.includes('Payment Confirmation')) {
        target.stagesCompleted.push('Payment Confirmation');
      }
      saveApplications(apps);

      // Asynchronously dispatch invoice email with attached legal terms PDF
      sendInvoiceEmail({
        ...target,
        appId: target.id,
        recipientEmail: target.personal?.email || notificationConfig.testEmail,
      }).then((result) => {
        console.log(`[Auto Invoice Email] Sent for ${target.id}:`, result.message);
      }).catch((err) => {
        console.error(`[Auto Invoice Email Error]:`, err);
      });
    }
  }

  res.json({
    success: true,
    message: 'Payment verified successfully.',
    transactionId: paymentId || `pay_${Date.now()}`,
    status: 'Captured',
  });
});

// 6. Direct Invoice & Notification Endpoints
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

// 6. Contact & Inquiry Form
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

app.listen(PORT, () => {
  console.log(`[Cerebral Compass API] Server running smoothly on http://localhost:${PORT}`);
});
