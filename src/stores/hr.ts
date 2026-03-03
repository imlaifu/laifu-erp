// HR Management Module Zustand Store
// 人力资源管理模块状态管理

import { create } from 'zustand';
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
  HRDashboardData,
  EmployeeFilter,
  AttendanceFilter,
  LeaveFilter,
  SalaryFilter,
  PerformanceFilter,
  TrainingFilter,
} from '../types/hr';
import * as hrService from '../services/hrService';

interface HRState {
  // ==================== Employee State ====================
  employees: Employee[];
  employeeTotal: number;
  employeesLoading: boolean;
  employeesError: string | null;
  currentEmployee: Employee | null;
  
  // ==================== Department State ====================
  departments: Department[];
  departmentsLoading: boolean;
  departmentsError: string | null;
  
  // ==================== Attendance State ====================
  attendanceRecords: AttendanceRecord[];
  attendanceLoading: boolean;
  attendanceError: string | null;
  
  // ==================== Leave State ====================
  leaveTypes: LeaveType[];
  leaveTypesLoading: boolean;
  leaveTypesError: string | null;
  leaveApplications: LeaveApplication[];
  leavesLoading: boolean;
  leavesError: string | null;
  
  // ==================== Salary State ====================
  salaryRecords: SalaryRecord[];
  salaryLoading: boolean;
  salaryError: string | null;
  
  // ==================== Performance State ====================
  performanceEvaluations: PerformanceEvaluation[];
  performanceLoading: boolean;
  performanceError: string | null;
  
  // ==================== Training State ====================
  trainingRecords: TrainingRecord[];
  trainingLoading: boolean;
  trainingError: string | null;
  
  // ==================== Statistics State ====================
  statistics: HRStatistics | null;
  dashboardData: HRDashboardData | null;
  statsLoading: boolean;
  statsError: string | null;
  
  // ==================== Operation State ====================
  operationLoading: boolean;
  operationError: string | null;
  
  // ==================== Employee Actions ====================
  fetchEmployees: (filter?: EmployeeFilter) => Promise<void>;
  fetchEmployee: (id: number) => Promise<Employee>;
  createEmployee: (input: EmployeeCreateInput) => Promise<Employee>;
  updateEmployee: (id: number, input: EmployeeUpdateInput) => Promise<Employee>;
  deleteEmployee: (id: number) => Promise<void>;
  setCurrentEmployee: (employee: Employee | null) => void;
  
  // ==================== Department Actions ====================
  fetchDepartments: () => Promise<void>;
  createDepartment: (name: string, code?: string, parentId?: number, description?: string) => Promise<Department>;
  
  // ==================== Attendance Actions ====================
  fetchAttendanceRecords: (filter: AttendanceFilter) => Promise<void>;
  checkIn: (employeeId: number, location?: string) => Promise<AttendanceRecord>;
  checkOut: (employeeId: number, location?: string) => Promise<AttendanceRecord>;
  
  // ==================== Leave Actions ====================
  fetchLeaveTypes: () => Promise<void>;
  fetchLeaveApplications: (filter?: LeaveFilter) => Promise<void>;
  createLeaveApplication: (input: LeaveCreateInput) => Promise<LeaveApplication>;
  approveLeaveApplication: (input: LeaveApproveInput) => Promise<LeaveApplication>;
  
  // ==================== Salary Actions ====================
  fetchSalaryRecords: (filter?: SalaryFilter) => Promise<void>;
  createSalaryRecord: (input: SalaryCreateInput) => Promise<SalaryRecord>;
  paySalary: (salaryId: number) => Promise<SalaryRecord>;
  
  // ==================== Performance Actions ====================
  fetchPerformanceEvaluations: (filter?: PerformanceFilter) => Promise<void>;
  createPerformanceEvaluation: (input: EvaluationCreateInput) => Promise<PerformanceEvaluation>;
  submitEvaluation: (evaluationId: number, finalScore: number, rating: string) => Promise<PerformanceEvaluation>;
  
