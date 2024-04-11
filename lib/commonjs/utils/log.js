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
function log() {
  // eslint-disable-next-line no-console
  console.log(...arguments);
}

function round(number) {
  "worklet";

  return Math.round(number);
}
//# sourceMappingURL=log.js.map