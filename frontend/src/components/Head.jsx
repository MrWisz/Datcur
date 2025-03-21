import React from "react";
import {StyleSheet, View} from "react-native";

export default function Head() {
    return (
      <View style={styles.container}>
        <View style={styles.blueSection} />
        <View style={styles.yellowSection} />
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    position: "absolute", 
    top: 0,
    width: "100%",
    height: 100,
    bottom: "5%",
  },
  blueSection: {
    backgroundColor: "#5BD4FF",
    height: "80%", // Ocupa la parte superior
  },
  yellowSection: {
    backgroundColor: "#FFC000",
    height: "20%", // Franja ondulada en el medio
    borderTopLeftRadius: 50, // Ajusta para un efecto ondulado
    borderTopRightRadius: 50,
  },
});
