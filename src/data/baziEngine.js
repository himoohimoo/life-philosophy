/**
 * 八字计算和分析引擎
 *
 * 此分析基于传统命理学，仅供参考和娱乐。
 * 传统八字命理学是中国古代文化的重要组成部分，
 * 其理论体系博大精深，此处实现为简化版本。
 * 如需深入了解，请咨询专业命理师。
 */

// ==================== 基础常量 ====================

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const FIVE_ELEMENTS = ['金', '木', '水', '火', '土'];
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 天干 -> 五行映射
const STEM_ELEMENT = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 地支 -> 五行映射
const BRANCH_ELEMENT = {
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水'
};

// 天干阴阳：甲丙戊庚壬为阳，乙丁己辛癸为阴
const STEM_YIN_YANG = {
  '甲': '阳', '乙': '阴',
  '丙': '阳', '丁': '阴',
  '戊': '阳', '己': '阴',
  '庚': '阳', '辛': '阴',
  '壬': '阳', '癸': '阴'
};

// 地支阴阳：子寅辰午申戌为阳，丑卯巳未酉亥为阴
const BRANCH_YIN_YANG = {
  '子': '阳', '丑': '阴',
  '寅': '阳', '卯': '阴',
  '辰': '阳', '巳': '阴',
  '午': '阳', '未': '阴',
  '申': '阳', '酉': '阴',
  '戌': '阳', '亥': '阴'
};

// 五行相生关系
const ELEMENT_GENERATES = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
};

// 五行相克关系
const ELEMENT_OVERCOMES = {
  '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
};

// 五行相生（被生）
const ELEMENT_GENERATED_BY = {
  '木': '水', '火': '木', '土': '火', '金': '土', '水': '金'
};

// 五行相克（被克）
const ELEMENT_OVERCOME_BY = {
  '木': '金', '土': '木', '水': '土', '火': '水', '金': '火'
};

// 纳音五行（简化版 - 六十甲子纳音）
const NAYIN_TABLE = [
  '海中金', '海中金', '炉中火', '炉中火', '大林木', '大林木',
  '路旁土', '路旁土', '剑锋金', '剑锋金', '山头火', '山头火',
  '涧下水', '涧下水', '城头土', '城头土', '白蜡金', '白蜡金',
  '杨柳木', '杨柳木', '泉中水', '泉中水', '屋上土', '屋上土',
  '霹雳火', '霹雳火', '松柏木', '松柏木', '长流水', '长流水',
  '砂石金', '砂石金', '山下火', '山下火', '平地木', '平地木',
  '壁上土', '壁上土', '金箔金', '金箔金', '覆灯火', '覆灯火',
  '天河水', '天河水', '大驿土', '大驿土', '钗钏金', '钗钏金',
  '桑柘木', '桑柘木', '大溪水', '大溪水', '沙中土', '沙中土',
  '天上火', '天上火', '石榴木', '石榴木', '大海水', '大海水'
];

// ==================== 辅助函数 ====================

/**
 * 获取天干的五行属性
 */
function getStemElement(stem) {
  return STEM_ELEMENT[stem] || '';
}

/**
 * 获取地支的五行属性
 */
function getBranchElement(branch) {
  return BRANCH_ELEMENT[branch] || '';
}

/**
 * 获取天干的阴阳属性
 */
function getStemYinYang(stem) {
  return STEM_YIN_YANG[stem] || '';
}

/**
 * 获取地支的阴阳属性
 */
function getBranchYinYang(branch) {
  return BRANCH_YIN_YANG[branch] || '';
}

/**
 * 判断是否为闰年
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 获取某年某月的天数
 */
function getDaysInMonth(year, month) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) return 29;
  return days[month - 1];
}

/**
 * 计算从公元元年到指定日期的总天数
 */
function getTotalDays(year, month, day) {
  let total = 0;
  for (let y = 1; y < year; y++) {
    total += isLeapYear(y) ? 366 : 365;
  }
  for (let m = 1; m < month; m++) {
    total += getDaysInMonth(year, m);
  }
  total += day;
  return total;
}

/**
 * 计算儒略日（用于日干支推算）
 */
