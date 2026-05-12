import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mbtiQuestions, mbtiTypes } from '../data/mbtiData';
import { getCurrentUser, saveTestResult, login, register } from '../utils/auth';

function MbtiTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [animDirection, setAnimDirection] = useState('next');
  const currentUser = getCurrentUser();

  const question = mbtiQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100;

  // 恢复进度
  useEffect(() => {
    const saved = sessionStorage.getItem('mbti_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAnswers(data.answers || {});
        if (data.showResult && data.result) {
          setResult(data.result);
          setShowResult(true);
        } else {
          setCurrentQuestion(data.currentQuestion || 0);
        }
      } catch { /* ignore */ }
    }
  }, []);

  // 保存进度
  useEffect(() => {
    if (!showResult) {
      sessionStorage.setItem('mbti_progress', JSON.stringify({
        currentQuestion,
        answers,
      }));
    }
  }, [currentQuestion, answers, showResult]);

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < mbtiQuestions.length - 1) {
      setAnimDirection('next');
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 150);
    } else {
      // 计算结果
      const mbtiResult = calculateResult(newAnswers);
      setResult(mbtiResult);
      setShowResult(true);
      sessionStorage.setItem('mbti_progress', JSON.stringify({
        currentQuestion: mbtiQuestions.length - 1,
        answers: newAnswers,
        showResult: true,
        result: mbtiResult,
      }));
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setAnimDirection('prev');
      setTimeout(() => setCurrentQuestion(prev => prev - 1), 150);
    }
  };

  const calculateResult = (ans) => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    mbtiQuestions.forEach((q, i) => {
      if (ans[i]) scores[ans[i]]++;
    });
    const type =
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');
    return { type, scores };
  };

  const handleSave = () => {
    if (!currentUser) {
      setShowSaveDialog(true);
      return;
    }
    const res = saveTestResult(currentUser, result);
    setSaveMessage(res.success ? '✅ 结果已保存！' : '❌ 保存失败');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResult(false);
    setResult(null);
    setSaveMessage('');
    sessionStorage.removeItem('mbti_progress');
  };

  // ====== 结果展示 ======
  if (showResult && result) {
    const typeInfo = mbtiTypes[result.type];
    if (!typeInfo) return null;

    return (
      <div className="page-enter">
        <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Breadcrumb />
          <Link to="/whoami/personality" className="back-btn">← 返回我的性格</Link>

          {/* 结果卡片 */}
          <div className="mbti-result-card" style={{
            background: `linear-gradient(135deg, ${typeInfo.color}22, ${typeInfo.color}08)`,
            borderColor: `${typeInfo.color}44`,
          }}>
            <div className="mbti-result-header">
              <span className="mbti-result-emoji">{typeInfo.emoji}</span>
              <div>
                <h1 className="mbti-result-type" style={{ color: typeInfo.color }}>
                  {result.type}
                </h1>
                <p className="mbti-result-name">{typeInfo.name}</p>
                <p className="mbti-result-slogan">"{typeInfo.slogan}"</p>
              </div>
            </div>

            <div className="mbti-result-body">
              {/* 性格描述 */}
              <section className="mbti-section">
                <h2>🧠 性格解读</h2>
                <p>{typeInfo.description}</p>
                <div className="mbti-traits">
                  {typeInfo.traits.map((t, i) => (
                    <span key={i} className="mbti-trait-tag" style={{
                      background: `${typeInfo.color}15`,
                      borderColor: `${typeInfo.color}33`,
                      color: typeInfo.color,
                    }}>{t}</span>
                  ))}
                </div>
              </section>

              {/* 优势与劣势 */}
              <div className="mbti-two-col">
                <section className="mbti-section">
                  <h2>💪 核心优势</h2>
                  <ul>
                    {typeInfo.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </section>
                <section className="mbti-section">
                  <h2>⚠️ 潜在挑战</h2>
                  <ul>
                    {typeInfo.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </section>
              </div>

              {/* 维度分析 */}
              <section className="mbti-section">
                <h2>📊 维度分析</h2>
                <div className="mbti-dimensions">
                  {[
                    { left: 'E 外向', right: 'I 内向', lVal: result.scores.E, rVal: result.scores.I },
                    { left: 'S 感觉', right: 'N 直觉', lVal: result.scores.S, rVal: result.scores.N },
                    { left: 'T 思考', right: 'F 情感', lVal: result.scores.T, rVal: result.scores.F },
                    { left: 'J 判断', right: 'P 知觉', lVal: result.scores.J, rVal: result.scores.P },
                  ].map((dim, i) => {
                    const total = dim.lVal + dim.rVal;
                    const leftPct = total > 0 ? (dim.lVal / total) * 100 : 50;
                    const isLeft = leftPct >= 50;
                    return (
                      <div key={i} className="mbti-dimension-row">
                        <span className={`dim-label ${isLeft ? 'active' : ''}`}>{dim.left}</span>
                        <div className="dim-bar-container">
                          <div className="dim-bar" style={{
                            width: `${leftPct}%`,
                            background: isLeft ? typeInfo.color : `${typeInfo.color}66`,
                          }} />
                        </div>
                        <span className={`dim-label ${!isLeft ? 'active' : ''}`}>{dim.right}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 适合职业 */}
              <section className="mbti-section">
                <h2>💼 适合的职业</h2>
                <div className="mbti-careers">
                  {typeInfo.careers.map((c, i) => (
                    <span key={i} className="mbti-career-tag">{c}</span>
                  ))}
                </div>
              </section>

              {/* 代表名人 */}
              <section className="mbti-section">
                <h2>🌟 代表名人</h2>
                <div className="mbti-celebrities">
                  {typeInfo.celebrities.map((c, i) => (
                    <div key={i} className="mbti-celebrity-card">
                      <span className="celebrity-icon">
                        {['👨‍💼','👩‍🔬','👨‍🎨','👩‍💻','👨‍🚀','👩‍🏫','👨‍⚕️','👩‍⚖️'][i % 8]}
                      </span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* 操作按钮 */}
            <div className="mbti-actions">
              <button className="mbti-btn primary" onClick={handleSave}>
                {currentUser ? '💾 保存结果' : '🔐 登录后保存'}
              </button>
              <button className="mbti-btn secondary" onClick={handleRestart}>
                🔄 重新测试
              </button>
              {saveMessage && <p className="mbti-save-msg">{saveMessage}</p>}
            </div>
          </div>

          {/* 保存对话框 */}
          {showSaveDialog && <SaveDialog onClose={() => setShowSaveDialog(false)} />}
        </div>
      </div>
    );
  }

  // ====== 答题界面 ======
  return (
    <div className="page-enter">
      <div className="page-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Breadcrumb />

        <div className="mbti-test-container">
          {/* 进度条 */}
          <div className="mbti-progress-section">
            <div className="mbti-progress-info">
              <span>第 {currentQuestion + 1} / {mbtiQuestions.length} 题</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mbti-progress-bar">
              <div className="mbti-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* 维度指示器 */}
          <div className="mbti-dimension-indicators">
            {['EI', 'SN', 'TF', 'JP'].map(dim => {
              const dimQuestions = mbtiQuestions.filter(q => q.dimension === dim);
              const answered = dimQuestions.filter((_, i) => {
                const qIdx = mbtiQuestions.indexOf(dimQuestions[i]);
                return answers[qIdx] !== undefined;
              }).length;
              const done = answered === dimQuestions.length;
              return (
                <div key={dim} className={`dim-indicator ${done ? 'done' : ''}`}>
                  {dim}
                </div>
              );
            })}
          </div>

          {/* 题目卡片 */}
          <div className={`mbti-question-card ${animDirection === 'next' ? 'slide-in-right' : 'slide-in-left'}`}
               key={currentQuestion}>
            <div className="mbti-question-number">Q{currentQuestion + 1}</div>
            <h2 className="mbti-question-text">{question.text}</h2>
            <div className="mbti-options">
              {question.options.map(opt => (
                <button
                  key={opt.label}
                  className={`mbti-option-btn ${answers[currentQuestion] === opt.value ? 'selected' : ''}`}
                  onClick={() => handleAnswer(opt.value)}
                >
                  <span className="option-label">{opt.label}</span>
                  <span className="option-text">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 导航按钮 */}
          <div className="mbti-nav-buttons">
            <button
              className="mbti-btn secondary"
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              style={{ opacity: currentQuestion === 0 ? 0.3 : 1 }}
            >
              ← 上一题
            </button>
            <Link to="/whoami/personality" className="mbti-btn ghost">
              退出测试
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// 面包屑
function Breadcrumb() {
  return (
    <nav className="breadcrumb">
      <Link to="/">🏠 首页</Link>
      <span className="separator">›</span>
      <Link to="/whoami">我是谁</Link>
      <span className="separator">›</span>
      <Link to="/whoami/personality">我的性格</Link>
      <span className="separator">›</span>
      <span className="current">MBTI测试</span>
    </nav>
  );
}

// 保存对话框
function SaveDialog({ onClose }) {
  const [mode, setMode] = useState('login'); // login | register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const fn = mode === 'login' ? login : register;
    const res = fn(username, password);
    if (res.success) {
      setMessage(mode === 'register' ? '注册成功，请登录！' : '登录成功！');
      if (mode === 'login') {
        setTimeout(() => onClose(), 1000);
      } else {
        setMode('login');
      }
    } else {
      setMessage(res.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">🔐 {mode === 'login' ? '登录' : '注册'}</h3>
        <p className="modal-desc">登录后可保存测试结果，随时查看历史记录</p>

        <div className="modal-tabs">
          <button className={`modal-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => { setMode('login'); setMessage(''); }}>
            登录
          </button>
          <button className={`modal-tab ${mode === 'register' ? 'active' : ''}`}
                  onClick={() => { setMode('register'); setMessage(''); }}>
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {message && <p className={`modal-msg ${message.includes('成功') ? 'success' : 'error'}`}>{message}</p>}
          <button type="submit" className="mbti-btn primary" style={{ width: '100%' }}>
            {mode === 'login' ? '登录' : '注册'}
          </button>
        </form>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

export default MbtiTestPage;
