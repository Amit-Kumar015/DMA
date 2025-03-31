import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Text from "../component/Text";
import Header from "../component/header";

const data = [
    { text: "Attendance" },
    { text: "Members" },
    { text: "Batches" },
    { text: "Weekly Plan" },
    { text: "Equipment" }, // Fix extra spaces
    { text: "Managing Finance" },
    { text: "Performance Update" },
    { text: "Marketing And Promotion" },
    { text: "Pay To Play/Rent Facility" }, // Fix spelling
    { text: "Organize Event" }, // Fix spelling
];

const DmaHome = () => {
    const navigation = useNavigation(); // Get navigation object

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
                            if (item.text === "Equipment") {
                                navigation.navigate("Equipt");
                            } else if (item.text === "Weekly Plan") {
                                navigation.navigate("weekly");
                           } else if (item.text === "Batches") {
                                navigation.navigate("Batches"); // ✅ Navigate to Batches screen
                            }
                         else if (item.text === "Attendance") {
                            navigation.navigate("Attendance"); // ✅ Navigate to Batches screen
                        }
                        else if (item.text === "Members") {
                            navigation.navigate("members"); // ✅ Navigate to Batches screen
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
