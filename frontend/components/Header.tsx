import type React from "react";
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Logo from "@/components/Logo";

const Header: React.FC = () => {
  return (
    <ImageBackground 
      source={require('@/assets/images/wave.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.header}>
        <Logo />
        <TouchableOpacity onPress={() => router.push('/Config')}>
          <Icon style={styles.config} name="settings" size={28} color="#444" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: 110,
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'transparent', // Cambiado para que la imagen de fondo sea visible
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  config:{
    marginBottom: 20,
  }
});

export default Header;
