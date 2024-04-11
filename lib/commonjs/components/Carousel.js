"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
var _useAutoPlay = require("../hooks/useAutoPlay");
var _useCarouselController = require("../hooks/useCarouselController");
var _useCommonVariables = require("../hooks/useCommonVariables");
var _useInitProps = require("../hooks/useInitProps");
var _useLayoutConfig = require("../hooks/useLayoutConfig");
var _useOnProgressChange = require("../hooks/useOnProgressChange");
var _usePropsErrorBoundary = require("../hooks/usePropsErrorBoundary");
var _store = require("../store");
var _computedWithAutoFillData = require("../utils/computed-with-auto-fill-data");
var _ItemRenderer = require("./ItemRenderer");
var _ScrollViewGesture = require("./ScrollViewGesture");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Carousel = /*#__PURE__*/_react.default.forwardRef((_props, ref) => {
  const props = (0, _useInitProps.useInitProps)(_props);
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
  const commonVariables = (0, _useCommonVariables.useCommonVariables)(props);
  const {
    handlerOffset,
    size
  } = commonVariables;
  const offsetX = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const totalSize = size * dataLength;
    const x = handlerOffset.value % totalSize;
    if (!loop) {
      return handlerOffset.value;
    }
    return isNaN(x) ? 0 : x;
  }, [loop, size, dataLength]);
  (0, _usePropsErrorBoundary.usePropsErrorBoundary)({
    ...props,
    dataLength
  });
  (0, _useOnProgressChange.useOnProgressChange)({
    autoFillData,
    loop,
    offsetX,
    onProgressChange,
    rawDataLength,
    size
  });
  const carouselController = (0, _useCarouselController.useCarouselController)({
    autoFillData,
    dataLength,
    defaultIndex,
    duration: scrollAnimationDuration,
    fixedDirection,
    handlerOffset,
    loop,
    onScrollEnd: () => {
      (0, _reactNativeReanimated.runOnJS)(_onScrollEnd)();
    },
    onScrollStart: () => !!onScrollStart && (0, _reactNativeReanimated.runOnJS)(onScrollStart)(),
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
  } = (0, _useAutoPlay.useAutoPlay)({
    autoPlay,
    autoPlayInterval,
    autoPlayReverse,
    carouselController
  });
  const _onScrollEnd = _react.default.useCallback(() => {
    const _sharedIndex = Math.round(getSharedIndex());
    const realIndex = (0, _computedWithAutoFillData.computedRealIndexWithAutoFillData)({
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
  const scrollViewGestureOnScrollStart = _react.default.useCallback(() => {
    pauseAutoPlay();
    onScrollStart?.();
  }, [onScrollStart, pauseAutoPlay]);
  const scrollViewGestureOnScrollEnd = _react.default.useCallback(() => {
    startAutoPlay();
    _onScrollEnd();
  }, [_onScrollEnd, startAutoPlay]);
  const scrollViewGestureOnTouchBegin = _react.default.useCallback(pauseAutoPlay, [pauseAutoPlay]);
  const scrollViewGestureOnTouchEnd = _react.default.useCallback(startAutoPlay, [startAutoPlay]);
  _react.default.useImperativeHandle(ref, () => ({
    getCurrentIndex,
    next,
    prev,
    scrollTo
  }), [getCurrentIndex, next, prev, scrollTo]);
  const layoutConfig = (0, _useLayoutConfig.useLayoutConfig)({
    ...props,
    size
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, null, /*#__PURE__*/_react.default.createElement(_store.CTX.Provider, {
    value: {
      common: commonVariables,
      props
    }
  }, /*#__PURE__*/_react.default.createElement(_ScrollViewGesture.ScrollViewGesture, {
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
  }, /*#__PURE__*/_react.default.createElement(_ItemRenderer.ItemRenderer, {
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
var _default = exports.default = Carousel;
const styles = _reactNative.StyleSheet.create({
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