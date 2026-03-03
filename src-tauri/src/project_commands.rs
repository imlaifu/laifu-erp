// Project Management Module Rust Commands
// 项目管理模块 - 完整 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

// ==================== Types ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Project {
    pub id: i64,
    pub project_no: String,
    pub name: String,
    pub code: Option<String>,
    pub category: Option<String>,
    pub r#type: Option<String>,
    pub industry: Option<String>,
    pub description: Option<String>,
    pub objectives: Option<String>,
    pub deliverables: Option<String>,
    pub status: String,
    pub priority: String,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub actual_start_date: Option<String>,
    pub actual_end_date: Option<String>,
    pub budget: f64,
    pub actual_cost: f64,
    pub currency: String,
    pub customer_id: Option<i64>,
    pub customer_contact: Option<String>,
    pub customer_email: Option<String>,
    pub customer_phone: Option<String>,
    pub owner_id: i64,
    pub manager_id: Option<i64>,
    pub team_member_ids: Option<String>,
    pub progress_percentage: f64,
    pub milestone_count: i32,
    pub completed_milestone_count: i32,
    pub task_count: i32,
    pub completed_task_count: i32,
    pub risk_level: String,
    pub issues_count: i32,
    pub parent_project_id: Option<i64>,
    pub is_template: i32,
    pub template_id: Option<String>,
    pub created_by: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectMilestone {
    pub id: i64,
    pub project_id: i64,
    pub milestone_no: String,
    pub name: String,
    pub description: Option<String>,
    pub planned_date: String,
    pub actual_date: Option<String>,
    pub status: String,
    pub completion_percentage: f64,
    pub deliverables: Option<String>,
    pub acceptance_criteria: Option<String>,
    pub accepted_by: Option<i64>,
    pub accepted_at: Option<String>,
    pub acceptance_notes: Option<String>,
    pub sort_order: i32,
    pub created_by: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectTask {
    pub id: i64,
    pub project_id: i64,
    pub task_no: String,
    pub name: String,
    pub description: Option<String>,
    pub phase: Option<String>,
    pub category: Option<String>,
    pub r#type: Option<String>,
    pub status: String,
    pub priority: String,
    pub severity: Option<String>,
    pub estimated_hours: f64,
    pub actual_hours: f64,
    pub remaining_hours: f64,
    pub start_date: Option<String>,
    pub due_date: Option<String>,
    pub actual_start_date: Option<String>,
    pub actual_end_date: Option<String>,
    pub assignee_id: Option<i64>,
    pub reporter_id: Option<i64>,
    pub parent_task_id: Option<i64>,
    pub dependency_ids: Option<String>,
    pub milestone_id: Option<i64>,
    pub progress_percentage: f64,
    pub tags: Option<String>,
    pub iteration: i32,
    pub created_by: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TimeEntry {
    pub id: i64,
    pub employee_id: i64,
    pub project_id: i64,
    pub task_id: Option<i64>,
    pub entry_date: String,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub duration_hours: f64,
    pub work_type: String,
    pub billable: i32,
    pub description: String,
    pub work_category: Option<String>,
    pub status: String,
    pub approved_by: Option<i64>,
    pub approved_at: Option<String>,
    pub rejection_reason: Option<String>,
    pub hourly_rate: f64,
    pub total_amount: f64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectCost {
    pub id: i64,
    pub project_id: i64,
    pub category: String,
    pub sub_category: Option<String>,
    pub name: String,
    pub description: Option<String>,
    pub planned_amount: f64,
    pub actual_amount: f64,
    pub currency: String,
    pub cost_date: Option<String>,
    pub payment_date: Option<String>,
    pub status: String,
    pub vendor_id: Option<i64>,
    pub invoice_no: Option<String>,
    pub related_task_id: Option<i64>,
    pub approved_by: Option<i64>,
    pub approved_at: Option<String>,
    pub notes: Option<String>,
    pub created_by: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectDocument {
    pub id: i64,
    pub project_id: i64,
    pub task_id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub category: Option<String>,
    pub document_type: Option<String>,
    pub file_url: String,
    pub file_size_bytes: Option<i64>,
    pub file_hash: Option<String>,
    pub version: String,
    pub version_notes: Option<String>,
    pub is_latest: i32,
    pub visibility: String,
    pub access_level: String,
    pub status: String,
    pub reviewed_by: Option<i64>,
    pub reviewed_at: Option<String>,
    pub download_count: i32,
    pub created_by: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectIssue {
    pub id: i64,
    pub project_id: i64,
    pub issue_no: String,
    pub title: String,
    pub description: String,
    pub r#type: Option<String>,
    pub category: Option<String>,
    pub status: String,
    pub priority: String,
    pub severity: String,
    pub assignee_id: Option<i64>,
    pub reporter_id: Option<i64>,
    pub reported_date: String,
    pub resolved_date: Option<String>,
    pub due_date: Option<String>,
    pub solution: Option<String>,
    pub resolution_notes: Option<String>,
    pub impact_description: Option<String>,
    pub impact_cost: f64,
    pub impact_days: i32,
    pub created_by: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectMember {
    pub id: i64,
    pub project_id: i64,
    pub employee_id: i64,
    pub role: String,
    pub responsibilities: Option<String>,
    pub allocation_percentage: f64,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub access_level: String,
    pub status: String,
    pub joined_at: String,
    pub left_at: Option<String>,
    pub created_by: i64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectChangeLog {
    pub id: i64,
    pub project_id: i64,
    pub change_type: String,
    pub title: String,
    pub description: String,
    pub old_value: Option<String>,
    pub new_value: Option<String>,
    pub reason: String,
    pub impact: Option<String>,
    pub status: String,
    pub requested_by: i64,
    pub approved_by: Option<i64>,
    pub approved_at: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectComment {
    pub id: i64,
    pub project_id: i64,
    pub task_id: Option<i64>,
    pub milestone_id: Option<i64>,
    pub issue_id: Option<i64>,
    pub document_id: Option<i64>,
    pub content: String,
    pub parent_comment_id: Option<i64>,
    pub attachments: Option<String>,
    pub is_edited: i32,
    pub is_deleted: i32,
    pub created_by: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectStatistics {
    pub total_projects: i64,
    pub active_projects: i64,
    pub completed_projects: i64,
    pub on_hold_projects: i64,
    pub total_tasks: i64,
    pub completed_tasks: i64,
    pub total_hours_logged: f64,
    pub total_budget: f64,
    pub total_actual_cost: f64,
}

// ==================== Input Types ====================

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectCreateInput {
    pub project_no: String,
    pub name: String,
    pub code: Option<String>,
    pub category: Option<String>,
    pub r#type: Option<String>,
    pub industry: Option<String>,
    pub description: Option<String>,
    pub objectives: Option<String>,
    pub deliverables: Option<String>,
    pub priority: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub budget: Option<f64>,
    pub currency: Option<String>,
    pub customer_id: Option<i64>,
    pub customer_contact: Option<String>,
    pub customer_email: Option<String>,
    pub customer_phone: Option<String>,
    pub manager_id: Option<i64>,
    pub team_member_ids: Option<String>,
    pub parent_project_id: Option<i64>,
    pub is_template: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectUpdateInput {
    pub name: Option<String>,
    pub code: Option<String>,
    pub category: Option<String>,
    pub r#type: Option<String>,
    pub industry: Option<String>,
    pub description: Option<String>,
    pub objectives: Option<String>,
    pub deliverables: Option<String>,
    pub status: Option<String>,
    pub priority: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub actual_start_date: Option<String>,
    pub actual_end_date: Option<String>,
    pub budget: Option<f64>,
    pub actual_cost: Option<f64>,
    pub progress_percentage: Option<f64>,
    pub risk_level: Option<String>,
    pub manager_id: Option<i64>,
    pub team_member_ids: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProjectTaskCreateInput {
    pub task_no: String,
    pub name: String,
    pub description: Option<String>,
    pub phase: Option<String>,
    pub category: Option<String>,
    pub r#type: Option<String>,
    pub priority: Option<String>,
    pub severity: Option<String>,
    pub estimated_hours: Option<f64>,
    pub start_date: Option<String>,
    pub due_date: Option<String>,
    pub assignee_id: Option<i64>,
    pub milestone_id: Option<i64>,
    pub parent_task_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TimeEntryCreateInput {
    pub employee_id: i64,
    pub project_id: i64,
    pub task_id: Option<i64>,
    pub entry_date: String,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub duration_hours: f64,
    pub work_type: Option<String>,
    pub billable: Option<i32>,
    pub description: String,
    pub work_category: Option<String>,
    pub hourly_rate: Option<f64>,
}

// ==================== Project Commands ====================

#[tauri::command]
pub fn create_project(input: ProjectCreateInput, created_by: i64) -> Result<Project, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let now = Utc::now().to_rfc3339();
    let owner_id = created_by;
    
    conn.execute(
        "INSERT INTO projects (
            project_no, name, code, category, type, industry, description,
            objectives, deliverables, status, priority, start_date, end_date,
            budget, currency, customer_id, customer_contact, customer_email,
            customer_phone, owner_id, manager_id, team_member_ids,
            parent_project_id, is_template, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'planning', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        params![
            input.project_no, input.name, input.code, input.category, input.r#type,
            input.industry, input.description, input.objectives, input.deliverables,
            input.priority.unwrap_or_else(|| "medium".to_string()),
            input.start_date, input.end_date, input.budget.unwrap_or(0.0),
            input.currency.unwrap_or_else(|| "CNY".to_string()),
            input.customer_id, input.customer_contact, input.customer_email,
            input.customer_phone, owner_id, input.manager_id, input.team_member_ids,
            input.parent_project_id, input.is_template.unwrap_or(0),
            created_by, now, now
        ],
    ).map_err(|e| e.to_string())?;
    
    let id = conn.last_insert_rowid();
    
    get_project_by_id(id)
}

#[tauri::command]
pub fn get_project_by_id(id: i64) -> Result<Project, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT * FROM projects WHERE id = ?"
    ).map_err(|e| e.to_string())?;
    
    let project = stmt.query_row(params![id], |row| {
        Ok(Project {
            id: row.get(0)?,
            project_no: row.get(1)?,
            name: row.get(2)?,
            code: row.get(3)?,
            category: row.get(4)?,
            r#type: row.get(5)?,
            industry: row.get(6)?,
            description: row.get(7)?,
            objectives: row.get(8)?,
            deliverables: row.get(9)?,
            status: row.get(10)?,
            priority: row.get(11)?,
            start_date: row.get(12)?,
            end_date: row.get(13)?,
            actual_start_date: row.get(14)?,
            actual_end_date: row.get(15)?,
            budget: row.get(16)?,
            actual_cost: row.get(17)?,
            currency: row.get(18)?,
            customer_id: row.get(19)?,
            customer_contact: row.get(20)?,
            customer_email: row.get(21)?,
            customer_phone: row.get(22)?,
            owner_id: row.get(23)?,
            manager_id: row.get(24)?,
            team_member_ids: row.get(25)?,
            progress_percentage: row.get(26)?,
            milestone_count: row.get(27)?,
            completed_milestone_count: row.get(28)?,
            task_count: row.get(29)?,
            completed_task_count: row.get(30)?,
            risk_level: row.get(31)?,
            issues_count: row.get(32)?,
            parent_project_id: row.get(33)?,
            is_template: row.get(34)?,
            template_id: row.get(35)?,
            created_by: row.get(36)?,
            created_at: row.get(37)?,
            updated_at: row.get(38)?,
        })
    }).map_err(|e| e.to_string())?;
    
    Ok(project)
}

#[tauri::command]
pub fn get_all_projects() -> Result<Vec<Project>, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT * FROM projects ORDER BY created_at DESC"
    ).map_err(|e| e.to_string())?;
    
    let projects = stmt.query_map([], |row| {
        Ok(Project {
            id: row.get(0)?,
            project_no: row.get(1)?,
            name: row.get(2)?,
            code: row.get(3)?,
            category: row.get(4)?,
            r#type: row.get(5)?,
            industry: row.get(6)?,
            description: row.get(7)?,
            objectives: row.get(8)?,
            deliverables: row.get(9)?,
            status: row.get(10)?,
            priority: row.get(11)?,
            start_date: row.get(12)?,
            end_date: row.get(13)?,
            actual_start_date: row.get(14)?,
            actual_end_date: row.get(15)?,
            budget: row.get(16)?,
            actual_cost: row.get(17)?,
            currency: row.get(18)?,
            customer_id: row.get(19)?,
            customer_contact: row.get(20)?,
            customer_email: row.get(21)?,
            customer_phone: row.get(22)?,
            owner_id: row.get(23)?,
            manager_id: row.get(24)?,
            team_member_ids: row.get(25)?,
            progress_percentage: row.get(26)?,
            milestone_count: row.get(27)?,
            completed_milestone_count: row.get(28)?,
            task_count: row.get(29)?,
            completed_task_count: row.get(30)?,
            risk_level: row.get(31)?,
            issues_count: row.get(32)?,
            parent_project_id: row.get(33)?,
            is_template: row.get(34)?,
            template_id: row.get(35)?,
            created_by: row.get(36)?,
            created_at: row.get(37)?,
            updated_at: row.get(38)?,
        })
    }).map_err(|e| e.to_string())?;
    
    projects.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_project(id: i64, input: ProjectUpdateInput) -> Result<Project, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "UPDATE projects SET
            name = COALESCE(?, name),
            code = COALESCE(?, code),
            category = COALESCE(?, category),
            type = COALESCE(?, type),
            industry = COALESCE(?, industry),
            description = COALESCE(?, description),
            objectives = COALESCE(?, objectives),
            deliverables = COALESCE(?, deliverables),
            status = COALESCE(?, status),
            priority = COALESCE(?, priority),
            start_date = COALESCE(?, start_date),
            end_date = COALESCE(?, end_date),
            actual_start_date = COALESCE(?, actual_start_date),
            actual_end_date = COALESCE(?, actual_end_date),
            budget = COALESCE(?, budget),
            actual_cost = COALESCE(?, actual_cost),
            progress_percentage = COALESCE(?, progress_percentage),
            risk_level = COALESCE(?, risk_level),
            manager_id = COALESCE(?, manager_id),
            team_member_ids = COALESCE(?, team_member_ids),
            updated_at = ?
        WHERE id = ?",
        params![
            input.name, input.code, input.category, input.r#type, input.industry,
            input.description, input.objectives, input.deliverables, input.status,
            input.priority, input.start_date, input.end_date, input.actual_start_date,
            input.actual_end_date, input.budget, input.actual_cost, input.progress_percentage,
            input.risk_level, input.manager_id, input.team_member_ids, now, id
        ],
    ).map_err(|e| e.to_string())?;
    
    get_project_by_id(id)
}

#[tauri::command]
pub fn delete_project(id: i64) -> Result<bool, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    conn.execute("DELETE FROM projects WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;
    
    Ok(true)
}

#[tauri::command]
pub fn get_projects_by_status(status: String) -> Result<Vec<Project>, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC"
    ).map_err(|e| e.to_string())?;
    
    let projects = stmt.query_map(params![status], |row| {
        Ok(Project {
            id: row.get(0)?,
            project_no: row.get(1)?,
            name: row.get(2)?,
            code: row.get(3)?,
            category: row.get(4)?,
            r#type: row.get(5)?,
            industry: row.get(6)?,
            description: row.get(7)?,
            objectives: row.get(8)?,
            deliverables: row.get(9)?,
            status: row.get(10)?,
            priority: row.get(11)?,
            start_date: row.get(12)?,
            end_date: row.get(13)?,
            actual_start_date: row.get(14)?,
            actual_end_date: row.get(15)?,
            budget: row.get(16)?,
            actual_cost: row.get(17)?,
            currency: row.get(18)?,
            customer_id: row.get(19)?,
            customer_contact: row.get(20)?,
            customer_email: row.get(21)?,
            customer_phone: row.get(22)?,
            owner_id: row.get(23)?,
            manager_id: row.get(24)?,
            team_member_ids: row.get(25)?,
            progress_percentage: row.get(26)?,
            milestone_count: row.get(27)?,
            completed_milestone_count: row.get(28)?,
            task_count: row.get(29)?,
            completed_task_count: row.get(30)?,
            risk_level: row.get(31)?,
            issues_count: row.get(32)?,
            parent_project_id: row.get(33)?,
            is_template: row.get(34)?,
            template_id: row.get(35)?,
            created_by: row.get(36)?,
            created_at: row.get(37)?,
            updated_at: row.get(38)?,
        })
    }).map_err(|e| e.to_string())?;
    
    projects.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_project_statistics() -> Result<ProjectStatistics, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let total_projects: i64 = conn.query_row(
        "SELECT COUNT(*) FROM projects", [], |row| row.get(0)
    ).map_err(|e| e.to_string())?;
    
    let active_projects: i64 = conn.query_row(
        "SELECT COUNT(*) FROM projects WHERE status = 'active'", [], |row| row.get(0)
    ).map_err(|e| e.to_string())?;
    
    let completed_projects: i64 = conn.query_row(
        "SELECT COUNT(*) FROM projects WHERE status = 'completed'", [], |row| row.get(0)
    ).map_err(|e| e.to_string())?;
    
    let on_hold_projects: i64 = conn.query_row(
        "SELECT COUNT(*) FROM projects WHERE status = 'on_hold'", [], |row| row.get(0)
    ).map_err(|e| e.to_string())?;
    
    let total_tasks: i64 = conn.query_row(
        "SELECT COUNT(*) FROM project_tasks", [], |row| row.get(0)
    ).map_err(|e| e.to_string())?;
    
    let completed_tasks: i64 = conn.query_row(
        "SELECT COUNT(*) FROM project_tasks WHERE status = 'done'", [], |row| row.get(0)
    ).map_err(|e| e.to_string())?;
    
    let total_hours_logged: f64 = conn.query_row(
        "SELECT COALESCE(SUM(duration_hours), 0) FROM time_entries", [], |row| row.get(0)
    ).map_err(|e| e.to_string())?;
    
    let total_budget: f64 = conn.query_row(
        "SELECT COALESCE(SUM(budget), 0) FROM projects", [], |row| row.get(0)
    ).map_err(|e| e.to_string())?;
    
    let total_actual_cost: f64 = conn.query_row(
        "SELECT COALESCE(SUM(actual_cost), 0) FROM projects", [], |row| row.get(0)
    ).map_err(|e| e.to_string())?;
    
    Ok(ProjectStatistics {
        total_projects,
        active_projects,
        completed_projects,
        on_hold_projects,
        total_tasks,
        completed_tasks,
        total_hours_logged,
        total_budget,
        total_actual_cost,
    })
}

// ==================== Milestone Commands ====================

#[tauri::command]
pub fn create_milestone(project_id: i64, input: MilestoneCreateInput, created_by: i64) -> Result<ProjectMilestone, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO project_milestones (
            project_id, milestone_no, name, description, planned_date,
            status, deliverables, acceptance_criteria, sort_order,
            created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?)",
        params![
            project_id, input.milestone_no, input.name, input.description,
            input.planned_date, input.deliverables, input.acceptance_criteria,
            input.sort_order.unwrap_or(0), created_by, now, now
        ],
    ).map_err(|e| e.to_string())?;
    
    let id = conn.last_insert_rowid();
    get_milestone_by_id(id)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MilestoneCreateInput {
    pub milestone_no: String,
    pub name: String,
    pub description: Option<String>,
    pub planned_date: String,
    pub deliverables: Option<String>,
    pub acceptance_criteria: Option<String>,
    pub sort_order: Option<i32>,
}

#[tauri::command]
pub fn get_milestone_by_id(id: i64) -> Result<ProjectMilestone, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare("SELECT * FROM project_milestones WHERE id = ?")
        .map_err(|e| e.to_string())?;
    
    stmt.query_row(params![id], |row| {
        Ok(ProjectMilestone {
            id: row.get(0)?,
            project_id: row.get(1)?,
            milestone_no: row.get(2)?,
            name: row.get(3)?,
            description: row.get(4)?,
            planned_date: row.get(5)?,
            actual_date: row.get(6)?,
            status: row.get(7)?,
            completion_percentage: row.get(8)?,
            deliverables: row.get(9)?,
            acceptance_criteria: row.get(10)?,
            accepted_by: row.get(11)?,
            accepted_at: row.get(12)?,
            acceptance_notes: row.get(13)?,
            sort_order: row.get(14)?,
            created_by: row.get(15)?,
            created_at: row.get(16)?,
            updated_at: row.get(17)?,
        })
    }).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_milestones_by_project(project_id: i64) -> Result<Vec<ProjectMilestone>, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT * FROM project_milestones WHERE project_id = ? ORDER BY sort_order, planned_date"
    ).map_err(|e| e.to_string())?;
    
    let milestones = stmt.query_map(params![project_id], |row| {
        Ok(ProjectMilestone {
            id: row.get(0)?,
            project_id: row.get(1)?,
            milestone_no: row.get(2)?,
            name: row.get(3)?,
            description: row.get(4)?,
            planned_date: row.get(5)?,
            actual_date: row.get(6)?,
            status: row.get(7)?,
            completion_percentage: row.get(8)?,
            deliverables: row.get(9)?,
            acceptance_criteria: row.get(10)?,
            accepted_by: row.get(11)?,
            accepted_at: row.get(12)?,
            acceptance_notes: row.get(13)?,
            sort_order: row.get(14)?,
            created_by: row.get(15)?,
            created_at: row.get(16)?,
            updated_at: row.get(17)?,
        })
    }).map_err(|e| e.to_string())?;
    
    milestones.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_milestone(id: i64, status: String, actual_date: Option<String>, completion_percentage: f64) -> Result<ProjectMilestone, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "UPDATE project_milestones SET status = ?, actual_date = ?, completion_percentage = ?, updated_at = ? WHERE id = ?",
        params![status, actual_date, completion_percentage, now, id],
    ).map_err(|e| e.to_string())?;
    
    get_milestone_by_id(id)
}

