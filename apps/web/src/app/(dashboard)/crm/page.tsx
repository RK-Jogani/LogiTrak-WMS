"use client";

import { useState, useMemo, useEffect } from "react";
import { useLanguageStore } from "../../../store/languageStore";
import { CustomerDetailDrawer } from "../../../components/crm/CustomerDetailDrawer";
import { useToast } from "../../../store/ToastContext";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter";

/* ─── Types ─────────────────────────────────────────── */
interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  company?: string;
  activities?: any[];
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: "CUST-001", name: "Canyon Supplies", email: "contact@canyon.com", phone: "555-0199", status: "CUSTOMER", notes: "VIP Client", createdAt: "2026-06-15", company: "Canyon Supplies LLC" },
  { id: "CUST-002", name: "Global Tech", email: "info@globaltech.com", phone: "555-0288", status: "PROSPECT", notes: "Interested in Q3", createdAt: "2026-07-01", company: "Global Tech Inc." },
  { id: "CUST-003", name: "Maria Garcia", email: "maria@example.com", phone: "555-0377", status: "CUSTOMER", notes: "Retail partner", createdAt: "2026-05-20" },
  { id: "CUST-004", name: "Apex Logistics", email: "sales@apexlogistics.com", phone: "555-0466", status: "INACTIVE", notes: "Contract ended", createdAt: "2025-11-10", company: "Apex Logistics" },
];

/* ─── Constants ─────────────────────────────────────── */
const PAGE_SIZE = 5;

const getKpis = (t: (key: string) => string) => [
  { label: t("totalCustomers"), value: "0",  change: t("registered"),    sub: "",         trend: "up"   as const, icon: "group",         iconCls: "text-brand bg-brand-light",       trendCls: "text-brand bg-brand-light"            },
  { label: t("activeCustomers"),value: "0",  change: t("activeNow"),    sub: "",         trend: "up"   as const, icon: "person_check",  iconCls: "text-status-success bg-green-50", trendCls: "text-status-success bg-green-50"      },
  { label: t("prospects"),       value: "0",  change: t("inPipeline"),   sub: "",         trend: "up"   as const, icon: "person_search", iconCls: "text-purple-600 bg-purple-50",    trendCls: "text-purple-600 bg-purple-50"         },
  { label: t("addedThisWeek"), value: "0",  change: t("newLeads"),     sub: "",         trend: "up"   as const, icon: "person_add",    iconCls: "text-status-warning bg-amber-50", trendCls: "text-status-warning bg-amber-50"      },
];

const statusCls: Record<string, string> = {
  CUSTOMER: "text-status-success bg-green-50",
  PROSPECT: "text-purple-600 bg-purple-50",
  INACTIVE: "text-text-muted bg-gray-100",
};

