
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
import { useFocusEffect } from '@react-navigation/native';
import AuthStorage from '../../utils/authStorage';
import axios from 'axios';
import useTheme from '../../hooks/useTheme';
// const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function BottomTabNavigator() {
  const dispatch = useDispatch();
  const Appstack = require("../AppStack/appStack").default;
  const userData = useSelector(state => state.user.userData);
    const [userType, setUserType] = useState('');
    const [userName, setUserName] = useState('');
    const businessProfile = useSelector(state => state.auth.businessProfile);
    const profileData = useSelector((state) => state.profile.Profile);
    const personalProfile = useSelector(state => state.auth.personalProfile);
    const [userId, setUserId] = useState('');
    const [storedProfile, setStoredProfile] = useState(null);

  const [showTab, setShowtab] = useState('flex');
const {theme}=useTheme()
  useEffect(() => {
    if (profileData?.data?.id) {
      const storeProfileId = async () => {
        try {
          await AsyncStorage.setItem('profile_id', profileData.data.user.id.toString());
          console.log('✅ Profile ID stored in AsyncStorage:', profileData.data.user.id);
        } catch (error) {
          console.error('❌ Error storing profile ID:', error);
        }
      };
      storeProfileId();
    }
  }, [profileData]);
    
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Save userType
        if (userData?.user?.user_type) {
          setUserType(userData.user.user_type);
          await AsyncStorage.setItem('userType', userData.user.user_type);
        } else {
          const storedUserType = await AsyncStorage.getItem('userType');
          if (storedUserType) setUserType(storedUserType);
        }
  
        // Save userName
        if (userData?.user?.username) {
          setUserName(userData.user.username);
          await AsyncStorage.setItem('userName', userData.user.username);
        } else if (personalProfile?.user?.username) {
          setUserName(personalProfile?.user?.username);
          await AsyncStorage.setItem('userName', personalProfile?.user?.username);
        } else {
          const storedUserName = await AsyncStorage.getItem('userName');
          if (storedUserName) setUserName(storedUserName);
        }
  
        // Save userId from userData or profileData
        if (userData?.user?.id) {
          setUserId(userData.user.id);
          await AsyncStorage.setItem('userId', userData.user.id);
        } else {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId) {
            setUserId(storedUserId);
          } else if (profileData?.data?.user?.id) {
            setUserId(profileData.data.user.id);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [userData, personalProfile, profileData]);
    useEffect(() => {
      if (userData?.user?.id) {
        setUserId(userData.user.id);
        setStoredProfile(null); // ✅ clear previous user's profile pic
      }
    }, [userData]);
  useEffect(() => {
    if (profileData?.data?.id) {
      const storeProfile = async () => {
        try {
          // Storing the profileData.id (not user.id)
          await AsyncStorage.setItem('profile_id', profileData.data.id.toString());
          console.log('✅ Profile ID stored in AsyncStorage:', profileData.data.id); // Log the correct ID
        } catch (error) {
          console.error('❌ Error storing profile ID:', error);
        }
      };
      storeProfile();
    }
  }, [profileData]);

useFocusEffect(
  React.useCallback(() => {
    console.log("🚨 useFocusEffect triggered");

    const fetchPersonalInfo = async () => {
      const userIdToUse = userId || profileData?.data?.user?.id;
      console.log("🔍 userIdToUse:", userIdToUse);

      if (!userIdToUse) {
        console.log("⚠️ No userId to use, exiting early");
        return;
      }

      try {
        const accessToken = await AuthStorage.getAccessToken();
        console.log("🔑 Access Token:", accessToken);

        const response = await axios.get(
          `http://52.70.194.52/api/core/user-full-detail/${userIdToUse}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response?.data) {
          console.log('📥 API response:', response.data);
          setStoredProfile(response.data);
        } else {
          console.error('⚠️ API returned null or no data');
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error.message);
      }
    };

    fetchPersonalInfo();
  }, [userId, profileData])
);

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
          // tabBarStyle: {
          //   height: 65,
          //   // backgroundColor: '#263d2d',
          //   display: showTab,
          // },
          tabBarStyle: {
            height: 70,
            display: showTab,
         backgroundColor: theme.$background || "#fff",
            borderTopWidth: 0,
            // elevation: 10,
          },
          
          // // tabBarStyle: {height: 80, backgroundColor: '#ffffff',display: 'flex',},
          // tabBarInactiveTintColor: '#f1a722',
          // tabBarInactiveTintColor: '#000',
          // tabBarActiveTintColor: '#f1a722',
          tabBarInactiveTintColor: theme.$background || '#000',
tabBarActiveTintColor: theme.$background || '#f1a722',
          tabBarLabelStyle: {paddingBottom:2},
          tabBarIcon: ({color, size, focused}) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? 'home' : 'home-outline';
              return <Ionicons name={iconName} size={25} color={theme.$lightText} />;
            }

            if (route.name === "Reels") {
              return (
              <Image 
              source={require('../../assets/icon/reels.png')} 
              style={{ width: 25, height: 25, tintColor: 'black',tintColor: theme.$lightText ,
                  borderWidth: focused ? 2 : 0,
                      borderColor: focused ? '#f1a722' : 'transparent',
              }} 
            />
          )}
          
          
          if (route.name === "Dma") {
            return (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: 'black',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10, // elevate from bottom
                  //  elevation: 5,      // Android shadow
                  // shadowColor: '#ffffff',
                  // shadowOffset: { width: 0, height: 2 },
                  // shadowOpacity: 0.25,
                  // shadowRadius: 3.84,
                }}
              >
                <Image 
                  source={require('../../assets/icon/tab.jpg')} 
                  style={{ width: 50, height: 50,borderRadius:25 ,
                      borderWidth: focused ? 2 : 0,
                      borderColor: focused ? '#f1a722' : 'transparent',
                   }} 
                  
                />
              </View>
            );
          }
          
            if (route.name === "Search") {
              iconName = focused ? 'saved-search' : 'search';
              return <MaterialIcons name={iconName} size={30} color={theme.$lightText}  />;
            }
            // if (route.name === "ProfileScreen") {
            //   iconName = focused ? 'profile' : 'Profile';
            //   return <MaterialIcons name={iconName} size={22} color={color || 'black'} />;
            // }
            if (route.name === "Profile") {
              // Replace this with user image from Redux or AsyncStorage if needed
              return (
                <Image
                source={
                  storedProfile?.profile_pic
                    ? { uri: storedProfile.profile_pic }
                    : require('../../assets/icon/profiles.png') // fallback image
                }
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
          <Tab.Screen
          name={"Reels"}
          component={ReelsScreen}
          options={({route, navigation}) => ({
            // title: trans('My Store'),
          })}/>
      
         {/* <Tab.Screen
          name={"Dma"}
          component={DmaHome}
          options={({route, navigation}) => ({
            // title: trans('My Store'),
          })}
          // options={{
          //   tabBarButton: props => <CustomTabBarButton route="home" {...props} />,
          // }}
        />  */}
        <Tab.Screen
  name="Dma"
  component={DmaHome}
  options={{
    tabBarItemStyle: {
      // position: 'absolute',
      // top: -25, // push up to float
    },
  }}
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
