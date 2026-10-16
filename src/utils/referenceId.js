/**
 * Reference ID Generator for Cerebral Compass Pvt Ltd
 * Format: CC-<sno><YY>
 * Example: CC-0126
 * - CC-: Cerebral Compass
 * - 01: Serial No (padded to at least 2 digits)
 * - 26: Year (last 2 digits of year, e.g. 2026 -> 26)
 */

export function formatReferenceId(sno = 1, date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year2Digits = String(d.getFullYear()).slice(-2);
  const num = parseInt(sno, 10);
  const safeSno = isNaN(num) || num < 1 ? 1 : num;
  const snoStr = String(safeSno).padStart(2, '0');
  return `CC-${snoStr}${year2Digits}`;
}

/**
 * Generate client-side sequential reference ID with localStorage fallback
 */
export function getClientNextReferenceId() {
  let sno = 1;
  try {
    const stored = localStorage.getItem('cc_application_sno');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        sno = parsed + 1;
      }
    }
    localStorage.setItem('cc_application_sno', String(sno));
  } catch (e) {
    sno = 1;
  }
  return formatReferenceId(sno);
}
