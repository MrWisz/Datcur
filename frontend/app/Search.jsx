import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useFonts } from "expo-font";
import BottomNavigation from "../src/components/BottomNavigation";
import SearchBar from "../src/components/SearchBar";
import UserInfo from "../src/components/UserInfo";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";

const Search = () => {
  const [searchText, setSearchText] = useState(""); // Estado para manejar el texto del buscador
  const [fontsLoaded] = useFonts({
    ComicNeue: require("../assets/fonts/ComicNeue-Regular.ttf"),
    "ComicNeue-Bold": require("../assets/fonts/ComicNeue-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  // Función para manejar los cambios en el input de búsqueda
  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Content Area */}
      <View style={styles.contentArea}>
        <SearchBar
          value={searchText} // Se enlaza el estado al valor del SearchBar
          placeholder="Buscar usuarios..."
          onChangeText={handleSearchTextChange} // Se ejecuta cuando cambia el texto
        />

        {/* Mostrar u ocultar la lista dependiendo de si hay texto en la búsqueda */}
        {searchText.trim() !== "" && (
          <View style={styles.resultView}>
            <UserInfo />
            <UserInfo />
            <UserInfo />
            <UserInfo />
          </View>
        )}
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
  },
  title: {
    fontFamily: "ComicNeue-Bold",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontFamily: "ComicNeue",
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  contentArea: {
    flex: 1,
    paddingTop: 6,
    alignItems: "center",
  },
  resultView: {
    flex: 1,
    width: "90%",
    alignItems: "flex-start",
    backgroundColor: "#DFF6FF",
    padding: 20,
    borderRadius: 10,
  },
});

export default Search;
