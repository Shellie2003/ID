import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { IdealyColors } from '../theme/colors';
import { formatAr } from '../utils/formatAr';
import { BUDGET_CATEGORIES, INCOME_CATEGORIES, getCategoryMeta } from '../utils/categoryMeta';
import { createTransaction } from '../data/hooks/useReportsOverview';

const SMALL_PRESETS = [1000, 2000, 5000, 10000, 15000, 20000];
const LARGE_PRESETS = [50000, 100000, 150000, 200000, 300000, 500000];

type Kind = 'expense' | 'income';

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const [kind, setKind] = useState<Kind>('expense');
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<string>(BUDGET_CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const categories: readonly string[] = kind === 'expense' ? BUDGET_CATEGORIES : INCOME_CATEGORIES;

  const handleSelectKind = (next: Kind) => {
    setKind(next);
    setCategory(next === 'expense' ? BUDGET_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSave = async () => {
    if (!amount) {
      Alert.alert('Montant manquant', 'Choisissez un montant pour cette transaction.');
      return;
    }
    setSaving(true);
    try {
      await createTransaction({
        kind,
        amount,
        title: note.trim() || category,
        category,
        note: note.trim() || undefined,
      });
      navigation.goBack();
    } catch (error) {
      console.error('[AddTransactionScreen] Failed to save transaction', error);
      Alert.alert('Erreur', "Impossible d'enregistrer cette transaction pour le moment.");
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
        <Text className="text-idealy-text font-bold text-base">
          {kind === 'expense' ? 'Nouvelle dépense' : 'Nouveau revenu'}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <View className="flex-row mx-5 mt-2 rounded-2xl bg-white border border-black/5 p-1">
        {(['expense', 'income'] as const).map((option) => {
          const selected = kind === option;
          return (
            <Pressable
              key={option}
              onPress={() => handleSelectKind(option)}
              className="flex-1 items-center py-2.5 rounded-xl"
              style={{ backgroundColor: selected ? (option === 'expense' ? IdealyColors.expense : IdealyColors.green) : 'transparent' }}
            >
              <Text className="text-sm font-bold" style={{ color: selected ? 'white' : IdealyColors.muted }}>
                {option === 'expense' ? 'Dépense' : 'Revenu'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="items-center py-6">
          <Text className="text-idealy-muted text-xs mb-1">Montant</Text>
          <Text className="text-idealy-text text-4xl font-extrabold">
            {amount !== null ? formatAr(amount) : '0 Ar'}
          </Text>
        </View>

        <Text className="text-idealy-muted text-xs font-semibold mb-2">MONTANTS RAPIDES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          {SMALL_PRESETS.map((preset) => (
            <Pressable
              key={preset}
              onPress={() => setAmount(preset)}
              className="rounded-full px-4 py-2 mr-2 border"
              style={{
                backgroundColor: amount === preset ? IdealyColors.green : 'white',
                borderColor: amount === preset ? IdealyColors.green : '#E9ECEF',
              }}
            >
              <Text style={{ color: amount === preset ? 'white' : IdealyColors.text }} className="text-sm font-medium">
                {formatAr(preset)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
          {LARGE_PRESETS.map((preset) => (
            <Pressable
              key={preset}
              onPress={() => setAmount(preset)}
              className="rounded-full px-4 py-2 mr-2 border"
              style={{
                backgroundColor: amount === preset ? IdealyColors.green : 'white',
                borderColor: amount === preset ? IdealyColors.green : '#E9ECEF',
              }}
            >
              <Text style={{ color: amount === preset ? 'white' : IdealyColors.text }} className="text-sm font-medium">
                {formatAr(preset)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text className="text-idealy-muted text-xs font-semibold mb-2">CATÉGORIE</Text>
        <View className="flex-row flex-wrap mb-5">
          {categories.map((cat) => {
            const meta = getCategoryMeta(cat, kind);
            const selected = category === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                className="flex-row items-center rounded-2xl px-3 py-2.5 mr-2 mb-2 border"
                style={{ backgroundColor: selected ? meta.bg : 'white', borderColor: selected ? meta.color : '#E9ECEF' }}
              >
                <Ionicons name={meta.icon} size={16} color={meta.color} />
                <Text className="text-idealy-text text-sm font-medium ml-2">{cat}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-idealy-muted text-xs font-semibold mb-2">NOTE</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Ajouter une description..."
          placeholderTextColor={IdealyColors.muted}
          className="bg-white rounded-2xl px-4 py-3 mb-6 border border-black/5 text-idealy-text"
        />
      </ScrollView>

      <View className="px-5 pb-8 pt-2">
        <Pressable
          disabled={saving}
          className="rounded-2xl py-4 items-center"
          style={{ backgroundColor: kind === 'expense' ? IdealyColors.expense : IdealyColors.green, opacity: saving ? 0.6 : 1 }}
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-base">{saving ? 'Enregistrement…' : 'Enregistrer'}</Text>
        </Pressable>
      </View>
    </View>
  );
}
