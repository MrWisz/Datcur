import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {StyleSheet} from 'react-native';

export default function RootLayout() {
  return (
 <ThemeProvider value={DefaultTheme}>
 <Stack screenOptions={{ headerShown: false }} />
 <StatusBar style={{backgroundColor:'#000'}} />
 </ThemeProvider>
 );
}
