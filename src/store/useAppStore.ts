import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  favorites: string[];
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFontSize: (size: number) => void;
  toggleFavorite: (hymnId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark', // Default to dark for that premium feel
      fontSize: 18,
      favorites: [],
      setTheme: (theme) => set({ theme }),
      setFontSize: (size) => set({ fontSize: size }),
      toggleFavorite: (hymnId) =>
        set((state) => ({
          favorites: state.favorites.includes(hymnId)
            ? state.favorites.filter((id) => id !== hymnId)
            : [...state.favorites, hymnId],
        })),
    }),
    {
      name: 'himnario-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
