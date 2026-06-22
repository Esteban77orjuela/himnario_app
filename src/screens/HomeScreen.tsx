import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useIsDarkMode } from '../utils/useIsDarkMode';
import { FlashList } from '@shopify/flash-list';
import { mockHymns, Hymn } from '../data/hymns';
import { Search, ChevronRight, Sun, Moon, X } from 'lucide-react-native';
import { MotiView } from 'moti';
import Fuse from 'fuse.js';

export default function HomeScreen({ navigation }: any) {
  const isDarkMode = useIsDarkMode();
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const customSongs = useAppStore((state) => state.customSongs);
  const categoryOverrides = useAppStore((state) => state.categoryOverrides);
  const favorites = useAppStore((state) => state.favorites);
  const songPlayCount = useAppStore((state) => state.songPlayCount);
  useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredHymns = useMemo(() => {
    const q = searchQuery.toLowerCase();

    // Convertir customSongs al formato Hymn para poder listarlos juntos
    const mappedCustoms = customSongs.map((cs, idx) => ({
      id: cs.title || `custom-${idx}`,
      number: 900 + idx, // Números altos para diferenciarlos
      title: cs.title || 'Desconocido',
      lyrics: cs.lyrics || '',
      category: categoryOverrides[cs.title || `custom-${idx}`] || cs.category || 'Importada', // Ahora soporta overrides
      isCustom: true // Bandera especial
    }));

    // Aplicar overrides también a los himnos base
    const mappedMocks = mockHymns.map(h => ({
      ...h,
      category: categoryOverrides[h.id] || h.category
    }));

    const allHymns = [...mappedMocks, ...mappedCustoms];

    // Primero filtramos por pestaña activa
    let tabFiltered = allHymns;
    if (activeTab === 'favorites') {
      tabFiltered = tabFiltered.filter(h => favorites.includes(h.id));
    } else if (activeTab === 'alabanza') {
      tabFiltered = tabFiltered.filter(h => h.category.toLowerCase().includes('alabanza'));
    } else if (activeTab === 'adoracion') {
      tabFiltered = tabFiltered.filter(h => h.category.toLowerCase().includes('adoración') || h.category.toLowerCase().includes('adoracion'));
    } else if (activeTab === 'populares') {
      tabFiltered.sort((a, b) => (songPlayCount[b.id] || 0) - (songPlayCount[a.id] || 0));
    }

    if (activeTab !== 'populares') {
      tabFiltered.sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
    }

    if (!q) return tabFiltered;

    // Luego filtramos por búsqueda usando Fuse.js para ser tolerantes a errores
    const fuse = new Fuse(tabFiltered, {
      keys: ['title', 'lyrics', 'number'],
      threshold: 0.3, // 0 = match perfecto, 1 = todo. 0.3 es tolerante pero preciso.
      ignoreLocation: true,
    });

    return fuse.search(q).map(result => result.item);
  }, [searchQuery, customSongs, activeTab, favorites, categoryOverrides]);

  const renderItem = ({ item, index }: { item: Hymn; index: number }) => {
    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 400,
          delay: index * 50, // Staggered animation
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          className={`flex-row items-center p-5 mb-4 mx-4 rounded-3xl border ${isDarkMode
              ? 'bg-surface-dark border-white/5 shadow-black/20'
              : 'bg-white border-slate-100 shadow-slate-200/50'
            }`}
          onPress={() => navigation.navigate('HymnDetail', {
            hymnId: item.id,
            isCustom: item.isCustom,
            hymn: item
          })}
        >
          <View className="flex-row items-center flex-1">
            {!item.isCustom ? (
              <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${isDarkMode ? 'bg-primary-dark/20' : 'bg-primary/10'}`}>
                <Text className={`font-serif font-bold text-lg ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>
                  {item.number}
                </Text>
              </View>
            ) : (
              <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${isDarkMode ? 'bg-accent-dark/20' : 'bg-accent/10'}`}>
                <Text className={`font-serif font-bold text-lg ${isDarkMode ? 'text-accent-dark' : 'text-accent'}`}>
                  WEB
                </Text>
              </View>
            )}
            <View className="flex-1 justify-center">
              <Text className={`font-sans font-bold text-lg mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text'}`} numberOfLines={1}>
                {item.title}
              </Text>
              <Text className={`font-sans text-sm ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
                {item.category}
              </Text>
            </View>
          </View>
          {activeTab === 'populares' && songPlayCount[item.id] > 0 && (
            <View className={`mr-2 px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-accent-dark/20' : 'bg-accent/10'}`}>
              <Text className={`text-xs font-bold ${isDarkMode ? 'text-accent-dark' : 'text-accent'}`}>
                {songPlayCount[item.id]}
              </Text>
            </View>
          )}
          <ChevronRight color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={24} />
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className={`text-4xl font-serif font-bold tracking-tight ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
              Himnario
            </Text>
            <Text className={`text-sm font-sans mt-1 ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>
              Tu biblioteca musical
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            className={`p-3 rounded-2xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white'} shadow-sm`}
          >
            {isDarkMode ? <Sun color="#818CF8" size={24} /> : <Moon color="#4F46E5" size={24} />}
          </TouchableOpacity>
        </View>

        <View className={`flex-row items-center px-4 py-3 rounded-2xl ${isDarkMode ? 'bg-surface-dark/80' : 'bg-white/80'} border border-slate-200/20 shadow-sm mb-4`}>
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {['all', 'favorites', 'populares', 'alabanza', 'adoracion'].map((tab) => {
            const labels: any = { all: 'Todos', favorites: 'Favoritos', populares: 'Populares', alabanza: 'Alabanza', adoracion: 'Adoración' };
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-5 py-2 mr-3 rounded-full border ${isActive
                    ? (isDarkMode ? 'bg-primary-dark border-primary-dark' : 'bg-primary border-primary')
                    : (isDarkMode ? 'bg-surface-dark border-slate-700' : 'bg-white border-slate-200')
                  }`}
              >
                <Text className={`font-sans font-bold ${isActive ? 'text-white' : (isDarkMode ? 'text-slate-400' : 'text-slate-600')
                  }`}>
                  {labels[tab]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlashList
        data={filteredHymns}
        renderItem={renderItem}
        // @ts-expect-error FlashList legacy prop
        estimatedItemSize={100}
        contentContainerStyle={{ paddingBottom: 120 }} // Space for BottomTabBar
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
