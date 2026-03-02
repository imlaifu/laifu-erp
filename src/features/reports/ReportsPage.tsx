// ============================================================
// 报表管理模块 - 主页面组件
// 创建时间：2026-03-03
// ============================================================

import React, { useState, useEffect } from 'react';
import { useReportsStore } from '../../stores/reports';
import type { ReportDefinition, ReportCategory } from '../../types/reports';

// ============================================================
// 样式
// ============================================================

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,
  
  header: {
    marginBottom: '24px',
  } as React.CSSProperties,
  
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '8px',
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '14px',
    color: '#666',
  } as React.CSSProperties,
  
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '8px',
  } as React.CSSProperties,
  
  tab: {
    padding: '10px 20px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    borderRadius: '6px 6px 0 0',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  
  activeTab: {
    background: '#3b82f6',
    color: 'white',
  } as React.CSSProperties,
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,
  
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  } as React.CSSProperties,
  
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  } as React.CSSProperties,
  
  cardCategory: {
    fontSize: '12px',
    padding: '4px 8px',
    background: '#f3f4f6',
    borderRadius: '4px',
    color: '#666',
  } as React.CSSProperties,
  
  cardDescription: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.5',
  } as React.CSSProperties,
  
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  
  primaryButton: {
    background: '#3b82f6',
    color: 'white',
  } as React.CSSProperties,
  
  secondaryButton: {
    background: '#f3f4f6',
    color: '#374151',
  } as React.CSSProperties,
  
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  } as React.CSSProperties,
  
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    fontSize: '14px',
    color: '#666',
  } as React.CSSProperties,
  
  empty: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#666',
  } as React.CSSProperties,
  
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  } as React.CSSProperties,
  
  metricCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,
  
  metricValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '4px',
  } as React.CSSProperties,
  
  metricLabel: {
    fontSize: '14px',
    color: '#666',
  } as React.CSSProperties,
  
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  } as React.CSSProperties,
  
  th: {
    textAlign: 'left' as const,
    padding: '12px',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: '600',
    color: '#374151',
  } as React.CSSProperties,
  
  td: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    color: '#1a1a1a',
  } as React.CSSProperties,
  
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
  } as React.CSSProperties,
  
  successBadge: {
    background: '#dcfce7',
    color: '#166534',
  } as React.CSSProperties,
  
  warningBadge: {
    background: '#fef3c7',
    color: '#92400e',
  } as React.CSSProperties,
};

