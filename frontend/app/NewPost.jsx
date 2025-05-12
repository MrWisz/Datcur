import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import { ButtonPrimary } from "../src/components/Button";
import { ButtonSecondary } from "../src/components/Button";
import * as ImagePicker from "expo-image-picker";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

const NewPost = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      ComicNeue: require("../assets/fonts/ComicNeue-Regular.ttf"),
      "ComicNeue-Bold": require("../assets/fonts/ComicNeue-Bold.ttf"),
    }).then(() => setFontsLoaded(true));
  }, []);

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

  const publicarPost = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!descripcion.trim()) {
        Alert.alert("Campo requerido", "Debes escribir una descripción.");
        return;
      }

      if (!selectedImage) {
        Alert.alert("Imagen requerida", "Debes seleccionar una imagen.");
        return;
      }

      const formData = new FormData();
      formData.append("descripcion", descripcion);
      formData.append("etiquetas", JSON.stringify([]));
      formData.append("fecha_creacion", new Date().toISOString());
      formData.append("images", {
        uri: selectedImage,
        name: "post.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(
        `${Constants.expoConfig.extra.API_URL}/posts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error al publicar:", errorText);
        throw new Error("Error al crear el post");
      }

      Alert.alert("✅ Éxito", "¡Publicación creada con éxito!");
      router.push("/Home");
    } catch (err) {
      console.error("Error al publicar:", err);
      Alert.alert("Error", "Ocurrió un error al crear el post.");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.contentArea}>
        <Text style={styles.title}>Crear nueva publicación</Text>
        <Text style={styles.subtitle}>
          Añade descripción de tu publicación
        </Text>

        <TextInput
          multiline
          numberOfLines={5}
          value={descripcion}
          onChangeText={setDescripcion}
          style={{
            height: 100,
            width: "80%",
            backgroundColor: "#BFEEFE",
            padding: 10,
            borderRadius: 10,
            textAlignVertical: "top",
          }}
        />

        <View style={{ height: 250, width: "80%", marginBottom: 20 }}>
          <TouchableOpacity onPress={pickImage} style={{ flex: 1 }}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.img} />
            )}
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              {selectedImage ? "Cambiar Imagen" : "Adjuntar Imagen"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 90 }}>
          <ButtonPrimary content="Publicar" onPress={publicarPost} />
          <ButtonSecondary
            content="Cancelar"
            onPress={() => router.replace("/Home")}
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
    paddingBottom: 20,
  },
  img: {
    marginTop: 10,
    paddingTop: 20,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
});

export default NewPost;
