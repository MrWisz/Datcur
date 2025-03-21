import { StyleSheet, Text, View, Image, TextInput, Button } from "react-native";
import user from '../../assets/images/login.png'
import logo from '../../assets/images/loguito1.png';
import CustomText from "../components/CustomText";

export default function Login() {
  return (
    <View style={styles.container}>
      <Image source={logo} style={{ width: 100, height: 100 }} />
      <CustomText style={{ fontSize: 30 }}>Bienvenido</CustomText>
      <Image
        source={user}
        style={{ with: 300, height: 100, resizeMode: "contain" }}
      ></Image>
      <Button>Iniciar sesion</Button>
      <Button>Cancelar</Button>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    fontSize: 100,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  font: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  text: {
    fontSize: 24,
    fontFamily: "ComicNeue-Regular",
  },
});


