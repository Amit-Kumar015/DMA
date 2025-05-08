import {
    FlatList,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
  import ButtonWithPushBack from '../component/Button';
  import PrimaryButton from '../component/prButton';
  import Header from '../component/header';
  import Icon from '../component/icon';
  import Custominput from '../component/Custominput';
  import Slide from '../assets/slide';
  import AuthStorage from '../utils/authStorage';
  import {showMessage} from '../utils/messages/message';
  import useTheme from '../hooks/useTheme';
  import Text from '../component/Text';
  import Card from '../component/card';
  import DateTimePickerModal from 'react-native-modal-datetime-picker';
  import axios from 'axios';
  import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityIndicator from '../assets/activityIndicator';
import { Avatar } from 'react-native-elements';

const TestScreen = () => {
    const [testInputs, setTestInputs] = useState(['']);
    const [testTypes, setTestTypes] = useState([]);

    const {theme} = useTheme();
    const navigation = useNavigation();
    const [step, setStep] = useState(0);
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

  const handleTestNameChange = (text, index) => {
    const updatedTests = [...testInputs];
    updatedTests[index] = text;
    setTestInputs(updatedTests);
  };
  
  const addTestInput = () => {
    setTestInputs([...testInputs, '']);
  };
  const handleTestTypeChange = (text, index) => {
    const updatedTypes = [...testTypes];
    updatedTypes[index] = text;
    setTestTypes(updatedTypes);
  };
  const submitTests = () => {
    const finalTests = testInputs.map((name, index) => ({
      name,
      type: testTypes[index] || '',
    }));
    console.log('Submitting tests:', finalTests);
    // Call your API or navigate next
  };
  
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
          await AsyncStorage.setItem('profile_id', profileData.data.id.toString());
          console.log('✅ Profile ID stored in AsyncStorage:', profileData.data.id); // Log the correct ID
        } catch (error) {
          console.error('❌ Error storing profile ID:', error);
        }
      };
      storeProfile();
    }
  }, [profileData]);

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
)
  return (
<View style={styles.container}>
  {step === 0 && (
    <>
      <Header showBack={true} title={storedProfile?.username ?? '--'} />
      <View style={styles.avatarWrapper}>
        {storedProfile === null ? (
          <ActivityIndicator />
        ) : (
          <>
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
                  ? { uri: storedProfile.profile_pic }
                  : require('../assets/icon/profiles.png')
              }
            />
            <View style={styles.textContainer}>
              <Text h4 bold style={styles.nameText}>
                {storedProfile.first_name ?? '--'} {storedProfile.last_name ?? '--'}
              </Text>
              <Text style={styles.locationText}>
                {storedProfile.personalinfo?.location ?? 'Location not set'}
              </Text>
            </View>
          </>
        )}
      </View>
      <Text h4 semiBold textAliments="center" style={styles.performanceText}>
        Performance Update
      </Text>

      {/* Create Test button for step 0 */}
      <View style={styles.bottomButton}>
        <ButtonWithPushBack customContainerStyle={{ width: '100%' }}>
          <PrimaryButton title="Create Test" onPress={() => setStep(1)} />
        </ButtonWithPushBack>
      </View>
    </>
  )}

  {step === 1 && (
    <Slide index={1}>
      <Header
        showBack={true}
        title={storedProfile?.username ?? '--'}
        customBackEvent={() => setStep(0)}
      />
      <View style={styles.avatarWrapper}>
        {storedProfile === null ? (
          <ActivityIndicator />
        ) : (
          <>
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
                  ? { uri: storedProfile.profile_pic }
                  : require('../assets/icon/profiles.png')
              }
            />
            <View style={styles.textContainer}>
              <Text h4 bold style={styles.nameText}>
                {storedProfile.first_name ?? '--'} {storedProfile.last_name ?? '--'}
              </Text>
              <Text style={styles.locationText}>
                {storedProfile.personalinfo?.location ?? 'Location not set'}
              </Text>
            </View>
          </>
        )}
      </View>

      <Text h4 semiBold textAliments="center" style={styles.performanceText}>
        Performance Update
      </Text>

      <Text h4 semiBold textAliments="center" style={styles.performanceText1}>
        Test Name
      </Text>

      <View style={styles.testListWrapper}>
      <FlatList
  data={testInputs}
  keyExtractor={(_, index) => index.toString()}
  contentContainerStyle={styles.testListWrapper}
  renderItem={({ item, index }) => (
    <View style={styles.testInputRow}>
      <Custominput
        placeholder={`Enter Test Name ${index + 1}`}
        value={item}
        onValueChange={(text) => handleTestNameChange(text, index)}
        width={"70%"}
        height={"5%"}
      />
       <TouchableOpacity onPress={addTestInput} style={styles.plusButton}>
      <Text style={styles.plusText}>+</Text>
    </TouchableOpacity>
    </View>
    
  )} 
/>
      </View>
      <View style={styles.bottomButton}>
        <ButtonWithPushBack customContainerStyle={{ width: '100%' }}>
          <PrimaryButton title="Create Test" onPress={() => setStep(2)}  />
        </ButtonWithPushBack>
      </View>
    </Slide>
  )}
  {step === 2 && (
  <Slide index={2}>
    <Header
      showBack={true}
      title={storedProfile?.username ?? '--'}
      customBackEvent={() => setStep(1)}
    />
  <View style={styles.avatarWrapper}>
        {storedProfile === null ? (
          <ActivityIndicator />
        ) : (
          <>
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
                  ? { uri: storedProfile.profile_pic }
                  : require('../assets/icon/profiles.png')
              }
            />
            <View style={styles.textContainer}>
              <Text h4 bold style={styles.nameText}>
                {storedProfile.first_name ?? '--'} {storedProfile.last_name ?? '--'}
              </Text>
              <Text style={styles.locationText}>
                {storedProfile.personalinfo?.location ?? 'Location not set'}
              </Text>
            </View>
          </>
        )}
      </View>

    <Text h4 semiBold textAliments="center" style={styles.performanceText}>
      Performance Update
    </Text>
    {testInputs.map((name, index) => (
  <Text
    key={index}
    h4
    semiBold
    textAliments="center"
    style={styles.performanceText1}
  >
    {name || `Test ${index + 1}`}
  </Text>
))}
    <FlatList
      data={testInputs}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.testListWrapper}
      renderItem={({ item, index }) => (
        <View style={styles.testInputRow}>
          <Custominput
            placeholder="Enter Test Type"
            value={testTypes[index] || ''}
            onValueChange={(text) => handleTestTypeChange(text, index)}
            width="70%"
            height="5%"
          />
           <TouchableOpacity onPress={addTestInput} style={styles.plusButton}>
      <Text style={styles.plusText}>+</Text>
    </TouchableOpacity>
        </View>
        
      )}
    />

    <View style={styles.bottomButton}>
      <ButtonWithPushBack customContainerStyle={{ width: '100%' }}>
        <PrimaryButton title="Submit Tests" onPress={submitTests} />
      </ButtonWithPushBack>
    </View>
  </Slide>
)}

