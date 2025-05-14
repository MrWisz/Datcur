import React, { useState } from "react";
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../src/components/Header";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export default function ChangeInPersonal() {
  const [formData, setFormData] = useState({
    direction: "Calle 123",
    phone: "123456789",
    email: "usuario@email.com",
  });

  const handleChange = (text, field) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleSubmit = () => {
    console.log("Datos finales:", formData);
    // espacio para enviar los datos a la base de datos
    
    //mensaje confirmacion
    Toast.show({
                type: "customToast",
                text1: "Exito",
                text2: "Información modificada con éxito",
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
          <View style={styles.inner}>
            <Header />
            <CustomText style={[styles.buttonText, styles.title]}>
              Modificar información personal
            </CustomText>

            {["direction", "phone", "email"].map((field) => {
              const placeholders = {
                direction: "Dirección",
                phone: "Teléfono",
                email: "Correo",
              };
              const keyboardTypes = {
                phone: "phone-pad",
                email: "email-address",
              };

              return (
                <View key={field}>
                  <CustomText style={styles.label}>
                    {placeholders[field]}
                  </CustomText>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData[field]}
                      onChangeText={(text) => handleChange(text, field)}
                      editable={true}
                      keyboardType={keyboardTypes[field] || "default"}
                    />
                  </View>
                </View>
              );
            })}

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
  title:{
    fontSize: 30, 
    marginBottom: "8%", 
    marginTop:"8%",
  },
  img: {
    width: 100,
    height: 100,
    marginBottom: "3%",
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
  },
});
