import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Alert, Platform } from "react-native";

const POSContext = createContext();

export function POSProvider({ children }) {
  const [cart, setCart] = useState([]); // { product, quantity, discount, notes }
  const [customer, setCustomer] = useState(null);
  const [activeTable, setActiveTable] = useState(null);
  const [orderType, setOrderType] = useState("Takeaway");
  const [globalDiscount, setGlobalDiscount] = useState({
    type: "none",
    value: 0,
  }); // type: 'percentage' | 'fixed' | 'none'
  const [taxRate, setTaxRate] = useState(5); // e.g., 5% GST
  const [compoundingTaxes, setCompoundingTaxes] = useState([]); // [{name, rate, compoundsOn}]
  const [parkedSales, setParkedSales] = useState([]); // Saved/parked tickets
  const [voidLog, setVoidLog] = useState([]); // Audit log for voids

  const addToCart = (product) => {
    if (product.inventory?.currentStock <= 0) {
      if (Platform.OS === "web") {
        const confirmAdd = window.confirm(
          `Low Stock Warning: ${product.name} is out of stock. Add anyway?`,
        );
        if (!confirmAdd) return;
      } else {
        Alert.alert(
          "Low Stock Warning",
          `${product.name} is out of stock. Add anyway?`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Add", onPress: () => performAddToCart(product) },
          ],
        );
        return;
      }
    }
    performAddToCart(product);
  };

  const performAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          discount: { type: "none", value: 0 },
          notes: "",
          employee: null,
        },
      ];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const assignEmployeeToItem = (productId, employee) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, employee } : item,
      ),
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    setActiveTable(null);
    setGlobalDiscount({ type: "none", value: 0 });
    setOrderType("Takeaway");
  };


  // ── Void with Audit ────────────────────────────────────────────────
  const voidItem = useCallback(
    (productId, reason = "No reason", cashierId = "EMP-UNKNOWN") => {
      const item = cart.find((i) => i.product.id === productId);
      if (!item) return;
      setVoidLog((prev) => [
        {
          id: `VOID-${Date.now()}`,
          productId,
          productName: item.product.name,
          quantity: item.quantity,
          reason,
          cashierId,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      removeFromCart(productId);
    },
    [cart],
  );

  const voidEntireCart = useCallback(
    (reason = "No reason", cashierId = "EMP-UNKNOWN") => {
      cart.forEach((item) => {
        setVoidLog((prev) => [
          {
            id: `VOID-${Date.now()}-${item.product.id}`,
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            reason,
            cashierId,
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);
      });
      clearCart();
    },
    [cart],
  );

  const totals = useMemo(() => {
    let subtotal = 0;

    // Calculate items
    cart.forEach((item) => {
      let itemPrice = item.product.pricing?.sellingPrice || 0;
      if (item.product.bulkPricing && item.product.bulkPricing.length > 0) {
        const applicableTier = [...item.product.bulkPricing]
          .sort((a, b) => b.minQty - a.minQty)
          .find((tier) => item.quantity >= tier.minQty);
        if (applicableTier) {
          itemPrice = applicableTier.price;
        }
      }
      let itemTotal = itemPrice * item.quantity;

      // Apply item discount if any
      if (item.discount.type === "percentage") {
        itemTotal -= itemTotal * (item.discount.value / 100);
      } else if (item.discount.type === "fixed") {
        itemTotal -= item.discount.value;
      }

      subtotal += itemTotal;
    });

    // Apply global discount
    let discountAmount = 0;
    if (globalDiscount.type === "percentage") {
      discountAmount = subtotal * (globalDiscount.value / 100);
    } else if (globalDiscount.type === "fixed") {
      discountAmount = globalDiscount.value;
    }

    const afterDiscount = Math.max(0, subtotal - discountAmount);

    // Support compounding taxes: Tax B can apply to (Total + Tax A)
    let taxAmount = 0;
    if (compoundingTaxes.length > 0) {
      let runningTotal = afterDiscount;
      compoundingTaxes.forEach((tax) => {
        const thisTax = runningTotal * (tax.rate / 100);
        taxAmount += thisTax;
        if (tax.compoundsOn) {
          runningTotal += thisTax; // Next tax compounds on this
        }
      });
    } else {
      taxAmount = afterDiscount * (taxRate / 100);
    }

    const grandTotal = afterDiscount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal,
    };
  }, [cart, globalDiscount, taxRate, compoundingTaxes]);

  const [openTabs, setOpenTabs] = useState([]);

  // ── Park / Save Ticket ─────────────────────────────────────────────
  const parkSale = useCallback(
    (ticketName) => {
      if (cart.length === 0) return;
      const ticket = {
        id: `PKD-${Date.now()}`,
        name: ticketName || `Ticket #${parkedSales.length + 1}`,
        cart: [...cart],
        customer,
        activeTable,
        orderType,
        globalDiscount,
        totals,
        time: new Date().toISOString(),
      };
      setParkedSales((prev) => [...prev, ticket]);
      clearCart();
      return ticket;
    },
    [
      cart,
      customer,
      activeTable,
      orderType,
      globalDiscount,
      totals,
      parkedSales.length,
    ],
  );

  const restoreParkedSale = useCallback(
    (ticketId) => {
      const ticket = parkedSales.find((t) => t.id === ticketId);
      if (!ticket) return;
      setCart(ticket.cart);
      setCustomer(ticket.customer);
      setActiveTable(ticket.activeTable);
      setOrderType(ticket.orderType);
      setGlobalDiscount(ticket.globalDiscount);
      setParkedSales((prev) => prev.filter((t) => t.id !== ticketId));
    },
    [parkedSales],
  );

  const deleteParkedSale = useCallback((ticketId) => {
    setParkedSales((prev) => prev.filter((t) => t.id !== ticketId));
  }, []);

  const holdCart = (tabName) => {
    if (cart.length === 0) return;

    const newTab = {
      id: `TAB-${Date.now()}`,
      name:
        tabName ||
        (activeTable
          ? `Table ${activeTable.name}`
          : `Tab ${openTabs.length + 1}`),
      cart: [...cart],
      customer,
      activeTable,
      orderType,
      globalDiscount,
      totals,
      time: new Date().toISOString(),
    };

    setOpenTabs((prev) => [...prev, newTab]);
    clearCart();
  };

  const restoreTab = (tabId) => {
    const tab = openTabs.find((t) => t.id === tabId);
    if (!tab) return;

    setCart(tab.cart);
    setCustomer(tab.customer);
    setActiveTable(tab.activeTable);
    setOrderType(tab.orderType);
    setGlobalDiscount(tab.globalDiscount);

    setOpenTabs((prev) => prev.filter((t) => t.id !== tabId));
  };

  const value = {
    cart,
    customer,
    activeTable,
    orderType,
    globalDiscount,
    taxRate,
    compoundingTaxes,
    totals,
    openTabs,
    parkedSales,
    voidLog,
    setCustomer,
    setActiveTable,
    setOrderType,
    setGlobalDiscount,
    setTaxRate,
    setCompoundingTaxes,
    addToCart,
    updateQuantity,
    assignEmployeeToItem,
    removeFromCart,
    clearCart,
    holdCart,
    restoreTab,
    parkSale,
    restoreParkedSale,
    deleteParkedSale,
    voidItem,
    voidEntireCart,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
}

export function usePOS() {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error("usePOS must be used within a POSProvider");
  }
  return context;
}
