import {
  FlatList,
  KeyboardAvoidingView,
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
const TournamentScreen = () => {
    const {theme} = useTheme();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [tournamentType, setTournamentType] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [Tournament, setTournament] = useState('');
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const formatted = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    setSelectedDate(formatted);
    setEventDate(formatted); // Sets in form as well
    hideDatePicker();
  };

  useEffect(() => {
    fetchTournament();
  }, []);
  const createTournament = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('age_group', ageGroup);
    formData.append('event_date', eventDate);
    formData.append('location', location);
    formData.append('entry_fee', entryFee);
    formData.append('tournament_type', tournamentType);
  
    try {
      const accessToken = await AuthStorage.getAccessToken();
  
      const response = await axios.post(
        'http://52.70.194.52/api/core/tournaments/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Success:', response.data);
      showMessage('Tournament created successfully', 'success');
      setStep(0); // Go back or reset form if needed
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      showMessage('Failed to create tournament. Please try again.', 'error');
    }
  };
  
  
  const fetchTournament = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch(
        'http://52.70.194.52/api/core/tournaments/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const result = await response.json();
      console.log("sjkks",result)
      if (response.ok) {
        setTournament(result); // Save the fetched plans in state
      } else {
        console.error('Error Fetching Plans:', result);
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };
  return (
    <View style={styles.container}>
      {step === 0 && <Header showBack={true} title="Tournament Update" />}

       {step === 0 && (
        <FlatList
          data={Tournament}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            // <ButtonWithPushBack
            //   onPress={() => {
            //     fetchSelectedPlanDetails(item.id);
            //     setSelectedPlanId(item.id); // Fetch plan details dynamically
            //     setStep(2);
            //   }}>
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
            // </ButtonWithPushBack>
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
            title="Create new Tournament"
            customBackEvent={() => setStep(0)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Name"
                  value={name}
                  onValueChange={setName}
                  placeholder="Championship 2025"
                />
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Description"
                  value={description}
                  onValueChange={setDescription}
                  placeholder="Tournament for all age groups."
                  multiline
                  textAlignVertical="top"
                />
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Age Group"
                  value={ageGroup}
                  onValueChange={setAgeGroup}
                  placeholder="8-25"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text h4 bold style={[styles.label, {marginTop: 10}]}>
                  Select Date
                </Text>

                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.datePickerButton}>
                  <Text>{selectedDate || 'Select Date'}</Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  minimumDate={new Date()} // Optional: disable past dates
                />
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Location"
                  value={location}
                  onValueChange={setLocation}
                  placeholder="Mumbai"
                />
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Entry Fee"
                  value={entryFee}
                  onValueChange={setEntryFee}
                  placeholder="20.00"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Tournament Type"
                  value={tournamentType}
                  onValueChange={setTournamentType}
                  placeholder="Government"
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton
              title="Create Tournament"
              onPress={createTournament}
            />
          </ButtonWithPushBack>
        </Slide>
      )}
    </View>
  );
};

export default TournamentScreen;
const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#ffffff',
    padding: hp('2%'),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp('15'),
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
    borderColor: '#000000',
    borderWidth: 1,
    marginTop: 5,
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
    borderWidth: 1,
    borderColor: '#000000',
  },
  selectedDuration: {
    backgroundColor: 'black', // Selected होने पर Black Color
  },
  datePickerButton: {
    backgroundColor: '#f2f3f4',
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '93%',
    minHeight: hp('6.5%'),
    marginTop: hp('0.6.5%'),
  },
});
