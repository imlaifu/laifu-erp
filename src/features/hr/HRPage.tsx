// HR Management Module UI Component
// 人力资源管理模块 UI 组件

import React, { useState, useEffect } from 'react';
import { useHRStore } from '../../stores/hr';
import type {
  EmployeeCreateInput,
  EmployeeUpdateInput,
  LeaveCreateInput,
  SalaryCreateInput,
  EvaluationCreateInput,
  TrainingCreateInput,
} from '../../types/hr';
import {
  formatEmployeeName,
  formatSalary,
  getLeaveStatusLabel,
  getEmploymentStatusLabel,
  getPerformanceRatingLabel,
} from '../../services/hrService';

type HRView =
  | 'dashboard'
  | 'employees'
  | 'departments'
  | 'attendance'
  | 'leave'
  | 'salary'
  | 'performance'
  | 'training';

export function HRPage() {
  const {
    // Employee state
    employees,
    employeeTotal,
    employeesLoading,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchEmployee,
    
    // Department state
    departments,
    fetchDepartments,
    
    // Leave state
    leaveTypes,
    leaveApplications,
    fetchLeaveTypes,
    fetchLeaveApplications,
    createLeaveApplication,
    approveLeaveApplication,
    leavesLoading,
    
    // Salary state
    salaryRecords,
    fetchSalaryRecords,
    createSalaryRecord,
    paySalary,
    salaryLoading,
    
    // Performance state
    performanceEvaluations,
    fetchPerformanceEvaluations,
    createPerformanceEvaluation,
    submitEvaluation,
    performanceLoading,
    
    // Training state
    trainingRecords,
    fetchTrainingRecords,
    createTrainingRecord,
    trainingLoading,
    
    // Statistics
    statistics,
    fetchStatistics,
    statsLoading,
    
    // Operation state
    operationLoading,
  } = useHRStore();

  const [view, setView] = useState<HRView>('dashboard');
  const [subView, setSubView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  
  // Form states
  const [employeeForm, setEmployeeForm] = useState<Partial<EmployeeCreateInput & EmployeeUpdateInput>>({
    employee_no: '',
    name: '',
    gender: 'male',
    email: '',
    phone: '',
    department_id: undefined,
    position: '',
    job_title: '',
    employment_type: 'full_time',
    employment_status: 'active',
    hire_date: '',
    base_salary: 0,
    notes: '',
  });
  
  const [leaveForm, setLeaveForm] = useState<Partial<LeaveCreateInput>>({
    employee_id: undefined,
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
  });
  
  const [salaryForm, setSalaryForm] = useState<Partial<SalaryCreateInput>>({
    employee_id: undefined,
    year_month: '',
    base_salary: 0,
    performance_bonus: 0,
    overtime_pay: 0,
    allowance: 0,
    deduction: 0,
    social_security: 0,
    housing_fund: 0,
    tax: 0,
  });
  
  const [performanceForm, setPerformanceForm] = useState<Partial<EvaluationCreateInput>>({
    employee_id: undefined,
    evaluation_period: '',
    strengths: '',
    weaknesses: '',
    goals: '',
  });
  
  const [trainingForm, setTrainingForm] = useState<Partial<TrainingCreateInput>>({
    employee_id: undefined,
    training_name: '',
    training_type: '',
    start_date: '',
    end_date: '',
    hours: 0,
    trainer: '',
    cost: 0,
  });

  // Initialize data
  useEffect(() => {
    fetchStatistics();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (view === 'employees') {
      fetchEmployees();
    } else if (view === 'leave') {
      fetchLeaveTypes();
      fetchLeaveApplications();
    } else if (view === 'salary') {
      fetchSalaryRecords();
    } else if (view === 'performance') {
      fetchPerformanceEvaluations();
    } else if (view === 'training') {
      fetchTrainingRecords();
    }
  }, [view]);

  // Employee handlers
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee(employeeForm as EmployeeCreateInput);
      setSubView('list');
      resetEmployeeForm();
    } catch (error) {
      console.error('创建员工失败:', error);
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await updateEmployee(selectedItem, employeeForm as EmployeeUpdateInput);
      setSubView('list');
      resetEmployeeForm();
    } catch (error) {
      console.error('更新员工失败:', error);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('确定要删除此员工吗？')) return;
    try {
      await deleteEmployee(id);
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const handleEditEmployee = async (id: number) => {
    const employee = await fetchEmployee(id);
    setSelectedItem(id);
    setEmployeeForm({
      name: employee.name,
      gender: employee.gender,
      email: employee.email || '',
      phone: employee.phone || '',
      department_id: employee.department_id || undefined,
      position: employee.position || '',
      job_title: employee.job_title || '',
      employment_type: employee.employment_type,
      employment_status: employee.employment_status,
      hire_date: employee.hire_date || '',
      base_salary: employee.base_salary,
      notes: employee.notes || '',
    });
    setSubView('edit');
  };

  const resetEmployeeForm = () => {
    setEmployeeForm({
      employee_no: '',
      name: '',
      gender: 'male',
      email: '',
      phone: '',
      department_id: undefined,
      position: '',
      job_title: '',
      employment_type: 'full_time',
      employment_status: 'active',
      hire_date: '',
      base_salary: 0,
      notes: '',
    });
    setSelectedItem(null);
  };

  // Leave handlers
  const handleCreateLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLeaveApplication(leaveForm as LeaveCreateInput);
      setSubView('list');
      setLeaveForm({ employee_id: undefined, leave_type: '', start_date: '', end_date: '', reason: '' });
    } catch (error) {
      console.error('提交请假申请失败:', error);
    }
  };

  const handleApproveLeave = async (leaveId: number, approved: boolean) => {
    try {
      await approveLeaveApplication({ leave_id: leaveId, approved });
    } catch (error) {
      console.error('审批失败:', error);
    }
  };

  // Salary handlers
  const handleCreateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSalaryRecord(salaryForm as SalaryCreateInput);
      setSubView('list');
      resetSalaryForm();
    } catch (error) {
      console.error('创建薪资记录失败:', error);
    }
  };

  const handlePaySalary = async (salaryId: number) => {
    try {
      await paySalary(salaryId);
    } catch (error) {
      console.error('发放薪资失败:', error);
    }
  };

  const resetSalaryForm = () => {
    setSalaryForm({
      employee_id: undefined,
      year_month: '',
      base_salary: 0,
      performance_bonus: 0,
      overtime_pay: 0,
      allowance: 0,
      deduction: 0,
      social_security: 0,
      housing_fund: 0,
      tax: 0,
    });
  };

  // Performance handlers
  const handleCreatePerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPerformanceEvaluation(performanceForm as EvaluationCreateInput);
      setSubView('list');
      resetPerformanceForm();
    } catch (error) {
      console.error('创建绩效评估失败:', error);
    }
  };

  const handleSubmitPerformance = async (evaluationId: number, score: number, rating: string) => {
    try {
      await submitEvaluation(evaluationId, score, rating);
    } catch (error) {
      console.error('提交评估失败:', error);
    }
  };

  const resetPerformanceForm = () => {
    setPerformanceForm({
      employee_id: undefined,
      evaluation_period: '',
      strengths: '',
      weaknesses: '',
      goals: '',
    });
  };

  // Training handlers
  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTrainingRecord(trainingForm as TrainingCreateInput);
      setSubView('list');
      resetTrainingForm();
    } catch (error) {
      console.error('创建培训记录失败:', error);
    }
  };

  const resetTrainingForm = () => {
    setTrainingForm({
      employee_id: undefined,
      training_name: '',
      training_type: '',
      start_date: '',
      end_date: '',
      hours: 0,
      trainer: '',
      cost: 0,
    });
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div className="hr-dashboard">
      <h2>人力资源仪表板</h2>
      
      {statsLoading ? (
        <div className="loading">加载统计数据...</div>
      ) : statistics ? (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{statistics.total_employees}</div>
            <div className="stat-label">总员工数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statistics.active_employees}</div>
            <div className="stat-label">在职员工</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statistics.new_hires_this_month}</div>
            <div className="stat-label">本月入职</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statistics.total_departments}</div>
            <div className="stat-label">部门数量</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{statistics.pending_leaves}</div>
            <div className="stat-label">待审批请假</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatSalary(statistics.total_payroll)}</div>
            <div className="stat-label">月度薪资总额</div>
          </div>
        </div>
      ) : (
        <div className="no-data">暂无统计数据</div>
      )}

      <div className="quick-actions">
        <h3>快速操作</h3>
        <div className="action-buttons">
          <button onClick={() => { setView('employees'); setSubView('create'); }} className="btn-primary">
            + 新建员工
          </button>
          <button onClick={() => { setView('leave'); setSubView('create'); }} className="btn-secondary">
            📝 请假申请
          </button>
          <button onClick={() => { setView('salary'); setSubView('create'); }} className="btn-secondary">
            💰 薪资录入
          </button>
          <button onClick={() => { setView('performance'); setSubView('create'); }} className="btn-secondary">
            📊 绩效评估
          </button>
        </div>
      </div>
    </div>
  );

  // Render Employee List
  const renderEmployeeList = () => (
    <div className="employee-list">
      <div className="list-header">
        <h2>员工管理</h2>
        <button onClick={() => { resetEmployeeForm(); setSubView('create'); }} className="btn-primary">
          + 新建员工
        </button>
      </div>

      {employeesLoading ? (
        <div className="loading">加载员工列表...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>工号</th>
              <th>姓名</th>
              <th>部门</th>
              <th>职位</th>
              <th>入职日期</th>
              <th>状态</th>
              <th>基本工资</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.employee_no}</td>
                <td>{emp.name}</td>
                <td>
                  {emp.department_id
                    ? departments.find((d) => d.id === emp.department_id)?.name || '-'
                    : '-'}
                </td>
                <td>{emp.position || '-'}</td>
                <td>{emp.hire_date || '-'}</td>
                <td>
                  <span className={`status-badge status-${emp.employment_status}`}>
                    {getEmploymentStatusLabel(emp.employment_status)}
                  </span>
                </td>
                <td>{formatSalary(emp.base_salary)}</td>
                <td className="actions">
                  <button onClick={() => handleEditEmployee(emp.id)} className="btn-sm">
                    编辑
                  </button>
                  <button onClick={() => handleDeleteEmployee(emp.id)} className="btn-sm btn-danger">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="list-footer">
        <span>共 {employeeTotal} 名员工</span>
      </div>
    </div>
  );

  // Render Employee Form
  const renderEmployeeForm = (isEdit: boolean) => (
    <div className="employee-form">
      <div className="form-header">
        <h2>{isEdit ? '编辑员工' : '新建员工'}</h2>
        <button onClick={() => { resetEmployeeForm(); setSubView('list'); }} className="btn-secondary">
          返回列表
        </button>
      </div>

      <form onSubmit={isEdit ? handleUpdateEmployee : handleCreateEmployee}>
        <div className="form-grid">
          <div className="form-group">
            <label>工号 *</label>
            <input
              type="text"
              value={employeeForm.employee_no || ''}
              onChange={(e) => setEmployeeForm({ ...employeeForm, employee_no: e.target.value })}
              required
              disabled={isEdit}
            />
          </div>

          <div className="form-group">
            <label>姓名 *</label>
            <input
              type="text"
              value={employeeForm.name || ''}
              onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>性别</label>
            <select
              value={employeeForm.gender || 'male'}
              onChange={(e) => setEmployeeForm({ ...employeeForm, gender: e.target.value })}
            >
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div className="form-group">
            <label>邮箱</label>
            <input
              type="email"
              value={employeeForm.email || ''}
              onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>手机号</label>
            <input
              type="tel"
              value={employeeForm.phone || ''}
              onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>部门</label>
            <select
              value={employeeForm.department_id || ''}
              onChange={(e) =>
                setEmployeeForm({ ...employeeForm, department_id: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="">请选择部门</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>职位</label>
            <input
              type="text"
              value={employeeForm.position || ''}
              onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>职称</label>
            <input
              type="text"
              value={employeeForm.job_title || ''}
              onChange={(e) => setEmployeeForm({ ...employeeForm, job_title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>雇佣类型</label>
            <select
              value={employeeForm.employment_type || 'full_time'}
              onChange={(e) => setEmployeeForm({ ...employeeForm, employment_type: e.target.value })}
            >
              <option value="full_time">全职</option>
              <option value="part_time">兼职</option>
              <option value="contract">合同工</option>
              <option value="intern">实习生</option>
            </select>
          </div>

          <div className="form-group">
            <label>雇佣状态</label>
            <select
              value={employeeForm.employment_status || 'active'}
              onChange={(e) => setEmployeeForm({ ...employeeForm, employment_status: e.target.value })}
            >
              <option value="active">在职</option>
              <option value="probation">试用期</option>
              <option value="terminated">已离职</option>
              <option value="suspended">停职</option>
            </select>
          </div>

          <div className="form-group">
            <label>入职日期</label>
            <input
              type="date"
              value={employeeForm.hire_date || ''}
              onChange={(e) => setEmployeeForm({ ...employeeForm, hire_date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>基本工资</label>
            <input
              type="number"
              value={employeeForm.base_salary || 0}
              onChange={(e) => setEmployeeForm({ ...employeeForm, base_salary: Number(e.target.value) })}
              step="0.01"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>备注</label>
          <textarea
            value={employeeForm.notes || ''}
            onChange={(e) => setEmployeeForm({ ...employeeForm, notes: e.target.value })}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={operationLoading}>
            {operationLoading ? '保存中...' : isEdit ? '更新' : '创建'}
          </button>
          <button type="button" onClick={() => { resetEmployeeForm(); setSubView('list'); }} className="btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  );

  // Render Leave List
  const renderLeaveList = () => (
    <div className="leave-list">
      <div className="list-header">
        <h2>请假管理</h2>
        <button onClick={() => setSubView('create')} className="btn-primary">
          + 请假申请
        </button>
      </div>

      {leavesLoading ? (
        <div className="loading">加载请假记录...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>员工</th>
              <th>假期类型</th>
              <th>开始日期</th>
              <th>结束日期</th>
              <th>天数</th>
              <th>状态</th>
              <th>申请日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {leaveApplications.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.employee_name || leave.employee_id}</td>
                <td>{leave.leave_type}</td>
                <td>{leave.start_date}</td>
                <td>{leave.end_date}</td>
                <td>{leave.days}</td>
                <td>
                  <span className={`status-badge status-${leave.status}`}>
                    {getLeaveStatusLabel(leave.status)}
                  </span>
                </td>
                <td>{new Date(leave.created_at).toLocaleDateString()}</td>
                <td className="actions">
                  {leave.status === 'pending' && (
                    <>
                      <button onClick={() => handleApproveLeave(leave.id, true)} className="btn-sm btn-success">
                        批准
                      </button>
                      <button onClick={() => handleApproveLeave(leave.id, false)} className="btn-sm btn-danger">
                        拒绝
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // Render Leave Form
  const renderLeaveForm = () => (
    <div className="leave-form">
      <div className="form-header">
        <h2>请假申请</h2>
        <button onClick={() => setSubView('list')} className="btn-secondary">
          返回列表
        </button>
      </div>

      <form onSubmit={handleCreateLeave}>
        <div className="form-grid">
          <div className="form-group">
            <label>员工 *</label>
            <select
              value={leaveForm.employee_id || ''}
              onChange={(e) => setLeaveForm({ ...leaveForm, employee_id: Number(e.target.value) })}
              required
            >
              <option value="">请选择员工</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {formatEmployeeName(emp)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>假期类型 *</label>
            <select
              value={leaveForm.leave_type || ''}
              onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
              required
            >
              <option value="">请选择假期类型</option>
              {leaveTypes.map((type) => (
                <option key={type.id} value={type.code}>
                  {type.name} ({type.days_per_year}天/年)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>开始日期 *</label>
            <input
              type="date"
              value={leaveForm.start_date || ''}
              onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>结束日期 *</label>
            <input
              type="date"
              value={leaveForm.end_date || ''}
              onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>请假事由</label>
          <textarea
            value={leaveForm.reason || ''}
            onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={operationLoading}>
            {operationLoading ? '提交中...' : '提交申请'}
          </button>
          <button type="button" onClick={() => setSubView('list')} className="btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  );

  // Render Salary List
  const renderSalaryList = () => (
    <div className="salary-list">
      <div className="list-header">
        <h2>薪资管理</h2>
        <button onClick={() => setSubView('create')} className="btn-primary">
          + 新建薪资记录
        </button>
      </div>

      {salaryLoading ? (
        <div className="loading">加载薪资记录...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>员工</th>
              <th>月份</th>
              <th>基本工资</th>
              <th>绩效</th>
              <th>加班</th>
              <th>扣款</th>
              <th>实发</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {salaryRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.employee_name || record.employee_id}</td>
                <td>{record.year_month}</td>
                <td>{formatSalary(record.base_salary)}</td>
                <td>{formatSalary(record.performance_bonus)}</td>
                <td>{formatSalary(record.overtime_pay)}</td>
                <td>{formatSalary(record.deduction)}</td>
                <td className="highlight">{formatSalary(record.actual_salary)}</td>
                <td>
                  <span className={`status-badge status-${record.payment_status}`}>
                    {record.payment_status === 'paid' ? '已发放' : '待发放'}
                  </span>
                </td>
                <td className="actions">
                  {record.payment_status !== 'paid' && (
                    <button onClick={() => handlePaySalary(record.id)} className="btn-sm btn-success">
                      发放
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // Render Salary Form
  const renderSalaryForm = () => (
    <div className="salary-form">
      <div className="form-header">
        <h2>新建薪资记录</h2>
        <button onClick={() => { resetSalaryForm(); setSubView('list'); }} className="btn-secondary">
          返回列表
        </button>
      </div>

      <form onSubmit={handleCreateSalary}>
        <div className="form-grid">
          <div className="form-group">
            <label>员工 *</label>
            <select
              value={salaryForm.employee_id || ''}
              onChange={(e) => setSalaryForm({ ...salaryForm, employee_id: Number(e.target.value) })}
              required
            >
              <option value="">请选择员工</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {formatEmployeeName(emp)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>月份 *</label>
            <input
              type="month"
              value={salaryForm.year_month || ''}
              onChange={(e) => setSalaryForm({ ...salaryForm, year_month: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>基本工资</label>
            <input
              type="number"
              value={salaryForm.base_salary || 0}
              onChange={(e) => setSalaryForm({ ...salaryForm, base_salary: Number(e.target.value) })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>绩效奖金</label>
            <input
              type="number"
              value={salaryForm.performance_bonus || 0}
              onChange={(e) => setSalaryForm({ ...salaryForm, performance_bonus: Number(e.target.value) })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>加班费</label>
            <input
              type="number"
              value={salaryForm.overtime_pay || 0}
              onChange={(e) => setSalaryForm({ ...salaryForm, overtime_pay: Number(e.target.value) })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>津贴</label>
            <input
              type="number"
              value={salaryForm.allowance || 0}
              onChange={(e) => setSalaryForm({ ...salaryForm, allowance: Number(e.target.value) })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>扣款</label>
            <input
              type="number"
              value={salaryForm.deduction || 0}
              onChange={(e) => setSalaryForm({ ...salaryForm, deduction: Number(e.target.value) })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>社保</label>
            <input
              type="number"
              value={salaryForm.social_security || 0}
              onChange={(e) => setSalaryForm({ ...salaryForm, social_security: Number(e.target.value) })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>公积金</label>
            <input
              type="number"
              value={salaryForm.housing_fund || 0}
              onChange={(e) => setSalaryForm({ ...salaryForm, housing_fund: Number(e.target.value) })}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>个税</label>
            <input
              type="number"
              value={salaryForm.tax || 0}
              onChange={(e) => setSalaryForm({ ...salaryForm, tax: Number(e.target.value) })}
              step="0.01"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={operationLoading}>
            {operationLoading ? '保存中...' : '创建'}
          </button>
          <button type="button" onClick={() => { resetSalaryForm(); setSubView('list'); }} className="btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  );

  // Render Performance List
  const renderPerformanceList = () => (
    <div className="performance-list">
      <div className="list-header">
        <h2>绩效管理</h2>
        <button onClick={() => setSubView('create')} className="btn-primary">
          + 新建评估
        </button>
      </div>

      {performanceLoading ? (
        <div className="loading">加载绩效评估...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>员工</th>
              <th>评估周期</th>
              <th>自评分</th>
              <th>主管分</th>
              <th>最终分</th>
              <th>等级</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {performanceEvaluations.map((evaluation) => (
              <tr key={evaluation.id}>
                <td>{evaluation.employee_name || evaluation.employee_id}</td>
                <td>{evaluation.evaluation_period}</td>
                <td>{evaluation.self_score || '-'}</td>
                <td>{evaluation.manager_score || '-'}</td>
                <td>{evaluation.final_score || '-'}</td>
                <td>{evaluation.rating ? getPerformanceRatingLabel(evaluation.rating) : '-'}</td>
                <td>
                  <span className={`status-badge status-${evaluation.status}`}>
                    {evaluation.status === 'completed' ? '已完成' : evaluation.status === 'submitted' ? '已提交' : '草稿'}
                  </span>
                </td>
                <td className="actions">
                  {evaluation.status === 'submitted' && (
                    <button
                      onClick={() => handleSubmitPerformance(evaluation.id, evaluation.final_score || 0, evaluation.rating || 'B')}
                      className="btn-sm btn-success"
                    >
                      确认
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // Render Performance Form
  const renderPerformanceForm = () => (
    <div className="performance-form">
      <div className="form-header">
        <h2>新建绩效评估</h2>
        <button onClick={() => { resetPerformanceForm(); setSubView('list'); }} className="btn-secondary">
          返回列表
        </button>
      </div>

      <form onSubmit={handleCreatePerformance}>
        <div className="form-grid">
          <div className="form-group">
            <label>员工 *</label>
            <select
              value={performanceForm.employee_id || ''}
              onChange={(e) => setPerformanceForm({ ...performanceForm, employee_id: Number(e.target.value) })}
              required
            >
              <option value="">请选择员工</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {formatEmployeeName(emp)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>评估周期 *</label>
            <input
              type="month"
              value={performanceForm.evaluation_period || ''}
              onChange={(e) => setPerformanceForm({ ...performanceForm, evaluation_period: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>优势</label>
          <textarea
            value={performanceForm.strengths || ''}
            onChange={(e) => setPerformanceForm({ ...performanceForm, strengths: e.target.value })}
            rows={3}
          />
        </div>

        <div className="form-group full-width">
          <label>不足</label>
          <textarea
            value={performanceForm.weaknesses || ''}
            onChange={(e) => setPerformanceForm({ ...performanceForm, weaknesses: e.target.value })}
            rows={3}
          />
        </div>

        <div className="form-group full-width">
          <label>目标</label>
          <textarea
            value={performanceForm.goals || ''}
            onChange={(e) => setPerformanceForm({ ...performanceForm, goals: e.target.value })}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={operationLoading}>
            {operationLoading ? '保存中...' : '创建'}
          </button>
          <button type="button" onClick={() => { resetPerformanceForm(); setSubView('list'); }} className="btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  );

  // Render Training List
  const renderTrainingList = () => (
    <div className="training-list">
      <div className="list-header">
        <h2>培训管理</h2>
        <button onClick={() => setSubView('create')} className="btn-primary">
          + 新建培训记录
        </button>
      </div>

      {trainingLoading ? (
        <div className="loading">加载培训记录...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>员工</th>
              <th>培训名称</th>
              <th>类型</th>
              <th>开始日期</th>
              <th>结束日期</th>
              <th>时长</th>
              <th>讲师</th>
              <th>费用</th>
            </tr>
          </thead>
          <tbody>
            {trainingRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.employee_name || record.employee_id}</td>
                <td>{record.training_name}</td>
                <td>{record.training_type || '-'}</td>
                <td>{record.start_date || '-'}</td>
                <td>{record.end_date || '-'}</td>
                <td>{record.hours}h</td>
                <td>{record.trainer || '-'}</td>
                <td>{formatSalary(record.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // Render Training Form
  const renderTrainingForm = () => (
    <div className="training-form">
      <div className="form-header">
        <h2>新建培训记录</h2>
        <button onClick={() => { resetTrainingForm(); setSubView('list'); }} className="btn-secondary">
          返回列表
        </button>
      </div>

      <form onSubmit={handleCreateTraining}>
        <div className="form-grid">
          <div className="form-group">
            <label>员工 *</label>
            <select
              value={trainingForm.employee_id || ''}
              onChange={(e) => setTrainingForm({ ...trainingForm, employee_id: Number(e.target.value) })}
              required
            >
              <option value="">请选择员工</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {formatEmployeeName(emp)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>培训名称 *</label>
            <input
              type="text"
              value={trainingForm.training_name || ''}
              onChange={(e) => setTrainingForm({ ...trainingForm, training_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>培训类型</label>
            <input
              type="text"
              value={trainingForm.training_type || ''}
              onChange={(e) => setTrainingForm({ ...trainingForm, training_type: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>时长 (小时)</label>
            <input
              type="number"
              value={trainingForm.hours || 0}
              onChange={(e) => setTrainingForm({ ...trainingForm, hours: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label>开始日期</label>
            <input
              type="date"
              value={trainingForm.start_date || ''}
              onChange={(e) => setTrainingForm({ ...trainingForm, start_date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>结束日期</label>
            <input
              type="date"
              value={trainingForm.end_date || ''}
              onChange={(e) => setTrainingForm({ ...trainingForm, end_date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>讲师</label>
            <input
              type="text"
              value={trainingForm.trainer || ''}
              onChange={(e) => setTrainingForm({ ...trainingForm, trainer: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>费用</label>
            <input
              type="number"
              value={trainingForm.cost || 0}
              onChange={(e) => setTrainingForm({ ...trainingForm, cost: Number(e.target.value) })}
              step="0.01"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={operationLoading}>
            {operationLoading ? '保存中...' : '创建'}
          </button>
          <button type="button" onClick={() => { resetTrainingForm(); setSubView('list'); }} className="btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  );

  // Main render
  return (
    <div className="hr-module">
      <div className="hr-nav">
        <button
          className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
        >
          📊 仪表板
        </button>
        <button
          className={`nav-item ${view === 'employees' ? 'active' : ''}`}
          onClick={() => setView('employees')}
        >
          👥 员工管理
        </button>
        <button
          className={`nav-item ${view === 'leave' ? 'active' : ''}`}
          onClick={() => setView('leave')}
        >
          📝 请假管理
        </button>
        <button
          className={`nav-item ${view === 'salary' ? 'active' : ''}`}
          onClick={() => setView('salary')}
        >
          💰 薪资管理
        </button>
        <button
          className={`nav-item ${view === 'performance' ? 'active' : ''}`}
          onClick={() => setView('performance')}
        >
          📈 绩效管理
        </button>
        <button
          className={`nav-item ${view === 'training' ? 'active' : ''}`}
          onClick={() => setView('training')}
        >
          🎓 培训管理
        </button>
      </div>

      <div className="hr-content">
        {view === 'dashboard' && renderDashboard()}
        {view === 'employees' && (subView === 'list' ? renderEmployeeList() : renderEmployeeForm(subView === 'edit'))}
        {view === 'leave' && (subView === 'list' ? renderLeaveList() : renderLeaveForm())}
        {view === 'salary' && (subView === 'list' ? renderSalaryList() : renderSalaryForm())}
        {view === 'performance' && (subView === 'list' ? renderPerformanceList() : renderPerformanceForm())}
        {view === 'training' && (subView === 'list' ? renderTrainingList() : renderTrainingForm())}
      </div>
    </div>
  );
}
