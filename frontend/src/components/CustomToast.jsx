import { View, Text, StyleSheet } from "react-native";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const CustomToast = ({ text1, text2 }) => {
  return (
    <View style={styles.toastContainer}>
      <Text style={styles.title}>{text1}</Text>
      {text2 ? <Text style={styles.message}>{text2}</Text> : null}
      <MaterialIcons
        name="check-circle"
        size={24}
        color="#8DB600" 
        style={{ marginRight: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    marginTop: "60%",
    width: 300,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#5BD4FF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  title: {
    fontFamily: "Comic-Bold",
    fontSize: 20,
    textAlign: "center",
  },
  message: {
    fontFamily: "Comic-Neue",
    fontSize: 16,
    textAlign: "center",
    //marginTop: 5,
  },
});

export default CustomToast;


/*
toastContainer: {
    width: 250,
    padding: 20,
    backgroundColor: "#5BD4FF",
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    flexGrow: 1,
  }, */