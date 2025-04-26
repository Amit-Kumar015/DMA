// import React from 'react';
// import {SafeAreaView} from 'react-native';
// import {Provider} from 'react-redux';
// import store from './src/store/store';
// import {NavigationContainer} from '@react-navigation/native';
// import AuthStack from './src/navigation/AuthStack/authStack';
// import SettingsProvider from './src/utils/settingProvider';
// import FlashMessage from 'react-native-flash-message';
// import Appstack from './src/navigation/AppStack/appStack';

// const App = () => {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <SafeAreaView style={{flex: 1}}>
//           <SettingsProvider>
//             <AuthStack />
//             {/* <Appstack/> */}
//             <FlashMessage position="top" />
//           </SettingsProvider>
//         </SafeAreaView>
//       </NavigationContainer>
//     </Provider>
//   );
// };

// export default App;
import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StatusBar,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import AuthStorage from './src/utils/authStorage';
import store, { persistor } from './src/redux/store/store';
import { RootNavigator } from './src/navigation/rootNavigator';
import { AuthContext } from './src/utils/contextSlice/Context';
import FlashMessage from 'react-native-flash-message';
import SettingsProvider from './src/utils/settingProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthStack from './src/navigation/AuthStack/authStack';
import { Appstack } from './src/navigation';
import { PersistGate } from 'redux-persist/integration/react';
import NoInternetConnection from './src/component/NoInternet';
export const navigationRef = React.createRef();

 
const App = () => {
  const initialLoginState  = {
    isLoading: true,
    userName: null,
    userToken: null,
  };
 
  const [visible, setVisible] = useState(false);
 
  // const netInfo = useNetInfo();
 
  useEffect(() => {
    setVisible(true);
    // askForPermission();
    // console.log(netInfo?.isConnected, '===============netInfo?.isConnected');
  //   setTimeout(() => {
  //     if (netInfo?.isConnected) {
  //       setVisible(false);
  //     }
  //   }, 1000);
  // }, [netInfo?.isConnected]);
},[])
 
  // const askForPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //       );
  //       console.log('=====askForPermission called');
  //     } catch (error) {
  //       console.log(error, '==func error');
  //     }
  //   }
  // };
 
  // const loginReducer = (prevState: any, action: any) => {
  //   switch (action.type) {
  //     case 'RETRIEVE_TOKEN':
  //       return {
  //         ...prevState,
  //         userToken: action.token,
  //         isLoading: false,
  //       };
  //     case 'LOGIN':
  //       return {
  //         ...prevState,
  //         userName: action.id,
  //         userToken: action.token,
  //         isLoading: false,
  //       };
  //     case 'LOGOUT':
  //       return {
  //         ...prevState,
  //         userName: null,
  //         userToken: null,
  //         isLoading: false,
  //       };
  //     case 'REGISTER':
  //       return {
  //         ...prevState,
  //         userName: action.id,
  //         userToken: action.token,
  //         isLoading: false,
  //       };
  //   }
  // };
 
  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser, authtoken) => {
        // const userToken = String(authtoken);
        const userData = JSON.stringify(foundUser);
        // console.log(userData[0].parentid)
 
        // console.log(userData, userToken, 'authtoken');
        try {
          // await AsyncStorage.setItem('newUser', String(false));
          // await AsyncStorage.saveTokens('userToken', userToken);
          await AuthStorage.saveTokens(foundUser?.access, foundUser?.refresh);
          // await Storage.storeObject('@user', userData);
        } catch (e) {
          //console.log(e);
        }
        // dispatch({
        //   type: 'LOGIN',
        //   id: 'userName',
        //   // token: userToken
        // });
      },
      signOut: async () => {
        // setUserToken(null);
        // setIsLoading(false);
        try {
          // await Storage.removeValue('@user');
          // await Storage.removeValue('@baseUrl');
          await AuthStorage.removeTokens()
        } catch (e) {
          console.log(e);
        }
        // dispatch({ type: 'LOGOUT' });
      },
    }),
    [],
  );
 
  // if (loginState.isLoading) {
  //   return (
  //     <ImageBackground
  //       style={{
  //         width: device_width,
  //         height: device_height,
  //         flex: 1,
  //         alignSelf: 'center',
  //       }}
  //       resizeMode="cover"
  //       source={require('./assets/0.png')}>
  //       <View
  //         style={{
  //           flex: 1,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           backgroundColor: '#fff',
  //         }}>
  //         <ActivityIndicator size={'large'} color={'#f1a722'} />
  //       </View>
  //     </ImageBackground>
  //   );
  // }
 
  // const store = ConfigureStore();
 
  return (
    <AuthContext.Provider value={authContext}>
      {/* {visible ? (
        // <NetInfo />
      ) : ( */}
          <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>

          <NavigationContainer>
            {/* <StatusBar
              barStyle={'light-content'}
              backgroundColor={primaryColor}
            /> */}
               <SettingsProvider>
               <NoInternetConnection>
            <RootNavigator />
            </NoInternetConnection>

            {/* <Appstack/> */}
            <FlashMessage position="top" />
            </SettingsProvider>
          </NavigationContainer>
          </PersistGate>
        </Provider>
        </GestureHandlerRootView>
      {/* )} */}
    </AuthContext.Provider>
  );
};
 
export default App;
