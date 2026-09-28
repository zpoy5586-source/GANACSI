import React, { useState } from 'react';
import { useBusiness } from '../../../context/BusinessContext';
import { Service } from '../../../types';
import { X, Sparkles, Check } from 'lucide-react';

interface NewServiceModalProps {
  onClose: () => void;
}

export const NewServiceModal: React.FC<NewServiceModalProps> = ({ onClose }) => {
  const { addService, profile } = useBusiness();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Treatments & Sessions');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [bufferMinutes, setBufferMinutes] = useState('15');
  const [price, setPrice] = useState('120');
  const [pricingType, setPricingType] = useState<Service['pricingType']>('fixed');
  const [location, setLocation] = useState<Service['location']>('in_studio');
  const [specialistIds, setSpecialistIds] = useState<string[]>(profile.staff.map(s => s.id));
  const [description, setDescription] = useState('');
  const [iconType, setIconType] = useState<Service['iconType']>('treatment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addService({
      name,
      category,
      durationMinutes: parseInt(durationMinutes, 10) || 60,
      bufferMinutes: parseInt(bufferMinutes, 10) || 0,
      price: parseFloat(price) || 0,
      pricingType,
      location,
      specialistIds: specialistIds.length > 0 ? specialistIds : [profile.staff[0]?.id || 'st-1'],
      description,
      iconType
    });
    onClose();
  };

  const toggleSpecialist = (id: string) => {
    setSpecialistIds(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-700" />
            <h2 className="text-sm font-bold text-stone-900">Define Professional Service</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Service Title</label>
            <input 
              type="text" 
              placeholder="e.g. Master Acoustic Tuning & Calibration"
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Category</label>
              <input 
                type="text" 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                required
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Location Format</label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
              >
                <option value="in_studio">In-Studio / Atelier</option>
                <option value="on_site">On-Site Client Facility</option>
                <option value="virtual">Virtual Live Video</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Price ({profile.currency})</label>
              <input 
                type="number" 
                step="0.01" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                required
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Pricing Model</label>
              <select
                value={pricingType}
                onChange={e => setPricingType(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
              >
                <option value="fixed">Fixed Flat Rate</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Duration (Min)</label>
              <input 
                type="number" 
                step="5" 
                value={durationMinutes} 
                onChange={e => setDurationMinutes(e.target.value)} 
                required
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1.5">Assign Eligible Specialists</label>
            <div className="flex flex-wrap gap-1.5">
              {profile.staff.map(st => {
                const isSelected = specialistIds.includes(st.id);
                return (
                  <button
                    type="button"
                    key={st.id}
                    onClick={() => toggleSpecialist(st.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                      isSelected
                        ? 'bg-stone-900 text-white font-medium'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                    <span>{st.name}</span>
                    {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Service Description</label>
            <textarea 
              rows={2.5} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Outline steps, techniques, tools used, and deliverables..."
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs"
            >
              Create Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
