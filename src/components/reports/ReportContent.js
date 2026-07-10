import React from "react";
import { SalesReports } from "@/components/reports/SalesReports";
import { InventoryReports } from "@/components/reports/InventoryReports";
import { FinancialReports } from "@/components/reports/FinancialReports";
import { EmployeeReports } from "@/components/reports/EmployeeReports";
import { CustomerReports } from "@/components/reports/CustomerReports";
import { StoreReports } from "@/components/reports/StoreReports";

export function ReportContent({ activeTab, dash }) {
  switch (activeTab) {
    case "sales":
      return <SalesReports dash={dash} />;
    case "inventory":
      return <InventoryReports dash={dash} />;
    case "financial":
      return <FinancialReports dash={dash} />;
    case "employees":
      return <EmployeeReports dash={dash} />;
    case "customers":
      return <CustomerReports dash={dash} />;
    case "stores":
      return <StoreReports dash={dash} />;
    default:
      return <SalesReports dash={dash} />;
  }
}
