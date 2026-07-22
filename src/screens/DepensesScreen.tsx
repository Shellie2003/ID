import StubScreen from '../components/StubScreen';
import { IdealyColors } from '../theme/colors';

export default function DepensesScreen() {
  return (
    <StubScreen
      icon="arrow-down-circle-outline"
      title="Rapports & Dépenses"
      description="Le résumé exécutif, les tendances de flux de trésorerie et la liste filtrable des dépenses arrivent ici."
      accentColor={IdealyColors.expense}
      accentBg={IdealyColors.expenseBg}
    />
  );
}
