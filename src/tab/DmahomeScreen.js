// import React, { useEffect, useState } from "react";
// import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useSelector } from "react-redux";
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import Text from "../component/Text";
// import Header from "../component/header";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Icon from "../component/icon";




// const businessData = [
//     { text: "Attendance", icon: "checkmark-done-outline" },
//     { text: "Members", icon: "people-outline" },
//     { text: "Batches", icon: "layers-outline" },
//     { text: "Weekly Plan", icon: "calendar-outline" },
//     { text: "Equiptment", icon: "fitness-outline" },
//     { text: "Managing Finance", icon: "cash-outline" },
//     { text: "Performance Update", icon: "bar-chart-outline" },
//     { text: "Marketing And Promotion", icon: "megaphone-outline" },
//     // { text: "Pay To Play/Rent Facility", icon: "card-outline" },
//     {text:"Find Near By",icon:"search"},
//     { text: "Organize Event", icon: "calendar-number-outline" },
// ];


// const normalUserData = [
//     { text: "Attendance", icon: "checkmark-done-outline" },
//     { text: "Batches", icon: "layers-outline" },
//     {text:"Find Near By",icon:"search"},
//     { text: "Equiptment", icon: "fitness-outline" },
// ];

// const DmaHome = () => {
//     const navigation = useNavigation();
//     const businessProfile = useSelector(state => state.auth.businessProfile);
//     const [userType, setUserType] = useState('');
//     const [profileMessage, setProfileMessage] = useState('');
    
//     console.log("Business Profile:", businessProfile);

//     useEffect(() => {
//         const fetchUserType = async () => {
//             try {
//                 // Check if businessProfile exists and contains the success message
//                 if (businessProfile?.message === "Business Info created successfully") {
//                     setProfileMessage(businessProfile.message);
//                     await AsyncStorage.setItem('profileMessage', businessProfile.message); // Save profile message
//                 }

//                 // Fetch userType from Redux or AsyncStorage as needed
//                 const storedUserType = await AsyncStorage.getItem('userType');
//                 if (storedUserType) {
//                     setUserType(storedUserType);
//                 }
//             } catch (error) {
//                 console.error('Error fetching userType or profile message:', error);
//             }
//         };

//         fetchUserType();
//     }, [businessProfile]);

//     console.log('Current userType:', userType);
//     console.log('Profile message:', profileMessage);

//     // Check for userType and profile message to select data
//     const data = userType === "business" || profileMessage === "Business Info created successfully" ? businessData : normalUserData;

//     return (
//         <View style={styles.Container}>
//                <Header
//         showBack={true}
//         title="Dashboard"
//         rightComponent={
//           <View style={{flexDirection: 'row', gap: 15}}>
//             <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
//               <Icon name="bell" size={23} color={'black'} />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
//               <Icon name="menu" size={23} color={'black'} />
//             </TouchableOpacity>
//           </View>
//         }
//       />
//             <FlatList
//                 data={data}
//                 keyExtractor={(item) => item.text}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity
//                         style={styles.ColRow}
//                         onPress={() => {
//                             if (item.text === "Equiptment") {
//                                 navigation.navigate("Equiptment");
//                             } else if (item.text === "Weekly Plan") {
//                                 navigation.navigate("weeklyPlan");
//                             } else if (item.text === "Batches") {
//                                 navigation.navigate("Batches");
//                             } else if (item.text === "Attendance") {
//                                 navigation.navigate("Attendance");
//                             } else if (item.text === "Members") {
//                                 navigation.navigate("members");
//                             }
//                              else if (item.text === "Find Near By") {
//                                 navigation.navigate("NearBy");
//                             }
//                         }}
//                     >
//                              <View style={styles.row}>
//                             <Ionicons name={item.icon} size={20} color="#333" style={styles.icon} />
//                             <Text h5 semiBold textAliments="center">{item.text}</Text>
//                         </View>

//                     </TouchableOpacity>
//                 )}
//             />
//         </View>
//     );
// };

// export default DmaHome;

// const styles = StyleSheet.create({
//     ColRow: {
//         width: wp("92%"),
//         height: hp("6%"),
//         borderWidth: 1,
//         borderColor: "black",
//         borderRadius: 12,
//         marginHorizontal: wp("4%"),
//         marginTop: 20,
//         justifyContent: "center",
//         backgroundColor: "#f2f3f4",
//     },
//     Container: {
//         width: wp("100%"),
//         height: hp("100%"),
//         backgroundColor: "#ffffff",
//     },
//     icon: {
//         marginRight: 10,
//     },
// row: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
// },


