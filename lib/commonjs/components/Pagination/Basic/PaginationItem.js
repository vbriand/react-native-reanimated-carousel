"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaginationItem = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const PaginationItem = props => {
  const {
    animValue,
    dotStyle,
    activeDotStyle,
    index,
    count,
    size,
    horizontal,
    children
  } = props;
  const defaultDotSize = 10;
  const sizes = {
    width: size || (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.width) || defaultDotSize,
    height: size || (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.height) || defaultDotSize
  };

  /**
   * TODO: Keep this for future implementation
   * Used to change the size of the active dot with animation
   */
  // const animatedSize = {
  //   width: activeDotStyle?.width,
  //   height: activeDotStyle?.height,
  // };

  const width = sizes.width;
  const height = sizes.height;
  const animStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const size = horizontal ? height : width;
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-size, 0, size];
    if (index === 0 && (animValue === null || animValue === void 0 ? void 0 : animValue.value) > count - 1) {
      inputRange = [count - 1, count, count + 1];
      outputRange = [-size, 0, size];
    }
    return {
      transform: [{
        translateX: (0, _reactNativeReanimated.interpolate)(animValue === null || animValue === void 0 ? void 0 : animValue.value, inputRange, outputRange, _reactNativeReanimated.Extrapolate.CLAMP)
      }]
    };
  }, [animValue, index, count, horizontal]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [{
      width,
      height,
      overflow: "hidden",
      transform: [{
        rotateZ: horizontal ? "90deg" : "0deg"
      }]
    }, dotStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [{
      backgroundColor: "black",
      flex: 1
    }, animStyle, activeDotStyle]
  }, children));
};
exports.PaginationItem = PaginationItem;
//# sourceMappingURL=PaginationItem.js.map