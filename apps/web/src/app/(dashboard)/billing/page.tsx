"use client";

import { useState, useMemo } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useToast } from "@/store/ToastContext";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

interface Invoice {
  id: string;
  invoiceNum: string;
  customer: string;
  issueDate: string;
  dueDate: string;
  items: number;
  subtotal: number;
  tax: number;
  total: number;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
}

interface Payment {
  id: string;
  paymentId: string;
  invoiceRef: string;
  customer: string;
  amount: number;
  method: "BANK_TRANSFER" | "CREDIT_CARD" | "CASH" | "OTHER";
  date: string;
  refNum: string;
  recordedBy: string;
}

const mockInvoices: Invoice[] = [
  { id: "1", invoiceNum: "INV-2024-001", customer: "Acme Industries",   issueDate: "2024-06-20", dueDate: "2024-07-04", items: 5,  subtotal: 2500, tax: 500,  total: 3000, status: "PAID"    },
  { id: "2", invoiceNum: "INV-2024-002", customer: "Global Supplies",   issueDate: "2024-06-22", dueDate: "2024-07-06", items: 8,  subtotal: 4200, tax: 840,  total: 5040, status: "SENT"    },
  { id: "3", invoiceNum: "INV-2024-003", customer: "Summit Logistics",  issueDate: "2024-06-15", dueDate: "2024-06-29", items: 3,  subtotal: 1500, tax: 300,  total: 1800, status: "OVERDUE" },
  { id: "4", invoiceNum: "INV-2024-004", customer: "Baker Electronics", issueDate: "2024-06-25", dueDate: "2024-07-09", items: 12, subtotal: 6800, tax: 1360, total: 8160, status: "DRAFT"   },
];

const mockPayments: Payment[] = [
  { id: "1", paymentId: "PAY-2024-001", invoiceRef: "INV-2024-001", customer: "Acme Industries", amount: 3000, method: "BANK_TRANSFER", date: "2024-06-28", refNum: "BT-28062024-001", recordedBy: "Admin" },
  { id: "2", paymentId: "PAY-2024-002", invoiceRef: "INV-2024-002", customer: "Global Supplies",  amount: 2500, method: "CREDIT_CARD",   date: "2024-06-27", refNum: "CC-28062024-002", recordedBy: "Maria" },
];

const statusCls: Record<string, string> = {
  DRAFT:     "text-text-muted bg-gray-100",
  SENT:      "text-status-warning bg-amber-50",
  PAID:      "text-status-success bg-green-50",
  OVERDUE:   "text-status-error bg-red-50",
  CANCELLED: "text-gray-600 bg-gray-100",
};

