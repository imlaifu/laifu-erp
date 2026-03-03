-- 销售管理模块数据库表
-- 创建时间：2026-03-03

-- 销售机会表
CREATE TABLE IF NOT EXISTS sales_opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    customer_id INTEGER,
    contact_person TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    source TEXT CHECK(source IN ('referral', 'website', 'cold_call', 'social_media', 'exhibition', 'other')),
    stage TEXT DEFAULT 'lead' CHECK(stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
    estimated_amount REAL DEFAULT 0,
    actual_amount REAL DEFAULT 0,
    win_probability INTEGER DEFAULT 0 CHECK(win_probability >= 0 AND win_probability <= 100),
    expected_close_date DATETIME,
    actual_close_date DATETIME,
    lost_reason TEXT,
    owner_id INTEGER,
    description TEXT,
    next_follow_up DATETIME,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'archived')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- 销售机会跟进记录表
CREATE TABLE IF NOT EXISTS opportunity_followups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    opportunity_id INTEGER NOT NULL,
    followup_type TEXT CHECK(followup_type IN ('call', 'email', 'meeting', 'demo', 'proposal', 'other')),
    subject TEXT,
    content TEXT,
    outcome TEXT,
    followup_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    next_followup_date DATETIME,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES sales_opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 报价单表
CREATE TABLE IF NOT EXISTS sales_quotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quotation_number TEXT NOT NULL UNIQUE,
    opportunity_id INTEGER,
    customer_id INTEGER NOT NULL,
    contact_person TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    valid_until DATETIME,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted')),
    subtotal REAL DEFAULT 0,
    discount_rate REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    notes TEXT,
    terms_conditions TEXT,
    created_by INTEGER,
    approved_by INTEGER,
    approved_at DATETIME,
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES sales_opportunities(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- 报价单明细表
CREATE TABLE IF NOT EXISTS quotation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quotation_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    description TEXT,
    quantity REAL DEFAULT 1,
    unit TEXT DEFAULT '件',
    unit_price REAL DEFAULT 0,
    discount_rate REAL DEFAULT 0,
    amount REAL DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quotation_id) REFERENCES sales_quotations(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 销售合同表
CREATE TABLE IF NOT EXISTS sales_contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_number TEXT NOT NULL UNIQUE,
    contract_name TEXT NOT NULL,
    opportunity_id INTEGER,
    quotation_id INTEGER,
    customer_id INTEGER NOT NULL,
    contract_type TEXT CHECK(contract_type IN ('sales', 'framework', 'distribution', 'agency')),
    start_date DATETIME,
    end_date DATETIME,
    auto_renew BOOLEAN DEFAULT 0,
    total_amount REAL DEFAULT 0,
    paid_amount REAL DEFAULT 0,
    remaining_amount REAL GENERATED ALWAYS AS (total_amount - paid_amount) VIRTUAL,
    currency TEXT DEFAULT 'CNY',
    payment_terms TEXT,
    delivery_terms TEXT,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'pending_approval', 'approved', 'active', 'completed', 'terminated', 'expired')),
    signed_date DATETIME,
    customer_signed_date DATETIME,
    internal_signed_by INTEGER,
    notes TEXT,
    attachment_urls TEXT, -- JSON 格式存储附件 URL 列表
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (opportunity_id) REFERENCES sales_opportunities(id),
    FOREIGN KEY (quotation_id) REFERENCES sales_quotations(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (internal_signed_by) REFERENCES users(id)
);

-- 销售合同明细表
CREATE TABLE IF NOT EXISTS contract_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    description TEXT,
    quantity REAL DEFAULT 1,
    unit TEXT DEFAULT '件',
    unit_price REAL DEFAULT 0,
    discount_rate REAL DEFAULT 0,
    amount REAL DEFAULT 0,
    delivery_date DATETIME,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES sales_contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 销售预测表
CREATE TABLE IF NOT EXISTS sales_forecasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_type TEXT CHECK(period_type IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    period_start DATETIME NOT NULL,
    period_end DATETIME NOT NULL,
    product_id INTEGER,
    category_id INTEGER,
    forecast_quantity REAL DEFAULT 0,
    forecast_amount REAL DEFAULT 0,
    actual_quantity REAL DEFAULT 0,
    actual_amount REAL DEFAULT 0,
    accuracy_rate REAL DEFAULT 0,
    method TEXT CHECK(method IN ('historical_avg', 'trend_analysis', 'seasonal', 'manual', 'ai_predicted')),
    confidence_level REAL DEFAULT 0,
    notes TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (category_id) REFERENCES product_categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 销售佣金表
CREATE TABLE IF NOT EXISTS sales_commissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sales_person_id INTEGER NOT NULL,
    opportunity_id INTEGER,
    contract_id INTEGER,
    order_id INTEGER,
    commission_type TEXT CHECK(commission_type IN ('percentage', 'fixed', 'tiered', 'bonus')),
    commission_rate REAL DEFAULT 0,
    base_amount REAL DEFAULT 0,
    commission_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'paid', 'cancelled')),
    calculation_date DATETIME,
    payment_date DATETIME,
    notes TEXT,
    approved_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sales_person_id) REFERENCES users(id),
    FOREIGN KEY (opportunity_id) REFERENCES sales_opportunities(id),
    FOREIGN KEY (contract_id) REFERENCES sales_contracts(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- 销售业绩表
CREATE TABLE IF NOT EXISTS sales_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sales_person_id INTEGER NOT NULL,
    period_type TEXT CHECK(period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    period_start DATETIME NOT NULL,
    period_end DATETIME NOT NULL,
    target_amount REAL DEFAULT 0,
    actual_amount REAL DEFAULT 0,
    achievement_rate REAL DEFAULT 0,
    opportunities_count INTEGER DEFAULT 0,
    won_opportunities_count INTEGER DEFAULT 0,
    quotations_count INTEGER DEFAULT 0,
    contracts_count INTEGER DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    total_commission REAL DEFAULT 0,
    ranking INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sales_person_id) REFERENCES users(id),
    UNIQUE (sales_person_id, period_type, period_start, period_end)
);

