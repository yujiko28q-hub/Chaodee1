import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount } from '../types/rental';
import { authService, RegisterPayload } from '../services/authService';
import { StorageKeys, getStorageItem, setStorageItem, removeStorageItem } from '../services/apiClient';

interface AuthContextType {
  currentUser: UserAccount | null;
  systemMode: 'storefront' | 'admin';
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: UserAccount }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string; user?: UserAccount }>;
  logout: () => Promise<void>;
  setSystemMode: (mode: 'storefront' | 'admin') => void;
  updateCurrentUser: (updater: (prev: UserAccount) => UserAccount) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return getStorageItem<UserAccount | null>(StorageKeys.CURRENT_USER, null);
  });

  const [systemMode, setSystemModeState] = useState<'storefront' | 'admin'>(() => {
    const savedUser = getStorageItem<UserAccount | null>(StorageKeys.CURRENT_USER, null);
    const savedMode = getStorageItem<'storefront' | 'admin'>(StorageKeys.SYSTEM_MODE, 'storefront');
    if (savedUser?.role === 'admin' && savedMode === 'admin') {
      return 'admin';
    }
    return 'storefront';
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStorageItem(StorageKeys.SYSTEM_MODE, systemMode);
  }, [systemMode]);

  useEffect(() => {
    if (currentUser) {
      setStorageItem(StorageKeys.CURRENT_USER, currentUser);
    } else {
      removeStorageItem(StorageKeys.CURRENT_USER);
    }
  }, [currentUser]);

  const setSystemMode = (mode: 'storefront' | 'admin') => {
    if (mode === 'admin' && currentUser?.role !== 'admin') {
      return;
    }
    setSystemModeState(mode);
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, pass);
      if (res.success && res.data) {
        setCurrentUser(res.data);
        if (res.data.role === 'admin') {
          setSystemModeState('admin');
        } else {
          setSystemModeState('storefront');
        }
        return { success: true, user: res.data };
      }
      return { success: false, error: res.error };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      if (res.success && res.data) {
        setCurrentUser(res.data);
        setSystemModeState('storefront');
        return { success: true, user: res.data };
      }
      return { success: false, error: res.error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setSystemModeState('storefront');
  };

  const updateCurrentUser = (updater: (prev: UserAccount) => UserAccount) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const next = updater(prev);
      setStorageItem(StorageKeys.CURRENT_USER, next);
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        systemMode,
        isLoading,
        login,
        register,
        logout,
        setSystemMode,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    const savedUser = getStorageItem<UserAccount | null>(StorageKeys.CURRENT_USER, null);
    const savedMode = getStorageItem<'storefront' | 'admin'>(StorageKeys.SYSTEM_MODE, 'storefront');
    return {
      currentUser: savedUser,
      systemMode: savedMode,
      isLoading: false,
      login: async (email, pass) => authService.login(email, pass),
      register: async (payload) => authService.register(payload),
      logout: async () => authService.logout(),
      setSystemMode: () => {},
      updateCurrentUser: () => {},
    };
  }
  return ctx;
};
