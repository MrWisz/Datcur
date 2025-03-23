import React from "react";
import { View,StyleSheet, Image,Text } from "react-native";

const Logo: React.FC = () => {
  const path = `../assets/images/`
  const pathLogo = require(`${path}dactur-logo.png`)

  const styles = StyleSheet.create({
    logo: {
      marginTop: 4,
      width: 50,
      height: 50,
    },
    logoContainer: {
      paddingTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    appTitle: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 20,
    },
  });

  return (
    <View style={styles.logoContainer} >
      <Image style={styles.logo} source={pathLogo} />
      <Text style={styles.appTitle}>Dactur</Text>
    </View>
    )
};

export default Logo;
