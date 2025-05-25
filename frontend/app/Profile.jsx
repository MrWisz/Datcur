import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import user from "../assets/images/usuario.png";
import CustomText from "../src/components/CustomText";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import Post from "../src/components/Post";
import ActionsFollower from "../src/components/ActionsFollower";

const Profile = () => {
  const [profileUrl, setProfileUrl] = useState(null);
  const [nombre, setNombre] = useState("Nombre de Usuario");
  const [gustos, setGustos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  const router = useRouter();
  const { userId: paramUserId } = useLocalSearchParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const myId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;

      const finalUserId = paramUserId || myId;
      setUserId(finalUserId);
      setIsOwnProfile(finalUserId === myId);

      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`${API_URL}/users/${finalUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/posts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userData = await userRes.json();
        setProfileUrl(userData.foto_perfil || null);
        setNombre(userData.nombre || "Usuario");
        setGustos(userData.gustos || []);

        const postsData = await postsRes.json();

        const userPosts = postsData
          .filter((p) => p.usuario_id?._id?.toString() === finalUserId)
          .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
          .map((p) => ({
            ...p,
            userAvatar: p.usuario_id.foto_perfil || undefined,
            authorName: p.usuario_id.nombre || p.usuario_id.username || "Usuario",
            image: Array.isArray(p.fotos) ? p.fotos[0] : undefined,
            description: p.descripcion,
            date: new Date(p.fecha_creacion).toLocaleDateString("es-MX"),
            likes: p.likes?.length || 0,
            liked: p.likes?.some((id) => id === myId),
            favorito: p.favoritos?.some((id) => id === myId),
          }));

        setPosts(userPosts);
      } catch (err) {
        console.error("Error cargando perfil o publicaciones:", err);
      }
    };

    fetchUserData();
  }, [paramUserId]);

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

            {!isOwnProfile && (
              <>
                <TouchableOpacity onPress={toggleFollow} style={styles.followButton}>
                  <CustomText style={styles.followText}>
                    {isFollowing ? "Siguiendo ▼" : "Seguir"}
                  </CustomText>
                </TouchableOpacity>

                <View style={styles.actionsWrapper}>
                  <ActionsFollower />
                </View>
              </>
            )}

            <CustomText style={styles.subtitle}>
              {gustos.length > 0
                ? `Me gusta: ${gustos.join(", ")}`
                : "¡Aún no ha configurado sus gustos!"}
            </CustomText>
          </View>

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
  contentArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
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
  actionsWrapper: {
    marginTop: 12,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  followButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FFC000",
    borderRadius: 10,
    alignItems: "center",
  },
  followText: {
    fontSize: 16,
    fontFamily: "Comic-Bold",
    textAlign: "center",
  },
});

export default Profile;
