import React, { useState } from 'react';
import {
  Search,
  Trash2,
  Send,
  Terminal,
  Layers,
  Activity,
  Database,
  FileCode,
  Info as InfoIcon,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { ConsoleMessage, NetworkRequest, Project } from '../types';

interface DevConsoleProps {
  logs: ConsoleMessage[];
  networkRequests: NetworkRequest[];
  project: Project;
  onClearLogs: () => void;
  onSendCommand: (command: string) => void;
  isEmbedded?: boolean;
}

type TabType = 'Console' | 'Elements' | 'Network' | 'Resources' | 'Sources' | 'Info';
type FilterType = 'all' | 'log' | 'warn' | 'error' | 'info';

export const DevConsole: React.FC<DevConsoleProps> = ({
  logs,
  networkRequests,
  project,
  onClearLogs,
  onSendCommand,
  isEmbedded = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('Console');
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [commandInput, setCommandInput] = useState('');
  const [activeSourceFile, setActiveSourceFile] = useState(project.files[0]?.name || 'index.html');

  const filteredLogs = logs.filter((log) => {
    if (filter !== 'all' && log.type !== filter) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    onSendCommand(commandInput.trim());
    setCommandInput('');
  };

  const getLogTypeColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400 bg-red-950/20 border-red-900/30';
      case 'warn':
        return 'text-amber-400 bg-amber-950/20 border-amber-900/30';
      case 'info':
        return 'text-sky-400 bg-sky-950/20 border-sky-900/30';
      default:
        return 'text-slate-200 bg-slate-900/40 border-slate-800';
    }
  };

  const tabs: TabType[] = ['Console', 'Elements', 'Network', 'Resources', 'Sources', 'Info'];

  return (
    <div className="flex-1 flex flex-col bg-[#0b0f17] text-slate-200 min-h-0 select-none border-t border-slate-800">
      {/* Top Tabs Ribbon */}
      <div className="bg-slate-900/90 px-2 flex items-center border-b border-slate-800 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs font-semibold whitespace-nowrap transition border-b-2 ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Console */}
      {activeTab === 'Console' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Filter & Search Bar */}
          <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <div className="relative flex items-center bg-slate-800/80 rounded-md px-2 py-1 text-xs">
                <Search className="w-3 h-3 text-slate-400 mr-1.5" />
                <input
                  type="text"
                  placeholder="Filter"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-xs text-white w-16 focus:w-28 transition-all"
                />
              </div>

              {(['all', 'log', 'warn', 'error', 'info'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded capitalize transition ${
                    filter === f
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={onClearLogs}
              className="p-1 text-slate-400 hover:text-red-400 rounded transition"
              title="Clear Console"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Logs List Area */}
          <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                Console is empty. Run actions in preview to inspect logs.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`px-2 py-1.5 rounded border text-[11px] flex items-start justify-between gap-2 font-mono ${getLogTypeColor(
                    log.type
                  )}`}
                >
                  <div className="flex items-start gap-1.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase shrink-0 opacity-70">
                      [{log.type}]
                    </span>
                    <span className="break-all whitespace-pre-wrap">{log.message}</span>
                  </div>

                  <span className="text-[10px] text-slate-400 hover:text-slate-200 shrink-0 font-mono underline decoration-dotted">
                    {log.source || 'index.js:1'}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Command Evaluation Input Line */}
          <form
            onSubmit={handleCommandSubmit}
            className="border-t border-slate-800 bg-slate-900/90 px-3 py-1.5 flex items-center gap-2"
          >
            <span className="text-emerald-400 font-mono font-bold text-xs">{'>'}</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Execute JavaScript command..."
              className="flex-1 bg-transparent text-xs font-mono text-white outline-none placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!commandInput.trim()}
              className="p-1 text-emerald-400 hover:text-emerald-300 disabled:opacity-30"
              title="Execute"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Tab: Elements */}
      {activeTab === 'Elements' && (
        <div className="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-1">
          <div className="text-slate-400 text-[11px] mb-2 font-semibold">DOM Elements Tree:</div>
          <div className="pl-1 text-sky-400">&lt;!DOCTYPE html&gt;</div>
          <div className="pl-2 text-amber-400">&lt;html lang="en"&gt;</div>
          <div className="pl-4 text-purple-400">&lt;head&gt; ... &lt;/head&gt;</div>
          <div className="pl-4 text-amber-400">&lt;body&gt;</div>
          <div className="pl-6 text-emerald-400">&lt;div class="container"&gt;</div>
          <div className="pl-8 text-sky-300">&lt;header class="hero"&gt; ... &lt;/header&gt;</div>
          <div className="pl-8 text-sky-300">&lt;main class="card-grid"&gt; ... &lt;/main&gt;</div>
          <div className="pl-8 text-sky-300">&lt;footer&gt; &copy; 2026 Apd Web &lt;/footer&gt;</div>
          <div className="pl-6 text-emerald-400">&lt;/div&gt;</div>
          <div className="pl-4 text-amber-400">&lt;/body&gt;</div>
          <div className="pl-2 text-amber-400">&lt;/html&gt;</div>
        </div>
      )}

      {/* Tab: Network */}
      {activeTab === 'Network' && (
        <div className="flex-1 overflow-y-auto p-2">
          <table className="w-full text-[11px] font-mono text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-1 font-medium">Name</th>
                <th className="pb-1 font-medium">Status</th>
                <th className="pb-1 font-medium">Type</th>
                <th className="pb-1 font-medium">Size</th>
                <th className="pb-1 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {networkRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40">
                  <td className="py-1.5 text-slate-200 truncate max-w-[120px]">{req.url}</td>
                  <td className="py-1.5">
                    <span className="text-emerald-400 font-bold">{req.status}</span>
                  </td>
                  <td className="py-1.5 text-slate-400">{req.type}</td>
                  <td className="py-1.5 text-slate-400">{req.size}</td>
                  <td className="py-1.5 text-slate-400 text-right">{req.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Resources */}
      {activeTab === 'Resources' && (
        <div className="flex-1 p-3 text-xs overflow-y-auto space-y-3 font-mono">
          <div>
            <h4 className="text-emerald-400 font-bold text-[11px] uppercase mb-1">Local Storage</h4>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300">
              <code>project_session: "apdweb_active"</code>
            </div>
          </div>
          <div>
            <h4 className="text-sky-400 font-bold text-[11px] uppercase mb-1">Cookies</h4>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-400">
              (No HTTP cookies set)
            </div>
          </div>
          <div>
            <h4 className="text-purple-400 font-bold text-[11px] uppercase mb-1">Cache Storage</h4>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300">
              <code>assets/www/index.html (Offline Cache: Enabled)</code>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sources */}
      {activeTab === 'Sources' && (
        <div className="flex-1 flex min-h-0 text-xs">
          <div className="w-28 bg-slate-900 border-r border-slate-800 p-2 overflow-y-auto space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Project</div>
            {project.files.map((file) => (
              <button
                key={file.id}
                onClick={() => setActiveSourceFile(file.name)}
                className={`w-full text-left truncate px-2 py-1 rounded text-[11px] font-mono ${
                  activeSourceFile === file.name
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {file.name}
              </button>
            ))}
          </div>
          <div className="flex-1 p-3 overflow-auto font-mono text-[11px] bg-[#090d13] text-slate-300 whitespace-pre">
            {project.files.find((f) => f.name === activeSourceFile)?.content || '// File not found'}
          </div>
        </div>
      )}

      {/* Tab: Info */}
      {activeTab === 'Info' && (
        <div className="flex-1 p-3 text-xs overflow-y-auto space-y-2 font-mono">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5 text-slate-300">
            <div><span className="text-slate-500">App Name:</span> Apd Web</div>
            <div><span className="text-slate-500">Engine:</span> Android WebView (Chromium)</div>
            <div><span className="text-slate-500">PHP Server:</span> {project.settings.phpEnvironment} (Port {project.settings.phpServerPort})</div>
            <div><span className="text-slate-500">Screen Mode:</span> {project.settings.screenRotation}</div>
            <div><span className="text-slate-500">Viewport:</span> 390 x 844 (DPR: 3.0)</div>
            <div><span className="text-slate-500">Camera / Mic:</span> {project.settings.moreOptions.allowUsingCamera ? 'Allowed' : 'Disabled'}</div>
          </div>
        </div>
      )}
    </div>
  );
};
