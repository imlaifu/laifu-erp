-- 销售管理模块数据库表
-- 创建时间：2026-03-03

-- 销售机会表
CREATE TABLE IF NOT EXISTS sales_opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_no TEXT NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    source TEXT DEFAULT 'inbound' CHECK(source IN ('inbound', 'outbound', 'referral', 'marketing', 'website', 'social', 'other')),
    stage TEXT DEFAULT 'prospecting' CHECK(stage IN ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
    estimated_amount REAL DEFAULT 0,
    actual_amount REAL DEFAULT 0,
    probability INTEGER DEFAULT 0 CHECK(probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    actual_close_date DATE,
    loss_reason TEXT,
    owner_id INTEGER,
    status TEXT DEFAULT 'open' CHECK(status IN ('open', 'won', 'lost', 'abandoned')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- 销售机会跟进记录表
CREATE TABLE IF NOT EXISTS opportunity_followups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id INTEGER NOT NULL,
    followup_date DATE NOT NULL,
    followup_type TEXT DEFAULT 'call' CHECK(followup_type IN ('call', 'email', 'meeting', 'demo', 'proposal', 'other')),
    subject TEXT,
    description TEXT,
    outcome TEXT,
    next_followup_date DATE,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES sales_opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 报价单表
CREATE TABLE IF NOT EXISTS sales_quotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quotation_no TEXT NOT NULL UNIQUE,
    opportunity_id INTEGER,
    customer_id INTEGER NOT NULL,
    quotation_date DATE NOT NULL,
    expiry_date DATE,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted')),
    currency TEXT DEFAULT 'CNY',
    subtotal REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    shipping_cost REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    payment_terms TEXT,
    delivery_terms TEXT,
    notes TEXT,
    attachment_urls TEXT, -- JSON 格式存储附件 URL 列表
    created_by INTEGER,
    sent_at DATETIME,
    accepted_at DATETIME,
    rejected_at DATETIME,
    rejection_reason TEXT,
    converted_order_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES sales_opportunities(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (converted_order_id) REFERENCES sales_orders(id)
);

-- 报价单明细表
CREATE TABLE IF NOT EXISTS quotation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quotation_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    description TEXT,
    quantity INTEGER NOT NULL,
    unit TEXT DEFAULT '件',
    unit_price REAL NOT NULL,
    discount_rate REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    total_amount REAL GENERATED ALWAYS AS (quantity * unit_price * (1 - discount_rate / 100)) VIRTUAL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quotation_id) REFERENCES sales_quotations(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 销售合同表
CREATE TABLE IF NOT EXISTS sales_contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_no TEXT NOT NULL UNIQUE,
    quotation_id INTEGER,
    opportunity_id INTEGER,
    customer_id INTEGER NOT NULL,
    contract_type TEXT DEFAULT 'standard' CHECK(contract_type IN ('standard', 'framework', 'annual', 'project')),
    title TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    total_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'pending_review', 'active', 'completed', 'expired', 'terminated')),
    payment_terms TEXT,
    delivery_terms TEXT,
    terms TEXT, -- 合同条款
    attachment_urls TEXT, -- JSON 格式存储附件 URL 列表
    signed_by_customer TEXT,
    signed_by_company TEXT,
    signed_at DATETIME,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quotation_id) REFERENCES sales_quotations(id),
    FOREIGN KEY (opportunity_id) REFERENCES sales_opportunities(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 销售订单表
CREATE TABLE IF NOT EXISTS sales_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no TEXT NOT NULL UNIQUE,
    quotation_id INTEGER,
    contract_id INTEGER,
    opportunity_id INTEGER,
    customer_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'confirmed', 'processing', 'partially_shipped', 'shipped', 'delivered', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid', 'partially_paid', 'paid', 'refunded')),
    currency TEXT DEFAULT 'CNY',
    subtotal REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    shipping_cost REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    paid_amount REAL DEFAULT 0,
    payment_terms TEXT,
    delivery_address TEXT,
    shipping_method TEXT,
    tracking_number TEXT,
    notes TEXT,
    attachment_urls TEXT, -- JSON 格式存储附件 URL 列表
    created_by INTEGER,
    confirmed_at DATETIME,
    completed_at DATETIME,
    cancelled_at DATETIME,
    cancellation_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quotation_id) REFERENCES sales_quotations(id),
    FOREIGN KEY (contract_id) REFERENCES sales_contracts(id),
    FOREIGN KEY (opportunity_id) REFERENCES sales_opportunities(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 销售订单明细表
CREATE TABLE IF NOT EXISTS sales_order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    description TEXT,
    quantity INTEGER NOT NULL,
    shipped_quantity INTEGER DEFAULT 0,
    unit TEXT DEFAULT '件',
    unit_price REAL NOT NULL,
    discount_rate REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    total_amount REAL GENERATED ALWAYS AS (quantity * unit_price * (1 - discount_rate / 100)) VIRTUAL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES sales_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 销售预测表
CREATE TABLE IF NOT EXISTS sales_forecasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    forecast_no TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    forecast_type TEXT DEFAULT 'monthly' CHECK(forecast_type IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    product_id INTEGER,
    customer_id INTEGER,
    sales_rep_id INTEGER,
    forecasted_amount REAL DEFAULT 0,
    actual_amount REAL DEFAULT 0,
    accuracy REAL DEFAULT 0, -- 预测准确率
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (sales_rep_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 佣金规则表
CREATE TABLE IF NOT EXISTS commission_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule_name TEXT NOT NULL,
    rule_type TEXT DEFAULT 'percentage' CHECK(rule_type IN ('percentage', 'fixed', 'tiered')),
    applicable_to TEXT DEFAULT 'all' CHECK(applicable_to IN ('all', 'product', 'category', 'customer_type')),
    applicable_id INTEGER, -- product_id, category_id, or customer_type
    min_amount REAL DEFAULT 0,
    max_amount REAL,
    commission_rate REAL DEFAULT 0, -- 百分比
    fixed_amount REAL DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    effective_from DATE,
    effective_to DATE,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 佣金记录表
CREATE TABLE IF NOT EXISTS commission_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_no TEXT NOT NULL UNIQUE,
    sales_rep_id INTEGER NOT NULL,
    order_id INTEGER,
    contract_id INTEGER,
    commission_rule_id INTEGER,
    calculation_base REAL DEFAULT 0, -- 计算基数（订单金额等）
    commission_rate REAL DEFAULT 0,
    commission_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'paid', 'cancelled')),
    payment_date DATE,
    notes TEXT,
    calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_by INTEGER,
    approved_at DATETIME,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sales_rep_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES sales_orders(id),
    FOREIGN KEY (contract_id) REFERENCES sales_contracts(id),
    FOREIGN KEY (commission_rule_id) REFERENCES commission_rules(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- 销售业绩统计表 (视图)
CREATE VIEW IF NOT EXISTS sales_performance_stats AS
SELECT 
    u.id as sales_rep_id,
    u.name as sales_rep_name,
    strftime('%Y-%m', so.created_at) as month,
    COUNT(DISTINCT so.id) as order_count,
    SUM(so.total_amount) as total_sales,
    SUM(so.paid_amount) as collected_amount,
    COUNT(DISTINCT CASE WHEN so.status = 'completed' THEN so.id END) as completed_orders,
    COUNT(DISTINCT opp.id) as opportunities,
    COUNT(DISTINCT CASE WHEN opp.status = 'won' THEN opp.id END) as won_opportunities
FROM users u
LEFT JOIN sales_orders so ON u.id = so.created_by
LEFT JOIN sales_opportunities opp ON u.id = opp.owner_id AND strftime('%Y-%m', opp.created_at) = strftime('%Y-%m', so.created_at)
WHERE u.id IN (SELECT id FROM users WHERE role IN ('sales', 'admin'))
GROUP BY u.id, strftime('%Y-%m', so.created_at);

-- 销售漏斗统计表 (视图)
CREATE VIEW IF NOT EXISTS sales_funnel_stats AS
SELECT 
    stage,
    COUNT(*) as opportunity_count,
    SUM(estimated_amount) as total_estimated_amount,
    AVG(probability) as avg_probability
FROM sales_opportunities
WHERE status = 'open'
GROUP BY stage;

-- 索引
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_customer ON sales_opportunities(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_stage ON sales_opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_status ON sales_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_owner ON sales_opportunities(owner_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_followups_opportunity ON opportunity_followups(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_sales_quotations_customer ON sales_quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_quotations_status ON sales_quotations(status);
CREATE INDEX IF NOT EXISTS idx_sales_quotations_opportunity ON sales_quotations(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation ON quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_sales_contracts_customer ON sales_contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_contracts_status ON sales_contracts(status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON sales_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON sales_orders(status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_order_date ON sales_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order ON sales_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_sales_forecasts_period ON sales_forecasts(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_commission_records_sales_rep ON commission_records(sales_rep_id);
CREATE INDEX IF NOT EXISTS idx_commission_records_status ON commission_records(status);

-- 初始化数据 - 销售单号前缀
INSERT OR IGNORE INTO settings (key, value, description) VALUES 
('sales.opportunity_no_prefix', 'OPP', '销售机会编号前缀'),
('sales.quotation_no_prefix', 'QT', '报价单编号前缀'),
('sales.contract_no_prefix', 'SC', '销售合同编号前缀'),
('sales.order_no_prefix', 'SO', '销售订单编号前缀'),
('sales.forecast_no_prefix', 'SF', '销售预测编号前缀'),
('sales.commission_no_prefix', 'CM', '佣金记录编号前缀');

-- 初始化佣金规则示例
INSERT OR IGNORE INTO commission_rules (rule_name, rule_type, commission_rate, is_active, effective_from) VALUES 
('标准销售佣金', 'percentage', 5.0, 1, date('now')),
('大客户佣金', 'percentage', 8.0, 1, date('now')),
('新产品推广佣金', 'percentage', 10.0, 1, date('now'));
