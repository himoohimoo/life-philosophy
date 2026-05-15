import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPSSQuestions, calculatePSS } from '../data/pssEngine';
import { useUser } from '../contexts/UserContext';

function PssPage() {
  const { user } = useUser();
  const questions = getPSSQuestions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(new Array(10).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [animClass, setAnimClass] = useState('slide-in-right');
  const [started, setStarted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setAnimClass('slide-out-left');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setAnimClass('slide-in-right');
      }, 200);
    } else {
      // 最后一题，计算结果
      const res = calculatePSS(newAnswers);
      setResult(res);
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setAnimClass('slide-out-right');
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setAnimClass('slide-in-left');
      }, 200);
    }
  };

  const handleRestart = () => {
    setAnswers(new Array(10).fill(null));
    setCurrentIndex(0);
    setShowResult(false);
    setResult(null);
    setStarted(false);
    setAnimClass('slide-in-right');
  };

  // ==================== 结果页面 ====================
  if (showResult && result) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1025 50%, #0a0a1a 100%)', padding: '40px 16px 80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {/* 面包屑 */}
          <nav style={{ fontSize: '13px', color: '#6b7280', marginBottom: '32px' }}>
            <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>&#x1F3E0; 首页</Link>
            <span style={{ margin: '0 6px' }}>&#x203A;</span>
            <span style={{ color: '#9ca3af' }}>压力测试</span>
          </nav>

          {/* 返回按钮 */}
          <Link to="/" style={{
            display: 'inline-block',
            color: '#9ca3af',
            textDecoration: 'none',
            fontSize: '14px',
            marginBottom: '24px',
          }}>
            &larr; 返回首页
          </Link>

          {/* 页面标题 */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#f1f5f9',
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            测试结果
          </h1>
          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '32px',
          }}>
            知觉压力量表（PSS-10）评估报告
          </p>

          {/* ===== 总分展示卡片 ===== */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: `1px solid ${result.levelColor}33`,
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            marginBottom: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, transparent, ${result.levelColor}, transparent)`,
            }} />
            <div style={{
              fontSize: '64px',
              fontWeight: 800,
              color: result.levelColor,
              lineHeight: 1,
              marginBottom: '8px',
              textShadow: `0 0 40px ${result.levelColor}44`,
            }}>
              {result.totalScore}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '4px',
            }}>
              总分（满分40分）
            </div>
            <div style={{
              display: 'inline-block',
              padding: '6px 20px',
              borderRadius: '20px',
              background: `${result.levelColor}18`,
              border: `1px solid ${result.levelColor}44`,
              color: result.levelColor,
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '16px',
            }}>
              {result.levelLabel}
            </div>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 auto',
            }}>
              {result.levelDesc}
            </p>
          </div>

          {/* ===== 压力维度分析卡片 ===== */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '20px',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>&#x1F4CA;</span> 压力维度分析
            </h2>

            {/* 无助感 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}>
                <span style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 500 }}>
                  {result.dimensions.helplessness.label}
                </span>
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                  {result.dimensions.helplessness.score} / {result.dimensions.helplessness.maxScore}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '10px',
                borderRadius: '5px',
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(result.dimensions.helplessness.score / result.dimensions.helplessness.maxScore) * 100}%`,
                  height: '100%',
                  borderRadius: '5px',
                  background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)',
                  transition: 'width 1s ease',
                }} />
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '8px', lineHeight: 1.6 }}>
                {result.dimensions.helplessness.desc}
              </p>
              <p style={{ color: '#8b5cf6', fontSize: '13px', marginTop: '4px', lineHeight: 1.6 }}>
                &#x1F4A1; {result.dimensions.helplessness.advice}
              </p>
            </div>

            {/* 自我效能感 */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}>
                <span style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 500 }}>
                  {result.dimensions.selfEfficacy.label}
                </span>
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                  {result.dimensions.selfEfficacy.score} / {result.dimensions.selfEfficacy.maxScore}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '10px',
                borderRadius: '5px',
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(result.dimensions.selfEfficacy.score / result.dimensions.selfEfficacy.maxScore) * 100}%`,
                  height: '100%',
                  borderRadius: '5px',
                  background: 'linear-gradient(90deg, #ef4444, #f59e0b, #10b981)',
                  transition: 'width 1s ease',
                }} />
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '8px', lineHeight: 1.6 }}>
                {result.dimensions.selfEfficacy.desc}
              </p>
              <p style={{ color: '#8b5cf6', fontSize: '13px', marginTop: '4px', lineHeight: 1.6 }}>
                &#x1F4A1; {result.dimensions.selfEfficacy.advice}
              </p>
            </div>
          </div>

          {/* ===== 建议卡片 ===== */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '20px',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>&#x1F4DD;</span> 个性化建议
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {result.suggestions.map((group, gi) => (
                <div key={gi} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#e2e8f0',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span>{group.icon}</span> {group.category}
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                  }}>
                    {group.items.map((item, ii) => (
                      <li key={ii} style={{
                        color: '#9ca3af',
                        fontSize: '13px',
                        lineHeight: 1.7,
                        paddingLeft: '16px',
                        position: 'relative',
                        marginBottom: ii < group.items.length - 1 ? '8px' : 0,
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: result.levelColor,
                        }}>&#x2022;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 警告信号卡片（高压力时显示） ===== */}
          {result.warningSigns.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.03) 100%)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '16px',
              padding: '28px',
              marginBottom: '20px',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#fca5a5',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span>&#x26A0;&#xFE0F;</span> 需要注意的信号
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {result.warningSigns.map((sign, i) => (
                  <li key={i} style={{
                    color: '#d1d5db',
                    fontSize: '14px',
                    lineHeight: 1.8,
                    paddingLeft: '20px',
                    position: 'relative',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: '#ef4444',
                    }}>&#x25B6;</span>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ===== 鼓励语卡片 ===== */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(59,130,246,0.05) 100%)',
            border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '32px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>&#x1F31F;</div>
            <p style={{
              color: '#c4b5fd',
              fontSize: '15px',
              lineHeight: 1.8,
              fontStyle: 'italic',
              maxWidth: '560px',
              margin: '0 auto',
            }}>
              &ldquo;{result.encouragement}&rdquo;
            </p>
          </div>

          {/* ===== 重新测试按钮 ===== */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <button
              onClick={handleRestart}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 36px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              &#x1F504; 重新测试
            </button>
          </div>

          {/* ===== 免责声明 ===== */}
          <div style={{
            textAlign: 'center',
            padding: '20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{
              color: '#4b5563',
              fontSize: '12px',
              lineHeight: 1.6,
            }}>
              &#x26A0;&#xFE0F; 免责声明：本测试基于知觉压力量表（PSS-10），仅供自我参考，不构成医学诊断或专业心理评估。
              <br />
              如您正在经历严重的心理困扰，请及时寻求专业心理咨询师或精神科医生的帮助。
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== 答题界面 ====================
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1025 50%, #0a0a1a 100%)', padding: '40px 16px 80px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* 面包屑 */}
        <nav style={{ fontSize: '13px', color: '#6b7280', marginBottom: '32px' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>&#x1F3E0; 首页</Link>
          <span style={{ margin: '0 6px' }}>&#x203A;</span>
          <span style={{ color: '#9ca3af' }}>压力测试</span>
        </nav>

        {/* 返回按钮 */}
        <Link to="/" style={{
          display: 'inline-block',
          color: '#9ca3af',
          textDecoration: 'none',
          fontSize: '14px',
          marginBottom: '24px',
        }}>
          &larr; 返回首页
        </Link>

        {/* 页面标题 */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#f1f5f9',
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          压力测试 &middot; 了解你的状态
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '32px',
        }}>
          基于知觉压力量表（PSS-10）&middot; 由 Sheldon Cohen 于1983年编制
        </p>

        {/* ===== 未开始：说明卡片 ===== */}
        {!started && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>&#x1F4D6;</span> 关于本测试
            </h2>
            <div style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.8 }}>
              <p style={{ marginBottom: '12px' }}>
                知觉压力量表（Perceived Stress Scale, PSS）是国际上广泛使用的压力评估工具，
                用于衡量个体在过去一个月中对生活事件的主观压力感受程度。
              </p>
              <p style={{ marginBottom: '12px' }}>
                本测试包含 <strong style={{ color: '#e2e8f0' }}>10 道题目</strong>，
                评估你在无助感和自我效能感两个维度的压力状态。
                每道题有5个选项，请根据你最近一个月的真实感受选择最符合的答案。
              </p>
              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '16px',
                marginBottom: '20px',
              }}>
                {[
                  { icon: '\u23F1', text: '约需 2 分钟' },
                  { icon: '\u{1F4CA}', text: '10 道题目' },
                  { icon: '\u{1F512}', text: '完全匿名' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    color: '#9ca3af',
                  }}>
                    <span>{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>
                请凭第一直觉作答，不要过度思考。没有"对"或"错"的答案。
              </p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <button
                onClick={handleStart}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 48px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                开始测试
              </button>
            </div>
          </div>
        )}

        {/* ===== 已开始：答题界面 ===== */}
        {started && (
          <>
            {/* 进度条 */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                  第 {currentIndex + 1} / {questions.length} 题
                </span>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>

            {/* 题目卡片 */}
            <div className={animClass} key={currentIndex} style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              animation: 'fadeIn 0.3s ease',
            }}>
              {/* 题号 */}
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '8px',
                padding: '4px 14px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '20px',
              }}>
                {currentIndex + 1} / {questions.length}
              </div>

              {/* 题目文字 */}
              <h2 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#f1f5f9',
                lineHeight: 1.6,
                marginBottom: '28px',
              }}>
                {currentQuestion.text}
              </h2>

              {/* 选项 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentIndex] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        width: '100%',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: isSelected
                          ? '1px solid rgba(99,102,241,0.6)'
                          : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)'
                          : 'rgba(255,255,255,0.02)',
                        color: isSelected ? '#c4b5fd' : '#9ca3af',
                        fontSize: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                          e.currentTarget.style.color = '#e2e8f0';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.color = '#9ca3af';
                        }
                      }}
                    >
                      {/* 选项圆点 */}
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: isSelected
                          ? '2px solid #8b5cf6'
                          : '2px solid rgba(255,255,255,0.15)',
                        background: isSelected
                          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                          : 'transparent',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {isSelected && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#fff',
                          }} />
                        )}
                      </span>
                      <span style={{ fontWeight: isSelected ? 500 : 400 }}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 导航按钮 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: currentIndex === 0 ? '#374151' : '#9ca3af',
                  fontSize: '14px',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                &larr; 上一题
              </button>

              <span style={{ color: '#4b5563', fontSize: '13px' }}>
                已答 {answeredCount} / {questions.length} 题
              </span>

              <Link to="/" style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '10px 20px',
                color: '#6b7280',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}>
                退出测试
              </Link>
            </div>
          </>
        )}

        {/* 免责声明 */}
        <div style={{
          textAlign: 'center',
          padding: '24px 16px 0',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          marginTop: '40px',
        }}>
          <p style={{
            color: '#374151',
            fontSize: '12px',
            lineHeight: 1.6,
          }}>
            &#x26A0;&#xFE0F; 免责声明：本测试仅供自我参考，不构成医学诊断。
            如您正在经历严重的心理困扰，请及时寻求专业帮助。
          </p>
        </div>
      </div>

      {/* 内联动画样式 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-in-right {
          animation: slideInRight 0.3s ease;
        }
        .slide-in-left {
          animation: slideInLeft 0.3s ease;
        }
        .slide-out-left {
          animation: slideOutLeft 0.2s ease;
        }
        .slide-out-right {
          animation: slideOutRight 0.2s ease;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-40px); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(40px); }
        }
      `}</style>
    </div>
  );
}

export default PssPage;
