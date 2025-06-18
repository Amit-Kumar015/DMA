import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Header from '../component/header';
import Icon from '../component/icon';
import Text from '../component/Text';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Video as VideoCompressor} from 'react-native-compressor';
import Video from 'react-native-video';
import useTheme from '../hooks/useTheme';
import Custominput from '../component/Custominput';
import TextInputEml from '../component/textInput';
import ActivityIndicator from '../assets/activityIndicator';
import Search from '../component/searchInput';
import AuthStorage from '../utils/authStorage';
import {showMessage} from '../utils/messages/message';
import Slide from '../assets/slide';
import SingleSelect from '../component/singleSelect';
import Checkbox from '../component/checkbox';
import {CheckBox} from 'react-native-elements';
import Card from '../component/card';
import axios from 'axios';
import {SafeAreaView} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const delay = 700;
const BoostAccademy = () => {
  const [step, setStep] = useState(0);
  const [media, setMedia] = useState(null);
  const [videoSize, setVideoSize] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [captionError, setCaptionError] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [gender, setGender] = useState('');
  // const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  // const [targetAudience, setTargetAudience] = useState(null);
  const [formError, setFormError] = useState('');
  const [selectedLocation, setSelectedLocationDetails] = useState({
    display: '',
    city: '',
    district: '',
    state: '',
  });

  const {theme} = useTheme();
  const timeout = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [interestData, setInterestData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  console.log('intresssss', interestData);
  console.log('userrrssss', userId);
  const [checked, setChecked] = useState({
    profile: false,
    website: false,
    inbox: false,
  });

  // Handle checkbox change
  const handleCheckboxChange = name => {
    setChecked(prevState => {
      // Reset all checkboxes and select the clicked one
      const newChecked = {
        profile: false,
        website: false,
        inbox: false,
      };
      newChecked[name] = !prevState[name]; // Toggle the clicked checkbox
      return newChecked;
    });
  };
  // const locations = [
  //   { key: 'location1', value: 'Location 1' },
  //   { key: 'location2', value: 'Location 2' },
  //   { key: 'location3', value: 'Location 3' },
  //   { key: 'location4', value: 'Location 4' },
  // ];

  const handleSelectionChangess = value => {
    setTargetAudience(value);
  };

  useEffect(() => {
    fetchSubSubCategories();
  }, []);
  const fetchLocations = async text => {
    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: text,
            format: 'json',
            addressdetails: 1,
            countrycodes: 'in', // Only search within India
            limit: 10,
          },
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'YourAppName/1.0 (your@email.com)',
          },
        },
      );

      const formatted = response.data.map((item, index) => ({
        key: `${index}`,
        value: item.display_name,
        city:
          item.address.city || item.address.town || item.address.village || '',
        district: item.address.county || '',
        state: item.address.state || '',
      }));

      setLocations(formatted);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const fetchSubSubCategories = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      console.log('Access token retrieved:', accessToken);

      const response = await axios.get(
        'http://52.70.194.52/api/core/subsubcategories/',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('API raw response:', response.data);

      // Adjust this according to actual response structure
      const subSubCategoryArray = Array.isArray(response.data)
        ? response.data
        : response.data?.data || []; // fallback to .data if wrapped in object

      const transformed = subSubCategoryArray.map(item => ({
        key: item.id?.toString(),
        value: item.name,
      }));

      setSubCategories(transformed);
    } catch (error) {
      console.error('API fetch error:', error);
      if (error.response) {
        console.log('Error response:', error.response.data);
      }
    }
  };

  const handleSelectionChanges = item => {
    setLocation(item.value);
    setSelectedLocationDetails({
      display: item.value,
      city: item.city,
      district: item.district,
      state: item.state,
    });
    setLocations([]);
  };

  const handleCaptionChange = text => {
    const wordCount = text.split(/\s+/).filter(Boolean).length; // Split by spaces and filter empty strings
    if (wordCount > 100) {
      setCaptionError('Caption cannot exceed 100 words');
    } else {
      setCaptionError('');
      setCaption(text);
    }
  };

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
    return true;
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

    launchCamera({}, response => {
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
      response => {
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
            {text: 'Take Photo', onPress: openCameraForPhoto},
            {text: 'Record Video', onPress: openCameraForVideo},
            {text: 'Cancel', style: 'cancel', onPress: () => {}},
          ]);
        },
      },
      {text: '🖼️ Choose from Gallery', onPress: handleGalleryOpen},
      {text: '❌ Cancel', style: 'cancel', onPress: () => {}},
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
    }, 300);
  };
  useEffect(() => {
    const getInterest = async () => {
      try {
        const accessToken = await AuthStorage.getAccessToken();
        const response = await fetch(
          `http://52.70.194.52/api/core/all-interests`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

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

  // Debugging: Add a log to check filteredData
  useEffect(() => {
    console.log('Filtered Interests:', filteredData);
  }, [filteredData]);

  const onChangeText = text => {
    // Ensure text is not undefined or null before using .toLowerCase
    const normalizedText = (text || '').toLowerCase();
    setSearchText(normalizedText);
    filterData(normalizedText);
    console.log('Filtered Interests:', interestData);
  };

  // Your filter function
  const filterData = text => {
    const filtered = interestData.filter(
      item => item.toLowerCase().includes(text), // Correct usage for string filtering
    );
    setFilteredData(filtered);
  };

  const handleSelectionChange = (uniqueId, selectedOption) => {
    switch (uniqueId) {
      case 'targetAudience':
        setTargetAudience(selectedOption.value);
        break;
      case 'minAge':
        setMinAge(selectedOption.value);
        break;
      case 'maxAge':
        setMaxAge(selectedOption.value);
        break;
      case 'gender':
        setGender(selectedOption.value);
        break;
      case 'location':
        setLocation(selectedOption.value);
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.$background}, // ✅ dynamic background color
      ]}>
      {step === 0 && <Header showBack={true} title="Boost Academy" />}

<View style={{ }}>
  <KeyboardAwareScrollView
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}
  >
    {step === 0 && (
      <>
        {/* Upload Card */}
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

        {/* Caption Input */}
        <View style={styles.inputContainer}>
          <TextInputEml
            placeholder="Write a caption"
            style={styles.input}
            value={caption}
            onChangeText={handleCaptionChange}
            maxLength={100}
          />
          <Text style={styles.charInside}>{`${caption.length}/100`}</Text>
        </View>
        {captionError && (
          <Text style={{ color: 'red', fontSize: 12 }}>{captionError}</Text>
        )}

        {/* Search Component */}
        <Card third style={{ height: 250, padding: 0 }}>
          <Search
            value={searchText}
            onChangeText={onChangeText}
            autoFocus={true}
            showLoading={showLoading}
            loadingProps={
              <ActivityIndicator
                style={{ marginRight: 10 }}
                animating
                size="small"
              />
            }
            containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
            inputContainerStyle={{
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
              borderBottomWidth: 0,
              bottom: 10,
            }}
          />

          <View style={{ flex: 1 }}>
            {/* Filtered Dropdown */}
            {searchText.length > 0 && filteredData.length > 0 && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  maxHeight: 120,
                }}
              >
                <FlatList
                  data={filteredData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                        backgroundColor: '#fff',
                      }}
                      onPress={() => {
                        if (!selectedInterests.includes(item)) {
                          setSelectedInterests((prev) => [...prev, item]);
                        }
                        setSearchText('');
                        setFilteredData([]);
                      }}
                    >
                      <Text style={{ color: '#000' }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}

            {/* Selected Chips */}
            {selectedInterests.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginVertical: 8,
                  paddingHorizontal: 10,
                }}
              >
                {selectedInterests
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#e0e0e0',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 20,
                        marginRight: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ color: '#333', marginRight: 6 }}>#{item}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          setSelectedInterests((prev) =>
                            prev.filter((selected) => selected !== item)
                          )
                        }
                      >
                        <Text style={{ color: '#999', fontWeight: 'bold' }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            )}
          </View>
        </Card>

        {/* Step 0 "Next" Button */}
        <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
       <PrimaryButton
  title="Next"
  onPress={() => {
    if (!media) {
      setFormError('Please select an image or video to boost.');
        showMessage({
              message: 'Please select an image or video to boost.',
              type: 'danger',
              theme: theme,
              duration: 3000,
            });
    } else if (selectedInterests.length < 3) {
      setFormError('Please select at least 3 interests.');
      showMessage({
              message: 'Please select at least 3 interests.',
              type: 'danger',
              theme: theme,
              duration: 3000,
            });
    } else {
      setFormError('');
      setStep(1); // Move to next step
    }
  }}
