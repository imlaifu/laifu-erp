-- ============================================================
-- 报表管理模块 (Reports Management)
-- 创建时间：2026-03-03
-- 功能：Dashboard 概览、销售报表、库存报表、财务报表、数据导出
-- ============================================================

-- 报表定义表 (存储预定义报表模板)
CREATE TABLE IF NOT EXISTS report_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- 'dashboard', 'sales', 'inventory', 'finance'
    description TEXT,
    sql_template TEXT NOT NULL,
    parameters TEXT, -- JSON 格式定义报表参数
    columns_config TEXT, -- JSON 格式定义列配置
    is_system INTEGER DEFAULT 1, -- 1=系统预定义，0=用户自定义
    is_active INTEGER DEFAULT 1,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 报表执行历史表
CREATE TABLE IF NOT EXISTS report_executions (
    id TEXT PRIMARY KEY,
    report_id TEXT NOT NULL,
    parameters TEXT, -- JSON 格式存储执行时的参数
    result_count INTEGER DEFAULT 0,
    execution_time_ms INTEGER,
    status TEXT DEFAULT 'success', -- 'success', 'failed', 'running'
    error_message TEXT,
    executed_by TEXT,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES report_definitions(id),
    FOREIGN KEY (executed_by) REFERENCES users(id)
);

-- Dashboard  widgets 配置表
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    widget_type TEXT NOT NULL, -- 'chart', 'metric', 'table', 'list'
    widget_key TEXT NOT NULL, -- 唯一标识，如 'sales_today', 'inventory_alert'
    title TEXT NOT NULL,
    config TEXT, -- JSON 格式存储 widget 配置
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 4,
    height INTEGER DEFAULT 2,
    is_visible INTEGER DEFAULT 1,
    refresh_interval INTEGER DEFAULT 300, -- 刷新间隔 (秒)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, widget_key)
);

-- 保存的报表表 (用户保存的自定义报表)
CREATE TABLE IF NOT EXISTS saved_reports (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    report_definition_id TEXT,
    parameters TEXT, -- JSON 格式存储保存的参数
    filters TEXT, -- JSON 格式存储筛选条件
    sort_config TEXT, -- JSON 格式存储排序配置
    is_public INTEGER DEFAULT 0, -- 1=公开给所有用户，0=仅自己可见
    is_favorite INTEGER DEFAULT 0,
    last_executed_at DATETIME,
    execution_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (report_definition_id) REFERENCES report_definitions(id)
);

-- 数据导出历史表
CREATE TABLE IF NOT EXISTS export_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    export_type TEXT NOT NULL, -- 'csv', 'excel', 'pdf', 'json'
    source_type TEXT NOT NULL, -- 'report', 'list', 'detail'
    source_id TEXT,
    file_name TEXT NOT NULL,
    file_path TEXT,
    file_size_bytes INTEGER,
    record_count INTEGER,
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    error_message TEXT,
    expires_at DATETIME,
    downloaded_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 业务统计快照表 (用于快速查询统计信息)
