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
import uploadReels from "../../tab/uploadReels";
import UploadReels from "../../tab/uploadReels";
import NearByScreen from "../../tab/NearByScreen";
import MenuOptionScreen from "../../tab/MenuScrren";
import OrganizeEvent from "../../tab/OrganizeEvent";
import GetSponser from "../../tab/GetSponser";
import EditProfile from "../../tab/EditScreen";
import ProfileScreen from "../../tab/Profile";
import UserProfile from "../../tab/UserProfile";
import GiveSponser from "../../tab/GiveSponser";
import PostDetailScreen from "../../tab/AllPostScreen";
import TournamentScreen from "../../tab/TournamentScreen";
import PerformanceUpdate from "../../tab/performanceUpdate";
import TestScreen from "../../tab/TestScreen";

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
       <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
      
      />
      {/* <Stack.Screen name="DmaHome" component={DmaHome} /> */}
      <Stack.Screen name="Equiptment" component={EquipmentScreen} />
      <Stack.Screen name="weeklyPlan" component={weeklyPlan} />
      <Stack.Screen name="Batches" component={BatchScreen} />
      <Stack.Screen name="Attendance" component={AttendenceScreen} />
      <Stack.Screen name="members" component={MemberScreen} />
      <Stack.Screen name="uploadreels" component={UploadReels} />
      <Stack.Screen name="NearBy" component={NearByScreen} />
      <Stack.Screen name="Menu" component={MenuOptionScreen} />
      <Stack.Screen name="OrganizeEvent" component={OrganizeEvent} />
      <Stack.Screen name="GetSponser" component={GetSponser} />
      <Stack.Screen name="EditScreen" component={EditProfile} />
      <Stack.Screen name="userProfile" component={UserProfile} />
      <Stack.Screen name="GiveSponser" component={GiveSponser} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="Tournament" component={TournamentScreen} />
      <Stack.Screen name="Performance" component={PerformanceUpdate} />
      <Stack.Screen name="TestScreen" component={TestScreen} />
    </Stack.Navigator>
  );
};

export default Appstack;
