import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { X, Percent, Banknote } from "lucide-react-native";
import { usePOS } from "@/context/POSContext";

export function DiscountModal({ visible, onClose }) {
  const { globalDiscount, setGlobalDiscount } = usePOS();
  
  // Local state for editing
  const [type, setType] = useState(globalDiscount.type === "none" ? "percentage" : globalDiscount.type);
  const [value, setValue] = useState(globalDiscount.value ? globalDiscount.value.toString() : "");

  const handleApply = () => {
    const val = parseFloat(value);
    if (!val || val <= 0) {
      setGlobalDiscount({ type: "none", value: 0 });
    } else {
      setGlobalDiscount({ type, value: val });
    }
    onClose();
  };

  const handleClear = () => {
    setGlobalDiscount({ type: "none", value: 0 });
    setValue("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.title}>Apply Discount</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === "percentage" && styles.typeBtnActive,
                ]}
                onPress={() => setType("percentage")}
              >
                <Percent size={18} color={type === "percentage" ? ThemeColors.emerald : ThemeColors.textSecondary} />
                <Text weight="semibold" style={[styles.typeText, type === "percentage" && styles.typeTextActive]}>
                  Percentage (%)
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === "fixed" && styles.typeBtnActive,
                ]}
                onPress={() => setType("fixed")}
              >
                <Banknote size={18} color={type === "fixed" ? ThemeColors.emerald : ThemeColors.textSecondary} />
                <Text weight="semibold" style={[styles.typeText, type === "fixed" && styles.typeTextActive]}>
                  Fixed (₹)
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text weight="medium" style={styles.inputLabel}>
                Discount Value
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={type === "percentage" ? "e.g., 10" : "e.g., 50"}
                placeholderTextColor={ThemeColors.textMuted}
                value={value}
                onChangeText={setValue}
                maxLength={type === "percentage" ? 3 : 6}
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                <Text weight="bold" style={styles.clearBtnText}>Remove Discount</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                <Text weight="bold" style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.xl,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 24, // Use larger standard title font
    color: ThemeColors.textPrimary,
  },
  closeBtn: {
    padding: ThemeSpacing.sm,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  body: {
    padding: ThemeSpacing.xl,
    gap: ThemeSpacing.xl,
  },
  typeSelector: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: ThemeSpacing.sm,
    paddingVertical: ThemeSpacing.md,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeBtnActive: {
    backgroundColor: ThemeColors.emeraldDim,
    borderColor: ThemeColors.emerald,
  },
  typeText: {
    fontSize: 16,
    color: ThemeColors.textSecondary,
  },
  typeTextActive: {
    color: ThemeColors.emerald,
  },
  inputContainer: {
    gap: ThemeSpacing.sm,
  },
  inputLabel: {
    fontSize: 15,
    color: ThemeColors.textSecondary,
  },
  input: {
    backgroundColor: ThemeColors.surface,
    borderWidth: 1.5,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.md,
    padding: ThemeSpacing.lg,
    fontSize: 24,
    color: ThemeColors.textPrimary,
    textAlign: "center",
    fontFamily: "Outfit_600SemiBold",
  },
  actions: {
    flexDirection: "row",
    gap: ThemeSpacing.md,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: ThemeSpacing.lg,
    backgroundColor: ThemeColors.redDim,
    borderRadius: ThemeRadius.md,
    alignItems: "center",
  },
  clearBtnText: {
    color: ThemeColors.red,
    fontSize: 16,
  },
  applyBtn: {
    flex: 1,
    paddingVertical: ThemeSpacing.lg,
    backgroundColor: ThemeColors.primary, // using primary brand color
    borderRadius: ThemeRadius.md,
    alignItems: "center",
    shadowColor: ThemeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  applyBtnText: {
    color: ThemeColors.surface,
    fontSize: 16,
  },
});
