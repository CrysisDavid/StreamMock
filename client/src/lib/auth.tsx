import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from './api';
import { useLocation } from 'wouter';
import { useUserStore } from './userStore';

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
  const userFromStore = useUserStore((state) => state.user);
  const setUserInStore = useUserStore((state) => state.setUser);
  const clearUserInStore = useUserStore((state) => state.clearUser);
  
  const [isLoading] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    console.log('=== AuthProvider montado ===');
    console.log('Usuario en store:', userFromStore);
    
    const token = localStorage.getItem('access_token');
    console.log('Token presente:', !!token);
    
    // Si hay usuario en el store, la sesión es válida
    if (userFromStore) {
      console.log('✅ Usuario encontrado en store, sesión activa');
    } else {
      console.log('⚠️ No hay usuario en store');
      // Si no hay usuario pero hay token, limpiar el token
      if (token) {
        console.log('Limpiando token huérfano');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }, [userFromStore]);

  const clearAuth = () => {
    console.log('Limpiando autenticación');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    clearUserInStore();
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({
        correo: email,
        contraseña: password,
      });

      console.log('Login exitoso, guardando usuario:', response.user);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      setUserInStore(response.user);
      
      // Verificar que se guardó correctamente
      setTimeout(() => {
        const stored = localStorage.getItem('user-storage');
        console.log('Usuario guardado en localStorage:', stored);
      }, 100);
      
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
        user: userFromStore,
        isLoading,
        isAuthenticated: !!userFromStore,
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
