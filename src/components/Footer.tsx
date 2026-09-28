import React from 'react';
import { Activity, ShieldAlert, Heart, ExternalLink, Phone } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { translations } from '../utils/i18n';

interface Props {
  language: SupportedLanguage;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<Props> = ({ language, setActiveTab }) => {
  const t = translations[language];

  return (
    <footer className="bg-[#05070e] border-t border-white/10 text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand & Mission */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 text-white">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-extrabold tracking-wider text-base text-white">QUAKESHIELD AI</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Public safety, seismic hazard education, and emergency action platform. Empowering communities with scientific hazard awareness, early warning drills, and immediate life-saving instructions.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-400/90 font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Never predicts earthquakes · Science First</span>
          </div>
        </div>

        {/* Preparedness & Response */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Preparedness & Safety</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('during')} className="hover:text-amber-400 cursor-pointer">
                Immediate Action: Drop, Cover, Hold On
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('preparedness')} className="hover:text-amber-400 cursor-pointer">
                72-Hour Survival Kit Checklist
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('safety-score')} className="hover:text-amber-400 cursor-pointer">
                Calculate Safety Score
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('family-plan')} className="hover:text-amber-400 cursor-pointer">
                Create Family Emergency Plan
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('after')} className="hover:text-amber-400 cursor-pointer">
                Post-Earthquake Hazard Protocol
              </button>
            </li>
          </ul>
        </div>

        {/* Monitoring & Science */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Seismic Technology</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('early-warning')} className="hover:text-amber-400 cursor-pointer">
                How Early Warning (EEW) Operates
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('simulator')} className="hover:text-amber-400 cursor-pointer">
                Interactive Seismic Wave Simulator
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('map')} className="hover:text-amber-400 cursor-pointer">
                USGS Global Real-time Feeds
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('risk')} className="hover:text-amber-400 cursor-pointer">
                Seismic Hazard Assessment (PSHA)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('about')} className="hover:text-amber-400 cursor-pointer">
                Architecture & Engineering Details
              </button>
            </li>
          </ul>
        </div>

        {/* Emergency Assistance */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Emergency Response</h4>
          <div className="bg-red-950/30 border border-red-500/20 p-3 rounded-xl mb-3 space-y-1.5">
            <div className="flex items-center gap-2 text-red-300 font-bold text-xs">
              <Phone className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Universal Emergency Numbers</span>
            </div>
            <p className="text-[11px] text-slate-300">
              USA/Canada: <strong className="text-white">911</strong> · India: <strong className="text-white">112</strong> · Europe: <strong className="text-white">112</strong> · Japan: <strong className="text-white">119</strong>
            </p>
          </div>
          <button
            onClick={() => setActiveTab('contacts')}
            className="w-full py-2 px-3 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Open Full Emergency Directory
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <div>
          © {new Date().getFullYear()} QuakeShield AI. Open Public Safety Initiative. Built with USGS Earthquake Hazards Program data models & Gemini AI.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('about')} className="hover:text-slate-200 cursor-pointer">
            Scientific Documentation
          </button>
          <span>·</span>
          <button onClick={() => setActiveTab('admin')} className="hover:text-slate-200 cursor-pointer">
            Admin Console
          </button>
          <span>·</span>
          <a
            href="https://earthquake.usgs.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-slate-200"
          >
            USGS API <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
