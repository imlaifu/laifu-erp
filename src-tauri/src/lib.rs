// ERP 应用 Rust 后端入口

mod user_commands;
mod product_commands;
mod inventory_commands;
mod order_commands;
mod customer_commands;
mod supplier_commands;
mod finance_commands;
mod reports_commands;
mod hr_commands;

use rusqlite::Connection;
use tauri::{AppHandle, Manager, State};
use std::sync::Mutex;
use serde::{Deserialize, Serialize};

// 数据库连接状态
pub struct Database(pub Mutex<Connection>);

// ==================== Tauri Commands ====================

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! ERP 系统已就绪。", name)
}

// ==================== 用户相关命令 ====================

#[derive(Debug, Serialize, Deserialize)]
struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct LoginResponse {
    user: user_commands::User,
    token: String,
    expires_at: String,
}

#[tauri::command]
fn login(db: State<Database>, request: LoginRequest) -> Result<LoginResponse, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    
    // 验证用户
    let user = user_commands::get_user_by_username(&conn, &request.username)
        .map_err(|e| e.to_string())?;
    
    // 验证密码
    if !user_commands::verify_password(&request.password, &user.password_hash) {
        return Err("用户名或密码错误".to_string());
    }
    
    // 更新最后登录时间
    user_commands::update_last_login(&conn, user.id).map_err(|e| e.to_string())?;
    
    // 生成 Token (简化实现)
    let token = uuid::Uuid::new_v4().to_string();
    let expires_at = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(24))
        .unwrap()
        .to_rfc3339();
    
    Ok(LoginResponse {
        user,
        token,
        expires_at,
    })
}

#[tauri::command]
fn logout() -> Result<(), String> {
    // 简化实现，实际应使 Token 失效
    Ok(())
}

