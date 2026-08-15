import React, { useState } from 'react';
import { ChevronLeft, MoreVertical, Server, CheckCircle2, Play, Square, Settings } from 'lucide-react';
import { Project } from '../types';

interface PhpServerScreenProps {
  project: Project;
  onBack: () => void;
  onUpdateSettings: (newSettings: Project['settings']) => void;
}

export const PhpServerScreen: React.FC<PhpServerScreenProps> = ({
  project,
  onBack,
  onUpdateSettings,
}) => {
  const [isRunning, setIsRunning] = useState(true);
  const [port, setPort] = useState(project.settings.phpServerPort || 8000);
  const [phpEnv, setPhpEnv] = useState(project.settings.phpEnvironment || 'PHP 8.2.10');

  const handlePortChange = (delta: number) => {
    const nextPort = Math.max(1024, Math.min(65535, port + delta));
    setPort(nextPort);
    onUpdateSettings({
      ...project.settings,
      phpServerPort: nextPort,
    });
  };

  const handleEnvChange = (val: string) => {
    setPhpEnv(val);
    onUpdateSettings({
      ...project.settings,
      phpEnvironment: val,
    });
  };

  const handleToggleServer = (start: boolean) => {
    setIsRunning(start);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-0 select-none">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition"
            title="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-base font-bold text-white">PHP Server</h1>
        </div>

        <button
          className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition"
          title="More"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {/* Server Status Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Server Status
          </div>
          <div className="flex items-center gap-2 text-sm font-bold">
            <span
              className={`w-3 h-3 rounded-full ${
                isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className={isRunning ? 'text-emerald-400' : 'text-rose-400'}>
              {isRunning ? '● Ready / Running' : '● Stopped'}
            </span>
          </div>
        </div>

        {/* Document Root Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Document Root
          </div>
          <p className="text-xs font-mono text-slate-300 break-all bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
            /storage/emulated/0/ApdWeb/projects/{project.name}
          </p>
        </div>

        {/* Port Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Port
          </div>
          <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span className="text-base font-mono font-bold text-white px-2">{port}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePortChange(-1)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition active:scale-90"
              >
                —
              </button>
              <button
                onClick={() => handlePortChange(1)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition active:scale-90"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* PHP Environment Dropdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            PHP Environment
          </div>
          <select
            value={phpEnv}
            onChange={(e) => handleEnvChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="PHP 8.2.10">PHP 8.2.10 (Latest Stable)</option>
            <option value="PHP 8.1.0">PHP 8.1.0 (Compatibility)</option>
            <option value="PHP 7.4.33">PHP 7.4.33 (Legacy)</option>
          </select>
        </div>
      </div>

      {/* Bottom Start / Stop Buttons */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
        <button
          onClick={() => handleToggleServer(true)}
          className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition ${
            isRunning
              ? 'bg-emerald-700 text-white cursor-default opacity-80'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-98 shadow-md'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>START SERVER</span>
        </button>

        <button
          onClick={() => handleToggleServer(false)}
          className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition ${
            !isRunning
              ? 'bg-rose-900/60 text-rose-300 border border-rose-800/60'
              : 'bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 border border-slate-700 active:scale-98'
          }`}
        >
          <Square className="w-4 h-4 fill-current" />
          <span>STOP SERVER</span>
        </button>
      </div>
    </div>
  );
};
