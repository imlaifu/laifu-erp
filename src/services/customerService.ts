// 客户管理模块 API 服务

import { invoke } from '@tauri-apps/api/core';
import type {
  Customer,
  CustomerCreateInput,
  CustomerUpdateInput,
  CustomerListParams,
  CustomerListResponse,
  CustomerContact,
  CustomerContactCreateInput,
  CustomerContactUpdateInput,
  CustomerInteraction,
  CustomerInteractionCreateInput,
  CustomerLevelConfig,
  CustomerLevelConfigCreateInput,
  CustomerLevelConfigUpdateInput,
  CustomerTag,
  CustomerTagCreateInput,
  CustomerTagUpdateInput,
  CustomerFollowUp,
  CustomerFollowUpCreateInput,
  CustomerFollowUpUpdateInput,
  CustomerFollowUpListParams,
  CustomerStatistics,
} from '../types/customer';

// ==================== 客户 CRUD API ====================

/**
 * 创建客户
 */
export async function createCustomer(input: CustomerCreateInput): Promise<Customer> {
  return invoke<Customer>('create_customer', { input });
}

/**
 * 获取客户详情
 */
export async function getCustomer(id: number): Promise<Customer> {
  return invoke<Customer>('get_customer', { id });
}

/**
 * 获取客户列表
 */
export async function listCustomers(params: CustomerListParams): Promise<CustomerListResponse> {
  return invoke<CustomerListResponse>('list_customers', { params });
}

/**
 * 更新客户
 */
export async function updateCustomer(id: number, input: CustomerUpdateInput): Promise<Customer> {
  return invoke<Customer>('update_customer', { id, input });
}

/**
 * 删除客户 (软删除)
 */
export async function deleteCustomer(id: number): Promise<boolean> {
  return invoke<boolean>('delete_customer', { id });
}

/**
 * 获取客户统计
 */
export async function getCustomerStatistics(): Promise<CustomerStatistics> {
  return invoke<CustomerStatistics>('get_customer_statistics');
}

// ==================== 客户联系人 API ====================

/**
 * 创建客户联系人
 */
export async function createCustomerContact(input: CustomerContactCreateInput): Promise<CustomerContact> {
  return invoke<CustomerContact>('create_customer_contact', { input });
}

/**
 * 获取客户联系人详情
 */
export async function getCustomerContact(id: number): Promise<CustomerContact> {
  return invoke<CustomerContact>('get_customer_contact', { id });
}

/**
 * 获取客户联系人列表
 */
export async function listCustomerContacts(customerId: number): Promise<CustomerContact[]> {
  return invoke<CustomerContact[]>('list_customer_contacts', { customerId });
}

/**
 * 更新客户联系人
 */
export async function updateCustomerContact(id: number, input: CustomerContactUpdateInput): Promise<CustomerContact> {
  return invoke<CustomerContact>('update_customer_contact', { id, input });
}

/**
 * 删除客户联系人 (软删除)
 */
export async function deleteCustomerContact(id: number): Promise<boolean> {
  return invoke<boolean>('delete_customer_contact', { id });
}

// ==================== 客户联系记录 API ====================

/**
 * 创建客户联系记录
 */
export async function createCustomerInteraction(input: CustomerInteractionCreateInput): Promise<CustomerInteraction> {
  return invoke<CustomerInteraction>('create_customer_interaction', { input });
}

/**
 * 获取客户联系记录详情
 */
export async function getCustomerInteraction(id: number): Promise<CustomerInteraction> {
  return invoke<CustomerInteraction>('get_customer_interaction', { id });
}

/**
 * 获取客户联系记录列表
 */
export async function listCustomerInteractions(customerId: number, limit: number, offset: number): Promise<CustomerInteraction[]> {
  return invoke<CustomerInteraction[]>('list_customer_interactions', { customerId, limit, offset });
}

// ==================== 客户分级配置 API ====================

/**
 * 创建客户分级配置
 */
