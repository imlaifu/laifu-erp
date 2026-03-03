// HR Management API Service
// 人力资源管理服务

import { invoke } from '@tauri-apps/api/core';
import type {
  Employee,
  EmployeeCreateInput,
  EmployeeUpdateInput,
  Department,
  AttendanceRecord,
  LeaveType,
  LeaveApplication,
  LeaveCreateInput,
  LeaveApproveInput,
  SalaryRecord,
  SalaryCreateInput,
  PerformanceEvaluation,
  EvaluationCreateInput,
  TrainingRecord,
  TrainingCreateInput,
  HRStatistics,
  EmployeeFilter,
  AttendanceFilter,
  LeaveFilter,
  SalaryFilter,
  PerformanceFilter,
  TrainingFilter,
} from '../types/hr';

// ==================== Employee APIs ====================

export async function createEmployee(input: EmployeeCreateInput): Promise<Employee> {
  return invoke<Employee>('create_employee', { input });
}

export async function getEmployee(id: number): Promise<Employee> {
  return invoke<Employee>('get_employee', { id });
}

export async function listEmployees(filter: EmployeeFilter = {}): Promise<Employee[]> {
  const { department_id, status, page = 1, pageSize = 50 } = filter;
  return invoke<Employee[]>('list_employees', { 
    departmentId: department_id, 
    status, 
    page, 
    pageSize 
  });
}

export async function updateEmployee(id: number, input: EmployeeUpdateInput): Promise<Employee> {
  return invoke<Employee>('update_employee', { id, input });
}

export async function deleteEmployee(id: number): Promise<void> {
  return invoke<void>('delete_employee', { id });
}

// ==================== Department APIs ====================

export async function getDepartments(): Promise<Department[]> {
  return invoke<Department[]>('get_departments');
}

export async function createDepartment(
  name: string,
  code?: string,
  parentId?: number,
  description?: string
): Promise<Department> {
  return invoke<Department>('create_department', { name, code, parentId, description });
}

// ==================== Attendance APIs ====================

export async function getAttendanceRecords(filter: AttendanceFilter): Promise<AttendanceRecord[]> {
  return invoke<AttendanceRecord[]>('get_attendance_records', {
    employeeId: filter.employee_id,
    startDate: filter.start_date,
    endDate: filter.end_date,
  });
}

export async function checkIn(employeeId: number, location?: string): Promise<AttendanceRecord> {
  return invoke<AttendanceRecord>('check_in', { employeeId, location });
}

export async function checkOut(employeeId: number, location?: string): Promise<AttendanceRecord> {
  return invoke<AttendanceRecord>('check_out', { employeeId, location });
}

// ==================== Leave APIs ====================

export async function getLeaveTypes(): Promise<LeaveType[]> {
  return invoke<LeaveType[]>('get_leave_types');
}

export async function getLeaveApplications(filter: LeaveFilter = {}): Promise<LeaveApplication[]> {
  const { employee_id, status } = filter;
  return invoke<LeaveApplication[]>('get_leave_applications', { 
    employeeId: employee_id, 
    status 
  });
}

export async function createLeaveApplication(input: LeaveCreateInput): Promise<LeaveApplication> {
  return invoke<LeaveApplication>('create_leave_application', { input });
}

export async function approveLeaveApplication(input: LeaveApproveInput): Promise<LeaveApplication> {
  return invoke<LeaveApplication>('approve_leave_application', { input });
}

// ==================== Salary APIs ====================

export async function getSalaryRecords(filter: SalaryFilter = {}): Promise<SalaryRecord[]> {
  const { employee_id, year_month } = filter;
  return invoke<SalaryRecord[]>('get_salary_records', { 
    employeeId: employee_id, 
    yearMonth: year_month 
  });
}

export async function createSalaryRecord(input: SalaryCreateInput): Promise<SalaryRecord> {
  return invoke<SalaryRecord>('create_salary_record', { input });
}

export async function paySalary(salaryId: number): Promise<SalaryRecord> {
  return invoke<SalaryRecord>('pay_salary', { salaryId });
}

// ==================== Performance APIs ====================

export async function getPerformanceEvaluations(filter: PerformanceFilter = {}): Promise<PerformanceEvaluation[]> {
  const { employee_id, evaluation_period, status } = filter;
  return invoke<PerformanceEvaluation[]>('get_performance_evaluations', { 
    employeeId: employee_id,
    evaluationPeriod: evaluation_period,
    status
  });
}

export async function createPerformanceEvaluation(input: EvaluationCreateInput): Promise<PerformanceEvaluation> {
  return invoke<PerformanceEvaluation>('create_performance_evaluation', { input });
}

export async function submitEvaluation(
  evaluationId: number,
  finalScore: number,
  rating: string
): Promise<PerformanceEvaluation> {
  return invoke<PerformanceEvaluation>('submit_evaluation', { 
    evaluationId, 
    finalScore, 
    rating 
  });
}

// ==================== Training APIs ====================

export async function getTrainingRecords(filter: TrainingFilter = {}): Promise<TrainingRecord[]> {
  const { employee_id, training_type, status } = filter;
  return invoke<TrainingRecord[]>('get_training_records', { 
    employeeId: employee_id,
    trainingType: training_type,
    status
  });
}

export async function createTrainingRecord(input: TrainingCreateInput): Promise<TrainingRecord> {
  return invoke<TrainingRecord>('create_training_record', { input });
}

// ==================== Statistics APIs ====================

export async function getHRStatistics(): Promise<HRStatistics> {
  return invoke<HRStatistics>('get_hr_statistics');
}

// ==================== Helper Functions ====================

export function formatEmployeeName(employee: Employee): string {
  return `${employee.name} (${employee.employee_no})`;
}

export function formatSalary(salary: number): string {
  return `¥${salary.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatAttendanceHours(record: AttendanceRecord): string {
  const workHours = record.work_hours.toFixed(1);
  const overtimeHours = record.overtime_hours > 0 ? ` (+${record.overtime_hours.toFixed(1)} OT)` : '';
  return `${workHours}h${overtimeHours}`;
}

export function getLeaveStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待审批',
    approved: '已批准',
    rejected: '已拒绝',
    cancelled: '已取消',
  };
  return statusMap[status] || status;
}

export function getEmploymentStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    active: '在职',
    probation: '试用期',
    terminated: '已离职',
    suspended: '停职',
  };
  return statusMap[status] || status;
}

export function getPerformanceRatingLabel(rating: string): string {
  const ratingMap: Record<string, string> = {
    S: '卓越',
    A: '优秀',
    B: '良好',
    C: '合格',
    D: '待改进',
  };
  return ratingMap[rating] || rating;
}
