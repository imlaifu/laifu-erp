-- 系统设置模块数据库表
-- 创建时间：2026-03-03

-- 系统参数表
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'string' CHECK(setting_type IN ('string', 'number', 'boolean', 'json', 'text')),
    category TEXT DEFAULT 'general' CHECK(category IN ('general', 'security', 'notification', 'integration', 'ui', 'backup', 'other')),
    description TEXT,
    is_editable INTEGER DEFAULT 1,
    is_encrypted INTEGER DEFAULT 0,
    created_by INTEGER,
    updated_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- 数据字典表
CREATE TABLE IF NOT EXISTS data_dictionary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dict_code TEXT NOT NULL UNIQUE,
    dict_name TEXT NOT NULL,
    dict_type TEXT DEFAULT 'system' CHECK(dict_type IN ('system', 'custom')),
    description TEXT,
    is_active INTEGER DEFAULT 1,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 数据字典项表
CREATE TABLE IF NOT EXISTS data_dictionary_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dict_id INTEGER NOT NULL,
    item_key TEXT NOT NULL,
    item_value TEXT NOT NULL,
    item_label TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    color TEXT,
    icon TEXT,
    is_default INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dict_id) REFERENCES data_dictionary(id) ON DELETE CASCADE,
    UNIQUE(dict_id, item_key)
);

-- 操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_no TEXT NOT NULL UNIQUE,
    user_id INTEGER,
    user_name TEXT,
    action TEXT NOT NULL,
    module TEXT,
    sub_module TEXT,
    operation_type TEXT DEFAULT 'other' CHECK(operation_type IN ('create', 'read', 'update', 'delete', 'export', 'import', 'login', 'logout', 'other')),
    request_method TEXT,
    request_url TEXT,
    request_params TEXT,
    response_status INTEGER,
    response_data TEXT,
    ip_address TEXT,
    user_agent TEXT,
    duration_ms INTEGER,
    status TEXT DEFAULT 'success' CHECK(status IN ('success', 'failure', 'error')),
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 系统日志表
CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_level TEXT DEFAULT 'info' CHECK(log_level IN ('debug', 'info', 'warning', 'error', 'critical')),
    log_source TEXT,
    log_message TEXT NOT NULL,
    log_context TEXT,
    stack_trace TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    audit_no TEXT NOT NULL UNIQUE,
    user_id INTEGER,
    user_name TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id INTEGER,
    old_value TEXT,
    new_value TEXT,
    changed_fields TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 备份配置表
CREATE TABLE IF NOT EXISTS backup_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_name TEXT NOT NULL,
    backup_type TEXT DEFAULT 'full' CHECK(backup_type IN ('full', 'incremental', 'differential')),
    backup_target TEXT NOT NULL CHECK(backup_target IN ('local', 'remote', 'cloud')),
    backup_path TEXT,
    cloud_provider TEXT,
    cloud_bucket TEXT,
    cloud_region TEXT,
    cloud_access_key TEXT,
    cloud_secret_key TEXT,
    schedule_type TEXT DEFAULT 'manual' CHECK(schedule_type IN ('manual', 'daily', 'weekly', 'monthly', 'custom')),
    schedule_time TEXT,
    schedule_days TEXT, -- JSON 格式存储一周中的哪几天
    retention_days INTEGER DEFAULT 30,
    compression_enabled INTEGER DEFAULT 1,
    encryption_enabled INTEGER DEFAULT 0,
    encryption_password TEXT,
    notification_enabled INTEGER DEFAULT 0,
    notification_emails TEXT, -- JSON 格式存储邮箱列表
    is_active INTEGER DEFAULT 1,
    last_backup_at DATETIME,
    last_backup_status TEXT,
    last_backup_size INTEGER,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 备份记录表
CREATE TABLE IF NOT EXISTS backup_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    backup_no TEXT NOT NULL UNIQUE,
    config_id INTEGER,
    backup_type TEXT DEFAULT 'full',
    backup_path TEXT NOT NULL,
    file_size INTEGER,
    file_hash TEXT,
    start_time DATETIME,
    end_time DATETIME,
    duration_seconds INTEGER,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    error_message TEXT,
    is_restored INTEGER DEFAULT 0,
    restored_at DATETIME,
    restored_by INTEGER,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (config_id) REFERENCES backup_configs(id),
    FOREIGN KEY (restored_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 权限配置表
CREATE TABLE IF NOT EXISTS permission_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER NOT NULL,
    module_code TEXT NOT NULL,
    module_name TEXT NOT NULL,
    can_view INTEGER DEFAULT 0,
    can_create INTEGER DEFAULT 0,
    can_edit INTEGER DEFAULT 0,
    can_delete INTEGER DEFAULT 0,
    can_export INTEGER DEFAULT 0,
    can_import INTEGER DEFAULT 0,
    can_approve INTEGER DEFAULT 0,
    custom_permissions TEXT, -- JSON 格式存储自定义权限
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE(role_id, module_code)
);

