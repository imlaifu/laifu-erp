// 销售管理模块 Zustand Store

import { create } from 'zustand';
import type {
  SalesOpportunity,
  SalesOpportunityCreateInput,
  SalesOpportunityListParams,
  OpportunityFollowup,
  OpportunityFollowupCreateInput,
  SalesQuotation,
  SalesQuotationCreateInput,
  QuotationItem,
  SalesQuotationListParams,
  SalesContract,
  SalesContractCreateInput,
  ContractItem,
  SalesContractListParams,
  SalesForecast,
  SalesForecastCreateInput,
  SalesForecastListParams,
  SalesCommission,
  SalesCommissionCreateInput,
  SalesCommissionListParams,
  SalesPerformance,
  SalesPerformanceListParams,
  SalesActivity,
  SalesActivityCreateInput,
  SalesActivityListParams,
} from '../types/sales';
import * as salesService from '../services/salesService';

interface SalesState {
  // 销售机会
  opportunities: SalesOpportunity[];
  opportunityTotal: number;
  opportunityListLoading: boolean;
  opportunityListError: string | null;
  selectedOpportunity: SalesOpportunity | null;
  
  // 跟进记录
  followups: OpportunityFollowup[];
  followupsLoading: boolean;
  
  // 报价单
  quotations: SalesQuotation[];
  quotationTotal: number;
  quotationListLoading: boolean;
  selectedQuotation: SalesQuotation | null;
  quotationItems: QuotationItem[];
  quotationItemsLoading: boolean;
  
  // 销售合同
  contracts: SalesContract[];
  contractTotal: number;
  contractListLoading: boolean;
  selectedContract: SalesContract | null;
  contractItems: ContractItem[];
  contractItemsLoading: boolean;
  
  // 销售预测
  forecasts: SalesForecast[];
  forecastTotal: number;
  forecastListLoading: boolean;
  
  // 销售佣金
  commissions: SalesCommission[];
  commissionTotal: number;
  commissionListLoading: boolean;
  
  // 销售业绩
  performances: SalesPerformance[];
  performanceListLoading: boolean;
  
  // 销售活动
  activities: SalesActivity[];
  activityTotal: number;
  activityListLoading: boolean;
  
  // 操作状态
  operationLoading: boolean;
  operationError: string | null;
  
  // Actions - 销售机会
  fetchOpportunities: (params?: SalesOpportunityListParams) => Promise<void>;
  fetchOpportunity: (id: number) => Promise<SalesOpportunity>;
  createOpportunity: (input: SalesOpportunityCreateInput) => Promise<SalesOpportunity>;
  updateOpportunity: (id: number, input: SalesOpportunityCreateInput) => Promise<SalesOpportunity>;
  deleteOpportunity: (id: number) => Promise<void>;
  updateOpportunityStage: (id: number, stage: string) => Promise<SalesOpportunity>;
  selectOpportunity: (opportunity: SalesOpportunity | null) => void;
  
  // Actions - 跟进记录
  fetchFollowups: (opportunityId: number) => Promise<void>;
  createFollowup: (input: OpportunityFollowupCreateInput) => Promise<OpportunityFollowup>;
  
  // Actions - 报价单
  fetchQuotations: (params?: SalesQuotationListParams) => Promise<void>;
  fetchQuotation: (id: number) => Promise<SalesQuotation>;
  createQuotation: (input: SalesQuotationCreateInput) => Promise<SalesQuotation>;
  updateQuotationStatus: (id: number, status: string) => Promise<SalesQuotation>;
  deleteQuotation: (id: number) => Promise<void>;
  fetchQuotationItems: (quotationId: number) => Promise<void>;
  selectQuotation: (quotation: SalesQuotation | null) => void;
  
  // Actions - 销售合同
  fetchContracts: (params?: SalesContractListParams) => Promise<void>;
  fetchContract: (id: number) => Promise<SalesContract>;
  createContract: (input: SalesContractCreateInput) => Promise<SalesContract>;
  updateContractStatus: (id: number, status: string) => Promise<SalesContract>;
  updateContractPayment: (id: number, paidAmount: number) => Promise<SalesContract>;
  deleteContract: (id: number) => Promise<void>;
  fetchContractItems: (contractId: number) => Promise<void>;
  selectContract: (contract: SalesContract | null) => void;
  
  // Actions - 销售预测
  fetchForecasts: (params?: SalesForecastListParams) => Promise<void>;
  createForecast: (input: SalesForecastCreateInput) => Promise<SalesForecast>;
  updateForecastActuals: (id: number, actualQuantity: number, actualAmount: number) => Promise<SalesForecast>;
  deleteForecast: (id: number) => Promise<void>;
  
