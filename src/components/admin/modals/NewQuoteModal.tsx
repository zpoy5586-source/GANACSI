import React, { useState } from 'react';
import { useBusiness } from '../../../context/BusinessContext';
import { QuoteItem } from '../../../types';
import { Plus, Trash2, X, FileText, Package, Sparkles } from 'lucide-react';

interface NewQuoteModalProps {
  onClose: () => void;
}

export const NewQuoteModal: React.FC<NewQuoteModalProps> = ({ onClose }) => {
  const { products, services, profile, clients, createQuote } = useBusiness();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [validDays, setValidDays] = useState('30');
  const [notes, setNotes] = useState('Quote valid for 30 days. Includes complimentary baseline inspection.');
  const [status, setStatus] = useState<'sent' | 'draft'>('sent');

  const [items, setItems] = useState<QuoteItem[]>([
    {
      type: 'product',
      name: products[0]?.name || 'Product Lot',
      description: 'Material goods and unit components',
      quantity: 2,
      unitPrice: products[0]?.price || 50
    },
    {
      type: 'service',
      name: services[0]?.name || 'Specialist Protocol',
      description: 'Expert consultation & labor hours',
      quantity: 1,
      unitPrice: services[0]?.price || 150
    }
  ]);

  const handleAddItem = (type: 'product' | 'service') => {
    if (type === 'product') {
      const p = products[0];
      setItems(prev => [
        ...prev,
        {
          type: 'product',
          itemId: p?.id,
          name: p?.name || 'Custom Product Item',
          description: 'Supply component',
          quantity: 1,
          unitPrice: p?.price || 100
        }
      ]);
    } else {
      const s = services[0];
      setItems(prev => [
        ...prev,
        {
          type: 'service',
          itemId: s?.id,
          name: s?.name || 'Custom Labor Session',
          description: 'Technician service delivery',
          quantity: 1,
          unitPrice: s?.price || 120
        }
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateItem = (index: number, updates: Partial<QuoteItem>) => {
    setItems(prev => prev.map((item, idx) => idx === index ? { ...item, ...updates } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * profile.taxRate;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || items.length === 0) return;

    const validDate = new Date();
    validDate.setDate(validDate.getDate() + (parseInt(validDays, 10) || 30));
    const validUntil = validDate.toISOString().split('T')[0];

    createQuote({
      clientName,
      clientEmail,
      clientPhone,
      validUntil,
      status,
      items,
      subtotal,
      tax,
      total,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-xl shadow-xl max-w-xl w-full p-6 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-700" />
            <h2 className="text-sm font-bold text-stone-900">Build Hybrid Scope Estimate</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs overflow-y-auto pr-1">
          
          {/* Client Info */}
          <div className="space-y-2 bg-stone-50/70 p-3 rounded-lg border border-stone-100">
            <label className="font-semibold text-stone-800 block">Prospective Client / Enterprise Account</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Client / Company Name"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                required
                className="px-2.5 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
              />
              <input
                type="email"
                placeholder="Billing Email"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                required
                className="px-2.5 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white font-mono"
              />
              <input
                type="text"
                placeholder="Phone (optional)"
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                className="px-2.5 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white font-mono"
              />
            </div>
          </div>

          {/* Line Items Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-stone-800">Proposal Scope Items</label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddItem('product')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                >
                  <Package className="w-3 h-3" />
                  <span>+ Product Row</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('service')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>+ Service Row</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 border border-stone-200 rounded-lg p-2.5 bg-stone-50/40 max-h-56 overflow-y-auto">
              {items.map((item, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded border border-stone-200/80 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-medium shrink-0 ${
                      item.type === 'product' ? 'bg-stone-100 text-stone-700' : 'bg-sky-50 text-sky-800'
                    }`}>
                      {item.type}
                    </span>
                    <input
                      type="text"
                      placeholder="Item Title"
                      value={item.name}
                      onChange={e => handleUpdateItem(idx, { name: e.target.value })}
                      required
                      className="flex-1 px-2 py-1 border border-stone-200 rounded font-medium"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-stone-400">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleUpdateItem(idx, { quantity: parseInt(e.target.value, 10) || 1 })}
                        className="w-12 px-1 py-1 text-center font-mono border border-stone-200 rounded"
                      />
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-stone-400">{profile.currency}:</span>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={e => handleUpdateItem(idx, { unitPrice: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-1 py-1 text-right font-mono border border-stone-200 rounded"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="p-1 text-stone-400 hover:text-rose-600 disabled:opacity-20 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Scope specification or technical description..."
                    value={item.description || ''}
                    onChange={e => handleUpdateItem(idx, { description: e.target.value })}
                    className="w-full px-2 py-0.5 text-[11px] text-stone-500 border border-stone-100 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Validity */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div className="space-y-2">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Validity Window (Days)</label>
                <input
                  type="number"
                  value={validDays}
                  onChange={e => setValidDays(e.target.value)}
                  className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Initial Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
                >
                  <option value="sent">Sent to Client</option>
                  <option value="draft">Internal Draft</option>
                </select>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/80 space-y-1 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Scope Subtotal:</span>
                <span className="font-mono tabular-nums">{profile.currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Estimated Tax ({(profile.taxRate * 100).toFixed(1)}%):</span>
                <span className="font-mono tabular-nums">{profile.currency}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-900 border-t border-stone-200 pt-1">
                <span>Quote Total:</span>
                <span className="font-mono tabular-nums">{profile.currency}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Terms & Disclaimers</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
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
              Issue Proposal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
