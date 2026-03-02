// 供应商管理模块 TypeScript 类型定义

export interface Supplier {
  id: number;
  code: string;
  name: string;
  type: 'company' | 'individual' | 'manufacturer' | 'distributor' | 'other';
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactTitle?: string | null;
  idNumber?: string | null;
  taxId?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
  website?: string | null;
  industry?: string | null;
  source?: string | null;
  level: 'vip' | 'normal' | 'potential' | 'blacklist';
  creditDays: number;
  paymentTerms?: string | null;
  minOrderAmount: number;
  deliveryLeadTime: number;
  qualityRating: number;
  serviceRating: number;
  deliveryRating: number;
  status: 'active' | 'inactive' | 'potential';
  notes?: string | null;
  ownerId?: number | null;
  parentId?: number | null;
  tags: string[];
  customFields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierCreateInput {
  code: string;
  name: string;
  type?: 'company' | 'individual' | 'manufacturer' | 'distributor' | 'other';
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactTitle?: string | null;
  idNumber?: string | null;
  taxId?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
  website?: string | null;
  industry?: string | null;
  source?: string | null;
  level?: 'vip' | 'normal' | 'potential' | 'blacklist';
  creditDays?: number;
  paymentTerms?: string | null;
  minOrderAmount?: number;
  deliveryLeadTime?: number;
  qualityRating?: number;
  serviceRating?: number;
  deliveryRating?: number;
  notes?: string | null;
  ownerId?: number | null;
  parentId?: number | null;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

export interface SupplierUpdateInput {
  code?: string;
  name?: string;
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactTitle?: string | null;
  idNumber?: string | null;
  taxId?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
  website?: string | null;
  industry?: string | null;
  source?: string | null;
  level?: 'vip' | 'normal' | 'potential' | 'blacklist';
  creditDays?: number;
  paymentTerms?: string | null;
  minOrderAmount?: number;
  deliveryLeadTime?: number;
  qualityRating?: number;
  serviceRating?: number;
  deliveryRating?: number;
  status?: 'active' | 'inactive' | 'potential';
  notes?: string | null;
  ownerId?: number | null;
  parentId?: number | null;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

export interface SupplierListParams {
  limit?: number;
  offset?: number;
  type?: 'company' | 'individual' | 'manufacturer' | 'distributor' | 'other';
  level?: 'vip' | 'normal' | 'potential' | 'blacklist';
  status?: 'active' | 'inactive' | 'potential';
  city?: string;
  ownerId?: number;
  search?: string;
}

export interface SupplierListResponse {
  suppliers: Supplier[];
  total: number;
  limit: number;
  offset: number;
}

// ==================== 供应商联系人 ====================

export interface SupplierContact {
  id: number;
  supplierId: number;
  name: string;
  title?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  wechat?: string | null;
  qq?: string | null;
  isPrimary: boolean;
  notes?: string | null;
  birthday?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierContactCreateInput {
  supplierId: number;
  name: string;
  title?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  wechat?: string | null;
  qq?: string | null;
  isPrimary?: boolean;
  notes?: string | null;
  birthday?: string | null;
}

export interface SupplierContactUpdateInput {
  name?: string;
  title?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  wechat?: string | null;
  qq?: string | null;
  isPrimary?: boolean;
  notes?: string | null;
  birthday?: string | null;
}

// ==================== 供应商联系记录 ====================

export interface SupplierInteraction {
  id: number;
  supplierId: number;
  contactId?: number | null;
  type: 'call' | 'meeting' | 'email' | 'wechat' | 'visit' | 'other';
  subject?: string | null;
  content?: string | null;
  result?: string | null;
  followUpDate?: string | null;
  followUpNotes?: string | null;
  operatorId?: number | null;
  createdAt: string;
}

export interface SupplierInteractionCreateInput {
  supplierId: number;
  contactId?: number | null;
  type: 'call' | 'meeting' | 'email' | 'wechat' | 'visit' | 'other';
  subject?: string | null;
  content?: string | null;
  result?: string | null;
  followUpDate?: string | null;
  followUpNotes?: string | null;
}

// ==================== 供应商分级配置 ====================

export interface SupplierLevel {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  discountRate: number;
  creditDays: number;
  minOrderAmount: number;
  benefits: string[];
  createdAt: string;
  updatedAt: string;
}

// ==================== 供应商标签 ====================

export interface SupplierTag {
  id: number;
  name: string;
  color: string;
  description?: string | null;
  createdAt: string;
}

export interface SupplierTagCreateInput {
  name: string;
  color?: string;
  description?: string | null;
}

// ==================== 供应商评估 ====================

export interface SupplierEvaluation {
  id: number;
  supplierId: number;
  evaluationType: 'quarterly' | 'annual' | 'project' | 'other';
  evaluationDate: string;
  qualityScore: number;
  deliveryScore: number;
  serviceScore: number;
  priceScore: number;
  totalScore: number;
  evaluatorId?: number | null;
  comments?: string | null;
  improvementNotes?: string | null;
  status: 'pending' | 'completed' | 'approved';
  createdAt: string;
  updatedAt: string;
}

export interface SupplierEvaluationCreateInput {
  supplierId: number;
  evaluationType: 'quarterly' | 'annual' | 'project' | 'other';
  evaluationDate: string;
  qualityScore?: number;
  deliveryScore?: number;
  serviceScore?: number;
  priceScore?: number;
  comments?: string | null;
  improvementNotes?: string | null;
  evaluatorId?: number | null;
}

export interface SupplierEvaluationUpdateInput {
  qualityScore?: number;
  deliveryScore?: number;
  serviceScore?: number;
  priceScore?: number;
  comments?: string | null;
  improvementNotes?: string | null;
  status?: 'pending' | 'completed' | 'approved';
}

export interface SupplierEvaluationListParams {
  supplierId?: number;
  evaluationType?: 'quarterly' | 'annual' | 'project' | 'other';
  status?: 'pending' | 'completed' | 'approved';
  limit?: number;
  offset?: number;
}

// ==================== 供应商产品 ====================

export interface SupplierProduct {
  id: number;
  supplierId: number;
  productId: number;
  productCode?: string | null;
  productName?: string | null;
  unitPrice: number;
  currency: string;
  minOrderQuantity: number;
  leadTime: number;
  isPreferred: boolean;
  status: 'active' | 'inactive';
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierProductCreateInput {
  supplierId: number;
  productId: number;
  productCode?: string | null;
  productName?: string | null;
  unitPrice?: number;
  currency?: string;
  minOrderQuantity?: number;
  leadTime?: number;
  isPreferred?: boolean;
  notes?: string | null;
}

export interface SupplierProductUpdateInput {
  productCode?: string;
  productName?: string | null;
  unitPrice?: number;
  currency?: string;
  minOrderQuantity?: number;
  leadTime?: number;
  isPreferred?: boolean;
  status?: 'active' | 'inactive';
  notes?: string | null;
}

// ==================== 供应商统计 ====================

export interface SupplierStatistics {
  total: number;
  byLevel: {
    vip: number;
    normal: number;
    potential: number;
  };
  byStatus: {
    active: number;
  };
}
