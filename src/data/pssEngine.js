/**
 * 知觉压力量表（PSS-10）引擎
 *
 * 由 Sheldon Cohen 于1983年编制的经典心理测评工具。
 * 用于评估个体在过去一个月中对生活事件的主观压力感受。
 *
 * 此分析仅供自我参考，不构成医学诊断。
 * 如需专业评估，请咨询心理咨询师或精神科医生。
 */

// ==================== 题目定义 ====================

const PSS_QUESTIONS = [
  {
    id: 1,
    text: '因为一些出乎意料的事情发生而感到心烦意乱',
    reverse: true, // 反向计分
  },
  {
    id: 2,
    text: '感觉无法控制生活中重要的事情',
    reverse: false,
  },
  {
    id: 3,
    text: '感到紧张和有压力',
    reverse: false,
  },
  {
    id: 4,
    text: '成功处理日常生活中的烦恼',
    reverse: true, // 反向计分
  },
  {
    id: 5,
    text: '感觉自己能有效处理个人问题',
    reverse: true, // 反向计分
  },
  {
    id: 6,
    text: '感觉事情按照自己想要的进行',
    reverse: true, // 反向计分
  },
  {
    id: 7,
    text: '因为无法控制的事情而感到愤怒',
    reverse: false,
  },
  {
    id: 8,
    text: '感觉困难堆积如山，无法克服',
    reverse: false,
  },
  {
    id: 9,
    text: '因为一些超出自己控制范围的事情而感到烦恼',
    reverse: false,
  },
  {
    id: 10,
    text: '感觉自己能够控制生活中的愤怒',
    reverse: true, // 反向计分
  },
];

const OPTIONS = [
  { value: 0, label: '从不' },
  { value: 1, label: '偶尔' },
  { value: 2, label: '有时' },
  { value: 3, label: '时常' },
  { value: 4, label: '总是' },
];

// ==================== 评分标准 ====================

const LEVELS = {
  low: {
    key: 'low',
    label: '低压力',
    color: '#10b981',
    minScore: 0,
    maxScore: 13,
    desc: '你在过去一个月中感受到的压力水平较低，说明你目前有较好的压力管理能力和心理韧性。你的生活状态相对平稳，能够较好地应对日常挑战。',
  },
  moderate: {
    key: 'moderate',
    label: '中等压力',
    color: '#f59e0b',
    minScore: 14,
    maxScore: 26,
    desc: '你在过去一个月中感受到中等程度的压力，这在现代生活中是比较常见的状态。适度的压力可以激发动力，但需要注意调节，避免压力持续累积。',
  },
  high: {
    key: 'high',
    label: '高压力',
    color: '#ef4444',
    minScore: 27,
    maxScore: 40,
    desc: '你在过去一个月中感受到较高水平的压力，这可能已经对你的身心健康产生了一定影响。建议你认真对待这个信号，积极采取措施来缓解压力。',
  },
};

// ==================== 维度定义 ====================

// 无助感维度：正向计分题（第2、3、7、8、9题）—— 反映对生活失控的感受
const HELPLESSNESS_ITEMS = [1, 2, 6, 7, 8]; // 题目索引（0-based）：第2、3、7、8、9题
// 自我效能感维度：反向计分题（第1、3、4、5、9题原始分）—— 反映应对能力
const SELF_EFFICACY_ITEMS = [0, 3, 4, 5, 9]; // 题目索引（0-based）：第1、4、5、6、10题

// ==================== 建议数据库 ====================

