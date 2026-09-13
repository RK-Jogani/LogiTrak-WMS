"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "../../../store/languageStore";
import { useAuth } from "../../../store/AuthContext";

interface SideNavBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideNavBar({ isOpen, onClose }: SideNavBarProps) {
  const pathname = usePathname();
  const { t } = useLanguageStore();
  const { user, logout } = useAuth();
  const [expandedTasks, setExpandedTasks] = useState(false);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState("Warehouse Alpha");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedWarehouse = localStorage.getItem("selectedWarehouse");
    if (savedWarehouse) {
      setSelectedWarehouse(savedWarehouse);
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWarehouseDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleWarehouseSelect = (warehouse: string) => {
    setSelectedWarehouse(warehouse);
    localStorage.setItem("selectedWarehouse", warehouse);
    setShowWarehouseDropdown(false);
  };

  const navItems = [
    { name: t("dashboard"), icon: "dashboard", href: "/dashboard", group: "core" },
    { name: t("inventory"), icon: "inventory_2", href: "/inventory", group: "core" },
    { name: t("orders"), icon: "shopping_cart", href: "/orders", group: "core" },

    { name: t("receiving"), icon: "inbox", href: "/receiving", group: "operations" },
    { name: t("picking"), icon: "pan_tool", href: "/picking", group: "operations" },
    { name: t("packing"), icon: "box", href: "/packing", group: "operations" },
    { name: t("shipping"), icon: "local_shipping", href: "/shipping", group: "operations" },

    { name: t("crm"), icon: "group", href: "/crm", group: "core" },
    { name: t("returns"), icon: "keyboard_return", href: "/returns", group: "core" },
    { name: t("ecommerce"), icon: "store", href: "/ecommerce", group: "core" },

    { name: t("billing"), icon: "receipt", href: "/billing", group: "finance" },
    { name: t("accounting"), icon: "payments", href: "/accounting", group: "finance" },

    { name: t("reports"), icon: "bar_chart", href: "/reports", group: "core" },
    { name: t("activityLogs"), icon: "history", href: "/activity-logs", group: "core" },
    { name: t("warehouses"), icon: "warehouse", href: "/warehouses", group: "core" },
    { 
      name: t("tasks"), 
      icon: "task_alt", 
      href: "/tasks", 
      group: "core",
      subItems: [
        { name: t("taskBoard"), href: "/tasks/board" },
        { name: t("myTasks"), href: "/tasks/my-tasks" },
        { name: t("taskCalendar"), href: "/tasks/calendar" },
        { name: t("taskDashboard"), href: "/tasks/dashboard" }
      ]
    },
    { name: t("saasAdmin"), icon: "admin_panel_settings", href: "/saas-admin", group: "core" },
  ];

  const navContent = (
    <nav
      className="flex flex-col h-full w-64 shrink-0 z-40 transition-all duration-200 ease-in-out"
      style={{ backgroundColor: "#091426" }}
    >
      {/* ── Logo / Brand ── */}
      <div
        className="flex items-center gap-3 px-5 py-5 border-b"
        style={{ borderColor: "rgba(188,199,222,0.12)" }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
          style={{ backgroundColor: "#1466c0" }}
        >
          <span className="material-symbols-outlined text-white" style={{ fontSize: 20 }}>
            local_shipping
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white truncate leading-tight" style={{ fontSize: 15 }}>
            LogiTrack
          </p>
          <p className="truncate leading-tight" style={{ fontSize: 11, color: "#8590a6" }}>
            WMS Platform
          </p>
        </div>
        {/* Close btn — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors"
          style={{ color: "#545f73" }}
          onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor =
            "rgba(188,199,222,0.1)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
          }
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            close
          </span>
        </button>
      </div>

      {/* ── Warehouse badge ── */}
      <div
        className="px-4 py-3 border-b relative"
        style={{ borderColor: "rgba(188,199,222,0.08)" }}
        ref={dropdownRef}
      >
        <div
          onClick={() => setShowWarehouseDropdown(!showWarehouseDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
          style={{ backgroundColor: "rgba(20,102,192,0.15)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#1466c0" }}>
            warehouse
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-white truncate" style={{ fontSize: 12 }}>
              {selectedWarehouse}
            </p>
            <p className="truncate" style={{ fontSize: 11, color: "#8590a6" }}>
              Zone 4 Operations
            </p>
          </div>
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: 16, color: "#8590a6" }}>
            expand_more
          </span>
        </div>
        
        {showWarehouseDropdown && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
            {["Warehouse Alpha", "Warehouse Beta", "Warehouse Gamma", "Warehouse Delta"].map(wh => (
              <div 
                key={wh}
                onClick={() => handleWarehouseSelect(wh)}
                className={`px-4 py-2 text-[12px] font-medium cursor-pointer hover:bg-gray-50 transition-colors ${selectedWarehouse === wh ? "text-brand bg-brand/5" : "text-gray-700"}`}
              >
                {wh}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section label ── */}
      <div className="px-5 pt-5 pb-2">
        <p
          className="font-semibold tracking-widest uppercase"
          style={{ fontSize: 10, color: "#545f73" }}
        >
          {t("mainMenu")}
        </p>
      </div>

      {/* ── Nav links ── */}
      <ul className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map((item, idx) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          const isTasksActive = item.href === "/tasks" && pathname?.startsWith("/tasks");

          // Show group label
          const prevItem = idx > 0 ? navItems[idx - 1] : null;
          const showGroupLabel = !prevItem || prevItem.group !== item.group;

          const groupLabels: Record<string, string> = {
            operations: t("operations"),
            finance: t("finance"),
          };

          return (
            <div key={item.href}>
              {showGroupLabel && item.group && item.group !== "core" && (
                <div className="px-3 pt-3 pb-1.5 mt-1">
                  <p
                    className="font-semibold tracking-widest uppercase"
                    style={{ fontSize: 10, color: "#545f73" }}
                  >
                    {groupLabels[item.group] || item.group}
                  </p>
                </div>
              )}
              <li>
                {item.subItems ? (
                  <div
                    onClick={() => setExpandedTasks(!expandedTasks)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ease-in-out relative cursor-pointer"
                    style={
                      isTasksActive
                        ? { backgroundColor: "#25A194", color: "#ffffff" }
                        : { color: "#bcc7de" }
                    }
                    onMouseEnter={(e) => {
                      if (!isTasksActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "rgba(188,199,222,0.08)";
                        (e.currentTarget as HTMLElement).style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isTasksActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#bcc7de";
                      }
                    }}
                  >
                    <span
                      className="material-symbols-outlined shrink-0 transition-colors"
                      style={{
                        fontSize: 20,
                        color: isTasksActive ? "#ffffff" : "#545f73",
                        fontVariationSettings: isTasksActive ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium truncate flex-1" style={{ fontSize: 13 }}>
                      {item.name}
                    </span>
                    <span
                      className="material-symbols-outlined shrink-0 transition-transform duration-200"
                      style={{
                        fontSize: 18,
                        transform: expandedTasks ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      expand_more
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ease-in-out relative"
                    style={
                      isActive
                        ? { backgroundColor: "#25A194", color: "#ffffff" }
                        : { color: "#bcc7de" }
                    }
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "rgba(188,199,222,0.08)";
                        (e.currentTarget as HTMLElement).style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#bcc7de";
                      }
                    }}
                  >
                    <span
                      className="material-symbols-outlined shrink-0 transition-colors"
                      style={{
                        fontSize: 20,
                        color: isActive ? "#ffffff" : "#545f73",
                        fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium truncate" style={{ fontSize: 13 }}>
                      {item.name}
                    </span>
                    {isActive && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: "rgba(216,227,251,0.6)" }}
                      />
                    )}
                  </Link>
                )}
                
                {/* Sub items dropdown */}
                {item.subItems && (
                  <div
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${
                      expandedTasks || isTasksActive ? "max-h-48 opacity-100 mt-1" : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="space-y-0.5 ml-8 border-l border-[rgba(188,199,222,0.12)] pl-2">
                      {item.subItems.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={onClose}
                              className="block px-3 py-2 rounded-lg transition-colors"
                              style={{
                                color: isSubActive ? "#ffffff" : "#8590a6",
                                backgroundColor: isSubActive ? "rgba(188,199,222,0.08)" : "transparent",
                                fontSize: 12,
                                fontWeight: isSubActive ? 500 : 400
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubActive) {
                                  (e.currentTarget as HTMLElement).style.color = "#bcc7de";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive) {
                                  (e.currentTarget as HTMLElement).style.color = "#8590a6";
                                }
                              }}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            </div>
          );
        })}
      </ul>

      {/* ── Footer ── */}
      <div
        className="px-3 pb-4 pt-3 border-t space-y-0.5"
        style={{ borderColor: "rgba(188,199,222,0.12)" }}
      >
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ease-in-out"
          style={{ color: "#8590a6" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(188,199,222,0.08)";
            (e.currentTarget as HTMLElement).style.color = "#bcc7de";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#8590a6";
          }}
        >
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20, color: "#545f73" }}>
            settings
          </span>
          <span className="font-medium" style={{ fontSize: 13 }}>{t("settings")}</span>
        </Link>


        <button
          onClick={logout}
          className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg transition-all duration-150 ease-in-out w-full text-left"
          style={{ color: "#8590a6" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(220,38,38,0.12)";
            (e.currentTarget as HTMLElement).style.color = "#f09595";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#8590a6";
          }}
        >
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20, color: "#545f73" }}>
            logout
          </span>
          <span className="font-medium" style={{ fontSize: 13 }}>{t("logout")}</span>
        </button>

        {/* User row */}
        <Link href="/profile">
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1"
            style={{ backgroundColor: "rgba(188,199,222,0.06)" }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-semibold text-white"
              style={{ backgroundColor: "#1466c0", fontSize: 13 }}
            >
              MR
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white truncate" style={{ fontSize: 12 }}>
                {user ? user.name : t("userName")}
              </p>
              <p className="truncate" style={{ fontSize: 11, color: "#8590a6" }}>
                {user ? user.role : t("userRole")}
              </p>
            </div>
            <span
              className="material-symbols-outlined shrink-0 cursor-pointer"
              style={{ fontSize: 16, color: "#545f73" }}
            >
              more_vert
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );

  return (
    <>
      {/* ── Desktop: always visible ── */}
      <div className="hidden lg:flex h-full">
        {navContent}
      </div>

      {/* ── Mobile: slide-in drawer + backdrop ── */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={onClose}
          />
          {/* Drawer */}
          <div className="relative z-10 h-full panel-enter">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}