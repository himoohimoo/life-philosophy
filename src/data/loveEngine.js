/**
 * 择偶观测评引擎
 *
 * 基于斯滕伯格"爱情三角理论"（Sternberg's Triangular Theory of Love）
 * 和"亲密关系适配度"核心维度的综合测评工具。
 *
 * 爱情三角理论由心理学家罗伯特·斯滕伯格于1986年提出，
 * 认为爱情由亲密（Intimacy）、激情（Passion）和承诺（Commitment）
 * 三个基本成分组成，不同组合形成不同类型的爱情。
 *
 * 此分析仅供自我参考，不构成专业心理评估或婚恋建议。
 */

// ==================== 选项定义 ====================

const OPTIONS = [
  { value: 0, label: '完全不符合' },
  { value: 1, label: '不太符合' },
  { value: 2, label: '一般' },
  { value: 3, label: '比较符合' },
  { value: 4, label: '完全符合' },
];

// ==================== 第一部分：爱情三角理论题目 ====================

const TRIANGLE_QUESTIONS = [
  // 亲密维度（5题）
  {
    id: 1,
    dimension: 'intimacy',
    text: '我希望能与伴侣分享内心最深处的想法和感受',
  },
  {
    id: 2,
    dimension: 'intimacy',
    text: '在关系中，情感上的理解和支持对我来说非常重要',
  },
  {
    id: 3,
    dimension: 'intimacy',
    text: '我愿意向伴侣完全敞开心扉',
  },
  {
    id: 4,
    dimension: 'intimacy',
    text: '我享受与伴侣之间深层次的情感交流',
  },
  {
    id: 5,
    dimension: 'intimacy',
    text: '信任是我在亲密关系中最看重的品质',
  },
  // 激情维度（5题）
  {
    id: 6,
    dimension: 'passion',
    text: '强烈的身体吸引力是我选择伴侣的重要标准',
  },
  {
    id: 7,
    dimension: 'passion',
    text: '我享受浪漫的约会和惊喜',
  },
  {
    id: 8,
    dimension: 'passion',
    text: '我需要感受到伴侣对我的强烈渴望',
  },
  {
    id: 9,
    dimension: 'passion',
    text: '浪漫和激情是爱情中不可缺少的元素',
  },
  {
    id: 10,
    dimension: 'passion',
    text: '我容易被有魅力的人吸引',
  },
  // 承诺维度（5题）
  {
    id: 11,
    dimension: 'commitment',
    text: '我认为婚姻/长期关系是爱情的必然归宿',
  },
  {
    id: 12,
    dimension: 'commitment',
    text: '我愿意为维持一段关系做出牺牲和妥协',
  },
  {
    id: 13,
    dimension: 'commitment',
    text: '忠诚和专一是我在关系中不可妥协的底线',
  },
  {
    id: 14,
    dimension: 'commitment',
    text: '我会认真规划与伴侣的未来',
  },
  {
    id: 15,
    dimension: 'commitment',
    text: '即使遇到困难，我也不会轻易放弃一段关系',
  },
];

// ==================== 第二部分：亲密关系适配度题目 ====================

const COMPAT_QUESTIONS = [
  // 价值观适配（2题）
  {
    id: 16,
    dimension: 'values',
    text: '我与伴侣在人生目标和追求上方向一致',
  },
  {
    id: 17,
    dimension: 'values',
    text: '我们对"什么是最重要的"有基本共识',
  },
  // 沟通模式（2题）
  {
    id: 18,
    dimension: 'communication',
    text: '我们能够坦诚地讨论分歧和敏感话题',
  },
  {
    id: 19,
    dimension: 'communication',
    text: '在冲突中，我们倾向于理性沟通而非冷战或争吵',
  },
  // 情感需求（2题）
  {
    id: 20,
    dimension: 'emotional',
    text: '我清楚自己在关系中需要什么样的情感支持',
  },
  {
    id: 21,
    dimension: 'emotional',
    text: '伴侣能够理解并满足我的核心情感需求',
  },
  // 生活习惯（2题）
  {
    id: 22,
    dimension: 'lifestyle',
    text: '我们在日常作息、消费观念等生活习惯上比较协调',
  },
  {
    id: 23,
    dimension: 'lifestyle',
    text: '我们对"理想的生活方式"有相似的想象',
  },
  // 成长方向（2题）
  {
    id: 24,
    dimension: 'growth',
    text: '我们愿意一起学习新事物、共同成长',
  },
  {
    id: 25,
    dimension: 'growth',
    text: '我们尊重彼此的个人发展空间和独立目标',
  },
];

