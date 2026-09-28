import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Product, Service } from '../../types';
import { ItemVisual } from '../common/ItemVisual';
import { BookingModal } from './BookingModal';
import { 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  MapPin, 
  Search, 
  Send, 
  CheckCircle, 
  Package, 
  ArrowRight,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';

interface ClientStorefrontProps {
  onOpenCart: () => void;
}

export const ClientStorefront: React.FC<ClientStorefrontProps> = ({ onOpenCart }) => {
  const { 
    profile, 
    products, 
    services, 
    clientTab, 
    setClientTab, 
    addToCart, 
    createQuote,
    setMode,
    setAdminTab
  } = useBusiness();

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('all');

  // Booking modal state
  const [activeBookingService, setActiveBookingService] = useState<Service | null>(null);

  // Custom Quote form state
  const [quoteName, setQuoteName] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteScope, setQuoteScope] = useState('');
  const [quoteSuccessId, setQuoteSuccessId] = useState<string | null>(null);

  // Product categories
  const productCategories = Array.from(new Set(products.map(p => p.category)));
  const serviceCategories = Array.from(new Set(services.map(s => s.category)));

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedProductCategory === 'all' || p.category === selectedProductCategory;
    return matchesSearch && matchesCat;
  });

  // Filter services
  const filteredServices = services.filter(s => {
    return selectedServiceCategory === 'all' || s.category === selectedServiceCategory;
  });

  const handleCustomQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName.trim() || !quoteEmail.trim() || !quoteScope.trim()) return;

    const newQuote = createQuote({
      clientName: quoteName,
      clientEmail: quoteEmail,
      clientPhone: quotePhone,
      validUntil: '2026-10-30',
      status: 'sent',
      items: [
        {
          type: 'product',
          name: 'Custom Product Package Specification',
          description: quoteScope,
          quantity: 1,
          unitPrice: 500
        },
        {
          type: 'service',
          name: 'Specialized On-Site Service Assessment',
          description: 'Initial architectural consultation and assessment',
          quantity: 1,
          unitPrice: 250
        }
      ],
      subtotal: 750,
      tax: 750 * profile.taxRate,
      total: 750 + (750 * profile.taxRate),
      notes: `Client Inbound Inquiry: "${quoteScope}"`
    });

    setQuoteSuccessId(newQuote.quoteNumber);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-stone-100 rounded-2xl p-8 sm:p-12 lg:p-16 border border-stone-800 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 tracking-wider uppercase">
            <span>Specialist Studio & Atelier</span>
            <span aria-hidden="true">·</span>
            <span>Products + Services</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {profile.name}
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-light max-w-2xl">
            {profile.tagline}. {profile.heroHighlight}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setClientTab('shop')}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                clientTab === 'shop'
                  ? 'bg-white text-stone-950 shadow-md'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700'
              }`}
            >
              Shop Curated Goods ({products.length})
            </button>
            <button
              onClick={() => setClientTab('services')}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                clientTab === 'services'
                  ? 'bg-white text-stone-950 shadow-md'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700'
              }`}
            >
              Book Specialist Services ({services.length})
            </button>
            <button
              onClick={() => setClientTab('quote_request')}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                clientTab === 'quote_request'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700'
              }`}
            >
              Request Custom Bundle Quote
            </button>
          </div>
        </div>

        {/* Quiet Trust Bar */}
        <div className="relative z-10 mt-10 pt-6 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-400">
          <div>
            <span className="font-semibold text-stone-200 block">Studio Address</span>
            <span className="truncate block mt-0.5">{profile.address}</span>
          </div>
          <div>
            <span className="font-semibold text-stone-200 block">Practitioners</span>
            <span className="mt-0.5 block">{profile.staff.length} Master Specialists</span>
          </div>
          <div>
            <span className="font-semibold text-stone-200 block">Operating Hours</span>
            <span className="mt-0.5 block">{profile.openingHours}</span>
          </div>
          <div>
            <span className="font-semibold text-stone-200 block">Direct Concierge</span>
            <span className="font-mono mt-0.5 block">{profile.phone}</span>
          </div>
        </div>
      </section>

      {/* Tab Content Section */}
      <div>
        
        {/* TAB 1: PRODUCT CATALOG */}
        {clientTab === 'shop' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900">Curated Goods & Equipment</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Formulated and calibrated in-house. Ships directly from our studio.
                </p>
              </div>

              {/* Product search */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedProductCategory('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedProductCategory === 'all'
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100 bg-white border border-stone-200/80'
                }`}
              >
                All Products ({products.length})
              </button>
              {productCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedProductCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedProductCategory === cat
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'text-stone-600 hover:bg-stone-100 bg-white border border-stone-200/80'
                  }`}
                >
                  {cat} ({products.filter(p => p.category === cat).length})
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const isOutOfStock = product.stock === 0;

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Visual Graphic */}
                      <ItemVisual
                        type={product.iconType}
                        name={product.name}
                        category={product.category}
                        aspect="4:3"
                      />

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                              {product.category}
                            </span>
                            <h3 className="text-sm font-bold text-stone-900 mt-0.5 leading-snug">
                              {product.name}
                            </h3>
                          </div>
                          <span className="text-base font-bold font-mono tabular-nums text-stone-900 shrink-0">
                            {profile.currency}{product.price.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Specs */}
                        {product.dimensions && (
                          <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] text-stone-500 font-mono">
                            Specification: {product.dimensions}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer / Buy CTA */}
                    <div className="p-5 pt-0 flex items-center justify-between border-t border-stone-100 mt-3 pt-3">
                      <div>
                        {isOutOfStock ? (
                          <span className="text-[11px] font-medium text-rose-600 font-mono">Out of Stock</span>
                        ) : (
                          <span className="text-[11px] font-medium text-emerald-700 font-mono">
                            In Stock ({product.stock} left)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart({ type: 'product', product, quantity: 1 })}
                        disabled={isOutOfStock}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900 rounded-lg shadow-2xs transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Tray</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES BOOKING */}
        {clientTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900">Professional Services & Sessions</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Book direct appointment reservations with certified practitioners and technical specialists.
                </p>
              </div>

              {/* Category filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedServiceCategory('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedServiceCategory === 'all'
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'text-stone-600 hover:bg-stone-100 bg-white border border-stone-200/80'
                  }`}
                >
                  All ({services.length})
                </button>
                {serviceCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedServiceCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedServiceCategory === cat
                        ? 'bg-stone-900 text-white shadow-2xs'
                        : 'text-stone-600 hover:bg-stone-100 bg-white border border-stone-200/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => {
                const specialists = profile.staff.filter(st => service.specialistIds.includes(st.id));

                return (
                  <div
                    key={service.id}
                    className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <ItemVisual
                        type={service.iconType}
                        name={service.name}
                        category={service.category}
                        aspect="16:9"
                      />

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
                            <span className="text-[10px] text-stone-400 block uppercase">
                              {service.pricingType === 'hourly' ? '/ hr' : 'session'}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 mt-2.5 line-clamp-3 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Session specs */}
                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            {service.durationMinutes} min
                          </span>
                          <span className="flex items-center gap-1 capitalize">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            {service.location.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Staff */}
                        <div className="mt-3 flex items-center gap-1.5 text-xs">
                          <span className="text-stone-400 text-[11px]">Specialists:</span>
                          <div className="flex items-center gap-1 flex-wrap">
                            {specialists.map(sp => (
                              <span key={sp.id} className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                                {sp.name}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Book button */}
                    <div className="p-5 pt-0 border-t border-stone-100 mt-3 pt-3">
                      <button
                        onClick={() => setActiveBookingService(service)}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Reserve Appointment Slot</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOM PACKAGE QUOTE */}
        {clientTab === 'quote_request' && (
          <div className="max-w-2xl mx-auto bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
            {quoteSuccessId ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Custom Proposal Requested</h3>
                <p className="text-xs font-mono text-stone-500">Proposal #{quoteSuccessId}</p>
                <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
                  Our lead practitioners have logged your requirements and will finalize an itemized estimate with product allocation and dedicated labor hours.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setMode('admin');
                      setAdminTab('quotes');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg"
                  >
                    View in Provider Workspace
                  </button>
                  <button
                    onClick={() => {
                      setQuoteSuccessId(null);
                      setQuoteScope('');
                    }}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCustomQuoteSubmit} className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Enterprise & Bespoke</span>
                  <h2 className="text-xl font-bold text-stone-900 mt-0.5">Request a Hybrid Package Estimate</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Combine custom product fabrication/supply with on-site implementation, team training, or ongoing servicing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Your Name / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Elena Rostova or Apex Studios"
                      value={quoteName}
                      onChange={e => setQuoteName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Business Contact Email</label>
                    <input
                      type="email"
                      placeholder="elena@example.com"
                      value={quoteEmail}
                      onChange={e => setQuoteEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="+1 (415) 555-0199"
                    value={quotePhone}
                    onChange={e => setQuotePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Project Scope & Requested Equipment/Services</label>
                  <textarea
                    rows={4}
                    placeholder="Describe desired quantities, facility dimensions, preferred specialists, or timeline requirements..."
                    value={quoteScope}
                    onChange={e => setQuoteScope(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">Response guaranteed within 24 business hours.</span>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proposal Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>

      {/* Booking Slot Modal */}
      {activeBookingService && (
        <BookingModal
          service={activeBookingService}
          onClose={() => setActiveBookingService(null)}
          onConfirmBooking={(bookingDetails) => {
            addToCart({
              type: 'service',
              service: bookingDetails.service,
              quantity: 1,
              selectedSpecialistId: bookingDetails.specialistId,
              selectedDate: bookingDetails.date,
              selectedTimeSlot: bookingDetails.timeSlot
            });
            setActiveBookingService(null);
            onOpenCart();
          }}
        />
      )}

    </div>
  );
};
