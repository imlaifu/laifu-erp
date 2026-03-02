// 用户管理模块 Zustand Store

import { create } from 'zustand';
import type { User, UserCreateInput, UserUpdateInput, UserListParams, Role, Department } from '../types/user';
import * as userService from '../services/userService';

interface UserState {
  // 当前用户
  currentUser: User | null;
  isAuthenticated: boolean;
  authToken: string | null;
  
  // 用户列表
  users: User[];
  userTotal: number;
  userListLoading: boolean;
  userListError: string | null;
  
  // 角色列表
  roles: Role[];
  rolesLoading: boolean;
  rolesError: string | null;
  
  // 部门列表
  departments: Department[];
  departmentsLoading: boolean;
  departmentsError: string | null;
  
  // 操作状态
  operationLoading: boolean;
  operationError: string | null;
  
  // Actions - 认证
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  
  // Actions - 用户 CRUD
  fetchUsers: (params?: UserListParams) => Promise<void>;
  fetchUser: (id: number) => Promise<User>;
  createUser: (input: UserCreateInput) => Promise<User>;
  updateUser: (id: number, input: UserUpdateInput) => Promise<User>;
  deleteUser: (id: number) => Promise<void>;
  
  // Actions - 角色
  fetchRoles: () => Promise<void>;
  
  // Actions - 部门
  fetchDepartments: () => Promise<void>;
  
  // Actions - 工具
  clearError: () => void;
  setCurrentUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial State
  currentUser: null,
  isAuthenticated: false,
  authToken: null,
  
  users: [],
  userTotal: 0,
  userListLoading: false,
  userListError: null,
  
  roles: [],
  rolesLoading: false,
  rolesError: null,
  
  departments: [],
  departmentsLoading: false,
  departmentsError: null,
  
  operationLoading: false,
  operationError: null,
  
  // Actions - 认证
  login: async (username: string, password: string) => {
    set({ operationLoading: true, operationError: null });
    try {
      const response = await userService.login({ username, password });
      userService.setCurrentUser(response.user);
      userService.setAuthToken(response.token);
      set({
        currentUser: response.user,
        isAuthenticated: true,
        authToken: response.token,
        operationLoading: false,
      });
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '登录失败',
      });
      throw error;
    }
  },
  
  logout: async () => {
    set({ operationLoading: true, operationError: null });
    try {
      await userService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      userService.setCurrentUser(null);
      userService.setAuthToken(null);
      set({
        currentUser: null,
        isAuthenticated: false,
        authToken: null,
        operationLoading: false,
      });
    }
  },
  
  checkAuth: async () => {
    const token = userService.getAuthToken();
    const user = userService.getCurrentUser();
    if (token && user) {
      set({
        currentUser: user,
        isAuthenticated: true,
        authToken: token,
      });
      return true;
    }
    return false;
  },
  
  // Actions - 用户 CRUD
  fetchUsers: async (params?: UserListParams) => {
    set({ userListLoading: true, userListError: null });
    try {
      const response = await userService.listUsers(params || {});
      set({
        users: response.users,
        userTotal: response.total,
        userListLoading: false,
      });
    } catch (error) {
      set({
        userListLoading: false,
        userListError: error instanceof Error ? error.message : '获取用户列表失败',
      });
    }
  },
  
  fetchUser: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      const user = await userService.getUser(id);
      set({ operationLoading: false });
      return user;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '获取用户详情失败',
      });
      throw error;
    }
  },
  
  createUser: async (input: UserCreateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const user = await userService.createUser(input);
      set({ operationLoading: false });
      // 刷新用户列表
      get().fetchUsers();
      return user;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '创建用户失败',
      });
      throw error;
    }
  },
  
  updateUser: async (id: number, input: UserUpdateInput) => {
    set({ operationLoading: true, operationError: null });
    try {
      const user = await userService.updateUser(id, input);
      set({ operationLoading: false });
      // 如果是当前用户，更新本地存储
      if (get().currentUser?.id === id) {
        userService.setCurrentUser(user);
        set({ currentUser: user });
      }
      // 刷新用户列表
      get().fetchUsers();
      return user;
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '更新用户失败',
      });
      throw error;
    }
  },
  
  deleteUser: async (id: number) => {
    set({ operationLoading: true, operationError: null });
    try {
      await userService.deleteUser(id);
      set({ operationLoading: false });
      // 刷新用户列表
      get().fetchUsers();
    } catch (error) {
      set({
        operationLoading: false,
        operationError: error instanceof Error ? error.message : '删除用户失败',
      });
      throw error;
    }
  },
  
  // Actions - 角色
  fetchRoles: async () => {
    set({ rolesLoading: true, rolesError: null });
    try {
      const roles = await userService.listRoles();
      set({ roles, rolesLoading: false });
    } catch (error) {
      set({
        rolesLoading: false,
        rolesError: error instanceof Error ? error.message : '获取角色列表失败',
      });
    }
  },
  
  // Actions - 部门
  fetchDepartments: async () => {
    set({ departmentsLoading: true, departmentsError: null });
    try {
      const departments = await userService.listDepartments();
      set({ departments, departmentsLoading: false });
    } catch (error) {
      set({
        departmentsLoading: false,
        departmentsError: error instanceof Error ? error.message : '获取部门列表失败',
      });
    }
  },
  
  // Actions - 工具
  clearError: () => {
    set({
      operationError: null,
      userListError: null,
      rolesError: null,
      departmentsError: null,
    });
  },
  
  setCurrentUser: (user: User | null) => {
    set({
      currentUser: user,
      isAuthenticated: !!user,
    });
  },
}));

// 导出选择器
export const selectCurrentUser = (state: UserState) => state.currentUser;
export const selectIsAuthenticated = (state: UserState) => state.isAuthenticated;
export const selectUsers = (state: UserState) => state.users;
export const selectUserTotal = (state: UserState) => state.userTotal;
export const selectRoles = (state: UserState) => state.roles;
export const selectDepartments = (state: UserState) => state.departments;
export const selectOperationLoading = (state: UserState) => state.operationLoading;
export const selectOperationError = (state: UserState) => state.operationError;