/>

        </ButtonWithPushBack>
      </>
    )}
  </KeyboardAwareScrollView>
</View>


      {/* Step 1 Content */}

      {step === 1 && (
        <Slide index={1}>
          <Header
            showBack={true}
            title="Boost Academy"
            customBackEvent={() => setStep(0)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}

            {/* Media Display (Image/Video) */}
            <View style={styles.cardWrappers}>
              <View style={styles.cards}>
                {media.mediaType === 'image' ? (
                  <Image
                    source={{uri: media.uri}}
                    style={styles.media}
                    resizeMode="cover"
                  />
                ) : (
                  <Video
                    source={{uri: media.uri}}
                    style={styles.media}
                    resizeMode="cover"
                    paused={false}
                    repeat
                    muted
                  />
                )}
              </View>
            </View>
            {/* Target Audience Dropdown */}
            <View style={{marginTop: 20, paddingHorizontal: 16}}>
              {/* <SingleSelect
          arrayData={[
            { key: 'audience1', value: 'Audience 1' },
            { key: 'audience2', value: 'Audience 2' },
            { key: 'audience3', value: 'Audience 3' },
          ]}
          selected={targetAudience}
          selectedCb={handleSelectionChange}
          uniqueId="targetAudience"
          placeholder="Select Target Audience"
        /> */}
              <SingleSelect
                arrayData={subCategories}
                selected={targetAudience}
                selectedCb={handleSelectionChangess}
                uniqueId="targetAudience"
                placeholder="Select Target Audience"
              />

              {/* Min Age Dropdown */}

              {/* Gender Dropdown */}
              <SingleSelect
                arrayData={[
                  {key: 'male', value: 'Male'},
                  {key: 'female', value: 'Female'},
                  {key: 'all', value: 'All'},
                ]}
                selected={gender}
                selectedCb={handleSelectionChange}
                uniqueId="gender"
                placeholder="Select Gender"
              />

              {/* Target Location Dropdown */}
              {/* <SingleSelect
          arrayData={locations}  // Assuming 'locations' is an array of available locations.
          selected={location}
          selectedCb={handleSelectionChange}
          uniqueId="location"
          placeholder="Select Location"
        /> */}
              {/* <TextInput 
        placeholder="Search Location"
        onChangeText={fetchLocations}
        style={{
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          backgroundColor: '#f2f4f4',
          marginBottom: 10,
        }}
      />

      <SingleSelect
        arrayData={locations}
        selected={location}
        selectedCb={handleSelectionChanges}
        uniqueId="location"
        placeholder="Select location"
        search={true}
      /> */}
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {/* Min Age Dropdown */}
                <View style={{width: '48%'}}>
                  <SingleSelect
                    arrayData={Array.from({length: 18}, (_, i) => ({
                      key: `${i + 1}`,
                      value: `${i + 1}`,
                    }))}
                    selected={minAge}
                    selectedCb={handleSelectionChange}
                    uniqueId="minAge"
                    placeholder="Select Min Age"
                    boxStyles={{
                      // minHeight: hp('6.5%'),
                      width: '100%',
                    }}
                    dropdownStyles={{
                      width: '100%',
                      elevation: 5,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}
                  />
                </View>

                {/* Max Age Dropdown */}
                <View style={{width: '48%'}}>
                  <SingleSelect
                    arrayData={Array.from({length: 83}, (_, i) => ({
                      key: `${i + 18}`,
                      value: `${i + 18}`,
                    }))}
                    selected={maxAge}
                    selectedCb={handleSelectionChange}
                    uniqueId="maxAge"
                    placeholder="Select Max Age"
                    boxStyles={{
                      // minHeight: hp('6.5%'),
                      width: '100%',
                    }}
                    dropdownStyles={{
                      width: '100%',
                      elevation: 5,
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}
                  />
                </View>
              </View>
              <TextInput
                placeholder="Search Location"
                onChangeText={text => {
                  setLocation(text);
                  if (text.length >= 3) {
                    fetchLocations(text);
                  } else {
                    setLocations([]); // hide dropdown if less than 3 characters
                  }
                }}
                value={location}
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: '#f2f4f4',
                  marginBottom: 10,
                }}
              />

              {locations.length > 0 && location.length >= 3 && (
                <FlatList
                  data={locations}
                  keyExtractor={item => item.key}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => handleSelectionChanges(item)}
                      style={{
                        padding: 10,
                        backgroundColor: '#fff',
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc',
                      }}>
                      <Text>{item.value}</Text>
                    </TouchableOpacity>
                  )}
                  style={{
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    maxHeight: 200,
                  }}
                />
              )}
            </View>

            {/* </ScrollView> */}
          </KeyboardAvoidingView>

          {/* Step 1 "Next" Button */}
          <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton title="Next" onPress={() => setStep(2)} />
          </ButtonWithPushBack>
        </Slide>
      )}
      {step === 2 && (
        <Slide index={2}>
          <Header
            showBack={true}
            title="Boost Academy"
            customBackEvent={() => setStep(1)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {/* Media Display (Image/Video) */}
              <View style={styles.cardWrappers}>
                <View style={styles.cards}>
                  {media.mediaType === 'image' ? (
                    <Image
                      source={{uri: media.uri}}
                      style={styles.media}
                      resizeMode="cover"
                    />
                  ) : (
                    <Video
                      source={{uri: media.uri}}
                      style={styles.media}
                      resizeMode="cover"
                      paused={false}
                      repeat
                      muted
                    />
                  )}
                </View>
              </View>

              {/* Target Audience Dropdown */}
              <View style={{marginTop: 50, paddingHorizontal: 16}}>
                {/* Profile Card */}
                <Card third containerStyle={styles.cardContainer}>
                  <View style={styles.cardContent}>
                    <View style={styles.section}>
                      <Text h4 style={styles.cardText}>
                        Profile
                      </Text>
                      <Checkbox
                        checked={checked.profile}
                        onPress={() => handleCheckboxChange('profile')}
                        containerStyle={styles.checkboxContainer}
                      />
                    </View>
                  </View>
                </Card>
                <Card third containerStyle={styles.cardContainer}>
                  <View style={styles.cardContent}>
                    <View style={styles.section}>
                      <Text h4 style={styles.cardText}>
                        message
                      </Text>
                      <Checkbox
                        checked={checked.inbox}
                        onPress={() => handleCheckboxChange('inbox')}
                        containerStyle={styles.checkboxContainer}
                      />
                    </View>
                  </View>
                </Card>
                {/* Website Card */}
                <Card third containerStyle={styles.cardContainer}>
                  <View style={styles.cardContent}>
                    <View style={styles.section}>
                      <Text h4 style={styles.cardText}>
                        Website
                      </Text>
                      <Checkbox
                        checked={checked.website}
                        onPress={() => handleCheckboxChange('website')}
                        containerStyle={styles.checkboxContainer}
                      />
                    </View>
                  </View>
                </Card>

                {/* Inbox Card */}
              </View>

              {/* </View> */}
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Step 1 "Next" Button */}
          <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton title="Next" />
          </ButtonWithPushBack>
        </Slide>
      )}
    </SafeAreaView>
  );
};

