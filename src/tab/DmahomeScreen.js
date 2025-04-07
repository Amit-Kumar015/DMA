import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Text from "../component/Text";
import Header from "../component/header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const businessData = [
    { text: "Attendance" },
    { text: "Members" },
    { text: "Batches" },
    { text: "Weekly Plan" },
    { text: "Equiptment" },
    { text: "Managing Finance" },
    { text: "Performance Update" },
    { text: "Marketing And Promotion" },
    { text: "Pay To Play/Rent Facility" },
    { text: "Organize Event" },
];

const normalUserData = [
    { text: "Attendance" },
    { text: "Batches" },
    { text: "Equiptment" },
];

const DmaHome = () => {
    const navigation = useNavigation();
    // const userType = useSelector(state => state.user.userData?.user?.user_type);

    // Get user type
    const userData = useSelector(state => state.user.userData);
    const [userType, setUserType] = useState('');
    console.log("u5",userType)
    useEffect(() => {
      const fetchUserType = async () => {
        try {
          if (userData?.user?.user_type) {
            setUserType(userData.user.user_type);
            await AsyncStorage.setItem('userType', userData.user.user_type); // Save userType
          } else {
            const storedUserType = await AsyncStorage.getItem('userType'); // Fetch userType from AsyncStorage
            if (storedUserType) {
              setUserType(storedUserType);
            }
          }
        } catch (error) {
          console.error('Error fetching userType:', error);
        }
      };
    
      fetchUserType();
    }, [userData]);
  
    console.log('Current userType:', userType);
    const data = userType === "business" ? businessData : normalUserData; // Select data based on user type

    return (
        <View style={styles.Container}>
            <Header showBack={true} title="DMA" />
            <FlatList
                data={data}
                keyExtractor={(item) => item.text}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.ColRow}
                        onPress={() => {
                            if (item.text === "Equiptment") {
                                navigation.navigate("Equiptment");
                            } else if (item.text === "Weekly Plan") {
                                navigation.navigate("weeklyPlan");
                            } else if (item.text === "Batches") {
                                navigation.navigate("Batches");
                            } else if (item.text === "Attendance") {
                                navigation.navigate("Attendance");
                            } else if (item.text === "Members") {
                                navigation.navigate("members");
                            }
                        }}
                    >
                        <Text h5 semiBold textAliments="center">{item.text}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default DmaHome;

const styles = StyleSheet.create({
    ColRow: {
        width: wp("92%"),
        height: hp("6%"),
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 12,
        marginHorizontal: wp("4%"),
        marginTop: 20,
        justifyContent: "center",
        backgroundColor: "#f2f3f4",
    },
    Container: {
        width: wp("100%"),
        height: hp("100%"),
        backgroundColor: "#ffffff",
    }
});
