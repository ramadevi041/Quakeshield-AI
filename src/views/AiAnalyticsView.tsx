import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  Layers,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Info,
  CheckCircle2,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';

export const AiAnalyticsView: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Pacific Ring of Fire & Western North America');
  const [analysisText, setAnalysisText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [disclaimer, setDisclaimer] = useState<string>('');

  const regions = [
    {
      name: 'Pacific Ring of Fire & Western North America',
      description: 'San Andreas transform fault & Cascadia subduction zone with frequent shallow crustal events.'
    },
    {
      name: 'Japan Trench & Sagami Trough Subduction Arc',
      description: 'Megathrust subduction plate convergence with high intraslab and interplate seismic energy release.'
    },
    {
      name: 'Mediterranean & North Anatolian Fault Zone',
      description: 'Continental collision strike-slip fault system exhibiting historical progressive westward earthquake sequencing.'
    },
    {
      name: 'Himalayan Frontal Thrust & Northern India',
      description: 'Indo-Eurasian continental plate collision producing deep crustal strain and major historical megathrust ruptures.'
    },
    {
      name: 'Peru-Chile Trench (South American Margin)',
      description: 'Nazca-South American subduction zone capable of generating extreme magnitude events and coastal tsunamis.'
    }
  ];

  const runAnalysis = async (regionName: string) => {
    setLoading(true);
    try {
      const res = await api.getAIAnalytics(regionName);
      setAnalysisText(res.analysis);
      setDisclaimer(res.disclaimer);
    } catch (err) {
      console.error('AI Analytics Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis(selectedRegion);
  }, []);

  const handleSelectRegion = (name: string) => {
    setSelectedRegion(name);
    runAnalysis(name);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI-Powered Seismological Synthesis (Gemini 3.8 Flash)</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">AI SEISMIC ANALYTICS</h1>
            <p className="text-slate-400 text-sm mt-1">
              Synthesizing historical seismicity patterns, fault geometry mechanisms, and engineering risk profiles.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => runAnalysis(selectedRegion)}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Re-run Synthesis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Scientific Phrasing Notice */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 space-y-1">
        <div className="font-bold flex items-center gap-1.5 uppercase text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Scientific Guardrail Notice:</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          This AI analytics engine evaluates <strong>historical patterns</strong>, <strong>observed seismicity</strong>, and <strong>hazard probabilities</strong>. It NEVER generates earthquake predictions (no date, hour, or epicenter forecast).
        </p>
      </div>

      {/* Region Selector Pills */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Tectonic Domain:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {regions.map((reg) => {
            const isSelected = selectedRegion === reg.name;
            return (
              <div
                key={reg.name}
                onClick={() => handleSelectRegion(reg.name)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white line-clamp-1">{reg.name}</h4>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{reg.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Synthesis Output Card */}
      <div className="rounded-2xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">Hazard Synthesis Report</span>
            <h2 className="text-xl font-bold text-white mt-0.5">{selectedRegion}</h2>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
            Model: Gemini 3.8 Flash
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <div className="text-sm font-bold text-white">Synthesizing Seismological Hazard Profile...</div>
            <p className="text-xs text-slate-400">
              Querying crustal fault catalogs, aftershock attenuation models, and preparedness recommendations.
            </p>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
            <div className="whitespace-pre-line bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
              {analysisText}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Grounding: Observed seismological mechanics & historical catalog statistics.</span>
              <span className="text-amber-400 font-semibold">{disclaimer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
