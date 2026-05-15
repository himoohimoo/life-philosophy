import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLoveQuestions, calculateLove } from '../data/loveEngine';
import { useUser } from '../contexts/UserContext';

function LovePage() {
  const { user } = useUser();
  const { triangle: triQs, compatibility: compatQs } = getLoveQuestions();
  const allQuestions = [...triQs, ...compatQs];

  // 阶段: intro | test | result
  const [phase, setPhase] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triangleAnswers, setTriangleAnswers] = useState(new Array(15).fill(null));
  const [compatAnswers, setCompatAnswers] = useState(new Array(10).fill(null));
  const [result, setResult] = useState(null);
  const [animClass, setAnimClass] = useState('slide-in-right');

  const isTrianglePart = currentIndex < 15;
  const currentAnswers = isTrianglePart ? triangleAnswers : compatAnswers;
  const currentQuestion = allQuestions[currentIndex];
  const partLabel = isTrianglePart ? '第一部分：爱情三角理论' : '第二部分：亲密关系适配度';
  const partProgress = isTrianglePart
    ? ((currentIndex + 1) / 15) * 100
    : (((currentIndex - 15) + 1) / 10) * 100;
  const totalProgress = ((currentIndex + 1) / 25) * 100;
  const answeredCount = [...triangleAnswers, ...compatAnswers].filter(a => a !== null).length;

  const handleStart = () => {
    setPhase('test');
  };

  const handleAnswer = (value) => {
    if (isTrianglePart) {
      const newAnswers = [...triangleAnswers];
      newAnswers[currentIndex] = value;
      setTriangleAnswers(newAnswers);
    } else {
      const newAnswers = [...compatAnswers];
      newAnswers[currentIndex - 15] = value;
      setCompatAnswers(newAnswers);
    }

    if (currentIndex < allQuestions.length - 1) {
      setAnimClass('slide-out-left');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setAnimClass('slide-in-right');
      }, 200);
    } else {
      // 最后一题，计算结果
      const finalTriAnswers = isTrianglePart
        ? [...triangleAnswers]
        : triangleAnswers;
      const finalCompatAnswers = isTrianglePart
        ? compatAnswers
        : [...compatAnswers];
      if (isTrianglePart) {
        finalTriAnswers[currentIndex] = value;
      } else {
        finalCompatAnswers[currentIndex - 15] = value;
      }
      const res = calculateLove(finalTriAnswers, finalCompatAnswers);
      setResult(res);
      setTimeout(() => setPhase('result'), 300);
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
    setTriangleAnswers(new Array(15).fill(null));
    setCompatAnswers(new Array(10).fill(null));
    setCurrentIndex(0);
    setPhase('intro');
    setResult(null);
    setAnimClass('slide-in-right');
  };

  // ==================== 结果页面 ====================
  if (phase === 'result' && result) {
    const { triangle, loveType, compatibility, suggestions } = result;
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1025 50%, #0a0a1a 100%)', padding: '40px 16px 80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {/* 面包屑 */}
          <nav style={{ fontSize: '13px', color: '#6b7280', marginBottom: '32px' }}>
            <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>&#x1F3E0; 首页</Link>
            <span style={{ margin: '0 6px' }}>&#x203A;</span>
            <span style={{ color: '#9ca3af' }}>择偶观测评</span>
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
            测评结果
          </h1>
          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '32px',
          }}>
            择偶观测评 &middot; 发现你的爱情DNA
          </p>

          {/* ===== 爱情三角可视化 ===== */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              <span>&#x1F49D;</span> 爱情三角
            </h2>

            {/* CSS 三角形可视化 */}
            <div style={{
              position: 'relative',
              width: '260px',
              height: '240px',
              margin: '0 auto 24px',
            }}>
              {/* 亲密 - 顶部 */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${triangle.intimacy.color}${Math.round(triangle.intimacy.percent * 2.55).toString(16).padStart(2, '0')} 0%, ${triangle.intimacy.color}33 70%, transparent 100%)`,
                  border: `2px solid ${triangle.intimacy.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: `0 0 20px ${triangle.intimacy.color}44`,
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: triangle.intimacy.color }}>{triangle.intimacy.percent}%</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{triangle.intimacy.label}</span>
                </div>
              </div>

              {/* 激情 - 左下 */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                textAlign: 'center',
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${triangle.passion.color}${Math.round(triangle.passion.percent * 2.55).toString(16).padStart(2, '0')} 0%, ${triangle.passion.color}33 70%, transparent 100%)`,
                  border: `2px solid ${triangle.passion.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 20px ${triangle.passion.color}44`,
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: triangle.passion.color }}>{triangle.passion.percent}%</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{triangle.passion.label}</span>
                </div>
              </div>

              {/* 承诺 - 右下 */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                textAlign: 'center',
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${triangle.commitment.color}${Math.round(triangle.commitment.percent * 2.55).toString(16).padStart(2, '0')} 0%, ${triangle.commitment.color}33 70%, transparent 100%)`,
                  border: `2px solid ${triangle.commitment.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 20px ${triangle.commitment.color}44`,
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: triangle.commitment.color }}>{triangle.commitment.percent}%</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{triangle.commitment.label}</span>
                </div>
              </div>

              {/* 连接线 - SVG */}
              <svg style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}>
                <line x1="130" y1="36" x2="36" y2="204" stroke={triangle.intimacy.color} strokeWidth="1" strokeOpacity="0.3" />
                <line x1="130" y1="36" x2="224" y2="204" stroke={triangle.intimacy.color} strokeWidth="1" strokeOpacity="0.3" />
                <line x1="36" y1="204" x2="224" y2="204" stroke={triangle.passion.color} strokeWidth="1" strokeOpacity="0.3" />
              </svg>
            </div>

            {/* 三维描述 */}
            {['intimacy', 'passion', 'commitment'].map(key => (
              <div key={key} style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                marginBottom: '10px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
                }}>
                  <span style={{ color: triangle[key].color, fontSize: '14px', fontWeight: 600 }}>
                    {triangle[key].label}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>
                    {triangle[key].score} / {triangle[key].maxScore}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    width: `${triangle[key].percent}%`,
                    height: '100%',
                    borderRadius: '3px',
                    background: `linear-gradient(90deg, ${triangle[key].color}88, ${triangle[key].color})`,
                    transition: 'width 1s ease',
                  }} />
                </div>
                <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  {triangle[key].desc}
                </p>
              </div>
            ))}
          </div>

          {/* ===== 爱情类型卡片 ===== */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(99,102,241,0.06) 100%)',
            border: '1px solid rgba(236,72,153,0.2)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>{loveType.emoji}</div>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: '16px',
            }}>
              {loveType.name}
            </h2>
            <p style={{
              color: '#c4b5fd',
              fontSize: '14px',
              lineHeight: 1.8,
              maxWidth: '560px',
              margin: '0 auto 16px',
            }}>
              {loveType.desc}
            </p>
            <div style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'left',
            }}>
              <p style={{
                color: '#a78bfa',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}>
                &#x1F4A1; 建议
              </p>
              <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                {loveType.advice}
              </p>
            </div>
          </div>

          {/* ===== 适配度总分卡片 ===== */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              <span>&#x1F4C8;</span> 亲密关系适配度
            </h2>

            {/* 圆形进度条 */}
            <div style={{
              position: 'relative',
              width: '140px',
              height: '140px',
              margin: '0 auto 20px',
            }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                  cx="70" cy="70" r="60"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="10"
                />
                <circle
                  cx="70" cy="70" r="60"
                  fill="none"
                  stroke="url(#compatGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - compatibility.overall / 100)}`}
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                />
                <defs>
                  <linearGradient id="compatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}>
                  {compatibility.overall}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>总分</div>
              </div>
            </div>
          </div>

          {/* ===== 五维适配度详情 ===== */}
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
              <span>&#x1F4CA;</span> 适配度维度详情
            </h2>

            {compatibility.dimensions.map((dim, i) => {
              const barColor = dim.score >= 75
                ? 'linear-gradient(90deg, #ec4899, #f472b6)'
                : dim.score >= 50
                  ? 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
                  : 'linear-gradient(90deg, #6366f1, #818cf8)';
              return (
                <div key={i} style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}>
                    <span style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 500 }}>
                      {dim.name}
                    </span>
                    <span style={{
                      color: dim.score >= 75 ? '#f472b6' : dim.score >= 50 ? '#a78bfa' : '#818cf8',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}>
                      {dim.score}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                    marginBottom: '10px',
                  }}>
                    <div style={{
                      width: `${dim.score}%`,
                      height: '100%',
                      borderRadius: '4px',
                      background: barColor,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.6, margin: '0 0 6px' }}>
                    {dim.desc}
                  </p>
                  <p style={{ color: '#a78bfa', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                    &#x1F4A1; {dim.advice}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ===== 综合建议卡片 ===== */}
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
              <span>&#x1F4DD;</span> 综合建议
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#e2e8f0',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span>{s.icon}</span> {s.title}
                  </h3>
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '13px',
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    {s.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== 重新测试按钮 ===== */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <button
              onClick={handleRestart}
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
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
                e.target.style.boxShadow = '0 8px 24px rgba(236,72,153,0.3)';
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
              &#x26A0;&#xFE0F; 免责声明：本测评基于斯滕伯格爱情三角理论，仅供自我参考和娱乐，不构成专业心理评估或婚恋建议。
              <br />
              每个人的爱情观都是独特的，请结合自身实际情况理性看待测评结果。
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
          <span style={{ color: '#9ca3af' }}>择偶观测评</span>
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
          择偶观测评 &middot; 发现你的爱情DNA
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '32px',
        }}>
          基于斯滕伯格爱情三角理论 &middot; 探索你的爱情密码
        </p>

        {/* ===== 未开始：说明卡片 ===== */}
        {phase === 'intro' && (
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
              <span>&#x1F49D;</span> 关于本测评
            </h2>
            <div style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.8 }}>
              <p style={{ marginBottom: '12px' }}>
                爱情三角理论（Triangular Theory of Love）由心理学家罗伯特&middot;斯滕伯格于1986年提出，
                认为爱情由<strong style={{ color: '#ec4899' }}>亲密</strong>、
                <strong style={{ color: '#ef4444' }}>激情</strong>和
                <strong style={{ color: '#6366f1' }}>承诺</strong>三个基本成分组成，
                不同组合形成不同类型的爱情。
              </p>
              <p style={{ marginBottom: '12px' }}>
                本测评分为<strong style={{ color: '#e2e8f0' }}>两部分</strong>，共<strong style={{ color: '#e2e8f0' }}>25道题目</strong>：
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '16px',
                paddingLeft: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#ec4899', fontWeight: 600, flexShrink: 0 }}>Part 1</span>
                  <span>爱情三角理论测评（15题）—— 评估你的亲密、激情和承诺三个维度</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#8b5cf6', fontWeight: 600, flexShrink: 0 }}>Part 2</span>
                  <span>亲密关系适配度测评（10题）—— 评估你在价值观、沟通、情感等维度的适配能力</span>
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '16px',
                marginBottom: '20px',
              }}>
                {[
                  { icon: '\u23F1', text: '约需 5 分钟' },
                  { icon: '\u{1F4CA}', text: '25 道题目' },
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
                请凭第一直觉作答，选择最符合你真实感受的选项。没有"对"或"错"的答案。
              </p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <button
                onClick={handleStart}
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
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
                  e.target.style.boxShadow = '0 8px 24px rgba(236,72,153,0.3)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                开始测评
              </button>
            </div>
          </div>
        )}

        {/* ===== 已开始：答题界面 ===== */}
        {phase === 'test' && currentQuestion && (
          <>
            {/* 部分标签 */}
            <div style={{
              textAlign: 'center',
              marginBottom: '16px',
            }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 20px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                background: isTrianglePart
                  ? 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05))'
                  : 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
                border: isTrianglePart
                  ? '1px solid rgba(236,72,153,0.3)'
                  : '1px solid rgba(139,92,246,0.3)',
                color: isTrianglePart ? '#f472b6' : '#a78bfa',
              }}>
                {partLabel}
              </span>
            </div>

            {/* 总进度条 */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                  第 {currentIndex + 1} / {allQuestions.length} 题
                </span>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>
                  {Math.round(totalProgress)}%
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
                  width: `${totalProgress}%`,
                  height: '100%',
                  borderRadius: '3px',
                  background: isTrianglePart
                    ? 'linear-gradient(90deg, #ec4899, #f472b6, #fb7185)'
                    : 'linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd)',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>

            {/* 部分进度 */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
            }}>
              <div style={{
                flex: 1,
                height: '3px',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(isTrianglePart ? partProgress : 100)}%`,
                  height: '100%',
                  borderRadius: '2px',
                  background: '#ec4899',
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <div style={{
                flex: 1,
                height: '3px',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(!isTrianglePart ? partProgress : 0)}%`,
                  height: '100%',
                  borderRadius: '2px',
                  background: '#8b5cf6',
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
                background: isTrianglePart
                  ? 'linear-gradient(135deg, #ec4899, #f472b6)'
                  : 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                borderRadius: '8px',
                padding: '4px 14px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '20px',
              }}>
                {currentIndex + 1} / {allQuestions.length}
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
                  const isSelected = currentAnswers[isTrianglePart ? currentIndex : currentIndex - 15] === option.value;
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
                          ? '1px solid rgba(236,72,153,0.6)'
                          : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(139,92,246,0.1) 100%)'
                          : 'rgba(255,255,255,0.02)',
                        color: isSelected ? '#f9a8d4' : '#9ca3af',
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
                          ? '2px solid #ec4899'
                          : '2px solid rgba(255,255,255,0.15)',
                        background: isSelected
                          ? 'linear-gradient(135deg, #ec4899, #f472b6)'
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
                已答 {answeredCount} / {allQuestions.length} 题
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
                退出测评
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
            &#x26A0;&#xFE0F; 免责声明：本测评仅供自我参考和娱乐，不构成专业心理评估或婚恋建议。
            <br />
            每个人的爱情观都是独特的，请理性看待测评结果。
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

export default LovePage;
