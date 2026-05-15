import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { analyzeFace } from '../data/faceEngine';

function FacePage() {
  const { user, isLoggedIn } = useUser();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageData(e.target.result);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleAnalyze = useCallback(() => {
    if (!imageData) return;
    setAnalyzing(true);
    // 模拟分析延迟，增加体验感
    setTimeout(() => {
      try {
        const analysisResult = analyzeFace(imageData);
        setResult(analysisResult);
      } catch (err) {
        console.error('面相分析失败:', err);
      }
      setAnalyzing(false);
    }, 1500);
  }, [imageData]);

  const handleReset = useCallback(() => {
    setImagePreview(null);
    setImageData(null);
    setResult(null);
    setAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const fiveElementConfig = [
    { key: 'metal', label: '金', color: '#f59e0b' },
    { key: 'wood', label: '木', color: '#10b981' },
    { key: 'water', label: '水', color: '#3b82f6' },
    { key: 'fire', label: '火', color: '#ef4444' },
    { key: 'earth', label: '土', color: '#a78bfa' },
  ];

  const featureIcons = {
    eyebrow: '🪡',
    eye: '👁',
    nose: '👃',
    mouth: '👄',
    ear: '👂',
  };

  const fortuneIcons = {
    career: '🎯',
    wealth: '💰',
    love: '💕',
    health: '🌿',
  };

  return (
    <div className="page-enter">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* 面包屑 */}
        <nav className="breadcrumb">
          <Link to="/">首页</Link>
          <span className="separator">›</span>
          <Link to="/whoami">我是谁</Link>
          <span className="separator">›</span>
          <span className="current">面相分析</span>
        </nav>

        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: '3rem',
            background: 'linear-gradient(135deg, #4a6cf7, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
          }}>
            面相分析 · 以面观心
          </h1>
          <p style={{
            color: '#a0a0cc',
            fontSize: '1.1rem',
            fontWeight: '300',
            letterSpacing: '2px',
          }}>
            上传正面清晰照片，基于易经五行理论解读面相奥秘
          </p>
        </div>

        {/* 上传区域 */}
        <div style={{
          background: 'rgba(20, 20, 50, 0.7)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${dragOver ? 'rgba(74, 108, 247, 0.6)' : 'rgba(74, 108, 247, 0.3)'}`,
          borderRadius: '16px',
          padding: '40px 32px',
          marginBottom: '32px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: dragOver ? '0 0 50px rgba(74, 108, 247, 0.25)' : '0 0 30px rgba(74, 108, 247, 0.15)',
        }}>
          <h2 style={{
            fontFamily: "'ZCOOL XiaoWei', serif",
            fontSize: '1.6rem',
            color: '#e8e8ff',
            marginBottom: '8px',
          }}>
            📷 上传照片
          </h2>
          <p style={{
            color: '#a0a0cc',
            fontSize: '0.95rem',
            fontWeight: '300',
            marginBottom: '24px',
          }}>
            请上传一张五官清晰的正面照片，支持 JPG、PNG 格式
          </p>

          {!imagePreview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? 'rgba(74, 108, 247, 0.8)' : 'rgba(74, 108, 247, 0.3)'}`,
                borderRadius: '12px',
                padding: '60px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: dragOver ? 'rgba(74, 108, 247, 0.08)' : 'rgba(10, 10, 30, 0.4)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🖼️</div>
              <p style={{ color: '#a0a0cc', fontSize: '1rem', marginBottom: '8px' }}>
                拖拽照片到此处，或点击选择文件
              </p>
              <p style={{ color: '#6a6a99', fontSize: '0.85rem' }}>
                支持 JPG、PNG 格式，建议使用正面免冠照
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-block',
                maxWidth: '280px',
                maxHeight: '280px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid rgba(74, 108, 247, 0.3)',
                marginBottom: '20px',
              }}>
                <img
                  src={imagePreview}
                  alt="预览"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {!result && (
                  <button
                    className="mbti-btn primary"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    style={{
                      opacity: analyzing ? 0.7 : 1,
                      cursor: analyzing ? 'not-allowed' : 'pointer',
                      fontSize: '1.05rem',
                      padding: '14px 36px',
                    }}
                  >
                    {analyzing ? '🔮 分析中...' : '🔮 开始面相分析'}
                  </button>
                )}
                <button
                  className="mbti-btn secondary"
                  onClick={handleReset}
                  style={{ fontSize: '1.05rem', padding: '14px 36px' }}
                >
                  🔄 重新上传
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* 分析中动画 */}
        {analyzing && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(20, 20, 50, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(74, 108, 247, 0.3)',
            borderRadius: '16px',
            marginBottom: '32px',
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '20px',
              animation: 'titlePulse 2s ease-in-out infinite',
            }}>
              🔮
            </div>
            <p style={{
              fontFamily: "'ZCOOL XiaoWei', serif",
              fontSize: '1.4rem',
              color: '#e8e8ff',
              marginBottom: '12px',
            }}>
              正在解读面相奥秘...
            </p>
            <p style={{
              color: '#a0a0cc',
              fontSize: '0.9rem',
              fontWeight: '300',
            }}>
              基于易经五行理论，综合分析五官面相
            </p>
            <div style={{
              width: '200px',
              height: '4px',
              background: 'rgba(74, 108, 247, 0.15)',
              borderRadius: '2px',
              margin: '24px auto 0',
              overflow: 'hidden',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #4a6cf7, #8b5cf6)',
                borderRadius: '2px',
                animation: 'loadingBar 1.5s ease-in-out infinite',
              }} />
            </div>
            <style>{`
              @keyframes loadingBar {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
          </div>
        )}

        {/* 分析结果 */}
        {result && (
          <div style={{ animation: 'pageIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            {/* 免责声明 */}
            <div className="bazi-disclaimer">
              ⚠️ 此分析基于传统面相学和易经理论，仅供娱乐和参考，不构成任何人生建议。
            </div>

            {/* 卡片1: 脸型分析 */}
            <div style={{
              background: 'rgba(20, 20, 50, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(74, 108, 247, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: '1.2rem',
                color: '#e8e8ff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span>🧑</span> 脸型分析
              </h3>
              <div style={{
                display: 'inline-block',
                padding: '6px 20px',
                borderRadius: '20px',
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#c4b5fd',
                fontSize: '1.1rem',
                fontWeight: '500',
                marginBottom: '16px',
              }}>
                {result.faceShape}
              </div>
              <p style={{
                color: '#a0a0cc',
                lineHeight: '1.9',
                fontSize: '0.95rem',
                fontWeight: '300',
              }}>
                {result.faceShapeDesc}
              </p>
            </div>

            {/* 卡片2: 五官分析 */}
            <div style={{
              background: 'rgba(20, 20, 50, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(74, 108, 247, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: '1.2rem',
                color: '#e8e8ff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span>✨</span> 五官分析
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Object.entries(result.fiveFeatures).map(([key, feature]) => (
                  <div
                    key={key}
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      background: 'rgba(10, 10, 30, 0.4)',
                      border: '1px solid rgba(74, 108, 247, 0.08)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{featureIcons[key]}</span>
                        <span style={{ color: '#e8e8ff', fontWeight: '500', fontSize: '1rem' }}>
                          {feature.name}
                        </span>
                        <span style={{
                          padding: '3px 12px',
                          borderRadius: '12px',
                          background: 'rgba(6, 182, 212, 0.1)',
                          border: '1px solid rgba(6, 182, 212, 0.2)',
                          color: '#06b6d4',
                          fontSize: '0.85rem',
                        }}>
                          {feature.type}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '1rem',
                              color: i < Math.round(feature.score / 20) ? '#f59e0b' : 'rgba(74, 108, 247, 0.2)',
                            }}
                          >
                            ★
                          </span>
                        ))}
                        <span style={{
                          marginLeft: '6px',
                          fontSize: '0.85rem',
                          color: '#a0a0cc',
                        }}>
                          {feature.score}
                        </span>
                      </div>
                    </div>
                    <p style={{
                      color: '#a0a0cc',
                      lineHeight: '1.8',
                      fontSize: '0.9rem',
                      fontWeight: '300',
                      marginBottom: '10px',
                    }}>
                      {feature.desc}
                    </p>
                    <p style={{
                      color: '#c4b5fd',
                      lineHeight: '1.8',
                      fontSize: '0.9rem',
                      fontWeight: '300',
                      fontStyle: 'italic',
                    }}>
                      🌟 运势：{feature.fortune}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 卡片3: 五行分析 */}
            <div style={{
              background: 'rgba(20, 20, 50, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(74, 108, 247, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: '1.2rem',
                color: '#e8e8ff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span>🌊</span> 五行分析
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {fiveElementConfig.map((elem) => {
                  const value = result.fiveElements[elem.key];
                  return (
                    <div key={elem.key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      <span style={{
                        width: '32px',
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '1rem',
                        color: elem.color,
                        flexShrink: 0,
                      }}>
                        {elem.label}
                      </span>
                      <div style={{
                        flex: 1,
                        height: '12px',
                        background: 'rgba(74, 108, 247, 0.1)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${value}%`,
                          height: '100%',
                          borderRadius: '6px',
                          background: `linear-gradient(90deg, ${elem.color}88, ${elem.color})`,
                          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: `0 0 10px ${elem.color}44`,
                        }} />
                      </div>
                      <span style={{
                        minWidth: '40px',
                        textAlign: 'right',
                        fontSize: '0.9rem',
                        color: '#a0a0cc',
                        fontWeight: '500',
                      }}>
                        {value}%
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{
                padding: '16px 20px',
                borderRadius: '10px',
                background: 'rgba(10, 10, 30, 0.4)',
                border: '1px solid rgba(74, 108, 247, 0.08)',
              }}>
                <p style={{
                  color: '#a0a0cc',
                  fontSize: '0.9rem',
                  lineHeight: '1.8',
                  fontWeight: '300',
                }}>
                  面相五行反映了个人的内在气质和运势倾向。五行均衡者性格平和、运势稳定；某一行偏旺者在该行所代表的特质上表现突出。
                  金主义理决断，木主仁慈成长，水主智慧变通，火主礼仪热情，土主信义包容。
                </p>
              </div>
            </div>

            {/* 卡片4: 运势分析 */}
            <div style={{
              background: 'rgba(20, 20, 50, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(74, 108, 247, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: '1.2rem',
                color: '#e8e8ff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span>🌟</span> 运势分析
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Object.entries(result.overallFortune).map(([key, fortune]) => (
                  <div
                    key={key}
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      background: 'rgba(10, 10, 30, 0.4)',
                      border: '1px solid rgba(74, 108, 247, 0.08)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{fortuneIcons[key]}</span>
                        <span style={{ color: '#e8e8ff', fontWeight: '500', fontSize: '1rem' }}>
                          {fortune.title}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '1rem',
                              color: i < Math.round(fortune.score / 20) ? '#f59e0b' : 'rgba(74, 108, 247, 0.2)',
                            }}
                          >
                            ★
                          </span>
                        ))}
                        <span style={{
                          marginLeft: '6px',
                          fontSize: '0.85rem',
                          color: '#a0a0cc',
                        }}>
                          {fortune.score}
                        </span>
                      </div>
                    </div>
                    <p style={{
                      color: '#a0a0cc',
                      lineHeight: '1.8',
                      fontSize: '0.9rem',
                      fontWeight: '300',
                      marginBottom: '10px',
                    }}>
                      {fortune.desc}
                    </p>
                    <p style={{
                      color: '#06b6d4',
                      lineHeight: '1.8',
                      fontSize: '0.9rem',
                      fontWeight: '300',
                    }}>
                      💡 建议：{fortune.advice}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 卡片5: 易经卦象 */}
            <div style={{
              background: 'rgba(20, 20, 50, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(74, 108, 247, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: '1.2rem',
                color: '#e8e8ff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span>☯️</span> 易经卦象
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(74, 108, 247, 0.2))',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'ZCOOL XiaoWei', serif",
                  fontSize: '1.6rem',
                  color: '#c4b5fd',
                  flexShrink: 0,
                }}>
                  {result.yijingHexagram.number}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'ZCOOL XiaoWei', serif",
                    fontSize: '1.5rem',
                    color: '#e8e8ff',
                    marginBottom: '4px',
                  }}>
                    {result.yijingHexagram.name}
                  </div>
                  <div style={{
                    color: '#6a6a99',
                    fontSize: '0.85rem',
                  }}>
                    第六十四卦之第 {result.yijingHexagram.number} 卦
                  </div>
                </div>
              </div>
              <div style={{
                padding: '16px 20px',
                borderRadius: '10px',
                background: 'rgba(10, 10, 30, 0.4)',
                border: '1px solid rgba(74, 108, 247, 0.08)',
                marginBottom: '16px',
              }}>
                <p style={{
                  color: '#a0a0cc',
                  lineHeight: '1.9',
                  fontSize: '0.95rem',
                  fontWeight: '300',
                }}>
                  {result.yijingHexagram.meaning}
                </p>
              </div>
              <div style={{
                padding: '16px 20px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.05)',
                border: '1px solid rgba(6, 182, 212, 0.15)',
              }}>
                <p style={{
                  color: '#06b6d4',
                  lineHeight: '1.9',
                  fontSize: '0.95rem',
                  fontWeight: '300',
                }}>
                  💡 卦象建议：{result.yijingHexagram.advice}
                </p>
              </div>
            </div>

            {/* 卡片6: 综合建议 */}
            <div style={{
              background: 'rgba(20, 20, 50, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(74, 108, 247, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontFamily: "'ZCOOL XiaoWei', serif",
                fontSize: '1.2rem',
                color: '#e8e8ff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span>📋</span> 综合建议
              </h3>

              {/* 幸运元素 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '14px',
                marginBottom: '24px',
              }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(10, 10, 30, 0.4)',
                  border: '1px solid rgba(74, 108, 247, 0.08)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎨</div>
                  <div style={{ color: '#6a6a99', fontSize: '0.8rem', marginBottom: '4px' }}>幸运色</div>
                  <div style={{ color: '#e8e8ff', fontWeight: '500', fontSize: '1.05rem' }}>
                    {result.luckyColor}
                  </div>
                </div>
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(10, 10, 30, 0.4)',
                  border: '1px solid rgba(74, 108, 247, 0.08)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔢</div>
                  <div style={{ color: '#6a6a99', fontSize: '0.8rem', marginBottom: '4px' }}>幸运数字</div>
                  <div style={{ color: '#e8e8ff', fontWeight: '500', fontSize: '1.05rem' }}>
                    {result.luckyNumber}
                  </div>
                </div>
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(10, 10, 30, 0.4)',
                  border: '1px solid rgba(74, 108, 247, 0.08)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🧭</div>
                  <div style={{ color: '#6a6a99', fontSize: '0.8rem', marginBottom: '4px' }}>幸运方位</div>
                  <div style={{ color: '#e8e8ff', fontWeight: '500', fontSize: '1.05rem' }}>
                    {result.luckyDirection}
                  </div>
                </div>
              </div>

              {/* 综合评语 */}
              <div style={{
                padding: '20px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(74, 108, 247, 0.05))',
                border: '1px solid rgba(139, 92, 246, 0.15)',
              }}>
                <div style={{
                  color: '#c4b5fd',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  marginBottom: '10px',
                  fontFamily: "'ZCOOL XiaoWei', serif",
                }}>
                  📜 综合评语
                </div>
                <p style={{
                  color: '#a0a0cc',
                  lineHeight: '2',
                  fontSize: '0.95rem',
                  fontWeight: '300',
                }}>
                  {result.summary}
                </p>
              </div>
            </div>

            {/* 操作区 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              paddingTop: '16px',
              flexWrap: 'wrap',
            }}>
              <button className="mbti-btn primary" onClick={handleReset}>
                🔄 重新分析
              </button>
              <button className="mbti-btn secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                ⬆️ 回到顶部
              </button>
            </div>

            {/* 底部免责声明 */}
            <div style={{
              marginTop: '40px',
              padding: '20px',
              borderRadius: '10px',
              background: 'rgba(10, 10, 30, 0.3)',
              border: '1px solid rgba(74, 108, 247, 0.08)',
              textAlign: 'center',
            }}>
              <p style={{
                color: '#6a6a99',
                fontSize: '0.8rem',
                lineHeight: '1.8',
                fontWeight: '300',
              }}>
                免责声明：面相分析基于传统面相学和易经五行理论，采用算法模拟生成，仅供娱乐参考。
                <br />
                分析结果不代表任何科学论断，不构成人生建议。请理性看待，切勿迷信。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacePage;
