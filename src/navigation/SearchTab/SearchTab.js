import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {StatusBar} from 'react-native';


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SearchScreen from '../../tab/searchScreen';


const Stack = createStackNavigator();
function SearchTab() {

  //   console.log(Stack);
  //   const Clinicparams={isTodaysFlag : false, isbookingAppointment : false}
  return (
    <>
      <StatusBar backgroundColor={'#263d2d'} barStyle="light-content" />

      <Stack.Navigator
        screenOptions={({route, navigation}) => ({
          headerShown: false,
          headerStyle: {
            backgroundColor:"white",
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: '400',
            marginLeft: -20,
            fontFamily: 'Yaldevi-Regular',
          },
        })}
        initialRouteName={"SearchScreen"}>
        <Stack.Screen
          name={"SearchScreen"}
          component={SearchScreen}
          // initialParams={Clinicparams}
          options={({route, navigation}) => ({
            // route:{params:{isTodaysFlag :true, isbookingAppointment : false}},
            title: ('Serach'),
            //   {isTodaysFlag = true, isbookingAppointment = false}
            //   title: 'Clinics List',
            headerLeft: () => (
              <MaterialIcons.Button
                name="keyboard-arrow-left"
                size={30}
                backgroundColor={"white"}
                color={"black"}
                onPress={() => navigation.goBack()}
              />
            ),
          })}
        />
        {/* <Stack.Screen
          name={""}
          component={Equipt}
          // initialParams={Clinicparams}
          options={({route, navigation}) => ({
            // route:{params:{isTodaysFlag :true, isbookingAppointment : false}},
            title: ('Equiptment'), */}
            {/* //   {isTodaysFlag = true, isbookingAppointment = false}
            //   title: 'Clinics List',
        //     headerLeft: () => (
        //       <MaterialIcons.Button */}
        {/* //         name="keyboard-arrow-left"
        //         size={30}
        //         backgroundColor={Colors.secondary}
        //         color={Colors.primary}
        //         onPress={() => navigation.goBack()} */}
        {/* //       />
        //     ),
        //   })}
        // /> */}
        {/* <Stack.Screen
          name={ROUTES.PROFILE_DETAILS}
          component={Profile}
          // initialParams={Clinicparams}
          options={({route, navigation}) => ({
            // route:{params:{isTodaysFlag :true, isbookingAppointment : false}},
            title: trans('UserProfile'),
            //   {isTodaysFlag = true, isbookingAppointment = false}
            //   title: 'Clinics List',
            headerLeft: () => (
              <MaterialIcons.Button
                name="keyboard-arrow-left"
                size={30}
                backgroundColor={Colors.secondary}
                color={Colors.primary}
                onPress={() => navigation.goBack()}
              />
            ),
          })}
        /> */}

        {/* <Stack.Screen
          name={ROUTES.KIDS_PROFILE}
          component={KidsProfile}
          options={({navigation}) => ({
            title: trans("Student's Profile"),
            headerLeft: () => (
              <MaterialIcons.Button
                name="keyboard-arrow-left"
                size={30}
                backgroundColor={Colors.primary}
                color={Colors.secondary}
                onPress={() => navigation.goBack()}
              />
            ),
          })}
        /> */}

        {/* <Stack.Screen
          name={ROUTES.CONTACT_US}
          component={ContactUs}
          options={({route, navigation}) => ({
            title: 'Contact Us',
            title: route.params.isTodaysFlag == true ? 'Todays Appointment' : 'Clinics List',
            headerLeft: () => (
              <MaterialIcons.Button
                name="keyboard-arrow-left"
                size={30}
                backgroundColor={Colors.secondary}
                color={Colors.primary}
                onPress={() => navigation.goBack()}
              />
            ),
          })}
        /> */}
        {/* <Stack.Screen
          name={ROUTES.CHANGEPASSWORD}
          component={ChangePassword}
          options={({route, navigation}) => ({
            title: 'Contact Us',
             title: route.params.isTodaysFlag == true ? 'Todays Appointment' : 'Clinics List',
            headerLeft: () => (
              <MaterialIcons.Button
                name="keyboard-arrow-left"
                size={30}
                backgroundColor={Colors.secondary}
                color={Colors.primary}
                onPress={() => navigation.goBack()}
              />
            ),
          })}
        /> */}
        {/* <Stack.Screen
          name={ROUTES.PREMIUMACCESS}
          component={PremiumAccess}
          options={({route, navigation}) => ({
            title: 'Available Scholarship',
            headerLeft: () => (
              <Icon.Button
                name="ios-chevron-back-outline"
                size={25}
                backgroundColor={Colors.primary}
                onPress={() => navigation.goBack()}></Icon.Button>
            ),
          })}
        /> */}
        {/* <Stack.Screen
          name={ROUTES.PREMIUMPURCHASE}
          component={PremiumPurchase}
          options={({route, navigation}) => ({
            title: 'Purchase',
            headerLeft: () => (
              <Icon.Button
                name="ios-chevron-back-outline"
                size={25}
                backgroundColor={Colors.primary}
                onPress={() => navigation.goBack()}></Icon.Button>
            ),
          })}
        /> */}
      </Stack.Navigator>
    </>
  );
}

export default SearchTab;
