import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import HymnDetailScreen from '../screens/HymnDetailScreen';
import SetlistDetailScreen from '../screens/SetlistDetailScreen';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="HymnDetail" component={HymnDetailScreen} />
      <Stack.Screen name="SetlistDetail" component={SetlistDetailScreen} />
    </Stack.Navigator>
  );
}
