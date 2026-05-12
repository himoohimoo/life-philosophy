import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { isAdmin, getAllUsersStats, getAllTestRecords, getGlobalStats } from '../utils/auth';
import { mbtiTypes } from '../data/mbtiData';

function AdminDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview'); // overview | users | records
  const [globalStats, setGlobalStats] = useState(null);
  const [usersStats, setUsersStats] = useState([]);
  const [allRecords, setAllRecords] = useState([]);

  useEffect(() => {
    if (isAdmin(user)) {
      refreshData();
    }
  }, [user]);

  const refreshData = () => {
    setGlobalStats(getGlobalStats());
    setUsersStats(getAllUsersStats());
    setAllRecords(getAllTestRecords());
  };

  // 非管理员禁止访问
  if (!isAdmin(user)) {
    return (
      <div className="page-enter">
        <div className="page-container" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '4rem' }}>🔒</span>
          <h2 style={{ marginTop: '16px' }}>权限不足</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>
            仅管理员（admin）可访问此页面
          </p>
          <Link to="/" className="mbti-btn primary" style={{ textDecoration: 'none' }}>← 返回首页</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Breadcrumb />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title" style={{ textAlign: 'left', fontSize: '2rem', marginBottom: '4px' }}>
              🛡️ 管理员面板
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              管理员：<strong style={{ color: 'var(--accent-cyan)' }}>{user}</strong>
            </p>
          </div>
          <button className="mbti-btn secondary" onClick={refreshData}>
            🔄 刷新数据
          </button>
        </div>

        {/* 标签切换 */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 数据概览
          </button>
          <button
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 用户统计
          </button>
          <button
            className={`admin-tab ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            📋 全部记录
          </button>
        </div>

        {/* 概览 */}
        {activeTab === 'overview' && globalStats && (
          <div className="admin-overview">
            <div className="stat-card">
              <div className="stat-number">{globalStats.totalUsers}</div>
              <div className="stat-label">注册用户</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{globalStats.totalTests}</div>
              <div className="stat-label">总测试次数</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{globalStats.avgTestsPerUser}</div>
              <div className="stat-label">人均测试</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{Object.keys(globalStats.typeDistribution).length}</div>
              <div className="stat-label">覆盖类型</div>
            </div>

            {/* 类型分布 */}
            <div className="admin-section">
              <h2 className="admin-section-title">📊 MBTI 类型分布</h2>
              {Object.keys(globalStats.typeDistribution).length === 0 ? (
                <p className="admin-empty">暂无测试数据</p>
              ) : (
                <div className="type-distribution">
                  {Object.entries(globalStats.typeDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => {
                      const typeInfo = mbtiTypes[type];
                      const pct = globalStats.totalTests > 0
                        ? ((count / globalStats.totalTests) * 100).toFixed(1)
                        : 0;
                      return (
                        <div key={type} className="type-bar-row">
                          <div className="type-bar-label">
                            <span className="type-badge" style={{ background: typeInfo?.color || '#666' }}>
                              {type}
                            </span>
                            <span className="type-name">{typeInfo?.name || ''}</span>
                          </div>
                          <div className="type-bar-track">
                            <div
                              className="type-bar-fill"
                              style={{
                                width: `${pct}%`,
                                background: typeInfo?.color || '#666',
                              }}
                            />
                          </div>
                          <div className="type-bar-value">
                            {count}次 ({pct}%)
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 用户统计 */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <h2 className="admin-section-title">👥 用户测试统计</h2>
            {usersStats.length === 0 ? (
              <p className="admin-empty">暂无注册用户</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>用户名</th>
                      <th>注册时间</th>
                      <th>测试次数</th>
                      <th>最近测试</th>
                      <th>主要类型</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersStats.map(u => {
                      const typeInfo = mbtiTypes[u.topType];
                      return (
                        <tr key={u.username}>
                          <td>
                            <span className="table-username">
                              <span className="table-avatar">{u.username.charAt(0).toUpperCase()}</span>
                              {u.username}
                              {isAdmin(u.username) && <span className="admin-badge">管理员</span>}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString('zh-CN')}</td>
                          <td><strong style={{ color: 'var(--accent-cyan)' }}>{u.totalTests}</strong></td>
                          <td>{u.lastTestAt ? new Date(u.lastTestAt).toLocaleString('zh-CN') : '—'}</td>
                          <td>
                            {u.topType ? (
                              <span className="type-badge" style={{ background: typeInfo?.color || '#666' }}>
                                {u.topType} · {typeInfo?.name || ''}
                              </span>
                            ) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 全部记录 */}
        {activeTab === 'records' && (
          <div className="admin-section">
            <h2 className="admin-section-title">📋 全部测试记录</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              共 {allRecords.length} 条记录
            </p>
            {allRecords.length === 0 ? (
              <p className="admin-empty">暂无测试记录</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>用户</th>
                      <th>MBTI类型</th>
                      <th>测试时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRecords.slice(0, 100).map((r, i) => {
                      const typeInfo = mbtiTypes[r.type];
                      return (
                        <tr key={r.id || i}>
                          <td>
                            <span className="table-username">
                              <span className="table-avatar">{r.username.charAt(0).toUpperCase()}</span>
                              {r.username}
                            </span>
                          </td>
                          <td>
                            <span className="type-badge" style={{ background: typeInfo?.color || '#666' }}>
                              {r.type} · {typeInfo?.name || ''}
                            </span>
                          </td>
                          <td>{new Date(r.savedAt).toLocaleString('zh-CN')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {allRecords.length > 100 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '12px', fontSize: '0.85rem' }}>
                    仅显示最近100条记录
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Breadcrumb() {
  return (
    <nav className="breadcrumb">
      <Link to="/">🏠 首页</Link>
      <span className="separator">›</span>
      <span className="current">管理员面板</span>
    </nav>
  );
}

export default AdminDashboard;
