import React from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import { ButtonPrimary } from "../src/components/Button";
import { ButtonSecondary } from "../src/components/Button";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import iconAdjuntar from "../assets/icons/iconAdjuntar.png";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";

const NewPost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
      // Función para abrir la galería
      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
  
        if (!result.canceled) {
          setSelectedImage(result.assets[0].uri);
        }
      };


  //const iconGallery = require("../assets/icons/iconAdjuntar.png");
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
          style={{ height: 150, width: "80%", backgroundColor: "#BFEEFE" }}
        />

        <View
          style={{ height: 250, width: "80%", marginBottom: 20 }}
          /*style={{
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "ComicNeue",
            marginBottom: 30,
          }}*/
        >
          <TouchableOpacity onPress={pickImage} style={{ flex: 1 }}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.img} />
            )}
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              {selectedImage ? "Cambiar Imagen" : "Adjuntar Imagen"}
            </Text>
          </TouchableOpacity>
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
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", 
    borderRadius: 10,
  },
});

export default NewPost;
