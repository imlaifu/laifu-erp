// 系统设置模块 Zustand Store

import { create } from 'zustand';
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
import * as settingsService from '../services/settingsService';

interface SettingsState {
  // 系统参数
  systemSettings: SystemSetting[];
  systemSettingsLoading: boolean;
  systemSettingsError: string | null;
  
  // 数据字典
  dataDictionaries: DataDictionary[];
  dataDictionariesLoading: boolean;
  dataDictionariesError: string | null;
  
  // 操作日志
  operationLogs: OperationLog[];
  operationLogsLoading: boolean;
  operationLogsError: string | null;
  
  // 审计日志
  auditLogs: AuditLog[];
  auditLogsLoading: boolean;
  auditLogsError: string | null;
  
  // 备份配置
  backupConfigs: BackupConfig[];
  backupConfigsLoading: boolean;
  backupConfigsError: string | null;
  
  // 权限配置
  permissionConfigs: PermissionConfig[];
  permissionConfigsLoading: boolean;
  permissionConfigsError: string | null;
  
  // 通知配置
  notificationConfigs: NotificationConfig[];
  notificationConfigsLoading: boolean;
  notificationConfigsError: string | null;
  
  // 集成配置
  integrationConfigs: IntegrationConfig[];
  integrationConfigsLoading: boolean;
  integrationConfigsError: string | null;
  
  // 自定义字段
  customFields: CustomField[];
  customFieldsLoading: boolean;
  customFieldsError: string | null;
  
  // 工作流配置
  workflowConfigs: WorkflowConfig[];
  workflowConfigsLoading: boolean;
  workflowConfigsError: string | null;
  
  // 操作状态
  operationLoading: boolean;
  operationError: string | null;
  
  // Actions - 系统参数
  fetchSystemSettings: () => Promise<void>;
  fetchSystemSettingsByCategory: (category: string) => Promise<void>;
  createSystemSetting: (input: SystemSettingCreateInput) => Promise<SystemSetting>;
  updateSystemSetting: (id: number, input: SystemSettingUpdateInput) => Promise<SystemSetting>;
  deleteSystemSetting: (id: number) => Promise<void>;
  
  // Actions - 数据字典
  fetchDataDictionaries: () => Promise<void>;
  createDataDictionary: (input: DataDictionaryCreateInput) => Promise<DataDictionary>;
  updateDataDictionary: (id: number, input: DataDictionaryUpdateInput) => Promise<DataDictionary>;
  deleteDataDictionary: (id: number) => Promise<void>;
  
  // Actions - 操作日志
  fetchOperationLogs: (query: OperationLogQuery) => Promise<void>;
  
  // Actions - 审计日志
  fetchAuditLogs: (
    userId?: number | null,
    resourceType?: string | null,
    startDate?: string | null,
    endDate?: string | null
  ) => Promise<void>;
  
  // Actions - 备份配置
  fetchBackupConfigs: () => Promise<void>;
  createBackupConfig: (input: BackupConfigCreateInput) => Promise<BackupConfig>;
  updateBackupConfig: (id: number, input: BackupConfigUpdateInput) => Promise<BackupConfig>;
  deleteBackupConfig: (id: number) => Promise<void>;
  
  // Actions - 权限配置
  fetchPermissionConfigs: () => Promise<void>;
  createPermissionConfig: (input: PermissionConfigCreateInput) => Promise<PermissionConfig>;
  updatePermissionConfig: (id: number, input: PermissionConfigUpdateInput) => Promise<PermissionConfig>;
  deletePermissionConfig: (id: number) => Promise<void>;
  
  // Actions - 通知配置
  fetchNotificationConfigs: () => Promise<void>;
  createNotificationConfig: (input: NotificationConfigCreateInput) => Promise<NotificationConfig>;
  updateNotificationConfig: (id: number, input: NotificationConfigUpdateInput) => Promise<NotificationConfig>;
  deleteNotificationConfig: (id: number) => Promise<void>;
  
  // Actions - 集成配置
  fetchIntegrationConfigs: () => Promise<void>;
  createIntegrationConfig: (input: IntegrationConfigCreateInput) => Promise<IntegrationConfig>;
  updateIntegrationConfig: (id: number, input: IntegrationConfigUpdateInput) => Promise<IntegrationConfig>;
  deleteIntegrationConfig: (id: number) => Promise<void>;
  
  // Actions - 自定义字段
  fetchCustomFields: (entityType: string) => Promise<void>;
  createCustomField: (input: CustomFieldCreateInput) => Promise<CustomField>;
  updateCustomField: (id: number, input: CustomFieldUpdateInput) => Promise<CustomField>;
  deleteCustomField: (id: number) => Promise<void>;
  
