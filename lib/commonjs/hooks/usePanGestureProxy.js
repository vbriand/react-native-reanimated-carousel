"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePanGestureProxy = void 0;

var _react = require("react");

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _useUpdateGestureConfig = require("./useUpdateGestureConfig");

const usePanGestureProxy = customization => {
  const {
    onConfigurePanGesture,
    onGestureStart,
    onGestureUpdate,
    onGestureEnd,
    options = {}
  } = customization;
  const gesture = (0, _react.useMemo)(() => {
    const gesture = _reactNativeGestureHandler.Gesture.Pan(); // Save the original gesture callbacks


    const originalGestures = {
      onStart: gesture.onStart,
      onUpdate: gesture.onUpdate,
      onEnd: gesture.onEnd
    }; // Save the user defined gesture callbacks

    const userDefinedConflictGestures = {
      onStart: undefined,
      onUpdate: undefined,
      onEnd: undefined
    };

    const fakeOnStart = cb => {
      // Using fakeOnStart to save the user defined callback
      userDefinedConflictGestures.onStart = cb;
      return gesture;
    };

    const fakeOnUpdate = cb => {
      // Using fakeOnUpdate to save the user defined callback
      userDefinedConflictGestures.onUpdate = cb;
      return gesture;
    };

    const fakeOnEnd = cb => {
      // Using fakeOnEnd to save the user defined callback
      userDefinedConflictGestures.onEnd = cb;
      return gesture;
    }; // Setup the fake callbacks


    gesture.onStart = fakeOnStart;
    gesture.onUpdate = fakeOnUpdate;
    gesture.onEnd = fakeOnEnd;
    if (onConfigurePanGesture) // Get the gesture with the user defined configuration
      onConfigurePanGesture(gesture); // Restore the original callbacks

    gesture.onStart = originalGestures.onStart;
    gesture.onUpdate = originalGestures.onUpdate;
    gesture.onEnd = originalGestures.onEnd; // Setup the original callbacks with the user defined callbacks

    gesture.onStart(e => {
      onGestureStart(e);
      if (userDefinedConflictGestures.onStart) userDefinedConflictGestures.onStart(e);
    }).onUpdate(e => {
      onGestureUpdate(e);
      if (userDefinedConflictGestures.onUpdate) userDefinedConflictGestures.onUpdate(e);
    }).onEnd((e, success) => {
      onGestureEnd(e, success);
      if (userDefinedConflictGestures.onEnd) userDefinedConflictGestures.onEnd(e, success);
    });
    return gesture;
  }, [onGestureStart, onGestureUpdate, onGestureEnd, onConfigurePanGesture]);
  (0, _useUpdateGestureConfig.useUpdateGestureConfig)(gesture, options);
  return gesture;
};

exports.usePanGestureProxy = usePanGestureProxy;
//# sourceMappingURL=usePanGestureProxy.js.map