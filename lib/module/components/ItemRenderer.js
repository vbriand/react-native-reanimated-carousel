import React from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { useVisibleRanges } from '../hooks/useVisibleRanges';
import { computedRealIndexWithAutoFillData } from '../utils/computed-with-auto-fill-data';
import { BaseLayout } from './BaseLayout';
export const ItemRenderer = props => {
  const {
    autoFillData,
    customAnimation,
    data,
    dataLength,
    handlerOffset,
    layoutConfig,
    loop,
    offsetX,
    rawDataLength,
    renderItem,
    size,
    windowSize
  } = props;
  const visibleRanges = useVisibleRanges({
    loop,
    total: dataLength,
    translation: handlerOffset,
    viewSize: size,
    windowSize
  });
  const [displayedItems, setDisplayedItems] = React.useState(null);
  useAnimatedReaction(() => visibleRanges.value, ranges => {
    runOnJS(setDisplayedItems)(ranges);
  }, [visibleRanges]);
  if (!displayedItems) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, data.map((item, index) => {
    const realIndex = computedRealIndexWithAutoFillData({
      autoFillData,
      dataLength: rawDataLength,
      index,
      loop
    });
    const {
      negativeRange,
      positiveRange
    } = displayedItems;
    const shouldRender = index >= negativeRange[0] && index <= negativeRange[1] || index >= positiveRange[0] && index <= positiveRange[1];
    if (!shouldRender) {
      return null;
    }
    return /*#__PURE__*/React.createElement(BaseLayout, {
      animationStyle: customAnimation || layoutConfig,
      handlerOffset: offsetX,
      index: index,
      key: index,
      visibleRanges: visibleRanges
    }, ({
      animationValue
    }) => renderItem({
      animationValue,
      index: realIndex,
      item
    }));
  }));
};
//# sourceMappingURL=ItemRenderer.js.map