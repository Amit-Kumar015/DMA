import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Modal, Alert, SafeAreaView } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import Card from '../component/card';
import { Avatar } from 'react-native-elements';
import Text from '../component/Text';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../component/header';
import useTheme from '../hooks/useTheme';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Slide from '../assets/slide';
import axios from 'axios';
import AuthStorage from '../utils/authStorage';
import ContributorsCard from '../component/slideCard';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import ActivityIndicator from '../assets/activityIndicator';
// const Tournament = [
//   {
//     id: 1,
//     name: 'Cricket League',
//     event_date: '2025-06-10',
//     location: 'Mumbai',
//     personal_info: {
//       name: 'John Doe',
//       profile_pic: 'https://randomuser.me/api/portraits/men/1.jpg',
//     },
//   },
//   {
//     id: 2,
//     name: 'Football Championship',
//     event_date: '2025-07-01',
//     location: 'Delhi',
//     personal_info: {
//       name: 'Jane Smith',
//       profile_pic: '', // No image
//     },
//   },
// ];

const PersonalDataScreen = () => {
  const [step, setStep] = useState(0);
    const {theme} = useTheme();
    const [businesses, setBusinesses] = useState([]);
const [taskCards, setTaskCards] = useState([]);
const [weeklyCard, setWeeklyCards] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
   const [tournaments, setTournaments] = useState(false);
   const [batches, setBatches] = useState([]);
   const [markedDates, setMarkedDates] = useState({});
      const [attendanceData, setAtttedanceData] = useState({});
        const [memberShipPackage, setMemberShipPackage] = useState();
        const [businessLogo, setBusinessLogo] = useState(null);
         const [Announcement, setAnnounceMent] = useState();
         const [loading, setLoading] = useState(true);
        console.log('package', Announcement)
 console.log('bussiness', selectedUser)
const [selectedMonth, setSelectedMonth] = useState(() => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
});
const handleMembership = () => {
  getMembershipPlans(); // store selected plan in state
  setStep(7); // maybe go to next screen/step
};
const handleAnnounceMent = () => {
  getAnnouncement(); // store selected plan in state
  setStep(8); // maybe go to next screen/step
};
  const getMembershipPlans = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken(); // Or replace with your token directly for testing

      const response = await fetch(
        'http://52.70.194.52/api/gym/membership-plans/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log('Fetched Plans:', result);
        setMemberShipPackage(result); // 👈 set to your state
      } else {
        console.error('Error fetching plans:', result);
        showMessage({
          message: 'Failed to fetch membership plans.',
          type: 'danger',
          duration: 3000,
          theme: theme,
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage({
        message: 'Network error while fetching plans.',
        type: 'danger',
        duration: 3000,
        theme: theme,
      });
    }
  };
    const getAnnouncement = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken(); // Or replace with your token directly for testing

      const response = await fetch(
        'http://52.70.194.52/api/gym/announcements/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log('Fetched Plans:', result);
        setAnnounceMent(result); // 👈 set to your state
      } else {
        console.error('Error fetching plans:', result);
        showMessage({
          message: 'Failed to fetch membership plans.',
          type: 'danger',
          duration: 3000,
          theme: theme,
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      showMessage({
        message: 'Network error while fetching plans.',
        type: 'danger',
        duration: 3000,
        theme: theme,
      });
    }
  };
const handleSelectBatch = async (item) => {
  setSelectedUser(item);
  setStep(1);

  const BM_id = item.BM_id;
  const weeklyData = await fetchBusinessWeeklyPlan(BM_id);

  if (weeklyData) {
    setWeeklyPlanData(weeklyData);
    // Render it or use it in your UI as needed
  }
};

// const fetchBusinessWeeklyPlan = async (BM_id) => {
//   try {
//     const accessToken = await AuthStorage.getAccessToken(); // Assuming token is securely stored
//     const response = await axios.get(`http://52.70.194.52/api/attendance/user/business-weekly-plan/${BM_id}/`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     console.log('Weekly Plan Data:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching weekly plan:', error);
//     Alert.alert('Error', 'Failed to fetch business weekly plan.');
//     return null;
//   }
// };
const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const fetchBusinessWeeklyPlan = async (BM_id) => {
  try {
    const accessToken = await AuthStorage.getAccessToken();

    const response = await axios.get(
      `http://52.70.194.52/api/attendance/user/business-weekly-plan/${BM_id}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;

    const formattedData = data.map((task) => {
      // First: group subtasks by day
      const groupedByDay = dayOrder.flatMap((day) =>
        task.sub_tasks
          .filter((subTask) => subTask.day?.trim().toLowerCase() === day.toLowerCase())
          .map((subTask) => ({
            id: subTask.id,
            name: subTask.task_name,
            subtitle: subTask.day,
            isYou: false,
            duration: subTask.duration_minutes,
          }))
      );

      return {
        title: task.name,
        contributors: groupedByDay,
      };
    });

    setWeeklyCards(formattedData);
  } catch (error) {
    console.error('Error fetching weekly plan:', error);
    Alert.alert('Error', 'Failed to fetch business weekly plan.');
  }
};


const fetchUserTasks = async () => {
  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await axios.get('http://52.70.194.52/api/core/user-tasks/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const formattedData = response.data.map((task) => ({
      title: task.title, // e.g., "Volleyball"
      contributors: task.sub_tasks.map((sub, index) => ({
        id: sub.id,
        name: sub.title,
       subtitle: sub.answer?.trim() ? sub.answer : 'Incomplete',
        isYou: false,
      })),
    }));

    setTaskCards(formattedData);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
};

useEffect(() => {
  fetchUserTasks();
  fetchUserData()
}, []);
// const getAttendanceLogs = async (bmId) => {
//   console.log('Calling getAttendanceLogs...',bmId);
//   try {
//     const accessToken = await AuthStorage.getAccessToken();
//     const response = await fetch(
//       `http://52.70.194.52/api/attendance/user/attendance-logs/${bmId}/?month=2025-04`,
//       {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const data = await response.json();

//     if (response.ok) {
//       console.log('Attendance Data:', data);
//       // Do something with the data
//     } else {
//       console.error('Error:', data);
//     }
//   } catch (error) {
//     console.error('Fetch Error:', error);
//   }
// };

const getAttendanceLogs = async (bmId, month) => {
  console.log('Calling getAttendanceLogs with BM_ID:', bmId, 'and month:', month);

  try {
    const accessToken = await AuthStorage.getAccessToken();
    const url = `http://52.70.194.52/api/attendance/user/attendance-logs/${bmId}/?month=${month}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Attendance Data:', data);

      const markings = {};

      data.attendance.forEach(item => {
        markings[item.date] = {
          customStyles: {
            container: {
              backgroundColor:
                item.status === 'present'
                  ? '#22c55e'
                  : item.status === 'absent'
                  ? '#ef4444'
                  : '#facc15',
            },
            text: {
              color: '#fff',
              fontWeight: 'bold',
            },
          },
        };
      });

      setMarkedDates(markings);
    } else {
      const errorText = await response.text();
      console.error('Fetch failed. Status:', response.status, 'Message:', errorText);
    }
  } catch (error) {
    console.error('Fetch Error:', error);
  }
};

const fetchUserData = async () => {
  setLoading(true);
  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await axios.get('http://52.70.194.52/api/core/user-connected-businesses/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
   console.log('userDta:', response.data); 
    setBusinesses(response.data);
     } catch (error) {
       console.error('Error fetching diet plan:', error);
       Alert.alert('Error', 'Failed to fetch diet plan.');
     }
       setLoading(false);
   };
   const fetchTournaments = async (bmId) => {
  try {
    const accessToken = await AuthStorage.getAccessToken();
    // console.log(bmId,"bmid")
    const response = await axios.get(`http://52.70.194.52/api/core/user/view-tournaments/${bmId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Tournaments:', response.data);
    // Save to state or navigate to next screen with data
    setTournaments(response.data);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    Alert.alert('Error', 'Failed to fetch tournaments.');
  }
};
const handleTournamentClick = () => {
  const bmId = businesses[0]?.BM_id; // Access first business
  // console.log("bm", bmId);
  if (bmId) {
    fetchTournaments(bmId);
    setStep(4)
  } else {
    Alert.alert('Error', 'No business selected');
  }
};
// const handleAttendenceClick = () => {
//   const bmId = businesses[0]?.BM_id; // Access first business
//   // console.log("bm", bmId);
//   if (bmId) {
//     getAttendanceLogs(bmId);
//     setStep(2)
//   } else {
//     Alert.alert('Error', 'No business selected');
//   }
// };
// useEffect(() => {
//   const bmId = businesses[0]?.BM_id;
//   if (bmId) {
//     getAttendanceLogs(bmId, selectedMonth);
//   }
// }, [businesses]);
useEffect(() => {
  if (Array.isArray(businesses) && businesses.length > 0) {
    const bmId = businesses[0]?.BM_id;
    if (bmId) {
      getAttendanceLogs(bmId, selectedMonth);
    }
  }
}, [businesses, selectedMonth]);
// const handleAttendenceClick = () => {
//   const bmId = businesses[0]?.BM_id;
//   if (bmId) {
//     getAttendanceLogs(bmId, selectedMonth); // pass selected month here
//     setStep(2);
//   } else {
//     Alert.alert('Error', 'No business selected');
//   }
// };
const handleAttendenceClick = () => {
  const bmId = selectedUser?.BM_id;
  if (bmId) {
    getAttendanceLogs(bmId, selectedMonth);
    setStep(2);
    setModalVisible(!modalVisible)
  } else {
    Alert.alert('Error', 'No business selected');
  }
};

const fetchBatch = async (bmId) => {
  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await axios.get(
      `http://52.70.194.52/api/attendance/user/business-batches/${bmId}/`, // 🆕 Your weekly plans endpoint
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Weekly batch:', response.data);
    setBatches(response.data); // <- save to state
  } catch (error) {
    console.error('Error fetching weekly plans:', error);
    Alert.alert('Error', 'Failed to fetch weekly plans.');
  }
};
const handleWeeklyPlanClick = () => {
  const bmId = selectedUser?.BM_id; // ✅ use selected business
    const logo = selectedUser?.business_logo;
  if (bmId) {
    fetchBatch(bmId);
      setBusinessLogo(logo)
    setStep(5);
  } else {
    Alert.alert('Error', 'Please select a business first');
  }
};

// if (!businesses || businesses.length === 0) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text h4 bold>Please add a business Member first</Text>
//     </View>
//   );
// }
// if (!businesses || businesses.length === 0) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text h4 bold>Please add a business Member first</Text>
//     </View>
//   );
// }


  return (
    <SafeAreaView
          style={[
            styles.container,
            {backgroundColor: theme.$background}, // ✅ dynamic background color
          ]}>
      {/* <View style={styles.container}> */}
        {step === 0 && <Header showBack={true} title="Connects" />}

        {step === 0 && (
          <View style={{ paddingHorizontal: 16, flex: 1 }}>
{loading ? (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
) : businesses.length === 0 ? (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text h4 bold>Please add a business Member first</Text>
  </View>
) : (
  <FlatList
    data={businesses}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <ButtonWithPushBack onPress={() => handleSelectBatch(item)}>
        <Card third style={styles.card}>
          <View>
            {/* Avatar and Texts */}
            <View style={styles.row}>
              <Avatar
                size={wp('20%')}
                rounded
                activeOpacity={0.7}
                overlayContainerStyle={{
                  backgroundColor: '#D9D9D9',
                  borderColor: theme.$secondaryText,
                  borderWidth: 1,
                }}
                source={
                  item.business_logo
                    ? { uri: item.business_logo }
                    : undefined
                }
                title={
                  !item.business_logo && item.business_owner
                    ? item.business_owner[0].toUpperCase()
                    : ''
                }
              />
            </View>
            {/* Side-by-side text rows */}
            <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
              <View>
                <Text h5 bold customColor="black">{item.main_category_name}</Text>
                <Text h5 customColor="black">{item.sub_category_name}</Text>
                <Text h5 customColor="black">{item.sub_sub_category_name}</Text>
              </View>
              <View>
                <Text h5 customColor="black">{item.business_phone}</Text>
                <Text h5 customColor="black">{item.business_address}</Text>
                <Text h5 customColor="black">{item.business_owner}</Text>
              </View>
            </View>
          </View>
        </Card>
      </ButtonWithPushBack>
    )}
  />
)}





          </View>
        )}
   {step === 1 && selectedUser.main_category_name === 'Coach/Instructor' &&  (    
  <Slide index={1}>
    <Header
      showBack={true}
      title="Connected"
      customBackEvent={() => setStep(0)}
    />
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.avatarRow}>
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={
            selectedUser.business_logo
              ? { uri: selectedUser.business_logo }
              : undefined
          }
        />
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={{
            uri: 'https://randomuser.me/api/portraits/men/99.jpg',
          }}
        />
      </View>

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Text h4 bold >{selectedUser.business_owner}</Text>
        <Text h4 bold>{'manjeet'}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 , paddingHorizontal:16}}>
      {/* <View style={{ marginBottom: 16 }}> */}
  {/* Floating Label */}
  {/* <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text h6 bold style={{ color: '#fff' }}>Performance</Text>
    </View>
  </View>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>

          <FlatList
            data={taskCards}
    keyExtractor={(item, index) => `${item.title}-${index}`}
            renderItem={({ item }) => (
              <ContributorsCard
                title={item.title}
                contributors={item.contributors}
                showAddIcon={false}
                onViewPress={() =>
                  console.log('View tasks for', item.title)
                }
              />
            )}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 12 }}
          />
       </Card>
</View> */}
        
          <View style={{ marginBottom: 16 }}>
  {/* Header Tag */}
  <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text  h6 bold style={{ color: '#fff' }}>Performance</Text>
    </View>
  </View>

  {/* Card */}
  <ButtonWithPushBack onPress={() => setStep(6)}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
   
    {/* Summary Text */}
    <Text customColor="black"  h5 style={{ marginBottom: 8 }}>You Performance</Text>

    {/* Separator Line */}
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />

    {/* Attendance Pattern */}
  <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
     <Text customColor="black"  h6 bold>
      Your updated Performance List
     </Text>
    </View>
    {/* </View> */}
   
  </Card>
   </ButtonWithPushBack>
</View>
  <View style={{ marginBottom: 16 }}>
  {/* Header Tag */}
  <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text h6 bold style={{ color: '#fff' }}>Attendance</Text>
    </View>
  </View>

  {/* Card */}
  <ButtonWithPushBack onPress={handleAttendenceClick}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
   
    {/* Summary Text */}
    <Text customColor="black" h5 style={{ marginBottom: 8 }}>7 days present in last 10 sessions</Text>

    {/* Separator Line */}
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />

    {/* Attendance Pattern */}
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      {'P P P P A P A A P P'.split(' ').map((item, index) => (
        <Text
        h4
        bold
        customColor="black" 
          key={index}
          style={{
            marginRight: 8,
           
          }}
        >
          {item}
        </Text>
      ))}
    </View>
   
  </Card>
   </ButtonWithPushBack>
</View>


          <View style={{ marginBottom: 16 }}>
  {/* Header Tag */}
  <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text  h6 bold style={{ color: '#fff' }}>Weekly Plan</Text>
    </View>
  </View>

  {/* Card */}
  <ButtonWithPushBack onPress={() => setStep(3)}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
   
    {/* Summary Text */}
    <Text customColor="black"  h5 style={{ marginBottom: 8 }}>Check your Weekly training plan</Text>

    {/* Separator Line */}
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />

    {/* Attendance Pattern */}
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      {'24-30 March 2024'.split(' ').map((item, index) => (
        <Text
        h4
        customColor="black" 
        bold
          key={index}
          style={{
            marginRight: 8,
           
          }}
        >
          {item}
        </Text>
      ))}
    </View>
   
  </Card>
   </ButtonWithPushBack>
</View>
          
          <View style={{ marginBottom: 16 }}>
  {/* Header Tag */}
  <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text h6 bold style={{ color: '#fff' }}>Tournament</Text>
    </View>
  </View>

  {/* Card */}
  <ButtonWithPushBack onPress={handleTournamentClick}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
   
    {/* Summary Text */}
    <Text customColor="black"  h5 style={{ marginBottom: 8 }}>Check your Tournament</Text>

    {/* Separator Line */}
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />

    {/* Attendance Pattern */}
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
     <Text customColor="black"  h6 bold>
      Your updated Tourname List
     </Text>
    </View>
   
  </Card>
   </ButtonWithPushBack>
</View>
 <View style={{ marginBottom: 16 }}>
  {/* Header Tag */}
  <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text h6  bold style={{ color: '#fff' }}>Batch</Text>
    </View>
  </View>

  {/* Card */}
  <ButtonWithPushBack onPress={handleWeeklyPlanClick}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
   
    {/* Summary Text */}
    <Text customColor="black"  h5 style={{ marginBottom: 8 }}>Batch</Text>

    {/* Separator Line */}
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />

    {/* Attendance Pattern */}
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
     <Text h6 customColor="black"  bold>
      Check Your Batch
     </Text>
    </View>
   
  </Card>
   </ButtonWithPushBack>
</View>
      </ScrollView>
      
    </KeyboardAvoidingView>
  </Slide>
)}
{step === 1 && selectedUser.main_category_name === 'Gym' && ( 
  <Slide index={1}>
    <Header
      showBack={true}
      title="Connected"
      customBackEvent={() => setStep(0)}
    />
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.avatarRow}>
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={
            selectedUser.business_logo
              ? { uri: selectedUser.business_logo }
              : undefined
          }
        />
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={{
            uri: 'https://randomuser.me/api/portraits/men/99.jpg',
          }}
        />
      </View>

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Text h4 bold >{selectedUser.business_owner}</Text>
        <Text h4 bold>{'manjeet'}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 , paddingHorizontal:16}}>
 
        
          {/* <View style={{ marginBottom: 16 }}> */}
  {/* Header Tag */}
  {/* <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text  h6 bold style={{ color: '#fff' }}>Performance</Text>
    </View>
  </View> */}

  {/* Card */}
  {/* <ButtonWithPushBack onPress={() => setStep(6)}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
    <Text customColor="black"  h5 style={{ marginBottom: 8 }}>You Performance</Text>
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />
  <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
     <Text customColor="black"  h6 bold>
      Your updated Performance List
     </Text>
    </View>
  </Card>
   </ButtonWithPushBack>
</View> */}
  <View style={{ marginBottom: 16 }}>
  {/* Header Tag */}
  <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text h6 bold style={{ color: '#fff' }}>Attendance</Text>
    </View>
  </View>

  {/* Card */}
  <ButtonWithPushBack onPress={handleAttendenceClick}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
   
    {/* Summary Text */}
    <Text customColor="black" h5 style={{ marginBottom: 8 }}>7 days present in last 10 sessions</Text>

    {/* Separator Line */}
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />

    {/* Attendance Pattern */}
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      {'P P P P A P A A P P'.split(' ').map((item, index) => (
        <Text
        h4
        bold
        customColor="black" 
          key={index}
          style={{
            marginRight: 8,
           
          }}
        >
          {item}
        </Text>
      ))}
    </View>
   
  </Card>
   </ButtonWithPushBack>
