import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";
import Header from "../component/header";
import { openCamera, openPhotos } from "../utils/imagePicker";
import { Avatar, BottomSheet, ListItem } from "react-native-elements";
import ImageResizer from "react-native-image-resizer";
import useTheme from "../hooks/useTheme";
import Icon from "../component/icon";

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthStorage from "../utils/authStorage";
import axios from "axios";
import ActivityIndicator from "../assets/activityIndicator";
import Text from "../component/Text";

const EditProfile = () => {
      const navigation = useNavigation();
    const userData = useSelector(state => state.user.userData);
    console.log('userData', userData);
    const profileData = useSelector((state) => state.profile.Profile);
    console.log('🙌 Profile Data:', profileData);
    const personalProfile = useSelector(state => state.auth.personalProfile);
    console.log('persinaldata', personalProfile);
    const [isVisible, setIsVisible] = useState(false);
      const [userId, setUserId] = useState('');
      console.log("userId",userId)
        const [storedProfile, setStoredProfile] = useState(null);
        console.log("storeProfilesss",storedProfile)
    const { theme } = useTheme();
    const [profilePic, setProfilePic] = useState();
    const [loading, setLoading] = useState(false);

    const [profileId, setProfileId] = useState(null); 
    console.log("profile",profileId)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        location: '',
        description: '',
    });
    useEffect(() => {
        if (storedProfile) {
            setFormData({
                firstName: storedProfile.first_name || '',
                lastName: storedProfile.last_name || '',
                phone: storedProfile.mobile_number || '',
                email: storedProfile.email || '',
                location: storedProfile.personalinfo?.location || '',
                description: storedProfile.personalinfo?.bio || '',
            });
    
            setProfilePic(storedProfile.profile_pic || '');
        }
    }, [storedProfile]);

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

 

    const handleCancel = () => {
        setFormData({
          firstName: storedProfile.first_name || '',
          lastName: storedProfile.last_name || '',
          phone: storedProfile.mobile_number || '',
          email: storedProfile.email || '',
          location: storedProfile.personalinfo?.location || '',
          description: storedProfile.personalinfo?.bio || '',
        });
        navigation.navigate('ProfileScreen');
      };
      

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
                }
            );
        } else {
            setIsVisible(true);
        }
    };

    const handleCameraOpen = async () => {
        try {
            const image = await openCamera({ cropping: true });
            if (image) {
                const resizedImage = await ImageResizer.createResizedImage(
                    image.uri,
                    800,
                    800,
                    'JPEG',
                    80
                );
                setProfilePic(resizedImage.uri);
            }
            setIsVisible(false);
        } catch (error) {
            console.log('Camera Error:', error);
        }
    };

    const handleGalleryOpen = async () => {
        try {
            const image = await openPhotos({ cropping: true });
            if (image) {
                const resizedImage = await ImageResizer.createResizedImage(
                    image.uri,
                    800,
                    800,
                    'JPEG',
                    80
                );
                setProfilePic(resizedImage.uri);
            }
            setIsVisible(false);
        } catch (error) {
            console.log('Gallery Error:', error);
        }
    };

    useEffect(() => {
        const getProfileId = async () => {
          try {
            const storedProfileId = await AsyncStorage.getItem('profile_id');
            if (storedProfileId) {
              setProfileId(storedProfileId); // Set the retrieved profile ID to state
              console.log('✅ Retrieved Profile ID:', storedProfileId);
            } else {
              console.log('❌ Profile ID not found in AsyncStorage');
            }
          } catch (error) {
            console.error('❌ Error retrieving profile ID:', error);
          }
        };
        getProfileId();
      }, []);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
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
                }
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
        }, [userId, profileData])
      );

      // const updateProfile = async () => {
      //   try {
      //     setLoading(true);
      //     const accessToken = await AuthStorage.getAccessToken();
      //     const formDataToSend = new FormData();
      //     formDataToSend.append('first_name', formData.firstName);
      //     formDataToSend.append('last_name', formData.lastName);
      //     formDataToSend.append('mobile_number', formData.phone);
      //     formDataToSend.append('email', formData.email);
      //     formDataToSend.append('personalinfo', JSON.stringify({
      //       location: formData.location,
      //       bio: formData.description,
      //     }));
      //     if (profilePic) {
      //       formDataToSend.append('profile_pic', {
      //         uri: profilePic,
      //         type: 'image/jpeg',
      //         name: 'profile_pic.jpg',
      //       });
      //     }
      //     const response = await axios.patch(
      //       `http://52.70.194.52/api/core/personal-info/${profileId}/`,
      //       formDataToSend,
      //       {
      //         headers: {
      //           Authorization: `Bearer ${accessToken}`,
      //           'Content-Type': 'multipart/form-data',
      //         },
      //       }
      //     );
      //     setLoading(false);
      //     Alert.alert('Success', 'Profile updated successfully');
      //     navigation.navigate('ProfileScreen');
      //   } catch (error) {
      //     setLoading(false);
      //     console.error(error);
      //   }
      // };
      const updateProfile = async () => {
        try {
          // ✅ Step 1: Check if profileId is available
          if (!storedProfile.personalinfo.id) {
            Alert.alert('Error', 'Profile ID not found. Please login again.');
            return; // 🔥 Stop function execution
          }
      
          setLoading(true);
          const accessToken = await AuthStorage.getAccessToken();
          const formDataToSend = new FormData();
          formDataToSend.append('first_name', formData.firstName);
          formDataToSend.append('last_name', formData.lastName);
          formDataToSend.append('mobile_number', formData.phone);
          formDataToSend.append('email', formData.email);
          formDataToSend.append('personalinfo', JSON.stringify({
            location: formData.location,
            bio: formData.description,
          }));
      
          // if (profilePic) {
          //   formDataToSend.append('profile_pic', {
          //     uri: profilePic,
          
          //     name: 'profile_pic.jpg',
          //   });
          // }
          if (profilePic) {
            const newImage = {
              uri: profilePic,
              type: 'image/jpeg',
              name: profilePic.split('/').pop(),
            };
            formDataToSend.append('profile_pic', newImage); // or use 'profile_picture' if that's the key your API expects
          }
      
          const response = await axios.patch(
            `http://52.70.194.52/api/core/personal-info/${storedProfile.personalinfo.id}/`,
            formDataToSend,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
      
          setLoading(false);
          Alert.alert('Success', 'Profile updated successfully');
          navigation.navigate('ProfileScreen');
        } catch (error) {
          setLoading(false);
          console.error(error);
          Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
      };
      
      
    // const updateProfile = async () => {
    //     try {
    //       const accessToken = await AuthStorage.getAccessToken();
    //       const formDataToSend = new FormData();
    //       formDataToSend.append('first_name', formData.firstName);
    //       formDataToSend.append('last_name', formData.lastName);
    //       formDataToSend.append('mobile_number', formData.phone);
    //       formDataToSend.append('email', formData.email);
    //       formDataToSend.append('personalinfo', JSON.stringify({
    //         location: formData.location,
    //         bio: formData.description,
    //       }));
    //       if (profilePic) {
    //         formDataToSend.append('profile_pic', {
    //           uri: profilePic,
    //           type: 'image/jpeg',
    //           name: 'profile_pic.jpg',
    //         });
    //       }
    //       const response = await axios.patch(
    //         `http://52.70.194.52/api/core/personal-info/${profileId}/`,
    //         formDataToSend,
    //         {
    //           headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //             'Content-Type': 'multipart/form-data',
    //           },
    //         }
    //       );
    //       console.log(response.data);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   };

      
      
    return (
          <SafeAreaView
                 style={[
                   styles.container,
                   {backgroundColor: theme.$background}, // ✅ dynamic background color
                 ]}>
            <Header title="Edit Profile" showBack={true} />
            <ScrollView showsVerticalScrollIndicator={false}>
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
                        source={profilePic ? { uri: profilePic } : null}
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

                <View style={styles.inputRow}>
                    <View style={styles.inputGrouphalf}>
                        <Text  h5 bold style={styles.label}>First Name</Text>
                        <TextInput
                            placeholder="Enter first name"
                            style={styles.inputBoxHalf}
                            value={formData.firstName}
                            onChangeText={(text) => handleInputChange('firstName', text)}
                        />
                    </View>
                    <View style={styles.inputGrouphalf}>
                        <Text h5 bold style={styles.label}>Last Name</Text>
                        <TextInput
                            placeholder="Enter last name"
                            style={styles.inputBoxHalf}
                            value={formData.lastName}
                            onChangeText={(text) => handleInputChange('lastName', text)}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text h5 bold style={styles.label}>Phone</Text>
                    <TextInput
                        placeholder="Enter phone number"
                        style={styles.inputBox}
                        value={formData.phone}
                        onChangeText={(text) => handleInputChange('phone', text)}
                        keyboardType="phone-pad"
                        editable={false}
                        
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text h5 bold style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="Enter email"
                        style={styles.inputBox}
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        keyboardType="email-address"
                        editable={false}

                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text h5 bold style={styles.label}>Location</Text>
                    <TextInput
                        placeholder="Enter location"
                        style={styles.inputBox}
                        value={formData.location}
                        onChangeText={(text) => handleInputChange('location', text)}
                        editable={false}

                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text h5 bold style={styles.label}>Description</Text>
                    <TextInput
                        placeholder="Tell something about you"
                        style={styles.inputBox}
                        value={formData.description}
                        onChangeText={(text) => handleInputChange('description', text)}
                        editable={false}

                    />
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelbtn} onPress={handleCancel}>
                        <Text h5 bold>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity   style={[styles.savebtn, { backgroundColor: theme.$lightText }]} onPress={updateProfile} disabled={loading}>
  {loading ? (
    <ActivityIndicator size="small" color={theme.$lightText} />
  ) : (
    <Text h5 bold customColor={theme.$background}>Save</Text>
  )}
</TouchableOpacity>

                </View>

                <BottomSheet isVisible={isVisible}>
                    {list.map((l, i) => (
                        <ListItem key={i} onPress={l.onPress} bottomDivider>
                            <Icon name={l.icon} />
                            <ListItem.Content>
                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </BottomSheet>



            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%'),
      // padding: hp('2%'),
      paddingHorizontal: wp('5%'),
      
    },
    avatarWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('5%'),
        position: 'relative',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 1,
        left: '59%',
        transform: [{ translateX: -wp('3%') }],
        borderRadius: wp('5%'),
        padding: wp('1.5%'),
    },
    label: {
        // fontSize: 14,
        // fontWeight: '500',
        // marginBottom: 4,
        // color: '#333',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('2%'),
        // backgroundColor:"pink"
        // paddingHorizontal:16
    },
    inputGroup: {
        marginTop: hp('2%'),
        paddingHorizontal:16
    },
    inputGrouphalf: {
        width: '48%',
        paddingHorizontal:16
    },
    inputBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,  
        backgroundColor: '#F9F9F9',
    },
    inputBoxHalf: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
      fontSize:16,
        backgroundColor: '#F9F9F9',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('13%'),
        marginBottom: hp('5%'),
        paddingHorizontal:16
    },
    cancelbtn: {
        width: '48%',
        backgroundColor: '#ccc',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    savebtn: {
        width: '48%',
      
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});