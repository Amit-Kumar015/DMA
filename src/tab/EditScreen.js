import { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform,
    TextInput,
    ScrollView,
} from "react-native";
import Header from "../component/header";
import { openCamera, openPhotos } from "../utils/imagePicker";
import { Avatar, BottomSheet, ListItem } from "react-native-elements";
import ImageResizer from "react-native-image-resizer";
import useTheme from "../hooks/useTheme";
import Icon from "../component/icon";

import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const EditProfile = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { theme } = useTheme();
    const [profilePic, setProfilePic] = useState();


    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '9090909090',
        email: 'user@gamil.com',
        location: 'uk',
        description: 'xyz',
    });

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = () => {
        console.log("Form Data:", formData);
    };

    const handleCancel = () => {
        setFormData({
            firstName: '',
            lastName: '',
            phone: '9090909090',
            email: 'user@gmail.com',
            location: 'uk',
            description: 'xyz',
        });
    };

    const list = [
        { title: 'Take Photo', icon: 'camera', onPress: () => handleCameraOpen() },
        {
            title: 'Choose from Gallery',
            icon: 'view-gallery',
            onPress: () => handleGalleryOpen(),
        },
        {
            title: 'Cancel',
            icon: 'close',
            titleStyle: { color: theme.$danger },
            onPress: () => setIsVisible(false),
        },
    ];

    const handleImagePicker = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Take Photo', 'Choose from Gallery', 'Cancel'],
                    cancelButtonIndex: 2,
                },
                buttonIndex => {
                    if (buttonIndex === 0) handleCameraOpen();
                    else if (buttonIndex === 1) handleGalleryOpen();
                }
            );
        } else {
            setIsVisible(true);
        }
    };

    const handleCameraOpen = async () => {
        try {
            const image = await openCamera({ cropping: true });
            if (image) {
                const resizedImage = await ImageResizer.createResizedImage(
                    image.uri,
                    800,
                    800,
                    'JPEG',
                    80
                );
                setProfilePic(resizedImage.uri);
            }
            setIsVisible(false);
        } catch (error) {
            console.log('Camera Error:', error);
        }
    };

    const handleGalleryOpen = async () => {
        try {
            const image = await openPhotos({ cropping: true });
            if (image) {
                const resizedImage = await ImageResizer.createResizedImage(
                    image.uri,
                    800,
                    800,
                    'JPEG',
                    80
                );
                setProfilePic(resizedImage.uri);
            }
            setIsVisible(false);
        } catch (error) {
            console.log('Gallery Error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Edit Profile" showBack={true} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.avatarWrapper}>
                    <Avatar
                        size={wp('25%')}
                        rounded
                        activeOpacity={0.7}
                        overlayContainerStyle={{
                            backgroundColor: '#D9D9D9',
                            borderColor: theme.$secondaryText,
                            borderWidth: 1,
                        }}
                        source={profilePic ? { uri: profilePic } : null}
                    />
                    <TouchableOpacity
                        onPress={handleImagePicker}
                        style={styles.cameraIcon}>
                        <Icon
                            name="camera"
                            size={wp('10%')}
                            color={theme.$secondaryText}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputRow}>
                    <View style={styles.inputGrouphalf}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            placeholder="Enter first name"
                            style={styles.inputBoxHalf}
                            value={formData.firstName}
                            onChangeText={(text) => handleInputChange('firstName', text)}
                        />
                    </View>
                    <View style={styles.inputGrouphalf}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            placeholder="Enter last name"
                            style={styles.inputBoxHalf}
                            value={formData.lastName}
                            onChangeText={(text) => handleInputChange('lastName', text)}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        placeholder="Enter phone number"
                        style={styles.inputBox}
                        value={formData.phone}
                        onChangeText={(text) => handleInputChange('phone', text)}
                        keyboardType="phone-pad"
                        editable={false}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="Enter email"
                        style={styles.inputBox}
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        keyboardType="email-address"
                        editable={false}

                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location</Text>
                    <TextInput
                        placeholder="Enter location"
                        style={styles.inputBox}
                        value={formData.location}
                        onChangeText={(text) => handleInputChange('location', text)}
                        editable={false}

                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        placeholder="Tell something about you"
                        style={styles.inputBox}
                        value={formData.description}
                        onChangeText={(text) => handleInputChange('description', text)}
                        editable={false}

                    />
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelbtn} onPress={handleCancel}>
                        <Text style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.savebtn} onPress={handleSave}>
                        <Text style={styles.btnText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <BottomSheet isVisible={isVisible}>
                    {list.map((l, i) => (
                        <ListItem key={i} onPress={l.onPress} bottomDivider>
                            <Icon name={l.icon} />
                            <ListItem.Content>
                                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </BottomSheet>



            </ScrollView>
        </SafeAreaView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wp('4%'),
        paddingTop: '2%',
    },
    avatarWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('5%'),
        position: 'relative',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 1,
        left: '59%',
        transform: [{ translateX: -wp('3%') }],
        borderRadius: wp('5%'),
        padding: wp('1.5%'),
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
        color: '#333',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('2%'),
        // backgroundColor:"pink"
    },
    inputGroup: {
        marginTop: hp('2%'),
    },
    inputGrouphalf: {
        width: '48%',
    },
    inputBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#F9F9F9',
    },
    inputBoxHalf: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#F9F9F9',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('3%'),
        marginBottom: hp('5%'),
    },
    cancelbtn: {
        width: '48%',
        backgroundColor: '#ccc',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    savebtn: {
        width: '48%',
        backgroundColor: '#000',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});