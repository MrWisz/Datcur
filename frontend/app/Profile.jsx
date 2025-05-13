import React from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import BottomNavigation from "../src/components/BottomNavigation";
import Header from "../src/components/Header";
import user from "../assets/images/usuario.png";
import CustomText from "../src/components/CustomText";
import Icon from "react-native-vector-icons/Feather";
import Post from "../src/components/Post";
import { useBackToHome } from '../src/utils/navigationUtils';

const Profile = () => {
  useBackToHome();

  const genericImage = require("../assets/images/imagePost.png");
  const userAvatar = "https://i.pinimg.com/474x/ca/ea/07/caea07d30db1356c5ac1576b0fc0ab19.jpg";

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Datos de ejemplo para los posts del perfil
  const profilePosts = [
    {
      id: "1",
      usuario_id: "mi_usuario",
      userAvatar:
        "https://i.pinimg.com/474x/ca/ea/07/caea07d30db1356c5ac1576b0fc0ab19.jpg",
      description: "¡Mi segunda publicación!",
      date: getCurrentDate(),
      image: "https://picsum.photos/300/200",
      likes: 6,
    },
    {
      id: "2",
      usuario_id: "mi_usuario",
      userAvatar:
        "https://i.pinimg.com/474x/ca/ea/07/caea07d30db1356c5ac1576b0fc0ab19.jpg",
      description: "¡Mi primera publicación!",
      date: getCurrentDate(),
      image: "https://picsum.photos/300/200",
      likes: 4,
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        <ScrollView style={styles.scrollView}>
        
          <View style={styles.rectangle}>
          <Header />
            <Image source={user} style={[styles.img, { marginTop: "5%" }]} />
            <CustomText style={styles.title}>Name User</CustomText>
            <CustomText style={styles.subtitle}>Hello! I like....</CustomText>
            <View style={styles.postContainer}>
            {profilePosts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
            </View>
          </View>
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
  postContainer:{
    padding: 16,
    paddingTop: 0
  },
  rectangle: {
    backgroundColor: "rgba(255, 192, 0, 0.2)",
    width: "100%",
    height: "28%",
  },
  img: {
    width: 100,
    height: 100,
    //marginBottom: "3%",
    alignSelf: "center",
  },
  title: {
    fontFamily: "Comic-Bold",
    fontSize: 35,
    //fontWeight: "bold",
    textAlign: "center",
    //marginVertical: 10,
  },
  subtitle: {
    fontFamily: "ComicNeue",
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 28,
  },
  contentArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow:1,
  },
});

export default Profile;
