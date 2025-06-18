import {
  Alert,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../component/header';
import useTheme from '../hooks/useTheme';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextInputEml from '../component/textInput';
import Text from '../component/Text';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import SingleSelect from '../component/singleSelect';

const VerifyScreen = () => {
  const { theme } = useTheme();

  const idOptions = [
    { key: 'aadhaar', value: 'Aadhaar' },
    { key: 'pan', value: 'PAN' },
    { key: 'voterid', value: 'Voter ID' },
    { key: 'passport', value: 'Passport' },
    { key: 'drivinglicence', value: 'Driving Licence' },
  ];

  const idValidationPatterns = {
    aadhaar: /^\d{4}\s?\d{4}\s?\d{4}$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    voterid: /^[A-Z]{3}[0-9]{7}$/,
    drivinglicence: /^[A-Z]{2}[0-9]{2}[0-9]{11}$/,
    passport: /^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$/,
  };

  const idFormatHints = {
    aadhaar: 'XXXX XXXX XXXX',
    pan: 'ABCDE1234F',
    voterid: 'ABC1234567',
    drivinglicence: 'MH12YYYYYYYYY',
    passport: 'A1234567',
  };

  const patterns = {
    gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
  };

  const [selectedIdType, setSelectedIdType] = useState(null);
  const [documents, setDocuments] = useState({
    gst: { image: null, number: '' },
    idproof: { image: null, number: '' },
  });

  const [errors, setErrors] = useState({ gst: '', idproof: '' });
  const [verificationStatus, setVerificationStatus] = useState(null); // null | 'pending' | 'success'
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const camera = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        let storage = true;

        if (Platform.Version >= 33) {
          const image = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
          const video = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO);
          storage = image === PermissionsAndroid.RESULTS.GRANTED && video === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          storage =
            (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)) ===
            PermissionsAndroid.RESULTS.GRANTED;
        }

        return camera === PermissionsAndroid.RESULTS.GRANTED && storage;
      } catch (err) {
        Alert.alert('Permission Error', 'Something went wrong with permissions.');
        return false;
      }
    }
    return true;
  };

  const handleCamera = async key => {
    const granted = await requestPermissions();
    if (!granted) return;

    launchCamera({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.[0]) {
        const asset = response.assets[0];
        setDocuments(prev => ({
          ...prev,
          [key]: { ...prev[key], image: asset.uri },
        }));
        setVerificationStatus(null); // reset on image change
      }
    });
  };

  const handleGallery = key => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.[0]) {
        const asset = response.assets[0];
        setDocuments(prev => ({
          ...prev,
          [key]: { ...prev[key], image: asset.uri },
        }));
        setVerificationStatus(null); // reset on image change
      }
    });
  };

  const handleUploadOptions = key => {
    Alert.alert('Choose Upload Method', '', [
      { text: '📷 Camera', onPress: () => handleCamera(key) },
      { text: '🖼️ Gallery', onPress: () => handleGallery(key) },
      { text: '❌ Cancel', style: 'cancel' },
    ]);
  };

  const handleInputChange = (key, value) => {
    setDocuments(prev => ({
      ...prev,
      [key]: { ...prev[key], number: value },
    }));
    setVerificationStatus(null); // reset on number change

    if (key === 'gst') {
      const isValid = patterns.gst.test(value.trim());
      setErrors(prev => ({
        ...prev,
        gst: isValid || value === '' ? '' : 'Invalid GST format',
      }));
    }

    if (key === 'idproof' && selectedIdType) {
      const isValid = idValidationPatterns[selectedIdType]?.test(value.trim());
      setErrors(prev => ({
        ...prev,
        idproof: isValid || value === '' ? '' : `Invalid ${selectedIdType.toUpperCase()} format`,
      }));
    }
  };

  const renderUploadSection = (label, key) => (
    <View style={styles.cards} key={key}>
      <TouchableOpacity onPress={() => handleUploadOptions(key)} style={styles.imagePlaceholder}>
        {documents[key].image ? (
          documents[key].image.endsWith('.pdf') ? (
            <Text h5>📄 PDF Uploaded</Text>
          ) : (
            <Image source={{ uri: documents[key].image }} style={styles.media} />
          )
        ) : (
          <Text style={styles.uploadText}>Upload {label} Image</Text>
        )}
      </TouchableOpacity>
      <TextInputEml
        placeholder={
          key === 'idproof' && selectedIdType && idFormatHints[selectedIdType]
            ? `Enter ${label} Number (${idFormatHints[selectedIdType]})`
            : `Enter ${label} Number`
        }
        value={documents[key].number}
        onChangeText={text => handleInputChange(key, text)}
        style={styles.input}
        placeholderTextColor="#999"
      />
      {key === 'idproof' && selectedIdType && idFormatHints[selectedIdType] && (
        <Text style={styles.formatHint}>Format: {idFormatHints[selectedIdType]}</Text>
      )}
      {errors[key] ? <Text style={styles.errorText}>{errors[key]}</Text> : null}
    </View>
  );

  const handleVerify = () => {
    if (verificationStatus === 'pending') {
      Alert.alert('Wait', 'You have to wait until your documents get verified.');
      return;
    }

    if (verificationStatus === 'success') {
      Alert.alert('Already Verified', 'You have already completed the verification.');
      return;
    }

    const isGSTValid =
      documents.gst.number.trim() &&
      documents.gst.image &&
      !errors.gst;

    const isIDValid =
      selectedIdType &&
      documents.idproof.number.trim() &&
      documents.idproof.image &&
      !errors.idproof;

    if (!isGSTValid || !isIDValid) {
      Alert.alert('Error', 'Please upload valid GST and ID proof images and enter valid numbers.');
      return;
    }

    setIsLoading(true);
    setVerificationStatus('pending');

    setTimeout(() => {
      setIsLoading(false);
      setVerificationStatus('success');
      Alert.alert('Success', 'Documents verified successfully!');
    }, 3000);
  };

  const handleIdProofSelect = (uniqueId, selectedOption) => {
    setSelectedIdType(selectedOption.key);
    setVerificationStatus(null); // reset on id type change
  };
useEffect(() => {
  console.log('Verification status:', verificationStatus);
}, [verificationStatus]);
  const selectedIdLabel = idOptions.find(opt => opt.key === selectedIdType)?.value || '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$background }]}>
      <Header showBack={true} title="Verified" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cardWrappers}>
            <SingleSelect
              arrayData={idOptions}
              selected={selectedIdType}
              selectedCb={handleIdProofSelect}
              uniqueId="key"
              placeholder="Select ID Proof"
            />

            {renderUploadSection('GST', 'gst')}
            {selectedIdType && renderUploadSection(selectedIdLabel, 'idproof')}
            {isLoading && (
              <Text style={{ textAlign: 'center', color: 'blue', marginTop: 10 }}>
                🔄 Verifying, please wait...
              </Text>
            )}
          </View>
        </ScrollView>
     <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
  <PrimaryButton
    title="Verify"
    onPress={handleVerify}
    loading={isLoading}
    loadingProps={{ color: '#fff' }}
    disabled={isLoading}
  />
</ButtonWithPushBack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  buttonContainers: {
    marginVertical: 30,
    width: '50%',
    alignSelf: 'center',
  },
  scrollContainer: {
    padding: 16,
  },
  cardWrappers: {
    gap: 15,
  },
  cards: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadText: {
    color: '#666',
    textAlign: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    color: '#000',
  },
  formatHint: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});
