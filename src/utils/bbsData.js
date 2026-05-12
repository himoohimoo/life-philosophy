// BBS帖子和评论数据管理
// 使用 localStorage 存储，支持美食和玩乐两个板块

const STORAGE_KEY = 'life_philosophy_bbs';

// 初始化默认数据
const defaultPosts = {
  food: [
    {
      id: 'food-1',
      title: '回民街必吃清单｜本地人带你吃最正宗的西安美食',
      author: '西安土著',
      authorId: 'system',
      content: `来西安玩的朋友必看！作为在回民街附近住了20年的西安人，给大家分享一些真正好吃的店：

**泡馍类**
- 老孙家泡馍：最正宗，但价格稍贵
- 一真楼：本地人常去，性价比高
- 老米家大雨泡馍：牛肉泡馍一绝

**烤肉串**
- 贾三朋友烤肉：炭火香味绝了
- 马楠烤肉：凌晨2点还在排队

**其他推荐**
- 东南亚甑糕：早上6点开门，售完即止
- 希木酸奶：原味最经典

⚠️ 避坑指南：
- 任何主动搭讪说带你去的都不要理
- 问价之前先看菜单
- 网红店排队2小时不如隔壁本地店`,
      likes: 328,
      replies: 56,
      time: '2024-01-15 10:30',
      tags: ['回民街', '泡馍', '烤肉', '攻略'],
      location: '回民街（北院门）',
      priceRange: '人均30-80元',
      createdAt: Date.now() - 86400000 * 30
    },
    {
      id: 'food-2',
      title: '永兴坊Vs回民街｜哪个更值得去？',
      author: '吃货小分队',
      authorId: 'system',
      content: `很多朋友问永兴坊和回民街该怎么选，我来说说我的看法：

**永兴坊**
✅ 优点：
- 环境好，干净整洁
- 汇集陕西各地小吃
- 有摔碗酒等网红项目
- 适合拍照打卡

❌ 缺点：
- 价格偏贵
- 味道不如回民街正宗
- 游客太多

**回民街**
✅ 优点：
- 味道更正宗
- 价格实惠
- 更有西安烟火气
- 可以砍价

❌ 缺点：
- 环境一般
- 需要会挑店

**我的建议**：
第一次来西安 → 去永兴坊打卡拍照
深度游 → 去回民街找好吃的
两者都要 → 永兴坊白天，回民街晚上`,
      likes: 215,
      replies: 43,
      time: '2024-01-10 15:20',
      tags: ['永兴坊', '对比', '攻略'],
      location: '永兴坊',
      priceRange: '人均50-100元',
      createdAt: Date.now() - 86400000 * 25
    },
    {
      id: 'food-3',
      title: '藏在巷子里的神仙面馆｜只有本地人才知道',
      author: '面食爱好者',
      authorId: 'system',
      content: `西安的面食真的绝了！今天推荐几家藏在巷子里的小店：

**1. 爱骅裤带面馆**
📍 碑林区东木头市
💰 人均15元
⭐ biangbiang面，配肉臊子和油泼辣子，一口下去满足感爆棚

**2. 柳巷面**
📍 新城区案板街
💰 人均20元
⭐ 传说中的西安三大面之一，味道偏重口

**3. 汇聚德臊子面**
📍 莲湖区洒金桥
💰 人均12元
⭐ 正宗岐山臊子面，酸辣可口

**4. 马虎面**
📍 雁塔区翠华路
💰 人均18元
⭐ 二十多年老店，本地人早餐首选

小提示：西安的面馆普遍分量很大，男孩子一碗就够了，女孩子可以要小碗或者两人一碗～`,
      likes: 189,
      replies: 32,
      time: '2024-01-08 09:15',
      tags: ['面食', '隐藏美食', '性价比'],
      location: '多个地点',
      priceRange: '人均12-20元',
      createdAt: Date.now() - 86400000 * 20
    },
    {
      id: 'food-4',
      title: '小南门早市｜体验最地道的西安烟火气',
      author: '早起困难户',
      authorId: 'system',
      content: `谁说来西安只能吃回民街？小南门早市才是本地人的天堂！

**什么是小南门早市？**
位于朱雀门内，每周六周日早上6点到9点，周边村民会来卖新鲜的蔬菜、水果、小吃。

**必吃推荐**：
🥣 糊辣汤：5元一碗，配上油条绝了
🥚 茶叶蛋：2元一个，入味
🥧 菜盒：韭菜鸡蛋馅，外酥里嫩
🍡 甑糕：推车卖的，5元一盒
🫓 坨坨馍：夹腊牛肉一绝

**实用信息**：
📍 地址：碑林区朱雀门内小南门
⏰ 时间：周六周日 6:00-9:00
💰 人均：15-30元
🚇 交通：地铁2号线永宁门站A2口

⚠️ 注意：
1. 一定要早去，8点之后很多就卖完了
2. 周内没有早市，别跑空了
3. 可以带个布袋子买菜，新鲜又便宜`,
      likes: 276,
      replies: 48,
      time: '2024-01-05 08:00',
      tags: ['早市', '烟火气', '本地人'],
      location: '小南门早市',
      priceRange: '人均15-30元',
      createdAt: Date.now() - 86400000 * 15
    }
  ],
  play: [
    {
      id: 'play-1',
      title: '西安3日游精华路线｜教科书级别的攻略',
      author: '旅行规划师',
      authorId: 'system',
      content: `作为一个在西安读了4年大学的过来人，给大家整理了一条经典的3日游路线：

**Day 1 - 历史穿越**
🕘 9:00 陕西历史博物馆（提前3天预约！）
🕛 12:00 大雁塔+大慈恩寺
🕐 14:00 大唐不夜城（大雁塔北广场）
🕗 19:00 大唐不夜城夜景+不倒翁小姐姐

**Day 2 - 秦俑探秘**
🕗 8:00 出发去临潼
🕘 9:30 秦始皇兵马俑（建议请导游）
🕛 12:30 华清池
🕐 14:00 骊山索道（可选）
🕗 19:00 长恨歌演出（强烈推荐！）

**Day 3 - 古城漫步**
🕗 8:00 城墙骑行（建议从南门上）
🕙 10:00 碑林博物馆
🕛 12:00 钟楼+鼓楼
🕐 14:00 回民街觅食
🕓 16:00 高家大院（看皮影戏）

**省钱Tips**：
1. 钟楼没必要上去，远观即可
2. 陕历博免费但要提前预约
3. 城墙学生证半价
4. 兵马俑建议报一日游，省心`,
      likes: 456,
      replies: 89,
      time: '2024-01-12 14:00',
      tags: ['3日游', '经典路线', '攻略'],
      route: '古迹研学线',
      estimatedTime: '3天',
      bestSeason: '春秋',
      createdAt: Date.now() - 86400000 * 28
    },
    {
      id: 'play-2',
      title: '华山一日游｜去之前一定要看这篇！',
      author: '户外爱好者',
      authorId: 'system',
      content: `"奇险天下第一山"名不虚传！但去华山之前，这些你必须知道：

**关于路线选择**：

🚠 西峰索道上山（推荐体力一般的）
- 优点：省力，可以游览更多景点
- 缺点：错过长空栈道
- 适合人群：老人小孩、第一次来

🚶 北峰徒步上山
- 优点：体验攀爬的乐趣
- 缺点：需要4-5小时体力
- 适合人群：年轻人、户外爱好者

**必去景点**：
1. 长空栈道 - 最刺激，但要排队2小时
2. 鹞子翻身 - 在南峰，需要绳索
3. 东峰日出 - 夜爬必去
4. 西峰日落 - 最美

**装备清单**：
- 登山鞋/防滑鞋
- 手套（攀爬要用）
- 防晒霜
- 充足的水和干粮
- 厚外套（山顶冷）

**我的行程**（西上北下）：
07:00 高铁到华山
08:00 西峰索道上山
09:00 开始游览
14:00 北峰索道下山
15:30 返回西安

⚠️ 注意：
- 节假日人巨多，排队3小时起步
- 提前买好返程票
- 山顶物价是山下的3倍`,
      likes: 312,
      replies: 67,
      time: '2024-01-09 11:30',
      tags: ['华山', '一日游', '徒步'],
      route: '自然探险线',
      estimatedTime: '1天',
      bestSeason: '4-10月',
      createdAt: Date.now() - 86400000 * 22
    },
    {
      id: 'play-3',
      title: '法门寺深度游｜佛骨舍利瞻仰攻略',
      author: '禅意行者',
      authorId: 'system',
      content: `法门寺，因供奉佛指舍利而闻名于世。这是我去过最震撼的地方之一。

**关于佛指舍利**：
据佛教典籍记载，释迦牟尼灭度后留下四枚舍利，其中一枚供奉于法门寺。每30年才公开瞻仰一次，上次公开是2002年，下次预计在2030年左右。

**游览攻略**：

**景区构成**：
1. 法门寺（老寺）- 有真身宝塔和地宫
2. 法门寺博物馆 - 展示出土文物
3. 合十舍利塔（新塔）- 供奉佛指舍利

**游览路线**（建议3-4小时）：
景区门口 → 合十舍利塔（瞻仰舍利）→ 法门寺博物馆 → 老法门寺 → 真身宝塔 → 地宫

**开放时间**：
旺季（3-11月）：08:00-18:00
淡季（12-2月）：09:00-17:00
门票：旺季100元，淡季90元

**关于请香**：
- 景区内请香较贵
- 建议在外面买，10元三炷足够
- 心诚则灵，不用攀比

**交通建议**：
🚗 自驾：西安出发约2小时
🚌 直通车：城西客运站有直达车
🚄 高铁：西安北到杨陵南，换乘大巴

**斋饭体验**：
寺内有斋堂，15元一位，味道不错，但需要提前预约。

💡 小提示：初一十五人超多，建议避开`,
      likes: 234,
      replies: 45,
      time: '2024-01-07 16:45',
      tags: ['法门寺', '佛教', '寺庙'],
      route: '佛教文化线',
      estimatedTime: '1天',
      bestSeason: '全年',
      createdAt: Date.now() - 86400000 * 18
    },
    {
      id: 'play-4',
      title: '西安骑行路线推荐｜用脚踏遍这座城',
      author: '骑行达人',
      authorId: 'system',
      content: `在西安骑行了5年，给大家推荐几条经典的骑行路线：

**🌟 环城公园骑行（入门级）**
📏 全程：约15公里
⏱ 用时：2-3小时
难度：⭐

西安城墙脚下的环城公园，路况好，风景美，还能看到城墙上的游客羡慕的眼神😄

路线：东门 → 东南城角 → 南门 → 西南城角 → 西门 → 西北城角 → 北门 → 东北城角 → 东门

**🏞 灞河湿地公园（休闲级）**
📏 全程：约30公里
⏱ 用时：3-4小时
难度：⭐⭐

沿着灞河骑行，有专门的骑行道，人少景美，春秋季最舒服。

**🏔 秦岭分水岭（挑战级）**
📏 全程：约120公里往返
⏱ 用时：8-10小时
难度：⭐⭐⭐⭐

从西安到秦岭分水岭，这是西安骑行者的朝圣之路。210国道的盘山路非常刺激，但要注意安全。

**🍂 白鹿原骑行（风景级）**
📏 全程：约50公里
⏱ 用时：4-5小时
难度：⭐⭐⭐

骑行上白鹿原，可以俯瞰整个西安城。秋天的白鹿原，白鹿仓附近超级美。

**租车推荐**：
- 美利达南门店：车型全
- 捷安特小寨店：价格实惠
- 共享单车：哈啰、美团都可以

⚠️ 安全提示：
1. 必带头盔
2. 带足水和补给
3. 天黑前下山
4. 秦岭路线最好结伴`,
      likes: 187,
      replies: 38,
      time: '2024-01-04 13:20',
      tags: ['骑行', '环城公园', '秦岭'],
      route: '骑行休闲线',
      estimatedTime: '2-10小时',
      bestSeason: '春秋',
      createdAt: Date.now() - 86400000 * 12
    }
  ]
};

