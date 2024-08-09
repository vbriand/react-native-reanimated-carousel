import type { TInitializeCarouselProps } from "./useInitProps";
import type { TAnimationStyle } from "../components/BaseLayout";
type TLayoutConfigOpts<T> = TInitializeCarouselProps<T> & {
    size: number;
};
export declare function useLayoutConfig<T>(opts: TLayoutConfigOpts<T>): TAnimationStyle;
export {};
