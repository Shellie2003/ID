import AsyncStorage from '@react-native-async-storage/async-storage';
import { IdealyColors } from '../theme/colors';

const KEYS = {
  userName: 'idealy:userName',
  userEmail: 'idealy:userEmail',
  userBio: 'idealy:userBio',
  avatarColor: 'idealy:avatarColor',
  salaireMensuel: 'idealy:salaireMensuel',
  currency: 'idealy:currency',
  language: 'idealy:language',
  pin: 'idealy:pin',
  biometricEnabled: 'idealy:biometricEnabled',
  cloudSyncEnabled: 'idealy:cloudSyncEnabled',
  autoBackupEnabled: 'idealy:autoBackupEnabled',
} as const;

export type UserProfile = {
  userName: string;
  userEmail: string;
  userBio: string;
  avatarColor: string;
};

export const DEFAULT_PROFILE: UserProfile = {
  userName: 'Shellino',
  userEmail: 'shellinopierre@gmail.com',
  userBio: 'Chef de foyer',
  avatarColor: IdealyColors.green,
};

export const AVATAR_COLORS = [IdealyColors.green, '#2563EB', '#A72D51', '#E91E63', IdealyColors.budgets, IdealyColors.bazary];

export const CURRENCIES = [
  { code: 'Ar', label: 'Ariary Malgache' },
  { code: 'USD', label: 'Dollar Américain' },
  { code: 'EUR', label: 'Euro' },
] as const;

export const LANGUAGES = [
  { code: 'fr', label: 'Français', available: true },
  { code: 'en', label: 'English', available: false },
  { code: 'mg', label: 'Malagasy', available: false },
] as const;

export async function getUserProfile(): Promise<UserProfile> {
  const entries = await AsyncStorage.getMany([KEYS.userName, KEYS.userEmail, KEYS.userBio, KEYS.avatarColor]);
  return {
    userName: entries[KEYS.userName] ?? DEFAULT_PROFILE.userName,
    userEmail: entries[KEYS.userEmail] ?? DEFAULT_PROFILE.userEmail,
    userBio: entries[KEYS.userBio] ?? DEFAULT_PROFILE.userBio,
    avatarColor: entries[KEYS.avatarColor] ?? DEFAULT_PROFILE.avatarColor,
  };
}

export async function setUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setMany({
    [KEYS.userName]: profile.userName,
    [KEYS.userEmail]: profile.userEmail,
    [KEYS.userBio]: profile.userBio,
    [KEYS.avatarColor]: profile.avatarColor,
  });
}

export async function getSalaireMensuel(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.salaireMensuel);
  return raw ? Number(raw) : 0;
}

export async function setSalaireMensuel(value: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.salaireMensuel, String(value));
}

export async function getCurrency(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.currency)) ?? 'Ar';
}

export async function setCurrency(code: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.currency, code);
}

export async function getLanguage(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.language)) ?? 'fr';
}

export async function setLanguage(code: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.language, code);
}

export async function getBooleanPref(key: 'biometricEnabled' | 'cloudSyncEnabled' | 'autoBackupEnabled', fallback = false): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS[key]);
  return raw === null ? fallback : raw === '1';
}

export async function setBooleanPref(key: 'biometricEnabled' | 'cloudSyncEnabled' | 'autoBackupEnabled', value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS[key], value ? '1' : '0');
}

/** Whether a PIN has ever been configured (gates whether the lock screen is meaningful). */
export async function hasSecurityPin(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEYS.pin)) !== null;
}

export async function setSecurityPin(pin: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.pin, pin);
}

export async function clearSecurityPin(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.pin);
}

export async function verifySecurityPin(pin: string): Promise<boolean> {
  const stored = await AsyncStorage.getItem(KEYS.pin);
  return stored !== null && stored === pin;
}
