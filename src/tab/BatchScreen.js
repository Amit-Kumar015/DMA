import {
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
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
import useTheme from '../hooks/useTheme';
import Text from '../component/Text';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import SingleSelect from '../component/singleSelect';
import AuthStorage from '../utils/authStorage';
import Card from '../component/card';
import SkeletonCard from '../component/skeleternLoader';
import { showMessage } from '../utils/messages/message';
import { SafeAreaView } from 'react-native';
import TextInputEml from '../component/textInput';
import analytics from '@react-native-firebase/analytics';


const BatchScreen = () => {
  const [step, setStep] = useState(0);
  const {theme} = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedWeeklyPlan, setSelectedWeeklyPlan] = useState('');
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
const [errors, setErrors] = useState({
  name: '',
  startTime: '',
  endTime: '',
  description: '',
});
  const showStartTimePicker = () => setStartTimePickerVisibility(true);
  const hideStartTimePicker = () => setStartTimePickerVisibility(false);
const [selectedBatchId,setSelectedBatchId]=useState()
  const showEndTimePicker = () => {
    if (!startTime) {
      setErrorMessage('Please select Start Time first.');
      return;
    }
    setErrorMessage('');
    setEndTimePickerVisibility(true);
  };

  
useEffect(() => {
  analytics().logEvent("screen_time", {
    screen_name: 'Test',
    duration_seconds: 10, // Known-good int
  });
  console.log("Test event sent: duration_seconds = 10 in number");
}, []);

useEffect(() => {
  analytics().logEvent("screen_time", {
    screen_name: 'Test',
    duration_seconds: "100", // Known-good string
  });
  console.log("Test event sent: duration_seconds = 100 in string ");
}, []);


  const hideEndTimePicker = () => setEndTimePickerVisibility(false);

  const handleConfirm = (date, type) => {
    const selectedTime = moment(date).format('hh:mm A');

    if (type === 'start') {
      setStartTime(selectedTime);
      setEndTime(null);
      setErrorMessage('');
      hideStartTimePicker();
    } else {
      if (
        moment(selectedTime, 'hh:mm A').isSameOrBefore(
          moment(startTime, 'hh:mm A'),
        )
      ) {
        setErrorMessage('End Time must be after Start Time.');
      } else {
        setEndTime(selectedTime);
        setErrorMessage('');
      }
      hideEndTimePicker();
    }
  };

  useEffect(() => {
    fetchWeeklyPlans();
  }, []);




  useEffect(() => {
    fetchBatches(); 
  }, []);

  const fetchBatches = async () => {
    try {
      setIsLoading(true); // Start loading
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch('http://52.70.194.52/api/attendance/batches/', {
        method: 'GET',
        headers: { 
          Authorization: `Bearer ${accessToken}`,
        }
      });
      const data = await response.json();
      console.log("Fetched Batches:", data);
      setBatches(data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setIsLoading(false); // Stop loading after fetch completes or fails
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

const handleCreateBatch = async () => {
  const newErrors = {
    name: '',
    startTime: '',
    endTime: '',
    description: '',
  };

  if (!name) newErrors.name = 'Please enter the batch name.';
  if (!startTime) newErrors.startTime = 'Please select a start time.';
  if (!endTime) newErrors.endTime = 'Please select an end time.';
  if (!description) newErrors.description = 'Please enter a description.';

  setErrors(newErrors);

  const hasErrors = Object.values(newErrors).some((err) => err !== '');
  if (hasErrors) return;
  try {
    const accessToken = await AuthStorage.getAccessToken();

    const formattedStartTime = moment(startTime, 'hh:mm A').format('HH:mm:ss');
    const formattedEndTime = moment(endTime, 'hh:mm A').format('HH:mm:ss');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('weekly_plan', selectedWeeklyPlan); // Assuming ID
    formData.append('start_time', formattedStartTime);
    formData.append('end_time', formattedEndTime);
    formData.append('description', description);

    const response = await fetch('http://52.70.194.52/api/attendance/batches/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await response.json();
    console.log('API Response:', result);

    if (response.ok) {
      showMessage({
        message: 'Batch created successfully!',
        type: 'success',
        theme: theme,
        duration: 3000,
      });
      setStep(0);
      fetchBatches();
    } else {
      showMessage({
        message: result.message || 'Failed to create batch. Please try again.',
        type: 'danger',
        theme: theme,
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Network Error:', error);
    showMessage({
      message: 'Something went wrong. Please try again later.',
      type: 'danger',
      theme: theme,
      duration: 3000,
    });
  }
};
const handleSelectBatch = (batch) => {
  setSelectedBatchId(batch.id);

  setName(batch.name || '');
  setDescription(batch.description || '');
  setStartTime(moment(batch.start_time, 'HH:mm:ss').format('hh:mm A') || '');
  setEndTime(moment(batch.end_time, 'HH:mm:ss').format('hh:mm A') || '');
  setSelectedWeeklyPlan(batch.weekly_plan || '');
  setStep(3);
};
const handleEditBatch = async () => {
  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await fetch(`http://52.70.194.52/api/attendance/batches/${selectedBatchId}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',  // Make sure this is set
      },
      body: JSON.stringify({
        name,
        description,
        start_time: moment(startTime, 'hh:mm A').format('HH:mm:ss'),
        end_time: moment(endTime, 'hh:mm A').format('HH:mm:ss'),
        // Add other fields like weekly_plan if needed
        weekly_plan: selectedWeeklyPlan,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Batch updatedsss:", data);
      setStep(0);  // ✅ Reset step after successful edit
      fetchBatches()
    } else {
      console.log("Failed to update:", data);
    }
  } catch (error) {
    console.log("Edit error:", error);
  }
};
const confirmDeleteBatch = () => {
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this batch?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDeleteBatch(), // Call the actual API here
      },
    ],
    { cancelable: false }
  );
};

const handleDeleteBatch = async () => {
  if (!selectedBatchId) {
    return;
  }
  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await fetch(`http://52.70.194.52/api/attendance/batches/${selectedBatchId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) {
   
      // Refresh data here, e.g., fetchBatches()
    } else {
  
      console.log(response.status, response.statusText);
    }
  } catch (error) {

    if (error instanceof Error) {
      console.log('Error message:', error.message);
      setStep(0);
      fetchBatches(); // Assuming this refetches batches
    }
  }
};


  return (
      <SafeAreaView
                   style={[
                     styles.container,
                     { backgroundColor: theme.$background }, // ✅ dynamic background color
                   ]}
                 >
    {/* {step === 0 && <Header showBack={true} title="Batch" />} */}
  
    {step === 0 && (
      <>
   <FlatList
  data={isLoading ? [...Array(7)] : batches}
  keyExtractor={(item, index) =>
    item?.id?.toString() || index.toString()
  }
  renderItem={({ item, index }) => (
    <View style={{ paddingHorizontal: 10 }}>
      <TouchableOpacity onPress={() => handleSelectBatch(item)}>
        <Card third style={styles.card}>
          {isLoading ? (
            <SkeletonCard height={69} borderRadius={8} isLoading={true} />
          ) : (
            <>
              <Text h4 bold customColor="black">
                {item.name}
              </Text>
              <Text h5 customColor="black">{item.description}</Text>
            </>
          )}
        </Card>
      </TouchableOpacity>
    </View>
  )}
  ListEmptyComponent={
    !isLoading ? (
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
            No batches available. Please Add a batch first.
          </Text>
        </View>
      </View>
    ) : null
  }
/>

  
        <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
          <PrimaryButton
            title="Add"
            icon={<Icon name="plus" type="feather" size={15} color={theme.$background} />}
            onPress={() => {
              // Clear form fields
              setSelectedBatchId(null);
              setName('');
              setDescription('');
              setStartTime('');
              setEndTime('');
              setSelectedWeeklyPlan("");
              
              // Now move to form step
              setStep(1);
            }}
            />
        </ButtonWithPushBack>
      </>
    )}
  
    {step === 1 && (
      <Slide index={1}>
        <Header
          showBack={false}
          title="Add New Batches"
          customBackEvent={() => setStep(0)}
        />
  
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.inputContainer}>
              {/* <Custominput title="Batch Name" value={name} onValueChange={setName} /> */}
                 <TextInputEml
                // ref={inputRef}
                label="Batch Name"
                placeholder="Batch Name"
                value={name}
                onChangeText={setName}
               
              />
                {errors.name !== '' && (
    <Text h5 style={{ color: 'red'}}>{errors.name}</Text>
  )}
            </View>
            <View style={styles.inputContainer}>
              {/* <Custominput
                height={13}
                title="Description"
                value={description}
                onValueChange={setDescription}
                multiline={true}
                textAlignVertical="top"
              /> */}
                   <TextInputEml
                // ref={inputRef}
                label="Description"
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                height={90}
               
              />
                            {errors.name !== '' && (
    <Text h5 style={{ color: 'red'}}>{errors.description}</Text>
  )}
            </View>
  
            <View style={styles.inputContainer}>
              <Text h5 semiBold style={styles.label}>Start Time</Text>
              <TouchableOpacity onPress={showStartTimePicker} style={styles.timePickerButton}>
                <Text h4 customColor="black">{startTime ? startTime : 'Select Start Time'}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartTimePickerVisible}
                mode="time"
                onConfirm={date => handleConfirm(date, 'start')}
                onCancel={hideStartTimePicker}
              />
                            {errors.name !== '' && (
    <Text h5 style={{ color: 'red'}}>{errors.startTime}</Text>
  )}
            </View>
  
            <View style={styles.inputContainer}>
              <Text h5 semiBold style={styles.label}>End Time</Text>
              <TouchableOpacity onPress={showEndTimePicker} style={styles.timePickerButton}>
                <Text h4 customColor="black">{endTime ? endTime : 'Select End Time'}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndTimePickerVisible}
                mode="time"
                onConfirm={date => handleConfirm(date, 'end')}
                onCancel={hideEndTimePicker}
              />
                                       {errors.name !== '' && (
    <Text h5 style={{ color: 'red'}}>{errors.endTime}</Text>
  )}
            </View>
  
            {errorMessage ? <Text h6 style={styles.errorText}>{errorMessage}</Text> : null}
  
            <View style={{ marginTop: 15, paddingHorizontal: 16 }}>
              <Text h5 semiBold>Select Weekly Plan</Text>
              <SingleSelect
  arrayData={weeklyPlans.map(plan => ({ key: plan.id, value: plan.name }))}  // Mapping data to key/value pair
  selected={selectedWeeklyPlan}  // This will be the selected plan ID
  search={false}
  selectedCb={(uniqueId, value) => {
   
    if (value && value.key) {
      const selectedPlan = weeklyPlans.find(plan => plan.id === value.key);

      if (selectedPlan) {
        if (selectedWeeklyPlan !== selectedPlan.id) {
          setSelectedWeeklyPlan(selectedPlan.id);  // Set the selected plan ID in state
        }
      }
    }
  }}
/>


            </View>
          </ScrollView>
  
          <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton title="Create" onPress={handleCreateBatch} />
          </ButtonWithPushBack>
        </KeyboardAvoidingView>
      </Slide>
    )}
  
    {step === 3 && (
      <Slide index={3}>
        <Header
          showBack={false}
          title=" Edit And Delete Batches"
          customBackEvent={() => setStep(0)}
        />
  
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
                 <View style={styles.inputContainer}>
              {/* <Custominput title="Batch Name" value={name} onValueChange={setName} /> */}
                 <TextInputEml
                // ref={inputRef}
                label="Batch Name"
                placeholder="Batch Name"
                value={name}
                onChangeText={setName}
               
              />
            </View>
            <View style={styles.inputContainer}>
          
                   <TextInputEml
                // ref={inputRef}
                label="Description"
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                height={90}
               
              />
            </View>
  
            <View style={styles.inputContainer}>
              <Text h5 semiBold style={styles.label}>Start Time</Text>
              <TouchableOpacity onPress={showStartTimePicker} style={styles.timePickerButton}>
                <Text h4 customColor="black">{startTime ? startTime : 'Select Start Time'}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartTimePickerVisible}
                mode="time"
                onConfirm={date => handleConfirm(date, 'start')}
                onCancel={hideStartTimePicker}
              />
            </View>
  
            <View style={styles.inputContainer}>
              <Text h5 semiBold style={styles.label}>End Time</Text>
              <TouchableOpacity onPress={showEndTimePicker} style={styles.timePickerButton}>
                <Text h4 customColor="black">{endTime ? endTime : 'Select End Time'}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndTimePickerVisible}
                mode="time"
                onConfirm={date => handleConfirm(date, 'end')}
                onCancel={hideEndTimePicker}
              />
            </View>
  
            <View style={{ marginTop: 15, paddingHorizontal: 16 }}>
              <Text h5 semiBold>Select Weekly Plan</Text>
              <SingleSelect
  arrayData={weeklyPlans.map(plan => ({ key: plan.id, value: plan.name }))}  // Mapping data to key/value pair
  selected={selectedWeeklyPlan}  // This will be the selected plan ID
  search={false}
  selectedCb={(uniqueId, value) => {
    if (value && value.key) {
      const selectedPlan = weeklyPlans.find(plan => plan.id === value.key);
      if (selectedPlan) {
        if (selectedWeeklyPlan !== selectedPlan.id) {
          setSelectedWeeklyPlan(selectedPlan.id);  // Set the selected plan ID in state
        }
      }
    }
  }}
/>
            </View>
          </ScrollView>
          <ButtonWithPushBack>
          <View style={styles.buttonCont}>
            <PrimaryButton
              title="Edit"
              onPress={handleEditBatch}
              buttonStyle={styles.updateButton}
            />
            <PrimaryButton
              title="Delete"
            
              onPress={confirmDeleteBatch}
              buttonStyle={styles.deleteButton}
              customsBg="grey"
            />
            
          </View>
          </ButtonWithPushBack>
        </KeyboardAvoidingView>
      </Slide>
    )}
  </SafeAreaView>
  
  );
};

export default BatchScreen;

const styles = StyleSheet.create({
  container: {
    // width: wp('100%'),
    // height: hp('100%'),
    flex:1,
    paddingHorizontal:16
    
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp('10%'),
    right: wp('7%'),
  },
  buttonContainers: {
    marginVertical: 30,
    width: '50%',
    alignSelf: 'center',
  
  },
  inputContainer: {
    marginTop: hp('0%'),
    paddingHorizontal:16
  },
  timePickerButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: '#f2f3f4',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp('1%'),
  },
  label: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  
    marginTop: 5,
    textAlign: 'center',
  },
  buttonCont: {
    flexDirection: 'row',

left:20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  updateButton: {
   
    width: '80%',
  },
  deleteButton: {
    backgroundColor: 'grey', // Red color for delete
    width: '80%',
  },
});
