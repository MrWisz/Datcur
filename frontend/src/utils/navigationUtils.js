import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { router } from 'expo-router';

export const useBackToHome = () => {
  useEffect(() => {
    const backAction = () => {
      router.replace('/Home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);
};