#[tauri::command]
pub fn delete_milestone(id: i64) -> Result<bool, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM project_milestones WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

// ==================== Task Commands ====================

#[tauri::command]
pub fn create_task(project_id: i64, input: ProjectTaskCreateInput, created_by: i64) -> Result<ProjectTask, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO project_tasks (
            project_id, task_no, name, description, phase, category, type,
            status, priority, severity, estimated_hours, start_date, due_date,
            assignee_id, milestone_id, parent_task_id, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'todo', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        params![
            project_id, input.task_no, input.name, input.description, input.phase,
            input.category, input.r#type, input.priority.unwrap_or_else(|| "medium".to_string()),
            input.severity, input.estimated_hours.unwrap_or(0.0), input.start_date,
            input.due_date, input.assignee_id, input.milestone_id, input.parent_task_id,
            created_by, now, now
        ],
    ).map_err(|e| e.to_string())?;
    
    let id = conn.last_insert_rowid();
    get_task_by_id(id)
}

#[tauri::command]
pub fn get_task_by_id(id: i64) -> Result<ProjectTask, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare("SELECT * FROM project_tasks WHERE id = ?")
        .map_err(|e| e.to_string())?;
    
    stmt.query_row(params![id], |row| {
        Ok(ProjectTask {
            id: row.get(0)?,
            project_id: row.get(1)?,
            task_no: row.get(2)?,
            name: row.get(3)?,
            description: row.get(4)?,
            phase: row.get(5)?,
            category: row.get(6)?,
            r#type: row.get(7)?,
            status: row.get(8)?,
            priority: row.get(9)?,
            severity: row.get(10)?,
            estimated_hours: row.get(11)?,
            actual_hours: row.get(12)?,
            remaining_hours: row.get(13)?,
            start_date: row.get(14)?,
            due_date: row.get(15)?,
            actual_start_date: row.get(16)?,
            actual_end_date: row.get(17)?,
            assignee_id: row.get(18)?,
            reporter_id: row.get(19)?,
            parent_task_id: row.get(20)?,
            dependency_ids: row.get(21)?,
            milestone_id: row.get(22)?,
            progress_percentage: row.get(23)?,
            tags: row.get(24)?,
            iteration: row.get(25)?,
            created_by: row.get(26)?,
            created_at: row.get(27)?,
            updated_at: row.get(28)?,
        })
    }).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_tasks_by_project(project_id: i64) -> Result<Vec<ProjectTask>, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT * FROM project_tasks WHERE project_id = ? ORDER BY created_at DESC"
    ).map_err(|e| e.to_string())?;
    
    let tasks = stmt.query_map(params![project_id], |row| {
        Ok(ProjectTask {
            id: row.get(0)?,
            project_id: row.get(1)?,
            task_no: row.get(2)?,
            name: row.get(3)?,
            description: row.get(4)?,
            phase: row.get(5)?,
            category: row.get(6)?,
            r#type: row.get(7)?,
            status: row.get(8)?,
            priority: row.get(9)?,
            severity: row.get(10)?,
            estimated_hours: row.get(11)?,
            actual_hours: row.get(12)?,
            remaining_hours: row.get(13)?,
            start_date: row.get(14)?,
            due_date: row.get(15)?,
            actual_start_date: row.get(16)?,
            actual_end_date: row.get(17)?,
            assignee_id: row.get(18)?,
            reporter_id: row.get(19)?,
            parent_task_id: row.get(20)?,
            dependency_ids: row.get(21)?,
            milestone_id: row.get(22)?,
            progress_percentage: row.get(23)?,
            tags: row.get(24)?,
            iteration: row.get(25)?,
            created_by: row.get(26)?,
            created_at: row.get(27)?,
            updated_at: row.get(28)?,
        })
    }).map_err(|e| e.to_string())?;
    
    tasks.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_task_status(id: i64, status: String, progress_percentage: f64) -> Result<ProjectTask, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "UPDATE project_tasks SET status = ?, progress_percentage = ?, updated_at = ? WHERE id = ?",
        params![status, progress_percentage, now, id],
    ).map_err(|e| e.to_string())?;
    
    get_task_by_id(id)
}