// 默认评论数据
const defaultComments = {
  'food-1': [
    {
      id: 'c1',
      postId: 'food-1',
      author: '游客小王',
      authorId: 'user_001',
      content: '亲测老孙家泡馍确实正宗！就是掰膜掰到手酸😂',
      time: '2024-01-16 10:00',
      likes: 12,
      createdAt: Date.now() - 86400000 * 28
    },
    {
      id: 'c2',
      postId: 'food-1',
      author: '本地人老李',
      authorId: 'user_002',
      content: '补充一下：一真楼下午4点就关门了，想去的注意时间',
      time: '2024-01-16 15:30',
      likes: 8,
      createdAt: Date.now() - 86400000 * 27
    }
  ],
  'food-2': [
    {
      id: 'c3',
      postId: 'food-2',
      author: '第一次来西安',
      authorId: 'user_003',
      content: '太有用了！我周五到，就按这个安排～',
      time: '2024-01-11 09:00',
      likes: 5,
      createdAt: Date.now() - 86400000 * 24
    }
  ],
  'play-1': [
    {
      id: 'c4',
      postId: 'play-1',
      author: '计划2月去',
      authorId: 'user_004',
      content: '长恨歌演出在哪里买票？需要提前多久订？',
      time: '2024-01-13 11:00',
      likes: 3,
      createdAt: Date.now() - 86400000 * 26
    }
  ]
};

