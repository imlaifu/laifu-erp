// 供应商管理模块 Zustand Store

import { create } from 'zustand';
import type {
  Supplier,
  SupplierCreateInput,
  SupplierUpdateInput,
  SupplierListParams,
  SupplierContact,
  SupplierContactCreateInput,
  SupplierContactUpdateInput,
  SupplierInteraction,
  SupplierInteractionCreateInput,
  SupplierLevel,
  SupplierTag,
  SupplierTagCreateInput,
  SupplierEvaluation,
  SupplierEvaluationCreateInput,
  SupplierEvaluationUpdateInput,
  SupplierEvaluationListParams,
  SupplierProduct,
  SupplierProductCreateInput,
  SupplierProductUpdateInput,
  SupplierStatistics,
} from '../types/supplier';
import * as supplierService from '../services/supplierService';

interface SupplierState {
  // 供应商列表
  suppliers: Supplier[];
  supplierTotal: number;
  supplierListLoading: boolean;
  supplierListError: string | null;
  
  // 当前选中的供应商
  selectedSupplier: Supplier | null;
  
  // 供应商联系人
  contacts: SupplierContact[];
  contactsLoading: boolean;
  
  // 供应商联系记录
  interactions: SupplierInteraction[];
  interactionsLoading: boolean;
  
  // 供应商分级配置
  levelConfigs: SupplierLevel[];
  levelConfigsLoading: boolean;
  
  // 供应商标签
  tags: SupplierTag[];
  tagsLoading: boolean;
  
  // 供应商评估
  evaluations: SupplierEvaluation[];
  evaluationsLoading: boolean;
  
  // 供应商产品
  products: SupplierProduct[];
  productsLoading: boolean;
  
  // 供应商统计
  statistics: SupplierStatistics | null;
  
  // 操作状态
  operationLoading: boolean;
  operationError: string | null;
  
  // Actions - 供应商 CRUD
  fetchSuppliers: (params?: SupplierListParams) => Promise<void>;
  fetchSupplier: (id: number) => Promise<Supplier>;
  createSupplier: (input: SupplierCreateInput) => Promise<Supplier>;
  updateSupplier: (id: number, input: SupplierUpdateInput) => Promise<Supplier>;
  deleteSupplier: (id: number) => Promise<void>;
  selectSupplier: (supplier: Supplier | null) => void;
  
  // Actions - 供应商联系人
  fetchContacts: (supplierId: number) => Promise<void>;
  createContact: (input: SupplierContactCreateInput) => Promise<SupplierContact>;
  updateContact: (id: number, input: SupplierContactUpdateInput) => Promise<SupplierContact>;
  deleteContact: (id: number) => Promise<void>;
  
  // Actions - 供应商联系记录
  fetchInteractions: (supplierId: number, limit?: number, offset?: number) => Promise<void>;
  createInteraction: (input: SupplierInteractionCreateInput) => Promise<SupplierInteraction>;
  
  // Actions - 供应商分级配置
  fetchLevelConfigs: () => Promise<void>;
  
  // Actions - 供应商标签
  fetchTags: () => Promise<void>;
  createTag: (input: SupplierTagCreateInput) => Promise<SupplierTag>;
  
  // Actions - 供应商评估
  fetchEvaluations: (params: SupplierEvaluationListParams) => Promise<void>;
  createEvaluation: (input: SupplierEvaluationCreateInput) => Promise<SupplierEvaluation>;
  updateEvaluation: (id: number, input: SupplierEvaluationUpdateInput) => Promise<SupplierEvaluation>;
  deleteEvaluation: (id: number) => Promise<void>;
  
  // Actions - 供应商产品
  fetchProducts: (supplierId: number) => Promise<void>;
  createProduct: (input: SupplierProductCreateInput) => Promise<SupplierProduct>;
  updateProduct: (id: number, input: SupplierProductUpdateInput) => Promise<SupplierProduct>;
  deleteProduct: (id: number) => Promise<void>;
  
  // Actions - 供应商统计
  fetchStatistics: () => Promise<void>;
  
  // Actions - 工具
  clearError: () => void;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  // Initial State
  suppliers: [],
  supplierTotal: 0,
  supplierListLoading: false,
  supplierListError: null,
  
  selectedSupplier: null,
  
  contacts: [],
  contactsLoading: false,
  
  interactions: [],
  interactionsLoading: false,
  
