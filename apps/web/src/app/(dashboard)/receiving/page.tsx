"use client";

import { useState, useMemo } from "react";
import { useLanguageStore } from "../../../store/languageStore";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  expectedDate: string;
  items: number;
  status: "EXPECTED" | "IN_PROGRESS" | "COMPLETED" | "DISCREPANCY";
}

interface LineItem {
  id: string;
  sku: string;
  productName: string;
  expectedQty: number;
  receivedQty: number;
  condition: "GOOD" | "DAMAGED" | "REJECTED";
  location: string;
  notes: string;
}

const mockPOs: PurchaseOrder[] = [
  { id: "1", poNumber: "PO-2024-001", supplier: "Global Supplies Co.", expectedDate: "2024-06-28", items: 12, status: "IN_PROGRESS" },
  { id: "2", poNumber: "PO-2024-002", supplier: "Acme Industries", expectedDate: "2024-06-29", items: 8, status: "EXPECTED" },
  { id: "3", poNumber: "PO-2024-003", supplier: "Summit Logistics", expectedDate: "2024-06-27", items: 15, status: "COMPLETED" },
  { id: "4", poNumber: "PO-2024-004", supplier: "Baker Electronics", expectedDate: "2024-06-30", items: 5, status: "DISCREPANCY" },
  { id: "5", poNumber: "PO-2024-005", supplier: "Pinnacle Parts", expectedDate: "2024-06-26", items: 20, status: "COMPLETED" },
];

const mockLineItems: LineItem[] = [
  { id: "1", sku: "SKU-101-A", productName: "Widget Pro X", expectedQty: 100, receivedQty: 100, condition: "GOOD", location: "A1-01-A", notes: "" },
  { id: "2", sku: "SKU-102-B", productName: "Gadget Plus", expectedQty: 50, receivedQty: 45, condition: "DAMAGED", location: "A1-02-B", notes: "2 units damaged on arrival" },
  { id: "3", sku: "SKU-103-C", productName: "Device Lite", expectedQty: 75, receivedQty: 75, condition: "GOOD", location: "B2-01-A", notes: "" },
];

const statusCls: Record<string, string> = {
  EXPECTED: "text-text-muted bg-gray-100",
  IN_PROGRESS: "text-status-warning bg-amber-50",
  COMPLETED: "text-status-success bg-green-50",
  DISCREPANCY: "text-status-error bg-red-50",
};

