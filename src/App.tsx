import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ScreenView>('home');
  const [viewHistory, setViewHistory] = useState<ScreenView[]>(['home']);
  const [homeTab, setHomeTab] = useState<'home' | 'feedy'>('home');

  // Modals state - ALL CLOSE FIXED
  const [modalState, setModalState] = useState({
    create: false,
    publish: false,
    import: false,
    export: false,
    info: false,
    search: false,
    actions: false,
    rename: false,
  });

  const [selectedActionProject, setSelectedActionProject] = useState<Project | null>(null);
  const [renameProjectName, setRenameProjectName] = useState('');

  // Memoized current project for performance
  const currentProject = useMemo(() => 
    projects.find((p) => p.id === activeProjectId) || projects[0],
    [projects, activeProjectId]
  );

  const currentFile = useMemo(() => 
    currentProject?.files.find((f) => f.id === activeFileId) || currentProject?.files[0],
    [currentProject, activeFileId]
  );

  // Initial load - only once
  useEffect(() => {
    const loaded = loadProjects();
    if (loaded.length > 0) {
      setProjects(loaded);
    }
  }, []);

  // Sync projects to storage - with debounce to prevent loop
  const updateProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    saveProjects(newProjects);
  }, []);

  // Navigation functions - memoized
  const navigateTo = useCallback((view: ScreenView) => {
    setViewHistory((prev) => [...prev, view]);
    setCurrentView(view);
  }, []);

  const handleBack = useCallback(() => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const prevView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(prevView);
    } else {
      setCurrentView('home');
    }
  }, [viewHistory]);

  const handleHomePress = useCallback(() => {
    setViewHistory(['home']);
    setCurrentView('home');
  }, []);

  // Modal close functions - FIXED
  const closeModal = useCallback((modalName: keyof typeof modalState) => {
    setModalState(prev => ({ ...prev, [modalName]: false }));
  }, []);

  const openModal = useCallback((modalName: keyof typeof modalState) => {
    setModalState(prev => ({ ...prev, [modalName]: true }));
  }, []);

  // Project Management Actions
  const handleCreateProject = useCallback((name: string, icon: string, template: string) => {
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
          fullscreenMode: false,
          hideTitleBar: false,
          allowLongPress: true,
          showLoadingUI: true,
          allowZoom: true,
          pcMode: false,
          allowMediaAutoplay: true,
          allowSwipingToRefresh: true,
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
          content: `body {\n  margin: 0;\n  background: #f8fafc;\n  color: #0f172a;\n}`,
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

    updateProjects([newProj, ...projects]);
    setActiveProjectId(newProj.id);
    closeModal('create');
    navigateTo('project_files');
  }, [projects, updateProjects, closeModal, navigateTo]);

  const handleSelectProject = useCallback((project: Project) => {
    setActiveProjectId(project.id);
    navigateTo('project_files');
  }, [navigateTo]);

  const handleOpenFile = useCallback((file: ProjectFile) => {
    setActiveFileId(file.id);
    navigateTo('editor');
  }, [navigateTo]);

  const handleSaveFileContent = useCallback((newContent: string) => {
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
  }, [currentProject, currentFile, projects, updateProjects]);

  const handleCreateFileInProject = useCallback((
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
  }, [currentProject, projects, updateProjects]);

  const handleDeleteFile = useCallback((fileId: string) => {
    if (!currentProject) return;
    const updatedFiles = currentProject.files.filter((f) => f.id !== fileId);
    const updatedProject = { ...currentProject, files: updatedFiles };
    const updatedProjects = projects.map((p) =>
      p.id === currentProject.id ? updatedProject : p
    );
    updateProjects(updatedProjects);
  }, [currentProject, projects, updateProjects]);

  const handleRenameFile = useCallback((fileId: string, newName: string) => {
    if (!currentProject) return;
    const updatedFiles = currentProject.files.map((f) =>
      f.id === fileId ? { ...f, name: newName } : f
    );
    const updatedProject = { ...currentProject, files: updatedFiles };
    const updatedProjects = projects.map((p) =>
      p.id === currentProject.id ? updatedProject : p
    );
    updateProjects(updatedProjects);
  }, [currentProject, projects, updateProjects]);

  const handleUpdateSettings = useCallback((newSettings: ProjectSettings) => {
    if (!currentProject) return;
    const updatedProject = { ...currentProject, settings: newSettings };
    const updatedProjects = projects.map((p) =>
      p.id === currentProject.id ? updatedProject : p
    );
    updateProjects(updatedProjects);
  }, [currentProject, projects, updateProjects]);

  const handleDuplicateProject = useCallback((project: Project) => {
    const dup: Project = {
      ...project,
      id: 'proj-' + Date.now(),
      name: `${project.name} Copy`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      lastModified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      files: project.files.map((f) => ({ ...f, id: 'file-' + Date.now() + Math.random() })),
    };
    updateProjects([dup, ...projects]);
    closeModal('actions');
  }, [projects, updateProjects, closeModal]);

  const handleDeleteProject = useCallback((project: Project) => {
    if (window.confirm(`Delete project "${project.name}" permanently?`)) {
      const filtered = projects.filter((p) => p.id !== project.id);
      updateProjects(filtered);
      if (activeProjectId === project.id) {
        setActiveProjectId(null);
        setCurrentView('home');
      }
      closeModal('actions');
    }
  }, [projects, updateProjects, activeProjectId, closeModal]);

  const handleRenameProjectSubmit = useCallback(() => {
    if (!selectedActionProject || !renameProjectName.trim()) return;
    const updated = projects.map((p) =>
      p.id === selectedActionProject.id ? { ...p, name: renameProjectName.trim() } : p
    );
    updateProjects(updated);
    closeModal('rename');
  }, [selectedActionProject, renameProjectName, projects, updateProjects, closeModal]);

  const handleImportProject = useCallback((name: string, files: ProjectFile[]) => {
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
          fullscreenMode: false,
          hideTitleBar: false,
          allowLongPress: true,
          showLoadingUI: true,
          allowZoom: true,
          pcMode: false,
          allowMediaAutoplay: true,
          allowSwipingToRefresh: true,
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
    closeModal('import');
    navigateTo('project_files');
  }, [projects, updateProjects, closeModal, navigateTo]);

  return (
    <AndroidFrame
      onHomePress={handleHomePress}
      onBackPress={handleBack}
      isLandscape={currentProject?.settings.screenRotation === 'Landscape'}
    >
      {/* View 1: Home / Projects Screen */}
      {currentView === 'home' && (
        <HomeScreen
          projects={projects}
          onSelectProject={handleSelectProject}
          onCreateProjectClick={() => openModal('create')}
          onProjectActionsClick={(proj) => {
            setSelectedActionProject(proj);
            openModal('actions');
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
          onOpenPublish={() => openModal('publish')}
          onOpenSearch={() => openModal('search')}
          onOpenSettings={() => navigateTo('project_settings')}
          onOpenInfo={() => openModal('info')}
          onOpenActions={() => {
            setSelectedActionProject(currentProject);
            openModal('actions');
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

      {/* MODALS - All with proper close */}
      {modalState.create && (
        <CreateProjectDialog
          onClose={() => closeModal('create')}
          onCreate={handleCreateProject}
          onImportClick={() => {
            closeModal('create');
            openModal('import');
          }}
        />
      )}

      {modalState.publish && currentProject && (
        <PublishModal
          project={currentProject}
          onClose={() => closeModal('publish')}
        />
      )}

      {modalState.import && (
        <ImportModal
          onClose={() => closeModal('import')}
          onImport={handleImportProject}
        />
      )}

      {modalState.export && currentProject && (
        <ExportModal
          project={currentProject}
          onClose={() => closeModal('export')}
        />
      )}

      {modalState.info && currentProject && (
        <ProjectInfoModal
          project={currentProject}
          onClose={() => closeModal('info')}
        />
      )}

      {modalState.search && currentProject && (
        <SearchProjectModal
          project={currentProject}
          onClose={() => closeModal('search')}
          onOpenFile={handleOpenFile}
        />
      )}

      {modalState.actions && selectedActionProject && (
        <ProjectActionsModal
          project={selectedActionProject}
          onClose={() => closeModal('actions')}
          onOpen={() => {
            setActiveProjectId(selectedActionProject.id);
            closeModal('actions');
            navigateTo('project_files');
          }}
          onRename={() => {
            setRenameProjectName(selectedActionProject.name);
            closeModal('actions');
            openModal('rename');
          }}
          onDuplicate={() => handleDuplicateProject(selectedActionProject)}
          onDelete={() => handleDeleteProject(selectedActionProject)}
          onSettings={() => {
            setActiveProjectId(selectedActionProject.id);
            closeModal('actions');
            navigateTo('project_settings');
          }}
          onInfo={() => {
            setActiveProjectId(selectedActionProject.id);
            closeModal('actions');
            openModal('info');
          }}
          onShare={() => {
            setActiveProjectId(selectedActionProject.id);
            closeModal('actions');
            openModal('publish');
          }}
        />
      )}

      {modalState.rename && selectedActionProject && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => closeModal('rename')}>
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-white">Rename Project</h3>
            <input
              type="text"
              autoFocus
              value={renameProjectName}
              onChange={(e) => setRenameProjectName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-emerald-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameProjectSubmit();
                if (e.key === 'Escape') closeModal('rename');
              }}
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => closeModal('rename')}
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
    </AndroidFrame>
  );
}
