import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, login as authLogin, logout as authLogout, register as authRegister } from '../utils/auth';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时检查登录状态
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback((username, password) => {
    const result = authLogin(username, password);
    if (result.success) {
      setUser(result.username);
    }
    return result;
  }, []);

  const register = useCallback((username, password) => {
    const result = authRegister(username, password);
    if (result.success) {
      setUser(result.username);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
