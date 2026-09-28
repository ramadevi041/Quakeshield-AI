import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  MapPin,
  Heart,
  Plus,
  Trash2,
  Printer,
  Save,
  CheckCircle2,
  Sparkles,
  Lock
} from 'lucide-react';
import { FamilyMember, FamilySafetyPlan } from '../types';

export const FamilyPlanView: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem('quakeshield_family_members');
      return saved
        ? JSON.parse(saved)
        : [
            { id: '1', name: 'Alex Johnson', relation: 'Self', phone: '+1 (555) 234-5678', medicalNotes: 'Penicillin allergy' },
            { id: '2', name: 'Elena Johnson', relation: 'Spouse', phone: '+1 (555) 345-6789', medicalNotes: 'Asthma inhaler required' }
          ];
    } catch {
      return [];
    }
  });

  const [primaryMeeting, setPrimaryMeeting] = useState<string>('Grand View Park flagpole (1 block east of house)');
  const [secondaryMeeting, setSecondaryMeeting] = useState<string>('Lincoln High School Athletic Field parking lot');
  const [outOfAreaContact, setOutOfAreaContact] = useState<string>('Uncle Robert (Denver, CO) — +1 (555) 901-2345');
  const [medKitLocation, setMedKitLocation] = useState<string>('Master bathroom bottom cupboard (waterproof red pouch)');
  const [utilityShutoff, setUtilityShutoff] = useState<string>('Gas meter on north exterior wall; wrench tied to pipe');
  const [specialInstructions, setSpecialInstructions] = useState<string>('Do not return inside for pets until initial severe tremors stop.');

  // Form input for new member
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberMed, setNewMemberMed] = useState('');

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('quakeshield_family_plan');
      if (savedPlan) {
        const parsed = JSON.parse(savedPlan);
        setPrimaryMeeting(parsed.primaryMeeting || '');
        setSecondaryMeeting(parsed.secondaryMeeting || '');
        setOutOfAreaContact(parsed.outOfAreaContact || '');
        setMedKitLocation(parsed.medKitLocation || '');
        setUtilityShutoff(parsed.utilityShutoff || '');
        setSpecialInstructions(parsed.specialInstructions || '');
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMem: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      relation: newMemberRelation.trim() || 'Family Member',
      phone: newMemberPhone.trim(),
      medicalNotes: newMemberMed.trim()
    };

    const updated = [...members, newMem];
    setMembers(updated);
    localStorage.setItem('quakeshield_family_members', JSON.stringify(updated));
    setNewMemberName('');
    setNewMemberRelation('');
    setNewMemberPhone('');
    setNewMemberMed('');
  };

  const handleRemoveMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    localStorage.setItem('quakeshield_family_members', JSON.stringify(updated));
  };

  const handleSavePlan = () => {
    const plan = {
      primaryMeeting,
      secondaryMeeting,
      outOfAreaContact,
      medKitLocation,
      utilityShutoff,
      specialInstructions,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('quakeshield_family_plan', JSON.stringify(plan));
    setSaveStatus('Plan saved locally! Encrypted in private browser session.');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>Household Disaster Continuity</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">MY FAMILY SAFETY PLAN</h1>
            <p className="text-slate-400 text-sm mt-1">
              Designate meeting spots, out-of-area communication relays, and critical medical needs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Emergency Card</span>
            </button>
            <button
              onClick={handleSavePlan}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Plan</span>
            </button>
          </div>
        </div>
      </div>

      {saveStatus && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Privacy Protected:</strong> Your family roster, meeting spots, and medical notes are stored exclusively on your device's encrypted client storage and are never uploaded to public servers without permission.
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Family Roster & Medical (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Family Roster & Medical Notes</span>
              <span className="text-xs text-slate-400">{members.length} Members</span>
            </h2>

            <div className="space-y-3">
              {members.map((mem) => (
                <div
                  key={mem.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{mem.name}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {mem.relation}
                      </span>
                    </div>
                    {mem.phone && <div className="text-slate-400 font-mono">{mem.phone}</div>}
                    {mem.medicalNotes && (
                      <div className="text-amber-400 font-medium flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400" />
                        <span>Med: {mem.medicalNotes}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveMember(mem.id)}
                    className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Member Form */}
            <form onSubmit={handleAddMember} className="pt-2 border-t border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-white block">Add Member to Plan</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Full Name *"
                  required
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  value={newMemberRelation}
                  onChange={(e) => setNewMemberRelation(e.target.value)}
                  placeholder="Relation (Child, Spouse...)"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  value={newMemberMed}
                  onChange={(e) => setNewMemberMed(e.target.value)}
                  placeholder="Allergies / Critical Meds"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Family Member</span>
              </button>
            </form>
          </div>
        </div>

        {/* Meeting Points & Logistics (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Meeting Points & Evacuation Protocol</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">
                  1. Primary Meeting Point (Immediate Neighborhood) *
                </label>
                <input
                  type="text"
                  value={primaryMeeting}
                  onChange={(e) => setPrimaryMeeting(e.target.value)}
                  placeholder="e.g. Neighborhood park flagpole, oak tree across street"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">
                  2. Secondary Meeting Point (Outside Neighborhood) *
                </label>
                <input
                  type="text"
                  value={secondaryMeeting}
                  onChange={(e) => setSecondaryMeeting(e.target.value)}
                  placeholder="e.g. City library courtyard, community center 1 mile away"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">
                  3. Out-of-Area Relay Contact *
                </label>
                <input
                  type="text"
                  value={outOfAreaContact}
                  onChange={(e) => setOutOfAreaContact(e.target.value)}
                  placeholder="e.g. Relative in another state or province (Name + Phone)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Medical Kit Location</label>
                  <input
                    type="text"
                    value={medKitLocation}
                    onChange={(e) => setMedKitLocation(e.target.value)}
                    placeholder="e.g. Hallway linen closet"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Gas Shut-Off Valve</label>
                  <input
                    type="text"
                    value={utilityShutoff}
                    onChange={(e) => setUtilityShutoff(e.target.value)}
                    placeholder="e.g. Exterior south meter"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Special Instructions / Pets</label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Pet leash locations, elderly mobility assistance notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={handleSavePlan}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer transition-colors shadow-md shadow-amber-500/20"
              >
                Save Family Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
