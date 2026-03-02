// 订单管理模块 API 服务

import { invoke } from '@tauri-apps/api/core';
import type {
  Customer,
  CustomerCreateInput,
  CustomerUpdateInput,
  Supplier,
  SupplierCreateInput,
  SupplierUpdateInput,
  SalesOrder,
  SalesOrderCreateInput,
  SalesOrderUpdateInput,
  SalesOrderListParams,
  SalesOrderItem,
  PurchaseOrder,
  PurchaseOrderCreateInput,
  PurchaseOrderUpdateInput,
  PurchaseOrderListParams,
  PurchaseOrderItem,
  OrderStatusHistory,
  OrderStatusChangeInput,
} from '../types/order';

// ==================== 客户 API ====================

/**
 * 创建客户
 */
export async function createCustomer(input: CustomerCreateInput): Promise<Customer> {
  return invoke<Customer>('create_customer', { input });
}

/**
 * 获取客户详情
 */
export async function getCustomer(id: number): Promise<Customer> {
  return invoke<Customer>('get_customer', { id });
}

/**
 * 获取客户列表
 */
export async function listCustomers(
  limit: number = 50,
  offset: number = 0,
  status?: string | null,
  level?: string | null,
  search?: string | null
): Promise<Customer[]> {
  return invoke<Customer[]>('list_customers', { limit, offset, status, level, search });
}

/**
 * 更新客户
 */
export async function updateCustomer(id: number, input: CustomerUpdateInput): Promise<Customer> {
  return invoke<Customer>('update_customer', { id, input });
}

/**
 * 删除客户
 */
export async function deleteCustomer(id: number): Promise<boolean> {
  return invoke<boolean>('delete_customer', { id });
}

// ==================== 供应商 API ====================

/**
 * 创建供应商
 */
export async function createSupplier(input: SupplierCreateInput): Promise<Supplier> {
  return invoke<Supplier>('create_supplier', { input });
}

/**
 * 获取供应商详情
 */
export async function getSupplier(id: number): Promise<Supplier> {
  return invoke<Supplier>('get_supplier', { id });
}

/**
 * 获取供应商列表
 */
export async function listSuppliers(
  limit: number = 50,
  offset: number = 0,
  status?: string | null,
  search?: string | null
): Promise<Supplier[]> {
  return invoke<Supplier[]>('list_suppliers', { limit, offset, status, search });
}

/**
 * 更新供应商
 */
export async function updateSupplier(id: number, input: SupplierUpdateInput): Promise<Supplier> {
  return invoke<Supplier>('update_supplier', { id, input });
}

/**
 * 删除供应商
 */
export async function deleteSupplier(id: number): Promise<boolean> {
  return invoke<boolean>('delete_supplier', { id });
}

// ==================== 销售订单 API ====================

/**
 * 创建销售订单
 */
export async function createSalesOrder(input: SalesOrderCreateInput): Promise<SalesOrder> {
  return invoke<SalesOrder>('create_sales_order', { input });
}

/**
 * 获取销售订单详情
 */
export async function getSalesOrder(id: number): Promise<SalesOrder> {
  return invoke<SalesOrder>('get_sales_order', { id });
}

/**
 * 获取销售订单列表
 */
export async function listSalesOrders(params: SalesOrderListParams): Promise<SalesOrder[]> {
  return invoke<SalesOrder[]>('list_sales_orders', { params });
}

/**
 * 更新销售订单
 */
export async function updateSalesOrder(id: number, input: SalesOrderUpdateInput): Promise<SalesOrder> {
  return invoke<SalesOrder>('update_sales_order', { id, input });
}

/**
 * 删除销售订单
 */
export async function deleteSalesOrder(id: number): Promise<boolean> {
  return invoke<boolean>('delete_sales_order', { id });
}

/**
 * 获取销售订单明细
 */
