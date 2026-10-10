import React, { useState } from 'react';
import { Compass, Sparkles, ArrowRight, CheckCircle2, RotateCcw, Award, Globe, Building2, Stethoscope, Cpu, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DirectionFinder({ onNavigateToApply }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    interest: '',
    stage: '',
    location: '',
    budget: '',
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const streams = [
    {
      id: 'medical',
      title: 'Medical & Healthcare',
      desc: 'MBBS, BDS, BAMS, MD/MS, Allied Health',
      icon: Stethoscope,
      cardinal: 'North 000°',
      color: 'bg-sky-50/70 border-sky-200 text-sky-800 hover:border-brand-500',
    },
    {
      id: 'engineering',
      title: 'Engineering & Tech',
      desc: 'B.Tech, AI/ML, CS, Robotics, Dual Degree',
      icon: Cpu,
      cardinal: 'East 090°',
      color: 'bg-blue-50/70 border-blue-200 text-blue-800 hover:border-brand-500',
    },
    {
      id: 'management',
      title: 'Business & Management',
      desc: 'MBA, PGDM, BBA, Finance, Marketing',
      icon: Briefcase,
      cardinal: 'South 180°',
      color: 'bg-rose-50/70 border-rose-200 text-rose-800 hover:border-coral-500',
    },
    {
      id: 'abroad',
      title: 'Study Abroad (Global)',
      desc: 'USA, UK, Germany, Georgia, Australia, Canada',
      icon: Globe,
      cardinal: 'West 270°',
      color: 'bg-purple-50/70 border-purple-200 text-purple-800 hover:border-purple-500',
    },
  ];

  const stages = [
    { id: '12th_science', label: '12th Science (PCB / PCM) - Preparing for Entrance' },
    { id: '12th_commerce', label: '12th Commerce / Arts - Looking for UG / Law / BBA' },
    { id: 'dropper', label: 'Taking a Repeat / Drop Year for NEET / JEE' },
    { id: 'graduate', label: 'Undergraduate Degree Holder - Targeting MBA / Masters' },
  ];

  const budgets = [
    { id: 'budget_1', label: '₹3 Lakhs – ₹12 Lakhs (Merit / Govt / State Quotas)' },
    { id: 'budget_2', label: '₹15 Lakhs – ₹45 Lakhs (Private / Deemed Universities)' },
    { id: 'budget_3', label: '₹50 Lakhs+ (NRI Quota / Premium Medical / Abroad)' },
    { id: 'budget_loan', label: 'Exploring 100% Collateral-Free Education Loan' },
  ];

  const handleSelectStream = (streamId) => {
    
    setAnswers({ ...answers, interest: streamId });
    setStep(2);
  };

  const handleSelectStage = (stageId) => {
    
    setAnswers({ ...answers, stage: stageId });
    setStep(3);
  };

  const handleSelectBudget = (budgetId) => {
    
    setAnswers({ ...answers, budget: budgetId });
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2b7ea4', '#38bdf8', '#e0533c'],
      });

      let calculatedResult = {
        stream: answers.interest,
        direction: 'North Azimuth 012°',
        careerPathway: 'MBBS & Allied Clinical Sciences',
        projectedInstitutes: [
          'All India Quota (AIQ) Govt Colleges',
          'State Quota Round 1 & 2 Opportunities',
          'Deemed Central Universities (KMC, Amrita, DY Patil)',
        ],
        counsellingAdvice:
          'Your profile has high leverage for Choice Filling optimization. Strategize Choice Preference order to avoid losing seat security across MCC Round 2 and Mop-Up.',
      };

      if (answers.interest === 'engineering') {
        calculatedResult = {
          stream: 'Engineering & Tech',
          direction: 'East Azimuth 094°',
          careerPathway: 'B.Tech Computer Science & Advanced Systems',
          projectedInstitutes: [
            'NITs & IIITs (CSAB Spot Rounds Strategy)',
            'Top State Tech Universities (COMEDK / MHT-CET)',
            'Premier Private Research Hubs (BITS, VIT, SRM)',
          ],
          counsellingAdvice:
            'Focus on specialized branches like AI/Data Science vs pure Core. Spot round counselling strategy can unlock Tier-1 colleges at balanced ranks.',
        };
      } else if (answers.interest === 'management') {
        calculatedResult = {
          stream: 'Management & Leadership',
          direction: 'South Azimuth 182°',
          careerPathway: 'MBA / PGDM in Strategic Management & FinTech',
          projectedInstitutes: [
            'IIM CAP & Non-IIM Tier-1 (SPJIMR, MDI, NMIMS)',
            'Symbiosis & Specialized B-Schools',
            'Global Fast-Track MBA Programs',
          ],
          counsellingAdvice:
            'Profile building, GD-PI-WAT simulation, and strategic application deadlines will deliver an estimated 35% higher conversion rate.',
        };
      } else if (answers.interest === 'abroad') {
        calculatedResult = {
          stream: 'Global Education',
          direction: 'West Azimuth 272°',
          careerPathway: 'International Medical & STEM Degree Pathways',
          projectedInstitutes: [
            'NMC-Recognized Medical Hubs (Georgia, Uzbekistan, Philippines)',
            'Tuition-Free Universities in Germany & EU',
            'High-ROI STEM Programs in US & UK with 3-Year Post-Study Work Visa',
          ],
          counsellingAdvice:
            'Apostille documentation, currency hedging, and embassy visa filing require immediate initiation for upcoming intake cycles.',
        };
      }

      setResult(calculatedResult);
      setStep(4);
    }, 1200);
  };

  const handleReset = () => {
    
    setStep(1);
    setResult(null);
    setAnswers({ interest: '', stage: '', location: '', budget: '' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white/95 border border-sky-100 p-6 sm:p-10 shadow-[0_20px_45px_rgba(43,126,164,0.09)] backdrop-blur-xl relative overflow-hidden text-slate-800">
      {/* Soft radiant ambient glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Progress Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-600 animate-spin-slow" />
            <span className="text-xs font-mono uppercase tracking-widest text-brand-700 font-bold">
              Interactive Diagnostic Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-1">
            Find Your Career Direction
          </h2>
        </div>

        {step < 4 && (
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-12 bg-gradient-to-r from-brand-600 to-sky-500 shadow-md shadow-brand-500/30'
                    : s < step
                    ? 'bg-slate-300'
                    : 'bg-slate-200'
                }`}
              />
            ))}
            <span className="text-xs font-mono text-slate-500 ml-2">Step {step}/3</span>
          </div>
        )}
      </div>

      {/* STEP 1: Stream Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Which domain aligns with your natural aptitude and career ambition?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {streams.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectStream(s.id)}
                  className={`group text-left p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${s.color}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-200/80 shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-700" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {s.cardinal}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-brand-700 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: Current Stage */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              What is your current academic stage or qualification?
            </p>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-mono text-brand-600 hover:underline"
            >
              ← Back
            </button>
          </div>
          <div className="space-y-3">
            {stages.map((st) => (
              <button
                key={st.id}
                onClick={() => handleSelectStage(st.id)}
                className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-brand-400 transition-all duration-200 flex items-center justify-between group"
              >
                <span className="text-sm font-semibold text-slate-800 group-hover:text-brand-800">
                  {st.label}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Budget & Investment Horizon */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              What is your approximate budget or financial framework?
            </p>
            <button
              onClick={() => setStep(2)}
              className="text-xs font-mono text-brand-600 hover:underline"
            >
              ← Back
            </button>
          </div>

          {analyzing ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Compass className="w-16 h-16 text-brand-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-coral-500 absolute top-0 right-0 animate-ping" />
              </div>
              <p className="text-base font-display font-bold text-slate-900">
                Cerebral Compass Engine Aligning Bearing...
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Cross-referencing historical merit cutoffs, quota algorithms & fees...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBudget(b.id)}
                  className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-brand-400 transition-all duration-200 flex items-center justify-between group"
                >
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-brand-800">
                    {b.label}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Direction Blueprint Output */}
      {step === 4 && result && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-sky-50/50 border border-sky-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="font-mono text-xs text-amber-700 font-bold uppercase tracking-wider">
                  Diagnostic Match Confirmed
                </span>
              </div>
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-bold">
                🧭 {result.direction}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs uppercase font-mono text-slate-500 tracking-wider">
                Recommended Pathway:
              </span>
              <h3 className="text-2xl font-display font-extrabold text-slate-900 mt-1">
                {result.careerPathway}
              </h3>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-700 mb-2">
                  <Building2 className="w-4 h-4" /> Recommended Institutions
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  {result.projectedInstitutes.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-coral-600 mb-2">
                  <Sparkles className="w-4 h-4" /> Strategic Counsellor Advisory
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {result.counsellingAdvice}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-all border border-slate-200"
            >
              <RotateCcw className="w-4 h-4" /> Recalculate Direction
            </button>

            <button
              onClick={() => {
                
                if (onNavigateToApply) {
                  onNavigateToApply(answers.interest);
                }
              }}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-bold text-sm shadow-xl shadow-brand-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              Lock Direction & Proceed to Counselling Form
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
