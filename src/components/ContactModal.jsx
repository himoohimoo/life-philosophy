import React, { useState, useEffect } from 'react';
import { submitFeedback } from '../data/feedbackStorage';

// 模拟获取用户IP（实际项目中应从后端获取）
const getUserIP = () => {
  // 从 localStorage 获取存储的IP，如果没有则生成一个模拟IP
  let ip = localStorage.getItem('user_simulated_ip');
  if (!ip) {
    // 生成模拟IP: 192.168.xxx.xxx
    ip = `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    localStorage.setItem('user_simulated_ip', ip);
  }
  return ip;
};

const ContactModal = ({ isOpen, onClose, username }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // 重置状态当弹窗打开时
  useEffect(() => {
    if (isOpen) {
      setContent('');
      setShowSuccess(false);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('请输入反馈内容');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const ip = getUserIP();
      submitFeedback(username, content.trim(), ip);
      
      setShowSuccess(true);
      setContent('');
      
      // 3秒后自动关闭成功提示
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setShowSuccess(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button style={styles.closeButton} onClick={handleClose}>
          ×
        </button>

        {/* 标题 */}
        <h2 style={styles.title}>联系版主</h2>

        {/* 成功提示 */}
        {showSuccess && (
          <div style={styles.successMessage}>
            提交成功！感谢您的反馈
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit}>
          <textarea
            style={styles.textarea}
            placeholder="想对版主说..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            disabled={isSubmitting}
          />
          
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(isSubmitting || !content.trim() ? styles.submitButtonDisabled : {})
            }}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? '提交中...' : '提交反馈'}
          </button>
        </form>
      </div>
    </div>
  );
};

// 暗色宇宙主题样式
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '480px',
    position: 'relative',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: `
      0 0 40px rgba(138, 43, 226, 0.3),
      0 0 80px rgba(138, 43, 226, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#a0a0a0',
    fontSize: '28px',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    ':hover': {
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  },
  title: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 24px 0',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #e94560 0%, #8a2be2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  textarea: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: '#ffffff',
    resize: 'vertical',
    minHeight: '120px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    lineHeight: '1.6',
    outline: 'none',
    transition: 'all 0.3s ease',
    ':focus': {
      borderColor: '#8a2be2',
      boxShadow: '0 0 0 3px rgba(138, 43, 226, 0.2)'
    },
    '::placeholder': {
      color: '#6a6a8a'
    }
  },
  submitButton: {
    width: '100%',
    padding: '14px 24px',
    marginTop: '20px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #e94560 0%, #8a2be2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(233, 69, 96, 0.4)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(233, 69, 96, 0.5)'
    }
  },
  submitButtonDisabled: {
    background: 'linear-gradient(135deg, #4a4a6a 0%, #3a3a5a 100%)',
    cursor: 'not-allowed',
    boxShadow: 'none',
    transform: 'none'
  },
  successMessage: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '14px',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    animation: 'fadeIn 0.3s ease'
  },
  errorMessage: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '14px',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  }
};

export default ContactModal;
