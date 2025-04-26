import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { lazy, Suspense } from "react";
import { View, ActivityIndicator } from "react-native";
import SignUp from "../../screen/signUp";
import OTPVerificationScreen from "../../screen/otpScreen";
import CreateProfile from "../../screen/createProfile";
import Appstack from "../AppStack/appStack";
import SplashScreen from "../../screen/SplashScreen";

const Stack = createNativeStackNavigator();
const Login = lazy(() => import("../../screen/Login"));
const BussinessProfile = require("../../screen/BussinessProfile").default;

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);




const AuthStack = () => {
  return (
    <Stack.Navigator
      // initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      {/* ✅ Add this back */}
       <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen 
        name="Login" 
        component={(props) => (
          <Suspense fallback={<LoadingScreen />}>
            <Login {...props} />
          </Suspense>
        )}
      />
       {/* <Stack.Screen name="Login" component={Login} />  */}
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} />
      <Stack.Screen name="createProfile" component={CreateProfile} /> 
      <Stack.Screen name="BussinessProfile" component={BussinessProfile} />
      <Stack.Screen name="Appstack" component={Appstack} />
    </Stack.Navigator>
  );
};

export default AuthStack;
