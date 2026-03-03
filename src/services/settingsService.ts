// 系统设置模块 API 服务

import { invoke } from '@tauri-apps/api/core';
import type {
  SystemSetting,
  SystemSettingCreateInput,
  SystemSettingUpdateInput,
  DataDictionary,
  DataDictionaryCreateInput,
  DataDictionaryUpdateInput,
  OperationLog,
  OperationLogQuery,
  AuditLog,
  BackupConfig,
  BackupConfigCreateInput,
  BackupConfigUpdateInput,
  PermissionConfig,
  PermissionConfigCreateInput,
  PermissionConfigUpdateInput,
  NotificationConfig,
  NotificationConfigCreateInput,
  NotificationConfigUpdateInput,
  IntegrationConfig,
  IntegrationConfigCreateInput,
  IntegrationConfigUpdateInput,
  CustomField,
  CustomFieldCreateInput,
  CustomFieldUpdateInput,
  WorkflowConfig,
  WorkflowConfigCreateInput,
  WorkflowConfigUpdateInput,
} from '../types/settings';

// ==================== 系统参数 API ====================

export const createSystemSetting = async (input: SystemSettingCreateInput): Promise<SystemSetting> => {
  return invoke<SystemSetting>('create_system_setting', { input });
};

export const getSystemSetting = async (id: number): Promise<SystemSetting> => {
  return invoke<SystemSetting>('get_system_setting', { id });
};

export const getAllSystemSettings = async (): Promise<SystemSetting[]> => {
  return invoke<SystemSetting[]>('get_all_system_settings');
};

export const getSystemSettingsByCategory = async (category: string): Promise<SystemSetting[]> => {
  return invoke<SystemSetting[]>('get_system_settings_by_category', { category });
};

export const updateSystemSetting = async (id: number, input: SystemSettingUpdateInput): Promise<SystemSetting> => {
  return invoke<SystemSetting>('update_system_setting', { id, input });
};

export const deleteSystemSetting = async (id: number): Promise<void> => {
  return invoke<void>('delete_system_setting', { id });
};

export const getSettingValue = async (key: string): Promise<string | null> => {
  return invoke<string | null>('get_setting_value', { key });
};

export const updateSettingValue = async (key: string, value: string): Promise<number> => {
  return invoke<number>('update_setting_value', { key, value });
};

// ==================== 数据字典 API ====================

export const createDataDictionary = async (input: DataDictionaryCreateInput): Promise<DataDictionary> => {
  return invoke<DataDictionary>('create_data_dictionary', { input });
};

export const getDataDictionary = async (id: number): Promise<DataDictionary> => {
  return invoke<DataDictionary>('get_data_dictionary', { id });
};

export const getDataDictionaryByCode = async (code: string): Promise<DataDictionary> => {
  return invoke<DataDictionary>('get_data_dictionary_by_code', { code });
};

export const getAllDataDictionaries = async (): Promise<DataDictionary[]> => {
  return invoke<DataDictionary[]>('get_all_data_dictionaries');
};

export const updateDataDictionary = async (id: number, input: DataDictionaryUpdateInput): Promise<DataDictionary> => {
  return invoke<DataDictionary>('update_data_dictionary', { id, input });
};

export const deleteDataDictionary = async (id: number): Promise<void> => {
  return invoke<void>('delete_data_dictionary', { id });
};

// ==================== 操作日志 API ====================

export const createOperationLog = async (log: Partial<OperationLog>): Promise<OperationLog> => {
  return invoke<OperationLog>('create_operation_log', { input: log });
};

export const getOperationLog = async (id: number): Promise<OperationLog> => {
  return invoke<OperationLog>('get_operation_log', { id });
};

export const queryOperationLogs = async (query: OperationLogQuery): Promise<OperationLog[]> => {
  return invoke<OperationLog[]>('query_operation_logs', { query });
};

// ==================== 审计日志 API ====================

export const createAuditLog = async (log: Partial<AuditLog>): Promise<AuditLog> => {
  return invoke<AuditLog>('create_audit_log', { input: log });
};

export const getAuditLog = async (id: number): Promise<AuditLog> => {
  return invoke<AuditLog>('get_audit_log', { id });
};

export const queryAuditLogs = async (
  userId?: number | null,
  resourceType?: string | null,
  startDate?: string | null,
  endDate?: string | null
): Promise<AuditLog[]> => {
  return invoke<AuditLog[]>('query_audit_logs', { userId, resourceType, startDate, endDate });
};

// ==================== 备份配置 API ====================

export const createBackupConfig = async (input: BackupConfigCreateInput): Promise<BackupConfig> => {
  return invoke<BackupConfig>('create_backup_config', { input });
};

export const getBackupConfig = async (id: number): Promise<BackupConfig> => {
  return invoke<BackupConfig>('get_backup_config', { id });
};

