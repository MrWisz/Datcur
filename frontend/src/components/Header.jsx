import React from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Logo from "./Logo";
//import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const Header = () => {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/wave.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.header}>
        <Logo />
        <TouchableOpacity onPress={() => router.replace("/Config")}>
          <Icon style={styles.config} name="settings" size={28} color="#444" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: 125,
    justifyContent: "center",
  },
  header: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  config: {
    marginBottom: 20,
  },
});

export default Header;