function getJulianDay(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

/**
 * 获取近似的立春日期（用于年柱划分）
 * 立春通常在每年2月3日-5日之间
 */
function getLichunDate(year) {
  // 近似立春日期表（2月4日前后）
  const lichunDays = [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5];
  const idx = (year - 1900) % 30;
  const day = lichunDays[idx] || 4;
  return new Date(year, 1, day); // 月份从0开始，1=2月
}

/**
 * 获取节气近似日期（用于月柱划分）
 * 每月有两个节气，月柱以节为界
 */
function getSolarTermDate(year, termIndex) {
  // termIndex: 0=小寒, 1=立春, 2=惊蛰, 3=清明, 4=立夏, 5=芒种,
  //           6=小暑, 7=立秋, 8=白露, 9=寒露, 10=立冬, 11=大雪
  const termDays = [
    [5, 6], [4, 5], [5, 6], [5, 6], [5, 6], [5, 6],
    [7, 7], [7, 8], [7, 8], [8, 8], [7, 8], [7, 7]
  ];
  const termMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const idx = termIndex % 12;
  const dayIdx = Math.floor((year - 2000) / 4) % 2;
  const day = termDays[idx][dayIdx];
  return new Date(year, termMonths[idx] - 1, day);
}

/**
 * 根据小时获取时辰索引（0=子时, 1=丑时, ...）
 * 子时：23:00-01:00（特殊处理）
 */
function getHourBranchIndex(hour) {
  if (hour === 23 || hour === 0) return 0;  // 子时
  return Math.floor((hour + 1) / 2);
}

/**
 * 获取时辰名称
 */
function getHourBranchName(hour) {
  const names = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时',
    '午时', '未时', '申时', '酉时', '戌时', '亥时'];
  return names[getHourBranchIndex(hour)];
}

/**
 * 根据日天干推算时天干（五鼠遁日起时法）
 * 甲己日起甲子时，乙庚日起丙子时，丙辛日起戊子时，
 * 丁壬日起庚子时，戊癸日起壬子时
 */
function getHourStem(dayStemIndex, hourBranchIndex) {
  const startStems = [0, 2, 4, 6, 8]; // 甲、丙、戊、庚、壬
  const dayStemGroup = dayStemIndex % 5;
  const startStem = startStems[dayStemGroup];
  return (startStem + hourBranchIndex) % 10;
}

// ==================== 核心计算函数 ====================

/**
 * 计算年柱
 * 以立春为界划分年份
 */
function calculateYearPillar(year, month, day) {
  // 判断是否已过立春
  const lichun = getLichunDate(year);
  const currentDate = new Date(year, month - 1, day);
  let baziYear = year;
  if (currentDate < lichun) {
    baziYear = year - 1;
  }

  // 年干支计算（以立春为界的年份）
  const stemIndex = (baziYear - 4) % 10;
  const branchIndex = (baziYear - 4) % 12;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    stem,
    branch,
    element: getStemElement(stem),
    yinYang: getStemYinYang(stem)
  };
}

/**
 * 计算月柱
 * 以节气为界划分月份
 * 正月（寅月）从立春开始
 */
function calculateMonthPillar(year, month, day, yearStemIndex) {
  // 节气月份对应表
  // 寅月(正月)=立春后, 卯月=惊蛰后, 辰月=清明后, ...
  // 节气索引：立春(1), 惊蛰(2), 清明(3), 立夏(4), 芒种(5),
  //           小暑(6), 立秋(7), 白露(8), 寒露(9), 立冬(10), 大雪(11), 小寒(0)
  const termToMonth = {
    0: 12, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5,
    6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11
  };

  // 确定当前处于哪个节气月
  // 简化处理：根据月份和日期近似判断
  const termDates = [
    { month: 1, day: 6, termIndex: 0 },   // 小寒
    { month: 2, day: 4, termIndex: 1 },   // 立春
    { month: 3, day: 6, termIndex: 2 },   // 惊蛰
    { month: 4, day: 5, termIndex: 3 },   // 清明
    { month: 5, day: 6, termIndex: 4 },   // 立夏
    { month: 6, day: 6, termIndex: 5 },   // 芒种
    { month: 7, day: 7, termIndex: 6 },   // 小暑
    { month: 8, day: 7, termIndex: 7 },   // 立秋
    { month: 9, day: 8, termIndex: 8 },   // 白露
    { month: 10, day: 8, termIndex: 9 },  // 寒露
    { month: 11, day: 7, termIndex: 10 }, // 立冬
    { month: 12, day: 7, termIndex: 11 }  // 大雪
  ];

  let baziMonth = month;
  for (let i = termDates.length - 1; i >= 0; i--) {
    const td = termDates[i];
    if (month > td.month || (month === td.month && day >= td.day)) {
      baziMonth = termToMonth[td.termIndex];
      break;
    }
  }

  // 月支固定：正月=寅, 二月=卯, ...
  const branchIndex = (baziMonth + 1) % 12; // 正月=寅(2)
  const branch = EARTHLY_BRANCHES[branchIndex];

  // 月干由年干推算（五虎遁年起月法）
  // 甲己年起丙寅月，乙庚年起戊寅月，丙辛年起庚寅月，
  // 丁壬年起壬寅月，戊癸年起甲寅月
  const startStems = [2, 4, 6, 8, 0]; // 丙、戊、庚、壬、甲
  const yearStemGroup = yearStemIndex % 5;
  const startStem = startStems[yearStemGroup];
  const stemIndex = (startStem + baziMonth - 1) % 10;
  const stem = HEAVENLY_STEMS[stemIndex];

  return {
    stem,
    branch,
    element: getStemElement(stem),
    yinYang: getStemYinYang(stem)
  };
}

