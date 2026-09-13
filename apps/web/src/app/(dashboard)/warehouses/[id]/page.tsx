"use client";

import React from "react";
import { useLanguageStore } from "@/store/languageStore";

export default function WarehouseDetailPage({ params }: { params: { id: string } }) {
  const { t } = useLanguageStore();
  
  // Mock data based on id
  const warehouseName = params.id === "1" ? "Miami Distribution Center" : `Warehouse ${params.id}`;

  return (
    <div className="p-6 bg-[#f4f7fb] min-h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#00b894] font-medium mb-2 cursor-pointer hover:underline">
             <span className="material-symbols-outlined text-[16px]">arrow_back</span>
             Back to Warehouses
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{warehouseName}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("overview")} and configuration.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Edit Details
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#00b894] text-white rounded-md font-medium hover:bg-[#00a383] transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Zone
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("totalZones")}</p>
            <h3 className="text-2xl font-bold text-gray-800">8</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined text-[24px]">view_quilt</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("totalLocations")}</p>
            <h3 className="text-2xl font-bold text-gray-800">1,240</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
            <span className="material-symbols-outlined text-[24px]">grid_on</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("totalSKUs")}</p>
            <h3 className="text-2xl font-bold text-gray-800">8,590</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <span className="material-symbols-outlined text-[24px]">category</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("occupied")}</p>
            <h3 className="text-2xl font-bold text-gray-800">76%</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <span className="material-symbols-outlined text-[24px]">pie_chart</span>
          </div>
        </div>
      </div>

      {/* Zone Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-800">{t("zoneBreakdown")}</h2>
          <div className="relative w-64">
             <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
             <input type="text" placeholder="Search zones..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#00b894] bg-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Zone Name</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Locations</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Capacity</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: "Zone A (Aisles 1-10)", role: "Storage - Fast Moving", locs: 400, cap: 85 },
                { name: "Zone B (Aisles 11-20)", role: "Storage - Slow Moving", locs: 600, cap: 60 },
                { name: "Receiving Dock", role: "Staging / Receiving", locs: 50, cap: 90 },
                { name: "Packing Area", role: "Processing", locs: 40, cap: 45 },
                { name: "Cold Storage", role: "Temperature Controlled", locs: 150, cap: 95 },
              ].map((zone, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm font-medium text-gray-800">{zone.name}</span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{zone.role}</span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm font-medium text-gray-700">{zone.locs}</span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${zone.cap > 90 ? 'bg-red-500' : 'bg-[#00b894]'}`} style={{ width: `${zone.cap}%` }}></div>
                      </div>
                      <span className={`text-xs font-bold ${zone.cap > 90 ? 'text-red-600' : 'text-gray-700'}`}>{zone.cap}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle text-right">
                    <button className="text-gray-400 hover:text-[#00b894] transition-colors p-1">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-800">{t("recentActivity")}</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex gap-4">
            <div className="mt-1">
              <span className="material-symbols-outlined text-blue-500">inventory_2</span>
            </div>
            <div>
              <p className="text-sm text-gray-700 font-medium">Received 140 units of SKU-9921 in Zone A</p>
              <p className="text-xs text-gray-500">10 mins ago by M. Rodriguez</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="mt-1">
              <span className="material-symbols-outlined text-[#00b894]">move_up</span>
            </div>
            <div>
              <p className="text-sm text-gray-700 font-medium">Stock transfer: 50 units moved from Receiving Dock to Zone B</p>
              <p className="text-xs text-gray-500">45 mins ago by System (Auto-Replenish)</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="mt-1">
              <span className="material-symbols-outlined text-orange-500">warning</span>
            </div>
            <div>
              <p className="text-sm text-gray-700 font-medium">Location A-12-B marked as BLOCKED for maintenance</p>
              <p className="text-xs text-gray-500">2 hours ago by J. Smith</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}