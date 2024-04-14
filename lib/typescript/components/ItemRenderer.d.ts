import type { FC } from "react";
import type { ViewStyle } from "react-native";
import type Animated from "react-native-reanimated";
import { type AnimatedStyleProp } from "react-native-reanimated";
import type { TAnimationStyle } from "./BaseLayout";
import type { CarouselRenderItem } from "../types";
interface Props {
    data: any[];
    dataLength: number;
    rawDataLength: number;
    loop: boolean;
    size: number;
    windowSize?: number;
    autoFillData: boolean;
    offsetX: Animated.SharedValue<number>;
    handlerOffset: Animated.SharedValue<number>;
    layoutConfig: TAnimationStyle;
    renderItem: CarouselRenderItem<any>;
    customAnimation?: ((value: number) => AnimatedStyleProp<ViewStyle>);
}
export declare const ItemRenderer: FC<Props>;
export {};