export async function createCustomerLevelConfig(input: CustomerLevelConfigCreateInput): Promise<CustomerLevelConfig> {
  return invoke<CustomerLevelConfig>('create_customer_level_config', { input });
}

/**
 * 获取客户分级配置详情
 */
export async function getCustomerLevelConfig(id: number): Promise<CustomerLevelConfig> {
  return invoke<CustomerLevelConfig>('get_customer_level_config', { id });
}

/**
 * 获取客户分级配置列表
 */
export async function listCustomerLevelConfigs(status?: string): Promise<CustomerLevelConfig[]> {
  return invoke<CustomerLevelConfig[]>('list_customer_level_configs', { status });
}

/**
 * 更新客户分级配置
 */
export async function updateCustomerLevelConfig(id: number, input: CustomerLevelConfigUpdateInput): Promise<CustomerLevelConfig> {
  return invoke<CustomerLevelConfig>('update_customer_level_config', { id, input });
}

/**
 * 删除客户分级配置
 */
export async function deleteCustomerLevelConfig(id: number): Promise<boolean> {
  return invoke<boolean>('delete_customer_level_config', { id });
}

// ==================== 客户标签 API ====================

/**
 * 创建客户标签
 */
export async function createCustomerTag(input: CustomerTagCreateInput): Promise<CustomerTag> {
  return invoke<CustomerTag>('create_customer_tag', { input });
}

/**
 * 获取客户标签详情
 */
export async function getCustomerTag(id: number): Promise<CustomerTag> {
  return invoke<CustomerTag>('get_customer_tag', { id });
}

/**
 * 获取客户标签列表
 */
export async function listCustomerTags(): Promise<CustomerTag[]> {
  return invoke<CustomerTag[]>('list_customer_tags');
}

/**
 * 更新客户标签
 */
export async function updateCustomerTag(id: number, input: CustomerTagUpdateInput): Promise<CustomerTag> {
  return invoke<CustomerTag>('update_customer_tag', { id, input });
}

/**
 * 删除客户标签
 */
export async function deleteCustomerTag(id: number): Promise<boolean> {
  return invoke<boolean>('delete_customer_tag', { id });
}

/**
 * 为客户添加标签
 */
export async function addCustomerTag(customerId: number, tagId: number): Promise<number> {
  return invoke<number>('add_customer_tag', { customerId, tagId });
}

/**
 * 移除客户标签
 */
export async function removeCustomerTag(customerId: number, tagId: number): Promise<boolean> {
  return invoke<boolean>('remove_customer_tag', { customerId, tagId });
}

/**
 * 获取客户的标签列表
 */
export async function getCustomerTags(customerId: number): Promise<CustomerTag[]> {
  return invoke<CustomerTag[]>('get_customer_tags', { customerId });
}

// ==================== 客户跟进计划 API ====================

/**
 * 创建客户跟进计划
 */
export async function createCustomerFollowUp(input: CustomerFollowUpCreateInput): Promise<CustomerFollowUp> {
  return invoke<CustomerFollowUp>('create_customer_follow_up', { input });
}

/**
 * 获取客户跟进计划详情
 */
export async function getCustomerFollowUp(id: number): Promise<CustomerFollowUp> {
  return invoke<CustomerFollowUp>('get_customer_follow_up', { id });
}

/**
 * 获取客户跟进计划列表
 */
export async function listCustomerFollowUps(params: CustomerFollowUpListParams): Promise<CustomerFollowUp[]> {
  return invoke<CustomerFollowUp[]>('list_customer_follow_ups', { params });
}

/**
 * 更新客户跟进计划
 */
export async function updateCustomerFollowUp(id: number, input: CustomerFollowUpUpdateInput): Promise<CustomerFollowUp> {
  return invoke<CustomerFollowUp>('update_customer_follow_up', { id, input });
}

/**
 * 删除客户跟进计划
 */
export async function deleteCustomerFollowUp(id: number): Promise<boolean> {
  return invoke<boolean>('delete_customer_follow_up', { id });
}
