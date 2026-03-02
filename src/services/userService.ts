// 用户管理模块 API 服务

import { invoke } from '@tauri-apps/api/core';
import type {
  User,
  UserCreateInput,
  UserUpdateInput,
  UserListParams,
  UserListResponse,
  Role,
  RoleCreateInput,
  Department,
  DepartmentCreateInput,
  LoginRequest,
  LoginResponse,
} from '../types/user';

// ==================== 用户 API ====================

/**
 * 用户登录
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  return invoke<LoginResponse>('login', { request });
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  return invoke('logout');
}

/**
 * 创建用户
 */
export async function createUser(input: UserCreateInput): Promise<User> {
  return invoke<User>('create_user', { input });
}

/**
 * 获取用户详情
 */
export async function getUser(id: number): Promise<User> {
  return invoke<User>('get_user', { id });
}

/**
 * 获取用户列表
 */
export async function listUsers(params: UserListParams): Promise<UserListResponse> {
  return invoke<UserListResponse>('list_users', { params });
}

/**
 * 更新用户
 */
export async function updateUser(id: number, input: UserUpdateInput): Promise<User> {
  return invoke<User>('update_user', { id, input });
}

/**
 * 删除用户 (软删除)
 */
export async function deleteUser(id: number): Promise<boolean> {
  return invoke<boolean>('delete_user', { id });
}

/**
 * 更新用户最后登录时间
 */
export async function updateLastLogin(userId: number): Promise<void> {
  return invoke('update_last_login', { userId });
}

// ==================== 角色 API ====================

/**
 * 创建角色
 */
export async function createRole(input: RoleCreateInput): Promise<Role> {
  return invoke<Role>('create_role', { input });
}

/**
 * 获取角色详情
 */
export async function getRole(id: number): Promise<Role> {
  return invoke<Role>('get_role', { id });
}

/**
 * 获取角色列表
 */
export async function listRoles(): Promise<Role[]> {
  return invoke<Role[]>('list_roles');
}

/**
 * 更新角色
 */
export async function updateRole(id: number, input: Partial<RoleCreateInput>): Promise<Role> {
  return invoke<Role>('update_role', { id, input });
}

/**
 * 删除角色
 */
export async function deleteRole(id: number): Promise<boolean> {
  return invoke<boolean>('delete_role', { id });
}

// ==================== 部门 API ====================

/**
 * 创建部门
 */
export async function createDepartment(input: DepartmentCreateInput): Promise<Department> {
  return invoke<Department>('create_department', { input });
}

/**
 * 获取部门详情
 */
export async function getDepartment(id: number): Promise<Department> {
  return invoke<Department>('get_department', { id });
}

/**
 * 获取部门列表
 */
export async function listDepartments(): Promise<Department[]> {
  return invoke<Department[]>('list_departments');
}

/**
 * 更新部门
 */
export async function updateDepartment(id: number, input: Partial<DepartmentCreateInput>): Promise<Department> {
  return invoke<Department>('update_department', { id, input });
}

/**
 * 删除部门
 */
export async function deleteDepartment(id: number): Promise<boolean> {
  return invoke<boolean>('delete_department', { id });
}

// ==================== 工具函数 ====================

/**
 * 获取当前登录用户 (从本地存储)
 */
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('current_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * 设置当前登录用户
 */
export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem('current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('current_user');
  }
}

/**
 * 获取认证 Token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * 设置认证 Token
 */
export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
