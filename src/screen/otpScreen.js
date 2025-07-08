import React, {useState} from 'react';
import {
  View,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import OTPTextView from '../component/otpInput';
import PrimaryButton from '../component/prButton';
import Text from '../component/Text';
import useTheme from '../hooks/useTheme';
import ActivityIndicator from '../assets/activityIndicator';
import {SCREEN_HEIGHT, TOP_SPACE_ANDROID} from '../utils/dimensions';
import ButtonWithPushBack from '../component/Button';
import AuthStorage from '../utils/authStorage';
import analytics from '@react-native-firebase/analytics';

const CORRECT_OTP = '123456';

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const [btnLoadingState, setBtnLoadingState] = useState(false);
  const {theme} = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  // const {email, password, mobile_number, username, user_type} = route.params;

  const handleOTPChange = enteredOtp => {
    setOtp(enteredOtp);
  };

const handleVerify = async () => {
  if (otp.length !== 6) {
    Alert.alert('Error', 'Please enter a 6-digit OTP');
    return;
  }

  setBtnLoadingState(true);

  console.log('Entered OTP:', otp);
  console.log('Route Params:', route.params);

  const { email, password, mobile_number, username, user_type } = route.params || {};

  if (!email || !password || !mobile_number || !username || !user_type) {
    Alert.alert('Error', 'Missing required user details. Please try again.');
    console.log('Missing Params:', { email, password, mobile_number, username, user_type });
    setBtnLoadingState(false);
    return;
  }

  try {
    const response = await axios.post(
      'http://52.70.194.52/api/account/verify-otp/',
      {
        user_type,
        username,
        email,
        mobile_number,
        password,
        otp,
      }
    );

    console.log('API Response:', response);

    if (response?.data?.user && response?.data?.access) {
      await AuthStorage.saveTokens(response.data.access, response.data.refresh);

      const userId = response.data.user.id;
      setBtnLoadingState(false);

      // ✅ Navigate only if tokens exist
      if (response.data.access && response.data.refresh) {

        // google analytics signup event
        if (user_type.toLowerCase() === 'personal') {
          try {
            console.log("response of api call: ", response);
            
            global.loginTime = Date.now();
            await analytics().setUserId(userId);

            await analytics().logEvent("signup", {
              method: "email_password",
              user_id: userId,
              username: username,
              signup_type: user_type
            })
            await analytics().setUserProperties({
            username: username,
            email: email,
            user_type: user_type,
          });
          } catch (error) {
            console.log("Analytics failed, but signup succeeded:", analyticsError);
          }
          navigation.navigate('createProfile', { userId });
        } else {
          try {
            global.loginTime = Date.now();
            await analytics().setUserId(userId);
            
            await analytics().logEvent("signup", {
              method: "email_password",
              user_id: userId,
              username: username,
              signup_type: user_type
            })
            await analytics().setUserProperties({
            username: username,
            email: email,
            user_type: user_type,
          });
          } catch (error) {
            console.log("Analytics failed, but login succeeded:", analyticsError);
          }
          navigation.navigate('BussinessProfile', { userId });
        }
      // if(response){
      //   navigation.navigate('createProfile', { userId });


      } else {
        Alert.alert('Error', 'Authentication failed. Please try again.');
      }
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    setBtnLoadingState(false);
    console.log('API Error:', error.response?.data || error.message);
    Alert.alert('Error', error.response?.data?.message || 'OTP verification failed. Please try again.');
  }
};


  return (
    <SafeAreaView
      style={[
        styles.container,
        Platform.OS === 'android' && TOP_SPACE_ANDROID,
      ]}>
      <View style={styles.header}>
        <Text h3 semiBold>
          Check your email
        </Text>
      </View>

      <View style={styles.otpContainer}>
        <OTPTextView
          inputCount={6}
          handleTextChange={handleOTPChange}
          tintColor="#FFFFFF"
          offTintColor="grey"
          autoFocus={true}
        />
      </View>

      <ButtonWithPushBack customContainerStyle={{marginVertical: 30}}>
        <PrimaryButton
          disabled={otp.length !== 6 || btnLoadingState}
          title="Verify email"
          onPress={handleVerify}
          loading={btnLoadingState}
          loadingProps={<ActivityIndicator />}
          style={{opacity: otp.length !== 6 || btnLoadingState ? 0.5 : 1}}
        />
      </ButtonWithPushBack>

      <View style={styles.resendContainer}>
        <Text h5 style={{color: theme.$surface}}>
          Didn't receive an email?{' '}
          <TouchableOpacity onPress={() => console.log('Resend OTP')}>
            <Text h5 semiBold style={{color: theme.$surface, top: 8}}>
              Click to resend
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
      <View style={styles.backToLogin}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text h4 bold textAliments="center">
            Back to log in
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  header: {
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: 'flex-end',
    paddingLeft: 10,
  },
  otpContainer: {
    height: SCREEN_HEIGHT * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendContainer: {
    alignItems: 'center',
    top: 5,
  },
  backToLogin: {
    height: SCREEN_HEIGHT * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
