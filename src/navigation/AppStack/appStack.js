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
import BoostAccademy from "../../tab/BoostAccademy";
import BmiScreen from "../../tab/BmiScreen";
import DietPlan from "../../tab/DietPlan";
import PersonalDataScreen from "../../tab/PersonalDataScreen";
import BoostGym from "../../tab/BoostGym";
import GymMemberShipScree from "../../tab/GymMemberShipScree";
import AninitiesScreen from "../../tab/AninitiesScreen";
import GymAnnounceMentScreen from "../../tab/GymAnnounceMentScreen";
import NewAttendenceScreen from "../../tab/NewAttendenceScreen";
import VerifyScreen from "../../tab/VerifyScreen";
import sellProductScreen from "../../tab/sellProductScreen";
import NoticationScreen from "../../tab/NoticationScreen";
import MainShop from "../../tab/E-Commerce/MainShop";
import AllCategories from "../../tab/E-Commerce/AllCategories";
import ProductScreen from "../../tab/E-Commerce/ProductScreen";
import CartScreen from "../../tab/E-Commerce/cartScreen";


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
      <Stack.Screen name="BoostAccademy" component={BoostAccademy} />
        <Stack.Screen name="BmiScreen" component={BmiScreen} />
          <Stack.Screen name="DietPlan" component={DietPlan} />
            <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
              <Stack.Screen name="BoostGym" component={BoostGym} />
                <Stack.Screen name="GymMemberShip" component={GymMemberShipScree} />
                 <Stack.Screen name="Anenities" component={AninitiesScreen} />
                  <Stack.Screen name="Announcement" component={GymAnnounceMentScreen} />
                   <Stack.Screen name="NewAttendenceScreen" component={NewAttendenceScreen} />
                    <Stack.Screen name="VerifyScreen" component={VerifyScreen} />
                      <Stack.Screen name="sellProductScreen" component={sellProductScreen} />
                       <Stack.Screen name="NotificationScreen" component={NoticationScreen} />
                        <Stack.Screen name="MainShop" component={MainShop} />
                        <Stack.Screen name="AllCategories" component={AllCategories} />
                          <Stack.Screen name="ProductScreen" component={ProductScreen} />
                            <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
};

export default Appstack;
