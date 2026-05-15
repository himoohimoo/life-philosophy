import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getDNAQuestions, calculateScore } from '../data/dnaQuizEngine';

// DNA趣味问答页面 - 暗色宇宙主题
export default function DnaQuizPage() {
  const { user } = useUser();
  const [gameState, setGameState] = useState('intro'); // intro, playing, result
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [result, setResult] = useState(null);

  // 宇宙暗色主题样式
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0f0f2e 100%)',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      color: '#e8e8f0',
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '10px',
      background: 'linear-gradient(90deg, #64b5f6, #90caf9, #a5d6a7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      textAlign: 'center',
      color: '#9fa8da',
      fontSize: '1.1rem',
      marginBottom: '40px',
    },
    card: {
      background: 'rgba(30, 30, 60, 0.6)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '40px',
      border: '1px solid rgba(100, 181, 246, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(100, 181, 246, 0.1)',
    },
    introText: {
      fontSize: '1.1rem',
      lineHeight: '1.8',
      color: '#c5cae9',
      marginBottom: '30px',
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '30px',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0',
      color: '#b0bec5',
      fontSize: '1rem',
    },
    featureIcon: {
      width: '24px',
      height: '24px',
      background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      color: 'white',
    },
    startButton: {
      width: '100%',
      padding: '18px 40px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },
    progressContainer: {
      marginBottom: '30px',
    },
    progressInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      color: '#9fa8da',
      fontSize: '0.95rem',
    },
    progressBar: {
      height: '8px',
      background: 'rgba(100, 181, 246, 0.2)',
      borderRadius: '4px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #64b5f6, #42a5f5, #66bb6a)',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
    },
    scoreBadge: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(100, 181, 246, 0.2)',
      padding: '8px 16px',
      borderRadius: '20px',
      color: '#64b5f6',
      fontWeight: 'bold',
      fontSize: '0.9rem',
    },
    questionCard: {
      position: 'relative',
    },
    questionNumber: {
      fontSize: '0.9rem',
      color: '#64b5f6',
      marginBottom: '15px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    questionText: {
      fontSize: '1.3rem',
      fontWeight: '500',
      color: '#e8eaf6',
      marginBottom: '30px',
      lineHeight: '1.6',
    },
    optionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '20px',
    },
    optionButton: {
      padding: '16px 20px',
      fontSize: '1rem',
      textAlign: 'left',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid rgba(100, 181, 246, 0.3)',
      borderRadius: '12px',
      color: '#e8eaf6',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    optionButtonHover: {
      background: 'rgba(100, 181, 246, 0.1)',
      borderColor: 'rgba(100, 181, 246, 0.5)',
    },
    optionSelected: {
      background: 'rgba(100, 181, 246, 0.2)',
      borderColor: '#64b5f6',
    },
    optionCorrect: {
      background: 'rgba(102, 187, 106, 0.2)',
      borderColor: '#66bb6a',
    },
    optionWrong: {
      background: 'rgba(239, 83, 80, 0.2)',
      borderColor: '#ef5350',
    },
    optionLabel: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'rgba(100, 181, 246, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: '#64b5f6',
      flexShrink: 0,
    },
    explanationBox: {
      marginTop: '20px',
      padding: '20px',
      background: 'rgba(100, 181, 246, 0.1)',
      borderRadius: '12px',
      borderLeft: '4px solid #64b5f6',
    },
    explanationTitle: {
      fontWeight: 'bold',
      color: '#64b5f6',
      marginBottom: '8px',
    },
    explanationText: {
      color: '#b0bec5',
      lineHeight: '1.6',
    },
    nextButton: {
      width: '100%',
      padding: '16px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: 'white',
      background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'all 0.3s ease',
    },
    resultContainer: {
      textAlign: 'center',
    },
    resultScore: {
      fontSize: '4rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #64b5f6, #42a5f5, #66bb6a)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '10px',
    },
    resultLevel: {
      fontSize: '1.5rem',
      color: '#90caf9',
      marginBottom: '30px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px',
      marginBottom: '30px',
    },
    statBox: {
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '20px',
      borderRadius: '12px',
    },
    statValue: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#64b5f6',
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#9fa8da',
      marginTop: '5px',
    },
    wrongAnswersSection: {
      marginTop: '30px',
      textAlign: 'left',
    },
    sectionTitle: {
      fontSize: '1.3rem',
      color: '#e8eaf6',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '1px solid rgba(100, 181, 246, 0.3)',
    },
    wrongAnswerItem: {
      background: 'rgba(239, 83, 80, 0.1)',
      border: '1px solid rgba(239, 83, 80, 0.3)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '15px',
    },
    wrongQuestion: {
      fontWeight: '500',
      color: '#e8eaf6',
      marginBottom: '10px',
    },
    answerComparison: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '10px',
    },
    yourAnswer: {
      color: '#ef5350',
      fontSize: '0.95rem',
    },
    correctAnswer: {
      color: '#66bb6a',
      fontSize: '0.95rem',
    },
    categoryTag: {
      display: 'inline-block',
      padding: '4px 12px',
      background: 'rgba(100, 181, 246, 0.2)',
      borderRadius: '12px',
      fontSize: '0.8rem',
      color: '#64b5f6',
      marginBottom: '10px',
    },
    restartButton: {
      width: '100%',
      padding: '18px 40px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: 'white',
      background: 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      marginTop: '30px',
      transition: 'all 0.3s ease',
    },
    toggleExplanation: {
      background: 'none',
      border: '1px solid rgba(100, 181, 246, 0.5)',
      color: '#64b5f6',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      marginTop: '10px',
    },
  };

  // 初始化题目
  useEffect(() => {
    const qs = getDNAQuestions();
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
  }, []);

  // 开始答题
  const startQuiz = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    setSelectedOption(null);
    setShowExplanation(false);
  };

  // 选择选项
  const selectOption = (optionIndex) => {
    if (selectedOption !== null) return; // 已选择则不可再选
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
    setSelectedOption(optionIndex);
  };

  // 下一题
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  // 完成答题
  const finishQuiz = () => {
    const result = calculateScore(answers);
    setResult(result);
    setGameState('result');
  };

  // 重新开始
  const restartQuiz = () => {
    setGameState('intro');
    setCurrentQuestionIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    setSelectedOption(null);
    setShowExplanation(false);
    setResult(null);
  };

  // 获取当前得分
  const getCurrentScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer !== null && questions[index] && answer === questions[index].correct) {
        correct++;
      }
    });
    return correct;
  };

  // 渲染开始页面
  const renderIntro = () => (
    <div style={styles.card}>
      <div style={styles.introText}>
        欢迎来到DNA知识挑战！这里有20道精心设计的趣味选择题，涵盖遗传基因、基因传承机制和DNA基础知识。
      </div>
      <ul style={styles.featureList}>
        <li style={styles.featureItem}>
          <span style={styles.featureIcon}>1</span>
          <span>测试你对遗传特征的了解（双眼皮、血型、身高、秃顶等）</span>
        </li>
        <li style={styles.featureItem}>
          <span style={styles.featureIcon}>2</span>
          <span>探索基因传承机制（显性隐性、基因重组、线粒体DNA等）</span>
        </li>
        <li style={styles.featureItem}>
          <span style={styles.featureIcon}>3</span>
          <span>学习DNA基础知识（碱基对、染色体数量、基因表达等）</span>
        </li>
        <li style={styles.featureItem}>
          <span style={styles.featureIcon}>4</span>
          <span>发现趣味冷知识（同卵双胞胎、嵌合体、表观遗传等）</span>
        </li>
      </ul>
      <div style={{ ...styles.introText, fontSize: '1rem', color: '#9fa8da' }}>
        每题答对得5分，满分100分。答完可查看详细解析，快来挑战你的基因智商吧！
      </div>
      <button 
        style={styles.startButton}
        onClick={startQuiz}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        }}
      >
        开始挑战
      </button>
    </div>
  );

  // 渲染答题页面
  const renderQuiz = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const currentScore = getCurrentScore();
    const answeredCount = answers.filter(a => a !== null).length;

    return (
      <div style={styles.card}>
        {/* 进度条 */}
        <div style={styles.progressContainer}>
          <div style={styles.progressInfo}>
            <span>题目 {currentQuestionIndex + 1} / {questions.length}</span>
            <span>当前得分: {currentScore * 5}分</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>

        {/* 题目 */}
        <div style={styles.questionCard}>
          <div style={styles.questionNumber}>
            第 {currentQuestionIndex + 1} 题 · {currentQuestion.category}
          </div>
          <div style={styles.questionText}>
            {currentQuestion.question}
          </div>

          {/* 选项 */}
          <div style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              let optionStyle = { ...styles.optionButton };
              let labelStyle = { ...styles.optionLabel };

              if (selectedOption !== null) {
                if (index === currentQuestion.correct) {
                  optionStyle = { ...optionStyle, ...styles.optionCorrect };
                  labelStyle = { ...labelStyle, background: 'rgba(102, 187, 106, 0.3)', color: '#66bb6a' };
                } else if (index === selectedOption && index !== currentQuestion.correct) {
                  optionStyle = { ...optionStyle, ...styles.optionWrong };
                  labelStyle = { ...labelStyle, background: 'rgba(239, 83, 80, 0.3)', color: '#ef5350' };
                }
              } else if (selectedOption === index) {
                optionStyle = { ...optionStyle, ...styles.optionSelected };
              }

              return (
                <button
                  key={index}
                  style={optionStyle}
                  onClick={() => selectOption(index)}
                  onMouseEnter={(e) => {
                    if (selectedOption === null) {
                      e.target.style.background = styles.optionButtonHover.background;
                      e.target.style.borderColor = styles.optionButtonHover.borderColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedOption === null) {
                      e.target.style.background = styles.optionButton.background;
                      e.target.style.borderColor = styles.optionButton.borderColor;
                    }
                  }}
                  disabled={selectedOption !== null}
                >
                  <span style={labelStyle}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option.substring(3)}</span>
                </button>
              );
            })}
          </div>

          {/* 答案解析 */}
          {selectedOption !== null && (
            <>
              <div style={styles.explanationBox}>
                <div style={styles.explanationTitle}>答案解析</div>
                <div style={styles.explanationText}>{currentQuestion.explanation}</div>
              </div>
              <button
                style={styles.nextButton}
                onClick={nextQuestion}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(25, 118, 210, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {currentQuestionIndex < questions.length - 1 ? '下一题' : '查看结果'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // 渲染结果页面
  const renderResult = () => {
    const levelColors = {
      master: '#ffd700',
      expert: '#c0c0c0',
      advanced: '#cd7f32',
      intermediate: '#64b5f6',
      beginner: '#9fa8da',
    };

    return (
      <div style={styles.card}>
        <div style={styles.resultContainer}>
          <div style={styles.resultScore}>{result.score}分</div>
          <div style={{ ...styles.resultLevel, color: levelColors[result.level] }}>
            {result.levelTitle}
          </div>

          {/* 统计 */}
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{result.correctCount}</div>
              <div style={styles.statLabel}>答对题数</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{result.wrongCount}</div>
              <div style={styles.statLabel}>答错题数</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{result.accuracy}</div>
              <div style={styles.statLabel}>正确率</div>
            </div>
          </div>

          {/* 评级说明 */}
          <div style={{ ...styles.introText, textAlign: 'center', fontSize: '1rem' }}>
            {result.score >= 90 && '太棒了！你对DNA和遗传学有深入的了解，堪称基因大师！'}
            {result.score >= 80 && result.score < 90 && '非常出色！你的基因知识储备很丰富，是名副其实的基因专家！'}
            {result.score >= 60 && result.score < 80 && '表现不错！你对遗传基因有基本的了解，继续加油！'}
            {result.score >= 40 && result.score < 60 && '还可以！你已经掌握了一些基因知识，还有很大的进步空间。'}
            {result.score < 40 && '别灰心！基因知识需要积累，多学习就能提高！'}
          </div>

          {/* 错题回顾 */}
          {result.wrongAnswers.length > 0 && (
            <div style={styles.wrongAnswersSection}>
              <div style={styles.sectionTitle}>错题回顾</div>
              {result.wrongAnswers.map((wrong, index) => (
                <div key={index} style={styles.wrongAnswerItem}>
                  <span style={styles.categoryTag}>{wrong.category}</span>
                  <div style={styles.wrongQuestion}>{wrong.question}</div>
                  <div style={styles.answerComparison}>
                    <div style={styles.yourAnswer}>
                      你的答案：{wrong.userAnswerText}
                    </div>
                    <div style={styles.correctAnswer}>
                      正确答案：{wrong.correctAnswerText}
                    </div>
                  </div>
                  <div style={{ ...styles.explanationText, marginTop: '10px' }}>
                    {wrong.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 全部答对的情况 */}
          {result.wrongAnswers.length === 0 && (
            <div style={{ 
              background: 'rgba(102, 187, 106, 0.1)', 
              border: '1px solid rgba(102, 187, 106, 0.3)',
              borderRadius: '12px',
              padding: '30px',
              marginTop: '20px',
            }}>
              <div style={{ fontSize: '1.2rem', color: '#66bb6a', fontWeight: 'bold' }}>
                完美通关！
              </div>
              <div style={{ color: '#b0bec5', marginTop: '10px' }}>
                你答对了所有题目，太厉害了！
              </div>
            </div>
          )}

          <button 
            style={styles.restartButton}
            onClick={restartQuiz}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 15px rgba(67, 160, 71, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            重新挑战
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>DNA知识挑战</h1>
        <p style={styles.subtitle}>测测你的基因智商</p>
        
        {gameState === 'intro' && renderIntro()}
        {gameState === 'playing' && renderQuiz()}
        {gameState === 'result' && renderResult()}
      </div>
    </div>
  );
}
