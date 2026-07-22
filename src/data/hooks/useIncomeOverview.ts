import { useEffect, useState } from 'react';
import { Q } from '@nozbe/watermelondb';

import { database } from '../database';
import Transaction from '../database/models/Transaction';
import { getPeriodRange } from '../../utils/date';
import type { ReportPeriod } from '../../utils/date';
import { getSalaireMensuel } from '../../utils/settingsStore';

export type IncomeCategoryEntry = {
  category: string;
  amount: number;
  percent: number;
};

export type IncomeOverview = {
  loading: boolean;
  total: number;
  byCategory: IncomeCategoryEntry[];
  recent: Transaction[];
  salaireMensuel: number;
  salaireLoggedThisMonth: boolean;
};

export function useIncomeOverview(period: ReportPeriod): IncomeOverview {
  const [state, setState] = useState<IncomeOverview>({
    loading: true,
    total: 0,
    byCategory: [],
    recent: [],
    salaireMensuel: 0,
    salaireLoggedThisMonth: false,
  });

  useEffect(() => {
    getSalaireMensuel().then((salaireMensuel) => setState((prev) => ({ ...prev, salaireMensuel })));
  }, []);

  useEffect(() => {
    const { start, end } = getPeriodRange(period);
    const monthRange = getPeriodRange('month');

    const income$ = database
      .get<Transaction>('transactions')
      .query(Q.where('kind', 'income'), Q.where('occurred_at', Q.between(start, end - 1)), Q.sortBy('occurred_at', Q.desc))
      .observe();

    const monthIncome$ = database
      .get<Transaction>('transactions')
      .query(
        Q.where('kind', 'income'),
        Q.where('category', 'Salaire'),
        Q.where('occurred_at', Q.between(monthRange.start, monthRange.end - 1))
      )
      .observe();

    const sub1 = income$.subscribe((transactions) => {
      const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      const byCategoryMap = new Map<string, number>();
      for (const tx of transactions) {
        byCategoryMap.set(tx.category, (byCategoryMap.get(tx.category) ?? 0) + tx.amount);
      }
      const byCategory = Array.from(byCategoryMap.entries())
        .map(([category, amount]) => ({ category, amount, percent: total > 0 ? (amount / total) * 100 : 0 }))
        .sort((a, b) => b.amount - a.amount);

      setState((prev) => ({ ...prev, loading: false, total, byCategory, recent: transactions.slice(0, 20) }));
    });

    const sub2 = monthIncome$.subscribe((salaireTx) => {
      setState((prev) => ({ ...prev, salaireLoggedThisMonth: salaireTx.length > 0 }));
    });

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, [period]);

  return state;
}
