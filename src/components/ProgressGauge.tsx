import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type ProgressGaugeProps = {
  percent: number;
  color: string;
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
};

export default function ProgressGauge({
  percent,
  color,
  trackColor = '#E9ECEF',
  size = 76,
  strokeWidth = 7,
}: ProgressGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - clamped / 100);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={center} cy={center} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <Text className="text-idealy-text font-bold" style={{ fontSize: size * 0.22 }}>
        {clamped}%
      </Text>
    </View>
  );
}
