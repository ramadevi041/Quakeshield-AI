import React, { useState } from 'react';
import {
  AlertOctagon,
  Building,
  Car,
  Trees,
  Compass,
  Waves,
  Users,
  Moon,
  Volume2,
  Lightbulb,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { translations } from '../utils/i18n';
import { playEmergencyAlertSound } from '../utils/audioAlert';

interface Props {
  language: SupportedLanguage;
  setActiveTab: (tab: string) => void;
}

export const DuringQuakeView: React.FC<Props> = ({ language, setActiveTab }) => {
  const t = translations[language];
  const [selectedScenario, setSelectedScenario] = useState<string>('indoors');
  const [isStrobeActive, setIsStrobeActive] = useState<boolean>(false);

  const scenarios = [
    {
      id: 'indoors',
      label: 'Indoors / Home / Office',
      icon: Building,
      keyAction: 'DROP, COVER, HOLD ON immediately under sturdy desk or table.',
      details: [
        'Stay indoors! Do NOT run outside — falling masonry, parapets, and glass along exterior walls cause the highest casualties.',
        'Drop to your hands and knees so violent shaking does not knock you down.',
        'Protect your head and neck with both arms if no desk or table is available.',
        'Stay away from windows, unanchored bookcases, mirrors, and ceiling chandeliers.',
        'Do NOT stand in doorways — modern doorways are rarely load-bearing and offer no protection from flying debris.'
      ]
    },
    {
      id: 'outdoors',
      label: 'Outdoors in Open Area',
      icon: Trees,
      keyAction: 'Move to a clear open area away from buildings, power lines, and streetlights.',
      details: [
        'Stay in the open until shaking stops completely.',
        'The greatest danger exists directly outside buildings, at exits, and along exterior walls where glass, bricks, and signs collapse.',
        'Watch out for snapped high-voltage overhead power cables.',
        'Drop to your knees and protect your head with a backpack or jacket.'
      ]
    },
    {
      id: 'driving',
      label: 'In a Moving Vehicle / Car',
      icon: Car,
      keyAction: 'Pull over safely to the side of the road, set parking brake, and remain inside.',
      details: [
        'Avoid stopping under overpasses, bridges, transmission towers, light poles, or large trees.',
        'Stay inside the vehicle until shaking stops completely — the metal frame provides vital crush protection.',
        'Turn on hazard warning lights to signal other drivers.',
        'Once shaking stops, proceed cautiously; avoid road bridges or ramps that may have suffered structural failure.'
      ]
    },
    {
      id: 'highrise',
      label: 'In a High-Rise Building',
      icon: Building,
      keyAction: 'Drop, Cover, Hold On away from exterior windows. NEVER use elevators.',
      details: [
        'Modern high-rises are designed to sway flexibly. Expect intense creaking, alarms, and fire sprinklers.',
        'Do NOT rush toward stairwells or elevators; stairwells are susceptible to jamming and stampedes.',
        'Take cover under a sturdy desk near an interior structural pillar.',
        'Expect aftershocks. Elevators may lose power with doors pinned shut.'
      ]
    },
    {
      id: 'coast',
      label: 'Near the Coast / Beach',
      icon: Waves,
      keyAction: 'DROP & COVER, then immediately evacuate inland or to high ground on foot.',
      details: [
        'Severe shaking lasting 20+ seconds or making standing difficult is nature’s tsunami warning.',
        'Do NOT wait for a municipal tsunami siren — evacuate immediately inland or to at least 100 feet (30m) above sea level.',
        'Walk rapidly on foot; vehicle traffic grids immediately lock up.',
        'Stay away from rivers and tidal inlets leading to the ocean.'
      ]
    },
    {
      id: 'crowded',
      label: 'Crowded Public Place / Mall',
      icon: Users,
      keyAction: 'Do NOT rush for exits. Drop, cover, and protect head from falling displays.',
      details: [
        'Avoid crowds stampeding for exit doors.',
        'Move away from high merchandise display racks and glass shop fronts.',
        'Protect your head and neck with your arms, shopping bag, or jacket.',
        'Be prepared for sudden lighting failures and fire sprinkler activation.'
      ]
    },
    {
      id: 'bed',
      label: 'In Bed at Night',
      icon: Moon,
      keyAction: 'Stay in bed. Turn face down and cover your head and neck with a pillow.',
      details: [
        'Do NOT attempt to walk in pitch black darkness through broken glass and overturned furniture.',
        'Hold the pillow tightly over your skull and neck until tremors subside.',
        'Put on sturdy shoes kept beside your bed before stepping onto the floor.'
      ]
    }
  ];

  const current = scenarios.find((s) => s.id === selectedScenario) || scenarios[0];

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 ${isStrobeActive ? 'alert-flash' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span>Emergency Action Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1 uppercase tracking-tight">
            DURING AN EARTHQUAKE
          </h1>
          <p className="text-slate-300 text-sm mt-0.5">
            Keep this screen open when ground motion begins. Simple, large, life-saving instructions.
          </p>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStrobeActive(!isStrobeActive)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              isStrobeActive
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>{isStrobeActive ? 'Disable Screen Torch' : 'Emergency Light'}</span>
          </button>
          <button
            onClick={playEmergencyAlertSound}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Alarm Siren</span>
          </button>
        </div>
      </div>

      {/* The 3 Core Actions in Huge Accessible Typography */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* DROP */}
        <div className="p-7 rounded-3xl bg-gradient-to-b from-red-600 to-red-700 text-white shadow-2xl border-2 border-red-400/50 space-y-3">
          <div className="text-5xl font-black tracking-tight">{t.drop}</div>
          <h3 className="text-xl font-bold uppercase tracking-wide">Drop to Hands & Knees</h3>
          <p className="text-sm text-red-100 font-medium leading-relaxed">
            {t.dropDesc} This position protects you from being knocked over and allows you to crawl to shelter.
          </p>
        </div>

        {/* COVER */}
        <div className="p-7 rounded-3xl bg-gradient-to-b from-orange-600 to-orange-700 text-white shadow-2xl border-2 border-orange-400/50 space-y-3">
          <div className="text-5xl font-black tracking-tight">{t.cover}</div>
          <h3 className="text-xl font-bold uppercase tracking-wide">Protect Head & Neck</h3>
          <p className="text-sm text-orange-100 font-medium leading-relaxed">
            {t.coverDesc} If no shelter is nearby, crawl next to an interior wall away from windows.
          </p>
        </div>

        {/* HOLD ON */}
        <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-600 to-amber-700 text-white shadow-2xl border-2 border-amber-400/50 space-y-3">
          <div className="text-5xl font-black tracking-tight">{t.holdOn}</div>
          <h3 className="text-xl font-bold uppercase tracking-wide">Hold Your Shelter</h3>
          <p className="text-sm text-amber-100 font-medium leading-relaxed">
            {t.holdOnDesc} Tables shift during violent shaking. Hold firmly with one hand; protect your neck with the other.
          </p>
        </div>
      </div>

      {/* Contextual Scenario Guidance Selector */}
      <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Specific Context</span>
          <h3 className="text-xl font-bold text-white mt-0.5">Where Are You Right Now?</h3>
        </div>

        {/* Scenario Pills */}
        <div className="flex flex-wrap gap-2">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSelected = selectedScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sc.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Display */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <current.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">Recommended Protocol</span>
              <h4 className="text-base font-bold text-white">{current.keyAction}</h4>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {current.details.map((detail, index) => (
              <div key={index} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Immediate Next Transition */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
        <span className="text-xs text-slate-300">Shaking stopped? Move on to damage inspection:</span>
        <button
          onClick={() => setActiveTab('after')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>After Earthquake Guide & Report Damage</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
