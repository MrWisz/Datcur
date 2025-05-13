import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import { ButtonPrimary } from "../src/components/Button";
import { ButtonSecondary } from "../src/components/Button";
import * as ImagePicker from "expo-image-picker";

const NewPost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const iconGallery = require("../assets/icons/iconAdjuntar.png");
  
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

  const handleCancel = () => {
    setSelectedImage(null);
  };

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
      <View style={styles.contentArea}>
        <Text style={styles.title}>Crear nueva publicación</Text>
        <Text style={styles.subtitle}>Añade descripción de tu publicación</Text>

        <TextInput
          multiline={true}
          numberOfLines={10}
          style={styles.textArea}
          textAlignVertical="top"
          placeholder="¿Qué quieres compartir?"
          placeholderTextColor="#666"
        />

        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Image source={iconGallery} style={styles.iconGallery} />
                <Text style={styles.placeholderText}>Adjuntar Imagen</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <ButtonPrimary
            content="Publicar"
            onPress={publicarPost}
          />
          <ButtonSecondary 
            content="Cancelar" 
            onPress={handleCancel}
          />
        </View>
      </View>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentArea: {
    flex: 1,
    paddingTop: 6,
    alignItems: "center",
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
  textArea: {
    height: 150,
    width: "80%",
    backgroundColor: "#BFEEFE",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: "ComicNeue",
    marginBottom: 20,
    textAlignVertical: "top",
  },
  imageContainer: {
    height: 250,
    width: "80%",
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconGallery: {
    width: 60,  
    height: 60,  
    resizeMode: "contain",
  },
  placeholderText: {
    marginTop: 10,
    fontFamily: "ComicNeue",
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default NewPost;