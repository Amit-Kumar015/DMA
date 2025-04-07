import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
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

const MemberScreen = () => {
  const [step, setStep] = useState(0);
  const {theme} = useTheme();
  const [batch, setBatch] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [profilePic, setProfilePic] = useState();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  console.log('batch/', batch);
  console.log('set', selectedBatch);
  console.log('seta', setSelectedBatch);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      //  const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNTg0OTIwLCJpYXQiOjE3NDI5ODAxMjAsImp0aSI6ImQwMjFjZmE0OWNiYzQyOWU4YTczYjNiMGRlNDQxNGQyIiwidXNlcl9pZCI6ImEzMWY3NzZlLWVmYWUtNGIyOS1hZDIzLTZjMDU4MDhiMWIwNCJ9.S0F4ThB3BLl0_4s-kXBdeaOj_FqiTfS6q5PIsmkwnkQ';
      const accessToken = await AuthStorage.getAccessToken();
      // Debugging: Check if token exists
      if (!accessToken) {
        console.error('Error: Access token is missing!');
        return;
      }

      console.log('Using Access Token:', accessToken); // Debugging ✅

      const response = await fetch(
        'http://52.70.194.52/api/core/business/members/d9ac13db-747d-4966-bf4b-7929cfa4bdbb/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return;
      }

      const data = await response.json();
      console.log('Fetched Members:', data);
      setMembers(data.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };
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

  //   const handleAssignBatch = async () => {
  //     console.log('✅ Selected Batch ID:', selectedBatch);
  //     console.log('✅ Selected Member ID:', selectedMember); // Debugging

  //     if (!selectedBatch) {
  //         console.error('Error: No batch selected!');
  //         return;
  //     }

  //     if (!selectedMember) {
  //         console.error('Error: No member selected!');
  //         return;
  //     }

  //     try {
  //         const accessToken = await AuthStorage.getAccessToken();
  //         console.log('🔹 Access Token:', accessToken);

  //         if (!accessToken) {
  //             console.error('Error: Missing access token!');
  //             return;
  //         }

  //         // ✅ Ensure user ID is encoded correctly
  //         const memberId = encodeURIComponent(selectedMember.trim().toLowerCase());
  //         console.log('🔹 Final API URL:', `http://52.70.194.52/api/attendance/assign-batch/${selectedBatch}/${memberId}/`);

  //         const response = await fetch(
  //             `http://52.70.194.52/api/attendance/assign-batch/${memberId}/${selectedBatch}/`,
  //             {
  //                 method: 'POST',
  //                 headers: {
  //                     'Authorization': `Bearer ${accessToken}`,
  //                     'Content-Type': 'application/json',
  //                 },
  //             }
  //         );

  //         const responseText = await response.text(); // Get raw response first
  //         console.log('🔹 Raw Response:', responseText);

  //         const data = JSON.parse(responseText); // Parse JSON manually
  //         console.log('✅ Batch Assign Response:', data);

  //         if (!response.ok) {
  //             console.error(`⚠️ API Error:`, data);
  //             alert('Failed to assign batch. Please try again.');
  //             return;
  //         }

  //         alert(data.message || 'Batch assigned successfully!');
  //         setStep(0);

  //     } catch (error) {
  //         console.error('🚨 Error assigning batch:', error.message);
  //         alert('Failed to assign batch. Please try again.');
  //     }
  // };
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
    <View style={styles.container}>
      {step === 0 && <Header showBack={true} title="Members" />}
      {step === 0 && (
        <>
          {/* <FlatList
     data={batches} 
     keyExtractor={(item) => item.id.toString()}
     renderItem={({ item }) => (
      <View style={{paddingHorizontal:10}}>
       <Card third style={styles.card}>
         <Text h4 bold>{item.name}</Text>
         <Text h5>{item.description}</Text>
       </Card>
       </View>
     )}
   /> */}
          {members.length > 0 ? (
            <FlatList
              data={members}
              keyExtractor={item => item.user_id}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMember(item.user_id);
                    setStep(1);
                  }}
                  style={{paddingHorizontal: 10}}>
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
                      {/* ✅ Profile Image */}
                      {item.personal_info?.profile_pic ? (
                        <Avatar
                          size={wp('10%')}
                          rounded
                          activeOpacity={0.7}
                          overlayContainerStyle={{
                            backgroundColor: '#D9D9D9',
                            borderColor: theme.$secondaryText,
                            borderWidth: 1,
                          }}
                          source={{uri: item.personal_info.profile_pic}}
                        />
                      ) : (
                        <View
                          style={[
                            styles.profileImage,
                            styles.placeholderImage,
                          ]}>
                          <Text style={{color: '#fff'}}>
                            {item.user_name.charAt(0)}
                          </Text>
                        </View>
                      )}

                      {/* ✅ Member Name and Batch */}
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <Text h4 bold>
                          {item.user_name}
                        </Text>
                        {item.personal_info?.gender && (
                          <Text h4 bold>
                            {item.personal_info.gender.toLowerCase() === 'male'
                              ? 'M'
                              : item.personal_info.gender.toLowerCase() ===
                                'female'
                              ? 'F'
                              : ''}
                          </Text>
                        )}
                        {item.batch_name && <Text h5>{item.batch_name}</Text>}
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              )}
            />
          ) : (
            // <Text style={{textAlign: 'center', marginTop: 20}}>
            //   No members found.
            // </Text>
            <ActivityIndicator style={top=10} />
          )}

          <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
            <PrimaryButton
              title="Add"
              icon={<Icon name="plus" type="feather" size={15} color="white" />}
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
                <Avatar
                  size={wp('25%')}
                  rounded
                  activeOpacity={0.7}
                  overlayContainerStyle={{
                    backgroundColor: '#D9D9D9',
                    borderColor: '#000',
                    borderWidth: 1,
                  }}
                />
                <TouchableOpacity onPress={''} style={styles.cameraIcon}>
                  <Icon
                    name="camera"
                    size={wp('10%')}
                    color={theme.$secondaryText}
                  />
                </TouchableOpacity>
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
              onPress={''}
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
    </View>
  );
};

export default MemberScreen;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#ffffff',
    padding: hp('2%'),
    //   paddingHorizontal:16
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
    fontSize: 14,
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
});
