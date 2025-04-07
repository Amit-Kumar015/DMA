// import React from "react";
// import { Image, StyleSheet, View } from "react-native";
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { home, homeiconselected, mainlogo, profiles, reels, search, searchiconselected } from "../../constants/imageConstants";
// import CreateProfile from "../../screen/createProfile";
// import DmaHome from "../../tab/DmahomeScreen";
// import Search from "../../component/searchInput";
// import searchScreen from "../../tab/searchScreen";
// import EquipmentScreen from "../../tab/EquipmentScreen";
// import HomeScreen from "../../tab/HomeScreen";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// const Tab = createBottomTabNavigator();

// // ✅ Use correct tab names in ICONS object
// const ICONS = {
//     HomeScreen: { default: home, selected: homeiconselected },
//     Search: { default: search, selected: searchiconselected },
//     Post: { default: mainlogo, selected: mainlogo },
//     DMA: { default: reels, selected: reels },
//     Profile: { default: profiles, selected: profiles },
// };

// const getTabBarIcon = (name, focused) => {
//     const icon = ICONS[name]?.[focused ? "selected" : "default"];

//     return (
//         <View>
//             {icon && <Image source={icon} style={styles.icon} />}
//         </View>
//     );
// };

// const BottomTab = () => {
//     return (
//         <Tab.Navigator screenOptions={{
//             headerShown: false,
//             tabBarStyle: {
//                 height: hp("7%"),
//                 paddingTop: 10,
//                 backgroundColor: "#000"
//             }
//         }}>
//             <Tab.Screen name="HomeScreen" component={HomeScreen} options={({ route }) => ({ tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused), tabBarLabel: () => null })} />
//             <Tab.Screen name="Search" component={searchScreen} options={({ route }) => ({ tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused), tabBarLabel: () => null })} />
//             <Tab.Screen name="Post" component={DmaHome} options={({ route }) => ({ tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused), tabBarLabel: () => null })} />
//             <Tab.Screen name="DMA" component={DmaHome} options={({ route }) => ({ tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused), tabBarLabel: () => null })} />
//             <Tab.Screen name="Profile" component={HomeScreen} options={({ route }) => ({ tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused), tabBarLabel: () => null })} />
//         </Tab.Navigator>
//     );
// };

// export default BottomTab;

// const styles = StyleSheet.create({
//     icon: {
//         width: wp("7%"),
//         height: wp("7%"),
//         resizeMode: "contain",
//     }
// });
import React, {useEffect, useState} from 'react';
// import { NavigationActions } from 'react-navigation';
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
// import SettingsNavigator from './SettingsNavigator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {CommonActions} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../../tab/HomeScreen';
import SearchScreen from '../../tab/searchScreen';
import DmaHome from '../../tab/DmahomeScreen';
import { Image } from 'react-native';
import ReelsScreen from '../../tab/ReelsScreen';
// const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function BottomTabNavigator() {
  const dispatch = useDispatch();
  const Appstack = require("../AppStack/appStack").default;

  const [showTab, setShowtab] = useState('flex');
  // const [maintenance, setMaintenance] = useState(true);
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



  const callBack = () => {
    // dispatch(getFCMnotificationAPI(undefined, childid));
  };
  const [count, setCount] = React.useState(1);
  // console.log(count, 'count.........................');
  // const {FCMnotification = {}} = useSelector(
  //   state => state.GetFCMnotificationReducer,
  // );
  // console.log(FCMnotification, 'FCMnotification............');

  const exitAppFunc = () => {
    BackHandler.exitApp();
  };

  // useEffect(() => {
    // Update countFalseReadStatus whenever AllQuery changes
    // setCount(FCMnotification.filter(item => item.readstatus === 'true').length);
  // }, [FCMnotification]);
  // let badgeCountdata = FCMnotification.filter(
  //   item => item.readstatus === 'true',
  // ).length;
  // console.log(badgeCountdata, 'badgeCountdata......');
  return (
    <>
      <StatusBar backgroundColor={'#263d2d'} barStyle="light-content" />
      <Tab.Navigator
        backBehaviour="initialRoute"
        screenOptions={({route, navigation}) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
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
            height: 60,
            // backgroundColor: '#263d2d',
            display: showTab,
          },
          // tabBarStyle: {height: 50, backgroundColor: '#def',display: 'flex',},
          // tabBarInactiveTintColor: '#f1a722',
          tabBarInactiveTintColor: '#000',
          tabBarActiveTintColor: '#f1a722',
          tabBarLabelStyle: {paddingBottom: 5},
          tabBarIcon: ({color, size, focused}) => {
            let iconName;
            if (route.name === "HomeTab") {
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={22} color={color} />;
            }

            if (route.name === "ReelsTab") {
              return (
              <Image 
              source={require('../../assets/icon/reels.png')} 
              style={{ width: 29, height: 30, tintColor: 'black' }} 
            />
          )}
          
          
            if (route.name === "DmaTab") {
              return (
                <Image 
                  source={require('../../assets/icon/mainlogo.png')} 
                  style={{ width: 29, height: 30, tintColor: 'black' }} 
                />
              );
            }
            if (route.name === "SearchScreen") {
              iconName = focused ? 'saved-search' : 'search';
              return <MaterialIcons name={iconName} size={25} color={color || 'black'} />;
            }
            // if (route.name === "searchScreen") {
            //   iconName = focused ? 'search' : 'search';
            //   return <MaterialIcons name={iconName} size={22} color={color || 'black'} />;
            // }
          
          
          },
        })}>
        <Tab.Screen
          name={"HomeTab"}
          component={HomeScreen}
          // children={() => {
          //   return <Appstack hideTabbar={hideTabbar} />;
          // }}
          options={({route, navigation}) =>
            // console.log(
            //   navigation.getState().routes[navigation.getState().index].name,
            // ),
            ({
              // title: trans('Home'),
            })
          }
          
          // options={{
          //   tabBarButton: props => <CustomTabBarButton route="home" {...props} />,
          // }}
        />
          <Tab.Screen
          name={"ReelsTab"}
          component={ReelsScreen}
          options={({route, navigation}) => ({
            // title: trans('My Store'),
          })}/>
      
         <Tab.Screen
          name={"DmaTab"}
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
          name={"SearchScreen"}
          component={SearchScreen}
          options={({route, navigation}) => ({
            // title: trans('User Profile'),
          })}
          // options={{
          //   tabBarButton: props => <CustomTabBarButton route="home" {...props} />,
          // }}
        />
        {/* <Tab.Screen
          name={ROUTES.NOTIFICATION_TAB}
          component={NotificationTabNavigator}
          options={({route, navigation}) => ({
            title: trans('Notification'),
          })}
        /> */}
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
