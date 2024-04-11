import type { FC } from 'react';
import type { ViewStyle } from 'react-native';
import { type AnimatedStyle, type SharedValue } from 'react-native-reanimated';
import type { CarouselRenderItem } from '../types';
import type { TAnimationStyle } from './BaseLayout';
interface Props {
    autoFillData: boolean;
    customAnimation?: (value: number) => AnimatedStyle<ViewStyle>;
    data: any[];
    dataLength: number;
    handlerOffset: SharedValue<number>;
    layoutConfig: TAnimationStyle;
    loop: boolean;
    offsetX: SharedValue<number>;
    rawDataLength: number;
    renderItem: CarouselRenderItem<any>;
    size: number;
    windowSize?: number;
}
export declare const ItemRenderer: FC<Props>;
export {};
//# sourceMappingURL=ItemRenderer.d.ts.map