import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Order, OrderItem } from '../../types';
import { 
  Plus, 
  Search, 
  FileText, 
  Printer, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  X, 
  Package, 
  Sparkles, 
  Trash2 
} from 'lucide-react';

interface OrdersManagerProps {
  onOpenNewOrderModal: () => void;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({ onOpenNewOrderModal }) => {
  const { 
    orders, 
    profile, 
    setSelectedInvoiceOrder, 
    updatePaymentStatus, 
    updateOrderStatus 
  } = useBusiness();

  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.clientName.toLowerCase().includes(search.toLowerCase()) ||
      order.clientEmail.toLowerCase().includes(search.toLowerCase());

    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>Billing & Invoicing</span>
            <span aria-hidden="true">·</span>
            <span>{orders.length} Total Invoices</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Orders & Unified Invoices
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Single-ledger accounting combining merchandise sales and service billables into professional client invoices.
          </p>
        </div>

        <button
          onClick={onOpenNewOrderModal}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Sale / Invoice</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number, client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
          {(['all', 'paid', 'unpaid'] as const).map(pf => (
            <button
              key={pf}
              onClick={() => setPaymentFilter(pf)}
              className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                paymentFilter === pf ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {pf}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Composition</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">Total Due</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const prodItems = order.items.filter(i => i.type === 'product');
                  const servItems = order.items.filter(i => i.type === 'service');
                  const isPaid = order.paymentStatus === 'paid';

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                      
                      {/* Invoice number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {order.orderNumber}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-stone-500">
                        {order.date}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-stone-900">{order.clientName}</p>
                        <p className="text-[11px] text-stone-500 font-mono">{order.clientEmail}</p>
                      </td>

                      {/* Composition */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {prodItems.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-700 bg-stone-100 px-2 py-0.5 rounded font-medium">
                              <Package className="w-3 h-3 text-stone-500" />
                              {prodItems.length} Goods
                            </span>
                          )}
                          {servItems.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-sky-800 bg-sky-50 px-2 py-0.5 rounded font-medium">
                              <Sparkles className="w-3 h-3 text-sky-600" />
                              {servItems.length} Services
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Payment Status with toggle */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => updatePaymentStatus(order.id, isPaid ? 'unpaid' : 'paid')}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                            isPaid
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                              : 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle payment status"
                        >
                          {isPaid ? 'Paid' : 'Due / Unpaid'}
                        </button>
                      </td>

                      {/* Subtotal */}
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums text-stone-500">
                        {profile.currency}{order.subtotal.toFixed(2)}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-stone-900">
                        {profile.currency}{order.total.toFixed(2)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-stone-500" />
                          <span>View Invoice</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
