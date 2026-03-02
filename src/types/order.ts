// 订单管理模块 TypeScript 类型定义

// ==================== 客户类型 ====================

export interface Customer {
  id: number;
  name: string;
  code: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postalCode?: string | null;
  taxId?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  creditLimit: number;
  balance: number;
  level: 'vip' | 'normal' | 'wholesale';
  status: 'active' | 'inactive' | 'blacklisted';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerCreateInput {
  name: string;
  code: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string;
  postalCode?: string | null;
  taxId?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  creditLimit?: number;
  level?: 'vip' | 'normal' | 'wholesale';
  notes?: string | null;
}

export interface CustomerUpdateInput {
  name?: string;
  code?: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string;
  postalCode?: string | null;
  taxId?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  creditLimit?: number;
  balance?: number;
  level?: 'vip' | 'normal' | 'wholesale';
  status?: 'active' | 'inactive' | 'blacklisted';
  notes?: string | null;
}

// ==================== 供应商类型 ====================

export interface Supplier {
  id: number;
  name: string;
  code: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postalCode?: string | null;
  taxId?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  rating: number;
  status: 'active' | 'inactive' | 'blacklisted';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCreateInput {
  name: string;
  code: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string;
  postalCode?: string | null;
  taxId?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  rating?: number;
  notes?: string | null;
}

export interface SupplierUpdateInput {
  name?: string;
  code?: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string;
  postalCode?: string | null;
  taxId?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  rating?: number;
  status?: 'active' | 'inactive' | 'blacklisted';
  notes?: string | null;
}

// ==================== 销售订单类型 ====================

export type SalesOrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export interface SalesOrder {
  id: number;
  orderNo: string;
  customerId: number;
  orderDate: string;
  requiredDate?: string | null;
  shippedDate?: string | null;
  status: SalesOrderStatus;
  paymentStatus: PaymentStatus;
  warehouseId?: number | null;
  salesRepId?: number | null;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  paidAmount: number;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingProvince?: string | null;
  shippingCountry: string;
  shippingPostalCode?: string | null;
  notes?: string | null;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderItemInput {
  productId: number;
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxRate?: number;
  notes?: string | null;
}

export interface SalesOrderCreateInput {
  customerId: number;
  requiredDate?: string | null;
  warehouseId?: number | null;
  salesRepId?: number | null;
  taxRate?: number;
  discountAmount?: number;
  shippingFee?: number;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingProvince?: string | null;
  shippingCountry?: string;
  shippingPostalCode?: string | null;
  notes?: string | null;
  internalNotes?: string | null;
  items: SalesOrderItemInput[];
}

export interface SalesOrderUpdateInput {
  requiredDate?: string | null;
  status?: SalesOrderStatus;
  paymentStatus?: PaymentStatus;
  warehouseId?: number | null;
  salesRepId?: number | null;
  discountAmount?: number;
  shippingFee?: number;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingProvince?: string | null;
  shippingPostalCode?: string | null;
  notes?: string | null;
  internalNotes?: string | null;
}

export interface SalesOrderItem {
  id: number;
  orderId: number;
  productId: number;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  subtotal: number;
  totalAmount: number;
  shippedQuantity: number;
  returnedQuantity: number;
  notes?: string | null;
  createdAt: string;
}

export interface SalesOrderListParams {
  limit: number;
  offset: number;
  customerId?: number | null;
  status?: SalesOrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
}

// ==================== 采购订单类型 ====================

export type PurchaseOrderStatus = 'pending' | 'confirmed' | 'processing' | 'received' | 'completed' | 'cancelled';

export interface PurchaseOrder {
  id: number;
  orderNo: string;
  supplierId: number;
  orderDate: string;
  requiredDate?: string | null;
  receivedDate?: string | null;
  status: PurchaseOrderStatus;
  paymentStatus: PaymentStatus;
  warehouseId?: number | null;
  purchaserId?: number | null;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  paidAmount: number;
  shippingAddress?: string | null;
  notes?: string | null;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItemInput {
  productId: number;
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxRate?: number;
  notes?: string | null;
}

export interface PurchaseOrderCreateInput {
  supplierId: number;
  requiredDate?: string | null;
  warehouseId?: number | null;
  purchaserId?: number | null;
  taxRate?: number;
  discountAmount?: number;
  shippingFee?: number;
  shippingAddress?: string | null;
  notes?: string | null;
  internalNotes?: string | null;
  items: PurchaseOrderItemInput[];
}

export interface PurchaseOrderUpdateInput {
  requiredDate?: string | null;
  status?: PurchaseOrderStatus;
  paymentStatus?: PaymentStatus;
  warehouseId?: number | null;
  purchaserId?: number | null;
  discountAmount?: number;
  shippingFee?: number;
  shippingAddress?: string | null;
  notes?: string | null;
  internalNotes?: string | null;
}

export interface PurchaseOrderItem {
  id: number;
  orderId: number;
  productId: number;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  subtotal: number;
  totalAmount: number;
  receivedQuantity: number;
  returnedQuantity: number;
  notes?: string | null;
  createdAt: string;
}

export interface PurchaseOrderListParams {
  limit: number;
  offset: number;
  supplierId?: number | null;
  status?: PurchaseOrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
}

// ==================== 订单状态历史 ====================

export interface OrderStatusHistory {
  id: number;
  orderType: 'sales' | 'purchase';
  orderId: number;
  oldStatus?: string | null;
  newStatus: string;
  changedBy?: number | null;
  changeReason?: string | null;
  createdAt: string;
}

export interface OrderStatusChangeInput {
  orderType: 'sales' | 'purchase';
  orderId: number;
  newStatus: string;
  changeReason?: string | null;
  changedBy?: number | null;
}

// ==================== 统计类型 ====================

export interface OrderStatistics {
  totalOrders: number;
  totalAmount: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}
