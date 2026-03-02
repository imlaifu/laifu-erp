// 客户管理模块 Zustand Store

import { create } from 'zustand';
import type {
  Customer,
  CustomerCreateInput,
  CustomerUpdateInput,
  CustomerListParams,
  CustomerContact,
  CustomerContactCreateInput,
  CustomerContactUpdateInput,
  CustomerInteraction,
  CustomerInteractionCreateInput,
  CustomerLevelConfig,
  CustomerLevelConfigCreateInput,
  CustomerTag,
  CustomerTagCreateInput,
  CustomerFollowUp,
  CustomerFollowUpCreateInput,
  CustomerFollowUpUpdateInput,
  CustomerFollowUpListParams,
  CustomerStatistics,
} from '../types/customer';
import * as customerService from '../services/customerService';

interface CustomerState {
  // 客户列表
  customers: Customer[];
  customerTotal: number;
  customerListLoading: boolean;
  customerListError: string | null;
  
  // 当前选中的客户
  selectedCustomer: Customer | null;
  
  // 客户联系人
  contacts: CustomerContact[];
  contactsLoading: boolean;
  
  // 客户联系记录
  interactions: CustomerInteraction[];
  interactionsLoading: boolean;
  
  // 客户分级配置
  levelConfigs: CustomerLevelConfig[];
  levelConfigsLoading: boolean;
  
  // 客户标签
  tags: CustomerTag[];
  tagsLoading: boolean;
  
  // 客户跟进计划
  followUps: CustomerFollowUp[];
  followUpsLoading: boolean;
  
  // 客户统计
  statistics: CustomerStatistics | null;
  
  // 操作状态
  operationLoading: boolean;
  operationError: string | null;
  
  // Actions - 客户 CRUD
  fetchCustomers: (params?: CustomerListParams) => Promise<void>;
  fetchCustomer: (id: number) => Promise<Customer>;
  createCustomer: (input: CustomerCreateInput) => Promise<Customer>;
  updateCustomer: (id: number, input: CustomerUpdateInput) => Promise<Customer>;
  deleteCustomer: (id: number) => Promise<void>;
  selectCustomer: (customer: Customer | null) => void;
  
  // Actions - 客户联系人
  fetchContacts: (customerId: number) => Promise<void>;
  createContact: (input: CustomerContactCreateInput) => Promise<CustomerContact>;
  updateContact: (id: number, input: CustomerContactUpdateInput) => Promise<CustomerContact>;
  deleteContact: (id: number) => Promise<void>;
  
  // Actions - 客户联系记录
  fetchInteractions: (customerId: number, limit?: number, offset?: number) => Promise<void>;
  createInteraction: (input: CustomerInteractionCreateInput) => Promise<CustomerInteraction>;
  
  // Actions - 客户分级配置
  fetchLevelConfigs: (status?: string) => Promise<void>;
  createLevelConfig: (input: CustomerLevelConfigCreateInput) => Promise<CustomerLevelConfig>;
  updateLevelConfig: (id: number, input: CustomerLevelConfigCreateInput) => Promise<CustomerLevelConfig>;
  deleteLevelConfig: (id: number) => Promise<void>;
  
  // Actions - 客户标签
  fetchTags: () => Promise<void>;
  createTag: (input: CustomerTagCreateInput) => Promise<CustomerTag>;
  updateTag: (id: number, input: CustomerTagCreateInput) => Promise<CustomerTag>;
  deleteTag: (id: number) => Promise<void>;
  addTagToCustomer: (customerId: number, tagId: number) => Promise<void>;
  removeTagFromCustomer: (customerId: number, tagId: number) => Promise<void>;
  
  // Actions - 客户跟进计划
  fetchFollowUps: (params: CustomerFollowUpListParams) => Promise<void>;
  createFollowUp: (input: CustomerFollowUpCreateInput) => Promise<CustomerFollowUp>;
  updateFollowUp: (id: number, input: CustomerFollowUpUpdateInput) => Promise<CustomerFollowUp>;
  deleteFollowUp: (id: number) => Promise<void>;
  
  // Actions - 客户统计
  fetchStatistics: () => Promise<void>;
  
  // Actions - 工具
  clearError: () => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  // Initial State
  customers: [],
  customerTotal: 0,
  customerListLoading: false,
  customerListError: null,
  
  selectedCustomer: null,
  
  contacts: [],
  contactsLoading: false,
  
  interactions: [],
  interactionsLoading: false,
  
