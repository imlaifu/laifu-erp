// 用户管理模块 Rust Commands
// 实现完整的 CRUD 操作

use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: i64,
    pub username: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub phone: Option<String>,
    pub department_id: Option<i64>,
    pub role_id: Option<i64>,
    pub status: String,
    pub last_login_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserCreateInput {
    pub username: String,
    pub email: String,
    pub password: String,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub phone: Option<String>,
    pub department_id: Option<i64>,
    pub role_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserUpdateInput {
    pub username: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub phone: Option<String>,
    pub department_id: Option<i64>,
    pub role_id: Option<i64>,
    pub status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Role {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub permissions: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Department {
    pub id: i64,
    pub name: String,
    pub parent_id: Option<i64>,
    pub manager_id: Option<i64>,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// ==================== 用户 CRUD ====================

pub fn create_user(conn: &Connection, input: UserCreateInput) -> Result<User> {
    let password_hash = hash_password(&input.password);
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO users (username, email, password_hash, display_name, avatar_url, phone, department_id, role_id, status, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'active', ?9, ?9)",
        params![
            input.username,
            input.email,
            password_hash,
            input.display_name,
            input.avatar_url,
            input.phone,
            input.department_id,
            input.role_id,
            now.to_rfc3339()
        ],
    )?;
    
    let user_id = conn.last_insert_rowid();
    get_user(conn, user_id)
}

pub fn get_user(conn: &Connection, id: i64) -> Result<User> {
    let mut stmt = conn.prepare(
        "SELECT id, username, email, password_hash, display_name, avatar_url, phone, 
                department_id, role_id, status, last_login_at, created_at, updated_at, deleted_at 
         FROM users WHERE id = ?1 AND deleted_at IS NULL"
    )?;
    
    let user = stmt.query_row(params![id], |row| {
        Ok(User {
            id: row.get(0)?,
            username: row.get(1)?,
            email: row.get(2)?,
            password_hash: row.get(3)?,
            display_name: row.get(4)?,
            avatar_url: row.get(5)?,
            phone: row.get(6)?,
            department_id: row.get(7)?,
            role_id: row.get(8)?,
            status: row.get(9)?,
            last_login_at: row.get::<_, Option<String>>(10)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(13)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    Ok(user)
}

pub fn get_user_by_username(conn: &Connection, username: &str) -> Result<User> {
    let mut stmt = conn.prepare(
        "SELECT id, username, email, password_hash, display_name, avatar_url, phone, 
                department_id, role_id, status, last_login_at, created_at, updated_at, deleted_at 
         FROM users WHERE username = ?1 AND deleted_at IS NULL"
    )?;
    
    let user = stmt.query_row(params![username], |row| {
        Ok(User {
            id: row.get(0)?,
            username: row.get(1)?,
            email: row.get(2)?,
            password_hash: row.get(3)?,
            display_name: row.get(4)?,
            avatar_url: row.get(5)?,
            phone: row.get(6)?,
            department_id: row.get(7)?,
            role_id: row.get(8)?,
            status: row.get(9)?,
            last_login_at: row.get::<_, Option<String>>(10)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(13)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    Ok(user)
}

pub fn list_users(conn: &Connection, limit: i64, offset: i64) -> Result<Vec<User>> {
    let mut stmt = conn.prepare(
        "SELECT id, username, email, password_hash, display_name, avatar_url, phone, 
                department_id, role_id, status, last_login_at, created_at, updated_at, deleted_at 
         FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT ?1 OFFSET ?2"
    )?;
    
    let users = stmt.query_map(params![limit, offset], |row| {
        Ok(User {
            id: row.get(0)?,
            username: row.get(1)?,
            email: row.get(2)?,
            password_hash: row.get(3)?,
            display_name: row.get(4)?,
            avatar_url: row.get(5)?,
            phone: row.get(6)?,
            department_id: row.get(7)?,
            role_id: row.get(8)?,
            status: row.get(9)?,
            last_login_at: row.get::<_, Option<String>>(10)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(12)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(13)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    users.collect()
}

pub fn update_user(conn: &Connection, id: i64, input: UserUpdateInput) -> Result<User> {
    let now = Utc::now();
    let mut updates = Vec::new();
    let mut params: Vec<&dyn rusqlite::types::ToSql> = Vec::new();
    
    if let Some(username) = input.username {
        updates.push("username = ?");
        params.push(&username);
    }
    if let Some(email) = input.email {
        updates.push("email = ?");
        params.push(&email);
    }
    if let Some(password) = input.password {
        updates.push("password_hash = ?");
        params.push(&hash_password(&password));
    }
    if let Some(display_name) = input.display_name {
        updates.push("display_name = ?");
        params.push(&display_name);
    }
    if let Some(avatar_url) = input.avatar_url {
        updates.push("avatar_url = ?");
        params.push(&avatar_url);
    }
    if let Some(phone) = input.phone {
        updates.push("phone = ?");
        params.push(&phone);
    }
    if let Some(department_id) = input.department_id {
        updates.push("department_id = ?");
        params.push(&department_id);
    }
    if let Some(role_id) = input.role_id {
        updates.push("role_id = ?");
        params.push(&role_id);
    }
    if let Some(status) = input.status {
        updates.push("status = ?");
        params.push(&status);
    }
    
    if updates.is_empty() {
        return get_user(conn, id);
    }
    
    updates.push("updated_at = ?");
    params.push(&now.to_rfc3339());
    params.push(&id);
    
    let sql = format!("UPDATE users SET {} WHERE id = ?", updates.join(", "));
    
    // Need to convert params to the right format for execute
    match updates.len() {
        1 => conn.execute(&sql, params![params[0], params[1]]),
        2 => conn.execute(&sql, params![params[0], params[1], params[2]]),
        3 => conn.execute(&sql, params![params[0], params[1], params[2], params[3]]),
        4 => conn.execute(&sql, params![params[0], params[1], params[2], params[3], params[4]]),
        5 => conn.execute(&sql, params![params[0], params[1], params[2], params[3], params[4], params[5]]),
        6 => conn.execute(&sql, params![params[0], params[1], params[2], params[3], params[4], params[5], params[6]]),
        7 => conn.execute(&sql, params![params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7]]),
        8 => conn.execute(&sql, params![params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[8]]),
        9 => conn.execute(&sql, params![params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7], params[8], params[9]]),
        _ => conn.execute(&sql, rusqlite::params_from_iter(params.iter())),
    }?;
    
    get_user(conn, id)
}

pub fn delete_user(conn: &Connection, id: i64) -> Result<bool> {
    let now = Utc::now();
    let affected = conn.execute(
        "UPDATE users SET deleted_at = ?, updated_at = ? WHERE id = ?",
        params![now.to_rfc3339(), now.to_rfc3339(), id],
    )?;
    Ok(affected > 0)
}

// ==================== 角色 CRUD ====================

pub fn create_role(conn: &Connection, name: &str, description: Option<String>, permissions: Vec<String>) -> Result<Role> {
    let now = Utc::now();
    let permissions_json = serde_json::to_string(&permissions).unwrap_or_default();
    
    conn.execute(
        "INSERT INTO roles (name, description, permissions, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?4)",
        params![name, description, permissions_json, now.to_rfc3339()],
    )?;
    
    let role_id = conn.last_insert_rowid();
    get_role(conn, role_id)
}

pub fn get_role(conn: &Connection, id: i64) -> Result<Role> {
    let mut stmt = conn.prepare("SELECT id, name, description, permissions, created_at, updated_at FROM roles WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(Role {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            permissions: serde_json::from_str(&row.get::<_, String>(3)?).unwrap_or_default(),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_roles(conn: &Connection) -> Result<Vec<Role>> {
    let mut stmt = conn.prepare("SELECT id, name, description, permissions, created_at, updated_at FROM roles ORDER BY name")?;
    
    let roles = stmt.query_map([], |row| {
        Ok(Role {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            permissions: serde_json::from_str(&row.get::<_, String>(3)?).unwrap_or_default(),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(4)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    roles.collect()
}

// ==================== 部门 CRUD ====================

pub fn create_department(conn: &Connection, name: &str, parent_id: Option<i64>, manager_id: Option<i64>, description: Option<String>) -> Result<Department> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO departments (name, parent_id, manager_id, description, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?5)",
        params![name, parent_id, manager_id, description, now.to_rfc3339()],
    )?;
    
    let dept_id = conn.last_insert_rowid();
    get_department(conn, dept_id)
}

pub fn get_department(conn: &Connection, id: i64) -> Result<Department> {
    let mut stmt = conn.prepare("SELECT id, name, parent_id, manager_id, description, created_at, updated_at FROM departments WHERE id = ?1")?;
    
    stmt.query_row(params![id], |row| {
        Ok(Department {
            id: row.get(0)?,
            name: row.get(1)?,
            parent_id: row.get(2)?,
            manager_id: row.get(3)?,
            description: row.get(4)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_departments(conn: &Connection) -> Result<Vec<Department>> {
    let mut stmt = conn.prepare("SELECT id, name, parent_id, manager_id, description, created_at, updated_at FROM departments ORDER BY name")?;
    
    let depts = stmt.query_map([], |row| {
        Ok(Department {
            id: row.get(0)?,
            name: row.get(1)?,
            parent_id: row.get(2)?,
            manager_id: row.get(3)?,
            description: row.get(4)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    depts.collect()
}

// ==================== 辅助函数 ====================

fn hash_password(password: &str) -> String {
    // 简化实现，实际应使用 bcrypt 或 argon2
    format!("hashed_{}", password)
}

pub fn verify_password(password: &str, hash: &str) -> bool {
    // 简化实现
    hash == format!("hashed_{}", password)
}

pub fn update_last_login(conn: &Connection, user_id: i64) -> Result<()> {
    let now = Utc::now();
    conn.execute(
        "UPDATE users SET last_login_at = ? WHERE id = ?",
        params![now.to_rfc3339(), user_id],
    )?;
    Ok(())
}
