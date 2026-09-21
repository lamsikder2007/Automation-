'use client';

import React from 'react';
import {
  Store,
  ChevronDown,
  Bot,
  MessageSquare,
  Sparkles,
  Layers,
  Bell,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { GoogleAuthButton } from './GoogleAuthButton';
import { UserRole, Workspace } from '@/lib/types';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentWorkspace: Workspace;
  allWorkspaces: Workspace[];
  onSelectWorkspace: (ws: Workspace) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenSimulator: () => void;
  onOpenOnboarding: () => void;
  googleToken: string | null;
  googleUser: User | null;
  onTokenChange: (token: string | null, user: User | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentWorkspace,
  allWorkspaces,
  onSelectWorkspace,
  userRole,
  onSelectRole,
  onOpenSimulator,
  onOpenOnboarding,
  googleToken,
  googleUser,
  onTokenChange,
}) => {
  return (
    <header className="h-16 border-b border-zinc-200 bg-white sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Workspace & Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-zinc-900">AutoCommerce</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-200">
                SaaS BD
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Gemini 2.5 Flash Engine</span>
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-zinc-200 mx-1 hidden md:block"></div>

        {/* Workspace Switcher */}
        <div className="relative group hidden sm:block">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-800 transition-colors">
            <Store className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-semibold">{currentWorkspace.name}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>
          <div className="absolute left-0 mt-1 w-56 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-50">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-400">
              Switch Store Workspace
            </div>
            {allWorkspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => onSelectWorkspace(ws)}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-zinc-50 ${
                  ws.id === currentWorkspace.id ? 'font-semibold text-indigo-600 bg-indigo-50/50' : 'text-zinc-700'
                }`}
              >
                <span>{ws.name}</span>
                {ws.id === currentWorkspace.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle: Live Connection Status Chips */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Facebook Page: <strong>Apex Mart BD (48.6k)</strong></span>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border ${
          googleToken || googleUser ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${googleToken || googleUser ? 'bg-emerald-600' : 'bg-zinc-400'}`}></span>
          <span>Google Sheets & Drive: <strong>{googleToken || googleUser ? 'Connected' : 'Workspace Ready'}</strong></span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Role Selector */}
        <select
          value={userRole}
          onChange={(e) => onSelectRole(e.target.value as UserRole)}
          aria-label="Select User Role"
          className="text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer hidden md:block"
        >
          <option value="owner">Role: Owner</option>
          <option value="admin">Role: Admin</option>
          <option value="agent">Role: Support Agent</option>
          <option value="analyst">Role: Analyst</option>
        </select>

        {/* Google Workspace Auth */}
        <GoogleAuthButton onTokenChange={onTokenChange} />

        {/* Live Simulator Button */}
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Test Messenger AI</span>
          <span className="sm:hidden">Test</span>
        </button>

        {/* Onboarding Wizard trigger */}
        <button
          onClick={onOpenOnboarding}
          title="Open Store Onboarding Wizard"
          className="p-1.5 text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
        </button>
      </div>
    </header>
  );
};