const SUGGESTIONS = {
  low: [
    {
      category: '身体调节',
      icon: '\u{1F3C3}',
      items: [
        '保持规律的运动习惯，每周至少3次中等强度有氧运动',
        '维持均衡的饮食结构，多摄入富含维生素和矿物质的食物',
        '确保充足的睡眠，每晚7-8小时有助于身心恢复',
      ],
    },
    {
      category: '心理调适',
      icon: '\u{1F9D8}',
      items: [
        '继续培养积极乐观的心态，保持对生活的热情',
        '尝试正念冥想或深呼吸练习，进一步提升心理韧性',
        '记录感恩日记，每天写下3件让你感到感恩的事情',
      ],
    },
    {
      category: '社交支持',
      icon: '\u{1F91D}',
      items: [
        '珍惜与家人朋友的相处时光，维持良好的社交网络',
        '主动帮助他人，在付出中获得成就感和满足感',
        '参加社区活动或兴趣小组，拓展社交圈',
      ],
    },
    {
      category: '生活方式',
      icon: '\u{1F33F}',
      items: [
        '保持工作与生活的平衡，合理安排时间',
        '培养一项新的兴趣爱好，丰富精神生活',
        '定期进行自我反思，持续关注自身成长',
      ],
    },
  ],
  moderate: [
    {
      category: '身体调节',
      icon: '\u{1F3C3}',
      items: [
        '每天安排15-30分钟的运动时间，如散步、慢跑或瑜伽',
        '注意饮食规律，避免暴饮暴食或过度依赖咖啡因',
        '建立固定的作息时间，睡前1小时远离电子屏幕',
      ],
    },
    {
      category: '心理调适',
      icon: '\u{1F9D8}',
      items: [
        '学习渐进式肌肉放松法，每天练习10-15分钟',
        '尝试认知重构技术，用更积极的角度看待压力源',
        '每天留出"独处时间"，进行自我对话和情绪梳理',
      ],
    },
    {
      category: '社交支持',
      icon: '\u{1F91D}',
      items: [
        '向信任的朋友或家人倾诉你的感受，不要独自承受',
        '考虑加入支持性社群，与有相似经历的人交流',
        '设定健康的社交边界，学会对不合理的要求说"不"',
      ],
    },
    {
      category: '生活方式',
      icon: '\u{1F33F}',
      items: [
        '列出压力清单，区分可控与不可控因素，优先处理可控事项',
        '减少不必要的承诺，学会合理分配精力和时间',
        '创造放松的居家环境，如使用香薰、播放轻音乐',
      ],
    },
  ],
  high: [
    {
      category: '身体调节',
      icon: '\u{1F3C3}',
      items: [
        '优先保证基本睡眠需求，即使其他事情也请按时休息',
        '尝试温和的身体活动，如散步、拉伸或太极，不必强求',
        '注意身体的压力信号（头痛、胃痛、失眠），及时关注',
      ],
    },
    {
      category: '心理调适',
      icon: '\u{1F9D8}',
      items: [
        '强烈建议寻求专业心理咨询师的帮助，获得专业支持',
        '学习"着陆技术"（Grounding），在焦虑时用5-4-3-2-1法回到当下',
        '允许自己有"不坚强"的时刻，接纳当前的情绪状态',
      ],
    },
    {
      category: '社交支持',
      icon: '\u{1F91D}',
      items: [
        '不要独自承受，请向你信任的人表达你的困境',
        '考虑拨打心理援助热线，获取即时支持（全国24小时热线：400-161-9995）',
        '如果工作或学业压力过大，与上级或老师沟通寻求调整',
      ],
    },
    {
      category: '生活方式',
      icon: '\u{1F33F}',
      items: [
        '暂时降低对自己的要求，允许"足够好"代替"完美"',
        '减少信息过载，限制社交媒体和新闻的浏览时间',
        '制定最基本的生活节奏，先从规律饮食和睡眠开始',
      ],
    },
  ],
};

// ==================== 警告信号 ====================

const WARNING_SIGNS = {
  low: [],
  moderate: [
    '压力可能开始影响你的睡眠质量和日常情绪',
    '注意观察压力是否有持续上升的趋势',
  ],
  high: [
    '长期高压力可能导致焦虑、抑郁等心理健康问题',
    '压力可能正在影响你的身体健康（如免疫力下降、消化问题）',
    '你的工作效率和人际关系可能已经受到压力的影响',
    '如果出现持续的情绪低落、失眠或身体不适，请尽快寻求专业帮助',
  ],
};

// ==================== 鼓励语 ====================

const ENCOURAGEMENTS = {
  low: '你做得很好！保持当前的生活方式和心态，继续关注自己的身心状态。记住，适度的自我关怀是长期幸福的重要基石。',
  moderate: '感到压力是正常的，你能够主动了解自己的状态，这本身就是一种积极的表现。通过适当的调整，你完全有能力将压力恢复到健康水平。一步一步来，你并不孤单。',
  high: '你现在的感受是真实的，也是可以被理解的。请记住，寻求帮助不是软弱的表现，而是勇敢的选择。你已经迈出了了解自己状态的第一步，接下来请给自己一些温柔和耐心。专业的支持可以帮助你度过这个阶段，你值得被好好对待。',
};

// ==================== 维度描述 ====================