#[tauri::command]
pub fn delete_task(id: i64) -> Result<bool, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM project_tasks WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

// ==================== Time Entry Commands ====================

#[tauri::command]
pub fn create_time_entry(input: TimeEntryCreateInput) -> Result<TimeEntry, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO time_entries (
            employee_id, project_id, task_id, entry_date, start_time, end_time,
            duration_hours, work_type, billable, description, work_category,
            status, hourly_rate, total_amount, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, ?, ?, ?)",
        params![
            input.employee_id, input.project_id, input.task_id, input.entry_date,
            input.start_time, input.end_time, input.duration_hours,
            input.work_type.unwrap_or_else(|| "regular".to_string()),
            input.billable.unwrap_or(1), input.description, input.work_category,
            input.hourly_rate.unwrap_or(0.0),
            input.hourly_rate.unwrap_or(0.0) * input.duration_hours,
            now, now
        ],
    ).map_err(|e| e.to_string())?;
    
    let id = conn.last_insert_rowid();
    get_time_entry_by_id(id)
}

#[tauri::command]
pub fn get_time_entry_by_id(id: i64) -> Result<TimeEntry, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare("SELECT * FROM time_entries WHERE id = ?")
        .map_err(|e| e.to_string())?;
    
    stmt.query_row(params![id], |row| {
        Ok(TimeEntry {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            project_id: row.get(2)?,
            task_id: row.get(3)?,
            entry_date: row.get(4)?,
            start_time: row.get(5)?,
            end_time: row.get(6)?,
            duration_hours: row.get(7)?,
            work_type: row.get(8)?,
            billable: row.get(9)?,
            description: row.get(10)?,
            work_category: row.get(11)?,
            status: row.get(12)?,
            approved_by: row.get(13)?,
            approved_at: row.get(14)?,
            rejection_reason: row.get(15)?,
            hourly_rate: row.get(16)?,
            total_amount: row.get(17)?,
            created_at: row.get(18)?,
            updated_at: row.get(19)?,
        })
    }).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_time_entries_by_project(project_id: i64) -> Result<Vec<TimeEntry>, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT * FROM time_entries WHERE project_id = ? ORDER BY entry_date DESC"
    ).map_err(|e| e.to_string())?;
    
    let entries = stmt.query_map(params![project_id], |row| {
        Ok(TimeEntry {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            project_id: row.get(2)?,
            task_id: row.get(3)?,
            entry_date: row.get(4)?,
            start_time: row.get(5)?,
            end_time: row.get(6)?,
            duration_hours: row.get(7)?,
            work_type: row.get(8)?,
            billable: row.get(9)?,
            description: row.get(10)?,
            work_category: row.get(11)?,
            status: row.get(12)?,
            approved_by: row.get(13)?,
            approved_at: row.get(14)?,
            rejection_reason: row.get(15)?,
            hourly_rate: row.get(16)?,
            total_amount: row.get(17)?,
            created_at: row.get(18)?,
            updated_at: row.get(19)?,
        })
    }).map_err(|e| e.to_string())?;
    
    entries.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn approve_time_entry(id: i64, approved_by: i64) -> Result<TimeEntry, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "UPDATE time_entries SET status = 'approved', approved_by = ?, approved_at = ?, updated_at = ? WHERE id = ?",
        params![approved_by, now, now, id],
    ).map_err(|e| e.to_string())?;
    
    get_time_entry_by_id(id)
}

