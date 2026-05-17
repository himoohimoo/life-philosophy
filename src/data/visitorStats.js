// 访问统计系统 - 记录用户访问信息

const VISITOR_STATS_KEY = 'life_philosophy_visitor_stats';

/**
 * 获取当前时间戳
 * @returns {string} 格式化的时间字符串
 */
function getCurrentTimestamp() {
  return new Date().toISOString();
}

/**
 * 从 localStorage 获取所有访问数据
 * @returns {Object} 访问数据对象，键为IP，值为访问详情
 */
function getStatsFromStorage() {
  try {
    const data = localStorage.getItem(VISITOR_STATS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('获取访问统计数据失败:', error);
    return {};
  }
}

/**
 * 保存访问数据到 localStorage
 * @param {Object} stats 访问数据对象
 */
function saveStatsToStorage(stats) {
  try {
    localStorage.setItem(VISITOR_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('保存访问统计数据失败:', error);
  }
}

/**
 * 记录访问
 * @param {string} ip - 用户IP
 * @param {string} page - 页面路径
 * @returns {Object} 该IP的访问详情
 */
export function recordVisit(ip, page) {
  if (!ip) {
    console.warn('记录访问时IP不能为空');
    return null;
  }

  const stats = getStatsFromStorage();
  const timestamp = getCurrentTimestamp();
  const pagePath = page || window.location.pathname;

  if (!stats[ip]) {
    // 新访客
    stats[ip] = {
      ip: ip,
      visits: [],
      firstVisit: timestamp,
      lastVisit: timestamp,
      visitCount: 0
    };
  }

  // 添加访问记录
  stats[ip].visits.push({
    page: pagePath,
    timestamp: timestamp
  });

  // 更新统计信息
  stats[ip].lastVisit = timestamp;
  stats[ip].visitCount = stats[ip].visits.length;

  saveStatsToStorage(stats);
  return stats[ip];
}

/**
 * 获取所有访问统计
 * @returns {Array} 所有访问记录数组
 */
export function getAllVisits() {
  const stats = getStatsFromStorage();
  return Object.values(stats);
}

/**
 * 获取独立IP数量
 * @returns {number} 独立访客数量
 */
export function getUniqueVisitorCount() {
  const stats = getStatsFromStorage();
  return Object.keys(stats).length;
}

/**
 * 获取总访问次数
 * @returns {number} 总访问次数
 */
export function getTotalVisitCount() {
  const stats = getStatsFromStorage();
  return Object.values(stats).reduce((total, visitor) => {
    return total + (visitor.visitCount || 0);
  }, 0);
}

/**
 * 获取某IP的访问详情
 * @param {string} ip - 用户IP
 * @returns {Object|null} 该IP的访问详情，未找到返回null
 */
export function getVisitorDetails(ip) {
  const stats = getStatsFromStorage();
  return stats[ip] || null;
}

/**
 * 获取访问统计概览（用于管理员仪表盘）
 * @returns {Object} 统计概览对象
 */
export function getStatsSummary() {
  const stats = getStatsFromStorage();
  const visitors = Object.values(stats);
  
  const now = new Date();
  const today = now.toDateString();
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let todayVisits = 0;
  let weekVisits = 0;
  let monthVisits = 0;

  visitors.forEach(visitor => {
    visitor.visits.forEach(visit => {
      const visitDate = new Date(visit.timestamp);
      if (visitDate.toDateString() === today) {
        todayVisits++;
      }
      if (visitDate >= thisWeek) {
        weekVisits++;
      }
      if (visitDate >= thisMonth) {
        monthVisits++;
      }
    });
  });

  // 获取最近访问的访客（按最后访问时间排序）
  const recentVisitors = visitors
    .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
    .slice(0, 10);

  // 获取热门页面
  const pageStats = {};
  visitors.forEach(visitor => {
    visitor.visits.forEach(visit => {
      const page = visit.page;
      if (!pageStats[page]) {
        pageStats[page] = 0;
      }
      pageStats[page]++;
    });
  });

  const topPages = Object.entries(pageStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }));

  return {
    uniqueVisitors: visitors.length,
    totalVisits: visitors.reduce((sum, v) => sum + v.visitCount, 0),
    todayVisits,
    weekVisits,
    monthVisits,
    recentVisitors,
    topPages
  };
}

/**
 * 获取最近访客列表
 * @param {number} limit - 返回数量限制
 * @returns {Array} 最近访客列表
 */
export function getRecentVisitors(limit = 10) {
  const stats = getStatsFromStorage();
  return Object.values(stats)
    .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
    .slice(0, limit);
}

/**
 * 删除访客记录
 * @param {string} ip - 访客IP
 * @returns {boolean} 是否删除成功
 */
export function deleteVisitor(ip) {
  const stats = getStatsFromStorage();
  if (stats[ip]) {
    delete stats[ip];
    saveStatsToStorage(stats);
    return true;
  }
  return false;
}

/**
 * 清空所有访问记录（谨慎使用）
 * @returns {boolean} 是否清空成功
 */
export function clearAllStats() {
  try {
    localStorage.removeItem(VISITOR_STATS_KEY);
    return true;
  } catch (error) {
    console.error('清空访问统计数据失败:', error);
    return false;
  }
}

/**
 * 获取某页面的访问次数
 * @param {string} page - 页面路径
 * @returns {number} 访问次数
 */
export function getPageVisitCount(page) {
  const stats = getStatsFromStorage();
  let count = 0;
  
  Object.values(stats).forEach(visitor => {
    count += visitor.visits.filter(v => v.page === page).length;
  });
  
  return count;
}

/**
 * 获取指定时间范围内的访问统计
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @returns {Object} 统计结果
 */
export function getVisitsByDateRange(startDate, endDate) {
  const stats = getStatsFromStorage();
  const visitors = Object.values(stats);
  
  let totalVisits = 0;
  const uniqueIps = new Set();
  
  visitors.forEach(visitor => {
    let hasVisitInRange = false;
    
    visitor.visits.forEach(visit => {
      const visitDate = new Date(visit.timestamp);
      if (visitDate >= startDate && visitDate <= endDate) {
        totalVisits++;
        hasVisitInRange = true;
      }
    });
    
    if (hasVisitInRange) {
      uniqueIps.add(visitor.ip);
    }
  });
  
  return {
    totalVisits,
    uniqueVisitors: uniqueIps.size,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
}
