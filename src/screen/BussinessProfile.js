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
import React, {useEffect, useState} from 'react';
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
import {openCamera, openPhotos} from '../utils/imagePicker';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import AuthStorage from '../utils/authStorage';
import Header from '../component/header';
import ImageResizer from 'react-native-image-resizer';
import AuthStack from '../navigation/AuthStack/authStack';
import Appstack from '../navigation/AppStack/appStack';
import {useDispatch, useSelector} from 'react-redux';
import {
  setBusinessProfile,
} from '../slices/authSlice';
import axios from 'axios';
import {Alert} from 'react-native';
import ActivityIndicator from '../assets/activityIndicator';
import { setProfile } from '../slices/profileSlice';


export default function BussinessProfile() {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const {userId} = route.params || {};
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
  const [mobileNumber, setMobileNumber] = useState('');
  const [businessOptions, setBusinessOptions] = useState([]);
  // const [businessType, setBusinessType] = useState('');
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('');
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  console.log('selected', selectedMainCategory);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [dob, setDob] = useState();
  const [gender, setGender] = useState();
  const [location, setLocation] = useState();
  const [bio, setBio] = useState();
  const [logo, setLogo] = useState();

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

  // const handleCameraOpen = async () => {
  //   try {
  //     const image = await openCamera({cropping: true});
  //     setProfilePic(image.uri);
  //     setLogo(image.uri);
  //     setIsVisible(false);
  //   } catch (error) {
  //     console.log('Camera Error:', error);
  //   }
  // };
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
        setLogo(resizedImage.uri);
      }

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
          'JPEG', // Formaturi
          80, // Quality (0-100)
        );

        setProfilePic(resizedImage.uri);
        setLogo(resizedImage.uri);
      }

      setIsVisible(false);
    } catch (error) {
      console.log('Gallery Error:', error);
    }
  };
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const accessToken = await AuthStorage.getAccessToken();
        const response = await axios.get(
          'http://52.70.194.52/api/core/categories/',
          {
            // headers: {
            //   Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NzgxMTg0LCJpYXQiOjE3NDQxNzYzODQsImp0aSI6ImZkNDRmMDNlZjVkYzQ1MTc4ZGI4NjFkZDQ2MGUxMzY2IiwidXNlcl9pZCI6ImEzMWY3NzZlLWVmYWUtNGIyOS1hZDIzLTZjMDU4MDhiMWIwNCJ9.0YYA3n_B_jwU47qFETlIUOSAPPIguD5IArqKI5DVX_w',
            // },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('API response:', response.data); // ✅ See the structure

        const formatted = response.data.map(item => ({
          key: item.id,
          value: item.name,
        }));

        setMainCategories(formatted);
      } catch (error) {
        console.error('Failed to fetch business types:', error);
      }
    };
    fetchBusinessTypes();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedMainCategory || !selectedMainCategory.key) return; // ✅ Corrected condition

      try {
        const accessToken = await AuthStorage.getAccessToken();
        const categoryId = selectedMainCategory.key; // ✅ Corrected ID access
        console.log('Fetching subcategories for category ID:', categoryId);

        const res = await axios.get(
          `http://52.70.194.52/api/core/categories/${categoryId}/subcategories/`,
          {
            // headers: {
            //   Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NzgxMTg0LCJpYXQiOjE3NDQxNzYzODQsImp0aSI6ImZkNDRmMDNlZjVkYzQ1MTc4ZGI4NjFkZDQ2MGUxMzY2IiwidXNlcl9pZCI6ImEzMWY3NzZlLWVmYWUtNGIyOS1hZDIzLTZjMDU4MDhiMWIwNCJ9.0YYA3n_B_jwU47qFETlIUOSAPPIguD5IArqKI5DVX_w',
            // },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Subcategory API response:', res.data);

        if (res?.data && Array.isArray(res.data)) {
          const formatted = res.data.map(item => ({
            key: item.id,
            value: item.name,
          }));
          setSubCategories(formatted);
        } else {
          console.warn('Subcategories data is not an array:', res.data);
          setSubCategories([]);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubCategories();
  }, [selectedMainCategory]);

  useEffect(() => {
    const fetchSubSubCategories = async () => {
      if (!selectedSubCategory || !selectedSubCategory.key) return;

      try {
        const accessToken = await AuthStorage.getAccessToken();
        const subCategoryId = selectedSubCategory.key;
        console.log(
          'Fetching sub-subcategories for subcategory ID:',
          subCategoryId,
        );

        const res = await axios.get(
          `http://52.70.194.52/api/core/categories/${subCategoryId}/subsubcategories/`,
          {
            // headers: {
            //   Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NzgxMTg0LCJpYXQiOjE3NDQxNzYzODQsImp0aSI6ImZkNDRmMDNlZjVkYzQ1MTc4ZGI4NjFkZDQ2MGUxMzY2IiwidXNlcl9pZCI6ImEzMWY3NzZlLWVmYWUtNGIyOS1hZDIzLTZjMDU4MDhiMWIwNCJ9.0YYA3n_B_jwU47qFETlIUOSAPPIguD5IArqKI5DVX_w',
            // },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Sub-subcategory API response:', res.data);

        if (res?.data && Array.isArray(res.data)) {
          const formatted = res.data.map(item => ({
            key: item.id,
            value: item.name,
          }));
          setSubSubCategories(formatted);
        } else {
          console.warn('Sub-subcategories data is not an array:', res.data);
          setSubSubCategories([]);
        }
      } catch (error) {
        console.error('Error fetching sub-subcategories:', error);
      }
    };

    fetchSubSubCategories();
  }, [selectedSubCategory]);

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

      if (response.ok) {
        const responseData = await response.json();
        console.log('🚀 Response Data:', responseData);

         dispatch(setProfile(responseData));
        Alert.alert(' Profile Created Successfully');
        setStep(3);
        // navigation.navigate("Appstack")
      } else {
        const errorData = await response.json();
        console.log('Error Response:', errorData);
        Alert.alert(
          `Failed to create  profile: ${
            errorData.message || 'Please try again.'
          }`,
        );
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Something went wrong! Please check your connection.');
    }
  };
  const handleCreateProfiles = async () => {
    const formData = new FormData();

    // Log field values to verify
    console.log({
      userId,
      ownerName,
      bussinessName,
      businessLocation,
      mobileNumber,
      websiteLink,
      businessEmail,
      selectedMainCategory,
      selectedSubCategory,
      selectedSubSubCategory,
      logo,
    });

    formData.append('user', userId);
    formData.append('business_owner', ownerName);
    formData.append('business_name', bussinessName);
    formData.append('business_address', businessLocation);
    formData.append('business_phone', mobileNumber);
    formData.append('business_website', websiteLink);
    formData.append('business_email', businessEmail);

    // Category IDs
    formData.append('main_category', selectedMainCategory.key);
    formData.append('sub_category', selectedSubCategory.key);
    formData.append('sub_sub_category', selectedSubSubCategory.key);

    // Business logo
    if (logo) {
      formData.append('business_logo', {
        uri: logo,
        type: 'image/jpeg',
        name: 'business_logo.jpg',
      });
    }

    // Optional: Print form data
    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }

    try {
      const accessToken = await AuthStorage.getAccessToken();
      console.log('Access Token:', accessToken);

      if (!accessToken) {
        Alert.alert('Access token not found. Please login again.');
        return;
      }

      const response = await fetch(
        'http://52.70.194.52/api/core/business-info/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // DO NOT SET 'Content-Type' manually for FormData
          },
          body: formData,
        },
      );

      console.log('Response Status:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('🚀 Response Data:', responseData);
        dispatch(setBusinessProfile(responseData));
        console.log('✅ Business profile set in Redux');
        Alert.alert('Business Profile Created Successfully');
        navigation.navigate('Appstack');
      } else {
        const errorData = await response.json();
        console.log('❌ Error Response:', errorData);

        const errorMessages = [];
        for (const [key, value] of Object.entries(errorData)) {
          if (Array.isArray(value)) {
            errorMessages.push(...value);
          } else {
            errorMessages.push(value);
          }
        }

        Alert.alert(
          `Failed to create business profile: ${errorMessages.join(', ')}`,
        );
      }
    } catch (error) {
      console.error('⚠️ API Error:', error);
      Alert.alert('Something went wrong! Please check your connection.');
    }
  };

  return (
    <SafeAreaView style={styles.Container}>
      {/* <Header showBack={true} /> */}

      {step === 0 && (
        <>
          <Header
            showBack={true}
            customBackEvent={() =>
              setStep(step > 0 ? step - 1 : navigation.goBack())
            }
          />
          <Text h4 bold textAliments="center" style={{color: theme.$lightText}}>
            Add your photo
          </Text>

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
          <Text h4 bold textAliments="center" style={{color: theme.$lightText}}>
            profile pic
          </Text>
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
            <View style={styles.Row}>
              <Custominput
                width="44%"
                title="First Name*"
                value={firstName}
                onValueChange={setFirstName}
              />
              <Custominput
                width="44%"
                title="Last Name*"
                value={lastName}
                onValueChange={setLastName}
              />
            </View>

            <Custominput
              width="92%"
              title="Gender*"
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
              <PrimaryButton
                title="Next"
                onPress={() => setStep(2)}
                loadingProps={<ActivityIndicator />}
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
              title="Location*"
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

      {step === 3 && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.avatarWrapper}>
              <Avatar
                size={wp('25%')}
                rounded
                overlayContainerStyle={{
                  backgroundColor: theme.$surface,
                  borderColor: theme.$secondaryText,
                  borderWidth: 1,
                }}
                source={logo ? {uri: logo} : null}
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

            <Text h4 semiBold>
              Main Category*
            </Text>
            <SingleSelect
              arrayData={mainCategories}
              uniqueId="mainCategory"
              selected={selectedMainCategory}
              placeholder="Select Business Category"
              noDataText="No data found"
              search={false}
              selectedCb={(key, val) => {
                setSelectedMainCategory({key: val.key, value: val.value});
                setSelectedSubCategory('');
              }}
            />

            <View style={{marginTop: hp('2%')}}>
              <Text h4 semiBold>
                Sub Category*
              </Text>
              <SingleSelect
                arrayData={subCategories}
                uniqueId="subCategory"
                selected={selectedSubCategory}
                placeholder="Select Sub Category"
                noDataText="No data found"
                search={false}
                selectedCb={(key, val) => {
                  setSelectedSubCategory({key: val.key, value: val.value});
                  setSelectedSubSubCategory('');
                }}
              />
            </View>

            <View style={{marginTop: hp('2%')}}>
              <Text h4 semiBold>
                Sub Sub-Category*
              </Text>
              <SingleSelect
                arrayData={subSubCategories}
                uniqueId="subSubCategory"
                selected={selectedSubSubCategory}
                placeholder="Select Sub Sub Category"
                noDataText="No data found"
                search={false}
                selectedCb={(key, val) =>
                  setSelectedSubSubCategory({key: val.key, value: val.value})
                }
              />
            </View>

            <View style={styles.ColRow}>
              <Custominput
                title="Business Owner*"
                value={ownerName}
                onValueChange={setOwnerName}
              />
            </View>

            <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
              <PrimaryButton
                title="Next"
                icon={
                  <Icon
                    name="arrow-right"
                    type="feather"
                    size={20}
                    color="white"
                  />
                }
                iconRight
                onPress={() => setStep(4)}
              />
            </ButtonWithPushBack>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      {step === 4 && (
        <Slide index={1}>
          <Header
            showBack={true}
            customBackEvent={() =>
              setStep(step > 0 ? step - 1 : navigation.goBack())
            }
          />
          <View style={styles.stepContainer}>
            <View style={{marginTop: hp('3%')}}>
              <Custominput
                title="Business Name*"
                value={bussinessName}
                onValueChange={setBussinessName}
              />
            </View>
            <View style={{marginTop: hp('3%')}}>
              <Custominput
                title="Business Location*"
                value={businessLocation}
                onValueChange={setBusinessLocation}
              />
            </View>
            <View style={{marginTop: hp('3%')}}>
              <Custominput
                title="Mobile NumberP"
                value={mobileNumber}
                onValueChange={setMobileNumber}
                keyboardType="email-address"
              />
            </View>
            <View style={{marginTop: hp('3%')}}>
              <Custominput
                title="Website LinkP"
                value={websiteLink}
                onValueChange={setWebsiteLink}
              />
            </View>
            <View style={{marginTop: hp('3%')}}>
              <Custominput
                title=" Email idP"
                value={businessEmail}
                onValueChange={setBusinessEmail}
                keyboardType="email-address"
              />
            </View>

            <ButtonWithPushBack customContainerStyle={{marginTop: 50}}>
              <PrimaryButton
                title="Create Profile"
                onPress={handleCreateProfiles}
              />
            </ButtonWithPushBack>
          </View>
        </Slide>
      )}

      {/* Bottom Sheet */}
      <View style={{marginTop: 10}}>
        <BottomSheet
          isVisible={isVisible}
          containerStyle={{backgroundColor: theme.$surface}}>
          {list.map(l => (
            <ListItem
              key={`${l.title}-${l.icon}`}
              bottomDivider
              onPress={l.onPress}>
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
    // marginTop: hp('2%'),
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
    justifyContent: 'center',
    paddingTop: hp('5%'),
    //  flex:1
  },
  Row: {
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
});