// ==================== Project Cost Commands ====================

#[tauri::command]
pub fn create_project_cost(project_id: i64, input: CostCreateInput, created_by: i64) -> Result<ProjectCost, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO project_costs (
            project_id, category, sub_category, name, description,
            planned_amount, actual_amount, currency, cost_date, payment_date,
            status, vendor_id, invoice_no, related_task_id, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'planned', ?, ?, ?, ?, ?, ?)",
        params![
            project_id, input.category, input.sub_category, input.name, input.description,
            input.planned_amount.unwrap_or(0.0), input.actual_amount.unwrap_or(0.0),
            input.currency.unwrap_or_else(|| "CNY".to_string()), input.cost_date,
            input.payment_date, input.vendor_id, input.invoice_no, input.related_task_id,
            created_by, now, now
        ],
    ).map_err(|e| e.to_string())?;
    
    let id = conn.last_insert_rowid();
    get_project_cost_by_id(id)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CostCreateInput {
    pub category: String,
    pub sub_category: Option<String>,
    pub name: String,
    pub description: Option<String>,
    pub planned_amount: Option<f64>,
    pub actual_amount: Option<f64>,
    pub currency: Option<String>,
    pub cost_date: Option<String>,
    pub payment_date: Option<String>,
    pub vendor_id: Option<i64>,
    pub invoice_no: Option<String>,
    pub related_task_id: Option<i64>,
}

