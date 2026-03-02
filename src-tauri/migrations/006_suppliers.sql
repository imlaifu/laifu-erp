-- 供应商管理模块数据库表
-- 创建时间：2026-03-03

-- 供应商表
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'company' CHECK(type IN ('company', 'individual', 'manufacturer', 'distributor', 'other')),
    contact_person TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    contact_title TEXT,
    id_number TEXT, -- 身份证号或统一社会信用代码
    tax_id TEXT, -- 税号
    bank_name TEXT, -- 开户行
    bank_account TEXT, -- 银行账号
    address TEXT,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    country TEXT DEFAULT '中国',
    website TEXT,
    industry TEXT,
    source TEXT, -- 供应商来源 (referral, exhibition, website, etc.)
    level TEXT DEFAULT 'normal' CHECK(level IN ('vip', 'normal', 'potential', 'blacklist')),
    credit_days INTEGER DEFAULT 0, -- 账期 (天)
    payment_terms TEXT, -- 付款条件 (T/T, L/C, etc.)
    min_order_amount REAL DEFAULT 0, -- 最小订单金额
    delivery_lead_time INTEGER DEFAULT 0, -- 交货周期 (天)
    quality_rating REAL DEFAULT 5.0, -- 质量评分 (1-5)
    service_rating REAL DEFAULT 5.0, -- 服务评分 (1-5)
    delivery_rating REAL DEFAULT 5.0, -- 交货评分 (1-5)
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'potential')),
    notes TEXT,
    owner_id INTEGER, -- 负责人 (用户 ID)
    parent_id INTEGER, -- 父级供应商 (用于集团供应商)
    tags TEXT, -- JSON 格式存储标签列表
    custom_fields TEXT, -- JSON 格式存储扩展字段
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES suppliers(id)
);

-- 供应商联系人表
CREATE TABLE IF NOT EXISTS supplier_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
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
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- 供应商联系记录表
CREATE TABLE IF NOT EXISTS supplier_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
    contact_id INTEGER,
    interaction_type TEXT NOT NULL CHECK(interaction_type IN ('call', 'meeting', 'email', 'wechat', 'visit', 'other')),
    subject TEXT,
    content TEXT,
    result TEXT,
    follow_up_date DATE,
    follow_up_notes TEXT,
    operator_id INTEGER, -- 操作人 (用户 ID)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES supplier_contacts(id),
    FOREIGN KEY (operator_id) REFERENCES users(id)
);

-- 供应商分级配置表
CREATE TABLE IF NOT EXISTS supplier_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_rate REAL DEFAULT 0, -- 默认折扣率
    credit_days INTEGER DEFAULT 0, -- 默认账期
    min_order_amount REAL DEFAULT 0, -- 最低订单额要求
    benefits TEXT, -- JSON 格式存储权益列表
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 供应商标签表
CREATE TABLE IF NOT EXISTS supplier_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#1890ff',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 供应商评估表
CREATE TABLE IF NOT EXISTS supplier_evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
    evaluation_type TEXT NOT NULL CHECK(evaluation_type IN ('quarterly', 'annual', 'project', 'other')),
    evaluation_date DATE NOT NULL,
    quality_score REAL, -- 质量评分 (1-5)
    delivery_score REAL, -- 交货评分 (1-5)
    service_score REAL, -- 服务评分 (1-5)
    price_score REAL, -- 价格评分 (1-5)
    total_score REAL, -- 总分
    evaluator_id INTEGER, -- 评估人
    comments TEXT, -- 评估意见
    improvement_notes TEXT, -- 改进建议
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'approved')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES users(id)
);

-- 供应商产品表 (供应商可供应的产品)
CREATE TABLE IF NOT EXISTS supplier_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_code TEXT, -- 供应商的产品编号
    product_name TEXT, -- 供应商的产品名称
    unit_price REAL, -- 供应价格
    currency TEXT DEFAULT 'CNY',
    min_order_quantity INTEGER DEFAULT 1, -- 最小起订量
    lead_time INTEGER DEFAULT 0, -- 交货周期 (天)
    is_preferred INTEGER DEFAULT 0, -- 是否首选供应商
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(code);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_type ON suppliers(type);
CREATE INDEX IF NOT EXISTS idx_suppliers_level ON suppliers(level);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_owner ON suppliers(owner_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_city ON suppliers(city);
CREATE INDEX IF NOT EXISTS idx_supplier_contacts_supplier ON supplier_contacts(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_interactions_supplier ON supplier_interactions(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_interactions_type ON supplier_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_supplier_evaluations_supplier ON supplier_evaluations(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_evaluations_date ON supplier_evaluations(evaluation_date);
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier ON supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_product ON supplier_products(product_id);

-- 初始化数据
INSERT INTO supplier_levels (name, code, description, discount_rate, credit_days, min_order_amount, benefits) VALUES 
('VIP 供应商', 'vip', '重要供应商，享受最优合作条件', 0.10, 60, 500000, '["优先付款", "战略合作", "年度返利", "联合开发"]'),
('普通供应商', 'normal', '一般供应商', 0, 30, 0, '["标准合作", "正常账期"]'),
('潜在供应商', 'potential', '正在考察的供应商', 0, 0, 0, '["试用订单", "考察期"]'),
('黑名单供应商', 'blacklist', '禁止合作的供应商', 0, 0, 0, '["禁止合作"]');

INSERT INTO supplier_tags (name, color, description) VALUES 
('战略供应商', '#ff4d4f', '战略合作伙伴供应商'),
('长期合作', '#52c41a', '长期稳定合作的供应商'),
('价格优势', '#faad14', '价格有竞争力的供应商'),
('新供应商', '#1890ff', '新开发的供应商'),
('质量优秀', '#722ed1', '产品质量优秀的供应商'),
('交货及时', '#13c2c2', '交货准时率高的供应商');

INSERT INTO suppliers (code, name, type, contact_person, contact_phone, contact_email, level, status, source, industry, notes) VALUES 
('SUP-001', '深圳电子科技有限公司', 'manufacturer', '陈经理', '13900139001', 'chen@sztech.com', 'vip', 'active', 'exhibition', '电子产品', '核心元器件供应商'),
('SUP-002', '上海贸易公司', 'distributor', '刘经理', '13900139002', 'liu@shtrade.com', 'normal', 'active', 'referral', '贸易', '包装材料供应商'),
('SUP-003', '广州制造厂', 'manufacturer', '黄厂长', '13900139003', 'huang@gzfactory.com', 'potential', 'active', 'website', '机械制造', '潜在供应商，正在考察');
