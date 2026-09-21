'use client';

import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Bot,
  UserCheck,
  Send,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Tag,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { ConversationItem, MessageItem } from '@/lib/types';

interface UnifiedInboxViewProps {
  conversations: ConversationItem[];
  onUpdateConversations: (conversations: ConversationItem[]) => void;
  onNavigateTab: (tab: any) => void;
}

export const UnifiedInboxView: React.FC<UnifiedInboxViewProps> = ({
  conversations,
  onUpdateConversations,
  onNavigateTab,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [filterMode, setFilterMode] = useState<'all' | 'ai' | 'human'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyInput, setReplyInput] = useState('');
  const [internalNoteInput, setInternalNoteInput] = useState('');

  const currentConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.customer.phone && c.customer.phone.includes(searchQuery));
    if (filterMode === 'ai') return matchesSearch && c.aiActive;
    if (filterMode === 'human') return matchesSearch && !c.aiActive;
    return matchesSearch;
  });

  const handleToggleAiStatus = () => {
    if (!currentConv) return;
    const updated = conversations.map((c) =>
      c.id === currentConv.id
        ? {
            ...c,
            aiActive: !c.aiActive,
            status: !c.aiActive ? ('active' as const) : ('waiting_human' as const),
            assignedAgent: !c.aiActive ? 'AI Automated Engine' : 'Current User (Live Agent)',
          }
        : c
    );
    onUpdateConversations(updated);
  };

  const handleSendManualReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !currentConv) return;

    const newMsg: MessageItem = {
      id: 'msg_manual_' + Date.now(),
      sender: currentConv.aiActive ? 'ai' : 'agent',
      content: replyInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = conversations.map((c) =>
      c.id === currentConv.id
        ? {
            ...c,
            lastMessage: newMsg.content,
            lastMessageTime: newMsg.timestamp,
            messages: [...c.messages, newMsg],
          }
        : c
    );

    onUpdateConversations(updated);
    setReplyInput('');
  };

  const handleQuickInsert = (text: string) => {
    setReplyInput((prev) => (prev ? prev + ' ' + text : text));
  };

  const cannedReplies = [
    'ঢাকা সিটিতে ডেলিভারি চার্জ ৬০ টাকা, ঢাকার বাইরে ১২০ টাকা।',
    'ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। পণ্য দেখে মূল্য পরিশোধ করতে পারবেন।',
    'অর্ডার কনফার্ম করতে অনুগ্রহ করে আপনার ঠিকানা ও মোবাইল নম্বর দিন।',
    'আগামীকাল বিকাল ৫টায় আমাদের কাস্টমার প্রতিনিধি কল করবে।',
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-zinc-100 overflow-hidden">
      {/* 1. Left: Conversation List */}
      <div className="w-80 bg-white border-r border-zinc-200 flex flex-col shrink-0">
        {/* Filter bar */}
        <div className="p-3 border-b border-zinc-200 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
              <Inbox className="w-4 h-4 text-indigo-600" />
              <span>Messenger Inbox</span>
            </h2>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
              Apex Mart BD
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Tab Filter */}
          <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`py-1 rounded-md text-[11px] font-medium transition-all ${
                filterMode === 'all' ? 'bg-white text-zinc-900 shadow-2xs font-semibold' : 'text-zinc-600'
              }`}
            >
              All ({conversations.length})
            </button>
            <button
              onClick={() => setFilterMode('ai')}
              className={`py-1 rounded-md text-[11px] font-medium transition-all ${
                filterMode === 'ai' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-zinc-600'
              }`}
            >
              AI Active
            </button>
            <button
              onClick={() => setFilterMode('human')}
              className={`py-1 rounded-md text-[11px] font-medium transition-all ${
                filterMode === 'human' ? 'bg-white text-amber-800 shadow-2xs font-semibold' : 'text-zinc-600'
              }`}
            >
              Human
            </button>
          </div>
        </div>

        {/* Conversation List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {filteredConversations.map((c) => {
            const isSelected = c.id === currentConv?.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedConvId(c.id)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : 'hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-zinc-900 truncate">{c.customer.name}</span>
                  <span className="text-[10px] text-zinc-400">{c.lastMessageTime}</span>
                </div>

                <p className="text-xs text-zinc-600 line-clamp-1 mb-1.5">{c.lastMessage}</p>

                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      c.aiActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {c.aiActive ? <Bot className="w-2.5 h-2.5" /> : <UserCheck className="w-2.5 h-2.5" />}
                    <span>{c.aiActive ? 'AI Handling' : 'Human Takeover'}</span>
                  </span>

                  {c.customer.ordersCount > 0 && (
                    <span className="text-[10px] text-zinc-400">
                      {c.customer.ordersCount} orders • ৳{c.customer.totalSpent}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Center: Active Message Thread */}
      <div className="flex-1 bg-white flex flex-col justify-between overflow-hidden">
        {/* Thread Header */}
        <div className="h-14 border-b border-zinc-200 px-4 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs">
              {currentConv?.customer.name.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-zinc-900">{currentConv?.customer.name}</span>
                <span className="text-[10px] text-zinc-400 font-mono">({currentConv?.customer.psid})</span>
              </div>
              <div className="text-[10px] text-zinc-500">
                Assigned: <strong className="text-zinc-700">{currentConv?.assignedAgent}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleAiStatus}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentConv?.aiActive
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {currentConv?.aiActive ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Take Over as Human</span>
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5" />
                  <span>Return to AI Automation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message Bubble Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50">
          {currentConv?.messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-lg rounded-2xl p-3.5 text-xs shadow-2xs space-y-1.5 ${
                    isCustomer
                      ? 'bg-white border border-zinc-200 text-zinc-900 rounded-tl-xs'
                      : msg.sender === 'ai'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-zinc-800 text-white rounded-tr-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] opacity-80 mb-0.5">
                    <span className="font-semibold">
                      {isCustomer
                        ? currentConv.customer.name
                        : msg.sender === 'ai'
                        ? 'Apex AI Assistant (Grounded)'
                        : 'Human Representative'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                  {/* Grounded Facts Inspection Pill (Admins & Agents only) */}
                  {msg.groundedFactsUsed && msg.groundedFactsUsed.length > 0 && (
                    <div className="pt-2 border-t border-indigo-400/40 text-[10px] space-y-0.5">
                      <div className="flex items-center gap-1 font-semibold text-indigo-100">
                        <ShieldCheck className="w-3 h-3 text-emerald-300" />
                        <span>Grounded via Google Sheets Knowledge:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 text-[9px]">
                        {msg.groundedFactsUsed.map((fact, idx) => (
                          <span key={idx} className="bg-indigo-700/60 text-white px-1.5 py-0.2 rounded">
                            ✓ {fact}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Composer */}
        <div className="border-t border-zinc-200 p-3 bg-white space-y-2">
          {/* Canned responses */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-zinc-600">
            <span className="font-bold text-[10px] uppercase text-zinc-400 shrink-0">Quick Snippets:</span>
            {cannedReplies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickInsert(reply)}
                className="px-2 py-0.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 whitespace-nowrap text-[10px] transition-colors"
              >
                {reply.substring(0, 32)}...
              </button>
            ))}
          </div>

          <form onSubmit={handleSendManualReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={
                currentConv?.aiActive
                  ? 'Type to send manual message (AI is active)...'
                  : 'Type message as human agent...'
              }
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* 3. Right: Customer Profile & Order History Panel */}
      <div className="w-76 bg-white border-l border-zinc-200 p-4 overflow-y-auto space-y-4 shrink-0">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Customer Profile
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
              {currentConv?.customer.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900">{currentConv?.customer.name}</div>
              <div className="text-[11px] text-zinc-500">Facebook Messenger User</div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-700">
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-mono">{currentConv?.customer.phone || 'Phone not captured'}</span>
          </div>

          <div className="flex items-start gap-2 text-zinc-700">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              {currentConv?.customer.address || 'Address pending confirmation'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-zinc-700">
            <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
            <span>
              {currentConv?.customer.ordersCount} Completed Orders (৳{currentConv?.customer.totalSpent})
            </span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>Customer Tags</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {currentConv?.customer.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Internal Notes */}
        <div className="pt-3 border-t border-zinc-100 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>Internal Agent Notes</span>
          </div>
          <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg text-[11px] text-amber-900 leading-relaxed">
            {currentConv?.notes || 'No notes added yet for this customer.'}
          </div>
        </div>

        {/* Quick link to Calendar Booking */}
        <div className="pt-3 border-t border-zinc-100">
          <button
            onClick={() => onNavigateTab('calendar')}
            className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-semibold text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Schedule Calendar Call</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
