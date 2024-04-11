import type { PropsWithChildren } from 'react';
import React from 'react';
import type { AccessibilityProps, StyleProp, ViewStyle } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
interface Props {
    accessibilityActions: AccessibilityProps['accessibilityActions'];
    accessibilityLabel: AccessibilityProps['accessibilityLabel'];
    infinite?: boolean;
    onAccessibilityAction: AccessibilityProps['onAccessibilityAction'];
    onScrollEnd?: () => void;
    onScrollStart?: () => void;
    onTouchBegin?: () => void;
    onTouchEnd?: () => void;
    size: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
    translation: SharedValue<number>;
}
export declare const ScrollViewGesture: React.FC<PropsWithChildren<Props>>;
export {};
//# sourceMappingURL=ScrollViewGesture.d.ts.map