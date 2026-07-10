import { Text } from "@/components/ui/Text";
import { useInvoices } from "@/context/InvoicesContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { FileText, Search, User, Utensils, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { InvoiceDetailsModal } from "./InvoiceDetailsModal";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

export function InvoicesListTab({
  isTodaySelected,
  selectedMonth,
  selectedYear,
}) {
  const { invoices } = useInvoices();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isListView, setIsListView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, isTodaySelected, selectedMonth, selectedYear]);

  const { isDesktop, isTablet, isMiniTab, width } = useResponsive();

  // Responsive columns: desktop 4, tablet 3, mini tab 2, mobile 1
  const numColumns = isDesktop ? 4 : isTablet ? 3 : isMiniTab ? 2 : 2;

  // Calculate explicit card width so last row items don't stretch
  const sidebarW = isDesktop ? 250 : 0;
  const listPadding = ThemeSpacing.lg * 2; // 32
  const totalGap = ThemeSpacing.md * (numColumns - 1);
  const availableWidth = width - sidebarW - listPadding - totalGap;
  const cardWidth =
    numColumns > 1 ? Math.floor(availableWidth / numColumns) : "100%";

  const filteredInvoices = invoices.filter((inv) => {
    // Only allow Paid and Pending statuses
    if (inv.status !== "Paid" && inv.status !== "Pending") {
      return false;
    }

    // Date filtering
    const invDate = new Date(inv.date);
    const now = new Date();

    if (isTodaySelected) {
      if (invDate.toDateString() !== now.toDateString()) return false;
    } else {
      if (selectedMonth !== "all" && invDate.getMonth() !== selectedMonth)
        return false;
      if (selectedYear !== "all" && invDate.getFullYear() !== selectedYear)
        return false;
    }

    // Search filtering
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      inv.id.toLowerCase().includes(searchLower) ||
      inv.customer.name.toLowerCase().includes(searchLower) ||
      inv.type.toLowerCase().includes(searchLower);

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderCard = (inv, overrideWidth) => {
    const widthToUse = overrideWidth || cardWidth;
    const invDate = new Date(inv.date);
    const timeStr = invDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = invDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });

    return (
      <TouchableOpacity
        key={inv.id}
        style={[styles.card, { width: widthToUse }]}
        activeOpacity={0.8}
        onPress={() => setSelectedInvoiceId(inv.id)}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.idWrap}>
              <Text weight="bold" style={styles.invoiceId} numberOfLines={1}>
                {inv.id}
              </Text>
            </View>
            <InvoiceStatusBadge status={inv.status} />
          </View>

          <View style={styles.cardBodyCompact}>
            <View style={styles.customerWrap}>
              {inv.table ? (
                <Utensils size={14} color={ThemeColors.textSecondary} />
              ) : (
                <User size={14} color={ThemeColors.textSecondary} />
              )}
              <Text
                weight="medium"
                style={styles.customerNameCompact}
                numberOfLines={1}
              >
                {inv.table
                  ? inv.table
                  : inv.customer?.name || "Walk-in Customer"}
              </Text>
            </View>
            <Text style={styles.invoiceDate} numberOfLines={1}>
              {dateStr} • {timeStr}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.cardFooterCompact}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text weight="bold" style={styles.grandTotal} numberOfLines={1}>
              ₹{inv.grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTableRow = (inv) => {
    const invDate = new Date(inv.date);
    const timeStr = invDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = invDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });

    return (
      <TouchableOpacity
        key={inv.id}
        style={styles.tableRow}
        activeOpacity={0.7}
        onPress={() => setSelectedInvoiceId(inv.id)}
      >
        <Text style={[styles.col, { flex: 1.2, color: ThemeColors.blue }]}>
          {inv.id}
        </Text>
        <Text style={[styles.col, { flex: 1.5, color: ThemeColors.textMuted }]}>
          {dateStr} • {timeStr}
        </Text>
        <View style={[styles.col, { flex: 2.5, flexDirection: "row", alignItems: "center", gap: ThemeSpacing.sm }]}>
          {inv.table ? (
            <Utensils size={14} color={ThemeColors.textSecondary} />
          ) : (
            <User size={14} color={ThemeColors.textSecondary} />
          )}
          <Text style={{ color: ThemeColors.textPrimary }} numberOfLines={1}>
            {inv.table ? inv.table : inv.customer?.name || "Walk-in"}
          </Text>
        </View>
        <View style={[styles.col, { flex: 1 }]}>
          <InvoiceStatusBadge status={inv.status} />
        </View>
        <Text weight="bold" style={[styles.col, { flex: 1.2, textAlign: "right" }]}>
          ₹{inv.grandTotal.toFixed(2)}
        </Text>
      </TouchableOpacity>
    );
  };

  let content;
  if (filteredInvoices.length === 0) {
    content = (
      <View style={styles.emptyState}>
        <FileText size={48} color={ThemeColors.border} />
        <Text weight="bold" style={styles.emptyTitle}>
          No invoices found
        </Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search or filters.
        </Text>
      </View>
    );
  } else if (isListView) {
    const renderTable = (invs) => (
      <View>
        <View style={styles.tableHeader}>
          <Text weight="bold" style={[styles.col, { flex: 1.2 }]}>Invoice ID</Text>
          <Text weight="bold" style={[styles.col, { flex: 1.5 }]}>Date & Time</Text>
          <Text weight="bold" style={[styles.col, { flex: 2.5 }]}>Customer / Table</Text>
          <Text weight="bold" style={[styles.col, { flex: 1 }]}>Status</Text>
          <Text weight="bold" style={[styles.col, { flex: 1.2, textAlign: "right" }]}>Total</Text>
        </View>
        {invs.map((inv) => renderTableRow(inv))}
      </View>
    );

    content = (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableContainer} contentContainerStyle={{ minWidth: "100%" }}>
        <View style={{ minWidth: isDesktop ? "100%" : 800, width: "100%" }}>
          {renderTable(currentInvoices)}
        </View>
      </ScrollView>
    );
  } else {
    content = (
      <FlatList
        data={currentInvoices}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        scrollEnabled={false}
        columnWrapperStyle={
          numColumns > 1 ? { gap: ThemeSpacing.md } : undefined
        }
        contentContainerStyle={{ gap: ThemeSpacing.md }}
        renderItem={({ item }) => renderCard(item)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <Text style={styles.headerTitle}>Invoice List</Text>
        <View style={styles.tabControls}>
          <View style={styles.searchWrap}>
            <Search
              size={18}
              color={ThemeColors.textMuted}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search invoice, customer..."
              placeholderTextColor={ThemeColors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View style={styles.viewToggleWrap}>
            <TouchableOpacity 
              onPress={() => setIsListView(false)} 
              style={[styles.viewToggleBtn, !isListView && styles.viewToggleBtnActive]}
            >
              <LayoutGrid size={16} color={!isListView ? ThemeColors.emerald : ThemeColors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setIsListView(true)} 
              style={[styles.viewToggleBtn, isListView && styles.viewToggleBtnActive]}
            >
              <List size={16} color={isListView ? ThemeColors.emerald : ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {content}

      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <Text style={styles.paginationSummary}>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredInvoices.length)} of {filteredInvoices.length} entries
          </Text>
          <View style={styles.paginationControls}>
            <TouchableOpacity 
              style={[styles.pageArrowBtn, currentPage === 1 && styles.pageArrowBtnDisabled]}
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} color={currentPage === 1 ? ThemeColors.borderSubtle : ThemeColors.textSecondary} />
            </TouchableOpacity>
            
            {(() => {
              const pages = [];
              let startPage = Math.max(1, currentPage - 2);
              let endPage = Math.min(totalPages, currentPage + 2);

              if (currentPage <= 3) {
                endPage = Math.min(5, totalPages);
              }
              if (currentPage >= totalPages - 2) {
                startPage = Math.max(1, totalPages - 4);
              }

              if (startPage > 1) {
                pages.push(
                  <TouchableOpacity key="first" style={styles.pageNumberBtn} onPress={() => setCurrentPage(1)}>
                    <Text style={styles.pageNumberText}>1</Text>
                  </TouchableOpacity>
                );
                if (startPage > 2) {
                  pages.push(<Text key="ell1" style={styles.pageEllipsis}>...</Text>);
                }
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <TouchableOpacity
                    key={i}
                    style={[styles.pageNumberBtn, currentPage === i && styles.pageNumberBtnActive]}
                    onPress={() => setCurrentPage(i)}
                  >
                    <Text style={[styles.pageNumberText, currentPage === i && styles.pageNumberTextActive]}>
                      {i}
                    </Text>
                  </TouchableOpacity>
                );
              }

              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(<Text key="ell2" style={styles.pageEllipsis}>...</Text>);
                }
                pages.push(
                  <TouchableOpacity key="last" style={styles.pageNumberBtn} onPress={() => setCurrentPage(totalPages)}>
                    <Text style={styles.pageNumberText}>{totalPages}</Text>
                  </TouchableOpacity>
                );
              }
              return pages;
            })()}

            <TouchableOpacity 
              style={[styles.pageArrowBtn, currentPage === totalPages && styles.pageArrowBtnDisabled]}
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={16} color={currentPage === totalPages ? ThemeColors.borderSubtle : ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <InvoiceDetailsModal
        visible={!!selectedInvoiceId}
        invoiceId={selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: ThemeSpacing.lg,
  },
  tabHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
  },
  headerTitle: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    paddingHorizontal: ThemeSpacing.md,
    height: 36,
    flex: 1,
    minWidth: 200,
    maxWidth: 300,
  },
  searchIcon: {
    marginRight: ThemeSpacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: ThemeColors.textPrimary,
    outlineStyle: "none",
  },
  card: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    overflow: "hidden",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: ThemeSpacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  idWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    flexShrink: 1,
    marginRight: ThemeSpacing.sm,
  },
  iconBox: {
    padding: 4,
    backgroundColor: ThemeColors.blue + "15",
    borderRadius: ThemeRadius.sm,
  },
  invoiceId: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    flexShrink: 1,
  },
  cardBodyCompact: {
    gap: 4,
    marginBottom: ThemeSpacing.md,
  },
  customerWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  customerNameCompact: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    flex: 1,
  },
  invoiceDate: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginLeft: 26, // align with text past iconBox
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginBottom: ThemeSpacing.md,
  },
  cardFooterCompact: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  totalLabel: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    flexShrink: 1,
  },
  grandTotal: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    flexShrink: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: ThemeSpacing.sm,
    width: "100%",
  },
  emptyTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginTop: ThemeSpacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  sectionContainer: {
    flex: 1,
    marginBottom: ThemeSpacing.xl,
  },
  sectionHeader: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.sm,
  },
  horizontalScrollContent: {
    flexGrow: 1,
    paddingRight: ThemeSpacing.lg,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
  },
  horizontalColumn: {
    gap: ThemeSpacing.md,
    flexDirection: "column",
  },
  tabControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
    flex: 1,
    justifyContent: "flex-end",
  },
  viewToggleWrap: {
    flexDirection: "row",
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    padding: 2,
  },
  viewToggleBtn: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.sm - 2,
  },
  viewToggleBtnActive: {
    backgroundColor: ThemeColors.emerald + "15",
  },
  tableContainer: {
    width: "100%",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    paddingBottom: ThemeSpacing.lg,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    backgroundColor: ThemeColors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
    alignItems: "center",
  },
  col: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: ThemeSpacing.lg,
    marginTop: ThemeSpacing.md,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
    flexWrap: "wrap",
    gap: ThemeSpacing.md,
  },
  paginationSummary: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pageArrowBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  pageArrowBtnDisabled: {
    backgroundColor: ThemeColors.bg,
    borderColor: ThemeColors.borderSubtle,
  },
  pageNumberBtn: {
    minWidth: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ThemeRadius.md,
    backgroundColor: "transparent",
    paddingHorizontal: 8,
  },
  pageNumberBtnActive: {
    backgroundColor: ThemeColors.emerald,
  },
  pageNumberText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    fontWeight: "500",
  },
  pageNumberTextActive: {
    color: ThemeColors.white,
    fontWeight: "600",
  },
  pageEllipsis: {
    fontSize: 14,
    color: ThemeColors.textMuted,
    paddingHorizontal: 4,
  },
});
