export const LazyView = props => {
  const {
    children,
    shouldUpdate
  } = props;
  if (!shouldUpdate) {
    return /*#__PURE__*/React.createElement(React.Fragment, null);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
};
//# sourceMappingURL=LazyView.js.map