// 获取所有数据
export function getAllData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading BBS data:', e);
  }
  return { posts: defaultPosts, comments: defaultComments || {} };
}

// 保存所有数据
function saveAllData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving BBS data:', e);
  }
}

// 初始化数据
export function initBBSData() {
  const currentData = getAllData();
  if (!currentData.posts) {
    saveAllData({ posts: defaultPosts, comments: defaultComments || {} });
  }
  return getAllData();
}

// 获取指定板块的帖子
export function getPosts(category) {
  const data = getAllData();
  return data.posts[category] || [];
}

// 获取指定帖子
export function getPost(postId) {
  const data = getAllData();
  for (const category in data.posts) {
    const post = data.posts[category].find(p => p.id === postId);
    if (post) return post;
  }
  return null;
}

// 获取帖子的评论
export function getComments(postId) {
  const data = getAllData();
  return data.comments[postId] || [];
}

// 添加帖子
export function addPost(category, post, username) {
  const data = getAllData();
  const newPost = {
    ...post,
    id: `${category}-${Date.now()}`,
    author: username || '匿名用户',
    authorId: username || 'anonymous',
    likes: 0,
    replies: 0,
    time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    createdAt: Date.now()
  };
  
  if (!data.posts[category]) {
    data.posts[category] = [];
  }
  data.posts[category].unshift(newPost);
  saveAllData(data);
  return newPost;
}

