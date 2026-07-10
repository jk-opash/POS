import { BulkActionModal } from "@/components/menu/BulkActionModal";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuEmptyState } from "@/components/menu/MenuEmptyState";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { MenuItemWizardModal } from "@/components/menu/MenuItemWizardModal";
import { Text } from "@/components/ui/Text";
import { MENU_STATUS } from "@/constants/menu";
import { useMenu } from "@/context/MenuContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { CheckSquare, Plus } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function MenuScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isWizardVisible, setIsWizardVisible] = useState(false);
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const { menuItems, deleteMenuItem, addMenuItem, updateMenuItem } = useMenu();

  const navigation = useNavigation();
  const { isDesktop, isTablet, isMiniTab, width } = useResponsive();

  const numColumns = isDesktop ? 6 : isTablet ? 4 : isMiniTab ? 3 : 2;

  const sidebarW = isDesktop ? 250 : 0;
  const listPadding = ThemeSpacing.lg * 2;
  const totalGap = ThemeSpacing.md * (numColumns - 1);
  const availableWidth = width - sidebarW - listPadding - totalGap;
  const cardWidth = Math.floor(availableWidth / numColumns);

  const filteredMenu = menuItems
    .filter((p) => {
      if (activeFilter !== "All" && p.category !== activeFilter) return false;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.barcode &&
          p.barcode.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    })
    .map((p) => ({
      ...p,
      onDelete: deleteMenuItem,
    }));

  const handleMenuItemPress = (menuItem) => {
    if (isSelectMode) {
      setSelectedIds((prev) =>
        prev.includes(menuItem.id)
          ? prev.filter((id) => id !== menuItem.id)
          : [...prev, menuItem.id],
      );
    } else {
      setSelectedMenuItem(menuItem);
      // Future: Open details/edit modal
    }
  };

  const handleBarcodeScan = () => {
    if (!searchQuery) return;
    const match = menuItems.find(
      (p) => p.barcode === searchQuery || p.sku === searchQuery,
    );
    if (match) {
      setEditingMenuItem(match);
      setIsWizardVisible(true);
      setSearchQuery(""); // Clear search after opening
    }
  };
  const handleToggleStatus = (menuItem) => {
    updateMenuItem(menuItem.id, {
      status: menuItem.status === MENU_STATUS.ACTIVE ? MENU_STATUS.INACTIVE : MENU_STATUS.ACTIVE
    });
  };

  const handleSaveMenuItem = (data) => {
    if (editingMenuItem) {
      updateMenuItem(editingMenuItem.id, {
        name: data.name,
        category: data.category,
        description: data.description,
        dietary: data.dietary,
        status: data.status,
        pricing: {
          sellingPrice: parseFloat(data.sellingPrice) || 0,
          costPrice: parseFloat(data.costPrice) || 0,
        },
        tax: data.tax
          ? {
              category: data.tax.split(" ")[0] || "GST",
              percentage: parseFloat(data.tax.split(" ")[1]) || 0,
              included: true,
            }
          : undefined,
        preparationTime: data.preparationTime,
        addons: data.addons.filter(a => a.trim() !== ""),
        image: data.image,
      });
    } else {
      addMenuItem({
        id: `M-${Math.floor(Math.random() * 10000)}`,
        name: data.name,
        category: data.category,
        description: data.description,
        dietary: data.dietary,
        status: data.status || "Active",
        pricing: {
          sellingPrice: parseFloat(data.sellingPrice) || 0,
          costPrice: parseFloat(data.costPrice) || 0,
        },
        tax: data.tax
          ? {
              category: data.tax.split(" ")[0] || "GST",
              percentage: parseFloat(data.tax.split(" ")[1]) || 0,
              included: true,
            }
          : undefined,
        preparationTime: data.preparationTime,
        addons: data.addons.filter(a => a.trim() !== ""),
        image: data.image,
      });
    }
  };

  return (
    <View style={styles.root}>
      <MenuHeader
        isDesktop={isDesktop}
        isSelectMode={isSelectMode}
        setIsSelectMode={setIsSelectMode}
        setSelectedIds={setSelectedIds}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleBarcodeScan={handleBarcodeScan}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        onNewPress={() => {
          setEditingMenuItem(null);
          setIsWizardVisible(true);
        }}
      />

      {/* ── Menu Grid ──────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.cardWrapper,
                  {
                    width: numColumns === 1 ? "100%" : cardWidth,
                    position: "relative",
                  },
                ]}
              >
                <MenuItemCard
                  menuItem={item}
                  isList={numColumns === 1}
                  onPress={handleMenuItemPress}
                  onEdit={(menuItem) => {
                    setEditingMenuItem(menuItem);
                    setIsWizardVisible(true);
                  }}
                  onToggleStatus={handleToggleStatus}
                />
                {isSelectMode && (
                  <View
                    style={[
                      styles.selectOverlay,
                      selectedIds.includes(item.id) &&
                        styles.selectOverlayActive,
                    ]}
                    pointerEvents="none"
                  >
                    {selectedIds.includes(item.id) && (
                      <CheckSquare size={24} color={ThemeColors.emerald} />
                    )}
                  </View>
                )}
              </View>
            ))
          ) : (
            <MenuEmptyState />
          )}
        </View>
      </ScrollView>

      <MenuItemWizardModal
        visible={isWizardVisible}
        onClose={() => setIsWizardVisible(false)}
        initialData={editingMenuItem}
        onSave={handleSaveMenuItem}
      />

      {isSelectMode && selectedIds.length > 0 && (
        <View style={styles.bulkActionBar}>
          <Text weight="bold" style={styles.bulkActionText}>
            {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""}{" "}
            selected
          </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => setIsBulkModalVisible(true)}
          >
            <Text weight="bold" style={styles.btnPrimaryText}>
              Bulk Edit
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <BulkActionModal
        visible={isBulkModalVisible}
        onClose={() => setIsBulkModalVisible(false)}
        selectedIds={selectedIds}
        onClearSelection={() => {
          setSelectedIds([]);
          setIsSelectMode(false);
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => {
          setEditingMenuItem(null);
          setIsWizardVisible(true);
        }}
      >
        <Plus size={20} color={ThemeColors.white} />
        <Text style={styles.fabText}>Add MenuItem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.emerald,
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
  },
  btnPrimaryText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
  scrollContent: {
    padding: ThemeSpacing.lg,
    paddingBottom: 100,
    flexGrow: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeSpacing.md,
  },
  cardWrapper: {
    flexShrink: 0,
    flexDirection: "column",
  },
  selectOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: ThemeRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
  },
  selectOverlayActive: {
    opacity: 1,
    backgroundColor: ThemeColors.emeraldDim + "80",
    borderWidth: 2,
    borderColor: ThemeColors.emerald,
  },
  bulkActionBar: {
    position: "absolute",
    bottom: ThemeSpacing.xl,
    left: "50%",
    transform: [{ translateX: -150 }],
    width: 300,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: ThemeSpacing.sm,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  bulkActionText: {
    color: ThemeColors.textPrimary,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    right: ThemeSpacing.xl,
    bottom: ThemeSpacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.textPrimary,
    paddingHorizontal: ThemeSpacing.xl,
    paddingVertical: 14,
    borderRadius: 100,
    shadowColor: ThemeColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 100,
  },
  fabText: {
    color: ThemeColors.white,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
