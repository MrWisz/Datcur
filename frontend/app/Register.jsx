import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,} from "react-native";
import logo from "../assets/images/loguito1.png";
import CustomText from "../src/components/CustomText";
import { validateEmail, validateName, validatePhone, validateUser, validatePassword} from "../src/utils/helpers";
import { useState } from "react";
import { Input, Icon } from "react-native-elements";
import { router } from "expo-router";
import Head from "../src/components/Head";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';



// Función para valores iniciales del formulario
const defaultFormValues = () => ({
  name: "",
  lastName: "",
  direction: "",
  phone: "",
  email: "",
  user: "",
  password: "",
  confirm: "",
});

export default function Register() {
  const API_URL = Constants.expoConfig.extra.API_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValues());
  const [errors, setErrors] = useState({});
  //const [loading, setLoading] = useState(false);


  const onChange = (text, field) => {
    setFormData({ ...formData, [field]: text });
    validateField(field, text);
  };

  const validateField = (field, value) => {
    let errorMsg = "";
    switch (field) {
      case "name":
        if (!validateName(value)) errorMsg = "Ingresa solo letras";
        break;
      case "lastName":
        if (!validateName(value)) errorMsg = "Ingresa solo letras";
        break;
      case "phone":
        if (!validatePhone(value))
          errorMsg = "Ingresa solo numeros hasta 11 digitos";
        break;
      case "email":
        if (!validateEmail(value))
          errorMsg = "Ingresa una direccion valida con @";
        break;
      case "user":
        if (!validateUser(value)) errorMsg = "No dejar espacios en blanco";
        break;
      case "password":
        if (!validatePassword(value))
          errorMsg =
            "Debe contener minimo 8 caracteres, letras, numeros y caracter especial";
        break;
      case "confirm":
        if (value !== formData.password)
          errorMsg = "Las contraseñas no coinciden";
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMsg,
    }));
  };

  const doRegisterUser = async () => {
  const emptyFields = Object.keys(formData).filter(
    (key) => formData[key].trim() === ""
  );

  if (emptyFields.length > 0) {
    const newErrors = {};
    emptyFields.forEach((field) => {
      newErrors[field] = "Este campo es obligatorio.";
    });
    setErrors(newErrors);
    return;
  }

  let hasErrors = false;
  Object.keys(formData).forEach((field) => {
    validateField(field, formData[field]);
    if (errors[field]) {
      hasErrors = true;
    }
  });

  if (hasErrors) return;

  try {
    // 1. Registrar usuario
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.user,
        nombre: `${formData.name} ${formData.lastName}`,
        email: formData.email,
        telefono: formData.phone,
        direccion: {
          calle: formData.direction,
          ciudad: "Ciudad",
          pais: "País",
        },
        gustos: [],
        foto_perfil: "",
        password: formData.password,
        fecha_registro: new Date().toISOString(),
      }),
    });

    const userData = await response.json();

    if (!response.ok) {
      alert("Error al registrar usuario: " + userData.message);
      return;
    }

    // 2. Login automático
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.user,
        password: formData.password,
      }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      alert("Registro exitoso, pero error al iniciar sesión.");
      return;
    }

    // 3. Guardar en almacenamiento local
  const payload = jwtDecode(loginData.access_token);
  await AsyncStorage.setItem("accessToken", loginData.access_token);
  await AsyncStorage.setItem("userId", payload.sub);

    // 4. Mostrar toast y redirigir
    Toast.show({
      type: "customToast",
      text1: "¡Registro exitoso!",
      text2: "Sesión iniciada correctamente.",
      visibilityTime: 3000,
    });

    setTimeout(() => router.push("/UserConfiguration"), 3000);
  } catch (error) {
    console.error("❌ Error en registro/login:", error);
    alert("Error al conectar con el servidor.");
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
            <Head />
            <Image source={logo} style={[styles.img, { marginTop: "25%" }]} />
            <CustomText style={[styles.buttonText, { fontSize: 30 }]}>
              Registro de usuario
            </CustomText>

            {[
              { field: "name", placeholder: "Nombres" },
              { field: "lastName", placeholder: "Apellidos" },
              { field: "direction", placeholder: "Dirección" },
              {
                field: "phone",
                placeholder: "Teléfono",
                keyboardType: "phone-pad",
              },
              {
                field: "email",
                placeholder: "Correo",
                keyboardType: "email-address",
              },
              { field: "user", placeholder: "Usuario" },
            ].map(({ field, placeholder, keyboardType }) => (
              <View key={field}>
                <TextInput
                  style={[styles.input, { fontFamily: "Comic-Bold" }]}
                  placeholder={placeholder}
                  onChangeText={(text) => onChange(text, field)}
                  value={formData[field]}
                  keyboardType={keyboardType || "default"}
                />
                {errors[field] ? (
                  <CustomText style={styles.errorText}>
                    {errors[field]}
                  </CustomText>
                ) : null}
              </View>
            ))}

            {[
              { field: "password", placeholder: "Contraseña" },
              { field: "confirm", placeholder: "Confirmar contraseña" },
            ].map(({ field, placeholder }) => (
              <View key={field}>
                <Input
                  containerStyle={styles.input}
                  inputStyle={{ fontFamily: "Comic-Bold" }}
                  placeholder={placeholder}
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => onChange(text, field)}
                  value={formData[field]}
                  rightIcon={
                    <Icon
                      type="material-community"
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                {errors[field] ? (
                  <CustomText style={styles.errorText}>
                    {errors[field]}
                  </CustomText>
                ) : null}
              </View>
            ))}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => doRegisterUser()}
              >
                <CustomText style={styles.buttonText}>Enviar</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => router.push("/Login")}
              >
                <CustomText style={styles.buttonText}>
                  Volver a inicio
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
  img: {
    width: 100,
    height: 100,
    marginBottom: "3%",
  },
  input: {
    backgroundColor: "rgba(91, 212, 255, 0.25)",
    height: 40,
    width: 280,
    borderRadius: 50,
    margin: 5,
    paddingLeft: "5%",
    fontFamily: "Comic-Bold",
    fontSize: 18,
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
    marginBottom: 5,
  },
});