export default BoostAccademy;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    paddingHorizontal: 16,
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
  buttonContainers: {
    marginVertical: 40,
    width: '50%',
    alignSelf: 'center',
  },
  uploadCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  uploadCardBox: {
    width: wp('60%'),
    aspectRatio: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
  searchWrapper: {
    // paddingHorizontal: wp("5%"),
    // paddingTop: hp("5%"),
  },
  searchContainer: {
    // backgroundColor: "transparent",
    // padding: 0,
    // elevation: 0,
    // shadowOpacity: 0,
    // shadowColor: 'transparent',  // 👈 Add this
    // shadowOffset: { width: 0, height: 0 }, // 👈 Add this
    // shadowRadius: 0, // 👈 Add this
    // borderWidth: 0,
  },

  inputContainer: {
    // backgroundColor: "transparent",
    // borderBottomWidth: 0,
    // elevation: 0,
    // shadowOpacity: 0,
    // shadowColor: 'transparent', // 👈 Add this too
    // shadowOffset: { width: 0, height: 0 },
    // shadowRadius: 0,
  },
  cardContainer: {
    // padding: 10,
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // marginBottom: 15,
  },
  cardContent: {
    // flexDirection: 'row',
    // justifyContent: 'space-between', // Align sections side by side
  },
  section: {
    // flexDirection: 'row',
    // alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardText: {
    marginRight: 10, // Add space between text and checkbox
  },
  checkboxContainer: {
    marginLeft: 10, // Space between text and checkbox
  },
  cardWrapper: {
    alignItems: 'center', // centers the card horizontally
    marginTop: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardWrappers: {
    alignItems: 'center', // centers the card horizontally
    marginTop: 20,
  },
  cards: {
    width: '90%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  media: {
    width: '100%',
    height: '100%',
  },
});