#[tauri::command]
pub fn get_project_cost_by_id(id: i64) -> Result<ProjectCost, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare("SELECT * FROM project_costs WHERE id = ?")
        .map_err(|e| e.to_string())?;
    
    stmt.query_row(params![id], |row| {
        Ok(ProjectCost {
            id: row.get(0)?,
            project_id: row.get(1)?,
            category: row.get(2)?,
            sub_category: row.get(3)?,
            name: row.get(4)?,
            description: row.get(5)?,
            planned_amount: row.get(6)?,
            actual_amount: row.get(7)?,
            currency: row.get(8)?,
            cost_date: row.get(9)?,
            payment_date: row.get(10)?,
            status: row.get(11)?,
            vendor_id: row.get(12)?,
            invoice_no: row.get(13)?,
            related_task_id: row.get(14)?,
            approved_by: row.get(15)?,
            approved_at: row.get(16)?,
            notes: row.get(17)?,
            created_by: row.get(18)?,
            created_at: row.get(19)?,
            updated_at: row.get(20)?,
        })
    }).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_costs_by_project(project_id: i64) -> Result<Vec<ProjectCost>, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT * FROM project_costs WHERE project_id = ? ORDER BY created_at DESC"
    ).map_err(|e| e.to_string())?;
    
    let costs = stmt.query_map(params![project_id], |row| {
        Ok(ProjectCost {
            id: row.get(0)?,
            project_id: row.get(1)?,
            category: row.get(2)?,
            sub_category: row.get(3)?,
            name: row.get(4)?,
            description: row.get(5)?,
            planned_amount: row.get(6)?,
            actual_amount: row.get(7)?,
            currency: row.get(8)?,
            cost_date: row.get(9)?,
            payment_date: row.get(10)?,
            status: row.get(11)?,
            vendor_id: row.get(12)?,
            invoice_no: row.get(13)?,
            related_task_id: row.get(14)?,
            approved_by: row.get(15)?,
            approved_at: row.get(16)?,
            notes: row.get(17)?,
            created_by: row.get(18)?,
            created_at: row.get(19)?,
            updated_at: row.get(20)?,
        })
    }).map_err(|e| e.to_string())?;
    
    costs.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