/**
 * 计算日柱
 * 使用儒略日推算日干支
 */
function calculateDayPillar(year, month, day) {
  // 使用儒略日推算日干支
  // 已知：2000年1月7日为甲子日（干支序号为0）
  // 儒略日编号 2451551
  const jd = getJulianDay(year, month, day);
  const baseJD = 2451551; // 2000年1月7日 甲子日
  let offset = Math.floor(jd - baseJD);
  if (offset < 0) {
    offset = ((offset % 60) + 60) % 60;
  }
  const stemIndex = offset % 10;
  const branchIndex = offset % 12;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    stem,
    branch,
    element: getStemElement(stem),
    yinYang: getStemYinYang(stem)
  };
}

/**
 * 计算时柱
 * 根据日干和时辰推算
 */
function calculateHourPillar(hour, dayStemIndex) {
  const hourBranchIndex = getHourBranchIndex(hour);
  const branch = EARTHLY_BRANCHES[hourBranchIndex];
  const stemIndex = getHourStem(dayStemIndex, hourBranchIndex);
  const stem = HEAVENLY_STEMS[stemIndex];

  return {
    stem,
    branch,
    element: getStemElement(stem),
    yinYang: getStemYinYang(stem)
  };
}

// ==================== 导出函数 ====================

/**
 * 根据公历年月日时计算八字
 * @param {number} year - 公历年
 * @param {number} month - 公历月（1-12）
 * @param {number} day - 公历日（1-31）
 * @param {number} hour - 小时（0-23）
 * @returns {{ year: object, month: object, day: object, hour: object }}
 */
function calculateBazi(year, month, day, hour) {
  // 参数校验
  if (!year || !month || !day || hour === undefined || hour === null) {
    throw new Error('请提供完整的年月日时参数');
  }
  if (month < 1 || month > 12) {
    throw new Error('月份应在1-12之间');
  }
  if (day < 1 || day > 31) {
    throw new Error('日期应在1-31之间');
  }
  if (hour < 0 || hour > 23) {
    throw new Error('小时应在0-23之间');
  }

  // 计算年柱
  const yearPillar = calculateYearPillar(year, month, day);
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearPillar.stem);

  // 计算月柱
  const monthPillar = calculateMonthPillar(year, month, day, yearStemIndex);

  // 计算日柱
  const dayPillar = calculateDayPillar(year, month, day);
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayPillar.stem);

  // 计算时柱
  const hourPillar = calculateHourPillar(hour, dayStemIndex);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar
  };
}

/**
 * 五行分析
 * @param {object} bazi - calculateBazi 的返回结果
 * @returns {{ distribution: object, missing: string[], dominant: string, weak: string, balance: number }}
 */
function analyzeFiveElements(bazi) {
  const distribution = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };

  // 统计天干五行
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];
  pillars.forEach(pillar => {
    distribution[getStemElement(pillar.stem)] += 1.2; // 天干权重略高
    distribution[getBranchElement(pillar.branch)] += 1.0;
  });

  // 四舍五入
  Object.keys(distribution).forEach(key => {
    distribution[key] = Math.round(distribution[key] * 10) / 10;
  });

  // 找出缺失的五行
  const missing = Object.keys(distribution).filter(k => distribution[k] === 0);

  // 找出最旺和最弱的五行
  let dominant = '';
  let weak = '';
  let maxVal = -1;
  let minVal = Infinity;

  Object.keys(distribution).forEach(key => {
    if (distribution[key] > maxVal) {
      maxVal = distribution[key];
      dominant = key;
    }
    if (distribution[key] < minVal) {
      minVal = distribution[key];
      weak = key;
    }
  });

  // 计算平衡度（0-100）
  const values = Object.values(distribution);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
  const maxVariance = Math.pow(avg * 2, 2); // 最大可能方差
  const balance = Math.round(Math.max(0, Math.min(100, (1 - variance / maxVariance) * 100)));

  return {
    distribution,
    missing,
    dominant,
    weak,
    balance
  };
}

/**
 * 生成六维度分析
 * @param {object} bazi - 八字结果
 * @param {object} fiveElements - 五行分析结果
 * @returns {{ destiny, wealth, marriage, career, strengths, weaknesses, fortune }}
 */
