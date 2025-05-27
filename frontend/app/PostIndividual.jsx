import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Header from "../src/components/Header";
import BottomNavigation from "../src/components/BottomNavigation";
import Post from "../src/components/Post"; // <--- Importa tu componente Post
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PostIndividual() {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const API_URL = Constants.expoConfig.extra.API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const res = await fetch(`${API_URL}/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [postId]);

  if (!post) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentArea}>
        <Post post={post} />
      </View>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
