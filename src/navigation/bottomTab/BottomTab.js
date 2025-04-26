
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../../tab/HomeScreen';
import SearchScreen from '../../tab/searchScreen';
import DmaHome from '../../tab/DmahomeScreen';
import { Image } from 'react-native';
import ReelsScreen from '../../tab/ReelsScreen';
import ProfileScreen from '../../tab/Profile';
// const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function BottomTabNavigator() {
  const dispatch = useDispatch();
  const Appstack = require("../AppStack/appStack").default;

  const [showTab, setShowtab] = useState('flex');
  const hideTabbar = (hide = false) => {
    // console.log(hide,'hide======')
    if (hide == false) {
      setShowtab('flex');
      // return 'flex';
    } else {
      setShowtab('none');
      // return 'none';
    }
  };
  const getData = async () => {
    let Data = '';
    await AsyncStorage.getItem('userInfo').then(data => {
      Data = JSON.parse(data);
    });
    // console.log(Data, signOut,'Data&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
    // if (Data != null && Data._id != null)
      // dispatch(
        // getChildDetailsAPI(undefined, undefined, Data._id, undefined, callBack),
      // );
  };

  // console.log(childInfo, 'childInfo..............');
  const [count, setCount] = React.useState(1);
  const exitAppFunc = () => {
    BackHandler.exitApp();
  };
  return (
    <>
      <StatusBar backgroundColor={'#263d2d'} barStyle="light-content" />
      <Tab.Navigator
        backBehaviour="initialRoute"
        screenOptions={({route, navigation}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: '#263d2d',
          },
        //   headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: '500',
            marginLeft: -20,
            fontFamily: 'Yaldevi-Regular',
          },
          tabBarStyle: {
            height: 65,
            // backgroundColor: '#263d2d',
            display: showTab,
          },
          // tabBarStyle: {height: 50, backgroundColor: '#def',display: 'flex',},
          // tabBarInactiveTintColor: '#f1a722',
          tabBarInactiveTintColor: '#000',
          tabBarActiveTintColor: '#f1a722',
          tabBarLabelStyle: {paddingBottom:2},
          tabBarIcon: ({color, size, focused}) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={25} color={color} />;
            }

          //   if (route.name === "Reels") {
          //     return (
          //     <Image 
          //     source={require('../../assets/icon/reels.png')} 
          //     style={{ width: 25, height: 25, tintColor: 'black' }} 
          //   />
          // )}
          
          
            if (route.name === "Dma") {
              return (
                <Image 
                  source={require('../../assets/icon/mainlogo.png')} 
                  style={{ width: 29, height: 40, tintColor: 'black' }} 
                />
              );
            }
            if (route.name === "Search") {
              iconName = focused ? 'saved-search' : 'search';
              return <MaterialIcons name={iconName} size={30} color={color || 'black'} />;
            }
            // if (route.name === "ProfileScreen") {
            //   iconName = focused ? 'profile' : 'Profile';
            //   return <MaterialIcons name={iconName} size={22} color={color || 'black'} />;
            // }
            if (route.name === "Profile") {
              // Replace this with user image from Redux or AsyncStorage if needed
              return (
                <Image
                  source={require('../../assets/icon/profiles.png')} // 👈 replace with your profile image
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    borderWidth: focused ? 2 : 0,
                    borderColor: focused ? '#f1a722' : 'transparent',
                  }}
                />
              );
            } 
          
          
          },
        })}>
        <Tab.Screen
          name={"Home"}
          component={HomeScreen}
        />
          {/* <Tab.Screen
          name={"Reels"}
          component={ReelsScreen}
          options={({route, navigation}) => ({
            // title: trans('My Store'),
          })}/> */}
      
         <Tab.Screen
          name={"Dma"}
          component={DmaHome}
          options={({route, navigation}) => ({
            // title: trans('My Store'),
          })}
          // options={{
          //   tabBarButton: props => <CustomTabBarButton route="home" {...props} />,
          // }}
        /> 
        {/* subjectName = '', chapterName = '', examSet = '' */}
        <Tab.Screen
          name={"Search"}
          component={SearchScreen}
          options={({route, navigation}) => ({
            // title: trans('User Profile'),
          })}
          // options={{
          //   tabBarButton: props => <CustomTabBarButton route="home" {...props} />,
          // }}
        />
        <Tab.Screen
          name={"Profile"}
          component={ProfileScreen}
          // options={({route, navigation}) => ({
          //   title: trans('Notification'),
          // })}
        />

      </Tab.Navigator>
    </>
  );
}

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: '#263d2d',
    borderTopWidth: 0,
    // bottom: 10,
    // right: 10,
    // left: 10,
    height: 80,
  },
});
