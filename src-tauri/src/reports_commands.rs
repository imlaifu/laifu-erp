// ============================================================
// 报表管理模块 - Rust Commands
// 创建时间：2026-03-03
// 功能：报表定义、执行、Dashboard widgets、保存报表、数据导出
// ============================================================

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use tauri_plugin_sql::{Database, Query};
use uuid::Uuid;

use crate::error::Error;

// ============================================================
// 数据类型定义
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReportDefinition {
    pub id: String,
    pub name: String,
    pub code: String,
    pub category: String,
    pub description: Option<String>,
    pub sql_template: String,
    pub parameters: Option<String>,
    pub columns_config: Option<String>,
    pub is_system: bool,
    pub is_active: bool,
    pub created_by: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReportExecution {
    pub id: String,
    pub report_id: String,
    pub parameters: Option<String>,
    pub result_count: i32,
    pub execution_time_ms: Option<i32>,
    pub status: String,
    pub error_message: Option<String>,
    pub executed_by: Option<String>,
    pub executed_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DashboardWidget {
    pub id: String,
    pub user_id: String,
    pub widget_type: String,
    pub widget_key: String,
    pub title: String,
    pub config: Option<String>,
    pub position_x: i32,
    pub position_y: i32,
    pub width: i32,
    pub height: i32,
    pub is_visible: bool,
    pub refresh_interval: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SavedReport {
    pub id: String,
    pub user_id: String,
    pub name: String,
    pub report_definition_id: Option<String>,
    pub parameters: Option<String>,
    pub filters: Option<String>,
    pub sort_config: Option<String>,
    pub is_public: bool,
    pub is_favorite: bool,
    pub last_executed_at: Option<String>,
    pub execution_count: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportHistory {
    pub id: String,
    pub user_id: String,
    pub export_type: String,
    pub source_type: String,
    pub source_id: Option<String>,
    pub file_name: String,
    pub file_path: Option<String>,
    pub file_size_bytes: Option<i64>,
    pub record_count: Option<i32>,
    pub status: String,
    pub error_message: Option<String>,
    pub expires_at: Option<String>,
    pub downloaded_at: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatsSnapshot {
    pub id: String,
    pub stats_type: String,
    pub stats_date: String,
    pub data: String,
    pub created_at: String,
}

// ============================================================
// DTOs (Data Transfer Objects)
// ============================================================

#[derive(Debug, Deserialize)]
pub struct CreateReportDefinitionDto {
    pub name: String,
    pub code: String,
    pub category: String,
    pub description: Option<String>,
    pub sql_template: String,
    pub parameters: Option<String>,
    pub columns_config: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateReportDefinitionDto {
    pub name: Option<String>,
    pub description: Option<String>,
    pub sql_template: Option<String>,
    pub parameters: Option<String>,
    pub columns_config: Option<String>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct ExecuteReportDto {
    pub report_id: String,
    pub parameters: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateDashboardWidgetDto {
    pub widget_type: String,
    pub widget_key: String,
    pub title: String,
    pub config: Option<String>,
    pub position_x: Option<i32>,
    pub position_y: Option<i32>,
    pub width: Option<i32>,
    pub height: Option<i32>,
    pub refresh_interval: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateDashboardWidgetDto {
    pub title: Option<String>,
    pub config: Option<String>,
    pub position_x: Option<i32>,
    pub position_y: Option<i32>,
    pub width: Option<i32>,
    pub height: Option<i32>,
    pub is_visible: Option<bool>,
    pub refresh_interval: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct CreateSavedReportDto {
    pub name: String,
    pub report_definition_id: Option<String>,
    pub parameters: Option<String>,
    pub filters: Option<String>,
    pub sort_config: Option<String>,
    pub is_public: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct ExecuteDynamicQueryDto {
    pub sql: String,
    pub parameters: Option<Vec<serde_json::Value>>,
}

#[derive(Debug, Deserialize)]
pub struct GetDashboardDataDto {
    pub user_id: String,
    pub widget_keys: Option<Vec<String>>,
}

// ============================================================
// 辅助函数
// ============================================================

fn get_db(app: &AppHandle) -> Result<Database, Error> {
    let db = app.state::<Database>();
    Ok(db.inner().clone())
}

fn now_iso() -> String {
    Utc::now().to_rfc3339()
}

// ============================================================
// 报表定义相关命令
// ============================================================

/// 获取所有报表定义
#[tauri::command]
pub async fn get_report_definitions(
    app: AppHandle,
    category: Option<String>,
    is_active: Option<bool>,
) -> Result<Vec<ReportDefinition>, Error> {
    let db = get_db(&app)?;
    
    let mut sql = String::from(
        "SELECT id, name, code, category, description, sql_template, parameters, 
                columns_config, is_system, is_active, created_by, created_at, updated_at 
         FROM report_definitions WHERE 1=1"
    );
    
    let mut params = Vec::new();
    
    if let Some(cat) = category {
        sql.push_str(" AND category = ?");
        params.push(serde_json::Value::String(cat));
    }
    
    if let Some(active) = is_active {
        sql.push_str(" AND is_active = ?");
        params.push(serde_json::Value::Bool(active));
    }
    
    sql.push_str(" ORDER BY category, name");
    
    let mut query = Query::new(&sql);
    for param in params {
        query = query.bind(param);
    }
    
    let results = db.execute(query).await?;
    
    let mut definitions = Vec::new();
    for row in results {
        if let Ok(obj) = row.as_object() {
            let def = ReportDefinition {
                id: obj.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                name: obj.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                code: obj.get("code").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                category: obj.get("category").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                description: obj.get("description").and_then(|v| v.as_str()).map(|s| s.to_string()),
                sql_template: obj.get("sql_template").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                parameters: obj.get("parameters").and_then(|v| v.as_str()).map(|s| s.to_string()),
                columns_config: obj.get("columns_config").and_then(|v| v.as_str()).map(|s| s.to_string()),
                is_system: obj.get("is_system").and_then(|v| v.as_i64()).unwrap_or(0) == 1,
                is_active: obj.get("is_active").and_then(|v| v.as_i64()).unwrap_or(0) == 1,
                created_by: obj.get("created_by").and_then(|v| v.as_str()).map(|s| s.to_string()),
                created_at: obj.get("created_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                updated_at: obj.get("updated_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
            };
            definitions.push(def);
        }
    }
    
    Ok(definitions)
}

/// 根据 ID 获取报表定义
#[tauri::command]
pub async fn get_report_definition(
    app: AppHandle,
    report_id: String,
) -> Result<ReportDefinition, Error> {
    let db = get_db(&app)?;
    
    let sql = "SELECT id, name, code, category, description, sql_template, parameters, 
                      columns_config, is_system, is_active, created_by, created_at, updated_at 
               FROM report_definitions WHERE id = ?";
    
    let query = Query::new(sql).bind(report_id.clone());
    let results = db.execute(query).await?;
    
    if let Some(row) = results.first() {
        if let Ok(obj) = row.as_object() {
            let def = ReportDefinition {
                id: obj.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                name: obj.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                code: obj.get("code").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                category: obj.get("category").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                description: obj.get("description").and_then(|v| v.as_str()).map(|s| s.to_string()),
                sql_template: obj.get("sql_template").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                parameters: obj.get("parameters").and_then(|v| v.as_str()).map(|s| s.to_string()),
                columns_config: obj.get("columns_config").and_then(|v| v.as_str()).map(|s| s.to_string()),
                is_system: obj.get("is_system").and_then(|v| v.as_i64()).unwrap_or(0) == 1,
                is_active: obj.get("is_active").and_then(|v| v.as_i64()).unwrap_or(0) == 1,
                created_by: obj.get("created_by").and_then(|v| v.as_str()).map(|s| s.to_string()),
                created_at: obj.get("created_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                updated_at: obj.get("updated_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
            };
            return Ok(def);
        }
    }
    
    Err(Error::DatabaseError("Report definition not found".to_string()))
}

/// 创建报表定义
#[tauri::command]
pub async fn create_report_definition(
    app: AppHandle,
    data: CreateReportDefinitionDto,
    user_id: Option<String>,
) -> Result<ReportDefinition, Error> {
    let db = get_db(&app)?;
    
    let id = Uuid::new_v4().to_string();
    let now = now_iso();
    
    let sql = "INSERT INTO report_definitions (id, name, code, category, description, 
                     sql_template, parameters, columns_config, is_system, created_by, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)";
    
    let query = Query::new(sql)
        .bind(id.clone())
        .bind(data.name.clone())
        .bind(data.code.clone())
        .bind(data.category.clone())
        .bind(data.description.clone().unwrap_or_default())
        .bind(data.sql_template.clone())
        .bind(data.parameters.clone().unwrap_or_default())
        .bind(data.columns_config.clone().unwrap_or_default())
        .bind(user_id.clone().unwrap_or_default())
        .bind(now.clone())
        .bind(now.clone());
    
    db.execute(query).await?;
    
    // 返回新创建的报表定义
    get_report_definition(app, id).await
}

/// 更新报表定义
#[tauri::command]
pub async fn update_report_definition(
    app: AppHandle,
    report_id: String,
    data: UpdateReportDefinitionDto,
) -> Result<ReportDefinition, Error> {
    let db = get_db(&app)?;
    
    let mut updates = Vec::new();
    let mut params = Vec::new();
    
    if let Some(name) = data.name {
        updates.push("name = ?");
        params.push(serde_json::Value::String(name));
    }
    if let Some(desc) = data.description {
        updates.push("description = ?");
        params.push(serde_json::Value::String(desc));
    }
    if let Some(sql) = data.sql_template {
        updates.push("sql_template = ?");
        params.push(serde_json::Value::String(sql));
    }
    if let Some(params_json) = data.parameters {
        updates.push("parameters = ?");
        params.push(serde_json::Value::String(params_json));
    }
    if let Some(cols) = data.columns_config {
        updates.push("columns_config = ?");
        params.push(serde_json::Value::String(cols));
    }
    if let Some(active) = data.is_active {
        updates.push("is_active = ?");
        params.push(serde_json::Value::Bool(active));
    }
    
    if updates.is_empty() {
        return get_report_definition(app, report_id).await;
    }
    
    let now = now_iso();
    updates.push("updated_at = ?");
    params.push(serde_json::Value::String(now));
    
    let sql = format!(
        "UPDATE report_definitions SET {} WHERE id = ?",
        updates.join(", ")
    );
    
    let mut query = Query::new(&sql);
    for param in params {
        query = query.bind(param);
    }
    query = query.bind(report_id.clone());
    
    db.execute(query).await?;
    
    get_report_definition(app, report_id).await
}

/// 删除报表定义
#[tauri::command]
pub async fn delete_report_definition(
    app: AppHandle,
    report_id: String,
) -> Result<(), Error> {
    let db = get_db(&app)?;
    
    // 检查是否是系统预定义
    let def = get_report_definition(app.clone(), report_id.clone()).await?;
    if def.is_system {
        return Err(Error::DatabaseError("Cannot delete system report definition".to_string()));
    }
    
    let sql = "DELETE FROM report_definitions WHERE id = ?";
    let query = Query::new(sql).bind(report_id);
    
    db.execute(query).await?;
    
    Ok(())
}

// ============================================================
// 报表执行相关命令
// ============================================================

/// 执行报表
#[tauri::command]
pub async fn execute_report(
    app: AppHandle,
    data: ExecuteReportDto,
    user_id: Option<String>,
) -> Result<serde_json::Value, Error> {
    let db = get_db(&app)?;
    let start_time = std::time::Instant::now();
    
    // 获取报表定义
    let def = get_report_definition(app.clone(), data.report_id.clone()).await?;
    
    if !def.is_active {
        return Err(Error::DatabaseError("Report definition is not active".to_string()));
    }
    
    // 执行 SQL
    let query = Query::new(&def.sql_template);
    let results = db.execute(query).await?;
    
    let execution_time = start_time.elapsed().as_millis() as i32;
    let result_count = results.len() as i32;
    
    // 记录执行历史
    let exec_id = Uuid::new_v4().to_string();
    let now = now_iso();
    
    let insert_sql = "INSERT INTO report_executions (id, report_id, parameters, result_count, 
                        execution_time_ms, status, executed_by, executed_at)
                      VALUES (?, ?, ?, ?, ?, 'success', ?, ?)";
    
    let insert_query = Query::new(insert_sql)
        .bind(exec_id.clone())
        .bind(data.report_id.clone())
        .bind(data.parameters.clone().unwrap_or_default())
        .bind(result_count)
        .bind(execution_time)
        .bind(user_id.clone().unwrap_or_default())
        .bind(now.clone());
    
    let _ = db.execute(insert_query).await;
    
    // 返回结果
    Ok(serde_json::json!({
        "data": results,
        "columns_config": def.columns_config,
        "execution_time_ms": execution_time,
        "result_count": result_count
    }))
}

/// 执行动态 SQL 查询
#[tauri::command]
pub async fn execute_dynamic_query(
    app: AppHandle,
    data: ExecuteDynamicQueryDto,
) -> Result<Vec<serde_json::Value>, Error> {
    let db = get_db(&app)?;
    
    // 安全检查：只允许 SELECT 语句
    let sql_upper = data.sql.trim().to_uppercase();
    if !sql_upper.starts_with("SELECT") {
        return Err(Error::DatabaseError("Only SELECT queries are allowed".to_string()));
    }
    
    let mut query = Query::new(&data.sql);
    
    // TODO: 支持参数绑定
    
    let results = db.execute(query).await?;
    
    Ok(results)
}

/// 获取报表执行历史
#[tauri::command]
pub async fn get_report_executions(
    app: AppHandle,
    report_id: Option<String>,
    limit: Option<i32>,
) -> Result<Vec<ReportExecution>, Error> {
    let db = get_db(&app)?;
    
    let mut sql = String::from(
        "SELECT id, report_id, parameters, result_count, execution_time_ms, 
                status, error_message, executed_by, executed_at 
         FROM report_executions WHERE 1=1"
    );
    
    if let Some(rid) = report_id {
        sql.push_str(" AND report_id = ?");
    }
    
    sql.push_str(" ORDER BY executed_at DESC");
    
    let lim = limit.unwrap_or(50);
    sql.push_str(&format!(" LIMIT {}", lim));
    
    let mut query = Query::new(&sql);
    if let Some(rid) = report_id {
        query = query.bind(rid);
    }
    
    let results = db.execute(query).await?;
    
    let mut executions = Vec::new();
    for row in results {
        if let Ok(obj) = row.as_object() {
            let exec = ReportExecution {
                id: obj.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                report_id: obj.get("report_id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                parameters: obj.get("parameters").and_then(|v| v.as_str()).map(|s| s.to_string()),
                result_count: obj.get("result_count").and_then(|v| v.as_i64()).unwrap_or(0) as i32,
                execution_time_ms: obj.get("execution_time_ms").and_then(|v| v.as_i64()).map(|v| v as i32),
                status: obj.get("status").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                error_message: obj.get("error_message").and_then(|v| v.as_str()).map(|s| s.to_string()),
                executed_by: obj.get("executed_by").and_then(|v| v.as_str()).map(|s| s.to_string()),
                executed_at: obj.get("executed_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
            };
            executions.push(exec);
        }
    }
    
    Ok(executions)
}

// ============================================================
// Dashboard Widgets 相关命令
// ============================================================

/// 获取用户 Dashboard widgets
#[tauri::command]
pub async fn get_dashboard_widgets(
    app: AppHandle,
    user_id: String,
) -> Result<Vec<DashboardWidget>, Error> {
    let db = get_db(&app)?;
    
    let sql = "SELECT id, user_id, widget_type, widget_key, title, config, 
                      position_x, position_y, width, height, is_visible, 
                      refresh_interval, created_at, updated_at 
               FROM dashboard_widgets 
               WHERE user_id = ? OR user_id = 'system'
               ORDER BY position_y, position_x";
    
    let query = Query::new(sql).bind(user_id.clone());
    let results = db.execute(query).await?;
    
    let mut widgets = Vec::new();
    for row in results {
        if let Ok(obj) = row.as_object() {
            let widget = DashboardWidget {
                id: obj.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                user_id: obj.get("user_id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                widget_type: obj.get("widget_type").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                widget_key: obj.get("widget_key").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                title: obj.get("title").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                config: obj.get("config").and_then(|v| v.as_str()).map(|s| s.to_string()),
                position_x: obj.get("position_x").and_then(|v| v.as_i64()).unwrap_or(0) as i32,
                position_y: obj.get("position_y").and_then(|v| v.as_i64()).unwrap_or(0) as i32,
                width: obj.get("width").and_then(|v| v.as_i64()).unwrap_or(4) as i32,
                height: obj.get("height").and_then(|v| v.as_i64()).unwrap_or(2) as i32,
                is_visible: obj.get("is_visible").and_then(|v| v.as_i64()).unwrap_or(0) == 1,
                refresh_interval: obj.get("refresh_interval").and_then(|v| v.as_i64()).unwrap_or(300) as i32,
                created_at: obj.get("created_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                updated_at: obj.get("updated_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
            };
            widgets.push(widget);
        }
    }
    
    Ok(widgets)
}

/// 创建 Dashboard widget
#[tauri::command]
pub async fn create_dashboard_widget(
    app: AppHandle,
    user_id: String,
    data: CreateDashboardWidgetDto,
) -> Result<DashboardWidget, Error> {
    let db = get_db(&app)?;
    
    let id = Uuid::new_v4().to_string();
    let now = now_iso();
    
    let sql = "INSERT INTO dashboard_widgets (id, user_id, widget_type, widget_key, title, 
                     config, position_x, position_y, width, height, is_visible, refresh_interval, 
                     created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)";
    
    let query = Query::new(sql)
        .bind(id.clone())
        .bind(user_id.clone())
        .bind(data.widget_type.clone())
        .bind(data.widget_key.clone())
        .bind(data.title.clone())
        .bind(data.config.clone().unwrap_or_default())
        .bind(data.position_x.unwrap_or(0))
        .bind(data.position_y.unwrap_or(0))
        .bind(data.width.unwrap_or(4))
        .bind(data.height.unwrap_or(2))
        .bind(data.refresh_interval.unwrap_or(300))
        .bind(now.clone())
        .bind(now.clone());
    
    db.execute(query).await?;
    
    // 返回新创建的 widget
    let widgets = get_dashboard_widgets(app, user_id).await?;
    widgets.into_iter()
        .find(|w| w.id == id)
        .ok_or_else(|| Error::DatabaseError("Failed to retrieve created widget".to_string()))
}

/// 更新 Dashboard widget
#[tauri::command]
pub async fn update_dashboard_widget(
    app: AppHandle,
    widget_id: String,
    data: UpdateDashboardWidgetDto,
) -> Result<DashboardWidget, Error> {
    let db = get_db(&app)?;
    
    // 先获取 widget 以获取 user_id
    let widgets = get_all_dashboard_widgets(app.clone()).await?;
    let widget = widgets.into_iter()
        .find(|w| w.id == widget_id)
        .ok_or_else(|| Error::DatabaseError("Widget not found".to_string()))?;
    
    let mut updates = Vec::new();
    let mut params = Vec::new();
    
    if let Some(title) = data.title {
        updates.push("title = ?");
        params.push(serde_json::Value::String(title));
    }
    if let Some(config) = data.config {
        updates.push("config = ?");
        params.push(serde_json::Value::String(config));
    }
    if let Some(x) = data.position_x {
        updates.push("position_x = ?");
        params.push(serde_json::Value::Number(x.into()));
    }
    if let Some(y) = data.position_y {
        updates.push("position_y = ?");
        params.push(serde_json::Value::Number(y.into()));
    }
    if let Some(w) = data.width {
        updates.push("width = ?");
        params.push(serde_json::Value::Number(w.into()));
    }
    if let Some(h) = data.height {
        updates.push("height = ?");
        params.push(serde_json::Value::Number(h.into()));
    }
    if let Some(visible) = data.is_visible {
        updates.push("is_visible = ?");
        params.push(serde_json::Value::Bool(visible));
    }
    if let Some(interval) = data.refresh_interval {
        updates.push("refresh_interval = ?");
        params.push(serde_json::Value::Number(interval.into()));
    }
    
    if updates.is_empty() {
        return Ok(widget);
    }
    
    let now = now_iso();
    updates.push("updated_at = ?");
    params.push(serde_json::Value::String(now));
    
    let sql = format!(
        "UPDATE dashboard_widgets SET {} WHERE id = ?",
        updates.join(", ")
    );
    
    let mut query = Query::new(&sql);
    for param in params {
        query = query.bind(param);
    }
    query = query.bind(widget_id.clone());
    
    db.execute(query).await?;
    
    // 返回更新后的 widget
    let widgets = get_dashboard_widgets(app, widget.user_id).await?;
    widgets.into_iter()
        .find(|w| w.id == widget_id)
        .ok_or_else(|| Error::DatabaseError("Failed to retrieve updated widget".to_string()))
}

/// 删除 Dashboard widget
#[tauri::command]
pub async fn delete_dashboard_widget(
    app: AppHandle,
    widget_id: String,
    user_id: String,
) -> Result<(), Error> {
    let db = get_db(&app)?;
    
    let sql = "DELETE FROM dashboard_widgets WHERE id = ? AND (user_id = ? OR user_id = 'system')";
    let query = Query::new(sql).bind(widget_id).bind(user_id);
    
    db.execute(query).await?;
    
    Ok(())
}

/// 获取所有 Dashboard widgets (内部使用)
async fn get_all_dashboard_widgets(app: AppHandle) -> Result<Vec<DashboardWidget>, Error> {
    let db = get_db(&app)?;
    
    let sql = "SELECT id, user_id, widget_type, widget_key, title, config, 
                      position_x, position_y, width, height, is_visible, 
                      refresh_interval, created_at, updated_at 
               FROM dashboard_widgets ORDER BY user_id, position_y, position_x";
    
    let query = Query::new(sql);
    let results = db.execute(query).await?;
    
    let mut widgets = Vec::new();
    for row in results {
        if let Ok(obj) = row.as_object() {
            let widget = DashboardWidget {
                id: obj.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                user_id: obj.get("user_id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                widget_type: obj.get("widget_type").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                widget_key: obj.get("widget_key").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                title: obj.get("title").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                config: obj.get("config").and_then(|v| v.as_str()).map(|s| s.to_string()),
                position_x: obj.get("position_x").and_then(|v| v.as_i64()).unwrap_or(0) as i32,
                position_y: obj.get("position_y").and_then(|v| v.as_i64()).unwrap_or(0) as i32,
                width: obj.get("width").and_then(|v| v.as_i64()).unwrap_or(4) as i32,
                height: obj.get("height").and_then(|v| v.as_i64()).unwrap_or(2) as i32,
                is_visible: obj.get("is_visible").and_then(|v| v.as_i64()).unwrap_or(0) == 1,
                refresh_interval: obj.get("refresh_interval").and_then(|v| v.as_i64()).unwrap_or(300) as i32,
                created_at: obj.get("created_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                updated_at: obj.get("updated_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
            };
            widgets.push(widget);
        }
    }
    
    Ok(widgets)
}

/// 获取 Dashboard 数据 (批量获取 widget 数据)
#[tauri::command]
pub async fn get_dashboard_data(
    app: AppHandle,
    data: GetDashboardDataDto,
) -> Result<serde_json::Value, Error> {
    let widgets = get_dashboard_widgets(app.clone(), data.user_id).await?;
    
    let mut widget_data = serde_json::Map::new();
    
    for widget in widgets {
        if !widget.is_visible {
            continue;
        }
        
        // 如果指定了 widget_keys，只返回这些 widget 的数据
        if let Some(ref keys) = data.widget_keys {
            if !keys.contains(&widget.widget_key) {
                continue;
            }
        }
        
        // 根据 widget_key 获取对应的报表数据
        // 这里简化处理，实际应该根据 widget.config 中的 report_code 来获取
        match widget.widget_key.as_str() {
            "sales_today" => {
                let sql = "SELECT COUNT(*) as order_count, COALESCE(SUM(total_amount), 0) as total_amount, 
                                  COUNT(DISTINCT customer_id) as customer_count 
                           FROM orders WHERE DATE(created_at) = DATE('now')";
                let query = Query::new(sql);
                if let Ok(results) = get_db(&app).unwrap().execute(query).await {
                    widget_data.insert(widget.widget_key.clone(), serde_json::json!({
                        "title": widget.title,
                        "type": widget.widget_type,
                        "data": results.first().cloned()
                    }));
                }
            }
            "pending_orders" => {
                let sql = "SELECT COUNT(*) as count FROM orders WHERE status IN ('pending', 'confirmed')";
                let query = Query::new(sql);
                if let Ok(results) = get_db(&app).unwrap().execute(query).await {
                    widget_data.insert(widget.widget_key.clone(), serde_json::json!({
                        "title": widget.title,
                        "type": widget.widget_type,
                        "data": results.first().cloned()
                    }));
                }
            }
            "inventory_alert" => {
                let sql = "SELECT COUNT(*) as count FROM products p JOIN inventory i ON p.id = i.product_id 
                                  WHERE i.quantity < i.safety_stock AND p.status = 'active'";
                let query = Query::new(sql);
                if let Ok(results) = get_db(&app).unwrap().execute(query).await {
                    widget_data.insert(widget.widget_key.clone(), serde_json::json!({
                        "title": widget.title,
                        "type": widget.widget_type,
                        "data": results.first().cloned()
                    }));
                }
            }
            "finance_monthly" => {
                let sql = "SELECT SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income, 
                                  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense,
                                  SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as profit 
                           FROM finance_records WHERE DATE(created_at) >= DATE('now', 'start of month')";
                let query = Query::new(sql);
                if let Ok(results) = get_db(&app).unwrap().execute(query).await {
                    widget_data.insert(widget.widget_key.clone(), serde_json::json!({
                        "title": widget.title,
                        "type": widget.widget_type,
                        "data": results.first().cloned()
                    }));
                }
            }
            _ => {}
        }
    }
    
    Ok(serde_json::json!({
        "widgets": widget_data
    }))
}

// ============================================================
// 保存报表相关命令
// ============================================================

/// 获取用户保存的报表
#[tauri::command]
pub async fn get_saved_reports(
    app: AppHandle,
    user_id: String,
    include_public: Option<bool>,
) -> Result<Vec<SavedReport>, Error> {
    let db = get_db(&app)?;
    
    let mut sql = String::from(
        "SELECT id, user_id, name, report_definition_id, parameters, filters, 
                sort_config, is_public, is_favorite, last_executed_at, execution_count, 
                created_at, updated_at 
         FROM saved_reports 
         WHERE user_id = ?"
    );
    
    if include_public.unwrap_or(false) {
        sql.push_str(" OR is_public = 1");
    }
    
    sql.push_str(" ORDER BY is_favorite DESC, updated_at DESC");
    
    let query = Query::new(&sql).bind(user_id);
    let results = db.execute(query).await?;
    
    let mut reports = Vec::new();
    for row in results {
        if let Ok(obj) = row.as_object() {
            let report = SavedReport {
                id: obj.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                user_id: obj.get("user_id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                name: obj.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                report_definition_id: obj.get("report_definition_id").and_then(|v| v.as_str()).map(|s| s.to_string()),
                parameters: obj.get("parameters").and_then(|v| v.as_str()).map(|s| s.to_string()),
                filters: obj.get("filters").and_then(|v| v.as_str()).map(|s| s.to_string()),
                sort_config: obj.get("sort_config").and_then(|v| v.as_str()).map(|s| s.to_string()),
                is_public: obj.get("is_public").and_then(|v| v.as_i64()).unwrap_or(0) == 1,
                is_favorite: obj.get("is_favorite").and_then(|v| v.as_i64()).unwrap_or(0) == 1,
                last_executed_at: obj.get("last_executed_at").and_then(|v| v.as_str()).map(|s| s.to_string()),
                execution_count: obj.get("execution_count").and_then(|v| v.as_i64()).unwrap_or(0) as i32,
                created_at: obj.get("created_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                updated_at: obj.get("updated_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
            };
            reports.push(report);
        }
    }
    
    Ok(reports)
}

/// 创建保存的报表
#[tauri::command]
pub async fn create_saved_report(
    app: AppHandle,
    user_id: String,
    data: CreateSavedReportDto,
) -> Result<SavedReport, Error> {
    let db = get_db(&app)?;
    
    let id = Uuid::new_v4().to_string();
    let now = now_iso();
    
    let sql = "INSERT INTO saved_reports (id, user_id, name, report_definition_id, parameters, 
                     filters, sort_config, is_public, is_favorite, execution_count, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?)";
    
    let query = Query::new(sql)
        .bind(id.clone())
        .bind(user_id.clone())
        .bind(data.name.clone())
        .bind(data.report_definition_id.clone().unwrap_or_default())
        .bind(data.parameters.clone().unwrap_or_default())
        .bind(data.filters.clone().unwrap_or_default())
        .bind(data.sort_config.clone().unwrap_or_default())
        .bind(now.clone())
        .bind(now.clone());
    
    db.execute(query).await?;
    
    // 返回新创建的保存报表
    let reports = get_saved_reports(app, user_id, Some(false)).await?;
    reports.into_iter()
        .find(|r| r.id == id)
        .ok_or_else(|| Error::DatabaseError("Failed to retrieve created saved report".to_string()))
}

/// 更新保存的报表
#[tauri::command]
pub async fn update_saved_report(
    app: AppHandle,
    report_id: String,
    user_id: String,
    name: Option<String>,
    is_favorite: Option<bool>,
    is_public: Option<bool>,
) -> Result<SavedReport, Error> {
    let db = get_db(&app)?;
    
    let mut updates = Vec::new();
    let mut params = Vec::new();
    
    if let Some(n) = name {
        updates.push("name = ?");
        params.push(serde_json::Value::String(n));
    }
    if let Some(fav) = is_favorite {
        updates.push("is_favorite = ?");
        params.push(serde_json::Value::Bool(fav));
    }
    if let Some(pub_flag) = is_public {
        updates.push("is_public = ?");
        params.push(serde_json::Value::Bool(pub_flag));
    }
    
    if updates.is_empty() {
        let reports = get_saved_reports(app, user_id, Some(false)).await?;
        return reports.into_iter()
            .find(|r| r.id == report_id)
            .ok_or_else(|| Error::DatabaseError("Saved report not found".to_string()));
    }
    
    let now = now_iso();
    updates.push("updated_at = ?");
    params.push(serde_json::Value::String(now));
    
    let sql = format!(
        "UPDATE saved_reports SET {} WHERE id = ? AND user_id = ?",
        updates.join(", ")
    );
    
    let mut query = Query::new(&sql);
    for param in params {
        query = query.bind(param);
    }
    query = query.bind(report_id.clone()).bind(user_id.clone());
    
    db.execute(query).await?;
    
    let reports = get_saved_reports(app, user_id, Some(false)).await?;
    reports.into_iter()
        .find(|r| r.id == report_id)
        .ok_or_else(|| Error::DatabaseError("Failed to retrieve updated saved report".to_string()))
}

/// 删除保存的报表
#[tauri::command]
pub async fn delete_saved_report(
    app: AppHandle,
    report_id: String,
    user_id: String,
) -> Result<(), Error> {
    let db = get_db(&app)?;
    
    let sql = "DELETE FROM saved_reports WHERE id = ? AND user_id = ?";
    let query = Query::new(sql).bind(report_id).bind(user_id);
    
    db.execute(query).await?;
    
    Ok(())
}

/// 执行保存的报表
#[tauri::command]
pub async fn execute_saved_report(
    app: AppHandle,
    report_id: String,
    user_id: String,
) -> Result<serde_json::Value, Error> {
    let db = get_db(&app)?;
    
    // 获取保存的报表
    let reports = get_saved_reports(app.clone(), user_id.clone(), Some(false)).await?;
    let saved_report = reports.into_iter()
        .find(|r| r.id == report_id)
        .ok_or_else(|| Error::DatabaseError("Saved report not found".to_string()))?;
    
    // 如果有 report_definition_id，执行对应的报表
    if let Some(def_id) = saved_report.report_definition_id {
        let exec_data = ExecuteReportDto {
            report_id: def_id,
            parameters: saved_report.parameters.clone(),
        };
        
        let result = execute_report(app.clone(), exec_data, Some(user_id.clone())).await?;
        
        // 更新执行统计
        let now = now_iso();
        let update_sql = "UPDATE saved_reports SET last_executed_at = ?, execution_count = execution_count + 1 
                         WHERE id = ?";
        let update_query = Query::new(update_sql).bind(now).bind(report_id);
        let _ = db.execute(update_query).await;
        
        return Ok(result);
    }
    
    Err(Error::DatabaseError("Saved report has no definition".to_string()))
}

// ============================================================
// 导出历史相关命令
// ============================================================

/// 创建导出记录
#[tauri::command]
pub async fn create_export_record(
    app: AppHandle,
    user_id: String,
    export_type: String,
    source_type: String,
    source_id: Option<String>,
    file_name: String,
    record_count: Option<i32>,
) -> Result<ExportHistory, Error> {
    let db = get_db(&app)?;
    
    let id = Uuid::new_v4().to_string();
    let now = now_iso();
    
    // 设置过期时间为 7 天后
    let expires_sql = "SELECT datetime('now', '+7 days')";
    let expires_query = Query::new(expires_sql);
    let expires_result = db.execute(expires_query).await?;
    let expires_at = expires_result.first()
        .and_then(|r| r.as_object().ok())
        .and_then(|o| o.get("datetime('now', '+7 days')").and_then(|v| v.as_str()).map(|s| s.to_string()))
        .unwrap_or_else(|| now.clone());
    
    let sql = "INSERT INTO export_history (id, user_id, export_type, source_type, source_id, 
                     file_name, status, record_count, expires_at, created_at)
               VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)";
    
    let query = Query::new(sql)
        .bind(id.clone())
        .bind(user_id.clone())
        .bind(export_type.clone())
        .bind(source_type.clone())
        .bind(source_id.clone().unwrap_or_default())
        .bind(file_name.clone())
        .bind(record_count.unwrap_or(0))
        .bind(expires_at.clone())
        .bind(now.clone());
    
    db.execute(query).await?;
    
    // 返回新创建的导出记录
    get_export_history(app, user_id, Some(1)).await
        .and_then(|list| list.into_iter()
            .find(|e| e.id == id)
            .ok_or_else(|| Error::DatabaseError("Failed to retrieve created export record".to_string())))
}

/// 更新导出记录状态
#[tauri::command]
pub async fn update_export_record(
    app: AppHandle,
    export_id: String,
    user_id: String,
    status: String,
    file_path: Option<String>,
    file_size_bytes: Option<i64>,
    error_message: Option<String>,
) -> Result<(), Error> {
    let db = get_db(&app)?;
    
    let mut updates = vec!["status = ?".to_string()];
    let mut params = vec![serde_json::Value::String(status)];
    
    if let Some(path) = file_path {
        updates.push("file_path = ?".to_string());
        params.push(serde_json::Value::String(path));
    }
    if let Some(size) = file_size_bytes {
        updates.push("file_size_bytes = ?".to_string());
        params.push(serde_json::Value::Number(size.into()));
    }
    if let Some(err) = error_message {
        updates.push("error_message = ?".to_string());
        params.push(serde_json::Value::String(err));
    }
    
    let sql = format!(
        "UPDATE export_history SET {} WHERE id = ? AND user_id = ?",
        updates.join(", ")
    );
    
    let mut query = Query::new(&sql);
    for param in params {
        query = query.bind(param);
    }
    query = query.bind(export_id).bind(user_id);
    
    db.execute(query).await?;
    
    Ok(())
}

/// 获取导出历史
#[tauri::command]
pub async fn get_export_history(
    app: AppHandle,
    user_id: String,
    limit: Option<i32>,
) -> Result<Vec<ExportHistory>, Error> {
    let db = get_db(&app)?;
    
    let lim = limit.unwrap_or(50);
    let sql = "SELECT id, user_id, export_type, source_type, source_id, file_name, 
                      file_path, file_size_bytes, record_count, status, error_message, 
                      expires_at, downloaded_at, created_at 
               FROM export_history 
               WHERE user_id = ? 
               ORDER BY created_at DESC 
               LIMIT ?";
    
    let query = Query::new(sql).bind(user_id).bind(lim);
    let results = db.execute(query).await?;
    
    let mut exports = Vec::new();
    for row in results {
        if let Ok(obj) = row.as_object() {
            let export = ExportHistory {
                id: obj.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                user_id: obj.get("user_id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                export_type: obj.get("export_type").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                source_type: obj.get("source_type").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                source_id: obj.get("source_id").and_then(|v| v.as_str()).map(|s| s.to_string()),
                file_name: obj.get("file_name").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                file_path: obj.get("file_path").and_then(|v| v.as_str()).map(|s| s.to_string()),
                file_size_bytes: obj.get("file_size_bytes").and_then(|v| v.as_i64()),
                record_count: obj.get("record_count").and_then(|v| v.as_i64()).map(|v| v as i32),
                status: obj.get("status").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                error_message: obj.get("error_message").and_then(|v| v.as_str()).map(|s| s.to_string()),
                expires_at: obj.get("expires_at").and_then(|v| v.as_str()).map(|s| s.to_string()),
                downloaded_at: obj.get("downloaded_at").and_then(|v| v.as_str()).map(|s| s.to_string()),
                created_at: obj.get("created_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
            };
            exports.push(export);
        }
    }
    
    Ok(exports)
}

// ============================================================
// 统计快照相关命令
// ============================================================

/// 创建或更新统计快照
#[tauri::command]
pub async fn upsert_stats_snapshot(
    app: AppHandle,
    stats_type: String,
    stats_date: String,
    data: String,
) -> Result<StatsSnapshot, Error> {
    let db = get_db(&app)?;
    
    let id = Uuid::new_v4().to_string();
    let now = now_iso();
    
    let sql = "INSERT OR REPLACE INTO stats_snapshots (id, stats_type, stats_date, data, created_at)
               VALUES (?, ?, ?, ?, ?)";
    
    let query = Query::new(sql)
        .bind(id.clone())
        .bind(stats_type.clone())
        .bind(stats_date.clone())
        .bind(data.clone())
        .bind(now.clone());
    
    db.execute(query).await?;
    
    Ok(StatsSnapshot {
        id,
        stats_type,
        stats_date,
        data,
        created_at: now,
    })
}

/// 获取统计快照
#[tauri::command]
pub async fn get_stats_snapshot(
    app: AppHandle,
    stats_type: String,
    stats_date: String,
) -> Result<Option<StatsSnapshot>, Error> {
    let db = get_db(&app)?;
    
    let sql = "SELECT id, stats_type, stats_date, data, created_at 
               FROM stats_snapshots 
               WHERE stats_type = ? AND stats_date = ?";
    
    let query = Query::new(sql).bind(stats_type).bind(stats_date);
    let results = db.execute(query).await?;
    
    if let Some(row) = results.first() {
        if let Ok(obj) = row.as_object() {
            let snapshot = StatsSnapshot {
                id: obj.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                stats_type: obj.get("stats_type").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                stats_date: obj.get("stats_date").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                data: obj.get("data").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                created_at: obj.get("created_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
            };
            return Ok(Some(snapshot));
        }
    }
    
    Ok(None)
}
