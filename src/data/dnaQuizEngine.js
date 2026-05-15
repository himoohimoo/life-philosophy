// DNA趣味问答引擎 - 20道关于遗传基因、基因传承、DNA知识的趣味选择题

const dnaQuestions = [
  {
    id: 1,
    question: '人类的双眼皮是显性遗传，单眼皮是隐性遗传。如果父母都是双眼皮（基因型Aa），孩子单眼皮的概率是多少？',
    options: ['A. 0%', 'B. 25%', 'C. 50%', 'D. 75%'],
    correct: 1,
    explanation: '父母都是Aa（双眼皮），根据孟德尔遗传定律，子代基因型组合为：AA(25%)、Aa(50%)、aa(25%)。单眼皮需要aa基因型，所以概率是25%。',
    category: '遗传特征'
  },
  {
    id: 2,
    question: '人类的ABO血型系统中，哪种血型是"万能受血者"？',
    options: ['A. A型', 'B. B型', 'C. AB型', 'D. O型'],
    correct: 2,
    explanation: 'AB型血的人红细胞上有A和B两种抗原，血浆中没有抗A和抗B抗体，因此可以接受A型、B型、AB型和O型的血液，被称为"万能受血者"。',
    category: '遗传特征'
  },
  {
    id: 3,
    question: '男性的秃顶（雄激素性脱发）主要遗传自哪一方？',
    options: ['A. 父亲', 'B. 母亲', 'C. 父母双方均等', 'D. 与遗传无关'],
    correct: 1,
    explanation: '男性秃顶主要与X染色体上的基因有关。男性只有一条X染色体，来自母亲。因此，男性秃顶倾向主要看母亲的家族遗传史，这就是所谓的"舅舅秃，外甥也秃"的科学依据。',
    category: '遗传特征'
  },
  {
    id: 4,
    question: '人体细胞中正常有多少对染色体？',
    options: ['A. 22对', 'B. 23对', 'C. 24对', 'D. 46对'],
    correct: 1,
    explanation: '人体正常体细胞含有23对（46条）染色体，包括22对常染色体和1对性染色体（XX或XY）。生殖细胞（精子和卵子）则只有23条染色体。',
    category: 'DNA基础'
  },
  {
    id: 5,
    question: 'DNA双螺旋结构中，哪两种碱基是配对的？',
    options: ['A. A与C，G与T', 'B. A与G，C与T', 'C. A与T，G与C', 'D. A与A，G与G'],
    correct: 2,
    explanation: 'DNA遵循查加夫法则：腺嘌呤(A)总是与胸腺嘧啶(T)配对，鸟嘌呤(G)总是与胞嘧啶(C)配对。A-T之间形成2个氢键，G-C之间形成3个氢键。',
    category: 'DNA基础'
  },
  {
    id: 6,
    question: '线粒体DNA只能从哪一方遗传给后代？',
    options: ['A. 父亲', 'B. 母亲', 'C. 父母双方均等', 'D. 随机遗传'],
    correct: 1,
    explanation: '线粒体DNA只通过母系遗传。因为精子几乎不提供细胞质，受精卵的线粒体全部来自卵细胞。科学家可以通过线粒体DNA追溯人类的母系祖先，这就是"线粒体夏娃"理论的依据。',
    category: '基因传承'
  },
  {
    id: 7,
    question: '同卵双胞胎和异卵双胞胎的区别是什么？',
    options: ['A. 同卵双胞胎基因100%相同，异卵双胞胎基因约50%相同', 'B. 同卵双胞胎性别一定相同，异卵双胞胎性别可能不同', 'C. 同卵双胞胎来自同一个受精卵，异卵双胞胎来自两个受精卵', 'D. 以上全部正确'],
    correct: 3,
    explanation: '同卵双胞胎由一个受精卵分裂而成，基因几乎100%相同，性别一定相同；异卵双胞胎由两个不同的受精卵发育而成，基因相似度与普通兄弟姐妹相同（约50%），性别可能相同也可能不同。',
    category: '趣味冷知识'
  },
  {
    id: 8,
    question: '以下哪种特征主要受环境因素影响，而非遗传因素？',
    options: ['A. 血型', 'B. 指纹', 'C. 身高', 'D. 眼睛颜色'],
    correct: 2,
    explanation: '身高是遗传和环境共同作用的结果，遗传因素约占60-80%，但营养、运动、睡眠等环境因素也起着重要作用。血型、指纹和眼睛颜色主要由基因决定，受环境影响很小。',
    category: '遗传特征'
  },
  {
    id: 9,
    question: '什么是"嵌合体"（Chimera）？',
    options: ['A. 一种基因突变导致的疾病', 'B. 一个人体内含有两套不同的DNA', 'C. 人工合成的DNA序列', 'D. 染色体数目异常'],
    correct: 1,
    explanation: '嵌合体是指一个人体内含有来自不同受精卵的两套或更多套DNA。可能发生在双胞胎胚胎融合、骨髓移植后，或怀孕期间母体和胎儿细胞交换等情况。',
    category: '趣味冷知识'
  },
  {
    id: 10,
    question: '表观遗传学（Epigenetics）主要研究什么？',
    options: ['A. DNA序列的改变', 'B. 不改变DNA序列的基因表达调控', 'C. 基因突变的修复机制', 'D. 染色体的结构变化'],
    correct: 1,
    explanation: '表观遗传学研究在不改变DNA序列的情况下，基因表达如何被调控和遗传。包括DNA甲基化、组蛋白修饰等机制。例如，同卵双胞胎随着年龄增长，表观遗传标记会越来越不同。',
    category: '趣味冷知识'
  },
  {
    id: 11,
    question: '人类的基因大约有多少个？',
    options: ['A. 约1万个', 'B. 约2-2.5万个', 'C. 约10万个', 'D. 约100万个'],
    correct: 1,
    explanation: '人类基因组计划完成后，科学家发现人类只有约2-2.5万个蛋白质编码基因，比之前估计的少得多。这颠覆了"一个基因一种蛋白质"的简单观念，说明基因表达调控非常复杂。',
    category: 'DNA基础'
  },
  {
    id: 12,
    question: '红绿色盲是一种什么遗传方式的疾病？',
    options: ['A. 常染色体显性遗传', 'B. 常染色体隐性遗传', 'C. X染色体隐性遗传', 'D. Y染色体遗传'],
    correct: 2,
    explanation: '红绿色盲是X染色体隐性遗传病。男性只有一条X染色体，只要携带致病基因就会发病；女性需要两条X染色体都携带致病基因才会发病，所以男性发病率远高于女性。',
    category: '遗传特征'
  },
  {
    id: 13,
    question: '以下哪种现象不属于基因重组？',
    options: ['A. 减数分裂中的交叉互换', 'B. 受精时雌雄配子的随机结合', 'C. 基因突变产生新等位基因', 'D. 非同源染色体的自由组合'],
    correct: 2,
    explanation: '基因重组是指原有基因的重新组合，包括交叉互换、自由组合和随机结合。基因突变是DNA序列的改变，产生新的等位基因，不属于基因重组的范畴。',
    category: '基因传承'
  },
  {
    id: 14,
    question: 'DNA复制的方式是什么？',
    options: ['A. 全保留复制', 'B. 半保留复制', 'C. 分散复制', 'D. 随机复制'],
    correct: 1,
    explanation: 'DNA复制是半保留复制。每个子代DNA分子中，一条链来自亲代DNA，另一条链是新合成的。这一机制保证了遗传信息的准确传递，是梅塞尔森-斯塔尔实验证实的。',
    category: 'DNA基础'
  },
  {
    id: 15,
    question: '以下哪种生物的DNA与人类相似度最高？',
    options: ['A. 黑猩猩', 'B. 果蝇', 'C. 香蕉', 'D. 大肠杆菌'],
    correct: 0,
    explanation: '黑猩猩与人类的DNA相似度高达98-99%，是现存与人类亲缘关系最近的物种。即使是香蕉，也约有50-60%的基因与人类有相似性，这反映了地球生命的共同起源。',
    category: '趣味冷知识'
  },
  {
    id: 16,
    question: '什么是"显性致死基因"？',
    options: ['A. 只在显性状态下才致死的基因', 'B. 携带者一定会死亡的基因', 'C. 纯合状态下致死但杂合状态下存活的基因', 'D. 导致显性遗传病的基因'],
    correct: 2,
    explanation: '显性致死基因在纯合状态下会导致个体死亡，但在杂合状态下个体可以存活。例如人类软骨发育不全症，纯合子会在胚胎期死亡，杂合子表现为侏儒症但能存活。',
    category: '基因传承'
  },
  {
    id: 17,
    question: '人类的寿命主要受什么因素影响？',
    options: ['A. 完全由基因决定', 'B. 完全由环境决定', 'C. 基因和环境共同作用，基因约占20-30%', 'D. 基因和环境共同作用，基因约占80-90%'],
    correct: 2,
    explanation: '研究表明，人类寿命约20-30%由遗传因素决定，70-80%由生活方式、环境、医疗条件等因素决定。长寿基因确实存在，但健康的生活方式同样重要。',
    category: '遗传特征'
  },
  {
    id: 18,
    question: '以下哪种技术可以精确修改生物体的DNA序列？',
    options: ['A. PCR技术', 'B. 基因测序', 'C. CRISPR-Cas9', 'D. 基因芯片'],
    correct: 2,
    explanation: 'CRISPR-Cas9是一种革命性的基因编辑技术，可以像"分子剪刀"一样精确切割和修改DNA序列。PCR用于扩增DNA，基因测序用于读取DNA序列，基因芯片用于检测基因表达。',
    category: 'DNA基础'
  },
  {
    id: 19,
    question: '为什么近亲结婚会增加遗传病的风险？',
    options: ['A. 近亲结婚会导致基因突变增加', 'B. 近亲携带相同隐性致病基因的概率更高', 'C. 近亲结婚会影响染色体数量', 'D. 近亲的DNA相似度达到100%'],
    correct: 1,
    explanation: '近亲之间携带相同隐性致病基因的概率较高。当两个携带者结婚时，子代有25%的概率患病。非近亲携带相同隐性致病基因的概率很低，所以后代患病风险也低。',
    category: '基因传承'
  },
  {
    id: 20,
    question: '以下关于DNA的说法，哪个是正确的？',
    options: ['A. 人体所有细胞的DNA完全相同', 'B. DNA只存在于细胞核中', 'C. 人体99.9%的DNA序列是相同的', 'D. 基因就是DNA的全部'],
    correct: 2,
    explanation: '任意两个不相关的人类个体，DNA序列相似度约为99.9%，只有0.1%的差异造就了我们每个人的独特性。DNA也存在于线粒体中；免疫细胞等会发生DNA重排；基因只是DNA中有编码功能的部分。',
    category: 'DNA基础'
  }
];

