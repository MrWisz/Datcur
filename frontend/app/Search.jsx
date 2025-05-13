import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, FlatList } from "react-native";
import { useFonts } from "expo-font";
import BottomNavigation from "../src/components/BottomNavigation";
import SearchBar from "../src/components/SearchBar";
import UserInfo from "../src/components/UserInfo";
import { BackHandler } from "react-native";
import { useRouter } from "expo-router";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [fontsLoaded] = useFonts({
    ComicNeue: require("../assets/fonts/ComicNeue-Regular.ttf"),
    "ComicNeue-Bold": require("../assets/fonts/ComicNeue-Bold.ttf"),
  });

  useBackToHome();

  // Lista de usuarios de ejemplo
  const users = [
    {
      id: "1",
      username: "joana_doe22",
      fullName: "Joana Doe",
      avatar: "https://picsum.photos/200",
    },
    {
      id: "2",
      username: "karina_smith1",
      fullName: "Karina Smith",
      avatar: "https://picsum.photos/201",
    },
    {
      id: "3",
      username: "robert_perez",
      fullName: "Robert Perez",
      avatar: "https://picsum.photos/202",
    },
    {
      id: "4",
      username: "maria_garcia",
      fullName: "Maria Garcia",
      avatar: "https://picsum.photos/203",
    },
  ];

  // Filtrar usuarios basado en el texto de búsqueda
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  if (!fontsLoaded) {
    return null;
  }

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

  const renderUserItem = ({ item }) => (
    <UserInfo
      avatar={item.avatar}
      username={item.username}
      fullName={item.fullName}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.contentArea}>
        <SearchBar
          value={searchText}
          onChangeText={handleSearchTextChange}
          placeholder="Buscar usuarios..."
        />
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          style={styles.userList}
          showsVerticalScrollIndicator={false}
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
    paddingTop: 10,
  },
  userList: {
    flex: 1,
    paddingHorizontal: 16,
  }
});

export default Search;
