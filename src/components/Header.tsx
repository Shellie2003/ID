import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import Logo from './Logo';
import { IdealyColors } from '../theme/colors';

type HeaderProps = {
  hasNotification?: boolean;
};

export default function Header({ hasNotification = true }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View className="px-5 pt-3 pb-2">
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          className="w-10 h-10 items-center justify-center"
          hitSlop={8}
        >
          <Ionicons name="menu" size={26} color={IdealyColors.green} />
        </Pressable>

        <View className="items-center">
          <Logo size={76} />
          <Text className="text-idealy-green text-3xl font-extrabold -mt-1">Idealy</Text>
        </View>

        <Pressable className="w-10 h-10 items-center justify-center" hitSlop={8}>
          <Ionicons name="notifications-outline" size={24} color={IdealyColors.green} />
          {hasNotification && (
            <View className="absolute top-1 right-1.5 w-2.5 h-2.5 rounded-full bg-idealy-gold-light border border-white" />
          )}
        </Pressable>
      </View>
      <Text className="text-center text-idealy-muted text-xs mt-1">Firindram_piainana</Text>
    </View>
  );
}
