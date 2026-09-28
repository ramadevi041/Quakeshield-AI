import React, { useEffect, useRef } from 'react';
import {
  Shield,
  Activity,
  AlertTriangle,
  Radio,
  CheckCircle,
  ArrowRight,
  Flame,
  LifeBuoy,
  Users,
  Compass,
  PlayCircle,
  HelpCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { SupportedLanguage, Earthquake } from '../types';
import { translations } from '../utils/i18n';

interface Props {
  setActiveTab: (tab: string) => void;
  language: SupportedLanguage;
  earthquakes: Earthquake[];
  onStartDemoTour: () => void;
}

export const LandingView: React.FC<Props> = ({
  setActiveTab,
  language,
  earthquakes,
  onStartDemoTour
}) => {
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle animated seismic-wave canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    interface WaveRing {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      speed: number;
      alpha: number;
      color: string;
    }

    const rings: WaveRing[] = [];
    const epicenters = [
      { x: width * 0.3, y: height * 0.5, color: '245, 158, 11' }, // amber
      { x: width * 0.7, y: height * 0.45, color: '239, 68, 68' }, // red
      { x: width * 0.5, y: height * 0.65, color: '59, 130, 246' }, // blue
    ];

    let timer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint seismic grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Periodically spawn seismic wave pulses
      timer++;
      if (timer % 55 === 0) {
        const epi = epicenters[Math.floor(Math.random() * epicenters.length)];
        rings.push({
          x: epi.x + (Math.random() * 60 - 30),
          y: epi.y + (Math.random() * 40 - 20),
          radius: 4,
          maxRadius: Math.min(width, height) * 0.75,
          speed: 1.2 + Math.random() * 0.8,
          alpha: 0.8,
          color: epi.color
        });
      }

      // Draw and expand rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.radius += ring.speed;
        ring.alpha *= 0.985;

        ctx.save();
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ring.color}, ${ring.alpha * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner P-wave marker
        if (ring.radius > 40) {
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.radius * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${ring.color}, ${ring.alpha * 0.35})`;
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();

        if (ring.alpha < 0.02 || ring.radius > ring.maxRadius) {
          rings.splice(i, 1);
        }
      }

      // Epicenter center dots
      epicenters.forEach(epi => {
        ctx.beginPath();
        ctx.arc(epi.x, epi.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${epi.color})`;
        ctx.shadowColor = `rgb(${epi.color})`;
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0c1427]/80 via-[#070b14]/90 to-[#060913] p-8 sm:p-14 text-center">
        {/* Subtle Canvas seismic wave background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
        />

        {/* Hero glow overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Earthquake Safety & Public Preparedness Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            QUAKESHIELD <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            {t.tagline}
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Combining long-term seismic hazard modeling, high-speed early warning simulation, structured emergency protocols, and Gemini AI safety advising.
          </p>

          {/* Main Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('risk')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-xl shadow-amber-500/20 cursor-pointer transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-slate-950" />
              <span>{t.checkRisk}</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow-lg cursor-pointer transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{t.liveMap}</span>
            </button>

            <button
              onClick={() => setActiveTab('during')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-red-600/90 hover:bg-red-500 text-white shadow-xl shadow-red-600/25 cursor-pointer transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>{t.emergencyGuide}</span>
            </button>

            <button
              onClick={onStartDemoTour}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 cursor-pointer transition-all flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4 text-indigo-400" />
              <span>Launch Presentation Tour</span>
            </button>
          </div>
        </div>
      </section>

      {/* The Three Pillars: PREPARE, DETECT, PROTECT */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Core Safety Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Three Steps to Earthquake Resilience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: PREPARE */}
          <div className="relative rounded-2xl p-7 bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Pillar 01</div>
            <h3 className="text-xl font-extrabold text-white mb-2">PREPARE</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Understand your area's earthquake risk and prepare in advance. Audit home hazards, build a 72-hour survival kit, and practice family drills.
            </p>
            <button
              onClick={() => setActiveTab('preparedness')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              <span>Explore Preparedness Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: DETECT */}
          <div className="relative rounded-2xl p-7 bg-slate-900/60 border border-slate-800 hover:border-red-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Pillar 02</div>
            <h3 className="text-xl font-extrabold text-white mb-2">DETECT</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Monitor verified earthquake telemetry and receive early warnings when available. Harness rapid P-wave arrival calculations before damaging S-waves strike.
            </p>
            <button
              onClick={() => setActiveTab('early-warning')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer"
            >
              <span>Open Early Warning Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: PROTECT */}
          <div className="relative rounded-2xl p-7 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Pillar 03</div>
            <h3 className="text-xl font-extrabold text-white mb-2">PROTECT</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Follow simple, proven emergency instructions before, during and after an earthquake. Master DROP, COVER, HOLD ON and post-quake utility isolation.
            </p>
            <button
              onClick={() => setActiveTab('during')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              <span>View Emergency Protocol</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Prominent Scientific Disclaimer Box */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-amber-950/30 via-slate-900/80 to-amber-950/30 border border-amber-500/40 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-amber-300 tracking-wide uppercase">
              Scientific Principle & Transparency Statement
            </h3>
            <p className="text-slate-200 text-sm leading-relaxed">
              "QuakeShield AI does not predict earthquakes. It uses hazard information and, when available, verified earthquake/early-warning data to support preparedness and emergency response."
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span><strong>No Fake Predictions:</strong> Earthquakes cannot be forecast for a specific date or time.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>Physics-Based Warning:</strong> Telemetry detects P-waves after rupture begins.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Monitored Earthquakes Snapshot */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telemetry Stream</span>
            <h3 className="text-xl font-bold text-white">Recent Global Seismic Activity</h3>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Interactive Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {earthquakes.slice(0, 4).map((eq) => {
            const magColor =
              eq.magnitude >= 6.5
                ? 'text-red-400 border-red-500/40 bg-red-950/20'
                : eq.magnitude >= 5.0
                ? 'text-amber-400 border-amber-500/40 bg-amber-950/20'
                : 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';

            return (
              <div
                key={eq.id}
                onClick={() => setActiveTab('map')}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${magColor}`}>
                    M {eq.magnitude.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {Math.round((Date.now() - eq.time) / 60000)}m ago
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {eq.place}
                </h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Depth: {eq.depth} km</span>
                  <span className="font-mono text-[10px] uppercase text-slate-500">
                    {eq.isLive ? 'USGS LIVE' : 'DEMO FEED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Matrix Grid */}
      <section className="pt-6 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Complete Toolkit</span>
          <h3 className="text-2xl font-bold text-white">Full Emergency Management Capabilities</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('simulator')}
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-amber-500/30 text-left transition-all cursor-pointer group"
          >
            <Flame className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-white">Seismic Simulator</h4>
            <p className="text-xs text-slate-400 mt-1">Simulate wave propagation and warning time calculations.</p>
          </button>

          <button
            onClick={() => setActiveTab('shelters')}
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 text-left transition-all cursor-pointer group"
          >
            <LifeBuoy className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-white">Safe Zones & Shelters</h4>
            <p className="text-xs text-slate-400 mt-1">Locate trauma centers, open assembly points, and shelters.</p>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 text-left transition-all cursor-pointer group"
          >
            <Sparkles className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-white">QuakeGuide AI</h4>
            <p className="text-xs text-slate-400 mt-1">Ask questions regarding home retrofits and emergency survival.</p>
          </button>

          <button
            onClick={() => setActiveTab('family-plan')}
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 text-left transition-all cursor-pointer group"
          >
            <Users className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold text-sm text-white">Family Safety Plan</h4>
            <p className="text-xs text-slate-400 mt-1">Create and print family reunion and emergency contact cards.</p>
          </button>
        </div>
      </section>
    </div>
  );
};
