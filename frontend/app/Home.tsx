import React from 'react';
import { View, Text,Image, ScrollView, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather';
import BottomNavigation from '@/src/components/BottomNavigation';
import Header from '@/src/components/Header';


const Home: React.FC = () => {
  const genericImage = require("../assets/images/imagePost.png");
  const renderPost = (key: number) => (
    <View key={key} style={styles.postCard}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Icon name="user" size={18} color="#777" />
        </View>
        <View style={styles.username} />
      </View>
      
      {/* Post Content */}
      <View style={styles.postContent}>
        <View style={styles.textLine} />
        <View style={styles.textLine} />
      </View>
      
      {/* Post Image */}
      <View style={styles.imageContainer}>
          <Image style={styles.postImage} source={genericImage} />
      </View>
      
      <View style={styles.divider} />
      
      {/* Interaction Buttons */}
      <View style={styles.interactions}>
        <Icon name="heart" size={20} color="#f44336" />
        <Icon name="message-circle" size={20} color="#333" />
        <Icon name="star" size={20} color="#FFC107" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <Header/>
      
      {/* Content Area */}
      <View style={styles.contentArea}>
        <ScrollView style={styles.scrollView}>
          {renderPost(1)}
          {renderPost(2)}
        </ScrollView>
      </View>
      
      {/* Bottom Navigation */}
      <BottomNavigation/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    paddingTop: 6,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 10,
  },
  postCard: {
    marginVertical:8,
    marginHorizontal: 16,
    backgroundColor: '#e5e5e5', // gray-200
    borderRadius: 8,
    padding: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#d1d1d1', // gray-300
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#a0a0a0', // gray-400
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    marginLeft: 8,
    width: 96,
    height: 16,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  postContent: {
    marginBottom: 12,
    gap: 8,
  },
  textLine: {
    width: '100%',
    height: 16,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#a0a0a0', // gray-400
    borderRadius: 4,
    marginBottom: 12,
    padding: 16,
    alignItems: "center",
    overflow: 'hidden',
  },
  postImage: {
    height: 100,
    position: 'relative',
  },
  divider: {
    height: 1,
    backgroundColor: '#a0a0a0', // gray-400
    marginBottom: 12,
  },
  interactions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});

export default Home;
