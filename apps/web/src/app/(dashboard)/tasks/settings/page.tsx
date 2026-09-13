"use client";

import React, { useState } from "react";
import { useLanguageStore } from "../../../../store/languageStore";

export default function TaskSettingsPage() {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState("labels");

  return (
    <div className="flex flex-col h-full bg-[#f4f7fb] overflow-hidden">
      <div className="px-6 py-5 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">{t("taskSettings")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("taskSettingsSubtitle")}</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-1 flex flex-col shrink-0">
          <button
            onClick={() => setActiveTab("labels")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === "labels" ? "bg-[#e6f4f1] text-[#00b894] font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">label</span>
            {t("labelsTags")}
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === "assignments" ? "bg-[#e6f4f1] text-[#00b894] font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">group_add</span>
            {t("defaultAssignments")}
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeTab === "rules" ? "bg-[#e6f4f1] text-[#00b894] font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">robot_2</span>
            {t("automationRules")}
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "labels" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("labelsTags")}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="font-medium text-gray-700">Urgente</span>
                  </div>
                  <button className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="font-medium text-gray-700">Contenedor</span>
                  </div>
                  <button className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span className="font-medium text-gray-700">Revisión Adicional</span>
                  </div>
                  <button className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
                <button className="mt-2 text-sm text-[#00b894] font-medium flex items-center gap-1 hover:underline">
                  <span className="material-symbols-outlined text-[18px]">add</span> Add New Tag
                </button>
              </div>
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("defaultAssignments")}</h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Receiving Tasks</label>
                  <select className="border border-gray-300 rounded p-2 text-sm text-gray-700 focus:outline-none focus:border-[#00b894]">
                    <option>M. Rodriguez</option>
                    <option>J. Smith</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory Tasks</label>
                  <select className="border border-gray-300 rounded p-2 text-sm text-gray-700 focus:outline-none focus:border-[#00b894]">
                    <option>L. Chen</option>
                    <option>A. Patel</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-3xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">{t("automationRules")}</h2>
                <button className="text-sm bg-[#00b894] text-white px-3 py-1.5 rounded font-medium hover:bg-[#00a383] transition-colors">Create Rule</button>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-[#00b894] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-700">Auto-assign Returns</h4>
                    <div className="w-10 h-5 bg-[#00b894] rounded-full flex items-center px-0.5 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full translate-x-5 shadow-sm"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">When a new task is created with type "Returns", assign it to M. Rodriguez.</p>
                  <div className="text-xs text-gray-400">Triggered 14 times this week</div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg hover:border-[#00b894] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-700">Overdue Notification</h4>
                    <div className="w-10 h-5 bg-[#00b894] rounded-full flex items-center px-0.5 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full translate-x-5 shadow-sm"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">If a task is past its Due Date by 24h, change priority to URGENT and notify manager.</p>
                  <div className="text-xs text-gray-400">Triggered 2 times this week</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
