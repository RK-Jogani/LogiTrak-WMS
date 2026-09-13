"use client";

import { useState, Fragment } from "react";
import { useLanguageStore } from "@/store/languageStore";

interface ActivityLog {
  id: string;
  timestamp: string;
  category: "INVENTORY" | "ORDERS" | "WAREHOUSE" | "SHIPPING" | "RETURNS" | "USERS" | "SYSTEM";
  eventType: string;
  description: string;
  entity: string;
  warehouse: string;
  performedBy: string;
  ipAddress: string;
  severity: "INFO" | "WARNING" | "ERROR";
}

const mockLogs: ActivityLog[] = [
  { id: "1", timestamp: "Jun 28, 2024 10:45 AM", category: "INVENTORY", eventType: "Stock Adjustment",   description: "Manual stock adjustment for SKU-101-A",               entity: "SKU-101-A",       warehouse: "WH-Alpha", performedBy: "Maria Garcia",  ipAddress: "192.168.1.100", severity: "INFO"    },
  { id: "2", timestamp: "Jun 28, 2024 10:32 AM", category: "ORDERS",    eventType: "Order Allocated",    description: "Order ORD-2024-1285 allocated to picking",           entity: "ORD-2024-1285",   warehouse: "WH-Alpha", performedBy: "System",        ipAddress: "10.0.0.1",      severity: "INFO"    },
  { id: "3", timestamp: "Jun 28, 2024 10:15 AM", category: "WAREHOUSE", eventType: "Zone Replenishment", description: "Zone A replenishment completed",                     entity: "ZONE-A",          warehouse: "WH-Alpha", performedBy: "John Smith",    ipAddress: "192.168.1.105", severity: "INFO"    },
  { id: "4", timestamp: "Jun 28, 2024 9:50 AM",  category: "SHIPPING",  eventType: "Shipment Created",   description: "Shipment SHP-2024-001 created and label generated", entity: "SHP-2024-001",    warehouse: "WH-Alpha", performedBy: "System",        ipAddress: "10.0.0.1",      severity: "INFO"    },
  { id: "5", timestamp: "Jun 28, 2024 9:30 AM",  category: "USERS",     eventType: "User Login",         description: "User logged in successfully",                       entity: "USER-james.wilson",warehouse: "WH-Alpha", performedBy: "System",        ipAddress: "192.168.1.110", severity: "INFO"    },
  { id: "6", timestamp: "Jun 28, 2024 8:45 AM",  category: "RETURNS",   eventType: "Return Processed",   description: "Return RET-2024-005 inspected and approved",        entity: "RET-2024-005",    warehouse: "WH-Alpha", performedBy: "Sarah Davis",   ipAddress: "192.168.1.95",  severity: "INFO"    },
  { id: "7", timestamp: "Jun 28, 2024 8:20 AM",  category: "SYSTEM",    eventType: "Sync Error",         description: "Ecommerce channel sync failed - API timeout",       entity: "CHANNEL-SHOPIFY", warehouse: "N/A",       performedBy: "System",        ipAddress: "10.0.0.5",      severity: "ERROR"   },
  { id: "8", timestamp: "Jun 28, 2024 7:30 AM",  category: "WAREHOUSE", eventType: "Cycle Count",        description: "Zone B cycle count initiated",                      entity: "ZONE-B",          warehouse: "WH-Alpha", performedBy: "System",        ipAddress: "10.0.0.1",      severity: "INFO"    },
];

const categoryColors: Record<string, string> = {
  INVENTORY: "text-green-600 bg-green-50",
  ORDERS:    "text-brand bg-brand-light",
  WAREHOUSE: "text-blue-600 bg-blue-50",
  SHIPPING:  "text-purple-600 bg-purple-50",
  RETURNS:   "text-orange-600 bg-orange-50",
  USERS:     "text-indigo-600 bg-indigo-50",
  SYSTEM:    "text-gray-600 bg-gray-100",
};

const severityColors: Record<string, string> = {
  INFO:    "text-text-muted bg-gray-50",
  WARNING: "text-status-warning bg-amber-50",
  ERROR:   "text-status-error bg-red-50",
};

