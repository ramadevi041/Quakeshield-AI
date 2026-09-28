import React, { useState } from 'react';
import {
  Activity,
  Shield,
  MapPin,
  Radio,
  Flame,
  CheckSquare,
  AlertOctagon,
  LifeBuoy,
  PhoneCall,
  Bot,
  Gauge,
  Users,
  BarChart3,
  Sparkles,
  Info,
  Menu,
  X,
  PlayCircle,
  Globe
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { translations } from '../utils/i18n';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isLiveFeed: boolean;
  onStartDemoTour: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  isLiveFeed,
  onStartDemoTour
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const primaryNavItems = [
    { id: 'landing', label: 'Home', icon: Shield },
    { id: 'risk', label: t.checkRisk, icon: MapPin },
    { id: 'map', label: t.liveMap, icon: Activity },
    { id: 'early-warning', label: t.earlyWarning, icon: Radio, highlight: true },
    { id: 'simulator', label: t.simulator, icon: Flame },
    { id: 'preparedness', label: t.preparedness, icon: CheckSquare },
    { id: 'shelters', label: 'Shelters', icon: LifeBuoy },
    { id: 'assistant', label: 'QuakeGuide AI', icon: Bot, isAi: true },
    { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  ];

  const secondaryNavItems = [
    { id: 'during', label: 'Emergency Guide', icon: AlertOctagon },
    { id: 'after', label: 'After Quake & Damage', icon: CheckSquare },
    { id: 'contacts', label: 'Contacts', icon: PhoneCall },
    { id: 'safety-score', label: 'My Safety Score', icon: Gauge },
    { id: 'family-plan', label: 'Family Plan', icon: Users },
    { id: 'analytics', label: 'AI Analytics', icon: Sparkles },
    { id: 'admin', label: 'Admin Console', icon: BarChart3 },
    { id: 'about', label: 'About & Tech', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('landing')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 shadow-lg shadow-amber-500/20">
              <div className="absolute inset-0 rounded-xl border border-amber-300/40 animate-ping opacity-25" />
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent">
                  QUAKESHIELD
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-widest uppercase font-medium">
                Prepare · Detect · Protect
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                      : item.highlight
                      ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                      : item.isAi
                      ? 'text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* More dropdown / quick link */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5 cursor-pointer">
                <span>More</span>
                <span className="text-[9px]">▾</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-52 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-50 backdrop-blur-2xl">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer text-left ${
                        activeTab === item.id ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Live Feed Status Pill */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isLiveFeed
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
              }`}
              title={isLiveFeed ? 'USGS Real-time API Connected' : 'Demo & Simulation Seismometer Feed Active'}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveFeed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-mono text-[10px] tracking-wide">
                {isLiveFeed ? 'USGS LIVE' : 'DEMO FEED'}
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center rounded-lg bg-slate-900 border border-slate-700/80 p-0.5 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              {(['en', 'hi', 'te'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                    language === lang
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Presentation Demo Tour Launch Button */}
            <button
              onClick={onStartDemoTour}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 cursor-pointer transition-all"
              title="Interactive 15-step college demonstration walkthrough"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Demo Tour</span>
            </button>

            {/* Critical Emergency SOS Button */}
            <button
              onClick={() => handleNavClick('during')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white border border-red-400/50 shadow-lg shadow-red-600/30 cursor-pointer animate-pulse transition-all"
              title="Immediate Emergency Action: DROP, COVER, HOLD ON"
            >
              <AlertOctagon className="w-4 h-4" />
              <span className="hidden sm:inline">EMERGENCY:</span>
              <span>DROP & COVER</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-1 backdrop-blur-2xl max-h-[80vh] overflow-y-auto">
          <div className="text-[11px] font-bold uppercase text-slate-400 px-3 py-1">Main Safety Tools</div>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                  activeTab === item.id ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="text-[11px] font-bold uppercase text-slate-400 px-3 pt-3 py-1">Emergency & Recovery</div>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                  activeTab === item.id ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartDemoTour();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Launch College Demo Tour</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
