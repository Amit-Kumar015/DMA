import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Text from './Text';

const NoInternetConnection = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isConnected) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
        <Image 
          source={require('../assets/icon/Internet.jpg')} 
          style={{ width: 250, height: 250, resizeMode: 'contain', marginBottom: 60 }} 
        />
        <Text h3 bold textAliments="center">
          Count not connect to the internet. Please check your network
        </Text>
      </View>
      
    );
  }

  return children;
};
export default NoInternetConnection; 