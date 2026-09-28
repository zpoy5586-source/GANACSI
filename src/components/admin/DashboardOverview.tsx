import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Plus, 
  ArrowUpRight, 
  Package, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  UserCheck 
} from 'lucide-react';

interface DashboardOverviewProps {
  onOpenNewProduct: () => void;
  onOpenNewService: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewOrder: () => void;
  onOpenNewQuote: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenNewProduct,
  onOpenNewService,
  onOpenNewAppointment,
  onOpenNewOrder,
  onOpenNewQuote
}) => {
  const { 
    profile, 
    products, 
    services, 
    appointments, 
    orders, 
    quotes, 
    adjustProductStock, 
    setSelectedInvoiceOrder,
    setAdminTab
  } = useBusiness();

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  
  let productRevenue = 0;
  let serviceRevenue = 0;

  orders.forEach(order => {
    if (order.paymentStatus === 'paid') {
      order.items.forEach(item => {
        const itemTotal = item.quantity * item.unitPrice;
        if (item.type === 'product') {
          productRevenue += itemTotal;
        } else {
          serviceRevenue += itemTotal;
        }
      });
    }
  });

  const combinedItemRev = productRevenue + serviceRevenue || 1;
  const productSharePct = Math.round((productRevenue / combinedItemRev) * 100);
  const serviceSharePct = 100 - productSharePct;

  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);
  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const activeQuotes = quotes.filter(q => q.status === 'sent' || q.status === 'draft');

  // Today's appointments (default to current mock date or any scheduled today)
  const todayDate = '2026-09-28';
  const todaysAppointments = appointments.filter(a => a.date === todayDate || a.status === 'scheduled').slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Welcome & Quick Action Bar */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>Operations Dashboard</span>
            <span aria-hidden="true">·</span>
            <span>{profile.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Hybrid Business Operations Hub
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Managing <strong className="font-semibold text-stone-900">{products.length} products</strong> and <strong className="font-semibold text-stone-900">{services.length} services</strong> with unified booking & billing.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewProduct}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            <span>+ Product</span>
          </button>
          <button
            onClick={onOpenNewService}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Service</span>
          </button>
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>
          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sale / Bill</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Gross Revenue */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Collected Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {profile.currency}{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Product: <strong className="font-mono text-stone-800">{productSharePct}%</strong></span>
            <span>Service: <strong className="font-mono text-stone-800">{serviceSharePct}%</strong></span>
          </div>
          {/* Visual bar split */}
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-1.5 overflow-hidden flex">
            <div className="bg-emerald-600 h-full" style={{ width: `${productSharePct}%` }} title="Products Share" />
            <div className="bg-sky-600 h-full" style={{ width: `${serviceSharePct}%` }} title="Services Share" />
          </div>
        </div>

        {/* Card 2: Upcoming Bookings */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Active Bookings</span>
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {upcomingAppointments.length}
            </span>
            <span className="text-xs text-stone-500">scheduled</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Today's Sessions: <strong className="font-mono text-stone-800">{todaysAppointments.length}</strong></span>
            <button 
              onClick={() => setAdminTab('calendar')}
              className="text-stone-700 hover:text-stone-950 font-medium inline-flex items-center gap-0.5"
            >
              Calendar <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Low Inventory Alerts */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Inventory Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-stone-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${lowStockProducts.length > 0 ? 'text-amber-700' : 'text-stone-900'}`}>
              {lowStockProducts.length}
            </span>
            <span className="text-xs text-stone-500">items low or depleted</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Total SKUs: <strong className="font-mono text-stone-800">{products.length}</strong></span>
            <button 
              onClick={() => setAdminTab('products')}
              className="text-stone-700 hover:text-stone-950 font-medium inline-flex items-center gap-0.5"
            >
              Inventory <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Open Quotes */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Pipeline Quotes</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {activeQuotes.length}
            </span>
            <span className="text-xs text-stone-500">pending response</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Est. Pipeline: <strong className="font-mono text-stone-800">{profile.currency}{activeQuotes.reduce((s, q) => s + q.total, 0).toLocaleString()}</strong></span>
            <button 
              onClick={() => setAdminTab('quotes')}
              className="text-stone-700 hover:text-stone-950 font-medium inline-flex items-center gap-0.5"
            >
              Estimates <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Today's Appointments & Low Stock Action Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Agenda (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-sm font-bold text-stone-900">Appointment Agenda</h2>
                <p className="text-xs text-stone-500">Scheduled client consultations and service sessions</p>
              </div>
              <button
                onClick={onOpenNewAppointment}
                className="text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Book Session
              </button>
            </div>

            <div className="divide-y divide-stone-100 mt-2">
              {todaysAppointments.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  No appointments scheduled. Click "+ Book Session" to schedule one.
                </div>
              ) : (
                todaysAppointments.map(apt => {
                  const srv = services.find(s => s.id === apt.serviceId);
                  const staff = profile.staff.find(st => st.id === apt.specialistId);

                  return (
                    <div key={apt.id} className="py-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-stone-100 border border-stone-200 rounded px-2 py-1 text-center min-w-[64px]">
                          <span className="text-[11px] font-mono font-semibold text-stone-800">{apt.timeSlot}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{srv?.name || 'Custom Service'}</p>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                            <span className="font-medium text-stone-700">{apt.clientName}</span>
                            <span aria-hidden="true">·</span>
                            <span>{apt.locationDetails || (srv?.location === 'in_studio' ? 'In-Studio' : 'On-Site')}</span>
                          </div>
                          {apt.notes && (
                            <p className="text-[11px] text-stone-500 italic mt-0.5 max-w-md line-clamp-1">"{apt.notes}"</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-semibold text-stone-900">
                          {profile.currency}{apt.totalPrice.toFixed(2)}
                        </span>
                        {staff && (
                          <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-1 justify-end">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: staff.color }} />
                            <span>{staff.name.split(' ')[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500">
            <span>Operating Hours: {profile.openingHours}</span>
            <button 
              onClick={() => setAdminTab('calendar')}
              className="text-stone-700 hover:text-stone-950 font-medium"
            >
              View Full Schedule →
            </button>
          </div>
        </div>

        {/* Low Stock Quick Restock (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-sm font-bold text-stone-900">Stock Threshold Monitor</h2>
                <p className="text-xs text-stone-500">Items nearing reorder threshold</p>
              </div>
              <button 
                onClick={() => setAdminTab('products')}
                className="text-xs font-medium text-stone-700 hover:text-stone-950"
              >
                All Products
              </button>
            </div>

            <div className="divide-y divide-stone-100 mt-2">
              {lowStockProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-500">
                  <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  All inventory items are currently above safety thresholds.
                </div>
              ) : (
                lowStockProducts.map(p => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-stone-900 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <span className="font-mono">{p.sku}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-amber-700 font-medium">
                          {p.stock} {p.unit} remaining
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => adjustProductStock(p.id, 5)}
                        className="px-2 py-1 text-[11px] font-mono font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                        title="Add 5 units"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => adjustProductStock(p.id, 10)}
                        className="px-2 py-1 text-[11px] font-mono font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                        title="Add 10 units"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 text-xs text-stone-500 flex justify-between items-center">
            <span>Reorder alerts trigger automatically below minimum limits.</span>
          </div>
        </div>

      </div>

      {/* Recent Orders & Hybrid Transactions Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Recent Transactions & Invoices</h2>
            <p className="text-xs text-stone-500">Orders combining physical merchandise and booked services</p>
          </div>
          <button 
            onClick={() => setAdminTab('orders')}
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1"
          >
            <span>All Invoices</span> <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs mt-2">
            <thead>
              <tr className="text-stone-400 font-medium uppercase text-[10px] tracking-wider border-b border-stone-100">
                <th className="py-2.5 px-3">Invoice</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Items Composition</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map(order => {
                const prodCount = order.items.filter(i => i.type === 'product').length;
                const servCount = order.items.filter(i => i.type === 'service').length;

                return (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-stone-900">{order.orderNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-stone-900">{order.clientName}</p>
                      <p className="text-[11px] text-stone-500 font-mono">{order.clientEmail}</p>
                    </td>
                    <td className="py-3 px-3 text-stone-600 font-mono text-[11px]">{order.date}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                        {prodCount > 0 && (
                          <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">
                            {prodCount} Product{prodCount > 1 ? 's' : ''}
                          </span>
                        )}
                        {servCount > 0 && (
                          <span className="bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded">
                            {servCount} Service{servCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {order.paymentStatus === 'paid' ? (
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Paid
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Due
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-stone-900">
                      {profile.currency}{order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="text-[11px] font-medium text-stone-600 hover:text-stone-950 px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                      >
                        View Bill
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
