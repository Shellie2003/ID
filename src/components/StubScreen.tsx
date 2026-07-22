import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from './Header';
import { IdealyColors } from '../theme/colors';

type StubScreenProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  accentColor?: string;
  accentBg?: string;
  showHeader?: boolean;
};

export default function StubScreen({
  icon,
  title,
  description,
  accentColor = IdealyColors.green,
  accentBg = IdealyColors.incomeBg,
  showHeader = true,
}: StubScreenProps) {
  return (
    <View className="flex-1 bg-idealy-bg">
      {showHeader && <Header hasNotification={false} />}
      <View className="flex-1 items-center justify-center px-10">
        <View className="w-20 h-20 rounded-full items-center justify-center mb-5" style={{ backgroundColor: accentBg }}>
          <Ionicons name={icon} size={34} color={accentColor} />
        </View>
        <Text className="text-idealy-text text-lg font-bold text-center mb-2">{title}</Text>
        <Text className="text-idealy-muted text-sm text-center">{description}</Text>
      </View>
    </View>
  );
}
