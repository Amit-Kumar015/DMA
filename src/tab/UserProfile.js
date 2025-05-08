import { useFocusEffect } from '@react-navigation/native';
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

const UserProfile = ({ route }) => {
  const { userType, userId } = route.params;
  const {theme} = useTheme();
  const [storeProfile, setStoredProfile] = useState(null); // Fix: useState(null), not useState()
  console.log("storeProfile", storeProfile);
  console.log("userType",userType)
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
  return (
    <SafeAreaView style={style.Container}>
    {/* Header */}
    <Header
  showBack={true}
  title={ storeProfile?.username} 
      rightComponent={
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity onPress={() => navigation.navigate('uploadreels')}>
            <AntDesign name="plussquareo" size={23} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
            <Icon name="bell" size={23} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Icon name="menu" size={23} color={'black'} />
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
    <Text h4 semiBold numberOfLines={1}>0</Text>
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
      Alert.alert("coming soon");
    }}
    customsBg={selected === 'edit' ? '#000' : '#D3D3D3'} // Black if selected
    titleStyle={{
      color: selected === 'edit' ? '#fff' : '#333', // White text if selected
    }}
  />
</ButtonWithPushBack>

<ButtonWithPushBack customContainerStyle={{ flex:1 }}>
  <PrimaryButton
    title="Message"
    onPress={() => {
     Alert.alert("coming soon")
    }}
    customsBg={selected === 'share' ? '#000' : '#D3D3D3'}
    titleStyle={{
      color: selected === 'share' ? '#fff' : '#333',
    }}
  />
</ButtonWithPushBack>
{userType === 'business' && (
    <ButtonWithPushBack customContainerStyle={{ flex: 1 }}>
      <PrimaryButton
        title="Invite"
        onPress={() => Alert.alert("coming soon")}
        customsBg={'#D3D3D3'}
        titleStyle={{ color: '#333' }}
      />
    </ButtonWithPushBack>
  )}
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
    backgroundColor:"#FFFFFF",
    paddingHorizontal:16
  },
})