-- 产品管理模块数据库表
-- 创建时间：2026-03-03

-- 产品分类表
CREATE TABLE IF NOT EXISTS product_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    parent_id INTEGER,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES product_categories(id)
);

-- 产品表
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    brand TEXT,
    model TEXT,
    unit TEXT DEFAULT '件',
    cost_price REAL DEFAULT 0,
    selling_price REAL DEFAULT 0,
    wholesale_price REAL DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'discontinued')),
    images TEXT, -- JSON 格式存储图片 URL 列表
    attributes TEXT, -- JSON 格式存储扩展属性
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (category_id) REFERENCES product_categories(id)
);

-- 产品库存表
CREATE TABLE IF NOT EXISTS product_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    warehouse_id INTEGER,
    quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) VIRTUAL,
    last_stock_check DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (product_id, warehouse_id)
);

-- 库存流水表
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    warehouse_id INTEGER,
    transaction_type TEXT NOT NULL CHECK(transaction_type IN ('in', 'out', 'adjustment', 'transfer', 'return')),
    quantity INTEGER NOT NULL,
    before_quantity INTEGER NOT NULL,
    after_quantity INTEGER NOT NULL,
    reference_type TEXT, -- 关联单据类型 (purchase_order, sales_order, adjustment, etc.)
    reference_id INTEGER, -- 关联单据 ID
    reason TEXT,
    operator_id INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (operator_id) REFERENCES users(id)
);

-- 仓库表
CREATE TABLE IF NOT EXISTS warehouses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    address TEXT,
    manager_id INTEGER,
    phone TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON product_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON product_inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON inventory_transactions(reference_type, reference_id);

-- 初始化数据
INSERT INTO product_categories (name, parent_id, description, sort_order) VALUES 
('电子产品', NULL, '电子设备类产品', 1),
('服装服饰', NULL, '服装和配饰类产品', 2),
('食品饮料', NULL, '食品和饮料类产品', 3),
('手机', 1, '手机设备', 1),
('电脑', 1, '电脑设备', 2),
('男装', 2, '男士服装', 1),
('女装', 2, '女士服装', 2);

INSERT INTO warehouses (name, code, address, status) VALUES 
('主仓库', 'WH-MAIN', '北京市朝阳区主仓库路 1 号', 'active'),
('备用仓库', 'WH-BACKUP', '北京市通州区备用仓库路 2 号', 'active');
