import React, { useState, useEffect } from 'react';
import {
  Radio,
  AlertTriangle,
  Volume2,
  VolumeX,
  ShieldAlert,
  ArrowRight,
  Zap,
  Info,
  Clock,
  MapPin,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { EarlyWarningAlert, SupportedLanguage } from '../types';
import { translations } from '../utils/i18n';
import { playEmergencyAlertSound, playCountdownBeep } from '../utils/audioAlert';

interface Props {
  setActiveTab: (tab: string) => void;
  language: SupportedLanguage;
  activeAlert: EarlyWarningAlert | null;
  onClearAlert: () => void;
  onTriggerTestAlert: () => void;
}

export const EarlyWarningView: React.FC<Props> = ({
  setActiveTab,
  language,
  activeAlert,
  onClearAlert,
  onTriggerTestAlert
}) => {
  const t = translations[language];
  const [countdown, setCountdown] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (activeAlert) {
      setCountdown(activeAlert.timeUntilShakingSeconds);
      if (soundEnabled) {
        playEmergencyAlertSound();
      }
    }
  }, [activeAlert, soundEnabled]);

  useEffect(() => {
    if (!activeAlert || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (soundEnabled) playCountdownBeep(true);
          return 0;
        }
        if (soundEnabled && prev <= 10) {
          playCountdownBeep(false);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAlert, countdown, soundEnabled]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Scientific Explanation */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider">
          <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span>National Seismic Telemetry Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">EARLY WARNING CENTER</h1>

        {/* Scientific Mandate Callout */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-1">
          <div className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-xs">
            <Info className="w-4 h-4" />
            <span>How Earthquake Early Warning Actually Works:</span>
          </div>
          <p>
            "Earthquake early warning is not earthquake prediction. It detects an earthquake after it begins and may provide warning before stronger shaking reaches some locations."
          </p>
          <p className="text-slate-400 text-xs pt-1">
            Fast primary P-waves (compressional, ~6 km/s) cause minimal damage and are detected by regional seismometers. Destructive S-waves (shear, ~3.5 km/s) and surface waves follow behind. Telemetry travels at the speed of light, yielding 5 to 60+ seconds of lead time depending on distance from the epicenter.
          </p>
        </div>
      </div>

      {/* Main Alert Status Box */}
      {!activeAlert ? (
        /* NORMAL STATE */
        <div className="rounded-3xl p-8 sm:p-12 border border-emerald-500/30 bg-gradient-to-b from-[#0b1b1f] via-slate-900 to-[#070b14] text-center space-y-6 relative overflow-hidden shadow-2xl">
          {/* Radar scan aesthetic */}
          <div className="w-36 h-36 mx-auto relative rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-950/20">
            <div className="absolute inset-2 rounded-full border border-emerald-500/20" />
            <div className="absolute inset-8 rounded-full border border-emerald-500/10" />
            <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-ping" />
            <div className="absolute inset-0 rounded-full border-t border-emerald-400 radar-sweep opacity-40 pointer-events-none" />
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Station Telemetry Active · 1,420 Seismometers Monitored
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              {t.noActiveWarning}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
              Seismic stations report background crustal stability. No destructive shear waves currently detected near your designated location.
            </p>
          </div>

          {/* Test Alert Trigger Button for Faculty Demonstration */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onTriggerTestAlert}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate Real-Time Early Warning Alert</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-all flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Open Physics Wave Simulator</span>
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE ALERT / DRILL WARNING CARD */
        <div className="rounded-3xl p-6 sm:p-10 border-2 border-red-500 bg-gradient-to-b from-red-950/80 via-slate-900 to-red-950/50 shadow-2xl space-y-8 alert-flash relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-500/40">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-600 text-white animate-bounce">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    CRITICAL SEISMIC BROADCAST
                  </span>
                  {activeAlert.isSimulation && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 text-[10px] font-black uppercase border border-amber-500/50">
                      {t.simulationTag}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
                  EARTHQUAKE EARLY WARNING
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 text-red-400" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={onClearAlert}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
              >
                Dismiss Alert
              </button>
            </div>
          </div>

          {/* Large Countdown Timer */}
          <div className="text-center py-4 bg-slate-950/80 rounded-2xl border border-red-500/40 p-6 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-red-400">
              {countdown > 0 ? t.secondsRemaining : 'STRONG SHAKING OCCURRING NOW'}
            </div>
            <div className="text-6xl sm:text-8xl font-black font-mono text-white tracking-tight drop-shadow-lg">
              {countdown > 0 ? `${countdown}s` : 'IMPACT'}
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {countdown > 0
                ? 'Primary P-waves detected. Shear S-waves incoming. Take cover immediately!'
                : 'Maintain protective shelter under sturdy furniture until shaking completely subsides.'}
            </div>
          </div>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-red-500/30">
              <span className="text-slate-400 uppercase text-[10px] block font-bold">Estimated Magnitude</span>
              <span className="text-lg font-mono font-black text-red-400">
                M {activeAlert.estimatedMagnitude.toFixed(1)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-red-500/30">
              <span className="text-slate-400 uppercase text-[10px] block font-bold">Estimated Location</span>
              <span className="text-xs font-bold text-white line-clamp-1">{activeAlert.estimatedEpicenter}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-red-500/30">
              <span className="text-slate-400 uppercase text-[10px] block font-bold">Distance to You</span>
              <span className="text-lg font-mono font-bold text-amber-400">
                ~{activeAlert.estimatedDistanceKm} km
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-red-500/30">
              <span className="text-slate-400 uppercase text-[10px] block font-bold">Expected Shaking</span>
              <span className="text-xs font-bold text-red-300">
                {activeAlert.expectedShaking} ({activeAlert.mmiLevel})
              </span>
            </div>
          </div>

          {/* Three Massive Emergency Response Buttons */}
          <div className="space-y-3">
            <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-300">
              Immediate Life-Saving Actions:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* DROP */}
              <button
                onClick={() => setActiveTab('during')}
                className="p-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-left shadow-lg shadow-red-600/30 border border-red-400 cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <div className="text-2xl font-black uppercase tracking-wider">{t.drop}</div>
                <div className="text-xs font-medium text-red-100 mt-1">{t.dropDesc}</div>
              </button>

              {/* COVER */}
              <button
                onClick={() => setActiveTab('during')}
                className="p-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-left shadow-lg shadow-orange-600/30 border border-orange-400 cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <div className="text-2xl font-black uppercase tracking-wider">{t.cover}</div>
                <div className="text-xs font-medium text-orange-100 mt-1">{t.coverDesc}</div>
              </button>

              {/* HOLD ON */}
              <button
                onClick={() => setActiveTab('during')}
                className="p-5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-left shadow-lg shadow-amber-600/30 border border-amber-400 cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <div className="text-2xl font-black uppercase tracking-wider">{t.holdOn}</div>
                <div className="text-xs font-medium text-amber-100 mt-1">{t.holdOnDesc}</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Educational Infographic: P-Waves vs S-Waves */}
      <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>The Physics of Earthquake Early Warning Systems</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 block text-sm">1. Primary Waves (P-Wave)</span>
            <p className="text-slate-400 leading-relaxed">
              Travel fastest through crustal rock at 5 to 7 km/s. They cause compressional push-pull ground motion, usually felt as a light jolt or high-frequency rattle.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-red-400 block text-sm">2. Secondary Waves (S-Wave)</span>
            <p className="text-slate-400 leading-relaxed">
              Travel slower at 3 to 4 km/s. They produce intense shear side-to-side and vertical ground accelerations that cause buildings, chimneys, and bridges to fail.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-400 block text-sm">3. Electronic Early Warning</span>
            <p className="text-slate-400 leading-relaxed">
              Fiber optic and wireless data travel at ~300,000 km/s. Algorithms detect the initial P-wave at the closest station and alert cities tens of kilometers away seconds before S-waves arrive.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
