import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import { SettingsGroup, SettingsRowButton, SettingsRowDivider, SettingsRowSwitch } from '../components/SettingsRow';
import { IdealyColors } from '../theme/colors';
import { formatAr } from '../utils/formatAr';
import { useAccountOverview } from '../data/hooks/useAccountOverview';
import {
  AVATAR_COLORS,
  CURRENCIES,
  DEFAULT_PROFILE,
  LANGUAGES,
  getBooleanPref,
  getCurrency,
  getLanguage,
  getSalaireMensuel,
  getUserProfile,
  hasSecurityPin,
  setBooleanPref,
  setCurrency,
  setLanguage,
  setSalaireMensuel,
  setSecurityPin,
  setUserProfile,
} from '../utils/settingsStore';
import type { UserProfile } from '../utils/settingsStore';

function getInitials(name: string) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return initials || 'U';
}

function DialogShell({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 items-center justify-center px-6" onPress={onClose}>
        <Pressable className="bg-white rounded-3xl p-5 w-full" style={{ maxWidth: 400 }} onPress={(e) => e.stopPropagation()}>
          <Text className="text-idealy-text text-base font-bold mb-4">{title}</Text>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function ParametresScreen() {
  const navigation = useNavigation<any>();
  const account = useAccountOverview();

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [salaire, setSalaire] = useState(0);
  const [currency, setCurrencyState] = useState('Ar');
  const [language, setLanguageState] = useState('fr');
  const [pinConfigured, setPinConfigured] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [cloudSync, setCloudSync] = useState(false);
  const [autoBackup, setAutoBackup] = useState(false);

  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [salaryDialogVisible, setSalaryDialogVisible] = useState(false);
  const [currencyDialogVisible, setCurrencyDialogVisible] = useState(false);
  const [languageDialogVisible, setLanguageDialogVisible] = useState(false);
  const [pinDialogVisible, setPinDialogVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, s, c, l, pin, bio, sync, backup] = await Promise.all([
        getUserProfile(),
        getSalaireMensuel(),
        getCurrency(),
        getLanguage(),
        hasSecurityPin(),
        getBooleanPref('biometricEnabled'),
        getBooleanPref('cloudSyncEnabled'),
        getBooleanPref('autoBackupEnabled'),
      ]);
      setProfile(p);
      setSalaire(s);
      setCurrencyState(c);
      setLanguageState(l);
      setPinConfigured(pin);
      setBiometric(bio);
      setCloudSync(sync);
      setAutoBackup(backup);
    })();
  }, []);

  const handleLock = () => {
    if (!pinConfigured) {
      Alert.alert('Aucun code configuré', "Configurez d'abord un code PIN dans Sécurité pour pouvoir verrouiller l'application.");
      return;
    }
    navigation.navigate('WelcomeBack');
  };

  return (
    <View className="flex-1 bg-idealy-bg">
      <Header hasNotification={false} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="px-5">
          {/* Profile header */}
          <View className="items-center py-4">
            <View style={{ width: 96, height: 96 }} className="mb-3">
              <View
                className="w-full h-full rounded-full items-center justify-center"
                style={{ backgroundColor: profile.avatarColor }}
              >
                <Text className="text-white font-black text-3xl">{getInitials(profile.userName)}</Text>
              </View>
              <Pressable
                onPress={() => setEditProfileVisible(true)}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
                style={{ backgroundColor: IdealyColors.green }}
              >
                <Ionicons name="pencil" size={15} color="white" />
              </Pressable>
            </View>
            <Text className="text-idealy-text text-xl font-bold">{profile.userName}</Text>
            <Text className="text-idealy-muted text-sm mt-0.5">{profile.userEmail}</Text>
            <View className="mt-2 rounded-lg px-2.5 py-1" style={{ backgroundColor: IdealyColors.incomeBg }}>
              <Text className="text-xs font-bold" style={{ color: IdealyColors.green }}>
                {profile.userBio}
              </Text>
            </View>
          </View>

          {/* Stats overview */}
          <View className="bg-white rounded-3xl p-4 border border-black/5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: account.netBalance >= 0 ? IdealyColors.incomeBg : IdealyColors.expenseBg }}
                >
                  <Ionicons
                    name="wallet"
                    size={18}
                    color={account.netBalance >= 0 ? IdealyColors.green : IdealyColors.expense}
                  />
                </View>
                <View>
                  <Text className="text-idealy-muted text-xs">Solde Net Global</Text>
                  <Text
                    className="font-extrabold text-lg"
                    style={{ color: account.netBalance >= 0 ? IdealyColors.green : IdealyColors.expense }}
                  >
                    {formatAr(account.netBalance)}
                  </Text>
                </View>
              </View>
              <View className="rounded-xl px-2.5 py-1" style={{ backgroundColor: IdealyColors.bg }}>
                <Text className="text-idealy-text text-xs font-bold">{account.transactionCount} Tx</Text>
              </View>
            </View>

            <View className="h-px bg-black/5 my-3" />

            <View className="flex-row justify-between">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons name="arrow-up" size={13} color={IdealyColors.green} />
                  <Text className="text-idealy-muted text-xs ml-1">Revenus</Text>
                </View>
                <Text className="font-bold text-sm mt-0.5" style={{ color: IdealyColors.green }}>
                  {formatAr(account.income)}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons name="arrow-down" size={13} color={IdealyColors.expense} />
                  <Text className="text-idealy-muted text-xs ml-1">Dépenses</Text>
                </View>
                <Text className="font-bold text-sm mt-0.5" style={{ color: IdealyColors.expense }}>
                  {formatAr(account.expense)}
                </Text>
              </View>
            </View>
          </View>

          {/* Compte */}
          <View className="mt-6">
            <SettingsGroup title="Compte">
              <SettingsRowButton icon="person" title="Informations personnelles" onPress={() => setEditProfileVisible(true)} />
              <SettingsRowDivider />
              <SettingsRowButton
                icon="cash"
                title="Salaire mensuel"
                subtitle={formatAr(salaire)}
                onPress={() => setSalaryDialogVisible(true)}
              />
              <SettingsRowDivider />
              <SettingsRowButton
                icon="card"
                title="Sélection de devise"
                subtitle={currency}
                onPress={() => setCurrencyDialogVisible(true)}
              />
              <SettingsRowDivider />
              <SettingsRowButton
                icon="language"
                title="Langue de l'application"
                subtitle={LANGUAGES.find((l) => l.code === language)?.label ?? 'Français'}
                onPress={() => setLanguageDialogVisible(true)}
              />
            </SettingsGroup>
          </View>

          {/* Sécurité */}
          <View className="mt-6">
            <SettingsGroup title="Sécurité">
              <SettingsRowButton
                icon="lock-closed"
                title="Code PIN d'accès"
                subtitle={pinConfigured ? 'Configuré' : 'Non configuré'}
                onPress={() => setPinDialogVisible(true)}
              />
              <SettingsRowDivider />
              <SettingsRowSwitch
                icon="finger-print"
                title="Déverrouillage rapide"
                subtitle="Raccourci de déverrouillage sur l'écran de code PIN"
                checked={biometric}
                onCheckedChange={(value) => {
                  setBiometric(value);
                  setBooleanPref('biometricEnabled', value);
                }}
              />
            </SettingsGroup>
          </View>

          {/* Préférences */}
          <View className="mt-6">
            <SettingsGroup title="Préférences">
              <SettingsRowSwitch
                icon="sync"
                title="Synchronisation Cloud"
                subtitle="Sauvegarde vos données sur Firestore"
                checked={cloudSync}
                onCheckedChange={(value) => {
                  setCloudSync(value);
                  setBooleanPref('cloudSyncEnabled', value);
                }}
              />
              <SettingsRowDivider />
              <SettingsRowSwitch
                icon="cloud-upload"
                title="Sauvegarde automatique"
                subtitle="Sauvegarde locale périodique"
                checked={autoBackup}
                onCheckedChange={(value) => {
                  setAutoBackup(value);
                  setBooleanPref('autoBackupEnabled', value);
                }}
              />
            </SettingsGroup>
          </View>

          {/* Lock */}
          <Pressable
            onPress={handleLock}
            className="flex-row items-center justify-center rounded-2xl py-4 mt-6 border"
            style={{ borderColor: IdealyColors.green }}
          >
            <Ionicons name="lock-closed-outline" size={18} color={IdealyColors.green} />
            <Text className="font-bold text-sm ml-2" style={{ color: IdealyColors.green }}>
              Verrouiller l'application
            </Text>
          </Pressable>

          <Text className="text-idealy-muted text-xs text-center mt-6">Idealy v1.0.0 — Offline First & Sécurisé</Text>
        </View>
      </ScrollView>

      {/* Edit profile dialog */}
      <EditProfileDialog
        visible={editProfileVisible}
        profile={profile}
        onClose={() => setEditProfileVisible(false)}
        onSave={async (next) => {
          await setUserProfile(next);
          setProfile(next);
          setEditProfileVisible(false);
        }}
      />

      {/* Salary dialog */}
      <SalaryDialog
        visible={salaryDialogVisible}
        initial={salaire}
        onClose={() => setSalaryDialogVisible(false)}
        onSave={async (value) => {
          await setSalaireMensuel(value);
          setSalaire(value);
          setSalaryDialogVisible(false);
        }}
      />

      {/* Currency dialog */}
      <DialogShell visible={currencyDialogVisible} onClose={() => setCurrencyDialogVisible(false)} title="Sélection de devise">
        {CURRENCIES.map((option) => (
          <Pressable
            key={option.code}
            onPress={async () => {
              await setCurrency(option.code);
              setCurrencyState(option.code);
              setCurrencyDialogVisible(false);
            }}
            className="flex-row items-center justify-between py-3"
          >
            <View>
              <Text className="text-idealy-text text-sm font-semibold">{option.code}</Text>
              <Text className="text-idealy-muted text-xs">{option.label}</Text>
            </View>
            {currency === option.code && <Ionicons name="checkmark-circle" size={20} color={IdealyColors.green} />}
          </Pressable>
        ))}
        <Text className="text-idealy-muted text-[11px] mt-2">
          Les montants restent affichés en Ariary (Ar) dans le reste de l'application pour le moment.
        </Text>
      </DialogShell>

      {/* Language dialog */}
      <DialogShell visible={languageDialogVisible} onClose={() => setLanguageDialogVisible(false)} title="Langue de l'application">
        {LANGUAGES.map((option) => (
          <Pressable
            key={option.code}
            disabled={!option.available}
            onPress={async () => {
              await setLanguage(option.code);
              setLanguageState(option.code);
              setLanguageDialogVisible(false);
            }}
            className="flex-row items-center justify-between py-3"
            style={{ opacity: option.available ? 1 : 0.4 }}
          >
            <Text className="text-idealy-text text-sm font-semibold">{option.label}</Text>
            {!option.available ? (
              <Text className="text-idealy-muted text-xs">Bientôt</Text>
            ) : (
              language === option.code && <Ionicons name="checkmark-circle" size={20} color={IdealyColors.green} />
            )}
          </Pressable>
        ))}
      </DialogShell>

      {/* PIN dialog */}
      <PinDialog
        visible={pinDialogVisible}
        onClose={() => setPinDialogVisible(false)}
        onSave={async (pin) => {
          await setSecurityPin(pin);
          setPinConfigured(true);
          setPinDialogVisible(false);
        }}
      />
    </View>
  );
}

