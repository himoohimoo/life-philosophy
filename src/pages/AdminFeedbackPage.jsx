import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllFeedback, 
  deleteFeedback, 
  markFeedbackAsRead, 
  markFeedbackAsUnread,
  getFeedbackCount 
} from '../data/feedbackStorage';

const AdminFeedbackPage = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // 加载反馈数据
  useEffect(() => {
    loadFeedbackData();
  }, []);

  const loadFeedbackData = () => {
    const allFeedback = getAllFeedback();
    setFeedbackList(allFeedback);
    setTotalCount(getFeedbackCount());
    setUnreadCount(getFeedbackCount(true));
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 处理删除反馈
  const handleDelete = (id) => {
    if (window.confirm('确定要删除这条反馈吗？')) {
      deleteFeedback(id);
      loadFeedbackData();
    }
  };

  // 处理标记已读
  const handleMarkRead = (id) => {
    markFeedbackAsRead(id);
    loadFeedbackData();
  };

  // 处理标记未读
  const handleMarkUnread = (id) => {
    markFeedbackAsUnread(id);
    loadFeedbackData();
  };

  // 返回上一页
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      {/* 头部 */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={handleGoBack}>
          ← 返回
        </button>
        <h1 style={styles.title}>用户反馈管理</h1>
        <div style={styles.stats}>
          <span style={styles.statItem}>
            总反馈: <strong>{totalCount}</strong>
          </span>
          <span style={styles.statItem}>
            未读: <strong style={{ color: '#e94560' }}>{unreadCount}</strong>
          </span>
        </div>
      </div>

      {/* 反馈表格 */}
      <div style={styles.tableContainer}>
        {feedbackList.length === 0 ? (
          <div style={styles.emptyState}>
            <p>暂无反馈数据</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>序号</th>
                <th style={styles.th}>用户名</th>
                <th style={styles.th}>IP地址</th>
                <th style={styles.th}>内容</th>
                <th style={styles.th}>时间</th>
                <th style={styles.th}>状态</th>
                <th style={styles.th}>操作</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((feedback, index) => (
                <tr 
                  key={feedback.id} 
                  style={{
                    ...styles.tableRow,
                    backgroundColor: feedback.isRead ? 'transparent' : 'rgba(233, 69, 96, 0.05)'
                  }}
                >
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{feedback.username}</td>
                  <td style={styles.td}>
                    <span style={styles.ipBadge}>{feedback.ip}</span>
                  </td>
                  <td style={{...styles.td, ...styles.contentCell}}>
                    {feedback.content}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.timeText}>{formatTime(feedback.timestamp)}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={feedback.isRead ? styles.readBadge : styles.unreadBadge}>
                      {feedback.isRead ? '已读' : '未读'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      {feedback.isRead ? (
                        <button
                          style={{...styles.actionButton, ...styles.markUnreadButton}}
                          onClick={() => handleMarkUnread(feedback.id)}
                          title="标记为未读"
                        >
                          标未读
                        </button>
                      ) : (
                        <button
                          style={{...styles.actionButton, ...styles.markReadButton}}
                          onClick={() => handleMarkRead(feedback.id)}
                          title="标记为已读"
                        >
                          标已读
                        </button>
                      )}
                      <button
                        style={{...styles.actionButton, ...styles.deleteButton}}
                        onClick={() => handleDelete(feedback.id)}
                        title="删除"
                      >
                        删除
                      </button>
                    </div>
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

// 暗色宇宙主题样式
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    padding: '24px',
    color: '#ffffff'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)'
    }
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    margin: 0,
    background: 'linear-gradient(135deg, #e94560 0%, #8a2be2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  stats: {
    display: 'flex',
    gap: '24px'
  },
  statItem: {
    fontSize: '14px',
    color: '#a0a0a0'
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
    padding: '16px 12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#e0e0e0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    whiteSpace: 'nowrap'
  },
  tableRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)'
    }
  },
  td: {
    padding: '16px 12px',
    color: '#d0d0d0',
    verticalAlign: 'top'
  },
  contentCell: {
    maxWidth: '300px',
    wordBreak: 'break-word',
    lineHeight: '1.6'
  },
  ipBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#b19cd9'
  },
  timeText: {
    fontSize: '12px',
    color: '#808080',
    whiteSpace: 'nowrap'
  },
  readBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  unreadBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    color: '#e94560',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  actionButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  markReadButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    ':hover': {
      backgroundColor: 'rgba(34, 197, 94, 0.3)'
    }
  },
  markUnreadButton: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    color: '#facc15',
    ':hover': {
      backgroundColor: 'rgba(234, 179, 8, 0.3)'
    }
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    ':hover': {
      backgroundColor: 'rgba(239, 68, 68, 0.3)'
    }
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
    color: '#808080'
  }
};

export default AdminFeedbackPage;
