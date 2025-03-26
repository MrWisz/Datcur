import React from "react";
import { Text } from "react-native";

const CustomText = ({ children, style, ...props }) => {
  const fontFamily = style?.fontWeight === "bold" ? "Comic-Bold" : "Comic-Neue";

  return (
    <Text style={[{ fontFamily }, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;




