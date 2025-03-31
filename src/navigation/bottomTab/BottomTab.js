import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { home, homeiconselected, mainlogo, profiles, reels, search, searchiconselected } from "../../constants/imageConstants";
import CreateProfile from "../../screen/createProfile";
import DmaHome from "../../tab/DmahomeScreen";
import Search from "../../component/searchInput";
import searchScreen from "../../tab/searchScreen";
import EquipmentScreen from "../../tab/EquipmentScreen";
import HomeScreen from "../../tab/HomeScreen";

const Tab = createBottomTabNavigator();

// ✅ Use correct tab names in ICONS object
const ICONS = {
    HomeScreen: { default: home, selected: homeiconselected },
    Search: { default: search, selected: searchiconselected },
    Post: { default: mainlogo, selected: mainlogo },
    DMA: { default: reels, selected: reels },
    Profile: { default: profiles, selected: profiles },
};

const getTabBarIcon = (name, focused) => {
    const icon = ICONS[name]?.[focused ? "selected" : "default"];

    return (
        <View>
            {icon && <Image source={icon} style={styles.icon} />}
        </View>
    );
};

const BottomTab = () => {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: {
                height: hp("7%"),
                paddingTop: 10,
                backgroundColor: "#000"
            }
        }}>
            <Tab.Screen name="HomeScreen" component={HomeScreen} options={({ route }) => ({ tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused), tabBarLabel: () => null })} />
            <Tab.Screen name="Search" component={searchScreen} options={({ route }) => ({ tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused), tabBarLabel: () => null })} />
            <Tab.Screen name="Post" component={DmaHome} options={({ route }) => ({ tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused), tabBarLabel: () => null })} />
            <Tab.Screen name="DMA" component={DmaHome} options={({ route }) => ({ tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused), tabBarLabel: () => null })} />
            <Tab.Screen name="Profile" component={HomeScreen} options={({ route }) => ({ tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused), tabBarLabel: () => null })} />
        </Tab.Navigator>
    );
};

export default BottomTab;

const styles = StyleSheet.create({
    icon: {
        width: wp("7%"),
        height: wp("7%"),
        resizeMode: "contain",
    }
});
