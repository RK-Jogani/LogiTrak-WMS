"use client";

import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: any; // Using any for mock data simplicity
}

export function TaskDetailDrawer({ isOpen, onClose, task }: TaskDetailDrawerProps) {
  const { t } = useLanguageStore();
  const [taskTitle, setTaskTitle] = useState(task?.title || "");

  if (!isOpen) return null;

  const mockUsers = [
    { id: 1, name: "M. Rodriguez", initials: "MR", color: "#1466c0" },
    { id: 2, name: "J. Smith", initials: "JS", color: "#00b894" },
    { id: 3, name: "L. Chen", initials: "LC", color: "#e17055" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "URGENT": return "#e53e3e";
      case "HIGH": return "#ed8936";
      case "NORMAL": return "#ecc94b";
      case "LOW": return "#a0aec0";
      default: return "#cbd5e0";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente": return "#718096";
      case "En Curso": return "#0984e3";
      case "Bloqueada": return "#e53e3e";
      case "En Revisión": return "#ed8936";
      case "Hecho": return "#38a169";
      default: return "#cbd5e0";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className="relative z-10 w-[600px] h-full flex flex-col shadow-2xl transition-transform transform translate-x-0 overflow-y-auto"
        style={{ backgroundColor: "#f8f9fc" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 bg-white border-b border-gray-200">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-2 group cursor-pointer">
              <input 
                type="text" 
                value={taskTitle} 
                onChange={(e) => setTaskTitle(e.target.value)}
                className="text-xl font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-[#00b894] rounded px-1 w-full"
              />
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#00b894] text-[18px]">
                edit
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ID: TASK-1029 • Created just now</p>
          </div>
          <div className="flex items-center gap-4">
            <div 
              className="px-3 py-1 rounded text-xs font-semibold text-white"
              style={{ backgroundColor: getStatusColor(task?.status || "Pendiente") }}
            >
              {task?.status || "Pendiente"}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content (Two columns) */}
        <div className="flex flex-col lg:flex-row flex-1 p-6 gap-6">
          
          {/* Left Column (60%) */}
          <div className="w-full lg:w-[60%] space-y-6">
            
            {/* Description */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-[18px]">subject</span>
                Description
              </h3>
              <textarea 
                className="w-full text-sm text-gray-600 border border-gray-200 rounded-md p-3 min-h-[100px] focus:outline-none focus:border-[#00b894]"
                placeholder="Add task description..."
                defaultValue={task?.description || ""}
              ></textarea>
            </div>

            {/* Checklist */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400 text-[18px]">checklist</span>
                  {t("checklist")}
                </h3>
                <span className="text-xs text-gray-500">50%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                <div className="bg-[#00b894] h-1.5 rounded-full" style={{ width: "50%" }}></div>
              </div>
              <div className="space-y-2 mb-3">
                {/* Mock Checklist Items */}
                <div className="flex items-center gap-2 group">
                  <input type="checkbox" checked readOnly className="w-4 h-4 text-[#00b894] rounded border-gray-300 focus:ring-[#00b894]" />
                  <span className="text-sm text-gray-500 line-through">Verify container seal</span>
                  <button className="ml-auto text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                </div>
                <div className="flex items-center gap-2 group">
                  <input type="checkbox" className="w-4 h-4 text-[#00b894] rounded border-gray-300 focus:ring-[#00b894]" />
                  <span className="text-sm text-gray-700">Count palettes</span>
                  <button className="ml-auto text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-[18px]">add</span>
                <input type="text" placeholder={t("addChecklistItem")} className="text-sm border-none focus:outline-none flex-1 text-gray-600 bg-transparent" />
              </div>
            </div>

            {/* File Attachments */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-[18px]">attach_file</span>
                {t("fileAttachments")}
              </h3>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer mb-3">
                <span className="material-symbols-outlined text-gray-400 text-[24px] mb-2">upload_file</span>
                <p className="text-xs text-gray-500">{t("dragFilesHere")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="material-symbols-outlined text-red-500 text-[20px]">picture_as_pdf</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">shipping_label_PL8842.pdf</p>
                    <p className="text-[10px] text-gray-500">1.2 MB</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-[16px]">download</span></button>
                    <button className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments & Activity */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-[18px]">forum</span>
                {t("commentsActivity")}
              </h3>
              <div className="space-y-4 mb-4">
                {/* System Event */}
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-gray-500 text-[12px]">auto_awesome</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status changed from <span className="font-medium text-gray-500">Pendiente</span> to <span className="font-medium text-blue-600">En Curso</span> by M. Rodriguez</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Today at 10:34 AM</p>
                  </div>
                </div>
                {/* User Comment */}
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#1466c0] flex items-center justify-center shrink-0 mt-0.5 text-white text-[10px] font-bold">
                    MR
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-800">M. Rodriguez</span>
                      <span className="text-[10px] text-gray-400">10:45 AM</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg rounded-tl-none p-3 text-xs text-gray-600">
                      I've started reviewing the discrepancy, waiting for the forklift operator.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-start border-t border-gray-100 pt-4">
                <div className="w-6 h-6 rounded-full bg-[#00b894] flex items-center justify-center shrink-0 text-white text-[10px] font-bold">
                  JS
                </div>
                <div className="flex-1">
                  <textarea 
                    className="w-full text-xs text-gray-600 border border-gray-200 rounded-md p-2 min-h-[60px] focus:outline-none focus:border-[#00b894]"
                    placeholder={t("addComment")}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button className="bg-[#00b894] hover:bg-[#00a383] text-white text-xs font-medium px-4 py-1.5 rounded transition-colors">
                      {t("post")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (40%) - Form Fields */}
          <div className="w-full lg:w-[40%] space-y-4">
            
            {/* Status Dropdown */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("status")}</label>
              <select className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-[#00b894] focus:border-[#00b894] text-gray-700 bg-white p-2 border">
                <option value="Pendiente">Pendiente</option>
                <option value="En Curso">En Curso</option>
                <option value="Bloqueada">Bloqueada</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Hecho">Hecho</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("priority")}</label>
              <select className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-[#00b894] focus:border-[#00b894] text-gray-700 bg-white p-2 border">
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="NORMAL">Normal</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Responsible */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("responsible")}</label>
              <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-gray-400 transition-colors">
                 <div className="w-5 h-5 rounded-full bg-[#1466c0] flex items-center justify-center text-white text-[9px] font-bold">MR</div>
                 <span className="text-sm text-gray-700 flex-1">M. Rodriguez</span>
                 <span className="material-symbols-outlined text-gray-400 text-[18px]">expand_more</span>
              </div>
            </div>

            {/* Collaborators */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("collaborators")}</label>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-[38px]">
                <div className="flex items-center gap-1 bg-gray-100 rounded-full pl-1 pr-2 py-0.5">
                  <div className="w-4 h-4 rounded-full bg-[#00b894] flex items-center justify-center text-white text-[8px] font-bold">JS</div>
                  <span className="text-xs text-gray-600">J. Smith</span>
                  <span className="material-symbols-outlined text-gray-400 text-[14px] cursor-pointer hover:text-red-500">close</span>
                </div>
                <button className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400">
                  <span className="material-symbols-outlined text-[14px]">add</span>
                </button>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("dueDate")}</label>
              <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-white">
                <span className="material-symbols-outlined text-red-500 text-[18px]">event</span>
                <input type="date" className="text-sm text-red-500 font-medium border-none focus:outline-none bg-transparent w-full" defaultValue="2026-07-07" />
              </div>
            </div>

            {/* Task Type */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("taskType")}</label>
              <select className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-[#00b894] focus:border-[#00b894] text-gray-700 bg-white p-2 border">
                <option>Receiving</option>
                <option>Picking/Packing</option>
                <option>Inventory</option>
                <option>Returns</option>
                <option>Incidents</option>
              </select>
            </div>

            {/* Warehouse Zone */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("zone")}</label>
              <select className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-[#00b894] focus:border-[#00b894] text-gray-700 bg-white p-2 border">
                <option>Receiving / Dock</option>
                <option>Ecommerce</option>
                <option>Pallets</option>
                <option>Packing</option>
                <option>Blocked Stock</option>
              </select>
            </div>

            {/* Linked Operation */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("linkedOperation")}</label>
              <div className="flex gap-2">
                <select className="w-1/3 text-xs border-gray-300 rounded-md shadow-sm focus:ring-[#00b894] focus:border-[#00b894] text-gray-700 bg-white p-2 border">
                  <option>Order</option>
                  <option>Container</option>
                  <option>Location</option>
                  <option>SKU</option>
                </select>
                <input type="text" placeholder="ID..." className="w-2/3 text-sm border border-gray-300 rounded-md px-2 focus:ring-[#00b894] focus:border-[#00b894]" defaultValue="HL-2026-07" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">{t("tags")}</label>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-[38px]">
                <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-[10px] font-semibold flex items-center gap-1">
                  Urgente <span className="material-symbols-outlined text-[12px] cursor-pointer hover:text-red-900">close</span>
                </span>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-semibold flex items-center gap-1">
                  Contenedor <span className="material-symbols-outlined text-[12px] cursor-pointer hover:text-blue-900">close</span>
                </span>
                <button className="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-1 px-1">
                  <span className="material-symbols-outlined text-[14px]">add</span> Add Tag
                </button>
              </div>
            </div>

            {/* Read-only info */}
            <div className="bg-gray-50 p-3 rounded border border-gray-100 text-xs text-gray-500 space-y-1">
              <p>Created By: <span className="font-medium text-gray-700">System (Auto)</span></p>
              <p>Created At: <span className="font-medium text-gray-700">06 Jul 2026, 08:30 AM</span></p>
              <p>Last Updated: <span className="font-medium text-gray-700">07 Jul 2026, 10:34 AM</span></p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button className="w-full bg-[#00b894] hover:bg-[#00a383] text-white font-medium py-2 rounded shadow-sm transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Changes
              </button>
              <div className="flex gap-2">
                <button className="flex-1 border border-green-500 text-green-600 hover:bg-green-50 font-medium py-1.5 rounded transition-colors text-sm flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  {t("markAsDone")}
                </button>
                <button className="flex-1 border border-red-300 text-red-500 hover:bg-red-50 font-medium py-1.5 rounded transition-colors text-sm flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">archive</span>
                  {t("archiveTask")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change History (Full width bottom) */}
        <div className="px-6 pb-6 pt-2">
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{t("changeHistory")}</h3>
            <div className="relative border-l border-gray-200 ml-3 space-y-4">
              <div className="relative pl-6">
                <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -left-[5px] top-1 border-2 border-white"></div>
                <p className="text-[10px] text-gray-400 mb-0.5">Today at 10:34 AM • M. Rodriguez</p>
                <p className="text-xs text-gray-600">Changed Status from <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">Pendiente</span> to <span className="bg-[#e6f4f1] text-[#00b894] px-1.5 py-0.5 rounded font-medium">En Curso</span></p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-2.5 h-2.5 bg-gray-300 rounded-full -left-[5px] top-1 border-2 border-white"></div>
                <p className="text-[10px] text-gray-400 mb-0.5">Yesterday at 08:30 AM • System (Auto)</p>
                <p className="text-xs text-gray-600">Task created via Automation Rule #4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
