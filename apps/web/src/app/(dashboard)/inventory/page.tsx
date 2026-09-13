"use client";

import { useState, useMemo } from "react";
import { StatusPill } from "@/components/ui/StatusPill";
import { useLanguageStore } from "@/store/languageStore";
import Link from "next/link";
import { ProductDetailDrawer } from "@/components/inventory/ProductDetailDrawer";
import { useToast } from "@/store/ToastContext";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

/* ─── Constants ─────────────────────────────────────── */
const PAGE_SIZE = 5;

/* ─── Full inventory dataset ────────────────────────── */
const ALL_INVENTORY = [
  { sku: "SKU-992-8A", name: "Industrial Bearings 50mm",   owner: "Acme Corp",    location: "A1-04-B", qty: 144,  status: "AVAILABLE", category: "Hardware"   },
  { sku: "SKU-411-2B", name: "Hex Bolts M12x50",           owner: "FastenerPro",  location: "B3-12-A", qty: 2000, status: "AVAILABLE", category: "Fasteners"  },
  { sku: "SKU-105-9C", name: "Hydraulic Pump Assy",         owner: "HeavyMech",    location: "C2-01-A", qty: 2,    status: "RESERVED",  category: "Pumps"      },
  { sku: "SKU-780-4D", name: "LED Panel 600x600",           owner: "BrightLux",    location: "D1-08-C", qty: 450,  status: "AVAILABLE", category: "Lighting"   },
  { sku: "SKU-330-7E", name: "Safety Harness Kit",          owner: "SafeGuard",    location: "A4-02-B", qty: 12,   status: "BLOCKED",   category: "Safety"     },
  { sku: "SKU-221-1F", name: "Pneumatic Cylinder 80mm",     owner: "AirFlow",      location: "B1-06-A", qty: 88,   status: "AVAILABLE", category: "Pneumatics" },
  { sku: "SKU-654-3G", name: "Steel Cable 10m Reel",        owner: "MetalLink",    location: "C3-09-B", qty: 320,  status: "AVAILABLE", category: "Hardware"   },
  { sku: "SKU-871-5H", name: "Gear Reducer 1:10",           owner: "HeavyMech",    location: "A2-11-A", qty: 5,    status: "RESERVED",  category: "Pumps"      },
  { sku: "SKU-143-6I", name: "PVC Conduit 20mm x 3m",       owner: "ElecParts",    location: "D4-02-C", qty: 750,  status: "AVAILABLE", category: "Lighting"   },
  { sku: "SKU-509-2J", name: "Torque Wrench 200Nm",         owner: "ToolMaster",   location: "B2-05-B", qty: 34,   status: "AVAILABLE", category: "Hardware"   },
  { sku: "SKU-388-9K", name: "Filter Cartridge 5 Micron",   owner: "PureFlow",     location: "C1-07-A", qty: 6,    status: "BLOCKED",   category: "Pumps"      },
  { sku: "SKU-720-1L", name: "Anti-Static Floor Mat",       owner: "SafeGuard",    location: "A3-03-B", qty: 60,   status: "AVAILABLE", category: "Safety"     },
];

const categoryColors: Record<string, string> = {
  Hardware:   "text-brand bg-brand-light",
  Fasteners:  "text-status-success bg-green-50",
  Pumps:      "text-purple-600 bg-purple-50",
  Lighting:   "text-amber-600 bg-amber-50",
  Safety:     "text-status-error bg-red-50",
  Pneumatics: "text-sky-600 bg-sky-50",
};

