"use client";

import React from "react";
import { useLanguageStore } from "../../../../store/languageStore";

export default function TransfersPage() {
  const { t } = useLanguageStore();

  const mockTransfers = [
    { id: "TRF-8841", from: "Receiving Dock", to: "Zone A (Aisle 4)", sku: "SKU-9921", qty: 50, status: "Pending", date: "2026-07-06" },
    { id: "TRF-8842", from: "Zone B (Aisle 12)", to: "Packing Area", sku: "SKU-3100", qty: 15, status: "In Transit", date: "2026-07-06" },
    { id: "TRF-8843", from: "Cold Storage", to: "Ecommerce Pick", sku: "SKU-4402", qty: 100, status: "Completed", date: "2026-07-05" },
    { id: "TRF-8844", from: "Returns", to: "Blocked Stock", sku: "SKU-1122", qty: 2, status: "Completed", date: "2026-07-04" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending": return <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-medium border border-yellow-200">Pending</span>;
      case "In Transit": return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-200">In Transit</span>;
      case "Completed": return <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">Completed</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-[#f4f7fb] min-h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#00b894] font-medium mb-2 cursor-pointer hover:underline">
             <span className="material-symbols-outlined text-[16px]">arrow_back</span>
             Back to Inventory
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t("transfers")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("inventoryTransfersSubtitle")}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00b894] text-white rounded-md font-medium hover:bg-[#00a383] transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Transfer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-800">Recent Transfers</h2>
          <div className="relative w-64">
             <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
             <input type="text" placeholder="Search by SKU or ID..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#00b894] bg-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase w-32">Transfer ID</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{t("fromLocation")}</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{t("toLocation")}</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase w-32">SKU</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase w-24">Qty</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase w-32">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase w-32">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockTransfers.map((trf) => (
                <tr key={trf.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm font-bold text-gray-800">{trf.id}</span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="material-symbols-outlined text-gray-400 text-[16px]">location_on</span>
                      {trf.from}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00b894] text-[16px]">location_on</span>
                      {trf.to}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">{trf.sku}</span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm font-bold text-gray-800">{trf.qty}</span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    {getStatusBadge(trf.status)}
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm text-gray-500">
                      {new Date(trf.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle text-right">
                    <button className="text-[#00b894] hover:bg-[#e6f4f1] px-2 py-1 rounded text-sm font-medium transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
