import React, { useState } from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { Header } from './components/common/Header';
import { NotificationToast } from './components/common/NotificationToast';
import { InvoiceModal } from './components/admin/InvoiceModal';

// Admin Views
import { DashboardOverview } from './components/admin/DashboardOverview';
import { ProductsManager } from './components/admin/ProductsManager';
import { ServicesManager } from './components/admin/ServicesManager';
import { AppointmentsManager } from './components/admin/AppointmentsManager';
import { OrdersManager } from './components/admin/OrdersManager';
import { QuotesManager } from './components/admin/QuotesManager';
import { ClientsManager } from './components/admin/ClientsManager';
import { AnalyticsView } from './components/admin/AnalyticsView';
import { SettingsView } from './components/admin/SettingsView';

// Admin Modals
import { NewProductModal } from './components/admin/modals/NewProductModal';
import { NewServiceModal } from './components/admin/modals/NewServiceModal';
import { NewAppointmentModal } from './components/admin/modals/NewAppointmentModal';
import { NewOrderModal } from './components/admin/modals/NewOrderModal';
import { NewQuoteModal } from './components/admin/modals/NewQuoteModal';

// Client Views
import { ClientStorefront } from './components/client/ClientStorefront';
import { CartDrawer } from './components/client/CartDrawer';

const AppContent: React.FC = () => {
  const { mode, adminTab } = useBusiness();

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [preselectedServiceForBooking, setPreselectedServiceForBooking] = useState<string | undefined>(undefined);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleBookServiceDirectly = (serviceId: string) => {
    setPreselectedServiceForBooking(serviceId);
    setShowAppointmentModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-stone-900 antialiased">
      
      {/* 3-Zone Strict Top Bar */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {mode === 'admin' ? (
          <div>
            {adminTab === 'dashboard' && (
              <DashboardOverview
                onOpenNewProduct={() => setShowProductModal(true)}
                onOpenNewService={() => setShowServiceModal(true)}
                onOpenNewAppointment={() => {
                  setPreselectedServiceForBooking(undefined);
                  setShowAppointmentModal(true);
                }}
                onOpenNewOrder={() => setShowOrderModal(true)}
                onOpenNewQuote={() => setShowQuoteModal(true)}
              />
            )}
            {adminTab === 'products' && (
              <ProductsManager onOpenNewProductModal={() => setShowProductModal(true)} />
            )}
            {adminTab === 'services' && (
              <ServicesManager
                onOpenNewServiceModal={() => setShowServiceModal(true)}
                onBookServiceDirectly={handleBookServiceDirectly}
              />
            )}
            {adminTab === 'calendar' && (
              <AppointmentsManager
                onOpenNewAppointmentModal={() => {
                  setPreselectedServiceForBooking(undefined);
                  setShowAppointmentModal(true);
                }}
              />
            )}
            {adminTab === 'orders' && (
              <OrdersManager onOpenNewOrderModal={() => setShowOrderModal(true)} />
            )}
            {adminTab === 'quotes' && (
              <QuotesManager onOpenNewQuoteModal={() => setShowQuoteModal(true)} />
            )}
            {adminTab === 'clients' && (
              <ClientsManager />
            )}
            {adminTab === 'analytics' && (
              <AnalyticsView />
            )}
            {adminTab === 'settings' && (
              <SettingsView />
            )}
          </div>
        ) : (
          <ClientStorefront onOpenCart={() => setIsCartOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-stone-200 bg-white/70 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Atelier Pro</span>
            <span aria-hidden="true">·</span>
            <span>Unified Platform for Hybrid Goods & Services</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500">
            <span>Inventory Management</span>
            <span>Appointment Scheduling</span>
            <span>Unified Invoicing</span>
          </div>
        </div>
      </footer>

      {/* Cart & Checkout Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Printable / Downloadable Invoice Modal */}
      <InvoiceModal />

      {/* Creation Modals */}
      {showProductModal && (
        <NewProductModal onClose={() => setShowProductModal(false)} />
      )}
      {showServiceModal && (
        <NewServiceModal onClose={() => setShowServiceModal(false)} />
      )}
      {showAppointmentModal && (
        <NewAppointmentModal
          preselectedServiceId={preselectedServiceForBooking}
          onClose={() => {
            setShowAppointmentModal(false);
            setPreselectedServiceForBooking(undefined);
          }}
        />
      )}
      {showOrderModal && (
        <NewOrderModal onClose={() => setShowOrderModal(false)} />
      )}
      {showQuoteModal && (
        <NewQuoteModal onClose={() => setShowQuoteModal(false)} />
      )}

      {/* Live Toast System */}
      <NotificationToast />

    </div>
  );
};

export default function App() {
  return (
    <BusinessProvider>
      <AppContent />
    </BusinessProvider>
  );
}
