import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download, Link as LinkIcon, CheckCircle } from 'lucide-react-native';
import { scrapeSongFromUrl } from '../services/scraperService';
import { useAppStore } from '../store/useAppStore';

export default function ImportScreen({ navigation }: any) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const addCustomSong = useAppStore((state) => state.addCustomSong);

  const handleImport = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Por favor ingresa una URL válida');
      return;
    }

    setLoading(true);
    const result = await scrapeSongFromUrl(url.trim());
    setLoading(false);

    if (result.success && result.lyrics) {
      addCustomSong(result);
      Alert.alert(
        '¡Éxito!',
        `Se ha importado la canción: ${result.title}`,
        [
          { 
            text: 'Ver Canción', 
            onPress: () => navigation.navigate('HymnDetail', { 
              hymn: { id: result.title, title: result.title, lyrics: result.lyrics, category: 'Importada' }, 
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
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="p-6 flex-1">
        <View className="mb-8 items-center">
          <View className="w-16 h-16 bg-blue-500/20 rounded-full items-center justify-center mb-4">
            <Download size={32} color="#3b82f6" />
          </View>
          <Text className="text-2xl font-bold text-white text-center mb-2">Importar Canción</Text>
          <Text className="text-slate-400 text-center text-base">
            Pega el enlace de una página con acordes (ej. LaCuerda) para guardarla offline en tu dispositivo.
          </Text>
        </View>

        <View className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 mb-6">
          <Text className="text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">
            URL de la Canción
          </Text>
          <View className="flex-row items-center bg-slate-900/50 rounded-xl px-4 py-3 border border-slate-700">
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
        </View>

        <TouchableOpacity
          onPress={handleImport}
          disabled={loading || !url}
          className={`py-4 rounded-xl items-center justify-center flex-row shadow-lg shadow-blue-500/20 ${
            loading || !url ? 'bg-blue-500/50' : 'bg-blue-500'
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

        <View className="mt-auto">
          <View className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
            <Text className="text-blue-200 text-sm leading-relaxed">
              💡 <Text className="font-bold">Tip de UX:</Text> Es mucho más rápido buscar la canción en tu navegador (Chrome/Safari), copiar el enlace y pegarlo aquí, en lugar de cargar navegadores pesados dentro de la app.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
