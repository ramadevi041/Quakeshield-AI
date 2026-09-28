import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Shield,
  Plus,
  Trash2,
  Phone,
  Heart,
  Globe,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { COUNTRY_EMERGENCY_DIRECTORIES } from '../data/fallbackData';
import { EmergencyContact } from '../types';

export const ContactsView: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('USA');
  const [familyContacts, setFamilyContacts] = useState<EmergencyContact[]>(() => {
    try {
      const saved = localStorage.getItem('quakeshield_contacts');
      return saved
        ? JSON.parse(saved)
        : [
            { id: '1', name: 'Mom & Dad', role: 'Parents', phone: '+1 (555) 234-5678', category: 'Family & Loved One' },
            { id: '2', name: 'Uncle David (Out-of-State)', role: 'Emergency Relay Contact', phone: '+1 (555) 876-5432', category: 'Family & Loved One' }
          ];
    } catch {
      return [];
    }
  });

  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('quakeshield_contacts', JSON.stringify(familyContacts));
    } catch (e) {
      // Ignore
    }
  }, [familyContacts]);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newName.trim(),
      role: newRole.trim() || 'Emergency Contact',
      phone: newPhone.trim(),
      category: 'Family & Loved One'
    };

    setFamilyContacts([...familyContacts, contact]);
    setNewName('');
    setNewRole('');
    setNewPhone('');
  };

  const handleDeleteContact = (id: string) => {
    setFamilyContacts(familyContacts.filter((c) => c.id !== id));
  };

  const directory = COUNTRY_EMERGENCY_DIRECTORIES[selectedCountry] || COUNTRY_EMERGENCY_DIRECTORIES.USA;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider">
          <PhoneCall className="w-3.5 h-3.5 text-red-400" />
          <span>Emergency Helplines & Family Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">EMERGENCY CONTACTS</h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Instantly connect with national emergency dispatchers, search & rescue authorities, and your personal household emergency circle.
        </p>
      </div>

      {/* Country Selector Dropdown */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Selected Jurisdiction</span>
            <span className="text-xs text-slate-400">Numbers automatically adapt to your geographic region.</span>
          </div>
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          aria-label="Select country for emergency contact directory"
          className="bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
        >
          <option value="USA">United States & Canada (911)</option>
          <option value="India">India (112 Unified Emergency)</option>
          <option value="Japan">Japan (110 Police / 119 Rescue)</option>
          <option value="Turkey">Turkey (112 AFAD Emergency)</option>
          <option value="Mexico">Mexico (911 Civil Protection)</option>
          <option value="Chile">Chile (131/132/133 SENAPRED)</option>
          <option value="Global">International Standard (112 / 911)</option>
        </select>
      </div>

      {/* Official Emergency Dispatch Cards (Big Tap-to-Call Buttons) */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">
          Official Emergency Services — {directory.country}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Unified / Police */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Police / Law Enforcement</div>
              <h3 className="text-xl font-black text-white mt-1">Police Dispatch</h3>
              <p className="text-xs text-slate-400 mt-1">Law and order, search security, evacuation perimeters.</p>
            </div>
            <a
              href={`tel:${directory.police}`}
              className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call {directory.police}</span>
            </a>
          </div>

          {/* Ambulance / Medical */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Medical Trauma</div>
              <h3 className="text-xl font-black text-white mt-1">Ambulance & Paramedic</h3>
              <p className="text-xs text-slate-400 mt-1">Severe crush injuries, burns, cardiac triage.</p>
            </div>
            <a
              href={`tel:${directory.ambulance.split('/')[0].trim()}`}
              className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call {directory.ambulance}</span>
            </a>
          </div>

          {/* Fire / Hazmat */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Fire & Heavy Rescue</div>
              <h3 className="text-xl font-black text-white mt-1">Fire Rescue</h3>
              <p className="text-xs text-slate-400 mt-1">Gas line fires, structural building extraction.</p>
            </div>
            <a
              href={`tel:${directory.fire}`}
              className="py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call {directory.fire}</span>
            </a>
          </div>

          {/* Disaster Management */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Disaster Authority</div>
              <h3 className="text-xl font-black text-white mt-1">Civil Defense</h3>
              <p className="text-xs text-slate-400 mt-1">{directory.notes}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs font-bold text-amber-300">
              {directory.disaster}
            </div>
          </div>
        </div>
      </div>

      {/* Household & Loved Ones Emergency Circle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Saved Contacts List (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Personal Emergency Circle ({familyContacts.length})</span>
            </h2>
            <span className="text-xs text-slate-400">Encrypted in browser storage</span>
          </div>

          {familyContacts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No family contacts saved yet. Add your immediate family or an out-of-area relative below.
            </div>
          ) : (
            <div className="space-y-2.5">
              {familyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-sm text-white">{contact.name}</h4>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-amber-400">{contact.role}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-300">{contact.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${contact.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 cursor-pointer"
                      title="Delete contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Contact Form (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl p-6 bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
            Add Emergency Contact
          </h3>

          <form onSubmit={handleAddContact} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label htmlFor="contact-name-input" className="font-semibold text-slate-300 block">Contact Name *</label>
              <input
                id="contact-name-input"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Aunt Sarah (Chicago)"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-role-input" className="font-semibold text-slate-300 block">Relationship / Role</label>
              <input
                id="contact-role-input"
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. Out-of-state relay, Neighbor"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-phone-input" className="font-semibold text-slate-300 block">Phone Number *</label>
              <input
                id="contact-phone-input"
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. +1 555-019-2834"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Contact to Circle</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
