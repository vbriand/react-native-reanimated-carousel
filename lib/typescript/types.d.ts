/// <reference types="react" />
import type { AccessibilityProps, StyleProp, ViewStyle } from 'react-native';
import type { PanGesture } from 'react-native-gesture-handler';
import type { AnimatedStyle, SharedValue, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';
import type { TParallaxModeProps } from './layouts/parallax';
import type { TStackModeProps } from './layouts/stack';
export type IComputedDirectionTypes<T, VP = {}, HP = {}> = (HP & T & {
    height?: number;
    /**
     * Layout items vertically instead of horizontally
     */
    /**
     * Layout items vertically instead of horizontally
     */
    vertical?: false;
    /**
     * Specified carousel container width.
     */
    width: number;
}) | (T & VP & {
    height: number;
    /**
     * Layout items vertically instead of horizontally
     */
    /**
     * Layout items vertically instead of horizontally
     */
    vertical: true;
    /**
     * Specified carousel container width.
     */
    width?: number;
});
export interface CustomConfig {
    type?: 'negative' | 'positive';
    viewCount?: number;
}
export interface WithSpringAnimation {
    config: WithSpringConfig;
    type: 'spring';
}
export interface WithTimingAnimation {
    config: WithTimingConfig;
    type: 'timing';
}
export type WithAnimation = WithSpringAnimation | WithTimingAnimation;
export type TCarouselProps<T = any> = AccessibilityProps & {
    /**
     * Auto fill data array to allow loop playback when the loop props is true.
     * @default true
     * @example
     * [1] => [1, 1, 1]
     * [1, 2] => [1, 2, 1, 2]
     */
    autoFillData?: boolean;
    /**
     * Auto play
     */
    autoPlay?: boolean;
    /**
     * Auto play
     * @description playback interval
     */
    autoPlayInterval?: number;
    /**
     * Auto play
     * @description reverse playback
     */
    autoPlayReverse?: boolean;
    /**
     * Custom animations.
     * Must use `worklet`, Details: https://docs.swmansion.com/react-native-reanimated/docs/2.2.0/worklets/
     */
    customAnimation?: (value: number) => AnimatedStyle<ViewStyle>;
    /**
     * Custom carousel config.
     */
    customConfig?: () => CustomConfig;
    /**
     * Carousel items data set.
     */
    data: T[];
    /**
     * Default index
     * @default 0
     */
    defaultIndex?: number;
    /**
     * The default animated value of the carousel.
     */
    defaultScrollOffsetValue?: SharedValue<number>;
    /**
     * If enabled, releasing the touch will scroll to the nearest item.
     * valid when pagingEnabled=false
     * @deprecated please use snapEnabled instead
     */
    enableSnap?: boolean;
    /**
     * If false, Carousel will not respond to any gestures.
     * @default true
     */
    enabled?: boolean;
    /**
     * @experimental This API will be changed in the future.
     * If positive, the carousel will scroll to the positive direction and vice versa.
     * */
    fixedDirection?: 'negative' | 'positive';
    /**
     * Carousel loop playback.
     * @default true
     */
    loop?: boolean;
    /**
     * Maximum offset value for once scroll.
     * Carousel cannot scroll over than this value.
     * */
    maxScrollDistancePerSwipe?: number;
    /**
     * Minimum offset value for once scroll.
     * If the translation value is less than this value, the carousel will not scroll.
     * */
    minScrollDistancePerSwipe?: number;
    /**
     * PanGesture config
     */
    onConfigurePanGesture?: (panGesture: PanGesture) => void;
    /**
     * On progress change
     * @param offsetProgress Total of offset distance (0 390 780 ...)
     * @param absoluteProgress Convert to index (0 1 2 ...)
     */
    onProgressChange?: (offsetProgress: number, absoluteProgress: number) => void;
    /**
     * On scroll end
     */
    onScrollEnd?: (index: number) => void;
    /**
     * On scroll start
     */
    onScrollStart?: () => void;
    /**
     * Callback fired when navigating to an item.
     */
    onSnapToItem?: (index: number) => void;
    /**
     * If enabled, items will scroll to the first placement when scrolling past the edge rather than closing to the last. (previous conditions: loop=false)
     * @default true
     */
    overscrollEnabled?: boolean;
    /**
     * When true, the scroll view stops on multiples of the scroll view's size when scrolling.
     * @default true
     */
    pagingEnabled?: boolean;
    ref?: React.Ref<ICarouselInstance>;
    /**
     * Render carousel item.
     */
    renderItem: CarouselRenderItem<T>;
    /**
     * Time a scroll animation takes to finish
     * @default 500 (ms)
     */
    scrollAnimationDuration?: number;
    /**
     * If enabled, releasing the touch will scroll to the nearest item.
     * valid when pagingEnabled=false
     * @default true
     */
    snapEnabled?: boolean;
    /**
     * Carousel container style
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Used to locate this view in end-to-end tests.
     */
    testID?: string;
    /**
     * Determines the maximum number of items will respond to pan gesture events,
     * windowSize={11} will active visible item plus up to 5 items above and 5 below the viewpor,
     * Reducing this number will reduce the calculation of the animation value and may improve performance.
     * @default 0 all items will respond to pan gesture events.
     */
    windowSize?: number;
    /**
     * Specifies the scrolling animation effect.
     */
    withAnimation?: WithAnimation;
} & (TParallaxModeProps | TStackModeProps);
export interface ICarouselInstance {
    /**
     * Get current item index
     */
    getCurrentIndex: () => number;
    /**
     * Scroll to next item, it takes one optional argument (count),
     * which allows you to specify how many items to cross
     */
    next: (opts?: Omit<TCarouselActionOptions, 'index'>) => void;
    /**
     * Scroll to previous item, it takes one optional argument (count),
     * which allows you to specify how many items to cross
     */
    prev: (opts?: Omit<TCarouselActionOptions, 'index'>) => void;
    /**
     * Use value to scroll to a position where relative to the current position,
     * scrollTo(-2) is equivalent to prev(2), scrollTo(2) is equivalent to next(2)
     */
    scrollTo: (opts?: TCarouselActionOptions) => void;
}
export interface CarouselRenderItemInfo<ItemT> {
    animationValue: SharedValue<number>;
    index: number;
    item: ItemT;
}
export type CarouselRenderItem<ItemT> = (info: CarouselRenderItemInfo<ItemT>) => React.ReactElement;
export interface TCarouselActionOptions {
    animated?: boolean;
    count?: number;
    index?: number;
    onFinished?: () => void;
}
//# sourceMappingURL=types.d.ts.map