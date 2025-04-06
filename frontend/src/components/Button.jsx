import React from "react";
import { useFonts } from "expo-font";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ButtonPrimary = ({ content, onPress }) => {
  const [fontsLoaded] = useFonts({
    ComicNeue: require("../../assets/fonts/ComicNeue-Regular.ttf"),
    "ComicNeue-Bold": require("../../assets/fonts/ComicNeue-Bold.ttf"),
  });
  return (
    <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{content}</Text>
    </TouchableOpacity>
  );
};

const ButtonSecondary = ({ content, onPress }) => {
  const [fontsLoaded] = useFonts({
    ComicNeue: require("../../assets/fonts/ComicNeue-Regular.ttf"),
    "ComicNeue-Bold": require("../../assets/fonts/ComicNeue-Bold.ttf"),
  });
  return (
    <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
      <Text style={styles.secondaryButtonText}>{content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#FDBF2E",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginRight: 10,
    marginLeft: 10,
  },
  primaryButtonText: {
    color: "black",
    fontSize: 16,
    fontFamily: "ComicNeue-Bold",
  },
  secondaryButton: {
    backgroundColor: "#B3B3B3",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    fontFamily: "ComicNeue",
    marginRight: 10,
    marginLeft: 10,
  },
  secondaryButtonText: {
    color: "black",
    fontSize: 16,
    fontFamily: "ComicNeue-Bold",
  },
});

export { ButtonPrimary, ButtonSecondary };
