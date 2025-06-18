import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Custombackbtn from '../component/Custombackbtn';
import CustomProfile from '../component/CustomProfile';
import Custominput from '../component/Custominput';
import PrimaryButton from '../component/prButton';
import ButtonWithPushBack from '../component/Button';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Avatar, BottomSheet, ListItem} from 'react-native-elements';
import useTheme from '../hooks/useTheme';
import Icon from '../component/icon';
import SingleSelect from '../component/singleSelect';
import Text from '../component/Text';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {openCamera, openPhotos} from '../utils/imagePicker';
import AuthStorage from '../utils/authStorage';
import {useDispatch, useSelector} from 'react-redux';
import {setUserData} from '../slices/userSlice';
import axios from 'axios';
import {personalInfo} from '../network/action/LoginAction';
import Api from '../network/Api';
import ImageResizer from 'react-native-image-resizer';
import Header from '../component/header';
import Slide from '../assets/slide';
import { setProfile } from '../slices/profileSlice';
import ActivityIndicator from '../assets/activityIndicator';


const CreateProfile = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const route = useRoute();
  const {userId} = route.params || {};
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [dob, setDob] = useState();
  const [gender, setGender] = useState();
  const [location, setLocation] = useState();
  const [bio, setBio] = useState();
  const [profilePic, setProfilePic] = useState();
  const [error, setError] = useState();
  const [isVisible, setIsVisible] = useState();
const [loading, setLoading] = useState(false);
  const genderOptions = [
    { value: 'Male', key: 'Male' },
    { value: 'Female', key: 'Female' },
    { value: 'Other', key: 'Other' },
  ];
  const list = [
    { title: 'Take Photo', icon: 'camera', onPress: () => handleCameraOpen() },
    {
      title: 'Choose from Gallery',
      icon: 'view-gallery',
      onPress: () => handleGalleryOpen(),
    },
    {
      title: 'Cancel',
      icon: 'close',
      titleStyle: { color: theme.$danger },
      onPress: () => setIsVisible(false),
    },
  ];
  
  
  // Function to handle image picker action
  const handleImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Take Photo', 'Choose from Gallery', 'Cancel'],
          cancelButtonIndex: 2,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            handleCameraOpen();
          } else if (buttonIndex === 1) {
            handleGalleryOpen();
          }
        },
      );
    } else {
      setIsVisible(true);
    }
  };

  const handleCameraOpen = async () => {
    try {
      const image = await openCamera({cropping: true});

      if (image) {
        const resizedImage = await ImageResizer.createResizedImage(
          image.uri,
          800, // Width
          800, // Height
          'JPEG', // Format
          80, // Quality (0-100)
        );

        setProfilePic(resizedImage.uri);
      }

      setIsVisible(false);
    } catch (error) {
      console.log('Camera Error:', error);
    }
  };

  // Function to open the Gallery
  // const handleGalleryOpen = async () => {
  //   try {
  //     const image = await openPhotos({cropping: true});
  //     setProfilePic(image.uri);
  //     setIsVisible(false);
  //   } catch (error) {
  //     console.log('Gallery Error:', error);
  //   }
  // };
  const handleGalleryOpen = async () => {
    try {
      const image = await openPhotos({cropping: true});

      if (image) {
        const resizedImage = await ImageResizer.createResizedImage(
          image.uri,
          800, // Width
          800, // Height
          'JPEG', // Format
          80, // Quality (0-100)
        );

        setProfilePic(resizedImage.uri);
      }

      setIsVisible(false);
    } catch (error) {
      console.log('Gallery Error:', error);
    }
  };
//   const handleCreateProfile = async () => {
//     const formData = new FormData();