  levelConfigs: [],
  levelConfigsLoading: false,
  
  tags: [],
  tagsLoading: false,
  
  evaluations: [],
  evaluationsLoading: false,
  
  products: [],
  productsLoading: false,
  
  statistics: null,
  
  operationLoading: false,
  operationError: null,
  
  // Actions - 供应商 CRUD
  fetchSuppliers: async (params?: SupplierListParams) => {
    set({ supplierListLoading: true, supplierListError: null });
    try {
      const response = await supplierService.listSuppliers(params || { limit: 50, offset: 0 });
      set({
        suppliers: response.suppliers,
        supplierTotal: response.total,
        supplierListLoading: false,
      });
    } catch (error) {
      set({
        supplierListLoading: false,
        supplierListError: error instanceof Error ? error.message : '获取供应商列表失败',
      });
    }
  },
  
  fetchSupplier: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const supplier = await supplierService.getSupplier(id);
      set({ selectedSupplier: supplier, operationLoading: false });
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
      const supplier = await supplierService.createSupplier(input);
      set({ operationLoading: false });
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
      const supplier = await supplierService.updateSupplier(id, input);
      set({ operationLoading: false });
      // 如果是当前选中的供应商，更新本地状态
      if (get().selectedSupplier?.id === id) {
        set({ selectedSupplier: supplier });
      }
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
      await supplierService.deleteSupplier(id);
      set({ operationLoading: false });
      // 如果是当前选中的供应商，清空选中状态
      if (get().selectedSupplier?.id === id) {
        set({ selectedSupplier: null });
      }
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
  
  selectSupplier: (supplier: Supplier | null) => {
    set({ selectedSupplier: supplier });
  },
  
  // Actions - 供应商联系人
  fetchContacts: async (supplierId: number) => {
    set({ contactsLoading: true });
    try {
      const contacts = await supplierService.listSupplierContacts(supplierId);
      set({ contacts, contactsLoading: false });
    } catch (error) {
      set({ contactsLoading: false });
      console.error('获取联系人失败:', error);
    }
  },
  
