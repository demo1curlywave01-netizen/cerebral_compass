-- =========================================================================
-- CEREBRAL COMPASS — SUPABASE POSTGRESQL SCHEMA & RLS SETUP
-- =========================================================================

-- 1. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_name TEXT NOT NULL,
    parent_name TEXT,
    dob DATE,
    mobile VARCHAR(15) NOT NULL,
    whatsapp VARCHAR(15) NOT NULL,
    email TEXT NOT NULL,
    aadhaar VARCHAR(20) NOT NULL,
    aadhaar_verified BOOLEAN DEFAULT true,
    address TEXT,
    state TEXT DEFAULT 'Delhi NCR',
    course_interested TEXT NOT NULL,
    entrance_exam TEXT,
    rank_score TEXT,
    category TEXT DEFAULT 'General / UR',
    tenth_details TEXT,
    twelfth_details TEXT,
    budget TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    package_selected TEXT DEFAULT 'Standard Counselling Dossier',
    payment_status TEXT DEFAULT 'Paid & Confirmed ✓',
    transaction_id TEXT,
    paid_amount TEXT DEFAULT '₹999',
    current_stage TEXT DEFAULT 'Document Verification',
    assigned_counsellor JSONB DEFAULT '{"name": "Dr. Vikram Sethi", "title": "Chief Medical & NEET Advisor"}'::jsonb,
    admin_notes TEXT,
    status TEXT DEFAULT 'Under Review'
);

-- 2. Create Inquiries / Contact Leads Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY DEFAULT concat('INQ-', extract(epoch from now())::bigint),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email TEXT,
    stream TEXT,
    message TEXT,
    status TEXT DEFAULT 'New Lead',
    counsellor_assigned TEXT
);

-- 3. Create Payments & Financial Ledger Table
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY DEFAULT concat('PAY-', extract(epoch from now())::bigint),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    application_id TEXT,
    student_name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    amount NUMERIC DEFAULT 999,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method VARCHAR(50) DEFAULT 'Razorpay UPI',
    transaction_id TEXT,
    status TEXT DEFAULT 'Completed'
);

-- 4. Create Indexes for High Performance Search
CREATE INDEX IF NOT EXISTS idx_applications_mobile ON public.applications (mobile);
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_course ON public.applications (course_interested);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON public.applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_app_id ON public.payments (application_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 6. Policies: Allow public anonymous insert for student submissions
CREATE POLICY "Allow anonymous submission" ON public.applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public lookup by ID or read for Admin" ON public.applications
    FOR SELECT USING (true);

CREATE POLICY "Allow update for Admin" ON public.applications
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete for Admin" ON public.applications
    FOR DELETE USING (true);

-- Policies for Inquiries
CREATE POLICY "Allow anonymous inquiry insert" ON public.inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read inquiries" ON public.inquiries
    FOR SELECT USING (true);

CREATE POLICY "Allow update inquiries" ON public.inquiries
    FOR UPDATE USING (true);

-- Policies for Payments
CREATE POLICY "Allow payment insert" ON public.payments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read payments" ON public.payments
    FOR SELECT USING (true);

-- =========================================================================
-- OPTIONAL SAMPLE SEED DATA (To verify dashboard immediately)
-- =========================================================================
INSERT INTO public.applications (id, student_name, parent_name, mobile, whatsapp, email, aadhaar, aadhaar_verified, course_interested, entrance_exam, rank_score, category, package_selected, payment_status, transaction_id, paid_amount, current_stage)
VALUES 
('CC-2026-89211', 'Aarav Sharma', 'Dr. Rajesh Sharma', '9811234567', '9811234567', 'aarav.sharma@gmail.com', '4589 1234 9876', true, 'MBBS / Medical (NEET UG)', 'NEET UG 2026', '642 / 720 (AIR 14,200)', 'General / UR', 'Medical Complete Admission Assistance', 'Paid & Confirmed ✓', 'pay_rzp_neet_89211', '₹29,999', 'Choice Filling Sheet Prepared'),
('CC-2026-74102', 'Priya Verma', 'Sunil Verma', '9876543219', '9876543219', 'priya.verma@outlook.com', '5678 9012 3456', true, 'B.Tech / Engineering (JEE Main & Adv)', 'JEE Mains 2026', '98.6 Percentile', 'OBC-NCL', 'Engineering Complete Admission Assistance', 'Paid & Confirmed ✓', 'pay_rzp_jee_74102', '₹24,999', 'Document Verification'),
('CC-2026-63045', 'Rohan Kulkarni', 'Anand Kulkarni', '9822334455', '9822334455', 'rohan.k@gmail.com', '7890 1234 5678', true, 'MBA / Management (CAT & XAT)', 'CAT 2025', '96.4 Percentile', 'General / UR', 'Management Career Pathway', 'Paid & Confirmed ✓', 'pay_rzp_mba_63045', '₹19,999', 'Round 1 Allotment Tracking')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inquiries (name, phone, email, stream, message, status)
VALUES 
('Vikrant Singh', '9899112233', 'vikrant.s@gmail.com', 'MBBS (AIQ vs State Quota)', 'Need help with UP State NEET UG Round 1 choice filling.', 'New Lead'),
('Sanya Malhotra', '9818884422', 'sanya.m@yahoo.com', 'B.Tech CS Admissions', 'Want to know best NIT options for 97 percentile.', 'In Progress')
ON CONFLICT DO NOTHING;

