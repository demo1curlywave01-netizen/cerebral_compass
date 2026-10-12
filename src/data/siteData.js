export const siteData = {
  brand: {
    name: 'Cerebral Compass Pvt Ltd',
    tagline: 'Your Career. Your Direction. Your Future.',
    subtagline: 'Premier Educational Consultancy for Medical, Engineering, Management, UG/PG and Global Universities.',
    phone: '+91 77798 20944',
    whatsapp: '+916204934005',
    email: 'thecerebralcompass@gmail.com',
    address: 'Muzaffarpur, Bihar - 842002',
    hours: 'Mon - Sat: 10:00 AM - 6:00 PM IST',
  },

  domains: [
    {
      id: 'mbbs',
      title: 'MBBS / Medical Counselling',
      shortTitle: 'MBBS & Medical',
      badge: 'High Demand',
      description: 'Navigating NEET UG/PG, All India Quota (AIQ 15%), State 85% quotas, Deemed Universities, and NRI/Management seat matrices.',
      targetExams: ['NEET UG', 'NEET PG', 'INI-CET'],
      features: [
        'Round-by-round MCC & State cutoff mapping',
        'Deemed University fee vs quality benchmarking',
        'Bond policy, stipend & clinical patient flow analysis',
        'Special Stray Vacancy & Mop-Up strategy'
      ],
      colleges: ['AIIMS Hubs', 'KMC Manipal', 'St. John’s Medical', 'Amrita Kochi', 'DY Patil Pune'],
      color: 'sky'
    },
    {
      id: 'btech',
      title: 'B.Tech / Engineering Admissions',
      shortTitle: 'B.Tech / Engineering',
      badge: 'Tech & STEM',
      description: 'Strategic counselling across JoSAA (IITs/NITs/IIITs), CSAB Spot Rounds, BITSAT, VITEEE, MET, COMEDK, and premier state universities.',
      targetExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'COMEDK'],
      features: [
        'Branch vs College ROI algorithm (CSE / AI / Robotics)',
        'JoSAA preference matrix tailored to individual ranks',
        'State engineering portal multi-counselling sync',
        'Scholarship and fee waiver identification'
      ],
      colleges: ['IITs/NITs/IIITs', 'BITS Pilani', 'VIT Vellore', 'RV College Bangalore', 'Thapar Patiala'],
      color: 'blue'
    },
    {
      id: 'mba',
      title: 'MBA / Management Consultancy',
      shortTitle: 'MBA / Management',
      badge: 'Leadership',
      description: 'End-to-end guidance for CAT, XAT, SNAP, NMAT, GMAT, and CMAT aspirants targeting Tier-1 B-Schools with GD-PI-WAT mentorship.',
      targetExams: ['CAT', 'XAT', 'SNAP', 'NMAT', 'GMAT'],
      features: [
        'Profile evaluation (Academic diversity & work experience)',
        'Specialization advisory: FinTech, Consulting, Product',
        '1-on-1 Mock PI & WAT essay masterclasses',
        'Corporate placement history verified auditing'
      ],
      colleges: ['IIMs (CAP & Non-CAP)', 'SPJIMR Mumbai', 'MDI Gurgaon', 'NMIMS Mumbai', 'XLRI Jamshedpur'],
      color: 'coral'
    },
    {
      id: 'ug_pg',
      title: 'UG & PG Multidisciplinary',
      shortTitle: 'UG & PG Streams',
      badge: 'Comprehensive',
      description: 'Admissions guidance for CUET-UG/PG, Law (CLAT), Architecture (NATA), Pure Sciences, Biotechnology, and Liberal Arts.',
      targetExams: ['CUET UG/PG', 'CLAT', 'NATA', 'IPU-CET'],
      features: [
        'Central & State University domain matching',
        'NLU and Private Law School shortlisting',
        'Integrated 5-Year Masters programs',
        'Hostel, campus culture and safety advisory'
      ],
      colleges: ['Delhi University', 'NLSIU Bangalore', 'Ashoka University', 'BHU Varanasi', 'Christ University'],
      color: 'indigo'
    },
    {
      id: 'abroad',
      title: 'Study Abroad (Global Admissions)',
      shortTitle: 'Study Abroad',
      badge: 'Global Horizons',
      description: 'NMC-compliant Medical seats in Georgia, Uzbekistan & Philippines; plus top STEM & Business degrees in USA, UK, Germany, Canada & Europe.',
      targetExams: ['IELTS', 'TOEFL', 'GRE', 'PTE', 'SAT'],
      features: [
        '100% NMC / WHO compliant foreign medical colleges',
        'Tuition-free public university application in Germany',
        'SOP, LOR, and Visa mock interview coaching',
        'Pre-departure orientation & foreign student hostel support'
      ],
      colleges: ['Tbilisi State Med (Georgia)', 'TUM Germany', 'Univ of Manchester (UK)', 'NEU Boston (USA)', 'Univ of Melbourne'],
      color: 'purple'
    }
  ],

  services: [
    {
      id: 'shortlisting',
      title: 'College Shortlisting & Predictive Matching',
      subtitle: 'Data-driven cutoff analytics',
      description: 'Our proprietary algorithm maps your exact percentile, category rank, and budget across past 5-year closing ranks to create Safe, Moderate, and Ambitious tiers.',
      icon: 'Target',
      highlights: ['Zero guesswork', 'Multi-round projection', 'Fee clarity']
    },
    {
      id: 'documentation',
      title: 'Application & Documentation Assistance',
      subtitle: 'Flawless verification',
      description: 'A dedicated documentation specialist validates every affidavit, domicile, category certificate, apostille, and entrance score card before portal submission.',
      icon: 'FileCheck',
      highlights: ['Error-free portal filings', 'Domicile & category compliance', 'SOP / LOR review']
    },
    {
      id: 'loan',
      title: 'Education-Loan Assistance',
      subtitle: 'Financial freedom & tie-ups',
      description: 'Direct institutional facilitation with leading public banks (SBI, BoB) and premier private NBFCs (HDFC Credila, Avanse, Auxilo) for collateral & collateral-free loans.',
      icon: 'BadgePercent',
      highlights: ['Up to 100% cost of study', 'Lowest interest rate negotiation', 'Fast-track 72hr sanction']
    }
  ],

  processSteps: [
    {
      step: '01',
      title: 'Diagnostic Profile Analysis',
      desc: 'In-depth evaluation of student scores, category advantages, academic trajectory, and parent budget.',
      tag: 'Day 1'
    },
    {
      step: '02',
      title: 'Precision College Matrix',
      desc: 'Formulation of tailored Safe, Target, and Dream college lists with verified fee structures and hostel data.',
      tag: 'Day 3'
    },
    {
      step: '03',
      title: 'Strategic Choice Filling',
      desc: 'Senior counsellor crafts the sequential choice preference lock sheet for MCC, JoSAA, or respective portals.',
      tag: 'Round Opening'
    },
    {
      step: '04',
      title: 'Document Vetting & Filing',
      desc: 'Rigorous pre-verification of all state domicile, caste, medical fitness, and entrance documents.',
      tag: 'Portal Verification'
    },
    {
      step: '05',
      title: 'Seat Allotment & Onboarding',
      desc: 'Guidance through physical reporting, fee deposit verification, upgradation rules, and campus onboarding.',
      tag: 'Admission Success'
    }
  ],

  // Categorized stream-wise pricing packages as requested:
  streamPlans: {
    mbbs: {
      streamTitle: 'MBBS / Medical Counselling Plans',
      tagline: 'NEET UG & PG Specialized Advisory for Govt, Private, Deemed & Abroad Seats',
      plans: [
        {
          id: 'mbbs-govt',
          name: 'Govt Counselling Plan',
          category: 'MBBS Plan',
          price: '₹40,000',
          tax: '+ GST',
          description: 'Comprehensive guidance for All India Quota (MCC 15%) & State Quota (85%) Government Medical Colleges.',
          features: [
            'All India Quota (MCC) + State 85% Quota Choice Filling Sheet',
            'Historical Category & AIR Closing Rank Predictive Mapping',
            'Service Bond Policy, Rural Postings & Stipend Audit',
            'Pre-verification of Domicile, Caste & Medical Fitness Documents',
            'Dedicated Medical Admission Counsellor Support',
            'Round 1, Round 2 & Mop-Up Strategy'
          ],
          popular: false,
          badge: 'Government Seats'
        },
        {
          id: 'mbbs-private',
          name: 'Private Counselling Plan',
          category: 'MBBS Plan',
          price: '₹69,999',
          tax: '+ GST',
          description: 'Specialized counselling for Private Medical Colleges & Open States across India.',
          features: [
            'Multi-State Open Private Portals (Karnataka, UP, Bihar, Haryana, etc.)',
            'Deemed Universities Seat Allocation (KMC, DY Patil, Hamdard, etc.)',
            'Hidden College Fee, Bank Guarantee & Hostel Expense Audit',
            'High-Accuracy Sequenced Choice Preference Sheet',
            'Priority WhatsApp & Calling Support with Senior Counsellor',
            'Fast-track Education Loan Sanction Assistance'
          ],
          popular: true,
          badge: 'Most Popular'
        },
        {
          id: 'mbbs-mgmt',
          name: 'Management Counselling Plan',
          category: 'MBBS Plan',
          price: '₹1,00,000',
          tax: '+ GST',
          description: 'Institutional, Management & NRI Quota seat allocation with director-level guidance.',
          features: [
            'Management & NRI Sponsored Quota Seat Matrix Strategy',
            'Direct Regulatory Liaison with Deemed Medical Authorities',
            'Stray Vacancy & Extended Round Spot Advisory',
            'Senior Admissions Director 1-on-1 Personal Availability',
            'Physical Campus Reporting Escort & Checklist Verification',
            '100% Transparent, Merit-Aligned Process'
          ],
          popular: false,
          badge: 'Management Quota'
        },
        {
          id: 'mbbs-abroad',
          name: 'MBBS Abroad Counselling Plan',
          category: 'MBBS Plan',
          price: '₹1,25,000',
          tax: '+ GST',
          description: 'NMC & WHO Gazette-compliant foreign medical seats with complete visa & travel onboarding.',
          features: [
            '100% NMC Gazette 2021 Compliant Universities (Georgia, Russia, Uzbekistan, etc.)',
            'University Direct Application & Official Ministry Offer Letter',
            'Student Visa Filing, Apostille & Embassy Legalization Guidance',
            'Forex Card, Currency Hedging & Air Ticket Booking Support',
            'On-Campus Airport Pickup & Indian Mess Verification',
            'NEXT / USMLE / FMGE Examination Roadmap Support'
          ],
          popular: false,
          badge: 'Global Medical'
        }
      ]
    },
    btech: {
      streamTitle: 'B.Tech / Engineering Admissions',
      tagline: 'JoSAA, CSAB, Premier State & Top Private Technical Universities',
      plans: [
        {
          id: 'btech-basic',
          name: 'Basic Plan',
          category: 'B.Tech Plan',
          price: '₹2,999',
          tax: '+ GST',
          description: 'Essential percentile matching & curated preference sheet for JEE aspirants.',
          features: [
            'JEE Main Percentile Potential Assessment',
            'Standard Choice Preference Locking Sheet',
            'NIT, IIIT & GFTI Eligibility Report',
            'Portal Timeline & Key Dates Alerts'
          ],
          popular: false,
          badge: 'Starter'
        },
        {
          id: 'btech-pro',
          name: 'Pro Plan',
          category: 'B.Tech Plan',
          price: '₹8,999',
          tax: '+ GST',
          description: 'Comprehensive JoSAA + CSAB Special Round tactical choice filling and branch vs college optimization.',
          features: [
            'Full JoSAA 6-Round Strategic Guidance',
            'CSAB Special Round Spot Counseling Strategy',
            'State Engineering Portals (JAC Delhi, COMEDK, WBJEE)',
            'Branch vs College Placement RoI Analytics (CSE/AI/Robotics)',
            'WhatsApp Dedicated Counsellor Support'
          ],
          popular: false,
          badge: 'Recommended'
        },
        {
          id: 'btech-elite',
          name: 'Elite Plan',
          category: 'B.Tech Plan',
          price: '₹50,000',
          tax: '+ GST',
          description: 'Premier personalized engineering pathway with Top Tier Deemed, BITS, VIT, Manipal, and State spot counselling.',
          features: [
            'Everything in Pro Plan',
            'BITS Pilani, VIT, MIT Manipal, Thapar Special Application Support',
            'Multi-State Simultaneous Counselling Tracking',
            'Document Verification & Seat Float/Slide Advice',
            'Lead Counsellor Direct Access',
            'Fast-Track Education Loan Advisory'
          ],
          popular: false,
          badge: 'Elite Tier'
        },
        {
          id: 'btech-premium',
          name: 'Premium Plan',
          category: 'B.Tech Plan',
          price: '₹69,999',
          tax: '+ GST',
          description: 'Complete white-glove engineering admissions from JEE Main/Adv to final campus onboarding and hostel verification.',
          features: [
            'End-to-End Executive Engineering Admission Mentorship',
            'Institutional & Management Quota Priority Tracking',
            'Unlimited Choice Locking Sheet Revisions',
            '24/7 Priority Emergency Support during Portal Windows',
            'Physical Reporting Checklist & Fee Waiver Consultation',
            'Senior Admissions Director Personal Oversight'
          ],
          popular: true,
          badge: 'Complete VIP'
        }
      ]
    },
    mba: {
      streamTitle: 'MBA / Management Consultancy',
      tagline: 'IIMs, Non-IIM Premier B-Schools, CAT, XAT, SNAP & Tier-1 Institutions',
      plans: [
        {
          id: 'mba-basic',
          name: 'Basic Plan',
          category: 'MBA Plan',
          price: '₹2,999',
          tax: '+ GST',
          description: 'Percentile-to-B-School shortlisting based on CAT / XAT / CMAT / MAT scores.',
          features: [
            'Comprehensive Cutoff & RoI Matrix Report',
            'Tier-1, 2, 3 College Shortlisting List',
            'Application Deadline Alert Calendar',
            'Specialization Match (Marketing/Finance/HR/Ops)'
          ],
          popular: false,
          badge: 'Basic Dossier'
        },
        {
          id: 'mba-pro',
          name: 'Pro Plan',
          category: 'MBA Plan',
          price: '₹69,999',
          tax: '+ GST',
          description: 'End-to-end executive MBA admission mentorship, GD-PI interview preparation, and direct admissions advisory.',
          features: [
            'Everything in Basic Plan',
            '1-on-1 Mock GD / PI / WAT Preparation Sessions',
            'SOP & Resume Profiling by IIM Alumni',
            'Tier-1 Private B-School Application Assistance',
            'Direct Interview Call Negotiation & Profile Evaluation',
            'Full Season Admission Support till Final Offer Letter'
          ],
          popular: true,
          badge: 'Complete Pro'
        }
      ]
    },
    abroad: {
      streamTitle: 'Study Abroad (Global Admissions)',
      tagline: 'USA, UK, Germany, Canada, Europe, Australia & NMC-Compliant Medical Abroad',
      plans: [
        {
          id: 'abroad-custom',
          name: 'Study Abroad Plan',
          category: 'Study Abroad',
          price: 'Based on Course & Country',
          tax: 'Customized Retainer',
          description: 'Customized advisory based on student destination country, target degree (STEM, Business, Medicine), and scholarship eligibility.',
          features: [
            'Destination Country Selection (USA, UK, Germany, Europe, Australia)',
            'Public vs Private University Tuition Assessment',
            'Scholarship & Assistantship Eligibility Audit',
            'Statement of Purpose (SOP) & Letter of Recommendation (LOR) Drafting',
            'IELTS / TOEFL / GRE / GMAT Waiver Guidance',
            'Visa Filing, Mock Consulate Interview & Post-Arrival Settlement'
          ],
          popular: true,
          badge: 'Tailored Pathway'
        }
      ]
    }
  },

  // Legacy flat packages list for general views
  packages: [
    {
      id: 'mbbs-govt',
      name: 'MBBS - Govt Counselling Plan',
      popular: false,
      price: '₹40,000',
      tax: '+ GST',
      description: 'Guidance for All India Quota (MCC 15%) & State Quota (85%) Govt Medical Colleges.',
      features: [
        'All India Quota (MCC) + State 85% Quota Choice Filling Sheet',
        'Historical Category & Rank Cutoff Analysis',
        'Service Bond Policy & Stipend Verification',
        'Document & Domicile Scrutiny'
      ],
      recommendedFor: 'NEET UG Government Medical Seekers'
    },
    {
      id: 'mbbs-private',
      name: 'MBBS - Private Counselling Plan',
      popular: true,
      price: '₹69,999',
      tax: '+ GST',
      description: 'Open State & Deemed Medical Colleges counselling across India.',
      features: [
        'Multi-State Open Private Portals & Deemed Universities',
        'Fee Structure, Bank Guarantee & Surcharge Audits',
        'High-Accuracy Priority Choice Lock Sheet',
        'Fast-Track Education Loan Support'
      ],
      recommendedFor: 'Private & Deemed Medical College Applicants'
    },
    {
      id: 'mbbs-mgmt',
      name: 'MBBS - Management Counselling Plan',
      popular: false,
      price: '₹1,00,000',
      tax: '+ GST',
      description: 'Management & NRI Quota seat allocation with senior director oversight.',
      features: [
        'Management & NRI Sponsored Seat Strategy',
        'Stray Vacancy & Extended Round Spot Advisory',
        'Director 1-on-1 Direct Support',
        'Physical Campus Reporting Escort'
      ],
      recommendedFor: 'Management & Institutional Quota Candidates'
    },
    {
      id: 'mbbs-abroad',
      name: 'MBBS Abroad Counselling Plan',
      popular: false,
      price: '₹1,25,000',
      tax: '+ GST',
      description: '100% NMC & WHO Gazette-compliant foreign medical seats.',
      features: [
        'NMC Gazette 2021 Compliant Universities',
        'Direct Admission Offer Letter & Visa Filing',
        'Forex, Flight & Airport Pickup',
        'NEXT / USMLE Exam Coaching Roadmap'
      ],
      recommendedFor: 'MBBS Abroad Seekers'
    }
  ],

  testimonials: [
    {
      name: 'Aarav Singhania',
      role: 'MBBS Student at KMC Manipal',
      score: 'NEET 632 / 720',
      quote: 'I was terribly confused between All India Round 2 and Karnataka State Quota. Cerebral Compass gave me the exact historical closing trends and saved me from losing a premier seat. Their choice preference sheet was pure gold!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      stream: 'MBBS'
    },
    {
      name: 'Pooja Reddy',
      role: 'B.Tech CSE at NIT Surathkal',
      score: 'JEE Main 99.12 %ile',
      quote: 'CSAB spot rounds are intimidating. The team at Cerebral Compass guided my parents and me step-by-step. Without their strategic branch vs campus advice, I would have settled for a much lower tier.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      stream: 'B.Tech'
    },
    {
      name: 'Dr. Rameshwar Joshi (Parent)',
      role: 'Father of Ananya Joshi (MBBS Abroad)',
      score: 'Admitted in Tbilisi, Georgia',
      quote: 'As a doctor myself, I was very concerned about NMC gazette compliance for foreign MBBS. Cerebral Compass showed transparent documents, assisted with apostille and visa, and my daughter is now thriving.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      stream: 'Study Abroad'
    },
    {
      name: 'Kunal Mathur',
      role: 'MBA Candidate at MDI Gurgaon',
      score: 'CAT 98.4 %ile',
      quote: 'The GD-PI-WAT interview simulations were harder than the actual interviews! That made the real conversion effortless. Best investment I made for my post-grad career.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      stream: 'MBA'
    }
  ],

  counsellors: [
    {
      name: 'Dr. Vikram Sethi',
      title: 'Chief Medical & NEET Advisor',
      exp: '14+ Years in Medical Counselling',
      specialty: 'MCC AIQ, Deemed Universities, State Quotas',
      phone: '+91 98765 43211',
      rating: '4.98/5.0'
    },
    {
      name: 'Er. Ananya Sengupta',
      title: 'Head of Engineering Admissions',
      exp: '11+ Years in JoSAA / CSAB / Tech Systems',
      specialty: 'IITs, NITs, BITS, Top State Engineering',
      phone: '+91 98765 43212',
      rating: '4.95/5.0'
    },
    {
      name: 'Rohan Varma',
      title: 'Director of Management & Global Pathways',
      exp: '12+ Years in B-School & International Visas',
      specialty: 'IIMs, GMAT, USA, UK, Germany & Georgia',
      phone: '+91 98765 43213',
      rating: '4.97/5.0'
    }
  ],

  faqs: [
    {
      q: 'How does Cerebral Compass differ from ordinary admission agents?',
      a: 'We operate with 100% transparency, legal documentation, and data-backed algorithms. We never make false promises of "management quotas" that don’t exist legally. Our senior advisors have over a decade of real experience analyzing official MCC, KEA, JoSAA, and international regulatory seat matrices.'
    },
    {
      q: 'When is the best time to enrol for counselling guidance?',
      a: 'The ideal time is immediately after writing your entrance exams (or during the final prep semester). Early registration enables comprehensive profile auditing, domicile documentation verification, and customized choice matrix formulation before the chaotic counselling portal opens.'
    },
    {
      q: 'Will you handle my document verification and online portal registration?',
      a: 'Yes! In our Complete Admission Assistance package, a dedicated documentation officer cross-verifies all your certificates, helps you avoid formatting errors that cause seat rejections, and guides you through every step of the official portal uploads.'
    },
    {
      q: 'Can you assist with education loans if my family needs financial support?',
      a: 'Absolutely. We have established institutional tie-ups with SBI, Bank of Baroda, HDFC Credila, and Avanse. We assist in preparing the required documentation to expedite sanction, often within 72 hours, with collateral-free options up to ₹50 Lakhs for eligible programs.'
    },
    {
      q: 'What is your refund policy if a student decides not to participate?',
      a: 'We maintain a clear, ethical policy. If you request a cancellation prior to the commencement of your 1-on-1 profile strategy session, you are eligible for an 80% refund. Full details are outlined in our dedicated Legal & Refund Policy page.'
    }
  ]
};