function generateBaziReading(bazi, fiveElements) {
  const { distribution, dominant, weak, missing, balance } = fiveElements;
  const dayMaster = bazi.day.stem;
  const dayMasterElement = getStemElement(dayMaster);
  const dayMasterYinYang = getStemYinYang(dayMaster);
  const yearBranch = bazi.year.branch;
  const monthBranch = bazi.month.branch;

  // 日主强弱判断
  const dayMasterStrength = distribution[dayMasterElement];
  const isStrong = dayMasterStrength >= 2.5;
  const strengthDesc = isStrong ? '偏强' : '偏弱';

  // 用神分析
  const favorableElement = isStrong
    ? ELEMENT_OVERCOME_BY[dayMasterElement] || ELEMENT_GENERATED_BY[dayMasterElement]
    : ELEMENT_GENERATED_BY[dayMasterElement] || ELEMENT_GENERATED_BY[ELEMENT_GENERATED_BY[dayMasterElement]];
  const unfavorableElement = isStrong
    ? ELEMENT_GENERATES[dayMasterElement]
    : ELEMENT_OVERCOMES[dayMasterElement];

  // 生成命局分析文本的辅助函数
  function getDestinyContent() {
    const contents = [];

    // 基于日主分析
    contents.push(
      `你的日主为${dayMaster}${dayMasterElement}，${dayMasterYinYang}${dayMasterElement}之命。` +
      `${dayMasterElement}性${getElementNature(dayMasterElement)}，主${getElementTrait(dayMasterElement)}。`
    );

    // 基于强弱
    contents.push(
      `日主${strengthDesc}，${isStrong ? '身旺宜泄耗，宜从事消耗自身能量的活动来达到平衡' : '身弱宜生扶，宜借助外力来增强自身气场'}。` +
      `命局平衡度为${balance}分，${balance >= 70 ? '五行较为均衡，人生起伏相对平缓' : '五行偏颇较大，人生中可能经历较多转折与变化'}。`
    );

    // 基于缺失
    if (missing.length > 0) {
      contents.push(
        `命局中缺少${missing.join('、')}，${getMissingAdvice(missing)}。` +
        `建议在日常生活中通过颜色、方位、饮食等方面适当补充${missing.join('、')}的能量。`
      );
    } else {
      contents.push(
        `五行俱全，命局基础较为完备。` +
        `这在传统命理中被称为"五行不缺"，意味着人生各方面的发展都有一定的基础支撑。`
      );
    }

    return contents.join('');
  }

  function getWealthContent() {
    const wealthElement = ELEMENT_OVERCOME_BY[dayMasterElement]; // 我克者为财
    const wealthCount = distribution[wealthElement] || 0;

    let content = '';
    content += `从八字来看，你的财星为${wealthElement}，命局中${wealthElement}的力量${wealthCount >= 2 ? '较为充沛' : '相对不足'}。`;

    if (isStrong) {
      content += `日主${strengthDesc}，身强能担财，具备较强的财富承载能力。你适合通过自身的努力和能力去创造财富，财运总体较为稳健。`;
    } else {
      content += `日主${strengthDesc}，求财需借助他人之力或团队合作。不宜冒进投资，稳健积累是更好的策略。`;
    }

    content += getWealthPeriodAdvice(wealthElement, wealthCount);

    return content;
  }

  function getMarriageContent() {
    // 男命看财星，女命看官星（此处做通用分析）
    const marriageElement = ELEMENT_OVERCOMES[dayMasterElement]; // 克我者为官杀
    const marriageCount = distribution[marriageElement] || 0;

    let content = '';
    content += `你的感情星为${marriageElement}，命局中${marriageElement}的分布${marriageCount >= 2 ? '较为丰富' : marriageCount === 0 ? '较为稀少' : '适中'}。`;

    if (marriageCount >= 2) {
      content += `感情缘分较深，异性缘佳，但也要注意感情中的选择与取舍。过多的选择有时反而带来困扰，建议珍惜眼前人。`;
    } else if (marriageCount === 0) {
      content += `感情方面可能来得稍晚，但不必焦虑。晚婚反而能带来更成熟的感情关系，质量胜于速度。`;
    } else {
      content += `感情运势较为平稳，属于细水长流的类型。你的感情生活不会大起大落，更注重内心的真实感受。`;
    }

    content += `日柱${bazi.day.stem}${bazi.day.branch}代表夫妻宫，${bazi.day.branch}支${getBranchElement(bazi.day.branch)}气${getBranchYinYang(bazi.day.branch)}，暗示伴侣性格${getSpouseTrait(bazi.day.branch)}。`;

    return content;
  }

  function getCareerContent() {
    const careerElement = ELEMENT_GENERATED_BY[dayMasterElement]; // 生我者为印星（事业/学业）
    const powerElement = ELEMENT_OVERCOMES[dayMasterElement]; // 克我者为官杀（权力/事业）
    const careerCount = distribution[careerElement] || 0;
    const powerCount = distribution[powerElement] || 0;

    let content = '';
    content += `你的事业星为${careerElement}（印星）和${powerElement}（官杀星）。`;

    if (careerCount >= 2) {
      content += `印星较旺，适合从事教育、文化、研究等需要深厚知识积累的领域。你具备较强的学习能力和传承意识，在专业领域能够有所建树。`;
    } else if (powerCount >= 2) {
      content += `官杀较旺，具备领导才能和管理天赋。适合在组织架构中发展，或在需要决策力和执行力的岗位上发挥所长。`;
    } else {
      content += `事业星分布均匀，适合多元化发展。你不必局限于某一领域，跨界融合可能成为你的独特优势。`;
    }

    content += `月支${bazi.month.branch}代表事业宫，${bazi.month.branch}为${getBranchElement(bazi.month.branch)}，` +
      `${getMonthCareerAdvice(bazi.month.branch, dayMasterElement)}。`;

    return content;
  }

  function getStrengthsContent() {
    const strengths = [];

    // 基于日主五行
    strengths.push(getElementStrength(dayMasterElement));

    // 基于最旺五行
    strengths.push(getDominantStrength(dominant));

    // 基于年柱
    strengths.push(getYearStrength(bazi.year));

    return strengths.join('');
  }

  function getWeaknessesContent() {
    const weaknesses = [];

    // 基于最弱五行
    weaknesses.push(getWeaknessAnalysis(weak, dayMasterElement));

    // 基于缺失
    if (missing.length > 0) {
      weaknesses.push(getMissingWeakness(missing));
    }

    // 基于平衡度
    if (balance < 50) {
      weaknesses.push('命局五行失衡较为明显，可能在某些方面存在短板。建议有意识地培养自己的弱项，通过学习和实践来弥补先天的不足。');
    }

    return weaknesses.join('');
  }

  function getFortuneContent() {
    // 基于日主和五行生成运势分析
    let content = '';
    content += `综合你的八字命局来看，${dayMasterYinYang}${dayMasterElement}日主生于${bazi.month.branch}月，`;

    if (isStrong) {
      content += `得令得势，根基较为扎实。中年时期（30-50岁）是事业发展的黄金阶段，应把握机遇积极进取。`;
    } else {
      content += `需借助大运流年之力来补充能量。早年可能较为辛苦，但中年后运势逐渐好转，属于大器晚成之命。`;
    }

    content += `用神为${favorableElement}，逢${favorableElement}旺的年份运势较佳。`;

    if (missing.length > 0) {
      content += `逢${missing.join('、')}流年时需特别注意，可能会有一些挑战和考验，但也是成长的机会。`;
    }

    content += `总体而言，你的命局${balance >= 60 ? '格局较好，人生道路相对顺遂' : '虽有波折，但正所谓"命由天定，运由己造"'}，` +
      `关键在于如何把握时机、发挥优势、弥补不足。`;

    return content;
  }

  // 计算各维度评分
  const destinyScore = calculateScore(balance, missing.length, isStrong);
  const wealthScore = calculateWealthScore(distribution, dayMasterElement, isStrong);
  const marriageScore = calculateMarriageScore(distribution, dayMasterElement, bazi.day.branch);
  const careerScore = calculateCareerScore(distribution, dayMasterElement, bazi.month.branch);
  const strengthsScore = calculateStrengthsScore(distribution, balance);
  const weaknessesScore = calculateWeaknessesScore(missing.length, balance);
  const fortuneScore = calculateFortuneScore(balance, isStrong, missing.length);

  return {
    destiny: {
      title: '命局分析',
      icon: '🔮',
      content: getDestinyContent(),
      score: destinyScore
    },
    wealth: {
      title: '财运分析',
      icon: '💰',
      content: getWealthContent(),
      score: wealthScore
    },
    marriage: {
      title: '婚姻感情',
      icon: '💕',
      content: getMarriageContent(),
      score: marriageScore
    },
    career: {
      title: '事业前程',
      icon: '🎯',
      content: getCareerContent(),
      score: careerScore
    },
    strengths: {
      title: '性格优势',
      icon: '⭐',
      content: getStrengthsContent(),
      score: strengthsScore
    },
    weaknesses: {
      title: '潜在不足',
      icon: '📝',
      content: getWeaknessesContent(),
      score: weaknessesScore
    },
    fortune: {
      title: '运势展望',
      icon: '🌟',
      content: getFortuneContent(),
      score: fortuneScore
    }
  };
}

