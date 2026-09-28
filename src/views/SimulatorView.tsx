import React, { useState, useEffect } from 'react';
import {
  Flame,
  Play,
  RotateCcw,
  AlertTriangle,
  Radio,
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
  Volume2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { playEmergencyAlertSound, playCountdownBeep, playSimulatedTremorRumble } from '../utils/audioAlert';

interface Props {
  setActiveTab: (tab: string) => void;
  onSendSimulationToEarlyWarning: (alert: any) => void;
}

export const SimulatorView: React.FC<Props> = ({
  setActiveTab,
  onSendSimulationToEarlyWarning
}) => {
  // Simulator parameters
  const [magnitude, setMagnitude] = useState<number>(6.8);
  const [depth, setDepth] = useState<number>(14);
  const [distance, setDistance] = useState<number>(75);
  const [epicenterName, setEpicenterName] = useState<string>('San Andreas Fault (Santa Cruz Segment)');
  const [userLocationName, setUserLocationName] = useState<string>('San Francisco Bay Area');

  // Simulation execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simCountdown, setSimCountdown] = useState<number>(0);
  const [isTremorActive, setIsTremorActive] = useState<boolean>(false);

  // Physics calculation
  // P-wave speed = 6.0 km/s, S-wave speed = 3.5 km/s
  // Telemetry station detection latency = 2.4s
  const calculateWarningSeconds = (dist: number) => {
    const sWaveTime = dist / 3.5;
    const pWaveDetectTime = dist / 6.0 + 2.4;
    const warningLeadTime = Math.round(sWaveTime - pWaveDetectTime);
    return Math.max(3, warningLeadTime);
  };

  const warningLeadTime = calculateWarningSeconds(distance);

  // Intensity on Modified Mercalli scale
  const getExpectedMMI = (mag: number, dist: number) => {
    // Basic attenuation estimate
    const intensity = mag * 1.5 - Math.log10(Math.max(10, dist)) * 2.5;
    if (intensity >= 8) return { label: 'Violent', mmi: 'MMI IX' };
    if (intensity >= 6.5) return { label: 'Severe', mmi: 'MMI VII-VIII' };
    if (intensity >= 5) return { label: 'Strong', mmi: 'MMI VI' };
    if (intensity >= 3.5) return { label: 'Moderate', mmi: 'MMI IV-V' };
    return { label: 'Light', mmi: 'MMI II-III' };
  };

  const expectedShaking = getExpectedMMI(magnitude, distance);

  // Run simulation sequence
  const startSimulation = () => {
    setIsRunning(true);
    setSimStep(1);
    setIsTremorActive(false);

    // Step 1: Detection
    setTimeout(() => {
      setSimStep(2);
    }, 1200);

    // Step 2: Triangulation
    setTimeout(() => {
      setSimStep(3);
    }, 2400);

    // Step 3: Magnitude & Warning broadcast
    setTimeout(() => {
      setSimStep(4);
      playEmergencyAlertSound();
      setSimCountdown(warningLeadTime);

      // Forward to global Early Warning state
      onSendSimulationToEarlyWarning({
        id: `sim-${Date.now()}`,
        estimatedMagnitude: magnitude,
        estimatedEpicenter: epicenterName,
        coordinates: { lat: 37.77, lng: -122.41 },
        estimatedDistanceKm: distance,
        expectedShaking: expectedShaking.label,
        mmiLevel: expectedShaking.mmi,
        timeUntilShakingSeconds: warningLeadTime,
        issuedAt: Date.now(),
        isSimulation: true
      });
    }, 3800);
  };

  // Countdown timer when step 4 is active
  useEffect(() => {
    if (simStep === 4 && simCountdown > 0) {
      const timer = setInterval(() => {
        setSimCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSimStep(5);
            setIsTremorActive(true);
            playCountdownBeep(true);
            playSimulatedTremorRumble(4.5);
            return 0;
          }
          playCountdownBeep(false);
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [simStep, simCountdown]);

  // Stop tremor shake after 4.5s
  useEffect(() => {
    if (isTremorActive) {
      const timer = setTimeout(() => {
        setIsTremorActive(false);
        setSimStep(6); // Final recovery review
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isTremorActive]);

  const resetSimulation = () => {
    setIsRunning(false);
    setSimStep(0);
    setSimCountdown(0);
    setIsTremorActive(false);
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 ${isTremorActive ? 'tremor-active' : ''}`}>
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Educational & Demonstration Tool</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">EARTHQUAKE SIMULATOR</h1>
            <p className="text-slate-400 text-sm mt-1">
              Demonstrates P-wave detection, algorithmic triangulation, S-wave travel-time, and early-warning delivery.
            </p>
          </div>
          {/* Unmistakable Simulation Stamp */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-black uppercase tracking-wider shadow-lg shrink-0">
            SIMULATION — NOT A REAL EARTHQUAKE
          </div>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-1 rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center justify-between">
            <span>Simulation Parameters</span>
            {isRunning && (
              <button
                onClick={resetSimulation}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </h2>

          {/* Magnitude Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Simulated Magnitude:</span>
              <span className="font-mono font-black text-red-400 text-sm">M {magnitude.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="8.5"
              step="0.1"
              value={magnitude}
              disabled={isRunning}
              onChange={(e) => setMagnitude(parseFloat(e.target.value))}
              aria-label="Simulated Earthquake Magnitude"
              className="w-full accent-amber-500 cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>M4.0 (Light)</span>
              <span>M6.5 (Strong)</span>
              <span>M8.5 (Great)</span>
            </div>
          </div>

          {/* Epicenter Presets */}
          <div className="space-y-2">
            <label htmlFor="epicenter-preset-select" className="text-xs text-slate-400 font-semibold block">Fault Zone & Epicenter:</label>
            <select
              id="epicenter-preset-select"
              value={epicenterName}
              disabled={isRunning}
              onChange={(e) => setEpicenterName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer disabled:opacity-50"
            >
              <option value="San Andreas Fault (Santa Cruz Segment)">San Andreas Fault (California)</option>
              <option value="Sagami Trough / Nankai Subduction Zone">Sagami Trough (Tokyo / Japan)</option>
              <option value="North Anatolian Fault (Marmara)">North Anatolian Fault (Turkey)</option>
              <option value="Main Himalayan Frontal Thrust">Main Himalayan Thrust (India)</option>
              <option value="Cascadia Megathrust Subduction Zone">Cascadia Megathrust (Pacific NW)</option>
            </select>
          </div>

          {/* Depth Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Focal Depth:</span>
              <span className="font-mono font-bold text-cyan-400">{depth} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="90"
              step="1"
              value={depth}
              disabled={isRunning}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              aria-label="Simulated Focal Depth"
              className="w-full accent-cyan-500 cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5 km (Shallow)</span>
              <span>45 km (Intermediate)</span>
              <span>90 km (Deep)</span>
            </div>
          </div>

          {/* Distance to User Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Distance to User:</span>
              <span className="font-mono font-bold text-amber-400">{distance} km</span>
            </div>
            <input
              type="range"
              min="20"
              max="250"
              step="5"
              value={distance}
              disabled={isRunning}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              aria-label="Distance to User Location"
              className="w-full accent-amber-500 cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>20 km (Close)</span>
              <span>120 km (Regional)</span>
              <span>250 km (Distant)</span>
            </div>
          </div>

          {/* Derived Physical Lead-Time Info */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Theoretical Warning Lead:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">~{warningLeadTime} seconds</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Est. Local Ground Motion:</span>
              <span className="font-bold text-amber-300">{expectedShaking.label} ({expectedShaking.mmi})</span>
            </div>
          </div>

          {/* Start Simulation Button */}
          {!isRunning ? (
            <button
              onClick={startSimulation}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-xl shadow-red-600/30 cursor-pointer transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4" />
              <span>START SIMULATION DRILL</span>
            </button>
          ) : (
            <button
              onClick={resetSimulation}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Stop & Reset Simulator</span>
            </button>
          )}
        </div>

        {/* Dynamic Visual Simulation Stage */}
        <div className="lg:col-span-2 rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Telemetry Propagation & Warning Stage</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              STATUS: {isRunning ? `STEP ${simStep} OF 6 ACTIVE` : 'READY TO TRIGGER'}
            </span>
          </div>

          {/* Visual Step-by-Step Progress Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { num: 1, title: '1. Rupture Detected', desc: 'Seismometer detects P-wave' },
              { num: 2, title: '2. Triangulation', desc: 'Epicenter & depth located' },
              { num: 3, title: '3. Mag Estimation', desc: 'Displacement amplitude calculated' },
              { num: 4, title: '4. Warning Broadcast', desc: 'Push alert sent to citizens' },
              { num: 5, title: '5. S-Wave Arrival', desc: 'Strong shaking commences' },
              { num: 6, title: '6. Safety Protocol', desc: 'Drop, Cover, Hold On' }
            ].map((step) => {
              const isPast = simStep > step.num;
              const isCurrent = simStep === step.num;

              return (
                <div
                  key={step.num}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 scale-102 shadow-md shadow-amber-500/20 font-bold'
                      : isPast
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold">STAGE {step.num}</span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                  </div>
                  <div className="text-slate-200 font-semibold">{step.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{step.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Simulation Canvas / Visual Display */}
          <div className="rounded-2xl p-6 bg-slate-950 border border-slate-800 text-center min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden">
            {!isRunning && (
              <div className="space-y-3 max-w-md">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <Play className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white">Simulation Idle</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click [START SIMULATION DRILL] to witness seismic wave physics in real time: detection, algorithmic alert broadcast, countdown lead-time, and emergency instructions.
                </p>
              </div>
            )}

            {isRunning && simStep === 1 && (
              <div className="space-y-2 animate-in fade-in">
                <div className="w-10 h-10 mx-auto rounded-full bg-red-600/30 flex items-center justify-center text-red-400 animate-ping">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-white">Rupture Detected Along Fault</h3>
                <p className="text-xs text-slate-400">Initial P-waves hitting primary borehole seismometers...</p>
              </div>
            )}

            {isRunning && (simStep === 2 || simStep === 3) && (
              <div className="space-y-2 animate-in fade-in">
                <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 animate-pulse">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-white">Calculating Epicenter & Magnitude</h3>
                <p className="text-xs text-slate-400">
                  Estimated {epicenterName} · Depth: {depth} km · Computing contour of maximum ground acceleration...
                </p>
              </div>
            )}

            {isRunning && simStep === 4 && (
              <div className="space-y-3 animate-in zoom-in-95 duration-200">
                <div className="text-xs font-bold uppercase tracking-widest text-red-400">
                  EARTHQUAKE EARLY WARNING BROADCASTED
                </div>
                <div className="text-6xl sm:text-7xl font-mono font-black text-white">
                  {simCountdown}s
                </div>
                <p className="text-xs text-amber-300 font-semibold">
                  Seconds until destructive S-wave shaking arrives at your location ({distance} km away).
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold uppercase">
                    DROP
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-orange-600 text-white text-xs font-bold uppercase">
                    COVER
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold uppercase">
                    HOLD ON
                  </span>
                </div>
              </div>
            )}

            {isRunning && simStep === 5 && (
              <div className="space-y-3 alert-flash p-4 rounded-xl border border-red-500 max-w-lg">
                <div className="text-red-400 font-black text-lg uppercase tracking-wider animate-bounce">
                  STRONG GROUND SHAKING (S-WAVE ARRIVAL)
                </div>
                <p className="text-xs text-slate-200">
                  Remain beneath heavy desk or table. Protect head and neck. Do NOT run outdoors or use elevators!
                </p>
              </div>
            )}

            {isRunning && simStep === 6 && (
              <div className="space-y-3 max-w-md animate-in fade-in">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white">Drill Simulation Complete</h3>
                <p className="text-xs text-slate-300">
                  You successfully experienced the simulated early-warning window and life-saving response drill.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => setActiveTab('preparedness')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Check Preparedness Kit
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Run Another Scenario
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Scientific Disclaimer Badge */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Notice: Wave travel velocities derived from standard crustal seismological velocity models.</span>
            <span className="text-amber-400 font-semibold">Strictly for demonstration</span>
          </div>
        </div>
      </div>
    </div>
  );
};
