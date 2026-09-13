"use client";

import { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

type ReportCategory = "OVERVIEW" | "INVENTORY" | "WAREHOUSE" | "ORDERS" | "ECOMMERCE" | "LOGISTICS" | "SHIPMENTS" | "RETURNS" | "TASKS" | "CUSTOMERS" | "FINANCIAL" | "OPERATIONAL";

interface ReportStats {
  label: string;
  value: string;
  change: string;
  icon: string;
  iconCls: string;
}

export default function ReportsPage() {
  const { t } = useLanguageStore();
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>("OVERVIEW");
  const [dateRange, setDateRange] = useState("THIS_MONTH");

  const reportCategories: { id: ReportCategory; label: string; icon: string }[] = [
    { id: "OVERVIEW",    label: "Overview",       icon: "dashboard"          },
    { id: "INVENTORY",   label: "Inventory",      icon: "inventory_2"        },
    { id: "WAREHOUSE",   label: "Warehouse Ops",  icon: "warehouse"          },
    { id: "ORDERS",      label: "Orders",         icon: "shopping_cart"      },
    { id: "ECOMMERCE",   label: "Ecommerce",      icon: "store"              },
    { id: "LOGISTICS",   label: "Logistics",      icon: "local_shipping"     },
    { id: "SHIPMENTS",   label: "Shipments",      icon: "directions_bus"     },
    { id: "RETURNS",     label: "Returns",        icon: "keyboard_return"    },
    { id: "TASKS",       label: "Tasks",          icon: "task"               },
    { id: "CUSTOMERS",   label: "CRM",            icon: "group"              },
    { id: "FINANCIAL",   label: "Financial",      icon: "payments"           },
    { id: "OPERATIONAL", label: "System Health",  icon: "health_and_safety"  },
  ];

  // Helper to generate dynamic mock data for Recharts
  const generateChartData = (category: ReportCategory) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(day => ({
      name: day,
      Primary: Math.floor(Math.random() * 500) + 100,
      Secondary: Math.floor(Math.random() * 300) + 50,
    }));
  };

  const generatePieData = () => {
    return [
      { name: 'Group A', value: 400 },
      { name: 'Group B', value: 300 },
      { name: 'Group C', value: 300 },
      { name: 'Group D', value: 200 },
    ];
  };

  const COLORS = ['#00b894', '#1466c0', '#D97706', '#E53238'];

  // Helper to generate dynamic mock table rows
  const generateTableData = (category: ReportCategory) => {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `REF-${Math.floor(Math.random() * 10000)}`,
      date: `2026-07-0${i + 1}`,
      metric1: Math.floor(Math.random() * 1000),
      metric2: ["Pending", "Completed", "In Progress", "Failed"][Math.floor(Math.random() * 4)],
      metric3: `$${(Math.random() * 500).toFixed(2)}`
    }));
  };

  // Helper to generate dynamic KPIs
  const generateKPIs = (category: ReportCategory): ReportStats[] => {
    const prefixes = ["Total", "Avg.", "Max", "Min"];
    const baseIcons = [
      { i: "monitoring", c: "text-brand bg-brand-light" },
      { i: "trending_up", c: "text-status-success bg-green-50" },
      { i: "warning", c: "text-status-warning bg-amber-50" },
      { i: "timeline", c: "text-purple-600 bg-purple-50" },
    ];
    
    return Array.from({ length: 4 }).map((_, i) => ({
      label: `${prefixes[i]} ${category} Metric`,
      value: (Math.random() * 10000).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 15).toFixed(1)}%`,
      icon: baseIcons[i].i,
      iconCls: baseIcons[i].c
    }));
  };

  const renderReportContent = () => {
    const kpis = generateKPIs(selectedCategory);
    const chartData = generateChartData(selectedCategory);
    const pieData = generatePieData();
    const tableData = generateTableData(selectedCategory);
    
    return (
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <h2 className="text-[18px] font-bold text-text-heading">
            {reportCategories.find(c => c.id === selectedCategory)?.label} Report
          </h2>
          <div className="flex items-center gap-2">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="h-9 px-3 rounded-lg border border-dash-card-border bg-white text-[13px] font-medium text-text-body focus:border-brand outline-none cursor-pointer">
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="THIS_QUARTER">This Quarter</option>
              <option value="THIS_YEAR">This Year</option>
              <option value="CUSTOM">Custom Range...</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-dash-card-border bg-white text-[13px] font-medium text-text-body hover:border-brand hover:text-brand transition-colors">
              <span className="material-symbols-outlined text-[18px]">calendar_clock</span>
              Scheduled Reports
            </button>
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((stat, idx) => (
            <div key={idx} className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)] hover:border-brand/30 transition-all duration-200">
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">{stat.label}</p>
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${stat.iconCls}`}>
                  <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                </div>
              </div>
              <p className="text-[28px] font-bold text-text-heading leading-none">{stat.value}</p>
              <span className={`text-[12px] font-semibold ${stat.change.startsWith('+') ? 'text-status-success' : 'text-status-error'}`}>
                {stat.change.startsWith('+') ? '↑' : '↓'} {stat.change}
              </span>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-dash-card border border-dash-card-border rounded-xl p-5 shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
            <h3 className="text-[14px] font-semibold text-text-heading mb-4">Volume Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00b894" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00b894" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="Primary" stroke="#00b894" strokeWidth={3} fillOpacity={1} fill="url(#colorPrimary)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-5 shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
            <h3 className="text-[14px] font-semibold text-text-heading mb-4">Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-dash-card border border-dash-card-border rounded-xl shadow-sm overflow-hidden mt-4">
          <div className="p-4 border-b border-dash-divider flex justify-between items-center bg-dash-header-bg">
            <h3 className="text-[14px] font-bold text-text-heading">Detailed Data</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1.5 text-[18px] text-text-muted">search</span>
              <input type="text" placeholder="Search..." className="h-8 pl-9 pr-3 rounded border border-dash-card-border bg-white text-[12px] focus:outline-none focus:border-brand w-64" />
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-dash-divider">
              <tr>
                <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase">Reference ID</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase">Date</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase">Metric 1</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase">Status</th>
                <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx} className="border-b border-dash-divider hover:bg-dash-row-hover bg-white">
                  <td className="px-5 py-3"><span className="text-[13px] font-mono font-bold text-brand">{row.id}</span></td>
                  <td className="px-5 py-3 text-[13px] text-text-body">{row.date}</td>
                  <td className="px-5 py-3 text-[13px] text-text-body">{row.metric1}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      row.metric2 === 'Completed' ? 'bg-green-100 text-status-success' :
                      row.metric2 === 'Pending' ? 'bg-gray-100 text-gray-600' :
                      row.metric2 === 'Failed' ? 'bg-red-100 text-status-error' :
                      'bg-blue-100 text-brand'
                    }`}>
                      {row.metric2}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[13px] font-mono text-text-heading text-right">{row.metric3}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-5 py-3 bg-white">
            <span className="text-[12px] text-text-dim">Showing 1 to 5 of 24 entries</span>
            <div className="flex gap-1">
              <button disabled className="px-3 py-1 rounded border border-dash-card-border text-[12px] text-text-dim opacity-50">Previous</button>
              <button className="px-3 py-1 rounded border border-dash-card-border text-[12px] bg-brand text-white">1</button>
              <button className="px-3 py-1 rounded border border-dash-card-border text-[12px] text-text-body hover:bg-gray-50">2</button>
              <button className="px-3 py-1 rounded border border-dash-card-border text-[12px] text-text-body hover:bg-gray-50">3</button>
              <button className="px-3 py-1 rounded border border-dash-card-border text-[12px] text-text-body hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">{t("reports") || "Reports & Analytics"}</h1>
          <p className="text-[13px] text-text-muted mt-0.5">Comprehensive insights across all warehouse operations.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sub-Nav Panel */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-2 shadow-sm sticky top-6">
            <div className="space-y-1">
              {reportCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-brand/10 text-brand"
                      : "text-text-body hover:bg-dash-row-hover hover:text-text-heading"
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${selectedCategory === cat.id ? "text-brand" : "text-text-muted"}`}>
                    {cat.icon}
                  </span>
                  <span className="text-[13px] font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 min-w-0">
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
}