const DIMENSION_INFO = {
  helplessness: {
    label: '无助感',
    lowDesc: '你对生活的掌控感较强，较少感到无助和失控。',
    moderateDesc: '你在某些方面可能感到一些失控感，但总体上还能应对。',
    highDesc: '你可能经常感到对生活缺乏控制力，很多事情让你觉得力不从心。',
    lowAdvice: '继续保持对生活的积极掌控，信任自己的能力。',
    moderateAdvice: '尝试找出让你感到无助的具体领域，制定小目标逐步改善。',
    highAdvice: '建议寻求专业帮助，学习压力管理技巧，重建对生活的掌控感。',
  },
  selfEfficacy: {
    label: '自我效能感',
    lowDesc: '你对自己应对挑战的能力有较高的信心。',
    moderateDesc: '你对自己应对困难的能力有一定信心，但有时会感到不确定。',
    highDesc: '你可能对自己的应对能力缺乏信心，容易感到挫败。',
    lowAdvice: '你的自信是你宝贵的资源，继续发挥它来面对生活中的挑战。',
    moderateAdvice: '回顾过去成功应对困难的经验，增强自我效能感。',
    highAdvice: '从小事做起，积累成功经验，逐步重建自信。专业咨询可以帮助你发现内在力量。',
  },
};

// ==================== 导出函数 ====================

/**
 * 获取PSS-10的10道题目
 * @returns {Array} 题目数组，每题包含 id、text、reverse 字段
 */
export function getPSSQuestions() {
  return PSS_QUESTIONS.map(q => ({
    id: q.id,
    text: q.text,
    reverse: q.reverse,
    options: OPTIONS,
  }));
}

/**
 * 计算得分并生成分析结果
 * @param {number[]} answers - 长度为10的数组，每项0-4分
 * @returns {Object} 分析结果对象
 */
export function calculatePSS(answers) {
  // 参数校验
  if (!Array.isArray(answers) || answers.length !== 10) {
    throw new Error('answers 必须是长度为10的数组');
  }
  if (answers.some(a => typeof a !== 'number' || a < 0 || a > 4)) {
    throw new Error('每项答案必须是0-4之间的数字');
  }

  // 计算每题实际得分（处理反向计分）
  const scoredAnswers = answers.map((answer, index) => {
    const question = PSS_QUESTIONS[index];
    if (question.reverse) {
      return 4 - answer; // 反向计分：0→4, 1→3, 2→2, 3→1, 4→0
    }
    return answer;
  });

  // 计算总分
  const totalScore = scoredAnswers.reduce((sum, score) => sum + score, 0);

  // 判断压力等级
  let level;
  if (totalScore <= 13) {
    level = 'low';
  } else if (totalScore <= 26) {
    level = 'moderate';
  } else {
    level = 'high';
  }

  const levelInfo = LEVELS[level];

  // 计算维度得分
  // 无助感维度：第2、3、7、8、9题（索引1、2、6、7、8），正向计分后得分
  const helplessnessScore = HELPLESSNESS_ITEMS.reduce(
    (sum, idx) => sum + scoredAnswers[idx], 0
  );
  const helplessnessMax = HELPLESSNESS_ITEMS.length * 4; // 5题 * 4分 = 20

  // 自我效能感维度：第1、4、5、6、10题（索引0、3、4、5、9），正向计分后得分
  const selfEfficacyScore = SELF_EFFICACY_ITEMS.reduce(
    (sum, idx) => sum + scoredAnswers[idx], 0
  );
  const selfEfficacyMax = SELF_EFFICACY_ITEMS.length * 4; // 5题 * 4分 = 20

  // 获取维度描述和建议
  const dimInfo = DIMENSION_INFO;
  const getDimDesc = (dim, level) => {
    if (level === 'low') return dimInfo[dim].lowDesc;
    if (level === 'moderate') return dimInfo[dim].moderateDesc;
    return dimInfo[dim].highDesc;
  };
  const getDimAdvice = (dim, level) => {
    if (level === 'low') return dimInfo[dim].lowAdvice;
    if (level === 'moderate') return dimInfo[dim].moderateAdvice;
    return dimInfo[dim].highAdvice;
  };

  return {
    totalScore,
    level: levelInfo.key,
    levelLabel: levelInfo.label,
    levelColor: levelInfo.color,
    levelDesc: levelInfo.desc,
    dimensions: {
      helplessness: {
        score: helplessnessScore,
        maxScore: helplessnessMax,
        label: dimInfo.helplessness.label,
        desc: getDimDesc('helplessness', level),
        advice: getDimAdvice('helplessness', level),
      },
      selfEfficacy: {
        score: selfEfficacyScore,
        maxScore: selfEfficacyMax,
        label: dimInfo.selfEfficacy.label,
        desc: getDimDesc('selfEfficacy', level),
        advice: getDimAdvice('selfEfficacy', level),
      },
    },
    suggestions: SUGGESTIONS[level],
    warningSigns: WARNING_SIGNS[level],
    encouragement: ENCOURAGEMENTS[level],
  };
}