export const getAllBackupConfigs = async (): Promise<BackupConfig[]> => {
  return invoke<BackupConfig[]>('get_all_backup_configs');
};

export const updateBackupConfig = async (id: number, input: BackupConfigUpdateInput): Promise<BackupConfig> => {
  return invoke<BackupConfig>('update_backup_config', { id, input });
};

export const deleteBackupConfig = async (id: number): Promise<void> => {
  return invoke<void>('delete_backup_config', { id });
};

// ==================== 权限配置 API ====================

export const createPermissionConfig = async (input: PermissionConfigCreateInput): Promise<PermissionConfig> => {
  return invoke<PermissionConfig>('create_permission_config', { input });
};

export const getPermissionConfig = async (id: number): Promise<PermissionConfig> => {
  return invoke<PermissionConfig>('get_permission_config', { id });
};

export const getPermissionsByRole = async (roleId: number): Promise<PermissionConfig[]> => {
  return invoke<PermissionConfig[]>('get_permissions_by_role', { roleId });
};

export const updatePermissionConfig = async (id: number, input: PermissionConfigUpdateInput): Promise<PermissionConfig> => {
  return invoke<PermissionConfig>('update_permission_config', { id, input });
};

export const deletePermissionConfig = async (id: number): Promise<void> => {
  return invoke<void>('delete_permission_config', { id });
};

// ==================== 通知配置 API ====================

export const createNotificationConfig = async (input: NotificationConfigCreateInput): Promise<NotificationConfig> => {
  return invoke<NotificationConfig>('create_notification_config', { input });
};

export const getNotificationConfig = async (id: number): Promise<NotificationConfig> => {
  return invoke<NotificationConfig>('get_notification_config', { id });
};

export const getAllNotificationConfigs = async (): Promise<NotificationConfig[]> => {
  return invoke<NotificationConfig[]>('get_all_notification_configs');
};

export const updateNotificationConfig = async (id: number, input: NotificationConfigUpdateInput): Promise<NotificationConfig> => {
  return invoke<NotificationConfig>('update_notification_config', { id, input });
};

export const deleteNotificationConfig = async (id: number): Promise<void> => {
  return invoke<void>('delete_notification_config', { id });
};

// ==================== 集成配置 API ====================

export const createIntegrationConfig = async (input: IntegrationConfigCreateInput): Promise<IntegrationConfig> => {
  return invoke<IntegrationConfig>('create_integration_config', { input });
};

export const getIntegrationConfig = async (id: number): Promise<IntegrationConfig> => {
  return invoke<IntegrationConfig>('get_integration_config', { id });
};

export const getAllIntegrationConfigs = async (): Promise<IntegrationConfig[]> => {
  return invoke<IntegrationConfig[]>('get_all_integration_configs');
};

export const updateIntegrationConfig = async (id: number, input: IntegrationConfigUpdateInput): Promise<IntegrationConfig> => {
  return invoke<IntegrationConfig>('update_integration_config', { id, input });
};

export const deleteIntegrationConfig = async (id: number): Promise<void> => {
  return invoke<void>('delete_integration_config', { id });
};

// ==================== 自定义字段 API ====================

export const createCustomField = async (input: CustomFieldCreateInput): Promise<CustomField> => {
  return invoke<CustomField>('create_custom_field', { input });
};

export const getCustomField = async (id: number): Promise<CustomField> => {
  return invoke<CustomField>('get_custom_field', { id });
};

export const getCustomFieldsByEntity = async (entityType: string): Promise<CustomField[]> => {
  return invoke<CustomField[]>('get_custom_fields_by_entity', { entityType });
};

export const updateCustomField = async (id: number, input: CustomFieldUpdateInput): Promise<CustomField> => {
  return invoke<CustomField>('update_custom_field', { id, input });
};

export const deleteCustomField = async (id: number): Promise<void> => {
  return invoke<void>('delete_custom_field', { id });
};

// ==================== 工作流配置 API ====================

export const createWorkflowConfig = async (input: WorkflowConfigCreateInput): Promise<WorkflowConfig> => {
  return invoke<WorkflowConfig>('create_workflow_config', { input });
};

export const getWorkflowConfig = async (id: number): Promise<WorkflowConfig> => {
  return invoke<WorkflowConfig>('get_workflow_config', { id });
};

export const getWorkflowsByEntity = async (entityType: string): Promise<WorkflowConfig[]> => {
  return invoke<WorkflowConfig[]>('get_workflows_by_entity', { entityType });
};

export const updateWorkflowConfig = async (id: number, input: WorkflowConfigUpdateInput): Promise<WorkflowConfig> => {
  return invoke<WorkflowConfig>('update_workflow_config', { id, input });
};

export const deleteWorkflowConfig = async (id: number): Promise<void> => {
  return invoke<void>('delete_workflow_config', { id });
};
