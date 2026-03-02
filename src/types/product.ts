// 产品管理模块 TypeScript 类型定义

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string | null;
  categoryId?: number | null;
  brand?: string | null;
  model?: string | null;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  wholesalePrice: number;
  minStock: number;
  maxStock: number;
  status: 'active' | 'inactive' | 'discontinued';
  images: string[];
  attributes: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateInput {
  sku: string;
  name: string;
  description?: string | null;
  categoryId?: number | null;
  brand?: string | null;
  model?: string | null;
  unit?: string;
  costPrice?: number;
  sellingPrice?: number;
  wholesalePrice?: number;
  minStock?: number;
  maxStock?: number;
  images?: string[];
  attributes?: Record<string, unknown>;
}

export interface ProductUpdateInput {
  sku?: string;
  name?: string;
  description?: string | null;
  categoryId?: number | null;
  brand?: string | null;
  model?: string | null;
  unit?: string;
  costPrice?: number;
  sellingPrice?: number;
  wholesalePrice?: number;
  minStock?: number;
  maxStock?: number;
  status?: 'active' | 'inactive' | 'discontinued';
  images?: string[];
  attributes?: Record<string, unknown>;
}

export interface ProductCategory {
  id: number;
  name: string;
  parentId?: number | null;
  description?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategoryCreateInput {
  name: string;
  parentId?: number | null;
  description?: string | null;
  sortOrder?: number;
}

export interface ProductInventory {
  id: number;
  productId: number;
  warehouseId?: number | null;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastStockCheck?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: number;
  productId: number;
  warehouseId?: number | null;
  transactionType: 'in' | 'out' | 'adjustment' | 'transfer' | 'return';
  quantity: number;
  beforeQuantity: number;
  afterQuantity: number;
  referenceType?: string | null;
  referenceId?: number | null;
  reason?: string | null;
  operatorId?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface InventoryTransactionInput {
  productId: number;
  warehouseId?: number | null;
  transactionType: 'in' | 'out' | 'adjustment' | 'transfer' | 'return';
  quantity: number;
  reason?: string | null;
  referenceType?: string | null;
  referenceId?: number | null;
  notes?: string | null;
  operatorId?: number | null;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  address?: string | null;
  managerId?: number | null;
  phone?: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseCreateInput {
  name: string;
  code: string;
  address?: string | null;
  managerId?: number | null;
  phone?: string | null;
}

export interface ProductListParams {
  limit?: number;
  offset?: number;
  categoryId?: number;
  status?: 'active' | 'inactive' | 'discontinued';
  search?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export interface InventoryAdjustmentInput {
  productId: number;
  warehouseId?: number | null;
  quantity: number;
  reason: string;
  notes?: string;
}
