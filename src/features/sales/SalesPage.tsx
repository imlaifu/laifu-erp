// Sales Management Module UI Component
// 销售管理模块 UI 组件

import { useState, useEffect } from 'react';
import { useSalesStore } from '../../stores/sales';
import type {
  SalesOpportunity,
  SalesOpportunityCreateInput,
  SalesQuotation,
  SalesQuotationCreateInput,
  SalesContract,
  SalesContractCreateInput,
  SalesForecast,
  SalesForecastCreateInput,
  SalesCommission,
  SalesCommissionCreateInput,
  SalesActivity,
  SalesActivityCreateInput,
} from '../../types/sales';

type SalesView =
  | 'dashboard'
  | 'opportunities'
  | 'followups'
  | 'quotations'
  | 'contracts'
  | 'forecasts'
  | 'commissions'
  | 'performances'
  | 'activities';
type SubView = 'list' | 'create' | 'detail';

export function SalesPage() {
  const {
    // 销售机会
    opportunities,
    opportunityListLoading,
    fetchOpportunities,
    createOpportunity,
    updateOpportunityStage,

    // 报价单
    quotations,
    quotationListLoading,
    fetchQuotations,
    createQuotation,
    updateQuotationStatus,

    // 销售合同
    contracts,
    contractListLoading,
    fetchContracts,
    createContract,

    // 销售预测
    forecasts,
    forecastListLoading,
    fetchForecasts,
    createForecast,

    // 销售佣金
    commissions,
    commissionListLoading,
    fetchCommissions,
    createCommission,
    approveCommission,
    payCommission,

    // 销售业绩
    performances,
    performanceListLoading,
    fetchPerformances,

    // 销售活动
    activities,
    activityListLoading,
    fetchActivities,
    createActivity,
    completeActivity,
  } = useSalesStore();

  const [view, setView] = useState<SalesView>('dashboard');
  const [subView, setSubView] = useState<SubView>('list');

  // 表单状态
  const [opportunityForm, setOpportunityForm] = useState<Partial<SalesOpportunityCreateInput>>({
    name: '',
    customerId: null,
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    source: 'website',
    stage: 'lead',
    priority: 'medium',
    estimatedAmount: 0,
    winProbability: 50,
    description: '',
    nextFollowUp: '',
  });

  const [quotationForm, setQuotationForm] = useState<Partial<SalesQuotationCreateInput>>({
    customerId: 0,
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    validUntil: '',
    status: 'draft',
    discountRate: 0,
    taxRate: 0,
    notes: '',
    termsConditions: '',
    items: [],
  });

  const [contractForm, setContractForm] = useState<Partial<SalesContractCreateInput>>({
    contractName: '',
    customerId: 0,
    contractType: 'sales',
    startDate: '',
    endDate: '',
    autoRenew: false,
    currency: 'CNY',
    paymentTerms: '',
    deliveryTerms: '',
    notes: '',
    attachmentUrls: [],
    items: [],
  });

  const [forecastForm, setForecastForm] = useState<Partial<SalesForecastCreateInput>>({
    periodType: 'monthly',
    periodStart: '',
    periodEnd: '',
    forecastQuantity: 0,
    forecastAmount: 0,
    method: 'manual',
    confidenceLevel: 80,
    notes: '',
  });

  const [commissionForm, setCommissionForm] = useState<Partial<SalesCommissionCreateInput>>({
    salesPersonId: 0,
    commissionType: 'percentage',
    commissionRate: 0,
    baseAmount: 0,
    notes: '',
  });

  const [activityForm, setActivityForm] = useState<Partial<SalesActivityCreateInput>>({
    activityType: 'call',
    subject: '',
    description: '',
    relatedType: 'opportunity',
    relatedId: null,
    scheduledTime: '',
    location: '',
  });

  // 初始化数据
  useEffect(() => {
    if (view === 'opportunities') {
      fetchOpportunities({ limit: 50, offset: 0 });
    } else if (view === 'quotations') {
      fetchQuotations({ limit: 50, offset: 0 });
    } else if (view === 'contracts') {
      fetchContracts({ limit: 50, offset: 0 });
    } else if (view === 'forecasts') {
      fetchForecasts({ limit: 50, offset: 0 });
    } else if (view === 'commissions') {
      fetchCommissions({ limit: 50, offset: 0 });
    } else if (view === 'performances') {
      fetchPerformances({ limit: 50, offset: 0 });
    } else if (view === 'activities') {
      fetchActivities({ limit: 50, offset: 0 });
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
      sent: '已发送',
      viewed: '已查看',
      accepted: '已接受',
      rejected: '已拒绝',
      expired: '已过期',
      converted: '已转换',
      pending_approval: '待审批',
      approved: '已批准',
      active: '生效中',
      completed: '已完成',
      terminated: '已终止',
      pending: '待处理',
      paid: '已付款',
      cancelled: '已取消',
      scheduled: '已安排',
      rescheduled: '已重新安排',
      lead: '潜在客户',
      qualified: '已确认',
      proposal: '方案中',
      negotiation: '谈判中',
      closed_won: '已赢单',
      closed_lost: '已输单',
      inactive: '非活跃',
      archived: '已归档',
    };
    return labels[status] || status;
  };

  // 获取优先级标签
  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: '低',
      medium: '中',
      high: '高',
      urgent: '紧急',
    };
    return labels[priority] || priority;
  };

  // 处理创建销售机会
  const handleCreateOpportunity = async () => {
    try {
      await createOpportunity(opportunityForm as SalesOpportunityCreateInput);
      setSubView('list');
      setOpportunityForm({
        name: '',
        customerId: null,
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        source: 'website',
        stage: 'lead',
        priority: 'medium',
        estimatedAmount: 0,
        winProbability: 50,
        description: '',
        nextFollowUp: '',
      });
    } catch (error) {
      console.error('创建销售机会失败:', error);
    }
  };

  // 处理创建报价单
  const handleCreateQuotation = async () => {
    try {
      await createQuotation(quotationForm as SalesQuotationCreateInput);
      setSubView('list');
      setQuotationForm({
        customerId: 0,
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        validUntil: '',
        status: 'draft',
        discountRate: 0,
        taxRate: 0,
        notes: '',
        termsConditions: '',
        items: [],
      });
    } catch (error) {
      console.error('创建报价单失败:', error);
    }
  };

  // 处理创建销售合同
  const handleCreateContract = async () => {
    try {
      await createContract(contractForm as SalesContractCreateInput);
      setSubView('list');
      setContractForm({
        contractName: '',
        customerId: 0,
        contractType: 'sales',
        startDate: '',
        endDate: '',
        autoRenew: false,
        currency: 'CNY',
        paymentTerms: '',
        deliveryTerms: '',
        notes: '',
        attachmentUrls: [],
        items: [],
      });
    } catch (error) {
      console.error('创建销售合同失败:', error);
    }
  };

  // 处理创建销售预测
  const handleCreateForecast = async () => {
    try {
      await createForecast(forecastForm as SalesForecastCreateInput);
      setSubView('list');
      setForecastForm({
        periodType: 'monthly',
        periodStart: '',
        periodEnd: '',
        forecastQuantity: 0,
        forecastAmount: 0,
        method: 'manual',
        confidenceLevel: 80,
        notes: '',
      });
    } catch (error) {
      console.error('创建销售预测失败:', error);
    }
  };

  // 处理创建销售佣金
  const handleCreateCommission = async () => {
    try {
      await createCommission(commissionForm as SalesCommissionCreateInput);
      setSubView('list');
      setCommissionForm({
        salesPersonId: 0,
        commissionType: 'percentage',
        commissionRate: 0,
        baseAmount: 0,
        notes: '',
      });
    } catch (error) {
      console.error('创建销售佣金失败:', error);
    }
  };

  // 处理创建销售活动
  const handleCreateActivity = async () => {
    try {
      await createActivity(activityForm as SalesActivityCreateInput);
      setSubView('list');
      setActivityForm({
        activityType: 'call',
        subject: '',
        description: '',
        relatedType: 'opportunity',
        relatedId: null,
        scheduledTime: '',
        location: '',
      });
    } catch (error) {
      console.error('创建销售活动失败:', error);
    }
  };

  // 处理更新销售机会阶段
  const handleUpdateStage = async (id: number, stage: string) => {
    try {
      await updateOpportunityStage(id, stage);
    } catch (error) {
      console.error('更新销售机会阶段失败:', error);
    }
  };

  // 处理审批佣金
  const handleApproveCommission = async (id: number) => {
    try {
      await approveCommission(id, 1); // TODO: 使用实际用户 ID
    } catch (error) {
      console.error('审批佣金失败:', error);
    }
  };

  // 处理支付佣金
  const handlePayCommission = async (id: number) => {
    try {
      await payCommission(id);
    } catch (error) {
      console.error('支付佣金失败:', error);
    }
  };

  // 处理完成销售活动
  const handleCompleteActivity = async (id: number) => {
    try {
      await completeActivity(id, '已完成', new Date().toISOString(), 30);
    } catch (error) {
      console.error('完成销售活动失败:', error);
    }
  };

  // 渲染导航
  const renderNav = () => (
    <div className="flex gap-2 mb-6 border-b pb-2 flex-wrap">
      <button
        onClick={() => setView('dashboard')}
        className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        概览
      </button>
      <button
        onClick={() => setView('opportunities')}
        className={`px-4 py-2 rounded ${view === 'opportunities' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        销售机会
      </button>
      <button
        onClick={() => setView('quotations')}
        className={`px-4 py-2 rounded ${view === 'quotations' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        报价单
      </button>
      <button
        onClick={() => setView('contracts')}
        className={`px-4 py-2 rounded ${view === 'contracts' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        销售合同
      </button>
      <button
        onClick={() => setView('forecasts')}
        className={`px-4 py-2 rounded ${view === 'forecasts' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        销售预测
      </button>
      <button
        onClick={() => setView('commissions')}
        className={`px-4 py-2 rounded ${view === 'commissions' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        销售佣金
      </button>
      <button
        onClick={() => setView('performances')}
        className={`px-4 py-2 rounded ${view === 'performances' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        销售业绩
      </button>
      <button
        onClick={() => setView('activities')}
        className={`px-4 py-2 rounded ${view === 'activities' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
      >
        销售活动
      </button>
    </div>
  );

  // 渲染概览
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">销售机会总数</h3>
        <p className="text-2xl font-bold">{opportunities.length}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">谈判中机会</h3>
        <p className="text-2xl font-bold text-yellow-500">
          {opportunities.filter((o) => o.stage === 'negotiation').length}
        </p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">报价单总数</h3>
        <p className="text-2xl font-bold">{quotations.length}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">已赢单</h3>
        <p className="text-2xl font-bold text-green-500">
          {opportunities.filter((o) => o.stage === 'closed_won').length}
        </p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">销售合同总数</h3>
        <p className="text-2xl font-bold">{contracts.length}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">生效中合同</h3>
        <p className="text-2xl font-bold text-blue-500">
          {contracts.filter((c) => c.status === 'active').length}
        </p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">待处理佣金</h3>
        <p className="text-2xl font-bold text-orange-500">
          {commissions.filter((c) => c.status === 'pending').length}
        </p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">今日销售活动</h3>
        <p className="text-2xl font-bold">
          {activities.filter((a) => new Date(a.scheduledTime || '').toDateString() === new Date().toDateString()).length}
        </p>
      </div>
    </div>
  );

  // 渲染销售机会列表
  const renderOpportunities = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">销售机会</h2>
        <button
          onClick={() => setSubView('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 新建机会
        </button>
      </div>

      {subView === 'list' ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">机会名称</th>
                <th className="px-4 py-2 text-left">客户</th>
                <th className="px-4 py-2 text-left">阶段</th>
                <th className="px-4 py-2 text-left">优先级</th>
                <th className="px-4 py-2 text-left">预计金额</th>
                <th className="px-4 py-2 text-left">赢单概率</th>
                <th className="px-4 py-2 text-left">预计成交日期</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {opportunityListLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : opportunities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                opportunities.map((opportunity: SalesOpportunity) => (
                  <tr key={opportunity.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{opportunity.name}</td>
                    <td className="px-4 py-2">{opportunity.customerName || '-'}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          opportunity.stage === 'closed_won'
                            ? 'bg-green-100 text-green-600'
                            : opportunity.stage === 'closed_lost'
                              ? 'bg-red-100 text-red-600'
                            : opportunity.stage === 'negotiation'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {getStatusLabel(opportunity.stage)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          opportunity.priority === 'urgent'
                            ? 'bg-red-100 text-red-600'
                            : opportunity.priority === 'high'
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-gray-100'
                        }`}
                      >
                        {getPriorityLabel(opportunity.priority)}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatCurrency(opportunity.estimatedAmount)}</td>
                    <td className="px-4 py-2">{opportunity.winProbability}%</td>
                    <td className="px-4 py-2">{formatDate(opportunity.expectedCloseDate || '')}</td>
                    <td className="px-4 py-2">
                      {opportunity.stage !== 'closed_won' && opportunity.stage !== 'closed_lost' && (
                        <>
                          <button
                            onClick={() => handleUpdateStage(opportunity.id, 'negotiation')}
                            className="text-blue-600 hover:text-blue-800 mr-2"
                          >
                            推进
                          </button>
                          <button
                            onClick={() => handleUpdateStage(opportunity.id, 'closed_won')}
                            className="text-green-600 hover:text-green-800 mr-2"
                          >
                            赢单
                          </button>
                          <button
                            onClick={() => handleUpdateStage(opportunity.id, 'closed_lost')}
                            className="text-red-600 hover:text-red-800"
                          >
                            输单
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
          <h3 className="text-lg font-bold mb-4">新建销售机会</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">机会名称</label>
              <input
                type="text"
                value={opportunityForm.name}
                onChange={(e) => setOpportunityForm({ ...opportunityForm, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入机会名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">联系人</label>
              <input
                type="text"
                value={opportunityForm.contactPerson || ''}
                onChange={(e) => setOpportunityForm({ ...opportunityForm, contactPerson: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入联系人"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">联系电话</label>
              <input
                type="text"
                value={opportunityForm.contactPhone || ''}
                onChange={(e) => setOpportunityForm({ ...opportunityForm, contactPhone: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入联系电话"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">联系邮箱</label>
              <input
                type="email"
                value={opportunityForm.contactEmail || ''}
                onChange={(e) => setOpportunityForm({ ...opportunityForm, contactEmail: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入联系邮箱"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">来源</label>
                <select
                  value={opportunityForm.source}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, source: e.target.value as any })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="referral">推荐</option>
                  <option value="website">网站</option>
                  <option value="cold_call">陌生拜访</option>
                  <option value="social_media">社交媒体</option>
                  <option value="exhibition">展会</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">优先级</label>
                <select
                  value={opportunityForm.priority}
                  onChange={(e) => setOpportunityForm({ ...opportunityForm, priority: e.target.value as any })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                  <option value="urgent">紧急</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">预计金额</label>
              <input
                type="number"
                value={opportunityForm.estimatedAmount}
                onChange={(e) => setOpportunityForm({ ...opportunityForm, estimatedAmount: parseFloat(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入预计金额"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">赢单概率 (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={opportunityForm.winProbability}
                onChange={(e) => setOpportunityForm({ ...opportunityForm, winProbability: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入赢单概率"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">预计成交日期</label>
              <input
                type="date"
                value={opportunityForm.expectedCloseDate || ''}
                onChange={(e) => setOpportunityForm({ ...opportunityForm, expectedCloseDate: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">描述</label>
              <textarea
                value={opportunityForm.description || ''}
                onChange={(e) => setOpportunityForm({ ...opportunityForm, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="请输入机会描述"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreateOpportunity} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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

  // 渲染报价单列表
  const renderQuotations = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">报价单</h2>
        <button
          onClick={() => setSubView('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 新建报价
        </button>
      </div>

      {subView === 'list' ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">报价单号</th>
                <th className="px-4 py-2 text-left">客户</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">总金额</th>
                <th className="px-4 py-2 text-left">有效期至</th>
                <th className="px-4 py-2 text-left">创建时间</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {quotationListLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : quotations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                quotations.map((quotation: SalesQuotation) => (
                  <tr key={quotation.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{quotation.quotationNumber}</td>
                    <td className="px-4 py-2">{quotation.customerName || '-'}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          quotation.status === 'accepted'
                            ? 'bg-green-100 text-green-600'
                            : quotation.status === 'rejected' || quotation.status === 'expired'
                              ? 'bg-red-100 text-red-600'
                              : quotation.status === 'sent' || quotation.status === 'viewed'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100'
                        }`}
                      >
                        {getStatusLabel(quotation.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatCurrency(quotation.totalAmount)}</td>
                    <td className="px-4 py-2">{formatDate(quotation.validUntil || '')}</td>
                    <td className="px-4 py-2">{formatDate(quotation.createdAt)}</td>
                    <td className="px-4 py-2">
                      {quotation.status === 'draft' && (
                        <button
                          onClick={() => updateQuotationStatus(quotation.id, 'sent')}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          发送
                        </button>
                      )}
                      {quotation.status === 'sent' && (
                        <>
                          <button
                            onClick={() => updateQuotationStatus(quotation.id, 'accepted')}
                            className="text-green-600 hover:text-green-800 mr-2"
                          >
                            接受
                          </button>
                          <button
                            onClick={() => updateQuotationStatus(quotation.id, 'rejected')}
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
          <h3 className="text-lg font-bold mb-4">新建报价单</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">客户 ID</label>
              <input
                type="number"
                value={quotationForm.customerId}
                onChange={(e) => setQuotationForm({ ...quotationForm, customerId: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入客户 ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">联系人</label>
              <input
                type="text"
                value={quotationForm.contactPerson || ''}
                onChange={(e) => setQuotationForm({ ...quotationForm, contactPerson: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入联系人"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">有效期至</label>
              <input
                type="date"
                value={quotationForm.validUntil || ''}
                onChange={(e) => setQuotationForm({ ...quotationForm, validUntil: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">备注</label>
              <textarea
                value={quotationForm.notes || ''}
                onChange={(e) => setQuotationForm({ ...quotationForm, notes: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="请输入备注"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreateQuotation} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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

  // 渲染销售合同列表
  const renderContracts = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">销售合同</h2>
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
                <th className="px-4 py-2 text-left">客户</th>
                <th className="px-4 py-2 text-left">类型</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">总金额</th>
                <th className="px-4 py-2 text-left">有效期</th>
              </tr>
            </thead>
            <tbody>
              {contractListLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                contracts.map((contract: SalesContract) => (
                  <tr key={contract.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{contract.contractNumber}</td>
                    <td className="px-4 py-2">{contract.contractName}</td>
                    <td className="px-4 py-2">{contract.customerName || '-'}</td>
                    <td className="px-4 py-2">{contract.contractType}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          contract.status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : contract.status === 'completed' || contract.status === 'expired' || contract.status === 'terminated'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-600'
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
          <h3 className="text-lg font-bold mb-4">新建销售合同</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">合同名称</label>
              <input
                type="text"
                value={contractForm.contractName}
                onChange={(e) => setContractForm({ ...contractForm, contractName: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入合同名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">客户 ID</label>
              <input
                type="number"
                value={contractForm.customerId}
                onChange={(e) => setContractForm({ ...contractForm, customerId: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入客户 ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">合同类型</label>
              <select
                value={contractForm.contractType}
                onChange={(e) => setContractForm({ ...contractForm, contractType: e.target.value as any })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="sales">销售合同</option>
                <option value="framework">框架协议</option>
                <option value="distribution">分销协议</option>
                <option value="agency">代理协议</option>
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
              <label className="block text-sm font-medium mb-1">付款条款</label>
              <input
                type="text"
                value={contractForm.paymentTerms || ''}
                onChange={(e) => setContractForm({ ...contractForm, paymentTerms: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="例如：30 天账期"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">备注</label>
              <textarea
                value={contractForm.notes || ''}
                onChange={(e) => setContractForm({ ...contractForm, notes: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="请输入备注"
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

  // 渲染销售预测列表
  const renderForecasts = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">销售预测</h2>
        <button
          onClick={() => setSubView('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 新建预测
        </button>
      </div>

      {subView === 'list' ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">周期类型</th>
                <th className="px-4 py-2 text-left">产品</th>
                <th className="px-4 py-2 text-left">预测数量</th>
                <th className="px-4 py-2 text-left">预测金额</th>
                <th className="px-4 py-2 text-left">实际数量</th>
                <th className="px-4 py-2 text-left">实际金额</th>
                <th className="px-4 py-2 text-left">准确率</th>
                <th className="px-4 py-2 text-left">周期</th>
              </tr>
            </thead>
            <tbody>
              {forecastListLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : forecasts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                forecasts.map((forecast: SalesForecast) => (
                  <tr key={forecast.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{forecast.periodType}</td>
                    <td className="px-4 py-2">{forecast.productName || '-'}</td>
                    <td className="px-4 py-2">{forecast.forecastQuantity}</td>
                    <td className="px-4 py-2">{formatCurrency(forecast.forecastAmount)}</td>
                    <td className="px-4 py-2">{forecast.actualQuantity}</td>
                    <td className="px-4 py-2">{formatCurrency(forecast.actualAmount)}</td>
                    <td className="px-4 py-2">{forecast.accuracyRate}%</td>
                    <td className="px-4 py-2">
                      {formatDate(forecast.periodStart)} ~ {formatDate(forecast.periodEnd)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">新建销售预测</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">周期类型</label>
              <select
                value={forecastForm.periodType}
                onChange={(e) => setForecastForm({ ...forecastForm, periodType: e.target.value as any })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="weekly">周</option>
                <option value="monthly">月</option>
                <option value="quarterly">季度</option>
                <option value="yearly">年</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">周期开始</label>
                <input
                  type="date"
                  value={forecastForm.periodStart || ''}
                  onChange={(e) => setForecastForm({ ...forecastForm, periodStart: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">周期结束</label>
                <input
                  type="date"
                  value={forecastForm.periodEnd || ''}
                  onChange={(e) => setForecastForm({ ...forecastForm, periodEnd: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">预测数量</label>
              <input
                type="number"
                value={forecastForm.forecastQuantity}
                onChange={(e) => setForecastForm({ ...forecastForm, forecastQuantity: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入预测数量"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">预测金额</label>
              <input
                type="number"
                value={forecastForm.forecastAmount}
                onChange={(e) => setForecastForm({ ...forecastForm, forecastAmount: parseFloat(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入预测金额"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreateForecast} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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

  // 渲染销售佣金列表
  const renderCommissions = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">销售佣金</h2>
        <button
          onClick={() => setSubView('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 新建佣金
        </button>
      </div>

      {subView === 'list' ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">销售人员</th>
                <th className="px-4 py-2 text-left">佣金类型</th>
                <th className="px-4 py-2 text-left">佣金比例</th>
                <th className="px-4 py-2 text-left">基数金额</th>
                <th className="px-4 py-2 text-left">佣金金额</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {commissionListLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : commissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                commissions.map((commission: SalesCommission) => (
                  <tr key={commission.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{commission.salesPersonName || '-'}</td>
                    <td className="px-4 py-2">{commission.commissionType}</td>
                    <td className="px-4 py-2">{commission.commissionRate}%</td>
                    <td className="px-4 py-2">{formatCurrency(commission.baseAmount)}</td>
                    <td className="px-4 py-2">{formatCurrency(commission.commissionAmount)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          commission.status === 'paid'
                            ? 'bg-green-100 text-green-600'
                            : commission.status === 'approved'
                              ? 'bg-blue-100 text-blue-600'
                              : commission.status === 'cancelled'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {getStatusLabel(commission.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {commission.status === 'pending' && (
                        <button
                          onClick={() => handleApproveCommission(commission.id)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          审批
                        </button>
                      )}
                      {commission.status === 'approved' && (
                        <button
                          onClick={() => handlePayCommission(commission.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          支付
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
          <h3 className="text-lg font-bold mb-4">新建销售佣金</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">销售人员 ID</label>
              <input
                type="number"
                value={commissionForm.salesPersonId}
                onChange={(e) => setCommissionForm({ ...commissionForm, salesPersonId: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入销售人员 ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">佣金类型</label>
              <select
                value={commissionForm.commissionType}
                onChange={(e) => setCommissionForm({ ...commissionForm, commissionType: e.target.value as any })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="percentage">百分比</option>
                <option value="fixed">固定金额</option>
                <option value="tiered">阶梯式</option>
                <option value="bonus">奖金</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">佣金比例 (%)</label>
              <input
                type="number"
                value={commissionForm.commissionRate}
                onChange={(e) => setCommissionForm({ ...commissionForm, commissionRate: parseFloat(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入佣金比例"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">基数金额</label>
              <input
                type="number"
                value={commissionForm.baseAmount}
                onChange={(e) => setCommissionForm({ ...commissionForm, baseAmount: parseFloat(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入基数金额"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreateCommission} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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

  // 渲染销售业绩列表
  const renderPerformances = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">销售业绩</h2>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">销售人员</th>
              <th className="px-4 py-2 text-left">周期类型</th>
              <th className="px-4 py-2 text-left">目标金额</th>
              <th className="px-4 py-2 text-left">实际金额</th>
              <th className="px-4 py-2 text-left">达成率</th>
              <th className="px-4 py-2 text-left">赢单数</th>
              <th className="px-4 py-2 text-left">排名</th>
              <th className="px-4 py-2 text-left">周期</th>
            </tr>
          </thead>
          <tbody>
            {performanceListLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center">
                  加载中...
                </td>
              </tr>
            ) : performances.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  暂无数据
                </td>
              </tr>
            ) : (
              performances.map((perf) => (
                <tr key={perf.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{perf.salesPersonName || '-'}</td>
                  <td className="px-4 py-2">{perf.periodType}</td>
                  <td className="px-4 py-2">{formatCurrency(perf.targetAmount)}</td>
                  <td className="px-4 py-2">{formatCurrency(perf.actualAmount)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        perf.achievementRate >= 100
                          ? 'bg-green-100 text-green-600'
                          : perf.achievementRate >= 80
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {perf.achievementRate}%
                    </span>
                  </td>
                  <td className="px-4 py-2">{perf.wonOpportunitiesCount}</td>
                  <td className="px-4 py-2">#{perf.ranking}</td>
                  <td className="px-4 py-2">
                    {formatDate(perf.periodStart)} ~ {formatDate(perf.periodEnd)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 渲染销售活动列表
  const renderActivities = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">销售活动</h2>
        <button
          onClick={() => setSubView('create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + 新建活动
        </button>
      </div>

      {subView === 'list' ? (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">活动类型</th>
                <th className="px-4 py-2 text-left">主题</th>
                <th className="px-4 py-2 text-left">关联对象</th>
                <th className="px-4 py-2 text-left">计划时间</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {activityListLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    加载中...
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                activities.map((activity: SalesActivity) => (
                  <tr key={activity.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{activity.activityType}</td>
                    <td className="px-4 py-2">{activity.subject}</td>
                    <td className="px-4 py-2">
                      {activity.relatedType}#{activity.relatedId || '-'}
                    </td>
                    <td className="px-4 py-2">{formatDate(activity.scheduledTime || '')}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          activity.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : activity.status === 'cancelled'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {getStatusLabel(activity.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {activity.status === 'scheduled' && (
                        <button
                          onClick={() => handleCompleteActivity(activity.id)}
                          className="text-green-600 hover:text-green-800"
                        >
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
          <h3 className="text-lg font-bold mb-4">新建销售活动</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">活动类型</label>
              <select
                value={activityForm.activityType}
                onChange={(e) => setActivityForm({ ...activityForm, activityType: e.target.value as any })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="call">电话</option>
                <option value="email">邮件</option>
                <option value="meeting">会议</option>
                <option value="demo">演示</option>
                <option value="proposal">方案</option>
                <option value="contract">合同</option>
                <option value="followup">跟进</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">主题</label>
              <input
                type="text"
                value={activityForm.subject}
                onChange={(e) => setActivityForm({ ...activityForm, subject: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入活动主题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">关联类型</label>
              <select
                value={activityForm.relatedType}
                onChange={(e) => setActivityForm({ ...activityForm, relatedType: e.target.value as any })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="opportunity">销售机会</option>
                <option value="quotation">报价单</option>
                <option value="contract">合同</option>
                <option value="customer">客户</option>
                <option value="order">订单</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">计划时间</label>
              <input
                type="datetime-local"
                value={activityForm.scheduledTime || ''}
                onChange={(e) => setActivityForm({ ...activityForm, scheduledTime: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">地点</label>
              <input
                type="text"
                value={activityForm.location || ''}
                onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="请输入地点"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreateActivity} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
      <h1 className="text-2xl font-bold mb-6">销售管理</h1>
      {renderNav()}
      {view === 'dashboard' && renderDashboard()}
      {view === 'opportunities' && renderOpportunities()}
      {view === 'quotations' && renderQuotations()}
      {view === 'contracts' && renderContracts()}
      {view === 'forecasts' && renderForecasts()}
      {view === 'commissions' && renderCommissions()}
      {view === 'performances' && renderPerformances()}
      {view === 'activities' && renderActivities()}
    </div>
  );
}
