import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Text from '../component/Text';
import { inputMinHeight } from '../utils/theme';
import useTheme from '../hooks/useTheme';

// const TextInputEml = ({ label, placeholder, value, onChangeText, icon, keyboardType, secureTextEntry, rightIcon, onRightIconPress,  height,  }) => {
//     const {theme}=useTheme()
//     return (
//         <View style={styles.container}>
//             {label && <Text h5 semiBold style={[styles.label,{color:theme.$lightText}]}>{label}</Text>}
//             <View style={[styles.inputContainer,{backgroundColor:theme.$surface,borderColor:theme.$lightText,  height: height || 45,}]}>
//                 {icon && <FontAwesome name={icon} size={20} color={theme.$lightText} style={styles.icon} />}
//                 <TextInput
//                     style={styles.input}
//                     placeholder={placeholder}
//                     placeholderTextColor={theme.$lightText}
//                     value={value}
//                     onChangeText={onChangeText}
//                     keyboardType={keyboardType}
//                     secureTextEntry={secureTextEntry}
//                 />
//                 {rightIcon && (
//                     <TouchableOpacity onPress={onRightIconPress}>
//                         <FontAwesome name={rightIcon} size={20} color={theme.$lightText} />
//                     </TouchableOpacity>
//                 )}
//             </View>
//         </View>
//     );
// };
const TextInputEml = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  keyboardType,
  secureTextEntry,
  rightIcon,
  onRightIconPress,
  height,
  customStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, customStyle]}>
      {label && (
        <Text h5 semiBold style={[styles.label, { color: theme.$lightText }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.$surface,
            borderColor: theme.$lightText,
            height: height || 45,
          },
        ]}
      >
        {icon && (
          <FontAwesome
            name={icon}
            size={20}
            color={theme.$lightIconColor}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { color: theme.$lightIconColor, textAlignVertical: 'top'}]}
            multiline={true}
          placeholder={placeholder}
          // placeholderTextColor={theme.$lightIconColor}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <FontAwesome name={rightIcon} size={20} color={theme.$lightIconColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextInputEml;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    label: {
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#333',
        paddingHorizontal: 10, // Side padding
        borderRadius: 8,
        borderWidth: 1,
        // borderColor: "#E5E5E5",
        height: 45, // ✅ Fixed height
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        // color: '#black',
        fontSize: 14,
    },
});

