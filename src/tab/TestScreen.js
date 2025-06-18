import {
  Alert,
    FlatList,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    ToastAndroid,
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
import Icons from 'react-native-vector-icons/MaterialIcons';
import ContributorsCard from '../component/slideCard';

const TestScreen = () => {
  const [testInputs, setTestInputs] = useState([]); // to store submitted test names
  console.log(testInputs,"tesin")
  const [newTestName, setNewTestName] = useState(''); 
  const[testTypes, setTestTypes] = useState(['']);   // for subtest types
  const [allTests, setAllTests] = useState([]);
  const [editingTestIndex, setEditingTestIndex] = useState(null); // optional
console.log("all",allTests)
const [selectedMainTaskId, setSelectedMainTaskId] = useState(null);
console.log("sefff",selectedMainTaskId)
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
const [editedSubtests, setEditedSubtests] = useState([]); 
    console.log("storeProfile",storedProfile)
const [members, setMembers] = useState([]);
const [showMemberList, setShowMemberList] = useState(false);
const [selectedMembers, setSelectedMembers] = useState([]);
const [assignedMembers, setAssignedMembers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [testData, setTestData] = useState(null); // complete response
const [subTaskAnswers, setSubTaskAnswers] = useState({});

console.log("ssss",selectedUser)
const [showAssignedMembersModal, setShowAssignedMembersModal] = useState(false)
  console.log("members",members)
const toggleSelectMember = (memberId) => {
  setSelectedMembers((prev) =>
    prev.includes(memberId)
      ? prev.filter((id) => id !== memberId)
      : [...prev, memberId]
  );
};

const handleAssignMembers = async () => {
  try {
    if (selectedMembers.length === 0) {
      Alert.alert('Please select at least one member.');
      return;
    }

    const formData = new FormData();

    selectedMembers.forEach((id) => {
      formData.append('assigned_to', id); // API expects repeated keys for multiple values
    });

    const accessToken = await AuthStorage.getAccessToken();

    const response = await fetch(
      `http://52.70.194.52/api/core/maintask/${selectedMainTaskId}/assign/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Don't manually set 'Content-Type' for FormData
        },
        body: formData,
      }
    );

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      Alert.alert('Server returned an unexpected response.');
      return;
    }

    if (response.ok) {
      console.log('Success:', data);
      Alert.alert('Members assigned successfully!');
      setSelectedMembers([]); // Clear selected checkboxes
      setStep(0); // Reset to the first step/page
    } else {
      console.error('Failed:', data);
      Alert.alert('Failed to assign members.');
    }
  } catch (error) {
    console.error('Error assigning members:', error);
    Alert.alert('Error occurred while assigning.');
  }
};


  const handleTestTypeChange = (text, index) => {
  const updated = [...testTypes];
  updated[index] = text;
  setTestTypes(updated);
};

const addTestInput = () => {
  setTestTypes([...testTypes, '']);
};
    
const fetchTestData = async (mainTaskId, userId) => {
  try {
    const accessToken = await AuthStorage.getAccessToken();

    const response = await fetch(
      `http://52.70.194.52/api/core/business/tasks/${mainTaskId}/submit-answers/${userId}/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch assigned member data');

    const data = await response.json();
    setTestData(data);

    // Fill subTaskAnswers with existing answers or empty
    const initialAnswers = {};
    data.sub_tasks.forEach((task) => {
      initialAnswers[task.id] = task.answer ?? '';
    });
    setSubTaskAnswers(initialAnswers);
  } catch (error) {
    console.error('Error fetching assigned member data:', error);
    Alert.alert('Error', 'Could not fetch assigned member data.');
  }
};


// useEffect(() => {
//     fetchTestData();

// }, [])
const fetchAssignedMembers = async (mainTaskId) => {
  try {
    const accessToken = await AuthStorage.getAccessToken();
    console.log("Fetching members for MainTask ID:", mainTaskId);

    const response = await fetch(
      `http://52.70.194.52/api/core/maintask/${mainTaskId}/assign/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch assigned members');
    }

    const data = await response.json();
    console.log('Assigned Members:', data);
    setAssignedMembers(data || []);
    setSelectedMainTaskId(mainTaskId); // ✅ Set it here after successful fetch
    setStep(4)
  } catch (error) {
    console.error('Error fetching assigned members:', error);
    Alert.alert('Error', 'Could not fetch assigned members.');
  }
};

const fetchBusinessMembers = async () => {
  try {
    const businessId = storedProfile?.businessinfo?.id;

    if (!businessId) {
      Alert.alert('Error', 'Business ID not found.');
      return;
    }

    const accessToken = await AuthStorage.getAccessToken();

    const response = await fetch(`http://52.70.194.52/api/core/business/members/${businessId}/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }

    const data = await response.json();
    setMembers(data.members); // ✅ fix: extract array from object
    setShowMemberList(true);
    setStep(3);
  } catch (error) {
    console.error('Error fetching members:', error);
    Alert.alert('Error', 'Could not fetch member list.');
  }
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
const createMainTask = async () => {
  try {
    if (!newTestName.trim()) {
      showMessage({
        message: 'Test name cannot be empty.',
        type: 'danger',
        duration: 3000,
        theme: 'theme',
      });
      return;
    }

    const accessToken = await AuthStorage.getAccessToken();

    const formData = new FormData();
    formData.append('title', newTestName);

    const response = await fetch('http://52.70.194.52/api/core/maintask/create/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || 'Failed to create main task.');
    }

    console.log('API create response:', data);

  setAllTests(prevTests => [
      ...prevTests,
      {
        id: data?.id,
        name: data?.title,         // mapping API field `title` to `name`
        subtests: data?.sub_tasks || [],
      }
    ]);

    setNewTestName('');
    showMessage({
      message: 'Main task created successfully',
      type: 'success',
      duration: 3000,
      theme: 'theme',
    });
    setStep(0);
  } catch (error) {
    console.error('Failed to create main task:', error.message);
    showMessage({
      message: error.message || 'Failed to create main task. Please try again.',
      type: 'danger',
      duration: 3000,
      theme: 'theme',
    });
  }
};


const fetchMainTasks = async () => {
  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await fetch('http://52.70.194.52/api/core/maintask/create/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || 'Failed to fetch main tasks');
    }

    console.log('Fetched tasks:', data);
    
setAllTests(
  data.map((item) => ({
    id: item.id,
    name: item.title,
    subtests: item.sub_tasks || [],
  }))
);

  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    showMessage({
      message: 'Failed to fetch main tasks. Please try again.',
      type: 'danger',
      duration: 3000,
    });
  }
};

useEffect(() => {
  fetchMainTasks();
}, []);
// useEffect(() => {
//   createSubTask();
// }, []);
const createSubTask = async () => {
  if (!selectedMainTaskId) {
    showMessage({
      message: 'Main task not selected',
      type: 'danger',
    });
    return;
  }

  try {
    const accessToken = await AuthStorage.getAccessToken();

    for (const title of testTypes) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', ''); // Optional, or add a description field
      formData.append('main_task', selectedMainTaskId);

      const response = await fetch('http://52.70.194.52/api/core/subtask/create/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || 'Failed to create subtask');
      }
    }

    showMessage({
      message: 'All subtasks created successfully',
      type: 'success',
      duration: 3000,
      theme:theme
    });

    // Optional: refresh list or go back
    setStep(0);
    fetchMainTasks();

  } catch (error) {
    console.error('Subtask error:', error.message);
    showMessage({
      message: error.message || 'Error creating subtask',
      type: 'danger',
        duration: 3000,
      theme:theme
    });
  }
};
const handleSubmitAnswers = async (userId) => {
  if (!userId) {
    console.error("❌ User ID is undefined!");
    return;
  }

  const payload = {
    answers: testData.sub_tasks.map((subTask) => {
      const answer = subTaskAnswers[subTask.id] || '';
      return {
        subtask_id: subTask.id,
        answer,
      };
    }),
  };

  try {
    const accessToken = await AuthStorage.getAccessToken();
    const url = `http://52.70.194.52/api/core/business/tasks/${testData.id}/submit-answers/${userId}/`;

    console.log('🔐 Access Token:', accessToken);
    console.log('🌐 URL:', url);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ API Error Response:', responseData);
    } else {
      console.log('✅ Submitted successfully:', responseData);
        showMessage({
      message: 'Data Updated Successfully',
      type: 'success',
      duration: 3000,
      theme:theme
    });
    setStep(0)
    }
  } catch (error) {
    console.error('🚨 Network or Runtime error:', error);
  }
};


useEffect(() => {
  console.log('📌 selectedMainTaskId updated:', selectedMainTaskId);
}, [selectedMainTaskId]);
const uniqueAssignedUsers = Array.from(
  new Map(
    (assignedMembers.assigned_users || []).map((item) => [item.user_id, item])
  ).values()
);
  return (
   <SafeAreaView
                      style={[
                        styles.container,
                        { backgroundColor: theme.$background }, // ✅ dynamic background color
                      ]}
                    >
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
     <FlatList
  data={allTests}
  keyExtractor={(item, index) => item.id || index.toString()}
  contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
  renderItem={({ item, index }) => (
<ButtonWithPushBack
  onPress={() => {
    setSelectedMainTaskId(item.id);
    setEditingTestIndex(index);
  setTestInputs(item); 
setSelectedMainTaskId(item.id); 
    setStep(2);
  }}

>
<ContributorsCard
  title={`${item.name}`}
  contributors={
    Array.isArray(item.subtests) && item.subtests.length > 0
      ? item.subtests.map((subtest, subtestIndex) => ({
          id: subtest.id || subtestIndex,
          name: subtest.title,
          subtitle: '',
          isYou: false,
        }))
      : []
  }
  showAddIcon={true}
  onAddPress={() => {
    setSelectedMainTaskId(item.id); // ✅ Ensure ID is set
    fetchBusinessMembers();         // Then fetch members
  }}
    onViewPress={() => {
     setSelectedMainTaskId(item.id);
  fetchAssignedMembers(item.id);
  }}
/>


</ButtonWithPushBack>
  )}
  ListEmptyComponent={
    <Text style={{ textAlign: 'center', marginTop: 12, color: 'gray' }}>
      No tests created yet.
    </Text>
  }
/>
    </>
  )}
  {step === 0 && (
  <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
    <PrimaryButton
      title="Add"
      icon={<Icon name="plus" type="feather" size={15} color="white" />}
      onPress={() => {
        setStep(1);
      }}
    />
  </ButtonWithPushBack>
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
            {/* <View style={styles.textContainer}>
              <Text h4 bold style={styles.nameText}>
                {storedProfile.first_name ?? '--'} {storedProfile.last_name ?? '--'}
              </Text>
              <Text style={styles.locationText}>
                {storedProfile.personalinfo?.location ?? 'Location not set'}
              </Text>
            </View> */}
          </>
        )}
      </View>

      <Text h4 semiBold textAliments="center" style={styles.performanceText}>
        Performance Update
      </Text>

      <Text h4 semiBold textAliments="center" customColor="black" style={styles.performanceText1}>
        Test Name
      </Text>

<View style={{ alignItems: 'center', marginTop: 20 }}>
  <Custominput
    placeholder="Enter Test Name"
    value={newTestName}
    onValueChange={(text) => setNewTestName(text)}
    width={"80%"}
    height={"5%"}
  />
</View>

      <View style={styles.bottomButton}>
        <ButtonWithPushBack customContainerStyle={{ width: '100%' }}>
        <PrimaryButton
  title="Create Test"
  onPress={() => {
    // if (newTestName.trim()) {
    //   const createdTest = {
    //     name: newTestName.trim(),
    //     subtests: [],
    //   };
    //   const updatedTests = [...allTests, createdTest];
    //   setAllTests(updatedTests);
    //   setEditingTestIndex(updatedTests.length - 1); // Set to last index
    //   setTestInputs([newTestName.trim()]);
    //   setTestTypes(['']);
    //   setNewTestName('');
    //   setStep(0) // ✅ Go directly to step 2 to add subtests
    // }
    createMainTask()
  }}
/>

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
        </>
      )}
    </View>

    <Text h4 semiBold customColor="black"  textAliments="center" style={styles.performanceText}>
      Performance Update
    </Text>

