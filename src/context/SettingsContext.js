import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

const DEFAULT_SETTINGS = {
  business: {
    name: 'Mac Burguer',
    type: 'Restaurant / QSR',
    vertical: 'FNB', // 'RETAIL', 'FNB', or 'SERVICES'
    verticalFlags: {
      isRetail: false,
      isFNB: true,
      isServices: false,
    },
    regNumber: 'REG-123456',
    gstVat: 'GST-987654',
    email: 'hello@macburguer.com',
    phone: '+1 234 567 8900',
    website: 'www.macburguer.com',
    address: '123 Burger St',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    postalCode: '90001',
    timeZone: 'America/Los_Angeles',
    logoUrl: 'https://example.com/logo.png',
    facebook: '@macburguer',
    instagram: '@macburguer_official',
  },
  branch: {
    code: 'BR-001',
    manager: 'John Doe',
    status: 'Active',
    contactEmail: 'branch1@macburguer.com',
    contactPhone: '+1 234 567 8901',
    openingHours: '09:00 AM - 10:00 PM',
    capacity: 120,
    features: ['Drive-Thru', 'Play Area'],
  },
  tax: {
    defaultRate: 10,
    inclusive: false,
    compound: false,
    taxId: 'TAX-0001',
    exemptionsEnabled: true,
    regionalTax: 2,
    serviceTax: 1.5,
  },
  currency: {
    symbol: '$',
    code: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    decimalPlaces: 2,
    thousandSeparator: ',',
    currencyPosition: 'left',
  },
  receipt: {
    header: 'Welcome to Mac Burguer!',
    footer: 'Thank you for your visit.',
    showTax: true,
    showCustomer: true,
    printLogo: true,
    barcodeEnabled: true,
    qrCodeUrl: 'https://macburguer.com/feedback',
    showCashierName: true,
  },
  invoice: {
    prefix: 'INV-',
    dueDays: 14,
    notes: 'Please pay within 14 days.',
    bankDetails: 'Bank: Chime, Acc: 12345678',
  },
  payment: {
    cashEnabled: true,
    cardEnabled: true,
    upiEnabled: true,
    splitCards: false,
    surchargePercentage: 0,
    roundingEnabled: false,
  },
  discount: {
    maxPercentage: 20,
    managerApprovalRequired: true,
    allowStacking: false,
    loyaltyDiscount: 5,
    happyHourEnabled: true,
    promoCodesEnabled: true,
  },
  inventory: {
    allowNegative: false,
    lowStockThreshold: 10,
    autoPurchaseOrders: false,
    defaultSupplier: 'Sysco',
    trackWaste: true,
    barcodeFormat: 'EAN-13',
  },
  product: {
    skuAutoGenerate: true,
  },
  customer: {
    requireRegistration: false,
    defaultGroup: 'Regular',
    enableLoyalty: true,
    marketingOptInDefault: false,
    allowStoreCredit: true,
  },
  loyalty: {
    pointsPerCurrency: 1,
    minRedemption: 100,
  },
  employee: {
    sessionTimeout: 60,
    requirePinForVoid: true,
    trackOvertime: false,
    biometricLogin: false,
    allowClockInOut: true,
  },
  restaurant: {
    serviceCharge: 5,
    diningModes: ['Dine In', 'Takeaway', 'Delivery'],
    enableTableManagement: true,
    routeToKDS: true,
    defaultTipPercentage: 15,
  },
  notification: {
    emailAlerts: true,
    lowStockAlerts: true,
  },
  hardware: {
    defaultPrinter: 'Kitchen Printer 1',
    cashDrawerEnabled: true,
    customerDisplayEnabled: false,
    barcodeScannerEnabled: true,
    weighingScalePort: 'COM3',
  },
  integration: {
    paymentProvider: 'Stripe',
    accountingSync: 'QuickBooks',
    deliveryPartners: ['UberEats', 'DoorDash'],
    smsProvider: 'Twilio',
    emailProvider: 'SendGrid',
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'Daily',
    retentionDays: 30,
    cloudProvider: 'AWS S3',
  },
  security: {
    twoFactor: false,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    ipWhitelisting: false,
  },
  subscription: {
    plan: 'Pro',
    billingCycle: 'Annual',
    nextBillingDate: '2027-01-01',
    paymentMethod: 'Visa ending in 4242',
  },
  system: {
    theme: 'Dark',
    language: 'English',
    autoLogout: 15,
    enableAnalytics: true,
    debugMode: false,
  },
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const updateSetting = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}
