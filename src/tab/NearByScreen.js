import {
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Avatar, useTheme} from 'react-native-elements';
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

const NearByScreen = () => {
  const [step, setStep] = useState(0);
  const {theme} = useTheme();
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('');
  const [businessInfoList, setBusinessInfoList] = useState([]);

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
  
  return (
    <View style={styles.container}>
      {step === 0 && <Header showBack={true} />}
      {step === 0 && (
        <>
          <FlatList
            data={mainCategories}
            keyExtractor={item => item.key.toString()}
            contentContainerStyle={{padding: 16}}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedMainCategory(item);
                  setStep(1);
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
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    {item.value}
                  </Text>
                </Card>
              </TouchableOpacity>
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
            // title="Attendence Logs"
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
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
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
            // title="Attendence Logs"
            customBackEvent={() => setStep(0)}
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
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
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
      title={selectedSubSubCategory.value}
      customBackEvent={() => setStep(2)}
    />
    <FlatList
      data={businessInfoList}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      contentContainerStyle={{padding: 16}}
      renderItem={({item}) => (
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
      borderColor: theme.$secondaryText,
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
    <Text h4 bold>
      {item.business_type}
    </Text>
    <Text h5 semiBold>
      {item.business_address}
    </Text>
    <Text h5>
  {item.business_about?.trim()
    ? item.business_about
    : 'No description available'}
</Text>
   
  </View>
</View>
  
   </Card>
      )}
      ListEmptyComponent={
        <Text style={{textAlign: 'center', marginTop: 20}}>
          No business info found for this category.
        </Text>
      }
    />
  </Slide>
)}


    </View>
  );
};

export default NearByScreen;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    // backgroundColor: '#ffffff',
    padding: hp('2%'),
  },
});
