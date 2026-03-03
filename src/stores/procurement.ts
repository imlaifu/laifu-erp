// 采购管理模块 Zustand Store

import { create } from 'zustand';
import type {
  ProcurementRequest,
  ProcurementRequestCreateInput,
  ProcurementRequestItem,
  ProcurementRequestListParams,
  PurchaseOrder,
  PurchaseOrderCreateInput,
  PurchaseOrderItem,
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
import * as procurementService from '../services/procurementService';

interface ProcurementState {
  // 采购申请
  requests: ProcurementRequest[];
  requestsLoading: boolean;
  requestsError: string | null;
  currentRequest: ProcurementRequest | null;
  currentRequestItems: ProcurementRequestItem[];
  
  // 采购订单
  orders: PurchaseOrder[];
  ordersLoading: boolean;
  ordersError: string | null;
  currentOrder: PurchaseOrder | null;
  currentOrderItems: PurchaseOrderItem[];
  
  // 采购合同
  contracts: PurchaseContract[];
  contractsLoading: boolean;
  contractsError: string | null;
  currentContract: PurchaseContract | null;
  
  // 入库验收
  inspections: ReceivingInspection[];
  inspectionsLoading: boolean;
  inspectionsError: string | null;
  currentInspection: ReceivingInspection | null;
  currentInspectionItems: ReceivingInspectionItem[];
  
  // 供应商比价
  comparisons: SupplierComparison[];
  comparisonsLoading: boolean;
  comparisonsError: string | null;
  currentComparison: SupplierComparison | null;
  currentComparisonItems: SupplierComparisonItem[];
  
  // 操作状态
  operationLoading: boolean;
  operationError: string | null;
  
  // Actions - 采购申请
  fetchRequests: (params?: ProcurementRequestListParams) => Promise<void>;
  fetchRequest: (id: number) => Promise<ProcurementRequest>;
  fetchRequestItems: (requestId: number) => Promise<void>;
  createRequest: (input: ProcurementRequestCreateInput) => Promise<ProcurementRequest>;
  approveRequest: (id: number, approvedBy: number) => Promise<ProcurementRequest>;
  rejectRequest: (id: number, rejectionReason: string) => Promise<ProcurementRequest>;
  
  // Actions - 采购订单
  fetchOrders: (params?: PurchaseOrderListParams) => Promise<void>;
  fetchOrder: (id: number) => Promise<PurchaseOrder>;
  fetchOrderItems: (orderId: number) => Promise<void>;
  createOrder: (input: PurchaseOrderCreateInput) => Promise<PurchaseOrder>;
  updateOrderStatus: (id: number, status: string) => Promise<PurchaseOrder>;
  deleteOrder: (id: number) => Promise<void>;
  submitOrder: (id: number) => Promise<PurchaseOrder>;
  confirmOrder: (id: number) => Promise<PurchaseOrder>;
  completeOrder: (id: number) => Promise<PurchaseOrder>;
  cancelOrder: (id: number) => Promise<PurchaseOrder>;
  
  // Actions - 采购合同
  fetchContracts: (params?: PurchaseContractListParams) => Promise<void>;
  fetchContract: (id: number) => Promise<PurchaseContract>;
  createContract: (input: PurchaseContractCreateInput) => Promise<PurchaseContract>;
  updateContractStatus: (id: number, status: string) => Promise<PurchaseContract>;
  
  // Actions - 入库验收
  fetchInspecctions: (params?: ReceivingInspectionListParams) => Promise<void>;
  fetchInspection: (id: number) => Promise<ReceivingInspection>;
  fetchInspectionItems: (inspectionId: number) => Promise<void>;
  createInspection: (input: ReceivingInspectionCreateInput) => Promise<ReceivingInspection>;
  updateInspectionStatus: (id: number, status: string, qualityStatus?: string, rejectionReason?: string) => Promise<ReceivingInspection>;
  completeInspection: (id: number) => Promise<ReceivingInspection>;
  rejectInspection: (id: number, reason: string) => Promise<ReceivingInspection>;
  
  // Actions - 供应商比价
  fetchComparisons: (params?: SupplierComparisonListParams) => Promise<void>;
  fetchComparison: (id: number) => Promise<SupplierComparison>;
  fetchComparisonItems: (comparisonId: number) => Promise<void>;
  createComparison: (input: SupplierComparisonCreateInput) => Promise<SupplierComparison>;
  addComparisonItem: (comparisonId: number, input: SupplierComparisonItemInput) => Promise<SupplierComparisonItem>;
  selectComparisonItem: (itemId: number) => Promise<void>;
  deleteComparison: (id: number) => Promise<void>;
  
  // Actions - 工具
  clearError: () => void;
  setCurrentRequest: (request: ProcurementRequest | null) => void;
  setCurrentOrder: (order: PurchaseOrder | null) => void;
  setCurrentContract: (contract: PurchaseContract | null) => void;
  setCurrentInspection: (inspection: ReceivingInspection | null) => void;
  setCurrentComparison: (comparison: SupplierComparison | null) => void;
}

export const useProcurementStore = create<ProcurementState>((set, get) => ({
  // Initial State
  requests: [],
  requestsLoading: false,
  requestsError: null,
  currentRequest: null,
  currentRequestItems: [],
  
  orders: [],
  ordersLoading: false,
  ordersError: null,
  currentOrder: null,
  currentOrderItems: [],
  
  contracts: [],
  contractsLoading: false,
  contractsError: null,
  currentContract: null,
  
  inspections: [],
  inspectionsLoading: false,
  inspectionsError: null,
  currentInspection: null,
  currentInspectionItems: [],
  
  comparisons: [],
  comparisonsLoading: false,
  comparisonsError: null,
  currentComparison: null,
  currentComparisonItems: [],
  
  operationLoading: false,
  operationError: null,
  
  // Actions - 采购申请
  fetchRequests: async (params?: ProcurementRequestListParams) => {
    set({ requestsLoading: true, requestsError: null });
    try {
      const requests = await procurementService.listProcurementRequests(params || { limit: 50, offset: 0 });
      set({ requests, requestsLoading: false });
    } catch (error) {
      set({
        requestsLoading: false,
        requestsError: error instanceof Error ? error.message : '获取采购申请列表失败',
      });
    }
  },
  
  fetchRequest: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const request = await procurementService.getProcurementRequest(id);
      set({ currentRequest: request, operationLoading: false });
      return request;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取采购申请详情失败',
      });
      throw error;
    }
  },
  
  fetchRequestItems: async (requestId: number) => {
    try {
      const items = await procurementService.getProcurementRequestItems(requestId);
      set({ currentRequestItems: items });
    } catch (error) {
      console.error('获取采购申请明细失败:', error);
    }
  },
  
  createRequest: async (input: ProcurementRequestCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const request = await procurementService.createProcurementRequest(input);
      set({ operationLoading: false });
      get().fetchRequests();
      return request;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建采购申请失败',
      });
      throw error;
    }
  },
  
  approveRequest: async (id: number, approvedBy: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const request = await procurementService.approveProcurementRequest(id, approvedBy);
      set({ operationLoading: false });
      get().fetchRequests();
      return request;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '审批采购申请失败',
      });
      throw error;
    }
  },
  
  rejectRequest: async (id: number, rejectionReason: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const request = await procurementService.rejectProcurementRequest(id, rejectionReason);
      set({ operationLoading: false });
      get().fetchRequests();
      return request;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '拒绝采购申请失败',
      });
      throw error;
    }
  },
  
  // Actions - 采购订单
  fetchOrders: async (params?: PurchaseOrderListParams) => {
    set({ ordersLoading: true, ordersError: null });
    try {
      const orders = await procurementService.listPurchaseOrders(params || { limit: 50, offset: 0 });
      set({ orders, ordersLoading: false });
    } catch (error) {
      set({
        ordersLoading: false,
        ordersError: error instanceof Error ? error.message : '获取采购订单列表失败',
      });
    }
  },
  
  fetchOrder: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await procurementService.getPurchaseOrder(id);
      set({ currentOrder: order, operationLoading: false });
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取采购订单详情失败',
      });
      throw error;
    }
  },
  
  fetchOrderItems: async (orderId: number) => {
    try {
      const items = await procurementService.getPurchaseOrderItems(orderId);
      set({ currentOrderItems: items });
    } catch (error) {
      console.error('获取采购订单明细失败:', error);
    }
  },
  
  createOrder: async (input: PurchaseOrderCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await procurementService.createPurchaseOrder(input);
      set({ operationLoading: false });
      get().fetchOrders();
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建采购订单失败',
      });
      throw error;
    }
  },
  
  updateOrderStatus: async (id: number, status: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const order = await procurementService.updatePurchaseOrderStatus(id, status);
      set({ operationLoading: false });
      get().fetchOrders();
      return order;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新采购订单状态失败',
      });
      throw error;
    }
  },
  
  deleteOrder: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await procurementService.deletePurchaseOrder(id);
      set({ operationLoading: false });
      get().fetchOrders();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除采购订单失败',
      });
      throw error;
    }
  },
  
  submitOrder: async (id: number) => {
    return get().updateOrderStatus(id, 'submitted');
  },
  
  confirmOrder: async (id: number) => {
    return get().updateOrderStatus(id, 'confirmed');
  },
  
  completeOrder: async (id: number) => {
    return get().updateOrderStatus(id, 'completed');
  },
  
  cancelOrder: async (id: number) => {
    return get().updateOrderStatus(id, 'cancelled');
  },
  
  // Actions - 采购合同
  fetchContracts: async (params?: PurchaseContractListParams) => {
    set({ contractsLoading: true, contractsError: null });
    try {
      const contracts = await procurementService.listPurchaseContracts(params || { limit: 50, offset: 0 });
      set({ contracts, contractsLoading: false });
    } catch (error) {
      set({
        contractsLoading: false,
        contractsError: error instanceof Error ? error.message : '获取采购合同列表失败',
      });
    }
  },
  
  fetchContract: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contract = await procurementService.getPurchaseContract(id);
      set({ currentContract: contract, operationLoading: false });
      return contract;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取采购合同详情失败',
      });
      throw error;
    }
  },
  
  createContract: async (input: PurchaseContractCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contract = await procurementService.createPurchaseContract(input);
      set({ operationLoading: false });
      get().fetchContracts();
      return contract;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建采购合同失败',
      });
      throw error;
    }
  },
  
  updateContractStatus: async (id: number, status: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contract = await procurementService.updatePurchaseContractStatus(id, status);
      set({ operationLoading: false });
      get().fetchContracts();
      return contract;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新采购合同状态失败',
      });
      throw error;
    }
  },
  
  // Actions - 入库验收
  fetchInspecctions: async (params?: ReceivingInspectionListParams) => {
    set({ inspectionsLoading: true, inspectionsError: null });
    try {
      const inspections = await procurementService.listReceivingInspecctions(params || { limit: 50, offset: 0 });
      set({ inspections, inspectionsLoading: false });
    } catch (error) {
      set({
        inspectionsLoading: false,
        inspectionsError: error instanceof Error ? error.message : '获取入库验收单列表失败',
      });
    }
  },
  
  fetchInspection: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const inspection = await procurementService.getReceivingInspection(id);
      set({ currentInspection: inspection, operationLoading: false });
      return inspection;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取入库验收单详情失败',
      });
      throw error;
    }
  },
  
  fetchInspectionItems: async (inspectionId: number) => {
    try {
      const items = await procurementService.getReceivingInspectionItems(inspectionId);
      set({ currentInspectionItems: items });
    } catch (error) {
      console.error('获取入库验收明细失败:', error);
    }
  },
  
  createInspection: async (input: ReceivingInspectionCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const inspection = await procurementService.createReceivingInspection(input);
      set({ operationLoading: false });
      get().fetchInspecctions();
      return inspection;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建入库验收单失败',
      });
      throw error;
    }
  },
  
  updateInspectionStatus: async (id: number, status: string, qualityStatus?: string, rejectionReason?: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const inspection = await procurementService.updateReceivingInspectionStatus(id, status, qualityStatus, rejectionReason);
      set({ operationLoading: false });
      get().fetchInspecctions();
      return inspection;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新入库验收状态失败',
      });
      throw error;
    }
  },
  
  completeInspection: async (id: number) => {
    return get().updateInspectionStatus(id, 'completed', 'passed');
  },
  
  rejectInspection: async (id: number, reason: string) => {
    return get().updateInspectionStatus(id, 'rejected', 'failed', reason);
  },
  
  // Actions - 供应商比价
  fetchComparisons: async (params?: SupplierComparisonListParams) => {
    set({ comparisonsLoading: true, comparisonsError: null });
    try {
      const comparisons = await procurementService.listSupplierComparisons(params || { limit: 50, offset: 0 });
      set({ comparisons, comparisonsLoading: false });
    } catch (error) {
      set({
        comparisonsLoading: false,
        comparisonsError: error instanceof Error ? error.message : '获取供应商比价单列表失败',
      });
    }
  },
  
  fetchComparison: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const comparison = await procurementService.getSupplierComparison(id);
      set({ currentComparison: comparison, operationLoading: false });
      return comparison;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取供应商比价单详情失败',
      });
      throw error;
    }
  },
  
  fetchComparisonItems: async (comparisonId: number) => {
    try {
      const items = await procurementService.getSupplierComparisonItems(comparisonId);
      set({ currentComparisonItems: items });
    } catch (error) {
      console.error('获取供应商比价明细失败:', error);
    }
  },
  
  createComparison: async (input: SupplierComparisonCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const comparison = await procurementService.createSupplierComparison(input);
      set({ operationLoading: false });
      get().fetchComparisons();
      return comparison;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建供应商比价单失败',
      });
      throw error;
    }
  },
  
  addComparisonItem: async (comparisonId: number, input: SupplierComparisonItemInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const item = await procurementService.addSupplierComparisonItem(comparisonId, input);
      set({ operationLoading: false });
      get().fetchComparisonItems(comparisonId);
      return item;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '添加供应商比价明细失败',
      });
      throw error;
    }
  },
  
  selectComparisonItem: async (itemId: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await procurementService.selectSupplierComparisonItem(itemId);
      set({ operationLoading: false });
      const comparison = get().currentComparison;
      if (comparison) {
        get().fetchComparisonItems(comparison.id);
      }
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '选择供应商失败',
      });
      throw error;
    }
  },
  
  deleteComparison: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await procurementService.deleteSupplierComparison(id);
      set({ operationLoading: false });
      get().fetchComparisons();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除供应商比价单失败',
      });
      throw error;
    }
  },
  
  // Actions - 工具
  clearError: () => {
    set({
      operationError: null,
      requestsError: null,
      ordersError: null,
      contractsError: null,
      inspectionsError: null,
      comparisonsError: null,
    });
  },
  
  setCurrentRequest: (request: ProcurementRequest | null) => {
    set({ currentRequest: request });
  },
  
  setCurrentOrder: (order: PurchaseOrder | null) => {
    set({ currentOrder: order });
  },
  
  setCurrentContract: (contract: PurchaseContract | null) => {
    set({ currentContract: contract });
  },
  
  setCurrentInspection: (inspection: ReceivingInspection | null) => {
    set({ currentInspection: inspection });
  },
  
  setCurrentComparison: (comparison: SupplierComparison | null) => {
    set({ currentComparison: comparison });
  },
}));

// 导出选择器
export const selectRequests = (state: ProcurementState) => state.requests;
export const selectOrders = (state: ProcurementState) => state.orders;
export const selectContracts = (state: ProcurementState) => state.contracts;
export const selectInspecctions = (state: ProcurementState) => state.inspections;
export const selectComparisons = (state: ProcurementState) => state.comparisons;
export const selectOperationLoading = (state: ProcurementState) => state.operationLoading;
export const selectOperationError = (state: ProcurementState) => state.operationError;
