export const PRODUCT_STATUS = {
  ACTIVE: "Active",
  DRAFT: "Draft",
  INACTIVE: "Inactive",
  ARCHIVED: "Archived",
};

export const PRODUCT_TYPES = {
  STANDARD: "Standard",
  VARIANT: "Variant",
  BUNDLE: "Bundle",
  SERVICE: "Service",
  DIGITAL: "Digital",
};

export const CATEGORIES = [
  "Food",
  "Beverages",
  "Clothing",
  "Accessories",
  "Services",
  "Electronics",
  "Groceries",
  "Home & Garden",
  "Pharmacy",
  "Wholesale"
];

export const BRANDS = ["In-House", "Nike", "Coca-Cola", "Apple", "Spa Relax"];

export const PRODUCTS = [
  {
    id: "P-1000",
    name: "NyQuil Cold & Flu",
    type: PRODUCT_TYPES.STANDARD,
    category: "Pharmacy",
    brand: "Vicks",
    status: PRODUCT_STATUS.ACTIVE,
    sku: "PHARM-NYQ",
    barcode: "8901234560000",
    pricing: { sellingPrice: 250.0, costPrice: 150.0 },
    tax: { category: "GST", percentage: 12, included: true },
    requiresAgeVerification: true,
    requiresPrescription: true,
    inventory: { tracked: true, currentStock: 50, lowStockAlert: 10 }
  },
  {
    id: "P-1000-B",
    name: "Apples (Loose)",
    type: PRODUCT_TYPES.STANDARD,
    category: "Groceries",
    brand: "Fresh Farms",
    status: PRODUCT_STATUS.ACTIVE,
    sku: "GROC-APP-01",
    barcode: "8901234560001",
    pricing: { sellingPrice: 120.0, costPrice: 80.0 },
    tax: { category: "Exempt", percentage: 0, included: true },
    soldByWeight: true,
    inventory: { tracked: true, currentStock: 100, lowStockAlert: 20 }
  },
  {
    id: "P-1000-C",
    name: "Pallet of Mineral Water (1L x 24)",
    type: PRODUCT_TYPES.STANDARD,
    category: "Wholesale",
    brand: "Bisleri",
    status: PRODUCT_STATUS.ACTIVE,
    sku: "WS-MW-24",
    barcode: "8901234560002",
    pricing: { sellingPrice: 480.0, costPrice: 300.0 },
    bulkPricing: [
      { minQty: 5, price: 450.0 },
      { minQty: 20, price: 400.0 }
    ],
    tax: { category: "GST", percentage: 18, included: true },
    inventory: { tracked: true, currentStock: 500, lowStockAlert: 50 }
  },
  {
    id: "P-1001",
    name: "Coca-Cola 500ml",
    type: PRODUCT_TYPES.STANDARD,
    category: "Beverages",
    brand: "Coca-Cola",
    status: PRODUCT_STATUS.ACTIVE,
    sku: "BEV-CC-500",
    barcode: "8901234567890",
    pricing: {
      sellingPrice: 40.0,
      costPrice: 20.0,
    },
    tax: {
      category: "GST",
      percentage: 5,
      included: true,
    },
    isAgeRestricted: true,
    isEBTEligible: true,
    inventory: {
      tracked: true,
      current: 100,
      available: 80,
      reserved: 20,
      reorderLevel: 50,
    },
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "P-1002",
    name: "Basic T-Shirt",
    type: PRODUCT_TYPES.VARIANT,
    category: "Clothing",
    brand: "In-House",
    status: PRODUCT_STATUS.ACTIVE,
    pricing: {
      sellingPrice: 499.0,
      costPrice: 200.0,
    },
    inventory: {
      tracked: true,
      current: 300,
      available: 300,
    },
    variants: [
      { id: "V-1", name: "Small / Black", sku: "TS-S-BLK", barcode: "10001", stock: 100 },
      { id: "V-2", name: "Medium / Black", sku: "TS-M-BLK", barcode: "10002", stock: 150 },
      { id: "V-3", name: "Large / White", sku: "TS-L-WHT", barcode: "10003", stock: 50 },
    ],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "P-1003",
    name: "Breakfast Combo",
    type: PRODUCT_TYPES.BUNDLE,
    category: "Food",
    brand: "In-House",
    status: PRODUCT_STATUS.ACTIVE,
    sku: "BNDL-BFAST-01",
    barcode: "BNDL12345",
    pricing: {
      sellingPrice: 150.0,
      costPrice: 80.0,
    },
    bundleItems: [
      { productId: "P-1004", name: "Coffee", qty: 1 },
      { productId: "P-1005", name: "Sandwich", qty: 1 },
    ],
    inventory: {
      tracked: false, // Calculated from components
    },
    image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "P-1004",
    name: "Classic Cheeseburger",
    type: PRODUCT_TYPES.STANDARD,
    category: "Food",
    brand: "In-House",
    status: PRODUCT_STATUS.ACTIVE,
    sku: "FNB-BRG-CLS",
    pricing: {
      sellingPrice: 250.0,
      costPrice: 80.0,
    },
    inventory: {
      tracked: false, // Made to order, tracks raw ingredients instead
    },
    isComposite: true,
    recipe: [
      { rawMaterialId: 'INV-101', name: 'Classic Burger Patty', qty: 1 },
      { rawMaterialId: 'INV-102', name: 'Burger Buns', qty: 1 }, // 1 bun (assuming unit is pieces, but in MOCK it's 'packs'. We will deduct fractions if needed, let's say qty: 0.083 for 1/12th of a pack)
      { rawMaterialId: 'INV-103', name: 'Cheddar Cheese', qty: 0.1 } // 1 slice out of a pack
    ],
    modifiers: [
      {
        id: "MG-101",
        name: "Meat Temperature",
        minSelection: 1,
        maxSelection: 1,
        options: [
          { id: "OPT-1", name: "Rare", price: 0 },
          { id: "OPT-2", name: "Medium Rare", price: 0 },
          { id: "OPT-3", name: "Medium", price: 0 },
          { id: "OPT-4", name: "Well Done", price: 0 },
        ],
      },
      {
        id: "MG-102",
        name: "Add-ons",
        minSelection: 0,
        maxSelection: 3,
        options: [
          { id: "OPT-5", name: "Extra Cheese", price: 50.0, allergens: ["Dairy"] },
          { id: "OPT-6", name: "Bacon", price: 80.0 },
          { id: "OPT-7", name: "Avocado", price: 60.0 },
          { id: "OPT-8", name: "Peanut Sauce", price: 20.0, allergens: ["Peanuts", "Soy"] },
        ],
      },
      {
        id: "MG-3",
        name: "Exclusions (No...)",
        minSelection: 0,
        maxSelection: 3,
        options: [
          { id: "MO-8", name: "No Onions", price: 0 },
          { id: "MO-9", name: "No Pickles", price: 0 },
          { id: "MO-10", name: "No Tomatoes", price: 0 }
        ]
      }
    ],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "P-1006",
    name: "Haircut Premium",
    type: PRODUCT_TYPES.SERVICE,
    category: "Services",
    brand: "In-House",
    status: PRODUCT_STATUS.ACTIVE,
    sku: "SRV-HC-PRM",
    pricing: {
      sellingPrice: 500.0,
      costPrice: 0,
    },
    inventory: {
      tracked: false,
    },
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "P-1007",
    name: "VIP Membership",
    type: PRODUCT_TYPES.DIGITAL,
    category: "Services",
    brand: "In-House",
    status: PRODUCT_STATUS.ACTIVE,
    sku: "DIG-VIP-1M",
    pricing: {
      sellingPrice: 1999.0,
    },
    inventory: {
      tracked: false,
    },
    image: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "P-1008",
    name: "Wireless Earbuds Pro",
    type: PRODUCT_TYPES.STANDARD,
    category: "Electronics",
    brand: "Apple",
    status: PRODUCT_STATUS.ACTIVE,
    sku: "ELEC-WEP-01",
    barcode: "1234567890123",
    pricing: {
      sellingPrice: 12999.0,
      costPrice: 8000.0,
    },
    tax: {
      category: "GST",
      percentage: 18,
      included: false,
    },
    isEBTEligible: true,
    inventory: {
      tracked: true,
      current: 50,
      available: 45,
      reserved: 5,
      reorderLevel: 10,
    },
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "P-1009",
    name: "Organic Honey 250g",
    type: PRODUCT_TYPES.STANDARD,
    category: "Groceries",
    brand: "In-House",
    status: PRODUCT_STATUS.ACTIVE,
    sku: "GRO-HON-250",
    pricing: {
      sellingPrice: 350.0,
      costPrice: 150.0,
    },
    inventory: {
      tracked: true,
      current: 200,
      available: 200,
      reorderLevel: 50,
    },
    image: "https://images.unsplash.com/photo-1587049352847-4d4b127a5524?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "P-1010",
    name: "Ceramic Planter Set",
    type: PRODUCT_TYPES.BUNDLE,
    category: "Home & Garden",
    brand: "In-House",
    status: PRODUCT_STATUS.DRAFT,
    sku: "HG-PLANTER-BNDL",
    pricing: {
      sellingPrice: 1200.0,
      costPrice: 600.0,
    },
    bundleItems: [
      { productId: "P-1011", name: "Large Planter", qty: 1 },
      { productId: "P-1012", name: "Small Planter", qty: 2 },
    ],
    inventory: {
      tracked: false,
    },
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "P-1011",
    name: "Smartphone Charging Cable",
    type: PRODUCT_TYPES.VARIANT,
    category: "Electronics",
    brand: "In-House",
    status: PRODUCT_STATUS.ACTIVE,
    pricing: {
      sellingPrice: 499.0,
      costPrice: 100.0,
    },
    inventory: {
      tracked: true,
      current: 500,
      available: 500,
    },
    variants: [
      { id: "V-4", name: "1m / Type-C", sku: "CBL-1M-C", stock: 200 },
      { id: "V-5", name: "2m / Type-C", sku: "CBL-2M-C", stock: 150 },
      { id: "V-6", name: "1m / Lightning", sku: "CBL-1M-L", stock: 150 },
    ],
    image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "P-1012",
    name: "Leather Wallet",
    type: PRODUCT_TYPES.STANDARD,
    category: "Accessories",
    brand: "In-House",
    status: PRODUCT_STATUS.INACTIVE,
    sku: "ACC-WLT-LTH",
    pricing: {
      sellingPrice: 899.0,
      costPrice: 300.0,
    },
    inventory: {
      tracked: true,
      current: 0,
      available: 0,
      reorderLevel: 20,
    },
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=200",
  }
];
