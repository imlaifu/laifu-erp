// 财务管理模块 API 服务

import { invoke } from '@tauri-apps/api/core';
import type {
  FinanceTransaction,
  FinanceTransactionCreateInput,
  FinanceTransactionUpdateInput,
  FinanceTransactionListParams,
  FinanceTransactionListResponse,
  FinanceAccount,
  FinanceAccountCreateInput,
  FinanceAccountUpdateInput,
  FinanceCategory,
  FinanceCategoryCreateInput,
  FinanceCategoryUpdateInput,
  FinanceInvoice,
  FinanceInvoiceCreateInput,
  FinanceInvoiceUpdateInput,
  FinanceInvoiceListParams,
  FinanceInvoiceListResponse,
  FinanceInvoiceItem,
  FinanceInvoiceItemCreateInput,
  FinanceReceivablePayable,
  FinanceReceivablePayableListParams,
  FinanceReportConfig,
  FinanceStatistics,
} from '../types/finance';

// ==================== 收支记录 API ====================

/**
 * 创建收支记录
 */
export async function createFinanceTransaction(input: FinanceTransactionCreateInput): Promise<FinanceTransaction> {
  return invoke<FinanceTransaction>('create_finance_transaction', { input });
}

/**
 * 获取收支记录详情
 */
export async function getFinanceTransaction(id: number): Promise<FinanceTransaction> {
  return invoke<FinanceTransaction>('get_finance_transaction', { id });
}

/**
 * 获取收支记录列表
 */
export async function listFinanceTransactions(params: FinanceTransactionListParams): Promise<FinanceTransactionListResponse> {
  return invoke<FinanceTransactionListResponse>('list_finance_transactions', { params });
}

/**
 * 更新收支记录
 */
export async function updateFinanceTransaction(id: number, input: FinanceTransactionUpdateInput): Promise<FinanceTransaction> {
  return invoke<FinanceTransaction>('update_finance_transaction', { id, input });
}

/**
 * 删除收支记录 (软删除)
 */
export async function deleteFinanceTransaction(id: number): Promise<boolean> {
  return invoke<boolean>('delete_finance_transaction', { id });
}

// ==================== 会计科目 API ====================

/**
 * 创建会计科目
 */
export async function createFinanceAccount(input: FinanceAccountCreateInput): Promise<FinanceAccount> {
  return invoke<FinanceAccount>('create_finance_account', { input });
}

/**
 * 获取会计科目详情
 */
export async function getFinanceAccount(id: number): Promise<FinanceAccount> {
  return invoke<FinanceAccount>('get_finance_account', { id });
}

/**
 * 获取会计科目列表
 */
export async function listFinanceAccounts(): Promise<FinanceAccount[]> {
  return invoke<FinanceAccount[]>('list_finance_accounts');
}

/**
 * 更新会计科目
 */
export async function updateFinanceAccount(id: number, input: FinanceAccountUpdateInput): Promise<FinanceAccount> {
  return invoke<FinanceAccount>('update_finance_account', { id, input });
}

/**
 * 删除会计科目 (软删除)
 */
export async function deleteFinanceAccount(id: number): Promise<boolean> {
  return invoke<boolean>('delete_finance_account', { id });
}

// ==================== 收支分类 API ====================

/**
 * 创建收支分类
 */
export async function createFinanceCategory(input: FinanceCategoryCreateInput): Promise<FinanceCategory> {
  return invoke<FinanceCategory>('create_finance_category', { input });
}

/**
 * 获取收支分类详情
 */
export async function getFinanceCategory(id: number): Promise<FinanceCategory> {
  return invoke<FinanceCategory>('get_finance_category', { id });
}

/**
 * 获取收支分类列表
 */
export async function listFinanceCategories(type?: 'income' | 'expense'): Promise<FinanceCategory[]> {
  return invoke<FinanceCategory[]>('list_finance_categories', { categoryType: type });
}

/**
 * 更新收支分类
 */
export async function updateFinanceCategory(id: number, input: FinanceCategoryUpdateInput): Promise<FinanceCategory> {
  return invoke<FinanceCategory>('update_finance_category', { id, input });
}

/**
 * 删除收支分类 (软删除)
 */
export async function deleteFinanceCategory(id: number): Promise<boolean> {
  return invoke<boolean>('delete_finance_category', { id });
}

// ==================== 发票管理 API ====================

/**
 * 创建发票
 */
export async function createFinanceInvoice(input: FinanceInvoiceCreateInput): Promise<FinanceInvoice> {
  return invoke<FinanceInvoice>('create_finance_invoice', { input });
}

/**
 * 获取发票详情
 */
export async function getFinanceInvoice(id: number): Promise<FinanceInvoice> {
  return invoke<FinanceInvoice>('get_finance_invoice', { id });
}

/**
 * 获取发票列表
 */
export async function listFinanceInvoices(params: FinanceInvoiceListParams): Promise<FinanceInvoiceListResponse> {
  return invoke<FinanceInvoiceListResponse>('list_finance_invoices', { params });
}

/**
 * 更新发票
 */
export async function updateFinanceInvoice(id: number, input: FinanceInvoiceUpdateInput): Promise<FinanceInvoice> {
  return invoke<FinanceInvoice>('update_finance_invoice', { id, input });
}

/**
 * 删除发票 (软删除)
 */
export async function deleteFinanceInvoice(id: number): Promise<boolean> {
  return invoke<boolean>('delete_finance_invoice', { id });
}

// ==================== 发票明细 API ====================

/**
 * 创建发票明细
 */
export async function createFinanceInvoiceItem(input: FinanceInvoiceItemCreateInput): Promise<FinanceInvoiceItem> {
  return invoke<FinanceInvoiceItem>('create_finance_invoice_item', { input });
}

/**
 * 获取发票明细列表
 */
export async function listFinanceInvoiceItems(invoiceId: number): Promise<FinanceInvoiceItem[]> {
  return invoke<FinanceInvoiceItem[]>('list_finance_invoice_items', { invoiceId });
}

/**
 * 删除发票明细
 */
export async function deleteFinanceInvoiceItem(id: number): Promise<boolean> {
  return invoke<boolean>('delete_finance_invoice_item', { id });
}

// ==================== 应收应付 API ====================

/**
 * 获取应收应付列表
 */
export async function listFinanceReceivablesPayables(params: FinanceReceivablePayableListParams): Promise<FinanceReceivablePayable[]> {
  return invoke<FinanceReceivablePayable[]>('list_finance_receivables_payables', { params });
}

// ==================== 财务报表配置 API ====================

/**
 * 获取财务报表配置列表
 */
export async function listFinanceReportConfigs(): Promise<FinanceReportConfig[]> {
  return invoke<FinanceReportConfig[]>('list_finance_report_configs');
}

// ==================== 财务统计 API ====================

/**
 * 获取财务统计
 */
export async function getFinanceStatistics(startDate: string, endDate: string): Promise<FinanceStatistics> {
  return invoke<FinanceStatistics>('get_finance_statistics', { startDate, endDate });
}