// 更新帖子
export function updatePost(postId, updates) {
  const data = getAllData();
  for (const category in data.posts) {
    const index = data.posts[category].findIndex(p => p.id === postId);
    if (index !== -1) {
      data.posts[category][index] = {
        ...data.posts[category][index],
        ...updates,
        time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      };
      saveAllData(data);
      return data.posts[category][index];
    }
  }
  return null;
}

// 删除帖子
export function deletePost(postId) {
  const data = getAllData();
  for (const category in data.posts) {
    const index = data.posts[category].findIndex(p => p.id === postId);
    if (index !== -1) {
      data.posts[category].splice(index, 1);
      // 同时删除相关评论
      delete data.comments[postId];
      saveAllData(data);
      return true;
    }
  }
  return false;
}

// 添加评论
export function addComment(postId, content, username) {
  const data = getAllData();
  const newComment = {
    id: `c-${Date.now()}`,
    postId,
    author: username || '匿名用户',
    authorId: username || 'anonymous',
    content,
    time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    likes: 0,
    createdAt: Date.now()
  };
  
  if (!data.comments[postId]) {
    data.comments[postId] = [];
  }
  data.comments[postId].push(newComment);
  
  // 更新帖子的回复数
  for (const category in data.posts) {
    const post = data.posts[category].find(p => p.id === postId);
    if (post) {
      post.replies = data.comments[postId].length;
      break;
    }
  }
  
  saveAllData(data);
  return newComment;
}

