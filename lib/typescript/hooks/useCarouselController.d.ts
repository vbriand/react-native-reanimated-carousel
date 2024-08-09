import type Animated from "react-native-reanimated";
import type { TCarouselActionOptions, TCarouselProps } from "../types";
interface IOpts {
    loop: boolean;
    size: number;
    dataLength: number;
    handlerOffset: Animated.SharedValue<number>;
    autoFillData: TCarouselProps["autoFillData"];
    withAnimation?: TCarouselProps["withAnimation"];
    fixedDirection?: TCarouselProps["fixedDirection"];
    duration?: number;
    defaultIndex?: number;
    onScrollStart?: () => void;
    onScrollEnd?: () => void;
}
export interface ICarouselController {
    getSharedIndex: () => number;
    prev: (opts?: TCarouselActionOptions) => void;
    next: (opts?: TCarouselActionOptions) => void;
    getCurrentIndex: () => number;
    scrollTo: (opts?: TCarouselActionOptions) => void;
}
export declare function useCarouselController(options: IOpts): ICarouselController;
export {};