// ============================================================
// 主组件
// ============================================================

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'saved'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');
  const [selectedReport, setSelectedReport] = useState<ReportDefinition | null>(null);
  const [reportResult, setReportResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const {
    reportDefinitions,
    loadingDefinitions,
    dashboardWidgets,
    savedReports,
    loadingDashboard,
    loadingSavedReports,
    fetchReportDefinitions,
    fetchDashboardWidgets,
    fetchSavedReports,
    executeReport,
    refreshDashboardData,
  } = useReportsStore();

  // 模拟当前用户 ID (实际应从认证状态获取)
  const currentUserId = 'current-user-id';

  // 初始化加载
  useEffect(() => {
    fetchReportDefinitions();
    fetchDashboardWidgets(currentUserId);
    fetchSavedReports(currentUserId);
  }, []);

  // 刷新 Dashboard 数据
  useEffect(() => {
    if (activeTab === 'dashboard') {
      refreshDashboardData(currentUserId);
    }
  }, [activeTab]);

  // 执行报表
  const handleExecuteReport = async (report: ReportDefinition) => {
    setIsExecuting(true);
    try {
      const result = await executeReport(report.id, {}, currentUserId);
      setReportResult(result);
      setSelectedReport(report);
    } catch (error) {
      console.error('执行报表失败:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  // 获取分类标签颜色
  const getCategoryColor = (category: ReportCategory) => {
    const colors: Record<ReportCategory, string> = {
      dashboard: '#3b82f6',
      sales: '#10b981',
      inventory: '#f59e0b',
      finance: '#8b5cf6',
    };
    return colors[category] || '#6b7280';
  };

  // 获取分类中文名称
  const getCategoryName = (category: ReportCategory) => {
    const names: Record<ReportCategory, string> = {
      dashboard: '仪表盘',
      sales: '销售',
      inventory: '库存',
      finance: '财务',
    };
    return names[category] || category;
  };

  // 过滤报表定义
  const filteredDefinitions = selectedCategory === 'all'
    ? reportDefinitions
    : reportDefinitions.filter((r) => r.category === selectedCategory);

  // ============================================================
  // 渲染 Dashboard 标签页
  // ============================================================

  const renderDashboard = () => {
    if (loadingDashboard) {
      return <div style={styles.loading}>加载中...</div>;
    }

    return (
      <div>
        {/* 指标卡片 */}
        <div style={styles.dashboardGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>今日销售</div>
            <div style={styles.metricValue}>¥0</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>待处理订单</div>
            <div style={styles.metricValue}>0</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>库存预警</div>
            <div style={styles.metricValue}>0</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>本月收支</div>
            <div style={styles.metricValue}>¥0</div>
          </div>
        </div>

        {/* Widgets 网格 */}
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>Dashboard Widgets</h3>
        {dashboardWidgets.length === 0 ? (
          <div style={styles.empty}>暂无 Widgets，请添加</div>
        ) : (
          <div style={styles.grid}>
            {dashboardWidgets.filter((w) => w.is_visible).map((widget) => (
              <div key={widget.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>{widget.title}</span>
                  <span style={{ ...styles.cardCategory, background: getCategoryColor('dashboard') + '20', color: getCategoryColor('dashboard') }}>
                    {widget.widget_type}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  刷新间隔：{widget.refresh_interval}秒
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // 渲染报表列表标签页
  // ============================================================

  const renderReports = () => {
    if (loadingDefinitions) {
      return <div style={styles.loading}>加载报表定义...</div>;
    }

    return (
      <div>
        {/* 分类筛选 */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            style={{
              ...styles.button,
              ...(selectedCategory === 'all' ? styles.primaryButton : styles.secondaryButton),
            }}
            onClick={() => setSelectedCategory('all')}
          >
            全部
          </button>
          {(['dashboard', 'sales', 'inventory', 'finance'] as ReportCategory[]).map((cat) => (
            <button
              key={cat}
              style={{
                ...styles.button,
                ...(selectedCategory === cat ? styles.primaryButton : styles.secondaryButton),
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {getCategoryName(cat)}
            </button>
          ))}
        </div>

        {/* 报表列表 */}
        {filteredDefinitions.length === 0 ? (
          <div style={styles.empty}>暂无报表</div>
        ) : (
          <div style={styles.grid}>
            {filteredDefinitions.map((report) => (
              <div key={report.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>{report.name}</span>
                  <span
                    style={{
                      ...styles.cardCategory,
                      background: getCategoryColor(report.category) + '20',
                      color: getCategoryColor(report.category),
                    }}
                  >
                    {getCategoryName(report.category)}
                  </span>
                </div>
                {report.description && (
                  <div style={styles.cardDescription}>{report.description}</div>
                )}
                <div style={styles.buttonGroup}>
                  <button
                    style={{ ...styles.button, ...styles.primaryButton }}
                    onClick={() => handleExecuteReport(report)}
                    disabled={isExecuting || !report.is_active}
                  >
                    {isExecuting && selectedReport?.id === report.id ? '执行中...' : '执行报表'}
                  </button>
                  {!report.is_active && (
                    <span style={{ ...styles.badge, ...styles.warningBadge }}>未激活</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 报表结果 */}
        {reportResult && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
              执行结果 - {selectedReport?.name}
            </h3>
            <div style={{ ...styles.card, overflow: 'auto' }}>
              <div style={{ marginBottom: '12px', fontSize: '13px', color: '#666' }}>
                记录数：{reportResult.result_count} | 执行时间：{reportResult.execution_time_ms}ms
              </div>
              {reportResult.data && reportResult.data.length > 0 ? (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {Object.keys(reportResult.data[0]).map((key) => (
                        <th key={key} style={styles.th}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportResult.data.slice(0, 10).map((row: any, idx: number) => (
                      <tr key={idx}>
                        {Object.values(row).map((value: any, i: number) => (
                          <td key={i} style={styles.td}>
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={styles.empty}>无数据</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // 渲染保存的报表标签页
  // ============================================================

  const renderSavedReports = () => {
    if (loadingSavedReports) {
      return <div style={styles.loading}>加载保存的报表...</div>;
    }

    return (
      <div>
        {savedReports.length === 0 ? (
          <div style={styles.empty}>暂无保存的报表</div>
        ) : (
          <div style={styles.grid}>
            {savedReports.map((report) => (
              <div key={report.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardTitle}>
                    {report.is_favorite && '⭐ '}{report.name}
                  </span>
                  {report.is_public && (
                    <span style={{ ...styles.badge, ...styles.successBadge }}>公开</span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                  执行次数：{report.execution_count}
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    style={{ ...styles.button, ...styles.primaryButton }}
                    onClick={async () => {
                      try {
                        setIsExecuting(true);
                        const result = await executeReport(report.report_definition_id || '', {}, currentUserId);
                        setReportResult(result);
                      } catch (error) {
                        console.error('执行失败:', error);
                      } finally {
                        setIsExecuting(false);
                      }
                    }}
                  >
                    执行
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // 主渲染
  // ============================================================

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 报表管理</h1>
        <p style={styles.subtitle}>查看和分析业务数据</p>
      </div>

      {/* 标签页导航 */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'dashboard' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('dashboard')}
        >
          📈 仪表盘
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'reports' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('reports')}
        >
          📋 报表列表
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'saved' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('saved')}
        >
          💾 保存的报表
        </button>
      </div>

      {/* 标签页内容 */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'reports' && renderReports()}
      {activeTab === 'saved' && renderSavedReports()}
    </div>
  );
}

export default ReportsPage;
