// 财务管理模块 TypeScript 类型定义

// ==================== 收支记录 ====================

export interface FinanceTransaction {
  id: number;
  transactionNo: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  baseAmount: number;
  transactionDate: string;
  relatedOrderId?: number | null;
  relatedOrderType?: string | null;
  customerId?: number | null;
  supplierId?: number | null;
  accountId?: number | null;
  paymentMethod?: string | null;
  referenceNo?: string | null;
  description?: string | null;
  attachmentUrls: string[];
  status: 'pending' | 'completed' | 'cancelled';
  operatorId?: number | null;
  reviewerId?: number | null;
  reviewDate?: string | null;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceTransactionCreateInput {
  transactionNo: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  currency?: string;
  exchangeRate?: number;
  transactionDate: string;
  relatedOrderId?: number | null;
  relatedOrderType?: string | null;
  customerId?: number | null;
  supplierId?: number | null;
  accountId?: number | null;
  paymentMethod?: string | null;
  referenceNo?: string | null;
  description?: string | null;
  attachmentUrls?: string[];
  remarks?: string | null;
  operatorId?: number | null;
}

export interface FinanceTransactionUpdateInput {
  category?: string;
  amount?: number;
  currency?: string;
  exchangeRate?: number;
  transactionDate?: string;
  relatedOrderId?: number | null;
  relatedOrderType?: string | null;
  customerId?: number | null;
  supplierId?: number | null;
  accountId?: number | null;
  paymentMethod?: string | null;
  referenceNo?: string | null;
  description?: string | null;
  attachmentUrls?: string[];
  status?: 'pending' | 'completed' | 'cancelled';
  remarks?: string | null;
  reviewerId?: number | null;
}

export interface FinanceTransactionListParams {
  limit?: number;
  offset?: number;
  type?: 'income' | 'expense';
  category?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  customerId?: number;
  supplierId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface FinanceTransactionListResponse {
  transactions: FinanceTransaction[];
  total: number;
  limit: number;
  offset: number;
}

// ==================== 会计科目 ====================

export interface FinanceAccount {
  id: number;
  code: string;
  name: string;
  parentId?: number | null;
  level: number;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  balanceDirection: 'debit' | 'credit';
  isCashEquivalent: boolean;
  isBankAccount: boolean;
  bankName?: string | null;
  bankAccountNo?: string | null;
  currency: string;
  status: 'active' | 'inactive';
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceAccountCreateInput {
  code: string;
  name: string;
  parentId?: number | null;
  level?: number;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  balanceDirection: 'debit' | 'credit';
  isCashEquivalent?: boolean;
  isBankAccount?: boolean;
  bankName?: string | null;
  bankAccountNo?: string | null;
  currency?: string;
  description?: string | null;
}

export interface FinanceAccountUpdateInput {
  name?: string;
  parentId?: number | null;
  type?: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  balanceDirection?: 'debit' | 'credit';
  isCashEquivalent?: boolean;
  isBankAccount?: boolean;
  bankName?: string | null;
  bankAccountNo?: string | null;
  currency?: string;
  status?: 'active' | 'inactive';
  description?: string | null;
}

// ==================== 收支分类 ====================

export interface FinanceCategory {
  id: number;
  code: string;
  name: string;
  parentId?: number | null;
  type: 'income' | 'expense';
  level: number;
  description?: string | null;
  isDefault: boolean;
  sortOrder: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface FinanceCategoryCreateInput {
  code: string;
  name: string;
  parentId?: number | null;
  type: 'income' | 'expense';
  level?: number;
  description?: string | null;
  isDefault?: boolean;
  sortOrder?: number;
}

export interface FinanceCategoryUpdateInput {
  name?: string;
  parentId?: number | null;
  type?: 'income' | 'expense';
  description?: string | null;
  isDefault?: boolean;
  sortOrder?: number;
  status?: 'active' | 'inactive';
}

// ==================== 发票管理 ====================

export interface FinanceInvoice {
  id: number;
  invoiceNo: string;
  invoiceCode?: string | null;
  type: 'vat_special' | 'vat_normal' | 'electronic' | 'other';
  kind: 'input' | 'output';
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  invoiceDate: string;
  checkCode?: string | null;
  machineNo?: string | null;
  sellerName?: string | null;
  sellerTaxId?: string | null;
  sellerAddressPhone?: string | null;
  sellerBankAccount?: string | null;
  buyerName?: string | null;
  buyerTaxId?: string | null;
  buyerAddressPhone?: string | null;
  buyerBankAccount?: string | null;
  relatedOrderId?: number | null;
  relatedOrderType?: string | null;
  customerId?: number | null;
  supplierId?: number | null;
  status: 'unissued' | 'issued' | 'received' | 'reimbursed' | 'cancelled' | 'red';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  issueDate?: string | null;
  receiveDate?: string | null;
  reimbursementDate?: string | null;
  operatorId?: number | null;
  remarks?: string | null;
  attachmentUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FinanceInvoiceCreateInput {
  invoiceNo: string;
  invoiceCode?: string | null;
  type: 'vat_special' | 'vat_normal' | 'electronic' | 'other';
  kind: 'input' | 'output';
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency?: string;
  invoiceDate: string;
  checkCode?: string | null;
  machineNo?: string | null;
  sellerName?: string | null;
  sellerTaxId?: string | null;
  sellerAddressPhone?: string | null;
  sellerBankAccount?: string | null;
  buyerName?: string | null;
  buyerTaxId?: string | null;
  buyerAddressPhone?: string | null;
  buyerBankAccount?: string | null;
  relatedOrderId?: number | null;
  relatedOrderType?: string | null;
  customerId?: number | null;
  supplierId?: number | null;
  remarks?: string | null;
  attachmentUrls?: string[];
  operatorId?: number | null;
}

export interface FinanceInvoiceUpdateInput {
  invoiceCode?: string | null;
  type?: 'vat_special' | 'vat_normal' | 'electronic' | 'other';
  kind?: 'input' | 'output';
  amount?: number;
  taxAmount?: number;
  totalAmount?: number;
  currency?: string;
  invoiceDate?: string;
  checkCode?: string | null;
  machineNo?: string | null;
  sellerName?: string | null;
  sellerTaxId?: string | null;
  sellerAddressPhone?: string | null;
  sellerBankAccount?: string | null;
  buyerName?: string | null;
  buyerTaxId?: string | null;
  buyerAddressPhone?: string | null;
  buyerBankAccount?: string | null;
  status?: 'unissued' | 'issued' | 'received' | 'reimbursed' | 'cancelled' | 'red';
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  remarks?: string | null;
  attachmentUrls?: string[];
}

export interface FinanceInvoiceListParams {
  limit?: number;
  offset?: number;
  type?: 'vat_special' | 'vat_normal' | 'electronic' | 'other';
  kind?: 'input' | 'output';
  status?: 'unissued' | 'issued' | 'received' | 'reimbursed' | 'cancelled' | 'red';
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  customerId?: number;
  supplierId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface FinanceInvoiceListResponse {
  invoices: FinanceInvoice[];
  total: number;
  limit: number;
  offset: number;
}

// ==================== 发票明细 ====================

export interface FinanceInvoiceItem {
  id: number;
  invoiceId: number;
  productName: string;
  specification?: string | null;
  unit?: string | null;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  sortOrder: number;
  createdAt: string;
}

export interface FinanceInvoiceItemCreateInput {
  invoiceId: number;
  productName: string;
  specification?: string | null;
  unit?: string | null;
  quantity?: number;
  unitPrice?: number;
  amount: number;
  taxRate?: number;
  taxAmount: number;
  sortOrder?: number;
}

// ==================== 应收应付 ====================

export interface FinanceReceivablePayable {
  id: number;
  type: 'receivable' | 'payable';
  relatedOrderId: number;
  relatedOrderType: string;
  customerId?: number | null;
  supplierId?: number | null;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  dueDate?: string | null;
  overdueDays: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  lastPaymentDate?: string | null;
  operatorId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceReceivablePayableListParams {
  limit?: number;
  offset?: number;
  type?: 'receivable' | 'payable';
  status?: 'unpaid' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  customerId?: number;
  supplierId?: number;
  overdue?: boolean;
}

// ==================== 财务报表配置 ====================

export interface FinanceReportConfig {
  id: number;
  reportType: string;
  name: string;
  config: Record<string, unknown>;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== 财务统计 ====================

export interface FinanceStatistics {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  totalReceivable: number;
  totalPayable: number;
  byCategory: CategoryStatistics[];
}

export interface CategoryStatistics {
  category: string;
  amount: number;
  type: 'income' | 'expense';
}
