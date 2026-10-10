import React, { useState, useRef } from 'react';
import { Stethoscope, Cpu, Briefcase, Globe, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CompassHeroNew({ onDirectionSelect, onApplyWithCourse }) {
  const [activeDirection, setActiveDirection] = useState('MBBS');
  const [angle, setAngle] = useState(0);

  const cardinalDomains = [
    {
      code: 'MBBS',
      title: 'MBBS / Medical',
      degree: 0,
      cardinal: 'NORTH 000°',
      tagline: 'NEET UG/PG • MCC AIQ • Deemed Seats',
      colleges: 'AIIMS, KMC Manipal, Amrita, St. John’s',
      color: '#2b7ea4',
      icon: Stethoscope,
    },
    {
      code: 'BTECH',
      title: 'B.Tech / Engineering',
      degree: 90,
      cardinal: 'EAST 090°',
      tagline: 'JoSAA • CSAB Spot • BITSAT • COMEDK',
      colleges: 'Top NITs, IIITs, BITS Pilani, VIT, RVCE',
      color: '#0284c7',
      icon: Cpu,
    },
    {
      code: 'MBA',
      title: 'MBA / Management',
      degree: 180,
      cardinal: 'SOUTH 180°',
      tagline: 'CAT • XAT • SNAP • GMAT • Tier-1 B-Schools',
      colleges: 'IIMs, SPJIMR, MDI Gurgaon, NMIMS',
      color: '#e0533c',
      icon: Briefcase,
    },
    {
      code: 'ABROAD',
      title: 'Study Abroad (Global)',
      degree: 270,
      cardinal: 'WEST 270°',
      tagline: 'NMC Medical (Georgia, Phil.) • US/UK/EU STEM',
      colleges: 'Tbilisi State Med, TUM Germany, NEU Boston',
      color: '#7c3aed',
      icon: Globe,
    },
  ];

  const handleSelectDomain = (domain) => {
    setActiveDirection(domain.code);
    setAngle(domain.degree);
    if (onDirectionSelect) onDirectionSelect(domain.code);
  };

  const activeDomainData = cardinalDomains.find((d) => d.code === activeDirection) || cardinalDomains[0];

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">


      <div
        className="absolute -bottom-4 -right-4 sm:-right-8 z-30 pointer-events-none animate-float hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-sky-200 shadow-lg text-[11px] font-bold text-slate-800"
        style={{ animationDelay: '1.5s' }}
      >
        <Sparkles className="w-3.5 h-3.5 text-coral-500" />
        <span>JoSAA Seat Allotment Rate: 98.8%</span>
      </div>

      {/* Interactive Compass Instrument */}
      <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] flex items-center justify-center select-none">
        {/* Pulsing Luminous Rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400/20 via-blue-500/15 to-rose-400/15 blur-2xl pointer-events-none animate-pulse-slow" />

        {/* Outer Fine Glass Rim */}
        <div className="absolute inset-1 sm:inset-2 rounded-full border-2 border-sky-200/90 bg-white/70 backdrop-blur-md shadow-[0_20px_50px_rgba(43,126,164,0.16)]" />

        {/* Rotating Celestial Degree Ring */}
        <div
          className="absolute inset-5 sm:inset-7 rounded-full border border-sky-300/40 transition-transform duration-700 ease-out"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          {/* Degree Ticks */}
          {[...Array(36)].map((_, i) => {
            const isMajor = i % 9 === 0;
            const isMedium = i % 3 === 0;
            return (
              <div
                key={i}
                className="absolute top-0 left-1/2 -translate-x-1/2 origin-[center_145px] sm:origin-[center_190px]"
                style={{ transform: `rotate(${i * 10}deg)` }}
              >
                <div
                  className={`w-0.5 rounded-full ${
                    isMajor ? 'h-3.5 bg-brand-600' : isMedium ? 'h-2 bg-sky-400' : 'h-1 bg-sky-200'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Dynamic Holographic Target Ring around Logo Emblem */}
        <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-dashed border-sky-400/30 animate-spin-slow pointer-events-none" />

        {/* Center Actual Brand Logo Emblem with smooth hover zoom & floating effect */}
        <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-white to-sky-50 border border-sky-100 shadow-2xl flex items-center justify-center p-3 group transition-transform duration-500 hover:scale-105">
          <img
            src="/logo-emblem.png"
            alt="Cerebral Compass Navigation Emblem"
            className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:rotate-6"
          />

          {/* Compass Needle Tip Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            {/* North Point Tip */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[16px] border-b-sky-600 filter drop-shadow" />
            </div>
            {/* South Point Tip */}
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[16px] border-t-coral-500 filter drop-shadow" />
            </div>
          </div>
        </div>

        {/* 4 Cardinal Direction Touch Nodes (N, E, S, W) */}
        {cardinalDomains.map((domain) => {
          const isCurrent = activeDirection === domain.code;
          let positionClasses = '';
          if (domain.degree === 0) positionClasses = '-top-3 sm:-top-4 left-1/2 -translate-x-1/2';
          if (domain.degree === 90) positionClasses = 'top-1/2 -translate-y-1/2 -right-3 sm:-right-4';
          if (domain.degree === 180) positionClasses = '-bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2';
          if (domain.degree === 270) positionClasses = 'top-1/2 -translate-y-1/2 -left-3 sm:-left-4';

          const Icon = domain.icon;

          return (
            <button
              key={domain.code}
              onClick={() => handleSelectDomain(domain)}
              className={`absolute z-20 ${positionClasses} group focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95`}
            >
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-brand-600/30 scale-105 ring-2 ring-brand-300'
                    : 'bg-white text-slate-700 hover:text-brand-600 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{domain.title.split(' ')[0]}</span>
                <span className="sm:hidden">{domain.code}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Real-time Telemetry & Active Trajectory Card */}
      <div className="w-full mt-6 p-4 sm:p-5 rounded-2xl bg-white/95 border border-sky-100 shadow-[0_15px_30px_rgba(43,126,164,0.09)] backdrop-blur-md transition-all animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold text-brand-700">
              BEARING: {activeDomainData.cardinal}
            </span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-50 text-brand-700 font-bold border border-sky-200">
            🧭 Orientation Aligned
          </span>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-display font-extrabold text-slate-900 text-base">
              {activeDomainData.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {activeDomainData.tagline}
            </p>
            <p className="text-[11px] text-brand-700 font-semibold mt-1">
              🏛️ Key Hubs: {activeDomainData.colleges}
            </p>
          </div>

          <button
            onClick={() => {
              if (onApplyWithCourse) onApplyWithCourse(activeDomainData.code);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 flex items-center justify-center gap-1.5 transition-all hover:scale-105 shrink-0"
          >
            <span>Apply For {activeDomainData.code}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
