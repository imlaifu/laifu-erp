-- ============================================================
-- 人力资源管理模块 (HR Management)
-- 创建时间：2026-03-03
-- 功能：员工信息、考勤管理、薪资计算、请假审批、绩效管理、培训记录
-- ============================================================

-- 员工信息表
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    employee_no TEXT UNIQUE NOT NULL, -- 员工编号
    display_name TEXT NOT NULL, -- 显示姓名
    full_name TEXT NOT NULL, -- 全名
    gender TEXT, -- 'male', 'female', 'other'
    avatar_url TEXT,
    email TEXT,
    phone TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    
    -- 职位信息
    department_id TEXT,
    position_id TEXT,
    job_title TEXT, -- 职称
    employment_type TEXT, -- 'full_time', 'part_time', 'contract', 'intern'
    employment_status TEXT DEFAULT 'active', -- 'active', 'probation', 'resigned', 'terminated'
    
    -- 入职信息
    hire_date DATE,
    probation_end_date DATE,
    resignation_date DATE,
    resignation_reason TEXT,
    
    -- 薪资信息
    base_salary REAL DEFAULT 0,
    salary_currency TEXT DEFAULT 'CNY',
    payment_date INTEGER DEFAULT 15, -- 每月发薪日
    
    -- 工作信息
    work_location TEXT,
    manager_id TEXT, -- 直属上级
    hire_manager_id TEXT, -- 入职负责人
    
    -- 个人信息
    id_number TEXT, -- 身份证号
    birthday DATE,
    nationality TEXT,
    ethnicity TEXT, -- 民族
    education TEXT, -- 学历
    major TEXT, -- 专业
    graduation_school TEXT, -- 毕业院校
    graduation_date DATE,
    
    -- 地址信息
    address TEXT,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    
    -- 银行信息
    bank_name TEXT,
    bank_account TEXT,
    bank_branch TEXT,
    
    -- 系统字段
    is_system INTEGER DEFAULT 0, -- 1=系统账号，0=普通员工
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (position_id) REFERENCES positions(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    FOREIGN KEY (hire_manager_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 部门表
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    parent_id TEXT,
    level INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    manager_id TEXT,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- 职位表
CREATE TABLE IF NOT EXISTS positions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    department_id TEXT,
    level TEXT, -- 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'vp', 'c_level'
    job_family TEXT, -- 职族，如 'technical', 'sales', 'operations', 'hr', 'finance'
    description TEXT,
    min_salary REAL,
    max_salary REAL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 考勤记录表
CREATE TABLE IF NOT EXISTS attendance_records (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    attendance_date DATE NOT NULL,
    
    -- 打卡时间
    clock_in_time DATETIME,
    clock_out_time DATETIME,
    clock_in_location TEXT,
    clock_out_location TEXT,
    clock_in_method TEXT, -- 'wifi', 'gps', 'bluetooth', 'manual'
    clock_out_method TEXT,
    
    -- 工时统计
    work_hours REAL DEFAULT 0, -- 实际工作小时
    normal_hours REAL DEFAULT 0, -- 正常工时
    overtime_hours REAL DEFAULT 0, -- 加班工时
    leave_hours REAL DEFAULT 0, -- 请假小时
    
    -- 考勤状态
    status TEXT DEFAULT 'normal', -- 'normal', 'late', 'early_leave', 'absent', 'half_day'
    late_minutes INTEGER DEFAULT 0, -- 迟到分钟
    early_leave_minutes INTEGER DEFAULT 0, -- 早退分钟
    
    -- 备注
    note TEXT,
    verified_by TEXT,
    verified_at DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (verified_by) REFERENCES users(id),
    UNIQUE(employee_id, attendance_date)
);

-- 考勤规则表
CREATE TABLE IF NOT EXISTS attendance_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    
    -- 工作时间
    work_days TEXT, -- JSON: [1,2,3,4,5] 周一到周五
    clock_in_time TEXT, -- '09:00'
    clock_out_time TEXT, -- '18:00'
    lunch_start TEXT, -- '12:00'
    lunch_end TEXT, -- '13:00'
    work_hours_per_day REAL DEFAULT 8.0,
    
    -- 弹性规则
    flexible_minutes INTEGER DEFAULT 0, -- 弹性打卡分钟
    late_grace_minutes INTEGER DEFAULT 5, -- 迟到宽限分钟
    
    -- 加班规则
    overtime_enabled INTEGER DEFAULT 0,
    overtime_min_minutes INTEGER DEFAULT 30, -- 最小加班时长
    overtime_approval_required INTEGER DEFAULT 1,
    
    -- 适用范围
    department_ids TEXT, -- JSON 数组，null 表示适用所有
    position_ids TEXT, -- JSON 数组，null 表示适用所有
    
    is_active INTEGER DEFAULT 1,
    effective_date DATE,
    expiry_date DATE,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 加班申请表
CREATE TABLE IF NOT EXISTS overtime_applications (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    application_no TEXT UNIQUE NOT NULL,
    
    -- 加班信息
    overtime_date DATE NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    total_hours REAL NOT NULL,
    overtime_type TEXT, -- 'workday', 'weekend', 'holiday'
    reason TEXT NOT NULL,
    
    -- 审批信息
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    approver_id TEXT,
    approved_at DATETIME,
    approval_comment TEXT,
    
    -- 考勤关联
    attendance_record_id TEXT,
    verified INTEGER DEFAULT 0, -- 是否已核销到考勤
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approver_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 请假类型表
CREATE TABLE IF NOT EXISTS leave_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    
    -- 假期属性
    category TEXT, -- 'paid', 'unpaid', 'sick', 'statutory'
    paid_ratio REAL DEFAULT 1.0, -- 薪资比例 1.0=全薪，0.5=半薪，0=无薪
    min_duration_hours REAL DEFAULT 0.5, -- 最小请假时长 (小时)
    
    -- 额度规则
    quota_type TEXT, -- 'annual', 'monthly', 'once', 'unlimited'
    annual_quota_hours REAL, -- 年度额度 (小时)
    carry_over_enabled INTEGER DEFAULT 0, -- 是否可结转
    carry_over_max_hours REAL, -- 最大结转时长
    
    -- 规则
    requires_document INTEGER DEFAULT 0, -- 是否需要证明材料
    requires_approval INTEGER DEFAULT 1,
    min_advance_days INTEGER DEFAULT 0, -- 最小提前申请天数
    max_consecutive_days INTEGER, -- 最大连续天数
    
    description TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 请假申请表
CREATE TABLE IF NOT EXISTS leave_applications (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    application_no TEXT UNIQUE NOT NULL,
    
    -- 请假信息
    leave_type_id TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    total_hours REAL NOT NULL,
    total_days REAL NOT NULL,
    reason TEXT NOT NULL,
    
    -- 附件
    attachments TEXT, -- JSON 数组，存储附件 URL
    
    -- 审批信息
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled', 'withdrawn'
    approver_id TEXT,
    approved_at DATETIME,
    approval_comment TEXT,
    
    -- 交接信息
    handover_plan TEXT,
    handover_person_id TEXT,
    
    -- 销假信息
    actual_return_date DATE,
    extended_days REAL DEFAULT 0,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    FOREIGN KEY (approver_id) REFERENCES employees(id),
    FOREIGN KEY (handover_person_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 员工假期额度表
CREATE TABLE IF NOT EXISTS leave_balances (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    leave_type_id TEXT NOT NULL,
    year INTEGER NOT NULL,
    
    -- 额度信息
    opening_balance REAL DEFAULT 0, -- 期初余额
    granted_hours REAL DEFAULT 0, -- 已授予额度
    used_hours REAL DEFAULT 0, -- 已使用
    adjusted_hours REAL DEFAULT 0, -- 调整额度
    closing_balance REAL DEFAULT 0, -- 期末余额
    
    -- 结转信息
    carried_over_from_prev_year REAL DEFAULT 0,
    carried_over_to_next_year REAL DEFAULT 0,
    
    -- 过期信息
    expired_hours REAL DEFAULT 0,
    expiry_date DATE,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    UNIQUE(employee_id, leave_type_id, year)
);

-- 薪资结构表
CREATE TABLE IF NOT EXISTS salary_structures (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    
    -- 薪资组成
    components TEXT NOT NULL, -- JSON: [{"type": "base", "name": "基本工资", "calculation": "fixed", "amount": 10000}, ...]
    
    -- 适用范围
    department_ids TEXT, -- JSON 数组
    position_ids TEXT, -- JSON 数组
    employee_level TEXT, -- 适用职级
    
    -- 社保公积金
    social_security_base REAL, -- 社保基数
    housing_fund_base REAL, -- 公积金基数
    social_security_ratio TEXT, -- JSON: 社保比例
    housing_fund_ratio REAL, -- 公积金比例
    
    -- 个税
    tax_method TEXT DEFAULT 'individual', -- 'individual', 'cumulative'
    tax_threshold REAL DEFAULT 5000, -- 个税起征点
    
    is_active INTEGER DEFAULT 1,
    effective_date DATE,
    expiry_date DATE,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 薪资发放记录表
CREATE TABLE IF NOT EXISTS salary_payments (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    payment_no TEXT UNIQUE NOT NULL,
    
    -- 薪资周期
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    payment_date DATE NOT NULL,
    
    -- 应发项目
    base_salary REAL DEFAULT 0, -- 基本工资
    performance_bonus REAL DEFAULT 0, -- 绩效奖金
    overtime_pay REAL DEFAULT 0, -- 加班费
    allowance REAL DEFAULT 0, -- 津贴
    commission REAL DEFAULT 0, -- 佣金
    bonus REAL DEFAULT 0, -- 奖金
    other_income REAL DEFAULT 0, -- 其他收入
    gross_salary REAL DEFAULT 0, -- 应发合计
    
    -- 扣款项目
    social_security_personal REAL DEFAULT 0, -- 社保个人部分
    housing_fund_personal REAL DEFAULT 0, -- 公积金个人部分
    income_tax REAL DEFAULT 0, -- 个人所得税
    attendance_deduction REAL DEFAULT 0, -- 考勤扣款
    loan_repayment REAL DEFAULT 0, -- 借款扣款
    other_deduction REAL DEFAULT 0, -- 其他扣款
    total_deduction REAL DEFAULT 0, -- 扣款合计
    
    -- 实发
    net_salary REAL DEFAULT 0, -- 实发工资
    
    -- 社保公积金公司部分
    social_security_company REAL DEFAULT 0,
    housing_fund_company REAL DEFAULT 0,
    
    -- 状态
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'cancelled'
    payment_method TEXT, -- 'bank_transfer', 'cash'
    payment_reference TEXT, -- 银行转账参考号
    
    -- 备注
    note TEXT,
    
    -- 审批
    approved_by TEXT,
    approved_at DATETIME,
    paid_by TEXT,
    paid_at DATETIME,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (paid_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 薪资调整记录表
CREATE TABLE IF NOT EXISTS salary_adjustments (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    adjustment_no TEXT UNIQUE NOT NULL,
    
    -- 调整信息
    adjustment_type TEXT, -- 'promotion', 'merit', 'adjustment', 'correction'
    old_salary REAL NOT NULL,
    new_salary REAL NOT NULL,
    adjustment_amount REAL NOT NULL,
    adjustment_ratio REAL, -- 调整比例
    
    -- 原因
    reason TEXT NOT NULL,
    effective_date DATE NOT NULL,
    
    -- 审批
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approver_id TEXT,
    approved_at DATETIME,
    approval_comment TEXT,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approver_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 绩效考核表
CREATE TABLE IF NOT EXISTS performance_reviews (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    review_no TEXT UNIQUE NOT NULL,
    
    -- 考核周期
    period_type TEXT, -- 'monthly', 'quarterly', 'semi_annual', 'annual'
    period_year INTEGER NOT NULL,
    period_month INTEGER, -- 季度/半年度/年度时为 null
    period_quarter INTEGER, -- 季度
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- 考核信息
    reviewer_id TEXT, -- 考核人
    co_reviewer_id TEXT, -- 协同考核人
    
    -- 评分
    self_score REAL, -- 自评
    manager_score REAL, -- 上级评分
    final_score REAL, -- 最终得分
    score_level TEXT, -- 'A', 'B', 'C', 'D', 'E'
    
    -- 考核内容
    goals TEXT, -- JSON: 目标列表
    achievements TEXT, -- JSON: 成就列表
    strengths TEXT, -- 优势
    areas_for_improvement TEXT, -- 待改进
    
    -- 状态
    status TEXT DEFAULT 'draft', -- 'draft', 'self_review', 'manager_review', 'calibration', 'completed'
    
    -- 面谈
    meeting_date DATETIME,
    meeting_notes TEXT,
    employee_comment TEXT,
    
    -- 结果应用
    bonus_amount REAL, -- 关联奖金
    salary_adjustment_recommendation TEXT,
    promotion_recommendation TEXT,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (reviewer_id) REFERENCES employees(id),
    FOREIGN KEY (co_reviewer_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 考核指标表
CREATE TABLE IF NOT EXISTS performance_metrics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    
    -- 指标属性
    category TEXT, -- 'kpi', 'okr', 'competency', 'behavior'
    dimension TEXT, -- 'financial', 'customer', 'internal', 'learning'
    
    -- 评分规则
    scoring_method TEXT, -- 'quantitative', 'qualitative', '360'
    min_score REAL DEFAULT 0,
    max_score REAL DEFAULT 100,
    target_value REAL,
    
    -- 权重
    default_weight REAL DEFAULT 0,
    
    description TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 培训记录表
CREATE TABLE IF NOT EXISTS training_records (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    
    -- 培训信息
    training_name TEXT NOT NULL,
    training_type TEXT, -- 'internal', 'external', 'online', 'offline'
    training_category TEXT, -- 'onboarding', 'technical', 'soft_skill', 'compliance', 'leadership'
    
    -- 时间地点
    start_date DATETIME,
    end_date DATETIME,
    duration_hours REAL,
    location TEXT,
    trainer TEXT, -- 讲师
    
    -- 组织信息
    organizer TEXT, -- 组织机构
    cost REAL DEFAULT 0, -- 培训费用
    
    -- 完成情况
    status TEXT DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'cancelled'
    attendance_status TEXT, -- 'attended', 'absent', 'late'
    completion_date DATE,
    
    -- 评估
    score REAL, -- 培训得分
    feedback TEXT, -- 学员反馈
    certificate_url TEXT, -- 证书
    
    -- 审批
    approved_by TEXT,
    approved_at DATETIME,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 培训计划表
CREATE TABLE IF NOT EXISTS training_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    
    -- 计划信息
    plan_year INTEGER NOT NULL,
    plan_type TEXT, -- 'department', 'company', 'individual'
    target_department_id TEXT,
    target_employee_ids TEXT, -- JSON 数组
    
    -- 培训内容
    training_topics TEXT, -- JSON: 培训主题列表
    total_budget REAL DEFAULT 0,
    total_hours REAL DEFAULT 0,
    
    -- 状态
    status TEXT DEFAULT 'draft', -- 'draft', 'approved', 'in_progress', 'completed'
    
    -- 审批
    approved_by TEXT,
    approved_at DATETIME,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (target_department_id) REFERENCES departments(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 员工档案附件表
CREATE TABLE IF NOT EXISTS employee_documents (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    
    -- 文档信息
    document_type TEXT NOT NULL, -- 'resume', 'contract', 'certificate', 'id_card', 'diploma', 'other'
    document_name TEXT NOT NULL,
    document_no TEXT, -- 证件编号
    
    -- 文件信息
    file_url TEXT NOT NULL,
    file_size_bytes INTEGER,
    file_type TEXT, -- MIME type
    
    -- 有效期
    issue_date DATE,
    expiry_date DATE,
    
    -- 验证
    verified INTEGER DEFAULT 0,
    verified_by TEXT,
    verified_at DATETIME,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (verified_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 员工合同表
CREATE TABLE IF NOT EXISTS employee_contracts (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    
    -- 合同信息
    contract_no TEXT UNIQUE NOT NULL,
    contract_type TEXT, -- 'fixed_term', 'open_ended', 'project', 'internship'
    
    -- 期限
    start_date DATE NOT NULL,
    end_date DATE,
    probation_start DATE,
    probation_end DATE,
    
    -- 薪资
    contract_salary REAL,
    salary_structure TEXT, -- JSON
    
    -- 状态
    status TEXT DEFAULT 'active', -- 'draft', 'active', 'expired', 'terminated', 'renewed'
    termination_date DATE,
    termination_reason TEXT,
    renewal_count INTEGER DEFAULT 0,
    
    -- 文件
    file_url TEXT,
    
    -- 审批
    signed_by_employee DATE,
    signed_by_company DATE,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_employees_manager ON employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_no ON employees(employee_no);
CREATE INDEX IF NOT EXISTS idx_departments_parent ON departments(parent_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance_records(employee_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_leave_applications_employee ON leave_applications(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON leave_applications(status);
CREATE INDEX IF NOT EXISTS idx_leave_balances_employee_year ON leave_balances(employee_id, year);
CREATE INDEX IF NOT EXISTS idx_salary_payments_employee_period ON salary_payments(employee_id, period_year, period_month);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee ON performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_period ON performance_reviews(period_year, period_month);
CREATE INDEX IF NOT EXISTS idx_training_records_employee ON training_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_documents_employee ON employee_documents(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_contracts_employee ON employee_contracts(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_contracts_status ON employee_contracts(status);

-- 插入默认数据

-- 默认部门
INSERT OR IGNORE INTO departments (id, name, code, level, sort_order, is_active) VALUES
('dept_001', '管理层', 'MGMT', 1, 0, 1),
('dept_002', '技术部', 'TECH', 1, 1, 1),
('dept_003', '销售部', 'SALES', 1, 2, 1),
('dept_004', '市场部', 'MARKETING', 1, 3, 1),
('dept_005', '人力资源部', 'HR', 1, 4, 1),
('dept_006', '财务部', 'FINANCE', 1, 5, 1),
('dept_007', '运营部', 'OPERATIONS', 1, 6, 1),
('dept_008', '客服部', 'SUPPORT', 1, 7, 1);

-- 默认职位
INSERT OR IGNORE INTO positions (id, name, code, department_id, level, job_family, is_active) VALUES
('pos_001', 'CEO', 'CEO', 'dept_001', 'c_level', 'management', 1),
('pos_002', 'CTO', 'CTO', 'dept_001', 'c_level', 'technical', 1),
('pos_003', '技术总监', 'TECH_DIRECTOR', 'dept_002', 'director', 'technical', 1),
('pos_004', '高级工程师', 'SENIOR_ENG', 'dept_002', 'senior', 'technical', 1),
('pos_005', '工程师', 'ENGINEER', 'dept_002', 'mid', 'technical', 1),
('pos_006', '初级工程师', 'JUNIOR_ENG', 'dept_002', 'junior', 'technical', 1),
('pos_007', '销售总监', 'SALES_DIRECTOR', 'dept_003', 'director', 'sales', 1),
('pos_008', '销售经理', 'SALES_MANAGER', 'dept_003', 'manager', 'sales', 1),
('pos_009', '销售代表', 'SALES_REP', 'dept_003', 'mid', 'sales', 1),
('pos_010', 'HR 经理', 'HR_MANAGER', 'dept_005', 'manager', 'hr', 1),
('pos_011', 'HR 专员', 'HR_SPECIALIST', 'dept_005', 'mid', 'hr', 1),
('pos_012', '财务经理', 'FINANCE_MANAGER', 'dept_006', 'manager', 'finance', 1),
('pos_013', '会计', 'ACCOUNTANT', 'dept_006', 'mid', 'finance', 1),
('pos_014', '出纳', 'CASHIER', 'dept_006', 'junior', 'finance', 1);

-- 默认请假类型
INSERT OR IGNORE INTO leave_types (id, name, code, category, paid_ratio, quota_type, annual_quota_hours, requires_document, requires_approval, description, is_active) VALUES
('leave_001', '年假', 'ANNUAL', 'paid', 1.0, 'annual', 120.0, 0, 1, '员工年度带薪休假', 1),
('leave_002', '病假', 'SICK', 'sick', 0.8, 'annual', 120.0, 1, 1, '因病需要治疗的休假', 1),
('leave_003', '事假', 'PERSONAL', 'unpaid', 0.0, 'unlimited', null, 0, 1, '因私事需要的无薪休假', 1),
('leave_004', '婚假', 'MARRIAGE', 'paid', 1.0, 'once', 24.0, 1, 1, '结婚休假', 1),
('leave_005', '产假', 'MATERNITY', 'paid', 1.0, 'once', 1080.0, 1, 1, '女员工生育休假 (90 天)', 1),
('leave_006', '陪产假', 'PATERNITY', 'paid', 1.0, 'once', 120.0, 1, 1, '男员工陪产休假 (10 天)', 1),
('leave_007', '丧假', 'BEREAVEMENT', 'paid', 1.0, 'once', 24.0, 0, 1, '直系亲属去世休假', 1),
('leave_008', '调休假', 'COMPENSATORY', 'paid', 1.0, 'monthly', null, 0, 1, '加班调休', 1);

-- 默认考勤规则
INSERT OR IGNORE INTO attendance_rules (id, name, code, work_days, clock_in_time, clock_out_time, lunch_start, lunch_end, work_hours_per_day, flexible_minutes, late_grace_minutes, overtime_enabled, is_active, effective_date) VALUES
('rule_001', '标准工时制', 'STANDARD', '[1,2,3,4,5]', '09:00', '18:00', '12:00', '13:00', 8.0, 30, 5, 1, 1, '2026-01-01'),
('rule_002', '弹性工时制', 'FLEXIBLE', '[1,2,3,4,5]', '09:00', '18:00', '12:00', '13:00', 8.0, 120, 15, 1, 1, '2026-01-01');

-- 默认薪资结构
INSERT OR IGNORE INTO salary_structures (id, name, code, components, social_security_ratio, housing_fund_ratio, tax_method, tax_threshold, is_active, effective_date) VALUES
('sal_struct_001', '标准薪资结构', 'STANDARD', 
 '[{"type": "base", "name": "基本工资", "calculation": "fixed", "percentage": 70}, {"type": "performance", "name": "绩效工资", "calculation": "percentage", "percentage": 30}]',
 '{"pension": 0.08, "medical": 0.02, "unemployment": 0.005, "work_injury": 0, "maternity": 0}',
 0.12, 'cumulative', 5000, 1, '2026-01-01');
