import { Image } from 'react-native';

type LogoProps = {
  size?: number;
  /** Kept for API compatibility; the exported artwork already includes its own circular field. */
  withBackground?: boolean;
};

export default function Logo({ size = 96 }: LogoProps) {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      resizeMode="cover"
    />
  );
}
