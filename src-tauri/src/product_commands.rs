// 产品管理模块 Rust Commands
// 实现完整的 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Product {
    pub id: i64,
    pub sku: String,
    pub name: String,
    pub description: Option<String>,
    pub category_id: Option<i64>,
    pub brand: Option<String>,
    pub model: Option<String>,
    pub unit: String,
    pub cost_price: f64,
    pub selling_price: f64,
    pub wholesale_price: f64,
    pub min_stock: i64,
    pub max_stock: i64,
    pub status: String,
    pub images: Vec<String>,
    pub attributes: serde_json::Value,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProductCreateInput {
    pub sku: String,
    pub name: String,
    pub description: Option<String>,
    pub category_id: Option<i64>,
    pub brand: Option<String>,
    pub model: Option<String>,
    pub unit: Option<String>,
    pub cost_price: Option<f64>,
    pub selling_price: Option<f64>,
    pub wholesale_price: Option<f64>,
    pub min_stock: Option<i64>,
    pub max_stock: Option<i64>,
    pub images: Option<Vec<String>>,
    pub attributes: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProductUpdateInput {
    pub sku: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub category_id: Option<i64>,
    pub brand: Option<String>,
    pub model: Option<String>,
    pub unit: Option<String>,
    pub cost_price: Option<f64>,
    pub selling_price: Option<f64>,
    pub wholesale_price: Option<f64>,
    pub min_stock: Option<i64>,
    pub max_stock: Option<i64>,
    pub status: Option<String>,
    pub images: Option<Vec<String>>,
    pub attributes: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProductCategoryCreateInput {
    pub name: String,
    pub parent_id: Option<i64>,
    pub description: Option<String>,
    pub sort_order: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProductCategory {
    pub id: i64,
    pub name: String,
    pub parent_id: Option<i64>,
    pub description: Option<String>,
    pub sort_order: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProductInventory {
    pub id: i64,
    pub product_id: i64,
    pub warehouse_id: Option<i64>,
    pub quantity: i64,
    pub reserved_quantity: i64,
    pub available_quantity: i64,
    pub last_stock_check: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InventoryTransaction {
    pub id: i64,
    pub product_id: i64,
    pub warehouse_id: Option<i64>,
    pub transaction_type: String,
    pub quantity: i64,
    pub before_quantity: i64,
    pub after_quantity: i64,
    pub reference_type: Option<String>,
    pub reference_id: Option<i64>,
    pub reason: Option<String>,
    pub operator_id: Option<i64>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InventoryTransactionInput {
    pub product_id: i64,
    pub warehouse_id: Option<i64>,
    pub transaction_type: String,
    pub quantity: i64,
    pub reason: Option<String>,
    pub reference_type: Option<String>,
    pub reference_id: Option<i64>,
    pub notes: Option<String>,
    pub operator_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Warehouse {
    pub id: i64,
    pub name: String,
    pub code: String,
    pub address: Option<String>,
    pub manager_id: Option<i64>,
    pub phone: Option<String>,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// ==================== 产品 CRUD ====================

pub fn create_product(conn: &Connection, input: ProductCreateInput) -> Result<Product> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let images_json = serde_json::to_string(&input.images.unwrap_or_default()).unwrap_or_default();
    let attributes_json = serde_json::to_string(&input.attributes.unwrap_or(serde_json::Value::Null)).unwrap_or_default();
    
    conn.execute(
        "INSERT INTO products (sku, name, description, category_id, brand, model, unit, cost_price, selling_price, wholesale_price, min_stock, max_stock, status, images, attributes, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, 'active', ?13, ?14, ?15, ?15)",
        params![
            input.sku,
            input.name,
            input.description,
            input.category_id,
            input.brand,
            input.model,
            input.unit.unwrap_or_else(|| "件".to_string()),
            input.cost_price.unwrap_or(0.0),
            input.selling_price.unwrap_or(0.0),
            input.wholesale_price.unwrap_or(0.0),
            input.min_stock.unwrap_or(0),
            input.max_stock.unwrap_or(0),
            images_json,
            attributes_json,
            now_str,
        ],
    )?;
    
    let product_id = conn.last_insert_rowid();
    get_product(conn, product_id)
}

pub fn get_product(conn: &Connection, id: i64) -> Result<Product> {
    let mut stmt = conn.prepare(
        "SELECT id, sku, name, description, category_id, brand, model, unit, cost_price, selling_price, 
                wholesale_price, min_stock, max_stock, status, images, attributes, created_at, updated_at, deleted_at 
         FROM products WHERE id = ?1 AND deleted_at IS NULL"
    )?;
    
    let product = stmt.query_row(params![id], |row| {
        Ok(Product {
            id: row.get(0)?,
            sku: row.get(1)?,
            name: row.get(2)?,
            description: row.get(3)?,
            category_id: row.get(4)?,
            brand: row.get(5)?,
            model: row.get(6)?,
            unit: row.get(7)?,
            cost_price: row.get(8)?,
            selling_price: row.get(9)?,
            wholesale_price: row.get(10)?,
            min_stock: row.get(11)?,
            max_stock: row.get(12)?,
            status: row.get(13)?,
            images: serde_json::from_str(&row.get::<_, String>(14)?).unwrap_or_default(),
            attributes: serde_json::from_str(&row.get::<_, String>(15)?).unwrap_or(serde_json::Value::Null),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(16)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(17)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(18)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    Ok(product)
}

pub fn list_products(conn: &Connection, limit: i64, offset: i64, category_id: Option<i64>, status: Option<String>, search: Option<String>) -> Result<Vec<Product>> {
    let mut where_clauses = vec!["deleted_at IS NULL".to_string()];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(cat_id) = category_id {
        where_clauses.push("category_id = ?".to_string());
        sql_params.push(Box::new(cat_id));
    }
    
    if let Some(stat) = status {
        where_clauses.push("status = ?".to_string());
        sql_params.push(Box::new(stat));
    }
    
    if let Some(s) = search {
        where_clauses.push("(name LIKE ? OR sku LIKE ? OR brand LIKE ?)".to_string());
        let search_pattern = format!("%{}%", s);
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
        "SELECT id, sku, name, description, category_id, brand, model, unit, cost_price, selling_price, 
                wholesale_price, min_stock, max_stock, status, images, attributes, created_at, updated_at, deleted_at 
         FROM products {} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    let mut stmt = conn.prepare(&query)?;
    
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    let products = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(Product {
            id: row.get(0)?,
            sku: row.get(1)?,
            name: row.get(2)?,
            description: row.get(3)?,
            category_id: row.get(4)?,
            brand: row.get(5)?,
            model: row.get(6)?,
            unit: row.get(7)?,
            cost_price: row.get(8)?,
            selling_price: row.get(9)?,
            wholesale_price: row.get(10)?,
            min_stock: row.get(11)?,
            max_stock: row.get(12)?,
            status: row.get(13)?,
            images: serde_json::from_str(&row.get::<_, String>(14)?).unwrap_or_default(),
            attributes: serde_json::from_str(&row.get::<_, String>(15)?).unwrap_or(serde_json::Value::Null),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(16)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(17)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(18)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    products.collect()
}

pub fn update_product(conn: &Connection, id: i64, input: ProductUpdateInput) -> Result<Product> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(sku) = input.sku {
        updates.push("sku = ?");
        sql_params.push(Box::new(sku));
    }
    if let Some(name) = input.name {
        updates.push("name = ?");
        sql_params.push(Box::new(name));
    }
    if let Some(description) = input.description {
        updates.push("description = ?");
        sql_params.push(Box::new(description));
    }
    if let Some(category_id) = input.category_id {
        updates.push("category_id = ?");
        sql_params.push(Box::new(category_id));
    }
    if let Some(brand) = input.brand {
        updates.push("brand = ?");
        sql_params.push(Box::new(brand));
    }
    if let Some(model) = input.model {
        updates.push("model = ?");
        sql_params.push(Box::new(model));
    }
    if let Some(unit) = input.unit {
        updates.push("unit = ?");
        sql_params.push(Box::new(unit));
    }
    if let Some(cost_price) = input.cost_price {
        updates.push("cost_price = ?");
        sql_params.push(Box::new(cost_price));
    }
    if let Some(selling_price) = input.selling_price {
        updates.push("selling_price = ?");
        sql_params.push(Box::new(selling_price));
    }
    if let Some(wholesale_price) = input.wholesale_price {
        updates.push("wholesale_price = ?");
        sql_params.push(Box::new(wholesale_price));
    }
    if let Some(min_stock) = input.min_stock {
        updates.push("min_stock = ?");
        sql_params.push(Box::new(min_stock));
    }
    if let Some(max_stock) = input.max_stock {
        updates.push("max_stock = ?");
        sql_params.push(Box::new(max_stock));
    }
    if let Some(status) = input.status {
        updates.push("status = ?");
        sql_params.push(Box::new(status));
    }
    if let Some(images) = input.images {
        updates.push("images = ?");
        sql_params.push(Box::new(serde_json::to_string(&images).unwrap_or_default()));
    }
    if let Some(attributes) = input.attributes {
        updates.push("attributes = ?");
        sql_params.push(Box::new(serde_json::to_string(&attributes).unwrap_or_default()));
    }
    
    if updates.is_empty() {
        return get_product(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE products SET {} WHERE id = ?", updates.join(", "));
    
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_product(conn, id)
}

pub fn delete_product(conn: &Connection, id: i64) -> Result<bool> {
    let now = Utc::now();
    let affected = conn.execute(
        "UPDATE products SET deleted_at = ?, updated_at = ? WHERE id = ?",
        params![now.to_rfc3339(), now.to_rfc3339(), id],
    )?;
    Ok(affected > 0)
}

// ==================== 产品分类 CRUD ====================

pub fn create_category(conn: &Connection, name: &str, parent_id: Option<i64>, description: Option<String>, sort_order: Option<i64>) -> Result<ProductCategory> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO product_categories (name, parent_id, description, sort_order, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?5)",
        params![name, parent_id, description, sort_order.unwrap_or(0), now.to_rfc3339()],
    )?;
    
    let category_id = conn.last_insert_rowid();
    get_category(conn, category_id)
}

pub fn get_category(conn: &Connection, id: i64) -> Result<ProductCategory> {
    let mut stmt = conn.prepare("SELECT id, name, parent_id, description, sort_order, created_at, updated_at FROM product_categories WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(ProductCategory {
            id: row.get(0)?,
            name: row.get(1)?,
            parent_id: row.get(2)?,
            description: row.get(3)?,
            sort_order: row.get(4)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_categories(conn: &Connection) -> Result<Vec<ProductCategory>> {
    let mut stmt = conn.prepare("SELECT id, name, parent_id, description, sort_order, created_at, updated_at FROM product_categories ORDER BY sort_order, name")?;
    
    let categories = stmt.query_map([], |row| {
        Ok(ProductCategory {
            id: row.get(0)?,
            name: row.get(1)?,
            parent_id: row.get(2)?,
            description: row.get(3)?,
            sort_order: row.get(4)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    categories.collect()
}

pub fn update_category(conn: &Connection, id: i64, name: Option<String>, parent_id: Option<i64>, description: Option<String>, sort_order: Option<i64>) -> Result<ProductCategory> {
    let now = Utc::now();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(n) = name {
        updates.push("name = ?");
        sql_params.push(Box::new(n));
    }
    if let Some(pid) = parent_id {
        updates.push("parent_id = ?");
        sql_params.push(Box::new(pid));
    }
    if let Some(desc) = description {
        updates.push("description = ?");
        sql_params.push(Box::new(desc));
    }
    if let Some(so) = sort_order {
        updates.push("sort_order = ?");
        sql_params.push(Box::new(so));
    }
    
    if updates.is_empty() {
        return get_category(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now.to_rfc3339()));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE product_categories SET {} WHERE id = ?", updates.join(", "));
    
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_category(conn, id)
}

pub fn delete_category(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM product_categories WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 库存管理 ====================

pub fn get_inventory(conn: &Connection, product_id: i64, warehouse_id: Option<i64>) -> Result<Option<ProductInventory>> {
    let mut stmt = if warehouse_id.is_some() {
        conn.prepare("SELECT id, product_id, warehouse_id, quantity, reserved_quantity, available_quantity, last_stock_check, created_at, updated_at FROM product_inventory WHERE product_id = ?1 AND warehouse_id = ?2")?
    } else {
        conn.prepare("SELECT id, product_id, warehouse_id, quantity, reserved_quantity, available_quantity, last_stock_check, created_at, updated_at FROM product_inventory WHERE product_id = ?1 AND warehouse_id IS NULL")?
    };
    
    let result = if let Some(wid) = warehouse_id {
        stmt.query_row(params![product_id, wid], |row| {
            Ok(ProductInventory {
                id: row.get(0)?,
                product_id: row.get(1)?,
                warehouse_id: row.get(2)?,
                quantity: row.get(3)?,
                reserved_quantity: row.get(4)?,
                available_quantity: row.get(5)?,
                last_stock_check: row.get::<_, Option<String>>(6)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?).unwrap().with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
            })
        }).ok()
    } else {
        stmt.query_row(params![product_id], |row| {
            Ok(ProductInventory {
                id: row.get(0)?,
                product_id: row.get(1)?,
                warehouse_id: row.get(2)?,
                quantity: row.get(3)?,
                reserved_quantity: row.get(4)?,
                available_quantity: row.get(5)?,
                last_stock_check: row.get::<_, Option<String>>(6)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?).unwrap().with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
            })
        }).ok()
    };
    
    Ok(result)
}

pub fn list_inventory(conn: &Connection, warehouse_id: Option<i64>) -> Result<Vec<ProductInventory>> {
    fn map_inventory_row(row: &rusqlite::Row) -> Result<ProductInventory> {
        Ok(ProductInventory {
            id: row.get(0)?,
            product_id: row.get(1)?,
            warehouse_id: row.get(2)?,
            quantity: row.get(3)?,
            reserved_quantity: row.get(4)?,
            available_quantity: row.get(5)?,
            last_stock_check: row.get::<_, Option<String>>(6)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
        })
    }
    
    let query = if warehouse_id.is_some() {
        "SELECT id, product_id, warehouse_id, quantity, reserved_quantity, available_quantity, last_stock_check, created_at, updated_at FROM product_inventory WHERE warehouse_id = ?1 ORDER BY product_id"
    } else {
        "SELECT id, product_id, warehouse_id, quantity, reserved_quantity, available_quantity, last_stock_check, created_at, updated_at FROM product_inventory ORDER BY product_id"
    };
    
    let mut stmt = conn.prepare(query)?;
    
    if let Some(wid) = warehouse_id {
        let inventory: Vec<ProductInventory> = stmt.query_map(params![wid], |row| map_inventory_row(row))?
            .filter_map(|r| r.ok()).collect();
        Ok(inventory)
    } else {
        let inventory: Vec<ProductInventory> = stmt.query_map([], |row| map_inventory_row(row))?
            .filter_map(|r| r.ok()).collect();
        Ok(inventory)
    }
}

pub fn create_inventory(conn: &Connection, product_id: i64, warehouse_id: Option<i64>, quantity: i64) -> Result<ProductInventory> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO product_inventory (product_id, warehouse_id, quantity, reserved_quantity, last_stock_check, created_at, updated_at) VALUES (?1, ?2, ?3, 0, ?4, ?4, ?4)",
        params![product_id, warehouse_id, quantity, now.to_rfc3339()],
    )?;
    
    let inv_id = conn.last_insert_rowid();
    get_inventory_by_id(conn, inv_id)
}

pub fn get_inventory_by_id(conn: &Connection, id: i64) -> Result<ProductInventory> {
    let mut stmt = conn.prepare("SELECT id, product_id, warehouse_id, quantity, reserved_quantity, available_quantity, last_stock_check, created_at, updated_at FROM product_inventory WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(ProductInventory {
            id: row.get(0)?,
            product_id: row.get(1)?,
            warehouse_id: row.get(2)?,
            quantity: row.get(3)?,
            reserved_quantity: row.get(4)?,
            available_quantity: row.get(5)?,
            last_stock_check: row.get::<_, Option<String>>(6)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn update_inventory_quantity(conn: &Connection, id: i64, quantity: i64, reserved_quantity: Option<i64>) -> Result<ProductInventory> {
    let now = Utc::now();
    
    if let Some(reserved) = reserved_quantity {
        conn.execute(
            "UPDATE product_inventory SET quantity = ?, reserved_quantity = ?, last_stock_check = ?, updated_at = ? WHERE id = ?",
            params![quantity, reserved, now.to_rfc3339(), now.to_rfc3339(), id],
        )?;
    } else {
        conn.execute(
            "UPDATE product_inventory SET quantity = ?, last_stock_check = ?, updated_at = ? WHERE id = ?",
            params![quantity, now.to_rfc3339(), now.to_rfc3339(), id],
        )?;
    }
    
    get_inventory_by_id(conn, id)
}

// ==================== 库存流水 ====================

pub fn create_inventory_transaction(conn: &Connection, input: InventoryTransactionInput) -> Result<InventoryTransaction> {
    let now = Utc::now();
    
    // 获取当前库存
    let inventory = get_inventory(conn, input.product_id, input.warehouse_id)?;
    let before_quantity = inventory.as_ref().map(|i| i.quantity).unwrap_or(0);
    
    // 计算新库存
    let after_quantity = match input.transaction_type.as_str() {
        "in" | "return" => before_quantity + input.quantity,
        "out" => before_quantity - input.quantity,
        "adjustment" => input.quantity, // 调整为指定数量
        "transfer" => before_quantity, // 转移不改变总量
        _ => before_quantity,
    };
    
    // 更新库存
    if let Some(inv) = inventory {
        update_inventory_quantity(conn, inv.id, after_quantity, None)?;
    } else {
        create_inventory(conn, input.product_id, input.warehouse_id, after_quantity)?;
    }
    
    conn.execute(
        "INSERT INTO inventory_transactions (product_id, warehouse_id, transaction_type, quantity, before_quantity, after_quantity, reference_type, reference_id, reason, operator_id, notes, created_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        params![
            input.product_id,
            input.warehouse_id,
            input.transaction_type,
            input.quantity,
            before_quantity,
            after_quantity,
            input.reference_type,
            input.reference_id,
            input.reason,
            input.operator_id,
            input.notes,
            now.to_rfc3339(),
        ],
    )?;
    
    let trans_id = conn.last_insert_rowid();
    get_transaction(conn, trans_id)
}

pub fn get_transaction(conn: &Connection, id: i64) -> Result<InventoryTransaction> {
    let mut stmt = conn.prepare("SELECT id, product_id, warehouse_id, transaction_type, quantity, before_quantity, after_quantity, reference_type, reference_id, reason, operator_id, notes, created_at FROM inventory_transactions WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(InventoryTransaction {
            id: row.get(0)?,
            product_id: row.get(1)?,
            warehouse_id: row.get(2)?,
            transaction_type: row.get(3)?,
            quantity: row.get(4)?,
            before_quantity: row.get(5)?,
            after_quantity: row.get(6)?,
            reference_type: row.get(7)?,
            reference_id: row.get(8)?,
            reason: row.get(9)?,
            operator_id: row.get(10)?,
            notes: row.get(11)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_transactions(conn: &Connection, product_id: Option<i64>, limit: i64, offset: i64) -> Result<Vec<InventoryTransaction>> {
    fn map_transaction_row(row: &rusqlite::Row) -> Result<InventoryTransaction> {
        Ok(InventoryTransaction {
            id: row.get(0)?,
            product_id: row.get(1)?,
            warehouse_id: row.get(2)?,
            transaction_type: row.get(3)?,
            quantity: row.get(4)?,
            before_quantity: row.get(5)?,
            after_quantity: row.get(6)?,
            reference_type: row.get(7)?,
            reference_id: row.get(8)?,
            reason: row.get(9)?,
            operator_id: row.get(10)?,
            notes: row.get(11)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
        })
    }
    
    let query = if product_id.is_some() {
        "SELECT id, product_id, warehouse_id, transaction_type, quantity, before_quantity, after_quantity, reference_type, reference_id, reason, operator_id, notes, created_at FROM inventory_transactions WHERE product_id = ?1 ORDER BY created_at DESC LIMIT ?2 OFFSET ?3"
    } else {
        "SELECT id, product_id, warehouse_id, transaction_type, quantity, before_quantity, after_quantity, reference_type, reference_id, reason, operator_id, notes, created_at FROM inventory_transactions ORDER BY created_at DESC LIMIT ?1 OFFSET ?2"
    };
    
    let mut stmt = conn.prepare(query)?;
    
    if let Some(pid) = product_id {
        let transactions: Vec<InventoryTransaction> = stmt.query_map(params![pid, limit, offset], |row| map_transaction_row(row))?
            .filter_map(|r| r.ok()).collect();
        Ok(transactions)
    } else {
        let transactions: Vec<InventoryTransaction> = stmt.query_map(params![limit, offset], |row| map_transaction_row(row))?
            .filter_map(|r| r.ok()).collect();
        Ok(transactions)
    }
}

// ==================== 仓库管理 ====================

pub fn create_warehouse(conn: &Connection, name: &str, code: &str, address: Option<String>, manager_id: Option<i64>, phone: Option<String>) -> Result<Warehouse> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO warehouses (name, code, address, manager_id, phone, status, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, 'active', ?6, ?6)",
        params![name, code, address, manager_id, phone, now.to_rfc3339()],
    )?;
    
    let warehouse_id = conn.last_insert_rowid();
    get_warehouse(conn, warehouse_id)
}

pub fn get_warehouse(conn: &Connection, id: i64) -> Result<Warehouse> {
    let mut stmt = conn.prepare("SELECT id, name, code, address, manager_id, phone, status, created_at, updated_at FROM warehouses WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(Warehouse {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            address: row.get(3)?,
            manager_id: row.get(4)?,
            phone: row.get(5)?,
            status: row.get(6)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_warehouses(conn: &Connection) -> Result<Vec<Warehouse>> {
    let mut stmt = conn.prepare("SELECT id, name, code, address, manager_id, phone, status, created_at, updated_at FROM warehouses ORDER BY name")?;
    
    let warehouses = stmt.query_map([], |row| {
        Ok(Warehouse {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            address: row.get(3)?,
            manager_id: row.get(4)?,
            phone: row.get(5)?,
            status: row.get(6)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(8)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    warehouses.collect()
}

pub fn update_warehouse(conn: &Connection, id: i64, name: Option<String>, code: Option<String>, address: Option<String>, manager_id: Option<i64>, phone: Option<String>, status: Option<String>) -> Result<Warehouse> {
    let now = Utc::now();
    let mut updates = Vec::new();
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(n) = name {
        updates.push("name = ?");
        sql_params.push(Box::new(n));
    }
    if let Some(c) = code {
        updates.push("code = ?");
        sql_params.push(Box::new(c));
    }
    if let Some(a) = address {
        updates.push("address = ?");
        sql_params.push(Box::new(a));
    }
    if let Some(mid) = manager_id {
        updates.push("manager_id = ?");
        sql_params.push(Box::new(mid));
    }
    if let Some(p) = phone {
        updates.push("phone = ?");
        sql_params.push(Box::new(p));
    }
    if let Some(s) = status {
        updates.push("status = ?");
        sql_params.push(Box::new(s));
    }
    
    if updates.is_empty() {
        return get_warehouse(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now.to_rfc3339()));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE warehouses SET {} WHERE id = ?", updates.join(", "));
    
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_warehouse(conn, id)
}

pub fn delete_warehouse(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM warehouses WHERE id = ?", params![id])?;
    Ok(affected > 0)
}
