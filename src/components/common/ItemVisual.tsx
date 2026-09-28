import React from 'react';

interface ItemVisualProps {
  type: 'bottle' | 'cream' | 'bike_part' | 'tool' | 'speaker' | 'panel' | 'treatment' | 'consultation' | 'maintenance' | 'acoustic' | 'fitting' | 'accessory' | 'generic';
  name: string;
  category?: string;
  className?: string;
  aspect?: '16:9' | '4:3' | '1:1' | 'auto';
}

export const ItemVisual: React.FC<ItemVisualProps> = ({ 
  type, 
  name, 
  category, 
  className = '', 
  aspect = '4:3' 
}) => {
  const aspectClass = 
    aspect === '16:9' ? 'aspect-video' : 
    aspect === '4:3' ? 'aspect-[4/3]' : 
    aspect === '1:1' ? 'aspect-square' : '';

  // Theme palettes and SVG graphics by item type
  const renderGraphic = () => {
    switch (type) {
      case 'bottle':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-stone-100 to-amber-50/40 text-stone-700 p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#78716c_1px,transparent_1px)] [background-size:12px_12px]" />
            <svg className="w-16 h-16 text-amber-800/80 drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2h4" />
              <path d="M10 5h4" />
              <path d="M10 2v3" />
              <path d="M14 2v3" />
              <path d="M9 8h6" />
              <path d="M8 8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2a6 6 0 0 1 2 4.47V20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5.53A6 6 0 0 1 8 10V8z" />
              <line x1="8" y1="14" x2="16" y2="14" />
              <line x1="12" y1="11" x2="12" y2="17" />
            </svg>
            <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500">{category || 'Apothecary Formula'}</span>
          </div>
        );

      case 'cream':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50/50 to-stone-100 text-stone-700 p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:12px_12px]" />
            <svg className="w-16 h-16 text-emerald-800/80 drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="10" width="18" height="11" rx="3" />
              <path d="M5 10V8a7 7 0 0 1 14 0v2" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
            <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500">{category || 'Barrier Therapy'}</span>
          </div>
        );

      case 'bike_part':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-zinc-800 text-white p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#3f3f46_25%,transparent_25%),linear-gradient(-45deg,#3f3f46_25%,transparent_25%)] [background-size:16px_16px]" />
            <svg className="w-16 h-16 text-amber-400 drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18.5" cy="17.5" r="3.5" />
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="15" cy="5" r="1" />
              <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
            </svg>
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">{category || 'Race Component'}</span>
          </div>
        );

      case 'tool':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-100 to-slate-200 text-slate-800 p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:10px_10px]" />
            <svg className="w-16 h-16 text-slate-700 drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span className="text-[11px] font-mono tracking-wider uppercase text-slate-500">{category || 'Precision Tool'}</span>
          </div>
        );

      case 'panel':
      case 'acoustic':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-stone-800 to-stone-900 text-amber-100 p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-25 flex justify-around">
              <div className="w-2 bg-amber-600/30 h-full" />
              <div className="w-2 bg-amber-600/40 h-full" />
              <div className="w-2 bg-amber-600/30 h-full" />
              <div className="w-2 bg-amber-600/50 h-full" />
              <div className="w-2 bg-amber-600/30 h-full" />
            </div>
            <svg className="w-16 h-16 text-amber-300 drop-shadow-sm mb-2 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8 7v10" />
              <path d="M12 5v14" />
              <path d="M16 9v6" />
            </svg>
            <span className="text-[11px] font-mono tracking-wider uppercase text-amber-200/70 relative z-10">{category || 'Acoustic Architecture'}</span>
          </div>
        );

      case 'speaker':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-indigo-950 text-indigo-100 p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:12px_12px]" />
            <svg className="w-16 h-16 text-indigo-400 drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <circle cx="12" cy="14" r="4" />
              <circle cx="12" cy="6" r="1.5" />
            </svg>
            <span className="text-[11px] font-mono tracking-wider uppercase text-indigo-300/70">{category || 'Monitoring System'}</span>
          </div>
        );

      case 'treatment':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-stone-100 text-teal-900 p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:14px_14px]" />
            <svg className="w-16 h-16 text-teal-700 drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a5 5 0 0 1 5 5c0 5-5 13-5 13S7 12 7 7a5 5 0 0 1 5-5z" />
              <circle cx="12" cy="7" r="2" />
            </svg>
            <span className="text-[11px] font-mono tracking-wider uppercase text-teal-800/70">{category || 'Clinical Treatment'}</span>
          </div>
        );

      case 'fitting':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-stone-100 text-stone-800 p-6 overflow-hidden">
            <svg className="w-16 h-16 text-orange-600 drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="22" y1="12" x2="18" y2="12" />
              <line x1="6" y1="12" x2="2" y2="12" />
              <line x1="12" y1="6" x2="12" y2="2" />
              <line x1="12" y1="22" x2="12" y2="18" />
            </svg>
            <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500">{category || 'Biomechanical Lab'}</span>
          </div>
        );

      case 'consultation':
      case 'maintenance':
      default:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800 p-6 overflow-hidden">
            <svg className="w-16 h-16 text-slate-600 drop-shadow-sm mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span className="text-[11px] font-mono tracking-wider uppercase text-slate-500">{category || 'Service & Craft'}</span>
          </div>
        );
    }
  };

  return (
    <div className={`w-full overflow-hidden border-b border-stone-200/80 select-none ${aspectClass} ${className}`}>
      {renderGraphic()}
    </div>
  );
};
