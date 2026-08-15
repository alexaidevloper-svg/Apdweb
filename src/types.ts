export interface ProjectFile {
  id: string;
  name: string;
  type: 'html' | 'css' | 'js' | 'php' | 'json' | 'png' | 'jpg' | 'svg' | 'txt' | 'folder';
  content: string;
  size: number;
  lastModified: string;
  path: string;
  isDirectory?: boolean;
}

export interface ProjectSettings {
  titleBarBgColor: string;
  screenRotation: 'Follow System' | 'Portrait' | 'Landscape' | 'Sensor';
  homepage: string;
  phpEnvironment: string;
  carryPhpEnvironment: 'Include' | 'Exclude';
  phpServerPort: number;
  splashPage: string;
  moreOptions: {
    fullscreenMode: boolean;
    hideTitleBar: boolean;
    allowLongPress: boolean;
    showLoadingUI: boolean;
    allowZoom: boolean;
    pcMode: boolean;
    allowMediaAutoplay: boolean;
    allowSwipingToRefresh: boolean;
    allowUsingCamera: boolean;
    allowUsingMicrophone: boolean;
  };
}

export interface Project {
  id: string;
  name: string;
  icon: string;
  template: string;
  createdAt: string;
  lastModified: string;
  files: ProjectFile[];
  settings: ProjectSettings;
}

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  source: string;
  timestamp: string;
  details?: any;
}

export interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  type: string;
  size: string;
  time: string;
  timestamp: string;
}

export interface ApkConfig {
  appName: string;
  packageName: string;
  versionCode: string;
  versionName: string;
  homepage: string;
  icon: string;
  splashScreen: string;
  minSdkVersion: string;
  targetSdkVersion: string;
}

export type ScreenView =
  | 'home'
  | 'project_files'
  | 'editor'
  | 'preview'
  | 'php_server'
  | 'project_settings'
  | 'more_options'
  | 'dev_console'
  | 'feedy';
