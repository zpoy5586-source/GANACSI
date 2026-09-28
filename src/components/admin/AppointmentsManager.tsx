import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Appointment } from '../../types';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Search, 
  ArrowRight, 
  MapPin, 
  FileText,
  DollarSign 
} from 'lucide-react';

interface AppointmentsManagerProps {
  onOpenNewAppointmentModal: () => void;
}

export const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({ onOpenNewAppointmentModal }) => {
  const { 
    appointments, 
    services, 
    profile, 
    updateAppointmentStatus, 
    cancelAppointment,
    setSelectedInvoiceOrder,
    orders
  } = useBusiness();

  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [specialistFilter, setSpecialistFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const srv = services.find(s => s.id === apt.serviceId);
    const matchesSearch = 
      apt.clientName.toLowerCase().includes(search.toLowerCase()) ||
      apt.clientEmail.toLowerCase().includes(search.toLowerCase()) ||
      (srv?.name.toLowerCase().includes(search.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSpecialist = specialistFilter === 'all' || apt.specialistId === specialistFilter;

    return matchesSearch && matchesStatus && matchesSpecialist;
  });

  // Sort by date descending
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>Scheduling & Calibrations</span>
            <span aria-hidden="true">·</span>
            <span>{appointments.filter(a => a.status === 'scheduled').length} Upcoming</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Service Appointments & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Track client reservations, specialist availability, on-site assignments, and completed sessions.
          </p>
        </div>

        <button
          onClick={onOpenNewAppointmentModal}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client or service name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status segmented buttons */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            {(['all', 'scheduled', 'completed', 'cancelled'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                  statusFilter === st ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Specialist filter */}
          <select
            value={specialistFilter}
            onChange={e => setSpecialistFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-700"
          >
            <option value="all">All Specialists</option>
            {profile.staff.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments List View */}
      <div className="space-y-3">
        {sortedAppointments.length === 0 ? (
          <div className="bg-white border border-stone-200/90 rounded-xl p-12 text-center text-xs text-stone-400">
            No appointments found for the selected criteria.
          </div>
        ) : (
          sortedAppointments.map(apt => {
            const srv = services.find(s => s.id === apt.serviceId);
            const staff = profile.staff.find(st => st.id === apt.specialistId);
            const linkedOrder = orders.find(o => o.id === apt.linkedOrderId);

            const isScheduled = apt.status === 'scheduled';
            const isCompleted = apt.status === 'completed';
            const isCancelled = apt.status === 'cancelled';

            return (
              <div 
                key={apt.id}
                className="bg-white border border-stone-200/90 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-stone-300 transition-colors"
              >
                {/* Date & Time Badge */}
                <div className="flex items-start gap-4">
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-center min-w-[76px] shrink-0">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                      {new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                    <span className="text-base font-bold font-mono text-stone-900 leading-tight block">
                      {new Date(apt.date).getDate()}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 block mt-0.5">
                      {apt.timeSlot}
                    </span>
                  </div>

                  {/* Service & Client Information */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{srv?.name || 'Custom Booking'}</span>
                      {srv?.durationMinutes && (
                        <span className="text-[11px] text-stone-500 font-mono">({srv.durationMinutes} min)</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600 mt-1">
                      <span className="font-semibold text-stone-800">{apt.clientName}</span>
                      <span className="text-stone-300">·</span>
                      <span className="font-mono text-stone-500">{apt.clientEmail}</span>
                      {apt.clientPhone && (
                        <>
                          <span className="text-stone-300">·</span>
                          <span className="font-mono text-stone-500">{apt.clientPhone}</span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500 mt-1.5">
                      {staff && (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: staff.color }} />
                          <span className="text-stone-700 font-medium">{staff.name}</span>
                        </div>
                      )}
                      {apt.locationDetails && (
                        <>
                          <span className="text-stone-300">·</span>
                          <span className="flex items-center gap-1 text-stone-600">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {apt.locationDetails}
                          </span>
                        </>
                      )}
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-stone-500 italic mt-1.5 bg-stone-50/70 px-2 py-1 rounded border border-stone-100 max-w-xl">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column: Pricing & Status Controls */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 shrink-0">
                  <div className="text-right">
                    <span className="text-base font-bold font-mono tabular-nums text-stone-900 block">
                      {profile.currency}{apt.totalPrice.toFixed(2)}
                    </span>
                    <span className={`text-[11px] font-medium capitalize inline-block mt-0.5 ${
                      isCompleted ? 'text-emerald-700' : isCancelled ? 'text-rose-600' : 'text-sky-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5">
                    {isScheduled && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="px-2.5 py-1 text-xs font-medium text-stone-500 hover:text-rose-600 rounded hover:bg-stone-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {linkedOrder && (
                      <button
                        onClick={() => setSelectedInvoiceOrder(linkedOrder)}
                        className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors flex items-center gap-1"
                        title="View linked bill"
                      >
                        <FileText className="w-3 h-3 text-stone-500" />
                        <span>Bill</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
