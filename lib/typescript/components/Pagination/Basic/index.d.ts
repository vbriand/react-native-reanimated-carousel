import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import type { DotStyle } from "./PaginationItem";
export interface BasicProps<T extends {} = {}> {
    progress: SharedValue<number>;
    horizontal?: boolean;
    data: Array<T>;
    renderItem?: (item: T, index: number) => React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    dotStyle?: DotStyle;
    activeDotStyle?: DotStyle;
    size?: number;
    onPress?: (index: number) => void;
}
export declare const Basic: <T extends {}>(props: BasicProps<T>) => React.JSX.Element;
