import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatArSigned } from '../utils/formatAr';

export type TransactionKind = 'income' | 'expense';

export type TransactionRowData = {
  id: string;
  title: string;
  category: string;
  amount: number;
  kind: TransactionKind;
  dateLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
};

export default function TransactionRow({ title, category, amount, kind, dateLabel, icon, iconColor, iconBg }: TransactionRowData) {
  return (
    <View className="flex-row items-center py-3">
      <View className="w-11 h-11 rounded-full items-center justify-center mr-3" style={{ backgroundColor: iconBg }}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-idealy-text font-semibold text-[15px]">{title}</Text>
        <Text className="text-idealy-muted text-xs mt-0.5">{category}</Text>
      </View>
      <View className="items-end">
        <Text className={kind === 'income' ? 'text-idealy-income font-bold text-[15px]' : 'text-idealy-text font-bold text-[15px]'}>
          {formatArSigned(kind === 'income' ? amount : -amount)}
        </Text>
        <Text className="text-idealy-muted text-xs mt-0.5">{dateLabel}</Text>
      </View>
    </View>
  );
}