</View>


  )
}
export default TestScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    avatarWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      paddingHorizontal: 20,
    },
    buttonContainer: {
        paddingHorizontal: 20,
    justifyContent:"flex-end"
      
      },
      bottomButton: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
      },
      testListWrapper: {
        marginTop: 20,
        paddingHorizontal: 20,
      },
      
      testInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      
      testListWrapper: {
        marginTop: 20,
        paddingHorizontal: 20,
      },
      
      testInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      
      },
      
      input: {
        // Reduced height
        marginRight: 10,   // Space between input and button
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
        paddingLeft: 10,
      },
      
      plusButton: {
        // backgroundColor: '#007BFF',
        width: 40,         // Smaller button size
        height: 40,        // Smaller button size
        borderRadius: 20,  // Circular button
        justifyContent: 'center',
        alignItems: 'center',
      },
      performanceText: {
        borderColor: '#D9D9D9', // or any color you want
        borderWidth: 1,
        paddingVertical: 8,
        marginTop: 20,
        borderRadius: 30, 
        width:"60%",
        textAlign: 'center',      // centers the text inside the box
        alignSelf: 'center',
      },
      performanceText1: {
        borderColor: '#D9D9D9', // or any color you want
        borderWidth: 1,
        paddingVertical: 8,
        marginTop: 20,
        borderRadius: 30, 
        backgroundColor:"#f2f3f4"
      
      }, 
      
      plusText: {
        color: '#000000',
        fontSize: 24,      // Larger "+" icon for better visibility
        fontWeight: 'bold',
      },
      
    textContainer: {
      marginLeft: 12,
    },
    nameText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
    },
    // locationText: {
    //   fontSize: 14,
    //   color: '#666',
    //   marginTop: 4,
    // },
  });
  