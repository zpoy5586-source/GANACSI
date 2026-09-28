export type BusinessIndustry = 'botanicals_wellness' | 'cycling_mechanics' | 'audio_acoustics';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  color: string;
  active: boolean;
}

export interface BusinessProfile {
  id: string;
  name: string;
  industry: BusinessIndustry;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number; // e.g. 0.08 = 8%
  openingHours: string;
  staff: StaffMember[];
  heroHighlight: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStockAlert: number;
  description: string;
  dimensions?: string;
  warranty?: string;
  unit: string; // e.g. "unit", "bottle", "pair", "box"
  iconType: 'bottle' | 'cream' | 'bike_part' | 'tool' | 'speaker' | 'panel' | 'accessory' | 'generic';
}

export interface Service {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  pricingType: 'fixed' | 'hourly';
  location: 'in_studio' | 'on_site' | 'virtual';
  specialistIds: string[];
  description: string;
  recommendedProducts?: string[]; // IDs of products frequently paired
  bufferMinutes: number;
  iconType: 'consultation' | 'treatment' | 'maintenance' | 'acoustic' | 'fitting' | 'generic';
}

export interface Appointment {
  id: string;
  serviceId: string;
  specialistId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  locationDetails?: string;
  notes?: string;
  totalPrice: number;
  linkedOrderId?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  type: 'product' | 'service';
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  specialistId?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ORD-1084"
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  status: 'pending' | 'confirmed' | 'fulfilled' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'partially_paid' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  source: 'pos_admin' | 'storefront_checkout' | 'quote_converted';
}

export interface QuoteItem {
  type: 'product' | 'service';
  itemId?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteEstimate {
  id: string;
  quoteNumber: string; // e.g. "EST-2041"
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  dateCreated: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'converted';
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  convertedOrderId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  notes?: string;
  tags: string[];
  totalSpent: number;
  ordersCount: number;
  appointmentsCount: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  type: 'product' | 'service';
  product?: Product;
  service?: Service;
  quantity: number;
  selectedDate?: string;
  selectedTimeSlot?: string;
  selectedSpecialistId?: string;
}