  // Actions - 工作流配置
  fetchWorkflowConfigs: (entityType: string) => Promise<void>;
  createWorkflowConfig: (input: WorkflowConfigCreateInput) => Promise<WorkflowConfig>;
  updateWorkflowConfig: (id: number, input: WorkflowConfigUpdateInput) => Promise<WorkflowConfig>;
  deleteWorkflowConfig: (id: number) => Promise<void>;
  
  // Actions - 工具
  clearError: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial State - 系统参数
  systemSettings: [],
  systemSettingsLoading: false,
  systemSettingsError: null,
  
  // Initial State - 数据字典
  dataDictionaries: [],
  dataDictionariesLoading: false,
  dataDictionariesError: null,
  
  // Initial State - 操作日志
  operationLogs: [],
  operationLogsLoading: false,
  operationLogsError: null,
  
  // Initial State - 审计日志
  auditLogs: [],
  auditLogsLoading: false,
  auditLogsError: null,
  
  // Initial State - 备份配置
  backupConfigs: [],
  backupConfigsLoading: false,
  backupConfigsError: null,
  
  // Initial State - 权限配置
  permissionConfigs: [],
  permissionConfigsLoading: false,
  permissionConfigsError: null,
  
  // Initial State - 通知配置
  notificationConfigs: [],
  notificationConfigsLoading: false,
  notificationConfigsError: null,
  
  // Initial State - 集成配置
  integrationConfigs: [],
  integrationConfigsLoading: false,
  integrationConfigsError: null,
  
  // Initial State - 自定义字段
  customFields: [],
  customFieldsLoading: false,
  customFieldsError: null,
  
  // Initial State - 工作流配置
  workflowConfigs: [],
  workflowConfigsLoading: false,
  workflowConfigsError: null,
  
  // Initial State - 操作状态
  operationLoading: false,
  operationError: null,
  
  // Actions - 系统参数
  fetchSystemSettings: async () => {
    set({ systemSettingsLoading: true, systemSettingsError: null });
    try {
      const settings = await settingsService.getAllSystemSettings();
      set({ systemSettings: settings, systemSettingsLoading: false });
    } catch (error) {
      set({
        systemSettingsLoading: false,
        systemSettingsError: error instanceof Error ? error.message : '获取系统参数失败',
      });
    }
  },
  
  fetchSystemSettingsByCategory: async (category: string) => {
    set({ systemSettingsLoading: true, systemSettingsError: null });
    try {
      const settings = await settingsService.getSystemSettingsByCategory(category);
      set({ systemSettings: settings, systemSettingsLoading: false });
    } catch (error) {
      set({
        systemSettingsLoading: false,
        systemSettingsError: error instanceof Error ? error.message : '获取系统参数失败',
      });
    }
  },
  
