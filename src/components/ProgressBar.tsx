import { View } from 'react-native';

type ProgressBarProps = {
  percent: number;
  color: string;
  trackColor?: string;
  height?: number;
};

export default function ProgressBar({ percent, color, trackColor = '#EEF0F2', height = 10 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: trackColor, overflow: 'hidden' }}>
      <View style={{ width: `${clamped}%`, height: '100%', borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}
