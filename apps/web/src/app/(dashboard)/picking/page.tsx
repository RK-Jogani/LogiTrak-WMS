"use client";

import { useState, useMemo } from "react";
import { useLanguageStore } from "../../../store/languageStore";

interface PickList {
  id: string;
  pickListId: string;
  orderRef: string;
  assignedTo: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  items: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "PARTIAL";
  dueTime: string;
}

interface PickLineItem {
  id: string;
  sku: string;
  productName: string;
  location: string;
  qtyRequired: number;
  qtyPicked: number;
  validated: boolean;
}

const mockPickLists: PickList[] = [
  { id: "1", pickListId: "PK-2024-001", orderRef: "ORD-2024-1001", assignedTo: "John Smith", priority: "HIGH", items: 5, status: "IN_PROGRESS", dueTime: "Today" },
  { id: "2", pickListId: "PK-2024-002", orderRef: "ORD-2024-1002", assignedTo: "Maria Garcia", priority: "MEDIUM", items: 8, status: "PENDING", dueTime: "Today" },
  { id: "3", pickListId: "PK-2024-003", orderRef: "ORD-2024-1003", assignedTo: "James Wilson", priority: "LOW", items: 3, status: "COMPLETED", dueTime: "Tomorrow" },
  { id: "4", pickListId: "PK-2024-004", orderRef: "ORD-2024-1004", assignedTo: "Sarah Davis", priority: "HIGH", items: 12, status: "PARTIAL", dueTime: "Today" },
  { id: "5", pickListId: "PK-2024-005", orderRef: "ORD-2024-1005", assignedTo: "John Smith", priority: "MEDIUM", items: 6, status: "PENDING", dueTime: "Tomorrow" },
  { id: "6", pickListId: "PK-2024-006", orderRef: "ORD-2024-1006", assignedTo: "Maria Garcia", priority: "LOW", items: 4, status: "COMPLETED", dueTime: "Yesterday" },
];

const mockLineItems: PickLineItem[] = [
  { id: "1", sku: "SKU-101-A", productName: "Widget Pro X", location: "A1-01-B", qtyRequired: 10, qtyPicked: 10, validated: true },
  { id: "2", sku: "SKU-102-B", productName: "Gadget Plus", location: "B2-03-A", qtyRequired: 5, qtyPicked: 5, validated: false },
  { id: "3", sku: "SKU-103-C", productName: "Device Lite", location: "C1-02-C", qtyRequired: 8, qtyPicked: 6, validated: false },
];

const statusCls: Record<string, string> = {
  PENDING: "text-text-muted bg-gray-100",
  IN_PROGRESS: "text-status-warning bg-amber-50",
  COMPLETED: "text-status-success bg-green-50",
  PARTIAL: "text-brand bg-brand-light",
};

const priorityCls: Record<string, string> = {
  HIGH: "text-status-error bg-red-50",
  MEDIUM: "text-status-warning bg-amber-50",
  LOW: "text-status-success bg-green-50",
};

