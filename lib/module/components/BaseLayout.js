import React from 'react';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { useOffsetX } from '../hooks/useOffsetX';
import { CTX } from '../store';
export const BaseLayout = props => {
  const {
    animationStyle,
    children,
    handlerOffset,
    index,
    visibleRanges
  } = props;
  const context = React.useContext(CTX);
  const {
    props: {
      customConfig,
      dataLength,
      height,
      loop,
      mode,
      modeConfig,
      vertical,
      width
    }
  } = context;
  const size = vertical ? height : width;
  let offsetXConfig = {
    dataLength,
    handlerOffset,
    index,
    loop,
    size,
    ...(typeof customConfig === 'function' ? customConfig() : {})
  };
  if (mode === 'horizontal-stack') {
    const {
      showLength,
      snapDirection
    } = modeConfig;
    offsetXConfig = {
      dataLength,
      handlerOffset,
      index,
      loop,
      size,
      type: snapDirection === 'right' ? 'negative' : 'positive',
      viewCount: showLength
    };
  }
  const x = useOffsetX(offsetXConfig, visibleRanges);
  const animationValue = useDerivedValue(() => x.value / size, [x, size]);
  const animatedStyle = useAnimatedStyle(() => {
    return animationStyle(x.value / size);
  }, [animationStyle]);
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [{
      height: height || '100%',
      position: 'absolute',
      width: width || '100%'
    }, animatedStyle]
    /**
     * We use this testID to know when the carousel item is ready to be tested in test.
     * e.g.
     *  The testID of first item will be changed to __CAROUSEL_ITEM_0_READY__ from __CAROUSEL_ITEM_0_NOT_READY__ when the item is ready.
     * */,
    testID: `__CAROUSEL_ITEM_${index}__`
  }, children({
    animationValue
  }));
};
//# sourceMappingURL=BaseLayout.js.map