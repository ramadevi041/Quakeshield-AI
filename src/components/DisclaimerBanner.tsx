import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { translations } from '../utils/i18n';

interface Props {
  language: SupportedLanguage;
}

export const DisclaimerBanner: React.FC<Props> = ({ language }) => {
  const [expanded, setExpanded] = useState(false);
  const t = translations[language];

  return (
    <aside aria-label="Scientific earthquake disclaimer" className="bg-gradient-to-r from-amber-950/40 via-blue-950/30 to-amber-950/40 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-200/90 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-amber-300 mr-2 tracking-wide uppercase text-[11px]">
              Scientific Mandate:
            </span>
            <span>{t.disclaimer}</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-100 font-medium underline underline-offset-2 ml-auto sm:ml-2 cursor-pointer transition-colors"
        >
          {expanded ? 'Less Details' : 'Scientific Basis'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 text-[11px] leading-relaxed">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">1. Earthquake Hazard & Risk:</span>
            Refers to long-term probabilistic seismic hazard assessments (PSHA) derived from historical earthquakes, active fault mappings, and geotechnical soil profiles.
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">2. Earthquake Early Warning (EEW):</span>
            Alerts issued <em>after</em> an earthquake fault ruptures. High-speed electronic telemetry detects primary P-waves and provides seconds of warning before damaging S-waves arrive.
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">3. What Science Cannot Do:</span>
            No scientific agency or AI can currently predict the precise day, hour, or epicenter of an uninitiated earthquake. Preparedness and drills save lives.
          </div>
        </div>
      )}
    </aside>
  );
};
