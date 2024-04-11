import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS, useDerivedValue } from 'react-native-reanimated';
import { useAutoPlay } from '../hooks/useAutoPlay';
import { useCarouselController } from '../hooks/useCarouselController';
import { useCommonVariables } from '../hooks/useCommonVariables';
import { useInitProps } from '../hooks/useInitProps';
import { useLayoutConfig } from '../hooks/useLayoutConfig';
import { useOnProgressChange } from '../hooks/useOnProgressChange';
import { usePropsErrorBoundary } from '../hooks/usePropsErrorBoundary';
import { CTX } from '../store';
import { computedRealIndexWithAutoFillData } from '../utils/computed-with-auto-fill-data';
import { ItemRenderer } from './ItemRenderer';
import { ScrollViewGesture } from './ScrollViewGesture';
const Carousel = /*#__PURE__*/React.forwardRef((_props, ref) => {
  const props = useInitProps(_props);
  const {
    autoFillData,
    loop,
    testID,
    // Fill data with autoFillData
    data,
    // Length of fill data
    dataLength,
    // Length of raw data
    accessibilityActions,
    accessibilityLabel,
    autoPlay,
    autoPlayInterval,
    autoPlayReverse,
    customAnimation,
    defaultIndex,
    fixedDirection,
    height,
    mode,
    onAccessibilityAction,
    onProgressChange,
    onScrollEnd,
    onScrollStart,
    onSnapToItem,
    rawDataLength,
    renderItem,
    scrollAnimationDuration,
    style,
    vertical,
    width,
    windowSize,
    withAnimation
  } = props;
  const commonVariables = useCommonVariables(props);
  const {
    handlerOffset,
    size
  } = commonVariables;
  const offsetX = useDerivedValue(() => {
    const totalSize = size * dataLength;
    const x = handlerOffset.value % totalSize;
    if (!loop) {
      return handlerOffset.value;
    }
    return isNaN(x) ? 0 : x;
  }, [loop, size, dataLength]);
  usePropsErrorBoundary({
    ...props,
    dataLength
  });
  useOnProgressChange({
    autoFillData,
    loop,
    offsetX,
    onProgressChange,
    rawDataLength,
    size
  });
  const carouselController = useCarouselController({
    autoFillData,
    dataLength,
    defaultIndex,
    duration: scrollAnimationDuration,
    fixedDirection,
    handlerOffset,
    loop,
    onScrollEnd: () => {
      runOnJS(_onScrollEnd)();
    },
    onScrollStart: () => !!onScrollStart && runOnJS(onScrollStart)(),
    size,
    withAnimation
  });
  const {
    getCurrentIndex,
    getSharedIndex,
    next,
    prev,
    scrollTo
  } = carouselController;
  const {
    pause: pauseAutoPlay,
    start: startAutoPlay
  } = useAutoPlay({
    autoPlay,
    autoPlayInterval,
    autoPlayReverse,
    carouselController
  });
  const _onScrollEnd = React.useCallback(() => {
    const _sharedIndex = Math.round(getSharedIndex());
    const realIndex = computedRealIndexWithAutoFillData({
      autoFillData,
      dataLength: rawDataLength,
      index: _sharedIndex,
      loop
    });
    if (onSnapToItem) {
      onSnapToItem(realIndex);
    }
    if (onScrollEnd) {
      onScrollEnd(realIndex);
    }
  }, [loop, autoFillData, rawDataLength, getSharedIndex, onSnapToItem, onScrollEnd]);
  const scrollViewGestureOnScrollStart = React.useCallback(() => {
    pauseAutoPlay();
    onScrollStart?.();
  }, [onScrollStart, pauseAutoPlay]);
  const scrollViewGestureOnScrollEnd = React.useCallback(() => {
    startAutoPlay();
    _onScrollEnd();
  }, [_onScrollEnd, startAutoPlay]);
  const scrollViewGestureOnTouchBegin = React.useCallback(pauseAutoPlay, [pauseAutoPlay]);
  const scrollViewGestureOnTouchEnd = React.useCallback(startAutoPlay, [startAutoPlay]);
  React.useImperativeHandle(ref, () => ({
    getCurrentIndex,
    next,
    prev,
    scrollTo
  }), [getCurrentIndex, next, prev, scrollTo]);
  const layoutConfig = useLayoutConfig({
    ...props,
    size
  });
  return /*#__PURE__*/React.createElement(GestureHandlerRootView, null, /*#__PURE__*/React.createElement(CTX.Provider, {
    value: {
      common: commonVariables,
      props
    }
  }, /*#__PURE__*/React.createElement(ScrollViewGesture, {
    accessibilityActions: accessibilityActions,
    accessibilityLabel: accessibilityLabel,
    key: mode,
    onAccessibilityAction: onAccessibilityAction,
    onScrollEnd: scrollViewGestureOnScrollEnd,
    onScrollStart: scrollViewGestureOnScrollStart,
    onTouchBegin: scrollViewGestureOnTouchBegin,
    onTouchEnd: scrollViewGestureOnTouchEnd,
    size: size,
    style: [styles.container, {
      height: height || '100%',
      width: width || '100%'
    }, style, vertical ? styles.itemsVertical : styles.itemsHorizontal],
    testID: testID,
    translation: handlerOffset
  }, /*#__PURE__*/React.createElement(ItemRenderer, {
    autoFillData: autoFillData,
    customAnimation: customAnimation,
    data: data,
    dataLength: dataLength,
    handlerOffset: handlerOffset,
    layoutConfig: layoutConfig,
    loop: loop,
    offsetX: offsetX,
    rawDataLength: rawDataLength,
    renderItem: renderItem,
    size: size,
    windowSize: windowSize
  }))));
});
Carousel.displayName = 'Carousel';
export default Carousel;
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  itemsHorizontal: {
    flexDirection: 'row'
  },
  itemsVertical: {
    flexDirection: 'column'
  }
});
//# sourceMappingURL=Carousel.js.map