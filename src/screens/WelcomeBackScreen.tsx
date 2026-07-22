import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import { IdealyColors } from '../theme/colors';
import { getBooleanPref, hasSecurityPin, verifySecurityPin } from '../utils/settingsStore';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function WelcomeBackScreen() {
  const navigation = useNavigation<any>();
  const [pinConfigured, setPinConfigured] = useState<boolean | null>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      setPinConfigured(await hasSecurityPin());
      setBiometricEnabled(await getBooleanPref('biometricEnabled'));
    })();
  }, []);

  const unlock = () => navigation.navigate('Tabs');

  const handleKeyPress = async (key: string) => {
    if (key === '') return;
    setError(false);

    if (key === 'del') {
      setPin((current) => current.slice(0, -1));
      return;
    }

    const next = (pin + key).slice(0, 4);
    setPin(next);

    if (next.length === 4) {
      const valid = await verifySecurityPin(next);
      if (valid) {
        unlock();
      } else {
        setError(true);
        setPin('');
      }
    }
  };

  if (pinConfigured === false) {
    return (
      <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: IdealyColors.green }}>
        <Logo size={88} />
        <Text className="text-white text-xl font-extrabold mt-4 text-center">Aucun code PIN configuré</Text>
        <Text className="text-white/70 text-sm mt-1 mb-8 text-center">
          Configurez un code PIN depuis Paramètres → Sécurité pour verrouiller l'application.
        </Text>
        <Pressable onPress={unlock} className="rounded-2xl px-6 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <Text className="text-white font-bold text-sm">Retour</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center px-8 pt-24" style={{ backgroundColor: IdealyColors.green }}>
      <Logo size={88} />
      <Text className="text-white text-2xl font-extrabold mt-4">Content de vous revoir</Text>
      <Text className="text-white/70 text-sm mt-1 mb-10">
        {error ? 'Code incorrect, réessayez' : 'Entrez votre code PIN pour continuer'}
      </Text>

      <View className="flex-row mb-12">
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            className="w-3.5 h-3.5 rounded-full mx-2"
            style={{
              borderWidth: 1,
              borderColor: error ? IdealyColors.expense : IdealyColors.gold,
              backgroundColor: i < pin.length ? (error ? IdealyColors.expense : IdealyColors.goldLight) : 'transparent',
            }}
          />
        ))}
      </View>

      <View className="flex-row flex-wrap w-full justify-between">
        {KEYS.map((key, index) => (
          <Pressable
            key={index}
            disabled={key === ''}
            onPress={() => handleKeyPress(key)}
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

      {biometricEnabled && (
        <Pressable className="mt-2 flex-row items-center" onPress={unlock}>
          <Ionicons name="finger-print-outline" size={18} color={IdealyColors.goldLight} />
          <Text className="text-idealy-gold-light text-sm font-semibold ml-2">Utiliser la biométrie</Text>
        </Pressable>
      )}
    </View>
  );
}
