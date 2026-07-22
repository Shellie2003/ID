import type { Ionicons } from '@expo/vector-icons';
import { IdealyColors } from '../theme/colors';

export type CategoryMeta = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  subtitle: string;
};

export const BUDGET_CATEGORIES = [
  'Alimentation',
  'Transport',
  'Loyer & Factures',
  'Loisirs',
  'Santé',
  'Éducation',
  'Personnel',
  'Bazary',
] as const;

export type BudgetCategory = (typeof BUDGET_CATEGORIES)[number];

export const INCOME_CATEGORIES = ['Salaire', 'Freelance', 'Business', 'Bonus', 'Autre revenu'] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export const BAZARY_CATEGORIES = ['Alimentation', 'Hygiène', 'Maison', 'Autre'] as const;

export type BazaryCategory = (typeof BAZARY_CATEGORIES)[number];

const CATEGORY_META: Record<string, CategoryMeta> = {
  Alimentation: { icon: 'bag-outline', color: IdealyColors.expense, bg: IdealyColors.expenseBg, subtitle: 'Courses & Restaurants' },
  Transport: { icon: 'car-outline', color: IdealyColors.savings, bg: IdealyColors.savingsBg, subtitle: 'Carburant, Taxi, Bus' },
  'Loyer & Factures': { icon: 'home-outline', color: '#7C3AED', bg: '#EEE8FC', subtitle: 'Prêt, Loyer & Abonnements' },
  Loisirs: { icon: 'game-controller-outline', color: IdealyColors.bazary, bg: IdealyColors.bazaryBg, subtitle: 'Cinéma, Concerts, Hobbies' },
  Santé: { icon: 'medkit-outline', color: '#0891B2', bg: '#E0F4F8', subtitle: 'Soins, Pharmacie' },
  Éducation: { icon: 'book-outline', color: IdealyColors.ai, bg: IdealyColors.aiBg, subtitle: 'Livres, Formations' },
  Personnel: { icon: 'shirt-outline', color: IdealyColors.budgets, bg: IdealyColors.budgetsBg, subtitle: 'Vêtements, Bien-être' },
  Bazary: { icon: 'basket-outline', color: IdealyColors.bazary, bg: IdealyColors.bazaryBg, subtitle: 'Ma liste de courses' },
  Salaire: { icon: 'wallet-outline', color: IdealyColors.income, bg: IdealyColors.incomeBg, subtitle: 'Revenu fixe' },
  Freelance: { icon: 'laptop-outline', color: IdealyColors.income, bg: IdealyColors.incomeBg, subtitle: 'Missions & prestations' },
  Business: { icon: 'briefcase-outline', color: IdealyColors.income, bg: IdealyColors.incomeBg, subtitle: 'Activité commerciale' },
  Bonus: { icon: 'gift-outline', color: IdealyColors.income, bg: IdealyColors.incomeBg, subtitle: 'Prime & gratification' },
  'Autre revenu': { icon: 'cash-outline', color: IdealyColors.income, bg: IdealyColors.incomeBg, subtitle: 'Revenu divers' },
  Hygiène: { icon: 'water-outline', color: '#0891B2', bg: '#E0F4F8', subtitle: 'Savon, produits ménagers' },
  Maison: { icon: 'home-outline', color: '#7C3AED', bg: '#EEE8FC', subtitle: 'Entretien & équipement' },
  Autre: { icon: 'ellipsis-horizontal-circle-outline', color: IdealyColors.muted, bg: '#EEF0F2', subtitle: 'Divers' },
};

const DEFAULT_EXPENSE_META: CategoryMeta = {
  icon: 'pricetag-outline',
  color: IdealyColors.muted,
  bg: '#EEF0F2',
  subtitle: 'Enveloppe budgétaire',
};

const DEFAULT_INCOME_META: CategoryMeta = {
  icon: 'cash-outline',
  color: IdealyColors.income,
  bg: IdealyColors.incomeBg,
  subtitle: 'Revenu',
};

export function getCategoryMeta(category: string, kind?: 'income' | 'expense'): CategoryMeta {
  return CATEGORY_META[category] ?? (kind === 'income' ? DEFAULT_INCOME_META : DEFAULT_EXPENSE_META);
}
