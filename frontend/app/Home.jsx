import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, useState } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import Post from "../src/components/Post";

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

  const posts = [
    {
      id: "1",
      usuario_id: "Usuario 1",
      userAvatar:
        "https://i.pinimg.com/474x/ca/ea/07/caea07d30db1356c5ac1576b0fc0ab19.jpg",
      description: "¡Mi primera publicación!",
      date: getCurrentDate(),
      image: "https://picsum.photos/300/200",
      likes: 4,
    },
    {
      id: "2",
      usuario_id: "Usuario 2",
      userAvatar: "https://cdn-icons-png.freepik.com/512/13135/13135509.png",
      description: "Hola mundo en Datcur",
      date: getCurrentDate(),
      image: "https://picsum.photos/300/201",
      likes: 9,
    },
  ];
  
  return (
    <View style={styles.container}>
      <Header />

      {/* Content Area */}
      <View style={styles.contentArea}>
        <ScrollView style={styles.scrollView}>
          {posts.map((item) => (
            <Post key={item.id} post={item} />
          ))}
        </ScrollView>
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
