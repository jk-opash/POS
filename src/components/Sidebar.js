import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useBranches } from "@/context/BranchesContext";
import { useState } from "react";
import { usePathname, useRouter } from "expo-router";
import {
  BellRing,
  Boxes,
  ChevronRight,
  Clock,
  FileText,
  Home,
  LayoutGrid,
  MapPin,
  MonitorPlay,
  Package,
  PieChart,
  Receipt,
  Settings,
  Store,
  Truck,
  Users,
  Utensils,
  X,
  Check
} from "lucide-react-native";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Grouped menu structure ──────────────────────────────────────────────
const MENU_SECTIONS = [
  {
    title: null, // No header for top section
    items: [
      { key: "home", label: "Dashboard", Icon: Home },
      { key: "orders", label: "Orders", Icon: FileText },
      { key: "tables", label: "Tables", Icon: LayoutGrid },
      { key: "pos", label: "POS Billing", Icon: Store },
      { key: "kds", label: "Kitchen Display", Icon: MonitorPlay },
      { key: "waiter", label: "Wait Staff", Icon: BellRing },
      { key: "menu", label: "Menu Items", Icon: Utensils },
      { key: "products", label: "Products", Icon: Package },
      { key: "inventory", label: "Inventory", Icon: Boxes },
      { key: "invoices", label: "Invoices", Icon: Receipt },
      { key: "staff", label: "Staff", Icon: Users },
      { key: "suppliers", label: "Suppliers", Icon: Truck },
      { key: "time", label: "Time Tracker", Icon: Clock },
      { key: "branches", label: "Branches", Icon: MapPin },
      { key: "reports", label: "Reports", Icon: PieChart },
    ],
  },
];

// Flat list of all keys for collapsed view
const ALL_ITEMS = MENU_SECTIONS.flatMap((s) => s.items);

