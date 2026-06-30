import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useIsDarkMode } from '../utils/useIsDarkMode';
import { FlashList } from '@shopify/flash-list';
import { mockHymns, christianSongs, Hymn } from '../data/hymns';
import { Search, ChevronRight, Sun, Moon, X, Heart, Music2, BookOpen, Users, List } from 'lucide-react-native';
import { MotiView } from 'moti';
import Fuse from 'fuse.js';
import { detectKey } from '../utils/keyDetector';
import { detectArtistFromTitle } from '../utils/artistDetector';

type FilterKey = 'todas' | 'himnos' | 'adoracion' | 'alabanza' | 'favorites' | 'artistas';

type FilterDef = {
  key: FilterKey;
  label: string;
  icon: typeof Heart;
  activeBg: string;
  activeBgDark: string;
  color: string;
  colorDark: string;
};

const ALL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'] as const;
type MusicalKey = typeof ALL_KEYS[number];

const FILTERS: FilterDef[] = [
  {
    key: 'todas',
    label: 'Todas',
    icon: List,
    activeBg: 'bg-slate-700', activeBgDark: 'bg-slate-500',
    color: '#475569', colorDark: '#94A3B8',
  },
  {
    key: 'himnos',
    label: 'Himnos',
    icon: BookOpen,
    activeBg: 'bg-blue-600', activeBgDark: 'bg-blue-500',
    color: '#2563EB', colorDark: '#60A5FA',
  },
  {
    key: 'adoracion',
    label: 'Adoración',
    icon: Heart,
    activeBg: 'bg-violet-600', activeBgDark: 'bg-violet-500',
    color: '#7C3AED', colorDark: '#A78BFA',
  },
  {
    key: 'alabanza',
    label: 'Alabanza',
    icon: Music2,
    activeBg: 'bg-pink-600', activeBgDark: 'bg-pink-500',
    color: '#DB2777', colorDark: '#F472B6',
  },
  {
    key: 'favorites',
    label: 'Favoritos',
    icon: Heart,
    activeBg: 'bg-rose-600', activeBgDark: 'bg-rose-500',
    color: '#E11D48', colorDark: '#FB7185',
  },
  {
    key: 'artistas',
    label: 'Artistas',
    icon: Users,
    activeBg: 'bg-emerald-600', activeBgDark: 'bg-emerald-500',
    color: '#059669', colorDark: '#34D399',
  },
];

