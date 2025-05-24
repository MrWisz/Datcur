import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { useFonts } from "expo-font";
import { useBackToHome } from '../src/utils/navigationUtils';
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { API_URL } from "@env";
import Toast from "react-native-toast-message";
import { Image } from "react-native"; 


const Favorites = () => {
  const [fontsLoaded] = useFonts({
    ComicNeue: require("../assets/fonts/ComicNeue-Regular.ttf"),
    "ComicNeue-Bold": require("../assets/fonts/ComicNeue-Bold.ttf"),
  });

  useBackToHome();

  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      router.replace("/Home"); //limpia el historial
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

 useEffect(() => {
  const fetchFavorites = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const token = await AsyncStorage.getItem("accessToken");

    if (!userId || !token) {
      Toast.show({
        type: "customToast",
        text1: "Sesión no válida",
        text2: "Inicia sesión nuevamente",
      });
      return;
    }

    if (!fontsLoaded) return <View />; 

    try {
      const res = await fetch(`${API_URL}/favorites/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("No se recibió un array de favoritos:", data);
        return;
      }

      // Extraer el post poblado
      const extractedPosts = data
        .filter((fav) => fav.postId && fav.postId.fotos?.[0])
        .map((fav) => ({
          key: fav._id, // clave única del favorito
          postId: fav.postId._id,
          image: fav.postId.fotos[0],
        }));

      setFavorites(extractedPosts);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      Toast.show({
        type: "customToast",
        text1: "Error al cargar",
        text2: "Intenta nuevamente más tarde",
      });
    }
  };

  fetchFavorites();
}, []);


  return (
    <View style={styles.container}>
      <Header />

      {/* Title */}
      <Text style={styles.title}>Publicaciones guardadas</Text>

      {/* Grid Container */}
      <View style={styles.gridContainer}>
        {favorites.map((post) => (
          <TouchableOpacity
            key={post.key} // ahora la key es única por documento de favorito
            style={styles.gridItem}
            onPress={() => console.log(`Pressed post ${post.postId}`)}
          >
            <Image
              source={{ uri: post.image }}
              style={{ width: "100%", height: "100%", borderRadius: 4 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontFamily: "ComicNeue-Bold",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridItem: {
    width: "45%",
    aspectRatio: 1,
    backgroundColor: "#E5E5E5",
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default Favorites;
