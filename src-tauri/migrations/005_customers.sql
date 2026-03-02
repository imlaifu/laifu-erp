-- 客户管理模块数据库表
-- 创建时间：2026-03-03

-- 客户表
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'individual' CHECK(type IN ('individual', 'company', 'government', 'other')),
    contact_person TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    contact_title TEXT,
    id_number TEXT, -- 身份证号或统一社会信用代码
    tax_id TEXT, -- 税号
    address TEXT,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    country TEXT DEFAULT '中国',
    website TEXT,
    industry TEXT,
    source TEXT, -- 客户来源 (referral, website, advertisement, etc.)
    level TEXT DEFAULT 'normal' CHECK(level IN ('vip', 'normal', 'potential', 'blacklist')),
    credit_limit REAL DEFAULT 0,
    credit_days INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'potential')),
    notes TEXT,
    owner_id INTEGER, -- 负责人 (用户 ID)
    parent_id INTEGER, -- 父级客户 (用于集团客户)
    tags TEXT, -- JSON 格式存储标签列表
    custom_fields TEXT, -- JSON 格式存储扩展字段
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES customers(id)
);

-- 客户联系人表
CREATE TABLE IF NOT EXISTS customer_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    title TEXT, -- 职位
    phone TEXT,
    mobile TEXT,
    email TEXT,
    wechat TEXT,
    qq TEXT,
    is_primary INTEGER DEFAULT 0, -- 是否主要联系人
    notes TEXT,
    birthday DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 客户联系记录表
CREATE TABLE IF NOT EXISTS customer_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    contact_id INTEGER,
    interaction_type TEXT NOT NULL CHECK(interaction_type IN ('call', 'meeting', 'email', 'wechat', 'visit', 'other')),
    subject TEXT,
    content TEXT,
    result TEXT,
    follow_up_date DATE,
    follow_up_notes TEXT,
    operator_id INTEGER, -- 操作人 (用户 ID)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES customer_contacts(id),
    FOREIGN KEY (operator_id) REFERENCES users(id)
);

-- 客户分级配置表
CREATE TABLE IF NOT EXISTS customer_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_rate REAL DEFAULT 0, -- 默认折扣率
    credit_days INTEGER DEFAULT 0, -- 默认账期
    min_purchase_amount REAL DEFAULT 0, -- 最低采购额要求
    benefits TEXT, -- JSON 格式存储权益列表
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 客户标签表
CREATE TABLE IF NOT EXISTS customer_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#1890ff',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 客户跟进计划表
CREATE TABLE IF NOT EXISTS customer_follow_ups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    contact_id INTEGER,
    follow_up_type TEXT NOT NULL CHECK(follow_up_type IN ('call', 'meeting', 'email', 'wechat', 'visit', 'other')),
    subject TEXT NOT NULL,
    content TEXT,
    planned_date DATE NOT NULL,
    completed_date DATE,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled', 'rescheduled')),
    priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
    operator_id INTEGER,
    result TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES customer_contacts(id),
    FOREIGN KEY (operator_id) REFERENCES users(id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_follow_ups_customer ON customer_follow_ups(customer_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON customer_follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_planned_date ON customer_follow_ups(planned_date);

-- 索引
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(code);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(type);
CREATE INDEX IF NOT EXISTS idx_customers_level ON customers(level);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_owner ON customers(owner_id);
CREATE INDEX IF NOT EXISTS idx_customers_city ON customers(city);
CREATE INDEX IF NOT EXISTS idx_contacts_customer ON customer_contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_customer ON customer_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON customer_interactions(interaction_type);

-- 初始化数据
INSERT INTO customer_levels (name, code, description, discount_rate, credit_days, min_purchase_amount, benefits) VALUES 
('VIP 客户', 'vip', '重要客户，享受最优待遇', 0.15, 60, 100000, '["优先发货", "专属客服", "定制服务", "年度返利"]'),
('普通客户', 'normal', '一般客户', 0.05, 30, 0, '["标准服务", "正常账期"]'),
('潜在客户', 'potential', '正在开发的客户', 0, 0, 0, '["试用产品", "优惠报价"]'),
('黑名单客户', 'blacklist', '禁止交易的客户', 0, 0, 0, '["禁止交易"]');

INSERT INTO customer_tags (name, color, description) VALUES 
('重点客户', '#ff4d4f', '需要重点关注的客户'),
('长期合作', '#52c41a', '长期稳定合作的客户'),
('价格敏感', '#faad14', '对价格比较敏感的客户'),
('新客户', '#1890ff', '新开发的客户'),
('流失风险', '#722ed1', '有流失风险的客户');

INSERT INTO customers (code, name, type, contact_person, contact_phone, contact_email, level, status, source, notes) VALUES 
('CUST-001', '北京科技有限公司', 'company', '张三', '13800138001', 'zhangsan@bjtech.com', 'vip', 'active', 'referral', '重要战略合作伙伴'),
('CUST-002', '上海贸易公司', 'company', '李四', '13800138002', 'lisi@shtrade.com', 'normal', 'active', 'website', '稳定采购客户'),
('CUST-003', '王先生', 'individual', '王先生', '13800138003', 'wang@email.com', 'potential', 'active', 'advertisement', '潜在客户，正在跟进');
