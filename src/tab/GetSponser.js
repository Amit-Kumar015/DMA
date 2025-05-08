import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import useTheme from '../hooks/useTheme';
import Card from '../component/card';
import {Avatar} from 'react-native-elements';
import Text from '../component/Text';
import Header from '../component/header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Slide from '../assets/slide';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Checkbox from '../component/checkbox';
import axios from 'axios';
import AuthStorage from '../utils/authStorage';
import TextInputEml from '../component/textInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { showMessage } from '../utils/messages/message';

const GetSponser = () => {
  const {theme} = useTheme();
  const [step, setStep] = useState(0);
  const [profilePic, setProfilePic] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  console.log("ser",selectedRole)
  const [sportsName, setSportsName] = useState('');
  const [achievement1, setAchievement1] = useState('');
  const [achievement2, setAchievement2] = useState('');
  const [achievement3, setAchievement3] = useState('');
  const [selectedSponsorTypeId, setSelectedSponsorTypeId] = useState(null);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("dagaP",data)
  const inputRef = useRef(null);
  const sponsorTypes = [
    { id: 1, name: 'Discount Collaboration', value: 'discount' },
    { id: 2, name: 'Barter Collaboration', value: 'barter' },
    { id: 3, name: 'Paid Collaboration', value: 'paid' },
    { id: 4, name: 'Yearly Contract', value: 'yearly' },
  ];
  const productTypes = [
    { id: 1, name: 'Clothing', value: 'clothing' },
    { id: 2, name: 'Supplements', value: 'supplements' },
    { id: 3, name: 'Equipments', value: 'Equipments' },
    { id: 4, name: 'Accessories', value: 'Accessories' },
  ];

  useEffect(() => {
    // Call the API when the component mounts
    const fetchData = async () => {
      const accessToken = await AuthStorage.getAccessToken();
      try {
        const response = await axios.get('http://52.70.194.52/api/core/iam-options/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setData(response.data);  // Set the fetched data to the state
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);  // Set loading to false once the request completes
      }
    };

    fetchData();  // Call the API when the component mounts
  }, []);

  const handlegetSponser = () => {
    const selectedSponsor = sponsorTypes.find(
      type => type.id === selectedSponsorTypeId,
    );

    if (selectedSponsor) {
      console.log('Selected Sponsor Type:', selectedSponsor.name);
    } else {
      console.log('No sponsor type selected.');
    }
    setStep(3);
  };
  const handleSelectRole = roleItem => {
    setSelectedRole(roleItem); 
    setStep(1);
  };
  const isNextDisabled = !(achievement1 && achievement2 && achievement3); // Button is disabled unless all 3 achievements are provided

  const handleCreate = () => {
    if (!achievement1 || !achievement2 || !achievement3) {  // Check if any achievement is missing
      showMessage({
        message: 'Attach all 3 achievements, please.',
        type: 'danger',
        theme: theme,
        duration: 3000,
      });
      return; // Do not proceed if not all achievements are provided
    }
  
    console.log('Created:', {
      sportsName,
      achievement1,
      achievement2,
      achievement3,
    });
  
    setStep(2); // Proceed to next step
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

  const handleSubmit = async () => {
    const selectedSponsor = sponsorTypes.find(item => item.id === selectedSponsorTypeId);
    const selectedProduct = productTypes.find(item => item.id === selectedProductTypeId);
  
    // 🛡️ Validate selectedRole before proceeding
    if (!selectedRole?.id) {
      Alert.alert('Error', 'Please select your role.');
      return;
    }
  
    // 🛠️ Build FormData
    const formData = new FormData();
    formData.append('i_am', selectedRole.id);
    formData.append('user', "");
    formData.append('speciality', sportsName || '');
    formData.append('achievement1', achievement1 || '');
    formData.append('achievement2', achievement2 || '');
    formData.append('achievement3', achievement3 || '');
    formData.append('collaboration_type', selectedSponsor?.value || '');
    formData.append('product_type', selectedProduct?.value || '');
  
    // 🧾 Log formData entries
    console.log('📤 FormData being sent:',formData);
    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }
  
    try {
      const accessToken = await AuthStorage.getAccessToken();
  
      const response = await axios.post(
        'http://52.70.194.52/api/core/sponsor/create/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('📡 Response Status:', response.status);
      console.log('✅ API Response Data:', response.data);
  
      // 🎉 Check for successful creation
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Sponsor created successfully!');
        // Optionally: navigate or update UI with response.data
      } else {
        Alert.alert('Error', response.data?.message || 'Unexpected response from server.');
      }
    } catch (error) {
      console.error('❌ API Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong.');
    }
  };
  
  
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
  return (
    <View style={styles.container}>
      {step === 0 && <Header showBack={true} title= {storedProfile?.username}/>}

      {step === 0 && (
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
          <Avatar
  rounded
  size={wp('25%')}
  source={
    storedProfile?.profile_pic
      ? { uri: storedProfile.profile_pic }
      : require('../assets/icon/profiles.png') // fallback image
  }
/>
           <Text h5 bold textAlign="center">
  {storedProfile?.first_name} {storedProfile?.last_name}
</Text>

          </View>
          <Text style={{marginTop: 50}} h4 bold>
            I am,
          </Text>
        </View>
      )}

      {step === 0 && (
        <FlatList
          data={data}
          keyExtractor={item => item.name}
          numColumns={1}
          contentContainerStyle={styles.cardContainer}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleSelectRole(item)}>
              <Card third style={styles.card}>
                <Text h5 style={styles.nameText}>
                  {item.name}
                </Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}

      {step === 1 && (
        <Slide index={1}>
          <Header
            showBack={true}
            title= {storedProfile?.username}
            customBackEvent={() => setStep(0)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.stepContainer}>
                <View style={styles.avatarWrapper}>
                  <Avatar
                    size={wp('25%')}
                    rounded
                    overlayContainerStyle={{
                      backgroundColor: theme.$surface,
                      borderColor: theme.$secondaryText,
                      borderWidth: 1,
                    }}
                    source={
                      storedProfile?.profile_pic
                        ? { uri: storedProfile.profile_pic }
                        : require('../assets/icon/profiles.png') // fallback image
                    }
                  />
                 <Text h5 bold textAlign="center">{storedProfile?.first_name} {storedProfile?.last_name}</Text>
                </View>

                <Text h4 bold textAlign="center">
  I am a {selectedRole?.name} of
</Text>
                {/* </Card> */}
              </View>
              <View style={styles.inputContainer}>
           
                   <TextInputEml
                ref={inputRef}
                // label="Email or Phone"
              placeholder="sport"
              value={sportsName}
                onChangeText={setSportsName}
              />

                <Text
                  h4
                  bold
                  textAliments="center"
                  style={{marginVertical: 20}}>
                  3 Highest Achievements
                </Text>

             
                       <TextInputEml
                ref={inputRef}
                // label="Email or Phone"
           placeholder="Achievement 1"
           value={achievement1}
                onChangeText={setAchievement1}
              />
                <TextInputEml
                ref={inputRef}
                // label="Email or Phone"
           placeholder="Achievement 2"
           value={achievement2}
                onChangeText={setAchievement2}/>
                         <TextInputEml
                ref={inputRef}
           placeholder="Achievement 3"
           value={achievement3}
                onChangeText={setAchievement3}/>
              </View>
            </ScrollView>
            <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton
  title="Next"
  onPress={handleCreate}
  disabled={isNextDisabled} // This will disable the button when isNextDisabled is true
  customsBg={isNextDisabled ? '#D3D3D3' : '#000000'} // Set background color based on disabled state
/>
            </ButtonWithPushBack>
          </KeyboardAvoidingView>
        </Slide>
      )}
      {step === 2 && (
        <Slide index={2}>
          <Header
            showBack={true}
            title= {storedProfile?.username}
            customBackEvent={() => setStep(1)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.stepContainer}>
                <View style={styles.avatarWrapper}>
                  <Avatar
                    size={wp('25%')}
                    rounded
                    overlayContainerStyle={{
                      backgroundColor: theme.$surface,
                      borderColor: theme.$secondaryText,
                      borderWidth: 1,
                    }}
                    source={
                      storedProfile?.profile_pic
                        ? { uri: storedProfile.profile_pic }
                        : require('../assets/icon/profiles.png') // fallback image
                    }
                  />
                  <Text h5 bold textAlign="center">{storedProfile?.first_name} {storedProfile?.last_name}</Text>
                </View>
                <Text h4 bold textAliments="center">
                  SponserShip Type
                </Text>
                {/* </Card> */}
              </View>
              <View style={{marginTop: 30}}>
                <Text h4 bold style={{top: 10,}}>
                  Select any one
                </Text>
                {sponsorTypes.map(item => (
                  <View
                    key={item.id}
                    style={{marginBottom: 10}}>
                    <Card
                      third
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: '#F2F3F4',
                        borderRadius: 10,
                      }}>
                      <Text h4 bold style={{flex: 1}}>
                        {item.name}
                      </Text>
                      <Checkbox
                        checked={selectedSponsorTypeId === item.id}
                        onPress={() => setSelectedSponsorTypeId(item.id)}
                      />
                    </Card>
                  </View>
                ))}
              </View>
            </ScrollView>
            <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton title="Next" onPress={handlegetSponser} />
          </ButtonWithPushBack>
          </KeyboardAvoidingView>
        </Slide>
      )}
      {step === 3 && (
  <Slide index={3}>
      <Header
            showBack={true}
            title="Prince"
            customBackEvent={() => setStep(1)}
          />

   
<KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.stepContainer}>
                <View style={styles.avatarWrapper}>
                  <Avatar
                    size={wp('25%')}
                    rounded
                    overlayContainerStyle={{
                      backgroundColor: theme.$surface,
                      borderColor: theme.$secondaryText,
                      borderWidth: 1,
                    }}
                    source={require('../assets/icon/profiles.png')}
                  />
                  <Text h4 bold textAliments="center">
                    Prince
                  </Text>
                </View>

                {/* <Card
                  third
                  style={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}> */}
                <Text h4 bold textAliments="center">
                  Product Type
                </Text>
                {/* </Card> */}
              </View>
              <View style={{marginTop: 30}}>
                <Text h4 bold style={{top: 10,}}>
                  Select any one
                </Text>
                {productTypes.map(item => (
                  <View
                    key={item.id}
                    style={{marginBottom: 10}}>
                    <Card
                      third
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: '#F2F3F4',
                        borderRadius: 10,
                      }}>
                      <Text h4 bold style={{flex: 1}}>
                        {item.name}
                      </Text>
                      <Checkbox
                        checked={selectedProductTypeId === item.id}
                        onPress={() => setSelectedProductTypeId(item.id)}
                      />
                    </Card>
                  </View>
                ))}
              </View>
            </ScrollView>
            <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton title="Submit" onPress={handleSubmit} />
          </ButtonWithPushBack>
          </KeyboardAvoidingView>
  </Slide>
)}

    </View>
  );
};

export default GetSponser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor:"white"
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
    
  },
  avatarWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
  cardContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    paddingVertical: 16,
  },
  scrollContainer: {
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  inputContainer: {
    marginVertical: 10,
  },
  buttonContainers: {
    paddingHorizontal: 16,
    bottom: 30,
  },
});
