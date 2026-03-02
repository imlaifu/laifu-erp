// ============================================================
// 报表管理模块 - TypeScript 类型定义
// 创建时间：2026-03-03
// ============================================================

// ============================================================
// 报表定义
// ============================================================

export interface ReportDefinition {
  id: string;
  name: string;
  code: string;
  category: ReportCategory;
  description?: string;
  sql_template: string;
  parameters?: string; // JSON string
  columns_config?: string; // JSON string
  is_system: boolean;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type ReportCategory = 'dashboard' | 'sales' | 'inventory' | 'finance';

export interface CreateReportDefinitionDto {
  name: string;
  code: string;
  category: ReportCategory;
  description?: string;
  sql_template: string;
  parameters?: string;
  columns_config?: string;
}

export interface UpdateReportDefinitionDto {
  name?: string;
  description?: string;
  sql_template?: string;
  parameters?: string;
  columns_config?: string;
  is_active?: boolean;
}

// ============================================================
// 报表执行
// ============================================================

export interface ReportExecution {
  id: string;
  report_id: string;
  parameters?: string;
  result_count: number;
  execution_time_ms?: number;
  status: 'success' | 'failed' | 'running';
  error_message?: string;
  executed_by?: string;
  executed_at: string;
}

export interface ExecuteReportDto {
  report_id: string;
  parameters?: string;
}

export interface ExecuteReportResult {
  data: any[];
  columns_config?: string;
  execution_time_ms: number;
  result_count: number;
}

export interface ExecuteDynamicQueryDto {
  sql: string;
  parameters?: any[];
}

// ============================================================
// Dashboard Widgets
// ============================================================

export interface DashboardWidget {
  id: string;
  user_id: string;
  widget_type: WidgetType;
  widget_key: string;
  title: string;
  config?: string; // JSON string
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  is_visible: boolean;
  refresh_interval: number;
  created_at: string;
  updated_at: string;
}

export type WidgetType = 'chart' | 'metric' | 'table' | 'list';

export interface CreateDashboardWidgetDto {
  widget_type: WidgetType;
  widget_key: string;
  title: string;
  config?: string;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  refresh_interval?: number;
}

export interface UpdateDashboardWidgetDto {
  title?: string;
  config?: string;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  is_visible?: boolean;
  refresh_interval?: number;
}

export interface DashboardData {
  widgets: Record<string, WidgetData>;
}

export interface WidgetData {
  title: string;
  type: WidgetType;
  data?: any;
}

export interface GetDashboardDataDto {
  user_id: string;
  widget_keys?: string[];
}

// ============================================================
// 保存的报表
// ============================================================

export interface SavedReport {
  id: string;
  user_id: string;
  name: string;
  report_definition_id?: string;
  parameters?: string;
  filters?: string;
  sort_config?: string;
  is_public: boolean;
  is_favorite: boolean;
  last_executed_at?: string;
  execution_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSavedReportDto {
  name: string;
  report_definition_id?: string;
  parameters?: string;
  filters?: string;
  sort_config?: string;
  is_public?: boolean;
}

// ============================================================
// 导出历史
// ============================================================

export interface ExportHistory {
  id: string;
  user_id: string;
  export_type: ExportType;
  source_type: ExportSourceType;
  source_id?: string;
  file_name: string;
  file_path?: string;
  file_size_bytes?: number;
  record_count?: number;
  status: ExportStatus;
  error_message?: string;
  expires_at?: string;
  downloaded_at?: string;
  created_at: string;
}

export type ExportType = 'csv' | 'excel' | 'pdf' | 'json';
export type ExportSourceType = 'report' | 'list' | 'detail';
export type ExportStatus = 'pending' | 'completed' | 'failed';

// ============================================================
// 统计快照
// ============================================================

export interface StatsSnapshot {
  id: string;
  stats_type: StatsType;
  stats_date: string;
  data: string; // JSON string
  created_at: string;
}

export type StatsType = 'sales_daily' | 'inventory_summary' | 'finance_monthly';

// ============================================================
// 报表列配置
// ============================================================

export interface ColumnConfig {
  key: string;
  label: string;
  type: ColumnType;
}

export type ColumnType = 'text' | 'number' | 'currency' | 'date' | 'datetime' | 'boolean' | 'status';

// ============================================================
// 报表参数配置
// ============================================================

export interface ReportParameter {
  name: string;
  label: string;
  type: ParameterType;
  required?: boolean;
  default?: any;
  options?: ParameterOption[];
}

export type ParameterType = 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select';

export interface ParameterOption {
  value: string;
  label: string;
}

// ============================================================
// Dashboard 统计卡片数据
// ============================================================

export interface MetricCardData {
  title: string;
  value: number | string;
  trend?: number; // 百分比变化
  trendLabel?: string;
  icon?: string;
  color?: string;
}

// ============================================================
// 报表查询参数
// ============================================================

export interface ReportQueryParams {
  category?: ReportCategory;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}
