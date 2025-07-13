import { StyleSheet,  View, Switch, Image, Alert, TouchableOpacity, AppState } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { useNavigation } from '@react-navigation/native'
import AuthStorage from '../utils/authStorage'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../component/header';
import useTheme from '../hooks/useTheme';
import { CommonActions } from '@react-navigation/native';
import { clearStorageData } from '../utils/commonAction';
import { setUserData } from '../slices/userSlice';
import { setBusinessProfile, setData, setPersonalProfile } from '../slices/authSlice';
import { useDispatch } from 'react-redux';
import { showMessage } from '../utils/messages/message';
import { setProfile } from '../slices/profileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from '../component/Text';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { Linking, Platform } from 'react-native';
import AlertPopUp from '../component/AlertPopUp';



const MenuOptionScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const [notificationAlertVisible, setNotificationAlertVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const checkNotificationPermission = async () => {
  const settings = await notifee.getNotificationSettings();

  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
};
    const openAppNotificationSettings = async () => {
  if (Platform.OS === 'android') {
    await notifee.openNotificationSettings(); // opens app notification settings
  } else {
    Linking.openURL('app-settings:');
  }
};

const [isEnabled, setIsEnabled] = useState(false);
useEffect(() => {
    const checkPermission = async () => {
      const granted = await checkNotificationPermission();
      setIsEnabled(granted);
    };

    checkPermission();
  }, []);


  return (
    <View style={[styles.container, { backgroundColor: theme.$background }]}>
      <Header showBack={true} title="DMA" />
      <TouchableOpacity
        style={[styles.ColRow, { backgroundColor: theme.$surface }]}
        onPress={() => {}}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={require('../assets/icon/settings.jpg')} 
            style={{ width: 24, height: 24, marginRight: 10 }}
          />
          <Text bold customColor="black" >Settings</Text>
        </View>
      </TouchableOpacity>
      <View style={[styles.ColRow, { 
        backgroundColor: theme.$surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={require('../assets/icon/darkMode.png')} 
            style={{ width: 24, height: 24, marginRight: 10 }}
          />
          <Text h5 bold customColor="black">Dark Mode</Text>
        </View>
        <Switch
          value={theme.mode === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={theme.mode === 'dark' ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
       <View style={[styles.ColRow, { 
        backgroundColor: theme.$surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={require('../assets/icon/notification.png')} 
            style={{ width: 24, height: 24, marginRight: 10 }}
          />
          <Text h5 bold customColor="black">Notifications</Text>
        </View>
        <Switch
          onValueChange={() => setNotificationAlertVisible(true)}
          value={isEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={theme.mode === 'dark' ? '#f5dd4b' : '#f4f3f4'}
        />
      <AlertPopUp
        visible={notificationAlertVisible}
        title="Manage Notifications"
        message={
          isEnabled
            ? 'To disable notifications, go to system settings.'
            : 'To enable notifications, go to system settings.'
        }
        okText="Open Settings"
        onCancel={() => setNotificationAlertVisible(false)}
        onPress={() => {
          setNotificationAlertVisible(false);
          openAppNotificationSettings();
        }}
      />
      </View>
      <TouchableOpacity
        style={[styles.ColRow, { backgroundColor: theme.$surface }]}
        onPress={() => {}}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={require('../assets/icon/help.png')} 
            style={{ width: 24, height: 24, marginRight: 10 }}
          />
          <Text bold customColor="black" >Help</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.ColRow, { backgroundColor: theme.$surface }]}
        onPress={() => {}}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={require('../assets/icon/about.png')} 
            style={{ width: 24, height: 24, marginRight: 10 }}
          />
          <Text bold customColor="black" >About</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
  style={[styles.ColRow, { backgroundColor: theme.$surface }]}
  onPress={() =>
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        onPress: async () => {
          try {
            await AuthStorage.removeTokens();  
            await AsyncStorage.removeItem('userType');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('userId');
            // await AsyncStorage.removeItem('profile_id');
            // await  AsyncStorage.removeItem('profile_id');

            dispatch(setUserData(null));
            dispatch(setData(null));
            dispatch(setProfile(null));
            dispatch(setPersonalProfile(null))
            dispatch(setBusinessProfile(null));
            showMessage({
              message: 'You have been logged out.',
              type: 'success',
              theme: theme,
              duration: 3000,
            });
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }], // or 'AuthStack'
              })
            )
          } catch (err) {
            console.error('Logout Error:', err);
            showMessage({
              message: 'Error logging out. Please try again.',
              type: 'danger',
              theme: theme,
              duration: 3000,
            });
          }
        },
      },
    ])
  }
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={require('../assets/icon/logout.png')}
      style={{ width: 24, height: 24, marginRight: 10 }}
    />
  <Text h5 bold customColor="black">Log out</Text>
  </View>
</TouchableOpacity>


    </View>
  )
}

export default MenuOptionScreen

const styles = StyleSheet.create({
    ColRow: {
        width: wp("92%"),
        height: hp("6%"),
        marginHorizontal: wp("4%"),
        marginTop: 20,
        justifyContent: "center",
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    container: {
        width: wp("100%"),
        height: hp("100%"),
    }
})