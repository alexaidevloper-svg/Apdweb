import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  Server,
  UploadCloud,
  Search,
  RefreshCw,
  Plus,
  FileUp,
  FileCode,
  FileText,
  Folder,
  Trash2,
  Edit2,
  Play,
  Settings,
  Info,
} from 'lucide-react';
import { Project, ProjectFile } from '../types';

interface ProjectFileScreenProps {
  project: Project;
  onBack: () => void;
  onOpenFile: (file: ProjectFile) => void;
  onOpenPhpServer: () => void;
  onOpenPublish: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenInfo: () => void;
  onOpenActions: () => void;
  onCreateFile: (name: string, type: ProjectFile['type'], initialContent?: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onRunProject: () => void;
}

export const ProjectFileScreen: React.FC<ProjectFileScreenProps> = ({
  project,
  onBack,
  onOpenFile,
  onOpenPhpServer,
  onOpenPublish,
  onOpenSearch,
  onOpenSettings,
  onOpenInfo,
  onOpenActions,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
  onRunProject,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileType, setNewFileType] = useState<ProjectFile['type']>('html');
  const [newFileName, setNewFileName] = useState('untitled.html');
  const [activeFileForAction, setActiveFileForAction] = useState<ProjectFile | null>(null);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [showTopMenu, setShowTopMenu] = useState(false);

  const getFileBadge = (file: ProjectFile) => {
    switch (file.type) {
      case 'html':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">HTML</span>;
      case 'css':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">CSS</span>;
      case 'js':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">JS</span>;
      case 'php':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">PHP</span>;
      case 'png':
      case 'jpg':
      case 'svg':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PNG</span>;
      case 'folder':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-300 border border-slate-500/30">DIR</span>;
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-300 border border-slate-500/30">TXT</span>;
    }
  };

  const handleOpenAddType = (type: ProjectFile['type'], defaultExt: string) => {
    setShowAddMenu(false);
    setNewFileType(type);
    setNewFileName(`new_file.${defaultExt}`);
    setShowNewFileDialog(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let initialContent = '';
    if (newFileType === 'html') {
      initialContent = `<!DOCTYPE html>\n<html>\n<head>\n  <title>${project.name}</title>\n</head>\n<body>\n  <h1>New Page</h1>\n</body>\n</html>`;
    } else if (newFileType === 'css') {
      initialContent = `/* Stylesheet */\nbody {\n  margin: 0;\n  padding: 16px;\n}`;
    } else if (newFileType === 'js') {
      initialContent = `// JavaScript Script\nconsole.log('Script loaded.');`;
    } else if (newFileType === 'php') {
      initialContent = `<?php\n// PHP Script\necho "PHP Server Active";\n?>`;
    }

    onCreateFile(newFileName.trim(), newFileType, initialContent);
    setShowNewFileDialog(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isImage = file.type.startsWith('image/');

    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
      let fType: ProjectFile['type'] = 'txt';
      if (['html', 'htm'].includes(ext)) fType = 'html';
      else if (ext === 'css') fType = 'css';
      else if (ext === 'js') fType = 'js';
      else if (ext === 'php') fType = 'php';
      else if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) fType = 'png';

      onCreateFile(file.name, fType, content);
    };

    if (isImage) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 min-h-0 select-none">
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-800 rounded-full transition text-slate-300 hover:text-white"
            title="Back to Projects"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white truncate max-w-[180px]">{project.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowTopMenu(!showTopMenu)}
            className="p-2 hover:bg-slate-800 rounded-full transition text-slate-300 hover:text-white"
            title="More Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Dropdown Menu for Top 3-Dots */}
        {showTopMenu && (
          <div className="absolute right-4 top-12 w-48 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-1 z-30">
            <button
              onClick={() => {
                setShowTopMenu(false);
                onOpenSettings();
              }}
              className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2.5"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Project Settings</span>
            </button>
            <button
              onClick={() => {
                setShowTopMenu(false);
                onOpenInfo();
              }}
              className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2.5"
            >
              <Info className="w-4 h-4 text-sky-400" />
              <span>Project Info</span>
            </button>
            <button
              onClick={() => {
                setShowTopMenu(false);
                onOpenActions();
              }}
              className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2.5"
            >
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>Project Actions</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Action Banners (PHP Server + Publish Your Website) */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {/* PHP Server Card */}
        <button
          onClick={onOpenPhpServer}
          className="bg-slate-800/90 hover:bg-slate-800 active:scale-[0.98] border border-slate-700/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 transition shadow-sm group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
            <Server className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-200">PHP Server</span>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready</span>
          </div>
        </button>

        {/* Publish Your Website Card */}
        <button
          onClick={onOpenPublish}
          className="bg-slate-800/90 hover:bg-slate-800 active:scale-[0.98] border border-slate-700/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 transition shadow-sm group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:scale-105 transition">
            <UploadCloud className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-200">Publish Your</span>
          <span className="text-[11px] text-sky-400 font-medium">Website</span>
        </button>
      </div>

      {/* Section Header: Website + Action icons */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-slate-800/80 bg-slate-900/60">
        <h2 className="text-sm font-bold text-slate-300 tracking-wide uppercase">Website</h2>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSearch}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            title="Search in Project"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => {}}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
            title="Refresh Files"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="p-1.5 bg-emerald-600/80 hover:bg-emerald-600 rounded-lg text-white transition"
              title="Add File / Folder"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* File Creation Dropdown Menu (Screen 4) */}
            {showAddMenu && (
              <div className="absolute right-0 top-8 w-44 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-1 z-30">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                  New File
                </div>
                <button
                  onClick={() => handleOpenAddType('html', 'html')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  <span>HTML File (.html)</span>
                </button>
                <button
                  onClick={() => handleOpenAddType('css', 'css')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>CSS Stylesheet (.css)</span>
                </button>
                <button
                  onClick={() => handleOpenAddType('js', 'js')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>JavaScript (.js)</span>
                </button>
                <button
                  onClick={() => handleOpenAddType('php', 'php')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>PHP Script (.php)</span>
                </button>
                <button
                  onClick={() => handleOpenAddType('folder', '')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2 border-t border-slate-700/60"
                >
                  <Folder className="w-3.5 h-3.5 text-yellow-400" />
                  <span>New Folder</span>
                </button>
              </div>
            )}
          </div>

          <label
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            title="Import Local File"
          >
            <FileUp className="w-4 h-4" />
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 px-4 py-2 overflow-y-auto space-y-1.5">
        {project.files.map((file) => (
          <div
            key={file.id}
            onClick={() => onOpenFile(file)}
            className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-xl px-3 py-2.5 flex items-center justify-between cursor-pointer transition shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0">{getFileBadge(file)}</div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {file.lastModified}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFileForAction(file);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-700/80 transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* File Action Modal */}
      {activeFileForAction && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl space-y-2">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              {activeFileForAction.name}
            </h3>

            <button
              onClick={() => {
                const file = activeFileForAction;
                setActiveFileForAction(null);
                onOpenFile(file);
              }}
              className="w-full text-left py-2 px-3 text-xs text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-2"
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Edit Code</span>
            </button>

            <button
              onClick={() => {
                setRenameValue(activeFileForAction.name);
                setShowRenameDialog(true);
              }}
              className="w-full text-left py-2 px-3 text-xs text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4 text-sky-400" />
              <span>Rename File</span>
            </button>

            <button
              onClick={() => {
                if (confirm(`Delete ${activeFileForAction.name}?`)) {
                  onDeleteFile(activeFileForAction.id);
                  setActiveFileForAction(null);
                }
              }}
              className="w-full text-left py-2 px-3 text-xs text-red-400 hover:bg-red-950/40 rounded-xl flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete File</span>
            </button>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveFileForAction(null)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename File Dialog */}
      {showRenameDialog && activeFileForAction && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">Rename File</h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white focus:outline-none focus:border-emerald-500 mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRenameDialog(false)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (renameValue.trim()) {
                    onRenameFile(activeFileForAction.id, renameValue.trim());
                    setShowRenameDialog(false);
                    setActiveFileForAction(null);
                  }
                }}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">Create New File</h3>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">File Name</label>
              <input
                type="text"
                required
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewFileDialog(false)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg font-medium"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
