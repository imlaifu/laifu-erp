// 订单管理模块 Zustand Store

import { create } from 'zustand';
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
} from '../types/order';
import * as orderService from '../services/orderService';

interface OrderState {
  // 客户
  customers: Customer[];
  customersLoading: boolean;
  customersError: string | null;
  currentCustomer: Customer | null;
  
  // 供应商
  suppliers: Supplier[];
  suppliersLoading: boolean;
  suppliersError: string | null;
  currentSupplier: Supplier | null;
  
  // 销售订单
  salesOrders: SalesOrder[];
  salesOrdersLoading: boolean;
  salesOrdersError: string | null;
  currentSalesOrder: SalesOrder | null;
  currentSalesOrderItems: SalesOrderItem[];
  
  // 采购订单
  purchaseOrders: PurchaseOrder[];
  purchaseOrdersLoading: boolean;
  purchaseOrdersError: string | null;
  currentPurchaseOrder: PurchaseOrder | null;
  currentPurchaseOrderItems: PurchaseOrderItem[];
  
  // 订单状态历史
  orderStatusHistory: OrderStatusHistory[];
  orderStatusHistoryLoading: boolean;
  
  // 操作状态
  operationLoading: boolean;
  operationError: string | null;
  
  // Actions - 客户 CRUD
  fetchCustomers: (limit?: number, offset?: number, status?: string | null, level?: string | null, search?: string | null) => Promise<void>;
  fetchCustomer: (id: number) => Promise<Customer>;
  createCustomer: (input: CustomerCreateInput) => Promise<Customer>;
  updateCustomer: (id: number, input: CustomerUpdateInput) => Promise<Customer>;
  deleteCustomer: (id: number) => Promise<void>;
  
  // Actions - 供应商 CRUD
  fetchSuppliers: (limit?: number, offset?: number, status?: string | null, search?: string | null) => Promise<void>;
  fetchSupplier: (id: number) => Promise<Supplier>;
  createSupplier: (input: SupplierCreateInput) => Promise<Supplier>;
  updateSupplier: (id: number, input: SupplierUpdateInput) => Promise<Supplier>;
  deleteSupplier: (id: number) => Promise<void>;
  
  // Actions - 销售订单 CRUD
  fetchSalesOrders: (params: SalesOrderListParams) => Promise<void>;
  fetchSalesOrder: (id: number) => Promise<SalesOrder>;
  createSalesOrder: (input: SalesOrderCreateInput) => Promise<SalesOrder>;
  updateSalesOrder: (id: number, input: SalesOrderUpdateInput) => Promise<SalesOrder>;
  deleteSalesOrder: (id: number) => Promise<void>;
  fetchSalesOrderItems: (orderId: number) => Promise<void>;
  
  // Actions - 销售订单操作
  confirmSalesOrder: (id: number, reason?: string) => Promise<SalesOrder>;
  shipSalesOrder: (id: number, reason?: string) => Promise<SalesOrder>;
  completeSalesOrder: (id: number, reason?: string) => Promise<SalesOrder>;
  cancelSalesOrder: (id: number, reason?: string) => Promise<SalesOrder>;
  
  // Actions - 采购订单 CRUD
  fetchPurchaseOrders: (params: PurchaseOrderListParams) => Promise<void>;
  fetchPurchaseOrder: (id: number) => Promise<PurchaseOrder>;
  createPurchaseOrder: (input: PurchaseOrderCreateInput) => Promise<PurchaseOrder>;
  updatePurchaseOrder: (id: number, input: PurchaseOrderUpdateInput) => Promise<PurchaseOrder>;
  deletePurchaseOrder: (id: number) => Promise<void>;
  fetchPurchaseOrderItems: (orderId: number) => Promise<void>;
  
  // Actions - 采购订单操作
  confirmPurchaseOrder: (id: number, reason?: string) => Promise<PurchaseOrder>;
  receivePurchaseOrder: (id: number, reason?: string) => Promise<PurchaseOrder>;
  cancelPurchaseOrder: (id: number, reason?: string) => Promise<PurchaseOrder>;
  