export default function BillingPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();
  
  const [activeTab,     setActiveTab]     = useState<"INVOICES" | "PAYMENTS" | "TAX">("INVOICES");
  const [invoiceModal,  setInvoiceModal]  = useState(false);
  
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  // New Invoice Form state
  const [newInvoiceForm, setNewInvoiceForm] = useState({ customer: "", date: "", dueDate: "", qty: 1, price: 100 });
  
  const subtotal = newInvoiceForm.qty * newInvoiceForm.price;
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  const handleCreateInvoice = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newInvoiceForm.customer) return;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNum: `INV-2026-00${invoices.length + 1}`,
      customer: newInvoiceForm.customer,
      issueDate: newInvoiceForm.date || new Date().toISOString().split('T')[0],
      dueDate: newInvoiceForm.dueDate || new Date().toISOString().split('T')[0],
      items: newInvoiceForm.qty,
      subtotal,
      tax,
      total,
      status: "SENT",
    };
    
    setInvoices([newInvoice, ...invoices]);
    showToast(`Invoice ${newInvoice.invoiceNum} created`, "success");
    setInvoiceModal(false);
    setNewInvoiceForm({ customer: "", date: "", dueDate: "", qty: 1, price: 100 });
  };

  const handleMarkPaid = (inv: Invoice) => {
    setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: "PAID" } : i));
    
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      paymentId: `PAY-2026-00${payments.length + 1}`,
      invoiceRef: inv.invoiceNum,
      customer: inv.customer,
      amount: inv.total,
      method: "BANK_TRANSFER",
      date: new Date().toISOString().split('T')[0],
      refNum: `BT-${Date.now()}`,
      recordedBy: "Admin",
    };
    setPayments([newPayment, ...payments]);
    showToast(`Invoice ${inv.invoiceNum} marked as paid`, "success");
  };

  const totalInvoiced = useMemo(() => invoices.reduce((sum, inv) => sum + inv.total, 0), [invoices]);
  const paidAmount = useMemo(() => invoices.filter(i => i.status === "PAID").reduce((sum, inv) => sum + inv.total, 0), [invoices]);
  const outstandingAmount = useMemo(() => invoices.filter(i => i.status !== "PAID" && i.status !== "CANCELLED").reduce((sum, inv) => sum + inv.total, 0), [invoices]);
  const overdueAmount = useMemo(() => invoices.filter(i => i.status === "OVERDUE").reduce((sum, inv) => sum + inv.total, 0), [invoices]);

  const kpis = [
    { label: t("totalInvoicedMonth"), value: <div className="flex items-center gap-1">$<AnimatedCounter value={totalInvoiced} /></div>, icon: "receipt",         iconCls: "text-brand bg-brand-light" },
    { label: t("paidAmount"),         value: <div className="flex items-center gap-1">$<AnimatedCounter value={paidAmount} /></div>,  icon: "check_circle",     iconCls: "text-status-success bg-green-50" },
    { label: t("outstanding"),        value: <div className="flex items-center gap-1">$<AnimatedCounter value={outstandingAmount} /></div>, icon: "pending_actions",  iconCls: "text-status-warning bg-amber-50" },
    { label: t("overdueAmount"),      value: <div className="flex items-center gap-1">$<AnimatedCounter value={overdueAmount} /></div>,  icon: "warning",          iconCls: "text-status-error bg-red-50" },
  ];

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("billingInvoicing")}</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{t("billingSubtitle")}</p>
        </div>
        <button onClick={() => setInvoiceModal(true)}
          className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)] shrink-0">
          <span className="material-symbols-outlined text-[16px]">add</span>{t("createInvoice")}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default
            shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]
            hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)]
            hover:border-brand/30 transition-all duration-200">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{k.label}</p>
              <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${k.iconCls}`}>
                <span className="material-symbols-outlined text-[20px]">{k.icon}</span>
              </div>
            </div>
            <p className="text-[30px] font-bold text-text-heading leading-none tracking-tight">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-dash-divider">
        {(["INVOICES", "PAYMENTS", "TAX"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === tab ? "text-brand border-brand" : "text-text-muted border-transparent hover:text-text-body"
            }`}>
            {tab === "TAX" ? t("taxRecords") : tab === "INVOICES" ? t("invoicesTab") : t("paymentsTab")}
          </button>
        ))}
      </div>

      {/* Invoices Tab */}
      {activeTab === "INVOICES" && (
        <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-dash-header-bg border-b border-dash-card-border">
                <tr>
                  {[t("invoiceNum"), t("customer"), t("issueDate"), t("dueDate"), t("items"), t("subtotal"), t("tax"), t("total"), t("status"), t("actions")].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, idx) => (
                  <tr key={inv.id} className={`hover:bg-dash-row-hover transition-colors ${idx < invoices.length - 1 ? "border-b border-dash-divider" : ""}`}>
                    <td className="px-4 py-3 font-semibold font-mono text-brand">{inv.invoiceNum}</td>
                    <td className="px-4 py-3 text-text-body">{inv.customer}</td>
                    <td className="px-4 py-3 text-text-muted">{new Date(inv.issueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-text-muted">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-text-muted">{inv.items}</td>
                    <td className="px-4 py-3 text-text-body">${inv.subtotal.toLocaleString()}</td>
                    <td className="px-4 py-3 text-text-body">${inv.tax.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-text-heading">${inv.total.toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold ${statusCls[inv.status]}`}>{inv.status}</span></td>
                    <td className="px-4 py-3 text-[11px]">
                      <div className="flex gap-1 items-center">
                        <button className="text-brand hover:text-brand-hover font-semibold px-2 py-1 bg-brand/10 rounded">{t("view")}</button>
                        {inv.status !== "PAID" && inv.status !== "CANCELLED" && (
                          <button onClick={() => handleMarkPaid(inv)} className="text-white hover:bg-green-600 font-semibold px-2 py-1 bg-green-500 rounded whitespace-nowrap">
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === "PAYMENTS" && (
        <>
          <div className="flex justify-end">
            <button className="px-4 h-9 rounded-lg text-[13px] font-semibold text-white bg-brand hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
              {t("recordPayment")}
            </button>
          </div>
          <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead className="bg-dash-header-bg border-b border-dash-card-border">
                  <tr>
                    {[t("paymentId"), t("invoice"), t("customer"), t("amount"), t("method"), t("date"), t("refNum"), t("recordedBy")].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => (
                    <tr key={p.id} className={`hover:bg-dash-row-hover transition-colors ${idx < payments.length - 1 ? "border-b border-dash-divider" : ""}`}>
                      <td className="px-4 py-3 font-semibold font-mono text-brand">{p.paymentId}</td>
                      <td className="px-4 py-3 font-mono text-text-muted">{p.invoiceRef}</td>
                      <td className="px-4 py-3 text-text-body">{p.customer}</td>
                      <td className="px-4 py-3 font-bold text-status-success">${p.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-text-muted">{p.method.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3 text-text-muted">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-mono text-text-dim text-[11px]">{p.refNum}</td>
                      <td className="px-4 py-3 text-text-muted">{p.recordedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tax Records Tab */}
      {activeTab === "TAX" && (
        <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-dash-header-bg border-b border-dash-card-border">
                <tr>
                  {[t("period"), t("revenue"), t("taxable"), t("taxCollected"), t("rateCol"), t("status"), t("actions")].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { period: "June 2024",  revenue: "$18,000", taxable: "$17,500", tax: "$3,500", rate: "20%", status: "FILED"   },
                  { period: "May 2024",   revenue: "$16,200", taxable: "$15,800", tax: "$3,160", rate: "20%", status: "FILED"   },
                  { period: "April 2024", revenue: "$14,500", taxable: "$14,000", tax: "$2,800", rate: "20%", status: "PENDING" },
                ].map((row, idx) => (
                  <tr key={idx} className={`hover:bg-dash-row-hover transition-colors ${idx < 2 ? "border-b border-dash-divider" : ""}`}>
                    <td className="px-4 py-3 text-text-body font-semibold">{row.period}</td>
                    <td className="px-4 py-3 text-text-body font-bold">{row.revenue}</td>
                    <td className="px-4 py-3 text-text-body">{row.taxable}</td>
                    <td className="px-4 py-3 text-text-body font-bold">{row.tax}</td>
                    <td className="px-4 py-3 text-text-muted">{row.rate}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold ${row.status === "FILED" ? "text-status-success bg-green-50" : "text-status-warning bg-amber-50"}`}>{row.status}</span></td>
                    <td className="px-4 py-3"><button className="text-brand font-semibold hover:text-brand-hover text-[11px]">{t("downloadReport")}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {invoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setInvoiceModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("createInvoice")}</h3>
              <button onClick={() => setInvoiceModal(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="px-5 py-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("customer")} <span className="text-status-error">*</span></label>
                <select 
                  required 
                  value={newInvoiceForm.customer}
                  onChange={e => setNewInvoiceForm({...newInvoiceForm, customer: e.target.value})}
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors cursor-pointer"
                >
                  <option value="">{t("selectCustomer")}</option>
                  <option value="Acme Industries">Acme Industries</option>
                  <option value="Global Supplies">Global Supplies</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("invoiceDate")}</label>
                  <input type="date" value={newInvoiceForm.date} onChange={e => setNewInvoiceForm({...newInvoiceForm, date: e.target.value})} className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("dueDate")}</label>
                  <input type="date" value={newInvoiceForm.dueDate} onChange={e => setNewInvoiceForm({...newInvoiceForm, dueDate: e.target.value})} className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Quantity</label>
                  <input type="number" min="1" value={newInvoiceForm.qty} onChange={e => setNewInvoiceForm({...newInvoiceForm, qty: Number(e.target.value)})} className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Price</label>
                  <input type="number" min="1" value={newInvoiceForm.price} onChange={e => setNewInvoiceForm({...newInvoiceForm, price: Number(e.target.value)})} className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                </div>
              </div>

              <div className="bg-dash-header-bg rounded-lg p-3 space-y-2">
                <p className="text-[11px] font-semibold text-text-dim uppercase">{t("summaryLabel")}</p>
                <div className="space-y-1 text-[12px]">
                  <div className="flex justify-between"><span className="text-text-muted">{t("subtotal")}:</span><span className="text-text-body">${subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">{t("tax")} (20%):</span><span className="text-text-body">${tax.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="font-bold text-text-heading">{t("total")}:</span><span className="font-bold text-text-heading">${total.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setInvoiceModal(false)}
                  className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("cancel")}
                </button>
                <button type="submit"
                  className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                  {t("create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
