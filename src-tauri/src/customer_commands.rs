// 客户管理模块 Rust Commands
// 实现完整的 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc, NaiveDate};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Customer {
    pub id: i64,
    pub code: String,
    pub name: String,
    #[serde(rename = "type")]
    pub customer_type: String,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub contact_title: Option<String>,
    pub id_number: Option<String>,
    pub tax_id: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub postal_code: Option<String>,
    pub country: Option<String>,
    pub website: Option<String>,
    pub industry: Option<String>,
    pub source: Option<String>,
    pub level: String,
    pub credit_limit: f64,
    pub credit_days: i64,
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
pub struct CustomerCreateInput {
    pub code: String,
    pub name: String,
    #[serde(rename = "type")]
    pub customer_type: Option<String>,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub contact_title: Option<String>,
    pub id_number: Option<String>,
    pub tax_id: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub postal_code: Option<String>,
    pub country: Option<String>,
    pub website: Option<String>,
    pub industry: Option<String>,
    pub source: Option<String>,
    pub level: Option<String>,
    pub credit_limit: Option<f64>,
    pub credit_days: Option<i64>,
    pub notes: Option<String>,
    pub owner_id: Option<i64>,
    pub parent_id: Option<i64>,
    pub tags: Option<Vec<String>>,
    pub custom_fields: Option<Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerUpdateInput {
    pub code: Option<String>,
    pub name: Option<String>,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub contact_title: Option<String>,
    pub id_number: Option<String>,
    pub tax_id: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub province: Option<String>,
    pub postal_code: Option<String>,
    pub country: Option<String>,
    pub website: Option<String>,
    pub industry: Option<String>,
    pub source: Option<String>,
    pub level: Option<String>,
    pub credit_limit: Option<f64>,
    pub credit_days: Option<i64>,
    pub status: Option<String>,
    pub notes: Option<String>,
    pub owner_id: Option<i64>,
    pub parent_id: Option<i64>,
    pub tags: Option<Vec<String>>,
    pub custom_fields: Option<Value>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CustomerContact {
    pub id: i64,
    pub customer_id: i64,
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
pub struct CustomerContactCreateInput {
    pub customer_id: i64,
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
pub struct CustomerContactUpdateInput {
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
pub struct CustomerInteraction {
    pub id: i64,
    pub customer_id: i64,
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
pub struct CustomerInteractionCreateInput {
    pub customer_id: i64,
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
pub struct CustomerLevel {
    pub id: i64,
    pub name: String,
    pub code: String,
    pub description: Option<String>,
    pub discount_rate: f64,
    pub credit_days: i64,
    pub min_purchase_amount: f64,
    pub benefits: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CustomerTag {
    pub id: i64,
    pub name: String,
    pub color: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerListParams {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub customer_type: Option<String>,
    pub level: Option<String>,
    pub status: Option<String>,
    pub city: Option<String>,
    pub owner_id: Option<i64>,
    pub search: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerListResponse {
    pub customers: Vec<Customer>,
    pub total: i64,
    pub limit: i64,
    pub offset: i64,
}

// ==================== 客户 CRUD ====================

pub fn create_customer(conn: &Connection, input: CustomerCreateInput) -> Result<Customer> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let tags_json = serde_json::to_string(&input.tags.unwrap_or_default()).unwrap_or_default();
    let custom_fields_json = serde_json::to_string(&input.custom_fields.unwrap_or(Value::Null)).unwrap_or_default();
    
    conn.execute(
        "INSERT INTO customers (code, name, type, contact_person, contact_phone, contact_email, 
         contact_title, id_number, tax_id, address, city, province, postal_code, country, 
         website, industry, source, level, credit_limit, credit_days, status, notes, 
         owner_id, parent_id, tags, custom_fields, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, 
                 ?19, ?20, 'active', ?21, ?22, ?23, ?24, ?25, ?26, ?26)",
        params![
            input.code,
            input.name,
            input.customer_type.unwrap_or_else(|| "individual".to_string()),
            input.contact_person,
            input.contact_phone,
            input.contact_email,
            input.contact_title,
            input.id_number,
            input.tax_id,
            input.address,
            input.city,
            input.province,
            input.postal_code,
            input.country,
            input.website,
            input.industry,
            input.source,
            input.level.unwrap_or_else(|| "normal".to_string()),
            input.credit_limit.unwrap_or(0.0),
            input.credit_days.unwrap_or(0),
            input.notes,
            input.owner_id,
            input.parent_id,
            tags_json,
            custom_fields_json,
            now_str,
        ],
    )?;
    
    let customer_id = conn.last_insert_rowid();
    get_customer(conn, customer_id)
}

pub fn get_customer(conn: &Connection, id: i64) -> Result<Customer> {
    let mut stmt = conn.prepare(
        "SELECT id, code, name, type, contact_person, contact_phone, contact_email, 
                contact_title, id_number, tax_id, address, city, province, postal_code, 
                country, website, industry, source, level, credit_limit, credit_days, 
                status, notes, owner_id, parent_id, tags, custom_fields, 
                created_at, updated_at, deleted_at 
         FROM customers WHERE id = ?1 AND deleted_at IS NULL"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(Customer {
            id: row.get(0)?,
            code: row.get(1)?,
            name: row.get(2)?,
            customer_type: row.get(3)?,
            contact_person: row.get(4)?,
            contact_phone: row.get(5)?,
            contact_email: row.get(6)?,
            contact_title: row.get(7)?,
            id_number: row.get(8)?,
            tax_id: row.get(9)?,
            address: row.get(10)?,
            city: row.get(11)?,
            province: row.get(12)?,
            postal_code: row.get(13)?,
            country: row.get(14)?,
            website: row.get(15)?,
            industry: row.get(16)?,
            source: row.get(17)?,
            level: row.get(18)?,
            credit_limit: row.get(19)?,
            credit_days: row.get(20)?,
            status: row.get(21)?,
            notes: row.get(22)?,
            owner_id: row.get(23)?,
            parent_id: row.get(24)?,
            tags: serde_json::from_str(&row.get::<_, String>(25)?).unwrap_or_default(),
            custom_fields: serde_json::from_str(&row.get::<_, String>(26)?).unwrap_or(Value::Null),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(27)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(28)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(29)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })
}

pub fn list_customers(conn: &Connection, params: CustomerListParams) -> Result<CustomerListResponse> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.offset.unwrap_or(0);
    
    let mut where_clauses = vec!["deleted_at IS NULL"];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(customer_type) = params.customer_type {
        where_clauses.push("type = ?");
        sql_params.push(Box::new(customer_type));
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
    
    // Count total
    let count_sql = format!("SELECT COUNT(*) FROM customers WHERE {}", where_clause);
    let total: i64 = conn.prepare(&count_sql)?.query_row(
        rusqlite::params_from_iter(sql_params.iter().map(|b| b.as_ref())),
        |row| row.get(0),
    )?;
    
    // Fetch data
    let data_sql = format!(
        "SELECT id, code, name, type, contact_person, contact_phone, contact_email, 
                contact_title, id_number, tax_id, address, city, province, postal_code, 
                country, website, industry, source, level, credit_limit, credit_days, 
                status, notes, owner_id, parent_id, tags, custom_fields, 
                created_at, updated_at, deleted_at 
         FROM customers WHERE {} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let mut stmt = conn.prepare(&data_sql)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let customers = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(Customer {
            id: row.get(0)?,
            code: row.get(1)?,
            name: row.get(2)?,
            customer_type: row.get(3)?,
            contact_person: row.get(4)?,
            contact_phone: row.get(5)?,
            contact_email: row.get(6)?,
            contact_title: row.get(7)?,
            id_number: row.get(8)?,
            tax_id: row.get(9)?,
            address: row.get(10)?,
            city: row.get(11)?,
            province: row.get(12)?,
            postal_code: row.get(13)?,
            country: row.get(14)?,
            website: row.get(15)?,
            industry: row.get(16)?,
            source: row.get(17)?,
            level: row.get(18)?,
            credit_limit: row.get(19)?,
            credit_days: row.get(20)?,
            status: row.get(21)?,
            notes: row.get(22)?,
            owner_id: row.get(23)?,
            parent_id: row.get(24)?,
            tags: serde_json::from_str(&row.get::<_, String>(25)?).unwrap_or_default(),
            custom_fields: serde_json::from_str(&row.get::<_, String>(26)?).unwrap_or(Value::Null),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(27)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(28)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(29)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    Ok(CustomerListResponse {
        customers: customers.collect::<Result<Vec<_>, _>>()?,
        total,
        limit,
        offset,
    })
}

pub fn update_customer(conn: &Connection, id: i64, input: CustomerUpdateInput) -> Result<Customer> {
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
    add_update!("address", input.address);
    add_update!("city", input.city);
    add_update!("province", input.province);
    add_update!("postal_code", input.postal_code);
    add_update!("country", input.country);
    add_update!("website", input.website);
    add_update!("industry", input.industry);
    add_update!("source", input.source);
    add_update!("level", input.level);
    add_update!("credit_limit", input.credit_limit);
    add_update!("credit_days", input.credit_days);
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
    let now = Utc::now();
    let affected = conn.execute(
        "UPDATE customers SET deleted_at = ?, updated_at = ? WHERE id = ?",
        params![now.to_rfc3339(), now.to_rfc3339(), id],
    )?;
    Ok(affected > 0)
}

// ==================== 客户联系人 CRUD ====================

pub fn create_customer_contact(conn: &Connection, input: CustomerContactCreateInput) -> Result<CustomerContact> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    
    conn.execute(
        "INSERT INTO customer_contacts (customer_id, name, title, phone, mobile, email, 
         wechat, qq, is_primary, notes, birthday, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?12)",
        params![
            input.customer_id,
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
    get_customer_contact(conn, contact_id)
}

pub fn get_customer_contact(conn: &Connection, id: i64) -> Result<CustomerContact> {
    let mut stmt = conn.prepare(
        "SELECT id, customer_id, name, title, phone, mobile, email, wechat, qq, 
                is_primary, notes, birthday, created_at, updated_at, deleted_at 
         FROM customer_contacts WHERE id = ?1 AND deleted_at IS NULL"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(CustomerContact {
            id: row.get(0)?,
            customer_id: row.get(1)?,
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

pub fn list_customer_contacts(conn: &Connection, customer_id: i64) -> Result<Vec<CustomerContact>> {
    let mut stmt = conn.prepare(
        "SELECT id, customer_id, name, title, phone, mobile, email, wechat, qq, 
                is_primary, notes, birthday, created_at, updated_at, deleted_at 
         FROM customer_contacts WHERE customer_id = ?1 AND deleted_at IS NULL ORDER BY is_primary DESC, created_at DESC"
    )?;
    
    let contacts = stmt.query_map(params![customer_id], |row| {
        Ok(CustomerContact {
            id: row.get(0)?,
            customer_id: row.get(1)?,
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

pub fn update_customer_contact(conn: &Connection, id: i64, input: CustomerContactUpdateInput) -> Result<CustomerContact> {
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
        return get_customer_contact(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE customer_contacts SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_customer_contact(conn, id)
}

pub fn delete_customer_contact(conn: &Connection, id: i64) -> Result<bool> {
    let now = Utc::now();
    let affected = conn.execute(
        "UPDATE customer_contacts SET deleted_at = ?, updated_at = ? WHERE id = ?",
        params![now.to_rfc3339(), now.to_rfc3339(), id],
    )?;
    Ok(affected > 0)
}

// ==================== 客户联系记录 CRUD ====================

pub fn create_customer_interaction(conn: &Connection, input: CustomerInteractionCreateInput) -> Result<CustomerInteraction> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO customer_interactions (customer_id, contact_id, interaction_type, 
         subject, content, result, follow_up_date, follow_up_notes, operator_id, created_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            input.customer_id,
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
    get_customer_interaction(conn, interaction_id)
}

pub fn get_customer_interaction(conn: &Connection, id: i64) -> Result<CustomerInteraction> {
    let mut stmt = conn.prepare(
        "SELECT id, customer_id, contact_id, interaction_type, subject, content, 
                result, follow_up_date, follow_up_notes, operator_id, created_at 
         FROM customer_interactions WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(CustomerInteraction {
            id: row.get(0)?,
            customer_id: row.get(1)?,
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

pub fn list_customer_interactions(conn: &Connection, customer_id: i64, limit: i64, offset: i64) -> Result<Vec<CustomerInteraction>> {
    let mut stmt = conn.prepare(
        "SELECT id, customer_id, contact_id, interaction_type, subject, content, 
                result, follow_up_date, follow_up_notes, operator_id, created_at 
         FROM customer_interactions WHERE customer_id = ?1 ORDER BY created_at DESC LIMIT ?2 OFFSET ?3"
    )?;
    
    let interactions = stmt.query_map(params![customer_id, limit, offset], |row| {
        Ok(CustomerInteraction {
            id: row.get(0)?,
            customer_id: row.get(1)?,
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

// ==================== 客户分级 CRUD ====================

pub fn list_customer_levels(conn: &Connection) -> Result<Vec<CustomerLevel>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, code, description, discount_rate, credit_days, 
                min_purchase_amount, benefits, created_at, updated_at 
         FROM customer_levels ORDER BY credit_days DESC"
    )?;
    
    let levels = stmt.query_map([], |row| {
        Ok(CustomerLevel {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            description: row.get(3)?,
            discount_rate: row.get(4)?,
            credit_days: row.get(5)?,
            min_purchase_amount: row.get(6)?,
            benefits: serde_json::from_str(&row.get::<_, String>(7)?).unwrap_or_default(),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    levels.collect()
}

// ==================== 客户标签 CRUD ====================

pub fn list_customer_tags(conn: &Connection) -> Result<Vec<CustomerTag>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, color, description, created_at FROM customer_tags ORDER BY name"
    )?;
    
    let tags = stmt.query_map([], |row| {
        Ok(CustomerTag {
            id: row.get(0)?,
            name: row.get(1)?,
            color: row.get(2)?,
            description: row.get(3)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    tags.collect()
}

pub fn create_customer_tag(conn: &Connection, name: &str, color: Option<String>, description: Option<String>) -> Result<CustomerTag> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO customer_tags (name, color, description, created_at) VALUES (?1, ?2, ?3, ?4)",
        params![name, color.unwrap_or_else(|| "#1890ff".to_string()), description, now.to_rfc3339()],
    )?;
    
    let tag_id = conn.last_insert_rowid();
    
    let mut stmt = conn.prepare("SELECT id, name, color, description, created_at FROM customer_tags WHERE id = ?1")?;
    stmt.query_row(params![tag_id], |row| {
        Ok(CustomerTag {
            id: row.get(0)?,
            name: row.get(1)?,
            color: row.get(2)?,
            description: row.get(3)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?).unwrap().with_timezone(&Utc),
        })
    })
}

// ==================== 额外类型定义 (for lib.rs compatibility) ====================

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerContactListParams {
    pub customer_id: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CustomerLevelConfig {
    pub id: i64,
    pub name: String,
    pub code: String,
    pub description: Option<String>,
    pub discount_rate: f64,
    pub credit_days: i64,
    pub min_purchase_amount: f64,
    pub benefits: Vec<String>,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerLevelConfigCreateInput {
    pub name: String,
    pub code: String,
    pub description: Option<String>,
    pub discount_rate: Option<f64>,
    pub credit_days: Option<i64>,
    pub min_purchase_amount: Option<f64>,
    pub benefits: Option<Vec<String>>,
    pub status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerLevelConfigUpdateInput {
    pub name: Option<String>,
    pub code: Option<String>,
    pub description: Option<String>,
    pub discount_rate: Option<f64>,
    pub credit_days: Option<i64>,
    pub min_purchase_amount: Option<f64>,
    pub benefits: Option<Vec<String>>,
    pub status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerTagCreateInput {
    pub name: String,
    pub color: Option<String>,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerTagUpdateInput {
    pub name: Option<String>,
    pub color: Option<String>,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CustomerFollowUp {
    pub id: i64,
    pub customer_id: i64,
    pub contact_id: Option<i64>,
    pub follow_up_type: String,
    pub subject: String,
    pub content: Option<String>,
    pub planned_date: String,
    pub completed_date: Option<String>,
    pub status: String,
    pub priority: String,
    pub operator_id: Option<i64>,
    pub result: Option<String>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerFollowUpCreateInput {
    pub customer_id: i64,
    pub contact_id: Option<i64>,
    pub follow_up_type: String,
    pub subject: String,
    pub content: Option<String>,
    pub planned_date: String,
    pub priority: Option<String>,
    pub operator_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerFollowUpUpdateInput {
    pub follow_up_type: Option<String>,
    pub subject: Option<String>,
    pub content: Option<String>,
    pub planned_date: Option<String>,
    pub completed_date: Option<String>,
    pub status: Option<String>,
    pub priority: Option<String>,
    pub result: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerFollowUpListParams {
    pub customer_id: Option<i64>,
    pub status: Option<String>,
    pub priority: Option<String>,
    pub operator_id: Option<i64>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 客户等级配置 CRUD ====================

pub fn create_customer_level_config(conn: &Connection, input: CustomerLevelConfigCreateInput) -> Result<CustomerLevelConfig> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let benefits_json = serde_json::to_string(&input.benefits.unwrap_or_default()).unwrap_or_default();
    
    conn.execute(
        "INSERT INTO customer_levels (name, code, description, discount_rate, credit_days, min_purchase_amount, benefits, status, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?9)",
        params![
            input.name,
            input.code,
            input.description,
            input.discount_rate.unwrap_or(0.0),
            input.credit_days.unwrap_or(0),
            input.min_purchase_amount.unwrap_or(0.0),
            benefits_json,
            input.status.unwrap_or_else(|| "active".to_string()),
            now_str,
        ],
    )?;
    
    let config_id = conn.last_insert_rowid();
    get_customer_level_config(conn, config_id)
}

pub fn get_customer_level_config(conn: &Connection, id: i64) -> Result<CustomerLevelConfig> {
    let mut stmt = conn.prepare(
        "SELECT id, name, code, description, discount_rate, credit_days, min_purchase_amount, benefits, status, created_at, updated_at 
         FROM customer_levels WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(CustomerLevelConfig {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            description: row.get(3)?,
            discount_rate: row.get(4)?,
            credit_days: row.get(5)?,
            min_purchase_amount: row.get(6)?,
            benefits: serde_json::from_str(&row.get::<_, String>(7)?).unwrap_or_default(),
            status: row.get(8)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_customer_level_configs(conn: &Connection, status: Option<String>) -> Result<Vec<CustomerLevelConfig>> {
    let mut stmt = if status.is_some() {
        conn.prepare(
            "SELECT id, name, code, description, discount_rate, credit_days, min_purchase_amount, benefits, status, created_at, updated_at 
             FROM customer_levels WHERE status = ? ORDER BY credit_days DESC"
        )?
    } else {
        conn.prepare(
            "SELECT id, name, code, description, discount_rate, credit_days, min_purchase_amount, benefits, status, created_at, updated_at 
             FROM customer_levels ORDER BY credit_days DESC"
        )?
    };
    
    let levels = if status.is_some() {
        stmt.query_map(params![status.unwrap()], |row| {
            Ok(CustomerLevelConfig {
                id: row.get(0)?,
                name: row.get(1)?,
                code: row.get(2)?,
                description: row.get(3)?,
                discount_rate: row.get(4)?,
                credit_days: row.get(5)?,
                min_purchase_amount: row.get(6)?,
                benefits: serde_json::from_str(&row.get::<_, String>(7)?).unwrap_or_default(),
                status: row.get(8)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?).unwrap().with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
            })
        })?
    } else {
        stmt.query_map([], |row| {
            Ok(CustomerLevelConfig {
                id: row.get(0)?,
                name: row.get(1)?,
                code: row.get(2)?,
                description: row.get(3)?,
                discount_rate: row.get(4)?,
                credit_days: row.get(5)?,
                min_purchase_amount: row.get(6)?,
                benefits: serde_json::from_str(&row.get::<_, String>(7)?).unwrap_or_default(),
                status: row.get(8)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(9)?).unwrap().with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
            })
        })?
    };
    
    levels.collect()
}

pub fn update_customer_level_config(conn: &Connection, id: i64, input: CustomerLevelConfigUpdateInput) -> Result<CustomerLevelConfig> {
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
    add_update!("code", input.code);
    add_update!("description", input.description);
    add_update!("discount_rate", input.discount_rate);
    add_update!("credit_days", input.credit_days);
    add_update!("min_purchase_amount", input.min_purchase_amount);
    add_update!("status", input.status);
    
    if let Some(benefits) = input.benefits {
        updates.push("benefits = ?");
        sql_params.push(Box::new(serde_json::to_string(&benefits).unwrap_or_default()));
    }
    
    if updates.is_empty() {
        return get_customer_level_config(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE customer_levels SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_customer_level_config(conn, id)
}

pub fn delete_customer_level_config(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM customer_levels WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 客户标签 CRUD ====================

pub fn get_customer_tag(conn: &Connection, id: i64) -> Result<CustomerTag> {
    let mut stmt = conn.prepare("SELECT id, name, color, description, created_at FROM customer_tags WHERE id = ?1")?;
    stmt.query_row(params![id], |row| {
        Ok(CustomerTag {
            id: row.get(0)?,
            name: row.get(1)?,
            color: row.get(2)?,
            description: row.get(3)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn update_customer_tag(conn: &Connection, id: i64, input: CustomerTagUpdateInput) -> Result<CustomerTag> {
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(name) = input.name {
        updates.push("name = ?");
        sql_params.push(Box::new(name));
    }
    if let Some(color) = input.color {
        updates.push("color = ?");
        sql_params.push(Box::new(color));
    }
    if let Some(description) = input.description {
        updates.push("description = ?");
        sql_params.push(Box::new(description));
    }
    
    if updates.is_empty() {
        return get_customer_tag(conn, id);
    }
    
    sql_params.push(Box::new(id));
    let sql = format!("UPDATE customer_tags SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_customer_tag(conn, id)
}

pub fn delete_customer_tag(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM customer_tags WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

pub fn add_customer_tag(conn: &Connection, customer_id: i64, tag_id: i64) -> Result<i64> {
    // Get tag name
    let tag_name: String = conn.query_row("SELECT name FROM customer_tags WHERE id = ?", params![tag_id], |row| row.get(0))?;
    
    // Get current tags
    let current_tags_str: String = conn.query_row("SELECT tags FROM customers WHERE id = ?", params![customer_id], |row| row.get(0))
        .unwrap_or_else(|_| "[]".to_string());
    let mut tags: Vec<String> = serde_json::from_str(&current_tags_str).unwrap_or_default();
    
    if !tags.contains(&tag_name) {
        tags.push(tag_name);
    }
    
    let tags_json = serde_json::to_string(&tags).unwrap_or_default();
    conn.execute("UPDATE customers SET tags = ? WHERE id = ?", params![tags_json, customer_id])?;
    
    Ok(tag_id)
}

pub fn remove_customer_tag(conn: &Connection, customer_id: i64, tag_id: i64) -> Result<bool> {
    let tag_name: String = conn.query_row("SELECT name FROM customer_tags WHERE id = ?", params![tag_id], |row| row.get(0))?;
    
    let current_tags_str: String = conn.query_row("SELECT tags FROM customers WHERE id = ?", params![customer_id], |row| row.get(0))
        .unwrap_or_else(|_| "[]".to_string());
    let mut tags: Vec<String> = serde_json::from_str(&current_tags_str).unwrap_or_default();
    
    tags.retain(|t| t != &tag_name);
    
    let tags_json = serde_json::to_string(&tags).unwrap_or_default();
    conn.execute("UPDATE customers SET tags = ? WHERE id = ?", params![tags_json, customer_id])?;
    
    Ok(true)
}

pub fn get_customer_tags(conn: &Connection, customer_id: i64) -> Result<Vec<CustomerTag>> {
    let tags_str: String = conn.query_row("SELECT tags FROM customers WHERE id = ?", params![customer_id], |row| row.get(0))
        .unwrap_or_else(|_| "[]".to_string());
    let tags: Vec<String> = serde_json::from_str(&tags_str).unwrap_or_default();
    
    if tags.is_empty() {
        return Ok(Vec::new());
    }
    
    let placeholders = tags.iter().map(|_| "?").collect::<Vec<_>>().join(",");
    let sql = format!("SELECT id, name, color, description, created_at FROM customer_tags WHERE name IN ({})", placeholders);
    
    let mut stmt = conn.prepare(&sql)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = tags.iter().map(|s| s as &dyn rusqlite::types::ToSql).collect();
    
    let tag_list = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(CustomerTag {
            id: row.get(0)?,
            name: row.get(1)?,
            color: row.get(2)?,
            description: row.get(3)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    tag_list.collect()
}

// ==================== 客户跟进计划 CRUD ====================

pub fn create_customer_follow_up(conn: &Connection, input: CustomerFollowUpCreateInput) -> Result<CustomerFollowUp> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    
    conn.execute(
        "INSERT INTO customer_follow_ups (customer_id, contact_id, follow_up_type, subject, content, 
         planned_date, status, priority, operator_id, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending', ?7, ?8, ?9, ?9)",
        params![
            input.customer_id,
            input.contact_id,
            input.follow_up_type,
            input.subject,
            input.content,
            input.planned_date,
            input.priority.unwrap_or_else(|| "normal".to_string()),
            input.operator_id,
            now_str,
        ],
    )?;
    
    let follow_up_id = conn.last_insert_rowid();
    get_customer_follow_up(conn, follow_up_id)
}

pub fn get_customer_follow_up(conn: &Connection, id: i64) -> Result<CustomerFollowUp> {
    let mut stmt = conn.prepare(
        "SELECT id, customer_id, contact_id, follow_up_type, subject, content, 
                planned_date, completed_date, status, priority, operator_id, result, notes, created_at, updated_at 
         FROM customer_follow_ups WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(CustomerFollowUp {
            id: row.get(0)?,
            customer_id: row.get(1)?,
            contact_id: row.get(2)?,
            follow_up_type: row.get(3)?,
            subject: row.get(4)?,
            content: row.get(5)?,
            planned_date: row.get(6)?,
            completed_date: row.get(7)?,
            status: row.get(8)?,
            priority: row.get(9)?,
            operator_id: row.get(10)?,
            result: row.get(11)?,
            notes: row.get(12)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(14)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_customer_follow_ups(conn: &Connection, params: CustomerFollowUpListParams) -> Result<Vec<CustomerFollowUp>> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.offset.unwrap_or(0);
    
    let mut where_clauses = vec!["1=1"];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(customer_id) = params.customer_id {
        where_clauses.push("customer_id = ?");
        sql_params.push(Box::new(customer_id));
    }
    if let Some(status) = params.status {
        where_clauses.push("status = ?");
        sql_params.push(Box::new(status));
    }
    if let Some(priority) = params.priority {
        where_clauses.push("priority = ?");
        sql_params.push(Box::new(priority));
    }
    if let Some(operator_id) = params.operator_id {
        where_clauses.push("operator_id = ?");
        sql_params.push(Box::new(operator_id));
    }
    
    let where_clause = where_clauses.join(" AND ");
    let sql = format!(
        "SELECT id, customer_id, contact_id, follow_up_type, subject, content, 
                planned_date, completed_date, status, priority, operator_id, result, notes, created_at, updated_at 
         FROM customer_follow_ups WHERE {} ORDER BY planned_date ASC LIMIT ? OFFSET ?",
        where_clause
    );
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let mut stmt = conn.prepare(&sql)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let follow_ups = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(CustomerFollowUp {
            id: row.get(0)?,
            customer_id: row.get(1)?,
            contact_id: row.get(2)?,
            follow_up_type: row.get(3)?,
            subject: row.get(4)?,
            content: row.get(5)?,
            planned_date: row.get(6)?,
            completed_date: row.get(7)?,
            status: row.get(8)?,
            priority: row.get(9)?,
            operator_id: row.get(10)?,
            result: row.get(11)?,
            notes: row.get(12)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(13)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(14)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    follow_ups.collect()
}

pub fn update_customer_follow_up(conn: &Connection, id: i64, input: CustomerFollowUpUpdateInput) -> Result<CustomerFollowUp> {
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
    
    add_update!("follow_up_type", input.follow_up_type);
    add_update!("subject", input.subject);
    add_update!("content", input.content);
    add_update!("planned_date", input.planned_date);
    add_update!("completed_date", input.completed_date);
    add_update!("status", input.status);
    add_update!("priority", input.priority);
    add_update!("result", input.result);
    add_update!("notes", input.notes);
    
    if updates.is_empty() {
        return get_customer_follow_up(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE customer_follow_ups SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_customer_follow_up(conn, id)
}

pub fn delete_customer_follow_up(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM customer_follow_ups WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 客户统计 ====================

pub fn get_customer_statistics(conn: &Connection) -> Result<serde_json::Value> {
    let total: i64 = conn.query_row("SELECT COUNT(*) FROM customers WHERE deleted_at IS NULL", [], |row| row.get(0))?;
    let vip_count: i64 = conn.query_row("SELECT COUNT(*) FROM customers WHERE level = 'vip' AND deleted_at IS NULL", [], |row| row.get(0))?;
    let normal_count: i64 = conn.query_row("SELECT COUNT(*) FROM customers WHERE level = 'normal' AND deleted_at IS NULL", [], |row| row.get(0))?;
    let potential_count: i64 = conn.query_row("SELECT COUNT(*) FROM customers WHERE level = 'potential' AND deleted_at IS NULL", [], |row| row.get(0))?;
    let active_count: i64 = conn.query_row("SELECT COUNT(*) FROM customers WHERE status = 'active' AND deleted_at IS NULL", [], |row| row.get(0))?;
    
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

// ==================== 客户联系人列表 (简化版) ====================

pub fn list_customer_contacts(conn: &Connection, params: CustomerContactListParams) -> Result<Vec<CustomerContact>> {
    list_customer_contacts(conn, params.customer_id)
}
