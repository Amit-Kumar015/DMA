import {
  ActionSheetIOS,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Custombackbtn from '../component/Custombackbtn';
import {Avatar, BottomSheet, ListItem} from 'react-native-elements';
import useTheme from '../hooks/useTheme';
import Custominput from '../component/Custominput';
import ButtonWithPushBack from '../component/Button';
import Icon from '../component/icon';
import SingleSelect from '../component/singleSelect';
import Text from '../component/Text';
import Slide from '../assets/slide';
import PrimaryButton from '../component/prButton';
import { openCamera, openPhotos } from '../utils/imagePicker';
import { CommonActions, useRoute } from '@react-navigation/native';
import AuthStorage from '../utils/authStorage';
import Header from '../component/header';
import ImageResizer from 'react-native-image-resizer';
import AuthStack from '../navigation/AuthStack/authStack';
import Appstack from '../navigation/AppStack/appStack';
import { setUserData } from '../slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function BussinessProfile({navigation}) {
  const {theme} = useTheme();
    const route = useRoute();
    const { userId } = route.params || {};
  const [profilePic, setProfilePic] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [businessType, setBussinessType] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [bussinessName, setBussinessName] = useState('');
  const [aboutBusiness, setAboutBussiness] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [step, setStep] = useState(0);
  const[mobileNumber,setMobileNumber]=useState("")
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);


  const list = [
    {title: 'Take Photo', icon: 'camera', onPress: () => handleCameraOpen()},
    {
      title: 'Choose from Gallery',
      icon: 'view-gallery',
      onPress: () => handleGalleryOpen(),
    },
    {
      title: 'Cancel',
      icon: 'close',
      titleStyle: {color: theme.$danger},
      onPress: () => setIsVisible(false),
    },
  ];

  const handleImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Take Photo', 'Choose from Gallery', 'Cancel'],
          cancelButtonIndex: 2,
        },
        buttonIndex => {
          if (buttonIndex === 0) handleCameraOpen();
          else if (buttonIndex === 1) handleGalleryOpen();
        },
      );
    } else {
      setIsVisible(true);
    }
  };

  const handleCameraOpen = async () => {
    try {
      const image = await openCamera({cropping: true});
      setProfilePic(image.uri);
      setIsVisible(false);
    } catch (error) {
      console.log('Camera Error:', error);
    }
  };

  const handleGalleryOpen = async () => {
    try {
      const image = await openPhotos({cropping: true});
  
      if (image) {
        const resizedImage = await ImageResizer.createResizedImage(
          image.uri,
          800, // Width
          800, // Height
          'JPEG', // Format
          80 // Quality (0-100)
        );
  
        setProfilePic(resizedImage.uri);
      }
  
      setIsVisible(false);
    } catch (error) {
      console.log('Gallery Error:', error);
    }
  };
  const handleCreateProfile = async () => {
    const formData = new FormData();
    formData.append('user', userId);
    formData.append('business_type', businessType);
    formData.append('business_owner', ownerName);
    formData.append('business_name', bussinessName);
    formData.append('business_address', businessLocation);
    formData.append('business_phone', mobileNumber);
    formData.append('business_website', websiteLink);
    formData.append('business_email', businessEmail);
  
    if (profilePic) {
      formData.append('business_logo', {
        uri: profilePic,
        type: 'image/jpeg',
        name: 'business_logo.jpg',
      });
    }
  
    try {
      const accessToken = await AuthStorage.getAccessToken();
      console.log("Access Token:", accessToken);
      console.log("FormData:", formData);
  
      const response = await fetch('http://52.70.194.52/api/core/business-info/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      console.log("Response Status:", response.status);
  
      if (response.status === 201 || response.status === 200) {
        const responseData = await response.json();
        dispatch(setUserData(responseData?.user)); // Store user data
        console.log('Profile Created:', responseData);
        alert('Business Profile Created Successfully');
  
        // Navigate in the same way as login
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{ name: "BottomTab" }],
        //   })
        // );
      
      } else {
        const errorData = await response.json();
        console.log('Error Response:', errorData);
        alert(`Failed to create business profile: ${errorData.message || 'Please try again.'}`);
      }
      console.log("Available Routes:", navigation.getState()?.routes);

      // ✅ Navigate after checking available routes
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "BottomTab" }],
        })
      );
    } catch (error) {
      console.error('API Error:', error);
      alert('Something went wrong! Please check your connection.');
    }
  };
  
  
  return (
    <SafeAreaView style={styles.Container}>
      {/* <GestureHandlerRootView style={{flex: 1}}> */}
      {/* <Custombackbtn onPress={() => (step > 0 ? setStep(step - 1) : navigation.goBack())} /> */}
      <Header showBack={true}    customBackEvent={() =>
              (step > 0 ? setStep(step - 1) : navigation.goBack())
            } />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      {step === 0 && (
        <>
          <View style={styles.avatarWrapper}>
            <Avatar
              size={wp('25%')}
              rounded
              overlayContainerStyle={{
                backgroundColor: theme.$surface,
                borderColor: theme.$secondaryText,
                borderWidth: 1,
              }}
              source={profilePic ? { uri: profilePic } : null}
            />
            <TouchableOpacity onPress={handleImagePicker} style={styles.cameraIcon}>
              <Icon name="camera" size={wp('10%')} color={theme.$secondaryText} />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: hp('2%') }}>
            {/* <Text h4 semiBold>Business Type</Text> */}
            {/* <SingleSelect
              arrayData={[
                { key: 'S', value: 'Sole Proprietorship' },
                { key: 'P', value: 'Partnership' },
                { key: 'C', value: 'Corporation' },
                { key: 'LLC', value: 'LLC' },
              ]}
              uniqueId="businessType"
              selected={businessType}
              selectedCb={(key, val) => setBussinessType(val.value)}
            /> */}
             <Custominput title="BusinessType" value={businessType} onValueChange={setBussinessType} />
          </View>

          <View style={styles.ColRow}>
            <Custominput title="Business Owner" value={ownerName} onValueChange={setOwnerName} />
          </View>

        

          {/* <Custominput
            height="13%"
            title="About Business"
            marginTop={15}
            onValueChange={setAboutBussiness}
            multiline={true}
          /> */}

          <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
            <PrimaryButton
              title="Next"
              icon={<Icon name="arrow-right" type="feather" size={20} color="white" />}
              iconRight
              onPress={() => setStep(1)}
            />
          </ButtonWithPushBack>
        </>
      )}

      {step === 1 && (
        <Slide index={1}>
          <View style={styles.stepContainer}>
          <View style={{ marginTop: hp('3%') }}>
            <Custominput title="Business Name" value={bussinessName} onValueChange={setBussinessName} />
          </View>
            <View style={{marginTop: hp('3%'),}}>
            <Custominput title="Business Location" value={businessLocation} onValueChange={setBusinessLocation} />
            </View>
            <View style={{marginTop: hp('3%'),}}>
            <Custominput title="Mobile Number" value={mobileNumber} onValueChange={setMobileNumber} keyboardType="email-address" />
            </View>
            <View style={{marginTop: hp('3%'),}}>
            <Custominput title="Website Link" value={websiteLink} onValueChange={setWebsiteLink} />
            </View>
            <View style={{marginTop: hp('3%'),}}>
            <Custominput title=" Email id" value={businessEmail} onValueChange={setBusinessEmail} keyboardType="email-address" />
            </View>

          
        <ButtonWithPushBack customContainerStyle={{ marginTop:50 }}>
          <PrimaryButton title="Create Profile" onPress={handleCreateProfile} />
        </ButtonWithPushBack>
          </View>
        </Slide>
      )}
    </ScrollView>
        </KeyboardAvoidingView>

        {/* Bottom Sheet */}
        <View style={{marginTop: 10}}>
          <BottomSheet
            isVisible={isVisible}
            containerStyle={{backgroundColor: theme.$surface}}>
            {list.map(l => (
              <ListItem
                bottomDivider
                key={`${l.title}-${l.icon}`}
                onPress={l.onPress}>
                <Icon name={l.icon} color={theme.$surface} />
                <ListItem.Content>
                  <ListItem.Title style={l.titleStyle}>
                    {l.title}
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </BottomSheet>
        </View>
      {/* </GestureHandlerRootView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: hp('5%'),
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 1,
    left: '59%',
    transform: [{translateX: -wp('3%')}],
    borderRadius: wp('5%'),
    padding: wp('1.5%'),
  },
  ColRow: {
    marginTop: hp('3%'),
  },
  buttonContainer: {
    marginVertical: 50,
    width: '50%',
    alignSelf: 'center', // Centers the button
    
  },
  stepContainer: {
    paddingHorizontal: wp('2%'),
    // borderColor:"white",
    // borderWidth:1,
    // flex:1
    justifyContent:"center",
    paddingTop: hp('5%'),
    //  flex:1
  },
});
