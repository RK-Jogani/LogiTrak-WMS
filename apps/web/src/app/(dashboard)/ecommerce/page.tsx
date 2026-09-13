"use client";

import { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";

interface Channel {
  id: string;
  name: string;
  status: "CONNECTED" | "DISCONNECTED" | "SYNCING";
  lastSync: string;
  productsSynced: number;
  ordersToday: number;
  enabled: boolean;
}

interface EcommerceProduct {
  id: string;
  sku: string;
  name: string;
  channel: string;
  listingId: string;
  price: number;
  stockQty: number;
  channelStock: number;
  syncStatus: "SYNCED" | "OUT_OF_SYNC" | "ERROR";
  lastUpdated: string;
}

interface SyncEvent {
  id: string;
  timestamp: string;
  channel: string;
  type: "ORDER_IMPORT" | "INVENTORY_PUSH" | "PRODUCT_SYNC" | "SHIPMENT_UPDATE";
  recordsProcessed: number;
  errors: number;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
}

const mockChannels: Channel[] = [
  { id: "1", name: "Shopify",     status: "CONNECTED",    lastSync: "2 min ago",      productsSynced: 450, ordersToday: 12, enabled: true  },
  { id: "2", name: "Amazon",      status: "CONNECTED",    lastSync: "5 min ago",      productsSynced: 620, ordersToday: 8,  enabled: true  },
  { id: "3", name: "WooCommerce", status: "SYNCING",      lastSync: "Processing...",  productsSynced: 280, ordersToday: 3,  enabled: true  },
  { id: "4", name: "eBay",        status: "DISCONNECTED", lastSync: "1 hour ago",     productsSynced: 150, ordersToday: 0,  enabled: false },
];

const mockProducts: EcommerceProduct[] = [
  { id: "1", sku: "SKU-101-A", name: "Widget Pro X",  channel: "Shopify",     listingId: "SHP-12345", price: 49.99, stockQty: 150, channelStock: 150, syncStatus: "SYNCED",      lastUpdated: "Jun 28, 10:30 AM" },
  { id: "2", sku: "SKU-102-B", name: "Gadget Plus",   channel: "Amazon",      listingId: "AMZ-67890", price: 79.99, stockQty: 80,  channelStock: 75,  syncStatus: "OUT_OF_SYNC", lastUpdated: "Jun 28, 9:15 AM"  },
  { id: "3", sku: "SKU-103-C", name: "Device Lite",   channel: "Shopify",     listingId: "SHP-54321", price: 29.99, stockQty: 200, channelStock: 198, syncStatus: "SYNCED",      lastUpdated: "Jun 28, 10:45 AM" },
  { id: "4", sku: "SKU-104-D", name: "Tool Master",   channel: "WooCommerce", listingId: "WOO-11111", price: 99.99, stockQty: 45,  channelStock: 0,   syncStatus: "ERROR",       lastUpdated: "Jun 28, 8:30 AM"  },
];

const mockSyncEvents: SyncEvent[] = [
  { id: "1", timestamp: "Jun 28, 2024 10:45 AM", channel: "Shopify",     type: "INVENTORY_PUSH",  recordsProcessed: 450, errors: 0, status: "SUCCESS" },
  { id: "2", timestamp: "Jun 28, 2024 10:35 AM", channel: "Amazon",      type: "ORDER_IMPORT",    recordsProcessed: 8,   errors: 0, status: "SUCCESS" },
  { id: "3", timestamp: "Jun 28, 2024 10:20 AM", channel: "WooCommerce", type: "PRODUCT_SYNC",    recordsProcessed: 280, errors: 2, status: "PARTIAL" },
  { id: "4", timestamp: "Jun 28, 2024 9:50 AM",  channel: "Shopify",     type: "SHIPMENT_UPDATE", recordsProcessed: 12,  errors: 0, status: "SUCCESS" },
];

const statusCls: Record<string, string> = {
  CONNECTED:   "text-status-success bg-green-50",
  DISCONNECTED:"text-status-error bg-red-50",
  SYNCING:     "text-status-warning bg-amber-50",
  SYNCED:      "text-status-success bg-green-50",
  OUT_OF_SYNC: "text-status-warning bg-amber-50",
  ERROR:       "text-status-error bg-red-50",
  SUCCESS:     "text-status-success bg-green-50",
  PARTIAL:     "text-status-warning bg-amber-50",
  FAILED:      "text-status-error bg-red-50",
};

export default function EcommercePage() {
  const { t } = useLanguageStore();
  const [activeTab,      setActiveTab]      = useState<"CHANNELS" | "PRODUCTS" | "SYNC_LOG">("CHANNELS");
  const [configModal,    setConfigModal]    = useState(false);
  const [selectedChannel,setSelectedChannel]= useState<Channel | null>(null);

  const kpis = [
    { label: t("connectedChannels"),  value: mockChannels.filter(c => c.status === "CONNECTED").length.toString(),              icon: "link",        iconCls: "text-brand bg-brand-light" },
    { label: t("ordersSyncedToday"),  value: mockChannels.reduce((sum, c) => sum + c.ordersToday, 0).toString(),                icon: "inbox",       iconCls: "text-brand bg-brand-light" },
    { label: t("productsSynced"),     value: mockChannels.reduce((sum, c) => sum + c.productsSynced, 0).toString(),             icon: "inventory_2", iconCls: "text-status-success bg-green-50" },
    { label: t("syncErrors"),         value: mockProducts.filter(p => p.syncStatus === "ERROR").length.toString(),              icon: "error",       iconCls: "text-status-error bg-red-50" },
  ];

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("ecommerceChannels")}</h1>
        <p className="text-[13px] text-text-muted mt-0.5">{t("ecommerceSubtitle")}</p>
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
        {(["CHANNELS", "PRODUCTS", "SYNC_LOG"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === tab ? "text-brand border-brand" : "text-text-muted border-transparent hover:text-text-body"
            }`}>
            {tab === "CHANNELS" ? t("channelsTab") : tab === "PRODUCTS" ? t("productsTab") : t("syncLogTab")}
          </button>
        ))}
      </div>

      {/* Channels Tab */}
      {activeTab === "CHANNELS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockChannels.map((channel) => (
            <div key={channel.id} className="bg-dash-card border border-dash-card-border rounded-xl p-4 space-y-3 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-text-heading">{channel.name}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-[5px] text-[10px] font-bold mt-1 ${statusCls[channel.status]}`}>
                    {channel.status}
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={channel.enabled} className="w-4 h-4 rounded accent-brand" />
                </label>
              </div>
              <div className="bg-dash-header-bg rounded-lg p-2 text-center">
                <p className="text-[24px]">{["🛍", "📦", "🌐", "🏪"][parseInt(channel.id) - 1]}</p>
              </div>
              <div className="space-y-1 text-[12px]">
                <div className="flex justify-between"><span className="text-text-dim">{t("lastSync")}:</span><span className="text-text-body font-medium">{channel.lastSync}</span></div>
                <div className="flex justify-between"><span className="text-text-dim">{t("products")}:</span><span className="text-text-body font-bold">{channel.productsSynced}</span></div>
                <div className="flex justify-between"><span className="text-text-dim">{t("ordersToday")}:</span><span className="text-text-body font-bold">{channel.ordersToday}</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setSelectedChannel(channel); setConfigModal(true); }}
                  className="flex-1 h-8 rounded-lg text-[12px] font-medium bg-dash-header-bg text-text-body hover:bg-brand-light hover:text-brand transition-colors">
                  {t("configureChannel")}
                </button>
                <button className="flex-1 h-8 rounded-lg text-[12px] font-medium border border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("syncNow")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "PRODUCTS" && (
        <>
          <div className="flex justify-end">
            <button className="px-4 h-9 rounded-lg text-[13px] font-semibold text-white bg-brand hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
              {t("bulkSync")}
            </button>
          </div>
          <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead className="bg-dash-header-bg border-b border-dash-card-border">
                  <tr>
                    {["SKU", t("productName"), t("channel"), t("listingId"), t("price"), t("stock"), t("channelStock"), t("syncStatus"), t("lastUpdated"), t("actions")].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockProducts.map((p, idx) => (
                    <tr key={p.id} className={`hover:bg-dash-row-hover transition-colors ${idx < mockProducts.length - 1 ? "border-b border-dash-divider" : ""}`}>
                      <td className="px-4 py-3 font-mono text-brand font-semibold">{p.sku}</td>
                      <td className="px-4 py-3 text-text-body">{p.name.substring(0, 15)}</td>
                      <td className="px-4 py-3 text-text-muted">{p.channel}</td>
                      <td className="px-4 py-3 font-mono text-text-dim text-[11px]">{p.listingId}</td>
                      <td className="px-4 py-3 font-bold text-text-body">${p.price}</td>
                      <td className="px-4 py-3 font-mono text-text-muted">{p.stockQty}</td>
                      <td className="px-4 py-3 font-mono text-text-muted">{p.channelStock}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold ${statusCls[p.syncStatus]}`}>{p.syncStatus}</span></td>
                      <td className="px-4 py-3 text-text-dim">{p.lastUpdated}</td>
                      <td className="px-4 py-3"><button className="text-brand font-semibold hover:text-brand-hover text-[11px]">{t("forceSync")}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Sync Log Tab */}
      {activeTab === "SYNC_LOG" && (
        <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-dash-header-bg border-b border-dash-card-border">
                <tr>
                  {[t("timestamp"), t("channel"), t("type"), t("records"), t("errorsCol"), t("status")].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockSyncEvents.map((evt, idx) => (
                  <tr key={evt.id} className={`hover:bg-dash-row-hover transition-colors ${idx < mockSyncEvents.length - 1 ? "border-b border-dash-divider" : ""}`}>
                    <td className="px-4 py-3 text-text-muted">{evt.timestamp}</td>
                    <td className="px-4 py-3 text-text-body font-semibold">{evt.channel}</td>
                    <td className="px-4 py-3 text-text-muted">{evt.type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 font-mono text-text-body font-bold">{evt.recordsProcessed}</td>
                    <td className={`px-4 py-3 font-mono font-bold ${evt.errors > 0 ? "text-status-error" : "text-status-success"}`}>{evt.errors}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-semibold ${statusCls[evt.status]}`}>{evt.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {configModal && selectedChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setConfigModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("configureChannel")} {selectedChannel.name}</h3>
              <button onClick={() => setConfigModal(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form className="px-5 py-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("apiKey")}</label>
                <input type="password" placeholder="••••••••••••"
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("storeURL")}</label>
                <input type="url" placeholder="https://store.example.com"
                  className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("syncFrequency")}</label>
                <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors cursor-pointer">
                  <option>Real-time</option>
                  <option>Every 15 minutes</option>
                  <option>Hourly</option>
                  <option>Daily</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("syncOptions")}</p>
                {["Products", "Inventory", "Orders", "Shipment Status"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-brand" />
                    <span className="text-[13px] text-text-body">{opt}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setConfigModal(false)}
                  className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("cancel")}
                </button>
                <button type="submit"
                  className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                  {t("saveConfig")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
