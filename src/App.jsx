import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { UserProvider } from './contexts/UserContext';
import CosmicBackground from './components/CosmicBackground';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import DetailPage from './pages/DetailPage';
import MbtiTestPage from './pages/MbtiTestPage';
import MbtiHistoryPage from './pages/MbtiHistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import BaziPage from './pages/BaziPage';
import BbsPage from './pages/BbsPage';
import FacePage from './pages/FacePage';
import ZodiacPage from './pages/ZodiacPage';
import PssPage from './pages/PssPage';
import LovePage from './pages/LovePage';
import FirePage from './pages/FirePage';
import DnaQuizPage from './pages/DnaQuizPage';
import { siteData } from './data/siteData';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <UserProvider>
      <CosmicBackground />
      <ScrollToTop />
      <main className="main-content">
        <Routes>
          {/* 首页 - 终极三问 */}
          <Route
            path="/"
            element={<HomePage data={siteData.home} />}
          />

          {/* 第二级 - 我是谁 */}
          <Route
            path="/whoami"
            element={
              <CategoryPage
                data={siteData.whoami}
                parentData={{ id: 'whoami' }}
              />
            }
          />

          {/* 第二级 - 我从哪里来 */}
          <Route
            path="/wherefrom"
            element={
              <CategoryPage
                data={siteData.wherefrom}
                parentData={{ id: 'wherefrom' }}
              />
            }
          />

          {/* 第二级 - 我要到哪里去 */}
          <Route
            path="/whereto"
            element={
              <CategoryPage
                data={siteData.whereto}
                parentData={{ id: 'whereto' }}
              />
            }
          />

          {/* MBTI 性格测试 */}
          <Route
            path="/whoami/mbti-test"
            element={<MbtiTestPage />}
          />

          {/* MBTI 测试历史记录 */}
          <Route
            path="/whoami/mbti-history"
            element={<MbtiHistoryPage />}
          />

          {/* 八字分析 */}
          <Route
            path="/whoami/bazi-analyze"
            element={<BaziPage />}
          />

          {/* 面相分析 */}
          <Route
            path="/whoami/face-analyze"
            element={<FacePage />}
          />

          {/* 星座分析 */}
          <Route
            path="/whoami/zodiac-analyze"
            element={<ZodiacPage />}
          />

          {/* 压力测试 */}
          <Route
            path="/whoami/stress-test"
            element={<PssPage />}
          />

          {/* 择偶观测评 */}
          <Route
            path="/whoami/love-test"
            element={<LovePage />}
          />

          {/* DNA趣味问答 */}
          <Route
            path="/wherefrom/dna-quiz"
            element={<DnaQuizPage />}
          />

          {/* 退休生活FIRE */}
          <Route
            path="/whereto/retire-life"
            element={<FirePage />}
          />

          {/* 美食BBS */}
          <Route
            path="/whereto/food"
            element={<BbsPage category="food" title="西安美食" icon="🍜" />}
          />

          {/* 玩乐BBS */}
          <Route
            path="/whereto/play"
            element={<BbsPage category="play" title="西安玩乐" icon="🎯" />}
          />

          {/* 管理员面板 */}
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          {/* 第三级 - 各子分类详情页 */}
          <Route
            path="/:categoryId/:topicId"
            element={<DetailPage siteData={siteData} />}
          />
        </Routes>
      </main>
    </UserProvider>
  );
}

export default App;
