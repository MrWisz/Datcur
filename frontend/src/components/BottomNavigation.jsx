import { router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const BottomNavigation = () => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity>
        <Icon
          name="star"
          onPress={() => router.replace("/Favorites")}
          size={32}
          color="#000"
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Icon
          name="search"
          onPress={() => router.replace("/Search")}
          size={32}
          color="#000"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/Home")}>
        <Icon name="home" size={32} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/NewPost")}>
        <View style={styles.editIconContainer}>
          <Icon name="file-text" size={32} color="#000" />
          <View style={styles.plusBadge}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <Icon
          name="user"
          onPress={() => router.replace("/Profile")}
          size={32}
          color="#000"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    height: 56,
    backgroundColor: "#5BD4FF", // sky-300
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    borderTopWidth: 1,
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

export default BottomNavigation;
