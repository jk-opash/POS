import React, { createContext, useContext, useState } from "react";

const BranchesContext = createContext();

export function BranchesProvider({ children }) {
  const [activeBranch, setActiveBranch] = useState("br-1");
  const [branches, setBranches] = useState([
    {
      id: "br-1",
      name: "Surat Branch",
      code: "SUR-01",
      type: "Retail Store",
      company: "Mac Burguer India",
      region: "West India",
      contact: "+91 9876543210",
      email: "surat@macburguer.com",
      address: "123 Ring Road",
      city: "Surat",
      state: "Gujarat",
      country: "India",
      currency: "INR",
      timeZone: "Asia/Kolkata",
      taxJurisdiction: "GST - Gujarat",
      storeSize: "2500 sqft",
      openingDate: "2020-01-15",
      taxRegistration: "24AAAAA0000A1Z5",
      status: "Operational",
      manager: "Rahul Sharma",
      schedule: {
        weekday: "09:00 AM - 10:00 PM",
        weekend: "10:00 AM - 11:30 PM",
      },
      metrics: {
        todaySales: 15000,
        ordersProcessed: 124,
        revenue: 450000,
        profit: 180000,
        inventoryValue: 250000,
        employeeCount: 15,
        customerCount: 3500,
        averageCheckoutTime: "2m 15s",
        conversionRate: "4.2%",
        shrinkage: "0.8%",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "br-2",
      name: "Ahmedabad Branch",
      code: "AHM-01",
      type: "Restaurant",
      company: "Mac Burguer India",
      region: "West India",
      contact: "+91 9876543211",
      email: "ahmedabad@macburguer.com",
      address: "456 SG Highway",
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      currency: "INR",
      timeZone: "Asia/Kolkata",
      taxJurisdiction: "GST - Gujarat",
      storeSize: "4000 sqft",
      openingDate: "2019-06-10",
      taxRegistration: "24BBBBB0000B1Z5",
      status: "Operational",
      manager: "Priya Patel",
      schedule: {
        weekday: "10:00 AM - 11:00 PM",
        weekend: "10:00 AM - 12:00 AM",
      },
      metrics: {
        todaySales: 22000,
        ordersProcessed: 180,
        revenue: 600000,
        profit: 240000,
        inventoryValue: 300000,
        employeeCount: 22,
        customerCount: 5200,
        averageCheckoutTime: "1m 45s",
        conversionRate: "5.1%",
        shrinkage: "0.5%",
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: "br-3",
      name: "Mumbai Branch",
      code: "MUM-01",
      type: "Corporate Office",
      company: "Mac Burguer India",
      region: "West India",
      contact: "+91 9876543212",
      email: "mumbai@macburguer.com",
      address: "789 BKC",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      currency: "INR",
      timeZone: "Asia/Kolkata",
      taxJurisdiction: "GST - Maharashtra",
      storeSize: "10000 sqft",
      openingDate: "2018-03-01",
      taxRegistration: "27CCCCC0000C1Z5",
      status: "Maintenance",
      manager: "Amit Singh",
      schedule: {
        weekday: "09:00 AM - 06:00 PM",
        weekend: "Closed",
      },
      metrics: {
        todaySales: 5000,
        ordersProcessed: 45,
        revenue: 800000,
        profit: 320000,
        inventoryValue: 500000,
        employeeCount: 40,
        customerCount: 8000,
        averageCheckoutTime: "N/A",
        conversionRate: "N/A",
        shrinkage: "0.2%",
      },
      createdAt: new Date().toISOString(),
    },
  ]);

  const addBranch = (branch) => {
    setBranches((prev) => [
      ...prev,
      {
        ...branch,
        id: `br-${Date.now()}`,
        metrics: {
          todaySales: 0,
          ordersProcessed: 0,
          revenue: 0,
          profit: 0,
          inventoryValue: 0,
          employeeCount: 0,
          customerCount: 0,
          averageCheckoutTime: "0s",
          conversionRate: "0%",
          shrinkage: "0%",
        },
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const updateBranch = (id, updates) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBranch = (id) => {
    // In a real app, you might just mark as 'Closed' instead of deleting.
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BranchesContext.Provider
      value={{ branches, addBranch, updateBranch, deleteBranch, activeBranch, setActiveBranch }}
    >
      {children}
    </BranchesContext.Provider>
  );
}

export function useBranches() {
  const context = useContext(BranchesContext);
  if (!context) {
    throw new Error("useBranches must be used within a BranchesProvider");
  }
  return context;
}
