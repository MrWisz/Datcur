import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import CustomText from "../src/components/CustomText";
import Header from "../src/components/Header";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

export default function ChangeInPersonal() {
  const [formData, setFormData] = useState({
    username: "",
    calle: "",
    ciudad: "",
    pais: "",
    phone: "",
    email: "",
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const userId = await AsyncStorage.getItem("userId");
        if (!token || !userId) return;

        const response = await fetch(`${API_URL}/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar la información");
        }

        const user = await response.json();

        setFormData({
          username: user.username || "",
          calle: user.direccion?.calle || "",
          ciudad: user.direccion?.ciudad || "",
          pais: user.direccion?.pais || "",
          phone: user.telefono || "",
          email: user.email || "",
        });
      } catch (error) {
        console.error("Error cargando datos de usuario:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se pudo cargar la información del usuario",
        });
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (text, field) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!token || !userId) {
        Toast.show({
          type: "error",
          text1: "Sesión no válida",
        });
        return;
      }

      // Validación básica: no dejar campos vacíos
      if (!formData.username.trim() || !formData.calle.trim() || !formData.ciudad.trim() || !formData.pais.trim()) {
        Toast.show({
          type: "error",
          text1: "Completa todos los campos requeridos",
        });
        return;
      }

      const updateBody = {
        username: formData.username,
        direccion: {
          calle: formData.calle,
          ciudad: formData.ciudad,
          pais: formData.pais,
        },
        telefono: formData.phone,
        email: formData.email,
      };

      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error backend:", errorText);
        throw new Error("Error al guardar la información");
      }

      Toast.show({
        type: "customToast",
        text1: "Éxito",
        text2: "Información modificada con éxito",
        visibilityTime: 3000,
        position: "center",
      });

      setTimeout(() => {
        router.push("/Home");
      }, 3000);
    } catch (error) {
      console.error("Error guardando información:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo modificar la información",
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
          <View style={styles.inner}>
            <Header />
            <CustomText style={[styles.buttonText, styles.title]}>
              Modificar información personal
            </CustomText>

            {[
              { key: "username", label: "Usuario", keyboardType: "default" },
              { key: "calle", label: "Calle", keyboardType: "default" },
              { key: "ciudad", label: "Ciudad", keyboardType: "default" },
              { key: "pais", label: "País", keyboardType: "default" },
              { key: "phone", label: "Teléfono", keyboardType: "phone-pad" },
              { key: "email", label: "Correo", keyboardType: "email-address" },
            ].map(({ key, label, keyboardType }) => (
              <View key={key}>
                <CustomText style={styles.label}>{label}</CustomText>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={formData[key]}
                    onChangeText={(text) => handleChange(text, key)}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
            ))}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <CustomText style={styles.buttonText}>
                  Guardar cambios
                </CustomText>
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
  inner: {
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: "8%",
    marginTop: "8%",
  },
  label: {
    fontSize: 16,
    marginLeft: "5%",
    fontFamily: "Comic-Bold",
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "rgba(91, 212, 255, 0.25)",
    height: 50,
    width: 280,
    borderRadius: 50,
    margin: "3%",
    paddingLeft: "5%",
    paddingRight: 35,
    marginBottom: "5%",
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
    width: 130,
    height: 40,
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
});
