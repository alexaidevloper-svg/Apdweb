import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  RefreshCw,
  MoreVertical,
  Terminal,
  ExternalLink,
  Smartphone,
  Laptop,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Project, ConsoleMessage, NetworkRequest } from '../types';
import { compileProjectForPreview } from '../utils/phpRunner';
import { DevConsole } from './DevConsole';

interface RunPreviewScreenProps {
  project: Project;
  onBack: () => void;
  onOpenSettings: () => void;
}

export const RunPreviewScreen: React.FC<RunPreviewScreenProps> = ({
  project,
  onBack,
  onOpenSettings,
}) => {
  const [url, setUrl] = useState(`http://127.0.0.1:${project.settings.phpServerPort || 8000}/`);
  const [consoleHeight, setConsoleHeight] = useState<'half' | 'full' | 'collapsed'>('collapsed');
  const [logs, setLogs] = useState<ConsoleMessage[]>([]);
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([]);
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewHtml = compileProjectForPreview(
    project,
    project.settings.homepage || 'index.html',
    true
  );

  // Initialize network requests trace
  useEffect(() => {
    const requests: NetworkRequest[] = [
      {
        id: '1',
        url: project.settings.homepage || 'index.html',
        method: 'GET',
        status: 200,
        type: 'document',
        size: '1.4 KB',
        time: '12 ms',
        timestamp: new Date().toLocaleTimeString(),
      },
    ];

    project.files
      .filter((f) => f.name !== (project.settings.homepage || 'index.html'))
      .forEach((f, idx) => {
        requests.push({
          id: String(idx + 2),
          url: f.name,
          method: 'GET',
          status: 200,
          type: f.type,
          size: `${(f.size / 1024).toFixed(1)} KB`,
          time: `${8 + idx * 4} ms`,
          timestamp: new Date().toLocaleTimeString(),
        });
      });

    setNetworkRequests(requests);

    // Initial simulated logs
    setLogs([
      {
        id: 'log-1',
        type: 'info',
        message: `[Apd Web WebView] Server running on port ${project.settings.phpServerPort || 8000}`,
        source: 'system:1:0',
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 'log-2',
        type: 'log',
        message: 'Console message',
        source: 'inde.js:13',
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 'log-3',
        type: 'log',
        message: 'Log (eecs/sevated logs)',
        source: 'index.js:28',
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, [project.id, key]);

  // Listen to postMessage from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'apdweb_preview_console') {
        const newLog: ConsoleMessage = {
          id: 'log-' + Date.now() + '-' + Math.random(),
          type: event.data.type || 'log',
          message: event.data.message || '',
          source: event.data.lineSource || 'script.js:1',
          timestamp: event.data.timestamp || new Date().toLocaleTimeString(),
        };
        setLogs((prev) => [...prev, newLog]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const handleSendCommand = (cmd: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'APD_WEB_EVAL_COMMAND',
          code: cmd,
        },
        '*'
      );
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-0 select-none">
      {/* Top Address & Navigation Bar */}
      <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onBack}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition"
            title="Back to Files"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-200 hidden sm:inline truncate max-w-[100px]">
            {project.name}
          </span>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-300 shadow-inner">
          <span className="text-[11px] text-emerald-400 font-mono select-all truncate flex-1">
            {url}
          </span>
          <button
            onClick={handleRefresh}
            className="p-1 hover:text-white transition text-slate-400"
            title="Reload Web Page"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              setConsoleHeight((prev) => (prev === 'collapsed' ? 'half' : 'collapsed'));
            }}
            className={`p-1.5 rounded-lg border flex items-center gap-1 transition ${
              consoleHeight !== 'collapsed'
                ? 'bg-emerald-600 border-emerald-500 text-white font-semibold shadow'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title={consoleHeight !== 'collapsed' ? 'Close Console' : 'Open Console & DevTools'}
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            title="Project Settings"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {/* Live WebView Area */}
        <div
          className={`flex-1 bg-white relative transition-all duration-200 ${
            consoleHeight === 'full' ? 'hidden' : 'block'
          }`}
          style={{
            transform: project.settings.moreOptions.pcMode ? 'scale(0.95)' : 'none',
          }}
        >
          <iframe
            key={key}
            ref={iframeRef}
            srcDoc={previewHtml}
            title="Apd Web Android WebView"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
            className="w-full h-full border-none"
          />
        </div>

        {/* Developer Console Drawer (Screen 6 & 10) */}
        {consoleHeight !== 'collapsed' && (
          <div
            className={`flex flex-col transition-all duration-200 z-10 ${
              consoleHeight === 'full' ? 'h-full' : 'h-[46%]'
            }`}
          >
            <DevConsole
              logs={logs}
              networkRequests={networkRequests}
              project={project}
              onClearLogs={handleClearLogs}
              onSendCommand={handleSendCommand}
              isEmbedded={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