/**
 * 获取所有DNA问答题目
 * @returns {Array} 题目数组
 */
export function getDNAQuestions() {
  return [...dnaQuestions];
}

/**
 * 计算答题得分
 * @param {Array} answers - 用户答案数组，每项为选中的选项索引（0-3）
 * @returns {Object} 包含得分、正确题数、错题列表的结果对象
 */
export function calculateScore(answers) {
  if (!Array.isArray(answers) || answers.length !== dnaQuestions.length) {
    throw new Error(`答案数组长度必须为${dnaQuestions.length}`);
  }

  let correctCount = 0;
  const wrongAnswers = [];

  answers.forEach((answer, index) => {
    const question = dnaQuestions[index];
    const isCorrect = answer === question.correct;
    
    if (isCorrect) {
      correctCount++;
    } else {
      wrongAnswers.push({
        questionId: question.id,
        question: question.question,
        userAnswer: answer,
        userAnswerText: question.options[answer] || '未作答',
        correctAnswer: question.correct,
        correctAnswerText: question.options[question.correct],
        explanation: question.explanation,
        category: question.category
      });
    }
  });

  const totalQuestions = dnaQuestions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  // 评级计算
  let level;
  let levelTitle;
  if (score >= 90) {
    level = 'master';
    levelTitle = '基因大师';
  } else if (score >= 80) {
    level = 'expert';
    levelTitle = '基因专家';
  } else if (score >= 60) {
    level = 'advanced';
    levelTitle = '基因达人';
  } else if (score >= 40) {
    level = 'intermediate';
    levelTitle = '基因学徒';
  } else {
    level = 'beginner';
    levelTitle = '基因小白';
  }

  return {
    score,
    correctCount,
    totalQuestions,
    wrongCount: totalQuestions - correctCount,
    wrongAnswers,
    level,
    levelTitle,
    accuracy: `${correctCount}/${totalQuestions}`
  };
}

/**
 * 获取题目分类统计
 * @returns {Object} 各分类题目数量
 */
export function getCategoryStats() {
  const stats = {};
  dnaQuestions.forEach(q => {
    stats[q.category] = (stats[q.category] || 0) + 1;
  });
  return stats;
}

/**
 * 根据分类获取题目
 * @param {string} category - 分类名称
 * @returns {Array} 该分类的题目数组
 */
export function getQuestionsByCategory(category) {
  return dnaQuestions.filter(q => q.category === category);
}

export default {
  getDNAQuestions,
  calculateScore,
  getCategoryStats,
  getQuestionsByCategory
};
