import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Home, Heart, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { MotiView } from 'moti';

// Screens
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const isDarkMode = useAppStore((s) => s.theme === 'dark');

  const activeColor = isDarkMode ? '#A78BFA' : '#4F46E5'; // accent.dark : primary
  const inactiveColor = isDarkMode ? '#9CA3AF' : '#6B7280'; // muted.dark : muted

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <BlurView
        intensity={isDarkMode ? 30 : 60}
        tint={isDarkMode ? 'dark' : 'light'}
        style={styles.blurContainer}
        className="overflow-hidden rounded-full border border-white/10"
      >
        <View className="flex-row items-center justify-around w-full px-4 py-3">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const IconComponent = 
              route.name === 'Inicio' ? Home :
              route.name === 'Favoritos' ? Heart : Settings;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                style={styles.tabButton}
                activeOpacity={0.7}
              >
                <MotiView
                  animate={{
                    scale: isFocused ? 1.1 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={`p-3 rounded-full ${isFocused ? (isDarkMode ? 'bg-white/10' : 'bg-black/5') : 'bg-transparent'}`}
                >
                  <IconComponent
                    color={isFocused ? activeColor : inactiveColor}
                    size={24}
                    strokeWidth={isFocused ? 2.5 : 2}
                  />
                </MotiView>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} />
      <Tab.Screen name="Ajustes" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  blurContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 400, // Maximum width for tablets
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
