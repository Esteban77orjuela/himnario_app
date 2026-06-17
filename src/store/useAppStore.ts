import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrapedSong } from '../services/scraperService';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  favorites: string[];
  customSongs: ScrapedSong[];
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFontSize: (size: number) => void;
  addCustomSong: (song: ScrapedSong) => void;
  removeCustomSong: (title: string) => void;
  updateCustomSongCategory: (title: string, category: string) => void;
  categoryOverrides: Record<string, string>;
  setCategoryOverride: (id: string, category: string) => void;
  songBPMs: Record<string, number>;
  setSongBPM: (id: string, bpm: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark', // Default to dark for that premium feel
      fontSize: 18,
      favorites: [],
      customSongs: [],
      categoryOverrides: {},
      songBPMs: {},
      setTheme: (theme) => set({ theme }),
      setFontSize: (size) => set({ fontSize: size }),
      setCategoryOverride: (id, category) => 
        set((state) => ({
          categoryOverrides: { ...state.categoryOverrides, [id]: category }
        })),
      setSongBPM: (id, bpm) =>
        set((state) => ({
          songBPMs: { ...state.songBPMs, [id]: bpm }
        })),
      toggleFavorite: (hymnId) =>
        set((state) => ({
          favorites: state.favorites.includes(hymnId)
            ? state.favorites.filter((id) => id !== hymnId)
            : [...state.favorites, hymnId],
        })),
      addCustomSong: (song) =>
        set((state) => {
          // Prevenir duplicados por título o URL
          const exists = state.customSongs.find(s => s.title === song.title || s.source === song.source);
          if (exists) return state;
          return { customSongs: [...state.customSongs, song] };
        }),
      removeCustomSong: (title) =>
        set((state) => ({
          customSongs: state.customSongs.filter((song) => song.title !== title),
        })),
      updateCustomSongCategory: (title, category) =>
        set((state) => ({
          customSongs: state.customSongs.map(song => 
            song.title === title ? { ...song, category } : song
          ),
        })),
    }),
    {
      name: 'himnario-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
