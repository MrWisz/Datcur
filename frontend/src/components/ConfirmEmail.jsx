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
import CustomText from "./CustomText";
import { useState } from "react";
import { Input, Icon } from "react-native-elements";
import { router } from "expo-router";

export default function ConfirmEmail() {

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!email.trim()) {
      setError("El correo es obligatorio.");
      return;
    }

    console.log("Código enviado a:", email);
    router.push("/RecoverPassword1");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View>
            <CustomText
              style={[styles.buttonText, { fontSize: 25, marginBottom: "10%" }]}
            >
              Recuperar contraseña
            </CustomText>

            <View style={styles.inputContainer}>
              <CustomText>
                Introduce tu dirección de correo electrónico
              </CustomText>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {error ? (
                <CustomText style={{ color: "red", marginTop: 4 }}>
                  {error}
                </CustomText>
              ) : null}
              <CustomText>Enviaremos un código de verificación</CustomText>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <CustomText style={styles.buttonText}>Enviar Codigo</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => router.push("/Login")}
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
    alignItems:"center",
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
    margin: "5%",
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
    //textAlign: "center",
  },
});
