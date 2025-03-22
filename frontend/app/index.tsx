import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { useFonts } from 'expo-font';
import Home from "./Home";
// import Config from "./Config";

export default function Index() {

  const [fontsLoaded] = useFonts({
    'ComicNeue': require('@/assets/fonts/ComicNeue-Regular.ttf'),
    'ComicNeue-Bold': require('@/assets/fonts/ComicNeue-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Home />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'ComicNeue'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 0,
    paddingTop:20,
  },
});
