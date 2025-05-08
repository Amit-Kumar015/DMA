import React from 'react';
import { StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Button as ButtonRNE } from 'react-native-elements';
import { fonts, lineHeights, sizes } from '../config/fonts';
import useTheme from '../hooks/useTheme';

const PrimaryButton = (props) => {
  const {
    secondary,
    size,
    buttonStyle,
    titleStyle,
    loadingProps,
    customsBg,
    disabled,
    icon,
    onPress, // Capture onPress
    ...rest
  } = props;

  const { theme } = useTheme();
  const height = size === 'small' ? 41 : 42;
  const textColor = '#ffffff';

  // Disable the onPress action if disabled is true
  const handlePress = () => {
    if (disabled) return; // Do nothing if disabled
    if (onPress) onPress(); // Trigger the passed onPress function
  };

  return (
    <ButtonRNE
      {...rest}
      buttonStyle={[
        styles.button,
        {
          height,
          backgroundColor: disabled ? '#696969' : customsBg || '#000000', // Handle disabled background color
        },
        buttonStyle,
      ]}
      background={TouchableNativeFeedback.Ripple('rgba(50,49,52,0.79)', false)}
      titleStyle={[
        styles.title,
        { color: textColor },
        size === 'small' && styles.titleSmall,
        titleStyle,
      ]}
      disabled={disabled} // Handle the disabled state of the button
      disabledStyle={{ opacity: 0.5 }} // Reduce opacity for disabled state
      disabledTitleStyle={{ color: textColor, opacity: 0.6 }} // Adjust title opacity when disabled
      loadingProps={{ color: textColor, ...loadingProps }}
      icon={icon} // Pass the icon prop
      iconContainerStyle={styles.iconContainer}
      onPress={handlePress} // Disable press functionality when disabled
    />
  );
};

PrimaryButton.defaultProps = {
  secondary: false,
  buttonStyle: {},
  titleStyle: {},
  size: 'normal',
  loadingProps: {},
  icon: null, // Default to no icon
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: sizes.h4,
    lineHeight: lineHeights.h4,
  },
  titleSmall: {
    fontSize: sizes.h5,
    lineHeight: 17,
  },
  iconContainer: {
    marginRight: 8, // Space between icon and text
  },
});

export default PrimaryButton;
