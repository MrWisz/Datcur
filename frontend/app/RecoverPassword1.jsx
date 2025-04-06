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
import padlock from "../assets/images/padlock.png";
import CustomText from "../src/components/CustomText";
import Head from "../src/components/Head";
import Code from "../src/components/Code";

export default function RecoverPassword1() {
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View>
            <Head />
            <Image source={padlock} style={[styles.img, { marginTop: "40%" }]} />
            <Code />
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
  img: {
    width: 100,
    height: 100,
    marginBottom: "5%",
    alignSelf: "center",
  },
  text: {
    alignSelf: "flex-start",
    marginLeft: "15%",
    fontFamily: "Comic-Bold",
    fontSize: 16,
  },
});
