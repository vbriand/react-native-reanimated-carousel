import type { TCarouselProps } from '../types';
type TGetRequiredProps<P extends keyof TCarouselProps> = Record<P, Required<TCarouselProps>[P]>;
export type TInitializeCarouselProps<T> = TCarouselProps<T> & TGetRequiredProps<'autoFillData' | 'autoPlayInterval' | 'defaultIndex' | 'height' | 'loop' | 'scrollAnimationDuration' | 'width'> & {
    dataLength: number;
    rawData: T[];
    rawDataLength: number;
};
export declare function useInitProps<T>(props: TCarouselProps<T>): TInitializeCarouselProps<T>;
export {};
//# sourceMappingURL=useInitProps.d.ts.map