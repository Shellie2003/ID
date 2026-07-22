import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { Q } from '@nozbe/watermelondb';

import { database } from '../database';
import Transaction from '../database/models/Transaction';
import { formatRelativeDateLabel, getPeriodRange, getPreviousPeriodRange, getTrendBuckets } from '../../utils/date';
import type { ReportPeriod } from '../../utils/date';

export type CategoryBreakdownEntry = {
  category: string;
  amount: number;
  percent: number;
};

export type TrendPoint = {
  label: string;
  net: number;
};

export type TransactionGroup = {
  dateLabel: string;
  items: Transaction[];
};

export type ReportsOverview = {
  loading: boolean;
  income: number;
  expense: number;
  net: number;
  netChangePercent: number | null;
  categoryBreakdown: CategoryBreakdownEntry[];
  trend: TrendPoint[];
  transactionGroups: TransactionGroup[];
};

function sumByKind(transactions: Transaction[], kind: 'income' | 'expense') {
  return transactions.reduce((sum, tx) => (tx.kind === kind ? sum + tx.amount : sum), 0);
}

export function useReportsOverview(period: ReportPeriod): ReportsOverview {
  const [state, setState] = useState<ReportsOverview>({
    loading: true,
    income: 0,
    expense: 0,
    net: 0,
    netChangePercent: null,
    categoryBreakdown: [],
    trend: [],
    transactionGroups: [],
  });

  useEffect(() => {
    const { start, end } = getPeriodRange(period);
    const previous = getPreviousPeriodRange(period);

    const current$ = database
      .get<Transaction>('transactions')
      .query(Q.where('occurred_at', Q.between(start, end - 1)), Q.sortBy('occurred_at', Q.desc))
      .observe();

    const previous$ = database
      .get<Transaction>('transactions')
      .query(Q.where('occurred_at', Q.between(previous.start, previous.end - 1)))
      .observe();

    const subscription = combineLatest([current$, previous$]).subscribe(([current, previousTx]) => {
      const income = sumByKind(current, 'income');
      const expense = sumByKind(current, 'expense');
      const net = income - expense;

      const previousNet = sumByKind(previousTx, 'income') - sumByKind(previousTx, 'expense');
      const netChangePercent =
        previousNet !== 0 ? Math.round(((net - previousNet) / Math.abs(previousNet)) * 100) : null;

      const expenseByCategory = new Map<string, number>();
      for (const tx of current) {
        if (tx.kind !== 'expense') continue;
        expenseByCategory.set(tx.category, (expenseByCategory.get(tx.category) ?? 0) + tx.amount);
      }
      const categoryBreakdown = Array.from(expenseByCategory.entries())
        .map(([category, amount]) => ({ category, amount, percent: expense > 0 ? (amount / expense) * 100 : 0 }))
        .sort((a, b) => b.amount - a.amount);

      const buckets = getTrendBuckets(period);
      const trend = buckets.map((bucket) => {
        const inBucket = current.filter((tx) => {
          const t = tx.occurredAt.getTime();
          return t >= bucket.start && t < bucket.end;
        });
        return { label: bucket.label, net: sumByKind(inBucket, 'income') - sumByKind(inBucket, 'expense') };
      });

      const groups = new Map<string, Transaction[]>();
      for (const tx of current) {
        const label = formatRelativeDateLabel(tx.occurredAt);
        if (!groups.has(label)) groups.set(label, []);
        groups.get(label)!.push(tx);
      }
      const transactionGroups = Array.from(groups.entries()).map(([dateLabel, items]) => ({ dateLabel, items }));

      setState({ loading: false, income, expense, net, netChangePercent, categoryBreakdown, trend, transactionGroups });
    });

    return () => subscription.unsubscribe();
  }, [period]);

  return state;
}

export function useRecentTransactions(limit: number) {
  const [state, setState] = useState<{ loading: boolean; transactions: Transaction[] }>({
    loading: true,
    transactions: [],
  });

  useEffect(() => {
    const subscription = database
      .get<Transaction>('transactions')
      .query(Q.sortBy('occurred_at', Q.desc), Q.take(limit))
      .observe()
      .subscribe((transactions) => setState({ loading: false, transactions }));

    return () => subscription.unsubscribe();
  }, [limit]);

  return state;
}

export async function createTransaction(input: {
  kind: 'income' | 'expense';
  amount: number;
  title: string;
  category: string;
  note?: string;
  occurredAt?: Date;
}) {
  await database.write(async () => {
    await database.get<Transaction>('transactions').create((tx) => {
      tx.kind = input.kind;
      tx.amount = input.amount;
      tx.title = input.title;
      tx.category = input.category;
      tx.note = input.note;
      tx.occurredAt = input.occurredAt ?? new Date();
    });
  });
}

export async function deleteTransaction(transaction: Transaction) {
  await database.write(async () => {
    await transaction.markAsDeleted();
  });
}
