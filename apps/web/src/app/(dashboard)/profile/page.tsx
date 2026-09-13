"use client";

import { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";

export default function ProfilePage() {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<"personal" | "security" | "preferences" | "notifications">("personal");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const calculateStrength = (pwd: string) => {
    if (pwd.length === 0) return { label: "", color: "bg-gray-200", w: "w-0" };
    if (pwd.length < 5) return { label: "Weak", color: "bg-status-error", w: "w-1/4" };
    if (pwd.length < 8) return { label: "Fair", color: "bg-status-warning", w: "w-2/4" };
    if (pwd.length < 11) return { label: "Strong", color: "bg-yellow-400", w: "w-3/4" };
    return { label: "Very Strong", color: "bg-status-success", w: "w-full" };
  };

  const strength = calculateStrength(newPassword);

  const notificationsList = [
    { name: "New Order Received", desc: "Notify when a new order drops in" },
    { name: "Order Exception Alert", desc: "Alert for blocked or canceled orders" },
    { name: "Low Stock Alert", desc: "When inventory drops below reorder point" },
    { name: "Receiving Completed", desc: "When a shipment finishes receiving" },
    { name: "Shipment Dispatched", desc: "When carrier picks up outgoing boxes" },
    { name: "Return Processed", desc: "When a return is logged into inventory" },
    { name: "Audit Reminder", desc: "Scheduled cycle counts and physical audits" },
    { name: "Task Assigned to You", desc: "When someone assigns you a task" },
    { name: "Task Overdue", desc: "When a task passes its deadline" },
    { name: "System Announcements", desc: "Updates, maintenance, new features" }
  ];

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-text-heading tracking-tight">My Profile</h1>
        <p className="text-[13px] text-text-muted mt-0.5">Manage your personal information, preferences, and account security.</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white border border-dash-card-border rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-brand text-white flex items-center justify-center text-[28px] font-bold shrink-0 shadow-inner">
            MR
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[24px] font-bold text-text-heading">M. Rodriguez</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-light text-brand tracking-wider uppercase">Super Admin</span>
            </div>
            <p className="text-[13px] text-text-dim mb-1">m.rodriguez@logitrack.com <span className="mx-2">•</span> Warehouse Alpha</p>
            <p className="text-[12px] text-text-muted">Last login: Today at 10:24 AM</p>
          </div>
        </div>
        <button className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">
          Edit Profile
        </button>
      </div>

      <div className="bg-dash-card border border-dash-card-border rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-dash-divider overflow-x-auto">
          {[
            { id: "personal", label: "Personal Info" },
            { id: "security", label: "Security" },
            { id: "preferences", label: "Preferences" },
            { id: "notifications", label: "Notifications" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-[14px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-brand text-brand bg-brand/5"
                  : "border-transparent text-text-muted hover:text-text-body hover:bg-dash-row-hover"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "personal" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">First Name</label>
                      <input type="text" defaultValue="Miguel" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Last Name</label>
                      <input type="text" defaultValue="Rodriguez" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em] flex justify-between">
                      Email Address
                      <span className="text-[10px] bg-green-100 text-status-success px-1.5 rounded-full flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">check_circle</span> Verified</span>
                    </label>
                    <input type="email" defaultValue="m.rodriguez@logitrack.com" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Phone Number</label>
                    <input type="tel" defaultValue="+1 555 000 1234" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Job Title</label>
                    <input type="text" defaultValue="Super Administrator" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Department</label>
                    <input type="text" defaultValue="Operations" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Assigned Warehouse</label>
                    <select disabled className="w-full h-9 px-3 rounded-lg border text-[13px] bg-gray-100 border-dash-card-border text-text-body cursor-not-allowed">
                      <option>Warehouse Alpha</option>
                    </select>
                    <p className="text-[11px] text-text-dim mt-1">Read-only for non-admins.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Language Preference</label>
                    <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                      <option>🇬🇧 English</option>
                      <option>🇪🇸 Español</option>
                      <option>🇫🇷 Français</option>
                      <option>🇮🇹 Italiano</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-[100px] h-[100px] rounded-full bg-brand text-white flex items-center justify-center text-[36px] font-bold shrink-0 shadow-inner">
                        MR
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-3 py-1.5 border border-dash-card-border rounded-lg text-[12px] font-semibold text-text-body hover:border-brand hover:text-brand transition-colors">Change Photo</button>
                        <button className="text-[12px] text-text-dim hover:text-status-error text-left underline decoration-transparent hover:decoration-status-error transition-all">Remove Photo</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-dash-divider">
                <button className="w-full h-10 rounded-lg text-[14px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              
              <div className="bg-dash-bg border border-dash-card-border rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-[15px] font-bold text-text-heading border-b border-dash-divider pb-3">Change Password</h3>
                <div className="max-w-md space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Current Password</label>
                    <div className="relative">
                      <input type={showCurrentPassword ? "text" : "password"} className="w-full h-9 pl-3 pr-10 rounded-lg border text-[13px] bg-white border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                      <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-2 top-1.5 text-text-muted hover:text-text-body">
                        <span className="material-symbols-outlined text-[20px]">{showCurrentPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">New Password</label>
                    <div className="relative">
                      <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full h-9 pl-3 pr-10 rounded-lg border text-[13px] bg-white border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                      <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-2 top-1.5 text-text-muted hover:text-text-body">
                        <span className="material-symbols-outlined text-[20px]">{showNewPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                    {newPassword.length > 0 && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${strength.color} ${strength.w}`}></div>
                        </div>
                        <span className={`text-[10px] font-bold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Confirm New Password</label>
                    <input type="password" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-white border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                  </div>
                  <button className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">Update Password</button>
                </div>
              </div>

              <div className="bg-dash-bg border border-dash-card-border rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-[15px] font-bold text-text-heading border-b border-dash-divider pb-3">Two-Factor Authentication</h3>
                <div className="flex items-start justify-between pt-2">
                  <div>
                    <h4 className="text-[14px] font-bold text-text-heading">Enable Two-Factor Authentication</h4>
                    <p className="text-[13px] text-text-dim mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={twoFAEnabled} onChange={(e) => setTwoFAEnabled(e.target.checked)} />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                  </label>
                </div>

                {twoFAEnabled && (
                  <div className="pt-4 mt-4 border-t border-dash-divider animate-in fade-in flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-[200px] h-[200px] bg-white border-2 border-dash-card-border rounded-lg flex flex-col items-center justify-center p-4">
                        <span className="material-symbols-outlined text-[80px] text-gray-300 mb-2">qr_code_2</span>
                        <p className="text-[11px] text-gray-400 text-center uppercase tracking-wider font-semibold">QR Code Placeholder</p>
                      </div>
                      <p className="text-[13px] text-text-dim mt-3 font-medium">Scan with your authenticator app</p>
                    </div>
                    <div className="flex-1 max-w-sm">
                      <h4 className="text-[14px] font-bold text-text-heading mb-2">Backup Codes</h4>
                      <p className="text-[12px] text-text-dim mb-4">Save these backup codes in a secure place. They can be used to log in if you lose access to your authenticator app.</p>
                      <div className="bg-white border border-dash-card-border rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-[14px] font-mono font-bold text-text-heading">
                          <span>a1b2-c3d4</span>
                          <span>e5f6-g7h8</span>
                          <span>i9j0-k1l2</span>
                          <span>m3n4-o5p6</span>
                          <span>q7r8-s9t0</span>
                          <span>u1v2-w3x4</span>
                          <span>y5z6-a7b8</span>
                          <span>c9d0-e1f2</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-white border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">Copy All Codes</button>
                        <button className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-white border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">Regenerate Codes</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-dash-bg border border-dash-card-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-dash-divider">
                  <h3 className="text-[15px] font-bold text-text-heading">Active Sessions</h3>
                </div>
                <table className="w-full text-left bg-white">
                  <thead className="bg-dash-header-bg border-b border-dash-divider">
                    <tr>
                      <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase tracking-wider">Device</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase tracking-wider">Browser</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase tracking-wider">IP Address</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase tracking-wider">Location</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase tracking-wider">Login Time</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-text-dim uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { d: "MacBook Pro", icon: "laptop_mac", b: "Chrome 125.0", ip: "192.168.1.101", l: "Denver, USA", t: "Today, 10:24 AM", cur: true },
                      { d: "iPhone 15 Pro", icon: "smartphone", b: "Safari iOS", ip: "10.0.0.55", l: "Denver, USA", t: "Yesterday, 3:45 PM", cur: false },
                      { d: "Windows PC", icon: "desktop_windows", b: "Edge", ip: "172.16.0.4", l: "Chicago, USA", t: "Jul 01, 8:00 AM", cur: false }
                    ].map((s, idx) => (
                      <tr key={idx} className="border-b border-dash-divider hover:bg-dash-row-hover">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-text-muted">{s.icon}</span>
                            <span className="text-[13px] font-medium text-text-heading">{s.d}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[13px] text-text-body">{s.b}</td>
                        <td className="px-5 py-3 text-[13px] font-mono text-text-muted">{s.ip}</td>
                        <td className="px-5 py-3 text-[13px] text-text-muted">{s.l}</td>
                        <td className="px-5 py-3 text-[13px] text-text-muted">{s.t}</td>
                        <td className="px-5 py-3">
                          {s.cur ? (
                            <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-brand/10 text-brand">Current Session</span>
                          ) : (
                            <button className="px-3 py-1 rounded border border-status-error text-[12px] font-medium text-status-error hover:bg-red-50 transition-colors">Revoke</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 max-w-xl">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Default Warehouse</label>
                  <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                    <option>Warehouse Alpha</option>
                    <option>Warehouse Beta</option>
                    <option>Warehouse Gamma</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Default Dashboard View</label>
                  <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                    <option>Full Dashboard</option>
                    <option>Warehouse Ops Focus</option>
                    <option>Orders Focus</option>
                    <option>Inventory Focus</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Date Format</label>
                  <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Time Format</label>
                  <div className="flex items-center gap-4 h-9">
                    <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-body">
                      <input type="radio" name="profTimeFormat" defaultChecked className="accent-brand" /> 12h (AM/PM)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-body">
                      <input type="radio" name="profTimeFormat" className="accent-brand" /> 24h
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Theme</label>
                  <div className="flex items-start gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-body h-9">
                      <input type="radio" name="theme" defaultChecked className="accent-brand" /> Light
                    </label>
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-body h-9">
                        <input type="radio" name="theme" className="accent-brand" /> Dark
                      </label>
                      <p className="text-[11px] text-text-dim ml-5 -mt-1">Dark mode coming soon</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-body h-9">
                      <input type="radio" name="theme" className="accent-brand" /> System
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Items Per Page (Tables)</label>
                  <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-b border-dash-divider">
                  <span className="text-[13px] font-semibold text-text-heading">Sidebar Collapsed by Default</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                  </label>
                </div>
                <div className="pt-2">
                  <button className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">Save Preferences</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                {notificationsList.map((notif, idx) => (
                  <div key={idx} className="bg-dash-bg border border-dash-card-border rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="text-[13px] font-bold text-text-heading">{notif.name}</h4>
                      <p className="text-[12px] text-text-dim">{notif.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-semibold text-text-muted uppercase mb-1">In-App</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={idx % 2 === 0 || idx < 3} />
                          <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-semibold text-text-muted uppercase mb-1">Email</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={idx % 3 === 0} />
                          <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-dash-divider flex justify-end">
                <button className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">Save Notification Settings</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
