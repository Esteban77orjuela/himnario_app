import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FlashList } from '@shopify/flash-list';
import { mockHymns, Hymn } from '../data/hymns';
import { Search, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

export default function HomeScreen({ navigation }: any) {
  const isDarkMode = useAppStore((state) => state.theme === 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const filteredHymns = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mockHymns.filter(
      (hymn) =>
        hymn.title.toLowerCase().includes(q) ||
        hymn.number.toString().includes(q) ||
        hymn.lyrics.toLowerCase().includes(q)
    );
  }, [searchQuery]);

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
          className={`flex-row items-center p-5 mb-4 mx-4 rounded-3xl border ${
            isDarkMode 
              ? 'bg-white/5 border-white/5' 
              : 'bg-black/5 border-black/5'
          }`}
          onPress={() => navigation.navigate('HymnDetail', { hymnId: item.id })}
        >
          <View className="flex-row items-center flex-1">
            <Text className={`font-serif text-3xl font-bold opacity-30 mr-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {item.number.toString().padStart(2, '0')}
            </Text>
            <View className="flex-1">
              <Text className={`font-sans text-lg font-semibold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
                {item.title}
              </Text>
              <Text className={`font-sans text-sm ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
                Categoría: {item.category}
              </Text>
            </View>
          </View>
          <ChevronRight color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={24} />
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <View style={{ paddingTop: insets.top + 20 }} className="px-6 pb-4">
        <Text className={`font-serif text-4xl font-bold tracking-tight mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
          Himnario de Adoración
        </Text>
        <Text className={`font-sans text-base mb-6 ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
          Encuentra tus alabanzas favoritas
        </Text>

        <View className={`flex-row items-center px-4 py-3.5 rounded-2xl border ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/10 shadow-sm'
        }`}>
          <Search color={isDarkMode ? '#A78BFA' : '#4F46E5'} size={20} className="mr-3" />
          <TextInput
            placeholder="Buscar por título, número o letra..."
            placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
            className={`flex-1 font-sans text-base ${isDarkMode ? 'text-white' : 'text-black'}`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            selectionColor={isDarkMode ? '#A78BFA' : '#4F46E5'}
          />
        </View>
      </View>

      <FlashList
        data={filteredHymns}
        renderItem={renderItem}
        // @ts-ignore
        estimatedItemSize={100}
        contentContainerStyle={{ paddingBottom: 120 }} // Space for BottomTabBar
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