  // Actions - 销售佣金
  fetchCommissions: (params?: SalesCommissionListParams) => Promise<void>;
  createCommission: (input: SalesCommissionCreateInput) => Promise<SalesCommission>;
  approveCommission: (id: number, approvedBy: number) => Promise<SalesCommission>;
  payCommission: (id: number) => Promise<SalesCommission>;
  deleteCommission: (id: number) => Promise<void>;
  
  // Actions - 销售业绩
  fetchPerformances: (params?: SalesPerformanceListParams) => Promise<void>;
  
  // Actions - 销售活动
  fetchActivities: (params?: SalesActivityListParams) => Promise<void>;
  createActivity: (input: SalesActivityCreateInput) => Promise<SalesActivity>;
  completeActivity: (id: number, outcome: string, actualTime: string, durationMinutes: number) => Promise<SalesActivity>;
  deleteActivity: (id: number) => Promise<void>;
  
  // Actions - 工具
  clearError: () => void;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  // Initial State
  opportunities: [],
  opportunityTotal: 0,
  opportunityListLoading: false,
  opportunityListError: null,
  selectedOpportunity: null,
  
  followups: [],
  followupsLoading: false,
  
  quotations: [],
  quotationTotal: 0,
  quotationListLoading: false,
  selectedQuotation: null,
  quotationItems: [],
  quotationItemsLoading: false,
  
  contracts: [],
  contractTotal: 0,
  contractListLoading: false,
  selectedContract: null,
  contractItems: [],
  contractItemsLoading: false,
  
  forecasts: [],
  forecastTotal: 0,
  forecastListLoading: false,
  
  commissions: [],
  commissionTotal: 0,
  commissionListLoading: false,
  
  performances: [],
  performanceListLoading: false,
  
  activities: [],
  activityTotal: 0,
  activityListLoading: false,
  
  operationLoading: false,
  operationError: null,
  
  // Actions - 销售机会
  fetchOpportunities: async (params?: SalesOpportunityListParams) => {
    set({ opportunityListLoading: true, opportunityListError: null });
    try {
      const listParams = params || { limit: 50, offset: 0 };
      const opportunities = await salesService.listSalesOpportunities(listParams);
      set({
        opportunities,
        opportunityTotal: opportunities.length,
        opportunityListLoading: false,
      });
    } catch (error) {
      set({
        opportunityListLoading: false,
        opportunityListError: error instanceof Error ? error.message : '获取销售机会列表失败',
      });
    }
  },
  
