import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { idealySchema } from './schema';
import { createDatabase, onSetUpError } from './createDatabase';

// Offline-first local store. All screens read/write here first; Firestore
// sync (see sync.ts) is a background concern layered on top.
//
// This native entry point (Metro resolves index.web.ts on web instead) uses
// the SQLite (JSI) adapter, which does NOT run inside Expo Go — a dev client
// is required: `npx expo prebuild && npx expo run:android` (or `run:ios`),
// see README.md.
export const database = createDatabase(
  new SQLiteAdapter({
    schema: idealySchema,
    jsi: true,
    onSetUpError,
  })
);
