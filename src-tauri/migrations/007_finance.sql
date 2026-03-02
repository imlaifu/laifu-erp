-- 财务管理模块数据库表
-- 创建时间：2026-03-03

-- 收支记录表
CREATE TABLE IF NOT EXISTS finance_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_no TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    category TEXT NOT NULL, -- 收支分类 (销售收款，采购付款，费用报销，etc.)
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'CNY',
    exchange_rate REAL DEFAULT 1.0, -- 汇率
    base_amount REAL, -- 本位币金额
    transaction_date DATE NOT NULL,
    related_order_id INTEGER, -- 关联订单 ID
    related_order_type TEXT, -- 关联订单类型 (sales_order, purchase_order)
    customer_id INTEGER, -- 关联客户 ID
    supplier_id INTEGER, -- 关联供应商 ID
    account_id INTEGER, -- 关联账户 ID
    payment_method TEXT, -- 支付方式 (cash, bank_transfer, alipay, wechat, credit_card, other)
    reference_no TEXT, -- 参考号 (银行流水号，支票号，etc.)
    description TEXT, -- 收支说明
    attachment_urls TEXT, -- JSON 格式存储附件 URL 列表
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled')),
    operator_id INTEGER, -- 操作人 (用户 ID)
    reviewer_id INTEGER, -- 审核人 (用户 ID)
    review_date DATETIME, -- 审核时间
    remarks TEXT, -- 备注
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (related_order_id) REFERENCES sales_orders(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (operator_id) REFERENCES users(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- 会计科目表
CREATE TABLE IF NOT EXISTS finance_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    parent_id INTEGER, -- 父级科目 ID
    level INTEGER DEFAULT 1, -- 科目级别
    type TEXT NOT NULL CHECK(type IN ('asset', 'liability', 'equity', 'income', 'expense')),
    balance_direction TEXT NOT NULL CHECK(balance_direction IN ('debit', 'credit')),
    is_cash_equivalent INTEGER DEFAULT 0, -- 是否现金等价物
    is_bank_account INTEGER DEFAULT 0, -- 是否银行账户
    bank_name TEXT, -- 开户行名称
    bank_account_no TEXT, -- 银行账号
    currency TEXT DEFAULT 'CNY',
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (parent_id) REFERENCES finance_accounts(id)
);

-- 收支分类表
CREATE TABLE IF NOT EXISTS finance_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    parent_id INTEGER, -- 父级分类 ID
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    level INTEGER DEFAULT 1,
    description TEXT,
    is_default INTEGER DEFAULT 0, -- 是否默认分类
    sort_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (parent_id) REFERENCES finance_categories(id)
);

-- 发票管理表
CREATE TABLE IF NOT EXISTS finance_invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_no TEXT NOT NULL UNIQUE, -- 发票号码
    invoice_code TEXT, -- 发票代码
    type TEXT NOT NULL CHECK(type IN ('vat_special', 'vat_normal', 'electronic', 'other')), -- 发票类型
    kind TEXT NOT NULL CHECK(kind IN ('input', 'output')), -- 进项/销项
    amount REAL NOT NULL, -- 金额 (不含税)
    tax_amount REAL NOT NULL, -- 税额
    total_amount REAL NOT NULL, -- 价税合计
    currency TEXT DEFAULT 'CNY',
    invoice_date DATE NOT NULL, -- 开票日期
    check_code TEXT, -- 校验码
    machine_no TEXT, -- 机器编号
    seller_name TEXT, -- 销售方名称
    seller_tax_id TEXT, -- 销售方税号
    seller_address_phone TEXT, -- 销售方地址电话
    seller_bank_account TEXT, -- 销售方开户行及账号
    buyer_name TEXT, -- 购买方名称
    buyer_tax_id TEXT, -- 购买方税号
    buyer_address_phone TEXT, -- 购买方地址电话
    buyer_bank_account TEXT, -- 购买方开户行及账号
    related_order_id INTEGER, -- 关联订单 ID
    related_order_type TEXT, -- 关联订单类型
    customer_id INTEGER, -- 关联客户 ID
    supplier_id INTEGER, -- 关联供应商 ID
    status TEXT DEFAULT 'unissued' CHECK(status IN ('unissued', 'issued', 'received', 'reimbursed', 'cancelled', 'red')),
    payment_status TEXT DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid', 'partial', 'paid')),
    issue_date DATETIME, -- 开票时间
    receive_date DATETIME, -- 收票时间
    reimbursement_date DATETIME, -- 报销时间
    operator_id INTEGER, -- 操作人
    remarks TEXT,
    attachment_urls TEXT, -- JSON 格式存储发票图片 URL
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (related_order_id) REFERENCES sales_orders(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (operator_id) REFERENCES users(id)
);

-- 发票明细表
CREATE TABLE IF NOT EXISTS finance_invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    product_name TEXT NOT NULL, -- 商品名称
    specification TEXT, -- 规格型号
    unit TEXT, -- 单位
    quantity REAL, -- 数量
    unit_price REAL, -- 单价
    amount REAL NOT NULL, -- 金额
    tax_rate REAL DEFAULT 0.13, -- 税率
    tax_amount REAL NOT NULL, -- 税额
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES finance_invoices(id) ON DELETE CASCADE
);