  fetchOpportunity: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const opportunity = await salesService.getSalesOpportunity(id);
      set({ selectedOpportunity: opportunity, operationLoading: false });
      return opportunity;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取销售机会详情失败',
      });
      throw error;
    }
  },
  
  createOpportunity: async (input: SalesOpportunityCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const opportunity = await salesService.createSalesOpportunity(input);
      set({ operationLoading: false });
      get().fetchOpportunities();
      return opportunity;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建销售机会失败',
      });
      throw error;
    }
  },
  
  updateOpportunity: async (id: number, input: SalesOpportunityCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const opportunity = await salesService.updateSalesOpportunity(id, input);
      set({ operationLoading: false });
      if (get().selectedOpportunity?.id === id) {
        set({ selectedOpportunity: opportunity });
      }
      get().fetchOpportunities();
      return opportunity;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新销售机会失败',
      });
      throw error;
    }
  },
  
  deleteOpportunity: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await salesService.deleteSalesOpportunity(id);
      set({ operationLoading: false });
      if (get().selectedOpportunity?.id === id) {
        set({ selectedOpportunity: null });
      }
      get().fetchOpportunities();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除销售机会失败',
      });
      throw error;
    }
  },
  
  updateOpportunityStage: async (id: number, stage: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const opportunity = await salesService.updateOpportunityStage(id, stage);
      set({ operationLoading: false });
      if (get().selectedOpportunity?.id === id) {
        set({ selectedOpportunity: opportunity });
      }
      get().fetchOpportunities();
      return opportunity;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新销售机会阶段失败',
      });
      throw error;
    }
  },
  
  selectOpportunity: (opportunity: SalesOpportunity | null) => {
    set({ selectedOpportunity: opportunity });
  },
  
  // Actions - 跟进记录
  fetchFollowups: async (opportunityId: number) => {
    set({ followupsLoading: true });
    try {
      const followups = await salesService.listOpportunityFollowups(opportunityId);
      set({ followups, followupsLoading: false });
    } catch (error) {
      set({ followupsLoading: false });
      console.error('获取跟进记录失败:', error);
    }
  },
  
  createFollowup: async (input: OpportunityFollowupCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const followup = await salesService.createOpportunityFollowup(input);
      set({ operationLoading: false });
      get().fetchFollowups(input.opportunityId);
      return followup;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建跟进记录失败',
      });
      throw error;
    }
  },
  
  // Actions - 报价单
  fetchQuotations: async (params?: SalesQuotationListParams) => {
    set({ quotationListLoading: true });
    try {
      const listParams = params || { limit: 50, offset: 0 };
      const quotations = await salesService.listSalesQuotations(listParams);
      set({
        quotations,
        quotationTotal: quotations.length,
        quotationListLoading: false,
      });
    } catch (error) {
      set({ quotationListLoading: false });
      console.error('获取报价单列表失败:', error);
    }
  },
  
  fetchQuotation: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const quotation = await salesService.getSalesQuotation(id);
      set({ selectedQuotation: quotation, operationLoading: false });
      return quotation;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取报价单详情失败',
      });
      throw error;
    }
  },
  
  createQuotation: async (input: SalesQuotationCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const quotation = await salesService.createSalesQuotation(input);
      set({ operationLoading: false });
      get().fetchQuotations();
      return quotation;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建报价单失败',
      });
      throw error;
    }
  },
  
  updateQuotationStatus: async (id: number, status: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const quotation = await salesService.updateQuotationStatus(id, status);
      set({ operationLoading: false });
      if (get().selectedQuotation?.id === id) {
        set({ selectedQuotation: quotation });
      }
      get().fetchQuotations();
      return quotation;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新报价单状态失败',
      });
      throw error;
    }
  },
  
  deleteQuotation: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await salesService.deleteSalesQuotation(id);
      set({ operationLoading: false });
      if (get().selectedQuotation?.id === id) {
        set({ selectedQuotation: null });
      }
      get().fetchQuotations();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除报价单失败',
      });
      throw error;
    }
  },
  
  fetchQuotationItems: async (quotationId: number) => {
    set({ quotationItemsLoading: true });
    try {
      const items = await salesService.getQuotationItems(quotationId);
      set({ quotationItems: items, quotationItemsLoading: false });
    } catch (error) {
      set({ quotationItemsLoading: false });
      console.error('获取报价单明细失败:', error);
    }
  },
  
  selectQuotation: (quotation: SalesQuotation | null) => {
    set({ selectedQuotation: quotation });
  },
  
  // Actions - 销售合同
  fetchContracts: async (params?: SalesContractListParams) => {
    set({ contractListLoading: true });
    try {
      const listParams = params || { limit: 50, offset: 0 };
      const contracts = await salesService.listSalesContracts(listParams);
      set({
        contracts,
        contractTotal: contracts.length,
        contractListLoading: false,
      });
    } catch (error) {
      set({ contractListLoading: false });
      console.error('获取销售合同列表失败:', error);
    }
  },
  
  fetchContract: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contract = await salesService.getSalesContract(id);
      set({ selectedContract: contract, operationLoading: false });
      return contract;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取销售合同详情失败',
      });
      throw error;
    }
  },
  
  createContract: async (input: SalesContractCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contract = await salesService.createSalesContract(input);
      set({ operationLoading: false });
      get().fetchContracts();
      return contract;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建销售合同失败',
      });
      throw error;
    }
  },
  
  updateContractStatus: async (id: number, status: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contract = await salesService.updateContractStatus(id, status);
      set({ operationLoading: false });
      if (get().selectedContract?.id === id) {
        set({ selectedContract: contract });
      }
      get().fetchContracts();
      return contract;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新销售合同状态失败',
      });
      throw error;
    }
  },
  
  updateContractPayment: async (id: number, paidAmount: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const contract = await salesService.updateContractPayment(id, paidAmount);
      set({ operationLoading: false });
      if (get().selectedContract?.id === id) {
        set({ selectedContract: contract });
      }
      get().fetchContracts();
      return contract;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新合同付款失败',
      });
      throw error;
    }
  },
  
  deleteContract: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await salesService.deleteSalesContract(id);
      set({ operationLoading: false });
      if (get().selectedContract?.id === id) {
        set({ selectedContract: null });
      }
      get().fetchContracts();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除销售合同失败',
      });
      throw error;
    }
  },
  
  fetchContractItems: async (contractId: number) => {
    set({ contractItemsLoading: true });
    try {
      const items = await salesService.getContractItems(contractId);
      set({ contractItems: items, contractItemsLoading: false });
    } catch (error) {
      set({ contractItemsLoading: false });
      console.error('获取销售合同明细失败:', error);
    }
  },
  
  selectContract: (contract: SalesContract | null) => {
    set({ selectedContract: contract });
  },
  
  // Actions - 销售预测
  fetchForecasts: async (params?: SalesForecastListParams) => {
    set({ forecastListLoading: true });
    try {
      const listParams = params || { limit: 50, offset: 0 };
      const forecasts = await salesService.listSalesForecasts(listParams);
      set({
        forecasts,
        forecastTotal: forecasts.length,
        forecastListLoading: false,
      });
    } catch (error) {
      set({ forecastListLoading: false });
      console.error('获取销售预测列表失败:', error);
    }
  },
  
  createForecast: async (input: SalesForecastCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const forecast = await salesService.createSalesForecast(input);
      set({ operationLoading: false });
      get().fetchForecasts();
      return forecast;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建销售预测失败',
      });
      throw error;
    }
  },
  
  updateForecastActuals: async (id: number, actualQuantity: number, actualAmount: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const forecast = await salesService.updateSalesForecastActuals(id, actualQuantity, actualAmount);
      set({ operationLoading: false });
      get().fetchForecasts();
      return forecast;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新销售预测实际值失败',
      });
      throw error;
    }
  },
  
  deleteForecast: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await salesService.deleteSalesForecast(id);
      set({ operationLoading: false });
      get().fetchForecasts();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除销售预测失败',
      });
      throw error;
    }
  },
  
  // Actions - 销售佣金
  fetchCommissions: async (params?: SalesCommissionListParams) => {
    set({ commissionListLoading: true });
    try {
      const listParams = params || { limit: 50, offset: 0 };
      const commissions = await salesService.listSalesCommissions(listParams);
      set({
        commissions,
        commissionTotal: commissions.length,
        commissionListLoading: false,
      });
    } catch (error) {
      set({ commissionListLoading: false });
      console.error('获取销售佣金列表失败:', error);
    }
  },
  
  createCommission: async (input: SalesCommissionCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const commission = await salesService.createSalesCommission(input);
      set({ operationLoading: false });
      get().fetchCommissions();
      return commission;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建销售佣金失败',
      });
      throw error;
    }
  },
  
  approveCommission: async (id: number, approvedBy: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const commission = await salesService.approveSalesCommission(id, approvedBy);
      set({ operationLoading: false });
      get().fetchCommissions();
      return commission;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '审批销售佣金失败',
      });
      throw error;
    }
  },
  
  payCommission: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const commission = await salesService.paySalesCommission(id);
      set({ operationLoading: false });
      get().fetchCommissions();
      return commission;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '支付销售佣金失败',
      });
      throw error;
    }
  },
  
  deleteCommission: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await salesService.deleteSalesCommission(id);
      set({ operationLoading: false });
      get().fetchCommissions();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除销售佣金失败',
      });
      throw error;
    }
  },
  
  // Actions - 销售业绩
  fetchPerformances: async (params?: SalesPerformanceListParams) => {
    set({ performanceListLoading: true });
    try {
      const listParams = params || { limit: 50, offset: 0 };
      const performances = await salesService.listSalesPerformance(listParams);
      set({ performances, performanceListLoading: false });
    } catch (error) {
      set({ performanceListLoading: false });
      console.error('获取销售业绩列表失败:', error);
    }
  },
  
  // Actions - 销售活动
  fetchActivities: async (params?: SalesActivityListParams) => {
    set({ activityListLoading: true });
    try {
      const listParams = params || { limit: 50, offset: 0 };
      const activities = await salesService.listSalesActivities(listParams);
      set({
        activities,
        activityTotal: activities.length,
        activityListLoading: false,
      });
    } catch (error) {
      set({ activityListLoading: false });
      console.error('获取销售活动列表失败:', error);
    }
  },
  
  createActivity: async (input: SalesActivityCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const activity = await salesService.createSalesActivity(input);
      set({ operationLoading: false });
      get().fetchActivities();
      return activity;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建销售活动失败',
      });
      throw error;
    }
  },
  
  completeActivity: async (id: number, outcome: string, actualTime: string, durationMinutes: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const activity = await salesService.completeSalesActivity(id, outcome, actualTime, durationMinutes);
      set({ operationLoading: false });
      get().fetchActivities();
      return activity;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '完成销售活动失败',
      });
      throw error;
    }
  },
  
  deleteActivity: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await salesService.deleteSalesActivity(id);
      set({ operationLoading: false });
      get().fetchActivities();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除销售活动失败',
      });
      throw error;
    }
  },
  
  // Actions - 工具
  clearError: () => {
    set({
      operationError: null,
      opportunityListError: null,
    });
  },
}));
