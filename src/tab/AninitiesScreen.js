import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Slide from '../assets/slide';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import useTheme from '../hooks/useTheme';
import Header from '../component/header';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Icon from '../component/icon';
import Text from '../component/Text';
import TextInputEml from '../component/textInput';
import axios from 'axios';
import AuthStorage from '../utils/authStorage';
import { showMessage } from '../utils/messages/message';
import Card from '../component/card';
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');
 export const normalizeSpacing = (value) => (height > 800 ? value : value * 0.8);
const AninitiesScreen = () => {
  const [step, setStep] = useState(0);
  const { theme } = useTheme();
  const [aninities, setAninities] = useState('');
  const [aninitiesList, setAninitiesList] = useState('');
console.log("ani",aninitiesList)
const [aninitiesId, setAninitiesId] = useState('');

// const handleCreateAninities = async () => {
//   if (!aninities) {
//     console.warn('Please enter Aninities'); // You can replace with a toast
//     return;
//   }

//   const formData = new FormData();
//   formData.append('name', aninities);

//   try {
//     const accessToken = await AuthStorage.getAccessToken();

//     const response = await axios.post(
//       'http://52.70.194.52/api/gym/amenities/',
//       formData, // Body
//       {
//         headers: {
//         //   'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     console.log('Aninities created:', response.data);
//     setStep(0);
//     setAninities('');
//   } catch (error) {
//     if (error.response) {
//       console.error('Failed:', error.response.data?.message || 'Something went wrong');
//     } else {
//       console.error('API Error:', error.message);
//     }
//   }
// };

const handleCreateAninities = async () => {
  if (!aninities) {
       showMessage({
            message: 'Enter a Aninities first',
            type: 'Warning',
            duration: 3000,
            theme:theme
          }); // Replace with toast if needed
    return;
  }

  const formData = new FormData();
  formData.append('name', aninities); // Don't use .trim()

  try {
    const accessToken = await AuthStorage.getAccessToken();

    const response = await fetch('http://52.70.194.52/api/gym/amenities/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // DO NOT manually set 'Content-Type' for multipart/form-data in fetch
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Aninities created:', data);
          showMessage({
            message: 'Aninities created successfully',
            type: 'success',
            duration: 3000,
            theme:theme
          });
      
      setStep(0);
      setAninities('');
    fetchAnimities()
    } else {
      console.error('Failed:', data?.message || 'Something went wrong');
    }
  } catch (error) {
    console.error('API Error:', error.message);
  }
};
  const fetchAnimities = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch(
        'http://52.70.194.52/api/gym/amenities/',
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
        setAninitiesList(result); // Save the fetched plans in state
      } else {
        console.error('Error Fetching List:', result);
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };
  useEffect(() => {
  fetchAnimities();
}, []);
const handleSelect = (item) => {
  setAninities(item.name);      // 👈 set name
  setAninitiesId(item.id);      // 👈 set ID
  setStep(2);                   // 👈 go to edit step or form
};
const updateAnimities = async () => {
  if (!aninities || !aninitiesId) {
    showMessage({
      message: 'Amenity name or ID missing',
      type: 'warning',
      duration: 3000,
      theme: theme,
    });
    return;
  }

  const formData = new FormData();
  formData.append('name', aninities); // or any other fields you want to update

  try {
    const accessToken = await AuthStorage.getAccessToken(); // assuming token is stored

    const response = await fetch(`http://52.70.194.52/api/gym/amenities/${aninitiesId}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // No need to manually set Content-Type for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      showMessage({
        message: 'Amenity updated successfully',
        type: 'success',
        duration: 3000,
        theme: theme,
      });
      setStep(0); // go back to list view
      setAninities('');
      setAninitiesId('');
      fetchAnimities(); // refresh the list
      fetchAnimities()
    } else {
      console.error('Update failed:', data);
      showMessage({
        message: 'Failed to update amenity',
        type: 'danger',
        duration: 3000,
        theme: theme,
      });
    }
  } catch (error) {
    console.error('Error updating amenity:', error.message);
  }
};
const confirmDelete = () => {
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this Animities?',
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
  if (!aninitiesId) {
    return;
  }
  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await fetch(`http://52.70.194.52/api/gym/amenities/${aninitiesId}/`, {
               method: 'DELETE',
               headers: {
                 Authorization: `Bearer ${accessToken}`,
               },
             },
           );
     
           if (response.ok) {
             console.log('Animities deleted successfully');
           } else {
             const errorText = await response.text();
             console.log('Failed to delete Animities:', errorText);
           }
         } catch (error) {
           showMessage({
             message: 'Animities Deleted successfully',
             type: 'success',
             duration: 3000,
             theme: theme,
           });
           setStep(0);
           fetchAnimities();
         }
       };

  return (
       <SafeAreaView
             style={[
               styles.container,
               { backgroundColor: theme.$background }, // ✅ dynamic background color
             ]}
           >
      {step === 0 && (
        <>
          <Header showBack={true} title={'Aminities'} />
                  <View style={{paddingHorizontal: 16,flex:1}}>
          <FlatList
            data={aninitiesList}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <ButtonWithPushBack
onPress={() => handleSelect(item)
                
                }>
              <Card third style={styles.card}>
                <Text h4 customColor="black" bold>
                  {item.name}
                </Text>
                  {/* <Text h4 customColor="black" bold>
                  {item.id}
                </Text> */}
              </Card>
              </ButtonWithPushBack>
            )}
          />
        </View>
      
          <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
            <PrimaryButton
              title="Add"
              icon={<Icon name="plus" type="feather" size={15} color={theme.$background} />}
              onPress={() => setStep(1)}
            />
          </ButtonWithPushBack>
        </>
      )}

{step === 1 && (
  <Slide index={1}>
    <Header
      showBack={true}
      title={'Amenities'}
      customBackEvent={() => setStep(0)}
    />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* Input section */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <TextInputEml
            label="Add Amenity"
            placeholder="Enter Amenity Name"
            value={aninities}
            onChangeText={setAninities}
          />
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomButton}>
          <ButtonWithPushBack customContainerStyle={{ width: '100%' }}>
            <PrimaryButton
              title="Create Amenity"
              onPress={handleCreateAninities}
            />
          </ButtonWithPushBack>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Slide>
)}
{step === 2 && (
  <Slide index={2}>
    <Header
      showBack={true}
      title={'edit and Delete Amenities'}
      customBackEvent={() => setStep(0)}
    />

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* Input section */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <TextInputEml
            label="Add Amenity"
            placeholder="Enter Amenity Name"
            value={aninities}
            onChangeText={setAninities}
          />
        </View>

        {/* Bottom Button */}
       <ButtonWithPushBack>
          <View style={styles.buttonCont}>
            <PrimaryButton
              title="Edit"
              onPress={updateAnimities}
              buttonStyle={styles.updateButton}
            />
            <PrimaryButton
              title="Delete"
            
              onPress={confirmDelete}
              buttonStyle={styles.deleteButton}
              customsBg="grey"
            />
            
          </View>
          </ButtonWithPushBack>
      </View>
    </KeyboardAvoidingView>
  </Slide>
)}

    </SafeAreaView>
  );
};

export default AninitiesScreen;

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
  bottomButton: {
    paddingHorizontal: 16,
  
    marginVertical:80
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
