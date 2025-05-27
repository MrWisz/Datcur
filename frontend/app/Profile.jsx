import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
} from "react-native";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import user from "../assets/images/usuario.png";
import CustomText from "../src/components/CustomText";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Post from "../src/components/Post";
import ActionsFollower from "../src/components/ActionsFollower";
import { useGetPostsByUser } from "../app/pagination/useGetPostsByUser";

const API_URL =
  Constants.expoConfig?.extra?.API_URL ||
  Constants.manifest?.extra?.API_URL ||
  "";

const Profile = () => {
  const [profileUrl, setProfileUrl] = useState(null);
  const [nombre, setNombre] = useState("Nombre de Usuario");
  const [gustos, setGustos] = useState([]);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const router = useRouter();
  const { userId: rawParamUserId } = useLocalSearchParams();
  let paramUserId = rawParamUserId;
  if (typeof paramUserId === "object" && paramUserId !== null) {
    paramUserId = paramUserId[0] || Object.values(paramUserId)[0];
  }

  // Cargar token y userId
  useEffect(() => {
    (async () => {
      const myId = await AsyncStorage.getItem("userId");
      const accessToken = await AsyncStorage.getItem("accessToken");
      setToken(accessToken);

      const finalUserId = paramUserId || myId;
      setUserId(finalUserId || null);
      setIsOwnProfile(finalUserId === myId);
    })();
    // Cada vez que cambie el paramUserId, resetea
  }, [paramUserId]);

  // Fetch info usuario
  useEffect(() => {
    if (!userId || !token) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await res.json();
        setProfileUrl(userData.foto_perfil || null);
        setNombre(userData.nombre || "Usuario");
        setGustos(userData.gustos || []);
      } catch (e) {
        console.error("Error cargando usuario:", e);
      }
    })();
  }, [userId, token]);


  const { posts, getNextPosts, loading, refreshPosts } = useGetPostsByUser(userId, token);




  const toggleFollow = () => setIsFollowing((prev) => !prev);


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

  // Loader y vacío bien definidos: 
  // Si está cargando y aún no hay posts, muestra loader. 
  // Si no está cargando y no hay posts, muestra “Sin posts.”
  const renderListEmptyComponent = () =>
    loading ? (
      <ActivityIndicator size="large" style={{ marginTop: 50 }} />
    ) : (
      <CustomText style={{ textAlign: "center", marginVertical: 36, color: "#aaa" }}>
        Sin posts.
      </CustomText>
    );


  const renderFooter = () =>
    loading && posts.length > 0 ? (
      <ActivityIndicator style={{ marginVertical: 20 }} />
    ) : null;

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        {userId && token ? (
          <FlatList
            key={userId}
            ListHeaderComponent={
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
            }
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              console.log("RENDER ITEM:", item);
              return <Post post={item} />;
            }}
            onEndReached={() => {
              if (!loading) getNextPosts();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refreshPosts} />
            }
            contentContainerStyle={{ paddingBottom: 60 }}
            ListEmptyComponent={renderListEmptyComponent}
          />
        ) : (
          <ActivityIndicator size="large" style={{ flex: 1, marginTop: 60 }} />
        )}
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
