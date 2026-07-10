import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Minus, Plus, Trash2, User } from "lucide-react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";

export function CartItem({
  item,
  onUpdateQuantity,
  onVoidItem,
  onAssignStaff,
}) {
  const price = item.product.pricing?.sellingPrice || 0;
  const itemTotal = price * item.quantity;

  return (
    <View style={styles.cartItem}>
      <View style={styles.cartItemRow}>
        <View style={styles.cartItemInfo}>
          <Text weight="bold" style={styles.cartItemName} numberOfLines={1}>
            {item.product.name}
          </Text>
          <Text style={styles.cartItemPrice}>
            ₹{price.toFixed(2)} x {item.quantity}
          </Text>
        </View>

        <View style={styles.cartItemControls}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
          >
            <Minus size={14} color={ThemeColors.textPrimary} />
          </TouchableOpacity>
          <Text weight="bold" style={styles.qtyText}>
            {item.quantity}
          </Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          >
            <Plus size={14} color={ThemeColors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.cartItemTotal}>
          <Text weight="bold" style={styles.cartItemTotalText}>
            ₹{itemTotal.toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={() => onVoidItem(item.product.id)}
            style={styles.deleteBtn}
          >
            <Trash2 size={16} color={ThemeColors.red} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Optional: Service Employee Assignment */}
      {item.product.type === "Service" && (
        <TouchableOpacity
          style={styles.assignStaffBtn}
          onPress={() => onAssignStaff(item.product.id)}
        >
          <User
            size={12}
            color={
              item.employee ? ThemeColors.emerald : ThemeColors.textSecondary
            }
          />
          <Text
            style={[
              styles.assignStaffText,
              item.employee && { color: ThemeColors.emerald },
            ]}
          >
            {item.employee
              ? `Assigned: ${item.employee.firstName}`
              : "Assign Staff"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    padding: ThemeSpacing.md,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.md,
    gap: ThemeSpacing.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  cartItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
    fontWeight: "600",
  },
  cartItemPrice: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  cartItemControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.full,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  qtyBtn: {
    padding: 8,
  },
  qtyText: {
    fontSize: 14,
    width: 20,
    textAlign: "center",
  },
  cartItemTotal: {
    alignItems: "flex-end",
    gap: 4,
    minWidth: 60,
  },
  cartItemTotalText: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  deleteBtn: {
    padding: 4,
  },
  assignStaffBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    backgroundColor: ThemeColors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.sm,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  assignStaffText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    fontWeight: "500",
  },
});
