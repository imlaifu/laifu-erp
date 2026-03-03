// Project Management Service
// 项目管理 API 服务层

import { invoke } from '@tauri-apps/api/core';
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

// ==================== Project CRUD ====================

/**
 * 创建项目
 */
export async function createProject(input: ProjectCreateInput, createdBy: number): Promise<Project> {
  return invoke<Project>('create_project', { input, createdBy });
}

/**
 * 获取项目详情
 */
export async function getProjectById(id: number): Promise<Project> {
  return invoke<Project>('get_project_by_id', { id });
}

/**
 * 获取所有项目
 */
export async function getAllProjects(): Promise<Project[]> {
  return invoke<Project[]>('get_all_projects');
}

/**
 * 更新项目
 */
export async function updateProject(id: number, input: ProjectUpdateInput): Promise<Project> {
  return invoke<Project>('update_project', { id, input });
}

/**
 * 删除项目
 */
export async function deleteProject(id: number): Promise<boolean> {
  return invoke<boolean>('delete_project', { id });
}

/**
 * 按状态获取项目
 */
export async function getProjectsByStatus(status: string): Promise<Project[]> {
  return invoke<Project[]>('get_projects_by_status', { status });
}

/**
 * 获取项目统计信息
 */
export async function getProjectStatistics(): Promise<ProjectStatistics> {
  return invoke<ProjectStatistics>('get_project_statistics');
}

// ==================== Milestone CRUD ====================

/**
 * 创建里程碑
 */
export async function createMilestone(
  projectId: number,
  input: MilestoneCreateInput,
  createdBy: number
): Promise<ProjectMilestone> {
  return invoke<ProjectMilestone>('create_milestone', { projectId, input, createdBy });
}

/**
 * 获取里程碑详情
 */
export async function getMilestoneById(id: number): Promise<ProjectMilestone> {
  return invoke<ProjectMilestone>('get_milestone_by_id', { id });
}

/**
 * 获取项目的所有里程碑
 */
export async function getMilestonesByProject(projectId: number): Promise<ProjectMilestone[]> {
  return invoke<ProjectMilestone[]>('get_milestones_by_project', { projectId });
}

/**
 * 更新里程碑状态
 */
export async function updateMilestone(
  id: number,
  status: string,
  actualDate: string | null,
  completionPercentage: number
): Promise<ProjectMilestone> {
  return invoke<ProjectMilestone>('update_milestone', { id, status, actualDate, completionPercentage });
}

/**
 * 删除里程碑
 */
export async function deleteMilestone(id: number): Promise<boolean> {
  return invoke<boolean>('delete_milestone', { id });
}

// ==================== Task CRUD ====================

/**
 * 创建任务
 */
export async function createTask(
  projectId: number,
  input: ProjectTaskCreateInput,
  createdBy: number
): Promise<ProjectTask> {
  return invoke<ProjectTask>('create_task', { projectId, input, createdBy });
}

/**
 * 获取任务详情
 */
export async function getTaskById(id: number): Promise<ProjectTask> {
  return invoke<ProjectTask>('get_task_by_id', { id });
}

/**
 * 获取项目的所有任务
 */
export async function getTasksByProject(projectId: number): Promise<ProjectTask[]> {
  return invoke<ProjectTask[]>('get_tasks_by_project', { projectId });
}

/**
 * 更新任务状态
 */
export async function updateTaskStatus(
  id: number,
  status: string,
  progressPercentage: number
): Promise<ProjectTask> {
  return invoke<ProjectTask>('update_task_status', { id, status, progressPercentage });
}

/**
 * 删除任务
 */
export async function deleteTask(id: number): Promise<boolean> {
  return invoke<boolean>('delete_task', { id });
}

// ==================== Time Entry CRUD ====================

/**
 * 创建工时记录
 */
export async function createTimeEntry(input: TimeEntryCreateInput): Promise<TimeEntry> {
  return invoke<TimeEntry>('create_time_entry', { input });
}

/**
 * 获取工时记录详情
 */
export async function getTimeEntryById(id: number): Promise<TimeEntry> {
  return invoke<TimeEntry>('get_time_entry_by_id', { id });
}

/**
 * 获取项目的所有工时记录
 */
export async function getTimeEntriesByProject(projectId: number): Promise<TimeEntry[]> {
  return invoke<TimeEntry[]>('get_time_entries_by_project', { projectId });
}

/**
 * 审批工时记录
 */
export async function approveTimeEntry(id: number, approvedBy: number): Promise<TimeEntry> {
  return invoke<TimeEntry>('approve_time_entry', { id, approvedBy });
}

// ==================== Project Cost CRUD ====================

/**
 * 创建项目成本
 */
