import 'dotenv/config';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find legal terms document in root public/documents
const publicDocsDir = path.resolve(__dirname, '..', '..', 'public', 'documents');
const candidatePdfNames = [
  'all-legal-pages.pdf',
  'All Legal Pages.pdf',
  'career-counselling-contract.pdf',
  'Cerebral Compass Career Counselling Contract.pdf'
];

let legalPdfPath = null;
for (const name of candidatePdfNames) {
  const p = path.join(publicDocsDir, name);
  if (fs.existsSync(p)) {
    legalPdfPath = p;
    break;
  }
}

// Default config
export const notificationConfig = {
  testEmail: process.env.TEST_NOTIFICATION_EMAIL || 'thecerebralcompass@gmail.com',
  officialWhatsapp: process.env.OFFICIAL_WHATSAPP || '+917779820944',
  companyName: 'Cerebral Compass Pvt Ltd',
  legalPdfPath: legalPdfPath,
  termsPublicUrl: 'https://cerebralcompass.com/documents/all-legal-pages.pdf',
};

/**
 * Creates email transporter:
 * 1. If SMTP_PASS is provided, uses real Gmail/Custom SMTP.
 * 2. If not provided, creates an Ethereal test account so testing works 100% out-of-the-box
 *    and provides a live browser preview link of the delivered email + attachment.
 */
async function getEmailTransporter() {
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (smtpUser && smtpPass) {
    return {
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      }),
      isLive: true,
      sender: smtpUser,
    };
  }

  // Create Ethereal test account for instant testing
  const testAccount = await nodemailer.createTestAccount();
  const testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return {
    transporter: testTransporter,
    isLive: false,
    sender: `"Cerebral Compass Invoicing" <${testAccount.user}>`,
    etherealUser: testAccount.user,
  };
}

/**
 * Format plain text invoice for WhatsApp or simple text emails with 18% GST
 */
