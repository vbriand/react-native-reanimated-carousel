"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = log;
exports.round = round;
/**
 * In worklet
 * e.g. runOnJS(lop)(...);
 */
function log(...msg) {
  // eslint-disable-next-line no-console
  console.log(...msg);
}
function round(number) {
  "worklet";

  return Math.round(number);
}
//# sourceMappingURL=log.js.map