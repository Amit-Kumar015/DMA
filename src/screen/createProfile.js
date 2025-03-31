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

const CreateProfile = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const route = useRoute();
  const {userId} = route.params || {};
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const [step, setStep] = useState(0);
  console.log("userrr",userData)
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [dob, setDob] = useState();
  const [gender, setGender] = useState();
  const [location, setLocation] = useState();
  const [bio, setBio] = useState();
  const [profilePic, setProfilePic] = useState();
  const [error, setError] = useState();
  const [isVisible, setIsVisible] = useState();

  // Options for the bottom sheet
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
          80 // Quality (0-100)
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
          80 // Quality (0-100)
        );
  
        setProfilePic(resizedImage.uri);
      }
  
      setIsVisible(false);
    } catch (error) {
      console.log('Gallery Error:', error);
    }
  };
  

  // const handleCreateProfile = async () => {
  //   setError('');

  //   if (!firstName || !lastName || !gender || !location || !bio || !profilePic) {
  //     setError('All fields are required');
  //     return;
  //   }

  //   try {
  //     const token = await AuthStorage.getAccessToken(); // Fetch access token
  //     const userIdFromState = userData?.id; // Get user ID from Redux state
  //           const formData = new FormData();
  //           formData.append('user', userId);
  //           formData.append('first_name', firstName.trim());
  //           formData.append('last_name', lastName.trim());
  //           formData.append('gender', gender);
  //           formData.append('location', location.trim());
  //           formData.append('bio', bio);
  //           formData.append('profile_pic', {
  //             uri: profilePic,
  //             name: 'profile.jpg',
  //             type: 'image/jpeg',
  //           });

  //     console.log('Sending FormData:', formData);
  //     console.log('User ID:', userId);
  //     console.log('Access Token:', token);

  //     const response = await personalInfo(formData, token); // Pass token to API

  //     console.log('Profile Response:', response.data);

  //     if (response.status===200) {
  //       console.log('Profile Created Successfully:', response);
  //       // dispatch(setUserData(response?.user)); // Save user data in Redux
  //       navigation.navigate('login');
  //     } else {
  //       setError(response?.message || 'Failed to create profile.');
  //     }
  //   } catch (error) {
  //     console.error('Profile Creation Error:', error.response?.data?.error || error.response?.data?.message || error.message);

  //     if (error.response) {
  //       setError(error.response?.data?.error || error.response?.data?.message || 'Something went wrong.');
  //     } else {
  //       setError('Network error. Please check your connection.');
  //     }
  //   }
  // };

  // const handleCreateProfile = async () => {
  //   setError('');
  //   // Validate required fields
  //   if (
  //     !firstName ||
  //     !lastName ||
  //     !gender ||
  //     !location ||
  //     !bio ||
  //     !profilePic
  //   ) {
  //     setError('All fields are required');
  //     return;
  //   }
  //   try {
  //     const formData = {};
  //     formData.user = userId;
  //     formData.first_name = firstName.trim();
  //     formData.last_name = lastName.trim();
  //     formData.gender = gender;
  //     formData.location = location.trim();
  //     formData.bio = bio;
  //     formData.profile_pic = {
  //       uri: profilePic,
  //       name: 'profile.jpg',
  //       type: 'image/jpeg',
  //     };
  //     // Get authentication token
  //     const accessToken = await AuthStorage.getAccessToken();

  //     const response = await Api.POSTFORM('core/personal-info/', formData, {
  //       Authorization: `Bearer ${accessToken}`,
  //     });

  //     // const response = await axios.post(
  //     //   'http://52.70.194.52/api/core/personal-info/',
  //     //   formData,
  //     //   {
  //     //     headers: {
  //     //       Authorization: `Bearer ${accessToken}`,
  //     //       'Content-Type': 'multipart/form-data',
  //     //     },
  //     //   }
  //     // );
  //   } catch (err) {
  //     if (err.response) {
  //       const {status, data} = err.response;
  //       if (status === 400 && data?.err === 'Personal Info already exists') {
  //         setError(
  //           'Profile already exists. Please update your profile instead.',
  //         );
  //       } else if (status === 401) {
  //         setError('Session expired. Please log in again.');
  //       } else {
  //         setError('Something went wrong! Please try again.');
  //       }
  //     } else {
  //       setError('Network error. Please check your internet connection.');
  //     }
  //   }
  // };

  // const handleCreateProfile = async () => {
  //   setError('');

  //   // Validate required fields
  //   if (!firstName || !lastName || !gender || !location || !bio || !profilePic) {
  //     setError('All fields are required');
  //     return;
  //   }

  //   try {
  //       const formData = {};
  //       formData.user = userId;
  //       formData.first_name = firstName.trim();
  //       formData.last_name = lastName.trim();
  //       formData.gender = gender;
  //       formData.location = location.trim();
  //       formData.bio = bio;
  //       formData.profile_pic = {
  //         uri: profilePic,
  //         name: 'profile.jpg',
  //         type: 'image/jpeg',
  //       };

  //     // Get authentication token
  //     const accessToken = await AuthStorage.getAccessToken();
  //     console.log('Token:', accessToken);
  //     console.log('FormData:', formData);

  //     // Make API request
  //     const response = await axios.post(
  //       'http://52.70.194.52/api/core/personal-info/',
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     console.log('Profile created successfully:', response);

  //     if (response.status === 200 || response.status === 201) {
  //       Alert.alert('Success', 'Profile created successfully!', [
  //         { text: 'OK', onPress: () => navigation.navigate('login') },
  //       ]);
  //     }
  //   } catch (error) {
  //     console.log('Profile Creation Error:', error);

  //     if (error.response) {
  //       const { status, data } = error.response;
  //       console.log('Error Response:', data);

  //       switch (status) {
  //         case 400:
  //           setError(data?.error || 'Invalid data. Please check your inputs.');
  //           break;
  //         case 401:
  //           setError('Session expired. Please log in again.');
  //           break;
  //         case 500:
  //           setError('Server error. Please try again later.');
  //           break;
  //         default:
  //           setError('Something went wrong! Please try again.');
  //       }
  //     } else {
  //       setError('Network error. Please check your internet connection.');
  //     }
  //   }
  // };

  const handleCreateProfile = async () => {
    const formData = new FormData();

    formData.append('user', userId);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('gender', gender);
    formData.append('location', location);
    formData.append('bio', bio);
    // formData.append('profile_pic', {
    //   uri: profilePic,
    //   name: 'profile.jpg',
    //   type: 'image/jpeg',
    // });
    if (profilePic) {
      formData.append('profile_pic', {
        uri: profilePic,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }
    try {
      const accessToken = await AuthStorage.getAccessToken();
      // const accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQyNzEzMjg5LCJpYXQiOjE3NDIxMDg0ODksImp0aSI6IjhhNzJmMzIwMmNlMjQxN2M4MTZhMzdmZTQ4M2Q3M2E1IiwidXNlcl9pZCI6IjJjZDJiYjViLTU1NzAtNDk3My04YjMzLWQ4Yzc1YTY2MjEzNSJ9.IsmmJBg4NrBFdmdZ6oehtotLMIIkrcdhe6-chI4wLbo"
      console.log('Access Token:', accessToken);
      console.log('FormData:', formData);

      const response = await fetch(
        'http://52.70.194.52/api/core/personal-info/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      console.log('Response Status:', response.status); // ✅ Console the status

      if (response.status === 201 || response.status === 200) {
        const responseData = await response.json();
        console.log('Profile Created:', responseData);
        Alert.alert(' Profile Created Successfully');
        navigation.navigate("HomeScreen")
      } else {
        const errorData = await response.json();
        console.log('Error Response:', errorData);
        alert(
          `Failed to create business profile: ${
            errorData.message || 'Please try again.'
          }`,
        );
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Something went wrong! Please check your connection.');
    }
  };
  return (
    <SafeAreaView style={styles.Container}>
      {step === 0 && (
        <>
          <Header showBack={true} />

          <Text h4 bold textAliments="center" style={{color:theme.$lightText}}>
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
            <Text h5 bold textAliments="center" style={{marginTop:20,color:theme.$lightText}}>
              Skip
            </Text>
          </TouchableOpacity>
          {/* </View> */}
        </>
      )}

      {step === 1 && (
        <Slide index={1}>
          <Header showBack={true}    customBackEvent={() =>
              setStep(step > 0 ? step - 1 : navigation.goBack())
            } />
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

            <Custominput
              width="92%"
              title="Gender"
              marginTop={15}
              value={gender}
              onValueChange={setGender}
            />

            {/* Fixed Next Button */}
            <ButtonWithPushBack
              customContainerStyle={{
                width: '50%',
                alignSelf: 'center',
                marginTop: 50,
              }}>
              <PrimaryButton title="Next" onPress={() => setStep(2)} />
            </ButtonWithPushBack>
          </View>
        </Slide>
      )}

      {step === 2 && (
        <Slide index={2}>
            <Header showBack={true}    customBackEvent={() =>
              setStep(step > 0 ? step - 1 : navigation.goBack())
            } />
          <View style={{justifyContent:"center", flexGrow: 1}}>
            <Custominput
              width="92%"
              title="Location"
              marginTop={15}
              value={location}
              onValueChange={setLocation}
            />
            <Custominput
              height="13%"
              title="About You"
              marginTop={15}
              value={bio}
              onValueChange={setBio}
            />

            <ButtonWithPushBack customContainerStyle={{marginVertical: 50}}>
              <PrimaryButton
                title="Create Profile"
                onPress={handleCreateProfile}
              />
            </ButtonWithPushBack>
          </View>
        </Slide>
      )}

      <BottomSheet
        isVisible={isVisible}
        containerStyle={{backgroundColor: theme.$surface}}>
        {list.map(l => (
          <ListItem bottomDivider key={l.title} onPress={l.onPress}>
            <Icon name={l.icon} color={theme.$surface} />
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </BottomSheet>
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
