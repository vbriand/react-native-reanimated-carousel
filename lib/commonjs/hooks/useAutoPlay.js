"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAutoPlay = useAutoPlay;
var React = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function useAutoPlay(opts) {
  const {
    autoPlay = false,
    autoPlayReverse = false,
    autoPlayInterval,
    carouselController
  } = opts;
  const {
    prev,
    next
  } = carouselController;
  const timer = React.useRef();
  const stopped = React.useRef(!autoPlay);
  const play = React.useCallback(() => {
    if (stopped.current) return;
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      autoPlayReverse ? prev({
        onFinished: play
      }) : next({
        onFinished: play
      });
    }, autoPlayInterval);
  }, [autoPlayReverse, autoPlayInterval, prev, next]);
  const pause = React.useCallback(() => {
    if (!autoPlay) return;
    timer.current && clearTimeout(timer.current);
    stopped.current = true;
  }, [autoPlay]);
  const start = React.useCallback(() => {
    if (!autoPlay) return;
    stopped.current = false;
    play();
  }, [play, autoPlay]);
  React.useEffect(() => {
    if (autoPlay) start();else pause();
    return pause;
  }, [pause, start, autoPlay]);
  return {
    pause,
    start
  };
}
//# sourceMappingURL=useAutoPlay.js.map