<Text h4 semiBold customColor="black"  textAliments="center" style={styles.performanceText1}>
  {testInputs?.name || 'Test Name'}
</Text>

    <FlatList
    data={testTypes}
    keyExtractor={(_, index) => index.toString()}
    contentContainerStyle={styles.testListWrapper}
    renderItem={({ item, index }) => (
      <View style={styles.testInputRow}>
        <Custominput
          placeholder="Enter Subtest Type"
          value={item}
          onValueChange={(text) => handleTestTypeChange(text, index)}
          width="70%"
          height="5%"
        />
        {index === testTypes.length - 1 && (
          <TouchableOpacity onPress={addTestInput} style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      )}
    />

    <View style={styles.bottomButton}>
      <ButtonWithPushBack customContainerStyle={{ width: '100%' }}>
        <PrimaryButton title="Submit Tests" onPress={createSubTask} />
      </ButtonWithPushBack>
    </View>
  </Slide>
)}
{step === 3 && (
  <Slide index={3}>
    <Header
      showBack={true}
      title="Members"
      customBackEvent={() => setStep(1)}
    />

    <View style={styles.avatarWrapper}>
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
              ? { uri: storedProfile.profile_pic }
              : require('../assets/icon/profiles.png')
          }
        />
      )}
    </View>

