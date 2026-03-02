// 用户管理模块 TypeScript 类型定义

export interface User {
  id: number;
  username: string;
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  departmentId?: number | null;
  roleId?: number | null;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateInput {
  username: string;
  email: string;
  password: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  departmentId?: number | null;
  roleId?: number | null;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  password?: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  departmentId?: number | null;
  roleId?: number | null;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface Role {
  id: number;
  name: string;
  description?: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleCreateInput {
  name: string;
  description?: string | null;
  permissions?: string[];
}

export interface Department {
  id: number;
  name: string;
  parentId?: number | null;
  managerId?: number | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentCreateInput {
  name: string;
  parentId?: number | null;
  managerId?: number | null;
  description?: string | null;
}

export interface UserSession {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface UserListParams {
  limit?: number;
  offset?: number;
  status?: 'active' | 'inactive' | 'suspended';
  departmentId?: number;
  roleId?: number;
  search?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  limit: number;
  offset: number;
}
