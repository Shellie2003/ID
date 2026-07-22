import type { TransactionRowData } from '../../components/TransactionRow';

export const mockSummary = {
  netBalance: 58274,
  netBalanceChangePercent: 12,
  income: { total: 452000, goal: 660000 },
  expense: { total: 243726, goal: 500000 },
  savings: { total: 208274, goal: 660000 },
  budgetsActive: 5,
  bazaryItems: 6,
};

export const mockTransactions: TransactionRowData[] = [
  {
    id: '1',
    title: 'Achat nourriture',
    category: 'Alimentation',
    amount: 12000,
    kind: 'expense',
    dateLabel: "Aujourd'hui",
    icon: 'bag-outline',
    iconColor: '#E11D48',
    iconBg: '#FCE7ED',
  },
  {
    id: '2',
    title: 'Salaire',
    category: 'Revenu',
    amount: 400000,
    kind: 'income',
    dateLabel: 'Hier',
    icon: 'wallet-outline',
    iconColor: '#16A34A',
    iconBg: '#E5F5EC',
  },
  {
    id: '3',
    title: 'Vêtement',
    category: 'Personnel',
    amount: 25000,
    kind: 'expense',
    dateLabel: 'Hier',
    icon: 'shirt-outline',
    iconColor: '#C9971C',
    iconBg: '#FBF0D9',
  },
];
