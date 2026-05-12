import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { calculateBazi, analyzeFiveElements, generateBaziReading, getZodiacInfo } from '../data/baziEngine';
import { saveBaziResult } from '../utils/auth';

function BaziPage() {
  const { user, isLoggedIn } = useUser();
  const [birthDate, setBirthDate] = useState('');
  const [birthHour, setBirthHour] = useState('12');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!birthDate) return;

    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = parseInt(birthHour);

    try {
      const bazi = calculateBazi(year, month, day, hour);
      const fiveElements = analyzeFiveElements(bazi);
      const reading = generateBaziReading(bazi, fiveElements);
      const zodiac = getZodiacInfo(year);

      setResult({ bazi, fiveElements, reading, zodiac, birthInfo: { year, month, day, hour, gender } });
      setSaveMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    if (!isLoggedIn || !result || !user) {
      setSaveMessage('⚠️ 请先登录');
      return;
    }
    const res = saveBaziResult(user, {
      birthInfo: result.birthInfo,
      bazi: result.bazi,
      fiveElements: result.fiveElements,
      zodiac: result.zodiac,
    });
    setSaveMessage(res.success ? '✅ 分析结果已保存！' : '❌ 保存失败');
  };

  const pillarLabels = ['年柱', '月柱', '日柱', '时柱'];
  const pillarKeys = ['year', 'month', 'day', 'hour'];

  return (
    <div className="page-enter">
      <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Breadcrumb />

        {/* 输入区 */}
        <div className="bazi-input-card">
          <h2 className="bazi-input-title">☯️ 输入生辰八字</h2>
          <p className="bazi-input-desc">请输入您的出生日期和时间，系统将自动计算八字并生成分析报告</p>

          <form onSubmit={handleSubmit} className="bazi-form">
            <div className="bazi-form-row">
              <div className="bazi-form-group">
                <label>出生日期</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="bazi-input"
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="bazi-form-group">
                <label>出生时辰</label>
                <select value={birthHour} onChange={e => setBirthHour(e.target.value)} className="bazi-input">
                  {[
                    ['0','子时 (23:00-01:00)'],['1','丑时 (01:00-03:00)'],['3','寅时 (03:00-05:00)'],
                    ['5','卯时 (05:00-07:00)'],['7','辰时 (07:00-09:00)'],['9','巳时 (09:00-11:00)'],
                    ['11','午时 (11:00-13:00)'],['13','未时 (13:00-15:00)'],['15','申时 (15:00-17:00)'],
                    ['17','酉时 (17:00-19:00)'],['19','戌时 (19:00-21:00)'],['21','亥时 (21:00-23:00)'],
                  ].map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="bazi-form-group">
                <label>性别</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="bazi-input">
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
            </div>
            <button type="submit" className="mbti-btn primary" style={{ marginTop: '16px' }}>
              🔮 开始分析
            </button>
          </form>
        </div>

        {/* 结果区 */}
        {result && (
          <div className="bazi-result">
            {/* 免责声明 */}
            <div className="bazi-disclaimer">
              ⚠️ 此分析基于传统命理学和易经理论，仅供娱乐和参考，不构成任何人生建议。
            </div>

            {/* 八字四柱 */}
            <div className="bazi-pillars-card">
              <h3 className="bazi-section-title">📐 生辰八字</h3>
              <div className="bazi-pillars">
                {pillarKeys.map((key, i) => {
                  const p = result.bazi[key];
                  return (
                    <div key={key} className="bazi-pillar">
                      <div className="pillar-label">{pillarLabels[i]}</div>
                      <div className="pillar-stem">{p.stem}</div>
                      <div className="pillar-branch">{p.branch}</div>
                      <div className="pillar-element" style={{ color: getElementColor(p.element) }}>
                        {p.element}
                      </div>
                      <div className="pillar-yinyang">{p.yinYang}</div>
                    </div>
                  );
                })}
              </div>
              {/* 生肖信息 */}
              <div className="bazi-zodiac">
                <span>生肖：<strong>{result.zodiac.animal}</strong></span>
                <span>五行属：<strong style={{ color: getElementColor(result.zodiac.element) }}>{result.zodiac.element}</strong></span>
                <span>{result.zodiac.yinYang}</span>
              </div>
            </div>

            {/* 五行分布 */}
            <div className="bazi-five-elements-card">
              <h3 className="bazi-section-title">🌊 五行分析</h3>
              <div className="five-elements-bars">
                {['金','木','水','火','土'].map(elem => {
                  const count = result.fiveElements.distribution[elem] || 0;
                  const maxCount = Math.max(...Object.values(result.fiveElements.distribution), 1);
                  const pct = (count / maxCount) * 100;
                  const isMissing = result.fiveElements.missing.includes(elem);
                  return (
                    <div key={elem} className="fe-row">
                      <span className="fe-label" style={{ color: getElementColor(elem) }}>{elem}</span>
                      <div className="fe-bar-track">
                        <div className="fe-bar-fill" style={{
                          width: isMissing ? '0%' : `${pct}%`,
                          background: getElementColor(elem),
                        }} />
                      </div>
                      <span className="fe-value">{isMissing ? '缺' : count.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="fe-summary">
                {result.fiveElements.missing.length > 0 && (
                  <p>缺失五行：<strong>{result.fiveElements.missing.join('、')}</strong>（建议在日常生活中适当补充）</p>
                )}
                <p>最旺五行：<strong style={{ color: getElementColor(result.fiveElements.dominant) }}>{result.fiveElements.dominant}</strong></p>
                <p>最弱五行：<strong style={{ color: getElementColor(result.fiveElements.weak) }}>{result.fiveElements.weak}</strong></p>
                <p>五行平衡度：<strong>{result.fiveElements.balance}%</strong></p>
              </div>
            </div>

            {/* 六维分析 */}
            <div className="bazi-readings">
              {Object.values(result.reading).map((item, i) => (
                <div key={i} className="bazi-reading-card">
                  <div className="reading-header">
                    <span className="reading-icon">{item.icon}</span>
                    <h3>{item.title}</h3>
                    <div className="reading-score">
                      {Array.from({ length: 5 }, (_, s) => (
                        <span key={s} className={'score-star ' + (s < item.score ? 'active' : '')}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="reading-content">{item.content}</p>
                </div>
              ))}
            </div>

            {/* 保存按钮 */}
            <div className="bazi-actions">
              <button className="mbti-btn primary" onClick={handleSave}>
                {isLoggedIn ? '💾 保存分析结果' : '🔐 登录后保存'}
              </button>
              {saveMessage && <span className="bazi-save-msg">{saveMessage}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getElementColor(element) {
  const colors = { '金': '#f59e0b', '木': '#10b981', '水': '#3b82f6', '火': '#ef4444', '土': '#a78bfa' };
  return colors[element] || '#888';
}

function Breadcrumb() {
  return (
    <nav className="breadcrumb">
      <Link to="/">🏠 首页</Link>
      <span className="separator">›</span>
      <Link to="/whoami">我是谁</Link>
      <span className="separator">›</span>
      <Link to="/whoami/bazi">我的八字</Link>
      <span className="separator">›</span>
      <span className="current">八字分析</span>
    </nav>
  );
}

export default BaziPage;
