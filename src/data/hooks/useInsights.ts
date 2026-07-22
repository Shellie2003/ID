import type { Ionicons } from '@expo/vector-icons';
import { IdealyColors } from '../../theme/colors';
import { formatAr } from '../../utils/formatAr';
import { useReportsOverview } from './useReportsOverview';
import { useBudgetOverview } from './useBudgetOverview';

export type InsightSeverity = 'danger' | 'warning' | 'success' | 'info';

export type Insight = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  severity: InsightSeverity;
  title: string;
  message: string;
};

const SEVERITY_STYLE: Record<InsightSeverity, { color: string; bg: string }> = {
  danger: { color: IdealyColors.expense, bg: IdealyColors.expenseBg },
  warning: { color: '#D97706', bg: '#FEF3C7' },
  success: { color: IdealyColors.green, bg: IdealyColors.incomeBg },
  info: { color: IdealyColors.savings, bg: IdealyColors.savingsBg },
};

export function insightStyle(severity: InsightSeverity) {
  return SEVERITY_STYLE[severity];
}

const SEVERITY_RANK: Record<InsightSeverity, number> = { danger: 0, warning: 1, success: 2, info: 3 };

/**
 * Rule-based financial insights computed live from the user's own data —
 * no external AI service is called (no API key is configured for one).
 */
export function useInsights() {
  const reports = useReportsOverview('month');
  const budgets = useBudgetOverview();

  const loading = reports.loading || budgets.loading;
  const insights: Insight[] = [];

  if (!loading) {
    const overBudget = budgets.categories.filter((c) => c.pourcentage >= 100);
    const nearLimit = budgets.categories.filter((c) => c.pourcentage >= 80 && c.pourcentage < 100);

    for (const entry of overBudget) {
      const over = entry.totalDepense - entry.envelope.limitAmount;
      insights.push({
        id: `over-${entry.envelope.id}`,
        icon: 'alert-circle',
        severity: 'danger',
        title: `Budget "${entry.envelope.name}" dépassé`,
        message: `Vous avez dépassé cette enveloppe de ${formatAr(over)} ce mois-ci.`,
      });
    }

    for (const entry of nearLimit) {
      insights.push({
        id: `near-${entry.envelope.id}`,
        icon: 'warning',
        severity: 'warning',
        title: `Budget "${entry.envelope.name}" bientôt atteint`,
        message: `${entry.pourcentage.toFixed(0)}% de l'enveloppe déjà utilisée ce mois-ci.`,
      });
    }

    if (budgets.categories.length === 0) {
      insights.push({
        id: 'no-budgets',
        icon: 'pie-chart-outline',
        severity: 'info',
        title: 'Aucune enveloppe budgétaire',
        message: 'Créez votre première enveloppe dans Budgets pour suivre vos dépenses par catégorie.',
      });
    }

    if (reports.income === 0 && reports.expense === 0) {
      insights.push({
        id: 'no-activity',
        icon: 'file-tray-outline',
        severity: 'info',
        title: 'Aucune activité ce mois-ci',
        message: 'Ajoutez vos premiers revenus et dépenses pour recevoir des conseils personnalisés.',
      });
    } else {
      if (reports.net < 0) {
        insights.push({
          id: 'negative-net',
          icon: 'trending-down',
          severity: 'danger',
          title: 'Dépenses supérieures aux revenus',
          message: `Vous êtes en déficit de ${formatAr(Math.abs(reports.net))} ce mois-ci.`,
        });
      } else if (reports.income > 0) {
        const savingsRate = (reports.net / reports.income) * 100;
        if (savingsRate >= 20) {
          insights.push({
            id: 'good-savings-rate',
            icon: 'trending-up',
            severity: 'success',
            title: 'Excellent rythme d’épargne',
            message: `Vous épargnez ${savingsRate.toFixed(0)}% de vos revenus ce mois-ci — continuez ainsi.`,
          });
        } else if (savingsRate < 10) {
          insights.push({
            id: 'low-savings-rate',
            icon: 'information-circle',
            severity: 'info',
            title: 'Marge d’épargne réduite',
            message: `Seulement ${savingsRate.toFixed(0)}% de vos revenus sont épargnés ce mois-ci.`,
          });
        }
      }

      if (reports.netChangePercent !== null) {
        if (reports.netChangePercent <= -20) {
          insights.push({
            id: 'net-down',
            icon: 'arrow-down-circle',
            severity: 'warning',
            title: 'Flux net en baisse',
            message: `Votre solde net a reculé de ${Math.abs(reports.netChangePercent)}% par rapport à la période précédente.`,
          });
        } else if (reports.netChangePercent >= 20) {
          insights.push({
            id: 'net-up',
            icon: 'arrow-up-circle',
            severity: 'success',
            title: 'Flux net en progression',
            message: `Votre solde net a progressé de ${reports.netChangePercent}% par rapport à la période précédente.`,
          });
        }
      }

      const topCategory = reports.categoryBreakdown[0];
      if (topCategory && topCategory.percent >= 40) {
        insights.push({
          id: 'top-category',
          icon: 'pricetag',
          severity: 'info',
          title: `"${topCategory.category}" domine vos dépenses`,
          message: `Cette catégorie représente ${topCategory.percent.toFixed(0)}% de vos dépenses ce mois-ci (${formatAr(topCategory.amount)}).`,
        });
      }
    }
  }

  insights.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);

  return { loading, insights };
}
