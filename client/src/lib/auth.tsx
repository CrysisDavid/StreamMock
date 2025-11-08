import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from './api';
import { useLocation } from 'wouter';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const isValid = await authAPI.validateToken();
        if (isValid) {
          setUser(JSON.parse(storedUser));
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      }
    }
    setIsLoading(false);
  };

  const clearAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({
        correo: email,
        contraseña: password,
      });

      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setLocation('/');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Error al iniciar sesión';
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await authAPI.register({
        nombre: name,
        correo: email,
        contraseña: password,
        confirmarContraseña: password,
      });
      
      await login(email, password);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Error al registrarse';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      clearAuth();
      setLocation('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
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
