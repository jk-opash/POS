import { Text } from "@/components/ui/Text";
import { useInvoices } from "@/context/InvoicesContext";
import { ThemeColors, ThemeRadius, ThemeSpacing } from "@/theme/theme";
import { Download, Mail, Printer, X } from "lucide-react-native";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

export function InvoiceDetailsModal({ visible, onClose, invoiceId }) {
  const { invoices, refundInvoice, cancelInvoice } = useInvoices();

  const invoice = invoices.find((inv) => inv.id === invoiceId);

  if (!invoice) return null;

  const isCancellable =
    invoice.status !== "Paid" &&
    invoice.status !== "Refunded" &&
    invoice.status !== "Cancelled";
  const isRefundable =
    invoice.status === "Paid" || invoice.status === "Partially Paid";

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text weight="bold" style={styles.title}>
                {invoice.id}
              </Text>
              <Text style={styles.subtitle}>{invoice.type}</Text>
            </View>
            <View style={styles.headerRight}>
              <InvoiceStatusBadge status={invoice.status} />
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color={ThemeColors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Bar */}
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionBtn}>
              <Printer size={16} color={ThemeColors.textPrimary} />
              <Text weight="bold" style={styles.actionText}>
                Print
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Mail size={16} color={ThemeColors.textPrimary} />
              <Text weight="bold" style={styles.actionText}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Download size={16} color={ThemeColors.textPrimary} />
              <Text weight="bold" style={styles.actionText}>
                Download
              </Text>
            </TouchableOpacity>
          </View>

          {/* Invoice Document Body */}
          <ScrollView
            style={styles.documentBody}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.row}>
              <View style={styles.col}>
                <Text weight="bold" style={styles.sectionTitle}>
                  From
                </Text>
                <Text style={styles.bodyText}>Mac Burguer</Text>
                <Text style={styles.bodyText}>{invoice.store}</Text>
                <Text style={styles.bodyText}>Cashier: {invoice.cashier}</Text>
              </View>
              <View style={[styles.col, { alignItems: "flex-end" }]}>
                <Text weight="bold" style={styles.sectionTitle}>
                  To
                </Text>
                <Text style={styles.bodyText}>{invoice.customer.name}</Text>
                <Text style={styles.bodyText}>{invoice.customer.phone}</Text>
                <Text style={styles.bodyText}>{invoice.customer.email}</Text>
              </View>
            </View>

            <View style={styles.metaDataRow}>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text weight="bold" style={styles.metaValue}>
                  {new Date(invoice.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>Payment Method</Text>
                <Text weight="bold" style={styles.metaValue}>
                  {invoice.paymentMethod}
                </Text>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text weight="bold" style={[styles.th, { flex: 2 }]}>
                ITEM
              </Text>
              <Text
                weight="bold"
                style={[styles.th, { width: 60, textAlign: "center" }]}
              >
                QTY
              </Text>
              <Text
                weight="bold"
                style={[styles.th, { width: 100, textAlign: "right" }]}
              >
                PRICE
              </Text>
              <Text
                weight="bold"
                style={[styles.th, { width: 100, textAlign: "right" }]}
              >
                TOTAL
              </Text>
            </View>

            {invoice.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                  <Text weight="bold" style={styles.tdMain}>
                    {item.name}
                  </Text>
                  <Text style={styles.tdSub}>SKU: {item.sku}</Text>
                </View>
                <Text style={[styles.td, { width: 60, textAlign: "center" }]}>
                  {item.qty}
                </Text>
                <Text style={[styles.td, { width: 100, textAlign: "right" }]}>
                  ₹{item.unitPrice.toFixed(2)}
                </Text>
                <Text style={[styles.td, { width: 100, textAlign: "right" }]}>
                  ₹{item.total.toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ₹{invoice.subtotal.toFixed(2)}
                </Text>
              </View>
              {invoice.discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount</Text>
                  <Text style={styles.summaryValue}>
                    -₹{invoice.discount.toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>
                  ₹{invoice.tax.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                <Text weight="bold" style={styles.summaryTotalLabel}>
                  Grand Total
                </Text>
                <Text weight="bold" style={styles.summaryTotalValue}>
                  ₹{invoice.grandTotal.toFixed(2)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount Paid</Text>
                <Text style={styles.summaryValue}>
                  ₹{invoice.amountPaid.toFixed(2)}
                </Text>
              </View>
              {invoice.outstandingBalance > 0 && (
                <View style={styles.summaryRow}>
                  <Text weight="bold" style={styles.summaryLabel}>
                    Outstanding Balance
                  </Text>
                  <Text
                    weight="bold"
                    style={[styles.summaryValue, { color: ThemeColors.red }]}
                  >
                    ₹{invoice.outstandingBalance.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>

            {invoice.notes && (
              <View style={styles.notesBox}>
                <Text weight="bold" style={styles.notesLabel}>
                  Notes:
                </Text>
                <Text style={styles.notesValue}>{invoice.notes}</Text>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    ...Platform.select({
      web: {
        alignItems: "center",
        justifyContent: "center",
      },
    }),
  },
  modalContent: {
    backgroundColor: ThemeColors.surface,
    width: "100%",
    height: "90%",
    borderTopLeftRadius: ThemeRadius.xl,
    borderTopRightRadius: ThemeRadius.xl,
    ...Platform.select({
      web: {
        maxWidth: 700,
        height: "85%",
        borderRadius: ThemeRadius.xl,
      },
    }),
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
    fontSize: 22,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeSpacing.md,
  },
  closeBtn: {
    padding: 4,
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.full,
  },
  actionBar: {
    flexDirection: "row",
    padding: ThemeSpacing.md,
    paddingHorizontal: ThemeSpacing.xl,
    backgroundColor: ThemeColors.surfaceHighlight,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    gap: ThemeSpacing.sm,
    alignItems: "center",
    flexWrap: "wrap",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: ThemeRadius.md,
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.surface,
  },
  actionText: {
    fontSize: 13,
    color: ThemeColors.textPrimary,
  },
  actionSpacer: {
    flex: 1,
  },
  documentBody: {
    padding: ThemeSpacing.xxl,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: ThemeSpacing.xl,
  },
  col: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 14,
    color: ThemeColors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  metaDataRow: {
    flexDirection: "row",
    backgroundColor: ThemeColors.bg,
    borderRadius: ThemeRadius.lg,
    padding: ThemeSpacing.lg,
    marginBottom: ThemeSpacing.xxl,
    gap: ThemeSpacing.xxl,
  },
  metaBox: {
    gap: 4,
  },
  metaLabel: {
    fontSize: 13,
    color: ThemeColors.textSecondary,
  },
  metaValue: {
    fontSize: 15,
    color: ThemeColors.textPrimary,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: ThemeColors.border,
    paddingBottom: ThemeSpacing.sm,
    marginBottom: ThemeSpacing.md,
  },
  th: {
    fontSize: 12,
    color: ThemeColors.textMuted,
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.border,
    paddingVertical: ThemeSpacing.md,
  },
  tdMain: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: 2,
  },
  tdSub: {
    fontSize: 12,
    color: ThemeColors.textMuted,
  },
  td: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  summaryBox: {
    marginTop: ThemeSpacing.xl,
    marginLeft: "auto",
    width: "100%",
    maxWidth: 350,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryTotalRow: {
    borderTopWidth: 2,
    borderTopColor: ThemeColors.border,
    borderBottomWidth: 2,
    borderBottomColor: ThemeColors.border,
    paddingVertical: ThemeSpacing.md,
    marginTop: 8,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
  },
  summaryTotalLabel: {
    fontSize: 16,
    color: ThemeColors.textPrimary,
  },
  summaryTotalValue: {
    fontSize: 18,
    color: ThemeColors.emerald,
  },
  notesBox: {
    marginTop: ThemeSpacing.xxl,
    paddingTop: ThemeSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: ThemeColors.border,
  },
  notesLabel: {
    fontSize: 14,
    color: ThemeColors.textPrimary,
    marginBottom: 4,
  },
  notesValue: {
    fontSize: 14,
    color: ThemeColors.textSecondary,
    fontStyle: "italic",
  },
});