CREATE TABLE IF NOT EXISTS stats_snapshots (
    id TEXT PRIMARY KEY,
    stats_type TEXT NOT NULL, -- 'sales_daily', 'inventory_summary', 'finance_monthly'
    stats_date DATE NOT NULL,
    data TEXT NOT NULL, -- JSON 格式存储统计数据
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stats_type, stats_date)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_report_definitions_category ON report_definitions(category);
CREATE INDEX IF NOT EXISTS idx_report_definitions_active ON report_definitions(is_active);
CREATE INDEX IF NOT EXISTS idx_report_executions_report_id ON report_executions(report_id);
CREATE INDEX IF NOT EXISTS idx_report_executions_executed_at ON report_executions(executed_at);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_user_id ON dashboard_widgets(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_user_id ON saved_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_export_history_user_id ON export_history(user_id);
CREATE INDEX IF NOT EXISTS idx_stats_snapshots_type_date ON stats_snapshots(stats_type, stats_date);

-- 插入系统预定义报表
INSERT OR IGNORE INTO report_definitions (id, name, code, category, description, sql_template, parameters, columns_config, is_system) VALUES
-- Dashboard 报表
('rpt_dash_001', '今日销售概览', 'sales_today', 'dashboard', '显示今日销售订单数、金额、客户数等关键指标', 
 'SELECT COUNT(*) as order_count, COALESCE(SUM(total_amount), 0) as total_amount, COUNT(DISTINCT customer_id) as customer_count FROM orders WHERE DATE(created_at) = DATE("now")',
 '{"time_range": "today"}',
 '[{"key": "order_count", "label": "订单数", "type": "number"}, {"key": "total_amount", "label": "销售金额", "type": "currency"}, {"key": "customer_count", "label": "客户数", "type": "number"}]',
 1),
('rpt_dash_002', '库存预警', 'inventory_alert', 'dashboard', '显示库存低于安全库存的商品',
 'SELECT p.id, p.name, p.sku, i.quantity, i.safety_stock, (i.safety_stock - i.quantity) as shortage FROM products p JOIN inventory i ON p.id = i.product_id WHERE i.quantity < i.safety_stock AND p.status = "active"',
 '{"include_discontinued": false}',
 '[{"key": "sku", "label": "SKU", "type": "text"}, {"key": "name", "label": "商品名称", "type": "text"}, {"key": "quantity", "label": "当前库存", "type": "number"}, {"key": "safety_stock", "label": "安全库存", "type": "number"}, {"key": "shortage", "label": "短缺数量", "type": "number"}]',
 1),
('rpt_dash_003', '待处理订单', 'pending_orders', 'dashboard', '显示所有待处理的订单',
 'SELECT id, order_no, customer_id, total_amount, status, created_at FROM orders WHERE status IN ("pending", "confirmed") ORDER BY created_at DESC LIMIT 20',
 '{"limit": 20}',
 '[{"key": "order_no", "label": "订单号", "type": "text"}, {"key": "customer_id", "label": "客户", "type": "text"}, {"key": "total_amount", "label": "金额", "type": "currency"}, {"key": "status", "label": "状态", "type": "text"}, {"key": "created_at", "label": "创建时间", "type": "datetime"}]',
 1),
('rpt_dash_004', '本月收支概览', 'finance_monthly', 'dashboard', '显示本月收入和支出汇总',
 'SELECT SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income, SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expense, SUM(CASE WHEN type = "income" THEN amount ELSE -amount END) as profit FROM finance_records WHERE DATE(created_at) >= DATE("now", "start of month")',
 '{}',
 '[{"key": "income", "label": "收入", "type": "currency"}, {"key": "expense", "label": "支出", "type": "currency"}, {"key": "profit", "label": "利润", "type": "currency"}]',
 1),

-- 销售报表
('rpt_sales_001', '销售订单明细', 'sales_order_detail', 'sales', '销售订单详细列表',
 'SELECT o.id, o.order_no, o.customer_id, c.name as customer_name, o.total_amount, o.status, o.created_at FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE 1=1 ORDER BY o.created_at DESC',
 '{"start_date": "", "end_date": "", "status": "", "customer_id": ""}',
 '[{"key": "order_no", "label": "订单号", "type": "text"}, {"key": "customer_name", "label": "客户名称", "type": "text"}, {"key": "total_amount", "label": "金额", "type": "currency"}, {"key": "status", "label": "状态", "type": "text"}, {"key": "created_at", "label": "日期", "type": "datetime"}]',
 1),
('rpt_sales_002', '销售统计 (按商品)', 'sales_by_product', 'sales', '按商品统计销售数量和金额',
 'SELECT p.id, p.name, p.sku, SUM(oi.quantity) as total_qty, SUM(oi.quantity * oi.unit_price) as total_amount FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE o.status != "cancelled" GROUP BY p.id ORDER BY total_amount DESC',
 '{"start_date": "", "end_date": ""}',
 '[{"key": "sku", "label": "SKU", "type": "text"}, {"key": "name", "label": "商品名称", "type": "text"}, {"key": "total_qty", "label": "销售数量", "type": "number"}, {"key": "total_amount", "label": "销售金额", "type": "currency"}]',
 1),
('rpt_sales_003', '销售统计 (按客户)', 'sales_by_customer', 'sales', '按客户统计销售金额',
 'SELECT c.id, c.name, c.code, COUNT(o.id) as order_count, SUM(o.total_amount) as total_amount FROM customers c LEFT JOIN orders o ON c.id = o.customer_id AND o.status != "cancelled" GROUP BY c.id ORDER BY total_amount DESC',
 '{"start_date": "", "end_date": ""}',
 '[{"key": "code", "label": "客户编码", "type": "text"}, {"key": "name", "label": "客户名称", "type": "text"}, {"key": "order_count", "label": "订单数", "type": "number"}, {"key": "total_amount", "label": "销售金额", "type": "currency"}]',
 1),

-- 库存报表
('rpt_inv_001', '库存明细表', 'inventory_detail', 'inventory', '所有商品的当前库存明细',
 'SELECT p.id, p.sku, p.name, p.category_id, i.quantity, i.safety_stock, i.max_stock, w.name as warehouse_name FROM products p JOIN inventory i ON p.id = i.product_id JOIN warehouses w ON i.warehouse_id = w.id WHERE p.status = "active"',
 '{"warehouse_id": "", "category_id": ""}',
 '[{"key": "sku", "label": "SKU", "type": "text"}, {"key": "name", "label": "商品名称", "type": "text"}, {"key": "quantity", "label": "库存数量", "type": "number"}, {"key": "safety_stock", "label": "安全库存", "type": "number"}, {"key": "warehouse_name", "label": "仓库", "type": "text"}]',
 1),
('rpt_inv_002', '库存流水账', 'inventory_transactions', 'inventory', '库存出入库流水记录',
 'SELECT it.id, it.transaction_type, it.product_id, p.name as product_name, it.quantity, it.balance_after, it.reference_type, it.reference_id, it.created_at, u.display_name as operator FROM inventory_transactions it JOIN products p ON it.product_id = p.id LEFT JOIN users u ON it.created_by = u.id ORDER BY it.created_at DESC',
 '{"start_date": "", "end_date": "", "product_id": "", "transaction_type": ""}',
 '[{"key": "transaction_type", "label": "类型", "type": "text"}, {"key": "product_name", "label": "商品", "type": "text"}, {"key": "quantity", "label": "数量", "type": "number"}, {"key": "balance_after", "label": "结存", "type": "number"}, {"key": "created_at", "label": "时间", "type": "datetime"}, {"key": "operator", "label": "操作人", "type": "text"}]',
 1),

-- 财务报表
('rpt_fin_001', '收支明细表', 'finance_transactions', 'finance', '所有财务收支记录',
 'SELECT fr.id, fr.type, fr.amount, fr.category_id, fc.name as category_name, fr.description, fr.related_type, fr.related_id, fr.created_at, u.display_name as operator FROM finance_records fr LEFT JOIN finance_categories fc ON fr.category_id = fc.id LEFT JOIN users u ON fr.created_by = u.id ORDER BY fr.created_at DESC',
 '{"start_date": "", "end_date": "", "type": "", "category_id": ""}',
 '[{"key": "type", "label": "类型", "type": "text"}, {"key": "amount", "label": "金额", "type": "currency"}, {"key": "category_name", "label": "分类", "type": "text"}, {"key": "description", "label": "说明", "type": "text"}, {"key": "created_at", "label": "日期", "type": "datetime"}, {"key": "operator", "label": "操作人", "type": "text"}]',
 1),
('rpt_fin_002', '利润表', 'finance_profit_loss', 'finance', '收入支出对比利润表',
 'SELECT DATE(created_at) as date, SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income, SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expense, SUM(CASE WHEN type = "income" THEN amount ELSE -amount END) as profit FROM finance_records GROUP BY DATE(created_at) ORDER BY date DESC',
 '{"start_date": "", "end_date": ""}',
 '[{"key": "date", "label": "日期", "type": "date"}, {"key": "income", "label": "收入", "type": "currency"}, {"key": "expense", "label": "支出", "type": "currency"}, {"key": "profit", "label": "利润", "type": "currency"}]',
 1);

-- 初始化默认 Dashboard widgets (给用户 ID 为 'system' 的默认配置)
INSERT OR IGNORE INTO dashboard_widgets (id, user_id, widget_type, widget_key, title, config, position_x, position_y, width, height, is_visible) VALUES
('wid_001', 'system', 'metric', 'sales_today', '今日销售', '{"report_code": "sales_today", "show_trend": true}', 0, 0, 3, 2, 1),
('wid_002', 'system', 'metric', 'pending_orders', '待处理订单', '{"report_code": "pending_orders", "show_count": true}', 3, 0, 3, 2, 1),
('wid_003', 'metric', 'inventory_alert', '库存预警', '{"report_code": "inventory_alert", "show_critical": true}', 6, 0, 3, 2, 1),
('wid_004', 'system', 'metric', 'finance_monthly', '本月收支', '{"report_code": "finance_monthly", "show_profit": true}', 9, 0, 3, 2, 1),
('wid_005', 'system', 'chart', 'sales_trend', '销售趋势', '{"report_code": "sales_by_product", "chart_type": "line", "period": "7days"}', 0, 2, 6, 4, 1),
('wid_006', 'system', 'table', 'top_products', '热销商品', '{"report_code": "sales_by_product", "limit": 10}', 6, 2, 6, 4, 1);
