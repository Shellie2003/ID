import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import Header from '../components/Header';
import BentoCard from '../components/BentoCard';
import ProgressGauge from '../components/ProgressGauge';
import TransactionRow from '../components/TransactionRow';
import Logo from '../components/Logo';
import { IdealyColors } from '../theme/colors';
import { formatAr } from '../utils/formatAr';
import { mockSummary, mockTransactions } from '../data/mock/dashboardMock';

const PERIODS = ['Aujourd’hui', 'Cette semaine', 'Ce mois-ci', 'Cette année'];

export default function DashboardScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [period, setPeriod] = useState('Ce mois-ci');

  const incomePercent = Math.round((mockSummary.income.total / mockSummary.income.goal) * 100);
  const expensePercent = Math.round((mockSummary.expense.total / mockSummary.expense.goal) * 100);
  const savingsPercent = Math.round((mockSummary.savings.total / mockSummary.savings.goal) * 100);

  return (
    <View className="flex-1 bg-idealy-bg">
      <Header />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          <View className="flex-row items-center justify-between mt-2 mb-4">
            <View>
              <Text className="text-idealy-text text-xl font-bold">
                Bonjour <Text className="font-extrabold">Shellino</Text> !
              </Text>
              <Text className="text-idealy-muted text-sm mt-0.5">Voici un aperçu de vos finances</Text>
            </View>
            <Pressable
              className="flex-row items-center bg-white rounded-full px-3 py-2 border border-black/5"
              onPress={() => {
                const next = PERIODS[(PERIODS.indexOf(period) + 1) % PERIODS.length];
                setPeriod(next);
              }}
            >
              <Text className="text-idealy-text text-xs font-medium mr-1">{period}</Text>
              <Ionicons name="chevron-down" size={14} color={IdealyColors.text} />
            </Pressable>
          </View>

          {/* Balance card */}
          <LinearGradient
            colors={[IdealyColors.green, IdealyColors.greenDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 28, padding: 24, overflow: 'hidden' }}
          >
            <View className="flex-row items-center mb-8">
              <Text className="text-idealy-gold-light text-xs font-bold tracking-widest mr-2">SOLDE NET</Text>
              <Pressable onPress={() => setBalanceVisible((v) => !v)} hitSlop={8}>
                <Ionicons name={balanceVisible ? 'eye-outline' : 'eye-off-outline'} size={16} color={IdealyColors.goldLight} />
              </Pressable>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-4xl font-extrabold mb-3">
                  {balanceVisible ? formatAr(mockSummary.netBalance) : '•••••• Ar'}
                </Text>
                <View className="flex-row items-center self-start bg-white/10 rounded-full px-3 py-1.5">
                  <Ionicons name="arrow-up" size={12} color="#4ADE80" />
                  <Text className="text-[#4ADE80] text-xs font-semibold ml-1">
                    +{mockSummary.netBalanceChangePercent}% vs mois dernier
                  </Text>
                </View>
              </View>
              <Logo size={92} withBackground={false} />
            </View>

            <Text className="text-idealy-gold text-2xl font-extrabold mt-10">Idealy</Text>
          </LinearGradient>

          {/* Bento grid */}
          <View className="flex-row flex-wrap justify-between mt-5">
            <BentoCard
              icon="wallet-outline"
              iconColor={IdealyColors.income}
              iconBg={IdealyColors.incomeBg}
              label="Revenus"
              value={formatAr(mockSummary.income.total)}
              sublabel="Total ce mois"
            />
            <BentoCard
              icon="arrow-down-circle-outline"
              iconColor={IdealyColors.expense}
              iconBg={IdealyColors.expenseBg}
              label="Dépenses"
              value={formatAr(mockSummary.expense.total)}
              sublabel="Total ce mois"
            />
            <BentoCard
              icon="trending-up-outline"
              iconColor={IdealyColors.savings}
              iconBg={IdealyColors.savingsBg}
              label="Épargne"
              value={formatAr(mockSummary.savings.total)}
              sublabel="Total ce mois"
            />
            <BentoCard
              icon="pie-chart-outline"
              iconColor={IdealyColors.budgets}
              iconBg={IdealyColors.budgetsBg}
              label="Budgets"
              value={`${mockSummary.budgetsActive} Actifs`}
              sublabel="Suivre mes budgets"
            />
            <BentoCard
              icon="basket-outline"
              iconColor={IdealyColors.bazary}
              iconBg={IdealyColors.bazaryBg}
              label="Bazary"
              value={`${mockSummary.bazaryItems} Articles`}
              sublabel="Ma liste de courses"
            />
            <BentoCard
              icon="sparkles-outline"
              iconColor={IdealyColors.ai}
              iconBg={IdealyColors.aiBg}
              label="AI Copilot"
              value="Conseils"
              sublabel="Analyse & astuces"
            />
          </View>

          {/* Progression */}
          <View className="bg-white rounded-3xl p-5 mt-2 border border-black/5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-idealy-text font-bold text-base">Ma progression financière</Text>
              <Pressable className="flex-row items-center">
                <Text className="text-idealy-muted text-xs mr-1">Détails</Text>
                <Ionicons name="chevron-forward" size={14} color={IdealyColors.muted} />
              </Pressable>
            </View>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <ProgressGauge percent={incomePercent} color={IdealyColors.green} />
                <Text className="text-idealy-text text-xs font-semibold mt-2">Revenus</Text>
                <Text className="text-idealy-muted text-[11px]">
                  {Math.round(mockSummary.income.total / 1000)}k / {Math.round(mockSummary.income.goal / 1000)}k
                </Text>
              </View>
              <View className="items-center flex-1">
                <ProgressGauge percent={expensePercent} color={IdealyColors.expense} />
                <Text className="text-idealy-text text-xs font-semibold mt-2">Dépenses</Text>
                <Text className="text-idealy-muted text-[11px]">
                  {Math.round(mockSummary.expense.total / 1000)}k / {Math.round(mockSummary.expense.goal / 1000)}k
                </Text>
              </View>
              <View className="items-center flex-1">
                <ProgressGauge percent={savingsPercent} color={IdealyColors.income} />
                <Text className="text-idealy-text text-xs font-semibold mt-2">Épargne</Text>
                <Text className="text-idealy-muted text-[11px]">
                  {Math.round(mockSummary.savings.total / 1000)}k / {Math.round(mockSummary.savings.goal / 1000)}k
                </Text>
              </View>
            </View>
          </View>

          {/* Recent transactions */}
          <View className="bg-white rounded-3xl p-5 mt-5 border border-black/5">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-idealy-text font-bold text-base">Transactions récentes</Text>
              <Pressable>
                <Text className="text-idealy-green text-xs font-semibold">Voir tout</Text>
              </Pressable>
            </View>
            <View>
              {mockTransactions.map((tx, index) => (
                <View key={tx.id} className={index > 0 ? 'border-t border-black/5' : ''}>
                  <TransactionRow {...tx} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