export default function ReceivingPage() {
  const { t } = useLanguageStore();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>(mockLineItems);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [scanStatus, setScanStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");

  const handleLineItemChange = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSimulatedScan = () => {
    const valid = ["SKU-101-A", "SKU-102-B", "SKU-103-C"];
    if (valid.includes(scannedBarcode.toUpperCase())) {
      setScanStatus("SUCCESS");
      setTimeout(() => { setScanStatus("IDLE"); setScannedBarcode(""); setScannerOpen(false); }, 1500);
    } else {
      setScanStatus("ERROR");
      setTimeout(() => setScanStatus("IDLE"), 2000);
    }
  };

  const kpis = [
    { label: t("expectedToday"), value: "3", trend: "up", icon: "inbox", iconCls: "text-brand bg-brand-light", trendCls: "text-brand bg-brand-light" },
    { label: t("receivedToday"), value: "8", trend: "up", icon: "check_circle", iconCls: "text-status-success bg-green-50", trendCls: "text-status-success bg-green-50" },
    { label: t("pendingValidation"), value: "5", trend: "up", icon: "schedule", iconCls: "text-status-warning bg-amber-50", trendCls: "text-status-warning bg-amber-50" },
    { label: t("discrepancies"), value: "2", trend: "down", icon: "warning", iconCls: "text-status-error bg-red-50", trendCls: "text-status-error bg-red-50" },
  ];

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("receivingOperations")}</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{t("receivingSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setScannerOpen(true)}
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
            <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>{t("scan")}
          </button>
          <button className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
            <span className="material-symbols-outlined text-[16px]">add</span>{t("newReceipt")}
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
            <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md w-fit ${k.trendCls}`}>
              <span className="material-symbols-outlined text-[12px]">{k.trend === "up" ? "arrow_upward" : "arrow_downward"}</span>
              <span className="text-[11px] font-bold">{k.trend === "up" ? "+5" : "-2"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid - POs and Receiving Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* PO List */}
        <div className="lg:col-span-5 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center gap-2 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="w-1 h-4 rounded-full bg-brand" />
            <h3 className="text-[14px] font-semibold text-text-heading">{t("purchaseOrders")}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-dash-header-bg border-b border-dash-card-border">
                <tr>
                  {[t("poNumber"), t("supplier"), t("expected"), t("items"), t("status")].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockPOs.map((po, idx) => (
                  <tr key={po.id} className={`hover:bg-dash-row-hover cursor-pointer transition-colors ${idx < mockPOs.length - 1 ? "border-b border-dash-divider" : ""}`}
                    onClick={() => setSelectedPO(po)}>
                    <td className="px-4 py-3 text-[12px] font-semibold font-mono text-brand">{po.poNumber}</td>
                    <td className="px-4 py-3 text-[13px] text-text-body">{po.supplier}</td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">{new Date(po.expectedDate).toLocaleDateString("en-US", {month:"short", day:"numeric"})}</td>
                    <td className="px-4 py-3 text-[13px] font-mono text-text-muted">{po.items}</td>
                    <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${statusCls[po.status] ?? "text-text-muted bg-gray-100"}`}>{po.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Receiving Desk */}
        <div className="lg:col-span-7 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center gap-2 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="w-1 h-4 rounded-full bg-brand" />
            <h3 className="text-[14px] font-semibold text-text-heading">{t("receivingDesk")}</h3>
          </div>
          {selectedPO ? (
            <div className="p-4 space-y-4">
              <div className="bg-brand-light border border-brand/20 rounded-lg p-3">
                <p className="text-[11px] font-semibold text-brand uppercase tracking-[0.05em]">{t("processing")}</p>
                <p className="text-[15px] font-bold text-text-heading mt-0.5">{selectedPO.poNumber}</p>
                <p className="text-[12px] text-text-muted">{t("from")}: {selectedPO.supplier} | {t("expected")}: {new Date(selectedPO.expectedDate).toLocaleDateString()}</p>
              </div>
              
              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead className="bg-dash-header-bg sticky top-0">
                    <tr>
                      {["SKU", t("product"), t("expected"), t("received"), t("condition"), "Location", t("notes")].map((h) => (
                        <th key={h} className="px-2 py-2 text-[10px] font-semibold text-text-dim uppercase tracking-[0.05em]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-dash-row-hover" : ""}>
                        <td className="px-2 py-2 font-mono text-brand">{item.sku}</td>
                        <td className="px-2 py-2 text-text-body">{item.productName}</td>
                        <td className="px-2 py-2 text-text-muted">{item.expectedQty}</td>
                        <td className="px-2 py-2">
                          <input type="number" value={item.receivedQty} onChange={(e) => handleLineItemChange(item.id, "receivedQty", Number(e.target.value))}
                            className="w-12 h-7 px-2 rounded border border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                        </td>
                        <td className="px-2 py-2">
                          <select value={item.condition} onChange={(e) => handleLineItemChange(item.id, "condition", e.target.value)}
                            className="h-7 px-2 rounded border border-dash-card-border text-text-body text-[11px] focus:outline-none focus:border-brand cursor-pointer">
                            <option value="GOOD">{t("good")}</option>
                            <option value="DAMAGED">{t("damaged")}</option>
                            <option value="REJECTED">{t("rejected")}</option>
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input type="text" value={item.location} onChange={(e) => handleLineItemChange(item.id, "location", e.target.value)}
                            className="w-20 h-7 px-2 rounded border border-dash-card-border text-text-body text-[11px] focus:outline-none focus:border-brand" />
                        </td>
                        <td className="px-2 py-2">
                          <input type="text" value={item.notes} onChange={(e) => handleLineItemChange(item.id, "notes", e.target.value)}
                            className="w-32 h-7 px-2 rounded border border-dash-card-border text-text-body text-[11px] focus:outline-none focus:border-brand" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("saveProgress")}
                </button>
                <button className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("recordDiscrepancy")}
                </button>
                <button className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                  {t("completeReceiving")}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[13px] text-text-dim">
              {t("selectPO")}
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
                <h3 className="text-[15px] font-semibold text-text-heading">{t("scanBarcode")}</h3>
              </div>
              <button onClick={() => setScannerOpen(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="px-5 py-5 space-y-4">
              <p className="text-[13px] text-text-muted">{t("scanToValidateDesc")}</p>
              <input type="text" value={scannedBarcode} onChange={(e) => setScannedBarcode(e.target.value)}
                placeholder={t("enterSKU")}
                className="w-full h-9 px-3 rounded-lg border text-[13px] font-mono text-center font-bold tracking-widest bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              <button onClick={handleSimulatedScan}
                className="w-full h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                {t("scan")}
              </button>
              {scanStatus === "SUCCESS" && (
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 text-status-success text-[13px] font-semibold">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>{t("itemValidated")}
                </div>
              )}
              {scanStatus === "ERROR" && (
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-50 text-status-error text-[13px] font-semibold">
                  <span className="material-symbols-outlined text-[16px]">error</span>{t("invalidBarcode")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
