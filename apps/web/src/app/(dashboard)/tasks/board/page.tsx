"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { TaskDetailDrawer } from "@/components/tasks/TaskDetailDrawer";
import { useToast } from "@/store/ToastContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: { name: string; initials: string; color: string };
  type: string;
}

const initialTasks: Task[] = [
  {
    id: "TASK-1029",
    title: "Verify incoming shipment pallets",
    description: "Check the seal on container #8849 and count pallets.",
    status: "PENDING",
    priority: "HIGH",
    dueDate: "2026-07-07",
    assignee: { name: "M. Rodriguez", initials: "MR", color: "#1466c0" },
    type: "Receiving",
  },
  {
    id: "TASK-1030",
    title: "Cycle count Zone A",
    description: "Perform daily cycle count for electronics aisle.",
    status: "IN_PROGRESS",
    priority: "NORMAL",
    dueDate: "2026-07-06",
    assignee: { name: "J. Smith", initials: "JS", color: "#00b894" },
    type: "Inventory",
  },
  {
    id: "TASK-1031",
    title: "Forklift maintenance",
    description: "Forklift #3 has hydraulic leak, needs repair.",
    status: "BLOCKED",
    priority: "URGENT",
    dueDate: "2026-07-05",
    assignee: { name: "L. Chen", initials: "LC", color: "#e17055" },
    type: "Incident",
  },
  {
    id: "TASK-1032",
    title: "Process return #RT-992",
    description: "Inspect customer return for damage.",
    status: "IN_REVIEW",
    priority: "HIGH",
    dueDate: "2026-07-06",
    assignee: { name: "M. Rodriguez", initials: "MR", color: "#1466c0" },
    type: "Returns",
  },
  {
    id: "TASK-1033",
    title: "Restock packing materials",
    description: "Bring 10 boxes of tape to Station 2.",
    status: "COMPLETED",
    priority: "LOW",
    dueDate: "2026-07-05",
    assignee: { name: "System", initials: "SY", color: "#718096" },
    type: "Packing",
  },
];

const COLUMNS = [
  { id: "PENDING", label: "Pendiente" },
  { id: "IN_PROGRESS", label: "En Curso" },
  { id: "BLOCKED", label: "Bloqueada" },
  { id: "IN_REVIEW", label: "En Revisión" },
  { id: "COMPLETED", label: "Hecho" }
];

