// 销售管理模块 TypeScript 类型定义

// ==================== 销售机会 ====================

export interface SalesOpportunity {
  id: number;
  name: string;
  customerId?: number | null;
  customerName?: string;
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  source: 'referral' | 'website' | 'cold_call' | 'social_media' | 'exhibition' | 'other';
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedAmount: number;
  actualAmount: number;
  winProbability: number;
  expectedCloseDate?: string | null;
  actualCloseDate?: string | null;
  lostReason?: string | null;
  ownerId?: number | null;
  ownerName?: string;
  description?: string | null;
  nextFollowUp?: string | null;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface SalesOpportunityCreateInput {
  name: string;
  customerId?: number | null;
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  source?: 'referral' | 'website' | 'cold_call' | 'social_media' | 'exhibition' | 'other';
  stage?: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimatedAmount?: number;
  winProbability?: number;
  expectedCloseDate?: string | null;
  ownerId?: number | null;
  description?: string | null;
  nextFollowUp?: string | null;
}

export interface SalesOpportunityListParams {
  customerId?: number | null;
  stage?: string | null;
  priority?: string | null;
  status?: string | null;
  ownerId?: number | null;
  limit?: number;
  offset?: number;
}

// ==================== 跟进记录 ====================

export interface OpportunityFollowup {
  id: number;
  opportunityId: number;
  followupType: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'other';
  subject?: string | null;
  content?: string | null;
  outcome?: string | null;
  followupDate: string;
  nextFollowupDate?: string | null;
  createdBy?: number | null;
  createdByName?: string;
  createdAt: string;
}

export interface OpportunityFollowupCreateInput {
  opportunityId: number;
  followupType: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'other';
  subject?: string | null;
  content?: string | null;
  outcome?: string | null;
  nextFollowupDate?: string | null;
}

// ==================== 报价单 ====================

export interface SalesQuotation {
  id: number;
  quotationNumber: string;
  opportunityId?: number | null;
  customerId: number;
  customerName?: string;
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  validUntil?: string | null;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted';
  subtotal: number;
  discountRate: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string | null;
  termsConditions?: string | null;
  createdBy?: number | null;
  createdByName?: string;
  approvedBy?: number | null;
  approvedAt?: string | null;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SalesQuotationCreateInput {
  opportunityId?: number | null;
  customerId: number;
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  validUntil?: string | null;
  status?: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted';
  discountRate?: number;
  taxRate?: number;
  notes?: string | null;
  termsConditions?: string | null;
  items: QuotationItemInput[];
}

export interface QuotationItemInput {
  productId?: number | null;
  productName: string;
  productSku?: string | null;
  description?: string | null;
  quantity: number;
  unit?: string;
  unitPrice: number;
  discountRate?: number;
  sortOrder?: number;
}

export interface QuotationItem {
  id: number;
  quotationId: number;
  productId?: number | null;
  productName: string;
  productSku?: string | null;
  description?: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountRate: number;
  amount: number;
  sortOrder: number;
  createdAt: string;
}

export interface SalesQuotationListParams {
  customerId?: number | null;
  opportunityId?: number | null;
  status?: string | null;
  limit?: number;
  offset?: number;
}

// ==================== 销售合同 ====================

export interface SalesContract {
  id: number;
  contractNumber: string;
  contractName: string;
  opportunityId?: number | null;
  quotationId?: number | null;
  customerId: number;
  customerName?: string;
  contractType: 'sales' | 'framework' | 'distribution' | 'agency';
  startDate?: string | null;
  endDate?: string | null;
  autoRenew: boolean;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: string;
  paymentTerms?: string | null;
  deliveryTerms?: string | null;
  status: 'draft' | 'pending_approval' | 'approved' | 'active' | 'completed' | 'terminated' | 'expired';
  signedDate?: string | null;
  customerSignedDate?: string | null;
  internalSignedBy?: number | null;
  notes?: string | null;
  attachmentUrls: string[];
  createdBy?: number | null;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesContractCreateInput {
  contractName: string;
  opportunityId?: number | null;
  quotationId?: number | null;
  customerId: number;
  contractType?: 'sales' | 'framework' | 'distribution' | 'agency';
  startDate?: string | null;
  endDate?: string | null;
  autoRenew?: boolean;
  currency?: string;
  paymentTerms?: string | null;
  deliveryTerms?: string | null;
  notes?: string | null;
  attachmentUrls?: string[];
  items: ContractItemInput[];
}

export interface ContractItemInput {
  productId?: number | null;
  productName: string;
  productSku?: string | null;
  description?: string | null;
  quantity: number;
  unit?: string;
  unitPrice: number;
  discountRate?: number;
  deliveryDate?: string | null;
  sortOrder?: number;
}

export interface ContractItem {
  id: number;
  contractId: number;
  productId?: number | null;
  productName: string;
  productSku?: string | null;
  description?: string | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountRate: number;
  amount: number;
  deliveryDate?: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface SalesContractListParams {
  customerId?: number | null;
  contractType?: string | null;
  status?: string | null;
  limit?: number;
  offset?: number;
}

// ==================== 销售预测 ====================

export interface SalesForecast {
  id: number;
  periodType: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  periodStart: string;
  periodEnd: string;
  productId?: number | null;
  productName?: string;
  categoryId?: number | null;
  categoryName?: string;
  forecastQuantity: number;
  forecastAmount: number;
  actualQuantity: number;
  actualAmount: number;
  accuracyRate: number;
  method: 'historical_avg' | 'trend_analysis' | 'seasonal' | 'manual' | 'ai_predicted';
  confidenceLevel: number;
  notes?: string | null;
  createdBy?: number | null;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesForecastCreateInput {
  periodType: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  periodStart: string;
  periodEnd: string;
  productId?: number | null;
  categoryId?: number | null;
  forecastQuantity?: number;
  forecastAmount?: number;
  method?: 'historical_avg' | 'trend_analysis' | 'seasonal' | 'manual' | 'ai_predicted';
  confidenceLevel?: number;
  notes?: string | null;
}

export interface SalesForecastListParams {
  periodType?: string | null;
  productId?: number | null;
  limit?: number;
  offset?: number;
}

// ==================== 销售佣金 ====================

export interface SalesCommission {
  id: number;
  salesPersonId: number;
  salesPersonName?: string;
  opportunityId?: number | null;
  contractId?: number | null;
  orderId?: number | null;
  commissionType: 'percentage' | 'fixed' | 'tiered' | 'bonus';
  commissionRate: number;
  baseAmount: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  calculationDate?: string | null;
  paymentDate?: string | null;
  notes?: string | null;
  approvedBy?: number | null;
  approvedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesCommissionCreateInput {
  salesPersonId: number;
  opportunityId?: number | null;
  contractId?: number | null;
  orderId?: number | null;
  commissionType?: 'percentage' | 'fixed' | 'tiered' | 'bonus';
  commissionRate?: number;
  baseAmount: number;
  notes?: string | null;
}

export interface SalesCommissionListParams {
  salesPersonId?: number | null;
  status?: string | null;
  limit?: number;
  offset?: number;
}

// ==================== 销售业绩 ====================

export interface SalesPerformance {
  id: number;
  salesPersonId: number;
  salesPersonName?: string;
  periodType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  periodStart: string;
  periodEnd: string;
  targetAmount: number;
  actualAmount: number;
  achievementRate: number;
  opportunitiesCount: number;
  wonOpportunitiesCount: number;
  quotationsCount: number;
  contractsCount: number;
  ordersCount: number;
  totalCommission: number;
  ranking: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SalesPerformanceListParams {
  salesPersonId?: number | null;
  periodType?: string | null;
  limit?: number;
  offset?: number;
}

// ==================== 销售活动 ====================

export interface SalesActivity {
  id: number;
  activityType: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'contract' | 'followup' | 'other';
  subject: string;
  description?: string | null;
  relatedType: 'opportunity' | 'quotation' | 'contract' | 'customer' | 'order';
  relatedId?: number | null;
  participantIds: number[];
  participantNames?: string[];
  scheduledTime?: string | null;
  actualTime?: string | null;
  durationMinutes?: number | null;
  location?: string | null;
  outcome?: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  createdBy?: number | null;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesActivityCreateInput {
  activityType: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'contract' | 'followup' | 'other';
  subject: string;
  description?: string | null;
  relatedType?: 'opportunity' | 'quotation' | 'contract' | 'customer' | 'order';
  relatedId?: number | null;
  participantIds?: number[];
  scheduledTime?: string | null;
  location?: string | null;
}

export interface SalesActivityListParams {
  activityType?: string | null;
  relatedType?: string | null;
  relatedId?: number | null;
  status?: string | null;
  limit?: number;
  offset?: number;
}
