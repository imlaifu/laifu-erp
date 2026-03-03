// Procurement Management Module UI Component
// 采购管理模块 UI 组件

import { useState, useEffect } from 'react';
import { useProcurementStore } from '../../stores/procurement';
import type {
  ProcurementRequest,
  ProcurementRequestCreateInput,
  PurchaseOrder,
  PurchaseOrderCreateInput,
  PurchaseContract,
  PurchaseContractCreateInput,
  ReceivingInspection,
  ReceivingInspectionCreateInput,
  SupplierComparison,
  SupplierComparisonCreateInput,
} from '../../types/procurement';

type ProcurementView = 'dashboard' | 'requests' | 'orders' | 'contracts' | 'inspections' | 'comparisons';
type SubView = 'list' | 'create' | 'detail';

export function ProcurementPage() {
  const {
    // 采购申请
    requests,
    requestsLoading,
    fetchRequests,
    createRequest,
    approveRequest,
    rejectRequest,

    // 采购订单
    orders,
    ordersLoading,
    fetchOrders,
    createOrder,
    submitOrder,
    confirmOrder,
    completeOrder,
    cancelOrder,

    // 采购合同
    contracts,
    contractsLoading,
    fetchContracts,
    createContract,

    // 入库验收
    inspections,
    inspectionsLoading,
    fetchInspecctions,
    createInspection,
    completeInspection,
    rejectInspection,

    // 供应商比价
    comparisons,
    comparisonsLoading,
    fetchComparisons,
    createComparison,
  } = useProcurementStore();

  const [view, setView] = useState<ProcurementView>('dashboard');
  const [subView, setSubView] = useState<SubView>('list');

  // 表单状态
  const [requestForm, setRequestForm] = useState<Partial<ProcurementRequestCreateInput>>({
    department: '',
    priority: 'normal',
    notes: '',
    items: [],
  });

  const [orderForm, setOrderForm] = useState<Partial<PurchaseOrderCreateInput>>({
    supplierId: 0,
    requestId: null,
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    paymentTerms: '',
    currency: 'CNY',
    taxRate: 0,
    discountAmount: 0,
    shippingCost: 0,
    notes: '',
    items: [],
  });

  const [contractForm, setContractForm] = useState<Partial<PurchaseContractCreateInput>>({
    orderId: null,
    supplierId: 0,
    contractType: 'standard',
    title: '',
    startDate: '',
    endDate: '',
    totalAmount: 0,
    terms: '',
  });

  const [inspectionForm, setInspectionForm] = useState<Partial<ReceivingInspectionCreateInput>>({
    orderId: 0,
    warehouseId: null,
    inspectionDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [],
  });

  const [comparisonForm, setComparisonForm] = useState<Partial<SupplierComparisonCreateInput>>({
    title: '',
    productId: null,
    productName: '',
    quantity: 1,
  });

  // 初始化数据
  useEffect(() => {
    if (view === 'requests') {
      fetchRequests({ limit: 50, offset: 0 });
    } else if (view === 'orders') {
      fetchOrders({ limit: 50, offset: 0 });
    } else if (view === 'contracts') {
      fetchContracts({ limit: 50, offset: 0 });
    } else if (view === 'inspections') {
      fetchInspecctions({ limit: 50, offset: 0 });
    } else if (view === 'comparisons') {
      fetchComparisons({ limit: 50, offset: 0 });
    }
  }, [view]);

  // 格式化货币
  const formatCurrency = (amount: number, currency: string = 'CNY') => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: '草稿',
      submitted: '已提交',
      pending: '待审批',
      approved: '已批准',
      rejected: '已拒绝',
      cancelled: '已取消',
      confirmed: '已确认',
      partially_received: '部分收货',
      completed: '已完成',
      collecting: '收集中',
      evaluated: '已评估',
      closed: '已关闭',
      signed: '已签署',
      active: '生效中',
      expired: '已过期',
      terminated: '已终止',
      pending_review: '待审核',
      passed: '已通过',
      failed: '未通过',
      unpaid: '未付款',
      partial: '部分',
      paid: '已付款',
      converted: '已转换',
    };
    return labels[status] || status;
  };

  // 获取优先级标签
  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: '低',
      normal: '普通',
      high: '高',
      urgent: '紧急',
    };
    return labels[priority] || priority;
  };

  // 处理创建采购申请
  const handleCreateRequest = async () => {
    try {
      if (!requestForm.items || requestForm.items.length === 0) {
        alert('请至少添加一个明细项');
        return;
      }
      await createRequest(requestForm as ProcurementRequestCreateInput);
      setSubView('list');
      setRequestForm({ department: '', priority: 'normal', notes: '', items: [] });
    } catch (error) {
      console.error('创建采购申请失败:', error);
    }
  };

  // 处理创建采购订单
  const handleCreateOrder = async () => {
    try {
      if (!orderForm.items || orderForm.items.length === 0) {
        alert('请至少添加一个明细项');
        return;
      }
      await createOrder(orderForm as PurchaseOrderCreateInput);
      setSubView('list');
      setOrderForm({
        supplierId: 0,
        requestId: null,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: '',
        paymentTerms: '',
        currency: 'CNY',
        taxRate: 0,
        discountAmount: 0,
        shippingCost: 0,
        notes: '',
        items: [],
      });
    } catch (error) {
      console.error('创建采购订单失败:', error);
    }
  };

  // 处理审批采购申请
  const handleApproveRequest = async (id: number, approved: boolean) => {
    try {
      if (approved) {
        await approveRequest(id, 1); // TODO: 使用实际用户 ID
      } else {
        await rejectRequest(id, '未通过审批');
      }
    } catch (error) {
      console.error('审批采购申请失败:', error);
    }
  };

  // 处理创建采购合同
  const handleCreateContract = async () => {
    try {
      await createContract(contractForm as PurchaseContractCreateInput);
      setSubView('list');
      setContractForm({
        orderId: null,
        supplierId: 0,
        contractType: 'standard',
        title: '',
        startDate: '',
        endDate: '',
        totalAmount: 0,
        terms: '',
      });
    } catch (error) {
      console.error('创建采购合同失败:', error);
    }
  };

  // 处理创建入库验收
  const handleCreateInspection = async () => {
    try {
      if (!inspectionForm.items || inspectionForm.items.length === 0) {
        alert('请至少添加一个明细项');
        return;
      }
      await createInspection(inspectionForm as ReceivingInspectionCreateInput);
      setSubView('list');
      setInspectionForm({
        orderId: 0,
        warehouseId: null,
        inspectionDate: new Date().toISOString().split('T')[0],
        notes: '',
        items: [],
      });
    } catch (error) {
      console.error('创建入库验收单失败:', error);
    }
  };

  // 处理创建供应商比价
  const handleCreateComparison = async () => {
    try {
      await createComparison(comparisonForm as SupplierComparisonCreateInput);
      setSubView('list');
      setComparisonForm({ title: '', productId: null, productName: '', quantity: 1 });
    } catch (error) {
      console.error('创建供应商比价单失败:', error);
    }
  };

  // 渲染导航
  const renderNav = () => (
    <div className="flex gap-2 mb-6 border-b pb-2">
      <button
        onClick={() => setView('dashboard')}
        className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        概览
      </button>
      <button
        onClick={() => setView('requests')}
        className={`px-4 py-2 rounded ${view === 'requests' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        采购申请
      </button>
      <button
        onClick={() => setView('orders')}
        className={`px-4 py-2 rounded ${view === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        采购订单
      </button>
      <button
        onClick={() => setView('contracts')}
        className={`px-4 py-2 rounded ${view === 'contracts' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        采购合同
      </button>
      <button
        onClick={() => setView('inspections')}
        className={`px-4 py-2 rounded ${view === 'inspections' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        入库验收
      </button>
      <button
        onClick={() => setView('comparisons')}
        className={`px-4 py-2 rounded ${view === 'comparisons' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        供应商比价
      </button>
    </div>
  );

  // 渲染概览
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">采购申请总数</h3>
        <p className="text-2xl font-bold">{requests.length}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">待审批申请</h3>
        <p className="text-2xl font-bold text-yellow-500">
          {requests.filter((r) => r.status === 'pending').length}
        </p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">采购订单总数</h3>
        <p className="text-2xl font-bold">{orders.length}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">已完成订单</h3>
        <p className="text-2xl font-bold text-green-500">
          {orders.filter((o) => o.status === 'completed').length}
        </p>
      </div>
    </div>
  );

  // 渲染采购申请列表
  const renderRequests = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">采购申请</h2>
        <button
          onClick={() => setSubView('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 新建申请
        </button>
      </div>

      {subView === 'list' ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">申请单号</th>
                <th className="px-4 py-2 text-left">部门</th>
                <th className="px-4 py-2 text-left">优先级</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">总金额</th>
                <th className="px-4 py-2 text-left">创建时间</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {requestsLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                requests.map((request: ProcurementRequest) => (
                  <tr key={request.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{request.requestNo}</td>
                    <td className="px-4 py-2">{request.department || '-'}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          request.priority === 'urgent'
                            ? 'bg-red-100 text-red-600'
                            : request.priority === 'high'
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-gray-100'
                        }`}
                      >
                        {getPriorityLabel(request.priority)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-600'
                            : request.status === 'rejected'
                              ? 'bg-red-100 text-red-600'
                              : request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100'
                        }`}
                      >
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatCurrency(request.totalAmount)}</td>
                    <td className="px-4 py-2">{formatDate(request.createdAt)}</td>
                    <td className="px-4 py-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(request.id, true)}
                            className="text-green-600 hover:text-green-800 mr-2"
                          >
                            批准
                          </button>
                          <button
                            onClick={() => handleApproveRequest(request.id, false)}
                            className="text-red-600 hover:text-red-800"
                          >
                            拒绝
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">新建采购申请</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">部门</label>
              <input
                type="text"
                value={requestForm.department || ''}
                onChange={(e) => setRequestForm({ ...requestForm, department: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入部门"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">优先级</label>
              <select
                value={requestForm.priority}
                onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value as any })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="low">低</option>
                <option value="normal">普通</option>
                <option value="high">高</option>
                <option value="urgent">紧急</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">备注</label>
              <textarea
                value={requestForm.notes || ''}
                onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="请输入备注"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreateRequest} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                创建
              </button>
              <button onClick={() => setSubView('list')} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 渲染采购订单列表
  const renderOrders = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">采购订单</h2>
        <button
          onClick={() => setSubView('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 新建订单
        </button>
      </div>

      {subView === 'list' ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">订单号</th>
                <th className="px-4 py-2 text-left">供应商</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">付款状态</th>
                <th className="px-4 py-2 text-left">总金额</th>
                <th className="px-4 py-2 text-left">订单日期</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                orders.map((order: PurchaseOrder) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{order.orderNo}</td>
                    <td className="px-4 py-2">{order.supplierName || '-'}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-600'
                              : order.status === 'submitted' || order.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100'
                        }`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          order.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-600'
                            : order.paymentStatus === 'partially_paid'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100'
                        }`}
                      >
                        {getStatusLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-2">{formatDate(order.orderDate)}</td>
                    <td className="px-4 py-2">
                      {order.status === 'draft' && (
                        <button onClick={() => submitOrder(order.id)} className="text-blue-600 hover:text-blue-800 mr-2">
                          提交
                        </button>
                      )}
                      {order.status === 'submitted' && (
                        <button onClick={() => confirmOrder(order.id)} className="text-blue-600 hover:text-blue-800 mr-2">
                          确认
                        </button>
                      )}
                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <button onClick={() => cancelOrder(order.id)} className="text-red-600 hover:text-red-800 mr-2">
                          取消
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button onClick={() => completeOrder(order.id)} className="text-green-600 hover:text-green-800">
                          完成
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">新建采购订单</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">供应商 ID</label>
              <input
                type="number"
                value={orderForm.supplierId}
                onChange={(e) => setOrderForm({ ...orderForm, supplierId: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入供应商 ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">预计交付日期</label>
              <input
                type="date"
                value={orderForm.expectedDeliveryDate || ''}
                onChange={(e) => setOrderForm({ ...orderForm, expectedDeliveryDate: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">付款条款</label>
              <input
                type="text"
                value={orderForm.paymentTerms || ''}
                onChange={(e) => setOrderForm({ ...orderForm, paymentTerms: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="例如：30 天账期"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">备注</label>
              <textarea
                value={orderForm.notes || ''}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="请输入备注"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreateOrder} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                创建
              </button>
              <button onClick={() => setSubView('list')} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 渲染采购合同列表
  const renderContracts = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">采购合同</h2>
        <button
          onClick={() => setSubView('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 新建合同
        </button>
      </div>

      {subView === 'list' ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">合同号</th>
                <th className="px-4 py-2 text-left">合同名称</th>
                <th className="px-4 py-2 text-left">类型</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">总金额</th>
                <th className="px-4 py-2 text-left">有效期</th>
              </tr>
            </thead>
            <tbody>
              {contractsLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                contracts.map((contract: PurchaseContract) => (
                  <tr key={contract.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{contract.contractNo}</td>
                    <td className="px-4 py-2">{contract.title}</td>
                    <td className="px-4 py-2">{contract.contractType}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          contract.status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : contract.status === 'expired' || contract.status === 'terminated'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100'
                        }`}
                      >
                        {getStatusLabel(contract.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatCurrency(contract.totalAmount)}</td>
                    <td className="px-4 py-2">
                      {contract.startDate && contract.endDate
                        ? `${formatDate(contract.startDate)} ~ ${formatDate(contract.endDate)}`
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">新建采购合同</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">合同名称</label>
              <input
                type="text"
                value={contractForm.title}
                onChange={(e) => setContractForm({ ...contractForm, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入合同名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">供应商 ID</label>
              <input
                type="number"
                value={contractForm.supplierId}
                onChange={(e) => setContractForm({ ...contractForm, supplierId: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入供应商 ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">合同类型</label>
              <select
                value={contractForm.contractType}
                onChange={(e) => setContractForm({ ...contractForm, contractType: e.target.value as any })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="standard">标准合同</option>
                <option value="framework">框架协议</option>
                <option value="annual">年度合同</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">开始日期</label>
                <input
                  type="date"
                  value={contractForm.startDate || ''}
                  onChange={(e) => setContractForm({ ...contractForm, startDate: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">结束日期</label>
                <input
                  type="date"
                  value={contractForm.endDate || ''}
                  onChange={(e) => setContractForm({ ...contractForm, endDate: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">合同条款</label>
              <textarea
                value={contractForm.terms || ''}
                onChange={(e) => setContractForm({ ...contractForm, terms: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={4}
                placeholder="请输入合同条款"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreateContract} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                创建
              </button>
              <button onClick={() => setSubView('list')} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 渲染入库验收列表
  const renderInspections = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">入库验收单</h2>
        <button
          onClick={() => setSubView('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 新建验收单
        </button>
      </div>

      {subView === 'list' ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">验收单号</th>
                <th className="px-4 py-2 text-left">订单号</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">质量状态</th>
                <th className="px-4 py-2 text-left">验收日期</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {inspectionsLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : inspections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                inspections.map((inspection: ReceivingInspection) => (
                  <tr key={inspection.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{inspection.inspectionNo}</td>
                    <td className="px-4 py-2">订单#{inspection.orderId}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          inspection.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : inspection.status === 'rejected'
                              ? 'bg-red-100 text-red-600'
                              : inspection.status === 'partial'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100'
                        }`}
                      >
                        {getStatusLabel(inspection.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          inspection.qualityStatus === 'passed'
                            ? 'bg-green-100 text-green-600'
                            : inspection.qualityStatus === 'failed'
                              ? 'bg-red-100 text-red-600'
                              : inspection.qualityStatus === 'conditional'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100'
                        }`}
                      >
                        {getStatusLabel(inspection.qualityStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatDate(inspection.inspectionDate)}</td>
                    <td className="px-4 py-2">
                      {inspection.status === 'pending' && (
                        <>
                          <button
                            onClick={() => completeInspection(inspection.id)}
                            className="text-green-600 hover:text-green-800 mr-2"
                          >
                            通过
                          </button>
                          <button
                            onClick={() => rejectInspection(inspection.id, '质量不合格')}
                            className="text-red-600 hover:text-red-800"
                          >
                            拒绝
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">新建入库验收单</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">采购订单 ID</label>
              <input
                type="number"
                value={inspectionForm.orderId ?? 0}
                onChange={(e) => setInspectionForm({ ...inspectionForm, orderId: parseInt(e.target.value) || 0 })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入采购订单 ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">验收日期</label>
              <input
                type="date"
                value={inspectionForm.inspectionDate ?? ''}
                onChange={(e) => setInspectionForm({ ...inspectionForm, inspectionDate: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">备注</label>
              <textarea
                value={inspectionForm.notes ?? ''}
                onChange={(e) => setInspectionForm({ ...inspectionForm, notes: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="请输入备注"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreateInspection} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                创建
              </button>
              <button onClick={() => setSubView('list')} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 渲染供应商比价列表
  const renderComparisons = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">供应商比价单</h2>
        <button
          onClick={() => setSubView('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 新建比价单
        </button>
      </div>

      {subView === 'list' ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">比价单号</th>
                <th className="px-4 py-2 text-left">标题</th>
                <th className="px-4 py-2 text-left">产品</th>
                <th className="px-4 py-2 text-left">数量</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {comparisonsLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : comparisons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                comparisons.map((comparison: SupplierComparison) => (
                  <tr key={comparison.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{comparison.comparisonNo}</td>
                    <td className="px-4 py-2">{comparison.title}</td>
                    <td className="px-4 py-2">{comparison.productName}</td>
                    <td className="px-4 py-2">{comparison.quantity}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          comparison.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : comparison.status === 'archived'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {getStatusLabel(comparison.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatDate(comparison.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">新建供应商比价单</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">标题</label>
              <input
                type="text"
                value={comparisonForm.title}
                onChange={(e) => setComparisonForm({ ...comparisonForm, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入比价单标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">产品名称</label>
              <input
                type="text"
                value={comparisonForm.productName}
                onChange={(e) => setComparisonForm({ ...comparisonForm, productName: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入产品名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">数量</label>
              <input
                type="number"
                value={comparisonForm.quantity}
                onChange={(e) => setComparisonForm({ ...comparisonForm, quantity: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入数量"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreateComparison} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                创建
              </button>
              <button onClick={() => setSubView('list')} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 主渲染
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">采购管理</h1>
      {renderNav()}
      {view === 'dashboard' && renderDashboard()}
      {view === 'requests' && renderRequests()}
      {view === 'orders' && renderOrders()}
      {view === 'contracts' && renderContracts()}
      {view === 'inspections' && renderInspections()}
      {view === 'comparisons' && renderComparisons()}
    </div>
  );
}
