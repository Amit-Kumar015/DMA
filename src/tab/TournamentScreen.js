import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
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
import Autocomplete from 'react-native-autocomplete-input';
import axios from 'axios';
import moment from 'moment';
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
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [tournamentId, setTournamentId] = useState('');
  const [errors, setErrors] = useState({});
  console.log('id', tournamentId);
  // Fetch city suggestions
  const fetchCities = async text => {
    setQuery(text);
    if (text.length < 3) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${text}&format=json`,
        {
          headers: {
            'User-Agent': 'com.dma (dmaapp@yourdomain.com)',
            Accept: 'application/json',
          },
        },
      );

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format (expected JSON).');
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Failed to fetch cities:', err.message);
    }
  };

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
  //   const createTournament = async () => {
  //       if (!name || !selectedDate || !location || !entryFee) {
  //      showMessage({
  //       message: 'Please fill all required fields.',
  //       type: 'danger',
  //       theme: 'theme', // or 'dark', 'light' — use 'default' for standard
  //       duration: 3000,
  //     });
  //     return;
  //   }
  //     const formData = new FormData();
  //     formData.append('name', name);
  //     formData.append('description', description);
  //     formData.append('age_group', ageGroup);
  //     formData.append('event_date', eventDate);
  //     formData.append('location', location);
  //     formData.append('entry_fee', entryFee);
  //     formData.append('tournament_type', tournamentType);

  //     try {
  //       const accessToken = await AuthStorage.getAccessToken();

  //       const response = await axios.post(
  //         'http://52.70.194.52/api/core/tournaments/',
  //         formData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             'Content-Type': 'multipart/form-data',
  //           },
  //         },
  //       );

  //       console.log('Success:', response.data);
  //      showMessage({
  //   message: 'Tournament created successfully',
  //   type: 'success',
  //   duration: 3000,
  //   theme: 'theme', // optional
  // });
  //       setStep(0); // Go back or reset form if needed
  //         fetchTournament();
  //     } catch (error) {
  //       console.error('Error:', error.response?.data || error.message);
  //       showMessage('Failed to create tournament. Please try again.', 'error');
  //     }
  //   };
  const createTournament = async () => {
    const newErrors = {};

    if (!name) newErrors.name = 'Please fill this field.';
    if (!selectedDate) newErrors.selectedDate = 'Please fill this field.';
    if (!location) newErrors.location = 'Please fill this field.';
    if (!entryFee) newErrors.entryFee = 'Please fill this field.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // No errors — reset error state
    setErrors({});

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
        },
      );

      console.log('Success:', response.data);
      showMessage({
        message: 'Tournament created successfully',
        type: 'success',
        duration: 3000,
        theme: theme,
      });

      setStep(0);
      fetchTournament();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      showMessage({
        message: 'Failed to create tournament. Please try again.',
        type: 'danger',
        duration: 3000,
        theme: theme,
      });
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
      console.log('sjkks', result);
      if (response.ok) {
        setTournament(result); // Save the fetched plans in state
      } else {
        console.error('Error Fetching Plans:', result);
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  const handleSelectBatch = tournament => {
    setTournamentId(tournament.id || '');
    setName(tournament.name || '');
    setDescription(tournament.description || '');
    setAgeGroup(tournament.age_group || '');
    setEventDate(tournament.event_date || '');
    setSelectedDate(tournament.event_date || '');
    setLocation(tournament.location || '');
    setEntryFee(tournament.entry_fee?.toString() || '');
    setTournamentType(tournament.tournament_type || '');
    setStep(2); // Or 1, depending on your flow
  };

  const editTournament = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch(
        `http://52.70.194.52/api/core/tournaments/${tournamentId}/`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            description,
            location,
            ageGroup,
            event_date: moment(eventDate).format('YYYY-MM-DD'),

          }),
        },
      );

      const text = await response.text(); // Get raw text
      console.log('Raw response text:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        return;
      }

      if (response.ok) {
        showMessage({
          message: 'Tournament Updated successfully',
          type: 'success',
          duration: 3000,
          theme: theme,
        });
        setStep(0);
        fetchTournament();
      } else {
        console.log('Failed to update tournament:', data);
      }
    } catch (error) {
      console.log('Edit tournament error:', error);
    }
  };

  const confirmDeleteTournament = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this tournament?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTournament(); // Call the API only if user confirms
          },
        },
      ],
      {cancelable: true},
    );
  };
  const deleteTournament = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch(
        `http://52.70.194.52/api/core/tournaments/${tournamentId}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        console.log('Tournament deleted successfully');
      } else {
        const errorText = await response.text();
        console.log('Failed to delete tournament:', errorText);
      }
    } catch (error) {
      showMessage({
        message: 'Tournament Deleted successfully',
        type: 'success',
        duration: 3000,
        theme: theme,
      });
      setStep(0);
      fetchTournament();
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.$background}, // ✅ dynamic background color
      ]}>
      {step === 0 && <Header showBack={true} title="Tournament Update" />}

      {step === 0 && (
        <View style={{paddingHorizontal: 16, flex: 1}}>
          <FlatList
            data={Tournament}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <ButtonWithPushBack onPress={() => handleSelectBatch(item)}>
                <Card third style={styles.card}>
                  <Text h4 bold customColor="black">
                    {item.name}
                  </Text>
                  <Text h5 customColor="black">
                    {' '}
                    {item.event_date}
                  </Text>
                  {/* <Text h5 semiBold>
                  {Object.keys(item)
                    .filter(key => item[key] === true)
                    .join(', ')}
                </Text> */}
                  <Text h5 customColor="black">
                    {item.location}
                  </Text>
                </Card>
              </ButtonWithPushBack>
            )}
          />
        </View>
      )}

      {step === 0 && (
        <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
          <PrimaryButton
            title="Add"
            icon={
              <Icon
                name="plus"
                type="feather"
                size={15}
                color={theme.$background}
              />
            }
            onPress={() => {
              setTournamentId(null);
              setName('');
              setDescription('');
              setAgeGroup('');
              setEventDate('');
              setSelectedDate('');
              setLocation('');
              setEntryFee('');
              setTournamentType('');
              setStep(1);
            }}
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
                  height="5"
                />
                {errors.name && (
                  <Text style={{color: 'red', marginBottom: 5}}>
                    {errors.name}
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Description"
                  value={description}
                  onValueChange={setDescription}
                  placeholder="Tournament for all age groups."
                  multiline
                  textAlignVertical="top"
                  height="10"
                />
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Age Group"
                  value={ageGroup}
                  onValueChange={setAgeGroup}
                  placeholder="8-25"
                  height="5"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text h4 bold style={styles.label}>
                  Select Date
                </Text>

                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.datePickerButton}>
                  <Text customColor={'black'}>
                    {selectedDate || 'Select Date'}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  minimumDate={new Date()} // Optional: disable past dates
                />
                {errors.selectedDate && (
                  <Text style={{color: 'red', marginBottom: 5}}>
                    {errors.selectedDate}
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Location"
                  value={location}
                  onValueChange={setLocation}
                  placeholder="Mumbai"
                  height="5"
                />
                {/* <View style={{ padding: 20 }}> */}
                {errors.location && (
                  <Text style={{color: 'red', marginBottom: 5}}>
                    {errors.location}
                  </Text>
                )}
                {/* 
<Autocomplete
  data={suggestions}
  defaultValue={query}
  onChangeText={fetchCities}
  placeholder="Enter city or state"
  flatListProps={{
    keyExtractor: (item) => item.place_id.toString(),
    renderItem: ({ item }) => (
      <TouchableOpacity
        onPress={() => {
          setQuery(item.display_name);
          setLocation(item.display_name);
          setSuggestions([]); // 👈 CLOSE the dropdown
        }}
      >
        <Text style={{ padding: 10 }}>{item.display_name}</Text>
      </TouchableOpacity>
    ),
  }}
  inputContainerStyle={{
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    backgroundColor: '#f5f5f5',
    width: '93%',
  }}
  listContainerStyle={{
    // backgroundColor: '#f5f5f5',
    // borderWidth: 1,
    borderColor: '#000',
    width: '93%',
    marginTop: 5,
    borderRadius: 3,
  }}
/> */}

                {/* </View> */}
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Entry Fee"
                  value={entryFee}
                  onValueChange={setEntryFee}
                  placeholder="20.00"
                  keyboardType="numeric"
                  height="5"
                />
                {errors.entryFee && (
                  <Text style={{color: 'red', marginBottom: 5}}>
                    {errors.entryFee}
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Tournament Type"
                  value={tournamentType}
                  onValueChange={setTournamentType}
                  placeholder="Government"
                  height="5"
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
      {step === 2 && (
        <Slide index={2}>
          <Header
            showBack={true}
            title="Edit Tournament"
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
                  height="5"
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
                  height="10"
                />
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Age Group"
                  value={ageGroup}
                  onValueChange={setAgeGroup}
                  placeholder="8-25"
                  height="5"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text h4 bold style={styles.label}>
                  Select Date
                </Text>

                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.datePickerButton}>
                  <Text customColor={'black'}>
                    {selectedDate || 'Select Date'}
                  </Text>
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
                  height="5"
                />
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Entry Fee"
                  value={entryFee}
                  onValueChange={setEntryFee}
                  placeholder="20.00"
                  keyboardType="numeric"
                  height="5"
                />
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  title="Tournament Type"
                  value={tournamentType}
                  onValueChange={setTournamentType}
                  placeholder="Government"
                  height="5"
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <View style={styles.buttonCont}>
              <PrimaryButton
                title="Save"
                onPress={editTournament}
                buttonStyle={{width: '80%'}}
              />
              <PrimaryButton
                title="Delete"
                onPress={confirmDeleteTournament}
                buttonStyle={{width: '80%'}}
                customsBg="grey"
              />
            </View>
          </ButtonWithPushBack>
        </Slide>
      )}
    </SafeAreaView>
  );
};

export default TournamentScreen;
const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    paddingHorizontal: 16,
  },
  buttonCont: {
    flexDirection: 'row',
    // justifyContent: 'space-between', // ensures equal spacing
    marginBottom: 0,
    paddingHorizontal: 16,
    gap: 10,
    left: 15,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp('10'),
    right: wp('7%'),
  },
  buttonContainers: {
    marginVertical: 30,
    //   // bottom: hp('10'),
    // width: '50%',
    // alignSelf: 'center',
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginTop: hp('3%'),
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp('5%'),
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    // marginTop: 20,
    // marginBottom: 10,
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
    width: '100%',
    minHeight: hp('5%'),
    marginTop: hp('0.6.5%'),
  },
});
