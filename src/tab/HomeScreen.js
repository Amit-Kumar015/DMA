import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import Header from '../component/header';
import Icon from '../component/icon';
import useTheme from '../hooks/useTheme'; // Ensure you have this hook for theme
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Avatar } from 'react-native-elements';
import { TOP_SPACE_ANDROID } from '../utils/dimensions';
import Text from '../component/Text';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const { theme } = useTheme(); // Get theme colors
  const [profilePic, setProfilePic] = useState(null); 
  const userData = useSelector(state => state.user.userData);
console.log("userssss",userData)
  return (
    <SafeAreaView style={style.Container}>
      <Header 
        showBack={true} 
        title="Dashboard" 
        rightComponent={
          <View style={{ flexDirection: 'row', gap: 15 }}>
            {/* First Icon */}
            <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
              <Icon name="bell" size={23} color={theme.$backGround} />
            </TouchableOpacity>
            
            {/* Second Icon */}
            <TouchableOpacity onPress={() => alert('Settings Icon Clicked!')}>
              <Icon name="menu" size={23} color={theme.$backGround} />
            </TouchableOpacity>
          </View>
        } 
      />

      {/* Profile Section */}
      <View style={{
        justifyContent: "center",
        alignItems: "center",
        // ...(Platform.OS === 'android' ? TOP_SPACE_ANDROID : {}),
      }}>
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: theme.$surface,
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={profilePic ? { uri: profilePic } : require('../assets/icon/profiles.png')} // Default image from assets
        />
        <Text h3 semiBold style={{ marginTop: 4 }}>Yuraj Dance Academy</Text>
        <Text h4 thin style={{ color: theme.$lightText, marginTop: 6 }}>Dance Teacher</Text>
        <Text h4 thin style={{ color: theme.$lightText, marginTop: 6 }}>10 yeaers of Dance experience</Text>
        <Text h4 thin style={{ color: theme.$lightText, marginTop: 6 }}>World Class Dancer</Text>
        <Text h4 thin style={{ color: theme.$lightText, marginTop: 6 }}>Works as world best dance accademy</Text>
        <Text h4 thin style={{ marginTop: 8 }}>123 posts</Text>

        {/* Edit Profile Button */}
        <TouchableOpacity style={style.editProfileButton} onPress={() => alert('Edit Profile Clicked!')}>
          <Text h4 bold >Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* <ButtonWithPushBack customContainerStyle={{ marginVertical: 20 }}>
          <PrimaryButton 
               title="Add image/reels"
               icon={<Icon name="camera" type="feather" size={25} color="white"/>}
              //  iconRight
          />
        </ButtonWithPushBack> */}
        <ButtonWithPushBack customContainerStyle={style.addImageButton} >
  <PrimaryButton 
    title="Add Image/Reels"
    onPress={() => alert('Add Image/Reels Clicked!')}
    icon={<Icon name="camera" type="feather" size={25} color="white" style={{ marginRight: 8 }}/>}
    //  iconRight
  />
</ButtonWithPushBack>
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
    marginTop: 12, // Spacing below "123 posts"
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E847C5",
    borderRadius: 20, // Rounded corners
  },

    addImageButton: {
      // paddingVertical: 8, // Reduces height
      // paddingHorizontal: 14, // Reduces width
      flexDirection: 'row', // Ensures icon & text are aligned
      alignItems: 'center', 
      justifyContent: 'center',
      marginTop: hp('10%'),
   
    },

  
});
