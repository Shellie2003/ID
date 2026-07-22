import type { ReactNode } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IdealyColors } from '../theme/colors';

export function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View>
      <Text className="text-idealy-muted text-xs font-bold uppercase mb-2 ml-1" style={{ letterSpacing: 1 }}>
        {title}
      </Text>
      <View className="bg-white rounded-3xl border border-black/5 overflow-hidden">{children}</View>
    </View>
  );
}

export function SettingsRowDivider() {
  return <View className="h-px bg-black/5 ml-14" />;
}

type SettingsRowButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  destructive?: boolean;
  onPress: () => void;
};

export function SettingsRowButton({ icon, title, subtitle, destructive, onPress }: SettingsRowButtonProps) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-4 py-3.5">
      <View
        className="w-9 h-9 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: destructive ? IdealyColors.expenseBg : IdealyColors.incomeBg }}
      >
        <Ionicons name={icon} size={17} color={destructive ? IdealyColors.expense : IdealyColors.green} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold" style={{ color: destructive ? IdealyColors.expense : IdealyColors.text }}>
          {title}
        </Text>
        {subtitle ? <Text className="text-idealy-muted text-xs mt-0.5">{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={IdealyColors.muted} />
    </Pressable>
  );
}

type SettingsRowSwitchProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
};

export function SettingsRowSwitch({ icon, title, subtitle, checked, onCheckedChange }: SettingsRowSwitchProps) {
  return (
    <View className="flex-row items-center px-4 py-3.5">
      <View className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: IdealyColors.incomeBg }}>
        <Ionicons name={icon} size={17} color={IdealyColors.green} />
      </View>
      <View className="flex-1 mr-2">
        <Text className="text-idealy-text text-sm font-semibold">{title}</Text>
        {subtitle ? <Text className="text-idealy-muted text-xs mt-0.5">{subtitle}</Text> : null}
      </View>
      <Switch
        value={checked}
        onValueChange={onCheckedChange}
        trackColor={{ false: '#E9ECEF', true: IdealyColors.green }}
        thumbColor="white"
      />
    </View>
  );
}
