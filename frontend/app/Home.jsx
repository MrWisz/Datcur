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
import { router } from "expo-router";

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
          renderItem={({ item }) => (
            <Post
              post={item}
              onCommentIconPress={() =>
                router.push(`/PostIndividual?postId=${item._id}`)
              }
            />
          )}
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
});

export default Home;
