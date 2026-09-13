"use client";

import { useState, useMemo } from "react";
import { StatusPill } from "@/components/ui/StatusPill";
import { useLanguageStore } from "@/store/languageStore";
import { OrderDetailDrawer } from "@/components/orders/OrderDetailDrawer";
import { useToast } from "@/store/ToastContext";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

/* ─── Constants ─────────────────────────────────────── */
const PAGE_SIZE = 8;

const STATUS_TABS = ["All", "New", "Picking", "Packed", "Shipped", "Delivered", "Exception"] as const;
type StatusTab = typeof STATUS_TABS[number];

/* ─── Orders data ───────────────────────────────────── */
const ALL_ORDERS = [
  { id: "ORD-2024-1284", channel: "Shopify", customer: "Acme Industries",    items: 5,  status: "PICKING",   due: "2024-06-25", total: "$1,240.00" },
  { id: "ORD-2024-1283", channel: "Amazon",  customer: "Global Supplies Co.", items: 12, status: "PACKED",    due: "2024-06-25", total: "$3,780.50" },
  { id: "ORD-2024-1282", channel: "Manual",  customer: "Baker Electronics",   items: 3,  status: "NEW",       due: "2024-06-26", total: "$890.00"   },
  { id: "ORD-2024-1281", channel: "Shopify", customer: "Summit Logistics",    items: 8,  status: "SHIPPED",   due: "2024-06-22", total: "$2,150.00" },
  { id: "ORD-2024-1280", channel: "Amazon",  customer: "Pinnacle Parts",      items: 1,  status: "DELIVERED", due: "2024-06-21", total: "$450.00"   },
  { id: "ORD-2024-1279", channel: "Shopify", customer: "Metro Hardware",      items: 6,  status: "ALLOCATED", due: "2024-06-26", total: "$1,800.00" },
  { id: "ORD-2024-1278", channel: "Manual",  customer: "Delta Mechanics",     items: 2,  status: "EXCEPTION", due: "2024-06-24", total: "$560.00"   },
  { id: "ORD-2024-1277", channel: "Amazon",  customer: "TechFlow Inc.",        items: 15, status: "NEW",       due: "2024-06-27", total: "$4,200.00" },
  { id: "ORD-2024-1276", channel: "Shopify", customer: "Iron Works Ltd.",      items: 4,  status: "PICKING",   due: "2024-06-28", total: "$980.00"   },
  { id: "ORD-2024-1275", channel: "Manual",  customer: "Apex Components",     items: 7,  status: "PACKED",    due: "2024-06-28", total: "$2,340.00" },
  { id: "ORD-2024-1274", channel: "Amazon",  customer: "BlueStar Retail",     items: 9,  status: "SHIPPED",   due: "2024-06-23", total: "$3,100.00" },
  { id: "ORD-2024-1273", channel: "Shopify", customer: "Canyon Supplies",     items: 2,  status: "NEW",       due: "2024-06-29", total: "$640.00"   },
];

const channelCls: Record<string, string> = {
  Shopify: "text-status-success bg-green-50",
  Amazon:  "text-status-warning bg-amber-50",
  Manual:  "text-purple-600 bg-purple-50",
};

const TABLE_HEADERS = [
  { label: "orderId", align: "left"   },
  { label: "channel",  align: "left"   },
  { label: "customer", align: "left"   },
  { label: "items",    align: "right"  },
  { label: "total",    align: "right"  },
  { label: "status",   align: "center" },
  { label: "dueDate", align: "left"   },
  { label: "",         align: "center" },
];

