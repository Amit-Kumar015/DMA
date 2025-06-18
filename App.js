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
import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthStorage from './src/utils/authStorage';
import store, { persistor } from './src/redux/store/store';
import { RootNavigator } from './src/navigation/rootNavigator';
import { AuthContext } from './src/utils/contextSlice/Context';
import SettingsProvider from './src/utils/settingProvider';
import NoInternetConnection from './src/component/NoInternet';
import { themes } from './src/utils/theme';
import messaging from '@react-native-firebase/messaging';
import notifee,{AndroidColor, AndroidImportance} from '@notifee/react-native';
import firebase,{ createNotificationChannel, requestUserPermission } from './src/utils/FireBaseService';
import FlashMessage from 'react-native-flash-message';
export const navigationRef = React.createRef();

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const theme = isDarkTheme ? themes.dark : themes.light;
 const [visible, setVisible] = useState(false);
  const themeContext = useMemo(() => ({
    toggleTheme: () => {
      setIsDarkTheme((prevTheme) => !prevTheme);
    },
  }), []);

  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  //     ).catch(err => console.log(err));
  //   }
  // }, []);

  const authContext = useMemo(() => ({
    signIn: async (foundUser) => {
      try {
        await AuthStorage.saveTokens(foundUser?.access, foundUser?.refresh);
      } catch (e) {
        console.log(e);
      }
    },
    signOut: async () => {
      try {
        await AuthStorage.removeTokens();
      } catch (e) {
        console.log(e);
      }
    },
  }), []);
const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

 


 

//   useEffect(() => {
//       // createNotificationChannel();
//     requestUserPermission();  
  
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('Foreground message:', remoteMessage);
  
//       await notifee.displayNotification({
//         title: remoteMessage.notification?.title || 'Notification',
//         body: remoteMessage.notification?.body || 'You got a message',
//         android: {
//           channelId: 'default',
//           // smallIcon: 'ic_launcher',
//             smallIcon: 'ic_notification', 
            
//         },
//       });
//     });

//     return unsubscribe;
//  }, []);
useEffect(() => {
  const init = async () => {
    await requestUserPermission();
 await notifee.requestPermission();
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'Notification',
        body: remoteMessage.notification?.body || 'You got a message',
        android: {
          channelId: 'default',
         smallIcon: 'ic_notification'// 👈 fallback icon
        },
      });
    });
  };

  init();
}, []);

// useEffect(() => {
//     const setupFCM = async () => {
//       await createNotificationChannel();
//       await requestUserPermission();
//  console.log(requestUserPermission, 'requestUserPermission');
//       const unsubscribe = messaging().onMessage(async remoteMessage => {
       

//         const title =
//           remoteMessage.notification?.title || remoteMessage.data?.title || 'Notification';
//         const body =
//           remoteMessage.notification?.body || remoteMessage.data?.body || 'You got a message';

//         await notifee.displayNotification({
//           title,
//           body,
//           android: {
//             channelId: 'default',
//             smallIcon: 'ic_notification', // ensure this icon exists in res/drawable
//           },
//         });
//       });

//       return unsubscribe;
//     };

//     setupFCM();
//   }, []);
  return (
    //{...authcontext, ...themeContext, theme}
    <AuthContext.Provider value={authContext}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer ref={navigationRef}>
              <SettingsProvider>
                <NoInternetConnection>
                  <RootNavigator />
                </NoInternetConnection>
                <FlashMessage position="top" />
              </SettingsProvider>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </AuthContext.Provider>
  );
};

export default App;