// });
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from "../component/icon";
import AntDesign
from 'react-native-vector-icons/AntDesign';

const businessData = [
    { text: "Attendance", icon: "checkmark-done-outline" },
    { text: "Members", icon: "people-outline" },
    { text: "Batches", icon: "layers-outline" },
    { text: "Weekly Plan", icon: "calendar-outline" },
    { text: "Equiptment", icon: "fitness-outline" },
    { text: "Managing Finance", icon: "cash-outline" },
    { text: "Performance Update", icon: "bar-chart-outline" },
    { text: "Marketing And Promotion", icon: "megaphone-outline" },
    { text: "Organize Event", icon: "calendar-number-outline" },
    
];

const normalUserData = [
    { text: "Attendance", icon: "checkmark-done-outline" },
    { text: "Batches", icon: "layers-outline" },
    { text: "Find Near By", icon: "search" },
    { text: "Equiptment", icon: "fitness-outline" },
    { text: "Get Sponsored", icon: "fitness-outline" },
];

const DmaHome = () => {
    const navigation = useNavigation();
    const businessProfile = useSelector(state => state.auth.businessProfile);
    const [userType, setUserType] = useState('');
    const [profileMessage, setProfileMessage] = useState('');

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                if (businessProfile?.message === "Business Info created successfully") {
                    setProfileMessage(businessProfile.message);
                    await AsyncStorage.setItem('profileMessage', businessProfile.message);
                }

                const storedUserType = await AsyncStorage.getItem('userType');
                if (storedUserType) {
                    setUserType(storedUserType);
                }
            } catch (error) {
                console.error('Error fetching userType or profile message:', error);
            }
        };

        fetchUserType();
    }, [businessProfile]);

    // Prepare data based on user type
    let finalData = userType === "business" || profileMessage === "Business Info created successfully"
        ? [...businessData]
        : [...normalUserData];

    // Always include "Isha" item
    const isIshaPresent = finalData.some(item => item.text === "");
    if (!isIshaPresent) {
        // finalData.push({
            // text: "Isha",
            // icon: "person-outline",
            // screen: "IshaScreen", // Optional: Create this screen or handle navigation
        // });
    }

    return (
        <View style={styles.Container}>
            <Header
                showBack={true}
                title="DMA"
                rightComponent={
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                           <TouchableOpacity  onPress={() => navigation.navigate('uploadreels')}>
                                      <AntDesign name="plussquareo" size={23} color={'black'} />
                                    </TouchableOpacity>
                        <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
                            <Icon name="bell" size={23} color={'black'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
                            <Icon name="menu" size={23} color={'black'} />
                        </TouchableOpacity>
                    </View>
                }
            />
            <FlatList
                data={finalData}
                keyExtractor={(item) => item.text}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.ColRow}
                        onPress={() => {
                            switch (item.text) {
                                case "Equiptment":
                                    navigation.navigate("Equiptment");
                                    break;
                                case "Weekly Plan":
                                    navigation.navigate("weeklyPlan");
                                    break;
                                case "Batches":
                                    navigation.navigate("Batches");
                                    break;
                                case "Attendance":
                                    navigation.navigate("Attendance");
                                    break;
                                case "Members":
                                    navigation.navigate("members");
                                    break;
                                case "Find Near By":
                                    navigation.navigate("NearBy");
                                    break;
                                case "Organize Event":
                                    navigation.navigate("OrganizeEvent");
                                    break;
                                    case "Get Sponsored":
                                        navigation.navigate("GetSponser");
                                        break;
                                
                               
                            }
                        }}
                    >
                        <View style={styles.row}>
                            <Ionicons name={item.icon} size={20} color="#333" style={styles.icon} />
                            <Text h5 semiBold textAliments="center">{item.text}</Text>
                        </View>
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
        // backgroundColor: "#f2f3f4",
    },
    Container: {
        // width: wp("100%"),
        // height: hp("100%"),
        // backgroundColor: "#ffffff",
        flex:1
        
    },
    icon: {
        marginRight: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        
    },
});
