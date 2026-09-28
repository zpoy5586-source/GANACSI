import React, { useState } from 'react';
import { useBusiness } from '../../../context/BusinessContext';
import { Calendar, Clock, X, User } from 'lucide-react';

interface NewAppointmentModalProps {
  onClose: () => void;
  preselectedServiceId?: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ 
  onClose, 
  preselectedServiceId 
}) => {
  const { services, profile, clients, addAppointment } = useBusiness();

  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || services[0]?.id || '');
  const activeService = services.find(s => s.id === selectedServiceId) || services[0];

  const [specialistId, setSpecialistId] = useState(activeService?.specialistIds[0] || profile.staff[0]?.id || '');
  const [clientMode, setClientMode] = useState<'existing' | 'new'>('new');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [date, setDate] = useState('2026-09-29');
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [locationDetails, setLocationDetails] = useState('');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalName = clientName;
    let finalEmail = clientEmail;
    let finalPhone = clientPhone;

    if (clientMode === 'existing') {
      const client = clients.find(c => c.id === selectedClientId);
      if (client) {
        finalName = client.name;
        finalEmail = client.email;
        finalPhone = client.phone;
      }
    }

    if (!finalName.trim() || !finalEmail.trim()) return;

    addAppointment({
      serviceId: selectedServiceId,
      specialistId,
      clientName: finalName,
      clientEmail: finalEmail,
      clientPhone: finalPhone,
      date,
      timeSlot,
      status: 'scheduled',
      locationDetails: locationDetails || (activeService.location === 'in_studio' ? 'Main Studio' : 'On-Site'),
      notes,
      totalPrice: activeService.price
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-700" />
            <h2 className="text-sm font-bold text-stone-900">Book Client Appointment</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          
          {/* Service Picker */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">Select Service</label>
            <select
              value={selectedServiceId}
              onChange={e => {
                setSelectedServiceId(e.target.value);
                const s = services.find(srv => srv.id === e.target.value);
                if (s && s.specialistIds.length > 0) {
                  setSpecialistId(s.specialistIds[0]);
                }
              }}
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white font-medium"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — {profile.currency}{s.price} ({s.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>

          {/* Specialist Roster */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">Assigned Specialist</label>
            <select
              value={specialistId}
              onChange={e => setSpecialistId(e.target.value)}
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
            >
              {profile.staff.map(st => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.role})
                </option>
              ))}
            </select>
          </div>

          {/* Client Selection mode */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-stone-800">Client Information</label>
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded">
                <button
                  type="button"
                  onClick={() => setClientMode('new')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    clientMode === 'new' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                  }`}
                >
                  New Client
                </button>
                <button
                  type="button"
                  onClick={() => setClientMode('existing')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    clientMode === 'existing' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                  }`}
                >
                  From Directory ({clients.length})
                </button>
              </div>
            </div>

            {clientMode === 'existing' ? (
              <select
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  required={clientMode === 'new'}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    required={clientMode === 'new'}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Appointment Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
              >
                {timeSlots.map(ts => (
                  <option key={ts} value={ts}>{ts}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location details */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">Location Details / Room</label>
            <input
              type="text"
              placeholder="e.g. Treatment Bed 1, or Client Office Suite 300"
              value={locationDetails}
              onChange={e => setLocationDetails(e.target.value)}
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">Internal Session Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Client goals, allergies, special requests..."
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-stone-200">
            <div>
              <span className="text-stone-500">Service Fee: </span>
              <span className="font-mono font-bold text-stone-900">
                {profile.currency}{activeService.price.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2">
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
                Confirm Appointment
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
