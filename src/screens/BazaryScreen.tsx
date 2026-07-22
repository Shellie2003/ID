import StubScreen from '../components/StubScreen';
import { IdealyColors } from '../theme/colors';

export default function BazaryScreen() {
  return (
    <StubScreen
      icon="basket-outline"
      title="Bazary"
      description="Votre liste de courses avec cases à cocher, ajout rapide d'articles et catégories arrive ici."
      accentColor={IdealyColors.bazary}
      accentBg={IdealyColors.bazaryBg}
    />
  );
}
