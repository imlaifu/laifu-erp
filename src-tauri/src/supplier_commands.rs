// 供应商管理模块 Rust Commands
// 实现完整的 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Supplier {
    pub id: i64,
    pub code: String,
    pub name: String,
    #[serde(rename = "type")]
    pub supplier_type: String,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub contact_title: Option<String>,
    pub id_number: Option<String>,
    pub tax_id: Option<String>,
    pub bank_name: Option<String>,
    pub bank_account: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub postal_code: Option<String>,
    pub country: Option<String>,
    pub website: Option<String>,
    pub industry: Option<String>,
    pub source: Option<String>,
    pub level: String,
    pub credit_days: i64,
    pub payment_terms: Option<String>,
    pub min_order_amount: f64,
    pub delivery_lead_time: i64,
    pub quality_rating: f64,
    pub service_rating: f64,
    pub delivery_rating: f64,
    pub status: String,
    pub notes: Option<String>,
    pub owner_id: Option<i64>,
    pub parent_id: Option<i64>,
    pub tags: Vec<String>,
    pub custom_fields: Value,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierCreateInput {
    pub code: String,
    pub name: String,
    #[serde(rename = "type")]
    pub supplier_type: Option<String>,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub contact_title: Option<String>,
    pub id_number: Option<String>,
    pub tax_id: Option<String>,
    pub bank_name: Option<String>,
    pub bank_account: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub postal_code: Option<String>,
    pub country: Option<String>,
    pub website: Option<String>,
    pub industry: Option<String>,
    pub source: Option<String>,
    pub level: Option<String>,
    pub credit_days: Option<i64>,
    pub payment_terms: Option<String>,
    pub min_order_amount: Option<f64>,
    pub delivery_lead_time: Option<i64>,
    pub quality_rating: Option<f64>,
    pub service_rating: Option<f64>,
    pub delivery_rating: Option<f64>,
    pub notes: Option<String>,
    pub owner_id: Option<i64>,
    pub parent_id: Option<i64>,
    pub tags: Option<Vec<String>>,
    pub custom_fields: Option<Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierUpdateInput {
    pub code: Option<String>,
    pub name: Option<String>,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub contact_title: Option<String>,
    pub id_number: Option<String>,
    pub tax_id: Option<String>,
    pub bank_name: Option<String>,
    pub bank_account: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub postal_code: Option<String>,
    pub country: Option<String>,
    pub website: Option<String>,
    pub industry: Option<String>,
    pub source: Option<String>,
    pub level: Option<String>,
    pub credit_days: Option<i64>,
    pub payment_terms: Option<String>,
    pub min_order_amount: Option<f64>,
    pub delivery_lead_time: Option<i64>,
    pub quality_rating: Option<f64>,
    pub service_rating: Option<f64>,
    pub delivery_rating: Option<f64>,
    pub status: Option<String>,
    pub notes: Option<String>,
    pub owner_id: Option<i64>,
    pub parent_id: Option<i64>,
    pub tags: Option<Vec<String>>,
    pub custom_fields: Option<Value>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SupplierContact {
    pub id: i64,
    pub supplier_id: i64,
    pub name: String,
    pub title: Option<String>,
    pub phone: Option<String>,
    pub mobile: Option<String>,
    pub email: Option<String>,
    pub wechat: Option<String>,
    pub qq: Option<String>,
    pub is_primary: bool,
    pub notes: Option<String>,
    pub birthday: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierContactCreateInput {
    pub supplier_id: i64,
    pub name: String,
    pub title: Option<String>,
    pub phone: Option<String>,
    pub mobile: Option<String>,
    pub email: Option<String>,
    pub wechat: Option<String>,
    pub qq: Option<String>,
    pub is_primary: Option<bool>,
    pub notes: Option<String>,
    pub birthday: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierContactUpdateInput {
    pub name: Option<String>,
    pub title: Option<String>,
    pub phone: Option<String>,
    pub mobile: Option<String>,
    pub email: Option<String>,
    pub wechat: Option<String>,
    pub qq: Option<String>,
    pub is_primary: Option<bool>,
    pub notes: Option<String>,
    pub birthday: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SupplierInteraction {
    pub id: i64,
    pub supplier_id: i64,
    pub contact_id: Option<i64>,
    #[serde(rename = "type")]
    pub interaction_type: String,
    pub subject: Option<String>,
    pub content: Option<String>,
    pub result: Option<String>,
    pub follow_up_date: Option<String>,
    pub follow_up_notes: Option<String>,
    pub operator_id: Option<i64>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierInteractionCreateInput {
    pub supplier_id: i64,
    pub contact_id: Option<i64>,
    #[serde(rename = "type")]
    pub interaction_type: String,
    pub subject: Option<String>,
    pub content: Option<String>,
    pub result: Option<String>,
    pub follow_up_date: Option<String>,
    pub follow_up_notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SupplierLevel {
    pub id: i64,
    pub name: String,
    pub code: String,
    pub description: Option<String>,
    pub discount_rate: f64,
    pub credit_days: i64,
    pub min_order_amount: f64,
    pub benefits: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SupplierTag {
    pub id: i64,
    pub name: String,
    pub color: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierListParams {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub supplier_type: Option<String>,
    pub level: Option<String>,
    pub status: Option<String>,
    pub city: Option<String>,
    pub owner_id: Option<i64>,
    pub search: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierListResponse {
    pub suppliers: Vec<Supplier>,
    pub total: i64,
    pub limit: i64,
    pub offset: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SupplierEvaluation {
    pub id: i64,
    pub supplier_id: i64,
    pub evaluation_type: String,
    pub evaluation_date: String,
    pub quality_score: f64,
    pub delivery_score: f64,
    pub service_score: f64,
    pub price_score: f64,
    pub total_score: f64,
    pub evaluator_id: Option<i64>,
    pub comments: Option<String>,
    pub improvement_notes: Option<String>,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierEvaluationCreateInput {
    pub supplier_id: i64,
    pub evaluation_type: String,
    pub evaluation_date: String,
    pub quality_score: Option<f64>,
    pub delivery_score: Option<f64>,
    pub service_score: Option<f64>,
    pub price_score: Option<f64>,
    pub comments: Option<String>,
    pub improvement_notes: Option<String>,
    pub evaluator_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierEvaluationUpdateInput {
    pub quality_score: Option<f64>,
    pub delivery_score: Option<f64>,
    pub service_score: Option<f64>,
    pub price_score: Option<f64>,
    pub comments: Option<String>,
    pub improvement_notes: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierEvaluationListParams {
    pub supplier_id: Option<i64>,
    pub evaluation_type: Option<String>,
    pub status: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SupplierProduct {
    pub id: i64,
    pub supplier_id: i64,
    pub product_id: i64,
    pub product_code: Option<String>,
    pub product_name: Option<String>,
    pub unit_price: f64,
    pub currency: String,
    pub min_order_quantity: i64,
    pub lead_time: i64,
    pub is_preferred: bool,
    pub status: String,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierProductCreateInput {
    pub supplier_id: i64,
    pub product_id: i64,
    pub product_code: Option<String>,
    pub product_name: Option<String>,
    pub unit_price: Option<f64>,
    pub currency: Option<String>,
    pub min_order_quantity: Option<i64>,
    pub lead_time: Option<i64>,
    pub is_preferred: Option<bool>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SupplierProductUpdateInput {
    pub product_code: Option<String>,
    pub product_name: Option<String>,
    pub unit_price: Option<f64>,
    pub currency: Option<String>,
    pub min_order_quantity: Option<i64>,
    pub lead_time: Option<i64>,
    pub is_preferred: Option<bool>,
    pub status: Option<String>,
    pub notes: Option<String>,
}

// ==================== 供应商 CRUD ====================

pub fn create_supplier(conn: &Connection, input: SupplierCreateInput) -> Result<Supplier> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let tags_json = serde_json::to_string(&input.tags.unwrap_or_default()).unwrap_or_default();
    let custom_fields_json = serde_json::to_string(&input.custom_fields.unwrap_or(Value::Null)).unwrap_or_default();
    
    conn.execute(
        "INSERT INTO suppliers (code, name, type, contact_person, contact_phone, contact_email, 
         contact_title, id_number, tax_id, bank_name, bank_account, address, city, province, 
         postal_code, country, website, industry, source, level, credit_days, payment_terms, 
         min_order_amount, delivery_lead_time, quality_rating, service_rating, delivery_rating, 
         status, notes, owner_id, parent_id, tags, custom_fields, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, 
                 ?19, ?20, ?21, ?22, ?23, ?24, ?25, ?26, ?27, 'active', ?28, ?29, ?30, ?31, ?32, ?33, ?33)",
        params![
            input.code,
            input.name,
            input.supplier_type.unwrap_or_else(|| "company".to_string()),
            input.contact_person,
            input.contact_phone,
            input.contact_email,
            input.contact_title,
            input.id_number,
            input.tax_id,
            input.bank_name,
            input.bank_account,
            input.address,
            input.city,
            input.province,
            input.postal_code,
            input.country,
            input.website,
            input.industry,
            input.source,
            input.level.unwrap_or_else(|| "normal".to_string()),
            input.credit_days.unwrap_or(0),
            input.payment_terms,
            input.min_order_amount.unwrap_or(0.0),
            input.delivery_lead_time.unwrap_or(0),
            input.quality_rating.unwrap_or(5.0),
            input.service_rating.unwrap_or(5.0),
            input.delivery_rating.unwrap_or(5.0),
            input.notes,
            input.owner_id,
            input.parent_id,
            tags_json,
            custom_fields_json,
            now_str,
        ],
    )?;
    
    let supplier_id = conn.last_insert_rowid();
    get_supplier(conn, supplier_id)
}

pub fn get_supplier(conn: &Connection, id: i64) -> Result<Supplier> {
    let mut stmt = conn.prepare(
        "SELECT id, code, name, type, contact_person, contact_phone, contact_email, 
                contact_title, id_number, tax_id, bank_name, bank_account, address, city, 
                province, postal_code, country, website, industry, source, level, credit_days, 
                payment_terms, min_order_amount, delivery_lead_time, quality_rating, 
                service_rating, delivery_rating, status, notes, owner_id, parent_id, tags, 
                custom_fields, created_at, updated_at, deleted_at 
         FROM suppliers WHERE id = ?1 AND deleted_at IS NULL"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(Supplier {
            id: row.get(0)?,
            code: row.get(1)?,
            name: row.get(2)?,
            supplier_type: row.get(3)?,
            contact_person: row.get(4)?,
            contact_phone: row.get(5)?,
            contact_email: row.get(6)?,
            contact_title: row.get(7)?,
            id_number: row.get(8)?,
            tax_id: row.get(9)?,
            bank_name: row.get(10)?,
            bank_account: row.get(11)?,
            address: row.get(12)?,
            city: row.get(13)?,
            province: row.get(14)?,
            postal_code: row.get(15)?,
            country: row.get(16)?,
            website: row.get(17)?,
            industry: row.get(18)?,
            source: row.get(19)?,
            level: row.get(20)?,
            credit_days: row.get(21)?,
            payment_terms: row.get(22)?,
            min_order_amount: row.get(23)?,
            delivery_lead_time: row.get(24)?,
            quality_rating: row.get(25)?,
            service_rating: row.get(26)?,
            delivery_rating: row.get(27)?,
            status: row.get(28)?,
            notes: row.get(29)?,
            owner_id: row.get(30)?,
            parent_id: row.get(31)?,
            tags: serde_json::from_str(&row.get::<_, String>(32)?).unwrap_or_default(),
            custom_fields: serde_json::from_str(&row.get::<_, String>(33)?).unwrap_or(Value::Null),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(34)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(35)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(36)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })
}

pub fn list_suppliers(conn: &Connection, params: SupplierListParams) -> Result<SupplierListResponse> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.offset.unwrap_or(0);
    
    let mut where_clauses = vec!["deleted_at IS NULL"];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(supplier_type) = params.supplier_type {
        where_clauses.push("type = ?");
        sql_params.push(Box::new(supplier_type));
    }
    if let Some(level) = params.level {
        where_clauses.push("level = ?");
        sql_params.push(Box::new(level));
    }
    if let Some(status) = params.status {
        where_clauses.push("status = ?");
        sql_params.push(Box::new(status));
    }
    if let Some(city) = params.city {
        where_clauses.push("city = ?");
        sql_params.push(Box::new(city));
    }
    if let Some(owner_id) = params.owner_id {
        where_clauses.push("owner_id = ?");
        sql_params.push(Box::new(owner_id));
    }
    if let Some(search) = params.search {
        where_clauses.push("(name LIKE ? OR code LIKE ? OR contact_person LIKE ? OR contact_phone LIKE ?)");
        let search_pattern = format!("%{}%", search);
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern));
    }
    
    let where_clause = where_clauses.join(" AND ");
    
    let count_sql = format!("SELECT COUNT(*) FROM suppliers WHERE {}", where_clause);
    let total: i64 = conn.prepare(&count_sql)?.query_row(
        rusqlite::params_from_iter(sql_params.iter().map(|b| b.as_ref())),
        |row| row.get(0),
    )?;
    
    let data_sql = format!(
        "SELECT id, code, name, type, contact_person, contact_phone, contact_email, 
                contact_title, id_number, tax_id, bank_name, bank_account, address, city, 
                province, postal_code, country, website, industry, source, level, credit_days, 
                payment_terms, min_order_amount, delivery_lead_time, quality_rating, 
                service_rating, delivery_rating, status, notes, owner_id, parent_id, tags, 
                custom_fields, created_at, updated_at, deleted_at 
         FROM suppliers WHERE {} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let mut stmt = conn.prepare(&data_sql)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let suppliers = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(Supplier {
            id: row.get(0)?,
            code: row.get(1)?,
            name: row.get(2)?,
            supplier_type: row.get(3)?,
            contact_person: row.get(4)?,
            contact_phone: row.get(5)?,
            contact_email: row.get(6)?,
            contact_title: row.get(7)?,
            id_number: row.get(8)?,
            tax_id: row.get(9)?,
            bank_name: row.get(10)?,
            bank_account: row.get(11)?,
            address: row.get(12)?,
            city: row.get(13)?,
            province: row.get(14)?,
            postal_code: row.get(15)?,
            country: row.get(16)?,
            website: row.get(17)?,
            industry: row.get(18)?,
            source: row.get(19)?,
            level: row.get(20)?,
            credit_days: row.get(21)?,
            payment_terms: row.get(22)?,
            min_order_amount: row.get(23)?,
            delivery_lead_time: row.get(24)?,
            quality_rating: row.get(25)?,
            service_rating: row.get(26)?,
            delivery_rating: row.get(27)?,
            status: row.get(28)?,
            notes: row.get(29)?,
            owner_id: row.get(30)?,
            parent_id: row.get(31)?,
            tags: serde_json::from_str(&row.get::<_, String>(32)?).unwrap_or_default(),
            custom_fields: serde_json::from_str(&row.get::<_, String>(33)?).unwrap_or(Value::Null),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(34)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(35)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(36)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    Ok(SupplierListResponse {
        suppliers: suppliers.collect::<Result<Vec<_>, _>>()?,
        total,
        limit,
        offset,
    })
}

pub fn update_supplier(conn: &Connection, id: i64, input: SupplierUpdateInput) -> Result<Supplier> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    macro_rules! add_update {
        ($field:expr, $value:expr) => {
            if $value.is_some() {
                updates.push(concat!($field, " = ?"));
                sql_params.push(Box::new($value.unwrap()));
            }
        };
    }
    
    add_update!("code", input.code);
    add_update!("name", input.name);
    add_update!("contact_person", input.contact_person);
    add_update!("contact_phone", input.contact_phone);
    add_update!("contact_email", input.contact_email);
    add_update!("contact_title", input.contact_title);
    add_update!("id_number", input.id_number);
    add_update!("tax_id", input.tax_id);
    add_update!("bank_name", input.bank_name);
    add_update!("bank_account", input.bank_account);
    add_update!("address", input.address);
    add_update!("city", input.city);
    add_update!("province", input.province);
    add_update!("postal_code", input.postal_code);
    add_update!("country", input.country);
    add_update!("website", input.website);
    add_update!("industry", input.industry);
    add_update!("source", input.source);
    add_update!("level", input.level);
    add_update!("credit_days", input.credit_days);
    add_update!("payment_terms", input.payment_terms);
    add_update!("min_order_amount", input.min_order_amount);
    add_update!("delivery_lead_time", input.delivery_lead_time);
    add_update!("quality_rating", input.quality_rating);
    add_update!("service_rating", input.service_rating);
    add_update!("delivery_rating", input.delivery_rating);
    add_update!("status", input.status);
    add_update!("notes", input.notes);
    add_update!("owner_id", input.owner_id);
    add_update!("parent_id", input.parent_id);
    
    if let Some(tags) = input.tags {
        updates.push("tags = ?");
        sql_params.push(Box::new(serde_json::to_string(&tags).unwrap_or_default()));
    }
    if let Some(custom_fields) = input.custom_fields {
        updates.push("custom_fields = ?");
        sql_params.push(Box::new(serde_json::to_string(&custom_fields).unwrap_or_default()));
    }
    
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
    let now = Utc::now();
    let affected = conn.execute(
        "UPDATE suppliers SET deleted_at = ?, updated_at = ? WHERE id = ?",
        params![now.to_rfc3339(), now.to_rfc3339(), id],
    )?;
    Ok(affected > 0)
}

// ==================== 供应商联系人 CRUD ====================

pub fn create_supplier_contact(conn: &Connection, input: SupplierContactCreateInput) -> Result<SupplierContact> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    
    conn.execute(
        "INSERT INTO supplier_contacts (supplier_id, name, title, phone, mobile, email, 
         wechat, qq, is_primary, notes, birthday, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?12)",
        params![
            input.supplier_id,
            input.name,
            input.title,
            input.phone,
            input.mobile,
            input.email,
            input.wechat,
            input.qq,
            input.is_primary.unwrap_or(false) as i64,
            input.notes,
            input.birthday,
            now_str,
        ],
    )?;
    
    let contact_id = conn.last_insert_rowid();
    get_supplier_contact(conn, contact_id)
}

pub fn get_supplier_contact(conn: &Connection, id: i64) -> Result<SupplierContact> {
    let mut stmt = conn.prepare(
        "SELECT id, supplier_id, name, title, phone, mobile, email, wechat, qq, 
                is_primary, notes, birthday, created_at, updated_at, deleted_at 
         FROM supplier_contacts WHERE id = ?1 AND deleted_at IS NULL"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(SupplierContact {
            id: row.get(0)?,
            supplier_id: row.get(1)?,
            name: row.get(2)?,
            title: row.get(3)?,
            phone: row.get(4)?,
            mobile: row.get(5)?,
            email: row.get(6)?,
            wechat: row.get(7)?,
            qq: row.get(8)?,
            is_primary: row.get::<_, i64>(9)? != 0,
            notes: row.get(10)?,
            birthday: row.get(11)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(14)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })
}

pub fn list_supplier_contacts(conn: &Connection, supplier_id: i64) -> Result<Vec<SupplierContact>> {
    let mut stmt = conn.prepare(
        "SELECT id, supplier_id, name, title, phone, mobile, email, wechat, qq, 
                is_primary, notes, birthday, created_at, updated_at, deleted_at 
         FROM supplier_contacts WHERE supplier_id = ?1 AND deleted_at IS NULL ORDER BY is_primary DESC, created_at DESC"
    )?;
    
    let contacts = stmt.query_map(params![supplier_id], |row| {
        Ok(SupplierContact {
            id: row.get(0)?,
            supplier_id: row.get(1)?,
            name: row.get(2)?,
            title: row.get(3)?,
            phone: row.get(4)?,
            mobile: row.get(5)?,
            email: row.get(6)?,
            wechat: row.get(7)?,
            qq: row.get(8)?,
            is_primary: row.get::<_, i64>(9)? != 0,
            notes: row.get(10)?,
            birthday: row.get(11)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(14)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    contacts.collect()
}

pub fn update_supplier_contact(conn: &Connection, id: i64, input: SupplierContactUpdateInput) -> Result<SupplierContact> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    macro_rules! add_update {
        ($field:expr, $value:expr) => {
            if $value.is_some() {
                updates.push(concat!($field, " = ?"));
                sql_params.push(Box::new($value.unwrap()));
            }
        };
    }
    
    add_update!("name", input.name);
    add_update!("title", input.title);
    add_update!("phone", input.phone);
    add_update!("mobile", input.mobile);
    add_update!("email", input.email);
    add_update!("wechat", input.wechat);
    add_update!("qq", input.qq);
    add_update!("is_primary", input.is_primary.map(|v| v as i64));
    add_update!("notes", input.notes);
    add_update!("birthday", input.birthday);
    
    if updates.is_empty() {
        return get_supplier_contact(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE supplier_contacts SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_supplier_contact(conn, id)
}

pub fn delete_supplier_contact(conn: &Connection, id: i64) -> Result<bool> {
    let now = Utc::now();
    let affected = conn.execute(
        "UPDATE supplier_contacts SET deleted_at = ?, updated_at = ? WHERE id = ?",
        params![now.to_rfc3339(), now.to_rfc3339(), id],
    )?;
    Ok(affected > 0)
}

// ==================== 供应商联系记录 CRUD ====================

pub fn create_supplier_interaction(conn: &Connection, input: SupplierInteractionCreateInput) -> Result<SupplierInteraction> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO supplier_interactions (supplier_id, contact_id, interaction_type, 
         subject, content, result, follow_up_date, follow_up_notes, operator_id, created_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            input.supplier_id,
            input.contact_id,
            input.interaction_type,
            input.subject,
            input.content,
            input.result,
            input.follow_up_date,
            input.follow_up_notes,
            input.operator_id,
            now.to_rfc3339(),
        ],
    )?;
    
    let interaction_id = conn.last_insert_rowid();
    get_supplier_interaction(conn, interaction_id)
}

pub fn get_supplier_interaction(conn: &Connection, id: i64) -> Result<SupplierInteraction> {
    let mut stmt = conn.prepare(
        "SELECT id, supplier_id, contact_id, interaction_type, subject, content, 
                result, follow_up_date, follow_up_notes, operator_id, created_at 
         FROM supplier_interactions WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(SupplierInteraction {
            id: row.get(0)?,
            supplier_id: row.get(1)?,
            contact_id: row.get(2)?,
            interaction_type: row.get(3)?,
            subject: row.get(4)?,
            content: row.get(5)?,
            result: row.get(6)?,
            follow_up_date: row.get(7)?,
            follow_up_notes: row.get(8)?,
            operator_id: row.get(9)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_supplier_interactions(conn: &Connection, supplier_id: i64, limit: i64, offset: i64) -> Result<Vec<SupplierInteraction>> {
    let mut stmt = conn.prepare(
        "SELECT id, supplier_id, contact_id, interaction_type, subject, content, 
                result, follow_up_date, follow_up_notes, operator_id, created_at 
         FROM supplier_interactions WHERE supplier_id = ?1 ORDER BY created_at DESC LIMIT ?2 OFFSET ?3"
    )?;
    
    let interactions = stmt.query_map(params![supplier_id, limit, offset], |row| {
        Ok(SupplierInteraction {
            id: row.get(0)?,
            supplier_id: row.get(1)?,
            contact_id: row.get(2)?,
            interaction_type: row.get(3)?,
            subject: row.get(4)?,
            content: row.get(5)?,
            result: row.get(6)?,
            follow_up_date: row.get(7)?,
            follow_up_notes: row.get(8)?,
            operator_id: row.get(9)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    interactions.collect()
}

// ==================== 供应商分级 CRUD ====================

pub fn list_supplier_levels(conn: &Connection) -> Result<Vec<SupplierLevel>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, code, description, discount_rate, credit_days, 
                min_order_amount, benefits, created_at, updated_at 
         FROM supplier_levels ORDER BY credit_days DESC"
    )?;
    
    let levels = stmt.query_map([], |row| {
        Ok(SupplierLevel {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            description: row.get(3)?,
            discount_rate: row.get(4)?,
            credit_days: row.get(5)?,
            min_order_amount: row.get(6)?,
            benefits: serde_json::from_str(&row.get::<_, String>(7)?).unwrap_or_default(),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    levels.collect()
}

// ==================== 供应商标签 CRUD ====================

pub fn list_supplier_tags(conn: &Connection) -> Result<Vec<SupplierTag>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, color, description, created_at FROM supplier_tags ORDER BY name"
    )?;
    
    let tags = stmt.query_map([], |row| {
        Ok(SupplierTag {
            id: row.get(0)?,
            name: row.get(1)?,
            color: row.get(2)?,
            description: row.get(3)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    tags.collect()
}

pub fn create_supplier_tag(conn: &Connection, name: &str, color: Option<String>, description: Option<String>) -> Result<SupplierTag> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO supplier_tags (name, color, description, created_at) VALUES (?1, ?2, ?3, ?4)",
        params![name, color.unwrap_or_else(|| "#1890ff".to_string()), description, now.to_rfc3339()],
    )?;
    
    let tag_id = conn.last_insert_rowid();
    
    let mut stmt = conn.prepare("SELECT id, name, color, description, created_at FROM supplier_tags WHERE id = ?1")?;
    stmt.query_row(params![tag_id], |row| {
        Ok(SupplierTag {
            id: row.get(0)?,
            name: row.get(1)?,
            color: row.get(2)?,
            description: row.get(3)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?).unwrap().with_timezone(&Utc),
        })
    })
}

// ==================== 供应商评估 CRUD ====================

pub fn create_supplier_evaluation(conn: &Connection, input: SupplierEvaluationCreateInput) -> Result<SupplierEvaluation> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    
    let quality = input.quality_score.unwrap_or(0.0);
    let delivery = input.delivery_score.unwrap_or(0.0);
    let service = input.service_score.unwrap_or(0.0);
    let price = input.price_score.unwrap_or(0.0);
    let total = (quality + delivery + service + price) / 4.0;
    
    conn.execute(
        "INSERT INTO supplier_evaluations (supplier_id, evaluation_type, evaluation_date, 
         quality_score, delivery_score, service_score, price_score, total_score, 
         evaluator_id, comments, improvement_notes, status, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, 'pending', ?12, ?12)",
        params![
            input.supplier_id,
            input.evaluation_type,
            input.evaluation_date,
            quality,
            delivery,
            service,
            price,
            total,
            input.evaluator_id,
            input.comments,
            input.improvement_notes,
            now_str,
        ],
    )?;
    
    let eval_id = conn.last_insert_rowid();
    get_supplier_evaluation(conn, eval_id)
}

pub fn get_supplier_evaluation(conn: &Connection, id: i64) -> Result<SupplierEvaluation> {
    let mut stmt = conn.prepare(
        "SELECT id, supplier_id, evaluation_type, evaluation_date, quality_score, 
                delivery_score, service_score, price_score, total_score, evaluator_id, 
                comments, improvement_notes, status, created_at, updated_at 
         FROM supplier_evaluations WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(SupplierEvaluation {
            id: row.get(0)?,
            supplier_id: row.get(1)?,
            evaluation_type: row.get(2)?,
            evaluation_date: row.get(3)?,
            quality_score: row.get(4)?,
            delivery_score: row.get(5)?,
            service_score: row.get(6)?,
            price_score: row.get(7)?,
            total_score: row.get(8)?,
            evaluator_id: row.get(9)?,
            comments: row.get(10)?,
            improvement_notes: row.get(11)?,
            status: row.get(12)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(14)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_supplier_evaluations(conn: &Connection, params: SupplierEvaluationListParams) -> Result<Vec<SupplierEvaluation>> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.offset.unwrap_or(0);
    
    let mut where_clauses = vec!["1=1"];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(supplier_id) = params.supplier_id {
        where_clauses.push("supplier_id = ?");
        sql_params.push(Box::new(supplier_id));
    }
    if let Some(eval_type) = params.evaluation_type {
        where_clauses.push("evaluation_type = ?");
        sql_params.push(Box::new(eval_type));
    }
    if let Some(status) = params.status {
        where_clauses.push("status = ?");
        sql_params.push(Box::new(status));
    }
    
    let where_clause = where_clauses.join(" AND ");
    let sql = format!(
        "SELECT id, supplier_id, evaluation_type, evaluation_date, quality_score, 
                delivery_score, service_score, price_score, total_score, evaluator_id, 
                comments, improvement_notes, status, created_at, updated_at 
         FROM supplier_evaluations WHERE {} ORDER BY evaluation_date DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let mut stmt = conn.prepare(&sql)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let evaluations = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(SupplierEvaluation {
            id: row.get(0)?,
            supplier_id: row.get(1)?,
            evaluation_type: row.get(2)?,
            evaluation_date: row.get(3)?,
            quality_score: row.get(4)?,
            delivery_score: row.get(5)?,
            service_score: row.get(6)?,
            price_score: row.get(7)?,
            total_score: row.get(8)?,
            evaluator_id: row.get(9)?,
            comments: row.get(10)?,
            improvement_notes: row.get(11)?,
            status: row.get(12)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(14)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    evaluations.collect()
}

pub fn update_supplier_evaluation(conn: &Connection, id: i64, input: SupplierEvaluationUpdateInput) -> Result<SupplierEvaluation> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    macro_rules! add_update {
        ($field:expr, $value:expr) => {
            if $value.is_some() {
                updates.push(concat!($field, " = ?"));
                sql_params.push(Box::new($value.unwrap()));
            }
        };
    }
    
    add_update!("quality_score", input.quality_score);
    add_update!("delivery_score", input.delivery_score);
    add_update!("service_score", input.service_score);
    add_update!("price_score", input.price_score);
    add_update!("comments", input.comments);
    add_update!("improvement_notes", input.improvement_notes);
    add_update!("status", input.status);
    
    if updates.is_empty() {
        return get_supplier_evaluation(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE supplier_evaluations SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_supplier_evaluation(conn, id)
}

pub fn delete_supplier_evaluation(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM supplier_evaluations WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 供应商产品 CRUD ====================

pub fn create_supplier_product(conn: &Connection, input: SupplierProductCreateInput) -> Result<SupplierProduct> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    
    conn.execute(
        "INSERT INTO supplier_products (supplier_id, product_id, product_code, product_name, 
         unit_price, currency, min_order_quantity, lead_time, is_preferred, status, notes, 
         created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'active', ?10, ?11, ?11)",
        params![
            input.supplier_id,
            input.product_id,
            input.product_code,
            input.product_name,
            input.unit_price.unwrap_or(0.0),
            input.currency.unwrap_or_else(|| "CNY".to_string()),
            input.min_order_quantity.unwrap_or(1),
            input.lead_time.unwrap_or(0),
            input.is_preferred.unwrap_or(false) as i64,
            input.notes,
            now_str,
        ],
    )?;
    
    let sp_id = conn.last_insert_rowid();
    get_supplier_product(conn, sp_id)
}

pub fn get_supplier_product(conn: &Connection, id: i64) -> Result<SupplierProduct> {
    let mut stmt = conn.prepare(
        "SELECT id, supplier_id, product_id, product_code, product_name, unit_price, 
                currency, min_order_quantity, lead_time, is_preferred, status, notes, 
                created_at, updated_at 
         FROM supplier_products WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(SupplierProduct {
            id: row.get(0)?,
            supplier_id: row.get(1)?,
            product_id: row.get(2)?,
            product_code: row.get(3)?,
            product_name: row.get(4)?,
            unit_price: row.get(5)?,
            currency: row.get(6)?,
            min_order_quantity: row.get(7)?,
            lead_time: row.get(8)?,
            is_preferred: row.get::<_, i64>(9)? != 0,
            status: row.get(10)?,
            notes: row.get(11)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_supplier_products(conn: &Connection, supplier_id: i64) -> Result<Vec<SupplierProduct>> {
    let mut stmt = conn.prepare(
        "SELECT id, supplier_id, product_id, product_code, product_name, unit_price, 
                currency, min_order_quantity, lead_time, is_preferred, status, notes, 
                created_at, updated_at 
         FROM supplier_products WHERE supplier_id = ?1 ORDER BY is_preferred DESC, product_name"
    )?;
    
    let products = stmt.query_map(params![supplier_id], |row| {
        Ok(SupplierProduct {
            id: row.get(0)?,
            supplier_id: row.get(1)?,
            product_id: row.get(2)?,
            product_code: row.get(3)?,
            product_name: row.get(4)?,
            unit_price: row.get(5)?,
            currency: row.get(6)?,
            min_order_quantity: row.get(7)?,
            lead_time: row.get(8)?,
            is_preferred: row.get::<_, i64>(9)? != 0,
            status: row.get(10)?,
            notes: row.get(11)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    products.collect()
}

pub fn update_supplier_product(conn: &Connection, id: i64, input: SupplierProductUpdateInput) -> Result<SupplierProduct> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    macro_rules! add_update {
        ($field:expr, $value:expr) => {
            if $value.is_some() {
                updates.push(concat!($field, " = ?"));
                sql_params.push(Box::new($value.unwrap()));
            }
        };
    }
    
    add_update!("product_code", input.product_code);
    add_update!("product_name", input.product_name);
    add_update!("unit_price", input.unit_price);
    add_update!("currency", input.currency);
    add_update!("min_order_quantity", input.min_order_quantity);
    add_update!("lead_time", input.lead_time);
    add_update!("is_preferred", input.is_preferred.map(|v| v as i64));
    add_update!("status", input.status);
    add_update!("notes", input.notes);
    
    if updates.is_empty() {
        return get_supplier_product(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE supplier_products SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_supplier_product(conn, id)
}

pub fn delete_supplier_product(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM supplier_products WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 供应商统计 ====================

pub fn get_supplier_statistics(conn: &Connection) -> Result<serde_json::Value> {
    let total: i64 = conn.query_row("SELECT COUNT(*) FROM suppliers WHERE deleted_at IS NULL", [], |row| row.get(0))?;
    let vip_count: i64 = conn.query_row("SELECT COUNT(*) FROM suppliers WHERE level = 'vip' AND deleted_at IS NULL", [], |row| row.get(0))?;
    let normal_count: i64 = conn.query_row("SELECT COUNT(*) FROM suppliers WHERE level = 'normal' AND deleted_at IS NULL", [], |row| row.get(0))?;
    let potential_count: i64 = conn.query_row("SELECT COUNT(*) FROM suppliers WHERE level = 'potential' AND deleted_at IS NULL", [], |row| row.get(0))?;
    let active_count: i64 = conn.query_row("SELECT COUNT(*) FROM suppliers WHERE status = 'active' AND deleted_at IS NULL", [], |row| row.get(0))?;
    
    Ok(serde_json::json!({
        "total": total,
        "by_level": {
            "vip": vip_count,
            "normal": normal_count,
            "potential": potential_count
        },
        "by_status": {
            "active": active_count
        }
    }))
}
