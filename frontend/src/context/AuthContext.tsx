import { createContext, useContext, useState, type ReactNode } from 'react';

type User = {
  id: number;
  role_id: number;
  name: string;
  last_name: string;
  age?: number | string;
  email: string;
  organization_name?: string;
  state?: string;
  municipality?: string;
  phone?: string;
  locality?: string;
  plant?: string;
  division?: string;
  plant_id?: number | string;
  division_id?: number | string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (userData: User, token: string) => void;
  updateProfile: (userData: Partial<User>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const login = (userData: User, newToken: string) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', newToken);
  };

  const updateProfile = (userData: Partial<User>) => {
    setUser(prev => {
      const updated = prev ? { ...prev, ...userData } : null;
      if (updated) localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAdmin = Number(user?.role_id) === 1;

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