//     formData.append('user', userId);
//     formData.append('first_name', firstName);
//     formData.append('last_name', lastName);
//  formData.append('gender', gender?.value?.toLowerCase())
//     formData.append('location', location);
//     formData.append('bio', bio);
//     // formData.append('profile_pic', {
//     //   uri: profilePic,
//     //   name: 'profile.jpg',
//     //   type: 'image/jpeg',
//     // });
//     if (profilePic) {
//       const fileName = `profile_${Date.now()}.jpg`; // unique name
//       formData.append('profile_pic', {
//         uri: profilePic,
//         type: 'image/jpeg',
//         name: fileName,
//       });
//     }
//     try {
//       const accessToken = await AuthStorage.getAccessToken();

//       const response = await fetch(
//         'http://52.70.194.52/api/core/personal-info/',
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-Type': 'multipart/form-data',
//           },
//           body: formData,
//         },
//       );
//       if (response.ok) {
//         const responseData = await response.json();
//         dispatch(setProfile(responseData));
//         Alert.alert(' Profile Created Successfully');
//         // setStep(3)
//         navigation.navigate('Appstack');
//       } else {
//         const errorData = await response.json();
//         console.log('Error Response:', errorData);
//         Alert.alert(
//           `Failed to create  profile: ${
//             errorData.message || 'Please try again.'
//           }`,
//         );
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       Alert.alert('Something went wrong! Please check your connection.');
//     }
//   };
const handleCreateProfile = async () => {
    if (!profilePic) {
    Alert.alert('⚠️ Missing Profile Picture', 'Please add a profile picture.');
    return;
  }
  setLoading(true); // Start loading

  const formData = new FormData();
  formData.append('user', userId);
  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  formData.append('gender', gender?.value?.toLowerCase());
  formData.append('location', location);
  formData.append('bio', bio);

  if (profilePic) {
    const fileName = `profile_${Date.now()}.jpg`;
    formData.append('profile_pic', {
      uri: profilePic,
      type: 'image/jpeg',
      name: fileName,
    });
  }

  try {
    const accessToken = await AuthStorage.getAccessToken();

    const response = await fetch('http://52.70.194.52/api/core/personal-info/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const responseData = await response.json();

    if (response.ok) {
      dispatch(setProfile(responseData));
      Alert.alert('✅ Profile Created Successfully');
      navigation.navigate('Appstack');
    } else {
      const message = responseData?.message || 'Please try again later.';
      console.log('Error Response:', responseData);
      Alert.alert('❌ Failed to create profile', message);
    }
  } catch (error) {
    // console.error('API Error:', error);

    let errorMessage = 'Something went wrong. Please try again later.';
    try {
      // Attempt to parse JSON if it's a fetch error with a response body
      if (error?.response?.json) {
        const errorData = await error.response.json();
        errorMessage = errorData?.message || errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }
    } catch (jsonError) {
      // console.error('Error parsing error response:', jsonError);
    }

    Alert.alert('❌ Failed to create profile', errorMessage);
  } finally {
    setLoading(false); // Always stop loading
  }
};


  const handleGenderSelect = (uniqueId, selectedOption) => {
    setGender(selectedOption);  // Updating selected gender
    console.log('Selected Gender:', selectedOption);
  };
  
  const isFormValid = firstName && lastName && gender;
  const isFormValids =  location;
  return (
    <SafeAreaView style={styles.Container}>
      {step === 0 && (
        <>
          <Header showBack={true} />

          <Text h4 bold textAliments="center" style={{color: theme.$lightText}}>
            Add your photo
          </Text>
          {/* <View style={{flex:1,justifyContent:"center"}}> */}
          <View style={styles.avatarWrapper}>
            <Avatar
              size={wp('25%')}
              rounded
              activeOpacity={0.7}
              overlayContainerStyle={{
                backgroundColor: '#D9D9D9',
                borderColor: theme.$secondaryText,
                borderWidth: 1,
              }}
              source={profilePic ? {uri: profilePic} : null}
            />
            <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.cameraIcon}>
              <Icon
                name="camera"
                size={wp('10%')}
                color={theme.$secondaryText}
              />
            </TouchableOpacity>
          </View>
          <ButtonWithPushBack
            customContainerStyle={{
              width: '40%',
              alignSelf: 'center',
              marginTop: 50,
            }}>
            <PrimaryButton
              title="Add profile"
              onPress={() => {
                handleImagePicker();
                setStep(1);
              }}
            />
          </ButtonWithPushBack>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Text
              h5
              bold
              textAliments="center"
              style={{marginTop: 20, color: theme.$lightText}}>
              Skip
            </Text>
          </TouchableOpacity>
          {/* </View> */}
        </>
      )}

      {step === 1 && (
        <Slide index={1}>
          <Header
            showBack={true}
            customBackEvent={() =>
              setStep(step > 0 ? step - 1 : navigation.goBack())
            }
          />
          <View style={{justifyContent: 'center', flexGrow: 1}}>
            <View style={styles.ColRow}>
              <Custominput
                width="44%"
                title="First Name"
                value={firstName}
                onValueChange={setFirstName}
              />
              <Custominput
                width="44%"
                title="Last Name"
                value={lastName}
                onValueChange={setLastName}
              />
            </View>
<View style={{marginTop:10}}>
            <SingleSelect
        arrayData={genderOptions}
        selected={gender}
        selectedCb={handleGenderSelect}
        uniqueId="gender"
        placeholder="Select Gender"
        noDataText="No gender options available"
      />
</View>
            {/* Fixed Next Button */}
         
              <ButtonWithPushBack
              customContainerStyle={{
                width: '50%',
                alignSelf: 'center',
                marginTop: 50,
              }}>
  <PrimaryButton
    title="Next"
    onPress={() => {
      if (isFormValid) {
        setStep(2);
      }
    }}
    disabled={!isFormValid}
  />
  
            </ButtonWithPushBack>
          </View>
        </Slide>
      )}

      {step === 2 && (
        <Slide index={2}>
          <Header
            showBack={true}
            customBackEvent={() =>
              setStep(step > 0 ? step - 1 : navigation.goBack())
            }
          />
          <View style={{justifyContent: 'center', flexGrow: 1}}>
            <Custominput
              width="92%"
              title="Location"
              marginTop={15}
              value={location}
              onValueChange={setLocation}
            />
            <Custominput
               width="92%"
              height="13%"
              title="About You"
              marginTop={15}
              value={bio}
              onValueChange={setBio}
            />

{/* <ButtonWithPushBack customContainerStyle={{ marginVertical: 50 }}>
  <PrimaryButton
    title="Create Profile"
    onPress={() => {
      if (isFormValids) {
        handleCreateProfile();
      }
    }}
    disabled={!isFormValids}
  />
</ButtonWithPushBack> */}
<ButtonWithPushBack customContainerStyle={{ marginVertical: 50 }}>
  <PrimaryButton
    title={loading ? '' : 'Create Profile'}
    onPress={() => {
      if (isFormValids && !loading) {
        handleCreateProfile();
      }
    }}
    disabled={!isFormValids || loading}
  >
    {loading && <ActivityIndicator color="#fff" />}
  </PrimaryButton>
</ButtonWithPushBack>
          </View>
        </Slide>
      )}

<View style={{ marginTop: 10 }}>
    <BottomSheet isVisible={isVisible} containerStyle={{ backgroundColor: theme.$surface }}>
      {list.map(l => (
        <ListItem key={`${l.title}-${l.icon}`} bottomDivider onPress={l.onPress}>
          <Icon name={l.icon} color={theme.$surface} />
          <ListItem.Content>
            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </BottomSheet>
  </View>

    </SafeAreaView>
  );
};

export default CreateProfile;

const styles = StyleSheet.create({
  Container: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp('4%'),
    paddingTop: '2%',
  },
  ColRow: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: hp('3%'),
    // alignSelf:"center",
    // gap:20
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('10%'),
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
});