-- 财务报表配置表
CREATE TABLE IF NOT EXISTS finance_report_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_type TEXT NOT NULL UNIQUE, -- 报表类型 (profit_loss, balance_sheet, cash_flow)
    name TEXT NOT NULL,
    config TEXT, -- JSON 格式存储报表配置
    is_enabled INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 应收应付表
CREATE TABLE IF NOT EXISTS finance_receivables_payables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('receivable', 'payable')),
    related_order_id INTEGER NOT NULL,
    related_order_type TEXT NOT NULL, -- sales_order, purchase_order
    customer_id INTEGER,
    supplier_id INTEGER,
    total_amount REAL NOT NULL, -- 应收/应付总额
    paid_amount REAL DEFAULT 0, -- 已收/已付金额
    unpaid_amount REAL NOT NULL, -- 未收/未付金额
    due_date DATE, -- 到期日期
    overdue_days INTEGER DEFAULT 0, -- 逾期天数
    status TEXT DEFAULT 'unpaid' CHECK(status IN ('unpaid', 'partial', 'paid', 'overdue', 'cancelled')),
    last_payment_date DATETIME, -- 最后收款/付款日期
    operator_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (related_order_id) REFERENCES sales_orders(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (operator_id) REFERENCES users(id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_finance_transactions_type ON finance_transactions(type);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_category ON finance_transactions(category);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_date ON finance_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_status ON finance_transactions(status);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_customer ON finance_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_supplier ON finance_transactions(supplier_id);
CREATE INDEX IF NOT EXISTS idx_finance_accounts_code ON finance_accounts(code);
CREATE INDEX IF NOT EXISTS idx_finance_accounts_type ON finance_accounts(type);
CREATE INDEX IF NOT EXISTS idx_finance_categories_type ON finance_categories(type);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_type ON finance_invoices(type);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_kind ON finance_invoices(kind);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_date ON finance_invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_status ON finance_invoices(status);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_customer ON finance_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_supplier ON finance_invoices(supplier_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoice_items_invoice ON finance_invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_finance_receivables_payables_type ON finance_receivables_payables(type);
CREATE INDEX IF NOT EXISTS idx_finance_receivables_payables_status ON finance_receivables_payables(status);
CREATE INDEX IF NOT EXISTS idx_finance_receivables_payables_customer ON finance_receivables_payables(customer_id);
CREATE INDEX IF NOT EXISTS idx_finance_receivables_payables_supplier ON finance_receivables_payables(supplier_id);

-- 初始化数据 - 会计科目
INSERT INTO finance_accounts (code, name, type, balance_direction, is_cash_equivalent, is_bank_account, status) VALUES
('1001', '库存现金', 'asset', 'debit', 1, 0, 'active'),
('1002', '银行存款', 'asset', 'debit', 1, 1, 'active'),
('100201', '工商银行', 'asset', 'debit', 1, 1, 'active'),
('100202', '建设银行', 'asset', 'debit', 1, 1, 'active'),
('1122', '应收账款', 'asset', 'debit', 0, 0, 'active'),
('1221', '其他应收款', 'asset', 'debit', 0, 0, 'active'),
('1405', '库存商品', 'asset', 'debit', 0, 0, 'active'),
('2202', '应付账款', 'liability', 'credit', 0, 0, 'active'),
('2241', '其他应付款', 'liability', 'credit', 0, 0, 'active'),
('4001', '实收资本', 'equity', 'credit', 0, 0, 'active'),
('4101', '盈余公积', 'equity', 'credit', 0, 0, 'active'),
('4103', '本年利润', 'equity', 'credit', 0, 0, 'active'),
('6001', '主营业务收入', 'income', 'credit', 0, 0, 'active'),
('6051', '其他业务收入', 'income', 'credit', 0, 0, 'active'),
('6301', '营业外收入', 'income', 'credit', 0, 0, 'active'),
('6401', '主营业务成本', 'expense', 'debit', 0, 0, 'active'),
('6402', '其他业务成本', 'expense', 'debit', 0, 0, 'active'),
('6601', '销售费用', 'expense', 'debit', 0, 0, 'active'),
('6602', '管理费用', 'expense', 'debit', 0, 0, 'active'),
('6603', '财务费用', 'expense', 'debit', 0, 0, 'active');

-- 初始化数据 - 收支分类
INSERT INTO finance_categories (code, name, type, level, is_default, sort_order) VALUES
('INC001', '销售收款', 'income', 1, 1, 1),
('INC002', '服务收入', 'income', 1, 0, 2),
('INC003', '其他收入', 'income', 1, 0, 3),
('EXP001', '采购付款', 'expense', 1, 1, 1),
('EXP002', '工资薪酬', 'expense', 1, 0, 2),
('EXP003', '办公费用', 'expense', 1, 0, 3),
('EXP004', '差旅费用', 'expense', 1, 0, 4),
('EXP005', '业务招待费', 'expense', 1, 0, 5),
('EXP006', '房租物业', 'expense', 1, 0, 6),
('EXP007', '水电费用', 'expense', 1, 0, 7),
('EXP008', '税费', 'expense', 1, 0, 8),
('EXP009', '其他费用', 'expense', 1, 0, 9);

-- 初始化数据 - 财务报表配置
INSERT INTO finance_report_configs (report_type, name, config) VALUES
('profit_loss', '利润表', '{"period": "monthly", "compare_previous": true}'),
('balance_sheet', '资产负债表', '{"period": "monthly", "compare_previous": true}'),
('cash_flow', '现金流量表', '{"period": "monthly", "compare_previous": true}');
