"use client";

import React, { useState, useMemo } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { TaskDetailDrawer } from "@/components/tasks/TaskDetailDrawer";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Mock Data Types
interface TaskItem {
  id: string;
  title: string;
  type: string;
  responsible: { name: string; initials: string; color: string };
  priority: "URGENT" | "HIGH" | "NORMAL" | "LOW";
  zone: string;
  linkedTo: string | null;
  dueDate: string;
  status: string;
  createdAt: string;
}

const MOCK_TASKS: TaskItem[] = [
  { id: "TSK-001", title: "Review incoming shipment documentation", type: "Inspection", responsible: { name: "M. Rodriguez", initials: "MR", color: "#1466c0" }, priority: "HIGH", zone: "Receiving", linkedTo: "PO-2026", dueDate: "2026-07-06", status: "PENDING", createdAt: "2026-07-05" },
  { id: "TSK-002", title: "Conduct cycle count in Aisle 4", type: "Audit", responsible: { name: "J. Smith", initials: "JS", color: "#00b894" }, priority: "NORMAL", zone: "General", linkedTo: null, dueDate: "2026-07-08", status: "IN_PROGRESS", createdAt: "2026-07-06" },
  { id: "TSK-003", title: "Fix jammed conveyor belt", type: "Maintenance", responsible: { name: "L. Chen", initials: "LC", color: "#e17055" }, priority: "URGENT", zone: "Dock", linkedTo: "EQ-102", dueDate: "2026-07-05", status: "BLOCKED", createdAt: "2026-07-05" },
  { id: "TSK-004", title: "Process return ORD-9912", type: "Return", responsible: { name: "S. Lee", initials: "SL", color: "#6c5ce7" }, priority: "LOW", zone: "Returns", linkedTo: "RTN-9912", dueDate: "2026-07-10", status: "COMPLETED", createdAt: "2026-07-01" },
];

const priorityColors = {
  URGENT: "text-red-700 bg-red-100",
  HIGH: "text-orange-700 bg-orange-100",
  NORMAL: "text-yellow-700 bg-yellow-100",
  LOW: "text-gray-600 bg-gray-100",
};

const statusColors: Record<string, string> = {
  PENDING: "text-gray-700 bg-gray-100",
  IN_PROGRESS: "text-blue-700 bg-blue-100",
  BLOCKED: "text-red-700 bg-red-100",
  IN_REVIEW: "text-orange-700 bg-orange-100",
  COMPLETED: "text-green-700 bg-green-100",
  CANCELED: "text-gray-500 bg-gray-50",
};

