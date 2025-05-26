import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import CustomText from "./CustomText";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Post({ post }) {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [saved, setSaved] = useState(post.favorito || false);
  const [sessionUserId, setSessionUserId] = useState(null);

  useEffect(() => {
    if (typeof post.favorito === "boolean") {
      setSaved(post.favorito);
    }
  }, [post.favorito]);

  useEffect(() => {
    // Obtener el userId de la sesión al montar el componente
    AsyncStorage.getItem("userName").then(setSessionUserId);
  }, []);

  {
    /*para los me gusta */
  }
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
          setLikesCount((prev) => prev + 1);
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
            setLikesCount((prev) => Math.max(prev - 1, 0));
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
        // ➕ Agregar a favoritos
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
        // Buscar favorito actual y eliminarlo
        const resList = await fetch(`${API_URL}/favorites/user/${userId}`, {
          headers,
        });
        const favorites = await resList.json();

        const favorite = favorites.find(
          (f) => f.postId._id === post._id || f.postId === post._id
        );

        if (favorite?._id) {
          const resDelete = await fetch(
            `${API_URL}/favorites/${favorite._id}`,
            {
              method: "DELETE",
              headers,
            }
          );

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
        } else {
          Toast.show({
            type: "info",
            text1: "Esta publicación no está en favoritos",
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

  {
    /*para los comentarios */
  }
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

  // Estado para mostrar el menú de opciones
  const [showOptions, setShowOptions] = useState(false);

  // Estado para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.description);

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
        // Aquí podrías refrescar la lista de posts o navegar
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
        body: JSON.stringify({ description: editText }),
      });
      if (res.ok) {
        Toast.show({ type: "success", text1: "Publicación actualizada" });
        setIsEditing(false);
        // Aquí podrías refrescar la lista de posts o actualizar el estado
      } else {
        Toast.show({ type: "error", text1: "Error al editar" });
      }
    } catch (e) {
      Toast.show({ type: "error", text1: "Error inesperado" });
    }
    setShowOptions(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => router.replace("/ProfileFollower")}>
            <CustomText style={styles.username}>{post.usuario_id}</CustomText>
          </TouchableOpacity>
          <Text style={styles.dateSmall}>{post.date}</Text>
        </View>

        {/* Solo mostrar los tres puntos si el post es del usuario de la sesión */}
        {sessionUserId == post.usuario_id && (
          <TouchableOpacity
            onPress={() => setShowOptions(true)}
            style={styles.optionsBtn}
          >
            <Icon name="more-vertical" size={22} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de opciones */}
      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPressOut={() => setShowOptions(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 16,
              minWidth: 180,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsEditing(true);
                setShowOptions(false);
              }}
              style={{ paddingVertical: 8 }}
            >
              <Text style={{ fontSize: 16 }}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={{ paddingVertical: 8 }}
            >
              <Text style={{ fontSize: 16, color: "red" }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de edición */}
      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              minWidth: 250,
              elevation: 5,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Editar publicación
            </Text>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              style={[styles.input, { width: 200 }]}
              multiline
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                style={{ marginRight: 10 }}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEdit}>
                <Text style={{ color: "#2196F3" }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  optionsBtn: {
    marginLeft: "auto",
    padding: 4,
  },
  dateSmall: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