  createSystemSetting: async (input: SystemSettingCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const setting = await settingsService.createSystemSetting(input);
      set({ operationLoading: false });
      get().fetchSystemSettings();
      return setting;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建系统参数失败',
      });
      throw error;
    }
  },
  
  updateSystemSetting: async (id: number, input: SystemSettingUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const setting = await settingsService.updateSystemSetting(id, input);
      set({ operationLoading: false });
      get().fetchSystemSettings();
      return setting;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新系统参数失败',
      });
      throw error;
    }
  },
  
  deleteSystemSetting: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await settingsService.deleteSystemSetting(id);
      set({ operationLoading: false });
      get().fetchSystemSettings();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除系统参数失败',
      });
      throw error;
    }
  },
  
  // Actions - 数据字典
  fetchDataDictionaries: async () => {
    set({ dataDictionariesLoading: true, dataDictionariesError: null });
    try {
      const dictionaries = await settingsService.getAllDataDictionaries();
      set({ dataDictionaries: dictionaries, dataDictionariesLoading: false });
    } catch (error) {
      set({
        dataDictionariesLoading: false,
        dataDictionariesError: error instanceof Error ? error.message : '获取数据字典失败',
      });
    }
  },
  
  createDataDictionary: async (input: DataDictionaryCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const dictionary = await settingsService.createDataDictionary(input);
      set({ operationLoading: false });
      get().fetchDataDictionaries();
      return dictionary;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建数据字典失败',
      });
      throw error;
    }
  },
  
  updateDataDictionary: async (id: number, input: DataDictionaryUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const dictionary = await settingsService.updateDataDictionary(id, input);
      set({ operationLoading: false });
      get().fetchDataDictionaries();
      return dictionary;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新数据字典失败',
      });
      throw error;
    }
  },
  
  deleteDataDictionary: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await settingsService.deleteDataDictionary(id);
      set({ operationLoading: false });
      get().fetchDataDictionaries();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除数据字典失败',
      });
      throw error;
    }
  },
  
  // Actions - 操作日志
  fetchOperationLogs: async (query: OperationLogQuery) => {
    set({ operationLogsLoading: true, operationLogsError: null });
    try {
      const logs = await settingsService.queryOperationLogs(query);
      set({ operationLogs: logs, operationLogsLoading: false });
    } catch (error) {
      set({
        operationLogsLoading: false,
        operationLogsError: error instanceof Error ? error.message : '获取操作日志失败',
      });
    }
  },
  
  // Actions - 审计日志
  fetchAuditLogs: async (
    userId?: number | null,
    resourceType?: string | null,
    startDate?: string | null,
    endDate?: string | null
  ) => {
    set({ auditLogsLoading: true, auditLogsError: null });
    try {
      const logs = await settingsService.queryAuditLogs(userId, resourceType, startDate, endDate);
      set({ auditLogs: logs, auditLogsLoading: false });
    } catch (error) {
      set({
        auditLogsLoading: false,
        auditLogsError: error instanceof Error ? error.message : '获取审计日志失败',
      });
    }
  },
  
  // Actions - 备份配置
  fetchBackupConfigs: async () => {
    set({ backupConfigsLoading: true, backupConfigsError: null });
    try {
      const configs = await settingsService.getAllBackupConfigs();
      set({ backupConfigs: configs, backupConfigsLoading: false });
    } catch (error) {
      set({
        backupConfigsLoading: false,
        backupConfigsError: error instanceof Error ? error.message : '获取备份配置失败',
      });
    }
  },
  
  createBackupConfig: async (input: BackupConfigCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const config = await settingsService.createBackupConfig(input);
      set({ operationLoading: false });
      get().fetchBackupConfigs();
      return config;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建备份配置失败',
      });
      throw error;
    }
  },
  
  updateBackupConfig: async (id: number, input: BackupConfigUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const config = await settingsService.updateBackupConfig(id, input);
      set({ operationLoading: false });
      get().fetchBackupConfigs();
      return config;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新备份配置失败',
      });
      throw error;
    }
  },
  
  deleteBackupConfig: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await settingsService.deleteBackupConfig(id);
      set({ operationLoading: false });
      get().fetchBackupConfigs();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除备份配置失败',
      });
      throw error;
    }
  },
  
  // Actions - 权限配置
  fetchPermissionConfigs: async () => {
    set({ permissionConfigsLoading: true, permissionConfigsError: null });
    try {
      const configs = await settingsService.getAllBackupConfigs().then(() => []); // Placeholder
      set({ permissionConfigs: configs, permissionConfigsLoading: false });
    } catch (error) {
      set({
        permissionConfigsLoading: false,
        permissionConfigsError: error instanceof Error ? error.message : '获取权限配置失败',
      });
    }
  },
  
  createPermissionConfig: async (input: PermissionConfigCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const config = await settingsService.createPermissionConfig(input);
      set({ operationLoading: false });
      return config;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建权限配置失败',
      });
      throw error;
    }
  },
  
  updatePermissionConfig: async (id: number, input: PermissionConfigUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const config = await settingsService.updatePermissionConfig(id, input);
      set({ operationLoading: false });
      return config;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新权限配置失败',
      });
      throw error;
    }
  },
  
  deletePermissionConfig: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await settingsService.deletePermissionConfig(id);
      set({ operationLoading: false });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除权限配置失败',
      });
      throw error;
    }
  },
  
  // Actions - 通知配置
  fetchNotificationConfigs: async () => {
    set({ notificationConfigsLoading: true, notificationConfigsError: null });
    try {
      const configs = await settingsService.getAllNotificationConfigs();
      set({ notificationConfigs: configs, notificationConfigsLoading: false });
    } catch (error) {
      set({
        notificationConfigsLoading: false,
        notificationConfigsError: error instanceof Error ? error.message : '获取通知配置失败',
      });
    }
  },
  
  createNotificationConfig: async (input: NotificationConfigCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const config = await settingsService.createNotificationConfig(input);
      set({ operationLoading: false });
      get().fetchNotificationConfigs();
      return config;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建通知配置失败',
      });
      throw error;
    }
  },
  
  updateNotificationConfig: async (id: number, input: NotificationConfigUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const config = await settingsService.updateNotificationConfig(id, input);
      set({ operationLoading: false });
      get().fetchNotificationConfigs();
      return config;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新通知配置失败',
      });
      throw error;
    }
  },
  
  deleteNotificationConfig: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await settingsService.deleteNotificationConfig(id);
      set({ operationLoading: false });
      get().fetchNotificationConfigs();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除通知配置失败',
      });
      throw error;
    }
  },
  
  // Actions - 集成配置
  fetchIntegrationConfigs: async () => {
    set({ integrationConfigsLoading: true, integrationConfigsError: null });
    try {
      const configs = await settingsService.getAllIntegrationConfigs();
      set({ integrationConfigs: configs, integrationConfigsLoading: false });
    } catch (error) {
      set({
        integrationConfigsLoading: false,
        integrationConfigsError: error instanceof Error ? error.message : '获取集成配置失败',
      });
    }
  },
  
  createIntegrationConfig: async (input: IntegrationConfigCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const config = await settingsService.createIntegrationConfig(input);
      set({ operationLoading: false });
      get().fetchIntegrationConfigs();
      return config;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建集成配置失败',
      });
      throw error;
    }
  },
  
  updateIntegrationConfig: async (id: number, input: IntegrationConfigUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const config = await settingsService.updateIntegrationConfig(id, input);
      set({ operationLoading: false });
      get().fetchIntegrationConfigs();
      return config;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新集成配置失败',
      });
      throw error;
    }
  },
  
  deleteIntegrationConfig: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await settingsService.deleteIntegrationConfig(id);
      set({ operationLoading: false });
      get().fetchIntegrationConfigs();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除集成配置失败',
      });
      throw error;
    }
  },
  
  // Actions - 自定义字段
  fetchCustomFields: async (entityType: string) => {
    set({ customFieldsLoading: true, customFieldsError: null });
    try {
      const fields = await settingsService.getCustomFieldsByEntity(entityType);
      set({ customFields: fields, customFieldsLoading: false });
    } catch (error) {
      set({
        customFieldsLoading: false,
        customFieldsError: error instanceof Error ? error.message : '获取自定义字段失败',
      });
    }
  },
  
  createCustomField: async (input: CustomFieldCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const field = await settingsService.createCustomField(input);
      set({ operationLoading: false });
      return field;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建自定义字段失败',
      });
      throw error;
    }
  },
  
  updateCustomField: async (id: number, input: CustomFieldUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const field = await settingsService.updateCustomField(id, input);
      set({ operationLoading: false });
      return field;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新自定义字段失败',
      });
      throw error;
    }
  },
  
  deleteCustomField: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await settingsService.deleteCustomField(id);
      set({ operationLoading: false });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除自定义字段失败',
      });
      throw error;
    }
  },
  
  // Actions - 工作流配置
  fetchWorkflowConfigs: async (entityType: string) => {
    set({ workflowConfigsLoading: true, workflowConfigsError: null });
    try {
      const workflows = await settingsService.getWorkflowsByEntity(entityType);
      set({ workflowConfigs: workflows, workflowConfigsLoading: false });
    } catch (error) {
      set({
        workflowConfigsLoading: false,
        workflowConfigsError: error instanceof Error ? error.message : '获取工作流配置失败',
      });
    }
  },
  
  createWorkflowConfig: async (input: WorkflowConfigCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const workflow = await settingsService.createWorkflowConfig(input);
      set({ operationLoading: false });
      return workflow;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建工作流配置失败',
      });
      throw error;
    }
  },
  
  updateWorkflowConfig: async (id: number, input: WorkflowConfigUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const workflow = await settingsService.updateWorkflowConfig(id, input);
      set({ operationLoading: false });
      return workflow;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新工作流配置失败',
      });
      throw error;
    }
  },
  
  deleteWorkflowConfig: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await settingsService.deleteWorkflowConfig(id);
      set({ operationLoading: false });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除工作流配置失败',
      });
      throw error;
    }
  },
  
  // Actions - 工具
  clearError: () => {
    set({
      systemSettingsError: null,
      dataDictionariesError: null,
      operationLogsError: null,
      auditLogsError: null,
      backupConfigsError: null,
      permissionConfigsError: null,
      notificationConfigsError: null,
      integrationConfigsError: null,
      customFieldsError: null,
      workflowConfigsError: null,
      operationError: null,
    });
  },
}));

// 导出选择器
export const selectSystemSettings = (state: SettingsState) => state.systemSettings;
export const selectDataDictionaries = (state: SettingsState) => state.dataDictionaries;
export const selectOperationLogs = (state: SettingsState) => state.operationLogs;
export const selectAuditLogs = (state: SettingsState) => state.auditLogs;
export const selectBackupConfigs = (state: SettingsState) => state.backupConfigs;
export const selectPermissionConfigs = (state: SettingsState) => state.permissionConfigs;
export const selectNotificationConfigs = (state: SettingsState) => state.notificationConfigs;
export const selectIntegrationConfigs = (state: SettingsState) => state.integrationConfigs;
export const selectCustomFields = (state: SettingsState) => state.customFields;
export const selectWorkflowConfigs = (state: SettingsState) => state.workflowConfigs;
export const selectOperationLoading = (state: SettingsState) => state.operationLoading;
export const selectOperationError = (state: SettingsState) => state.operationError;
