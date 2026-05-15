import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';

function DetailPage({ siteData }) {
  const { categoryId, topicId } = useParams();

  // Find the parent category data
  const parentCategory = siteData[categoryId];
  if (!parentCategory) {
    return (
      <div className="page-enter">
        <div className="page-container">
          <h1 className="page-title">页面未找到</h1>
          <p className="page-subtitle">请返回首页重新导航</p>
          <Link to="/" className="back-btn">← 返回首页</Link>
        </div>
      </div>
    );
  }

  // Find the topic data
  const topic = parentCategory.categories.find(c => c.id === topicId);
  if (!topic) {
    return (
      <div className="page-enter">
        <div className="page-container">
          <h1 className="page-title">内容未找到</h1>
          <p className="page-subtitle">请返回上级页面重新选择</p>
          <Link to={`/${categoryId}`} className="back-btn">← 返回 {parentCategory.title}</Link>
        </div>
      </div>
    );
  }

  const detail = topic.detail;

  return (
    <div className="page-enter">
      <div className="page-container">
        <Breadcrumb
          items={[
            { label: parentCategory.title, path: `/${categoryId}` },
            { label: topic.title },
          ]}
        />

        <Link to={`/${categoryId}`} className="back-btn">
          ← 返回 {parentCategory.title}
        </Link>

        {/* MBTI 测试入口 - 仅在"我的性格"页面显示 */}
        {categoryId === 'whoami' && topicId === 'personality' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <Link to="/whoami/mbti-test" className="glass-card" style={{
              display: 'block',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(74, 108, 247, 0.08))',
              borderColor: 'rgba(139, 92, 246, 0.3)',
            }}>
              <span className="card-icon">🧪</span>
              <h3 className="card-title" style={{ color: 'var(--accent-purple)' }}>MBTI 性格测试</h3>
              <p className="card-desc">通过28道精选题目，探索你的MBTI性格类型，了解适合的职业和与你同类型的名人</p>
            </Link>
            <Link to="/whoami/mbti-history" className="glass-card" style={{
              display: 'block',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(16, 185, 129, 0.08))',
              borderColor: 'rgba(6, 182, 212, 0.3)',
            }}>
              <span className="card-icon">📋</span>
              <h3 className="card-title" style={{ color: 'var(--accent-cyan)' }}>查看历史测试</h3>
              <p className="card-desc">登录后查看您保存的所有MBTI测试结果，包括测试时间和性格类型</p>
            </Link>
          </div>
        )}

        {/* 八字分析入口 - 仅在"我的八字"页面显示 */}
        {categoryId === 'whoami' && topicId === 'bazi' && (
          <Link to="/whoami/bazi-analyze" className="glass-card" style={{
            display: 'block',
            marginBottom: '24px',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(234, 88, 12, 0.08))',
            borderColor: 'rgba(245, 158, 11, 0.3)',
          }}>
            <span className="card-icon">🔮</span>
            <h3 className="card-title" style={{ color: 'var(--accent-gold)' }}>八字命理分析</h3>
            <p className="card-desc">输入出生日期时间，自动计算生辰八字，基于易经分析命运、财运、婚姻、事业、运势</p>
          </Link>
        )}

        <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '12px' }}>
          {detail.title}
        </h1>
        <p className="page-subtitle" style={{ textAlign: 'left', marginBottom: '32px', letterSpacing: '0' }}>
          {topic.desc}
        </p>

        {/* 同级导航 */}
        <div className="sub-nav" style={{ marginBottom: '32px' }}>
          {parentCategory.categories.map((cat) => (
            <Link
              to={`/${categoryId}/${cat.id}`}
              key={cat.id}
              className={`sub-nav-link ${cat.id === topicId ? 'active' : ''}`}
            >
              {cat.icon} {cat.title}
            </Link>
          ))}
        </div>

        {/* 详细内容 */}
        <div className="detail-content">
          {detail.sections.map((section, index) => (
            <div key={index}>
              <h2>{section.heading}</h2>
              {section.content.split('\n\n').map((paragraph, pIndex) => {
                if (paragraph.startsWith('•') || paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('4.') || paragraph.startsWith('5.') || paragraph.startsWith('6.') || paragraph.startsWith('7.') || paragraph.startsWith('8.') || paragraph.startsWith('9.')) {
                  const lines = paragraph.split('\n').filter(l => l.trim());
                  return (
                    <ul key={pIndex}>
                      {lines.map((line, lIndex) => (
                        <li key={lIndex} dangerouslySetInnerHTML={{
                          __html: line
                            .replace(/【(.+?)】/g, '<strong style="color: var(--accent-cyan);">$1</strong>')
                            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #818cf8; text-decoration: underline;">$1</a>')
                        }} />
                      ))}
                    </ul>
                  );
                }
                if (paragraph.startsWith('「') || paragraph.startsWith('"') || paragraph.startsWith('"') || paragraph.startsWith('『')) {
                  return <blockquote key={pIndex}>{paragraph}</blockquote>;
                }
                return (
                  <p key={pIndex} dangerouslySetInnerHTML={{
                    __html: paragraph
                      .replace(/【(.+?)】/g, '<strong style="color: var(--accent-cyan);">$1</strong>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #818cf8; text-decoration: underline;">$1</a>')
                  }} />
                );
              })}
            </div>
          ))}

          {/* 迭代开发提示 */}
          <div style={{
            marginTop: '48px',
            padding: '24px',
            background: 'rgba(139, 92, 246, 0.05)',
            border: '1px dashed rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
          }}>
            <p>📝 此页面支持迭代开发，您可以持续添加和更新内容</p>
            <p style={{ marginTop: '8px' }}>最后更新时间：{new Date().toLocaleDateString('zh-CN')}</p>
          </div>
        </div>

        {/* 上一篇/下一篇导航 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '32px',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          {(() => {
            const currentIndex = parentCategory.categories.findIndex(c => c.id === topicId);
            const prevTopic = currentIndex > 0 ? parentCategory.categories[currentIndex - 1] : null;
            const nextTopic = currentIndex < parentCategory.categories.length - 1 ? parentCategory.categories[currentIndex + 1] : null;
            return (
              <>
                {prevTopic ? (
                  <Link
                    to={`/${categoryId}/${prevTopic.id}`}
                    className="back-btn"
                    style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
                  >
                    ← {prevTopic.title}
                  </Link>
                ) : <div style={{ flex: 1 }} />}
                {nextTopic ? (
                  <Link
                    to={`/${categoryId}/${nextTopic.id}`}
                    className="back-btn"
                    style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
                  >
                    {nextTopic.title} →
                  </Link>
                ) : <div style={{ flex: 1 }} />}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
