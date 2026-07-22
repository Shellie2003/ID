import { Text, View } from 'react-native';
import { IdealyColors } from '../theme/colors';
import type { TrendPoint } from '../data/hooks/useReportsOverview';

type TrendBarChartProps = {
  data: TrendPoint[];
  height?: number;
};

/** Diverging bar chart of net cash flow (income - expense) per bucket, growing up/down from a zero line. */
export default function TrendBarChart({ data, height = 120 }: TrendBarChartProps) {
  const maxAbs = Math.max(1, ...data.map((point) => Math.abs(point.net)));
  const halfHeight = height / 2;
  const maxBarHeight = halfHeight - 6;

  return (
    <View style={{ height: height + 20 }}>
      <View style={{ height, position: 'relative' }} className="flex-row">
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: halfHeight, left: 0, right: 0, height: 1, backgroundColor: '#E5E7EB' }}
        />
        {data.map((point, index) => {
          const barHeight = (Math.abs(point.net) / maxAbs) * maxBarHeight;
          const isPositive = point.net >= 0;
          return (
            <View key={`${point.label}-${index}`} style={{ flex: 1 }} className="items-center">
              <View style={{ height: halfHeight, justifyContent: 'flex-end' }}>
                {isPositive && barHeight > 0 && (
                  <View style={{ width: 8, height: barHeight, borderRadius: 4, backgroundColor: IdealyColors.income }} />
                )}
              </View>
              <View style={{ height: halfHeight, justifyContent: 'flex-start' }}>
                {!isPositive && barHeight > 0 && (
                  <View style={{ width: 8, height: barHeight, borderRadius: 4, backgroundColor: IdealyColors.expense }} />
                )}
              </View>
            </View>
          );
        })}
      </View>
      <View className="flex-row mt-1">
        {data.map((point, index) => (
          <Text key={`${point.label}-${index}`} style={{ flex: 1 }} className="text-idealy-muted text-[10px] text-center">
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
}
