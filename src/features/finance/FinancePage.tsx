// 财务管理模块 UI 组件

import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../../stores/finance';
import type {
  FinanceTransaction,
  FinanceTransactionCreateInput,
  FinanceTransactionUpdateInput,
  FinanceInvoice,
  FinanceInvoiceCreateInput,
  FinanceInvoiceUpdateInput,
} from '../../types/finance';

export function FinancePage() {
  const {
    transactions,
    transactionsLoading,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    categories,
    fetchCategories,
    invoices,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    receivablesPayables,
    fetchReceivablesPayables,
    statistics,
    fetchStatistics,
    operationLoading,
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices' | 'receivables' | 'statistics'>('transactions');
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('income');
  const [selectedItem, setSelectedItem] = useState<FinanceTransaction | FinanceInvoice | null>(null);

  // 收支记录表单
  const [transactionForm, setTransactionForm] = useState<Partial<FinanceTransactionCreateInput & FinanceTransactionUpdateInput>>({
    type: 'income',
    category: '',
    amount: 0,
    currency: 'CNY',
    exchangeRate: 1.0,
    transactionDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank_transfer',
    status: 'pending',
  });

  // 发票表单
  const [invoiceForm, setInvoiceForm] = useState<Partial<FinanceInvoiceCreateInput & FinanceInvoiceUpdateInput>>({
    type: 'vat_special',
    kind: 'output',
    amount: 0,
    taxAmount: 0,
    totalAmount: 0,
    currency: 'CNY',
    invoiceDate: new Date().toISOString().split('T')[0],
    status: 'unissued',
    paymentStatus: 'unpaid',
  });

  // 统计日期范围
  const [statsStartDate, setStatsStartDate] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [statsEndDate, setStatsEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // 初始化加载
  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions({ limit: 50, offset: 0, type: selectedType });
      fetchCategories();
    } else if (activeTab === 'invoices') {
      fetchInvoices({ limit: 50, offset: 0 });
    } else if (activeTab === 'receivables') {
      fetchReceivablesPayables({ limit: 50, offset: 0 });
    } else if (activeTab === 'statistics') {
      fetchStatistics(statsStartDate, statsEndDate);
    }
  }, [activeTab, selectedType, statsStartDate, statsEndDate]);

  // 处理创建收支记录
  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTransaction({
        ...transactionForm,
        transactionNo: `TXN-${Date.now()}`,
      } as FinanceTransactionCreateInput);
      setView('list');
      resetTransactionForm();
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 处理更新收支记录
  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await updateTransaction((selectedItem as FinanceTransaction).id, transactionForm as FinanceTransactionUpdateInput);
      setView('list');
      resetTransactionForm();
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  // 处理删除收支记录
  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('确定要删除此记录吗？')) return;
    try {
      await deleteTransaction(id);
      setView('list');
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 处理创建发票
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInvoice({
        ...invoiceForm,
        invoiceNo: `INV-${Date.now()}`,
      } as FinanceInvoiceCreateInput);
      setView('list');
      resetInvoiceForm();
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 处理更新发票
  const handleUpdateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await updateInvoice((selectedItem as FinanceInvoice).id, invoiceForm as FinanceInvoiceUpdateInput);
      setView('list');
      resetInvoiceForm();
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  // 处理删除发票
  const handleDeleteInvoice = async (id: number) => {
    if (!confirm('确定要删除此发票吗？')) return;
    try {
      await deleteInvoice(id);
      setView('list');
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 重置收支记录表单
  const resetTransactionForm = () => {
    setTransactionForm({
      type: 'income',
      category: '',
      amount: 0,
      currency: 'CNY',
      exchangeRate: 1.0,
      transactionDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'bank_transfer',
      status: 'pending',
    });
  };

  // 重置发票表单
  const resetInvoiceForm = () => {
    setInvoiceForm({
      type: 'vat_special',
      kind: 'output',
      amount: 0,
      taxAmount: 0,
      totalAmount: 0,
      currency: 'CNY',
      invoiceDate: new Date().toISOString().split('T')[0],
      status: 'unissued',
      paymentStatus: 'unpaid',
    });
  };

  // 编辑收支记录
  const handleEditTransaction = (transaction: FinanceTransaction) => {
    setSelectedItem(transaction);
    setTransactionForm({
      category: transaction.category,
      amount: transaction.amount,
      currency: transaction.currency,
      exchangeRate: transaction.exchangeRate,
      transactionDate: transaction.transactionDate,
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
    });
    setView('edit');
  };

  // 编辑发票
  const handleEditInvoice = (invoice: FinanceInvoice) => {
    setSelectedItem(invoice);
    setInvoiceForm({
      type: invoice.type,
      kind: invoice.kind,
      amount: invoice.amount,
      taxAmount: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      invoiceDate: invoice.invoiceDate,
      status: invoice.status,
      paymentStatus: invoice.paymentStatus,
    });
    setView('edit');
  };

  // 渲染收支记录列表
  const renderTransactionsList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('income')}
            className={`px-4 py-2 rounded ${selectedType === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            收入
          </button>
          <button
            onClick={() => setSelectedType('expense')}
            className={`px-4 py-2 rounded ${selectedType === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            支出
          </button>
        </div>
        <button
          onClick={() => { resetTransactionForm(); setView('create'); }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + 新建记录
        </button>
      </div>

      {transactionsLoading ? (
        <div className="text-center py-8">加载中...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">单号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.transactionNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.category}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.transactionDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status === 'completed' ? '已完成' : transaction.status === 'pending' ? '待审核' : '已取消'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onClick={() => handleEditTransaction(transaction)} className="text-blue-600 hover:text-blue-900 mr-2">编辑</button>
                    <button onClick={() => handleDeleteTransaction(transaction.id)} className="text-red-600 hover:text-red-900">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // 渲染收支记录表单
  const renderTransactionForm = () => (
    <form onSubmit={view === 'create' ? handleCreateTransaction : handleUpdateTransaction} className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold">{view === 'create' ? '新建收支记录' : '编辑收支记录'}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">类型</label>
          <select
            value={transactionForm.type}
            onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value as 'income' | 'expense' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">分类</label>
          <select
            value={transactionForm.category}
            onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">选择分类</option>
            {categories.filter(c => c.type === transactionForm.type).map((category) => (
              <option key={category.id} value={category.code}>{category.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">金额</label>
          <input
            type="number"
            step="0.01"
            value={transactionForm.amount}
            onChange={(e) => setTransactionForm({ ...transactionForm, amount: parseFloat(e.target.value) || 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">日期</label>
          <input
            type="date"
            value={transactionForm.transactionDate}
            onChange={(e) => setTransactionForm({ ...transactionForm, transactionDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">支付方式</label>
          <select
            value={transactionForm.paymentMethod || 'bank_transfer'}
            onChange={(e) => setTransactionForm({ ...transactionForm, paymentMethod: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="cash">现金</option>
            <option value="bank_transfer">银行转账</option>
            <option value="alipay">支付宝</option>
            <option value="wechat">微信</option>
            <option value="credit_card">信用卡</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">状态</label>
          <select
            value={transactionForm.status || 'pending'}
            onChange={(e) => setTransactionForm({ ...transactionForm, status: e.target.value as 'pending' | 'completed' | 'cancelled' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pending">待审核</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">备注</label>
          <textarea
            value={transactionForm.description || ''}
            onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={operationLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {operationLoading ? '保存中...' : '保存'}
        </button>
        <button
          type="button"
          onClick={() => setView('list')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          取消
        </button>
      </div>
    </form>
  );

  // 渲染发票列表
  const renderInvoicesList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">发票管理</h2>
        <button
          onClick={() => { resetInvoiceForm(); setView('create'); }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + 新建发票
        </button>
      </div>

      {transactionsLoading ? (
        <div className="text-center py-8">加载中...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发票号码</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">税额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">开票日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.invoiceNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.type === 'vat_special' ? '增值税专用' : invoice.type === 'vat_normal' ? '增值税普通' : invoice.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{invoice.taxAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.invoiceDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      invoice.status === 'issued' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'unissued' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status === 'issued' ? '已开具' : invoice.status === 'unissued' ? '未开具' : invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onClick={() => handleEditInvoice(invoice)} className="text-blue-600 hover:text-blue-900 mr-2">编辑</button>
                    <button onClick={() => handleDeleteInvoice(invoice.id)} className="text-red-600 hover:text-red-900">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // 渲染发票表单
  const renderInvoiceForm = () => (
    <form onSubmit={view === 'create' ? handleCreateInvoice : handleUpdateInvoice} className="space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold">{view === 'create' ? '新建发票' : '编辑发票'}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">发票类型</label>
          <select
            value={invoiceForm.type || 'vat_special'}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, type: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="vat_special">增值税专用发票</option>
            <option value="vat_normal">增值税普通发票</option>
            <option value="electronic">电子发票</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">方向</label>
          <select
            value={invoiceForm.kind || 'output'}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, kind: e.target.value as 'input' | 'output' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="output">销项 (开票)</option>
            <option value="input">进项 (收票)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">金额 (不含税)</label>
          <input
            type="number"
            step="0.01"
            value={invoiceForm.amount}
            onChange={(e) => {
              const amount = parseFloat(e.target.value) || 0;
              const taxAmount = amount * 0.13;
              setInvoiceForm({ ...invoiceForm, amount, taxAmount, totalAmount: amount + taxAmount });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">税额 (13%)</label>
          <input
            type="number"
            step="0.01"
            value={invoiceForm.taxAmount}
            onChange={(e) => {
              const taxAmount = parseFloat(e.target.value) || 0;
              const amount = invoiceForm.amount || 0;
              setInvoiceForm({ ...invoiceForm, taxAmount, totalAmount: amount + taxAmount });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">价税合计</label>
          <input
            type="number"
            step="0.01"
            value={invoiceForm.totalAmount}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">开票日期</label>
          <input
            type="date"
            value={invoiceForm.invoiceDate}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">状态</label>
          <select
            value={invoiceForm.status || 'unissued'}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="unissued">未开具</option>
            <option value="issued">已开具</option>
            <option value="received">已收到</option>
            <option value="reimbursed">已报销</option>
            <option value="cancelled">已作废</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">付款状态</label>
          <select
            value={invoiceForm.paymentStatus || 'unpaid'}
            onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentStatus: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="unpaid">未付款</option>
            <option value="partial">部分付款</option>
            <option value="paid">已付款</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={operationLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {operationLoading ? '保存中...' : '保存'}
        </button>
        <button
          type="button"
          onClick={() => setView('list')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          取消
        </button>
      </div>
    </form>
  );

  // 渲染应收应付
  const renderReceivables = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">应收应付管理</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">总额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">已付</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">未付</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">到期日</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receivablesPayables.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.type === 'receivable' ? '应收' : '应付'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{item.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{item.paidAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">¥{item.unpaidAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.dueDate || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'paid' ? 'bg-green-100 text-green-800' :
                    item.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'paid' ? '已结清' : item.status === 'overdue' ? '已逾期' : item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 渲染统计
  const renderStatistics = () => (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium text-gray-700">统计周期:</label>
        <input
          type="date"
          value={statsStartDate}
          onChange={(e) => setStatsStartDate(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <span>至</span>
        <input
          type="date"
          value={statsEndDate}
          onChange={(e) => setStatsEndDate(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {statistics ? (
        <>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">总收入</h3>
              <p className="text-2xl font-bold text-green-600">¥{statistics.totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">总支出</h3>
              <p className="text-2xl font-bold text-red-600">¥{statistics.totalExpense.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">净利润</h3>
              <p className={`text-2xl font-bold ${statistics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ¥{statistics.netProfit.toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">应收账款</h3>
              <p className="text-2xl font-bold text-blue-600">¥{statistics.totalReceivable.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">分类统计</h3>
            <div className="space-y-2">
              {statistics.byCategory.map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700">{cat.category}</span>
                  <span className={`font-medium ${cat.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    ¥{cat.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">加载中...</div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">财务管理</h1>

      {/* 标签页 */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            收支记录
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'invoices'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            发票管理
          </button>
          <button
            onClick={() => setActiveTab('receivables')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'receivables'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            应收应付
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'statistics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            财务报表
          </button>
        </nav>
      </div>

      {/* 内容区域 */}
      <div>
        {activeTab === 'transactions' && (
          view === 'list' ? renderTransactionsList() : renderTransactionForm()
        )}
        {activeTab === 'invoices' && (
          view === 'list' ? renderInvoicesList() : renderInvoiceForm()
        )}
        {activeTab === 'receivables' && renderReceivables()}
        {activeTab === 'statistics' && renderStatistics()}
      </div>
    </div>
  );
}
