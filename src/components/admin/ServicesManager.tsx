import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Service } from '../../types';
import { ItemVisual } from '../common/ItemVisual';
import { 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Calendar, 
  Check, 
  X,
  PackageCheck
} from 'lucide-react';

interface ServicesManagerProps {
  onOpenNewServiceModal: () => void;
  onBookServiceDirectly: (serviceId: string) => void;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({ 
  onOpenNewServiceModal,
  onBookServiceDirectly
}) => {
  const { services, profile, products, deleteService, updateService } = useBusiness();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingService, setEditingService] = useState<Service | null>(null);

  const categories = Array.from(new Set(services.map(s => s.category)));

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>Service Roster & Protocols</span>
            <span aria-hidden="true">·</span>
            <span>{services.length} Specialized Offerings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Professional Services & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Configure session durations, specialist assignments, pricing types, and bundled products.
          </p>
        </div>

        <button
          onClick={onOpenNewServiceModal}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-stone-900 text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100 bg-white border border-stone-200/80'
          }`}
        >
          All Categories ({services.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-100 bg-white border border-stone-200/80'
            }`}
          >
            {cat} ({services.filter(s => s.category === cat).length})
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => {
          const specialists = profile.staff.filter(st => service.specialistIds.includes(st.id));
          const recommendedProds = products.filter(p => service.recommendedProducts?.includes(p.id));

          return (
            <div 
              key={service.id} 
              className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between hover:border-stone-300 transition-colors"
            >
              <div>
                {/* Visual Header */}
                <ItemVisual 
                  type={service.iconType} 
                  name={service.name} 
                  category={service.category} 
                  aspect="16:9" 
                />

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        {service.category}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 mt-0.5 leading-snug">
                        {service.name}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-bold font-mono tabular-nums text-stone-900">
                        {profile.currency}{service.price}
                      </span>
                      <span className="text-[10px] text-stone-500 block uppercase">
                        {service.pricingType === 'hourly' ? '/ hr' : 'fixed'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 mt-2.5 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Metadata: Duration & Location */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-mono tabular-nums font-medium text-stone-700">{service.durationMinutes} min</span>
                      {service.bufferMinutes > 0 && (
                        <span className="text-[10px] text-stone-400">(+{service.bufferMinutes}m buffer)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span className="capitalize text-stone-700">
                        {service.location.replace('_', '-')}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Specialists */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-stone-400 text-[11px]">Assigned Staff:</span>
                    <div className="flex items-center gap-1">
                      {specialists.length === 0 ? (
                        <span className="text-[11px] text-stone-400">Any Available</span>
                      ) : (
                        specialists.map(spec => (
                          <span 
                            key={spec.id}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: spec.color }} />
                            <span>{spec.name.split(' ')[0]}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recommended Products Paired */}
                  {recommendedProds.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-stone-100">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                        <PackageCheck className="w-3 h-3 text-stone-400" /> Often Bundled:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {recommendedProds.map(rp => (
                          <span key={rp.id} className="text-[11px] text-stone-600 bg-stone-50 border border-stone-200/70 px-1.5 py-0.5 rounded truncate max-w-full">
                            {rp.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingService(service)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded transition-colors"
                    title="Edit service details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove service "${service.name}"?`)) {
                        deleteService(service.id);
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onBookServiceDirectly(service.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg shadow-2xs transition-colors"
                >
                  <Calendar className="w-3 h-3 text-stone-500" />
                  <span>Schedule</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <EditServiceModal
          service={editingService}
          profile={profile}
          products={products}
          onClose={() => setEditingService(null)}
          onSave={(updates) => {
            updateService(editingService.id, updates);
            setEditingService(null);
          }}
        />
      )}

    </div>
  );
};

// Edit Service Modal Subcomponent
interface EditServiceModalProps {
  service: Service;
  profile: any;
  products: any[];
  onClose: () => void;
  onSave: (updates: Partial<Service>) => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ service, profile, products, onClose, onSave }) => {
  const [name, setName] = useState(service.name);
  const [category, setCategory] = useState(service.category);
  const [price, setPrice] = useState(service.price.toString());
  const [pricingType, setPricingType] = useState<Service['pricingType']>(service.pricingType);
  const [durationMinutes, setDurationMinutes] = useState(service.durationMinutes.toString());
  const [bufferMinutes, setBufferMinutes] = useState(service.bufferMinutes.toString());
  const [location, setLocation] = useState<Service['location']>(service.location);
  const [specialistIds, setSpecialistIds] = useState<string[]>(service.specialistIds);
  const [description, setDescription] = useState(service.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      category,
      price: parseFloat(price) || 0,
      pricingType,
      durationMinutes: parseInt(durationMinutes, 10) || 30,
      bufferMinutes: parseInt(bufferMinutes, 10) || 0,
      location,
      specialistIds,
      description
    });
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
          <h2 className="text-sm font-bold text-stone-900">Edit Service</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Service Title</label>
            <input 
              type="text" 
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
              <label className="block font-medium text-stone-700 mb-1">Location</label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
              >
                <option value="in_studio">In-Studio</option>
                <option value="on_site">On-Site Client Location</option>
                <option value="virtual">Virtual Video Consult</option>
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
            <label className="block font-medium text-stone-700 mb-1.5">Eligible Staff Members</label>
            <div className="flex flex-wrap gap-2">
              {profile.staff.map((st: any) => {
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
            <label className="block font-medium text-stone-700 mb-1">Description & Protocol Details</label>
            <textarea 
              rows={3} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
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
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
