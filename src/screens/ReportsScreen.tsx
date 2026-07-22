import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import BentoCard from '../components/BentoCard';
import ProgressBar from '../components/ProgressBar';
import TrendBarChart from '../components/TrendBarChart';
import TransactionRow from '../components/TransactionRow';
import { IdealyColors } from '../theme/colors';
import { formatAr } from '../utils/formatAr';
import { getCategoryMeta } from '../utils/categoryMeta';
import { PERIOD_LABELS } from '../utils/date';
import type { ReportPeriod } from '../utils/date';
import { useReportsOverview, deleteTransaction } from '../data/hooks/useReportsOverview';
import type Transaction from '../data/database/models/Transaction';

const PERIODS: ReportPeriod[] = ['today', 'week', 'month', 'year'];

export default function ReportsScreen() {
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const { loading, income, expense, net, netChangePercent, categoryBreakdown, trend, transactionGroups } =
    useReportsOverview(period);

  const handleDelete = (tx: Transaction) => {
    Alert.alert('Supprimer la transaction', `Supprimer « ${tx.title} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteTransaction(tx) },
    ]);
  };

  return (
    <View className="flex-1 bg-idealy-bg">
      <Header hasNotification={false} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          {/* Title + period selector */}
          <View className="flex-row items-center justify-between mt-2 mb-4">
            <View>
              <Text className="text-idealy-text text-xl font-bold">Rapports</Text>
              <Text className="text-idealy-muted text-sm mt-0.5">Vue d'ensemble de vos finances</Text>
            </View>
            <Pressable
              className="flex-row items-center bg-white rounded-full px-3 py-2 border border-black/5"
              onPress={() => setPeriod(PERIODS[(PERIODS.indexOf(period) + 1) % PERIODS.length])}
            >
              <Text className="text-idealy-text text-xs font-medium mr-1">{PERIOD_LABELS[period]}</Text>
              <Ionicons name="chevron-down" size={14} color={IdealyColors.text} />
            </Pressable>
          </View>

          {loading ? (
            <View className="items-center py-16">
              <ActivityIndicator color={IdealyColors.green} />
            </View>
          ) : (
            <>
              {/* Summary row */}
              <View className="flex-row flex-wrap justify-between">
                <BentoCard
                  icon="wallet-outline"
                  iconColor={IdealyColors.income}
                  iconBg={IdealyColors.incomeBg}
                  label="Revenus"
                  value={formatAr(income)}
                  sublabel={PERIOD_LABELS[period]}
                />
                <BentoCard
                  icon="arrow-down-circle-outline"
                  iconColor={IdealyColors.expense}
                  iconBg={IdealyColors.expenseBg}
                  label="Dépenses"
                  value={formatAr(expense)}
                  sublabel={PERIOD_LABELS[period]}
                />
                <BentoCard
                  icon="trending-up-outline"
                  iconColor={net >= 0 ? IdealyColors.savings : IdealyColors.expense}
                  iconBg={net >= 0 ? IdealyColors.savingsBg : IdealyColors.expenseBg}
                  label="Épargne nette"
                  value={formatAr(net)}
                  sublabel={PERIOD_LABELS[period]}
                />
              </View>

              {/* Trend */}
              <View className="bg-white rounded-3xl p-5 mt-2 border border-black/5">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-idealy-text font-bold text-base">Flux net</Text>
                  {netChangePercent !== null && (
                    <View
                      className="flex-row items-center rounded-full px-2.5 py-1"
                      style={{ backgroundColor: netChangePercent >= 0 ? IdealyColors.incomeBg : IdealyColors.expenseBg }}
                    >
                      <Ionicons
                        name={netChangePercent >= 0 ? 'arrow-up' : 'arrow-down'}
                        size={11}
                        color={netChangePercent >= 0 ? IdealyColors.income : IdealyColors.expense}
                      />
                      <Text
                        className="text-[11px] font-semibold ml-1"
                        style={{ color: netChangePercent >= 0 ? IdealyColors.income : IdealyColors.expense }}
                      >
                        {Math.abs(netChangePercent)}% vs période précédente
                      </Text>
                    </View>
                  )}
                </View>
                {trend.length > 0 ? (
                  <TrendBarChart data={trend} />
                ) : (
                  <Text className="text-idealy-muted text-xs py-6 text-center">Pas encore de données pour cette période</Text>
                )}
              </View>

              {/* Category breakdown */}
              <View className="bg-white rounded-3xl p-5 mt-5 border border-black/5">
                <Text className="text-idealy-text font-bold text-base mb-4">Dépenses par catégorie</Text>
                {categoryBreakdown.length === 0 ? (
                  <Text className="text-idealy-muted text-xs text-center py-4">Aucune dépense sur cette période</Text>
                ) : (
                  categoryBreakdown.map((entry, index) => {
                    const meta = getCategoryMeta(entry.category, 'expense');
                    return (
                      <View key={entry.category} className={index > 0 ? 'mt-4' : ''}>
                        <View className="flex-row items-center justify-between mb-1.5">
                          <View className="flex-row items-center">
                            <Ionicons name={meta.icon} size={14} color={meta.color} />
                            <Text className="text-idealy-text text-sm font-semibold ml-2">{entry.category}</Text>
                          </View>
                          <Text className="text-idealy-text text-sm font-bold">
                            {formatAr(entry.amount)}{' '}
                            <Text className="text-idealy-muted text-xs font-normal">({entry.percent.toFixed(0)}%)</Text>
                          </Text>
                        </View>
                        <ProgressBar percent={entry.percent} color={meta.color} />
                      </View>
                    );
                  })
                )}
              </View>

              {/* Transactions */}
              <View className="bg-white rounded-3xl p-5 mt-5 border border-black/5">
                <Text className="text-idealy-text font-bold text-base">Transactions</Text>
                {transactionGroups.length === 0 ? (
                  <Text className="text-idealy-muted text-xs text-center py-6">Aucune transaction sur cette période</Text>
                ) : (
                  <>
                    <Text className="text-idealy-muted text-[11px] mt-0.5 mb-1">Appui long pour supprimer</Text>
                    {transactionGroups.map((group) => (
                      <View key={group.dateLabel} className="mt-3">
                        <Text className="text-idealy-muted text-[11px] font-semibold uppercase mb-1">{group.dateLabel}</Text>
                        {group.items.map((tx, index) => {
                          const meta = getCategoryMeta(tx.category, tx.kind);
                          return (
                            <Pressable
                              key={tx.id}
                              onLongPress={() => handleDelete(tx)}
                              delayLongPress={400}
                              className={index > 0 ? 'border-t border-black/5' : ''}
                            >
                              <TransactionRow
                                id={tx.id}
                                title={tx.title}
                                category={tx.category}
                                amount={tx.amount}
                                kind={tx.kind}
                                dateLabel={tx.occurredAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                icon={meta.icon}
                                iconColor={meta.color}
                                iconBg={meta.bg}
                              />
                            </Pressable>
                          );
                        })}
                      </View>
                    ))}
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
