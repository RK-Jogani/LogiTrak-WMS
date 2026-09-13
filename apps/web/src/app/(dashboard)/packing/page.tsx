"use client";

import { useState, useMemo } from "react";
import { useLanguageStore } from "../../../store/languageStore";

interface OrderForPacking {
  id: string;
  orderId: string;
  customer: string;
  channel: "SHOPIFY" | "AMAZON" | "MANUAL";
  items: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "READY" | "PACKING" | "PACKED" | "EXCEPTION";
}

interface PackLineItem {
  id: string;
  sku: string;
  productName: string;
  qtyExpected: number;
  qtyScanned: number;
  match: boolean;
}

const mockOrders: OrderForPacking[] = [
  { id: "1", orderId: "ORD-2024-1285", customer: "Acme Industries", channel: "SHOPIFY", items: 5, priority: "HIGH", status: "PACKING" },
  { id: "2", orderId: "ORD-2024-1286", customer: "Global Supplies", channel: "AMAZON", items: 8, priority: "MEDIUM", status: "READY" },
  { id: "3", orderId: "ORD-2024-1287", customer: "Summit Logistics", channel: "MANUAL", items: 3, priority: "LOW", status: "READY" },
  { id: "4", orderId: "ORD-2024-1288", customer: "Baker Electronics", channel: "SHOPIFY", items: 12, priority: "HIGH", status: "PACKED" },
  { id: "5", orderId: "ORD-2024-1289", customer: "Pinnacle Parts", channel: "AMAZON", items: 6, priority: "MEDIUM", status: "EXCEPTION" },
];

const mockPackLineItems: PackLineItem[] = [
  { id: "1", sku: "SKU-101-A", productName: "Widget Pro X", qtyExpected: 2, qtyScanned: 2, match: true },
  { id: "2", sku: "SKU-102-B", productName: "Gadget Plus", qtyExpected: 1, qtyScanned: 1, match: true },
  { id: "3", sku: "SKU-103-C", productName: "Device Lite", qtyExpected: 2, qtyScanned: 2, match: true },
  { id: "4", sku: "SKU-104-D", productName: "Tool Master", qtyExpected: 1, qtyScanned: 0, match: false },
];

const statusCls: Record<string, string> = {
  READY: "text-status-warning bg-amber-50",
  PACKING: "text-brand bg-brand-light",
  PACKED: "text-status-success bg-green-50",
  EXCEPTION: "text-status-error bg-red-50",
};

const channelCls: Record<string, string> = {
  SHOPIFY: "text-status-success bg-green-50",
  AMAZON: "text-status-warning bg-amber-50",
  MANUAL: "text-purple-600 bg-purple-50",
};

const priorityCls: Record<string, string> = {
  HIGH: "text-status-error bg-red-50",
  MEDIUM: "text-status-warning bg-amber-50",
  LOW: "text-status-success bg-green-50",
};

