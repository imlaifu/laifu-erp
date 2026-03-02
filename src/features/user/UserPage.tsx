// 用户管理模块 UI 组件

import React, { useState, useEffect } from 'react';
import { useUserStore, selectUsers, selectRoles, selectDepartments, selectOperationLoading } from '../stores/user';
import type { User, UserCreateInput, UserUpdateInput } from '../types/user';

export function UserPage() {
  const {
    users,
    userTotal,
    userListLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    fetchRoles,
    fetchDepartments,
    roles,
    departments,
    operationLoading,
    clearError,
  } = useUserStore();

  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<UserCreateInput | UserUpdateInput>>({
    username: '',
    email: '',
    password: '',
    displayName: '',
    phone: '',
    departmentId: undefined,
    roleId: undefined,
    status: 'active',
  });

  // 初始化加载
  useEffect(() => {
    fetchUsers({ limit: 50, offset: 0 });
    fetchRoles();
    fetchDepartments();
  }, []);

  // 处理创建用户
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData as UserCreateInput);
      setView('list');
      resetForm();
    } catch (error) {
      console.error('创建失败:', error);
    }
  };

  // 处理更新用户
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser.id, formData as UserUpdateInput);
      setView('list');
      resetForm();
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  // 处理删除用户
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此用户吗？')) return;
    try {
      await deleteUser(id);
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 编辑用户
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      displayName: user.displayName || '',
      phone: user.phone || '',
      departmentId: user.departmentId,
      roleId: user.roleId,
      status: user.status,
    });
    setView('edit');
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      displayName: '',
      phone: '',
      departmentId: undefined,
      roleId: undefined,
      status: 'active',
    });
    setSelectedUser(null);
  };

  // 渲染用户列表
  const renderUserList = () => (
    <div className="user-list">
      <div className="user-list-header">
        <h2>用户管理</h2>
        <button onClick={() => { resetForm(); setView('create'); }} className="btn-primary">
          + 新建用户
        </button>
      </div>

      {userListLoading ? (
        <div className="loading">加载中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>邮箱</th>
              <th>显示名称</th>
              <th>部门</th>
              <th>角色</th>
              <th>状态</th>
              <th>最后登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.displayName || '-'}</td>
                <td>
                  {user.departmentId
                    ? departments.find((d) => d.id === user.departmentId)?.name || '-'
                    : '-'}
                </td>
                <td>
                  {user.roleId
                    ? roles.find((r) => r.id === user.roleId)?.name || '-'
                    : '-'}
                </td>
                <td>
                  <span className={`status-badge status-${user.status}`}>
                    {user.status === 'active' && '✓ 启用'}
                    {user.status === 'inactive' && '○ 禁用'}
                    {user.status === 'suspended' && '⚠ 冻结'}
                  </span>
                </td>
                <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '-'}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(user)} className="btn-sm">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="btn-sm btn-danger">
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="user-list-footer">
        <span>共 {userTotal} 个用户</span>
      </div>
    </div>
  );

  // 渲染用户表单
  const renderUserForm = (isEdit: boolean) => (
    <div className="user-form">
      <div className="form-header">
        <h2>{isEdit ? '编辑用户' : '新建用户'}</h2>
        <button onClick={() => { resetForm(); setView('list'); }} className="btn-secondary">
          返回列表
        </button>
      </div>

      <form onSubmit={isEdit ? handleUpdate : handleCreate}>
        <div className="form-grid">
          <div className="form-group">
            <label>用户名 *</label>
            <input
              type="text"
              value={formData.username || ''}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={isEdit}
            />
          </div>

          <div className="form-group">
            <label>邮箱 *</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {!isEdit && (
            <div className="form-group">
              <label>密码 *</label>
              <input
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
          )}

          <div className="form-group">
            <label>显示名称</label>
            <input
              type="text"
              value={formData.displayName || ''}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>手机号</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>部门</label>
            <select
              value={formData.departmentId || ''}
              onChange={(e) =>
                setFormData({ ...formData, departmentId: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="">请选择部门</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>角色</label>
            <select
              value={formData.roleId || ''}
              onChange={(e) =>
                setFormData({ ...formData, roleId: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="">请选择角色</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>状态</label>
            <select
              value={formData.status || 'active'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'active' | 'inactive' | 'suspended',
                })
              }
            >
              <option value="active">✓ 启用</option>
              <option value="inactive">○ 禁用</option>
              <option value="suspended">⚠ 冻结</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={operationLoading}>
            {operationLoading ? '保存中...' : isEdit ? '更新' : '创建'}
          </button>
          <button type="button" onClick={() => { resetForm(); setView('list'); }} className="btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="user-page">
      {view === 'list' && renderUserList()}
      {view === 'create' && renderUserForm(false)}
      {view === 'edit' && renderUserForm(true)}
    </div>
  );
}

export default UserPage;
