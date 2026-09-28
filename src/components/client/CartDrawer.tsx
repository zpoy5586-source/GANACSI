import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { OrderItem } from '../../types';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  Package, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    cart, 
    cartTotal, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    profile, 
    createOrder, 
    addAppointment,
    setMode,
    setAdminTab,
    setSelectedInvoiceOrder
  } = useBusiness();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || cart.length === 0) return;

    // Convert cart items to OrderItems and schedule appointments for services
    const orderItems: OrderItem[] = [];

    cart.forEach(item => {
      if (item.type === 'product' && item.product) {
        orderItems.push({
          id: 'oi-cart-' + Date.now() + Math.random(),
          type: 'product',
          itemId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price
        });
      } else if (item.type === 'service' && item.service) {
        // Schedule appointment in calendar
        const aptId = addAppointment({
          serviceId: item.service.id,
          specialistId: item.selectedSpecialistId || profile.staff[0]?.id || 'st-1',
          clientName,
          clientEmail,
          clientPhone,
          date: item.selectedDate || '2026-09-30',
          timeSlot: item.selectedTimeSlot || '11:00 AM',
          status: 'scheduled',
          locationDetails: item.service.location === 'in_studio' ? 'Main Studio' : 'Client Location',
          totalPrice: item.service.price
        });

        orderItems.push({
          id: 'oi-cart-' + Date.now() + Math.random(),
          type: 'service',
          itemId: item.service.id,
          name: item.service.name,
          quantity: item.quantity,
          unitPrice: item.service.price,
          specialistId: item.selectedSpecialistId,
          appointmentDate: item.selectedDate,
          appointmentTime: item.selectedTimeSlot
        });
      }
    });

    const newOrder = createOrder({
      clientName,
      clientEmail,
      clientPhone,
      items: orderItems,
      subtotal: cartTotal.subtotal,
      tax: cartTotal.tax,
      discount: 0,
      total: cartTotal.total,
      source: 'storefront_checkout',
      paymentStatus: 'paid',
      notes: 'Customer placed online order via client storefront.'
    });

    setCompletedOrder(newOrder);
    clearCart();
    setCheckoutStep('success');
  };

  const resetDrawer = () => {
    setCheckoutStep('cart');
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-stone-700" />
            <span className="font-bold text-sm text-stone-900">
              {checkoutStep === 'success' ? 'Order Confirmed' : checkoutStep === 'checkout' ? 'Instant Checkout' : 'Your Order Tray'}
            </span>
            {cart.length > 0 && checkoutStep === 'cart' && (
              <span className="text-xs text-stone-500 font-mono">({cartTotal.count} items)</span>
            )}
          </div>
          <button 
            onClick={resetDrawer}
            className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          
          {checkoutStep === 'cart' && (
            cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="font-medium text-stone-700 text-sm">Your order tray is empty</p>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Browse our artisan products or book a specialized session from the catalog.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="divide-y divide-stone-100">
                  {cart.map(item => {
                    const isProduct = item.type === 'product';
                    const name = isProduct ? item.product?.name : item.service?.name;
                    const price = isProduct ? (item.product?.price || 0) : (item.service?.price || 0);

                    return (
                      <div key={item.id} className="py-3.5 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className={`p-1.5 rounded text-[10px] mt-0.5 shrink-0 ${
                              isProduct ? 'bg-stone-100 text-stone-700' : 'bg-sky-50 text-sky-800'
                            }`}>
                              {isProduct ? <Package className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                            </span>
                            <div>
                              <p className="font-semibold text-stone-900 leading-snug">{name}</p>
                              
                              {/* If service, show slot details */}
                              {!isProduct && item.selectedDate && (
                                <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-stone-400" />
                                    {item.selectedDate}
                                  </span>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-stone-400" />
                                    {item.selectedTimeSlot}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <span className="font-mono tabular-nums font-bold text-stone-900 shrink-0">
                            {profile.currency}{(price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Controls: Stepper for products, delete for both */}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          {isProduct ? (
                            <div className="inline-flex items-center gap-2 bg-stone-50 border border-stone-200 rounded px-2 py-0.5">
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="text-stone-500 hover:text-stone-900 font-bold px-1"
                              >
                                -
                              </button>
                              <span className="font-mono tabular-nums">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="text-stone-500 hover:text-stone-900 font-bold px-1"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="text-stone-400 font-mono">1 Session</span>
                          )}

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors"
                            title="Remove from tray"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {checkoutStep === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="space-y-4">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/80 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">Order Summary</span>
                <div className="flex justify-between font-semibold text-stone-900">
                  <span>{cartTotal.count} Selected Items</span>
                  <span className="font-mono">{profile.currency}{cartTotal.total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rachel Sterling"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Email Address (Receipt & Calendar Invite)</label>
                <input
                  type="email"
                  placeholder="rachel@example.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Mobile Phone (Appointment Reminders)</label>
                <input
                  type="text"
                  placeholder="+1 (415) 555-0199"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-2 border-t border-stone-100">
                <label className="block font-semibold text-stone-800 mb-1">Simulated Payment Authorization</label>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between text-stone-600">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-stone-700" />
                    <span>Direct Secure Checkout</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">Ready</span>
                </div>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && completedOrder && (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900">Order & Reservation Confirmed!</h3>
                <p className="text-xs text-stone-500 font-mono mt-1">Invoice #{completedOrder.orderNumber}</p>
              </div>

              <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                Thank you, <strong className="text-stone-900">{completedOrder.clientName}</strong>. A receipt and calendar appointment invite have been generated for {completedOrder.clientEmail}.
              </p>

              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-left space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-stone-500">
                  <span>Total Paid:</span>
                  <span className="font-bold text-stone-900">{profile.currency}{completedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Line Items:</span>
                  <span>{completedOrder.items.length} items</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => {
                    resetDrawer();
                    setMode('admin');
                    setAdminTab('orders');
                    setSelectedInvoiceOrder(completedOrder);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
                >
                  <span>View Official Invoice in Ops Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={resetDrawer}
                  className="w-full py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer with Totals & CTAs */}
        {checkoutStep !== 'success' && cart.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50/70 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{profile.currency}{cartTotal.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Estimated Tax ({(profile.taxRate * 100).toFixed(1)}%)</span>
                <span className="font-mono tabular-nums">{profile.currency}{cartTotal.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-900 border-t border-stone-200 pt-1.5">
                <span>Total Due</span>
                <span className="font-mono tabular-nums text-base">{profile.currency}{cartTotal.total.toFixed(2)}</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-200/60 rounded-lg"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
                >
                  Pay {profile.currency}{cartTotal.total.toFixed(2)} & Confirm
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
