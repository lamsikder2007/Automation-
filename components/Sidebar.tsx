'use client';

import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  GitFork,
  Sheet,
  HardDrive,
  Calendar,
  ShoppingBag,
  PackageCheck,
  KeyRound,
  BarChart3,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Shield,
  MessageSquare,
  Store,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'inbox'
  | 'workflows'
  | 'sheets'
  | 'drive'
  | 'calendar'
  | 'products'
  | 'orders'
  | 'connections'
  | 'analytics'
  | 'onboarding'
  | 'simulator'
  | 'facebook'
  | 'tenants';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount?: number;
  ordersCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadCount = 1,
  ordersCount = 4,
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Unified Inbox', icon: Inbox, badge: unreadCount ? `${unreadCount}` : undefined, badgeColor: 'bg-indigo-600 text-white' },
    { id: 'simulator', label: 'AI Chat Simulator', icon: Sparkles, badge: 'Live AI', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'workflows', label: 'Workflow Builder', icon: GitFork, badge: 'Active', badgeColor: 'bg-emerald-100 text-emerald-800' },
  ];

  const integrationNav = [
    { id: 'sheets', label: 'Google Sheets', icon: Sheet, sub: 'Inventory Source' },
    { id: 'drive', label: 'Google Drive', icon: HardDrive, sub: 'Product Images' },
    { id: 'calendar', label: 'Google Calendar', icon: Calendar, sub: 'Callback Booking' },
  ];

  const commerceNav = [
    { id: 'products', label: 'Product Catalog', icon: ShoppingBag },
    { id: 'orders', label: 'Orders & Leads', icon: PackageCheck, badge: `${ordersCount}`, badgeColor: 'bg-amber-100 text-amber-900' },
    { id: 'facebook', label: 'Facebook Channels', icon: MessageSquare },
    { id: 'tenants', label: 'Store Tenants', icon: Store },
    { id: 'analytics', label: 'Analytics & Logs', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col justify-between shrink-0 select-none">
      <div className="p-3 space-y-6 overflow-y-auto">
        {/* Main Section */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Core Automation
          </div>
          <nav className="space-y-0.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Google Workspace Section */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
            <span>Google Workspace</span>
            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-medium">OAuth 2.0</span>
          </div>
          <nav className="space-y-0.5">
            {integrationNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-zinc-400'}`} />
                    <div className="text-left">
                      <div className="leading-tight">{item.label}</div>
                      <div className="text-[10px] text-zinc-400 font-normal leading-tight">{item.sub}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Commerce & Operations */}
        <div>
          <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Commerce & Ops
          </div>
          <nav className="space-y-0.5">
            {commerceNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id as NavTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-3 border-t border-zinc-200 bg-zinc-50/70">
        <button
          onClick={() => onSelectTab('onboarding')}
          className="w-full text-left p-2.5 rounded-lg border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-50 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Store Setup Wizard</span>
            </span>
            <span className="text-[10px] bg-indigo-200/70 text-indigo-900 px-1.5 py-0.2 rounded font-bold">
              6/6 Ready
            </span>
          </div>
          <p className="text-[11px] text-indigo-700/80 leading-relaxed">
            Click to re-run store onboarding, channel binding, and test dialogues.
          </p>
        </button>

        <div className="mt-3 px-1 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>RLS Protected</span>
          </span>
          <span>v1.2.0-MVP</span>
        </div>
      </div>
    </aside>
  );
};
