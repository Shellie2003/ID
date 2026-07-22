import StubScreen from '../components/StubScreen';
import { IdealyColors } from '../theme/colors';

export default function BudgetScreen() {
  return (
    <StubScreen
      icon="pie-chart-outline"
      title="Budgets"
      description="Vos enveloppes budgétaires, seuils d'alerte et progression par catégorie arrivent ici."
      accentColor={IdealyColors.budgets}
      accentBg={IdealyColors.budgetsBg}
    />
  );
}
