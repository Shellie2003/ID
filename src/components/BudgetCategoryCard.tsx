import { Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ProgressBar from './ProgressBar';
import { IdealyColors } from '../theme/colors';
import { formatAr } from '../utils/formatAr';
import { getCategoryMeta } from '../utils/categoryMeta';
import type { CategoryBudgetInfo } from '../data/hooks/useBudgetOverview';

type BudgetCategoryCardProps = {
  info: CategoryBudgetInfo;
  onToggleRollover: () => void;
};

export default function BudgetCategoryCard({ info, onToggleRollover }: BudgetCategoryCardProps) {
  const { envelope, totalDepense, pourcentage } = info;
  const meta = getCategoryMeta(envelope.category);

  const remaining = Math.max(envelope.limitAmount - totalDepense, 0);
  const overAmount = Math.max(totalDepense - envelope.limitAmount, 0);
  const isOver = pourcentage >= 100;
  const isWarning = pourcentage >= 80 && !isOver;

  const statusColor = isOver ? IdealyColors.expense : isWarning ? '#D97706' : IdealyColors.green;

  return (
    <View
      className="bg-white rounded-3xl p-5 mb-3"
      style={{
        borderWidth: isOver ? 1.5 : 1,
        borderColor: isOver ? 'rgba(225,29,72,0.4)' : 'rgba(0,0,0,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-3">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
            style={{ backgroundColor: `${statusColor}1A` }}
          >
            <Ionicons name={meta.icon} size={22} color={statusColor} />
          </View>
          <View className="flex-1">
            <Text className="text-idealy-text font-bold text-base" numberOfLines={1}>
              {envelope.name}
            </Text>
            <Text className="text-idealy-muted text-xs" numberOfLines={1}>
              {meta.subtitle}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="font-extrabold text-base" style={{ color: isOver ? IdealyColors.expense : IdealyColors.text }}>
            {formatAr(totalDepense)}
          </Text>
          <Text className="text-idealy-muted text-xs">de {formatAr(envelope.limitAmount)}</Text>
        </View>
      </View>

      <View className="mt-4">
        <ProgressBar percent={pourcentage} color={statusColor} />
      </View>

      {/* Stats row */}
      <View className="flex-row justify-between bg-idealy-bg rounded-2xl mt-4 p-3">
        <View className="flex-row items-center flex-1">
          <Ionicons name="trending-up-outline" size={16} color={statusColor} />
          <View className="ml-2">
            <Text className="text-idealy-muted text-[10px]">Dépensé</Text>
            <Text className="text-idealy-text text-xs font-bold">{pourcentage.toFixed(1)}%</Text>
          </View>
        </View>
        <View className="flex-row items-center flex-1">
          <Ionicons
            name={isOver ? 'alert-circle-outline' : isWarning ? 'warning-outline' : 'checkmark-circle-outline'}
            size={16}
            color={statusColor}
          />
          <View className="ml-2">
            <Text className="text-idealy-muted text-[10px]">État</Text>
            <Text className="text-xs font-bold" style={{ color: statusColor }}>
              {isOver ? 'Dépassé' : isWarning ? 'Alerte' : 'Correct'}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center flex-1">
          <Ionicons name="wallet-outline" size={16} color={isOver ? IdealyColors.expense : IdealyColors.green} />
          <View className="ml-2">
            <Text className="text-idealy-muted text-[10px]">{isOver ? 'Dépassement' : 'Disponible'}</Text>
            <Text className="text-xs font-bold" style={{ color: isOver ? IdealyColors.expense : IdealyColors.green }}>
              {formatAr(isOver ? overAmount : remaining)}
            </Text>
          </View>
        </View>
      </View>

      {/* Warning banners */}
      {isOver && (
        <View className="flex-row items-center bg-idealy-expense-bg rounded-xl px-3 py-2 mt-3">
          <Ionicons name="alert-circle" size={16} color={IdealyColors.expense} />
          <Text className="text-idealy-expense text-xs font-bold ml-2 flex-1">
            Alerte : dépassement de budget de {formatAr(overAmount)}
          </Text>
        </View>
      )}
      {isWarning && (
        <View className="flex-row items-center rounded-xl px-3 py-2 mt-3" style={{ backgroundColor: '#FEF3C7' }}>
          <Ionicons name="warning" size={16} color="#D97706" />
          <Text className="text-xs font-bold ml-2 flex-1" style={{ color: '#B45309' }}>
            Proche de la limite ! Reste : {formatAr(remaining)}
          </Text>
        </View>
      )}

      {/* Rollover toggle */}
      <View className="h-px bg-black/5 mt-4 mb-3" />
      <Pressable className="flex-row items-center justify-between" onPress={onToggleRollover}>
        <View className="flex-row items-center flex-1 mr-2">
          <Ionicons
            name="sync-outline"
            size={16}
            color={envelope.rolloverEnabled ? IdealyColors.green : IdealyColors.muted}
          />
          <Text
            className="text-xs ml-2"
            style={{ color: envelope.rolloverEnabled ? IdealyColors.text : IdealyColors.muted }}
          >
            Reporter le solde non utilisé
          </Text>
        </View>
        <Switch
          value={envelope.rolloverEnabled}
          onValueChange={onToggleRollover}
          trackColor={{ false: '#E9ECEF', true: IdealyColors.green }}
          thumbColor="white"
        />
      </Pressable>
    </View>
  );
}