  // ==================== Training Actions ====================
  fetchTrainingRecords: (filter?: TrainingFilter) => Promise<void>;
  createTrainingRecord: (input: TrainingCreateInput) => Promise<TrainingRecord>;
  
  // ==================== Statistics Actions ====================
  fetchStatistics: () => Promise<void>;
  fetchDashboardData: () => Promise<void>;
  
  // ==================== Utility Actions ====================
  clearError: () => void;
  resetState: () => void;
}

export const useHRStore = create<HRState>((set, get) => ({
  // ==================== Initial State ====================
  employees: [],
  employeeTotal: 0,
  employeesLoading: false,
  employeesError: null,
  currentEmployee: null,
  
  departments: [],
  departmentsLoading: false,
  departmentsError: null,
  
  attendanceRecords: [],
  attendanceLoading: false,
  attendanceError: null,
  
  leaveTypes: [],
  leaveTypesLoading: false,
  leaveTypesError: null,
  leaveApplications: [],
  leavesLoading: false,
  leavesError: null,
  
  salaryRecords: [],
  salaryLoading: false,
  salaryError: null,
  
  performanceEvaluations: [],
  performanceLoading: false,
  performanceError: null,
  
  trainingRecords: [],
  trainingLoading: false,
  trainingError: null,
  
  statistics: null,
  dashboardData: null,
  statsLoading: false,
  statsError: null,
  
  operationLoading: false,
  operationError: null,
  
  // ==================== Employee Actions ====================
  fetchEmployees: async (filter?: EmployeeFilter) => {
    set({ employeesLoading: true, employeesError: null });
    try {
      const employees = await hrService.listEmployees(filter);
      set({
        employees,
        employeeTotal: employees.length,
        employeesLoading: false,
      });
    } catch (error) {
      set({
        employeesLoading: false,
        employeesError: error instanceof Error ? error.message : '获取员工列表失败',
      });
      throw error;
    }
  },
  
  fetchEmployee: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const employee = await hrService.getEmployee(id);
      set({ currentEmployee: employee, operationLoading: false });
      return employee;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取员工信息失败',
      });
      throw error;
    }
  },
  
  createEmployee: async (input: EmployeeCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const employee = await hrService.createEmployee(input);
      const { employees } = get();
      set({
        employees: [employee, ...employees],
        employeeTotal: employees.length + 1,
        operationLoading: false,
      });
      return employee;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建员工失败',
      });
      throw error;
    }
  },
  
  updateEmployee: async (id: number, input: EmployeeUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const employee = await hrService.updateEmployee(id, input);
      const { employees } = get();
      set({
        employees: employees.map((e) => (e.id === id ? employee : e)),
        currentEmployee: get().currentEmployee?.id === id ? employee : get().currentEmployee,
        operationLoading: false,
      });
      return employee;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新员工信息失败',
      });
      throw error;
    }
  },
  
  deleteEmployee: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await hrService.deleteEmployee(id);
      const { employees } = get();
      set({
        employees: employees.filter((e) => e.id !== id),
        employeeTotal: employees.length - 1,
        currentEmployee: get().currentEmployee?.id === id ? null : get().currentEmployee,
        operationLoading: false,
      });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除员工失败',
      });
      throw error;
    }
  },
  
  setCurrentEmployee: (employee) => {
    set({ currentEmployee: employee });
  },
  
  // ==================== Department Actions ====================
  fetchDepartments: async () => {
    set({ departmentsLoading: true, departmentsError: null });
    try {
      const departments = await hrService.getDepartments();
      set({ departments, departmentsLoading: false });
    } catch (error) {
      set({
        departmentsLoading: false,
        departmentsError: error instanceof Error ? error.message : '获取部门列表失败',
      });
      throw error;
    }
  },
  
  createDepartment: async (name, code, parentId, description) => {
    set({ operationLoading: true, operationError: null });
    try {
      const department = await hrService.createDepartment(name, code, parentId, description);
      const { departments } = get();
      set({
        departments: [...departments, department],
        operationLoading: false,
      });
      return department;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建部门失败',
      });
      throw error;
    }
  },
  
  // ==================== Attendance Actions ====================
  fetchAttendanceRecords: async (filter: AttendanceFilter) => {
    set({ attendanceLoading: true, attendanceError: null });
    try {
      const records = await hrService.getAttendanceRecords(filter);
      set({ attendanceRecords: records, attendanceLoading: false });
    } catch (error) {
      set({
        attendanceLoading: false,
        attendanceError: error instanceof Error ? error.message : '获取考勤记录失败',
      });
      throw error;
    }
  },
  
  checkIn: async (employeeId, location) => {
    set({ operationLoading: true, operationError: null });
    try {
      const record = await hrService.checkIn(employeeId, location);
      const { attendanceRecords } = get();
      set({
        attendanceRecords: [record, ...attendanceRecords],
        operationLoading: false,
      });
      return record;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '打卡失败',
      });
      throw error;
    }
  },
  
  checkOut: async (employeeId, location) => {
    set({ operationLoading: true, operationError: null });
    try {
      const record = await hrService.checkOut(employeeId, location);
      const { attendanceRecords } = get();
      set({
        attendanceRecords: attendanceRecords.map((r) =>
          r.id === record.id ? record : r
        ),
        operationLoading: false,
      });
      return record;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '签退失败',
      });
      throw error;
    }
  },
  
  // ==================== Leave Actions ====================
  fetchLeaveTypes: async () => {
    set({ leaveTypesLoading: true, leaveTypesError: null });
    try {
      const leaveTypes = await hrService.getLeaveTypes();
      set({ leaveTypes, leaveTypesLoading: false });
    } catch (error) {
      set({
        leaveTypesLoading: false,
        leaveTypesError: error instanceof Error ? error.message : '获取假期类型失败',
      });
      throw error;
    }
  },
  
  fetchLeaveApplications: async (filter?: LeaveFilter) => {
    set({ leavesLoading: true, leavesError: null });
    try {
      const applications = await hrService.getLeaveApplications(filter);
      set({ leaveApplications: applications, leavesLoading: false });
    } catch (error) {
      set({
        leavesLoading: false,
        leavesError: error instanceof Error ? error.message : '获取请假申请失败',
      });
      throw error;
    }
  },
  
  createLeaveApplication: async (input: LeaveCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const application = await hrService.createLeaveApplication(input);
      const { leaveApplications } = get();
      set({
        leaveApplications: [application, ...leaveApplications],
        operationLoading: false,
      });
      return application;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '提交请假申请失败',
      });
      throw error;
    }
  },
  
  approveLeaveApplication: async (input: LeaveApproveInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const application = await hrService.approveLeaveApplication(input);
      const { leaveApplications } = get();
      set({
        leaveApplications: leaveApplications.map((a) =>
          a.id === input.leave_id ? application : a
        ),
        operationLoading: false,
      });
      return application;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '审批请假申请失败',
      });
      throw error;
    }
  },
  
  // ==================== Salary Actions ====================
  fetchSalaryRecords: async (filter?: SalaryFilter) => {
    set({ salaryLoading: true, salaryError: null });
    try {
      const records = await hrService.getSalaryRecords(filter);
      set({ salaryRecords: records, salaryLoading: false });
    } catch (error) {
      set({
        salaryLoading: false,
        salaryError: error instanceof Error ? error.message : '获取薪资记录失败',
      });
      throw error;
    }
  },
  
  createSalaryRecord: async (input: SalaryCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const record = await hrService.createSalaryRecord(input);
      const { salaryRecords } = get();
      set({
        salaryRecords: [record, ...salaryRecords],
        operationLoading: false,
      });
      return record;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建薪资记录失败',
      });
      throw error;
    }
  },
  
  paySalary: async (salaryId: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const record = await hrService.paySalary(salaryId);
      const { salaryRecords } = get();
      set({
        salaryRecords: salaryRecords.map((r) => (r.id === salaryId ? record : r)),
        operationLoading: false,
      });
      return record;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '发放薪资失败',
      });
      throw error;
    }
  },
  
  // ==================== Performance Actions ====================
  fetchPerformanceEvaluations: async (filter?: PerformanceFilter) => {
    set({ performanceLoading: true, performanceError: null });
    try {
      const evaluations = await hrService.getPerformanceEvaluations(filter);
      set({ performanceEvaluations: evaluations, performanceLoading: false });
    } catch (error) {
      set({
        performanceLoading: false,
        performanceError: error instanceof Error ? error.message : '获取绩效评估失败',
      });
      throw error;
    }
  },
  
  createPerformanceEvaluation: async (input: EvaluationCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const evaluation = await hrService.createPerformanceEvaluation(input);
      const { performanceEvaluations } = get();
      set({
        performanceEvaluations: [evaluation, ...performanceEvaluations],
        operationLoading: false,
      });
      return evaluation;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建绩效评估失败',
      });
      throw error;
    }
  },
  
  submitEvaluation: async (evaluationId: number, finalScore: number, rating: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const evaluation = await hrService.submitEvaluation(evaluationId, finalScore, rating);
      const { performanceEvaluations } = get();
      set({
        performanceEvaluations: performanceEvaluations.map((e) =>
          e.id === evaluationId ? evaluation : e
        ),
        operationLoading: false,
      });
      return evaluation;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '提交绩效评估失败',
      });
      throw error;
    }
  },
  
  // ==================== Training Actions ====================
  fetchTrainingRecords: async (filter?: TrainingFilter) => {
    set({ trainingLoading: true, trainingError: null });
    try {
      const records = await hrService.getTrainingRecords(filter);
      set({ trainingRecords: records, trainingLoading: false });
    } catch (error) {
      set({
        trainingLoading: false,
        trainingError: error instanceof Error ? error.message : '获取培训记录失败',
      });
      throw error;
    }
  },
  
  createTrainingRecord: async (input: TrainingCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const record = await hrService.createTrainingRecord(input);
      const { trainingRecords } = get();
      set({
        trainingRecords: [record, ...trainingRecords],
        operationLoading: false,
      });
      return record;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建培训记录失败',
      });
      throw error;
    }
  },
  
  // ==================== Statistics Actions ====================
  fetchStatistics: async () => {
    set({ statsLoading: true, statsError: null });
    try {
      const statistics = await hrService.getHRStatistics();
      set({ statistics, statsLoading: false });
    } catch (error) {
      set({
        statsLoading: false,
        statsError: error instanceof Error ? error.message : '获取统计数据失败',
      });
      throw error;
    }
  },
  
  fetchDashboardData: async () => {
    set({ statsLoading: true, statsError: null });
    try {
      // Note: This assumes a getDashboardData API exists
      // For now, we'll just fetch statistics
      const statistics = await hrService.getHRStatistics();
      set({
        dashboardData: {
          statistics,
          recentHires: [],
          pendingLeaves: [],
          upcomingBirthdays: [],
          attendanceRate: 0,
        },
        statsLoading: false,
      });
    } catch (error) {
      set({
        statsLoading: false,
        statsError: error instanceof Error ? error.message : '获取仪表板数据失败',
      });
      throw error;
    }
  },
  
  // ==================== Utility Actions ====================
  clearError: () => {
    set({
      employeesError: null,
      departmentsError: null,
      attendanceError: null,
      leaveTypesError: null,
      leavesError: null,
      salaryError: null,
      performanceError: null,
      trainingError: null,
      statsError: null,
      operationError: null,
    });
  },
  
  resetState: () => {
    set({
      employees: [],
      employeeTotal: 0,
      currentEmployee: null,
      departments: [],
      attendanceRecords: [],
      leaveTypes: [],
      leaveApplications: [],
      salaryRecords: [],
      performanceEvaluations: [],
      trainingRecords: [],
      statistics: null,
      dashboardData: null,
      employeesError: null,
      departmentsError: null,
      attendanceError: null,
      leaveTypesError: null,
      leavesError: null,
      salaryError: null,
      performanceError: null,
      trainingError: null,
      statsError: null,
      operationError: null,
    });
  },
}));
