// 产品管理模块 Zustand Store

import { create } from 'zustand';
import type {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  ProductListParams,
  ProductCategory,
  ProductCategoryCreateInput,
  ProductInventory,
  InventoryTransaction,
  Warehouse,
  WarehouseCreateInput,
} from '../types/product';
import * as productService from '../services/productService';

interface ProductState {
  // 产品列表
  products: Product[];
  productTotal: number;
  productsLoading: boolean;
  productsError: string | null;
  
  // 当前产品
  currentProduct: Product | null;
  
  // 产品分类
  categories: ProductCategory[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  
  // 库存
  inventory: ProductInventory[];
  inventoryLoading: boolean;
  inventoryError: string | null;
  
  // 库存流水
  transactions: InventoryTransaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  
  // 仓库
  warehouses: Warehouse[];
  warehousesLoading: boolean;
  warehousesError: string | null;
  
  // 操作状态
  operationLoading: boolean;
  operationError: string | null;
  
  // Actions - 产品 CRUD
  fetchProducts: (params?: ProductListParams) => Promise<void>;
  fetchProduct: (id: number) => Promise<Product>;
  createProduct: (input: ProductCreateInput) => Promise<Product>;
  updateProduct: (id: number, input: ProductUpdateInput) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  
  // Actions - 分类
  fetchCategories: () => Promise<void>;
  createCategory: (input: ProductCategoryCreateInput) => Promise<ProductCategory>;
  updateCategory: (id: number, input: Partial<ProductCategoryCreateInput>) => Promise<ProductCategory>;
  deleteCategory: (id: number) => Promise<void>;
  
  // Actions - 库存
  fetchInventory: (warehouseId?: number | null) => Promise<void>;
  getInventory: (productId: number, warehouseId?: number | null) => Promise<ProductInventory | null>;
  updateInventoryQuantity: (id: number, quantity: number, reservedQuantity?: number) => Promise<ProductInventory>;
  stockIn: (productId: number, quantity: number, warehouseId: number | null, reason?: string, notes?: string) => Promise<InventoryTransaction>;
  stockOut: (productId: number, quantity: number, warehouseId: number | null, reason?: string, notes?: string) => Promise<InventoryTransaction>;
  adjustInventory: (productId: number, quantity: number, warehouseId: number | null, reason: string, notes?: string) => Promise<InventoryTransaction>;
  
  // Actions - 库存流水
  fetchTransactions: (productId?: number | null) => Promise<void>;
  
  // Actions - 仓库
  fetchWarehouses: () => Promise<void>;
  createWarehouse: (input: WarehouseCreateInput) => Promise<Warehouse>;
  updateWarehouse: (id: number, input: Partial<WarehouseCreateInput> & { status?: string }) => Promise<Warehouse>;
  deleteWarehouse: (id: number) => Promise<void>;
  
  // Actions - 工具
  clearError: () => void;
  setCurrentProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial State
  products: [],
  productTotal: 0,
  productsLoading: false,
  productsError: null,
  
  currentProduct: null,
  
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  
  inventory: [],
  inventoryLoading: false,
  inventoryError: null,
  
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  
  warehouses: [],
  warehousesLoading: false,
  warehousesError: null,
  
  operationLoading: false,
  operationError: null,
  
  // Actions - 产品 CRUD
  fetchProducts: async (params?: ProductListParams) => {
    set({ productsLoading: true, productsError: null });
    try {
      const products = await productService.listProducts(params || {});
      set({
        products,
        productTotal: products.length,
        productsLoading: false,
      });
    } catch (error) {
      set({
        productsLoading: false,
        productsError: error instanceof Error ? error.message : '获取产品列表失败',
      });
    }
  },
  
  fetchProduct: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const product = await productService.getProduct(id);
      set({ currentProduct: product, operationLoading: false });
      return product;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取产品详情失败',
      });
      throw error;
    }
  },
  
  createProduct: async (input: ProductCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const product = await productService.createProduct(input);
      set({ operationLoading: false });
      // 刷新产品列表
      get().fetchProducts();
      return product;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建产品失败',
      });
      throw error;
    }
  },
  
  updateProduct: async (id: number, input: ProductUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const product = await productService.updateProduct(id, input);
      set({ operationLoading: false, currentProduct: product });
      // 刷新产品列表
      get().fetchProducts();
      return product;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新产品失败',
      });
      throw error;
    }
  },
  
  deleteProduct: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await productService.deleteProduct(id);
      set({ operationLoading: false });
      // 刷新产品列表
      get().fetchProducts();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除产品失败',
      });
      throw error;
    }
  },
  
  // Actions - 分类
  fetchCategories: async () => {
    set({ categoriesLoading: true, categoriesError: null });
    try {
      const categories = await productService.listCategories();
      set({ categories, categoriesLoading: false });
    } catch (error) {
      set({
        categoriesLoading: false,
        categoriesError: error instanceof Error ? error.message : '获取分类列表失败',
      });
    }
  },
  
  createCategory: async (input: ProductCategoryCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const category = await productService.createCategory(input);
      set({ operationLoading: false });
      // 刷新分类列表
      get().fetchCategories();
      return category;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建分类失败',
      });
      throw error;
    }
  },
  
  updateCategory: async (id: number, input: Partial<ProductCategoryCreateInput>) => {
    set({ operationLoading: true, operationError: null });
    try {
      const category = await productService.updateCategory(id, input);
      set({ operationLoading: false });
      // 刷新分类列表
      get().fetchCategories();
      return category;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新分类失败',
      });
      throw error;
    }
  },
  
  deleteCategory: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await productService.deleteCategory(id);
      set({ operationLoading: false });
      // 刷新分类列表
      get().fetchCategories();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除分类失败',
      });
      throw error;
    }
  },
  
  // Actions - 库存
  fetchInventory: async (warehouseId?: number | null) => {
    set({ inventoryLoading: true, inventoryError: null });
    try {
      const inventory = await productService.listInventory(warehouseId);
      set({ inventory, inventoryLoading: false });
    } catch (error) {
      set({
        inventoryLoading: false,
        inventoryError: error instanceof Error ? error.message : '获取库存列表失败',
      });
    }
  },
  
  getInventory: async (productId: number, warehouseId?: number | null) => {
    try {
      return await productService.getInventory(productId, warehouseId);
    } catch (error) {
      console.error('获取库存失败:', error);
      return null;
    }
  },
  
  updateInventoryQuantity: async (id: number, quantity: number, reservedQuantity?: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const inventory = await productService.updateInventoryQuantity(id, quantity, reservedQuantity);
      set({ operationLoading: false });
      // 刷新库存列表
      get().fetchInventory();
      return inventory;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新库存失败',
      });
      throw error;
    }
  },
  
  stockIn: async (productId: number, quantity: number, warehouseId: number | null, reason?: string, notes?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const transaction = await productService.stockIn(productId, quantity, warehouseId, reason, notes);
      set({ operationLoading: false });
      // 刷新库存和流水
      get().fetchInventory(warehouseId);
      get().fetchTransactions(productId);
      return transaction;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '入库失败',
      });
      throw error;
    }
  },
  
  stockOut: async (productId: number, quantity: number, warehouseId: number | null, reason?: string, notes?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const transaction = await productService.stockOut(productId, quantity, warehouseId, reason, notes);
      set({ operationLoading: false });
      // 刷新库存和流水
      get().fetchInventory(warehouseId);
      get().fetchTransactions(productId);
      return transaction;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '出库失败',
      });
      throw error;
    }
  },
  
  adjustInventory: async (productId: number, quantity: number, warehouseId: number | null, reason: string, notes?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const transaction = await productService.adjustInventory(productId, quantity, warehouseId, reason, notes);
      set({ operationLoading: false });
      // 刷新库存和流水
      get().fetchInventory(warehouseId);
      get().fetchTransactions(productId);
      return transaction;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '库存调整失败',
      });
      throw error;
    }
  },
  
  // Actions - 库存流水
  fetchTransactions: async (productId?: number | null) => {
    set({ transactionsLoading: true, transactionsError: null });
    try {
      const transactions = await productService.listTransactions(productId);
      set({ transactions, transactionsLoading: false });
    } catch (error) {
      set({
        transactionsLoading: false,
        transactionsError: error instanceof Error ? error.message : '获取库存流水失败',
      });
    }
  },
  
  // Actions - 仓库
  fetchWarehouses: async () => {
    set({ warehousesLoading: true, warehousesError: null });
    try {
      const warehouses = await productService.listWarehouses();
      set({ warehouses, warehousesLoading: false });
    } catch (error) {
      set({
        warehousesLoading: false,
        warehousesError: error instanceof Error ? error.message : '获取仓库列表失败',
      });
    }
  },
  
  createWarehouse: async (input: WarehouseCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const warehouse = await productService.createWarehouse(input);
      set({ operationLoading: false });
      // 刷新仓库列表
      get().fetchWarehouses();
      return warehouse;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建仓库失败',
      });
      throw error;
    }
  },
  
  updateWarehouse: async (id: number, input: Partial<WarehouseCreateInput> & { status?: string }) => {
    set({ operationLoading: true, operationError: null });
    try {
      const warehouse = await productService.updateWarehouse(id, input);
      set({ operationLoading: false });
      // 刷新仓库列表
      get().fetchWarehouses();
      return warehouse;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新仓库失败',
      });
      throw error;
    }
  },
  
  deleteWarehouse: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await productService.deleteWarehouse(id);
      set({ operationLoading: false });
      // 刷新仓库列表
      get().fetchWarehouses();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除仓库失败',
      });
      throw error;
    }
  },
  
  // Actions - 工具
  clearError: () => {
    set({
      operationError: null,
      productsError: null,
      categoriesError: null,
      inventoryError: null,
      transactionsError: null,
      warehousesError: null,
    });
  },
  
  setCurrentProduct: (product: Product | null) => {
    set({ currentProduct: product });
  },
}));

// 导出选择器
export const selectProducts = (state: ProductState) => state.products;
export const selectCurrentProduct = (state: ProductState) => state.currentProduct;
export const selectCategories = (state: ProductState) => state.categories;
export const selectInventory = (state: ProductState) => state.inventory;
export const selectWarehouses = (state: ProductState) => state.warehouses;
export const selectOperationLoading = (state: ProductState) => state.operationLoading;
export const selectOperationError = (state: ProductState) => state.operationError;
