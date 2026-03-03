// Project Management Module Types
// 项目管理模块类型定义

// ==================== Project ====================

export interface Project {
  id: number;
  project_no: string;
  name: string;
  code: string | null;
  category: string | null;
  type: string | null;
  industry: string | null;
  description: string | null;
  objectives: string | null;
  deliverables: string | null;
  status: string;
  priority: string;
  start_date: string | null;
  end_date: string | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  budget: number;
  actual_cost: number;
  currency: string;
  customer_id: number | null;
  customer_contact: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  owner_id: number;
  manager_id: number | null;
  team_member_ids: string | null;
  progress_percentage: number;
  milestone_count: number;
  completed_milestone_count: number;
  task_count: number;
  completed_task_count: number;
  risk_level: string;
  issues_count: number;
  parent_project_id: number | null;
  is_template: number;
  template_id: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreateInput {
  project_no: string;
  name: string;
  code?: string | null;
  category?: string | null;
  type?: string | null;
  industry?: string | null;
  description?: string | null;
  objectives?: string | null;
  deliverables?: string | null;
  priority?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  currency?: string | null;
  customer_id?: number | null;
  customer_contact?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  manager_id?: number | null;
  team_member_ids?: string | null;
  parent_project_id?: number | null;
  is_template?: number | null;
}

export interface ProjectUpdateInput {
  name?: string | null;
  code?: string | null;
  category?: string | null;
  type?: string | null;
  industry?: string | null;
  description?: string | null;
  objectives?: string | null;
  deliverables?: string | null;
  status?: string | null;
  priority?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  budget?: number | null;
  actual_cost?: number | null;
  progress_percentage?: number | null;
  risk_level?: string | null;
  manager_id?: number | null;
  team_member_ids?: string | null;
}

export interface ProjectStatistics {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  on_hold_projects: number;
  total_tasks: number;
  completed_tasks: number;
  total_hours_logged: number;
  total_budget: number;
  total_actual_cost: number;
}

// ==================== Milestone ====================

export interface ProjectMilestone {
  id: number;
  project_id: number;
  milestone_no: string;
  name: string;
  description: string | null;
  planned_date: string;
  actual_date: string | null;
  status: string;
  completion_percentage: number;
  deliverables: string | null;
  acceptance_criteria: string | null;
  accepted_by: number | null;
  accepted_at: string | null;
  acceptance_notes: string | null;
  sort_order: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface MilestoneCreateInput {
  milestone_no: string;
  name: string;
  description?: string | null;
  planned_date: string;
  deliverables?: string | null;
  acceptance_criteria?: string | null;
  sort_order?: number | null;
}

// ==================== Task ====================

export interface ProjectTask {
  id: number;
  project_id: number;
  task_no: string;
  name: string;
  description: string | null;
  phase: string | null;
  category: string | null;
  type: string | null;
  status: string;
  priority: string;
  severity: string | null;
  estimated_hours: number;
  actual_hours: number;
  remaining_hours: number;
  start_date: string | null;
  due_date: string | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  assignee_id: number | null;
  reporter_id: number | null;
  parent_task_id: number | null;
  dependency_ids: string | null;
  milestone_id: number | null;
  progress_percentage: number;
  tags: string | null;
  iteration: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectTaskCreateInput {
  task_no: string;
  name: string;
  description?: string | null;
  phase?: string | null;
  category?: string | null;
  type?: string | null;
  priority?: string | null;
  severity?: string | null;
  estimated_hours?: number | null;
  start_date?: string | null;
  due_date?: string | null;
  assignee_id?: number | null;
  milestone_id?: number | null;
  parent_task_id?: number | null;
}

// ==================== Time Entry ====================

export interface TimeEntry {
  id: number;
  employee_id: number;
  project_id: number;
  task_id: number | null;
  entry_date: string;
  start_time: string | null;
  end_time: string | null;
  duration_hours: number;
  work_type: string;
  billable: number;
  description: string;
  work_category: string | null;
  status: string;
  approved_by: number | null;
  approved_at: string | null;
  rejection_reason: string | null;
  hourly_rate: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface TimeEntryCreateInput {
  employee_id: number;
  project_id: number;
  task_id?: number | null;
  entry_date: string;
  start_time?: string | null;
  end_time?: string | null;
  duration_hours: number;
  work_type?: string | null;
  billable?: number | null;
  description: string;
  work_category?: string | null;
  hourly_rate?: number | null;
}

// ==================== Project Cost ====================

export interface ProjectCost {
  id: number;
  project_id: number;
  category: string;
  sub_category: string | null;
  name: string;
  description: string | null;
  planned_amount: number;
  actual_amount: number;
  currency: string;
  cost_date: string | null;
  payment_date: string | null;
  status: string;
  vendor_id: number | null;
  invoice_no: string | null;
  related_task_id: number | null;
  approved_by: number | null;
  approved_at: string | null;
  notes: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CostCreateInput {
  category: string;
  sub_category?: string | null;
  name: string;
  description?: string | null;
  planned_amount?: number | null;
  actual_amount?: number | null;
  currency?: string | null;
  cost_date?: string | null;
  payment_date?: string | null;
  vendor_id?: number | null;
  invoice_no?: string | null;
  related_task_id?: number | null;
}

// ==================== Project Document ====================

export interface ProjectDocument {
  id: number;
  project_id: number;
  task_id: number | null;
  name: string;
  description: string | null;
  category: string | null;
  document_type: string | null;
  file_url: string;
  file_size_bytes: number | null;
  file_hash: string | null;
  version: string;
  version_notes: string | null;
  is_latest: number;
  visibility: string;
  access_level: string;
  status: string;
  reviewed_by: number | null;
  reviewed_at: string | null;
  download_count: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentCreateInput {
  task_id?: number | null;
  name: string;
  description?: string | null;
  category?: string | null;
  document_type?: string | null;
  file_url: string;
  file_size_bytes?: number | null;
  file_hash?: string | null;
  version?: string | null;
  version_notes?: string | null;
  visibility?: string | null;
  access_level?: string | null;
}

// ==================== Project Issue ====================

export interface ProjectIssue {
  id: number;
  project_id: number;
  issue_no: string;
  title: string;
  description: string;
  type: string | null;
  category: string | null;
  status: string;
  priority: string;
  severity: string;
  assignee_id: number | null;
  reporter_id: number | null;
  reported_date: string;
  resolved_date: string | null;
  due_date: string | null;
  solution: string | null;
  resolution_notes: string | null;
  impact_description: string | null;
  impact_cost: number;
  impact_days: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface IssueCreateInput {
  issue_no: string;
  title: string;
  description: string;
  type?: string | null;
  category?: string | null;
  priority?: string | null;
  severity?: string | null;
  assignee_id?: number | null;
  reporter_id?: number | null;
  due_date?: string | null;
  impact_cost?: number | null;
  impact_days?: number | null;
}

// ==================== Project Member ====================

export interface ProjectMember {
  id: number;
  project_id: number;
  employee_id: number;
  role: string;
  responsibilities: string | null;
  allocation_percentage: number;
  start_date: string | null;
  end_date: string | null;
  access_level: string;
  status: string;
  joined_at: string;
  left_at: string | null;
  created_by: number;
  created_at: string;
}

// ==================== Enums & Constants ====================

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PROJECT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const PROJECT_CATEGORY = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
  RESEARCH: 'research',
  PRODUCT: 'product',
} as const;

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  TESTING: 'testing',
  DONE: 'done',
  BLOCKED: 'blocked',
} as const;

export const MILESTONE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
} as const;

export const TIME_ENTRY_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const ISSUE_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REJECTED: 'rejected',
} as const;

// ==================== Type Guards ====================

export function isActiveProject(project: Project): boolean {
  return project.status === PROJECT_STATUS.ACTIVE;
}

export function isCompletedProject(project: Project): boolean {
  return project.status === PROJECT_STATUS.COMPLETED;
}

export function isOverdueProject(project: Project): boolean {
  if (!project.end_date) return false;
  const endDate = new Date(project.end_date);
  const today = new Date();
  return endDate < today && project.status !== PROJECT_STATUS.COMPLETED;
}

export function getProjectProgress(project: Project): number {
  return project.progress_percentage || 0;
}

export function isHighPriorityProject(project: Project): boolean {
  return project.priority === PROJECT_PRIORITY.HIGH || project.priority === PROJECT_PRIORITY.CRITICAL;
}
