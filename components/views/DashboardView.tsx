'use client';

import React from 'react';
import {
  MessageSquare,
  Bot,
  UserCheck,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sheet,
  HardDrive,
  Calendar,
  Sparkles,
  Zap,
  PhoneCall,
  ChevronRight,
} from 'lucide-react';
import { ProductItem, ConversationItem, OrderItem, Tenant, GoogleDriveAsset, CalendarEventItem } from '@/lib/types';

interface DashboardViewProps {
  products: ProductItem[];
  conversations: ConversationItem[];
  orders: OrderItem[];
  onNavigateTab: (tab: any) => void;
  onOpenSimulator?: () => void;
  googleConnected?: boolean;
  currentTenant?: Tenant;
  driveAssets?: GoogleDriveAsset[];
  calendarEvents?: CalendarEventItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  conversations,
  orders,
  onNavigateTab,
  onOpenSimulator = () => onNavigateTab('simulator'),
  googleConnected = true,
  currentTenant,
  driveAssets = [],
  calendarEvents = [],
}) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-indigo-950 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              Bangladesh E-Commerce AI Stack
            </span>
            <span className="text-zinc-400 text-xs">• Dhaka GMT+6</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Apex Mart BD — AutoCommerce AI Hub</h1>
          <p className="text-zinc-300 text-xs max-w-2xl leading-relaxed">
            Your store is actively answering customer inquiries on Facebook Messenger using grounded inventory data from Google Sheets, product media from Google Drive, and scheduling callbacks in Google Calendar.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSimulator}
            className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Test Customer Simulator</span>
          </button>
          <button
            onClick={() => onNavigateTab('workflows')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Zap className="w-4 h-4 text-indigo-300" />
            <span>Workflow Canvas</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Conversations</span>
            <MessageSquare className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900">1,482</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% this week</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">AI Resolved</span>
            <Bot className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900">84.6%</div>
          <div className="text-[11px] text-zinc-400 mt-1 font-medium">
            <span>1,254 auto-replied</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Human Handoff</span>
            <UserCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900">15.4%</div>
          <div className="text-[11px] text-zinc-400 mt-1 font-medium">
            <span>228 escalated</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Active Leads</span>
            <PhoneCall className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900">394</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            <span>+32 captured today</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Confirmed Orders</span>
            <ShoppingBag className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900">৳{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-zinc-400 mt-1 font-medium">
            <span>{orders.length} active orders</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium">Avg AI Latency</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900">1.1s</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            <span>Flash 2.5 Turbo</span>
          </div>
        </div>
      </div>

      {/* Integration Status Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Connected Channels & Workspace Data Sources
          </h2>
          <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={() => onNavigateTab('connections')}>
            Manage Vault →
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Facebook */}
          <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                f
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-900">Facebook Page</div>
                <div className="text-[11px] text-zinc-500">Apex Mart BD (48.6k)</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Live
            </span>
          </div>

          {/* Google Sheets */}
          <div
            onClick={() => onNavigateTab('sheets')}
            className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/70 transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Sheet className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-900">Google Sheets</div>
                <div className="text-[11px] text-zinc-500">{products.length} Products Indexed</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Synced
            </span>
          </div>

          {/* Google Drive */}
          <div
            onClick={() => onNavigateTab('drive')}
            className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/70 transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-900">Google Drive</div>
                <div className="text-[11px] text-zinc-500">SKU Image Folders</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>

          {/* Google Calendar */}
          <div
            onClick={() => onNavigateTab('calendar')}
            className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/70 transition-colors cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-900">Google Calendar</div>
                <div className="text-[11px] text-zinc-500">Customer Callbacks</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Active
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Inquiries Breakdown & Recent Messenger Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Intent Breakdown & Rules */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-zinc-900 mb-1">Customer Inquiry Intent Distribution</h3>
            <p className="text-xs text-zinc-500 mb-4">Classified across Bangla, Banglish & English inputs</p>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-700">Price & Discount Inquiry</span>
                  <span className="font-bold text-zinc-900">38% (563 msgs)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-700">Size & Stock Availability</span>
                  <span className="font-bold text-zinc-900">26% (385 msgs)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '26%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-700">Delivery Charge (Dhaka / Outside)</span>
                  <span className="font-bold text-zinc-900">18% (267 msgs)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-700">Order Requests & Address Collection</span>
                  <span className="font-bold text-zinc-900">11% (163 msgs)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '11%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-zinc-700">Callback Appointment Requests</span>
                  <span className="font-bold text-zinc-900">7% (104 msgs)</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 text-[11px] text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900">Strict Grounding Guardrail:</strong> AI engine answers exclusively using values from your connected Google Sheet. Hallucinations on price, discount, or out-of-stock items are strictly blocked by the system prompt.
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-zinc-900 mb-3">Quick Automation Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenSimulator}
                className="p-3 text-left rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
              >
                <div className="text-xs font-semibold text-indigo-900 mb-0.5">Test Messenger Chat</div>
                <div className="text-[11px] text-indigo-700">Simulate customer message</div>
              </button>
              <button
                onClick={() => onNavigateTab('sheets')}
                className="p-3 text-left rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                <div className="text-xs font-semibold text-zinc-900 mb-0.5">Sync Google Sheets</div>
                <div className="text-[11px] text-zinc-500">Update live inventory</div>
              </button>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="p-3 text-left rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                <div className="text-xs font-semibold text-zinc-900 mb-0.5">View Callbacks</div>
                <div className="text-[11px] text-zinc-500">Check calendar slots</div>
              </button>
              <button
                onClick={() => onNavigateTab('orders')}
                className="p-3 text-left rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                <div className="text-xs font-semibold text-zinc-900 mb-0.5">Pending Orders</div>
                <div className="text-[11px] text-zinc-500">{orders.length} orders need review</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Recent Conversations Feed */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Recent Customer Inquiries (Facebook Messenger)</h3>
                <p className="text-xs text-zinc-500">Real-time messages handled by AI with ground truth inspection</p>
              </div>
              <button
                onClick={() => onNavigateTab('inbox')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Open Inbox</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onNavigateTab('inbox')}
                  className="p-3.5 rounded-xl border border-zinc-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-xs text-zinc-700">
                        {conv.customer.name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-zinc-900">{conv.customer.name}</span>
                      <span className="text-[10px] text-zinc-400">({conv.customer.phone || 'Messenger PSID'})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        conv.aiActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {conv.aiActive ? 'AI Handling' : 'Human Assigned'}
                      </span>
                      <span className="text-[10px] text-zinc-400">{conv.lastMessageTime}</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-1 mb-2">
                    <strong className="text-zinc-700">Customer:</strong> &ldquo;{conv.lastMessage}&rdquo;
                  </p>

                  {conv.messages.length > 1 && (
                    <div className="bg-zinc-50 p-2 rounded-md border border-zinc-100 text-[11px] text-zinc-700 line-clamp-2">
                      <strong className="text-indigo-600">AI Reply:</strong> {conv.messages[conv.messages.length - 1].content}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    {conv.customer.tags.map((t, idx) => (
                      <span key={idx} className="text-[9px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                    {conv.notes && (
                      <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                        Note: {conv.notes}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Showing top 3 of 42 active customer sessions</span>
            <button
              onClick={() => onNavigateTab('inbox')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View all 42 threads →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
