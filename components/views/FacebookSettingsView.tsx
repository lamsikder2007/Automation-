'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Send,
  Zap,
  Globe,
  Sliders,
  AlertCircle,
  Code,
} from 'lucide-react';
import { FacebookChannelConfig } from '@/lib/types';

interface FacebookSettingsViewProps {
  channels: FacebookChannelConfig[];
  onUpdateChannels: (channels: FacebookChannelConfig[]) => void;
  onNavigateTab: (tab: any) => void;
}

export const FacebookSettingsView: React.FC<FacebookSettingsViewProps> = ({
  channels,
  onUpdateChannels,
  onNavigateTab,
}) => {
  const [activeChannelId, setActiveChannelId] = useState(channels[0]?.id || 'fb_page_1');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    setTestResult(null);
    try {
      const payload = {
        object: 'page',
        entry: [
          {
            id: activeChannel.pageId,
            time: Date.now(),
            messaging: [
              {
                sender: { id: 'test_psid_999888' },
                recipient: { id: activeChannel.pageId },
                timestamp: Date.now(),
                message: {
                  mid: 'mid.test_' + Date.now(),
                  text: 'টেস্ট মেসেজ: ভাইয়া শার্টের দাম কত?',
                },
              },
            ],
          },
        ],
      };

      const res = await fetch('/app/api/webhooks/messenger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setTestResult({
        status: res.ok ? 200 : res.status,
        success: data.success,
        response: data,
        time: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      setTestResult({
        status: 500,
        success: false,
        error: err.message,
        time: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Facebook Messenger Configuration</h1>
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
              Meta Graph API v20.0
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Connect your Facebook Pages, configure webhook endpoints, verify tokens, and test message routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestWebhook}
            disabled={isTestingWebhook}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-60"
          >
            <Zap className={`w-3.5 h-3.5 ${isTestingWebhook ? 'animate-spin' : ''}`} />
            <span>{isTestingWebhook ? 'Dispatching Ping...' : 'Test Webhook Dispatch'}</span>
          </button>
        </div>
      </div>

      {copySuccess && (
        <div className="p-2.5 bg-zinc-900 text-white rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Copied {copySuccess} to clipboard!</span>
          </span>
        </div>
      )}

      {/* Page Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((chan) => (
          <div
            key={chan.id}
            onClick={() => setActiveChannelId(chan.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              chan.id === activeChannelId
                ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500'
                : 'bg-white border-zinc-200 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  f
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{chan.pageName}</h3>
                  <span className="text-[11px] text-zinc-500 font-mono">Page ID: {chan.pageId}</span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  chan.isConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                {chan.isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-100 mt-2">
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold">Webhook Status</span>
                <div className="font-semibold text-emerald-700 mt-0.5">{chan.webhookStatus}</div>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold">Subscribed Fields</span>
                <div className="font-mono text-zinc-700 mt-0.5 text-[11px]">{chan.subscribedFields.length} events</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook Endpoint Settings */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Meta Webhook Setup Information</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Copy these details into your Meta Developer Dashboard under Messenger → Webhooks.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-zinc-700 block mb-1">Callback URL (Webhook Endpoint)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? `${window.location.origin}/app/api/webhooks/messenger` : '/app/api/webhooks/messenger'}
                className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono text-xs text-zinc-800 select-all"
              />
              <button
                onClick={() =>
                  handleCopy(
                    typeof window !== 'undefined' ? `${window.location.origin}/app/api/webhooks/messenger` : '/app/api/webhooks/messenger',
                    'Callback URL'
                  )
                }
                className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-medium flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-700 block mb-1">Verify Token</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={activeChannel.verifyToken}
                className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono text-xs text-zinc-800 select-all"
              />
              <button
                onClick={() => handleCopy(activeChannel.verifyToken, 'Verify Token')}
                className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-medium flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-700 block mb-1">Subscribed Webhook Events</label>
            <div className="flex flex-wrap gap-1.5">
              {activeChannel.subscribedFields.map((field) => (
                <span
                  key={field}
                  className="px-2.5 py-1 bg-zinc-100 border border-zinc-200 rounded-md font-mono text-[11px] text-zinc-800 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  <span>{field}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Test Output */}
      {testResult && (
        <div className="bg-zinc-900 text-zinc-100 rounded-xl p-4 shadow-md space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Webhook Dispatch Result (HTTP {testResult.status})</span>
            </span>
            <span className="text-zinc-500 text-[10px]">{testResult.time}</span>
          </div>

          <pre className="text-[11px] text-zinc-300 overflow-x-auto p-2 bg-black/40 rounded-lg">
            {JSON.stringify(testResult.response || testResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Ice Breakers & Automated Greeting */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Greeting Text & Quick Ice Breakers</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Shown to customers when they first open your Facebook Page chat before sending their first message.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-bold text-zinc-700 block mb-1">Page Greeting Message</label>
            <textarea
              rows={2}
              defaultValue="আসসালামু আলাইকুম! Apex Mart BD-তে স্বাগতম। আমাদের কালেকশন, সাইজ বা ডেলিভারি নিয়ে যেকোনো প্রশ্ন করতে পারেন।"
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-700 block mb-1">Ice Breaker Buttons (Messenger FAQ)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-800 font-medium">
                1. &ldquo;পণ্য তালিকা ও দাম দেখতে চাই&rdquo;
              </div>
              <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-800 font-medium">
                2. &ldquo;ডেলিভারি চার্জ ও সময় কত?&rdquo;
              </div>
              <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-800 font-medium">
                3. &ldquo;প্রতিনিধির সাথে কথা বলতে চাই&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
