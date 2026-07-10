import { Text } from "@/components/ui/Text";
import { useMenu } from "@/context/MenuContext";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function MenuItemWizardModal({ visible, onClose, onSave, initialData }) {
  const { isMobile, isMiniTab } = useResponsive();
  const { menuItems } = useMenu();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    dietary: "Veg",
    sellingPrice: "",
    costPrice: "",
    tax: "",
    preparationTime: "",
    addons: [],
    image: null,
    status: "Active",
  });

  const handleImageUpload = () => {
    // Mock image upload
    Alert.alert(
      "Upload Image",
      "In a real app, this would open the image picker.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mock Upload",
          onPress: () =>
            setFormData({ ...formData, image: "https://picsum.photos/200" }),
        },
      ],
    );
  };

  const STEPS = [
    "Basic Info",
    "Pricing",
    "Add-ons & Options",
  ];

  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          category: initialData.category || "",
          description: initialData.description || "",
          dietary: initialData.dietary || "Veg",
          sellingPrice: initialData.pricing?.sellingPrice?.toString() || "",
          costPrice: initialData.pricing?.costPrice?.toString() || "",
          tax: initialData.tax
            ? `${initialData.tax.category} ${initialData.tax.percentage}%`
            : "",
          preparationTime: initialData.preparationTime?.toString() || "",
          addons: initialData.addons || [],
          image: initialData.image || null,
          status: initialData.status || "Active",
        });
      } else {
        setFormData({
          name: "",
          category: "",
          description: "",
          dietary: "Veg",
          sellingPrice: "",
          costPrice: "",
          tax: "",
          preparationTime: "",
          addons: [],
          image: null,
          status: "Active",
        });
      }
    }
  }, [visible, initialData]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final Submit
      if (onSave) {
        onSave(formData);
      }
      onClose();
      setCurrentStep(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const modalWidth = isMobile || isMiniTab ? "100%" : 600;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isMobile || isMiniTab ? "slide" : "fade"}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { width: modalWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>
                {initialData ? "Edit Menu Item" : "Create New Menu Item"}
              </Text>
              <Text style={styles.subtitle}>
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Stepper Header */}
          <View style={styles.stepperWrap}>
            {STEPS.map((step, index) => (
              <View key={step} style={styles.stepIndicator}>
                <View
                  style={[
                    styles.stepDot,
                    index <= currentStep && styles.stepDotActive,
                  ]}
                >
                  {index < currentStep ? (
                    <CheckCircle2 size={12} color={ThemeColors.white} />
                  ) : (
                    <Text weight="bold" style={styles.stepNum}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepText,
                    index <= currentStep && styles.stepTextActive,
                  ]}
                >
                  {step}
                </Text>
                {index < STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      index < currentStep && styles.stepLineActive,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.content}
          >
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <View style={styles.stepContainer}>
                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>
                    Menu Item Name *
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Coca-Cola 500ml"
                    placeholderTextColor={ThemeColors.textMuted}
                    value={formData.name}
                    onChangeText={(val) =>
                      setFormData({ ...formData, name: val })
                    }
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text weight="semibold" style={styles.label}>
                      Category
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Main, Dessert"
                      placeholderTextColor={ThemeColors.textMuted}
                      value={formData.category}
                      onChangeText={(val) =>
                        setFormData({ ...formData, category: val })
                      }
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text weight="semibold" style={styles.label}>
                      Dietary Type
                    </Text>
                    <View style={styles.switchGroup}>
                      <Text style={styles.label}>
                        {formData.dietary === "Veg" ? "Veg" : "Non-Veg"}
                      </Text>
                      <Switch
                        value={formData.dietary === "Veg"}
                        onValueChange={(val) =>
                          setFormData({ ...formData, dietary: val ? "Veg" : "Non-Veg" })
                        }
                        trackColor={{ false: ThemeColors.border, true: ThemeColors.emerald }}
                      />
                    </View>
                  </View>
                </View>



                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>
                    Description
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter description..."
                    placeholderTextColor={ThemeColors.textMuted}
                    multiline
                    numberOfLines={4}
                    value={formData.description}
                    onChangeText={(val) =>
                      setFormData({ ...formData, description: val })
                    }
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>
                    Item Image
                  </Text>
                  <TouchableOpacity
                    style={styles.imageUpload}
                    onPress={handleImageUpload}
                  >
                    {formData.image ? (
                      <Image
                        source={{ uri: formData.image }}
                        style={{
                          width: "100%",
                          height: 100,
                          borderRadius: ThemeRadius.md,
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <>
                        <Upload size={24} color={ThemeColors.textSecondary} />
                        <Text style={styles.uploadText}>
                          Click to upload image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {formData.image && (
                    <TouchableOpacity
                      onPress={() => setFormData({ ...formData, image: null })}
                      style={{ marginTop: 8 }}
                    >
                      <Text style={{ color: ThemeColors.red, fontSize: 12 }}>
                        Remove Image
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Step 2: Pricing */}
            {currentStep === 1 && (
              <View style={styles.stepContainer}>
                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text weight="semibold" style={styles.label}>
                      Selling Price (₹) *
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      keyboardType="numeric"
                      placeholderTextColor={ThemeColors.textMuted}
                      value={formData.sellingPrice}
                      onChangeText={(val) =>
                        setFormData({ ...formData, sellingPrice: val })
                      }
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text weight="semibold" style={styles.label}>
                      Cost Price (₹)
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0.00"
                      keyboardType="numeric"
                      placeholderTextColor={ThemeColors.textMuted}
                      value={formData.costPrice}
                      onChangeText={(val) =>
                        setFormData({ ...formData, costPrice: val })
                      }
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>
                    Tax Setting
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. GST 5%"
                    placeholderTextColor={ThemeColors.textMuted}
                    value={formData.tax}
                    onChangeText={(val) =>
                      setFormData({ ...formData, tax: val })
                    }
                  />
                </View>
              </View>
            )}

            {/* Step 3: Add-ons & Options */}
            {currentStep === 2 && (
              <View style={styles.stepContainer}>
                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>
                    Preparation Time (minutes)
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 15"
                    keyboardType="numeric"
                    placeholderTextColor={ThemeColors.textMuted}
                    value={formData.preparationTime}
                    onChangeText={(val) =>
                      setFormData({ ...formData, preparationTime: val })
                    }
                  />
                </View>

                <View style={styles.ingredientsBuilder}>
                  <Text
                    weight="semibold"
                    style={{ fontSize: 16, color: ThemeColors.textPrimary }}
                  >
                    Add-ons & Modifiers
                  </Text>
                  <Text style={styles.hintText}>
                    Provide options for customers (e.g., Extra Cheese, No Onion).
                  </Text>

                  {formData.addons.map((addon, idx) => (
                    <View key={idx} style={styles.ingredientRow}>
                      <View
                        style={[
                          styles.formGroup,
                          { flex: 1, marginBottom: 0 },
                        ]}
                      >
                        <TextInput
                          style={[styles.input, { marginBottom: 0 }]}
                          placeholder="Add-on Name"
                          placeholderTextColor={ThemeColors.textMuted}
                          value={addon}
                          onChangeText={(val) => {
                            const newAddons = [...formData.addons];
                            newAddons[idx] = val;
                            setFormData({
                              ...formData,
                              addons: newAddons,
                            });
                          }}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          const newAddons = formData.addons.filter(
                            (_, i) => i !== idx,
                          );
                          setFormData({ ...formData, addons: newAddons });
                        }}
                        style={{ padding: ThemeSpacing.sm }}
                      >
                        <X size={20} color={ThemeColors.red} />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={[
                      styles.btnSecondary,
                      { alignSelf: "flex-start", marginTop: ThemeSpacing.md },
                    ]}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        addons: [...formData.addons, ""],
                      })
                    }
                  >
                    <Text weight="semibold" style={styles.btnSecondaryText}>
                      + Add Option
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.btnSecondary, currentStep === 0 && { opacity: 0 }]}
              onPress={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={18} color={ThemeColors.textPrimary} />
              <Text weight="bold" style={styles.btnSecondaryText}>
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
              <Text weight="bold" style={styles.btnPrimaryText}>
                {currentStep === STEPS.length - 1
                  ? initialData
                    ? "Save Changes"
                    : "Create Menu Item"
                  : "Next Step"}
              </Text>
              {currentStep < STEPS.length - 1 && (
                <ChevronRight size={18} color={ThemeColors.white} />
              )}
            </TouchableOpacity>
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
    padding: ThemeSpacing.md,
  },
  container: {
    backgroundColor: ThemeColors.surface,
    borderRadius: ThemeRadius.lg,
    maxHeight: "90%",
    overflow: "hidden",
    shadowColor: ThemeColors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: ThemeSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
  },
  title: {
    fontSize: 20,
    color: ThemeColors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
    marginTop: 4,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: ThemeColors.bg,
    borderRadius: 20,
  },
  stepperWrap: {
    flexDirection: "row",
    padding: ThemeSpacing.lg,
    paddingHorizontal: ThemeSpacing.xl,
    backgroundColor: ThemeColors.bg,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.borderSubtle,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ThemeColors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotActive: {
    backgroundColor: ThemeColors.emerald,
  },
  stepNum: {
    fontSize: 10,
    color: ThemeColors.textMuted,
  },
  stepText: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    marginLeft: 8,
  },
  stepTextActive: {
    color: ThemeColors.emerald,
    fontWeight: "bold",
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: ThemeColors.border,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: ThemeColors.emerald,
  },
  contentScroll: {
    flexShrink: 1,
  },
  content: {
    padding: ThemeSpacing.xl,
  },
  stepContainer: {
    gap: ThemeSpacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: ThemeSpacing.lg,
  },
  formGroup: {
    gap: ThemeSpacing.sm,
  },
  label: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  switchGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: ThemeColors.surfaceElevated,
    padding: ThemeSpacing.md,
    borderRadius: ThemeRadius.md,
  },
  hintText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
    marginTop: 2,
  },
  ingredientsBuilder: {
    gap: ThemeSpacing.md,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  variantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.sm,
    backgroundColor: ThemeColors.surfaceElevated,
    padding: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  hintText: {
    fontSize: 12,
    color: ThemeColors.textSecondary,
  },
  input: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderRadius: ThemeRadius.sm,
    paddingHorizontal: ThemeSpacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageUpload: {
    backgroundColor: ThemeColors.bg,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    borderStyle: "dashed",
    borderRadius: ThemeRadius.sm,
    padding: ThemeSpacing.xl,
    alignItems: "center",
    gap: ThemeSpacing.sm,
  },
  uploadText: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  infoBox: {
    backgroundColor: ThemeColors.emeraldDim,
    padding: ThemeSpacing.lg,
    borderRadius: ThemeRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: ThemeColors.emerald,
  },
  infoTitle: {
    color: ThemeColors.emerald,
    fontSize: 14,
    marginBottom: 4,
  },
  infoText: {
    color: ThemeColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: ThemeSpacing.xl,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.borderSubtle,
  },
  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.surface,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    gap: ThemeSpacing.sm,
  },
  btnSecondaryText: {
    color: ThemeColors.textPrimary,
    fontSize: 14,
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ThemeSpacing.lg,
    paddingVertical: 12,
    borderRadius: ThemeRadius.md,
    backgroundColor: ThemeColors.emerald,
    gap: ThemeSpacing.sm,
  },
  btnPrimaryText: {
    color: ThemeColors.white,
    fontSize: 14,
  },
});
