import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,} from "react-native";
import logo from "../assets/images/loguito1.png";
import CustomText from "../src/components/CustomText";
//import { useNavigation } from "@react-navigation/native";
import { validateEmail, validateName, validatePhone, validateUser, validatePassword} from "../src/utils/helpers";
import { useState } from "react";
import { Input, Icon } from "react-native-elements";
import { router } from "expo-router";

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
        if (!validateUser(value)) errorMsg = "Ingresa al menos un numero";
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
    // Verificamos si hay campos vacíos
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

    // Validamos cada campo nuevamente antes de registrar
    let hasErrors = false;
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
      if (errors[field]) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      return;
    }

    // Simulación de registro exitoso y redirección al Login
    console.log("Usuario registrado:", formData);
    router.push("/Home");
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.inner}>
            <Image source={logo} style={[styles.img, { marginTop: "5%" }]} />
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
                  style={styles.input}
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

            {["password", "confirm"].map((field) => (
              <Input
                key={field}
                containerStyle={styles.input}
                placeholder={
                  field === "password" ? "Contraseña" : "Confirmar contraseña"
                }
                secureTextEntry={!showPassword}
                onChangeText={(text) => onChange(text, field)}
                value={formData[field]}
                errorMessage={errors[field]}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
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
    fontFamily: "ComicBold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
  },
});
