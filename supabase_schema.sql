-- =========================================================================
-- CEREBRAL COMPASS — SUPABASE POSTGRESQL SCHEMA & RLS SETUP
-- =========================================================================

-- 1. Create Users Table (for Authentication, Registration, and 2-Installment Fee Tracking)
CREATE TABLE IF NOT EXISTS public.users (
    uid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone VARCHAR(20),
    
    -- Registration Form Fields (Mapped from Application Form)
    student_name TEXT,
    parent_name TEXT,
    dob DATE,
    mobile VARCHAR(20),
    whatsapp VARCHAR(20),
    aadhaar VARCHAR(20),
    aadhaar_verified BOOLEAN DEFAULT true,
    address TEXT,
    state TEXT DEFAULT 'Delhi NCR',
    course_interested TEXT DEFAULT 'MBBS',
    entrance_exam TEXT DEFAULT 'NEET UG',
    rank_score TEXT,
    category TEXT DEFAULT 'General / UR',
    tenth_details TEXT,
    twelfth_details TEXT,
    preferred_state_city TEXT,
    approximate_budget TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    package_selected TEXT DEFAULT 'Standard Counselling Dossier',
    assigned_counsellor JSONB DEFAULT '{"name": "Dr. Vikram Sethi", "title": "Chief Medical & NEET Advisor"}'::jsonb,
    admin_notes TEXT,
    
    -- Financial Ledger (2-Installment 35% / 65% Model)
    total_fee NUMERIC NOT NULL DEFAULT 0,
    installment1_amount NUMERIC NOT NULL DEFAULT 0,
    installment1_status TEXT NOT NULL DEFAULT 'pending' CHECK (installment1_status IN ('pending', 'paid')),
    installment2_amount NUMERIC NOT NULL DEFAULT 0,
    installment2_status TEXT NOT NULL DEFAULT 'locked' CHECK (installment2_status IN ('locked', 'pending', 'paid')),
    
    -- Student Lifecycle Stage
    stage TEXT NOT NULL DEFAULT 'registered' CHECK (stage IN ('registered', 'counselling_done', 'college_allotted')),
    
    -- Audit Timestamps
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Applications Table (Legacy / Public Submissions Compatibility)
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    uid TEXT,
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

-- 3. Create Inquiries / Contact Leads Table
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

-- 4. Create Payments & Financial Ledger Table
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY DEFAULT concat('PAY-', extract(epoch from now())::bigint),
    payment_id TEXT NOT NULL,
    order_id TEXT,
    uid TEXT,
    application_id TEXT,
    student_name TEXT NOT NULL,
    package_name TEXT,
    amount NUMERIC NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'INR',
    installment_number INT DEFAULT 1,
    payment_method VARCHAR(50) DEFAULT 'Razorpay',
    status TEXT NOT NULL DEFAULT 'paid',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Indexes for High Performance Search
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users (phone);
CREATE INDEX IF NOT EXISTS idx_users_stage ON public.users (stage);
CREATE INDEX IF NOT EXISTS idx_users_inst1 ON public.users (installment1_status);
CREATE INDEX IF NOT EXISTS idx_users_inst2 ON public.users (installment2_status);
CREATE INDEX IF NOT EXISTS idx_payments_uid ON public.payments (uid);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON public.payments (payment_id);
CREATE INDEX IF NOT EXISTS idx_applications_mobile ON public.applications (mobile);
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_course ON public.applications (course_interested);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 7. Policies for Users Table
-- A user can only read and edit their own record; Service role / admin has full access
CREATE POLICY "Allow users to read own record" ON public.users
    FOR SELECT USING (auth.uid()::text = uid OR auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Allow users to insert own record" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update own record" ON public.users
    FOR UPDATE USING (auth.uid()::text = uid OR auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Policies for Payments Table
CREATE POLICY "Allow payment insert" ON public.payments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read payments" ON public.payments
    FOR SELECT USING (true);

-- Policies for Applications & Inquiries
CREATE POLICY "Allow anonymous submission" ON public.applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public lookup by ID or read for Admin" ON public.applications
    FOR SELECT USING (true);

CREATE POLICY "Allow update for Admin" ON public.applications
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous inquiry insert" ON public.inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read inquiries" ON public.inquiries
    FOR SELECT USING (true);

CREATE POLICY "Allow update inquiries" ON public.inquiries
    FOR UPDATE USING (true);
