import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useIsDarkMode } from '../utils/useIsDarkMode';
import { mockHymns, christianSongs, Hymn } from '../data/hymns';
import { Search, ChevronRight, Sun, Moon, X, Heart, Music2, BookOpen, Users, List } from 'lucide-react-native';
import { MotiView } from 'moti';
import { detectKey } from '../utils/keyDetector';
import { detectArtistFromTitle } from '../utils/artistDetector';
import { LinearGradient } from 'expo-linear-gradient';

type FilterKey = 'todas' | 'himnos' | 'adoracion' | 'alabanza' | 'favorites' | 'artistas';

type FilterDef = {
  key: FilterKey;
  label: string;
  icon: typeof Heart;
};

const ALL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'] as const;
type MusicalKey = typeof ALL_KEYS[number];

const FILTERS: FilterDef[] = [
  { key: 'todas', label: 'Todas', icon: List },
  { key: 'himnos', label: 'Himnos', icon: BookOpen },
  { key: 'adoracion', label: 'Adoración', icon: Heart },
  { key: 'alabanza', label: 'Alabanza', icon: Music2 },
  { key: 'favorites', label: 'Favoritos', icon: Heart },
  { key: 'artistas', label: 'Artistas', icon: Users },
];

import type { RootStackNavigationProp } from '../types/navigation';

