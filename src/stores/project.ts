// Project Management Module Zustand Store
// 项目管理模块状态管理

import { create } from 'zustand';
import type {
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
  ProjectStatistics,
  ProjectMilestone,
  MilestoneCreateInput,
  ProjectTask,
  ProjectTaskCreateInput,
  TimeEntry,
  TimeEntryCreateInput,
  ProjectCost,
  CostCreateInput,
  ProjectDocument,
  DocumentCreateInput,
  ProjectIssue,
  IssueCreateInput,
  ProjectMember,
} from '../types/project';
import * as projectService from '../services/projectService';

interface ProjectState {
  // ==================== Project State ====================
  projects: Project[];
  projectTotal: number;
  projectsLoading: boolean;
  projectsError: string | null;
  currentProject: Project | null;
  
  // ==================== Milestone State ====================
  milestones: ProjectMilestone[];
  milestonesLoading: boolean;
  milestonesError: string | null;
  
  // ==================== Task State ====================
  tasks: ProjectTask[];
  tasksLoading: boolean;
  tasksError: string | null;
  
  // ==================== Time Entry State ====================
  timeEntries: TimeEntry[];
  timeEntriesLoading: boolean;
  timeEntriesError: string | null;
  
  // ==================== Cost State ====================
  costs: ProjectCost[];
  costsLoading: boolean;
  costsError: string | null;
  
  // ==================== Document State ====================
  documents: ProjectDocument[];
  documentsLoading: boolean;
  documentsError: string | null;
  
  // ==================== Issue State ====================
  issues: ProjectIssue[];
  issuesLoading: boolean;
  issuesError: string | null;
  
  // ==================== Member State ====================
  members: ProjectMember[];
  membersLoading: boolean;
  membersError: string | null;
  
  // ==================== Statistics State ====================
  statistics: ProjectStatistics | null;
  statsLoading: boolean;
  statsError: string | null;
  
  // ==================== Operation State ====================
  operationLoading: boolean;
  operationError: string | null;
  
  // ==================== Project Actions ====================
  fetchProjects: () => Promise<void>;
  fetchProject: (id: number) => Promise<Project>;
  createProject: (input: ProjectCreateInput, createdBy: number) => Promise<Project>;
  updateProject: (id: number, input: ProjectUpdateInput) => Promise<Project>;
  deleteProject: (id: number) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  getProjectsByStatus: (status: string) => Promise<Project[]>;
  
  // ==================== Milestone Actions ====================
  fetchMilestones: (projectId: number) => Promise<void>;
  createMilestone: (projectId: number, input: MilestoneCreateInput, createdBy: number) => Promise<ProjectMilestone>;
  updateMilestone: (id: number, status: string, actualDate: string | null, completionPercentage: number) => Promise<ProjectMilestone>;
  deleteMilestone: (id: number) => Promise<void>;
  
  // ==================== Task Actions ====================
  fetchTasks: (projectId: number) => Promise<void>;
  createTask: (projectId: number, input: ProjectTaskCreateInput, createdBy: number) => Promise<ProjectTask>;
  updateTaskStatus: (id: number, status: string, progressPercentage: number) => Promise<ProjectTask>;
  deleteTask: (id: number) => Promise<void>;
  
  // ==================== Time Entry Actions ====================
  fetchTimeEntries: (projectId: number) => Promise<void>;
  createTimeEntry: (input: TimeEntryCreateInput) => Promise<TimeEntry>;
  approveTimeEntry: (id: number, approvedBy: number) => Promise<TimeEntry>;
  
  // ==================== Cost Actions ====================
  fetchCosts: (projectId: number) => Promise<void>;
  createCost: (projectId: number, input: CostCreateInput, createdBy: number) => Promise<ProjectCost>;
  
  // ==================== Document Actions ====================
  fetchDocuments: (projectId: number) => Promise<void>;
  createDocument: (projectId: number, input: DocumentCreateInput, createdBy: number) => Promise<ProjectDocument>;
  
