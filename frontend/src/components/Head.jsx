import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import head from "../../assets/images/head.png";

const { width } = Dimensions.get("window"); // Obtener ancho de la pantalla

export default function Head() {
  return (
    <View style={styles.container}>
      <Image source={head} style={styles.img} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 130, 
  },
  img: {
    width: width, 
    height: "100%", 
  },
});







/*import React from "react";
import { StyleSheet, View, Image } from "react-native";
import head from "../../assets/images/head.png"

export default function Head() {
  return (
    <View style={styles.container}>
      <Image source={head} style={styles.img}></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    //overflow: "hidden",
  },
  img: {
    width: 100,
    height: 100,
  },
});*/