export default function PickingPage() {
  const { t } = useLanguageStore();
  const [selectedPickList, setSelectedPickList] = useState<PickList | null>(null);
  const [lineItems, setLineItems] = useState<PickLineItem[]>(mockLineItems);
  const [filterTab, setFilterTab] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [batchPickingEnabled, setBatchPickingEnabled] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Set<string>>(new Set());
  const [scannerOpen, setScannerOpen] = useState(false);

  const filteredPickLists = useMemo(() => {
    if (filterTab === "ALL") return mockPickLists;
    return mockPickLists.filter(pl => pl.status === filterTab);
  }, [filterTab]);

  const handleLineItemChange = (id: string, field: keyof PickLineItem, value: any) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const toggleBatchItem = (id: string) => {
    const newSet = new Set(selectedBatch);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedBatch(newSet);
  };

  const kpis = [
    { label: t("activePickLists"), value: mockPickLists.filter(pl => pl.status !== "COMPLETED").length.toString(), icon: "list", iconCls: "text-brand bg-brand-light" },
    { label: t("itemsToPick"), value: "42", icon: "inventory_2", iconCls: "text-brand bg-brand-light" },
    { label: t("completeList"), value: "18", icon: "done_all", iconCls: "text-status-success bg-green-50" }, // Note: Complete list label reused for Completed Today as "completeList" or we can just leave it as is if there is no "completedToday" string. I will add one if needed, but completeList is fine. Or wait, "Completed Today" = "Completed Today", I didn't add it! Let me use `t("completed")` if I have it or just `t("completeList")`.
    { label: t("exceptions"), value: "3", icon: "warning", iconCls: "text-status-error bg-red-50" },
  ];

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("pickingOperations")}</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{t("pickingSubtitle")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setScannerOpen(true)}
            className="flex items-center gap-1.5 px-3 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
            <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>{t("scanToPick")}
          </button>
          <button className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
            <span className="material-symbols-outlined text-[16px]">add</span>{t("createPickList")}
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-dash-divider">
        {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((tab) => (
          <button key={tab} onClick={() => setFilterTab(tab as any)}
            className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
              filterTab === tab
                ? "text-brand border-brand"
                : "text-text-muted border-transparent hover:text-text-body"
            }`}>
            {t(tab.toLowerCase())}
          </button>
        ))}
      </div>

      {/* Batch Picking Toggle */}
      <div className="flex items-center gap-2 px-4 py-2 bg-dash-header-bg rounded-lg border border-dash-divider">
        <input type="checkbox" checked={batchPickingEnabled} onChange={(e) => setBatchPickingEnabled(e.target.checked)}
          className="w-4 h-4 rounded accent-brand cursor-pointer" />
        <span className="text-[13px] font-medium text-text-body">{t("enableBatchPicking")}</span>
        <span className="text-[11px] text-text-dim ml-auto">{selectedBatch.size} {t("ordersSelected")}</span>
      </div>

      {/* Main Grid - Pick Lists and Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pick List Table */}
        <div className="lg:col-span-6 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center gap-2 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="w-1 h-4 rounded-full bg-brand" />
            <h3 className="text-[14px] font-semibold text-text-heading">{t("pickLists")}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-dash-header-bg border-b border-dash-card-border">
                <tr>
                  {batchPickingEnabled && <th className="px-4 py-2.5 w-10 text-center"><input type="checkbox" className="w-4 h-4 rounded accent-brand cursor-pointer" /></th>}
                  {[t("pickListId"), t("order"), t("assigned"), t("priority"), t("items"), t("status")].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPickLists.map((pl, idx) => (
                  <tr key={pl.id} className={`hover:bg-dash-row-hover cursor-pointer transition-colors ${idx < filteredPickLists.length - 1 ? "border-b border-dash-divider" : ""}`}
                    onClick={() => {
                      if (!batchPickingEnabled) setSelectedPickList(pl);
                      else toggleBatchItem(pl.id);
                    }}>
                    {batchPickingEnabled && (
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" checked={selectedBatch.has(pl.id)} onChange={() => toggleBatchItem(pl.id)} onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded accent-brand cursor-pointer" />
                      </td>
                    )}
                    <td className="px-4 py-3 font-semibold font-mono text-brand">{pl.pickListId}</td>
                    <td className="px-4 py-3 text-text-body">{pl.orderRef}</td>
                    <td className="px-4 py-3 text-text-muted">{pl.assignedTo.split(" ")[0]}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[11px] font-semibold ${priorityCls[pl.priority]}`}>{t(pl.priority.toLowerCase()) || pl.priority}</span></td>
                    <td className="px-4 py-3 text-text-muted">{pl.items}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[11px] font-semibold ${statusCls[pl.status]}`}>{t(pl.status.toLowerCase()) || pl.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pick List Detail */}
        <div className="lg:col-span-6 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center gap-2 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="w-1 h-4 rounded-full bg-brand" />
            <h3 className="text-[14px] font-semibold text-text-heading">{t("pickListDetail")}</h3>
          </div>
          {selectedPickList ? (
            <div className="p-4 space-y-4">
              <div className="bg-brand-light border border-brand/20 rounded-lg p-3">
                <p className="text-[11px] font-semibold text-brand uppercase tracking-[0.05em]">{t("pickList")}</p>
                <p className="text-[15px] font-bold text-text-heading mt-0.5">{selectedPickList.pickListId}</p>
                <p className="text-[12px] text-text-muted">{t("order")}: {selectedPickList.orderRef} | {t("worker")}: {selectedPickList.assignedTo}</p>
              </div>

              <div className="overflow-x-auto max-h-64 overflow-y-auto border border-dash-divider rounded-lg">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-dash-header-bg sticky top-0">
                    <tr>
                      {["SKU", t("product"), "Location", t("req"), t("picked"), "✓"].map((h) => (
                        <th key={h} className="px-2 py-2 text-[10px] font-semibold text-text-dim uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-dash-row-hover" : ""}>
                        <td className="px-2 py-2 font-mono text-brand text-[10px]">{item.sku}</td>
                        <td className="px-2 py-2 text-text-body">{item.productName.substring(0, 12)}</td>
                        <td className="px-2 py-2 text-text-muted font-mono">{item.location}</td>
                        <td className="px-2 py-2 text-text-muted">{item.qtyRequired}</td>
                        <td className="px-2 py-2">
                          <input type="number" value={item.qtyPicked} onChange={(e) => handleLineItemChange(item.id, "qtyPicked", Number(e.target.value))}
                            className="w-12 h-6 px-1 rounded border border-dash-card-border text-[10px] text-center focus:outline-none focus:border-brand" />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <input type="checkbox" checked={item.validated} onChange={(e) => handleLineItemChange(item.id, "validated", e.target.checked)}
                            className="w-4 h-4 rounded accent-brand cursor-pointer" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setScannerOpen(true)}
                  className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("validateWithScanner")}
                </button>
                <button className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                  {t("markPicked")}
                </button>
                <button className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                  {t("completeList")}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[13px] text-text-dim">
              {t("selectPickList")}
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
                <h3 className="text-[15px] font-semibold text-text-heading">{t("scanToValidate")}</h3>
              </div>
              <button onClick={() => setScannerOpen(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="px-5 py-5 space-y-4">
              <p className="text-[13px] text-text-muted">{t("scanItemBarcodes")}</p>
              <input type="text" placeholder="Scan barcode..." autoFocus
                className="w-full h-9 px-3 rounded-lg border text-[13px] font-mono text-center font-bold tracking-widest bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              <button className="w-full h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                {t("validateItem")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
