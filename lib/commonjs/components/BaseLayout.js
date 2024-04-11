"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseLayout = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _useOffsetX = require("../hooks/useOffsetX");
var _store = require("../store");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const BaseLayout = props => {
  const {
    animationStyle,
    children,
    handlerOffset,
    index,
    visibleRanges
  } = props;
  const context = _react.default.useContext(_store.CTX);
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
  const x = (0, _useOffsetX.useOffsetX)(offsetXConfig, visibleRanges);
  const animationValue = (0, _reactNativeReanimated.useDerivedValue)(() => x.value / size, [x, size]);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return animationStyle(x.value / size);
  }, [animationStyle]);
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
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
exports.BaseLayout = BaseLayout;
//# sourceMappingURL=BaseLayout.js.map