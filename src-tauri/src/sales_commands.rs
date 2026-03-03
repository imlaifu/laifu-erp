// 销售管理模块 Rust Commands
// 实现完整的 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

// ==================== 销售机会 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SalesOpportunity {
    pub id: i64,
    pub name: String,
    pub customer_id: Option<i64>,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub source: String,
    pub stage: String,
    pub priority: String,
    pub estimated_amount: f64,
    pub actual_amount: f64,
    pub win_probability: i64,
    pub expected_close_date: Option<String>,
    pub actual_close_date: Option<String>,
    pub lost_reason: Option<String>,
    pub owner_id: Option<i64>,
    pub description: Option<String>,
    pub next_follow_up: Option<String>,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesOpportunityCreateInput {
    pub name: String,
    pub customer_id: Option<i64>,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub source: Option<String>,
    pub stage: Option<String>,
    pub priority: Option<String>,
    pub estimated_amount: Option<f64>,
    pub win_probability: Option<i64>,
    pub expected_close_date: Option<String>,
    pub owner_id: Option<i64>,
    pub description: Option<String>,
    pub next_follow_up: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesOpportunityListParams {
    pub customer_id: Option<i64>,
    pub stage: Option<String>,
    pub priority: Option<String>,
    pub status: Option<String>,
    pub owner_id: Option<i64>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 跟进记录 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OpportunityFollowup {
    pub id: i64,
    pub opportunity_id: i64,
    pub followup_type: String,
    pub subject: Option<String>,
    pub content: Option<String>,
    pub outcome: Option<String>,
    pub followup_date: DateTime<Utc>,
    pub next_followup_date: Option<String>,
    pub created_by: Option<i64>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OpportunityFollowupCreateInput {
    pub opportunity_id: i64,
    pub followup_type: String,
    pub subject: Option<String>,
    pub content: Option<String>,
    pub outcome: Option<String>,
    pub next_followup_date: Option<String>,
}

// ==================== 报价单 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SalesQuotation {
    pub id: i64,
    pub quotation_number: String,
    pub opportunity_id: Option<i64>,
    pub customer_id: i64,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub valid_until: Option<String>,
    pub status: String,
    pub subtotal: f64,
    pub discount_rate: f64,
    pub discount_amount: f64,
    pub tax_rate: f64,
    pub tax_amount: f64,
    pub total_amount: f64,
    pub notes: Option<String>,
    pub terms_conditions: Option<String>,
    pub created_by: Option<i64>,
    pub approved_by: Option<i64>,
    pub approved_at: Option<DateTime<Utc>>,
    pub sent_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesQuotationCreateInput {
    pub opportunity_id: Option<i64>,
    pub customer_id: i64,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub contact_email: Option<String>,
    pub valid_until: Option<String>,
    pub status: Option<String>,
    pub discount_rate: Option<f64>,
    pub tax_rate: Option<f64>,
    pub notes: Option<String>,
    pub terms_conditions: Option<String>,
    pub items: Vec<QuotationItemInput>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QuotationItemInput {
    pub product_id: Option<i64>,
    pub product_name: String,
    pub product_sku: Option<String>,
    pub description: Option<String>,
    pub quantity: f64,
    pub unit: Option<String>,
    pub unit_price: f64,
    pub discount_rate: Option<f64>,
    pub sort_order: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct QuotationItem {
    pub id: i64,
    pub quotation_id: i64,
    pub product_id: Option<i64>,
    pub product_name: String,
    pub product_sku: Option<String>,
    pub description: Option<String>,
    pub quantity: f64,
    pub unit: String,
    pub unit_price: f64,
    pub discount_rate: f64,
    pub amount: f64,
    pub sort_order: i64,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesQuotationListParams {
    pub customer_id: Option<i64>,
    pub opportunity_id: Option<i64>,
    pub status: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 销售合同 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SalesContract {
    pub id: i64,
    pub contract_number: String,
    pub contract_name: String,
    pub opportunity_id: Option<i64>,
    pub quotation_id: Option<i64>,
    pub customer_id: i64,
    pub contract_type: String,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub auto_renew: bool,
    pub total_amount: f64,
    pub paid_amount: f64,
    pub remaining_amount: f64,
    pub currency: String,
    pub payment_terms: Option<String>,
    pub delivery_terms: Option<String>,
    pub status: String,
    pub signed_date: Option<String>,
    pub customer_signed_date: Option<String>,
    pub internal_signed_by: Option<i64>,
    pub notes: Option<String>,
    pub attachment_urls: Vec<String>,
    pub created_by: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesContractCreateInput {
    pub contract_name: String,
    pub opportunity_id: Option<i64>,
    pub quotation_id: Option<i64>,
    pub customer_id: i64,
    pub contract_type: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub auto_renew: Option<bool>,
    pub currency: Option<String>,
    pub payment_terms: Option<String>,
    pub delivery_terms: Option<String>,
    pub notes: Option<String>,
    pub attachment_urls: Option<Vec<String>>,
    pub items: Vec<ContractItemInput>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ContractItemInput {
    pub product_id: Option<i64>,
    pub product_name: String,
    pub product_sku: Option<String>,
    pub description: Option<String>,
    pub quantity: f64,
    pub unit: Option<String>,
    pub unit_price: f64,
    pub discount_rate: Option<f64>,
    pub delivery_date: Option<String>,
    pub sort_order: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ContractItem {
    pub id: i64,
    pub contract_id: i64,
    pub product_id: Option<i64>,
    pub product_name: String,
    pub product_sku: Option<String>,
    pub description: Option<String>,
    pub quantity: f64,
    pub unit: String,
    pub unit_price: f64,
    pub discount_rate: f64,
    pub amount: f64,
    pub delivery_date: Option<String>,
    pub sort_order: i64,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesContractListParams {
    pub customer_id: Option<i64>,
    pub contract_type: Option<String>,
    pub status: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 销售预测 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SalesForecast {
    pub id: i64,
    pub period_type: String,
    pub period_start: String,
    pub period_end: String,
    pub product_id: Option<i64>,
    pub category_id: Option<i64>,
    pub forecast_quantity: f64,
    pub forecast_amount: f64,
    pub actual_quantity: f64,
    pub actual_amount: f64,
    pub accuracy_rate: f64,
    pub method: String,
    pub confidence_level: f64,
    pub notes: Option<String>,
    pub created_by: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesForecastCreateInput {
    pub period_type: String,
    pub period_start: String,
    pub period_end: String,
    pub product_id: Option<i64>,
    pub category_id: Option<i64>,
    pub forecast_quantity: Option<f64>,
    pub forecast_amount: Option<f64>,
    pub method: Option<String>,
    pub confidence_level: Option<f64>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesForecastListParams {
    pub period_type: Option<String>,
    pub product_id: Option<i64>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 销售佣金 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SalesCommission {
    pub id: i64,
    pub sales_person_id: i64,
    pub opportunity_id: Option<i64>,
    pub contract_id: Option<i64>,
    pub order_id: Option<i64>,
    pub commission_type: String,
    pub commission_rate: f64,
    pub base_amount: f64,
    pub commission_amount: f64,
    pub status: String,
    pub calculation_date: Option<DateTime<Utc>>,
    pub payment_date: Option<DateTime<Utc>>,
    pub notes: Option<String>,
    pub approved_by: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesCommissionCreateInput {
    pub sales_person_id: i64,
    pub opportunity_id: Option<i64>,
    pub contract_id: Option<i64>,
    pub order_id: Option<i64>,
    pub commission_type: Option<String>,
    pub commission_rate: Option<f64>,
    pub base_amount: f64,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesCommissionListParams {
    pub sales_person_id: Option<i64>,
    pub status: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 销售业绩 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SalesPerformance {
    pub id: i64,
    pub sales_person_id: i64,
    pub period_type: String,
    pub period_start: String,
    pub period_end: String,
    pub target_amount: f64,
    pub actual_amount: f64,
    pub achievement_rate: f64,
    pub opportunities_count: i64,
    pub won_opportunities_count: i64,
    pub quotations_count: i64,
    pub contracts_count: i64,
    pub orders_count: i64,
    pub total_commission: f64,
    pub ranking: i64,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesPerformanceListParams {
    pub sales_person_id: Option<i64>,
    pub period_type: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 销售活动 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SalesActivity {
    pub id: i64,
    pub activity_type: String,
    pub subject: String,
    pub description: Option<String>,
    pub related_type: String,
    pub related_id: Option<i64>,
    pub participant_ids: Vec<i64>,
    pub scheduled_time: Option<String>,
    pub actual_time: Option<String>,
    pub duration_minutes: Option<i64>,
    pub location: Option<String>,
    pub outcome: Option<String>,
    pub status: String,
    pub created_by: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesActivityCreateInput {
    pub activity_type: String,
    pub subject: String,
    pub description: Option<String>,
    pub related_type: Option<String>,
    pub related_id: Option<i64>,
    pub participant_ids: Option<Vec<i64>>,
    pub scheduled_time: Option<String>,
    pub location: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SalesActivityListParams {
    pub activity_type: Option<String>,
    pub related_type: Option<String>,
    pub related_id: Option<i64>,
    pub status: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ==================== 销售机会 Commands ====================

#[tauri::command]
pub fn create_sales_opportunity(conn: Connection, input: SalesOpportunityCreateInput) -> Result<SalesOpportunity, String> {
    let now = Utc::now();
    let source = input.source.unwrap_or_else(|| "other".to_string());
    let stage = input.stage.unwrap_or_else(|| "lead".to_string());
    let priority = input.priority.unwrap_or_else(|| "medium".to_string());
    let status = "active".to_string();
    let estimated_amount = input.estimated_amount.unwrap_or(0.0);
    let win_probability = input.win_probability.unwrap_or(0);

    conn.execute(
        "INSERT INTO sales_opportunities (name, customer_id, contact_person, contact_phone, contact_email, source, stage, priority, estimated_amount, win_probability, expected_close_date, owner_id, description, next_follow_up, status, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)",
        params![
            input.name, input.customer_id, input.contact_person, input.contact_phone, input.contact_email,
            source, stage, priority, estimated_amount, win_probability, input.expected_close_date,
            input.owner_id, input.description, input.next_follow_up, status, now, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    get_sales_opportunity(conn, id)
}

#[tauri::command]
pub fn get_sales_opportunity(conn: Connection, id: i64) -> Result<SalesOpportunity, String> {
    let mut stmt = conn.prepare(
        "SELECT id, name, customer_id, contact_person, contact_phone, contact_email, source, stage, priority,
                estimated_amount, actual_amount, win_probability, expected_close_date, actual_close_date,
                lost_reason, owner_id, description, next_follow_up, status, created_at, updated_at
         FROM sales_opportunities WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(SalesOpportunity {
            id: row.get(0)?,
            name: row.get(1)?,
            customer_id: row.get(2)?,
            contact_person: row.get(3)?,
            contact_phone: row.get(4)?,
            contact_email: row.get(5)?,
            source: row.get(6)?,
            stage: row.get(7)?,
            priority: row.get(8)?,
            estimated_amount: row.get(9)?,
            actual_amount: row.get(10)?,
            win_probability: row.get(11)?,
            expected_close_date: row.get(12)?,
            actual_close_date: row.get(13)?,
            lost_reason: row.get(14)?,
            owner_id: row.get(15)?,
            description: row.get(16)?,
            next_follow_up: row.get(17)?,
            status: row.get(18)?,
            created_at: row.get(19)?,
            updated_at: row.get(20)?,
        })
    } else {
        Err("Sales opportunity not found".to_string())
    }
}

#[tauri::command]
pub fn list_sales_opportunities(conn: Connection, params: SalesOpportunityListParams) -> Result<Vec<SalesOpportunity>, String> {
    let mut sql = String::from(
        "SELECT id, name, customer_id, contact_person, contact_phone, contact_email, source, stage, priority,
                estimated_amount, actual_amount, win_probability, expected_close_date, actual_close_date,
                lost_reason, owner_id, description, next_follow_up, status, created_at, updated_at
         FROM sales_opportunities WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(customer_id) = params.customer_id {
        sql.push_str(" AND customer_id = ?");
        args.push(("customer_id", &customer_id));
    }
    if let Some(stage) = params.stage {
        sql.push_str(" AND stage = ?");
        args.push(("stage", &stage));
    }
    if let Some(priority) = params.priority {
        sql.push_str(" AND priority = ?");
        args.push(("priority", &priority));
    }
    if let Some(status) = params.status {
        sql.push_str(" AND status = ?");
        args.push(("status", &status));
    }
    if let Some(owner_id) = params.owner_id {
        sql.push_str(" AND owner_id = ?");
        args.push(("owner_id", &owner_id));
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
        Ok(SalesOpportunity {
            id: row.get(0)?,
            name: row.get(1)?,
            customer_id: row.get(2)?,
            contact_person: row.get(3)?,
            contact_phone: row.get(4)?,
            contact_email: row.get(5)?,
            source: row.get(6)?,
            stage: row.get(7)?,
            priority: row.get(8)?,
            estimated_amount: row.get(9)?,
            actual_amount: row.get(10)?,
            win_probability: row.get(11)?,
            expected_close_date: row.get(12)?,
            actual_close_date: row.get(13)?,
            lost_reason: row.get(14)?,
            owner_id: row.get(15)?,
            description: row.get(16)?,
            next_follow_up: row.get(17)?,
            status: row.get(18)?,
            created_at: row.get(19)?,
            updated_at: row.get(20)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_sales_opportunity(conn: Connection, id: i64, input: SalesOpportunityCreateInput) -> Result<SalesOpportunity, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE sales_opportunities SET name = ?1, customer_id = ?2, contact_person = ?3, contact_phone = ?4,
                contact_email = ?5, source = ?6, stage = ?7, priority = ?8, estimated_amount = ?9,
                win_probability = ?10, expected_close_date = ?11, owner_id = ?12, description = ?13,
                next_follow_up = ?14, updated_at = ?15 WHERE id = ?16",
        params![
            input.name, input.customer_id, input.contact_person, input.contact_phone, input.contact_email,
            input.source.unwrap_or_else(|| "other".to_string()),
            input.stage.unwrap_or_else(|| "lead".to_string()),
            input.priority.unwrap_or_else(|| "medium".to_string()),
            input.estimated_amount.unwrap_or(0.0),
            input.win_probability.unwrap_or(0),
            input.expected_close_date, input.owner_id, input.description, input.next_follow_up, now, id
        ],
    ).map_err(|e| e.to_string())?;

    get_sales_opportunity(conn, id)
}

#[tauri::command]
pub fn delete_sales_opportunity(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM sales_opportunities WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
pub fn update_opportunity_stage(conn: Connection, id: i64, stage: String) -> Result<SalesOpportunity, String> {
    let now = Utc::now();
    
    let actual_close_date = if stage == "closed_won" || stage == "closed_lost" {
        Some(now.to_rfc3339())
    } else {
        None
    };

    conn.execute(
        "UPDATE sales_opportunities SET stage = ?1, actual_close_date = ?2, updated_at = ?3 WHERE id = ?4",
        params![stage, actual_close_date, now, id],
    ).map_err(|e| e.to_string())?;

    get_sales_opportunity(conn, id)
}

// ==================== 跟进记录 Commands ====================

#[tauri::command]
pub fn create_opportunity_followup(conn: Connection, input: OpportunityFollowupCreateInput) -> Result<OpportunityFollowup, String> {
    let now = Utc::now();

    conn.execute(
        "INSERT INTO opportunity_followups (opportunity_id, followup_type, subject, content, outcome, followup_date, next_followup_date, created_by, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            input.opportunity_id, input.followup_type, input.subject, input.content, input.outcome,
            now, input.next_followup_date, input.opportunity_id, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_opportunity_followup(conn, id)
}

#[tauri::command]
pub fn get_opportunity_followup(conn: Connection, id: i64) -> Result<OpportunityFollowup, String> {
    let mut stmt = conn.prepare(
        "SELECT id, opportunity_id, followup_type, subject, content, outcome, followup_date, next_followup_date, created_by, created_at
         FROM opportunity_followups WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(OpportunityFollowup {
            id: row.get(0)?,
            opportunity_id: row.get(1)?,
            followup_type: row.get(2)?,
            subject: row.get(3)?,
            content: row.get(4)?,
            outcome: row.get(5)?,
            followup_date: row.get(6)?,
            next_followup_date: row.get(7)?,
            created_by: row.get(8)?,
            created_at: row.get(9)?,
        })
    } else {
        Err("Followup not found".to_string())
    }
}

#[tauri::command]
pub fn list_opportunity_followups(conn: Connection, opportunity_id: i64) -> Result<Vec<OpportunityFollowup>, String> {
    let mut stmt = conn.prepare(
        "SELECT id, opportunity_id, followup_type, subject, content, outcome, followup_date, next_followup_date, created_by, created_at
         FROM opportunity_followups WHERE opportunity_id = ?1 ORDER BY followup_date DESC"
    ).map_err(|e| e.to_string())?;

    let rows = stmt.query_map(params![opportunity_id], |row| {
        Ok(OpportunityFollowup {
            id: row.get(0)?,
            opportunity_id: row.get(1)?,
            followup_type: row.get(2)?,
            subject: row.get(3)?,
            content: row.get(4)?,
            outcome: row.get(5)?,
            followup_date: row.get(6)?,
            next_followup_date: row.get(7)?,
            created_by: row.get(8)?,
            created_at: row.get(9)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

// ==================== 报价单 Commands ====================

#[tauri::command]
pub fn create_sales_quotation(conn: Connection, input: SalesQuotationCreateInput) -> Result<SalesQuotation, String> {
    let now = Utc::now();
    let quotation_number = format!("QT-{}-{:03}", now.year(), conn.last_insert_rowid() + 1);
    let status = input.status.unwrap_or_else(|| "draft".to_string());
    let discount_rate = input.discount_rate.unwrap_or(0.0);
    let tax_rate = input.tax_rate.unwrap_or(0.0);

    let mut subtotal = 0.0;
    let mut discount_amount = 0.0;
    let mut tax_amount = 0.0;

    for item in &input.items {
        let item_amount = item.quantity * item.unit_price;
        let item_discount = item_amount * (item.discount_rate.unwrap_or(0.0) / 100.0);
        subtotal += item_amount;
        discount_amount += item_discount;
    }

    let after_discount = subtotal - discount_amount;
    tax_amount = after_discount * (tax_rate / 100.0);
    let total_amount = after_discount + tax_amount;

    conn.execute(
        "INSERT INTO sales_quotations (quotation_number, opportunity_id, customer_id, contact_person, contact_phone, contact_email, valid_until, status, subtotal, discount_rate, discount_amount, tax_rate, tax_amount, total_amount, notes, terms_conditions, created_by, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19)",
        params![
            quotation_number, input.opportunity_id, input.customer_id, input.contact_person,
            input.contact_phone, input.contact_email, input.valid_until, status, subtotal,
            discount_rate, discount_amount, tax_rate, tax_amount, total_amount,
            input.notes, input.terms_conditions, input.opportunity_id, now, now
        ],
    ).map_err(|e| e.to_string())?;

    let quotation_id = conn.last_insert_rowid();

    for (idx, item) in input.items.iter().enumerate() {
        let item_amount = item.quantity * item.unit_price;
        let item_discount = item_amount * (item.discount_rate.unwrap_or(0.0) / 100.0);
        let final_amount = item_amount - item_discount;

        conn.execute(
            "INSERT INTO quotation_items (quotation_id, product_id, product_name, product_sku, description, quantity, unit, unit_price, discount_rate, amount, sort_order, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![
                quotation_id, item.product_id, item.product_name, item.product_sku,
                item.description, item.quantity, item.unit.clone().unwrap_or_else(|| "件".to_string()),
                item.unit_price, item.discount_rate.unwrap_or(0.0), final_amount,
                item.sort_order.unwrap_or(idx as i64), now
            ],
        ).map_err(|e| e.to_string())?;
    }

    get_sales_quotation(conn, quotation_id)
}

#[tauri::command]
pub fn get_sales_quotation(conn: Connection, id: i64) -> Result<SalesQuotation, String> {
    let mut stmt = conn.prepare(
        "SELECT id, quotation_number, opportunity_id, customer_id, contact_person, contact_phone, contact_email,
                valid_until, status, subtotal, discount_rate, discount_amount, tax_rate, tax_amount, total_amount,
                notes, terms_conditions, created_by, approved_by, approved_at, sent_at, created_at, updated_at
         FROM sales_quotations WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(SalesQuotation {
            id: row.get(0)?,
            quotation_number: row.get(1)?,
            opportunity_id: row.get(2)?,
            customer_id: row.get(3)?,
            contact_person: row.get(4)?,
            contact_phone: row.get(5)?,
            contact_email: row.get(6)?,
            valid_until: row.get(7)?,
            status: row.get(8)?,
            subtotal: row.get(9)?,
            discount_rate: row.get(10)?,
            discount_amount: row.get(11)?,
            tax_rate: row.get(12)?,
            tax_amount: row.get(13)?,
            total_amount: row.get(14)?,
            notes: row.get(15)?,
            terms_conditions: row.get(16)?,
            created_by: row.get(17)?,
            approved_by: row.get(18)?,
            approved_at: row.get(19)?,
            sent_at: row.get(20)?,
            created_at: row.get(21)?,
            updated_at: row.get(22)?,
        })
    } else {
        Err("Quotation not found".to_string())
    }
}

#[tauri::command]
pub fn list_sales_quotations(conn: Connection, params: SalesQuotationListParams) -> Result<Vec<SalesQuotation>, String> {
    let mut sql = String::from(
        "SELECT id, quotation_number, opportunity_id, customer_id, contact_person, contact_phone, contact_email,
                valid_until, status, subtotal, discount_rate, discount_amount, tax_rate, tax_amount, total_amount,
                notes, terms_conditions, created_by, approved_by, approved_at, sent_at, created_at, updated_at
         FROM sales_quotations WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(customer_id) = params.customer_id {
        sql.push_str(" AND customer_id = ?");
        args.push(("customer_id", &customer_id));
    }
    if let Some(opportunity_id) = params.opportunity_id {
        sql.push_str(" AND opportunity_id = ?");
        args.push(("opportunity_id", &opportunity_id));
    }
    if let Some(status) = params.status {
        sql.push_str(" AND status = ?");
        args.push(("status", &status));
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
        Ok(SalesQuotation {
            id: row.get(0)?,
            quotation_number: row.get(1)?,
            opportunity_id: row.get(2)?,
            customer_id: row.get(3)?,
            contact_person: row.get(4)?,
            contact_phone: row.get(5)?,
            contact_email: row.get(6)?,
            valid_until: row.get(7)?,
            status: row.get(8)?,
            subtotal: row.get(9)?,
            discount_rate: row.get(10)?,
            discount_amount: row.get(11)?,
            tax_rate: row.get(12)?,
            tax_amount: row.get(13)?,
            total_amount: row.get(14)?,
            notes: row.get(15)?,
            terms_conditions: row.get(16)?,
            created_by: row.get(17)?,
            approved_by: row.get(18)?,
            approved_at: row.get(19)?,
            sent_at: row.get(20)?,
            created_at: row.get(21)?,
            updated_at: row.get(22)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_quotation_items(conn: Connection, quotation_id: i64) -> Result<Vec<QuotationItem>, String> {
    let mut stmt = conn.prepare(
        "SELECT id, quotation_id, product_id, product_name, product_sku, description, quantity, unit, unit_price, discount_rate, amount, sort_order, created_at
         FROM quotation_items WHERE quotation_id = ?1 ORDER BY sort_order"
    ).map_err(|e| e.to_string())?;

    let rows = stmt.query_map(params![quotation_id], |row| {
        Ok(QuotationItem {
            id: row.get(0)?,
            quotation_id: row.get(1)?,
            product_id: row.get(2)?,
            product_name: row.get(3)?,
            product_sku: row.get(4)?,
            description: row.get(5)?,
            quantity: row.get(6)?,
            unit: row.get(7)?,
            unit_price: row.get(8)?,
            discount_rate: row.get(9)?,
            amount: row.get(10)?,
            sort_order: row.get(11)?,
            created_at: row.get(12)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_quotation_status(conn: Connection, id: i64, status: String) -> Result<SalesQuotation, String> {
    let now = Utc::now();
    let sent_at = if status == "sent" { Some(now) } else { None };

    conn.execute(
        "UPDATE sales_quotations SET status = ?1, sent_at = COALESCE(?2, sent_at), updated_at = ?3 WHERE id = ?4",
        params![status, sent_at, now, id],
    ).map_err(|e| e.to_string())?;

    get_sales_quotation(conn, id)
}

#[tauri::command]
pub fn delete_sales_quotation(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM sales_quotations WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

// ==================== 销售合同 Commands ====================

#[tauri::command]
pub fn create_sales_contract(conn: Connection, input: SalesContractCreateInput) -> Result<SalesContract, String> {
    let now = Utc::now();
    let contract_number = format!("CT-{}-{:03}", now.year(), conn.last_insert_rowid() + 1);
    let contract_type = input.contract_type.unwrap_or_else(|| "sales".to_string());
    let currency = input.currency.unwrap_or_else(|| "CNY".to_string());
    let status = "draft".to_string();
    let auto_renew = input.auto_renew.unwrap_or(false);

    let mut total_amount = 0.0;

    for item in &input.items {
        let item_amount = item.quantity * item.unit_price;
        let item_discount = item_amount * (item.discount_rate.unwrap_or(0.0) / 100.0);
        total_amount += item_amount - item_discount;
    }

    conn.execute(
        "INSERT INTO sales_contracts (contract_number, contract_name, opportunity_id, quotation_id, customer_id, contract_type, start_date, end_date, auto_renew, total_amount, currency, payment_terms, delivery_terms, status, notes, attachment_urls, created_by, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19)",
        params![
            contract_number, input.contract_name, input.opportunity_id, input.quotation_id,
            input.customer_id, contract_type, input.start_date, input.end_date, auto_renew as i64,
            total_amount, currency, input.payment_terms, input.delivery_terms, status,
            input.notes, input.attachment_urls.map(|urls| serde_json::to_string(&urls).unwrap_or_default()).unwrap_or_default(),
            input.customer_id, now, now
        ],
    ).map_err(|e| e.to_string())?;

    let contract_id = conn.last_insert_rowid();

    for (idx, item) in input.items.iter().enumerate() {
        let item_amount = item.quantity * item.unit_price;
        let item_discount = item_amount * (item.discount_rate.unwrap_or(0.0) / 100.0);
        let final_amount = item_amount - item_discount;

        conn.execute(
            "INSERT INTO contract_items (contract_id, product_id, product_name, product_sku, description, quantity, unit, unit_price, discount_rate, amount, delivery_date, sort_order, created_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
            params![
                contract_id, item.product_id, item.product_name, item.product_sku,
                item.description, item.quantity, item.unit.clone().unwrap_or_else(|| "件".to_string()),
                item.unit_price, item.discount_rate.unwrap_or(0.0), final_amount,
                item.delivery_date, item.sort_order.unwrap_or(idx as i64), now
            ],
        ).map_err(|e| e.to_string())?;
    }

    get_sales_contract(conn, contract_id)
}

#[tauri::command]
pub fn get_sales_contract(conn: Connection, id: i64) -> Result<SalesContract, String> {
    let mut stmt = conn.prepare(
        "SELECT id, contract_number, contract_name, opportunity_id, quotation_id, customer_id, contract_type,
                start_date, end_date, auto_renew, total_amount, paid_amount, remaining_amount, currency,
                payment_terms, delivery_terms, status, signed_date, customer_signed_date, internal_signed_by,
                notes, attachment_urls, created_by, created_at, updated_at
         FROM sales_contracts WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        let attachment_urls_str: String = row.get(21)?;
        let attachment_urls: Vec<String> = serde_json::from_str(&attachment_urls_str).unwrap_or_default();

        Ok(SalesContract {
            id: row.get(0)?,
            contract_number: row.get(1)?,
            contract_name: row.get(2)?,
            opportunity_id: row.get(3)?,
            quotation_id: row.get(4)?,
            customer_id: row.get(5)?,
            contract_type: row.get(6)?,
            start_date: row.get(7)?,
            end_date: row.get(8)?,
            auto_renew: row.get::<_, i64>(9)? == 1,
            total_amount: row.get(10)?,
            paid_amount: row.get(11)?,
            remaining_amount: row.get(12)?,
            currency: row.get(13)?,
            payment_terms: row.get(14)?,
            delivery_terms: row.get(15)?,
            status: row.get(16)?,
            signed_date: row.get(17)?,
            customer_signed_date: row.get(18)?,
            internal_signed_by: row.get(19)?,
            notes: row.get(20)?,
            attachment_urls,
            created_by: row.get(22)?,
            created_at: row.get(23)?,
            updated_at: row.get(24)?,
        })
    } else {
        Err("Contract not found".to_string())
    }
}

#[tauri::command]
pub fn list_sales_contracts(conn: Connection, params: SalesContractListParams) -> Result<Vec<SalesContract>, String> {
    let mut sql = String::from(
        "SELECT id, contract_number, contract_name, opportunity_id, quotation_id, customer_id, contract_type,
                start_date, end_date, auto_renew, total_amount, paid_amount, remaining_amount, currency,
                payment_terms, delivery_terms, status, signed_date, customer_signed_date, internal_signed_by,
                notes, attachment_urls, created_by, created_at, updated_at
         FROM sales_contracts WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(customer_id) = params.customer_id {
        sql.push_str(" AND customer_id = ?");
        args.push(("customer_id", &customer_id));
    }
    if let Some(contract_type) = params.contract_type {
        sql.push_str(" AND contract_type = ?");
        args.push(("contract_type", &contract_type));
    }
    if let Some(status) = params.status {
        sql.push_str(" AND status = ?");
        args.push(("status", &status));
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
        let attachment_urls_str: String = row.get(21).unwrap_or_default();
        let attachment_urls: Vec<String> = serde_json::from_str(&attachment_urls_str).unwrap_or_default();

        Ok(SalesContract {
            id: row.get(0)?,
            contract_number: row.get(1)?,
            contract_name: row.get(2)?,
            opportunity_id: row.get(3)?,
            quotation_id: row.get(4)?,
            customer_id: row.get(5)?,
            contract_type: row.get(6)?,
            start_date: row.get(7)?,
            end_date: row.get(8)?,
            auto_renew: row.get::<_, i64>(9)? == 1,
            total_amount: row.get(10)?,
            paid_amount: row.get(11)?,
            remaining_amount: row.get(12)?,
            currency: row.get(13)?,
            payment_terms: row.get(14)?,
            delivery_terms: row.get(15)?,
            status: row.get(16)?,
            signed_date: row.get(17)?,
            customer_signed_date: row.get(18)?,
            internal_signed_by: row.get(19)?,
            notes: row.get(20)?,
            attachment_urls,
            created_by: row.get(22)?,
            created_at: row.get(23)?,
            updated_at: row.get(24)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_contract_items(conn: Connection, contract_id: i64) -> Result<Vec<ContractItem>, String> {
    let mut stmt = conn.prepare(
        "SELECT id, contract_id, product_id, product_name, product_sku, description, quantity, unit, unit_price, discount_rate, amount, delivery_date, sort_order, created_at
         FROM contract_items WHERE contract_id = ?1 ORDER BY sort_order"
    ).map_err(|e| e.to_string())?;

    let rows = stmt.query_map(params![contract_id], |row| {
        Ok(ContractItem {
            id: row.get(0)?,
            contract_id: row.get(1)?,
            product_id: row.get(2)?,
            product_name: row.get(3)?,
            product_sku: row.get(4)?,
            description: row.get(5)?,
            quantity: row.get(6)?,
            unit: row.get(7)?,
            unit_price: row.get(8)?,
            discount_rate: row.get(9)?,
            amount: row.get(10)?,
            delivery_date: row.get(11)?,
            sort_order: row.get(12)?,
            created_at: row.get(13)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_contract_status(conn: Connection, id: i64, status: String) -> Result<SalesContract, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE sales_contracts SET status = ?1, updated_at = ?2 WHERE id = ?3",
        params![status, now, id],
    ).map_err(|e| e.to_string())?;

    get_sales_contract(conn, id)
}

#[tauri::command]
pub fn update_contract_payment(conn: Connection, id: i64, paid_amount: f64) -> Result<SalesContract, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE sales_contracts SET paid_amount = ?1, updated_at = ?2 WHERE id = ?3",
        params![paid_amount, now, id],
    ).map_err(|e| e.to_string())?;

    get_sales_contract(conn, id)
}

#[tauri::command]
pub fn delete_sales_contract(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM sales_contracts WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

// ==================== 销售预测 Commands ====================

#[tauri::command]
pub fn create_sales_forecast(conn: Connection, input: SalesForecastCreateInput) -> Result<SalesForecast, String> {
    let now = Utc::now();
    let method = input.method.unwrap_or_else(|| "manual".to_string());
    let forecast_quantity = input.forecast_quantity.unwrap_or(0.0);
    let forecast_amount = input.forecast_amount.unwrap_or(0.0);
    let confidence_level = input.confidence_level.unwrap_or(0.0);

    conn.execute(
        "INSERT INTO sales_forecasts (period_type, period_start, period_end, product_id, category_id, forecast_quantity, forecast_amount, method, confidence_level, notes, created_by, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        params![
            input.period_type, input.period_start, input.period_end, input.product_id,
            input.category_id, forecast_quantity, forecast_amount, method, confidence_level,
            input.notes, input.product_id, now, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_sales_forecast(conn, id)
}

#[tauri::command]
pub fn get_sales_forecast(conn: Connection, id: i64) -> Result<SalesForecast, String> {
    let mut stmt = conn.prepare(
        "SELECT id, period_type, period_start, period_end, product_id, category_id, forecast_quantity, forecast_amount,
                actual_quantity, actual_amount, accuracy_rate, method, confidence_level, notes, created_by, created_at, updated_at
         FROM sales_forecasts WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(SalesForecast {
            id: row.get(0)?,
            period_type: row.get(1)?,
            period_start: row.get(2)?,
            period_end: row.get(3)?,
            product_id: row.get(4)?,
            category_id: row.get(5)?,
            forecast_quantity: row.get(6)?,
            forecast_amount: row.get(7)?,
            actual_quantity: row.get(8)?,
            actual_amount: row.get(9)?,
            accuracy_rate: row.get(10)?,
            method: row.get(11)?,
            confidence_level: row.get(12)?,
            notes: row.get(13)?,
            created_by: row.get(14)?,
            created_at: row.get(15)?,
            updated_at: row.get(16)?,
        })
    } else {
        Err("Forecast not found".to_string())
    }
}

#[tauri::command]
pub fn list_sales_forecasts(conn: Connection, params: SalesForecastListParams) -> Result<Vec<SalesForecast>, String> {
    let mut sql = String::from(
        "SELECT id, period_type, period_start, period_end, product_id, category_id, forecast_quantity, forecast_amount,
                actual_quantity, actual_amount, accuracy_rate, method, confidence_level, notes, created_by, created_at, updated_at
         FROM sales_forecasts WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(period_type) = params.period_type {
        sql.push_str(" AND period_type = ?");
        args.push(("period_type", &period_type));
    }
    if let Some(product_id) = params.product_id {
        sql.push_str(" AND product_id = ?");
        args.push(("product_id", &product_id));
    }

    sql.push_str(" ORDER BY period_start DESC");

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    if let Some(offset) = params.offset {
        sql.push_str(&format!(" OFFSET {}", offset));
    }

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(rusqlite::params_from_iter(args.iter().map(|(_, v)| *v)), |row| {
        Ok(SalesForecast {
            id: row.get(0)?,
            period_type: row.get(1)?,
            period_start: row.get(2)?,
            period_end: row.get(3)?,
            product_id: row.get(4)?,
            category_id: row.get(5)?,
            forecast_quantity: row.get(6)?,
            forecast_amount: row.get(7)?,
            actual_quantity: row.get(8)?,
            actual_amount: row.get(9)?,
            accuracy_rate: row.get(10)?,
            method: row.get(11)?,
            confidence_level: row.get(12)?,
            notes: row.get(13)?,
            created_by: row.get(14)?,
            created_at: row.get(15)?,
            updated_at: row.get(16)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_sales_forecast_actuals(conn: Connection, id: i64, actual_quantity: f64, actual_amount: f64) -> Result<SalesForecast, String> {
    let now = Utc::now();
    let mut stmt = conn.prepare("SELECT forecast_quantity, forecast_amount FROM sales_forecasts WHERE id = ?1").map_err(|e| e.to_string())?;
    let (forecast_qty, forecast_amt): (f64, f64) = stmt.query_row(params![id], |row| {
        Ok((row.get(0)?, row.get(1)?))
    }).map_err(|e| e.to_string())?;

    let accuracy_rate = if forecast_amt > 0.0 {
        1.0 - ((actual_amount - forecast_amt).abs() / forecast_amt)
    } else {
        0.0
    };

    conn.execute(
        "UPDATE sales_forecasts SET actual_quantity = ?1, actual_amount = ?2, accuracy_rate = ?3, updated_at = ?4 WHERE id = ?5",
        params![actual_quantity, actual_amount, accuracy_rate, now, id],
    ).map_err(|e| e.to_string())?;

    get_sales_forecast(conn, id)
}

#[tauri::command]
pub fn delete_sales_forecast(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM sales_forecasts WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

// ==================== 销售佣金 Commands ====================

#[tauri::command]
pub fn create_sales_commission(conn: Connection, input: SalesCommissionCreateInput) -> Result<SalesCommission, String> {
    let now = Utc::now();
    let commission_type = input.commission_type.unwrap_or_else(|| "percentage".to_string());
    let commission_rate = input.commission_rate.unwrap_or(0.0);
    let commission_amount = input.base_amount * (commission_rate / 100.0);
    let status = "pending".to_string();

    conn.execute(
        "INSERT INTO sales_commissions (sales_person_id, opportunity_id, contract_id, order_id, commission_type, commission_rate, base_amount, commission_amount, status, notes, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        params![
            input.sales_person_id, input.opportunity_id, input.contract_id, input.order_id,
            commission_type, commission_rate, input.base_amount, commission_amount, status,
            input.notes, now, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_sales_commission(conn, id)
}

#[tauri::command]
pub fn get_sales_commission(conn: Connection, id: i64) -> Result<SalesCommission, String> {
    let mut stmt = conn.prepare(
        "SELECT id, sales_person_id, opportunity_id, contract_id, order_id, commission_type, commission_rate,
                base_amount, commission_amount, status, calculation_date, payment_date, notes, approved_by, created_at, updated_at
         FROM sales_commissions WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(SalesCommission {
            id: row.get(0)?,
            sales_person_id: row.get(1)?,
            opportunity_id: row.get(2)?,
            contract_id: row.get(3)?,
            order_id: row.get(4)?,
            commission_type: row.get(5)?,
            commission_rate: row.get(6)?,
            base_amount: row.get(7)?,
            commission_amount: row.get(8)?,
            status: row.get(9)?,
            calculation_date: row.get(10)?,
            payment_date: row.get(11)?,
            notes: row.get(12)?,
            approved_by: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    } else {
        Err("Commission not found".to_string())
    }
}

#[tauri::command]
pub fn list_sales_commissions(conn: Connection, params: SalesCommissionListParams) -> Result<Vec<SalesCommission>, String> {
    let mut sql = String::from(
        "SELECT id, sales_person_id, opportunity_id, contract_id, order_id, commission_type, commission_rate,
                base_amount, commission_amount, status, calculation_date, payment_date, notes, approved_by, created_at, updated_at
         FROM sales_commissions WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(sales_person_id) = params.sales_person_id {
        sql.push_str(" AND sales_person_id = ?");
        args.push(("sales_person_id", &sales_person_id));
    }
    if let Some(status) = params.status {
        sql.push_str(" AND status = ?");
        args.push(("status", &status));
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
        Ok(SalesCommission {
            id: row.get(0)?,
            sales_person_id: row.get(1)?,
            opportunity_id: row.get(2)?,
            contract_id: row.get(3)?,
            order_id: row.get(4)?,
            commission_type: row.get(5)?,
            commission_rate: row.get(6)?,
            base_amount: row.get(7)?,
            commission_amount: row.get(8)?,
            status: row.get(9)?,
            calculation_date: row.get(10)?,
            payment_date: row.get(11)?,
            notes: row.get(12)?,
            approved_by: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn approve_sales_commission(conn: Connection, id: i64, approved_by: i64) -> Result<SalesCommission, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE sales_commissions SET status = 'approved', approved_by = ?1, calculation_date = ?2, updated_at = ?3 WHERE id = ?4",
        params![approved_by, now, now, id],
    ).map_err(|e| e.to_string())?;

    get_sales_commission(conn, id)
}

#[tauri::command]
pub fn pay_sales_commission(conn: Connection, id: i64) -> Result<SalesCommission, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE sales_commissions SET status = 'paid', payment_date = ?1, updated_at = ?2 WHERE id = ?3",
        params![now, now, id],
    ).map_err(|e| e.to_string())?;

    get_sales_commission(conn, id)
}

#[tauri::command]
pub fn delete_sales_commission(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM sales_commissions WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}

// ==================== 销售业绩 Commands ====================

#[tauri::command]
pub fn list_sales_performance(conn: Connection, params: SalesPerformanceListParams) -> Result<Vec<SalesPerformance>, String> {
    let mut sql = String::from(
        "SELECT id, sales_person_id, period_type, period_start, period_end, target_amount, actual_amount,
                achievement_rate, opportunities_count, won_opportunities_count, quotations_count, contracts_count,
                orders_count, total_commission, ranking, notes, created_at, updated_at
         FROM sales_performance WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(sales_person_id) = params.sales_person_id {
        sql.push_str(" AND sales_person_id = ?");
        args.push(("sales_person_id", &sales_person_id));
    }
    if let Some(period_type) = params.period_type {
        sql.push_str(" AND period_type = ?");
        args.push(("period_type", &period_type));
    }

    sql.push_str(" ORDER BY period_start DESC, ranking ASC");

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    if let Some(offset) = params.offset {
        sql.push_str(&format!(" OFFSET {}", offset));
    }

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(rusqlite::params_from_iter(args.iter().map(|(_, v)| *v)), |row| {
        Ok(SalesPerformance {
            id: row.get(0)?,
            sales_person_id: row.get(1)?,
            period_type: row.get(2)?,
            period_start: row.get(3)?,
            period_end: row.get(4)?,
            target_amount: row.get(5)?,
            actual_amount: row.get(6)?,
            achievement_rate: row.get(7)?,
            opportunities_count: row.get(8)?,
            won_opportunities_count: row.get(9)?,
            quotations_count: row.get(10)?,
            contracts_count: row.get(11)?,
            orders_count: row.get(12)?,
            total_commission: row.get(13)?,
            ranking: row.get(14)?,
            notes: row.get(15)?,
            created_at: row.get(16)?,
            updated_at: row.get(17)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

// ==================== 销售活动 Commands ====================

#[tauri::command]
pub fn create_sales_activity(conn: Connection, input: SalesActivityCreateInput) -> Result<SalesActivity, String> {
    let now = Utc::now();
    let status = if input.scheduled_time.is_some() { "scheduled" } else { "completed" }.to_string();
    let participant_ids = input.participant_ids.map(|ids| serde_json::to_string(&ids).unwrap_or_default()).unwrap_or_default();

    conn.execute(
        "INSERT INTO sales_activities (activity_type, subject, description, related_type, related_id, participant_ids, scheduled_time, location, status, created_by, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        params![
            input.activity_type, input.subject, input.description, input.related_type, input.related_id,
            participant_ids, input.scheduled_time, input.location, status, input.related_id, now, now
        ],
    ).map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    get_sales_activity(conn, id)
}

#[tauri::command]
pub fn get_sales_activity(conn: Connection, id: i64) -> Result<SalesActivity, String> {
    let mut stmt = conn.prepare(
        "SELECT id, activity_type, subject, description, related_type, related_id, participant_ids, scheduled_time,
                actual_time, duration_minutes, location, outcome, status, created_by, created_at, updated_at
         FROM sales_activities WHERE id = ?1"
    ).map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        let participant_ids_str: String = row.get(6)?;
        let participant_ids: Vec<i64> = serde_json::from_str(&participant_ids_str).unwrap_or_default();

        Ok(SalesActivity {
            id: row.get(0)?,
            activity_type: row.get(1)?,
            subject: row.get(2)?,
            description: row.get(3)?,
            related_type: row.get(4)?,
            related_id: row.get(5)?,
            participant_ids,
            scheduled_time: row.get(7)?,
            actual_time: row.get(8)?,
            duration_minutes: row.get(9)?,
            location: row.get(10)?,
            outcome: row.get(11)?,
            status: row.get(12)?,
            created_by: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    } else {
        Err("Activity not found".to_string())
    }
}

#[tauri::command]
pub fn list_sales_activities(conn: Connection, params: SalesActivityListParams) -> Result<Vec<SalesActivity>, String> {
    let mut sql = String::from(
        "SELECT id, activity_type, subject, description, related_type, related_id, participant_ids, scheduled_time,
                actual_time, duration_minutes, location, outcome, status, created_by, created_at, updated_at
         FROM sales_activities WHERE 1=1"
    );

    let mut args: Vec<(&str, &dyn rusqlite::ToSql)> = vec![];

    if let Some(activity_type) = params.activity_type {
        sql.push_str(" AND activity_type = ?");
        args.push(("activity_type", &activity_type));
    }
    if let Some(related_type) = params.related_type {
        sql.push_str(" AND related_type = ?");
        args.push(("related_type", &related_type));
    }
    if let Some(related_id) = params.related_id {
        sql.push_str(" AND related_id = ?");
        args.push(("related_id", &related_id));
    }
    if let Some(status) = params.status {
        sql.push_str(" AND status = ?");
        args.push(("status", &status));
    }

    sql.push_str(" ORDER BY scheduled_time DESC");

    if let Some(limit) = params.limit {
        sql.push_str(&format!(" LIMIT {}", limit));
    }
    if let Some(offset) = params.offset {
        sql.push_str(&format!(" OFFSET {}", offset));
    }

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let rows = stmt.query_map(rusqlite::params_from_iter(args.iter().map(|(_, v)| *v)), |row| {
        let participant_ids_str: String = row.get(6).unwrap_or_default();
        let participant_ids: Vec<i64> = serde_json::from_str(&participant_ids_str).unwrap_or_default();

        Ok(SalesActivity {
            id: row.get(0)?,
            activity_type: row.get(1)?,
            subject: row.get(2)?,
            description: row.get(3)?,
            related_type: row.get(4)?,
            related_id: row.get(5)?,
            participant_ids,
            scheduled_time: row.get(7)?,
            actual_time: row.get(8)?,
            duration_minutes: row.get(9)?,
            location: row.get(10)?,
            outcome: row.get(11)?,
            status: row.get(12)?,
            created_by: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    }).map_err(|e| e.to_string())?;

    rows.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn complete_sales_activity(conn: Connection, id: i64, outcome: String, actual_time: String, duration_minutes: i64) -> Result<SalesActivity, String> {
    let now = Utc::now();

    conn.execute(
        "UPDATE sales_activities SET status = 'completed', actual_time = ?1, duration_minutes = ?2, outcome = ?3, updated_at = ?4 WHERE id = ?5",
        params![actual_time, duration_minutes, outcome, now, id],
    ).map_err(|e| e.to_string())?;

    get_sales_activity(conn, id)
}

#[tauri::command]
pub fn delete_sales_activity(conn: Connection, id: i64) -> Result<bool, String> {
    conn.execute("DELETE FROM sales_activities WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(true)
}
