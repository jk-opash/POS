import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { MetricRow, SummaryCard } from "@/components/dashboard/SummaryCard";
import { Receipt, FileText, AlertTriangle } from "lucide-react-native";
import { useResponsive } from "@/hooks/useResponsive";

export function InvoicesSummaryCards({ metrics }) {
  const { isDesktop, isTablet, isMiniTab, isMobile } = useResponsive();

  if (!metrics) return null;

  const cards = [
    <SummaryCard
      key="revenue"
      title="Total Revenue"
      primary={`₹${metrics.totalRevenue.toFixed(2)}`}
      icon={<Receipt size={18} color={ThemeColors.emerald} />}
      badge={{ label: "+12.5%", positive: true }}
    >
      <MetricRow label="Total Invoices" value={String(metrics.totalInvoices)} />
    </SummaryCard>,

    <SummaryCard
      key="pending"
      title="Pending Payments"
      primary={`₹${metrics.pendingAmount.toFixed(2)}`}
      icon={<FileText size={18} color={ThemeColors.amber} />}
    >
      <MetricRow label="Action Required" value="Review" />
    </SummaryCard>,

    <SummaryCard
      key="overdue"
      title="Overdue Amount"
      primary={`₹${metrics.overdueAmount.toFixed(2)}`}
      icon={<AlertTriangle size={18} color={ThemeColors.red} />}
    >
      <MetricRow
        label="Late Payments"
        value="Critical"
        highlight={false}
        arrow="down"
      />
    </SummaryCard>
  ];

  const isScrollable = isMobile || isMiniTab;
  const cardWidth = isMobile ? 280 : 320;

  const wrappedCards = cards.map((card, idx) => (
    <View key={idx} style={isScrollable ? { width: cardWidth } : { flex: 1 }}>
      {card}
    </View>
  ));

  if (isScrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: ThemeSpacing.sm, paddingRight: ThemeSpacing.lg }}
        style={{ marginHorizontal: -ThemeSpacing.lg, paddingHorizontal: ThemeSpacing.lg, marginBottom: ThemeSpacing.md }}
      >
        {wrappedCards}
      </ScrollView>
    );
  }

  return (
    <View style={styles.cardsRow}>
      {wrappedCards}
    </View>
  );
}

const styles = StyleSheet.create({
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.sm,
    marginBottom: ThemeSpacing.md,
  },
});
