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
import { showMessage } from '../utils/messages/message';
import AuthStack from '../navigation/AuthStack/authStack';
import Appstack from '../navigation/AppStack/appStack';
import { setData } from '../slices/authSlice';

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

  // const handleLogin = () => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const phoneRegex = /^[0-9]{10,}$/;

  //   if (!emailOrPhone) {
  //     setError('Please enter a valid email or phone number');
  //     return;
  //   }

  //   if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
  //     setError('Enter a valid email or phone number');
  //     return;
  //   }

  //   console.log('Email/Phone:', emailOrPhone);
  //   console.log('Password:', password);
  // };

  // const handleLogin = () => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits allowed

  //   if (!emailOrPhone) {
  //     setError('Please enter a valid email or phone number');
  //     return;
  //   }

  //   if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
  //     setError('Enter a valid email or phone number');
  //     return;
  //   }

  //   console.log('Email/Phone:', emailOrPhone);
  //   console.log('Password:', password);
  // };

  // const handleLogin = async () => {
  //   setError(''); // Reset error before making request

  //   if (!emailOrPhone || !password) {
  //     setError('Email/Phone and Password are required');
  //     return;
  //   }

  //   try {
  //     console.log('Sending login request with:', { username: emailOrPhone, password });

  //     const response = await axios.post('http://52.70.194.52/api/account/login/', {
  //       username: emailOrPhone,
  //       password: password,
  //     });

  //     console.log('Full Response:', response);

  //     if (response.status === 200) {
  //       console.log('Login Successful:', response.data);
  //       navigation.navigate('createProfile');
  //     } else {
  //       console.log('Login Failed:', response.data);
  //       setError(response.data.message || 'Invalid credentials.');
  //     }
  //   } catch (error) {
  //     console.log('Login Error:', error);

  //     if (error.response) {
  //       console.log('Error Response:', error.response);
  //       setError(error.response.data?.message || 'Invalid email/phone or password.');
  //     } else if (error.request) {
  //       console.log('No response received from server:', error.request);
  //       setError('Network error. Please check your connection.');
  //     } else {
  //       console.log('Error during request setup:', error.message);
  //       setError('Something went wrong. Please try again.');
  //     }
  //   }
  // };
  const handleLogin = async () => {
    setError('');
  
    if (!emailOrPhone || !password) {
      setError('Email/Phone and Password are required');
      return;
    }
  
    try {
      const response = await login({ username: emailOrPhone, password });
  
      if (response?.user && response?.access) {
        await AuthStorage.saveTokens(response?.access, response?.refresh);
  
        console.log("🔥 Dispatching user data:", response?.user);  // ✅ Debug user data
        console.log("🔥 Dispatching token:", response?.access);  // ✅ Debug token
  
        dispatch(setUserData({
          user: response?.user,
          authtoken: response?.access,  // ✅ Token Redux me save karna zaroori hai
        }));
        dispatch(setData(data.user)); 
        showMessage({
          message: 'Login successful!',
          type: 'success',
          theme: theme, 
          duration: 3000
        });
  
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: "BottomTab" }],
        // });
        // navigation.navigate("HomeScreen")
  
      } else {
        setError(response?.data?.message || 'Invalid credentials.');
      }
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.message || 'Invalid email/phone or password.',
        );
      } else {
        setError('Network err. Please check your connection.');
      }
    }
  };
  
  

  return (
    <SafeAreaView
    style={[
      styles.container,
      {...(Platform.OS === 'android' && TOP_SPACE_ANDROID)},
    ]}
  >
        <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
              style={{flex: 1}}>
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Image source={require("../assets/icon/profiles.png")} style={styles.image} />
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
            <Text h5 style={{color: theme.$danger}}>{error}</Text>
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
          <Text h5 style={[styles.rememberForgotText, {color: theme.$lightText}]}>
            Remember
          </Text>
          <TouchableOpacity>
            <Text h5 style={{color: theme.$lightText}}>Forgot password</Text>
          </TouchableOpacity>
        </View>
        <ButtonWithPushBack customContainerStyle={{marginVertical: 30}}>
          <PrimaryButton title="Login" onPress={handleLogin} />
        </ButtonWithPushBack>
      </View>
      <View style={styles.signupLink}>
        <Text h5 semiBold>
          Don't have an account?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text h5 semiBold style={{top: 7}}>Sign Up</Text>
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
  },
  wrapper: {
    flex: 1, 
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  header: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  content: {
    width: '100%', // Full width for form
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 1,
  },
  rememberForgot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  rememberForgotText: {
    right: 50,
  },
  signupLink: {
    position: 'absolute',
    bottom: 20, // Adjust spacing from bottom
    alignSelf: 'center',
  },
});
