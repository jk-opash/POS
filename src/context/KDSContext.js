import { createContext, useContext, useState } from "react";

const KDSContext = createContext();

export const useKDS = () => useContext(KDSContext);

// No mock orders, starting fresh

export const KDSProvider = ({ children }) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [stations, setStations] = useState([
    "All",
    "Grill",
    "Pizza",
    "Beverage",
    "Bakery",
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setActiveOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        // Also update all items' statuses to match the order
        const updatedItems = order.items.map((item) => ({ ...item, status: newStatus }));
        return { ...order, status: newStatus, items: updatedItems };
      })
    );
  };

  const updateItemStatus = (orderId, itemId, newStatus) => {
    setActiveOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedItems = order.items.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        );

        // Calculate order status
        let newOrderStatus = order.status;
        const statuses = updatedItems.map((i) => i.status);

        if (statuses.some((s) => s === "Preparing")) {
          newOrderStatus = "Preparing";
        } else if (statuses.every((s) => s === "Completed" || s === "Cancelled")) {
          newOrderStatus = "Completed";
        } else if (statuses.every((s) => s === "Served" || s === "Completed" || s === "Cancelled")) {
          newOrderStatus = "Served";
        } else if (statuses.every((s) => s === "Done" || s === "Served" || s === "Completed" || s === "Cancelled")) {
          newOrderStatus = "Done";
        } else if (statuses.some((s) => s === "Done" || s === "Served")) {
          newOrderStatus = "Preparing"; // Partially ready means still preparing
        } else if (statuses.every((s) => s === "Accepted")) {
          newOrderStatus = "Accepted";
        }

        return { ...order, items: updatedItems, status: newOrderStatus };
      })
    );
  };

  const updateOrderPriority = (orderId, newPriority) => {
    setActiveOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, priority: newPriority } : order,
      ),
    );
  };

  const markAsCompleted = (orderId) => {
    updateOrderStatus(orderId, "Completed");
    // In a real app, we might move this to a history array
  };

  const addOrderToKDS = (orderData) => {
    // orderData: { cart, customer, activeTable, orderType, notes, itemWise }
    const { cart, customer, activeTable, orderType, notes, itemWise } =
      orderData;
    if (!cart || cart.length === 0) return;

    // Hardcoded mapping for demo: Category -> Station
    const categoryToStation = {
      Burgers: "Grill",
      Pizzas: "Pizza",
      Beverages: "Beverage",
      Desserts: "Bakery",
    };

    let newTickets = [];

    if (itemWise) {
      newTickets = cart.map((item, index) => {
        const station = categoryToStation[item.product.category] || "Grill";
        const modifiers = item.addons ? [...item.addons] : [];

        // Combine the main order notes (if any) and the item-specific note
        let combinedNotes = notes || "";
        if (item.note) {
          combinedNotes = combinedNotes
            ? `${combinedNotes}\n${item.note}`
            : item.note;
        }

        return {
          id: `KDS-${Date.now()}-${index}`,
          orderNumber: Math.floor(100 + Math.random() * 900).toString(),
          type: orderType,
          table: activeTable ? `Table ${activeTable.name}` : null,
          customer: customer ? customer.name : "Walk-in",
          status: "Accepted",
          priority: "Normal",
          station: station,
          startTime: new Date().toISOString(),
          items: [
            {
              id: item.cartItemId || `${item.product.id}-${index}`,
              name: item.product.name,
              qty: item.quantity,
              modifiers: modifiers,
              status: "Accepted",
              note: item.note,
            },
          ],
          notes: combinedNotes,
        };
      });
    } else {
      // Group cart items by station
      const stationGroups = {};
      cart.forEach((item) => {
        const station = categoryToStation[item.product.category] || "Grill"; // default to Grill
        if (!stationGroups[station]) {
          stationGroups[station] = [];
        }
        stationGroups[station].push(item);
      });

      // Create a ticket for each station
      newTickets = Object.keys(stationGroups).map((station, index) => {
        let combinedNotes = notes || "";
        
        const items = stationGroups[station].map((c) => {
          const modifiers = c.addons ? [...c.addons] : [];
          
          let itemCombinedNotes = combinedNotes;
          if (c.note) {
            itemCombinedNotes = itemCombinedNotes
              ? `${itemCombinedNotes}\n${c.note}`
              : c.note;
          }

          return {
            id: c.cartItemId || `${c.product.id}-${index}`,
            name: c.product.name,
            qty: c.quantity,
            modifiers: modifiers,
            status: "Accepted",
            note: itemCombinedNotes,
          };
        });

        return {
          id: `KDS-${Date.now()}-${index}`,
          orderNumber: Math.floor(100 + Math.random() * 900).toString(),
          type: orderType,
          table: activeTable ? `Table ${activeTable.name}` : null,
          customer: customer ? customer.name : "Walk-in",
          status: "Accepted",
          priority: "Normal",
          station: station,
          startTime: new Date().toISOString(),
          items: items,
          notes: notes,
        };
      });
    }

    setActiveOrders((prev) => [...prev, ...newTickets]);
  };

  const replaceTableOrderInKDS = (tableName, orderData) => {
    // Remove all existing tickets for this table
    setActiveOrders((prev) => prev.filter((o) => o.table !== `Table ${tableName}`));
    // Re-insert the updated order as new tickets
    addOrderToKDS(orderData);
  };

  return (
    <KDSContext.Provider
      value={{
        activeOrders,
        stations,
        updateOrderStatus,
        updateItemStatus,
        updateOrderPriority,
        markAsCompleted,
        addOrderToKDS,
        replaceTableOrderInKDS,
      }}
    >
      {children}
    </KDSContext.Provider>
  );
};