  levelConfigs: [],
  levelConfigsLoading: false,
  
  tags: [],
  tagsLoading: false,
  
  followUps: [],
  followUpsLoading: false,
  
  statistics: null,
  
  operationLoading: false,
  operationError: null,
  
  // Actions - 客户 CRUD
  fetchCustomers: async (params?: CustomerListParams) => {
    set({ customerListLoading: true, customerListError: null });
    try {
      const response = await customerService.listCustomers(params || { limit: 50, offset: 0 });
      set({
        customers: response.customers,
        customerTotal: response.total,
        customerListLoading: false,
      });
    } catch (error) {
      set({
        customerListLoading: false,
        customerListError: error instanceof Error ? error.message : '获取客户列表失败',
      });
    }
  },
  
  fetchCustomer: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const customer = await customerService.getCustomer(id);
      set({ selectedCustomer: customer, operationLoading: false });
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
      const customer = await customerService.createCustomer(input);
      set({ operationLoading: false });
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
      const customer = await customerService.updateCustomer(id, input);
      set({ operationLoading: false });
      // 如果是当前选中的客户，更新本地状态
      if (get().selectedCustomer?.id === id) {
        set({ selectedCustomer: customer });
      }
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
      await customerService.deleteCustomer(id);
      set({ operationLoading: false });
      // 如果是当前选中的客户，清空选中状态
      if (get().selectedCustomer?.id === id) {
        set({ selectedCustomer: null });
      }
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
  
  selectCustomer: (customer: Customer | null) => {
    set({ selectedCustomer: customer });
  },
  
  // Actions - 客户联系人
  fetchContacts: async (customerId: number) => {
    set({ contactsLoading: true });
    try {
      const contacts = await customerService.listCustomerContacts(customerId);
      set({ contacts, contactsLoading: false });
    } catch (error) {
      set({ contactsLoading: false });
      console.error('获取联系人失败:', error);
    }
  },
  
