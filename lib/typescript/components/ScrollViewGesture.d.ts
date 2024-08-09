import type { PropsWithChildren } from "react";
import React from "react";
import type { AccessibilityProps, StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
interface Props extends AccessibilityProps {
    size: number;
    infinite?: boolean;
    testID?: string;
    style?: StyleProp<ViewStyle>;
    onScrollStart?: () => void;
    onScrollEnd?: () => void;
    onTouchBegin?: () => void;
    onTouchEnd?: () => void;
    translation: Animated.SharedValue<number>;
}
export declare const ScrollViewGesture: React.FC<PropsWithChildren<Props>>;
export {};
