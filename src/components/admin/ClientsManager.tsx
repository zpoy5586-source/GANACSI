import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Client } from '../../types';
import { 
  Plus, 
  Search, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  ShoppingBag, 
  Edit3, 
  X, 
  Check 
} from 'lucide-react';

export const ClientsManager: React.FC = () => {
  const { clients, profile, addClient, updateClient } = useBusiness();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Collect unique tags
  const allTags = Array.from(new Set(clients.flatMap(c => c.tags || [])));

  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()));

    const matchesTag = selectedTag === 'all' || (c.tags && c.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  const totalClientSpend = clients.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpend = clients.length > 0 ? totalClientSpend / clients.length : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>Customer Directory & CRM</span>
            <span aria-hidden="true">·</span>
            <span>{clients.length} Registered Accounts</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Client Accounts & Relationships
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Holistic customer records linking recurring product purchases, service sessions, and custom preferences.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* CRM KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Clients</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900">{clients.length}</span>
            <span className="text-xs text-stone-400">active profiles</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Customer LTV</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
              {profile.currency}{totalClientSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-stone-400">cumulative spend</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Avg Lifetime Value</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
              {profile.currency}{avgSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-stone-400">per client profile</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                selectedTag === 'all'
                  ? 'bg-stone-900 text-white font-medium'
                  : 'text-stone-600 hover:bg-stone-100 bg-stone-50'
              }`}
            >
              All Clients
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-stone-900 text-white font-medium'
                    : 'text-stone-600 hover:bg-stone-100 bg-stone-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-3">History</th>
                <th className="py-3 px-4">Tags & Segment</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-stone-400">
                    No clients match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-stone-50/60 transition-colors">
                    
                    {/* Name & Company */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-stone-900">{client.name}</p>
                      {client.company && (
                        <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-stone-400" />
                          {client.company}
                        </p>
                      )}
                      {client.notes && (
                        <p className="text-[11px] text-stone-500 italic mt-0.5 line-clamp-1">
                          "{client.notes}"
                        </p>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono text-stone-700">{client.email}</p>
                      {client.phone && <p className="font-mono text-stone-500 text-[11px] mt-0.5">{client.phone}</p>}
                    </td>

                    {/* History stats */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3 text-stone-600">
                        <span className="flex items-center gap-1" title="Product Orders">
                          <ShoppingBag className="w-3.5 h-3.5 text-stone-400" />
                          <strong className="font-mono text-stone-800">{client.ordersCount}</strong>
                        </span>
                        <span className="flex items-center gap-1" title="Service Appointments">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <strong className="font-mono text-stone-800">{client.appointmentsCount}</strong>
                        </span>
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {client.tags.map((tag, idx) => (
                          <span key={idx} className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-stone-900">
                      {profile.currency}{client.totalSpent.toFixed(2)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setEditingClient(client)}
                        className="p-1.5 text-stone-400 hover:text-stone-800 rounded transition-colors"
                        title="Edit client notes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <ClientModal
          title="Add New Client"
          currency={profile.currency}
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            addClient(data);
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <ClientModal
          title="Edit Client Information"
          currency={profile.currency}
          initialData={editingClient}
          onClose={() => setEditingClient(null)}
          onSave={(data) => {
            updateClient(editingClient.id, data);
            setEditingClient(null);
          }}
        />
      )}

    </div>
  );
};

// Client Modal Subcomponent
interface ClientModalProps {
  title: string;
  currency: string;
  initialData?: Client;
  onClose: () => void;
  onSave: (data: any) => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ title, onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [tagsStr, setTagsStr] = useState(initialData?.tags.join(', ') || 'VIP Client');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    onSave({
      name,
      email,
      phone,
      company,
      address,
      notes,
      tags
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <h2 className="text-sm font-bold text-stone-900">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Full Name</label>
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
              <label className="block font-medium text-stone-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Phone</label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Company / Organization (Optional)</label>
            <input 
              type="text" 
              value={company} 
              onChange={e => setCompany(e.target.value)} 
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Address</label>
            <input 
              type="text" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Tags (comma-separated)</label>
            <input 
              type="text" 
              value={tagsStr} 
              onChange={e => setTagsStr(e.target.value)} 
              placeholder="e.g. VIP, Facial Regular, Wholesale"
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Client Profile Notes / Preferences</label>
            <textarea 
              rows={2} 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              placeholder="Specific allergies, skin preferences, equipment setups..."
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
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
