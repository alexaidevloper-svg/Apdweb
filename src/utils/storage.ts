import { Project } from '../types';
import { DEFAULT_PROJECTS } from '../data/defaultProjects';

const STORAGE_KEY = 'apd_web_projects_data_v1';

export function loadProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading projects from localStorage', e);
  }
  saveProjects(DEFAULT_PROJECTS);
  return DEFAULT_PROJECTS;
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects to localStorage', e);
  }
}

export function getProjectById(projects: Project[], id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
