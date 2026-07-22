import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { idealySchema } from './schema';
import Transaction from './models/Transaction';
import BudgetEnvelope from './models/BudgetEnvelope';
import BazaryItem from './models/BazaryItem';

// Offline-first local store. All screens read/write here first; Firestore
// sync (see sync.ts) is a background concern layered on top.
//
// Note: WatermelonDB ships native (JSI) code, so it does NOT run inside
// Expo Go. Build a dev client first: `npx expo prebuild && npx expo run:android`
// (or `run:ios`) — see README.md.
const adapter = new SQLiteAdapter({
  schema: idealySchema,
  jsi: true,
  onSetUpError: (error) => {
    console.error('[WatermelonDB] Failed to set up database', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Transaction, BudgetEnvelope, BazaryItem],
});
