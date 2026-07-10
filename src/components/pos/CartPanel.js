import { Dropdown } from "@/components/ui/Dropdown";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  CreditCard,
  PauseCircle,
  Percent,
  ShoppingCart,
  Utensils,
} from "lucide-react-native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { CartItem } from "./CartItem";

export function CartPanel({
  isSmallScreen,
  cart,
  activeTable,
  tables = [],
  onSelectTable,
  orderType,
  onOrderTypeChange,
  totals,
  parkedSales,
  taxRate,
  onCloseCart,
  onVoidEntireCart,
  onViewParkedSales,
  onUpdateQuantity,
  onVoidItem,
  onAssignStaff,
  onDiscount,
  onParkSale,
  onSendToKitchen,
  onCheckout,
}) {
  return (
    <View style={[styles.rightPanel, isSmallScreen && styles.rightPanelMobile]}>
      {isSmallScreen && (
        <View style={styles.mobileCartHeader}>
          <Text weight="bold" style={styles.mobileCartTitle}>
            Your Cart
          </Text>
          <TouchableOpacity onPress={onCloseCart} style={styles.closeCartBtn}>
            <Text style={styles.closeCartBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cart Header */}
      <View style={styles.cartHeader}>
        {orderType === "Dine In" && (
          <View>
            <Dropdown
              options={tables.map((t) => ({
                label: `Table ${t.name}`,
                value: t.id,
              }))}
              value={activeTable?.id}
              onChange={(tableId) => {
                const table = tables.find((t) => t.id === tableId);
                if (onSelectTable) onSelectTable(table);
              }}
              placeholder="Select Table..."
            />
          </View>
        )}
        <View style={styles.orderTypeRow}>
          <View
            style={{
              flexDirection: "row",
              gap: ThemeSpacing.sm,
              alignItems: "center",
            }}
          >
            <View style={styles.orderTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.orderTypeBtn,
                  orderType === "Takeaway" && styles.orderTypeBtnActive,
                ]}
                onPress={() => onOrderTypeChange?.("Takeaway")}
              >
                <Text
                  weight="bold"
                  style={[
                    styles.orderTypeText,
                    orderType === "Takeaway" && styles.orderTypeTextActive,
                  ]}
                >
                  Takeaway
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.orderTypeBtn,
                  orderType === "Dine In" && styles.orderTypeBtnActive,
                ]}
                onPress={() => onOrderTypeChange?.("Dine In")}
              >
                <Text
                  weight="bold"
                  style={[
                    styles.orderTypeText,
                    orderType === "Dine In" && styles.orderTypeTextActive,
                  ]}
                >
                  Dine In
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.viewTabsBtnInline}
              onPress={onViewParkedSales}
            >
              <Text style={styles.viewTabsText}>
                Parked ({parkedSales?.length || 0})
              </Text>
            </TouchableOpacity>
          </View>

          {cart.length > 0 && (
            <TouchableOpacity
              onPress={onVoidEntireCart}
              style={styles.clearBtn}
            >
              <Text weight="semibold" style={styles.clearBtnText}>
                Clear
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <ShoppingCart size={48} color={ThemeColors.border} />
          <Text style={styles.emptyCartText}>Cart is empty</Text>
          <Text style={styles.emptyCartSub}>Add items to begin</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.product.id}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onVoidItem={onVoidItem}
              onAssignStaff={onAssignStaff}
            />
          )}
          contentContainerStyle={styles.cartList}
        />
      )}

      {/* Cart Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text weight="semibold" style={styles.totalValue}>
            ₹{totals.subtotal.toFixed(2)}
          </Text>
        </View>

        {totals.discountAmount > 0 && (
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: ThemeColors.emerald }]}>
              Discount
            </Text>
            <Text
              weight="semibold"
              style={[styles.totalValue, { color: ThemeColors.emerald }]}
            >
              -₹{totals.discountAmount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tax ({taxRate}%)</Text>
          <Text weight="semibold" style={styles.totalValue}>
            ₹{totals.taxAmount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text weight="bold" style={styles.grandTotalLabel}>
            Total
          </Text>
          <Text weight="bold" style={styles.grandTotalValue}>
            ₹{totals.grandTotal.toFixed(2)}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={onDiscount}>
              <Percent size={18} color={ThemeColors.textPrimary} />
              <Text weight="semibold" style={styles.actionBtnText}>
                Discount
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: ThemeColors.blueDim,
                  borderColor: ThemeColors.blueDim,
                },
              ]}
              onPress={onParkSale}
            >
              <PauseCircle size={18} color={ThemeColors.blue} />
              <Text
                weight="semibold"
                style={[styles.actionBtnText, { color: ThemeColors.blue }]}
              >
                Park Sale
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  backgroundColor: ThemeColors.emeraldDim,
                  borderColor: ThemeColors.emeraldDim,
                },
              ]}
              onPress={onSendToKitchen}
            >
              <Utensils size={18} color={ThemeColors.emerald} />
              <Text
                weight="semibold"
                style={[styles.actionBtnText, { color: ThemeColors.emerald }]}
              >
                To Kitchen
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.payBtn, cart.length === 0 && styles.payBtnDisabled]}
          disabled={cart.length === 0}
          onPress={onCheckout}
        >
          <CreditCard size={20} color={ThemeColors.white} />
          <Text weight="bold" style={styles.payBtnText}>
            Pay ₹{totals.grandTotal.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rightPanel: {
    flex: 1,
    minWidth: 350,
    backgroundColor: ThemeColors.surface,
    borderLeftWidth: 1,
    borderLeftColor: ThemeColors.border,
    flexDirection: "column",
  },
  rightPanelMobile: {
    flex: 1,
    borderLeftWidth: 0,
    minWidth: "100%",
  },
  mobileCartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  mobileCartTitle: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  closeCartBtn: {
    padding: 8,
  },
  closeCartBtnText: {
    fontSize: 16,
    color: ThemeColors.emerald,
  },
  cartHeader: {
    padding: ThemeSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    gap: ThemeSpacing.md,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  customerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ThemeColors.blueDim,
    alignItems: "center",
    justifyContent: "center",
  },
  customerInfoWrap: {
    flex: 1,
  },
  pointsBadgeSmall: {
    backgroundColor: ThemeColors.amberDim,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ThemeRadius.sm,
  },
  pointsBadgeSmallText: {
    fontSize: 12,
    color: ThemeColors.amber,
    fontWeight: "bold",
  },
  customerName: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
    fontWeight: "bold",
  },
  customerSub: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  customerNotesPreview: {
    fontSize: 12,
    color: ThemeColors.emerald,
    marginTop: 2,
    fontStyle: "italic",
  },
  orderTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: ThemeSpacing.sm,
  },
  orderTypeContainer: {
    flexDirection: "row",
    backgroundColor: ThemeColors.borderSubtle,
    borderRadius: ThemeRadius.md,
    padding: 2,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  orderTypeBtn: {
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 6,
    borderRadius: ThemeRadius.md - 2,
  },
  orderTypeBtnActive: {
    backgroundColor: ThemeColors.surface,
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderTypeText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    fontWeight: "600",
  },
  orderTypeTextActive: {
    color: ThemeColors.textPrimary,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    color: ThemeColors.red,
    fontSize: 13,
    fontWeight: "600",
  },
  viewTabsBtnInline: {
    backgroundColor: ThemeColors.surface,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 6,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  viewTabsText: {
    fontSize: 13,
    color: ThemeColors.blue,
    fontWeight: "bold",
  },
  emptyCart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: ThemeSpacing.sm,
  },
  emptyCartText: {
    fontSize: 18,
    color: ThemeColors.textSecondary,
    fontWeight: "bold",
  },
  emptyCartSub: {
    fontSize: 14,
    color: ThemeColors.textMuted,
  },
  cartList: {
    padding: ThemeSpacing.md,
    gap: ThemeSpacing.sm,
  },
  totalsContainer: {
    padding: ThemeSpacing.lg,
    backgroundColor: ThemeColors.surface,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ThemeSpacing.sm,
  },
  totalLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.border,
    marginVertical: ThemeSpacing.sm,
  },
  grandTotalLabel: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
  },
  grandTotalValue: {
    fontSize: 22,
    color: ThemeColors.emerald,
  },
  actionButtonsContainer: {
    gap: ThemeSpacing.sm,
    marginTop: ThemeSpacing.md,
    marginBottom: ThemeSpacing.md,
  },
  actionRow: {
    flexDirection: "row",
    gap: ThemeSpacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: ThemeColors.surface,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  actionBtnText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: ThemeSpacing.md,
    backgroundColor: ThemeColors.emerald,
    paddingVertical: 16,
    borderRadius: ThemeRadius.md,
    shadowColor: ThemeColors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtnDisabled: {
    backgroundColor: ThemeColors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  payBtnText: {
    fontSize: 18,
    color: ThemeColors.white,
  },
});
