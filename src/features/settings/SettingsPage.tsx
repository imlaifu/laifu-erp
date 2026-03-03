// 系统设置模块 UI 组件

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/settings';
import type {
  SystemSetting,
  SystemSettingCreateInput,
  SystemSettingUpdateInput,
  DataDictionary,
  DataDictionaryCreateInput,
  DataDictionaryUpdateInput,
  BackupConfig,
  BackupConfigCreateInput,
  BackupConfigUpdateInput,
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
} from '../../types/settings';

type SettingsTab = 'system' | 'dictionary' | 'backup' | 'notification' | 'integration' | 'custom-fields' | 'workflow' | 'logs';

export function SettingsPage() {
  const {
    // 系统参数
    systemSettings,
    systemSettingsLoading,
    fetchSystemSettings,
    createSystemSetting,
    updateSystemSetting,
    deleteSystemSetting,
    
    // 数据字典
    dataDictionaries,
    dataDictionariesLoading,
    fetchDataDictionaries,
    createDataDictionary,
    updateDataDictionary,
    deleteDataDictionary,
    
    // 备份配置
    backupConfigs,
    backupConfigsLoading,
    fetchBackupConfigs,
    createBackupConfig,
    updateBackupConfig,
    deleteBackupConfig,
    
    // 通知配置
    notificationConfigs,
    notificationConfigsLoading,
    fetchNotificationConfigs,
    createNotificationConfig,
    updateNotificationConfig,
    deleteNotificationConfig,
    
    // 集成配置
    integrationConfigs,
    integrationConfigsLoading,
    fetchIntegrationConfigs,
    createIntegrationConfig,
    updateIntegrationConfig,
    deleteIntegrationConfig,
    
    // 自定义字段
    customFields,
    customFieldsLoading,
    fetchCustomFields,
    createCustomField,
    updateCustomField,
    deleteCustomField,
    
    // 工作流配置
    workflowConfigs,
    workflowConfigsLoading,
    fetchWorkflowConfigs,
    createWorkflowConfig,
    updateWorkflowConfig,
    deleteWorkflowConfig,
    
    operationLoading,
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>('system');
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedItem, setSelectedItem] = useState<SystemSetting | DataDictionary | BackupConfig | NotificationConfig | IntegrationConfig | CustomField | WorkflowConfig | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [entityType, setEntityType] = useState<string>('');

  // 初始化加载
  useEffect(() => {
    switch (activeTab) {
      case 'system':
        fetchSystemSettings();
        break;
      case 'dictionary':
        fetchDataDictionaries();
        break;
      case 'backup':
        fetchBackupConfigs();
        break;
      case 'notification':
        fetchNotificationConfigs();
        break;
      case 'integration':
        fetchIntegrationConfigs();
        break;
      case 'custom-fields':
        if (entityType) fetchCustomFields(entityType);
        break;
      case 'workflow':
        if (entityType) fetchWorkflowConfigs(entityType);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, entityType]);



  // 处理创建
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      switch (activeTab) {
        case 'system':
          await createSystemSetting(formData as unknown as SystemSettingCreateInput);
          break;
        case 'dictionary':
          await createDataDictionary(formData as unknown as DataDictionaryCreateInput);
          break;
        case 'backup':
          await createBackupConfig(formData as unknown as BackupConfigCreateInput);
          break;
        case 'notification':
          await createNotificationConfig(formData as unknown as NotificationConfigCreateInput);
          break;
        case 'integration':
          await createIntegrationConfig(formData as unknown as IntegrationConfigCreateInput);
          break;
        case 'custom-fields':
          await createCustomField(formData as unknown as CustomFieldCreateInput);
          break;
        case 'workflow':
          await createWorkflowConfig(formData as unknown as WorkflowConfigCreateInput);
          break;
      }
      setView('list');
      resetForm();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('创建失败:', error);
    }
  };

  // 处理更新
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      switch (activeTab) {
        case 'system':
          await updateSystemSetting(selectedItem.id, formData as unknown as SystemSettingUpdateInput);
          break;
        case 'dictionary':
          await updateDataDictionary(selectedItem.id, formData as unknown as DataDictionaryUpdateInput);
          break;
        case 'backup':
          await updateBackupConfig(selectedItem.id, formData as unknown as BackupConfigUpdateInput);
          break;
        case 'notification':
          await updateNotificationConfig(selectedItem.id, formData as unknown as NotificationConfigUpdateInput);
          break;
        case 'integration':
          await updateIntegrationConfig(selectedItem.id, formData as unknown as IntegrationConfigUpdateInput);
          break;
        case 'custom-fields':
          await updateCustomField(selectedItem.id, formData as unknown as CustomFieldUpdateInput);
          break;
        case 'workflow':
          await updateWorkflowConfig(selectedItem.id, formData as unknown as WorkflowConfigUpdateInput);
          break;
      }
      setView('list');
      resetForm();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('更新失败:', error);
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此项吗？')) return;
    try {
      switch (activeTab) {
        case 'system':
          await deleteSystemSetting(id);
          break;
        case 'dictionary':
          await deleteDataDictionary(id);
          break;
        case 'backup':
          await deleteBackupConfig(id);
          break;
        case 'notification':
          await deleteNotificationConfig(id);
          break;
        case 'integration':
          await deleteIntegrationConfig(id);
          break;
        case 'custom-fields':
          await deleteCustomField(id);
          break;
        case 'workflow':
          await deleteWorkflowConfig(id);
          break;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('删除失败:', error);
    }
  };

  // 编辑项
  const handleEdit = (item: SystemSetting | DataDictionary | BackupConfig | NotificationConfig | IntegrationConfig | CustomField | WorkflowConfig) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setView('edit');
  };

  // 重置表单
  const resetForm = () => {
    setFormData({});
    setSelectedItem(null);
  };

  // 渲染标签页
  const renderTabs = () => (
    <div className="settings-tabs">
      <button
        className={`tab ${activeTab === 'system' ? 'active' : ''}`}
        onClick={() => setActiveTab('system')}
      >
        ⚙️ 系统参数
      </button>
      <button
        className={`tab ${activeTab === 'dictionary' ? 'active' : ''}`}
        onClick={() => setActiveTab('dictionary')}
      >
        📚 数据字典
      </button>
      <button
        className={`tab ${activeTab === 'backup' ? 'active' : ''}`}
        onClick={() => setActiveTab('backup')}
      >
        💾 备份配置
      </button>
      <button
        className={`tab ${activeTab === 'notification' ? 'active' : ''}`}
        onClick={() => setActiveTab('notification')}
      >
        🔔 通知配置
      </button>
      <button
        className={`tab ${activeTab === 'integration' ? 'active' : ''}`}
        onClick={() => setActiveTab('integration')}
      >
        🔗 集成配置
      </button>
      <button
        className={`tab ${activeTab === 'custom-fields' ? 'active' : ''}`}
        onClick={() => setActiveTab('custom-fields')}
      >
        🏷️ 自定义字段
      </button>
      <button
        className={`tab ${activeTab === 'workflow' ? 'active' : ''}`}
        onClick={() => setActiveTab('workflow')}
      >
        🔄 工作流
      </button>
      <button
        className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
        onClick={() => setActiveTab('logs')}
      >
        📋 日志
      </button>
    </div>
  );

  // 渲染系统参数列表
  const renderSystemSettings = () => (
    <div className="settings-list">
      <div className="list-header">
        <h3>系统参数</h3>
        <button onClick={() => { resetForm(); setView('create'); }} className="btn-primary">
          + 新建参数
        </button>
      </div>

      {systemSettingsLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>键</th>
              <th>值</th>
              <th>类型</th>
              <th>分类</th>
              <th>描述</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {systemSettings.map((setting: SystemSetting) => (
              <tr key={setting.id}>
                <td>{setting.settingKey}</td>
                <td>{setting.settingValue || '-'}</td>
                <td>{setting.settingType}</td>
                <td>{setting.category}</td>
                <td>{setting.description || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(setting)} className="btn-sm">编辑</button>
                  <button onClick={() => handleDelete(setting.id)} className="btn-sm btn-danger">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // 渲染数据字典列表
  const renderDataDictionaries = () => (
    <div className="settings-list">
      <div className="list-header">
        <h3>数据字典</h3>
        <button onClick={() => { resetForm(); setView('create'); }} className="btn-primary">
          + 新建字典
        </button>
      </div>

      {dataDictionariesLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>字典代码</th>
              <th>字典名称</th>
              <th>类型</th>
              <th>描述</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {dataDictionaries.map((dict: DataDictionary) => (
              <tr key={dict.id}>
                <td>{dict.dictCode}</td>
                <td>{dict.dictName}</td>
                <td>{dict.dictType}</td>
                <td>{dict.description || '-'}</td>
                <td>{dict.isActive ? '✅' : '❌'}</td>
                <td>
                  <button onClick={() => handleEdit(dict)} className="btn-sm">编辑</button>
                  <button onClick={() => handleDelete(dict.id)} className="btn-sm btn-danger">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // 渲染备份配置列表
  const renderBackupConfigs = () => (
    <div className="settings-list">
      <div className="list-header">
        <h3>备份配置</h3>
        <button onClick={() => { resetForm(); setView('create'); }} className="btn-primary">
          + 新建配置
        </button>
      </div>

      {backupConfigsLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>配置名称</th>
              <th>备份类型</th>
              <th>目标</th>
              <th>保留天数</th>
              <th>状态</th>
              <th>最后备份</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {backupConfigs.map((config: BackupConfig) => (
              <tr key={config.id}>
                <td>{config.configName}</td>
                <td>{config.backupType}</td>
                <td>{config.backupTarget}</td>
                <td>{config.retentionDays}</td>
                <td>{config.isActive ? '✅' : '❌'}</td>
                <td>{config.lastBackupAt ? new Date(config.lastBackupAt).toLocaleString() : '从未'}</td>
                <td>
                  <button onClick={() => handleEdit(config)} className="btn-sm">编辑</button>
                  <button onClick={() => handleDelete(config.id)} className="btn-sm btn-danger">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // 渲染通知配置列表
  const renderNotificationConfigs = () => (
    <div className="settings-list">
      <div className="list-header">
        <h3>通知配置</h3>
        <button onClick={() => { resetForm(); setView('create'); }} className="btn-primary">
          + 新建配置
        </button>
      </div>

      {notificationConfigsLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>类型</th>
              <th>触发事件</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {notificationConfigs.map((config: NotificationConfig) => (
              <tr key={config.id}>
                <td>{config.notificationName}</td>
                <td>{config.notificationType}</td>
                <td>{config.eventTrigger}</td>
                <td>{config.isEnabled ? '✅' : '❌'}</td>
                <td>
                  <button onClick={() => handleEdit(config)} className="btn-sm">编辑</button>
                  <button onClick={() => handleDelete(config.id)} className="btn-sm btn-danger">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // 渲染集成配置列表
  const renderIntegrationConfigs = () => (
    <div className="settings-list">
      <div className="list-header">
        <h3>集成配置</h3>
        <button onClick={() => { resetForm(); setView('create'); }} className="btn-primary">
          + 新建集成
        </button>
      </div>

      {integrationConfigsLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>类型</th>
              <th>提供商</th>
              <th>状态</th>
              <th>最后同步</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {integrationConfigs.map((config: IntegrationConfig) => (
              <tr key={config.id}>
                <td>{config.integrationName}</td>
                <td>{config.integrationType}</td>
                <td>{config.provider || '-'}</td>
                <td>{config.isActive ? '✅' : '❌'}</td>
                <td>{config.lastSyncAt ? new Date(config.lastSyncAt).toLocaleString() : '从未'}</td>
                <td>
                  <button onClick={() => handleEdit(config)} className="btn-sm">编辑</button>
                  <button onClick={() => handleDelete(config.id)} className="btn-sm btn-danger">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // 渲染自定义字段列表
  const renderCustomFields = () => (
    <div className="settings-list">
      <div className="list-header">
        <h3>自定义字段</h3>
        <div>
          <input
            type="text"
            placeholder="实体类型 (如：customer, product)"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="input-sm"
          />
          <button onClick={() => fetchCustomFields(entityType)} className="btn-sm">加载</button>
          <button onClick={() => { resetForm(); setView('create'); }} className="btn-primary">
            + 新建字段
          </button>
        </div>
      </div>

      {customFieldsLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>字段名</th>
              <th>标签</th>
              <th>类型</th>
              <th>必填</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {customFields.map((field: CustomField) => (
              <tr key={field.id}>
                <td>{field.fieldName}</td>
                <td>{field.fieldLabel}</td>
                <td>{field.fieldType}</td>
                <td>{field.isRequired ? '✅' : '❌'}</td>
                <td>{field.isActive ? '✅' : '❌'}</td>
                <td>
                  <button onClick={() => handleEdit(field)} className="btn-sm">编辑</button>
                  <button onClick={() => handleDelete(field.id)} className="btn-sm btn-danger">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // 渲染工作流配置列表
  const renderWorkflowConfigs = () => (
    <div className="settings-list">
      <div className="list-header">
        <h3>工作流配置</h3>
        <div>
          <input
            type="text"
            placeholder="实体类型 (如：order, product)"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="input-sm"
          />
          <button onClick={() => fetchWorkflowConfigs(entityType)} className="btn-sm">加载</button>
          <button onClick={() => { resetForm(); setView('create'); }} className="btn-primary">
            + 新建工作流
          </button>
        </div>
      </div>

      {workflowConfigsLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>工作流名称</th>
              <th>实体类型</th>
              <th>触发类型</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {workflowConfigs.map((workflow: WorkflowConfig) => (
              <tr key={workflow.id}>
                <td>{workflow.workflowName}</td>
                <td>{workflow.entityType}</td>
                <td>{workflow.triggerType}</td>
                <td>{workflow.isActive ? '✅' : '❌'}</td>
                <td>
                  <button onClick={() => handleEdit(workflow)} className="btn-sm">编辑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // 渲染日志
  const renderLogs = () => (
    <div className="settings-list">
      <h3>系统日志</h3>
      <p className="text-muted">日志功能正在开发中...</p>
    </div>
  );

  // 渲染创建/编辑表单
  const renderForm = () => (
    <div className="settings-form">
      <h3>{view === 'create' ? '新建' : '编辑'} - {activeTab}</h3>
      <form onSubmit={view === 'create' ? handleCreate : handleUpdate}>
        {activeTab === 'system' && (
          <>
            <div className="form-group">
              <label>键：</label>
              <input
                type="text"
                value={(formData.settingKey as string) || ''}
                onChange={(e) => setFormData({ ...formData, settingKey: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>值：</label>
              <input
                type="text"
                value={(formData.settingValue as string) || ''}
                onChange={(e) => setFormData({ ...formData, settingValue: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>类型：</label>
              <select
                value={(formData.settingType as string) || 'string'}
                onChange={(e) => setFormData({ ...formData, settingType: e.target.value })}
              >
                <option value="string">字符串</option>
                <option value="number">数字</option>
                <option value="boolean">布尔</option>
                <option value="json">JSON</option>
                <option value="text">文本</option>
              </select>
            </div>
            <div className="form-group">
              <label>分类：</label>
              <select
                value={(formData.category as string) || 'general'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="general">通用</option>
                <option value="security">安全</option>
                <option value="notification">通知</option>
                <option value="integration">集成</option>
                <option value="ui">界面</option>
                <option value="backup">备份</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="form-group">
              <label>描述：</label>
              <textarea
                value={(formData.description as string) || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </>
        )}

        {activeTab === 'dictionary' && (
          <>
            <div className="form-group">
              <label>字典代码：</label>
              <input
                type="text"
                value={(formData.dictCode as string) || ''}
                onChange={(e) => setFormData({ ...formData, dictCode: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>字典名称：</label>
              <input
                type="text"
                value={(formData.dictName as string) || ''}
                onChange={(e) => setFormData({ ...formData, dictName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>描述：</label>
              <textarea
                value={(formData.description as string) || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </>
        )}

        {activeTab === 'backup' && (
          <>
            <div className="form-group">
              <label>配置名称：</label>
              <input
                type="text"
                value={(formData.configName as string) || ''}
                onChange={(e) => setFormData({ ...formData, configName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>备份类型：</label>
              <select
                value={(formData.backupType as string) || 'full'}
                onChange={(e) => setFormData({ ...formData, backupType: e.target.value })}
              >
                <option value="full">完整备份</option>
                <option value="incremental">增量备份</option>
                <option value="differential">差异备份</option>
              </select>
            </div>
            <div className="form-group">
              <label>备份目标：</label>
              <select
                value={(formData.backupTarget as string) || 'local'}
                onChange={(e) => setFormData({ ...formData, backupTarget: e.target.value })}
              >
                <option value="local">本地</option>
                <option value="remote">远程</option>
                <option value="cloud">云端</option>
              </select>
            </div>
            <div className="form-group">
              <label>保留天数：</label>
              <input
                type="number"
                value={(formData.retentionDays as number) || 30}
                onChange={(e) => setFormData({ ...formData, retentionDays: parseInt(e.target.value) })}
              />
            </div>
          </>
        )}

        {activeTab === 'notification' && (
          <>
            <div className="form-group">
              <label>通知名称：</label>
              <input
                type="text"
                value={(formData.notificationName as string) || ''}
                onChange={(e) => setFormData({ ...formData, notificationName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>通知类型：</label>
              <select
                value={(formData.notificationType as string) || 'email'}
                onChange={(e) => setFormData({ ...formData, notificationType: e.target.value })}
              >
                <option value="email">邮件</option>
                <option value="sms">短信</option>
                <option value="push">推送</option>
                <option value="in_app">应用内</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
            <div className="form-group">
              <label>触发事件：</label>
              <input
                type="text"
                value={(formData.eventTrigger as string) || ''}
                onChange={(e) => setFormData({ ...formData, eventTrigger: e.target.value })}
                required
              />
            </div>
          </>
        )}

        {activeTab === 'integration' && (
          <>
            <div className="form-group">
              <label>集成名称：</label>
              <input
                type="text"
                value={(formData.integrationName as string) || ''}
                onChange={(e) => setFormData({ ...formData, integrationName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>集成类型：</label>
              <select
                value={(formData.integrationType as string) || 'api'}
                onChange={(e) => setFormData({ ...formData, integrationType: e.target.value })}
              >
                <option value="api">API</option>
                <option value="webhook">Webhook</option>
                <option value="oauth">OAuth</option>
                <option value="database">数据库</option>
                <option value="file">文件</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="form-group">
              <label>提供商：</label>
              <input
                type="text"
                value={(formData.provider as string) || ''}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              />
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={operationLoading}>
            {operationLoading ? '保存中...' : '保存'}
          </button>
          <button type="button" onClick={() => setView('list')} className="btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  );

  // 渲染当前标签内容
  const renderTabContent = () => {
    if (view === 'create' || view === 'edit') {
      return renderForm();
    }

    switch (activeTab) {
      case 'system':
        return renderSystemSettings();
      case 'dictionary':
        return renderDataDictionaries();
      case 'backup':
        return renderBackupConfigs();
      case 'notification':
        return renderNotificationConfigs();
      case 'integration':
        return renderIntegrationConfigs();
      case 'custom-fields':
        return renderCustomFields();
      case 'workflow':
        return renderWorkflowConfigs();
      case 'logs':
        return renderLogs();
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <h1>系统设置</h1>
      {renderTabs()}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}