// ==================== 维度描述数据库 ====================

const TRIANGLE_DIM_INFO = {
  intimacy: {
    label: '亲密',
    color: '#ec4899',
    descs: {
      high: '你对情感亲近有很高的需求，渴望与伴侣建立深层次的情感联结。你重视信任、理解和分享，这使你成为一个温暖而深情的伴侣。',
      medium: '你对亲密关系有一定需求，但可能在某些时候会保持一定的情感距离。你能在适当的时候敞开心扉，但也需要个人空间。',
      low: '你对情感亲近的需求相对较低，可能更倾向于保持独立和自我。在关系中，你可能需要更多时间来建立深层的情感联结。',
    },
  },
  passion: {
    label: '激情',
    color: '#ef4444',
    descs: {
      high: '你对浪漫和激情有强烈的渴望，身体吸引力和浪漫体验对你来说非常重要。你享受恋爱中的心动和热烈感。',
      medium: '你对激情有一定需求，但不会将其作为关系的唯一支柱。你能在浪漫与现实之间找到平衡。',
      low: '你对浪漫激情的需求相对较低，可能更看重关系的稳定性和实际价值。这不意味着你不会爱人，只是表达方式不同。',
    },
  },
  commitment: {
    label: '承诺',
    color: '#6366f1',
    descs: {
      high: '你对关系承诺有很高的重视度，愿意为长期关系付出努力和牺牲。你是一个忠诚可靠的伴侣，重视关系的稳定和持久。',
      medium: '你对承诺持较为理性的态度，愿意为关系付出但也会考虑实际情况。你在投入与自我保护之间寻求平衡。',
      low: '你对传统的关系承诺形式可能不太执着，更看重当下的感受和体验。你可能需要更多时间才会做出长期承诺。',
    },
  },
};

// ==================== 适配度维度描述数据库 ====================

