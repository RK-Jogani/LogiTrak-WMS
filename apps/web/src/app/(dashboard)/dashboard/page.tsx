"use client";

import { StatusPill } from "@/components/ui/StatusPill";
import { useLanguageStore } from "@/store/languageStore";

/* ─── data ─────────────────────────────────────────── */
const kpis = [
  {
    label:   "totalOrders",
    value:   "1,284",
    change:  "+12.5%",
    sub:     "vsLastWeek",
    trend:   "up" as const,
    icon:    "shopping_cart",
    iconCls: "text-brand bg-brand-light",
    trendCls:"text-status-success bg-green-50",
  },
  {
    label:   "unitsShipped",
    value:   "8,421",
    change:  "+8.2%",
    sub:     "vsLastWeek",
    trend:   "up" as const,
    icon:    "local_shipping",
    iconCls: "text-status-success bg-green-50",
    trendCls:"text-status-success bg-green-50",
  },
  {
    label:   "inventoryAccuracy",
    value:   "99.2%",
    change:  "+0.1%",
    sub:     "vsLastCycle",
    trend:   "up" as const,
    icon:    "fact_check",
    iconCls: "text-purple-600 bg-purple-50",
    trendCls:"text-status-success bg-green-50",
  },
  {
    label:   "exceptions",
    value:   "7",
    change:  "needsAttention",
    sub:     "",
    trend:   "down" as const,
    icon:    "warning",
    iconCls: "text-status-warning bg-amber-50",
    trendCls:"text-status-warning bg-amber-50",
  },
];

const recentOrders = [
  { id: "ORD-2024-1284", channel: "Shopify",  customer: "Acme Industries",    items: 5,  status: "PICKING",   due: "Today"    },
  { id: "ORD-2024-1283", channel: "Amazon",   customer: "Global Supplies Co.", items: 12, status: "PACKED",    due: "Today"    },
  { id: "ORD-2024-1282", channel: "Manual",   customer: "Baker Electronics",   items: 3,  status: "NEW",       due: "Tomorrow" },
  { id: "ORD-2024-1281", channel: "Shopify",  customer: "Summit Logistics",    items: 8,  status: "SHIPPED",   due: "Jun 22"   },
  { id: "ORD-2024-1280", channel: "Amazon",   customer: "Pinnacle Parts",      items: 1,  status: "DELIVERED", due: "Jun 21"   },
];

const channelCls: Record<string, string> = {
  Shopify: "text-status-success bg-green-50",
  Amazon:  "text-status-warning bg-amber-50",
  Manual:  "text-purple-600 bg-purple-50",
};

const recentActivity = [
  { action: "Order ORD-2024-1284 moved to Picking",  user: "J. Smith", time: "2 min ago",  icon: "inventory_2",    iconCls: "text-brand bg-brand-light"        },
  { action: "Receiving completed for PO-8820",        user: "M. Davis", time: "15 min ago", icon: "forklift",       iconCls: "text-status-success bg-green-50"  },
  { action: "Cycle count ADT-2024-104 started",       user: "System",   time: "30 min ago", icon: "fact_check",     iconCls: "text-status-warning bg-amber-50"  },
  { action: "Carrier rate update: FedEx Ground",      user: "Admin",    time: "1 hr ago",   icon: "local_shipping", iconCls: "text-text-muted bg-gray-100"       },
  { action: "User b.williams@logitrack.com joined",   user: "System",   time: "2 hrs ago",  icon: "person_add",     iconCls: "text-status-success bg-green-50"  },
];

const zones = [
  { name: "zoneA", label: "receiving",    fill: 42 },
  { name: "zoneB", label: "bulkStorage", fill: 78 },
  { name: "zoneC", label: "highValue",   fill: 91 },
  { name: "zoneD", label: "pickFace",    fill: 65 },
  { name: "zoneE", label: "outbound",     fill: 34 },
];

/* ═══════════════════════════════════════════════════ */
import { useState } from "react";

