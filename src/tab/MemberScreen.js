import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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

const MemberScreen = () => {
  const [step, setStep] = useState(0);
  const {theme} = useTheme();
  const [batch, setBatch] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [profilePic, setProfilePic] = useState();
  const [members, setMembers] = useState([]);
  console.log("batch/",batch)
  console.log("set",selectedBatch)
  console.log("seta",setSelectedBatch)

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTE3NDE3LCJpYXQiOjE3NDMzMTI2MTcsImp0aSI6ImU1MDJlNDU0NmEzZTRmNDBiODEyY2U2NzcwZWNkZTdkIiwidXNlcl9pZCI6ImFjNjY4YWJlLTMxMjgtNGZhOS1hZTJkLWFiOGFjYWRhMGYyNSJ9.8kXp3L8laYpJAQ6qNJ3-rNIVbI7ZOjVCwZwMsE2vf-w';
      const accessToken = await AuthStorage.getAccessToken();
      // Debugging: Check if token exists
      if (!accessToken) {
        console.error('Error: Access token is missing!');
        return;
      }
  
      console.log('Using Access Token:', accessToken); // Debugging ✅
  
      const response = await fetch(
        'http://52.70.194.52/api/core/business/members/fd3cb611-6b5c-4f3c-b6a9-fe5135e1fede/',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return;
      }
  
      const data = await response.json();
      console.log('Fetched Members:', data);
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };
  
  // const fetchBatches = async () => {
  //   try {
  //     const accessToken = await AuthStorage.getAccessToken();
  //     const response = await fetch(
  //       'http://52.70.194.52/api/attendance/batches/',
  //       {
  //         method: 'GET',
  //         headers: {Authorization: `Bearer ${accessToken}`},
  //       },
  //     );
  //     const data = await response.json();
  //     console.log('Fetched Batches:', data); // ✅ Debugging
  //     setBatch(data || []); // ✅ Ensure array format
  //   } catch (error) {
  //     console.error('Error fetching batches:', error);
  //   }
  // };

  const fetchBatches = async () => {
    try {
     const accessToken = await AuthStorage.getAccessToken();
      // const accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNTg0OTIwLCJpYXQiOjE3NDI5ODAxMjAsImp0aSI6ImQwMjFjZmE0OWNiYzQyOWU4YTczYjNiMGRlNDQxNGQyIiwidXNlcl9pZCIsggg6ImEzMWY3NzZlLWVmYWUtNGIyOS1hZDIzLTZjMDU4MDhiMWIwNCJ9.S0F4ThB3BLl0_4s-kXBdeaOj_FqiTfS6q5PIsmkwnkQ"
      const response = await fetch(
        'http://52.70.194.52/api/attendance/batches/',
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      
      const data = await response.json();  // <--- Ensure data is defined
      
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
    console.log('Selected Batch:', selectedBatch); // Debugging Log ✅
  
    if (!selectedBatch) {
      console.error('Error: No batch selected!');
      return;
    }
  
    const memberId = 'e6e067e0-1566-45e0-9200-05172239d206';
    const batchId = selectedBatch;
  
    try {
      const accessToken = await AuthStorage.getAccessToken();
  
      if (!accessToken) {
        console.error('Error: Missing access token!');
        return;
      }
  
      console.log('Assigning Member:', { batchId, memberId });
  
      const response = await fetch(
        ` 'http://52.70.194.52/api/attendance/assign-batch/5957921e-0682-45d1-9cdf-0d0c01184787/e6e067e0-1566-45e0-9200-05172239d206/'/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('API Error:', data);
        return;
      }
  
      console.log('Batch Assigned Successfully:', data);
      
      // ✅ Show a success message (e.g., Toast)
      alert('Batch assigned successfully!');
  
      // ✅ Optionally navigate back
      setStep(0);
  
    } catch (error) {
      console.error('Error assigning batch:', error.message);
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
            key: String(item.id),  // Ensure ID is a string
            value: item.name,
          }))}  
          selected={selectedBatch || ""}  // Fallback value
          search={false}
          selectedCb={(uniqueId, selectedData) => {
            console.log('🔹 Selected Batch Key:', selectedData.key);
            if (selectedData.key) {
              setSelectedBatch(selectedData.key);
            } else {
              console.error("🚨 Error: Invalid selection");
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