export default function PackingPage() {
  const { t } = useLanguageStore();
  const [selectedOrder, setSelectedOrder] = useState<OrderForPacking | null>(null);
  const [lineItems, setLineItems] = useState<PackLineItem[]>(mockPackLineItems);
  const [boxSize, setBoxSize] = useState("MEDIUM");
  const [weight, setWeight] = useState("2.5");
  const [dimensions, setDimensions] = useState("30x20x15");
  const [scannerOpen, setScannerOpen] = useState(false);

  const kpis = [
    { label: t("ordersReadyToPack"), value: mockOrders.filter(o => o.status === "READY").length.toString(), icon: "inbox", iconCls: "text-brand bg-brand-light" },
    { label: t("packedToday"), value: "12", icon: "done_all", iconCls: "text-status-success bg-green-50" },
    { label: t("pendingVerification"), value: "4", icon: "pending_actions", iconCls: "text-status-warning bg-amber-50" },
    { label: t("exceptions"), value: "2", icon: "warning", iconCls: "text-status-error bg-red-50" },
  ];

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("packingStation")}</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{t("packingSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setScannerOpen(true)}
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
            <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>{t("scan")}
          </button>
          <button className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
            <span className="material-symbols-outlined text-[16px]">add</span>{t("startPacking")}
          </button>
        </div>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Orders Queue */}
        <div className="lg:col-span-5 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center gap-2 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="w-1 h-4 rounded-full bg-brand" />
            <h3 className="text-[14px] font-semibold text-text-heading">{t("ordersQueue")}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-dash-header-bg border-b border-dash-card-border">
                <tr>
                  {[t("orderId"), t("customer"), t("channel"), t("items"), t("priority"), t("status")].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order, idx) => (
                  <tr key={order.id} className={`hover:bg-dash-row-hover cursor-pointer transition-colors ${idx < mockOrders.length - 1 ? "border-b border-dash-divider" : ""}`}
                    onClick={() => setSelectedOrder(order)}>
                    <td className="px-4 py-3 text-[12px] font-semibold font-mono text-brand">{order.orderId}</td>
                    <td className="px-4 py-3 text-[13px] text-text-body">{order.customer.split(" ")[0]}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[11px] font-semibold ${channelCls[order.channel]}`}>{order.channel}</span></td>
                    <td className="px-4 py-3 text-[13px] text-text-muted">{order.items}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[11px] font-semibold ${priorityCls[order.priority]}`}>{t(order.priority.toLowerCase()) || order.priority}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[11px] font-semibold ${statusCls[order.status]}`}>{t(order.status.toLowerCase()) || order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Packing Desk */}
        <div className="lg:col-span-7 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center gap-2 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="w-1 h-4 rounded-full bg-brand" />
            <h3 className="text-[14px] font-semibold text-text-heading">{t("packingDesk")}</h3>
          </div>
          {selectedOrder ? (
            <div className="p-4 space-y-4">
              <div className="bg-brand-light border border-brand/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-brand uppercase tracking-[0.05em]">{t("packing")}</p>
                    <p className="text-[15px] font-bold text-text-heading mt-0.5">{selectedOrder.orderId}</p>
                    <p className="text-[12px] text-text-muted">{t("customer")}: {selectedOrder.customer}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-[5px] text-[11px] font-semibold ${channelCls[selectedOrder.channel]}`}>{selectedOrder.channel}</span>
                </div>
              </div>

              {/* Line Items Verification */}
              <div className="overflow-x-auto max-h-52 overflow-y-auto border border-dash-divider rounded-lg">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-dash-header-bg sticky top-0">
                    <tr>
                      {["SKU", t("product"), t("expected"), t("scanned"), t("match")].map((h) => (
                        <th key={h} className="px-2 py-2 text-[10px] font-semibold text-text-dim uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-dash-row-hover" : ""}>
                        <td className="px-2 py-2 font-mono text-brand text-[10px]">{item.sku}</td>
                        <td className="px-2 py-2 text-text-body">{item.productName.substring(0, 12)}</td>
                        <td className="px-2 py-2 text-text-muted">{item.qtyExpected}</td>
                        <td className="px-2 py-2 text-text-muted">{item.qtyScanned}</td>
                        <td className="px-2 py-2 text-center">
                          {item.match ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-status-success bg-green-50">
                              <span className="material-symbols-outlined text-[12px]">check</span>{t("ok")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-status-error bg-red-50">
                              <span className="material-symbols-outlined text-[12px]">close</span>{t("mismatch")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Package Details */}
              <div className="bg-dash-header-bg rounded-lg p-3 space-y-3">
                <p className="text-[12px] font-semibold text-text-heading uppercase tracking-[0.05em]">{t("packageDetails")}</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("boxSize")}</label>
                    <select value={boxSize} onChange={(e) => setBoxSize(e.target.value)}
                      className="w-full h-8 px-2 rounded border border-dash-card-border text-[11px] text-text-body focus:outline-none focus:border-brand cursor-pointer">
                      <option value="SMALL">{t("small")}</option>
                      <option value="MEDIUM">{t("medium")}</option>
                      <option value="LARGE">{t("large")}</option>
                      <option value="CUSTOM">{t("custom")}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("weightKg")}</label>
                    <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)}
                      className="w-full h-8 px-2 rounded border border-dash-card-border text-[11px] text-text-body focus:outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("dimensions")}</label>
                    <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="L x W x H"
                      className="w-full h-8 px-2 rounded border border-dash-card-border text-[11px] text-text-body focus:outline-none focus:border-brand" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setScannerOpen(true)}
                  className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("scanToVerify")}
                </button>
                <button className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("addNote")}
                </button>
                <button className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                  {t("completePacking")}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[13px] text-text-dim">
              {t("selectOrderToPack")}
            </div>
          )}
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setScannerOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-sm bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-brand" />
                <h3 className="text-[15px] font-semibold text-text-heading">{t("scanItem")}</h3>
              </div>
              <button onClick={() => setScannerOpen(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="px-5 py-5 space-y-4">
              <input type="text" placeholder="Scan barcode..." autoFocus
                className="w-full h-9 px-3 rounded-lg border text-[13px] font-mono text-center font-bold tracking-widest bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              <button className="w-full h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                {t("verifyItem")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
