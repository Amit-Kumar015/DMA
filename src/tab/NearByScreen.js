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
import {Avatar,} from 'react-native-elements';
import PrimaryButton from '../component/prButton';
import ButtonWithPushBack from '../component/Button';
import Checkbox from '../component/checkbox';
import Card from '../component/card';
import Header from '../component/header';
import AuthStorage from '../utils/authStorage';
import axios from 'axios';
import Slide from '../assets/slide';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Text from '../component/Text';
import { useNavigation } from '@react-navigation/native';
import Icon from '../component/icon';
import AntDesign
from 'react-native-vector-icons/AntDesign';
import useTheme from '../hooks/useTheme';
import CustomGrid from '../component/Grid';
const NearByScreen = () => {
  const [step, setStep] = useState(0);
  const {theme} = useTheme();
   
    const navigation = useNavigation();

  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('');
  const [businessInfoList, setBusinessInfoList] = useState([]);
  console.log("bussinfo",businessInfoList)
  const [selectedBusiness, setSelectedBusiness] = useState(null);
    console.log("buss",selectedBusiness)
    console.log("main",mainCategories)
    console.log("sele",selected)
     const [selected, setSelected] = useState(null);
   const images = [
  { uri: 'https://picsum.photos/id/1012/300/300' },
  { uri: 'https://picsum.photos/id/1012/300/300' },
  { uri: 'https://picsum.photos/id/1013/300/300' },
  { uri: 'https://picsum.photos/id/1015/300/300' },
  { uri: 'https://picsum.photos/id/1016/300/300' },
  { uri: 'https://picsum.photos/id/1018/300/300' },
  { uri: 'https://picsum.photos/id/1020/300/300' },
  { uri: 'https://picsum.photos/id/1024/300/300' },
  { uri: 'https://picsum.photos/id/1025/300/300' },
  { uri: 'https://picsum.photos/id/1027/300/300' },
  { uri: 'https://picsum.photos/id/1028/300/300' },
  { uri: 'https://picsum.photos/id/1031/300/300' },
  { uri: 'https://picsum.photos/id/1033/300/300' },
  { uri: 'https://picsum.photos/id/1035/300/300' },
  { uri: 'https://picsum.photos/id/1037/300/300' },
];
  
console.log("buss",businessInfoList)
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const accessToken = await AuthStorage.getAccessToken();
        const response = await axios.get(
          'http://52.70.194.52/api/core/categories/',
          {
            // headers: {
            //   Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NzgxMTg0LCJpYXQiOjE3NDQxNzYzODQsImp0aSI6ImZkNDRmMDNlZjVkYzQ1MTc4ZGI4NjFkZDQ2MGUxMzY2IiwidXNlcl9pZCI6ImEzMWY3NzZlLWVmYWUtNGIyOS1hZDIzLTZjMDU4MDhiMWIwNCJ9.0YYA3n_B_jwU47qFETlIUOSAPPIguD5IArqKI5DVX_w',
            // },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('API response:', response.data); // ✅ See the structure

        const formatted = response.data.map(item => ({
          key: item.id,
          value: item.name,
        }));

        setMainCategories(formatted);
      } catch (error) {
        console.error('Failed to fetch business types:', error);
      }
    };

    fetchBusinessTypes();
  }, []);
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedMainCategory || !selectedMainCategory.key) return; // ✅ Corrected condition

      try {
        const accessToken = await AuthStorage.getAccessToken();
        const categoryId = selectedMainCategory.key; // ✅ Corrected ID access
        console.log('Fetching subcategories for category ID:', categoryId);

        const res = await axios.get(
          `http://52.70.194.52/api/core/categories/${categoryId}/subcategories/`,
          {
            // headers: {
            //   Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NzgxMTg0LCJpYXQiOjE3NDQxNzYzODQsImp0aSI6ImZkNDRmMDNlZjVkYzQ1MTc4ZGI4NjFkZDQ2MGUxMzY2IiwidXNlcl9pZCI6ImEzMWY3NzZlLWVmYWUtNGIyOS1hZDIzLTZjMDU4MDhiMWIwNCJ9.0YYA3n_B_jwU47qFETlIUOSAPPIguD5IArqKI5DVX_w',
            // },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Subcategory API response:', res.data);

        if (res?.data && Array.isArray(res.data)) {
          const formatted = res.data.map(item => ({
            key: item.id,
            value: item.name,
          }));
          setSubCategories(formatted);
        } else {
          console.warn('Subcategories data is not an array:', res.data);
          setSubCategories([]);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubCategories();
  }, [selectedMainCategory]);

  useEffect(() => {
    const fetchSubSubCategories = async () => {
      if (!selectedSubCategory || !selectedSubCategory.key) return;

      try {
        const accessToken = await AuthStorage.getAccessToken();
        const subCategoryId = selectedSubCategory.key;
        console.log(
          'Fetching sub-subcategories for subcategory ID:',
          subCategoryId,
        );

        const res = await axios.get(
          `http://52.70.194.52/api/core/categories/${subCategoryId}/subsubcategories/`,
          {
            // headers: {
            //   Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0NzgxMTg0LCJpYXQiOjE3NDQxNzYzODQsImp0aSI6ImZkNDRmMDNlZjVkYzQ1MTc4ZGI4NjFkZDQ2MGUxMzY2IiwidXNlcl9pZCI6ImEzMWY3NzZlLWVmYWUtNGIyOS1hZDIzLTZjMDU4MDhiMWIwNCJ9.0YYA3n_B_jwU47qFETlIUOSAPPIguD5IArqKI5DVX_w',
            // },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Sub-subcategory API response:', res.data);

        if (res?.data && Array.isArray(res.data)) {
          const formatted = res.data.map(item => ({
            key: item.id,
            value: item.name,
          }));
          setSubSubCategories(formatted);
        } else {
          console.warn('Sub-subcategories data is not an array:', res.data);
          setSubSubCategories([]);
        }
      } catch (error) {
        console.error('Error fetching sub-subcategories:', error);
      }
    };

    fetchSubSubCategories();
  }, [selectedSubCategory]);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (!selectedSubSubCategory || !selectedSubSubCategory.key) return;
  
      try {
        const accessToken = await AuthStorage.getAccessToken();
        const subSubCategoryId = selectedSubSubCategory.key;
        console.log('Fetching business info for sub-subcategory ID:', subSubCategoryId);
  
        const res = await axios.get(
          `http://52.70.194.52/api/core/business-info/by-sub-sub-category/${subSubCategoryId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        console.log('Business Info response:', res.data);
        // You can set the data to state if needed
        setBusinessInfoList(res.data.data);
  
      } catch (error) {
        console.error('Error fetching business info:', error);
      }
    };
  
    fetchBusinessInfo();
  }, [selectedSubSubCategory]);
      const handleFollowPress = (user) => {
        navigation.navigate('userProfile', {
          userType: user.user_type,
          userId: user.id,
        });
      };
      useEffect(() => {
  console.log('Current Selected Category:', selectedMainCategory);
}, [selectedMainCategory]);
  return (
     <SafeAreaView style={[styles.container,{ backgroundColor: theme.$background }]}>
      {step === 0 && <Header showBack={true} title="Main Categories" />}
      {step === 0 && (
        <>
          <FlatList
            data={mainCategories}
            keyExtractor={item => item.key.toString()}
            contentContainerStyle={{padding: 16}}
            renderItem={({item}) => (
              <ButtonWithPushBack
                // onPress={() => {
                //   setSelectedMainCategory(item);
                //   setStep(1);
                // }}>
// onPress={() => {
//   setSelectedMainCategory(null);
//   setBusinessInfoList(null)
//   setSelectedBusiness(null) // Clear previous selection
//   setTimeout(() => {
//     setSelectedMainCategory({...item}); // Create a new object to ensure state update
//     if (item.value === 'Gym') {
//       setStep(3);
//     } else {
//       setStep(1);
//     }
//   }, 50); // Small delay allows state updates before navigation
// }}
onPress={async () => {
  setSelectedMainCategory(null);
  setBusinessInfoList([]);
  setSelectedBusiness(null);

  setTimeout(async () => {
    const selected = { ...item };
    setSelectedMainCategory(selected);

    if (selected.value === 'Gym') {
      try {
        const accessToken = await AuthStorage.getAccessToken();

        const response = await fetch(
          `http://52.70.194.52/api/core/business-info/by-main-category/${selected.key}/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch business info');
        }

        const result = await response.json();
        console.log('API Response:', result);

        // ✅ Yeh line fix hai:
        setBusinessInfoList(result.data); // extract the data array

        setStep(3); // Go to Slide 3
      } catch (error) {
        console.error('Error fetching business info:', error);
        Alert.alert('Error', 'Could not load business information.');
      }
    } else {
      setStep(1);
    }
  }, 50);
}}
>
                <Card
                  third
                  style={{
                    marginBottom: 10,
                    padding: 16,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text  h6 bold customColor="black">
                    {item.value}
                  </Text>
                </Card>
              </ButtonWithPushBack>
            )}
          />

          {/* <ButtonWithPushBack customContainerStyle={styles.buttonContainer}>
            <PrimaryButton
              title="Add"
              icon={<Icon name="plus" type="feather" size={15} color="white" />}
              onPress={() => setStep(1)}
            />
          </ButtonWithPushBack> */}
        </>
      )}
      {step === 1 && (
        <Slide index={1}>
          <Header
            showBack={true}
              title={selectedMainCategory?.value}
            customBackEvent={() => setStep(0)}
          />
          <FlatList
            data={subCategories}
            keyExtractor={item => item.key.toString()}
            contentContainerStyle={{padding: 16}}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedSubCategory(item); // Set selected subcategory
                  setStep(2); // Go to next step (optional)
                }}>
                <Card
                  third
                  style={{
                    marginBottom: 10,
                    padding: 16,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text h6 bold customColor="black">
                    {item.value}
                  </Text>
                </Card>
              </TouchableOpacity>
            )}
          />
        </Slide>
      )}
        {step === 2 && (
        <Slide index={2}>
          <Header
            showBack={true}
              title={selectedSubCategory?.value}
            customBackEvent={() => setStep(1)}
          />
          <FlatList
            data={subSubCategories}
            keyExtractor={item => item.key.toString()}
            contentContainerStyle={{padding: 16}}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedSubSubCategory(item); // Set selected subcategory
                  setStep(3); // Go to next step (optional)
                }}>
                <Card
                  third
                  style={{
                    marginBottom: 10,
                    padding: 16,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text h6 bold customColor="black">
                    {item.value}
                  </Text>
                </Card>
              </TouchableOpacity>
            )}
          />
        </Slide>
      )}
     {step === 3 && (
  <Slide index={3}>
    <Header
      showBack={true}
      title={selectedSubSubCategory?.value}
      // customBackEvent={() => setStep(2)}
customBackEvent={() => {
  console.log('Current Main Category:', selectedMainCategory?.value);
  if (selectedMainCategory?.value === 'Gym') {
    setStep(0);
  } else {
    setStep(2);
  }
}}
    />
    <FlatList
      data={businessInfoList}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      contentContainerStyle={{padding: 16}}
      renderItem={({item}) => (
   <ButtonWithPushBack onPress={() => {
  setSelectedBusiness(item); // Save the selected business
  setStep(4);                 // Move to Step 4
}}>
        <Card
          third
          style={{
            marginBottom: 10,
            padding: 16,
            borderRadius: 10,
            flexDirection: 'column',
          }}>
<View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
  }}
>
  {/* Avatar / Logo */}
  <Avatar
    size={wp('15%')}
    rounded
    activeOpacity={0.7}
    overlayContainerStyle={{
      backgroundColor: '#D9D9D9',
      borderColor: theme.$background,
      borderWidth: 1,
    }}
    source={item.business_logo ? { uri: item.business_logo } : undefined}
    title={
      !item.business_logo && item.business_type
        ? item.business_type.charAt(0).toUpperCase()
        : ''
    }
  />

  {/* Text info on right */}
  <View style={{ flex: 1, marginLeft: 16 }}>
    <Text h4 bold customColor="black">
      {item.business_type}
    </Text>
    <Text h5 semiBold customColor="black">
      {item.business_address}
    </Text>
    <Text h5 customColor="black">
  {item.business_about?.trim()
    ? item.business_about
    : 'No description available'}
</Text>
   
  </View>
</View>
  
   </Card>
   </ButtonWithPushBack>
      )}
      ListEmptyComponent={
        <Text style={{textAlign: 'center', marginTop: 20}}>
          No business info found for this category.
        </Text>
      }
    />
  </Slide>
)}
     {step === 4 && (
  <Slide index={4}>
    <Header
  showBack={true}
  title={selectedBusiness.
business_name
} 
      rightComponent={
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity onPress={() => navigation.navigate('uploadreels')}>
            <AntDesign name="plussquareo" size={23} color={theme.$lightText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Bell Icon Clicked!')}>
            <Icon name="bell" size={23}  color={theme.$lightText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Icon name="menu" size={23}  color={theme.$lightText}/>
          </TouchableOpacity>
        </View>
      }
    />
        <View style={{ marginTop: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
{selectedBusiness === null ? (
  <ActivityIndicator />
) : (
  <Avatar
    size={70}
    rounded
    overlayContainerStyle={{
      backgroundColor: theme.$surface,
      borderColor: theme.$secondaryText,
      borderWidth: 1,
    }}
    source={
        selectedBusiness?.business_logo
        ? { uri: selectedBusiness.business_logo }
        : require('../assets/icon/profiles.png')
    }
  />
)}
   <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
  <View style={{ alignItems: 'center', minWidth: '20%' }}>
    <Text h4 semiBold numberOfLines={1}>15</Text>
    <Text h5 semiBold numberOfLines={1}>Posts</Text>
  </View>
  <View style={{ alignItems: 'center', minWidth: '30%' }}>
    <Text h4 semiBold numberOfLines={1}>0</Text>
    <Text h5 semiBold numberOfLines={1}>Followers</Text>
  </View>
  <View style={{ alignItems: 'center', minWidth: '30%' }}>
    <Text h4 semiBold numberOfLines={1}>0</Text>
    <Text h5 semiBold numberOfLines={1}>Following</Text>
  </View>
</View>

</View>
<View style={{ paddingHorizontal:16}}>
{selectedBusiness && (
  <Text h5 bold>
    {selectedBusiness.business_name}
  </Text>
)}
</View>
<View style={{ flexDirection: 'row', gap: 10, justifyContent:"center",top:10 ,paddingHorizontal:16}}>
<ButtonWithPushBack customContainerStyle={{ flex: 1 }}>
  <PrimaryButton
    title="Follow"
    onPress={() => {
        setSelected('Follow');
      Alert.alert("coming soon");
    }}
    // customsBg={selected === 'edit' ? '#000' : '#D3D3D3'} // Black if selected
    // titleStyle={{
    //   color: selected === 'edit' ? '#fff' : '#333', // White text if selected
    // }}
       customsBg={selected === 'Follow' ? theme.$primary : 'transparent'}
    titleStyle={{
      color: selected === 'Follow' ? theme.$background : theme.$lightText, // text color based on selection
    }}
       buttonStyle={{
      borderWidth: 1,
      borderColor: theme.$lightText,
   
    }}
  />
</ButtonWithPushBack>

<ButtonWithPushBack customContainerStyle={{ flex:1 }}>
  <PrimaryButton
    title="Message"
    onPress={() => {
       setSelected('Message');
     Alert.alert("coming soon")
    }}
    // customsBg={selected === 'share' ? '#000' : '#D3D3D3'}
    // titleStyle={{
    //   color: selected === 'share' ? '#fff' : '#333',
    // }}
      customsBg={selected === 'Message' ? theme.$primary : 'transparent'}
    titleStyle={{
      color: selected === 'Message' ? theme.$background : theme.$lightText, // text color based on selection
    }}
       buttonStyle={{
      borderWidth: 1,
      borderColor: theme.$lightText,
   
    }}
  />
  </ButtonWithPushBack>
  {/* <ButtonWithPushBack customContainerStyle={{ flex:1 }}>
  <PrimaryButton
    title="Invite"
    onPress={() => {
         setSelected('Invite');
     Alert.alert("coming soon")
    }}
         customsBg={selected === 'Invite' ? theme.$primary : 'transparent'}
    titleStyle={{
      color: selected === 'Invite' ? theme.$onPrimary : theme.$lightText, // text color based on selection
    }}
       buttonStyle={{
      borderWidth: 1,
      borderColor: theme.$lightText,
   
    }}
  />
  </ButtonWithPushBack> */}
  <ButtonWithPushBack customContainerStyle={{ flex: 1 }}>
  <PrimaryButton
    title={selectedMainCategory?.value === 'Gym' ? 'Membership' : 'Invite'}
    onPress={() => {
      const action = selectedMainCategory?.value === 'Gym' ? 'Membership' : 'Invite';
      setSelected(action);
      Alert.alert('Coming soon');
    }}
    customsBg={
      selected === (selectedMainCategory?.value === 'Gym' ? 'Membership' : 'Invite')
        ? theme.$primary
        : 'transparent'
    }
    titleStyle={{
      color:
        selected === (selectedMainCategory?.value === 'Gym' ? 'Membership' : 'Invite')
          ? theme.$background
          : theme.$lightText,
    }}
    buttonStyle={{
      borderWidth: 1,
      borderColor: theme.$lightText,
    }}
  />
</ButtonWithPushBack>


  </View>
    <View style={{marginTop:15,flex:1}}>
<CustomGrid images={images} />
</View>
  </Slide>
)}


    </SafeAreaView>
  );
};

export default NearByScreen;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
   paddingHorizontal:16
  },
});
