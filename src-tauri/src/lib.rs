// ERP 应用 Rust 后端入口

mod user_commands;
mod product_commands;

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
        ])
        .setup(|app| {
            init_db(app.handle())?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
