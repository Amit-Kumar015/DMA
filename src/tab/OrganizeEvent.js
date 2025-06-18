import React, { useState, useRef, useEffect } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import ActivityIndicator from "../assets/activityIndicator";
import useTheme from "../hooks/useTheme";
import Text from "../component/Text";
import Search from "../component/searchInput";
import AuthStorage from "../utils/authStorage";
import Icon from "../component/icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonWithPushBack from "../component/Button";
import PrimaryButton from "../component/prButton";
import { showMessage } from "../utils/messages/message";

const delay = 700;

const OrganizeEvent = () => {
    const { theme } = useTheme();
    const timeout = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [interestData, setInterestData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    console.log('in',interestData)
    console.log("userrrssss",userId)

    const onChangeText = (val) => {
        clearTimeout(timeout.current);
        setSearchText(val);
        setShowLoading(true);

        timeout.current = setTimeout(() => {
            const filtered = interestData.filter((item) =>
                item.toLowerCase().includes(val.toLowerCase())
            );
            setFilteredData(filtered);
            setShowLoading(false);
        }, delay);
    };

    const toggleSelectInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter((item) => item !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const removeSelectedInterest = (interest) => {
        setSelectedInterests(selectedInterests.filter((item) => item !== interest));
    };

    useEffect(() => {
        const getUserIdFromStorage = async () => {
          try {
            const storedId = await AsyncStorage.getItem('userId');
            if (storedId) {
              setUserId(storedId);
              console.log('User ID:', storedId);
            }
          } catch (error) {
            console.log('Error retrieving userId:', error);
          }
        };
    
        getUserIdFromStorage();
      }, []);



const handleSubmit = async () => {
  if (selectedInterests.length < 3) {
     showMessage({
            message: 'select atleast 3 interset!',
            type: 'danger',
            theme: theme,
            duration: 3000,
          });
    return;
  }

  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await fetch(`http://52.70.194.52/api/core/user/${userId}/interests/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ interests: selectedInterests }),
    });

    const result = await response.json();
    console.log('📦 Full API Response:', result); 

    if (response.ok) {
        
        showMessage({
            message: 'Interest subbmited successfully!',
            type: 'success',
            theme: theme,
            duration: 3000,
          });
      // You can navigate or reset state here if needed
    } else {
      Alert.alert(result?.message || 'Something went wrong');
      
    }
  } catch (error) {
    console.error('❌ Submit Error:', error);
    showMessage({
        message: 'Interest not subbmited successfully!',
        type: 'danger',
        theme: theme,
        duration: 3000,
      });
  }
};

    useEffect(() => {
        const getInterest = async () => {
            try {
                const accessToken = await AuthStorage.getAccessToken();
                const response = await fetch(`http://52.70.194.52/api/core/all-interests`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
    
                const result = await response.json();
                if (response.ok) {
                    console.log('✅ Interests Fetched:', result);
                    setInterestData(result.interests); 
                    setFilteredData(result.interests); 
                } else {
                    console.error('❌ Error Fetching Interests:', result);
                }
            } catch (error) {
                console.error('🔥 Network Error:', error);
            }
        };
    
        getInterest();
    }, []);
    
    // Debugging: Add a log to check filteredData
    useEffect(() => {
        console.log("Filtered Interests:", filteredData);
    }, [filteredData]);
    
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleSelectInterest(item)} style={{ flex: 1 }}>
                <Text style={styles.interestName}>{item}</Text>
            </TouchableOpacity>
        </View>
    );
    
    return (
        <View style={styles.container}>
            <View style={styles.searchWrapper}>
                <Search
                    value={searchText}
                    onChangeText={onChangeText}
                    autoFocus={true}
                    showLoading={showLoading}
                    loadingProps={<ActivityIndicator style={{ marginRight: 10 }} animating size="small" />}
                    containerStyle={styles.searchContainer}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputStyle}
                />
            </View>
    
            {/* Selected Interests Display */}
            <View style={styles.selectedContainer}>
                {selectedInterests.map((interest, index) => (
                    <View key={index} style={styles.selectedInterest}>
                        <Text style={styles.selectedInterestName}>{interest}</Text>
                        <TouchableOpacity onPress={() => removeSelectedInterest(interest)}>
                            <Icon name="close" type="material" size={22} color="gray" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
    
            {/* FlatList for Interests */}
            <FlatList
  data={filteredData}
  keyExtractor={(item, index) => index.toString()}
  renderItem={renderItem}
  contentContainerStyle={[styles.list, { paddingBottom: hp("10%") }]} // 👈 Add bottom padding
  showsVerticalScrollIndicator={false}
/>
<View style={styles.buttonWrapper}>
  <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
  <PrimaryButton title="Submit" onPress={handleSubmit} />
  </ButtonWithPushBack>
</View>
        </View>
    );
};

export default OrganizeEvent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:16,
        backgroundColor:"#ffffff"
    },
    searchWrapper: {
        paddingHorizontal: wp("5%"),
        paddingTop: hp("5%"),
    },
    searchContainer: {
        backgroundColor: "transparent",
        padding: 0,
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: 'transparent',  // 👈 Add this
        shadowOffset: { width: 0, height: 0 }, // 👈 Add this
        shadowRadius: 0, // 👈 Add this
        borderWidth: 0,
    },
    
    inputContainer: {
        backgroundColor: "transparent",
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: 'transparent', // 👈 Add this too
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
    },
    
    inputStyle: {
        // fontSize: 16,
        // paddingVertical: 4,
        // paddingHorizontal: 0,
        // color: "#000",
    },
    selectedContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "#f2f3f4",
        paddingHorizontal: wp("5%"),
        paddingBottom: hp("1%"),
    },
    selectedInterest: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: wp("2%"),
        marginBottom: hp("1%"),
        backgroundColor: "#e0e0e0",
        borderRadius: 20,
        padding: 5,
    },
    selectedInterestName: {
        color: "#333",
        marginRight: 5,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp("1.5%"),
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    interestName: {
        color: "#000",
    },
    list: {
        paddingHorizontal: wp("5%"),
    },
    buttonContainers: {
        bottom: wp("7%"),
        paddingHorizontal:16
    },
    buttonWrapper: {
        position: 'absolute',
        bottom: wp("5%"),
        left: 16,
        right: 16,
      }
});
