import React, { useCallback, useState, useRef, useEffect } from "react";
import { Alert, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from "../component/header";
import Search from "../component/searchInput";
import Icon from "../component/icon";
import ActivityIndicator from "../assets/activityIndicator";
import useTheme from "../hooks/useTheme";
import Text from "../component/Text";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStorage from "../utils/authStorage";
import Card from "../component/card";
import { Avatar } from "react-native-elements";
import ButtonWithPushBack from "../component/Button";

const delay = 700;
const SearchScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();

    const [searchText, setSearchText] = useState(""); // State to store search text
    const [showLoading, setShowLoading] = useState(false); // State to control the loading spinner
    const [searchResults, setSearchResults] = useState([]); // State to store search results
    const searchTimeout = useRef(null); // Ref to manage the debouncing of the search
console.log("search",searchResults)
    // Function to handle search text change
    const handleSearchChange = (text) => {
        setSearchText(text);
    
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
    
        if (text.trim().length < 3) {
            setSearchResults([]);  // Directly empty the results if less than 3 characters
            return;
        }
    
        searchTimeout.current = setTimeout(() => {
            fetchSearchResults(text);
        }, delay);
    };
    const handleFollowPress = (user) => {
        navigation.navigate('userProfile', {
          userType: user.user_type,
          userId: user.id,
        });
      };
    // Function to fetch search results from API
    const fetchSearchResults = async (query) => {
        if (query.trim().length < 3) {
            setSearchResults([]); // Reset results if input is less than 3 characters
            return;
        }

        setShowLoading(true);
        try {
            const accessToken = await AuthStorage.getAccessToken(); // Retrieve token from AsyncStorage

            if (!accessToken) {
                console.error('No token found');
                return;
            }

            // Make the API request with the token in headers
            const response = await axios.get(`http://52.70.194.52/api/core/global-search/?q=${query}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Attach token to the headers
                },
            });

            setSearchResults(response.data); // Set the fetched data
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setShowLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header
                showBack={true}
                showSearchInput={true}
                searchProps={{
                    value: searchText,
                    onChangeText: handleSearchChange,
                    placeholder: "Search Employee",
                    clearIcon: <Icon name="clear" type="material" size={16} />,
                    showLoading: showLoading,
                    loadingProps: <ActivityIndicator style={{ marginRight: 10 }} animating size="small" />,
                    inputContainerStyle: { backgroundColor: "#f2f3f4" },
                    autoFocus: true,
                    cancelComponent: <Icon name="close-circle" color={theme.$lightText} type="material-community" />,
                    cancelButtonProps: <Icon name="close-circle" color={theme.$lightText} type="material-community" />,
                    showCancel: "focus",
                    cancelButtonTitle: "clear",
                }}
                paddingHorizontal={5}
            />

<FlatList
    style={styles.list}
    data={searchResults}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
        // <ButtonWithPushBack
        // onPress={() => {      
        // }}>
        <Card third borderWidth={0}>
        <View style={{  }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Avatar
              size={wp('15%')}
              rounded
              activeOpacity={0.7}
              overlayContainerStyle={{
                backgroundColor: '#D9D9D9',
                borderColor: theme.$secondaryText,
                borderWidth: 1,
              }}
              source={item.profile_pic ? { uri: item.profile_pic } : null}
            />
            <View style={{ marginLeft: 10 }}>
              <Text h4 bold>
                {item.username || 'No Username'}
              </Text>
              <Text h5 semiBold>
                {item.first_name} {item.last_name}
              </Text>
            </View>
      
            {/* Follow Button - Absolutely Positioned */}
            <TouchableOpacity
              onPress={() => handleFollowPress(item)} 
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'lightgreen',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                elevation: 2,
              }}
            >
              <Text h5 bold>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
      
        // </ButtonWithPushBack>
    )}
    ListEmptyComponent={
        !showLoading && <Text>No results found</Text>
    }
/>

        </View>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: wp("5%"),
        marginTop: hp("1%"),
    },
    list: {
        marginTop: hp("2%"),
        paddingHorizontal: wp("4%"),
        backgroundColor: "#f9f9f9", // light background if you want
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp("1.5%"),
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    employeeName: {
        flex: 1,
        fontSize: 16,
    },
});
