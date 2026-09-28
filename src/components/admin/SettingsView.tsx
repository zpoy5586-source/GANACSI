import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { StaffMember } from '../../types';
import { 
  Building, 
  DollarSign, 
  Users, 
  Clock, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { profile, updateProfile, resetPresetData } = useBusiness();

  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [currency, setCurrency] = useState(profile.currency);
  const [taxRatePercent, setTaxRatePercent] = useState((profile.taxRate * 100).toString());
  const [openingHours, setOpeningHours] = useState(profile.openingHours);
  const [staff, setStaff] = useState<StaffMember[]>(profile.staff);

  // New staff modal state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const taxRate = (parseFloat(taxRatePercent) || 0) / 100;
    updateProfile({
      name,
      tagline,
      email,
      phone,
      address,
      currency,
      taxRate,
      openingHours,
      staff
    });
  };

  const handleAddStaff = () => {
    if (!newStaffName.trim()) return;
    const colors = ['#0d9488', '#0284c7', '#d97706', '#6366f1', '#ea580c', '#e11d48'];
    const randomColor = colors[staff.length % colors.length];

    const newMember: StaffMember = {
      id: 'st-' + Date.now(),
      name: newStaffName,
      role: newStaffRole || 'Specialist',
      email: newStaffEmail || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      color: randomColor,
      active: true
    };

    setStaff(prev => [...prev, newMember]);
    setNewStaffName('');
    setNewStaffRole('');
    setNewStaffEmail('');
  };

  const handleRemoveStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Top Header */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>Enterprise Settings</span>
            <span aria-hidden="true">·</span>
            <span>Profile & Staff</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Business Configuration
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Manage legal branding, localized sales tax percentage, operating schedules, and practitioners.
          </p>
        </div>

        <button
          onClick={resetPresetData}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Business Identity */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Building className="w-4 h-4 text-stone-500" />
            <h2 className="text-sm font-bold text-stone-900">Brand & Contact Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Company / Studio Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Tagline / Mission</label>
              <input 
                type="text" 
                value={tagline} 
                onChange={e => setTagline(e.target.value)} 
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Business Concierge Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Phone Number</label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono" 
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-medium text-stone-700 mb-1">Physical Address / Showroom Location</label>
            <input 
              type="text" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
            />
          </div>
        </div>

        {/* Section 2: Financial & Operations */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <DollarSign className="w-4 h-4 text-stone-500" />
            <h2 className="text-sm font-bold text-stone-900">Tax & Operating Schedule</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Currency Symbol</label>
              <input 
                type="text" 
                value={currency} 
                onChange={e => setCurrency(e.target.value)} 
                maxLength={3}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono text-center font-bold" 
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Estimated Sales Tax (%)</label>
              <input 
                type="number" 
                step="0.01"
                value={taxRatePercent} 
                onChange={e => setTaxRatePercent(e.target.value)} 
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono text-center" 
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Operating Hours</label>
              <input 
                type="text" 
                value={openingHours} 
                onChange={e => setOpeningHours(e.target.value)} 
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Section 3: Staff & Specialists Roster */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-stone-500" />
              <h2 className="text-sm font-bold text-stone-900">Staff Specialists & Practitioners</h2>
            </div>
            <span className="text-xs text-stone-400 font-mono">{staff.length} Active Members</span>
          </div>

          <div className="divide-y divide-stone-100">
            {staff.map(member => (
              <div key={member.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: member.color }} />
                  <div>
                    <p className="font-semibold text-stone-900">{member.name}</p>
                    <p className="text-[11px] text-stone-500">{member.role} · <span className="font-mono">{member.email}</span></p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveStaff(member.id)}
                  disabled={staff.length <= 1}
                  className="p-1 text-stone-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-stone-400 transition-colors"
                  title="Remove staff member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick add staff row */}
          <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <input
              type="text"
              placeholder="Staff Name"
              value={newStaffName}
              onChange={e => setNewStaffName(e.target.value)}
              className="px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Role / Title"
              value={newStaffRole}
              onChange={e => setNewStaffRole(e.target.value)}
              className="px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={newStaffEmail}
              onChange={e => setNewStaffEmail(e.target.value)}
              className="px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={handleAddStaff}
              className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
