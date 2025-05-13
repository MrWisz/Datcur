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

const Favorites = () => {
  const [fontsLoaded] = useFonts({
    ComicNeue: require("../assets/fonts/ComicNeue-Regular.ttf"),
    "ComicNeue-Bold": require("../assets/fonts/ComicNeue-Bold.ttf"),
  });

  useBackToHome();

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

  if (!fontsLoaded) return <View />; 

  const gridItems = Array(6).fill(null);

  return (
    <View style={styles.container}>
      <Header />

      {/* Title */}
      <Text style={styles.title}>Publicaciones guardadas</Text>

      {/* Grid Container */}
      <View style={styles.gridContainer}>
        {gridItems.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridItem}
            onPress={() => console.log(`Pressed item ${index}`)}
          />
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