const COMPAT_DIM_INFO = {
  values: {
    name: '价值观适配',
    descs: {
      high: '你与伴侣在人生方向和核心价值观上高度一致，这为你们的关系奠定了坚实的基础。共同的价值观能帮助你们在面对重大决策时保持团结。',
      medium: '你们在核心价值观上有一定共识，但在某些方面可能存在差异。重要的是学会尊重差异，在重要问题上寻找共同点。',
      low: '你们在价值观方面可能存在较大差异，这可能导致在重大决策上产生分歧。建议坦诚沟通各自的价值观，寻找可以接受的中间地带。',
    },
    advices: {
      high: '继续保持对彼此价值观的理解和尊重，定期交流各自的人生目标和追求，确保你们始终在同一方向上前进。',
      medium: '建议定期进行深度对话，了解彼此在金钱观、家庭观、事业观等方面的真实想法，在差异中寻找互补和融合的可能。',
      low: '需要认真审视你们的价值观差异是否会影响长期关系。建议寻求专业的伴侣咨询，学习如何在价值观不同的情况下建立和谐关系。',
    },
  },
  communication: {
    name: '沟通模式',
    descs: {
      high: '你们拥有健康的沟通模式，能够坦诚地表达想法和感受，也能有效地处理分歧。良好的沟通是关系长久发展的关键。',
      medium: '你们的沟通模式总体良好，但在面对敏感话题时可能需要更多耐心和技巧。学会倾听和表达同样重要。',
      low: '你们在沟通方面可能存在一些障碍，容易陷入误解或回避。建议学习非暴力沟通技巧，建立安全的对话环境。',
    },
    advices: {
      high: '继续保持开放和诚实的沟通习惯，定期进行"关系复盘"，及时解决小问题，避免积累成大矛盾。',
      medium: '尝试设定"无评判对话时间"，在轻松的氛围中讨论敏感话题。学习"我信息"表达法，用"我感觉..."代替"你总是..."。',
      low: '强烈建议学习非暴力沟通（NVC）技巧，或者考虑伴侣沟通工作坊。记住，沟通是可以通过练习改善的技能。',
    },
  },
  emotional: {
    name: '情感需求',
    descs: {
      high: '你们能够很好地理解和满足彼此的情感需求，这创造了深厚的情感安全感和归属感。你们是彼此的情感避风港。',
      medium: '你们对彼此的情感需求有一定了解，但可能存在未被满足的需求。更深入的沟通可以帮助你们更好地理解对方。',
      low: '你们在情感需求的匹配上可能存在较大差距，一方或双方可能感到情感上的不满足。需要认真对待这个问题。',
    },
    advices: {
      high: '继续保持对彼此情感需求的关注，不要因为关系稳定就忽视情感表达。定期创造深度交流的机会，如约会之夜。',
      medium: '建议双方都明确表达自己的核心情感需求（如被认可、被陪伴、被理解等），并学习用对方能接受的方式满足这些需求。',
      low: '建议使用"爱的五种语言"框架来了解彼此的情感需求类型，并尝试用对方能感受到的方式表达爱意。',
    },
  },
  lifestyle: {
    name: '生活习惯',
    descs: {
      high: '你们在生活习惯上高度协调，日常相处轻松自然。相似的生活方式减少了不必要的摩擦，让关系更加和谐。',
      medium: '你们的生活习惯有一定差异，但总体上可以互相适应。关键是在重要方面达成共识，在小事上互相包容。',
      low: '你们在生活习惯上可能存在较大差异，这可能会给日常相处带来挑战。需要双方都做出调整和妥协。',
    },
    advices: {
      high: '珍惜你们在生活习惯上的默契，同时保持开放心态接受彼此的小差异。偶尔尝试对方喜欢的生活方式，增加共同体验。',
      medium: '找出生活习惯中最重要的几个方面（如作息、消费、卫生等），在这些方面达成明确共识，在其他方面保持灵活。',
      low: '建议制定"生活公约"，明确各自的责任和底线。学会在核心习惯上妥协，在不影响关系的小习惯上保持独立。',
    },
  },
  growth: {
    name: '成长方向',
    descs: {
      high: '你们是彼此成长的伙伴，既能一起进步，又能尊重各自的独立发展。这种共同成长的模式让关系充满活力。',
      medium: '你们有一定的共同成长意识，但可能在个人目标和共同目标之间需要更好的平衡。',
      low: '你们在成长方向上可能存在较大分歧，一方可能感到被拖累，另一方可能感到被限制。需要重新审视你们的成长节奏。',
    },
    advices: {
      high: '继续保持共同成长的势头，定期分享各自的学习和进步。可以设定共同的目标和挑战，一起突破舒适区。',
      medium: '建议制定个人和共同的成长计划，确保双方都有追求自我发展的空间，同时也有一起成长的共同目标。',
      low: '需要坦诚讨论各自的成长期望和节奏。记住，好的关系不是要求步调一致，而是互相支持和鼓励各自的发展。',
    },
  },
};

// ==================== 爱情类型定义 ====================

