import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Service } from '../../types';
import { Calendar, Clock, MapPin, X, Check } from 'lucide-react';

interface BookingModalProps {
  service: Service;
  onClose: () => void;
  onConfirmBooking: (bookingDetails: {
    service: Service;
    specialistId: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ service, onClose, onConfirmBooking }) => {
  const { profile } = useBusiness();

  const [selectedSpecialistId, setSelectedSpecialistId] = useState(
    service.specialistIds[0] || profile.staff[0]?.id || ''
  );
  const [date, setDate] = useState('2026-09-30');
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'
  ];

  const specialists = profile.staff.filter(st => service.specialistIds.includes(st.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmBooking({
      service,
      specialistId: selectedSpecialistId,
      date,
      timeSlot,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-stone-200 rounded-xl shadow-2xl max-w-md w-full p-6 text-xs"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Appointment Reservation</span>
            <h2 className="text-base font-bold text-stone-900 mt-0.5">{service.name}</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Summary Box */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-3 flex justify-between items-center">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-stone-700">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold">{service.durationMinutes} Minutes</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span className="capitalize">{service.location.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold font-mono tabular-nums text-stone-900">
                {profile.currency}{service.price}
              </span>
              <span className="text-[10px] text-stone-400 block uppercase">
                {service.pricingType === 'hourly' ? 'per hour' : 'fixed fee'}
              </span>
            </div>
          </div>

          {/* Specialist Selector */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1.5">Select Practitioner / Specialist</label>
            <div className="space-y-1.5">
              {specialists.map(spec => {
                const isSelected = selectedSpecialistId === spec.id;
                return (
                  <button
                    type="button"
                    key={spec.id}
                    onClick={() => setSelectedSpecialistId(spec.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-colors ${
                      isSelected 
                        ? 'border-stone-900 bg-stone-50/80 text-stone-900' 
                        : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: spec.color }} />
                      <div>
                        <p className="font-semibold text-xs text-stone-900">{spec.name}</p>
                        <p className="text-[11px] text-stone-500">{spec.role}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-stone-900" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
            />
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1.5">Available Time Slots</label>
            <div className="grid grid-cols-3 gap-1.5">
              {timeSlots.map(slot => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 text-center rounded-lg font-mono text-xs transition-colors ${
                    timeSlot === slot
                      ? 'bg-stone-900 text-white font-semibold shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block font-semibold text-stone-800 mb-1">Preferences or Special Goals</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any specific focus areas or requirements..."
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs"
            >
              Add to Booking Tray
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
