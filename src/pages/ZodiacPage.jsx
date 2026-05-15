import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { analyzeZodiac } from '../data/zodiacEngine';

// 元素对应颜色
const elementColors = {
  '火': { bg: 'rgba(255, 87, 51, 0.15)', border: '#ff5733', text: '#ff7b5c' },
  '土': { bg: 'rgba(139, 119, 72, 0.15)', border: '#8b7748', text: '#c4a96a' },
  '风': { bg: 'rgba(100, 200, 255, 0.15)', border: '#64c8ff', text: '#8dd8ff' },
  '水': { bg: 'rgba(70, 130, 230, 0.15)', border: '#4682e6', text: '#6fa3f0' },
};

// 性格标签颜色池
const tagColors = [
  '#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7',
  '#9775fa', '#f783ac', '#38d9a9', '#e599f7', '#74c0fc',
];

function ZodiacPage() {
  const { user, isLoggedIn } = useUser();
  const [year, setYear] = useState(2000);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [result, setResult] = useState(null);

  // 根据月份计算天数
  const daysInMonth = useMemo(() => {
    const daysMap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // 简单判断闰年
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (month === 2 && !isLeap) return 28;
    return daysMap[month - 1] || 31;
  }, [year, month]);

  // 月份变化时修正日期
  const handleMonthChange = (val) => {
    const m = parseInt(val);
    setMonth(m);
    const maxDay = (() => {
      const daysMap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      if (m === 2 && !isLeap) return 28;
      return daysMap[m - 1] || 31;
    })();
    if (day > maxDay) setDay(maxDay);
  };

  const handleYearChange = (val) => {
    const y = parseInt(val);
    setYear(y);
    if (month === 2) {
      const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
      const maxDay = isLeap ? 29 : 28;
      if (day > maxDay) setDay(maxDay);
    }
  };

  const handleAnalyze = () => {
    const data = analyzeZodiac(year, month, day);
    setResult(data);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ec = result ? elementColors[result.element] || elementColors['火'] : elementColors['火'];

  // 生成年份选项
  const yearOptions = [];
  for (let y = 2026; y >= 1940; y--) yearOptions.push(y);

  // 生成月份选项
  const monthOptions = [];
  for (let m = 1; m <= 12; m++) monthOptions.push(m);

  // 生成日期选项
  const dayOptions = [];
  for (let d = 1; d <= daysInMonth; d++) dayOptions.push(d);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 30%, #1b0a2e 60%, #0a0a1a 100%)',
      color: '#e0e0e0',
      fontFamily: "'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ffd700, #ff8c00, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px',
            letterSpacing: '2px',
          }}>
            星座分析 · 星空下的自我
          </h1>
          <p style={{ color: '#888', fontSize: '15px' }}>
            选择你的出生日期，探索属于你的星座奥秘
          </p>
        </div>

        {/* 日期输入区 */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {/* 年 */}
            <div style={{ flex: '1', minWidth: '140px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: '#999',
                marginBottom: '8px',
                fontWeight: '500',
              }}>出生年份</label>
              <select value={year} onChange={e => handleYearChange(e.target.value)} style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: '#e0e0e0',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}>
                {yearOptions.map(y => <option key={y} value={y} style={{ background: '#1a1a2e' }}>{y}年</option>)}
              </select>
            </div>
            {/* 月 */}
            <div style={{ flex: '1', minWidth: '120px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: '#999',
                marginBottom: '8px',
                fontWeight: '500',
              }}>出生月份</label>
              <select value={month} onChange={e => handleMonthChange(e.target.value)} style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: '#e0e0e0',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}>
                {monthOptions.map(m => <option key={m} value={m} style={{ background: '#1a1a2e' }}>{m}月</option>)}
              </select>
            </div>
            {/* 日 */}
            <div style={{ flex: '1', minWidth: '120px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                color: '#999',
                marginBottom: '8px',
                fontWeight: '500',
              }}>出生日期</label>
              <select value={day} onChange={e => setDay(parseInt(e.target.value))} style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: '#e0e0e0',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}>
                {dayOptions.map(d => <option key={d} value={d} style={{ background: '#1a1a2e' }}>{d}日</option>)}
              </select>
            </div>
            {/* 分析按钮 */}
            <div style={{ flex: '0 0 auto' }}>
              <button onClick={handleAnalyze} style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                border: 'none',
                borderRadius: '10px',
                color: '#0a0a1a',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 20px rgba(255, 165, 0, 0.3)',
              }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 30px rgba(255, 165, 0, 0.5)'; }}
                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(255, 165, 0, 0.3)'; }}
              >
                查看我的星座
              </button>
            </div>
          </div>
        </div>

        {/* 结果展示 */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ====== 星座概览卡片 ====== */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${ec.border}33`,
              borderRadius: '16px',
              padding: '36px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${ec.border}, transparent)`,
              }} />
              <div style={{ fontSize: '72px', marginBottom: '8px', lineHeight: 1.2 }}>{result.symbol}</div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: ec.text,
                marginBottom: '6px',
              }}>{result.sign}</h2>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>{result.dateRange}</p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                flexWrap: 'wrap',
              }}>
                <InfoItem label="元素" value={result.element} color={ec.text} />
                <InfoItem label="宫位" value={result.quality} />
                <InfoItem label="守护星" value={result.rulingPlanet} />
              </div>
              <p style={{
                color: '#aaa',
                fontSize: '14px',
                lineHeight: '1.8',
                marginTop: '24px',
                padding: '0 12px',
              }}>{result.elementDesc}</p>
            </div>

            {/* ====== 性格特点卡片 ====== */}
            <Card title="性格特点" icon="✦">
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#ccc', fontSize: '14px', marginBottom: '12px', fontWeight: '500' }}>性格标签</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {result.personality.traits.map((t, i) => (
                    <span key={i} style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500',
                      background: `${tagColors[i % tagColors.length]}22`,
                      border: `1px solid ${tagColors[i % tagColors.length]}44`,
                      color: tagColors[i % tagColors.length],
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  background: 'rgba(105, 219, 124, 0.06)',
                  border: '1px solid rgba(105, 219, 124, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                }}>
                  <h4 style={{ color: '#69db7c', fontSize: '13px', marginBottom: '10px', fontWeight: '600' }}>优势</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {result.personality.strengths.map((s, i) => (
                      <li key={i} style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.8', paddingLeft: '16px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#69db7c' }}>+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{
                  background: 'rgba(255, 107, 107, 0.06)',
                  border: '1px solid rgba(255, 107, 107, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                }}>
                  <h4 style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '10px', fontWeight: '600' }}>劣势</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {result.personality.weaknesses.map((w, i) => (
                      <li key={i} style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.8', paddingLeft: '16px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#ff6b6b' }}>-</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.9' }}>{result.personality.description}</p>
            </Card>

            {/* ====== 感情运势卡片 ====== */}
            <Card title="感情运势" icon="♥">
              <h4 style={{ color: '#ccc', fontSize: '14px', marginBottom: '14px', fontWeight: '500' }}>最佳配对</h4>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {result.love.compatibility.map((c, i) => (
                  <div key={i} style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '2px solid rgba(255, 105, 180, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s',
                  }}>
                    <span style={{ fontSize: '22px', lineHeight: 1 }}>
                      {zodiacData[c] ? zodiacData[c].symbol : ''}
                    </span>
                    <span style={{ fontSize: '10px', color: '#ff69b4', marginTop: '2px' }}>{c}</span>
                  </div>
                ))}
              </div>
              <Section label="感情运势" text={result.love.description} />
              <Section label="感情建议" text={result.love.advice} accent />
            </Card>

            {/* ====== 事业运势卡片 ====== */}
            <Card title="事业运势" icon="★">
              <h4 style={{ color: '#ccc', fontSize: '14px', marginBottom: '14px', fontWeight: '500' }}>适合职业</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                {result.career.suitableJobs.map((j, i) => (
                  <span key={i} style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    background: 'rgba(255, 215, 0, 0.08)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    color: '#ffd700',
                    fontWeight: '500',
                  }}>{j}</span>
                ))}
              </div>
              <Section label="事业运势" text={result.career.description} />
              <Section label="事业建议" text={result.career.advice} accent />
            </Card>

            {/* ====== 健康运势卡片 ====== */}
            <Card title="健康运势" icon="✚">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                padding: '14px 18px',
                background: 'rgba(56, 217, 169, 0.06)',
                border: '1px solid rgba(56, 217, 169, 0.15)',
                borderRadius: '10px',
              }}>
                <span style={{ fontSize: '20px' }}>◎</span>
                <div>
                  <span style={{ color: '#38d9a9', fontSize: '12px', fontWeight: '600' }}>关注部位</span>
                  <p style={{ color: '#ddd', fontSize: '14px', margin: '2px 0 0' }}>{result.health.focus}</p>
                </div>
              </div>
              <Section label="健康描述" text={result.health.description} />
              <Section label="健康建议" text={result.health.advice} accent />
            </Card>

            {/* ====== 幸运元素卡片 ====== */}
            <Card title="幸运元素" icon="✧">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
              }}>
                <LuckyItem label="幸运色" value={result.lucky.color} bg="rgba(255, 107, 107, 0.1)" color="#ff6b6b" />
                <LuckyItem label="幸运数字" value={String(result.lucky.number)} bg="rgba(77, 171, 247, 0.1)" color="#4dabf7" />
                <LuckyItem label="幸运宝石" value={result.lucky.gem} bg="rgba(151, 117, 250, 0.1)" color="#9775fa" />
                <LuckyItem label="幸运日" value={result.lucky.day} bg="rgba(255, 212, 59, 0.1)" color="#ffd43b" />
              </div>
            </Card>

            {/* ====== 名人同星座卡片 ====== */}
            <Card title="名人同星座" icon="♛">
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
              }}>
                {result.celebrities.map((name, i) => (
                  <div key={i} style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${ec.border}44, ${ec.border}22)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      color: ec.text,
                    }}>{result.symbol}</div>
                    <span style={{ color: '#ddd', fontSize: '14px', fontWeight: '500' }}>{name}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* ====== 2026年运势卡片 ====== */}
            <Card title="2026 蛇年运势" icon="🐍">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FortuneRow label="整体运势" text={result.yearlyFortune.overall} color="#ffd700" />
                <FortuneRow label="感情运势" text={result.yearlyFortune.love} color="#ff69b4" />
                <FortuneRow label="事业运势" text={result.yearlyFortune.career} color="#4dabf7" />
                <FortuneRow label="财运" text={result.yearlyFortune.wealth} color="#69db7c" />
              </div>
            </Card>

            {/* 重新查询按钮 */}
            <div style={{ textAlign: 'center', marginTop: '12px', marginBottom: '20px' }}>
              <button onClick={handleReset} style={{
                padding: '14px 40px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: '#ccc',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.target.style.borderColor = ec.border; e.target.style.color = ec.text; }}
                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.color = '#ccc'; }}
              >
                重新查询
              </button>
            </div>

            {/* 免责声明 */}
            <div style={{
              textAlign: 'center',
              padding: '20px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <p style={{ color: '#555', fontSize: '12px', lineHeight: '1.8' }}>
                免责声明：星座分析仅供娱乐参考，不构成任何专业建议。每个人的性格和命运都受到多种因素影响，
                请理性看待星座分析结果，切勿将其作为人生决策的唯一依据。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====== 子组件 ====== */

function Card({ title, icon, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px',
      padding: '28px',
      transition: 'border-color 0.3s',
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#e8e8e8',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '20px' }}>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: color || '#e0e0e0', fontSize: '16px', fontWeight: '600' }}>{value}</div>
    </div>
  );
}

function Section({ label, text, accent }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4 style={{
        color: accent ? '#ffd700' : '#999',
        fontSize: '13px',
        marginBottom: '8px',
        fontWeight: '500',
      }}>{label}</h4>
      <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.9' }}>{text}</p>
    </div>
  );
}

function LuckyItem({ label, value, bg, color }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '20px 12px',
      borderRadius: '12px',
      background: bg,
      border: `1px solid ${color}22`,
    }}>
      <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>{label}</div>
      <div style={{ color, fontSize: '16px', fontWeight: '600' }}>{value}</div>
    </div>
  );
}

function FortuneRow({ label, text, color }) {
  return (
    <div style={{
      padding: '18px',
      borderRadius: '12px',
      background: `${color}08`,
      borderLeft: `3px solid ${color}`,
    }}>
      <h4 style={{ color, fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>{label}</h4>
      <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.9', margin: 0 }}>{text}</p>
    </div>
  );
}

// 用于配对星座符号查找
const zodiacData = {
  '白羊座': { symbol: '♈' }, '金牛座': { symbol: '♉' }, '双子座': { symbol: '♊' },
  '巨蟹座': { symbol: '♋' }, '狮子座': { symbol: '♌' }, '处女座': { symbol: '♍' },
  '天秤座': { symbol: '♎' }, '天蝎座': { symbol: '♏' }, '射手座': { symbol: '♐' },
  '摩羯座': { symbol: '♑' }, '水瓶座': { symbol: '♒' }, '双鱼座': { symbol: '♓' },
};

export default ZodiacPage;
