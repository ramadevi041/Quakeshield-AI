import React, { useState, useMemo } from 'react';
import {
  Activity,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Clock,
  MapPin,
  ExternalLink,
  ShieldAlert,
  X,
  Compass,
  Radio
} from 'lucide-react';
import { Earthquake } from '../types';
import { TECTONIC_FAULT_SEGMENTS } from '../data/fallbackData';

interface Props {
  earthquakes: Earthquake[];
  isLiveFeed: boolean;
  onRefresh: (forceDemo?: boolean) => void;
  userCoords?: { lat: number; lng: number };
}

export const MapView: React.FC<Props> = ({
  earthquakes,
  isLiveFeed,
  onRefresh,
  userCoords = { lat: 37.77, lng: -122.41 }
}) => {
  const [selectedQuake, setSelectedQuake] = useState<Earthquake | null>(null);
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d'>('7d');
  const [minMag, setMinMag] = useState<number>(0);
  const [showFaults, setShowFaults] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map dimensions for projection: Equirectangular projection
  // Longitude: -180 to +180 -> x: 0 to 900
  // Latitude: +85 to -85 -> y: 0 to 450
  const mapWidth = 900;
  const mapHeight = 450;

  const projectCoords = (lng: number, lat: number) => {
    const x = ((lng + 180) / 360) * mapWidth;
    const y = ((85 - Math.max(Math.min(lat, 85), -85)) / 170) * mapHeight;
    return { x, y };
  };

  // Filtered earthquakes
  const filteredQuakes = useMemo(() => {
    const now = Date.now();
    let maxAgeMs = 1000 * 60 * 60 * 24; // 24h
    if (timeFilter === '7d') maxAgeMs = 1000 * 60 * 60 * 24 * 7;
    if (timeFilter === '30d') maxAgeMs = 1000 * 60 * 60 * 24 * 30;

    return earthquakes.filter((eq) => {
      const age = now - eq.time;
      const magMatch = eq.magnitude >= minMag;
      const timeMatch = age <= maxAgeMs;
      return magMatch && timeMatch;
    });
  }, [earthquakes, timeFilter, minMag]);

  // Calculate distance between quake and user
  const calculateDistanceKm = (eqLng: number, eqLat: number) => {
    const dLat = (eqLat - userCoords.lat) * 111;
    const dLng = (eqLng - userCoords.lng) * 111 * Math.cos((userCoords.lat * Math.PI) / 180);
    return Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <span>Interactive Global Earthquake Map</span>
            </h1>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                isLiveFeed
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}
            >
              {isLiveFeed ? 'USGS LIVE STREAM' : 'DEMO/SIMULATION DATA'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time seismic telemetry and historical fault zone monitoring. Drag to pan, scroll to zoom.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time range */}
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setTimeFilter('24h')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                timeFilter === '24h' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeFilter('7d')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                timeFilter === '7d' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeFilter('30d')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                timeFilter === '30d' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Magnitude Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Mag:</span>
            <select
              value={minMag}
              onChange={(e) => setMinMag(Number(e.target.value))}
              aria-label="Filter minimum earthquake magnitude"
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-slate-900">All (M2.0+)</option>
              <option value={4.0} className="bg-slate-900">M4.0+ (Light)</option>
              <option value={5.5} className="bg-slate-900">M5.5+ (Moderate)</option>
              <option value={6.5} className="bg-slate-900">M6.5+ (Strong/Major)</option>
            </select>
          </div>

          {/* Toggle Fault lines */}
          <button
            onClick={() => setShowFaults(!showFaults)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              showFaults
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Fault Lines {showFaults ? 'ON' : 'OFF'}
          </button>

          {/* Data Feed Toggle */}
          <button
            onClick={() => onRefresh(!isLiveFeed)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
            title="Toggle between real USGS GeoJSON API and verified simulation dataset"
          >
            {isLiveFeed ? 'Switch to Demo' : 'Switch to Live USGS'}
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#060a16] shadow-2xl h-[540px] select-none">
        {/* Map Viewport Controller Tools */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl shadow-lg backdrop-blur-md">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.4, 3.5))}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.4, 0.8))}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-lg backdrop-blur-md text-[11px] space-y-2 pointer-events-none">
          <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Magnitude Radii</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span className="text-slate-400">&lt; M5.0</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-400 inline-block" />
              <span className="text-slate-400">M5.0 - M6.5</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-red-500 inline-block animate-pulse" />
              <span className="text-red-400 font-bold">&gt; M6.5</span>
            </span>
          </div>
          {showFaults && (
            <div className="pt-1 border-t border-slate-800 flex items-center gap-2 text-slate-400">
              <span className="w-6 h-0.5 bg-red-500/80 inline-block" />
              <span>Tectonic Plate Boundaries</span>
            </div>
          )}
        </div>

        {/* Interactive SVG Surface */}
        <div
          className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-full transition-transform duration-75"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
          >
            <defs>
              {/* Gradients */}
              <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#081024" />
                <stop offset="100%" stopColor="#04060d" />
              </radialGradient>
              <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Ocean background */}
            <rect width={mapWidth} height={mapHeight} fill="url(#oceanGlow)" />
            <rect width={mapWidth} height={mapHeight} fill="url(#gridPattern)" />

            {/* Approximate stylized continents for spatial reference */}
            {/* North America */}
            <path
              d="M 120,60 L 260,60 L 240,110 L 220,160 L 190,190 L 150,150 L 110,100 Z"
              fill="#0f192e"
              stroke="#1e293b"
              strokeWidth="0.75"
            />
            {/* South America */}
            <path
              d="M 220,200 L 270,220 L 260,330 L 230,390 L 210,310 L 200,230 Z"
              fill="#0f192e"
              stroke="#1e293b"
              strokeWidth="0.75"
            />
            {/* Eurasia */}
            <path
              d="M 400,60 L 780,60 L 750,130 L 680,180 L 590,170 L 520,190 L 460,140 L 410,100 Z"
              fill="#0f192e"
              stroke="#1e293b"
              strokeWidth="0.75"
            />
            {/* Africa */}
            <path
              d="M 430,170 L 520,180 L 530,270 L 490,340 L 440,300 L 410,210 Z"
              fill="#0f192e"
              stroke="#1e293b"
              strokeWidth="0.75"
            />
            {/* Australia */}
            <path
              d="M 700,280 L 780,270 L 790,340 L 720,350 L 690,310 Z"
              fill="#0f192e"
              stroke="#1e293b"
              strokeWidth="0.75"
            />
            {/* Japan Arc */}
            <path
              d="M 720,120 Q 740,140 730,170"
              fill="none"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Tectonic Fault Lines */}
            {showFaults &&
              TECTONIC_FAULT_SEGMENTS.map((fault, idx) => {
                const pathData = fault.coords
                  .map((c, i) => {
                    const p = projectCoords(c[0], c[1]);
                    return `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`;
                  })
                  .join(' ');
                return (
                  <path
                    key={`fault-${idx}`}
                    d={pathData}
                    fill="none"
                    stroke="rgba(239, 68, 68, 0.45)"
                    strokeWidth="1.2"
                    strokeDasharray="3,3"
                  />
                );
              })}

            {/* User location pin */}
            {userCoords && (
              <g
                transform={`translate(${projectCoords(userCoords.lng, userCoords.lat).x}, ${
                  projectCoords(userCoords.lng, userCoords.lat).y
                })`}
              >
                <circle r="7" fill="rgba(59, 130, 246, 0.3)" />
                <circle r="3" fill="#3b82f6" />
                <text y="-8" textAnchor="middle" fill="#93c5fd" fontSize="8" fontWeight="bold">
                  My Location
                </text>
              </g>
            )}

            {/* Earthquake Epicenters */}
            {filteredQuakes.map((eq) => {
              const pt = projectCoords(eq.coordinates[0], eq.coordinates[1]);
              const radius = Math.max(3.5, Math.pow(eq.magnitude, 1.45) * 1.3);
              const isSelected = selectedQuake?.id === eq.id;

              const fill =
                eq.magnitude >= 6.5
                  ? '#ef4444' // Red
                  : eq.magnitude >= 5.0
                  ? '#f59e0b' // Amber
                  : '#10b981'; // Emerald

              return (
                <g
                  key={eq.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuake(eq);
                  }}
                >
                  {/* Glowing halo for major earthquakes */}
                  {eq.magnitude >= 6.0 && (
                    <circle
                      r={radius * 2}
                      fill="none"
                      stroke={fill}
                      strokeWidth="1"
                      opacity="0.4"
                      className="seismic-ring"
                    />
                  )}

                  {/* Base Circle */}
                  <circle
                    r={radius}
                    fill={fill}
                    fillOpacity={isSelected ? 0.95 : 0.75}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2 : 0.75}
                  />

                  {/* Magnitude text */}
                  {eq.magnitude >= 5.0 && (
                    <text
                      y={radius + 9}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-md"
                    >
                      M{eq.magnitude.toFixed(1)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Earthquake Details Slide-out Drawer */}
        {selectedQuake && (
          <div className="absolute top-4 left-4 z-30 w-80 max-w-[calc(100%-2rem)] bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-2xl p-5 backdrop-blur-xl animate-in fade-in slide-in-from-left duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">Earthquake Telemetry</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-sm font-mono font-extrabold border ${
                      selectedQuake.magnitude >= 6.5
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : selectedQuake.magnitude >= 5.0
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    M {selectedQuake.magnitude.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-white capitalize">{selectedQuake.status}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedQuake(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Location</span>
                <span className="font-semibold text-slate-100">{selectedQuake.place}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block">Focal Depth</span>
                  <span className="font-mono text-cyan-300 font-bold">{selectedQuake.depth} km</span>
                </div>

                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase block">Distance to User</span>
                  <span className="font-mono text-amber-300 font-bold">
                    ~{calculateDistanceKm(selectedQuake.coordinates[0], selectedQuake.coordinates[1])} km
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-slate-400 text-[10px] uppercase block">Recorded Time</span>
                <span className="text-slate-300">
                  {new Date(selectedQuake.time).toUTCString()} ({Math.round((Date.now() - selectedQuake.time) / 60000)}m ago)
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Seismic Data Source</span>
                <span className="text-slate-300">{selectedQuake.source}</span>
              </div>

              {selectedQuake.fault && (
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Associated Fault Zone</span>
                  <span className="text-amber-400 font-medium">{selectedQuake.fault}</span>
                </div>
              )}

              {selectedQuake.tsunami === 1 && (
                <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-[11px] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Tsunami Advisory / Evaluation Flagged</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <a
                href={`https://earthquake.usgs.gov/earthquakes/map/?currentFeatureId=${selectedQuake.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>View on USGS Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Note */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Showing {filteredQuakes.length} earthquakes matching current magnitude and date filters.</span>
        </div>
        <div>
          Data Source: <strong className="text-slate-300">{isLiveFeed ? 'USGS Hazards Program API' : 'Verified Demonstration Feed'}</strong>
        </div>
      </div>
    </div>
  );
};
