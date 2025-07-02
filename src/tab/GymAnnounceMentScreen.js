import {
    Alert,
    FlatList,
    Image,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import useTheme from '../hooks/useTheme';
import Header from '../component/header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import ActivityIndicator from '../assets/activityIndicator';
import Icon from '../component/icon';
import Video from 'react-native-video';
import TextInputEml from '../component/textInput';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Video as VideoCompressor } from 'react-native-compressor';
import AuthStorage from '../utils/authStorage';
import { showMessage } from '../utils/messages/message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import Card from '../component/card';
import { Avatar } from 'react-native-elements';
import Text from '../component/Text';
import Slide from '../assets/slide';
import SkeletonCard from '../component/skeleternLoader';


const GymAnnounceMentScreen = () => {
  const { theme } = useTheme();
  const [isUploading, setIsUploading] = React.useState(false);
   const [step, setStep] = useState(0);
    const [media, setMedia] = useState(null);
    const [videoSize, setVideoSize] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const [captionError, setCaptionError] = useState('');
    const [subject, setSubject] = useState('');
const [notification, setNotification] = useState('');
const [isModalVisible, setModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
const businessProfile = useSelector(state => state.auth.businessProfile);
    const userData = useSelector(state => state.user.userData);
    // console.log('userData', userData);
    const [userType, setUserType] = useState('');
    const profileData = useSelector(state => state.profile.Profile);
    // console.log('🙌 Profile Data:', profileData);
    const personalProfile = useSelector(state => state.auth.personalProfile);
    // console.log('persinaldata', personalProfile);
    const [profileMessage, setProfileMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    // console.log('userId', userId);
    const [storedProfile, setStoredProfile] = useState(null);
    // console.log('storeProfile', storedProfile);
    const [loadingMembers, setLoadingMembers] = useState(true);
       const [Announcement, setAnnounceMent] = useState();
    const [selectedMembers, setSelectedMembers] = useState([]);
const [areAllSelected, setAreAllSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

 console.log("ann",Announcement) 
useEffect(() => {
  getAnnouncement();
}, [])
const toggleMemberSelection = (userId) => {
  if (selectedMembers.includes(userId)) {
    const updated = selectedMembers.filter(id => id !== userId);
    setSelectedMembers(updated);
    setAreAllSelected(false);
  } else {
    const updated = [...selectedMembers, userId];
    setSelectedMembers(updated);
    if (updated.length === members.length) {
      setAreAllSelected(true);
    }
  }
};

const toggleSelectAll = () => {
  if (areAllSelected) {
    setSelectedMembers([]);
    setAreAllSelected(false);
  } else {
    const allIds = members.map(member => member.user_id);
    setSelectedMembers(allIds);
    setAreAllSelected(true);
  }
};

 const getAnnouncement = async () => {
  try {
    setIsLoading(true); // Start loading
    const accessToken = await AuthStorage.getAccessToken();

    const response = await fetch(
      'http://52.70.194.52/api/gym/announcements/',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log('Fetched Announcements:', result);
      setAnnounceMent(result); // 👈 Make sure state name is correct
    } else {
      console.error('Error fetching announcements:', result);
      showMessage({
        message: 'Failed to fetch announcements.',
        type: 'danger',
        duration: 3000,
        theme: theme,
      });
    }
  } catch (error) {
    console.error('Network error:', error);
    showMessage({
      message: 'Network error while fetching announcements.',
      type: 'danger',
      duration: 3000,
      theme: theme,
    });
  } finally {
    setIsLoading(false); // ✅ Stop loading regardless of success or failure
  }
};

useEffect(() => {
  const fetchMembers = async () => {
      setLoadingMembers(true);
    try {
      const accessToken = await AuthStorage.getAccessToken();

      if (!accessToken) {
        console.error('❌ Error: Access token is missing!');
        return;
      }

      const businessId = storedProfile?.businessinfo?.id;
      console.log("bussiness", businessId);

      if (!businessId) {
        console.error('❌ Error: Business ID not found in profile');
        return;
      }

      console.log('✅ Using Business ID:', businessId);

      const response = await fetch(
        `http://52.70.194.52/api/core/business/members/${businessId}/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        return;
      }

      const data = await response.json();
      console.log('✅ Fetched Members:', data);
      setMembers(data.members || []);
    } catch (error) {
      console.error('❌ Error fetching members:', error);
    }
     finally {
    setLoadingMembers(false);
  }
  };

  if (storedProfile?.businessinfo?.id) {
    fetchMembers();
  }
}, [storedProfile]);
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

const toggleModal = () => {
  setModalVisible(!isModalVisible);
};
  const uploadReel = () => {
    setIsUploading(true);
    // Simulate upload...
    setTimeout(() => setIsUploading(false), 2000);
  };
 const handleCaptionChange = (text) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length; // Split by spaces and filter empty strings
    if (wordCount > 100) {
      setCaptionError('Caption cannot exceed 100 words');
    } else {
      subject('');
      setCaption(text);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const camera = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        let storage = true;

        if (Platform.Version >= 33) {
          const image = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
          const video = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO);
          storage =
            image === PermissionsAndroid.RESULTS.GRANTED && video === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          storage =
            (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)) ===
            PermissionsAndroid.RESULTS.GRANTED;
        }

        return camera === PermissionsAndroid.RESULTS.GRANTED && storage;
      } catch (err) {
        Alert.alert('Permission Error', 'Something went wrong with permissions.');
        return false;
      }
    }
    return true;
  };

  const validateAndSetMedia = async (asset) => {
    if (!asset) return;

    const fileSizeMB = asset.fileSize / (1024 * 1024);
    const mediaType = asset.type?.includes('video') ? 'video' : 'image';

    if (mediaType === 'image' && fileSizeMB > 10) {
      Alert.alert('Error', 'Image size should not exceed 10MB');
      return;
    }

    if (mediaType === 'video') {
      const duration = asset.duration;
      if (duration < 10 || duration > 25) {
        Alert.alert('Error', 'Video duration must be between 10 and 25 seconds');
        return;
      }

      try {
        const compressedUri = await VideoCompressor.compress(asset.uri, {
          compressionMethod: 'auto',
          minimumFileSizeForCompress: 1,
        });

        const fileInfo = await fetch(compressedUri);
        const blob = await fileInfo.blob();
        const compressedSizeMB = blob.size / (1024 * 1024);

        if (compressedSizeMB > 20) {
          Alert.alert(
            'Error',
            `Video is too large even after compression (${compressedSizeMB.toFixed(2)} MB). Please upload a smaller video.`,
          );
          return;
        }

        setVideoSize(compressedSizeMB.toFixed(2));
        setMedia({
          uri: compressedUri,
          type: asset.type,
          mediaType,
        });
        startVideoUpload();
      } catch (error) {
        console.log('Compression error:', error);
        Alert.alert('Error', 'Failed to compress video.');
      }

      return;
    }

    setVideoSize(null); // Reset if image is selected
    setMedia({
      uri: asset.uri,
      type: asset.type,
      mediaType,
    });
  };

  const openCameraForPhoto = async () => {
    const granted = await requestPermissions();
    if (!granted) return;

    launchCamera({}, (response) => {
      const asset = response.assets?.[0];
      if (asset) validateAndSetMedia(asset);
    });
  };

  const openCameraForVideo = async () => {
    const granted = await requestPermissions();
    if (!granted) return;

    launchCamera(
      {
        mediaType: 'video',
        videoQuality: 'high',
        durationLimit: 60,
      },
      (response) => {
        const asset = response.assets?.[0];
        if (asset) validateAndSetMedia(asset);
      },
    );
  };

  const handleCameraOpen = () => {
    Alert.alert('Choose Action', '', [
      {
        text: '📷 Camera',
        onPress: () => {
          Alert.alert('Camera Options', '', [
            { text: 'Take Photo', onPress: openCameraForPhoto },
            { text: 'Record Video', onPress: openCameraForVideo },
            { text: 'Cancel', style: 'cancel', onPress: () => {} },
          ]);
        },
      },
      { text: '🖼️ Choose from Gallery', onPress: handleGalleryOpen },
      { text: '❌ Cancel', style: 'cancel', onPress: () => {} },
    ]);
  };

  const handleGalleryOpen = async () => {
    const granted = await requestPermissions();
    if (!granted) return;

    launchImageLibrary(
      {
        mediaType: 'mixed',
        selectionLimit: 1,
        quality: 1,
      },
      (response) => {
        const asset = response.assets?.[0];
        if (asset) validateAndSetMedia(asset);
      },
    );
  };

  const startVideoUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 300);
  };
// const handleSubmit = async () => {
//   if (!subject.trim()) {
//     Alert.alert('Subject is required.');
//     return;
//   }

//   if (!notification.trim()) {
//     Alert.alert('Notification message is required.');
//     return;
//   }

//   setIsUploading(true); // start loader

//   const formData = new FormData();
//   formData.append('title', subject);
//   formData.append('message', notification);

//   if (media) {
//     const fileExtension = media.type?.split('/')[1] || 'mp4';
//     const uniqueFileName = `reel_${Date.now()}.${fileExtension}`;

//     formData.append('picture', {
//       uri: Platform.OS === 'android' ? media.uri : media.uri.replace('file://', ''),
//       type: media.type,
//       name: uniqueFileName,
//     });
//   }

//   try {
//     const accessToken = await AuthStorage.getAccessToken();

//     const res = await fetch('http://52.70.194.52/api/gym/announcements/', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         // ⚠️ DO NOT manually set 'Content-Type' for FormData
//       },
//       body: formData,
//     });

//     const data = await res.json();

//     if (res.ok) {
//       Alert.alert('Announcement posted successfully!');
//       console.log('data', data);
//       setSubject('');
//       setNotification('');
//       setMedia(null);
//     } else {
//       Alert.alert(data?.detail || 'Failed to post announcement');
//     }
//   } catch (error) {
//     console.error(error);
//     Alert.alert('Something went wrong!');
//   } finally {
//     setIsUploading(false); // stop loader
//   }
// };

const handleSubmit = async () => {
  if (!subject.trim()) {
    showMessage({
      message: 'Subject is required.',
      type: 'danger',
      duration: 3000,
      theme:theme
    });
    return;
  }

  if (!notification.trim()) {
    showMessage({
      message: 'Notification message is required.',
      type: 'danger',
      duration: 3000,
      theme:theme
    });
    return;
  }

  setIsUploading(true);

  const formData = new FormData();
  formData.append('title', subject);
  formData.append('message', notification);
  selectedMembers.forEach(userId => {
  formData.append('visible_to', userId); 
});

  if (media) {
    const fileExtension = media.type?.split('/')[1] || 'mp4';
    const uniqueFileName = `reel_${Date.now()}.${fileExtension}`;

    formData.append('picture', {
      uri: Platform.OS === 'android' ? media.uri : media.uri.replace('file://', ''),
      type: media.type,
      name: uniqueFileName,
    });
  }
console.log("form",formData)
  try {
    const accessToken = await AuthStorage.getAccessToken();
    const res = await fetch('http://52.70.194.52/api/gym/announcements/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await res.json();
console.log("data",data)
    if (res.ok) {
      showMessage({
        message: 'Announcement posted successfully!',
        type: 'success',
        duration: 3000,
        theme:theme
      });
      toggleModal()
      setSubject('');
      setNotification('');
      setMedia(null);
    } else {
      showMessage({
        message: data?.detail || 'Failed to post announcement.',
        type: 'danger',
        duration: 3000,
        theme:theme
      });
    }
  } catch (error) {
    console.error(error);
    showMessage({
      message: 'Something went wrong!',
      type: 'danger',
      duration: 3000,
      theme:theme
    });
  } finally {
    setIsUploading(false);
  }
};

  return (
  <SafeAreaView style={[styles.container, { backgroundColor: theme.$background }]}>
  {step === 0 && ( <Header showBack={true} title="Announcement" />)}
    {step === 0 && (
      <>
  <FlatList
  data={isLoading ? Array(5).fill({}) : Announcement}
  keyExtractor={(item, index) =>
    item?.id?.toString() || index.toString()
  }
  renderItem={({ item, index }) => (
    <View style={{ paddingHorizontal: 10 }}>
      <TouchableOpacity onPress={() => setStep(1)}>
       <Card
      third
      style={{
        backgroundColor: 'white',
        borderRadius: 5,
        // borderWidth: 1,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
          {isLoading ? (
            <SkeletonCard height={69} borderRadius={8} isLoading={true} />
          ) : (
            <>
           <Avatar
        size={wp('16%')}
        rounded
        activeOpacity={0.7}
        overlayContainerStyle={{
          backgroundColor: '#D9D9D9',
          borderColor: theme.$secondaryText,
          borderWidth: 1,
        }}
        source={item.picture ? { uri: item.picture } : undefined}
        title={!item.picture && item.created_by ? item.created_by.charAt(0).toUpperCase() : ''}
      />

      {/* Text Info Section */}
      <View style={{ flex: 1 }}>
        <Text h5 customColor="black" bold style={{ marginBottom: 4 }}>
  📰 Title: {item.title}
</Text>
        <Text customColor="black" style={{ marginBottom: 2 }}>
          📝 Message: {item.message}
        </Text>

        <Text customColor="black" style={{ marginBottom: 2 }}>
          🧾 Created By: {item.created_by}
        </Text>

        <Text customColor="black" style={{ marginBottom: 2 }}>
          📅 Created At: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
            </>
          )}
        </Card>
      </TouchableOpacity>
    </View>
  )}
  ListEmptyComponent={
    !isLoading ? (
      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Image
          source={require('../assets/icon/attendence.webp')}
          style={{
            width: 200,
            height: 200,
            resizeMode: 'contain',
            marginBottom: 60,
          }}
        />
        <View style={{ paddingHorizontal: 16 }}>
          <Text h3 bold textAliments="center">
            No Announcement available. Please Add a batch first.
          </Text>
        </View>
      </View>
    ) : null
  }
/>

        <ButtonWithPushBack customContainerStyle={styles.buttonContaine}>
          <PrimaryButton
            title="Add"
            icon={<Icon name="plus" type="feather" size={15} color={theme.$background} />}
            onPress={() => {
              setStep(1);
            }}
            />
        </ButtonWithPushBack>
      </>
    )}
    {step === 1 && (
      <Slide index={1}>
        <Header
          showBack={true}
          title="Add New Batches"
          customBackEvent={() => setStep(0)}
        />

  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.keyboardAvoiding}
    keyboardVerticalOffset={hp('8%')}
  >
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Media Upload, Caption, Notification input, etc. */}
    <TouchableOpacity style={styles.uploadCard} onPress={handleCameraOpen}>
          <View style={styles.uploadCardBox}>
            {media ? (
              media.mediaType === 'image' ? (
                <Image
                  source={{ uri: media.uri }}
                  style={{ width: '100%', height: '100%', borderRadius: 10 }}
                  resizeMode="cover"
                />
              ) : (
                <Video
                  source={{ uri: media.uri }}
                  style={{ width: '100%', height: '100%', borderRadius: 10 }}
                  resizeMode="cover"
                  paused={false}
                  repeat
                />
              )
            ) : (
              <>
                <Icon name="plus" size={32} color="#4a4a4a" />
                <Text style={styles.cardText}>
                  Select Image/Video/Post{'\n'}you want to boost
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

      <View style={styles.inputContainer}>
      <TextInputEml
  label="Add Subject"
  placeholder="Enter Subject"
  value={subject}
  onChangeText={(text) => {
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 100) {
      setCaptionError('Subject cannot exceed 300 words');
    } else {
      setCaptionError('');
      setSubject(text);
    }
  }}
  maxLength={300}
/>
<Text style={styles.charInside}>{`${subject.length}/300`}</Text>

      </View>

      {captionError && (
        <Text style={{ color: 'red', fontSize: 12 }}>{captionError}</Text>
      )}

 <TextInputEml
  label="Add Notification"
  placeholder="Write a Notification"
  value={notification}
  onChangeText={(text) => setNotification(text)}
  height={80}
/>
{/* <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
  <Text style={styles.addButtonText}>Add Members</Text>
</TouchableOpacity> */}
{/* <ButtonWithPushBack customContainerStyle={styles.addButton}>
      <PrimaryButton
  title="Add Members"
onPress={toggleModal}
 
/>
      </ButtonWithPushBack> */}
<Modal
  visible={isModalVisible}
  transparent
  animationType="slide"
  onRequestClose={toggleModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Members</Text>

      <TouchableOpacity onPress={toggleSelectAll}>
        <Text style={styles.selectAllText}>
          {areAllSelected ? 'Unselect All' : 'Select All'}
        </Text>
      </TouchableOpacity>

      <FlatList
  data={members}
  keyExtractor={item => item.user_id}
 renderItem={({ item }) => {
  const isSelected = selectedMembers.includes(item.user_id);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
      }}
    >
      {/* Avatar */}
      <Avatar
        size={wp('10%')}
        rounded
        overlayContainerStyle={{
          backgroundColor: '#D9D9D9',
          borderColor: theme.$secondaryText,
          borderWidth: 1,
        }}
        source={
          item.personal_info?.profile_pic
            ? { uri: item.personal_info.profile_pic }
            : undefined
        }
        title={
          !item.personal_info?.profile_pic && item.user_name
            ? item.user_name.charAt(0).toUpperCase()
            : ''
        }
      />

      {/* Name, Gender, and Batch Block */}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <View style={{ flexDirection: 'row', gap:20 }}>
          <Text h5 bold>
            {item.user_name}
          </Text>
          <Text h5 semiBold>
            {item.personal_info?.gender || '–'}
          </Text>
        </View>
        <Text h5 semiBold>
          {item.batch_name || ''}
        </Text>
      </View>

      {/* Checkbox */}
      <TouchableOpacity onPress={() => toggleMemberSelection(item.user_id)}>
        <View style={styles.checkboxOuter}>
          {isSelected && <View style={styles.checkboxInner} />}
        </View>
      </TouchableOpacity>
    </View>
  );
}}

/>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <TouchableOpacity onPress={toggleModal} style={[styles.closeButton, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={selectedMembers.length === 0}
          style={[
            styles.sendButton,
            { flex: 1, marginLeft: 10, opacity: selectedMembers.length === 0 ? 0.5 : 1 },
          ]}
        >
          <Text style={styles.sendButtonText}>Send Notification</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


    </ScrollView>

    {/* Fixed Button at Bottom */}
    <View style={styles.fixedBottomButton}>
      <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
      {/* <PrimaryButton
  title="Send Notification"
  onPress={handleSubmit}
  disabled={isUploading}
  loading={isUploading}
  loadingProps={{ size: 'small', color: 'white' }} // 👈 pass an object, not JSX
  style={{ opacity: isUploading ? 0.5 : 1 }}
/> */}
 
      <PrimaryButton
  title="Add Members"
onPress={toggleModal}
 
/>
      </ButtonWithPushBack>
   
    </View>
  </KeyboardAvoidingView>
    </Slide>

      )}
</SafeAreaView>

  );
};

export default GymAnnounceMentScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:16
  },
  keyboardAvoiding: {
    flex: 1,
  },
scrollContent: {
  flexGrow: 1,
//   alignItems: 'center',
  justifyContent: 'flex-start',
//   paddingVertical: hp('3%'),
paddingHorizontal:16
},
uploadCard: {
  alignItems: 'center',
  marginTop: hp('4%'),
},
  buttonContainer: {
    justifyContent: 'center',
    paddingHorizontal:16,
    marginVertical:40
  },
    buttonContaine: {
    position: 'absolute',
    bottom: hp('10%'),
    right: wp('7%'),
  },

   inputContainer: {
    position: 'relative',
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
  },
  charInside: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    fontSize: hp('1.5%'),
    color: '#888',
  },
 
//   uploadCard: {
//     alignItems: 'center',
//     // justifyContent: 'center',
//     // marginVertical: 30,
//   },
  uploadCardBox: {
    width: wp('60%'),
    aspectRatio: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    // alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  cardText: {
    fontSize: 12,
    color: '#4a4a4a',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: hp('1.5%'),
    marginTop: hp('1%'),
    fontSize: hp('2%'),
    width: '100%',
  },
  addButton: {
  // backgroundColor: '#007bff',
  // padding: 12,
  // borderRadius: 8,
  // alignItems: 'center',
  marginTop: 16,
},
addButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectAllText: {
  color: '#000',
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 10,
  alignSelf: 'flex-end',
},
checkboxOuter: {
  height: 20,
  width: 20,
  borderRadius: 4,
  borderWidth: 1.5,
  borderColor: '#333',
  alignItems: 'center',
  justifyContent: 'center',
},
checkboxInner: {
  height: 12,
  width: 12,
  backgroundColor: '#333',
},


});