export default function TaskBoardPage() {
  const { t } = useLanguageStore();
  const { showToast } = useToast();
  const pathname = usePathname();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");

  // New Task Modal
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({ title: "", type: "Receiving", priority: "NORMAL", assigneeName: "M. Rodriguez" });

  // Need to ensure DND only mounts on client
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // We can also sort within columns if needed, but for simplicity, we just change the status
    // and push it to the end or maintain order depending on complex logic.
    // Basic logic: just update the status.
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      const taskIndex = newTasks.findIndex(t => t.id === draggableId);
      if (taskIndex > -1) {
        // Remove from old pos
        const [movedTask] = newTasks.splice(taskIndex, 1);
        movedTask.status = destination.droppableId;
        
        // Find insert position in new column
        const columnTasks = newTasks.filter(t => t.status === destination.droppableId);
        // Insert it at destination.index relative to columnTasks
        // This is a naive insertion that puts it at the end for simplicity in this mock
        newTasks.push(movedTask);
      }
      return newTasks;
    });
    showToast("Task status updated", "success");
  };

  const handleCreateTask = () => {
    if (!newTaskForm.title) return;
    const assignees: Record<string, any> = {
      "M. Rodriguez": { name: "M. Rodriguez", initials: "MR", color: "#1466c0" },
      "J. Smith": { name: "J. Smith", initials: "JS", color: "#00b894" },
      "L. Chen": { name: "L. Chen", initials: "LC", color: "#e17055" },
    };
    const newTask: Task = {
      id: `TASK-${1034 + tasks.length}`,
      title: newTaskForm.title,
      description: "",
      status: "PENDING",
      priority: newTaskForm.priority,
      dueDate: new Date().toISOString().split('T')[0],
      assignee: assignees[newTaskForm.assigneeName],
      type: newTaskForm.type,
    };
    setTasks(prev => [...prev, newTask]);
    setIsNewTaskModalOpen(false);
    setNewTaskForm({ title: "", type: "Receiving", priority: "NORMAL", assigneeName: "M. Rodriguez" });
    showToast("Task created successfully", "success");
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (searchKeyword) {
      const q = searchKeyword.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    if (filterAssignee) {
      result = result.filter(t => t.assignee.name === filterAssignee);
    }
    return result;
  }, [tasks, searchKeyword, filterAssignee]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-700";
      case "HIGH": return "bg-orange-100 text-orange-700";
      case "NORMAL": return "bg-yellow-100 text-yellow-700";
      case "LOW": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fb] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("taskBoard")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("taskBoardSubtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Filter
          </button>
          
          <div className="flex bg-dash-card border border-dash-card-border rounded-lg p-1 bg-white">
            <Link href="/tasks/board" className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${pathname === "/tasks/board" ? "bg-brand/10 text-brand" : "text-text-muted hover:text-text-body"}`}>
              {t("board")}
            </Link>
            <Link href="/tasks/list" className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${pathname === "/tasks/list" ? "bg-brand/10 text-brand" : "text-text-muted hover:text-text-body"}`}>
              {t("list")}
            </Link>
          </div>

          <button 
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00b894] text-white rounded-md font-medium hover:bg-[#00a383] transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            {t("newTask")}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {isFilterOpen && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 shrink-0 flex gap-4 overflow-x-auto">
          <div className="relative shrink-0 w-48">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
            <input 
              type="text" 
              placeholder={t("keywordSearch")} 
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#00b894] focus:border-[#00b894]" 
            />
          </div>
          <select 
            value={filterAssignee}
            onChange={e => setFilterAssignee(e.target.value)}
            className="shrink-0 w-36 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#00b894]"
          >
            <option value="">{t("responsible")}</option>
            <option value="M. Rodriguez">M. Rodriguez</option>
            <option value="J. Smith">J. Smith</option>
            <option value="L. Chen">L. Chen</option>
          </select>
        </div>
      )}

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 hide-scrollbar">
        {isMounted && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full min-w-max">
              {COLUMNS.map((col) => {
                const columnTasks = filteredTasks.filter((t) => t.status === col.id);
                return (
                  <div key={col.id} className="flex flex-col w-[320px] bg-white rounded-xl shadow-sm border border-gray-200 shrink-0 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-gray-700">{col.label}</h2>
                        <span className="bg-gray-200 text-gray-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {columnTasks.length}
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-[#00b894] transition-colors"><span className="material-symbols-outlined text-[20px]">add</span></button>
                    </div>

                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 overflow-y-auto p-3 space-y-3 transition-colors duration-200 ${snapshot.isDraggingOver ? "bg-brand/5" : "bg-gray-50/30"}`}
                        >
                          {columnTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => setSelectedTask(task)}
                                  className={`bg-white rounded-lg p-4 border transition-all duration-200 ${
                                    snapshot.isDragging 
                                      ? "border-[#00b894] shadow-xl rotate-[2deg] z-50 scale-105 cursor-grabbing" 
                                      : "border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-[#00b894]/50 hover:shadow-md cursor-grab"
                                  }`}
                                  style={{...provided.draggableProps.style}}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-[11px] font-mono text-[#00b894] font-semibold">{task.id}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityColor(task.priority)}`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                  <h3 className="font-bold text-gray-800 text-[14px] leading-snug mb-1">{task.title}</h3>
                                  <p className="text-gray-500 text-[12px] line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                                  
                                  <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2" title={task.assignee.name}>
                                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-inner" style={{ backgroundColor: task.assignee.color }}>
                                        {task.assignee.initials}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400">
                                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                                      <span className="text-[11px] font-medium">{task.dueDate}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}
      </div>
      
      <TaskDetailDrawer
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsNewTaskModalOpen(false)} />
          <div className="relative w-full max-w-md bg-dash-card rounded-2xl shadow-xl border border-dash-card-border overflow-hidden bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-divider bg-dash-header-bg">
              <h3 className="text-lg font-semibold text-text-heading">Create New Task</h3>
              <button onClick={() => setIsNewTaskModalOpen(false)} className="text-text-dim hover:text-brand transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-body mb-1">Title</label>
                <input 
                  type="text" 
                  value={newTaskForm.title}
                  onChange={e => setNewTaskForm({...newTaskForm, title: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-brand"
                  placeholder="Task title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-body mb-1">Type</label>
                <select 
                  value={newTaskForm.type}
                  onChange={e => setNewTaskForm({...newTaskForm, type: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-brand"
                >
                  <option>Receiving</option>
                  <option>Inventory</option>
                  <option>Returns</option>
                  <option>Packing</option>
                  <option>Incident</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-body mb-1">Priority</label>
                  <select 
                    value={newTaskForm.priority}
                    onChange={e => setNewTaskForm({...newTaskForm, priority: e.target.value})}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-brand"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-body mb-1">Assignee</label>
                  <select 
                    value={newTaskForm.assigneeName}
                    onChange={e => setNewTaskForm({...newTaskForm, assigneeName: e.target.value})}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-brand"
                  >
                    <option value="M. Rodriguez">M. Rodriguez</option>
                    <option value="J. Smith">J. Smith</option>
                    <option value="L. Chen">L. Chen</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-dash-divider flex justify-end gap-3">
              <button 
                onClick={() => setIsNewTaskModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTask}
                className="px-4 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
