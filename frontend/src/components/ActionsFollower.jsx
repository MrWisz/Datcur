import CustomText from "./CustomText";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const ActionsFollower = () => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.action}>
        <Icon name="book" size={32} color="#000" />
        <CustomText>Publicaciones</CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action}>
        <Icon name="users" size={32} color="#000" />
        <CustomText>Seguidores</CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action}>
        <Icon name="users" size={32} color="#000" />
        <CustomText>Seguidos</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  action: {
    alignItems: "center",
    marginHorizontal: 20, // Espaciado entre íconos
  },
});

export default ActionsFollower;
