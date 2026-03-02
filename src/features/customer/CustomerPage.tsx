// 客户管理模块 UI 组件

import React, { useState, useEffect } from 'react';
import { useCustomerStore } from '../../stores/customer';
import type { Customer, CustomerCreateInput, CustomerUpdateInput, CustomerContactCreateInput } from '../../types/customer';

export function CustomerPage() {
  const {
    customers,
    customerTotal,
    customerListLoading,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    fetchContacts,
    createContact,
    deleteContact,
    contacts,
    fetchTags,
    fetchLevelConfigs,
    operationLoading,
    fetchStatistics,
    statistics,
  } = useCustomerStore();

  const [view, setView] = useState<'list' | 'create' | 'edit' | 'detail'>('list');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'contacts' | 'interactions' | 'followups'>('info');
  const [formData, setFormData] = useState<Partial<CustomerCreateInput & CustomerUpdateInput>>({
    code: '',
    name: '',
    type: 'company',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    level: 'normal',
    status: 'active',
    creditLimit: 0,
    creditDays: 0,
  });

  // 联系人表单
  const [contactForm, setContactForm] = useState<Partial<CustomerContactCreateInput>>({
    name: '',
    phone: '',
    email: '',
    isPrimary: false,
  });

  // 初始化加载
  useEffect(() => {
    fetchCustomers({ limit: 50, offset: 0 });
    fetchTags();
    fetchLevelConfigs();
    fetchStatistics();
  }, []);

  // 处理创建客户
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCustomer(formData as CustomerCreateInput);
      setView('list');
      resetForm();
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 处理更新客户
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      await updateCustomer(selectedCustomer.id, formData as CustomerUpdateInput);
      setView('detail');
      resetForm();
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  // 处理删除客户
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此客户吗？')) return;
    try {
      await deleteCustomer(id);
      setView('list');
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 查看客户详情
  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setView('detail');
    fetchContacts(customer.id);
  };

  // 编辑客户
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      code: customer.code,
      name: customer.name,
      type: customer.type,
      contactPerson: customer.contactPerson || '',
      contactPhone: customer.contactPhone || '',
      contactEmail: customer.contactEmail || '',
      level: customer.level,
      status: customer.status,
      creditLimit: customer.creditLimit,
      creditDays: customer.creditDays,
    });
    setView('edit');
  };

  // 创建联系人
  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      await createContact({ ...contactForm, customerId: selectedCustomer.id } as CustomerContactCreateInput);
      setContactForm({ name: '', phone: '', email: '', isPrimary: false });
    } catch (error) {
      console.error('创建联系人失败:', error);
    }
  };

  // 删除联系人
  const handleDeleteContact = async (id: number) => {
    if (!confirm('确定要删除此联系人吗？')) return;
    try {
      await deleteContact(id);
    } catch (error) {
      console.error('删除联系人失败:', error);
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      type: 'company',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      level: 'normal',
      status: 'active',
      creditLimit: 0,
      creditDays: 0,
    });
    setSelectedCustomer(null);
  };

  // 渲染客户列表
  const renderCustomerList = () => (
    <div className="customer-list">
      <div className="customer-list-header">
        <h2>客户管理</h2>
        <div className="header-actions">
          {statistics && (
            <div className="stats-summary">
              <span className="stat-item">总计：<strong>{statistics.total}</strong></span>
              <span className="stat-item">VIP: <strong>{statistics.byLevel.vip}</strong></span>
              <span className="stat-item">普通：<strong>{statistics.byLevel.normal}</strong></span>
              <span className="stat-item">潜在：<strong>{statistics.byLevel.potential}</strong></span>
            </div>
          )}
          <button onClick={() => { resetForm(); setView('create'); }} className="btn-primary">
            + 新建客户
          </button>
        </div>
      </div>

      {customerListLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>客户编号</th>
              <th>客户名称</th>
              <th>类型</th>
              <th>联系人</th>
              <th>电话</th>
              <th>城市</th>
              <th>等级</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.code}</td>
                <td className="font-medium">{customer.name}</td>
                <td>
                  {customer.type === 'company' && '🏢 企业'}
                  {customer.type === 'individual' && '👤 个人'}
                  {customer.type === 'government' && '🏛️ 政府'}
                  {customer.type === 'other' && '📦 其他'}
                </td>
                <td>{customer.contactPerson || '-'}</td>
                <td>{customer.contactPhone || '-'}</td>
                <td>{customer.city || '-'}</td>
                <td>
                  <span className={`level-badge level-${customer.level}`}>
                    {customer.level === 'vip' && '⭐ VIP'}
                    {customer.level === 'normal' && '✓ 普通'}
                    {customer.level === 'potential' && '🌱 潜在'}
                    {customer.level === 'blacklist' && '⚠️ 黑名单'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${customer.status}`}>
                    {customer.status === 'active' && '✓ 活跃'}
                    {customer.status === 'inactive' && '○ 未激活'}
                    {customer.status === 'potential' && '🌱 潜在'}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => handleViewDetail(customer)} className="btn-sm">
                    详情
                  </button>
                  <button onClick={() => handleEdit(customer)} className="btn-sm">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(customer.id)} className="btn-sm btn-danger">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="customer-list-footer">
        <span>共 {customerTotal} 个客户</span>
      </div>
    </div>
  );

  // 渲染客户表单
  const renderCustomerForm = (isEdit: boolean) => (
    <div className="customer-form">
      <div className="form-header">
        <h2>{isEdit ? '编辑客户' : '新建客户'}</h2>
        <button onClick={() => { resetForm(); setView('list'); }} className="btn-secondary">
          返回列表
        </button>
      </div>

      <form onSubmit={isEdit ? handleUpdate : handleCreate}>
        <div className="form-grid">
          <div className="form-group">
            <label>客户编号 *</label>
            <input
              type="text"
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              disabled={isEdit}
              placeholder="例如：CUST-001"
            />
          </div>

          <div className="form-group">
            <label>客户名称 *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="客户全称"
            />
          </div>

          <div className="form-group">
            <label>客户类型</label>
            <select
              value={formData.type || 'company'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="company">🏢 企业</option>
              <option value="individual">👤 个人</option>
              <option value="government">🏛️ 政府</option>
              <option value="other">📦 其他</option>
            </select>
          </div>

          <div className="form-group">
            <label>客户等级</label>
            <select
              value={formData.level || 'normal'}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
            >
              <option value="vip">⭐ VIP</option>
              <option value="normal">✓ 普通</option>
              <option value="potential">🌱 潜在</option>
              <option value="blacklist">⚠️ 黑名单</option>
            </select>
          </div>

          <div className="form-group">
            <label>联系人</label>
            <input
              type="text"
              value={formData.contactPerson || ''}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="联系人姓名"
            />
          </div>

          <div className="form-group">
            <label>联系电话</label>
            <input
              type="tel"
              value={formData.contactPhone || ''}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              placeholder="联系电话"
            />
          </div>

          <div className="form-group">
            <label>联系邮箱</label>
            <input
              type="email"
              value={formData.contactEmail || ''}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="联系邮箱"
            />
          </div>

          <div className="form-group">
            <label>信用额度</label>
            <input
              type="number"
              value={formData.creditLimit || 0}
              onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>账期 (天)</label>
            <input
              type="number"
              value={formData.creditDays || 0}
              onChange={(e) => setFormData({ ...formData, creditDays: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>状态</label>
            <select
              value={formData.status || 'active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="active">✓ 活跃</option>
              <option value="inactive">○ 未激活</option>
              <option value="potential">🌱 潜在</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={operationLoading}>
            {operationLoading ? '保存中...' : isEdit ? '更新' : '创建'}
          </button>
          <button type="button" onClick={() => { resetForm(); setView('list'); }} className="btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  );

  // 渲染客户详情
  const renderCustomerDetail = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="customer-detail">
        <div className="detail-header">
          <button onClick={() => { setView('list'); setSelectedCustomer(null); }} className="btn-back">
            ← 返回列表
          </button>
          <div className="detail-actions">
            <button onClick={() => handleEdit(selectedCustomer)} className="btn-primary">
              编辑
            </button>
            <button onClick={() => handleDelete(selectedCustomer.id)} className="btn-danger">
              删除
            </button>
          </div>
        </div>

        <div className="detail-tabs">
          <button
            className={`tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            基本信息
          </button>
          <button
            className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            联系人 ({contacts.length})
          </button>
          <button
            className={`tab ${activeTab === 'interactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('interactions')}
          >
            联系记录
          </button>
          <button
            className={`tab ${activeTab === 'followups' ? 'active' : ''}`}
            onClick={() => setActiveTab('followups')}
          >
            跟进计划
          </button>
        </div>

        <div className="detail-content">
          {activeTab === 'info' && (
            <div className="info-section">
              <h3>基本信息</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>客户编号</label>
                  <span>{selectedCustomer.code}</span>
                </div>
                <div className="info-item">
                  <label>客户名称</label>
                  <span>{selectedCustomer.name}</span>
                </div>
                <div className="info-item">
                  <label>客户类型</label>
                  <span>{selectedCustomer.type}</span>
                </div>
                <div className="info-item">
                  <label>客户等级</label>
                  <span className={`level-badge level-${selectedCustomer.level}`}>{selectedCustomer.level}</span>
                </div>
                <div className="info-item">
                  <label>联系人</label>
                  <span>{selectedCustomer.contactPerson || '-'}</span>
                </div>
                <div className="info-item">
                  <label>联系电话</label>
                  <span>{selectedCustomer.contactPhone || '-'}</span>
                </div>
                <div className="info-item">
                  <label>联系邮箱</label>
                  <span>{selectedCustomer.contactEmail || '-'}</span>
                </div>
                <div className="info-item">
                  <label>信用额度</label>
                  <span>¥{selectedCustomer.creditLimit.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <label>账期</label>
                  <span>{selectedCustomer.creditDays} 天</span>
                </div>
                <div className="info-item">
                  <label>状态</label>
                  <span className={`status-badge status-${selectedCustomer.status}`}>{selectedCustomer.status}</span>
                </div>
              </div>

              {selectedCustomer.address && (
                <div className="info-section">
                  <h4>地址信息</h4>
                  <p>{selectedCustomer.address}</p>
                  {selectedCustomer.city && <p>{selectedCustomer.city}</p>}
                  {selectedCustomer.province && <p>{selectedCustomer.province}</p>}
                  {selectedCustomer.postalCode && <p>{selectedCustomer.postalCode}</p>}
                </div>
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="contacts-section">
              <h3>联系人管理</h3>
              
              <form onSubmit={handleCreateContact} className="contact-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="姓名"
                    value={contactForm.name || ''}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="电话"
                    value={contactForm.phone || ''}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="邮箱"
                    value={contactForm.email || ''}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={contactForm.isPrimary || false}
                      onChange={(e) => setContactForm({ ...contactForm, isPrimary: e.target.checked })}
                    />
                    主要联系人
                  </label>
                  <button type="submit" className="btn-sm btn-primary">添加</button>
                </div>
              </form>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>职位</th>
                    <th>电话</th>
                    <th>邮箱</th>
                    <th>微信</th>
                    <th>主要</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.name}</td>
                      <td>{contact.title || '-'}</td>
                      <td>{contact.phone || contact.mobile || '-'}</td>
                      <td>{contact.email || '-'}</td>
                      <td>{contact.wechat || '-'}</td>
                      <td>{contact.isPrimary ? '✓' : '-'}</td>
                      <td>
                        <button onClick={() => handleDeleteContact(contact.id)} className="btn-sm btn-danger">
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'interactions' && (
            <div className="interactions-section">
              <h3>联系记录</h3>
              <p className="text-muted">联系记录功能开发中...</p>
            </div>
          )}

          {activeTab === 'followups' && (
            <div className="followups-section">
              <h3>跟进计划</h3>
              <p className="text-muted">跟进计划功能开发中...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="customer-page">
      {view === 'list' && renderCustomerList()}
      {view === 'create' && renderCustomerForm(false)}
      {view === 'edit' && renderCustomerForm(true)}
      {view === 'detail' && renderCustomerDetail()}
    </div>
  );
}

export default CustomerPage;
