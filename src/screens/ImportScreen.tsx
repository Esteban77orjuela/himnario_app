import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Linking, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download, Link as LinkIcon, CheckCircle, Search } from 'lucide-react-native';
import { scrapeSongFromUrl } from '../services/scraperService';
import { useAppStore } from '../store/useAppStore';
import { useIsDarkMode } from '../utils/useIsDarkMode';

export default function ImportScreen({ navigation }: any) {
  const [url, setUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Otra');
  const [loading, setLoading] = useState(false);
  const addCustomSong = useAppStore((state) => state.addCustomSong);
  const isDarkMode = useIsDarkMode();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Aviso', 'Por favor ingresa el nombre de la canción');
      return;
    }
    const query = searchQuery.trim().replace(/\s+/g, '+');
    Linking.openURL(`https://acordes.lacuerda.net/busca.php?exp=${query}`);
  };

  const handleImport = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Por favor ingresa una URL válida');
      return;
    }

    setLoading(true);
    const result = await scrapeSongFromUrl(url.trim());
    setLoading(false);

    if (result.success && result.lyrics) {
      const songWithCategory = { ...result, category: category !== 'Otra' ? category : 'Importada' };
      addCustomSong(songWithCategory);
      Alert.alert(
        '¡Éxito!',
        `Se ha importado la canción: ${result.title}`,
        [
          { 
            text: 'Ver Canción', 
            onPress: () => navigation.navigate('HymnDetail', { 
              hymn: { id: result.title, title: result.title, lyrics: result.lyrics, category: songWithCategory.category }, 
              isCustom: true 
            }) 
          },
          { text: 'OK' }
        ]
      );
      setUrl('');
    } else {
      Alert.alert('Error al Importar', result.error || 'No se pudo leer la canción desde esta página.');
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1 p-6" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="mb-6 items-center">
            <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${isDarkMode ? 'bg-primary-dark/20' : 'bg-primary/20'}`}>
              <Download size={32} color={isDarkMode ? '#818CF8' : '#4F46E5'} />
            </View>
            <Text className={`text-2xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Importar Canción</Text>
            <Text className={`text-center text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Busca una canción en LaCuerda o pega directamente el enlace para guardarla en tu dispositivo.
            </Text>
          </View>

          {/* Buscador Integrado */}
          <View className={`p-4 rounded-2xl border mb-6 ${isDarkMode ? 'bg-surface-dark/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
            <Text className={`text-sm font-medium mb-2 uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
              1. Buscar en LaCuerda
            </Text>
            <View className={`flex-row items-center rounded-xl px-4 py-1 border mb-4 ${isDarkMode ? 'bg-background-dark/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <TextInput
                className={`flex-1 text-base py-3 ${isDarkMode ? 'text-white' : 'text-black'}`}
                placeholder="Ej. Gracias a Dios"
                placeholderTextColor={isDarkMode ? '#64748b' : '#94a3b8'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="words"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity onPress={handleSearch} className={`ml-2 p-2 rounded-lg ${isDarkMode ? 'bg-primary-dark' : 'bg-primary'}`}>
                <Search size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Al buscar se abrirá tu navegador. Encuentra la canción, copia su URL (dirección) y pégala abajo.
            </Text>
          </View>

          {/* Input de URL */}
          <View className={`p-4 rounded-2xl border mb-6 ${isDarkMode ? 'bg-surface-dark/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
            <Text className={`text-sm font-medium mb-2 uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
              2. Pegar URL de la Canción
            </Text>
            <View className={`flex-row items-center rounded-xl px-4 py-3 border mb-4 ${isDarkMode ? 'bg-background-dark/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <LinkIcon size={20} color="#94a3b8" />
            <TextInput
              className="flex-1 text-white ml-3 text-base"
              placeholder="https://acordes.lacuerda.net/..."
              placeholderTextColor="#64748b"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>

          <Text className="text-slate-300 text-sm font-medium mb-3 uppercase tracking-wider">
            Categoría (Opcional)
          </Text>
          <View className="flex-row gap-2">
            {['Alabanza', 'Adoración', 'Otra'].map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                className={`flex-1 py-2 rounded-lg border items-center ${
                  category === cat ? 'bg-blue-500 border-blue-500' : 'bg-slate-900 border-slate-700'
                }`}
              >
                <Text className={`font-medium ${category === cat ? 'text-white' : 'text-slate-400'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleImport}
          disabled={loading || !url}
          className={`py-4 rounded-xl items-center justify-center flex-row shadow-lg shadow-blue-500/20 ${
            loading || !url ? (isDarkMode ? 'bg-primary-dark/50' : 'bg-primary/50') : (isDarkMode ? 'bg-primary-dark' : 'bg-primary')
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <CheckCircle size={20} color="white" className="mr-2" />
              <Text className="text-white text-lg font-bold">Importar y Guardar</Text>
            </>
          )}
        </TouchableOpacity>

        <View className="mt-8">
          <View className={`p-4 rounded-xl border ${isDarkMode ? 'bg-primary-dark/10 border-primary-dark/20' : 'bg-primary/10 border-primary/20'}`}>
            <Text className={`text-sm leading-relaxed ${isDarkMode ? 'text-primary-dark' : 'text-primary'}`}>
              💡 <Text className="font-bold">Tip de UX:</Text> Es mucho más rápido buscar la canción aquí, abrir tu navegador, copiar el enlace y pegarlo, en lugar de cargar navegadores pesados dentro de la app.
            </Text>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