-- 销售活动日志表
CREATE TABLE IF NOT EXISTS sales_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_type TEXT CHECK(activity_type IN ('call', 'email', 'meeting', 'demo', 'proposal', 'contract', 'followup', 'other')),
    subject TEXT NOT NULL,
    description TEXT,
    related_type TEXT CHECK(related_type IN ('opportunity', 'quotation', 'contract', 'customer', 'order')),
    related_id INTEGER,
    participant_ids TEXT, -- JSON 格式存储参与者 ID 列表
    scheduled_time DATETIME,
    actual_time DATETIME,
    duration_minutes INTEGER,
    location TEXT,
    outcome TEXT,
    status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_opportunities_customer ON sales_opportunities(customer_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON sales_opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_owner ON sales_opportunities(owner_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON sales_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_followups_opportunity ON opportunity_followups(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_quotations_customer ON sales_quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON sales_quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation ON quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_contracts_customer ON sales_contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON sales_contracts(status);
CREATE INDEX IF NOT EXISTS idx_contract_items_contract ON contract_items(contract_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_period ON sales_forecasts(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_forecasts_product ON sales_forecasts(product_id);
CREATE INDEX IF NOT EXISTS idx_commissions_sales_person ON sales_commissions(sales_person_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON sales_commissions(status);
CREATE INDEX IF NOT EXISTS idx_performance_sales_person ON sales_performance(sales_person_id);
CREATE INDEX IF NOT EXISTS idx_performance_period ON sales_performance(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_activities_type ON sales_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_status ON sales_activities(status);

-- 初始化数据
INSERT INTO sales_opportunities (name, customer_id, contact_person, contact_phone, source, stage, priority, estimated_amount, win_probability, expected_close_date, owner_id, description) VALUES 
('企业软件采购项目', 1, '张经理', '13800138001', 'referral', 'proposal', 'high', 500000.00, 70, '2026-03-30', 1, '大型企业 ERP 系统采购，包含多个模块'),
('年度办公用品供应', 2, '李主任', '13800138002', 'website', 'negotiation', 'medium', 80000.00, 80, '2026-03-15', 2, '年度办公用品框架采购协议'),
('新公司产品采购', 3, '王总', '13800138003', 'exhibition', 'qualified', 'high', 200000.00, 50, '2026-04-15', 1, '新成立公司的首批办公设备采购');

INSERT INTO sales_quotations (quotation_number, opportunity_id, customer_id, contact_person, contact_email, valid_until, status, subtotal, discount_rate, tax_rate, total_amount, notes, created_by) VALUES 
('QT-2026-001', 1, 1, '张经理', 'zhang@example.com', '2026-03-20', 'sent', 500000.00, 5.0, 13.0, 552250.00, '包含 1 年免费维护', 1),
('QT-2026-002', 2, 2, '李主任', 'li@example.com', '2026-03-10', 'accepted', 80000.00, 10.0, 13.0, 81360.00, '批量采购优惠', 2);

INSERT INTO sales_contracts (contract_number, contract_name, opportunity_id, quotation_id, customer_id, contract_type, start_date, end_date, total_amount, currency, payment_terms, status, signed_date, created_by) VALUES 
('CT-2026-001', '企业软件采购合同', 1, 1, 1, 'sales', '2026-03-01', '2027-03-01', 552250.00, 'CNY', '30% 预付款，60% 交付后，10% 质保金', 'active', '2026-03-01', 1);

INSERT INTO sales_forecasts (period_type, period_start, period_end, forecast_quantity, forecast_amount, actual_quantity, actual_amount, method, confidence_level, created_by) VALUES 
('monthly', '2026-03-01', '2026-03-31', 100, 800000.00, 450000.00, 450000.00, 'historical_avg', 0.85, 1),
('monthly', '2026-04-01', '2026-04-30', 120, 950000.00, 0, 0, 'trend_analysis', 0.75, 1);

INSERT INTO sales_commissions (sales_person_id, opportunity_id, commission_type, commission_rate, base_amount, commission_amount, status, calculation_date, notes) VALUES 
(1, 1, 'percentage', 3.0, 552250.00, 16567.50, 'pending', '2026-03-01', '首单佣金'),
(2, 2, 'percentage', 2.5, 81360.00, 2034.00, 'approved', '2026-03-01', '季度销售奖励');

INSERT INTO sales_activities (activity_type, subject, related_type, related_id, scheduled_time, status, created_by, description) VALUES 
('meeting', '项目需求讨论会', 'opportunity', 1, '2026-03-05 14:00:00', 'completed', 1, '与客户讨论 ERP 系统具体需求'),
('call', '合同条款确认', 'contract', 1, '2026-03-02 10:00:00', 'completed', 1, '确认合同付款条款细节'),
('email', '报价单发送', 'quotation', 1, '2026-03-01 09:00:00', 'completed', 1, '发送正式报价单给客户');
