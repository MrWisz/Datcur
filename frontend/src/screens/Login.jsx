import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity } from "react-native";
import user from '../../assets/images/login.png'
import logo from '../../assets/images/loguito1.png';
import CustomText from "../components/CustomText";
import Head from '../components/Head';

export default function Login() {
  return (
    <View style={styles.container}>
      <Head />
      <Image
        source={logo}
        style={{ width: 100, height: 100, marginBottom: "15", marginTop:"5%" }}
      />
      <CustomText style={{ fontSize: 40 }}>Bienvenido</CustomText>
      <Image
        source={user}
        style={{ with: 300, height: 100, resizeMode: "contain" }}
      ></Image>
      <TextInput style={styles.input} placeholder="Usuario" />
      <TextInput style={styles.input} placeholder="Contraseña" />
      <CustomText>¿Olvidaste tu contraseña?</CustomText>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <CustomText style={{ fontSize: 15 }}>Iniciar sesion</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <CustomText style={{ fontSize: 16 }}>Cancelar</CustomText>
        </TouchableOpacity>
      </View>
      <CustomText>¿No tienes cuenta?</CustomText>
      <CustomText>¡Registrate!</CustomText>
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
  /*font: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 20,
    marginTop: 20,
  }*/
  input: {
    height: 40,
    width: 220,
    borderRadius: 50,
    margin: 12,
    borderWidth: 2,
    marginBottom: 2,
  },
  text: {
    //fontFamily: "Comic",
    fontSize: 40,
    fontWeight: "bold",
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
    fontWeight: "bold",
    textAlign: "center",
  },
});


