import { sendInvoiceEmail, formatInvoiceTextMessage, generateWhatsAppInvoiceUrl, notificationConfig } from './services/notificationService.js';

async function runTest() {
  console.log('--- TESTING 18% GST INVOICE NOTIFICATION ---');

  const sampleGstInvoice = {
    appId: 'CC-2026-NEET-99',
    studentName: 'Aaditya Vikram Singh',
    mobile: '9876543210',
    course: 'MBBS Admission Mentorship (NEET UG)',
    basePackagePrice: '₹69,999.00',
    gstAmount: '₹12,599.82',
    paidAmount: '₹82,598.82',
    transactionId: 'pay_live_' + Date.now(),
    recipientEmail: notificationConfig.testEmail,
  };

  console.log('\n[1] GENERATING WHATSAPP TEXT MESSAGE:');
  const waText = formatInvoiceTextMessage(sampleGstInvoice);
  console.log(waText);

  console.log('\n[2] GENERATING WHATSAPP URL:');
  const waUrl = generateWhatsAppInvoiceUrl(sampleGstInvoice);
  console.log(waUrl);

  console.log('\n[3] SENDING TEST EMAIL WITH 18% GST BREAKDOWN & ATTACHMENT...');
  const emailResult = await sendInvoiceEmail(sampleGstInvoice);
  console.log('\n[RESULT]:', JSON.stringify(emailResult, null, 2));

  if (emailResult.previewUrl) {
    console.log('\n======================================================');
    console.log('🔥 18% GST TEST EMAIL SUCCESSFUL! VIEW ONLINE:');
    console.log(emailResult.previewUrl);
    console.log('======================================================\n');
  }
}

runTest();