function EditProfileDialog({
  visible,
  profile,
  onClose,
  onSave,
}: {
  visible: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}) {
  const [name, setName] = useState(profile.userName);
  const [email, setEmail] = useState(profile.userEmail);
  const [bio, setBio] = useState(profile.userBio);
  const [color, setColor] = useState(profile.avatarColor);

  useEffect(() => {
    if (visible) {
      setName(profile.userName);
      setEmail(profile.userEmail);
      setBio(profile.userBio);
      setColor(profile.avatarColor);
    }
  }, [visible, profile]);

  return (
    <DialogShell visible={visible} onClose={onClose} title="Modifier mon profil">
      <Text className="text-idealy-muted text-xs mb-1">Prénom & nom</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        className="bg-idealy-bg rounded-xl px-3 py-2.5 mb-3 text-idealy-text"
      />
      <Text className="text-idealy-muted text-xs mb-1">Adresse email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        className="bg-idealy-bg rounded-xl px-3 py-2.5 mb-3 text-idealy-text"
      />
      <Text className="text-idealy-muted text-xs mb-1">Rôle / description</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        className="bg-idealy-bg rounded-xl px-3 py-2.5 mb-3 text-idealy-text"
      />
      <Text className="text-idealy-muted text-xs mb-2">Couleur de l'avatar</Text>
      <View className="flex-row mb-4" style={{ gap: 10 }}>
        {AVATAR_COLORS.map((c) => (
          <Pressable
            key={c}
            onPress={() => setColor(c)}
            className="rounded-full items-center justify-center"
            style={{
              width: 34,
              height: 34,
              backgroundColor: c,
              borderWidth: color === c ? 3 : 0,
              borderColor: 'white',
              shadowColor: '#000',
              shadowOpacity: color === c ? 0.3 : 0,
              shadowRadius: 4,
            }}
          />
        ))}
      </View>
      <View className="flex-row" style={{ gap: 10 }}>
        <Pressable onPress={onClose} className="flex-1 items-center py-3 rounded-xl border border-black/10">
          <Text className="text-idealy-text font-semibold text-sm">Annuler</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (!name.trim() || !email.trim()) return;
            onSave({ userName: name.trim(), userEmail: email.trim(), userBio: bio.trim() || 'Membre', avatarColor: color });
          }}
          className="flex-1 items-center py-3 rounded-xl"
          style={{ backgroundColor: IdealyColors.green }}
        >
          <Text className="text-white font-semibold text-sm">Enregistrer</Text>
        </Pressable>
      </View>
    </DialogShell>
  );
}

