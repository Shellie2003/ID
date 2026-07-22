import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { Q } from '@nozbe/watermelondb';

import { database } from '../database';
import BudgetEnvelope from '../database/models/BudgetEnvelope';
import Transaction from '../database/models/Transaction';

export type CategoryBudgetInfo = {
  envelope: BudgetEnvelope;
  totalDepense: number;
  pourcentage: number; // 0-100+, can exceed 100 when over budget
};

function currentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
  return { start, end };
}

/** Live budget envelopes joined with this month's expense totals per category. */
export function useBudgetOverview() {
  const [categories, setCategories] = useState<CategoryBudgetInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { start, end } = currentMonthRange();

    const envelopes$ = database
      .get<BudgetEnvelope>('budget_envelopes')
      .query(Q.sortBy('created_at', Q.asc))
      .observe();

    const expenses$ = database
      .get<Transaction>('transactions')
      .query(Q.where('kind', 'expense'), Q.where('occurred_at', Q.between(start, end - 1)))
      .observe();

    const subscription = combineLatest([envelopes$, expenses$]).subscribe(([envelopes, expenses]) => {
      const spendByCategory = new Map<string, number>();
      for (const tx of expenses) {
        spendByCategory.set(tx.category, (spendByCategory.get(tx.category) ?? 0) + tx.amount);
      }

      setCategories(
        envelopes.map((envelope) => {
          const totalDepense = spendByCategory.get(envelope.category) ?? 0;
          const pourcentage = envelope.limitAmount > 0 ? (totalDepense / envelope.limitAmount) * 100 : 0;
          return { envelope, totalDepense, pourcentage };
        })
      );
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { categories, loading };
}

export async function createBudgetEnvelope(input: {
  name: string;
  category: string;
  color: string;
  icon: string;
  limitAmount: number;
  alertLevel1?: number;
  alertLevel2?: number;
  rolloverEnabled?: boolean;
}) {
  await database.write(async () => {
    await database.get<BudgetEnvelope>('budget_envelopes').create((envelope) => {
      envelope.name = input.name;
      envelope.category = input.category;
      envelope.color = input.color;
      envelope.icon = input.icon;
      envelope.limitAmount = input.limitAmount;
      envelope.alertLevel1 = input.alertLevel1 ?? 80;
      envelope.alertLevel2 = input.alertLevel2 ?? 100;
      envelope.rolloverEnabled = input.rolloverEnabled ?? false;
    });
  });
}

export async function toggleEnvelopeRollover(envelope: BudgetEnvelope) {
  await database.write(async () => {
    await envelope.update((record) => {
      record.rolloverEnabled = !record.rolloverEnabled;
    });
  });
}
