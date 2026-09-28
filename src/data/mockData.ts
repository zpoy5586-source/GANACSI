import { BusinessProfile, Product, Service, Appointment, Order, QuoteEstimate, Client } from '../types';

export interface BusinessPresetData {
  profile: BusinessProfile;
  products: Product[];
  services: Service[];
  appointments: Appointment[];
  orders: Order[];
  quotes: QuoteEstimate[];
  clients: Client[];
}

export const BUSINESS_PRESETS: Record<string, BusinessPresetData> = {
  aura: {
    profile: {
      id: 'aura',
      name: 'Aura Botanical & Facial Atelier',
      industry: 'botanicals_wellness',
      tagline: 'Curated organic skin therapeutics and master aesthetician treatments',
      email: 'concierge@aurabotanic.com',
      phone: '+1 (415) 890-4421',
      address: '742 Sutter Street, San Francisco, CA 94109',
      currency: '$',
      taxRate: 0.085,
      openingHours: 'Mon - Sat: 9:00 AM – 7:00 PM',
      heroHighlight: 'Artisan skincare formulated in small batches with clinical-grade facial rituals.',
      staff: [
        { id: 'st-1', name: 'Elena Rostova', role: 'Master Aesthetician & Founder', email: 'elena@aurabotanic.com', color: '#0d9488', active: true },
        { id: 'st-2', name: 'Marcus Chen', role: 'Holistic Skin Specialist', email: 'marcus@aurabotanic.com', color: '#0284c7', active: true },
        { id: 'st-3', name: 'Sophie Laurent', role: 'Lymphatic Drainage Therapist', email: 'sophie@aurabotanic.com', color: '#d97706', active: true },
      ]
    },
    products: [
      {
        id: 'p-1',
        name: 'Cold-Pressed Squalane & Rosehip Nectar',
        sku: 'AUR-OIL-01',
        category: 'Facial Oils',
        price: 78,
        costPrice: 24,
        stock: 34,
        minStockAlert: 10,
        description: 'Unrefined Chilean rosehip seed oil infused with botanical olive squalane and vitamin E for lipid barrier restoration.',
        dimensions: '50ml glass dropper',
        warranty: '12M shelf life after opening',
        unit: 'bottle',
        iconType: 'bottle'
      },
      {
        id: 'p-2',
        name: 'Ceramide Peptide Barrier Recovery Cream',
        sku: 'AUR-CRM-02',
        category: 'Moisturizers',
        price: 94,
        costPrice: 28,
        stock: 18,
        minStockAlert: 8,
        description: 'Bio-identical ceramides (NP, AP, EOP) with hexapeptide-8 and Centella asiatica to soothe post-treatment redness.',
        dimensions: '60g frosted jar',
        warranty: 'Fresh batch sealed',
        unit: 'jar',
        iconType: 'cream'
      },
      {
        id: 'p-3',
        name: 'Hand-Carved Xiuyan Jade Sculpting Gua Sha',
        sku: 'AUR-TL-03',
        category: 'Ritual Tools',
        price: 52,
        costPrice: 15,
        stock: 6,
        minStockAlert: 8,
        description: 'Heavyweight authentic Xiuyan nephrite jade with double comb edge for myofascial release and lymphatic drainage.',
        dimensions: '11cm x 6.5cm',
        warranty: 'Lifetime stone guarantee',
        unit: 'piece',
        iconType: 'tool'
      },
      {
        id: 'p-4',
        name: 'Bio-Fermented Willow Bark Clarifying Essence',
        sku: 'AUR-ES-04',
        category: 'Toners & Essences',
        price: 64,
        costPrice: 19,
        stock: 28,
        minStockAlert: 12,
        description: 'Natural salicylic acid source with fermented green tea broth and niacinamide to rebalance sebum and refine pore texture.',
        dimensions: '120ml bottle',
        warranty: '18M unopened',
        unit: 'bottle',
        iconType: 'bottle'
      },
      {
        id: 'p-5',
        name: 'Thermal Sea Algae & Kaolin Detox Mask',
        sku: 'AUR-MSK-05',
        category: 'Treatments & Masks',
        price: 82,
        costPrice: 22,
        stock: 4,
        minStockAlert: 6,
        description: 'Brittany coast organic sea kelp blended with micronized white kaolin for gentle enzymatic purification without tightness.',
        dimensions: '100ml tub',
        warranty: 'Small-batch pressed',
        unit: 'tub',
        iconType: 'cream'
      },
      {
        id: 'p-6',
        name: 'Pure Silk Hydration Sleeping Veil',
        sku: 'AUR-MSK-06',
        category: 'Treatments & Masks',
        price: 88,
        costPrice: 26,
        stock: 14,
        minStockAlert: 5,
        description: 'Overnight film-forming barrier with hydrolyzed silk protein, snow mushroom polysaccharide, and soothing blue chamomile.',
        dimensions: '75ml pump',
        warranty: 'Sealed vacuum dispenser',
        unit: 'pump',
        iconType: 'cream'
      }
    ],
    services: [
      {
        id: 's-1',
        name: 'Signature Bespoke Micro-Sculpting Facial',
        category: 'Clinical Facials',
        durationMinutes: 75,
        price: 185,
        pricingType: 'fixed',
        location: 'in_studio',
        specialistIds: ['st-1', 'st-2'],
        description: 'Comprehensive double cleanse, ultrasound pore infusion, customized enzymatic peel, targeted intra-oral buccal lifting, and cold cryo globe finish.',
        recommendedProducts: ['p-1', 'p-2'],
        bufferMinutes: 15,
        iconType: 'treatment'
      },
      {
        id: 's-2',
        name: 'Facial Lymphatic De-Puff & Gua Sha Ritual',
        category: 'Ritual Treatments',
        durationMinutes: 60,
        price: 150,
        pricingType: 'fixed',
        location: 'in_studio',
        specialistIds: ['st-1', 'st-3'],
        description: 'Deep clavicle, neck and facial lymphatic activation using warm herbal compresses followed by stone sculpting to relieve sinus tension and define contours.',
        recommendedProducts: ['p-1', 'p-3'],
        bufferMinutes: 15,
        iconType: 'treatment'
      },
      {
        id: 's-3',
        name: 'Holistic Skin Diagnostic & Regimen Formulation',
        category: 'Consultations',
        durationMinutes: 45,
        price: 95,
        pricingType: 'fixed',
        location: 'in_studio',
        specialistIds: ['st-1', 'st-2', 'st-3'],
        description: 'Digital skin barrier hydration mapping, lifestyle review, ingredient audit of current routine, and personalized multi-step protocol design. Fee credited towards purchases over $150.',
        recommendedProducts: ['p-2', 'p-4'],
        bufferMinutes: 10,
        iconType: 'consultation'
      },
      {
        id: 's-4',
        name: 'Virtual Skin Health & Protocol Consultation',
        category: 'Consultations',
        durationMinutes: 40,
        price: 80,
        pricingType: 'fixed',
        location: 'virtual',
        specialistIds: ['st-2'],
        description: 'High-definition 1-on-1 video evaluation of chronic barrier conditions, adult acne, or seasonal sensitivity with product prescription delivered by courier.',
        recommendedProducts: ['p-4', 'p-5'],
        bufferMinutes: 10,
        iconType: 'consultation'
      }
    ],
    appointments: [
      {
        id: 'apt-1',
        serviceId: 's-1',
        specialistId: 'st-1',
        clientName: 'Chloe Vance',
        clientEmail: 'chloe.vance@example.com',
        clientPhone: '+1 (415) 555-0192',
        date: '2026-09-28',
        timeSlot: '11:00 AM',
        status: 'scheduled',
        locationDetails: 'Studio Room A — Treatment Bed 1',
        notes: 'Pre-wedding skin readiness; client prefers fragrance-free finishing oil.',
        totalPrice: 185,
        linkedOrderId: 'ord-101',
        createdAt: '2026-09-24'
      },
      {
        id: 'apt-2',
        serviceId: 's-2',
        specialistId: 'st-3',
        clientName: 'Julian Sterling',
        clientEmail: 'j.sterling@designhouse.co',
        clientPhone: '+1 (415) 555-8311',
        date: '2026-09-28',
        timeSlot: '02:30 PM',
        status: 'scheduled',
        locationDetails: 'Studio Room B — Sculpting Suite',
        notes: 'Suffering from TMJ jaw tightness; focus on masseter release.',
        totalPrice: 150,
        linkedOrderId: 'ord-102',
        createdAt: '2026-09-25'
      },
      {
        id: 'apt-3',
        serviceId: 's-3',
        specialistId: 'st-2',
        clientName: 'Maya Patel',
        clientEmail: 'maya.patel@techcorp.io',
        clientPhone: '+1 (415) 555-4490',
        date: '2026-09-29',
        timeSlot: '10:00 AM',
        status: 'scheduled',
        locationDetails: 'Diagnostic Suite & Consultation Bar',
        notes: 'Severe post-flight dryness and perioral dermatitis inquiry.',
        totalPrice: 95,
        createdAt: '2026-09-26'
      },
      {
        id: 'apt-4',
        serviceId: 's-1',
        specialistId: 'st-1',
        clientName: 'Astrid Lindqvist',
        clientEmail: 'astrid.l@archnordic.com',
        clientPhone: '+1 (415) 555-7722',
        date: '2026-09-26',
        timeSlot: '04:00 PM',
        status: 'completed',
        locationDetails: 'Studio Room A',
        notes: 'Routine monthly maintenance. Purchased 1x Barrier Cream.',
        totalPrice: 185,
        linkedOrderId: 'ord-098',
        createdAt: '2026-09-20'
      }
    ],
    orders: [
      {
        id: 'ord-101',
        orderNumber: 'ORD-1081',
        clientId: 'c-1',
        clientName: 'Chloe Vance',
        clientEmail: 'chloe.vance@example.com',
        clientPhone: '+1 (415) 555-0192',
        date: '2026-09-24',
        status: 'confirmed',
        paymentStatus: 'paid',
        items: [
          { id: 'oi-1', type: 'service', itemId: 's-1', name: 'Signature Bespoke Micro-Sculpting Facial', quantity: 1, unitPrice: 185, specialistId: 'st-1', appointmentDate: '2026-09-28', appointmentTime: '11:00 AM' },
          { id: 'oi-2', type: 'product', itemId: 'p-1', name: 'Cold-Pressed Squalane & Rosehip Nectar', quantity: 1, unitPrice: 78 }
        ],
        subtotal: 263,
        tax: 22.36,
        discount: 0,
        total: 285.36,
        notes: 'Client pre-paid appointment + homecare bottle bundle.',
        source: 'pos_admin'
      },
      {
        id: 'ord-102',
        orderNumber: 'ORD-1082',
        clientId: 'c-2',
        clientName: 'Julian Sterling',
        clientEmail: 'j.sterling@designhouse.co',
        clientPhone: '+1 (415) 555-8311',
        date: '2026-09-25',
        status: 'confirmed',
        paymentStatus: 'paid',
        items: [
          { id: 'oi-3', type: 'service', itemId: 's-2', name: 'Facial Lymphatic De-Puff & Gua Sha Ritual', quantity: 1, unitPrice: 150, specialistId: 'st-3', appointmentDate: '2026-09-28', appointmentTime: '02:30 PM' },
          { id: 'oi-4', type: 'product', itemId: 'p-3', name: 'Hand-Carved Xiuyan Jade Sculpting Gua Sha', quantity: 1, unitPrice: 52 }
        ],
        subtotal: 202,
        tax: 17.17,
        discount: 15,
        total: 204.17,
        notes: 'Bundle promo applied for service + ritual stone purchase.',
        source: 'storefront_checkout'
      },
      {
        id: 'ord-098',
        orderNumber: 'ORD-1079',
        clientId: 'c-3',
        clientName: 'Astrid Lindqvist',
        clientEmail: 'astrid.l@archnordic.com',
        clientPhone: '+1 (415) 555-7722',
        date: '2026-09-26',
        status: 'fulfilled',
        paymentStatus: 'paid',
        items: [
          { id: 'oi-5', type: 'service', itemId: 's-1', name: 'Signature Bespoke Micro-Sculpting Facial', quantity: 1, unitPrice: 185, specialistId: 'st-1' },
          { id: 'oi-6', type: 'product', itemId: 'p-2', name: 'Ceramide Peptide Barrier Recovery Cream', quantity: 1, unitPrice: 94 }
        ],
        subtotal: 279,
        tax: 23.72,
        discount: 0,
        total: 302.72,
        source: 'pos_admin'
      },
      {
        id: 'ord-097',
        orderNumber: 'ORD-1077',
        clientId: 'c-4',
        clientName: 'David K. Hoffman',
        clientEmail: 'd.hoffman@pacific.org',
        clientPhone: '+1 (415) 555-9011',
        date: '2026-09-22',
        status: 'fulfilled',
        paymentStatus: 'paid',
        items: [
          { id: 'oi-7', type: 'product', itemId: 'p-4', name: 'Bio-Fermented Willow Bark Clarifying Essence', quantity: 2, unitPrice: 64 },
          { id: 'oi-8', type: 'product', itemId: 'p-2', name: 'Ceramide Peptide Barrier Recovery Cream', quantity: 1, unitPrice: 94 }
        ],
        subtotal: 222,
        tax: 18.87,
        discount: 0,
        total: 240.87,
        source: 'storefront_checkout'
      }
    ],
    quotes: [
      {
        id: 'qt-1',
        quoteNumber: 'EST-2041',
        clientId: 'c-5',
        clientName: 'Pacific Wellness Collective',
        clientEmail: 'procurement@pacificwell.com',
        clientPhone: '+1 (415) 555-6677',
        dateCreated: '2026-09-25',
        validUntil: '2026-10-15',
        status: 'sent',
        items: [
          { type: 'product', itemId: 'p-1', name: 'Cold-Pressed Squalane & Rosehip Nectar (Wholesale Lot)', description: 'Backbar 500ml apothecary decanters x4', quantity: 4, unitPrice: 220 },
          { type: 'product', itemId: 'p-3', name: 'Hand-Carved Xiuyan Jade Sculpting Gua Sha', description: 'Studio practitioner grade x12', quantity: 12, unitPrice: 38 },
          { type: 'service', itemId: 's-3', name: 'Staff Protocol Training & Diagnostic Workshop', description: 'Half-day on-site aesthetician masterclass conducted by Elena Rostova', quantity: 1, unitPrice: 850 }
        ],
        subtotal: 2186,
        tax: 185.81,
        total: 2371.81,
        notes: 'Quote includes complimentary delivery of testing display tester kit.'
      }
    ],
    clients: [
      {
        id: 'c-1',
        name: 'Chloe Vance',
        email: 'chloe.vance@example.com',
        phone: '+1 (415) 555-0192',
        address: '220 Presidio Ave, San Francisco, CA',
        notes: 'Sensitive skin barrier prone to rosacea. Loved the rosehip serum.',
        tags: ['VIP Client', 'Facial Regular', 'Homecare Buyer'],
        totalSpent: 588.08,
        ordersCount: 2,
        appointmentsCount: 2,
        createdAt: '2026-07-12'
      },
      {
        id: 'c-2',
        name: 'Julian Sterling',
        email: 'j.sterling@designhouse.co',
        phone: '+1 (415) 555-8311',
        company: 'Sterling Brand Studio',
        address: '488 Brannan St, San Francisco, CA',
        notes: 'Purchased jade stone with ritual appointment.',
        tags: ['Sculpting', 'Ritual Tools'],
        totalSpent: 204.17,
        ordersCount: 1,
        appointmentsCount: 1,
        createdAt: '2026-09-25'
      },
      {
        id: 'c-3',
        name: 'Astrid Lindqvist',
        email: 'astrid.l@archnordic.com',
        phone: '+1 (415) 555-7722',
        company: 'Nordic Form Architecture',
        address: '150 Battery St, San Francisco, CA',
        notes: 'Monthly recurring appointments booked 3 months in advance.',
        tags: ['VIP Client', 'Standing Reservation'],
        totalSpent: 1240.50,
        ordersCount: 4,
        appointmentsCount: 4,
        createdAt: '2026-05-04'
      },
      {
        id: 'c-4',
        name: 'David K. Hoffman',
        email: 'd.hoffman@pacific.org',
        phone: '+1 (415) 555-9011',
        address: '89 2nd St, San Francisco, CA',
        notes: 'Online product orders only so far; send invitation for in-studio diagnostic.',
        tags: ['Retail Only'],
        totalSpent: 481.74,
        ordersCount: 2,
        appointmentsCount: 0,
        createdAt: '2026-08-19'
      },
      {
        id: 'c-5',
        name: 'Pacific Wellness Collective',
        email: 'procurement@pacificwell.com',
        phone: '+1 (415) 555-6677',
        company: 'Pacific Wellness Group',
        address: '1200 California St, San Francisco, CA',
        notes: 'B2B institutional client negotiating backbar product supply and team training.',
        tags: ['B2B Partner', 'Corporate Quote'],
        totalSpent: 0,
        ordersCount: 0,
        appointmentsCount: 0,
        createdAt: '2026-09-25'
      }
    ]
  },

  veloce: {
    profile: {
      id: 'veloce',
      name: 'Veloce Vélo & Speed Lab',
      industry: 'cycling_mechanics',
      tagline: 'High-performance bicycle atelier, precision components & pro workshop fitting',
      email: 'lab@velocevelo.cc',
      phone: '+1 (503) 912-3340',
      address: '1410 NW 11th Ave, Portland, OR 97209',
      currency: '$',
      taxRate: 0.0,
      openingHours: 'Tue - Sun: 8:30 AM – 6:30 PM',
      heroHighlight: 'Handcrafted gravel & road hardware with Olympic-calibrated bike fits and certified suspension overhauls.',
      staff: [
        { id: 'st-v1', name: 'Matteo Bellini', role: 'Head Frame Builder & Lead Fitter', email: 'matteo@velocevelo.cc', color: '#ea580c', active: true },
        { id: 'st-v2', name: 'Kai Lindgren', role: 'Senior Suspension & Hydraulic Tech', email: 'kai@velocevelo.cc', color: '#0284c7', active: true },
      ]
    },
    products: [
      {
        id: 'vp-1',
        name: 'Aero-Gravel Carbon Handlebar (420mm)',
        sku: 'VEL-BAR-42',
        category: 'Cockpit & Controls',
        price: 320,
        costPrice: 140,
        stock: 8,
        minStockAlert: 3,
        description: 'Toray T800 unidirectional carbon bar with 16° flare and integrated internal cable channels.',
        dimensions: '420mm width, 125mm drop',
        warranty: '3-year crash replacement warranty',
        unit: 'piece',
        iconType: 'bike_part'
      },
      {
        id: 'vp-2',
        name: 'Ceramic Bearing Bottom Bracket (T47)',
        sku: 'VEL-BB-T47',
        category: 'Drivetrain',
        price: 195,
        costPrice: 85,
        stock: 12,
        minStockAlert: 4,
        description: 'Grade 3 silicon nitride ceramic balls with dual-lip labyrinth seals for extreme wet-weather gravel durability.',
        dimensions: 'T47 Inboard 24mm/30mm',
        warranty: '2-year smooth spin guarantee',
        unit: 'unit',
        iconType: 'bike_part'
      },
      {
        id: 'vp-3',
        name: 'Precision Master Hex & Torx Preset Tool Kit',
        sku: 'VEL-TL-09',
        category: 'Workshop Tools',
        price: 145,
        costPrice: 60,
        stock: 5,
        minStockAlert: 2,
        description: 'CNC machined 7075 aluminum grip with hardened S2 steel magnetic bits and calibrated 4-6Nm torque limiter sleeve.',
        dimensions: 'Compact roll-up pouch',
        warranty: 'Lifetime mechanical replacement',
        unit: 'set',
        iconType: 'tool'
      },
      {
        id: 'vp-4',
        name: 'Tubeless Sealant Lab Formula (1000ml)',
        sku: 'VEL-SL-1L',
        category: 'Fluids & Care',
        price: 42,
        costPrice: 16,
        stock: 22,
        minStockAlert: 8,
        description: 'Micro-fiber suspension synthetic latex that seals punctures up to 7mm down to -20°C.',
        dimensions: '1000ml squeeze bottle',
        warranty: 'Fresh lot guaranteed',
        unit: 'bottle',
        iconType: 'bottle'
      }
    ],
    services: [
      {
        id: 'vs-1',
        name: 'Dynamic 3D Retül Motion Bike Fit',
        category: 'Ergonomic Services',
        durationMinutes: 120,
        price: 320,
        pricingType: 'fixed',
        location: 'in_studio',
        specialistIds: ['st-v1'],
        description: 'Full biomechanical assessment, saddle pressure mapping, laser pedal cleat alignment, and real-time motion capture report.',
        recommendedProducts: ['vp-1'],
        bufferMinutes: 20,
        iconType: 'fitting'
      },
      {
        id: 'vs-2',
        name: 'Pro Race Overhaul & Ultrasonic Drivetrain Clean',
        category: 'Mechanical Services',
        durationMinutes: 90,
        price: 210,
        pricingType: 'fixed',
        location: 'in_studio',
        specialistIds: ['st-v1', 'st-v2'],
        description: 'Complete disassembly, ultrasonic solvent bath for chain and cassette, molten paraffin wax dip, hydraulic line flush, and truing.',
        recommendedProducts: ['vp-2', 'vp-4'],
        bufferMinutes: 15,
        iconType: 'maintenance'
      },
      {
        id: 'vs-3',
        name: 'Custom Wheel Building & Spoke Tensioning',
        category: 'Mechanical Services',
        durationMinutes: 60,
        price: 130,
        pricingType: 'hourly',
        location: 'in_studio',
        specialistIds: ['st-v2'],
        description: 'Hand-lacing custom hub and rim combinations with digital tensiometer balance to within 0.1mm lateral/radial tolerance.',
        recommendedProducts: ['vp-2'],
        bufferMinutes: 10,
        iconType: 'maintenance'
      }
    ],
    appointments: [
      {
        id: 'vapt-1',
        serviceId: 'vs-1',
        specialistId: 'st-v1',
        clientName: 'Erik Thorne',
        clientEmail: 'erik.thorne@cyclist.cc',
        clientPhone: '+1 (503) 555-1920',
        date: '2026-09-28',
        timeSlot: '01:00 PM',
        status: 'scheduled',
        locationDetails: 'Studio Fit Bay 1 — Motion rig',
        notes: 'Prepping for Unbound 200; reporting lower back fatigue after 4th hour.',
        totalPrice: 320,
        createdAt: '2026-09-25'
      }
    ],
    orders: [
      {
        id: 'vord-1',
        orderNumber: 'ORD-5011',
        clientName: 'Erik Thorne',
        clientEmail: 'erik.thorne@cyclist.cc',
        clientPhone: '+1 (503) 555-1920',
        date: '2026-09-25',
        status: 'confirmed',
        paymentStatus: 'paid',
        items: [
          { id: 'voi-1', type: 'service', itemId: 'vs-1', name: 'Dynamic 3D Retül Motion Bike Fit', quantity: 1, unitPrice: 320, specialistId: 'st-v1', appointmentDate: '2026-09-28', appointmentTime: '01:00 PM' },
          { id: 'voi-2', type: 'product', itemId: 'vp-1', name: 'Aero-Gravel Carbon Handlebar (420mm)', quantity: 1, unitPrice: 320 }
        ],
        subtotal: 640,
        tax: 0,
        discount: 0,
        total: 640,
        source: 'pos_admin'
      }
    ],
    quotes: [
      {
        id: 'vqt-1',
        quoteNumber: 'EST-902',
        clientName: 'Cascadia Cycling Club Racing Team',
        clientEmail: 'president@cascadiacycling.org',
        dateCreated: '2026-09-26',
        validUntil: '2026-10-26',
        status: 'sent',
        items: [
          { type: 'service', itemId: 'vs-2', name: 'Pro Race Overhaul (Team Fleet x5)', quantity: 5, unitPrice: 190 },
          { type: 'product', itemId: 'vp-4', name: 'Tubeless Sealant Lab Formula Bulk 5L', quantity: 2, unitPrice: 150 },
          { type: 'product', itemId: 'vp-2', name: 'Ceramic Bearing BB Units', quantity: 5, unitPrice: 175 }
        ],
        subtotal: 2125,
        tax: 0,
        total: 2125,
        notes: 'Pre-season team servicing package with 10% volume incentive.'
      }
    ],
    clients: [
      {
        id: 'vc-1',
        name: 'Erik Thorne',
        email: 'erik.thorne@cyclist.cc',
        phone: '+1 (503) 555-1920',
        notes: 'Gravel racer. Uses Cervelo Aspero. Purchased carbon handlebars.',
        tags: ['Gravel Racer', 'Bike Fit VIP'],
        totalSpent: 640,
        ordersCount: 1,
        appointmentsCount: 1,
        createdAt: '2026-09-25'
      }
    ]
  },

  soundstage: {
    profile: {
      id: 'soundstage',
      name: 'SoundStage Acoustics & Studio Lab',
      industry: 'audio_acoustics',
      tagline: 'Architectural acoustic diffusers, reference monitoring & professional studio commissioning',
      email: 'engineering@soundstage.design',
      phone: '+1 (212) 804-9912',
      address: '532 W 25th St, New York, NY 10001',
      currency: '$',
      taxRate: 0.08875,
      openingHours: 'Mon - Fri: 9:00 AM – 6:00 PM',
      heroHighlight: 'Laboratory-calibrated acoustic treatments and on-site room modal analysis for recording suites and audiophile listening rooms.',
      staff: [
        { id: 'st-s1', name: 'Dorian Vance, PE', role: 'Principal Acoustic Engineer', email: 'dorian@soundstage.design', color: '#6366f1', active: true },
        { id: 'st-s2', name: 'Nadia Solis', role: 'Studio Systems & Hardware Architect', email: 'nadia@soundstage.design', color: '#059669', active: true },
      ]
    },
    products: [
      {
        id: 'sp-1',
        name: 'Quadratic Residue Diffuser (Walnut QRD 7)',
        sku: 'SND-QRD-W7',
        category: 'Acoustic Panels',
        price: 490,
        costPrice: 210,
        stock: 14,
        minStockAlert: 4,
        description: 'Solid FSC-certified American walnut 7-well quadratic acoustic diffuser tuned to scatter frequencies from 650Hz to 4.2kHz.',
        dimensions: '120cm x 60cm x 15cm',
        warranty: '5-year structural craft warranty',
        unit: 'panel',
        iconType: 'panel'
      },
      {
        id: 'sp-2',
        name: 'Broadband Membrane Bass Trap (Corner Unit)',
        sku: 'SND-TRP-40',
        category: 'Bass Management',
        price: 360,
        costPrice: 155,
        stock: 9,
        minStockAlert: 3,
        description: 'Tuned limp-mass membrane resonator absorbs resonant room modes between 45Hz and 160Hz with negligible high-frequency deadening.',
        dimensions: '120cm height x 45cm corner',
        warranty: '10-year fabric & core warranty',
        unit: 'unit',
        iconType: 'panel'
      },
      {
        id: 'sp-3',
        name: 'Iso-Decoupled Reference Monitor Isolation Stands',
        sku: 'SND-ISO-ST',
        category: 'Monitoring Accessories',
        price: 240,
        costPrice: 95,
        stock: 16,
        minStockAlert: 5,
        description: 'Aircraft-grade billet aluminum bases with patented viscoelastic elastomer decoupling pods eliminating desk resonant smear.',
        dimensions: 'Pair for 6.5" to 8" monitors',
        warranty: 'Lifetime mechanical integrity',
        unit: 'pair',
        iconType: 'speaker'
      }
    ],
    services: [
      {
        id: 'ss-1',
        name: 'On-Site Acoustic Modal Analysis & Room Calibration',
        category: 'Engineering Services',
        durationMinutes: 180,
        price: 650,
        pricingType: 'fixed',
        location: 'on_site',
        specialistIds: ['st-s1'],
        description: 'Multi-point calibrated measurement microphone sweeps (ETC, RT60, waterfall spectral decay plots) and physical treatment placement recommendations.',
        recommendedProducts: ['sp-1', 'sp-2'],
        bufferMinutes: 30,
        iconType: 'acoustic'
      },
      {
        id: 'ss-2',
        name: 'Turnkey Studio Hardware Installation & Cabling',
        category: 'Installation Services',
        durationMinutes: 120,
        price: 175,
        pricingType: 'hourly',
        location: 'on_site',
        specialistIds: ['st-s2'],
        description: 'Precision wall mounting of acoustic diffusers, studio monitor alignment with laser guides, and clean balanced XLR patchbay wiring.',
        recommendedProducts: ['sp-1', 'sp-3'],
        bufferMinutes: 15,
        iconType: 'maintenance'
      }
    ],
    appointments: [
      {
        id: 'sapt-1',
        serviceId: 'ss-1',
        specialistId: 'st-s1',
        clientName: 'Gramercy Post Productions',
        clientEmail: 'studio@gramercypost.com',
        clientPhone: '+1 (212) 555-8819',
        date: '2026-09-29',
        timeSlot: '10:00 AM',
        status: 'scheduled',
        locationDetails: 'Control Room B, 45 W 21st St, Suite 400',
        notes: 'Excessive 68Hz bass buildup causing inaccurate dialogue mix translation.',
        totalPrice: 650,
        createdAt: '2026-09-24'
      }
    ],
    orders: [
      {
        id: 'sord-1',
        orderNumber: 'ORD-7001',
        clientName: 'Gramercy Post Productions',
        clientEmail: 'studio@gramercypost.com',
        clientPhone: '+1 (212) 555-8819',
        date: '2026-09-24',
        status: 'confirmed',
        paymentStatus: 'paid',
        items: [
          { id: 'soi-1', type: 'service', itemId: 'ss-1', name: 'On-Site Acoustic Modal Analysis & Room Calibration', quantity: 1, unitPrice: 650, specialistId: 'st-s1', appointmentDate: '2026-09-29', appointmentTime: '10:00 AM' },
          { id: 'soi-2', type: 'product', itemId: 'sp-2', name: 'Broadband Membrane Bass Trap (Corner Unit)', quantity: 2, unitPrice: 360 }
        ],
        subtotal: 1370,
        tax: 121.59,
        discount: 0,
        total: 1491.59,
        source: 'pos_admin'
      }
    ],
    quotes: [
      {
        id: 'sqt-1',
        quoteNumber: 'EST-4401',
        clientName: 'Electric Sound Labs',
        clientEmail: 'kevin@electricsound.nyc',
        dateCreated: '2026-09-27',
        validUntil: '2026-10-27',
        status: 'sent',
        items: [
          { type: 'product', itemId: 'sp-1', name: 'Quadratic Residue Diffusers (Walnut)', quantity: 6, unitPrice: 470 },
          { type: 'product', itemId: 'sp-2', name: 'Broadband Membrane Bass Traps', quantity: 4, unitPrice: 340 },
          { type: 'service', itemId: 'ss-2', name: 'Turnkey Installation & Laser Mounting', quantity: 6, unitPrice: 175 }
        ],
        subtotal: 5230,
        tax: 464.16,
        total: 5694.16,
        notes: 'Includes free delivery within 5 boroughs and structural anchoring test.'
      }
    ],
    clients: [
      {
        id: 'sc-1',
        name: 'Gramercy Post Productions',
        email: 'studio@gramercypost.com',
        phone: '+1 (212) 555-8819',
        company: 'Gramercy Post LLC',
        address: '45 W 21st St, Suite 400, New York, NY',
        notes: 'Commercial Dolby Atmos mixing room commissioning.',
        tags: ['Studio VIP', 'Commercial Client'],
        totalSpent: 1491.59,
        ordersCount: 1,
        appointmentsCount: 1,
        createdAt: '2026-09-24'
      }
    ]
  }
};
