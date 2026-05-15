import { useState, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';

const activities = [
  { id: 'exercise', name: '运动健身', percent: 18, color: '#10b981', icon: '🏃', desc: '跑步、游泳、瑜伽、太极、骑行、登山等', detail: '运动是FIRE退休者最重视的活动。保持身体健康是提前退休的前提和基础。' },
  { id: 'family', name: '陪伴家人', percent: 22, color: '#ec4899', icon: '👨‍👩‍👧‍👦', desc: '陪伴伴侣、照顾孙辈、家庭聚餐、亲子活动', detail: 'FIRE运动的核心动机之一就是有更多时间陪伴家人。' },
  { id: 'travel', name: '旅行探索', percent: 15, color: '#3b82f6', icon: '✈️', desc: '国内游、出境游、旅居生活、房车旅行', detail: '有了时间自由，旅行成为FIRE退休者的主要生活方式之一。' },
  { id: 'learn', name: '学习充电', percent: 12, color: '#8b5cf6', icon: '📚', desc: '阅读、在线课程、老年大学、学习新技能', detail: '终身学习是FIRE人群的显著特征，许多人退休后反而更忙。' },
  { id: 'social', name: '社交活动', percent: 10, color: '#f59e0b', icon: '🤝', desc: '朋友聚会、社区活动、兴趣社群、志愿服务', detail: '保持社交活跃对心理健康至关重要。' },
  { id: 'invest', name: '投资理财', percent: 8, color: '#06b6d4', icon: '📊', desc: '管理投资组合、研究市场、财务规划', detail: '虽然已退休，但资产管理仍是日常重要事务。' },
  { id: 'hobby', name: '兴趣爱好', percent: 10, color: '#f43f5e', icon: '🎨', desc: '园艺、烹饪、摄影、书法、音乐、手工', detail: '退休是发展兴趣爱好的黄金时期。' },
  { id: 'rest', name: '休闲放松', percent: 5, color: '#64748b', icon: '☕', desc: '品茶、冥想、午休、发呆、享受慢生活', detail: '学会享受"无所事事"的时光，是退休生活的重要课题。' }
];

function FirePage() {
  const { user, isLoggedIn } = useUser();
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [expandedCard, setExpandedCard] = useState(null);
  const [animLoaded, setAnimLoaded] = useState(false);

  // Trigger animation after mount
  useState(() => {
    const timer = setTimeout(() => setAnimLoaded(true), 100);
    return () => clearTimeout(timer);
  });

  const radius = 140;
  const circumference = 2 * Math.PI * radius;

  // Build pie slices using stroke-dasharray technique
  const slices = useMemo(() => {
    let accumulated = 0;
    return activities.map((act) => {
      const fraction = act.percent / 100;
      const dashLength = fraction * circumference;
      const gapLength = circumference - dashLength;
      const offset = -accumulated * circumference;
      accumulated += fraction;
      return { ...act, dashLength, gapLength, offset };
    });
  }, []);

  const handleSliceHover = (e, slice) => {
    setHoveredSlice(slice);
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleSliceLeave = () => {
    setHoveredSlice(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1025 40%, #0a0a1a 100%)',
      color: '#e2e8f0',
      fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
      padding: '40px 20px 60px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Starfield background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.3), transparent), radial-gradient(1.5px 1.5px at 50% 10%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 15% 85%, rgba(255,255,255,0.3), transparent), radial-gradient(1px 1px at 45% 45%, rgba(255,255,255,0.2), transparent), radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.3), transparent), radial-gradient(1.5px 1.5px at 25% 35%, rgba(255,255,255,0.2), transparent)',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ===== 1. Page Title ===== */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '2.6rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #f59e0b, #f43f5e, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px',
            letterSpacing: '2px',
          }}>
            退休生活 · FIRE运动
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#94a3b8',
            letterSpacing: '1px',
          }}>
            Financial Independence, Retire Early — 财务独立，提前退休
          </p>
        </div>

        {/* ===== 2. FIRE Introduction Card ===== */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '36px 40px',
          marginBottom: '48px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#f59e0b',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '1.8rem' }}>🔥</span>
            什么是FIRE运动？
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{
              background: 'rgba(245,158,11,0.06)',
              borderLeft: '3px solid #f59e0b',
              borderRadius: '0 12px 12px 0',
              padding: '16px 20px',
            }}>
              <p style={{ margin: 0, lineHeight: 1.8, color: '#cbd5e1' }}>
                <strong style={{ color: '#f59e0b' }}>起源：</strong>
                2010年代由 Vicki Robin 和 Joe Dominguez 的著作《Your Money or Your Life》普及推广，
                后经 Mr. Money Mustache 等博主的实践发扬光大，在全球范围内掀起了一场关于"重新定义工作与生活"的运动。
              </p>
            </div>

            <div style={{
              background: 'rgba(16,185,129,0.06)',
              borderLeft: '3px solid #10b981',
              borderRadius: '0 12px 12px 0',
              padding: '16px 20px',
            }}>
              <p style={{ margin: 0, lineHeight: 1.8, color: '#cbd5e1' }}>
                <strong style={{ color: '#10b981' }}>核心公式：</strong>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(16,185,129,0.15)',
                  borderRadius: '8px',
                  padding: '4px 14px',
                  margin: '0 6px',
                  fontWeight: 600,
                  color: '#10b981',
                  fontSize: '1.05rem',
                }}>
                  年支出 × 25 = FI目标金额
                </span>
                基于4%安全提取率（Trinity Study），即当你攒够年支出的25倍时，投资收益即可覆盖生活开销。
              </p>
            </div>

            <div>
              <p style={{ margin: '0 0 14px', color: '#94a3b8', fontWeight: 500 }}>三种FIRE路径：</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {[
                  { label: 'Lean FIRE（精简FIRE）', color: '#10b981', desc: '低消费生活方式，约40-50万即可实现，适合极简主义者', icon: '🌿' },
                  { label: 'Fat FIRE（丰裕FIRE）', color: '#f59e0b', desc: '维持较高消费水平，需要200万以上，适合高收入人群', icon: '💎' },
                  { label: 'Barista FIRE（咖啡师FIRE）', color: '#8b5cf6', desc: '半退休状态，兼职收入+投资组合，平衡自由与收入', icon: '☕' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: `rgba(${item.color === '#10b981' ? '16,185,129' : item.color === '#f59e0b' ? '245,158,11' : '139,92,246'},0.08)`,
                    border: `1px solid ${item.color}33`,
                    borderRadius: '14px',
                    padding: '18px 20px',
                  }}>
                    <div style={{ fontWeight: 600, color: item.color, marginBottom: '6px', fontSize: '0.95rem' }}>
                      {item.icon} {item.label}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== 3. Pie Chart Area ===== */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '48px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 600,
            color: '#e2e8f0',
            marginBottom: '8px',
            textAlign: 'center',
          }}>
            FIRE退休人群典型时间分配
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.88rem',
            marginBottom: '36px',
          }}>
            数据基于FIRE社群调研、国内高净值人群养老报告及45岁左右提前退休群体的普遍趋势综合整理
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '48px',
          }}>
            {/* SVG Pie Chart */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg
                width="340"
                height="340"
                viewBox="0 0 340 340"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.15))',
                  transform: animLoaded ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Glow circle behind */}
                <circle cx="170" cy="170" r={radius + 8} fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="16" />
                {/* Background circle */}
                <circle cx="170" cy="170" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="52" />

                {/* Pie slices */}
                {slices.map((slice, i) => (
                  <circle
                    key={slice.id}
                    cx="170"
                    cy="170"
                    r={radius}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth="52"
                    strokeDasharray={`${slice.dashLength} ${slice.gapLength}`}
                    strokeDashoffset={slice.offset}
                    strokeLinecap="butt"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '170px 170px',
                      opacity: animLoaded ? 1 : 0,
                      transition: `opacity 0.6s ease ${i * 0.1}s, stroke-width 0.2s ease`,
                      cursor: 'pointer',
                      strokeWidth: hoveredSlice === slice.id ? 58 : 52,
                    }}
                    onMouseEnter={(e) => handleSliceHover(e, slice.id)}
                    onMouseMove={(e) => handleSliceHover(e, slice.id)}
                    onMouseLeave={handleSliceLeave}
                  />
                ))}

                {/* Center circle (donut hole) */}
                <circle cx="170" cy="170" r={radius - 30} fill="#0a0a1a" />
                <circle cx="170" cy="170" r={radius - 30} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {/* Center text */}
                <text x="170" y="158" textAnchor="middle" fill="#94a3b8" fontSize="13" fontFamily="'PingFang SC', sans-serif">
                  FIRE退休
                </text>
                <text x="170" y="182" textAnchor="middle" fill="#e2e8f0" fontSize="18" fontWeight="600" fontFamily="'PingFang SC', sans-serif">
                  时间分配
                </text>

                {/* Tooltip */}
                {hoveredSlice && (() => {
                  const act = activities.find(a => a.id === hoveredSlice);
                  if (!act) return null;
                  return (
                    <g>
                      <rect
                        x={Math.min(Math.max(tooltipPos.x - 90, 10), 180)}
                        y={tooltipPos.y - 60}
                        width="180"
                        height="50"
                        rx="10"
                        fill="rgba(15,15,35,0.95)"
                        stroke={act.color}
                        strokeWidth="1"
                      />
                      <text
                        x={Math.min(Math.max(tooltipPos.x, 20), 260)}
                        y={tooltipPos.y - 36}
                        textAnchor="middle"
                        fill={act.color}
                        fontSize="14"
                        fontWeight="600"
                        fontFamily="'PingFang SC', sans-serif"
                      >
                        {act.icon} {act.name} ({act.percent}%)
                      </text>
                      <text
                        x={Math.min(Math.max(tooltipPos.x, 20), 260)}
                        y={tooltipPos.y - 18}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="11"
                        fontFamily="'PingFang SC', sans-serif"
                      >
                        {act.desc.length > 20 ? act.desc.slice(0, 20) + '...' : act.desc}
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Legend */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px 28px',
              minWidth: '280px',
            }}>
              {activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    background: hoveredSlice === act.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                  }}
                  onMouseEnter={() => setHoveredSlice(act.id)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '4px',
                    background: act.color,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${act.color}66`,
                  }} />
                  <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                    {act.icon} {act.name}
                  </span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: act.color,
                  }}>
                    {act.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.85rem',
            marginTop: '28px',
          }}>
            点击各板块查看详情
          </p>
        </div>

        {/* ===== 4. Activity Cards Grid ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '48px',
        }}>
          {activities.map((act) => {
            const isExpanded = expandedCard === act.id;
            return (
              <div
                key={act.id}
                onClick={() => setExpandedCard(isExpanded ? null : act.id)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid ${isExpanded ? act.color + '55' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '18px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isExpanded
                    ? `0 8px 32px ${act.color}22, 0 0 0 1px ${act.color}33`
                    : '0 4px 16px rgba(0,0,0,0.2)',
                  transform: isExpanded ? 'translateY(-4px)' : 'translateY(0)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = act.color + '33';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Accent line top */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${act.color}, ${act.color}88)`,
                  borderRadius: '18px 18px 0 0',
                }} />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{act.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '1.05rem' }}>{act.name}</div>
                    <div style={{ color: act.color, fontWeight: 700, fontSize: '1.3rem' }}>{act.percent}%</div>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  margin: 0,
                  color: '#94a3b8',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                }}>
                  {act.desc}
                </p>

                {/* Expanded detail */}
                <div style={{
                  maxHeight: isExpanded ? '200px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease, opacity 0.3s ease, margin 0.3s ease',
                  opacity: isExpanded ? 1 : 0,
                  marginTop: isExpanded ? '16px' : '0',
                }}>
                  <div style={{
                    background: `${act.color}11`,
                    border: `1px solid ${act.color}22`,
                    borderRadius: '12px',
                    padding: '16px',
                  }}>
                    <p style={{
                      margin: 0,
                      color: '#cbd5e1',
                      fontSize: '0.9rem',
                      lineHeight: 1.7,
                    }}>
                      {act.detail}
                    </p>
                  </div>
                </div>

                {/* Coming soon tag */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '0.72rem',
                  color: '#64748b',
                }}>
                  即将上线
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== 5. Footer ===== */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          padding: '36px 40px',
          textAlign: 'center',
        }}>
          <p style={{
            color: '#cbd5e1',
            fontSize: '1rem',
            lineHeight: 1.9,
            maxWidth: '700px',
            margin: '0 auto 24px',
          }}>
            理想的退休生活是多元平衡的。FIRE运动并非鼓励躺平，而是赋予每个人选择生活方式的自由。
            通过合理的财务规划和持续的自我投资，我们可以在更年轻的时候实现时间自由，
            用有限的生命去体验无限的可能。
          </p>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '20px',
          }}>
            <p style={{
              margin: 0,
              color: '#475569',
              fontSize: '0.78rem',
              lineHeight: 1.7,
            }}>
              免责声明：本页面数据仅供参考，基于公开资料和社群调研综合整理，不构成任何投资建议。
              FIRE运动的实际效果因个人财务状况、投资能力、消费习惯等因素而异。
              请根据自身情况谨慎决策，必要时咨询专业财务顾问。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FirePage;
