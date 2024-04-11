import React from 'react';
import type { ViewStyle } from 'react-native';
import type { AnimatedStyle, SharedValue } from 'react-native-reanimated';
import type { IVisibleRanges } from '../hooks/useVisibleRanges';
export type TAnimationStyle = (value: number) => AnimatedStyle<ViewStyle>;
export declare const BaseLayout: React.FC<{
    animationStyle: TAnimationStyle;
    children: (ctx: {
        animationValue: SharedValue<number>;
    }) => React.ReactElement;
    handlerOffset: SharedValue<number>;
    index: number;
    visibleRanges: IVisibleRanges;
}>;
//# sourceMappingURL=BaseLayout.d.ts.map