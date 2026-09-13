"use client";

import React, { useState } from "react";
import { useLanguageStore } from "../../../../store/languageStore";
import { TaskDetailDrawer } from "../../../../components/tasks/TaskDetailDrawer";

export default function MyTasksPage() {
  const { t } = useLanguageStore();
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const mockMyTasks = [
    {
      id: "TASK-1029",
      title: "Verify incoming shipment pallets",
      linkedTo: "Container #8849",
      priority: "HIGH",
      status: "Pendiente",
      dueDate: "2026-07-07",
    },
    {
      id: "TASK-1032",
      title: "Process return #RT-992",
      linkedTo: "Order #992-RT",
      priority: "HIGH",
      status: "En Revisión",
      dueDate: "2026-07-06",
    },
    {
      id: "TASK-1045",
      title: "Restock Pick Face A-12",
      linkedTo: "SKU-9901",
      priority: "NORMAL",
      status: "En Curso",
      dueDate: "2026-07-08",
    },
    {
      id: "TASK-1050",
      title: "Clean up packing station 2",
      linkedTo: "-",
      priority: "LOW",
      status: "Bloqueada",
      dueDate: "2026-07-05",
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendiente": return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium border border-gray-200">Pendiente</span>;
      case "En Curso": return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-200">En Curso</span>;
      case "Bloqueada": return <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-200">Bloqueada</span>;
      case "En Revisión": return <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium border border-orange-200">En Revisión</span>;
      case "Hecho": return <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-200">Hecho</span>;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT": return <span className="text-red-600 font-bold text-xs"><span className="material-symbols-outlined text-[14px] align-middle mr-1">keyboard_double_arrow_up</span>URGENT</span>;
      case "HIGH": return <span className="text-orange-500 font-bold text-xs"><span className="material-symbols-outlined text-[14px] align-middle mr-1">keyboard_arrow_up</span>HIGH</span>;
      case "NORMAL": return <span className="text-yellow-600 font-bold text-xs"><span className="material-symbols-outlined text-[14px] align-middle mr-1">drag_handle</span>NORMAL</span>;
      case "LOW": return <span className="text-gray-500 font-bold text-xs"><span className="material-symbols-outlined text-[14px] align-middle mr-1">keyboard_arrow_down</span>LOW</span>;
      default: return null;
    }
  };

  return (
    <div className="p-6 bg-[#f4f7fb] min-h-full">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("myTasks")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("myTasksSubtitle")}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#00b894] text-white rounded-md font-medium hover:bg-[#00a383] transition-colors shadow-sm">
          <span className="material-symbols-outlined text-[20px]">add</span>
          {t("newTask")}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("totalAssigned")}</p>
            <h3 className="text-2xl font-bold text-gray-800">12</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined text-[24px]">assignment_ind</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("dueToday")}</p>
            <h3 className="text-2xl font-bold text-gray-800">4</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <span className="material-symbols-outlined text-[24px]">event_available</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("overdue")}</p>
            <h3 className="text-2xl font-bold text-red-600">1</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("completedThisWeek")}</p>
            <h3 className="text-2xl font-bold text-gray-800">28</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <span className="material-symbols-outlined text-[24px]">task_alt</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">Open Tasks</h2>
          <div className="relative w-64">
             <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
             <input type="text" placeholder={t("keywordSearch")} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#00b894]" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 w-32">Task ID</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">Title</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">Linked To</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 w-32">Priority</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 w-32">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 w-32">Due Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100 text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockMyTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedTask(task)}>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm font-bold text-gray-800">{task.id}</span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm font-medium text-gray-700">{task.title}</span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className="text-sm text-gray-500 border-b border-dashed border-gray-300 pb-0.5">{task.linkedTo}</span>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    {getPriorityBadge(task.priority)}
                  </td>
                  <td className="px-5 py-4 align-middle">
                    {getStatusBadge(task.status)}
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <span className={`text-sm font-medium ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-gray-600'}`}>
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-middle text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                      className="text-[#00b894] hover:bg-[#e6f4f1] px-2 py-1 rounded text-sm font-medium transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TaskDetailDrawer 
        isOpen={selectedTask !== null} 
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  );
}
