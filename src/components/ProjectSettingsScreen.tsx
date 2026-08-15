import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Check } from 'lucide-react';
import { Project, ProjectSettings } from '../types';

interface ProjectSettingsScreenProps {
  project: Project;
  onBack: () => void;
  onSave: (newSettings: ProjectSettings) => void;
  onOpenMoreOptions: () => void;
}

export const ProjectSettingsScreen: React.FC<ProjectSettingsScreenProps> = ({
  project,
  onBack,
  onSave,
  onOpenMoreOptions,
}) => {
  const [settings, setSettings] = useState<ProjectSettings>({ ...project.settings });
  const [showRotationModal, setShowRotationModal] = useState(false);
  const [showHomepageModal, setShowHomepageModal] = useState(false);
  const [showPhpEnvModal, setShowPhpEnvModal] = useState(false);
  const [showCarryPhpModal, setShowCarryPhpModal] = useState(false);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, titleBarBgColor: e.target.value }));
  };

  const handleSaveAndExit = () => {
    onSave(settings);
    onBack();
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
          <h1 className="text-base font-bold text-white">Project Settings</h1>
        </div>

        <button
          className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition"
          title="More"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Settings List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {/* Title Bar Background Color */}
        <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">Title Bar Background Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.titleBarBgColor}
              onChange={handleColorChange}
              className="w-7 h-7 rounded-lg border border-slate-700 bg-transparent cursor-pointer overflow-hidden"
            />
            <span className="text-xs font-mono text-slate-400">{settings.titleBarBgColor}</span>
          </div>
        </div>

        {/* Screen Rotation Method */}
        <div
          onClick={() => setShowRotationModal(true)}
          className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
        >
          <div>
            <div className="text-xs font-semibold text-slate-200">Screen Rotation Method</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">{settings.screenRotation}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Homepage */}
        <div
          onClick={() => setShowHomepageModal(true)}
          className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
        >
          <div>
            <div className="text-xs font-semibold text-slate-200">Homepage</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">{settings.homepage}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* PHP Environment */}
        <div
          onClick={() => setShowPhpEnvModal(true)}
          className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
        >
          <div>
            <div className="text-xs font-semibold text-slate-200">PHP Environment</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">{settings.phpEnvironment}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Carry PHP Environment */}
        <div
          onClick={() => setShowCarryPhpModal(true)}
          className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
        >
          <div>
            <div className="text-xs font-semibold text-slate-200">Carry PHP Environment</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">{settings.carryPhpEnvironment}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* PHP Server Port */}
        <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-200">PHP Server Port</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">{settings.phpServerPort}</div>
          </div>
          <input
            type="number"
            value={settings.phpServerPort}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, phpServerPort: Number(e.target.value) || 8000 }))
            }
            className="w-20 bg-slate-950 border border-slate-800 text-xs font-mono text-white px-2 py-1 rounded-lg text-right"
          />
        </div>

        {/* Splash Page */}
        <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-200">Splash Page</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">{settings.splashPage}</div>
          </div>
          <input
            type="text"
            value={settings.splashPage}
            onChange={(e) => setSettings((prev) => ({ ...prev, splashPage: e.target.value }))}
            className="w-28 bg-slate-950 border border-slate-800 text-xs font-mono text-white px-2 py-1 rounded-lg text-right"
          />
        </div>

        {/* More Options Link */}
        <div
          onClick={onOpenMoreOptions}
          className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
        >
          <span className="text-xs font-semibold text-slate-200">More Options</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Bottom OK Button */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
        <button
          onClick={handleSaveAndExit}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-8 py-2 rounded-xl text-sm shadow-md transition"
        >
          OK
        </button>
      </div>

      {/* Rotation Selector Modal */}
      {showRotationModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl space-y-2">
            <h3 className="text-sm font-bold text-white mb-2">Screen Rotation Method</h3>
            {(['Follow System', 'Portrait', 'Landscape', 'Sensor'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setSettings((prev) => ({ ...prev, screenRotation: mode }));
                  setShowRotationModal(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                  settings.screenRotation === mode
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{mode}</span>
                {settings.screenRotation === mode && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Homepage Selector Modal */}
      {showHomepageModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl space-y-2">
            <h3 className="text-sm font-bold text-white mb-2">Select Homepage</h3>
            {project.files
              .filter((f) => f.name.endsWith('.html') || f.name.endsWith('.php'))
              .map((file) => (
                <button
                  key={file.id}
                  onClick={() => {
                    setSettings((prev) => ({ ...prev, homepage: file.name }));
                    setShowHomepageModal(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition ${
                    settings.homepage === file.name
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{file.name}</span>
                  {settings.homepage === file.name && <Check className="w-4 h-4" />}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface MoreOptionsScreenProps {
  settings: ProjectSettings;
  onBack: () => void;
  onSave: (newOptions: ProjectSettings['moreOptions']) => void;
}

export const MoreOptionsScreen: React.FC<MoreOptionsScreenProps> = ({
  settings,
  onBack,
  onSave,
}) => {
  const [options, setOptions] = useState({ ...settings.moreOptions });

  const toggle = (key: keyof ProjectSettings['moreOptions']) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onSave(options);
    onBack();
  };

  const optionsList: { key: keyof ProjectSettings['moreOptions']; label: string }[] = [
    { key: 'fullscreenMode', label: 'Fullscreen Mode' },
    { key: 'hideTitleBar', label: 'Hide Title Bar' },
    { key: 'allowLongPress', label: 'Allow Long Press' },
    { key: 'showLoadingUI', label: 'Show Loading UI' },
    { key: 'allowZoom', label: 'Allow Zoom' },
    { key: 'pcMode', label: 'PC Mode' },
    { key: 'allowMediaAutoplay', label: 'Allow Media Autoplay' },
    { key: 'allowSwipingToRefresh', label: 'Allow Swiping to Refresh' },
    { key: 'allowUsingCamera', label: 'Allow Using Camera' },
    { key: 'allowUsingMicrophone', label: 'Allow Using Microphone' },
  ];

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
          <h1 className="text-base font-bold text-white">More Options</h1>
        </div>

        <button
          className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition"
          title="More"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Toggles List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {optionsList.map((opt) => (
          <div
            key={opt.key}
            onClick={() => toggle(opt.key)}
            className="bg-slate-900 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
          >
            <span className="text-xs font-semibold text-slate-200">{opt.label}</span>
            <div
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                options[opt.key] ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  options[opt.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom OK Button */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-8 py-2 rounded-xl text-sm shadow-md transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};
