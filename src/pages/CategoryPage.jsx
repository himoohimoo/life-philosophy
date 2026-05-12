import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';

function CategoryPage({ data, parentData }) {
  // 获取卡片链接
  const getCardLink = (cat) => {
    return cat.route || `/${parentData.id}/${cat.id}`;
  };
  
  return (
    <div className="page-enter">
      <div className="page-container">
        <Breadcrumb
          items={[{ label: data.title }]}
        />

        <div className="category-header">
          <span className="category-icon">{data.icon}</span>
          <h1 className="page-title">{data.title}</h1>
          <p className="page-subtitle">{data.subtitle}</p>
          <p className="page-subtitle" style={{ fontSize: '0.95rem', maxWidth: '700px', margin: '0 auto' }}>
            {data.description}
          </p>
        </div>

        {/* 子导航标签 */}
        <div className="sub-nav">
          {data.categories.map((cat) => (
            <Link
              to={getCardLink(cat)}
              key={cat.id}
              className="sub-nav-link"
            >
              {cat.icon} {cat.title}
            </Link>
          ))}
        </div>

        {/* 卡片网格 */}
        <div className="card-grid">
          {data.categories.map((cat) => (
            <Link
              to={getCardLink(cat)}
              key={cat.id}
              className="glass-card"
            >
              <span className="card-icon">{cat.icon}</span>
              <h3 className="card-title">{cat.title}</h3>
              <p className="card-desc">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
