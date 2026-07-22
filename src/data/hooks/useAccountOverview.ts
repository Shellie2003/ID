import { useEffect, useState } from 'react';

import { database } from '../database';
import Transaction from '../database/models/Transaction';

export type AccountOverview = {
  loading: boolean;
  netBalance: number;
  income: number;
  expense: number;
  transactionCount: number;
};

/** All-time totals across every transaction, for the account summary card. */
export function useAccountOverview(): AccountOverview {
  const [state, setState] = useState<AccountOverview>({
    loading: true,
    netBalance: 0,
    income: 0,
    expense: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    const subscription = database
      .get<Transaction>('transactions')
      .query()
      .observe()
      .subscribe((transactions) => {
        let income = 0;
        let expense = 0;
        for (const tx of transactions) {
          if (tx.kind === 'income') income += tx.amount;
          else expense += tx.amount;
        }
        setState({
          loading: false,
          netBalance: income - expense,
          income,
          expense,
          transactionCount: transactions.length,
        });
      });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
