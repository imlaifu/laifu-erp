// 产品管理模块 API 服务

import { invoke } from '@tauri-apps/api/core';
import type {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  ProductListParams,
  ProductCategory,
  ProductCategoryCreateInput,
  ProductInventory,
  InventoryTransaction,
  InventoryTransactionInput,
  Warehouse,
  WarehouseCreateInput,
} from '../types/product';

// ==================== 产品 API ====================

/**
 * 创建产品
 */
export async function createProduct(input: ProductCreateInput): Promise<Product> {
  return invoke<Product>('create_product', { input });
}

/**
 * 获取产品详情
 */
export async function getProduct(id: number): Promise<Product> {
  return invoke<Product>('get_product', { id });
}

/**
 * 获取产品列表
 */
export async function listProducts(params: ProductListParams): Promise<Product[]> {
  return invoke<Product[]>('list_products', { params });
}

/**
 * 更新产品
 */
export async function updateProduct(id: number, input: ProductUpdateInput): Promise<Product> {
  return invoke<Product>('update_product', { id, input });
}

/**
 * 删除产品 (软删除)
 */
export async function deleteProduct(id: number): Promise<boolean> {
  return invoke<boolean>('delete_product', { id });
}

// ==================== 产品分类 API ====================

/**
 * 创建产品分类
 */
export async function createCategory(input: ProductCategoryCreateInput): Promise<ProductCategory> {
  return invoke<ProductCategory>('create_category', { input });
}

/**
 * 获取产品分类详情
 */
export async function getCategory(id: number): Promise<ProductCategory> {
  return invoke<ProductCategory>('get_category', { id });
}

/**
 * 获取产品分类列表
 */
export async function listCategories(): Promise<ProductCategory[]> {
  return invoke<ProductCategory[]>('list_categories');
}

/**
 * 更新产品分类
 */
export async function updateCategory(id: number, input: Partial<ProductCategoryCreateInput>): Promise<ProductCategory> {
  return invoke<ProductCategory>('update_category', { id, input });
}

/**
 * 删除产品分类
 */
export async function deleteCategory(id: number): Promise<boolean> {
  return invoke<boolean>('delete_category', { id });
}

// ==================== 库存管理 API ====================

/**
 * 获取产品库存
 */
export async function getInventory(productId: number, warehouseId?: number | null): Promise<ProductInventory | null> {
  return invoke<ProductInventory | null>('get_inventory', { productId, warehouseId });
}

/**
 * 获取库存列表
 */
export async function listInventory(warehouseId?: number | null): Promise<ProductInventory[]> {
  return invoke<ProductInventory[]>('list_inventory', { warehouseId });
}

/**
 * 创建库存记录
 */
export async function createInventory(productId: number, warehouseId: number | null, quantity: number): Promise<ProductInventory> {
  return invoke<ProductInventory>('create_inventory', { productId, warehouseId, quantity });
}

/**
 * 更新库存数量
 */
export async function updateInventoryQuantity(id: number, quantity: number, reservedQuantity?: number): Promise<ProductInventory> {
  return invoke<ProductInventory>('update_inventory_quantity', { id, quantity, reservedQuantity });
}

// ==================== 库存流水 API ====================

/**
 * 创建库存流水
 */
export async function createInventoryTransaction(input: InventoryTransactionInput): Promise<InventoryTransaction> {
  return invoke<InventoryTransaction>('create_inventory_transaction', { input });
}

/**
 * 获取库存流水详情
 */
export async function getTransaction(id: number): Promise<InventoryTransaction> {
  return invoke<InventoryTransaction>('get_transaction', { id });
}

/**
 * 获取库存流水列表
 */
export async function listTransactions(productId?: number | null, limit: number = 50, offset: number = 0): Promise<InventoryTransaction[]> {
  return invoke<InventoryTransaction[]>('list_transactions', { productId, limit, offset });
}

// ==================== 仓库管理 API ====================

/**
 * 创建仓库
 */
export async function createWarehouse(input: WarehouseCreateInput): Promise<Warehouse> {
  return invoke<Warehouse>('create_warehouse', { input });
}

/**
 * 获取仓库详情
 */
export async function getWarehouse(id: number): Promise<Warehouse> {
  return invoke<Warehouse>('get_warehouse', { id });
}

/**
 * 获取仓库列表
 */
export async function listWarehouses(): Promise<Warehouse[]> {
  return invoke<Warehouse[]>('list_warehouses');
}

/**
 * 更新仓库
 */
export async function updateWarehouse(id: number, input: Partial<WarehouseCreateInput> & { status?: string }): Promise<Warehouse> {
  return invoke<Warehouse>('update_warehouse', { id, input });
}

/**
 * 删除仓库
 */
export async function deleteWarehouse(id: number): Promise<boolean> {
  return invoke<boolean>('delete_warehouse', { id });
}

// ==================== 工具函数 ====================

/**
 * 入库操作
 */
export async function stockIn(productId: number, quantity: number, warehouseId: number | null, reason?: string, notes?: string): Promise<InventoryTransaction> {
  return createInventoryTransaction({
    productId,
    warehouseId,
    transactionType: 'in',
    quantity,
    reason,
    notes,
  });
}

/**
 * 出库操作
 */
export async function stockOut(productId: number, quantity: number, warehouseId: number | null, reason?: string, notes?: string): Promise<InventoryTransaction> {
  return createInventoryTransaction({
    productId,
    warehouseId,
    transactionType: 'out',
    quantity,
    reason,
    notes,
  });
}

/**
 * 库存调整
 */
export async function adjustInventory(productId: number, quantity: number, warehouseId: number | null, reason: string, notes?: string): Promise<InventoryTransaction> {
  return createInventoryTransaction({
    productId,
    warehouseId,
    transactionType: 'adjustment',
    quantity,
    reason,
    notes,
  });
}

/**
 * 获取产品可用库存
 */
export async function getAvailableQuantity(productId: number, warehouseId?: number | null): Promise<number> {
  const inventory = await getInventory(productId, warehouseId);
  return inventory?.availableQuantity ?? 0;
}
