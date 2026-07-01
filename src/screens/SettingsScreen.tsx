import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { useIsDarkMode } from '../utils/useIsDarkMode';
import { Moon, Sun, DownloadCloud, UploadCloud, Info, Type } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { logger } from '../utils/logger';

export default function SettingsScreen() {
  const isDarkMode = useIsDarkMode();
  const setTheme = useAppStore((state) => state.setTheme);
  const restoreBackup = useAppStore((state) => state.restoreBackup);
  const fontFamily = useAppStore((state) => state.fontFamily);
  const setFontFamily = useAppStore((state) => state.setFontFamily);

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const handleExportBackup = async () => {
    try {
      const state = useAppStore.getState();
      const backupData = {
        backupVersion: 1,
        customSongs: state.customSongs,
        favorites: state.favorites,
        setlists: state.setlists,
        categoryOverrides: state.categoryOverrides,
        songBPMs: state.songBPMs,
        songNotes: state.songNotes,
        songPlayCount: state.songPlayCount,
        songKeys: state.songKeys,
        theme: state.theme,
        fontFamily: state.fontFamily,
        fontSize: state.fontSize,
        timestamp: new Date().toISOString(),
      };

      const fileUri = FileSystem.documentDirectory + 'himnario_backup.json';
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2));
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Guardar copia de seguridad',
        });
      } else {
        Alert.alert('Error', 'No se puede compartir el archivo en este dispositivo');
      }
    } catch (error) {
      logger.error('Error al exportar backup', error);
      Alert.alert('Error', 'No se pudo crear la copia de seguridad');
    }
  };

  const handleImportBackup = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const backupData = JSON.parse(fileContent);

      const hasValidBackupShape =
        backupData.customSongs ||
        backupData.favorites ||
        backupData.setlists ||
        backupData.songNotes ||
        backupData.songPlayCount ||
        backupData.songKeys ||
        backupData.theme ||
        backupData.fontFamily ||
        backupData.fontSize;

      if (hasValidBackupShape) {
        restoreBackup(backupData);
        Alert.alert('¡Éxito!', 'Copia de seguridad restaurada correctamente');
      } else {
        Alert.alert('Archivo Inválido', 'El archivo seleccionado no tiene el formato correcto');
      }
    } catch (error) {
      logger.error('Error al importar backup', error);
      Alert.alert('Error', 'No se pudo leer el archivo de copia de seguridad');
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <View className="px-6 pt-6 pb-4">
        <Text className={`text-4xl font-serif font-bold tracking-tight ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
          Ajustes
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="mt-4 mb-8">
          <Text className={`text-sm font-bold mb-4 ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>APARIENCIA</Text>
          <View className={`rounded-3xl border ${isDarkMode ? 'bg-surface-dark border-white/5' : 'bg-white border-slate-100'} p-1`}>
            <View className={`flex-row items-center justify-between p-4`}>
              <View className="flex-row items-center">
                <View className={`p-2 rounded-xl mr-4 ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
                  {isDarkMode ? <Moon color="#818CF8" size={24} /> : <Sun color="#4F46E5" size={24} />}
                </View>
                <Text className={`font-bold text-lg ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>Modo Oscuro</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#cbd5e1', true: '#818CF8' }}
                thumbColor={isDarkMode ? '#ffffff' : '#ffffff'}
              />
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className={`text-sm font-bold mb-4 ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>TIPOGRAFÍA (LETRAS)</Text>
          <View className={`rounded-3xl border ${isDarkMode ? 'bg-surface-dark border-white/5' : 'bg-white border-slate-100'} p-4`}>
            <View className={`flex-row items-center mb-4`}>
              <View className={`p-2 rounded-xl mr-4 ${isDarkMode ? 'bg-fuchsia-500/20' : 'bg-fuchsia-50'}`}>
                <Type color={isDarkMode ? '#E879F9' : '#C026D3'} size={24} />
              </View>
              <Text className={`font-bold text-lg ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>Estilo de Fuente</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity 
                onPress={() => setFontFamily('sans')}
                className={`flex-1 py-3 items-center rounded-xl border ${fontFamily === 'sans' ? (isDarkMode ? 'bg-fuchsia-500 border-fuchsia-500' : 'bg-fuchsia-600 border-fuchsia-600') : (isDarkMode ? 'border-slate-700 bg-background-dark' : 'border-slate-200 bg-slate-50')} mr-2`}
              >
                <Text className={`font-sans font-bold ${fontFamily === 'sans' ? 'text-white' : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}>Moderna</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setFontFamily('serif')}
                className={`flex-1 py-3 items-center rounded-xl border ${fontFamily === 'serif' ? (isDarkMode ? 'bg-fuchsia-500 border-fuchsia-500' : 'bg-fuchsia-600 border-fuchsia-600') : (isDarkMode ? 'border-slate-700 bg-background-dark' : 'border-slate-200 bg-slate-50')} mr-2`}
              >
                <Text className={`font-serif font-bold ${fontFamily === 'serif' ? 'text-white' : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}>Clásica</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setFontFamily('mono')}
                className={`flex-1 py-3 items-center rounded-xl border ${fontFamily === 'mono' ? (isDarkMode ? 'bg-fuchsia-500 border-fuchsia-500' : 'bg-fuchsia-600 border-fuchsia-600') : (isDarkMode ? 'border-slate-700 bg-background-dark' : 'border-slate-200 bg-slate-50')}`}
              >
                <Text className={`font-mono font-bold ${fontFamily === 'mono' ? 'text-white' : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}>Exacta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className={`text-sm font-bold mb-4 ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>COPIA DE SEGURIDAD (BACKUP)</Text>
          <View className={`rounded-3xl border ${isDarkMode ? 'bg-surface-dark border-white/5' : 'bg-white border-slate-100'} p-1 overflow-hidden`}>
            
            <TouchableOpacity onPress={handleExportBackup} className="flex-row items-center p-4 border-b border-slate-100 dark:border-slate-800">
              <View className={`p-2 rounded-xl mr-4 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50'}`}>
                <UploadCloud color={isDarkMode ? '#34D399' : '#10B981'} size={24} />
              </View>
              <View className="flex-1">
                <Text className={`font-bold text-lg ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>Exportar Biblioteca</Text>
                <Text className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Guarda tus listas y canciones en un archivo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleImportBackup} className="flex-row items-center p-4">
              <View className={`p-2 rounded-xl mr-4 ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-50'}`}>
                <DownloadCloud color={isDarkMode ? '#FDBA74' : '#F97316'} size={24} />
              </View>
              <View className="flex-1">
                <Text className={`font-bold text-lg ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>Importar Biblioteca</Text>
                <Text className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Restaura una copia de seguridad anterior</Text>
              </View>
            </TouchableOpacity>
            
          </View>
          <View className="flex-row items-center mt-3 ml-2 px-2">
            <Info color={isDarkMode ? '#94A3B8' : '#64748B'} size={14} />
            <Text className={`text-xs ml-2 flex-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Puedes guardar el archivo exportado en Google Drive, enviarlo por WhatsApp o correo para no perder nunca tu repertorio.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
