import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappUrl =
    'https://wa.me/917779820944?text=Hello%20Cerebral%20Compass%20Pvt%20Ltd,%20I%20need%20expert%20career%20counselling%20guidance.';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Chat"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 border border-emerald-400/40"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="w-2 h-2 rounded-full bg-white absolute top-0 right-0 animate-ping" />
        </div>
        <span className="hidden sm:inline">Connect on WhatsApp</span>
        <span className="sm:hidden">WhatsApp</span>
      </a>
    </div>
  );
}
