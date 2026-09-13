"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "../../../store/languageStore";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  category: string;
  createdAt: string;
}

interface Summary {
  totalIncome: number;
  totalExpense: number;
  totalTax: number;
  netProfit: number;
  transactionCount: number;
}

export default function AccountingPage() {
  const { t } = useLanguageStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Form State
  const [type, setType] = useState("INCOME");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Storage Fees");

  useEffect(() => {
    fetchFinancials();
  }, []);

  const fetchFinancials = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const headers = { Authorization: `Bearer ${token}` };

      const [txRes, sumRes] = await Promise.all([
        fetch("http://localhost:5000/api/accounting", { headers }),
        fetch("http://localhost:5000/api/accounting/summary", { headers }),
      ]);

      const txData = await txRes.json();
      const sumData = await sumRes.json();

      if (txData.data) setTransactions(txData.data);
      if (sumData.summary) setSummary(sumData.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("http://localhost:5000/api/accounting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, amount, description, category }),
      });

      if (res.ok) {
        setAmount("");
        setDescription("");
        setIsPanelOpen(false);
        fetchFinancials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">
            {t("accounting")}
          </h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            {t("accountingSubtitle")}
          </p>
        </div>
        <button
          onClick={() => setIsPanelOpen(true)}
          className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold
            bg-brand text-white hover:bg-brand-hover transition-colors
            shadow-[0_2px_8px_rgba(20,102,192,0.35)] shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          {t("recordTransaction")}
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default
            shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]
            hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)]
            hover:border-brand/30 transition-all duration-200">
            <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">
              {t("income")}
            </p>
            <p className="text-[30px] font-bold text-status-success leading-none tracking-tight">
              +€{summary.totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default
            shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]
            hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)]
            hover:border-brand/30 transition-all duration-200">
            <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">
              {t("expense")}
            </p>
            <p className="text-[30px] font-bold text-status-error leading-none tracking-tight">
              -€{summary.totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default
            shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]
            hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)]
            hover:border-brand/30 transition-all duration-200">
            <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">
              {t("tax")}
            </p>
            <p className="text-[30px] font-bold text-text-muted leading-none tracking-tight">
              €{summary.totalTax.toFixed(2)}
            </p>
          </div>
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default
            shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]
            hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)]
            hover:border-brand/30 transition-all duration-200">
            <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">
              {t("netProfit")}
            </p>
            <p className={`text-[30px] font-bold leading-none tracking-tight ${
              summary.netProfit >= 0 ? "text-status-success" : "text-status-error"
            }`}>
              €{summary.netProfit.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* General Ledger Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center justify-between px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-brand" />
              <h3 className="text-[14px] font-semibold text-text-heading">{t("generalLedgerLogs")}</h3>
            </div>
            <div className="flex items-center gap-2 text-status-success text-[12px] font-medium shrink-0">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              {t("verifactuActive")}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-dash-header-bg border-b border-dash-card-border">
                <tr>
                  {[t("date"), t("type"), t("category"), t("description"), t("amount"), t("auditHash")].map((h, i) => (
                    <th key={h} className={`px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em] ${i === 4 ? "text-right" : i === 5 ? "text-center" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-[13px] text-text-dim">{t("noTransactionsFound")}</td></tr>
                ) : transactions.map((tItem, idx) => (
                  <tr key={tItem.id} className={`hover:bg-dash-row-hover transition-colors ${idx < transactions.length - 1 ? "border-b border-dash-divider" : ""}`}>
                    <td className="px-4 py-3 text-[12px] text-text-muted">
                      {new Date(tItem.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${
                        tItem.type === "INCOME" || tItem.type === "BILLING"
                          ? "text-status-success bg-green-50"
                          : tItem.type === "EXPENSE"
                          ? "text-status-error bg-red-50"
                          : "text-text-muted bg-gray-100"
                      }`}>{t(tItem.type.toLowerCase()) || tItem.type}</span>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-text-body">{tItem.category}</td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">{tItem.description}</td>
                    <td className={`px-4 py-3 text-[13px] font-bold text-right ${
                      tItem.type === "INCOME" || tItem.type === "BILLING"
                        ? "text-status-success"
                        : "text-status-error"
                    }`}>
                      {tItem.type === "INCOME" || tItem.type === "BILLING" ? "+" : "-"}€{tItem.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center text-[11px] font-mono text-text-dim opacity-60">
                      {tItem.id.slice(0, 12)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Transaction Modal */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsPanelOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div
            className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-brand" />
                <h3 className="text-[15px] font-semibold text-text-heading">{t("recordTransaction")}</h3>
              </div>
              <button onClick={() => setIsPanelOpen(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handlePostTransaction} className="px-5 py-5 space-y-4">
              {/* Type */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("type")}</label>
                <select value={type} onChange={(e) => setType(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors cursor-pointer">
                  <option value="INCOME">{t("incomeTypeDesc")}</option>
                  <option value="EXPENSE">{t("expenseTypeDesc")}</option>
                  <option value="TAX">{t("taxTypeDesc")}</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("amountEuro")} <span className="text-status-error">*</span></label>
                <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("category")}</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors cursor-pointer">
                  <option value={t("catStorage")}>{t("catStorage")}</option>
                  <option value={t("catFulfillment")}>{t("catFulfillment")}</option>
                  <option value={t("catUtilities")}>{t("catUtilities")}</option>
                  <option value={t("catPayroll")}>{t("catPayroll")}</option>
                  <option value={t("catTaxPayment")}>{t("catTaxPayment")}</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("description")} <span className="text-status-error">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3}
                  placeholder={t("addTxNotes")}
                  className="w-full px-3 py-2 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors resize-none" />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button type="button" onClick={() => setIsPanelOpen(false)}
                  className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("cancel")}
                </button>
                <button type="submit"
                  className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                  {t("saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
