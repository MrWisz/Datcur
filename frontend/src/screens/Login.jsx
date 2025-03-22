import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity } from "react-native";
import user from '../../assets/images/login.png'
import logo from '../../assets/images/loguito1.png';
import CustomText from "../components/CustomText";
import Head from '../components/Head';
import { useNavigation } from "@react-navigation/native";

export default function Login() {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Head />
      <Image source={logo} style={[styles.img, { marginTop: "13%" }]} />
      <CustomText style={{ fontSize: 40 }}>Bienvenido</CustomText>
      <Image source={user} style={styles.img}></Image>
      <TextInput style={styles.input} placeholder="Usuario" />
      <TextInput style={styles.input} placeholder="Contraseña" />
      <CustomText>¿Olvidaste tu contraseña?</CustomText>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <CustomText style={[styles.buttonText, { fontSize: 15 }]}>
            Iniciar sesion
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
        >
          <CustomText style={[styles.buttonText, { fontSize: 15 }]}>
            Cancelar
          </CustomText>
        </TouchableOpacity>
      </View>
      <CustomText style={{ fontSize: 18 }}>¿No tienes cuenta?</CustomText>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <CustomText style={{ fontSize: 20, fontFamily: "ComicBold" }}>
          ¡Registrate!
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
  },
  text: {
    fontSize: 40,
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
    fontFamily: "ComicBold",
    textAlign: "center",
  },
});