</View>


          <View style={{ marginBottom: 16 }}>
  {/* Header Tag */}
  <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text  h6 bold style={{ color: '#fff' }}>Weekly Plan</Text>
    </View>
  </View>

  {/* Card */}
  <ButtonWithPushBack onPress={() => setStep(3)}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
   
    {/* Summary Text */}
    <Text customColor="black"  h5 style={{ marginBottom: 8 }}>Check your Weekly training plan</Text>

    {/* Separator Line */}
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />

    {/* Attendance Pattern */}
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      {'24-30 March 2024'.split(' ').map((item, index) => (
        <Text
        h4
        customColor="black" 
        bold
          key={index}
          style={{
            marginRight: 8,
           
          }}
        >
          {item}
        </Text>
      ))}
    </View>
   
  </Card>
   </ButtonWithPushBack>
</View>
          
          <View style={{ marginBottom: 16 }}>
  {/* Header Tag */}
  <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text h6 bold style={{ color: '#fff' }}> Announcement</Text>
    </View>
  </View>

  {/* Card */}
  <ButtonWithPushBack onPress={handleAnnounceMent}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
   
    {/* Summary Text */}
    <Text customColor="black"  h5 style={{ marginBottom: 8 }}>Check your Announcement</Text>

    {/* Separator Line */}
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />

    {/* Attendance Pattern */}
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
     <Text customColor="black"  h6 bold>
      Your updated Gym Announcement List
     </Text>
    </View>
   
  </Card>
   </ButtonWithPushBack>
