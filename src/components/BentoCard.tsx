import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BentoCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  sublabel: string;
  onPress?: () => void;
};

export default function BentoCard({ icon, iconColor, iconBg, label, value, sublabel, onPress }: BentoCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[48%] rounded-3xl p-4 mb-3 border border-black/5"
      style={{ backgroundColor: iconBg }}
    >
      <View className="w-9 h-9 rounded-full bg-white/60 items-center justify-center mb-2">
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text className="text-idealy-muted text-xs mb-1">{label}</Text>
      <Text className="text-idealy-text text-xl font-bold mb-1">{value}</Text>
      <Text className="text-idealy-muted text-xs">{sublabel}</Text>
    </Pressable>
  );
}
