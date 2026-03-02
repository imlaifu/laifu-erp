// ============================================================
// 报表管理模块 - Zustand Store
// 创建时间：2026-03-03
// ============================================================

import { create } from 'zustand';
import type {
  ReportDefinition,
  ReportExecution,
  DashboardWidget,
  DashboardData,
  SavedReport,
  ExportHistory,
  StatsSnapshot,
  ReportCategory,
  ExecuteReportResult,
} from '../types/reports';
import * as reportsService from '../services/reportsService';

// ============================================================
// State Types
// ============================================================

interface ReportsState {
  // 报表定义
  reportDefinitions: ReportDefinition[];
  loadingDefinitions: boolean;
  definitionsError: string | null;
  
  // 报表执行
  executingReports: Set<string>;
  executionResults: Map<string, ExecuteReportResult>;
  executionHistory: ReportExecution[];
  
  // Dashboard
  dashboardWidgets: DashboardWidget[];
  dashboardData: DashboardData | null;
  loadingDashboard: boolean;
  
  // 保存的报表
  savedReports: SavedReport[];
  loadingSavedReports: boolean;
  
  // 导出历史
  exportHistory: ExportHistory[];
  loadingExportHistory: boolean;
  
  // 统计快照
  statsSnapshots: Map<string, StatsSnapshot>;
  
  // Actions - 报表定义
  fetchReportDefinitions: (category?: ReportCategory, isActive?: boolean) => Promise<void>;
  createReportDefinition: (data: any, userId?: string) => Promise<ReportDefinition>;
  updateReportDefinition: (reportId: string, data: any) => Promise<ReportDefinition>;
  deleteReportDefinition: (reportId: string) => Promise<void>;
  
  // Actions - 报表执行
  executeReport: (reportId: string, parameters?: any, userId?: string) => Promise<ExecuteReportResult>;
  getExecutionHistory: (reportId?: string, limit?: number) => Promise<void>;
  clearExecutionResult: (reportId: string) => void;
  
  // Actions - Dashboard
  fetchDashboardWidgets: (userId: string) => Promise<void>;
  createDashboardWidget: (userId: string, data: any) => Promise<DashboardWidget>;
  updateDashboardWidget: (widgetId: string, data: any) => Promise<DashboardWidget>;
  deleteDashboardWidget: (widgetId: string, userId: string) => Promise<void>;
  refreshDashboardData: (userId: string, widgetKeys?: string[]) => Promise<void>;
  
  // Actions - 保存的报表
  fetchSavedReports: (userId: string, includePublic?: boolean) => Promise<void>;
  createSavedReport: (userId: string, data: any) => Promise<SavedReport>;
  updateSavedReport: (reportId: string, userId: string, updates: any) => Promise<SavedReport>;
  deleteSavedReport: (reportId: string, userId: string) => Promise<void>;
  executeSavedReport: (reportId: string, userId: string) => Promise<ExecuteReportResult>;
  
  // Actions - 导出历史
  fetchExportHistory: (userId: string, limit?: number) => Promise<void>;
  
  // Actions - 统计快照
  setStatsSnapshot: (statsType: string, statsDate: string, data: any) => Promise<void>;
  getStatsSnapshot: (statsType: string, statsDate: string) => Promise<StatsSnapshot | null>;
  
  // Utility
  reset: () => void;
}

// ============================================================
// Store Creation
// ============================================================

