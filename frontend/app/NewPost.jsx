import React from "react";
import { View, Text, Image, StyleSheet, TextInput } from "react-native";
import { useFonts } from "expo-font";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import { ButtonPrimary } from "../src/components/Button";
import { ButtonSecondary } from "../src/components/Button";

const NewPost = () => {
  const iconGallery = require("../assets/icons/iconAdjuntar.png");
  const [fontsLoaded] = useFonts({
    ComicNeue: require("../assets/fonts/ComicNeue-Regular.ttf"),
    "ComicNeue-Bold": require("../assets/fonts/ComicNeue-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const publicarPost = () => {
    alert("publicar este post");
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Content Area */}
      <View style={styles.contentArea}>
        <Text style={styles.title}>Crear nueva publicación</Text>
        <Text style={styles.subtitle}>Añade descripción de tu publicación</Text>

        <TextInput
          multiline={true}
          numberOfLines={10}
          style={{ height: 200, width: "80%", backgroundColor: "#BFEEFE" }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "ComicNeue",
            marginBottom: 30,
          }}
        >
          <Image source={iconGallery}></Image>
          <Text>Adjuntar Imagen</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ButtonPrimary
            content="Publicar"
            onPress={publicarPost}
          ></ButtonPrimary>
          <ButtonSecondary content="Cancelar"></ButtonSecondary>
        </View>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: "ComicNeue-Bold",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontFamily: "ComicNeue",
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  contentArea: {
    flex: 1,
    paddingTop: 6,
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    paddingBottom: 10,
  },
});

export default NewPost;