export default function DashboardPage() {
  const { t } = useLanguageStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"export" | "newOrder" | null>(null);

  const openModal = (type: typeof modalType) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">
            {t("dashboard")}
          </h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            {t("warehouseName")} — {t("realTimeOpsOverview")}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => openModal("export")} className="
            flex items-center gap-1.5 px-3 h-9 rounded-lg capitalize cursor-pointer border text-[13px] font-medium
            bg-dash-card border-dash-card-border text-text-body
            shadow-[0_1px_2px_rgba(9,20,38,0.05)]
            hover:border-brand hover:text-brand transition-colors
          ">
            <span className="material-symbols-outlined text-[16px]">download</span>
            {t("exportBtn")}
          </button>

          <button onClick={() => openModal("newOrder")} className="
            flex items-center gap-1.5 px-4 h-9 rounded-lg cursor-pointer text-[13px] font-semibold
            bg-brand text-white hover:opacity-80 duration-500 transition-colors
            shadow-[0_2px_8px_rgba(20,102,192,0.35)]
          ">
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            {t("createNewOrder")}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* ── Main Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Recent Orders */}
        <div className="lg:col-span-8 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <CardHeader title={t("recentOrders")} link="/orders" linkLabel={t("viewAll")} />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-dash-header-bg border-b border-dash-card-border">
                <tr>
                  {[t("orderIdCol"), t("channelCol"), t("customerCol"), t("itemsCol"), t("statusCol"), t("dueCol")].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em] ${i === 3 ? "text-right" : i === 4 ? "text-center" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr
                    key={o.id}
                    className={`hover:bg-dash-row-hover transition-colors ${i < recentOrders.length - 1 ? "border-b border-dash-divider" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-semibold font-mono text-brand hover:underline cursor-pointer">
                        {o.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${channelCls[o.channel] ?? "text-text-muted bg-gray-100"}`}>
                        {o.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium text-text-body">{o.customer}</td>
                    <td className="px-4 py-3 text-[13px] font-mono text-text-muted text-right">{o.items}</td>
                    <td className="px-4 py-3 text-center"><StatusPill status={o.status} /></td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">{o.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)] flex flex-col">
          <CardHeader title={t("systemStatusActive")} />

          <div className="flex-1 overflow-y-auto divide-y divide-dash-divider">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-dash-row-hover transition-colors">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5 ${a.iconCls}`}>
                  <span className="material-symbols-outlined text-[16px]">{a.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-text-body leading-snug">{a.action}</p>
                  <p className="text-[11px] text-text-dim mt-0.5">{a.user} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Zone Utilization ────────────────────────── */}
      <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
        <CardHeader title={t("zones")} link="/warehouses" linkLabel={t("viewAll")} />

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {zones.map((z) => {
            const warn = z.fill > 85;
            return (
              <a
                key={z.name}
                href={`/warehouses/${z.name}`}
                className={`
                  bg-dash-inner-card border rounded-xl p-4 cursor-pointer
                  transition-all duration-200
                  hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)]
                  ${warn
                    ? "border-amber-200 hover:border-amber-400"
                    : "border-dash-card-border hover:border-brand/40"}
                `}
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${warn ? "bg-amber-50 text-status-warning" : "bg-brand-light text-brand"}`}>
                    <span className="material-symbols-outlined text-[16px]">warehouse</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 rounded ${warn ? "text-status-warning bg-amber-50" : "text-brand bg-brand-light"}`}>
                    {z.name}
                  </span>
                </div>

                <p className="text-[13px] font-semibold text-text-body mb-2">{z.label}</p>

                {/* Bar */}
                <div className="h-1.5 rounded-full bg-[#e8edf5] overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${warn ? "bg-status-warning" : "bg-brand"}`}
                    style={{ width: `${z.fill}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className={`text-[11px] ${warn ? "text-status-warning font-semibold" : "text-text-dim"}`}>
                    {warn ? t("nearCapacity") : t("normal")}
                  </p>
                  <span className={`text-[12px] font-bold font-mono ${warn ? "text-status-warning" : "text-text-muted"}`}>
                    {z.fill}%
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Export Modal ────────────────────────────── */}
      {modalOpen && modalType === "export" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-sm bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-light mx-auto">
                <span className="material-symbols-outlined text-[24px] text-brand">download</span>
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-text-heading">{t("exportDashboard")}</h3>
                <p className="text-[13px] text-text-muted mt-2">{t("exportDescription")}</p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button onClick={closeModal} className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand-light text-brand hover:bg-brand hover:text-white transition-colors">
                  {t("exportCSV")}
                </button>
                <button onClick={closeModal} className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand-light text-brand hover:bg-brand hover:text-white transition-colors">
                  {t("exportPDF")}
                </button>
                <button onClick={closeModal} className="px-4 h-9 rounded-lg text-[13px] font-semibold text-text-body bg-dash-header-bg hover:bg-dash-divider transition-colors">
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── New Order Modal ─────────────────────────── */}
      {modalOpen && modalType === "newOrder" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("createNewOrder")}</h3>
              <button onClick={closeModal} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] mb-1.5">{t("customerName")}</label>
                <input type="text" placeholder={t("enterCustomerName")} className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] mb-1.5">{t("channel")}</label>
                <select className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors">
                  <option>{t("shopify")}</option>
                  <option>{t("amazon")}</option>
                  <option>{t("manual")}</option>
                  <option>{t("api")}</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold text-text-body bg-dash-header-bg hover:bg-dash-divider transition-colors">{t("cancel")}</button>
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors">{t("create")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ─── Card Header ──────────────────────────────────── */
function CardHeader({ title, link, linkLabel }: { title: string; link?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-brand" />
        <h3 className="text-[14px] font-semibold text-text-heading">{title}</h3>
      </div>
      {link && (
        <a href={link} className="flex items-center gap-0.5 text-[12px] text-text-dim hover:text-brand transition-colors">
          {linkLabel}
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </a>
      )}
    </div>
  );
}

/* ─── KPI Card ─────────────────────────────────────── */
function KpiCard({
  label, value, change, sub, trend, icon, iconCls, trendCls,
}: {
  label: string; value: string; change: string; sub: string;
  trend: "up" | "down"; icon: string; iconCls: string; trendCls: string;
}) {
  return (
    <div className="
      bg-dash-card border border-dash-card-border rounded-xl p-4
      flex flex-col gap-3 cursor-default
      shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]
      hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)]
      hover:border-brand/30 transition-all duration-200
    ">
      {/* Label + icon */}
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{label}</p>
        <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${iconCls}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>

      {/* Value */}
      <p className="text-[30px] font-bold text-text-heading leading-none tracking-tight">{value}</p>

      {/* Trend badge */}
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


