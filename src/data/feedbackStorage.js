// 反馈数据存储系统 - 使用 localStorage 存储用户反馈

const FEEDBACK_STORAGE_KEY = 'life_philosophy_feedback';

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 获取当前时间戳
 * @returns {string} 格式化的时间字符串
 */
function getCurrentTimestamp() {
  return new Date().toISOString();
}

/**
 * 从 localStorage 获取所有反馈
 * @returns {Array} 反馈列表
 */
function getFeedbackFromStorage() {
  try {
    const data = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取反馈数据失败:', error);
    return [];
  }
}

/**
 * 保存反馈到 localStorage
 * @param {Array} feedbackList 反馈列表
 */
function saveFeedbackToStorage(feedbackList) {
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackList));
  } catch (error) {
    console.error('保存反馈数据失败:', error);
  }
}

/**
 * 提交反馈
 * @param {string} username - 用户名或匿名
 * @param {string} content - 反馈内容
 * @param {string} ip - 用户IP
 * @returns {Object} 提交的反馈对象
 */
export function submitFeedback(username, content, ip) {
  if (!content || content.trim() === '') {
    throw new Error('反馈内容不能为空');
  }

  const feedback = {
    id: generateId(),
    username: username || '匿名用户',
    content: content.trim(),
    ip: ip || '未知IP',
    timestamp: getCurrentTimestamp(),
    isRead: false
  };

  const feedbackList = getFeedbackFromStorage();
  feedbackList.unshift(feedback); // 新反馈添加到开头
  saveFeedbackToStorage(feedbackList);

  return feedback;
}

/**
 * 获取所有反馈（管理员用）
 * @returns {Array} 所有反馈列表，按时间倒序排列
 */
export function getAllFeedback() {
  return getFeedbackFromStorage();
}

/**
 * 获取反馈数量
 * @param {boolean} unreadOnly - 是否只计算未读反馈
 * @returns {number} 反馈数量
 */
export function getFeedbackCount(unreadOnly = false) {
  const feedbackList = getFeedbackFromStorage();
  if (unreadOnly) {
    return feedbackList.filter(item => !item.isRead).length;
  }
  return feedbackList.length;
}

/**
 * 删除反馈（管理员用）
 * @param {string} id - 反馈ID
 * @returns {boolean} 是否删除成功
 */
export function deleteFeedback(id) {
  const feedbackList = getFeedbackFromStorage();
  const index = feedbackList.findIndex(item => item.id === id);
  
  if (index === -1) {
    return false;
  }

  feedbackList.splice(index, 1);
  saveFeedbackToStorage(feedbackList);
  return true;
}

/**
 * 标记反馈为已读
 * @param {string} id - 反馈ID
 * @returns {Object|null} 更新后的反馈对象，未找到则返回null
 */
export function markFeedbackAsRead(id) {
  const feedbackList = getFeedbackFromStorage();
  const feedback = feedbackList.find(item => item.id === id);
  
  if (!feedback) {
    return null;
  }

  feedback.isRead = true;
  saveFeedbackToStorage(feedbackList);
  return feedback;
}

/**
 * 标记反馈为未读
 * @param {string} id - 反馈ID
 * @returns {Object|null} 更新后的反馈对象，未找到则返回null
 */
export function markFeedbackAsUnread(id) {
  const feedbackList = getFeedbackFromStorage();
  const feedback = feedbackList.find(item => item.id === id);
  
  if (!feedback) {
    return null;
  }

  feedback.isRead = false;
  saveFeedbackToStorage(feedbackList);
  return feedback;
}

/**
 * 切换反馈已读状态
 * @param {string} id - 反馈ID
 * @returns {Object|null} 更新后的反馈对象
 */
export function toggleFeedbackReadStatus(id) {
  const feedbackList = getFeedbackFromStorage();
  const feedback = feedbackList.find(item => item.id === id);
  
  if (!feedback) {
    return null;
  }

  feedback.isRead = !feedback.isRead;
  saveFeedbackToStorage(feedbackList);
  return feedback;
}

/**
 * 清空所有反馈（谨慎使用）
 * @returns {boolean} 是否清空成功
 */
export function clearAllFeedback() {
  try {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('清空反馈数据失败:', error);
    return false;
  }
}

/**
 * 搜索反馈
 * @param {string} keyword - 搜索关键词
 * @returns {Array} 匹配的反馈列表
 */
export function searchFeedback(keyword) {
  if (!keyword || keyword.trim() === '') {
    return getAllFeedback();
  }

  const feedbackList = getFeedbackFromStorage();
  const lowerKeyword = keyword.toLowerCase();
  
  return feedbackList.filter(item => 
    item.username.toLowerCase().includes(lowerKeyword) ||
    item.content.toLowerCase().includes(lowerKeyword) ||
    item.ip.includes(lowerKeyword)
  );
}

/**
 * 按IP获取反馈
 * @param {string} ip - 用户IP
 * @returns {Array} 该IP的反馈列表
 */
export function getFeedbackByIp(ip) {
  const feedbackList = getFeedbackFromStorage();
  return feedbackList.filter(item => item.ip === ip);
}
