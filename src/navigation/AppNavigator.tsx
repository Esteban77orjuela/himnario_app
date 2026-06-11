import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import HymnDetailScreen from '../screens/HymnDetailScreen';

export type RootStackParamList = {
  Main: undefined;
  HymnDetail: { hymnId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="HymnDetail" component={HymnDetailScreen} />
    </Stack.Navigator>
  );
}
