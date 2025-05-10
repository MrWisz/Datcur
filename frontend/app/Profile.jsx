import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  BackHandler,
} from "react-native";
import { useFonts } from "expo-font";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import user from "../assets/images/usuario.png";
import CustomText from "../src/components/CustomText";
import Icon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";


const Profile = () => {
    const genericImage = require("../assets/images/imagePost.png");
    const [profileUrl, setProfileUrl] = useState(null);
    const [nombre, setNombre] = useState("Nombre de Usuario");
    const [gustos, setGustos] = useState([]);
    const API_URL = Constants.expoConfig.extra.API_URL;

    useEffect(() => {
  const fetchUserProfile = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await fetch(`${API_URL}/users/${userId}`);
      const data = await res.json();
      setProfileUrl(data.foto_perfil || null);
      setNombre(data.nombre || "Usuario");
      setGustos(data.gustos || []);
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
  };

  fetchUserProfile();
}, []);


    const renderPost = (key) => (
        <View key={key} style={styles.postCard}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Icon name="user" size={18} color="#777" />
            </View>
            <View style={styles.username} />
          </View>
    
          {/* Post Content */}
          <View style={styles.postContent}>
            <View style={styles.textLine} />
            <View style={styles.textLine} />
          </View>
    
          {/* Post Image */}
          <View style={styles.imageContainer}>
            <Image style={styles.postImage} source={genericImage} />
          </View>
    
          <View style={styles.divider} />
    
          {/* Interaction Buttons */}
          <View style={styles.interactions}>
            <Icon name="heart" size={20} color="#f44336" />
            <Icon name="message-circle" size={20} color="#333" />
            <Icon name="star" size={20} color="#FFC107" />
          </View>
        </View>
      );

    const router = useRouter();

    useEffect(() => {
      const backAction = () => {
        router.replace('/Home'); // redirige y limpia el historial
        return true; 
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.rectangle}>
            <Header />
            <Image
              source={profileUrl ? { uri: profileUrl } : user}
              style={[styles.img, { marginTop: "5%" }]}
              resizeMode="cover"
            />
           <CustomText style={styles.title}>{nombre}</CustomText>
            <CustomText style={styles.subtitle}>
              {gustos.length > 0 ? `Me gusta: ${gustos.join(", ")}` : "¡Aún no has configurado tus gustos!"}
            </CustomText>
            {renderPost(1)}
            {renderPost(2)}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rectangle: {
    backgroundColor: "rgba(255, 192, 0, 0.2)",
    width: "100%",
    height: "25%",
  },
  img: {
    width: 100,
    height: 100,
    //marginBottom: "3%",
    alignSelf: "center",
  },
  title: {
    fontFamily: "Comic-Bold",
    fontSize: 35,
    //fontWeight: "bold",
    textAlign: "center",
    //marginVertical: 10,
  },
  subtitle: {
    fontFamily: "ComicNeue",
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 28,
  },
  contentArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow:1,
  },
  postCard: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#e5e5e5", // gray-200
    borderRadius: 8,
    padding: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: "#d1d1d1", // gray-300
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#a0a0a0", // gray-400
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    marginLeft: 8,
    width: 96,
    height: 16,
    backgroundColor: "#000",
    borderRadius: 4,
  },
  postContent: {
    marginBottom: 12,
    gap: 8,
  },
  textLine: {
    width: "100%",
    height: 16,
    backgroundColor: "#000",
    borderRadius: 4,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: "#a0a0a0", // gray-400
    borderRadius: 4,
    marginBottom: 12,
    padding: 16,
    alignItems: "center",
    overflow: "hidden",
  },
  postImage: {
    height: 100,
    position: "relative",
  },
  divider: {
    height: 1,
    backgroundColor: "#a0a0a0", // gray-400
    marginBottom: 12,
  },
  interactions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});

export default Profile;
