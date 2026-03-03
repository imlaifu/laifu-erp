// Project Management Module UI Component
// 项目管理模块 UI 组件

import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../stores/project';
import type {
  ProjectCreateInput,
  ProjectUpdateInput,
  MilestoneCreateInput,
  ProjectTaskCreateInput,
  TimeEntryCreateInput,
  CostCreateInput,
  DocumentCreateInput,
  IssueCreateInput,
} from '../../types/project';
import {
  getProjectStatusName,
  getProjectPriorityName,
  getTaskStatusName,
  getMilestoneStatusName,
  formatBudget,
} from '../../services/projectService';

type ProjectView =
  | 'dashboard'
  | 'projects'
  | 'milestones'
  | 'tasks'
  | 'time'
  | 'costs'
  | 'documents'
  | 'issues'
  | 'members';

export function ProjectPage() {
  const {
    // Project state
    projects,
    projectsLoading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    fetchProject,
    currentProject,
    
    // Milestone state
    milestones,
    milestonesLoading,
    fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    
    // Task state
    tasks,
    tasksLoading,
    fetchTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    
    // Time entry state
    timeEntries,
    timeEntriesLoading,
    fetchTimeEntries,
    createTimeEntry,
    approveTimeEntry,
    
    // Cost state
    costs,
    costsLoading,
    fetchCosts,
    createCost,
    
    // Document state
    documents,
    documentsLoading,
    fetchDocuments,
    createDocument,
    
    // Issue state
    issues,
    issuesLoading,
    fetchIssues,
    createIssue,
    resolveIssue,
    
    // Member state
    members,
    membersLoading,
    fetchMembers,
    addMember,
    removeMember,
    
    // Statistics
    statistics,
    fetchStatistics,
    statsLoading,
  } = useProjectStore();

  const [view, setView] = useState<ProjectView>('dashboard');
  const [subView, setSubView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  // Form states
  const [projectForm, setProjectForm] = useState<Partial<ProjectCreateInput & ProjectUpdateInput>>({
    project_no: '',
    name: '',
    code: '',
    category: 'internal',
    type: 'development',
    description: '',
    priority: 'medium',
    status: 'planning',
    start_date: '',
    end_date: '',
    budget: 0,
    currency: 'CNY',
  });
  
  const [milestoneForm, setMilestoneForm] = useState<Partial<MilestoneCreateInput>>({
    milestone_no: '',
    name: '',
    description: '',
    planned_date: '',
  });
  
  const [taskForm, setTaskForm] = useState<Partial<ProjectTaskCreateInput>>({
    task_no: '',
    name: '',
    description: '',
    type: 'task',
    priority: 'medium',
    estimated_hours: 0,
    start_date: '',
    due_date: '',
  });
  
  const [timeEntryForm, setTimeEntryForm] = useState<Partial<TimeEntryCreateInput>>({
    employee_id: undefined,
    project_id: undefined,
    task_id: undefined,
    entry_date: new Date().toISOString().split('T')[0],
    duration_hours: 0,
    work_type: 'regular',
    billable: 1,
    description: '',
    work_category: 'development',
  });
  
  const [costForm, setCostForm] = useState<Partial<CostCreateInput>>({
    category: 'labor',
    name: '',
    description: '',
    planned_amount: 0,
    actual_amount: 0,
    currency: 'CNY',
  });
  
  const [documentForm, setDocumentForm] = useState<Partial<DocumentCreateInput>>({
    name: '',
    description: '',
    category: 'technical',
    document_type: 'doc',
    file_url: '',
    visibility: 'team',
  });
  
  const [issueForm, setIssueForm] = useState<Partial<IssueCreateInput>>({
    issue_no: '',
    title: '',
    description: '',
    type: 'issue',
    priority: 'medium',
    severity: 'medium',
  });
  
  const [memberForm, setMemberForm] = useState<{
    employee_id: number | undefined;
    role: string;
  }>({
    employee_id: undefined,
    role: 'developer',
  });

  // Initialize data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchStatistics();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      if (view === 'milestones') fetchMilestones(selectedProjectId);
      else if (view === 'tasks') fetchTasks(selectedProjectId);
      else if (view === 'time') fetchTimeEntries(selectedProjectId);
      else if (view === 'costs') fetchCosts(selectedProjectId);
      else if (view === 'documents') fetchDocuments(selectedProjectId);
      else if (view === 'issues') fetchIssues(selectedProjectId);
      else if (view === 'members') fetchMembers(selectedProjectId);
    }
  }, [view, selectedProjectId]);

  // Project handlers
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(projectForm as ProjectCreateInput, 1); // TODO: Get actual user ID
      setSubView('list');
      resetProjectForm();
      fetchProjects();
    } catch (error) {
      console.error('创建项目失败:', error);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;
    try {
      await updateProject(selectedItemId, projectForm as ProjectUpdateInput);
      setSubView('list');
      resetProjectForm();
      fetchProjects();
    } catch (error) {
      console.error('更新项目失败:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('确定要删除此项目吗？此操作不可恢复。')) return;
    try {
      await deleteProject(id);
      if (selectedProjectId === id) {
        setSelectedProjectId(null);
        setView('dashboard');
      }
      fetchProjects();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const handleSelectProject = async (id: number) => {
    setSelectedProjectId(id);
    await fetchProject(id);
  };

  const resetProjectForm = () => {
    setProjectForm({
      project_no: '',
      name: '',
      code: '',
      category: 'internal',
      type: 'development',
      description: '',
      priority: 'medium',
      status: 'planning',
      start_date: '',
      end_date: '',
      budget: 0,
      currency: 'CNY',
    });
  };

  // Milestone handlers
  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await createMilestone(selectedProjectId, milestoneForm as MilestoneCreateInput, 1);
      setMilestoneForm({ milestone_no: '', name: '', description: '', planned_date: '' });
      fetchMilestones(selectedProjectId);
    } catch (error) {
      console.error('创建里程碑失败:', error);
    }
  };

  const handleUpdateMilestoneStatus = async (id: number, status: string, completionPercentage: number) => {
    if (!selectedProjectId) return;
    try {
      const actualDate = status === 'completed' ? new Date().toISOString().split('T')[0] : null;
      await updateMilestone(id, status, actualDate, completionPercentage);
      fetchMilestones(selectedProjectId);
    } catch (error) {
      console.error('更新里程碑失败:', error);
    }
  };

  // Task handlers
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await createTask(selectedProjectId, taskForm as ProjectTaskCreateInput, 1);
      setTaskForm({ task_no: '', name: '', description: '', type: 'task', priority: 'medium', estimated_hours: 0 });
      fetchTasks(selectedProjectId);
    } catch (error) {
      console.error('创建任务失败:', error);
    }
  };

  const handleUpdateTaskStatus = async (id: number, status: string, progressPercentage: number) => {
    if (!selectedProjectId) return;
    try {
      await updateTaskStatus(id, status, progressPercentage);
      fetchTasks(selectedProjectId);
    } catch (error) {
      console.error('更新任务失败:', error);
    }
  };

  // Time entry handlers
  const handleCreateTimeEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await createTimeEntry({ ...timeEntryForm, project_id: selectedProjectId } as TimeEntryCreateInput);
      setTimeEntryForm({
        employee_id: undefined,
        project_id: undefined,
        task_id: undefined,
        entry_date: new Date().toISOString().split('T')[0],
        duration_hours: 0,
        work_type: 'regular',
        billable: 1,
        description: '',
        work_category: 'development',
      });
      fetchTimeEntries(selectedProjectId);
    } catch (error) {
      console.error('创建工时记录失败:', error);
    }
  };

  const handleApproveTimeEntry = async (id: number) => {
    if (!selectedProjectId) return;
    try {
      await approveTimeEntry(id, 1); // TODO: Get actual user ID
      fetchTimeEntries(selectedProjectId);
    } catch (error) {
      console.error('审批工时失败:', error);
    }
  };

  // Cost handlers
  const handleCreateCost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await createCost(selectedProjectId, costForm as CostCreateInput, 1);
      setCostForm({ category: 'labor', name: '', description: '', planned_amount: 0, actual_amount: 0, currency: 'CNY' });
      fetchCosts(selectedProjectId);
    } catch (error) {
      console.error('创建成本记录失败:', error);
    }
  };

  // Document handlers
  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await createDocument(selectedProjectId, documentForm as DocumentCreateInput, 1);
      setDocumentForm({ name: '', description: '', category: 'technical', document_type: 'doc', file_url: '', visibility: 'team' });
      fetchDocuments(selectedProjectId);
    } catch (error) {
      console.error('创建文档失败:', error);
    }
  };

  // Issue handlers
  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await createIssue(selectedProjectId, issueForm as IssueCreateInput, 1);
      setIssueForm({ issue_no: '', title: '', description: '', type: 'issue', priority: 'medium', severity: 'medium' });
      fetchIssues(selectedProjectId);
    } catch (error) {
      console.error('创建问题失败:', error);
    }
  };

  const handleResolveIssue = async (id: number) => {
    if (!selectedProjectId) return;
    const solution = prompt('请输入解决方案:');
    if (!solution) return;
    try {
      await resolveIssue(id, solution);
      fetchIssues(selectedProjectId);
    } catch (error) {
      console.error('解决问题失败:', error);
    }
  };

  // Member handlers
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !memberForm.employee_id) return;
    try {
      await addMember(selectedProjectId, memberForm.employee_id, memberForm.role, 1);
      setMemberForm({ employee_id: undefined, role: 'developer' });
      fetchMembers(selectedProjectId);
    } catch (error) {
      console.error('添加成员失败:', error);
    }
  };

  const handleRemoveMember = async (id: number) => {
    if (!selectedProjectId) return;
    if (!confirm('确定要移除此项目成员吗？')) return;
    try {
      await removeMember(id);
      fetchMembers(selectedProjectId);
    } catch (error) {
      console.error('移除成员失败:', error);
    }
  };

  // Render functions
  const renderDashboard = () => {
    if (statsLoading) return <div className="p-4">加载中...</div>;

    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">项目管理仪表板</h2>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">总项目数</h3>
            <p className="text-3xl font-bold">{statistics?.total_projects || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">进行中项目</h3>
            <p className="text-3xl font-bold text-blue-600">{statistics?.active_projects || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">已完成项目</h3>
            <p className="text-3xl font-bold text-green-600">{statistics?.completed_projects || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">总任务数</h3>
            <p className="text-3xl font-bold">{statistics?.total_tasks || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">已完成任务</h3>
            <p className="text-3xl font-bold text-green-600">{statistics?.completed_tasks || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">总工时</h3>
            <p className="text-3xl font-bold">{statistics?.total_hours_logged?.toFixed(1) || 0}h</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">总预算</h3>
            <p className="text-3xl font-bold text-blue-600">{formatBudget(statistics?.total_budget || 0)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">实际成本</h3>
            <p className="text-3xl font-bold text-red-600">{formatBudget(statistics?.total_actual_cost || 0)}</p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">最近项目</h3>
          {projectsLoading ? (
            <p>加载中...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">项目编号</th>
                  <th className="text-left py-2">项目名称</th>
                  <th className="text-left py-2">状态</th>
                  <th className="text-left py-2">优先级</th>
                  <th className="text-left py-2">进度</th>
                  <th className="text-left py-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 10).map((project) => (
                  <tr key={project.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{project.project_no}</td>
                    <td className="py-2">{project.name}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getProjectStatusName(project.status)}
                      </span>
                    </td>
                    <td className="py-2">{getProjectPriorityName(project.priority)}</td>
                    <td className="py-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress_percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{project.progress_percentage}%</span>
                    </td>
                    <td className="py-2">
                      <button 
                        onClick={() => { handleSelectProject(project.id); setView('tasks'); }}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (subView === 'create' || subView === 'edit') {
      return (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{subView === 'create' ? '创建项目' : '编辑项目'}</h2>
          <form onSubmit={subView === 'create' ? handleCreateProject : handleUpdateProject} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-1">项目编号</label>
              <input
                type="text"
                value={projectForm.project_no || ''}
                onChange={(e) => setProjectForm({ ...projectForm, project_no: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">项目名称</label>
              <input
                type="text"
                value={projectForm.name || ''}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">项目代码</label>
                <input
                  type="text"
                  value={projectForm.code || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, code: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">分类</label>
                <select
                  value={projectForm.category || 'internal'}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="internal">内部项目</option>
                  <option value="external">外部项目</option>
                  <option value="research">研发项目</option>
                  <option value="product">产品项目</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">类型</label>
                <select
                  value={projectForm.type || 'development'}
                  onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="development">开发</option>
                  <option value="consulting">咨询</option>
                  <option value="maintenance">维护</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">优先级</label>
                <select
                  value={projectForm.priority || 'medium'}
                  onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                  <option value="critical">紧急</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">描述</label>
              <textarea
                value={projectForm.description || ''}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">开始日期</label>
                <input
                  type="date"
                  value={projectForm.start_date || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">结束日期</label>
                <input
                  type="date"
                  value={projectForm.end_date || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, end_date: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">预算</label>
                <input
                  type="number"
                  value={projectForm.budget || 0}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: parseFloat(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">货币</label>
                <select
                  value={projectForm.currency || 'CNY'}
                  onChange={(e) => setProjectForm({ ...projectForm, currency: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="CNY">人民币 (¥)</option>
                  <option value="USD">美元 ($)</option>
                  <option value="EUR">欧元 (€)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {subView === 'create' ? '创建' : '保存'}
              </button>
              <button 
                type="button" 
                onClick={() => { setSubView('list'); resetProjectForm(); }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">项目列表</h2>
          <button 
            onClick={() => setSubView('create')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + 新建项目
          </button>
        </div>
        
        {projectsLoading ? (
          <p>加载中...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getProjectStatusName(project.status)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{project.project_no}</p>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{project.description}</p>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>进度</span>
                    <span>{project.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${project.progress_percentage}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>优先级：{getProjectPriorityName(project.priority)}</span>
                  <span>预算：{formatBudget(project.budget, project.currency)}</span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => { handleSelectProject(project.id); setView('tasks'); }}
                    className="flex-1 bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                  >
                    任务
                  </button>
                  <button 
                    onClick={() => { handleSelectProject(project.id); setSubView('edit'); setSelectedItemId(project.id); setProjectForm(project); }}
                    className="flex-1 bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 text-sm"
                  >
                    编辑
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="flex-1 bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMilestones = () => {
    if (!selectedProjectId) {
      return (
        <div className="p-4 text-center text-gray-500">
          <p>请先选择一个项目</p>
          <button 
            onClick={() => setView('projects')}
            className="mt-2 text-blue-600 hover:underline"
          >
            返回项目列表
          </button>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">里程碑管理</h2>
            <p className="text-gray-500">项目：{currentProject?.name}</p>
          </div>
          <button 
            onClick={() => setView('projects')}
            className="text-blue-600 hover:underline"
          >
            ← 返回项目
          </button>
        </div>
        
        <form onSubmit={handleCreateMilestone} className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">添加里程碑</h3>
          <div className="grid grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="里程碑编号"
              value={milestoneForm.milestone_no || ''}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, milestone_no: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="里程碑名称"
              value={milestoneForm.name || ''}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="date"
              value={milestoneForm.planned_date || ''}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, planned_date: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              添加
            </button>
          </div>
        </form>
        
        {milestonesLoading ? (
          <p>加载中...</p>
        ) : (
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{milestone.name}</h3>
                    <p className="text-sm text-gray-500">{milestone.milestone_no} | 计划：{milestone.planned_date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                      milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getMilestoneStatusName(milestone.status)}
                    </span>
                    <select
                      value={milestone.status}
                      onChange={(e) => handleUpdateMilestoneStatus(milestone.id, e.target.value, e.target.value === 'completed' ? 100 : milestone.completion_percentage)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="pending">待开始</option>
                      <option value="in_progress">进行中</option>
                      <option value="completed">已完成</option>
                    </select>
                    <button 
                      onClick={() => deleteMilestone(milestone.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTasks = () => {
    if (!selectedProjectId) {
      return (
        <div className="p-4 text-center text-gray-500">
          <p>请先选择一个项目</p>
          <button 
            onClick={() => setView('projects')}
            className="mt-2 text-blue-600 hover:underline"
          >
            返回项目列表
          </button>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">任务管理</h2>
            <p className="text-gray-500">项目：{currentProject?.name}</p>
          </div>
          <button 
            onClick={() => setView('projects')}
            className="text-blue-600 hover:underline"
          >
            ← 返回项目
          </button>
        </div>
        
        <form onSubmit={handleCreateTask} className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">添加任务</h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="任务编号"
              value={taskForm.task_no || ''}
              onChange={(e) => setTaskForm({ ...taskForm, task_no: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="任务名称"
              value={taskForm.name || ''}
              onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="预估工时 (小时)"
              value={taskForm.estimated_hours || 0}
              onChange={(e) => setTaskForm({ ...taskForm, estimated_hours: parseFloat(e.target.value) })}
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              value={taskForm.start_date || ''}
              onChange={(e) => setTaskForm({ ...taskForm, start_date: e.target.value })}
              className="border rounded px-3 py-2"
              placeholder="开始日期"
            />
            <input
              type="date"
              value={taskForm.due_date || ''}
              onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
              className="border rounded px-3 py-2"
              placeholder="截止日期"
            />
            <select
              value={taskForm.priority || 'medium'}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
              <option value="critical">紧急</option>
            </select>
          </div>
          <textarea
            placeholder="任务描述"
            value={taskForm.description || ''}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            className="w-full border rounded px-3 py-2 mt-3"
            rows={2}
          />
          <button type="submit" className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            添加任务
          </button>
        </form>
        
        {tasksLoading ? (
          <p>加载中...</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{task.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'done' ? 'bg-green-100 text-green-800' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getTaskStatusName(task.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{task.task_no} | 预估：{task.estimated_hours}h | 截止：{task.due_date || '无'}</p>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value, e.target.value === 'done' ? 100 : task.progress_percentage)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="todo">待办</option>
                      <option value="in_progress">进行中</option>
                      <option value="review">审核中</option>
                      <option value="testing">测试中</option>
                      <option value="done">已完成</option>
                      <option value="blocked">已阻塞</option>
                    </select>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTimeEntries = () => {
    if (!selectedProjectId) {
      return (
        <div className="p-4 text-center text-gray-500">
          <p>请先选择一个项目</p>
          <button onClick={() => setView('projects')} className="mt-2 text-blue-600 hover:underline">
            返回项目列表
          </button>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">工时记录</h2>
            <p className="text-gray-500">项目：{currentProject?.name}</p>
          </div>
          <button onClick={() => setView('projects')} className="text-blue-600 hover:underline">
            ← 返回项目
          </button>
        </div>
        
        <form onSubmit={handleCreateTimeEntry} className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">记录工时</h3>
          <div className="grid grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="员工 ID"
              value={timeEntryForm.employee_id || ''}
              onChange={(e) => setTimeEntryForm({ ...timeEntryForm, employee_id: parseInt(e.target.value) })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="date"
              value={timeEntryForm.entry_date || ''}
              onChange={(e) => setTimeEntryForm({ ...timeEntryForm, entry_date: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="工时 (小时)"
              value={timeEntryForm.duration_hours || 0}
              onChange={(e) => setTimeEntryForm({ ...timeEntryForm, duration_hours: parseFloat(e.target.value) })}
              className="border rounded px-3 py-2"
              step="0.5"
              required
            />
            <select
              value={timeEntryForm.work_category || 'development'}
              onChange={(e) => setTimeEntryForm({ ...timeEntryForm, work_category: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="development">开发</option>
              <option value="design">设计</option>
              <option value="testing">测试</option>
              <option value="meeting">会议</option>
              <option value="documentation">文档</option>
              <option value="other">其他</option>
            </select>
          </div>
          <textarea
            placeholder="工作内容描述"
            value={timeEntryForm.description || ''}
            onChange={(e) => setTimeEntryForm({ ...timeEntryForm, description: e.target.value })}
            className="w-full border rounded px-3 py-2 mt-3"
            rows={2}
            required
          />
          <button type="submit" className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            提交工时
          </button>
        </form>
        
        {timeEntriesLoading ? (
          <p>加载中...</p>
        ) : (
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">日期</th>
                <th className="text-left py-2 px-4">员工 ID</th>
                <th className="text-left py-2 px-4">工时</th>
                <th className="text-left py-2 px-4">工作类型</th>
                <th className="text-left py-2 px-4">描述</th>
                <th className="text-left py-2 px-4">状态</th>
                <th className="text-left py-2 px-4">操作</th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{entry.entry_date}</td>
                  <td className="py-2 px-4">{entry.employee_id}</td>
                  <td className="py-2 px-4">{entry.duration_hours}h</td>
                  <td className="py-2 px-4">{entry.work_category || 'regular'}</td>
                  <td className="py-2 px-4">{entry.description}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      entry.status === 'approved' ? 'bg-green-100 text-green-800' :
                      entry.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {entry.status === 'submitted' && (
                      <button 
                        onClick={() => handleApproveTimeEntry(entry.id)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        审批
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const renderCosts = () => {
    if (!selectedProjectId) {
      return (
        <div className="p-4 text-center text-gray-500">
          <p>请先选择一个项目</p>
          <button onClick={() => setView('projects')} className="mt-2 text-blue-600 hover:underline">
            返回项目列表
          </button>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">项目成本</h2>
            <p className="text-gray-500">项目：{currentProject?.name}</p>
          </div>
          <button onClick={() => setView('projects')} className="text-blue-600 hover:underline">
            ← 返回项目
          </button>
        </div>
        
        <form onSubmit={handleCreateCost} className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">添加成本</h3>
          <div className="grid grid-cols-4 gap-4">
            <select
              value={costForm.category || 'labor'}
              onChange={(e) => setCostForm({ ...costForm, category: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="labor">人力</option>
              <option value="material">材料</option>
              <option value="equipment">设备</option>
              <option value="travel">差旅</option>
              <option value="service">服务</option>
              <option value="other">其他</option>
            </select>
            <input
              type="text"
              placeholder="成本名称"
              value={costForm.name || ''}
              onChange={(e) => setCostForm({ ...costForm, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="预算金额"
              value={costForm.planned_amount || 0}
              onChange={(e) => setCostForm({ ...costForm, planned_amount: parseFloat(e.target.value) })}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="实际金额"
              value={costForm.actual_amount || 0}
              onChange={(e) => setCostForm({ ...costForm, actual_amount: parseFloat(e.target.value) })}
              className="border rounded px-3 py-2"
            />
          </div>
          <button type="submit" className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            添加成本
          </button>
        </form>
        
        {costsLoading ? (
          <p>加载中...</p>
        ) : (
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">名称</th>
                <th className="text-left py-2">分类</th>
                <th className="text-left py-2">预算</th>
                <th className="text-left py-2">实际</th>
                <th className="text-left py-2">状态</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost) => (
                <tr key={cost.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{cost.name}</td>
                  <td className="py-2">{cost.category}</td>
                  <td className="py-2">{formatBudget(cost.planned_amount, cost.currency)}</td>
                  <td className="py-2">{formatBudget(cost.actual_amount, cost.currency)}</td>
                  <td className="py-2">{cost.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const renderDocuments = () => {
    if (!selectedProjectId) {
      return (
        <div className="p-4 text-center text-gray-500">
          <p>请先选择一个项目</p>
          <button onClick={() => setView('projects')} className="mt-2 text-blue-600 hover:underline">
            返回项目列表
          </button>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">项目文档</h2>
            <p className="text-gray-500">项目：{currentProject?.name}</p>
          </div>
          <button onClick={() => setView('projects')} className="text-blue-600 hover:underline">
            ← 返回项目
          </button>
        </div>
        
        <form onSubmit={handleCreateDocument} className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">上传文档</h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="文档名称"
              value={documentForm.name || ''}
              onChange={(e) => setDocumentForm({ ...documentForm, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={documentForm.category || 'technical'}
              onChange={(e) => setDocumentForm({ ...documentForm, category: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="requirement">需求</option>
              <option value="design">设计</option>
              <option value="technical">技术</option>
              <option value="user_manual">用户手册</option>
              <option value="meeting_note">会议纪要</option>
              <option value="report">报告</option>
            </select>
            <input
              type="text"
              placeholder="文件 URL"
              value={documentForm.file_url || ''}
              onChange={(e) => setDocumentForm({ ...documentForm, file_url: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          <button type="submit" className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            上传文档
          </button>
        </form>
        
        {documentsLoading ? (
          <p>加载中...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold">{doc.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{doc.category} | v{doc.version}</p>
                <a 
                  href={doc.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  下载文档
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderIssues = () => {
    if (!selectedProjectId) {
      return (
        <div className="p-4 text-center text-gray-500">
          <p>请先选择一个项目</p>
          <button onClick={() => setView('projects')} className="mt-2 text-blue-600 hover:underline">
            返回项目列表
          </button>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">问题与风险</h2>
            <p className="text-gray-500">项目：{currentProject?.name}</p>
          </div>
          <button onClick={() => setView('projects')} className="text-blue-600 hover:underline">
            ← 返回项目
          </button>
        </div>
        
        <form onSubmit={handleCreateIssue} className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">报告问题</h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="问题编号"
              value={issueForm.issue_no || ''}
              onChange={(e) => setIssueForm({ ...issueForm, issue_no: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="问题标题"
              value={issueForm.title || ''}
              onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={issueForm.priority || 'medium'}
              onChange={(e) => setIssueForm({ ...issueForm, priority: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
              <option value="critical">紧急</option>
            </select>
          </div>
          <textarea
            placeholder="问题描述"
            value={issueForm.description || ''}
            onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
            className="w-full border rounded px-3 py-2 mt-3"
            rows={3}
            required
          />
          <button type="submit" className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            提交问题
          </button>
        </form>
        
        {issuesLoading ? (
          <p>加载中...</p>
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{issue.title}</h3>
                    <p className="text-sm text-gray-500">{issue.issue_no} | 优先级：{issue.priority}</p>
                    <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                    {issue.solution && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <p className="text-sm text-green-800"><strong>解决方案:</strong> {issue.solution}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    {issue.status !== 'resolved' && (
                      <button 
                        onClick={() => handleResolveIssue(issue.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        解决
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMembers = () => {
    if (!selectedProjectId) {
      return (
        <div className="p-4 text-center text-gray-500">
          <p>请先选择一个项目</p>
          <button onClick={() => setView('projects')} className="mt-2 text-blue-600 hover:underline">
            返回项目列表
          </button>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">项目成员</h2>
            <p className="text-gray-500">项目：{currentProject?.name}</p>
          </div>
          <button onClick={() => setView('projects')} className="text-blue-600 hover:underline">
            ← 返回项目
          </button>
        </div>
        
        <form onSubmit={handleAddMember} className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-3">添加成员</h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="员工 ID"
              value={memberForm.employee_id || ''}
              onChange={(e) => setMemberForm({ ...memberForm, employee_id: parseInt(e.target.value) })}
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={memberForm.role || 'developer'}
              onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="owner">负责人</option>
              <option value="manager">项目经理</option>
              <option value="developer">开发</option>
              <option value="designer">设计</option>
              <option value="tester">测试</option>
              <option value="analyst">分析</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              添加
            </button>
          </div>
        </form>
        
        {membersLoading ? (
          <p>加载中...</p>
        ) : (
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">员工 ID</th>
                <th className="text-left py-2">角色</th>
                <th className="text-left py-2">加入时间</th>
                <th className="text-left py-2">状态</th>
                <th className="text-left py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{member.employee_id}</td>
                  <td className="py-2">{member.role}</td>
                  <td className="py-2">{member.joined_at}</td>
                  <td className="py-2">{member.status}</td>
                  <td className="py-2">
                    <button 
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      移除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">📋 项目管理</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap ${
                view === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 仪表板
            </button>
            <button
              onClick={() => setView('projects')}
              className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap ${
                view === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📁 项目列表
            </button>
            <button
              onClick={() => setView('milestones')}
              className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap ${
                view === 'milestones'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              disabled={!selectedProjectId}
            >
              🚩 里程碑
            </button>
            <button
              onClick={() => setView('tasks')}
              className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap ${
                view === 'tasks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              disabled={!selectedProjectId}
            >
              ✅ 任务
            </button>
            <button
              onClick={() => setView('time')}
              className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap ${
                view === 'time'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              disabled={!selectedProjectId}
            >
              ⏱️ 工时
            </button>
            <button
              onClick={() => setView('costs')}
              className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap ${
                view === 'costs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              disabled={!selectedProjectId}
            >
              💰 成本
            </button>
            <button
              onClick={() => setView('documents')}
              className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap ${
                view === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              disabled={!selectedProjectId}
            >
              📄 文档
            </button>
            <button
              onClick={() => setView('issues')}
              className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap ${
                view === 'issues'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              disabled={!selectedProjectId}
            >
              ⚠️ 问题
            </button>
            <button
              onClick={() => setView('members')}
              className={`px-4 py-3 border-b-2 font-medium whitespace-nowrap ${
                view === 'members'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              disabled={!selectedProjectId}
            >
              👥 成员
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto">
        {view === 'dashboard' && renderDashboard()}
        {view === 'projects' && renderProjects()}
        {view === 'milestones' && renderMilestones()}
        {view === 'tasks' && renderTasks()}
        {view === 'time' && renderTimeEntries()}
        {view === 'costs' && renderCosts()}
        {view === 'documents' && renderDocuments()}
        {view === 'issues' && renderIssues()}
        {view === 'members' && renderMembers()}
      </main>
    </div>
  );
}
