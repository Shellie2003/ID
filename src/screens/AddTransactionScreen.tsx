import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { IdealyColors } from '../theme/colors';
import { formatAr } from '../utils/formatAr';

const SMALL_PRESETS = [1000, 2000, 5000, 10000, 15000, 20000];
const LARGE_PRESETS = [50000, 100000, 150000, 200000, 300000, 500000];

const CATEGORIES = [
  { label: 'Alimentation', icon: 'bag-outline', color: IdealyColors.expense, bg: IdealyColors.expenseBg },
  { label: 'Transport', icon: 'car-outline', color: IdealyColors.savings, bg: IdealyColors.savingsBg },
  { label: 'Personnel', icon: 'shirt-outline', color: IdealyColors.budgets, bg: IdealyColors.budgetsBg },
  { label: 'Bazary', icon: 'basket-outline', color: IdealyColors.bazary, bg: IdealyColors.bazaryBg },
] as const;

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]['label']>(CATEGORIES[0].label);
  const [note, setNote] = useState('');

  return (
    <View className="flex-1 bg-idealy-bg">
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="close" size={26} color={IdealyColors.text} />
        </Pressable>
        <Text className="text-idealy-text font-bold text-base">Nouvelle dépense</Text>
        <View style={{ width: 26 }} />
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
          {CATEGORIES.map((cat) => {
            const selected = category === cat.label;
            return (
              <Pressable
                key={cat.label}
                onPress={() => setCategory(cat.label)}
                className="flex-row items-center rounded-2xl px-3 py-2.5 mr-2 mb-2 border"
                style={{ backgroundColor: selected ? cat.bg : 'white', borderColor: selected ? cat.color : '#E9ECEF' }}
              >
                <Ionicons name={cat.icon} size={16} color={cat.color} />
                <Text className="text-idealy-text text-sm font-medium ml-2">{cat.label}</Text>
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
          className="rounded-2xl py-4 items-center"
          style={{ backgroundColor: IdealyColors.green }}
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-bold text-base">Enregistrer</Text>
        </Pressable>
      </View>
    </View>
  );
}