// ==================== Project Document Commands ====================

#[tauri::command]
pub fn create_project_document(project_id: i64, input: DocumentCreateInput, created_by: i64) -> Result<ProjectDocument, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO project_documents (
            project_id, task_id, name, description, category, document_type,
            file_url, file_size_bytes, file_hash, version, version_notes,
            is_latest, visibility, access_level, status, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, 'draft', ?, ?, ?)",
        params![
            project_id, input.task_id, input.name, input.description, input.category,
            input.document_type, input.file_url, input.file_size_bytes, input.file_hash,
            input.version.unwrap_or_else(|| "1.0".to_string()), input.version_notes,
            input.visibility.unwrap_or_else(|| "team".to_string()),
            input.access_level.unwrap_or_else(|| "read".to_string()),
            created_by, now, now
        ],
    ).map_err(|e| e.to_string())?;
    
    let id = conn.last_insert_rowid();
    get_project_document_by_id(id)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DocumentCreateInput {
    pub task_id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub category: Option<String>,
    pub document_type: Option<String>,
    pub file_url: String,
    pub file_size_bytes: Option<i64>,
    pub file_hash: Option<String>,
    pub version: Option<String>,
    pub version_notes: Option<String>,
    pub visibility: Option<String>,
    pub access_level: Option<String>,
}

