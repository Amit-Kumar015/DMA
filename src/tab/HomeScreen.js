import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, SafeAreaView, StyleSheet, BackHandler, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTheme from '../hooks/useTheme';
import Header from '../component/header';
import { Avatar } from 'react-native-elements';
import Text from '../component/Text';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from '../component/icon';
import { useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import AuthStorage from '../utils/authStorage';

const HomeScreen = () => {
  const { theme } = useTheme();
  const userData = useSelector(state => state.user.userData);
  const [userType, setUserType] = useState('');
  const businessProfile = useSelector(state => state.auth.businessProfile);


  console.log('Business Name:', businessProfile);

const [deviceInfo, setDeviceInfo] = useState({
  ip_address: 'Fetching...',
  latitude: 'Fetching...',
  longitude: 'Fetching...',
  location: 'Fetching...',
  device_type: 'Fetching...',
  os: 'Fetching...',
  browser: 'Fetching...',
  user_agent: 'Fetching...',
  device_name: 'Fetching...',
});

useEffect(() => {
  const fetchDeviceDetails = async () => {
    try {
      // const deviceName = await DeviceInfo.getDeviceName();
      const deviceType = DeviceInfo.getDeviceType();
      const osName = DeviceInfo.getSystemName();
      const osVersion = DeviceInfo.getSystemVersion();
      const userAgent = await DeviceInfo.getUserAgent();
      // const browser = Platform.OS === 'android' ? 'Chrome' : 'Safari';

      let latitude = 'Unavailable';
      let longitude = 'Unavailable';
      let address = 'Unknown Location';

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Location permission denied');
        }
      }

      await new Promise((resolve) => {
        Geolocation.getCurrentPosition(
          async (position) => {
            latitude = position.coords.latitude.toFixed(6);
            longitude = position.coords.longitude.toFixed(6);

            const locationResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const locationData = await locationResponse.json();
            address = locationData?.display_name || 'Unknown Location';

            resolve();
          },
          (error) => {
            console.error('Error getting location:', error);
            resolve(); // still resolve to proceed
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });

      const response = await fetch('https://api64.ipify.org?format=json');
      const ipData = await response.json();

      const finalDeviceInfo = {
        ip_address: ipData.ip,
        latitude,
        longitude,
        location: address,
        device_type: deviceType,
        os: `${osName} ${osVersion}`,
        // browser,
        user_agent: userAgent,
      };

      setDeviceInfo((prevState) => ({ ...prevState, ...finalDeviceInfo }));
      const accessToken = await AuthStorage.getAccessToken();
      // 🔥 Make the API request using FormData
      const formData = new FormData();
      formData.append('ip_address', finalDeviceInfo.ip_address);
      formData.append('latitude', finalDeviceInfo.latitude);
      formData.append('longitude', finalDeviceInfo.longitude);
      formData.append('location', finalDeviceInfo.location);
      formData.append('device_type', finalDeviceInfo.device_type);
      formData.append('os', finalDeviceInfo.os);
      // formData.append('browser', finalDeviceInfo.browser);
      formData.append('user_agent', finalDeviceInfo.user_agent);

      const apiResponse = await fetch(
        'http://52.70.194.52/api/core/user-activities/a31f776e-efae-4b29-ad23-6c05808b1b04/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // 'Content-Type': 'application/json',
          },
          body: formData,
        }
      );

      if (apiResponse.ok) {
        console.log('Device info submitted successfully.');
      } else {
        console.error('Failed to submit device info:', await apiResponse.text());
      }
    } catch (error) {
      console.error('Error fetching device details:', error);
    }
  };

  fetchDeviceDetails();
}, []);


console.log("deviceinfo",deviceInfo)
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => backHandler.remove();
  }, []);


  useEffect(() => {
    const fetchUserType = async () => {
      try {
        if (userData?.user?.user_type) {
          setUserType(userData.user.user_type);
          await AsyncStorage.setItem('userType', userData.user.user_type); // Save userType
        } else {
          const storedUserType = await AsyncStorage.getItem('userType'); // Fetch userType from AsyncStorage
          if (storedUserType) {
            setUserType(storedUserType);
          }
        }
      } catch (error) {
        console.error('Error fetching userType:', error);
      }
    };
  
    fetchUserType();
  }, [userData]);

  console.log('Current userType:', userType);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <Header 
        showBack={false} 
        title="Dashboard" 
        rightComponent={
          <View style={{ flexDirection: 'row', gap: 15 }}>
            <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
              <Icon name="bell" size={23} color={"black"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Settings Icon Clicked!')}>
              <Icon name="menu" size={23} color={"black"} />
            </TouchableOpacity>
          </View>
        } 
      />

      {/* Avatar & Name */}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Avatar
          size={80}
          rounded
          overlayContainerStyle={{
            backgroundColor: theme.$surface,
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={require('../assets/icon/profiles.png')}
        />
        <Text h3 semiBold style={{ marginTop: 4 }}>Yuraj Dance Academy</Text>
      </View>

      {/* Business User Details */}
      {userType === 'business' ? (
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text h4 thin style={{ color: theme.$lightText }}>Dance Teacher</Text>
          <Text h4 thin style={{ color: theme.$lightText }}>10 years of Dance experience</Text>
          <Text h4 thin style={{ color: theme.$lightText }}>World Class Dancer</Text>
          <Text h4 thin style={{ color: theme.$lightText }}>Works at the world's best dance academy</Text>
          <Text h4 thin style={{ marginTop: 8 }}>123 posts</Text>
        </View>
      ) : userType === 'personal' ? (
        /* Personal User Details */
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text h4 bold style={{ color: 'blue' }}>Welcome, Personal User!</Text>
          <Text h4 thin style={{ color: theme.$lightText }}>Enjoy Your Personalized Dashboard</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default HomeScreen;

const style = StyleSheet.create({
  Container: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#ffffff',
  },
  editProfileButton: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E847C5",
    borderRadius: 20,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: hp('10%'),
  },
});
