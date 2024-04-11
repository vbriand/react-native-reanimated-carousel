"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollViewGesture = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../constants");
var _usePanGestureProxy = require("../hooks/usePanGestureProxy");
var _store = require("../store");
var _dealWithAnimation = require("../utils/deal-with-animation");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const IScrollViewGesture = props => {
  const {
    props: {
      dataLength,
      enabled,
      fixedDirection,
      loop,
      maxScrollDistancePerSwipe,
      minScrollDistancePerSwipe,
      onConfigurePanGesture,
      overscrollEnabled,
      pagingEnabled,
      scrollAnimationDuration,
      snapEnabled,
      vertical,
      withAnimation
    }
  } = _react.default.useContext(_store.CTX);
  const {
    accessibilityActions,
    accessibilityLabel,
    onAccessibilityAction,
    onScrollEnd,
    onScrollStart,
    onTouchBegin,
    onTouchEnd,
    size,
    style = {},
    testID,
    translation
  } = props;
  const maxPage = dataLength;
  const isHorizontal = (0, _reactNativeReanimated.useDerivedValue)(() => !vertical, [vertical]);
  const max = (0, _reactNativeReanimated.useSharedValue)(0);
  const panOffset = (0, _reactNativeReanimated.useSharedValue)(0);
  const touching = (0, _reactNativeReanimated.useSharedValue)(false);
  const validStart = (0, _reactNativeReanimated.useSharedValue)(false);
  const scrollEndTranslation = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrollEndVelocity = (0, _reactNativeReanimated.useSharedValue)(0);
  const containerRef = (0, _reactNativeReanimated.useAnimatedRef)();
  const maxScrollDistancePerSwipeIsSet = typeof maxScrollDistancePerSwipe === 'number';
  const minScrollDistancePerSwipeIsSet = typeof minScrollDistancePerSwipe === 'number';

  // Get the limit of the scroll.
  const getLimit = _react.default.useCallback(() => {
    'worklet';

    if (!loop && !overscrollEnabled) {
      const {
        width: containerWidth = 0
      } = (0, _reactNativeReanimated.measure)(containerRef) ?? {};

      // If the item's total width is less than the container's width, then there is no need to scroll.
      if (dataLength * size < containerWidth) {
        return 0;
      }

      // Disable the "overscroll" effect
      return dataLength * size - containerWidth;
    }
    return dataLength * size;
  }, [loop, size, dataLength, overscrollEnabled, containerRef]);
  const withSpring = _react.default.useCallback((toValue, onFinished) => {
    'worklet';

    const defaultWithAnimation = {
      config: {
        duration: scrollAnimationDuration + 100,
        easing: _constants.Easing.easeOutQuart
      },
      type: 'timing'
    };
    return (0, _dealWithAnimation.dealWithAnimation)(withAnimation ?? defaultWithAnimation)(toValue, isFinished => {
      'worklet';

      if (isFinished) {
        onFinished && (0, _reactNativeReanimated.runOnJS)(onFinished)();
      }
    });
  }, [scrollAnimationDuration, withAnimation]);
  const endWithSpring = _react.default.useCallback(onFinished => {
    'worklet';

    const origin = translation.value;
    const velocity = scrollEndVelocity.value;
    // Default to scroll in the direction of the slide (with deceleration)
    let finalTranslation = (0, _reactNativeReanimated.withDecay)({
      deceleration: 0.999,
      velocity
    });

    // If the distance of the swipe exceeds the max scroll distance, keep the view at the current position
    if (maxScrollDistancePerSwipeIsSet && Math.abs(scrollEndTranslation.value) > maxScrollDistancePerSwipe) {
      finalTranslation = origin;
    } else {
      /**
       * The page size is the same as the item size.
       * If direction is vertical, the page size is the height of the item.
       * If direction is horizontal, the page size is the width of the item.
       *
       * `page size` equals to `size` variable.
       * */
      if (pagingEnabled) {
        // distance with direction
        const offset = -(scrollEndTranslation.value >= 0 ? 1 : -1); // 1 or -1
        const computed = offset < 0 ? Math.ceil : Math.floor;
        const page = computed(-translation.value / size);
        if (loop) {
          const finalPage = page + offset;
          finalTranslation = withSpring(withProcessTranslation(-finalPage * size), onFinished);
        } else {
          const finalPage = Math.min(maxPage - 1, Math.max(0, page + offset));
          finalTranslation = withSpring(withProcessTranslation(-finalPage * size), onFinished);
        }
      }
      if (!pagingEnabled && snapEnabled) {
        // scroll to the nearest item
        const nextPage = Math.round((origin + velocity * 0.4) / size) * size;
        finalTranslation = withSpring(withProcessTranslation(nextPage), onFinished);
      }
    }
    translation.value = finalTranslation;
    function withProcessTranslation(translation) {
      if (!loop && !overscrollEnabled) {
        const limit = getLimit();
        const sign = Math.sign(translation);
        return sign * Math.max(0, Math.min(limit, Math.abs(translation)));
      }
      return translation;
    }
  }, [translation, scrollEndVelocity.value, maxScrollDistancePerSwipeIsSet, scrollEndTranslation.value, maxScrollDistancePerSwipe, pagingEnabled, snapEnabled, size, loop, withSpring, maxPage, overscrollEnabled, getLimit]);
  const onFinish = _react.default.useCallback(isFinished => {
    'worklet';

    if (isFinished) {
      touching.value = false;
      onScrollEnd && (0, _reactNativeReanimated.runOnJS)(onScrollEnd)();
    }
  }, [onScrollEnd, touching]);
  const activeDecay = _react.default.useCallback(() => {
    'worklet';

    touching.value = true;
    translation.value = (0, _reactNativeReanimated.withDecay)({
      velocity: scrollEndVelocity.value
    }, isFinished => {
      onFinish(isFinished);
    });
  }, [onFinish, scrollEndVelocity.value, touching, translation]);
  const resetBoundary = _react.default.useCallback(() => {
    'worklet';

    if (touching.value) {
      return;
    }
    if (translation.value > 0) {
      if (scrollEndTranslation.value < 0) {
        activeDecay();
        return;
      }
      if (!loop) {
        translation.value = withSpring(0);
        return;
      }
    }
    if (translation.value < -((maxPage - 1) * size)) {
      if (scrollEndTranslation.value > 0) {
        activeDecay();
        return;
      }
      if (!loop) {
        translation.value = withSpring(-((maxPage - 1) * size));
      }
    }
  }, [touching.value, translation, maxPage, size, scrollEndTranslation.value, loop, activeDecay, withSpring]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => translation.value, () => {
    if (!pagingEnabled) {
      resetBoundary();
    }
  }, [pagingEnabled, resetBoundary]);
  const withProcessTranslation = (0, _react.useCallback)(translation => {
    'worklet';

    if (!loop && !overscrollEnabled) {
      const limit = getLimit();
      const sign = Math.sign(translation);
      return sign * Math.max(0, Math.min(limit, Math.abs(translation)));
    }
    return translation;
  }, [getLimit, loop, overscrollEnabled]);
  const onGestureStart = (0, _react.useCallback)(_ => {
    'worklet';

    touching.value = true;
    validStart.value = true;
    onScrollStart && (0, _reactNativeReanimated.runOnJS)(onScrollStart)();
    max.value = (maxPage - 1) * size;
    if (!loop && !overscrollEnabled) {
      max.value = getLimit();
    }
    panOffset.value = translation.value;
  }, [max, size, maxPage, loop, touching, panOffset, validStart, translation, overscrollEnabled, getLimit, onScrollStart]);
  const onGestureUpdate = (0, _react.useCallback)(e => {
    'worklet';

    if (validStart.value) {
      validStart.value = false;
      (0, _reactNativeReanimated.cancelAnimation)(translation);
    }
    touching.value = true;
    const {
      translationX,
      translationY
    } = e;
    let panTranslation = isHorizontal.value ? translationX : translationY;
    if (fixedDirection === 'negative') {
      panTranslation = -Math.abs(panTranslation);
    } else if (fixedDirection === 'positive') {
      panTranslation = +Math.abs(panTranslation);
    }
    if (!loop) {
      if (translation.value > 0 || translation.value < -max.value) {
        const boundary = translation.value > 0 ? 0 : -max.value;
        const fixed = boundary - panOffset.value;
        const dynamic = panTranslation - fixed;
        translation.value = boundary + dynamic * 0.5;
        return;
      }
    }
    const translationValue = panOffset.value + panTranslation;
    translation.value = translationValue;
  }, [isHorizontal, max, panOffset, loop, fixedDirection, translation, validStart, touching]);
  const onGestureEnd = (0, _react.useCallback)((e, _success) => {
    'worklet';

    const {
      translationX,
      translationY,
      velocityX,
      velocityY
    } = e;
    scrollEndVelocity.value = isHorizontal.value ? velocityX : velocityY;
    let panTranslation = isHorizontal.value ? translationX : translationY;
    if (fixedDirection === 'negative') {
      panTranslation = -Math.abs(panTranslation);
    } else if (fixedDirection === 'positive') {
      panTranslation = +Math.abs(panTranslation);
    }
    scrollEndTranslation.value = panTranslation;
    const totalTranslation = scrollEndVelocity.value + scrollEndTranslation.value;

    /**
     * If the maximum scroll distance is set and the translation `exceeds the maximum scroll distance`,
     * the carousel will keep the view at the current position.
     */
    if (maxScrollDistancePerSwipeIsSet && Math.abs(totalTranslation) > maxScrollDistancePerSwipe) {
      const nextPage = Math.round((panOffset.value + maxScrollDistancePerSwipe * Math.sign(totalTranslation)) / size) * size;
      translation.value = withSpring(withProcessTranslation(nextPage), onScrollEnd);
    } else if (
    /**
     * If the minimum scroll distance is set and the translation `didn't exceeds the minimum scroll distance`,
     * the carousel will keep the view at the current position.
     */
    minScrollDistancePerSwipeIsSet && Math.abs(totalTranslation) < minScrollDistancePerSwipe) {
      const nextPage = Math.round((panOffset.value + minScrollDistancePerSwipe * Math.sign(totalTranslation)) / size) * size;
      translation.value = withSpring(withProcessTranslation(nextPage), onScrollEnd);
    } else {
      endWithSpring(onScrollEnd);
    }
    if (!loop) {
      touching.value = false;
    }
  }, [scrollEndVelocity, isHorizontal.value, fixedDirection, scrollEndTranslation, maxScrollDistancePerSwipeIsSet, maxScrollDistancePerSwipe, minScrollDistancePerSwipeIsSet, minScrollDistancePerSwipe, loop, panOffset.value, size, translation, withSpring, withProcessTranslation, onScrollEnd, endWithSpring, touching]);
  const gesture = (0, _usePanGestureProxy.usePanGestureProxy)({
    onConfigurePanGesture,
    onGestureEnd,
    onGestureStart,
    onGestureUpdate,
    options: {
      enabled
    }
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: gesture
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    accessibilityActions: accessibilityActions,
    accessibilityLabel: accessibilityLabel,
    accessibilityRole: "adjustable",
    onAccessibilityAction: onAccessibilityAction,
    onTouchEnd: onTouchEnd,
    onTouchStart: onTouchBegin,
    ref: containerRef,
    style: style,
    testID: testID
  }, props.children));
};
const ScrollViewGesture = exports.ScrollViewGesture = IScrollViewGesture;
//# sourceMappingURL=ScrollViewGesture.js.map