const LOVE_TYPES = {
  consummate: {
    name: '完美爱情型',
    emoji: '\u{1F495}',
    desc: '你同时拥有高水平的亲密、激情和承诺，这是斯滕伯格认为最理想的爱情形态。你的爱情既有深层的情感联结，又有热烈的浪漫吸引，还有坚定的长期承诺。这种爱情是大多数人梦寐以求的，但也需要持续的经营和投入来维持。',
    advice: '恭喜你拥有如此完整的爱情观！要维持这种理想状态，建议你持续投入时间和精力经营关系，保持新鲜感和浪漫，同时不断加深彼此的理解和信任。记住，完美爱情不是一劳永逸的，它需要双方持续不断的努力和创造。',
  },
  romantic: {
    name: '浪漫爱情型',
    emoji: '\u{1F498}',
    desc: '你拥有高水平的亲密和激情，但在承诺方面相对不足。你享受与伴侣之间深层的情感交流和浪漫体验，但对做出长期承诺可能还有些犹豫。你的爱情充满温度和火花，像一首动人的情歌。',
    advice: '你的爱情充满了浪漫和温情，这是非常珍贵的。建议你认真思考是什么阻碍了你做出更深层的承诺——是对未知的恐惧，还是对失去自由的担忧？当你准备好时，勇敢地迈出那一步，你可能会发现承诺带来的安全感反而让爱情更加美好。',
  },
  companionate: {
    name: '伴侣爱情型',
    emoji: '\u{1F91D}',
    desc: '你拥有高水平的亲密和承诺，但激情相对较低。你的关系建立在深厚的情感联结和坚定的承诺之上，像一杯温热的茶，温暖而持久。虽然可能缺少一些火花，但你们之间的信任和默契是很多人羡慕的。',
    advice: '你的关系拥有最稳固的基石——深厚的情感和坚定的承诺。建议你有意识地注入一些浪漫元素，比如定期约会、制造惊喜、尝试新的共同体验。激情不一定需要轰轰烈烈，日常中的小浪漫也能为关系增添色彩。',
  },
  fatuous: {
    name: '虚幻爱情型',
    emoji: '\u{1F525}',
    desc: '你拥有高水平的激情和承诺，但亲密感相对不足。你可能被强烈的吸引力和对关系的决心所驱动，但缺乏深层的情感了解和信任。这种爱情像一场燃烧的烈火，热烈但可能不够持久。',
    advice: '你的热情和决心值得赞赏，但一段真正长久的关系需要更深层的情感基础。建议你放慢节奏，花更多时间了解伴侣的内心世界。真正的亲密不是一蹴而就的，它需要时间、耐心和真诚的自我暴露。在做出重大承诺之前，确保你们之间有足够的了解和信任。',
  },
  friend: {
    name: '友谊爱情型',
    emoji: '\u{1F917}',
    desc: '你拥有高水平的亲密感，但激情和承诺相对较低。你与伴侣之间有深厚的情感联结和理解，但可能缺少浪漫的火花和对长期关系的明确承诺。你们的关系更像一段深厚的友谊。',
    advice: '你拥有建立深层情感联结的能力，这是非常宝贵的。思考一下，你是否愿意将这段关系推向更深层次？如果答案是肯定的，可以尝试增加一些浪漫元素，并认真思考你对这段关系的长期期望。如果你们双方都满足于当前的状态，那也是一种美好的关系形态。',
  },
  infatuation: {
    name: '迷恋型',
    emoji: '\u{1F60D}',
    desc: '你拥有高水平的激情，但亲密和承诺相对较低。你容易被强烈的吸引力所驱动，享受心动和迷恋的感觉，但可能还没有建立深层的情感联结，也还没有做好长期承诺的准备。你的爱情像烟花，绚烂但短暂。',
    advice: '享受心动的感觉没有错，但如果想要一段长久的关系，你需要投入更多时间去真正了解对方。建议你在激情之外，也关注彼此的价值观、生活习惯和人生目标。真正的爱情需要时间来沉淀，不要急于做出判断或承诺。',
  },
  pragmatic: {
    name: '务实爱情型',
    emoji: '\u{1F4CB}',
    desc: '你拥有高水平的承诺，但亲密和激情相对较低。你可能基于理性考虑（如家庭背景、经济条件、社会期望等）而选择维持一段关系，但可能缺少深层的情感联结和浪漫体验。你的爱情更像一份契约。',
    advice: '你的责任感和忠诚度值得尊重，但一段真正幸福的关系需要更多的情感投入。建议你尝试向伴侣敞开心扉，分享你的想法和感受。同时，也可以有意识地创造一些浪漫时刻。记住，爱情不仅是责任，更是两个灵魂之间的共鸣。',
  },
  undefined: {
    name: '未定型',
    emoji: '\u{1F331}',
    desc: '你在亲密、激情和承诺三个维度上的得分都相对较低，这可能意味着你还没有找到让你全身心投入的爱情，或者你目前对爱情的态度比较淡然。这也是一种正常的状态，每个人对爱情的节奏和需求都不同。',
    advice: '不要因为没有明确的"爱情类型"而感到焦虑。也许你只是还没有遇到那个让你心动的人，或者你目前更专注于其他方面的生活。保持开放的心态，了解自己对爱情的真正需求。当你准备好了，爱情自然会到来。同时，也可以反思一下是什么因素影响了你对爱情的投入度。',
  },
};

// ==================== 综合建议模板 ====================

