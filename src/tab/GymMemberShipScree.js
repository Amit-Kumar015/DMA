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
import Slide from '../assets/slide';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import useTheme from '../hooks/useTheme';
import Header from '../component/header';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Card from '../component/card';
import Icon from '../component/icon';
import Custominput from '../component/Custominput';
import Text from '../component/Text';
import TextInputEml from '../component/textInput';
import AuthStorage from '../utils/authStorage';
import Search from '../component/searchInput';
import ActivityIndicator from '../assets/activityIndicator';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {showMessage} from '../utils/messages/message';
import SingleSelect from '../component/singleSelect';
const GymMemberShipScree = () => {
  const [step, setStep] = useState(0);
  const {theme} = useTheme();
  const [member, setMember] = useState('');
  const [durationYear, setDurationYear] = useState('');
  const [durationMonth, setDurationMonth] = useState('');
  const [durationDay, setDurationDay] = useState('');
  const [complimentaryYear, setComplimentaryYear] = useState('');
  const [complimentaryMonth, setComplimentaryMonth] = useState('');
  const [complimentaryDay, setComplimentaryDay] = useState('');
  const [discountedFees, setDiscountedFees] = useState('');
  const [actualFees, setActualFees] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [memberShipPackage, setMemberShipPackage] = useState();
  console.log('package', memberShipPackage);
  const [showLoading, setShowLoading] = useState(false);
  console.log('sele', selectedInterests);
  const [aninitiesList, setAninitiesList] = useState('');
    const [packageId, setPackageId] = useState('');
    console.log("isjs",packageId)
  useEffect(() => {
    fetchAnimities();
    getMembershipPlans();
  }, []);
  const fetchAnimities = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch('http://52.70.194.52/api/gym/amenities/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();
      console.log('sjkks', result);
      if (response.ok) {
        setAninitiesList(result); // Save the fetched plans in state
      } else {
        console.error('Error Fetching List:', result);
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };
  // const submitMembershipPlan = async () => {
  //   // ✅ Mandatory field validation
  //   if (
  //     !member.trim() ||
  //     !durationYear ||
  //     // !durationMonth ||
  //     // !durationDay ||
  //     !actualFees.trim() ||
  //     // !discountedFees.trim() ||
  //     !Array.isArray(selectedInterests) ||
  //     selectedInterests.length === 0 ||
  //     !selectedInterests.every(item => item && item.id)
  //   ) {
  //     showMessage({
  //       message: 'Please fill all mandatory fields .',
  //       type: 'danger',
  //       duration: 3000,
  //       theme: theme,
  //     });
  //     // return;
  //   }

  //   const formData = new FormData();

  //   formData.append('name', member.trim());
  //   formData.append('description', 'Best value plan');
  //   formData.append('duration_years', durationYear);
  //   formData.append('duration_months', durationMonth);
  //   formData.append('duration_days', durationDay);
  //   formData.append('complimentary_years', complimentaryYear);
  //   formData.append('complimentary_months', complimentaryMonth);
  //   formData.append('complimentary_days', complimentaryDay);
  //   formData.append('actual_fee', actualFees.trim());
  //   formData.append('discount_fee', discountedFees.trim());

  //   selectedInterests.forEach(item => {
  //     if (item.id) {
  //       formData.append('amenities', item.id);
  //     }
  //   });
  //   console.log('form', formData);
  //   try {
  //     setShowLoading(true);
  //     const accessToken = await AuthStorage.getAccessToken();

  //     const response = await fetch(
  //       'http://52.70.194.52/api/gym/membership-plans/',
  //       {
  //         method: 'POST',
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           Accept: 'application/json',
  //         },
  //         body: formData,
  //       },
  //     );

  //     const result = await response.json();
  //     setShowLoading(false);

  //     if (response.ok) {
  //       console.log('Success:', result);

  //       showMessage({
  //         message: 'Membership plan created successfully!',
  //         type: 'success',
  //         duration: 3000,
  //         theme: theme,
  //       });

  //       // ✅ Clear all fields
  //       setMember('');
  //       setDurationYear('');
  //       setDurationMonth('');
  //       setDurationDay('');
  //       setComplimentaryYear('');
  //       setComplimentaryMonth('');
  //       setComplimentaryDay('');
  //       setActualFees('');
  //       setDiscountedFees('');
  //       setSelectedInterests([]);
  //       setStep(0);
  //       getMembershipPlans()
  //     } else {
  //       console.error('Error:', result);
  //       showMessage({
  //         message: 'Failed to create membership plan. Please check your input.',
  //         type: 'danger',
  //         duration: 3000,
  //         theme: theme,
  //       });
  //     }
  //   } catch (error) {
  //     setShowLoading(false);
  //     console.error('Request failed:', error);
  //     showMessage({
  //       message: 'Network error. Please try again.',
  //       type: 'danger',
  //       duration: 3000,
  //       theme: theme,
  //     });
  //   }
  // };

  const submitMembershipPlan = async () => {
  if (
    !member.trim() ||
    !durationYear ||
    !actualFees.trim() ||
    !Array.isArray(selectedInterests) ||
    selectedInterests.length === 0 ||
    !selectedInterests.every(item => item && item.id)
  ) {
    showMessage({
      message: 'Please fill all mandatory fields.',
      type: 'danger',
      duration: 3000,
      theme: theme,
    });
    return; // Add return here to stop execution
  }

  const formData = new FormData();

  formData.append('name', member.trim());
  formData.append('description', 'Best value plan');
  formData.append('duration_years', durationYear);
  formData.append('duration_months', durationMonth);
  formData.append('duration_days', durationDay);
  formData.append('complimentary_years', complimentaryYear);
  formData.append('complimentary_months', complimentaryMonth);
  formData.append('complimentary_days', complimentaryDay);
  formData.append('actual_fee', actualFees.trim());
  formData.append('discount_fee', discountedFees.trim());

  // ✅ Correct way to append array of amenities (assuming backend supports array notation)
console.log("Final selectedInterests:", selectedInterests);
selectedInterests.forEach(item => {
  console.log("Sending amenity id:", item.id);
    if (item.id) {
        formData.append('amenity_ids', item.id);
      }
})
console.log("form",formData)
  try {
    setShowLoading(true);
    const accessToken = await AuthStorage.getAccessToken();

    const response = await fetch('http://52.70.194.52/api/gym/membership-plans/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      body: formData,
    });

    const result = await response.json();
       console.log("result",result)
    setShowLoading(false);

    if (response.ok) {
      console.log("res",response)
      showMessage({
        message: 'Membership plan created successfully!',
        type: 'success',
        duration: 3000,
        theme: theme,
      });

      // Reset fields
      setMember('');
      setDurationYear('');
      setDurationMonth('');
      setDurationDay('');
      setComplimentaryYear('');
      setComplimentaryMonth('');
      setComplimentaryDay('');
      setActualFees('');
      setDiscountedFees('');
      setSelectedInterests([]);
      setStep(0);
      getMembershipPlans();
    } else {
      console.error('API Error:', result);
      showMessage({
        message: 'Failed to create membership plan. Please check your input.',
        type: 'danger',
        duration: 3000,
        theme: theme,
      });
    }
  } catch (error) {
    setShowLoading(false);
    console.error('Request failed:', error);
    showMessage({
      message: 'Network error. Please try again.',
      type: 'danger',
      duration: 3000,
      theme: theme,
    });
  }
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
      console.log("resultsssss",result)

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

  const onChangeText = text => {
    setSearchText(text);
    if (text.length > 0) {
      const filtered = aninitiesList.filter(item =>
        item?.name?.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  };
//   const handleSelectPackage = (packageData) => {
//   setPackageId(packageData.id || '');
//   setMember(packageData.name || '');
//   // setDescription(packageData.description || 'Best value plan');
//   setDurationYear(packageData.duration_years || 0);
//   setDurationMonth(packageData.duration_months || 0);
//   setDurationDay(packageData.duration_days || 0);
//   setComplimentaryYear(packageData.complimentary_years || 0);
//   setComplimentaryMonth(packageData.complimentary_months || 0);
//   setComplimentaryDay(packageData.complimentary_days || 0);
//   setActualFees(packageData.actual_fee?.toString() || '');
//   setDiscountedFees(packageData.discount_fee?.toString() || '');
//   setStep(2); // or 1 depending on your form flow
// };

const handleSelectPackage = (packageData) => {
  setPackageId(packageData.id || '');
  setMember(packageData.name || '');
  setDurationYear(packageData.duration_years || 0);
  setDurationMonth(packageData.duration_months || 0);
  setDurationDay(packageData.duration_days || 0);
  setComplimentaryYear(packageData.complimentary_years || 0);
  setComplimentaryMonth(packageData.complimentary_months || 0);
  setComplimentaryDay(packageData.complimentary_days || 0);
  setActualFees(packageData.actual_fee?.toString() || '');
  setDiscountedFees(packageData.discount_fee?.toString() || '');
  setSelectedInterests(packageData.amenities || []);
  setStep(2); // Or 1 depending on your flow
};

// const editMembershipPackage = async () => {
//   try {
//     const accessToken = await AuthStorage.getAccessToken();

//     const response = await fetch(
//       `http://52.70.194.52/api/gym/membership-plans/${packageId}/`,
//       {
//         method: 'PATCH',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: member.trim(),
//           duration_years: durationYear,
//           duration_months: durationMonth,
//           duration_days: durationDay,
//           complimentary_years: complimentaryYear,
//           complimentary_months: complimentaryMonth,
//           complimentary_days: complimentaryDay,
//           actual_fee: actualFees.trim(),
//           discount_fee: discountedFees.trim(),
//         }),
//       }
//     );

//     const text = await response.text();
//     console.log('Raw response text:', text);

//     let data;
//     try {
//       data = JSON.parse(text);
//     } catch (e) {
//       console.error('Failed to parse JSON:', e);
//       return;
//     }

//     if (response.ok) {
//       showMessage({
//         message: 'Membership Package Updated successfully',
//         type: 'success',
//         duration: 3000,
//         theme,
//       });
//       setStep(0);
//       getMembershipPlans();
//     } else {
//       console.log('Failed to update package:', data);
//     }
//   } catch (error) {
//     console.log('Edit membership package error:', error);
//   }
// };
const editMembershipPackage = async () => {
  try {
    const accessToken = await AuthStorage.getAccessToken();

    // Validate inputs (optional but recommended)
    // if (
    //   !member.trim() ||
    //   !durationYear ||
    //   !actualFees.trim() ||
    //   !Array.isArray(selectedInterests) ||
    //   selectedInterests.length === 0 ||
    //   !selectedInterests.every(item => item && item.id)
    // ) {
    //   showMessage({
    //     message: 'Please fill all mandatory fields.',
    //     type: 'danger',
    //     duration: 3000,
    //     theme: theme,
    //   });
    //   return;
    // }

    // Extract amenity IDs
    const amenityIds = selectedInterests.map(item => item.id);

    const response = await fetch(
      `http://52.70.194.52/api/gym/membership-plans/${packageId}/`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: member.trim(),
          duration_years: durationYear,
          duration_months: durationMonth,
          duration_days: durationDay,
          complimentary_years: complimentaryYear,
          complimentary_months: complimentaryMonth,
          complimentary_days: complimentaryDay,
          actual_fee: actualFees.trim(),
          discount_fee: discountedFees.trim(),
          amenity_ids: amenityIds, // 👈 include this field
        }),
      }
    );

    const text = await response.text();
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
        message: 'Membership Package Updated successfully',
        type: 'success',
        duration: 3000,
        theme,
      });
      setStep(0);
      getMembershipPlans();
    } else {
      console.log('Failed to update package:', data);
      showMessage({
        message: data?.message || 'Failed to update package. Please try again.',
        type: 'danger',
        duration: 3000,
        theme: theme,
      });
    }
  } catch (error) {
    console.log('Edit membership package error:', error);
    showMessage({
      message: 'Something went wrong. Please try again later.',
      type: 'danger',
      duration: 3000,
      theme: theme,
    });
  }
};

