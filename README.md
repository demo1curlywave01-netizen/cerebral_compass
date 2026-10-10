# 🧭 Cerebral Compass — Educational Consultancy Web Platform

> **"Your Career. Your Direction. Your Future."**  
> Premium 3D animated educational consultancy platform for MBBS, B.Tech, MBA, UG/PG, and Study Abroad admissions with real-time cutoff guidance, secure multi-step document vaulting, and Razorpay payment integration.

---

## 🎨 Brand Identity & Color System
The visual styling is calibrated to the official **`logo.jpeg`**:
- **Primary Cerulean / Celestial Azure:** `#328ab2`, `#2b7ea4`, `#3895c1`
- **Accent Coral / Orange-Red:** `#e0533c`
- **Deep Space Navy Surfaces:** `#050a12`, `#0a1420`, `#0d2b3c`
- **Tactile Elements:** Frosted glassmorphism (`backdrop-blur-xl`), 3D perspective mouse tilt, glowing azimuth HUD, and Web Audio API synthesizer clicks/chimes.

---

## 🚀 Key Features & 6-Page Architecture

### 1. Home (`/`)
- **3D Animated Three.js Compass Hero**:
  - Interactive multi-tiered gimbal rings, dual-point cyan & coral 3D compass rose needle.
  - Floating 3D graduation cap (mortarboard) and neural cortex brain mesh with pulsing synaptic nodes matching the logo.
  - 3D drag rotation + Cardinal heading alignment buttons (MBBS 000° North, B.Tech 090° East, MBA 180° South, Abroad 270° West).
- **Interactive "Find Your Direction" Diagnostic Engine**:
  - 3-step calculation tool matching student stream, qualifications, and budget to calculate career bearings and safe/target colleges.
- **5-Stage Counselling Process Timeline**.
- **Verified Student & Parent Testimonials** with stream filter pills.
- **Direct WhatsApp & Instant Consultation Callouts**.

### 2. Courses & Services (`/courses`)
- Deep-dive verticals:
  - **MBBS / Medical Counselling** (NEET UG/PG, AIQ, State, Deemed, Central).
  - **B.Tech / Engineering** (JoSAA, CSAB Spot, BITS, VIT, COMEDK).
  - **MBA / Management** (CAT, XAT, SNAP, GMAT, GD-PI-WAT).
  - **UG & PG** (CUET, Law CLAT, Pure Sciences).
  - **Study Abroad** (NMC-compliant Medical, US/UK/German STEM & Business).
- **Institutional Pillars**: College Shortlisting Matrix, Application & Documentation Assistance, Education-Loan Support (SBI, HDFC Credila, Avanse).
- Instant search filter and modal syllabus viewer.

### 3. Counselling / Application Multi-Step Form (`/application`)
- **Step 1 — Personal Details**: Student name, parent/guardian, DOB, mobile, WhatsApp, email, address, state.
- **Step 2 — Academic Details**: Course interest, entrance exam, rank/score, category, 10th/12th percentages, preferred states, budget.
- **Step 3 — Preferences**: India vs Abroad, preferred colleges, course specialization, hostel requirements, education loan request.
- **Step 4 — Document Upload**: Photograph, ID proof, 10th cert, 12th cert, entrance scorecard, category cert, and other docs. Encrypted simulated vault with file size check and preview.
- **Step 5 — Review & Submit**: Comprehensive dossier summary, confirmation of accuracy, acceptance of Terms & Conditions + Privacy Policy.
- Dispatches to backend API `/api/applications` and redirects to Client Dashboard with unique Application ID (e.g. `CC-2026-42172`).

### 4. Counselling Packages & Payment (`/packages`)
- **Personalised Counselling** (₹14,999)
- **Complete Admission Assistance** (₹29,999) — Most Selected
- **Global / Medical VIP Elite** (₹49,999)
- Comprehensive side-by-side feature comparison matrix.
- **Razorpay Payment Gateway Modal**:
  - UPI / QR Code scan simulation.
  - Credit/Debit cards with live validation.
  - NetBanking & Wallets.
  - Webhook & signature verification updating candidate status to `Paid & Confirmed ✓`.

### 5. About & Contact (`/about`)
- **The Cerebral Compass Story**: Eradicating seat misguidance through statistical cutoff modeling.
- **Principal Counsellors Leadership**: Dr. Vikram Sethi (Medical), Er. Ananya Sengupta (Engineering), Rohan Varma (Management/Global).
- **Interactive Contact Form** (dispatches to `/api/contact`).
- Direct WhatsApp helpline & physical headquarters coordinates (Noida, NCR).
- Interactive Categorized FAQ Accordion.

### 6. Legal & Compliance (`/legal`)
- Terms & Conditions
- Privacy Policy (DPDP Act 2023 & GDPR standard)
- Payment & Refund Policy (Clear 80% pre-session refund clause)
- Cancellation Policy
- Document & Data Handling Security (Cloud isolation & 90-day purging)
- Statutory Admission Outcome Disclaimer (MCC/JoSAA regulatory primacy)
- Support & Grievance Redressal Contacts

### 7. Client Dashboard (`/dashboard`)
- Real-time tracker with **"Application Received ✓"**.
- 5-Stage visual pipeline: `Application → Documents → Payment → Counselling → Admission Support`.
- Live application status, payment status badge, uploaded documents vault, assigned counsellor profile card with direct WhatsApp button, and dossier download.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite 5, Tailwind CSS, Three.js (3D Compass), Lucide Icons, Canvas Confetti, Web Audio API sound synthesizer.
- **Backend API**: Node.js, Express, Multer (secure file uploads), CORS.
- **Data Persistence**: JSON Document Store (`server/data/applications.json`), static uploads directory (`server/uploads/`).
- **Resilience**: Frontend API client includes automatic fallback to `localStorage` ensuring zero downtime.

---

## 🏃 Running the Application

### Option A: Run Both Frontend & Backend Concurrently
```bash
npm run dev
```

### Option B: Run Individually
- **Backend API (Port 5000):**
  ```bash
  npm run server
  ```
- **Frontend App (Port 3000):**
  ```bash
  npm run client
  ```

Visit **`http://localhost:3000`** in your browser.
