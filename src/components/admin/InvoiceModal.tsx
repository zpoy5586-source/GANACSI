import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Printer, X, CheckCircle, Clock } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { 
    selectedInvoiceOrder, 
    setSelectedInvoiceOrder, 
    profile, 
    updatePaymentStatus 
  } = useBusiness();

  if (!selectedInvoiceOrder) return null;

  const order = selectedInvoiceOrder;
  const isPaid = order.paymentStatus === 'paid';

  const handlePrint = () => {
    window.print();
  };

  const productItems = order.items.filter(i => i.type === 'product');
  const serviceItems = order.items.filter(i => i.type === 'service');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white border border-stone-200 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-900">Invoice Document</span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-mono text-stone-500">{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            {!isPaid && (
              <button
                onClick={() => updatePaymentStatus(order.id, 'paid')}
                className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors"
              >
                Mark Paid
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
              aria-label="Close invoice preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-10 overflow-y-auto flex-1 bg-white text-stone-900">
          
          {/* Header & Brand */}
          <div className="flex justify-between items-start border-b border-stone-200 pb-6 mb-6">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900">{profile.name}</h1>
              <p className="text-xs text-stone-500 mt-1 max-w-sm">{profile.tagline}</p>
              <div className="text-xs text-stone-500 mt-3 space-y-0.5">
                <p>{profile.address}</p>
                <p>{profile.email} · {profile.phone}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold tracking-tight font-mono text-stone-900">INVOICE</div>
              <div className="text-xs font-mono text-stone-600 mt-1">{order.orderNumber}</div>
              <div className="text-xs text-stone-500 mt-2">
                <span>Date: </span>
                <span className="font-mono text-stone-700">{order.date}</span>
              </div>
              <div className="mt-2">
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> Paid in Full
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Clock className="w-3 h-3" /> Payment Due
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-6 bg-stone-50/80 p-4 rounded-lg border border-stone-200/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Billed To</span>
            <div className="mt-1">
              <p className="text-sm font-semibold text-stone-900">{order.clientName}</p>
              <p className="text-xs text-stone-600 font-mono mt-0.5">{order.clientEmail}</p>
              {order.clientPhone && <p className="text-xs text-stone-600 font-mono">{order.clientPhone}</p>}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-stone-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/80 border-b border-stone-200 text-stone-600 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {/* Services Section */}
                {serviceItems.length > 0 && (
                  <>
                    <tr className="bg-stone-50/60">
                      <td colSpan={5} className="py-1.5 px-3 text-[11px] font-semibold text-stone-700">
                        Professional Services & Consultations
                      </td>
                    </tr>
                    {serviceItems.map(item => (
                      <tr key={item.id} className="hover:bg-stone-50/40">
                        <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px]">Service</td>
                        <td className="py-2.5 px-3">
                          <p className="font-medium text-stone-900">{item.name}</p>
                          {item.appointmentDate && (
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              Scheduled: {item.appointmentDate} {item.appointmentTime ? `at ${item.appointmentTime}` : ''}
                            </p>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-stone-600">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-stone-600">
                          {profile.currency}{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-stone-900">
                          {profile.currency}{(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                {/* Products Section */}
                {productItems.length > 0 && (
                  <>
                    <tr className="bg-stone-50/60">
                      <td colSpan={5} className="py-1.5 px-3 text-[11px] font-semibold text-stone-700">
                        Physical Products & Material Goods
                      </td>
                    </tr>
                    {productItems.map(item => (
                      <tr key={item.id} className="hover:bg-stone-50/40">
                        <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px]">Product</td>
                        <td className="py-2.5 px-3">
                          <p className="font-medium text-stone-900">{item.name}</p>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-stone-600">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-stone-600">
                          {profile.currency}{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-stone-900">
                          {profile.currency}{(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{profile.currency}{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discounts</span>
                  <span className="font-mono tabular-nums">-{profile.currency}{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Estimated Tax ({(profile.taxRate * 100).toFixed(1)}%)</span>
                <span className="font-mono tabular-nums">{profile.currency}{order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-sm text-stone-900">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-base">{profile.currency}{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {order.notes && (
            <div className="border-t border-stone-200 pt-4 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Notes & Instructions: </span>
              <span>{order.notes}</span>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-dashed border-stone-200 text-center text-[11px] text-stone-400">
            Thank you for your business. For questions regarding this invoice, contact {profile.email}.
          </div>
        </div>

      </div>
    </div>
  );
};
