// import React, { useEffect, useState } from "react";
// import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useSelector } from "react-redux";
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import Text from "../component/Text";
// import Header from "../component/header";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from "../component/icon";

// const businessData = [
//     { text: "Attendance", icon: "checkmark-done-outline" },
//     { text: "Members", icon: "people-outline" },
//     { text: "Batches", icon: "layers-outline" },
//     { text: "Weekly Plan", icon: "calendar-outline" },
//     { text: "Equiptment", icon: "fitness-outline" },
//     { text: "Managing Finance", icon: "cash-outline" },
//     { text: "Performance Update", icon: "bar-chart-outline" },
//     { text: "Marketing And Promotion", icon: "megaphone-outline" },
//     // { text: "Pay To Play/Rent Facility", icon: "card-outline" },
//     {text:"Find Near By",icon:"search"},
//     { text: "Organize Event", icon: "calendar-number-outline" },
// ];

// const normalUserData = [
//     { text: "Attendance", icon: "checkmark-done-outline" },
//     { text: "Batches", icon: "layers-outline" },
//     {text:"Find Near By",icon:"search"},
//     { text: "Equiptment", icon: "fitness-outline" },
// ];

// const DmaHome = () => {
//     const navigation = useNavigation();
//     const businessProfile = useSelector(state => state.auth.businessProfile);
//     const [userType, setUserType] = useState('');
//     const [profileMessage, setProfileMessage] = useState('');

//     console.log("Business Profile:", businessProfile);

//     useEffect(() => {
//         const fetchUserType = async () => {
//             try {
//                 // Check if businessProfile exists and contains the success message
//                 if (businessProfile?.message === "Business Info created successfully") {
//                     setProfileMessage(businessProfile.message);
//                     await AsyncStorage.setItem('profileMessage', businessProfile.message); // Save profile message
//                 }

//                 // Fetch userType from Redux or AsyncStorage as needed
//                 const storedUserType = await AsyncStorage.getItem('userType');
//                 if (storedUserType) {
//                     setUserType(storedUserType);
//                 }
//             } catch (error) {
//                 console.error('Error fetching userType or profile message:', error);
//             }
//         };

//         fetchUserType();
//     }, [businessProfile]);

//     console.log('Current userType:', userType);
//     console.log('Profile message:', profileMessage);

//     // Check for userType and profile message to select data
//     const data = userType === "business" || profileMessage === "Business Info created successfully" ? businessData : normalUserData;

//     return (
//         <View style={styles.Container}>
//                <Header
//         showBack={true}
//         title="Dashboard"
//         rightComponent={
//           <View style={{flexDirection: 'row', gap: 15}}>
//             <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
//               <Icon name="bell" size={23} color={'black'} />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
//               <Icon name="menu" size={23} color={'black'} />
//             </TouchableOpacity>
//           </View>
//         }
//       />
//             <FlatList
//                 data={data}
//                 keyExtractor={(item) => item.text}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity
//                         style={styles.ColRow}
//                         onPress={() => {
//                             if (item.text === "Equiptment") {
//                                 navigation.navigate("Equiptment");
//                             } else if (item.text === "Weekly Plan") {
//                                 navigation.navigate("weeklyPlan");
//                             } else if (item.text === "Batches") {
//                                 navigation.navigate("Batches");
//                             } else if (item.text === "Attendance") {
//                                 navigation.navigate("Attendance");
//                             } else if (item.text === "Members") {
//                                 navigation.navigate("members");
//                             }
//                              else if (item.text === "Find Near By") {
//                                 navigation.navigate("NearBy");
//                             }
//                         }}
//                     >
//                              <View style={styles.row}>
//                             <Ionicons name={item.icon} size={20} color="#333" style={styles.icon} />
//                             <Text h5 semiBold textAliments="center">{item.text}</Text>
//                         </View>

//                     </TouchableOpacity>
//                 )}
//             />
//         </View>
//     );
// };

// export default DmaHome;

