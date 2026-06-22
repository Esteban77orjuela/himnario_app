import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useIsDarkMode } from '../utils/useIsDarkMode';
import { FlashList } from '@shopify/flash-list';
import { mockHymns, Hymn } from '../data/hymns';
import { Search, ChevronRight, Sun, Moon, X, Heart, Music2, Cross } from 'lucide-react-native';
import { MotiView } from 'moti';
import Fuse from 'fuse.js';

type FilterKey = 'adoracion' | 'alabanza' | 'favorites';

type FilterDef = {
  key: FilterKey;
  label: string;
  icon: typeof Heart;
  bg: string;
  bgDark: string;
  activeBg: string;
  activeBgDark: string;
  color: string;
  colorDark: string;
};

const FILTERS: FilterDef[] = [
  {
    key: 'adoracion',
    label: 'Adoración',
    icon: Cross,
    bg: 'bg-violet-50', bgDark: 'bg-violet-950/40',
    activeBg: 'bg-violet-600', activeBgDark: 'bg-violet-500',
    color: '#7C3AED', colorDark: '#A78BFA',
  },
  {
    key: 'alabanza',
    label: 'Alabanza',
    icon: Music2,
    bg: 'bg-pink-50', bgDark: 'bg-pink-950/40',
    activeBg: 'bg-pink-600', activeBgDark: 'bg-pink-500',
    color: '#DB2777', colorDark: '#F472B6',
  },
  {
    key: 'favorites',
    label: 'Favoritos',
    icon: Heart,
    bg: 'bg-rose-50', bgDark: 'bg-rose-950/40',
    activeBg: 'bg-rose-600', activeBgDark: 'bg-rose-500',
    color: '#E11D48', colorDark: '#FB7185',
  },
];

export default function HomeScreen({ navigation }: any) {
  const isDarkMode = useIsDarkMode();
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const customSongs = useAppStore((state) => state.customSongs);
  const categoryOverrides = useAppStore((state) => state.categoryOverrides);
  const favorites = useAppStore((state) => state.favorites);
  useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);

  const allHymns = useMemo(() => {
    const mappedCustoms = customSongs.map((cs, idx) => ({
      id: cs.title || `custom-${idx}`,
      number: 900 + idx,
      title: cs.title || 'Desconocido',
      lyrics: cs.lyrics || '',
      category: categoryOverrides[cs.title || `custom-${idx}`] || cs.category || 'Importada',
      isCustom: true,
    }));
    const mappedMocks = mockHymns.map(h => ({
      ...h,
      category: categoryOverrides[h.id] || h.category,
    }));
    return [...mappedMocks, ...mappedCustoms];
  }, [customSongs, categoryOverrides]);

  const counts = useMemo(() => ({
    adoracion: allHymns.filter(h => h.category.toLowerCase().includes('adoración') || h.category.toLowerCase().includes('adoracion')).length,
    alabanza: allHymns.filter(h => h.category.toLowerCase().includes('alabanza')).length,
    favorites: favorites.length,
  }), [allHymns, favorites]);

  const filteredHymns = useMemo(() => {
    let result = allHymns;
    if (activeFilter === 'favorites') {
      result = result.filter(h => favorites.includes(h.id));
    } else if (activeFilter === 'alabanza') {
      result = result.filter(h => h.category.toLowerCase().includes('alabanza'));
    } else if (activeFilter === 'adoracion') {
      result = result.filter(h => h.category.toLowerCase().includes('adoración') || h.category.toLowerCase().includes('adoracion'));
    }
    result.sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));

    if (!searchQuery) return result;

    const fuse = new Fuse(result, {
      keys: ['title', 'lyrics', 'number'],
      threshold: 0.3,
      ignoreLocation: true,
    });
    return fuse.search(searchQuery).map(r => r.item);
  }, [allHymns, activeFilter, favorites, searchQuery]);

  const renderItem = ({ item, index }: { item: Hymn; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: index * 50 }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        className={`flex-row items-center p-5 mb-4 mx-4 rounded-3xl border ${isDarkMode ? 'bg-surface-dark border-white/5 shadow-black/20' : 'bg-white border-slate-100 shadow-slate-200/50'}`}
        onPress={() => navigation.navigate('HymnDetail', { hymnId: item.id, isCustom: item.isCustom, hymn: item })}
      >
        <View className="flex-row items-center flex-1">
          {!item.isCustom ? (
            <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${isDarkMode ? 'bg-primary-dark/20' : 'bg-primary/10'}`}>
              <Text className={`font-serif font-bold text-lg ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>{item.number}</Text>
            </View>
          ) : (
            <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${isDarkMode ? 'bg-accent-dark/20' : 'bg-accent/10'}`}>
              <Text className={`font-serif font-bold text-lg ${isDarkMode ? 'text-accent-dark' : 'text-accent'}`}>WEB</Text>
            </View>
          )}
          <View className="flex-1 justify-center">
            <Text className={`font-sans font-bold text-lg mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text'}`} numberOfLines={1}>{item.title}</Text>
            <Text className={`font-sans text-sm ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>{item.category}</Text>
          </View>
        </View>
        <ChevronRight color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={24} />
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <View className="px-6 pt-6 pb-4">
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

        {/* Three filter buttons */}
        <View className="flex-row gap-x-3 mb-4">
          {FILTERS.map(({ key, label, icon: Icon, bg, bgDark, activeBg, activeBgDark, color, colorDark }) => {
            const isActive = activeFilter === key;
            const count = counts[key];
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(isActive ? null : key)}
                className={`flex-1 items-center py-4 px-2 rounded-2xl border ${isActive
                  ? `${isDarkMode ? activeBgDark : activeBg} border-transparent`
                  : `${isDarkMode ? bgDark : bg} ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`
                }`}
              >
                <MotiView
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                >
                  <Icon
                    size={26}
                    color={isActive ? '#FFFFFF' : isDarkMode ? colorDark : color}
                    fill={isActive ? '#FFFFFF' : 'transparent'}
                  />
                </MotiView>
                <Text className={`font-sans font-bold text-xs mt-2 ${isActive ? 'text-white' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {label}
                </Text>
                <View className={`mt-1.5 px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : isDarkMode ? 'bg-black/10' : 'bg-white/60'}`}>
                  <Text className={`text-[10px] font-bold ${isActive ? 'text-white' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active filter indicator */}
        {activeFilter && (
          <MotiView
            from={{ opacity: 0, translateY: -8 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="flex-row items-center mb-3 px-1"
          >
            <Text className={`text-sm font-sans ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
              Mostrando: <Text className="font-bold">{FILTERS.find(f => f.key === activeFilter)?.label}</Text>
            </Text>
            <TouchableOpacity onPress={() => setActiveFilter(null)} className="ml-2">
              <X size={14} color={isDarkMode ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </MotiView>
        )}

        {/* Search */}
        <View className={`flex-row items-center px-4 py-3 rounded-2xl ${isDarkMode ? 'bg-surface-dark/80' : 'bg-white/80'} border border-slate-200/20 shadow-sm`}>
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

      <FlashList
        data={filteredHymns}
        renderItem={renderItem}
        // @ts-expect-error FlashList legacy prop
        estimatedItemSize={100}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