/* ═══════════════════════════════════════════════════ */
export default function InventoryPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();
  
  const [inventory, setInventory] = useState(ALL_INVENTORY);
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ sku: "", name: "", category: "", qty: 0 });
  const [addErrors, setAddErrors] = useState<Record<string, boolean>>({});

  const lowStockCount = inventory.filter(i => i.qty <= 10).length;

  /* KPI data — labels use translation keys */
  const kpis = [
    { label: t("totalSKUs"),       value: <AnimatedCounter value={inventory.length} />,   change: t("thisWeekChange"), sub: "",                   trend: "up"   as const, icon: "inventory_2", iconCls: "text-brand bg-brand-light",        trendCls: "text-status-success bg-green-50" },
    { label: t("totalUnits"),      value: <AnimatedCounter value={inventory.reduce((acc, curr) => acc + curr.qty, 0)} />, change: "+1.2%",             sub: t("vsLastWeek"),       trend: "up"   as const, icon: "category",    iconCls: "text-status-success bg-green-50",  trendCls: "text-status-success bg-green-50" },
    { label: t("lowStockAlerts"),  value: <AnimatedCounter value={lowStockCount} />,       change: t("actionRequired"), sub: "",                   trend: "down" as const, icon: "warning",     iconCls: "text-status-warning bg-amber-50",  trendCls: "text-status-warning bg-amber-50" },
    { label: t("avgTurnover"),     value: "4.2x",    change: t("monthlyRate"),    sub: "",                   trend: "up"   as const, icon: "autorenew",   iconCls: "text-purple-600 bg-purple-50",     trendCls: "text-purple-600 bg-purple-50" },
  ];

  /* filter by search */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inventory;
    return inventory.filter(
      (item) =>
        item.sku.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    );
  }, [search]);

  /* pagination */
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageRows    = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const startRow    = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endRow      = Math.min(safePage * PAGE_SIZE, filtered.length);

  const pageNumbers = useMemo(() => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, safePage - delta);
      i <= Math.min(totalPages, safePage + delta);
      i++
    ) range.push(i);
    return range;
  }, [safePage, totalPages]);

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  const handleAddProduct = () => {
    const errors: Record<string, boolean> = {};
    if (!newProduct.sku) errors.sku = true;
    if (!newProduct.name) errors.name = true;
    if (!newProduct.category) errors.category = true;

    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }

    const newItem = {
      ...newProduct,
      owner: "Acme Corp", // Mock owner
      location: "A1-New",
      status: newProduct.qty > 10 ? "AVAILABLE" : "LOW STOCK",
    };

    setInventory(prev => [newItem, ...prev]);
    showToast("Product added to inventory", "success");
    setShowAddModal(false);
    setNewProduct({ sku: "", name: "", category: "", qty: 0 });
    setAddErrors({});
  };

  const handleAdjustStock = (sku: string, newQty: number, reason: string) => {
    setInventory(prev => prev.map(item => {
      if (item.sku === sku) {
        const status = newQty > 10 ? "AVAILABLE" : (newQty > 0 ? "LOW STOCK" : "OUT OF STOCK");
        // Update selected product state as well so drawer reflects immediately
        if (selectedProduct && selectedProduct.sku === sku) {
          setSelectedProduct(prevDetail => ({ ...prevDetail, qty: newQty, available: newQty, status: status === "AVAILABLE" ? "In Stock" : "Low Stock" }));
        }
        return { ...item, qty: newQty, status };
      }
      return item;
    }));
    showToast(`Stock adjusted to ${newQty} units`, "success");
  };

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">
            {t("inventoryOverview")}
          </h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            {t("currentZone")} — {t("inventorySubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/inventory/audits"
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg border text-[13px] font-medium
              bg-dash-card border-dash-card-border text-text-body
              shadow-[0_1px_2px_rgba(9,20,38,0.05)]
              hover:border-brand hover:text-brand transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">fact_check</span>
            {t("auditsBtn")}
          </Link>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold
            bg-brand text-white hover:bg-brand-hover transition-colors
            shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            {t("addProduct")}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* ── Inventory Table ─────────────────────────── */}
      <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-dim pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t("searchSKU")}
                className="pl-8 pr-3 h-9 w-56 rounded-lg border text-[13px]
                  bg-dash-card border-dash-card-border text-text-body
                  placeholder:text-text-dim
                  focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30
                  transition-colors"
              />
            </div>

            <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border text-[13px] font-medium
              bg-dash-card border-dash-card-border text-text-muted
              hover:border-brand hover:text-brand transition-colors">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              {t("filter")}
            </button>
          </div>

          <span className="text-[12px] text-text-dim">
            {filtered.length === 0
              ? t("noResults")
              : `${t("showingResults")} ${startRow}–${endRow} of ${filtered.length}`}
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
                {[
                  { key: "SKU",             align: "left"   },
                  { key: t("productName"),  align: "left"   },
                  { key: t("category"),     align: "left"   },
                  { key: t("owner"),        align: "left"   },
                  { key: t("location"),     align: "left"   },
                  { key: t("qty"),          align: "right"  },
                  { key: t("status"),       align: "center" },
                  { key: "",               align: "center" },
                ].map(({ key, align }) => (
                  <th key={key} className={`px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em] text-${align}`}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[13px] text-text-dim">
                    {t("noItemsMatch")}
                  </td>
                </tr>
              ) : (
                pageRows.map((item, idx) => (
                  <tr
                    key={item.sku}
                    onClick={() => setSelectedProduct({ ...item, available: item.qty, reserved: 0, status: "In Stock" })}
                    className={`group cursor-pointer hover:bg-dash-row-hover transition-colors ${idx < pageRows.length - 1 ? "border-b border-dash-divider" : ""}`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" className="w-4 h-4 rounded border-dash-card-border accent-brand cursor-pointer" />
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-[12px] font-semibold font-mono text-brand hover:underline cursor-pointer">
                        {item.sku}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-[13px] font-medium text-text-body">{item.name}</td>

                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${categoryColors[item.category] ?? "text-text-muted bg-gray-100"}`}>
                        {item.category}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-[13px] text-text-muted">{item.owner}</td>

                    <td className="px-4 py-3">
                      <span className="text-[12px] font-mono font-medium text-text-body bg-dash-inner-card border border-dash-card-border px-2 py-0.5 rounded-md">
                        {item.location}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className={`text-[13px] font-bold font-mono ${item.qty <= 10 ? "text-status-warning" : "text-text-heading"}`}>
                        {item.qty.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <StatusPill status={item.status} />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-7 h-7 rounded-lg mx-auto text-text-dim hover:text-brand hover:bg-brand-light transition-all">
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
            {filtered.length === 0 ? `0 ${t("noResults")}` : `${startRow}–${endRow} of ${filtered.length} results`}
          </span>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-dash-card-border bg-dash-card text-text-muted
                hover:border-brand hover:text-brand transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-dash-card-border disabled:hover:text-text-muted"
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
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-dash-card-border bg-dash-card text-text-muted
                hover:border-brand hover:text-brand transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-dash-card-border disabled:hover:text-text-muted"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <ProductDetailDrawer 
        isOpen={selectedProduct !== null} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
        onAdjustStock={handleAdjustStock}
      />

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-xl border border-dash-card-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-lg font-semibold text-text-heading">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-dim hover:text-brand transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-body mb-1">SKU</label>
                <input 
                  type="text" 
                  value={newProduct.sku}
                  onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                  className={`w-full h-10 px-3 rounded-lg border ${addErrors.sku ? 'border-red-500' : 'border-dash-card-border'} bg-dash-bg text-text-body focus:outline-none focus:border-brand`}
                  placeholder="e.g. SKU-123-4A"
                />
                {addErrors.sku && <span className="text-xs text-red-500 mt-1">Required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-body mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className={`w-full h-10 px-3 rounded-lg border ${addErrors.name ? 'border-red-500' : 'border-dash-card-border'} bg-dash-bg text-text-body focus:outline-none focus:border-brand`}
                />
                {addErrors.name && <span className="text-xs text-red-500 mt-1">Required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-body mb-1">Category</label>
                <input 
                  type="text" 
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className={`w-full h-10 px-3 rounded-lg border ${addErrors.category ? 'border-red-500' : 'border-dash-card-border'} bg-dash-bg text-text-body focus:outline-none focus:border-brand`}
                  placeholder="e.g. Hardware"
                />
                {addErrors.category && <span className="text-xs text-red-500 mt-1">Required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-body mb-1">Initial Quantity</label>
                <input 
                  type="number" 
                  value={newProduct.qty}
                  onChange={e => setNewProduct({...newProduct, qty: Number(e.target.value)})}
                  className="w-full h-10 px-3 rounded-lg border border-dash-card-border bg-dash-bg text-text-body focus:outline-none focus:border-brand"
                />
              </div>
            </div>
            <div className="p-4 bg-dash-header-bg border-t border-dash-divider flex justify-end gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border border-dash-card-border text-text-body font-medium hover:bg-dash-row-hover transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddProduct}
                className="px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
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
