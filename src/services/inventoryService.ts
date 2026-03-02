// 库存管理模块 API 服务

import { invoke } from '@tauri-apps/api/core';
import type {
  InventoryAlert,
  InventoryAlertInput,
  InventoryAlertWithProduct,
  InventoryAlertListParams,
  InventoryCount,
  InventoryCountInput,
  InventoryCountItem,
  InventoryCountItemInput,
  InventoryTransfer,
  InventoryTransferInput,
  InventoryTransferItem,
  InventoryTransferItemInput,
  InventorySummary,
  LowStockProduct,
  InventoryCountListParams,
  InventoryTransferListParams,
} from '../types/inventory';

// ==================== 库存预警 API ====================

/**
 * 创建库存预警配置
 */
export async function createInventoryAlert(input: InventoryAlertInput): Promise<InventoryAlert> {
  return invoke<InventoryAlert>('create_inventory_alert', { input });
}

/**
 * 获取库存预警详情
 */
export async function getInventoryAlert(id: number): Promise<InventoryAlert> {
  return invoke<InventoryAlert>('get_inventory_alert', { id });
}

/**
 * 获取库存预警列表
 */
export async function listInventoryAlerts(params?: InventoryAlertListParams): Promise<InventoryAlertWithProduct[]> {
  return invoke<InventoryAlertWithProduct[]>('list_inventory_alerts', { 
    warehouseId: params?.warehouseId ?? null,
    alertStatus: params?.alertStatus ?? null,
  });
}

/**
 * 更新库存预警配置
 */
export async function updateInventoryAlert(id: number, input: InventoryAlertInput): Promise<InventoryAlert> {
  return invoke<InventoryAlert>('update_inventory_alert', { id, input });
}

/**
 * 删除库存预警配置
 */
export async function deleteInventoryAlert(id: number): Promise<boolean> {
  return invoke<boolean>('delete_inventory_alert', { id });
}

// ==================== 库存盘点 API ====================

/**
 * 创建库存盘点任务
 */
export async function createInventoryCount(input: InventoryCountInput): Promise<InventoryCount> {
  return invoke<InventoryCount>('create_inventory_count', { input });
}

/**
 * 获取库存盘点详情
 */
export async function getInventoryCount(id: number): Promise<InventoryCount> {
  return invoke<InventoryCount>('get_inventory_count', { id });
}

/**
 * 获取库存盘点列表
 */
export async function listInventoryCounts(params?: InventoryCountListParams): Promise<InventoryCount[]> {
  return invoke<InventoryCount[]>('list_inventory_counts', {
    warehouseId: params?.warehouseId ?? null,
    status: params?.status ?? null,
  });
}

/**
 * 更新库存盘点状态
 */
export async function updateInventoryCountStatus(id: number, status: string, operatorId?: number | null): Promise<InventoryCount> {
  return invoke<InventoryCount>('update_inventory_count_status', { id, status, operatorId });
}

/**
 * 删除库存盘点任务
 */
export async function deleteInventoryCount(id: number): Promise<boolean> {
  return invoke<boolean>('delete_inventory_count', { id });
}

// ==================== 库存盘点明细 API ====================

/**
 * 创建库存盘点明细
 */
export async function createInventoryCountItem(input: InventoryCountItemInput): Promise<InventoryCountItem> {
  return invoke<InventoryCountItem>('create_inventory_count_item', { input });
}

/**
 * 获取库存盘点明细详情
 */
export async function getInventoryCountItem(id: number): Promise<InventoryCountItem> {
  return invoke<InventoryCountItem>('get_inventory_count_item', { id });
}

/**
 * 获取库存盘点明细列表
 */
export async function listInventoryCountItems(countId: number): Promise<InventoryCountItem[]> {
  return invoke<InventoryCountItem[]>('list_inventory_count_items', { countId });
}

/**
 * 更新库存盘点明细状态
 */
export async function updateInventoryCountItemStatus(id: number, status: string): Promise<InventoryCountItem> {
  return invoke<InventoryCountItem>('update_inventory_count_item_status', { id, status });
}

// ==================== 库存调拨 API ====================

/**
 * 创建库存调拨单
 */