/**
 * 获取生肖信息
 * @param {number} year - 公历年
 * @returns {{ animal: string, element: string, yinYang: string, description: string }}
 */
function getZodiacInfo(year) {
  // 生肖以立春为界
  const lichun = getLichunDate(year);
  const now = new Date();
  let zodiacYear = year;
  if (now.getFullYear() === year && now < lichun) {
    zodiacYear = year - 1;
  } else if (year < 100) {
    // 如果传入的是两位数年份
    zodiacYear = year;
  }

  const branchIndex = (zodiacYear - 4) % 12;
  const stemIndex = (zodiacYear - 4) % 10;

  const animal = ZODIAC_ANIMALS[branchIndex];
  const stem = HEAVENLY_STEMS[stemIndex];
  const element = getStemElement(stem);
  const yinYang = getStemYinYang(stem);

  const description = getZodiacDescription(animal, element, yinYang);

  return {
    animal,
    element,
    yinYang,
    description
  };
}

// ==================== 分析辅助函数 ====================

function getElementNature(element) {
  const natures = {
    '金': '刚毅果断',
    '木': '仁慈向上',
    '水': '智慧灵活',
    '火': '热情奔放',
    '土': '厚重稳健'
  };
  return natures[element] || '';
}

function getElementTrait(element) {
  const traits = {
    '金': '义理与决断',
    '木': '仁爱与成长',
    '水': '智慧与变通',
    '火': '礼仪与热情',
    '土': '信义与包容'
  };
  return traits[element] || '';
}

