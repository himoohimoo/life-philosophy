import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatsSummary, getRecentVisitors } from '../data/visitorStats';
import { getFeedbackCount } from '../data/feedbackStorage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    uniqueVisitors: 0,
    totalVisits: 0,
    todayVisits: 0,
    weekVisits: 0,
    feedbackCount: 0,
    recentVisitors: []
  });

  // 加载统计数据
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const visitorStats = getStatsSummary();
    const recentVisitors = getRecentVisitors(10);
    const feedbackCount = getFeedbackCount();

    // 模拟注册用户总数（实际应从用户系统获取）
    const registeredUsers = parseInt(localStorage.getItem('registered_users_count') || '0');

    setStats({
      ...visitorStats,
      registeredUsers,
      feedbackCount,
      recentVisitors
    });
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 导航到反馈页面
  const goToFeedback = () => {
    navigate('/admin/feedback');
  };

  // 返回首页
  const goToHome = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* 页面标题 */}
      <div style={styles.header}>
        <h1 style={styles.title}>管理员控制台</h1>
        <p style={styles.subtitle}>网站数据统计与管理</p>
      </div>

      {/* 统计卡片网格 */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, ...styles.statCardGradient1}}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statValue}>{stats.registeredUsers || 0}</div>
          <div style={styles.statLabel}>注册用户总数</div>
        </div>

        <div style={{...styles.statCard, ...styles.statCardGradient2}}>
          <div style={styles.statIcon}>🌐</div>
          <div style={styles.statValue}>{stats.uniqueVisitors}</div>
          <div style={styles.statLabel}>独立访客数</div>
        </div>

        <div style={{...styles.statCard, ...styles.statCardGradient3}}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statValue}>{stats.totalVisits}</div>
          <div style={styles.statLabel}>总访问次数</div>
        </div>

        <div style={{...styles.statCard, ...styles.statCardGradient4}}>
          <div style={styles.statIcon}>💬</div>
          <div style={styles.statValue}>{stats.feedbackCount}</div>
          <div style={styles.statLabel}>反馈数量</div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div style={styles.quickActions}>
        <h3 style={styles.sectionTitle}>快捷入口</h3>
        <div style={styles.actionButtons}>
          <button style={styles.actionButton} onClick={goToFeedback}>
            <span style={styles.actionIcon}>📨</span>
            查看反馈
          </button>
          <button style={styles.actionButton} onClick={goToHome}>
            <span style={styles.actionIcon}>🏠</span>
            返回首页
          </button>
        </div>
      </div>

      {/* 最近访客列表 */}
      <div style={styles.visitorsSection}>
        <h3 style={styles.sectionTitle}>最近访客</h3>
        <div style={styles.tableContainer}>
          {stats.recentVisitors.length === 0 ? (
            <div style={styles.emptyState}>
              <p>暂无访客数据</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>IP地址</th>
                  <th style={styles.th}>首次访问</th>
                  <th style={styles.th}>最后访问</th>
                  <th style={styles.th}>访问次数</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentVisitors.map((visitor, index) => (
                  <tr key={visitor.ip} style={styles.tableRow}>
                    <td style={styles.td}>
                      <span style={styles.ipBadge}>{visitor.ip}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.timeText}>{formatTime(visitor.firstVisit)}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.timeText}>{formatTime(visitor.lastVisit)}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.visitCount}>{visitor.visitCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// 暗色宇宙主题样式
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    padding: '32px',
    color: '#ffffff'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    background: 'linear-gradient(135deg, #e94560 0%, #8a2be2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '16px',
    color: '#808080',
    margin: 0
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  statCard: {
    padding: '28px',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)'
    }
  },
  statCardGradient1: {
    background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.2) 0%, rgba(138, 43, 226, 0.2) 100%)'
  },
  statCardGradient2: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
  },
  statCardGradient3: {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)'
  },
  statCardGradient4: {
    background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)'
  },
  statIcon: {
    fontSize: '36px',
    marginBottom: '12px'
  },
  statValue: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
  },
  statLabel: {
    fontSize: '14px',
    color: '#a0a0a0',
    fontWeight: '500'
  },
  quickActions: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#e0e0e0'
  },
  actionButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 24px',
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    color: '#ffffff',
    border: '1px solid rgba(138, 43, 226, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(138, 43, 226, 0.3)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(138, 43, 226, 0.3)'
    }
  },
  actionIcon: {
    fontSize: '18px'
  },
  visitorsSection: {
    marginTop: '20px'
  },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  tableHeader: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)'
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#e0e0e0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  tableRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)'
    }
  },
  td: {
    padding: '16px 20px',
    color: '#d0d0d0'
  },
  ipBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'monospace',
    color: '#b19cd9'
  },
  timeText: {
    fontSize: '13px',
    color: '#808080'
  },
  visitCount: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    color: '#e94560',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600'
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
    color: '#808080'
  }
};

export default AdminDashboard;
