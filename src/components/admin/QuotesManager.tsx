import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { QuoteEstimate, QuoteItem } from '../../types';
import { 
  Plus, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  X, 
  Package, 
  Sparkles, 
  Trash2,
  Send,
  Calendar
} from 'lucide-react';

interface QuotesManagerProps {
  onOpenNewQuoteModal: () => void;
}

export const QuotesManager: React.FC<QuotesManagerProps> = ({ onOpenNewQuoteModal }) => {
  const { 
    quotes, 
    profile, 
    updateQuoteStatus, 
    convertQuoteToOrder, 
    setSelectedInvoiceOrder, 
    orders 
  } = useBusiness();

  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'draft' | 'converted'>('all');
  const [activeQuoteModal, setActiveQuoteModal] = useState<QuoteEstimate | null>(null);

  const filteredQuotes = quotes.filter(q => {
    if (statusFilter === 'all') return true;
    return q.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>Client Proposals & Bids</span>
            <span aria-hidden="true">·</span>
            <span>{quotes.length} Estimates</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Hybrid Estimates & Quotes
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Package hardware inventory and service labor into formal proposals with 1-click conversion to live orders.
          </p>
        </div>

        <button
          onClick={onOpenNewQuoteModal}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Build New Estimate</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg w-fit">
        {(['all', 'sent', 'draft', 'converted'] as const).map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
              statusFilter === st ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {st === 'all' ? `All (${quotes.length})` : `${st} (${quotes.filter(q => q.status === st).length})`}
          </button>
        ))}
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map(quote => {
          const isConverted = quote.status === 'converted';
          const isSent = quote.status === 'sent';
          const isDraft = quote.status === 'draft';

          const productItems = quote.items.filter(i => i.type === 'product');
          const serviceItems = quote.items.filter(i => i.type === 'service');

          return (
            <div
              key={quote.id}
              className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-colors"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-stone-900 block">{quote.quoteNumber}</span>
                    <span className="text-[11px] text-stone-500 font-mono">Created {quote.dateCreated}</span>
                  </div>
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isConverted ? 'text-emerald-700 bg-emerald-50' :
                    isSent ? 'text-sky-700 bg-sky-50' :
                    'text-stone-600 bg-stone-100'
                  }`}>
                    {quote.status}
                  </span>
                </div>

                {/* Client info */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-stone-900">{quote.clientName}</h3>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">{quote.clientEmail}</p>
                </div>

                {/* Items Composition */}
                <div className="mt-4 bg-stone-50/70 p-3 rounded-lg border border-stone-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-stone-500 text-[11px]">
                    <span>Scope of Work:</span>
                    <span>{quote.items.length} Line Items</span>
                  </div>
                  {productItems.length > 0 && (
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <Package className="w-3.5 h-3.5 text-stone-500" />
                      <span>{productItems.reduce((s, i) => s + i.quantity, 0)}x Goods ({productItems.length} categories)</span>
                    </div>
                  )}
                  {serviceItems.length > 0 && (
                    <div className="flex items-center gap-1.5 text-sky-800">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      <span>{serviceItems.reduce((s, i) => s + i.quantity, 0)} Service Operations</span>
                    </div>
                  )}
                </div>

                {quote.notes && (
                  <p className="text-xs text-stone-500 italic mt-3 line-clamp-2">
                    "{quote.notes}"
                  </p>
                )}
              </div>

              {/* Bottom Totals & Convert CTA */}
              <div className="mt-5 pt-3 border-t border-stone-100">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs text-stone-500">Estimate Value:</span>
                  <span className="text-lg font-bold font-mono tabular-nums text-stone-900">
                    {profile.currency}{quote.total.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!isConverted ? (
                    <>
                      <button
                        onClick={() => convertQuoteToOrder(quote.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-2xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Convert to Order</span>
                      </button>
                      {isDraft && (
                        <button
                          onClick={() => updateQuoteStatus(quote.id, 'sent')}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                          title="Mark Sent to Client"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-between text-xs text-stone-500">
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Order Active
                      </span>
                      {quote.convertedOrderId && (
                        <button
                          onClick={() => {
                            const linkedOrder = orders.find(o => o.id === quote.convertedOrderId);
                            if (linkedOrder) setSelectedInvoiceOrder(linkedOrder);
                          }}
                          className="text-stone-800 hover:underline font-medium text-xs"
                        >
                          View Bill →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
