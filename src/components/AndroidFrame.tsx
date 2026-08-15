import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Maximize2, RotateCw } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onHomePress?: () => void;
  onBackPress?: () => void;
  isLandscape?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onHomePress,
  onBackPress,
  isLandscape: initialLandscape = false,
}) => {
  const [time, setTime] = useState('1:50');
  const [deviceMode, setDeviceMode] = useState<'phone' | 'fluid'>('phone');
  const [landscape, setLandscape] = useState(initialLandscape);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 overflow-x-hidden select-none">
      {/* Top Utility Ribbon */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 px-3 mb-2 text-slate-300 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400">Apd Web</span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">Mobile IDE & APK Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLandscape(!landscape)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 transition"
            title="Toggle Orientation"
          >
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs">{landscape ? 'Landscape' : 'Portrait'}</span>
          </button>
          <button
            onClick={() => setDeviceMode(deviceMode === 'phone' ? 'fluid' : 'phone')}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 transition"
            title="Toggle Device Frame"
          >
            {deviceMode === 'phone' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs">Expanded View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs">Phone Shell</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div
        className={`relative transition-all duration-300 flex flex-col bg-slate-950 shadow-2xl overflow-hidden ${
          deviceMode === 'phone'
            ? landscape
              ? 'w-[780px] h-[480px] rounded-[36px] border-[10px] border-slate-800 ring-1 ring-slate-700/50'
              : 'w-full max-w-[420px] h-[860px] rounded-[40px] border-[10px] border-slate-800 ring-1 ring-slate-700/50'
            : 'w-full max-w-5xl min-h-[85vh] rounded-2xl border border-slate-800'
        }`}
      >
        {/* Android Status Bar */}
        <div className="w-full bg-slate-950 text-slate-300 px-6 py-2.5 flex items-center justify-between text-xs font-medium tracking-tight select-none border-b border-slate-900 z-30">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{time}</span>
            <span className="text-[10px] text-slate-500">●</span>
          </div>

          {/* Camera Notch simulation for phone frame */}
          {deviceMode === 'phone' && !landscape && (
            <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800" />
          )}

          <div className="flex items-center gap-2 text-slate-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-mono">90%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Active Screen Content */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden bg-slate-900 text-slate-100 relative">
          {children}
        </div>

        {/* Android Bottom Navigation Bar */}
        <nav aria-label="System navigation" className="w-full bg-slate-950 text-slate-400 py-2.5 px-10 flex items-center justify-around border-t border-slate-800/80 z-30 select-none">
          <button
            onClick={onHomePress}
            className="p-1 hover:text-white transition active:scale-90"
            title="Overview"
          >
            <div className="flex gap-[3px] items-center h-4">
              <div className="w-1 h-3.5 bg-current rounded-sm" />
              <div className="w-1 h-3.5 bg-current rounded-sm" />
              <div className="w-1 h-3.5 bg-current rounded-sm" />
            </div>
          </button>
          <button
            onClick={onHomePress}
            className="p-1 hover:text-white transition active:scale-90"
            title="Home"
          >
            <div className="w-4 h-4 rounded-full border-2 border-current" />
          </button>
          <button
            onClick={onBackPress}
            className="p-1 hover:text-white transition active:scale-90"
            title="Back"
          >
            <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[10px] border-r-current" />
          </button>
        </nav>
      </div>
    </div>
  );
};
