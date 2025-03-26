import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import user from "../assets/images/login.png";
import logo from "../assets/images/loguito1.png";
import CustomText from "../src/components/CustomText";
import Head from "../src/components/Head";
import { router } from "expo-router";
//import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useState } from "react";

export default function Login() {

  //const router = useRouter();

  const [formData, setFormData] = useState({
    user: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const onChange = (text, field) => {
    setFormData({ ...formData, [field]: text });

    // Elimina el error si el usuario empieza a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const initUser = async () => {
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

    // Simulación de inicio de sesión exitoso y redirección al Home
    console.log("Inicio correcto", formData);
    router.push("/Home");
  };

  return (
    <View style={styles.container}>
      <Head />
      <Image source={logo} style={[styles.img, { marginTop: "13%" }]} />
      <CustomText style={{ fontSize: 40 }}>Bienvenido</CustomText>
      <Image source={user} style={styles.img} />

      <View>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          onChangeText={(text) => onChange(text, "user")}
          value={formData.user}
        />
        {errors.user ? (
          <CustomText style={styles.errorText}>{errors.user}</CustomText>
        ) : null}
      </View>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={(text) => onChange(text, "password")}
          value={formData.password}
        />
        {errors.password ? (
          <CustomText style={styles.errorText}>{errors.password}</CustomText>
        ) : null}
      </View>

      <CustomText>¿Olvidaste tu contraseña?</CustomText>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => initUser()}>
          <CustomText style={[styles.buttonText, { fontSize: 15 }]}>
            Iniciar sesión
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <CustomText style={[styles.buttonText, { fontSize: 15 }]}>
            Cancelar
          </CustomText>
        </TouchableOpacity>
      </View>

      <CustomText style={{ fontSize: 18 }}>¿No tienes cuenta?</CustomText>
      <TouchableOpacity onPress={() => router.push("/Register")}>
        <CustomText style={[styles.buttonText, { fontSize: 20 }]}>
          ¡Regístrate!
        </CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 100,
    height: 100,
    marginBottom: "3%",
  },
  input: {
    height: 40,
    width: 220,
    borderRadius: 50,
    margin: 12,
    borderWidth: 2,
    marginBottom: 2,
    paddingLeft: "5%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: "Comic-Bold",
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
