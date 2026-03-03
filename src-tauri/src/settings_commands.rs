// 系统设置模块 Rust Commands
// 实现完整的 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

// ==================== 系统参数 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SystemSetting {
    pub id: i64,
    pub setting_key: String,
    pub setting_value: Option<String>,
    pub setting_type: String,
    pub category: String,
    pub description: Option<String>,
    pub is_editable: bool,
    pub is_encrypted: bool,
    pub created_by: Option<i64>,
    pub updated_by: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemSettingCreateInput {
    pub setting_key: String,
    pub setting_value: Option<String>,
    pub setting_type: Option<String>,
    pub category: Option<String>,
    pub description: Option<String>,
    pub is_editable: Option<bool>,
    pub is_encrypted: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemSettingUpdateInput {
    pub setting_value: Option<String>,
    pub description: Option<String>,
    pub updated_by: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemSettingListParams {
    pub category: Option<String>,
    pub setting_type: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 数据字典 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DataDictionary {
    pub id: i64,
    pub dict_code: String,
    pub dict_name: String,
    pub dict_type: String,
    pub description: Option<String>,
    pub is_active: bool,
    pub created_by: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DataDictionaryItem {
    pub id: i64,
    pub dict_id: i64,
    pub item_key: String,
    pub item_value: String,
    pub item_label: String,
    pub sort_order: i64,
    pub color: Option<String>,
    pub icon: Option<String>,
    pub is_default: bool,
    pub is_active: bool,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DataDictionaryCreateInput {
    pub dict_code: String,
    pub dict_name: String,
    pub dict_type: Option<String>,
    pub description: Option<String>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DataDictionaryItemCreateInput {
    pub dict_id: i64,
    pub item_key: String,
    pub item_value: String,
    pub item_label: String,
    pub sort_order: Option<i64>,
    pub color: Option<String>,
    pub icon: Option<String>,
    pub is_default: Option<bool>,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DataDictionaryListParams {
    pub dict_type: Option<String>,
    pub is_active: Option<bool>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 操作日志 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OperationLog {
    pub id: i64,
    pub log_no: String,
    pub user_id: Option<i64>,
    pub user_name: Option<String>,
    pub action: String,
    pub module: Option<String>,
    pub sub_module: Option<String>,
    pub operation_type: String,
    pub request_method: Option<String>,
    pub request_url: Option<String>,
    pub request_params: Option<String>,
    pub response_status: Option<i64>,
    pub response_data: Option<String>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub duration_ms: Option<i64>,
    pub status: String,
    pub error_message: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OperationLogCreateInput {
    pub user_id: Option<i64>,
    pub user_name: Option<String>,
    pub action: String,
    pub module: Option<String>,
    pub sub_module: Option<String>,
    pub operation_type: Option<String>,
    pub request_method: Option<String>,
    pub request_url: Option<String>,
    pub request_params: Option<String>,
    pub response_status: Option<i64>,
    pub response_data: Option<String>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub duration_ms: Option<i64>,
    pub status: Option<String>,
    pub error_message: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OperationLogListParams {
    pub user_id: Option<i64>,
    pub action: Option<String>,
    pub module: Option<String>,
    pub operation_type: Option<String>,
    pub status: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 审计日志 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuditLog {
    pub id: i64,
    pub audit_no: String,
    pub user_id: Option<i64>,
    pub user_name: Option<String>,
    pub action: String,
    pub resource_type: String,
    pub resource_id: Option<i64>,
    pub old_value: Option<String>,
    pub new_value: Option<String>,
    pub changed_fields: Option<String>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuditLogCreateInput {
    pub user_id: Option<i64>,
    pub user_name: Option<String>,
    pub action: String,
    pub resource_type: String,
    pub resource_id: Option<i64>,
    pub old_value: Option<String>,
    pub new_value: Option<String>,
    pub changed_fields: Option<String>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuditLogListParams {
    pub user_id: Option<i64>,
    pub action: Option<String>,
    pub resource_type: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 备份配置 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BackupConfig {
    pub id: i64,
    pub config_name: String,
    pub backup_type: String,
    pub backup_target: String,
    pub backup_path: Option<String>,
    pub cloud_provider: Option<String>,
    pub cloud_bucket: Option<String>,
    pub cloud_region: Option<String>,
    pub schedule_type: String,
    pub schedule_time: Option<String>,
    pub schedule_days: Option<String>,
    pub retention_days: i64,
    pub compression_enabled: bool,
    pub encryption_enabled: bool,
    pub notification_enabled: bool,
    pub notification_emails: Option<String>,
    pub is_active: bool,
    pub last_backup_at: Option<DateTime<Utc>>,
    pub last_backup_status: Option<String>,
    pub created_by: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BackupConfigCreateInput {
    pub config_name: String,
    pub backup_type: Option<String>,
    pub backup_target: Option<String>,
    pub backup_path: Option<String>,
    pub cloud_provider: Option<String>,
    pub cloud_bucket: Option<String>,
    pub cloud_region: Option<String>,
    pub schedule_type: Option<String>,
    pub schedule_time: Option<String>,
    pub schedule_days: Option<String>,
    pub retention_days: Option<i64>,
    pub compression_enabled: Option<bool>,
    pub encryption_enabled: Option<bool>,
    pub notification_enabled: Option<bool>,
    pub notification_emails: Option<String>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BackupConfigListParams {
    pub backup_type: Option<String>,
    pub is_active: Option<bool>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 权限配置 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PermissionConfig {
    pub id: i64,
    pub role_id: i64,
    pub role_name: Option<String>,
    pub module_code: String,
    pub module_name: String,
    pub can_view: bool,
    pub can_create: bool,
    pub can_edit: bool,
    pub can_delete: bool,
    pub can_export: bool,
    pub can_import: bool,
    pub can_approve: bool,
    pub custom_permissions: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PermissionConfigCreateInput {
    pub role_id: i64,
    pub module_code: String,
    pub module_name: String,
    pub can_view: Option<bool>,
    pub can_create: Option<bool>,
    pub can_edit: Option<bool>,
    pub can_delete: Option<bool>,
    pub can_export: Option<bool>,
    pub can_import: Option<bool>,
    pub can_approve: Option<bool>,
    pub custom_permissions: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PermissionConfigListParams {
    pub role_id: Option<i64>,
    pub module_code: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 通知配置 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NotificationConfig {
    pub id: i64,
    pub notification_type: String,
    pub notification_name: String,
    pub notification_title: Option<String>,
    pub notification_template: Option<String>,
    pub enabled_channels: Option<String>,
    pub recipient_roles: Option<String>,
    pub is_active: bool,
    pub created_by: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NotificationConfigCreateInput {
    pub notification_type: String,
    pub notification_name: String,
    pub notification_title: Option<String>,
    pub notification_template: Option<String>,
    pub enabled_channels: Option<String>,
    pub recipient_roles: Option<String>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NotificationConfigListParams {
    pub notification_type: Option<String>,
    pub is_active: Option<bool>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 系统参数 Commands ====================

#[tauri::command]
pub fn create_system_setting(conn: Connection, input: SystemSettingCreateInput) -> Result<SystemSetting, String> {
    let now = Utc::now();
    let setting_type = input.setting_type.unwrap_or_else(|| "string".to_string());
    let category = input.category.unwrap_or_else(|| "general".to_string());
    let is_editable = input.is_editable.unwrap_or(true);
    let is_encrypted = input.is_encrypted.unwrap_or(false);

    conn.execute(
        "INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description, is_editable, is_encrypted, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            input.setting_key, input.setting_value, setting_type, category, input.description,
            is_editable as i64, is_encrypted as i64, now, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_system_setting(conn, id)
}

#[tauri::command]
pub fn get_system_setting(conn: Connection, id: i64) -> Result<SystemSetting, String> {
    let mut stmt = conn.prepare(
        "SELECT id, setting_key, setting_value, setting_type, category, description, is_editable, is_encrypted,
                created_by, updated_by, created_at, updated_at
         FROM system_settings WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(SystemSetting {
            id: row.get(0)?,
            setting_key: row.get(1)?,
            setting_value: row.get(2)?,
            setting_type: row.get(3)?,
            category: row.get(4)?,
            description: row.get(5)?,
            is_editable: row.get::<_, i64>(6)? == 1,
            is_encrypted: row.get::<_, i64>(7)? == 1,
            created_by: row.get(8)?,
            updated_by: row.get(9)?,
            created_at: row.get(10)?,
            updated_at: row.get(11)?,
        })
    } else {
        Err("System setting not found".to_string())
    }
}

#[tauri::command]
pub fn list_system_settings(conn: Connection, params: SystemSettingListParams) -> Result<Vec<SystemSetting>, String> {
    let mut sql = String::from(
        "SELECT id, setting_key, setting_value, setting_type, category, description, is_editable, is_encrypted,
                created_by, updated_by, created_at, updated_at
         FROM system_settings WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(category) = params.category {
        sql.push_str(" AND category = ?");
        args.push(("category", &category));
    }
    if let Some(setting_type) = params.setting_type {
        sql.push_str(" AND setting_type = ?");
        args.push(("setting_type", &setting_type));
    }

    sql.push_str(" ORDER BY category, setting_key");

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    if let Some(offset) = params.offset {
        sql.push_str(&format!(" OFFSET {}", offset));
    }

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(rusqlite::params_from_iter(args.iter().map(|(_, v)| *v)), |row| {
        Ok(SystemSetting {
            id: row.get(0)?,
            setting_key: row.get(1)?,
            setting_value: row.get(2)?,
            setting_type: row.get(3)?,
            category: row.get(4)?,
            description: row.get(5)?,
            is_editable: row.get::<_, i64>(6)? == 1,
            is_encrypted: row.get::<_, i64>(7)? == 1,
            created_by: row.get(8)?,
            updated_by: row.get(9)?,
            created_at: row.get(10)?,
            updated_at: row.get(11)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_system_setting(conn: Connection, id: i64, input: SystemSettingUpdateInput) -> Result<SystemSetting, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE system_settings SET setting_value = ?1, description = ?2, updated_by = ?3, updated_at = ?4 WHERE id = ?5",
        params![input.setting_value, input.description, input.updated_by, now, id],
    ).map_err(|e| e.to_string())?;

    get_system_setting(conn, id)
}

#[tauri::command]
pub fn delete_system_setting(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM system_settings WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
pub fn get_setting_value(conn: Connection, key: String) -> Result<Option<String>, String> {
    let mut stmt = conn.prepare("SELECT setting_value FROM system_settings WHERE setting_key = ?1")
        .map_err(|e| e.to_string())?;
    
    let mut rows = stmt.query(params![key]).map_err(|e| e.to_string())?;
    
    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(row.get(0)?)
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub fn update_setting_value(conn: Connection, key: String, value: String) -> Result<bool, String> {
    let now = Utc::now();
    
    conn.execute(
        "UPDATE system_settings SET setting_value = ?1, updated_at = ?2 WHERE setting_key = ?3",
        params![value, now, key],
    ).map_err(|e| e.to_string())?;
    
    Ok(true)
}

// ==================== 数据字典 Commands ====================

#[tauri::command]
pub fn create_data_dictionary(conn: Connection, input: DataDictionaryCreateInput) -> Result<DataDictionary, String> {
    let now = Utc::now();
    let dict_type = input.dict_type.unwrap_or_else(|| "custom".to_string());
    let is_active = input.is_active.unwrap_or(true);

    conn.execute(
        "INSERT INTO data_dictionary (dict_code, dict_name, dict_type, description, is_active, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![input.dict_code, input.dict_name, dict_type, input.description, is_active as i64, now, now],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_data_dictionary(conn, id)
}

#[tauri::command]
pub fn get_data_dictionary(conn: Connection, id: i64) -> Result<DataDictionary, String> {
    let mut stmt = conn.prepare(
        "SELECT id, dict_code, dict_name, dict_type, description, is_active, created_by, created_at, updated_at
         FROM data_dictionary WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(DataDictionary {
            id: row.get(0)?,
            dict_code: row.get(1)?,
            dict_name: row.get(2)?,
            dict_type: row.get(3)?,
            description: row.get(4)?,
            is_active: row.get::<_, i64>(5)? == 1,
            created_by: row.get(6)?,
            created_at: row.get(7)?,
            updated_at: row.get(8)?,
        })
    } else {
        Err("Data dictionary not found".to_string())
    }
}

#[tauri::command]
pub fn list_data_dictionaries(conn: Connection, params: DataDictionaryListParams) -> Result<Vec<DataDictionary>, String> {
    let mut sql = String::from(
        "SELECT id, dict_code, dict_name, dict_type, description, is_active, created_by, created_at, updated_at
         FROM data_dictionary WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(dict_type) = params.dict_type {
        sql.push_str(" AND dict_type = ?");
        args.push(("dict_type", &dict_type));
    }
    if let Some(is_active) = params.is_active {
        sql.push_str(" AND is_active = ?");
        args.push(("is_active", &(is_active as i64)));
    }

    sql.push_str(" ORDER BY dict_code");

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    if let Some(offset) = params.offset {
        sql.push_str(&format!(" OFFSET {}", offset));
    }

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(rusqlite::params_from_iter(args.iter().map(|(_, v)| *v)), |row| {
        Ok(DataDictionary {
            id: row.get(0)?,
            dict_code: row.get(1)?,
            dict_name: row.get(2)?,
            dict_type: row.get(3)?,
            description: row.get(4)?,
            is_active: row.get::<_, i64>(5)? == 1,
            created_by: row.get(6)?,
            created_at: row.get(7)?,
            updated_at: row.get(8)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_data_dictionary(conn: Connection, id: i64, input: DataDictionaryCreateInput) -> Result<DataDictionary, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE data_dictionary SET dict_name = ?1, dict_type = ?2, description = ?3, is_active = ?4, updated_at = ?5 WHERE id = ?6",
        params![input.dict_name, input.dict_type.unwrap_or_else(|| "custom".to_string()), input.description, input.is_active.unwrap_or(true) as i64, now, id],
    ).map_err(|e| e.to_string())?;

    get_data_dictionary(conn, id)
}

#[tauri::command]
pub fn delete_data_dictionary(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM data_dictionary WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
pub fn create_data_dictionary_item(conn: Connection, input: DataDictionaryItemCreateInput) -> Result<DataDictionaryItem, String> {
    let now = Utc::now();
    let is_default = input.is_default.unwrap_or(false);
    let is_active = true;

    conn.execute(
        "INSERT INTO data_dictionary_items (dict_id, item_key, item_value, item_label, sort_order, color, icon, is_default, is_active, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            input.dict_id, input.item_key, input.item_value, input.item_label,
            input.sort_order.unwrap_or(0), input.color, input.icon, is_default as i64, is_active as i64, now, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_data_dictionary_item(conn, id)
}

#[tauri::command]
pub fn get_data_dictionary_item(conn: Connection, id: i64) -> Result<DataDictionaryItem, String> {
    let mut stmt = conn.prepare(
        "SELECT id, dict_id, item_key, item_value, item_label, sort_order, color, icon, is_default, is_active, created_at, updated_at
         FROM data_dictionary_items WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(DataDictionaryItem {
            id: row.get(0)?,
            dict_id: row.get(1)?,
            item_key: row.get(2)?,
            item_value: row.get(3)?,
            item_label: row.get(4)?,
            sort_order: row.get(5)?,
            color: row.get(6)?,
            icon: row.get(7)?,
            is_default: row.get::<_, i64>(8)? == 1,
            is_active: row.get::<_, i64>(9)? == 1,
            description: None,
            created_at: row.get(10)?,
            updated_at: row.get(11)?,
        })
    } else {
        Err("Data dictionary item not found".to_string())
    }
}

#[tauri::command]
pub fn list_data_dictionary_items(conn: Connection, dict_id: i64) -> Result<Vec<DataDictionaryItem>, String> {
    let mut stmt = conn.prepare(
        "SELECT id, dict_id, item_key, item_value, item_label, sort_order, color, icon, is_default, is_active, created_at, updated_at
         FROM data_dictionary_items WHERE dict_id = ?1 ORDER BY sort_order"
    ).map_err(|e| e.to_string())?;

    let rows = stmt.query_map(params![dict_id], |row| {
        Ok(DataDictionaryItem {
            id: row.get(0)?,
            dict_id: row.get(1)?,
            item_key: row.get(2)?,
            item_value: row.get(3)?,
            item_label: row.get(4)?,
            sort_order: row.get(5)?,
            color: row.get(6)?,
            icon: row.get(7)?,
            is_default: row.get::<_, i64>(8)? == 1,
            is_active: row.get::<_, i64>(9)? == 1,
            description: None,
            created_at: row.get(10)?,
            updated_at: row.get(11)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_data_dictionary_item(conn: Connection, id: i64, input: DataDictionaryItemCreateInput) -> Result<DataDictionaryItem, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE data_dictionary_items SET item_key = ?1, item_value = ?2, item_label = ?3, sort_order = ?4, color = ?5, icon = ?6, is_default = ?7, updated_at = ?8 WHERE id = ?9",
        params![
            input.item_key, input.item_value, input.item_label, input.sort_order.unwrap_or(0),
            input.color, input.icon, input.is_default.unwrap_or(false) as i64, now, id
        ],
    ).map_err(|e| e.to_string())?;

    get_data_dictionary_item(conn, id)
}

#[tauri::command]
pub fn delete_data_dictionary_item(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM data_dictionary_items WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

// ==================== 操作日志 Commands ====================

#[tauri::command]
pub fn create_operation_log(conn: Connection, input: OperationLogCreateInput) -> Result<OperationLog, String> {
    let now = Utc::now();
    let log_no = format!("LOG-{}-{:06}", now.format("%Y%m%d"), conn.last_insert_rowid() + 1);
    let operation_type = input.operation_type.unwrap_or_else(|| "other".to_string());
    let status = input.status.unwrap_or_else(|| "success".to_string());

    conn.execute(
        "INSERT INTO operation_logs (log_no, user_id, user_name, action, module, sub_module, operation_type,
                request_method, request_url, request_params, response_status, response_data, ip_address,
                user_agent, duration_ms, status, error_message, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18)",
        params![
            log_no, input.user_id, input.user_name, input.action, input.module, input.sub_module,
            operation_type, input.request_method, input.request_url, input.request_params,
            input.response_status, input.response_data, input.ip_address, input.user_agent,
            input.duration_ms, status, input.error_message, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_operation_log(conn, id)
}

#[tauri::command]
pub fn get_operation_log(conn: Connection, id: i64) -> Result<OperationLog, String> {
    let mut stmt = conn.prepare(
        "SELECT id, log_no, user_id, user_name, action, module, sub_module, operation_type,
                request_method, request_url, request_params, response_status, response_data,
                ip_address, user_agent, duration_ms, status, error_message, created_at
         FROM operation_logs WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(OperationLog {
            id: row.get(0)?,
            log_no: row.get(1)?,
            user_id: row.get(2)?,
            user_name: row.get(3)?,
            action: row.get(4)?,
            module: row.get(5)?,
            sub_module: row.get(6)?,
            operation_type: row.get(7)?,
            request_method: row.get(8)?,
            request_url: row.get(9)?,
            request_params: row.get(10)?,
            response_status: row.get(11)?,
            response_data: row.get(12)?,
            ip_address: row.get(13)?,
            user_agent: row.get(14)?,
            duration_ms: row.get(15)?,
            status: row.get(16)?,
            error_message: row.get(17)?,
            created_at: row.get(18)?,
        })
    } else {
        Err("Operation log not found".to_string())
    }
}

#[tauri::command]
pub fn list_operation_logs(conn: Connection, params: OperationLogListParams) -> Result<Vec<OperationLog>, String> {
    let mut sql = String::from(
        "SELECT id, log_no, user_id, user_name, action, module, sub_module, operation_type,
                request_method, request_url, request_params, response_status, response_data,
                ip_address, user_agent, duration_ms, status, error_message, created_at
         FROM operation_logs WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(user_id) = params.user_id {
        sql.push_str(" AND user_id = ?");
        args.push(("user_id", &user_id));
    }
    if let Some(action) = params.action {
        sql.push_str(" AND action = ?");
        args.push(("action", &action));
    }
    if let Some(module) = params.module {
        sql.push_str(" AND module = ?");
        args.push(("module", &module));
    }
    if let Some(operation_type) = params.operation_type {
        sql.push_str(" AND operation_type = ?");
        args.push(("operation_type", &operation_type));
    }
    if let Some(status) = params.status {
        sql.push_str(" AND status = ?");
        args.push(("status", &status));
    }
    if let Some(start_date) = params.start_date {
        sql.push_str(" AND created_at >= ?");
        args.push(("start_date", &start_date));
    }
    if let Some(end_date) = params.end_date {
        sql.push_str(" AND created_at <= ?");
        args.push(("end_date", &end_date));
    }

    sql.push_str(" ORDER BY created_at DESC");

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    if let Some(offset) = params.offset {
        sql.push_str(&format!(" OFFSET {}", offset));
    }

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(rusqlite::params_from_iter(args.iter().map(|(_, v)| *v)), |row| {
        Ok(OperationLog {
            id: row.get(0)?,
            log_no: row.get(1)?,
            user_id: row.get(2)?,
            user_name: row.get(3)?,
            action: row.get(4)?,
            module: row.get(5)?,
            sub_module: row.get(6)?,
            operation_type: row.get(7)?,
            request_method: row.get(8)?,
            request_url: row.get(9)?,
            request_params: row.get(10)?,
            response_status: row.get(11)?,
            response_data: row.get(12)?,
            ip_address: row.get(13)?,
            user_agent: row.get(14)?,
            duration_ms: row.get(15)?,
            status: row.get(16)?,
            error_message: row.get(17)?,
            created_at: row.get(18)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

// ==================== 审计日志 Commands ====================

#[tauri::command]
pub fn create_audit_log(conn: Connection, input: AuditLogCreateInput) -> Result<AuditLog, String> {
    let now = Utc::now();
    let audit_no = format!("AUDIT-{}-{:06}", now.format("%Y%m%d"), conn.last_insert_rowid() + 1);

    conn.execute(
        "INSERT INTO audit_logs (audit_no, user_id, user_name, action, resource_type, resource_id,
                old_value, new_value, changed_fields, ip_address, user_agent, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        params![
            audit_no, input.user_id, input.user_name, input.action, input.resource_type,
            input.resource_id, input.old_value, input.new_value, input.changed_fields,
            input.ip_address, input.user_agent, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_audit_log(conn, id)
}

#[tauri::command]
pub fn get_audit_log(conn: Connection, id: i64) -> Result<AuditLog, String> {
    let mut stmt = conn.prepare(
        "SELECT id, audit_no, user_id, user_name, action, resource_type, resource_id,
                old_value, new_value, changed_fields, ip_address, user_agent, created_at
         FROM audit_logs WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(AuditLog {
            id: row.get(0)?,
            audit_no: row.get(1)?,
            user_id: row.get(2)?,
            user_name: row.get(3)?,
            action: row.get(4)?,
            resource_type: row.get(5)?,
            resource_id: row.get(6)?,
            old_value: row.get(7)?,
            new_value: row.get(8)?,
            changed_fields: row.get(9)?,
            ip_address: row.get(10)?,
            user_agent: row.get(11)?,
            created_at: row.get(12)?,
        })
    } else {
        Err("Audit log not found".to_string())
    }
}

#[tauri::command]
pub fn list_audit_logs(conn: Connection, params: AuditLogListParams) -> Result<Vec<AuditLog>, String> {
    let mut sql = String::from(
        "SELECT id, audit_no, user_id, user_name, action, resource_type, resource_id,
                old_value, new_value, changed_fields, ip_address, user_agent, created_at
         FROM audit_logs WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(user_id) = params.user_id {
        sql.push_str(" AND user_id = ?");
        args.push(("user_id", &user_id));
    }
    if let Some(action) = params.action {
        sql.push_str(" AND action = ?");
        args.push(("action", &action));
    }
    if let Some(resource_type) = params.resource_type {
        sql.push_str(" AND resource_type = ?");
        args.push(("resource_type", &resource_type));
    }
    if let Some(start_date) = params.start_date {
        sql.push_str(" AND created_at >= ?");
        args.push(("start_date", &start_date));
    }
    if let Some(end_date) = params.end_date {
        sql.push_str(" AND created_at <= ?");
        args.push(("end_date", &end_date));
    }

    sql.push_str(" ORDER BY created_at DESC");

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    if let Some(offset) = params.offset {
        sql.push_str(&format!(" OFFSET {}", offset));
    }

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(rusqlite::params_from_iter(args.iter().map(|(_, v)| *v)), |row| {
        Ok(AuditLog {
            id: row.get(0)?,
            audit_no: row.get(1)?,
            user_id: row.get(2)?,
            user_name: row.get(3)?,
            action: row.get(4)?,
            resource_type: row.get(5)?,
            resource_id: row.get(6)?,
            old_value: row.get(7)?,
            new_value: row.get(8)?,
            changed_fields: row.get(9)?,
            ip_address: row.get(10)?,
            user_agent: row.get(11)?,
            created_at: row.get(12)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

// ==================== 备份配置 Commands ====================

#[tauri::command]
pub fn create_backup_config(conn: Connection, input: BackupConfigCreateInput) -> Result<BackupConfig, String> {
    let now = Utc::now();
    let backup_type = input.backup_type.unwrap_or_else(|| "full".to_string());
    let backup_target = input.backup_target.unwrap_or_else(|| "local".to_string());
    let schedule_type = input.schedule_type.unwrap_or_else(|| "manual".to_string());
    let retention_days = input.retention_days.unwrap_or(30);
    let compression_enabled = input.compression_enabled.unwrap_or(true);
    let encryption_enabled = input.encryption_enabled.unwrap_or(false);
    let notification_enabled = input.notification_enabled.unwrap_or(false);
    let is_active = input.is_active.unwrap_or(true);

    conn.execute(
        "INSERT INTO backup_configs (config_name, backup_type, backup_target, backup_path, cloud_provider,
                cloud_bucket, cloud_region, schedule_type, schedule_time, schedule_days, retention_days,
                compression_enabled, encryption_enabled, notification_enabled, notification_emails, is_active,
                created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?17)",
        params![
            input.config_name, backup_type, backup_target, input.backup_path, input.cloud_provider,
            input.cloud_bucket, input.cloud_region, schedule_type, input.schedule_time, input.schedule_days,
            retention_days, compression_enabled as i64, encryption_enabled as i64, notification_enabled as i64,
            input.notification_emails, is_active as i64, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_backup_config(conn, id)
}

#[tauri::command]
pub fn get_backup_config(conn: Connection, id: i64) -> Result<BackupConfig, String> {
    let mut stmt = conn.prepare(
        "SELECT id, config_name, backup_type, backup_target, backup_path, cloud_provider, cloud_bucket,
                cloud_region, schedule_type, schedule_time, schedule_days, retention_days, compression_enabled,
                encryption_enabled, notification_enabled, notification_emails, is_active, last_backup_at,
                last_backup_status, created_by, created_at, updated_at
         FROM backup_configs WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(BackupConfig {
            id: row.get(0)?,
            config_name: row.get(1)?,
            backup_type: row.get(2)?,
            backup_target: row.get(3)?,
            backup_path: row.get(4)?,
            cloud_provider: row.get(5)?,
            cloud_bucket: row.get(6)?,
            cloud_region: row.get(7)?,
            schedule_type: row.get(8)?,
            schedule_time: row.get(9)?,
            schedule_days: row.get(10)?,
            retention_days: row.get(11)?,
            compression_enabled: row.get::<_, i64>(12)? == 1,
            encryption_enabled: row.get::<_, i64>(13)? == 1,
            notification_enabled: row.get::<_, i64>(14)? == 1,
            notification_emails: row.get(15)?,
            is_active: row.get::<_, i64>(16)? == 1,
            last_backup_at: row.get(17)?,
            last_backup_status: row.get(18)?,
            created_by: row.get(19)?,
            created_at: row.get(20)?,
            updated_at: row.get(21)?,
        })
    } else {
        Err("Backup config not found".to_string())
    }
}

#[tauri::command]
pub fn list_backup_configs(conn: Connection, params: BackupConfigListParams) -> Result<Vec<BackupConfig>, String> {
    let mut sql = String::from(
        "SELECT id, config_name, backup_type, backup_target, backup_path, cloud_provider, cloud_bucket,
                cloud_region, schedule_type, schedule_time, schedule_days, retention_days, compression_enabled,
                encryption_enabled, notification_enabled, notification_emails, is_active, last_backup_at,
                last_backup_status, created_by, created_at, updated_at
         FROM backup_configs WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(backup_type) = params.backup_type {
        sql.push_str(" AND backup_type = ?");
        args.push(("backup_type", &backup_type));
    }
    if let Some(is_active) = params.is_active {
        sql.push_str(" AND is_active = ?");
        args.push(("is_active", &(is_active as i64)));
    }

    sql.push_str(" ORDER BY created_at DESC");

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    if let Some(offset) = params.offset {
        sql.push_str(&format!(" OFFSET {}", offset));
    }

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(rusqlite::params_from_iter(args.iter().map(|(_, v)| *v)), |row| {
        Ok(BackupConfig {
            id: row.get(0)?,
            config_name: row.get(1)?,
            backup_type: row.get(2)?,
            backup_target: row.get(3)?,
            backup_path: row.get(4)?,
            cloud_provider: row.get(5)?,
            cloud_bucket: row.get(6)?,
            cloud_region: row.get(7)?,
            schedule_type: row.get(8)?,
            schedule_time: row.get(9)?,
            schedule_days: row.get(10)?,
            retention_days: row.get(11)?,
            compression_enabled: row.get::<_, i64>(12)? == 1,
            encryption_enabled: row.get::<_, i64>(13)? == 1,
            notification_enabled: row.get::<_, i64>(14)? == 1,
            notification_emails: row.get(15)?,
            is_active: row.get::<_, i64>(16)? == 1,
            last_backup_at: row.get(17)?,
            last_backup_status: row.get(18)?,
            created_by: row.get(19)?,
            created_at: row.get(20)?,
            updated_at: row.get(21)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_backup_config(conn: Connection, id: i64, input: BackupConfigCreateInput) -> Result<BackupConfig, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE backup_configs SET config_name = ?1, backup_type = ?2, backup_target = ?3, backup_path = ?4,
                cloud_provider = ?5, cloud_bucket = ?6, cloud_region = ?7, schedule_type = ?8, schedule_time = ?9,
                schedule_days = ?10, retention_days = ?11, compression_enabled = ?12, encryption_enabled = ?13,
                notification_enabled = ?14, notification_emails = ?15, is_active = ?16, updated_at = ?17 WHERE id = ?18",
        params![
            input.config_name, input.backup_type.unwrap_or_else(|| "full".to_string()),
            input.backup_target.unwrap_or_else(|| "local".to_string()), input.backup_path, input.cloud_provider,
            input.cloud_bucket, input.cloud_region, input.schedule_type.unwrap_or_else(|| "manual".to_string()),
            input.schedule_time, input.schedule_days, input.retention_days.unwrap_or(30),
            input.compression_enabled.unwrap_or(true) as i64, input.encryption_enabled.unwrap_or(false) as i64,
            input.notification_enabled.unwrap_or(false) as i64, input.notification_emails,
            input.is_active.unwrap_or(true) as i64, now, id
        ],
    ).map_err(|e| e.to_string())?;

    get_backup_config(conn, id)
}

#[tauri::command]
pub fn delete_backup_config(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM backup_configs WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

// ==================== 权限配置 Commands ====================

#[tauri::command]
pub fn create_permission_config(conn: Connection, input: PermissionConfigCreateInput) -> Result<PermissionConfig, String> {
    let now = Utc::now();

    conn.execute(
        "INSERT INTO permission_configs (role_id, module_code, module_name, can_view, can_create, can_edit,
                can_delete, can_export, can_import, can_approve, custom_permissions, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?12)",
        params![
            input.role_id, input.module_code, input.module_name,
            input.can_view.unwrap_or(false) as i64, input.can_create.unwrap_or(false) as i64,
            input.can_edit.unwrap_or(false) as i64, input.can_delete.unwrap_or(false) as i64,
            input.can_export.unwrap_or(false) as i64, input.can_import.unwrap_or(false) as i64,
            input.can_approve.unwrap_or(false) as i64, input.custom_permissions, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_permission_config(conn, id)
}

#[tauri::command]
pub fn get_permission_config(conn: Connection, id: i64) -> Result<PermissionConfig, String> {
    let mut stmt = conn.prepare(
        "SELECT id, role_id, module_code, module_name, can_view, can_create, can_edit, can_delete,
                can_export, can_import, can_approve, custom_permissions, created_at, updated_at
         FROM permission_configs WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(PermissionConfig {
            id: row.get(0)?,
            role_id: row.get(1)?,
            role_name: None,
            module_code: row.get(2)?,
            module_name: row.get(3)?,
            can_view: row.get::<_, i64>(4)? == 1,
            can_create: row.get::<_, i64>(5)? == 1,
            can_edit: row.get::<_, i64>(6)? == 1,
            can_delete: row.get::<_, i64>(7)? == 1,
            can_export: row.get::<_, i64>(8)? == 1,
            can_import: row.get::<_, i64>(9)? == 1,
            can_approve: row.get::<_, i64>(10)? == 1,
            custom_permissions: row.get(11)?,
            created_at: row.get(12)?,
            updated_at: row.get(13)?,
        })
    } else {
        Err("Permission config not found".to_string())
    }
}

#[tauri::command]
pub fn list_permission_configs(conn: Connection, params: PermissionConfigListParams) -> Result<Vec<PermissionConfig>, String> {
    let mut sql = String::from(
        "SELECT id, role_id, module_code, module_name, can_view, can_create, can_edit, can_delete,
                can_export, can_import, can_approve, custom_permissions, created_at, updated_at
         FROM permission_configs WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(role_id) = params.role_id {
        sql.push_str(" AND role_id = ?");
        args.push(("role_id", &role_id));
    }
    if let Some(module_code) = params.module_code {
        sql.push_str(" AND module_code = ?");
        args.push(("module_code", &module_code));
    }

    sql.push_str(" ORDER BY module_code");

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    if let Some(offset) = params.offset {
        sql.push_str(&format!(" OFFSET {}", offset));
    }

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(rusqlite::params_from_iter(args.iter().map(|(_, v)| *v)), |row| {
        Ok(PermissionConfig {
            id: row.get(0)?,
            role_id: row.get(1)?,
            role_name: None,
            module_code: row.get(2)?,
            module_name: row.get(3)?,
            can_view: row.get::<_, i64>(4)? == 1,
            can_create: row.get::<_, i64>(5)? == 1,
            can_edit: row.get::<_, i64>(6)? == 1,
            can_delete: row.get::<_, i64>(7)? == 1,
            can_export: row.get::<_, i64>(8)? == 1,
            can_import: row.get::<_, i64>(9)? == 1,
            can_approve: row.get::<_, i64>(10)? == 1,
            custom_permissions: row.get(11)?,
            created_at: row.get(12)?,
            updated_at: row.get(13)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_permission_config(conn: Connection, id: i64, input: PermissionConfigCreateInput) -> Result<PermissionConfig, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE permission_configs SET can_view = ?1, can_create = ?2, can_edit = ?3, can_delete = ?4,
                can_export = ?5, can_import = ?6, can_approve = ?7, custom_permissions = ?8, updated_at = ?9 WHERE id = ?10",
        params![
            input.can_view.unwrap_or(false) as i64, input.can_create.unwrap_or(false) as i64,
            input.can_edit.unwrap_or(false) as i64, input.can_delete.unwrap_or(false) as i64,
            input.can_export.unwrap_or(false) as i64, input.can_import.unwrap_or(false) as i64,
            input.can_approve.unwrap_or(false) as i64, input.custom_permissions, now, id
        ],
    ).map_err(|e| e.to_string())?;

    get_permission_config(conn, id)
}

#[tauri::command]
pub fn delete_permission_config(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM permission_configs WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

// ==================== 通知配置 Commands ====================

#[tauri::command]
pub fn create_notification_config(conn: Connection, input: NotificationConfigCreateInput) -> Result<NotificationConfig, String> {
    let now = Utc::now();
    let is_active = input.is_active.unwrap_or(true);

    conn.execute(
        "INSERT INTO notification_configs (notification_type, notification_name, notification_title,
                notification_template, enabled_channels, recipient_roles, is_active, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?8)",
        params![
            input.notification_type, input.notification_name, input.notification_title,
            input.notification_template, input.enabled_channels, input.recipient_roles, is_active as i64, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_notification_config(conn, id)
}

#[tauri::command]
pub fn get_notification_config(conn: Connection, id: i64) -> Result<NotificationConfig, String> {
    let mut stmt = conn.prepare(
        "SELECT id, notification_type, notification_name, notification_title, notification_template,
                enabled_channels, recipient_roles, is_active, created_by, created_at, updated_at
         FROM notification_configs WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(NotificationConfig {
            id: row.get(0)?,
            notification_type: row.get(1)?,
            notification_name: row.get(2)?,
            notification_title: row.get(3)?,
            notification_template: row.get(4)?,
            enabled_channels: row.get(5)?,
            recipient_roles: row.get(6)?,
            is_active: row.get::<_, i64>(7)? == 1,
            created_by: row.get(8)?,
            created_at: row.get(9)?,
            updated_at: row.get(10)?,
        })
    } else {
        Err("Notification config not found".to_string())
    }
}

#[tauri::command]
pub fn list_notification_configs(conn: Connection, params: NotificationConfigListParams) -> Result<Vec<NotificationConfig>, String> {
    let mut sql = String::from(
        "SELECT id, notification_type, notification_name, notification_title, notification_template,
                enabled_channels, recipient_roles, is_active, created_by, created_at, updated_at
         FROM notification_configs WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(notification_type) = params.notification_type {
        sql.push_str(" AND notification_type = ?");
        args.push(("notification_type", &notification_type));
    }
    if let Some(is_active) = params.is_active {
        sql.push_str(" AND is_active = ?");
        args.push(("is_active", &(is_active as i64)));
    }

    sql.push_str(" ORDER BY notification_name");

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    if let Some(offset) = params.offset {
        sql.push_str(&format!(" OFFSET {}", offset));
    }

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(rusqlite::params_from_iter(args.iter().map(|(_, v)| *v)), |row| {
        Ok(NotificationConfig {
            id: row.get(0)?,
            notification_type: row.get(1)?,
            notification_name: row.get(2)?,
            notification_title: row.get(3)?,
            notification_template: row.get(4)?,
            enabled_channels: row.get(5)?,
            recipient_roles: row.get(6)?,
            is_active: row.get::<_, i64>(7)? == 1,
            created_by: row.get(8)?,
            created_at: row.get(9)?,
            updated_at: row.get(10)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_notification_config(conn: Connection, id: i64, input: NotificationConfigCreateInput) -> Result<NotificationConfig, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE notification_configs SET notification_title = ?1, notification_template = ?2,
                enabled_channels = ?3, recipient_roles = ?4, is_active = ?5, updated_at = ?6 WHERE id = ?7",
        params![
            input.notification_title, input.notification_template, input.enabled_channels,
            input.recipient_roles, input.is_active.unwrap_or(true) as i64, now, id
        ],
    ).map_err(|e| e.to_string())?;

    get_notification_config(conn, id)
}

#[tauri::command]
pub fn delete_notification_config(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM notification_configs WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}
