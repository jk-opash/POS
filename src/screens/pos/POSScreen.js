import { CartPanel } from "@/components/pos/CartPanel";
import { DiscountModal } from "@/components/pos/DiscountModal";
import { EmployeeSelectionModal } from "@/components/pos/EmployeeSelectionModal";
import { FloatingCartBtn } from "@/components/pos/FloatingCartBtn";
import { MobileCartModal } from "@/components/pos/MobileCartModal";
import { ParkedSalesModal } from "@/components/pos/ParkedSalesModal";
import { POSCard } from "@/components/pos/POSCard";
import { POSHeader } from "@/components/pos/POSHeader";
import { useKDS } from "@/context/KDSContext";
import { useMenu } from "@/context/MenuContext";
import { useOrders } from "@/context/OrdersContext";
import { usePOS } from "@/context/POSContext";
import { useProducts } from "@/context/ProductsContext";
import { useSettings } from "@/context/SettingsContext";
import { useTables } from "@/context/TablesContext";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeSpacing } from "@/theme/theme";
import { useNavigation } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

export default function POSScreen() {
  const navigation = useNavigation();
  const { isDesktop, isTablet, isMiniTab, isMobile } = useResponsive();
  const isSmallScreen = isMobile || isMiniTab;
  const { products } = useProducts();
  const { menuItems } = useMenu();
  const {
    cart,
    customer,
    orderType,
    totals,
    addToCart,
    updateQuantity,
    assignEmployeeToItem,
    holdCart,
    parkedSales,
    activeTable,
    setActiveTable,
    parkSale,
    voidItem,
    voidEntireCart,
    setOrderType,
  } = usePOS();

  const { tables } = useTables();

  const { addOrderToKDS } = useKDS();
  const { addOrder } = useOrders();

  const { settings } = useSettings();
  const { isRetail } = settings.business.verticalFlags;

  // Combine F&B Menu Items and Products for display
  const combinedItems = useMemo(() => {
    return [...menuItems, ...products];
  }, [menuItems, products]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showParkedSales, setShowParkedSales] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState(null); // stores productId for employee assignment
  const [isCartVisible, setIsCartVisible] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const { isScannerConnected, simulateScan } = useBarcodeScanner((barcode) => {
    const matched = combinedItems.find(
      (p) => p.sku === barcode || (p.barcode && p.barcode === barcode),
    );
    if (matched) {
      handleAddToCart(matched);
    } else {
      alert(`No product found for barcode: ${barcode}`);
    }
  });

  const categories = ["All", ...new Set(combinedItems.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return combinedItems.filter((p) => {
      if (p.status !== "Active") return false;
      if (activeCategory !== "All" && p.category !== activeCategory)
        return false;
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [combinedItems, searchQuery, activeCategory]);

  const numColumns = isDesktop ? 4 : isTablet ? 2 : isMiniTab ? 3 : 2;

  const handleVoidItem = (productId) => {
    voidItem(productId, "Voided by user");
  };

  const handleSendToKitchen = () => {
    addOrderToKDS({
      cart,
      customer,
      activeTable,
      orderType,
      notes: "",
    });

    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    addOrder({
      id: orderId,
      customer: customer || { name: "Walk-in Customer", initials: "WC" },
      status: "In Progress",
      type: orderType,
      table: activeTable ? activeTable.name : null,
      date: new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: cart.map((c) => ({
        name: c.product.name,
        qty: c.quantity,
        price: c.product.pricing?.sellingPrice || c.product.price || 0,
      })),
      total: cart.reduce(
        (sum, item) =>
          sum +
          (item.product.pricing?.sellingPrice || item.product.price || 0) *
            item.quantity,
        0,
      ),
    });

    holdCart();
    if (isSmallScreen) setIsCartVisible(false);
  };

  return (
    <View style={styles.root}>
      <POSHeader
        isDesktop={isDesktop}
        onMenuPress={() => navigation.dispatch({ type: "TOGGLE_DRAWER" })}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        activeCategory={activeCategory}
        onFilterChange={setActiveCategory}
        isRetail={isRetail}
        isScannerConnected={isScannerConnected}
        onSimulateScan={() => simulateScan("SKU001")}
      />

      <View style={styles.container}>
        {/* Left Panel: Products */}
        <View style={styles.leftPanel}>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <POSCard
                product={item}
                inCart={cart.some((c) => c.product.id === item.id)}
                onAddToCart={handleAddToCart}
              />
            )}
            key={numColumns}
            numColumns={numColumns}
            contentContainerStyle={styles.productList}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Right Panel: Cart (Desktop/Tablet) */}
        {!isSmallScreen && (
          <CartPanel
            isSmallScreen={isSmallScreen}
            cart={cart}
            activeTable={activeTable}
            tables={tables}
            onSelectTable={setActiveTable}
            orderType={orderType}
            onOrderTypeChange={setOrderType}
            totals={totals}
            parkedSales={parkedSales}
            taxRate={usePOS().taxRate}
            onCloseCart={() => setIsCartVisible(false)}
            onVoidEntireCart={() => voidEntireCart("Voided cart")}
            onViewParkedSales={() => setShowParkedSales(true)}
            onUpdateQuantity={updateQuantity}
            onVoidItem={handleVoidItem}
            onAssignStaff={(id) => setSelectedServiceItem(id)}
            onDiscount={() => {
              if (isSmallScreen) setIsCartVisible(false);
              setShowDiscount(true);
            }}
            onParkSale={() => {
              if (cart.length === 0) {
                Alert.alert("Empty Cart", "Cannot park an empty sale.");
                return;
              }
              parkSale();
              Alert.alert(
                "Sale Parked",
                "The sale has been successfully parked.",
              );
            }}
            onSendToKitchen={handleSendToKitchen}
            onCheckout={() => {
              if (isSmallScreen) setIsCartVisible(false);
              setShowCheckout(true);
            }}
          />
        )}
      </View>

      {/* Floating Cart Button for Small Screens */}
      {isSmallScreen && !isCartVisible && (
        <FloatingCartBtn
          cartLength={cart.length}
          grandTotal={totals.grandTotal}
          onPress={() => setIsCartVisible(true)}
        />
      )}

      {/* Mobile Cart Modal */}
      {isSmallScreen && (
        <MobileCartModal
          visible={isCartVisible}
          isSmallScreen={isSmallScreen}
          cart={cart}
          activeTable={activeTable}
          tables={tables}
          onSelectTable={setActiveTable}
          orderType={orderType}
          onOrderTypeChange={setOrderType}
          totals={totals}
          parkedSales={parkedSales}
          taxRate={usePOS().taxRate}
          onCloseCart={() => setIsCartVisible(false)}
          onVoidEntireCart={() => voidEntireCart("Voided cart")}
          onViewParkedSales={() => setShowParkedSales(true)}
          onUpdateQuantity={updateQuantity}
          onVoidItem={handleVoidItem}
          onAssignStaff={(id) => setSelectedServiceItem(id)}
          onDiscount={() => {
            if (isSmallScreen) setIsCartVisible(false);
            setShowDiscount(true);
          }}
          onParkSale={() => {
            if (cart.length === 0) {
              Alert.alert("Empty Cart", "Cannot park an empty sale.");
              return;
            }
            parkSale();
            if (isSmallScreen) setIsCartVisible(false);
            Alert.alert(
              "Sale Parked",
              "The sale has been successfully parked.",
            );
          }}
          onSendToKitchen={handleSendToKitchen}
          onCheckout={() => {
            if (isSmallScreen) setIsCartVisible(false);
            setShowCheckout(true);
          }}
        />
      )}

      <DiscountModal
        visible={showDiscount}
        onClose={() => setShowDiscount(false)}
      />

      <ParkedSalesModal
        visible={showParkedSales}
        onClose={() => setShowParkedSales(false)}
      />
      <EmployeeSelectionModal
        visible={!!selectedServiceItem}
        onClose={() => setSelectedServiceItem(null)}
        selectedEmployeeId={
          selectedServiceItem
            ? cart.find((c) => c.product.id === selectedServiceItem)?.employee
                ?.id
            : null
        }
        onSelect={(emp) => {
          if (selectedServiceItem) {
            assignEmployeeToItem(selectedServiceItem, emp);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ThemeColors.bg,
  },
  container: {
    flex: 1,
    flexDirection: "row",
  },
  leftPanel: {
    flex: 5,
  },
  productList: {
    paddingHorizontal: ThemeSpacing.lg,
    paddingBottom: 100,
    paddingTop: ThemeSpacing.sm,
    gap: ThemeSpacing.md,
  },
  columnWrapper: {
    gap: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.xs,
  },
});
