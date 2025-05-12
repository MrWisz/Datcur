import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput, 
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import CustomText from "./CustomText";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

export default function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [saved, setSaved] = useState(false);
  {/*para los me gusta */}
  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };
  {/*para los comentarios */}
  const [showComments, setShowComments] = useState(false);
  
    const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const handleSendComment = () => {
    if (commentText.trim()) {
      setComments((prev) => [...prev, commentText.trim()]);
      setCommentText("");
    Toast.show({
      type: "customToast",
      text1: "Exito",
      text2: "Enviado",
      visibilityTime: 3000,
    });
    }
  };

  {/*para guardar los fav */}
  const toggleSave = () => {
    setSaved(!saved);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
        <TouchableOpacity onPress={() => router.push("/ProfileFollower")}>
          <CustomText style={styles.username}>{post.usuario_id}</CustomText>
        </TouchableOpacity>
        <Text style={styles.date}>{post.date}</Text>
      </View>
      <CustomText style={styles.description}>{post.description}</CustomText>

      <Image source={{ uri: post.image }} style={styles.postImage} />
      {/*interaccion de cada publicacion */}
      <View style={styles.interactions}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionBtn}>
          {/*me gusta */}
          <Icon name="heart" size={20} color={liked ? "red" : "#333"} />
          <Text style={styles.actionText}>{likesCount}</Text>
        </TouchableOpacity>
        {/*hacer comentarios */}
        <TouchableOpacity
          onPress={() => setShowComments(!showComments)}
          style={styles.actionBtn}
        >
          <Icon name="message-circle" size={20} color="#333" />
        </TouchableOpacity>
        {/*agregar favoritos */}
        <TouchableOpacity onPress={toggleSave} style={styles.actionBtn}>
          <Icon name="star" size={20} color={saved ? "#FFC107" : "#333"} />
        </TouchableOpacity>
      </View>
      {showComments && (
        <View style={styles.commentBox}>
          <TextInput
            style={[styles.input, { fontFamily: "Comic-Bold" }]}
            placeholder="Escribe un comentario..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity onPress={handleSendComment}>
            <Icon name="send" size={20} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 10,
    padding: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontFamily: "Comic-Bold",
    fontSize: 20,
  },
  postImage: {
    width: "100%",
    //height: 250,
    borderRadius: 10,
    marginVertical: 10,
    height: 300,
  },
  interactions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionText: {
    fontSize: 14,
  },
  description: {
    marginTop: 8,
    fontSize: 17,
    color: "#555",
  },
  date: {
    marginLeft: "auto",
    alignSelf: "flex-start",
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    backgroundColor: "rgba(91, 212, 255, 0.25)",
    height: 40,
    width: 280,
    borderRadius: 50,
    margin: 5,
    paddingLeft: "5%",
    fontFamily: "Comic-Bold",
    fontSize: 17,
  },
});
