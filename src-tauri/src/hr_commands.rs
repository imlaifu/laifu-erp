// HR Management Module Rust Commands
// 人力资源管理模块 - 完整 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

// ==================== Types ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Employee {
    pub id: i64,
    pub employee_no: String,
    pub name: String,
    pub gender: String,
    pub birth_date: Option<String>,
    pub id_card: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub department_id: Option<i64>,
    pub position: Option<String>,
    pub job_title: Option<String>,
    pub employment_type: String,
    pub employment_status: String,
    pub hire_date: Option<String>,
    pub termination_date: Option<String>,
    pub base_salary: f64,
    pub bank_account: Option<String>,
    pub bank_name: Option<String>,
    pub emergency_contact: Option<String>,
    pub emergency_phone: Option<String>,
    pub address: Option<String>,
    pub photo_url: Option<String>,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Department {
    pub id: i64,
    pub name: String,
    pub code: Option<String>,
    pub parent_id: Option<i64>,
    pub manager_id: Option<i64>,
    pub description: Option<String>,
    pub sort_order: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AttendanceRecord {
    pub id: i64,
    pub employee_id: i64,
    pub date: String,
    pub check_in_time: Option<String>,
    pub check_out_time: Option<String>,
    pub work_hours: f64,
    pub overtime_hours: f64,
    pub status: String,
    pub location: Option<String>,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LeaveApplication {
    pub id: i64,
    pub employee_id: i64,
    pub leave_type: String,
    pub start_date: String,
    pub end_date: String,
    pub days: f64,
    pub reason: Option<String>,
    pub status: String,
    pub approver_id: Option<i64>,
    pub approval_date: Option<String>,
    pub approval_notes: Option<String>,
    pub attachment_url: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LeaveType {
    pub id: i64,
    pub name: String,
    pub code: String,
    pub days_per_year: f64,
    pub paid: i32,
    pub description: Option<String>,
    pub sort_order: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SalaryRecord {
    pub id: i64,
    pub employee_id: i64,
    pub year_month: String,
    pub base_salary: f64,
    pub performance_bonus: f64,
    pub overtime_pay: f64,
    pub allowance: f64,
    pub deduction: f64,
    pub social_security: f64,
    pub housing_fund: f64,
    pub tax: f64,
    pub actual_salary: f64,
    pub payment_date: Option<String>,
    pub payment_status: String,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PerformanceEvaluation {
    pub id: i64,
    pub employee_id: i64,
    pub evaluation_period: String,
    pub evaluator_id: Option<i64>,
    pub self_score: Option<f64>,
    pub manager_score: Option<f64>,
    pub final_score: Option<f64>,
    pub rating: Option<String>,
    pub strengths: Option<String>,
    pub weaknesses: Option<String>,
    pub goals: Option<String>,
    pub status: String,
    pub review_date: Option<String>,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TrainingRecord {
    pub id: i64,
    pub employee_id: i64,
    pub training_name: String,
    pub training_type: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub hours: f64,
    pub trainer: Option<String>,
    pub location: Option<String>,
    pub cost: f64,
    pub status: String,
    pub certificate_url: Option<String>,
    pub score: Option<f64>,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HRStatistics {
    pub total_employees: i64,
    pub active_employees: i64,
    pub new_hires_this_month: i64,
    pub terminations_this_month: i64,
    pub total_departments: i64,
    pub pending_leaves: i64,
    pub total_payroll: f64,
}

// ==================== Input Types ====================

#[derive(Debug, Serialize, Deserialize)]
pub struct EmployeeCreateInput {
    pub employee_no: String,
    pub name: String,
    pub gender: Option<String>,
    pub birth_date: Option<String>,
    pub id_card: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub department_id: Option<i64>,
    pub position: Option<String>,
    pub job_title: Option<String>,
    pub employment_type: Option<String>,
    pub hire_date: Option<String>,
    pub base_salary: Option<f64>,
    pub bank_account: Option<String>,
    pub bank_name: Option<String>,
    pub emergency_contact: Option<String>,
    pub emergency_phone: Option<String>,
    pub address: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmployeeUpdateInput {
    pub name: Option<String>,
    pub gender: Option<String>,
    pub birth_date: Option<String>,
    pub id_card: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub department_id: Option<i64>,
    pub position: Option<String>,
    pub job_title: Option<String>,
    pub employment_type: Option<String>,
    pub employment_status: Option<String>,
    pub termination_date: Option<String>,
    pub base_salary: Option<f64>,
    pub bank_account: Option<String>,
    pub bank_name: Option<String>,
    pub emergency_contact: Option<String>,
    pub emergency_phone: Option<String>,
    pub address: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LeaveCreateInput {
    pub employee_id: i64,
    pub leave_type: String,
    pub start_date: String,
    pub end_date: String,
    pub reason: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LeaveApproveInput {
    pub leave_id: i64,
    pub approved: bool,
    pub approval_notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalaryCreateInput {
    pub employee_id: i64,
    pub year_month: String,
    pub base_salary: f64,
    pub performance_bonus: Option<f64>,
    pub overtime_pay: Option<f64>,
    pub allowance: Option<f64>,
    pub deduction: Option<f64>,
    pub social_security: Option<f64>,
    pub housing_fund: Option<f64>,
    pub tax: Option<f64>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EvaluationCreateInput {
    pub employee_id: i64,
    pub evaluation_period: String,
    pub evaluator_id: Option<i64>,
    pub self_score: Option<f64>,
    pub manager_score: Option<f64>,
    pub strengths: Option<String>,
    pub weaknesses: Option<String>,
    pub goals: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TrainingCreateInput {
    pub employee_id: i64,
    pub training_name: String,
    pub training_type: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub hours: Option<f64>,
    pub trainer: Option<String>,
    pub location: Option<String>,
    pub cost: Option<f64>,
    pub notes: Option<String>,
}

// ==================== Employee CRUD ====================

pub fn create_employee(conn: &Connection, input: EmployeeCreateInput) -> Result<Employee> {
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO employees (employee_no, name, gender, birth_date, id_card, phone, email, 
         department_id, position, job_title, employment_type, employment_status, hire_date, 
         base_salary, bank_account, bank_name, emergency_contact, emergency_phone, address, 
         notes, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, 'active', ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?20)",
        params![
            input.employee_no,
            input.name,
            input.gender.unwrap_or_else(|| "M".to_string()),
            input.birth_date,
            input.id_card,
            input.phone,
            input.email,
            input.department_id,
            input.position,
            input.job_title,
            input.employment_type.unwrap_or_else(|| "full-time".to_string()),
            input.hire_date,
            input.base_salary.unwrap_or(0.0),
            input.bank_account,
            input.bank_name,
            input.emergency_contact,
            input.emergency_phone,
            input.address,
            input.notes,
            now
        ],
    )?;
    
    let employee_id = conn.last_insert_rowid();
    get_employee(conn, employee_id)
}

pub fn get_employee(conn: &Connection, id: i64) -> Result<Employee> {
    let mut stmt = conn.prepare(
        "SELECT * FROM employees WHERE id = ?1"
    )?;
    
    let mut rows = stmt.query(params![id])?;
    
    if let Some(row) = rows.next()? {
        Ok(Employee {
            id: row.get(0)?,
            employee_no: row.get(1)?,
            name: row.get(2)?,
            gender: row.get(3)?,
            birth_date: row.get(4)?,
            id_card: row.get(5)?,
            phone: row.get(6)?,
            email: row.get(7)?,
            department_id: row.get(8)?,
            position: row.get(9)?,
            job_title: row.get(10)?,
            employment_type: row.get(11)?,
            employment_status: row.get(12)?,
            hire_date: row.get(13)?,
            termination_date: row.get(14)?,
            base_salary: row.get(15)?,
            bank_account: row.get(16)?,
            bank_name: row.get(17)?,
            emergency_contact: row.get(18)?,
            emergency_phone: row.get(19)?,
            address: row.get(20)?,
            photo_url: row.get(21)?,
            notes: row.get(22)?,
            created_at: row.get(23)?,
            updated_at: row.get(24)?,
        })
    } else {
        Err(rusqlite::Error::QueryReturnedNoRows)
    }
}

pub fn list_employees(conn: &Connection, limit: i64, offset: i64, department_id: Option<i64>, status: Option<String>) -> Result<Vec<Employee>> {
    let mut sql = String::from("SELECT * FROM employees WHERE 1=1");
    
    if let Some(dept_id) = department_id {
        sql.push_str(&format!(" AND department_id = {}", dept_id));
    }
    if let Some(stat) = status {
        sql.push_str(&format!(" AND employment_status = '{}'", stat));
    }
    
    sql.push_str(" ORDER BY created_at DESC");
    sql.push_str(&format!(" LIMIT {} OFFSET {}", limit, offset));
    
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params![], |row| {
        Ok(Employee {
            id: row.get(0)?,
            employee_no: row.get(1)?,
            name: row.get(2)?,
            gender: row.get(3)?,
            birth_date: row.get(4)?,
            id_card: row.get(5)?,
            phone: row.get(6)?,
            email: row.get(7)?,
            department_id: row.get(8)?,
            position: row.get(9)?,
            job_title: row.get(10)?,
            employment_type: row.get(11)?,
            employment_status: row.get(12)?,
            hire_date: row.get(13)?,
            termination_date: row.get(14)?,
            base_salary: row.get(15)?,
            bank_account: row.get(16)?,
            bank_name: row.get(17)?,
            emergency_contact: row.get(18)?,
            emergency_phone: row.get(19)?,
            address: row.get(20)?,
            photo_url: row.get(21)?,
            notes: row.get(22)?,
            created_at: row.get(23)?,
            updated_at: row.get(24)?,
        })
    })?;
    
    let mut employees = Vec::new();
    for row in rows {
        employees.push(row?);
    }
    
    Ok(employees)
}

pub fn update_employee(conn: &Connection, id: i64, input: EmployeeUpdateInput) -> Result<Employee> {
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "UPDATE employees SET 
         name = COALESCE(?1, name),
         gender = COALESCE(?2, gender),
         birth_date = COALESCE(?3, birth_date),
         id_card = COALESCE(?4, id_card),
         phone = COALESCE(?5, phone),
         email = COALESCE(?6, email),
         department_id = COALESCE(?7, department_id),
         position = COALESCE(?8, position),
         job_title = COALESCE(?9, job_title),
         employment_type = COALESCE(?10, employment_type),
         employment_status = COALESCE(?11, employment_status),
         termination_date = COALESCE(?12, termination_date),
         base_salary = COALESCE(?13, base_salary),
         bank_account = COALESCE(?14, bank_account),
         bank_name = COALESCE(?15, bank_name),
         emergency_contact = COALESCE(?16, emergency_contact),
         emergency_phone = COALESCE(?17, emergency_phone),
         address = COALESCE(?18, address),
         notes = COALESCE(?19, notes),
         updated_at = ?20
         WHERE id = ?21",
        params![
            input.name,
            input.gender,
            input.birth_date,
            input.id_card,
            input.phone,
            input.email,
            input.department_id,
            input.position,
            input.job_title,
            input.employment_type,
            input.employment_status,
            input.termination_date,
            input.base_salary,
            input.bank_account,
            input.bank_name,
            input.emergency_contact,
            input.emergency_phone,
            input.address,
            input.notes,
            now,
            id
        ],
    )?;
    
    get_employee(conn, id)
}

pub fn delete_employee(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM employees WHERE id = ?1", params![id])?;
    Ok(affected > 0)
}

// ==================== Department CRUD ====================

pub fn get_departments(conn: &Connection) -> Result<Vec<Department>> {
    let mut stmt = conn.prepare("SELECT * FROM departments ORDER BY sort_order, id")?;
    let rows = stmt.query_map(params![], |row| {
        Ok(Department {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            parent_id: row.get(3)?,
            manager_id: row.get(4)?,
            description: row.get(5)?,
            sort_order: row.get(6)?,
            created_at: row.get(7)?,
            updated_at: row.get(8)?,
        })
    })?;
    
    let mut departments = Vec::new();
    for row in rows {
        departments.push(row?);
    }
    
    Ok(departments)
}

pub fn create_department(conn: &Connection, name: String, code: Option<String>, parent_id: Option<i64>, description: Option<String>) -> Result<Department> {
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO departments (name, code, parent_id, description, sort_order, created_at, updated_at) 
         VALUES (?1, ?2, ?3, ?4, 0, ?5, ?5)",
        params![name, code, parent_id, description, now],
    )?;
    
    let dept_id = conn.last_insert_rowid();
    
    let mut stmt = conn.prepare("SELECT * FROM departments WHERE id = ?1")?;
    let mut rows = stmt.query(params![dept_id])?;
    
    if let Some(row) = rows.next()? {
        Ok(Department {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            parent_id: row.get(3)?,
            manager_id: row.get(4)?,
            description: row.get(5)?,
            sort_order: row.get(6)?,
            created_at: row.get(7)?,
            updated_at: row.get(8)?,
        })
    } else {
        Err(rusqlite::Error::QueryReturnedNoRows)
    }
}

// ==================== Attendance Commands ====================

pub fn get_attendance_records(conn: &Connection, employee_id: i64, start_date: &str, end_date: &str) -> Result<Vec<AttendanceRecord>> {
    let mut stmt = conn.prepare(
        "SELECT * FROM attendance_records WHERE employee_id = ?1 AND date BETWEEN ?2 AND ?3 ORDER BY date DESC"
    )?;
    
    let rows = stmt.query_map(params![employee_id, start_date, end_date], |row| {
        Ok(AttendanceRecord {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            date: row.get(2)?,
            check_in_time: row.get(3)?,
            check_out_time: row.get(4)?,
            work_hours: row.get(5)?,
            overtime_hours: row.get(6)?,
            status: row.get(7)?,
            location: row.get(8)?,
            notes: row.get(9)?,
            created_at: row.get(10)?,
            updated_at: row.get(11)?,
        })
    })?;
    
    let mut records = Vec::new();
    for row in rows {
        records.push(row?);
    }
    
    Ok(records)
}

pub fn check_in(conn: &Connection, employee_id: i64, location: Option<String>) -> Result<AttendanceRecord> {
    let now = Utc::now();
    let date = now.format("%Y-%m-%d").to_string();
    let check_in_time = now.to_rfc3339();
    
    conn.execute(
        "INSERT INTO attendance_records (employee_id, date, check_in_time, status, location, created_at, updated_at)
         VALUES (?1, ?2, ?3, 'normal', ?4, ?5, ?5)
         ON CONFLICT(employee_id, date) DO UPDATE SET 
         check_in_time = excluded.check_in_time,
         location = excluded.location,
         updated_at = excluded.updated_at",
        params![employee_id, date, check_in_time, location, check_in_time],
    )?;
    
    get_attendance_record_by_date(conn, employee_id, &date)
}

pub fn check_out(conn: &Connection, employee_id: i64, location: Option<String>) -> Result<AttendanceRecord> {
    let now = Utc::now();
    let date = now.format("%Y-%m-%d").to_string();
    let check_out_time = now.to_rfc3339();
    
    conn.execute(
        "UPDATE attendance_records SET 
         check_out_time = ?1,
         location = COALESCE(?2, location),
         updated_at = ?3
         WHERE employee_id = ?4 AND date = ?5",
        params![check_out_time, location, check_out_time, employee_id, date],
    )?;
    
    get_attendance_record_by_date(conn, employee_id, &date)
}

fn get_attendance_record_by_date(conn: &Connection, employee_id: i64, date: &str) -> Result<AttendanceRecord> {
    let mut stmt = conn.prepare("SELECT * FROM attendance_records WHERE employee_id = ?1 AND date = ?2")?;
    let mut rows = stmt.query(params![employee_id, date])?;
    
    if let Some(row) = rows.next()? {
        Ok(AttendanceRecord {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            date: row.get(2)?,
            check_in_time: row.get(3)?,
            check_out_time: row.get(4)?,
            work_hours: row.get(5)?,
            overtime_hours: row.get(6)?,
            status: row.get(7)?,
            location: row.get(8)?,
            notes: row.get(9)?,
            created_at: row.get(10)?,
            updated_at: row.get(11)?,
        })
    } else {
        Err(rusqlite::Error::QueryReturnedNoRows)
    }
}

// ==================== Leave Commands ====================

pub fn get_leave_types(conn: &Connection) -> Result<Vec<LeaveType>> {
    let mut stmt = conn.prepare("SELECT * FROM leave_types ORDER BY sort_order")?;
    let rows = stmt.query_map(params![], |row| {
        Ok(LeaveType {
            id: row.get(0)?,
            name: row.get(1)?,
            code: row.get(2)?,
            days_per_year: row.get(3)?,
            paid: row.get(4)?,
            description: row.get(5)?,
            sort_order: row.get(6)?,
            created_at: row.get(7)?,
            updated_at: row.get(8)?,
        })
    })?;
    
    let mut leave_types = Vec::new();
    for row in rows {
        leave_types.push(row?);
    }
    
    Ok(leave_types)
}

pub fn get_leave_applications(conn: &Connection, employee_id: Option<i64>, status: Option<String>) -> Result<Vec<LeaveApplication>> {
    let mut sql = String::from("SELECT * FROM leave_applications WHERE 1=1");
    
    if let Some(emp_id) = employee_id {
        sql.push_str(&format!(" AND employee_id = {}", emp_id));
    }
    if let Some(stat) = status {
        sql.push_str(&format!(" AND status = '{}'", stat));
    }
    
    sql.push_str(" ORDER BY created_at DESC");
    
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params![], |row| {
        Ok(LeaveApplication {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            leave_type: row.get(2)?,
            start_date: row.get(3)?,
            end_date: row.get(4)?,
            days: row.get(5)?,
            reason: row.get(6)?,
            status: row.get(7)?,
            approver_id: row.get(8)?,
            approval_date: row.get(9)?,
            approval_notes: row.get(10)?,
            attachment_url: row.get(11)?,
            created_at: row.get(12)?,
            updated_at: row.get(13)?,
        })
    })?;
    
    let mut applications = Vec::new();
    for row in rows {
        applications.push(row?);
    }
    
    Ok(applications)
}

pub fn create_leave_application(conn: &Connection, input: LeaveCreateInput) -> Result<LeaveApplication> {
    let now = Utc::now().to_rfc3339();
    
    // Calculate days
    let start = chrono::NaiveDate::parse_from_str(&input.start_date, "%Y-%m-%d")
        .map_err(|e| rusqlite::Error::InvalidParameterName(e.to_string()))?;
    let end = chrono::NaiveDate::parse_from_str(&input.end_date, "%Y-%m-%d")
        .map_err(|e| rusqlite::Error::InvalidParameterName(e.to_string()))?;
    let days = (end - start).num_days() as f64 + 1.0;
    
    conn.execute(
        "INSERT INTO leave_applications (employee_id, leave_type, start_date, end_date, days, reason, status, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending', ?7, ?7)",
        params![input.employee_id, input.leave_type, input.start_date, input.end_date, days, input.reason, now],
    )?;
    
    let leave_id = conn.last_insert_rowid();
    
    let mut stmt = conn.prepare("SELECT * FROM leave_applications WHERE id = ?1")?;
    let mut rows = stmt.query(params![leave_id])?;
    
    if let Some(row) = rows.next()? {
        Ok(LeaveApplication {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            leave_type: row.get(2)?,
            start_date: row.get(3)?,
            end_date: row.get(4)?,
            days: row.get(5)?,
            reason: row.get(6)?,
            status: row.get(7)?,
            approver_id: row.get(8)?,
            approval_date: row.get(9)?,
            approval_notes: row.get(10)?,
            attachment_url: row.get(11)?,
            created_at: row.get(12)?,
            updated_at: row.get(13)?,
        })
    } else {
        Err(rusqlite::Error::QueryReturnedNoRows)
    }
}

pub fn approve_leave_application(conn: &Connection, input: LeaveApproveInput) -> Result<LeaveApplication> {
    let now = Utc::now().to_rfc3339();
    let status = if input.approved { "approved" } else { "rejected" };
    
    conn.execute(
        "UPDATE leave_applications SET 
         status = ?1,
         approver_id = (SELECT id FROM employees LIMIT 1),
         approval_date = ?2,
         approval_notes = ?3,
         updated_at = ?2
         WHERE id = ?4",
        params![status, now, input.approval_notes, input.leave_id],
    )?;
    
    let mut stmt = conn.prepare("SELECT * FROM leave_applications WHERE id = ?1")?;
    let mut rows = stmt.query(params![input.leave_id])?;
    
    if let Some(row) = rows.next()? {
        Ok(LeaveApplication {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            leave_type: row.get(2)?,
            start_date: row.get(3)?,
            end_date: row.get(4)?,
            days: row.get(5)?,
            reason: row.get(6)?,
            status: row.get(7)?,
            approver_id: row.get(8)?,
            approval_date: row.get(9)?,
            approval_notes: row.get(10)?,
            attachment_url: row.get(11)?,
            created_at: row.get(12)?,
            updated_at: row.get(13)?,
        })
    } else {
        Err(rusqlite::Error::QueryReturnedNoRows)
    }
}

// ==================== Salary Commands ====================

pub fn get_salary_records(conn: &Connection, employee_id: Option<i64>, year_month: Option<String>) -> Result<Vec<SalaryRecord>> {
    let mut sql = String::from("SELECT * FROM salary_records WHERE 1=1");
    
    if let Some(emp_id) = employee_id {
        sql.push_str(&format!(" AND employee_id = {}", emp_id));
    }
    if let Some(ym) = year_month {
        sql.push_str(&format!(" AND year_month = '{}'", ym));
    }
    
    sql.push_str(" ORDER BY year_month DESC, employee_id");
    
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params![], |row| {
        Ok(SalaryRecord {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            year_month: row.get(2)?,
            base_salary: row.get(3)?,
            performance_bonus: row.get(4)?,
            overtime_pay: row.get(5)?,
            allowance: row.get(6)?,
            deduction: row.get(7)?,
            social_security: row.get(8)?,
            housing_fund: row.get(9)?,
            tax: row.get(10)?,
            actual_salary: row.get(11)?,
            payment_date: row.get(12)?,
            payment_status: row.get(13)?,
            notes: row.get(14)?,
            created_at: row.get(15)?,
            updated_at: row.get(16)?,
        })
    })?;
    
    let mut records = Vec::new();
    for row in rows {
        records.push(row?);
    }
    
    Ok(records)
}

pub fn create_salary_record(conn: &Connection, input: SalaryCreateInput) -> Result<SalaryRecord> {
    let now = Utc::now().to_rfc3339();
    
    let performance_bonus = input.performance_bonus.unwrap_or(0.0);
    let overtime_pay = input.overtime_pay.unwrap_or(0.0);
    let allowance = input.allowance.unwrap_or(0.0);
    let deduction = input.deduction.unwrap_or(0.0);
    let social_security = input.social_security.unwrap_or(0.0);
    let housing_fund = input.housing_fund.unwrap_or(0.0);
    let tax = input.tax.unwrap_or(0.0);
    
    let actual_salary = input.base_salary + performance_bonus + overtime_pay + allowance 
        - deduction - social_security - housing_fund - tax;
    
    conn.execute(
        "INSERT INTO salary_records (employee_id, year_month, base_salary, performance_bonus, 
         overtime_pay, allowance, deduction, social_security, housing_fund, tax, actual_salary, 
         payment_status, notes, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, 'pending', ?12, ?13, ?13)
         ON CONFLICT(employee_id, year_month) DO UPDATE SET
         base_salary = excluded.base_salary,
         performance_bonus = excluded.performance_bonus,
         overtime_pay = excluded.overtime_pay,
         allowance = excluded.allowance,
         deduction = excluded.deduction,
         social_security = excluded.social_security,
         housing_fund = excluded.housing_fund,
         tax = excluded.tax,
         actual_salary = excluded.actual_salary,
         notes = excluded.notes,
         updated_at = excluded.updated_at",
        params![
            input.employee_id, input.year_month, input.base_salary, performance_bonus,
            overtime_pay, allowance, deduction, social_security, housing_fund, tax,
            actual_salary, input.notes, now
        ],
    )?;
    
    let salary_id = conn.last_insert_rowid();
    
    let mut stmt = conn.prepare("SELECT * FROM salary_records WHERE id = ?1")?;
    let mut rows = stmt.query(params![salary_id])?;
    
    if let Some(row) = rows.next()? {
        Ok(SalaryRecord {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            year_month: row.get(2)?,
            base_salary: row.get(3)?,
            performance_bonus: row.get(4)?,
            overtime_pay: row.get(5)?,
            allowance: row.get(6)?,
            deduction: row.get(7)?,
            social_security: row.get(8)?,
            housing_fund: row.get(9)?,
            tax: row.get(10)?,
            actual_salary: row.get(11)?,
            payment_date: row.get(12)?,
            payment_status: row.get(13)?,
            notes: row.get(14)?,
            created_at: row.get(15)?,
            updated_at: row.get(16)?,
        })
    } else {
        Err(rusqlite::Error::QueryReturnedNoRows)
    }
}

pub fn pay_salary(conn: &Connection, salary_id: i64) -> Result<SalaryRecord> {
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "UPDATE salary_records SET 
         payment_status = 'paid',
         payment_date = ?1,
         updated_at = ?1
         WHERE id = ?2",
        params![now, salary_id],
    )?;
    
    let mut stmt = conn.prepare("SELECT * FROM salary_records WHERE id = ?1")?;
    let mut rows = stmt.query(params![salary_id])?;
    
    if let Some(row) = rows.next()? {
        Ok(SalaryRecord {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            year_month: row.get(2)?,
            base_salary: row.get(3)?,
            performance_bonus: row.get(4)?,
            overtime_pay: row.get(5)?,
            allowance: row.get(6)?,
            deduction: row.get(7)?,
            social_security: row.get(8)?,
            housing_fund: row.get(9)?,
            tax: row.get(10)?,
            actual_salary: row.get(11)?,
            payment_date: row.get(12)?,
            payment_status: row.get(13)?,
            notes: row.get(14)?,
            created_at: row.get(15)?,
            updated_at: row.get(16)?,
        })
    } else {
        Err(rusqlite::Error::QueryReturnedNoRows)
    }
}

// ==================== Performance Commands ====================

pub fn get_performance_evaluations(conn: &Connection, employee_id: Option<i64>) -> Result<Vec<PerformanceEvaluation>> {
    let mut sql = String::from("SELECT * FROM performance_evaluations WHERE 1=1");
    
    if let Some(emp_id) = employee_id {
        sql.push_str(&format!(" AND employee_id = {}", emp_id));
    }
    
    sql.push_str(" ORDER BY evaluation_period DESC");
    
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params![], |row| {
        Ok(PerformanceEvaluation {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            evaluation_period: row.get(2)?,
            evaluator_id: row.get(3)?,
            self_score: row.get(4)?,
            manager_score: row.get(5)?,
            final_score: row.get(6)?,
            rating: row.get(7)?,
            strengths: row.get(8)?,
            weaknesses: row.get(9)?,
            goals: row.get(10)?,
            status: row.get(11)?,
            review_date: row.get(12)?,
            notes: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    })?;
    
    let mut evaluations = Vec::new();
    for row in rows {
        evaluations.push(row?);
    }
    
    Ok(evaluations)
}

pub fn create_performance_evaluation(conn: &Connection, input: EvaluationCreateInput) -> Result<PerformanceEvaluation> {
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO performance_evaluations (employee_id, evaluation_period, evaluator_id, 
         self_score, manager_score, strengths, weaknesses, goals, status, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'draft', ?9, ?9)",
        params![
            input.employee_id, input.evaluation_period, input.evaluator_id,
            input.self_score, input.manager_score, input.strengths, input.weaknesses, input.goals, now
        ],
    )?;
    
    let eval_id = conn.last_insert_rowid();
    
    let mut stmt = conn.prepare("SELECT * FROM performance_evaluations WHERE id = ?1")?;
    let mut rows = stmt.query(params![eval_id])?;
    
    if let Some(row) = rows.next()? {
        Ok(PerformanceEvaluation {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            evaluation_period: row.get(2)?,
            evaluator_id: row.get(3)?,
            self_score: row.get(4)?,
            manager_score: row.get(5)?,
            final_score: row.get(6)?,
            rating: row.get(7)?,
            strengths: row.get(8)?,
            weaknesses: row.get(9)?,
            goals: row.get(10)?,
            status: row.get(11)?,
            review_date: row.get(12)?,
            notes: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    } else {
        Err(rusqlite::Error::QueryReturnedNoRows)
    }
}

pub fn submit_evaluation(conn: &Connection, evaluation_id: i64, final_score: f64, rating: String) -> Result<PerformanceEvaluation> {
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "UPDATE performance_evaluations SET 
         final_score = ?1,
         rating = ?2,
         status = 'submitted',
         review_date = ?3,
         updated_at = ?3
         WHERE id = ?4",
        params![final_score, rating, now, evaluation_id],
    )?;
    
    let mut stmt = conn.prepare("SELECT * FROM performance_evaluations WHERE id = ?1")?;
    let mut rows = stmt.query(params![evaluation_id])?;
    
    if let Some(row) = rows.next()? {
        Ok(PerformanceEvaluation {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            evaluation_period: row.get(2)?,
            evaluator_id: row.get(3)?,
            self_score: row.get(4)?,
            manager_score: row.get(5)?,
            final_score: row.get(6)?,
            rating: row.get(7)?,
            strengths: row.get(8)?,
            weaknesses: row.get(9)?,
            goals: row.get(10)?,
            status: row.get(11)?,
            review_date: row.get(12)?,
            notes: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    } else {
        Err(rusqlite::Error::QueryReturnedNoRows)
    }
}

// ==================== Training Commands ====================

pub fn get_training_records(conn: &Connection, employee_id: Option<i64>) -> Result<Vec<TrainingRecord>> {
    let mut sql = String::from("SELECT * FROM training_records WHERE 1=1");
    
    if let Some(emp_id) = employee_id {
        sql.push_str(&format!(" AND employee_id = {}", emp_id));
    }
    
    sql.push_str(" ORDER BY created_at DESC");
    
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params![], |row| {
        Ok(TrainingRecord {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            training_name: row.get(2)?,
            training_type: row.get(3)?,
            start_date: row.get(4)?,
            end_date: row.get(5)?,
            hours: row.get(6)?,
            trainer: row.get(7)?,
            location: row.get(8)?,
            cost: row.get(9)?,
            status: row.get(10)?,
            certificate_url: row.get(11)?,
            score: row.get(12)?,
            notes: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    })?;
    
    let mut records = Vec::new();
    for row in rows {
        records.push(row?);
    }
    
    Ok(records)
}

pub fn create_training_record(conn: &Connection, input: TrainingCreateInput) -> Result<TrainingRecord> {
    let now = Utc::now().to_rfc3339();
    
    conn.execute(
        "INSERT INTO training_records (employee_id, training_name, training_type, start_date, 
         end_date, hours, trainer, location, cost, status, notes, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'completed', ?10, ?11, ?11)",
        params![
            input.employee_id, input.training_name, input.training_type,
            input.start_date, input.end_date, input.hours.unwrap_or(0.0),
            input.trainer, input.location, input.cost.unwrap_or(0.0),
            input.notes, now
        ],
    )?;
    
    let training_id = conn.last_insert_rowid();
    
    let mut stmt = conn.prepare("SELECT * FROM training_records WHERE id = ?1")?;
    let mut rows = stmt.query(params![training_id])?;
    
    if let Some(row) = rows.next()? {
        Ok(TrainingRecord {
            id: row.get(0)?,
            employee_id: row.get(1)?,
            training_name: row.get(2)?,
            training_type: row.get(3)?,
            start_date: row.get(4)?,
            end_date: row.get(5)?,
            hours: row.get(6)?,
            trainer: row.get(7)?,
            location: row.get(8)?,
            cost: row.get(9)?,
            status: row.get(10)?,
            certificate_url: row.get(11)?,
            score: row.get(12)?,
            notes: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    } else {
        Err(rusqlite::Error::QueryReturnedNoRows)
    }
}

// ==================== Statistics ====================

pub fn get_hr_statistics(conn: &Connection) -> Result<HRStatistics> {
    let total_employees: i64 = conn.query_row("SELECT COUNT(*) FROM employees", params![], |row| row.get(0))?;
    
    let active_employees: i64 = conn.query_row(
        "SELECT COUNT(*) FROM employees WHERE employment_status = 'active'", 
        params![], |row| row.get(0)
    )?;
    
    let current_month = Utc::now().format("%Y-%m").to_string();
    
    let new_hires_this_month: i64 = conn.query_row(
        "SELECT COUNT(*) FROM employees WHERE hire_date LIKE ?", 
        params![format!("{}%", current_month)], |row| row.get(0)
    )?;
    
    let terminations_this_month: i64 = conn.query_row(
        "SELECT COUNT(*) FROM employees WHERE termination_date LIKE ?", 
        params![format!("{}%", current_month)], |row| row.get(0)
    )?;
    
    let total_departments: i64 = conn.query_row("SELECT COUNT(*) FROM departments", params![], |row| row.get(0))?;
    
    let pending_leaves: i64 = conn.query_row(
        "SELECT COUNT(*) FROM leave_applications WHERE status = 'pending'", 
        params![], |row| row.get(0)
    )?;
    
    let total_payroll: f64 = conn.query_row(
        "SELECT COALESCE(SUM(actual_salary), 0) FROM salary_records WHERE year_month = ?", 
        params![current_month], |row| row.get(0)
    )?;
    
    Ok(HRStatistics {
        total_employees,
        active_employees,
        new_hires_this_month,
        terminations_this_month,
        total_departments,
        pending_leaves,
        total_payroll,
    })
}
