// 系统设置模块 TypeScript 类型定义

// ==================== 系统参数 ====================

export interface SystemSetting {
  id: number;
  settingKey: string;
  settingValue: string | null;
  settingType: 'string' | 'number' | 'boolean' | 'json' | 'text';
  category: 'general' | 'security' | 'notification' | 'integration' | 'ui' | 'backup' | 'other';
  description: string | null;
  isEditable: boolean;
  isEncrypted: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingCreateInput {
  settingKey: string;
  settingValue?: string | null;
  settingType?: 'string' | 'number' | 'boolean' | 'json' | 'text';
  category?: 'general' | 'security' | 'notification' | 'integration' | 'ui' | 'backup' | 'other';
  description?: string | null;
  isEditable?: boolean;
  isEncrypted?: boolean;
}

export interface SystemSettingUpdateInput {
  settingValue?: string | null;
  description?: string | null;
}

export interface SystemSettingCategory {
  category: string;
  count: number;
}

// ==================== 数据字典 ====================

export interface DataDictionary {
  id: number;
  dictCode: string;
  dictName: string;
  dictType: 'system' | 'custom';
  description: string | null;
  isActive: boolean;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
  items?: DataDictionaryItem[];
}

export interface DataDictionaryItem {
  id: number;
  dictId: number;
  itemKey: string;
  itemValue: string;
  itemLabel: string;
  sortOrder: number;
  color: string | null;
  icon: string | null;
  isDefault: boolean;
  isActive: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DataDictionaryCreateInput {
  dictCode: string;
  dictName: string;
  dictType?: 'system' | 'custom';
  description?: string | null;
  items?: DataDictionaryItemInput[];
}

export interface DataDictionaryItemInput {
  itemKey: string;
  itemValue: string;
  itemLabel: string;
  sortOrder?: number;
  color?: string | null;
  icon?: string | null;
  isDefault?: boolean;
  description?: string | null;
}

export interface DataDictionaryUpdateInput {
  dictName?: string;
  description?: string | null;
  isActive?: boolean;
}

// ==================== 操作日志 ====================

export interface OperationLog {
  id: number;
  logNo: string;
  userId: number | null;
  userName: string | null;
  action: string;
  module: string | null;
  subModule: string | null;
  operationType: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import' | 'login' | 'logout' | 'other';
  requestMethod: string | null;
  requestUrl: string | null;
  requestParams: string | null;
  responseStatus: number | null;
  responseData: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  durationMs: number | null;
  status: 'success' | 'failure' | 'error';
  errorMessage: string | null;
  createdAt: string;
}

export interface OperationLogQuery {
  userId?: number | null;
  action?: string;
  module?: string;
  operationType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

// ==================== 审计日志 ====================

export interface AuditLog {
  id: number;
  auditNo: string;
  userId: number | null;
  userName: string | null;
  action: string;
  resourceType: string;
  resourceId: number | null;
  oldValue: string | null;
  newValue: string | null;
  changedFields: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

// ==================== 备份配置 ====================

export interface BackupConfig {
  id: number;
  configName: string;
  backupType: 'full' | 'incremental' | 'differential';
  backupTarget: 'local' | 'remote' | 'cloud';
  backupPath: string | null;
  cloudProvider: string | null;
  cloudBucket: string | null;
  cloudRegion: string | null;
  cloudAccessKey: string | null;
  cloudSecretKey: string | null;
  scheduleType: 'manual' | 'daily' | 'weekly' | 'monthly' | 'custom';
  scheduleTime: string | null;
  scheduleDays: string | null;
  retentionDays: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  encryptionPassword: string | null;
  notificationEnabled: boolean;
  notificationEmails: string | null;
  isActive: boolean;
  lastBackupAt: string | null;
  lastBackupStatus: string | null;
  lastBackupSize: number | null;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BackupConfigCreateInput {
  configName: string;
  backupType?: 'full' | 'incremental' | 'differential';
  backupTarget?: 'local' | 'remote' | 'cloud';
  backupPath?: string | null;
  cloudProvider?: string | null;
  cloudBucket?: string | null;
  cloudRegion?: string | null;
  scheduleType?: 'manual' | 'daily' | 'weekly' | 'monthly' | 'custom';
  scheduleTime?: string | null;
  scheduleDays?: string | null;
  retentionDays?: number;
  compressionEnabled?: boolean;
  encryptionEnabled?: boolean;
  notificationEnabled?: boolean;
  notificationEmails?: string | null;
}

export interface BackupConfigUpdateInput {
  configName?: string;
  backupPath?: string | null;
  scheduleTime?: string | null;
  retentionDays?: number;
  compressionEnabled?: boolean;
  encryptionEnabled?: boolean;
  notificationEnabled?: boolean;
  notificationEmails?: string | null;
  isActive?: boolean;
}

export interface BackupRecord {
  id: number;
  backupNo: string;
  configId: number | null;
  backupType: string;
  backupPath: string;
  fileSize: number | null;
  fileHash: string | null;
  startTime: string | null;
  endTime: string | null;
  durationSeconds: number | null;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  errorMessage: string | null;
  isRestored: boolean;
  restoredAt: string | null;
  restoredBy: number | null;
  createdBy: number | null;
  createdAt: string;
}

// ==================== 权限配置 ====================

export interface PermissionConfig {
  id: number;
  roleId: number;
  moduleCode: string;
  moduleName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canImport: boolean;
  canApprove: boolean;
  customPermissions: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionConfigCreateInput {
  roleId: number;
  moduleCode: string;
  moduleName: string;
  canView?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canApprove?: boolean;
  customPermissions?: Record<string, unknown> | null;
}

export interface PermissionConfigUpdateInput {
  canView?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canImport?: boolean;
  canApprove?: boolean;
  customPermissions?: Record<string, unknown> | null;
}

export interface DataPermission {
  id: number;
  roleId: number;
  resourceType: string;
  scopeType: 'all' | 'department' | 'self' | 'custom';
  scopeValue: string | null;
  filterConditions: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== 通知配置 ====================

export interface NotificationConfig {
  id: number;
  notificationType: 'email' | 'sms' | 'push' | 'in_app' | 'webhook';
  notificationName: string;
  eventTrigger: string;
  isEnabled: boolean;
  templateSubject: string | null;
  templateContent: string | null;
  templateVariables: string | null;
  recipientsType: 'all' | 'role' | 'department' | 'specific';
  recipientsValue: string | null;
  webhookUrl: string | null;
  retryCount: number;
  retryIntervalSeconds: number;
  rateLimitPerHour: number | null;
  isActive: boolean;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationConfigCreateInput {
  notificationType: 'email' | 'sms' | 'push' | 'in_app' | 'webhook';
  notificationName: string;
  eventTrigger: string;
  isEnabled?: boolean;
  templateSubject?: string | null;
  templateContent?: string | null;
  recipientsType?: 'all' | 'role' | 'department' | 'specific';
  recipientsValue?: string | null;
  webhookUrl?: string | null;
  retryCount?: number;
  retryIntervalSeconds?: number;
}

export interface NotificationConfigUpdateInput {
  notificationName?: string;
  isEnabled?: boolean;
  templateSubject?: string | null;
  templateContent?: string | null;
  recipientsValue?: string | null;
  webhookUrl?: string | null;
  isActive?: boolean;
}

// ==================== 集成配置 ====================

export interface IntegrationConfig {
  id: number;
  integrationName: string;
  integrationType: 'api' | 'webhook' | 'oauth' | 'database' | 'file' | 'other';
  provider: string | null;
  baseUrl: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  oauthClientId: string | null;
  oauthClientSecret: string | null;
  oauthRedirectUri: string | null;
  oauthAccessToken: string | null;
  oauthRefreshToken: string | null;
  oauthExpiresAt: string | null;
  configData: Record<string, unknown> | null;
  isActive: boolean;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConfigCreateInput {
  integrationName: string;
  integrationType: 'api' | 'webhook' | 'oauth' | 'database' | 'file' | 'other';
  provider?: string | null;
  baseUrl?: string | null;
  apiKey?: string | null;
  apiSecret?: string | null;
  configData?: Record<string, unknown> | null;
}

export interface IntegrationConfigUpdateInput {
  baseUrl?: string | null;
  apiKey?: string | null;
  apiSecret?: string | null;
  configData?: Record<string, unknown> | null;
  isActive?: boolean;
}

export interface IntegrationSyncLog {
  id: number;
  integrationId: number;
  syncType: string | null;
  syncDirection: 'inbound' | 'outbound' | 'bidirectional' | null;
  recordsProcessed: number | null;
  recordsSuccess: number | null;
  recordsFailed: number | null;
  errorMessage: string | null;
  startTime: string | null;
  endTime: string | null;
  durationSeconds: number | null;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'partial';
  createdAt: string;
}

// ==================== 自定义字段 ====================

export interface CustomField {
  id: number;
  entityType: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'select' | 'multi_select' | 'textarea' | 'file' | 'url' | 'email' | 'phone';
  fieldOptions: Record<string, unknown> | null;
  isRequired: boolean;
  isUnique: boolean;
  defaultValue: string | null;
  validationRules: Record<string, unknown> | null;
  sortOrder: number;
  isActive: boolean;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomFieldCreateInput {
  entityType: string;
  fieldName: string;
  fieldLabel: string;
  fieldType?: 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'select' | 'multi_select' | 'textarea' | 'file' | 'url' | 'email' | 'phone';
  fieldOptions?: Record<string, unknown> | null;
  isRequired?: boolean;
  isUnique?: boolean;
  defaultValue?: string | null;
  validationRules?: Record<string, unknown> | null;
  sortOrder?: number;
}

export interface CustomFieldUpdateInput {
  fieldLabel?: string;
  fieldOptions?: Record<string, unknown> | null;
  isRequired?: boolean;
  defaultValue?: string | null;
  validationRules?: Record<string, unknown> | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CustomFieldValue {
  id: number;
  fieldId: number;
  entityId: number;
  fieldValue: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== 工作流配置 ====================

export interface WorkflowConfig {
  id: number;
  workflowName: string;
  entityType: string;
  triggerType: 'create' | 'update' | 'delete' | 'status_change' | 'scheduled' | 'manual';
  triggerConditions: string | null;
  actions: string;
  isActive: boolean;
  executionOrder: number;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowConfigCreateInput {
  workflowName: string;
  entityType: string;
  triggerType: 'create' | 'update' | 'delete' | 'status_change' | 'scheduled' | 'manual';
  triggerConditions?: string | null;
  actions: string;
  executionOrder?: number;
}

export interface WorkflowConfigUpdateInput {
  workflowName?: string;
  triggerConditions?: string | null;
  actions?: string;
  isActive?: boolean;
  executionOrder?: number;
}

export interface WorkflowLog {
  id: number;
  workflowId: number;
  entityType: string | null;
  entityId: number | null;
  triggerType: string;
  executionStatus: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  executionResult: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}
