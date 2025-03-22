import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from "react-native";
import logo from '../../assets/images/loguito1.png';
import CustomText from "../components/CustomText";
import { useNavigation } from "@react-navigation/native";
import { validateEmail, validateName, validatePhone } from "../utils/helpers";


export default function Register() {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValues());
    const [errorName, setErrorName] = useState("");
    const [errorLastName, setErrorLastName] = useState("");
    const [errorDirection, setErrorDirection] = useState("");
    const [errorPhone, setErrorPhone] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorConfirm, setErrorConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const doRegisterUser = async() => {
        if (!validateData()) {
            return;
        }

        setLoading(true)
        const result = await registerUser(formData.email, formData.password)
        if (!result.statusResponse) {
            setLoading(false)
            setErrorEmail(result.error)
            return
        }

    const validateData = () => {
      setErrorConfirm("");
      setErrorEmail("");
      setErrorPassword("");
      let isValid = true;

      if (!validateName(formData.name)) {
        setErrorName("Debes de ingresar solo texto");
        isValid = false;
      }

      if (!validateName(formData.lastName)) {
        setErrorLastName("Debes de ingresar solo texto");
        isValid = false;
      }
      
      if (!validatePhone(formData.phone)) {
        setErrorPhone("Ingresa solo numeros hasta 10 digitos");
        isValid = false;
      }

      if (!validateEmail(formData.email)) {
        setErrorEmail("Incluye una direccion que contenga @");
        isValid = false;
      }

      if (size(formData.password) < 6) {
        setErrorPassword(
          "Ingresar una contraseña de al menos seis carácteres."
        );
        isValid = false;
      }

      if (size(formData.confirm) < 6) {
        setErrorConfirm(
          "Ingresar una confirmación de contraseña de al menos seis carácteres."
        );
        isValid = false;
      }

      if (formData.password !== formData.confirm) {
        setErrorPassword("La contraseña y la confirmación no son iguales.");
        setErrorConfirm("La contraseña y la confirmación no son iguales.");
        isValid = false;
      }

      return isValid;
    };

  return (
    <View style={styles.container}>
      <Image source={logo} style={[styles.img, { marginTop: "5%" }]} />
      <CustomText style={[styles.buttonText, { fontSize: 30 }]}>
        Registro de usuario
      </CustomText>
      <TextInput
        style={styles.input}
        placeholder="Nombres"
        onChange={(e) => onChange(e, "name")}
        errorMessage={errorName}
        defaultValue={formData.name}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        onChange={(e) => onChange(e, "lastName")}
        errorMessage={errorLastName}
        defaultValue={formData.lastName}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Direccion"
        onChange={(e) => onChange(e, "direction")}
        //errorMessage={errorDireccion}
        //defaultValue={formData.direccion}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Telefono"
        onChange={(e) => onChange(e, "phone")}
        errorMessage={errorPhone}
        defaultValue={formData.phone}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        onChange={(e) => onChange(e, "email")}
        keyboardType="email-address"
        errorMessage={errorEmail}
        defaultValue={formData.email}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        onChange={(e) => onChange(e, "user")}
        keyboardType="email-address"
        //errorMessage={errorEmail}
        defaultValue={formData.user}
      ></TextInput>
      <Input
        containerStyle={styles.input}
        placeholder="Contraseña"
        password={true}
        secureTextEntry={!showPassword}
        onChange={(e) => onChange(e, "password")}
        errorMessage={errorPassword}
        defaultValue={formData.password}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        containerStyle={styles.input}
        placeholder="Confirmar contraseña"
        password={true}
        secureTextEntry={!showPassword}
        onChange={(e) => onChange(e, "confirm")}
        errorMessage={errorConfirm}
        defaultValue={formData.confirm}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <CustomText style={styles.buttonText}>Enviar</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.navigate("Login")}
        >
          <CustomText style={styles.buttonText}>Volver a inicio</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
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
    margin: 10,
    marginBottom: "0.5%",
    paddingLeft: "5%",
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
    backgroundColor: "#808088",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "ComicBold",
    textAlign: "center",
  },
});


