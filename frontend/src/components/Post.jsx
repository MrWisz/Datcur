import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import CustomText from "./CustomText";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.API_URL ||
  Constants.manifest?.extra?.API_URL ||
  "";

// Normaliza el contador de likes
function getLikesCount(likes) {
  if (Array.isArray(likes)) return likes.length;
  if (typeof likes === "number") return likes;
  if (typeof likes === "string" && likes.trim() !== "") return 1;
  if (typeof likes === "object" && likes !== null && likes._id) return 1;
  return 0;
}

function getImageUrl(image) {
  if (typeof image === "string" && image.trim() !== "") {
    if (image.startsWith("http")) return image;
    return `${API_URL.replace(/\/$/, "")}/${image.replace(/^\/+/, "")}`;
  }
  return null;
}

export default function Post({ post, isOwnProfile, onPostUpdated, onPostDeleted }) {
  const [liked, setLiked] = useState(post.liked || false);
  const [saved, setSaved] = useState(post.favorito || false);

  // NUEVO: para editar/eliminar
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.descripcion);

  useEffect(() => {
    setEditText(post.descripcion);
  }, [post.descripcion]);

  // Eliminar post
  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({ type: "error", text1: "Sesión no válida" });
        return;
      }
      const res = await fetch(`${API_URL}/posts/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        Toast.show({ type: "success", text1: "Publicación eliminada" });
        onPostDeleted && onPostDeleted(post._id);
      } else {
        Toast.show({ type: "error", text1: "Error al eliminar" });
      }
    } catch (e) {
      Toast.show({ type: "error", text1: "Error inesperado" });
    }
    setShowOptions(false);
  };

  // Editar post
  const handleEdit = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Toast.show({ type: "error", text1: "Sesión no válida" });
        return;
      }
      const res = await fetch(`${API_URL}/posts/${post._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ descripcion: editText }),
      });
      if (res.ok) {
        Toast.show({ type: "success", text1: "Publicación actualizada" });
        setIsEditing(false);
        onPostUpdated && onPostUpdated(post._id, editText);
      } else {
        Toast.show({ type: "error", text1: "Error al editar" });
      }
    } catch (e) {
      Toast.show({ type: "error", text1: "Error inesperado" });
    }
    setShowOptions(false);
  };

  useEffect(() => {
    const checkIfSaved = async () => {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("accessToken");

      if (!userId || !token) return;

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const res = await fetch(`${API_URL}/favorites/user/${userId}`, { headers });
        const favorites = await res.json();

        const isSaved = favorites.some(
          (f) =>
            (f.postId && f.postId._id === post._id) || f.postId === post._id
        );

        setSaved(isSaved);
      } catch (error) {
        console.error("Error comprobando favoritos:", error);
      }
    };

    checkIfSaved();
  }, [post._id]);

  // Likes
  const toggleLike = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("accessToken");

      if (!userId || !token) {
        Toast.show({ type: "error", text1: "Sesión no válida" });
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (!liked) {
        const res = await fetch(`${API_URL}/likes`, {
          method: "POST",
          headers,
          body: JSON.stringify({ userId, postId: post._id }),
        });

        if (res.ok) {
          setLiked(true);
          if (Array.isArray(post.likes)) post.likes = [...post.likes, { userId, postId: post._id }];
          else if (typeof post.likes === "number") post.likes += 1;
          else post.likes = 1;
          Toast.show({
            type: "customToast",
            text1: "Te gustó esta publicación ❤️",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error al dar like",
          });
        }
      } else {
        const resLike = await fetch(
          `${API_URL}/likes/by-user/${userId}/post/${post._id}`,
          { headers }
        );

        const like = await resLike.json();

        if (like?._id) {
          const res = await fetch(`${API_URL}/likes/${like._id}`, {
            method: "DELETE",
            headers,
          });

          if (res.ok) {
            setLiked(false);
            if (Array.isArray(post.likes)) post.likes = post.likes.slice(0, -1);
            else if (typeof post.likes === "number" && post.likes > 0) post.likes -= 1;
            else post.likes = 0;
            Toast.show({
              type: "customToast",
              text1: "Ya no te gusta esta publicación",
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Error al quitar like",
            });
          }
        } else {
          Toast.show({
            type: "info",
            text1: "No tienes like en esta publicación",
          });
        }
      }
    } catch (error) {
      console.error("Error en toggleLike:", error);
      Toast.show({
        type: "error",
        text1: "Error inesperado",
      });
    }
  };

  // Favoritos
  const toggleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("accessToken");

      if (!userId || !token) {
        Toast.show({
          type: "customToast",
          text1: "Sesión no válida",
        });
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (!saved) {
        const res = await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers,
          body: JSON.stringify({ userId, postId: post._id }),
        });

        if (res.ok) {
          setSaved(true);
          Toast.show({
            type: "customToast",
            text1: "Guardado",
            text2: "Publicación agregada a favoritos 💛",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error al guardar favorito",
          });
        }
      } else {
        const resList = await fetch(`${API_URL}/favorites/user/${userId}`, {
          headers,
        });
        const favorites = await resList.json();

        const favorite = favorites.find(
          (f) =>
            (f.postId && f.postId._id === post._id) ||
            f.postId === post._id
        );

        if (!favorite || !favorite._id) {
          Toast.show({
            type: "info",
            text1: "Esta publicación no está en favoritos",
          });
          return;
        }

        const resDelete = await fetch(`${API_URL}/favorites/${favorite._id}`, {
          method: "DELETE",
          headers,
        });

        if (resDelete.ok) {
          setSaved(false);
          Toast.show({
            type: "customToast",
            text1: "Favorito eliminado",
            text2: "Quitaste esta publicación de favoritos 💔",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error al quitar favorito",
          });
        }
      }
    } catch (error) {
      console.error("Error en toggleSave:", error);
      Toast.show({
        type: "error",
        text1: "Error inesperado al marcar favorito",
      });
    }
  };

  // Comentarios
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

  // Navegación segura
  const handleProfilePress = () => {
    if (post.usuario_id && typeof post.usuario_id === "object" && post.usuario_id._id) {
      router.push(`/Profile?userId=${post.usuario_id._id}`);
    } else if (typeof post.usuario_id === "string") {
      Toast.show({ type: "info", text1: "Perfil no disponible" });
    } else {
      console.warn("❗️ usuario_id no disponible:", post.usuario_id);
    }
  };

  return (
    <View style={styles?.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.usuario_id?.foto_perfil }} style={styles.avatar} />
        <View style={{ flex: 1, flexDirection: "column" }}>
          <TouchableOpacity onPress={handleProfilePress}>
            <CustomText style={styles.username}>
              {post.usuario_id?.nombre || post.usuario_id || "Usuario"}
            </CustomText>
          </TouchableOpacity>
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
        {isOwnProfile && (
          <TouchableOpacity
            onPress={() => setShowOptions(!showOptions)}
            style={{ marginLeft: 4, zIndex: 2, padding: 5 }}
          >
            <Text style={{ fontSize: 22 }}>⋮</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* --- EDIT/DELETE ZONA --- */}
      {isEditing ? (
        <>
          <TextInput
            value={editText}
            onChangeText={setEditText}
            style={[styles.input, { marginTop: 8, width: "100%" }]}
            multiline
          />
          <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
            <TouchableOpacity onPress={handleEdit} style={[styles.actionBtn, { backgroundColor: "#FFC000", borderRadius: 8, padding: 6 }]}>
              <Text style={{ color: "#222" }}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setIsEditing(false); setEditText(post.descripcion); }} style={[styles.actionBtn, { backgroundColor: "#eee", borderRadius: 8, padding: 6 }]}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <CustomText style={styles.description}>{post.descripcion}</CustomText>
          {showOptions && (
            <View style={{
              position: "absolute",
              top: 45,
              right: 10,
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 10,
              elevation: 6,
              zIndex: 3
            }}>
              <TouchableOpacity onPress={() => { setIsEditing(true); setShowOptions(false); }}>
                <Text style={{ fontSize: 16 }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text style={{ color: "red", fontSize: 16, marginTop: 6 }}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowOptions(false)}>
                <Text style={{ marginTop: 6 }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {post.fotos && post.fotos[0] && (
        <Image source={{ uri: post.fotos[0] }} style={styles.postImage} />
      )}
      <View style={styles.interactions}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionBtn}>
          <Icon name="heart" size={20} color={liked ? "red" : "#333"} />
          <Text style={styles.actionText}>{getLikesCount(post.likes)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowComments(!showComments)}
          style={styles.actionBtn}
        >
          <Icon name="message-circle" size={20} color="#333" />
        </TouchableOpacity>
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
    width: "95%",
    alignSelf: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    position: "relative",
    paddingRight: 8,
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
    fontSize: 11,
    color: "#888",
    marginTop: 1,
    marginLeft: 1,
    fontFamily: "ComicNeue",
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
