"use client";

import React from "react";
import { useLanguageStore } from "../../../../store/languageStore";

export default function UserManagementPage() {
  const { t } = useLanguageStore();

  const mockUsers = [
    { id: 1, name: "M. Rodriguez", email: "m.rodriguez@logitrak.com", role: "Super Admin", access: ["All Warehouses"], lastLogin: "Just now", status: "Active", initials: "MR", color: "#1466c0" },
    { id: 2, name: "J. Smith", email: "j.smith@logitrak.com", role: "Warehouse Manager", access: ["Miami DC"], lastLogin: "2 hours ago", status: "Active", initials: "JS", color: "#00b894" },
    { id: 3, name: "L. Chen", email: "l.chen@logitrak.com", role: "Inventory Specialist", access: ["Miami DC"], lastLogin: "Yesterday", status: "Active", initials: "LC", color: "#e17055" },
    { id: 4, name: "A. Patel", email: "a.patel@logitrak.com", role: "Picker", access: ["Miami DC", "Orlando Hub"], lastLogin: "3 days ago", status: "Suspended", initials: "AP", color: "#6c5ce7" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">Active</span>;
      case "Suspended": return <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-200">Suspended</span>;
      case "Pending": return <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-medium border border-yellow-200">Pending</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-[#f4f7fb] min-h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("userManagement")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("userManagementSubtitle")}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00b894] text-white rounded-md font-medium hover:bg-[#00a383] transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          {t("inviteUser")}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Active Users</p>
            <h3 className="text-3xl font-bold text-gray-800">45</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined text-[24px]">group</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("pendingInvitations")}</p>
            <h3 className="text-3xl font-bold text-orange-600">3</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <span className="material-symbols-outlined text-[24px]">mark_email_unread</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("rolesPermissions")}</p>
            <h3 className="text-3xl font-bold text-gray-800">6</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-gray-800">All Users</h2>
            <div className="flex gap-2">
              <span className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-50">All</span>
              <span className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-50">Active</span>
              <span className="text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-50">Suspended</span>
            </div>
          </div>
          <div className="relative w-64">
             <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
             <input type="text" placeholder="Search by name or email..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#00b894] bg-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{t("warehouseAccess")}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{t("lastLogin")}</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: user.color }}>
                        {user.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <div className="flex flex-wrap gap-1">
                      {user.access.map((acc, i) => (
                        <span key={i} className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <span className="text-sm text-gray-600">{user.lastLogin}</span>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 align-middle text-right">
                    <button className="text-gray-400 hover:text-[#00b894] transition-colors p-1" title={t("editPermissions")}>
                      <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
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
