import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrapedSong } from '../services/scraperService';

export interface Setlist {
  id: string;
  name: string;
  hymnIds: string[];
}

interface AppState {
  theme: 'light' | 'dark' | 'system';
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: number;
  favorites: string[];
  customSongs: ScrapedSong[];
  categoryOverrides: Record<string, string>;
  songBPMs: Record<string, number>;
  songNotes: Record<string, string>;
  songPlayCount: Record<string, number>;
  setlists: Setlist[];
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  setFontFamily: (font: 'sans' | 'serif' | 'mono') => void;
  setFontSize: (size: number) => void;
  addCustomSong: (song: ScrapedSong) => void;
  removeCustomSong: (title: string) => void;
  updateCustomSongCategory: (title: string, category: string) => void;
  setCategoryOverride: (id: string, category: string) => void;
  setSongBPM: (id: string, bpm: number) => void;
  setSongNote: (id: string, note: string) => void;
  incrementPlayCount: (id: string) => void;
  toggleFavorite: (hymnId: string) => void;
  
  createSetlist: (name: string) => void;
  deleteSetlist: (id: string) => void;
  addHymnToSetlist: (setlistId: string, hymnId: string) => void;
  removeHymnFromSetlist: (setlistId: string, hymnId: string) => void;
  restoreBackup: (data: any) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      fontFamily: 'sans',
      fontSize: 18,
      favorites: [],
      customSongs: [],
      categoryOverrides: {},
      songBPMs: {},
      songNotes: {},
      songPlayCount: {},
      setlists: [],
      
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setFontSize: (size) => set({ fontSize: size }),
      setCategoryOverride: (id, category) => 
        set((state) => ({
          categoryOverrides: { ...state.categoryOverrides, [id]: category }
        })),
      setSongBPM: (id, bpm) =>
        set((state) => ({
          songBPMs: { ...state.songBPMs, [id]: bpm }
        })),
      setSongNote: (id, note) =>
        set((state) => ({
          songNotes: { ...state.songNotes, [id]: note }
        })),
      incrementPlayCount: (id) =>
        set((state) => ({
          songPlayCount: { ...state.songPlayCount, [id]: (state.songPlayCount[id] || 0) + 1 }
        })),
      toggleFavorite: (hymnId) =>
        set((state) => ({
          favorites: state.favorites.includes(hymnId)
            ? state.favorites.filter((id) => id !== hymnId)
            : [...state.favorites, hymnId],
        })),
      addCustomSong: (song) =>
        set((state) => {
          const exists = state.customSongs.find((s) => s.title === song.title);
          if (exists) {
            return {
              customSongs: state.customSongs.map((s) =>
                s.title === song.title ? { ...s, ...song } : s
              ),
            };
          }
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
        
      createSetlist: (name) =>
        set((state) => ({
          setlists: [...state.setlists, { id: Date.now().toString(), name, hymnIds: [] }]
        })),
      deleteSetlist: (id) =>
        set((state) => ({
          setlists: state.setlists.filter(s => s.id !== id)
        })),
      addHymnToSetlist: (setlistId, hymnId) =>
        set((state) => ({
          setlists: state.setlists.map(s => 
            s.id === setlistId && !s.hymnIds.includes(hymnId)
              ? { ...s, hymnIds: [...s.hymnIds, hymnId] }
              : s
          )
        })),
      removeHymnFromSetlist: (setlistId, hymnId) =>
        set((state) => ({
          setlists: state.setlists.map(s => 
            s.id === setlistId
              ? { ...s, hymnIds: s.hymnIds.filter(id => id !== hymnId) }
              : s
          )
        })),
      restoreBackup: (data) =>
        set((state) => ({
          ...state,
          customSongs: data.customSongs || state.customSongs,
          favorites: data.favorites || state.favorites,
          setlists: data.setlists || state.setlists,
          categoryOverrides: data.categoryOverrides || state.categoryOverrides,
          songBPMs: data.songBPMs || state.songBPMs,
          songNotes: data.songNotes || state.songNotes,
          songPlayCount: data.songPlayCount || state.songPlayCount,
        })),
    }),
    {
      name: 'himnario-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