export default function TaskListPage() {
  const { t } = useLanguageStore();
  const pathname = usePathname();

  const [tasks] = useState<TaskItem[]>(MOCK_TASKS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.size === tasks.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(tasks.map(t => t.id)));
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const isOverdue = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("taskList") || "Task List"}</h1>
          <p className="text-[13px] text-text-muted mt-0.5">{t("taskListSubtitle") || "Filter, sort, and manage all tasks."}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-dash-card border border-dash-card-border rounded-lg p-1">
            <Link href="/tasks/board" className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${pathname === "/tasks/board" ? "bg-brand/10 text-brand" : "text-text-muted hover:text-text-body"}`}>
              {t("board")}
            </Link>
            <Link href="/tasks/list" className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${pathname === "/tasks/list" ? "bg-brand/10 text-brand" : "text-text-muted hover:text-text-body"}`}>
              {t("list")}
            </Link>
          </div>
          
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
            <span className="material-symbols-outlined text-[16px]">download</span>
            {t("exportCsv") || "Export CSV"}
          </button>
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            {t("newTask")}
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-brand/10 border border-brand/20 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-brand">{selectedIds.size} {t("tasksSelected") || "tasks selected"}</span>
            <button onClick={() => setSelectedIds(new Set())} className="text-[13px] text-brand hover:underline font-medium">
              {t("clearSelection") || "Clear Selection"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 h-8 rounded-lg border border-dash-card-border bg-white text-[12px] font-medium text-text-body hover:border-brand hover:text-brand transition-colors">
              {t("bulkReassign") || "Bulk Reassign"}
            </button>
            <select className="h-8 px-2 rounded-lg border border-dash-card-border bg-white text-[12px] font-medium text-text-body hover:border-brand transition-colors outline-none cursor-pointer">
              <option value="">{t("bulkChangeStatus") || "Change Status"}</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button className="px-3 h-8 rounded-lg border border-dash-card-border bg-white text-[12px] font-medium text-status-error hover:border-status-error hover:bg-red-50 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">archive</span>
              {t("archiveSelected") || "Archive Selected"}
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-text-muted">search</span>
          <input type="text" placeholder={t("searchTasks") || "Search tasks..."} className="w-full h-9 pl-9 pr-3 rounded-lg border border-dash-card-border bg-dash-bg text-[13px] focus:outline-none focus:border-brand" />
        </div>
        <select className="h-9 px-3 rounded-lg border border-dash-card-border bg-dash-bg text-[13px] text-text-body outline-none min-w-[120px]">
          <option value="">{t("allStatuses") || "Status: All"}</option>
        </select>
        <select className="h-9 px-3 rounded-lg border border-dash-card-border bg-dash-bg text-[13px] text-text-body outline-none min-w-[120px]">
          <option value="">{t("allAssignees") || "Responsible: All"}</option>
        </select>
        <select className="h-9 px-3 rounded-lg border border-dash-card-border bg-dash-bg text-[13px] text-text-body outline-none min-w-[120px]">
          <option value="">{t("allPriorities") || "Priority: All"}</option>
        </select>
        <select className="h-9 px-3 rounded-lg border border-dash-card-border bg-dash-bg text-[13px] text-text-body outline-none min-w-[120px]">
          <option value="">{t("allZones") || "Zone: All"}</option>
        </select>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-text-muted">calendar_today</span>
          <input type="date" className="h-9 pl-9 pr-3 rounded-lg border border-dash-card-border bg-dash-bg text-[13px] text-text-body outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-dash-card border border-dash-card-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-dash-header-bg border-b border-dash-card-border">
              <tr>
                <th className="px-4 py-3 w-10 text-center">
                  <input type="checkbox" onChange={toggleSelectAll} checked={tasks.length > 0 && selectedIds.size === tasks.length} className="w-4 h-4 rounded border-dash-card-border accent-brand cursor-pointer" />
                </th>
                {["Task ID", "Title", "Type", "Responsible", "Priority", "Zone", "Linked To", "Due Date", "Status", "Created", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold text-text-dim uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => (
                <tr key={task.id} className={`hover:bg-dash-row-hover transition-colors ${idx < tasks.length - 1 ? "border-b border-dash-divider" : ""}`}>
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" checked={selectedIds.has(task.id)} onChange={() => toggleSelect(task.id)} className="w-4 h-4 rounded border-dash-card-border accent-brand cursor-pointer" />
                  </td>
                  <td className="px-4 py-3">
                    <span onClick={() => setSelectedTask(task)} className="text-[12px] font-bold font-mono text-brand cursor-pointer hover:underline">{task.id}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-text-heading max-w-[200px] truncate" title={task.title}>{task.title}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-600">{task.type}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: task.responsible.color }}>
                        {task.responsible.initials}
                      </div>
                      <span className="text-[13px] text-text-body">{task.responsible.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${priorityColors[task.priority]}`}>{task.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-muted">{task.zone}</td>
                  <td className="px-4 py-3">
                    {task.linkedTo ? <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-brand/10 text-brand">{task.linkedTo}</span> : <span className="text-[13px] text-text-dim">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[12px] font-medium ${isOverdue(task.dueDate) ? "text-status-error font-bold" : "text-text-muted"}`}>{task.dueDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${statusColors[task.status] || "bg-gray-100 text-gray-700"}`}>{task.status.replace("_", " ")}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-muted">{task.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedTask(task)} className="p-1 text-text-dim hover:text-brand hover:bg-brand-light rounded transition-colors" title="View">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button className="p-1 text-text-dim hover:text-brand hover:bg-brand-light rounded transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button className="p-1 text-text-dim hover:text-brand hover:bg-brand-light rounded transition-colors" title="More Options">
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-dash-header-bg border-t border-dash-divider">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-text-dim">{t("rowsPerPage") || "Rows per page:"}</span>
            <select className="h-7 px-2 rounded border border-dash-card-border bg-white text-[12px] text-text-body outline-none cursor-pointer">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-text-dim">1-4 of 4</span>
            <div className="flex gap-1">
              <button disabled className="p-1 rounded border border-dash-card-border text-text-dim opacity-50 cursor-not-allowed">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button disabled className="p-1 rounded border border-dash-card-border text-text-dim opacity-50 cursor-not-allowed">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <TaskDetailDrawer
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  );
}
