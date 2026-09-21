'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sheet,
  HardDrive,
  Calendar,
  MessageSquare,
  Shield,
  Layers,
  Globe,
} from 'lucide-react';
import { Tenant } from '@/lib/types';
import { initialTenants } from '@/lib/mockData';

interface TenantsViewProps {
  currentTenantId: string;
  onSelectTenant: (tenantId: string) => void;
}

export const TenantsView: React.FC<TenantsViewProps> = ({ currentTenantId, onSelectTenant }) => {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);

  // New tenant form
  const [newName, setNewName] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newPlan, setNewPlan] = useState<'starter' | 'growth' | 'enterprise'>('growth');

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newT: Tenant = {
      id: 'tenant_' + Date.now(),
      name: newName,
      slug: newName.toLowerCase().replace(/\s+/g, '-'),
      customDomain: newDomain || undefined,
      plan: newPlan,
      createdAt: new Date().toISOString(),
      channelsCount: 1,
      ordersCount: 0,
      revenueBdt: 0,
    };

    setTenants([...tenants, newT]);
    setShowAddTenantModal(false);
    onSelectTenant(newT.id);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Multi-Tenant Store Management</h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              SaaS Multi-Tenancy
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Run multiple e-commerce businesses or client stores with isolated Google Workspace credentials, Messenger webhooks, and AI policies.
          </p>
        </div>

        <button
          onClick={() => setShowAddTenantModal(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Store / Client</span>
        </button>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tenants.map((t) => {
          const isSelected = t.id === currentTenantId;
          return (
            <div
              key={t.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs space-y-4 transition-all ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-zinc-900">{t.name}</h3>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active Store
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">ID: {t.id}</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-zinc-100 text-zinc-700 border border-zinc-200">
                  {t.plan}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-50 rounded-lg text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Total Sales</div>
                  <div className="font-extrabold text-zinc-900 mt-0.5">৳{t.revenueBdt.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Orders</div>
                  <div className="font-extrabold text-zinc-900 mt-0.5">{t.ordersCount}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Channels</div>
                  <div className="font-extrabold text-zinc-900 mt-0.5">{t.channelsCount} Pages</div>
                </div>
              </div>

              {/* Connected Integrations list */}
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Sheets Inventory:</span>
                  </span>
                  <span className="font-medium text-zinc-900">Apex_Mart_Inventory_2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                    <span>Google Drive Media:</span>
                  </span>
                  <span className="font-medium text-zinc-900">/Apex_Mart/Products/</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Google Calendar:</span>
                  </span>
                  <span className="font-medium text-zinc-900">Primary (Asia/Dhaka)</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">Created: {t.createdAt}</span>
                <button
                  onClick={() => onSelectTenant(t.id)}
                  disabled={isSelected}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-400 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                  }`}
                >
                  <span>{isSelected ? 'Currently Selected' : 'Switch to this Store'}</span>
                  {!isSelected && <ArrowRight className="w-3 h-3" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Tenant Modal */}
      {showAddTenantModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900">Add New Store Tenant</h3>
              <button
                onClick={() => setShowAddTenantModal(false)}
                className="text-zinc-400 hover:text-zinc-700 font-bold text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">Store / Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Denim Co."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">Custom Domain or Subdomain</label>
                <input
                  type="text"
                  placeholder="dhakadenim.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">Pricing Plan</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  aria-label="Pricing Plan"
                  className="w-full px-3 py-1.5 text-xs border border-zinc-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="starter">Starter (1 Facebook Page)</option>
                  <option value="growth">Growth (3 Facebook Pages + AI Workflows)</option>
                  <option value="enterprise">Enterprise (Unlimited Pages + Custom SLA)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="px-3.5 py-1.5 border border-zinc-300 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  Create & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
