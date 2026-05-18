import { Link } from 'react-router-dom';
import { useState } from 'react';
import UserMenu from '../components/UserMenu';
import ContactModal from '../components/ContactModal';
import { useUser } from '../contexts/UserContext';

function HomePage({ data }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const { user } = useUser();

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

      {/* 底部联系按钮 */}
      <footer style={{
        textAlign: 'center',
        padding: '40px 20px',
        marginTop: '40px'
      }}>
        <button
          onClick={() => setShowContactModal(true)}
          style={{
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            borderRadius: '30px',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)';
          }}
        >
          💬 想对我说
        </button>
      </footer>

      {/* 联系弹窗 */}
      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          username={user || '匿名用户'}
        />
      )}
    </div>
  );
}

export default HomePage;
