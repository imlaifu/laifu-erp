// 采购管理模块 API 服务

import { invoke } from '@tauri-apps/api/core';
import type {
  ProcurementRequest,
  ProcurementRequestCreateInput,
  ProcurementRequestItem,
  ProcurementRequestListParams,
  PurchaseOrder,
  PurchaseOrderCreateInput,
  PurchaseOrderItem,
  PurchaseOrderItemInput,
  PurchaseOrderListParams,
  PurchaseContract,
  PurchaseContractCreateInput,
  PurchaseContractListParams,
  ReceivingInspection,
  ReceivingInspectionCreateInput,
  ReceivingInspectionItem,
  ReceivingInspectionListParams,
  SupplierComparison,
  SupplierComparisonCreateInput,
  SupplierComparisonItem,
  SupplierComparisonItemInput,
  SupplierComparisonListParams,
} from '../types/procurement';

// ==================== 采购申请 API ====================

/**
 * 创建采购申请
 */
export async function createProcurementRequest(input: ProcurementRequestCreateInput): Promise<ProcurementRequest> {
  return invoke<ProcurementRequest>('create_procurement_request', { input });
}

/**
 * 获取采购申请详情
 */
export async function getProcurementRequest(id: number): Promise<ProcurementRequest> {
  return invoke<ProcurementRequest>('get_procurement_request', { id });
}

/**
 * 获取采购申请列表
 */
export async function listProcurementRequests(params: ProcurementRequestListParams): Promise<ProcurementRequest[]> {
  return invoke<ProcurementRequest[]>('list_procurement_requests', { params });
}

/**
 * 获取采购申请明细
 */
export async function getProcurementRequestItems(requestId: number): Promise<ProcurementRequestItem[]> {
  return invoke<ProcurementRequestItem[]>('get_procurement_request_items', { requestId });
}

/**
 * 审批采购申请
 */
export async function approveProcurementRequest(id: number, approvedBy: number): Promise<ProcurementRequest> {
  return invoke<ProcurementRequest>('approve_procurement_request', { id, approvedBy });
}

/**
 * 拒绝采购申请
 */
export async function rejectProcurementRequest(id: number, rejectionReason: string): Promise<ProcurementRequest> {
  return invoke<ProcurementRequest>('reject_procurement_request', { id, rejectionReason });
}

// ==================== 采购订单 API ====================

/**
 * 创建采购订单
 */
export async function createPurchaseOrder(input: PurchaseOrderCreateInput): Promise<PurchaseOrder> {
  return invoke<PurchaseOrder>('create_purchase_order', { input });
}

/**
 * 获取采购订单详情
 */
export async function getPurchaseOrder(id: number): Promise<PurchaseOrder> {
  return invoke<PurchaseOrder>('get_purchase_order', { id });
}

/**
 * 获取采购订单列表
 */
export async function listPurchaseOrders(params: PurchaseOrderListParams): Promise<PurchaseOrder[]> {
  return invoke<PurchaseOrder[]>('list_purchase_orders', { params });
}

/**
 * 获取采购订单明细
 */
export async function getPurchaseOrderItems(orderId: number): Promise<PurchaseOrderItem[]> {
  return invoke<PurchaseOrderItem[]>('get_purchase_order_items', { orderId });
}

/**
 * 更新采购订单状态
 */
export async function updatePurchaseOrderStatus(id: number, status: string): Promise<PurchaseOrder> {
  return invoke<PurchaseOrder>('update_purchase_order_status', { id, status });
}

/**
 * 删除采购订单
 */
export async function deletePurchaseOrder(id: number): Promise<boolean> {
  return invoke<boolean>('delete_purchase_order', { id });
}

// ==================== 采购合同 API ====================

/**
 * 创建采购合同
 */
export async function createPurchaseContract(input: PurchaseContractCreateInput): Promise<PurchaseContract> {
  return invoke<PurchaseContract>('create_purchase_contract', { input });
}

/**
 * 获取采购合同详情
 */
export async function getPurchaseContract(id: number): Promise<PurchaseContract> {
  return invoke<PurchaseContract>('get_purchase_contract', { id });
}

/**
 * 获取采购合同列表
 */
export async function listPurchaseContracts(params: PurchaseContractListParams): Promise<PurchaseContract[]> {
  return invoke<PurchaseContract[]>('list_purchase_contracts', { params });
}

/**
 * 更新采购合同状态
 */
export async function updatePurchaseContractStatus(id: number, status: string): Promise<PurchaseContract> {
  return invoke<PurchaseContract>('update_purchase_contract_status', { id, status });
}

// ==================== 入库验收 API ====================

