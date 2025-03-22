import React from "react";
import { Text } from "react-native";

export default function CustomText({ style, children }) {
  // Selecciona la fuente en base a fontWeight
  const fontFamily = style?.fontWeight === "bold" ? "ComicBold" : "Comic";

  return <Text style={[{ fontFamily }, style]}>{children}</Text>;
}