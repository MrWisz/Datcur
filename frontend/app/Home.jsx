import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  BackHandler,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import Post from "../src/components/Post";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useGetPosts } from "../app/pagination/useGetPosts";

const API_URL =
  Constants.expoConfig?.extra?.API_URL ||
  Constants.manifest?.extra?.API_URL ||
  "";

const Home = () => {
  const [token, setToken] = useState(null);
  const [seguidoIds, setSeguidoIds] = useState([]);
  const [userId, setUserId] = useState(null);

  // Solo carga ids de seguidos una vez
  const loadTokenAndSeguidos = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("accessToken");
      const storedUserId = await AsyncStorage.getItem("userId");
      setToken(storedToken);
      setUserId(storedUserId);
      if (storedToken && storedUserId) {
        const res = await fetch(`${API_URL}/users/${storedUserId}/seguidos`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        const seguidos = await res.json();
        setSeguidoIds(seguidos.map((u) => u._id));
      }
    } catch (e) {
      setSeguidoIds([]);
    }
  };

  useEffect(() => {
    loadTokenAndSeguidos();
  }, []);

  // <<--- SOLO USA EL HOOK AQUÍ Y LISTO --->
  const { posts, getNextPosts, loading, refreshPosts } = useGetPosts(token, seguidoIds);

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
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const renderFooter = () => {
    if (loading && posts.length > 0) {
      return <ActivityIndicator style={{ marginVertical: 20 }} />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentArea}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Post post={item} />}
          onEndReached={() => {
            if (!loading) {
              getNextPosts();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshPosts} />
          }
          ListFooterComponent={renderFooter}
        />
      </View>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 10,
  },
});

export default Home;
