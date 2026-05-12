import { Link } from 'react-router-dom';
import UserMenu from '../components/UserMenu';

function HomePage({ data }) {
  return (
    <div className="page-enter">
      {/* 右上角用户菜单 */}
      <header className="home-header">
        <UserMenu />
      </header>

      <section className="hero-section">
        <h1 className="hero-title">终极三问</h1>
        <p className="hero-subtitle">穿越时空的哲学之旅 · 探索生命的终极答案</p>
        <div className="questions-grid">
          {data.questions.map((q) => (
            <Link
              to={`/${q.id}`}
              key={q.id}
              className="question-card"
              style={{ '--card-gradient': q.gradient }}
            >
              <span className="question-icon">{q.icon}</span>
              <h2 className="question-title">{q.title}</h2>
              <p className="question-desc">{q.desc}</p>
              <span className="question-arrow">探索 →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