-- 数据权限表
CREATE TABLE IF NOT EXISTS data_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER NOT NULL,
    resource_type TEXT NOT NULL,
    scope_type TEXT DEFAULT 'all' CHECK(scope_type IN ('all', 'department', 'self', 'custom')),
    scope_value TEXT, -- JSON 格式存储范围值
    filter_conditions TEXT, -- JSON 格式存储过滤条件
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 系统通知配置表
CREATE TABLE IF NOT EXISTS notification_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_type TEXT NOT NULL CHECK(notification_type IN ('email', 'sms', 'push', 'in_app', 'webhook')),
    notification_name TEXT NOT NULL,
    event_trigger TEXT NOT NULL,
    is_enabled INTEGER DEFAULT 1,
    template_subject TEXT,
    template_content TEXT,
    template_variables TEXT, -- JSON 格式存储可用变量
    recipients_type TEXT DEFAULT 'specific' CHECK(recipients_type IN ('all', 'role', 'department', 'specific')),
    recipients_value TEXT, -- JSON 格式存储接收者
    webhook_url TEXT,
    retry_count INTEGER DEFAULT 3,
    retry_interval_seconds INTEGER DEFAULT 60,
    rate_limit_per_hour INTEGER,
    is_active INTEGER DEFAULT 1,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 通知发送记录表
CREATE TABLE IF NOT EXISTS notification_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_id INTEGER,
    notification_type TEXT,
    recipient TEXT,
    subject TEXT,
    content TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
    error_message TEXT,
    sent_at DATETIME,
    delivered_at DATETIME,
    retry_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (config_id) REFERENCES notification_configs(id)
);

-- 集成配置表
CREATE TABLE IF NOT EXISTS integration_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    integration_name TEXT NOT NULL UNIQUE,
    integration_type TEXT NOT NULL CHECK(integration_type IN ('api', 'webhook', 'oauth', 'database', 'file', 'other')),
    provider TEXT,
    base_url TEXT,
    api_key TEXT,
    api_secret TEXT,
    oauth_client_id TEXT,
    oauth_client_secret TEXT,
    oauth_redirect_uri TEXT,
    oauth_access_token TEXT,
    oauth_refresh_token TEXT,
    oauth_expires_at DATETIME,
    config_data TEXT, -- JSON 格式存储其他配置
    is_active INTEGER DEFAULT 1,
    last_sync_at DATETIME,
    last_sync_status TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 集成同步日志表
CREATE TABLE IF NOT EXISTS integration_sync_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    integration_id INTEGER NOT NULL,
    sync_type TEXT,
    sync_direction TEXT CHECK(sync_direction IN ('inbound', 'outbound', 'bidirectional')),
    records_processed INTEGER,
    records_success INTEGER,
    records_failed INTEGER,
    error_message TEXT,
    start_time DATETIME,
    end_time DATETIME,
    duration_seconds INTEGER,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'completed', 'failed', 'partial')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (integration_id) REFERENCES integration_configs(id)
);

-- 自定义字段配置表
CREATE TABLE IF NOT EXISTS custom_fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    field_name TEXT NOT NULL,
    field_label TEXT NOT NULL,
    field_type TEXT DEFAULT 'text' CHECK(field_type IN ('text', 'number', 'date', 'datetime', 'boolean', 'select', 'multi_select', 'textarea', 'file', 'url', 'email', 'phone')),
    field_options TEXT, -- JSON 格式存储选项（用于 select/multi_select）
    is_required INTEGER DEFAULT 0,
    is_unique INTEGER DEFAULT 0,
    default_value TEXT,
    validation_rules TEXT, -- JSON 格式存储验证规则
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE(entity_type, field_name)
);

-- 自定义字段值表
CREATE TABLE IF NOT EXISTS custom_field_values (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id INTEGER NOT NULL,
    entity_id INTEGER NOT NULL,
    field_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES custom_fields(id) ON DELETE CASCADE,
    UNIQUE(field_id, entity_id)
);

-- 工作流配置表
CREATE TABLE IF NOT EXISTS workflow_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_name TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    trigger_type TEXT CHECK(trigger_type IN ('create', 'update', 'delete', 'status_change', 'scheduled', 'manual')),
    trigger_conditions TEXT, -- JSON 格式存储触发条件
    actions TEXT NOT NULL, -- JSON 格式存储执行动作
    is_active INTEGER DEFAULT 1,
    execution_order INTEGER DEFAULT 0,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 工作流执行日志表
