// 财务管理模块 Zustand Store

import { create } from 'zustand';
import type {
  FinanceTransaction,
  FinanceTransactionCreateInput,
  FinanceTransactionUpdateInput,
  FinanceTransactionListParams,
  FinanceAccount,
  FinanceAccountCreateInput,
  FinanceAccountUpdateInput,
  FinanceCategory,
  FinanceCategoryCreateInput,
  FinanceCategoryUpdateInput,
  FinanceInvoice,
  FinanceInvoiceCreateInput,
  FinanceInvoiceUpdateInput,
  FinanceInvoiceListParams,
  FinanceInvoiceItem,
  FinanceInvoiceItemCreateInput,
  FinanceReceivablePayable,
  FinanceReceivablePayableListParams,
  FinanceReportConfig,
  FinanceStatistics,
} from '../types/finance';
import * as financeService from '../services/financeService';

interface FinanceState {
  // 收支记录
  transactions: FinanceTransaction[];
  transactionTotal: number;
  transactionsLoading: boolean;
  transactionsError: string | null;
  
  // 会计科目
  accounts: FinanceAccount[];
  accountsLoading: boolean;
  
  // 收支分类
  categories: FinanceCategory[];
  categoriesLoading: boolean;
  
  // 发票
  invoices: FinanceInvoice[];
  invoiceTotal: number;
  invoicesLoading: boolean;
  
  // 发票明细
  invoiceItems: FinanceInvoiceItem[];
  invoiceItemsLoading: boolean;
  
  // 应收应付
  receivablesPayables: FinanceReceivablePayable[];
  receivablesPayablesLoading: boolean;
  
  // 财务报表配置
  reportConfigs: FinanceReportConfig[];
  reportConfigsLoading: boolean;
  
  // 财务统计
  statistics: FinanceStatistics | null;
  statisticsLoading: boolean;
  
  // 操作状态
  operationLoading: boolean;
  operationError: string | null;
  
  // Actions - 收支记录
  fetchTransactions: (params?: FinanceTransactionListParams) => Promise<void>;
  createTransaction: (input: FinanceTransactionCreateInput) => Promise<FinanceTransaction>;
  updateTransaction: (id: number, input: FinanceTransactionUpdateInput) => Promise<FinanceTransaction>;
  deleteTransaction: (id: number) => Promise<void>;
  
  // Actions - 会计科目
  fetchAccounts: () => Promise<void>;
  createAccount: (input: FinanceAccountCreateInput) => Promise<FinanceAccount>;
  updateAccount: (id: number, input: FinanceAccountUpdateInput) => Promise<FinanceAccount>;
  deleteAccount: (id: number) => Promise<void>;
  
  // Actions - 收支分类
  fetchCategories: (type?: 'income' | 'expense') => Promise<void>;
  createCategory: (input: FinanceCategoryCreateInput) => Promise<FinanceCategory>;
  updateCategory: (id: number, input: FinanceCategoryUpdateInput) => Promise<FinanceCategory>;
  deleteCategory: (id: number) => Promise<void>;
  
  // Actions - 发票
  fetchInvoices: (params?: FinanceInvoiceListParams) => Promise<void>;
  createInvoice: (input: FinanceInvoiceCreateInput) => Promise<FinanceInvoice>;
  updateInvoice: (id: number, input: FinanceInvoiceUpdateInput) => Promise<FinanceInvoice>;
  deleteInvoice: (id: number) => Promise<void>;
  
  // Actions - 发票明细
  fetchInvoiceItems: (invoiceId: number) => Promise<void>;
  createInvoiceItem: (input: FinanceInvoiceItemCreateInput) => Promise<FinanceInvoiceItem>;
  deleteInvoiceItem: (id: number) => Promise<void>;
  
  // Actions - 应收应付
  fetchReceivablesPayables: (params?: FinanceReceivablePayableListParams) => Promise<void>;
  
  // Actions - 财务报表配置
  fetchReportConfigs: () => Promise<void>;
  
  // Actions - 财务统计
  fetchStatistics: (startDate: string, endDate: string) => Promise<void>;
  
  // Actions - 工具
  clearError: () => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  // Initial State
  transactions: [],
  transactionTotal: 0,
  transactionsLoading: false,
  transactionsError: null,
  
