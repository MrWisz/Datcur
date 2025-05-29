import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, BackHandler } from "react-native";
import { useFonts } from "expo-font";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Config() {
  const [fontsLoaded] = useFonts({
    ComicNeue: require("../assets/fonts/ComicNeue-Regular.ttf"),
    "ComicNeue-Bold": require("../assets/fonts/ComicNeue-Bold.ttf"),
  });

  const router = useRouter(); 

  useEffect(() => {
    const backAction = () => {
      router.replace("/Home");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("userId");
    router.replace("/Login");
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Si", onPress: cerrarSesion },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.menuContainer}>
        <MenuItem
          icon="lightbulb-outline"
          text="Cambiar contraseña"
          onPress={() => router.push("/ChangePassword")}
        />
        <MenuItem
          icon="lightbulb-outline"
          text="Cambiar foto de perfil"
          onPress={() => router.push("/UserConfiguration")}
        />
        <MenuItem
          icon="lightbulb-outline"
          text="Modificar información personal"
          onPress={() => router.push("/ChangeInPersonal")}
        />
        <MenuItem
          icon=""
          text="Salir"
          noIcon
          onPress={handleLogout}
        />
      </View>
      <BottomNavigation />
    </View>
  );
}

const MenuItem = ({ icon, text, noIcon = false, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
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
