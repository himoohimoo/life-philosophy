import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { validatePassword, isAdmin } from '../utils/auth';
import { recordVisit } from '../data/visitorStats';
import ContactModal from './ContactModal';

function UserMenu() {
  const { user, isLoggedIn, logout, login, register } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 记录访问
  useEffect(() => {
    const ip = localStorage.getItem('visitor_ip') || generateIP();
    if (!localStorage.getItem('visitor_ip')) {
      localStorage.setItem('visitor_ip', ip);
    }
    recordVisit(ip, window.location.pathname);
  }, []);

  // 生成模拟IP
  function generateIP() {
    return `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleViewHistory = () => {
    setShowDropdown(false);
    navigate('/whoami/mbti-history');
  };

  return (
    <>
      <div className="user-menu" ref={dropdownRef}>
        {isLoggedIn ? (
          <button
            className="user-menu-button logged-in"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="user-avatar">
              {user?.charAt(0).toUpperCase() || '👤'}
            </span>
            <span className="user-name">{user}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
        ) : (
          <button
            className="user-menu-button"
            onClick={() => setShowAuthModal(true)}
          >
            <span className="user-avatar">👤</span>
            <span>登录 / 注册</span>
          </button>
        )}

        {/* 下拉菜单 */}
        {isLoggedIn && showDropdown && (
          <div className="user-dropdown">
            <div className="dropdown-header">
              <span className="dropdown-avatar">{user?.charAt(0).toUpperCase()}</span>
              <div>
                <div className="dropdown-username">{user}</div>
                <div className="dropdown-status">已登录</div>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={handleViewHistory}>
              <span>📋</span> 我的测试记录
            </button>
            {isAdmin(user) && (
              <>
                <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/admin/dashboard'); }}>
                  <span>👤</span> 我的
                </button>
                <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/admin/feedback'); }}>
                  <span>📧</span> 查看反馈
                </button>
              </>
            )}
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout" onClick={handleLogout}>
              <span>🚪</span> 退出登录
            </button>
          </div>
        )}

        {/* 联系按钮 - 始终显示 */}
        <button
          className="contact-button"
          onClick={() => setShowContactModal(true)}
          style={{
            marginLeft: '10px',
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid rgba(99, 102, 241, 0.5)',
            borderRadius: '8px',
            color: '#a5b4fc',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          📧 联系
        </button>
      </div>

      {/* 登录/注册弹窗 */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} login={login} register={register} />
      )}

      {/* 联系弹窗 */}
      {showContactModal && (
        <ContactModal 
          isOpen={showContactModal} 
          onClose={() => setShowContactModal(false)} 
          username={user || '匿名用户'}
        />
      )}
    </>
  );
}

// 登录/注册弹窗组件
function AuthModal({ onClose, login, register }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // 基本验证
    if (!username.trim() || !password) {
      setMessage('请输入用户名和密码');
      setIsLoading(false);
      return;
    }

    if (mode === 'register') {
      // 注册模式额外验证
      if (password !== confirmPassword) {
        setMessage('两次输入的密码不一致');
        setIsLoading(false);
        return;
      }
      // 密码强度验证
      const pwdCheck = validatePassword(password);
      if (!pwdCheck.valid) {
        setMessage(pwdCheck.message);
        setIsLoading(false);
        return;
      }
    }

    // 执行登录或注册
    const fn = mode === 'login' ? login : register;
    const result = await fn(username.trim(), password);

    if (result.success) {
      onClose();
    } else {
      setMessage(result.message);
    }
    setIsLoading(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">
          {mode === 'login' ? '🔐 用户登录' : '📝 用户注册'}
        </h3>
        <p className="modal-desc">
          {mode === 'login'
            ? '登录后可保存和查看您的MBTI测试结果'
            : '创建账户以保存您的测试结果'}
        </p>

        {/* 标签切换 */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            登录
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="modal-input"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>密码</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'register' ? '至少8位，含大小写和数字' : '请输入密码'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="modal-input"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {mode === 'register' && (
              <div className="password-hints">
                <PasswordHint text="至少8位" valid={password.length >= 8} />
                <PasswordHint text="包含小写字母" valid={/[a-z]/.test(password)} />
                <PasswordHint text="包含大写字母" valid={/[A-Z]/.test(password)} />
                <PasswordHint text="包含数字" valid={/[0-9]/.test(password)} />
              </div>
            )}
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label>确认密码</label>
              <input
                type="password"
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="modal-input"
                autoComplete="new-password"
              />
            </div>
          )}

          {message && (
            <div className={`modal-msg ${message.includes('成功') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="mbti-btn primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : (mode === 'login' ? '登 录' : '注 册')}
          </button>
        </form>

        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

// 密码提示组件
function PasswordHint({ text, valid }) {
  return (
    <span className={`password-hint ${valid ? 'valid' : ''}`}>
      {valid ? '✓' : '○'} {text}
    </span>
  );
}

export default UserMenu;
