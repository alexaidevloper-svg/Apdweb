import React, { useState } from 'react';
import {
  FolderArchive,
  Download,
  Info,
  Search,
  FileCode,
  Edit2,
  Copy,
  Trash2,
  Settings,
  Share2,
  Play,
  X,
  Upload,
} from 'lucide-react';
import { Project, ProjectFile } from '../types';
import { generateProjectZip, triggerDownload } from '../utils/apkGenerator';
import { formatFileSize } from '../utils/storage';

// Screen 16: Import Project Modal
interface ImportModalProps {
  onClose: () => void;
  onImport: (name: string, files: ProjectFile[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImport }) => {
  const [sourcePath, setSourcePath] = useState('/storage/emulated/0/Download/MyWebsite.zip');
  const [projectName, setProjectName] = useState('Imported Project');
  const [loadedFiles, setLoadedFiles] = useState<ProjectFile[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSourcePath(`/storage/emulated/0/Download/${file.name}`);
    setProjectName(file.name.replace(/\.[^/.]+$/, ''));

    // Create a mock imported structure if standard file
    setLoadedFiles([
      {
        id: 'imp-1',
        name: 'index.html',
        type: 'html',
        path: 'index.html',
        size: 1024,
        lastModified: new Date().toLocaleString(),
        content: `<!DOCTYPE html><html><body><h1>${file.name} Loaded</h1></body></html>`,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onImport(projectName, loadedFiles);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">Import Project</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Source</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={sourcePath}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono"
            />
            <label className="bg-slate-800 hover:bg-slate-700 p-2 rounded-xl text-emerald-400 border border-slate-700 cursor-pointer flex items-center justify-center">
              <Upload className="w-4 h-4" />
              <input type="file" onChange={handleFileSelect} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Project Name</label>
          <input
            type="text"
            required
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-4 py-2"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2 rounded-xl"
          >
            IMPORT
          </button>
        </div>
      </form>
    </div>
  );
};

// Screen 17: Export Project Modal
interface ExportModalProps {
  project: Project;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, onClose }) => {
  const [fileName, setFileName] = useState(`${project.name}.zip`);

  const handleExport = async () => {
    try {
      const blob = await generateProjectZip(project);
      triggerDownload(blob, fileName);
      onClose();
    } catch (e) {
      alert('Export failed: ' + e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">Export Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Destination</label>
          <p className="text-xs font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            /storage/emulated/0/ApdWeb/export/
          </p>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-white px-4 py-2">
            CANCEL
          </button>
          <button
            onClick={handleExport}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2 rounded-xl"
          >
            EXPORT
          </button>
        </div>
      </div>
    </div>
  );
};

// Screen 18: Project Info Modal
interface ProjectInfoModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({ project, onClose }) => {
  const totalBytes = project.files.reduce((acc, f) => acc + (f.size || f.content?.length || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">Project Info</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div>
              <span className="text-slate-500 font-medium block text-[10px] uppercase">Project Name</span>
              <span className="text-slate-200 font-bold text-sm">{project.name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block text-[10px] uppercase">Created Date</span>
              <span className="text-slate-300 font-mono">{project.createdAt}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block text-[10px] uppercase">Last Modified</span>
              <span className="text-slate-300 font-mono">{project.lastModified}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
              <div>
                <span className="text-slate-500 font-medium block text-[10px] uppercase">Files</span>
                <span className="text-emerald-400 font-bold">{project.files.length}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-[10px] uppercase">Size</span>
                <span className="text-emerald-400 font-bold">{formatFileSize(totalBytes)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2 rounded-xl"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Screen 19: Search in Project Modal
interface SearchProjectModalProps {
  project: Project;
  onClose: () => void;
  onOpenFile: (file: ProjectFile) => void;
}

export const SearchProjectModal: React.FC<SearchProjectModalProps> = ({
  project,
  onClose,
  onOpenFile,
}) => {
  const [query, setQuery] = useState('');

  const results = project.files.filter((file) => {
    if (!query.trim()) return true;
    const nameMatch = file.name.toLowerCase().includes(query.toLowerCase());
    const contentMatch = file.content?.toLowerCase().includes(query.toLowerCase());
    return nameMatch || contentMatch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">Search in Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div>
          <input
            type="text"
            autoFocus
            placeholder="Search files or code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 min-h-[150px]">
          {results.map((file) => (
            <div
              key={file.id}
              onClick={() => {
                onOpenFile(file);
                onClose();
              }}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{file.name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {file.lastModified} • {formatFileSize(file.size)}
                </p>
              </div>
              <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-white px-4 py-2">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

// Screen 20: Project Actions Bottom Sheet
interface ProjectActionsModalProps {
  project: Project;
  onClose: () => void;
  onOpen: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSettings: () => void;
  onInfo: () => void;
  onShare: () => void;
}

export const ProjectActionsModal: React.FC<ProjectActionsModalProps> = ({
  project,
  onClose,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
  onSettings,
  onInfo,
  onShare,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-3 animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🌐</span>
            <h2 className="text-sm font-bold text-white truncate max-w-[200px]">{project.name}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            ✕
          </button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => {
              onClose();
              onOpen();
            }}
            className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition"
          >
            <Play className="w-4 h-4 text-emerald-400" />
            <span>Open</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onRename();
            }}
            className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition"
          >
            <Edit2 className="w-4 h-4 text-sky-400" />
            <span>Rename</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onDuplicate();
            }}
            className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition"
          >
            <Copy className="w-4 h-4 text-purple-400" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onDelete();
            }}
            className="w-full text-left py-2.5 px-3 text-xs font-semibold text-red-400 hover:bg-red-950/40 rounded-xl flex items-center gap-3 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onSettings();
            }}
            className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onInfo();
            }}
            className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition"
          >
            <Info className="w-4 h-4 text-blue-400" />
            <span>Info</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onShare();
            }}
            className="w-full text-left py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Share</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white font-semibold bg-slate-800/80 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