#[tauri::command]
fn create_user(db: State<Database>, input: user_commands::UserCreateInput) -> Result<user_commands::User, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::create_user(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_user(db: State<Database>, id: i64) -> Result<user_commands::User, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::get_user(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_users(db: State<Database>, limit: i64, offset: i64, status: Option<String>, department_id: Option<i64>, role_id: Option<i64>, search: Option<String>) -> Result<Vec<user_commands::User>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::list_users(&conn, limit, offset).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_user(db: State<Database>, id: i64, input: user_commands::UserUpdateInput) -> Result<user_commands::User, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::update_user(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_user(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::delete_user(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_last_login(db: State<Database>, user_id: i64) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::update_last_login(&conn, user_id).map_err(|e| e.to_string())
}

// ==================== 角色相关命令 ====================

#[tauri::command]
fn create_role(db: State<Database>, name: String, description: Option<String>, permissions: Vec<String>) -> Result<user_commands::Role, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::create_role(&conn, &name, description, permissions).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_role(db: State<Database>, id: i64) -> Result<user_commands::Role, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::get_role(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_roles(db: State<Database>) -> Result<Vec<user_commands::Role>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::list_roles(&conn).map_err(|e| e.to_string())
}

// ==================== 部门相关命令 ====================

#[tauri::command]
fn create_department(db: State<Database>, name: String, parent_id: Option<i64>, manager_id: Option<i64>, description: Option<String>) -> Result<user_commands::Department, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::create_department(&conn, &name, parent_id, manager_id, description).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_department(db: State<Database>, id: i64) -> Result<user_commands::Department, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::get_department(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_departments(db: State<Database>) -> Result<Vec<user_commands::Department>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    user_commands::list_departments(&conn).map_err(|e| e.to_string())
}

// ==================== 产品分类相关命令 ====================

#[tauri::command]
fn create_category(db: State<Database>, input: product_commands::ProductCategoryCreateInput) -> Result<product_commands::ProductCategory, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::create_category(
        &conn,
        &input.name,
        input.parent_id,
        input.description,
        input.sort_order,
    ).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_category(db: State<Database>, id: i64) -> Result<product_commands::ProductCategory, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::get_category(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_categories(db: State<Database>) -> Result<Vec<product_commands::ProductCategory>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::list_categories(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_category(db: State<Database>, id: i64, name: Option<String>, parent_id: Option<i64>, description: Option<String>, sort_order: Option<i64>) -> Result<product_commands::ProductCategory, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::update_category(&conn, id, name, parent_id, description, sort_order).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_category(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::delete_category(&conn, id).map_err(|e| e.to_string())
}

// ==================== 产品相关命令 ====================

#[tauri::command]
fn create_product(db: State<Database>, input: product_commands::ProductCreateInput) -> Result<product_commands::Product, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::create_product(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_product(db: State<Database>, id: i64) -> Result<product_commands::Product, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::get_product(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_products(db: State<Database>, limit: i64, offset: i64, category_id: Option<i64>, status: Option<String>, search: Option<String>) -> Result<Vec<product_commands::Product>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::list_products(&conn, limit, offset, category_id, status, search).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_product(db: State<Database>, id: i64, input: product_commands::ProductUpdateInput) -> Result<product_commands::Product, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::update_product(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_product(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::delete_product(&conn, id).map_err(|e| e.to_string())
}

// ==================== 库存管理相关命令 ====================

#[tauri::command]
fn get_inventory(db: State<Database>, product_id: i64, warehouse_id: Option<i64>) -> Result<Option<product_commands::ProductInventory>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::get_inventory(&conn, product_id, warehouse_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_inventory(db: State<Database>, warehouse_id: Option<i64>) -> Result<Vec<product_commands::ProductInventory>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::list_inventory(&conn, warehouse_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_inventory(db: State<Database>, product_id: i64, warehouse_id: Option<i64>, quantity: i64) -> Result<product_commands::ProductInventory, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::create_inventory(&conn, product_id, warehouse_id, quantity).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_inventory_quantity(db: State<Database>, id: i64, quantity: i64, reserved_quantity: Option<i64>) -> Result<product_commands::ProductInventory, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::update_inventory_quantity(&conn, id, quantity, reserved_quantity).map_err(|e| e.to_string())
}

// ==================== 库存流水相关命令 ====================

#[tauri::command]
fn create_inventory_transaction(db: State<Database>, input: product_commands::InventoryTransactionInput) -> Result<product_commands::InventoryTransaction, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::create_inventory_transaction(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_transaction(db: State<Database>, id: i64) -> Result<product_commands::InventoryTransaction, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::get_transaction(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_transactions(db: State<Database>, product_id: Option<i64>, limit: i64, offset: i64) -> Result<Vec<product_commands::InventoryTransaction>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::list_transactions(&conn, product_id, limit, offset).map_err(|e| e.to_string())
}

// ==================== 仓库管理相关命令 ====================

#[tauri::command]
fn create_warehouse(db: State<Database>, name: String, code: String, address: Option<String>, manager_id: Option<i64>, phone: Option<String>) -> Result<product_commands::Warehouse, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::create_warehouse(&conn, &name, &code, address, manager_id, phone).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_warehouse(db: State<Database>, id: i64) -> Result<product_commands::Warehouse, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::get_warehouse(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_warehouses(db: State<Database>) -> Result<Vec<product_commands::Warehouse>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::list_warehouses(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_warehouse(db: State<Database>, id: i64, name: Option<String>, code: Option<String>, address: Option<String>, manager_id: Option<i64>, phone: Option<String>, status: Option<String>) -> Result<product_commands::Warehouse, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::update_warehouse(&conn, id, name, code, address, manager_id, phone, status).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_warehouse(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    product_commands::delete_warehouse(&conn, id).map_err(|e| e.to_string())
}

// ==================== 库存管理模块命令 (003_inventory.sql) ====================

// 库存预警
#[tauri::command]
fn create_inventory_alert(db: State<Database>, input: inventory_commands::InventoryAlertInput) -> Result<inventory_commands::InventoryAlert, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::create_inventory_alert(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_inventory_alert(db: State<Database>, id: i64) -> Result<inventory_commands::InventoryAlert, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::get_inventory_alert(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_inventory_alerts(db: State<Database>, warehouse_id: Option<i64>, alert_status: Option<String>) -> Result<Vec<inventory_commands::InventoryAlertWithProduct>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::list_inventory_alerts(&conn, warehouse_id, alert_status).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_inventory_alert(db: State<Database>, id: i64, input: inventory_commands::InventoryAlertInput) -> Result<inventory_commands::InventoryAlert, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::update_inventory_alert(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_inventory_alert(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::delete_inventory_alert(&conn, id).map_err(|e| e.to_string())
}

// 库存盘点
#[tauri::command]
fn create_inventory_count(db: State<Database>, input: inventory_commands::InventoryCountInput) -> Result<inventory_commands::InventoryCount, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::create_inventory_count(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_inventory_count(db: State<Database>, id: i64) -> Result<inventory_commands::InventoryCount, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::get_inventory_count(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_inventory_counts(db: State<Database>, warehouse_id: Option<i64>, status: Option<String>) -> Result<Vec<inventory_commands::InventoryCount>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::list_inventory_counts(&conn, warehouse_id, status).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_inventory_count_status(db: State<Database>, id: i64, status: String, operator_id: Option<i64>) -> Result<inventory_commands::InventoryCount, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::update_inventory_count_status(&conn, id, status, operator_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_inventory_count(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::delete_inventory_count(&conn, id).map_err(|e| e.to_string())
}

// 库存盘点明细
#[tauri::command]
fn create_inventory_count_item(db: State<Database>, input: inventory_commands::InventoryCountItemInput) -> Result<inventory_commands::InventoryCountItem, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::create_inventory_count_item(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_inventory_count_item(db: State<Database>, id: i64) -> Result<inventory_commands::InventoryCountItem, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::get_inventory_count_item(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_inventory_count_items(db: State<Database>, count_id: i64) -> Result<Vec<inventory_commands::InventoryCountItem>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::list_inventory_count_items(&conn, count_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_inventory_count_item_status(db: State<Database>, id: i64, status: String) -> Result<inventory_commands::InventoryCountItem, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::update_inventory_count_item_status(&conn, id, status).map_err(|e| e.to_string())
}

// 库存调拨
#[tauri::command]
fn create_inventory_transfer(db: State<Database>, input: inventory_commands::InventoryTransferInput) -> Result<inventory_commands::InventoryTransfer, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::create_inventory_transfer(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_inventory_transfer(db: State<Database>, id: i64) -> Result<inventory_commands::InventoryTransfer, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::get_inventory_transfer(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_inventory_transfers(db: State<Database>, from_warehouse_id: Option<i64>, to_warehouse_id: Option<i64>, status: Option<String>) -> Result<Vec<inventory_commands::InventoryTransfer>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::list_inventory_transfers(&conn, from_warehouse_id, to_warehouse_id, status).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_inventory_transfer_status(db: State<Database>, id: i64, status: String, operator_id: Option<i64>) -> Result<inventory_commands::InventoryTransfer, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::update_inventory_transfer_status(&conn, id, status, operator_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_inventory_transfer(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::delete_inventory_transfer(&conn, id).map_err(|e| e.to_string())
}

// 库存调拨明细
#[tauri::command]
fn create_inventory_transfer_item(db: State<Database>, input: inventory_commands::InventoryTransferItemInput) -> Result<inventory_commands::InventoryTransferItem, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::create_inventory_transfer_item(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_inventory_transfer_item(db: State<Database>, id: i64) -> Result<inventory_commands::InventoryTransferItem, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::get_inventory_transfer_item(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_inventory_transfer_items(db: State<Database>, transfer_id: i64) -> Result<Vec<inventory_commands::InventoryTransferItem>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::list_inventory_transfer_items(&conn, transfer_id).map_err(|e| e.to_string())
}

// 库存统计
#[tauri::command]
fn get_inventory_summary(db: State<Database>, warehouse_id: Option<i64>) -> Result<inventory_commands::InventorySummary, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::get_inventory_summary(&conn, warehouse_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_low_stock_products(db: State<Database>, warehouse_id: Option<i64>) -> Result<Vec<inventory_commands::LowStockProduct>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    inventory_commands::get_low_stock_products(&conn, warehouse_id).map_err(|e| e.to_string())
}

// ==================== 订单管理相关命令 ====================

// 客户 (使用 order_commands 中的简化版本用于订单关联)
// 完整的客户管理请使用下方的客户管理模块命令

// ==================== 客户管理模块命令 (独立模块) ====================

// 客户 CRUD
#[tauri::command]
fn create_customer(db: State<Database>, input: customer_commands::CustomerCreateInput) -> Result<customer_commands::Customer, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::create_customer(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_customer(db: State<Database>, id: i64) -> Result<customer_commands::Customer, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::get_customer(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_customers(db: State<Database>, params: customer_commands::CustomerListParams) -> Result<customer_commands::CustomerListResponse, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::list_customers(&conn, params).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_customer(db: State<Database>, id: i64, input: customer_commands::CustomerUpdateInput) -> Result<customer_commands::Customer, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::update_customer(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_customer(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::delete_customer(&conn, id).map_err(|e| e.to_string())
}

// 客户统计
#[tauri::command]
fn get_customer_statistics(db: State<Database>) -> Result<serde_json::Value, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::get_customer_statistics(&conn).map_err(|e| e.to_string())
}

// ==================== 供应商管理模块命令 ====================

// 供应商 CRUD
#[tauri::command]
fn create_supplier(db: State<Database>, input: supplier_commands::SupplierCreateInput) -> Result<supplier_commands::Supplier, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::create_supplier(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_supplier(db: State<Database>, id: i64) -> Result<supplier_commands::Supplier, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::get_supplier(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_suppliers(db: State<Database>, params: supplier_commands::SupplierListParams) -> Result<supplier_commands::SupplierListResponse, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::list_suppliers(&conn, params).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_supplier(db: State<Database>, id: i64, input: supplier_commands::SupplierUpdateInput) -> Result<supplier_commands::Supplier, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::update_supplier(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_supplier(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::delete_supplier(&conn, id).map_err(|e| e.to_string())
}

// 供应商联系人
#[tauri::command]
fn create_supplier_contact(db: State<Database>, input: supplier_commands::SupplierContactCreateInput) -> Result<supplier_commands::SupplierContact, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::create_supplier_contact(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_supplier_contact(db: State<Database>, id: i64) -> Result<supplier_commands::SupplierContact, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::get_supplier_contact(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_supplier_contacts(db: State<Database>, supplier_id: i64) -> Result<Vec<supplier_commands::SupplierContact>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::list_supplier_contacts(&conn, supplier_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_supplier_contact(db: State<Database>, id: i64, input: supplier_commands::SupplierContactUpdateInput) -> Result<supplier_commands::SupplierContact, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::update_supplier_contact(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_supplier_contact(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::delete_supplier_contact(&conn, id).map_err(|e| e.to_string())
}

// 供应商联系记录
#[tauri::command]
fn create_supplier_interaction(db: State<Database>, input: supplier_commands::SupplierInteractionCreateInput) -> Result<supplier_commands::SupplierInteraction, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::create_supplier_interaction(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_supplier_interactions(db: State<Database>, supplier_id: i64, limit: i64, offset: i64) -> Result<Vec<supplier_commands::SupplierInteraction>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::list_supplier_interactions(&conn, supplier_id, limit, offset).map_err(|e| e.to_string())
}

// 供应商分级
#[tauri::command]
fn list_supplier_levels(db: State<Database>) -> Result<Vec<supplier_commands::SupplierLevel>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::list_supplier_levels(&conn).map_err(|e| e.to_string())
}

// 供应商标签
#[tauri::command]
fn list_supplier_tags(db: State<Database>) -> Result<Vec<supplier_commands::SupplierTag>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::list_supplier_tags(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_supplier_tag(db: State<Database>, name: String, color: Option<String>, description: Option<String>) -> Result<supplier_commands::SupplierTag, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::create_supplier_tag(&conn, &name, color, description).map_err(|e| e.to_string())
}

// 供应商评估
#[tauri::command]
fn create_supplier_evaluation(db: State<Database>, input: supplier_commands::SupplierEvaluationCreateInput) -> Result<supplier_commands::SupplierEvaluation, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::create_supplier_evaluation(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_supplier_evaluation(db: State<Database>, id: i64) -> Result<supplier_commands::SupplierEvaluation, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::get_supplier_evaluation(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_supplier_evaluations(db: State<Database>, params: supplier_commands::SupplierEvaluationListParams) -> Result<Vec<supplier_commands::SupplierEvaluation>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::list_supplier_evaluations(&conn, params).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_supplier_evaluation(db: State<Database>, id: i64, input: supplier_commands::SupplierEvaluationUpdateInput) -> Result<supplier_commands::SupplierEvaluation, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::update_supplier_evaluation(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_supplier_evaluation(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::delete_supplier_evaluation(&conn, id).map_err(|e| e.to_string())
}

// 供应商产品
#[tauri::command]
fn create_supplier_product(db: State<Database>, input: supplier_commands::SupplierProductCreateInput) -> Result<supplier_commands::SupplierProduct, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::create_supplier_product(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_supplier_product(db: State<Database>, id: i64) -> Result<supplier_commands::SupplierProduct, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::get_supplier_product(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_supplier_products(db: State<Database>, supplier_id: i64) -> Result<Vec<supplier_commands::SupplierProduct>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::list_supplier_products(&conn, supplier_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_supplier_product(db: State<Database>, id: i64, input: supplier_commands::SupplierProductUpdateInput) -> Result<supplier_commands::SupplierProduct, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::update_supplier_product(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_supplier_product(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::delete_supplier_product(&conn, id).map_err(|e| e.to_string())
}

// 供应商统计
#[tauri::command]
fn get_supplier_statistics(db: State<Database>) -> Result<serde_json::Value, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    supplier_commands::get_supplier_statistics(&conn).map_err(|e| e.to_string())
}

// ==================== 财务管理模块命令 ====================

#[tauri::command]
fn create_finance_transaction(db: State<Database>, input: finance_commands::FinanceTransactionCreateInput) -> Result<finance_commands::FinanceTransaction, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::create_finance_transaction(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_finance_transaction(db: State<Database>, id: i64) -> Result<finance_commands::FinanceTransaction, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::get_finance_transaction(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_finance_transactions(db: State<Database>, params: finance_commands::FinanceTransactionListParams) -> Result<finance_commands::FinanceTransactionListResponse, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::list_finance_transactions(&conn, params).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_finance_transaction(db: State<Database>, id: i64, input: finance_commands::FinanceTransactionUpdateInput) -> Result<finance_commands::FinanceTransaction, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::update_finance_transaction(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_finance_transaction(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::delete_finance_transaction(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_finance_account(db: State<Database>, input: finance_commands::FinanceAccountCreateInput) -> Result<finance_commands::FinanceAccount, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::create_finance_account(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_finance_account(db: State<Database>, id: i64) -> Result<finance_commands::FinanceAccount, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::get_finance_account(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_finance_accounts(db: State<Database>) -> Result<Vec<finance_commands::FinanceAccount>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::list_finance_accounts(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_finance_account(db: State<Database>, id: i64, input: finance_commands::FinanceAccountUpdateInput) -> Result<finance_commands::FinanceAccount, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::update_finance_account(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_finance_account(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::delete_finance_account(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_finance_category(db: State<Database>, input: finance_commands::FinanceCategoryCreateInput) -> Result<finance_commands::FinanceCategory, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::create_finance_category(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_finance_category(db: State<Database>, id: i64) -> Result<finance_commands::FinanceCategory, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::get_finance_category(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_finance_categories(db: State<Database>, category_type: Option<String>) -> Result<Vec<finance_commands::FinanceCategory>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::list_finance_categories(&conn, category_type).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_finance_category(db: State<Database>, id: i64, input: finance_commands::FinanceCategoryUpdateInput) -> Result<finance_commands::FinanceCategory, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::update_finance_category(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_finance_category(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::delete_finance_category(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_finance_invoice(db: State<Database>, input: finance_commands::FinanceInvoiceCreateInput) -> Result<finance_commands::FinanceInvoice, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::create_finance_invoice(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_finance_invoice(db: State<Database>, id: i64) -> Result<finance_commands::FinanceInvoice, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::get_finance_invoice(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_finance_invoices(db: State<Database>, params: finance_commands::FinanceInvoiceListParams) -> Result<finance_commands::FinanceInvoiceListResponse, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::list_finance_invoices(&conn, params).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_finance_invoice(db: State<Database>, id: i64, input: finance_commands::FinanceInvoiceUpdateInput) -> Result<finance_commands::FinanceInvoice, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::update_finance_invoice(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_finance_invoice(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::delete_finance_invoice(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_finance_invoice_item(db: State<Database>, input: finance_commands::FinanceInvoiceItemCreateInput) -> Result<finance_commands::FinanceInvoiceItem, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::create_finance_invoice_item(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_finance_invoice_items(db: State<Database>, invoice_id: i64) -> Result<Vec<finance_commands::FinanceInvoiceItem>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::list_finance_invoice_items(&conn, invoice_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_finance_invoice_item(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::delete_finance_invoice_item(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_finance_receivables_payables(db: State<Database>, params: finance_commands::FinanceReceivablePayableListParams) -> Result<Vec<finance_commands::FinanceReceivablePayable>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::list_finance_receivables_payables(&conn, params).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_finance_report_configs(db: State<Database>) -> Result<Vec<finance_commands::FinanceReportConfig>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::list_finance_report_configs(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_finance_statistics(db: State<Database>, start_date: String, end_date: String) -> Result<finance_commands::FinanceStatistics, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    finance_commands::get_finance_statistics(&conn, &start_date, &end_date).map_err(|e| e.to_string())
}

// ==================== 客户管理模块命令 (独立模块) ====================

// 客户联系记录
#[tauri::command]
fn create_customer_contact(db: State<Database>, input: customer_commands::CustomerContactCreateInput) -> Result<customer_commands::CustomerContact, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::create_customer_contact(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_customer_contact(db: State<Database>, id: i64) -> Result<customer_commands::CustomerContact, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::get_customer_contact(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_customer_contacts(db: State<Database>, customer_id: i64) -> Result<Vec<customer_commands::CustomerContact>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::list_customer_contacts(&conn, customer_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_customer_contact(db: State<Database>, id: i64, input: customer_commands::CustomerContactUpdateInput) -> Result<customer_commands::CustomerContact, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::update_customer_contact(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_customer_contact(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::delete_customer_contact(&conn, id).map_err(|e| e.to_string())
}

// 客户等级配置
#[tauri::command]
fn create_customer_level_config(db: State<Database>, input: customer_commands::CustomerLevelConfigCreateInput) -> Result<customer_commands::CustomerLevelConfig, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::create_customer_level_config(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_customer_level_config(db: State<Database>, id: i64) -> Result<customer_commands::CustomerLevelConfig, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::get_customer_level_config(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_customer_level_configs(db: State<Database>, status: Option<String>) -> Result<Vec<customer_commands::CustomerLevelConfig>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::list_customer_level_configs(&conn, status).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_customer_level_config(db: State<Database>, id: i64, input: customer_commands::CustomerLevelConfigUpdateInput) -> Result<customer_commands::CustomerLevelConfig, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::update_customer_level_config(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_customer_level_config(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::delete_customer_level_config(&conn, id).map_err(|e| e.to_string())
}

// 客户标签
#[tauri::command]
fn create_customer_tag(db: State<Database>, input: customer_commands::CustomerTagCreateInput) -> Result<customer_commands::CustomerTag, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::create_customer_tag(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_customer_tag(db: State<Database>, id: i64) -> Result<customer_commands::CustomerTag, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::get_customer_tag(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_customer_tags(db: State<Database>) -> Result<Vec<customer_commands::CustomerTag>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::list_customer_tags(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_customer_tag(db: State<Database>, id: i64, input: customer_commands::CustomerTagUpdateInput) -> Result<customer_commands::CustomerTag, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::update_customer_tag(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_customer_tag(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::delete_customer_tag(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn add_customer_tag(db: State<Database>, customer_id: i64, tag_id: i64) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::add_customer_tag(&conn, customer_id, tag_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn remove_customer_tag(db: State<Database>, customer_id: i64, tag_id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::remove_customer_tag(&conn, customer_id, tag_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_customer_tags(db: State<Database>, customer_id: i64) -> Result<Vec<customer_commands::CustomerTag>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::get_customer_tags(&conn, customer_id).map_err(|e| e.to_string())
}

// 客户跟进计划
#[tauri::command]
fn create_customer_follow_up(db: State<Database>, input: customer_commands::CustomerFollowUpCreateInput) -> Result<customer_commands::CustomerFollowUp, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::create_customer_follow_up(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_customer_follow_up(db: State<Database>, id: i64) -> Result<customer_commands::CustomerFollowUp, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::get_customer_follow_up(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_customer_follow_ups(db: State<Database>, params: customer_commands::CustomerFollowUpListParams) -> Result<Vec<customer_commands::CustomerFollowUp>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::list_customer_follow_ups(&conn, params).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_customer_follow_up(db: State<Database>, id: i64, input: customer_commands::CustomerFollowUpUpdateInput) -> Result<customer_commands::CustomerFollowUp, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::update_customer_follow_up(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_customer_follow_up(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::delete_customer_follow_up(&conn, id).map_err(|e| e.to_string())
}

// 客户统计
#[tauri::command]
fn get_customer_statistics(db: State<Database>) -> Result<customer_commands::CustomerStatistics, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    customer_commands::get_customer_statistics(&conn).map_err(|e| e.to_string())
}

// 销售订单
#[tauri::command]
fn create_sales_order(db: State<Database>, input: order_commands::SalesOrderCreateInput) -> Result<order_commands::SalesOrder, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::create_sales_order(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_sales_order(db: State<Database>, id: i64) -> Result<order_commands::SalesOrder, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::get_sales_order(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_sales_orders(db: State<Database>, params: order_commands::SalesOrderListParams) -> Result<Vec<order_commands::SalesOrder>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::list_sales_orders(&conn, params).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_sales_order(db: State<Database>, id: i64, input: order_commands::SalesOrderUpdateInput) -> Result<order_commands::SalesOrder, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::update_sales_order(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_sales_order(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::delete_sales_order(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_sales_order_items(db: State<Database>, orderId: i64) -> Result<Vec<order_commands::SalesOrderItem>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::get_sales_order_items(&conn, orderId).map_err(|e| e.to_string())
}

// 采购订单
#[tauri::command]
fn create_purchase_order(db: State<Database>, input: order_commands::PurchaseOrderCreateInput) -> Result<order_commands::PurchaseOrder, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::create_purchase_order(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_purchase_order(db: State<Database>, id: i64) -> Result<order_commands::PurchaseOrder, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::get_purchase_order(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_purchase_orders(db: State<Database>, params: order_commands::PurchaseOrderListParams) -> Result<Vec<order_commands::PurchaseOrder>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::list_purchase_orders(&conn, params).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_purchase_order(db: State<Database>, id: i64, input: order_commands::PurchaseOrderUpdateInput) -> Result<order_commands::PurchaseOrder, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::update_purchase_order(&conn, id, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_purchase_order(db: State<Database>, id: i64) -> Result<bool, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::delete_purchase_order(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_purchase_order_items(db: State<Database>, orderId: i64) -> Result<Vec<order_commands::PurchaseOrderItem>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::get_purchase_order_items(&conn, orderId).map_err(|e| e.to_string())
}

// 订单状态历史
#[tauri::command]
fn add_order_status_history(db: State<Database>, input: order_commands::OrderStatusChangeInput) -> Result<order_commands::OrderStatusHistory, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::add_order_status_history(&conn, input).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_order_status_history(db: State<Database>, orderType: String, orderId: i64) -> Result<Vec<order_commands::OrderStatusHistory>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    order_commands::list_order_status_history(&conn, &orderType, orderId).map_err(|e| e.to_string())
}
// ==================== 应用初始化 ====================

fn init_db(app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let db_path = app_handle
        .path()
        .app_data_dir()?
        .join("erp.db");
    
    // 确保目录存在
    std::fs::create_dir_all(db_path.parent().unwrap())?;
    
    let conn = Connection::open(&db_path)?;
    
    // 运行迁移
    let migrations = vec![
        include_str!("../migrations/001_users.sql"),
        include_str!("../migrations/002_products.sql"),
        include_str!("../migrations/003_inventory.sql"),
        include_str!("../migrations/004_orders.sql"),
        include_str!("../migrations/005_customers.sql"),
    ];
    
    for migration in migrations {
        conn.execute_batch(migration)?;
    }
    
    app_handle.manage(Database(Mutex::new(conn)));
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            login,
            logout,
            create_user,
            get_user,
            list_users,
            update_user,
            delete_user,
            update_last_login,
            create_role,
            get_role,
            list_roles,
            create_department,
            get_department,
            list_departments,
            // 产品分类
            create_category,
            get_category,
            list_categories,
            update_category,
            delete_category,
            // 产品
            create_product,
            get_product,
            list_products,
            update_product,
            delete_product,
            // 库存管理
            get_inventory,
            list_inventory,
            create_inventory,
            update_inventory_quantity,
            // 库存流水
            create_inventory_transaction,
            get_transaction,
            list_transactions,
            // 仓库管理
            create_warehouse,
            get_warehouse,
            list_warehouses,
            update_warehouse,
            delete_warehouse,
            // 库存管理模块 - 预警
            create_inventory_alert,
            get_inventory_alert,
            list_inventory_alerts,
            update_inventory_alert,
            delete_inventory_alert,
            // 库存管理模块 - 盘点
            create_inventory_count,
            get_inventory_count,
            list_inventory_counts,
            update_inventory_count_status,
            delete_inventory_count,
            // 库存管理模块 - 盘点明细
            create_inventory_count_item,
            get_inventory_count_item,
            list_inventory_count_items,
            update_inventory_count_item_status,
            // 库存管理模块 - 调拨
            create_inventory_transfer,
            get_inventory_transfer,
            list_inventory_transfers,
            update_inventory_transfer_status,
            delete_inventory_transfer,
            // 库存管理模块 - 调拨明细
            create_inventory_transfer_item,
            get_inventory_transfer_item,
            list_inventory_transfer_items,
            // 库存管理模块 - 统计
            get_inventory_summary,
            get_low_stock_products,
            // 客户管理 - 客户 CRUD
            create_customer,
            get_customer,
            list_customers,
            update_customer,
            delete_customer,
            // 客户管理 - 联系记录
            create_customer_contact,
            get_customer_contact,
            list_customer_contacts,
            update_customer_contact,
            delete_customer_contact,
            // 客户管理 - 等级配置
            create_customer_level_config,
            get_customer_level_config,
            list_customer_level_configs,
            update_customer_level_config,
            delete_customer_level_config,
            // 客户管理 - 标签
            create_customer_tag,
            get_customer_tag,
            list_customer_tags,
            update_customer_tag,
            delete_customer_tag,
            add_customer_tag,
            remove_customer_tag,
            get_customer_tags,
            // 客户管理 - 跟进计划
            create_customer_follow_up,
            get_customer_follow_up,
            list_customer_follow_ups,
            update_customer_follow_up,
            delete_customer_follow_up,
            // 客户管理 - 统计
            get_customer_statistics,
            // 供应商管理 - CRUD
            create_supplier,
            get_supplier,
            list_suppliers,
            update_supplier,
            delete_supplier,
            // 供应商管理 - 联系人
            create_supplier_contact,
            get_supplier_contact,
            list_supplier_contacts,
            update_supplier_contact,
            delete_supplier_contact,
            // 供应商管理 - 联系记录
            create_supplier_interaction,
            list_supplier_interactions,
            // 供应商管理 - 分级
            list_supplier_levels,
            // 供应商管理 - 标签
            list_supplier_tags,
            create_supplier_tag,
            // 供应商管理 - 评估
            create_supplier_evaluation,
            get_supplier_evaluation,
            list_supplier_evaluations,
            update_supplier_evaluation,
            delete_supplier_evaluation,
            // 供应商管理 - 产品
            create_supplier_product,
            get_supplier_product,
            list_supplier_products,
            update_supplier_product,
            delete_supplier_product,
            // 供应商管理 - 统计
            get_supplier_statistics,
            // 财务管理 - 收支记录
            create_finance_transaction,
            get_finance_transaction,
            list_finance_transactions,
            update_finance_transaction,
            delete_finance_transaction,
            // 财务管理 - 会计科目
            create_finance_account,
            get_finance_account,
            list_finance_accounts,
            update_finance_account,
            delete_finance_account,
            // 财务管理 - 收支分类
            create_finance_category,
            get_finance_category,
            list_finance_categories,
            update_finance_category,
            delete_finance_category,
            // 财务管理 - 发票管理
            create_finance_invoice,
            get_finance_invoice,
            list_finance_invoices,
            update_finance_invoice,
            delete_finance_invoice,
            // 财务管理 - 发票明细
            create_finance_invoice_item,
            list_finance_invoice_items,
            delete_finance_invoice_item,
            // 财务管理 - 应收应付
            list_finance_receivables_payables,
            // 财务管理 - 报表配置
            list_finance_report_configs,
            // 财务管理 - 统计
            get_finance_statistics,
            // 销售订单
            create_sales_order,
            get_sales_order,
            list_sales_orders,
            update_sales_order,
            delete_sales_order,
            get_sales_order_items,
            // 采购订单
            create_purchase_order,
            get_purchase_order,
            list_purchase_orders,
            update_purchase_order,
            delete_purchase_order,
            get_purchase_order_items,
            // 订单状态历史
            add_order_status_history,
            list_order_status_history,
            // 报表管理 - 报表定义
            reports_commands::get_report_definitions,
            reports_commands::get_report_definition,
            reports_commands::create_report_definition,
            reports_commands::update_report_definition,
            reports_commands::delete_report_definition,
            // 报表管理 - 报表执行
            reports_commands::execute_report,
            reports_commands::execute_dynamic_query,
            reports_commands::get_report_executions,
            // 报表管理 - Dashboard widgets
            reports_commands::get_dashboard_widgets,
            reports_commands::create_dashboard_widget,
            reports_commands::update_dashboard_widget,
            reports_commands::delete_dashboard_widget,
            reports_commands::get_dashboard_data,
            // 报表管理 - 保存报表
            reports_commands::get_saved_reports,
            reports_commands::create_saved_report,
            reports_commands::update_saved_report,
            reports_commands::delete_saved_report,
            reports_commands::execute_saved_report,
            // 报表管理 - 导出历史
            reports_commands::create_export_record,
            reports_commands::update_export_record,
            reports_commands::get_export_history,
            // 报表管理 - 统计快照
            reports_commands::upsert_stats_snapshot,
            reports_commands::get_stats_snapshot,
            // 人力资源管理 - 员工
            hr_commands::create_employee,
            hr_commands::get_employee,
            hr_commands::list_employees,
            hr_commands::update_employee,
            hr_commands::delete_employee,
            // 人力资源管理 - 部门
            hr_commands::get_departments,
            hr_commands::create_department,
            // 人力资源管理 - 考勤
            hr_commands::get_attendance_records,
            hr_commands::check_in,
            hr_commands::check_out,
            // 人力资源管理 - 请假
            hr_commands::get_leave_types,
            hr_commands::get_leave_applications,
            hr_commands::create_leave_application,
            hr_commands::approve_leave_application,
            // 人力资源管理 - 薪资
            hr_commands::get_salary_records,
            hr_commands::create_salary_record,
            hr_commands::pay_salary,
            // 人力资源管理 - 绩效
            hr_commands::get_performance_evaluations,
            hr_commands::create_performance_evaluation,
            hr_commands::submit_evaluation,
            // 人力资源管理 - 培训
            hr_commands::get_training_records,
            hr_commands::create_training_record,
            // 人力资源管理 - 统计
            hr_commands::get_hr_statistics,
        ])
        .setup(|app| {
            init_db(app.handle())?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