  // Actions - 订单状态历史
  fetchOrderStatusHistory: (orderType: 'sales' | 'purchase', orderId: number) => Promise<void>;
  
  // Actions - 工具
  clearError: () => void;
  setCurrentCustomer: (customer: Customer | null) => void;
  setCurrentSupplier: (supplier: Supplier | null) => void;
  setCurrentSalesOrder: (order: SalesOrder | null) => void;
  setCurrentPurchaseOrder: (order: PurchaseOrder | null) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // Initial State - 客户
  customers: [],
  customersLoading: false,
  customersError: null,
  currentCustomer: null,
  
  // Initial State - 供应商
  suppliers: [],
  suppliersLoading: false,
  suppliersError: null,
  currentSupplier: null,
  
  // Initial State - 销售订单
  salesOrders: [],
  salesOrdersLoading: false,
  salesOrdersError: null,
  currentSalesOrder: null,
  currentSalesOrderItems: [],
  
  // Initial State - 采购订单
  purchaseOrders: [],
  purchaseOrdersLoading: false,
  purchaseOrdersError: null,
  currentPurchaseOrder: null,
  currentPurchaseOrderItems: [],
  
  // Initial State - 订单状态历史
  orderStatusHistory: [],
  orderStatusHistoryLoading: false,
  
  // Initial State - 操作状态
  operationLoading: false,
  operationError: null,
  
  // Actions - 客户 CRUD
  fetchCustomers: async (limit = 50, offset = 0, status?: string | null, level?: string | null, search?: string | null) => {
    set({ customersLoading: true, customersError: null });
    try {
      const customers = await orderService.listCustomers(limit, offset, status, level, search);
      set({ customers, customersLoading: false });
    } catch (error) {
      set({
        customersLoading: false,
        customersError: error instanceof Error ? error.message : '获取客户列表失败',
      });
    }
  },
  