function SalaryDialog({
  visible,
  initial,
  onClose,
  onSave,
}: {
  visible: boolean;
  initial: number;
  onClose: () => void;
  onSave: (value: number) => void;
}) {
  const [value, setValue] = useState(initial > 0 ? String(initial) : '');

  useEffect(() => {
    if (visible) setValue(initial > 0 ? String(initial) : '');
  }, [visible, initial]);

  return (
    <DialogShell visible={visible} onClose={onClose} title="Salaire mensuel">
      <Text className="text-idealy-muted text-xs mb-3">
        Saisissez votre salaire mensuel récurrent. Il est affiché ici à titre indicatif.
      </Text>
      <TextInput
        value={value}
        onChangeText={(text) => setValue(text.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        placeholder="0"
        className="bg-idealy-bg rounded-xl px-3 py-2.5 mb-4 text-idealy-text text-base"
      />
      <View className="flex-row" style={{ gap: 10 }}>
        <Pressable onPress={onClose} className="flex-1 items-center py-3 rounded-xl border border-black/10">
          <Text className="text-idealy-text font-semibold text-sm">Annuler</Text>
        </Pressable>
        <Pressable
          onPress={() => onSave(Number(value) || 0)}
          className="flex-1 items-center py-3 rounded-xl"
          style={{ backgroundColor: IdealyColors.green }}
        >
          <Text className="text-white font-semibold text-sm">Enregistrer</Text>
        </Pressable>
      </View>
    </DialogShell>
  );
}

function PinDialog({ visible, onClose, onSave }: { visible: boolean; onClose: () => void; onSave: (pin: string) => void }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setPin('');
      setConfirmPin('');
      setError(null);
    }
  }, [visible]);

  const handleSave = () => {
    if (pin.length !== 4) {
      setError('Le code doit contenir 4 chiffres.');
      return;
    }
    if (pin !== confirmPin) {
      setError('Les deux codes ne correspondent pas.');
      return;
    }
    setError(null);
    onSave(pin);
  };

  return (
    <DialogShell visible={visible} onClose={onClose} title="Modifier le code PIN">
      <Text className="text-idealy-muted text-xs mb-1">Nouveau code (4 chiffres)</Text>
      <TextInput
        value={pin}
        onChangeText={(text) => setPin(text.replace(/[^0-9]/g, '').slice(0, 4))}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        className="bg-idealy-bg rounded-xl px-3 py-2.5 mb-3 text-idealy-text text-base"
      />
      <Text className="text-idealy-muted text-xs mb-1">Confirmer le code</Text>
      <TextInput
        value={confirmPin}
        onChangeText={(text) => setConfirmPin(text.replace(/[^0-9]/g, '').slice(0, 4))}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        className="bg-idealy-bg rounded-xl px-3 py-2.5 mb-2 text-idealy-text text-base"
      />
      {error && <Text className="text-idealy-expense text-xs mb-2">{error}</Text>}
      <View className="flex-row mt-2" style={{ gap: 10 }}>
        <Pressable onPress={onClose} className="flex-1 items-center py-3 rounded-xl border border-black/10">
          <Text className="text-idealy-text font-semibold text-sm">Annuler</Text>
        </Pressable>
        <Pressable onPress={handleSave} className="flex-1 items-center py-3 rounded-xl" style={{ backgroundColor: IdealyColors.green }}>
          <Text className="text-white font-semibold text-sm">Enregistrer</Text>
        </Pressable>
      </View>
    </DialogShell>
  );
}
