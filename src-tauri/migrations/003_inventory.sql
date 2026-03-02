-- 库存管理模块数据库表
-- 创建时间：2026-03-03
-- 说明：此模块专注于库存管理功能，复用产品模块的库存相关表

-- 库存预警配置表
CREATE TABLE IF NOT EXISTS inventory_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    warehouse_id INTEGER,
    min_quantity INTEGER DEFAULT 0,
    max_quantity INTEGER DEFAULT 0,
    alert_enabled INTEGER DEFAULT 1,
    last_alert_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    UNIQUE (product_id, warehouse_id)
);

-- 库存盘点表
CREATE TABLE IF NOT EXISTS inventory_counts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    warehouse_id INTEGER,
    count_date DATETIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    operator_id INTEGER,
    total_items INTEGER DEFAULT 0,
    counted_items INTEGER DEFAULT 0,
    discrepancy_count INTEGER DEFAULT 0,
    notes TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (operator_id) REFERENCES users(id)
);

-- 库存盘点明细表
CREATE TABLE IF NOT EXISTS inventory_count_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    warehouse_id INTEGER,
    system_quantity INTEGER NOT NULL,
    counted_quantity INTEGER,
    discrepancy INTEGER GENERATED ALWAYS AS (counted_quantity - system_quantity) VIRTUAL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'counted', 'verified', 'adjusted')),
    notes TEXT,
    counted_at DATETIME,
    verified_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (count_id) REFERENCES inventory_counts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

-- 库存调拨表
CREATE TABLE IF NOT EXISTS inventory_transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transfer_no TEXT NOT NULL UNIQUE,
    from_warehouse_id INTEGER NOT NULL,
    to_warehouse_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_transit', 'completed', 'cancelled')),
    operator_id INTEGER,
    total_items INTEGER DEFAULT 0,
    shipped_at DATETIME,
    received_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (to_warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (operator_id) REFERENCES users(id)
);

-- 库存调拨明细表
CREATE TABLE IF NOT EXISTS inventory_transfer_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transfer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    shipped_quantity INTEGER,
    received_quantity INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transfer_id) REFERENCES inventory_transfers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_alerts_product ON inventory_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_warehouse ON inventory_alerts(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_counts_warehouse ON inventory_counts(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_counts_status ON inventory_counts(status);
CREATE INDEX IF NOT EXISTS idx_count_items_count ON inventory_count_items(count_id);
CREATE INDEX IF NOT EXISTS idx_count_items_product ON inventory_count_items(product_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON inventory_transfers(status);
CREATE INDEX IF NOT EXISTS idx_transfers_from ON inventory_transfers(from_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to ON inventory_transfers(to_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_transfer_items_transfer ON inventory_transfer_items(transfer_id);
