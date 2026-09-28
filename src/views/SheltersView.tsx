import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Hospital,
  Shield,
  Flame,
  Trees,
  MapPin,
  Phone,
  Search,
  CheckCircle,
  Navigation,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Shelter } from '../types';
import { api } from '../services/api';

export const SheltersView: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);

  useEffect(() => {
    const loadShelters = async () => {
      setLoading(true);
      try {
        const data = await api.getShelters();
        setShelters(data);
        if (data.length > 0) setSelectedShelter(data[0]);
      } catch (err) {
        console.error('Failed to load shelters:', err);
      } finally {
        setLoading(false);
      }
    };
    loadShelters();
  }, []);

  const categories = ['All', 'Hospital / Trauma', 'Emergency Shelter', 'Open Safe Zone', 'Fire Station'];

  const filteredShelters = shelters.filter((sh) => {
    const matchesCategory = filterCategory === 'All' || sh.category === filterCategory;
    const matchesSearch =
      sh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sh.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Hospital / Trauma':
        return <Hospital className="w-4 h-4 text-red-400" />;
      case 'Emergency Shelter':
        return <LifeBuoy className="w-4 h-4 text-amber-400" />;
      case 'Open Safe Zone':
        return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'Fire Station':
        return <Flame className="w-4 h-4 text-orange-400" />;
      default:
        return <Shield className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <LifeBuoy className="w-3.5 h-3.5 text-emerald-400" />
          <span>Evacuation & Relief Infrastructure</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">SAFE ZONES & EMERGENCY SHELTERS</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Verified medical trauma centers, designated seismic refuges, and open municipal parks with minimal falling structural hazards.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat !== 'All' && getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shelter by name or street..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Shelters Display Grid (List + Map Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shelters Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading verified shelter registry...</div>
          ) : filteredShelters.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
              No emergency facilities match current search criteria.
            </div>
          ) : (
            filteredShelters.map((shelter) => {
              const isSelected = selectedShelter?.id === shelter.id;
              return (
                <div
                  key={shelter.id}
                  onClick={() => setSelectedShelter(shelter)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                        {getCategoryIcon(shelter.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">{shelter.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{shelter.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {shelter.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase block">Operational Status</span>
                      <span className="font-semibold text-emerald-400">{shelter.status}</span>
                    </div>
                    <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase block">Capacity</span>
                      <span className="font-semibold text-slate-200">{shelter.capacity}</span>
                    </div>
                  </div>

                  {/* Facility feature badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {shelter.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Facility Inspector & Directions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedShelter ? (
            <div className="rounded-2xl p-6 bg-slate-900/90 border border-slate-800 space-y-5 sticky top-24">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400">Facility Details</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedShelter.name}</h3>
                <div className="text-xs text-amber-400 font-medium mt-0.5">{selectedShelter.category}</div>
              </div>

              {/* Spatial mini-map canvas representation */}
              <div className="h-44 rounded-xl bg-[#050812] border border-slate-800 relative overflow-hidden flex items-center justify-center">
                {/* Concentric distance rings */}
                <div className="w-32 h-32 rounded-full border border-slate-800 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-slate-800/80 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500" title="Your Location" />
                    </div>
                  </div>
                </div>

                {/* Target Pin */}
                <div className="absolute top-1/3 right-1/3 flex flex-col items-center">
                  <div className="p-1 rounded-full bg-red-600 text-white animate-bounce shadow-lg shadow-red-600/40">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-white bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 mt-0.5">
                    {selectedShelter.distanceKm} km away
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  GIS Lat: {selectedShelter.coordinates.lat.toFixed(3)}° · Lng: {selectedShelter.coordinates.lng.toFixed(3)}°
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Address</span>
                  <span className="text-slate-200 font-semibold">{selectedShelter.address}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Direct Helpline</span>
                  <a href={`tel:${selectedShelter.contact}`} className="text-cyan-400 font-mono font-bold hover:underline">
                    {selectedShelter.contact}
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Available Resources</span>
                  <ul className="mt-1 space-y-1 text-slate-300">
                    {selectedShelter.facilities.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedShelter.name + ' ' + selectedShelter.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`tel:${selectedShelter.contact}`}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
              Select any shelter on the left to inspect facilities, contact numbers, and routing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
