import { SafeAreaView, ScrollView, StyleSheet,  TouchableOpacity,  View } from 'react-native';
import React, { useEffect, useState } from 'react';
import BMIGauge from '../component/BmiGuide';
import useTheme from '../hooks/useTheme';
import Header from '../component/header';
import Custominput from '../component/Custominput';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Text from '../component/Text';
import Slide from '../assets/slide';
import AuthStorage from '../utils/authStorage';
import Icon from '../component/icon';
import { showMessage } from '../utils/messages/message';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import ActivityIndicator from '../assets/activityIndicator';
import SingleSelect from '../component/singleSelect';
const screenWidth = Dimensions.get('window').width;
const BmiScreen = () => {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
const [bmiRecords, setBmiRecords] = useState([]);

  console.log("records",bmiRecords)
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weight, setWeight] = useState('');
  const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const [bmi, setBmi] = useState(null); // add state to store calculated BMI
  const [response, setResponse] = useState(null)

 useEffect(() => {
  getBmiRecords()
  }, []);


  const genderOptions = [
    { value: 'Male', key: 'Male' },
    { value: 'Female', key: 'Female' },
    { value: 'Other', key: 'Other' },
  ];
    const handleGenderSelect = (uniqueId, selectedOption) => {
    setGender(selectedOption);  // Updating selected gender
    console.log('Selected Gender:', selectedOption);
  };
