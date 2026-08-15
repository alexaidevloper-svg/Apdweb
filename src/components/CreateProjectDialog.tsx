import React, { useState } from 'react';
import { Check, Upload, Globe, Layers, Sparkles, Code2, Server } from 'lucide-react';
import { Project } from '../types';

interface CreateProjectDialogProps {
  onClose: () => void;
  onCreate: (name: string, icon: string, template: string) => void;
  onImportClick: () => void;
}

const TEMPLATES = [
  { id: 'Base Template', name: 'Base Template', icon: Layers, desc: 'HTML5, CSS3, JS & PHP config' },
  { id: 'Tailwind Starter', name: 'Tailwind Template', icon: Sparkles, desc: 'Tailwind CSS utility styling' },
  { id: 'Responsive App', name: 'Mobile Web App', icon: Globe, desc: 'Touch-optimized mobile web UI' },
  { id: 'PHP Dynamic', name: 'PHP Dynamic Server', icon: Server, desc: 'Dynamic backend PHP script' },
];

const ICONS = ['🌐', '📱', '💻', '🛒', '🚀', '⚡', '🔥', '✨'];

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  onClose,
  onCreate,
  onImportClick,
}) => {
  const [projectName, setProjectName] = useState('My Website');
  const [selectedIcon, setSelectedIcon] = useState('🌐');
  const [selectedTemplate, setSelectedTemplate] = useState('Base Template');
  const [customIconUrl, setCustomIconUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    onCreate(projectName.trim(), customIconUrl || selectedIcon, selectedTemplate);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Create Project</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Website Icon Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Website Icon
            </label>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-emerald-500/80 flex items-center justify-center text-3xl shadow-inner">
                {customIconUrl ? (
                  <img
                    src={customIconUrl}
                    alt="Icon"
                    className="w-10 h-10 object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{selectedIcon}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-300 font-medium">Selected App Icon</p>
                <p className="text-[11px] text-slate-500">Pick from presets or enter icon emoji</p>
              </div>
            </div>

            {/* Icon Presets */}
            <div className="flex gap-2 flex-wrap">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    setSelectedIcon(icon);
                    setCustomIconUrl('');
                  }}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base transition ${
                    selectedIcon === icon && !customIconUrl
                      ? 'border-emerald-500 bg-emerald-950/40 text-white'
                      : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Website Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Website Name
            </label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Website"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
            />
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Template
            </label>
            <div className="space-y-2">
              {TEMPLATES.map((tmpl) => {
                const IconComp = tmpl.icon;
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/80 text-white shadow-sm'
                        : 'bg-slate-800/50 border-slate-700/70 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">{tmpl.name}</h4>
                        <p className="text-[11px] text-slate-400">{tmpl.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-500 text-white'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onImportClick}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-lg hover:bg-emerald-950/30 transition uppercase tracking-wider"
            >
              IMPORT PROJECT
            </button>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold px-6 py-2 rounded-xl text-sm shadow-md transition"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
