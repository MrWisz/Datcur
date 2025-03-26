import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { View, StyleSheet, Text } from "react-native";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Comic-Neue": require("../assets/fonts/ComicNeue-Regular.ttf"),
    "Comic-Bold": require("../assets/fonts/ComicNeue-Bold.ttf")
  });

  if (!fontsLoaded) {
    return (
      <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
        Cargando fuentes...
      </Text>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="light" />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