/* ═══════════════════════════════════════════════════ */
export default function OrdersPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();
  
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  
  const [activeTab, setActiveTab]   = useState<StatusTab>("All");
  const [search,    setSearch]      = useState("");
  const [page,      setPage]        = useState(1);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"import" | "filter" | "batch" | "menu" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const pendingCount = orders.filter(o => o.status === "NEW").length;

  /* ─── KPI data ──────────────────────────────────────── */
  const kpis = [
    { label: t("totalOrders"),       value: <AnimatedCounter value={orders.length} />, change: "+18 today",      sub: "",             trend: "up"   as const, icon: "receipt_long",    iconCls: "text-brand bg-brand-light",           trendCls: "text-status-success bg-green-50" },
    { label: t("pendingAllocation"), value: <AnimatedCounter value={pendingCount} />,  change: "Needs action",   sub: "",             trend: "down" as const, icon: "pending_actions", iconCls: "text-status-warning bg-amber-50",      trendCls: "text-status-warning bg-amber-50" },
    { label: t("shippedToday"),      value: <AnimatedCounter value={61} />,  change: "+5.2%",          sub: "vs yesterday", trend: "up"   as const, icon: "local_shipping",  iconCls: "text-status-success bg-green-50",      trendCls: "text-status-success bg-green-50" },
    { label: t("exceptions"),        value: <AnimatedCounter value={orders.filter(o => o.status === "EXCEPTION" || o.status === "CANCELLED").length} />,   change: "Requires review", sub: "",            trend: "down" as const, icon: "warning",         iconCls: "text-status-error bg-red-50",          trendCls: "text-status-error bg-red-50" },
  ];

  const openModal = (type: typeof modalType, order: any = null) => {
    setModalType(type);
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedOrder(null);
  };

  /* filter by tab + search */
  const filtered = useMemo(() => {
    let rows = orders;

    if (activeTab !== "All") {
      rows = rows.filter((o) => o.status.toUpperCase() === activeTab.toUpperCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.channel.toLowerCase().includes(q)
      );
    }

    return rows;
  }, [activeTab, search]);

  /* pagination */
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageRows    = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const startRow    = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endRow      = Math.min(safePage * PAGE_SIZE, filtered.length);

  /* page numbers to show (max 5 around current) */
  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, safePage - delta);
      i <= Math.min(totalPages, safePage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  }, [safePage, totalPages]);

  function handleTabChange(tab: StatusTab) {
    setActiveTab(tab);
    setPage(1);
  }

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  const toggleAllRows = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(pageRows.map(r => r.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const toggleRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowIds(prev => [...prev, id]);
    } else {
      setSelectedRowIds(prev => prev.filter(r => r !== id));
    }
  };

  const handleBatchAllocate = () => {
    if (selectedRowIds.length === 0) {
      showToast("No orders selected for allocation", "warning");
      return;
    }

    let allocatedCount = 0;
    setOrders(prev => prev.map(o => {
      if (selectedRowIds.includes(o.id) && o.status === "NEW") {
        allocatedCount++;
        return { ...o, status: "ALLOCATED" };
      }
      return o;
    }));

    if (allocatedCount > 0) {
      showToast(`${allocatedCount} orders allocated successfully`, "success");
      setSelectedRowIds([]); // clear selection
      setModalType(null); // close modal if it was open
    } else {
      showToast("Selected orders are not in NEW status", "info");
    }
  };

  const handleStartPicking = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "PICKING" } : o));
    showToast("Order moved to Picking", "success");
    closeModal();
  };

  const handleCancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "CANCELLED" } : o));
    showToast("Order cancelled", "success");
    closeModal();
  };

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">
            {t("ordersManagement")}
          </h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            {t("ordersSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => openModal("import")} className="
            flex items-center gap-1.5 px-3 h-9 rounded-lg border text-[13px] font-medium
            bg-dash-card border-dash-card-border text-text-body
            shadow-[0_1px_2px_rgba(9,20,38,0.05)]
            hover:border-brand hover:text-brand transition-colors
          ">
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            {t("import")}
          </button>
          <button onClick={handleBatchAllocate} className="
            flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold
            bg-brand text-white hover:bg-brand-hover transition-colors
            shadow-[0_2px_8px_rgba(20,102,192,0.35)]
          ">
            <span className="material-symbols-outlined text-[16px]">library_add_check</span>
            {t("batchAllocate")} {selectedRowIds.length > 0 && `(${selectedRowIds.length})`}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* ── Orders Table ────────────────────────────── */}
      <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-dim pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="
                  pl-8 pr-3 h-9 w-52 rounded-lg border text-[13px]
                  bg-dash-card border-dash-card-border text-text-body
                  placeholder:text-text-dim
                  focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30
                  transition-colors
                "
              />
            </div>

            {/* Filter button */}
            <button onClick={() => openModal("filter")} className="
              flex items-center gap-1.5 px-3 h-9 rounded-lg border text-[13px] font-medium
              bg-dash-card border-dash-card-border text-text-muted
              hover:border-brand hover:text-brand transition-colors
            ">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              {t("filter")}
            </button>

            {/* Status tabs */}
            <div className="hidden md:flex items-center gap-1">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-3 h-7 rounded-md text-[12px] font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-brand text-white shadow-sm"
                      : "text-text-muted hover:text-brand hover:bg-brand-light"
                  }`}
                >
                  {t(tab.toLowerCase())}
                </button>
              ))}
            </div>
          </div>

          <span className="text-[12px] text-text-dim shrink-0">
            {filtered.length === 0
              ? t("noResultsFound")
              : `${t("showingResults")} ${startRow}–${endRow} of ${filtered.length}`}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-dash-header-bg border-b border-dash-card-border">
              <tr>
                <th className="px-4 py-2.5 w-10 text-center">
                  <input 
                    type="checkbox" 
                    checked={pageRows.length > 0 && selectedRowIds.length === pageRows.length}
                    onChange={(e) => toggleAllRows(e.target.checked)}
                    className="w-4 h-4 rounded border-dash-card-border accent-brand cursor-pointer" 
                  />
                </th>
                {TABLE_HEADERS.map(({ label, align }) => (
                  <th
                    key={label}
                    className={`px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em] text-${align}`}
                  >
                    {label ? t(label) : ""}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[13px] text-text-dim">
                    {t("noResultsFound")}
                  </td>
                </tr>
              ) : (
                pageRows.map((order, idx) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`group cursor-pointer hover:bg-dash-row-hover transition-colors ${idx < pageRows.length - 1 ? "border-b border-dash-divider" : ""}`}
                  >
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={selectedRowIds.includes(order.id)}
                        onChange={(e) => toggleRow(order.id, e.target.checked)}
                        className="w-4 h-4 rounded border-dash-card-border accent-brand cursor-pointer" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-semibold font-mono text-brand hover:underline cursor-pointer">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${channelCls[order.channel] ?? "text-text-muted bg-gray-100"}`}>
                        {order.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-text-body">{order.customer}</td>
                    <td className="px-4 py-3 text-[13px] font-mono text-text-muted text-right">{order.items}</td>
                    <td className="px-4 py-3 text-[13px] font-bold font-mono text-text-heading text-right">{order.total}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <StatusPill status={order.status} />
                        {idx % 3 === 0 && (
                          <span className="text-[9px] font-bold bg-[#00b894]/10 text-[#00b894] px-1.5 py-0.5 rounded uppercase tracking-wider">Tasks: 2</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">
                      {new Date(order.due).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => openModal("menu", order)} className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-7 h-7 rounded-lg mx-auto text-text-dim hover:text-brand hover:bg-brand-light transition-all">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-dash-header-bg border-t border-dash-divider">
          <span className="text-[12px] text-text-dim">
            {filtered.length === 0 ? `0 ${t("noResults")}` : `${startRow}–${endRow} of ${filtered.length} ${t("noResults")}`}
          </span>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg border text-[13px] border-dash-card-border bg-dash-card text-text-muted hover:border-brand hover:text-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-dash-card-border disabled:hover:text-text-muted"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {/* Page numbers */}
            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex items-center justify-center w-8 h-8 rounded-lg border text-[12px] font-medium transition-colors ${
                  n === safePage
                    ? "bg-brand text-white border-brand shadow-sm"
                    : "bg-dash-card border-dash-card-border text-text-muted hover:border-brand hover:text-brand"
                }`}
              >
                {n}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex items-center justify-center w-8 h-8 rounded-lg border text-[13px] border-dash-card-border bg-dash-card text-text-muted hover:border-brand hover:text-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-dash-card-border disabled:hover:text-text-muted"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Import Modal ────────────────────────────── */}
      {modalOpen && modalType === "import" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("importOrders")}</h3>
              <button onClick={closeModal} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="border-2 border-dashed border-dash-card-border rounded-lg p-6 text-center hover:border-brand hover:bg-brand-light/5 transition-colors cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-light mx-auto mb-2">
                  <span className="material-symbols-outlined text-[20px] text-brand">cloud_upload</span>
                </div>
                <p className="text-[13px] font-semibold text-text-body">{t("dragAndDrop")}</p>
                <p className="text-[12px] text-text-dim mt-1">{t("csvFilesOnly")}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("sampleFile")}</label>
                <button className="w-full px-3 h-8 rounded-lg border border-dash-card-border text-[12px] text-text-dim hover:text-brand hover:border-brand transition-colors flex items-center gap-1 justify-center">
                  <span className="material-symbols-outlined text-[16px]">download</span>{t("downloadTemplate")}
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold text-text-body bg-dash-header-bg hover:bg-dash-divider transition-colors">{t("cancel")}</button>
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors">{t("import")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Filter Modal ────────────────────────────– */}
      {modalOpen && modalType === "filter" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("filterOrders")}</h3>
              <button onClick={closeModal} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("status")}</label>
                <select className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors">
                  <option>{t("allStatuses")}</option>
                  <option>{t("new")}</option>
                  <option>{t("picking")}</option>
                  <option>{t("packed")}</option>
                  <option>{t("shipped")}</option>
                  <option>{t("delivered")}</option>
                  <option>{t("exception")}</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("channel")}</label>
                <select className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors">
                  <option>{t("allChannels")}</option>
                  <option>Shopify</option>
                  <option>Amazon</option>
                  <option>Manual</option>
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

      {/* ── Batch Allocate Modal ────────────────────– */}
      {modalOpen && modalType === "batch" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("batchAllocate")}</h3>
              <button onClick={closeModal} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("selectWarehouse")}</label>
                <select className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors">
                  <option>{t("chooseWarehouse")}</option>
                  <option>Warehouse Alpha</option>
                  <option>Warehouse Beta</option>
                  <option>Warehouse Gamma</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("priority")}</label>
                <select className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors">
                  <option>{t("standard")}</option>
                  <option>{t("high")}</option>
                  <option>{t("urgent")}</option>
                </select>
              </div>
              <div className="bg-dash-header-bg rounded-lg p-3 space-y-2">
                <p className="text-[12px] font-semibold text-text-dim">{t("selectedOrders")} {filtered.filter(o => o.status === "NEW").length}</p>
                <p className="text-[11px] text-text-muted">{t("allocateMessage")}</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold text-text-body bg-dash-header-bg hover:bg-dash-divider transition-colors">{t("cancel")}</button>
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors">{t("allocate")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Actions Menu Modal ────────────────– */}
      {modalOpen && modalType === "menu" && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("orderActions")} - {selectedOrder.id}</h3>
              <button onClick={closeModal} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-4 space-y-2">
              <button onClick={closeModal} className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium text-text-body bg-dash-header-bg hover:bg-brand-light hover:text-brand transition-colors">
                <span className="material-symbols-outlined text-[18px]">visibility</span>{t("viewDetails")}
              </button>
              <button onClick={closeModal} className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium text-text-body bg-dash-header-bg hover:bg-brand-light hover:text-brand transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit</span>{t("editOrder")}
              </button>
              <button onClick={closeModal} className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium text-text-body bg-dash-header-bg hover:bg-red-100 hover:text-status-error transition-colors">
                <span className="material-symbols-outlined text-[18px]">close_circle</span>{t("cancelOrder")}
              </button>
              <button onClick={closeModal} className="w-full flex items-center gap-3 px-4 h-10 rounded-lg text-[13px] font-medium text-text-body bg-dash-header-bg hover:bg-brand-light hover:text-brand transition-colors">
                <span className="material-symbols-outlined text-[18px]">print</span>{t("printPackingSlip")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <OrderDetailDrawer 
        isOpen={modalOpen && modalType === "menu"} 
        onClose={closeModal} 
        order={selectedOrder} 
        onStartPicking={handleStartPicking}
        onCancelOrder={handleCancelOrder}
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
    <div className="
      bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3
      cursor-default
      shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]
      hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)]
      hover:border-brand/30 transition-all duration-200
    ">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{label}</p>
        <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${iconCls}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <p className="text-[30px] font-bold text-text-heading leading-none tracking-tight">{value}</p>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md ${trendCls}`}>
          <span className="material-symbols-outlined text-[12px]">
            {trend === "up" ? "arrow_upward" : "arrow_downward"}
          </span>
          <span className="text-[11px] font-bold">{change}</span>
        </div>
        {sub && <span className="text-[11px] text-text-dim">{sub}</span>}
      </div>
    </div>
  );
}
