import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Header from "../src/components/Header";
import BottomNavigation from "../src/components/BottomNavigation";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";
import Post from "../src/components/Post";

export default function PostIndividual() {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
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
        setComments(data.comentarios || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comentario: commentText }),
      });
      if (!res.ok) throw new Error("Error al comentar");
      const updatedPost = await res.json();
      setComments(updatedPost.comentarios || []);
      setCommentText("");
    Toast.show({
      type: "customToast",
      text1: "Exito",
      text2: "Enviado",
      visibilityTime: 3000,
    }); 
    } catch (error) {
      console.error(error);
     //Toast de error 
    }
  };
    // Simulación local:
    /*setComments((prev) => [...prev, { comentario: commentText }]);
    setCommentText("");*/


  if (!post) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.contentArea}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Image
              source={{ uri: post.usuario_id?.foto_perfil }}
              style={styles.avatar}
            />
            <Text style={styles.username}>
              {post.usuario_id?.nombre || "Usuario"}
            </Text>
            <Text style={styles.date}>
              {post.fecha_creacion
                ? new Date(post.fecha_creacion).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Text>
          </View>
          <Text style={styles.description}>{post.descripcion}</Text>
          {post.fotos && post.fotos[0] && (
            <Image source={{ uri: post.fotos[0] }} style={styles.postImage} />
          )}
        </View>
        <View style={styles.commentsSection}>
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
            Comentarios:
          </Text>
          {comments.length > 0 ? (
            comments.map((c, idx) => (
              <Text key={idx} style={{ marginVertical: 2 }}>
                {c.comentario}
              </Text>
            ))
          ) : (
            <Text style={{ color: "#888" }}>Sin comentarios</Text>
          )}
          <View style={styles.commentBox}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleSendComment}>
              <Icon name="send" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
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
    width: "95%",
    alignSelf: "center",
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
    height: 300,
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
    alignSelf: "center",
    fontSize: 11,
    color: "#888",
  },
  commentsSection: { marginTop: 20 },
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
    flex: 1,
    borderRadius: 50,
    margin: 5,
    paddingLeft: "5%",
    fontFamily: "Comic-Bold",
    fontSize: 17,
  },
});
