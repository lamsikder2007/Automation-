'use client';

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from '@/components/Navbar';
import { Sidebar, NavTab } from '@/components/Sidebar';
import { DashboardView } from '@/components/views/DashboardView';
import { WorkflowBuilderView } from '@/components/views/WorkflowBuilderView';
import { UnifiedInboxView } from '@/components/views/UnifiedInboxView';
import { GoogleSheetsView } from '@/components/views/GoogleSheetsView';
import { GoogleDriveView } from '@/components/views/GoogleDriveView';
import { GoogleCalendarView } from '@/components/views/GoogleCalendarView';
import { ProductsView } from '@/components/views/ProductsView';
import { OrdersView } from '@/components/views/OrdersView';
import { AnalyticsView } from '@/components/views/AnalyticsView';
import { SimulatorView } from '@/components/views/SimulatorView';
import { FacebookSettingsView } from '@/components/views/FacebookSettingsView';
import { TenantsView } from '@/components/views/TenantsView';

import {
  Workspace,
  UserRole,
  ProductItem,
  GoogleDriveAsset,
  CalendarEventItem,
  ConversationItem,
  OrderItem,
  FacebookChannelConfig,
  GoogleSheetConfig,
} from '@/lib/types';

import {
  initialWorkspaces,
  initialProducts,
  initialDriveAssets,
  initialCalendarEvents,
  initialConversations,
  initialOrders,
  initialFacebookChannels,
  initialGoogleSheetConfig,
  mockAnalytics,
} from '@/lib/mockData';

import {
  subscribeToTokenChanges,
  getStoredGoogleToken,
  setCachedAccessToken,
} from '@/lib/firebase';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(initialWorkspaces[0]);
  const [userRole, setUserRole] = useState<UserRole>('owner');
  const [googleToken, setGoogleToken] = useState<string | null>(getStoredGoogleToken());
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  // App-wide live state
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [driveAssets, setDriveAssets] = useState<GoogleDriveAsset[]>(initialDriveAssets);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(initialCalendarEvents);
  const [conversations, setConversations] = useState<ConversationItem[]>(initialConversations);
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [channels, setChannels] = useState<FacebookChannelConfig[]>(initialFacebookChannels);
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>(initialGoogleSheetConfig);

  // Subscribe to in-memory Google token changes
  useEffect(() => {
    const unsubscribe = subscribeToTokenChanges((token) => {
      setGoogleToken(token);
    });
    return () => unsubscribe();
  }, []);

  const handleTokenChange = (token: string | null, user: User | null) => {
    setCachedAccessToken(token);
    setGoogleToken(token);
    setGoogleUser(user);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            products={products}
            driveAssets={driveAssets}
            calendarEvents={calendarEvents}
            conversations={conversations}
            orders={orders}
            onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
            onOpenSimulator={() => setActiveTab('simulator')}
            googleConnected={!!googleToken}
          />
        );
      case 'workflows':
      case 'onboarding':
        return <WorkflowBuilderView onOpenSimulator={() => setActiveTab('simulator')} />;
      case 'inbox':
        return (
          <UnifiedInboxView
            conversations={conversations}
            onUpdateConversations={setConversations}
            onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
          />
        );
      case 'sheets':
        return (
          <GoogleSheetsView
            products={products}
            sheetConfig={sheetConfig}
            onUpdateProducts={setProducts}
            googleToken={googleToken}
          />
        );
      case 'drive':
        return (
          <GoogleDriveView
            driveAssets={driveAssets}
            products={products}
            onUpdateAssets={setDriveAssets}
            googleToken={googleToken}
          />
        );
      case 'calendar':
        return (
          <GoogleCalendarView
            calendarEvents={calendarEvents}
            onUpdateEvents={setCalendarEvents}
            googleToken={googleToken}
            onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
          />
        );
      case 'products':
        return <ProductsView products={products} onNavigateTab={(tab) => setActiveTab(tab as NavTab)} />;
      case 'orders':
        return <OrdersView orders={orders} onUpdateOrders={setOrders} />;
      case 'analytics':
        return <AnalyticsView analytics={mockAnalytics} />;
      case 'simulator':
        return <SimulatorView products={products} googleToken={googleToken} />;
      case 'facebook':
      case 'connections':
        return (
          <FacebookSettingsView
            channels={channels}
            onUpdateChannels={setChannels}
            onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
          />
        );
      case 'tenants':
        return (
          <TenantsView
            currentTenantId={currentWorkspace.id}
            onSelectTenant={(id) => {
              const matched = initialWorkspaces.find((w) => w.id === id);
              if (matched) setCurrentWorkspace(matched);
            }}
          />
        );
      default:
        return (
          <DashboardView
            products={products}
            driveAssets={driveAssets}
            calendarEvents={calendarEvents}
            conversations={conversations}
            orders={orders}
            onNavigateTab={(tab) => setActiveTab(tab as NavTab)}
            onOpenSimulator={() => setActiveTab('simulator')}
            googleConnected={!!googleToken}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col text-zinc-900 font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        currentWorkspace={currentWorkspace}
        allWorkspaces={initialWorkspaces}
        onSelectWorkspace={(ws) => setCurrentWorkspace(ws)}
        userRole={userRole}
        onSelectRole={(role) => setUserRole(role)}
        onOpenSimulator={() => setActiveTab('simulator')}
        onOpenOnboarding={() => setActiveTab('workflows')}
        googleToken={googleToken}
        googleUser={googleUser}
        onTokenChange={handleTokenChange}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          unreadCount={conversations.filter((c) => c.status === 'waiting_human').length}
          ordersCount={orders.filter((o) => o.status === 'pending_confirmation').length}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-zinc-50/70">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
