import {
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../component/header';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Icon from '../component/icon';
import Custominput from '../component/Custominput';
import Slide from '../assets/slide';
import AuthStorage from '../utils/authStorage';
import {showMessage} from '../utils/messages/message';
import useTheme from '../hooks/useTheme';
import Text from '../component/Text';
import Card from '../component/card';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const WeeklyPlan = () => {
  const [step, setStep] = useState(0);
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [weeklyPlans, setWeeklyPlans] = useState([]); // State to store plans
  const {theme} = useTheme();
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subPlan, setSubPlan] = useState('');
const [descriptions, setDescriptions] = useState('');
const [selectedDuration, setSelectedDuration] = useState(null); // Selected Duration Store
const [subTasks, setSubTasks] = useState({});
const durations = ['10m', '15m', '30m', '45m', '1h', '1h 15m'];
  const toggleDaySelection = day => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  useEffect(() => {
    fetchWeeklyPlans();
  }, []);

 

  useEffect(() => {
    fetchSubTasks();
  }, []);

  const fetchSubTasks = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      console.log("Access token retrieved:", accessToken);

      if (!accessToken) {
        throw new Error("Access token is missing!");
      }

      const response = await fetch('http://52.70.194.52/api/attendance/sub-tasks/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch sub-tasks: ${errorText}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      const tasksByDay = {};

      data.forEach(task => {
        if (!tasksByDay[task.day]) {
          tasksByDay[task.day] = [];
        }
        tasksByDay[task.day].push(task);
      });

      setSubTasks(tasksByDay);
    } catch (error) {
      console.error('Error fetching sub-tasks:', error.message);
    } finally {
      // setLoading(false);
    }
  };

  const fetchWeeklyPlans = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch(
        'http://52.70.194.52/api/attendance/weekly-plans/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const result = await response.json();
      if (response.ok) {
        setWeeklyPlans(result); // Save the fetched plans in state
      } else {
        console.error('Error Fetching Plans:', result);
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  const createWeeklyPlan = async () => {
    try {
      // Validation
      if (!planName.trim()) {
        showMessage({
          message: 'Please enter a plan name.',
          type: 'danger',
          theme: theme,
          duration: 3000,
        });
        return;
      }
  
      if (!description.trim()) {
        showMessage({
          message: 'Please enter a description.',
          type: 'danger',
          theme: theme,
          duration: 3000,
        });
        return;
      }
  
      if (selectedDays.length === 0) {
        showMessage({
          message: 'Please select at least one day.',
          type: 'danger',
          theme: theme,
          duration: 3000,
        });
        return;
      }
  
      const accessToken = await AuthStorage.getAccessToken();
  
      // Convert selectedDays array into API format
      const daysPayload = {
        sunday: selectedDays.includes('Sunday'),
        monday: selectedDays.includes('Monday'),
        tuesday: selectedDays.includes('Tuesday'),
        wednesday: selectedDays.includes('Wednesday'),
        thursday: selectedDays.includes('Thursday'),
        friday: selectedDays.includes('Friday'),
        saturday: selectedDays.includes('Saturday'),
      };
  
      const formData = new FormData();
      formData.append('name', planName);
      formData.append('description', description);
  
      Object.keys(daysPayload).forEach(day => {
        formData.append(day, daysPayload[day]);
      });
  
      console.log('Form Data:', {
        name: planName,
        description: description,
        ...daysPayload,
      });
      console.log(accessToken, 'accessToken');
  
      const response = await fetch(
        'http://52.70.194.52/api/attendance/weekly-plans/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );
  
      const result = await response.json();
      if (response.ok) {
        showMessage({
          message: 'Weekly plan created successfully!',
          type: 'success',
          theme: theme,
          duration: 3000,
        });
        setStep(0);
        fetchWeeklyPlans();
      } else {
        console.error('Error Creating Weekly Plan:', result);
        showMessage({
          message: result?.message || 'Failed to create weekly plan.',
          type: 'danger',
          theme: theme,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Network Error:', error);
      showMessage({
        message: 'Something went wrong. Please try again.',
        type: 'danger',
        theme: theme,
        duration: 3000,
      });
    }
  };
  
  const fetchSelectedPlanDetails = async planId => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch(
        `http://52.70.194.52/api/attendance/weekly-plans/${planId}/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
   
      // console.log(response,"res")
      const result = await response.json();
      if (response.ok) {
        setSelectedPlan(result); // Set selected plan details
      } else {
        console.error('Error fetching selected plan details:', result);
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };
  const createSubTask = async (planId) => {
    try {
      console.log("createSubTask function invoked");
  
      const accessToken = await AuthStorage.getAccessToken();
      console.log("Access token retrieved:", accessToken);
      const planId = selectedPlan.id;
      const formData = new FormData();
      formData.append('weekly_plan', planId); 
      formData.append('day', selectedDay.toLowerCase());
      formData.append('task_name', subPlan);
    
      console.log("plls",planId)
      let durationInMinutes;
  
      switch (selectedDuration) {
        case '10m':
          durationInMinutes = 10;
          break;
        case '15m':
          durationInMinutes = 15;
          break;
        case '30m':
          durationInMinutes = 30;
          break;
        case '45m':
          durationInMinutes = 45;
          break;
        case '1h':
          durationInMinutes = 60;
          break;
        case '1h 15m':
          durationInMinutes = 75;
          break;
        default:
          durationInMinutes = 0;
      }
  
      formData.append('duration_minutes', durationInMinutes.toString());
      formData.append('description', descriptions);
  
      console.log('FormData contents:', formData);
  
      const response = await fetch('http://52.70.194.52/api/attendance/sub-tasks/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
  
      const jsonResponse = await response.json();
  
      if (response.ok) {
        console.log('Sub-task created successfully:', jsonResponse);
        await fetchSubTasks(); // ✅ Re-fetch updated list
        setStep(2)
      } else {
        console.error('Failed to create sub-task:', jsonResponse);
      }
    } catch (error) {
      console.error('Error in createSubTask function:', error);
    }
  };
  
  
  
  return (
    //   <View style={styles.container}>
    //     {step === 0 && <Header showBack={true} title="Weekly Plan" />}
    //     {step === 0  (
    //     <View>
    //       {/* <Header showBack={true} title="Equipment" /> */}
    //       <FlatList
    //          data={weeklyPlans}
    //         keyExtractor={item => item.id.toString()}
    //         // numColumns={2}
    //         renderItem={({item}) => (
    //           <Card third style={styles.card}>
    //              <Text h5 semiBold>{item.name}</Text>
    //             <Text h5 semiBold >{item.description}</Text>
    //             <Text  h5 semiBold>
    //               {Object.keys(item)
    //                 .filter(key => item[key] === true)
    //                 .join(', ')}
    //             </Text>
    //             {/* </View> */}
    //             {/* <View style={{position: 'relative'}}>
    //               <TouchableOpacity
    //                 onPress={() => handleViewPress(item.id, setStep(2))}
    //                 style={styles.viewButton}>
    //                 <Text h5>View</Text>
    //               </TouchableOpacity>
    //               <View style={styles.circle}>
    //                 <Text style={styles.circleText}>
    //                   {item.no_of_equipment}
    //                 </Text>
    //               </View> */}
    //             {/* </View> */}
    //           </Card>
    //         )}
    //       />
    //     </View>
    //   )}
    <View style={styles.container}>
      {step === 0 && <Header showBack={true} title="Weekly Plan" />}
      {/* {step === 0 && (
      <FlatList
        data={weeklyPlans}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
            <ButtonWithPushBack onPress={() => setStep(2)}>
            <Card third style={styles.card}>
            <Text h4 bold>{item.name}</Text>
            <Text h5>{item.description}</Text>
            <Text h5 semiBold>
              {Object.keys(item).filter(key => item[key] === true).join(', ')}
            </Text>
            </Card>
            </ButtonWithPushBack>
        )}
      />
    )}
        {step === 0 && (
          <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
            <PrimaryButton
              title="Add"
              icon={<Icon name="plus" type="feather" size={15} color="white" />}
              onPress={() => setStep(1)}
            />
          </ButtonWithPushBack>
        )}
   */}
      {step === 0 && (
        <FlatList
          data={weeklyPlans}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <ButtonWithPushBack
              onPress={() => {
                fetchSelectedPlanDetails(item.id); // Fetch plan details dynamically
                setStep(2);
              }}>
              <Card third style={styles.card}>
                <Text h4 bold>
                  {item.name}
                </Text>
                <Text h5>{item.description}</Text>
                <Text h5 semiBold>
                  {Object.keys(item)
                    .filter(key => item[key] === true)
                    .join(', ')}
                </Text>
              </Card>
            </ButtonWithPushBack>
          )}
        />
      )}
         {step === 0 && (
          <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
            <PrimaryButton
              title="Add"
              icon={<Icon name="plus" type="feather" size={15} color="white" />}
              onPress={() => setStep(1)}
            />
          </ButtonWithPushBack>
        )}

      {step === 1 && (
        <Slide index={1}>
          <Header
            showBack={true}
            title="Add New Weekly Plan"
            customBackEvent={() => setStep(0)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Weekly Plan Name"
                  value={planName}
                  onValueChange={setPlanName}
                />
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  height="13%"
                  title="Description"
                  value={description}
                  onValueChange={setDescription}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>

              {/* Horizontal Scrollable Days Selection */}
              <Text style={styles.label}>Select Days</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {daysOfWeek.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day) && styles.selectedDay,
                    ]}
                    onPress={() => toggleDaySelection(day)}>
                    <Text
                      style={[
                        styles.dayText,
                        selectedDays.includes(day) && styles.selectedDayText,
                      ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ScrollView>
          </KeyboardAvoidingView>

          <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton
              title="Create weekly plan"
              onPress={createWeeklyPlan}
            />
          </ButtonWithPushBack>
        </Slide>
      )}
      {step === 2 && selectedPlan && (
  <Slide index={2}>
    <Header
      showBack={true}
      title="Weekly Plan Task"
      customBackEvent={() => setStep(0)}
    />

<FlatList
  data={Object.keys(selectedPlan).filter(key => selectedPlan[key] === true)}
  keyExtractor={(item) => item}
  renderItem={({ item: day }) => (
    <View
      style={{
        marginVertical: 5,
        // backgroundColor: "#f2f3f4",
        // borderWidth: 1,
        // borderRadius: 10,
        paddingHorizontal: 16
      }}
    >
      {/* Day Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text h3 bold>
          {day.charAt(0).toUpperCase() + day.slice(1)}
        </Text>

        <TouchableOpacity
          onPress={() => {
            setSelectedDay(day);
            setStep(3);
          }}
          style={{
            backgroundColor: "black",
            borderRadius: 20,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            right:5
          }}
        >
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Sub-tasks List */}
      <FlatList
        data={subTasks[day] || []}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled={true}
        renderItem={({ item }) => (
          <Card third>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text h4 bold>{item.task_name}</Text>
              <Text h5 semiBold>{item.description}</Text>
            </View>
  
            <Text h5 semiBold style={{ marginLeft: 10 }}>{item.duration_minutes} min</Text>
          </View>
        </Card>
        )}
        // ListEmptyComponent={
        //   <Text style={{ color: "gray", fontSize: 14, textAlign: "center" }}>
        //     No tasks available.
        //   </Text>
        // }
        // extraData={subTasks}
      />
    </View>
  )}
/>

  </Slide>
)}

        {step === 3 && selectedDay && (
  <Slide index={3}>
    <Header
      showBack={true}
      title="Create Task"
      customBackEvent={() => setStep(2)}
    />

    <View style={{paddingHorizontal: 16}}>
      {/* Days Label */}
      <Text h4 sty bold>Days</Text>
      <View style={styles.disabledInput}>
        <Text h5 bold>{selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</Text>
      </View>

      {/* Task Name Input */}
      <View style={styles.inputContainer}>
        <Custominput
          title="Name of Sub Task"
          value={subPlan}
          onValueChange={setSubPlan}
        />
      </View>

      {/* Description Input */}
      <View style={styles.inputContainer}>
        <Custominput
          height="13%"
          title="Description"
          value={descriptions}
          onValueChange={setDescriptions}
          multiline={true}
          textAlignVertical="top"
        />
      </View>

      {/* How Long Text */}
      <Text h5 bold style={{ marginTop: 10 }}>How Long?</Text>

      {/* Duration Options */}
      <View style={styles.durationContainer}>
        {durations.map((time, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDuration(time)}
            style={[
              styles.durationButton,
              selectedDuration === time && styles.selectedDuration // Selected Styling
            ]}
          >
            <Text style={{ color: selectedDuration === time ? 'white' : 'black' }}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
    <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton
              title="sub tast create"
              onPress={createSubTask}
            />
          </ButtonWithPushBack>
  </Slide>
)}
    </View>
  );
};

export default WeeklyPlan;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#ffffff',
    padding: hp('2%'),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp('10%'),
    right: wp('7%'),
  },
  buttonContainers: {
    marginVertical: 80,
    width: '50%',
    alignSelf: 'center',
  },
  inputContainer: {
    marginTop: hp('3%'),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp('5%'),
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  dayButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4F4F4F',
    marginHorizontal: 5,
    backgroundColor: '#f2f3f4',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    height: 50,
  },
  selectedDay: {
    backgroundColor: 'black',
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  selectedDayText: {
    color: 'white',
  },
  disabledInput: {
    backgroundColor: '#f2f3f4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor:"#000000",
    borderWidth:1,
    marginTop:5
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  durationButton: {
    backgroundColor: '#f2f3f4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    // borderRadius: 5,
    // marginRight: 8,
    marginBottom: 5,
    borderWidth:1,
    borderColor:"#000000"
  },
  selectedDuration: {
    backgroundColor: 'black', // Selected होने पर Black Color
  },
});
