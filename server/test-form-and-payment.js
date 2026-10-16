import { sendInvoiceEmail, formatInvoiceTextMessage, generateWhatsAppInvoiceUrl } from './services/notificationService.js';
import { getNextApplicationId } from './services/referenceIdService.js';
import { calculateGstBreakdown } from '../src/utils/gstCalculator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testFullFormSubmissionWithPayment() {
  console.log('========================================================');
  console.log('📝 END-TO-END TEST: FORM SUBMISSION + PAYMENT + INVOICING');
  console.log('========================================================\n');

  // 1. Simulate Student Application Form Data with MBBS Private Plan
  const packagePriceBase = 69999;
  const gstBreakdown = calculateGstBreakdown(packagePriceBase);

  console.log('[STEP 1] Selected Package: MBBS Private Counselling Plan');
  console.log(`         Package Base Price: ${gstBreakdown.formattedBase}`);
  console.log(`         GST Rate: ${gstBreakdown.gstRate}`);
  console.log(`         GST 18% Amount: ${gstBreakdown.formattedGst}`);
  console.log(`         Total Amount Payable: ${gstBreakdown.formattedTotal}\n`);

  const studentData = {
    id: getNextApplicationId(),
    submittedAt: new Date().toISOString(),
    status: 'Application Received & Verified ✓',
    currentStage: 'Counsellor Choice Allocation',
    stagesCompleted: ['Application Form', 'Document Verification', 'Payment Confirmation'],
    paymentStatus: 'Paid & Confirmed ✓',
    transactionId: `pay_razorpay_${Date.now()}`,
    paymentGateway: 'Razorpay Verified',
    basePackagePrice: gstBreakdown.formattedBase,
    gstAmount: gstBreakdown.formattedGst,
    gstRate: '18%',
    paidAmount: gstBreakdown.formattedTotal,
    packageSelected: `MBBS Plan: Private Counselling Plan (${gstBreakdown.formattedTotal})`,
    personal: {
      studentName: 'Priya Verma',
      parentName: 'Ramesh Verma',
      dob: '2005-08-15',
      mobile: '9876543210',
      whatsapp: '9876543210',
      email: 'thecerebralcompass@gmail.com',
      aadhaar: '5432 1098 7654',
      address: 'Sector 62, Noida, Uttar Pradesh',
      state: 'Uttar Pradesh',
    },
    academic: {
      courseInterested: 'MBBS',
      entranceExam: 'NEET UG',
      rankScore: 'AIR 14,250 (645 Marks)',
      category: 'General / UR',
      tenthDetails: '94% (CBSE Board)',
      twelfthDetails: '91% (PCB - CBSE Board)',
      approximateBudget: '₹15 Lakhs – ₹35 Lakhs',
    },
  };

  // 2. Save into server applications storage
  const appFile = path.join(__dirname, 'data', 'applications.json');
  let apps = [];
  if (fs.existsSync(appFile)) {
    try {
      apps = JSON.parse(fs.readFileSync(appFile, 'utf8'));
    } catch (e) {
      apps = [];
    }
  }
  apps.unshift(studentData);
  fs.writeFileSync(appFile, JSON.stringify(apps, null, 2), 'utf8');
  console.log(`[STEP 2] Application Saved into Database with ID: ${studentData.id}`);
  console.log(`         Transaction ID: ${studentData.transactionId}`);
  console.log(`         Total Paid Recorded: ${studentData.paidAmount}\n`);

  // 3. Generate WhatsApp Invoice Message
  console.log('[STEP 3] Generating WhatsApp Invoice Message:');
  console.log('--------------------------------------------------------');
  const waMessage = formatInvoiceTextMessage(studentData);
  console.log(waMessage);
  console.log('--------------------------------------------------------');
  const waUrl = generateWhatsAppInvoiceUrl(studentData, studentData.personal.whatsapp);
  console.log(`Direct WhatsApp Chat Link: ${waUrl}\n`);

  // 4. Dispatch Email with Company Legal Terms & Conditions PDF Attachment
  console.log('[STEP 4] Dispatching Official Tax Invoice Email with Attached Legal T&C PDF:');
  const emailResult = await sendInvoiceEmail({
    ...studentData,
    recipientEmail: 'thecerebralcompass@gmail.com',
  });
  console.log('Email Dispatch Result:', JSON.stringify(emailResult, null, 2));

  console.log('\n========================================================');
  console.log('🎉 FORM SUBMISSION + PAYMENT + NOTIFICATION TEST COMPLETED!');
  console.log('========================================================\n');
}

testFullFormSubmissionWithPayment();
