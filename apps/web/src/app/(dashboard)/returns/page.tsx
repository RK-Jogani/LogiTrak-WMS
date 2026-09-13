"use client";

import { useState, useMemo } from "react";
import { useLanguageStore } from "../../../store/languageStore";
import { useToast } from "../../../store/ToastContext";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter";
import { ScanBarcodeModal } from "../../../components/ui/ScanBarcodeModal";

interface ReturnOrder {
  id: string;
  returnNumber: string;
  order: { orderNumber: string };
  status: string;
  inspectionNotes: string | null;
  createdAt: string;
  items: Array<{ id: string; productId: string; quantity: number; condition: string; notes: string | null }>;
}

const statusCls: Record<string, string> = {
  COMPLETED: "text-status-success bg-green-50",
  INSPECTED: "text-status-warning bg-amber-50",
  PENDING:   "text-text-muted bg-gray-100",
};

const MOCK_RETURNS: ReturnOrder[] = [
  { id: "RET-1", returnNumber: "RTN-2026-9912", order: { orderNumber: "ORD-2026-991" }, status: "PENDING", inspectionNotes: null, createdAt: "2026-07-06T10:00:00Z", items: [] },
  { id: "RET-2", returnNumber: "RTN-2026-9913", order: { orderNumber: "ORD-2026-882" }, status: "INSPECTED", inspectionNotes: "Missing original packaging", createdAt: "2026-07-05T14:30:00Z", items: [] },
  { id: "RET-3", returnNumber: "RTN-2026-9914", order: { orderNumber: "ORD-2026-773" }, status: "COMPLETED", inspectionNotes: "Restocked successfully", createdAt: "2026-07-04T09:15:00Z", items: [] },
  { id: "RET-4", returnNumber: "RTN-2026-9915", order: { orderNumber: "ORD-2026-664" }, status: "PENDING", inspectionNotes: null, createdAt: "2026-07-06T11:45:00Z", items: [] },
];