// const styles = StyleSheet.create({
//     ColRow: {
//         width: wp("92%"),
//         height: hp("6%"),
//         borderWidth: 1,
//         borderColor: "black",
//         borderRadius: 12,
//         marginHorizontal: wp("4%"),
//         marginTop: 20,
//         justifyContent: "center",
//         backgroundColor: "#f2f3f4",
//     },
//     Container: {
//         width: wp("100%"),
//         height: hp("100%"),
//         backgroundColor: "#ffffff",
//     },
//     icon: {
//         marginRight: 10,
//     },
// row: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
// },

// });
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  SafeAreaView,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Text from '../component/Text';
import Header from '../component/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from '../component/icon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AuthStorage from '../utils/authStorage';
import axios from 'axios';
import useTheme from '../hooks/useTheme';
const businessData = [
  {text: 'Attendance', icon: 'checkmark-done-outline'},
  {text: 'Members', icon: 'people-outline'},
  // {text: 'Batch', icon: 'layers-outline'},
  {text: 'Weekly Plan', icon: 'calendar-outline'},
  {text: 'Equiptment', icon: 'fitness-outline'},
  {text: 'Managing Finance', icon: 'cash-outline'},
  {text: 'Performance Update', icon: 'bar-chart-outline'},
  {text: 'Tournament Update', icon: 'megaphone-outline'},
  // { text: "Organize Event", icon: "calendar-number-outline" },
  // { text: "Find Near By", icon: "search" },
  {text: 'Boost My Accademy', icon: 'rocket-outline'},
];
const GymData = [
  {text: 'Attendance', icon: 'checkmark-done-outline'},
  {text: 'Members', icon: 'people-outline'},
  // {text: 'Batch', icon: 'layers-outline'},
  {text: 'Weekly Plan', icon: 'calendar-outline'},

  {text: 'Equiptment', icon: 'fitness-outline'},
  {text: 'Amenities', icon: 'calendar-number-outline'},
  {text: 'MemberShip Packages', icon: 'calendar-outline'},
  {text: 'Managing Finance', icon: 'cash-outline'},
  {text: 'Gym Announcement', icon: 'bar-chart-outline'},
  {text: 'Staff Managment', icon: 'megaphone-outline'},

  // { text: "Find Near By", icon: "search" },
  {text: 'Boost My Gym', icon: 'rocket-outline'},
];
const brandSpecificButtons = [
  {text: 'Boost My Brand', icon: 'rocket-outline'},
  {text: 'Give Sponsor', icon: 'hand-left-outline'},
  {text: 'Sell Your Products', icon: 'cart-outline'},
  {text: 'Get Verified', icon: 'calendar-number-outline'}, // 4th button you mentioned
];

const normalUserData = [
  {text: 'My Connects', icon: 'checkmark-done-outline'},
  {text: 'Find Near By', icon: 'search'},
  // {text: 'Update Daily Workout', icon: 'checkmark-done-outline'},
  {text: 'Track Self Performance', icon: 'fitness-outline'},
  {text: 'Check BMI', icon: 'layers-outline'},
  {text: 'Diet Plan', icon: 'megaphone-outline'},
  {text: 'Get Sponsored', icon: 'fitness-outline'},
  {text: 'Shop Now', icon: 'rocket-outline'},
  // { text: "Organize Event", icon: "calendar-number-outline" },
];
const medicalSpecificButtons = [
  {text: 'Find Near By', icon: 'search'},
  {text: 'Boost Profile', icon: 'rocket-outline'},
  {text: 'Aware Campaign', icon: 'megaphone-outline'},
  {text: 'Get Verified', icon: 'checkmark-done-outline'},
];

const shopSpecificButtons = [
  {text: 'Sell Products', icon: 'cart-outline'},
  {text: 'Manage Stock', icon: 'cube-outline'},
  {text: 'Create Offer', icon: 'pricetags-outline'},
];

