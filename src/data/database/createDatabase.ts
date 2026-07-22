import type { DatabaseAdapter } from '@nozbe/watermelondb/adapters/type';
import { Database } from '@nozbe/watermelondb';

import Transaction from './models/Transaction';
import BudgetEnvelope from './models/BudgetEnvelope';
import BazaryItem from './models/BazaryItem';

export const onSetUpError = (error: Error) => {
  console.error('[WatermelonDB] Failed to set up database', error);
};

export function createDatabase(adapter: DatabaseAdapter) {
  return new Database({
    adapter,
    modelClasses: [Transaction, BudgetEnvelope, BazaryItem],
  });
}
