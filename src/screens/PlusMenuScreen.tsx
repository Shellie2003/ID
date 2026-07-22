import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { IdealyColors } from '../theme/colors';

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  route: string;
};

const ITEMS: MenuItem[] = [
  { label: 'Revenus', icon: 'wallet-outline', color: IdealyColors.income, bg: IdealyColors.incomeBg, route: 'Revenus' },
  { label: 'Bazary', icon: 'basket-outline', color: IdealyColors.bazary, bg: IdealyColors.bazaryBg, route: 'Bazary' },
  { label: 'AI Copilot', icon: 'sparkles-outline', color: IdealyColors.ai, bg: IdealyColors.aiBg, route: 'AICopilot' },
  { label: 'Sécurité (PIN)', icon: 'lock-closed-outline', color: IdealyColors.green, bg: IdealyColors.incomeBg, route: 'WelcomeBack' },
];

export default function PlusMenuScreen() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-idealy-bg">
      <Header hasNotification={false} />
      <View className="px-5 mt-2">
        <Text className="text-idealy-text text-lg font-bold mb-4">Plus</Text>
        {ITEMS.map((item) => (
          <Pressable
            key={item.route}
            onPress={() => navigation.navigate(item.route)}
            className="flex-row items-center bg-white rounded-2xl p-4 mb-3 border border-black/5"
          >
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: item.bg }}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <Text className="flex-1 text-idealy-text font-semibold">{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={IdealyColors.muted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