// 更新评论
export function updateComment(commentId, content) {
  const data = getAllData();
  for (const postId in data.comments) {
    const index = data.comments[postId].findIndex(c => c.id === commentId);
    if (index !== -1) {
      data.comments[postId][index] = {
        ...data.comments[postId][index],
        content,
        time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      };
      saveAllData(data);
      return data.comments[postId][index];
    }
  }
  return null;
}

// 删除评论
export function deleteComment(commentId) {
  const data = getAllData();
  for (const postId in data.comments) {
    const index = data.comments[postId].findIndex(c => c.id === commentId);
    if (index !== -1) {
      data.comments[postId].splice(index, 1);
      
      // 更新帖子的回复数
      for (const category in data.posts) {
        const post = data.posts[category].find(p => p.id === postId);
        if (post) {
          post.replies = data.comments[postId].length;
          break;
        }
      }
      
      saveAllData(data);
      return true;
    }
  }
  return false;
}

// 点赞帖子
export function likePost(postId) {
  const data = getAllData();
  for (const category in data.posts) {
    const post = data.posts[category].find(p => p.id === postId);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      saveAllData(data);
      return post.likes;
    }
  }
  return 0;
}

// 点赞评论
export function likeComment(commentId) {
  const data = getAllData();
  for (const postId in data.comments) {
    const comment = data.comments[postId].find(c => c.id === commentId);
    if (comment) {
      comment.likes = (comment.likes || 0) + 1;
      saveAllData(data);
      return comment.likes;
    }
  }
  return 0;
}

// 搜索帖子
export function searchPosts(keyword, category = null) {
  const data = getAllData();
  const results = [];
  const categories = category ? [category] : Object.keys(data.posts);
  
  for (const cat of categories) {
    if (data.posts[cat]) {
      const matches = data.posts[cat].filter(post => 
        post.title.toLowerCase().includes(keyword.toLowerCase()) ||
        post.content.toLowerCase().includes(keyword.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.includes(keyword)))
      );
      results.push(...matches);
    }
  }
  
  return results;
}

// 获取用户发布的帖子
export function getUserPosts(username) {
  const data = getAllData();
  const results = [];
  for (const category in data.posts) {
    const posts = data.posts[category].filter(p => p.authorId === username);
    results.push(...posts.map(p => ({ ...p, category })));
  }
  return results;
}

// 获取用户发表的评论
export function getUserComments(username) {
  const data = getAllData();
  const results = [];
  for (const postId in data.comments) {
    const comments = data.comments[postId].filter(c => c.authorId === username);
    const post = getPost(postId);
    results.push(...comments.map(c => ({ 
      ...c, 
      postTitle: post ? post.title : '未知帖子',
      category: post ? Object.keys(data.posts).find(cat => data.posts[cat].some(p => p.id === postId)) : null
    })));
  }
  return results;
}
