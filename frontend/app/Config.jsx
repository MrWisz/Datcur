import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import { router } from "expo-router";

export default function Config() {
  const [fontsLoaded] = useFonts({
    ComicNeue: require("../assets/fonts/ComicNeue-Regular.ttf"),
    "ComicNeue-Bold": require("../assets/fonts/ComicNeue-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.menuContainer}>
        <MenuItem icon="lightbulb-outline" text="Cambiar contraseña" />
        <MenuItem icon="lightbulb-outline" text="Cambiar foto de perfil" />
        <MenuItem
          icon="lightbulb-outline"
          text="Modificar información personal"
        />
        <MenuItem icon="lightbulb-outline" text="Seguridad" />
        <TouchableOpacity onPress={() => router.push("/Login")}>
          <MenuItem icon="" text="Salir" noIcon />
        </TouchableOpacity>
      </View>
      <BottomNavigation />
    </View>
  );
}

const MenuItem = ({ icon, text, noIcon = false }) => {
  return (
    <TouchableOpacity style={styles.menuItem}>
      {!noIcon && (
        <MaterialIcons
          name={icon}
          size={20}
          color="#000"
          style={styles.menuIcon}
        />
      )}
      <Text style={styles.menuText}>{text}</Text>
    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontFamily: "ComicNeue",
    fontSize: 16,
  },
});

//export default Config;