/**
 * 创建入库验收单
 */
export async function createReceivingInspection(input: ReceivingInspectionCreateInput): Promise<ReceivingInspection> {
  return invoke<ReceivingInspection>('create_receiving_inspection', { input });
}

/**
 * 获取入库验收单详情
 */
export async function getReceivingInspection(id: number): Promise<ReceivingInspection> {
  return invoke<ReceivingInspection>('get_receiving_inspection', { id });
}

/**
 * 获取入库验收单列表
 */
export async function listReceivingInspecctions(params: ReceivingInspectionListParams): Promise<ReceivingInspection[]> {
  return invoke<ReceivingInspection[]>('list_receiving_inspections', { params });
}

/**
 * 获取入库验收明细
 */
export async function getReceivingInspectionItems(inspectionId: number): Promise<ReceivingInspectionItem[]> {
  return invoke<ReceivingInspectionItem[]>('get_receiving_inspection_items', { inspectionId });
}

/**
 * 更新入库验收状态
 */
export async function updateReceivingInspectionStatus(
  id: number,
  status: string,
  qualityStatus?: string,
  rejectionReason?: string
): Promise<ReceivingInspection> {
  return invoke<ReceivingInspection>('update_receiving_inspection_status', { id, status, qualityStatus, rejectionReason });
}

// ==================== 供应商比价 API ====================

/**
 * 创建供应商比价单
 */
export async function createSupplierComparison(input: SupplierComparisonCreateInput): Promise<SupplierComparison> {
  return invoke<SupplierComparison>('create_supplier_comparison', { input });
}

/**
 * 获取供应商比价单详情
 */
export async function getSupplierComparison(id: number): Promise<SupplierComparison> {
  return invoke<SupplierComparison>('get_supplier_comparison', { id });
}

/**
 * 获取供应商比价单列表
 */
export async function listSupplierComparisons(params: SupplierComparisonListParams): Promise<SupplierComparison[]> {
  return invoke<SupplierComparison[]>('list_supplier_comparisons', { params });
}

/**
 * 添加供应商比价明细
 */
export async function addSupplierComparisonItem(
  comparisonId: number,
  input: SupplierComparisonItemInput
): Promise<SupplierComparisonItem> {
  return invoke<SupplierComparisonItem>('add_supplier_comparison_item', { comparisonId, input });
}

/**
 * 获取供应商比价明细
 */
export async function getSupplierComparisonItems(comparisonId: number): Promise<SupplierComparisonItem[]> {
  return invoke<SupplierComparisonItem[]>('get_supplier_comparison_items', { comparisonId });
}

/**
 * 选择供应商
 */
export async function selectSupplierComparisonItem(itemId: number): Promise<void> {
  return invoke<void>('select_supplier_comparison_item', { itemId });
}

/**
 * 删除供应商比价单
 */
export async function deleteSupplierComparison(id: number): Promise<boolean> {
  return invoke<boolean>('delete_supplier_comparison', { id });
}

// ==================== 工具函数 ====================

/**
 * 从采购申请创建采购订单
 */
export async function convertRequestToOrder(
  requestId: number,
  supplierId: number,
  items: PurchaseOrderItemInput[],
  paymentTerms?: string,
  expectedDeliveryDate?: string
): Promise<PurchaseOrder> {
  return createPurchaseOrder({
    supplierId,
    requestId,
    paymentTerms,
    expectedDeliveryDate,
    items,
  });
}

/**
 * 提交采购订单
 */
export async function submitPurchaseOrder(id: number): Promise<PurchaseOrder> {
  return updatePurchaseOrderStatus(id, 'submitted');
}

/**
 * 确认采购订单
 */
export async function confirmPurchaseOrder(id: number): Promise<PurchaseOrder> {
  return updatePurchaseOrderStatus(id, 'confirmed');
}

/**
 * 完成采购订单
 */
export async function completePurchaseOrder(id: number): Promise<PurchaseOrder> {
  return updatePurchaseOrderStatus(id, 'completed');
}

/**
 * 取消采购订单
 */
export async function cancelPurchaseOrder(id: number): Promise<PurchaseOrder> {
  return updatePurchaseOrderStatus(id, 'cancelled');
}

/**
 * 完成入库验收
 */
export async function completeReceivingInspection(id: number): Promise<ReceivingInspection> {
  return updateReceivingInspectionStatus(id, 'completed', 'passed');
}

/**
 * 拒绝入库验收
 */
export async function rejectReceivingInspection(id: number, reason: string): Promise<ReceivingInspection> {
  return updateReceivingInspectionStatus(id, 'rejected', 'failed', reason);
}
