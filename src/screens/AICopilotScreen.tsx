import StubScreen from '../components/StubScreen';
import { IdealyColors } from '../theme/colors';

export default function AICopilotScreen() {
  return (
    <StubScreen
      icon="sparkles-outline"
      title="AI Copilot"
      description="Un chat conversationnel avec des suggestions rapides et des conseils financiers personnalisés arrive ici."
      accentColor={IdealyColors.ai}
      accentBg={IdealyColors.aiBg}
    />
  );
}
