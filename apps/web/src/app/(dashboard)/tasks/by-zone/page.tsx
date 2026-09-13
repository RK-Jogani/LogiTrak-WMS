"use client";

import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { TaskDetailDrawer } from "@/components/tasks/TaskDetailDrawer";

interface TaskItem {
  id: string;
  title: string;
  type: string;
  responsible: { name: string; initials: string; color: string };
  priority: "URGENT" | "HIGH" | "NORMAL" | "LOW";
  linkedTo: string | null;
  dueDate: string;
  status: string;
}

const zones = [
  { id: "Receiving", label: "Receiving", count: 4 },
  { id: "Dock", label: "Dock/Muelles", count: 3 },
  { id: "Ecommerce", label: "Ecommerce", count: 5 },
  { id: "Pallets", label: "Pallets", count: 2 },
  { id: "Packing", label: "Packing", count: 3 },
  { id: "Returns", label: "Returns", count: 2 },
  { id: "Blocked Stock", label: "Blocked Stock", count: 1 },
  { id: "General", label: "General", count: 3 },
];

const mockZoneTasks: Record<string, TaskItem[]> = {
  Receiving: [
    { id: "TSK-R1", title: "Revisar diferencias contenedor HL-2026-07", type: "Inspection", responsible: { name: "M. Rodriguez", initials: "MR", color: "#1466c0" }, priority: "HIGH", linkedTo: "PO-2026", dueDate: "2026-07-06", status: "PENDING" },
    { id: "TSK-R2", title: "Escanear productos entrada proveedor X", type: "Receiving", responsible: { name: "J. Smith", initials: "JS", color: "#00b894" }, priority: "NORMAL", linkedTo: "RCV-882", dueDate: "2026-07-06", status: "IN_PROGRESS" },
    { id: "TSK-R3", title: "Verificar documentación aduanal", type: "Admin", responsible: { name: "L. Chen", initials: "LC", color: "#e17055" }, priority: "URGENT", linkedTo: null, dueDate: "2026-07-05", status: "BLOCKED" },
    { id: "TSK-R4", title: "Descargar camión logístico", type: "Labor", responsible: { name: "A. Gómez", initials: "AG", color: "#6c5ce7" }, priority: "LOW", linkedTo: "SHP-112", dueDate: "2026-07-08", status: "COMPLETED" },
  ],
  Dock: [
    { id: "TSK-D1", title: "Preparar andén 3 para carga de FEDEX", type: "Staging", responsible: { name: "M. Rodriguez", initials: "MR", color: "#1466c0" }, priority: "HIGH", linkedTo: "SHP-991", dueDate: "2026-07-07", status: "PENDING" },
    { id: "TSK-D2", title: "Limpieza profunda andén 1", type: "Maintenance", responsible: { name: "S. Lee", initials: "SL", color: "#e17055" }, priority: "LOW", linkedTo: null, dueDate: "2026-07-10", status: "PENDING" },
    { id: "TSK-D3", title: "Inspeccionar rampa hidráulica", type: "Inspection", responsible: { name: "J. Smith", initials: "JS", color: "#00b894" }, priority: "NORMAL", linkedTo: "EQ-RMP1", dueDate: "2026-07-06", status: "IN_PROGRESS" },
  ],
  Ecommerce: [
    { id: "TSK-E1", title: "Reposición stock SKU-411-2B", type: "Replenishment", responsible: { name: "M. Rodriguez", initials: "MR", color: "#1466c0" }, priority: "HIGH", linkedTo: "REP-411", dueDate: "2026-07-06", status: "PENDING" },
    { id: "TSK-E2", title: "Validar sincronización Amazon", type: "Integration", responsible: { name: "L. Chen", initials: "LC", color: "#e17055" }, priority: "URGENT", linkedTo: null, dueDate: "2026-07-05", status: "BLOCKED" },
    { id: "TSK-E3", title: "Pickear ola de pedidos Prime", type: "Picking", responsible: { name: "A. Gómez", initials: "AG", color: "#6c5ce7" }, priority: "HIGH", linkedTo: "WAV-991", dueDate: "2026-07-06", status: "IN_PROGRESS" },
    { id: "TSK-E4", title: "Auditar zona de accesorios", type: "Audit", responsible: { name: "J. Smith", initials: "JS", color: "#00b894" }, priority: "NORMAL", linkedTo: null, dueDate: "2026-07-08", status: "PENDING" },
    { id: "TSK-E5", title: "Consolidar cajas pequeñas", type: "Sorting", responsible: { name: "S. Lee", initials: "SL", color: "#00b894" }, priority: "LOW", linkedTo: null, dueDate: "2026-07-10", status: "COMPLETED" },
  ],
  Pallets: [
    { id: "TSK-P1", title: "Reacomodo de pallets vacíos", type: "Maintenance", responsible: { name: "A. Gómez", initials: "AG", color: "#6c5ce7" }, priority: "LOW", linkedTo: null, dueDate: "2026-07-12", status: "PENDING" },
    { id: "TSK-P2", title: "Bajar pallets de nivel 4", type: "Labor", responsible: { name: "J. Smith", initials: "JS", color: "#00b894" }, priority: "NORMAL", linkedTo: "MV-881", dueDate: "2026-07-06", status: "IN_PROGRESS" },
  ],
  Packing: [
    { id: "TSK-PK1", title: "Solicitar más cajas de cartón M", type: "Supply", responsible: { name: "M. Rodriguez", initials: "MR", color: "#1466c0" }, priority: "HIGH", linkedTo: null, dueDate: "2026-07-06", status: "PENDING" },
    { id: "TSK-PK2", title: "Empacar pedidos internacionales", type: "Packing", responsible: { name: "L. Chen", initials: "LC", color: "#e17055" }, priority: "URGENT", linkedTo: "WAV-992", dueDate: "2026-07-05", status: "IN_PROGRESS" },
    { id: "TSK-PK3", title: "Calibrar báscula estación 2", type: "Maintenance", responsible: { name: "J. Smith", initials: "JS", color: "#00b894" }, priority: "NORMAL", linkedTo: "EQ-SCL2", dueDate: "2026-07-07", status: "PENDING" },
  ],
  Returns: [
    { id: "TSK-RT1", title: "Inspección devolución ORD-2024-1280", type: "Inspection", responsible: { name: "M. Rodriguez", initials: "MR", color: "#1466c0" }, priority: "HIGH", linkedTo: "RTN-1280", dueDate: "2026-07-06", status: "PENDING" },
    { id: "TSK-RT2", title: "Clasificar artículos defectuosos", type: "Sorting", responsible: { name: "A. Gómez", initials: "AG", color: "#6c5ce7" }, priority: "NORMAL", linkedTo: null, dueDate: "2026-07-08", status: "IN_PROGRESS" },
  ],
  "Blocked Stock": [
    { id: "TSK-B1", title: "Liberar lote cuarentena L-992", type: "Quality", responsible: { name: "L. Chen", initials: "LC", color: "#e17055" }, priority: "URGENT", linkedTo: "LOT-992", dueDate: "2026-07-05", status: "PENDING" },
  ],
  General: [
    { id: "TSK-G1", title: "Auditoría mensual de seguridad", type: "Audit", responsible: { name: "J. Smith", initials: "JS", color: "#00b894" }, priority: "HIGH", linkedTo: null, dueDate: "2026-07-06", status: "IN_PROGRESS" },
    { id: "TSK-G2", title: "Actualizar mapa de almacén", type: "Admin", responsible: { name: "M. Rodriguez", initials: "MR", color: "#1466c0" }, priority: "NORMAL", linkedTo: null, dueDate: "2026-07-15", status: "PENDING" },
    { id: "TSK-G3", title: "Capacitación uso de montacargas", type: "HR", responsible: { name: "S. Lee", initials: "SL", color: "#6c5ce7" }, priority: "LOW", linkedTo: null, dueDate: "2026-07-20", status: "PENDING" },
  ]
};

