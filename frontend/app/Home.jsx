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
import axios from "axios";
import { useGetPosts } from "../app/pagination/useGetPosts";

const Home = () => {

  //const API_URL = Constants.expoConfig.extra.API_URL;
  const [token, setToken] = useState(null);

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("accessToken"); 
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (e) {
      console.error("Failed to load token from storage", e);
    }
  };

  useEffect(() => {
    loadToken(); 
  }, []);

  const { posts, getNextPosts, loading, refreshPosts } = useGetPosts(token); 

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
