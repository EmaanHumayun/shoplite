/**
 * ShopLite High-Fidelity Mock Dataset
 * Team Cloud Crafters - Multi-Service E-Commerce Product Management
 */

export const INITIAL_PRODUCTS = [
  {
    id: "prod-001",
    sku: "SHP-LTH-01",
    name: "Artisan Leather Weekender",
    category: "Leather Goods",
    price: 345.00,
    costPrice: 160.00,
    stock: 24,
    minThreshold: 8,
    status: "active",
    description: "Full-grain Tuscan calfskin duffle bag with solid brass hardware and water-resistant cotton lining.",
    imageUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-09-15T10:00:00Z"
  },
  {
    id: "prod-002",
    sku: "SHP-WCH-02",
    name: "Heritage Chronograph Watch",
    category: "Watches & Jewelry",
    price: 520.00,
    costPrice: 240.00,
    stock: 7,
    minThreshold: 10,
    status: "active",
    description: "Automatic mechanical movement with sapphire crystal glass and interchangeable horween leather strap.",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-09-20T12:30:00Z"
  },
  {
    id: "prod-003",
    sku: "SHP-APP-03",
    name: "Cashmere Knit Cardigan",
    category: "Apparel",
    price: 280.00,
    costPrice: 110.00,
    stock: 15,
    minThreshold: 5,
    status: "active",
    description: "100% Mongolian two-ply cashmere with mother-of-pearl buttons in oat heather hue.",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-02T14:15:00Z"
  },
  {
    id: "prod-004",
    sku: "SHP-HOM-04",
    name: "Minimalist Brass Desk Lamp",
    category: "Home & Living",
    price: 185.00,
    costPrice: 75.00,
    stock: 3,
    minThreshold: 8,
    status: "active",
    description: "Spun brushed brass with integrated warm 2700K dimmable LED and woven textile cord.",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-10T09:00:00Z"
  },
  {
    id: "prod-005",
    sku: "SHP-FTW-05",
    name: "Venetian Suede Loafers",
    category: "Footwear",
    price: 260.00,
    costPrice: 115.00,
    stock: 0,
    minThreshold: 6,
    status: "active",
    description: "Hand-stitched Italian suede loafers with supple calfskin lining and flexible leather sole.",
    imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-14T11:45:00Z"
  },
  {
    id: "prod-006",
    sku: "SHP-FRG-06",
    name: "Botanical Room Diffuser",
    category: "Fragrance",
    price: 68.00,
    costPrice: 22.00,
    stock: 42,
    minThreshold: 15,
    status: "active",
    description: "Essential oils of cedarwood, black amber and bergamot in apothecary amber glass bottle.",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-22T16:20:00Z"
  },
  {
    id: "prod-007",
    sku: "SHP-HOM-07",
    name: "Handcrafted Ceramic Tableware Set",
    category: "Home & Living",
    price: 145.00,
    costPrice: 58.00,
    stock: 18,
    minThreshold: 10,
    status: "active",
    description: "Stoneware clay dinner plates and bowls featuring speckled matte glaze finish.",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-28T08:15:00Z"
  },
  {
    id: "prod-008",
    sku: "SHP-LTH-08",
    name: "Slim Bi-Fold Card Wallet",
    category: "Leather Goods",
    price: 75.00,
    costPrice: 28.00,
    stock: 31,
    minThreshold: 12,
    status: "active",
    description: "Vegetable tanned bridle leather with hand-beveled edges and six card slots.",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-11-05T13:00:00Z"
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-8941",
    customer: {
      name: "Sophia Montgomery",
      email: "sophia.m@example.com",
      phone: "+1 (555) 234-8901",
      city: "New York, USA"
    },
    date: "2026-11-23T14:22:00Z",
    status: "Processing",
    paymentMethod: "Credit Card",
    subtotal: 605.00,
    tax: 48.40,
    shipping: 0.00,
    total: 653.40,
    items: [
      { productId: "prod-001", sku: "SHP-LTH-01", name: "Artisan Leather Weekender", quantity: 1, price: 345.00 },
      { productId: "prod-005", sku: "SHP-FTW-05", name: "Venetian Suede Loafers", quantity: 1, price: 260.00 }
    ]
  },
  {
    id: "ORD-8940",
    customer: {
      name: "Marcus Sterling",
      email: "m.sterling@domain.co.uk",
      phone: "+44 20 7946 0912",
      city: "London, UK"
    },
    date: "2026-11-22T19:40:00Z",
    status: "Completed",
    paymentMethod: "Wire Transfer",
    subtotal: 520.00,
    tax: 41.60,
    shipping: 15.00,
    total: 576.60,
    items: [
      { productId: "prod-002", sku: "SHP-WCH-02", name: "Heritage Chronograph Watch", quantity: 1, price: 520.00 }
    ]
  },
  {
    id: "ORD-8939",
    customer: {
      name: "Elena Rostova",
      email: "elena.rostova@design.org",
      phone: "+49 30 1234567",
      city: "Berlin, Germany"
    },
    date: "2026-11-21T09:12:00Z",
    status: "Completed",
    paymentMethod: "Apple Pay",
    subtotal: 353.00,
    tax: 28.24,
    shipping: 0.00,
    total: 381.24,
    items: [
      { productId: "prod-003", sku: "SHP-APP-03", name: "Cashmere Knit Cardigan", quantity: 1, price: 280.00 },
      { productId: "prod-008", sku: "SHP-LTH-08", name: "Slim Bi-Fold Card Wallet", quantity: 1, price: 73.00 }
    ]
  },
  {
    id: "ORD-8938",
    customer: {
      name: "Julian Vance",
      email: "julian.vance@techcorp.io",
      phone: "+1 (415) 890-1234",
      city: "San Francisco, USA"
    },
    date: "2026-11-20T17:05:00Z",
    status: "Pending",
    paymentMethod: "Credit Card",
    subtotal: 185.00,
    tax: 14.80,
    shipping: 10.00,
    total: 209.80,
    items: [
      { productId: "prod-004", sku: "SHP-HOM-04", name: "Minimalist Brass Desk Lamp", quantity: 1, price: 185.00 }
    ]
  },
  {
    id: "ORD-8937",
    customer: {
      name: "Camille Laurent",
      email: "c.laurent@paris.fr",
      phone: "+33 1 42 68 55 00",
      city: "Paris, France"
    },
    date: "2026-11-19T11:30:00Z",
    status: "Cancelled",
    paymentMethod: "PayPal",
    subtotal: 145.00,
    tax: 11.60,
    shipping: 12.00,
    total: 168.60,
    items: [
      { productId: "prod-007", sku: "SHP-HOM-07", name: "Handcrafted Ceramic Tableware Set", quantity: 1, price: 145.00 }
    ]
  }
];

export const SALES_CHART_DATA = [
  { day: "Mon", revenue: 2420, orders: 8 },
  { day: "Tue", revenue: 3850, orders: 12 },
  { day: "Wed", revenue: 3100, orders: 10 },
  { day: "Thu", revenue: 4780, orders: 16 },
  { day: "Fri", revenue: 5920, orders: 21 },
  { day: "Sat", revenue: 6840, orders: 25 },
  { day: "Sun", revenue: 4210, orders: 15 }
];