#[tauri::command]
pub fn get_project_document_by_id(id: i64) -> Result<ProjectDocument, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare("SELECT * FROM project_documents WHERE id = ?")
        .map_err(|e| e.to_string())?;
    
    stmt.query_row(params![id], |row| {
        Ok(ProjectDocument {
            id: row.get(0)?,
            project_id: row.get(1)?,
            task_id: row.get(2)?,
            name: row.get(3)?,
            description: row.get(4)?,
            category: row.get(5)?,
            document_type: row.get(6)?,
            file_url: row.get(7)?,
            file_size_bytes: row.get(8)?,
            file_hash: row.get(9)?,
            version: row.get(10)?,
            version_notes: row.get(11)?,
            is_latest: row.get(12)?,
            visibility: row.get(13)?,
            access_level: row.get(14)?,
            status: row.get(15)?,
            reviewed_by: row.get(16)?,
            reviewed_at: row.get(17)?,
            download_count: row.get(18)?,
            created_by: row.get(19)?,
            created_at: row.get(20)?,
            updated_at: row.get(21)?,
        })
    }).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_documents_by_project(project_id: i64) -> Result<Vec<ProjectDocument>, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT * FROM project_documents WHERE project_id = ? AND is_latest = 1 ORDER BY created_at DESC"
    ).map_err(|e| e.to_string())?;
    
    let docs = stmt.query_map(params![project_id], |row| {
        Ok(ProjectDocument {
            id: row.get(0)?,
            project_id: row.get(1)?,
            task_id: row.get(2)?,
            name: row.get(3)?,
            description: row.get(4)?,
            category: row.get(5)?,
            document_type: row.get(6)?,
            file_url: row.get(7)?,
            file_size_bytes: row.get(8)?,
            file_hash: row.get(9)?,
            version: row.get(10)?,
            version_notes: row.get(11)?,
            is_latest: row.get(12)?,
            visibility: row.get(13)?,
            access_level: row.get(14)?,
            status: row.get(15)?,
            reviewed_by: row.get(16)?,
            reviewed_at: row.get(17)?,
            download_count: row.get(18)?,
            created_by: row.get(19)?,
            created_at: row.get(20)?,
            updated_at: row.get(21)?,
        })
    }).map_err(|e| e.to_string())?;
    
    docs.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

// ==================== Project Issue Commands ====================

#[tauri::command]
pub fn create_project_issue(project_id: i64, input: IssueCreateInput, created_by: i64) -> Result<ProjectIssue, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO project_issues (
            project_id, issue_no, title, description, type, category,
            status, priority, severity, assignee_id, reporter_id,
            due_date, impact_cost, impact_days, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        params![
            project_id, input.issue_no, input.title, input.description, input.r#type,
            input.category, input.priority.unwrap_or_else(|| "medium".to_string()),
            input.severity.unwrap_or_else(|| "medium".to_string()),
            input.assignee_id, input.reporter_id, input.due_date,
            input.impact_cost.unwrap_or(0.0), input.impact_days.unwrap_or(0),
            created_by, now, now
        ],
    ).map_err(|e| e.to_string())?;
    
    let id = conn.last_insert_rowid();
    get_project_issue_by_id(id)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IssueCreateInput {
    pub issue_no: String,
    pub title: String,
    pub description: String,
    pub r#type: Option<String>,
    pub category: Option<String>,
    pub priority: Option<String>,
    pub severity: Option<String>,
    pub assignee_id: Option<i64>,
    pub reporter_id: Option<i64>,
    pub due_date: Option<String>,
    pub impact_cost: Option<f64>,
    pub impact_days: Option<i32>,
}

