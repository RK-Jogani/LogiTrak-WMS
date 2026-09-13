"use client";

import React, { useState } from "react";
import { useLanguageStore } from "../../../../store/languageStore";

export default function AuditsPage() {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState("sessions");

  const mockSessions = [
    { id: "AUD-2026-001", zone: "Zone A (Aisles 1-10)", status: "In Progress", auditor: "M. Rodriguez", date: "2026-07-06" },
    { id: "AUD-2026-002", zone: "Cold Storage", status: "Completed", auditor: "J. Smith", date: "2026-07-05" },
    { id: "AUD-2026-003", zone: "Packing Area", status: "Completed", auditor: "System (Auto)", date: "2026-07-01" },
  ];

  const mockAdjustments = [
    { id: "ADJ-9921", sku: "SKU-4402", location: "A-12-B", oldQty: 100, newQty: 98, reason: "Damaged during handling", date: "2026-07-06", by: "M. Rodriguez" },
    { id: "ADJ-9922", sku: "SKU-3100", location: "C-01-A", oldQty: 15, newQty: 16, reason: "Found missing unit", date: "2026-07-05", by: "J. Smith" },
    { id: "ADJ-9923", sku: "SKU-1122", location: "RT-01", oldQty: 0, newQty: 2, reason: "Customer return processing", date: "2026-07-04", by: "L. Chen" },
  ];

  return (
    <div className="p-6 bg-[#f4f7fb] min-h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#00b894] font-medium mb-2 cursor-pointer hover:underline">
             <span className="material-symbols-outlined text-[16px]">arrow_back</span>
             Back to Inventory
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Audits</h1>
          <p className="text-sm text-gray-500 mt-1">{t("inventoryAuditsSubtitle")}</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#00b894] text-white rounded-md font-bold hover:bg-[#00a383] transition-colors shadow-md">
          <span className="material-symbols-outlined text-[20px]">fact_check</span>
          {t("startAudit")}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6">
          <button 
            onClick={() => setActiveTab("sessions")}
            className={`py-4 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === "sessions" ? "border-[#00b894] text-[#00b894]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {t("auditSessions")}
          </button>
          <button 
            onClick={() => setActiveTab("adjustments")}
            className={`py-4 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === "adjustments" ? "border-[#00b894] text-[#00b894]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {t("stockAdjustmentsLog")}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-0">
          {activeTab === "sessions" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Audit ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Zone / Area</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Auditor</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 align-middle">
                      <span className="text-sm font-bold text-gray-800">{session.id}</span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="text-sm font-medium text-gray-700">{session.zone}</span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className={`px-2.5 py-1 rounded text-xs font-medium border ${
                        session.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"
                      }`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-[18px]">person</span>
                        {session.auditor}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className="text-sm text-gray-500">
                        {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <button className="text-[#00b894] hover:bg-[#e6f4f1] px-3 py-1.5 rounded text-sm font-medium transition-colors">
                        {session.status === "In Progress" ? "Resume" : "View Details"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "adjustments" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Adj ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">SKU / Location</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">{t("oldQty")}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">{t("newQty")}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Diff</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{t("reason")}</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date / By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockAdjustments.map((adj) => {
                  const diff = adj.newQty - adj.oldQty;
                  return (
                    <tr key={adj.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 align-middle">
                        <span className="text-sm font-bold text-gray-800">{adj.id}</span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">{adj.sku}</span>
                          <span className="text-xs text-gray-500">{adj.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-center">
                        <span className="text-sm text-gray-500">{adj.oldQty}</span>
                      </td>
                      <td className="px-6 py-4 align-middle text-center">
                        <span className="text-sm font-bold text-gray-800">{adj.newQty}</span>
                      </td>
                      <td className="px-6 py-4 align-middle text-center">
                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                          diff > 0 ? "text-green-600 bg-green-50" : diff < 0 ? "text-red-600 bg-red-50" : "text-gray-500 bg-gray-100"
                        }`}>
                          {diff > 0 ? `+${diff}` : diff}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="text-sm text-gray-600">{adj.reason}</span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700">{new Date(adj.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="text-xs text-gray-500">{adj.by}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
