import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Menu, ScanLine } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import { SearchWithFilter } from "@/components/ui/SearchWithFilter";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";

export function POSHeader({
  isDesktop,
  onMenuPress,
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onFilterChange,
  isRetail,
  isScannerConnected,
  onSimulateScan,
}) {
  return (
    <SafeAreaView edges={["top"]} style={styles.headerSafe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {!isDesktop && (
            <TouchableOpacity onPress={onMenuPress} style={styles.menuBtn}>
              <Menu size={24} color={ThemeColors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.pageTitle}>POS Billing</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifBtn}>
            <Bell size={24} color={ThemeColors.textSecondary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.toolbarRow}>
        <SearchWithFilter
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          filterOptions={categories.map((c) => ({ label: c, value: c }))}
          activeFilter={activeCategory}
          onFilterChange={onFilterChange}
          placeholder="Search products by name, SKU or barcode..."
        />
        {isRetail && (
          <TouchableOpacity
            style={styles.barcodeScanBtn}
            onPress={onSimulateScan}
          >
            <ScanLine
              size={20}
              color={
                isScannerConnected ? ThemeColors.emerald : ThemeColors.primary
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: ThemeColors.surface,
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
    zIndex: 100,
    elevation: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingVertical: ThemeSpacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  menuBtn: {
    padding: 4,
  },
  pageTitle: {
    fontSize: 26,
    color: ThemeColors.textPrimary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.lg,
  },
  notifBtn: { position: "relative", padding: 4 },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ThemeColors.red,
    borderWidth: 1.5,
    borderColor: ThemeColors.surface,
  },
  barcodeScanBtn: {
    padding: 10,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.xxl,
    paddingBottom: ThemeSpacing.md,
    gap: ThemeSpacing.md,
    flexWrap: "wrap",
    zIndex: 999,
  },
});