/* ═══════════════════════════════════════════════════ */
export default function CrmPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();

  /* ── data state ── */
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  /* ── modal state ── */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "filter" | "actions" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", status: "PROSPECT", notes: "" });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  /* ── table state ── */
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const newCustomer: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: form.status,
      notes: form.notes,
      createdAt: new Date().toISOString(),
      activities: []
    };

    setCustomers([newCustomer, ...customers]);
    showToast("Customer added successfully", "success");
    closeModal();
  }

  function handleAddActivity(customerId: string, note: string, type: string) {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newAct = { note, type, date: new Date().toISOString() };
        const updated = { ...c, activities: [newAct, ...(c.activities || [])] };
        if (selectedCustomer?.id === customerId) setSelectedCustomer(updated);
        return updated;
      }
      return c;
    }));
    showToast(`Activity added for customer`, "success");
  }

  function closeModal() {
    setModalOpen(false);
    setForm({ name: "", email: "", phone: "", status: "PROSPECT", notes: "" });
    setSelectedCustomer(null);
  }

  const openModal = (type: typeof modalType, customer: Customer | null = null) => {
    setModalType(type);
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  /* ── filtered + paginated ── */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageRows   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const startRow   = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endRow     = Math.min(safePage * PAGE_SIZE, filtered.length);

  const pageNumbers = useMemo(() => {
    const range: number[] = [];
    for (let i = Math.max(1, safePage - 2); i <= Math.min(totalPages, safePage + 2); i++) range.push(i);
    return range;
  }, [safePage, totalPages]);

  /* live KPI counts */
  const kpis = [
    { label: t("totalCustomers"), value: <AnimatedCounter value={customers.length} />,  change: t("registered"),    sub: "",         trend: "up"   as const, icon: "group",         iconCls: "text-brand bg-brand-light",       trendCls: "text-brand bg-brand-light"            },
    { label: t("activeCustomers"),value: <AnimatedCounter value={customers.filter((c) => c.status === "CUSTOMER").length} />,  change: t("activeNow"),    sub: "",         trend: "up"   as const, icon: "person_check",  iconCls: "text-status-success bg-green-50", trendCls: "text-status-success bg-green-50"      },
    { label: t("prospects"),       value: <AnimatedCounter value={customers.filter((c) => c.status === "PROSPECT").length} />,  change: t("inPipeline"),   sub: "",         trend: "up"   as const, icon: "person_search", iconCls: "text-purple-600 bg-purple-50",    trendCls: "text-purple-600 bg-purple-50"         },
    { label: t("addedThisWeek"), value: <AnimatedCounter value={customers.filter((c) => { const d = new Date(c.createdAt); return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000; }).length} />,  change: t("newLeads"),     sub: "",         trend: "up"   as const, icon: "person_add",    iconCls: "text-status-warning bg-amber-50", trendCls: "text-status-warning bg-amber-50"      },
  ];

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("crmCustomers")}</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{t("crmSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold
              bg-brand text-white hover:bg-brand-hover transition-colors
              shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
            <span className="material-symbols-outlined text-[16px]">add</span>
            {t("addCustomer")}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* ── Customer Table ──────────────────────────── */}
      <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-dim pointer-events-none">search</span>
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={t("searchPlaceholder")}
                className="pl-8 pr-3 h-9 w-52 rounded-lg border text-[13px]
                  bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim
                  focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
            </div>
            <button onClick={() => openModal("filter")} className="flex items-center gap-1.5 px-3 h-9 rounded-lg border text-[13px] font-medium
              bg-dash-card border-dash-card-border text-text-muted hover:border-brand hover:text-brand transition-colors">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>{t("filter")}
            </button>
          </div>
          <span className="text-[12px] text-text-dim shrink-0">
            {filtered.length === 0 ? t("noResults") : `${t("showingResults")} ${startRow}–${endRow} of ${filtered.length}`}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-dash-header-bg border-b border-dash-card-border">
              <tr>
                <th className="px-4 py-2.5 w-10 text-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-dash-card-border accent-brand cursor-pointer" />
                </th>
                {[{l:t("name"),a:"left"},{l:t("email"),a:"left"},{l:t("phone"),a:"left"},{l:t("status"),a:"center"},{l:t("added"),a:"left"},{l:t("notes"),a:"left"},{l:"",a:"center"}].map(({l,a})=>(
                  <th key={l} className={`px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em] text-${a}`}>{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-[13px] text-text-dim">
                  {customers.length === 0 ? t("noCustomersYet") : t("noCustomersMatch")}
                </td></tr>
              ) : pageRows.map((c, idx) => (
                <tr 
                  key={c.id} 
                  onClick={() => setSelectedCustomer(c)}
                  className={`group cursor-pointer hover:bg-dash-row-hover transition-colors ${idx < pageRows.length - 1 ? "border-b border-dash-divider" : ""}`}
                >
                  <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className="w-4 h-4 rounded border-dash-card-border accent-brand cursor-pointer" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-light text-brand text-[12px] font-bold shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-semibold text-text-heading">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-muted">{c.email || "—"}</td>
                  <td className="px-4 py-3 text-[13px] text-text-muted">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${statusCls[c.status] ?? "text-text-muted bg-gray-100"}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-muted">
                    {new Date(c.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-muted max-w-[180px] truncate">{c.notes || "—"}</td>
                  <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openModal("actions", c)} className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-7 h-7 rounded-lg mx-auto text-text-dim hover:text-brand hover:bg-brand-light transition-all">
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-dash-header-bg border-t border-dash-divider">
          <span className="text-[12px] text-text-dim">
            {filtered.length === 0 ? `0 ${t("noResults")}` : `${startRow}–${endRow} of ${filtered.length} ${t("showingResults")}`}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-dash-card-border bg-dash-card text-text-muted hover:border-brand hover:text-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-dash-card-border disabled:hover:text-text-muted">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            {pageNumbers.map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={`flex items-center justify-center w-8 h-8 rounded-lg border text-[12px] font-medium transition-colors ${n === safePage ? "bg-brand text-white border-brand shadow-sm" : "bg-dash-card border-dash-card-border text-text-muted hover:border-brand hover:text-brand"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-dash-card-border bg-dash-card text-text-muted hover:border-brand hover:text-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-dash-card-border disabled:hover:text-text-muted">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Add/Filter Modal ──────────────────────── */}
      {modalOpen && modalType === "create" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div
            className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-brand" />
                <h3 className="text-[15px] font-semibold text-text-heading">{t("addCustomer")}</h3>
              </div>
              <button onClick={closeModal}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("name")} <span className="text-status-error">*</span></label>
                <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder={t("customerName")}
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>

              {/* Email + Phone row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("email")}</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="email@domain.com"
                    className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("phone")}</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                    placeholder="+1 555 000 0000"
                    className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("status")}</label>
                <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors cursor-pointer">
                  <option value="PROSPECT">{t("prospect")}</option>
                  <option value="CUSTOMER">{t("customer")}</option>
                  <option value="INACTIVE">{t("inactive")}</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("notes")}</label>
                <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})}
                  rows={3} placeholder={t("optionalNotes")}
                  className="w-full px-3 py-2 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors resize-none" />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button type="button" onClick={closeModal}
                  className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("cancel")}
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)] disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? t("saving") : t("saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Filter Modal ────────────────────────────– */}
      {modalOpen && modalType === "filter" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("filterCustomers")}</h3>
              <button onClick={closeModal} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("status")}</label>
                <select className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors">
                  <option>{t("allStatuses")}</option>
                  <option>{t("customer")}</option>
                  <option>{t("prospect")}</option>
                  <option>{t("inactive")}</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("dateRange")}</label>
                <div className="flex gap-2">
                  <input type="date" className="flex-1 h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
                  <input type="date" className="flex-1 h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold text-text-body bg-dash-header-bg hover:bg-dash-divider transition-colors">{t("reset")}</button>
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors">{t("apply")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Customer Actions Menu ───────────────────– */}
      {modalOpen && modalType === "actions" && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-sm bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("customerActions")}</h3>
              <button onClick={closeModal} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-4 space-y-2">
              <button onClick={closeModal} className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium text-text-body bg-dash-header-bg hover:bg-brand-light hover:text-brand transition-colors">
                <span className="material-symbols-outlined text-[18px]">visibility</span>{t("viewDetails")}
              </button>
              <button onClick={closeModal} className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium text-text-body bg-dash-header-bg hover:bg-brand-light hover:text-brand transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit</span>{t("editCustomer")}
              </button>
              <button onClick={closeModal} className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium text-text-body bg-dash-header-bg hover:bg-red-100 hover:text-status-error transition-colors">
                <span className="material-symbols-outlined text-[18px]">delete</span>{t("deleteCustomer")}
              </button>
              <button onClick={closeModal} className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium text-text-body bg-dash-header-bg hover:bg-brand-light hover:text-brand transition-colors">
                <span className="material-symbols-outlined text-[18px]">email</span>{t("sendEmail")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Drawer */}
      <CustomerDetailDrawer
        isOpen={selectedCustomer !== null && modalType === null}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
        onAddActivity={handleAddActivity}
      />

    </div>
  );
}

/* ─── KPI Card ─────────────────────────────────────── */
function KpiCard({ label, value, change, sub, trend, icon, iconCls, trendCls }: {
  label: string; value: string; change: string; sub: string;
  trend: "up" | "down"; icon: string; iconCls: string; trendCls: string;
}) {
  return (
    <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default
      shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]
      hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)]
      hover:border-brand/30 transition-all duration-200">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{label}</p>
        <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${iconCls}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <p className="text-[30px] font-bold text-text-heading leading-none tracking-tight">{value}</p>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md ${trendCls}`}>
          <span className="material-symbols-outlined text-[12px]">{trend === "up" ? "arrow_upward" : "arrow_downward"}</span>
          <span className="text-[11px] font-bold">{change}</span>
        </div>
        {sub && <span className="text-[11px] text-text-dim">{sub}</span>}
      </div>
    </div>
  );
}
