import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import { IdealyColors } from '../theme/colors';
import { useInsights, insightStyle } from '../data/hooks/useInsights';

export default function AICopilotScreen() {
  const { loading, insights } = useInsights();

  return (
    <View className="flex-1 bg-idealy-bg">
      <Header hasNotification={false} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          <View className="mt-2 mb-4">
            <Text className="text-idealy-text text-xl font-bold">AI Copilot</Text>
            <Text className="text-idealy-muted text-sm mt-0.5">Analyse & astuces basées sur vos finances</Text>
          </View>

          {/* Copilot intro bubble */}
          <View className="flex-row items-start mb-5">
            <View
              className="w-9 h-9 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: IdealyColors.aiBg }}
            >
              <Ionicons name="sparkles" size={17} color={IdealyColors.ai} />
            </View>
            <View className="flex-1 bg-white rounded-2xl rounded-tl-sm p-4 border border-black/5">
              <Text className="text-idealy-text text-sm">
                Voici une analyse de votre mois en cours, basée uniquement sur les données déjà présentes dans
                l'application.
              </Text>
              <Text className="text-idealy-muted text-[11px] mt-2">
                Analyse locale sur l'appareil — aucune donnée n'est envoyée à un service externe.
              </Text>
            </View>
          </View>

          {loading ? (
            <View className="items-center py-16">
              <ActivityIndicator color={IdealyColors.ai} />
            </View>
          ) : insights.length === 0 ? (
            <View className="flex-row items-start">
              <View className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: IdealyColors.aiBg }}>
                <Ionicons name="sparkles" size={17} color={IdealyColors.ai} />
              </View>
              <View className="flex-1 bg-white rounded-2xl rounded-tl-sm p-4 border border-black/5">
                <Text className="text-idealy-text text-sm">
                  Tout semble équilibré pour le moment — rien à signaler de particulier ce mois-ci.
                </Text>
              </View>
            </View>
          ) : (
            insights.map((insight) => {
              const style = insightStyle(insight.severity);
              return (
                <View key={insight.id} className="flex-row items-start mb-4">
                  <View className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: IdealyColors.aiBg }}>
                    <Ionicons name="sparkles" size={17} color={IdealyColors.ai} />
                  </View>
                  <View className="flex-1 bg-white rounded-2xl rounded-tl-sm p-4 border border-black/5">
                    <View className="flex-row items-center mb-1.5">
                      <View className="w-6 h-6 rounded-full items-center justify-center mr-2" style={{ backgroundColor: style.bg }}>
                        <Ionicons name={insight.icon} size={13} color={style.color} />
                      </View>
                      <Text className="text-idealy-text text-sm font-bold flex-1">{insight.title}</Text>
                    </View>
                    <Text className="text-idealy-muted text-xs leading-5">{insight.message}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
