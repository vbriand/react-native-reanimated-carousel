import React from "react";
import { View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { PaginationItem } from "./PaginationItem";
export const Basic = props => {
  const {
    activeDotStyle,
    dotStyle,
    progress,
    horizontal = true,
    data,
    size,
    containerStyle,
    renderItem,
    onPress
  } = props;
  if (typeof size === "string" || typeof (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.width) === "string" || typeof (dotStyle === null || dotStyle === void 0 ? void 0 : dotStyle.height) === "string") throw new Error("size/width/height must be a number");
  return /*#__PURE__*/React.createElement(View, {
    style: [{
      justifyContent: "space-between",
      alignSelf: "center"
    }, horizontal ? {
      flexDirection: "row"
    } : {
      flexDirection: "column"
    }, containerStyle]
  }, data.map((item, index) => {
    return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
      key: index,
      onPress: () => onPress === null || onPress === void 0 ? void 0 : onPress(index)
    }, /*#__PURE__*/React.createElement(PaginationItem, {
      index: index,
      size: size,
      count: data.length,
      dotStyle: dotStyle,
      animValue: progress,
      horizontal: !horizontal,
      activeDotStyle: activeDotStyle
    }, renderItem === null || renderItem === void 0 ? void 0 : renderItem(item, index)));
  }));
};
//# sourceMappingURL=index.js.map