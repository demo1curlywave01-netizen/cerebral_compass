/**
 * GST Calculation Utility for Cerebral Compass
 * Standard GST Rate for Educational Advisory Services: 18%
 */

export const GST_RATE = 0.18; // 18% GST

const formatInr = (num) => {
  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Calculates itemized GST breakdown from a base price
 * Formula:
 * - Base = P
 * - GST 18% = P * 0.18
 * - Total = P + (P * 0.18)
 *
 * Example:
 * Base = ₹69,999.00
 * GST 18% = ₹12,599.82
 * Total = ₹82,598.82
 *
 * @param {number|string} basePrice
 * @returns {object} { basePrice, gstAmount, totalPayable, formattedBase, formattedGst, formattedTotal }
 */
export function calculateGstBreakdown(basePrice) {
  if (basePrice === null || basePrice === undefined) {
    return null;
  }

  const numericBase = typeof basePrice === 'string'
    ? parseFloat(basePrice.replace(/[^0-9.]/g, ''))
    : Number(basePrice);

  if (isNaN(numericBase) || numericBase <= 0) {
    return null;
  }

  // Exact 18% GST Calculation
  const gstAmount = Math.round(numericBase * GST_RATE * 100) / 100;
  const totalPayable = Math.round((numericBase + gstAmount) * 100) / 100;

  return {
    basePrice: numericBase,
    gstRate: '18%',
    gstRatePercent: 18,
    gstAmount: gstAmount,
    totalPayable: totalPayable,
    formattedBase: formatInr(numericBase),
    formattedGst: formatInr(gstAmount),
    formattedTotal: formatInr(totalPayable),
  };
}

/**
 * Parses package strings or amounts and returns the full 18% GST breakdown.
 * Also handles known package tiers if a string is provided.
 */
export function parsePackageGst(input) {
  if (!input) {
    return calculateGstBreakdown(999);
  }

  // If already an object with formattedTotal
  if (typeof input === 'object' && input.totalPayable) {
    return input;
  }

  const str = String(input);

  // Check known standard package base prices:
  const knownTiers = [
    { key: 'private', base: 69999 },
    { key: 'govt', base: 39999 },
    { key: 'mgmt', base: 99999 },
    { key: 'abroad', base: 124999 },
    { key: 'elite', base: 49999 },
    { key: 'premium', base: 69999 },
    { key: 'pro', base: 8999 },
    { key: 'basic', base: 2999 },
    { key: 'dossier', base: 999 },
    { key: 'token', base: 999 },
  ];

  // Try matching known keyword if price not explicitly isolated
  const lower = str.toLowerCase();
  for (const tier of knownTiers) {
    if (lower.includes(tier.key) && !str.includes('₹')) {
      return calculateGstBreakdown(tier.base);
    }
  }

  // Extract first number in string
  const match = str.match(/₹?([0-9,]+(?:\.[0-9]{1,2})?)/);
  if (match && match[1]) {
    const val = parseFloat(match[1].replace(/,/g, ''));
    if (!isNaN(val) && val > 0) {
      // Check if this number is already a Total with 18% (e.g. 82598.82)
      // Reverse check: if (val / 1.18) is very close to an integer
      const reverseBase = Math.round(val / (1 + GST_RATE));
      if (Math.abs(Math.round(reverseBase * (1 + GST_RATE) * 100) / 100 - val) < 0.05 && reverseBase >= 999) {
        return calculateGstBreakdown(reverseBase);
      }
      return calculateGstBreakdown(val);
    }
  }

  return calculateGstBreakdown(999);
}

/**
 * Formats a currency number with 2 decimal places in Indian Rupees (INR)
 */
export function formatCurrencyINR(amount) {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : Number(amount);
  if (isNaN(num)) return '₹0.00';
  return formatInr(num);
}
