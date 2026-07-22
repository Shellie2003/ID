# Idealy

Application de gestion de dépenses offline-first — React Native (Expo) + NativeWind (Tailwind) + Firebase.

## Stack

- **Expo (managed, TypeScript)** — `expo` SDK 57 / React Native 0.86 / React 19.
- **NativeWind v4** — Tailwind classes on native components (`tailwind.config.js` définit la palette `idealy-*`).
- **React Navigation** — Drawer (hamburger) englobant des Bottom Tabs (Accueil, Rapports, Ajouter, Budgets, Plus), plus une Stack racine pour la modale "Nouvelle dépense".
- **WatermelonDB** — base SQLite locale offline-first (`src/data/database`).
- **Firebase (Auth + Firestore)** — backend de synchronisation (`src/data/firebase.ts`, `src/data/database/sync.ts`).

## Démarrer

```bash
npm install
cp .env.example .env   # renseigner les clés Firebase (voir ci-dessous)
npm run web             # aperçu rapide dans le navigateur (NativeWind + navigation)
```

### ⚠️ WatermelonDB nécessite un dev client

WatermelonDB embarque du code natif (JSI/SQLite) : il **ne fonctionne pas dans Expo Go**. Pour lancer l'app sur téléphone/émulateur avec la base locale active :

```bash
npx expo prebuild
npx expo run:android   # ou: npx expo run:ios (macOS requis)
```

`npm run web` reste utile pour itérer rapidement sur l'UI (Dashboard, navigation, thème) : ces écrans utilisent des données mockées et ne touchent pas encore WatermelonDB.

> Note new architecture : le SDK 57 active la New Architecture par défaut. WatermelonDB fonctionne généralement avec, mais vérifiez au premier build natif — sinon désactivez-la via `newArchEnabled: false` dans `app.json`.

### Configurer Firebase

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com), activez **Authentication** et **Firestore**.
2. Récupérez la config web (Project settings → General → Your apps → SDK setup).
3. Remplissez `.env` avec les valeurs `EXPO_PUBLIC_FIREBASE_*` (voir `.env.example`).

## Logo

`src/components/Logo.tsx` est une **recréation vectorielle approximative** du monogramme doré (SVG), utilisée en attendant l'asset exact. Pour un rendu pixel-perfect :

1. Exportez le logo fourni en PNG (idéalement 512×512, fond transparent) sous `assets/images/logo.png`.
2. Dans `Logo.tsx`, remplacez le contenu SVG par un `<Image source={require('../../assets/images/logo.png')} />`.
3. Mettez aussi à jour `assets/icon.png` et `assets/android-icon-foreground.png` (app icon) avec ce même visuel.

## Structure

```
src/
  components/    Composants réutilisables (Header, BentoCard, ProgressGauge, TransactionRow, Logo, StubScreen)
  navigation/    RootNavigator (Stack) > RootDrawer (Drawer) > BottomTabs (Tabs)
  screens/       Dashboard (complet, données mockées) + écrans stub (Dépenses, Revenus, Budgets, Bazary, AI Copilot, Sécurité, Plus, Ajouter)
  data/
    firebase.ts        Init Auth + Firestore (persistence offline)
    database/          Schéma, modèles et instance WatermelonDB + stub de synchronisation Firestore
    mock/               Données mockées du Dashboard
  theme/colors.ts  Palette Idealy (miroir JS de tailwind.config.js, pour SVG/LinearGradient)
  utils/formatAr.ts Formatteur de devise "58 274 Ar"
```

## État actuel

- ✅ Thème NativeWind (palette verte/or "Idealy"), navigation Drawer + Tabs, Dashboard fidèle à la maquette (solde, bento grid, progression, transactions récentes), modale "Ajouter".
- ✅ Squelette de données offline-first (schéma WatermelonDB, config Firebase, stub de sync) prêt à être branché.
- ⏳ À faire : brancher les écrans Dépenses / Revenus / Budgets / Bazary / AI Copilot / Sécurité sur WatermelonDB (actuellement des stubs visuels), écrire les règles de sécurité Firestore, implémenter l'auth.