function generateSuggestions(triangle, loveType, compatibility) {
  const { intimacy, passion, commitment } = triangle;
  const dims = [intimacy, passion, commitment].sort((a, b) => b.percent - a.percent);
  const strongest = dims[0];
  const weakest = dims[2];

  // 优势建议
  const advantageMap = {
    intimacy: '你拥有建立深层情感联结的强大能力，能够给予伴侣温暖的理解和支持。这种情感深度是长久关系的宝贵基础。',
    passion: '你对浪漫和激情的强烈追求让你的爱情充满活力和色彩。你懂得如何让伴侣感受到被渴望和被爱。',
    commitment: '你对关系的坚定承诺和忠诚是极为珍贵的品质。你的伴侣会因为你的可靠和稳定而感到安心。',
  };

  // 注意事项
  const cautionMap = {
    intimacy: '你可能在情感表达上比较含蓄或保留，建议尝试更主动地分享内心感受，让伴侣更深入地了解你。',
    passion: '你可能在浪漫方面投入较少，建议偶尔为伴侣制造一些小惊喜，保持关系中的新鲜感和浪漫元素。',
    commitment: '你可能对长期承诺有些犹豫或不确定，建议认真思考是什么阻碍了你，并与伴侣坦诚交流你的顾虑。',
  };

  // 择偶建议
  const mateAdviceMap = {
    consummate: '你已经具备了经营理想关系的所有要素，择偶时重点寻找与你同样重视亲密、激情和承诺的人。建议寻找在情感成熟度和关系经营能力上与你匹配的伴侣。',
    romantic: '你需要一个既能与你分享深层情感，又能给你安全感和稳定感的人。择偶时注意对方是否具备足够的责任感和长期规划能力。',
    companionate: '你需要一个能为你的生活注入激情和浪漫的人。择偶时可以关注那些富有创造力和浪漫细胞的人，同时确保你们有共同的价值观。',
    fatuous: '你需要一个愿意花时间与你建立深层情感联结的人。择偶时不要被表面的吸引力所迷惑，要关注对方的内在品质和情感深度。',
    friend: '你需要一个既能与你保持深厚友谊，又能激发你浪漫一面的人。择偶时注意对方是否能在情感深度之外，给你带来心动的感觉。',
    infatuation: '你需要一个能让你慢下来、深入了解的人。择偶时不要只看外表和初印象，要关注对方的性格、价值观和人生目标是否与你匹配。',
    pragmatic: '你需要一个能帮助你打开心扉、体验浪漫的人。择偶时在理性考量之外，也要关注你与对方之间是否有真正的情感共鸣和吸引力。',
    undefined: '你目前可能还在探索自己对爱情的真正需求。建议先了解自己的核心价值观和情感需求，然后再寻找与之匹配的伴侣。不要急于进入一段关系，先成为最好的自己。',
  };

  // 成长方向
  const growthSuggestions = [];
  if (intimacy.percent < 75) growthSuggestions.push('培养更深层的情感表达能力，学习如何与伴侣分享内心世界');
  if (passion.percent < 75) growthSuggestions.push('探索浪漫的多种表达方式，为关系注入更多创意和新鲜感');
  if (commitment.percent < 75) growthSuggestions.push('思考自己对长期关系的期望，建立对承诺的信心');
  if (compatibility.overall < 75) growthSuggestions.push('加强与伴侣在核心维度上的沟通和协调，提升关系适配度');
  if (growthSuggestions.length === 0) growthSuggestions.push('继续保持当前良好的关系经营状态，不断探索让爱情更美好的可能性');

  return [
    {
      icon: '\u{1F4A1}',
      title: '你的爱情优势',
      content: advantageMap[strongest.label === '亲密' ? 'intimacy' : strongest.label === '激情' ? 'passion' : 'commitment'],
    },
    {
      icon: '\u{26A0}\u{FE0F}',
      title: '需要注意的方面',
      content: cautionMap[weakest.label === '亲密' ? 'intimacy' : weakest.label === '激情' ? 'passion' : 'commitment'],
    },
    {
      icon: '\u{1F3AF}',
      title: '择偶建议',
      content: mateAdviceMap[loveType.key],
    },
    {
      icon: '\u{1F331}',
      title: '关系成长方向',
      content: growthSuggestions.join('；') + '。',
    },
  ];
}

// ==================== 导出函数 ====================

/**
 * 获取择偶观测评题目（分两部分）
 * @returns {Object} { triangle: [...15题], compatibility: [...10题] }
 */
export function getLoveQuestions() {
  return {
    triangle: TRIANGLE_QUESTIONS.map(q => ({
      id: q.id,
      dimension: q.dimension,
      text: q.text,
      options: OPTIONS,
    })),
    compatibility: COMPAT_QUESTIONS.map(q => ({
      id: q.id,
      dimension: q.dimension,
      text: q.text,
      options: OPTIONS,
    })),
  };
}

