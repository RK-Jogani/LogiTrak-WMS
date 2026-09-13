"use client";

import { useState } from "react";
import { useLanguageStore } from "../../../store/languageStore";

interface Shipment {
  id: string;
  shipmentId: string;
  orderRef: string;
  customer: string;
  carrier: "FEDEX" | "UPS" | "DHL" | "LOCAL";
  trackingNumber: string;
  serviceLevel: string;
  weight: string;
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "EXCEPTION";
  estDelivery: string;
}

interface Carrier {
  id: string;
  name: string;
  status: boolean;
  logo: string;
  services: string[];
}

const mockShipments: Shipment[] = [
  { id: "1", shipmentId: "SHP-2024-001", orderRef: "ORD-2024-1285", customer: "Acme Industries", carrier: "FEDEX", trackingNumber: "794629382748", serviceLevel: "Ground", weight: "2.5 kg", status: "IN_TRANSIT", estDelivery: "2024-06-30" },
  { id: "2", shipmentId: "SHP-2024-002", orderRef: "ORD-2024-1286", customer: "Global Supplies", carrier: "UPS", trackingNumber: "1Z999AA10123456784", serviceLevel: "Express", weight: "1.2 kg", status: "PENDING", estDelivery: "2024-06-29" },
  { id: "3", shipmentId: "SHP-2024-003", orderRef: "ORD-2024-1287", customer: "Summit Logistics", carrier: "DHL", trackingNumber: "1088391912", serviceLevel: "International", weight: "5.8 kg", status: "DELIVERED", estDelivery: "2024-06-27" },
  { id: "4", shipmentId: "SHP-2024-004", orderRef: "ORD-2024-1288", customer: "Baker Electronics", carrier: "LOCAL", trackingNumber: "LOCAL-28392-X", serviceLevel: "Standard", weight: "3.1 kg", status: "EXCEPTION", estDelivery: "2024-07-01" },
  { id: "5", shipmentId: "SHP-2024-005", orderRef: "ORD-2024-1289", customer: "Pinnacle Parts", carrier: "FEDEX", trackingNumber: "794629382945", serviceLevel: "Overnight", weight: "0.8 kg", status: "IN_TRANSIT", estDelivery: "2024-06-29" },
];

const mockCarriers: Carrier[] = [
  { id: "1", name: "FedEx", status: true, logo: "✈", services: ["Ground", "Express", "Overnight", "International"] },
  { id: "2", name: "UPS", status: true, logo: "📦", services: ["Ground", "Express", "Priority", "Worldwide"] },
  { id: "3", name: "DHL", status: true, logo: "🌍", services: ["Express", "Economy", "Worldwide"] },
  { id: "4", name: "Local Carrier", status: false, logo: "🚚", services: ["Standard", "Express"] },
];

const statusCls: Record<string, string> = {
  PENDING: "text-status-warning bg-amber-50",
  IN_TRANSIT: "text-brand bg-brand-light",
  DELIVERED: "text-status-success bg-green-50",
  EXCEPTION: "text-status-error bg-red-50",
};

const carrierCls: Record<string, string> = {
  FEDEX: "text-purple-600 bg-purple-50",
  UPS: "text-brand bg-brand-light",
  DHL: "text-yellow-600 bg-yellow-50",
  LOCAL: "text-gray-600 bg-gray-100",
};

