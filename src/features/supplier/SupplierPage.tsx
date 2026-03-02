// 供应商管理模块 UI 组件

import React, { useState, useEffect } from 'react';
import { useSupplierStore } from '../../stores/supplier';
import type { Supplier, SupplierCreateInput, SupplierUpdateInput, SupplierContactCreateInput, SupplierEvaluationCreateInput, SupplierProductCreateInput } from '../../types/supplier';

export function SupplierPage() {
  const {
    suppliers,
    supplierTotal,
    supplierListLoading,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    fetchContacts,
    createContact,
    deleteContact,
    contacts,
    fetchTags,
    fetchLevelConfigs,
    fetchEvaluations,
    fetchProducts,
    createEvaluation,
    createProduct,
    operationLoading,
    fetchStatistics,
    statistics,
  } = useSupplierStore();

  const [view, setView] = useState<'list' | 'create' | 'edit' | 'detail'>('list');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'contacts' | 'evaluations' | 'products'>('info');
  const [formData, setFormData] = useState<Partial<SupplierCreateInput & SupplierUpdateInput>>({
    code: '',
    name: '',
    type: 'company',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    level: 'normal',
    status: 'active',
    creditDays: 0,
    minOrderAmount: 0,
    deliveryLeadTime: 0,
    qualityRating: 5.0,
    serviceRating: 5.0,
    deliveryRating: 5.0,
  });

  // 联系人表单
  const [contactForm, setContactForm] = useState<Partial<SupplierContactCreateInput>>({
    name: '',
    phone: '',
    email: '',
    isPrimary: false,
  });

  // 评估表单
  const [evaluationForm, setEvaluationForm] = useState<Partial<SupplierEvaluationCreateInput>>({
    evaluationType: 'quarterly',
    evaluationDate: new Date().toISOString().split('T')[0],
    qualityScore: 0,
    deliveryScore: 0,
    serviceScore: 0,
    priceScore: 0,
  });

  // 产品表单
  const [productForm, setProductForm] = useState<Partial<SupplierProductCreateInput>>({
    productCode: '',
    productName: '',
    unitPrice: 0,
    currency: 'CNY',
    minOrderQuantity: 1,
    leadTime: 0,
    isPreferred: false,
  });

  // 初始化加载
  useEffect(() => {
    fetchSuppliers({ limit: 50, offset: 0 });
    fetchTags();
    fetchLevelConfigs();
    fetchStatistics();
  }, []);

  // 处理创建供应商
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSupplier(formData as SupplierCreateInput);
      setView('list');
      resetForm();
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 处理更新供应商
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    try {
      await updateSupplier(selectedSupplier.id, formData as SupplierUpdateInput);
      setView('detail');
      resetForm();
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  // 处理删除供应商
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此供应商吗？')) return;
    try {
      await deleteSupplier(id);
      setView('list');
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 查看供应商详情
  const handleViewDetail = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setView('detail');
    fetchContacts(supplier.id);
    fetchEvaluations({ supplierId: supplier.id, limit: 50, offset: 0 });
    fetchProducts(supplier.id);
  };

  // 编辑供应商
  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      code: supplier.code,
      name: supplier.name,
      type: supplier.type,
      contactPerson: supplier.contactPerson || '',
      contactPhone: supplier.contactPhone || '',
      contactEmail: supplier.contactEmail || '',
      level: supplier.level,
      status: supplier.status,
      creditDays: supplier.creditDays,
      minOrderAmount: supplier.minOrderAmount,
      deliveryLeadTime: supplier.deliveryLeadTime,
      qualityRating: supplier.qualityRating,
      serviceRating: supplier.serviceRating,
      deliveryRating: supplier.deliveryRating,
    });
    setView('edit');
  };

  // 创建联系人
  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    try {
      await createContact({ ...contactForm, supplierId: selectedSupplier.id } as SupplierContactCreateInput);
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

  // 创建评估
  const handleCreateEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    try {
      await createEvaluation({ ...evaluationForm, supplierId: selectedSupplier.id } as SupplierEvaluationCreateInput);
      setEvaluationForm({
        evaluationType: 'quarterly',
        evaluationDate: new Date().toISOString().split('T')[0],
        qualityScore: 0,
        deliveryScore: 0,
        serviceScore: 0,
        priceScore: 0,
      });
    } catch (error) {
      console.error('创建评估失败:', error);
    }
  };

  // 创建产品
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    try {
      await createProduct({ ...productForm, supplierId: selectedSupplier.id, productId: 1 } as SupplierProductCreateInput);
      setProductForm({
        productCode: '',
        productName: '',
        unitPrice: 0,
        currency: 'CNY',
        minOrderQuantity: 1,
        leadTime: 0,
        isPreferred: false,
      });
    } catch (error) {
      console.error('创建产品失败:', error);
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
      creditDays: 0,
      minOrderAmount: 0,
      deliveryLeadTime: 0,
      qualityRating: 5.0,
      serviceRating: 5.0,
      deliveryRating: 5.0,
    });
    setSelectedSupplier(null);
  };

  // 渲染供应商列表
  const renderSupplierList = () => (
    <div className="supplier-list">
      <div className="supplier-list-header">
        <h2>供应商管理</h2>
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
            + 新建供应商
          </button>
        </div>
      </div>

      {supplierListLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>供应商编号</th>
              <th>供应商名称</th>
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
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.code}</td>
                <td className="font-medium">{supplier.name}</td>
                <td>
                  {supplier.type === 'manufacturer' && '🏭 制造商'}
                  {supplier.type === 'distributor' && '📦 经销商'}
                  {supplier.type === 'company' && '🏢 公司'}
                  {supplier.type === 'individual' && '👤 个人'}
                  {supplier.type === 'other' && '📦 其他'}
                </td>
                <td>{supplier.contactPerson || '-'}</td>
                <td>{supplier.contactPhone || '-'}</td>
                <td>{supplier.city || '-'}</td>
                <td>
                  <span className={`level-badge level-${supplier.level}`}>
                    {supplier.level === 'vip' && '⭐ VIP'}
                    {supplier.level === 'normal' && '✓ 普通'}
                    {supplier.level === 'potential' && '🌱 潜在'}
                    {supplier.level === 'blacklist' && '⚠️ 黑名单'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${supplier.status}`}>
                    {supplier.status === 'active' && '✓ 活跃'}
                    {supplier.status === 'inactive' && '○ 未激活'}
                    {supplier.status === 'potential' && '🌱 潜在'}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => handleViewDetail(supplier)} className="btn-sm">
                    详情
                  </button>
                  <button onClick={() => handleEdit(supplier)} className="btn-sm">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(supplier.id)} className="btn-sm btn-danger">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="supplier-list-footer">
        <span>共 {supplierTotal} 个供应商</span>
      </div>
    </div>
  );

  // 渲染供应商表单
  const renderSupplierForm = (isEdit: boolean) => (
    <div className="supplier-form">
      <div className="form-header">
        <h2>{isEdit ? '编辑供应商' : '新建供应商'}</h2>
        <button onClick={() => { resetForm(); setView('list'); }} className="btn-secondary">
          返回列表
        </button>
      </div>

      <form onSubmit={isEdit ? handleUpdate : handleCreate}>
        <div className="form-grid">
          <div className="form-group">
            <label>供应商编号 *</label>
            <input
              type="text"
              value={formData.code || ''}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              disabled={isEdit}
              placeholder="例如：SUP-001"
            />
          </div>

          <div className="form-group">
            <label>供应商名称 *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="供应商全称"
            />
          </div>

          <div className="form-group">
            <label>供应商类型</label>
            <select
              value={formData.type || 'company'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="manufacturer">🏭 制造商</option>
              <option value="distributor">📦 经销商</option>
              <option value="company">🏢 公司</option>
              <option value="individual">👤 个人</option>
              <option value="other">📦 其他</option>
            </select>
          </div>

          <div className="form-group">
            <label>供应商等级</label>
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
              type="text"
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
            <label>账期 (天)</label>
            <input
              type="number"
              value={formData.creditDays || 0}
              onChange={(e) => setFormData({ ...formData, creditDays: parseInt(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>最小订单金额</label>
            <input
              type="number"
              value={formData.minOrderAmount || 0}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>交货周期 (天)</label>
            <input
              type="number"
              value={formData.deliveryLeadTime || 0}
              onChange={(e) => setFormData({ ...formData, deliveryLeadTime: parseInt(e.target.value) })}
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>备注</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="备注信息"
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={operationLoading}>
            {operationLoading ? '保存中...' : '保存'}
          </button>
          <button type="button" onClick={() => { resetForm(); setView('list'); }} className="btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  );

  // 渲染供应商详情
  const renderSupplierDetail = () => {
    if (!selectedSupplier) return null;

    return (
      <div className="supplier-detail">
        <div className="detail-header">
          <h2>{selectedSupplier.name}</h2>
          <div className="header-actions">
            <button onClick={() => handleEdit(selectedSupplier)} className="btn-primary">
              编辑
            </button>
            <button onClick={() => { resetForm(); setView('list'); }} className="btn-secondary">
              返回列表
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
            联系人
          </button>
          <button
            className={`tab ${activeTab === 'evaluations' ? 'active' : ''}`}
            onClick={() => setActiveTab('evaluations')}
          >
            评估记录
          </button>
          <button
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            供应产品
          </button>
        </div>

        <div className="detail-content">
          {activeTab === 'info' && (
            <div className="info-grid">
              <div className="info-item">
                <label>供应商编号</label>
                <span>{selectedSupplier.code}</span>
              </div>
              <div className="info-item">
                <label>供应商类型</label>
                <span>{selectedSupplier.type}</span>
              </div>
              <div className="info-item">
                <label>供应商等级</label>
                <span className={`level-badge level-${selectedSupplier.level}`}>
                  {selectedSupplier.level === 'vip' && '⭐ VIP'}
                  {selectedSupplier.level === 'normal' && '✓ 普通'}
                  {selectedSupplier.level === 'potential' && '🌱 潜在'}
                  {selectedSupplier.level === 'blacklist' && '⚠️ 黑名单'}
                </span>
              </div>
              <div className="info-item">
                <label>状态</label>
                <span className={`status-badge status-${selectedSupplier.status}`}>
                  {selectedSupplier.status === 'active' && '✓ 活跃'}
                  {selectedSupplier.status === 'inactive' && '○ 未激活'}
                  {selectedSupplier.status === 'potential' && '🌱 潜在'}
                </span>
              </div>
              <div className="info-item">
                <label>联系人</label>
                <span>{selectedSupplier.contactPerson || '-'}</span>
              </div>
              <div className="info-item">
                <label>联系电话</label>
                <span>{selectedSupplier.contactPhone || '-'}</span>
              </div>
              <div className="info-item">
                <label>联系邮箱</label>
                <span>{selectedSupplier.contactEmail || '-'}</span>
              </div>
              <div className="info-item">
                <label>账期</label>
                <span>{selectedSupplier.creditDays} 天</span>
              </div>
              <div className="info-item">
                <label>最小订单金额</label>
                <span>¥{selectedSupplier.minOrderAmount.toFixed(2)}</span>
              </div>
              <div className="info-item">
                <label>交货周期</label>
                <span>{selectedSupplier.deliveryLeadTime} 天</span>
              </div>
              <div className="info-item">
                <label>质量评分</label>
                <span>{'⭐'.repeat(Math.round(selectedSupplier.qualityRating))}</span>
              </div>
              <div className="info-item">
                <label>服务评分</label>
                <span>{'⭐'.repeat(Math.round(selectedSupplier.serviceRating))}</span>
              </div>
              <div className="info-item">
                <label>交货评分</label>
                <span>{'⭐'.repeat(Math.round(selectedSupplier.deliveryRating))}</span>
              </div>
              {selectedSupplier.notes && (
                <div className="info-item full-width">
                  <label>备注</label>
                  <span>{selectedSupplier.notes}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="contacts-section">
              <h3>联系人列表</h3>
              <form onSubmit={handleCreateContact} className="contact-form">
                <input
                  type="text"
                  value={contactForm.name || ''}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="姓名"
                  required
                />
                <input
                  type="text"
                  value={contactForm.phone || ''}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="电话"
                />
                <input
                  type="email"
                  value={contactForm.email || ''}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="邮箱"
                />
                <label>
                  <input
                    type="checkbox"
                    checked={contactForm.isPrimary || false}
                    onChange={(e) => setContactForm({ ...contactForm, isPrimary: e.target.checked })}
                  />
                  主要联系人
                </label>
                <button type="submit" className="btn-sm btn-primary">添加</button>
              </form>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>电话</th>
                    <th>邮箱</th>
                    <th>主要联系人</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.name}</td>
                      <td>{contact.phone || '-'}</td>
                      <td>{contact.email || '-'}</td>
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

          {activeTab === 'evaluations' && (
            <div className="evaluations-section">
              <h3>评估记录</h3>
              <form onSubmit={handleCreateEvaluation} className="evaluation-form">
                <select
                  value={evaluationForm.evaluationType || 'quarterly'}
                  onChange={(e) => setEvaluationForm({ ...evaluationForm, evaluationType: e.target.value as any })}
                >
                  <option value="quarterly">季度评估</option>
                  <option value="annual">年度评估</option>
                  <option value="project">项目评估</option>
                  <option value="other">其他</option>
                </select>
                <input
                  type="date"
                  value={evaluationForm.evaluationDate || ''}
                  onChange={(e) => setEvaluationForm({ ...evaluationForm, evaluationDate: e.target.value })}
                  required
                />
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={evaluationForm.qualityScore || 0}
                  onChange={(e) => setEvaluationForm({ ...evaluationForm, qualityScore: parseFloat(e.target.value) })}
                  placeholder="质量评分"
                />
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={evaluationForm.deliveryScore || 0}
                  onChange={(e) => setEvaluationForm({ ...evaluationForm, deliveryScore: parseFloat(e.target.value) })}
                  placeholder="交货评分"
                />
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={evaluationForm.serviceScore || 0}
                  onChange={(e) => setEvaluationForm({ ...evaluationForm, serviceScore: parseFloat(e.target.value) })}
                  placeholder="服务评分"
                />
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={evaluationForm.priceScore || 0}
                  onChange={(e) => setEvaluationForm({ ...evaluationForm, priceScore: parseFloat(e.target.value) })}
                  placeholder="价格评分"
                />
                <button type="submit" className="btn-sm btn-primary">添加评估</button>
              </form>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="products-section">
              <h3>供应产品</h3>
              <form onSubmit={handleCreateProduct} className="product-form">
                <input
                  type="text"
                  value={productForm.productCode || ''}
                  onChange={(e) => setProductForm({ ...productForm, productCode: e.target.value })}
                  placeholder="产品编号"
                />
                <input
                  type="text"
                  value={productForm.productName || ''}
                  onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                  placeholder="产品名称"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  value={productForm.unitPrice || 0}
                  onChange={(e) => setProductForm({ ...productForm, unitPrice: parseFloat(e.target.value) })}
                  placeholder="单价"
                />
                <input
                  type="number"
                  value={productForm.minOrderQuantity || 1}
                  onChange={(e) => setProductForm({ ...productForm, minOrderQuantity: parseInt(e.target.value) })}
                  placeholder="最小起订量"
                />
                <input
                  type="number"
                  value={productForm.leadTime || 0}
                  onChange={(e) => setProductForm({ ...productForm, leadTime: parseInt(e.target.value) })}
                  placeholder="交货周期 (天)"
                />
                <label>
                  <input
                    type="checkbox"
                    checked={productForm.isPreferred || false}
                    onChange={(e) => setProductForm({ ...productForm, isPreferred: e.target.checked })}
                  />
                  首选供应商
                </label>
                <button type="submit" className="btn-sm btn-primary">添加</button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="supplier-page">
      {view === 'list' && renderSupplierList()}
      {view === 'create' && renderSupplierForm(false)}
      {view === 'edit' && renderSupplierForm(true)}
      {view === 'detail' && renderSupplierDetail()}
    </div>
  );
}
