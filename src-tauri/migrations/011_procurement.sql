-- 采购管理模块数据库表
-- 创建时间：2026-03-03

-- 采购申请单表
CREATE TABLE IF NOT EXISTS procurement_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_no TEXT NOT NULL UNIQUE,
    applicant_id INTEGER,
    department TEXT,
    priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'converted')),
    total_amount REAL DEFAULT 0,
    notes TEXT,
    approved_by INTEGER,
    approved_at DATETIME,
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- 采购申请明细表
CREATE TABLE IF NOT EXISTS procurement_request_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    quantity INTEGER NOT NULL,
    unit TEXT DEFAULT '件',
    estimated_price REAL DEFAULT 0,
    total_amount REAL GENERATED ALWAYS AS (quantity * estimated_price) VIRTUAL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES procurement_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 采购订单表
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no TEXT NOT NULL UNIQUE,
    supplier_id INTEGER NOT NULL,
    request_id INTEGER,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'submitted', 'confirmed', 'partially_received', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid', 'partially_paid', 'paid')),
    payment_terms TEXT,
    currency TEXT DEFAULT 'CNY',
    subtotal REAL DEFAULT 0,
    tax_rate REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    shipping_cost REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    notes TEXT,
    attachment_urls TEXT, -- JSON 格式存储附件 URL 列表
    created_by INTEGER,
    confirmed_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (request_id) REFERENCES procurement_requests(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 采购订单明细表
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    product_sku TEXT,
    quantity INTEGER NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    unit TEXT DEFAULT '件',
    unit_price REAL NOT NULL,
    total_amount REAL GENERATED ALWAYS AS (quantity * unit_price) VIRTUAL,
    tax_rate REAL DEFAULT 0,
    discount_rate REAL DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 采购合同表
CREATE TABLE IF NOT EXISTS purchase_contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_no TEXT NOT NULL UNIQUE,
    order_id INTEGER,
    supplier_id INTEGER NOT NULL,
    contract_type TEXT DEFAULT 'standard' CHECK(contract_type IN ('standard', 'framework', 'annual')),
    title TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    total_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'pending_review', 'active', 'expired', 'terminated')),
    terms TEXT, -- 合同条款
    attachment_urls TEXT, -- JSON 格式存储附件 URL 列表
    signed_by_supplier TEXT,
    signed_by_company TEXT,
    signed_at DATETIME,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES purchase_orders(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 入库验收单表
CREATE TABLE IF NOT EXISTS receiving_inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspection_no TEXT NOT NULL UNIQUE,
    order_id INTEGER NOT NULL,
    warehouse_id INTEGER,
    inspection_date DATE NOT NULL,
    inspector_id INTEGER,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'partial', 'completed', 'rejected')),
    quality_status TEXT DEFAULT 'pending' CHECK(quality_status IN ('pending', 'passed', 'conditional', 'failed')),
    notes TEXT,
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES purchase_orders(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (inspector_id) REFERENCES users(id)
);

-- 入库验收明细表
CREATE TABLE IF NOT EXISTS receiving_inspection_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspection_id INTEGER NOT NULL,
    order_item_id INTEGER NOT NULL,
    product_id INTEGER,
    expected_quantity INTEGER NOT NULL,
    received_quantity INTEGER NOT NULL,
    qualified_quantity INTEGER DEFAULT 0,
    rejected_quantity INTEGER DEFAULT 0,
    unit_price REAL,
    subtotal REAL GENERATED ALWAYS AS (qualified_quantity * unit_price) VIRTUAL,
    quality_notes TEXT,
    warehouse_location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inspection_id) REFERENCES receiving_inspections(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES purchase_order_items(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 供应商比价表
CREATE TABLE IF NOT EXISTS supplier_comparisons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comparison_no TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'completed', 'archived')),
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 供应商比价明细表
CREATE TABLE IF NOT EXISTS supplier_comparison_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comparison_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    total_amount REAL GENERATED ALWAYS AS (quantity * unit_price) VIRTUAL,
    delivery_days INTEGER,
    payment_terms TEXT,
    quality_rating INTEGER CHECK(quality_rating >= 1 AND quality_rating <= 5),
    service_rating INTEGER CHECK(service_rating >= 1 AND service_rating <= 5),
    notes TEXT,
    is_selected INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comparison_id) REFERENCES supplier_comparisons(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- 采购统计表 (视图)
CREATE VIEW IF NOT EXISTS procurement_stats AS
SELECT 
    strftime('%Y-%m', created_at) as month,
    COUNT(DISTINCT id) as order_count,
    SUM(total_amount) as total_amount,
    SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as completed_amount,
    SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as paid_amount
FROM purchase_orders
GROUP BY strftime('%Y-%m', created_at);

-- 索引
CREATE INDEX IF NOT EXISTS idx_procurement_requests_status ON procurement_requests(status);
CREATE INDEX IF NOT EXISTS idx_procurement_requests_applicant ON procurement_requests(applicant_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_date ON purchase_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_order ON purchase_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_purchase_contracts_supplier ON purchase_contracts(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_contracts_status ON purchase_contracts(status);
CREATE INDEX IF NOT EXISTS idx_receiving_inspections_order ON receiving_inspections(order_id);
CREATE INDEX IF NOT EXISTS idx_receiving_inspections_status ON receiving_inspections(status);
CREATE INDEX IF NOT EXISTS idx_supplier_comparisons_product ON supplier_comparisons(product_id);

-- 初始化数据 - 采购申请单号前缀
INSERT OR IGNORE INTO settings (key, value, description) VALUES 
('procurement.request_no_prefix', 'PR', '采购申请单号前缀'),
('procurement.order_no_prefix', 'PO', '采购订单号前缀'),
('procurement.contract_no_prefix', 'PC', '采购合同号前缀'),
('procurement.inspection_no_prefix', 'RI', '入库验收单号前缀');
