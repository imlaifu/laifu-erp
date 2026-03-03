// HR Management Module TypeScript Types
// 人力资源管理模块类型定义

// ==================== Employee Types ====================

export interface Employee {
  id: number;
  employee_no: string;
  name: string;
  gender: string;
  birth_date: string | null;
  id_card: string | null;
  phone: string | null;
  email: string | null;
  department_id: number | null;
  position: string | null;
  job_title: string | null;
  employment_type: string;
  employment_status: string;
  hire_date: string | null;
  termination_date: string | null;
  base_salary: number;
  bank_account: string | null;
  bank_name: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  address: string | null;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeCreateInput {
  employee_no: string;
  name: string;
  gender?: string;
  birth_date?: string;
  id_card?: string;
  phone?: string;
  email?: string;
  department_id?: number;
  position?: string;
  job_title?: string;
  employment_type?: string;
  hire_date?: string;
  base_salary?: number;
  bank_account?: string;
  bank_name?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  address?: string;
  notes?: string;
}

export interface EmployeeUpdateInput {
  name?: string;
  gender?: string;
  birth_date?: string;
  id_card?: string;
  phone?: string;
  email?: string;
  department_id?: number;
  position?: string;
  job_title?: string;
  employment_type?: string;
  employment_status?: string;
  termination_date?: string;
  base_salary?: number;
  bank_account?: string;
  bank_name?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  address?: string;
  notes?: string;
}

// ==================== Department Types ====================

export interface Department {
  id: number;
  name: string;
  code: string | null;
  parent_id: number | null;
  manager_id: number | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ==================== Attendance Types ====================

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  work_hours: number;
  overtime_hours: number;
  status: string;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type AttendanceStatus = 'normal' | 'late' | 'early_leave' | 'absent' | 'half_day';

// ==================== Leave Types ====================

export interface LeaveType {
  id: number;
  name: string;
  code: string;
  days_per_year: number;
  paid: number;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveApplication {
  id: number;
  employee_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string | null;
  status: string;
  approver_id: number | null;
  approval_date: string | null;
  approval_notes: string | null;
  attachment_url: string | null;
  created_at: string;
  updated_at: string;
  employee_name?: string;
  employee_no?: string;
}

export interface LeaveCreateInput {
  employee_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason?: string;
}

export interface LeaveApproveInput {
  leave_id: number;
  approved: boolean;
  approval_notes?: string;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

// ==================== Salary Types ====================

export interface SalaryRecord {
  id: number;
  employee_id: number;
  year_month: string;
  base_salary: number;
  performance_bonus: number;
  overtime_pay: number;
  allowance: number;
  deduction: number;
  social_security: number;
  housing_fund: number;
  tax: number;
  actual_salary: number;
  payment_date: string | null;
  payment_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  employee_name?: string;
  employee_no?: string;
}

export interface SalaryCreateInput {
  employee_id: number;
  year_month: string;
  base_salary: number;
  performance_bonus?: number;
  overtime_pay?: number;
  allowance?: number;
  deduction?: number;
  social_security?: number;
  housing_fund?: number;
  tax?: number;
  notes?: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed';

// ==================== Performance Types ====================

export interface PerformanceEvaluation {
  id: number;
  employee_id: number;
  evaluation_period: string;
  evaluator_id: number | null;
  self_score: number | null;
  manager_score: number | null;
  final_score: number | null;
  rating: string | null;
  strengths: string | null;
  weaknesses: string | null;
  goals: string | null;
  status: string;
  review_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  employee_name?: string;
  evaluator_name?: string;
}

export interface EvaluationCreateInput {
  employee_id: number;
  evaluation_period: string;
  evaluator_id?: number;
  self_score?: number;
  manager_score?: number;
  strengths?: string;
  weaknesses?: string;
  goals?: string;
}

export type EvaluationStatus = 'draft' | 'submitted' | 'completed' | 'archived';
export type PerformanceRating = 'S' | 'A' | 'B' | 'C' | 'D';

// ==================== Training Types ====================

export interface TrainingRecord {
  id: number;
  employee_id: number;
  training_name: string;
  training_type: string | null;
  start_date: string | null;
  end_date: string | null;
  hours: number;
  trainer: string | null;
  location: string | null;
  cost: number;
  status: string;
  certificate_url: string | null;
  score: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  employee_name?: string;
}

export interface TrainingCreateInput {
  employee_id: number;
  training_name: string;
  training_type?: string;
  start_date?: string;
  end_date?: string;
  hours?: number;
  trainer?: string;
  location?: string;
  cost?: number;
  notes?: string;
}

export type TrainingStatus = 'planned' | 'ongoing' | 'completed' | 'cancelled';

// ==================== Statistics Types ====================

export interface HRStatistics {
  total_employees: number;
  active_employees: number;
  new_hires_this_month: number;
  terminations_this_month: number;
  total_departments: number;
  pending_leaves: number;
  total_payroll: number;
}

export interface HRDashboardData {
  statistics: HRStatistics;
  recentHires: Employee[];
  pendingLeaves: LeaveApplication[];
  upcomingBirthdays: Employee[];
  attendanceRate: number;
}

// ==================== Filter & Query Types ====================

export interface EmployeeFilter {
  department_id?: number;
  status?: string;
  employment_type?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface AttendanceFilter {
  employee_id: number;
  start_date: string;
  end_date: string;
}

export interface LeaveFilter {
  employee_id?: number;
  status?: string;
  leave_type?: string;
}

export interface SalaryFilter {
  employee_id?: number;
  year_month?: string;
}

export interface PerformanceFilter {
  employee_id?: number;
  evaluation_period?: string;
  status?: string;
}

export interface TrainingFilter {
  employee_id?: number;
  training_type?: string;
  status?: string;
}
