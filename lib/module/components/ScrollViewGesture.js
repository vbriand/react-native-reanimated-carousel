import React, { useCallback } from "react";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { cancelAnimation, measure, runOnJS, useAnimatedReaction, useAnimatedRef, useDerivedValue, useSharedValue, withDecay } from "react-native-reanimated";
import { Easing } from "../constants";
import { usePanGestureProxy } from "../hooks/usePanGestureProxy";
import { CTX } from "../store";
import { dealWithAnimation } from "../utils/deal-with-animation";

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
  } = React.useContext(CTX);
  const {
    size,
    translation,
    testID,
    style = {},
    onScrollStart,
    onScrollEnd,
    onTouchBegin,
    onTouchEnd
  } = props;
  const maxPage = dataLength;
  const isHorizontal = useDerivedValue(() => !vertical, [vertical]);
  const max = useSharedValue(0);
  const panOffset = useSharedValue(0);
  const touching = useSharedValue(false);
  const validStart = useSharedValue(false);
  const scrollEndTranslation = useSharedValue(0);
  const scrollEndVelocity = useSharedValue(0);
  const containerRef = useAnimatedRef();
  const maxScrollDistancePerSwipeIsSet = typeof maxScrollDistancePerSwipe === "number";
  const minScrollDistancePerSwipeIsSet = typeof minScrollDistancePerSwipe === "number"; // Get the limit of the scroll.

  const getLimit = React.useCallback(() => {
    "worklet";

    if (!loop && !overscrollEnabled) {
      const {
        width: containerWidth = 0
      } = measure(containerRef); // If the item's total width is less than the container's width, then there is no need to scroll.

      if (dataLength * size < containerWidth) return 0; // Disable the "overscroll" effect

      return dataLength * size - containerWidth;
    }

    return dataLength * size;
  }, [loop, size, dataLength, overscrollEnabled]);
  const withSpring = React.useCallback((toValue, onFinished) => {
    "worklet";

    const defaultWithAnimation = {
      type: "timing",
      config: {
        duration: scrollAnimationDuration + 100,
        easing: Easing.easeOutQuart
      }
    };
    return dealWithAnimation(withAnimation !== null && withAnimation !== void 0 ? withAnimation : defaultWithAnimation)(toValue, isFinished => {
      "worklet";

      if (isFinished) onFinished && runOnJS(onFinished)();
    });
  }, [scrollAnimationDuration, withAnimation]);
  const endWithSpring = React.useCallback(onFinished => {
    "worklet";

    const origin = translation.value;
    const velocity = scrollEndVelocity.value; // Default to scroll in the direction of the slide (with deceleration)

    let finalTranslation = withDecay({
      velocity,
      deceleration: 0.999
    }); // If the distance of the swipe exceeds the max scroll distance, keep the view at the current position

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
  }, [withSpring, size, maxPage, loop, snapEnabled, translation, pagingEnabled, scrollEndVelocity.value, maxScrollDistancePerSwipe, scrollEndTranslation.value, maxScrollDistancePerSwipeIsSet]);
  const onFinish = React.useCallback(isFinished => {
    "worklet";

    if (isFinished) {
      touching.value = false;
      onScrollEnd && runOnJS(onScrollEnd)();
    }
  }, [onScrollEnd, touching]);
  const activeDecay = React.useCallback(() => {
    "worklet";

    touching.value = true;
    translation.value = withDecay({
      velocity: scrollEndVelocity.value
    }, isFinished => onFinish(isFinished));
  }, [onFinish, scrollEndVelocity.value, touching, translation]);
  const resetBoundary = React.useCallback(() => {
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
  useAnimatedReaction(() => translation.value, () => {
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

  const onGestureStart = useCallback(_ => {
    "worklet";

    touching.value = true;
    validStart.value = true;
    onScrollStart && runOnJS(onScrollStart)();
    max.value = (maxPage - 1) * size;
    if (!loop && !overscrollEnabled) max.value = getLimit();
    panOffset.value = translation.value;
  }, [max, size, maxPage, loop, touching, panOffset, validStart, translation, overscrollEnabled, getLimit, onScrollStart]);
  const onGestureUpdate = useCallback(e => {
    "worklet";

    if (validStart.value) {
      validStart.value = false;
      cancelAnimation(translation);
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
  const onGestureEnd = useCallback((e, _success) => {
    "worklet";

    const {
      velocityX,
      velocityY,
      translationX,
      translationY
    } = e;
    scrollEndVelocity.value = isHorizontal.value ? velocityX : velocityY;
    let panTranslation = isHorizontal.value ? translationX : translationY;
    if (fixedDirection === "negative") panTranslation = -Math.abs(panTranslation);else if (fixedDirection === "positive") panTranslation = +Math.abs(panTranslation);
    scrollEndTranslation.value = panTranslation;
    const totalTranslation = scrollEndVelocity.value + scrollEndTranslation.value;
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
    */
    else if (minScrollDistancePerSwipeIsSet && Math.abs(totalTranslation) < minScrollDistancePerSwipe) {
      const nextPage = Math.round((panOffset.value + minScrollDistancePerSwipe * Math.sign(totalTranslation)) / size) * size;
      translation.value = withSpring(withProcessTranslation(nextPage), onScrollEnd);
    } else {
      endWithSpring(onScrollEnd);
    }

    if (!loop) touching.value = false;
  }, [size, loop, touching, panOffset, translation, isHorizontal, scrollEndVelocity, scrollEndTranslation, fixedDirection, maxScrollDistancePerSwipeIsSet, maxScrollDistancePerSwipe, maxScrollDistancePerSwipeIsSet, minScrollDistancePerSwipe, endWithSpring, withSpring, onScrollEnd]);
  const gesture = usePanGestureProxy({
    onConfigurePanGesture,
    onGestureStart,
    onGestureUpdate,
    onGestureEnd,
    options: {
      enabled
    }
  });
  return /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: gesture
  }, /*#__PURE__*/React.createElement(Animated.View, {
    ref: containerRef,
    testID: testID,
    style: style,
    onTouchStart: onTouchBegin,
    onTouchEnd: onTouchEnd
  }, props.children));
};

export const ScrollViewGesture = IScrollViewGesture;
//# sourceMappingURL=ScrollViewGesture.js.map