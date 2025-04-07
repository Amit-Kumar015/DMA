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
import {inputMinHeight} from '../utils/theme';

const AttendenceScreen = () => {
  const [step, setStep] = useState(0);
  const {theme} = useTheme();
  const [batch, setBatch] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [batchMembers, setBatchMembers] = useState([]);
  console.log('res', batch);
  // console.log(selectedDate,"selectDta")

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = date => {
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
      console.log('access', accessToken);
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
  // const handleBatchClick = async (batchId) => {
  //   console.log('🔍 Batch ID passed to handleBatchClick:', batchId);
  //   try {
  //     // const batchId="319cd491-f5bf-4130-a6c4-7ff770decdeb"
  //     // console.log('🔍 Batch ID :', batchId);
  //     const accessToken = await AuthStorage.getAccessToken();
  //     const response = await fetch(`http://52.70.194.52/api/attendance/batch-members/319cd491-f5bf-4130-a6c4-7ff770decdeb/`, {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     if (!response.ok) throw new Error('Something went wrong');

  //     const data = await response.json();
  //     console.log('✅ Batch Members:', data);
  //     // You can store to state if needed
  //   } catch (error) {
  //     console.error('❌ Error fetching batch members:', error);
  //     Alert.alert('Error', 'Failed to load batch members');
  //   }
  // };

  const handleBatchClick = async batchId => {
    console.log('🔍 Batch ID passed to handleBatchClick:', batchId);
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch(
        `http://52.70.194.52/api/attendance/batch-members/${batchId}/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.warn('⚠️ Non-OK response but got data:', data);
        Alert.alert('Error', 'No members assign.');
        return;
      }

      console.log('✅ Batch Members:', data);
      setBatchMembers(data || []);
    } catch (error) {
      console.error('❌ Error fetching batch members:', error);
      Alert.alert('Error', 'Failed to load batch members');
    }
  };

  const markAttendance = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const batchId = selectedBatch;
      console.log('batch', batchId);
      const selectedUserIds = batchMembers
        .filter(member => selectedItems.includes(member.id))
        .map(member => member.id);

      if (!selectedDate) {
        Alert.alert('Error', 'Please select a date');
        return;
      }

      const formData = new FormData();
      formData.append('date', moment(selectedDate).format('YYYY-MM-DD')); // ✅ FIXED
      formData.append('user_ids', selectedUserIds); // ✅ array of IDs

      console.log('📤 Sending FormData:', formData);

      const response = await fetch(
        `http://52.70.194.52/api/attendance/batch/${batchId}/attendance/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to mark attendance');
      }

      const result = await response.json();
      console.log('✅ Attendance marked:', result);
      Alert.alert('Success', 'Attendance marked successfully');
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', 'Could not mark attendance');
    }
  };

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return (
    <View style={styles.container}>
      {step === 0 && <Header showBack={true} title="Attendance" />}
      {step === 0 && (
        <>
          <View style={{paddingHorizontal: 15, marginTop: 5}}>
            <View
              style={{flexDirection: 'row', alignItems: 'flex-start', gap: 10}}>
              <View style={{width: '50%', position: 'relative', zIndex: 10}}>
                <SingleSelect
                  arrayData={
                    batch.map(item => ({
                      key: item.id,
                      value: item.name,
                    })) || []
                  }
                  placeholder="Select Batch"
                  noDataText="No batch found"
                  // selected={batch.find(item => item.id === selectedBatch)?.name || ''}
                  search={false}
                  selected={
                    batch?.find(item => item.id === selectedBatch)?.name || ''
                  }
                  selectedCb={(uniqueId, selectedItem) => {
                    console.log(
                      '🔵 Raw selectedItem from dropdown:',
                      selectedItem,
                    );
                    if (selectedItem) {
                      const selectedName = selectedItem.value;
                      const item = batch.find(
                        batchItem => batchItem.name === selectedName,
                      );
                      console.log('🟢 Actual Selected Item:', item);
                      if (item) {
                        setSelectedBatch(item.id);
                        handleBatchClick(item.id);
                      }
                    } else {
                      console.warn('Selected item is undefined');
                    }
                  }}
                  boxStyles={{
                    borderColor: theme.$lightText,
                    backgroundColor: theme.$surface,
                    minHeight: inputMinHeight,
                    width: '100%',
                    zIndex: 10,
                  }}
                  dropdownStyles={{
                    zIndex: 999,
                    backgroundColor: theme.$surface,
                    borderColor: theme.$lightText,
                    width: '100%',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}
                />
              </View>
              <View style={{width: '50%'}}>
                <TouchableOpacity
                  onPress={markAttendance}
                  style={{
                    backgroundColor: '#f2f3f4',
                    borderColor: 'black',
                    borderWidth: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    top: 6,
                    minHeight: inputMinHeight,
                  }}>
                  <Text h5>Mark Attendance</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{paddingHorizontal: 15}}>
            {/* Select Date */}
            <Text h4 bold style={[styles.label, {marginTop: 10}]}>
              Select Date
            </Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={styles.datePickerButton}>
              <Text>
                {selectedDate ? selectedDate.toDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              minimumDate={sevenDaysAgo}
              maximumDate={today}
            />
          </View>
          <FlatList
            data={batchMembers}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={{paddingHorizontal: 16}}>
                <Card
                  third
                  style={[
                    styles.card,
                    {flexDirection: 'row', alignItems: 'center', padding: 10},
                  ]}>
                  <Text h4 bold style={{flex: 1}}>
                    {item.email}
                  </Text>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
            }}>
            <Text h5 semiBold>
              {formatDate(selectedDate)}
            </Text>
            <View style={{left: 5}}>
              <Icon name="calendar" type="feather" size={15} color="#000" />
            </View>
          </View>

          {/* 🔹 Wrap in KeyboardAvoidingView & ScrollView */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}></ScrollView>
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
    borderColor: 'black', // Border color
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8, // Rounded corners
    alignItems: 'center',
    width: '100%', // Set width to 50%
  },
});
