import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { View, StyleSheet, Text } from "react-native";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import CustomToast from "../src/components/CustomToast";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Comic-Neue": require("../assets/fonts/ComicNeue-Regular.ttf"),
    "Comic-Bold": require("../assets/fonts/ComicNeue-Bold.ttf")
  });

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
    lockOrientation();
  }, []);

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
        {/*mensajitos de confirmacion */}
        <Toast
          config={{
            customToast: (props) => (
              <View>
                <CustomToast {...props} />
              </View>
            ),
          }}
        />
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
