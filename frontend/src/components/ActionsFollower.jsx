import CustomText from "./CustomText";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const ActionsFollower = ({ activeTab = "posts", onTabChange }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.action}
        onPress={() => onTabChange && onTabChange("posts")}
      >
        <Icon
          name="book"
          size={32}
          color={activeTab === "posts" ? "#FFC000" : "#000"}
        />
        <CustomText style={[
          styles.text,
          activeTab === "posts" && styles.activeText
        ]}>
          Publicaciones
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={() => onTabChange && onTabChange("followers")}
      >
        <Icon
          name="users"
          size={32}
          color={activeTab === "followers" ? "#FFC000" : "#000"}
        />
        <CustomText style={[
          styles.text,
          activeTab === "followers" && styles.activeText
        ]}>
          Seguidores
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={() => onTabChange && onTabChange("following")}
      >
        <Icon
          name="users"
          size={32}
          color={activeTab === "following" ? "#FFC000" : "#000"}
        />
        <CustomText style={[
          styles.text,
          activeTab === "following" && styles.activeText
        ]}>
          Seguidos
        </CustomText>
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
    marginHorizontal: 20,
  },
  text: {
    fontSize: 15,
    fontFamily: "Comic-Bold",
    color: "#333",
    marginTop: 2,
  },
  activeText: {
    color: "#FFC000",
    fontWeight: "bold",
  },
});

export default ActionsFollower;
