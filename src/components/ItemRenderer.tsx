import type { FC } from 'react';
import React from 'react';
import type { ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';
import {
  type AnimatedStyle,
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';

import type { VisibleRanges } from '../hooks/useVisibleRanges';
import { useVisibleRanges } from '../hooks/useVisibleRanges';
import type { CarouselRenderItem } from '../types';
import { computedRealIndexWithAutoFillData } from '../utils/computed-with-auto-fill-data';

import type { TAnimationStyle } from './BaseLayout';
import { BaseLayout } from './BaseLayout';

interface Props {
  autoFillData: boolean;
  customAnimation?: (value: number) => AnimatedStyle<ViewStyle>;
  data: any[];
  dataLength: number;
  handlerOffset: Animated.SharedValue<number>;
  layoutConfig: TAnimationStyle;
  loop: boolean;
  offsetX: SharedValue<number>;
  rawDataLength: number;
  renderItem: CarouselRenderItem<any>;
  size: number;
  windowSize?: number;
}

export const ItemRenderer: FC<Props> = props => {
  const {
    autoFillData,
    customAnimation,
    data,
    dataLength,
    handlerOffset,
    layoutConfig,
    loop,
    offsetX,
    rawDataLength,
    renderItem,
    size,
    windowSize,
  } = props;

  const visibleRanges = useVisibleRanges({
    loop,
    total: dataLength,
    translation: handlerOffset,
    viewSize: size,
    windowSize,
  });

  const [displayedItems, setDisplayedItems] = React.useState<VisibleRanges>(
    null!,
  );

  useAnimatedReaction(
    () => visibleRanges.value,
    ranges => {
      runOnJS(setDisplayedItems)(ranges);
    },
    [visibleRanges],
  );

  if (!displayedItems) {
    return null;
  }

  return (
    <>
      {data.map((item, index) => {
        const realIndex = computedRealIndexWithAutoFillData({
          autoFillData,
          dataLength: rawDataLength,
          index,
          loop,
        });

        const { negativeRange, positiveRange } = displayedItems;

        const shouldRender =
          (index >= negativeRange[0] && index <= negativeRange[1]) ||
          (index >= positiveRange[0] && index <= positiveRange[1]);

        if (!shouldRender) {
          return null;
        }

        return (
          <BaseLayout
            animationStyle={customAnimation || layoutConfig}
            handlerOffset={offsetX}
            index={index}
            key={index}
            visibleRanges={visibleRanges}
          >
            {({ animationValue }) =>
              renderItem({
                animationValue,
                index: realIndex,
                item,
              })
            }
          </BaseLayout>
        );
      })}
    </>
  );
};
