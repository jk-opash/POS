import { Text } from "@/components/ui/Text";
import { PRODUCT_STATUS } from "@/constants/products";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Edit2, Package, Trash2 } from "lucide-react-native";
import { Alert, Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export function ProductCard({ product, onPress, onEdit, isList }) {
  const isOutOfStock =
    product.inventory?.tracked && product.inventory?.available <= 0;
  const isLowStock =
    product.inventory?.tracked &&
    product.inventory?.available <= (product.inventory?.reorderLevel || 10);

  const getStatusStyle = () => {
    switch (product.status) {
      case PRODUCT_STATUS.ACTIVE:
        return { bg: ThemeColors.emeraldDim, text: ThemeColors.emerald };
      case PRODUCT_STATUS.DRAFT:
        return { bg: ThemeColors.amberDim, text: ThemeColors.amber };
      case PRODUCT_STATUS.INACTIVE:
        return { bg: ThemeColors.redDim, text: ThemeColors.red };
      default:
        return { bg: ThemeColors.borderSubtle, text: ThemeColors.textSecondary };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isList && styles.cardList]}
      activeOpacity={0.8}
      onPress={() => onPress && onPress(product)}
    >
      <View
        style={[styles.imageContainer, isList && styles.imageContainerList]}
      >
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Package size={32} color={ThemeColors.textMuted} />
          </View>
        )}

        <View
          style={[styles.statusBadge, { backgroundColor: getStatusStyle().bg }]}
        >
          <Text
            weight="bold"
            style={[styles.statusText, { color: getStatusStyle().text }]}
          >
            {product.status}
          </Text>
        </View>
      </View>

      <View style={[styles.content, isList && styles.contentList]}>
        <View style={[styles.header, isList && { flex: 3 }]}>
          <View style={{ flex: 1 }}>
            <Text weight="bold" style={styles.name} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.sku} numberOfLines={1}>
              {product.sku || product.type}
            </Text>
          </View>

          {!isList && (
            <View style={{ flexDirection: "row", gap: 4 }}>
                <TouchableOpacity
                  style={styles.menuBtn}
                  onPress={() => {
                    if (Platform.OS === "web") {
                      if (window.confirm("Are you sure you want to delete this product?")) {
                        product.onDelete && product.onDelete(product.id);
                      }
                    } else {
                      Alert.alert(
                        "Delete Product",
                        "Are you sure you want to delete this product?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            onPress: () =>
                              product.onDelete && product.onDelete(product.id),
                            style: "destructive",
                          },
                        ],
                      );
                    }
                  }}
                >
                  <Trash2 size={16} color={ThemeColors.red} />
                </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => onEdit && onEdit(product)}
              >
                <Edit2 size={16} color={ThemeColors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!isList && <View style={styles.divider} />}

        <View style={[styles.footer, isList && styles.footerList]}>
          <View
            style={[
              styles.priceWrap,
              isList && {
                flex: 2,
                alignItems: "center",
                flexDirection: "row",
                gap: ThemeSpacing.md,
              },
            ]}
          >
            <Text
              weight="extrabold"
              style={[styles.price, isList && { marginBottom: 0 }]}
            >
              ₹{product.pricing.sellingPrice.toFixed(2)}
            </Text>
            <Text style={styles.category}>{product.category}</Text>
          </View>

          <View
            style={[
              styles.stockWrap,
              isList && { flex: 2, alignItems: "flex-start" },
            ]}
          >
            {product.inventory?.tracked ? (
              <View
                style={
                  isList
                    ? { flexDirection: "row", alignItems: "baseline", gap: 4 }
                    : {}
                }
              >
                <Text
                  weight="bold"
                  style={[
                    styles.stockValue,
                    isOutOfStock
                      ? { color: ThemeColors.red }
                      : isLowStock
                        ? { color: ThemeColors.amber }
                        : { color: ThemeColors.emerald },
                  ]}
                >
                  {product.inventory.available}
                </Text>
                <Text style={styles.stockLabel}>in stock</Text>
              </View>
            ) : (
              <Text style={styles.stockLabel}>{product.type}</Text>
            )}
          </View>

          {isList && (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: ThemeSpacing.md,
              }}
            >
                <TouchableOpacity
                  style={styles.menuBtn}
                  onPress={() => {
                    if (Platform.OS === "web") {
                      if (window.confirm("Are you sure you want to delete this product?")) {
                        product.onDelete && product.onDelete(product.id);
                      }
                    } else {
                      Alert.alert(
                        "Delete Product",
                        "Are you sure you want to delete this product?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            onPress: () =>
                              product.onDelete && product.onDelete(product.id),
                            style: "destructive",
                          },
                        ],
                      );
                    }
                  }}
                >
                  <Trash2 size={20} color={ThemeColors.red} />
                </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => onEdit && onEdit(product)}
              >
                <Edit2 size={20} color={ThemeColors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  cardList: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    height: 160,
    backgroundColor: ThemeColors.bg,
    position: "relative",
  },
  imageContainerList: {
    height: 135,
    width: 100,
    borderRightWidth: 1,
    borderRightColor: ThemeColors.border,
    backgroundColor: ThemeColors.surfaceElevated,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    position: "absolute",
    top: ThemeSpacing.sm,
    right: ThemeSpacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ThemeRadius.md,
  },
  statusText: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    padding: ThemeSpacing.lg,
    flex: 1,
  },
  contentList: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  sku: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  menuBtn: {
    padding: 4,
    marginRight: -4,
  },
  divider: {
    height: 1,
    backgroundColor: ThemeColors.borderSubtle,
    marginVertical: ThemeSpacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerList: {
    flex: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ThemeSpacing.md,
  },
  priceWrap: {
    flex: 1,
  },
  price: {
    fontSize: 18,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  stockWrap: {
    alignItems: "flex-end",
  },
  stockValue: {
    fontSize: 16,
  },
  stockLabel: {
    fontSize: 11,
    color: ThemeColors.textMuted,
  },
});
