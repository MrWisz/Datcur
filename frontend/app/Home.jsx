import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import Post from "../src/components/Post";
import { useFocusEffect } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const genericImage = require("../assets/images/imagePost.png");

  {
    /*manejo de fecha */
  }
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };


  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 5;

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        console.warn("No se encontró token de acceso.");
        return;
      }

      const response = await axios.get(
        `http://192.168.1.106:3000/posts?page=${page}&limit=${LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newPosts = Array.isArray(response.data)
        ? response.data
        : response.data?.data ?? [];

      console.log("✅ newPosts:", newPosts);

      if (!Array.isArray(newPosts)) {
        console.error("❌ newPosts no es un array:", newPosts);
        return;
      }

      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(newPosts.length === LIMIT);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error al obtener posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); 
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (Platform.OS === "android") {
          BackHandler.exitApp(); // Cierra la app 
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const renderFooter = () =>
    loading ? (
      <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
    ) : null;
  
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.contentArea}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Post post={item} />}
          onEndReached={fetchPosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
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
  contentArea: {
    flex: 1,
    paddingTop: 6,
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
