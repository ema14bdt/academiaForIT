import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, LoginDto, RegisterClientDto, AuthResponse, ApiError } from '../types/domain';
import { apiClient } from '../services/api/ApiClient';
import { texts } from '../constants/es';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterClientDto) => Promise<void>;
  logout: () => void;
  clearError: () => void;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        apiClient.setToken(token);
      } catch (err) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AuthResponse = await apiClient.login(credentials);
      
      setUser(response.user);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || texts.apiErrors.loginFailed);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterClientDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AuthResponse = await apiClient.register(userData);
      
      setUser(response.user);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || texts.apiErrors.registrationFailed);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    apiClient.clearToken();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
