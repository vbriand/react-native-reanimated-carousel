"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _reactNativeReanimated = require("react-native-reanimated");

var _ItemRenderer = require("./ItemRenderer");

var _ScrollViewGesture = require("./ScrollViewGesture");

var _useAutoPlay = require("../hooks/useAutoPlay");

var _useCarouselController = require("../hooks/useCarouselController");

var _useCommonVariables = require("../hooks/useCommonVariables");

var _useInitProps = require("../hooks/useInitProps");

var _useLayoutConfig = require("../hooks/useLayoutConfig");

var _useOnProgressChange = require("../hooks/useOnProgressChange");

var _usePropsErrorBoundary = require("../hooks/usePropsErrorBoundary");

var _store = require("../store");

var _computedWithAutoFillData = require("../utils/computed-with-auto-fill-data");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Carousel = /*#__PURE__*/_react.default.forwardRef((_props, ref) => {
  const props = (0, _useInitProps.useInitProps)(_props);
  const {
    testID,
    loop,
    autoFillData,
    // Fill data with autoFillData
    data,
    // Length of fill data
    dataLength,
    // Length of raw data
    rawDataLength,
    mode,
    style,
    width,
    height,
    vertical,
    autoPlay,
    windowSize,
    autoPlayReverse,
    autoPlayInterval,
    scrollAnimationDuration,
    withAnimation,
    fixedDirection,
    renderItem,
    onScrollEnd,
    onSnapToItem,
    onScrollStart,
    onProgressChange,
    customAnimation,
    defaultIndex,
    accessibilityActions,
    accessible,
    accessibilityLabel,
    onAccessibilityAction
  } = props;
  const commonVariables = (0, _useCommonVariables.useCommonVariables)(props);
  const {
    size,
    handlerOffset
  } = commonVariables;
  const offsetX = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const totalSize = size * dataLength;
    const x = handlerOffset.value % totalSize;
    if (!loop) return handlerOffset.value;
    return isNaN(x) ? 0 : x;
  }, [loop, size, dataLength]);
  (0, _usePropsErrorBoundary.usePropsErrorBoundary)({ ...props,
    dataLength
  });
  (0, _useOnProgressChange.useOnProgressChange)({
    autoFillData,
    loop,
    size,
    offsetX,
    rawDataLength,
    onProgressChange
  });
  const carouselController = (0, _useCarouselController.useCarouselController)({
    loop,
    size,
    dataLength,
    autoFillData,
    handlerOffset,
    withAnimation,
    defaultIndex,
    fixedDirection,
    duration: scrollAnimationDuration,
    onScrollEnd: () => (0, _reactNativeReanimated.runOnJS)(_onScrollEnd)(),
    onScrollStart: () => !!onScrollStart && (0, _reactNativeReanimated.runOnJS)(onScrollStart)()
  });
  const {
    next,
    prev,
    scrollTo,
    getSharedIndex,
    getCurrentIndex
  } = carouselController;
  const {
    start: startAutoPlay,
    pause: pauseAutoPlay
  } = (0, _useAutoPlay.useAutoPlay)({
    autoPlay,
    autoPlayInterval,
    autoPlayReverse,
    carouselController
  });

  const _onScrollEnd = _react.default.useCallback(() => {
    const _sharedIndex = Math.round(getSharedIndex());

    const realIndex = (0, _computedWithAutoFillData.computedRealIndexWithAutoFillData)({
      index: _sharedIndex,
      dataLength: rawDataLength,
      loop,
      autoFillData
    });
    if (onSnapToItem) onSnapToItem(realIndex);
    if (onScrollEnd) onScrollEnd(realIndex);
  }, [loop, autoFillData, rawDataLength, getSharedIndex, onSnapToItem, onScrollEnd]);

  const scrollViewGestureOnScrollStart = _react.default.useCallback(() => {
    pauseAutoPlay();
    onScrollStart === null || onScrollStart === void 0 ? void 0 : onScrollStart();
  }, [onScrollStart, pauseAutoPlay]);

  const scrollViewGestureOnScrollEnd = _react.default.useCallback(() => {
    startAutoPlay();

    _onScrollEnd();
  }, [_onScrollEnd, startAutoPlay]);

  const scrollViewGestureOnTouchBegin = _react.default.useCallback(pauseAutoPlay, [pauseAutoPlay]);

  const scrollViewGestureOnTouchEnd = _react.default.useCallback(startAutoPlay, [startAutoPlay]);

  _react.default.useImperativeHandle(ref, () => ({
    next,
    prev,
    getCurrentIndex,
    scrollTo
  }), [getCurrentIndex, next, prev, scrollTo]);

  const layoutConfig = (0, _useLayoutConfig.useLayoutConfig)({ ...props,
    size
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, null, /*#__PURE__*/_react.default.createElement(_store.CTX.Provider, {
    value: {
      props,
      common: commonVariables
    }
  }, /*#__PURE__*/_react.default.createElement(_ScrollViewGesture.ScrollViewGesture, {
    key: mode,
    size: size,
    translation: handlerOffset,
    style: [styles.container, {
      width: width || "100%",
      height: height || "100%"
    }, style, vertical ? styles.itemsVertical : styles.itemsHorizontal],
    testID: testID,
    onScrollStart: scrollViewGestureOnScrollStart,
    onScrollEnd: scrollViewGestureOnScrollEnd,
    onTouchBegin: scrollViewGestureOnTouchBegin,
    onTouchEnd: scrollViewGestureOnTouchEnd,
    accessibilityActions: accessibilityActions,
    accessible: accessible,
    accessibilityLabel: accessibilityLabel,
    onAccessibilityAction: onAccessibilityAction
  }, /*#__PURE__*/_react.default.createElement(_ItemRenderer.ItemRenderer, {
    data: data,
    dataLength: dataLength,
    rawDataLength: rawDataLength,
    loop: loop,
    size: size,
    windowSize: windowSize,
    autoFillData: autoFillData,
    offsetX: offsetX,
    handlerOffset: handlerOffset,
    layoutConfig: layoutConfig,
    renderItem: renderItem,
    customAnimation: customAnimation
  }))));
});

var _default = Carousel;
exports.default = _default;

const styles = _reactNative.StyleSheet.create({
  container: {
    overflow: "hidden"
  },
  itemsHorizontal: {
    flexDirection: "row"
  },
  itemsVertical: {
    flexDirection: "column"
  }
});
//# sourceMappingURL=Carousel.js.map