// `getReactNativePersistence` is exported by the React Native build of
// @firebase/auth (dist/rn/index.rn.d.ts). Metro resolves that build correctly
// at runtime via the package's "react-native" export condition, but plain
// `tsc` resolves the generic web typings first (the exports map lists the
// unconditional "types" condition before "react-native"), which omit it.
// This augmentation only restores the type for editor/tsc purposes.
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
