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
import padlock from "../assets/images/padlock.png";
import CustomText from "../src/components/CustomText";
import { validatePassword } from "../src/utils/helpers"; 
import { useState } from "react";
import { Input, Icon } from "react-native-elements";
import { router } from "expo-router";
import Header from "../src/components/Header";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from "expo-constants";

// Aquí definimos API_URL leyendo desde la configuración de Expo (app.json o app.config.js)
const API_URL = 
  Constants.expoConfig?.extra?.API_URL || 
  Constants.manifest?.extra?.API_URL || 
  "http://localhost:3000";

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (text, field) => {
    setFormData({ ...formData, [field]: text });
    validateField(field, text);
  };

  const validateField = (field, value) => {
    let errorMsg = "";

    if (field === "newPassword") {
      if (!validatePassword(value)) {
        errorMsg =
          "Debe contener mínimo 8 caracteres, letras, números y un carácter especial";
      }
    }

    if (field === "confirmPassword") {
      if (value !== formData.newPassword) {
        errorMsg = "Las contraseñas no coinciden";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMsg,
    }));
  };

  const handleSubmit = async () => {
    let hasErrors = false;
    let newErrors = {};

    // Verificar si algún campo está vacío
    Object.keys(formData).forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "Este campo es obligatorio.";
        hasErrors = true;
      }
    });

    // Validar cada campo
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
      if (errors[field]) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Toast.show({ type: "error", text1: "Sesión no válida" });
        return;
      }

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: formData.newPassword }),
      });

      if (response.ok) {
        Toast.show({
          type: "customToast",
          text1: "Tu contraseña",
          text2: "Ha sido cambiada correctamente",
          visibilityTime: 3000,
          position: "center",
        });

        setTimeout(() => {
          router.push("/Home");
        }, 3000);
      } else {
        const errorData = await response.json();
        Toast.show({
          type: "error",
          text1: "Error al cambiar contraseña",
          text2: errorData.message || "Inténtalo de nuevo",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error inesperado",
        text2: error.message || "Inténtalo más tarde",
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
          <View>
            <Header />
            <Image source={padlock} style={[styles.img, { marginTop: "5%" }]} />
            <CustomText
              style={[styles.buttonText, { fontSize: 30, marginBottom: "10%" }]}
            >
              Cambiar contraseña
            </CustomText>

            <View style={styles.inputContainer}>
              <CustomText style={styles.text}>Contraseña actual</CustomText>
              <TextInput
                style={styles.input}
                secureTextEntry={!showPassword}
                onChangeText={(text) => handleChange(text, "currentPassword")}
                value={formData.currentPassword}
              />
              {errors.currentPassword ? (
                <Text style={styles.errorText}>{errors.currentPassword}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <CustomText style={styles.text}>Nueva contraseña</CustomText>
              <Input
                containerStyle={styles.input}
                secureTextEntry={!showPassword}
                onChangeText={(text) => handleChange(text, "newPassword")}
                value={formData.newPassword}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              {errors.newPassword ? (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <CustomText style={styles.text}>Confirmar contraseña</CustomText>
              <Input
                containerStyle={styles.input}
                secureTextEntry={!showPassword}
                onChangeText={(text) => handleChange(text, "confirmPassword")}
                value={formData.confirmPassword}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <CustomText style={styles.buttonText}>Guardar</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => router.push("/Home")}
              >
                <CustomText style={styles.buttonText}>Cancelar</CustomText>
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
  img: {
    width: 100,
    height: 100,
    marginBottom: "5%",
    alignSelf: "center",
  },
  text: {
    alignSelf: "flex-start",
    marginLeft: "15%",
    fontFamily: "Comic-Bold",
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  input: {
    backgroundColor: "rgba(91, 212, 255, 0.25)",
    height: 40,
    width: 280,
    borderRadius: 50,
    paddingLeft: "5%",
    fontFamily: "Comic-Bold",
    alignSelf: "center",
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
    backgroundColor: "#808088",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Comic-Bold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 3,
    textAlign: "center",
  },
});
