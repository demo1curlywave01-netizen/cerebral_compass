import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const counterFile = path.resolve(__dirname, '..', 'data', 'ref_counter.json');
const appsFile = path.resolve(__dirname, '..', 'data', 'applications.json');

/**
 * Generate next sequential reference ID:
 * Format: CC-<sno><YY>
 * Example: CC-0126, CC-0226, CC-0326...
 * - CC-: Cerebral Compass
 * - 01: Serial No (padded to at least 2 digits)
 * - 26: Year (last 2 digits of year, e.g. 2026 -> 26)
 */
export function getNextApplicationId() {
  const now = new Date();
  const year2Digits = String(now.getFullYear()).slice(-2);

  let lastSno = 0;

  // 1. Check persistent ref_counter.json
  if (fs.existsSync(counterFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(counterFile, 'utf8'));
      if (typeof data.lastSno === 'number') {
        lastSno = data.lastSno;
      }
    } catch (err) {
      console.error('Error reading ref_counter.json:', err);
    }
  } else if (fs.existsSync(appsFile)) {
    try {
      const apps = JSON.parse(fs.readFileSync(appsFile, 'utf8'));
      if (Array.isArray(apps)) {
        for (const app of apps) {
          const id = String(app.id || '');
          const match = id.match(/^CC-(\d+)(\d{2})$/i);
          if (match) {
            const sno = parseInt(match[1], 10);
            if (!isNaN(sno) && sno > lastSno) {
              lastSno = sno;
            }
          }
        }
      }
    } catch (e) {
      lastSno = 0;
    }
  }

  const nextSno = lastSno + 1;
  const snoStr = String(nextSno).padStart(2, '0');
  const nextId = `CC-${snoStr}${year2Digits}`;

  // Persist updated counter
  try {
    const dataDir = path.dirname(counterFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(
      counterFile,
      JSON.stringify({ lastSno: nextSno, lastId: nextId, updatedAt: now.toISOString() }, null, 2),
      'utf8'
    );
  } catch (err) {
    console.error('Error saving ref_counter.json:', err);
  }

  return nextId;
}

export function peekNextApplicationId() {
  const now = new Date();
  const year2Digits = String(now.getFullYear()).slice(-2);
  let lastSno = 0;
  if (fs.existsSync(counterFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(counterFile, 'utf8'));
      if (typeof data.lastSno === 'number') lastSno = data.lastSno;
    } catch (e) {}
  }
  const nextSno = lastSno + 1;
  return `CC-${String(nextSno).padStart(2, '0')}${year2Digits}`;
}