CREATE TABLE IF NOT EXISTS workflow_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id INTEGER NOT NULL,
    entity_type TEXT,
    entity_id INTEGER,
    trigger_type TEXT,
    execution_status TEXT DEFAULT 'pending' CHECK(execution_status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
    execution_result TEXT,
    error_message TEXT,
    started_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflow_configs(id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_data_dictionary_items_dict ON data_dictionary_items(dict_id);
CREATE INDEX IF NOT EXISTS idx_operation_logs_user ON operation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_operation_logs_action ON operation_logs(action);
CREATE INDEX IF NOT EXISTS idx_operation_logs_created_at ON operation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_backup_records_config ON backup_records(config_id);
CREATE INDEX IF NOT EXISTS idx_backup_records_status ON backup_records(status);
CREATE INDEX IF NOT EXISTS idx_permission_configs_role ON permission_configs(role_id);
CREATE INDEX IF NOT EXISTS idx_data_permissions_role ON data_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_config ON notification_logs(config_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_integration_sync_logs_integration ON integration_sync_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_custom_fields_entity ON custom_fields(entity_type);
CREATE INDEX IF NOT EXISTS idx_custom_field_values_field ON custom_field_values(field_id);
CREATE INDEX IF NOT EXISTS idx_workflow_configs_entity ON workflow_configs(entity_type);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_workflow ON workflow_logs(workflow_id);

-- 初始化数据 - 系统参数
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, category, description) VALUES 
('system.name', 'ERP 系统', 'string', 'general', '系统名称'),
('system.version', '1.0.0', 'string', 'general', '系统版本号'),
('system.logo_url', '', 'string', 'ui', '系统 Logo URL'),
('system.favicon_url', '', 'string', 'ui', '系统 Favicon URL'),
('system.language', 'zh-CN', 'string', 'general', '默认语言'),
('system.timezone', 'Asia/Shanghai', 'string', 'general', '默认时区'),
('system.date_format', 'YYYY-MM-DD', 'string', 'ui', '日期格式'),
('system.time_format', 'HH:mm:ss', 'string', 'ui', '时间格式'),
('system.items_per_page', '20', 'number', 'ui', '每页显示条数'),
('security.password_min_length', '8', 'number', 'security', '密码最小长度'),
('security.password_require_uppercase', 'true', 'boolean', 'security', '密码需要大写字母'),
('security.password_require_number', 'true', 'boolean', 'security', '密码需要数字'),
('security.password_require_special', 'false', 'boolean', 'security', '密码需要特殊字符'),
('security.session_timeout_minutes', '120', 'number', 'security', '会话超时时间（分钟）'),
('security.max_login_attempts', '5', 'number', 'security', '最大登录尝试次数'),
('security.lockout_duration_minutes', '30', 'number', 'security', '锁定持续时间（分钟）'),
('security.enable_2fa', 'false', 'boolean', 'security', '启用双因素认证'),
('notification.email_enabled', 'true', 'boolean', 'notification', '启用邮件通知'),
('notification.email_smtp_host', '', 'string', 'notification', 'SMTP 服务器地址'),
('notification.email_smtp_port', '587', 'number', 'notification', 'SMTP 端口'),
('notification.email_username', '', 'string', 'notification', 'SMTP 用户名'),
('notification.email_password', '', 'string', 'notification', 'SMTP 密码'),
('notification.email_from_address', '', 'string', 'notification', '发件人邮箱'),
('notification.email_from_name', 'ERP 系统', 'string', 'notification', '发件人名称'),
('backup.auto_backup_enabled', 'false', 'boolean', 'backup', '启用自动备份'),
('backup.auto_backup_time', '02:00', 'string', 'backup', '自动备份时间'),
('backup.retention_days', '30', 'number', 'backup', '备份保留天数'),
('integration.enable_webhooks', 'true', 'boolean', 'integration', '启用 Webhooks'),
('integration.webhook_timeout_seconds', '30', 'number', 'integration', 'Webhook 超时时间');

-- 初始化数据 - 数据字典
INSERT OR IGNORE INTO data_dictionary (dict_code, dict_name, dict_type, description) VALUES 
('order_status', '订单状态', 'system', '销售/采购订单状态'),
('payment_status', '支付状态', 'system', '支付状态'),
('priority_level', '优先级', 'system', '任务/工单优先级'),
('customer_level', '客户等级', 'system', '客户分级'),
('supplier_level', '供应商等级', 'system', '供应商分级'),
('employee_status', '员工状态', 'system', '员工在职状态'),
('leave_type', '请假类型', 'system', '请假类型'),
('finance_type', '财务类型', 'system', '收支类型'),
('asset_status', '资产状态', 'system', '资产使用状态'),
('project_status', '项目状态', 'system', '项目进度状态');

-- 订单状态字典项
INSERT OR IGNORE INTO data_dictionary_items (dict_id, item_key, item_value, item_label, sort_order, color, is_default) VALUES 
((SELECT id FROM data_dictionary WHERE dict_code = 'order_status'), 'draft', 'draft', '草稿', 1, '#999999', 0),
((SELECT id FROM data_dictionary WHERE dict_code = 'order_status'), 'pending', 'pending', '待处理', 2, '#FFA500', 0),
((SELECT id FROM data_dictionary WHERE dict_code = 'order_status'), 'confirmed', 'confirmed', '已确认', 3, '#2196F3', 0),
((SELECT id FROM data_dictionary WHERE dict_code = 'order_status'), 'processing', 'processing', '处理中', 4, '#9C27B0', 0),
((SELECT id FROM data_dictionary WHERE dict_code = 'order_status'), 'completed', 'completed', '已完成', 5, '#4CAF50', 1),
((SELECT id FROM data_dictionary WHERE dict_code = 'order_status'), 'cancelled', 'cancelled', '已取消', 6, '#F44336', 0);

-- 支付状态字典项
INSERT OR IGNORE INTO data_dictionary_items (dict_id, item_key, item_value, item_label, sort_order, color, is_default) VALUES 
((SELECT id FROM data_dictionary WHERE dict_code = 'payment_status'), 'unpaid', 'unpaid', '未支付', 1, '#F44336', 0),
((SELECT id FROM data_dictionary WHERE dict_code = 'payment_status'), 'partial', 'partial', '部分支付', 2, '#FFA500', 0),
((SELECT id FROM data_dictionary WHERE dict_code = 'payment_status'), 'paid', 'paid', '已支付', 3, '#4CAF50', 1),
((SELECT id FROM data_dictionary WHERE dict_code = 'payment_status'), 'refunded', 'refunded', '已退款', 4, '#9E9E9E', 0);

-- 优先级字典项
INSERT OR IGNORE INTO data_dictionary_items (dict_id, item_key, item_value, item_label, sort_order, color, icon) VALUES 
((SELECT id FROM data_dictionary WHERE dict_code = 'priority_level'), 'low', 'low', '低', 1, '#4CAF50', 'arrow_downward'),
((SELECT id FROM data_dictionary WHERE dict_code = 'priority_level'), 'medium', 'medium', '中', 2, '#FFA500', 'remove'),
((SELECT id FROM data_dictionary WHERE dict_code = 'priority_level'), 'high', 'high', '高', 3, '#F44336', 'arrow_upward'),
((SELECT id FROM data_dictionary WHERE dict_code = 'priority_level'), 'urgent', 'urgent', '紧急', 4, '#9C27B0', 'error');

-- 初始化数据 - 通知配置
INSERT OR IGNORE INTO notification_configs (notification_type, notification_name, event_trigger, is_enabled, template_subject, template_content, recipients_type, is_active) VALUES 
('email', '新用户注册通知', 'user.registered', 1, '欢迎加入 ERP 系统', '尊敬的用户，您的账号已成功创建。', 'specific', 1),
('email', '订单创建通知', 'order.created', 1, '新订单通知', '您有一个新订单待处理。', 'role', 1),
('email', '订单完成通知', 'order.completed', 1, '订单已完成', '您的订单已完成，请查收。', 'specific', 1),
('email', '库存预警通知', 'inventory.low_stock', 1, '库存预警', '以下产品库存低于安全库存。', 'role', 1),
('email', '付款提醒通知', 'finance.payment_due', 1, '付款提醒', '您有一笔款项即将到期。', 'specific', 1),
('in_app', '系统公告', 'system.announcement', 1, '系统公告', '{content}', 'all', 1),
('webhook', '数据变更通知', 'data.changed', 0, '', '', 'specific', 0);

-- 初始化数据 - 集成配置示例
INSERT OR IGNORE INTO integration_configs (integration_name, integration_type, provider, description, is_active) VALUES 
('dingtalk', 'oauth', 'DingTalk', '钉钉集成', 0),
('wechat', 'oauth', 'WeChat', '企业微信集成', 0),
('feishu', 'oauth', 'Feishu', '飞书集成', 0),
('aliyun_oss', 'api', 'Aliyun', '阿里云 OSS 存储', 0),
('tencent_cos', 'api', 'Tencent', '腾讯云 COS 存储', 0);
