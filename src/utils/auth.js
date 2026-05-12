// 用户系统 - 基于 localStorage 的简单认证

const USERS_KEY = 'mbti_users';
const CURRENT_USER_KEY = 'mbti_current_user';
const RESULTS_KEY_PREFIX = 'mbti_results_';

// 密码验证：至少8位，包含大小写字母和数字
function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: '密码至少8位字符' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密码必须包含小写字母' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密码必须包含大写字母' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '密码必须包含数字' };
  }
  return { valid: true };
}

// 获取所有用户
export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

// 保存用户列表
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// 注册
export function register(username, password) {
  if (!username || !password) {
    return { success: false, message: '用户名和密码不能为空' };
  }
  if (username.length < 2) {
    return { success: false, message: '用户名至少2个字符' };
  }
  // 密码强度验证
  const pwdCheck = validatePassword(password);
  if (!pwdCheck.valid) {
    return { success: false, message: pwdCheck.message };
  }
  const users = getUsers();
  if (users[username]) {
    return { success: false, message: '该用户名已被注册' };
  }
  users[username] = {
    password: btoa(password), // 简单编码（非安全加密，仅演示）
    createdAt: new Date().toISOString(),
  };
  saveUsers(users);
  // 自动登录
  localStorage.setItem(CURRENT_USER_KEY, username);
  return { success: true, message: '注册成功！', username };
}

// 登录
export function login(username, password) {
  if (!username || !password) {
    return { success: false, message: '请输入用户名和密码' };
  }
  const users = getUsers();
  const user = users[username];
  if (!user) {
    return { success: false, message: '用户不存在' };
  }
  if (atob(user.password) !== password) {
    return { success: false, message: '密码错误' };
  }
  localStorage.setItem(CURRENT_USER_KEY, username);
  return { success: true, message: '登录成功！', username };
}

// 登出
export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// 获取当前用户
export function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

// 保存测试结果
export function saveTestResult(username, result) {
  const key = RESULTS_KEY_PREFIX + username;
  try {
    const results = JSON.parse(localStorage.getItem(key) || '[]');
    results.unshift({
      ...result,
      id: Date.now(),
      savedAt: new Date().toISOString(),
    });
    // 最多保存20条
    if (results.length > 20) results.pop();
    localStorage.setItem(key, JSON.stringify(results));
    return { success: true };
  } catch {
    return { success: false, message: '保存失败' };
  }
}

// 保存八字分析结果
export function saveBaziResult(username, baziData) {
  const key = RESULTS_KEY_PREFIX + username + '_bazi';
  try {
    const results = JSON.parse(localStorage.getItem(key) || '[]');
    results.unshift({
      ...baziData,
      id: Date.now(),
      savedAt: new Date().toISOString(),
    });
    if (results.length > 20) results.pop();
    localStorage.setItem(key, JSON.stringify(results));
    return { success: true };
  } catch {
    return { success: false, message: '保存失败' };
  }
}

// 获取用户的八字分析历史
export function getBaziHistory(username) {
  const key = RESULTS_KEY_PREFIX + username + '_bazi';
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

// 获取用户的测试历史
export function getTestHistory(username) {
  const key = RESULTS_KEY_PREFIX + username;
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

// 删除某条测试记录
export function deleteTestResult(username, resultId) {
  const key = RESULTS_KEY_PREFIX + username;
  try {
    const results = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = results.filter(r => r.id !== resultId);
    localStorage.setItem(key, JSON.stringify(filtered));
    return { success: true };
  } catch {
    return { success: false };
  }
}

// 导出密码验证函数供组件使用
export { validatePassword };

// ==================== 管理员功能 ====================

// 判断当前用户是否为管理员
export function isAdmin(username) {
  return username === 'admin';
}

// 获取所有用户的测试统计（仅管理员可用）
export function getAllUsersStats() {
  const users = getUsers();
  const stats = [];

  Object.keys(users).forEach(username => {
    const history = getTestHistory(username);
    // 统计各类型出现次数
    const typeCounts = {};
    history.forEach(r => {
      if (r.type) {
        typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
      }
    });

    // 找出最常见的类型
    let topType = null;
    let topCount = 0;
    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > topCount) {
        topType = type;
        topCount = count;
      }
    });

    stats.push({
      username,
      createdAt: users[username].createdAt,
      totalTests: history.length,
      lastTestAt: history.length > 0 ? history[0].savedAt : null,
      typeCounts,
      topType,
      topCount,
    });
  });

  // 按测试次数降序排列
  stats.sort((a, b) => b.totalTests - a.totalTests);
  return stats;
}

// 获取所有用户的全部测试记录（仅管理员可用）
export function getAllTestRecords() {
  const users = getUsers();
  const records = [];

  Object.keys(users).forEach(username => {
    const history = getTestHistory(username);
    history.forEach(record => {
      records.push({
        ...record,
        username,
      });
    });
  });

  // 按时间降序排列
  records.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  return records;
}

// 获取全局统计概览（仅管理员可用）
export function getGlobalStats() {
  const users = getUsers();
  const allRecords = getAllTestRecords();

  // 各类型统计
  const typeDistribution = {};
  allRecords.forEach(r => {
    if (r.type) {
      typeDistribution[r.type] = (typeDistribution[r.type] || 0) + 1;
    }
  });

  return {
    totalUsers: Object.keys(users).length,
    totalTests: allRecords.length,
    typeDistribution,
    avgTestsPerUser: Object.keys(users).length > 0
      ? (allRecords.length / Object.keys(users).length).toFixed(1)
      : 0,
  };
}
