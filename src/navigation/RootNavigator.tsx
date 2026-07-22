import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RootDrawer from './RootDrawer';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Drawer" component={RootDrawer} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
