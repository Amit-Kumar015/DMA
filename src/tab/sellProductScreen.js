import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../component/header';
import useTheme from '../hooks/useTheme';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import PrimaryButton from '../component/prButton';
import ButtonWithPushBack from '../component/Button';
import TextInputEml from '../component/textInput';
 import axios from 'axios';
import AuthStorage from '../utils/authStorage';
const { width } = Dimensions.get('window');

const SellProductScreen = () => {
  const { theme } = useTheme();
  const [images, setImages] = useState([]);

  // Input states
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [mrp, setMrp] = useState('');
  const [discount, setDiscount] = useState('');
  const [salesPrice, setSalesPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productSubCategory, setProductSubCategory] = useState('');

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const camera = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        let storage = true;

        if (Platform.Version >= 33) {
          const image = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
          const video = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
          );
          storage =
            image === PermissionsAndroid.RESULTS.GRANTED &&
            video === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          storage =
            (await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            )) === PermissionsAndroid.RESULTS.GRANTED;
        }

        return camera === PermissionsAndroid.RESULTS.GRANTED && storage;
      } catch (err) {
        Alert.alert('Permission Error', 'Something went wrong with permissions.');
        return false;
      }
    }
    return true;
  };
 

// const handleVerify = async () => {
//   if (!productName || !description || !mrp || !productCategory) {
//     Alert.alert('Validation Error', 'Please fill all required fields.');
//     return;
//   }

//   const formData = new FormData();
//   formData.append('category', productCategory);
//   formData.append('sub_category', productSubCategory);
//   formData.append('name', productName);
//   formData.append('description', description);
//   formData.append('actual_price', mrp);
//   formData.append('discount_percent', discount);
//   formData.append('is_stock', 'true');

//   // Append images
//   images.forEach((uri, index) => {
//     const filename = uri.split('/').pop();
//     const match = /\.(\w+)$/.exec(filename ?? '');
//     const type = match ? `image/${match[1]}` : `image`;

//     formData.append('images', {
//       uri,
//       name: filename,
//       type,
//     });
//   });
// console.log("form",formData)
//   try {
//      const accessToken = await AuthStorage.getAccessToken();
//     const response = await axios.post(
//       'http://52.70.194.52/api/brand/product/',
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//            Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     Alert.alert('Success', 'Product created successfully!');
//     console.log('Response:', response.data);
//   } catch (error) {
//     console.error('Upload error:', error.response?.data || error.message);
//     Alert.alert('Upload Failed', 'Something went wrong while uploading product.');
//   }
// };

const handleVerify = async () => {
  if (!productName || !description || !mrp || !productCategory) {
    Alert.alert('Validation Error', 'Please fill all required fields.');
    return;
  }

  const formData = new FormData();
  formData.append('category', productCategory);
  formData.append('sub_category', productSubCategory);
  formData.append('name', productName);
  formData.append('description', description);
  formData.append('actual_price', mrp);
  formData.append('discount_percent', discount);
  formData.append('is_stock', 'true');

  // Append images
  images.forEach((uri, index) => {
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename ?? '');
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('images', {
      uri,
      name: filename,
      type,
    });
  });

  try {
    const accessToken = await AuthStorage.getAccessToken(); // replace this with your actual token fetch logic

    const response = await fetch('http://52.70.194.52/api/brand/product/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // ❗ DO NOT manually set `Content-Type` when using FormData in fetch — it will be set automatically with correct boundary
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      Alert.alert('Success', 'Product created successfully!');
      console.log('Response:', result);
    } else {
      console.error('Server error:', result);
      Alert.alert('Upload Failed', result.detail || 'Something went wrong.');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    Alert.alert('Upload Failed', 'Something went wrong while uploading product.');
  }
};

  const handleCamera = async () => {
    const granted = await requestPermissions();
    if (!granted || images.length >= 5) return;

    launchCamera({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.[0]) {
        const asset = response.assets[0];
        setImages(prev => [...prev, asset.uri || '']);
      }
    });
  };

  const handleGallery = () => {
    if (images.length >= 5) return;

    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 5 - images.length,
      },
      response => {
        if (!response.didCancel && !response.errorCode && response.assets?.length) {
          const selectedUris = response.assets.map(asset => asset.uri || '');
          setImages(prev => [...prev, ...selectedUris].slice(0, 5));
        }
      }
    );
  };

  const handleUploadOptions = () => {
    if (images.length >= 5) return;
    Alert.alert('Choose Upload Method', '', [
      { text: '📷 Camera', onPress: handleCamera },
      { text: '🖼️ Gallery', onPress: handleGallery },
      { text: '❌ Cancel', style: 'cancel' },
    ]);
  };

  const removeImage = index => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  // const handleVerify = () => {
  //   // You can send form data from here
  //   console.log({
  //     productName,
  //     description,
  //     mrp,
  //     discount,
  //     salesPrice,
  //     productCategory,
  //     productSubCategory,
  //     images,
  //   });
  // };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$background }]}>
      <Header showBack={true} title="Product" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 5 && (
              <TouchableOpacity
                onPress={handleUploadOptions}
                style={styles.addImageCard}
              >
                <Text style={styles.plusIcon}>＋</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Input fields */}
          <View style={styles.formContainer}>
            <TextInputEml
              style={styles.input}
              placeholder="Product Name"
              value={productName}
              onChangeText={setProductName}
              placeholderTextColor="#999"
            />
            <TextInputEml
               style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#999"
              multiline
            />
            <TextInputEml
              style={styles.input}
              placeholder="MRP"
              value={mrp}
              onChangeText={setMrp}
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <TextInputEml
              style={styles.input}
              placeholder="Discount %"
              value={discount}
              onChangeText={setDiscount}
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <TextInputEml
              style={styles.input}
              placeholder="Sales Price"
              value={salesPrice}
              onChangeText={setSalesPrice}
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            <TextInputEml
              style={styles.input}
              placeholder="Product Category"
              value={productCategory}
              onChangeText={setProductCategory}
              placeholderTextColor="#999"
            />
            <TextInputEml
              style={styles.input}
              placeholder="Product Sub-Category"
              value={productSubCategory}
              onChangeText={setProductSubCategory}
              placeholderTextColor="#999"
            />
          </View>

          <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton
              title="Create Product"
              onPress={handleVerify}
              loadingProps={{ color: '#fff' }}
            />
          </ButtonWithPushBack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SellProductScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  buttonContainers: {
    marginVertical: 50,
    width: '50%',
    alignSelf: 'center',
  },
  scrollContainer: {
    paddingVertical: 16,
    paddingRight: 16,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal:16
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    elevation: 3,
  },
  removeText: {
    fontSize: 14,
    color: 'red',
    paddingHorizontal: 4,
  },
  addImageCard: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  plusIcon: {
    fontSize: 40,
    color: '#666',
  },
  formContainer: {
  marginTop: 16,
  paddingHorizontal: 4,
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  fontSize: 16,
  backgroundColor: '#fff',
},

});

