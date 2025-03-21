import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Navigation from './navigation/Navigation';

export default function App() {

  const [fontsLoaded] = useFonts({
    Comic: require("../assets/fonts/ComicNeue-Regular.otf"),
  });

  //mostrar la pantalla por mas tiempo hasta que la fuente este cargada
  useEffect(() => {
    async function loadFonts() {
      await SplashScreen.preventAutoHideAsync();
    }
    loadFonts();
  }, []);
  //quitar el SplashSreen para que se muestre
  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <Navigation />
    </View>
  );
}