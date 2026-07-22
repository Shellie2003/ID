import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import BudgetCategoryCard from '../components/BudgetCategoryCard';
import { IdealyColors } from '../theme/colors';
import { formatAr } from '../utils/formatAr';
import { useBudgetOverview, toggleEnvelopeRollover } from '../data/hooks/useBudgetOverview';

const MONTH_LABEL = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date());

export default function BudgetScreen() {
  const navigation = useNavigation<any>();
  const { categories, loading } = useBudgetOverview();

  const totalBudget = categories.reduce((sum, c) => sum + c.envelope.limitAmount, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.totalDepense, 0);
  const availableToAllocate = Math.max(totalBudget - totalSpent, 0);

  return (
    <View className="flex-1 bg-idealy-bg">
      <Header hasNotification={false} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          {/* Create budget CTA */}
          <Pressable
            onPress={() => navigation.navigate('AddBudget')}
            className="flex-row items-center justify-center rounded-2xl py-4 mt-2"
            style={{ backgroundColor: IdealyColors.green }}
          >
            <Ionicons name="add-circle" size={22} color="white" />
            <Text className="text-white font-extrabold text-sm ml-2" style={{ letterSpacing: 1 }}>
              CRÉER UN NOUVEAU BUDGET
            </Text>
          </Pressable>

          {/* Section header */}
          <View className="flex-row items-end justify-between mt-6 mb-3">
            <Text className="text-idealy-text font-bold text-base">Enveloppes actives</Text>
            <Text className="text-idealy-green text-xs font-bold capitalize">Vue {MONTH_LABEL}</Text>
          </View>

          {loading ? (
            <View className="items-center py-10">
              <ActivityIndicator color={IdealyColors.green} />
            </View>
          ) : categories.length === 0 ? (
            <View className="bg-white rounded-3xl p-6 items-center border border-black/5">
              <View className="w-16 h-16 rounded-full items-center justify-center mb-3" style={{ backgroundColor: IdealyColors.budgetsBg }}>
                <Ionicons name="pie-chart-outline" size={28} color={IdealyColors.budgets} />
              </View>
              <Text className="text-idealy-text font-bold text-base mb-1">Aucun budget actif</Text>
              <Text className="text-idealy-muted text-sm text-center">
                Créez une enveloppe budgétaire pour commencer à suivre vos dépenses.
              </Text>
            </View>
          ) : (
            categories.map((info) => (
              <BudgetCategoryCard
                key={info.envelope.id}
                info={info}
                onToggleRollover={() => toggleEnvelopeRollover(info.envelope)}
              />
            ))
          )}

          {/* Insights */}
          {categories.length > 0 && (
            <View className="mt-3">
              <Text className="text-idealy-text font-bold text-base mb-3">Analyses & Aperçu</Text>
              <View className="flex-row" style={{ gap: 16 }}>
                <View
                  className="flex-1 rounded-3xl p-4 border border-black/5 overflow-hidden"
                  style={{ backgroundColor: '#F2F4F1', height: 120 }}
                >
                  <View
                    className="absolute rounded-full"
                    style={{ width: 64, height: 64, right: -16, bottom: -16, backgroundColor: `${IdealyColors.green}0D` }}
                  />
                  <View className="flex-1 justify-between">
                    <Ionicons name="trending-up" size={22} color={IdealyColors.green} />
                    <View>
                      <Text className="text-idealy-muted text-[11px]">Total dépensé</Text>
                      <Text className="text-idealy-text font-extrabold text-base">{formatAr(totalSpent)}</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-1 rounded-3xl p-4" style={{ backgroundColor: IdealyColors.green, height: 120 }}>
                  <View className="flex-1 justify-between">
                    <Ionicons name="wallet" size={22} color="white" />
                    <View>
                      <Text className="text-white/70 text-[11px]">Reste disponible</Text>
                      <Text className="text-white font-extrabold text-base">{formatAr(availableToAllocate)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
