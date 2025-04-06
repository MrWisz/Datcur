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

export default function Code() {

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
              <CustomText>Introduce el código recibido</CustomText>
              <TextInput style={styles.input} />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/RecoverPassword2")}
              >
                <CustomText style={styles.buttonText}>Aceptar</CustomText>
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
    alignItems: "center",
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
    height: 80,
    width: 200,
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
