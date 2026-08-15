// App.tsx - Complete full screen version

import React, { useState, useEffect } from 'react';
import { Project, ProjectFile, ProjectSettings, ScreenView } from './types';
import { loadProjects, saveProjects } from './utils/storage';
import { AndroidFrame } from './components/AndroidFrame';
import { HomeScreen } from './components/HomeScreen';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { ProjectFileScreen } from './components/ProjectFileScreen';
import { CodeEditor } from './components/CodeEditor';
import { RunPreviewScreen } from './components/RunPreviewScreen';
import { PhpServerScreen } from './components/PhpServerScreen';
import { ProjectSettingsScreen, MoreOptionsScreen } from './components/ProjectSettingsScreen';
import { PublishModal } from './components/PublishModal';
import {
  ImportModal,
  ExportModal,
  ProjectInfoModal,
  SearchProjectModal,
  ProjectActionsModal,
} from './components/ImportExportModal';

// CSS for full screen - global styles
const GlobalStyles = () => (
  <style>{`
    /* Full screen reset */
    html, body, #root {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
      background: #0f172a !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
    }
    
    /* Prevent zoom on mobile */
    * {
      touch-action: manipulation !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    
    /* Prevent selection */
    ::selection {
      background: transparent;
    }
    
    /* Hide scrollbars but keep scroll */
    ::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      background: transparent;
    }
    
    /* For Firefox */
    * {
      scrollbar-width: none;
    }
  `}</style>
);

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ScreenView>('home');
  const [viewHistory, setViewHistory] = useState<ScreenView[]>(['home']);
  const [homeTab, setHomeTab] = useState<'home' | 'feedy'>('home');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedActionProject, setSelectedActionProject] = useState<Project | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameProjectName, setRenameProjectName] = useState('');

  // Initial load
  useEffect(() => {
    const loaded = loadProjects();
    setProjects(loaded);
    
    // Full screen request on load
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    }
  }, []);

  // Sync projects to storage
  const updateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    saveProjects(newProjects);
  };

  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const currentFile = currentProject?.files.find((f) => f.id === activeFileId) || currentProject?.files[0];

  const navigateTo = (view: ScreenView) => {
    setViewHistory((prev) => [...prev, view]);
    setCurrentView(view);
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const prevView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(prevView);
    } else {
      setCurrentView('home');
    }
  };

  const handleHomePress = () => {
    setViewHistory(['home']);
    setCurrentView('home');
  };

  // Project Management Actions
  const handleCreateProject = (name: string, icon: string, template: string) => {
    const newProj: Project = {
      id: 'proj-' + Date.now(),
      name,
      icon,
      template,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      settings: {
        titleBarBgColor: '#0d9488',
        screenRotation: 'Follow System',
        homepage: 'index.html',
        phpEnvironment: 'PHP 8.2.10',
        carryPhpEnvironment: 'Include',
        phpServerPort: 8000 + Math.floor(Math.random() * 500),
        splashPage: 'splash.html',
        moreOptions: {
          fullscreenMode: true,  // Default fullscreen ON
          hideTitleBar: true,   // Hide title bar
          allowLongPress: false,
          showLoadingUI: false,
          allowZoom: false,     // Zoom off
          pcMode: false,
          allowMediaAutoplay: true,
          allowSwipingToRefresh: false,
          allowUsingCamera: true,
          allowUsingMicrophone: true,
        },
      },
      files: [
        {
          id: 'file-' + Date.now() + '-1',
          name: 'index.html',
          type: 'html',
          path: 'index.html',
          size: 1200,
          lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>${name}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div style="text-align:center; padding: 30px 16px; font-family:sans-serif;">
    <h1 style="color:#0d9488;">${name}</h1>
    <p>Created with Apd Web Android IDE</p>
    <button onclick="handleClick()" style="background:#0d9488;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;margin-top:16px;cursor:pointer;">
      Click Me
    </button>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
        },
        {
          id: 'file-' + Date.now() + '-2',
          name: 'style.css',
          type: 'css',
          path: 'style.css',
          size: 400,
          lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
          content: `* { margin: 0; padding: 0; box-sizing: border-box; }\nhtml, body { width: 100%; height: 100%; overflow: hidden; }\nbody { margin: 0; background: #f8fafc; color: #0f172a; font-family: sans-serif; }`,
        },
        {
          id: 'file-' + Date.now() + '-3',
          name: 'script.js',
          type: 'js',
          path: 'script.js',
          size: 300,
          lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
          content: `function handleClick() {\n  alert('Hello from ${name} on Apd Web!');\n  console.log('Action triggered successfully.');\n}`,
        },
      ],
    };

    const updated = [newProj, ...projects];
    updateProjects(updated);
    setActiveProjectId(newProj.id);
    setShowCreateModal(false);
    navigateTo('project_files');
  };

  const handleSelectProject = (project: Project) => {
    setActiveProjectId(project.id);
    navigateTo('project_files');
  };

  const handleOpenFile = (file: ProjectFile) => {
    setActiveFileId(file.id);
    navigateTo('editor');
  };

  const handleSaveFileContent = (newContent: string) => {
    if (!currentProject || !currentFile) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const updatedFiles = currentProject.files.map((f) =>
      f.id === currentFile.id
        ? { ...f, content: newContent, size: newContent.length, lastModified: now }
        : f
    );

    const updatedProject: Project = {
      ...currentProject,
      lastModified: now,
      files: updatedFiles,
    };

    const updatedProjects = projects.map((p) =>
      p.id === currentProject.id ? updatedProject : p
    );
    updateProjects(updatedProjects);
  };

  const handleCreateFileInProject = (
    name: string,
    type: ProjectFile['type'],
    initialContent?: string
  ) => {
    if (!currentProject) return;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const newFile: ProjectFile = {
      id: 'file-' + Date.now(),
      name,
      type,
      path: name,
      size: initialContent?.length || 0,
      lastModified: now,
      content: initialContent || '',
    };

    const updatedProject: Project = {
      ...currentProject,
      lastModified: now,
      files: [...currentProject.files, newFile],
    };

    const updatedProjects = projects.map((p) =>
      p.id === currentProject.id ? updatedProject : p
    );
    updateProjects(updatedProjects);
  };

  const handleDeleteFile = (fileId: string) => {
    if (!currentProject) return;
    const updatedFiles = currentProject.files.filter((f) => f.id !== fileId);
    const updatedProject = { ...currentProject, files: updatedFiles };
    const updatedProjects = projects.map((p) =>
      p.id === currentProject.id ? updatedProject : p
    );
    updateProjects(updatedProjects);
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    if (!currentProject) return;
    const updatedFiles = currentProject.files.map((f) =>
      f.id === fileId ? { ...f, name: newName } : f
    );
    const updatedProject = { ...currentProject, files: updatedFiles };
    const updatedProjects = projects.map((p) =>
      p.id === currentProject.id ? updatedProject : p
    );
    updateProjects(updatedProjects);
  };

  const handleUpdateSettings = (newSettings: ProjectSettings) => {
    if (!currentProject) return;
    const updatedProject = { ...currentProject, settings: newSettings };
    const updatedProjects = projects.map((p) =>
      p.id === currentProject.id ? updatedProject : p
    );
    updateProjects(updatedProjects);
  };

  const handleDuplicateProject = (project: Project) => {
    const dup: Project = {
      ...project,
      id: 'proj-' + Date.now(),
      name: `${project.name} Copy`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      files: project.files.map((f) => ({ ...f, id: 'file-' + Date.now() + Math.random() })),
    };
    updateProjects([dup, ...projects]);
  };

  const handleDeleteProject = (project: Project) => {
    if (confirm(`Delete project "${project.name}" permanently?`)) {
      const filtered = projects.filter((p) => p.id !== project.id);
      updateProjects(filtered);
      if (activeProjectId === project.id) {
        setActiveProjectId(null);
        setCurrentView('home');
      }
    }
  };

  const handleRenameProjectSubmit = () => {
    if (!selectedActionProject || !renameProjectName.trim()) return;
    const updated = projects.map((p) =>
      p.id === selectedActionProject.id ? { ...p, name: renameProjectName.trim() } : p
    );
    updateProjects(updated);
    setShowRenameModal(false);
  };

  const handleImportProject = (name: string, files: ProjectFile[]) => {
    const newProj: Project = {
      id: 'proj-imp-' + Date.now(),
      name,
      icon: '📂',
      template: 'Imported',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      settings: {
        titleBarBgColor: '#0d9488',
        screenRotation: 'Follow System',
        homepage: files[0]?.name || 'index.html',
        phpEnvironment: 'PHP 8.2.10',
        carryPhpEnvironment: 'Include',
        phpServerPort: 8000,
        splashPage: 'splash.html',
        moreOptions: {
          fullscreenMode: true,
          hideTitleBar: true,
          allowLongPress: false,
          showLoadingUI: false,
          allowZoom: false,
          pcMode: false,
          allowMediaAutoplay: true,
          allowSwipingToRefresh: false,
          allowUsingCamera: true,
          allowUsingMicrophone: true,
        },
      },
      files: files.length > 0 ? files : [
        {
          id: 'imp-idx',
          name: 'index.html',
          type: 'html',
          path: 'index.html',
          size: 500,
          lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
          content: '<h1>Imported Web App</h1>',
        },
      ],
    };
    updateProjects([newProj, ...projects]);
    setActiveProjectId(newProj.id);
    navigateTo('project_files');
  };

  return (
    <>
      <GlobalStyles />
      <AndroidFrame
        onHomePress={handleHomePress}
        onBackPress={handleBack}
        isLandscape={currentProject?.settings.screenRotation === 'Landscape'}
      >
        <div style={{ 
          width: '100%', 
          height: '100%', 
          overflow: 'auto',
          backgroundColor: '#0f172a',
          position: 'relative',
        }}>
          {/* View 1: Home / Projects Screen */}
          {currentView === 'home' && (
            <HomeScreen
              projects={projects}
              onSelectProject={handleSelectProject}
              onCreateProjectClick={() => setShowCreateModal(true)}
              onProjectActionsClick={(proj) => {
                setSelectedActionProject(proj);
                setShowActionsModal(true);
              }}
              onOpenSettings={() => {
                if (currentProject) navigateTo('project_settings');
              }}
              activeTab={homeTab}
              onTabChange={setHomeTab}
            />
          )}

          {/* View 2: Project Files Screen */}
          {currentView === 'project_files' && currentProject && (
            <ProjectFileScreen
              project={currentProject}
              onBack={handleBack}
              onOpenFile={handleOpenFile}
              onOpenPhpServer={() => navigateTo('php_server')}
              onOpenPublish={() => setShowPublishModal(true)}
              onOpenSearch={() => setShowSearchModal(true)}
              onOpenSettings={() => navigateTo('project_settings')}
              onOpenInfo={() => setShowInfoModal(true)}
              onOpenActions={() => {
                setSelectedActionProject(currentProject);
                setShowActionsModal(true);
              }}
              onCreateFile={handleCreateFileInProject}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
              onRunProject={() => navigateTo('preview')}
            />
          )}

          {/* View 3: Code Editor Screen */}
          {currentView === 'editor' && currentFile && (
            <CodeEditor
              file={currentFile}
              onBack={handleBack}
              onSave={handleSaveFileContent}
              onRun={() => navigateTo('preview')}
            />
          )}

          {/* View 4: Run / Preview Screen */}
          {currentView === 'preview' && currentProject && (
            <RunPreviewScreen
              project={currentProject}
              onBack={handleBack}
              onOpenSettings={() => navigateTo('project_settings')}
            />
          )}

          {/* View 5: PHP Server Screen */}
          {currentView === 'php_server' && currentProject && (
            <PhpServerScreen
              project={currentProject}
              onBack={handleBack}
              onUpdateSettings={handleUpdateSettings}
            />
          )}

          {/* View 6: Project Settings Screen */}
          {currentView === 'project_settings' && currentProject && (
            <ProjectSettingsScreen
              project={currentProject}
              onBack={handleBack}
              onSave={handleUpdateSettings}
              onOpenMoreOptions={() => navigateTo('more_options')}
            />
          )}

          {/* View 7: More Options Screen */}
          {currentView === 'more_options' && currentProject && (
            <MoreOptionsScreen
              settings={currentProject.settings}
              onBack={handleBack}
              onSave={(newMoreOptions) =>
                handleUpdateSettings({
                  ...currentProject.settings,
                  moreOptions: newMoreOptions,
                })
              }
            />
          )}

          {/* MODALS */}
          {/* Create Project Modal */}
          {showCreateModal && (
            <CreateProjectDialog
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateProject}
              onImportClick={() => {
                setShowCreateModal(false);
                setShowImportModal(true);
              }}
            />
          )}

          {/* Publish & APK Build Modal */}
          {showPublishModal && currentProject && (
            <PublishModal
              project={currentProject}
              onClose={() => setShowPublishModal(false)}
            />
          )}

          {/* Import Modal */}
          {showImportModal && (
            <ImportModal
              onClose={() => setShowImportModal(false)}
              onImport={handleImportProject}
            />
          )}

          {/* Export Modal */}
          {showExportModal && currentProject && (
            <ExportModal
              project={currentProject}
              onClose={() => setShowExportModal(false)}
            />
          )}

          {/* Project Info Modal */}
          {showInfoModal && currentProject && (
            <ProjectInfoModal
              project={currentProject}
              onClose={() => setShowInfoModal(false)}
            />
          )}

          {/* Search in Project Modal */}
          {showSearchModal && currentProject && (
            <SearchProjectModal
              project={currentProject}
              onClose={() => setShowSearchModal(false)}
              onOpenFile={handleOpenFile}
            />
          )}

          {/* Project Actions Context Modal */}
          {showActionsModal && selectedActionProject && (
            <ProjectActionsModal
              project={selectedActionProject}
              onClose={() => setShowActionsModal(false)}
              onOpen={() => {
                setActiveProjectId(selectedActionProject.id);
                navigateTo('project_files');
              }}
              onRename={() => {
                setRenameProjectName(selectedActionProject.name);
                setShowRenameModal(true);
              }}
              onDuplicate={() => handleDuplicateProject(selectedActionProject)}
              onDelete={() => handleDeleteProject(selectedActionProject)}
              onSettings={() => {
                setActiveProjectId(selectedActionProject.id);
                navigateTo('project_settings');
              }}
              onInfo={() => {
                setActiveProjectId(selectedActionProject.id);
                setShowInfoModal(true);
              }}
              onShare={() => {
                setActiveProjectId(selectedActionProject.id);
                setShowPublishModal(true);
              }}
            />
          )}

          {/* Rename Project Dialog */}
          {showRenameModal && selectedActionProject && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl space-y-3">
                <h3 className="text-sm font-bold text-white">Rename Project</h3>
                <input
                  type="text"
                  autoFocus
                  value={renameProjectName}
                  onChange={(e) => setRenameProjectName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowRenameModal(false)}
                    className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRenameProjectSubmit}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AndroidFrame>
    </>
  );
}
