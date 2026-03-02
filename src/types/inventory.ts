// 库存管理模块 TypeScript 类型定义

// ==================== 库存预警 ====================

export interface InventoryAlert {
  id: number;
  productId: number;
  warehouseId?: number | null;
  minQuantity: number;
  maxQuantity: number;
  alertEnabled: boolean;
  lastAlertAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAlertInput {
  productId: number;
  warehouseId?: number | null;
  minQuantity?: number;
  maxQuantity?: number;
  alertEnabled?: boolean;
}

export interface InventoryAlertWithProduct {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  warehouseId?: number | null;
  warehouseName?: string | null;
  minQuantity: number;
  maxQuantity: number;
  currentQuantity: number;
  alertEnabled: boolean;
  alertStatus: 'out_of_stock' | 'low' | 'high' | 'normal';
  lastAlertAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== 库存盘点 ====================

export interface InventoryCount {
  id: number;
  warehouseId?: number | null;
  countDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  operatorId?: number | null;
  totalItems: number;
  countedItems: number;
  discrepancyCount: number;
  notes?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCountInput {
  warehouseId?: number | null;
  countDate?: string;
  notes?: string | null;
}

export interface InventoryCountItem {
  id: number;
  countId: number;
  productId: number;
  warehouseId?: number | null;
  systemQuantity: number;
  countedQuantity?: number | null;
  discrepancy?: number | null;
  status: 'pending' | 'counted' | 'verified' | 'adjusted';
  notes?: string | null;
  countedAt?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCountItemInput {
  countId: number;
  productId: number;
  warehouseId?: number | null;
  countedQuantity: number;
  notes?: string | null;
}

// ==================== 库存调拨 ====================

export interface InventoryTransfer {
  id: number;
  transferNo: string;
  fromWarehouseId: number;
  toWarehouseId: number;
  fromWarehouseName: string;
  toWarehouseName: string;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  operatorId?: number | null;
  totalItems: number;
  shippedAt?: string | null;
  receivedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransferInput {
  fromWarehouseId: number;
  toWarehouseId: number;
  notes?: string | null;
}

export interface InventoryTransferItem {
  id: number;
  transferId: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  shippedQuantity?: number | null;
  receivedQuantity?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransferItemInput {
  transferId: number;
  productId: number;
  quantity: number;
  notes?: string | null;
}

// ==================== 库存统计 ====================

export interface InventorySummary {
  warehouseId?: number | null;
  warehouseName?: string | null;
  totalProducts: number;
  totalQuantity: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface LowStockProduct {
  productId: number;
  productName: string;
  productSku: string;
  warehouseId?: number | null;
  warehouseName?: string | null;
  currentQuantity: number;
  minQuantity: number;
  alertThreshold: number;
}

// ==================== 查询参数 ====================

export interface InventoryAlertListParams {
  warehouseId?: number | null;
  alertStatus?: 'out_of_stock' | 'low' | 'high' | 'normal';
}

export interface InventoryCountListParams {
  warehouseId?: number | null;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export interface InventoryTransferListParams {
  fromWarehouseId?: number | null;
  toWarehouseId?: number | null;
  status?: 'pending' | 'in_transit' | 'completed' | 'cancelled';
}
