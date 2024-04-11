import React from 'react';

import type { TCarouselProps } from '../types';
import { computedFillDataWithAutoFillData } from '../utils/computed-with-auto-fill-data';

type TGetRequiredProps<P extends keyof TCarouselProps> = Record<
  P,
  Required<TCarouselProps>[P]
>;

export type TInitializeCarouselProps<T> = TCarouselProps<T> &
  TGetRequiredProps<
    | 'autoFillData'
    | 'autoPlayInterval'
    | 'defaultIndex'
    | 'height'
    | 'loop'
    | 'scrollAnimationDuration'
    | 'width'
  > & {
    dataLength: number;
    // Raw data that has not been processed
    rawData: T[];
    rawDataLength: number;
  };

export function useInitProps<T>(
  props: TCarouselProps<T>,
): TInitializeCarouselProps<T> {
  const {
    autoFillData = true,
    autoPlayInterval: _autoPlayInterval = 1000,
    data: rawData = [],
    defaultIndex = 0,
    loop = true,
    scrollAnimationDuration = 500,
    style = {},
    // switchers
    enabled = true,
    height: _height,
    overscrollEnabled = true,
    pagingEnabled = true,
    snapEnabled = props.snapEnabled ?? true,
    width: _width,
  } = props;

  const width = Math.round(_width || 0);
  const height = Math.round(_height || 0);
  const autoPlayInterval = Math.max(_autoPlayInterval, 0);

  const data = React.useMemo<T[]>(() => {
    return computedFillDataWithAutoFillData<T>({
      autoFillData,
      data: rawData,
      dataLength: rawData.length,
      loop,
    });
  }, [rawData, loop, autoFillData]);

  const dataLength = data.length;
  const rawDataLength = rawData.length;

  if (props.mode === 'vertical-stack' || props.mode === 'horizontal-stack') {
    if (!props.modeConfig) {
      props.modeConfig = {};
    }

    props.modeConfig.showLength = props.modeConfig.showLength ?? dataLength - 1;
  }

  return {
    ...props,
    autoFillData,
    defaultIndex,
    // Fill data with autoFillData
    data,
    // Length of fill data
    dataLength,
    // Raw data that has not been processed
    rawData,
    // Length of raw data
    autoPlayInterval,
    enabled,
    height,
    loop,
    overscrollEnabled,
    pagingEnabled,
    rawDataLength,
    scrollAnimationDuration,
    snapEnabled,
    style,
    width,
  };
}