<FlatList
  data={members}
  keyExtractor={(item) => item.user_id}
  contentContainerStyle={styles.testListWrapper}
  renderItem={({ item }) => {
    const isSelected = selectedMembers.includes(item.user_id);
    const profilePic = item?.personal_info?.profile_pic;
    const initialLetter = item.user_name?.charAt(0).toUpperCase();

    return (
      <TouchableOpacity
        style={[
          styles.memberItem,
          isSelected && styles.memberItemSelected,
        ]}
        onPress={() => toggleSelectMember(item.user_id)}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Avatar + Name */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar
              size={40}
              rounded
              title={profilePic ? undefined : initialLetter}
              titleStyle={{ color: '#888888' }}
              overlayContainerStyle={{
                backgroundColor: theme.$surface,
                borderColor: theme.$secondaryText,
                borderWidth: 1,
              }}
              source={profilePic ? { uri: profilePic } : null}
            />
            <Text style={[styles.memberName, { marginLeft: 10 }]}>
              {item.user_name}
            </Text>
          </View>

          {/* Checkbox Icon */}
          <Text style={{ fontSize: 20 }}>
            {isSelected ? '✅' : '⬜️'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }}
/>




    <View style={styles.bottomButton}>
      <ButtonWithPushBack customContainerStyle={{ width: '100%' }}>
        <PrimaryButton title="Assign members" onPress={handleAssignMembers} />
      </ButtonWithPushBack>
    </View>
  </Slide>
)}

