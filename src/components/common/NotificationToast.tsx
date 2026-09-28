import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, dismissToast } = useBusiness();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map(toast => {
        const icon = 
          toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> :
          toast.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> :
          toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" /> :
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />;

        return (
          <div 
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white border border-stone-200/90 shadow-md rounded-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-900">{toast.title}</p>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button 
              onClick={() => dismissToast(toast.id)}
              className="text-stone-400 hover:text-stone-700 transition-colors p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
