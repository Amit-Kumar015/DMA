import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
import Header from '../component/header';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Card from '../component/card';
import Icon from '../component/icon';
import Slide from '../assets/slide';
import AuthStorage from '../utils/authStorage';
import SingleSelect from '../component/singleSelect';
import useTheme from '../hooks/useTheme';
import {Avatar} from 'react-native-elements';
import Text from '../component/Text';
import ActivityIndicator from '../assets/activityIndicator';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MemberScreen = () => {
  const [step, setStep] = useState(0);
  const {theme} = useTheme();
  const [batch, setBatch] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  // const [profilePic, setProfilePic] = useState();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedProfilePic, setSelectedProfilePic] = useState('');

   const businessProfile = useSelector(state => state.auth.businessProfile);
    const userData = useSelector(state => state.user.userData);
    console.log('userData', userData);
    const [userType, setUserType] = useState('');
    const profileData = useSelector(state => state.profile.Profile);
    console.log('🙌 Profile Data:', profileData);
    const personalProfile = useSelector(state => state.auth.personalProfile);
    console.log('persinaldata', personalProfile);
    const [profileMessage, setProfileMessage] = useState('');
    const [userName, setUserName] = useState('');
    console.log('usersss', userType);
    console.log('userName', userName);
    console.log('persinaldata', personalProfile);
    const [userId, setUserId] = useState('');
    console.log('userId', userId);
    const [storedProfile, setStoredProfile] = useState(null);
    console.log('storeProfile', storedProfile);
    const [loadingMembers, setLoadingMembers] = useState(true);
// useEffect(() => {
//   if (storedProfile?.businessinfo?.id) {
//     fetchMembers();
//   }
// }, [storedProfile]);

  useEffect(() => {
    fetchBatches();
  }, []);

  // useEffect(() => {
  //   fetchMembers();
  // }, []);
  

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
  // const fetchMembers = async () => {
  //   try {
  //     //  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNTg0OTIwLCJpYXQiOjE3NDI5ODAxMjAsImp0aSI6ImQwMjFjZmE0OWNiYzQyOWU4YTczYjNiMGRlNDQxNGQyIiwidXNlcl9pZCI6ImEzMWY3NzZlLWVmYWUtNGIyOS1hZDIzLTZjMDU4MDhiMWIwNCJ9.S0F4ThB3BLl0_4s-kXBdeaOj_FqiTfS6q5PIsmkwnkQ';
  //     const accessToken = await AuthStorage.getAccessToken();
  //     // Debugging: Check if token exists
  //     if (!accessToken) {
  //       console.error('Error: Access token is missing!');
  //       return;
  //     }

  //     console.log('Using Access Token:', accessToken); // Debugging ✅

  //     const response = await fetch(
  //       'http://52.70.194.52/api/core/business/members/d9ac13db-747d-4966-bf4b-7929cfa4bdbb/',
  //       {
  //         method: 'GET',
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       console.error('API Error:', errorData);
  //       return;
  //     }

  //     const data = await response.json();
  //     console.log('Fetched Members:', data);
  //     setMembers(data.members || []);
      
  //   } catch (error) {
  //     console.error('Error fetching members:', error);
  //   }
  // };
//   const fetchMembers = async () => {
//   try {
//     const accessToken = await AuthStorage.getAccessToken();

//     if (!accessToken) {
//       console.error('❌ Error: Access token is missing!');
//       return;
//     }

//     // Get business ID from storedProfile
//     const businessId = storedProfile?.businessinfo?.id;
//     console.log("bussiness",businessId)

//     if (!businessId) {
//       console.error('❌ Error: Business ID not found in profile');
//       return;
//     }

//     console.log('✅ Using Business ID:', businessId);

//     const response = await fetch(
//       `http://52.70.194.52/api/core/business/members/${businessId}/`,
//       {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('❌ API Error:', errorData);
//       return;
//     }

//     const data = await response.json();
//     console.log('✅ Fetched Members:', data);
//     setMembers(data.members || []);

//   } catch (error) {
//     console.error('❌ Error fetching members:', error);
//   }
// };

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


  const fetchBatches = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      // const accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNTg0OTIwLCJpYXQiOjE3NDI5ODAxMjAsImp0aSI6ImQwMjFjZmE0OWNiYzQyOWU4YTczYjNiMGRlNDQxNGQyIiwidXNlcl9pZCIsggg6ImEzMWY3NzZlLWVmYWUtNGIyOS1hZDIzLTZjMDU4MDhiMWIwNCJ9.S0F4ThB3BLl0_4s-kXBdeaOj_FqiTfS6q5PIsmkwnkQ"
      const response = await fetch(
        'http://52.70.194.52/api/attendance/batches/',
        {
          method: 'GET',
          headers: {Authorization: `Bearer ${accessToken}`},
        },
      );

      const data = await response.json(); // <--- Ensure data is defined

      if (response.ok) {
        console.log('✅ Fetched Batches:', data);
        setBatch(data);
      } else {
        console.error('⚠️ Failed to fetch batches:', data);
      }
    } catch (error) {
      console.error('🚨 Error fetching batches:', error.message);
    }
  };

  const handleAssignBatch = async () => {
    console.log('✅ Selected Batch ID:', selectedBatch);
    console.log('✅ Selected Member ID:', selectedMember);

    if (!selectedBatch) {
      console.error('Error: No batch selected!');
      return;
    }

    if (!selectedMember) {
      console.error('Error: No member selected!');
      return;
    }

    try {
      const accessToken = await AuthStorage.getAccessToken();
      console.log('🔹 Access Token:', accessToken);

      if (!accessToken) {
        console.error('Error: Missing access token!');
        return;
      }

      // ✅ Ensure user ID is encoded correctly
      const memberId = encodeURIComponent(selectedMember.trim().toLowerCase());
      console.log(
        '🔹 Final API URL:',
        `http://52.70.194.52/api/attendance/assign-batch/${memberId}/${selectedBatch}/`,
      );

      const response = await fetch(
        `http://52.70.194.52/api/attendance/assign-batch/${memberId}/${selectedBatch}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const responseText = await response.text(); // Get raw response first
      console.log('🔹 Raw Response:', responseText);

      const data = JSON.parse(responseText); // Parse JSON manually
      console.log('✅ Batch Assign Response:', data);

      if (!response.ok) {
        console.error(`⚠️ API Error:`, data);
        alert('Failed to assign batch. Please try again.');
        return;
      }

      alert(data.message || 'Batch assigned successfully!');

      // ✅ Ensure UI Updates Correctly
      setMembers(prevMembers => {
        const updatedMembers = prevMembers.map(member =>
          member.user_id === selectedMember
            ? {
                ...member,
                batch_name:
                  batch.find(b => b.id === selectedBatch)?.name || 'Unknown',
              }
            : member,
        );
        return [...updatedMembers]; // Ensure new reference for state update
      });

      // ✅ Force FlatList Re-render
      setMembers(prev => [...prev]);

      // ✅ Reset Step After Assignment
      setStep(0);
    } catch (error) {
      console.error('🚨 Error assigning batch:', error.message);
      alert('Failed to assign batch. Please try again.');
    }
  };

  return (
    <SafeAreaView
                style={[
                  styles.container,
                  { backgroundColor: theme.$background }, // ✅ dynamic background color
                ]}
              >
      {step === 0 && <Header showBack={true} title="Members" />}
      {/* {step === 0 && (
        <>
      
          {members.length > 0 ? (
            <FlatList
              data={members}
              keyExtractor={item => item.user_id}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMember(item.user_id);
                    setSelectedProfilePic(item.personal_info?.profile_pic || '');
                    setStep(1);
                  }}
                  style={{paddingHorizontal: 16}}>
                  <Card
                    third
                    style={[
                      styles.card,
                      selectedMember === item.user_id && {
                        backgroundColor: '#ddd',
                      },
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                     
                      <Avatar
  size={wp('10%')}
  rounded
  activeOpacity={0.7}
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

                   
                      <View
  style={{
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}>
  

  <Text
    h4
  customColor="black"
    bold
    style={{
      flex: 1, 
      marginRight: 10,
    }}>
    {item.user_name}
  </Text>
  <Text
    h4
    bold
   customColor="black"
    style={{
      width: 20, // fixed width for alignment
      right:20
    }}>
    {item.personal_info?.gender?.toLowerCase() === 'male'
      ? 'M'
      : item.personal_info?.gender?.toLowerCase() === 'female'
      ? 'F'
      : '–'}
  </Text>

  {/* Batch */}
  {/* {item.batch_name && (
    <Text h5 customColor="black" numberOfLines={1} style={{ marginLeft: 10 }}>
      {item.batch_name}
    </Text>
  )}
</View>

                    </View>
                  </Card>
                </TouchableOpacity>
              )}
            />
          ) : (
            
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
        No Members available.
      </Text>
    </View>
  </View>
          )}

          <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
            <PrimaryButton
              title="Add"
              icon={<Icon name="plus" type="feather" size={15} color={theme.$background} />}
              onPress={() => setStep(1)}
            />
          </ButtonWithPushBack>
        </>
      )}  */}
      {step === 0 && (
  <>
    {loadingMembers ? (
      <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
    ) : members.length > 0 ? (
      <FlatList
        data={members}
        keyExtractor={item => item.user_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedMember(item.user_id);
              setSelectedProfilePic(item.personal_info?.profile_pic || '');
              setStep(1);
            }}
            style={{ paddingHorizontal: 16 }}
          >
            <Card
              third
              style={[
                styles.card,
                selectedMember === item.user_id && {
                  backgroundColor: '#ddd',
                },
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Avatar
                  size={wp('10%')}
                  rounded
                  activeOpacity={0.7}
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

                <View
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    h4
                    bold
                    customColor="black"
                    style={{ flex: 1, marginRight: 10 }}
                  >
                    {item.user_name}
                  </Text>

                  <Text
                    h4
                    bold
                    customColor="black"
                    style={{ width: 20, right: 20 }}
                  >
                    {item.personal_info?.gender?.toLowerCase() === 'male'
                      ? 'M'
                      : item.personal_info?.gender?.toLowerCase() === 'female'
                      ? 'F'
                      : '–'}
                  </Text>

                  {item.batch_name && (
                    <Text
                      h5
                      customColor="black"
                      numberOfLines={1}
                      style={{ marginLeft: 10 }}
                    >
                      {item.batch_name}
                    </Text>
                  )}
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    ) : (
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
            No Members available.
          </Text>
        </View>
      </View>
    )}

    <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
      <PrimaryButton
        title="Add"
        icon={
          <Icon name="plus" type="feather" size={15} color={theme.$background} />
        }
        onPress={() => setStep(1)}
      />
    </ButtonWithPushBack>
  </>
)}

      {step === 1 && (
        <Slide index={1}>
          <Header
            showBack={true}
            title="Add Members"
            customBackEvent={() => setStep(0)}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <View style={styles.avatarWrapper}>
                {/* <Avatar
                  size={wp('25%')}
                  rounded
                  activeOpacity={0.7}
                  overlayContainerStyle={{
                    backgroundColor: '#D9D9D9',
                    borderColor: '#000',
                    borderWidth: 1,
                  }}
                  source={
                    selectedProfilePic
                      ? {uri: selectedProfilePic}
                      : require('../assets/icon/profiles.png') // Optional fallback
                  }
                /> */}
                      
<Avatar
  size={wp('25%')}
  rounded
  activeOpacity={0.7}
  overlayContainerStyle={{
    backgroundColor: '#D9D9D9',
    borderColor: '#000',
    borderWidth: 1,
  }}
  source={selectedProfilePic ? {uri: selectedProfilePic} : undefined}
  title={
    selectedMember && selectedMember.user_name
      ? selectedMember.user_name.charAt(0).toUpperCase() // Get first letter of selected member's name
      : ''
  }
/>


              </View>
              <View style={styles.dropdowm}>
                <Text h4 bold>
                  {' '}
                  Select Batch{' '}
                </Text>
                {batch.length > 0 ? (
                  <SingleSelect
                    arrayData={batch.map(item => ({
                      key: String(item.id), // Ensure ID is a string
                      value: item.name,
                    }))}
                    selectedCb={(key, selectedData) => {
                      console.log('🔹 selectedCb triggered');
                      console.log('🔹 Key:', key);
                      console.log('🔹 Selected Data:', selectedData);

                      if (selectedData?.key) {
                        setSelectedBatch(selectedData.key);
                        // handleBatchClick(selectedData.key); // Fetch batch members
                      } else {
                        console.error(
                          '🚨 Error: Invalid selection',
                          selectedData,
                        );
                      }
                    }}
                  />
                ) : (
                  <Text>Loading batches...</Text>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          {/* 🔹 Buttons placed outside KeyboardAvoidingView at bottom */}
          <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton
              title="Cancel"
            onPress={() => setStep(0)}
              buttonStyle={styles.cancelButton}
            />
            <PrimaryButton
              title="Save"
              onPress={handleAssignBatch}
              buttonStyle={styles.saveButton}
            />
          </ButtonWithPushBack>
        </Slide>
      )}
    </SafeAreaView>
  );
};

export default MemberScreen;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    // backgroundColor: '#ffffff',
    // padding: hp('2%'),
      paddingHorizontal:16
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('10%'),
    position: 'relative',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp('10%'),
    right: wp('7%'),
    paddingHorizontal:16
  },
  buttonContainers: {
    marginVertical: 50,
    //   width: '50%',
    //   alignSelf: 'center',
    justifyContent: 'space-between',
    //   flex:1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    left: 20,
  },
  inputContainer: {
    marginTop: hp('2%'),
  },
  timePickerButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: '#f2f3f4',
  },
  dropdowm: {
    //   flexGrow: 1,
    //   paddingBottom: hp('1%'),
    paddingHorizontal: 16,
    top: 10,
  },
  label: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  
    marginTop: 5,
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,

    marginRight: 10,
    width: '70%',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '70%',
    marginLeft: 10,
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
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: hp('3%'),
    // alignSelf:"center",
    // gap:20
  },
  // avatarWrapper: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: hp('10%'),
  //   position: 'relative',
  // },

});
