import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const UserInfo = () => {
  const styles = StyleSheet.create({
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    avatar: {
      width: 32,
      height: 32,
      backgroundColor: "#d1d1d1", // gray-300
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#a0a0a0", // gray-400
      alignItems: "center",
      justifyContent: "center",
    },
    username: {
      marginLeft: 8,
      width: 96,
      height: 16,
      backgroundColor: "#000",
      borderRadius: 4,
    },
  });

  return (
    <View style={styles.userInfo}>
      <View style={styles.avatar}>
        <Icon name="user" size={18} color="#777" />
      </View>
      <View style={styles.username} />
    </View>
  );
};

export default UserInfo;
