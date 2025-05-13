import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  BackHandler,
  Platform,
} from "react-native";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import Post from "../src/components/Post";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const API_URL = Constants.expoConfig.extra.API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("❌ La respuesta de /posts no es un array:", data);
          return;
        }

        const enrichedPosts = data.map((p) => ({
          ...p,
          usuario_id: p.usuario_id.nombre || p.usuario_id.username || "Usuario",
          userAvatar: p.usuario_id.foto_perfil || undefined,
          image: p.fotos?.[0] || undefined,
          description: p.descripcion,
          date: new Date(p.fecha_creacion).toLocaleDateString("es-MX"),
        }));

        setPosts(enrichedPosts);
      } catch (err) {
        console.error("Error al cargar publicaciones:", err);
      }
    };

    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (Platform.OS === "android") {
          BackHandler.exitApp();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 60 }}>
          {posts.map((item, i) => (
            <Post key={i} post={item} />
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
    backgroundColor: '#eee',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
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

export default Home;
