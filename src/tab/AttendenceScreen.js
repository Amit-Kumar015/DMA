import {
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Alert,
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
import CustomDatePicker from '../component/DatePicker';
import Checkbox from '../component/checkbox';
import {formatDate} from '../utils/commonAction';
import { inputMinHeight } from '../utils/theme';

const AttendenceScreen = () => {
  const [step, setStep] = useState(0);
  const {theme} = useTheme();
  const [batch, setBatch] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
 

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };
  
  const toggleSelection = id => {
    setSelectedItems(
      prevSelected =>
        prevSelected.includes(id)
          ? prevSelected.filter(item => item !== id) // Remove if already selected
          : [...prevSelected, id], // Add if not selected
    );
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch(
        'http://52.70.194.52/api/attendance/batches/',
        {
          method: 'GET',
          headers: {Authorization: `Bearer ${accessToken}`},
        },
      );
      const data = await response.json();
      console.log('Fetched Batches:', data); // ✅ Debugging
      setBatch(data || []); // ✅ Ensure array format
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  return (
    <View style={styles.container}>
      {step === 0 && <Header showBack={true} title="Attendance" />}
      {step === 0 && (
        <>
          {/* <View style={{paddingHorizontal: 15, marginTop: 10}}>
            {/* Select Batch */}
            {/* <Text h4 bold style={{marginBottom: 5}}>
              Select Batch
            </Text>
            <SingleSelect
              arrayData={
                batch?.map(item => ({
                  key: item.id,
                  value: item.name,
                })) || []
              }
              selected={selectedBatch}
              search={false}
              selectedCb={value => {
                const selectedItem = batch?.find(item => item.name === value);
                setSelectedBatch(selectedItem ? selectedItem.id : '');
              }}
              boxStyles={{
                ...styles.defaultBox,
                borderColor: theme.$lightText,
                backgroundColor: theme.$surface,
                minHeight: inputMinHeight,
                width: '50%',  // ✅ Set width to 50%
                // ...boxStyles,
              }}
              dropdownStyles={{
                borderColor: theme.$lightText,
                backgroundColor: theme.$surface,
                width: '50%',  // ✅ Set width to 50%
                // ...dropdownStyles,
              }}
            /> */}
        <View style={{ paddingHorizontal: 15, marginTop: 5 }}>
  {/* Row Layout for SingleSelect & Button */}
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
    
    {/* Select Batch Column */}
    <View style={{ width: '50%' }}>
      <Text h4 bold>Select Batch</Text>
      <SingleSelect
        arrayData={
          batch?.map(item => ({
            key: item.id,
            value: item.name,
          })) || []
        }
        selected={selectedBatch}
        search={false}
        selectedCb={value => {
          const selectedItem = batch?.find(item => item.name === value);
          setSelectedBatch(selectedItem ? selectedItem.id : '');
        }}
        boxStyles={{
          borderColor: theme.$lightText,
          backgroundColor: theme.$surface,
          minHeight: inputMinHeight,
          width: '100%', // ✅ Takes full width of its column
        }}
        dropdownStyles={{
          borderColor: theme.$lightText,
          backgroundColor: theme.$surface,
          width: '100%', // ✅ Takes full width of its column
        }}
      />
    </View>

    {/* Mark Attendance Column */}
    <View style={{ width: '50%' }}>
      <Text h4 bold style={{ bottom:5 }}>Mark Attendance</Text>
      <TouchableOpacity
        onPress={() => console.log('Attendance Marked')}
        style={{
          backgroundColor: '#f2f3f4', // ✅ Background color
          borderColor: 'black',       // ✅ Border color
          borderWidth: 1,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,            // ✅ Rounded corners
          alignItems: 'center',
          justifyContent: 'center',   // ✅ Center vertically
          width: '100%',  
          minHeight: inputMinHeight,
        }}
      >
        <Text h5>Mark Attendance</Text>
      </TouchableOpacity>
    </View>

  </View>
</View>


           <View style={{paddingHorizontal:15}}>
            {/* Select Date */}
            <Text h4 bold style={[styles.label, {marginTop: 10}]}>
              Select Date
            </Text>
            {/* <CustomDatePicker
              value={selectedDate}
              onChange={date => setSelectedDate(date)}
              isError={!selectedDate}
              errorMessage={!selectedDate ? 'Please select a date!' : ''}

            /> */}
              <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
  <Text>{selectedDate ? selectedDate.toDateString() : 'Select Date'}</Text>
</TouchableOpacity>
            <DateTimePickerModal
  isVisible={isDatePickerVisible}  // ✅ Control visibility state
  mode="date"                      // ✅ Set to 'date' mode
  onConfirm={handleConfirm}  // ✅ Set selected date
  onCancel={hideDatePicker}         // ✅ Hide picker on cancel
/>
  </View>

            {/* Mark Attendance */}
            {/* <Text h4 bold style={{}}>
              Mark Attendance
            </Text>
            {/* <ButtonWithPushBack customContainerStyle={{marginTop: 10}}>
              <PrimaryButton
                title="Mark Attendance"
                custmbg="white"
                onPress={() => console.log('Selected Batch:', selectedBatch)}
              />
            </ButtonWithPushBack> */}

        
          {/* </View> */}

          {/* <FlatList
    //    data={batches} 
       keyExtractor={(item) => item.id.toString()}
       renderItem={({ item }) => (
        <View style={{paddingHorizontal:10}}>
         <Card third style={styles.card}>
           <Text h4 bold>Prince</Text>
           <Text h5>{item.desc}</Text>
         </Card>
         </View>
       )}
     /> */}
          <FlatList
            data={batch} // ✅ Ensure batch contains data
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={{paddingHorizontal: 16}}>
                <Card
                  third
                  style={[
                    styles.card,
                    {flexDirection: 'row', alignItems: 'center', padding: 10},
                  ]}>
                  {/* Name on the left */}
                  <Text h4 bold style={{flex: 1}}>
                    {item.name}
                  </Text>

                  {/* Checkbox on the right */}
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onPress={() => toggleSelection(item.id)}
                  />
                </Card>
              </View>
            )}
          />

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
            title="Attendence Logs"
            customBackEvent={() => setStep(0)}
          />
          <View style={{   flexDirection: 'row', 
    alignItems: 'center',paddingHorizontal:16}}>
          <Text h5 semiBold >
            {formatDate(selectedDate)}
          </Text>
          <View style={{left:5}}>
          <Icon name="calendar" type="feather" size={15} color="#000" />
          </View>
          
          </View> 

          {/* 🔹 Wrap in KeyboardAvoidingView & ScrollView */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}></ScrollView>

            {/* 🔹 Button is inside KeyboardAvoidingView */}
            {/* <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
                <PrimaryButton title="Create" onPress={""} />
              </ButtonWithPushBack> */}
          </KeyboardAvoidingView>
        </Slide>
      )}
    </View>
  );
};

export default AttendenceScreen;

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
    marginVertical: 30,
    width: '50%',
    alignSelf: 'center',
    // justifyContent:"flex-end",
    // flex:1
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp('1%'),
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
  datePickerButton: {
    backgroundColor: '#f2f3f4', // Background color
    borderColor: 'black',       // Border color
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,            // Rounded corners
    alignItems: 'center',
    width: '100%',               // Set width to 50%
  },
});
