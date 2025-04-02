import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        style={styles.logo}
        source={require("../../assets/images/dactur-logo.png")}
      />
      <Text style={styles.appTitle}>Dactur</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 4,
    width: 50,
    height: 50,
  },
  logoContainer: {
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default Logo;