  accounts: [],
  accountsLoading: false,
  
  categories: [],
  categoriesLoading: false,
  
  invoices: [],
  invoiceTotal: 0,
  invoicesLoading: false,
  
  invoiceItems: [],
  invoiceItemsLoading: false,
  
  receivablesPayables: [],
  receivablesPayablesLoading: false,
  
  reportConfigs: [],
  reportConfigsLoading: false,
  
  statistics: null,
  statisticsLoading: false,
  
  operationLoading: false,
  operationError: null,
  
  // Actions - 收支记录
  fetchTransactions: async (params?: FinanceTransactionListParams) => {
    set({ transactionsLoading: true, transactionsError: null });
    try {
      const response = await financeService.listFinanceTransactions(params || { limit: 50, offset: 0 });
      set({
        transactions: response.transactions,
        transactionTotal: response.total,
        transactionsLoading: false,
      });
    } catch (error) {
      set({
        transactionsLoading: false,
        transactionsError: error instanceof Error ? error.message : '获取收支记录失败',
      });
    }
  },
  
  createTransaction: async (input: FinanceTransactionCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const transaction = await financeService.createFinanceTransaction(input);
      set({ operationLoading: false });
      get().fetchTransactions();
      return transaction;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建收支记录失败',
      });
      throw error;
    }
  },
  
  updateTransaction: async (id: number, input: FinanceTransactionUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const transaction = await financeService.updateFinanceTransaction(id, input);
      set({ operationLoading: false });
      get().fetchTransactions();
      return transaction;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新收支记录失败',
      });
      throw error;
    }
  },
  
  deleteTransaction: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await financeService.deleteFinanceTransaction(id);
      set({ operationLoading: false });
      get().fetchTransactions();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除收支记录失败',
      });
      throw error;
    }
  },
  
  // Actions - 会计科目
  fetchAccounts: async () => {
    set({ accountsLoading: true });
    try {
      const accounts = await financeService.listFinanceAccounts();
      set({ accounts, accountsLoading: false });
    } catch (error) {
      set({ accountsLoading: false });
      console.error('获取会计科目失败:', error);
    }
  },
  
  createAccount: async (input: FinanceAccountCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const account = await financeService.createFinanceAccount(input);
      set({ operationLoading: false });
      get().fetchAccounts();
      return account;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建会计科目失败',
      });
      throw error;
    }
  },
  
  updateAccount: async (id: number, input: FinanceAccountUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const account = await financeService.updateFinanceAccount(id, input);
      set({ operationLoading: false });
      get().fetchAccounts();
      return account;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新会计科目失败',
      });
      throw error;
    }
  },
  
  deleteAccount: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await financeService.deleteFinanceAccount(id);
      set({ operationLoading: false });
      get().fetchAccounts();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除会计科目失败',
      });
      throw error;
    }
  },
  
  // Actions - 收支分类
  fetchCategories: async (type?: 'income' | 'expense') => {
    set({ categoriesLoading: true });
    try {
      const categories = await financeService.listFinanceCategories(type);
      set({ categories, categoriesLoading: false });
    } catch (error) {
      set({ categoriesLoading: false });
      console.error('获取收支分类失败:', error);
    }
  },
  
  createCategory: async (input: FinanceCategoryCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const category = await financeService.createFinanceCategory(input);
      set({ operationLoading: false });
      get().fetchCategories();
      return category;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建收支分类失败',
      });
      throw error;
    }
  },
  
  updateCategory: async (id: number, input: FinanceCategoryUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const category = await financeService.updateFinanceCategory(id, input);
      set({ operationLoading: false });
      get().fetchCategories();
      return category;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新收支分类失败',
      });
      throw error;
    }
  },
  
  deleteCategory: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await financeService.deleteFinanceCategory(id);
      set({ operationLoading: false });
      get().fetchCategories();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除收支分类失败',
      });
      throw error;
    }
  },
  
  // Actions - 发票
  fetchInvoices: async (params?: FinanceInvoiceListParams) => {
    set({ invoicesLoading: true });
    try {
      const response = await financeService.listFinanceInvoices(params || { limit: 50, offset: 0 });
      set({
        invoices: response.invoices,
        invoiceTotal: response.total,
        invoicesLoading: false,
      });
    } catch (error) {
      set({ invoicesLoading: false });
      console.error('获取发票列表失败:', error);
    }
  },
  
  createInvoice: async (input: FinanceInvoiceCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const invoice = await financeService.createFinanceInvoice(input);
      set({ operationLoading: false });
      get().fetchInvoices();
      return invoice;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建发票失败',
      });
      throw error;
    }
  },
  
  updateInvoice: async (id: number, input: FinanceInvoiceUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const invoice = await financeService.updateFinanceInvoice(id, input);
      set({ operationLoading: false });
      get().fetchInvoices();
      return invoice;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新发票失败',
      });
      throw error;
    }
  },
  
  deleteInvoice: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await financeService.deleteFinanceInvoice(id);
      set({ operationLoading: false });
      get().fetchInvoices();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除发票失败',
      });
      throw error;
    }
  },
  
  // Actions - 发票明细
  fetchInvoiceItems: async (invoiceId: number) => {
    set({ invoiceItemsLoading: true });
    try {
      const items = await financeService.listFinanceInvoiceItems(invoiceId);
      set({ invoiceItems: items, invoiceItemsLoading: false });
    } catch (error) {
      set({ invoiceItemsLoading: false });
      console.error('获取发票明细失败:', error);
    }
  },
  
  createInvoiceItem: async (input: FinanceInvoiceItemCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const item = await financeService.createFinanceInvoiceItem(input);
      set({ operationLoading: false });
      const invoiceId = input.invoiceId;
      get().fetchInvoiceItems(invoiceId);
      return item;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建发票明细失败',
      });
      throw error;
    }
  },
  
  deleteInvoiceItem: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await financeService.deleteFinanceInvoiceItem(id);
      set({ operationLoading: false });
      const invoiceId = get().invoiceItems.find(item => item.id === id)?.invoiceId;
      if (invoiceId) {
        get().fetchInvoiceItems(invoiceId);
      }
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除发票明细失败',
      });
      throw error;
    }
  },
  
  // Actions - 应收应付
  fetchReceivablesPayables: async (params?: FinanceReceivablePayableListParams) => {
    set({ receivablesPayablesLoading: true });
    try {
      const receivablesPayables = await financeService.listFinanceReceivablesPayables(params || {});
      set({ receivablesPayables, receivablesPayablesLoading: false });
    } catch (error) {
      set({ receivablesPayablesLoading: false });
      console.error('获取应收应付失败:', error);
    }
  },
  
  // Actions - 财务报表配置
  fetchReportConfigs: async () => {
    set({ reportConfigsLoading: true });
    try {
      const configs = await financeService.listFinanceReportConfigs();
      set({ reportConfigs: configs, reportConfigsLoading: false });
    } catch (error) {
      set({ reportConfigsLoading: false });
      console.error('获取报表配置失败:', error);
    }
  },
  
  // Actions - 财务统计
  fetchStatistics: async (startDate: string, endDate: string) => {
    set({ statisticsLoading: true });
    try {
      const statistics = await financeService.getFinanceStatistics(startDate, endDate);
      set({ statistics, statisticsLoading: false });
    } catch (error) {
      set({ statisticsLoading: false });
      console.error('获取财务统计失败:', error);
    }
  },
  
  // Actions - 工具
  clearError: () => {
    set({
      operationError: null,
      transactionsError: null,
    });
  },
}));

// 导出选择器
export const selectTransactions = (state: FinanceState) => state.transactions;
export const selectTransactionTotal = (state: FinanceState) => state.transactionTotal;
export const selectAccounts = (state: FinanceState) => state.accounts;
export const selectCategories = (state: FinanceState) => state.categories;
export const selectInvoices = (state: FinanceState) => state.invoices;
export const selectInvoiceItems = (state: FinanceState) => state.invoiceItems;
export const selectReceivablesPayables = (state: FinanceState) => state.receivablesPayables;
export const selectStatistics = (state: FinanceState) => state.statistics;
export const selectOperationLoading = (state: FinanceState) => state.operationLoading;
export const selectOperationError = (state: FinanceState) => state.operationError;
