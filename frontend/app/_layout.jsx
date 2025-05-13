import React, { useState } from "react";
import { Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { View, StyleSheet, Text, Alert, BackHandler } from "react-native";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import CustomToast from "../src/components/CustomToast";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Comic-Neue": require("../assets/fonts/ComicNeue-Regular.ttf"),
    "Comic-Bold": require("../assets/fonts/ComicNeue-Bold.ttf")
  });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
    lockOrientation();

    const backAction = () => {
      if (pathname === "/Home") {
        Alert.alert(
          "Salir",
          "¿Estás seguro que deseas salir de la aplicación?",
          [
            {
              text: "Cancelar",
              onPress: () => null,
              style: "cancel"
            },
            { 
              text: "Sí", 
              onPress: () => BackHandler.exitApp() 
            }
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [pathname]);

  if (!fontsLoaded) {
    return (
      <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
        Cargando fuentes...
      </Text>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <ThemeProvider value={DefaultTheme}>
      <View style={styles.container}>
        <Stack 
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            presentation: "modal",
            headerLeft: () => null,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
            navigationBarHidden: true,
          }} 
        />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
    backgroundColor: "#000",
  },
});
