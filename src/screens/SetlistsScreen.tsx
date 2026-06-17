import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Heart, ListMusic, Plus, Trash2, ChevronRight } from 'lucide-react-native';

export default function SetlistsScreen({ navigation }: any) {
  const isDarkMode = useAppStore((state) => state.theme === 'dark');
  const setlists = useAppStore((state) => state.setlists);
  const favorites = useAppStore((state) => state.favorites);
  const createSetlist = useAppStore((state) => state.createSetlist);
  const deleteSetlist = useAppStore((state) => state.deleteSetlist);

  const [newListName, setNewListName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    if (!newListName.trim()) return;
    createSetlist(newListName.trim());
    setNewListName('');
    setIsCreating(false);
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      'Eliminar Repertorio',
      `¿Estás seguro de eliminar "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteSetlist(id) }
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
        <View>
          <Text className={`text-4xl font-serif font-bold tracking-tight ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
            Repertorios
          </Text>
          <Text className={`text-sm font-sans mt-1 ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>
            Organiza tus listas de servicio
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => setIsCreating(!isCreating)}
          className={`p-3 rounded-2xl ${isDarkMode ? 'bg-primary-dark' : 'bg-primary'} shadow-sm`}
        >
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      {isCreating && (
        <View className={`mx-6 mb-4 p-4 rounded-2xl border ${isDarkMode ? 'bg-surface-dark border-slate-700' : 'bg-white border-slate-200'}`}>
          <Text className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>NUEVO REPERTORIO</Text>
          <View className="flex-row items-center gap-2">
            <TextInput
              className={`flex-1 px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-background-dark border-slate-700 text-white' : 'bg-background border-slate-200 text-black'}`}
              placeholder="Ej: Culto de Domingo"
              placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
              value={newListName}
              onChangeText={setNewListName}
              autoFocus
            />
            <TouchableOpacity onPress={handleCreate} className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-primary-dark' : 'bg-primary'}`}>
              <Text className="text-white font-bold">Crear</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Favoritos (Repertorio Automático) */}
        <TouchableOpacity
          activeOpacity={0.8}
          className={`flex-row items-center p-5 mb-4 rounded-3xl border ${
            isDarkMode 
              ? 'bg-surface-dark border-red-500/20 shadow-black/20' 
              : 'bg-white border-red-100 shadow-slate-200/50'
          }`}
          onPress={() => navigation.navigate('SetlistDetail', { setlistId: 'favorites', setlistName: 'Favoritos' })}
        >
          <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${isDarkMode ? 'bg-red-500/20' : 'bg-red-50'}`}>
            <Heart color="#EF4444" fill="#EF4444" size={28} />
          </View>
          <View className="flex-1 justify-center">
            <Text className={`font-sans font-bold text-lg mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
              Favoritos
            </Text>
            <Text className={`font-sans text-sm ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
              {favorites.length} canciones
            </Text>
          </View>
          <ChevronRight color={isDarkMode ? '#9CA3AF' : '#6B7280'} size={24} />
        </TouchableOpacity>

        {/* Setlists Personalizados */}
        {setlists.map((setlist) => (
          <TouchableOpacity
            key={setlist.id}
            activeOpacity={0.8}
            className={`flex-row items-center p-5 mb-4 rounded-3xl border ${
              isDarkMode 
                ? 'bg-surface-dark border-white/5 shadow-black/20' 
                : 'bg-white border-slate-100 shadow-slate-200/50'
            }`}
            onPress={() => navigation.navigate('SetlistDetail', { setlistId: setlist.id, setlistName: setlist.name })}
          >
            <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${isDarkMode ? 'bg-primary-dark/20' : 'bg-primary/10'}`}>
              <ListMusic color={isDarkMode ? '#818CF8' : '#4F46E5'} size={28} />
            </View>
            <View className="flex-1 justify-center">
              <Text className={`font-sans font-bold text-lg mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
                {setlist.name}
              </Text>
              <Text className={`font-sans text-sm ${isDarkMode ? 'text-muted-dark' : 'text-muted'}`}>
                {setlist.hymnIds.length} canciones
              </Text>
            </View>
            <TouchableOpacity onPress={() => confirmDelete(setlist.id, setlist.name)} className="p-2">
              <Trash2 color={isDarkMode ? '#EF4444' : '#EF4444'} size={20} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
