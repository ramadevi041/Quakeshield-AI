import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Printer,
  RotateCcw,
  CheckCircle2,
  FileText,
  Flame,
  ArrowRight,
  Info
} from 'lucide-react';
import { INITIAL_PREPAREDNESS_CHECKLIST, ChecklistItem } from '../data/fallbackData';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const PreparednessView: React.FC<Props> = ({ setActiveTab }) => {
  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('quakeshield_checklist');
      return saved ? JSON.parse(saved) : ['c1', 'c3', 'c4']; // Initial sample
    } catch {
      return ['c1', 'c3', 'c4'];
    }
  });

  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('quakeshield_checklist', JSON.stringify(checkedIds));
    } catch (e) {
      // Ignore
    }
  }, [checkedIds]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Calculate weighted preparedness score
  const totalWeight = INITIAL_PREPAREDNESS_CHECKLIST.reduce((acc, item) => acc + item.weight, 0);
  const checkedWeight = INITIAL_PREPAREDNESS_CHECKLIST.reduce(
    (acc, item) => (checkedIds.includes(item.id) ? acc + item.weight : acc),
    0
  );
  const preparednessPercent = Math.round((checkedWeight / totalWeight) * 100);

  const filteredItems = INITIAL_PREPAREDNESS_CHECKLIST.filter(
    (item) => filterCategory === 'All' || item.category === filterCategory
  );

  const resetChecklist = () => {
    setCheckedIds([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>Household Preparedness</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">EARTHQUAKE PREPAREDNESS CENTER</h1>
            <p className="text-slate-400 text-sm mt-1">
              Actions you take before ground shaking begins are the primary determinants of survival and recovery.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Checklist</span>
            </button>
            <button
              onClick={resetChecklist}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
              title="Reset checklist"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preparedness Score Progress Bar */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0c1c20] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Household Survival Readiness
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3 mt-0.5">
              <span>Your Preparedness:</span>
              <span
                className={`font-mono ${
                  preparednessPercent >= 80
                    ? 'text-emerald-400'
                    : preparednessPercent >= 50
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}
              >
                {preparednessPercent}%
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-300">
            {checkedIds.length} of {INITIAL_PREPAREDNESS_CHECKLIST.length} critical supplies secured
          </div>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              preparednessPercent >= 80
                ? 'bg-emerald-500'
                : preparednessPercent >= 50
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${preparednessPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Minimum Survival Threshold: 60%</span>
          <button
            onClick={() => setActiveTab('safety-score')}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View Full 100-Point Safety Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Checklist & Action Guide Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive 72-Hour Supply Checklist (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <span>72-Hour Emergency Kit Checklist</span>
            </h2>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 text-[11px]">
              {['All', 'Essentials', 'Tools & Light', 'Medical & Health', 'Communication & Safety'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredItems.map((item) => {
              const isChecked = checkedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // Handled by parent div
                    aria-label={item.label}
                    className="w-5 h-5 rounded mt-0.5 accent-emerald-500 cursor-pointer shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold ${isChecked ? 'text-white line-through opacity-85' : 'text-slate-200'}`}>
                        {item.label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-950 text-slate-400 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable "Before an Earthquake" Protocol Column */}
        <div className="space-y-4">
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Before An Earthquake</span>
            </h2>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="space-y-1">
                <span className="font-bold text-amber-300 block">1. Anchor Heavy Furniture</span>
                <p className="text-slate-400">
                  Fasten bookcases, water heaters, and large televisions to wall studs with flexible nylon straps.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-amber-300 block">2. Identify Safe Cover Zones</span>
                <p className="text-slate-400">
                  Pick sturdy desks, tables, or interior walls in every room. Stay away from glass windows and hanging lighting.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-amber-300 block">3. Gas & Electric Utility Shut-Off</span>
                <p className="text-slate-400">
                  Locate your main gas meter shut-off valve. Keep an adjustable wrench tethered nearby; only turn off if smelling gas.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-amber-300 block">4. Out-of-Area Family Contact</span>
                <p className="text-slate-400">
                  Designate an out-of-state relative as a relay. Local cellular towers often lock up, while long-distance text lines remain open.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-amber-300 block">5. Practice Earthquake Drills</span>
                <p className="text-slate-400">
                  Conduct bi-annual Drop, Cover, Hold On drills with family members so automatic muscle memory takes over under stress.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveTab('family-plan')}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Draft Family Safety Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
