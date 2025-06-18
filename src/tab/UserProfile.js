import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { Alert, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '../component/Text';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
import AuthStorage from '../utils/authStorage';
import axios from 'axios';

import Icon from '../component/icon';
import AntDesign
from 'react-native-vector-icons/AntDesign';
import Header from '../component/header';
import { Avatar } from 'react-native-elements';
import ActivityIndicator from '../assets/activityIndicator';
import useTheme from '../hooks/useTheme';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import CustomGrid from '../component/Grid';

const UserProfile = ({ route }) => {
  const navigation = useNavigation();
  const { userType, userId } = route.params;
  const {theme} = useTheme();
  const [storeProfile, setStoredProfile] = useState(null); // Fix: useState(null), not useState()
  console.log("storeProfile", storeProfile);
  console.log("userType",userType)
  console.log("user",userId)
    const [selected, setSelected] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchPersonalInfo = async () => {
        try {
          const accessToken = await AuthStorage.getAccessToken();
          const response = await axios.get(
            `http://52.70.194.52/api/core/user-full-detail/${userId}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response?.data) {
            console.log('📥 userDetails response:', response.data);
            setStoredProfile(response.data);
          } else {
            console.error('⚠️ API returned null or no data');
          }
        } catch (error) {
          console.error('❌ Error fetching user data:', error);
        }
      };

      fetchPersonalInfo();
    }, [userId]) // Make sure to include dependencies
  );

  // Optionally render data or loading state here
  const images = [
  { uri: 'https://picsum.photos/id/1012/300/300' },
  { uri: 'https://picsum.photos/id/1012/300/300' },
  { uri: 'https://picsum.photos/id/1013/300/300' },
  { uri: 'https://picsum.photos/id/1015/300/300' },
  { uri: 'https://picsum.photos/id/1016/300/300' },
  { uri: 'https://picsum.photos/id/1018/300/300' },
  { uri: 'https://picsum.photos/id/1020/300/300' },
  { uri: 'https://picsum.photos/id/1024/300/300' },
  { uri: 'https://picsum.photos/id/1025/300/300' },
  { uri: 'https://picsum.photos/id/1027/300/300' },
  { uri: 'https://picsum.photos/id/1028/300/300' },
  { uri: 'https://picsum.photos/id/1031/300/300' },
  { uri: 'https://picsum.photos/id/1033/300/300' },
  { uri: 'https://picsum.photos/id/1035/300/300' },
  { uri: 'https://picsum.photos/id/1037/300/300' },
];

  return (
  <SafeAreaView
       style={[
         style.Container,
         {backgroundColor: theme.$background}, // ✅ dynamic background color
       ]}>
    {/* Header */}
    <Header
  showBack={true}
  title={ storeProfile?.username} 
      rightComponent={
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity onPress={() => navigation.navigate('uploadreels')}>
            <AntDesign name="plussquareo" size={23} color={theme.$lightText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
            <Icon name="bell" size={23} color={theme.$lightText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Icon name="menu" size={23} color={theme.$lightText} />
          </TouchableOpacity>
        </View>
      }
    />
        <View style={{ marginTop: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
    {storeProfile === null ? (
  <ActivityIndicator />
) : (
  <Avatar
    size={70}
    rounded
    overlayContainerStyle={{
      backgroundColor: theme.$surface,
      borderColor: theme.$secondaryText,
      borderWidth: 1,
    }}
    source={
        storeProfile?.profile_pic
        ? { uri: `${storeProfile.profile_pic}` }
        : require('../assets/icon/profiles.png')
    }
  />
)}
   <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
  <View style={{ alignItems: 'center', minWidth: '20%' }}>
    <Text h4 semiBold numberOfLines={1}>15</Text>
    <Text h5 semiBold numberOfLines={1}>Posts</Text>
  </View>
  <View style={{ alignItems: 'center', minWidth: '30%' }}>
    <Text h4 semiBold numberOfLines={1}>0</Text>
    <Text h5 semiBold numberOfLines={1}>Followers</Text>
  </View>
  <View style={{ alignItems: 'center', minWidth: '30%' }}>
    <Text h4 semiBold numberOfLines={1}>0</Text>
    <Text h5 semiBold numberOfLines={1}>Following</Text>
  </View>
</View>

</View>
<View style={{ paddingHorizontal:16}}>
{storeProfile && (
<Text h5  bold>{storeProfile.first_name} {storeProfile.last_name}</Text>
)}
</View>
<View style={{ flexDirection: 'row', gap: 10, justifyContent:"center",top:10 ,paddingHorizontal:16}}>
<ButtonWithPushBack customContainerStyle={{ flex: 1 }}>
  <PrimaryButton
    title="Follow"
    onPress={() => {
          setSelected('Follow');
      Alert.alert("coming soon");
    }}
  //  customsBg={selected === 'Follow' ? '#000' : 'transparent'} // Black if selected, else transparent
  //   titleStyle={{
  //     color: selected === 'Follow' ? '#fff' : '#000', // White if selected, else black
  //   }}
  //      buttonStyle={{
  //     borderWidth: 1,
  //     borderColor: '#000',
  //   }}
      customsBg={selected === 'Follow' ? theme.$primary : 'transparent'}
    titleStyle={{
      color: selected === 'Follow' ? theme.$onPrimary : theme.$lightText, // text color based on selection
    }}
       buttonStyle={{
      borderWidth: 1,
      borderColor: theme.$lightText,
   
    }}
  />
</ButtonWithPushBack>

<ButtonWithPushBack customContainerStyle={{ flex:1 }}>
  <PrimaryButton
    title="Message"
    onPress={() => {
        setSelected('Message');
     Alert.alert("coming soon")
    }}
    //  customsBg={selected === 'Message' ? '#000' : 'transparent'} // Black if selected, else transparent
    // titleStyle={{
    //   color: selected === 'Message' ? '#fff' : '#000', // White if selected, else black
    // }}
    //    buttonStyle={{
    //   borderWidth: 1,
    //   borderColor: '#000',
    // }}
       customsBg={selected === 'Message' ? theme.$primary : 'transparent'}
    titleStyle={{
      color: selected === 'Message' ? theme.$onPrimary : theme.$lightText, // text color based on selection
    }}
       buttonStyle={{
      borderWidth: 1,
     borderColor: theme.$lightText,
   
    }}
    
  />
</ButtonWithPushBack>
{userType === 'business' && (
    <ButtonWithPushBack customContainerStyle={{ flex: 1 }}>
      <PrimaryButton
        title="Invite"
      onPress={() => {
  setSelected('Invite');
  Alert.alert('Coming soon');
}}
    //       customsBg={selected === 'Invite' ? '#000' : 'transparent'} // Black if selected, else transparent
    // titleStyle={{
    //   color: selected === 'Invite' ? '#fff' : '#000', // White if selected, else black
    // }}
       customsBg={selected === 'Invite' ? theme.$primary : 'transparent'}
    titleStyle={{
      color: selected === 'Invite' ? theme.$onPrimary : theme.$lightText, // text color based on selection
    }}
       buttonStyle={{
      borderWidth: 1,
      borderColor: theme.$lightText,
   
    }}
      />
    </ButtonWithPushBack>
  )}
</View>
<View style={{marginTop:15,flex:1}}>
<CustomGrid images={images} />
</View>
    </SafeAreaView>
  );
};
export default UserProfile;
const style = StyleSheet.create({
  Container: {
    // width: wp('100%'),
    // height: hp('100%')
    flex:1,
    paddingHorizontal:16
  },
})