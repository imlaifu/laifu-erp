// 销售管理模块 API 服务

import { invoke } from '@tauri-apps/api/core';
import type {
  SalesOpportunity,
  SalesOpportunityCreateInput,
  SalesOpportunityListParams,
  OpportunityFollowup,
  OpportunityFollowupCreateInput,
  SalesQuotation,
  SalesQuotationCreateInput,
  QuotationItem,
  SalesQuotationListParams,
  SalesContract,
  SalesContractCreateInput,
  ContractItem,
  SalesContractListParams,
  SalesForecast,
  SalesForecastCreateInput,
  SalesForecastListParams,
  SalesCommission,
  SalesCommissionCreateInput,
  SalesCommissionListParams,
  SalesPerformance,
  SalesPerformanceListParams,
  SalesActivity,
  SalesActivityCreateInput,
  SalesActivityListParams,
} from '../types/sales';

// ==================== 销售机会 API ====================

/**
 * 创建销售机会
 */
export async function createSalesOpportunity(input: SalesOpportunityCreateInput): Promise<SalesOpportunity> {
  return invoke<SalesOpportunity>('create_sales_opportunity', { input });
}

/**
 * 获取销售机会详情
 */
export async function getSalesOpportunity(id: number): Promise<SalesOpportunity> {
  return invoke<SalesOpportunity>('get_sales_opportunity', { id });
}

/**
 * 获取销售机会列表
 */
export async function listSalesOpportunities(params: SalesOpportunityListParams): Promise<SalesOpportunity[]> {
  return invoke<SalesOpportunity[]>('list_sales_opportunities', { params });
}

/**
 * 更新销售机会
 */
export async function updateSalesOpportunity(id: number, input: SalesOpportunityCreateInput): Promise<SalesOpportunity> {
  return invoke<SalesOpportunity>('update_sales_opportunity', { id, input });
}

/**
 * 删除销售机会
 */
export async function deleteSalesOpportunity(id: number): Promise<boolean> {
  return invoke<boolean>('delete_sales_opportunity', { id });
}

/**
 * 更新销售机会阶段
 */
export async function updateOpportunityStage(id: number, stage: string): Promise<SalesOpportunity> {
  return invoke<SalesOpportunity>('update_opportunity_stage', { id, stage });
}

// ==================== 跟进记录 API ====================

/**
 * 创建跟进记录
 */
export async function createOpportunityFollowup(input: OpportunityFollowupCreateInput): Promise<OpportunityFollowup> {
  return invoke<OpportunityFollowup>('create_opportunity_followup', { input });
}

/**
 * 获取跟进记录详情
 */
export async function getOpportunityFollowup(id: number): Promise<OpportunityFollowup> {
  return invoke<OpportunityFollowup>('get_opportunity_followup', { id });
}

/**
 * 获取跟进记录列表
 */
export async function listOpportunityFollowups(opportunityId: number): Promise<OpportunityFollowup[]> {
  return invoke<OpportunityFollowup[]>('list_opportunity_followups', { opportunityId });
}

// ==================== 报价单 API ====================

/**
 * 创建报价单
 */
export async function createSalesQuotation(input: SalesQuotationCreateInput): Promise<SalesQuotation> {
  return invoke<SalesQuotation>('create_sales_quotation', { input });
}

/**
 * 获取报价单详情
 */
export async function getSalesQuotation(id: number): Promise<SalesQuotation> {
  return invoke<SalesQuotation>('get_sales_quotation', { id });
}

/**
 * 获取报价单列表
 */
export async function listSalesQuotations(params: SalesQuotationListParams): Promise<SalesQuotation[]> {
  return invoke<SalesQuotation[]>('list_sales_quotations', { params });
}

/**
 * 获取报价单明细
 */
export async function getQuotationItems(quotationId: number): Promise<QuotationItem[]> {
  return invoke<QuotationItem[]>('get_quotation_items', { quotationId });
}

/**
 * 更新报价单状态
 */
export async function updateQuotationStatus(id: number, status: string): Promise<SalesQuotation> {
  return invoke<SalesQuotation>('update_quotation_status', { id, status });
}

/**
 * 删除报价单
 */
export async function deleteSalesQuotation(id: number): Promise<boolean> {
  return invoke<boolean>('delete_sales_quotation', { id });
}

// ==================== 销售合同 API ====================

/**
 * 创建销售合同
 */
export async function createSalesContract(input: SalesContractCreateInput): Promise<SalesContract> {
  return invoke<SalesContract>('create_sales_contract', { input });
}

/**
 * 获取销售合同详情
 */
export async function getSalesContract(id: number): Promise<SalesContract> {
  return invoke<SalesContract>('get_sales_contract', { id });
}

