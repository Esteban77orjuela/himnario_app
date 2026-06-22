import { useColorScheme } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export function useIsDarkMode(): boolean {
  const theme = useAppStore((state) => state.theme);
  const systemScheme = useColorScheme();

  if (theme === 'system') {
    return systemScheme === 'dark';
  }
  return theme === 'dark';
}
