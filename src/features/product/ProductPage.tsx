// 产品管理模块 UI 组件

import React, { useState, useEffect } from 'react';
import { useProductStore } from '../../stores/product';
import type { Product, ProductCreateInput, ProductUpdateInput } from '../../types/product';

export function ProductPage() {
  const {
    products,
    productTotal,
    productsLoading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCategories,
    fetchWarehouses,
    categories,
    warehouses,
    operationLoading,
    fetchInventory,
    stockIn,
    stockOut,
    fetchTransactions,
    transactions,
  } = useProductStore();

  const [view, setView] = useState<'list' | 'create' | 'edit' | 'inventory'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'detail' | 'inventory' | 'transactions'>('detail');
  const [formData, setFormData] = useState<Partial<ProductCreateInput & ProductUpdateInput>>({
    sku: '',
    name: '',
    description: '',
    categoryId: undefined,
    brand: '',
    model: '',
    unit: '件',
    costPrice: 0,
    sellingPrice: 0,
    wholesalePrice: 0,
    minStock: 0,
    maxStock: 0,
    status: 'active',
    images: [],
  });

  // 库存调整表单
  const [inventoryForm, setInventoryForm] = useState({
    warehouseId: '' as string | number,
    quantity: 0,
    reason: '',
    notes: '',
  });

  // 初始化加载
  useEffect(() => {
    fetchProducts({ limit: 50, offset: 0 });
    fetchCategories();
    fetchWarehouses();
  }, []);

  // 处理创建产品
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(formData as ProductCreateInput);
      setView('list');
      resetForm();
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 处理更新产品
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await updateProduct(selectedProduct.id, formData as ProductUpdateInput);
      setView('list');
      resetForm();
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  // 处理删除产品
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此产品吗？')) return;
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 编辑产品
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      brand: product.brand || '',
      model: product.model || '',
      unit: product.unit,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      wholesalePrice: product.wholesalePrice,
      minStock: product.minStock,
      maxStock: product.maxStock,
      status: product.status,
      images: product.images,
    });
    setView('edit');
  };

  // 查看库存
  const handleViewInventory = (product: Product) => {
    setSelectedProduct(product);
    fetchInventory();
    fetchTransactions(product.id);
    setView('inventory');
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      categoryId: undefined,
      brand: '',
      model: '',
      unit: '件',
      costPrice: 0,
      sellingPrice: 0,
      wholesalePrice: 0,
      minStock: 0,
      maxStock: 0,
      status: 'active',
      images: [],
    });
    setSelectedProduct(null);
  };

  // 处理入库
  const handleStockIn = async (productId: number) => {
    if (!inventoryForm.quantity || inventoryForm.quantity <= 0) {
      alert('请输入有效的数量');
      return;
    }
    try {
      await stockIn(
        productId,
        inventoryForm.quantity,
        inventoryForm.warehouseId ? Number(inventoryForm.warehouseId) : null,
        inventoryForm.reason || '入库',
        inventoryForm.notes
      );
      setInventoryForm({ warehouseId: '', quantity: 0, reason: '', notes: '' });
      alert('入库成功');
    } catch (error) {
      console.error('入库失败:', error);
      alert('入库失败');
    }
  };

  // 处理出库
  const handleStockOut = async (productId: number) => {
    if (!inventoryForm.quantity || inventoryForm.quantity <= 0) {
      alert('请输入有效的数量');
      return;
    }
    try {
      await stockOut(
        productId,
        inventoryForm.quantity,
        inventoryForm.warehouseId ? Number(inventoryForm.warehouseId) : null,
        inventoryForm.reason || '出库',
        inventoryForm.notes
      );
      setInventoryForm({ warehouseId: '', quantity: 0, reason: '', notes: '' });
      alert('出库成功');
    } catch (error) {
      console.error('出库失败:', error);
      alert('出库失败');
    }
  };

  // 渲染产品列表
  const renderProductList = () => (
    <div className="product-list">
      <div className="product-list-header">
        <h2>产品管理</h2>
        <button onClick={() => { resetForm(); setView('create'); }} className="btn-primary">
          + 新建产品
        </button>
      </div>

      {productsLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>产品名称</th>
              <th>分类</th>
              <th>品牌</th>
              <th>型号</th>
              <th>单位</th>
              <th>成本价</th>
              <th>销售价</th>
              <th>库存预警</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="font-mono">{product.sku}</td>
                <td className="font-semibold">{product.name}</td>
                <td>
                  {product.categoryId
                    ? categories.find((c) => c.id === product.categoryId)?.name || '-'
                    : '-'}
                </td>
                <td>{product.brand || '-'}</td>
                <td>{product.model || '-'}</td>
                <td>{product.unit}</td>
                <td className="text-right">¥{product.costPrice.toFixed(2)}</td>
                <td className="text-right">¥{product.sellingPrice.toFixed(2)}</td>
                <td>
                  <span className={product.minStock > 0 ? 'text-orange-600' : ''}>
                    {product.minStock > 0 ? `≥${product.minStock}` : '-'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${product.status}`}>
                    {product.status === 'active' && '✓ 在售'}
                    {product.status === 'inactive' && '○ 停售'}
                    {product.status === 'discontinued' && '✕ 停产'}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => handleViewInventory(product)} className="btn-sm">
                    库存
                  </button>
                  <button onClick={() => handleEdit(product)} className="btn-sm">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="btn-sm btn-danger">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="product-list-footer">
        <span>共 {productTotal} 个产品</span>
      </div>
    </div>
  );

  // 渲染产品表单
  const renderProductForm = (isEdit: boolean) => (
    <div className="product-form">
      <div className="form-header">
        <h2>{isEdit ? '编辑产品' : '新建产品'}</h2>
        <button onClick={() => { resetForm(); setView('list'); }} className="btn-secondary">
          返回列表
        </button>
      </div>

      <form onSubmit={isEdit ? handleUpdate : handleCreate}>
        <div className="form-section">
          <h3>基本信息</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>SKU *</label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                disabled={isEdit}
                placeholder="如：PROD-001"
              />
            </div>

            <div className="form-group">
              <label>产品名称 *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="请输入产品名称"
              />
            </div>

            <div className="form-group">
              <label>分类</label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value ? Number(e.target.value) : undefined })
                }
              >
                <option value="">请选择分类</option>
                {categories.map((cat: { id: number; name: string }) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>品牌</label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="请输入品牌"
              />
            </div>

            <div className="form-group">
              <label>型号</label>
              <input
                type="text"
                value={formData.model || ''}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="请输入型号"
              />
            </div>

            <div className="form-group">
              <label>单位</label>
              <input
                type="text"
                value={formData.unit || '件'}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="如：件、个、箱"
              />
            </div>
          </div>

          <div className="form-group">
            <label>描述</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="请输入产品描述"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>价格信息</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>成本价 (¥)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice || 0}
                onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label>销售价 (¥)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.sellingPrice || 0}
                onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label>批发价 (¥)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.wholesalePrice || 0}
                onChange={(e) => setFormData({ ...formData, wholesalePrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>库存设置</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>最低库存</label>
              <input
                type="number"
                min="0"
                value={formData.minStock || 0}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                placeholder="库存预警线"
              />
            </div>

            <div className="form-group">
              <label>最高库存</label>
              <input
                type="number"
                min="0"
                value={formData.maxStock || 0}
                onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
                placeholder="库存上限"
              />
            </div>

            <div className="form-group">
              <label>状态</label>
              <select
                value={formData.status || 'active'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'active' | 'inactive' | 'discontinued',
                  })
                }
              >
                <option value="active">✓ 在售</option>
                <option value="inactive">○ 停售</option>
                <option value="discontinued">✕ 停产</option>
              </select>
            </div>
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

  // 渲染库存管理视图
  const renderInventoryView = () => {
    if (!selectedProduct) return null;

    return (
      <div className="inventory-view">
        <div className="view-header">
          <h2>库存管理 - {selectedProduct.name}</h2>
          <button onClick={() => { setSelectedProduct(null); setView('list'); }} className="btn-secondary">
            返回产品列表
          </button>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'detail' ? 'active' : ''}`}
            onClick={() => setActiveTab('detail')}
          >
            产品详情
          </button>
          <button
            className={`tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inventory'); fetchInventory(); }}
          >
            库存查询
          </button>
          <button
            className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => { setActiveTab('transactions'); fetchTransactions(selectedProduct.id); }}
          >
            库存流水
          </button>
        </div>

        {activeTab === 'detail' && (
          <div className="product-detail">
            <div className="detail-grid">
              <div className="detail-item">
                <label>SKU</label>
                <div className="value">{selectedProduct.sku}</div>
              </div>
              <div className="detail-item">
                <label>产品名称</label>
                <div className="value">{selectedProduct.name}</div>
              </div>
              <div className="detail-item">
                <label>分类</label>
                <div className="value">
                  {selectedProduct.categoryId
                    ? categories.find((c: { id: number; name: string }) => c.id === selectedProduct.categoryId)?.name || '-'
                    : '-'}
                </div>
              </div>
              <div className="detail-item">
                <label>品牌/型号</label>
                <div className="value">
                  {selectedProduct.brand || '-'} / {selectedProduct.model || '-'}
                </div>
              </div>
              <div className="detail-item">
                <label>成本价</label>
                <div className="value">¥{selectedProduct.costPrice.toFixed(2)}</div>
              </div>
              <div className="detail-item">
                <label>销售价</label>
                <div className="value">¥{selectedProduct.sellingPrice.toFixed(2)}</div>
              </div>
              <div className="detail-item">
                <label>库存预警</label>
                <div className="value">{selectedProduct.minStock} - {selectedProduct.maxStock}</div>
              </div>
              <div className="detail-item">
                <label>状态</label>
                <div className="value">
                  <span className={`status-badge status-${selectedProduct.status}`}>
                    {selectedProduct.status === 'active' && '✓ 在售'}
                    {selectedProduct.status === 'inactive' && '○ 停售'}
                    {selectedProduct.status === 'discontinued' && '✕ 停产'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="inventory-management">
            <div className="inventory-actions">
              <h3>库存操作</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>仓库</label>
                  <select
                    value={inventoryForm.warehouseId}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, warehouseId: e.target.value })}
                  >
                    <option value="">选择仓库</option>
                    {warehouses.map((w: { id: number; name: string; code: string }) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>数量</label>
                  <input
                    type="number"
                    min="1"
                    value={inventoryForm.quantity || ''}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="请输入数量"
                  />
                </div>

                <div className="form-group">
                  <label>原因</label>
                  <input
                    type="text"
                    value={inventoryForm.reason}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, reason: e.target.value })}
                    placeholder="如：采购入库、销售出库"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>备注</label>
                <textarea
                  value={inventoryForm.notes}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, notes: e.target.value })}
                  rows={2}
                  placeholder="可选备注信息"
                />
              </div>

              <div className="action-buttons">
                <button
                  onClick={() => handleStockIn(selectedProduct.id)}
                  className="btn-success"
                  disabled={!inventoryForm.quantity || inventoryForm.quantity <= 0}
                >
                  📥 入库
                </button>
                <button
                  onClick={() => handleStockOut(selectedProduct.id)}
                  className="btn-warning"
                  disabled={!inventoryForm.quantity || inventoryForm.quantity <= 0}
                >
                  📤 出库
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-list">
            <h3>库存流水</h3>
            {transactions.length === 0 ? (
              <div className="empty-state">暂无库存流水记录</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>类型</th>
                    <th>数量</th>
                    <th>变更前</th>
                    <th>变更后</th>
                    <th>仓库</th>
                    <th>原因</th>
                    <th>备注</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((trans) => (
                    <tr key={trans.id}>
                      <td>{new Date(trans.createdAt).toLocaleString()}</td>
                      <td>
                        <span className={`transaction-type type-${trans.transactionType}`}>
                          {trans.transactionType === 'in' && '📥 入库'}
                          {trans.transactionType === 'out' && '📤 出库'}
                          {trans.transactionType === 'adjustment' && '⚙️ 调整'}
                          {trans.transactionType === 'transfer' && '🔄 转移'}
                          {trans.transactionType === 'return' && '↩️ 退货'}
                        </span>
                      </td>
                      <td className={trans.transactionType === 'in' || trans.transactionType === 'return' ? 'text-green-600' : 'text-red-600'}>
                        {trans.transactionType === 'in' || trans.transactionType === 'return' ? '+' : '-'}{trans.quantity}
                      </td>
                      <td>{trans.beforeQuantity}</td>
                      <td>{trans.afterQuantity}</td>
                      <td>{warehouses.find((w) => w.id === trans.warehouseId)?.name || '-'}</td>
                      <td>{trans.reason || '-'}</td>
                      <td>{trans.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="product-page">
      {view === 'list' && renderProductList()}
      {view === 'create' && renderProductForm(false)}
      {view === 'edit' && renderProductForm(true)}
      {view === 'inventory' && renderInventoryView()}
    </div>
  );
}

export default ProductPage;
