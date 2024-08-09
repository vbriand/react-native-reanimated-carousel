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
      onConfigurePanGesture,
      vertical,
      pagingEnabled,
      snapEnabled,
      loop,
      scrollAnimationDuration,
      withAnimation,
      enabled,
      dataLength,
      overscrollEnabled,
      maxScrollDistancePerSwipe,
      minScrollDistancePerSwipe,
      fixedDirection
    }
  } = _react.default.useContext(_store.CTX);
  const {
    size,
    translation,
    testID,
    style = {},
    onScrollStart,
    onScrollEnd,
    onTouchBegin,
    onTouchEnd,
    accessibilityActions,
    accessibilityLabel,
    accessibilityRole,
    accessible,
    onAccessibilityAction
  } = props;
  const maxPage = dataLength;
  const isHorizontal = (0, _reactNativeReanimated.useDerivedValue)(() => !vertical, [vertical]);
  const max = (0, _reactNativeReanimated.useSharedValue)(0);
  const panOffset = (0, _reactNativeReanimated.useSharedValue)(undefined); // set to undefined when not actively in a pan gesture
  const touching = (0, _reactNativeReanimated.useSharedValue)(false);
  const validStart = (0, _reactNativeReanimated.useSharedValue)(false);
  const scrollEndTranslation = (0, _reactNativeReanimated.useSharedValue)(0);
  const scrollEndVelocity = (0, _reactNativeReanimated.useSharedValue)(0);
  const containerRef = (0, _reactNativeReanimated.useAnimatedRef)();
  const maxScrollDistancePerSwipeIsSet = typeof maxScrollDistancePerSwipe === "number";
  const minScrollDistancePerSwipeIsSet = typeof minScrollDistancePerSwipe === "number";

  // Get the limit of the scroll.
  const getLimit = _react.default.useCallback(() => {
    "worklet";

    if (!loop && !overscrollEnabled) {
      const {
        width: containerWidth = 0
      } = (0, _reactNativeReanimated.measure)(containerRef);

      // If the item's total width is less than the container's width, then there is no need to scroll.
      if (dataLength * size < containerWidth) return 0;

      // Disable the "overscroll" effect
      return dataLength * size - containerWidth;
    }
    return dataLength * size;
  }, [loop, size, dataLength, overscrollEnabled]);
  const withSpring = _react.default.useCallback((toValue, onFinished) => {
    "worklet";

    const defaultWithAnimation = {
      type: "timing",
      config: {
        duration: scrollAnimationDuration + 100,
        easing: _constants.Easing.easeOutQuart
      }
    };
    return (0, _dealWithAnimation.dealWithAnimation)(withAnimation ?? defaultWithAnimation)(toValue, isFinished => {
      "worklet";

      if (isFinished) onFinished && (0, _reactNativeReanimated.runOnJS)(onFinished)();
    });
  }, [scrollAnimationDuration, withAnimation]);
  const endWithSpring = _react.default.useCallback((scrollEndTranslationValue, scrollEndVelocityValue, onFinished) => {
    "worklet";

    const origin = translation.value;
    const velocity = scrollEndVelocityValue;
    // Default to scroll in the direction of the slide (with deceleration)
    let finalTranslation = (0, _reactNativeReanimated.withDecay)({
      velocity,
      deceleration: 0.999
    });

    // If the distance of the swipe exceeds the max scroll distance, keep the view at the current position
    if (maxScrollDistancePerSwipeIsSet && Math.abs(scrollEndTranslationValue) > maxScrollDistancePerSwipe) {
      finalTranslation = origin;
    } else {
      /**
       * The page size is the same as the item size.
       * If direction is vertical, the page size is the height of the item.
       * If direction is horizontal, the page size is the width of the item.
      *
      * `page size` equals to `size` variable.
      * */

      // calculate target "nextPage" based on the final pan position and the velocity of
      // the pan gesture at termination; this allows for a quick "flick" to indicate a far
      // off page change.
      const nextPage = -Math.round((origin + velocity * 2) / size);
      if (pagingEnabled) {
        // we'll never go further than a single page away from the current page when paging
        // is enabled.

        // distance with direction
        const offset = -(scrollEndTranslationValue >= 0 ? 1 : -1); // 1 or -1
        const computed = offset < 0 ? Math.ceil : Math.floor;
        const page = computed(-origin / size);
        const velocityDirection = -Math.sign(velocity);
        if (page === nextPage || velocityDirection !== offset) {
          // not going anywhere! Velocity was insufficient to overcome the distance to get to a
          // further page. Let's reset gently to the current page.
          finalTranslation = withSpring(withProcessTranslation(-page * size), onFinished);
        } else if (loop) {
          const finalPage = page + offset;
          finalTranslation = withSpring(withProcessTranslation(-finalPage * size), onFinished);
        } else {
          const finalPage = Math.min(maxPage - 1, Math.max(0, page + offset));
          finalTranslation = withSpring(withProcessTranslation(-finalPage * size), onFinished);
        }
      }
      if (!pagingEnabled && snapEnabled) {
        // scroll to the nearest item
        finalTranslation = withSpring(withProcessTranslation(-nextPage * size), onFinished);
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
  }, [withSpring, size, maxPage, loop, snapEnabled, translation, pagingEnabled, maxScrollDistancePerSwipe, maxScrollDistancePerSwipeIsSet]);
  const onFinish = _react.default.useCallback(isFinished => {
    "worklet";

    if (isFinished) {
      touching.value = false;
      onScrollEnd && (0, _reactNativeReanimated.runOnJS)(onScrollEnd)();
    }
  }, [onScrollEnd, touching]);
  const activeDecay = _react.default.useCallback(() => {
    "worklet";

    touching.value = true;
    translation.value = (0, _reactNativeReanimated.withDecay)({
      velocity: scrollEndVelocity.value
    }, isFinished => onFinish(isFinished));
  }, [onFinish, scrollEndVelocity.value, touching, translation]);
  const resetBoundary = _react.default.useCallback(() => {
    "worklet";

    if (touching.value) return;
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
      if (!loop) translation.value = withSpring(-((maxPage - 1) * size));
    }
  }, [touching.value, translation, maxPage, size, scrollEndTranslation.value, loop, activeDecay, withSpring]);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => translation.value, () => {
    if (!pagingEnabled) resetBoundary();
  }, [pagingEnabled, resetBoundary]);
  function withProcessTranslation(translation) {
    "worklet";

    if (!loop && !overscrollEnabled) {
      const limit = getLimit();
      const sign = Math.sign(translation);
      return sign * Math.max(0, Math.min(limit, Math.abs(translation)));
    }
    return translation;
  }
  const onGestureStart = (0, _react.useCallback)(_ => {
    "worklet";

    touching.value = true;
    validStart.value = true;
    onScrollStart && (0, _reactNativeReanimated.runOnJS)(onScrollStart)();
    max.value = (maxPage - 1) * size;
    if (!loop && !overscrollEnabled) max.value = getLimit();
    panOffset.value = translation.value;
  }, [max, size, maxPage, loop, touching, panOffset, validStart, translation, overscrollEnabled, getLimit, onScrollStart]);
  const onGestureUpdate = (0, _react.useCallback)(e => {
    "worklet";

    if (panOffset.value === undefined) {
      // This may happen if `onGestureStart` is called as a part of the
      // JS thread (instead of the UI thread / worklet). If so, when
      // `onGestureStart` sets panOffset.value, the set will be asynchronous,
      // and so it may not actually occur before `onGestureUpdate` is called.
      //
      // Keeping this value as `undefined` when it is not active protects us
      // from the situation where we may use the previous value for panOffset
      // instead; this would cause a visual flicker in the carousel.

      // console.warn("onGestureUpdate: panOffset is undefined");
      return;
    }
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
    if (fixedDirection === "negative") panTranslation = -Math.abs(panTranslation);else if (fixedDirection === "positive") panTranslation = +Math.abs(panTranslation);
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
  }, [isHorizontal, max, panOffset, loop, overscrollEnabled, fixedDirection, translation, validStart, touching]);
  const onGestureEnd = (0, _react.useCallback)((e, _success) => {
    "worklet";

    if (panOffset.value === undefined) {
      // console.warn("onGestureEnd: panOffset is undefined");
      return;
    }
    const {
      velocityX,
      velocityY,
      translationX,
      translationY
    } = e;
    const scrollEndVelocityValue = isHorizontal.value ? velocityX : velocityY;
    scrollEndVelocity.value = scrollEndVelocityValue; // may update async: see https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue#remarks

    let panTranslation = isHorizontal.value ? translationX : translationY;
    if (fixedDirection === "negative") panTranslation = -Math.abs(panTranslation);else if (fixedDirection === "positive") panTranslation = +Math.abs(panTranslation);
    scrollEndTranslation.value = panTranslation; // may update async: see https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue#remarks

    const totalTranslation = scrollEndVelocityValue + panTranslation;

    /**
     * If the maximum scroll distance is set and the translation `exceeds the maximum scroll distance`,
     * the carousel will keep the view at the current position.
    */
    if (maxScrollDistancePerSwipeIsSet && Math.abs(totalTranslation) > maxScrollDistancePerSwipe) {
      const nextPage = Math.round((panOffset.value + maxScrollDistancePerSwipe * Math.sign(totalTranslation)) / size) * size;
      translation.value = withSpring(withProcessTranslation(nextPage), onScrollEnd);
    }
    /**
     * If the minimum scroll distance is set and the translation `didn't exceeds the minimum scroll distance`,
     * the carousel will keep the view at the current position.
    */else if (minScrollDistancePerSwipeIsSet && Math.abs(totalTranslation) < minScrollDistancePerSwipe) {
      const nextPage = Math.round((panOffset.value + minScrollDistancePerSwipe * Math.sign(totalTranslation)) / size) * size;
      translation.value = withSpring(withProcessTranslation(nextPage), onScrollEnd);
    } else {
      endWithSpring(panTranslation, scrollEndVelocityValue, onScrollEnd);
    }
    if (!loop) touching.value = false;
    panOffset.value = undefined;
  }, [size, loop, touching, panOffset, translation, isHorizontal, scrollEndVelocity, scrollEndTranslation, fixedDirection, maxScrollDistancePerSwipeIsSet, maxScrollDistancePerSwipe, maxScrollDistancePerSwipeIsSet, minScrollDistancePerSwipe, endWithSpring, withSpring, onScrollEnd]);
  const gesture = (0, _usePanGestureProxy.usePanGestureProxy)({
    onConfigurePanGesture,
    onGestureStart,
    onGestureUpdate,
    onGestureEnd,
    options: {
      enabled
    }
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: gesture
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    ref: containerRef,
    testID: testID,
    style: style,
    onTouchStart: onTouchBegin,
    onTouchEnd: onTouchEnd,
    accessibilityActions: accessibilityActions,
    accessibilityLabel: accessibilityLabel,
    accessibilityRole: accessibilityRole,
    accessible: accessible,
    onAccessibilityAction: onAccessibilityAction
  }, props.children));
};
const ScrollViewGesture = exports.ScrollViewGesture = IScrollViewGesture;
//# sourceMappingURL=ScrollViewGesture.js.map