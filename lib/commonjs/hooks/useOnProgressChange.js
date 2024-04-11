"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useOnProgressChange = useOnProgressChange;

var _reactNativeReanimated = require("react-native-reanimated");

var _computedWithAutoFillData = require("../utils/computed-with-auto-fill-data");

function useOnProgressChange(opts) {
  const {
    autoFillData,
    loop,
    offsetX,
    size,
    rawDataLength,
    onProgressChange
  } = opts;
  (0, _reactNativeReanimated.useAnimatedReaction)(() => offsetX.value, _value => {
    let value = (0, _computedWithAutoFillData.computedOffsetXValueWithAutoFillData)({
      value: _value,
      rawDataLength,
      size,
      autoFillData,
      loop
    });

    if (!loop) {
      value = Math.max(-((rawDataLength - 1) * size), Math.min(value, 0));
    }

    let absoluteProgress = Math.abs(value / size);
    if (value > 0) absoluteProgress = rawDataLength - absoluteProgress;
    if (onProgressChange) (0, _reactNativeReanimated.runOnJS)(onProgressChange)(value, absoluteProgress);
  }, [loop, autoFillData, rawDataLength, onProgressChange]);
}
//# sourceMappingURL=useOnProgressChange.js.map