{step === 4 && (
  <Slide index={4} style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      <Header
        showBack={true}
        title="Members"
        customBackEvent={() => setStep(1)}
      />

      <View style={styles.avatarWrapper}>
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
                ? { uri: storedProfile.profile_pic }
                : require('../assets/icon/profiles.png')
            }
          />
        )}
      </View>

      <View style={{ flex: 1, marginTop: 5 }}>
        <FlatList
          data={uniqueAssignedUsers}
          keyExtractor={(item) => item.user_id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 80,
          }}
          renderItem={({ item }) => {
            const profilePic = item?.personal_info?.profile_pic;
            const initialLetter = item.username?.charAt(0).toUpperCase();

            return (
              <TouchableOpacity
                style={styles.memberItem}
                onPress={() => {
                  setSelectedUser(item);
                 fetchTestData(selectedMainTaskId, item.user_id);
                  setStep(5);
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Avatar
                    size={40}
                    rounded
                    title={profilePic ? undefined : initialLetter}
                    titleStyle={{ color: '#888888' }}
                    overlayContainerStyle={{
                      backgroundColor: theme.$surface,
                      borderColor: theme.$secondaryText,
                      borderWidth: 1,
                    }}
                    source={profilePic ? { uri: profilePic } : null}
                  />
                  <Text style={[styles.memberName, { marginLeft: 10 }]}>
                    {item.username}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  </Slide>
)}

{step === 5 && selectedUser && (
  <Slide index={5} style={{ flex: 1, padding: 16 }}>
   
    {/* Header */}
    <Header showBack={true}    title={storedProfile?.username ?? '--'} customBackEvent={() => setStep(4)} />

    {/* Avatar + Username */}
    <View style={{ alignItems: 'center', marginBottom: 16 }}>
      {selectedUser?.personal_info?.profile_pic ? (
        <Avatar
          size={100}
          rounded
          source={{ uri: selectedUser.personal_info.profile_pic }}
        />
      ) : (
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text h1 customColor="black" >
            {selectedUser.username?.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text h4 semiBold textAliments="center" style={styles.performanceText}>
        {selectedUser.username}
      </Text>
    </View>
     <ScrollView
      contentContainerStyle={{  paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
 {testData && (
  <View
    style={{
      backgroundColor: '#f2f3f4',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
      // marginBottom: 24,
      marginTop: 16,
    }}
  >
    {/* Title */}
    <Text h3 bold
     customColor="black" 
      style={{
     
        textAlign: 'center',
        marginBottom: 20,
      }}
    >
      {testData.title}
    </Text>

    {/* Dynamic Subtasks */}
   {testData.sub_tasks.map((subTask, index) => (
  <View
  key={subTask.id}
  style={{
    // backgroundColor: '#f9f9f9',
    // paddingVertical: 12,
    paddingHorizontal: 16,
      // borderRadius: 10,
    borderRadius: 12,
    marginBottom: index < testData.sub_tasks.length - 1 ? 12 : 0,
  }}
>
  {/* Title - Top Right */}
  <View style={{ alignItems: 'flex-end', marginBottom: 5 }}>
    <View
      style={{
       backgroundColor: '#333',
          borderRadius: 4,
          paddingVertical: 2,
          paddingHorizontal: 10,
        top:10
      }}
    >
      <Text h5 thin style={{color:"white"}}>{subTask.title}</Text>
    </View>
  </View>

  {/* Input field */}
  <Custominput
    placeholder="Enter your answer"
    value={subTaskAnswers[subTask.id]}
    onValueChange={(text) =>
      setSubTaskAnswers((prev) => ({
        ...prev,
        [subTask.id]: text,
      }))
    }
    width="75%"
    height="5%"
  />
</View>

))}

    {/* Update Button */}
    <ButtonWithPushBack customContainerStyle={{ marginTop: 40 }}>
    <PrimaryButton
      title="Update"
      buttonStyle={{ width: '80%', alignSelf: 'center' }}
      onPress={() => {
      console.log("Selected User Object:", selectedUser);
  console.log("Selected User ID:", selectedUser?.user_id); // use `user_id` not `id`
  handleSubmitAnswers(selectedUser?.user_id);

        // Trigger API or navigation
      }}
    />
  </ButtonWithPushBack>
  </View>
)}

    </ScrollView>

  </Slide>
)}



</SafeAreaView>


  )
}
export default TestScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#fff',
      paddingHorizontal:16
    },
    avatarWrapper: {
     
      alignItems: 'center',
      marginTop: 10,
      paddingHorizontal: 20,
    },
    memberItem: {
  padding: 12,
  backgroundColor: '#f0f0f0',
  borderRadius: 6,
  marginBottom: 8,
},

memberItemSelected: {
  backgroundColor: '#d1ecf1',
  borderColor: '#17a2b8',
  borderWidth: 1,
},

memberName: {
  fontSize: 16,
  color: '#333',
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
        paddingHorizontal:16
      },
        buttonContainers: {
    position: 'absolute',
    bottom: hp('10'),
    right: wp('7%'),
  },
      testListWrapper: {
        // marginTop: 20,
        // paddingHorizontal: 20,
        justifyContent:"center"
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
  