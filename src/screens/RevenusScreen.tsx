import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import TransactionRow from '../components/TransactionRow';
import { IdealyColors } from '../theme/colors';
import { formatAr } from '../utils/formatAr';
import { getCategoryMeta } from '../utils/categoryMeta';
import { PERIOD_LABELS } from '../utils/date';
import type { ReportPeriod } from '../utils/date';
import { useIncomeOverview } from '../data/hooks/useIncomeOverview';
import { createTransaction } from '../data/hooks/useReportsOverview';

const PERIODS: ReportPeriod[] = ['today', 'week', 'month', 'year'];

export default function RevenusScreen() {
  const navigation = useNavigation<any>();
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const { loading, total, byCategory, recent, salaireMensuel, salaireLoggedThisMonth } = useIncomeOverview(period);
  const [logging, setLogging] = useState(false);

  const handleLogSalaire = async () => {
    if (!salaireMensuel) {
      Alert.alert('Salaire non configuré', 'Renseignez votre salaire mensuel dans Réglages → Compte pour pouvoir l’enregistrer en un geste.');
      return;
    }
    setLogging(true);
    try {
      await createTransaction({ kind: 'income', amount: salaireMensuel, title: 'Salaire', category: 'Salaire' });
    } finally {
      setLogging(false);
    }
  };

  return (
    <View className="flex-1 bg-idealy-bg">
      <Header hasNotification={false} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          <View className="flex-row items-center justify-between mt-2 mb-4">
            <View>
              <Text className="text-idealy-text text-xl font-bold">Revenus</Text>
              <Text className="text-idealy-muted text-sm mt-0.5">Salaire, business, freelance & bonus</Text>
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
              {/* Total card */}
              <View className="rounded-3xl p-6" style={{ backgroundColor: IdealyColors.green }}>
                <Text className="text-idealy-gold-light text-xs font-bold tracking-widest">REVENUS TOTAUX</Text>
                <Text className="text-white text-4xl font-extrabold mt-2">{formatAr(total)}</Text>
                <Text className="text-white/60 text-xs mt-1">{PERIOD_LABELS[period]}</Text>
              </View>

              {/* Salaire mensuel */}
              <View className="bg-white rounded-3xl p-5 mt-5 border border-black/5">
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center">
                    <View className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: IdealyColors.incomeBg }}>
                      <Ionicons name="cash" size={17} color={IdealyColors.green} />
                    </View>
                    <View>
                      <Text className="text-idealy-text font-bold text-sm">Salaire mensuel</Text>
                      <Text className="text-idealy-muted text-xs">{formatAr(salaireMensuel)} configuré</Text>
                    </View>
                  </View>
                </View>
                <Pressable
                  onPress={handleLogSalaire}
                  disabled={logging || salaireLoggedThisMonth}
                  className="rounded-xl py-3 items-center mt-3"
                  style={{
                    backgroundColor: salaireLoggedThisMonth ? IdealyColors.bg : IdealyColors.green,
                    opacity: logging ? 0.6 : 1,
                  }}
                >
                  <Text className="font-bold text-sm" style={{ color: salaireLoggedThisMonth ? IdealyColors.muted : 'white' }}>
                    {salaireLoggedThisMonth ? 'Salaire déjà enregistré ce mois-ci' : 'Enregistrer le salaire de ce mois'}
                  </Text>
                </Pressable>
              </View>

              {/* Breakdown */}
              <View className="bg-white rounded-3xl p-5 mt-5 border border-black/5">
                <Text className="text-idealy-text font-bold text-base mb-4">Revenus par catégorie</Text>
                {byCategory.length === 0 ? (
                  <Text className="text-idealy-muted text-xs text-center py-4">Aucun revenu sur cette période</Text>
                ) : (
                  byCategory.map((entry, index) => {
                    const meta = getCategoryMeta(entry.category, 'income');
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

              {/* Recent income */}
              <View className="bg-white rounded-3xl p-5 mt-5 border border-black/5">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-idealy-text font-bold text-base">Revenus récents</Text>
                  <Pressable onPress={() => navigation.navigate('AddTransaction')}>
                    <Ionicons name="add-circle-outline" size={22} color={IdealyColors.green} />
                  </Pressable>
                </View>
                {recent.length === 0 ? (
                  <Text className="text-idealy-muted text-xs text-center py-6">Aucun revenu enregistré sur cette période</Text>
                ) : (
                  recent.map((tx, index) => {
                    const meta = getCategoryMeta(tx.category, 'income');
                    return (
                      <View key={tx.id} className={index > 0 ? 'border-t border-black/5' : ''}>
                        <TransactionRow
                          id={tx.id}
                          title={tx.title}
                          category={tx.category}
                          amount={tx.amount}
                          kind={tx.kind}
                          dateLabel={tx.occurredAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          icon={meta.icon}
                          iconColor={meta.color}
                          iconBg={meta.bg}
                        />
                      </View>
                    );
                  })
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