const DmaHome = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const businessProfile = useSelector(state => state.auth.businessProfile);
  const userData = useSelector(state => state.user.userData);
  console.log('userData', userData);
  const [userType, setUserType] = useState('');
  const profileData = useSelector(state => state.profile.Profile);
  console.log('🙌 Profile Data:', profileData);
  const personalProfile = useSelector(state => state.auth.personalProfile);
  console.log('persinaldata', personalProfile);
  const [profileMessage, setProfileMessage] = useState('');
  const [userName, setUserName] = useState('');
  console.log('usersss', userType);
  console.log('userName', userName);
  console.log('persinaldata', personalProfile);
  const [userId, setUserId] = useState('');
  console.log('userId', userId);
  const [storedProfile, setStoredProfile] = useState(null);
  console.log('storeProfile', storedProfile);
  useEffect(() => {
    console.log('userTye', userType);
  }, [userType]);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        // Save userType
        if (businessProfile?.message === 'Business Info created successfully') {
          setProfileMessage(businessProfile.message);
          await AsyncStorage.setItem('profileMessage', businessProfile.message);
          //             }
        }
        if (userData?.user?.user_type) {
          setUserType(userData.user.user_type);
          await AsyncStorage.setItem('userType', userData.user.user_type);
        } else {
          const storedUserType = await AsyncStorage.getItem('userType');
          if (storedUserType) setUserType(storedUserType);
        }

        const storedUserType = await AsyncStorage.getItem('userType');
        if (storedUserType) {
          setUserType(storedUserType);
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
      }
    };

    fetchUserType();
  }, [userData, personalProfile, profileData, businessProfile]);
  console.log('Current userType:', userType);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPersonalInfo = async () => {
        const userIdToUse = userId || profileData?.data?.user?.id;
        if (!userIdToUse) return;

        try {
          const accessToken = await AuthStorage.getAccessToken();
          const response = await axios.get(
            `http://52.70.194.52/api/core/user-full-detail/${userIdToUse}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          if (response?.data) {
            console.log('📥 Personal Info API response:', response.data);
            setStoredProfile(response.data);
          } else {
            console.error('⚠️ API returned null or no data');
          }
        } catch (error) {
          console.error('❌ Error fetching user data:', error);
        }
      };

      fetchPersonalInfo();
    }, [userId, profileData]),
  );
  useEffect(() => {
    if (profileData?.data?.id) {
      const storeProfileId = async () => {
        try {
          await AsyncStorage.setItem(
            'profile_id',
            profileData.data.user.id.toString(),
          );
          console.log(
            '✅ Profile ID stored in AsyncStorage:',
            profileData.data.user.id,
          );
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
          await AsyncStorage.setItem(
            'userName',
            personalProfile?.user?.username,
          );
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
          await AsyncStorage.setItem(
            'profile_id',
            profileData.data.id.toString(),
          );
          console.log(
            '✅ Profile ID stored in AsyncStorage:',
            profileData.data.id,
          ); // Log the correct ID
        } catch (error) {
          console.error('❌ Error storing profile ID:', error);
        }
      };
      storeProfile();
    }
  }, [profileData]);
  // Prepare data based on user type
  // const finalData = userType === "business" || profileMessage === "Business Info created successfully"
  //     ? [...businessData]
  //     : [...normalUserData];
  // const finalData =
  // userType === "business" || profileMessage === "Business Info created successfully"
  //     ? (storedProfile?.businessinfo?.main_category === "Brand","Medical Service"
  //         ? [...brandSpecificButtons]
  //         : [...businessData])
  //     : [...normalUserData];
  // Always include "Isha" item
  // const isIshaPresent = finalData.some(item => item.text === "");
  // if (!isIshaPresent) {
  //     finalData.push({
  //         text: "Isha",
  //         icon: "person-outline",
  //         screen: "IshaScreen", // Optional: Create this screen or handle navigation
  //     });
  // }
  let finalData = [];

  const isBusiness =
    userType === 'business' ||
    profileMessage === 'Business Info created successfully';
  const mainCategory = storedProfile?.businessinfo?.main_category;

  if (isBusiness) {
    switch (mainCategory) {
      case 'Brand':
        finalData = [...brandSpecificButtons];
        break;
      case 'Gym':
        finalData = [...GymData];
        break;
      case 'Medical Service':
        finalData = [...medicalSpecificButtons];
        break;
      case 'Shop':
        finalData = [...shopSpecificButtons];
        break;
      default:
        finalData = [...businessData];
    }
  } else {
    finalData = [...normalUserData];
  }
  return (
    <SafeAreaView
      style={[
        styles.Container,
        {backgroundColor: theme.$background}, // ✅ dynamic background color
      ]}>
      <View style={{paddingHorizontal: 16}}>
        <Header
          showBack={true}
          title="DMA"
          rightComponent={
            <View style={{flexDirection: 'row', gap: 15}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('uploadreels')}>
                <AntDesign
                  name="plussquareo"
                  size={23}
                  color={theme.$lightText}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('NotificationScreen')}>
                <Icon name="bell" size={23} color={theme.$lightText} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
                <Icon name="menu" size={23} color={theme.$lightText} />
              </TouchableOpacity>
            </View>
          }
        />
      </View>
      <FlatList
        data={finalData}
        keyExtractor={item => item.text}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.ColRow,
              {backgroundColor: theme.$surface}, // ✅ dynamic background color
            ]}
            onPress={() => {
              switch (item.text) {
                case 'Equiptment':
                  navigation.navigate('Equiptment');
                  break;
                case 'Weekly Plan':
                  navigation.navigate('weeklyPlan');
                  break;
                case 'Batch':
                  navigation.navigate('Batches');
                  break;
                case 'Attendance':
                  navigation.navigate('NewAttendenceScreen');
                  break;
                case 'Members':
                  navigation.navigate('members');
                  break;
                case 'Find Near By':
                  navigation.navigate('NearBy');
                  break;
                case 'Organize Event':
                  navigation.navigate('OrganizeEvent');
                  break;
                case 'Get Sponsored':
                  navigation.navigate('GetSponser');
                  break;
                case 'Give Sponsor':
                  navigation.navigate('GiveSponser');
                  break;
                case 'Tournament Update':
                  navigation.navigate('Tournament');
                  break;
                case 'Performance Update':
                  navigation.navigate('Performance');
                  break;
                case 'Boost My Accademy':
                  navigation.navigate('BoostAccademy');
                  break;
                case 'Check BMI':
                  navigation.navigate('BmiScreen');
                  break;
                case 'Shop Now':
                  // Linking.openURL('https://www.fabsportsindia.com/');
                   navigation.navigate('MainShop');
                  break;
                case 'Diet Plan':
                  navigation.navigate('DietPlan');
                  break;
                case 'My Connects':
                  navigation.navigate('PersonalData');
                  break;
                case 'Boost My Gym':
                  navigation.navigate('BoostGym');
                  break;
                case 'MemberShip Packages':
                  navigation.navigate('GymMemberShip');
                  break;
                case 'Amenities':
                  navigation.navigate('Anenities');
                  break;
                case 'Gym Announcement':
                  navigation.navigate('Announcement');
                     break;
                case 'Get Verified':
                  navigation.navigate('VerifyScreen');
                     break;
                case 'Sell Your Products':
                  navigation.navigate('sellProductScreen');
              }   
            }}>
            <View style={styles.row}>
              <Ionicons
                name={item.icon}
                size={20}
                color="#333"
                style={styles.icon}
              />
              <Text h5 semiBold textAliments="center" style={{color: 'black'}}>
                {item.text}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default DmaHome;

const styles = StyleSheet.create({
  ColRow: {
    width: wp('92%'),
    height: hp('6%'),
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    marginHorizontal: wp('4%'),
    marginTop: 12,
    justifyContent: 'center',
    // backgroundColor: '#f2f3f4',
    paddingHorizontal: 16,
  },
  Container: {
    // width: wp("100%"),
    // height: hp("100%"),
    // backgroundColor: '#ffffff',
    flex: 1,
    // paddingHorizontal:16
    //  padding: hp('2%'),
  },
  icon: {
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