export default function ActivityLogsPage() {
  const { t } = useLanguageStore();
  const [search,         setSearch]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [expandedLog,    setExpandedLog]    = useState<string | null>(null);

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch   = search === "" ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === null || log.category === categoryFilter;
    const matchesSeverity = severityFilter === null || log.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const kpis = [
    { label: t("eventsToday"),    value: "142", icon: "event",    iconCls: "text-brand bg-brand-light" },
    { label: t("userActions"),    value: "38",  icon: "person",   iconCls: "text-brand bg-brand-light" },
    { label: t("systemEvents"),   value: "104", icon: "settings", iconCls: "text-status-success bg-green-50" },
    { label: t("warningsErrors"), value: "5",   icon: "warning",  iconCls: "text-status-error bg-red-50" },
  ];

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("activityLogsTitle")}</h1>
        <p className="text-[13px] text-text-muted mt-0.5">{t("activityLogsSubtitle")}</p>
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

      {/* Filters */}
      <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Date Range */}
          <div className="space-y-1">
            <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("dateRange")}</label>
            <input type="date" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-header-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
          </div>

          {/* Category Filter */}
          <div className="space-y-1">
            <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("category")}</label>
            <select value={categoryFilter || ""} onChange={(e) => setCategoryFilter(e.target.value === "" ? null : e.target.value)}
              className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-header-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
              <option value="">{t("allCategories")}</option>
              <option value="INVENTORY">{t("inventory")}</option>
              <option value="ORDERS">{t("orders")}</option>
              <option value="WAREHOUSE">{t("warehouse")}</option>
              <option value="SHIPPING">{t("shipping")}</option>
              <option value="RETURNS">{t("returns")}</option>
              <option value="USERS">Users</option>
              <option value="SYSTEM">System</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="space-y-1">
            <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("severity")}</label>
            <select value={severityFilter || ""} onChange={(e) => setSeverityFilter(e.target.value === "" ? null : e.target.value)}
              className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-header-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
              <option value="">{t("allSeverities")}</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
            </select>
          </div>

          {/* Search */}
          <div className="space-y-1">
            <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("search")}</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-dim pointer-events-none">search</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchEvents")}
                className="pl-8 pr-3 h-9 w-full rounded-lg border text-[13px] bg-dash-header-bg border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-dash-header-bg border-b border-dash-card-border">
              <tr>
                {[t("timestamp"), t("category"), t("eventCol"), t("entityCol"), t("warehouseCol"), t("performedByCol"), t("severity"), ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-[13px] text-text-dim">{t("noLogsFound")}</td></tr>
              ) : filteredLogs.map((log, idx) => (
                <Fragment key={log.id}>
                  <tr className={`hover:bg-dash-row-hover cursor-pointer transition-colors ${idx < filteredLogs.length - 1 ? "border-b border-dash-divider" : ""}`}
                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}>
                    <td className="px-4 py-3 text-[12px] text-text-muted">{log.timestamp}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold ${categoryColors[log.category]}`}>{log.category}</span></td>
                    <td className="px-4 py-3 text-[13px] text-text-body font-medium">{log.eventType}</td>
                    <td className="px-4 py-3 text-[12px] font-mono text-brand">{log.entity}</td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">{log.warehouse}</td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">{log.performedBy}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold ${severityColors[log.severity]}`}>{log.severity}</span></td>
                    <td className="px-4 py-3 text-center">
                      <span className="material-symbols-outlined text-[16px] text-text-dim" style={{ transform: expandedLog === log.id ? "rotate(180deg)" : "none" }}>expand_more</span>
                    </td>
                  </tr>
                  {expandedLog === log.id && (
                    <tr className={`${idx < filteredLogs.length - 1 ? "border-b border-dash-divider" : ""}`}>
                      <td colSpan={8} className="px-4 py-4 bg-dash-header-bg">
                        <div className="space-y-2 text-[12px]">
                          <p className="text-text-body"><span className="font-semibold text-text-heading">{t("descriptionField")}:</span> {log.description}</p>
                          <p className="text-text-body"><span className="font-semibold text-text-heading">{t("ipAddressField")}:</span> {log.ipAddress}</p>
                          <div className="pt-2 border-t border-dash-divider">
                            <p className="text-text-heading font-semibold mb-2">{t("beforeAfterValues")}:</p>
                            <div className="space-y-1 pl-4 border-l-2 border-brand">
                              <p className="text-text-body"><span className="text-status-error">{t("beforeLabel")}:</span> Qty: 100</p>
                              <p className="text-text-body"><span className="text-status-success">{t("afterLabel")}:</span> Qty: 95</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 px-4 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
          <span className="material-symbols-outlined text-[16px]">download</span>{t("exportLogsCSV")}
        </button>
      </div>
    </div>
  );
}
