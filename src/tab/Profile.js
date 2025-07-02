import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  PermissionsAndroid,
  Dimensions,
  FlatList,
  Image,
  Share,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTheme from '../hooks/useTheme';
import Header from '../component/header';
import {Avatar} from 'react-native-elements';
import Text from '../component/Text';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from '../component/icon';
import {useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import AuthStorage from '../utils/authStorage';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AntDesign
from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import Video from 'react-native-video';
import ActivityIndicator from '../assets/activityIndicator';
import Button from '../component/fabButton';

const screenWidth = Dimensions.get('window').width;
const numColumns = 3;
const itemSpacing = 2; // optional, for spacing between items
const itemSize = screenWidth / numColumns - itemSpacing * 2;
const ProfileScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const userData = useSelector(state => state.user.userData);
  console.log('userData', userData);
  const [userType, setUserType] = useState('');
  const [userName, setUserName] = useState('');
  console.log('usersss', userType);
  console.log('userName', userName);
  const businessProfile = useSelector(state => state.auth.businessProfile);
  console.log('Business Name:', businessProfile);
  const profileData = useSelector((state) => state.profile.Profile);
  console.log('🙌 Profile Data:', profileData);
  const personalProfile = useSelector(state => state.auth.personalProfile);
  console.log('persinaldata', personalProfile);
  const [userId, setUserId] = useState('');
  console.log("userId",userId)
  const [storedProfile, setStoredProfile] = useState(null);
  console.log("storeProfile",storedProfile)
  const [Profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsData, setPostsData] = useState({ count: 0, results: [] });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("posts",posts)
  const [currentPage, setCurrentPage] = useState(1)
    const [showLoading, setShowLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({});


useFocusEffect(
  useCallback(() => {
    // screen is focused
    return () => {
      // screen is unfocused (navigating away)
      setSelected('');
    };
  }, [])
);
  

  useEffect(() => {
    if (profileData?.data?.id) {
      const storeProfileId = async () => {
        try {
          await AsyncStorage.setItem('profile_id', profileData.data.user.id.toString());
          console.log('✅ Profile ID stored in AsyncStorage:', profileData.data.user.id);
        } catch (error) {
          console.error('❌ Error storing profile ID:', error);
        }
      };
      storeProfileId();
    }
  }, [profileData]);
  useEffect(() => {
    if (profileData?.data?.id) {
      const storeProfile = async () => {
        try {
          // Storing the profileData.id (not user.id)
          await AsyncStorage.setItem('profile_id', profileData.data.id.toString());
          console.log('✅ Profile ID stored in AsyncStorage:', profileData.data.id); // Log the correct ID
        } catch (error) {
          console.error('❌ Error storing profile ID:', error);
        }
      };
      storeProfile();
    }
  }, [profileData]);


   useEffect(() => {
    const fetchDeviceDetails = async () => {
      try {
        const deviceType = DeviceInfo.getDeviceType();
        const osName = DeviceInfo.getSystemName();
        const osVersion = DeviceInfo.getSystemVersion();
        const userAgent = await DeviceInfo.getUserAgent();

        let latitude = 'Unavailable';
        let longitude = 'Unavailable';
        let address = 'Unknown Location';

        // ✅ Request location permissions (Android only)
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);

          const fineGranted = granted['android.permission.ACCESS_FINE_LOCATION'];
          const coarseGranted = granted['android.permission.ACCESS_COARSE_LOCATION'];

          if (
            fineGranted !== PermissionsAndroid.RESULTS.GRANTED &&
            coarseGranted !== PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.warn('Location permission denied');
          }
        }

        // ✅ Get current location
        await new Promise(resolve => {
          Geolocation.getCurrentPosition(
            async position => {
              latitude = position.coords.latitude.toFixed(6);
              longitude = position.coords.longitude.toFixed(6);

              try {
              const locationResponse = await fetch(
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
  {
    headers: {
      'User-Agent': 'MyApp/1.0.0 (myemail@example.com)', // 👈 Replace with your app/email
    },
  }
);

if (locationResponse.ok) {
  const locationData = await locationResponse.json();
  address = locationData?.display_name || 'Unknown Location';
} else {
  const errorText = await locationResponse.text();
  console.error('Reverse geocoding failed:', errorText);
}

              } catch (err) {
                console.error('Error resolving address:', err);
              }

              resolve();
            },
            error => {
              console.error('Error getting location:', error);
              resolve(); // Still proceed even on failure
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        });

        // ✅ Get IP address
        const ipRes = await fetch('https://api64.ipify.org?format=json');
        const ipData = await ipRes.json();

        const finalDeviceInfo = {
          ip_address: ipData.ip,
          latitude,
          longitude,
          location: address,
          device_type: deviceType,
          os: `${osName} ${osVersion}`,
          user_agent: userAgent,
        };

        setDeviceInfo(prev => ({ ...prev, ...finalDeviceInfo }));

        const accessToken = await AuthStorage.getAccessToken();

        const formData = new FormData();
        formData.append('ip_address', finalDeviceInfo.ip_address);
        formData.append('latitude', finalDeviceInfo.latitude);
        formData.append('longitude', finalDeviceInfo.longitude);
        formData.append('location', finalDeviceInfo.location);
        formData.append('device_type', finalDeviceInfo.device_type);
        formData.append('os', finalDeviceInfo.os);
        formData.append('user_agent', finalDeviceInfo.user_agent);

        const apiResponse = await fetch(
          `http://52.70.194.52/api/core/user-activities/${userId}/`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        if (apiResponse.ok) {
          console.log('Device info submitted successfully.');
        } else {
          console.error('Failed to submit device info:', await apiResponse.text());
        }
      } catch (error) {
        console.error('Error fetching device details:', error);
      }
    };

    if (userId) {
      fetchDeviceDetails();
    }
  }, [userId]);



// Separate effect to set userId from userData
useEffect(() => {
  if (userData?.user?.id) {
    setUserId(userData.user.id);
    setStoredProfile(null); // Clear previous profile
  }
}, [userData]);


  
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
  
  const onShare = async () => {
    try {
          const profileUrl = `https://yourapp.com/profile/${userId}`
      const result = await Share.share({
        message: `Check out my profile! Here is my ID: ${profileUrl}`, 
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ', result.activityType);
        } else {
          console.log('Content shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };
   
 // <-- Run only when userId is availabl
  console.log('deviceinfo', deviceInfo);
 
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
          await AsyncStorage.setItem('userName', personalProfile?.user?.username);
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
  console.log('Current userType:', userType);
  const fetchPosts = async (url = 'http://52.70.194.52/api/feed/posts/list/user/?page=1&page_size=5', allPosts = []) => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
  
      const data = await response.json();
       console.log("data",data)
       setPostsData(data);
      // Append new posts to existing ones
      const combinedPosts = [...allPosts, ...(data.results || [])];
  
      // Check if there's a next page
      if (data.next) {
        // Recursive call with next URL
        return fetchPosts(data.next, combinedPosts);
      } else {
        // All data fetched
        console.log('All fetched posts:', combinedPosts);
        setPosts(combinedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

 
  
  useFocusEffect(
    useCallback(() => {
      fetchPosts(); // This causes re-fetch every time you return
    }, [])
  );
  
  const showBusinessContent =
    businessProfile?.message?.includes('Business Info created successfully') ||
    userType === 'business';

  const showPersonalContent =
    (!showBusinessContent && userType === 'personal') ||
    businessProfile?.message?.includes('Personal profile created successfully');


    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity 
          style={style.card} 
          onPress={() => navigation.navigate('PostDetail', { 
            postId: item.id,
            allPosts: posts
          })}>
          {item.media_type === 'video' ? (
            <Video
              source={{ uri: item.media_url }}
              style={style.cardImage}
              resizeMode="cover"
              muted
              repeat
              paused={true}
            />
          ) : (
            <Image
              source={{ uri: item.media_url }}
              style={style.cardImage}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      );
    };
    
  return (
    <SafeAreaView
          style={[
            style.Container,
            {backgroundColor: theme.$background}, // ✅ dynamic background color
          ]}>
    {/* Header */}
    <View style={{paddingHorizontal:16,padding:hp("1%")}}>
    <Header
  showBack={true}
  title={userName || storedProfile?.username || storedProfile?.first_name || 'User'} 
      rightComponent={
        <View style={{ flexDirection: 'row', gap: 15, }}>
          <TouchableOpacity onPress={() => navigation.navigate('uploadreels')}>
            <AntDesign name="plussquareo" size={23} color={theme.$lightText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
            <Icon name="bell" size={23} color={theme.$lightText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Icon name="menu" size={23} color={theme.$lightText} />
          </TouchableOpacity>
        </View>
      }
    />
</View>
    {/* Avatar & Name */}
    <View style={{ marginTop: 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
    {storedProfile === null ? (
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
      storedProfile?.profile_pic
        ? { uri: `${storedProfile.profile_pic}` }
        : require('../assets/icon/profiles.png')
    }
  />
)}


  {/* Stats */}
  <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
  <View style={{ alignItems: 'center', minWidth: '20%' }}>
    <Text h4 semiBold numberOfLines={1}>{postsData.count}</Text>
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
  <View style={{ paddingHorizontal:20}}>

  {/* <Text h5 >{userName} </Text> */}
  {storedProfile && (
  <Text h5  bold>{storedProfile.first_name} {storedProfile.last_name}</Text>
)}
</View>
<View style={{ flexDirection: 'row', gap: 10, justifyContent:"center",top:10 }}>
<ButtonWithPushBack customContainerStyle={{ width: 120 }}>
  <PrimaryButton
    size="small"
    title="Edit Profile"
    onPress={() => {
      setSelected('edit');
      navigation.navigate('EditScreen');
    }}
    customsBg={selected === 'edit' ? theme.$primary : 'transparent'}
    titleStyle={{
      color: selected === 'edit' ? theme.$onPrimary : theme.$lightText, // text color based on selection
    }}
    buttonStyle={{
      borderWidth: 1,
      borderColor: theme.$lightText, // dynamic border
    }}
  />
</ButtonWithPushBack>

<ButtonWithPushBack customContainerStyle={{ width: 120 }}>
  <PrimaryButton
    size="small"
    title="Share Profile"
    onPress={() => {
      setSelected('share');
      onShare();
    }}
    customsBg={selected === 'share' ? theme.$primary : 'transparent'}
    titleStyle={{
      color: selected === 'share' ? theme.$onPrimary : theme.$lightText,
    }}
    buttonStyle={{
      borderWidth: 1,
      borderColor: theme.$lightText,
    }}
  />
</ButtonWithPushBack>


    </View>
    <View style={{ flex: 1, marginTop: 20 }}>
  
  <FlatList
    data={posts}
    renderItem={renderItem}
    keyExtractor={(item) => item.id}
    numColumns={3}
    showsVerticalScrollIndicator={false}
    ListEmptyComponent={
      !showLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <Text h4 bold>No data found</Text>
          {/* <Image
            source={require('../assets/icon/attendence.webp')} // <-- apna image path yaha dena
            style={{ width: 250, height: 250, resizeMode: 'cover' }}
          /> */}
        </View>
      )
    }
  />

        
    
</View>


<View style={{}}>
      <ButtonWithPushBack customContainerStyle={style.buttonContainer}>
        <PrimaryButton
          icon={<Icon name="plus" type="feather" size={25} color={theme.$background} />}
          onPress={() => navigation.navigate('uploadreels')}
          buttonStyle={style.buttonStyle}
        />
      </ButtonWithPushBack>
    </View>
  </SafeAreaView>
);
};

export default ProfileScreen;

const style = StyleSheet.create({
  Container: {
    // width: wp('100%'),
    // height: hp('100%')
    flex:1,
    
  
  },
  card: {
    width: itemSize,
    height: itemSize*2,
    margin: itemSpacing,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp('10%'),
    right: wp('7%'),
  },
  buttonStyle: {
    width: 50,              
    height: 50,              
    borderRadius: 25,         

  },
});
