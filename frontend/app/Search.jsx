import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, FlatList, BackHandler } from "react-native";
import { useFonts } from "expo-font";
import BottomNavigation from "../src/components/BottomNavigation";
import SearchBar from "../src/components/SearchBar";
import UserInfo from "../src/components/UserInfo";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.API_URL ||
  Constants.manifest?.extra?.API_URL ||
  "";


const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    ComicNeue: require("../assets/fonts/ComicNeue-Regular.ttf"),
    "ComicNeue-Bold": require("../assets/fonts/ComicNeue-Bold.ttf"),
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchText.trim() === "") {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("accessToken");

        const res = await fetch(
          `${API_URL}/users/search?query=${encodeURIComponent(searchText)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          const mapped = data.map((u) => ({
            id: u._id,
            userId: u._id,
            username: u.username || u.nombre,
            fullName: u.nombre,
            avatar: u.foto_perfil || "https://picsum.photos/seed/default/200",
          }));
          setUsers(mapped);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error("Error buscando usuarios:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchText]);

  useEffect(() => {
    const backAction = () => {
      router.replace("/Home");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };

  const renderUserItem = ({ item }) => (
    <UserInfo
      avatar={item.avatar}
      username={item.username}
      fullName={item.fullName}
      userId={item.userId} // <- Pasa userId
      onPressProfile={() => router.push(`/Profile?userId=${item.userId}`)}
    />
  );

  if (!fontsLoaded) return null;

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
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
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
  },
});

export default Search;