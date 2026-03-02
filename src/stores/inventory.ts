// 库存管理模块 Zustand Store

import { create } from 'zustand';
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
import * as inventoryService from '../services/inventoryService';

interface InventoryState {
  // 库存预警
  alerts: InventoryAlertWithProduct[];
  alertsLoading: boolean;
  alertsError: string | null;
  
  // 库存盘点
  counts: InventoryCount[];
  countsLoading: boolean;
  countsError: string | null;
  currentCount: InventoryCount | null;
  countItems: InventoryCountItem[];
  countItemsLoading: boolean;
  
  // 库存调拨
  transfers: InventoryTransfer[];
  transfersLoading: boolean;
  transfersError: string | null;
  currentTransfer: InventoryTransfer | null;
  transferItems: InventoryTransferItem[];
  transferItemsLoading: boolean;
  
  // 库存统计
  summary: InventorySummary | null;
  summaryLoading: boolean;
  lowStockProducts: LowStockProduct[];
  lowStockLoading: boolean;
  
  // 操作状态
  operationLoading: boolean;
  operationError: string | null;
  
  // Actions - 库存预警
  fetchAlerts: (params?: InventoryAlertListParams) => Promise<void>;
  createAlert: (input: InventoryAlertInput) => Promise<InventoryAlert>;
  updateAlert: (id: number, input: InventoryAlertInput) => Promise<InventoryAlert>;
  deleteAlert: (id: number) => Promise<void>;
  
  // Actions - 库存盘点
  fetchCounts: (params?: InventoryCountListParams) => Promise<void>;
  fetchCount: (id: number) => Promise<InventoryCount>;
  createCount: (input: InventoryCountInput) => Promise<InventoryCount>;
  updateCountStatus: (id: number, status: string, operatorId?: number | null) => Promise<InventoryCount>;
  deleteCount: (id: number) => Promise<void>;
  
  // Actions - 库存盘点明细
  fetchCountItems: (countId: number) => Promise<void>;
  createCountItem: (input: InventoryCountItemInput) => Promise<InventoryCountItem>;
  updateCountItemStatus: (id: number, status: string) => Promise<InventoryCountItem>;
  
  // Actions - 库存调拨
  fetchTransfers: (params?: InventoryTransferListParams) => Promise<void>;
  fetchTransfer: (id: number) => Promise<InventoryTransfer>;
  createTransfer: (input: InventoryTransferInput) => Promise<InventoryTransfer>;
  updateTransferStatus: (id: number, status: string, operatorId?: number | null) => Promise<InventoryTransfer>;
  deleteTransfer: (id: number) => Promise<void>;
  
  // Actions - 库存调拨明细
  fetchTransferItems: (transferId: number) => Promise<void>;
  createTransferItem: (input: InventoryTransferItemInput) => Promise<InventoryTransferItem>;
  
  // Actions - 库存统计
  fetchSummary: (warehouseId?: number | null) => Promise<void>;
  fetchLowStockProducts: (warehouseId?: number | null) => Promise<void>;
  
  // Actions - 工具
  clearError: () => void;
  setCurrentCount: (count: InventoryCount | null) => void;
  setCurrentTransfer: (transfer: InventoryTransfer | null) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  // Initial State
  alerts: [],
  alertsLoading: false,
  alertsError: null,
  
  counts: [],
  countsLoading: false,
  countsError: null,
  currentCount: null,
  countItems: [],
  countItemsLoading: false,
  
  transfers: [],
  transfersLoading: false,
  transfersError: null,
  currentTransfer: null,
  transferItems: [],
  transferItemsLoading: false,
  
  summary: null,
  summaryLoading: false,
  lowStockProducts: [],
  lowStockLoading: false,
  
  operationLoading: false,
  operationError: null,
  
