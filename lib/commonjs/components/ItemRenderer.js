"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemRenderer = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNativeReanimated = require("react-native-reanimated");
var _useVisibleRanges = require("../hooks/useVisibleRanges");
var _computedWithAutoFillData = require("../utils/computed-with-auto-fill-data");
var _BaseLayout = require("./BaseLayout");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ItemRenderer = props => {
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
  const visibleRanges = (0, _useVisibleRanges.useVisibleRanges)({
    loop,
    total: dataLength,
    translation: handlerOffset,
    viewSize: size,
    windowSize
  });
  const [displayedItems, setDisplayedItems] = _react.default.useState(null);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => visibleRanges.value, ranges => {
    (0, _reactNativeReanimated.runOnJS)(setDisplayedItems)(ranges);
  }, [visibleRanges]);
  if (!displayedItems) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, data.map((item, index) => {
    const realIndex = (0, _computedWithAutoFillData.computedRealIndexWithAutoFillData)({
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
    return /*#__PURE__*/_react.default.createElement(_BaseLayout.BaseLayout, {
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
exports.ItemRenderer = ItemRenderer;
//# sourceMappingURL=ItemRenderer.js.map