export async function getSalesOrderItems(orderId: number): Promise<SalesOrderItem[]> {
  return invoke<SalesOrderItem[]>('get_sales_order_items', { orderId });
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
 * 更新采购订单
 */
export async function updatePurchaseOrder(id: number, input: PurchaseOrderUpdateInput): Promise<PurchaseOrder> {
  return invoke<PurchaseOrder>('update_purchase_order', { id, input });
}

/**
 * 删除采购订单
 */
export async function deletePurchaseOrder(id: number): Promise<boolean> {
  return invoke<boolean>('delete_purchase_order', { id });
}

/**
 * 获取采购订单明细
 */
export async function getPurchaseOrderItems(orderId: number): Promise<PurchaseOrderItem[]> {
  return invoke<PurchaseOrderItem[]>('get_purchase_order_items', { orderId });
}

// ==================== 订单状态历史 API ====================

/**
 * 添加订单状态变更历史
 */
export async function addOrderStatusHistory(input: OrderStatusChangeInput): Promise<OrderStatusHistory> {
  return invoke<OrderStatusHistory>('add_order_status_history', { input });
}

/**
 * 获取订单状态历史
 */
export async function getOrderStatusHistory(orderType: 'sales' | 'purchase', orderId: number): Promise<OrderStatusHistory[]> {
  return invoke<OrderStatusHistory[]>('list_order_status_history', { orderType, orderId });
}

// ==================== 工具函数 ====================

/**
 * 确认销售订单
 */
export async function confirmSalesOrder(id: number, reason?: string): Promise<SalesOrder> {
  const order = await updateSalesOrder(id, { status: 'confirmed' });
  if (reason) {
    await addOrderStatusHistory({
      orderType: 'sales',
      orderId: id,
      newStatus: 'confirmed',
      changeReason: reason,
    });
  }
  return order;
}

/**
 * 发货销售订单
 */
export async function shipSalesOrder(id: number, reason?: string): Promise<SalesOrder> {
  const order = await updateSalesOrder(id, { status: 'shipped' });
  if (reason) {
    await addOrderStatusHistory({
      orderType: 'sales',
      orderId: id,
      newStatus: 'shipped',
      changeReason: reason,
    });
  }
  return order;
}

/**
 * 完成销售订单
 */
export async function completeSalesOrder(id: number, reason?: string): Promise<SalesOrder> {
  const order = await updateSalesOrder(id, { status: 'completed' });
  if (reason) {
    await addOrderStatusHistory({
      orderType: 'sales',
      orderId: id,
      newStatus: 'completed',
      changeReason: reason,
    });
  }
  return order;
}

/**
 * 取消销售订单
 */
export async function cancelSalesOrder(id: number, reason?: string): Promise<SalesOrder> {
  const order = await updateSalesOrder(id, { status: 'cancelled' });
  if (reason) {
    await addOrderStatusHistory({
      orderType: 'sales',
      orderId: id,
      newStatus: 'cancelled',
      changeReason: reason,
    });
  }
  return order;
}

/**
 * 确认采购订单
 */
export async function confirmPurchaseOrder(id: number, reason?: string): Promise<PurchaseOrder> {
  const order = await updatePurchaseOrder(id, { status: 'confirmed' });
  if (reason) {
    await addOrderStatusHistory({
      orderType: 'purchase',
      orderId: id,
      newStatus: 'confirmed',
      changeReason: reason,
    });
  }
  return order;
}

/**
 * 完成采购订单 (已收货)
 */
export async function receivePurchaseOrder(id: number, reason?: string): Promise<PurchaseOrder> {
  const order = await updatePurchaseOrder(id, { status: 'received' });
  if (reason) {
    await addOrderStatusHistory({
      orderType: 'purchase',
      orderId: id,
      newStatus: 'received',
      changeReason: reason,
    });
  }
  return order;
}

/**
 * 取消采购订单
 */
export async function cancelPurchaseOrder(id: number, reason?: string): Promise<PurchaseOrder> {
  const order = await updatePurchaseOrder(id, { status: 'cancelled' });
  if (reason) {
    await addOrderStatusHistory({
      orderType: 'purchase',
      orderId: id,
      newStatus: 'cancelled',
      changeReason: reason,
    });
  }
  return order;
}
