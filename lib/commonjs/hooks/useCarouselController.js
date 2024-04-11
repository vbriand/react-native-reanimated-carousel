"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCarouselController = useCarouselController;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
var _computedWithAutoFillData = require("../utils/computed-with-auto-fill-data");
var _dealWithAnimation = require("../utils/deal-with-animation");
var _handleroffsetDirection = require("../utils/handleroffset-direction");
var _log = require("../utils/log");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function useCarouselController(options) {
  const {
    size,
    loop,
    dataLength,
    handlerOffset,
    withAnimation,
    defaultIndex = 0,
    duration,
    autoFillData,
    fixedDirection
  } = options;
  const dataInfo = _react.default.useMemo(() => ({
    length: dataLength,
    disable: !dataLength,
    originalLength: dataLength
  }), [dataLength]);
  const index = (0, _reactNativeReanimated.useSharedValue)(defaultIndex);
  // The Index displayed to the user
  const sharedIndex = (0, _react.useRef)(defaultIndex);
  const sharedPreIndex = (0, _react.useRef)(defaultIndex);
  const currentFixedPage = _react.default.useCallback(() => {
    if (loop) return -Math.round(handlerOffset.value / size);
    const fixed = handlerOffset.value / size % dataInfo.length;
    return Math.round(handlerOffset.value <= 0 ? Math.abs(fixed) : Math.abs(fixed > 0 ? dataInfo.length - fixed : 0));
  }, [handlerOffset, dataInfo, size, loop]);
  function setSharedIndex(newSharedIndex) {
    sharedIndex.current = newSharedIndex;
  }
  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
    const handlerOffsetValue = handlerOffset.value;
    const toInt = (0, _log.round)(handlerOffsetValue / size) % dataInfo.length;
    const isPositive = handlerOffsetValue <= 0;
    const i = isPositive ? Math.abs(toInt) : Math.abs(toInt > 0 ? dataInfo.length - toInt : 0);
    const newSharedIndexValue = (0, _computedWithAutoFillData.convertToSharedIndex)({
      loop,
      rawDataLength: dataInfo.originalLength,
      autoFillData: autoFillData,
      index: i
    });
    return {
      i,
      newSharedIndexValue
    };
  }, ({
    i,
    newSharedIndexValue
  }) => {
    index.value = i;
    (0, _reactNativeReanimated.runOnJS)(setSharedIndex)(newSharedIndexValue);
  }, [sharedPreIndex, sharedIndex, size, dataInfo, index, loop, autoFillData, handlerOffset]);
  const getCurrentIndex = _react.default.useCallback(() => {
    const realIndex = (0, _computedWithAutoFillData.computedRealIndexWithAutoFillData)({
      index: index.value,
      dataLength: dataInfo.originalLength,
      loop,
      autoFillData: autoFillData
    });
    return realIndex;
  }, [index, autoFillData, dataInfo, loop]);
  const canSliding = _react.default.useCallback(() => {
    return !dataInfo.disable;
  }, [dataInfo]);
  const onScrollEnd = _react.default.useCallback(() => {
    options.onScrollEnd?.();
  }, [options]);
  const onScrollStart = _react.default.useCallback(() => {
    options.onScrollStart?.();
  }, [options]);
  const scrollWithTiming = _react.default.useCallback((toValue, onFinished) => {
    "worklet";

    const callback = isFinished => {
      "worklet";

      if (isFinished) {
        (0, _reactNativeReanimated.runOnJS)(onScrollEnd)();
        onFinished && (0, _reactNativeReanimated.runOnJS)(onFinished)();
      }
    };
    const defaultWithAnimation = {
      type: "timing",
      config: {
        duration,
        easing: _constants.Easing.easeOutQuart
      }
    };
    return (0, _dealWithAnimation.dealWithAnimation)(withAnimation ?? defaultWithAnimation)(toValue, callback);
  }, [duration, withAnimation, onScrollEnd]);
  const next = _react.default.useCallback((opts = {}) => {
    "worklet";

    const {
      count = 1,
      animated = true,
      onFinished
    } = opts;
    if (!canSliding() || !loop && index.value >= dataInfo.length - 1) return;
    onScrollStart?.();
    const nextPage = currentFixedPage() + count;
    index.value = nextPage;
    if (animated) {
      handlerOffset.value = scrollWithTiming(-nextPage * size, onFinished);
    } else {
      handlerOffset.value = -nextPage * size;
      onFinished?.();
    }
  }, [canSliding, loop, index, dataInfo, onScrollStart, handlerOffset, size, scrollWithTiming, currentFixedPage]);
  const prev = _react.default.useCallback((opts = {}) => {
    const {
      count = 1,
      animated = true,
      onFinished
    } = opts;
    if (!canSliding() || !loop && index.value <= 0) return;
    onScrollStart?.();
    const prevPage = currentFixedPage() - count;
    index.value = prevPage;
    if (animated) {
      handlerOffset.value = scrollWithTiming(-prevPage * size, onFinished);
    } else {
      handlerOffset.value = -prevPage * size;
      onFinished?.();
    }
  }, [canSliding, loop, index, onScrollStart, handlerOffset, size, scrollWithTiming, currentFixedPage]);
  const to = _react.default.useCallback(opts => {
    const {
      i,
      animated = false,
      onFinished
    } = opts;
    if (i === index.value) return;
    if (!canSliding()) return;
    onScrollStart?.();
    // direction -> 1 | -1
    const direction = (0, _handleroffsetDirection.handlerOffsetDirection)(handlerOffset, fixedDirection);

    // target offset
    const offset = i * size * direction;
    // page width size * page count
    const totalSize = dataInfo.length * size;
    let isCloseToNextLoop = false;
    if (loop) {
      isCloseToNextLoop = Math.abs(handlerOffset.value % totalSize) / totalSize >= 0.5;
    }
    const finalOffset = (Math.floor(Math.abs(handlerOffset.value / totalSize)) + (isCloseToNextLoop ? 1 : 0)) * totalSize * direction + offset;
    if (animated) {
      index.value = i;
      handlerOffset.value = scrollWithTiming(finalOffset, onFinished);
    } else {
      handlerOffset.value = finalOffset;
      index.value = i;
      onFinished?.();
    }
  }, [size, loop, index, fixedDirection, handlerOffset, dataInfo.length, canSliding, onScrollStart, scrollWithTiming]);
  const scrollTo = _react.default.useCallback((opts = {}) => {
    const {
      index: i,
      count,
      animated = false,
      onFinished
    } = opts;
    if (typeof i === "number" && i > -1) {
      to({
        i,
        animated,
        onFinished
      });
      return;
    }
    if (!count) return;
    const n = Math.round(count);
    if (n < 0) prev({
      count: Math.abs(n),
      animated,
      onFinished
    });else next({
      count: n,
      animated,
      onFinished
    });
  }, [prev, next, to]);
  return {
    next,
    prev,
    scrollTo,
    getCurrentIndex,
    getSharedIndex: () => sharedIndex.current
  };
}
//# sourceMappingURL=useCarouselController.js.map