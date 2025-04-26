import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const videoRef = useRef(null);

  useEffect(() => {
    console.log("⏳ Splash screen mounted");

    const timer = setTimeout(() => {
      console.log("⏭️ Navigating to Login screen");
      navigation.replace('Login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../assets/splash.mp4')}
        resizeMode="cover"
        style={styles.video}
        muted
        repeat={false}
        playWhenInactive={false}
        ignoreSilentSwitch="obey"
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width,
    height,
    position: 'absolute',
  },
});

export default SplashScreen;
