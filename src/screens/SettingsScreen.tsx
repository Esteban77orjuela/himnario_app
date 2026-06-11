import { View, Text } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function SettingsScreen() {
  const isDarkMode = useAppStore((state) => state.theme === 'dark');

  return (
    <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-background-dark' : 'bg-background'}`}>
      <Text className={`font-serif text-2xl ${isDarkMode ? 'text-text-dark' : 'text-text'}`}>
        Ajustes
      </Text>
    </View>
  );
}
