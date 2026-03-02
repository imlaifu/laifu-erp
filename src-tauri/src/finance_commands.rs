// 财务管理模块 Rust Commands
// 实现完整的 CRUD 操作

use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc, NaiveDate};
use serde_json::Value;

// ==================== 收支记录 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FinanceTransaction {
    pub id: i64,
    pub transaction_no: String,
    #[serde(rename = "type")]
    pub transaction_type: String,
    pub category: String,
    pub amount: f64,
    pub currency: String,
    pub exchange_rate: f64,
    pub base_amount: f64,
    pub transaction_date: String,
    pub related_order_id: Option<i64>,
    pub related_order_type: Option<String>,
    pub customer_id: Option<i64>,
    pub supplier_id: Option<i64>,
    pub account_id: Option<i64>,
    pub payment_method: Option<String>,
    pub reference_no: Option<String>,
    pub description: Option<String>,
    pub attachment_urls: Vec<String>,
    pub status: String,
    pub operator_id: Option<i64>,
    pub reviewer_id: Option<i64>,
    pub review_date: Option<DateTime<Utc>>,
    pub remarks: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceTransactionCreateInput {
    pub transaction_no: String,
    #[serde(rename = "type")]
    pub transaction_type: String,
    pub category: String,
    pub amount: f64,
    pub currency: Option<String>,
    pub exchange_rate: Option<f64>,
    pub transaction_date: String,
    pub related_order_id: Option<i64>,
    pub related_order_type: Option<String>,
    pub customer_id: Option<i64>,
    pub supplier_id: Option<i64>,
    pub account_id: Option<i64>,
    pub payment_method: Option<String>,
    pub reference_no: Option<String>,
    pub description: Option<String>,
    pub attachment_urls: Option<Vec<String>>,
    pub remarks: Option<String>,
    pub operator_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceTransactionUpdateInput {
    pub category: Option<String>,
    pub amount: Option<f64>,
    pub currency: Option<String>,
    pub exchange_rate: Option<f64>,
    pub transaction_date: Option<String>,
    pub related_order_id: Option<i64>,
    pub related_order_type: Option<String>,
    pub customer_id: Option<i64>,
    pub supplier_id: Option<i64>,
    pub account_id: Option<i64>,
    pub payment_method: Option<String>,
    pub reference_no: Option<String>,
    pub description: Option<String>,
    pub attachment_urls: Option<Vec<String>>,
    pub status: Option<String>,
    pub remarks: Option<String>,
    pub reviewer_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceTransactionListParams {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub transaction_type: Option<String>,
    pub category: Option<String>,
    pub status: Option<String>,
    pub customer_id: Option<i64>,
    pub supplier_id: Option<i64>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub search: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceTransactionListResponse {
    pub transactions: Vec<FinanceTransaction>,
    pub total: i64,
    pub limit: i64,
    pub offset: i64,
}

// ==================== 会计科目 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FinanceAccount {
    pub id: i64,
    pub code: String,
    pub name: String,
    pub parent_id: Option<i64>,
    pub level: i64,
    #[serde(rename = "type")]
    pub account_type: String,
    pub balance_direction: String,
    pub is_cash_equivalent: bool,
    pub is_bank_account: bool,
    pub bank_name: Option<String>,
    pub bank_account_no: Option<String>,
    pub currency: String,
    pub status: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceAccountCreateInput {
    pub code: String,
    pub name: String,
    pub parent_id: Option<i64>,
    pub level: Option<i64>,
    #[serde(rename = "type")]
    pub account_type: String,
    pub balance_direction: String,
    pub is_cash_equivalent: Option<bool>,
    pub is_bank_account: Option<bool>,
    pub bank_name: Option<String>,
    pub bank_account_no: Option<String>,
    pub currency: Option<String>,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceAccountUpdateInput {
    pub name: Option<String>,
    pub parent_id: Option<i64>,
    pub account_type: Option<String>,
    pub balance_direction: Option<String>,
    pub is_cash_equivalent: Option<bool>,
    pub is_bank_account: Option<bool>,
    pub bank_name: Option<String>,
    pub bank_account_no: Option<String>,
    pub currency: Option<String>,
    pub status: Option<String>,
    pub description: Option<String>,
}

// ==================== 收支分类 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FinanceCategory {
    pub id: i64,
    pub code: String,
    pub name: String,
    pub parent_id: Option<i64>,
    #[serde(rename = "type")]
    pub category_type: String,
    pub level: i64,
    pub description: Option<String>,
    pub is_default: bool,
    pub sort_order: i64,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceCategoryCreateInput {
    pub code: String,
    pub name: String,
    pub parent_id: Option<i64>,
    #[serde(rename = "type")]
    pub category_type: String,
    pub level: Option<i64>,
    pub description: Option<String>,
    pub is_default: Option<bool>,
    pub sort_order: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceCategoryUpdateInput {
    pub name: Option<String>,
    pub parent_id: Option<i64>,
    pub category_type: Option<String>,
    pub description: Option<String>,
    pub is_default: Option<bool>,
    pub sort_order: Option<i64>,
    pub status: Option<String>,
}

// ==================== 发票管理 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FinanceInvoice {
    pub id: i64,
    pub invoice_no: String,
    pub invoice_code: Option<String>,
    #[serde(rename = "type")]
    pub invoice_type: String,
    pub kind: String,
    pub amount: f64,
    pub tax_amount: f64,
    pub total_amount: f64,
    pub currency: String,
    pub invoice_date: String,
    pub check_code: Option<String>,
    pub machine_no: Option<String>,
    pub seller_name: Option<String>,
    pub seller_tax_id: Option<String>,
    pub seller_address_phone: Option<String>,
    pub seller_bank_account: Option<String>,
    pub buyer_name: Option<String>,
    pub buyer_tax_id: Option<String>,
    pub buyer_address_phone: Option<String>,
    pub buyer_bank_account: Option<String>,
    pub related_order_id: Option<i64>,
    pub related_order_type: Option<String>,
    pub customer_id: Option<i64>,
    pub supplier_id: Option<i64>,
    pub status: String,
    pub payment_status: String,
    pub issue_date: Option<DateTime<Utc>>,
    pub receive_date: Option<DateTime<Utc>>,
    pub reimbursement_date: Option<DateTime<Utc>>,
    pub operator_id: Option<i64>,
    pub remarks: Option<String>,
    pub attachment_urls: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceInvoiceCreateInput {
    pub invoice_no: String,
    pub invoice_code: Option<String>,
    #[serde(rename = "type")]
    pub invoice_type: String,
    pub kind: String,
    pub amount: f64,
    pub tax_amount: f64,
    pub total_amount: f64,
    pub currency: Option<String>,
    pub invoice_date: String,
    pub check_code: Option<String>,
    pub machine_no: Option<String>,
    pub seller_name: Option<String>,
    pub seller_tax_id: Option<String>,
    pub seller_address_phone: Option<String>,
    pub seller_bank_account: Option<String>,
    pub buyer_name: Option<String>,
    pub buyer_tax_id: Option<String>,
    pub buyer_address_phone: Option<String>,
    pub buyer_bank_account: Option<String>,
    pub related_order_id: Option<i64>,
    pub related_order_type: Option<String>,
    pub customer_id: Option<i64>,
    pub supplier_id: Option<i64>,
    pub remarks: Option<String>,
    pub attachment_urls: Option<Vec<String>>,
    pub operator_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceInvoiceUpdateInput {
    pub invoice_code: Option<String>,
    pub invoice_type: Option<String>,
    pub kind: Option<String>,
    pub amount: Option<f64>,
    pub tax_amount: Option<f64>,
    pub total_amount: Option<f64>,
    pub currency: Option<String>,
    pub invoice_date: Option<String>,
    pub check_code: Option<String>,
    pub machine_no: Option<String>,
    pub seller_name: Option<String>,
    pub seller_tax_id: Option<String>,
    pub seller_address_phone: Option<String>,
    pub seller_bank_account: Option<String>,
    pub buyer_name: Option<String>,
    pub buyer_tax_id: Option<String>,
    pub buyer_address_phone: Option<String>,
    pub buyer_bank_account: Option<String>,
    pub status: Option<String>,
    pub payment_status: Option<String>,
    pub remarks: Option<String>,
    pub attachment_urls: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceInvoiceListParams {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub invoice_type: Option<String>,
    pub kind: Option<String>,
    pub status: Option<String>,
    pub payment_status: Option<String>,
    pub customer_id: Option<i64>,
    pub supplier_id: Option<i64>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub search: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceInvoiceListResponse {
    pub invoices: Vec<FinanceInvoice>,
    pub total: i64,
    pub limit: i64,
    pub offset: i64,
}

// ==================== 发票明细 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FinanceInvoiceItem {
    pub id: i64,
    pub invoice_id: i64,
    pub product_name: String,
    pub specification: Option<String>,
    pub unit: Option<String>,
    pub quantity: f64,
    pub unit_price: f64,
    pub amount: f64,
    pub tax_rate: f64,
    pub tax_amount: f64,
    pub sort_order: i64,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceInvoiceItemCreateInput {
    pub invoice_id: i64,
    pub product_name: String,
    pub specification: Option<String>,
    pub unit: Option<String>,
    pub quantity: Option<f64>,
    pub unit_price: Option<f64>,
    pub amount: f64,
    pub tax_rate: Option<f64>,
    pub tax_amount: f64,
    pub sort_order: Option<i64>,
}

// ==================== 应收应付 ====================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FinanceReceivablePayable {
    pub id: i64,
    #[serde(rename = "type")]
    pub rp_type: String,
    pub related_order_id: i64,
    pub related_order_type: String,
    pub customer_id: Option<i64>,
    pub supplier_id: Option<i64>,
    pub total_amount: f64,
    pub paid_amount: f64,
    pub unpaid_amount: f64,
    pub due_date: Option<String>,
    pub overdue_days: i64,
    pub status: String,
    pub last_payment_date: Option<DateTime<Utc>>,
    pub operator_id: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceReceivablePayableListParams {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub rp_type: Option<String>,
    pub status: Option<String>,
    pub customer_id: Option<i64>,
    pub supplier_id: Option<i64>,
    pub overdue: Option<bool>,
}

// ==================== 财务报表 ====================

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceReportConfig {
    pub id: i64,
    pub report_type: String,
    pub name: String,
    pub config: Value,
    pub is_enabled: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinanceStatistics {
    pub total_income: f64,
    pub total_expense: f64,
    pub net_profit: f64,
    pub total_receivable: f64,
    pub total_payable: f64,
    pub by_category: Vec<CategoryStatistics>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryStatistics {
    pub category: String,
    pub amount: f64,
    #[serde(rename = "type")]
    pub category_type: String,
}

// ==================== 收支记录 CRUD ====================

pub fn create_finance_transaction(conn: &Connection, input: FinanceTransactionCreateInput) -> Result<FinanceTransaction> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let base_amount = input.amount * input.exchange_rate.unwrap_or(1.0);
    let attachment_urls_json = serde_json::to_string(&input.attachment_urls.unwrap_or_default()).unwrap_or_default();
    
    conn.execute(
        "INSERT INTO finance_transactions (transaction_no, type, category, amount, currency, 
         exchange_rate, base_amount, transaction_date, related_order_id, related_order_type,
         customer_id, supplier_id, account_id, payment_method, reference_no, description,
         attachment_urls, status, operator_id, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, 'pending', ?18, ?19, ?19)",
        params![
            input.transaction_no,
            input.transaction_type,
            input.category,
            input.amount,
            input.currency.unwrap_or_else(|| "CNY".to_string()),
            input.exchange_rate.unwrap_or(1.0),
            base_amount,
            input.transaction_date,
            input.related_order_id,
            input.related_order_type,
            input.customer_id,
            input.supplier_id,
            input.account_id,
            input.payment_method,
            input.reference_no,
            input.description,
            attachment_urls_json,
            input.operator_id,
            now_str,
        ],
    )?;
    
    let transaction_id = conn.last_insert_rowid();
    get_finance_transaction(conn, transaction_id)
}

pub fn get_finance_transaction(conn: &Connection, id: i64) -> Result<FinanceTransaction> {
    let mut stmt = conn.prepare(
        "SELECT id, transaction_no, type, category, amount, currency, exchange_rate, 
                base_amount, transaction_date, related_order_id, related_order_type,
                customer_id, supplier_id, account_id, payment_method, reference_no,
                description, attachment_urls, status, operator_id, reviewer_id,
                review_date, remarks, created_at, updated_at, deleted_at
         FROM finance_transactions WHERE id = ?1 AND deleted_at IS NULL"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(FinanceTransaction {
            id: row.get(0)?,
            transaction_no: row.get(1)?,
            transaction_type: row.get(2)?,
            category: row.get(3)?,
            amount: row.get(4)?,
            currency: row.get(5)?,
            exchange_rate: row.get(6)?,
            base_amount: row.get(7)?,
            transaction_date: row.get(8)?,
            related_order_id: row.get(9)?,
            related_order_type: row.get(10)?,
            customer_id: row.get(11)?,
            supplier_id: row.get(12)?,
            account_id: row.get(13)?,
            payment_method: row.get(14)?,
            reference_no: row.get(15)?,
            description: row.get(16)?,
            attachment_urls: serde_json::from_str(&row.get::<_, String>(17)?).unwrap_or_default(),
            status: row.get(18)?,
            operator_id: row.get(19)?,
            reviewer_id: row.get(20)?,
            review_date: row.get::<_, Option<String>>(21)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            remarks: row.get(22)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(23)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(24)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(25)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })
}

pub fn list_finance_transactions(conn: &Connection, params: FinanceTransactionListParams) -> Result<FinanceTransactionListResponse> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.offset.unwrap_or(0);
    
    let mut where_clauses = vec!["deleted_at IS NULL"];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(transaction_type) = params.transaction_type {
        where_clauses.push("type = ?");
        sql_params.push(Box::new(transaction_type));
    }
    if let Some(category) = params.category {
        where_clauses.push("category = ?");
        sql_params.push(Box::new(category));
    }
    if let Some(status) = params.status {
        where_clauses.push("status = ?");
        sql_params.push(Box::new(status));
    }
    if let Some(customer_id) = params.customer_id {
        where_clauses.push("customer_id = ?");
        sql_params.push(Box::new(customer_id));
    }
    if let Some(supplier_id) = params.supplier_id {
        where_clauses.push("supplier_id = ?");
        sql_params.push(Box::new(supplier_id));
    }
    if let Some(start_date) = params.start_date {
        where_clauses.push("transaction_date >= ?");
        sql_params.push(Box::new(start_date));
    }
    if let Some(end_date) = params.end_date {
        where_clauses.push("transaction_date <= ?");
        sql_params.push(Box::new(end_date));
    }
    if let Some(search) = params.search {
        where_clauses.push("(transaction_no LIKE ? OR description LIKE ? OR reference_no LIKE ?)");
        let search_pattern = format!("%{}%", search);
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern));
    }
    
    let where_clause = where_clauses.join(" AND ");
    
    let count_sql = format!("SELECT COUNT(*) FROM finance_transactions WHERE {}", where_clause);
    let total: i64 = conn.prepare(&count_sql)?.query_row(
        rusqlite::params_from_iter(sql_params.iter().map(|b| b.as_ref())),
        |row| row.get(0),
    )?;
    
    let data_sql = format!(
        "SELECT id, transaction_no, type, category, amount, currency, exchange_rate, 
                base_amount, transaction_date, related_order_id, related_order_type,
                customer_id, supplier_id, account_id, payment_method, reference_no,
                description, attachment_urls, status, operator_id, reviewer_id,
                review_date, remarks, created_at, updated_at, deleted_at
         FROM finance_transactions WHERE {} ORDER BY transaction_date DESC, created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let mut stmt = conn.prepare(&data_sql)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let transactions = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(FinanceTransaction {
            id: row.get(0)?,
            transaction_no: row.get(1)?,
            transaction_type: row.get(2)?,
            category: row.get(3)?,
            amount: row.get(4)?,
            currency: row.get(5)?,
            exchange_rate: row.get(6)?,
            base_amount: row.get(7)?,
            transaction_date: row.get(8)?,
            related_order_id: row.get(9)?,
            related_order_type: row.get(10)?,
            customer_id: row.get(11)?,
            supplier_id: row.get(12)?,
            account_id: row.get(13)?,
            payment_method: row.get(14)?,
            reference_no: row.get(15)?,
            description: row.get(16)?,
            attachment_urls: serde_json::from_str(&row.get::<_, String>(17)?).unwrap_or_default(),
            status: row.get(18)?,
            operator_id: row.get(19)?,
            reviewer_id: row.get(20)?,
            review_date: row.get::<_, Option<String>>(21)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            remarks: row.get(22)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(23)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(24)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(25)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    Ok(FinanceTransactionListResponse {
        transactions: transactions.collect::<Result<Vec<_>, _>>()?,
        total,
        limit,
        offset,
    })
}

pub fn update_finance_transaction(conn: &Connection, id: i64, input: FinanceTransactionUpdateInput) -> Result<FinanceTransaction> {
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
    
    add_update!("category", input.category);
    add_update!("amount", input.amount);
    add_update!("currency", input.currency);
    add_update!("exchange_rate", input.exchange_rate);
    add_update!("transaction_date", input.transaction_date);
    add_update!("related_order_id", input.related_order_id);
    add_update!("related_order_type", input.related_order_type);
    add_update!("customer_id", input.customer_id);
    add_update!("supplier_id", input.supplier_id);
    add_update!("account_id", input.account_id);
    add_update!("payment_method", input.payment_method);
    add_update!("reference_no", input.reference_no);
    add_update!("description", input.description);
    add_update!("status", input.status);
    add_update!("remarks", input.remarks);
    add_update!("reviewer_id", input.reviewer_id);
    
    if let Some(attachment_urls) = input.attachment_urls {
        updates.push("attachment_urls = ?");
        sql_params.push(Box::new(serde_json::to_string(&attachment_urls).unwrap_or_default()));
    }
    
    if input.status == Some("completed".to_string()) {
        updates.push("review_date = ?");
        sql_params.push(Box::new(now_str.clone()));
    }
    
    if updates.is_empty() {
        return get_finance_transaction(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE finance_transactions SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_finance_transaction(conn, id)
}

pub fn delete_finance_transaction(conn: &Connection, id: i64) -> Result<bool> {
    let now = Utc::now();
    let affected = conn.execute(
        "UPDATE finance_transactions SET deleted_at = ?, updated_at = ? WHERE id = ?",
        params![now.to_rfc3339(), now.to_rfc3339(), id],
    )?;
    Ok(affected > 0)
}

// ==================== 会计科目 CRUD ====================

pub fn create_finance_account(conn: &Connection, input: FinanceAccountCreateInput) -> Result<FinanceAccount> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    
    conn.execute(
        "INSERT INTO finance_accounts (code, name, parent_id, level, type, balance_direction,
         is_cash_equivalent, is_bank_account, bank_name, bank_account_no, currency,
         description, status, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, 'active', ?13, ?13)",
        params![
            input.code,
            input.name,
            input.parent_id,
            input.level.unwrap_or(1),
            input.account_type,
            input.balance_direction,
            input.is_cash_equivalent.unwrap_or(false) as i64,
            input.is_bank_account.unwrap_or(false) as i64,
            input.bank_name,
            input.bank_account_no,
            input.currency.unwrap_or_else(|| "CNY".to_string()),
            input.description,
            now_str,
        ],
    )?;
    
    let account_id = conn.last_insert_rowid();
    get_finance_account(conn, account_id)
}

pub fn get_finance_account(conn: &Connection, id: i64) -> Result<FinanceAccount> {
    let mut stmt = conn.prepare(
        "SELECT id, code, name, parent_id, level, type, balance_direction,
                is_cash_equivalent, is_bank_account, bank_name, bank_account_no,
                currency, status, description, created_at, updated_at, deleted_at
         FROM finance_accounts WHERE id = ?1 AND deleted_at IS NULL"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(FinanceAccount {
            id: row.get(0)?,
            code: row.get(1)?,
            name: row.get(2)?,
            parent_id: row.get(3)?,
            level: row.get(4)?,
            account_type: row.get(5)?,
            balance_direction: row.get(6)?,
            is_cash_equivalent: row.get::<_, i64>(7)? != 0,
            is_bank_account: row.get::<_, i64>(8)? != 0,
            bank_name: row.get(9)?,
            bank_account_no: row.get(10)?,
            currency: row.get(11)?,
            status: row.get(12)?,
            description: row.get(13)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(14)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(15)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(16)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })
}

pub fn list_finance_accounts(conn: &Connection) -> Result<Vec<FinanceAccount>> {
    let mut stmt = conn.prepare(
        "SELECT id, code, name, parent_id, level, type, balance_direction,
                is_cash_equivalent, is_bank_account, bank_name, bank_account_no,
                currency, status, description, created_at, updated_at, deleted_at
         FROM finance_accounts WHERE deleted_at IS NULL ORDER BY code"
    )?;
    
    let accounts = stmt.query_map([], |row| {
        Ok(FinanceAccount {
            id: row.get(0)?,
            code: row.get(1)?,
            name: row.get(2)?,
            parent_id: row.get(3)?,
            level: row.get(4)?,
            account_type: row.get(5)?,
            balance_direction: row.get(6)?,
            is_cash_equivalent: row.get::<_, i64>(7)? != 0,
            is_bank_account: row.get::<_, i64>(8)? != 0,
            bank_name: row.get(9)?,
            bank_account_no: row.get(10)?,
            currency: row.get(11)?,
            status: row.get(12)?,
            description: row.get(13)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(14)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(15)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(16)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    accounts.collect()
}

pub fn update_finance_account(conn: &Connection, id: i64, input: FinanceAccountUpdateInput) -> Result<FinanceAccount> {
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
    add_update!("parent_id", input.parent_id);
    add_update!("type", input.account_type);
    add_update!("balance_direction", input.balance_direction);
    add_update!("is_cash_equivalent", input.is_cash_equivalent.map(|v| v as i64));
    add_update!("is_bank_account", input.is_bank_account.map(|v| v as i64));
    add_update!("bank_name", input.bank_name);
    add_update!("bank_account_no", input.bank_account_no);
    add_update!("currency", input.currency);
    add_update!("status", input.status);
    add_update!("description", input.description);
    
    if updates.is_empty() {
        return get_finance_account(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE finance_accounts SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_finance_account(conn, id)
}

pub fn delete_finance_account(conn: &Connection, id: i64) -> Result<bool> {
    let now = Utc::now();
    let affected = conn.execute(
        "UPDATE finance_accounts SET deleted_at = ?, updated_at = ? WHERE id = ?",
        params![now.to_rfc3339(), now.to_rfc3339(), id],
    )?;
    Ok(affected > 0)
}

// ==================== 收支分类 CRUD ====================

pub fn create_finance_category(conn: &Connection, input: FinanceCategoryCreateInput) -> Result<FinanceCategory> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    
    conn.execute(
        "INSERT INTO finance_categories (code, name, parent_id, type, level, description,
         is_default, sort_order, status, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'active', ?9, ?9)",
        params![
            input.code,
            input.name,
            input.parent_id,
            input.category_type,
            input.level.unwrap_or(1),
            input.description,
            input.is_default.unwrap_or(false) as i64,
            input.sort_order.unwrap_or(0),
            now_str,
        ],
    )?;
    
    let category_id = conn.last_insert_rowid();
    get_finance_category(conn, category_id)
}

pub fn get_finance_category(conn: &Connection, id: i64) -> Result<FinanceCategory> {
    let mut stmt = conn.prepare(
        "SELECT id, code, name, parent_id, type, level, description,
                is_default, sort_order, status, created_at, updated_at, deleted_at
         FROM finance_categories WHERE id = ?1 AND deleted_at IS NULL"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(FinanceCategory {
            id: row.get(0)?,
            code: row.get(1)?,
            name: row.get(2)?,
            parent_id: row.get(3)?,
            category_type: row.get(4)?,
            level: row.get(5)?,
            description: row.get(6)?,
            is_default: row.get::<_, i64>(7)? != 0,
            sort_order: row.get(8)?,
            status: row.get(9)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(12)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })
}

pub fn list_finance_categories(conn: &Connection, category_type: Option<String>) -> Result<Vec<FinanceCategory>> {
    let mut where_clause = "deleted_at IS NULL";
    let mut stmt = if let Some(t) = category_type {
        conn.prepare(
            "SELECT id, code, name, parent_id, type, level, description,
                    is_default, sort_order, status, created_at, updated_at, deleted_at
             FROM finance_categories WHERE deleted_at IS NULL AND type = ?1 ORDER BY sort_order, code"
        )?
    } else {
        conn.prepare(
            "SELECT id, code, name, parent_id, type, level, description,
                    is_default, sort_order, status, created_at, updated_at, deleted_at
             FROM finance_categories WHERE deleted_at IS NULL ORDER BY type, sort_order, code"
        )?
    };
    
    let categories = if let Some(t) = category_type {
        stmt.query_map(params![t], |row| {
            Ok(FinanceCategory {
                id: row.get(0)?,
                code: row.get(1)?,
                name: row.get(2)?,
                parent_id: row.get(3)?,
                category_type: row.get(4)?,
                level: row.get(5)?,
                description: row.get(6)?,
                is_default: row.get::<_, i64>(7)? != 0,
                sort_order: row.get(8)?,
                status: row.get(9)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
                deleted_at: row.get::<_, Option<String>>(12)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            })
        })?
    } else {
        stmt.query_map([], |row| {
            Ok(FinanceCategory {
                id: row.get(0)?,
                code: row.get(1)?,
                name: row.get(2)?,
                parent_id: row.get(3)?,
                category_type: row.get(4)?,
                level: row.get(5)?,
                description: row.get(6)?,
                is_default: row.get::<_, i64>(7)? != 0,
                sort_order: row.get(8)?,
                status: row.get(9)?,
                created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(10)?).unwrap().with_timezone(&Utc),
                updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
                deleted_at: row.get::<_, Option<String>>(12)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            })
        })?
    };
    
    categories.collect()
}

pub fn update_finance_category(conn: &Connection, id: i64, input: FinanceCategoryUpdateInput) -> Result<FinanceCategory> {
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
    add_update!("parent_id", input.parent_id);
    add_update!("type", input.category_type);
    add_update!("description", input.description);
    add_update!("is_default", input.is_default.map(|v| v as i64));
    add_update!("sort_order", input.sort_order);
    add_update!("status", input.status);
    
    if updates.is_empty() {
        return get_finance_category(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE finance_categories SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_finance_category(conn, id)
}

pub fn delete_finance_category(conn: &Connection, id: i64) -> Result<bool> {
    let now = Utc::now();
    let affected = conn.execute(
        "UPDATE finance_categories SET deleted_at = ?, updated_at = ? WHERE id = ?",
        params![now.to_rfc3339(), now.to_rfc3339(), id],
    )?;
    Ok(affected > 0)
}

// ==================== 发票管理 CRUD ====================

pub fn create_finance_invoice(conn: &Connection, input: FinanceInvoiceCreateInput) -> Result<FinanceInvoice> {
    let now = Utc::now();
    let now_str = now.to_rfc3339();
    let attachment_urls_json = serde_json::to_string(&input.attachment_urls.unwrap_or_default()).unwrap_or_default();
    
    conn.execute(
        "INSERT INTO finance_invoices (invoice_no, invoice_code, type, kind, amount, tax_amount,
         total_amount, currency, invoice_date, check_code, machine_no, seller_name, seller_tax_id,
         seller_address_phone, seller_bank_account, buyer_name, buyer_tax_id, buyer_address_phone,
         buyer_bank_account, related_order_id, related_order_type, customer_id, supplier_id,
         status, payment_status, operator_id, remarks, attachment_urls, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19,
                 ?20, ?21, ?22, ?23, 'unissued', 'unpaid', ?24, ?25, ?26, ?27, ?27)",
        params![
            input.invoice_no,
            input.invoice_code,
            input.invoice_type,
            input.kind,
            input.amount,
            input.tax_amount,
            input.total_amount,
            input.currency.unwrap_or_else(|| "CNY".to_string()),
            input.invoice_date,
            input.check_code,
            input.machine_no,
            input.seller_name,
            input.seller_tax_id,
            input.seller_address_phone,
            input.seller_bank_account,
            input.buyer_name,
            input.buyer_tax_id,
            input.buyer_address_phone,
            input.buyer_bank_account,
            input.related_order_id,
            input.related_order_type,
            input.customer_id,
            input.supplier_id,
            input.operator_id,
            input.remarks,
            attachment_urls_json,
            now_str,
        ],
    )?;
    
    let invoice_id = conn.last_insert_rowid();
    get_finance_invoice(conn, invoice_id)
}

pub fn get_finance_invoice(conn: &Connection, id: i64) -> Result<FinanceInvoice> {
    let mut stmt = conn.prepare(
        "SELECT id, invoice_no, invoice_code, type, kind, amount, tax_amount, total_amount,
                currency, invoice_date, check_code, machine_no, seller_name, seller_tax_id,
                seller_address_phone, seller_bank_account, buyer_name, buyer_tax_id,
                buyer_address_phone, buyer_bank_account, related_order_id, related_order_type,
                customer_id, supplier_id, status, payment_status, issue_date, receive_date,
                reimbursement_date, operator_id, remarks, attachment_urls, created_at, updated_at, deleted_at
         FROM finance_invoices WHERE id = ?1 AND deleted_at IS NULL"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(FinanceInvoice {
            id: row.get(0)?,
            invoice_no: row.get(1)?,
            invoice_code: row.get(2)?,
            invoice_type: row.get(3)?,
            kind: row.get(4)?,
            amount: row.get(5)?,
            tax_amount: row.get(6)?,
            total_amount: row.get(7)?,
            currency: row.get(8)?,
            invoice_date: row.get(9)?,
            check_code: row.get(10)?,
            machine_no: row.get(11)?,
            seller_name: row.get(12)?,
            seller_tax_id: row.get(13)?,
            seller_address_phone: row.get(14)?,
            seller_bank_account: row.get(15)?,
            buyer_name: row.get(16)?,
            buyer_tax_id: row.get(17)?,
            buyer_address_phone: row.get(18)?,
            buyer_bank_account: row.get(19)?,
            related_order_id: row.get(20)?,
            related_order_type: row.get(21)?,
            customer_id: row.get(22)?,
            supplier_id: row.get(23)?,
            status: row.get(24)?,
            payment_status: row.get(25)?,
            issue_date: row.get::<_, Option<String>>(26)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            receive_date: row.get::<_, Option<String>>(27)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            reimbursement_date: row.get::<_, Option<String>>(28)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            operator_id: row.get(29)?,
            remarks: row.get(30)?,
            attachment_urls: serde_json::from_str(&row.get::<_, String>(31)?).unwrap_or_default(),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(32)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(33)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(34)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })
}

pub fn list_finance_invoices(conn: &Connection, params: FinanceInvoiceListParams) -> Result<FinanceInvoiceListResponse> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.offset.unwrap_or(0);
    
    let mut where_clauses = vec!["deleted_at IS NULL"];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(invoice_type) = params.invoice_type {
        where_clauses.push("type = ?");
        sql_params.push(Box::new(invoice_type));
    }
    if let Some(kind) = params.kind {
        where_clauses.push("kind = ?");
        sql_params.push(Box::new(kind));
    }
    if let Some(status) = params.status {
        where_clauses.push("status = ?");
        sql_params.push(Box::new(status));
    }
    if let Some(payment_status) = params.payment_status {
        where_clauses.push("payment_status = ?");
        sql_params.push(Box::new(payment_status));
    }
    if let Some(customer_id) = params.customer_id {
        where_clauses.push("customer_id = ?");
        sql_params.push(Box::new(customer_id));
    }
    if let Some(supplier_id) = params.supplier_id {
        where_clauses.push("supplier_id = ?");
        sql_params.push(Box::new(supplier_id));
    }
    if let Some(start_date) = params.start_date {
        where_clauses.push("invoice_date >= ?");
        sql_params.push(Box::new(start_date));
    }
    if let Some(end_date) = params.end_date {
        where_clauses.push("invoice_date <= ?");
        sql_params.push(Box::new(end_date));
    }
    if let Some(search) = params.search {
        where_clauses.push("(invoice_no LIKE ? OR seller_name LIKE ? OR buyer_name LIKE ?)");
        let search_pattern = format!("%{}%", search);
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern.clone()));
        sql_params.push(Box::new(search_pattern));
    }
    
    let where_clause = where_clauses.join(" AND ");
    
    let count_sql = format!("SELECT COUNT(*) FROM finance_invoices WHERE {}", where_clause);
    let total: i64 = conn.prepare(&count_sql)?.query_row(
        rusqlite::params_from_iter(sql_params.iter().map(|b| b.as_ref())),
        |row| row.get(0),
    )?;
    
    let data_sql = format!(
        "SELECT id, invoice_no, invoice_code, type, kind, amount, tax_amount, total_amount,
                currency, invoice_date, check_code, machine_no, seller_name, seller_tax_id,
                seller_address_phone, seller_bank_account, buyer_name, buyer_tax_id,
                buyer_address_phone, buyer_bank_account, related_order_id, related_order_type,
                customer_id, supplier_id, status, payment_status, issue_date, receive_date,
                reimbursement_date, operator_id, remarks, attachment_urls, created_at, updated_at, deleted_at
         FROM finance_invoices WHERE {} ORDER BY invoice_date DESC, created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let mut stmt = conn.prepare(&data_sql)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let invoices = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(FinanceInvoice {
            id: row.get(0)?,
            invoice_no: row.get(1)?,
            invoice_code: row.get(2)?,
            invoice_type: row.get(3)?,
            kind: row.get(4)?,
            amount: row.get(5)?,
            tax_amount: row.get(6)?,
            total_amount: row.get(7)?,
            currency: row.get(8)?,
            invoice_date: row.get(9)?,
            check_code: row.get(10)?,
            machine_no: row.get(11)?,
            seller_name: row.get(12)?,
            seller_tax_id: row.get(13)?,
            seller_address_phone: row.get(14)?,
            seller_bank_account: row.get(15)?,
            buyer_name: row.get(16)?,
            buyer_tax_id: row.get(17)?,
            buyer_address_phone: row.get(18)?,
            buyer_bank_account: row.get(19)?,
            related_order_id: row.get(20)?,
            related_order_type: row.get(21)?,
            customer_id: row.get(22)?,
            supplier_id: row.get(23)?,
            status: row.get(24)?,
            payment_status: row.get(25)?,
            issue_date: row.get::<_, Option<String>>(26)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            receive_date: row.get::<_, Option<String>>(27)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            reimbursement_date: row.get::<_, Option<String>>(28)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            operator_id: row.get(29)?,
            remarks: row.get(30)?,
            attachment_urls: serde_json::from_str(&row.get::<_, String>(31)?).unwrap_or_default(),
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(32)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(33)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(34)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    Ok(FinanceInvoiceListResponse {
        invoices: invoices.collect::<Result<Vec<_>, _>>()?,
        total,
        limit,
        offset,
    })
}

pub fn update_finance_invoice(conn: &Connection, id: i64, input: FinanceInvoiceUpdateInput) -> Result<FinanceInvoice> {
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
    
    add_update!("invoice_code", input.invoice_code);
    add_update!("type", input.invoice_type);
    add_update!("kind", input.kind);
    add_update!("amount", input.amount);
    add_update!("tax_amount", input.tax_amount);
    add_update!("total_amount", input.total_amount);
    add_update!("currency", input.currency);
    add_update!("invoice_date", input.invoice_date);
    add_update!("check_code", input.check_code);
    add_update!("machine_no", input.machine_no);
    add_update!("seller_name", input.seller_name);
    add_update!("seller_tax_id", input.seller_tax_id);
    add_update!("seller_address_phone", input.seller_address_phone);
    add_update!("seller_bank_account", input.seller_bank_account);
    add_update!("buyer_name", input.buyer_name);
    add_update!("buyer_tax_id", input.buyer_tax_id);
    add_update!("buyer_address_phone", input.buyer_address_phone);
    add_update!("buyer_bank_account", input.buyer_bank_account);
    add_update!("status", input.status);
    add_update!("payment_status", input.payment_status);
    add_update!("remarks", input.remarks);
    
    if let Some(attachment_urls) = input.attachment_urls {
        updates.push("attachment_urls = ?");
        sql_params.push(Box::new(serde_json::to_string(&attachment_urls).unwrap_or_default()));
    }
    
    if input.status == Some("issued".to_string()) {
        updates.push("issue_date = ?");
        sql_params.push(Box::new(now_str.clone()));
    }
    if input.status == Some("received".to_string()) {
        updates.push("receive_date = ?");
        sql_params.push(Box::new(now_str.clone()));
    }
    if input.status == Some("reimbursed".to_string()) {
        updates.push("reimbursement_date = ?");
        sql_params.push(Box::new(now_str.clone()));
    }
    
    if updates.is_empty() {
        return get_finance_invoice(conn, id);
    }
    
    updates.push("updated_at = ?");
    sql_params.push(Box::new(now_str));
    sql_params.push(Box::new(id));
    
    let sql = format!("UPDATE finance_invoices SET {} WHERE id = ?", updates.join(", "));
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    conn.execute(&sql, rusqlite::params_from_iter(param_refs))?;
    
    get_finance_invoice(conn, id)
}

pub fn delete_finance_invoice(conn: &Connection, id: i64) -> Result<bool> {
    let now = Utc::now();
    let affected = conn.execute(
        "UPDATE finance_invoices SET deleted_at = ?, updated_at = ? WHERE id = ?",
        params![now.to_rfc3339(), now.to_rfc3339(), id],
    )?;
    Ok(affected > 0)
}

// ==================== 发票明细 CRUD ====================

pub fn create_finance_invoice_item(conn: &Connection, input: FinanceInvoiceItemCreateInput) -> Result<FinanceInvoiceItem> {
    let now = Utc::now();
    
    conn.execute(
        "INSERT INTO finance_invoice_items (invoice_id, product_name, specification, unit,
         quantity, unit_price, amount, tax_rate, tax_amount, sort_order, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            input.invoice_id,
            input.product_name,
            input.specification,
            input.unit,
            input.quantity.unwrap_or(1.0),
            input.unit_price.unwrap_or(0.0),
            input.amount,
            input.tax_rate.unwrap_or(0.13),
            input.tax_amount,
            input.sort_order.unwrap_or(0),
            now.to_rfc3339(),
        ],
    )?;
    
    let item_id = conn.last_insert_rowid();
    get_finance_invoice_item(conn, item_id)
}

pub fn get_finance_invoice_item(conn: &Connection, id: i64) -> Result<FinanceInvoiceItem> {
    let mut stmt = conn.prepare(
        "SELECT id, invoice_id, product_name, specification, unit, quantity,
                unit_price, amount, tax_rate, tax_amount, sort_order, created_at
         FROM finance_invoice_items WHERE id = ?1"
    )?;
    
    stmt.query_row(params![id], |row| {
        Ok(FinanceInvoiceItem {
            id: row.get(0)?,
            invoice_id: row.get(1)?,
            product_name: row.get(2)?,
            specification: row.get(3)?,
            unit: row.get(4)?,
            quantity: row.get(5)?,
            unit_price: row.get(6)?,
            amount: row.get(7)?,
            tax_rate: row.get(8)?,
            tax_amount: row.get(9)?,
            sort_order: row.get(10)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
        })
    })
}

pub fn list_finance_invoice_items(conn: &Connection, invoice_id: i64) -> Result<Vec<FinanceInvoiceItem>> {
    let mut stmt = conn.prepare(
        "SELECT id, invoice_id, product_name, specification, unit, quantity,
                unit_price, amount, tax_rate, tax_amount, sort_order, created_at
         FROM finance_invoice_items WHERE invoice_id = ?1 ORDER BY sort_order"
    )?;
    
    let items = stmt.query_map(params![invoice_id], |row| {
        Ok(FinanceInvoiceItem {
            id: row.get(0)?,
            invoice_id: row.get(1)?,
            product_name: row.get(2)?,
            specification: row.get(3)?,
            unit: row.get(4)?,
            quantity: row.get(5)?,
            unit_price: row.get(6)?,
            amount: row.get(7)?,
            tax_rate: row.get(8)?,
            tax_amount: row.get(9)?,
            sort_order: row.get(10)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(11)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    items.collect()
}

pub fn delete_finance_invoice_item(conn: &Connection, id: i64) -> Result<bool> {
    let affected = conn.execute("DELETE FROM finance_invoice_items WHERE id = ?", params![id])?;
    Ok(affected > 0)
}

// ==================== 应收应付 CRUD ====================

pub fn list_finance_receivables_payables(conn: &Connection, params: FinanceReceivablePayableListParams) -> Result<Vec<FinanceReceivablePayable>> {
    let limit = params.limit.unwrap_or(50);
    let offset = params.offset.unwrap_or(0);
    
    let mut where_clauses = vec!["deleted_at IS NULL"];
    let mut sql_params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    
    if let Some(rp_type) = params.rp_type {
        where_clauses.push("type = ?");
        sql_params.push(Box::new(rp_type));
    }
    if let Some(status) = params.status {
        where_clauses.push("status = ?");
        sql_params.push(Box::new(status));
    }
    if let Some(customer_id) = params.customer_id {
        where_clauses.push("customer_id = ?");
        sql_params.push(Box::new(customer_id));
    }
    if let Some(supplier_id) = params.supplier_id {
        where_clauses.push("supplier_id = ?");
        sql_params.push(Box::new(supplier_id));
    }
    if let Some(overdue) = params.overdue {
        if overdue {
            where_clauses.push("overdue_days > 0");
        }
    }
    
    let where_clause = where_clauses.join(" AND ");
    
    let sql = format!(
        "SELECT id, type, related_order_id, related_order_type, customer_id, supplier_id,
                total_amount, paid_amount, unpaid_amount, due_date, overdue_days, status,
                last_payment_date, operator_id, created_at, updated_at, deleted_at
         FROM finance_receivables_payables WHERE {} ORDER BY due_date ASC, created_at DESC LIMIT ? OFFSET ?",
        where_clause
    );
    
    sql_params.push(Box::new(limit));
    sql_params.push(Box::new(offset));
    
    let mut stmt = conn.prepare(&sql)?;
    let param_refs: Vec<&dyn rusqlite::types::ToSql> = sql_params.iter().map(|b| b.as_ref()).collect();
    
    let receivables_payables = stmt.query_map(rusqlite::params_from_iter(param_refs), |row| {
        Ok(FinanceReceivablePayable {
            id: row.get(0)?,
            rp_type: row.get(1)?,
            related_order_id: row.get(2)?,
            related_order_type: row.get(3)?,
            customer_id: row.get(4)?,
            supplier_id: row.get(5)?,
            total_amount: row.get(6)?,
            paid_amount: row.get(7)?,
            unpaid_amount: row.get(8)?,
            due_date: row.get(9)?,
            overdue_days: row.get(10)?,
            status: row.get(11)?,
            last_payment_date: row.get::<_, Option<String>>(12)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
            operator_id: row.get(13)?,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(14)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(15)?).unwrap().with_timezone(&Utc),
            deleted_at: row.get::<_, Option<String>>(16)?.and_then(|s| DateTime::parse_from_rfc3339(&s).ok()).map(|d| d.with_timezone(&Utc)),
        })
    })?;
    
    receivables_payables.collect()
}

// ==================== 财务报表配置 CRUD ====================

pub fn list_finance_report_configs(conn: &Connection) -> Result<Vec<FinanceReportConfig>> {
    let mut stmt = conn.prepare(
        "SELECT id, report_type, name, config, is_enabled, created_at, updated_at
         FROM finance_report_configs WHERE is_enabled = 1 ORDER BY report_type"
    )?;
    
    let configs = stmt.query_map([], |row| {
        Ok(FinanceReportConfig {
            id: row.get(0)?,
            report_type: row.get(1)?,
            name: row.get(2)?,
            config: serde_json::from_str(&row.get::<_, String>(3)?).unwrap_or(Value::Null),
            is_enabled: row.get::<_, i64>(4)? != 0,
            created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(5)?).unwrap().with_timezone(&Utc),
            updated_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(6)?).unwrap().with_timezone(&Utc),
        })
    })?;
    
    configs.collect()
}

// ==================== 财务统计 ====================

pub fn get_finance_statistics(conn: &Connection, start_date: &str, end_date: &str) -> Result<FinanceStatistics> {
    let total_income: f64 = conn.query_row(
        "SELECT COALESCE(SUM(amount), 0) FROM finance_transactions 
         WHERE type = 'income' AND status = 'completed' AND transaction_date BETWEEN ?1 AND ?2 AND deleted_at IS NULL",
        params![start_date, end_date],
        |row| row.get(0),
    )?;
    
    let total_expense: f64 = conn.query_row(
        "SELECT COALESCE(SUM(amount), 0) FROM finance_transactions 
         WHERE type = 'expense' AND status = 'completed' AND transaction_date BETWEEN ?1 AND ?2 AND deleted_at IS NULL",
        params![start_date, end_date],
        |row| row.get(0),
    )?;
    
    let net_profit = total_income - total_expense;
    
    let total_receivable: f64 = conn.query_row(
        "SELECT COALESCE(SUM(unpaid_amount), 0) FROM finance_receivables_payables 
         WHERE type = 'receivable' AND status != 'paid' AND deleted_at IS NULL",
        [],
        |row| row.get(0),
    )?;
    
    let total_payable: f64 = conn.query_row(
        "SELECT COALESCE(SUM(unpaid_amount), 0) FROM finance_receivables_payables 
         WHERE type = 'payable' AND status != 'paid' AND deleted_at IS NULL",
        [],
        |row| row.get(0),
    )?;
    
    // 按分类统计
    let mut stmt = conn.prepare(
        "SELECT category, SUM(amount) as amount, type FROM finance_transactions 
         WHERE status = 'completed' AND transaction_date BETWEEN ?1 AND ?2 AND deleted_at IS NULL
         GROUP BY category, type ORDER BY amount DESC"
    )?;
    
    let by_category = stmt.query_map(params![start_date, end_date], |row| {
        Ok(CategoryStatistics {
            category: row.get(0)?,
            amount: row.get(1)?,
            category_type: row.get(2)?,
        })
    })?;
    
    Ok(FinanceStatistics {
        total_income,
        total_expense,
        net_profit,
        total_receivable,
        total_payable,
        by_category: by_category.collect::<Result<Vec<_>, _>>()?,
    })
}