</View>
<View style={{ marginBottom: 16 }}>
  {/* Header Tag */}
  <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text h6 bold style={{ color: '#fff' }}>Your MemberShip</Text>
    </View>
  </View>

  {/* Card */}
  <ButtonWithPushBack onPress={handleMembership}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
   
    {/* Summary Text */}
    <Text customColor="black"  h5 style={{ marginBottom: 8 }}>Check your Membership</Text>

    {/* Separator Line */}
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />

    {/* Attendance Pattern */}
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
     <Text customColor="black"  h6 bold>
      Your updated MembershipPlan List
     </Text>
    </View>
   
  </Card>
   </ButtonWithPushBack>
</View>
 <View style={{ marginBottom: 16 }}>
  {/* Header Tag */}
  <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
    <View
      style={{
        backgroundColor: '#000',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
      }}
    >
      <Text h6  bold style={{ color: '#fff' }}>Batch</Text>
    </View>
  </View>

  {/* Card */}
  <ButtonWithPushBack onPress={handleWeeklyPlanClick}>
  <Card third style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
   
    {/* Summary Text */}
    <Text customColor="black"  h5 style={{ marginBottom: 8 }}>Batch</Text>

    {/* Separator Line */}
    <View
      style={{
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 8,
      }}
    />

    {/* Attendance Pattern */}
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
     <Text h6 customColor="black"  bold>
      Check Your Batch
     </Text>
    </View>
   
  </Card>
   </ButtonWithPushBack>