const confirmDeletePackage = () => {
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this membership package?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteMembershipPackage(); // Only call if user confirms
        },
      },
    ],
    { cancelable: true }
  );
};
const deleteMembershipPackage = async () => {
  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await fetch(
      `http://52.70.194.52/api/gym/membership-plans/${packageId}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
     console.log('MemberShip deleted successfully');
       // Refresh your list
    } else {
      const errorText = await response.text();
      console.log('Failed to delete package:', errorText);
    }
  } catch (error) {
     showMessage({
            message: 'MemberShip package Deleted successfully',
            type: 'success',
            duration: 3000,
            theme: theme,
          });
        setStep(0);
      getMembershipPlans();
  }
};


  return (
      <SafeAreaView
         style={[
           styles.container,
           {backgroundColor: theme.$background}, // ✅ dynamic background color
         ]}>
      {step === 0 && (
        <>
          <Header showBack={true} title="Membership package" />
          <View style={{paddingHorizontal: 16, flex: 1}}>
            <FlatList
              data={memberShipPackage}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <ButtonWithPushBack onPress={() => handleSelectPackage(item)}>
<Card third style={styles.card}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    {/* Left Side: Name, Description, Actual Fee */}
    <View style={{ flex: 1, paddingRight: 10 }}>
      <Text h4 bold customColor="black">
        {item.name}
      </Text>
      <Text h5 customColor="black">
        {item.description}
      </Text>
 
  <Text h5 semiBold customColor="black">Actual Fee:</Text>
  <Text h5 customColor="black">₹{item.actual_fee}</Text>

    </View>

    {/* Right Side: Amenities, Discounted Fee */}
    <View style={{ flex: 1 }}>
            {item.amenities?.length > 0 ? (
        <View style={{  }}>
          <Text h5 bold customColor="black">Amenities:</Text>
          {item.amenities.map((amenity, index) => (
            <Text key={index} h5 customColor="black">
              {amenity.name}
            </Text>
          ))}
        </View>
      ) : (
        <Text h5 semiBold customColor="Black">No amenities listed</Text>
      )}
      <Text h5 semiBold customColor="black">
        Discount Fee: 
      </Text>
  <Text h5 customColor="black">₹{item.discount_fee}</Text>

    </View>
  </View>
</Card>


              </ButtonWithPushBack>
              )}
            />
          </View>
 
        </>
      )}
  {step === 0 && (
          <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
            <PrimaryButton
              title="Add"
              icon={<Icon name="plus" type="feather" size={15} color={theme.$background} />}
              onPress={() => {
                   setPackageId(null);
              setMember('');
            setComplimentaryMonth("");
            setComplimentaryYear("");
              setDiscountedFees('');
              setActualFees('');
              setDurationDay('');
              setDurationMonth('');
              setDurationYear('');
              setComplimentaryDay('');
              setStep(1);
              setSelectedInterests([])
               } }
            />
          </ButtonWithPushBack>
  )}
      {step === 1 && (
        <Slide index={1}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
            keyboardVerticalOffset={80}>
            <Header
              showBack={true}
              title="Membership package"
              customBackEvent={() => setStep(0)}
            />

            <FlatList
              ListHeaderComponent={
                <>
                  {/* Membership Name */}
                  <Text h5 semiBold style={styles.label}>
                    Membership Name
                  </Text>
                  <TextInputEml
                    placeholder="Enter membership name"
                    value={member}
                    onChangeText={setMember}
                    customStyle={styles.inputFullWidth}
                  />

                  {/* Duration */}
                  {/* <Text
                    h5
                    semiBold
                    style={[styles.label, styles.sectionSpacing]}>
                    Duration
                  </Text>
                  <View style={styles.rowInputs}>
                    <TextInputEml
                      placeholder="Year"
                      value={durationYear}
                      onChangeText={setDurationYear}
                      customStyle={styles.inputThird}
                    />
                    <TextInputEml
                      placeholder="Month"
                      value={durationMonth}
                      onChangeText={setDurationMonth}
                      customStyle={styles.inputThird}
                    />
                    <TextInputEml
                      placeholder="Day"
                      value={durationDay}
                      onChangeText={setDurationDay}
                      customStyle={styles.inputThird}
                    />
                  </View> */}
                  <Text h5 semiBold style={[styles.label, styles.sectionSpacing]}>
  Duration
</Text>

<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
  {/* Year Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 10 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
      selected={durationYear}
      selectedCb={(id, val) => setDurationYear(parseInt(val?.value) || '')}
      uniqueId="durationYear"
      placeholder="Year"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>

  {/* Month Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 12 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
      selected={durationMonth}
      selectedCb={(id, val) => setDurationMonth(parseInt(val?.value) || '')}
      uniqueId="durationMonth"
      placeholder="Month"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>

  {/* Day Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 31 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
      selected={durationDay}
      selectedCb={(id, val) => setDurationDay(parseInt(val?.value) || '')}
      uniqueId="durationDay"
      placeholder="Day"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>
</View>



                  {/* Complimentary */}
                  {/* <Text
                    h5
                    semiBold
                    style={[styles.label, styles.sectionSpacing]}>
                    Complimentary (Optional)
                  </Text>
                  <View style={styles.rowInputs}>
                    <TextInputEml
                      placeholder="Year"
                      value={complimentaryYear}
                      onChangeText={setComplimentaryYear}
                      customStyle={styles.inputThird}
                    />
                    <TextInputEml
                      placeholder="Month"
                      value={complimentaryMonth}
                      onChangeText={setComplimentaryMonth}
                      customStyle={styles.inputThird}
                    />
                    <TextInputEml
                      placeholder="Day"
                      value={complimentaryDay}
                      onChangeText={setComplimentaryDay}
                      customStyle={styles.inputThird}
                    />
                  </View> */}
                      <Text h5 semiBold style={styles.label}>
   Complimentary (Optional)
</Text>

<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
  {/* Year Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 10 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
      selected={complimentaryYear}
      selectedCb={(id, val) => setComplimentaryYear(parseInt(val?.value) || '')}
      uniqueId="durationYear"
      placeholder="Year"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>

  {/* Month Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 12 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
      selected={complimentaryMonth}
      selectedCb={(id, val) => setComplimentaryDay(parseInt(val?.value) || '')}
      uniqueId="durationMonth"
      placeholder="Month"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>

  {/* Day Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 31 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
      selected={complimentaryDay}
      selectedCb={(id, val) => setComplimentaryDay(parseInt(val?.value) || '')}
      uniqueId="durationDay"
      placeholder="Day"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>
</View>


                  {/* Fees Section */}
                  <View style={[styles.rowInputs, styles.sectionSpacing]}>
                    <View style={styles.feesColumn}>
                      <Text h5 semiBold numberOfLines={1}>
                        Discounted Fees
                      </Text>
                      <TextInputEml
                        placeholder="discounted fees"
                        value={discountedFees}
                        onChangeText={setDiscountedFees}
                        customStyle={styles.inputFullWidth}
                      />
                    </View>
                    <View style={styles.feesColumn}>
                      <Text h5 semiBold numberOfLines={1}>
                        Actual Fees
                      </Text>
                      <TextInputEml
                        placeholder="actual fees"
                        value={actualFees}
                        onChangeText={setActualFees}
                        customStyle={styles.inputFullWidth}
                      />
                    </View>
                  </View>

                  {/* Search + Chips */}
                  <Card third style={{ padding:12 }}>
  {/* Search */}
  <Search
    value={searchText}
    onChangeText={onChangeText}
    placeholder="Search Amenities..."
    autoFocus={true}
    showLoading={showLoading}
    loadingProps={
      <ActivityIndicator
        style={{ marginRight: 10 }}
        animating
        size="small"
      />
    }
    containerStyle={{
      backgroundColor: 'transparent',
      padding: 0,
    bottom:20
    }}
    inputContainerStyle={{
    
     borderLeftWidth: 0,
    borderBottomWidth: 1,
      borderTopWidth:0,
    
        borderRightWidth: 0,
      marginBottom: 10,
    }}
  />

  {/* Dropdown (only show when user is searching) */}
  {searchText.length > 0 && (
    <View style={{ maxHeight: 200 }}>
      <ScrollView nestedScrollEnabled={true}>
        {(filteredData.length > 0 ? filteredData : aninitiesList).map(
          (item, index) => (
            <TouchableOpacity
              key={item?.id?.toString() || index.toString()}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderColor: '#ccc',
                backgroundColor: '#fff',
              }}
              onPress={() => {
                if (!selectedInterests.some(i => i.id === item.id)) {
                  setSelectedInterests(prev => [...prev, item]);
                }
                setSearchText('');
                setFilteredData([]);
              }}
            >
              <Text style={{ color: '#000' }}>{item.name}</Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    </View>
  )}

  {/* Chips inside Card */}
  {selectedInterests.length > 0 && (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
      }}
    >
      {selectedInterests
        .slice()
        .reverse()
        .map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#e0e0e0',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 20,
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ color: '#333', marginRight: 6 }}>
              #{item.name || item}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setSelectedInterests(prev =>
                  prev.filter(selected => selected !== item)
                )
              }
            >
              <Text style={{ color: '#999', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
    </View>
  )}
</Card>


                  {/* Bottom Button */}
                </>
              }
              contentContainerStyle={{padding: 20}}
            />
          </KeyboardAvoidingView>
          <View style={styles.bottomButton}>
            <ButtonWithPushBack customContainerStyle={{width: '100%'}}>
              <PrimaryButton
                title="Create Package"
                onPress={() => {
                  // createMainTask();
                  submitMembershipPlan();
                }}
              />
            </ButtonWithPushBack>
          </View>
        </Slide>
      )}
         {step === 2 && (
        <Slide index={2}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
            keyboardVerticalOffset={80}>
            <Header
              showBack={true}
              title="Membership package"
              customBackEvent={() => setStep(0)}
            />

            <FlatList
              ListHeaderComponent={
                <>
                  {/* Membership Name */}
                  <Text h5 semiBold style={styles.label}>
                    Membership Name
                  </Text>
                  <TextInputEml
                    placeholder="Enter membership name"
                    value={member}
                    onChangeText={setMember}
                    customStyle={styles.inputFullWidth}
                  />

               
                  <Text h5 semiBold style={[styles.label, styles.sectionSpacing]}>
  Duration
</Text>

<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
  {/* Year Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 10 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
     selected={durationYear?.toString()}
      selectedCb={(id, val) => setDurationYear(parseInt(val?.value) || '')}
      uniqueId="durationYear"
      placeholder="Year"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>

  {/* Month Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 12 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
    selected={durationMonth?.toString()}
      selectedCb={(id, val) => setDurationMonth(parseInt(val?.value) || '')}
      uniqueId="durationMonth"
      placeholder="Month"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>

  {/* Day Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 31 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
    selected={durationDay?.toString()}
      selectedCb={(id, val) => setDurationDay(parseInt(val?.value) || '')}
      uniqueId="durationDay"
      placeholder="Day"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>
</View>



                
                      <Text h5 semiBold style={styles.label}>
   Complimentary (Optional)
</Text>

<View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
  {/* Year Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 10 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
   selected={complimentaryYear?.toString()}
      selectedCb={(id, val) => setComplimentaryYear(parseInt(val?.value) || '')}
      uniqueId="durationYear"
      placeholder="Year"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>

  {/* Month Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 12 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
    selected={complimentaryMonth?.toString()}
      selectedCb={(id, val) => setComplimentaryDay(parseInt(val?.value) || '')}
      uniqueId="durationMonth"
      placeholder="Month"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>

  {/* Day Dropdown */}
  <View style={{ width: '31%' }}>
    <SingleSelect
      arrayData={Array.from({ length: 31 }, (_, i) => ({
        key: `${i + 1}`,
        value: `${i + 1}`,
      }))}
    selected={complimentaryDay?.toString()}
      selectedCb={(id, val) => setComplimentaryDay(parseInt(val?.value) || '')}
      uniqueId="durationDay"
      placeholder="Day"
      search={false}
      boxStyles={{ width: '100%' }}
      dropdownStyles={{ width: '100%' }}
    />
  </View>
</View>


                  {/* Fees Section */}
                  <View style={[styles.rowInputs, styles.sectionSpacing]}>
                    <View style={styles.feesColumn}>
                      <Text h5 semiBold numberOfLines={1}>
                        Discounted Fees
                      </Text>
                      <TextInputEml
                        placeholder="discounted fees"
                        value={discountedFees}
                        onChangeText={setDiscountedFees}
                        customStyle={styles.inputFullWidth}
                      />
                    </View>
                    <View style={styles.feesColumn}>
                      <Text h5 semiBold numberOfLines={1}>
                        Actual Fees
                      </Text>
                      <TextInputEml
                        placeholder="actual fees"
                        value={actualFees}
                        onChangeText={setActualFees}
                        customStyle={styles.inputFullWidth}
                      />
                    </View>
                  </View>

                  {/* Search + Chips */}
                  <Card third style={{ padding:12 }}>
  {/* Search */}
  <Search
    value={searchText}
    onChangeText={onChangeText}
    placeholder="Search Amenities..."
    autoFocus={true}
    showLoading={showLoading}
    loadingProps={
      <ActivityIndicator
        style={{ marginRight: 10 }}
        animating
        size="small"
      />
    }
    containerStyle={{
      backgroundColor: 'transparent',
      padding: 0,
    bottom:20
    }}
    inputContainerStyle={{
    
     borderLeftWidth: 0,
    borderBottomWidth: 1,
      borderTopWidth:0,
    
        borderRightWidth: 0,
      marginBottom: 10,
    }}
  />

  {/* Dropdown (only show when user is searching) */}
  {searchText.length > 0 && (
    <View style={{ maxHeight: 200 }}>
      <ScrollView nestedScrollEnabled={true}>
        {(filteredData.length > 0 ? filteredData : aninitiesList).map(
          (item, index) => (
            <TouchableOpacity
              key={item?.id?.toString() || index.toString()}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderColor: '#ccc',
                backgroundColor: '#fff',
              }}
              onPress={() => {
                if (!selectedInterests.some(i => i.id === item.id)) {
                  setSelectedInterests(prev => [...prev, item]);
                }
                setSearchText('');
                setFilteredData([]);
              }}
            >
              <Text style={{ color: '#000' }}>{item.name}</Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    </View>
  )}

  {/* Chips inside Card */}
  {selectedInterests.length > 0 && (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
      }}
    >
      {selectedInterests
        .slice()
        .reverse()
        .map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#e0e0e0',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 20,
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ color: '#333', marginRight: 6 }}>
              #{item.name || item}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setSelectedInterests(prev =>
                  prev.filter(selected => selected !== item)
                )
              }
            >
              <Text style={{ color: '#999', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
    </View>
  )}
</Card>


                  {/* Bottom Button */}
                </>
              }
              contentContainerStyle={{padding: 20}}
            />
          </KeyboardAvoidingView>
          {/* <View style={styles.bottomButton}> */}
             <ButtonWithPushBack customContainerStyle={styles.buttonContainerss}>
            <View style={styles.buttonCont}>
              <PrimaryButton
                title="Edit"
                onPress={editMembershipPackage}
                buttonStyle={{width: '80%'}}
              />
              <PrimaryButton
                title="Delete"
                onPress={confirmDeletePackage}
                buttonStyle={{width: '80%'}}
                customsBg="grey"
              />
            </View>
          </ButtonWithPushBack>
          {/* </View> */}
        </Slide>
      )}
    </SafeAreaView>
  );
};

export default GymMemberShipScree;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    paddingHorizontal:16
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp('10%'),
    right: wp('7%'),
  },
  buttonContainers: {
    marginVertical: 20,
    width: '50%',
    alignSelf: 'center',
  },
    buttonContainerss: {
    marginVertical: 30,
    //   // bottom: hp('10'),
    // width: '50%',
    // alignSelf: 'center',
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
  bottomButton: {
    marginVertical: 20,
    // bottom: 50,
    bottom: 10,
    left: 20,
    right: 20,
    paddingHorizontal: 16,
  },
  formContainer: {
    paddingHorizontal: 16,
    // marginTop: 20,
    // alignItems: 'center',
    //  width: '100%',
  },
  inputFullWidth: {
    width: '100%',
    height: 48,
    //   marginTop: 8,
  },

  inputThird: {
    width: '30%',
    height: 48,
  },
  label: {
    // alignSelf: 'flex-start',
    // marginBottom: 6,
  },
  feesColumn: {
    width: '48%', // increased from 40%
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // ADD THIS to vertically align them
  },
  bottomButton: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
});
