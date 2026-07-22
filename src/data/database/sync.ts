import { synchronize } from '@nozbe/watermelondb/sync';
import type { SyncDatabaseChangeSet, SyncTableChangeSet } from '@nozbe/watermelondb/sync';
import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';

import { database } from './index';
import { firestore } from '../firebase';

/**
 * Pulls remote changes from Firestore into WatermelonDB and pushes local
 * changes back, using each table name as its Firestore collection name.
 * Call this opportunistically (on reconnect, app foreground, pull-to-refresh) —
 * every screen keeps working offline whether or not this has run.
 *
 * This is a stub wiring the two data stores together; flesh out the
 * per-collection pull/push queries once auth + a Firestore data model
 * (e.g. `users/{uid}/transactions`) are in place.
 */
export async function synchronizeWithFirestore(userId: string) {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const since = lastPulledAt ? new Date(lastPulledAt) : new Date(0);
      const changes: Record<string, SyncTableChangeSet> = {};

      for (const table of ['transactions', 'budget_envelopes', 'bazary_items'] as const) {
        const snapshot = await getDocs(
          query(collection(firestore, `users/${userId}/${table}`), where('updatedAt', '>', since))
        );
        changes[table] = {
          created: [],
          updated: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
          deleted: [],
        };
      }

      return { changes: changes as SyncDatabaseChangeSet, timestamp: Date.now() };
    },
    pushChanges: async ({ changes }) => {
      const batch = writeBatch(firestore);
      const changesByTable = changes as Record<string, SyncTableChangeSet>;
      for (const table of Object.keys(changesByTable)) {
        const { created, updated, deleted } = changesByTable[table];
        const tableCollection = collection(firestore, `users/${userId}/${table}`);
        for (const record of [...created, ...updated]) {
          batch.set(doc(tableCollection, record.id as string), record, { merge: true });
        }
        for (const id of deleted) {
          batch.delete(doc(tableCollection, id));
        }
      }
      await batch.commit();
    },
  });
}
