import { Text } from "@/components/ui/Text";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { useResponsive } from "@/hooks/useResponsive";
import { X, ChevronRight, ChevronLeft, Upload, CheckCircle2 } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Image,
  Alert
} from "react-native";
import { useProducts } from "@/context/ProductsContext";



export function ProductWizardModal({ visible, onClose, onSave, initialData }) {
  const { isMobile, isMiniTab } = useResponsive();
  const { products } = useProducts();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "", category: "", type: "", description: "",
    sku: "", barcode: "", sellingPrice: "", costPrice: "", tax: "",
    trackInventory: true, initialStock: "", reorderLevel: "",
    variants: [],
    isComposite: false, ingredients: [], image: null
  });

  const handleImageUpload = () => {
    // Mock image upload
    Alert.alert(
      "Upload Image",
      "In a real app, this would open the image picker.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Mock Upload", onPress: () => setFormData({ ...formData, image: "https://picsum.photos/200" }) }
      ]
    );
  };

  const STEPS = ["Basic Info", "Pricing", formData.isComposite ? "Ingredients" : "Inventory"];

  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          category: initialData.category || "",
          type: initialData.type || "",
          description: initialData.description || "",
          sku: initialData.sku || "",
          barcode: initialData.barcode || "",
          sellingPrice: initialData.pricing?.sellingPrice?.toString() || "",
          costPrice: initialData.pricing?.costPrice?.toString() || "",
          tax: initialData.tax ? `${initialData.tax.category} ${initialData.tax.percentage}%` : "",
          trackInventory: initialData.inventory?.tracked ?? true,
          initialStock: initialData.inventory?.current?.toString() || "",
          reorderLevel: initialData.inventory?.reorderLevel?.toString() || "",
          variants: initialData.variants || [],
          isComposite: initialData.isComposite || false,
          ingredients: initialData.ingredients || []
        });
      } else {
        setFormData({
          name: "", category: "", type: "Standard", description: "",
          sku: "", barcode: "", sellingPrice: "", costPrice: "", tax: "",
          trackInventory: true, initialStock: "", reorderLevel: "", variants: [],
          isComposite: false, ingredients: []
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
              <Text weight="bold" style={styles.title}>{initialData ? "Edit Product" : "Create New Product"}</Text>
              <Text style={styles.subtitle}>Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={ThemeColors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Stepper Header */}
          <View style={styles.stepperWrap}>
            {STEPS.map((step, index) => (
              <View key={step} style={styles.stepIndicator}>
                <View style={[
                  styles.stepDot,
                  index <= currentStep && styles.stepDotActive
                ]}>
                  {index < currentStep ? (
                    <CheckCircle2 size={12} color={ThemeColors.white} />
                  ) : (
                    <Text weight="bold" style={styles.stepNum}>{index + 1}</Text>
                  )}
                </View>
                <Text style={[
                  styles.stepText,
                  index <= currentStep && styles.stepTextActive
                ]}>
                  {step}
                </Text>
                {index < STEPS.length - 1 && <View style={[styles.stepLine, index < currentStep && styles.stepLineActive]} />}
              </View>
            ))}
          </View>

          <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content}>
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <View style={styles.stepContainer}>
                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>Product Name *</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Coca-Cola 500ml" 
                    placeholderTextColor={ThemeColors.textMuted} 
                    value={formData.name}
                    onChangeText={(val) => setFormData({ ...formData, name: val })}
                  />
                </View>
                
                <View style={[styles.formGroup, styles.switchGroup]}>
                  <View>
                    <Text weight="semibold" style={styles.label}>Composite / Recipe Item?</Text>
                    <Text style={styles.hintText}>Turn on if this item is made of raw ingredients</Text>
                  </View>
                  <Switch
                    value={formData.isComposite}
                    onValueChange={(val) => setFormData({ ...formData, isComposite: val })}
                    trackColor={{ false: ThemeColors.border, true: ThemeColors.emerald }}
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text weight="semibold" style={styles.label}>Category</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Select Category" 
                      placeholderTextColor={ThemeColors.textMuted} 
                      value={formData.category}
                      onChangeText={(val) => setFormData({ ...formData, category: val })}
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text weight="semibold" style={styles.label}>Product Type</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Standard" 
                      placeholderTextColor={ThemeColors.textMuted} 
                      value={formData.type}
                      onChangeText={(val) => setFormData({ ...formData, type: val })}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>Description</Text>
                  <TextInput 
                    style={[styles.input, styles.textArea]} 
                    placeholder="Enter description..." 
                    placeholderTextColor={ThemeColors.textMuted} 
                    multiline 
                    numberOfLines={4} 
                    value={formData.description}
                    onChangeText={(val) => setFormData({ ...formData, description: val })}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text weight="semibold" style={styles.label}>Product Image</Text>
                  <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
                    {formData.image ? (
                      <Image source={{ uri: formData.image }} style={{ width: '100%', height: 100, borderRadius: ThemeRadius.md }} resizeMode="cover" />
                    ) : (
                      <>
                        <Upload size={24} color={ThemeColors.textSecondary} />
                        <Text style={styles.uploadText}>Click to upload image</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {formData.image && (
                    <TouchableOpacity onPress={() => setFormData({ ...formData, image: null })} style={{ marginTop: 8 }}>
                      <Text style={{ color: ThemeColors.red, fontSize: 12 }}>Remove Image</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Step 2: Pricing / Variants */}
            {currentStep === 1 && (
              <View style={styles.stepContainer}>
                {formData.type === "Variant" ? (
                  <View style={{ gap: ThemeSpacing.md }}>
                    <Text weight="bold" style={{ fontSize: 16, color: ThemeColors.textPrimary }}>Variants Setup</Text>
                    <Text style={{ color: ThemeColors.textSecondary, marginBottom: ThemeSpacing.sm }}>
                      Add options like size or color. Each variant can have its own price, SKU, and stock.
                    </Text>
                    {formData.variants.map((variant, index) => (
                      <View key={index} style={styles.variantRow}>
                        <TextInput 
                          style={[styles.input, { flex: 1.5, marginBottom: 0 }]} 
                          placeholder="Name (e.g. Large)" 
                          placeholderTextColor={ThemeColors.textMuted} 
                          value={variant.name}
                          onChangeText={(val) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].name = val;
                            setFormData({ ...formData, variants: newVariants });
                          }}
                        />
                        <TextInput 
                          style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                          placeholder="Price" 
                          keyboardType="numeric"
                          placeholderTextColor={ThemeColors.textMuted} 
                          value={variant.price?.toString()}
                          onChangeText={(val) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].price = val;
                            setFormData({ ...formData, variants: newVariants });
                          }}
                        />
                        <TextInput 
                          style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                          placeholder="Stock" 
                          keyboardType="numeric"
                          placeholderTextColor={ThemeColors.textMuted} 
                          value={variant.stock?.toString()}
                          onChangeText={(val) => {
                            const newVariants = [...formData.variants];
                            newVariants[index].stock = val;
                            setFormData({ ...formData, variants: newVariants });
                          }}
                        />
                        <TouchableOpacity 
                          onPress={() => {
                            const newVariants = formData.variants.filter((_, i) => i !== index);
                            setFormData({ ...formData, variants: newVariants });
                          }}
                          style={{ padding: ThemeSpacing.sm }}
                        >
                          <X size={20} color={ThemeColors.red} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity 
                      style={[styles.btnSecondary, { alignSelf: 'flex-start', marginTop: ThemeSpacing.sm }]}
                      onPress={() => setFormData({ 
                        ...formData, 
                        variants: [...formData.variants, { name: '', price: '', stock: '', sku: '' }] 
                      })}
                    >
                      <Text weight="semibold" style={styles.btnSecondaryText}>+ Add Variant</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <View style={styles.row}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text weight="semibold" style={styles.label}>SKU *</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="Auto-generated if empty" 
                          placeholderTextColor={ThemeColors.textMuted} 
                          value={formData.sku}
                          onChangeText={(val) => setFormData({ ...formData, sku: val })}
                        />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text weight="semibold" style={styles.label}>Barcode</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="Scan or enter barcode" 
                          placeholderTextColor={ThemeColors.textMuted} 
                          value={formData.barcode}
                          onChangeText={(val) => setFormData({ ...formData, barcode: val })}
                        />
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text weight="semibold" style={styles.label}>Selling Price (₹) *</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="0.00" 
                          keyboardType="numeric" 
                          placeholderTextColor={ThemeColors.textMuted} 
                          value={formData.sellingPrice}
                          onChangeText={(val) => setFormData({ ...formData, sellingPrice: val })}
                        />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text weight="semibold" style={styles.label}>Cost Price (₹)</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="0.00" 
                          keyboardType="numeric" 
                          placeholderTextColor={ThemeColors.textMuted} 
                          value={formData.costPrice}
                          onChangeText={(val) => setFormData({ ...formData, costPrice: val })}
                        />
                      </View>
                    </View>

                    <View style={styles.formGroup}>
                      <Text weight="semibold" style={styles.label}>Tax Setting</Text>
                      <TextInput 
                        style={styles.input} 
                        placeholder="e.g. GST 5%" 
                        placeholderTextColor={ThemeColors.textMuted} 
                        value={formData.tax}
                        onChangeText={(val) => setFormData({ ...formData, tax: val })}
                      />
                    </View>
                  </>
                )}
              </View>
            )}

            {/* Step 3: Inventory or Ingredients */}
            {currentStep === 2 && (
              <View style={styles.stepContainer}>
                {formData.isComposite ? (
                  <View style={styles.ingredientsBuilder}>
                    <Text weight="semibold" style={{ fontSize: 16, color: ThemeColors.textPrimary }}>Recipe Builder</Text>
                    <Text style={styles.hintText}>Select raw materials that make up this item.</Text>
                    
                    {formData.ingredients.map((ing, idx) => (
                      <View key={idx} style={styles.ingredientRow}>
                        <View style={[styles.formGroup, { flex: 2, marginBottom: 0 }]}>
                          <TextInput 
                            style={[styles.input, { marginBottom: 0 }]}
                            placeholder="Ingredient Name / Search..."
                            placeholderTextColor={ThemeColors.textMuted}
                            value={ing.name}
                            onChangeText={(val) => {
                              const newIngs = [...formData.ingredients];
                              newIngs[idx].name = val;
                              setFormData({ ...formData, ingredients: newIngs });
                            }}
                          />
                        </View>
                        <View style={[styles.formGroup, { flex: 1, marginBottom: 0 }]}>
                          <TextInput 
                            style={[styles.input, { marginBottom: 0 }]}
                            placeholder="Qty"
                            keyboardType="numeric"
                            placeholderTextColor={ThemeColors.textMuted}
                            value={ing.quantity?.toString()}
                            onChangeText={(val) => {
                              const newIngs = [...formData.ingredients];
                              newIngs[idx].quantity = val;
                              setFormData({ ...formData, ingredients: newIngs });
                            }}
                          />
                        </View>
                        <TouchableOpacity 
                          onPress={() => {
                            const newIngs = formData.ingredients.filter((_, i) => i !== idx);
                            setFormData({ ...formData, ingredients: newIngs });
                          }}
                          style={{ padding: ThemeSpacing.sm }}
                        >
                          <X size={20} color={ThemeColors.red} />
                        </TouchableOpacity>
                      </View>
                    ))}

                    <TouchableOpacity 
                      style={[styles.btnSecondary, { alignSelf: 'flex-start', marginTop: ThemeSpacing.md }]}
                      onPress={() => setFormData({ 
                        ...formData, 
                        ingredients: [...formData.ingredients, { productId: '', name: '', quantity: '' }] 
                      })}
                    >
                      <Text weight="semibold" style={styles.btnSecondaryText}>+ Add Ingredient</Text>
                    </TouchableOpacity>
                  </View>
                ) : formData.type === "Variant" ? (
                  <View style={styles.infoBox}>
                    <Text weight="semibold" style={styles.infoTitle}>Variant Inventory Managed in Step 2</Text>
                    <Text style={styles.infoText}>You have configured stock levels for your variants directly.</Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.formGroup}>
                      <Text weight="semibold" style={styles.label}>Track Inventory?</Text>
                      <Text style={styles.hintText}>If disabled, stock will not be deducted during sales.</Text>
                    </View>

                    <View style={styles.row}>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text weight="semibold" style={styles.label}>Initial Stock</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="0" 
                          keyboardType="numeric" 
                          placeholderTextColor={ThemeColors.textMuted} 
                          value={formData.initialStock}
                          onChangeText={(val) => setFormData({ ...formData, initialStock: val })}
                        />
                      </View>
                      <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text weight="semibold" style={styles.label}>Reorder Level</Text>
                        <TextInput 
                          style={styles.input} 
                          placeholder="10" 
                          keyboardType="numeric" 
                          placeholderTextColor={ThemeColors.textMuted} 
                          value={formData.reorderLevel}
                          onChangeText={(val) => setFormData({ ...formData, reorderLevel: val })}
                        />
                      </View>
                    </View>

                    <View style={styles.infoBox}>
                      <Text weight="semibold" style={styles.infoTitle}>Multiple Variants?</Text>
                      <Text style={styles.infoText}>To add sizes, colors, or flavors, switch the Product Type to "Variant" in Step 1.</Text>
                    </View>
                  </>
                )}
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
              <Text weight="bold" style={styles.btnSecondaryText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
              <Text weight="bold" style={styles.btnPrimaryText}>
                {currentStep === STEPS.length - 1 
                  ? (initialData ? "Save Changes" : "Create Product") 
                  : "Next Step"}
              </Text>
              {currentStep < STEPS.length - 1 && <ChevronRight size={18} color={ThemeColors.white} />}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: ThemeSpacing.sm,
    backgroundColor: ThemeColors.bg,
    padding: ThemeSpacing.sm,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
  },
  variantRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
