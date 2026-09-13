"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/languageStore";

/* ─── Data ──────────────────────────────────────────── */
const WAREHOUSES_DATA = [
  { id: "wh-alpha", name: "Warehouse Alpha", address: "1234 Industrial Blvd, Austin, TX",     zones: 5, locations: 3200, utilization: 78, status: "ACTIVE",      manager: "M. Rodriguez", skus: 1842 },
  { id: "wh-beta",  name: "Warehouse Beta",  address: "5678 Commerce Dr, Dallas, TX",          zones: 3, locations: 1800, utilization: 62, status: "ACTIVE",      manager: "S. Patel",     skus: 934  },
  { id: "wh-gamma", name: "Warehouse Gamma", address: "910 Logistics Way, Houston, TX",        zones: 4, locations: 2400, utilization: 91, status: "ACTIVE",      manager: "L. Chen",      skus: 2105 },
  { id: "wh-delta", name: "Warehouse Delta", address: "22 Harbor Rd, San Antonio, TX",         zones: 2, locations: 900,  utilization: 34, status: "MAINTENANCE", manager: "R. Torres",    skus: 412  },
];

/* ═══════════════════════════════════════════════════ */
export default function WarehousesPage() {
  const { t } = useLanguageStore();
  const [modalOpen,   setModalOpen]   = useState(false);
  const [search,      setSearch]      = useState("");
  const [form,        setForm]        = useState({ name: "", address: "", manager: "", zones: "", locations: "" });
  const [submitting,  setSubmitting]  = useState(false);

  const filtered = WAREHOUSES_DATA.filter((w) => {
    const q = search.toLowerCase();
    return !q || w.name.toLowerCase().includes(q) || w.address.toLowerCase().includes(q) || w.manager.toLowerCase().includes(q);
  });

  function closeModal() {
    setModalOpen(false);
    setForm({ name: "", address: "", manager: "", zones: "", locations: "" });
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    closeModal();
  }

  /* KPI summary values derived from data */
  const kpis = [
    { label: t("totalWarehouses"),         value: WAREHOUSES_DATA.length.toString(),                                           icon: "warehouse",      iconCls: "text-brand bg-brand-light",              trendCls: "text-brand bg-brand-light",              change: "", sub: "", trend: "up" as const },
    { label: t("activeWarehouses"),        value: WAREHOUSES_DATA.filter(w => w.status === "ACTIVE").length.toString(),         icon: "check_circle",   iconCls: "text-status-success bg-green-50",        trendCls: "text-status-success bg-green-50",        change: "", sub: "", trend: "up" as const },
    { label: t("totalWarehouseLocations"), value: WAREHOUSES_DATA.reduce((s,w) => s + w.locations, 0).toLocaleString(),         icon: "shelves",        iconCls: "text-purple-600 bg-purple-50",           trendCls: "text-purple-600 bg-purple-50",           change: "", sub: "", trend: "up" as const },
    { label: t("totalSKUsManaged"),        value: WAREHOUSES_DATA.reduce((s,w) => s + w.skus, 0).toLocaleString(),              icon: "inventory_2",    iconCls: "text-status-warning bg-amber-50",        trendCls: "text-status-warning bg-amber-50",        change: "", sub: "", trend: "up" as const },
  ];

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">

      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("warehousesTitle")}</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{t("warehousesSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold
              bg-brand text-white hover:bg-brand-hover transition-colors
              shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            {t("addWarehouseBtn")}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-2 cursor-default
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

      {/* ── Search bar ──────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-dim pointer-events-none">search</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchWarehouses")}
            className="pl-8 pr-3 h-9 w-56 rounded-lg border text-[13px]
              bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim
              focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
        </div>
        <span className="text-[12px] text-text-dim">{filtered.length} of {WAREHOUSES_DATA.length} facilities</span>
      </div>

      {/* ── Warehouse Cards Grid ─────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-dash-card border border-dash-card-border rounded-xl py-16 text-center text-[13px] text-text-dim shadow-[0_1px_3px_rgba(9,20,38,0.06)]">
          {t("noResults")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((wh) => {
            const warn        = wh.utilization > 85;
            const barColor    = warn ? "bg-status-warning" : "bg-brand";
            const statusActive = wh.status === "ACTIVE";
            return (
              <Link
                key={wh.id}
                href={`/warehouses/${wh.id}`}
                className="group bg-dash-card border border-dash-card-border rounded-xl p-5 flex flex-col gap-4
                  shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]
                  hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)]
                  hover:border-brand/40 transition-all duration-200"
              >
                {/* Top row: icon + status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-light text-brand group-hover:bg-brand group-hover:text-white transition-all duration-200">
                    <span className="material-symbols-outlined text-[22px]">warehouse</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    statusActive ? "bg-green-50 text-status-success" : "bg-amber-50 text-status-warning"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${statusActive ? "bg-status-success" : "bg-status-warning"}`} />
                    {statusActive ? t("activeStatus") : t("maintenanceStatus")}
                  </div>
                </div>

                {/* Name + address */}
                <div>
                  <h3 className="text-[15px] font-semibold text-text-heading mb-0.5 group-hover:text-brand transition-colors">
                    {wh.name}
                  </h3>
                  <p className="text-[12px] text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    {wh.address}
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 py-3 border-y border-dash-divider">
                  {[
                    { label: t("zones"),     value: wh.zones.toString()           },
                    { label: t("locations"), value: wh.locations.toLocaleString() },
                    { label: t("skus"),      value: wh.skus.toLocaleString()      },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-[18px] font-bold text-text-heading leading-tight">{value}</p>
                      <p className="text-[10px] font-semibold text-text-dim uppercase tracking-[0.06em] mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Utilization bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.06em]">{t("utilization")}</span>
                    <span className={`text-[12px] font-bold font-mono ${warn ? "text-status-warning" : "text-text-heading"}`}>
                      {wh.utilization}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#e8edf5] overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${wh.utilization}%` }} />
                  </div>
                  {warn && (
                    <p className="text-[11px] text-status-warning font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">warning</span>
                      {t("nearCapacity")}
                    </p>
                  )}
                </div>

                {/* Manager row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-light text-brand text-[10px] font-bold">
                      {wh.manager.charAt(0)}
                    </div>
                    <span className="text-[12px] text-text-muted">{wh.manager}</span>
                  </div>
                  <span className="text-[11px] text-brand font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("viewDetails")}
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Add Warehouse Modal ──────────────────────── */}
      {modalOpen && (
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
                <h3 className="text-[15px] font-semibold text-text-heading">{t("addWarehouseBtn")}</h3>
              </div>
              <button onClick={closeModal}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">
                  {t("warehouseNameField")} <span className="text-status-error">*</span>
                </label>
                <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="e.g. Warehouse Delta"
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body
                    placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("addressField")}</label>
                <input type="text" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})}
                  placeholder="Street, City, State"
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body
                    placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>

              {/* Manager */}
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("managerField")}</label>
                <input type="text" value={form.manager} onChange={(e) => setForm({...form, manager: e.target.value})}
                  placeholder="Manager full name"
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body
                    placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>

              {/* Zones + Locations row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("zonesField")}</label>
                  <input type="number" min="1" value={form.zones} onChange={(e) => setForm({...form, zones: e.target.value})}
                    placeholder="0"
                    className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body
                      placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("locationsField")}</label>
                  <input type="number" min="1" value={form.locations} onChange={(e) => setForm({...form, locations: e.target.value})}
                    placeholder="0"
                    className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body
                      placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button type="button" onClick={closeModal}
                  className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("cancel")}
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors
                    shadow-[0_2px_8px_rgba(20,102,192,0.35)] disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? t("saving") : t("addWarehouseBtn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
