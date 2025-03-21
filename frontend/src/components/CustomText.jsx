import React from "react";
import { Text, StyleSheet } from "react-native";

export default function CustomText({ style, children }) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Comic", // Usa la fuente cargada en App.js
  },
});