</View>
      </ScrollView>
      
    </KeyboardAvoidingView>
  </Slide>
)}
{step === 2 && (
  <Slide index={2}>
    <Header
      showBack={true}
      title="Connected"
      customBackEvent={() => setStep(0)}
    />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
       <ScrollView
    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
    keyboardShouldPersistTaps="handled"
  >
      {/* 👥 Avatar Row */}
      <View style={styles.avatarRow}>
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
             source={
            selectedUser.business_logo
              ? { uri: selectedUser.business_logo }
              : undefined
          }
        />
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={{
            uri: 'https://randomuser.me/api/portraits/men/99.jpg',
          }}
        />
      </View>

      {/* 👤 Names and Date */}
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Text h4 bold>{selectedUser?.
business_owner}</Text>
        <Text h4 bold>Prince</Text>
      </View>

      {/* 📅 Open Calendar Button */}
     {/* 📅 Open Calendar Button */}
{/* <TouchableOpacity
 style={[styles.openCalendarButton, { backgroundColor: theme.$lightText }]}
  onPress={() => setModalVisible(!modalVisible)}
>
  <Text h4 style={{color:theme.$background}}>check Your Attendance</Text>
</TouchableOpacity> */}

{/* 📆 Inline Calendar (below button) */}
{modalVisible && (
  <View style={styles.calendarContainer}>
    <Text  style={styles.modalTitle}>Attendance Calendar</Text>

{/* <Calendar
  current={selectedMonth + '-01'}
  markingType="custom"
  markedDates={markedDates}
  onMonthChange={(month) => {
    const newMonth = `${month.year}-${String(month.month).padStart(2, '0')}`;
    setSelectedMonth(newMonth);

    const bmId = businesses[0]?.BM_id;
    if (bmId) {
      getAttendanceLogs(bmId, newMonth);
    }
  }}
  style={{
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  }}
  theme={{
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#000',
    dayTextColor: '#000',
    todayTextColor: '#00adf5',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#fff',
  }}
/> */}
<Calendar
  current={selectedMonth + '-01'}
  markingType="custom"
  markedDates={markedDates}
  onMonthChange={(month) => {
    const newMonth = `${month.year}-${String(month.month).padStart(2, '0')}`;
    setSelectedMonth(newMonth);

    const bmId = selectedUser?.BM_id; // ✅ Use selected business
    if (bmId) {
      getAttendanceLogs(bmId, newMonth);
    }
  }}
  style={{
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  }}
  theme={{
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#000',
    dayTextColor: '#000',
    todayTextColor: '#00adf5',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#fff',
  }}
/>


    {/* Legend */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#22c55e' }} />
        <Text>Present</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#ef4444' }} />
        <Text>Absent</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#facc15' }} />
        <Text>NA</Text>
      </View>
    </View>

    {/* Close Button */}
    <TouchableOpacity
      style={styles.closeButton}
      onPress={() => setModalVisible(false)}
    >
      <Text style={styles.closeButtonText}>Close</Text>
    </TouchableOpacity>
  </View>
)}
</ScrollView>
    </KeyboardAvoidingView>
  </Slide>
)}

{step === 3 && (
  <Slide index={3}>
    <Header
      showBack={true}
      title="Connected"
      customBackEvent={() => setStep(0)}
    />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    
      {/* 👥 Avatar Row */}
      <View style={styles.avatarRow}>
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={
            selectedUser.business_logo
              ? { uri: selectedUser.business_logo }
              : undefined
          }
        />
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={{
            uri: 'https://randomuser.me/api/portraits/men/99.jpg',
          }}
        />
      </View>

      {/* 👤 Names and Date */}
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Text h4 bold>{selectedUser.business_owner}</Text>
        <Text h4 bold>Manjeet</Text>
      </View>
 <Card
  third
  style={{
    marginTop: 24,
    padding: 16,
    maxHeight: "70%", // 👈 Add a fixed or max height
  }}
>
  <Text h4 customColor="black" bold style={{ textAlign: 'center', marginBottom: 12 }}>
    Weekly plan
  </Text>

  <FlatList
    data={weeklyCard}
    keyExtractor={(item, index) => `${item.title}-${index}`}
    renderItem={({ item }) => (
      <ContributorsCard
        title={item.title}
        contributors={item.contributors}
        showAddIcon={false}
        onViewPress={() => console.log('View tasks for', item.title)}
        getItemActionText={(subItem) => `${subItem.duration} mins`}
      />
    )}
    scrollEnabled={true} // ✅ Enable scrolling
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
  />
</Card>

    </KeyboardAvoidingView>
  </Slide>
)}
{step === 4 && (
  <Slide index={4}>
    <Header
      showBack={true}
      title="Connected"
      customBackEvent={() => setStep(0)}
    />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {/* 👥 Avatar Row */}
      <View style={styles.avatarRow}>
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={
            selectedUser.business_logo
              ? { uri: selectedUser.business_logo }
              : undefined
          }
        />
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={{
            uri: 'https://randomuser.me/api/portraits/men/99.jpg',
          }}
        />
      </View>

      {/* 👤 Names and Date */}
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Text h4 bold>{selectedUser.business_owner}</Text>
        <Text h4 bold>Manjeet</Text>
      </View>

      {/* 🏆 Tournament List */}
      <Card
        third
        style={{
          marginTop: 24,
          padding: 16,
          maxHeight: '70%',
        }}
      >
        <Text h4 customColor="black"  bold style={{ textAlign: 'center', marginBottom: 12 }}>
          Tournament List
        </Text>
<FlatList
  data={tournaments}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingBottom: 20 }}
  renderItem={({ item }) => {
    const isExpired = moment(item.event_date).isBefore(moment(), 'day');

    return (
      <Card
        third
        style={{
          backgroundColor: isExpired ? '#ffe6e6' : 'white', // light red for expired
          borderRadius: 5,
          borderWidth: 1,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <Text h5 customColor="black" bold style={{ marginBottom: 4 }}>
          {item.name} {isExpired ? '(Expired)' : ''}
        </Text>
        <Text customColor="black" style={{ marginBottom: 2 }}>
          📅 Date: {item.event_date}
        </Text>
        <Text customColor="black" style={{ marginBottom: 2 }}>
          🏷️ Type: {item.tournament_type}
        </Text>
        <Text customColor="black" style={{ marginBottom: 2 }}>
          📝 Desc: {item.description}
        </Text>
        <Text customColor="black" style={{ marginBottom: 2 }}>
          💰 Fee: ₹{item.entry_fee}
        </Text>
        <Text customColor="black" style={{ marginBottom: 2 }}>
          📍 Location: {item.location}
        </Text>
        <Text customColor="black" style={{ marginBottom: 2 }}>
          👥 Age: {item.age_group}
        </Text>
      </Card>
    );
  }}
/>

      </Card>
    </KeyboardAvoidingView>
  </Slide>
)}
{step === 5 && (
  <Slide index={5}>
    <Header
      showBack={true}
      title="Connected"
      customBackEvent={() => setStep(0)}
    />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {/* 👥 Avatar Row */}
      <View style={styles.avatarRow}>
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={
            selectedUser.business_logo
              ? { uri: selectedUser.business_logo }
              : undefined
          }
        />
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={{
            uri: 'https://randomuser.me/api/portraits/men/99.jpg',
          }}
        />
      </View>

      {/* 👤 Names and Date */}
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Text h4 bold>{selectedUser.business_owner}</Text>
        <Text h4 bold>Manjeet</Text>
      </View>

      {/* 🏆 Tournament List */}
      <Card
        third
        style={{
          marginTop: 24,
          padding: 16,
          maxHeight: '70%',
        }}
      >
        <Text h4 customColor="black"  bold style={{ textAlign: 'center', marginBottom: 12 }}>
          Batch List
        </Text>
 <FlatList
    data={batches}
    keyExtractor={(item) => item.id}
    contentContainerStyle={{ paddingBottom: 16 }}
    renderItem={({ item }) => (
      <Card
        style={{
          padding: 12,
          borderRadius: 5,
          marginBottom: 12,
          backgroundColor: 'white',
          borderWidth:1
        }}
      >
        <Text h5 bold customColor="black" >{item.name}</Text>
        <Text customColor="black" >🕐 Start Time: {item.start_time}</Text>
        <Text customColor="black" >🕓 End Time: {item.end_time}</Text>
        <Text customColor="black" >⏱ Duration: {item.duration_minutes} minutes</Text>
        <Text customColor="black"   numberOfLines={2}>📝Des: {item.description}</Text>
       <Text customColor="black" >{item.is_active ? '✅ Status: Active' : '❌ Status: Inactive'}</Text>
      </Card>
    )}
  />
       
    
      </Card>
    </KeyboardAvoidingView>
  </Slide>
)}

      {/* </View> */}
      {step === 6 && (
  <Slide index={6}>
    <Header
      showBack={true}
      title="Connected"
      customBackEvent={() => setStep(0)}
    />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
    
      {/* 👥 Avatar Row */}
      <View style={styles.avatarRow}>
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={
            selectedUser.business_logo
              ? { uri: selectedUser.business_logo }
              : undefined
          }
        />
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={{
            uri: 'https://randomuser.me/api/portraits/men/99.jpg',
          }}
        />
      </View>

      {/* 👤 Names and Date */}
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Text h4 bold>{selectedUser.business_owner}</Text>
        <Text h4 bold>Manjeet</Text>
      </View>
 <Card
  third
  style={{
    marginTop: 24,
    padding: 16,
    maxHeight: "70%", // 👈 Add a fixed or max height
  }}
>
  <Text h4 customColor="black" bold style={{ textAlign: 'center', marginBottom: 12 }}>
    Performance List
  </Text>

 <FlatList
            data={taskCards}
    keyExtractor={(item, index) => `${item.title}-${index}`}
            renderItem={({ item }) => (
              <ContributorsCard
                title={item.title}
                contributors={item.contributors}
                showAddIcon={false}
                onViewPress={() =>
                  console.log('View tasks for', item.title)
                }
              />
            )}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 12 }}
          />
       </Card>

    </KeyboardAvoidingView>
  </Slide>
)}
{step === 7 && (
  <Slide index={7}>
    <Header
      showBack={true}
      title="Connected"
      customBackEvent={() => setStep(0)}
    />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {/* 👥 Avatar Row */}
      <View style={styles.avatarRow}>
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={
            selectedUser.business_logo
              ? { uri: selectedUser.business_logo }
              : undefined
          }
        />
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={{
            uri: 'https://randomuser.me/api/portraits/men/99.jpg',
          }}
        />
      </View>

      {/* 👤 Names and Date */}
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Text h4 bold>{selectedUser.business_owner}</Text>
        <Text h4 bold>Manjeet</Text>
      </View>

      {/* 🏆 Tournament List */}
      <Card
        third
        style={{
          marginTop: 24,
          padding: 16,
          maxHeight: '70%',
          
        }}
      >
        <Text h4 customColor="black"  bold style={{ textAlign: 'center', marginBottom: 12 }}>
          Your Gym MemberShip List
        </Text>

        <FlatList
          data={memberShipPackage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Card third style={{
              backgroundColor: 'white',
              borderRadius: 5,
              borderWidth:1,
              padding: 12,
              marginBottom: 12,
            }}>
                <Text h5 customColor="black" bold style={{ marginBottom: 4 }}>
        {item.name}
      </Text>

      <Text customColor="black" style={{ marginBottom: 2 }}>
        📝 Description: {item.description}
      </Text>

      <Text customColor="black" style={{ marginBottom: 2 }}>
        💰 Actual Fee: ₹{item.actual_fee}
      </Text>

      <Text customColor="black" style={{ marginBottom: 2 }}>
        🎉 Discounted Fee: ₹{item.discount_fee}
      </Text>

      <Text customColor="black" style={{ marginBottom: 2 }}>
        ⏳ Duration: {item.duration_years}y {item.duration_months}m {item.duration_days}d
      </Text>

      <Text customColor="black" style={{ marginBottom: 2 }}>
        🎁 Complimentary: {item.complimentary_years}y {item.complimentary_months}m {item.complimentary_days}d
      </Text>
         {item.amenities?.length > 0 && (
        <View style={{ marginTop: 6 }}>
          <Text customColor="black" bold style={{ marginBottom: 4 }}>✨ Amenities:</Text>
          {item.amenities.map((amenity, index) => (
            <Text customColor="black" key={amenity.id || index} style={{ marginLeft: 10 }}>• {amenity.name}</Text>
          ))}
        </View>
      )}
      <Text customColor="black" style={{ marginBottom: 2 }}>
        🧾 Created By: {item.created_by}
      </Text>
            </Card>
          )}
        />
      </Card>
    </KeyboardAvoidingView>
  </Slide>
)}
{step === 8 && (
  <Slide index={8}>
    <Header
      showBack={true}
      title="Connected"
      customBackEvent={() => setStep(0)}
    />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {/* 👥 Avatar Row */}
      <View style={styles.avatarRow}>
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={
            selectedUser.business_logo
              ? { uri: selectedUser.business_logo }
              : undefined
          }
        />
        <Avatar
          size={wp('20%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={{
            uri: 'https://randomuser.me/api/portraits/men/99.jpg',
          }}
        />
      </View>

      {/* 👤 Names and Date */}
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Text h4 bold>{selectedUser.business_owner}</Text>
        <Text h4 bold>Manjeet</Text>
      </View>

      {/* 🏆 Tournament List */}
      <Card
        third
        style={{
          marginTop: 24,
          padding: 16,
          maxHeight: '70%',
        }}
      >
        <Text h4 customColor="black"  bold style={{ textAlign: 'center', marginBottom: 12 }}>
          Your Gym MemberShip List
        </Text>

      <FlatList
  data={Announcement}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingBottom: 20 }}
  renderItem={({ item }) => (
    <Card
      third
      style={{
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {/* Avatar Section */}
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
    </Card>
  )}
/>

      </Card>
    </KeyboardAvoidingView>
  </Slide>
)}
    </SafeAreaView>
  );
};

export default PersonalDataScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal:16
  },
  row: {
    flexDirection: 'row',
   justifyContent:"space-between",
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
    padding: 12,
  },
avatarRow: {
  flexDirection: 'row',
  justifyContent: 'center', // center horizontally
  alignItems: 'center',
  marginTop: 40, // optional: adds space from the top
  // gap: 20, // add a small gap between avatars
},
openCalendarButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 30,
    width:"80%",
     alignSelf: 'center',
  },
  buttonText: {
  
  },
   modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  calendar: {
    borderRadius: 8,
    marginBottom: 16,
  },
   closeButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop:15
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  calendarContainer: {
  marginTop: 10,
  padding: 16,
  backgroundColor: '#fff',
  borderRadius: 12,
  elevation: 4, // for Android shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
}
});
