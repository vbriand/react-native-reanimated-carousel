import type { PropsWithChildren } from 'react';
import React, { useCallback } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type {
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  measure,
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

import { Easing } from '../constants';
import { usePanGestureProxy } from '../hooks/usePanGestureProxy';
import { CTX } from '../store';
import type { WithTimingAnimation } from '../types';
import { dealWithAnimation } from '../utils/deal-with-animation';

interface Props {
  infinite?: boolean;
  onScrollEnd?: () => void;
  onScrollStart?: () => void;
  onTouchBegin?: () => void;
  onTouchEnd?: () => void;
  size: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  translation: SharedValue<number>;
}

const IScrollViewGesture: React.FC<PropsWithChildren<Props>> = props => {
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
      withAnimation,
    },
  } = React.useContext(CTX);

  const {
    onScrollEnd,
    onScrollStart,
    onTouchBegin,
    onTouchEnd,
    size,
    style = {},
    testID,
    translation,
  } = props;

  const maxPage = dataLength;
  const isHorizontal = useDerivedValue(() => !vertical, [vertical]);
  const max = useSharedValue(0);
  const panOffset = useSharedValue(0);
  const touching = useSharedValue(false);
  const validStart = useSharedValue(false);
  const scrollEndTranslation = useSharedValue(0);
  const scrollEndVelocity = useSharedValue(0);
  const containerRef = useAnimatedRef<Animated.View>();
  const maxScrollDistancePerSwipeIsSet =
    typeof maxScrollDistancePerSwipe === 'number';
  const minScrollDistancePerSwipeIsSet =
    typeof minScrollDistancePerSwipe === 'number';

  // Get the limit of the scroll.
  const getLimit = React.useCallback(() => {
    'worklet';

    if (!loop && !overscrollEnabled) {
      const { width: containerWidth = 0 } = measure(containerRef) ?? {};

      // If the item's total width is less than the container's width, then there is no need to scroll.
      if (dataLength * size < containerWidth) {
        return 0;
      }

      // Disable the "overscroll" effect
      return dataLength * size - containerWidth;
    }

    return dataLength * size;
  }, [loop, size, dataLength, overscrollEnabled, containerRef]);

  const withSpring = React.useCallback(
    (toValue: number, onFinished?: () => void) => {
      'worklet';
      const defaultWithAnimation: WithTimingAnimation = {
        config: {
          duration: scrollAnimationDuration + 100,
          easing: Easing.easeOutQuart,
        },
        type: 'timing',
      };

      return dealWithAnimation(withAnimation ?? defaultWithAnimation)(
        toValue,
        (isFinished: boolean) => {
          'worklet';
          if (isFinished) {
            onFinished && runOnJS(onFinished)();
          }
        },
      );
    },
    [scrollAnimationDuration, withAnimation],
  );

  const endWithSpring = React.useCallback(
    (onFinished?: () => void) => {
      'worklet';
      const origin = translation.value;
      const velocity = scrollEndVelocity.value;
      // Default to scroll in the direction of the slide (with deceleration)
      let finalTranslation: number = withDecay({
        deceleration: 0.999,
        velocity,
      });

      // If the distance of the swipe exceeds the max scroll distance, keep the view at the current position
      if (
        maxScrollDistancePerSwipeIsSet &&
        Math.abs(scrollEndTranslation.value) > maxScrollDistancePerSwipe
      ) {
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

            finalTranslation = withSpring(
              withProcessTranslation(-finalPage * size),
              onFinished,
            );
          } else {
            const finalPage = Math.min(maxPage - 1, Math.max(0, page + offset));

            finalTranslation = withSpring(
              withProcessTranslation(-finalPage * size),
              onFinished,
            );
          }
        }

        if (!pagingEnabled && snapEnabled) {
          // scroll to the nearest item
          const nextPage = Math.round((origin + velocity * 0.4) / size) * size;

          finalTranslation = withSpring(
            withProcessTranslation(nextPage),
            onFinished,
          );
        }
      }

      translation.value = finalTranslation;

      function withProcessTranslation(translation: number) {
        if (!loop && !overscrollEnabled) {
          const limit = getLimit();
          const sign = Math.sign(translation);

          return sign * Math.max(0, Math.min(limit, Math.abs(translation)));
        }

        return translation;
      }
    },
    [
      translation,
      scrollEndVelocity.value,
      maxScrollDistancePerSwipeIsSet,
      scrollEndTranslation.value,
      maxScrollDistancePerSwipe,
      pagingEnabled,
      snapEnabled,
      size,
      loop,
      withSpring,
      maxPage,
      overscrollEnabled,
      getLimit,
    ],
  );

  const onFinish = React.useCallback(
    (isFinished: boolean) => {
      'worklet';
      if (isFinished) {
        touching.value = false;
        onScrollEnd && runOnJS(onScrollEnd)();
      }
    },
    [onScrollEnd, touching],
  );

  const activeDecay = React.useCallback(() => {
    'worklet';
    touching.value = true;
    translation.value = withDecay(
      { velocity: scrollEndVelocity.value },
      isFinished => {
        onFinish(isFinished!);
      },
    );
  }, [onFinish, scrollEndVelocity.value, touching, translation]);

  const resetBoundary = React.useCallback(() => {
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
  }, [
    touching.value,
    translation,
    maxPage,
    size,
    scrollEndTranslation.value,
    loop,
    activeDecay,
    withSpring,
  ]);

  useAnimatedReaction(
    () => translation.value,
    () => {
      if (!pagingEnabled) {
        resetBoundary();
      }
    },
    [pagingEnabled, resetBoundary],
  );

  const withProcessTranslation = useCallback(
    (translation: number) => {
      'worklet';

      if (!loop && !overscrollEnabled) {
        const limit = getLimit();
        const sign = Math.sign(translation);

        return sign * Math.max(0, Math.min(limit, Math.abs(translation)));
      }

      return translation;
    },
    [getLimit, loop, overscrollEnabled],
  );

  const onGestureStart = useCallback(
    (_: PanGestureHandlerEventPayload) => {
      'worklet';

      touching.value = true;
      validStart.value = true;
      onScrollStart && runOnJS(onScrollStart)();

      max.value = (maxPage - 1) * size;
      if (!loop && !overscrollEnabled) {
        max.value = getLimit();
      }

      panOffset.value = translation.value;
    },
    [
      max,
      size,
      maxPage,
      loop,
      touching,
      panOffset,
      validStart,
      translation,
      overscrollEnabled,
      getLimit,
      onScrollStart,
    ],
  );

  const onGestureUpdate = useCallback(
    (e: PanGestureHandlerEventPayload) => {
      'worklet';

      if (validStart.value) {
        validStart.value = false;
        cancelAnimation(translation);
      }

      touching.value = true;
      const { translationX, translationY } = e;

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
    },
    [
      isHorizontal,
      max,
      panOffset,
      loop,
      fixedDirection,
      translation,
      validStart,
      touching,
    ],
  );

  const onGestureEnd = useCallback(
    (
      e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
      _success: boolean,
    ) => {
      'worklet';

      const { translationX, translationY, velocityX, velocityY } = e;

      scrollEndVelocity.value = isHorizontal.value ? velocityX : velocityY;

      let panTranslation = isHorizontal.value ? translationX : translationY;

      if (fixedDirection === 'negative') {
        panTranslation = -Math.abs(panTranslation);
      } else if (fixedDirection === 'positive') {
        panTranslation = +Math.abs(panTranslation);
      }

      scrollEndTranslation.value = panTranslation;

      const totalTranslation =
        scrollEndVelocity.value + scrollEndTranslation.value;

      /**
       * If the maximum scroll distance is set and the translation `exceeds the maximum scroll distance`,
       * the carousel will keep the view at the current position.
       */
      if (
        maxScrollDistancePerSwipeIsSet &&
        Math.abs(totalTranslation) > maxScrollDistancePerSwipe
      ) {
        const nextPage =
          Math.round(
            (panOffset.value +
              maxScrollDistancePerSwipe * Math.sign(totalTranslation)) /
              size,
          ) * size;

        translation.value = withSpring(
          withProcessTranslation(nextPage),
          onScrollEnd,
        );
      } else if (
        /**
         * If the minimum scroll distance is set and the translation `didn't exceeds the minimum scroll distance`,
         * the carousel will keep the view at the current position.
         */
        minScrollDistancePerSwipeIsSet &&
        Math.abs(totalTranslation) < minScrollDistancePerSwipe
      ) {
        const nextPage =
          Math.round(
            (panOffset.value +
              minScrollDistancePerSwipe * Math.sign(totalTranslation)) /
              size,
          ) * size;

        translation.value = withSpring(
          withProcessTranslation(nextPage),
          onScrollEnd,
        );
      } else {
        endWithSpring(onScrollEnd);
      }

      if (!loop) {
        touching.value = false;
      }
    },
    [
      scrollEndVelocity,
      isHorizontal.value,
      fixedDirection,
      scrollEndTranslation,
      maxScrollDistancePerSwipeIsSet,
      maxScrollDistancePerSwipe,
      minScrollDistancePerSwipeIsSet,
      minScrollDistancePerSwipe,
      loop,
      panOffset.value,
      size,
      translation,
      withSpring,
      withProcessTranslation,
      onScrollEnd,
      endWithSpring,
      touching,
    ],
  );

  const gesture = usePanGestureProxy({
    onConfigurePanGesture,
    onGestureEnd,
    onGestureStart,
    onGestureUpdate,
    options: { enabled },
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchBegin}
        ref={containerRef}
        style={style}
        testID={testID}
      >
        {props.children}
      </Animated.View>
    </GestureDetector>
  );
};

export const ScrollViewGesture = IScrollViewGesture;
