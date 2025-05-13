import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';

const UserInfo = ({ avatar, username, fullName }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={{ uri: avatar }}
        style={styles.avatar}
        defaultSource={require('../../assets/images/usuario.png')}
      />
      <View style={styles.textContainer}>
        <CustomText style={styles.username}>{username}</CustomText>
        <CustomText style={styles.fullName}>{fullName}</CustomText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Comic-Bold',
    marginBottom: 2,
  },
  fullName: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Comic-Neue',
  },
});

export default UserInfo;
