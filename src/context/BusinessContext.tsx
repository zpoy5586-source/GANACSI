import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BusinessProfile, 
  Product, 
  Service, 
  Appointment, 
  Order, 
  QuoteEstimate, 
  Client, 
  CartItem,
  OrderItem
} from '../types';
import { BUSINESS_PRESETS, BusinessPresetData } from '../data/mockData';

export type AppMode = 'admin' | 'client';
export type AdminTab = 'dashboard' | 'products' | 'services' | 'calendar' | 'orders' | 'quotes' | 'clients' | 'analytics' | 'settings';
export type ClientTab = 'shop' | 'services' | 'quote_request';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface BusinessContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  clientTab: ClientTab;
  setClientTab: (tab: ClientTab) => void;
  activePresetId: string;
  
  // Data
  profile: BusinessProfile;
  products: Product[];
  services: Service[];
  appointments: Appointment[];
  orders: Order[];
  quotes: QuoteEstimate[];
  clients: Client[];
  
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: { subtotal: number; tax: number; total: number; count: number };
  
  // Handlers & CRUD
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustProductStock: (id: string, delta: number) => void;

  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;

  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => string;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  cancelAppointment: (id: string) => void;

  createOrder: (orderData: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    discount?: number;
    total: number;
    notes?: string;
    source: Order['source'];
    paymentStatus?: Order['paymentStatus'];
  }) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updatePaymentStatus: (id: string, status: Order['paymentStatus']) => void;

  createQuote: (quoteData: Omit<QuoteEstimate, 'id' | 'quoteNumber' | 'dateCreated'>) => QuoteEstimate;
  updateQuoteStatus: (id: string, status: QuoteEstimate['status']) => void;
  convertQuoteToOrder: (quoteId: string) => Order | null;

  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'totalSpent' | 'ordersCount' | 'appointmentsCount'>) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;

  updateProfile: (profile: Partial<BusinessProfile>) => void;
  switchPreset: (presetKey: string) => void;
  resetPresetData: () => void;

  // Invoice view helper
  selectedInvoiceOrder: Order | null;
  setSelectedInvoiceOrder: (order: Order | null) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'atelier_biz_suite_';

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePresetId, setActivePresetId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PREFIX + 'active_preset') || 'aura';
  });

  const [mode, setMode] = useState<AppMode>('admin');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [clientTab, setClientTab] = useState<ClientTab>('shop');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Core Data States
  const [data, setData] = useState<BusinessPresetData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + activePresetId);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved business data', e);
      }
    }
    return BUSINESS_PRESETS[activePresetId] || BUSINESS_PRESETS.aura;
  });

  // Client Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY_PREFIX + 'cart_' + activePresetId);
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    return [];
  });

  // Auto-save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + activePresetId, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEY_PREFIX + 'active_preset', activePresetId);
  }, [data, activePresetId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'cart_' + activePresetId, JSON.stringify(cart));
  }, [cart, activePresetId]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchPreset = (presetKey: string) => {
    if (!BUSINESS_PRESETS[presetKey]) return;
    setActivePresetId(presetKey);
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + presetKey);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {
        setData(BUSINESS_PRESETS[presetKey]);
      }
    } else {
      setData(BUSINESS_PRESETS[presetKey]);
    }
    setCart([]);
    addToast({
      type: 'info',
      title: 'Business Loaded',
      message: `Switched workspace to ${BUSINESS_PRESETS[presetKey].profile.name}.`
    });
  };

  const resetPresetData = () => {
    const fresh = BUSINESS_PRESETS[activePresetId] || BUSINESS_PRESETS.aura;
    setData(JSON.parse(JSON.stringify(fresh)));
    setCart([]);
    localStorage.removeItem(STORAGE_KEY_PREFIX + activePresetId);
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'cart_' + activePresetId);
    addToast({
      type: 'info',
      title: 'Reset Completed',
      message: 'Workspace data has been reset to baseline showcase state.'
    });
  };

  // Product Operations
  const addProduct = (product: Omit<Product, 'id'>) => {
    const id = 'p-' + Date.now();
    const newProduct: Product = { ...product, id };
    setData(prev => ({
      ...prev,
      products: [newProduct, ...prev.products]
    }));
    addToast({
      type: 'success',
      title: 'Product Created',
      message: `"${newProduct.name}" added to catalog with ${newProduct.stock} in stock.`
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
    addToast({
      type: 'success',
      title: 'Product Updated',
      message: 'Changes saved successfully.'
    });
  };

  const deleteProduct = (id: string) => {
    const item = data.products.find(p => p.id === id);
    setData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
    addToast({
      type: 'info',
      title: 'Product Removed',
      message: `"${item?.name || 'Product'}" has been deleted.`
    });
  };

  const adjustProductStock = (id: string, delta: number) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    }));
  };

  // Service Operations
  const addService = (service: Omit<Service, 'id'>) => {
    const id = 's-' + Date.now();
    const newService: Service = { ...service, id };
    setData(prev => ({
      ...prev,
      services: [newService, ...prev.services]
    }));
    addToast({
      type: 'success',
      title: 'Service Added',
      message: `"${newService.name}" is now available for appointment scheduling.`
    });
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
    addToast({
      type: 'success',
      title: 'Service Updated',
      message: 'Service details updated successfully.'
    });
  };

  const deleteService = (id: string) => {
    const item = data.services.find(s => s.id === id);
    setData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
    addToast({
      type: 'info',
      title: 'Service Removed',
      message: `"${item?.name || 'Service'}" removed from active roster.`
    });
  };

  // Appointment Operations
  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>): string => {
    const id = 'apt-' + Date.now();
    const createdAt = new Date().toISOString().split('T')[0];
    const newAppointment: Appointment = { ...appointment, id, createdAt };

    setData(prev => {
      // Find or link client
      const existingClient = prev.clients.find(c => c.email.toLowerCase() === appointment.clientEmail.toLowerCase());
      let updatedClients = prev.clients;
      if (existingClient) {
        updatedClients = prev.clients.map(c => c.id === existingClient.id ? {
          ...c,
          appointmentsCount: c.appointmentsCount + 1,
          totalSpent: c.totalSpent + appointment.totalPrice
        } : c);
      } else {
        const newClient: Client = {
          id: 'c-' + Date.now(),
          name: appointment.clientName,
          email: appointment.clientEmail,
          phone: appointment.clientPhone,
          tags: ['New Booking'],
          totalSpent: appointment.totalPrice,
          ordersCount: 0,
          appointmentsCount: 1,
          createdAt: new Date().toISOString().split('T')[0]
        };
        updatedClients = [newClient, ...prev.clients];
      }

      return {
        ...prev,
        appointments: [newAppointment, ...prev.appointments],
        clients: updatedClients
      };
    });

    addToast({
      type: 'success',
      title: 'Appointment Scheduled',
      message: `Booked for ${appointment.clientName} on ${appointment.date} at ${appointment.timeSlot}.`
    });

    return id;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === id ? { ...a, status } : a)
    }));
    addToast({
      type: 'info',
      title: 'Appointment Status',
      message: `Status changed to ${status.replace('_', ' ')}.`
    });
  };

  const cancelAppointment = (id: string) => {
    updateAppointmentStatus(id, 'cancelled');
  };

  // Order Operations
  const createOrder = (orderData: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    discount?: number;
    total: number;
    notes?: string;
    source: Order['source'];
    paymentStatus?: Order['paymentStatus'];
  }): Order => {
    const count = data.orders.length + 1000 + Math.floor(Math.random() * 50);
    const orderNumber = `ORD-${count}`;
    const id = 'ord-' + Date.now();
    const date = new Date().toISOString().split('T')[0];

    const newOrder: Order = {
      id,
      orderNumber,
      clientName: orderData.clientName,
      clientEmail: orderData.clientEmail,
      clientPhone: orderData.clientPhone,
      date,
      status: 'confirmed',
      paymentStatus: orderData.paymentStatus || 'paid',
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      discount: orderData.discount || 0,
      total: orderData.total,
      notes: orderData.notes,
      source: orderData.source
    };

    // Deduct stock for physical products in the order
    setData(prev => {
      const updatedProducts = prev.products.map(prod => {
        const orderedItem = orderData.items.find(i => i.type === 'product' && i.itemId === prod.id);
        if (orderedItem) {
          const newStock = Math.max(0, prod.stock - orderedItem.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      });

      // Update or create client
      const existingClient = prev.clients.find(c => c.email.toLowerCase() === orderData.clientEmail.toLowerCase());
      let updatedClients = prev.clients;
      if (existingClient) {
        updatedClients = prev.clients.map(c => c.id === existingClient.id ? {
          ...c,
          ordersCount: c.ordersCount + 1,
          totalSpent: c.totalSpent + orderData.total
        } : c);
      } else {
        const newClient: Client = {
          id: 'c-' + Date.now(),
          name: orderData.clientName,
          email: orderData.clientEmail,
          phone: orderData.clientPhone,
          tags: ['Store Customer'],
          totalSpent: orderData.total,
          ordersCount: 1,
          appointmentsCount: orderData.items.filter(i => i.type === 'service').length,
          createdAt: date
        };
        updatedClients = [newClient, ...prev.clients];
      }

      return {
        ...prev,
        orders: [newOrder, ...prev.orders],
        products: updatedProducts,
        clients: updatedClients
      };
    });

    addToast({
      type: 'success',
      title: 'Order Confirmed',
      message: `Order #${newOrder.orderNumber} placed for ${orderData.clientName}. Total: ${data.profile.currency}${orderData.total.toFixed(2)}`
    });

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === id ? { ...o, status } : o)
    }));
  };

  const updatePaymentStatus = (id: string, paymentStatus: Order['paymentStatus']) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === id ? { ...o, paymentStatus } : o)
    }));
    addToast({
      type: 'info',
      title: 'Payment Status Updated',
      message: `Order marked as ${paymentStatus}.`
    });
  };

  // Quotes Operations
  const createQuote = (quoteData: Omit<QuoteEstimate, 'id' | 'quoteNumber' | 'dateCreated'>): QuoteEstimate => {
    const id = 'qt-' + Date.now();
    const count = data.quotes.length + 3000 + Math.floor(Math.random() * 50);
    const quoteNumber = `EST-${count}`;
    const dateCreated = new Date().toISOString().split('T')[0];

    const newQuote: QuoteEstimate = {
      ...quoteData,
      id,
      quoteNumber,
      dateCreated
    };

    setData(prev => ({
      ...prev,
      quotes: [newQuote, ...prev.quotes]
    }));

    addToast({
      type: 'success',
      title: 'Estimate Created',
      message: `Quote #${newQuote.quoteNumber} prepared for ${newQuote.clientName}.`
    });

    return newQuote;
  };

  const updateQuoteStatus = (id: string, status: QuoteEstimate['status']) => {
    setData(prev => ({
      ...prev,
      quotes: prev.quotes.map(q => q.id === id ? { ...q, status } : q)
    }));
    addToast({
      type: 'info',
      title: 'Quote Status',
      message: `Quote status set to ${status}.`
    });
  };

  const convertQuoteToOrder = (quoteId: string): Order | null => {
    const quote = data.quotes.find(q => q.id === quoteId);
    if (!quote) return null;

    const orderItems: OrderItem[] = quote.items.map((item, idx) => ({
      id: 'oi-q-' + idx + '-' + Date.now(),
      type: item.type,
      itemId: item.itemId || 'custom-item',
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }));

    const createdOrder = createOrder({
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone || '',
      items: orderItems,
      subtotal: quote.subtotal,
      tax: quote.tax,
      total: quote.total,
      source: 'quote_converted',
      paymentStatus: 'unpaid',
      notes: `Converted from Estimate ${quote.quoteNumber}. ${quote.notes || ''}`
    });

    // Mark quote as converted
    setData(prev => ({
      ...prev,
      quotes: prev.quotes.map(q => q.id === quoteId ? { ...q, status: 'converted', convertedOrderId: createdOrder.id } : q)
    }));

    addToast({
      type: 'success',
      title: 'Quote Converted to Order',
      message: `Estimate ${quote.quoteNumber} is now Active Order #${createdOrder.orderNumber}.`
    });

    return createdOrder;
  };

  // Client Operations
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'totalSpent' | 'ordersCount' | 'appointmentsCount'>): Client => {
    const id = 'c-' + Date.now();
    const newClient: Client = {
      ...clientData,
      id,
      totalSpent: 0,
      ordersCount: 0,
      appointmentsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setData(prev => ({
      ...prev,
      clients: [newClient, ...prev.clients]
    }));

    addToast({
      type: 'success',
      title: 'Client Record Saved',
      message: `${newClient.name} added to client directory.`
    });

    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
    addToast({
      type: 'success',
      title: 'Client Updated',
      message: 'Client record saved.'
    });
  };

  const updateProfile = (updates: Partial<BusinessProfile>) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }));
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Business profile and tax preferences updated.'
    });
  };

  // Cart operations
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const id = 'cart-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setCart(prev => {
      // If product already in cart with same id, increment quantity
      if (item.type === 'product' && item.product) {
        const existing = prev.find(i => i.type === 'product' && i.product?.id === item.product?.id);
        if (existing) {
          return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i);
        }
      }
      return [...prev, { ...item, id }];
    });

    const itemName = item.type === 'product' ? item.product?.name : item.service?.name;
    addToast({
      type: 'success',
      title: item.type === 'product' ? 'Added to Bag' : 'Service Selected',
      message: `"${itemName}" added to your booking & order tray.`
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart calculation
  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.type === 'product' ? (item.product?.price || 0) : (item.service?.price || 0);
    return acc + (price * item.quantity);
  }, 0);

  const cartTax = cartSubtotal * data.profile.taxRate;
  const cartTotalAmount = cartSubtotal + cartTax;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BusinessContext.Provider
      value={{
        mode,
        setMode,
        adminTab,
        setAdminTab,
        clientTab,
        setClientTab,
        activePresetId,
        profile: data.profile,
        products: data.products,
        services: data.services,
        appointments: data.appointments,
        orders: data.orders,
        quotes: data.quotes,
        clients: data.clients,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal: {
          subtotal: cartSubtotal,
          tax: cartTax,
          total: cartTotalAmount,
          count: cartCount
        },
        addProduct,
        updateProduct,
        deleteProduct,
        adjustProductStock,
        addService,
        updateService,
        deleteService,
        addAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        createQuote,
        updateQuoteStatus,
        convertQuoteToOrder,
        addClient,
        updateClient,
        updateProfile,
        switchPreset,
        resetPresetData,
        selectedInvoiceOrder,
        setSelectedInvoiceOrder,
        toasts,
        addToast,
        dismissToast
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
