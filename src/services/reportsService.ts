// ============================================================
// 报表管理模块 - API 服务
// 创建时间：2026-03-03
// ============================================================

import { invoke } from '@tauri-apps/api/core';
import type {
  ReportDefinition,
  CreateReportDefinitionDto,
  UpdateReportDefinitionDto,
  ReportExecution,
  ExecuteReportDto,
  ExecuteReportResult,
  ExecuteDynamicQueryDto,
  DashboardWidget,
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
  DashboardData,
  GetDashboardDataDto,
  SavedReport,
  CreateSavedReportDto,
  ExportHistory,
  StatsSnapshot,
  ReportCategory,
} from '../types/reports';

// ============================================================
// 报表定义相关 API
// ============================================================

/**
 * 获取所有报表定义
 */
export async function getReportDefinitions(
  category?: ReportCategory,
  isActive?: boolean
): Promise<ReportDefinition[]> {
  return invoke<ReportDefinition[]>('get_report_definitions', {
    category,
    isActive,
  });
}

/**
 * 根据 ID 获取报表定义
 */
export async function getReportDefinition(reportId: string): Promise<ReportDefinition> {
  return invoke<ReportDefinition>('get_report_definition', { reportId });
}

/**
 * 创建报表定义
 */
export async function createReportDefinition(
  data: CreateReportDefinitionDto,
  userId?: string
): Promise<ReportDefinition> {
  return invoke<ReportDefinition>('create_report_definition', { data, userId });
}

/**
 * 更新报表定义
 */
export async function updateReportDefinition(
  reportId: string,
  data: UpdateReportDefinitionDto
): Promise<ReportDefinition> {
  return invoke<ReportDefinition>('update_report_definition', { reportId, data });
}

/**
 * 删除报表定义
 */
export async function deleteReportDefinition(reportId: string): Promise<void> {
  return invoke<void>('delete_report_definition', { reportId });
}

// ============================================================
// 报表执行相关 API
// ============================================================

/**
 * 执行报表
 */
export async function executeReport(
  data: ExecuteReportDto,
  userId?: string
): Promise<ExecuteReportResult> {
  return invoke<ExecuteReportResult>('execute_report', { data, userId });
}

/**
 * 执行动态 SQL 查询
 */
export async function executeDynamicQuery(data: ExecuteDynamicQueryDto): Promise<any[]> {
  return invoke<any[]>('execute_dynamic_query', { data });
}

/**
 * 获取报表执行历史
 */
export async function getReportExecutions(
  reportId?: string,
  limit?: number
): Promise<ReportExecution[]> {
  return invoke<ReportExecution[]>('get_report_executions', { reportId, limit });
}

// ============================================================
// Dashboard Widgets 相关 API
// ============================================================

/**
 * 获取用户 Dashboard widgets
 */
export async function getDashboardWidgets(userId: string): Promise<DashboardWidget[]> {
  return invoke<DashboardWidget[]>('get_dashboard_widgets', { userId });
}

/**
 * 创建 Dashboard widget
 */
export async function createDashboardWidget(
  userId: string,
  data: CreateDashboardWidgetDto
): Promise<DashboardWidget> {
  return invoke<DashboardWidget>('create_dashboard_widget', { userId, data });
}

/**
 * 更新 Dashboard widget
 */
export async function updateDashboardWidget(
  widgetId: string,
  data: UpdateDashboardWidgetDto
): Promise<DashboardWidget> {
  return invoke<DashboardWidget>('update_dashboard_widget', { widgetId, data });
}

/**
 * 删除 Dashboard widget
 */
export async function deleteDashboardWidget(widgetId: string, userId: string): Promise<void> {
  return invoke<void>('delete_dashboard_widget', { widgetId, userId });
}

/**
 * 获取 Dashboard 数据 (批量获取 widget 数据)
 */
export async function getDashboardData(data: GetDashboardDataDto): Promise<DashboardData> {
  return invoke<DashboardData>('get_dashboard_data', { data });
}

