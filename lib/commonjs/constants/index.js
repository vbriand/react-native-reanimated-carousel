"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Easing = exports.DATA_LENGTH = void 0;
var _reactNativeReanimated = require("react-native-reanimated");
let DATA_LENGTH = exports.DATA_LENGTH = /*#__PURE__*/function (DATA_LENGTH) {
  DATA_LENGTH[DATA_LENGTH["SINGLE_ITEM"] = 1] = "SINGLE_ITEM";
  DATA_LENGTH[DATA_LENGTH["DOUBLE_ITEM"] = 2] = "DOUBLE_ITEM";
  return DATA_LENGTH;
}({});
const Easing = exports.Easing = {
  easeOutQuart: _reactNativeReanimated.Easing.bezier(0.25, 1, 0.5, 1)
};
//# sourceMappingURL=index.js.map