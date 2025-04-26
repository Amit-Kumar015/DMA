import React from 'react';
import {COLORS, ROUTES} from '../../constants';

import Icon from 'react-native-vector-icons/Ionicons';
import {StatusBar} from 'react-native';

import Colors from '../../assets/Colors';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import DmaHome from '../../tab/DmahomeScreen';
import WeeklyPlan from '../../tab/weeklyPlan';
import BatchScreen from '../../tab/BatchScreen';

import AttendenceScreen from '../../tab/AttendenceScreen';
import EquipmentScreen from '../../tab/EquipmentScreen';
import { createStackNavigator } from '@react-navigation/stack';
import MemberScreen from '../../tab/MemberScreen';



const Stack = createStackNavigator();
function DmaTab() {
  return (
    <>
      <StatusBar backgroundColor={'#263d2d'} barStyle="light-content" />

      <Stack.Navigator
        screenOptions={({route, navigation}) => ({
          headerShown: false,
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: '400',
            marginLeft: -20,
            fontFamily: 'Yaldevi-Regular',
          },
        })}
        initialRouteName={"DmaHome"}>
        <Stack.Screen
          name={"DmaHome"}
          component={DmaHome}
          // initialParams={Clinicparams}
          options={({route, navigation}) => ({
            // route:{params:{isTodaysFlag :true, isbookingAppointment : false}},
            title: ('DmaHome'),
            //   {isTodaysFlag = true, isbookingAppointment = false}
            //   title: 'Clinics List',
            headerLeft: () => (
              <MaterialIcons.Button
                name="keyboard-arrow-left"
                size={30}
                backgroundColor={"black"}
                color={"black"}
                onPress={() => navigation.goBack()}
              />
            ),
          })}
        />
        <Stack.Screen
          name={"Equiptment"}
          component={EquipmentScreen}
          // initialParams={Clinicparams}
          options={({route, navigation}) => ({
            // route:{params:{isTodaysFlag :true, isbookingAppointment : false}},
            title: ('Equiptment'),
       
            headerLeft: () => (
              <MaterialIcons.Button
                name="keyboard-arrow-left"
                size={30}
                backgroundColor={"black"}
                color={"Black"}
                onPress={() => navigation.goBack()}
              />
            ),
          })}
        />

        <Stack.Screen
          name={"weeklyPlan"}
          component={WeeklyPlan}
          options={({route, navigation}) => ({
            title: 'weeklyplan',
            // title: route.params.isTodaysFlag == true ? 'Todays Appointment' : 'Clinics List',
            headerLeft: () => (
              <MaterialIcons.Button
                name="keyboard-arrow-left"
                size={30}
                backgroundColor={"black"}
                color={Colors.primary}
                onPress={() => navigation.goBack()}
              />
            ),
          })}
        />
        <Stack.Screen
          name={"Batches"}
          component={BatchScreen}
          options={({route, navigation}) => ({
            title: 'BatchScreen',
            // title: route.params.isTodaysFlag == true ? 'Todays Appointment' : 'Clinics List',
            headerLeft: () => (
              <MaterialIcons.Button
                name="keyboard-arrow-left"
                size={30}
                backgroundColor={"black"}
                color={Colors.primary}
                onPress={() => navigation.goBack()}
              />
            ),
          })}
        />
        <Stack.Screen
          name={"Attendance"}
          component={AttendenceScreen}
          options={({route, navigation}) => ({
            title: 'AttendenceScreen',
            headerLeft: () => (
              <Icon.Button
                name="ios-chevron-back-outline"
                size={25}
                backgroundColor={"white"}
                onPress={() => navigation.goBack()}></Icon.Button>
            ),
          })}
        />
        <Stack.Screen
          name={"members"}
          component={MemberScreen}
          options={({route, navigation}) => ({
            title: 'MemberScreen',
            headerLeft: () => (
              <Icon.Button
                name="ios-chevron-back-outline"
                size={25}
                backgroundColor={"white"}
                onPress={() => navigation.goBack()}></Icon.Button>
            ),
          })}
        />
      </Stack.Navigator>
    </>
  );
}

export default DmaTab;
