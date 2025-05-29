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
  Alert,
  Animated
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
import UserInfo from "../src/components/UserInfo";
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
  const [showFollowOptions, setShowFollowOptions] = useState(false);

  // NUEVO: control de tab
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' | 'followers' | 'following'
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const router = useRouter();
  const { userId: rawParamUserId } = useLocalSearchParams();
  let paramUserId = rawParamUserId;
  if (typeof paramUserId === "object" && paramUserId !== null) {
    paramUserId = paramUserId[0] || Object.values(paramUserId)[0];
  }

  useEffect(() => {
    (async () => {
      const myId = await AsyncStorage.getItem("userId");
      const accessToken = await AsyncStorage.getItem("accessToken");
      setToken(accessToken);

      const finalUserId = paramUserId || myId;
      setUserId(finalUserId || null);
      setIsOwnProfile(finalUserId === myId);
    })();
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

  // CONSULTA CORRECTA: revisar si YO (myId) soy seguidor de este perfil
  useEffect(() => {
    if (isOwnProfile) return;
    const checkIsFollowing = async () => {
      try {
        const myId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("accessToken");
        if (!myId || !token) return;
        const res = await fetch(`${API_URL}/users/${userId}/seguidores`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const seguidores = await res.json();
        setIsFollowing(seguidores.some(u => u._id === myId));
      } catch (e) {
        setIsFollowing(false);
      }
    };
    checkIsFollowing();
  }, [userId, isOwnProfile]);

  // Seguir usuario
  const handleFollow = async () => {
    try {
      const myId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("accessToken");
      if (!myId || !token) return;
      const res = await fetch(`${API_URL}/users/${userId}/seguir`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: myId }),
      });
      if (res.ok) setIsFollowing(true);
    } catch (e) { }
  };

  // Dejar de seguir usuario
  const handleUnfollow = async () => {
    try {
      const myId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("accessToken");
      if (!myId || !token) return;
      const res = await fetch(`${API_URL}/users/${userId}/dejar-de-seguir`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: myId }),
      });
      if (res.ok) setIsFollowing(false);
      setShowFollowOptions(false);
    } catch (e) { }
  };

  const confirmUnfollow = () => {
    Alert.alert(
      "Dejar de seguir",
      "¿Estás seguro que deseas dejar de seguir a este usuario?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, dejar de seguir", style: "destructive", onPress: handleUnfollow }
      ]
    );
  };

  // Obtener posts
  const { posts, getNextPosts, loading, refreshPosts } = useGetPostsByUser(userId, token);

  // Local para edición/eliminación
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    setPostList(posts);
  }, [posts]);

  // Actualizar post editado
  const handlePostUpdated = (postId, newDesc) => {
    setPostList((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, descripcion: newDesc } : p))
    );
  };

  // Eliminar post de la lista
  const handlePostDeleted = (postId) => {
    setPostList((prev) => prev.filter((p) => p._id !== postId));
  };

  // Tabs handler
  const handleTabChange = async (tab) => {
    setActiveTab(tab);

    if (tab === "followers") {
      setLoadingFollowers(true);
      try {
        const res = await fetch(`${API_URL}/users/${userId}/seguidores`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setFollowers(data);
      } catch {
        setFollowers([]);
      }
      setLoadingFollowers(false);
    } else if (tab === "following") {
      setLoadingFollowing(true);
      try {
        const res = await fetch(`${API_URL}/users/${userId}/seguidos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setFollowing(data);
      } catch {
        setFollowing([]);
      }
      setLoadingFollowing(false);
    }
  };

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

  const renderFollowers = () => {
    if (loadingFollowers) return <ActivityIndicator style={{ marginVertical: 40 }} />;
    if (followers.length === 0)
      return <CustomText style={{ textAlign: "center", marginVertical: 32, color: "#aaa" }}>Sin seguidores.</CustomText>;
    return (
      <FlatList
        data={followers}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <UserInfo
            avatar={item.foto_perfil || "https://picsum.photos/seed/default/200"}
            username={item.username || item.nombre}
            fullName={item.nombre}
            userId={item._id}
            onPressProfile={() => router.push(`/Profile?userId=${item._id}`)}
          />

        )}
      />
    );
  };

  const renderFollowing = () => {
    if (loadingFollowing) return <ActivityIndicator style={{ marginVertical: 40 }} />;
    if (following.length === 0)
      return <CustomText style={{ textAlign: "center", marginVertical: 32, color: "#aaa" }}>Sin seguidos.</CustomText>;
    return (
      <FlatList
        data={following}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <UserInfo
            avatar={item.foto_perfil || "https://picsum.photos/seed/default/200"}
            username={item.username || item.nombre}
            fullName={item.nombre}
            userId={item._id}
            onPressProfile={() => router.push(`/Profile?userId=${item._id}`)}
          />

        )}
      />
    );
  };

  // Loader y vacío bien definidos para posts
  const renderListEmptyComponent = () =>
    loading ? (
      <ActivityIndicator size="large" style={{ marginTop: 50 }} />
    ) : (
      <CustomText style={{ textAlign: "center", marginVertical: 36, color: "#aaa" }}>
        Sin posts.
      </CustomText>
    );

  const renderFooter = () =>
    loading && postList.length > 0 ? (
      <ActivityIndicator style={{ marginVertical: 20 }} />
    ) : null;

  // MAIN RENDER
  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        {userId && token ? (
          <>
            <View style={styles.rectangle}>
              <Header />
              <Image
                source={profileUrl ? { uri: profileUrl } : user}
                style={[styles.img, { marginTop: "5%" }]}
                resizeMode="cover"
              />
              <CustomText style={styles.title}>{nombre}</CustomText>

              {!isOwnProfile && (
                <View style={{ alignItems: "center", width: "100%" }}>
                  {!isFollowing ? (
                    <TouchableOpacity onPress={handleFollow} style={styles.followButton}>
                      <CustomText style={styles.followText}>Seguir</CustomText>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ position: "relative" }}>
                      <TouchableOpacity
                        onPress={() => setShowFollowOptions(v => !v)}
                        style={styles.followButton}
                      >
                        <CustomText style={styles.followText}>Siguiendo ▼</CustomText>
                      </TouchableOpacity>
                      {showFollowOptions && (
                        <View
                          style={{
                            position: "absolute",
                            top: 42,
                            right: 0,
                            left: 0,
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            padding: 10,
                            elevation: 6,
                            zIndex: 10,
                            alignItems: "center"
                          }}
                        >
                          <TouchableOpacity
                            onPress={confirmUnfollow}
                            style={{
                              paddingVertical: 8,
                              paddingHorizontal: 18,
                              borderRadius: 8,
                              backgroundColor: "#eee",
                            }}
                          >
                            <Text style={{ color: "#d00" }}>Dejar de seguir</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setShowFollowOptions(false)}
                            style={{
                              marginTop: 8,
                              paddingVertical: 8,
                              paddingHorizontal: 18,
                              borderRadius: 8,
                              backgroundColor: "#fff",
                              borderWidth: 1,
                              borderColor: "#ccc",
                            }}
                          >
                            <Text>Cancelar</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}

              {/* ----- TABS ActionsFollower ------ */}
              <View style={styles.actionsWrapper}>
                <ActionsFollower activeTab={activeTab} onTabChange={handleTabChange} />
              </View>

              <CustomText style={styles.subtitle}>
                {gustos.length > 0
                  ? `Me gusta: ${gustos.join(", ")}`
                  : "¡Aún no ha configurado sus gustos!"}
              </CustomText>
            </View>

            {activeTab === "posts" && (
              <FlatList
                data={postList}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <Post
                    post={item}
                    isOwnProfile={isOwnProfile}
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                  />
                )}
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
            )}

            {activeTab === "followers" && renderFollowers()}

            {activeTab === "following" && renderFollowing()}
          </>
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
    height: 400,
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
