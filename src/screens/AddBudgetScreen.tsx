import { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { IdealyColors } from '../theme/colors';
import { formatAr } from '../utils/formatAr';
import { BUDGET_CATEGORIES, getCategoryMeta } from '../utils/categoryMeta';
import { createBudgetEnvelope } from '../data/hooks/useBudgetOverview';

const LIMIT_PRESETS = [50000, 100000, 150000, 200000, 300000, 500000];

export default function AddBudgetScreen() {
  const navigation = useNavigation();
  const [category, setCategory] = useState<(typeof BUDGET_CATEGORIES)[number]>(BUDGET_CATEGORIES[0]);
  const [name, setName] = useState<string>(BUDGET_CATEGORIES[0]);
  const [limit, setLimit] = useState<number | null>(null);
  const [rollover, setRollover] = useState(false);
  const [saving, setSaving] = useState(false);

  const meta = getCategoryMeta(category);

  const handleSelectCategory = (next: (typeof BUDGET_CATEGORIES)[number]) => {
    setCategory(next);
    // Keep the name in sync unless the user has customized it away from the category defaults.
    setName((current) => ((BUDGET_CATEGORIES as readonly string[]).includes(current) ? next : current));
  };

  const handleSave = async () => {
    if (!name.trim() || !limit) {
      Alert.alert('Enveloppe incomplète', 'Donnez un nom et un montant limite à ce budget.');
      return;
    }
    setSaving(true);
    try {
      await createBudgetEnvelope({
        name: name.trim(),
        category,
        color: meta.color,
        icon: meta.icon,
        limitAmount: limit,
        rolloverEnabled: rollover,
      });
      navigation.goBack();
    } catch (error) {
      console.error('[AddBudgetScreen] Failed to create envelope', error);
      Alert.alert('Erreur', "Impossible d'enregistrer ce budget pour le moment.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-idealy-bg">
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="close" size={26} color={IdealyColors.text} />
        </Pressable>
        <Text className="text-idealy-text font-bold text-base">Nouveau budget</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="items-center py-6">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: meta.bg }}
          >
            <Ionicons name={meta.icon} size={28} color={meta.color} />
          </View>
          <Text className="text-idealy-muted text-xs mb-1">Montant limite</Text>
          <Text className="text-idealy-text text-4xl font-extrabold">{limit !== null ? formatAr(limit) : '0 Ar'}</Text>
        </View>

        <Text className="text-idealy-muted text-xs font-semibold mb-2">CATÉGORIE</Text>
        <View className="flex-row flex-wrap mb-5">
          {BUDGET_CATEGORIES.map((cat) => {
            const catMeta = getCategoryMeta(cat);
            const selected = category === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => handleSelectCategory(cat)}
                className="flex-row items-center rounded-2xl px-3 py-2.5 mr-2 mb-2 border"
                style={{ backgroundColor: selected ? catMeta.bg : 'white', borderColor: selected ? catMeta.color : '#E9ECEF' }}
              >
                <Ionicons name={catMeta.icon} size={16} color={catMeta.color} />
                <Text className="text-idealy-text text-sm font-medium ml-2">{cat}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-idealy-muted text-xs font-semibold mb-2">NOM DE L'ENVELOPPE</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ex : Courses du mois"
          placeholderTextColor={IdealyColors.muted}
          className="bg-white rounded-2xl px-4 py-3 mb-5 border border-black/5 text-idealy-text"
        />

        <Text className="text-idealy-muted text-xs font-semibold mb-2">MONTANTS RAPIDES</Text>
        <View className="flex-row flex-wrap mb-5">
          {LIMIT_PRESETS.map((preset) => (
            <Pressable
              key={preset}
              onPress={() => setLimit(preset)}
              className="rounded-full px-4 py-2 mr-2 mb-2 border"
              style={{
                backgroundColor: limit === preset ? IdealyColors.green : 'white',
                borderColor: limit === preset ? IdealyColors.green : '#E9ECEF',
              }}
            >
              <Text style={{ color: limit === preset ? 'white' : IdealyColors.text }} className="text-sm font-medium">
                {formatAr(preset)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => setRollover((v) => !v)}
          className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-3 mb-8 border border-black/5"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <Ionicons name="sync-outline" size={18} color={rollover ? IdealyColors.green : IdealyColors.muted} />
            <View className="ml-3 flex-1">
              <Text className="text-idealy-text text-sm font-semibold">Reporter le solde non utilisé</Text>
              <Text className="text-idealy-muted text-xs">Le reste de ce mois s'ajoute au mois suivant</Text>
            </View>
          </View>
          <Switch
            value={rollover}
            onValueChange={setRollover}
            trackColor={{ false: '#E9ECEF', true: IdealyColors.green }}
            thumbColor="white"
          />
        </Pressable>
      </ScrollView>

      <View className="px-5 pb-8 pt-2">
        <Pressable
          disabled={saving}
          className="rounded-2xl py-4 items-center"
          style={{ backgroundColor: IdealyColors.green, opacity: saving ? 0.6 : 1 }}
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-base">{saving ? 'Enregistrement…' : 'Créer le budget'}</Text>
        </Pressable>
      </View>
    </View>
  );
}
