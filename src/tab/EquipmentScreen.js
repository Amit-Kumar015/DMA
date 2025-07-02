import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Alert,
  ToastAndroid,
  SafeAreaView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../component/header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import useTheme from '../hooks/useTheme';
import Icon from '../component/icon';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Slide from '../assets/slide';
import Custominput from '../component/Custominput';
import Text from '../component/Text';
import {Avatar, BottomSheet, ListItem} from 'react-native-elements';
import {openCamera, openPhotos} from '../utils/imagePicker';
import Card from '../component/card';
import AuthStorage from '../utils/authStorage';
import ImageResizer from 'react-native-image-resizer';
import {useFocusEffect} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import TextInputEml from '../component/textInput';

const EquipmentScreen = () => {
  const {theme} = useTheme();
  const [step, setStep] = useState(0);
  const [profilePic, setProfilePic] = useState(null);

  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentDescription, setEquipmentDescription] = useState('');
  const [equipmentCount, setEquipmentCount] = useState('');

  const [equipmentList, setEquipmentList] = useState([]);

  const [isVisible, setIsVisible] = useState(false);
  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const userType = useSelector(state => state.user.userData?.user?.user_type);
  console.log("u22222",userType)
  console.log("detaisl",equipmentDetails)
  console.log('Name:', equipmentName);
console.log('Description:', equipmentDescription);
console.log('Count:', equipmentCount);
const [nameError, setNameError] = useState('');
const [descError, setDescError] = useState('');
const [countError, setCountError] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchEquipmentList();
    }, []),
  );

  useEffect(() => {
    if (equipmentDetails) {
      setEquipmentName(equipmentDetails.name || '');
      setEquipmentDescription(equipmentDetails.description || '');
      setEquipmentCount(equipmentDetails.count?.toString() || '');
    }
  }, [equipmentDetails]);
  const list = [
    {title: 'Take Photo', icon: 'camera', onPress: () => handleCameraOpen()},
    {
      title: 'Choose from Gallery',
      icon: 'view-gallery',
      onPress: () => handleGalleryOpen(),
    },
    {
      title: 'Cancel',
      icon: 'close',
      titleStyle: {color: theme.$danger},
      onPress: () => setIsVisible(false),
    },
  ];

  const handleImagePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Take Photo', 'Choose from Gallery', 'Cancel'],
          cancelButtonIndex: 2,
        },
        buttonIndex => {
          if (buttonIndex === 0) handleCameraOpen();
          else if (buttonIndex === 1) handleGalleryOpen();
        },
      );
    } else {
      setIsVisible(true);
    }
  };

  const handleCameraOpen = async () => {
    try {
      const image = await openCamera({cropping: true});

      if (image) {
        console.log('Original Image:', image); // Debugging

        // Resize the image properly
        const resizedImage = await ImageResizer.createResizedImage(
          image.uri,
          800, // Width
          800, // Height
          'JPEG', // Format
          80, // Quality
        );

        console.log('Resized Image:', resizedImage); // Debugging

        setProfilePic(resizedImage.uri); // Update state
        setIsVisible(false);
      }
    } catch (error) {
      console.log('Camera Error:', error);
    }
  };

  // Function to open the Gallery
  const handleGalleryOpen = async () => {
    try {
      const image = await openPhotos({cropping: true});
      setProfilePic(image.uri);
      setIsVisible(false);
    } catch (error) {
      console.log('Gallery Error:', error);
    }
  };

  // const handleCreateEquipment = async () => {
  //   if (!equipmentName || !equipmentDescription || !equipmentCount) {
  //     Alert.alert('Error', 'All fields are required.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('name', equipmentName);
  //   formData.append('description', equipmentDescription);
  //   formData.append('no_of_equipment', equipmentCount);

  //   if (profilePic) {
  //     formData.append('image', {
  //       uri: profilePic,
  //       name: `equipment_image_${Date.now()}.jpg`,
  //       type: 'image/jpeg',
  //     });
  //   }

  //   try {
  //     const accessToken = await AuthStorage.getAccessToken();

  //     const response = await fetch('http://52.70.194.52/api/core/equipment/', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: formData,
  //     });
  //    console.log("res",response)
  //    console.log("formData",formData)
  //     const responseText = await response.text();
  //     let data;
  //     try {
  //       data = JSON.parse(responseText);
  //     } catch (jsonError) {
  //       console.error('JSON Parse Error:', jsonError);
  //       Alert.alert('Error', 'Unexpected response format. Please try again.');
  //       return;
  //     }

  //     if (response.ok) {
  //       Alert.alert('Success', 'Equipment added successfully');

  //       // **Step reset hone se pehle list refresh karna zaroori hai**
  //       await fetchEquipmentList(); // API se latest list fetch karo
  //       setStep(0);
  //     } else {
  //       // Alert.alert('Error', data.message || 'Something went wrong');
  //     }
  //   } catch (error) {
  //     console.error('Network/Request Error:', error);
  //     Alert.alert('Error', 'Failed to add equipment. Please try again.');
  //   }
  // };

  const fetchEquipmentList = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      console.log('🚀 Access Token:', accessToken); // Replace with your actual token

      const response = await fetch('http://52.70.194.52/api/core/equipment/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEquipmentList(data);
      } else {
        Alert.alert('Error', 'Failed to fetch equipment.');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };
