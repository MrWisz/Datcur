import CustomText from "./CustomText";
import { router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const ActionsFollower = () => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity>
        <Icon name="book" size={32} color="#000" />
        <CustomText>Publicaciones</CustomText>
      </TouchableOpacity>

      <TouchableOpacity>
        <Icon name="users" size={32} color="#000" />
        <CustomText>Seguidores</CustomText>
      </TouchableOpacity>

      <TouchableOpacity>
        <Icon name="users" size={32} color="#000" />
        <CustomText>Seguidos</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    height: 56,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    //borderTopWidth: 1,
    borderTopColor: "#38BDF8", // sky-400
  },
  editIconContainer: {
    position: "relative",
  },
  plusBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },
  profileIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#000",
    borderRadius: 12,
  },
});

export default ActionsFollower;