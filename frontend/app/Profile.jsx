import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  BackHandler,
} from "react-native";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import user from "../assets/images/usuario.png";
import CustomText from "../src/components/CustomText";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Post from "../src/components/Post";

const Profile = () => {
  const [profileUrl, setProfileUrl] = useState(null);
  const [nombre, setNombre] = useState("Nombre de Usuario");
  const [gustos, setGustos] = useState([]);
  const [posts, setPosts] = useState([]);
  const API_URL = Constants.expoConfig.extra.API_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
  const userId = await AsyncStorage.getItem("userId");
  const token = await AsyncStorage.getItem("accessToken");
  if (!userId || !token) return;

  try {
    const [userRes, postsRes] = await Promise.all([
      fetch(`${API_URL}/users/${userId}`),
      fetch(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    const userData = await userRes.json();
    setProfileUrl(userData.foto_perfil || null);
    setNombre(userData.nombre || "Usuario");
    setGustos(userData.gustos || []);

    const postsData = await postsRes.json();

    if (!Array.isArray(postsData)) {
      console.error("❌ La respuesta de /posts no es un array:", postsData);
      return;
    }

    const userPosts = postsData
      .filter((p) => p.usuario_id._id === userId)
      .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
      .map((p) => ({
        ...p,
        usuario_id: p.usuario_id.nombre || p.usuario_id.username || "Usuario",
        userAvatar: userData.foto_perfil || undefined,
        image: p.fotos?.[0] || undefined,
        description: p.descripcion,
        date: new Date(p.fecha_creacion).toLocaleDateString("es-MX"),
      }));

    setPosts(userPosts);
  } catch (err) {
    console.error("Error cargando perfil o publicaciones:", err);
  }
};


    fetchUserData();
  }, []);

  useEffect(() => {
    const backAction = () => {
      router.replace("/Home");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 60 }}>
          <View style={styles.rectangle}>
            <Header />
            <Image
              source={profileUrl ? { uri: profileUrl } : user}
              style={[styles.img, { marginTop: "5%" }]}
              resizeMode="cover"
            />
            <CustomText style={styles.title}>{nombre}</CustomText>
            <CustomText style={styles.subtitle}>
              {gustos.length > 0
                ? `Me gusta: ${gustos.join(", ")}`
                : "¡Aún no has configurado tus gustos!"}
            </CustomText>
          </View>

          {/* Renderiza publicaciones del usuario */}
          {posts.map((p, i) => (
            <Post key={i} post={p} />
          ))}
        </ScrollView>
      </View>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer:{
    padding: 16,
    paddingTop: 0
  },
  rectangle: {
  backgroundColor: "rgba(255, 192, 0, 0.2)",
  width: "100%",
  paddingBottom: 20,
  paddingTop: 10,
  alignItems: "center",
},
  img: {
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 50,
  },
  title: {
    fontFamily: "Comic-Bold",
    fontSize: 35,
    textAlign: "center",
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
    flexGrow: 1,
  },
});

export default Profile;