  // ==================== Issue Actions ====================
  fetchIssues: (projectId: number) => Promise<void>;
  createIssue: (projectId: number, input: IssueCreateInput, createdBy: number) => Promise<ProjectIssue>;
  resolveIssue: (id: number, solution: string) => Promise<ProjectIssue>;
  
  // ==================== Member Actions ====================
  fetchMembers: (projectId: number) => Promise<void>;
  addMember: (projectId: number, employeeId: number, role: string, createdBy: number) => Promise<ProjectMember>;
  removeMember: (id: number) => Promise<void>;
  
  // ==================== Statistics Actions ====================
  fetchStatistics: () => Promise<void>;
  
  // ==================== Utility Actions ====================
  clearError: () => void;
  resetState: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // ==================== Initial State ====================
  projects: [],
  projectTotal: 0,
  projectsLoading: false,
  projectsError: null,
  currentProject: null,
  
  milestones: [],
  milestonesLoading: false,
  milestonesError: null,
  
  tasks: [],
  tasksLoading: false,
  tasksError: null,
  
  timeEntries: [],
  timeEntriesLoading: false,
  timeEntriesError: null,
  
  costs: [],
  costsLoading: false,
  costsError: null,
  
  documents: [],
  documentsLoading: false,
  documentsError: null,
  
  issues: [],
  issuesLoading: false,
  issuesError: null,
  
  members: [],
  membersLoading: false,
  membersError: null,
  
  statistics: null,
  statsLoading: false,
  statsError: null,
  
  operationLoading: false,
  operationError: null,
  
