import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../components/Logo';
import { IdealyColors } from '../theme/colors';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function WelcomeBackScreen() {
  return (
    <View className="flex-1 items-center px-8 pt-24" style={{ backgroundColor: IdealyColors.green }}>
      <Logo size={88} withBackground={false} />
      <Text className="text-white text-2xl font-extrabold mt-4">Content de vous revoir</Text>
      <Text className="text-white/70 text-sm mt-1 mb-10">Entrez votre code PIN pour continuer</Text>

      <View className="flex-row mb-12">
        {[0, 1, 2, 3].map((i) => (
          <View key={i} className="w-3.5 h-3.5 rounded-full border border-idealy-gold mx-2" />
        ))}
      </View>

      <View className="flex-row flex-wrap w-full justify-between">
        {KEYS.map((key, index) => (
          <Pressable
            key={index}
            disabled={key === ''}
            className="w-[30%] aspect-square rounded-2xl items-center justify-center mb-4 bg-white/5"
          >
            {key === 'del' ? (
              <Ionicons name="backspace-outline" size={22} color="white" />
            ) : (
              <Text className="text-white text-2xl font-semibold">{key}</Text>
            )}
          </Pressable>
        ))}
      </View>

      <Pressable className="mt-2 flex-row items-center">
        <Ionicons name="finger-print-outline" size={18} color={IdealyColors.goldLight} />
        <Text className="text-idealy-gold-light text-sm font-semibold ml-2">Utiliser la biométrie</Text>
      </Pressable>
    </View>
  );
}
