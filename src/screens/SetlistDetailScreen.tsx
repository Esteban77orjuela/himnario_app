import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { useIsDarkMode } from '../utils/useIsDarkMode';
import { FlashList } from '@shopify/flash-list';
import { mockHymns, Hymn } from '../data/hymns';
import { ArrowLeft, ChevronRight, Trash2 } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function SetlistDetailScreen({ route, navigation }: any) {
  const { setlistId, setlistName } = route.params;
  const isDarkMode = useIsDarkMode();
  const customSongs = useAppStore((state) => state.customSongs);
  const categoryOverrides = useAppStore((state) => state.categoryOverrides);
  const favorites = useAppStore((state) => state.favorites);
  const setlists = useAppStore((state) => state.setlists);
  const removeHymnFromSetlist = useAppStore((state) => state.removeHymnFromSetlist);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  // Determinar qué canciones mostrar
  let hymnIdsToShow: string[] = [];
  if (setlistId === 'favorites') {
    hymnIdsToShow = favorites;
  } else {
    const setlist = setlists.find(s => s.id === setlistId);
    if (setlist) hymnIdsToShow = setlist.hymnIds;
  }

  // Mapear IDs a objetos Hymn
  const mappedCustoms = customSongs.map((cs, idx) => ({
    id: cs.title || `custom-${idx}`,
    number: 900 + idx,
    title: cs.title || 'Desconocido',
    lyrics: cs.lyrics || '',
    category: categoryOverrides[cs.title || `custom-${idx}`] || cs.category || 'Importada',
    isCustom: true
  }));

  const mappedMocks = mockHymns.map(h => ({
    ...h,
    category: categoryOverrides[h.id] || h.category
  }));

  const allHymns = [...mappedMocks, ...mappedCustoms];
  const listHymns = hymnIdsToShow.map(id => allHymns.find(h => h.id === id)).filter(Boolean) as Hymn[];

  const confirmRemove = (hymnId: string, title: string) => {
    Alert.alert(
      'Remover Canción',
      `¿Remover "${title}" de ${setlistName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive', 
          onPress: () => {
            if (setlistId === 'favorites') toggleFavorite(hymnId);
            else removeHymnFromSetlist(setlistId, hymnId);
          } 
        }
      ]
    );
  };

  const renderItem = ({ item, index }: { item: Hymn; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 50 }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        className={`flex-row items-center p-5 mb-4 mx-4 rounded-3xl border ${
          isDarkMode 
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
          <View className="flex-1 justify-center pr-2">
            <Text className={`font-sans font-bold text-lg mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text'}`} numberOfLines={1}>
              {item.title}
            </Text>
            <Text className={`font-sans text-sm ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
              {item.category}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => confirmRemove(item.id, item.title)} className="p-2 mr-1">
          <Trash2 color={isDarkMode ? '#EF4444' : '#EF4444'} size={20} />
        </TouchableOpacity>
        <ChevronRight color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={24} />
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <View className="px-6 pt-6 pb-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className={`p-3 mr-4 rounded-2xl ${isDarkMode ? 'bg-surface-dark' : 'bg-white'} shadow-sm`}
        >
          <ArrowLeft color={isDarkMode ? '#818CF8' : '#4F46E5'} size={24} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className={`text-3xl font-serif font-bold tracking-tight ${isDarkMode ? 'text-text-dark' : 'text-text'}`} numberOfLines={1}>
            {setlistName}
          </Text>
          <Text className={`text-sm font-sans mt-1 ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>
            {listHymns.length} canciones
          </Text>
        </View>
      </View>

      {listHymns.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <Text className={`text-lg text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Esta lista está vacía.
          </Text>
          <Text className={`text-sm text-center mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Abre una canción y presiona el ícono "+" para añadirla aquí.
          </Text>
        </View>
      ) : (
        <FlashList
          data={listHymns}
          renderItem={renderItem}
          // @ts-expect-error FlashList legacy prop
          estimatedItemSize={100}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
