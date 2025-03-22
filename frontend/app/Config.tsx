import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { useFonts } from 'expo-font';
import { Feather, Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import BottomNavigation from '@/components/BottomNavigation';
import Header from '@/components/Header';


export default function Config() {
  const [fontsLoaded] = useFonts({
    'ComicNeue': require('../assets/fonts/ComicNeue-Regular.ttf'),
    'ComicNeue-Bold': require('../assets/fonts/ComicNeue-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.menuContainer}>
        <MenuItem icon="lightbulb-outline" text="Cambiar contraseña" />
        <MenuItem icon="lightbulb-outline" text="Cambiar foto de perfil" />
        <MenuItem icon="lightbulb-outline" text="Modificar informacion personal" />
        <MenuItem icon="lightbulb-outline" text="Seguridad" />
        <MenuItem icon="" text="Salir" noIcon />
      </View>
      <BottomNavigation/>
    </View>
  );
}

type MenuItemProps = {
  icon: string;
  text: string;
  noIcon?: boolean; // Propiedad opcional
};

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, noIcon = false }) => {
  return (
    <TouchableOpacity style={styles.menuItem}>
      {!noIcon && (
        <MaterialIcons name={icon} size={20} color="#000" style={styles.menuIcon} />
      )}
      <Text style={styles.menuText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 100,
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    zIndex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 20,
    marginLeft: 5,
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontFamily: 'ComicNeue',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#81D4FA', // Slightly darker blue for the bottom nav
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flex: 1,
  },
});