export async function createInventoryTransfer(input: InventoryTransferInput): Promise<InventoryTransfer> {
  return invoke<InventoryTransfer>('create_inventory_transfer', { input });
}

/**
 * 获取库存调拨单详情
 */
export async function getInventoryTransfer(id: number): Promise<InventoryTransfer> {
  return invoke<InventoryTransfer>('get_inventory_transfer', { id });
}

/**
 * 获取库存调拨单列表
 */
export async function listInventoryTransfers(params?: InventoryTransferListParams): Promise<InventoryTransfer[]> {
  return invoke<InventoryTransfer[]>('list_inventory_transfers', {
    fromWarehouseId: params?.fromWarehouseId ?? null,
    toWarehouseId: params?.toWarehouseId ?? null,
    status: params?.status ?? null,
  });
}

/**
 * 更新库存调拨单状态
 */
export async function updateInventoryTransferStatus(id: number, status: string, operatorId?: number | null): Promise<InventoryTransfer> {
  return invoke<InventoryTransfer>('update_inventory_transfer_status', { id, status, operatorId });
}

/**
 * 删除库存调拨单
 */
export async function deleteInventoryTransfer(id: number): Promise<boolean> {
  return invoke<boolean>('delete_inventory_transfer', { id });
}

// ==================== 库存调拨明细 API ====================

/**
 * 创建库存调拨明细
 */
export async function createInventoryTransferItem(input: InventoryTransferItemInput): Promise<InventoryTransferItem> {
  return invoke<InventoryTransferItem>('create_inventory_transfer_item', { input });
}

/**
 * 获取库存调拨明细详情
 */
export async function getInventoryTransferItem(id: number): Promise<InventoryTransferItem> {
  return invoke<InventoryTransferItem>('get_inventory_transfer_item', { id });
}

/**
 * 获取库存调拨明细列表
 */
export async function listInventoryTransferItems(transferId: number): Promise<InventoryTransferItem[]> {
  return invoke<InventoryTransferItem[]>('list_inventory_transfer_items', { transferId });
}

// ==================== 库存统计 API ====================

/**
 * 获取库存汇总统计
 */
export async function getInventorySummary(warehouseId?: number | null): Promise<InventorySummary> {
  return invoke<InventorySummary>('get_inventory_summary', { warehouseId });
}

/**
 * 获取低库存产品列表
 */
export async function getLowStockProducts(warehouseId?: number | null): Promise<LowStockProduct[]> {
  return invoke<LowStockProduct[]>('get_low_stock_products', { warehouseId });
}

// ==================== 工具函数 ====================

/**
 * 快速创建低库存预警
 */
export async function setupLowStockAlert(productId: number, minQuantity: number, warehouseId?: number | null): Promise<InventoryAlert> {
  return createInventoryAlert({
    productId,
    warehouseId,
    minQuantity,
    alertEnabled: true,
  });
}

/**
 * 开始盘点
 */
export async function startInventoryCount(countId: number, operatorId?: number | null): Promise<InventoryCount> {
  return updateInventoryCountStatus(countId, 'in_progress', operatorId);
}

/**
 * 完成盘点
 */
export async function completeInventoryCount(countId: number, operatorId?: number | null): Promise<InventoryCount> {
  return updateInventoryCountStatus(countId, 'completed', operatorId);
}

/**
 * 取消盘点
 */
export async function cancelInventoryCount(countId: number, operatorId?: number | null): Promise<InventoryCount> {
  return updateInventoryCountStatus(countId, 'cancelled', operatorId);
}

/**
 * 发货调拨
 */
export async function shipInventoryTransfer(transferId: number, operatorId?: number | null): Promise<InventoryTransfer> {
  return updateInventoryTransferStatus(transferId, 'in_transit', operatorId);
}

/**
 * 完成调拨
 */
export async function completeInventoryTransfer(transferId: number, operatorId?: number | null): Promise<InventoryTransfer> {
  return updateInventoryTransferStatus(transferId, 'completed', operatorId);
}

/**
 * 取消调拨
 */
export async function cancelInventoryTransfer(transferId: number, operatorId?: number | null): Promise<InventoryTransfer> {
  return updateInventoryTransferStatus(transferId, 'cancelled', operatorId);
}