// ============================================================
// 保存报表相关 API
// ============================================================

/**
 * 获取用户保存的报表
 */
export async function getSavedReports(
  userId: string,
  includePublic?: boolean
): Promise<SavedReport[]> {
  return invoke<SavedReport[]>('get_saved_reports', { userId, includePublic });
}

/**
 * 创建保存的报表
 */
export async function createSavedReport(
  userId: string,
  data: CreateSavedReportDto
): Promise<SavedReport> {
  return invoke<SavedReport>('create_saved_report', { userId, data });
}

/**
 * 更新保存的报表
 */
export async function updateSavedReport(
  reportId: string,
  userId: string,
  name?: string,
  isFavorite?: boolean,
  isPublic?: boolean
): Promise<SavedReport> {
  return invoke<SavedReport>('update_saved_report', {
    reportId,
    userId,
    name,
    isFavorite,
    isPublic,
  });
}

/**
 * 删除保存的报表
 */
export async function deleteSavedReport(reportId: string, userId: string): Promise<void> {
  return invoke<void>('delete_saved_report', { reportId, userId });
}

/**
 * 执行保存的报表
 */
export async function executeSavedReport(
  reportId: string,
  userId: string
): Promise<ExecuteReportResult> {
  return invoke<ExecuteReportResult>('execute_saved_report', { reportId, userId });
}

// ============================================================
// 导出历史相关 API
// ============================================================

/**
 * 创建导出记录
 */
export async function createExportRecord(
  userId: string,
  exportType: string,
  sourceType: string,
  sourceId?: string,
  fileName?: string,
  recordCount?: number
): Promise<ExportHistory> {
  return invoke<ExportHistory>('create_export_record', {
    userId,
    exportType,
    sourceType,
    sourceId,
    fileName,
    recordCount,
  });
}

/**
 * 更新导出记录状态
 */
export async function updateExportRecord(
  exportId: string,
  userId: string,
  status: string,
  filePath?: string,
  fileSizeBytes?: number,
  errorMessage?: string
): Promise<void> {
  return invoke<void>('update_export_record', {
    exportId,
    userId,
    status,
    filePath,
    fileSizeBytes,
    errorMessage,
  });
}

/**
 * 获取导出历史
 */
export async function getExportHistory(
  userId: string,
  limit?: number
): Promise<ExportHistory[]> {
  return invoke<ExportHistory[]>('get_export_history', { userId, limit });
}

// ============================================================
// 统计快照相关 API
// ============================================================

/**
 * 创建或更新统计快照
 */
export async function upsertStatsSnapshot(
  statsType: string,
  statsDate: string,
  data: string
): Promise<StatsSnapshot> {
  return invoke<StatsSnapshot>('upsert_stats_snapshot', {
    statsType,
    statsDate,
    data,
  });
}

/**
 * 获取统计快照
 */
export async function getStatsSnapshot(
  statsType: string,
  statsDate: string
): Promise<StatsSnapshot | null> {
  return invoke<StatsSnapshot | null>('get_stats_snapshot', {
    statsType,
    statsDate,
  });
}

// ============================================================
// 辅助函数
// ============================================================

/**
 * 解析列配置
 */
export function parseColumnsConfig(config?: string): Array<{ key: string; label: string; type: string }> {
  if (!config) return [];
  try {
    return JSON.parse(config);
  } catch {
    return [];
  }
}

/**
 * 解析报表参数
 */
export function parseReportParameters(params?: string): Record<string, any> {
  if (!params) return {};
  try {
    return JSON.parse(params);
  } catch {
    return {};
  }
}

/**
 * 格式化导出数据
 */
export function formatExportData(data: any[], columns?: Array<{ key: string; label: string }>): string {
  if (!data || data.length === 0) return '';
  
  const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }));
  
  // CSV 格式
  const header = cols.map(c => c.label).join(',');
  const rows = data.map(row => 
    cols.map(c => {
      const value = row[c.key];
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',')
  );
  
  return [header, ...rows].join('\n');
}
