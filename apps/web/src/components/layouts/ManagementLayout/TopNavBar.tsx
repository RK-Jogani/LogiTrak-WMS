"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "../../../store/languageStore";
import { LanguageSelector } from "./LanguageSelector";

interface TopNavBarProps {
  onMenuToggle: () => void;
}

const MOCK_NOTIFICATIONS = [
  { id: 1, message: "New high priority task assigned to you", type: "task", timestamp: "5 min ago", read: false },
  { id: 2, message: "Stock for SKU-780-4D is below minimum", type: "inventory", timestamp: "1 hour ago", read: false },
  { id: 3, message: "Order ORD-99238 has been shipped", type: "order", timestamp: "2 hours ago", read: false },
  { id: 4, message: "Return RMA-4421 needs inspection", type: "return", timestamp: "3 hours ago", read: false },
  { id: 5, message: "Shipment SHP-1002 delayed by carrier", type: "shipment", timestamp: "Yesterday", read: false },
  { id: 6, message: "New inventory audit created for Zone A", type: "task", timestamp: "Yesterday", read: true },
  { id: 7, message: "Invoice INV-2024-081 paid", type: "order", timestamp: "2 days ago", read: true },
];

export function TopNavBar({ onMenuToggle }: TopNavBarProps) {
  const router = useRouter();
  const { t } = useLanguageStore();
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header
      className="w-full flex items-center justify-between px-4 lg:px-6 h-16 shrink-0 z-10 transition-colors duration-200 border-b"
      style={{
        backgroundColor: "#091426",
        borderColor: "rgba(188,199,222,0.12)",
      }}
    >
      {/* ── Left: Hamburger (mobile) + Search ── */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
          style={{ color: "#bcc7de" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(188,199,222,0.1)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent")
          }
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            menu
          </span>
        </button>

        {/* Logo — mobile only (hidden on desktop since sidebar shows it) */}
        <div className="flex lg:hidden items-center gap-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
            style={{ backgroundColor: "#1466c0" }}
          >
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: 16 }}
            >
              local_shipping
            </span>
          </div>
          <span className="font-semibold text-white" style={{ fontSize: 14 }}>
            LogiTrack
          </span>
        </div>

        {/* Search — hidden on mobile, visible on md+ */}
        <div
          className="hidden md:flex items-center gap-2 h-8 px-3 rounded-lg transition-all duration-150"
          style={{
            backgroundColor: searchFocused
              ? "rgba(255,255,255,0.1)"
              : "rgba(188,199,222,0.08)",
            border: searchFocused
              ? "1px solid rgba(20,102,192,0.6)"
              : "1px solid rgba(188,199,222,0.12)",
            width: searchFocused ? 280 : 280,
          }}
        >
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontSize: 16, color: "#545f73" }}
          >
            search
          </span>
          <input
            type="text"
            placeholder={t("searchPlaceholder") ?? "Search orders, SKU…"}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent border-none outline-none flex-1 font-body-md text-body-md placeholder-outline-variant transition-all"
            style={{ fontSize: 13, color: "#bcc7de" }}
          />
        </div>
      </div>


      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-1 lg:gap-2">
        {/* Mobile search icon */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
          style={{ color: "#8590a6" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(188,199,222,0.08)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent")
          }
          aria-label="Search"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            search
          </span>
        </button>

        {/* Language selector */}
        <LanguageSelector />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer text-[#8590a6] transition-colors"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "rgba(188,199,222,0.08)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "transparent")
            }
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
              notifications
            </span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full border border-[#091426] bg-[#DC2626] text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-xs text-brand hover:text-brand-dark font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors ${notif.read ? 'opacity-70' : 'bg-brand/5'}`}
                    >
                      <div className="mt-1 flex-shrink-0">
                        {notif.type === 'task' && <span className="material-symbols-outlined text-blue-500 text-lg">task_alt</span>}
                        {notif.type === 'inventory' && <span className="material-symbols-outlined text-orange-500 text-lg">inventory_2</span>}
                        {notif.type === 'order' && <span className="material-symbols-outlined text-green-500 text-lg">shopping_cart</span>}
                        {notif.type === 'return' && <span className="material-symbols-outlined text-red-500 text-lg">keyboard_return</span>}
                        {notif.type === 'shipment' && <span className="material-symbols-outlined text-purple-500 text-lg">local_shipping</span>}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{notif.timestamp}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button
          onClick={() => alert("Help center coming soon!")}
          className="hidden lg:flex items-center justify-center w-8 h-8 text-[#8590a6] cursor-pointer rounded-lg transition-colors"
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(188,199,222,0.08)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent")
          }
          aria-label="Help"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            help_outline
          </span>
        </button>

        {/* Divider */}
        <div
          className="hidden lg:block w-px h-5 mx-1"
          style={{ backgroundColor: "rgba(188,199,222,0.15)" }}
        />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-[#bcc7de] transition-all duration-150"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "rgba(188,199,222,0.08)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "transparent")
            }
            aria-label="Profile"
          >
            <div className="hidden lg:block text-left">
              <p
                className="font-medium text-white leading-tight"
                style={{ fontSize: 12 }}
              >
                M. Rodriguez
              </p>
              <p
                className="leading-tight"
                style={{ fontSize: 10, color: "#8590a6" }}
              >
                Super Admin
              </p>
            </div>
            <span
              className="hidden lg:inline material-symbols-outlined"
              style={{ fontSize: 20, color: "#545f73" }}
            >
              keyboard_arrow_down
            </span>
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl shadow-[0_10px_40px_rgba(9,20,38,0.25)] overflow-hidden z-50"
              style={{
                backgroundColor: "#f8f9ff",
                border: "1px solid #e8edf5",
              }}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              {/* User Info Header */}
              <div className="px-4 py-4 border-b" style={{ borderColor: "#e8edf5" }}>
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full text-white flex-shrink-0 font-semibold"
                    style={{ backgroundColor: "#25A194" }}
                  >
                    MR
                  </div>
                  <div>
                    <p
                      className="font-semibold leading-tight"
                      style={{ fontSize: 13, color: "#0b1c30" }}
                    >
                      M. Rodriguez
                    </p>
                    <p
                      className="leading-tight"
                      style={{ fontSize: 11, color: "#6b7280" }}
                    >
                      Super Admin
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ backgroundColor: "#f8f9ff" }}>
                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-[13px] text-[#374151] hover:bg-[#fafbfd] transition-colors border-b"
                  style={{ borderColor: "#f0f3f8" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18, color: "#25A194" }}
                  >
                    person
                  </span>
                  My Profile
                </Link>


                <button
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-[#dc2626] hover:bg-[#fafbfd] transition-colors"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18 }}
                  >
                    logout
                  </span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
