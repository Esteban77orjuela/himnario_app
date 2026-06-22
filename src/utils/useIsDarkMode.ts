import { useColorScheme } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export function isDarkMode(theme: string, systemScheme: string | null | undefined): boolean {
  if (theme === 'system') {
    return systemScheme === 'dark';
  }
  return theme === 'dark';
}

export function useIsDarkMode(): boolean {
  const theme = useAppStore((state) => state.theme);
  const systemScheme = useColorScheme();
  return isDarkMode(theme, systemScheme);
}