export function formatInvoiceTextMessage(data) {
  const studentName = data.studentName || data.personal?.studentName || 'Valued Applicant';
  const appId = data.appId || data.id || 'CC-0126';
  const txnId = data.txnId || data.transactionId || 'TXN_VERIFIED';
  const course = data.course || data.academic?.courseInterested || 'Medical / Engineering Counselling';
  const dateStr = data.date || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const termsUrl = data.termsUrl || notificationConfig.termsPublicUrl;

  // 18% GST Breakdown calculation
  let basePrice = data.basePackagePrice;
  let gstAmount = data.gstAmount;
  let totalAmount = data.paidAmount || data.amount;

  if (!basePrice || !gstAmount) {
    const rawVal = parseFloat(String(totalAmount || '82598.82').replace(/[^0-9.]/g, '')) || 82598.82;
    // Check if rawVal is total with 18% or base
    let base = rawVal;
    if (rawVal > 1500) {
      // Reverse calculate base if passed total
      const calcBase = Math.round(rawVal / 1.18);
      if (Math.abs(Math.round(calcBase * 1.18 * 100) / 100 - rawVal) < 0.1) {
        base = calcBase;
      }
    }
    const gst = Math.round(base * 0.18 * 100) / 100;
    const total = Math.round((base + gst) * 100) / 100;
    basePrice = '₹' + base.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    gstAmount = '₹' + gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    totalAmount = '₹' + total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return `🧾 *CEREBRAL COMPASS PVT LTD*
*OFFICIAL PAYMENT RECEIPT & TAX INVOICE*
----------------------------------------
👤 *Candidate:* ${studentName}
🆔 *Application Ref:* ${appId}
📚 *Stream/Course:* ${course}
----------------------------------------
📊 *INVOICE BREAKDOWN (18% GST)*
Item            Amount
Package price   ${basePrice}
GST 18%         +${gstAmount}
Total payable   ${totalAmount} (Success ✓)
----------------------------------------
🔢 *Transaction ID:* ${txnId}
📅 *Date:* ${dateStr}
🏢 *Company:* Cerebral Compass Pvt Ltd
----------------------------------------
📄 *Legal Mentorship Terms & Conditions (PDF):*
${termsUrl}

🙏 Thank you for partnering with Cerebral Compass. Our senior admission director will connect with you on WhatsApp within 30 minutes.
📞 Official Support: +91 77798 20944
💬 WhatsApp: +91 77798 20944`;
}

/**
 * Format HTML email body
 */
export function formatInvoiceHtmlEmail(data) {
  const studentName = data.studentName || data.personal?.studentName || 'Valued Applicant';
  const appId = data.appId || data.id || 'CC-0126';
  const txnId = data.txnId || data.transactionId || 'TXN_VERIFIED';
  const course = data.course || data.academic?.courseInterested || 'Medical / Engineering Counselling';
  const mobile = data.mobile || data.personal?.mobile || 'N/A';
  const dateStr = data.date || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // 18% GST Breakdown
  let basePrice = data.basePackagePrice;
  let gstAmount = data.gstAmount;
  let totalAmount = data.paidAmount || data.amount;

  if (!basePrice || !gstAmount) {
    const rawVal = parseFloat(String(totalAmount || '82598.82').replace(/[^0-9.]/g, '')) || 82598.82;
    let base = rawVal;
    if (rawVal > 1500) {
      const calcBase = Math.round(rawVal / 1.18);
      if (Math.abs(Math.round(calcBase * 1.18 * 100) / 100 - rawVal) < 0.1) {
        base = calcBase;
      }
    }
    const gst = Math.round(base * 0.18 * 100) / 100;
    const total = Math.round((base + gst) * 100) / 100;
    basePrice = '₹' + base.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    gstAmount = '₹' + gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    totalAmount = '₹' + total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
      .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); color: #ffffff; padding: 28px 32px; text-align: left; }
      .badge { display: inline-block; background: #10b981; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 12px; border-radius: 9999px; letter-spacing: 0.5px; margin-bottom: 12px; }
      .title { font-size: 24px; font-weight: 800; margin: 0 0 6px 0; }
      .subtitle { font-size: 13px; color: #94a3b8; margin: 0; }
      .content { padding: 32px; }
      .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
      .invoice-table th, .invoice-table td { padding: 12px 16px; text-align: left; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
      .invoice-table th { background: #f1f5f9; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 11px; width: 40%; }
      .invoice-table td { font-weight: 600; color: #0f172a; }
      .breakdown-row th, .breakdown-row td { background: #ffffff; }
      .total-row th, .total-row td { background: #ecfdf5; color: #065f46; font-size: 15px; font-weight: 800; border-bottom: none; }
      .legal-box { background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-top: 24px; font-size: 12px; color: #92400e; }
      .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <span class="badge">Payment Verified ✓</span>
        <h1 class="title">Official Payment Invoice</h1>
        <p class="subtitle">Cerebral Compass Pvt Ltd • Educational Consultancy</p>
      </div>
      <div class="content">
        <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6;">
          Dear <strong>${studentName}</strong>,<br>
          Thank you for confirming your counselling registration. Your payment has been captured and verified. Please find your invoice receipt below.
        </p>

        <table class="invoice-table">
          <tr>
            <th>Application Ref ID</th>
            <td>${appId}</td>
          </tr>
          <tr>
            <th>Student / Applicant</th>
            <td>${studentName}</td>
          </tr>
          <tr>
            <th>Registered Mobile</th>
            <td>+91 ${mobile}</td>
          </tr>
          <tr>
            <th>Target Program / Course</th>
            <td>${course}</td>
          </tr>
          <tr>
            <th>Payment Gateway Txn ID</th>
            <td><code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${txnId}</code></td>
          </tr>
          <tr>
            <th>Transaction Date</th>
            <td>${dateStr}</td>
          </tr>
          <tr class="breakdown-row">
            <th>Package Price</th>
            <td>${basePrice}</td>
          </tr>
          <tr class="breakdown-row">
            <th>GST (18%)</th>
            <td style="color: #e0533c;">+${gstAmount}</td>
          </tr>
          <tr class="total-row">
            <th>Total Payable</th>
            <td>${totalAmount}</td>
          </tr>
        </table>

        <div class="legal-box">
          <strong>📎 Attached Company Legal Documentation:</strong><br>
          As per Ministry of Corporate Affairs (MCA) compliance, our official <strong>Legal Terms, Privacy Policy & Career Counselling Contract</strong> PDF has been attached to this email for your permanent records.
        </div>
      </div>
      <div class="footer">
        Cerebral Compass Pvt Ltd • Muzaffarpur, Bihar - 842002<br>
        Helpline: +91 77798 20944 • WhatsApp: +91 77798 20944 • Email: thecerebralcompass@gmail.com
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Dispatch Email with attached Legal Terms & Conditions PDF
 */
export async function sendInvoiceEmail(data) {
  try {
    const { transporter, isLive, sender, etherealUser } = await getEmailTransporter();
    const recipient = data.recipientEmail || notificationConfig.testEmail;
    const studentName = data.studentName || data.personal?.studentName || 'Applicant';
    const appId = data.appId || data.id || 'CC-0126';

    const attachments = [];
    if (legalPdfPath && fs.existsSync(legalPdfPath)) {
      attachments.push({
        filename: 'Cerebral_Compass_Legal_Terms_and_Contract.pdf',
        path: legalPdfPath,
      });
    }

    const recipientList = Array.from(new Set([
      recipient,
      'thecerebralcompass@gmail.com'
    ].filter(Boolean)));

    const mailOptions = {
      from: isLive ? `"Cerebral Compass Pvt Ltd" <${sender}>` : sender,
      to: isLive ? recipientList.join(', ') : recipient,
      subject: `🧾 Official Invoice & Payment Receipt #${appId} - ${studentName}`,
      text: formatInvoiceTextMessage(data),
      html: formatInvoiceHtmlEmail(data),
      attachments: attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = !isLive ? nodemailer.getTestMessageUrl(info) : null;

    return {
      success: true,
      messageId: info.messageId,
      recipient: recipient,
      isLive: isLive,
      previewUrl: previewUrl,
      attachedPdf: legalPdfPath ? path.basename(legalPdfPath) : null,
      message: isLive
        ? `Live email sent successfully to ${recipient}`
        : `Test email dispatched! Preview online at: ${previewUrl}`,
    };
  } catch (error) {
    console.error('Email dispatch error:', error);
    return {
      success: false,
      error: error.message || 'Failed to dispatch email',
    };
  }
}

/**
 * Generate WhatsApp Click-To-Chat URL with formatted invoice message
 */
export function generateWhatsAppInvoiceUrl(data, targetPhone) {
  const phone = targetPhone || notificationConfig.officialWhatsapp;
  // Clean phone: remove +, spaces, dashes
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = formatInvoiceTextMessage(data);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
