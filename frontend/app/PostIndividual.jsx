import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Header from "../src/components/Header";
import BottomNavigation from "../src/components/BottomNavigation";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";
import Post from "../src/components/Post";
import { useRef } from "react";
import Toast from "react-native-toast-message";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function PostIndividual() {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const API_URL = Constants.expoConfig.extra.API_URL;
  const commentInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/comments/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setComments(data); 
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

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
        fetchComments(); 
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
      if (!token) {
        Toast.show({ type: "error", text1: "No hay token de sesión" });
        return;
      }
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, content: commentText }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Respuesta del backend:", data);
        Toast.show({
          type: "error",
          text1: "Error al comentar",
          text2: data?.message || "Intenta de nuevo",
        });
        return;
      }

      setCommentText("");
      fetchComments(); // <-- Vuelve a cargar los comentarios
      Toast.show({
        type: "customToast",
        text1: "Éxito",
        text2: "Comentario enviado",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error al comentar:", error);
      Toast.show({
        type: "error",
        text1: "Error inesperado",
        text2: error.message,
      });
    }
  };


    // Simulación local:
    /*setComments((prev) => [...prev, { comentario: commentText }]);
    setCommentText("");*/


  if (!post) return <Text>Cargando...</Text>;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // Ajusta según tu header
    >
      <Header />
      <ScrollView
        style={styles.contentArea}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        <Post
          post={post}
          onCommentIconPress={() => {
            commentInputRef.current?.focus();
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 300);
          }}
        />
        <View style={styles.commentsSection}>
          {/* ...comentarios... */}
          <View style={styles.commentBox}>
            <TextInput
              ref={commentInputRef}
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
    </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
    paddingBottom: 10,
  },
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
