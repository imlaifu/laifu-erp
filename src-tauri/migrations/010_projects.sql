-- ============================================================
-- 项目管理模块 (Project Management)
-- 创建时间：2026-03-03
-- 功能：项目立项、任务分配、进度跟踪、工时记录、项目成本、项目文档
-- ============================================================

-- 项目表
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    project_no TEXT UNIQUE NOT NULL, -- 项目编号
    name TEXT NOT NULL, -- 项目名称
    code TEXT, -- 项目代码/简称
    
    -- 项目分类
    category TEXT, -- 'internal', 'external', 'research', 'product'
    type TEXT, -- 'development', 'consulting', 'maintenance', 'other'
    industry TEXT, -- 所属行业
    
    -- 项目描述
    description TEXT,
    objectives TEXT, -- JSON: 项目目标列表
    deliverables TEXT, -- JSON: 交付物列表
    
    -- 项目状态
    status TEXT DEFAULT 'planning', -- 'planning', 'active', 'on_hold', 'completed', 'cancelled'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    
    -- 时间信息
    start_date DATE,
    end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    
    -- 预算与成本
    budget REAL DEFAULT 0,
    actual_cost REAL DEFAULT 0,
    currency TEXT DEFAULT 'CNY',
    
    -- 客户信息 (外部项目)
    customer_id TEXT,
    customer_contact TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    
    -- 项目负责人
    owner_id TEXT NOT NULL, -- 项目负责人 (用户 ID)
    manager_id TEXT, -- 项目经理 (员工 ID)
    
    -- 团队成员
    team_member_ids TEXT, -- JSON 数组：团队成员 ID 列表
    
    -- 进度信息
    progress_percentage REAL DEFAULT 0, -- 0-100
    milestone_count INTEGER DEFAULT 0,
    completed_milestone_count INTEGER DEFAULT 0,
    task_count INTEGER DEFAULT 0,
    completed_task_count INTEGER DEFAULT 0,
    
    -- 风险与问题
    risk_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    issues_count INTEGER DEFAULT 0,
    
    -- 系统字段
    parent_project_id TEXT, -- 父项目 (用于子项目)
    is_template INTEGER DEFAULT 0, -- 是否为模板项目
    template_id TEXT, -- 模板项目 ID
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    FOREIGN KEY (parent_project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 项目里程碑表
CREATE TABLE IF NOT EXISTS project_milestones (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    milestone_no TEXT NOT NULL, -- 里程碑编号
    
    -- 里程碑信息
    name TEXT NOT NULL,
    description TEXT,
    
    -- 时间信息
    planned_date DATE NOT NULL,
    actual_date DATE,
    
    -- 状态
    status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'skipped'
    completion_percentage REAL DEFAULT 0,
    
    -- 交付物
    deliverables TEXT, -- JSON: 交付物列表
    
    -- 验收信息
    acceptance_criteria TEXT,
    accepted_by TEXT,
    accepted_at DATETIME,
    acceptance_notes TEXT,
    
    sort_order INTEGER DEFAULT 0,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (accepted_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 项目任务表
CREATE TABLE IF NOT EXISTS project_tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    task_no TEXT NOT NULL, -- 任务编号
    
    -- 任务信息
    name TEXT NOT NULL,
    description TEXT,
    
    -- 任务分类
    phase TEXT, -- 项目阶段
    category TEXT, -- 任务分类
    type TEXT, -- 'task', 'subtask', 'bug', 'feature', 'improvement'
    
    -- 任务状态
    status TEXT DEFAULT 'todo', -- 'todo', 'in_progress', 'review', 'testing', 'done', 'blocked'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    severity TEXT, -- 'low', 'medium', 'high', 'critical' (用于 bug)
    
    -- 时间估算
    estimated_hours REAL DEFAULT 0,
    actual_hours REAL DEFAULT 0,
    remaining_hours REAL DEFAULT 0,
    
    -- 时间信息
    start_date DATE,
    due_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    
    -- 负责人
    assignee_id TEXT, -- 负责人 (员工 ID)
    reporter_id TEXT, -- 报告人
    
    -- 依赖关系
    parent_task_id TEXT, -- 父任务
    dependency_ids TEXT, -- JSON 数组：依赖任务 ID 列表
    
    -- 里程碑关联
    milestone_id TEXT,
    
    -- 进度
    progress_percentage REAL DEFAULT 0,
    
    -- 标签
    tags TEXT, -- JSON 数组
    
    -- 系统字段
    iteration INTEGER DEFAULT 1, -- 迭代次数 (用于返工)
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assignee_id) REFERENCES employees(id),
    FOREIGN KEY (reporter_id) REFERENCES employees(id),
    FOREIGN KEY (parent_task_id) REFERENCES project_tasks(id),
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 工时记录表
CREATE TABLE IF NOT EXISTS time_entries (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    task_id TEXT,
    
    -- 工时信息
    entry_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_hours REAL NOT NULL,
    
    -- 工时类型
    work_type TEXT DEFAULT 'regular', -- 'regular', 'overtime', 'weekend', 'holiday'
    billable INTEGER DEFAULT 1, -- 是否可计费
    
    -- 工作内容
    description TEXT NOT NULL,
    work_category TEXT, -- 'development', 'design', 'testing', 'meeting', 'documentation', 'other'
    
    -- 审批
    status TEXT DEFAULT 'submitted', -- 'draft', 'submitted', 'approved', 'rejected'
    approved_by TEXT,
    approved_at DATETIME,
    rejection_reason TEXT,
    
    -- 计费信息
    hourly_rate REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (task_id) REFERENCES project_tasks(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- 项目成本表
CREATE TABLE IF NOT EXISTS project_costs (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    
    -- 成本分类
    category TEXT NOT NULL, -- 'labor', 'material', 'equipment', 'travel', 'service', 'other'
    sub_category TEXT,
    
    -- 成本信息
    name TEXT NOT NULL,
    description TEXT,
    
    -- 金额
    planned_amount REAL DEFAULT 0,
    actual_amount REAL DEFAULT 0,
    currency TEXT DEFAULT 'CNY',
    
    -- 时间
    cost_date DATE,
    payment_date DATE,
    
    -- 状态
    status TEXT DEFAULT 'planned', -- 'planned', 'committed', 'paid', 'cancelled'
    
    -- 关联
    vendor_id TEXT, -- 供应商 ID
    invoice_no TEXT, -- 发票号
    related_task_id TEXT, -- 关联任务
    
    -- 审批
    approved_by TEXT,
    approved_at DATETIME,
    
    notes TEXT,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (vendor_id) REFERENCES suppliers(id),
    FOREIGN KEY (related_task_id) REFERENCES project_tasks(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 项目文档表
CREATE TABLE IF NOT EXISTS project_documents (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    task_id TEXT,
    
    -- 文档信息
    name TEXT NOT NULL,
    description TEXT,
    
    -- 文档分类
    category TEXT, -- 'requirement', 'design', 'technical', 'user_manual', 'meeting_note', 'report', 'other'
    document_type TEXT, -- 'doc', 'sheet', 'pdf', 'image', 'code', 'other'
    
    -- 文件信息
    file_url TEXT NOT NULL,
    file_size_bytes INTEGER,
    file_hash TEXT, -- 文件哈希值
    
    -- 版本
    version TEXT DEFAULT '1.0',
    version_notes TEXT,
    is_latest INTEGER DEFAULT 1,
    
    -- 权限
    visibility TEXT DEFAULT 'team', -- 'public', 'team', 'private'
    access_level TEXT DEFAULT 'read', -- 'read', 'write', 'admin'
    
    -- 审批
    status TEXT DEFAULT 'draft', -- 'draft', 'review', 'approved', 'archived'
    reviewed_by TEXT,
    reviewed_at DATETIME,
    
    -- 下载统计
    download_count INTEGER DEFAULT 0,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (task_id) REFERENCES project_tasks(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 项目问题/风险表
CREATE TABLE IF NOT EXISTS project_issues (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    
    -- 问题信息
    issue_no TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- 问题分类
    type TEXT, -- 'risk', 'issue', 'change_request', 'defect'
    category TEXT,
    
    -- 状态
    status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed', 'rejected'
    priority TEXT DEFAULT 'medium',
    severity TEXT DEFAULT 'medium',
    
    -- 负责人
    assignee_id TEXT,
    reporter_id TEXT,
    
    -- 时间
    reported_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_date DATETIME,
    due_date DATE,
    
    -- 解决方案
    solution TEXT,
    resolution_notes TEXT,
    
    -- 影响评估
    impact_description TEXT,
    impact_cost REAL DEFAULT 0,
    impact_days INTEGER DEFAULT 0,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assignee_id) REFERENCES employees(id),
    FOREIGN KEY (reporter_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 项目成员表 (项目 - 员工关联)
CREATE TABLE IF NOT EXISTS project_members (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    
    -- 角色
    role TEXT NOT NULL, -- 'owner', 'manager', 'developer', 'designer', 'tester', 'analyst', 'other'
    responsibilities TEXT, -- JSON: 职责列表
    
    -- 时间投入
    allocation_percentage REAL DEFAULT 100, -- 投入百分比
    start_date DATE,
    end_date DATE,
    
    -- 权限
    access_level TEXT DEFAULT 'member', -- 'viewer', 'member', 'admin'
    
    -- 状态
    status TEXT DEFAULT 'active', -- 'active', 'inactive', 'removed'
    
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    left_at DATETIME,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE(project_id, employee_id)
);

-- 项目变更日志表
CREATE TABLE IF NOT EXISTS project_change_logs (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    
    -- 变更类型
    change_type TEXT NOT NULL, -- 'scope', 'schedule', 'cost', 'resource', 'other'
    
    -- 变更内容
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    old_value TEXT, -- JSON
    new_value TEXT, -- JSON
    
    -- 变更原因
    reason TEXT NOT NULL,
    impact TEXT, -- 影响评估
    
    -- 审批
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'implemented'
    requested_by TEXT,
    approved_by TEXT,
    approved_at DATETIME,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- 项目评论表
CREATE TABLE IF NOT EXISTS project_comments (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    task_id TEXT,
    milestone_id TEXT,
    issue_id TEXT,
    document_id TEXT,
    
    -- 评论内容
    content TEXT NOT NULL,
    parent_comment_id TEXT, -- 父评论 (用于回复)
    
    -- 附件
    attachments TEXT, -- JSON 数组：附件 URL 列表
    
    -- 状态
    is_edited INTEGER DEFAULT 0,
    is_deleted INTEGER DEFAULT 0,
    
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (task_id) REFERENCES project_tasks(id),
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id),
    FOREIGN KEY (issue_id) REFERENCES project_issues(id),
    FOREIGN KEY (document_id) REFERENCES project_documents(id),
    FOREIGN KEY (parent_comment_id) REFERENCES project_comments(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_manager ON projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_customer ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_no ON projects(project_no);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_milestones_project ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON project_milestones(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON project_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON project_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_milestone ON project_tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON project_tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_employee ON time_entries(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_project ON time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_task ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_project_costs_project ON project_costs(project_id);
CREATE INDEX IF NOT EXISTS idx_project_costs_category ON project_costs(category);
CREATE INDEX IF NOT EXISTS idx_project_documents_project ON project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_task ON project_documents(task_id);
CREATE INDEX IF NOT EXISTS idx_project_issues_project ON project_issues(project_id);
CREATE INDEX IF NOT EXISTS idx_project_issues_status ON project_issues(status);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_employee ON project_members(employee_id);
CREATE INDEX IF NOT EXISTS idx_change_logs_project ON project_change_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project ON project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_task ON project_comments(task_id);

-- 插入默认数据

-- 默认项目分类
INSERT OR IGNORE INTO projects (id, project_no, name, code, category, type, status, priority, owner_id, created_by) VALUES
('proj_template_001', 'PROJ-0001', '软件开发项目模板', 'DEV-TEMPLATE', 'internal', 'development', 'planning', 'medium', 'user_001', 'user_001'),
('proj_template_002', 'PROJ-0002', '咨询项目模板', 'CONSULT-TEMPLATE', 'external', 'consulting', 'planning', 'medium', 'user_001', 'user_001');

-- 默认任务类型
-- (任务类型在代码中定义，无需插入)

-- 默认工时类型
-- (工时类型在代码中定义，无需插入)
