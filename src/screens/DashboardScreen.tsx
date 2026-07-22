import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import BentoCard from '../components/BentoCard';
import ProgressGauge from '../components/ProgressGauge';
import TransactionRow from '../components/TransactionRow';
import Logo from '../components/Logo';
import { IdealyColors } from '../theme/colors';
import { formatAr } from '../utils/formatAr';
import { getCategoryMeta } from '../utils/categoryMeta';
import { PERIOD_LABELS } from '../utils/date';
import type { ReportPeriod } from '../utils/date';
import { DEFAULT_PROFILE, getSalaireMensuel, getUserProfile } from '../utils/settingsStore';
import { useReportsOverview, useRecentTransactions } from '../data/hooks/useReportsOverview';
import { useBudgetOverview } from '../data/hooks/useBudgetOverview';
import { useBazaryList } from '../data/hooks/useBazaryList';
import { useInsights } from '../data/hooks/useInsights';

const PERIODS: ReportPeriod[] = ['today', 'week', 'month', 'year'];

function formatK(amount: number) {
  return `${Math.round(amount / 1000)}k`;
}

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [userName, setUserName] = useState(DEFAULT_PROFILE.userName);
  const [salaireMensuel, setSalaireMensuel] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getUserProfile().then((profile) => setUserName(profile.userName));
      getSalaireMensuel().then(setSalaireMensuel);
    }, [])
  );

  const reports = useReportsOverview(period);
  const budgets = useBudgetOverview();
  const bazary = useBazaryList();
  const insights = useInsights();
  const { transactions: recentTransactions } = useRecentTransactions(6);

  const budgetGoal = budgets.categories.reduce((sum, c) => sum + c.envelope.limitAmount, 0);
  const incomePercent = salaireMensuel > 0 ? Math.round((reports.income / salaireMensuel) * 100) : 0;
  const expensePercent = budgetGoal > 0 ? Math.round((reports.expense / budgetGoal) * 100) : 0;
  const savingsPercent = reports.income > 0 ? Math.round((reports.net / reports.income) * 100) : 0;

  return (
    <View className="flex-1 bg-idealy-bg">
      <Header />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          <View className="flex-row items-center justify-between mt-2 mb-4">
            <View>
              <Text className="text-idealy-text text-xl font-bold">
                Bonjour <Text className="font-extrabold">{userName}</Text> !
              </Text>
              <Text className="text-idealy-muted text-sm mt-0.5">Voici un aperçu de vos finances</Text>
            </View>
            <Pressable
              className="flex-row items-center bg-white rounded-full px-3 py-2 border border-black/5"
              onPress={() => setPeriod(PERIODS[(PERIODS.indexOf(period) + 1) % PERIODS.length])}
            >
              <Text className="text-idealy-text text-xs font-medium mr-1">{PERIOD_LABELS[period]}</Text>
              <Ionicons name="chevron-down" size={14} color={IdealyColors.text} />
            </Pressable>
          </View>

          {/* Balance card */}
          <View
            style={{
              borderRadius: 28,
              shadowColor: IdealyColors.green,
              shadowOffset: { width: 0, height: 14 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <LinearGradient
              colors={[IdealyColors.greenLight, IdealyColors.green, IdealyColors.greenDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 28,
                padding: 24,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(240,201,59,0.18)',
              }}
            >
              {/* Decorative concentric rings, echoing the monogram's circular motif */}
              <View pointerEvents="none" style={{ position: 'absolute', top: -70, right: -70 }}>
                <View
                  style={{
                    width: 280,
                    height: 280,
                    borderRadius: 140,
                    borderWidth: 1,
                    borderColor: 'rgba(240,201,59,0.14)',
                  }}
                />
              </View>
              <View pointerEvents="none" style={{ position: 'absolute', top: -30, right: -30 }}>
                <View
                  style={{
                    width: 190,
                    height: 190,
                    borderRadius: 95,
                    borderWidth: 1,
                    borderColor: 'rgba(240,201,59,0.18)',
                  }}
                />
              </View>
              {/* Diagonal sheen */}
              <LinearGradient
                pointerEvents="none"
                colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.6, y: 0.8 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '65%' }}
              />

              <View className="flex-row items-center mb-8">
                <Text className="text-idealy-gold-light text-xs font-bold tracking-widest mr-2">SOLDE NET</Text>
                <Pressable onPress={() => setBalanceVisible((v) => !v)} hitSlop={8}>
                  <Ionicons name={balanceVisible ? 'eye-outline' : 'eye-off-outline'} size={16} color={IdealyColors.goldLight} />
                </Pressable>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white text-4xl font-extrabold mb-3">
                    {balanceVisible ? formatAr(reports.net) : '•••••• Ar'}
                  </Text>
                  {reports.netChangePercent !== null && (
                    <View className="flex-row items-center self-start bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
                      <Ionicons
                        name={reports.netChangePercent >= 0 ? 'arrow-up' : 'arrow-down'}
                        size={12}
                        color={reports.netChangePercent >= 0 ? '#4ADE80' : '#F87171'}
                      />
                      <Text
                        className="text-xs font-semibold ml-1"
                        style={{ color: reports.netChangePercent >= 0 ? '#4ADE80' : '#F87171' }}
                      >
                        {Math.abs(reports.netChangePercent)}% vs période précédente
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    borderRadius: 52,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.35,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Logo size={104} />
                </View>
              </View>

              <Text className="text-idealy-gold text-3xl font-extrabold mt-8">Idealy</Text>
            </LinearGradient>
          </View>

          {/* Bento grid */}
          <View className="flex-row flex-wrap justify-between mt-5">
            <BentoCard
              icon="wallet-outline"
              iconColor={IdealyColors.income}
              iconBg={IdealyColors.incomeBg}
              label="Revenus"
              value={formatAr(reports.income)}
              sublabel={PERIOD_LABELS[period]}
              onPress={() => navigation.navigate('Revenus')}
            />
            <BentoCard
              icon="arrow-down-circle-outline"
              iconColor={IdealyColors.expense}
              iconBg={IdealyColors.expenseBg}
              label="Dépenses"
              value={formatAr(reports.expense)}
              sublabel={PERIOD_LABELS[period]}
              onPress={() => navigation.navigate('Rapports')}
            />
            <BentoCard
              icon="trending-up-outline"
              iconColor={IdealyColors.savings}
              iconBg={IdealyColors.savingsBg}
              label="Épargne"
              value={formatAr(reports.net)}
              sublabel={PERIOD_LABELS[period]}
              onPress={() => navigation.navigate('Rapports')}
            />
            <BentoCard
              icon="pie-chart-outline"
              iconColor={IdealyColors.budgets}
              iconBg={IdealyColors.budgetsBg}
              label="Budgets"
              value={`${budgets.categories.length} Actifs`}
              sublabel="Suivre mes budgets"
              onPress={() => navigation.navigate('Budgets')}
            />
            <BentoCard
              icon="basket-outline"
              iconColor={IdealyColors.bazary}
              iconBg={IdealyColors.bazaryBg}
              label="Bazary"
              value={`${bazary.totalCount} Articles`}
              sublabel="Ma liste de courses"
              onPress={() => navigation.navigate('Bazary')}
            />
            <BentoCard
              icon="sparkles-outline"
              iconColor={IdealyColors.ai}
              iconBg={IdealyColors.aiBg}
              label="AI Copilot"
              value={insights.insights.length > 0 ? `${insights.insights.length} Conseils` : 'Tout va bien'}
              sublabel="Analyse & astuces"
              onPress={() => navigation.navigate('AICopilot')}
            />
          </View>

          {/* Progression */}
          <View className="bg-white rounded-3xl p-5 mt-2 border border-black/5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-idealy-text font-bold text-base">Ma progression financière</Text>
              <Pressable className="flex-row items-center" onPress={() => navigation.navigate('Rapports')}>
                <Text className="text-idealy-muted text-xs mr-1">Détails</Text>
                <Ionicons name="chevron-forward" size={14} color={IdealyColors.muted} />
              </Pressable>
            </View>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <ProgressGauge percent={incomePercent} color={IdealyColors.green} />
                <Text className="text-idealy-text text-xs font-semibold mt-2">Revenus</Text>
                <Text className="text-idealy-muted text-[11px] text-center">
                  {salaireMensuel > 0 ? `${formatK(reports.income)} / ${formatK(salaireMensuel)}` : 'Salaire non configuré'}
                </Text>
              </View>
              <View className="items-center flex-1">
                <ProgressGauge percent={expensePercent} color={IdealyColors.expense} />
                <Text className="text-idealy-text text-xs font-semibold mt-2">Dépenses</Text>
                <Text className="text-idealy-muted text-[11px] text-center">
                  {budgetGoal > 0 ? `${formatK(reports.expense)} / ${formatK(budgetGoal)}` : 'Aucun budget'}
                </Text>
              </View>
              <View className="items-center flex-1">
                <ProgressGauge percent={savingsPercent} color={IdealyColors.income} />
                <Text className="text-idealy-text text-xs font-semibold mt-2">Épargne</Text>
                <Text className="text-idealy-muted text-[11px] text-center">
                  {reports.income > 0 ? `${savingsPercent}% des revenus` : 'Pas encore de revenus'}
                </Text>
              </View>
            </View>
          </View>

          {/* Recent transactions */}
          <View className="bg-white rounded-3xl p-5 mt-5 border border-black/5">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-idealy-text font-bold text-base">Transactions récentes</Text>
              <Pressable onPress={() => navigation.navigate('Rapports')}>
                <Text className="text-idealy-green text-xs font-semibold">Voir tout</Text>
              </Pressable>
            </View>
            {recentTransactions.length === 0 ? (
              <Text className="text-idealy-muted text-xs text-center py-6">Aucune transaction pour le moment</Text>
            ) : (
              <View>
                {recentTransactions.map((tx, index) => {
                  const meta = getCategoryMeta(tx.category, tx.kind);
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
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
