import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeSpacing, ThemeRadius } from "@/theme/theme";
import { useResponsive } from "@/hooks/useResponsive";
import { useNavigation } from "expo-router";
import { useDashboard } from "@/hooks/useDashboard";
import { DatePickerModal, DATE_RANGES } from "@/components/dashboard/DatePickerModal";
import { ReportsHeader } from "@/components/reports/ReportsHeader";

import { ReportContent } from "@/components/reports/ReportContent";

const REPORT_TABS = [
  { key: "sales", label: "Sales & Revenue" },
  { key: "inventory", label: "Inventory" },
  { key: "financial", label: "Financials" },
  { key: "employees", label: "Employees" },
  { key: "customers", label: "Customers" },
  { key: "stores", label: "Multi-Store" },
];

export default function ReportsScreen() {
  const { isDesktop } = useResponsive();
  const navigation = useNavigation();
  const dash = useDashboard();
  
  const [activeTab, setActiveTab] = useState("sales");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const selectedRangeLabel = DATE_RANGES.find((r) => r.key === dash.dateRange)?.label || "Today";



  return (
    <View style={styles.root}>
      <ReportsHeader 
        isDesktop={isDesktop}
        onMenuPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
        selectedRangeLabel={selectedRangeLabel}
        onDatePickerPress={() => setDatePickerVisible(true)}
        tabs={REPORT_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <View style={styles.content}>
        <ReportContent activeTab={activeTab} dash={dash} />
      </View>

      <DatePickerModal 
        visible={isDatePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        selectedRange={dash.dateRange}
        onSelectRange={(range) => {
          dash.setDateRange(range);
          setDatePickerVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.background,
  },
  content: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
});