export const useReportsStore = create<ReportsState>((set) => ({
  // Initial State
  reportDefinitions: [],
  loadingDefinitions: false,
  definitionsError: null,
  
  executingReports: new Set(),
  executionResults: new Map(),
  executionHistory: [],
  
  dashboardWidgets: [],
  dashboardData: null,
  loadingDashboard: false,
  
  savedReports: [],
  loadingSavedReports: false,
  
  exportHistory: [],
  loadingExportHistory: false,
  
  statsSnapshots: new Map(),
  
  // ============================================================
  // Actions - 报表定义
  // ============================================================
  
  fetchReportDefinitions: async (category, isActive) => {
    set({ loadingDefinitions: true, definitionsError: null });
    try {
      const definitions = await reportsService.getReportDefinitions(category, isActive);
      set({ reportDefinitions: definitions, loadingDefinitions: false });
    } catch (error) {
      set({ 
        definitionsError: error instanceof Error ? error.message : '获取报表定义失败',
        loadingDefinitions: false 
      });
    }
  },
  
  createReportDefinition: async (data, userId) => {
    const definition = await reportsService.createReportDefinition(data, userId);
    set((state) => ({
      reportDefinitions: [...state.reportDefinitions, definition],
    }));
    return definition;
  },
  
  updateReportDefinition: async (reportId, data) => {
    const definition = await reportsService.updateReportDefinition(reportId, data);
    set((state) => ({
      reportDefinitions: state.reportDefinitions.map((d) =>
        d.id === reportId ? definition : d
      ),
    }));
    return definition;
  },
  
  deleteReportDefinition: async (reportId) => {
    await reportsService.deleteReportDefinition(reportId);
    set((state) => ({
      reportDefinitions: state.reportDefinitions.filter((d) => d.id !== reportId),
    }));
  },
  
  // ============================================================
  // Actions - 报表执行
  // ============================================================
  
  executeReport: async (reportId, parameters, userId) => {
    set((state) => {
      const newSet = new Set(state.executingReports);
      newSet.add(reportId);
      return { executingReports: newSet };
    });
    
    try {
      const result = await reportsService.executeReport(
        { report_id: reportId, parameters: JSON.stringify(parameters) },
        userId
      );
      
      set((state) => {
        const newResults = new Map(state.executionResults);
        newResults.set(reportId, result);
        const newSet = new Set(state.executingReports);
        newSet.delete(reportId);
        return { executionResults: newResults, executingReports: newSet };
      });
      
      return result;
    } catch (error) {
      set((state) => {
        const newSet = new Set(state.executingReports);
        newSet.delete(reportId);
        return { executingReports: newSet };
      });
      throw error;
    }
  },
  
  getExecutionHistory: async (reportId, limit) => {
    const history = await reportsService.getReportExecutions(reportId, limit);
    set({ executionHistory: history });
  },
  
  clearExecutionResult: (reportId) => {
    set((state) => {
      const newResults = new Map(state.executionResults);
      newResults.delete(reportId);
      return { executionResults: newResults };
    });
  },
  
  // ============================================================
  // Actions - Dashboard
  // ============================================================
  
  fetchDashboardWidgets: async (userId) => {
    set({ loadingDashboard: true });
    try {
      const widgets = await reportsService.getDashboardWidgets(userId);
      set({ dashboardWidgets: widgets, loadingDashboard: false });
    } catch (error) {
      set({ loadingDashboard: false });
      console.error('Failed to fetch dashboard widgets:', error);
    }
  },
  
  createDashboardWidget: async (userId, data) => {
    const widget = await reportsService.createDashboardWidget(userId, data);
    set((state) => ({
      dashboardWidgets: [...state.dashboardWidgets, widget],
    }));
    return widget;
  },
  
  updateDashboardWidget: async (widgetId, data) => {
    const widget = await reportsService.updateDashboardWidget(widgetId, data);
    set((state) => ({
      dashboardWidgets: state.dashboardWidgets.map((w) =>
        w.id === widgetId ? widget : w
      ),
    }));
    return widget;
  },
  
  deleteDashboardWidget: async (widgetId, userId) => {
    await reportsService.deleteDashboardWidget(widgetId, userId);
    set((state) => ({
      dashboardWidgets: state.dashboardWidgets.filter((w) => w.id !== widgetId),
    }));
  },
  
  refreshDashboardData: async (userId, widgetKeys) => {
    try {
      const data = await reportsService.getDashboardData({
        user_id: userId,
        widget_keys: widgetKeys,
      });
      set({ dashboardData: data });
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error);
    }
  },
  
  // ============================================================
  // Actions - 保存的报表
  // ============================================================
  
  fetchSavedReports: async (userId, includePublic) => {
    set({ loadingSavedReports: true });
    try {
      const reports = await reportsService.getSavedReports(userId, includePublic);
      set({ savedReports: reports, loadingSavedReports: false });
    } catch (error) {
      set({ loadingSavedReports: false });
      console.error('Failed to fetch saved reports:', error);
    }
  },
  
  createSavedReport: async (userId, data) => {
    const report = await reportsService.createSavedReport(userId, data);
    set((state) => ({
      savedReports: [...state.savedReports, report],
    }));
    return report;
  },
  
  updateSavedReport: async (reportId, userId, updates) => {
    const report = await reportsService.updateSavedReport(
      reportId,
      userId,
      updates.name,
      updates.isFavorite,
      updates.isPublic
    );
    set((state) => ({
      savedReports: state.savedReports.map((r) =>
        r.id === reportId ? report : r
      ),
    }));
    return report;
  },
  
  deleteSavedReport: async (reportId, userId) => {
    await reportsService.deleteSavedReport(reportId, userId);
    set((state) => ({
      savedReports: state.savedReports.filter((r) => r.id !== reportId),
    }));
  },
  
  executeSavedReport: async (reportId, userId) => {
    return await reportsService.executeSavedReport(reportId, userId);
  },
  
  // ============================================================
  // Actions - 导出历史
  // ============================================================
  
  fetchExportHistory: async (userId, limit) => {
    set({ loadingExportHistory: true });
    try {
      const history = await reportsService.getExportHistory(userId, limit);
      set({ exportHistory: history, loadingExportHistory: false });
    } catch (error) {
      set({ loadingExportHistory: false });
      console.error('Failed to fetch export history:', error);
    }
  },
  
  // ============================================================
  // Actions - 统计快照
  // ============================================================
  
  setStatsSnapshot: async (statsType, statsDate, data) => {
    const snapshot = await reportsService.upsertStatsSnapshot(
      statsType,
      statsDate,
      JSON.stringify(data)
    );
    set((state) => ({
      statsSnapshots: new Map(state.statsSnapshots).set(`${statsType}_${statsDate}`, snapshot),
    }));
  },
  
  getStatsSnapshot: async (statsType, statsDate) => {
    const snapshot = await reportsService.getStatsSnapshot(statsType, statsDate);
    if (snapshot) {
      set((state) => ({
        statsSnapshots: new Map(state.statsSnapshots).set(`${statsType}_${statsDate}`, snapshot),
      }));
    }
    return snapshot;
  },
  
  // ============================================================
  // Utility
  // ============================================================
  
  reset: () => {
    set({
      reportDefinitions: [],
      loadingDefinitions: false,
      definitionsError: null,
      executingReports: new Set(),
      executionResults: new Map(),
      executionHistory: [],
      dashboardWidgets: [],
      dashboardData: null,
      loadingDashboard: false,
      savedReports: [],
      loadingSavedReports: false,
      exportHistory: [],
      loadingExportHistory: false,
      statsSnapshots: new Map(),
    });
  },
}));

// ============================================================
// Selectors
// ============================================================

export const selectReportDefinitionsByCategory = (category: ReportCategory) => (state: ReportsState) =>
  state.reportDefinitions.filter((d) => d.category === category);

export const selectActiveReportDefinitions = (state: ReportsState) =>
  state.reportDefinitions.filter((d) => d.is_active);

export const selectSystemReportDefinitions = (state: ReportsState) =>
  state.reportDefinitions.filter((d) => d.is_system);

export const selectFavoriteSavedReports = (state: ReportsState) =>
  state.savedReports.filter((r) => r.is_favorite);

export const selectVisibleWidgets = (state: ReportsState) =>
  state.dashboardWidgets.filter((w) => w.is_visible);

export const selectPendingExports = (state: ReportsState) =>
  state.exportHistory.filter((e) => e.status === 'pending');

export const selectCompletedExports = (state: ReportsState) =>
  state.exportHistory.filter((e) => e.status === 'completed');