  // Actions - 库存预警
  fetchAlerts: async (params?: InventoryAlertListParams) => {
    set({ alertsLoading: true, alertsError: null });
    try {
      const alerts = await inventoryService.listInventoryAlerts(params);
      set({ alerts, alertsLoading: false });
    } catch (error) {
      set({
        alertsLoading: false,
        alertsError: error instanceof Error ? error.message : '获取库存预警列表失败',
      });
    }
  },
  
  createAlert: async (input: InventoryAlertInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const alert = await inventoryService.createInventoryAlert(input);
      set({ operationLoading: false });
      // 刷新预警列表
      get().fetchAlerts();
      return alert;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建库存预警失败',
      });
      throw error;
    }
  },
  
  updateAlert: async (id: number, input: InventoryAlertInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const alert = await inventoryService.updateInventoryAlert(id, input);
      set({ operationLoading: false });
      // 刷新预警列表
      get().fetchAlerts();
      return alert;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新库存预警失败',
      });
      throw error;
    }
  },
  
  deleteAlert: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await inventoryService.deleteInventoryAlert(id);
      set({ operationLoading: false });
      // 刷新预警列表
      get().fetchAlerts();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除库存预警失败',
      });
      throw error;
    }
  },
  
  // Actions - 库存盘点
  fetchCounts: async (params?: InventoryCountListParams) => {
    set({ countsLoading: true, countsError: null });
    try {
      const counts = await inventoryService.listInventoryCounts(params);
      set({ counts, countsLoading: false });
    } catch (error) {
      set({
        countsLoading: false,
        countsError: error instanceof Error ? error.message : '获取库存盘点列表失败',
      });
    }
  },
  
  fetchCount: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const count = await inventoryService.getInventoryCount(id);
      set({ currentCount: count, operationLoading: false });
      return count;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取库存盘点详情失败',
      });
      throw error;
    }
  },
  
  createCount: async (input: InventoryCountInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const count = await inventoryService.createInventoryCount(input);
      set({ operationLoading: false, currentCount: count });
      // 刷新盘点列表
      get().fetchCounts();
      return count;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建库存盘点失败',
      });
      throw error;
    }
  },
  
  updateCountStatus: async (id: number, status: string, operatorId?: number | null) => {
    set({ operationLoading: true, operationError: null });
    try {
      const count = await inventoryService.updateInventoryCountStatus(id, status, operatorId);
      set({ operationLoading: false, currentCount: count });
      // 刷新盘点列表
      get().fetchCounts();
      return count;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新盘点状态失败',
      });
      throw error;
    }
  },
  
  deleteCount: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await inventoryService.deleteInventoryCount(id);
      set({ operationLoading: false });
      // 刷新盘点列表
      get().fetchCounts();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除盘点任务失败',
      });
      throw error;
    }
  },
  
  // Actions - 库存盘点明细
  fetchCountItems: async (countId: number) => {
    set({ countItemsLoading: true });
    try {
      const items = await inventoryService.listInventoryCountItems(countId);
      set({ countItems: items, countItemsLoading: false });
    } catch (error) {
      set({ countItemsLoading: false });
      console.error('获取盘点明细失败:', error);
    }
  },
  
  createCountItem: async (input: InventoryCountItemInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const item = await inventoryService.createInventoryCountItem(input);
      set({ operationLoading: false });
      // 刷新盘点明细
      get().fetchCountItems(input.countId);
      return item;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建盘点明细失败',
      });
      throw error;
    }
  },
  
  updateCountItemStatus: async (id: number, status: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const item = await inventoryService.updateInventoryCountItemStatus(id, status);
      set({ operationLoading: false });
      // 刷新盘点明细
      const currentCount = get().currentCount;
      if (currentCount) {
        get().fetchCountItems(currentCount.id);
      }
      return item;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新盘点明细状态失败',
      });
      throw error;
    }
  },
  
  // Actions - 库存调拨
  fetchTransfers: async (params?: InventoryTransferListParams) => {
    set({ transfersLoading: true, transfersError: null });
    try {
      const transfers = await inventoryService.listInventoryTransfers(params);
      set({ transfers, transfersLoading: false });
    } catch (error) {
      set({
        transfersLoading: false,
        transfersError: error instanceof Error ? error.message : '获取库存调拨列表失败',
      });
    }
  },
  
  fetchTransfer: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const transfer = await inventoryService.getInventoryTransfer(id);
      set({ currentTransfer: transfer, operationLoading: false });
      return transfer;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取调拨单详情失败',
      });
      throw error;
    }
  },
  
  createTransfer: async (input: InventoryTransferInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const transfer = await inventoryService.createInventoryTransfer(input);
      set({ operationLoading: false, currentTransfer: transfer });
      // 刷新调拨列表
      get().fetchTransfers();
      return transfer;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建调拨单失败',
      });
      throw error;
    }
  },
  
  updateTransferStatus: async (id: number, status: string, operatorId?: number | null) => {
    set({ operationLoading: true, operationError: null });
    try {
      const transfer = await inventoryService.updateInventoryTransferStatus(id, status, operatorId);
      set({ operationLoading: false, currentTransfer: transfer });
      // 刷新调拨列表
      get().fetchTransfers();
      return transfer;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新调拨状态失败',
      });
      throw error;
    }
  },
  
  deleteTransfer: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await inventoryService.deleteInventoryTransfer(id);
      set({ operationLoading: false });
      // 刷新调拨列表
      get().fetchTransfers();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除调拨单失败',
      });
      throw error;
    }
  },
  
  // Actions - 库存调拨明细
  fetchTransferItems: async (transferId: number) => {
    set({ transferItemsLoading: true });
    try {
      const items = await inventoryService.listInventoryTransferItems(transferId);
      set({ transferItems: items, transferItemsLoading: false });
    } catch (error) {
      set({ transferItemsLoading: false });
      console.error('获取调拨明细失败:', error);
    }
  },
  
  createTransferItem: async (input: InventoryTransferItemInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const item = await inventoryService.createInventoryTransferItem(input);
      set({ operationLoading: false });
      // 刷新调拨明细
      get().fetchTransferItems(input.transferId);
      return item;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建调拨明细失败',
      });
      throw error;
    }
  },
  
  // Actions - 库存统计
  fetchSummary: async (warehouseId?: number | null) => {
    set({ summaryLoading: true });
    try {
      const summary = await inventoryService.getInventorySummary(warehouseId);
      set({ summary, summaryLoading: false });
    } catch (error) {
      set({ summaryLoading: false });
      console.error('获取库存统计失败:', error);
    }
  },
  
  fetchLowStockProducts: async (warehouseId?: number | null) => {
    set({ lowStockLoading: true });
    try {
      const products = await inventoryService.getLowStockProducts(warehouseId);
      set({ lowStockProducts: products, lowStockLoading: false });
    } catch (error) {
      set({ lowStockLoading: false });
      console.error('获取低库存产品失败:', error);
    }
  },
  
  // Actions - 工具
  clearError: () => {
    set({
      operationError: null,
      alertsError: null,
      countsError: null,
      transfersError: null,
    });
  },
  
  setCurrentCount: (count: InventoryCount | null) => {
    set({ currentCount: count });
  },
  
  setCurrentTransfer: (transfer: InventoryTransfer | null) => {
    set({ currentTransfer: transfer });
  },
}));

// 导出选择器
export const selectAlerts = (state: InventoryState) => state.alerts;
export const selectCounts = (state: InventoryState) => state.counts;
export const selectTransfers = (state: InventoryState) => state.transfers;
export const selectSummary = (state: InventoryState) => state.summary;
export const selectLowStockProducts = (state: InventoryState) => state.lowStockProducts;
export const selectOperationLoading = (state: InventoryState) => state.operationLoading;
export const selectOperationError = (state: InventoryState) => state.operationError;
