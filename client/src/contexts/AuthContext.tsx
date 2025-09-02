import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  userType: 'user' | 'support' | null;
  token: string | null;
  login: (email: string, password: string, isSupport?: boolean) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'user' | 'support' | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUserType && storedUser) {
      setToken(storedToken);
      setUserType(storedUserType as 'user' | 'support');
      setUser(JSON.parse(storedUser));
      
      // Token zu axios defaults hinzufügen
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, isSupport: boolean = false) => {
    try {
      const endpoint = isSupport ? '/api/support/login' : '/api/login';
      const response = await axios.post(`http://localhost:3001${endpoint}`, {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;
      const type = isSupport ? 'support' : 'user';

      setToken(newToken);
      setUser(userData);
      setUserType(type);

      // In localStorage speichern
      localStorage.setItem('token', newToken);
      localStorage.setItem('userType', type);
      localStorage.setItem('user', JSON.stringify(userData));

      // Token zu axios defaults hinzufügen
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Anmeldung fehlgeschlagen');
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await axios.post('http://localhost:3001/api/register', {
        email,
        password,
        firstName,
        lastName
      });

      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      setUserType('user');

      // In localStorage speichern
      localStorage.setItem('token', newToken);
      localStorage.setItem('userType', 'user');
      localStorage.setItem('user', JSON.stringify(userData));

      // Token zu axios defaults hinzufügen
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registrierung fehlgeschlagen');
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setToken(null);

    // Aus localStorage entfernen
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');

    // Token aus axios defaults entfernen
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    userType,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};