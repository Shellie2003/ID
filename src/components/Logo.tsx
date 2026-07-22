import Svg, { Circle, Path, Line } from 'react-native-svg';
import { IdealyColors } from '../theme/colors';

type LogoProps = {
  size?: number;
  /** Show the dark green circular background behind the gold ring. */
  withBackground?: boolean;
};

/**
 * Vector approximation of the Idealy monogram (gold ring + crossed "X" glyph
 * over a linked "oo" glyph on a deep green field), used until the exact
 * exported PNG (assets/images/logo.png) replaces it — see README.
 */
export default function Logo({ size = 96, withBackground = true }: LogoProps) {
  const stroke = IdealyColors.gold;
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {withBackground && <Circle cx="100" cy="100" r="98" fill={IdealyColors.green} />}
      <Circle cx="100" cy="100" r="86" fill="none" stroke={stroke} strokeWidth="7" />

      {/* Crossed "X" glyph */}
      <Line x1="62" y1="52" x2="138" y2="112" stroke={stroke} strokeWidth="9" strokeLinecap="round" />
      <Line x1="138" y1="52" x2="62" y2="112" stroke={stroke} strokeWidth="9" strokeLinecap="round" />
      <Line x1="100" y1="46" x2="100" y2="118" stroke={stroke} strokeWidth="9" strokeLinecap="round" />

      {/* Divider bar */}
      <Line x1="58" y1="126" x2="142" y2="126" stroke={stroke} strokeWidth="7" strokeLinecap="round" />

      {/* Linked "oo" glyph with descender, echoing the reference mark */}
      <Circle cx="80" cy="152" r="17" fill="none" stroke={stroke} strokeWidth="8" />
      <Circle cx="120" cy="152" r="17" fill="none" stroke={stroke} strokeWidth="8" />
      <Path d="M100 169 Q100 182 88 184" fill="none" stroke={stroke} strokeWidth="8" strokeLinecap="round" />
    </Svg>
  );
}
