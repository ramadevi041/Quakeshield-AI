import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Compass,
  AlertTriangle,
  ShieldCheck,
  Search,
  Activity,
  Info,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle,
  Navigation
} from 'lucide-react';
import { RiskAssessment, HazardLevel } from '../types';
import { api } from '../services/api';
import { POPULAR_CITIES, CityPreset } from '../data/fallbackData';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const RiskCheckView: React.FC<Props> = ({ setActiveTab }) => {
  const [selectedCity, setSelectedCity] = useState<string>('San Francisco, California');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<RiskAssessment | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Fetch assessment whenever coordinates change
  const loadRisk = async (lat: number, lng: number, locName: string) => {
    setLoading(true);
    setGeoError(null);
    try {
      const res = await api.getRiskAssessment(lat, lng, locName);
      setRiskData(res);
    } catch (err: any) {
      console.error('Risk fetch error:', err);
      setGeoError('Could not calculate remote hazard. Loaded baseline hazard model.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisk(coords.lat, coords.lng, selectedCity);
  }, []);

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setSelectedCity(`Current Location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
        loadRisk(lat, lng, 'My GPS Coordinates');
      },
      (err) => {
        setLoading(false);
        setGeoError('Location permission was denied or unavailable. You can choose any city from the list below.');
      },
      { timeout: 8000 }
    );
  };

  // Search filter
  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (city: CityPreset) => {
    setSelectedCity(city.name);
    setCoords({ lat: city.lat, lng: city.lng });
    loadRisk(city.lat, city.lng, city.name);
  };

  // Badge colors
  const getHazardBadge = (level: HazardLevel) => {
    switch (level) {
      case 'VERY HIGH':
        return {
          bg: 'bg-red-500/20 text-red-400 border-red-500/40',
          gaugePercent: 92,
          color: '#ef4444',
          description: 'High seismic slip-rate zone directly adjacent to major active fault lines. Frequent historical seismicity.'
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          gaugePercent: 72,
          color: '#f97316',
          description: 'Significant seismic hazard zone with documented ground motion amplification and active tectonic deformation.'
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          gaugePercent: 48,
          color: '#eab308',
          description: 'Moderate historical seismicity. Earthquakes can occur along secondary or intraplate faults.'
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          gaugePercent: 18,
          color: '#10b981',
          description: 'Stable continental interior with low historical seismicity. Low ground shaking probability.'
        };
    }
  };

  const badge = riskData ? getHazardBadge(riskData.hazardLevel) : getHazardBadge('MODERATE');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Location Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Check My Earthquake Risk</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Evaluate probabilistic seismic hazard, active fault proximity, and recommended preparedness for your geographic region.
        </p>
      </div>

      {/* Geolocation & Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Location Trigger */}
        <div className="md:col-span-1 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>Detect My Coordinates</span>
            </h3>
            <p className="text-xs text-slate-400">
              Query your browser for approximate device latitude and longitude.
            </p>
          </div>
          <button
            onClick={handleUseCurrentLocation}
            disabled={loading}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all disabled:opacity-50"
          >
            <MapPin className="w-4 h-4" />
            <span>{loading ? 'Locating...' : 'Use My GPS Location'}</span>
          </button>
        </div>

        {/* Search City / Manual */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Search or Select a Known Seismic Region</span>
          </h3>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search major city (e.g., Tokyo, Istanbul, New Delhi, Seattle)..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          {/* Quick city tags */}
          <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleSelectCity(city)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  selectedCity === city.name
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {geoError && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Risk Results Display */}
      {riskData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Risk Score Card */}
          <div className="lg:col-span-2 rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="text-xs font-mono text-slate-400">ASSESSED LOCATION</div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span>{riskData.location}</span>
                </h2>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Lat: {riskData.coordinates.lat.toFixed(4)}° · Lng: {riskData.coordinates.lng.toFixed(4)}°
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Hazard Level</div>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-extrabold uppercase border tracking-wider mt-0.5 ${badge.bg}`}>
                    {riskData.hazardLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Gauge visualization bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Low Hazard</span>
                <span className="text-slate-400">Moderate</span>
                <span className="text-slate-400">High</span>
                <span className="text-red-400 font-bold">Very High</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${badge.gaugePercent}%`,
                    backgroundColor: badge.color
                  }}
                />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {badge.description}
              </p>
            </div>

            {/* Technical Geotechnical Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Nearest Fault System</div>
                <div className="text-sm font-bold text-white mt-1 line-clamp-1">{riskData.nearestFaultSystem}</div>
                <div className="text-xs text-amber-400 font-mono mt-0.5">~{riskData.distanceToFaultKm} km distance</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Est. Peak Acceleration</div>
                <div className="text-sm font-bold text-cyan-400 mt-1 font-mono">{riskData.peakGroundAcceleration}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Ground shaking potential</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Historical Max Magnitude</div>
                <div className="text-sm font-bold text-red-400 mt-1 font-mono">M {riskData.historicalMaxMagnitude.toFixed(1)}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Recorded geological event</div>
              </div>
            </div>

            {/* Recommended Preparedness Level */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Recommended Preparedness Standard
                </h4>
                <p className="text-xs text-slate-200 mt-0.5">{riskData.recommendedPreparedness}</p>
              </div>
            </div>
          </div>

          {/* Scientific Disclaimer & Actions Panel */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Crucial Scientific Principle</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {riskData.scientificDisclaimer}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Earthquake hazard indicators convey what ground forces buildings should be engineered to withstand — never a prediction that shaking will happen on any specific date.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Next Recommended Steps</h4>
              <button
                onClick={() => setActiveTab('preparedness')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
              >
                <span>Audit 72h Survival Kit</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                onClick={() => setActiveTab('during')}
                className="w-full py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
              >
                <span>Review Drop, Cover, Hold On</span>
                <ArrowRight className="w-3.5 h-3.5 text-red-400" />
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
              >
                <span>View Seismic Faults On Map</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
