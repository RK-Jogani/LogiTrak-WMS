"use client";

import React, { useState } from "react";
import { useLanguageStore } from "../../../../store/languageStore";
import { TaskDetailDrawer } from "../../../../components/tasks/TaskDetailDrawer";

export default function TaskCalendarPage() {
  const { t } = useLanguageStore();
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const mockTasks = [
    { id: "TASK-1029", title: "Verify pallets", date: 7, priority: "HIGH" },
    { id: "TASK-1030", title: "Cycle count Zone A", date: 6, priority: "NORMAL" },
    { id: "TASK-1031", title: "Forklift repair", date: 5, priority: "URGENT" },
    { id: "TASK-1032", title: "Process return", date: 6, priority: "HIGH" },
    { id: "TASK-1033", title: "Restock boxes", date: 12, priority: "LOW" },
    { id: "TASK-1034", title: "Audit aisle 4", date: 15, priority: "NORMAL" },
    { id: "TASK-1035", title: "Shipment #554", date: 18, priority: "HIGH" },
    { id: "TASK-1036", title: "Clean up dock", date: 22, priority: "LOW" },
    { id: "TASK-1037", title: "Inventory reconcile", date: 28, priority: "URGENT" },
  ];

  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
      case "HIGH": return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200";
      case "NORMAL": return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200";
      case "LOW": return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = 31;
    const startDayOfWeek = 3; // Let's say month starts on a Wednesday (index 3)

    // Empty slots for previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-gray-50/50 border-r border-b border-gray-200 p-2"></div>);
    }

    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayTasks = mockTasks.filter(t => t.date === i);
      const isToday = i === 7;

      days.push(
        <div key={`day-${i}`} className={`min-h-[120px] border-r border-b border-gray-200 p-2 flex flex-col ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
          <div className="flex justify-end mb-1">
            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-[#00b894] text-white' : 'text-gray-500'}`}>
              {i}
            </span>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {dayTasks.map(task => (
              <div 
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`text-[10px] font-medium px-2 py-1 rounded border cursor-pointer truncate transition-colors ${getPriorityClasses(task.priority)}`}
                title={`${task.id}: ${task.title}`}
              >
                <span className="font-bold opacity-75 mr-1">[{task.priority.charAt(0)}]</span>
                {task.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Empty slots for next month
    const totalSlots = Math.ceil((daysInMonth + startDayOfWeek) / 7) * 7;
    for (let i = daysInMonth + startDayOfWeek; i < totalSlots; i++) {
      days.push(<div key={`empty-end-${i}`} className="min-h-[120px] bg-gray-50/50 border-r border-b border-gray-200 p-2"></div>);
    }

    return days;
  };

  return (
    <div className="p-6 bg-[#f4f7fb] min-h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("taskCalendar")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("calendarSubtitle")}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <h2 className="text-lg font-bold text-gray-800 min-w-[140px] text-center">July 2026</h2>
            <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#00b894] text-white rounded-md font-medium hover:bg-[#00a383] transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            {t("newTask")}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 shrink-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1">
          {renderCalendarDays()}
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
