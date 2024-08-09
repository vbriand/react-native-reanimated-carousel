"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Basic = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _PaginationItem = require("./PaginationItem");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Basic = props => {
  const {
    activeDotStyle,
    dotStyle,
    progress,
    horizontal = true,
    data,
    size,
    containerStyle,
    renderItem,
    onPress
  } = props;
  if (typeof size === "string" || typeof (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.width) === "string" || typeof (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.height) === "string") throw new Error("size/width/height must be a number");
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [{
      justifyContent: "space-between",
      alignSelf: "center"
    }, horizontal ? {
      flexDirection: "row"
    } : {
      flexDirection: "column"
    }, containerStyle]
  }, data.map((item, index) => {
    return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.TouchableWithoutFeedback, {
      key: index,
      onPress: () => onPress === null || onPress === void 0 ? void 0 : onPress(index)
    }, /*#__PURE__*/_react.default.createElement(_PaginationItem.PaginationItem, {
      index: index,
      size: size,
      count: data.length,
      dotStyle: dotStyle,
      animValue: progress,
      horizontal: !horizontal,
      activeDotStyle: activeDotStyle
    }, renderItem === null || renderItem === void 0 ? void 0 : renderItem(item, index)));
  }));
};
exports.Basic = Basic;
//# sourceMappingURL=index.js.map