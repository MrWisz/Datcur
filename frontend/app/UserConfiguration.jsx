import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Header from '../src/components/Header';
import CustomText from "../src/components/CustomText";
import profile from "../assets/images/addprofile.png";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import Toast from "react-native-toast-message";
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig.extra.API_URL;

export default function UserConfiguration() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [gustosText, setGustosText] = useState("");

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

  const handlePress = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Toast.show({
          type: "error",
          text1: "Falta información del usuario",
        });
        return;
      }

      const gustosArray = gustosText
        .split("\n")
        .map((g) => g.trim())
        .filter((g) => g);

      // Validar que gustos no esté vacío
      if (gustosArray.length === 0) {
        Toast.show({
          type: "error",
          text1: "Debes escribir al menos un gusto",
        });
        return;
      }

      // Solo requerir imagen si NO se está enviando solo gustos
      if (!selectedImage) {
        // Aquí se envían solo los gustos (sin imagen)
        const response = await fetch(`${API_URL}/users/${userId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gustos: gustosArray }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Backend error:", errorText);
          throw new Error("Error al guardar la configuración");
        }

        Toast.show({
          type: "customToast",
          text1: "Éxito",
          text2: "¡Tus gustos han sido guardados!",
          visibilityTime: 3000,
          position: "center",
        });

        setTimeout(() => {
          router.push("/Home");
        }, 3000);

        return;
      }

      // Si hay imagen, se envía con FormData (imagen + gustos)
      const formData = new FormData();
      formData.append("file", {
        uri: selectedImage,
        name: "profile.jpg",
        type: "image/jpeg",
      });
      formData.append("gustos", JSON.stringify(gustosArray));

      const response = await fetch(`${API_URL}/users/${userId}/configure`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // No poner Content-Type para que RN lo maneje automáticamente
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Backend error:", errorText);
        throw new Error("Error al guardar la configuración");
      }

      Toast.show({
        type: "customToast",
        text1: "Éxito",
        text2: "¡Tu información ha sido guardada!",
        visibilityTime: 3000,
        position: "center",
      });

      setTimeout(() => {
        router.push("/Home");
      }, 3000);

    } catch (err) {
      console.error("(NOBRIDGE) ERROR", err);
      Toast.show({
        type: "error",
        text1: "Error al guardar la configuración",
      });
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Header />
            <CustomText style={styles.title}>
              ¡Configura tu información personal!
            </CustomText>
            <CustomText style={[styles.buttonText, { fontSize: 28, marginTop: "10%" }]}>
              Foto de perfil
            </CustomText>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={selectedImage ? { uri: selectedImage } : profile}
                style={styles.img}
              />
            </TouchableOpacity>
            <CustomText style={{ textAlign: "center", marginTop: 5 }}>
              Añade una foto de perfil
            </CustomText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe aquí tus gustos (uno por línea)"
                multiline={true}
                value={gustosText}
                onChangeText={setGustosText}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handlePress}>
                <CustomText style={[styles.buttonText, { fontSize: 15 }]}>
                  Guardar cambios
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => router.push("/Home")}
              >
                <CustomText style={[styles.buttonText, { fontSize: 15 }]}>
                  Cancelar
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginTop: "10%",
  },
  img: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 150,
    width: '100%',
    backgroundColor: "rgba(91, 212, 255, 0.25)",
    paddingLeft: "5%",
    paddingTop: "5%",
    textAlignVertical: "top",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    width: 120,
    height: 30,
    backgroundColor: "#FFC000",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  cancelButton: {
    backgroundColor: "#808080",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Comic-Bold",
    textAlign: "center",
  },
});
