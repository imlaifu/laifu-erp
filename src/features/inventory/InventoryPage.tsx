// 库存管理模块 UI 组件

import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '../../stores/inventory';
import type {
  InventoryCount,
  InventoryCountInput,
  InventoryTransfer,
  InventoryTransferInput,
} from '../../types/inventory';

export function InventoryPage() {
  const {
    alerts,
    alertsLoading,
    fetchAlerts,
    createAlert,
    deleteAlert,
    
    counts,
    countsLoading,
    fetchCounts,
    createCount,
    updateCountStatus,
    deleteCount,
    currentCount,
    setCurrentCount,
    countItems,
    countItemsLoading,
    fetchCountItems,
    
    transfers,
    transfersLoading,
    fetchTransfers,
    createTransfer,
    updateTransferStatus,
    deleteTransfer,
    currentTransfer,
    setCurrentTransfer,
    transferItems,
    transferItemsLoading,
    fetchTransferItems,
    
    summary,
    summaryLoading,
    fetchSummary,
    lowStockProducts,
    lowStockLoading,
    fetchLowStockProducts,
    
    operationLoading,
  } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'counts' | 'transfers'>('dashboard');
  const [alertFilter, setAlertFilter] = useState<'all' | 'out_of_stock' | 'low' | 'high'>('all');
  const [countFilter, setCountFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [transferFilter, setTransferFilter] = useState<'all' | 'pending' | 'in_transit' | 'completed'>('all');
  
  // 弹窗状态
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showCountModal, setShowCountModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  
  // 表单数据
  const [alertForm, setAlertForm] = useState({
    productId: '',
    warehouseId: '',
    minQuantity: 0,
    maxQuantity: 0,
  });
  
  const [countForm, setCountForm] = useState<Partial<InventoryCountInput>>({
    warehouseId: undefined,
    notes: '',
  });
  
  const [transferForm, setTransferForm] = useState<Partial<InventoryTransferInput>>({
    fromWarehouseId: undefined,
    toWarehouseId: undefined,
    notes: '',
  });

  // 初始化加载
  useEffect(() => {
    fetchSummary();
    fetchLowStockProducts();
    fetchAlerts();
    fetchCounts();
    fetchTransfers();
  }, []);

  // 根据过滤条件筛选数据
  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    return alert.alertStatus === alertFilter;
  });
  
  const filteredCounts = counts.filter(count => {
    if (countFilter === 'all') return true;
    return count.status === countFilter;
  });
  
  const filteredTransfers = transfers.filter(transfer => {
    if (transferFilter === 'all') return true;
    return transfer.status === transferFilter;
  });

  // 处理创建预警
  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAlert({
        productId: Number(alertForm.productId),
        warehouseId: alertForm.warehouseId ? Number(alertForm.warehouseId) : null,
        minQuantity: alertForm.minQuantity,
        maxQuantity: alertForm.maxQuantity,
        alertEnabled: true,
      });
      setShowAlertModal(false);
      setAlertForm({ productId: '', warehouseId: '', minQuantity: 0, maxQuantity: 0 });
    } catch (error) {
      console.error('创建预警失败:', error);
    }
  };

  // 处理创建盘点
  const handleCreateCount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCount({
        warehouseId: countForm.warehouseId || null,
        notes: countForm.notes || null,
      });
      setShowCountModal(false);
      setCountForm({ warehouseId: undefined, notes: '' });
    } catch (error) {
      console.error('创建盘点失败:', error);
    }
  };

  // 处理创建调拨
  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferForm.fromWarehouseId || !transferForm.toWarehouseId) {
      alert('请选择发出仓库和接收仓库');
      return;
    }
    try {
      await createTransfer({
        fromWarehouseId: transferForm.fromWarehouseId,
        toWarehouseId: transferForm.toWarehouseId,
        notes: transferForm.notes || null,
      });
      setShowTransferModal(false);
      setTransferForm({ fromWarehouseId: undefined, toWarehouseId: undefined, notes: '' });
    } catch (error) {
      console.error('创建调拨失败:', error);
    }
  };

  // 处理盘点状态变更
  const handleCountStatusChange = async (count: InventoryCount, status: string) => {
    try {
      await updateCountStatus(count.id, status);
    } catch (error) {
      console.error('更新盘点状态失败:', error);
    }
  };

  // 处理调拨状态变更
  const handleTransferStatusChange = async (transfer: InventoryTransfer, status: string) => {
    try {
      await updateTransferStatus(transfer.id, status);
    } catch (error) {
      console.error('更新调拨状态失败:', error);
    }
  };

  // 查看盘点明细
  const handleViewCountItems = (count: InventoryCount) => {
    setCurrentCount(count);
    fetchCountItems(count.id);
    setActiveTab('counts');
  };

  // 查看调拨明细
  const handleViewTransferItems = (transfer: InventoryTransfer) => {
    setCurrentTransfer(transfer);
    fetchTransferItems(transfer.id);
    setActiveTab('transfers');
  };

  // 渲染仪表盘
  const renderDashboard = () => (
    <div className="inventory-dashboard">
      <h2>库存概览</h2>
      
      {summaryLoading ? (
        <div className="loading">加载中...</div>
      ) : summary ? (
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{summary.totalProducts}</div>
            <div className="stat-label">产品种类</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.totalQuantity.toLocaleString()}</div>
            <div className="stat-label">总库存数量</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">¥{summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="stat-label">库存总价值</div>
          </div>
          <div className="stat-card stat-warning">
            <div className="stat-value">{summary.lowStockCount}</div>
            <div className="stat-label">低库存预警</div>
          </div>
          <div className="stat-card stat-danger">
            <div className="stat-value">{summary.outOfStockCount}</div>
            <div className="stat-label">缺货产品</div>
          </div>
        </div>
      ) : (
        <div className="empty-state">暂无库存数据</div>
      )}

      {/* 低库存产品列表 */}
      <div className="low-stock-section">
        <div className="section-header">
          <h3>⚠️ 低库存产品</h3>
          <button onClick={() => setActiveTab('alerts')} className="btn-link">
            查看全部预警 →
          </button>
        </div>
        
        {lowStockLoading ? (
          <div className="loading">加载中...</div>
        ) : lowStockProducts.length === 0 ? (
          <div className="empty-state">✓ 所有产品库存充足</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>产品名称</th>
                <th>仓库</th>
                <th>当前库存</th>
                <th>最低库存</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.slice(0, 10).map((product) => (
                <tr key={product.productId} className={product.currentQuantity === 0 ? 'row-danger' : 'row-warning'}>
                  <td className="font-mono">{product.productSku}</td>
                  <td className="font-semibold">{product.productName}</td>
                  <td>{product.warehouseName || '主仓库'}</td>
                  <td className="text-right">{product.currentQuantity}</td>
                  <td className="text-right">{product.minQuantity}</td>
                  <td>
                    {product.currentQuantity === 0 ? (
                      <span className="status-badge status-danger">缺货</span>
                    ) : (
                      <span className="status-badge status-warning">低库存</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 快速操作 */}
      <div className="quick-actions">
        <h3>快速操作</h3>
        <div className="action-buttons">
          <button onClick={() => setShowCountModal(true)} className="btn-primary">
            📋 创建盘点
          </button>
          <button onClick={() => setShowTransferModal(true)} className="btn-primary">
            🔄 创建调拨
          </button>
          <button onClick={() => setActiveTab('alerts')} className="btn-secondary">
            ⚠️ 查看预警
          </button>
        </div>
      </div>
    </div>
  );

  // 渲染预警管理
  const renderAlerts = () => (
    <div className="inventory-alerts">
      <div className="page-header">
        <h2>库存预警管理</h2>
        <button onClick={() => setShowAlertModal(true)} className="btn-primary">
          + 新建预警
        </button>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${alertFilter === 'all' ? 'active' : ''}`}
          onClick={() => setAlertFilter('all')}
        >
          全部
        </button>
        <button
          className={`filter-btn ${alertFilter === 'out_of_stock' ? 'active' : ''}`}
          onClick={() => setAlertFilter('out_of_stock')}
        >
          🔴 缺货
        </button>
        <button
          className={`filter-btn ${alertFilter === 'low' ? 'active' : ''}`}
          onClick={() => setAlertFilter('low')}
        >
          🟠 低库存
        </button>
        <button
          className={`filter-btn ${alertFilter === 'high' ? 'active' : ''}`}
          onClick={() => setAlertFilter('high')}
        >
          🟢 高库存
        </button>
      </div>

      {alertsLoading ? (
        <div className="loading">加载中...</div>
      ) : filteredAlerts.length === 0 ? (
        <div className="empty-state">暂无预警记录</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>产品名称</th>
              <th>仓库</th>
              <th>当前库存</th>
              <th>预警范围</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert) => (
              <tr key={alert.id} className={alert.alertStatus === 'out_of_stock' ? 'row-danger' : alert.alertStatus === 'low' ? 'row-warning' : ''}>
                <td className="font-mono">{alert.productSku}</td>
                <td className="font-semibold">{alert.productName}</td>
                <td>{alert.warehouseName || '全部仓库'}</td>
                <td className="text-right">{alert.currentQuantity}</td>
                <td>{alert.minQuantity} - {alert.maxQuantity > 0 ? alert.maxQuantity : '∞'}</td>
                <td>
                  {alert.alertStatus === 'out_of_stock' && <span className="status-badge status-danger">缺货</span>}
                  {alert.alertStatus === 'low' && <span className="status-badge status-warning">低库存</span>}
                  {alert.alertStatus === 'high' && <span className="status-badge status-success">高库存</span>}
                  {alert.alertStatus === 'normal' && <span className="status-badge status-normal">正常</span>}
                </td>
                <td className="actions">
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="btn-sm btn-danger"
                    disabled={operationLoading}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // 渲染盘点管理
  const renderCounts = () => (
    <div className="inventory-counts">
      <div className="page-header">
        <h2>库存盘点管理</h2>
        <button onClick={() => setShowCountModal(true)} className="btn-primary">
          + 创建盘点
        </button>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${countFilter === 'all' ? 'active' : ''}`}
          onClick={() => setCountFilter('all')}
        >
          全部
        </button>
        <button
          className={`filter-btn ${countFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setCountFilter('pending')}
        >
          待开始
        </button>
        <button
          className={`filter-btn ${countFilter === 'in_progress' ? 'active' : ''}`}
          onClick={() => setCountFilter('in_progress')}
        >
          进行中
        </button>
        <button
          className={`filter-btn ${countFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setCountFilter('completed')}
        >
          已完成
        </button>
      </div>

      {countsLoading ? (
        <div className="loading">加载中...</div>
      ) : filteredCounts.length === 0 ? (
        <div className="empty-state">暂无盘点记录</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>盘点单号</th>
              <th>盘点日期</th>
              <th>仓库</th>
              <th>进度</th>
              <th>差异数</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredCounts.map((count) => (
              <tr key={count.id}>
                <td className="font-mono">CNT-{count.id.toString().padStart(5, '0')}</td>
                <td>{new Date(count.countDate).toLocaleDateString()}</td>
                <td>{count.warehouseId ? `仓库 #${count.warehouseId}` : '全部仓库'}</td>
                <td>{count.countedItems} / {count.totalItems}</td>
                <td className={count.discrepancyCount > 0 ? 'text-red-600' : ''}>
                  {count.discrepancyCount > 0 ? `+${count.discrepancyCount}` : '-'}
                </td>
                <td>
                  {count.status === 'pending' && <span className="status-badge status-pending">待开始</span>}
                  {count.status === 'in_progress' && <span className="status-badge status-info">进行中</span>}
                  {count.status === 'completed' && <span className="status-badge status-success">已完成</span>}
                  {count.status === 'cancelled' && <span className="status-badge status-danger">已取消</span>}
                </td>
                <td className="actions">
                  {count.status === 'pending' && (
                    <button onClick={() => handleCountStatusChange(count, 'in_progress')} className="btn-sm btn-success">
                      开始
                    </button>
                  )}
                  {count.status === 'in_progress' && (
                    <button onClick={() => handleCountStatusChange(count, 'completed')} className="btn-sm btn-primary">
                      完成
                    </button>
                  )}
                  <button onClick={() => handleViewCountItems(count)} className="btn-sm">
                    明细
                  </button>
                  <button onClick={() => deleteCount(count.id)} className="btn-sm btn-danger">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 当前盘点明细 */}
      {currentCount && (
        <div className="count-items-panel">
          <div className="panel-header">
            <h3>盘点明细 - CNT-{currentCount.id.toString().padStart(5, '0')}</h3>
            <button onClick={() => setCurrentCount(null)} className="btn-close">×</button>
          </div>
          
          {countItemsLoading ? (
            <div className="loading">加载中...</div>
          ) : countItems.length === 0 ? (
            <div className="empty-state">暂无盘点明细</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>产品</th>
                  <th>系统数量</th>
                  <th>盘点数量</th>
                  <th>差异</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {countItems.map((item) => (
                  <tr key={item.id}>
                    <td>产品 #{item.productId}</td>
                    <td className="text-right">{item.systemQuantity}</td>
                    <td className="text-right">{item.countedQuantity ?? '-'}</td>
                    <td className={`text-right ${item.discrepancy && item.discrepancy !== 0 ? 'text-red-600' : ''}`}>
                      {item.discrepancy ?? '-'}
                    </td>
                    <td>
                      {item.status === 'pending' && '待盘点'}
                      {item.status === 'counted' && '已盘点'}
                      {item.status === 'verified' && '已核实'}
                      {item.status === 'adjusted' && '已调整'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );

  // 渲染调拨管理
  const renderTransfers = () => (
    <div className="inventory-transfers">
      <div className="page-header">
        <h2>库存调拨管理</h2>
        <button onClick={() => setShowTransferModal(true)} className="btn-primary">
          + 创建调拨
        </button>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${transferFilter === 'all' ? 'active' : ''}`}
          onClick={() => setTransferFilter('all')}
        >
          全部
        </button>
        <button
          className={`filter-btn ${transferFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setTransferFilter('pending')}
        >
          待处理
        </button>
        <button
          className={`filter-btn ${transferFilter === 'in_transit' ? 'active' : ''}`}
          onClick={() => setTransferFilter('in_transit')}
        >
          调拨中
        </button>
        <button
          className={`filter-btn ${transferFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setTransferFilter('completed')}
        >
          已完成
        </button>
      </div>

      {transfersLoading ? (
        <div className="loading">加载中...</div>
      ) : filteredTransfers.length === 0 ? (
        <div className="empty-state">暂无调拨记录</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>调拨单号</th>
              <th>发出仓库</th>
              <th>接收仓库</th>
              <th>物品数</th>
              <th>创建时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransfers.map((transfer) => (
              <tr key={transfer.id}>
                <td className="font-mono">{transfer.transferNo}</td>
                <td>{transfer.fromWarehouseName}</td>
                <td>{transfer.toWarehouseName}</td>
                <td className="text-right">{transfer.totalItems}</td>
                <td>{new Date(transfer.createdAt).toLocaleString()}</td>
                <td>
                  {transfer.status === 'pending' && <span className="status-badge status-pending">待处理</span>}
                  {transfer.status === 'in_transit' && <span className="status-badge status-info">调拨中</span>}
                  {transfer.status === 'completed' && <span className="status-badge status-success">已完成</span>}
                  {transfer.status === 'cancelled' && <span className="status-badge status-danger">已取消</span>}
                </td>
                <td className="actions">
                  {transfer.status === 'pending' && (
                    <button onClick={() => handleTransferStatusChange(transfer, 'in_transit')} className="btn-sm btn-success">
                      发货
                    </button>
                  )}
                  {transfer.status === 'in_transit' && (
                    <button onClick={() => handleTransferStatusChange(transfer, 'completed')} className="btn-sm btn-primary">
                      收货
                    </button>
                  )}
                  <button onClick={() => handleViewTransferItems(transfer)} className="btn-sm">
                    明细
                  </button>
                  <button onClick={() => deleteTransfer(transfer.id)} className="btn-sm btn-danger">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 当前调拨明细 */}
      {currentTransfer && (
        <div className="transfer-items-panel">
          <div className="panel-header">
            <h3>调拨明细 - {currentTransfer.transferNo}</h3>
            <button onClick={() => setCurrentTransfer(null)} className="btn-close">×</button>
          </div>
          
          {transferItemsLoading ? (
            <div className="loading">加载中...</div>
          ) : transferItems.length === 0 ? (
            <div className="empty-state">暂无调拨明细</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>产品</th>
                  <th>SKU</th>
                  <th>调拨数量</th>
                  <th>已发货</th>
                  <th>已收货</th>
                </tr>
              </thead>
              <tbody>
                {transferItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td className="font-mono">{item.productSku}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{item.shippedQuantity ?? '-'}</td>
                    <td className="text-right">{item.receivedQuantity ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="inventory-page">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 库存概览
        </button>
        <button
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          ⚠️ 预警管理
        </button>
        <button
          className={`tab ${activeTab === 'counts' ? 'active' : ''}`}
          onClick={() => setActiveTab('counts')}
        >
          📋 盘点管理
        </button>
        <button
          className={`tab ${activeTab === 'transfers' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfers')}
        >
          🔄 调拨管理
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'counts' && renderCounts()}
        {activeTab === 'transfers' && renderTransfers()}
      </div>

      {/* 创建预警弹窗 */}
      {showAlertModal && (
        <div className="modal-overlay" onClick={() => setShowAlertModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>创建库存预警</h3>
              <button onClick={() => setShowAlertModal(false)} className="btn-close">×</button>
            </div>
            <form onSubmit={handleCreateAlert}>
              <div className="form-group">
                <label>产品 ID *</label>
                <input
                  type="number"
                  value={alertForm.productId}
                  onChange={(e) => setAlertForm({ ...alertForm, productId: e.target.value })}
                  required
                  placeholder="请输入产品 ID"
                />
              </div>
              <div className="form-group">
                <label>仓库 ID (可选)</label>
                <input
                  type="number"
                  value={alertForm.warehouseId}
                  onChange={(e) => setAlertForm({ ...alertForm, warehouseId: e.target.value })}
                  placeholder="留空表示全部仓库"
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>最低库存 *</label>
                  <input
                    type="number"
                    min="0"
                    value={alertForm.minQuantity}
                    onChange={(e) => setAlertForm({ ...alertForm, minQuantity: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>最高库存</label>
                  <input
                    type="number"
                    min="0"
                    value={alertForm.maxQuantity}
                    onChange={(e) => setAlertForm({ ...alertForm, maxQuantity: parseInt(e.target.value) || 0 })}
                    placeholder="0 表示无上限"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary" disabled={operationLoading}>
                  {operationLoading ? '创建中...' : '创建'}
                </button>
                <button type="button" onClick={() => setShowAlertModal(false)} className="btn-secondary">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 创建盘点弹窗 */}
      {showCountModal && (
        <div className="modal-overlay" onClick={() => setShowCountModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>创建库存盘点</h3>
              <button onClick={() => setShowCountModal(false)} className="btn-close">×</button>
            </div>
            <form onSubmit={handleCreateCount}>
              <div className="form-group">
                <label>仓库 ID (可选)</label>
                <input
                  type="number"
                  value={countForm.warehouseId || ''}
                  onChange={(e) => setCountForm({ ...countForm, warehouseId: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="留空表示全部仓库"
                />
              </div>
              <div className="form-group">
                <label>备注</label>
                <textarea
                  value={countForm.notes || ''}
                  onChange={(e) => setCountForm({ ...countForm, notes: e.target.value })}
                  rows={3}
                  placeholder="可选备注信息"
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary" disabled={operationLoading}>
                  {operationLoading ? '创建中...' : '创建'}
                </button>
                <button type="button" onClick={() => setShowCountModal(false)} className="btn-secondary">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 创建调拨弹窗 */}
      {showTransferModal && (
        <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>创建库存调拨</h3>
              <button onClick={() => setShowTransferModal(false)} className="btn-close">×</button>
            </div>
            <form onSubmit={handleCreateTransfer}>
              <div className="form-grid">
                <div className="form-group">
                  <label>发出仓库 *</label>
                  <input
                    type="number"
                    value={transferForm.fromWarehouseId || ''}
                    onChange={(e) => setTransferForm({ ...transferForm, fromWarehouseId: e.target.value ? Number(e.target.value) : undefined })}
                    required
                    placeholder="仓库 ID"
                  />
                </div>
                <div className="form-group">
                  <label>接收仓库 *</label>
                  <input
                    type="number"
                    value={transferForm.toWarehouseId || ''}
                    onChange={(e) => setTransferForm({ ...transferForm, toWarehouseId: e.target.value ? Number(e.target.value) : undefined })}
                    required
                    placeholder="仓库 ID"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>备注</label>
                <textarea
                  value={transferForm.notes || ''}
                  onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                  rows={3}
                  placeholder="可选备注信息"
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary" disabled={operationLoading}>
                  {operationLoading ? '创建中...' : '创建'}
                </button>
                <button type="button" onClick={() => setShowTransferModal(false)} className="btn-secondary">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
