"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "../../../store/languageStore";

interface Tenant {
  id: string;
  legalName: string;
  taxId: string | null;
  createdAt: string;
  _count: { users: number; warehouses: number };
  subscriptions: Array<{
    id: string;
    tier: string;
    status: string;
    maxWarehouses: number;
    maxUsers: number;
  }>;
}

interface Metrics {
  totalCompanies: number;
  totalUsers: number;
  subscriptions: Array<{
    tier: string;
    status: string;
    _count: number;
  }>;
}

export default function SaasAdminPage() {
  const { t } = useLanguageStore();

  const MOCK_TENANTS: Tenant[] = [
    { id: "TNT-001", legalName: "Acme Corp Logistics", taxId: "12-3456789", createdAt: "2026-01-10T10:00:00Z", _count: { users: 15, warehouses: 3 }, subscriptions: [{ id: "sub-1", tier: "ENTERPRISE", status: "ACTIVE", maxWarehouses: 10, maxUsers: 50 }] },
    { id: "TNT-002", legalName: "Global Imports LLC", taxId: "98-7654321", createdAt: "2026-03-22T14:30:00Z", _count: { users: 4, warehouses: 1 }, subscriptions: [{ id: "sub-2", tier: "PROFESSIONAL", status: "ACTIVE", maxWarehouses: 3, maxUsers: 10 }] },
    { id: "TNT-003", legalName: "Fast Shipping Inc", taxId: "45-6789123", createdAt: "2026-05-14T09:15:00Z", _count: { users: 2, warehouses: 1 }, subscriptions: [{ id: "sub-3", tier: "STARTER", status: "ACTIVE", maxWarehouses: 1, maxUsers: 5 }] },
    { id: "TNT-004", legalName: "Alpha Distributors", taxId: "33-4455667", createdAt: "2025-11-05T11:45:00Z", _count: { users: 1, warehouses: 0 }, subscriptions: [{ id: "sub-4", tier: "STARTER", status: "SUSPENDED", maxWarehouses: 1, maxUsers: 5 }] },
  ];

  const MOCK_METRICS: Metrics = {
    totalCompanies: 42,
    totalUsers: 156,
    subscriptions: [
      { tier: "ENTERPRISE", status: "ACTIVE", _count: 5 },
      { tier: "PROFESSIONAL", status: "ACTIVE", _count: 12 },
      { tier: "STARTER", status: "ACTIVE", _count: 25 },
    ]
  };

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Subscription Edit Form State
  const [tier, setTier] = useState("STARTER");
  const [status, setStatus] = useState("ACTIVE");
  const [maxWarehouses, setMaxWarehouses] = useState(1);
  const [maxUsers, setMaxUsers] = useState(5);

  useEffect(() => {
    fetchSaaSData();
  }, []);

  const fetchSaaSData = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const headers = { Authorization: `Bearer ${token}` };

      const [tenantsRes, metricsRes] = await Promise.all([
        fetch("http://localhost:5000/api/saas/tenants", { headers }),
        fetch("http://localhost:5000/api/saas/metrics", { headers }),
      ]);

      const tenantsData = await tenantsRes.json();
      const metricsData = await metricsRes.json();

      if (tenantsData.data && tenantsData.data.length > 0) setTenants(tenantsData.data);
      else setTenants(MOCK_TENANTS);

      if (metricsData.metrics) setMetrics(metricsData.metrics);
      else setMetrics(MOCK_METRICS);
    } catch (err) {
      console.error(err);
      setTenants(MOCK_TENANTS);
      setMetrics(MOCK_METRICS);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`http://localhost:5000/api/saas/tenants/${selectedTenant.id}/subscription`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier, status, maxWarehouses, maxUsers }),
      });

      if (res.ok) {
        setSelectedTenant(null);
        fetchSaaSData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    const sub = tenant.subscriptions[0];
    if (sub) {
      setTier(sub.tier);
      setStatus(sub.status);
      setMaxWarehouses(sub.maxWarehouses);
      setMaxUsers(sub.maxUsers);
    } else {
      setTier("STARTER");
      setStatus("ACTIVE");
      setMaxWarehouses(1);
      setMaxUsers(5);
    }
  };

  return (
    <div className="min-h-full bg-dash-bg px-4 lg:px-6 pt-5 lg:pt-6 pb-12 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-text-heading tracking-tight">
          {t("saasAdmin")}
        </h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          {t("saasSubtitle")}
        </p>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default
            shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)] hover:border-brand/30 transition-all duration-200">
            <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">Total Tenants</p>
            <p className="text-[30px] font-bold text-brand leading-none tracking-tight">{metrics.totalCompanies}</p>
          </div>
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default
            shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)] hover:border-brand/30 transition-all duration-200">
            <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">Active Users</p>
            <p className="text-[30px] font-bold text-status-success leading-none tracking-tight">{metrics.totalUsers}</p>
          </div>
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default
            shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)] hover:border-brand/30 transition-all duration-200">
            <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">Monthly MRR</p>
            <p className="text-[30px] font-bold text-purple-600 leading-none tracking-tight">$14,500</p>
          </div>
          <div className="bg-dash-card border border-dash-card-border rounded-xl p-4 flex flex-col gap-3 cursor-default
            shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)] hover:border-brand/30 transition-all duration-200">
            <p className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em]">Failed Payments</p>
            <p className="text-[30px] font-bold text-status-warning leading-none tracking-tight">2</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tenants Table */}
        <div className="lg:col-span-8 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center gap-2 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="w-1 h-4 rounded-full bg-brand" />
            <h3 className="text-[14px] font-semibold text-text-heading">{t("tenantCompanies")}</h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-dash-header-bg border-b border-dash-card-border">
                  <tr>
                    {[t("companyName"), t("plan"), t("warehouses"), t("users"), t("action")].map((h, i) => (
                      <th key={h} className={`px-4 py-2.5 text-[11px] font-semibold text-text-dim uppercase tracking-[0.07em] ${i === 2 || i === 3 ? "text-center" : i === 4 ? "text-center" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tenants.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-12 text-center text-[13px] text-text-dim">{t("noTenantCompaniesFound")}</td></tr>
                  ) : tenants.map((tenant, idx) => {
                    const sub = tenant.subscriptions[0];
                    return (
                      <tr key={tenant.id} className={`hover:bg-dash-row-hover transition-colors ${idx < tenants.length - 1 ? "border-b border-dash-divider" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="text-[13px] font-semibold text-text-heading">{tenant.legalName}</div>
                          <div className="text-[11px] text-text-dim mt-0.5">{t("taxIdLabel")} {tenant.taxId || t("na")}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[5px] ${
                            sub?.tier === "ENTERPRISE"
                              ? "text-brand bg-brand-light"
                              : sub?.tier === "PROFESSIONAL"
                              ? "text-purple-600 bg-purple-50"
                              : "text-text-muted bg-gray-100"
                          }`}>
                            {sub?.tier ? t(sub.tier.toLowerCase()) : t("starter")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[13px] font-mono text-text-body">{tenant._count.warehouses}/{sub?.maxWarehouses || 1}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[13px] font-mono text-text-body">{tenant._count.users}/{sub?.maxUsers || 5}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => startEdit(tenant)}
                            className="px-3 h-7 rounded-lg text-[11px] font-semibold bg-brand-light text-brand hover:bg-brand hover:text-white transition-colors">
                            {t("configure")}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-4 bg-dash-card border border-dash-card-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(9,20,38,0.06),0_4px_16px_rgba(9,20,38,0.06)]">
          <div className="flex items-center gap-2 px-4 py-3.5 bg-dash-header-bg border-b border-dash-divider">
            <div className="w-1 h-4 rounded-full bg-brand" />
            <h3 className="text-[14px] font-semibold text-text-heading">{t("subscriptionManager")}</h3>
          </div>
          <div className="p-4">
            {selectedTenant ? (
              <form onSubmit={handleUpdateSubscription} className="space-y-4">
                <div className="bg-brand-light border border-brand/20 rounded-lg p-3">
                  <p className="text-[11px] font-semibold text-brand uppercase tracking-[0.05em]">{t("configuringLimits")}</p>
                  <p className="text-[15px] font-bold text-text-heading mt-0.5">{selectedTenant.legalName}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("subscriptionTier")}</label>
                  <select value={tier} onChange={(e) => setTier(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors cursor-pointer">
                    <option value="STARTER">{t("starter")}</option>
                    <option value="PROFESSIONAL">{t("professional")}</option>
                    <option value="ENTERPRISE">{t("enterprise")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("subscriptionStatus")}</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors cursor-pointer">
                    <option value="ACTIVE">{t("activeUppercase")}</option>
                    <option value="SUSPENDED">{t("suspendedUppercase")}</option>
                    <option value="TRIAL">{t("trialUppercase")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("maxWarehouses")}</label>
                  <input type="number" required value={maxWarehouses} onChange={(e) => setMaxWarehouses(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-text-body uppercase tracking-[0.05em]">{t("maxUsers")}</label>
                  <input type="number" required value={maxUsers} onChange={(e) => setMaxUsers(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg border text-[13px] bg-dash-card border-dash-card-border text-text-body focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors" />
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedTenant(null)}
                    className="flex-1 h-9 rounded-lg border text-[13px] font-medium bg-dash-card border-dash-card-border text-text-body hover:border-brand hover:text-brand transition-colors">
                    {t("cancel")}
                  </button>
                  <button type="submit"
                    className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-brand text-white hover:bg-brand-hover transition-colors shadow-[0_2px_8px_rgba(20,102,192,0.35)]">
                    {t("savePlan")}
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-16 text-center text-[13px] text-text-dim px-4">
                {t("selectTenantCompany")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