const priorityBorderColors = {
  URGENT: "border-l-red-500",
  HIGH: "border-l-orange-500",
  NORMAL: "border-l-yellow-400",
  LOW: "border-l-gray-400",
};

const statusColors: Record<string, string> = {
  PENDING: "text-gray-700 bg-gray-100",
  IN_PROGRESS: "text-blue-700 bg-blue-100",
  BLOCKED: "text-red-700 bg-red-100",
  COMPLETED: "text-green-700 bg-green-100",
};

export default function TasksByZonePage() {
  const { t } = useLanguageStore();
  const [activeZone, setActiveZone] = useState(zones[0].id);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const isOverdue = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-6 flex flex-col h-screen overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-[22px] font-bold text-text-heading tracking-tight">Tasks by Zone</h1>
        <p className="text-[13px] text-text-muted mt-0.5">View and manage tasks organized by warehouse area.</p>
      </div>

      <div className="bg-dash-card border border-dash-card-border rounded-xl shadow-sm flex flex-col h-full min-h-0">
        {/* Tabs */}
        <div className="flex border-b border-dash-divider overflow-x-auto shrink-0 hide-scrollbar">
          {zones.map(zone => (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`flex items-center gap-2 px-5 py-3 text-[14px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeZone === zone.id
                  ? "border-brand text-brand bg-brand/5"
                  : "border-transparent text-text-muted hover:text-text-body hover:bg-dash-row-hover"
              }`}
            >
              {zone.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeZone === zone.id ? "bg-brand text-white" : "bg-gray-200 text-text-dim"}`}>
                {zone.count}
              </span>
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div className="px-5 py-4 border-b border-dash-divider flex justify-end shrink-0">
          <button className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Task in {zones.find(z => z.id === activeZone)?.label}
          </button>
        </div>

        {/* Task Cards List */}
        <div className="p-5 overflow-y-auto flex-1 min-h-0 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(mockZoneTasks[activeZone] || []).map(task => (
              <div key={task.id} className={`bg-white border border-dash-card-border rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col border-l-4 ${priorityBorderColors[task.priority]}`}>
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[14px] font-bold text-text-heading leading-snug">{task.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[task.status] || "bg-gray-100 text-gray-700"}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-[12px] text-text-dim mb-4">{task.type}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-inner" style={{ backgroundColor: task.responsible.color }}>
                        {task.responsible.initials}
                      </div>
                      <span className="text-[12px] font-medium text-text-body">{task.responsible.name}</span>
                    </div>
                    {task.linkedTo && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand/10 text-brand border border-brand/20">
                        {task.linkedTo}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-dash-divider">
                    <span className={`material-symbols-outlined text-[16px] ${isOverdue(task.dueDate) ? "text-status-error" : "text-text-muted"}`}>schedule</span>
                    <span className={`text-[12px] font-semibold ${isOverdue(task.dueDate) ? "text-status-error" : "text-text-dim"}`}>
                      {task.dueDate}
                    </span>
                  </div>
                </div>
                <div className="border-t border-dash-divider bg-gray-50 p-2 flex justify-end rounded-b-xl">
                  <button onClick={() => setSelectedTask(task as any)} className="px-4 py-1.5 rounded-md text-[12px] font-semibold text-brand hover:bg-brand/10 transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          {(mockZoneTasks[activeZone] || []).length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-text-muted py-12">
              <span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">task</span>
              <p>No tasks for this zone</p>
            </div>
          )}
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