const handleCreateEquipment = async () => {
  let valid = true;

  // Reset errors
  setNameError('');
  setDescError('');
  setCountError('');

  // Field validations
  if (!equipmentName) {
    setNameError('Equipment name is required');
    valid = false;
  }

  if (!equipmentDescription) {
    setDescError('Description is required');
    valid = false;
  }

  if (!equipmentCount) {
    setCountError('Count is required');
    valid = false;
  }

  if (!valid) return;

  const formData = new FormData();
  formData.append('name', equipmentName);
  formData.append('description', equipmentDescription);
  formData.append('no_of_equipment', equipmentCount);

  if (profilePic) {
    formData.append('image', {
      uri: profilePic,
      name: `equipment_image_${Date.now()}.jpg`,
      type: 'image/jpeg',
    });
  }

  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await fetch('http://52.70.194.52/api/core/equipment/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError);
      return;
    }

    if (response.ok) {
      Alert.alert('Success', 'Equipment added successfully');
      await fetchEquipmentList();
      setStep(0);
    } else {
      console.error('Server Error:', data);
      Alert.alert('Error', data.message || 'Something went wrong');
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
};

  const handleViewPress = async id => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      setLoading(true);
      const response = await fetch(
        `http://52.70.194.52/api/core/equipment/${id}/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`, // Token dynamic pass karein
          },
        },
      );
      const data = await response.json();

      setEquipmentDetails(data); // API response ko state me store karein
      setStep(2); // Step ko update karein taake details screen dikhe
    } catch (error) {
      console.error('Error fetching equipment details:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteEquipment = async () => {
    if (isDeleting || !equipmentDetails?.id) return;
  
    try {
      setIsDeleting(true);
  
      const accessToken = await AuthStorage.getAccessToken();
      if (!accessToken) return;
  
      const apiUrl = `http://52.70.194.52/api/core/equipment/${equipmentDetails.id}/`;
      const deleteResponse = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (deleteResponse.ok) {
        // Successful delete
        setEquipmentList(prevList => 
          prevList.filter(item => item.id !== equipmentDetails.id) // Remove the deleted item from the list
        );
        Alert.alert('Success', 'Equipment deleted successfully.'); // Show success alert
        setStep(0); // Reset to step 0
      } else {
        const errorData = await deleteResponse.json(); // Get error details
        console.error('❌ Failed to delete equipment. Status:', deleteResponse.status, errorData);
        Alert.alert('Error', errorData.message || 'Failed to delete equipment. Please try again.'); // Show error alert
      }
    } catch (error) {
      console.log('❌ Error deleting equipment:', error.message);
      Alert.alert('Error', 'An error occurred while deleting the equipment.'); // Show error alert
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleEditEquipment = async () => {
    const formData = new FormData();
  
    if (equipmentName) {
      formData.append('name', equipmentName);
    }
    if (equipmentDescription) {
      formData.append('description', equipmentDescription);
    }
    if (equipmentCount) {
      formData.append('no_of_equipment', equipmentCount.toString());
    }
    if (profilePic) {
      formData.append('image', {
        uri: profilePic,
        name: `equipment_image_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });
    }
  
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch(
        `http://52.70.194.52/api/core/equipment/${equipmentDetails.id}/`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`, // use your token here
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        return;
      }
  
      const updatedData = await response.json();
      console.log('Updated Equipment:', updatedData);
  
      setEquipmentList(prevList =>
        prevList.map(item =>
          item.id === updatedData.id ? updatedData : item,
        ),
      );
  
      setEquipmentName(updatedData.name || '');
      setEquipmentDescription(updatedData.description || '');
      setEquipmentCount(updatedData.no_of_equipment?.toString() || '');
      setProfilePic(updatedData.image || '');
  
      setStep(0);
    } catch (err) {
      console.error('Error while updating equipment:', err);
    }
  };
  
  
  const handleUpdateEquipment = () => {
    if (equipmentDetails) {
      // Ensure the details are correctly set before navigating to step 3
      setProfilePic(equipmentDetails.image || '');
      setEquipmentName(equipmentDetails.name || '');
      setEquipmentDescription(equipmentDetails.description || '');
      setEquipmentCount(String(equipmentDetails.no_of_equipment || ''));
      setStep(3); // Navigate to step 3 after setting the data
    } else {
      console.error("No equipment details available");
    }
  };
  useEffect(() => {
    if (step === 3 && equipmentDetails) {
      setProfilePic(equipmentDetails.image || '');
      setEquipmentName(equipmentDetails.name || '');
      setEquipmentDescription(equipmentDetails.description || '');
      setEquipmentCount(String(equipmentDetails.no_of_equipment || ''));
    }
  }, [step, equipmentDetails]);
  const handleAddNewEquipment = () => {
    setEquipmentName('');
    setEquipmentDescription('');
    setEquipmentCount('');
    setProfilePic(null);
    setStep(1);
  };
  return (
    <SafeAreaView
           style={[
             styles.container,
             { backgroundColor: theme.$background }, // ✅ dynamic background color
           ]}
         >
      {step === 0 && <Header showBack={true} title="Equipment" />}

{step === 0 && (
  equipmentList.length > 0 ? (
    <View style={{ paddingHorizontal: 16 }}>
      <FlatList
        data={equipmentList}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <Card third style={styles.card}>
            <Avatar
              size={wp('20%')}
              overlayContainerStyle={{
                backgroundColor: theme.$surface,
                borderColor: theme.$secondaryText,
                borderWidth: 1,
              }}
              source={
                item.image
                  ? { uri: item.image }
                  : require('../assets/icon/profiles.png')
              }
            />
            <View style={{ marginTop: hp('1%') }}>
              <Text h4 semiBold textAliments="center" customColor="black">
                {item.name}
              </Text>
            </View>
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                onPress={() => handleViewPress(item.id, setStep(2))}
                style={styles.viewButton}>
                <Text h6 style={{ color: 'white' }}>View</Text>
              </TouchableOpacity>
              <View style={styles.circle}>
                <Text style={styles.circleText}>
                  {item.no_of_equipment}
                </Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  ) : (
    <View style={{ alignItems: 'center', marginTop: 50 }}>
      <Image
        source={require('../assets/icon/attendence.webp')} // Or use a specific equipment placeholder image
        style={{
          width: 200,
          height: 200,
          resizeMode: 'contain',
          marginBottom: 60,
        }}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <Text h3 bold textAliments="center" customColor="black">
          No Equipment available.
        </Text>
      </View>
    </View>
  )
)}


      {step === 0 && (
        <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
          <PrimaryButton
            title="Add"
            icon={<Icon name="plus" type="feather" size={15} color={theme.$background} />}
            onPress={() => handleAddNewEquipment()}
          />
        </ButtonWithPushBack>
      )}

      {step === 1 && (
        <Slide index={1}>
          <Header
            showBack={true}
            title="Create New Equipment"
            customBackEvent={() =>
              setStep(step > 0 ? step - 1 : navigation.goBack())
            }
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.stepContainer}>
                <Text h4 semiBold>
                  Add Photo
                </Text>
                <View style={styles.avatarWrapper}>
                  <Avatar
                    size={wp('25%')}
                    rounded
                    overlayContainerStyle={{
                      backgroundColor: theme.$surface,
                      borderColor: theme.$secondaryText,
                      borderWidth: 1,
                    }}
                    source={profilePic ? {uri: profilePic} : null}
                  />
                  <TouchableOpacity
                    onPress={handleImagePicker}
                    style={styles.cameraIcon}>
                    <Icon
                      name="camera"
                      size={wp('10%')}
                      color={theme.$secondaryText}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  {/* <Custominput
                    title="Equipment Name"
                    value={equipmentName}
                    onValueChange={setEquipmentName}
                  /> */}
                     <TextInputEml
                // ref={inputRef}
                label="Equipment Name"
                placeholder="Equipment Name"
                value={equipmentName}
                onChangeText={setEquipmentName}
               
              />
              {nameError ? (
  <Text style={{ color: 'red', marginTop: 4 }}>{nameError}</Text>
) : null}
              
                </View>
                <View style={styles.inputContainer}>
                  <Custominput
                    title="Equipment Description"
                    value={equipmentDescription}
                    onValueChange={setEquipmentDescription}
                  />
                       {/* <TextInputEml
                // ref={inputRef}
                label="Equipment Description"
                placeholder="Equipment Description"
                value={equipmentDescription}
                onChangeText={equipmentDescription} */}
               
              {/* /> */}
                        {descError ? (
  <Text style={{ color: 'red', marginTop: 4 }}>{descError}</Text>
) : null}
                </View>
                <View style={styles.inputContainer}>
                           <TextInputEml
                // ref={inputRef}
                label="Count"
                placeholder="Count"
                value={equipmentCount}
                onChangeText={setEquipmentCount}
                keyboardType="numeric"
              />
                                  {countError ? (
  <Text style={{ color: 'red', marginTop: 4 }}>{countError}</Text>
) : null}
                </View>
              </View>

              <BottomSheet
                isVisible={isVisible}
                containerStyle={{backgroundColor: theme.$surface}}>
                {list.map(({title, icon, onPress, titleStyle}) => (
                  <ListItem
                    key={`${title}-${icon}`}
                    bottomDivider
                    onPress={onPress}>
                    <Icon name={icon} color={theme.$onSurface || '#000'} />
                    <ListItem.Content>
                      <ListItem.Title style={titleStyle}>
                        {title}
                      </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                ))}
              </BottomSheet>
            </ScrollView>
          </KeyboardAvoidingView>
          <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            {/* <PrimaryButton title="Update" onPress={""} /> */}
            <PrimaryButton title="create" onPress={handleCreateEquipment} />
          </ButtonWithPushBack>
        </Slide>
      )}
      {/* {step === 2 && ( */}
      {step === 2 && equipmentList && (
        <Slide index={2}>
          <Header
            showBack={true}
            title="Equipment"
            customBackEvent={() => setStep(0)} // Go back to list
          />
          <View
            style={{
              borderColor: '#000000',
              borderWidth: 1,
              height: '50%',
            }}>
            <Avatar
              size={wp('90%')}
              source={
                equipmentDetails?.image
                  ? {uri: equipmentDetails.image}
                  : undefined
              }
              containerStyle={{flex: 1, alignSelf: 'center',}}
              resizeMode="contain"
            />
          </View>

          <View style={{marginTop: hp('2%')}}>
            <Text h1 Bold textAliments="center">
              {equipmentDetails?.name}
            </Text>
          </View>

          <View style={{marginTop: hp('2%')}}>
            <Text h4 textAliments="center">
              {equipmentDetails?.description}
            </Text>
          </View>
          <ButtonWithPushBack>
          <View style={styles.buttonCont}>
            <PrimaryButton
              title="Edit"
              onPress={handleUpdateEquipment}
              buttonStyle={styles.updateButton}
            />
            <PrimaryButton
              title="Delete"
            
              onPress={handleDeleteEquipment}
              buttonStyle={styles.deleteButton}
              customsBg="grey"
            />
            
          </View>
          </ButtonWithPushBack>
          
        </Slide>
      )}
        {step === 3  && (
        <Slide index={3}>
      
          <Header
            showBack={true}
            title="Edit Equipment"
            customBackEvent={() =>
              setStep(step > 0 ? step - 1 : navigation.goBack())
            }
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.stepContainer}>
                <Text h4 semiBold>
                  Add Photo
                </Text>
                <View style={styles.avatarWrapper}>
                  <Avatar
                    size={wp('25%')}
                    rounded
                    overlayContainerStyle={{
                      backgroundColor: theme.$surface,
                      borderColor: theme.$secondaryText,
                      borderWidth: 1,
                    }}
                    source={profilePic ? {uri: profilePic} : null}
                  />
                  {/* <TouchableOpacity
                    onPress={handleImagePicker}
                    style={styles.cameraIcon}>
                    <Icon
                      name="camera"
                      size={wp('10%')}
                      color={theme.$secondaryText}
                    />
                  </TouchableOpacity> */}
                </View>

              <View style={styles.inputContainer}>
                  {/* <Custominput
                    title="Equipment Name"
                    value={equipmentName}
                    onValueChange={setEquipmentName}
                  /> */}
                     <TextInputEml
                // ref={inputRef}
                label="Equipment Name"
                placeholder="Equipment Name"
                value={equipmentName}
                onChangeText={setEquipmentName}
               
              />
                </View>
                <View style={styles.inputContainer}>
                  {/* <Custominput
                    title="Equipment Description"
                    value={equipmentDescription}
                    onValueChange={equipmentDescription}
                  /> */}
                       <TextInputEml
                // ref={inputRef}
                label="Equipment Description"
                placeholder="Equipment Description"
                value={equipmentDescription}
                onChangeText={equipmentDescription}
               
              />
                </View>
                <View style={styles.inputContainer}>
                  {/* <Custominput
                    title="Count"
                    value={equipmentCount}
                    onValueChange={setEquipmentCount}
                    keyboardType="numeric"
                  /> */}
                           <TextInputEml
                // ref={inputRef}
                label="Count"
                placeholder="Count"
                value={equipmentCount}
                onChangeText={setEquipmentCount}
                keyboardType="numeric"
              />
                </View>
              </View>

              {/* <BottomSheet
                isVisible={isVisible}
                containerStyle={{backgroundColor: theme.$surface}}>
                {list.map(({title, icon, onPress, titleStyle}) => (
                  <ListItem
                    key={`${title}-${icon}`}
                    bottomDivider
                    onPress={onPress}>
                    <Icon name={icon} color={theme.$onSurface || '#000'} />
                    <ListItem.Content>
                      <ListItem.Title style={titleStyle}>
                        {title}
                      </ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                ))}
              </BottomSheet> */}
            </ScrollView>
          </KeyboardAvoidingView>
          <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            {/* <PrimaryButton title="Update" onPress={""} /> */}
            <PrimaryButton title="Save" onPress={handleEditEquipment} />
          </ButtonWithPushBack>
        </Slide>
      )}
    </SafeAreaView>

    // </TouchableWithoutFeedback>
  );
};

export default EquipmentScreen;

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
  stepContainer: {
    marginTop: hp('3%'),
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginTop: hp('2%'),
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
    position: 'relative',
   
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 1,
    left: '59%',
    transform: [{translateX: -wp('3%')}],
    borderRadius: wp('5%'),
    padding: wp('1.5%'),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp('5%'),
  },
  buttonContainers: {
    marginVertical: 20,
    justifyContent:"flex-end",
    width: '50%',
    alignSelf: 'center', // Centers the button
  },
  card: {
    flex: 1,
    // backgroundColor: '#111', // Dark card background
    margin: 8,
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
      // Border color
  },
  viewButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: hp('1%'),
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 80,
    paddingHorizontal: 16,
  },
  updateButton: {
    // backgroundColor: "#4CAF50", // Green color for update
    width: '80%',
  },
  deleteButton: {
    backgroundColor: 'grey', // Red color for delete
    width: '80%',
    left: 35,
  },
  circle: {
    position: 'absolute',
    top: '40%', // Align center vertically
    right: -28, // Move it outside the button
    width: 23,
    height: 23,
    borderRadius: 11.5, // Make it circular
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    // transform: [{ translateY: -12.5 }],
  },
  circleText: {
    color: '#fff',
    // fontWeight: 'bold',
  },
});
