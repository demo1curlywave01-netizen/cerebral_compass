import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickPrompts = [
    'Need NEET 2026/27 MBBS cutoff advice',
    'Help with JEE Main / JoSAA Choice Filling',
    'Colleges matching my budget & rank',
    'Education loan collateral-free enquiry',
  ];

  const handleSend = (textToSend) => {
    const query = encodeURIComponent(textToSend || message || 'Hello Cerebral Compass, I need career counselling.');
    window.open(`https://wa.me/919876543210?text=${query}`, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-white border border-emerald-200 shadow-2xl p-4 text-slate-800 backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-sky-50 border border-emerald-300 flex items-center justify-center p-1">
                  <img
                    src="/logo-emblem.png"
                    alt="Counsellor Avatar"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-white animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  Senior Counsellor Desk
                </h4>
                <p className="text-[11px] text-emerald-600 font-mono font-semibold">
                  Online • Replies in &lt; 5 mins
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal">
              👋 Welcome to <strong className="text-slate-900 font-bold">Cerebral Compass</strong>! How can our senior admission directors guide your journey today?
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Quick Topics:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    
                    handleSend(prompt);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-brand-400 text-xs text-slate-700 hover:text-brand-800 transition-colors flex items-center gap-1.5 font-medium"
                >
                  <Sparkles className="w-3 h-3 text-brand-600 shrink-0" />
                  <span className="truncate">{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(message);
            }}
            className="flex items-center gap-2 pt-2 border-t border-slate-100"
          >
            <input
              type="text"
              placeholder="Type your rank or exam..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Pill Button */}
      <button
        onClick={() => {
          
          setIsOpen(!isOpen);
        }}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="w-2 h-2 rounded-full bg-white absolute top-0 right-0 animate-ping" />
        </div>
        <span className="hidden sm:inline">Connect on WhatsApp</span>
        <span className="sm:hidden">WhatsApp</span>
      </button>
    </div>
  );
}
