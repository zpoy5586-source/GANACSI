import React, { useState } from 'react';
import { useBusiness } from '../../../context/BusinessContext';
import { OrderItem } from '../../../types';
import { Plus, Trash2, X, Package, Sparkles, DollarSign } from 'lucide-react';

interface NewOrderModalProps {
  onClose: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose }) => {
  const { products, services, profile, clients, createOrder, setSelectedInvoiceOrder } = useBusiness();

  const [clientMode, setClientMode] = useState<'new' | 'existing'>('existing');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const [items, setItems] = useState<OrderItem[]>([
    {
      id: 'item-1',
      type: 'product',
      itemId: products[0]?.id || '',
      name: products[0]?.name || 'Product',
      quantity: 1,
      unitPrice: products[0]?.price || 0
    }
  ]);

  const [discount, setDiscount] = useState('0');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('paid');
  const [notes, setNotes] = useState('');

  const handleAddItem = (type: 'product' | 'service') => {
    if (type === 'product' && products.length > 0) {
      setItems(prev => [
        ...prev,
        {
          id: 'item-' + Date.now(),
          type: 'product',
          itemId: products[0].id,
          name: products[0].name,
          quantity: 1,
          unitPrice: products[0].price
        }
      ]);
    } else if (type === 'service' && services.length > 0) {
      setItems(prev => [
        ...prev,
        {
          id: 'item-' + Date.now(),
          type: 'service',
          itemId: services[0].id,
          name: services[0].name,
          quantity: 1,
          unitPrice: services[0].price
        }
      ]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleItemChange = (index: number, itemId: string, type: 'product' | 'service') => {
    if (type === 'product') {
      const p = products.find(prod => prod.id === itemId);
      if (!p) return;
      setItems(prev => prev.map((item, i) => i === index ? {
        ...item,
        itemId: p.id,
        name: p.name,
        unitPrice: p.price
      } : item));
    } else {
      const s = services.find(srv => srv.id === itemId);
      if (!s) return;
      setItems(prev => prev.map((item, i) => i === index ? {
        ...item,
        itemId: s.id,
        name: s.name,
        unitPrice: s.price
      } : item));
    }
  };

  const handleQtyChange = (index: number, quantity: number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: Math.max(1, quantity) } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountVal = parseFloat(discount) || 0;
  const tax = Math.max(0, subtotal - discountVal) * profile.taxRate;
  const total = Math.max(0, subtotal - discountVal) + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    let finalName = clientName;
    let finalEmail = clientEmail;
    let finalPhone = clientPhone;

    if (clientMode === 'existing') {
      const c = clients.find(cl => cl.id === selectedClientId);
      if (c) {
        finalName = c.name;
        finalEmail = c.email;
        finalPhone = c.phone;
      }
    }

    if (!finalName.trim() || !finalEmail.trim()) return;

    const newOrder = createOrder({
      clientName: finalName,
      clientEmail: finalEmail,
      clientPhone: finalPhone,
      items,
      subtotal,
      tax,
      discount: discountVal,
      total,
      notes,
      source: 'pos_admin',
      paymentStatus
    });

    onClose();
    setSelectedInvoiceOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-xl shadow-xl max-w-xl w-full p-6 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-stone-900">Create Unified Sale / Invoice</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs overflow-y-auto pr-1">
          
          {/* Client Selection */}
          <div className="space-y-2 bg-stone-50/70 p-3 rounded-lg border border-stone-100">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-800">Customer Details</label>
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded">
                <button
                  type="button"
                  onClick={() => setClientMode('existing')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    clientMode === 'existing' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                  }`}
                >
                  Existing Client
                </button>
                <button
                  type="button"
                  onClick={() => setClientMode('new')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    clientMode === 'new' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
                  }`}
                >
                  Walk-In / New
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
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  required={clientMode === 'new'}
                  className="px-2.5 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  required={clientMode === 'new'}
                  className="px-2.5 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white font-mono"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="px-2.5 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white font-mono"
                />
              </div>
            )}
          </div>

          {/* Line Items List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-stone-800">Billed Line Items</label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddItem('product')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                >
                  <Package className="w-3 h-3" />
                  <span>+ Product</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('service')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>+ Service</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 border border-stone-200 rounded-lg p-2.5 bg-stone-50/40 max-h-56 overflow-y-auto">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 bg-white p-2 rounded border border-stone-200/80 shadow-2xs">
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-medium shrink-0 ${
                    item.type === 'product' ? 'bg-stone-100 text-stone-700' : 'bg-sky-50 text-sky-800'
                  }`}>
                    {item.type}
                  </span>

                  {item.type === 'product' ? (
                    <select
                      value={item.itemId}
                      onChange={e => handleItemChange(idx, e.target.value, 'product')}
                      className="flex-1 px-2 py-1 text-xs border border-stone-200 rounded bg-white"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({profile.currency}{p.price})</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={item.itemId}
                      onChange={e => handleItemChange(idx, e.target.value, 'service')}
                      className="flex-1 px-2 py-1 text-xs border border-stone-200 rounded bg-white"
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({profile.currency}{s.price})</option>
                      ))}
                    </select>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-stone-400">Qty:</span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => handleQtyChange(idx, parseInt(e.target.value, 10) || 1)}
                      className="w-12 px-1.5 py-1 text-center font-mono border border-stone-200 rounded"
                    />
                  </div>

                  <span className="font-mono tabular-nums font-semibold text-stone-900 w-16 text-right shrink-0">
                    {profile.currency}{(item.quantity * item.unitPrice).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={items.length <= 1}
                    className="p-1 text-stone-400 hover:text-rose-600 disabled:opacity-20 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary & Discount */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Discount Coupon / Credit ({profile.currency})</label>
              <input
                type="number"
                step="0.01"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
              />

              <div className="mt-2">
                <label className="block font-medium text-stone-700 mb-1">Payment Status</label>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentStatus === 'paid'}
                      onChange={() => setPaymentStatus('paid')}
                    />
                    <span>Paid in Full</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentStatus === 'unpaid'}
                      onChange={() => setPaymentStatus('unpaid')}
                    />
                    <span>Payment Due (Send Invoice)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/80 space-y-1 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums">{profile.currency}{subtotal.toFixed(2)}</span>
              </div>
              {discountVal > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-mono tabular-nums">-{profile.currency}{discountVal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-500">
                <span>Tax ({(profile.taxRate * 100).toFixed(1)}%):</span>
                <span className="font-mono tabular-nums">{profile.currency}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-900 border-t border-stone-200 pt-1">
                <span>Total Due:</span>
                <span className="font-mono tabular-nums">{profile.currency}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Invoice Notes / Special Terms</label>
            <input
              type="text"
              placeholder="e.g. Free shipping on goods; appointment confirmed for tomorrow."
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
              Confirm Sale & Generate Bill
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
