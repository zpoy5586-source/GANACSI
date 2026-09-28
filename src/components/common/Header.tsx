import React, { useState } from 'react';
import { useBusiness, AdminTab, ClientTab } from '../../context/BusinessContext';
import { ShoppingBag, Store, LayoutDashboard, ChevronDown, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenCart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { 
    mode, 
    setMode, 
    adminTab, 
    setAdminTab, 
    clientTab, 
    setClientTab, 
    cartTotal,
    profile,
    activePresetId,
    switchPreset,
    resetPresetData
  } = useBusiness();

  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

  const adminNavItems: { key: AdminTab; label: string }[] = [
    { key: 'dashboard', label: 'Overview' },
    { key: 'products', label: 'Products' },
    { key: 'services', label: 'Services' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'orders', label: 'Orders & Bills' },
    { key: 'quotes', label: 'Quotes' },
    { key: 'clients', label: 'Clients' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'settings', label: 'Settings' }
  ];

  const clientNavItems: { key: ClientTab; label: string }[] = [
    { key: 'shop', label: 'Catalog' },
    { key: 'services', label: 'Book Services' },
    { key: 'quote_request', label: 'Custom Quote' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => {
              if (mode === 'admin') setAdminTab('dashboard');
              else setClientTab('shop');
            }}
            className="text-left font-bold text-lg tracking-tight text-stone-900 hover:text-stone-700 transition-colors whitespace-nowrap"
          >
            {profile.name}
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto py-1 scrollbar-none">
          {mode === 'admin' ? (
            adminNavItems.map(item => {
              const isActive = adminTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setAdminTab(item.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-stone-900 text-white shadow-xs' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })
          ) : (
            clientNavItems.map(item => {
              const isActive = clientTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setClientTab(item.key)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-stone-900 text-white shadow-xs' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })
          )}
        </nav>

        {/* Zone 3: Primary Actions (Business Preset Selector, Mode Switcher & Cart) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors"
              title="Switch demo business domain"
            >
              <span className="hidden sm:inline text-stone-500 font-normal">Business:</span>
              <span className="font-semibold capitalize truncate max-w-[90px] sm:max-w-[120px]">
                {activePresetId === 'aura' ? 'Botanical Atelier' : activePresetId === 'veloce' ? 'Veloce Vélo Lab' : 'SoundStage Audio'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {presetDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setPresetDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-lg shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Select Industry Preset
                  </div>
                  <button
                    onClick={() => { switchPreset('aura'); setPresetDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex flex-col ${
                      activePresetId === 'aura' ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <span>Aura Botanical & Facial Atelier</span>
                    <span className="text-[10px] text-stone-400">Skincare products + Clinical facial rituals</span>
                  </button>
                  <button
                    onClick={() => { switchPreset('veloce'); setPresetDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex flex-col ${
                      activePresetId === 'veloce' ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <span>Veloce Vélo & Speed Lab</span>
                    <span className="text-[10px] text-stone-400">Gravel bike parts + 3D motion bike fits</span>
                  </button>
                  <button
                    onClick={() => { switchPreset('soundstage'); setPresetDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex flex-col ${
                      activePresetId === 'soundstage' ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <span>SoundStage Acoustics & Tech</span>
                    <span className="text-[10px] text-stone-400">Acoustic diffusers + Room calibration</span>
                  </button>
                  <div className="my-1 border-t border-stone-100" />
                  <button
                    onClick={() => { resetPresetData(); setPresetDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50 hover:text-rose-600 transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Original State</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mode Switcher: Admin Operations vs Client Storefront */}
          <button
            onClick={() => setMode(mode === 'admin' ? 'client' : 'admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'admin'
                ? 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100/70'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100/70'
            }`}
          >
            {mode === 'admin' ? (
              <>
                <Store className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">View</span> Storefront
              </>
            ) : (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Back to</span> Ops Portal
              </>
            )}
          </button>

          {/* Client Shopping Bag / Booking Tray */}
          {mode === 'client' && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs"
              aria-label="View shopping bag & booking tray"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tray</span>
              {cartTotal.count > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center tabular-nums">
                  {cartTotal.count}
                </span>
              )}
            </button>
          )}

        </div>
      </div>

      {/* Mobile secondary navigation strip */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-stone-100 bg-stone-50/70 scrollbar-none">
        {mode === 'admin' ? (
          adminNavItems.map(item => (
            <button
              key={item.key}
              onClick={() => setAdminTab(item.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                adminTab === item.key
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {item.label}
            </button>
          ))
        ) : (
          clientNavItems.map(item => (
            <button
              key={item.key}
              onClick={() => setClientTab(item.key)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                clientTab === item.key
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {item.label}
            </button>
          ))
        )}
      </div>
    </header>
  );
};
