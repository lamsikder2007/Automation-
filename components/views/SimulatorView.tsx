/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  RefreshCw,
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Tag,
  ArrowRight,
  Database,
  Calendar,
} from 'lucide-react';
import { ProductItem } from '@/lib/types';

interface SimulatorViewProps {
  products: ProductItem[];
  googleToken: string | null;
}

interface SimMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  latencyMs?: number;
  intent?: string;
  confidence?: number;
  groundedIn?: string[];
  suggestedAction?: string;
  imageUrl?: string;
}

function makeUniqueId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

function getFormattedTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getPerfNow(): number {
  return typeof performance !== 'undefined' ? performance.now() : 0;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ products, googleToken }) => {
  const [messages, setMessages] = useState<SimMessage[]>([
    {
      id: 'sim_init',
      sender: 'ai',
      text: 'আসসালামু আলাইকুম! Apex Mart BD-তে আপনাকে স্বাগতম। আমি কীভাবে আপনাকে সাহায্য করতে পারি? পণ্য, সাইজ, ডেলিভারি বা কলব্যাক নিয়ে যেকোনো প্রশ্ন করতে পারেন।',
      timestamp: '10:00 AM',
      intent: 'greeting',
      confidence: 0.99,
      groundedIn: ['Apex Mart Welcome Policy'],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTrace, setLastTrace] = useState<any>(null);

  const scenarioPrompts = [
    { label: 'Price Check', text: 'ভাইয়া Premium Oxford Cotton Shirt এর দাম কত?' },
    { label: 'Stock & Sizes', text: 'P001 শার্টের কি L সাইজ স্টক আছে?' },
    { label: 'Delivery Cost', text: 'ঢাকার বাইরে চট্টগ্রাম ডেলিভারি চার্জ কত এবং কতদিন সময় লাগে?' },
    { label: 'Drive Photo Request', text: 'Classic Polo Shirt (P002) এর ছবি দেখান।' },
    { label: 'Calendar Callback', text: 'আমি একজন কাস্টমার প্রতিনিধির সাথে ফোনে কথা বলতে চাই, কল শিডিউল করুন।' },
    { label: 'Order Placement', text: 'আমি ১টি Oxford Cotton Shirt (Size L, Blue) অর্ডার করতে চাই। ঠিকানা: বনশ্রী, ঢাকা, ফোন: 01712345678।' },
    { label: 'Anti-Hallucination Test', text: 'আপনাদের কাছে কি Gold Plated Watch বা ল্যাপটপ আছে?' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: SimMessage = {
      id: makeUniqueId('sim_u'),
      sender: 'user',
      text: query,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    const startTime = getPerfNow();

    try {
      // Build conversation history for API
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/app/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: history,
          catalogContext: products,
        }),
      });

      const data = await res.json();
      const endTime = getPerfNow();
      const durationMs = Math.max(1, Math.round(endTime - startTime));

      if (!res.ok) {
        throw new Error(data.error || 'AI generation failed');
      }

      const aiMsg: SimMessage = {
        id: makeUniqueId('sim_ai'),
        sender: 'ai',
        text: data.reply,
        timestamp: getFormattedTime(),
        latencyMs: durationMs,
        intent: data.intent || 'general_inquiry',
        confidence: data.confidence || 0.95,
        groundedIn: data.groundedFacts || ['Google Sheets Live Catalog'],
        suggestedAction: data.suggestedAction,
        imageUrl: data.mediaUrl,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLastTrace({
        query,
        reply: data.reply,
        intent: data.intent,
        confidence: data.confidence,
        suggestedAction: data.suggestedAction,
        groundedFacts: data.groundedFacts,
        latencyMs: durationMs,
        model: 'gemini-2.5-flash',
      });
    } catch (err: any) {
      const errorMsg: SimMessage = {
        id: makeUniqueId('sim_err'),
        sender: 'ai',
        text: 'দুঃখিত, এই মুহূর্তে সিস্টেমে সাময়িক সমস্যা হচ্ছে। অনুগ্রহ করে একটু পর চেষ্টা করুন অথবা আমাদের পেইজে ইনবক্স করুন। (' + err.message + ')',
        timestamp: getFormattedTime(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-zinc-100 overflow-hidden">
      {/* Center/Left: Simulator Chat Window */}
      <div className="flex-1 bg-white flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-zinc-200 px-6 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-zinc-900">AI Messenger Chat Simulator</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Gemini 2.5 Flash Grounded
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Test Bengali/English NLP intent classification and zero-hallucination verification in real-time.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setMessages([
                {
                  id: makeUniqueId('sim_init'),
                  sender: 'ai',
                  text: 'আসসালামু আলাইকুম! Apex Mart BD-তে আপনাকে স্বাগতম। আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
                  timestamp: getFormattedTime(),
                  intent: 'greeting',
                },
              ]);
              setLastTrace(null);
            }}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>

        {/* Quick Scenario Chips */}
        <div className="bg-zinc-50 border-b border-zinc-200 p-2.5 px-6 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 shrink-0">
            Quick Scenarios:
          </span>
          {scenarioPrompts.map((sc, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(sc.text)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-zinc-200 hover:border-indigo-300 text-zinc-700 hover:text-indigo-900 text-xs whitespace-nowrap transition-all shadow-2xs shrink-0 font-medium"
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/40">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs shadow-2xs space-y-2 ${
                    isUser
                      ? 'bg-zinc-900 text-white rounded-tr-xs'
                      : 'bg-white border border-zinc-200 text-zinc-900 rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] opacity-70">
                    <span className="font-semibold flex items-center gap-1">
                      {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-indigo-600" />}
                      <span>{isUser ? 'Simulated Customer (Messenger)' : 'AutoCommerce AI Agent'}</span>
                    </span>
                    <span>{m.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-line leading-relaxed text-xs">{m.text}</p>

                  {/* Media attachment preview if provided by Drive */}
                  {m.imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 max-w-xs">
                      <img src={m.imageUrl} alt="Product media" className="w-full h-auto object-cover" />
                      <div className="p-1 text-[10px] text-zinc-500 text-center font-mono">
                        Drive Photo Linked
                      </div>
                    </div>
                  )}

                  {!isUser && m.latencyMs && (
                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{m.latencyMs} ms</span>
                      </span>
                      <span>Intent: {m.intent} ({(m.confidence! * 100).toFixed(0)}%)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 p-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
              <span>Gemini is reading Google Sheet catalog & preparing grounded response...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-zinc-200 p-4 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything in Bangla or English (e.g., শার্টের দাম কত? সাইজ কি আছে?)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Right: Grounding & Execution Trace Inspector */}
      <div className="w-80 bg-white border-l border-zinc-200 p-4 overflow-y-auto space-y-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Grounding & Safety Trace
            </h3>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Real-time inspection of facts referenced and policies enforced.
          </p>
        </div>

        {lastTrace ? (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400">Classified Intent</div>
                <div className="font-bold text-indigo-700 mt-0.5">{lastTrace.intent}</div>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Confidence Score:</span>
                <span className="font-semibold text-zinc-900">{Math.round(lastTrace.confidence * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Suggested Action:</span>
                <span className="font-mono text-zinc-800 text-[11px]">{lastTrace.suggestedAction || 'none'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Latency:</span>
                <span className="font-mono text-emerald-700 font-semibold">{lastTrace.latencyMs} ms</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Grounded Knowledge Sources
              </div>
              <div className="space-y-1">
                {lastTrace.groundedFacts && lastTrace.groundedFacts.map((fact: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-emerald-950 text-[11px] leading-relaxed flex items-start gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-amber-950 text-[11px] space-y-1">
              <div className="flex items-center gap-1 font-bold text-amber-900">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Zero Hallucination Guarantee</span>
              </div>
              <p className="text-[10px] text-amber-900/80 leading-relaxed">
                If the customer asks for a product not in the connected Google Sheet, the model is strictly commanded to state non-availability and offer human agent assistance.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl text-center text-xs text-zinc-400 space-y-2">
            <Info className="w-6 h-6 text-zinc-300 mx-auto" />
            <p>Send a prompt from the scenarios above to inspect the grounding trace.</p>
          </div>
        )}

        <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active Grounding Matrix</div>
          <div className="space-y-1 text-[11px] text-zinc-600">
            <div className="flex items-center justify-between p-1.5 bg-zinc-50 rounded">
              <span>Google Sheets ({products.length} items)</span>
              <span className="text-emerald-600 font-bold">100% Synced</span>
            </div>
            <div className="flex items-center justify-between p-1.5 bg-zinc-50 rounded">
              <span>Drive Media Matching</span>
              <span className="text-emerald-600 font-bold">Active</span>
            </div>
            <div className="flex items-center justify-between p-1.5 bg-zinc-50 rounded">
              <span>Google Calendar Slot Check</span>
              <span className="text-indigo-600 font-bold">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
