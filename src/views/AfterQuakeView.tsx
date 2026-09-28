import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Send,
  CheckCircle2,
  Camera,
  MapPin,
  Flame,
  Droplet,
  Zap,
  PhoneCall,
  LifeBuoy,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { DamageReport } from '../types';

interface Props {
  setActiveTab: (tab: string) => void;
  onNewReportAdded: (report: DamageReport) => void;
}

export const AfterQuakeView: React.FC<Props> = ({ setActiveTab, onNewReportAdded }) => {
  // Form State
  const [location, setLocation] = useState('');
  const [damageType, setDamageType] = useState('Structural Cracks');
  const [severity, setSeverity] = useState<'Minor' | 'Moderate' | 'Severe' | 'Critical'>('Moderate');
  const [description, setDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);

    if (!location.trim() || !description.trim()) {
      setSubmitError('Please provide location and description.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitDamageReport({
        location: location.trim(),
        damageType,
        severity,
        description: description.trim(),
        reporterContact: isAnonymous ? undefined : reporterContact.trim(),
        isAnonymous
      });

      if (res.success && res.data) {
        setSubmitSuccess('Damage report filed successfully! Emergency response and civil engineering triage teams notified.');
        onNewReportAdded(res.data);
        // Reset form
        setLocation('');
        setDescription('');
        setReporterContact('');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit report. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>Post-Earthquake Safety & Recovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">AFTER AN EARTHQUAKE</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Follow immediate post-shaking protocols to prevent secondary injuries from aftershocks, gas fires, and damaged electrical infrastructure.
        </p>
      </div>

      {/* Safety Priorities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Check for Gas Leaks</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            If you smell sulfur or hear hissing, turn off the main gas valve immediately using a wrench. Do NOT strike matches, use lighters, or operate light switches.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Electrical & Water Lines</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Turn off power at the main circuit breaker if sparks or frayed wires are visible. If municipal water pipes fracture, close the main supply valve to preserve clean water in pipes.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Expect Aftershocks</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Aftershocks can trigger collapses in already weakened masonry. Keep sturdy shoes on. Stay away from damaged facades and glass awnings.
          </p>
        </div>
      </div>

      {/* Main Form & Immediate Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Report Damage Form (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400" />
              <span>Report Damage to Emergency Dispatch</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Crowdsourced damage reports are logged in real-time on the disaster management administrative dashboard to guide relief prioritization.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          {submitError && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Location */}
            <div className="space-y-1">
              <label htmlFor="damage-location-input" className="font-semibold text-slate-300 block">Location / Address *</label>
              <div className="relative">
                <input
                  id="damage-location-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 450 Mission St, Apt 3B, San Francisco, CA"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Damage Type & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="damage-type-select" className="font-semibold text-slate-300 block">Damage Type</label>
                <select
                  id="damage-type-select"
                  value={damageType}
                  onChange={(e) => setDamageType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Structural Cracks">Structural Cracks / Foundation Shift</option>
                  <option value="Gas Leak / Smell">Gas Leak / Odor</option>
                  <option value="Water Main Break">Broken Water Pipe / Flooding</option>
                  <option value="Downed Power Lines">Downed High-Voltage Wire</option>
                  <option value="Fallen Facade / Tiles">Falling Bricks / Facade Collapse</option>
                  <option value="Trapped Persons">Persons Trapped (High Priority)</option>
                  <option value="Road / Bridge Blockage">Roadway Blocked / Crevasse</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="damage-severity-select" className="font-semibold text-slate-300 block">Severity Level</label>
                <select
                  id="damage-severity-select"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Minor">Minor (Cosmetic cracks, small items)</option>
                  <option value="Moderate">Moderate (Broken pipes, large cracks)</option>
                  <option value="Severe">Severe (Structural deformation, road cut)</option>
                  <option value="Critical">Critical (Immediate life hazard / collapse)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="damage-description-input" className="font-semibold text-slate-300 block">Detailed Description *</label>
              <textarea
                id="damage-description-input"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe visible hazards, building stability, blocked access routes, or injuries..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Contact & Anonymous */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="reporter-contact-input" className="font-semibold text-slate-300">Reporter Contact (Optional)</label>
                <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Submit Anonymously</span>
                </label>
              </div>
              {!isAnonymous && (
                <input
                  id="reporter-contact-input"
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="Phone number or email address for rescue follow-up..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Report...' : 'File Official Damage Report'}</span>
            </button>
          </form>
        </div>

        {/* Immediate Steps Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              Immediate Post-Quake Steps
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-white">Check for Injuries:</strong> Administer first aid. Do NOT move seriously injured individuals unless in immediate fire danger.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-white">Move Away from Masonry:</strong> Exit structurally compromised buildings safely via stairs (never elevators).
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-white">Conserve Phone Batteries:</strong> Use SMS text messaging rather than voice calls to reduce network congestion.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <strong className="text-white">Check on Vulnerable Neighbors:</strong> Assist elderly neighbors, children, or people with limited mobility if safe.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => setActiveTab('shelters')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-emerald-400" />
                <span>Find Safe Shelters</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                <span>Emergency Contacts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