export function Sidebar({ isCollapsed }) {
  const router = useRouter();
  const pathname = usePathname();
  const { branches, activeBranch, setActiveBranch } = useBranches();
  const [showBranchModal, setShowBranchModal] = useState(false);

  const routeMap = {
    home: "/",
    time: "/time",
    orders: "/orders",
    products: "/products",
    menu: "/menu",
    tables: "/tables",
    kds: "/kds",
    waiter: "/waiter",
    inventory: "/inventory",
    invoices: "/invoices",
    staff: "/staff",
    pos: "/pos",
    suppliers: "/suppliers",
    branches: "/branches",
    reports: "/reports",
    settings: "/settings",
  };

  const getActiveKey = () => {
    if (pathname === "/" || pathname === "/index") return "home";
    if (pathname?.startsWith("/time")) return "time";
    if (pathname === "/orders") return "orders";
    if (pathname?.startsWith("/products")) return "products";
    if (pathname?.startsWith("/menu")) return "menu";
    if (pathname?.startsWith("/tables")) return "tables";
    if (pathname?.startsWith("/kds")) return "kds";
    if (pathname?.startsWith("/waiter")) return "waiter";
    if (pathname?.startsWith("/inventory")) return "inventory";
    if (pathname?.startsWith("/invoices")) return "invoices";
    if (pathname?.startsWith("/staff")) return "staff";
    if (pathname?.startsWith("/pos")) return "pos";
    if (pathname?.startsWith("/suppliers")) return "suppliers";
    if (pathname?.startsWith("/branches")) return "branches";
    if (pathname?.startsWith("/reports")) return "reports";
    if (pathname?.startsWith("/settings")) return "settings";
    return "home";
  };

  const activeItem = getActiveKey();

  const handleNavigate = (key) => {
    const route = routeMap[key] || "/";
    router.push(route);
  };

  // ── Render a single menu item ─────────────────────────────────────
  const renderItem = (item, isActive) => (
    <TouchableOpacity
      key={item.key}
      style={[
        styles.menuItem,
        isActive && styles.menuItemActive,
        isCollapsed && styles.menuItemCollapsed,
      ]}
      onPress={() => handleNavigate(item.key)}
      activeOpacity={0.7}
    >
      <item.Icon
        size={18}
        color={isActive ? ThemeColors.emerald : ThemeColors.textMuted}
        strokeWidth={isActive ? 2.2 : 1.8}
      />
      {!isCollapsed && (
        <Text
          weight={isActive ? "semibold" : "regular"}
          style={[styles.menuLabel, isActive && styles.menuLabelActive]}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      )}
      {isActive && <ChevronRight size={14} color={ThemeColors.emerald} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, isCollapsed && styles.containerCollapsed]}
    >
      {/* ── Brand ───────────────────────────────── */}
      <View style={styles.brandSection}>
        <View style={styles.logoIcon}>
          <Store size={18} color={ThemeColors.white} strokeWidth={2.2} />
        </View>
        {!isCollapsed && (
          <Text weight="bold" style={styles.brandName} numberOfLines={1}>
            POS MANAGER
          </Text>
        )}
      </View>

      {/* ── Scrollable Menu ─────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.menuScroll}
        contentContainerStyle={styles.menuScrollContent}
      >
        {isCollapsed
          ? ALL_ITEMS.map((item) => renderItem(item, activeItem === item.key))
          : MENU_SECTIONS.map((section, sIndex) => (
              <View key={sIndex} style={styles.section}>
                {section.title && (
                  <Text weight="bold" style={styles.sectionTitle}>
                    {section.title}
                  </Text>
                )}
                {section.items.map((item) =>
                  renderItem(item, activeItem === item.key),
                )}
              </View>
            ))}
      </ScrollView>

      {/* ── Bottom: Settings ────────────────────── */}
      <View style={styles.bottomSection}>
        <View style={styles.profileCard}>
          {!isCollapsed && (
            <>
              <View style={styles.profileInfo}>
                <Text
                  weight="semibold"
                  style={styles.profileName}
                  numberOfLines={1}
                >
                  Mr. Admin
                </Text>
              </View>
              <ChevronRight size={14} color={ThemeColors.textMuted} />
            </>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.settingsBtn,
          ]}
          onPress={() => setShowBranchModal(true)}
          activeOpacity={0.7}
        >
          <MapPin
            size={18}
            color={ThemeColors.textMuted}
            strokeWidth={1.8}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.settingsBtn,
            activeItem === "settings" && styles.settingsBtnActive,
          ]}
          onPress={() => handleNavigate("settings")}
          activeOpacity={0.7}
        >
          <Settings
            size={18}
            color={
              activeItem === "settings"
                ? ThemeColors.white
                : ThemeColors.textMuted
            }
            strokeWidth={activeItem === "settings" ? 2.2 : 1.8}
          />
        </TouchableOpacity>
      </View>

      {/* ── Branch Selection Modal ────────────────────── */}
      <Modal visible={showBranchModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text weight="bold" style={styles.modalTitle}>
                Select Branch
              </Text>
              <TouchableOpacity onPress={() => setShowBranchModal(false)}>
                <X size={20} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.branchList}>
              {branches.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  style={[
                    styles.branchItem,
                    activeBranch === b.id && styles.branchItemActive,
                  ]}
                  onPress={() => {
                    setActiveBranch(b.id);
                    setShowBranchModal(false);
                  }}
                >
                  <View style={styles.branchInfo}>
                    <Text
                      weight={activeBranch === b.id ? "bold" : "medium"}
                      style={styles.branchName}
                    >
                      {b.name}
                    </Text>
                    <Text style={styles.branchCode}>{b.code}</Text>
                  </View>
                  {activeBranch === b.id && (
                    <Check size={18} color={ThemeColors.emerald} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: ThemeColors.primary,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    ...(Platform.OS === "web"
      ? { boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }
      : {
          shadowColor: ThemeColors.black,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          elevation: 20,
        }),
  },
  containerCollapsed: {
    width: "100%",
  },

  // ── Brand ─────────────────────────────
  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: ThemeColors.emerald,
    justifyContent: "center",
    alignItems: "center",
  },
  brandName: {
    color: ThemeColors.white,
    fontSize: 15,
    letterSpacing: 1.5,
  },

  // ── Sections ──────────────────────────
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    color: ThemeColors.textMuted,
    fontSize: 11,
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // ── Scrollable Area ───────────────────
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    paddingHorizontal: 8,
  },

  // ── Menu Item ─────────────────────────
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    gap: 12,
    marginVertical: 1,
  },
  menuItemCollapsed: {
    justifyContent: "center",
    paddingHorizontal: 0,
    width: 42,
    height: 42,
    alignSelf: "center",
    borderRadius: 12,
    gap: 0,
  },
  menuItemActive: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: ThemeColors.emerald,
    position: "absolute",
    left: 4,
  },

  // ── Labels ────────────────────────────
  menuLabel: {
    color: ThemeColors.textMuted,
    fontSize: 14,
    flex: 1,
  },
  menuLabelActive: {
    color: ThemeColors.white,
  },

  // ── Bottom Section ────────────────────
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    gap: 8,
  },

  // ── Profile Card ──────────────────────
  profileCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  profileAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: ThemeColors.emerald,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: ThemeColors.white,
    fontSize: 13,
  },
  profileRole: {
    color: ThemeColors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },

  // ── Settings Gear Button ──────────────
  settingsBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  settingsBtnActive: {
    backgroundColor: ThemeColors.emerald,
    borderColor: ThemeColors.emerald,
  },

  // ── Modal ─────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 320,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.md,
  },
  modalTitle: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  branchList: {
    maxHeight: 400,
  },
  branchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.bg,
    marginBottom: ThemeSpacing.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  branchItemActive: {
    borderColor: ThemeColors.emerald,
    backgroundColor: ThemeColors.emeraldDim,
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  branchCode: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
});