  fetchCustomer: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const customer = await orderService.getCustomer(id);
      set({ currentCustomer: customer, operationLoading: false });
      return customer;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取客户详情失败',
      });
      throw error;
    }
  },
  
  createCustomer: async (input: CustomerCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const customer = await orderService.createCustomer(input);
      set({ operationLoading: false, currentCustomer: customer });
      // 刷新客户列表
      get().fetchCustomers();
      return customer;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建客户失败',
      });
      throw error;
    }
  },
  
  updateCustomer: async (id: number, input: CustomerUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const customer = await orderService.updateCustomer(id, input);
      set({ operationLoading: false, currentCustomer: customer });
      // 刷新客户列表
      get().fetchCustomers();
      return customer;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新客户失败',
      });
      throw error;
    }
  },
  
  deleteCustomer: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await orderService.deleteCustomer(id);
      set({ operationLoading: false });
      // 刷新客户列表
      get().fetchCustomers();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除客户失败',
      });
      throw error;
    }
  },
  
  // Actions - 供应商 CRUD
  fetchSuppliers: async (limit = 50, offset = 0, status?: string | null, search?: string | null) => {
    set({ suppliersLoading: true, suppliersError: null });
    try {
      const suppliers = await orderService.listSuppliers(limit, offset, status, search);
      set({ suppliers, suppliersLoading: false });
    } catch (error) {
      set({
        suppliersLoading: false,
        suppliersError: error instanceof Error ? error.message : '获取供应商列表失败',
      });
    }
  },
  
  fetchSupplier: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const supplier = await orderService.getSupplier(id);
      set({ currentSupplier: supplier, operationLoading: false });
      return supplier;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取供应商详情失败',
      });
      throw error;
    }
  },
  
  createSupplier: async (input: SupplierCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const supplier = await orderService.createSupplier(input);
      set({ operationLoading: false, currentSupplier: supplier });
      // 刷新供应商列表
      get().fetchSuppliers();
      return supplier;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建供应商失败',
      });
      throw error;
    }
  },
  
  updateSupplier: async (id: number, input: SupplierUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const supplier = await orderService.updateSupplier(id, input);
      set({ operationLoading: false, currentSupplier: supplier });
      // 刷新供应商列表
      get().fetchSuppliers();
      return supplier;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新供应商失败',
      });
      throw error;
    }
  },
  
  deleteSupplier: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await orderService.deleteSupplier(id);
      set({ operationLoading: false });
      // 刷新供应商列表
      get().fetchSuppliers();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除供应商失败',
      });
      throw error;
    }
  },
  
  // Actions - 销售订单 CRUD
  fetchSalesOrders: async (params: SalesOrderListParams) => {
    set({ salesOrdersLoading: true, salesOrdersError: null });
    try {
      const salesOrders = await orderService.listSalesOrders(params);
      set({ salesOrders, salesOrdersLoading: false });
    } catch (error) {
      set({
        salesOrdersLoading: false,
        salesOrdersError: error instanceof Error ? error.message : '获取销售订单列表失败',
      });
    }
  },
  
  fetchSalesOrder: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.getSalesOrder(id);
      set({ currentSalesOrder: order, operationLoading: false });
      // 获取订单明细
      get().fetchSalesOrderItems(id);
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取销售订单详情失败',
      });
      throw error;
    }
  },
  
  createSalesOrder: async (input: SalesOrderCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.createSalesOrder(input);
      set({ operationLoading: false, currentSalesOrder: order });
      // 刷新销售订单列表
      get().fetchSalesOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建销售订单失败',
      });
      throw error;
    }
  },
  
  updateSalesOrder: async (id: number, input: SalesOrderUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.updateSalesOrder(id, input);
      set({ operationLoading: false, currentSalesOrder: order });
      // 刷新销售订单列表
      get().fetchSalesOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新销售订单失败',
      });
      throw error;
    }
  },
  
  deleteSalesOrder: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await orderService.deleteSalesOrder(id);
      set({ operationLoading: false });
      // 刷新销售订单列表
      get().fetchSalesOrders({ limit: 50, offset: 0 });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除销售订单失败',
      });
      throw error;
    }
  },
  
  fetchSalesOrderItems: async (orderId: number) => {
    try {
      const items = await orderService.getSalesOrderItems(orderId);
      set({ currentSalesOrderItems: items });
    } catch (error) {
      console.error('获取销售订单明细失败:', error);
      set({ currentSalesOrderItems: [] });
    }
  },
  
  // Actions - 销售订单操作
  confirmSalesOrder: async (id: number, reason?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.confirmSalesOrder(id, reason);
      set({ operationLoading: false, currentSalesOrder: order });
      get().fetchSalesOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '确认订单失败',
      });
      throw error;
    }
  },
  
  shipSalesOrder: async (id: number, reason?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.shipSalesOrder(id, reason);
      set({ operationLoading: false, currentSalesOrder: order });
      get().fetchSalesOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '发货失败',
      });
      throw error;
    }
  },
  
  completeSalesOrder: async (id: number, reason?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.completeSalesOrder(id, reason);
      set({ operationLoading: false, currentSalesOrder: order });
      get().fetchSalesOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '完成订单失败',
      });
      throw error;
    }
  },
  
  cancelSalesOrder: async (id: number, reason?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.cancelSalesOrder(id, reason);
      set({ operationLoading: false, currentSalesOrder: order });
      get().fetchSalesOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '取消订单失败',
      });
      throw error;
    }
  },
  
  // Actions - 采购订单 CRUD
  fetchPurchaseOrders: async (params: PurchaseOrderListParams) => {
    set({ purchaseOrdersLoading: true, purchaseOrdersError: null });
    try {
      const purchaseOrders = await orderService.listPurchaseOrders(params);
      set({ purchaseOrders, purchaseOrdersLoading: false });
    } catch (error) {
      set({
        purchaseOrdersLoading: false,
        purchaseOrdersError: error instanceof Error ? error.message : '获取采购订单列表失败',
      });
    }
  },
  
  fetchPurchaseOrder: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.getPurchaseOrder(id);
      set({ currentPurchaseOrder: order, operationLoading: false });
      // 获取订单明细
      get().fetchPurchaseOrderItems(id);
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取采购订单详情失败',
      });
      throw error;
    }
  },
  
  createPurchaseOrder: async (input: PurchaseOrderCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.createPurchaseOrder(input);
      set({ operationLoading: false, currentPurchaseOrder: order });
      // 刷新采购订单列表
      get().fetchPurchaseOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建采购订单失败',
      });
      throw error;
    }
  },
  
  updatePurchaseOrder: async (id: number, input: PurchaseOrderUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.updatePurchaseOrder(id, input);
      set({ operationLoading: false, currentPurchaseOrder: order });
      // 刷新采购订单列表
      get().fetchPurchaseOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新采购订单失败',
      });
      throw error;
    }
  },
  
  deletePurchaseOrder: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await orderService.deletePurchaseOrder(id);
      set({ operationLoading: false });
      // 刷新采购订单列表
      get().fetchPurchaseOrders({ limit: 50, offset: 0 });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除采购订单失败',
      });
      throw error;
    }
  },
  
  fetchPurchaseOrderItems: async (orderId: number) => {
    try {
      const items = await orderService.getPurchaseOrderItems(orderId);
      set({ currentPurchaseOrderItems: items });
    } catch (error) {
      console.error('获取采购订单明细失败:', error);
      set({ currentPurchaseOrderItems: [] });
    }
  },
  
  // Actions - 采购订单操作
  confirmPurchaseOrder: async (id: number, reason?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.confirmPurchaseOrder(id, reason);
      set({ operationLoading: false, currentPurchaseOrder: order });
      get().fetchPurchaseOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '确认采购订单失败',
      });
      throw error;
    }
  },
  
  receivePurchaseOrder: async (id: number, reason?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.receivePurchaseOrder(id, reason);
      set({ operationLoading: false, currentPurchaseOrder: order });
      get().fetchPurchaseOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '收货失败',
      });
      throw error;
    }
  },
  
  cancelPurchaseOrder: async (id: number, reason?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await orderService.cancelPurchaseOrder(id, reason);
      set({ operationLoading: false, currentPurchaseOrder: order });
      get().fetchPurchaseOrders({ limit: 50, offset: 0 });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '取消采购订单失败',
      });
      throw error;
    }
  },
  
  // Actions - 订单状态历史
  fetchOrderStatusHistory: async (orderType: 'sales' | 'purchase', orderId: number) => {
    set({ orderStatusHistoryLoading: true });
    try {
      const history = await orderService.getOrderStatusHistory(orderType, orderId);
      set({ orderStatusHistory: history, orderStatusHistoryLoading: false });
    } catch (error) {
      set({ orderStatusHistoryLoading: false, orderStatusHistory: [] });
      console.error('获取订单状态历史失败:', error);
    }
  },
  
  // Actions - 工具
  clearError: () => {
    set({
      operationError: null,
      customersError: null,
      suppliersError: null,
      salesOrdersError: null,
      purchaseOrdersError: null,
    });
  },
  
  setCurrentCustomer: (customer: Customer | null) => {
    set({ currentCustomer: customer });
  },
  
  setCurrentSupplier: (supplier: Supplier | null) => {
    set({ currentSupplier: supplier });
  },
  
  setCurrentSalesOrder: (order: SalesOrder | null) => {
    set({ currentSalesOrder: order });
  },
  
  setCurrentPurchaseOrder: (order: PurchaseOrder | null) => {
    set({ currentPurchaseOrder: order });
  },
}));

// 导出选择器
export const selectCustomers = (state: OrderState) => state.customers;
export const selectSuppliers = (state: OrderState) => state.suppliers;
export const selectSalesOrders = (state: OrderState) => state.salesOrders;
export const selectPurchaseOrders = (state: OrderState) => state.purchaseOrders;
export const selectCurrentSalesOrder = (state: OrderState) => state.currentSalesOrder;
export const selectCurrentPurchaseOrder = (state: OrderState) => state.currentPurchaseOrder;
export const selectOperationLoading = (state: OrderState) => state.operationLoading;
export const selectOperationError = (state: OrderState) => state.operationError;
