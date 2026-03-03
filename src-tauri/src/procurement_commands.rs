// 采购管理模块 Rust Commands
// 实现完整的 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

// ==================== 采购申请 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProcurementRequest {
    pub id: i64,
    pub request_no: String,
    pub applicant_id: Option<i64>,
    pub department: Option<String>,
    pub priority: String,
    pub status: String,
    pub total_amount: f64,
    pub notes: Option<String>,
    pub approved_by: Option<i64>,
    pub approved_at: Option<DateTime<Utc>>,
    pub rejection_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProcurementRequestCreateInput {
    pub department: Option<String>,
    pub priority: Option<String>,
    pub notes: Option<String>,
    pub items: Vec<ProcurementRequestItemInput>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProcurementRequestItemInput {
    pub product_id: Option<i64>,
    pub product_name: String,
    pub product_sku: Option<String>,
    pub quantity: i64,
    pub unit: Option<String>,
    pub estimated_price: Option<f64>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProcurementRequestItem {
    pub id: i64,
    pub request_id: i64,
    pub product_id: Option<i64>,
    pub product_name: String,
    pub product_sku: Option<String>,
    pub quantity: i64,
    pub unit: String,
    pub estimated_price: f64,
    pub total_amount: f64,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

// ==================== 采购订单 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PurchaseOrder {
    pub id: i64,
    pub order_no: String,
    pub supplier_id: i64,
    pub request_id: Option<i64>,
    pub order_date: String,
    pub expected_delivery_date: Option<String>,
    pub actual_delivery_date: Option<String>,
    pub status: String,
    pub payment_status: String,
    pub payment_terms: Option<String>,
    pub currency: String,
    pub subtotal: f64,
    pub tax_rate: f64,
    pub tax_amount: f64,
    pub discount_amount: f64,
    pub shipping_cost: f64,
    pub total_amount: f64,
    pub notes: Option<String>,
    pub attachment_urls: Vec<String>,
    pub created_by: Option<i64>,
    pub confirmed_at: Option<DateTime<Utc>>,
    pub completed_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseOrderCreateInput {
    pub supplier_id: i64,
    pub request_id: Option<i64>,
    pub order_date: Option<String>,
    pub expected_delivery_date: Option<String>,
    pub payment_terms: Option<String>,
    pub currency: Option<String>,
    pub tax_rate: Option<f64>,
    pub discount_amount: Option<f64>,
    pub shipping_cost: Option<f64>,
    pub notes: Option<String>,
    pub attachment_urls: Option<Vec<String>>,
    pub items: Vec<PurchaseOrderItemInput>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseOrderItemInput {
    pub product_id: Option<i64>,
    pub product_name: String,
    pub product_sku: Option<String>,
    pub quantity: i64,
    pub unit: Option<String>,
    pub unit_price: f64,
    pub tax_rate: Option<f64>,
    pub discount_rate: Option<f64>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PurchaseOrderItem {
    pub id: i64,
    pub order_id: i64,
    pub product_id: Option<i64>,
    pub product_name: String,
    pub product_sku: Option<String>,
    pub quantity: i64,
    pub received_quantity: i64,
    pub unit: String,
    pub unit_price: f64,
    pub total_amount: f64,
    pub tax_rate: f64,
    pub discount_rate: f64,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// ==================== 采购合同 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PurchaseContract {
    pub id: i64,
    pub contract_no: String,
    pub order_id: Option<i64>,
    pub supplier_id: i64,
    pub contract_type: String,
    pub title: String,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub total_amount: f64,
    pub status: String,
    pub terms: Option<String>,
    pub attachment_urls: Vec<String>,
    pub signed_by_supplier: Option<String>,
    pub signed_by_company: Option<String>,
    pub signed_at: Option<DateTime<Utc>>,
    pub created_by: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseContractCreateInput {
    pub order_id: Option<i64>,
    pub supplier_id: i64,
    pub contract_type: Option<String>,
    pub title: String,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub total_amount: Option<f64>,
    pub terms: Option<String>,
    pub attachment_urls: Option<Vec<String>>,
}

// ==================== 入库验收 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReceivingInspection {
    pub id: i64,
    pub inspection_no: String,
    pub order_id: i64,
    pub warehouse_id: Option<i64>,
    pub inspection_date: String,
    pub inspector_id: Option<i64>,
    pub status: String,
    pub quality_status: String,
    pub notes: Option<String>,
    pub rejection_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ReceivingInspectionCreateInput {
    pub order_id: i64,
    pub warehouse_id: Option<i64>,
    pub inspection_date: Option<String>,
    pub notes: Option<String>,
    pub items: Vec<ReceivingInspectionItemInput>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ReceivingInspectionItemInput {
    pub order_item_id: i64,
    pub product_id: Option<i64>,
    pub expected_quantity: i64,
    pub received_quantity: i64,
    pub qualified_quantity: Option<i64>,
    pub rejected_quantity: Option<i64>,
    pub quality_notes: Option<String>,
    pub warehouse_location: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReceivingInspectionItem {
    pub id: i64,
    pub inspection_id: i64,
    pub order_item_id: i64,
    pub product_id: Option<i64>,
    pub expected_quantity: i64,
    pub received_quantity: i64,
    pub qualified_quantity: i64,
    pub rejected_quantity: i64,
    pub unit_price: f64,
    pub subtotal: f64,
    pub quality_notes: Option<String>,
    pub warehouse_location: Option<String>,
    pub created_at: DateTime<Utc>,
}

// ==================== 供应商比价 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SupplierComparison {
    pub id: i64,
    pub comparison_no: String,
    pub title: String,
    pub product_id: Option<i64>,
    pub product_name: String,
    pub quantity: i64,
    pub status: String,
    pub created_by: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierComparisonCreateInput {
    pub title: String,
    pub product_id: Option<i64>,
    pub product_name: String,
    pub quantity: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SupplierComparisonItem {
    pub id: i64,
    pub comparison_id: i64,
    pub supplier_id: i64,
    pub supplier_name: String,
    pub unit_price: f64,
    pub total_amount: f64,
    pub delivery_days: Option<i64>,
    pub payment_terms: Option<String>,
    pub quality_rating: Option<i64>,
    pub service_rating: Option<i64>,
    pub notes: Option<String>,
    pub is_selected: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierComparisonItemInput {
    pub supplier_id: i64,
    pub unit_price: f64,
    pub delivery_days: Option<i64>,
    pub payment_terms: Option<String>,
    pub quality_rating: Option<i64>,
    pub service_rating: Option<i64>,
    pub notes: Option<String>,
}

// ==================== 辅助函数：生成单号 ====================

fn generate_request_no(conn: &Connection) -> Result<String> {
    let date = Utc::now().format("%Y%m%d").to_string();
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM procurement_requests WHERE request_no LIKE ?1")?;
    let prefix = format!("PR{}", date);
    let count: i64 = stmt.query_row(params![format!("{}%", prefix)], |row| row.get(0))?;
    Ok(format!("PR{}{:04}", date, count + 1))
}

fn generate_order_no(conn: &Connection) -> Result<String> {
    let date = Utc::now().format("%Y%m%d").to_string();
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM purchase_orders WHERE order_no LIKE ?1")?;
    let prefix = format!("PO{}", date);
    let count: i64 = stmt.query_row(params![format!("{}%", prefix)], |row| row.get(0))?;
    Ok(format!("PO{}{:04}", date, count + 1))
}

fn generate_contract_no(conn: &Connection) -> Result<String> {
    let date = Utc::now().format("%Y%m%d").to_string();
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM purchase_contracts WHERE contract_no LIKE ?1")?;
    let prefix = format!("PC{}", date);
    let count: i64 = stmt.query_row(params![format!("{}%", prefix)], |row| row.get(0))?;
    Ok(format!("PC{}{:04}", date, count + 1))
}

fn generate_inspection_no(conn: &Connection) -> Result<String> {
    let date = Utc::now().format("%Y%m%d").to_string();
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM receiving_inspections WHERE inspection_no LIKE ?1")?;
    let prefix = format!("RI{}", date);
    let count: i64 = stmt.query_row(params![format!("{}%", prefix)], |row| row.get(0))?;
    Ok(format!("RI{}{:04}", date, count + 1))
}

fn generate_comparison_no(conn: &Connection) -> Result<String> {
    let date = Utc::now().format("%Y%m%d").to_string();
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM supplier_comparisons WHERE comparison_no LIKE ?1")?;
    let prefix = format!("SC{}", date);
    let count: i64 = stmt.query_row(params![format!("{}%", prefix)], |row| row.get(0))?;
    Ok(format!("SC{}{:04}", date, count + 1))
}

// ==================== 采购申请 CRUD ====================

pub fn create_procurement_request(conn: &Connection, input: ProcurementRequestCreateInput) -> Result<ProcurementRequest> {
    let now = Utc::now();
    let request_no = generate_request_no(conn)?;
    
    conn.execute(
        "INSERT INTO procurement_requests (request_no, applicant_id, department, priority, status, total_amount, notes, created_at, updated_at) 
         VALUES (?1, NULL, ?2, ?3, 'pending', 0, ?4, ?5, ?5)",
        params![request_no, input.department, input.priority.unwrap_or_else(|| "normal".to_string()), input.notes, now.to_rfc3339()],
    )?;
    
    let request_id = conn.last_insert_rowid();
    
    // 插入明细项
    for item in input.items {
        conn.execute(
            "INSERT INTO procurement_request_items (request_id, product_id, product_name, product_sku, quantity, unit, estimated_price, notes) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                request_id,
                item.product_id,
                item.product_name,
                item.product_sku,
                item.quantity,
                item.unit.unwrap_or_else(|| "件".to_string()),
                item.estimated_price.unwrap_or(0.0),
                item.notes,
            ],
        )?;
    }
    
    // 更新总金额
    let mut stmt = conn.prepare("SELECT COALESCE(SUM(quantity * estimated_price), 0) FROM procurement_request_items WHERE request_id = ?1")?;
    let total_amount: f64 = stmt.query_row(params![request_id], |row| row.get(0))?;
    conn.execute("UPDATE procurement_requests SET total_amount = ?1 WHERE id = ?2", params![total_amount, request_id])?;
    
    get_procurement_request(conn, request_id)
}

pub fn get_procurement_request(conn: &Connection, id: i64) -> Result<ProcurementRequest> {
    let mut stmt = conn.prepare(
        "SELECT id, request_no, applicant_id, department, priority, status, total_amount, notes, approved_by, approved_at, rejection_reason, created_at, updated_at 
         FROM procurement_requests WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(ProcurementRequest {
            id: row.get(0)?,
            request_no: row.get(1)?,
            applicant_id: row.get(2)?,
            department: row.get(3)?,
            priority: row.get(4)?,
            status: row.get(5)?,
            total_amount: row.get(6)?,
            notes: row.get(7)?,
            approved_by: row.get(8)?,
            approved_at: row.get::<_, Option<String>>(9)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            rejection_reason: row.get(10)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_procurement_requests(conn: &Connection, status: Option<String>, limit: i64, offset: i64) -> Result<Vec<ProcurementRequest>> {
    fn map_request_row(row: &rusqlite::Row) -> Result<ProcurementRequest> {
        Ok(ProcurementRequest {
            id: row.get(0)?,
            request_no: row.get(1)?,
            applicant_id: row.get(2)?,
            department: row.get(3)?,
            priority: row.get(4)?,
            status: row.get(5)?,
            total_amount: row.get(6)?,
            notes: row.get(7)?,
            approved_by: row.get(8)?,
            approved_at: row.get::<_, Option<String>>(9)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            rejection_reason: row.get(10)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
        })
    }
    
    let query = if status.is_some() {
        "SELECT id, request_no, applicant_id, department, priority, status, total_amount, notes, approved_by, approved_at, rejection_reason, created_at, updated_at FROM procurement_requests WHERE status = ?1 ORDER BY created_at DESC LIMIT ?2 OFFSET ?3"
    } else {
        "SELECT id, request_no, applicant_id, department, priority, status, total_amount, notes, approved_by, approved_at, rejection_reason, created_at, updated_at FROM procurement_requests ORDER BY created_at DESC LIMIT ?1 OFFSET ?2"
    };
    
    let mut stmt = conn.prepare(query)?;
    
    if let Some(s) = status {
        let requests: Vec<ProcurementRequest> = stmt.query_map(params![s, limit, offset], |row| map_request_row(row))?
            .filter_map(|r| r.ok()).collect();
        Ok(requests)
    } else {
        let requests: Vec<ProcurementRequest> = stmt.query_map(params![limit, offset], |row| map_request_row(row))?
            .filter_map(|r| r.ok()).collect();
        Ok(requests)
    }
}

pub fn get_procurement_request_items(conn: &Connection, request_id: i64) -> Result<Vec<ProcurementRequestItem>> {
    let mut stmt = conn.prepare(
        "SELECT id, request_id, product_id, product_name, product_sku, quantity, unit, estimated_price, quantity * estimated_price as total_amount, notes, created_at 
         FROM procurement_request_items WHERE request_id = ?1"
    )?;
    
    let items = stmt.query_map(params![request_id], |row| {
        Ok(ProcurementRequestItem {
            id: row.get(0)?,
            request_id: row.get(1)?,
            product_id: row.get(2)?,
            product_name: row.get(3)?,
            product_sku: row.get(4)?,
            quantity: row.get(5)?,
            unit: row.get(6)?,
            estimated_price: row.get(7)?,
            total_amount: row.get(8)?,
            notes: row.get(9)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    items.collect()
}

pub fn approve_procurement_request(conn: &Connection, id: i64, approved_by: i64) -> Result<ProcurementRequest> {
    let now = Utc::now();
    conn.execute(
        "UPDATE procurement_requests SET status = 'approved', approved_by = ?1, approved_at = ?2, updated_at = ?2 WHERE id = ?3",
        params![approved_by, now.to_rfc3339(), id],
    )?;
    get_procurement_request(conn, id)
}

pub fn reject_procurement_request(conn: &Connection, id: i64, rejection_reason: String) -> Result<ProcurementRequest> {
    let now = Utc::now();
    conn.execute(
        "UPDATE procurement_requests SET status = 'rejected', rejection_reason = ?1, updated_at = ?2 WHERE id = ?3",
        params![rejection_reason, now.to_rfc3339(), id],
    )?;
    get_procurement_request(conn, id)
}

// ==================== 采购订单 CRUD ====================

pub fn create_purchase_order(conn: &Connection, input: PurchaseOrderCreateInput) -> Result<PurchaseOrder> {
    let now = Utc::now();
    let order_no = generate_order_no(conn)?;
    let order_date = input.order_date.unwrap_or_else(|| Utc::now().format("%Y-%m-%d").to_string());
    
    // 计算 subtotal
    let subtotal: f64 = input.items.iter().map(|item| item.quantity as f64 * item.unit_price).sum();
    let tax_rate = input.tax_rate.unwrap_or(0.0);
    let tax_amount = subtotal * tax_rate / 100.0;
    let discount_amount = input.discount_amount.unwrap_or(0.0);
    let shipping_cost = input.shipping_cost.unwrap_or(0.0);
    let total_amount = subtotal + tax_amount - discount_amount + shipping_cost;
    
    conn.execute(
        "INSERT INTO purchase_orders (order_no, supplier_id, request_id, order_date, expected_delivery_date, status, payment_status, payment_terms, currency, subtotal, tax_rate, tax_amount, discount_amount, shipping_cost, total_amount, notes, attachment_urls, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, 'draft', 'unpaid', ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?16)",
        params![
            order_no,
            input.supplier_id,
            input.request_id,
            order_date,
            input.expected_delivery_date,
            input.payment_terms,
            input.currency.unwrap_or_else(|| "CNY".to_string()),
            subtotal,
            tax_rate,
            tax_amount,
            discount_amount,
            shipping_cost,
            total_amount,
            input.notes,
            input.attachment_urls.map(|urls| serde_json::to_string(&urls).unwrap_or_default()).unwrap_or_default(),
            now.to_rfc3339(),
        ],
    )?;
    
    let order_id = conn.last_insert_rowid();
    
    // 插入明细项
    for item in input.items {
        conn.execute(
            "INSERT INTO purchase_order_items (order_id, product_id, product_name, product_sku, quantity, unit, unit_price, tax_rate, discount_rate, notes) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
            params![
                order_id,
                item.product_id,
                item.product_name,
                item.product_sku,
                item.quantity,
                item.unit.unwrap_or_else(|| "件".to_string()),
                item.unit_price,
                item.tax_rate.unwrap_or(0.0),
                item.discount_rate.unwrap_or(0.0),
                item.notes,
            ],
        )?;
    }
    
    get_purchase_order(conn, order_id)
}

pub fn get_purchase_order(conn: &Connection, id: i64) -> Result<PurchaseOrder> {
    let mut stmt = conn.prepare(
        "SELECT id, order_no, supplier_id, request_id, order_date, expected_delivery_date, actual_delivery_date, status, payment_status, payment_terms, currency, subtotal, tax_rate, tax_amount, discount_amount, shipping_cost, total_amount, notes, attachment_urls, created_by, confirmed_at, completed_at, created_at, updated_at 
         FROM purchase_orders WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(PurchaseOrder {
            id: row.get(0)?,
            order_no: row.get(1)?,
            supplier_id: row.get(2)?,
            request_id: row.get(3)?,
            order_date: row.get(4)?,
            expected_delivery_date: row.get(5)?,
            actual_delivery_date: row.get(6)?,
            status: row.get(7)?,
            payment_status: row.get(8)?,
            payment_terms: row.get(9)?,
            currency: row.get(10)?,
            subtotal: row.get(11)?,
            tax_rate: row.get(12)?,
            tax_amount: row.get(13)?,
            discount_amount: row.get(14)?,
            shipping_cost: row.get(15)?,
            total_amount: row.get(16)?,
            notes: row.get(17)?,
            attachment_urls: serde_json::from_str(&row.get::<_, String>(18)?).unwrap_or_default(),
            created_by: row.get(19)?,
            confirmed_at: row.get::<_, Option<String>>(20)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            completed_at: row.get::<_, Option<String>>(21)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(22)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(23)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_purchase_orders(conn: &Connection, supplier_id: Option<i64>, status: Option<String>, limit: i64, offset: i64) -> Result<Vec<PurchaseOrder>> {
    fn map_order_row(row: &rusqlite::Row) -> Result<PurchaseOrder> {
        Ok(PurchaseOrder {
            id: row.get(0)?,
            order_no: row.get(1)?,
            supplier_id: row.get(2)?,
            request_id: row.get(3)?,
            order_date: row.get(4)?,
            expected_delivery_date: row.get(5)?,
            actual_delivery_date: row.get(6)?,
            status: row.get(7)?,
            payment_status: row.get(8)?,
            payment_terms: row.get(9)?,
            currency: row.get(10)?,
            subtotal: row.get(11)?,
            tax_rate: row.get(12)?,
            tax_amount: row.get(13)?,
            discount_amount: row.get(14)?,
            shipping_cost: row.get(15)?,
            total_amount: row.get(16)?,
            notes: row.get(17)?,
            attachment_urls: serde_json::from_str(&row.get::<_, String>(18)?).unwrap_or_default(),
            created_by: row.get(19)?,
            confirmed_at: row.get::<_, Option<String>>(20)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            completed_at: row.get::<_, Option<String>>(21)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(22)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(23)?).unwrap().with_timezone(&Utc),
        })
    }
    
    let mut where_clauses = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(sid) = supplier_id {
        where_clauses.push("supplier_id = ?".to_string());
        sql_params.push(Box::new(sid));
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
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let query = format!(
        "SELECT id, order_no, supplier_id, request_id, order_date, expected_delivery_date, actual_delivery_date, status, payment_status, payment_terms, currency, subtotal, tax_rate, tax_amount, discount_amount, shipping_cost, total_amount, notes, attachment_urls, created_by, confirmed_at, completed_at, created_at, updated_at 
         FROM purchase_orders {} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    let orders = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| map_order_row(row))?;
    
    orders.collect()
}

pub fn get_purchase_order_items(conn: &Connection, order_id: i64) -> Result<Vec<PurchaseOrderItem>> {
    let mut stmt = conn.prepare(
        "SELECT id, order_id, product_id, product_name, product_sku, quantity, received_quantity, unit, unit_price, quantity * unit_price as total_amount, tax_rate, discount_rate, notes, created_at, updated_at 
         FROM purchase_order_items WHERE order_id = ?1"
    )?;
    
    let items = stmt.query_map(params![order_id], |row| {
        Ok(PurchaseOrderItem {
            id: row.get(0)?,
            order_id: row.get(1)?,
            product_id: row.get(2)?,
            product_name: row.get(3)?,
            product_sku: row.get(4)?,
            quantity: row.get(5)?,
            received_quantity: row.get(6)?,
            unit: row.get(7)?,
            unit_price: row.get(8)?,
            total_amount: row.get(9)?,
            tax_rate: row.get(10)?,
            discount_rate: row.get(11)?,
            notes: row.get(12)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(14)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    items.collect()
}

pub fn update_purchase_order_status(conn: &Connection, id: i64, status: String) -> Result<PurchaseOrder> {
    let now = Utc::now();
    let mut updates = vec!["status = ?".to_string(), "updated_at = ?".to_string()];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = vec![Box::new(status.clone()), Box::new(now.to_rfc3339())];
    
    if status == "confirmed" {
        updates.push("confirmed_at = ?".to_string());
        sql_params.push(Box::new(now.to_rfc3339()));
    }
    
    if status == "completed" {
        updates.push("completed_at = ?".to_string());
        sql_params.push(Box::new(now.to_rfc3339()));
    }
    
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE purchase_orders SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_purchase_order(conn, id)
}

pub fn delete_purchase_order(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM purchase_orders WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 采购合同 CRUD ====================

pub fn create_purchase_contract(conn: &Connection, input: PurchaseContractCreateInput) -> Result<PurchaseContract> {
    let now = Utc::now();
    let contract_no = generate_contract_no(conn)?;
    
    conn.execute(
        "INSERT INTO purchase_contracts (contract_no, order_id, supplier_id, contract_type, title, start_date, end_date, total_amount, status, terms, attachment_urls, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'draft', ?9, ?10, ?11, ?11)",
        params![
            contract_no,
            input.order_id,
            input.supplier_id,
            input.contract_type.unwrap_or_else(|| "standard".to_string()),
            input.title,
            input.start_date,
            input.end_date,
            input.total_amount.unwrap_or(0.0),
            input.terms,
            input.attachment_urls.map(|urls| serde_json::to_string(&urls).unwrap_or_default()).unwrap_or_default(),
            now.to_rfc3339(),
        ],
    )?;
    
    let contract_id = conn.last_insert_rowid();
    get_purchase_contract(conn, contract_id)
}

pub fn get_purchase_contract(conn: &Connection, id: i64) -> Result<PurchaseContract> {
    let mut stmt = conn.prepare(
        "SELECT id, contract_no, order_id, supplier_id, contract_type, title, start_date, end_date, total_amount, status, terms, attachment_urls, signed_by_supplier, signed_by_company, signed_at, created_by, created_at, updated_at 
         FROM purchase_contracts WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(PurchaseContract {
            id: row.get(0)?,
            contract_no: row.get(1)?,
            order_id: row.get(2)?,
            supplier_id: row.get(3)?,
            contract_type: row.get(4)?,
            title: row.get(5)?,
            start_date: row.get(6)?,
            end_date: row.get(7)?,
            total_amount: row.get(8)?,
            status: row.get(9)?,
            terms: row.get(10)?,
            attachment_urls: serde_json::from_str(&row.get::<_, String>(11)?).unwrap_or_default(),
            signed_by_supplier: row.get(12)?,
            signed_by_company: row.get(13)?,
            signed_at: row.get::<_, Option<String>>(14)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_by: row.get(15)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(16)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(17)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_purchase_contracts(conn: &Connection, supplier_id: Option<i64>, status: Option<String>, limit: i64, offset: i64) -> Result<Vec<PurchaseContract>> {
    fn map_contract_row(row: &rusqlite::Row) -> Result<PurchaseContract> {
        Ok(PurchaseContract {
            id: row.get(0)?,
            contract_no: row.get(1)?,
            order_id: row.get(2)?,
            supplier_id: row.get(3)?,
            contract_type: row.get(4)?,
            title: row.get(5)?,
            start_date: row.get(6)?,
            end_date: row.get(7)?,
            total_amount: row.get(8)?,
            status: row.get(9)?,
            terms: row.get(10)?,
            attachment_urls: serde_json::from_str(&row.get::<_, String>(11)?).unwrap_or_default(),
            signed_by_supplier: row.get(12)?,
            signed_by_company: row.get(13)?,
            signed_at: row.get::<_, Option<String>>(14)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_by: row.get(15)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(16)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(17)?).unwrap().with_timezone(&Utc),
        })
    }
    
    let mut where_clauses = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(sid) = supplier_id {
        where_clauses.push("supplier_id = ?".to_string());
        sql_params.push(Box::new(sid));
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
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let query = format!(
        "SELECT id, contract_no, order_id, supplier_id, contract_type, title, start_date, end_date, total_amount, status, terms, attachment_urls, signed_by_supplier, signed_by_company, signed_at, created_by, created_at, updated_at 
         FROM purchase_contracts {} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    let contracts = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| map_contract_row(row))?;
    
    contracts.collect()
}

pub fn update_purchase_contract_status(conn: &Connection, id: i64, status: String) -> Result<PurchaseContract> {
    let now = Utc::now();
    conn.execute(
        "UPDATE purchase_contracts SET status = ?1, updated_at = ?2 WHERE id = ?3",
        params![status, now.to_rfc3339(), id],
    )?;
    get_purchase_contract(conn, id)
}

// ==================== 入库验收 CRUD ====================

pub fn create_receiving_inspection(conn: &Connection, input: ReceivingInspectionCreateInput) -> Result<ReceivingInspection> {
    let now = Utc::now();
    let inspection_no = generate_inspection_no(conn)?;
    let inspection_date = input.inspection_date.unwrap_or_else(|| Utc::now().format("%Y-%m-%d").to_string());
    
    conn.execute(
        "INSERT INTO receiving_inspections (inspection_no, order_id, warehouse_id, inspection_date, inspector_id, status, quality_status, notes, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, NULL, 'pending', 'pending', ?5, ?6, ?6)",
        params![inspection_no, input.order_id, input.warehouse_id, inspection_date, input.notes, now.to_rfc3339()],
    )?;
    
    let inspection_id = conn.last_insert_rowid();
    
    // 插入明细项
    for item in input.items {
        let qualified_qty = item.qualified_quantity.unwrap_or(item.received_quantity);
        let rejected_qty = item.rejected_quantity.unwrap_or(0);
        
        // 获取单价
        let mut stmt = conn.prepare("SELECT unit_price FROM purchase_order_items WHERE id = ?1")?;
        let unit_price: f64 = stmt.query_row(params![item.order_item_id], |row| row.get(0)).unwrap_or(0.0);
        
        conn.execute(
            "INSERT INTO receiving_inspection_items (inspection_id, order_item_id, product_id, expected_quantity, received_quantity, qualified_quantity, rejected_quantity, unit_price, quality_notes, warehouse_location) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
            params![
                inspection_id,
                item.order_item_id,
                item.product_id,
                item.expected_quantity,
                item.received_quantity,
                qualified_qty,
                rejected_qty,
                unit_price,
                item.quality_notes,
                item.warehouse_location,
            ],
        )?;
    }
    
    get_receiving_inspection(conn, inspection_id)
}

pub fn get_receiving_inspection(conn: &Connection, id: i64) -> Result<ReceivingInspection> {
    let mut stmt = conn.prepare(
        "SELECT id, inspection_no, order_id, warehouse_id, inspection_date, inspector_id, status, quality_status, notes, rejection_reason, created_at, updated_at 
         FROM receiving_inspections WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(ReceivingInspection {
            id: row.get(0)?,
            inspection_no: row.get(1)?,
            order_id: row.get(2)?,
            warehouse_id: row.get(3)?,
            inspection_date: row.get(4)?,
            inspector_id: row.get(5)?,
            status: row.get(6)?,
            quality_status: row.get(7)?,
            notes: row.get(8)?,
            rejection_reason: row.get(9)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_receiving_inspections(conn: &Connection, order_id: Option<i64>, status: Option<String>, limit: i64, offset: i64) -> Result<Vec<ReceivingInspection>> {
    fn map_inspection_row(row: &rusqlite::Row) -> Result<ReceivingInspection> {
        Ok(ReceivingInspection {
            id: row.get(0)?,
            inspection_no: row.get(1)?,
            order_id: row.get(2)?,
            warehouse_id: row.get(3)?,
            inspection_date: row.get(4)?,
            inspector_id: row.get(5)?,
            status: row.get(6)?,
            quality_status: row.get(7)?,
            notes: row.get(8)?,
            rejection_reason: row.get(9)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
        })
    }
    
    let mut where_clauses = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(oid) = order_id {
        where_clauses.push("order_id = ?".to_string());
        sql_params.push(Box::new(oid));
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
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let query = format!(
        "SELECT id, inspection_no, order_id, warehouse_id, inspection_date, inspector_id, status, quality_status, notes, rejection_reason, created_at, updated_at 
         FROM receiving_inspections {} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    let inspections = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| map_inspection_row(row))?;
    
    inspections.collect()
}

pub fn get_receiving_inspection_items(conn: &Connection, inspection_id: i64) -> Result<Vec<ReceivingInspectionItem>> {
    let mut stmt = conn.prepare(
        "SELECT id, inspection_id, order_item_id, product_id, expected_quantity, received_quantity, qualified_quantity, rejected_quantity, unit_price, qualified_quantity * unit_price as subtotal, quality_notes, warehouse_location, created_at 
         FROM receiving_inspection_items WHERE inspection_id = ?1"
    )?;
    
    let items = stmt.query_map(params![inspection_id], |row| {
        Ok(ReceivingInspectionItem {
            id: row.get(0)?,
            inspection_id: row.get(1)?,
            order_item_id: row.get(2)?,
            product_id: row.get(3)?,
            expected_quantity: row.get(4)?,
            received_quantity: row.get(5)?,
            qualified_quantity: row.get(6)?,
            rejected_quantity: row.get(7)?,
            unit_price: row.get(8)?,
            subtotal: row.get(9)?,
            quality_notes: row.get(10)?,
            warehouse_location: row.get(11)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    items.collect()
}

pub fn update_receiving_inspection_status(conn: &Connection, id: i64, status: String, quality_status: Option<String>, rejection_reason: Option<String>) -> Result<ReceivingInspection> {
    let now = Utc::now();
    let mut updates = vec!["status = ?".to_string(), "updated_at = ?".to_string()];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = vec![Box::new(status), Box::new(now.to_rfc3339())];
    
    if let Some(qs) = quality_status {
        updates.push("quality_status = ?".to_string());
        sql_params.push(Box::new(qs));
    }
    
    if let Some(rr) = rejection_reason {
        updates.push("rejection_reason = ?".to_string());
        sql_params.push(Box::new(rr));
    }
    
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE receiving_inspections SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_receiving_inspection(conn, id)
}

// ==================== 供应商比价 CRUD ====================

pub fn create_supplier_comparison(conn: &Connection, input: SupplierComparisonCreateInput) -> Result<SupplierComparison> {
    let now = Utc::now();
    let comparison_no = generate_comparison_no(conn)?;
    
    conn.execute(
        "INSERT INTO supplier_comparisons (comparison_no, title, product_id, product_name, quantity, status, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, 'draft', ?6, ?6)",
        params![comparison_no, input.title, input.product_id, input.product_name, input.quantity, now.to_rfc3339()],
    )?;
    
    let comparison_id = conn.last_insert_rowid();
    get_supplier_comparison(conn, comparison_id)
}

pub fn get_supplier_comparison(conn: &Connection, id: i64) -> Result<SupplierComparison> {
    let mut stmt = conn.prepare(
        "SELECT id, comparison_no, title, product_id, product_name, quantity, status, created_by, created_at, updated_at 
         FROM supplier_comparisons WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(SupplierComparison {
            id: row.get(0)?,
            comparison_no: row.get(1)?,
            title: row.get(2)?,
            product_id: row.get(3)?,
            product_name: row.get(4)?,
            quantity: row.get(5)?,
            status: row.get(6)?,
            created_by: row.get(7)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_supplier_comparisons(conn: &Connection, status: Option<String>, limit: i64, offset: i64) -> Result<Vec<SupplierComparison>> {
    fn map_comparison_row(row: &rusqlite::Row) -> Result<SupplierComparison> {
        Ok(SupplierComparison {
            id: row.get(0)?,
            comparison_no: row.get(1)?,
            title: row.get(2)?,
            product_id: row.get(3)?,
            product_name: row.get(4)?,
            quantity: row.get(5)?,
            status: row.get(6)?,
            created_by: row.get(7)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?).unwrap().with_timezone(&Utc),
        })
    }
    
    let query = if status.is_some() {
        "SELECT id, comparison_no, title, product_id, product_name, quantity, status, created_by, created_at, updated_at FROM supplier_comparisons WHERE status = ?1 ORDER BY created_at DESC LIMIT ?2 OFFSET ?3"
    } else {
        "SELECT id, comparison_no, title, product_id, product_name, quantity, status, created_by, created_at, updated_at FROM supplier_comparisons ORDER BY created_at DESC LIMIT ?1 OFFSET ?2"
    };
    
    let mut stmt = conn.prepare(query)?;
    
    if let Some(s) = status {
        let comparisons: Vec<SupplierComparison> = stmt.query_map(params![s, limit, offset], |row| map_comparison_row(row))?
            .filter_map(|r| r.ok()).collect();
        Ok(comparisons)
    } else {
        let comparisons: Vec<SupplierComparison> = stmt.query_map(params![limit, offset], |row| map_comparison_row(row))?
            .filter_map(|r| r.ok()).collect();
        Ok(comparisons)
    }
}

pub fn add_supplier_comparison_item(conn: &Connection, comparison_id: i64, input: SupplierComparisonItemInput) -> Result<SupplierComparisonItem> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO supplier_comparison_items (comparison_id, supplier_id, unit_price, delivery_days, payment_terms, quality_rating, service_rating, notes, is_selected, created_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 0, ?9)",
        params![
            comparison_id,
            input.supplier_id,
            input.unit_price,
            input.delivery_days,
            input.payment_terms,
            input.quality_rating,
            input.service_rating,
            input.notes,
            now.to_rfc3339(),
        ],
    )?;
    
    let item_id = conn.last_insert_rowid();
    get_supplier_comparison_item(conn, item_id)
}

pub fn get_supplier_comparison_item(conn: &Connection, id: i64) -> Result<SupplierComparisonItem> {
    let mut stmt = conn.prepare(
        "SELECT sci.id, sci.comparison_id, sci.supplier_id, s.name as supplier_name, sci.unit_price, sci.unit_price * sc.quantity as total_amount, sci.delivery_days, sci.payment_terms, sci.quality_rating, sci.service_rating, sci.notes, sci.is_selected, sci.created_at 
         FROM supplier_comparison_items sci 
         JOIN suppliers s ON sci.supplier_id = s.id 
         JOIN supplier_comparisons sc ON sci.comparison_id = sc.id 
         WHERE sci.id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(SupplierComparisonItem {
            id: row.get(0)?,
            comparison_id: row.get(1)?,
            supplier_id: row.get(2)?,
            supplier_name: row.get(3)?,
            unit_price: row.get(4)?,
            total_amount: row.get(5)?,
            delivery_days: row.get(6)?,
            payment_terms: row.get(7)?,
            quality_rating: row.get(8)?,
            service_rating: row.get(9)?,
            notes: row.get(10)?,
            is_selected: row.get::<_, i64>(11)? != 0,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn get_supplier_comparison_items(conn: &Connection, comparison_id: i64) -> Result<Vec<SupplierComparisonItem>> {
    let mut stmt = conn.prepare(
        "SELECT sci.id, sci.comparison_id, sci.supplier_id, s.name as supplier_name, sci.unit_price, sci.unit_price * sc.quantity as total_amount, sci.delivery_days, sci.payment_terms, sci.quality_rating, sci.service_rating, sci.notes, sci.is_selected, sci.created_at 
         FROM supplier_comparison_items sci 
         JOIN suppliers s ON sci.supplier_id = s.id 
         JOIN supplier_comparisons sc ON sci.comparison_id = sc.id 
         WHERE sci.comparison_id = ?1"
    )?;
    
    let items = stmt.query_map(params![comparison_id], |row| {
        Ok(SupplierComparisonItem {
            id: row.get(0)?,
            comparison_id: row.get(1)?,
            supplier_id: row.get(2)?,
            supplier_name: row.get(3)?,
            unit_price: row.get(4)?,
            total_amount: row.get(5)?,
            delivery_days: row.get(6)?,
            payment_terms: row.get(7)?,
            quality_rating: row.get(8)?,
            service_rating: row.get(9)?,
            notes: row.get(10)?,
            is_selected: row.get::<_, i64>(11)? != 0,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    items.collect()
}

pub fn select_supplier_comparison_item(conn: &Connection, item_id: i64) -> Result<()> {
    let mut stmt = conn.prepare("SELECT comparison_id FROM supplier_comparison_items WHERE id = ?1")?;
    let comparison_id: i64 = stmt.query_row(params![item_id], |row| row.get(0))?;
    
    // 取消其他选择
    conn.execute("UPDATE supplier_comparison_items SET is_selected = 0 WHERE comparison_id = ?1", params![comparison_id])?;
    // 设置当前选择
    conn.execute("UPDATE supplier_comparison_items SET is_selected = 1 WHERE id = ?1", params![item_id])?;
    
    Ok(())
}

pub fn delete_supplier_comparison(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM supplier_comparisons WHERE id = ?", params![id])?;
    Ok(affected > 0)
}