export default function ReturnsPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();
  
  const [returns,        setReturns]        = useState<ReturnOrder[]>(MOCK_RETURNS);
  const [selectedReturn, setSelectedReturn] = useState<ReturnOrder | null>(null);
  
  // Inspection form
  const [condition,      setCondition]      = useState("RESTOCKED");
  const [notes,          setNotes]          = useState("");
  const [locationBarcode,setLocationBarcode]= useState("A1-04-B");
  
  // Scanner state
  const [scannerOpen,    setScannerOpen]    = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const filteredReturns = useMemo(() => {
    let result = returns;
    if (activeTab !== "ALL") {
      result = result.filter(r => r.status === activeTab);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => 
        r.returnNumber.toLowerCase().includes(q) || 
        r.order.orderNumber.toLowerCase().includes(q)
      );
    }
    return result;
  }, [returns, search, activeTab]);

  function handleInspect(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedReturn) return;
    
    // Update the return status
    setReturns(prev => prev.map(r => {
      if (r.id === selectedReturn.id) {
        return { 
          ...r, 
          status: condition === "RESTOCKED" ? "COMPLETED" : "INSPECTED", 
          inspectionNotes: notes 
        };
      }
      return r;
    }));
    
    showToast(`Return ${selectedReturn.returnNumber} processed`, "success");
    setNotes(""); 
    setSelectedReturn(null); 
  }

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("returnOrders")}</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{t("returnsSubtitle")}</p>
        </div>
        <button onClick={() => setScannerOpen(true)}
          className="flex items-center gap-1.5 px-3 h-9 rounded-lg border text-[13px] font-medium
            bg-dash-card border-dash-card-border text-text-body
            shadow-[0_1px_2px_rgba(9,20,38,0.05)] hover:border-brand hover:text-brand transition-colors self-start sm:self-auto">
          <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
          {t("scanPrompt")}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Returns</p>
            <h3 className="text-2xl font-bold text-gray-800"><AnimatedCounter value={returns.length} /></h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined text-[20px]">assignment_return</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Pending Inspection</p>
            <h3 className="text-2xl font-bold text-orange-600"><AnimatedCounter value={returns.filter(r => r.status === "PENDING").length} /></h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <span className="material-symbols-outlined text-[20px]">fact_check</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Approved/Completed</p>
            <h3 className="text-2xl font-bold text-green-600"><AnimatedCounter value={returns.filter(r => r.status === "COMPLETED").length} /></h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Inspected</p>
            <h3 className="text-2xl font-bold text-amber-600"><AnimatedCounter value={returns.filter(r => r.status === "INSPECTED").length} /></h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <span className="material-symbols-outlined text-[20px]">search_check</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm shrink-0">
          {[
            { id: "ALL", label: "All Returns" },
            { id: "PENDING", label: "Pending" },
            { id: "INSPECTED", label: "Inspected" },
            { id: "COMPLETED", label: "Completed" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors ${activeTab === tab.id ? "bg-[#00b894]/10 text-[#00b894]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-gray-400">search</span>
          <input 
            type="text" 
            placeholder="Search return or order..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-9 rounded-lg border border-gray-300 text-[13px] focus:outline-none focus:border-[#00b894] focus:ring-1 focus:ring-[#00b894]/30 shadow-sm"
          />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Returns table */}
        <div className="lg:col-span-8 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden
          shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center gap-2 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="w-1 h-4 rounded-full bg-brand" />
            <h3 className="text-[14px] font-semibold text-text-heading">{t("returnOrders")}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-dash-header-bg border-b border-dash-card-border">
                <tr>
                  {[t("returnNum"), t("orderRef"), t("status"), t("date"), t("actions")].map((h, i) => (
                    <th key={h} className={`px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em] ${i === 4 ? "text-center" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReturns.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-[13px] text-text-dim">{t("noReturnsFound")}</td></tr>
                ) : filteredReturns.map((r, idx) => (
                  <tr key={r.id} className={`hover:bg-dash-row-hover transition-colors ${idx < filteredReturns.length - 1 ? "border-b border-dash-divider" : ""}`}>
                    <td className="px-4 py-3"><span className="text-[12px] font-semibold font-mono text-brand">{r.returnNumber}</span></td>
                    <td className="px-4 py-3 text-[13px] text-text-muted">{r.order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${statusCls[r.status] ?? "text-text-muted bg-gray-100"}`}>{t(r.status.toLowerCase()) || r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">{new Date(r.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                    <td className="px-4 py-3 text-center">
                      {r.status === "PENDING" || r.status === "INSPECTED" ? (
                        <button onClick={() => { setSelectedReturn(r); setNotes(r.inspectionNotes || ""); }}
                          className="px-3 h-7 rounded-lg text-[11px] font-semibold bg-brand-light text-brand hover:bg-brand hover:text-white transition-colors">
                          {t("process")}
                        </button>
                      ) : (
                        <span className="text-[11px] text-text-dim">{t("processed")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspection Desk */}
        <div className="lg:col-span-4 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden
          shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center gap-2 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="w-1 h-4 rounded-full bg-brand" />
            <h3 className="text-[14px] font-semibold text-text-heading">{t("inspectionDesk")}</h3>
          </div>
          <div className="p-4">
            {selectedReturn ? (
              <form onSubmit={handleInspect} className="space-y-4">
                <div className="bg-brand-light border border-brand/20 rounded-lg p-3">
                  <p className="text-[11px] font-semibold text-brand uppercase tracking-[0.05em]">{t("processing")}</p>
                  <p className="text-[15px] font-bold text-text-heading mt-0.5">{selectedReturn.returnNumber}</p>
                  <p className="text-[12px] text-text-muted">{t("order")}: {selectedReturn.order.orderNumber}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("inspectionOutcome")}</label>
                  <select value={condition} onChange={(e) => setCondition(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors cursor-pointer">
                    <option value="RESTOCKED">{t("restockShelf")}</option>
                    <option value="DAMAGED">{t("damagedQuarantine")}</option>
                    <option value="SCRAP">{t("scrapWaste")}</option>
                  </select>
                </div>

                {condition === "RESTOCKED" && (
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("targetShelfBarcode")}</label>
                    <input type="text" required value={locationBarcode} onChange={(e) => setLocationBarcode(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("inspectorNotes")} <span className="text-status-error">*</span></label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} required rows={4}
                    placeholder={t("inspectorNotesPlaceholder")}
                    className="w-full px-3 py-2 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors resize-none" />
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedReturn(null)}
                    className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                    {t("cancel")}
                  </button>
                  <button type="submit"
                    className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                    {t("completeList")} {/* Complete Action button, can be completeList since it means complete */}
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-16 text-center text-[13px] text-text-dim px-4">
                {t("selectReturnOrder")}
              </div>
            )}
          </div>
        </div>
      </div>

      <ScanBarcodeModal 
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanSuccess={(barcode) => {
          setScannerOpen(false);
          showToast(`Scanned Return Barcode: ${barcode}`, "success");
        }}
      />
    </div>
  );
}
