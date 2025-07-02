import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../component/header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import useTheme from '../hooks/useTheme';
import SingleSelect from '../component/singleSelect';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import axios from 'axios';
import AuthStorage from '../utils/authStorage';
import Slide from '../assets/slide';
import Icons from 'react-native-vector-icons/Ionicons';
import Text from '../component/Text';
import Card from '../component/card';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Icon from '../component/icon';
import AntDesign
from 'react-native-vector-icons/AntDesign';
import RNBlobUtil from 'react-native-blob-util';
import { WebView } from 'react-native-webview';


const DietPlan = () => {
  const { theme } = useTheme();
      const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    goal: null,
    duration: null,
    weightChange: null,
    foodType: null,
  });

  const [dietPlans, setDietPlans] = useState([]); // 👈 Store API response
const [nutritionists, setNutritionists] = useState([]);
const [selectedUserDetail, setSelectedUserDetail] = useState(null);
console.log("seee",nutritionists)
  const handleSelectChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value.key }));
  };

  const GOAL_OPTIONS = [
    { key: 'lean', value: 'Lean' },
    { key: 'gain', value: 'Gain' },
  ];

  const DURATION_OPTIONS = [
    { key: '7', value: '7 days' },
    { key: '30', value: '30 days' },
    { key: '90', value: '90 days' },
    { key: '180', value: '180 days' },
  ];

  const WEIGHT_CHANGE_OPTIONS = [
    { key: 'gain_kg', value: 'Weight gain in kgs' },
    { key: 'loss_kg', value: 'Weight loss in kgs' },
  ];

  const FOOD_TYPE_OPTIONS = [
    { key: 'veg', value: 'Veg' },
    { key: 'nonveg', value: 'Non-Veg' },
    { key: 'both', value: 'Both' },
  ];

  const fetchDietPlan = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();

      const params = {
        goal: form.goal?.toUpperCase(),
        days: form.duration,
        diet_type: form.foodType?.toUpperCase(),
      };

      const response = await axios.get(
        'http://52.70.194.52/api/core/diet-plans/',
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Response:', response.data);
      setDietPlans(response.data); // store response
      setStep(1);
    } catch (error) {
      console.error('Error fetching diet plan:', error);
      Alert.alert('Error', 'Failed to fetch diet plan.');
    }
  };
 const getNutionist = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await axios.get(
        'http://52.70.194.52/api/core/dietitian-nutritionist/',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Responsesss:', response.data);
     setNutritionists(response.data)
     setStep(2)
    } catch (error) {
      console.error('Error fetching diet plan:', error);
      Alert.alert('Error', 'Failed to fetch diet plan.');
    }
  };
