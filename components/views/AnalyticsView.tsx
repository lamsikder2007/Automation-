'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Users,
  Bot,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { AnalyticsData } from '@/lib/types';

interface AnalyticsViewProps {
  analytics: AnalyticsData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const dailyTrend = [
    { day: 'Mon', revenue: 42000, convos: 145 },
    { day: 'Tue', revenue: 58000, convos: 182 },
    { day: 'Wed', revenue: 51000, convos: 168 },
    { day: 'Thu', revenue: 64000, convos: 210 },
    { day: 'Fri', revenue: 89000, convos: 295 },
    { day: 'Sat', revenue: 95000, convos: 320 },
    { day: 'Sun', revenue: 76000, convos: 240 },
  ];

  const maxRevenue = Math.max(...dailyTrend.map((d) => d.revenue));

  const peakHours = [
    { hour: '10 AM', count: 45 },
    { hour: '12 PM', count: 82 },
    { hour: '2 PM', count: 64 },
    { hour: '4 PM', count: 95 },
    { hour: '6 PM', count: 140 },
    { hour: '8 PM', count: 210 },
    { hour: '10 PM', count: 265 },
    { hour: '12 AM', count: 90 },
  ];
  const maxPeak = Math.max(...peakHours.map((p) => p.count));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Commerce & Automation Analytics</h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              Live BI Dashboard
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time tracking of automated sales revenue, AI deflection rates, customer intents, and response latencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-zinc-200 rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md transition-all ${
                timeRange === '7d' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md transition-all ${
                timeRange === '30d' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded-md transition-all ${
                timeRange === '90d' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Quarterly
            </button>
          </div>

          <button
            onClick={() => {
              const headers = 'Metric,Value\n';
              const rows = `Total Revenue,${analytics.totalRevenue}\nTotal Orders,${analytics.totalOrders}\nAI Deflection,${analytics.aiHandlingRate}%\nResponse Latency,${analytics.averageResponseTimeSeconds}s`;
              const blob = new Blob([headers + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Apex_Mart_Analytics_Report.csv';
              a.click();
            }}
            className="px-3 py-1.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Total AI Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">৳{analytics.totalRevenue.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.8% from last month</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Orders Automated</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{analytics.totalOrders.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>89% checkout conversion</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>AI Autonomous Resolution</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{analytics.aiHandlingRate}%</div>
          <div className="text-[11px] text-zinc-500">Only 11.6% needed human handoff</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Avg Response Latency</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-900">{analytics.averageResponseTimeSeconds}s</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Instant reply on Messenger</div>
        </div>
      </div>

      {/* Visual Chart Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Daily Revenue & Message Volume</h2>
              <p className="text-xs text-zinc-500">BDT sales captured through automated Messenger flow</p>
            </div>
            <span className="text-xs font-mono text-zinc-500">BDT ৳</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-4 px-2">
            {dailyTrend.map((item, idx) => {
              const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ৳{(item.revenue / 1000).toFixed(0)}k
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[42px] bg-indigo-600 group-hover:bg-indigo-700 rounded-t-lg transition-all relative shadow-2xs"
                  ></div>
                  <span className="text-[11px] font-medium text-zinc-600">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Intent Distribution Breakdown */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Customer Intent Distribution</h2>
            <p className="text-xs text-zinc-500">Breakdown of inbound queries categorized by AI</p>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.intentBreakdown.map((intent, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-zinc-800">{intent.intent}</span>
                  <span className="text-zinc-500 font-mono">
                    {intent.count} ({intent.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    style={{ width: `${intent.percentage}%` }}
                    className={`h-full rounded-full ${
                      idx === 0
                        ? 'bg-indigo-600'
                        : idx === 1
                        ? 'bg-emerald-500'
                        : idx === 2
                        ? 'bg-amber-500'
                        : idx === 3
                        ? 'bg-purple-500'
                        : 'bg-zinc-400'
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Messaging Hours Heatmap */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Peak Messaging Hours (Dhaka Time GMT+6)</h2>
            <p className="text-xs text-zinc-500">
              Customer traffic surges between 8:00 PM and 11:00 PM in Bangladesh
            </p>
          </div>
          <span className="text-xs text-emerald-600 font-bold">24/7 AI Availability</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
          {peakHours.map((p, idx) => {
            const ratio = p.count / maxPeak;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl border border-zinc-200 text-center space-y-1"
                style={{
                  backgroundColor: `rgba(99, 102, 241, ${Math.max(0.08, ratio * 0.4)})`,
                }}
              >
                <div className="text-[10px] font-bold text-zinc-500">{p.hour}</div>
                <div className="text-sm font-extrabold text-zinc-900">{p.count}</div>
                <div className="text-[9px] text-zinc-500">chats</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