export default function HomeScreen({ navigation }: { navigation: RootStackNavigationProp }) {
  const insets = useSafeAreaInsets();
  const isDarkMode = useIsDarkMode();
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const customSongs = useAppStore((state) => state.customSongs);
  const categoryOverrides = useAppStore((state) => state.categoryOverrides);
  const favorites = useAppStore((state) => state.favorites);
  const songKeys = useAppStore((state) => state.songKeys);
  const setSongKey = useAppStore((state) => state.setSongKey);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todas');
  const [activeKeyFilter, setActiveKeyFilter] = useState<MusicalKey | null>(null);
  const [activeArtistFilter, setActiveArtistFilter] = useState<string | null>(null);

  const allHymns = useMemo(() => {
    const mappedCustoms = customSongs.map((cs, idx) => {
      let artist = cs.artist || '';
      if (!artist && cs.title && cs.title.includes(' - ')) {
        const detected = detectArtistFromTitle(cs.title);
        if (detected) artist = detected;
      }
      return {
        id: cs.title || `custom-${idx}`,
        number: 900 + idx,
        title: cs.title || 'Desconocido',
        lyrics: cs.lyrics || '',
        category: categoryOverrides[cs.title || `custom-${idx}`] || cs.category || 'Importada',
        musicalKey: cs.musicalKey,
        artist,
        isCustom: true,
      };
    });
    const mappedMocks = mockHymns.map(h => ({
      ...h,
      category: categoryOverrides[h.id] || h.category,
    }));
    const mappedChristian = christianSongs.map(s => ({
      id: s.id,
      number: s.number,
      title: s.title,
      lyrics: s.lyrics,
      category: categoryOverrides[s.id] || s.category || 'Alabanza',
      artist: s.artist || '',
      musicalKey: s.musicalKey,
      isCustom: false,
    }));
    return [...mappedMocks, ...mappedChristian, ...mappedCustoms];
  }, [customSongs, categoryOverrides]);

  // Auto-detect keys for hymns missing one
  useEffect(() => {
    allHymns.forEach(h => {
      if (!songKeys[h.id]) {
        if ('musicalKey' in h && h.musicalKey) {
          setSongKey(h.id, h.musicalKey);
        } else if (h.lyrics) {
          setSongKey(h.id, detectKey(h.lyrics));
        }
      }
    });
  }, [allHymns, songKeys, setSongKey]);

  const hymnsWithKeys = useMemo(() => {
    return allHymns.map(h => ({
      ...h,
      musicalKey: songKeys[h.id] || ('musicalKey' in h ? h.musicalKey : undefined) || 'C',
    }));
  }, [allHymns, songKeys]);

  const counts = useMemo(() => ({
    todas: allHymns.length,
    himnos: allHymns.filter(h => h.category.toLowerCase().includes('himno')).length,
    adoracion: allHymns.filter(h => h.category.toLowerCase().includes('adoración') || h.category.toLowerCase().includes('adoracion')).length,
    alabanza: allHymns.filter(h => h.category.toLowerCase().includes('alabanza')).length,
    favorites: favorites.length,
    artistas: new Set(allHymns.map(h => h.artist).filter(Boolean)).size,
  }), [allHymns, favorites]);

  const keyFilterOptions = useMemo(() => {
    const keysInView = new Set<string>();
    hymnsWithKeys.forEach(h => {
      if (activeFilter === 'favorites' && !favorites.includes(h.id)) return;
      if (activeFilter === 'alabanza' && !h.category.toLowerCase().includes('alabanza')) return;
      if (activeFilter === 'adoracion' && !h.category.toLowerCase().includes('adoración') && !h.category.toLowerCase().includes('adoracion')) return;
      if (activeFilter === 'himnos' && !h.category.toLowerCase().includes('himno')) return;
      keysInView.add(h.musicalKey);
    });
    return ALL_KEYS.filter(k => keysInView.has(k));
  }, [hymnsWithKeys, activeFilter, favorites]);

  const artistFilterOptions = useMemo(() => {
    return Array.from(new Set(allHymns.map(h => h.artist).filter((a): a is string => Boolean(a)))).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }, [allHymns]);

  const filteredHymns = useMemo(() => {
    let result = hymnsWithKeys as (Hymn & { musicalKey: string })[];
    
    if (activeFilter === 'favorites') {
      result = result.filter(h => favorites.includes(h.id));
    } else if (activeFilter === 'alabanza') {
      result = result.filter(h => h.category.toLowerCase().includes('alabanza'));
    } else if (activeFilter === 'adoracion') {
      result = result.filter(h => h.category.toLowerCase().includes('adoración') || h.category.toLowerCase().includes('adoracion'));
    } else if (activeFilter === 'himnos') {
      result = result.filter(h => h.category.toLowerCase().includes('himno'));
    } else if (activeFilter === 'artistas') {
      if (activeArtistFilter) {
        result = result.filter(h => h.artist === activeArtistFilter);
      }
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
      if (!searchQuery) return result;
      const q = searchQuery.toLowerCase().trim();
      return result.filter(h =>
        h.title.toLowerCase().includes(q) ||
        (h.artist && h.artist.toLowerCase().includes(q))
      );
    }
    
    if (activeKeyFilter) {
      result = result.filter(h => h.musicalKey === activeKeyFilter);
    }
    
    if (!searchQuery) {
      return [...result].sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
    }
    
    const q = searchQuery.toLowerCase().trim();
    const scored: { hymn: typeof result[0]; score: number }[] = [];
    for (const h of result) {
      const title = h.title || '';
      const lyrics = h.lyrics || '';
      const numberStr = String(h.number != null ? h.number : '');
      const titleLower = title.toLowerCase();
      const lyricsLower = lyrics.toLowerCase();
      let score: number;
      if (titleLower === q) score = 0;
      else if (titleLower.startsWith(q)) score = 1;
      else if (titleLower.includes(q)) score = 2;
      else if (lyricsLower.includes(q)) score = 3;
      else if (numberStr.includes(q)) score = 4;
      else continue;
      scored.push({ hymn: h, score });
    }
    
    return scored
      .sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        return a.hymn.title.localeCompare(b.hymn.title, 'es', { sensitivity: 'base' });
      })
      .map(s => s.hymn);
  }, [hymnsWithKeys, activeFilter, activeKeyFilter, activeArtistFilter, favorites, searchQuery]);

  const getKeyBadgeColors = useCallback((key: string) => {
    const root = key.replace('m', '');
    const isMinor = key.endsWith('m');
    const majorHues: Record<string, string> = {
      'C': '#27403D', 'C#': '#2D4A47', 'D': '#335451', 'D#': '#3A5E5A',
      'E': '#406864', 'F': '#46726E', 'F#': '#4D7C78', 'G': '#538682',
      'G#': '#5A908B', 'A': '#609A95', 'A#': '#67A49F', 'B': '#6DAEA9',
    };
    const minorColors: Record<string, string> = {
      'C': '#D88F2E', 'C#': '#DB9A43', 'D': '#DEA558', 'D#': '#E1B06D',
      'E': '#E4BB82', 'F': '#E7C697', 'F#': '#EAD1AC', 'G': '#EDDCC1',
      'G#': '#F0E7D6', 'A': '#F3F2EB', 'A#': '#D88F2E', 'B': '#DB9A43',
    };
    return isMinor ? (minorColors[root] || '#D88F2E') : (majorHues[root] || '#27403D');
  }, []);

  const renderItem = ({ item }: { item: Hymn & { musicalKey?: string } }) => {
    const keyColor = getKeyBadgeColors(item.musicalKey || 'C');
    const title = item.title || 'Sin título';
    const artist = item.artist || '';
    const category = item.category || '';
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={`flex-row items-center p-5 mb-4 mx-4 rounded-3xl ${isDarkMode ? 'bg-surface-dark border border-white/5 shadow-sm' : 'bg-white'}`}
        style={!isDarkMode ? { shadowColor: '#FF8C00', shadowOpacity: 0.08, shadowRadius: 15, shadowOffset: { width: 0, height: 8 }, elevation: 5 } : undefined}
        onPress={() => navigation.navigate('HymnDetail', { hymnId: item.id, isCustom: item.isCustom, hymn: item })}
      >
        <View className="flex-row items-center flex-1">
          <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4`}
            style={{ backgroundColor: isDarkMode ? `${keyColor}20` : `${keyColor}10` }}
          >
            <Text className="font-serif font-bold text-lg"
              style={{ color: keyColor }}
            >
              {item.musicalKey || 'C'}
            </Text>
          </View>
          <View className="flex-1 justify-center">
            <Text className={`font-sans font-bold text-lg mb-0.5 ${isDarkMode ? 'text-text-dark' : 'text-slate-800'}`} numberOfLines={1}>
              {title}
            </Text>
            <View className="flex-row items-center">
              {artist ? (
                <Text className={`font-sans text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {artist}
                </Text>
              ) : null}
              {artist && category ? (
                <Text className={`font-sans text-xs mx-1.5 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>·</Text>
              ) : null}
              <Text className={`font-sans text-xs ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>{category}</Text>
            </View>
          </View>
        </View>
        <ChevronRight color={isDarkMode ? '#9CA3AF' : '#FF8C00'} size={24} strokeWidth={1.5} />
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View className="px-6 pb-6 pt-2">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className={`text-4xl font-serif font-bold tracking-tight ${isDarkMode ? 'text-text-dark' : 'text-white'}`}>Himnario</Text>
          <Text className={`text-sm font-sans mt-1 ${isDarkMode ? 'text-primary-dark' : 'text-white/80'}`}>Tu biblioteca musical</Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} className={`p-3 rounded-2xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white/20'} shadow-sm`}>
          {isDarkMode ? <Sun color="#D88F2E" size={24} /> : <Moon color="#FFFFFF" size={24} />}
        </TouchableOpacity>
      </View>

      {/* Category filter tabs */}
      <View className="mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {FILTERS.map(({ key, label, icon: Icon }) => {
            const isActive = activeFilter === key;
            const count = counts[key];
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.85}
                onPress={() => {
                  setActiveFilter(key);
                  if (key !== 'artistas') setActiveArtistFilter(null);
                  if (key === 'artistas') setActiveKeyFilter(null);
                }}
                className={`items-center py-3 px-4 rounded-2xl border ${isActive
                  ? `${isDarkMode ? 'bg-primary-dark' : 'bg-primary'} border-transparent`
                  : `${isDarkMode ? 'bg-surface-dark border-slate-700/50' : 'bg-white border-slate-200/70'}`
                  }`}
                style={{ minWidth: 80 }}
              >
                <Icon
                  size={22}
                  color={isActive ? '#FFFFFF' : isDarkMode ? '#9CA3AF' : '#FFFFFF'}
                  fill={isActive && key === 'favorites' ? '#FFFFFF' : 'transparent'}
                  strokeWidth={1.5}
                />
                <Text className={`font-sans font-bold text-xs mt-1.5 ${isActive ? 'text-white' : isDarkMode ? 'text-slate-300' : 'text-white/80'}`}>
                  {label}
                </Text>
                <Text className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-white/80' : isDarkMode ? 'text-slate-500' : 'text-white/60'}`}>
                  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Artist sub-filter row */}
      {activeFilter === 'artistas' && (
        <MotiView
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="mb-3"
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveArtistFilter(null)}
              className={`px-3 py-1.5 rounded-xl mr-2 border ${!activeArtistFilter
                ? `${isDarkMode ? 'bg-primary-dark/30 border-primary-dark/50' : 'bg-primary/20 border-primary/40'}`
                : `${isDarkMode ? 'bg-surface-dark border-slate-700' : 'bg-white border-slate-200'}`
                }`}
            >
              <Text className={`text-xs font-bold ${!activeArtistFilter ? (isDarkMode ? 'text-primary-dark' : 'text-white') : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Todos los Artistas</Text>
            </TouchableOpacity>
            {artistFilterOptions.map(artist => {
              const isActiveArtist = activeArtistFilter === artist;
              return (
                <TouchableOpacity
                  key={artist}
                  activeOpacity={0.7}
                  onPress={() => setActiveArtistFilter(isActiveArtist ? null : artist)}
                  className={`px-3 py-1.5 rounded-xl mr-2 border ${isActiveArtist
                    ? `${isDarkMode ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-emerald-50 border-emerald-500/40'}`
                    : `${isDarkMode ? 'bg-surface-dark border-slate-700' : 'bg-white border-slate-200'}`
                    }`}
                >
                  <Text className={`text-xs font-bold ${isActiveArtist ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-700') : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {artist}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </MotiView>
      )}

      {/* Key filter row */}
      {activeFilter !== 'artistas' && keyFilterOptions.length > 1 && (
        <MotiView
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="mb-3"
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveKeyFilter(null)}
              className={`px-3 py-1.5 rounded-xl mr-2 border ${!activeKeyFilter
                ? `${isDarkMode ? 'bg-primary-dark/30 border-primary-dark/50' : 'bg-primary/20 border-primary/40'}`
                : `${isDarkMode ? 'bg-surface-dark border-slate-700' : 'bg-white border-slate-200'}`
                }`}
            >
              <Text className={`text-xs font-bold ${!activeKeyFilter ? (isDarkMode ? 'text-primary-dark' : 'text-white') : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Todas</Text>
            </TouchableOpacity>
            {keyFilterOptions.map(k => {
              const isActiveKey = activeKeyFilter === k;
              const kc = getKeyBadgeColors(k);
              return (
                <TouchableOpacity
                  key={k}
                  activeOpacity={0.7}
                  onPress={() => setActiveKeyFilter(isActiveKey ? null : k)}
                  className="px-3 py-1.5 rounded-xl mr-2 border"
                  style={{
                    backgroundColor: isActiveKey ? kc : isDarkMode ? '#1e293b' : '#ffffff',
                    borderColor: isActiveKey ? kc : isDarkMode ? '#334155' : '#e2e8f0',
                    shadowColor: isActiveKey ? kc : 'transparent',
                    shadowOpacity: 0.5,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: isActiveKey ? 5 : 0,
                  }}
                >
                  <Text className="text-xs font-bold tracking-wider"
                    style={{ color: isActiveKey ? '#ffffff' : kc }}
                  >
                    {k}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </MotiView>
      )}

      {/* Active filter indicator */}
      {(activeFilter !== 'todas' || activeKeyFilter || activeArtistFilter) && (
        <MotiView
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="flex-row items-center mb-3 px-1"
        >
          <Text className={`text-sm font-sans ${isDarkMode ? 'text-muted-dark' : 'text-white/80'}`}>
            Mostrando: <Text className={`font-bold ${isDarkMode ? '' : 'text-white'}`}>
              {FILTERS.find(f => f.key === activeFilter)?.label || 'Todas'}
              {activeFilter && activeKeyFilter ? ' · ' : ''}
              {activeKeyFilter ? `Tono ${activeKeyFilter}` : ''}
              {activeFilter === 'artistas' && activeArtistFilter ? ` · ${activeArtistFilter}` : ''}
            </Text>
          </Text>
          {activeKeyFilter && activeFilter !== 'artistas' && (
            <TouchableOpacity onPress={() => setActiveKeyFilter(null)} className="ml-2">
              <X size={14} color={isDarkMode ? '#94A3B8' : '#FFFFFF'} />
            </TouchableOpacity>
          )}
          {activeArtistFilter && activeFilter === 'artistas' && (
            <TouchableOpacity onPress={() => setActiveArtistFilter(null)} className="ml-2">
              <X size={14} color={isDarkMode ? '#94A3B8' : '#FFFFFF'} />
            </TouchableOpacity>
          )}
        </MotiView>
      )}

      {/* Search */}
      <View className={`flex-row items-center px-4 py-3 rounded-2xl ${isDarkMode ? 'bg-surface-dark/80' : 'bg-white'} shadow-lg`} style={{ shadowColor: isDarkMode ? '#000' : '#FF8C00', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 }}>
        <Search color={isDarkMode ? '#94A3B8' : '#FF8C00'} size={20} strokeWidth={2} />
        <TextInput
          placeholder="Buscar por título, letra o número..."
          placeholderTextColor={isDarkMode ? '#94A3B8' : '#9CA3AF'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          className={`flex-1 ml-3 font-sans text-base ${isDarkMode ? 'text-text-dark' : 'text-slate-800'}`}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X color={isDarkMode ? '#94A3B8' : '#FF8C00'} size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }}>
      <View
        style={{
          borderBottomLeftRadius: isDarkMode ? 0 : 40,
          borderBottomRightRadius: isDarkMode ? 0 : 40,
          overflow: 'hidden',
          paddingTop: insets.top,
          backgroundColor: isDarkMode ? '#0f172a' : 'transparent',
          borderBottomWidth: isDarkMode ? 1 : 0,
          borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'transparent',
          zIndex: 10,
        }}
      >
        {!isDarkMode && (
          <LinearGradient
            colors={['#FFAD33', '#FF7A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ ...StyleSheet.absoluteFillObject }}
          />
        )}
        {ListHeader()}
      </View>
      <FlatList
        data={filteredHymns}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        windowSize={7}
        initialNumToRender={10}
      />
    </View>
  );
}
