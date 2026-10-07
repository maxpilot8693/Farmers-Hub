import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoading: boolean;
  switchRole: (role: UserRole) => void;
  loginDemo: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    setUserState(currentUser);
    setIsLoading(false);
  }, []);

  const setUser = (u: UserProfile | null) => {
    setUserState(u);
    api.setCurrentUser(u);
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
  };

  const loginDemo = async (email: string) => {
    const allUsers = await api.getAllUsers();
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
    } else {
      // default to first farmer
      setUser(allUsers[0]);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        switchRole,
        loginDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
