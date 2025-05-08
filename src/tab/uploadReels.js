import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Video as VideoCompressor} from 'react-native-compressor';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Text from '../component/Text';
import Header from '../component/header';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import SingleSelect from '../component/singleSelect';
import TextInputEml from '../component/textInput';
import {useSelector} from 'react-redux';
import AuthStorage from '../utils/authStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityIndicator from '../assets/activityIndicator';

const UploadReels = () => {
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoSize, setVideoSize] = useState(null); // 🆕 New state to track compressed size
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
    const [interestData, setInterestData] = useState([]);
        const [filteredData, setFilteredData] = useState([]);
    console.log('in',interestData)
  const userData = useSelector(state => state.user.userData);
  console.log('userData1', userData);
  const [userId, setUserId] = useState('');
  console.log('userId', userId);
  const formattedData = filteredData.map(item => ({
    key: item, 
    value: item
  }));
  const handleHashtagChange = (text) => {
    if (text === '') {
      setHashtag('');
      return;
    }
    const tags = text.trim().split(/\s+/);
    if (tags.length > 10) return;
    const isValid = tags.every(tag => {
      if (tag === '#') return true;
      return tag.startsWith('#') && tag.length <= 10;
    });
  
    if (isValid) {
      setHashtag(text);
    }
  };
  
  useEffect(() => {
    const getInterest = async () => {
        try {
            const accessToken = await AuthStorage.getAccessToken();
            const response = await fetch(`http://52.70.194.52/api/core/all-interests`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const result = await response.json();
            if (response.ok) {
                console.log('✅ Interests Fetched:', result);
                setInterestData(result.interests); 
                setFilteredData(result.interests); 
            } else {
                console.error('❌ Error Fetching Interests:', result);
            }
        } catch (error) {
            console.error('🔥 Network Error:', error);
        }
    };

    getInterest();
}, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ✅ Save userId
        if (userData?.user?.id) {
          setUserId(userData.user.id.toString());
          await AsyncStorage.setItem('userId', userData.user.id.toString());
        } else {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId) {
            setUserId(storedUserId);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userData]);
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const camera = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );

        let storage = true;

        if (Platform.Version >= 33) {
          const image = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          );
          const video = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          );
          storage =
            image === PermissionsAndroid.RESULTS.GRANTED &&
            video === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          storage =
            (await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            )) === PermissionsAndroid.RESULTS.GRANTED;
        }

        return camera === PermissionsAndroid.RESULTS.GRANTED && storage;
      } catch (err) {
        Alert.alert(
          'Permission Error',
          'Something went wrong with permissions.',
        );
        return false;
      }
    }
  };

  const validateAndSetMedia = async asset => {
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
        Alert.alert(
          'Error',
          'Video duration must be between 10 and 25 seconds',
        );
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
            `Video is too large even after compression (${compressedSizeMB.toFixed(
              2,
            )} MB). Please upload a smaller video.`,
          );
          return;
        }

        setVideoSize(compressedSizeMB.toFixed(2));
        // 🆕 store size for display

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

    launchCamera(response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
      } else {
        const asset = response.assets?.[0];
        if (asset) validateAndSetMedia(asset);
      }
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
      response => {
        const asset = response.assets?.[0];
        if (asset) validateAndSetMedia(asset);
      },
    );
  };

  const handleCameraOpen = () => {
    Alert.alert('Choose Action', '', [
      {text: '📷 Take Photo', onPress: openCameraForPhoto},
      {text: '🎥 Record Video', onPress: openCameraForVideo},
      {text: '❌ Cancel', style: 'cancel'},
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
      response => {
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
    }, 300); // Simulated upload speed
  };

  const uploadReel = async () => {
    // Check if necessary fields are filled
    if (!media || !caption) {
      Alert.alert('Missing Fields', 'Please provide all required details.');
      return;
    }

    // Ensure selectedMainCategory is a string
    const category = selectedMainCategory?.name || selectedMainCategory;

    try {
      setIsUploading(true);
      const accessToken = await AuthStorage.getAccessToken();

      const formData = new FormData();
      formData.append('user', userId); // Ensure userId is a string
      formData.append('caption', caption);
      formData.append('hashtags', hashtag);
      // formData.append('category', category); // Ensure category is a string (you can append if needed)

      const fileExtension = media.type?.split('/')[1] || 'mp4';
      const uniqueFileName = `reel_${Date.now()}.${fileExtension}`;
      
      formData.append('media', {
        uri: media.uri,
        type: media.type,
        name: uniqueFileName,
      });

      // Log FormData entries for debugging
      // logFormData(formData);
      const apiUrl = 'http://52.70.194.52/api/feed/posts/create/'; // Use the correct URL here

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Response Data:', data); // Log the response data for debugging

      // Check if the response status is 201 (created)
      if (response.status === 201) {
        Alert.alert('Success', 'Reel uploaded successfully!');
        // formData = new FormData();

        // Reset form states
        setMedia(null);
        setCaption('');
        setHashtag('');
        setSelectedMainCategory('');
      } else {
        Alert.alert('Upload Failed', data?.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload the reel.');
    }
    finally {
      setIsUploading(false); // ⬅️ Stop loader
    }
  };

  return (
    <View style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={hp('10%')} // Adjust if needed
    >
      <Header showBack={true} title="Upload Reel" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: hp('10%') }}
        >
          {/* Upload Box */}
          <View style={styles.uploadBox}>
            <Text h5 semiBold style={{ marginVertical: hp('1.5%') }}>
              Tap to upload or Record
            </Text>

            {media?.mediaType === 'image' && (
              <Image
                source={{ uri: media.uri }}
                style={styles.mediaPreview}
                resizeMode="cover"
              />
            )}

            {media?.mediaType === 'video' && (
              <Video
                source={{ uri: media.uri }}
                style={styles.mediaPreview}
                resizeMode="cover"
                controls
                paused={true}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleCameraOpen}
              >
                <Ionicons name="camera" size={24} color="black" />
                <Text>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleGalleryOpen}
              >
                <Ionicons name="image" size={24} color="black" />
                <Text>Gallery</Text>
              </TouchableOpacity>
            </View>

            {isUploading && (
              <>
                <Text style={styles.videoInfo}>
                  Uploading: {uploadProgress}%
                </Text>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${uploadProgress}%` },
                    ]}
                  />
                </View>
              </>
            )}

            {!isUploading &&
              uploadProgress === 100 &&
              media?.mediaType === 'video' && (
                <Text style={styles.videoInfo}>
                  Video size: {videoSize} MB
                </Text>
              )}
          </View>

          {/* Caption Input */}
          <View style={styles.inputContainer}>
            <TextInputEml
              placeholder="Write a caption"
              style={styles.input}
              placeholderTextColor="#777"
              value={caption}
              onChangeText={setCaption}
              maxLength={100}
              height={80}
            />
            <Text style={styles.charInside}>{`${caption.length}/100`}</Text>
          </View>

          {/* Hashtag Input */}
          <View style={styles.inputContainer}>
            <TextInputEml
              placeholder="Write a Hashtag"
              style={styles.input}
              placeholderTextColor="#777"
              value={hashtag}
              onChangeText={handleHashtagChange}
              maxLength={100}
              height={80}
            />
          </View>

          {/* Category Dropdown */}
          <View style={styles.inputContainer}>
            <SingleSelect
              arrayData={formattedData}
              uniqueId="Category"
              selected={selectedMainCategory}
              placeholder="Category"
              noDataText="No data found"
              search={false}
              selectedCb={(key, val) => {
                setSelectedMainCategory({ key: val.key, value: val.value });
              }}
            />
          </View>

          {/* Upload Button */}
          <View style={styles.fixedBottom}>
            <ButtonWithPushBack customContainerStyle={{ marginVertical: 30 }}>
              <PrimaryButton
                title="Upload"
                onPress={uploadReel}
                disabled={isUploading}
                loading={isUploading}
                loadingProps={<ActivityIndicator />}
                style={{ opacity: isUploading ? 0.5 : 1 }}
                buttonStyle={{ width: '70%' }}
              />
            </ButtonWithPushBack>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </View>
);
};

export default UploadReels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    backgroundColor: '#ffffff',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    paddingVertical: hp('4%'),
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  mediaPreview: {
    width: wp('60%'),
    height: hp('20%'),
    borderRadius: 10,
    marginTop: hp('1%'),
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: hp('2%'),
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    marginHorizontal: wp('5%'),
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
  inputContainer: {
    position: 'relative',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  charInside: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    fontSize: hp('1.5%'),
    color: '#888',
  },
  videoInfo: {
    marginTop: hp('1%'),
    color: 'gray',
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: hp('1%'),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 5,
  },
  fixedBottom: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('4%'),
  },
});