import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {Avatar, CheckBox, Icon} from 'react-native-elements';
import {inputMinHeight} from '../utils/theme';
import Button from '../component/Button';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import useTheme from '../hooks/useTheme';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TOP_SPACE_ANDROID,
} from '../utils/dimensions';
import TextInputEml from '../component/textInput';
import {color} from 'react-native-elements/dist/helpers';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import axios from 'axios';
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native';
import {login} from '../network/action';
import AuthStorage from '../utils/authStorage';
import {useDispatch} from 'react-redux';
import {setUserData} from '../slices/userSlice';
import Text from '../component/Text';
import {showMessage} from '../utils/messages/message';
import AuthStack from '../navigation/AuthStack/authStack';
import Appstack from '../navigation/AppStack/appStack';
import {
  setBusinessProfile,
  setData,
  setPersonalProfile,
} from '../slices/authSlice';

export default function Login() {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  // const [emailOrPhone, setEmailOrPhone] = useState('');
  // const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const [emailOrPhone, setEmailOrPhone] = useState(route.params?.email || '');
  const [password, setPassword] = useState(route.params?.password || '');

  // const validateEmailOrPhone = text => {
  //   setEmailOrPhone(text);
  //   setError(''); // Jaise hi user type kare, error hata do
  // };

  const inputRef = useRef(null);

  const validateEmailOrPhone = text => {
    setEmailOrPhone(text);
    setError('');

    // Focus input if there's an error
    if (!text) {
      inputRef.current?.focus();
    }
  };
  useEffect(() => {
    if (route.params?.email) {
      setEmailOrPhone(route.params.email);
    }
    if (route.params?.password) {
      setPassword(route.params.password);
    }
  }, [route.params]);

  const handleLogin = async () => {
    setError('');

    if (!emailOrPhone || !password) {
      setError('Email/Phone and Password are required');
      return;
    }

    try {
      const response = await login({username: emailOrPhone, password});

      if (response?.user && response?.access) {
        // Store tokens
        await AuthStorage.saveTokens(response?.access, response?.refresh);

        // Save user & token in Redux
        dispatch(
          setUserData({
            user: response?.user,
            authtoken: response?.access,
          }),
        );
        dispatch(setData(response?.user));

        // ✅ Fetch personal & business profiles after login

        showMessage({
          message: 'Login successful!',
          type: 'success',
          theme: theme,
          duration: 3000,
        });

        // Navigation
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: "HomeScreen" }],
        // });
      } else {
        setError(response?.data?.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      if (err.response) {
        setError(
          err.response.data?.message || 'Invalid email/phone or password.',
        );
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {...(Platform.OS === 'android' && TOP_SPACE_ANDROID)},
      ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{flex: 1}}>
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <Image
              source={require('../assets/icon/login.jpg')}
              style={styles.image}
            />
          </View>
          <View style={styles.content}>
            <View style={styles.inputGroup}>
              <TextInputEml
                ref={inputRef}
                label="Email or Phone"
                placeholder="Email or Phone"
                value={emailOrPhone}
                onChangeText={validateEmailOrPhone}
              />
              {error ? (
                <Text h5 style={{color: theme.$danger}}>
                  {error}
                </Text>
              ) : null}
            </View>
            <View style={styles.inputGroup}>
              <TextInputEml
                ref={inputRef}
                label="Password"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
                rightIcon={secureText ? 'eye-slash' : 'eye'}
                onRightIconPress={() => setSecureText(!secureText)}
              />
            </View>
            <View style={styles.rememberForgot}>
              <CheckBox
                checked={rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
                containerStyle={styles.checkbox}
              />
              <Text
                h5
                style={[styles.rememberForgotText, {color: theme.$lightText}]}>
                Remember
              </Text>
              <TouchableOpacity>
                <Text h5 style={{color: theme.$lightText}}>
                  Forgot password
                </Text>
              </TouchableOpacity>
            </View>
            <ButtonWithPushBack
              customContainerStyle={{marginVertical: hp('4%')}}>
              <PrimaryButton title="Login" onPress={handleLogin} />
            </ButtonWithPushBack>
          </View>
          <View style={styles.signupLink}>
            <Text h5 semiBold>
              Don't have an account?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text h5 semiBold style={{top: 7}}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  image: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'),
  },
  content: {
    width: '100%',
    paddingHorizontal: wp('5%'),
  },
  inputGroup: {
    marginBottom: hp('1%'),
  },
  rememberForgot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  rememberForgotText: {
    right: wp('10%'),
  },
  signupLink: {
    position: 'absolute',
    bottom: hp('2.5%'),
    alignSelf: 'center',
  },
});
