import 'dotenv/config';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testLiveGmail() {
  console.log('--- STARTING LIVE GMAIL DISPATCH TEST ---');
  console.log('User:', process.env.SMTP_USER);
  console.log('Pass provided:', process.env.SMTP_PASS ? 'YES (16 chars)' : 'NO');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Check verification
  console.log('Verifying connection with Gmail SMTP server...');
  try {
    await transporter.verify();
    console.log('✅ GMAIL SMTP CONNECTION VERIFIED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Connection verification failed:', err);
    return;
  }

  // Find legal terms document
  const publicDocsDir = path.resolve(__dirname, '..', 'public', 'documents');
  const candidatePdf = path.join(publicDocsDir, 'all-legal-pages.pdf');

  const attachments = [];
  if (fs.existsSync(candidatePdf)) {
    attachments.push({
      filename: 'Cerebral_Compass_Legal_Terms_and_Contract.pdf',
      path: candidatePdf,
    });
    console.log('✅ Attached PDF found:', candidatePdf);
  }

  const recipients = ['thecerebralcompass@gmail.com'];

  const mailOptions = {
    from: `"Cerebral Compass Pvt Ltd" <${process.env.SMTP_USER}>`,
    to: recipients.join(', '),
    subject: `🧾 Official Payment Invoice #cc01102026 - Priya Verma`,
    text: `🧾 CEREBRAL COMPASS PVT LTD
OFFICIAL PAYMENT RECEIPT & TAX INVOICE
----------------------------------------
Candidate: Priya Verma
Application Ref: cc01102026
Stream/Course: MBBS Admission Mentorship

INVOICE BREAKDOWN (18% GST)
Item            Amount
Package price   ₹69,999.00
GST 18%         +₹12,599.82
Total payable   ₹82,598.82 (Paid & Captured ✓)
----------------------------------------
Transaction ID: pay_live_${Date.now()}
Date: 16 Oct 2026

Company Legal Mentorship Terms & Conditions PDF has been attached to this email.
Helpline: +91 77798 20944 • WhatsApp: +91 62049 34005
Email: thecerebralcompass@gmail.com`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0f172a; color: #ffffff; padding: 24px;">
        <span style="background: #10b981; color: white; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: bold;">PAYMENT VERIFIED ✓</span>
        <h2 style="margin: 8px 0 0 0;">Official Payment Tax Invoice</h2>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Cerebral Compass Pvt Ltd • Educational Consultancy</p>
      </div>
      <div style="padding: 24px; color: #1e293b;">
        <p>Dear <strong>Priya Verma</strong>,</p>
        <p>Thank you for choosing Cerebral Compass. Your counselling dossier registration has been captured and confirmed.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <th style="padding: 10px; text-align: left;">Application Ref ID</th>
            <td style="padding: 10px; font-weight: bold; color: #0f172a;">cc01102026</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="padding: 10px; text-align: left;">Program / Stream</th>
            <td style="padding: 10px; font-weight: bold;">MBBS Admission Mentorship</td>
          </tr>
          <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
            <th style="padding: 10px; text-align: left;">Package Price</th>
            <td style="padding: 10px; font-weight: bold;">₹69,999.00</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="padding: 10px; text-align: left;">GST (18%)</th>
            <td style="padding: 10px; font-weight: bold; color: #dc2626;">+₹12,599.82</td>
          </tr>
          <tr style="background: #ecfdf5; color: #065f46; font-size: 15px;">
            <th style="padding: 12px; text-align: left;">Total Payable (Paid)</th>
            <td style="padding: 12px; font-weight: bold;">₹82,598.82</td>
          </tr>
        </table>

        <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 6px; font-size: 12px; color: #92400e; margin-top: 16px;">
          📎 <strong>Company Legal Attachment:</strong> Our official <strong>Legal Terms & Career Counselling Contract</strong> PDF has been attached to this email.
        </div>
      </div>
      <div style="background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
        Cerebral Compass Pvt Ltd • Muzaffarpur, Bihar - 842002<br>
        Helpline: +91 77798 20944 • WhatsApp: +91 62049 34005 • Email: thecerebralcompass@gmail.com
      </div>
    </div>
    `,
    attachments: attachments,
  };

  console.log(`Sending live email to ${recipients.join(', ')}...`);
  const info = await transporter.sendMail(mailOptions);
  console.log('🔥 LIVE EMAIL SENT SUCCESSFULLY!');
  console.log('Message ID:', info.messageId);
  console.log('Accepted by Gmail:', info.accepted);
}

testLiveGmail();
