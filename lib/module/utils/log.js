/**
 * In worklet
 * e.g. runOnJS(lop)(...);
 */
export function log(...msg) {
  // eslint-disable-next-line no-console
  console.log(...msg);
}
export function round(number) {
  "worklet";

  return Math.round(number);
}
//# sourceMappingURL=log.js.map