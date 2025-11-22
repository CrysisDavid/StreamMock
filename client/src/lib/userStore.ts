import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './api';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => {
        console.log('📝 Setting user in store:', user);
        set({ user });
        // Forzar guardado inmediato
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            const saved = localStorage.getItem('user-storage');
            console.log('💾 Verificación guardado:', saved ? 'OK' : 'FALLÓ');
          }, 50);
        }
      },
      clearUser: () => {
        console.log('🗑️ Clearing user from store');
        set({ user: null });
      },
      isAuthenticated: () => get().user !== null,
    }),
    {
      name: 'user-storage',
      version: 1,
      onRehydrateStorage: () => (state) => {
        console.log('🔄 Rehydrating user store...');
        if (state?.user) {
          console.log('✅ Usuario recuperado exitosamente:', state.user.nombre);
        } else {
          console.log('⚠️ No hay usuario guardado en localStorage');
        }
      },
    }
  )
);
