"use client";

import { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";

type SettingsSection = "GENERAL" | "COMPANY" | "WAREHOUSES" | "INTEGRATIONS" | "NOTIFICATIONS" | "LOCALIZATION" | "SECURITY";

export default function SettingsPage() {
  const { t } = useLanguageStore();
  const [selectedSection, setSelectedSection] = useState<SettingsSection>("GENERAL");

  const sections: { id: SettingsSection; label: string; icon: string }[] = [
    { id: "GENERAL", label: "General", icon: "settings" },
    { id: "COMPANY", label: "Company", icon: "business" },
    { id: "WAREHOUSES", label: "Warehouses", icon: "warehouse" },
    { id: "INTEGRATIONS", label: "Integrations", icon: "integration_instructions" },
    { id: "NOTIFICATIONS", label: "Notifications", icon: "notifications" },
    { id: "LOCALIZATION", label: "Language & Localization", icon: "language" },
    { id: "SECURITY", label: "Security", icon: "lock" },
  ];

  const renderSection = () => {
    switch (selectedSection) {
      case "GENERAL":
        return (
          <div className="space-y-4">
            <h2 className="text-[18px] font-bold text-text-heading mb-4">General Settings</h2>
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Platform Name</label>
              <input type="text" defaultValue="LogiTrack WMS" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Default Timezone</label>
              <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                <option>UTC</option>
                <option>America/New_York (EST)</option>
                <option>America/Chicago (CST)</option>
                <option>America/Denver (MST)</option>
                <option>America/Los_Angeles (PST)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Default Currency</label>
              <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>CAD ($)</option>
                <option>AUD ($)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Date Format</label>
              <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Time Format</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-body">
                  <input type="radio" name="timeFormat" defaultChecked className="accent-brand" /> 12h (AM/PM)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-text-body">
                  <input type="radio" name="timeFormat" className="accent-brand" /> 24h
                </label>
              </div>
            </div>
            <div className="pt-4 border-t border-dash-divider">
              <button className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">Save Changes</button>
            </div>
          </div>
        );

      case "COMPANY":
        return (
          <div className="space-y-4">
            <h2 className="text-[18px] font-bold text-text-heading mb-4">Company Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Company Name</label>
                  <input type="text" defaultValue="Logistix Corp" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Legal Name</label>
                  <input type="text" defaultValue="Logistix Corporation LLC" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Tax ID</label>
                <input type="text" defaultValue="12-3456789" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Address Line 1</label>
                <input type="text" defaultValue="123 Logistics Way" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Address Line 2</label>
                <input type="text" defaultValue="Suite 100" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">City</label>
                  <input type="text" defaultValue="Denver" className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Country</label>
                  <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Company Logo</label>
                <div className="border-2 border-dashed border-dash-card-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-dash-row-hover transition-colors cursor-pointer bg-dash-bg">
                  <span className="material-symbols-outlined text-[32px] text-brand mb-2">upload_file</span>
                  <p className="text-[14px] font-semibold text-text-heading">Upload Company Logo</p>
                  <p className="text-[12px] text-text-dim mt-1">Recommended: 200x200px PNG</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-dash-divider">
              <button className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">Save Changes</button>
            </div>
          </div>
        );

      case "WAREHOUSES":
        return (
          <div className="space-y-4">
            <h2 className="text-[18px] font-bold text-text-heading mb-4">Warehouses</h2>
            <div className="space-y-3">
              {["Warehouse Alpha", "Warehouse Beta", "Warehouse Gamma", "Warehouse Delta"].map((wh, idx) => (
                <div key={wh} className="bg-dash-bg border border-dash-card-border rounded-lg p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[14px] font-bold text-text-heading">{wh}</p>
                    <p className="text-[12px] text-text-dim mt-0.5">{["Denver, CO", "Chicago, IL", "Atlanta, GA", "Dallas, TX"][idx]}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-green-100 text-status-success">ACTIVE</span>
                    <button className="px-3 h-8 rounded-lg border text-[12px] font-medium bg-white border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                      Edit Configuration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "INTEGRATIONS":
        return (
          <div className="space-y-6">
            <h2 className="text-[18px] font-bold text-text-heading mb-4">Integrations</h2>
            
            <div className="space-y-4">
              <h3 className="text-[14px] font-bold text-text-body uppercase tracking-wider">Ecommerce Integrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dash-bg border border-dash-card-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#95BF47]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px] text-[#95BF47]">shopping_bag</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-green-100 text-status-success">CONNECTED</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-text-heading">Shopify</h4>
                  <p className="text-[12px] text-text-dim mb-4">Last sync: 2 min ago</p>
                  <div className="flex gap-2">
                    <button className="flex-1 h-8 rounded-lg border text-[12px] font-medium bg-white border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">Configure</button>
                    <button className="flex-1 h-8 rounded-lg text-[12px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors">Sync Now</button>
                  </div>
                </div>

                <div className="bg-dash-bg border border-dash-card-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#FF9900]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px] text-[#FF9900]">shopping_cart</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-green-100 text-status-success">CONNECTED</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-text-heading">Amazon</h4>
                  <p className="text-[12px] text-text-dim mb-4">Last sync: 15 min ago</p>
                  <div className="flex gap-2">
                    <button className="w-full h-8 rounded-lg border text-[12px] font-medium bg-white border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">Configure</button>
                  </div>
                </div>

                <div className="bg-dash-bg border border-dash-card-border rounded-xl p-4 flex flex-col justify-between shadow-sm opacity-75">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#96588A]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px] text-[#96588A]">storefront</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-status-error">DISCONNECTED</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-text-heading">WooCommerce</h4>
                  <p className="text-[12px] text-text-dim mb-4">API authentication failed</p>
                  <div className="flex gap-2">
                    <button className="w-full h-8 rounded-lg text-[12px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors">Connect</button>
                  </div>
                </div>

                <div className="bg-dash-bg border border-dash-card-border rounded-xl p-4 flex flex-col justify-between shadow-sm opacity-50 grayscale">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#E53238]/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px] text-[#E53238]">store</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-200 text-text-muted">NOT CONFIGURED</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-text-heading">eBay</h4>
                  <p className="text-[12px] text-text-dim mb-4">Not set up</p>
                  <div className="flex gap-2">
                    <button className="w-full h-8 rounded-lg border text-[12px] font-medium bg-white border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">Connect</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-dash-divider">
              <h3 className="text-[14px] font-bold text-text-body uppercase tracking-wider">Carrier Integrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dash-bg border border-dash-card-border rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#4D148C]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px] text-[#4D148C]">local_shipping</span>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-text-heading">FedEx</h4>
                      <span className="text-[11px] font-semibold text-status-success">ACTIVE</span>
                    </div>
                  </div>
                  <button className="px-3 h-8 rounded-lg border text-[12px] font-medium bg-white border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">Configure</button>
                </div>
                <div className="bg-dash-bg border border-dash-card-border rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#351C15]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px] text-[#FFB500]">local_shipping</span>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-text-heading">UPS</h4>
                      <span className="text-[11px] font-semibold text-status-success">ACTIVE</span>
                    </div>
                  </div>
                  <button className="px-3 h-8 rounded-lg border text-[12px] font-medium bg-white border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">Configure</button>
                </div>
                <div className="bg-dash-bg border border-dash-card-border rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#FFCC00]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px] text-[#D40511]">local_shipping</span>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-text-heading">DHL</h4>
                      <span className="text-[11px] font-semibold text-status-success">ACTIVE</span>
                    </div>
                  </div>
                  <button className="px-3 h-8 rounded-lg border text-[12px] font-medium bg-white border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">Configure</button>
                </div>
                <div className="bg-dash-bg border border-dash-card-border rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px] text-gray-500">local_shipping</span>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-text-heading">Local Carrier</h4>
                      <span className="text-[11px] font-semibold text-status-success">ACTIVE</span>
                    </div>
                  </div>
                  <button className="px-3 h-8 rounded-lg border text-[12px] font-medium bg-white border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">Configure</button>
                </div>
              </div>
            </div>
          </div>
        );

      case "NOTIFICATIONS":
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
          <div className="space-y-4">
            <h2 className="text-[18px] font-bold text-text-heading mb-4">Notification Preferences</h2>
            <div className="bg-dash-bg border border-dash-card-border rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-dash-header-bg border-b border-dash-divider">
                  <tr>
                    <th className="px-4 py-3 text-[12px] font-semibold text-text-dim uppercase">Notification</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-text-dim uppercase text-center w-24">In-App</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-text-dim uppercase text-center w-24">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationsList.map((notif, idx) => (
                    <tr key={idx} className="border-b border-dash-divider hover:bg-dash-row-hover">
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-bold text-text-heading">{notif.name}</p>
                        <p className="text-[12px] text-text-dim">{notif.desc}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={idx % 2 === 0 || idx < 3} />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={idx % 3 === 0} />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pt-4 flex justify-end">
              <button className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">Save Notification Settings</button>
            </div>
          </div>
        );

      case "LOCALIZATION":
        return (
          <div className="space-y-4">
            <h2 className="text-[18px] font-bold text-text-heading mb-4">Language & Localization</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Platform Default Language</label>
                <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                  <option>🇬🇧 English</option>
                  <option>🇪🇸 Español</option>
                  <option>🇫🇷 Français</option>
                  <option>🇮🇹 Italiano</option>
                </select>
                <p className="text-[12px] text-text-dim">Individual users can override this in their profile settings</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Date Format Preference</label>
                  <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Number Format Preference</label>
                  <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                    <option>1,234.56</option>
                    <option>1.234,56</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Currency Display</label>
                <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-bg border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                  <option>Symbol ($)</option>
                  <option>Code (USD)</option>
                  <option>Symbol & Code ($ USD)</option>
                </select>
              </div>
            </div>
            <div className="pt-4 border-t border-dash-divider">
              <button className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-sm">Save</button>
            </div>
          </div>
        );

      case "SECURITY":
        return (
          <div className="space-y-4">
            <h2 className="text-[18px] font-bold text-text-heading mb-4">Security Settings</h2>
            
            <div className="bg-dash-bg border border-dash-card-border rounded-xl p-4 shadow-sm space-y-4">
              <h3 className="text-[14px] font-bold text-text-heading border-b border-dash-divider pb-2">Session Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">Session Timeout</label>
                  <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-white border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                    <option>15 min</option>
                    <option>30 min</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                    <option>Never</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-text-heading">Remember Me</p>
                    <p className="text-[12px] text-text-dim">Allow users to stay logged in across sessions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                  </label>
                </div>
              </div>
              <div className="pt-2">
                <button className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-white border border-dash-card-border hover:border-brand text-text-body hover:text-brand transition-colors">Save</button>
              </div>
            </div>

            <div className="bg-dash-bg border border-dash-card-border rounded-xl p-4 shadow-sm space-y-4">
              <h3 className="text-[14px] font-bold text-text-heading border-b border-dash-divider pb-2">Two-Factor Authentication</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-text-heading">Require 2FA for all users</p>
                    <p className="text-[12px] text-text-dim">Users will be prompted to set up 2FA on next login</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">2FA Method</label>
                  <select className="w-full h-9 px-3 rounded-lg border text-[13px] bg-white border-dash-card-border text-text-body focus:outline-none focus:border-brand cursor-pointer">
                    <option>Authenticator App</option>
                    <option>SMS</option>
                    <option>Email</option>
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <button className="px-4 h-9 rounded-lg text-[13px] font-semibold bg-white border border-dash-card-border hover:border-brand text-text-body hover:text-brand transition-colors">Save</button>
              </div>
            </div>

            <div className="bg-dash-bg border border-dash-card-border rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-dash-divider">
                <h3 className="text-[14px] font-bold text-text-heading">Active Sessions (All Users)</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-dash-header-bg border-b border-dash-divider">
                  <tr>
                    <th className="px-4 py-3 text-[12px] font-semibold text-text-dim">User</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-text-dim">Device & Browser</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-text-dim">IP Address</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-text-dim">Location</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-text-dim">Login Time</th>
                    <th className="px-4 py-3 text-[12px] font-semibold text-text-dim">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { u: "MR", n: "M. Rodriguez", d: "MacBook Pro", b: "Chrome", ip: "192.168.1.101", l: "New York, USA", t: "Today, 10:30 AM" },
                    { u: "JS", n: "J. Smith", d: "iPhone 15", b: "Safari", ip: "10.0.0.55", l: "London, UK", t: "Today, 9:15 AM" },
                    { u: "LC", n: "L. Chen", d: "Windows PC", b: "Edge", ip: "172.16.0.4", l: "Toronto, CA", t: "Yesterday, 4:20 PM" }
                  ].map((s, idx) => (
                    <tr key={idx} className="border-b border-dash-divider hover:bg-dash-row-hover">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold">{s.u}</div>
                          <span className="text-[13px] font-medium text-text-heading">{s.n}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-text-body">{s.d} - {s.b}</td>
                      <td className="px-4 py-3 text-[13px] font-mono text-text-muted">{s.ip}</td>
                      <td className="px-4 py-3 text-[13px] text-text-muted">{s.l}</td>
                      <td className="px-4 py-3 text-[13px] text-text-muted">{s.t}</td>
                      <td className="px-4 py-3">
                        <button className="text-[12px] text-status-error hover:underline font-medium">Revoke</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-text-heading tracking-tight">Platform Settings</h1>
          <p className="text-[13px] text-text-muted mt-0.5">Manage system-wide configuration and preferences.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sub-Nav Panel */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-2 shadow-sm sticky top-6">
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    selectedSection === section.id
                      ? "bg-brand/10 text-brand"
                      : "text-text-body hover:bg-dash-row-hover hover:text-text-heading"
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${selectedSection === section.id ? "text-brand" : "text-text-muted"}`}>
                    {section.icon}
                  </span>
                  <span className="text-[13px] font-medium">{section.label}</span>
                </button>
              ))}
              
              <div className="pt-2 mt-2 border-t border-dash-divider">
                <a href="/settings/users" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-text-body hover:bg-dash-row-hover hover:text-text-heading">
                  <span className="material-symbols-outlined text-[20px] text-text-muted">manage_accounts</span>
                  <span className="text-[13px] font-medium">User Management</span>
                  <span className="material-symbols-outlined ml-auto text-[16px] text-text-muted">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 min-w-0">
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-6 shadow-sm">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