export default function ShippingPage() {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<"SHIPMENTS" | "CARRIERS">("SHIPMENTS");
  const [search, setSearch] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "carrier" | "rule" | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);

  const openModal = (type: typeof modalType, carrier: Carrier | null = null) => {
    setModalType(type);
    setSelectedCarrier(carrier);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedCarrier(null);
  };

  const filteredShipments = mockShipments.filter(s => 
    s.shipmentId.includes(search.toUpperCase()) || 
    s.orderRef.includes(search.toUpperCase()) ||
    s.customer.toLowerCase().includes(search.toLowerCase())
  );

  const kpis = [
    { label: t("shipmentsToday"), value: "8", icon: "local_shipping", iconCls: "text-brand bg-brand-light" },
    { label: t("inTransit"), value: "24", icon: "moving", iconCls: "text-status-warning bg-amber-50" },
    { label: t("delivered"), value: "156", icon: "done_all", iconCls: "text-status-success bg-green-50" },
    { label: t("exceptions"), value: "3", icon: "warning", iconCls: "text-status-error bg-red-50" },
  ];

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("shippingManagement")}</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{t("shippingSubtitle")}</p>
        </div>
        <button onClick={() => openModal("create")} className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)] shrink-0">
          <span className="material-symbols-outlined text-[16px]">add</span>{t("createShipment")}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)] hover:shadow-[0_4px_12px_rgba(9,20,38,0.10),0_8px_32px_rgba(9,20,38,0.08)] hover:border-brand/30 transition-all duration-200">
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
        {["SHIPMENTS", "CARRIERS"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "text-brand border-brand"
                : "text-text-muted border-transparent hover:text-text-body"
            }`}>
            {tab === "SHIPMENTS" ? t("allShipments") : t("carriersRules")}
          </button>
        ))}
      </div>

      {/* Shipments Tab */}
      {activeTab === "SHIPMENTS" && (
        <>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-dim pointer-events-none">search</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchShipments")}
                className="pl-8 pr-3 h-9 w-full rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body placeholder:text-text-dim focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
            </div>
            <span className="text-[12px] text-text-dim shrink-0">{filteredShipments.length} {t("results")}</span>
          </div>

          <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-dash-header-bg border-b border-dash-card-border">
                  <tr>
                    {[t("shipmentId"), t("order"), t("customer"), t("carrier"), t("tracking"), t("service"), t("weight"), t("status"), t("estDelivery"), t("actions")].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.length === 0 ? (
                    <tr><td colSpan={10} className="px-4 py-12 text-center text-[13px] text-text-dim">{t("noShipmentsFound")}</td></tr>
                  ) : filteredShipments.map((ship, idx) => (
                    <tr key={ship.id} className={`hover:bg-dash-row-hover transition-colors ${idx < filteredShipments.length - 1 ? "border-b border-dash-divider" : ""}`}>
                      <td className="px-4 py-3 text-[12px] font-semibold font-mono text-brand">{ship.shipmentId}</td>
                      <td className="px-4 py-3 text-[12px] font-mono text-text-muted">{ship.orderRef}</td>
                      <td className="px-4 py-3 text-[13px] text-text-body">{ship.customer.split(" ")[0]}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[11px] font-semibold ${carrierCls[ship.carrier]}`}>{ship.carrier}</span></td>
                      <td className="px-4 py-3 text-[12px] font-mono text-text-dim">{ship.trackingNumber}</td>
                      <td className="px-4 py-3 text-[12px] text-text-muted">{ship.serviceLevel}</td>
                      <td className="px-4 py-3 text-[12px] text-text-muted">{ship.weight}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-[5px] text-[11px] font-semibold ${statusCls[ship.status]}`}>{t(ship.status) || ship.status}</span></td>
                      <td className="px-4 py-3 text-[12px] text-text-muted">{new Date(ship.estDelivery).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-[12px]">
                        <button onClick={() => { setSelectedShipment(ship); setDetailOpen(true); }}
                          className="text-brand hover:text-brand-hover font-medium">{t("view")}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Carriers Tab */}
      {activeTab === "CARRIERS" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockCarriers.map((carrier) => (
              <div key={carrier.id} className="bg-dash-card border border-dash-card-border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-text-heading">{carrier.name}</p>
                    <p className="text-[11px] text-text-dim mt-1">{carrier.services.length} {t("servicesCount")}</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={carrier.status} className="w-4 h-4 rounded accent-brand" />
                    <span className={`text-[10px] font-bold ${carrier.status ? "text-status-success" : "text-text-muted"}`}>
                      {carrier.status ? t("activeUppercase") : t("inactiveUppercase")}
                    </span>
                  </label>
                </div>
                <div className="bg-dash-header-bg rounded-lg p-2">
                  <p className="text-[13px] font-bold text-center">{carrier.logo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("servicesCount")}</p>
                  <div className="flex flex-wrap gap-1">
                    {carrier.services.slice(0, 2).map((svc) => (
                      <span key={svc} className="text-[10px] bg-brand-light text-brand px-2 py-0.5 rounded">{svc}</span>
                    ))}
                    {carrier.services.length > 2 && (
                      <span className="text-[10px] text-text-dim">+{carrier.services.length - 2} {t("more")}</span>
                    )}
                  </div>
                </div>
                <button onClick={() => openModal("carrier", carrier)} className="w-full h-8 rounded-lg text-[12px] font-medium bg-dash-header-bg text-text-body hover:bg-brand-light hover:text-brand transition-colors">
                  {t("configure")}
                </button>
              </div>
            ))}
          </div>

          {/* Carrier Rules */}
          <div className="bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
            <div className="flex items-center justify-between px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-brand" />
                <h3 className="text-[14px] font-semibold text-text-heading">{t("carriersRules")}</h3>
              </div>
              <button onClick={() => openModal("rule")} className="text-[12px] font-semibold text-brand hover:text-brand-hover transition-colors">+ {t("addRule")}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-dash-header-bg border-b border-dash-card-border">
                  <tr>
                    {[t("ruleName"), t("condition"), t("priority"), t("assignedCarrier"), t("status")].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dash-divider hover:bg-dash-row-hover">
                    <td className="px-4 py-3 text-[13px] font-semibold text-text-body">Heavy Shipments</td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">Weight {">"} 10 kg</td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">1</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-[5px] text-[11px] font-semibold text-purple-600 bg-purple-50">FedEx</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-[5px] text-[11px] font-semibold text-status-success bg-green-50">{t("activeUppercase")}</span></td>
                  </tr>
                  <tr className="border-b border-dash-divider hover:bg-dash-row-hover">
                    <td className="px-4 py-3 text-[13px] font-semibold text-text-body">Express Orders</td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">Destination = EU</td>
                    <td className="px-4 py-3 text-[12px] text-text-muted">2</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-[5px] text-[11px] font-semibold text-yellow-600 bg-yellow-50">DHL</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-[5px] text-[11px] font-semibold text-status-success bg-green-50">{t("activeUppercase")}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}


      {/* ── Create Shipment Modal ───────────────────– */}
      {modalOpen && modalType === "create" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("createShipment")}</h3>
              <button onClick={closeModal} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("order")}</label>
                <select className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors">
                  <option>Select order...</option>
                  <option>ORD-2024-1285 (Acme Industries)</option>
                  <option>ORD-2024-1286 (Global Supplies)</option>
                  <option>ORD-2024-1287 (Summit Logistics)</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("carrier")}</label>
                <select className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors">
                  <option>Select carrier...</option>
                  <option>FedEx</option>
                  <option>UPS</option>
                  <option>DHL</option>
                  <option>Local Carrier</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("service")}</label>
                <select className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors">
                  <option>Ground</option>
                  <option>Express</option>
                  <option>Overnight</option>
                  <option>International</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold text-text-body bg-dash-header-bg hover:bg-dash-divider transition-colors">{t("cancel")}</button>
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors">{t("createShipment")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Carrier Config Modal ────────────────────– */}
      {modalOpen && modalType === "carrier" && selectedCarrier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("configure")} {selectedCarrier.name}</h3>
              <button onClick={closeModal} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">Carrier Account ID</label>
                <input type="text" placeholder="Account identifier" defaultValue={selectedCarrier.name.toLowerCase().replace(" ", "_")} className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">API Key</label>
                <input type="password" placeholder="API key" className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em]">Active Services</label>
                {selectedCarrier.services.map((svc) => (
                  <label key={svc} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-brand" />
                    <span className="text-[13px] text-text-body">{svc}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold text-text-body bg-dash-header-bg hover:bg-dash-divider transition-colors">{t("cancel")}</button>
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors">{t("saveChanges")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Rule Modal ──────────────────────────– */}
      {modalOpen && modalType === "rule" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">{t("addRule")}</h3>
              <button onClick={closeModal} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("ruleName")}</label>
                <input type="text" placeholder="e.g., Heavy Shipments" className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("condition")}</label>
                <input type="text" placeholder="e.g., Weight > 10 kg" className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("priority")}</label>
                <input type="number" placeholder="1 (highest)" min="1" className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-text-dim uppercase tracking-[0.05em] block mb-2">{t("assignedCarrier")}</label>
                <select className="w-full h-9 px-3 rounded-lg border border-dash-card-border bg-dash-header-bg text-text-body text-[13px] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors">
                  <option>Select carrier...</option>
                  <option>FedEx</option>
                  <option>UPS</option>
                  <option>DHL</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold text-text-body bg-dash-header-bg hover:bg-dash-divider transition-colors">{t("cancel")}</button>
                <button onClick={closeModal} className="flex-1 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors">{t("addRule")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Detail Modal */}
      {detailOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDetailOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative w-full max-w-2xl bg-dash-card rounded-2xl shadow-[0_24px_80px_rgba(9,20,38,0.22)] border border-dash-card-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-[15px] font-semibold text-text-heading">Shipment Details</h3>
              <button onClick={() => setDetailOpen(false)} className="flex items-center justify-center w-7 h-7 rounded-lg text-text-dim hover:text-brand hover:bg-brand-light transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("shipmentId")}</p>
                  <p className="text-[14px] font-bold text-text-heading mt-1">{selectedShipment.shipmentId}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.05em]">Order Reference</p>
                  <p className="text-[14px] font-bold text-text-heading mt-1">{selectedShipment.orderRef}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("customer")}</p>
                  <p className="text-[13px] text-text-body mt-1">{selectedShipment.customer}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("carrier")}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-[5px] text-[11px] font-semibold mt-1 ${carrierCls[selectedShipment.carrier]}`}>{selectedShipment.carrier}</span>
                </div>
              </div>
              <div className="bg-dash-header-bg rounded-lg p-3 space-y-2">
                <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("trackingDelivery")}</p>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div><p className="text-text-dim">{t("tracking")}:</p><p className="font-mono text-text-body">{selectedShipment.trackingNumber}</p></div>
                  <div><p className="text-text-dim">{t("service")}:</p><p className="text-text-body">{selectedShipment.serviceLevel}</p></div>
                  <div><p className="text-text-dim">{t("estDelivery")}:</p><p className="text-text-body">{new Date(selectedShipment.estDelivery).toLocaleDateString()}</p></div>
                  <div><p className="text-text-dim">{t("weight")}:</p><p className="text-text-body">{selectedShipment.weight}</p></div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.05em]">{t("shipmentTimeline")}</p>
                <div className="space-y-2">
                  {[
                    { status: "Created", time: "Jun 28, 2024 10:30 AM" },
                    { status: "Picked Up", time: "Jun 28, 2024 2:15 PM" },
                    { status: "In Transit", time: "Jun 28, 2024 6:45 PM" },
                  ].map((evt, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand" />
                        {idx < 2 && <div className="w-0.5 h-8 bg-dash-divider" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-[12px] font-semibold text-text-body">{evt.status}</p>
                        <p className="text-[11px] text-text-dim">{evt.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}