#[tauri::command]
pub fn get_project_issue_by_id(id: i64) -> Result<ProjectIssue, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare("SELECT * FROM project_issues WHERE id = ?")
        .map_err(|e| e.to_string())?;
    
    stmt.query_row(params![id], |row| {
        Ok(ProjectIssue {
            id: row.get(0)?,
            project_id: row.get(1)?,
            issue_no: row.get(2)?,
            title: row.get(3)?,
            description: row.get(4)?,
            r#type: row.get(5)?,
            category: row.get(6)?,
            status: row.get(7)?,
            priority: row.get(8)?,
            severity: row.get(9)?,
            assignee_id: row.get(10)?,
            reporter_id: row.get(11)?,
            reported_date: row.get(12)?,
            resolved_date: row.get(13)?,
            due_date: row.get(14)?,
            solution: row.get(15)?,
            resolution_notes: row.get(16)?,
            impact_description: row.get(17)?,
            impact_cost: row.get(18)?,
            impact_days: row.get(19)?,
            created_by: row.get(20)?,
            created_at: row.get(21)?,
            updated_at: row.get(22)?,
        })
    }).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_issues_by_project(project_id: i64) -> Result<Vec<ProjectIssue>, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT * FROM project_issues WHERE project_id = ? ORDER BY created_at DESC"
    ).map_err(|e| e.to_string())?;
    
    let issues = stmt.query_map(params![project_id], |row| {
        Ok(ProjectIssue {
            id: row.get(0)?,
            project_id: row.get(1)?,
            issue_no: row.get(2)?,
            title: row.get(3)?,
            description: row.get(4)?,
            r#type: row.get(5)?,
            category: row.get(6)?,
            status: row.get(7)?,
            priority: row.get(8)?,
            severity: row.get(9)?,
            assignee_id: row.get(10)?,
            reporter_id: row.get(11)?,
            reported_date: row.get(12)?,
            resolved_date: row.get(13)?,
            due_date: row.get(14)?,
            solution: row.get(15)?,
            resolution_notes: row.get(16)?,
            impact_description: row.get(17)?,
            impact_cost: row.get(18)?,
            impact_days: row.get(19)?,
            created_by: row.get(20)?,
            created_at: row.get(21)?,
            updated_at: row.get(22)?,
        })
    }).map_err(|e| e.to_string())?;
    
    issues.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn resolve_project_issue(id: i64, solution: String) -> Result<ProjectIssue, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "UPDATE project_issues SET status = 'resolved', solution = ?, resolved_date = ?, updated_at = ? WHERE id = ?",
        params![solution, now, now, id],
    ).map_err(|e| e.to_string())?;
    
    get_project_issue_by_id(id)
}

// ==================== Project Member Commands ====================

#[tauri::command]
pub fn add_project_member(project_id: i64, employee_id: i64, role: String, created_by: i64) -> Result<ProjectMember, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO project_members (
            project_id, employee_id, role, status, access_level,
            joined_at, created_by, created_at
        ) VALUES (?, ?, ?, 'active', 'member', ?, ?, ?)",
        params![project_id, employee_id, role, now, created_by, now],
    ).map_err(|e| e.to_string())?;
    
    let id = conn.last_insert_rowid();
    get_project_member_by_id(id)
}

#[tauri::command]
pub fn get_project_member_by_id(id: i64) -> Result<ProjectMember, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare("SELECT * FROM project_members WHERE id = ?")
        .map_err(|e| e.to_string())?;
    
    stmt.query_row(params![id], |row| {
        Ok(ProjectMember {
            id: row.get(0)?,
            project_id: row.get(1)?,
            employee_id: row.get(2)?,
            role: row.get(3)?,
            responsibilities: row.get(4)?,
            allocation_percentage: row.get(5)?,
            start_date: row.get(6)?,
            end_date: row.get(7)?,
            access_level: row.get(8)?,
            status: row.get(9)?,
            joined_at: row.get(10)?,
            left_at: row.get(11)?,
            created_by: row.get(12)?,
            created_at: row.get(13)?,
        })
    }).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_members_by_project(project_id: i64) -> Result<Vec<ProjectMember>, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    
    let mut stmt = conn.prepare(
        "SELECT * FROM project_members WHERE project_id = ? AND status = 'active' ORDER BY joined_at"
    ).map_err(|e| e.to_string())?;
    
    let members = stmt.query_map(params![project_id], |row| {
        Ok(ProjectMember {
            id: row.get(0)?,
            project_id: row.get(1)?,
            employee_id: row.get(2)?,
            role: row.get(3)?,
            responsibilities: row.get(4)?,
            allocation_percentage: row.get(5)?,
            start_date: row.get(6)?,
            end_date: row.get(7)?,
            access_level: row.get(8)?,
            status: row.get(9)?,
            joined_at: row.get(10)?,
            left_at: row.get(11)?,
            created_by: row.get(12)?,
            created_at: row.get(13)?,
        })
    }).map_err(|e| e.to_string())?;
    
    members.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn remove_project_member(id: i64) -> Result<bool, String> {
    let conn = Connection::open("laifu_erp.db").map_err(|e| e.to_string())?;
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "UPDATE project_members SET status = 'removed', left_at = ? WHERE id = ?",
        params![now, id],
    ).map_err(|e| e.to_string())?;
    
    Ok(true)
}
