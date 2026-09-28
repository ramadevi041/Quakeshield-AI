import React, { useState, useEffect } from 'react';
import {
  Gauge,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users,
  PhoneCall,
  CheckSquare,
  Home
} from 'lucide-react';
import { INITIAL_PREPAREDNESS_CHECKLIST } from '../data/fallbackData';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const SafetyScoreView: React.FC<Props> = ({ setActiveTab }) => {
  const [drillCompleted, setDrillCompleted] = useState<boolean>(() => {
    return localStorage.getItem('quakeshield_drill_done') === 'true';
  });

  const [safeZoneIdentified, setSafeZoneIdentified] = useState<boolean>(() => {
    return localStorage.getItem('quakeshield_safezone_done') === 'true';
  });

  const [checklistCount, setChecklistCount] = useState<number>(0);
  const [contactsCount, setContactsCount] = useState<number>(0);
  const [hasFamilyPlan, setHasFamilyPlan] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedList = localStorage.getItem('quakeshield_checklist');
      if (savedList) setChecklistCount(JSON.parse(savedList).length);

      const savedContacts = localStorage.getItem('quakeshield_contacts');
      if (savedContacts) setContactsCount(JSON.parse(savedContacts).length);

      const savedPlan = localStorage.getItem('quakeshield_family_plan');
      if (savedPlan) setHasFamilyPlan(true);
    } catch {
      // Ignore
    }
  }, []);

  const toggleDrill = () => {
    const next = !drillCompleted;
    setDrillCompleted(next);
    localStorage.setItem('quakeshield_drill_done', next ? 'true' : 'false');
  };

  const toggleSafeZone = () => {
    const next = !safeZoneIdentified;
    setSafeZoneIdentified(next);
    localStorage.setItem('quakeshield_safezone_done', next ? 'true' : 'false');
  };

  // Compute 100-Point Score
  // 1. Kit Checklist: up to 30 pts (based on 12 items)
  const kitScore = Math.min(30, Math.round((checklistCount / INITIAL_PREPAREDNESS_CHECKLIST.length) * 30));
  // 2. Emergency Contacts: up to 20 pts (2+ contacts = 20, 1 contact = 10)
  const contactsScore = contactsCount >= 2 ? 20 : contactsCount === 1 ? 10 : 0;
  // 3. Family Safety Plan: 20 pts
  const planScore = hasFamilyPlan ? 20 : 0;
  // 4. Safe Location Identified: 15 pts
  const safeZoneScore = safeZoneIdentified ? 15 : 0;
  // 5. Drill Practiced: 15 pts
  const drillScore = drillCompleted ? 15 : 0;

  const totalScore = kitScore + contactsScore + planScore + safeZoneScore + drillScore;

  // Grade & Color
  const getScoreProfile = (score: number) => {
    if (score >= 85) {
      return { grade: 'EARTHQUAKE READY', color: '#10b981', textColor: 'text-emerald-400', desc: 'Outstanding preparedness! Your household has essential redundancies secured.' };
    }
    if (score >= 65) {
      return { grade: 'WELL PREPARED', color: '#3b82f6', textColor: 'text-blue-400', desc: 'Solid foundation. A few minor items remain to achieve maximum resilience.' };
    }
    if (score >= 40) {
      return { grade: 'MODERATE PREPARATION', color: '#f59e0b', textColor: 'text-amber-400', desc: 'Moderate readiness. Critical gaps in emergency planning and supplies.' };
    }
    return { grade: 'NEEDS IMMEDIATE ACTION', color: '#ef4444', textColor: 'text-red-400', desc: 'High vulnerability. Complete basic family contact and survival kit tasks.' };
  };

  const profile = getScoreProfile(totalScore);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Gauge className="w-3.5 h-3.5 text-amber-400" />
          <span>Readiness Audit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">MY SAFETY SCORE</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          A personalized 100-point audit evaluating your physical supplies, family communication plan, and muscle-memory drills.
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0e1628] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center md:text-left max-w-md">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Overall Household Audit
          </span>
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-6xl sm:text-7xl font-mono font-black text-white">{totalScore}</span>
            <span className="text-2xl text-slate-400 font-bold">/100</span>
          </div>
          <div className={`text-base font-extrabold uppercase tracking-wider ${profile.textColor}`}>
            {profile.grade}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{profile.desc}</p>
        </div>

        {/* Circular Progress Display */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#1e293b"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={profile.color}
              strokeWidth="8"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * totalScore) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-white mb-0.5" />
            <span className="font-mono text-sm font-bold text-slate-200">{totalScore}%</span>
          </div>
        </div>
      </div>

      {/* 5 Evaluated Pillars Breakdown */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          Safety Score Breakdown (5 Pillars)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Pillar 1: Kit Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>72-Hour Supply Kit</span>
              </span>
              <span className="font-mono font-bold text-xs text-amber-400">{kitScore}/30 pts</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(kitScore / 30) * 100}%` }} />
            </div>
            <p className="text-xs text-slate-400">{checklistCount} of 12 critical supplies checked.</p>
            <button
              onClick={() => setActiveTab('preparedness')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Update Kit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Pillar 2: Emergency Contacts */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-red-400" />
                <span>Emergency Contacts</span>
              </span>
              <span className="font-mono font-bold text-xs text-amber-400">{contactsScore}/20 pts</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${(contactsScore / 20) * 100}%` }} />
            </div>
            <p className="text-xs text-slate-400">{contactsCount} family and out-of-area contacts added.</p>
            <button
              onClick={() => setActiveTab('contacts')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Manage Contacts</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Pillar 3: Family Safety Plan */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Family Reunion Plan</span>
              </span>
              <span className="font-mono font-bold text-xs text-amber-400">{planScore}/20 pts</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(planScore / 20) * 100}%` }} />
            </div>
            <p className="text-xs text-slate-400">
              {hasFamilyPlan ? 'Family emergency plan completed.' : 'No plan drafted yet.'}
            </p>
            <button
              onClick={() => setActiveTab('family-plan')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>{hasFamilyPlan ? 'Review Plan' : 'Draft Plan'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Pillar 4: Safe Cover Spots Identified */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Safe Cover Zones</span>
              </span>
              <span className="font-mono font-bold text-xs text-amber-400">{safeZoneScore}/15 pts</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(safeZoneScore / 15) * 100}%` }} />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={safeZoneIdentified}
                onChange={toggleSafeZone}
                className="rounded accent-cyan-500"
              />
              <span>Sturdy tables & safe walls identified</span>
            </label>
          </div>

          {/* Pillar 5: Drill Practiced */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>Earthquake Drill</span>
              </span>
              <span className="font-mono font-bold text-xs text-amber-400">{drillScore}/15 pts</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(drillScore / 15) * 100}%` }} />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={drillCompleted}
                onChange={toggleDrill}
                className="rounded accent-orange-500"
              />
              <span>Drop, Cover, Hold On practiced (past 6 mo)</span>
            </label>
          </div>
        </div>
      </div>

      {/* High-Impact Targeted Recommendations */}
      <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Recommended Actions to Boost Your Score</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          {checklistCount < 8 && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200">Add emergency water, flashlight, and medical kits to your supply bag (+15 pts)</span>
              </div>
              <button onClick={() => setActiveTab('preparedness')} className="font-bold text-amber-400 hover:underline cursor-pointer">
                Fix
              </button>
            </div>
          )}

          {contactsCount < 2 && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-slate-200">Save at least 2 emergency family or out-of-state contacts (+20 pts)</span>
              </div>
              <button onClick={() => setActiveTab('contacts')} className="font-bold text-amber-400 hover:underline cursor-pointer">
                Fix
              </button>
            </div>
          )}

          {!hasFamilyPlan && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-200">Fill in family reunion meeting points in the Family Safety Plan (+20 pts)</span>
              </div>
              <button onClick={() => setActiveTab('family-plan')} className="font-bold text-amber-400 hover:underline cursor-pointer">
                Draft
              </button>
            </div>
          )}

          {!drillCompleted && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-slate-200">Run the simulated earthquake drill to test reaction time (+15 pts)</span>
              </div>
              <button onClick={() => setActiveTab('simulator')} className="font-bold text-amber-400 hover:underline cursor-pointer">
                Simulate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