export default function HomeScreen({ navigation }: any) {
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
        if ((h as any).musicalKey) {
          setSongKey(h.id, (h as any).musicalKey);
        } else if (h.lyrics) {
          setSongKey(h.id, detectKey(h.lyrics));
        }
      }
    });
  }, [allHymns, songKeys, setSongKey]);

  const hymnsWithKeys = useMemo(() => {
    return allHymns.map(h => ({
      ...h,
      musicalKey: songKeys[h.id] || (h as any).musicalKey || 'C',
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
    return Array.from(new Set(allHymns.map(h => h.artist).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
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
      const fuse = new Fuse(result, { keys: ['title', 'artist'], threshold: 0.3, ignoreLocation: true });
      return fuse.search(searchQuery).map(r => r.item);
    }
    // 'todas' falls through — no category filter

    if (activeKeyFilter) {
      result = result.filter(h => h.musicalKey === activeKeyFilter);
    }
    result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));

    if (!searchQuery) return result;

    const fuse = new Fuse(result, {
      keys: ['title', 'lyrics', 'number'],
      threshold: 0.3,
      ignoreLocation: true,
    });
    return fuse.search(searchQuery).map(r => r.item);
  }, [hymnsWithKeys, activeFilter, activeKeyFilter, activeArtistFilter, favorites, searchQuery]);

  const getKeyBadgeColors = useCallback((key: string) => {
    const root = key.replace('m', '');
    const isMinor = key.endsWith('m');
    const majorHues: Record<string, string> = {
      'C': '#f97316', 'C#': '#8b5cf6', 'D': '#ef4444', 'D#': '#ec4899',
      'E': '#f43f5e', 'F': '#f59e0b', 'F#': '#10b981', 'G': '#3b82f6',
      'G#': '#6366f1', 'A': '#22c55e', 'A#': '#14b8a6', 'B': '#a855f7',
    };
    const minorColors: Record<string, string> = {
      'C': '#fdba74', 'C#': '#c4b5fd', 'D': '#fca5a5', 'D#': '#f9a8d4',
      'E': '#fda4af', 'F': '#fde68a', 'F#': '#6ee7b7', 'G': '#93c5fd',
      'G#': '#a5b4fc', 'A': '#86efac', 'A#': '#5eead4', 'B': '#d8b4fe',
    };
    const c = isMinor ? (minorColors[root] || '#94a3b8') : (majorHues[root] || '#94a3b8');
    return c;
  }, []);

  const renderItem = ({ item }: { item: Hymn & { musicalKey?: string } }) => {
    const keyColor = getKeyBadgeColors(item.musicalKey || 'C');
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className={`flex-row items-center p-5 mb-4 mx-4 rounded-3xl border ${isDarkMode ? 'bg-surface-dark border-white/5 shadow-black/20' : 'bg-white border-slate-100 shadow-slate-200/50'}`}
        onPress={() => navigation.navigate('HymnDetail', { hymnId: item.id, isCustom: item.isCustom, hymn: item })}
      >
        <View className="flex-row items-center flex-1">
          <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4`}
            style={{ backgroundColor: isDarkMode ? `${keyColor}20` : `${keyColor}15` }}
          >
            <Text className="font-serif font-bold text-lg"
              style={{ color: keyColor }}
            >
              {item.musicalKey || 'C'}
            </Text>
          </View>
          <View className="flex-1 justify-center">
            <Text className={`font-sans font-bold text-lg mb-0.5 ${isDarkMode ? 'text-text-dark' : 'text-text'}`} numberOfLines={1}>
              {item.title}
            </Text>
            <View className="flex-row items-center">
              {item.artist ? (
                <Text className={`font-sans text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.artist}
                </Text>
              ) : null}
              {item.artist && item.category ? (
                <Text className={`font-sans text-xs mx-1.5 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>·</Text>
              ) : null}
              <Text className={`font-sans text-xs ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>{item.category}</Text>
            </View>
          </View>
        </View>
        <ChevronRight color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={24} />
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View className="px-6 pt-6 pb-2">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className={`text-4xl font-serif font-bold tracking-tight ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>Himnario</Text>
          <Text className={`text-sm font-sans mt-1 ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>Tu biblioteca musical</Text>
        </View>
        <TouchableOpacity onPress={toggleTheme} className={`p-3 rounded-2xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white'} shadow-sm`}>
          {isDarkMode ? <Sun color="#818CF8" size={24} /> : <Moon color="#4F46E5" size={24} />}
        </TouchableOpacity>
      </View>

      {/* Category filter tabs */}
      <View className="mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
          {FILTERS.map(({ key, label, icon: Icon, activeBg, activeBgDark, color, colorDark }) => {
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
                  ? `${isDarkMode ? activeBgDark : activeBg} border-transparent`
                  : `${isDarkMode ? 'bg-surface-dark border-slate-700/50' : 'bg-white border-slate-200/70'}`
                  }`}
                style={{ minWidth: 80 }}
              >
                <Icon
                  size={22}
                  color={isActive ? '#FFFFFF' : isDarkMode ? colorDark : color}
                  fill={isActive && key === 'favorites' ? '#FFFFFF' : 'transparent'}
                />
                <Text className={`font-sans font-bold text-xs mt-1.5 ${isActive ? 'text-white' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {label}
                </Text>
                <Text className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-white/80' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
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
              <Text className={`text-xs font-bold ${!activeArtistFilter ? 'text-primary' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Todos los Artistas</Text>
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
              <Text className={`text-xs font-bold ${!activeKeyFilter ? 'text-primary' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Todas</Text>
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
          <Text className={`text-sm font-sans ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
            Mostrando: <Text className="font-bold">
              {FILTERS.find(f => f.key === activeFilter)?.label || 'Todas'}
              {activeFilter && activeKeyFilter ? ' · ' : ''}
              {activeKeyFilter ? `Tono ${activeKeyFilter}` : ''}
              {activeFilter === 'artistas' && activeArtistFilter ? ` · ${activeArtistFilter}` : ''}
            </Text>
          </Text>
          {activeKeyFilter && activeFilter !== 'artistas' && (
            <TouchableOpacity onPress={() => setActiveKeyFilter(null)} className="ml-2">
              <X size={14} color={isDarkMode ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          )}
          {activeArtistFilter && activeFilter === 'artistas' && (
            <TouchableOpacity onPress={() => setActiveArtistFilter(null)} className="ml-2">
              <X size={14} color={isDarkMode ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          )}
        </MotiView>
      )}

      {/* Search */}
      <View className={`flex-row items-center px-4 py-3 mb-4 rounded-2xl ${isDarkMode ? 'bg-surface-dark/80' : 'bg-white/80'} border border-slate-200/20 shadow-sm`}>
        <Search color={isDarkMode ? '#94A3B8' : '#64748B'} size={20} />
        <TextInput
          placeholder="Buscar por título o número..."
          placeholderTextColor={isDarkMode ? '#94A3B8' : '#64748B'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className={`flex-1 ml-3 font-sans text-base ${isDarkMode ? 'text-text-dark' : 'text-text'}`}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X color={isDarkMode ? '#94A3B8' : '#64748B'} size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <FlashList
        data={filteredHymns}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
        // @ts-expect-error FlashList legacy prop
        estimatedItemSize={100}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