  // ==================== Project Actions ====================
  fetchProjects: async () => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const projects = await projectService.getAllProjects();
      set({
        projects,
        projectTotal: projects.length,
        projectsLoading: false,
      });
    } catch (error) {
      set({
        projectsLoading: false,
        projectsError: error instanceof Error ? error.message : '获取项目列表失败',
      });
      throw error;
    }
  },
  
  fetchProject: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const project = await projectService.getProjectById(id);
      set({ currentProject: project, operationLoading: false });
      return project;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取项目信息失败',
      });
      throw error;
    }
  },
  
  createProject: async (input: ProjectCreateInput, createdBy: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const project = await projectService.createProject(input, createdBy);
      const { projects } = get();
      set({
        projects: [project, ...projects],
        projectTotal: projects.length + 1,
        operationLoading: false,
      });
      return project;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建项目失败',
      });
      throw error;
    }
  },
  
  updateProject: async (id: number, input: ProjectUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const project = await projectService.updateProject(id, input);
      const { projects } = get();
      set({
        projects: projects.map((p) => (p.id === id ? project : p)),
        currentProject: get().currentProject?.id === id ? project : get().currentProject,
        operationLoading: false,
      });
      return project;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新项目失败',
      });
      throw error;
    }
  },
  
  deleteProject: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await projectService.deleteProject(id);
      const { projects } = get();
      set({
        projects: projects.filter((p) => p.id !== id),
        projectTotal: projects.length - 1,
        currentProject: get().currentProject?.id === id ? null : get().currentProject,
        operationLoading: false,
      });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除项目失败',
      });
      throw error;
    }
  },
  
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },
  
  getProjectsByStatus: async (status: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const projects = await projectService.getProjectsByStatus(status);
      set({ projects, projectsLoading: false });
      return projects;
    } catch (error) {
      set({
        projectsLoading: false,
        projectsError: error instanceof Error ? error.message : '获取项目列表失败',
      });
      throw error;
    }
  },
  
  // ==================== Milestone Actions ====================
  fetchMilestones: async (projectId: number) => {
    set({ milestonesLoading: true, milestonesError: null });
    try {
      const milestones = await projectService.getMilestonesByProject(projectId);
      set({ milestones, milestonesLoading: false });
    } catch (error) {
      set({
        milestonesLoading: false,
        milestonesError: error instanceof Error ? error.message : '获取里程碑列表失败',
      });
      throw error;
    }
  },
  
  createMilestone: async (projectId: number, input: MilestoneCreateInput, createdBy: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const milestone = await projectService.createMilestone(projectId, input, createdBy);
      const { milestones } = get();
      set({
        milestones: [...milestones, milestone],
        operationLoading: false,
      });
      return milestone;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建里程碑失败',
      });
      throw error;
    }
  },
  
  updateMilestone: async (id: number, status: string, actualDate: string | null, completionPercentage: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const milestone = await projectService.updateMilestone(id, status, actualDate, completionPercentage);
      const { milestones } = get();
      set({
        milestones: milestones.map((m) => (m.id === id ? milestone : m)),
        operationLoading: false,
      });
      return milestone;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新里程碑失败',
      });
      throw error;
    }
  },
  
  deleteMilestone: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await projectService.deleteMilestone(id);
      const { milestones } = get();
      set({
        milestones: milestones.filter((m) => m.id !== id),
        operationLoading: false,
      });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除里程碑失败',
      });
      throw error;
    }
  },
  
  // ==================== Task Actions ====================
  fetchTasks: async (projectId: number) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const tasks = await projectService.getTasksByProject(projectId);
      set({ tasks, tasksLoading: false });
    } catch (error) {
      set({
        tasksLoading: false,
        tasksError: error instanceof Error ? error.message : '获取任务列表失败',
      });
      throw error;
    }
  },
  
  createTask: async (projectId: number, input: ProjectTaskCreateInput, createdBy: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const task = await projectService.createTask(projectId, input, createdBy);
      const { tasks } = get();
      set({
        tasks: [...tasks, task],
        operationLoading: false,
      });
      return task;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建任务失败',
      });
      throw error;
    }
  },
  
  updateTaskStatus: async (id: number, status: string, progressPercentage: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const task = await projectService.updateTaskStatus(id, status, progressPercentage);
      const { tasks } = get();
      set({
        tasks: tasks.map((t) => (t.id === id ? task : t)),
        operationLoading: false,
      });
      return task;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新任务状态失败',
      });
      throw error;
    }
  },
  
  deleteTask: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await projectService.deleteTask(id);
      const { tasks } = get();
      set({
        tasks: tasks.filter((t) => t.id !== id),
        operationLoading: false,
      });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除任务失败',
      });
      throw error;
    }
  },
  
  // ==================== Time Entry Actions ====================
  fetchTimeEntries: async (projectId: number) => {
    set({ timeEntriesLoading: true, timeEntriesError: null });
    try {
      const entries = await projectService.getTimeEntriesByProject(projectId);
      set({ timeEntries: entries, timeEntriesLoading: false });
    } catch (error) {
      set({
        timeEntriesLoading: false,
        timeEntriesError: error instanceof Error ? error.message : '获取工时记录失败',
      });
      throw error;
    }
  },
  
  createTimeEntry: async (input: TimeEntryCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const entry = await projectService.createTimeEntry(input);
      const { timeEntries } = get();
      set({
        timeEntries: [...timeEntries, entry],
        operationLoading: false,
      });
      return entry;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建工时记录失败',
      });
      throw error;
    }
  },
  
  approveTimeEntry: async (id: number, approvedBy: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const entry = await projectService.approveTimeEntry(id, approvedBy);
      const { timeEntries } = get();
      set({
        timeEntries: timeEntries.map((e) => (e.id === id ? entry : e)),
        operationLoading: false,
      });
      return entry;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '审批工时记录失败',
      });
      throw error;
    }
  },
  
  // ==================== Cost Actions ====================
  fetchCosts: async (projectId: number) => {
    set({ costsLoading: true, costsError: null });
    try {
      const costs = await projectService.getCostsByProject(projectId);
      set({ costs, costsLoading: false });
    } catch (error) {
      set({
        costsLoading: false,
        costsError: error instanceof Error ? error.message : '获取项目成本失败',
      });
      throw error;
    }
  },
  
  createCost: async (projectId: number, input: CostCreateInput, createdBy: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const cost = await projectService.createProjectCost(projectId, input, createdBy);
      const { costs } = get();
      set({
        costs: [...costs, cost],
        operationLoading: false,
      });
      return cost;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建项目成本失败',
      });
      throw error;
    }
  },
  
  // ==================== Document Actions ====================
  fetchDocuments: async (projectId: number) => {
    set({ documentsLoading: true, documentsError: null });
    try {
      const documents = await projectService.getDocumentsByProject(projectId);
      set({ documents, documentsLoading: false });
    } catch (error) {
      set({
        documentsLoading: false,
        documentsError: error instanceof Error ? error.message : '获取项目文档失败',
      });
      throw error;
    }
  },
  
  createDocument: async (projectId: number, input: DocumentCreateInput, createdBy: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const document = await projectService.createProjectDocument(projectId, input, createdBy);
      const { documents } = get();
      set({
        documents: [...documents, document],
        operationLoading: false,
      });
      return document;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建项目文档失败',
      });
      throw error;
    }
  },
  
  // ==================== Issue Actions ====================
  fetchIssues: async (projectId: number) => {
    set({ issuesLoading: true, issuesError: null });
    try {
      const issues = await projectService.getIssuesByProject(projectId);
      set({ issues, issuesLoading: false });
    } catch (error) {
      set({
        issuesLoading: false,
        issuesError: error instanceof Error ? error.message : '获取项目问题失败',
      });
      throw error;
    }
  },
  
  createIssue: async (projectId: number, input: IssueCreateInput, createdBy: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const issue = await projectService.createProjectIssue(projectId, input, createdBy);
      const { issues } = get();
      set({
        issues: [...issues, issue],
        operationLoading: false,
      });
      return issue;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建项目问题失败',
      });
      throw error;
    }
  },
  
  resolveIssue: async (id: number, solution: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const issue = await projectService.resolveProjectIssue(id, solution);
      const { issues } = get();
      set({
        issues: issues.map((i) => (i.id === id ? issue : i)),
        operationLoading: false,
      });
      return issue;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '解决问题失败',
      });
      throw error;
    }
  },
  
  // ==================== Member Actions ====================
  fetchMembers: async (projectId: number) => {
    set({ membersLoading: true, membersError: null });
    try {
      const members = await projectService.getMembersByProject(projectId);
      set({ members, membersLoading: false });
    } catch (error) {
      set({
        membersLoading: false,
        membersError: error instanceof Error ? error.message : '获取项目成员失败',
      });
      throw error;
    }
  },
  
  addMember: async (projectId: number, employeeId: number, role: string, createdBy: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const member = await projectService.addProjectMember(projectId, employeeId, role, createdBy);
      const { members } = get();
      set({
        members: [...members, member],
        operationLoading: false,
      });
      return member;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '添加项目成员失败',
      });
      throw error;
    }
  },
  
  removeMember: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await projectService.removeProjectMember(id);
      const { members } = get();
      set({
        members: members.filter((m) => m.id !== id),
        operationLoading: false,
      });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '移除项目成员失败',
      });
      throw error;
    }
  },
  
  // ==================== Statistics Actions ====================
  fetchStatistics: async () => {
    set({ statsLoading: true, statsError: null });
    try {
      const statistics = await projectService.getProjectStatistics();
      set({ statistics, statsLoading: false });
    } catch (error) {
      set({
        statsLoading: false,
        statsError: error instanceof Error ? error.message : '获取统计数据失败',
      });
      throw error;
    }
  },
  
  // ==================== Utility Actions ====================
  clearError: () => {
    set({
      projectsError: null,
      milestonesError: null,
      tasksError: null,
      timeEntriesError: null,
      costsError: null,
      documentsError: null,
      issuesError: null,
      membersError: null,
      statsError: null,
      operationError: null,
    });
  },
  
  resetState: () => {
    set({
      projects: [],
      projectTotal: 0,
      currentProject: null,
      milestones: [],
      tasks: [],
      timeEntries: [],
      costs: [],
      documents: [],
      issues: [],
      members: [],
      statistics: null,
      projectsError: null,
      milestonesError: null,
      tasksError: null,
      timeEntriesError: null,
      costsError: null,
      documentsError: null,
      issuesError: null,
      membersError: null,
      statsError: null,
      operationError: null,
    });
  },
}));
