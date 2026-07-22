import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import DashboardScreen from '../screens/DashboardScreen';
import DepensesScreen from '../screens/DepensesScreen';
import BudgetScreen from '../screens/BudgetScreen';
import PlusMenuScreen from '../screens/PlusMenuScreen';
import { IdealyColors } from '../theme/colors';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

// Placeholder screen for the "Ajouter" tab slot — the tab press is
// intercepted below to open the AddTransaction modal instead of navigating here.
function AjouterPlaceholder() {
  return <View />;
}

const TAB_ICONS: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Accueil: 'home-outline',
  Rapports: 'bar-chart-outline',
  Ajouter: 'add',
  Budgets: 'wallet-outline',
  Plus: 'ellipsis-horizontal',
};

const TAB_LABELS: Record<keyof TabParamList, string> = {
  Accueil: 'Accueil',
  Rapports: 'Rapports',
  Ajouter: 'Ajouter',
  Budgets: 'Budgets',
  Plus: 'Plus',
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const rootNavigation = useNavigation<any>();

  return (
    <View className="flex-row bg-white border-t border-black/5 pt-2 pb-6 px-4">
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const name = route.name as keyof TabParamList;

        if (name === 'Ajouter') {
          return (
            <View key={route.key} className="flex-1 items-center -mt-8">
              <Pressable
                onPress={() => rootNavigation.navigate('AddTransaction')}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: IdealyColors.green, borderWidth: 4, borderColor: IdealyColors.goldLight }}
              >
                <Ionicons name="add" size={26} color="white" />
              </Pressable>
              <Text className="text-idealy-muted text-[11px] mt-1">{TAB_LABELS[name]}</Text>
            </View>
          );
        }

        return (
          <Pressable key={route.key} onPress={() => navigation.navigate(route.name)} className="flex-1 items-center pt-1">
            <Ionicons name={TAB_ICONS[name]} size={22} color={focused ? IdealyColors.green : IdealyColors.muted} />
            <Text
              className="text-[11px] mt-1"
              style={{ color: focused ? IdealyColors.green : IdealyColors.muted, fontWeight: focused ? '700' : '400' }}
            >
              {TAB_LABELS[name]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="Accueil" component={DashboardScreen} />
      <Tab.Screen name="Rapports" component={DepensesScreen} />
      <Tab.Screen name="Ajouter" component={AjouterPlaceholder} />
      <Tab.Screen name="Budgets" component={BudgetScreen} />
      <Tab.Screen name="Plus" component={PlusMenuScreen} />
    </Tab.Navigator>
  );
}
