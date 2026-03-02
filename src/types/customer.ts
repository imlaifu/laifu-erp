// 客户管理模块 TypeScript 类型定义

export interface Customer {
  id: number;
  code: string;
  name: string;
  type: 'individual' | 'company' | 'government' | 'other';
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactTitle?: string | null;
  idNumber?: string | null;
  taxId?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
  website?: string | null;
  industry?: string | null;
  source?: string | null;
  level: 'vip' | 'normal' | 'potential' | 'blacklist';
  creditLimit: number;
  creditDays: number;
  status: 'active' | 'inactive' | 'potential';
  notes?: string | null;
  ownerId?: number | null;
  parentId?: number | null;
  tags: string[];
  customFields: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerCreateInput {
  code: string;
  name: string;
  type?: 'individual' | 'company' | 'government' | 'other';
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactTitle?: string | null;
  idNumber?: string | null;
  taxId?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
  website?: string | null;
  industry?: string | null;
  source?: string | null;
  level?: 'vip' | 'normal' | 'potential' | 'blacklist';
  creditLimit?: number;
  creditDays?: number;
  notes?: string | null;
  ownerId?: number | null;
  parentId?: number | null;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

export interface CustomerUpdateInput {
  code?: string;
  name?: string;
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactTitle?: string | null;
  idNumber?: string | null;
  taxId?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
  website?: string | null;
  industry?: string | null;
  source?: string | null;
  level?: 'vip' | 'normal' | 'potential' | 'blacklist';
  creditLimit?: number;
  creditDays?: number;
  status?: 'active' | 'inactive' | 'potential';
  notes?: string | null;
  ownerId?: number | null;
  parentId?: number | null;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

export interface CustomerListParams {
  limit?: number;
  offset?: number;
  type?: 'individual' | 'company' | 'government' | 'other';
  level?: 'vip' | 'normal' | 'potential' | 'blacklist';
  status?: 'active' | 'inactive' | 'potential';
  city?: string;
  ownerId?: number;
  search?: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  limit: number;
  offset: number;
}

// ==================== 客户联系人 ====================

export interface CustomerContact {
  id: number;
  customerId: number;
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

export interface CustomerContactCreateInput {
  customerId: number;
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

export interface CustomerContactUpdateInput {
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

// ==================== 客户联系记录 ====================

export interface CustomerInteraction {
  id: number;
  customerId: number;
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

export interface CustomerInteractionCreateInput {
  customerId: number;
  contactId?: number | null;
  type: 'call' | 'meeting' | 'email' | 'wechat' | 'visit' | 'other';
  subject?: string | null;
  content?: string | null;
  result?: string | null;
  followUpDate?: string | null;
  followUpNotes?: string | null;
}

// ==================== 客户分级配置 ====================

export interface CustomerLevelConfig {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  discountRate: number;
  creditDays: number;
  minPurchaseAmount: number;
  benefits: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerLevelConfigCreateInput {
  name: string;
  code: string;
  description?: string | null;
  discountRate?: number;
  creditDays?: number;
  minPurchaseAmount?: number;
  benefits?: string[];
  status?: string;
}

export interface CustomerLevelConfigUpdateInput {
  name?: string;
  code?: string;
  description?: string | null;
  discountRate?: number;
  creditDays?: number;
  minPurchaseAmount?: number;
  benefits?: string[];
  status?: string;
}

// ==================== 客户标签 ====================

export interface CustomerTag {
  id: number;
  name: string;
  color: string;
  description?: string | null;
  createdAt: string;
}

export interface CustomerTagCreateInput {
  name: string;
  color?: string;
  description?: string | null;
}

export interface CustomerTagUpdateInput {
  name?: string;
  color?: string;
  description?: string | null;
}

// ==================== 客户跟进计划 ====================

export interface CustomerFollowUp {
  id: number;
  customerId: number;
  contactId?: number | null;
  followUpType: 'call' | 'meeting' | 'email' | 'wechat' | 'visit' | 'other';
  subject: string;
  content?: string | null;
  plannedDate: string;
  completedDate?: string | null;
  status: 'pending' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  operatorId?: number | null;
  result?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFollowUpCreateInput {
  customerId: number;
  contactId?: number | null;
  followUpType: 'call' | 'meeting' | 'email' | 'wechat' | 'visit' | 'other';
  subject: string;
  content?: string | null;
  plannedDate: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  operatorId?: number | null;
}

export interface CustomerFollowUpUpdateInput {
  followUpType?: 'call' | 'meeting' | 'email' | 'wechat' | 'visit' | 'other';
  subject?: string;
  content?: string | null;
  plannedDate?: string;
  completedDate?: string | null;
  status?: 'pending' | 'completed' | 'cancelled' | 'rescheduled';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  result?: string | null;
  notes?: string | null;
}

export interface CustomerFollowUpListParams {
  customerId?: number;
  status?: 'pending' | 'completed' | 'cancelled' | 'rescheduled';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  operatorId?: number;
  limit?: number;
  offset?: number;
}

// ==================== 客户统计 ====================

export interface CustomerStatistics {
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