function getMissingAdvice(missing) {
  const advices = {
    '金': '可通过佩戴金属饰品、穿着白色系衣物来补充金气',
    '木': '可多接触绿色植物、在东方方位活动来补充木气',
    '水': '可多饮水、居住近水之处来补充水气',
    '火': '可多晒太阳、穿着红色系衣物来补充火气',
    '土': '可通过登山、接触大地来补充土气'
  };
  return missing.map(m => advices[m] || '').filter(Boolean).join('；');
}

function getWealthPeriodAdvice(wealthElement, wealthCount) {
  if (wealthCount >= 2) {
    return `财运旺盛期多在中年，35岁之后财富积累速度加快。建议在财运好的时期做好资产配置，为长远发展打下基础。`;
  }
  return `财运虽非大富大贵之格，但胜在细水长流。正财为主，偏财为辅，适合稳健理财，不宜投机冒险。`;
}

function getSpouseTrait(branch) {
  const traits = {
    '子': '聪慧机敏，内心细腻',
    '丑': '踏实可靠，勤劳务实',
    '寅': '积极进取，充满活力',
    '卯': '温柔体贴，善解人意',
    '辰': '稳重深沉，有责任心',
    '巳': '聪明伶俐，热情开朗',
    '午': '正直坦率，充满魅力',
    '未': '温和善良，包容大度',
    '申': '机智灵活，多才多艺',
    '酉': '精致优雅，注重品质',
    '戌': '忠诚可靠，有担当',
    '亥': '富有想象力，心地善良'
  };
  return traits[branch] || '性格独特';
}

function getMonthCareerAdvice(monthBranch, dayMasterElement) {
  const advices = {
    '寅': '春季生人朝气蓬勃，适合创新和开拓性工作',
    '卯': '卯月生人善于沟通协调，适合公关、销售等需要人际交往的岗位',
    '辰': '辰月生人沉稳有度，适合管理、策划等需要全局观的工作',
    '巳': '巳月生人思维活跃，适合创意、设计等需要灵感的工作',
    '午': '午月生人热情洋溢，适合教育、培训等需要感染力的工作',
    '未': '未月生人耐心细致，适合研究、分析等需要专注力的工作',
    '申': '申月生人行动力强，适合执行、运营等需要效率的工作',
    '酉': '酉月生人追求完美，适合品质管理、艺术创作等领域',
    '戌': '戌月生人忠诚可靠，适合公共服务、法律等领域',
    '亥': '亥月生人富有洞察力，适合咨询、策划等需要深度思考的工作',
    '子': '子月生人智慧过人，适合学术研究、技术开发等领域',
    '丑': '丑月生人吃苦耐劳，适合实业、工程等需要毅力的领域'
  };
  return advices[monthBranch] || '事业发展前景良好';
}

function getElementStrength(element) {
  const strengths = {
    '金': '你天生具备果断的判断力和执行力，做事干脆利落，不拖泥带水。面对困难时能够保持冷静，善于在压力下做出正确决策。这种特质让你在竞争激烈的环境中脱颖而出。',
    '木': '你具有旺盛的生命力和成长动力，善于不断学习和提升自己。你的仁慈之心使你容易获得他人的信任和支持，人际关系和谐。在团队中，你往往是推动进步的核心力量。',
    '水': '你拥有敏锐的洞察力和灵活的思维方式，善于适应各种环境变化。你的智慧使你能够看到别人看不到的机会，在复杂局面中找到突破口。沟通能力出众，善于化解矛盾。',
    '火': '你充满热情和感染力，能够点燃周围人的积极性。你的行动力和领导魅力使你自然而然地成为焦点人物。在需要激情和动力的场合，你总能发挥出色的表现。',
    '土': '你为人踏实可靠，做事有始有终，是值得信赖的伙伴。你的包容力和耐心使你能够处理复杂的人际关系。在需要稳定和持久投入的领域，你能够展现出非凡的毅力。'
  };
  return strengths[element] || '';
}

