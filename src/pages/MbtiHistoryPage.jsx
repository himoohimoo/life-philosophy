import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, logout, getTestHistory, deleteTestResult, login } from '../utils/auth';
import { mbtiTypes } from '../data/mbtiData';

function MbtiHistoryPage() {
  const [username, setUsername] = useState(getCurrentUser());
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (username) {
      setHistory(getTestHistory(username));
    }
  }, [username]);

  const handleLogout = () => {
    logout();
    setUsername(null);
    setHistory([]);
  };

  const handleDelete = (resultId) => {
    deleteTestResult(username, resultId);
    setHistory(getTestHistory(username));
  };

  // 未登录状态
  if (!username) {
    return (
      <div className="page-enter">
        <div className="page-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Breadcrumb />
          <div className="mbti-auth-card">
            <span style={{ fontSize: '3rem' }}>🔐</span>
            <h2 style={{ marginTop: '16px' }}>查看历史记录</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>
              登录后可查看您保存的所有MBTI测试结果
            </p>
            <LoginInline onLogin={(user) => { setUsername(user); setHistory(getTestHistory(user)); }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Breadcrumb />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="page-title" style={{ textAlign: 'left', fontSize: '2rem', marginBottom: '4px' }}>
              📋 我的测试记录
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              欢迎，<strong style={{ color: 'var(--accent-cyan)' }}>{username}</strong> · 共 {history.length} 条记录
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/whoami/mbti-test" className="mbti-btn primary" style={{ textDecoration: 'none' }}>
              🧪 重新测试
            </Link>
            <button className="mbti-btn ghost" onClick={handleLogout}>退出</button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="mbti-empty-state">
            <span style={{ fontSize: '4rem' }}>📭</span>
            <p>还没有测试记录</p>
            <Link to="/whoami/mbti-test" className="mbti-btn primary" style={{ textDecoration: 'none', marginTop: '16px' }}>
              开始第一次测试
            </Link>
          </div>
        ) : (
          <div className="mbti-history-list">
            {history.map(record => {
              const typeInfo = mbtiTypes[record.type];
              if (!typeInfo) return null;
              return (
                <div key={record.id} className="mbti-history-card" style={{
                  borderLeftColor: typeInfo.color,
                }}>
                  <div className="history-card-left">
                    <span className="history-emoji">{typeInfo.emoji}</span>
                    <div>
                      <div className="history-type" style={{ color: typeInfo.color }}>
                        {record.type} · {typeInfo.name}
                      </div>
                      <div className="history-date">
                        {new Date(record.savedAt).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  </div>
                  <div className="history-card-right">
                    <div className="history-mini-dims">
                      {record.type.split('').map((letter, i) => (
                        <span key={i} className="mini-dim" style={{ color: typeInfo.color }}>
                          {['E/I','S/N','T/F','J/P'][i]}: {letter}
                        </span>
                      ))}
                    </div>
                    <button
                      className="mbti-btn ghost"
                      style={{ fontSize: '0.8rem', padding: '4px 12px', color: '#ff6b6b' }}
                      onClick={() => handleDelete(record.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              );
            })}
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
      <Link to="/whoami">我是谁</Link>
      <span className="separator">›</span>
      <Link to="/whoami/personality">我的性格</Link>
      <span className="separator">›</span>
      <span className="current">测试记录</span>
    </nav>
  );
}

function LoginInline({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(username, password);
    if (res.success) {
      onLogin(username);
    } else {
      setMessage(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <input
        type="text"
        placeholder="用户名"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="modal-input"
        autoComplete="username"
      />
      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="modal-input"
        autoComplete="current-password"
      />
      {message && <p className="modal-msg error">{message}</p>}
      <button type="submit" className="mbti-btn primary" style={{ width: '100%', marginTop: '8px' }}>
        登录
      </button>
    </form>
  );
}

export default MbtiHistoryPage;