/**
 * 计算测评结果
 * @param {number[]} triangleAnswers - 长度15数组(0-4分)
 * @param {number[]} compatAnswers - 长度10数组(0-4分)
 * @returns {Object} 完整的分析结果对象
 */
export function calculateLove(triangleAnswers, compatAnswers) {
  // 参数校验
  if (!Array.isArray(triangleAnswers) || triangleAnswers.length !== 15) {
    throw new Error('triangleAnswers 必须是长度为15的数组');
  }
  if (!Array.isArray(compatAnswers) || compatAnswers.length !== 10) {
    throw new Error('compatAnswers 必须是长度为10的数组');
  }
  if (triangleAnswers.some(a => typeof a !== 'number' || a < 0 || a > 4)) {
    throw new Error('triangleAnswers 每项必须是0-4之间的数字');
  }
  if (compatAnswers.some(a => typeof a !== 'number' || a < 0 || a > 4)) {
    throw new Error('compatAnswers 每项必须是0-4之间的数字');
  }

  // ===== 计算爱情三角三维得分 =====
  const dimensions = { intimacy: 0, passion: 0, commitment: 0 };
  TRIANGLE_QUESTIONS.forEach((q, i) => {
    dimensions[q.dimension] += triangleAnswers[i];
  });

  const maxDimScore = 20; // 5题 * 4分

  const getLevel = (percent) => {
    if (percent >= 75) return 'high';
    if (percent >= 50) return 'medium';
    return 'low';
  };

  const triangleResult = {};
  const dimKeys = ['intimacy', 'passion', 'commitment'];
  dimKeys.forEach(key => {
    const score = dimensions[key];
    const percent = Math.round((score / maxDimScore) * 100);
    const level = getLevel(percent);
    triangleResult[key] = {
      score,
      maxScore: maxDimScore,
      percent,
      label: TRIANGLE_DIM_INFO[key].label,
      desc: TRIANGLE_DIM_INFO[key].descs[level],
      color: TRIANGLE_DIM_INFO[key].color,
    };
  });

  // ===== 判断爱情类型 =====
  const iHigh = triangleResult.intimacy.percent >= 75;
  const pHigh = triangleResult.passion.percent >= 75;
  const cHigh = triangleResult.commitment.percent >= 75;

  let loveTypeKey;
  if (iHigh && pHigh && cHigh) loveTypeKey = 'consummate';
  else if (iHigh && pHigh) loveTypeKey = 'romantic';
  else if (iHigh && cHigh) loveTypeKey = 'companionate';
  else if (pHigh && cHigh) loveTypeKey = 'fatuous';
  else if (iHigh) loveTypeKey = 'friend';
  else if (pHigh) loveTypeKey = 'infatuation';
  else if (cHigh) loveTypeKey = 'pragmatic';
  else loveTypeKey = 'undefined';

  const loveTypeData = LOVE_TYPES[loveTypeKey];

  // ===== 计算适配度得分 =====
  const compatDimensions = { values: 0, communication: 0, emotional: 0, lifestyle: 0, growth: 0 };
  COMPAT_QUESTIONS.forEach((q, i) => {
    compatDimensions[q.dimension] += compatAnswers[i];
  });

  const maxCompatDim = 8; // 2题 * 4分

  const compatDimResults = Object.keys(compatDimensions).map(key => {
    const score = compatDimensions[key];
    const percent = Math.round((score / maxCompatDim) * 100);
    const level = getLevel(percent);
    return {
      name: COMPAT_DIM_INFO[key].name,
      score: percent,
      desc: COMPAT_DIM_INFO[key].descs[level],
      advice: COMPAT_DIM_INFO[key].advices[level],
    };
  });

  const overallCompat = Math.round(
    compatDimResults.reduce((sum, d) => sum + d.score, 0) / compatDimResults.length
  );

  // ===== 生成综合建议 =====
  const suggestions = generateSuggestions(triangleResult, { key: loveTypeKey }, { overall: overallCompat });

  return {
    triangle: triangleResult,
    loveType: {
      name: loveTypeData.name,
      desc: loveTypeData.desc,
      emoji: loveTypeData.emoji,
      advice: loveTypeData.advice,
    },
    compatibility: {
      overall: overallCompat,
      dimensions: compatDimResults,
    },
    suggestions,
  };
}
