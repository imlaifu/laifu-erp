// 供应商管理模块 API 服务

import { invoke } from '@tauri-apps/api/core';
import type {
  Supplier,
  SupplierCreateInput,
  SupplierUpdateInput,
  SupplierListParams,
  SupplierListResponse,
  SupplierContact,
  SupplierContactCreateInput,
  SupplierContactUpdateInput,
  SupplierInteraction,
  SupplierInteractionCreateInput,
  SupplierLevel,
  SupplierTag,
  SupplierTagCreateInput,
  SupplierEvaluation,
  SupplierEvaluationCreateInput,
  SupplierEvaluationUpdateInput,
  SupplierEvaluationListParams,
  SupplierProduct,
  SupplierProductCreateInput,
  SupplierProductUpdateInput,
  SupplierStatistics,
} from '../types/supplier';

// ==================== 供应商 CRUD API ====================

/**
 * 创建供应商
 */
export async function createSupplier(input: SupplierCreateInput): Promise<Supplier> {
  return invoke<Supplier>('create_supplier', { input });
}

/**
 * 获取供应商详情
 */
export async function getSupplier(id: number): Promise<Supplier> {
  return invoke<Supplier>('get_supplier', { id });
}

/**
 * 获取供应商列表
 */
export async function listSuppliers(params: SupplierListParams): Promise<SupplierListResponse> {
  return invoke<SupplierListResponse>('list_suppliers', { params });
}

/**
 * 更新供应商
 */
export async function updateSupplier(id: number, input: SupplierUpdateInput): Promise<Supplier> {
  return invoke<Supplier>('update_supplier', { id, input });
}

/**
 * 删除供应商 (软删除)
 */
export async function deleteSupplier(id: number): Promise<boolean> {
  return invoke<boolean>('delete_supplier', { id });
}

/**
 * 获取供应商统计
 */
export async function getSupplierStatistics(): Promise<SupplierStatistics> {
  return invoke<SupplierStatistics>('get_supplier_statistics');
}

// ==================== 供应商联系人 API ====================

/**
 * 创建供应商联系人
 */
export async function createSupplierContact(input: SupplierContactCreateInput): Promise<SupplierContact> {
  return invoke<SupplierContact>('create_supplier_contact', { input });
}

/**
 * 获取供应商联系人详情
 */
export async function getSupplierContact(id: number): Promise<SupplierContact> {
  return invoke<SupplierContact>('get_supplier_contact', { id });
}

/**
 * 获取供应商联系人列表
 */
export async function listSupplierContacts(supplierId: number): Promise<SupplierContact[]> {
  return invoke<SupplierContact[]>('list_supplier_contacts', { supplierId });
}

/**
 * 更新供应商联系人
 */
export async function updateSupplierContact(id: number, input: SupplierContactUpdateInput): Promise<SupplierContact> {
  return invoke<SupplierContact>('update_supplier_contact', { id, input });
}

/**
 * 删除供应商联系人 (软删除)
 */
export async function deleteSupplierContact(id: number): Promise<boolean> {
  return invoke<boolean>('delete_supplier_contact', { id });
}

// ==================== 供应商联系记录 API ====================

/**
 * 创建供应商联系记录
 */
export async function createSupplierInteraction(input: SupplierInteractionCreateInput): Promise<SupplierInteraction> {
  return invoke<SupplierInteraction>('create_supplier_interaction', { input });
}

/**
 * 获取供应商联系记录列表
 */
export async function listSupplierInteractions(supplierId: number, limit: number, offset: number): Promise<SupplierInteraction[]> {
  return invoke<SupplierInteraction[]>('list_supplier_interactions', { supplierId, limit, offset });
}

// ==================== 供应商分级配置 API ====================

/**
 * 获取供应商分级配置列表
 */
export async function listSupplierLevels(): Promise<SupplierLevel[]> {
  return invoke<SupplierLevel[]>('list_supplier_levels');
}

// ==================== 供应商标签 API ====================

/**
 * 获取供应商标签列表
 */
export async function listSupplierTags(): Promise<SupplierTag[]> {
  return invoke<SupplierTag[]>('list_supplier_tags');
}

/**
 * 创建供应商标签
 */
export async function createSupplierTag(input: SupplierTagCreateInput): Promise<SupplierTag> {
  return invoke<SupplierTag>('create_supplier_tag', { input });
}

// ==================== 供应商评估 API ====================

/**
 * 创建供应商评估
 */
export async function createSupplierEvaluation(input: SupplierEvaluationCreateInput): Promise<SupplierEvaluation> {
  return invoke<SupplierEvaluation>('create_supplier_evaluation', { input });
}

/**
 * 获取供应商评估详情
 */
export async function getSupplierEvaluation(id: number): Promise<SupplierEvaluation> {
  return invoke<SupplierEvaluation>('get_supplier_evaluation', { id });
}

/**
 * 获取供应商评估列表
 */
export async function listSupplierEvaluations(params: SupplierEvaluationListParams): Promise<SupplierEvaluation[]> {
  return invoke<SupplierEvaluation[]>('list_supplier_evaluations', { params });
}

/**
 * 更新供应商评估
 */
export async function updateSupplierEvaluation(id: number, input: SupplierEvaluationUpdateInput): Promise<SupplierEvaluation> {
  return invoke<SupplierEvaluation>('update_supplier_evaluation', { id, input });
}

/**
 * 删除供应商评估
 */
export async function deleteSupplierEvaluation(id: number): Promise<boolean> {
  return invoke<boolean>('delete_supplier_evaluation', { id });
}

// ==================== 供应商产品 API ====================

/**
 * 创建供应商产品
 */
export async function createSupplierProduct(input: SupplierProductCreateInput): Promise<SupplierProduct> {
  return invoke<SupplierProduct>('create_supplier_product', { input });
}

/**
 * 获取供应商产品详情
 */
export async function getSupplierProduct(id: number): Promise<SupplierProduct> {
  return invoke<SupplierProduct>('get_supplier_product', { id });
}

/**
 * 获取供应商产品列表
 */
export async function listSupplierProducts(supplierId: number): Promise<SupplierProduct[]> {
  return invoke<SupplierProduct[]>('list_supplier_products', { supplierId });
}

/**
 * 更新供应商产品
 */
export async function updateSupplierProduct(id: number, input: SupplierProductUpdateInput): Promise<SupplierProduct> {
  return invoke<SupplierProduct>('update_supplier_product', { id, input });
}

/**
 * 删除供应商产品
 */
export async function deleteSupplierProduct(id: number): Promise<boolean> {
  return invoke<boolean>('delete_supplier_product', { id });
}
