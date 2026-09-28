import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Sparkles, 
  PieChart as PieIcon, 
  BarChart3, 
  ArrowUpRight 
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { profile, products, services, appointments, orders } = useBusiness();

  // Financial calculations
  let totalProductRevenue = 0;
  let totalServiceRevenue = 0;
  let totalProductCost = 0;

  // Track product sales counts
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  // Track service booking counts
  const serviceSalesMap: Record<string, { name: string; qty: number; revenue: number }> = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      const lineTotal = item.quantity * item.unitPrice;
      if (item.type === 'product') {
        totalProductRevenue += lineTotal;
        const prod = products.find(p => p.id === item.itemId);
        if (prod) {
          totalProductCost += prod.costPrice * item.quantity;
        }
        if (!productSalesMap[item.itemId]) {
          productSalesMap[item.itemId] = { name: item.name, qty: 0, revenue: 0 };
        }
        productSalesMap[item.itemId].qty += item.quantity;
        productSalesMap[item.itemId].revenue += lineTotal;
      } else {
        totalServiceRevenue += lineTotal;
        if (!serviceSalesMap[item.itemId]) {
          serviceSalesMap[item.itemId] = { name: item.name, qty: 0, revenue: 0 };
        }
        serviceSalesMap[item.itemId].qty += item.quantity;
        serviceSalesMap[item.itemId].revenue += lineTotal;
      }
    });
  });

  const grossRevenue = totalProductRevenue + totalServiceRevenue;
  const productGrossProfit = totalProductRevenue - totalProductCost;
  const productMarginPct = totalProductRevenue > 0 ? Math.round((productGrossProfit / totalProductRevenue) * 100) : 0;
  
  const productShare = grossRevenue > 0 ? Math.round((totalProductRevenue / grossRevenue) * 100) : 50;
  const serviceShare = 100 - productShare;

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 4);
  const topServices = Object.values(serviceSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  const avgOrderValue = orders.length > 0 ? grossRevenue / orders.length : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>Business Intelligence & Ledger</span>
            <span aria-hidden="true">·</span>
            <span>Live Audit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Revenue Split & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Compare tangible merchandise cashflows against professional service hourly yields.
          </p>
        </div>
      </div>

      {/* Primary Comparison Card: Products vs Services */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">Hybrid Revenue Contribution</h2>
            <p className="text-xs text-stone-500">Gross revenue distribution between physical inventory and booked services</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
              {profile.currency}{grossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-stone-400 block">Total Combined Volume</span>
          </div>
        </div>

        {/* Visual Stacked Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-stone-800 mb-2">
            <span className="flex items-center gap-1.5 text-stone-900">
              <span className="w-2.5 h-2.5 rounded-xs bg-stone-900" />
              <span>Physical Goods ({productShare}%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-sky-800">
              <span className="w-2.5 h-2.5 rounded-xs bg-sky-600" />
              <span>Professional Services ({serviceShare}%)</span>
            </span>
          </div>

          <div className="w-full bg-stone-100 h-4 rounded-md overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${productShare}%` }} 
              className="bg-stone-900 h-full transition-all duration-500" 
              title={`Products: ${profile.currency}${totalProductRevenue.toFixed(2)}`}
            />
            <div 
              style={{ width: `${serviceShare}%` }} 
              className="bg-sky-600 h-full transition-all duration-500" 
              title={`Services: ${profile.currency}${totalServiceRevenue.toFixed(2)}`}
            />
          </div>
        </div>

        {/* Two side-by-side break-outs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Products Breakdown */}
          <div className="bg-stone-50/70 border border-stone-200/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-stone-700" />
                <h3 className="text-xs font-bold text-stone-900">Physical Products Channel</h3>
              </div>
              <span className="text-xs font-bold font-mono text-stone-900">
                {profile.currency}{totalProductRevenue.toFixed(2)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Wholesale Cost of Goods (COGS):</span>
                <span className="font-mono tabular-nums text-stone-700">{profile.currency}{totalProductCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Gross Realized Product Margin:</span>
                <span className="font-mono tabular-nums font-semibold text-emerald-700">
                  {profile.currency}{productGrossProfit.toFixed(2)} ({productMarginPct}%)
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Active Stock Units:</span>
                <span className="font-mono tabular-nums text-stone-700">
                  {products.reduce((s, p) => s + p.stock, 0)} units
                </span>
              </div>
            </div>
          </div>

          {/* Services Breakdown */}
          <div className="bg-sky-50/40 border border-sky-200/70 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-700" />
                <h3 className="text-xs font-bold text-sky-950">Specialist Services Channel</h3>
              </div>
              <span className="text-xs font-bold font-mono text-sky-950">
                {profile.currency}{totalServiceRevenue.toFixed(2)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Total Sessions Booked:</span>
                <span className="font-mono tabular-nums text-stone-700">{appointments.length} appointments</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Completed Delivery Rate:</span>
                <span className="font-mono tabular-nums font-semibold text-sky-900">
                  {appointments.length > 0 
                    ? Math.round((appointments.filter(a => a.status === 'completed').length / appointments.length) * 100)
                    : 100}%
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Active Specialists on Roster:</span>
                <span className="font-mono tabular-nums text-stone-700">{profile.staff.length} practitioners</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Top Performers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Products */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900">Top Performing Products</h3>
            <span className="text-xs text-stone-400 font-mono">By Revenue</span>
          </div>

          <div className="divide-y divide-stone-100 mt-2">
            {topProducts.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-400">No product sales recorded yet.</p>
            ) : (
              topProducts.map((tp, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 truncate">{tp.name}</p>
                    <p className="text-[11px] text-stone-500 font-mono">{tp.qty} units sold</p>
                  </div>
                  <span className="font-mono font-bold text-stone-900 tabular-nums shrink-0">
                    {profile.currency}{tp.revenue.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-sm font-bold text-stone-900">Top Booked Services</h3>
            <span className="text-xs text-stone-400 font-mono">By Yield</span>
          </div>

          <div className="divide-y divide-stone-100 mt-2">
            {topServices.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-400">No service bookings recorded yet.</p>
            ) : (
              topServices.map((ts, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 truncate">{ts.name}</p>
                    <p className="text-[11px] text-stone-500 font-mono">{ts.qty} sessions booked</p>
                  </div>
                  <span className="font-mono font-bold text-sky-950 tabular-nums shrink-0">
                    {profile.currency}{ts.revenue.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
