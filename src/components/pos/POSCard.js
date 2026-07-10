import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function POSCard({ product, inCart, onAddToCart }) {
  const price = product.pricing?.sellingPrice || 0;

  return (
    <TouchableOpacity
      style={[styles.productCard, inCart && styles.productCardSelected]}
      onPress={() => onAddToCart(product)}
      activeOpacity={0.7}
    >
      <View style={styles.productInfo}>
        <Text weight="bold" style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text weight="bold" style={styles.productPrice}>
          ₹{price.toFixed(2)}
        </Text>
      </View>
      {inCart && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>In Cart</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: {
    flex: 1,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ThemeColors.border,
    padding: ThemeSpacing.xs,
  },
  productCardSelected: {
    borderColor: ThemeColors.emerald,
    backgroundColor: ThemeColors.emerald + "10",
  },
  selectedBadge: {
    position: "absolute",
    top: ThemeSpacing.xs,
    right: ThemeSpacing.xs,
    backgroundColor: ThemeColors.emerald,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ThemeRadius.sm,
  },
  selectedBadgeText: {
    fontSize: 10,
    color: ThemeColors.white,
    fontWeight: "bold",
  },
  productInfo: {
    padding: ThemeSpacing.md,
  },
  productName: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
    fontWeight: "600",
  },
  productCategory: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 15,
    color: ThemeColors.emerald,
    fontWeight: "bold",
  },
});