function getDominantStrength(dominant) {
  const strengths = {
    '金': '命局中金气旺盛，赋予你强烈的正义感和原则性。你追求公平公正，不畏强权，敢于为正确的事情发声。同时，金的锐利也让你具备出色的分析能力和批判性思维。',
    '木': '命局中木气旺盛，赋予你蓬勃的创造力和发展潜力。你善于规划未来，具有远见卓识。木的仁慈特性使你在人际交往中广结善缘，贵人运较佳。',
    '水': '命局中水气旺盛，赋予你过人的智慧和应变能力。你思维敏捷，善于把握时机。水的流动特性使你适应力极强，在任何环境中都能找到生存和发展的空间。',
    '火': '命局中火气旺盛，赋予你强大的感染力和表现力。你热情开朗，善于激励他人。火的向上特性使你始终追求进步，不甘平庸，具有很强的进取精神。',
    '土': '命局中土气旺盛，赋予你深厚的包容力和稳定性。你为人宽厚，能够承载重任。土的厚重特性使你在困难面前不动如山，是团队中不可或缺的中流砥柱。'
  };
  return strengths[dominant] || '';
}

function getYearStrength(yearPillar) {
  const yearElement = yearPillar.element;
  const yearYinYang = yearPillar.yinYang;
  return `年柱${yearPillar.stem}${yearPillar.branch}为${yearYinYang}${yearElement}，代表你的祖基和早年环境。` +
    `${yearYinYang === '阳' ? '阳年柱暗示你早年生活较为活跃开放，家庭环境给予你较大的发展空间' : '阴年柱暗示你早年较为内敛沉稳，家庭环境注重内在修养'}。`;
}

function getWeaknessAnalysis(weak, dayMasterElement) {
  const weaknesses = {
    '金': `命局中金气不足，可能在决断力和执行力方面需要加强。有时会显得犹豫不决，错失良机。建议培养果断的品格，在做决定时给自己设定明确的时限。`,
    '木': `命局中木气不足，可能在创新力和进取心方面有所欠缺。有时会安于现状，缺乏突破的勇气。建议多接触新事物，拓展视野，激发内在的成长动力。`,
    '水': `命局中水气不足，可能在灵活性和应变能力方面需要提升。有时会显得固执己见，难以适应变化。建议培养开放的心态，学会从不同角度看待问题。`,
    '火': `命局中火气不足，可能在表达能力和社交热情方面有所不足。有时会显得过于内敛，难以充分展示自己的才华。建议多参与社交活动，锻炼表达能力。`,
    '土': `命局中土气不足，可能在耐心和稳定性方面需要加强。有时会显得浮躁不安，难以坚持长期目标。建议培养专注力和持久力，学会沉淀和积累。`
  };
  return weaknesses[weak] || '';
}

function getMissingWeakness(missing) {
  const weaknessMap = {
    '金': '缺少金气可能导致在人际边界感方面不够清晰，需要学会适度拒绝和保护自己。',
    '木': '缺少木气可能影响创造力和冒险精神，需要主动走出舒适区来激发潜能。',
    '水': '缺少水气可能使思维灵活性受限，需要多读书、多思考来拓宽认知边界。',
    '火': '缺少火气可能影响热情和感染力，需要找到真正热爱的事物来点燃内在激情。',
    '土': '缺少土气可能导致安全感不足，需要建立稳定的生活节奏和价值观体系。'
  };
  return missing.map(m => weaknessMap[m] || '').filter(Boolean).join('');
}

