import React, { useState } from 'react';
import { Search, Settings, Plus, RefreshCw, Home, Rss, MoreVertical } from 'lucide-react';
import { Project } from '../types';
import { APP_NAME, APP_LOGO } from '../data/constants';

interface HomeScreenProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProjectClick: () => void;
  onProjectActionsClick: (project: Project) => void;
  onOpenSettings: () => void;
  activeTab: 'home' | 'feedy';
  onTabChange: (tab: 'home' | 'feedy') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  projects,
  onSelectProject,
  onCreateProjectClick,
  onProjectActionsClick,
  onOpenSettings,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 min-h-0 select-none">
      {/* Top App Header */}
      <div className="px-4 py-3 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <img
            src={APP_LOGO}
            alt="Apd Web Logo"
            className="w-7 h-7 object-contain rounded-md shadow-sm"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-xl font-bold tracking-tight text-white">{APP_NAME}</h1>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-slate-800 rounded-full transition text-slate-300 hover:text-white"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Action Buttons Row - Only on Home Tab */}
      {activeTab === 'home' && (
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={onCreateProjectClick}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-medium py-2.5 px-4 rounded-xl shadow-md transition text-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Project</span>
          </button>

          <button
            onClick={() => {}}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded-xl border border-slate-700/70 transition"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'home' ? (
        <div className="flex-1 p-4 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-2xl mb-3">
                📂
              </div>
              <p className="text-slate-300 font-medium mb-1">No Projects Found</p>
              <p className="text-xs text-slate-500 mb-4 max-w-xs">
                Create your first project to start coding.
              </p>
              <button
                onClick={onCreateProjectClick}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
              >
                + Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="group relative bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-emerald-500/40 rounded-2xl p-3.5 flex flex-col items-center text-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {/* Top Right More Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onProjectActionsClick(project);
                    }}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white hover:bg-slate-700/80 rounded-md transition"
                    title="Project Options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Project Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-2xl my-2 shadow-inner group-hover:scale-105 transition-transform">
                    {project.icon.startsWith('http') ? (
                      <img
                        src={project.icon}
                        alt={project.name}
                        className="w-10 h-10 object-contain rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{project.icon || '🌐'}</span>
                    )}
                  </div>

                  {/* Project Title */}
                  <h3 className="font-semibold text-sm text-slate-100 truncate w-full px-1 mb-1">
                    {project.name}
                  </h3>

                  {/* Datetime Stamp */}
                  <p className="text-[11px] text-slate-400 font-mono">
                    {project.createdAt.slice(0, 19)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* iFeedy Tab */
        <div className="flex-1 p-4 overflow-y-auto space-y-3 pb-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Featured Starter</span>
            <h3 className="text-base font-bold text-white mt-1">Full-Stack Mobile Web Starter</h3>
            <p className="text-xs text-slate-400 mt-1">
              Includes HTML5, modern CSS with responsive design, JavaScript DOM events, and PHP backend config ready for APK conversion.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-400">Tutorial & Tips</span>
            <h3 className="text-base font-bold text-white mt-1">Convert to Android APK in Seconds</h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure package names, splash screens, minimum Android SDK, and download real installable bundles with offline WebView caching.
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">PHP 8 Server</span>
            <h3 className="text-base font-bold text-white mt-1">Built-in Local Web Server</h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure custom ports, manage PHP 8 environments, and debug server logs directly in the interactive developer console.
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation Tab Bar (Home & iFeedy) */}
      <div className="border-t border-slate-800 bg-slate-950/95 flex items-center justify-around py-2 z-10">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 py-1 px-6 rounded-xl transition ${
            activeTab === 'home'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </button>

        <button
          onClick={() => onTabChange('feedy')}
          className={`flex flex-col items-center gap-1 py-1 px-6 rounded-xl transition ${
            activeTab === 'feedy'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Rss className="w-5 h-5" />
          <span className="text-[11px]">iFeedy</span>
        </button>
      </div>
    </div>
  );
};
