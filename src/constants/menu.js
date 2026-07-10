export const MENU_STATUS = {
  ACTIVE: "Active",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
  INACTIVE: "Inactive",
};

export const MENU_CATEGORIES = [
  "Starter",
  "Main",
  "Dessert",
  "Beverage",
  "Side",
];

export const MOCK_MENU_ITEMS = [
  {
    id: "M-1001",
    name: "Classic Cheeseburger",
    category: "Main",
    status: MENU_STATUS.ACTIVE,
    pricing: { sellingPrice: 350.0, costPrice: 150.0 },
    tax: { category: "GST", percentage: 5, included: true },
    addons: ["Extra Cheese", "Bacon", "No Onion", "Extra Pickles"],
  },
  {
    id: "M-1002",
    name: "Truffle Fries",
    category: "Side",
    status: MENU_STATUS.ACTIVE,
    pricing: { sellingPrice: 200.0, costPrice: 80.0 },
    tax: { category: "GST", percentage: 5, included: true },
    addons: ["Extra Truffle Oil", "Spicy Mayo"],
  },
  {
    id: "M-1003",
    name: "Margherita Pizza",
    category: "Main",
    status: MENU_STATUS.ACTIVE,
    pricing: { sellingPrice: 450.0, costPrice: 180.0 },
    tax: { category: "GST", percentage: 5, included: true },
    addons: ["Extra Basil", "Thin Crust", "Extra Cheese"],
  },
  {
    id: "M-1004",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    status: MENU_STATUS.ACTIVE,
    pricing: { sellingPrice: 250.0, costPrice: 100.0 },
    tax: { category: "GST", percentage: 5, included: true },
    addons: ["Vanilla Ice Cream", "Extra Fudge"],
  },
  {
    id: "M-1005",
    name: "Iced Caramel Macchiato",
    category: "Beverage",
    status: MENU_STATUS.ACTIVE,
    pricing: { sellingPrice: 280.0, costPrice: 90.0 },
    tax: { category: "GST", percentage: 5, included: true },
    addons: ["Almond Milk", "Less Ice", "Extra Shot"],
  },
];
