import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import weeklyPlan from "../../tab/weeklyPlan";
import BatchScreen from "../../tab/BatchScreen";
import AttendenceScreen from "../../tab/AttendenceScreen";
import MemberScreen from "../../tab/MemberScreen";
import BottomTab from "../bottomTab/BottomTab";
import HomeScreen from "../../tab/HomeScreen";
import SearchScreen from "../../tab/searchScreen";
import DmaHome from "../../tab/DmahomeScreen";
import EquipmentScreen from "../../tab/EquipmentScreen";
import BottomTabNavigator from "../bottomTab/BottomTab";

const Stack = createNativeStackNavigator();

const Appstack = ({ userType }) => {
  console.log("✅ AppStack is Mounted with userType:", userType);

  return (
    <Stack.Navigator
    screenOptions={({ navigation }) => (
   
      {
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
      }
    )}
    initialRouteName={'BottomTab'}
  >
     <Stack.Screen
  name="BottomTab"
  component={BottomTabNavigator}
 
/>

      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
       
      />
       <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
      
      />
    
      {/* <Stack.Screen name="DmaHome" component={DmaHome} /> */}
      <Stack.Screen name="Equiptment" component={EquipmentScreen} />
      <Stack.Screen name="weeklyPlan" component={weeklyPlan} />
      <Stack.Screen name="Batches" component={BatchScreen} />
      <Stack.Screen name="Attendance" component={AttendenceScreen} />
      <Stack.Screen name="members" component={MemberScreen} />
    </Stack.Navigator>
  );
};

export default Appstack;
