// import messaging from '@react-native-firebase/messaging';

// export const requestUserPermission = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     const token = await messaging().getToken();
//     console.log('FCM Token:', token);
//     return token;
//   } else {
//     console.log('Notification permission not granted');
//   }
// };


// import messaging from '@react-native-firebase/messaging';
// import { generateUniqueId } from '.';

// export const requestUserPermission=async()=>{
// const authStatus=await messaging().requestPermission();
// const enabled=
// authStatus===messaging.AuthorizationStatus.AUTHORIZED||
// authStatus===messaging.AuthorizationStatus.PROVISIONAL;

// if(enabled){
// const token=await messaging().getToken();
// console.log('FCM Token:', token);

// const userID=generateUniqueId(); 
// await sendTokenToBackend(userID, token);




// // async function saveTokenToDatabase(token) {
  
// //    await firestore()
// //     .collection('users')
// //     .doc(userId)
// //     .update({
// //       tokens: firestore.FieldValue.arrayUnion(token),
// //     });
// // }

//   userID =  47;


// try {
//   const response = await axios.post('http://localhost:8000/api/save-fcm-token', {
//     userId: userID,
//     fcmToken: token,
//   });
//   console.log('Token sent to server:', response.data);

// } catch (error) {
//   console.error('Error sending token to server:', error.message);
// }

// }
// else{
// console.log('Notification permission not granted');
// }
// }

 






// import messaging, { getMessaging } from "@react-native-firebase/messaging";
// import axios from "axios";


// export const requestUserPermission = async () => {
//   const messaging = getMessaging();  
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     const fcmToken = await messaging().getToken();
//     console.log(" FCM Token:", fcmToken);

//     // try {
//     //   await axios.post("http://localhost:8000/api/save-fcm-token", {
//     //     userId,
//     //     fcmToken,
//     //   });
//     //   console.log(" Token sent");
//     // } catch (error) {
//     //   console.error("Token send failed:", error.message);
//     // }

//     return fcmToken;
//   } else {
//     console.log("Notification permission not granted");
//   }
// };



// import messaging from '@react-native-firebase/messaging';

// export const requestUserPermission = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     const fcmToken = await messaging().getToken();
//     console.log('FCM Token:', fcmToken);

//     const userId = 303;

//     try {
//       const response = await fetch('', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({      
//           userId: userId,
//           fcmToken: fcmToken,
//         }),
//       });

//       const data = await response.json();
//       console.log('Token sent to server:', data);
//       return data;

//     } catch (error) {
//       console.error('Error sending token to server:', error.message);
//     }
//   }  
// };
import messaging from '@react-native-firebase/messaging';
import AuthStorage from './authStorage';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);

    try {
      const accessToken = await AuthStorage.getAccessToken();
      //  console.log("token",accessToken)
      const response = await fetch('http://52.70.194.52/api/account/save-fcm-token/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fcm_token: fcmToken, // Make sure key name matches backend expectations
        }),
      });

      const data = await response.json();
      console.log('Token sent to server:', data);
      return data;

    } catch (error) {
      console.error('Error sending token to server:', error.message);
    }
  }
};

// firebaseService.ts
// import messaging from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance } from '@notifee/react-native';
// import AuthStorage from './authStorage';

// export const createNotificationChannel = async () => {
//   await notifee.createChannel({
//     id: 'default',
//     name: 'Default Channel',
//     importance: AndroidImportance.HIGH,
//   });
// };

// export const requestUserPermission = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     const fcmToken = await messaging().getToken();
//     console.log('FCM Token:', fcmToken);

//     try {
//       const accessToken = await AuthStorage.getAccessToken();
//       const response = await fetch('http://52.70.194.52/api/account/save-fcm-token/', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ fcm_token: fcmToken }),
//       });

//       const data = await response.json();
//       console.log('Token sent to server:', data);
//       return data;
//     } catch (error) {
//       console.error('Error sending token to server:', error.message);
//     }
//   }
// };
