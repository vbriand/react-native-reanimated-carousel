"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazyView = void 0;
const LazyView = props => {
  const {
    children,
    shouldUpdate
  } = props;
  if (!shouldUpdate) {
    return /*#__PURE__*/React.createElement(React.Fragment, null);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
};
exports.LazyView = LazyView;
//# sourceMappingURL=LazyView.js.map