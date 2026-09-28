import React from 'react';
import {
  Info,
  Shield,
  Server,
  Database,
  Cpu,
  Map,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Terminal,
  ExternalLink
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>System Documentation & Academic Brief</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">ABOUT QUAKESHIELD AI</h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          QuakeShield AI is an integrated public safety and earthquake preparedness engineering platform designed to bridge the gap between high-level geophysical hazard science and rapid, life-saving household response.
        </p>
      </div>

      {/* Prominent Scientific Statement Box */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-2 border-amber-500/60 shadow-xl space-y-2">
        <div className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Scientific Foundation & Limitation Statement</span>
        </div>
        <blockquote className="text-base sm:text-lg font-bold text-white italic">
          "QuakeShield AI is not an earthquake prediction system. It is a preparedness, hazard-information and early-warning platform."
        </blockquote>
        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          Currently, neither empirical science, deep learning models, nor geological agencies can forecast the exact date, time, and location of future earthquakes. QuakeShield AI strictly distinguishes between long-term probabilistic hazard risk (PSHA), physical early-warning detection (P-wave electronic telemetry after rupture), and immediate personal safety actions.
        </p>
      </div>

      {/* Problem & Solution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span>The Problem</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Earthquakes strike without notice, causing catastrophic loss of life and property. Most casualties occur not from ground fissure or fault slip directly, but from collapsing non-structural elements, falling glass, building facades, overturned furniture, severed gas pipelines, and general panic. The public frequently lacks actionable, instant emergency instructions and 72-hour survival supplies.
          </p>
        </div>

        <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-3">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>The Solution</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            QuakeShield AI creates a single, reliable public platform combining:
            (1) Location-based probabilistic hazard assessment,
            (2) High-speed early warning simulation leveraging physical P/S wave differential velocities,
            (3) Large, accessible emergency guidance (Drop, Cover, Hold On),
            (4) Interactive 72-hour checklists and safety score audits,
            (5) Safe shelter GIS mapping, and
            (6) QuakeGuide AI safety assistant powered by Gemini.
          </p>
        </div>
      </div>

      {/* Engineering Architecture & Technical Stack */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Full-Stack Technical Architecture</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Frontend Web Client</h3>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li>• React 19 & TypeScript</li>
              <li>• Vite Build Engine</li>
              <li>• Tailwind CSS v4 styling</li>
              <li>• Lucide icons & Motion</li>
              <li>• Web Audio API Synthesizer</li>
              <li>• Multi-language (EN, HI, TE)</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Backend & APIs</h3>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li>• Node.js & Express server</li>
              <li>• USGS GeoJSON telemetry client</li>
              <li>• In-memory caching & fallback</li>
              <li>• Probabilistic risk calculator</li>
              <li>• Damage reports REST endpoints</li>
              <li>• Admin telemetry metrics</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">AI Intelligence Layer</h3>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li>• @google/genai SDK (server-side)</li>
              <li>• Gemini 3.8 Flash model</li>
              <li>• QuakeGuide AI safety bot</li>
              <li>• Regional seismic synthesis</li>
              <li>• Strict anti-prediction guardrails</li>
              <li>• Structured safety formatting</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ten Project Explanation Answers */}
      <section className="rounded-2xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <span>Project Defense & Faculty Question Answers</span>
        </h2>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300">1. Project Architecture</h4>
            <p className="text-slate-400">
              Modern full-stack Single Page Application (SPA). A Node.js Express server (`server.ts`) serves both backend REST APIs and mounts Vite development middleware. The frontend communicates with the server via structured `/api/*` endpoints.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300">2. Technologies Used</h4>
            <p className="text-slate-400">
              React 19, TypeScript, Vite, Tailwind CSS v4, Express, @google/genai TypeScript SDK, Web Audio API, and USGS GeoJSON feeds.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300">3. Database Schema</h4>
            <p className="text-slate-400">
              Entities include `Earthquakes` (magnitude, depth, epicenter, timestamp, source), `DamageReports` (location, damageType, severity, status), `Shelters` (capacity, facilities, contact, distance), and client-encrypted `FamilySafetyPlans`.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300">4. AI Functionality</h4>
            <p className="text-slate-400">
              Powered by `gemini-3.8-flash` via the official `@google/genai` SDK on the server. AI powers both the interactive conversational advisor (QuakeGuide AI) and automated seismic domain pattern syntheses with strict guardrails prohibiting fake predictions.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300">5. Earthquake Data Source Integration</h4>
            <p className="text-slate-400">
              The dedicated service layer in `server.ts` queries the public USGS Hazards API (`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson`) with a 3-minute in-memory cache and automatic fallback to verified global historical records if offline.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300">6. How the Early Warning Concept Works</h4>
            <p className="text-slate-400">
              Seismic ruptures produce compressional P-waves (~6 km/s) and destructive shear S-waves (~3.5 km/s). Electronic telemetry travels at lightspeed (~300,000 km/s). Once local stations detect the P-wave, alerts reach population centers seconds to minutes before destructive shaking arrives.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300">7. How to Configure API Keys</h4>
            <p className="text-slate-400">
              Define `GEMINI_API_KEY` in the server environment (or AI Studio Secrets panel). The server automatically injects the key into `@google/genai` calls. The client never handles or exposes raw API keys.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300">8. How to Run the Application</h4>
            <p className="text-slate-400">
              Run `npm run dev` to start the tsx server running on port 3000 with Vite middleware. In production, run `npm run build` followed by `npm start`.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300">9. Which Features Currently Use Demo Data</h4>
            <p className="text-slate-400">
              The Earthquake Simulator uses physical parametric simulation formulas. The live map defaults to real USGS feeds but falls back to labeled demo datasets if network calls are offline or rate-limited.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-300">10. How to Replace Demo Data with Real Data</h4>
            <p className="text-slate-400">
              In `server.ts`, the `/api/earthquakes` route is already architected to ingest live USGS GeoJSON endpoints, and municipal GIS endpoints can be plugged directly into `/api/shelters` and `/api/reports` with zero client-side rewrites.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
