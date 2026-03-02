// 订单管理模块 UI 组件

import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../../stores/order';
import type {
  SalesOrder,
  SalesOrderCreateInput,
  SalesOrderUpdateInput,
  SalesOrderItemInput,
  PurchaseOrder,
  PurchaseOrderCreateInput,
  PurchaseOrderUpdateInput,
  PurchaseOrderItemInput,
} from '../../types/order';

export function OrderPage() {
  const {
    // 销售订单
    salesOrders,
    salesOrdersLoading,
    fetchSalesOrders,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
    fetchSalesOrder,
    currentSalesOrderItems,
    confirmSalesOrder,
    shipSalesOrder,
    completeSalesOrder,
    cancelSalesOrder,
    
    // 采购订单
    purchaseOrders,
    purchaseOrdersLoading,
    fetchPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    fetchPurchaseOrder,
    currentPurchaseOrderItems,
    confirmPurchaseOrder,
    receivePurchaseOrder,
    cancelPurchaseOrder,
    
    // 客户
    customers,
    fetchCustomers,
    
    // 供应商
    suppliers,
    fetchSuppliers,
    
    operationLoading,
    operationError,
  } = useOrderStore();

  // 视图状态
  const [orderType, setOrderType] = useState<'sales' | 'purchase'>('sales');
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'detail'>('list');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | PurchaseOrder | null>(null);
  const [activeTab, setActiveTab] = useState<'detail' | 'items' | 'history'>('detail');

  // 表单状态
  const [formData, setFormData] = useState<Partial<SalesOrderCreateInput & PurchaseOrderCreateInput>>({
    customerId: undefined,
    supplierId: undefined,
    requiredDate: null,
    warehouseId: null,
    taxRate: 0,
    discountAmount: 0,
    shippingFee: 0,
    shippingAddress: '',
    notes: '',
    internalNotes: '',
    items: [],
  });

  // 订单项表单
  const [itemForm, setItemForm] = useState({
    productId: 0,
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    taxRate: 0,
    notes: '',
  });

  // 初始化加载
  useEffect(() => {
    if (orderType === 'sales') {
      fetchSalesOrders({ limit: 50, offset: 0 });
    } else {
      fetchPurchaseOrders({ limit: 50, offset: 0 });
    }
    fetchCustomers();
    fetchSuppliers();
  }, [orderType]);

  // 处理创建订单
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (orderType === 'sales') {
        await createSalesOrder(formData as SalesOrderCreateInput);
      } else {
        await createPurchaseOrder(formData as PurchaseOrderCreateInput);
      }
      setView('list');
      resetForm();
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 处理更新订单
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      if (orderType === 'sales') {
        await updateSalesOrder(selectedOrder.id, formData as SalesOrderUpdateInput);
      } else {
        await updatePurchaseOrder(selectedOrder.id, formData as PurchaseOrderUpdateInput);
      }
      setView('list');
      resetForm();
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  // 处理删除订单
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此订单吗？')) return;
    try {
      if (orderType === 'sales') {
        await deleteSalesOrder(id);
      } else {
        await deletePurchaseOrder(id);
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 编辑订单
  const handleEdit = (order: SalesOrder | PurchaseOrder) => {
    setSelectedOrder(order);
    setFormData({
      requiredDate: 'requiredDate' in order ? order.requiredDate : null,
      warehouseId: order.warehouseId,
      taxRate: order.taxRate,
      discountAmount: order.discountAmount,
      shippingFee: order.shippingFee,
      shippingAddress: order.shippingAddress || '',
      notes: order.notes || '',
      internalNotes: order.internalNotes || '',
      items: [],
    });
    setView('edit');
  };

  // 查看订单详情
  const handleViewDetail = async (order: SalesOrder | PurchaseOrder) => {
    setSelectedOrder(order);
    if (orderType === 'sales') {
      await fetchSalesOrder(order.id);
    } else {
      await fetchPurchaseOrder(order.id);
    }
    setView('detail');
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      customerId: undefined,
      supplierId: undefined,
      requiredDate: null,
      warehouseId: null,
      taxRate: 0,
      discountAmount: 0,
      shippingFee: 0,
      shippingAddress: '',
      notes: '',
      internalNotes: '',
      items: [],
    });
    setSelectedOrder(null);
  };

  // 添加订单项
  const handleAddItem = () => {
    if (itemForm.productId === 0) return;
    const newItem = orderType === 'sales'
      ? {
          productId: itemForm.productId,
          quantity: itemForm.quantity,
          unitPrice: itemForm.unitPrice,
          discount: itemForm.discount,
          taxRate: itemForm.taxRate,
          notes: itemForm.notes,
        } as SalesOrderItemInput
      : {
          productId: itemForm.productId,
          quantity: itemForm.quantity,
          unitPrice: itemForm.unitPrice,
          discount: itemForm.discount,
          taxRate: itemForm.taxRate,
          notes: itemForm.notes,
        } as PurchaseOrderItemInput;
    
    setFormData({
      ...formData,
      items: [...(formData.items || []), newItem],
    });
    setItemForm({ productId: 0, quantity: 1, unitPrice: 0, discount: 0, taxRate: 0, notes: '' });
  };

  // 移除订单项
  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: (formData.items || []).filter((_, i) => i !== index),
    });
  };

  // 订单状态操作
  const handleOrderAction = async (action: string) => {
    if (!selectedOrder) return;
    try {
      if (orderType === 'sales') {
        switch (action) {
          case 'confirm':
            await confirmSalesOrder(selectedOrder.id, '用户确认');
            break;
          case 'ship':
            await shipSalesOrder(selectedOrder.id, '已发货');
            break;
          case 'complete':
            await completeSalesOrder(selectedOrder.id, '订单完成');
            break;
          case 'cancel':
            await cancelSalesOrder(selectedOrder.id, '用户取消');
            break;
        }
      } else {
        switch (action) {
          case 'confirm':
            await confirmPurchaseOrder(selectedOrder.id, '用户确认');
            break;
          case 'receive':
            await receivePurchaseOrder(selectedOrder.id, '已收货');
            break;
          case 'cancel':
            await cancelPurchaseOrder(selectedOrder.id, '用户取消');
            break;
        }
      }
      setView('list');
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待处理',
      confirmed: '已确认',
      processing: '处理中',
      shipped: '已发货',
      received: '已收货',
      completed: '已完成',
      cancelled: '已取消',
      refunded: '已退款',
    };
    return statusMap[status] || status;
  };

  // 获取支付状态文本
  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      unpaid: '未支付',
      partial: '部分支付',
      paid: '已支付',
      refunded: '已退款',
    };
    return statusMap[status] || status;
  };

  // 渲染订单列表
  const renderOrderList = () => {
    const orders = orderType === 'sales' ? salesOrders : purchaseOrders;
    const loading = orderType === 'sales' ? salesOrdersLoading : purchaseOrdersLoading;

    if (loading) {
      return <div className="text-center py-8">加载中...</div>;
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{orderType === 'sales' ? '销售订单' : '采购订单'}</h2>
          <button
            onClick={() => {
              resetForm();
              setView('create');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + 新建订单
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {orderType === 'sales' ? '客户' : '供应商'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支付状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {orderType === 'sales' ? `客户${(order as SalesOrder).customerId}` : `供应商${(order as PurchaseOrder).supplierId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getPaymentStatusText(order.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ¥{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewDetail(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => handleEdit(order)}
                      className="text-green-600 hover:text-green-900"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 渲染创建/编辑表单
  const renderForm = () => {
    const isEdit = view === 'edit';

    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? '编辑订单' : '新建订单'} - {orderType === 'sales' ? '销售订单' : '采购订单'}
        </h2>

        <form onSubmit={view === 'create' ? handleCreate : handleUpdate} className="space-y-6">
          {/* 基本信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">基本信息</h3>
            <div className="grid grid-cols-2 gap-4">
              {orderType === 'sales' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">客户</label>
                  <select
                    value={formData.customerId || ''}
                    onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">选择客户</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">供应商</label>
                  <select
                    value={formData.supplierId || ''}
                    onChange={(e) => setFormData({ ...formData, supplierId: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">选择供应商</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">要求日期</label>
                <input
                  type="date"
                  value={formData.requiredDate || ''}
                  onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">税率 (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.taxRate || 0}
                  onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">折扣金额</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discountAmount || 0}
                  onChange={(e) => setFormData({ ...formData, discountAmount: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">运费</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.shippingFee || 0}
                  onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">送货地址</label>
              <textarea
                value={formData.shippingAddress || ''}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">备注</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 订单项 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">订单明细</h3>
            
            {/* 添加商品 */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">商品 ID</label>
                <input
                  type="number"
                  value={itemForm.productId}
                  onChange={(e) => setItemForm({ ...itemForm, productId: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">数量</label>
                <input
                  type="number"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({ ...itemForm, quantity: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">单价</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemForm.unitPrice}
                  onChange={(e) => setItemForm({ ...itemForm, unitPrice: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">折扣</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemForm.discount}
                  onChange={(e) => setItemForm({ ...itemForm, discount: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  添加
                </button>
              </div>
            </div>

            {/* 商品列表 */}
            {formData.items && formData.items.length > 0 && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">商品 ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">数量</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">单价</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">折扣</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">小计</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">{item.productId}</td>
                      <td className="px-4 py-2 text-sm">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm">¥{item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm">¥{item.discount?.toFixed(2) || '0.00'}</td>
                      <td className="px-4 py-2 text-sm">
                        ¥{(item.quantity * item.unitPrice - (item.discount || 0)).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-900"
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

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setView('list');
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={operationLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {operationLoading ? '保存中...' : isEdit ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // 渲染订单详情
  const renderDetail = () => {
    if (!selectedOrder) return null;

    const items = orderType === 'sales' ? currentSalesOrderItems : currentPurchaseOrderItems;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">订单详情 - {selectedOrder.orderNo}</h2>
          <button
            onClick={() => setView('list')}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            返回列表
          </button>
        </div>

        {/* 选项卡 */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('detail')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'detail'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              基本信息
            </button>
            <button
              onClick={() => setActiveTab('items')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'items'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              订单明细 ({items.length})
            </button>
          </nav>
        </div>

        {activeTab === 'detail' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">订单号</label>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder.orderNo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">订单日期</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedOrder.orderDate).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">状态</label>
                <p className="mt-1 text-sm text-gray-900">{getStatusText(selectedOrder.status)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">支付状态</label>
                <p className="mt-1 text-sm text-gray-900">{getPaymentStatusText(selectedOrder.paymentStatus)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500"> subtotal</label>
                <p className="mt-1 text-sm text-gray-900">¥{selectedOrder.subtotal.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">税金</label>
                <p className="mt-1 text-sm text-gray-900">¥{selectedOrder.taxAmount.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">折扣</label>
                <p className="mt-1 text-sm text-gray-900">¥{selectedOrder.discountAmount.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">运费</label>
                <p className="mt-1 text-sm text-gray-900">¥{selectedOrder.shippingFee.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">总金额</label>
                <p className="mt-1 text-lg font-bold text-gray-900">¥{selectedOrder.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">已付金额</label>
                <p className="mt-1 text-sm text-gray-900">¥{selectedOrder.paidAmount.toFixed(2)}</p>
              </div>
            </div>

            {selectedOrder.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-500">备注</label>
                <p className="mt-1 text-sm text-gray-900">{selectedOrder.notes}</p>
              </div>
            )}

            {/* 状态操作按钮 */}
            {orderType === 'sales' && selectedOrder.status === 'pending' && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleOrderAction('confirm')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  确认订单
                </button>
              </div>
            )}
            {orderType === 'sales' && selectedOrder.status === 'confirmed' && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleOrderAction('ship')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  发货
                </button>
              </div>
            )}
            {orderType === 'sales' && selectedOrder.status === 'shipped' && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleOrderAction('complete')}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  完成订单
                </button>
              </div>
            )}
            {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleOrderAction('cancel')}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  取消订单
                </button>
              </div>
            )}

            {orderType === 'purchase' && selectedOrder.status === 'pending' && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleOrderAction('confirm')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  确认订单
                </button>
              </div>
            )}
            {orderType === 'purchase' && selectedOrder.status === 'confirmed' && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleOrderAction('receive')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  确认收货
                </button>
              </div>
            )}
            {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleOrderAction('cancel')}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  取消订单
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'items' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">单价</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">折扣</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">税金</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">小计</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">总计</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{item.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{item.discount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{item.taxAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{item.subtotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">¥{item.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* 订单类型切换 */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setOrderType('sales');
                setView('list');
                resetForm();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                orderType === 'sales'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              销售订单
            </button>
            <button
              onClick={() => {
                setOrderType('purchase');
                setView('list');
                resetForm();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                orderType === 'purchase'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              采购订单
            </button>
          </nav>
        </div>
      </div>

      {/* 错误提示 */}
      {operationError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600">
          {operationError}
        </div>
      )}

      {/* 视图渲染 */}
      {view === 'list' && renderOrderList()}
      {(view === 'create' || view === 'edit') && renderForm()}
      {view === 'detail' && renderDetail()}
    </div>
  );
}
