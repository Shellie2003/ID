import StubScreen from '../components/StubScreen';
import { IdealyColors } from '../theme/colors';

export default function RevenusScreen() {
  return (
    <StubScreen
      icon="wallet-outline"
      title="Revenus"
      description="Salaire, business, freelance et bonus — le suivi détaillé de vos revenus arrive ici."
      accentColor={IdealyColors.income}
      accentBg={IdealyColors.incomeBg}
    />
  );
}
