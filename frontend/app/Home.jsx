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
  },
  contentArea: {
    flex: 1,
    paddingTop: 6,
  },
  scrollView: {
    flex: 1,
  },
});

export default Home;