const handleCalculate = async () => {
  const newErrors = {};

  // 1. Frontend Validation (for blank inputs)
  if (!heightFeet) newErrors.heightFeet = 'Height (feet) is required';
  if (!weight) newErrors.weight = 'Weight is required';
  if (!age) newErrors.age = 'Age is required';
  if (!gender) newErrors.gender = 'Gender is required';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  const feet = parseFloat(heightFeet) || 0;
  const inches = parseFloat(heightInches) || 0;
  const totalInches = (feet * 12) + inches;
  const heightMeters = totalInches * 0.0254;
  const heightCm = heightMeters * 100;
  const weightKg = parseFloat(weight);

  if (heightCm === 0 || weightKg === 0) {
    setErrors({ form: 'Invalid height or weight' });
    return;
  }

  setErrors({});
  setLoading(true);

  try {
    const accessToken = await AuthStorage.getAccessToken();
    const res = await fetch('http://52.70.194.52/api/core/user-bmi/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: age, // Don't parse yet — let backend validate type
        gender: gender?.value?.trim().charAt(0).toUpperCase(),
        height_cm: parseFloat(heightCm.toFixed(2)),
        weight_kg: weight, // Same here
      }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log('BMI data submitted successfully:', data);
      setResponse(data);
      getBmiRecords();
    } else {
      // 2. Handle backend validation errors
      if (data && typeof data === 'object') {
        const backendErrors = {};
        for (const key in data) {
          if (Array.isArray(data[key])) {
            backendErrors[key] = data[key][0]; // Show first message from list
          }
        }
        setErrors(backendErrors);
      } else {
        setErrors({ form: 'BMI submission failed' });
      }
    }
  } catch (error) {
    setErrors({ form: 'Something went wrong. Please try again.' });
    console.error('Error while submitting BMI data:', error);
  } finally {
    setLoading(false);
  }
};

  const getBmiRecords = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken(); // Or replace with your token directly for testing

      const response = await fetch(
        'http://52.70.194.52/api/core/user-bmi/',
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
         setBmiRecords(result)
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
  const handleCancel = () => {
    setAge('');
    setGender('');
    setHeightFeet('');
    setHeightInches('');
    setWeight('');
      setBmi(null);
       setResponse(null); 
    console.log('Inputs cleared');
  };


const validRecords = bmiRecords.map(item => ({
  ...item,
  created_at: new Date(item.created_at).toISOString(),
}));

const chartData = {
  labels: [], // we'll show custom labels below
  datasets: [
    {
      data: validRecords.map(item => item.bmi),
      strokeWidth: 2,
    },
  ],
};

// Split into rows of 5
const rows = [];
for (let i = 0; i < validRecords.length; i += 5) {
  const row = validRecords.slice(i, i + 5).map(item =>
    new Date(item.created_at).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    })
  );
  rows.push(row);
}


  return (

  <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.$background}, // ✅ dynamic background color
      ]}>
  {step === 0 && 
<Header
  showBack={true}
  title="Check BMI"
  rightComponent={
    <View style={styles.headerRight}>
      <TouchableOpacity onPress={() => setStep(1)}>
        <Icon
          name="clipboard-list"
          type="material-community"
          size={26}
          color={theme.$lightText}
        />
      </TouchableOpacity>
    </View>
  }
/>
}

  {/* Scrollable inputs */}
   {step === 0 && (
  <ScrollView
    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
    keyboardShouldPersistTaps="handled"
    style={{ flex: 1 }}
  >
    {/* All Input Fields */}
    <View style={styles.inputContainer}>
      <Custominput
        title="Age"
        value={age}
        onValueChange={setAge}
        placeholder="Enter your age"
        keyboardType="numeric"
        height="5"
      />
        {errors.age && <Text style={{ color: 'red' }}>{errors.age}</Text>}
    </View>

    <View style={styles.inputContainer}>
     {/* <View style={{marginTop:10}}> */}
            <SingleSelect
        arrayData={genderOptions}
        selected={gender}
        selectedCb={handleGenderSelect}
        uniqueId="gender"
        placeholder="Select Gender"
        noDataText="No gender options available"
      />
{/* </View> */}
       {errors.gender && <Text style={{ color: 'red' }}>{errors.gender}</Text>}
    </View>

    <View style={styles.inputContainer}>
      <Text h4 bold style={styles.label}>Height</Text>
      <View style={styles.row}>
        <Custominput
          value={heightFeet}
          onValueChange={setHeightFeet}
          placeholder="Feet"
          keyboardType="numeric"
          height="5"
          width="40%"
        />
        
        <Custominput
          value={heightInches}
          onValueChange={setHeightInches}
          placeholder="Inches"
          keyboardType="numeric"
          height="5"
          width="40%"
        />
      </View>
        {errors.heightFeet && <Text h5 style={{ color: 'red' }}>{errors.heightFeet}</Text>}
    </View>

    <View style={styles.inputContainer}>
      <Custominput
        title="Weight (kg)"
        value={weight}
        onValueChange={setWeight}
        placeholder="Enter your weight"
        keyboardType="numeric"
        height="5"
      />
    </View>
 {errors.weight_kg && <Text style={{ color: 'red' }}>{errors.weight_kg}</Text>}
    {response && (
      <View style={{ marginTop: 20 }}>
        <BMIGauge bmi={response.bmi} />
        <Text h5 textAliments="center" style={{ marginTop: 10, paddingHorizontal: 16 }}>
          {response.reason}
        </Text>
      </View>
    )}
  </ScrollView>
 )}
  {/* Fixed Buttons at bottom */}
   {step === 0 && (
  <View style={styles.fixedButtonContainer}>
    <PrimaryButton
      title="Calculate"
      onPress={handleCalculate}
      buttonStyle={{ width: '80%' }}
             loadingProps={<ActivityIndicator />}

    />
    <PrimaryButton
      title="Cancel"
      onPress={handleCancel}
      buttonStyle={{ width: '80%' }}
      customsBg="grey"
    />
  </View>
   )}
 {step === 1 && (
  <Slide index={1}>
    <View style={{ flex: 1, paddingTop: 16, paddingBottom: 40, justifyContent: 'space-between' }}>
      <View >
        <Header showBack={true} title="BMI Record" onBackPress={() => setStep(0)} />
  <LineChart
  data={chartData}
  width={screenWidth - 50}
  height={320}
  chartConfig={{
    backgroundColor: '#f2f3f4',
    backgroundGradientFrom: '#f2f3f4',
    backgroundGradientTo: '#f2f3f4',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#1e90ff',
    },
  }}
  bezier
  style={{
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  }}
/>

{/* Custom label rows */}
<View style={{ marginTop: 12 }}>
  {rows.map((row, rowIndex) => (
    <View
      key={rowIndex}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 0,
      }}
    >
      {row.map((label, index) => (
        <View
          key={index}
          style={{
            width: (screenWidth - 32) / 5,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#444',
              backgroundColor: '#eaeaea',
              paddingVertical: 4,
              paddingHorizontal: 6,
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  ))}
</View>


      </View>

      <ButtonWithPushBack>
        <PrimaryButton
          title="Back"
          onPress={() => setStep(0)}
          buttonStyle={{ width: '80%', alignSelf: 'center' }}
        />
      </ButtonWithPushBack>
    </View>
  </Slide>
)}

</SafeAreaView>




  );
};

export default BmiScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
   
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
   
    marginBottom: 6,
   
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width:"100%"
  },

 buttonCont: {
    flexDirection: 'row',
  justifyContent: 'space-between', // ensures equal spacing

  paddingHorizontal: 16,

  },
  fixedButtonContainer: {
  paddingHorizontal: 16,
  // paddingBottom: 20,
//  alignItems:"center",
  flexDirection: 'row',
  justifyContent: 'space-between',
  left:10,
  marginVertical:20
},
  updateButton: {
    width: '80%',
  },
  deleteButton: {
    width: '80%',
  },
});
