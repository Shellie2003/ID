import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import { IdealyColors } from '../theme/colors';
import { BAZARY_CATEGORIES, getCategoryMeta } from '../utils/categoryMeta';
import { clearCheckedBazaryItems, createBazaryItem, deleteBazaryItem, toggleBazaryItem, useBazaryList } from '../data/hooks/useBazaryList';
import type BazaryItem from '../data/database/models/BazaryItem';

export default function BazaryScreen() {
  const { loading, items, checkedCount, totalCount } = useBazaryList();
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<string>(BAZARY_CATEGORIES[0]);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!label.trim()) return;
    setAdding(true);
    try {
      await createBazaryItem({ label: label.trim(), category });
      setLabel('');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (item: BazaryItem) => {
    Alert.alert('Supprimer l’article', `Retirer « ${item.label} » de la liste ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteBazaryItem(item) },
    ]);
  };

  const handleClearChecked = () => {
    Alert.alert('Vider les articles cochés', `Retirer les ${checkedCount} articles déjà cochés ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Vider', style: 'destructive', onPress: () => clearCheckedBazaryItems(items) },
    ]);
  };

  return (
    <View className="flex-1 bg-idealy-bg">
      <Header hasNotification={false} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          <View className="flex-row items-center justify-between mt-2 mb-4">
            <View>
              <Text className="text-idealy-text text-xl font-bold">Bazary</Text>
              <Text className="text-idealy-muted text-sm mt-0.5">Votre liste de courses</Text>
            </View>
            <View className="rounded-full px-3 py-2" style={{ backgroundColor: IdealyColors.bazaryBg }}>
              <Text className="text-xs font-bold" style={{ color: IdealyColors.bazary }}>
                {checkedCount}/{totalCount} cochés
              </Text>
            </View>
          </View>

          {/* Quick add */}
          <View className="bg-white rounded-3xl p-4 border border-black/5">
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <TextInput
                value={label}
                onChangeText={setLabel}
                placeholder="Ajouter un article..."
                placeholderTextColor={IdealyColors.muted}
                onSubmitEditing={handleAdd}
                returnKeyType="done"
                className="flex-1 bg-idealy-bg rounded-xl px-3 py-2.5 text-idealy-text"
              />
              <Pressable
                onPress={handleAdd}
                disabled={adding || !label.trim()}
                className="w-11 h-11 rounded-xl items-center justify-center"
                style={{ backgroundColor: IdealyColors.bazary, opacity: !label.trim() ? 0.5 : 1 }}
              >
                <Ionicons name="add" size={22} color="white" />
              </Pressable>
            </View>
            <View className="flex-row flex-wrap mt-3">
              {BAZARY_CATEGORIES.map((cat) => {
                const meta = getCategoryMeta(cat);
                const selected = category === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className="flex-row items-center rounded-full px-3 py-1.5 mr-2 mb-1 border"
                    style={{ backgroundColor: selected ? meta.bg : 'white', borderColor: selected ? meta.color : '#E9ECEF' }}
                  >
                    <Ionicons name={meta.icon} size={13} color={meta.color} />
                    <Text className="text-idealy-text text-xs font-medium ml-1.5">{cat}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* List */}
          <View className="bg-white rounded-3xl p-5 mt-5 border border-black/5">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-idealy-text font-bold text-base">Articles</Text>
              {checkedCount > 0 && (
                <Pressable onPress={handleClearChecked}>
                  <Text className="text-idealy-expense text-xs font-semibold">Vider les cochés</Text>
                </Pressable>
              )}
            </View>

            {loading ? (
              <View className="items-center py-10">
                <ActivityIndicator color={IdealyColors.bazary} />
              </View>
            ) : items.length === 0 ? (
              <View className="items-center py-8">
                <Ionicons name="basket-outline" size={30} color={IdealyColors.bazary} />
                <Text className="text-idealy-muted text-xs text-center mt-2">Votre liste de courses est vide</Text>
              </View>
            ) : (
              items.map((item, index) => {
                const meta = getCategoryMeta(item.category);
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => toggleBazaryItem(item)}
                    onLongPress={() => handleDelete(item)}
                    delayLongPress={400}
                    className={`flex-row items-center py-3 ${index > 0 ? 'border-t border-black/5' : ''}`}
                  >
                    <View
                      className="w-6 h-6 rounded-full items-center justify-center mr-3"
                      style={{
                        backgroundColor: item.checked ? IdealyColors.bazary : 'transparent',
                        borderWidth: item.checked ? 0 : 1.5,
                        borderColor: '#D1D5DB',
                      }}
                    >
                      {item.checked && <Ionicons name="checkmark" size={15} color="white" />}
                    </View>
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: meta.bg, opacity: item.checked ? 0.5 : 1 }}
                    >
                      <Ionicons name={meta.icon} size={15} color={meta.color} />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-sm font-semibold"
                        style={{
                          color: item.checked ? IdealyColors.muted : IdealyColors.text,
                          textDecorationLine: item.checked ? 'line-through' : 'none',
                        }}
                      >
                        {item.label}
                      </Text>
                      <Text className="text-idealy-muted text-xs">{item.category}</Text>
                    </View>
                  </Pressable>
                );
              })
            )}
            {items.length > 0 && (
              <Text className="text-idealy-muted text-[11px] text-center mt-2">Appui long pour supprimer un article</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