export async function createProjectCost(
  projectId: number,
  input: CostCreateInput,
  createdBy: number
): Promise<ProjectCost> {
  return invoke<ProjectCost>('create_project_cost', { projectId, input, createdBy });
}

/**
 * 获取项目成本详情
 */
export async function getProjectCostById(id: number): Promise<ProjectCost> {
  return invoke<ProjectCost>('get_project_cost_by_id', { id });
}

/**
 * 获取项目的所有成本
 */
export async function getCostsByProject(projectId: number): Promise<ProjectCost[]> {
  return invoke<ProjectCost[]>('get_costs_by_project', { projectId });
}

// ==================== Project Document CRUD ====================

/**
 * 创建项目文档
 */
export async function createProjectDocument(
  projectId: number,
  input: DocumentCreateInput,
  createdBy: number
): Promise<ProjectDocument> {
  return invoke<ProjectDocument>('create_project_document', { projectId, input, createdBy });
}

/**
 * 获取项目文档详情
 */
export async function getProjectDocumentById(id: number): Promise<ProjectDocument> {
  return invoke<ProjectDocument>('get_project_document_by_id', { id });
}

/**
 * 获取项目的所有文档
 */
export async function getDocumentsByProject(projectId: number): Promise<ProjectDocument[]> {
  return invoke<ProjectDocument[]>('get_documents_by_project', { projectId });
}

// ==================== Project Issue CRUD ====================

/**
 * 创建项目问题/风险
 */
export async function createProjectIssue(
  projectId: number,
  input: IssueCreateInput,
  createdBy: number
): Promise<ProjectIssue> {
  return invoke<ProjectIssue>('create_project_issue', { projectId, input, createdBy });
}

/**
 * 获取项目问题详情
 */
export async function getProjectIssueById(id: number): Promise<ProjectIssue> {
  return invoke<ProjectIssue>('get_project_issue_by_id', { id });
}

/**
 * 获取项目的所有问题
 */
export async function getIssuesByProject(projectId: number): Promise<ProjectIssue[]> {
  return invoke<ProjectIssue[]>('get_issues_by_project', { projectId });
}

/**
 * 解决项目问题
 */
export async function resolveProjectIssue(id: number, solution: string): Promise<ProjectIssue> {
  return invoke<ProjectIssue>('resolve_project_issue', { id, solution });
}

// ==================== Project Member CRUD ====================

/**
 * 添加项目成员
 */
export async function addProjectMember(
  projectId: number,
  employeeId: number,
  role: string,
  createdBy: number
): Promise<ProjectMember> {
  return invoke<ProjectMember>('add_project_member', { projectId, employeeId, role, createdBy });
}

/**
 * 获取项目成员详情
 */
export async function getProjectMemberById(id: number): Promise<ProjectMember> {
  return invoke<ProjectMember>('get_project_member_by_id', { id });
}

/**
 * 获取项目的所有成员
 */
export async function getMembersByProject(projectId: number): Promise<ProjectMember[]> {
  return invoke<ProjectMember[]>('get_members_by_project', { projectId });
}

/**
 * 移除项目成员
 */
export async function removeProjectMember(id: number): Promise<boolean> {
  return invoke<boolean>('remove_project_member', { id });
}

// ==================== Helper Functions ====================

/**
 * 获取项目状态中文名称
 */
export function getProjectStatusName(status: string): string {
  const statusMap: Record<string, string> = {
    planning: '规划中',
    active: '进行中',
    on_hold: '已暂停',
    completed: '已完成',
    cancelled: '已取消',
  };
  return statusMap[status] || status;
}

/**
 * 获取项目优先级中文名称
 */
export function getProjectPriorityName(priority: string): string {
  const priorityMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '紧急',
  };
  return priorityMap[priority] || priority;
}

/**
 * 获取任务状态中文名称
 */
export function getTaskStatusName(status: string): string {
  const statusMap: Record<string, string> = {
    todo: '待办',
    in_progress: '进行中',
    review: '审核中',
    testing: '测试中',
    done: '已完成',
    blocked: '已阻塞',
  };
  return statusMap[status] || status;
}

/**
 * 获取里程碑状态中文名称
 */
export function getMilestoneStatusName(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待开始',
    in_progress: '进行中',
    completed: '已完成',
    skipped: '已跳过',
  };
  return statusMap[status] || status;
}

/**
 * 格式化项目预算显示
 */
export function formatBudget(amount: number, currency: string = 'CNY'): string {
  const currencySymbols: Record<string, string> = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
  };
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * 计算项目进度
 */
export function calculateProjectProgress(
  completedTasks: number,
  totalTasks: number
): number {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
}

/**
 * 检查项目是否逾期
 */
export function isProjectOverdue(endDate: string | null, status: string): boolean {
  if (!endDate || status === 'completed') return false;
  const end = new Date(endDate);
  const today = new Date();
  return end < today;
}