function getZodiacDescription(animal, element, yinYang) {
  const baseDescriptions = {
    '鼠': '机智灵活，善于把握机会，适应力极强。属鼠的人天生聪慧，善于观察和思考，在复杂的环境中能够迅速找到出路。',
    '牛': '勤恳踏实，意志坚定，做事有恒心。属牛的人以稳健著称，不急不躁，一步一个脚印地朝着目标前进。',
    '虎': '勇猛果敢，具有天然的领导气质。属虎的人充满自信和魄力，敢于挑战权威，追求卓越的成就。',
    '兔': '温和优雅，心思细腻，善于营造和谐的氛围。属兔的人具有出色的审美能力和人际交往技巧。',
    '龙': '气度不凡，胸怀大志，具有强大的感召力。属龙的人天生带有一种威严和魅力，容易成为众人瞩目的焦点。',
    '蛇': '智慧深沉，洞察力敏锐，善于谋划。属蛇的人外表冷静内心火热，具有极强的直觉和判断力。',
    '马': '热情奔放，自由不羁，行动力极强。属马的人热爱自由，追求速度与激情，不愿被束缚。',
    '羊': '温和善良，富有艺术气质，内心丰富。属羊的人具有极强的同理心，善于理解和关怀他人。',
    '猴': '聪明伶俐，多才多艺，善于创新。属猴的人思维活跃，反应敏捷，在各种领域都能展现出色的才华。',
    '鸡': '精致认真，追求完美，具有强烈的责任感。属鸡的人注重细节，做事一丝不苟，是完美的执行者。',
    '狗': '忠诚正直，具有强烈的正义感。属狗的人为人可靠，重情重义，是值得深交的挚友。',
    '猪': '豁达乐观，心地善良，具有天然的福气。属猪的人随和开朗，知足常乐，善于享受生活的美好。'
  };

  const elementDesc = `${yinYang}${element}之年出生，赋予了${getElementNature(element)}的特质。`;
  const base = baseDescriptions[animal] || '';

  return `${base}${elementDesc}`;
}

// ==================== 评分辅助函数 ====================

function calculateScore(balance, missingCount, isStrong) {
  let score = 3;
  score += Math.round((balance - 50) / 25); // 平衡度贡献
  score -= missingCount * 0.5; // 缺失扣分
  return Math.max(1, Math.min(5, Math.round(score)));
}

function calculateWealthScore(distribution, dayMasterElement, isStrong) {
  const wealthElement = ELEMENT_OVERCOME_BY[dayMasterElement];
  const wealthCount = distribution[wealthElement] || 0;
  let score = 2;
  score += wealthCount * 0.8;
  if (isStrong) score += 0.5;
  return Math.max(1, Math.min(5, Math.round(score)));
}

function calculateMarriageScore(distribution, dayMasterElement, dayBranch) {
  const marriageElement = ELEMENT_OVERCOMES[dayMasterElement];
  const marriageCount = distribution[marriageElement] || 0;
  let score = 2;
  score += marriageCount * 0.7;
  // 夫妻宫五行生扶日主加分
  const branchElement = getBranchElement(dayBranch);
  if (ELEMENT_GENERATES[branchElement] === dayMasterElement) score += 0.5;
  return Math.max(1, Math.min(5, Math.round(score)));
}

function calculateCareerScore(distribution, dayMasterElement, monthBranch) {
  const careerElement = ELEMENT_GENERATED_BY[dayMasterElement];
  const powerElement = ELEMENT_OVERCOMES[dayMasterElement];
  let score = 2;
  score += (distribution[careerElement] || 0) * 0.5;
  score += (distribution[powerElement] || 0) * 0.5;
  // 月支生扶日主加分
  const monthElement = getBranchElement(monthBranch);
  if (ELEMENT_GENERATES[monthElement] === dayMasterElement || monthElement === dayMasterElement) score += 0.5;
  return Math.max(1, Math.min(5, Math.round(score)));
}

function calculateStrengthsScore(distribution, balance) {
  let score = 3;
  const values = Object.values(distribution);
  const max = Math.max(...values);
  if (max >= 3) score += 1;
  if (balance >= 60) score += 0.5;
  return Math.max(1, Math.min(5, Math.round(score)));
}

function calculateWeaknessesScore(missingCount, balance) {
  let score = 4; // 基础分较高（越少弱点分越高）
  score -= missingCount * 0.8;
  if (balance < 40) score -= 0.5;
  return Math.max(1, Math.min(5, Math.round(score)));
}

function calculateFortuneScore(balance, isStrong, missingCount) {
  let score = 3;
  score += Math.round((balance - 50) / 30);
  if (isStrong) score += 0.3;
  score -= missingCount * 0.3;
  return Math.max(1, Math.min(5, Math.round(score)));
}

// ==================== 导出 ====================

export {
  calculateBazi,
  analyzeFiveElements,
  generateBaziReading,
  getZodiacInfo,
  // 以下为辅助常量和函数，供测试和扩展使用
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  FIVE_ELEMENTS,
  ZODIAC_ANIMALS,
  STEM_ELEMENT,
  BRANCH_ELEMENT,
  STEM_YIN_YANG,
  BRANCH_YIN_YANG,
  ELEMENT_GENERATES,
  ELEMENT_OVERCOMES,
  getStemElement,
  getBranchElement,
  getStemYinYang,
  getBranchYinYang,
  getHourBranchIndex,
  getHourBranchName
};
