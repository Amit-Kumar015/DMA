import React, { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Text from "./Text";

const Custominput = ({
    width = "84%",         // Default width
    height = "7%",          // Default height
    title,
    marginTop = 0,
    value,
    onValueChange,
    multiline = false,
    placeholder = "",
}) => {
    const inputRef = useRef(null);

    return (
        <View style={{ marginTop }}>
            {title ? (
                <Text h4 semiBold style={styles.title}>{title}</Text>
            ) : null}
            <TextInput
                ref={inputRef}
                value={value}
                placeholder={placeholder}
                style={[
                    styles.colinput,
                    {
                        width: wp(width),
                        height: hp(height),
                        textAlignVertical: multiline ? "top" : "center",
                    },
                ]}
                placeholderTextColor="#A9A9A9"
                onChangeText={(text) => {
                    if (onValueChange) {
                        onValueChange(text);
                    }
                }}
                multiline={multiline}
            />
        </View>
    );
};
export default Custominput;

const styles = StyleSheet.create({
    title: {
        marginLeft: 5,
        marginBottom: 5,
        color: "#000000",
    },
    colinput: {
        width: wp("100%"),
        height: hp("7%"),
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        borderColor: "#000000",
        color: "#000000",
        backgroundColor: "#F2F3F4",
        // elevation:2
    },
});