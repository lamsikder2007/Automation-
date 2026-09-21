'use client';

import React, { useState } from 'react';
import {
  GitFork,
  Play,
  Save,
  CheckCircle2,
  Plus,
  Zap,
  Bot,
  Sheet,
  HardDrive,
  Calendar,
  Layers,
  ArrowRight,
  Sliders,
  Sparkles,
  RefreshCw,
  Clock,
  UserCheck,
  Send,
  MessageSquare,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Tag,
  HelpCircle,
} from 'lucide-react';
import { Workflow, WorkflowNode, WorkflowEdge, NodeType, WorkflowExecutionLog } from '@/lib/types';
import { initialWorkflows, initialExecutionLogs } from '@/lib/mockData';

interface WorkflowBuilderViewProps {
  onOpenSimulator: () => void;
}

export const WorkflowBuilderView: React.FC<WorkflowBuilderViewProps> = ({ onOpenSimulator }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>(initialWorkflows[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialWorkflows[0].nodes[0].id);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedActiveNodeId, setSimulatedActiveNodeId] = useState<string | null>(null);
  const [executionLogs, setExecutionLogs] = useState<WorkflowExecutionLog[]>(initialExecutionLogs);
  const [testInput, setTestInput] = useState('ভাইয়া Premium Oxford Shirt এর দাম কত এবং স্টক আছে?');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const activeWf = workflows.find((w) => w.id === activeWorkflowId) || workflows[0];
  const selectedNode = activeWf.nodes.find((n) => n.id === selectedNodeId);

  const nodeLibrary: { type: NodeType; name: string; category: string; icon: any; desc: string }[] = [
    { type: 'trigger_messenger', name: 'Messenger Message', category: 'Triggers', icon: MessageSquare, desc: 'Fires when customer sends message' },
    { type: 'ai_intent_classifier', name: 'Intent Classifier', category: 'AI Intelligence', icon: Sparkles, desc: 'Identifies Bangla / English intent' },
    { type: 'ai_grounded_agent', name: 'Grounded AI Agent', category: 'AI Intelligence', icon: Bot, desc: 'Zero-hallucination grounded reply' },
    { type: 'data_google_sheets', name: 'Google Sheets Lookup', category: 'Workspace Data', icon: Sheet, desc: 'Searches live inventory row' },
    { type: 'data_google_drive', name: 'Google Drive Media', category: 'Workspace Data', icon: HardDrive, desc: 'Resolves SKU photo assets' },
    { type: 'data_calendar_check', name: 'Calendar Availability', category: 'Workspace Data', icon: Calendar, desc: 'Checks Google Calendar free slots' },
    { type: 'logic_condition', name: 'IF / ELSE Condition', category: 'Logic Routing', icon: GitFork, desc: 'Routes by confidence or intent' },
    { type: 'action_messenger_reply', name: 'Send Messenger Reply', category: 'Actions', icon: Send, desc: 'Sends message back to customer' },
    { type: 'action_calendar_book', name: 'Create Calendar Event', category: 'Actions', icon: Calendar, desc: 'Books callback appointment' },
    { type: 'action_create_order', name: 'Create Order Record', category: 'Actions', icon: Zap, desc: 'Generates confirmed e-commerce order' },
    { type: 'action_human_handoff', name: 'Human Agent Handoff', category: 'Actions', icon: UserCheck, desc: 'Escalates to live representative' },
  ];

  const handleToggleActive = () => {
    const updated = workflows.map((w) => (w.id === activeWorkflowId ? { ...w, isActive: !w.isActive } : w));
    setWorkflows(updated);
    setStatusNotification(`Workflow "${activeWf.name}" is now ${!activeWf.isActive ? 'ACTIVE' : 'PAUSED'}.`);
    setTimeout(() => setStatusNotification(null), 3000);
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setStatusNotification('Running live node execution simulation...');

    // Walk through nodes in order
    for (let i = 0; i < activeWf.nodes.length; i++) {
      setSimulatedActiveNodeId(activeWf.nodes[i].id);
      await new Promise((r) => setTimeout(r, 450));
    }

    setSimulatedActiveNodeId(null);
    setIsSimulating(false);

    const newLog: WorkflowExecutionLog = {
      id: 'exec_' + Date.now(),
      workflowId: activeWf.id,
      triggerSource: 'Visual Canvas Test Run',
      customerInput: testInput,
      status: 'success',
      startedAt: new Date().toISOString(),
      completedAt: new Date(Date.now() + 850).toISOString(),
      steps: activeWf.nodes.map((n, idx) => ({
        nodeId: n.id,
        nodeName: n.name,
        status: 'success',
        output: `Step executed successfully. Node [${n.name}] produced output.`,
        durationMs: Math.floor(Math.random() * 200) + 40,
      })),
    };

    setExecutionLogs([newLog, ...executionLogs]);
    setStatusNotification(`Workflow execution succeeded! ${activeWf.nodes.length} nodes traversed.`);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const getNodeColor = (type: NodeType) => {
    if (type.startsWith('trigger_')) return 'border-blue-300 bg-blue-50/70 text-blue-900';
    if (type.startsWith('ai_')) return 'border-indigo-300 bg-indigo-50/70 text-indigo-900';
    if (type.startsWith('data_')) return 'border-emerald-300 bg-emerald-50/70 text-emerald-900';
    if (type.startsWith('logic_')) return 'border-amber-300 bg-amber-50/70 text-amber-900';
    return 'border-purple-300 bg-purple-50/70 text-purple-900';
  };

  const getNodeIcon = (type: NodeType) => {
    if (type.startsWith('trigger_')) return MessageSquare;
    if (type.startsWith('ai_')) return Bot;
    if (type === 'data_google_sheets') return Sheet;
    if (type === 'data_google_drive') return HardDrive;
    if (type === 'data_calendar_check' || type === 'action_calendar_book') return Calendar;
    if (type.startsWith('logic_')) return GitFork;
    if (type === 'action_human_handoff') return UserCheck;
    return Zap;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-zinc-100 overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 bg-white border-b border-zinc-200 px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <GitFork className="w-4 h-4" />
            </span>
            {/* Template Selector */}
            <select
              value={activeWorkflowId}
              onChange={(e) => {
                setActiveWorkflowId(e.target.value);
                const nextWf = workflows.find((w) => w.id === e.target.value);
                if (nextWf && nextWf.nodes.length > 0) {
                  setSelectedNodeId(nextWf.nodes[0].id);
                }
              }}
              aria-label="Active Workflow Template"
              className="font-bold text-xs sm:text-sm bg-transparent border-0 text-zinc-900 cursor-pointer focus:ring-0"
            >
              {workflows.map((wf) => (
                <option key={wf.id} value={wf.id}>
                  {wf.name} (v{wf.version})
                </option>
              ))}
            </select>
          </div>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeWf.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'
            }`}
          >
            {activeWf.isActive ? 'Live Automation Active' : 'Paused'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg p-0.5 text-xs text-zinc-600">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
              className="p-1 hover:bg-zinc-200 rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px]">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1 hover:bg-zinc-200 rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-zinc-200 rounded text-zinc-400"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleToggleActive}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeWf.isActive
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {activeWf.isActive ? 'Pause Workflow' : 'Activate Live'}
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-60"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating...' : 'Test Execution'}</span>
          </button>
        </div>
      </div>

      {statusNotification && (
        <div className="bg-indigo-50 border-b border-indigo-200 text-indigo-900 px-4 py-1.5 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Node Palette */}
        <div className="w-60 bg-white border-r border-zinc-200 flex flex-col p-3 overflow-y-auto space-y-4 shrink-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Ready-Made Templates
            </div>
            <div className="space-y-1">
              {workflows.map((wf) => (
                <button
                  key={wf.id}
                  onClick={() => {
                    setActiveWorkflowId(wf.id);
                    setSelectedNodeId(wf.nodes[0]?.id);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                    wf.id === activeWorkflowId
                      ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200'
                      : 'hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <div className="truncate">{wf.name}</div>
                  <div className="text-[10px] text-zinc-400 font-normal">{wf.nodes.length} nodes</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Available Node Library
            </div>
            <div className="space-y-1.5">
              {nodeLibrary.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-2 rounded-lg border border-zinc-200 bg-zinc-50/60 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all cursor-grab flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-zinc-800 truncate">{item.name}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{item.category}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Interactive Node Canvas */}
        <div className="flex-1 relative overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] p-8">
          <div
            className="relative min-w-[1300px] min-h-[600px] transition-transform origin-top-left"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
              </defs>
              {activeWf.edges.map((edge) => {
                const sourceNode = activeWf.nodes.find((n) => n.id === edge.source);
                const targetNode = activeWf.nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const startX = sourceNode.x + 220;
                const startY = sourceNode.y + 40;
                const endX = targetNode.x;
                const endY = targetNode.y + 40;
                const midX = (startX + endX) / 2;

                return (
                  <g key={edge.id}>
                    <path
                      d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeDasharray={isSimulating ? '4 4' : undefined}
                      className={isSimulating ? 'animate-pulse' : ''}
                      markerEnd="url(#arrow)"
                    />
                    {edge.label && (
                      <text
                        x={midX}
                        y={(startY + endY) / 2 - 8}
                        fill="#475569"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="bg-white px-1"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Nodes Rendered on Canvas */}
            {activeWf.nodes.map((node) => {
              const Icon = getNodeIcon(node.type);
              const isSelected = selectedNodeId === node.id;
              const isRunning = simulatedActiveNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  className={`absolute w-56 rounded-xl border p-3.5 bg-white shadow-xs cursor-pointer transition-all select-none ${
                    isRunning
                      ? 'ring-4 ring-indigo-500 ring-offset-2 scale-105 z-20 border-indigo-600'
                      : isSelected
                      ? 'ring-2 ring-indigo-500 border-indigo-400 z-10 shadow-md'
                      : 'border-zinc-200 hover:border-zinc-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg border ${getNodeColor(node.type)}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-bold text-zinc-900 truncate max-w-[120px]">
                        {node.name}
                      </span>
                    </div>
                    {isRunning && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-2">
                    {node.description}
                  </p>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="font-mono">{node.type}</span>
                    <span className="text-indigo-600 font-semibold">Configured</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Test Bar / Mini Simulator at bottom */}
          <div className="fixed bottom-4 left-68 right-80 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-xl p-3 shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase text-zinc-400">Simulation Customer Message</div>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Type customer message to simulate flow..."
                className="w-full text-xs text-zinc-800 bg-transparent border-0 focus:ring-0 p-0 font-medium"
              />
            </div>
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shrink-0 shadow-xs"
            >
              {isSimulating ? 'Traversing...' : 'Simulate Run'}
            </button>
          </div>
        </div>

        {/* Right: Node Configuration Inspector */}
        <div className="w-76 bg-white border-l border-zinc-200 flex flex-col p-4 overflow-y-auto space-y-4 shrink-0">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-zinc-900">Node Configuration</h3>
                </div>
                <p className="text-[11px] text-zinc-500">Fine-tune logic & prompt parameters</p>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-2 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Node Title</div>
                  <div className="font-bold text-zinc-900 mt-0.5">{selectedNode.name}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Node Type</div>
                  <div className="font-mono text-[11px] text-indigo-700">{selectedNode.type}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-400">Description</div>
                  <div className="text-zinc-600 mt-0.5">{selectedNode.description}</div>
                </div>
              </div>

              {/* Node Config Attributes */}
              <div className="space-y-3 text-xs">
                <div className="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">
                  Parameters & Rules
                </div>

                {selectedNode.type.startsWith('ai_') && (
                  <>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700 block mb-1">AI Model</label>
                      <input
                        type="text"
                        disabled
                        value="gemini-2.5-flash"
                        className="w-full px-2.5 py-1.5 bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700 block mb-1">Strict Grounding</label>
                      <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Zero-hallucination enabled</span>
                      </div>
                    </div>
                  </>
                )}

                {selectedNode.type === 'data_google_sheets' && (
                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">Target Worksheet</label>
                    <input
                      type="text"
                      disabled
                      value="Products_Live (Range A1:I100)"
                      className="w-full px-2.5 py-1.5 bg-zinc-100 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-700"
                    />
                  </div>
                )}

                {selectedNode.type === 'data_calendar_check' && (
                  <div>
                    <label className="text-[11px] font-bold text-zinc-700 block mb-1">Calendar & Timezone</label>
                    <input
                      type="text"
                      disabled
                      value="Primary Calendar (Asia/Dhaka GMT+6)"
                      className="w-full px-2.5 py-1.5 bg-zinc-100 border border-zinc-200 rounded-lg text-xs text-zinc-700"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-zinc-700 block mb-1">Retry on Failure</label>
                  <select className="w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-700" aria-label="Retry on Failure">
                    <option>Max 3 Retries (Exponential backoff)</option>
                    <option>Fail Fast & Notify Agent</option>
                  </select>
                </div>
              </div>

              {/* Execution Steps Log for this Node */}
              <div className="pt-3 border-t border-zinc-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                  <span>Recent Traversal Log</span>
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="bg-zinc-900 text-zinc-200 p-2.5 rounded-lg text-[10px] font-mono space-y-1">
                  <div className="text-emerald-400">STATUS: 200 SUCCESS</div>
                  <div>LATENCY: 85ms</div>
                  <div>PAYLOAD: Verified Ground Truth</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-400 text-xs">
              Select a node on the canvas to inspect its configuration and logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
