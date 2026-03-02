// 订单管理模块 Rust Commands
// 实现完整的 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

// ==================== 客户相关结构体 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Customer {
    pub id: i64,
    pub name: String,
    pub code: String,
    pub contact_person: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub country: String,
    pub postal_code: Option<String>,
    pub tax_id: Option<String>,
    pub bank_name: Option<String>,
    pub bank_account: Option<String>,
    pub credit_limit: f64,
    pub balance: f64,
    pub level: String,
    pub status: String,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerCreateInput {
    pub name: String,
    pub code: String,
    pub contact_person: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub country: Option<String>,
    pub postal_code: Option<String>,
    pub tax_id: Option<String>,
    pub bank_name: Option<String>,
    pub bank_account: Option<String>,
    pub credit_limit: Option<f64>,
    pub level: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerUpdateInput {
    pub name: Option<String>,
    pub code: Option<String>,
    pub contact_person: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub country: Option<String>,
    pub postal_code: Option<String>,
    pub tax_id: Option<String>,
    pub bank_name: Option<String>,
    pub bank_account: Option<String>,
    pub credit_limit: Option<f64>,
    pub balance: Option<f64>,
    pub level: Option<String>,
    pub status: Option<String>,
    pub notes: Option<String>,
}

// ==================== 供应商相关结构体 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Supplier {
    pub id: i64,
    pub name: String,
    pub code: String,
    pub contact_person: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub country: String,
    pub postal_code: Option<String>,
    pub tax_id: Option<String>,
    pub bank_name: Option<String>,
    pub bank_account: Option<String>,
    pub rating: i64,
    pub status: String,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierCreateInput {
    pub name: String,
    pub code: String,
    pub contact_person: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub country: Option<String>,
    pub postal_code: Option<String>,
    pub tax_id: Option<String>,
    pub bank_name: Option<String>,
    pub bank_account: Option<String>,
    pub rating: Option<i64>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierUpdateInput {
    pub name: Option<String>,
    pub code: Option<String>,
    pub contact_person: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub country: Option<String>,
    pub postal_code: Option<String>,
    pub tax_id: Option<String>,
    pub bank_name: Option<String>,
    pub bank_account: Option<String>,
    pub rating: Option<i64>,
    pub status: Option<String>,
    pub notes: Option<String>,
}

// ==================== 销售订单相关结构体 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SalesOrder {
    pub id: i64,
    pub order_no: String,
    pub customer_id: i64,
    pub order_date: DateTime<Utc>,
    pub required_date: Option<DateTime<Utc>>,
    pub shipped_date: Option<DateTime<Utc>>,
    pub status: String,
    pub payment_status: String,
    pub warehouse_id: Option<i64>,
    pub sales_rep_id: Option<i64>,
    pub subtotal: f64,
    pub tax_rate: f64,
    pub tax_amount: f64,
    pub discount_amount: f64,
    pub shipping_fee: f64,
    pub total_amount: f64,
    pub paid_amount: f64,
    pub shipping_address: Option<String>,
    pub shipping_city: Option<String>,
    pub shipping_province: Option<String>,
    pub shipping_country: String,
    pub shipping_postal_code: Option<String>,
    pub notes: Option<String>,
    pub internal_notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesOrderCreateInput {
    pub customer_id: i64,
    pub required_date: Option<String>,
    pub warehouse_id: Option<i64>,
    pub sales_rep_id: Option<i64>,
    pub tax_rate: Option<f64>,
    pub discount_amount: Option<f64>,
    pub shipping_fee: Option<f64>,
    pub shipping_address: Option<String>,
    pub shipping_city: Option<String>,
    pub shipping_province: Option<String>,
    pub shipping_country: Option<String>,
    pub shipping_postal_code: Option<String>,
    pub notes: Option<String>,
    pub internal_notes: Option<String>,
    pub items: Vec<SalesOrderItemInput>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesOrderItemInput {
    pub product_id: i64,
    pub quantity: i64,
    pub unit_price: f64,
    pub discount: Option<f64>,
    pub tax_rate: Option<f64>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesOrderUpdateInput {
    pub required_date: Option<String>,
    pub status: Option<String>,
    pub payment_status: Option<String>,
    pub warehouse_id: Option<i64>,
    pub sales_rep_id: Option<i64>,
    pub discount_amount: Option<f64>,
    pub shipping_fee: Option<f64>,
    pub shipping_address: Option<String>,
    pub shipping_city: Option<String>,
    pub shipping_province: Option<String>,
    pub shipping_postal_code: Option<String>,
    pub notes: Option<String>,
    pub internal_notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SalesOrderItem {
    pub id: i64,
    pub order_id: i64,
    pub product_id: i64,
    pub sku: String,
    pub product_name: String,
    pub quantity: i64,
    pub unit_price: f64,
    pub discount: f64,
    pub tax_rate: f64,
    pub tax_amount: f64,
    pub subtotal: f64,
    pub total_amount: f64,
    pub shipped_quantity: i64,
    pub returned_quantity: i64,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

// ==================== 采购订单相关结构体 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PurchaseOrder {
    pub id: i64,
    pub order_no: String,
    pub supplier_id: i64,
    pub order_date: DateTime<Utc>,
    pub required_date: Option<DateTime<Utc>>,
    pub received_date: Option<DateTime<Utc>>,
    pub status: String,
    pub payment_status: String,
    pub warehouse_id: Option<i64>,
    pub purchaser_id: Option<i64>,
    pub subtotal: f64,
    pub tax_rate: f64,
    pub tax_amount: f64,
    pub discount_amount: f64,
    pub shipping_fee: f64,
    pub total_amount: f64,
    pub paid_amount: f64,
    pub shipping_address: Option<String>,
    pub notes: Option<String>,
    pub internal_notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseOrderCreateInput {
    pub supplier_id: i64,
    pub required_date: Option<String>,
    pub warehouse_id: Option<i64>,
    pub purchaser_id: Option<i64>,
    pub tax_rate: Option<f64>,
    pub discount_amount: Option<f64>,
    pub shipping_fee: Option<f64>,
    pub shipping_address: Option<String>,
    pub notes: Option<String>,
    pub internal_notes: Option<String>,
    pub items: Vec<PurchaseOrderItemInput>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseOrderItemInput {
    pub product_id: i64,
    pub quantity: i64,
    pub unit_price: f64,
    pub discount: Option<f64>,
    pub tax_rate: Option<f64>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseOrderUpdateInput {
    pub required_date: Option<String>,
    pub status: Option<String>,
    pub payment_status: Option<String>,
    pub warehouse_id: Option<i64>,
    pub purchaser_id: Option<i64>,
    pub discount_amount: Option<f64>,
    pub shipping_fee: Option<f64>,
    pub shipping_address: Option<String>,
    pub notes: Option<String>,
    pub internal_notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PurchaseOrderItem {
    pub id: i64,
    pub order_id: i64,
    pub product_id: i64,
    pub sku: String,
    pub product_name: String,
    pub quantity: i64,
    pub unit_price: f64,
    pub discount: f64,
    pub tax_rate: f64,
    pub tax_amount: f64,
    pub subtotal: f64,
    pub total_amount: f64,
    pub received_quantity: i64,
    pub returned_quantity: i64,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

// ==================== 订单状态历史 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OrderStatusHistory {
    pub id: i64,
    pub order_type: String,
    pub order_id: i64,
    pub old_status: Option<String>,
    pub new_status: String,
    pub changed_by: Option<i64>,
    pub change_reason: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OrderStatusChangeInput {
    pub order_type: String,
    pub order_id: i64,
    pub old_status: Option<String>,
    pub new_status: String,
    pub change_reason: Option<String>,
    pub changed_by: Option<i64>,
}

// ==================== 列表参数 ====================

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesOrderListParams {
    pub limit: i64,
    pub offset: i64,
    pub customer_id: Option<i64>,
    pub status: Option<String>,
    pub payment_status: Option<String>,
    pub date_from: Option<String>,
    pub date_to: Option<String>,
    pub search: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseOrderListParams {
    pub limit: i64,
    pub offset: i64,
    pub supplier_id: Option<i64>,
    pub status: Option<String>,
    pub payment_status: Option<String>,
    pub date_from: Option<String>,
    pub date_to: Option<String>,
    pub search: Option<String>,
}

// ==================== 客户 CRUD ====================

pub fn create_customer(conn: &Connection, input: CustomerCreateInput) -> Result<Customer> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    
    conn.execute(
        "INSERT INTO customers (name, code, contact_person, phone, email, address, city, province, country, postal_code, tax_id, bank_name, bank_account, credit_limit, balance, level, status, notes, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, 0, ?15, 'active', ?16, ?17, ?17)",
        params![
            input.name,
            input.code,
            input.contact_person,
            input.phone,
            input.email,
            input.address,
            input.city,
            input.province,
            input.country.unwrap_or_else(|| "中国".to_string()),
            input.postal_code,
            input.tax_id,
            input.bank_name,
            input.bank_account,
            input.credit_limit.unwrap_or(0.0),
            input.level.unwrap_or_else(|| "normal".to_string()),
            input.notes,
            now_str,
        ],
    )?;
    
    let customer_id = conn.last_insert_rowid();
    get_customer(conn, customer_id)
}

pub fn get_customer(conn: &Connection, id: i64) -> Result<Customer> {
    let mut stmt = conn.prepare("SELECT id, name, code, contact_person, phone, email, address, city, province, country, postal_code, tax_id, bank_name, bank_account, credit_limit, balance, level, status, notes, created_at, updated_at FROM customers WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(Customer {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            contact_person: row.get(3)?,
            phone: row.get(4)?,
            email: row.get(5)?,
            address: row.get(6)?,
            city: row.get(7)?,
            province: row.get(8)?,
            country: row.get(9)?,
            postal_code: row.get(10)?,
            tax_id: row.get(11)?,
            bank_name: row.get(12)?,
            bank_account: row.get(13)?,
            credit_limit: row.get(14)?,
            balance: row.get(15)?,
            level: row.get(16)?,
            status: row.get(17)?,
            notes: row.get(18)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(19)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(20)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_customers(conn: &Connection, limit: i64, offset: i64, status: Option<String>, level: Option<String>, search: Option<String>) -> Result<Vec<Customer>> {
    let mut where_clauses = vec![];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(s) = status {
        where_clauses.push("status = ?".to_string());
        sql_params.push(Box::new(s));
    }
    
    if let Some(l) = level {
        where_clauses.push("level = ?".to_string());
        sql_params.push(Box::new(l));
    }
    
    if let Some(srch) = search {
        where_clauses.push("(name LIKE ? OR code LIKE ? OR contact_person LIKE ?)".to_string());
        let search_pattern = format!("%{}%", srch);
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern));
    }
    
    let where_clause = if where_clauses.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_clauses.join(" AND "))
    };
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let query = format!(
        "SELECT id, name, code, contact_person, phone, email, address, city, province, country, postal_code, tax_id, bank_name, bank_account, credit_limit, balance, level, status, notes, created_at, updated_at 
         FROM customers {} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let customers = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(Customer {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            contact_person: row.get(3)?,
            phone: row.get(4)?,
            email: row.get(5)?,
            address: row.get(6)?,
            city: row.get(7)?,
            province: row.get(8)?,
            country: row.get(9)?,
            postal_code: row.get(10)?,
            tax_id: row.get(11)?,
            bank_name: row.get(12)?,
            bank_account: row.get(13)?,
            credit_limit: row.get(14)?,
            balance: row.get(15)?,
            level: row.get(16)?,
            status: row.get(17)?,
            notes: row.get(18)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(19)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(20)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    customers.collect()
}

pub fn update_customer(conn: &Connection, id: i64, input: CustomerUpdateInput) -> Result<Customer> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    macro_rules! add_update {
        ($field:expr, $val:expr) => {
            if let Some(v) = $val {
                updates.push($field);
                sql_params.push(Box::new(v));
            }
        };
    }
    
    add_update!("name = ?", input.name);
    add_update!("code = ?", input.code);
    add_update!("contact_person = ?", input.contact_person);
    add_update!("phone = ?", input.phone);
    add_update!("email = ?", input.email);
    add_update!("address = ?", input.address);
    add_update!("city = ?", input.city);
    add_update!("province = ?", input.province);
    add_update!("country = ?", input.country);
    add_update!("postal_code = ?", input.postal_code);
    add_update!("tax_id = ?", input.tax_id);
    add_update!("bank_name = ?", input.bank_name);
    add_update!("bank_account = ?", input.bank_account);
    add_update!("credit_limit = ?", input.credit_limit);
    add_update!("balance = ?", input.balance);
    add_update!("level = ?", input.level);
    add_update!("status = ?", input.status);
    add_update!("notes = ?", input.notes);
    
    if updates.is_empty() {
        return get_customer(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE customers SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_customer(conn, id)
}

pub fn delete_customer(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM customers WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 供应商 CRUD ====================

pub fn create_supplier(conn: &Connection, input: SupplierCreateInput) -> Result<Supplier> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    
    conn.execute(
        "INSERT INTO suppliers (name, code, contact_person, phone, email, address, city, province, country, postal_code, tax_id, bank_name, bank_account, rating, status, notes, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, 'active', ?15, ?16, ?16)",
        params![
            input.name,
            input.code,
            input.contact_person,
            input.phone,
            input.email,
            input.address,
            input.city,
            input.province,
            input.country.unwrap_or_else(|| "中国".to_string()),
            input.postal_code,
            input.tax_id,
            input.bank_name,
            input.bank_account,
            input.rating.unwrap_or(5),
            input.notes,
            now_str,
        ],
    )?;
    
    let supplier_id = conn.last_insert_rowid();
    get_supplier(conn, supplier_id)
}

pub fn get_supplier(conn: &Connection, id: i64) -> Result<Supplier> {
    let mut stmt = conn.prepare("SELECT id, name, code, contact_person, phone, email, address, city, province, country, postal_code, tax_id, bank_name, bank_account, rating, status, notes, created_at, updated_at FROM suppliers WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(Supplier {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            contact_person: row.get(3)?,
            phone: row.get(4)?,
            email: row.get(5)?,
            address: row.get(6)?,
            city: row.get(7)?,
            province: row.get(8)?,
            country: row.get(9)?,
            postal_code: row.get(10)?,
            tax_id: row.get(11)?,
            bank_name: row.get(12)?,
            bank_account: row.get(13)?,
            rating: row.get(14)?,
            status: row.get(15)?,
            notes: row.get(16)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(17)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(18)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_suppliers(conn: &Connection, limit: i64, offset: i64, status: Option<String>, search: Option<String>) -> Result<Vec<Supplier>> {
    let mut where_clauses = vec![];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(s) = status {
        where_clauses.push("status = ?".to_string());
        sql_params.push(Box::new(s));
    }
    
    if let Some(srch) = search {
        where_clauses.push("(name LIKE ? OR code LIKE ? OR contact_person LIKE ?)".to_string());
        let search_pattern = format!("%{}%", srch);
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern));
    }
    
    let where_clause = if where_clauses.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_clauses.join(" AND "))
    };
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let query = format!(
        "SELECT id, name, code, contact_person, phone, email, address, city, province, country, postal_code, tax_id, bank_name, bank_account, rating, status, notes, created_at, updated_at 
         FROM suppliers {} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let suppliers = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(Supplier {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            contact_person: row.get(3)?,
            phone: row.get(4)?,
            email: row.get(5)?,
            address: row.get(6)?,
            city: row.get(7)?,
            province: row.get(8)?,
            country: row.get(9)?,
            postal_code: row.get(10)?,
            tax_id: row.get(11)?,
            bank_name: row.get(12)?,
            bank_account: row.get(13)?,
            rating: row.get(14)?,
            status: row.get(15)?,
            notes: row.get(16)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(17)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(18)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    suppliers.collect()
}

pub fn update_supplier(conn: &Connection, id: i64, input: SupplierUpdateInput) -> Result<Supplier> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    macro_rules! add_update {
        ($field:expr, $val:expr) => {
            if let Some(v) = $val {
                updates.push($field);
                sql_params.push(Box::new(v));
            }
        };
    }
    
    add_update!("name = ?", input.name);
    add_update!("code = ?", input.code);
    add_update!("contact_person = ?", input.contact_person);
    add_update!("phone = ?", input.phone);
    add_update!("email = ?", input.email);
    add_update!("address = ?", input.address);
    add_update!("city = ?", input.city);
    add_update!("province = ?", input.province);
    add_update!("country = ?", input.country);
    add_update!("postal_code = ?", input.postal_code);
    add_update!("tax_id = ?", input.tax_id);
    add_update!("bank_name = ?", input.bank_name);
    add_update!("bank_account = ?", input.bank_account);
    add_update!("rating = ?", input.rating);
    add_update!("status = ?", input.status);
    add_update!("notes = ?", input.notes);
    
    if updates.is_empty() {
        return get_supplier(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE suppliers SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_supplier(conn, id)
}

pub fn delete_supplier(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM suppliers WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 销售订单 CRUD ====================

fn generate_order_no(conn: &Connection, prefix: &str) -> Result<String> {
    let today = Utc::now().format("%Y%m%d").to_string();
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM sales_orders WHERE order_no LIKE ?")?;
    let pattern = format!("{}{}%", prefix, today);
    let count: i64 = stmt.query_row(params![pattern], |row| row.get(0))?;
    Ok(format!("{}{}{:04}", prefix, today, count + 1))
}

pub fn create_sales_order(conn: &Connection, input: SalesOrderCreateInput) -> Result<SalesOrder> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let order_no = generate_order_no(conn, "SO")?;
    
    // 计算订单金额
    let mut subtotal = 0.0;
    for item in &input.items {
        let item_subtotal = item.unit_price * item.quantity as f64;
        let discount = item.discount.unwrap_or(0.0);
        let tax_rate = item.tax_rate.unwrap_or(0.0);
        let item_tax = (item_subtotal - discount) * tax_rate;
        subtotal += item_subtotal - discount + item_tax;
    }
    
    let tax_rate = input.tax_rate.unwrap_or(0.0);
    let discount_amount = input.discount_amount.unwrap_or(0.0);
    let shipping_fee = input.shipping_fee.unwrap_or(0.0);
    let tax_amount = (subtotal - discount_amount) * tax_rate;
    let total_amount = subtotal - discount_amount + tax_amount + shipping_fee;
    
    let required_date = input.required_date.and_then(|d| DateTime::parse_from_rfc3339(&d).ok()).map(|d| d.with_timezone(&Utc));
    
    conn.execute(
        "INSERT INTO sales_orders (order_no, customer_id, order_date, required_date, status, payment_status, warehouse_id, sales_rep_id, subtotal, tax_rate, tax_amount, discount_amount, shipping_fee, total_amount, paid_amount, shipping_address, shipping_city, shipping_province, shipping_country, shipping_postal_code, notes, internal_notes, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, 'pending', 'unpaid', ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, 0, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?20)",
        params![
            order_no,
            input.customer_id,
            now_str,
            required_date.as_ref().map(|d| d.to_rfc3339()),
            input.warehouse_id,
            input.sales_rep_id,
            subtotal,
            tax_rate,
            tax_amount,
            discount_amount,
            shipping_fee,
            total_amount,
            input.shipping_address,
            input.shipping_city,
            input.shipping_province,
            input.shipping_country.unwrap_or_else(|| "中国".to_string()),
            input.shipping_postal_code,
            input.notes,
            input.internal_notes,
            now_str,
        ],
    )?;
    
    let order_id = conn.last_insert_rowid();
    
    // 插入订单明细
    for item in &input.items {
        let product = crate::product_commands::get_product(conn, item.product_id)?;
        let item_subtotal = item.unit_price * item.quantity as f64;
        let discount = item.discount.unwrap_or(0.0);
        let tax_rate = item.tax_rate.unwrap_or(0.0);
        let item_tax = (item_subtotal - discount) * tax_rate;
        let item_total = item_subtotal - discount + item_tax;
        
        conn.execute(
            "INSERT INTO sales_order_items (order_id, product_id, sku, product_name, quantity, unit_price, discount, tax_rate, tax_amount, subtotal, total_amount, notes) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![
                order_id,
                item.product_id,
                product.sku,
                product.name,
                item.quantity,
                item.unit_price,
                discount,
                tax_rate,
                item_tax,
                item_subtotal,
                item_total,
                item.notes,
            ],
        )?;
    }
    
    get_sales_order(conn, order_id)
}

pub fn get_sales_order(conn: &Connection, id: i64) -> Result<SalesOrder> {
    let mut stmt = conn.prepare("SELECT id, order_no, customer_id, order_date, required_date, shipped_date, status, payment_status, warehouse_id, sales_rep_id, subtotal, tax_rate, tax_amount, discount_amount, shipping_fee, total_amount, paid_amount, shipping_address, shipping_city, shipping_province, shipping_country, shipping_postal_code, notes, internal_notes, created_at, updated_at FROM sales_orders WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(SalesOrder {
            id: row.get(0)?,
            order_no: row.get(1)?,
            customer_id: row.get(2)?,
            order_date: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?).unwrap().with_timezone(&Utc),
            required_date: row.get::<_, Option<String>>(4)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            shipped_date: row.get::<_, Option<String>>(5)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            status: row.get(6)?,
            payment_status: row.get(7)?,
            warehouse_id: row.get(8)?,
            sales_rep_id: row.get(9)?,
            subtotal: row.get(10)?,
            tax_rate: row.get(11)?,
            tax_amount: row.get(12)?,
            discount_amount: row.get(13)?,
            shipping_fee: row.get(14)?,
            total_amount: row.get(15)?,
            paid_amount: row.get(16)?,
            shipping_address: row.get(17)?,
            shipping_city: row.get(18)?,
            shipping_province: row.get(19)?,
            shipping_country: row.get(20)?,
            shipping_postal_code: row.get(21)?,
            notes: row.get(22)?,
            internal_notes: row.get(23)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(24)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(25)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_sales_orders(conn: &Connection, params: SalesOrderListParams) -> Result<Vec<SalesOrder>> {
    let mut where_clauses = vec![];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(cid) = params.customer_id {
        where_clauses.push("customer_id = ?".to_string());
        sql_params.push(Box::new(cid));
    }
    
    if let Some(s) = params.status {
        where_clauses.push("status = ?".to_string());
        sql_params.push(Box::new(s));
    }
    
    if let Some(ps) = params.payment_status {
        where_clauses.push("payment_status = ?".to_string());
        sql_params.push(Box::new(ps));
    }
    
    if let Some(from) = params.date_from {
        where_clauses.push("order_date >= ?".to_string());
        sql_params.push(Box::new(from));
    }
    
    if let Some(to) = params.date_to {
        where_clauses.push("order_date <= ?".to_string());
        sql_params.push(Box::new(to));
    }
    
    if let Some(srch) = params.search {
        where_clauses.push("(order_no LIKE ? OR shipping_address LIKE ?)".to_string());
        let search_pattern = format!("%{}%", srch);
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern));
    }
    
    let where_clause = if where_clauses.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_clauses.join(" AND "))
    };
    
    sql_params.push(Box::new(params.limit));
    sql_params.push(Box::new(params.offset));
    
    let query = format!(
        "SELECT id, order_no, customer_id, order_date, required_date, shipped_date, status, payment_status, warehouse_id, sales_rep_id, subtotal, tax_rate, tax_amount, discount_amount, shipping_fee, total_amount, paid_amount, shipping_address, shipping_city, shipping_province, shipping_country, shipping_postal_code, notes, internal_notes, created_at, updated_at 
         FROM sales_orders {} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let orders = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(SalesOrder {
            id: row.get(0)?,
            order_no: row.get(1)?,
            customer_id: row.get(2)?,
            order_date: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?).unwrap().with_timezone(&Utc),
            required_date: row.get::<_, Option<String>>(4)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            shipped_date: row.get::<_, Option<String>>(5)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            status: row.get(6)?,
            payment_status: row.get(7)?,
            warehouse_id: row.get(8)?,
            sales_rep_id: row.get(9)?,
            subtotal: row.get(10)?,
            tax_rate: row.get(11)?,
            tax_amount: row.get(12)?,
            discount_amount: row.get(13)?,
            shipping_fee: row.get(14)?,
            total_amount: row.get(15)?,
            paid_amount: row.get(16)?,
            shipping_address: row.get(17)?,
            shipping_city: row.get(18)?,
            shipping_province: row.get(19)?,
            shipping_country: row.get(20)?,
            shipping_postal_code: row.get(21)?,
            notes: row.get(22)?,
            internal_notes: row.get(23)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(24)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(25)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    orders.collect()
}

pub fn update_sales_order(conn: &Connection, id: i64, input: SalesOrderUpdateInput) -> Result<SalesOrder> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    macro_rules! add_update {
        ($field:expr, $val:expr) => {
            if let Some(v) = $val {
                updates.push($field);
                sql_params.push(Box::new(v));
            }
        };
    }
    
    add_update!("required_date = ?", input.required_date);
    add_update!("status = ?", input.status);
    add_update!("payment_status = ?", input.payment_status);
    add_update!("warehouse_id = ?", input.warehouse_id);
    add_update!("sales_rep_id = ?", input.sales_rep_id);
    add_update!("discount_amount = ?", input.discount_amount);
    add_update!("shipping_fee = ?", input.shipping_fee);
    add_update!("shipping_address = ?", input.shipping_address);
    add_update!("shipping_city = ?", input.shipping_city);
    add_update!("shipping_province = ?", input.shipping_province);
    add_update!("shipping_postal_code = ?", input.shipping_postal_code);
    add_update!("notes = ?", input.notes);
    add_update!("internal_notes = ?", input.internal_notes);
    
    if updates.is_empty() {
        return get_sales_order(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE sales_orders SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_sales_order(conn, id)
}

pub fn delete_sales_order(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM sales_orders WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

pub fn get_sales_order_items(conn: &Connection, order_id: i64) -> Result<Vec<SalesOrderItem>> {
    let mut stmt = conn.prepare("SELECT id, order_id, product_id, sku, product_name, quantity, unit_price, discount, tax_rate, tax_amount, subtotal, total_amount, shipped_quantity, returned_quantity, notes, created_at FROM sales_order_items WHERE order_id = ?1 ORDER BY id")?;
    
    let items = stmt.query_map(params![order_id], |row| {
        Ok(SalesOrderItem {
            id: row.get(0)?,
            order_id: row.get(1)?,
            product_id: row.get(2)?,
            sku: row.get(3)?,
            product_name: row.get(4)?,
            quantity: row.get(5)?,
            unit_price: row.get(6)?,
            discount: row.get(7)?,
            tax_rate: row.get(8)?,
            tax_amount: row.get(9)?,
            subtotal: row.get(10)?,
            total_amount: row.get(11)?,
            shipped_quantity: row.get(12)?,
            returned_quantity: row.get(13)?,
            notes: row.get(14)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(15)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    items.collect()
}

// ==================== 采购订单 CRUD ====================

fn generate_purchase_order_no(conn: &Connection, prefix: &str) -> Result<String> {
    let today = Utc::now().format("%Y%m%d").to_string();
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM purchase_orders WHERE order_no LIKE ?")?;
    let pattern = format!("{}{}%", prefix, today);
    let count: i64 = stmt.query_row(params![pattern], |row| row.get(0))?;
    Ok(format!("{}{}{:04}", prefix, today, count + 1))
}

pub fn create_purchase_order(conn: &Connection, input: PurchaseOrderCreateInput) -> Result<PurchaseOrder> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let order_no = generate_purchase_order_no(conn, "PO")?;
    
    // 计算订单金额
    let mut subtotal = 0.0;
    for item in &input.items {
        let item_subtotal = item.unit_price * item.quantity as f64;
        let discount = item.discount.unwrap_or(0.0);
        let tax_rate = item.tax_rate.unwrap_or(0.0);
        let item_tax = (item_subtotal - discount) * tax_rate;
        subtotal += item_subtotal - discount + item_tax;
    }
    
    let tax_rate = input.tax_rate.unwrap_or(0.0);
    let discount_amount = input.discount_amount.unwrap_or(0.0);
    let shipping_fee = input.shipping_fee.unwrap_or(0.0);
    let tax_amount = (subtotal - discount_amount) * tax_rate;
    let total_amount = subtotal - discount_amount + tax_amount + shipping_fee;
    
    let required_date = input.required_date.and_then(|d| DateTime::parse_from_rfc3339(&d).ok()).map(|d| d.with_timezone(&Utc));
    
    conn.execute(
        "INSERT INTO purchase_orders (order_no, supplier_id, order_date, required_date, status, payment_status, warehouse_id, purchaser_id, subtotal, tax_rate, tax_amount, discount_amount, shipping_fee, total_amount, paid_amount, shipping_address, notes, internal_notes, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, 'pending', 'unpaid', ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, 0, ?13, ?14, ?15, ?16, ?16)",
        params![
            order_no,
            input.supplier_id,
            now_str,
            required_date.as_ref().map(|d| d.to_rfc3339()),
            input.warehouse_id,
            input.purchaser_id,
            subtotal,
            tax_rate,
            tax_amount,
            discount_amount,
            shipping_fee,
            total_amount,
            input.shipping_address,
            input.notes,
            input.internal_notes,
            now_str,
        ],
    )?;
    
    let order_id = conn.last_insert_rowid();
    
    // 插入订单明细
    for item in &input.items {
        let product = crate::product_commands::get_product(conn, item.product_id)?;
        let item_subtotal = item.unit_price * item.quantity as f64;
        let discount = item.discount.unwrap_or(0.0);
        let tax_rate = item.tax_rate.unwrap_or(0.0);
        let item_tax = (item_subtotal - discount) * tax_rate;
        let item_total = item_subtotal - discount + item_tax;
        
        conn.execute(
            "INSERT INTO purchase_order_items (order_id, product_id, sku, product_name, quantity, unit_price, discount, tax_rate, tax_amount, subtotal, total_amount, notes) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![
                order_id,
                item.product_id,
                product.sku,
                product.name,
                item.quantity,
                item.unit_price,
                discount,
                tax_rate,
                item_tax,
                item_subtotal,
                item_total,
                item.notes,
            ],
        )?;
    }
    
    get_purchase_order(conn, order_id)
}

pub fn get_purchase_order(conn: &Connection, id: i64) -> Result<PurchaseOrder> {
    let mut stmt = conn.prepare("SELECT id, order_no, supplier_id, order_date, required_date, received_date, status, payment_status, warehouse_id, purchaser_id, subtotal, tax_rate, tax_amount, discount_amount, shipping_fee, total_amount, paid_amount, shipping_address, notes, internal_notes, created_at, updated_at FROM purchase_orders WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(PurchaseOrder {
            id: row.get(0)?,
            order_no: row.get(1)?,
            supplier_id: row.get(2)?,
            order_date: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?).unwrap().with_timezone(&Utc),
            required_date: row.get::<_, Option<String>>(4)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            received_date: row.get::<_, Option<String>>(5)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            status: row.get(6)?,
            payment_status: row.get(7)?,
            warehouse_id: row.get(8)?,
            purchaser_id: row.get(9)?,
            subtotal: row.get(10)?,
            tax_rate: row.get(11)?,
            tax_amount: row.get(12)?,
            discount_amount: row.get(13)?,
            shipping_fee: row.get(14)?,
            total_amount: row.get(15)?,
            paid_amount: row.get(16)?,
            shipping_address: row.get(17)?,
            notes: row.get(18)?,
            internal_notes: row.get(19)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(20)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(21)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_purchase_orders(conn: &Connection, params: PurchaseOrderListParams) -> Result<Vec<PurchaseOrder>> {
    let mut where_clauses = vec![];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(sid) = params.supplier_id {
        where_clauses.push("supplier_id = ?".to_string());
        sql_params.push(Box::new(sid));
    }
    
    if let Some(s) = params.status {
        where_clauses.push("status = ?".to_string());
        sql_params.push(Box::new(s));
    }
    
    if let Some(ps) = params.payment_status {
        where_clauses.push("payment_status = ?".to_string());
        sql_params.push(Box::new(ps));
    }
    
    if let Some(from) = params.date_from {
        where_clauses.push("order_date >= ?".to_string());
        sql_params.push(Box::new(from));
    }
    
    if let Some(to) = params.date_to {
        where_clauses.push("order_date <= ?".to_string());
        sql_params.push(Box::new(to));
    }
    
    if let Some(srch) = params.search {
        where_clauses.push("(order_no LIKE ? OR shipping_address LIKE ?)".to_string());
        let search_pattern = format!("%{}%", srch);
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern));
    }
    
    let where_clause = if where_clauses.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", where_clauses.join(" AND "))
    };
    
    sql_params.push(Box::new(params.limit));
    sql_params.push(Box::new(params.offset));
    
    let query = format!(
        "SELECT id, order_no, supplier_id, order_date, required_date, received_date, status, payment_status, warehouse_id, purchaser_id, subtotal, tax_rate, tax_amount, discount_amount, shipping_fee, total_amount, paid_amount, shipping_address, notes, internal_notes, created_at, updated_at 
         FROM purchase_orders {} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let orders = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(PurchaseOrder {
            id: row.get(0)?,
            order_no: row.get(1)?,
            supplier_id: row.get(2)?,
            order_date: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?).unwrap().with_timezone(&Utc),
            required_date: row.get::<_, Option<String>>(4)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            received_date: row.get::<_, Option<String>>(5)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            status: row.get(6)?,
            payment_status: row.get(7)?,
            warehouse_id: row.get(8)?,
            purchaser_id: row.get(9)?,
            subtotal: row.get(10)?,
            tax_rate: row.get(11)?,
            tax_amount: row.get(12)?,
            discount_amount: row.get(13)?,
            shipping_fee: row.get(14)?,
            total_amount: row.get(15)?,
            paid_amount: row.get(16)?,
            shipping_address: row.get(17)?,
            notes: row.get(18)?,
            internal_notes: row.get(19)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(20)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(21)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    orders.collect()
}

pub fn update_purchase_order(conn: &Connection, id: i64, input: PurchaseOrderUpdateInput) -> Result<PurchaseOrder> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    macro_rules! add_update {
        ($field:expr, $val:expr) => {
            if let Some(v) = $val {
                updates.push($field);
                sql_params.push(Box::new(v));
            }
        };
    }
    
    add_update!("required_date = ?", input.required_date);
    add_update!("status = ?", input.status);
    add_update!("payment_status = ?", input.payment_status);
    add_update!("warehouse_id = ?", input.warehouse_id);
    add_update!("purchaser_id = ?", input.purchaser_id);
    add_update!("discount_amount = ?", input.discount_amount);
    add_update!("shipping_fee = ?", input.shipping_fee);
    add_update!("shipping_address = ?", input.shipping_address);
    add_update!("notes = ?", input.notes);
    add_update!("internal_notes = ?", input.internal_notes);
    
    if updates.is_empty() {
        return get_purchase_order(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
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

pub fn get_purchase_order_items(conn: &Connection, order_id: i64) -> Result<Vec<PurchaseOrderItem>> {
    let mut stmt = conn.prepare("SELECT id, order_id, product_id, sku, product_name, quantity, unit_price, discount, tax_rate, tax_amount, subtotal, total_amount, received_quantity, returned_quantity, notes, created_at FROM purchase_order_items WHERE order_id = ?1 ORDER BY id")?;
    
    let items = stmt.query_map(params![order_id], |row| {
        Ok(PurchaseOrderItem {
            id: row.get(0)?,
            order_id: row.get(1)?,
            product_id: row.get(2)?,
            sku: row.get(3)?,
            product_name: row.get(4)?,
            quantity: row.get(5)?,
            unit_price: row.get(6)?,
            discount: row.get(7)?,
            tax_rate: row.get(8)?,
            tax_amount: row.get(9)?,
            subtotal: row.get(10)?,
            total_amount: row.get(11)?,
            received_quantity: row.get(12)?,
            returned_quantity: row.get(13)?,
            notes: row.get(14)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(15)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    items.collect()
}

// ==================== 订单状态历史 ====================

pub fn add_order_status_history(conn: &Connection, input: OrderStatusChangeInput) -> Result<OrderStatusHistory> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO order_status_history (order_type, order_id, old_status, new_status, changed_by, change_reason, created_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            input.order_type,
            input.order_id,
            input.old_status,
            input.new_status,
            input.changed_by,
            input.change_reason,
            now.to_rfc3339(),
        ],
    )?;
    
    let history_id = conn.last_insert_rowid();
    get_order_status_history(conn, history_id)
}

pub fn get_order_status_history(conn: &Connection, id: i64) -> Result<OrderStatusHistory> {
    let mut stmt = conn.prepare("SELECT id, order_type, order_id, old_status, new_status, changed_by, change_reason, created_at FROM order_status_history WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(OrderStatusHistory {
            id: row.get(0)?,
            order_type: row.get(1)?,
            order_id: row.get(2)?,
            old_status: row.get(3)?,
            new_status: row.get(4)?,
            changed_by: row.get(5)?,
            change_reason: row.get(6)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_order_status_history(conn: &Connection, order_type: &str, order_id: i64) -> Result<Vec<OrderStatusHistory>> {
    let mut stmt = conn.prepare("SELECT id, order_type, order_id, old_status, new_status, changed_by, change_reason, created_at FROM order_status_history WHERE order_type = ?1 AND order_id = ?2 ORDER BY created_at DESC")?;
    
    let history = stmt.query_map(params![order_type, order_id], |row| {
        Ok(OrderStatusHistory {
            id: row.get(0)?,
            order_type: row.get(1)?,
            order_id: row.get(2)?,
            old_status: row.get(3)?,
            new_status: row.get(4)?,
            changed_by: row.get(5)?,
            change_reason: row.get(6)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    history.collect()
}