  createContact: async (input: SupplierContactCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contact = await supplierService.createSupplierContact(input);
      set({ operationLoading: false });
      // 刷新联系人列表
      get().fetchContacts(input.supplierId);
      return contact;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建联系人失败',
      });
      throw error;
    }
  },
  
  updateContact: async (id: number, input: SupplierContactUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contact = await supplierService.updateSupplierContact(id, input);
      set({ operationLoading: false });
      // 刷新联系人列表
      const supplierId = get().contacts.find(c => c.id === id)?.supplierId;
      if (supplierId) {
        get().fetchContacts(supplierId);
      }
      return contact;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新联系人失败',
      });
      throw error;
    }
  },
  
  deleteContact: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await supplierService.deleteSupplierContact(id);
      set({ operationLoading: false });
      // 刷新联系人列表
      const supplierId = get().contacts.find(c => c.id === id)?.supplierId;
      if (supplierId) {
        get().fetchContacts(supplierId);
      }
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除联系人失败',
      });
      throw error;
    }
  },
  
  // Actions - 供应商联系记录
  fetchInteractions: async (supplierId: number, limit: number = 50, offset: number = 0) => {
    set({ interactionsLoading: true });
    try {
      const interactions = await supplierService.listSupplierInteractions(supplierId, limit, offset);
      set({ interactions, interactionsLoading: false });
    } catch (error) {
      set({ interactionsLoading: false });
      console.error('获取联系记录失败:', error);
    }
  },
  
  createInteraction: async (input: SupplierInteractionCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const interaction = await supplierService.createSupplierInteraction(input);
      set({ operationLoading: false });
      // 刷新联系记录列表
      get().fetchInteractions(input.supplierId);
      return interaction;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建联系记录失败',
      });
      throw error;
    }
  },
  
  // Actions - 供应商分级配置
  fetchLevelConfigs: async () => {
    set({ levelConfigsLoading: true });
    try {
      const configs = await supplierService.listSupplierLevels();
      set({ levelConfigs: configs, levelConfigsLoading: false });
    } catch (error) {
      set({ levelConfigsLoading: false });
      console.error('获取分级配置失败:', error);
    }
  },
  
  // Actions - 供应商标签
  fetchTags: async () => {
    set({ tagsLoading: true });
    try {
      const tags = await supplierService.listSupplierTags();
      set({ tags, tagsLoading: false });
    } catch (error) {
      set({ tagsLoading: false });
      console.error('获取标签失败:', error);
    }
  },
  
  createTag: async (input: SupplierTagCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const tag = await supplierService.createSupplierTag(input);
      set({ operationLoading: false });
      get().fetchTags();
      return tag;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建标签失败',
      });
      throw error;
    }
  },
  
  // Actions - 供应商评估
  fetchEvaluations: async (params: SupplierEvaluationListParams) => {
    set({ evaluationsLoading: true });
    try {
      const evaluations = await supplierService.listSupplierEvaluations(params);
      set({ evaluations, evaluationsLoading: false });
    } catch (error) {
      set({ evaluationsLoading: false });
      console.error('获取评估失败:', error);
    }
  },
  
  createEvaluation: async (input: SupplierEvaluationCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const evaluation = await supplierService.createSupplierEvaluation(input);
      set({ operationLoading: false });
      // 刷新评估列表
      get().fetchEvaluations({ supplierId: input.supplierId });
      return evaluation;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建评估失败',
      });
      throw error;
    }
  },
  
  updateEvaluation: async (id: number, input: SupplierEvaluationUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const evaluation = await supplierService.updateSupplierEvaluation(id, input);
      set({ operationLoading: false });
      // 刷新评估列表
      const supplierId = get().evaluations.find(e => e.id === id)?.supplierId;
      if (supplierId) {
        get().fetchEvaluations({ supplierId });
      }
      return evaluation;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新评估失败',
      });
      throw error;
    }
  },
  
  deleteEvaluation: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await supplierService.deleteSupplierEvaluation(id);
      set({ operationLoading: false });
      // 刷新评估列表
      const supplierId = get().evaluations.find(e => e.id === id)?.supplierId;
      if (supplierId) {
        get().fetchEvaluations({ supplierId });
      }
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除评估失败',
      });
      throw error;
    }
  },
  
  // Actions - 供应商产品
  fetchProducts: async (supplierId: number) => {
    set({ productsLoading: true });
    try {
      const products = await supplierService.listSupplierProducts(supplierId);
      set({ products, productsLoading: false });
    } catch (error) {
      set({ productsLoading: false });
      console.error('获取产品失败:', error);
    }
  },
  
  createProduct: async (input: SupplierProductCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const product = await supplierService.createSupplierProduct(input);
      set({ operationLoading: false });
      // 刷新产品列表
      get().fetchProducts(input.supplierId);
      return product;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建产品失败',
      });
      throw error;
    }
  },
  
  updateProduct: async (id: number, input: SupplierProductUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const product = await supplierService.updateSupplierProduct(id, input);
      set({ operationLoading: false });
      // 刷新产品列表
      const supplierId = get().products.find(p => p.id === id)?.supplierId;
      if (supplierId) {
        get().fetchProducts(supplierId);
      }
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
      await supplierService.deleteSupplierProduct(id);
      set({ operationLoading: false });
      // 刷新产品列表
      const supplierId = get().products.find(p => p.id === id)?.supplierId;
      if (supplierId) {
        get().fetchProducts(supplierId);
      }
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除产品失败',
      });
      throw error;
    }
  },
  
  // Actions - 供应商统计
  fetchStatistics: async () => {
    try {
      const statistics = await supplierService.getSupplierStatistics();
      set({ statistics });
    } catch (error) {
      console.error('获取供应商统计失败:', error);
    }
  },
  
  // Actions - 工具
  clearError: () => {
    set({
      operationError: null,
      supplierListError: null,
    });
  },
}));

// 导出选择器
export const selectSuppliers = (state: SupplierState) => state.suppliers;
export const selectSupplierTotal = (state: SupplierState) => state.supplierTotal;
export const selectSelectedSupplier = (state: SupplierState) => state.selectedSupplier;
export const selectContacts = (state: SupplierState) => state.contacts;
export const selectTags = (state: SupplierState) => state.tags;
export const selectLevelConfigs = (state: SupplierState) => state.levelConfigs;
export const selectEvaluations = (state: SupplierState) => state.evaluations;
export const selectProducts = (state: SupplierState) => state.products;
export const selectStatistics = (state: SupplierState) => state.statistics;
export const selectOperationLoading = (state: SupplierState) => state.operationLoading;
export const selectOperationError = (state: SupplierState) => state.operationError;