/**
 * 获取销售合同列表
 */
export async function listSalesContracts(params: SalesContractListParams): Promise<SalesContract[]> {
  return invoke<SalesContract[]>('list_sales_contracts', { params });
}

/**
 * 获取销售合同明细
 */
export async function getContractItems(contractId: number): Promise<ContractItem[]> {
  return invoke<ContractItem[]>('get_contract_items', { contractId });
}

/**
 * 更新销售合同状态
 */
export async function updateContractStatus(id: number, status: string): Promise<SalesContract> {
  return invoke<SalesContract>('update_contract_status', { id, status });
}

/**
 * 更新合同付款金额
 */
export async function updateContractPayment(id: number, paidAmount: number): Promise<SalesContract> {
  return invoke<SalesContract>('update_contract_payment', { id, paidAmount });
}

/**
 * 删除销售合同
 */
export async function deleteSalesContract(id: number): Promise<boolean> {
  return invoke<boolean>('delete_sales_contract', { id });
}

// ==================== 销售预测 API ====================

/**
 * 创建销售预测
 */
export async function createSalesForecast(input: SalesForecastCreateInput): Promise<SalesForecast> {
  return invoke<SalesForecast>('create_sales_forecast', { input });
}

/**
 * 获取销售预测详情
 */
export async function getSalesForecast(id: number): Promise<SalesForecast> {
  return invoke<SalesForecast>('get_sales_forecast', { id });
}

/**
 * 获取销售预测列表
 */
export async function listSalesForecasts(params: SalesForecastListParams): Promise<SalesForecast[]> {
  return invoke<SalesForecast[]>('list_sales_forecasts', { params });
}

/**
 * 更新销售预测实际值
 */
export async function updateSalesForecastActuals(id: number, actualQuantity: number, actualAmount: number): Promise<SalesForecast> {
  return invoke<SalesForecast>('update_sales_forecast_actuals', { id, actualQuantity, actualAmount });
}

/**
 * 删除销售预测
 */
export async function deleteSalesForecast(id: number): Promise<boolean> {
  return invoke<boolean>('delete_sales_forecast', { id });
}

// ==================== 销售佣金 API ====================

/**
 * 创建销售佣金
 */
export async function createSalesCommission(input: SalesCommissionCreateInput): Promise<SalesCommission> {
  return invoke<SalesCommission>('create_sales_commission', { input });
}

/**
 * 获取销售佣金详情
 */
export async function getSalesCommission(id: number): Promise<SalesCommission> {
  return invoke<SalesCommission>('get_sales_commission', { id });
}

/**
 * 获取销售佣金列表
 */
export async function listSalesCommissions(params: SalesCommissionListParams): Promise<SalesCommission[]> {
  return invoke<SalesCommission[]>('list_sales_commissions', { params });
}

/**
 * 审批销售佣金
 */
export async function approveSalesCommission(id: number, approvedBy: number): Promise<SalesCommission> {
  return invoke<SalesCommission>('approve_sales_commission', { id, approvedBy });
}

/**
 * 支付销售佣金
 */
export async function paySalesCommission(id: number): Promise<SalesCommission> {
  return invoke<SalesCommission>('pay_sales_commission', { id });
}

/**
 * 删除销售佣金
 */
export async function deleteSalesCommission(id: number): Promise<boolean> {
  return invoke<boolean>('delete_sales_commission', { id });
}

// ==================== 销售业绩 API ====================

/**
 * 获取销售业绩列表
 */
export async function listSalesPerformance(params: SalesPerformanceListParams): Promise<SalesPerformance[]> {
  return invoke<SalesPerformance[]>('list_sales_performance', { params });
}

// ==================== 销售活动 API ====================

/**
 * 创建销售活动
 */
export async function createSalesActivity(input: SalesActivityCreateInput): Promise<SalesActivity> {
  return invoke<SalesActivity>('create_sales_activity', { input });
}

/**
 * 获取销售活动详情
 */
export async function getSalesActivity(id: number): Promise<SalesActivity> {
  return invoke<SalesActivity>('get_sales_activity', { id });
}

/**
 * 获取销售活动列表
 */
export async function listSalesActivities(params: SalesActivityListParams): Promise<SalesActivity[]> {
  return invoke<SalesActivity[]>('list_sales_activities', { params });
}

/**
 * 完成销售活动
 */
export async function completeSalesActivity(id: number, outcome: string, actualTime: string, durationMinutes: number): Promise<SalesActivity> {
  return invoke<SalesActivity>('complete_sales_activity', { id, outcome, actualTime, durationMinutes });
}

/**
 * 删除销售活动
 */
export async function deleteSalesActivity(id: number): Promise<boolean> {
  return invoke<boolean>('delete_sales_activity', { id });
}
