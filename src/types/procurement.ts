// 采购管理模块 TypeScript 类型定义

// ==================== 采购申请 ====================

export interface ProcurementRequest {
  id: number;
  requestNo: string;
  applicantId?: number | null;
  department?: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  totalAmount: number;
  notes?: string | null;
  approvedBy?: number | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProcurementRequestCreateInput {
  department?: string | null;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  notes?: string | null;
  items: ProcurementRequestItemInput[];
}

export interface ProcurementRequestItemInput {
  productId?: number | null;
  productName: string;
  productSku?: string | null;
  quantity: number;
  unit?: string;
  estimatedPrice?: number;
  notes?: string | null;
}

export interface ProcurementRequestItem {
  id: number;
  requestId: number;
  productId?: number | null;
  productName: string;
  productSku?: string | null;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  totalAmount: number;
  notes?: string | null;
  createdAt: string;
}

// ==================== 采购订单 ====================

export interface PurchaseOrder {
  id: number;
  orderNo: string;
  supplierId: number;
  supplierName?: string;
  requestId?: number | null;
  orderDate: string;
  expectedDeliveryDate?: string | null;
  actualDeliveryDate?: string | null;
  status: 'draft' | 'submitted' | 'confirmed' | 'partially_received' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  paymentTerms?: string | null;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  notes?: string | null;
  attachmentUrls: string[];
  createdBy?: number | null;
  confirmedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderCreateInput {
  supplierId: number;
  requestId?: number | null;
  orderDate?: string | null;
  expectedDeliveryDate?: string | null;
  paymentTerms?: string | null;
  currency?: string;
  taxRate?: number;
  discountAmount?: number;
  shippingCost?: number;
  notes?: string | null;
  attachmentUrls?: string[];
  items: PurchaseOrderItemInput[];
}

export interface PurchaseOrderItemInput {
  productId?: number | null;
  productName: string;
  productSku?: string | null;
  quantity: number;
  unit?: string;
  unitPrice: number;
  taxRate?: number;
  discountRate?: number;
  notes?: string | null;
}

export interface PurchaseOrderItem {
  id: number;
  orderId: number;
  productId?: number | null;
  productName: string;
  productSku?: string | null;
  quantity: number;
  receivedQuantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  taxRate: number;
  discountRate: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== 采购合同 ====================

export interface PurchaseContract {
  id: number;
  contractNo: string;
  orderId?: number | null;
  supplierId: number;
  supplierName?: string;
  contractType: 'standard' | 'framework' | 'annual';
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  totalAmount: number;
  status: 'draft' | 'pending_review' | 'active' | 'expired' | 'terminated';
  terms?: string | null;
  attachmentUrls: string[];
  signedBySupplier?: string | null;
  signedByCompany?: string | null;
  signedAt?: string | null;
  createdBy?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseContractCreateInput {
  orderId?: number | null;
  supplierId: number;
  contractType?: 'standard' | 'framework' | 'annual';
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  totalAmount?: number;
  terms?: string | null;
  attachmentUrls?: string[];
}

// ==================== 入库验收 ====================

export interface ReceivingInspection {
  id: number;
  inspectionNo: string;
  orderId: number;
  warehouseId?: number | null;
  warehouseName?: string;
  inspectionDate: string;
  inspectorId?: number | null;
  status: 'pending' | 'partial' | 'completed' | 'rejected';
  qualityStatus: 'pending' | 'passed' | 'conditional' | 'failed';
  notes?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReceivingInspectionCreateInput {
  orderId: number;
  warehouseId?: number | null;
  inspectionDate?: string | null;
  notes?: string | null;
  items: ReceivingInspectionItemInput[];
}

export interface ReceivingInspectionItemInput {
  orderItemId: number;
  productId?: number | null;
  expectedQuantity: number;
  receivedQuantity: number;
  qualifiedQuantity?: number | null;
  rejectedQuantity?: number | null;
  qualityNotes?: string | null;
  warehouseLocation?: string | null;
}

export interface ReceivingInspectionItem {
  id: number;
  inspectionId: number;
  orderItemId: number;
  productId?: number | null;
  expectedQuantity: number;
  receivedQuantity: number;
  qualifiedQuantity: number;
  rejectedQuantity: number;
  unitPrice: number;
  subtotal: number;
  qualityNotes?: string | null;
  warehouseLocation?: string | null;
  createdAt: string;
}

// ==================== 供应商比价 ====================

export interface SupplierComparison {
  id: number;
  comparisonNo: string;
  title: string;
  productId?: number | null;
  productName: string;
  quantity: number;
  status: 'draft' | 'completed' | 'archived';
  createdBy?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierComparisonCreateInput {
  title: string;
  productId?: number | null;
  productName: string;
  quantity: number;
}

export interface SupplierComparisonItem {
  id: number;
  comparisonId: number;
  supplierId: number;
  supplierName: string;
  unitPrice: number;
  totalAmount: number;
  deliveryDays?: number | null;
  paymentTerms?: string | null;
  qualityRating?: number | null;
  serviceRating?: number | null;
  notes?: string | null;
  isSelected: boolean;
  createdAt: string;
}

export interface SupplierComparisonItemInput {
  supplierId: number;
  unitPrice: number;
  deliveryDays?: number | null;
  paymentTerms?: string | null;
  qualityRating?: number | null;
  serviceRating?: number | null;
  notes?: string | null;
}

// ==================== 列表参数 ====================

export interface ProcurementRequestListParams {
  limit?: number;
  offset?: number;
  status?: string;
}

export interface PurchaseOrderListParams {
  limit?: number;
  offset?: number;
  supplierId?: number;
  status?: string;
}

export interface PurchaseContractListParams {
  limit?: number;
  offset?: number;
  supplierId?: number;
  status?: string;
}

export interface ReceivingInspectionListParams {
  limit?: number;
  offset?: number;
  orderId?: number;
  status?: string;
}

export interface SupplierComparisonListParams {
  limit?: number;
  offset?: number;
  status?: string;
}

// ==================== 统计数据 ====================

export interface ProcurementStats {
  month: string;
  orderCount: number;
  totalAmount: number;
  completedAmount: number;
  paidAmount: number;
}

export interface ProcurementDashboardStats {
  totalRequests: number;
  pendingRequests: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  thisMonthSpent: number;
}
