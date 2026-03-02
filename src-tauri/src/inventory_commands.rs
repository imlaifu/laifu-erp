// 库存管理模块 Rust Commands
// 实现完整的 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

// ==================== 库存预警 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InventoryAlert {
    pub id: i64,
    pub product_id: i64,
    pub warehouse_id: Option<i64>,
    pub min_quantity: i64,
    pub max_quantity: i64,
    pub alert_enabled: bool,
    pub last_alert_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InventoryAlertInput {
    pub product_id: i64,
    pub warehouse_id: Option<i64>,
    pub min_quantity: Option<i64>,
    pub max_quantity: Option<i64>,
    pub alert_enabled: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InventoryAlertWithProduct {
    pub id: i64,
    pub product_id: i64,
    pub product_name: String,
    pub product_sku: String,
    pub warehouse_id: Option<i64>,
    pub warehouse_name: Option<String>,
    pub min_quantity: i64,
    pub max_quantity: i64,
    pub current_quantity: i64,
    pub alert_enabled: bool,
    pub alert_status: String, // "low", "high", "normal"
    pub last_alert_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// ==================== 库存盘点 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InventoryCount {
    pub id: i64,
    pub warehouse_id: Option<i64>,
    pub count_date: DateTime<Utc>,
    pub status: String,
    pub operator_id: Option<i64>,
    pub total_items: i64,
    pub counted_items: i64,
    pub discrepancy_count: i64,
    pub notes: Option<String>,
    pub completed_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InventoryCountInput {
    pub warehouse_id: Option<i64>,
    pub count_date: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InventoryCountItem {
    pub id: i64,
    pub count_id: i64,
    pub product_id: i64,
    pub warehouse_id: Option<i64>,
    pub system_quantity: i64,
    pub counted_quantity: Option<i64>,
    pub discrepancy: Option<i64>,
    pub status: String,
    pub notes: Option<String>,
    pub counted_at: Option<DateTime<Utc>>,
    pub verified_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InventoryCountItemInput {
    pub count_id: i64,
    pub product_id: i64,
    pub warehouse_id: Option<i64>,
    pub counted_quantity: i64,
    pub notes: Option<String>,
}

// ==================== 库存调拨 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InventoryTransfer {
    pub id: i64,
    pub transfer_no: String,
    pub from_warehouse_id: i64,
    pub to_warehouse_id: i64,
    pub from_warehouse_name: String,
    pub to_warehouse_name: String,
    pub status: String,
    pub operator_id: Option<i64>,
    pub total_items: i64,
    pub shipped_at: Option<DateTime<Utc>>,
    pub received_at: Option<DateTime<Utc>>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InventoryTransferInput {
    pub from_warehouse_id: i64,
    pub to_warehouse_id: i64,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InventoryTransferItem {
    pub id: i64,
    pub transfer_id: i64,
    pub product_id: i64,
    pub product_name: String,
    pub product_sku: String,
    pub quantity: i64,
    pub shipped_quantity: Option<i64>,
    pub received_quantity: Option<i64>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InventoryTransferItemInput {
    pub transfer_id: i64,
    pub product_id: i64,
    pub quantity: i64,
    pub notes: Option<String>,
}

// ==================== 库存统计 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InventorySummary {
    pub warehouse_id: Option<i64>,
    pub warehouse_name: Option<String>,
    pub total_products: i64,
    pub total_quantity: i64,
    pub total_value: f64,
    pub low_stock_count: i64,
    pub out_of_stock_count: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LowStockProduct {
    pub product_id: i64,
    pub product_name: String,
    pub product_sku: String,
    pub warehouse_id: Option<i64>,
    pub warehouse_name: Option<String>,
    pub current_quantity: i64,
    pub min_quantity: i64,
    pub alert_threshold: i64,
}

// ==================== 库存预警 CRUD ====================

pub fn create_inventory_alert(conn: &Connection, input: InventoryAlertInput) -> Result<InventoryAlert> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO inventory_alerts (product_id, warehouse_id, min_quantity, max_quantity, alert_enabled, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)",
        params![
            input.product_id,
            input.warehouse_id,
            input.min_quantity.unwrap_or(0),
            input.max_quantity.unwrap_or(0),
            if input.alert_enabled.unwrap_or(true) { 1 } else { 0 },
            now.to_rfc3339(),
        ],
    )?;
    
    let alert_id = conn.last_insert_rowid();
    get_inventory_alert(conn, alert_id)
}

pub fn get_inventory_alert(conn: &Connection, id: i64) -> Result<InventoryAlert> {
    let mut stmt = conn.prepare("SELECT id, product_id, warehouse_id, min_quantity, max_quantity, alert_enabled, last_alert_at, created_at, updated_at FROM inventory_alerts WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(InventoryAlert {
            id: row.get(0)?,
            product_id: row.get(1)?,
            warehouse_id: row.get(2)?,
            min_quantity: row.get(3)?,
            max_quantity: row.get(4)?,
            alert_enabled: row.get::<_, i64>(5)? == 1,
            last_alert_at: row.get::<_, Option<String>>(6)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_inventory_alerts(conn: &Connection, warehouse_id: Option<i64>, alert_status: Option<String>) -> Result<Vec<InventoryAlertWithProduct>> {
    let mut where_clauses = vec!["a.alert_enabled = 1".to_string()];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(wid) = warehouse_id {
        where_clauses.push("(a.warehouse_id = ? OR a.warehouse_id IS NULL)".to_string());
        sql_params.push(Box::new(wid));
    }
    
    let where_clause = if where_clauses.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_clauses.join(" AND "))
    };
    
    sql_params.push(Box::new(warehouse_id.unwrap_or(0)));
    
    let query = format!(
        r#"SELECT a.id, a.product_id, p.name, p.sku, a.warehouse_id, w.name, a.min_quantity, a.max_quantity,
                  COALESCE(i.quantity, 0), a.alert_enabled, a.last_alert_at, a.created_at, a.updated_at
           FROM inventory_alerts a
           JOIN products p ON a.product_id = p.id
           LEFT JOIN warehouses w ON a.warehouse_id = w.id
           LEFT JOIN product_inventory i ON a.product_id = i.product_id AND (a.warehouse_id = i.warehouse_id OR (a.warehouse_id IS NULL AND i.warehouse_id IS NULL))
           {}
           ORDER BY a.updated_at DESC"#,
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    let alerts = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        let current_qty: i64 = row.get(8)?;
        let min_qty: i64 = row.get(6)?;
        let max_qty: i64 = row.get(7)?;
        
        let alert_status = if current_qty == 0 {
            "out_of_stock".to_string()
        } else if current_qty <= min_qty {
            "low".to_string()
        } else if max_qty > 0 && current_qty >= max_qty {
            "high".to_string()
        } else {
            "normal".to_string()
        };
        
        Ok(InventoryAlertWithProduct {
            id: row.get(0)?,
            product_id: row.get(1)?,
            product_name: row.get(2)?,
            product_sku: row.get(3)?,
            warehouse_id: row.get(4)?,
            warehouse_name: row.get(5)?,
            min_quantity: min_qty,
            max_quantity: max_qty,
            current_quantity: current_qty,
            alert_enabled: row.get::<_, i64>(9)? == 1,
            alert_status,
            last_alert_at: row.get::<_, Option<String>>(10)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    let mut result: Vec<InventoryAlertWithProduct> = alerts.filter_map(|r| r.ok()).collect();
    
    // 过滤 alert_status
    if let Some(status) = alert_status {
        result.retain(|a| a.alert_status == status);
    }
    
    Ok(result)
}

pub fn update_inventory_alert(conn: &Connection, id: i64, input: InventoryAlertInput) -> Result<InventoryAlert> {
    let now = Utc::now();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(min) = input.min_quantity {
        updates.push("min_quantity = ?");
        sql_params.push(Box::new(min));
    }
    if let Some(max) = input.max_quantity {
        updates.push("max_quantity = ?");
        sql_params.push(Box::new(max));
    }
    if let Some(enabled) = input.alert_enabled {
        updates.push("alert_enabled = ?");
        sql_params.push(Box::new(if enabled { 1 } else { 0 }));
    }
    
    if updates.is_empty() {
        return get_inventory_alert(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now.to_rfc3339()));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE inventory_alerts SET {} WHERE id = ?", updates.join(", "));
    
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_inventory_alert(conn, id)
}

pub fn delete_inventory_alert(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM inventory_alerts WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 库存盘点 CRUD ====================

pub fn create_inventory_count(conn: &Connection, input: InventoryCountInput) -> Result<InventoryCount> {
    let now = Utc::now();
    let count_date = input.count_date
        .and_then(|s| DateTime::parse_from_rfc3339(&s).ok())
        .map(|d| d.with_timezone(&Utc))
        .unwrap_or(now);
    
    conn.execute(
        "INSERT INTO inventory_counts (warehouse_id, count_date, status, total_items, counted_items, discrepancy_count, notes, created_at, updated_at) 
         VALUES (?1, ?2, 'pending', 0, 0, 0, ?3, ?4, ?4)",
        params![input.warehouse_id, count_date.to_rfc3339(), input.notes, now.to_rfc3339()],
    )?;
    
    let count_id = conn.last_insert_rowid();
    get_inventory_count(conn, count_id)
}

pub fn get_inventory_count(conn: &Connection, id: i64) -> Result<InventoryCount> {
    let mut stmt = conn.prepare("SELECT id, warehouse_id, count_date, status, operator_id, total_items, counted_items, discrepancy_count, notes, completed_at, created_at, updated_at FROM inventory_counts WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(InventoryCount {
            id: row.get(0)?,
            warehouse_id: row.get(1)?,
            count_date: DateTime::parse_from_rfc3339(&row.get::<_, String>(2)?).unwrap().with_timezone(&Utc),
            status: row.get(3)?,
            operator_id: row.get(4)?,
            total_items: row.get(5)?,
            counted_items: row.get(6)?,
            discrepancy_count: row.get(7)?,
            notes: row.get(8)?,
            completed_at: row.get::<_, Option<String>>(9)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_inventory_counts(conn: &Connection, warehouse_id: Option<i64>, status: Option<String>) -> Result<Vec<InventoryCount>> {
    let mut where_clauses = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(wid) = warehouse_id {
        where_clauses.push("warehouse_id = ?".to_string());
        sql_params.push(Box::new(wid));
    }
    if let Some(s) = status {
        where_clauses.push("status = ?".to_string());
        sql_params.push(Box::new(s));
    }
    
    let where_clause = if where_clauses.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_clauses.join(" AND "))
    };
    
    let query = format!(
        "SELECT id, warehouse_id, count_date, status, operator_id, total_items, counted_items, discrepancy_count, notes, completed_at, created_at, updated_at 
         FROM inventory_counts {} ORDER BY count_date DESC",
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    let counts = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(InventoryCount {
            id: row.get(0)?,
            warehouse_id: row.get(1)?,
            count_date: DateTime::parse_from_rfc3339(&row.get::<_, String>(2)?).unwrap().with_timezone(&Utc),
            status: row.get(3)?,
            operator_id: row.get(4)?,
            total_items: row.get(5)?,
            counted_items: row.get(6)?,
            discrepancy_count: row.get(7)?,
            notes: row.get(8)?,
            completed_at: row.get::<_, Option<String>>(9)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    counts.collect()
}

pub fn update_inventory_count_status(conn: &Connection, id: i64, status: String, operator_id: Option<i64>) -> Result<InventoryCount> {
    let now = Utc::now();
    let completed_at = if status == "completed" { Some(now.to_rfc3339()) } else { None };
    
    conn.execute(
        "UPDATE inventory_counts SET status = ?, operator_id = ?, completed_at = ?, updated_at = ? WHERE id = ?",
        params![status, operator_id, completed_at, now.to_rfc3339(), id],
    )?;
    
    get_inventory_count(conn, id)
}

pub fn delete_inventory_count(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM inventory_counts WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 库存盘点明细 CRUD ====================

pub fn create_inventory_count_item(conn: &Connection, input: InventoryCountItemInput) -> Result<InventoryCountItem> {
    let now = Utc::now();
    
    // 获取系统库存
    let system_qty: i64 = conn.query_row(
        "SELECT COALESCE(quantity, 0) FROM product_inventory WHERE product_id = ?1 AND (warehouse_id = ?2 OR (warehouse_id IS NULL AND ?2 IS NULL))",
        params![input.product_id, input.warehouse_id],
        |row| row.get(0),
    ).unwrap_or(0);
    
    conn.execute(
        "INSERT INTO inventory_count_items (count_id, product_id, warehouse_id, system_quantity, counted_quantity, status, counted_at, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, 'counted', ?6, ?6, ?6)",
        params![input.count_id, input.product_id, input.warehouse_id, system_qty, input.counted_quantity, now.to_rfc3339()],
    )?;
    
    let item_id = conn.last_insert_rowid();
    get_inventory_count_item(conn, item_id)
}

pub fn get_inventory_count_item(conn: &Connection, id: i64) -> Result<InventoryCountItem> {
    let mut stmt = conn.prepare("SELECT id, count_id, product_id, warehouse_id, system_quantity, counted_quantity, discrepancy, status, notes, counted_at, verified_at, created_at, updated_at FROM inventory_count_items WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(InventoryCountItem {
            id: row.get(0)?,
            count_id: row.get(1)?,
            product_id: row.get(2)?,
            warehouse_id: row.get(3)?,
            system_quantity: row.get(4)?,
            counted_quantity: row.get(5)?,
            discrepancy: row.get(6)?,
            status: row.get(7)?,
            notes: row.get(8)?,
            counted_at: row.get::<_, Option<String>>(9)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            verified_at: row.get::<_, Option<String>>(10)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_inventory_count_items(conn: &Connection, count_id: i64) -> Result<Vec<InventoryCountItem>> {
    let mut stmt = conn.prepare("SELECT id, count_id, product_id, warehouse_id, system_quantity, counted_quantity, discrepancy, status, notes, counted_at, verified_at, created_at, updated_at FROM inventory_count_items WHERE count_id = ?1 ORDER BY product_id")?;
    
    let items = stmt.query_map(params![count_id], |row| {
        Ok(InventoryCountItem {
            id: row.get(0)?,
            count_id: row.get(1)?,
            product_id: row.get(2)?,
            warehouse_id: row.get(3)?,
            system_quantity: row.get(4)?,
            counted_quantity: row.get(5)?,
            discrepancy: row.get(6)?,
            status: row.get(7)?,
            notes: row.get(8)?,
            counted_at: row.get::<_, Option<String>>(9)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            verified_at: row.get::<_, Option<String>>(10)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    items.collect()
}

pub fn update_inventory_count_item_status(conn: &Connection, id: i64, status: String) -> Result<InventoryCountItem> {
    let now = Utc::now();
    let verified_at = if status == "verified" { Some(now.to_rfc3339()) } else { None };
    
    conn.execute(
        "UPDATE inventory_count_items SET status = ?, verified_at = ?, updated_at = ? WHERE id = ?",
        params![status, verified_at, now.to_rfc3339(), id],
    )?;
    
    get_inventory_count_item(conn, id)
}

// ==================== 库存调拨 CRUD ====================

fn generate_transfer_no(conn: &Connection) -> Result<String> {
    let now = Utc::now();
    let date_str = now.format("%Y%m%d").to_string();
    
    let count: i64 = conn.query_row(
        "SELECT COUNT(*) FROM inventory_transfers WHERE transfer_no LIKE ?",
        params![format!("TRF-{}%", date_str)],
        |row| row.get(0),
    )?;
    
    Ok(format!("TRF-{}-{:04}", date_str, count + 1))
}

pub fn create_inventory_transfer(conn: &Connection, input: InventoryTransferInput) -> Result<InventoryTransfer> {
    let now = Utc::now();
    let transfer_no = generate_transfer_no(conn)?;
    
    conn.execute(
        "INSERT INTO inventory_transfers (transfer_no, from_warehouse_id, to_warehouse_id, status, total_items, created_at, updated_at) 
         VALUES (?1, ?2, ?3, 'pending', 0, ?4, ?4)",
        params![transfer_no, input.from_warehouse_id, input.to_warehouse_id, now.to_rfc3339()],
    )?;
    
    let transfer_id = conn.last_insert_rowid();
    get_inventory_transfer(conn, transfer_id)
}

pub fn get_inventory_transfer(conn: &Connection, id: i64) -> Result<InventoryTransfer> {
    let mut stmt = conn.prepare(
        r#"SELECT t.id, t.transfer_no, t.from_warehouse_id, t.to_warehouse_id, 
                  wf.name, wt.name, t.status, t.operator_id, t.total_items, 
                  t.shipped_at, t.received_at, t.notes, t.created_at, t.updated_at 
           FROM inventory_transfers t
           JOIN warehouses wf ON t.from_warehouse_id = wf.id
           JOIN warehouses wt ON t.to_warehouse_id = wt.id
           WHERE t.id = ?1"#
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(InventoryTransfer {
            id: row.get(0)?,
            transfer_no: row.get(1)?,
            from_warehouse_id: row.get(2)?,
            to_warehouse_id: row.get(3)?,
            from_warehouse_name: row.get(4)?,
            to_warehouse_name: row.get(5)?,
            status: row.get(6)?,
            operator_id: row.get(7)?,
            total_items: row.get(8)?,
            shipped_at: row.get::<_, Option<String>>(9)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            received_at: row.get::<_, Option<String>>(10)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            notes: row.get(11)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_inventory_transfers(conn: &Connection, from_warehouse_id: Option<i64>, to_warehouse_id: Option<i64>, status: Option<String>) -> Result<Vec<InventoryTransfer>> {
    let mut where_clauses = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(wid) = from_warehouse_id {
        where_clauses.push("t.from_warehouse_id = ?".to_string());
        sql_params.push(Box::new(wid));
    }
    if let Some(wid) = to_warehouse_id {
        where_clauses.push("t.to_warehouse_id = ?".to_string());
        sql_params.push(Box::new(wid));
    }
    if let Some(s) = status {
        where_clauses.push("t.status = ?".to_string());
        sql_params.push(Box::new(s));
    }
    
    let where_clause = if where_clauses.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_clauses.join(" AND "))
    };
    
    let query = format!(
        r#"SELECT t.id, t.transfer_no, t.from_warehouse_id, t.to_warehouse_id, 
                  wf.name, wt.name, t.status, t.operator_id, t.total_items, 
                  t.shipped_at, t.received_at, t.notes, t.created_at, t.updated_at 
           FROM inventory_transfers t
           JOIN warehouses wf ON t.from_warehouse_id = wf.id
           JOIN warehouses wt ON t.to_warehouse_id = wt.id
           {} ORDER BY t.created_at DESC"#,
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    let transfers = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(InventoryTransfer {
            id: row.get(0)?,
            transfer_no: row.get(1)?,
            from_warehouse_id: row.get(2)?,
            to_warehouse_id: row.get(3)?,
            from_warehouse_name: row.get(4)?,
            to_warehouse_name: row.get(5)?,
            status: row.get(6)?,
            operator_id: row.get(7)?,
            total_items: row.get(8)?,
            shipped_at: row.get::<_, Option<String>>(9)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            received_at: row.get::<_, Option<String>>(10)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            notes: row.get(11)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    transfers.collect()
}

pub fn update_inventory_transfer_status(conn: &Connection, id: i64, status: String, operator_id: Option<i64>) -> Result<InventoryTransfer> {
    let now = Utc::now();
    let shipped_at = if status == "in_transit" { Some(now.to_rfc3339()) } else { None };
    let received_at = if status == "completed" { Some(now.to_rfc3339()) } else { None };
    
    conn.execute(
        "UPDATE inventory_transfers SET status = ?, operator_id = ?, shipped_at = ?, received_at = ?, updated_at = ? WHERE id = ?",
        params![status, operator_id, shipped_at, received_at, now.to_rfc3339(), id],
    )?;
    
    get_inventory_transfer(conn, id)
}

pub fn delete_inventory_transfer(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM inventory_transfers WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 库存调拨明细 CRUD ====================

pub fn create_inventory_transfer_item(conn: &Connection, input: InventoryTransferItemInput) -> Result<InventoryTransferItem> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO inventory_transfer_items (transfer_id, product_id, quantity, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?4)",
        params![input.transfer_id, input.product_id, input.quantity, now.to_rfc3339()],
    )?;
    
    let item_id = conn.last_insert_rowid();
    get_inventory_transfer_item(conn, item_id)
}

pub fn get_inventory_transfer_item(conn: &Connection, id: i64) -> Result<InventoryTransferItem> {
    let mut stmt = conn.prepare(
        r#"SELECT i.id, i.transfer_id, i.product_id, p.name, p.sku, 
                  i.quantity, i.shipped_quantity, i.received_quantity, i.notes, i.created_at, i.updated_at 
           FROM inventory_transfer_items i
           JOIN products p ON i.product_id = p.id
           WHERE i.id = ?1"#
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(InventoryTransferItem {
            id: row.get(0)?,
            transfer_id: row.get(1)?,
            product_id: row.get(2)?,
            product_name: row.get(3)?,
            product_sku: row.get(4)?,
            quantity: row.get(5)?,
            shipped_quantity: row.get(6)?,
            received_quantity: row.get(7)?,
            notes: row.get(8)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_inventory_transfer_items(conn: &Connection, transfer_id: i64) -> Result<Vec<InventoryTransferItem>> {
    let mut stmt = conn.prepare(
        r#"SELECT i.id, i.transfer_id, i.product_id, p.name, p.sku, 
                  i.quantity, i.shipped_quantity, i.received_quantity, i.notes, i.created_at, i.updated_at 
           FROM inventory_transfer_items i
           JOIN products p ON i.product_id = p.id
           WHERE i.transfer_id = ?1 ORDER BY p.name"#
    )?;
    
    let items = stmt.query_map(params![transfer_id], |row| {
        Ok(InventoryTransferItem {
            id: row.get(0)?,
            transfer_id: row.get(1)?,
            product_id: row.get(2)?,
            product_name: row.get(3)?,
            product_sku: row.get(4)?,
            quantity: row.get(5)?,
            shipped_quantity: row.get(6)?,
            received_quantity: row.get(7)?,
            notes: row.get(8)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    items.collect()
}

// ==================== 库存统计 ====================

pub fn get_inventory_summary(conn: &Connection, warehouse_id: Option<i64>) -> Result<InventorySummary> {
    let query = if warehouse_id.is_some() {
        r#"SELECT w.id, w.name, 
                  COUNT(DISTINCT i.product_id), 
                  COALESCE(SUM(i.quantity), 0),
                  COALESCE(SUM(i.quantity * p.cost_price), 0),
                  COALESCE(SUM(CASE WHEN i.quantity <= p.min_stock AND i.quantity > 0 THEN 1 ELSE 0 END), 0),
                  COALESCE(SUM(CASE WHEN i.quantity = 0 THEN 1 ELSE 0 END), 0)
           FROM warehouses w
           LEFT JOIN product_inventory i ON w.id = i.warehouse_id
           LEFT JOIN products p ON i.product_id = p.id
           WHERE w.id = ?1
           GROUP BY w.id, w.name"#
    } else {
        r#"SELECT NULL, NULL,
                  COUNT(DISTINCT i.product_id), 
                  COALESCE(SUM(i.quantity), 0),
                  COALESCE(SUM(i.quantity * p.cost_price), 0),
                  COALESCE(SUM(CASE WHEN i.quantity <= p.min_stock AND i.quantity > 0 THEN 1 ELSE 0 END), 0),
                  COALESCE(SUM(CASE WHEN i.quantity = 0 THEN 1 ELSE 0 END), 0)
           FROM product_inventory i
           LEFT JOIN products p ON i.product_id = p.id"#
    };
    
    let mut stmt = conn.prepare(query)?;
    
    if let Some(wid) = warehouse_id {
        stmt.query_row(params![wid], |row| {
            Ok(InventorySummary {
                warehouse_id: row.get(0)?,
                warehouse_name: row.get(1)?,
                total_products: row.get(2)?,
                total_quantity: row.get(3)?,
                total_value: row.get(4)?,
                low_stock_count: row.get(5)?,
                out_of_stock_count: row.get(6)?,
            })
        })
    } else {
        stmt.query_row([], |row| {
            Ok(InventorySummary {
                warehouse_id: row.get(0)?,
                warehouse_name: row.get(1)?,
                total_products: row.get(2)?,
                total_quantity: row.get(3)?,
                total_value: row.get(4)?,
                low_stock_count: row.get(5)?,
                out_of_stock_count: row.get(6)?,
            })
        })
    }
}

pub fn get_low_stock_products(conn: &Connection, warehouse_id: Option<i64>) -> Result<Vec<LowStockProduct>> {
    let query = if warehouse_id.is_some() {
        r#"SELECT p.id, p.name, p.sku, i.warehouse_id, w.name, i.quantity, p.min_stock, p.min_stock
           FROM products p
           JOIN product_inventory i ON p.id = i.product_id
           LEFT JOIN warehouses w ON i.warehouse_id = w.id
           WHERE i.warehouse_id = ?1 AND i.quantity <= p.min_stock
           ORDER BY i.quantity ASC"#
    } else {
        r#"SELECT p.id, p.name, p.sku, i.warehouse_id, w.name, i.quantity, p.min_stock, p.min_stock
           FROM products p
           JOIN product_inventory i ON p.id = i.product_id
           LEFT JOIN warehouses w ON i.warehouse_id = w.id
           WHERE i.quantity <= p.min_stock
           ORDER BY i.quantity ASC"#
    };
    
    let mut stmt = conn.prepare(query)?;
    
    if let Some(wid) = warehouse_id {
        let products = stmt.query_map(params![wid], |row| {
            Ok(LowStockProduct {
                product_id: row.get(0)?,
                product_name: row.get(1)?,
                product_sku: row.get(2)?,
                warehouse_id: row.get(3)?,
                warehouse_name: row.get(4)?,
                current_quantity: row.get(5)?,
                min_quantity: row.get(6)?,
                alert_threshold: row.get(7)?,
            })
        })?;
        Ok(products.filter_map(|r| r.ok()).collect())
    } else {
        let products = stmt.query_map([], |row| {
            Ok(LowStockProduct {
                product_id: row.get(0)?,
                product_name: row.get(1)?,
                product_sku: row.get(2)?,
                warehouse_id: row.get(3)?,
                warehouse_name: row.get(4)?,
                current_quantity: row.get(5)?,
                min_quantity: row.get(6)?,
                alert_threshold: row.get(7)?,
            })
        })?;
        Ok(products.filter_map(|r| r.ok()).collect())
    }
}
