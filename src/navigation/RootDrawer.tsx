import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import BottomTabs from './BottomTabs';
import RevenusScreen from '../screens/RevenusScreen';
import BazaryScreen from '../screens/BazaryScreen';
import AICopilotScreen from '../screens/AICopilotScreen';
import WelcomeBackScreen from '../screens/WelcomeBackScreen';
import Logo from '../components/Logo';
import { IdealyColors } from '../theme/colors';
import type { DrawerParamList } from './types';

const Drawer = createDrawerNavigator<DrawerParamList>();

type DrawerLink = {
  route: keyof DrawerParamList;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const LINKS: DrawerLink[] = [
  { route: 'Tabs', label: 'Accueil', icon: 'home-outline' },
  { route: 'Revenus', label: 'Revenus', icon: 'wallet-outline' },
  { route: 'Bazary', label: 'Bazary', icon: 'basket-outline' },
  { route: 'AICopilot', label: 'AI Copilot', icon: 'sparkles-outline' },
  { route: 'WelcomeBack', label: 'Sécurité (PIN)', icon: 'lock-closed-outline' },
];

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const activeRoute = props.state.routes[props.state.index]?.name;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      <View className="items-center py-8 border-b border-black/5 mb-3">
        <Logo size={64} />
        <Text className="text-idealy-green text-lg font-extrabold mt-2">Idealy</Text>
        <Text className="text-idealy-muted text-xs">Firindram_piainana</Text>
      </View>

      <View className="px-2">
        {LINKS.map((link) => {
          const focused = activeRoute === link.route;
          return (
            <Pressable
              key={link.route}
              onPress={() => props.navigation.navigate(link.route)}
              className="flex-row items-center rounded-2xl px-4 py-3 mb-1"
              style={{ backgroundColor: focused ? IdealyColors.incomeBg : 'transparent' }}
            >
              <Ionicons name={link.icon} size={20} color={focused ? IdealyColors.green : IdealyColors.muted} />
              <Text
                className="ml-3 text-sm"
                style={{ color: focused ? IdealyColors.green : IdealyColors.muted, fontWeight: focused ? '700' : '500' }}
              >
                {link.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}

export default function RootDrawer() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Tabs" component={BottomTabs} />
      <Drawer.Screen name="Revenus" component={RevenusScreen} />
      <Drawer.Screen name="Bazary" component={BazaryScreen} />
      <Drawer.Screen name="AICopilot" component={AICopilotScreen} />
      <Drawer.Screen name="WelcomeBack" component={WelcomeBackScreen} />
    </Drawer.Navigator>
  );
}
