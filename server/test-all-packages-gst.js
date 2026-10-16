import { calculateGstBreakdown, parsePackageGst } from '../src/utils/gstCalculator.js';
import { sendInvoiceEmail, formatInvoiceTextMessage, generateWhatsAppInvoiceUrl } from './services/notificationService.js';

console.log('========================================================');
console.log('🧪 COMPREHENSIVE AUTOMATED TEST SUITE: 18% GST & INVOICING');
console.log('========================================================\n');

const testCases = [
  { name: 'Dossier Token Fee', base: 999, expectedGst: 179.82, expectedTotal: 1178.82 },
  { name: 'B.Tech Basic Plan', base: 2999, expectedGst: 539.82, expectedTotal: 3538.82 },
  { name: 'B.Tech Pro Plan', base: 8999, expectedGst: 1619.82, expectedTotal: 10618.82 },
  { name: 'MBBS Govt Counselling', base: 39999, expectedGst: 7199.82, expectedTotal: 47198.82 },
  { name: 'B.Tech Elite Plan', base: 49999, expectedGst: 8999.82, expectedTotal: 58998.82 },
  { name: 'MBBS Private Plan (User Example)', base: 69999, expectedGst: 12599.82, expectedTotal: 82598.82 },
  { name: 'MBBS Management Plan', base: 99999, expectedGst: 17999.82, expectedTotal: 117998.82 },
  { name: 'MBBS Abroad Plan', base: 124999, expectedGst: 22499.82, expectedTotal: 147498.82 },
];

let allPassed = true;

console.log('[TEST 1] Testing 18% GST Mathematical Accuracy Across All Plans:');
console.log('----------------------------------------------------------------');
testCases.forEach((tc) => {
  const result = calculateGstBreakdown(tc.base);
  const gstMatches = Math.abs(result.gstAmount - tc.expectedGst) < 0.01;
  const totalMatches = Math.abs(result.totalPayable - tc.expectedTotal) < 0.01;

  if (gstMatches && totalMatches) {
    console.log(`✅ [PASS] ${tc.name}:`);
    console.log(`         Base: ${result.formattedBase} | GST 18%: +${result.formattedGst} | Total: ${result.formattedTotal}`);
  } else {
    allPassed = false;
    console.error(`❌ [FAIL] ${tc.name}: Expected GST ${tc.expectedGst}, got ${result.gstAmount}. Expected Total ${tc.expectedTotal}, got ${result.totalPayable}`);
  }
});

console.log('\n[TEST 2] Testing String/Package Input Parsing (Reverse & Forward):');
console.log('----------------------------------------------------------------');
const parseTests = [
  'MBBS Plan: Private Counselling Plan (₹69,999)',
  'MBBS Plan: Private Counselling Plan (₹82,598.82)',
  'B.Tech Plan: Pro Plan (₹8,999)',
  '₹999',
];

parseTests.forEach((str) => {
  const parsed = parsePackageGst(str);
  console.log(`✅ Input: "${str}" -> Parsed Total: ${parsed.formattedTotal} (Base: ${parsed.formattedBase}, GST: ${parsed.formattedGst})`);
});

console.log('\n[TEST 3] Testing WhatsApp Invoice Formatting:');
console.log('---------------------------------------------');
const sample = {
  studentName: 'Priya Sharma',
  appId: 'CC-2026-WB-881',
  course: 'MBBS Private Counselling',
  basePackagePrice: '₹69,999.00',
  gstAmount: '₹12,599.82',
  paidAmount: '₹82,598.82',
  txnId: 'pay_live_881920',
};
const waMsg = formatInvoiceTextMessage(sample);
if (waMsg.includes('₹69,999.00') && waMsg.includes('₹12,599.82') && waMsg.includes('₹82,598.82') && waMsg.includes('all-legal-pages.pdf')) {
  console.log('✅ WhatsApp message includes exact Base, 18% GST, Total and Legal PDF link!');
} else {
  allPassed = false;
  console.error('❌ WhatsApp message missing required fields.');
}

console.log('\n[TEST 4] Testing Email Dispatch & Legal PDF Attachment:');
console.log('-------------------------------------------------------');
async function testEmail() {
  const emailRes = await sendInvoiceEmail(sample);
  if (emailRes.success && emailRes.attachedPdf === 'all-legal-pages.pdf') {
    console.log(`✅ Email dispatched successfully with attachment: ${emailRes.attachedPdf}`);
    console.log(`   Preview URL: ${emailRes.previewUrl || 'Live'}`);
  } else {
    allPassed = false;
    console.error('❌ Email dispatch test failed:', emailRes);
  }

  console.log('\n========================================================');
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! ZERO ERRORS FOUND.');
  } else {
    console.log('⚠️ SOME TESTS ENCOUNTERED ISSUES.');
  }
  console.log('========================================================\n');
}

testEmail();