const fetchUserDetail = async (userId) => {
  try {
    console.log("userId",userId)
    const accessToken = await AuthStorage.getAccessToken();
    const response = await axios.get(
      `http://52.70.194.52/api/core/user-full-detail/${userId}/`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("res",response.data)
    setSelectedUserDetail(response.data);
    setStep(4); // Go to next step
  } catch (error) {
    console.error('Error fetching user detail:', error);
    Alert.alert('Error', 'Failed to fetch user details.');
  }
};

// const downloadPDF = async (pdfPath, name) => {
//   try {
//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission) {
//       Alert.alert('Permission Denied', 'Cannot download file without storage permission.');
//       return;
//     }

//     const { config, fs } = RNFetchBlob;
//     const downloads = fs.dirs.DownloadDir;
//     const destPath = `${downloads}/${name}.pdf`;

//     config({
//       fileCache: true,
//       appendExt: 'pdf',
//       addAndroidDownloads: {
//         useDownloadManager: true,
//         notification: true,
//         path: destPath,
//         description: 'Downloading PDF',
//         title: name,
//         mime: 'application/pdf',
//         mediaScannable: true, // ✅ ensures it shows up in Downloads
//       },
//     })
//       .fetch('GET', pdfPath)
//       .then(res => {
//         Alert.alert('Download Complete', 'File saved to Downloads folder.');
//         console.log('File saved to:', res.path());
//       })
//       .catch(error => {
//         console.error('Download error:', error);
//         Alert.alert('Download failed', 'Unable to download file.');
//       });

//   } catch (error) {
//     console.error('Download error:', error);
//     Alert.alert('Download failed', 'Unable to download file.');
//   }
// };


const requestStoragePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const downloadPDF = async (pdfUrl, name) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot download without storage permission.');
      return;
    }

    const fileName = name.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
    const downloadDest = `${RNBlobUtil.fs.dirs.DownloadDir}/${fileName}`;

    RNBlobUtil.config({
      path: downloadDest,
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: downloadDest,
        description: 'Downloading file...',
      },
    })
      .fetch('GET', pdfUrl)
      .then(res => {
        Alert.alert('Download Complete', `Saved to: ${res.path()}`);
      })
      .catch(error => {
        console.error('Download failed:', error);
        Alert.alert('Error', 'Failed to download file.');
      });
  } catch (err) {
    console.error('Permission error:', err);
  }
};

  return (
     <SafeAreaView
             style={[
               styles.container,
               {backgroundColor: theme.$background}, // ✅ dynamic background color
             ]}>
      {step === 0 && <Header showBack={true} title="Diet plan" />}

      {step === 0 && (
        <View style={{ paddingHorizontal: 16, flex: 1, marginTop: 30 }}>
          <SingleSelect
            arrayData={GOAL_OPTIONS}
            selected={form.goal}
            selectedCb={handleSelectChange}
            uniqueId="goal"
            placeholder="Select Goal"
          />
          <SingleSelect
            arrayData={DURATION_OPTIONS}
            selected={form.duration}
            selectedCb={handleSelectChange}
            uniqueId="duration"
            placeholder="Select Duration"
          />
          <SingleSelect
            arrayData={WEIGHT_CHANGE_OPTIONS}
            selected={form.weightChange}
            selectedCb={handleSelectChange}
            uniqueId="weightChange"
            placeholder="Select Weight Change"
          />
          <SingleSelect
            arrayData={FOOD_TYPE_OPTIONS}
            selected={form.foodType}
            selectedCb={handleSelectChange}
            uniqueId="foodType"
            placeholder="Select Food Type"
          />
        </View>
      )}

      {step === 0 && (
        <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
          <PrimaryButton title="Get Free Diet Plan" onPress={fetchDietPlan} />
        </ButtonWithPushBack>
      )}

      {step === 1 && (
        <Slide index={1}>
          <Header
            showBack={true}
            title="Download Diet Plan"
            customBackEvent={() => setStep(0)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
    
<ScrollView contentContainerStyle={styles.scrollContainer}>
      {dietPlans.map((item, index) => (
        <View key={index} style={styles.card}>
          <WebView
            source={{ uri: `https://docs.google.com/gview?embedded=true&url=${item.pdf_file}` }}
            style={styles.pdfViewer}
          />
          <View style={styles.cardFooter}>
            <Text style={{ color: 'white', flex: 1 }}>{item.name}</Text>
            <TouchableOpacity onPress={() => downloadPDF(item.pdf_file, item.name)}>
              <Icons name="download-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>


          </KeyboardAvoidingView>

          <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
            <PrimaryButton title="Get your Dietitian"   onPress={getNutionist} />
          </ButtonWithPushBack>
        </Slide>
      )}
       {step === 2 && (
        <Slide index={2}>
          <Header
            showBack={true}
            title="Dietitian or Nutrtionist"
            customBackEvent={() => setStep(0)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
          
<FlatList
  data={nutritionists}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
   <ButtonWithPushBack onPress={() => fetchUserDetail(item.u_id)}>
    <Card
      third
      style={{
        marginBottom: 10,
        padding: 16,
        borderRadius: 10,
        flexDirection: 'column',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Avatar / Logo */}
        <Avatar
          size={wp('15%')}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: '#D9D9D9',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={
            item.business_logo
              ? { uri: item.business_logo }
              : undefined
          }
          title={
            !item.business_logo && item.business_name
              ? item.business_name.charAt(0).toUpperCase()
              : ''
          }
        />

        {/* Info */}
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text h4 bold>{item.business_owner}</Text>
          {/* <Text h5 semiBold>{item.business_name}</Text> */}
          <Text h5 semiBold>{item.business_address}</Text>
        </View>
      </View>
    </Card>
    </ButtonWithPushBack>
  )}
/>
          </KeyboardAvoidingView>
        </Slide>
      )}
        {step === 4 && (
  <Slide index={4}>
    <Header
      showBack={true}
      title={selectedUserDetail.businessinfo.sub_category ?? 'Business'}
      rightComponent={
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity onPress={() => navigation.navigate('uploadreels')}>
            <AntDesign name="plussquareo" size={23} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
            <Icon name="bell" size={23} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Icon name="menu" size={23} color={'black'} />
          </TouchableOpacity>
        </View>
      }
    />
        <View style={{ marginTop: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
      <Avatar
        size={70}
        rounded
        overlayContainerStyle={{
          backgroundColor: theme.$surface,
          borderColor: theme.$secondaryText,
          borderWidth: 1,
        }}
        source={
          selectedUserDetail.businessinfo?.business_logo
            ? { uri: selectedUserDetail.businessinfo.business_logo }
            : require('../assets/icon/profiles.png')
        }
      />
      <View style={{ marginLeft: 16 }}>
         <Text h4 bold>{selectedUserDetail.businessinfo?.business_owner}</Text>
        {/* <Text h4 bold>{selectedUserDetail.first_name} {selectedUserDetail.last_name}</Text> */}
        <Text h5>{selectedUserDetail.businessinfo?.sub_sub_category}</Text>
        {/* <Text h5>{selectedUserDetail.businessinfo?.business_address}</Text> */}
      </View>
    </View>
    <View style={{ flexDirection: 'row', gap: 10, justifyContent:"center", top: 20, paddingHorizontal: 16 }}>
      <ButtonWithPushBack customContainerStyle={{ flex: 1 }}>
        <PrimaryButton title="Follow" onPress={() => Alert.alert("Coming soon")} />
      </ButtonWithPushBack>

      <ButtonWithPushBack customContainerStyle={{ flex: 1 }}>
        <PrimaryButton title="Message" onPress={() => Alert.alert("Coming soon")} />
      </ButtonWithPushBack>      
    </View>
  </Slide>
)}
    </SafeAreaView>
  );
};

export default DietPlan;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    // padding: hp('2%'),
      paddingHorizontal: 16,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 30,
  },
   pdfViewer: {
    width: 360,
    height: 150,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
  borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#ccc',
    overflow: 'hidden',
      elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardFooter: {
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