  createContact: async (input: CustomerContactCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contact = await customerService.createCustomerContact(input);
      set({ operationLoading: false });
      // 刷新联系人列表
      get().fetchContacts(input.customerId);
      return contact;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建联系人失败',
      });
      throw error;
    }
  },
  
  updateContact: async (id: number, input: CustomerContactUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contact = await customerService.updateCustomerContact(id, input);
      set({ operationLoading: false });
      // 刷新联系人列表
      const customerId = get().contacts.find(c => c.id === id)?.customerId;
      if (customerId) {
        get().fetchContacts(customerId);
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
      await customerService.deleteCustomerContact(id);
      set({ operationLoading: false });
      // 刷新联系人列表
      const customerId = get().contacts.find(c => c.id === id)?.customerId;
      if (customerId) {
        get().fetchContacts(customerId);
      }
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除联系人失败',
      });
      throw error;
    }
  },
  
  // Actions - 客户联系记录
  fetchInteractions: async (customerId: number, limit: number = 50, offset: number = 0) => {
    set({ interactionsLoading: true });
    try {
      const interactions = await customerService.listCustomerInteractions(customerId, limit, offset);
      set({ interactions, interactionsLoading: false });
    } catch (error) {
      set({ interactionsLoading: false });
      console.error('获取联系记录失败:', error);
    }
  },
  
  createInteraction: async (input: CustomerInteractionCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const interaction = await customerService.createCustomerInteraction(input);
      set({ operationLoading: false });
      // 刷新联系记录列表
      get().fetchInteractions(input.customerId);
      return interaction;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建联系记录失败',
      });
      throw error;
    }
  },
  
  // Actions - 客户分级配置
  fetchLevelConfigs: async (status?: string) => {
    set({ levelConfigsLoading: true });
    try {
      const configs = await customerService.listCustomerLevelConfigs(status);
      set({ levelConfigs: configs, levelConfigsLoading: false });
    } catch (error) {
      set({ levelConfigsLoading: false });
      console.error('获取分级配置失败:', error);
    }
  },
  
  createLevelConfig: async (input: CustomerLevelConfigCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const config = await customerService.createCustomerLevelConfig(input);
      set({ operationLoading: false });
      get().fetchLevelConfigs();
      return config;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建分级配置失败',
      });
      throw error;
    }
  },
  
  updateLevelConfig: async (id: number, input: CustomerLevelConfigCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const config = await customerService.updateCustomerLevelConfig(id, input);
      set({ operationLoading: false });
      get().fetchLevelConfigs();
      return config;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新分级配置失败',
      });
      throw error;
    }
  },
  
  deleteLevelConfig: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await customerService.deleteCustomerLevelConfig(id);
      set({ operationLoading: false });
      get().fetchLevelConfigs();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除分级配置失败',
      });
      throw error;
    }
  },
  
  // Actions - 客户标签
  fetchTags: async () => {
    set({ tagsLoading: true });
    try {
      const tags = await customerService.listCustomerTags();
      set({ tags, tagsLoading: false });
    } catch (error) {
      set({ tagsLoading: false });
      console.error('获取标签失败:', error);
    }
  },
  
  createTag: async (input: CustomerTagCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const tag = await customerService.createCustomerTag(input);
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
  
  updateTag: async (id: number, input: CustomerTagCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const tag = await customerService.updateCustomerTag(id, input);
      set({ operationLoading: false });
      get().fetchTags();
      return tag;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新标签失败',
      });
      throw error;
    }
  },
  
  deleteTag: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await customerService.deleteCustomerTag(id);
      set({ operationLoading: false });
      get().fetchTags();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除标签失败',
      });
      throw error;
    }
  },
  
  addTagToCustomer: async (customerId: number, tagId: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await customerService.addCustomerTag(customerId, tagId);
      set({ operationLoading: false });
      // 刷新选中的客户
      if (get().selectedCustomer?.id === customerId) {
        get().fetchCustomer(customerId);
      }
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '添加标签失败',
      });
      throw error;
    }
  },
  
  removeTagFromCustomer: async (customerId: number, tagId: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await customerService.removeCustomerTag(customerId, tagId);
      set({ operationLoading: false });
      // 刷新选中的客户
      if (get().selectedCustomer?.id === customerId) {
        get().fetchCustomer(customerId);
      }
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '移除标签失败',
      });
      throw error;
    }
  },
  
  // Actions - 客户跟进计划
  fetchFollowUps: async (params: CustomerFollowUpListParams) => {
    set({ followUpsLoading: true });
    try {
      const followUps = await customerService.listCustomerFollowUps(params);
      set({ followUps, followUpsLoading: false });
    } catch (error) {
      set({ followUpsLoading: false });
      console.error('获取跟进计划失败:', error);
    }
  },
  
  createFollowUp: async (input: CustomerFollowUpCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const followUp = await customerService.createCustomerFollowUp(input);
      set({ operationLoading: false });
      // 刷新跟进计划列表
      get().fetchFollowUps({ customerId: input.customerId });
      return followUp;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建跟进计划失败',
      });
      throw error;
    }
  },
  
  updateFollowUp: async (id: number, input: CustomerFollowUpUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const followUp = await customerService.updateCustomerFollowUp(id, input);
      set({ operationLoading: false });
      // 刷新跟进计划列表
      const customerId = get().followUps.find(f => f.id === id)?.customerId;
      if (customerId) {
        get().fetchFollowUps({ customerId });
      }
      return followUp;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新跟进计划失败',
      });
      throw error;
    }
  },
  
  deleteFollowUp: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await customerService.deleteCustomerFollowUp(id);
      set({ operationLoading: false });
      // 刷新跟进计划列表
      const customerId = get().followUps.find(f => f.id === id)?.customerId;
      if (customerId) {
        get().fetchFollowUps({ customerId });
      }
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除跟进计划失败',
      });
      throw error;
    }
  },
  
  // Actions - 客户统计
  fetchStatistics: async () => {
    try {
      const statistics = await customerService.getCustomerStatistics();
      set({ statistics });
    } catch (error) {
      console.error('获取客户统计失败:', error);
    }
  },
  
  // Actions - 工具
  clearError: () => {
    set({
      operationError: null,
      customerListError: null,
    });
  },
}));

// 导出选择器
export const selectCustomers = (state: CustomerState) => state.customers;
export const selectCustomerTotal = (state: CustomerState) => state.customerTotal;
export const selectSelectedCustomer = (state: CustomerState) => state.selectedCustomer;
export const selectContacts = (state: CustomerState) => state.contacts;
export const selectTags = (state: CustomerState) => state.tags;
export const selectLevelConfigs = (state: CustomerState) => state.levelConfigs;
export const selectFollowUps = (state: CustomerState) => state.followUps;
export const selectStatistics = (state: CustomerState) => state.statistics;
export const selectOperationLoading = (state: CustomerState) => state.operationLoading;
export const selectOperationError = (state: CustomerState) => state.operationError;
