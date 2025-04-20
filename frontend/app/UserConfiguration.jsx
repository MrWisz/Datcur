import {
  StyleSheet,
  Text,
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

export default function UserConfiguration() {
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

    //Funcion para mostrar mensaje de confirmacion
    const handlePress = () => {
      Toast.show({
        type: "customToast",
        text1: "Exito",
        text2: "¡Tu información ha sido guardada con exito!",
        visibilityTime: 3000,
        position: "center",
      });

    setTimeout(() => {
      router.push("/Home");
    }, 3000);

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
              <CustomText
                style={[styles.buttonText, { fontSize: 28, marginTop: "10%" }]}
              >
                Foto de perfil
              </CustomText>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={selectedImage ? { uri: selectedImage } : profile}
                  style={styles.img}
                />
              </TouchableOpacity>
              <CustomText style={{ textAlign: "center" }}>
                Añade una foto de perfil
              </CustomText>
              <TextInput
                style={styles.input}
                placeholder="Escribe aquí tus gustos, hobbies y demás información"
                multiline={true}
              ></TextInput>
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
  inner: {
    alignItems: "center",
    paddingBottom: 20,
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
  input: {
    height: 150,
    width: 300,
    margin: 25,
    marginTop: "10%",
    backgroundColor: "rgba(91, 212, 255, 0.25)",
    paddingLeft: "5%",
    paddingTop: "5%",
    textAlignVertical: "top",
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




