import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import EquipmentScreen from '../../tab/EquipmentScreen';
import weeklyPlan from '../../tab/weeklyPlan';
import BatchScreen from '../../tab/BatchScreen';
import AttendenceScreen from '../../tab/AttendenceScreen';
import MemberScreen from '../../tab/MemberScreen';
import HomeScreen from '../../tab/HomeScreen';
import BottomTab from '../bottomTab/BottomTab';

const Stack = createNativeStackNavigator();

const Appstack = () => {
  console.log('✅ AppStack is Mounted!');
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Equipt" component={EquipmentScreen} />
      <Stack.Screen name="weekly" component={weeklyPlan} />
      <Stack.Screen name="Batches" component={BatchScreen} />
      <Stack.Screen name="Attendance" component={AttendenceScreen} />
      <Stack.Screen name="members" component={MemberScreen} />
    </Stack.Navigator>
  );
};

export default Appstack;
