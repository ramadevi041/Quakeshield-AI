import React from 'react';
import {
  Gauge,
  MapPin,
  Activity,
  ShieldCheck,
  PhoneCall,
  Users,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Flame,
  Radio
} from 'lucide-react';
import { Earthquake, HazardLevel } from '../types';

interface Props {
  setActiveTab: (tab: string) => void;
  earthquakes: Earthquake[];
  userLocationName?: string;
  userHazard?: HazardLevel;
}

export const DashboardView: React.FC<Props> = ({
  setActiveTab,
  earthquakes,
  userLocationName = 'San Francisco, California',
  userHazard = 'VERY HIGH'
}) => {
  // Read current checklist state
  const checkedCount = (() => {
    try {
      const list = localStorage.getItem('quakeshield_checklist');
      return list ? JSON.parse(list).length : 3;
    } catch {
      return 3;
    }
  })();

  const contactsCount = (() => {
    try {
      const c = localStorage.getItem('quakeshield_contacts');
      return c ? JSON.parse(c).length : 2;
    } catch {
      return 2;
    }
  })();

  const hasFamilyPlan = localStorage.getItem('quakeshield_family_plan') !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-amber-400">Citizen Command Center</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Household Safety Dashboard</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Real-time status of your geographic seismic hazard, preparedness checklist, and emergency network.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('during')}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Drop & Cover</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Location Hazard */}
        <div
          onClick={() => setActiveTab('risk')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Local Seismic Hazard</span>
            <MapPin className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-red-400 uppercase tracking-wider">{userHazard}</span>
          </div>
          <div className="text-xs text-slate-300 mt-1 line-clamp-1">{userLocationName}</div>
        </div>

        {/* Metric 2: Household Readiness */}
        <div
          onClick={() => setActiveTab('preparedness')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">72-Hour Supply Kit</span>
            <CheckSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white">{Math.round((checkedCount / 12) * 100)}%</span>
            <span className="text-xs text-slate-400">({checkedCount}/12 secured)</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1">Water & first aid logged</div>
        </div>

        {/* Metric 3: Emergency Circle */}
        <div
          onClick={() => setActiveTab('contacts')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Emergency Contacts</span>
            <PhoneCall className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white">{contactsCount}</span>
            <span className="text-xs text-slate-400">saved in circle</span>
          </div>
          <div className="text-xs text-cyan-400 mt-1">Out-of-state relay active</div>
        </div>

        {/* Metric 4: Family Continuity */}
        <div
          onClick={() => setActiveTab('family-plan')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Family Safety Plan</span>
            <Users className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2">
            <span className={`text-base font-bold uppercase ${hasFamilyPlan ? 'text-emerald-400' : 'text-amber-400'}`}>
              {hasFamilyPlan ? 'Complete & Saved' : 'Draft Needed'}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">Meeting spots designated</div>
        </div>
      </div>

      {/* Middle Row: Recent Earthquakes Map Snapshot & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Monitored Events (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Recent Global Telemetry Stream</span>
            </h2>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {earthquakes.slice(0, 5).map((eq) => (
              <div
                key={eq.id}
                onClick={() => setActiveTab('map')}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
                      eq.magnitude >= 6.0
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    M{eq.magnitude.toFixed(1)}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{eq.place}</h4>
                    <span className="text-[10px] text-slate-400">
                      Depth: {eq.depth} km · {Math.round((Date.now() - eq.time) / 60000)}m ago
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 text-[10px] font-mono text-slate-500 uppercase">
                  {eq.isLive ? 'USGS LIVE' : 'DEMO'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Action Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              Quick Safety Shortcuts
            </h2>

            <div className="space-y-2.5 text-xs">
              <button
                onClick={() => setActiveTab('simulator')}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-orange-500/40 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-white">Practice Simulated Drill</div>
                    <div className="text-[11px] text-slate-400">Experience P/S wave early warning timing</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
              </button>

              <button
                onClick={() => setActiveTab('shelters')}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-white">View Nearby Shelters</div>
                    <div className="text-[11px] text-slate-400">Trauma centers and open gathering parks</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
              </button>

              <button
                onClick={() => setActiveTab('assistant')}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-white">Consult QuakeGuide AI</div>
                    <div className="text-[11px] text-slate-400">Ask safety and retrofitting questions</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
