import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { sizes,lineHeights, fonts } from '../config/fonts';
import useTheme from '../hooks/useTheme';
console.log("fonts object:", fonts);
const Text = (props) => {
  const {
    style,
    children,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    h7,
    customColor,
    thin,
    semiBold,
    primary,
    medium,
    bold,
    secondary,
    black,
    textAliments,
    ...rest
  } = props;
  const {theme} = useTheme();
  const defaultColor = theme.$lightText; // Default color
  const primaryColor = theme.$lightText; // Primary color

  return (
    <RNText
      {...rest}
      style={StyleSheet.flatten([
        styles.text(defaultColor, textAliments), // Base styles
        style, // Custom styles from props
        customColor && { color: customColor }, // Custom color
        primary && { color: primaryColor }, // Primary color
        
        // Heading styles
        h1 && styles.h1,
        h2 && styles.h2,
        h3 && styles.h3,
        h4 && styles.h4,
        h5 && styles.h5,
        h6 && styles.h6,
        h7 && styles.h7,

        // Font weight styles (should be after base styles to override)
        thin && styles.thin,
        semiBold && styles.semiBold,
        medium && styles.medium,
        bold && styles.bold,
      ])}
    >
      {children}
    </RNText>
  );
};

export default Text;

const styles = StyleSheet.create({
  text: (color, textAliments) => ({
    fontSize: sizes.base,
    textAlign: textAliments || 'left',
    color,
   fontFamily: fonts?.regular || 'System', // Default font
  }),
  medium: {
    fontFamily: fonts.medium,
  },
  thin: {
    fontFamily: fonts.thin,
  },
  semiBold: {
    fontFamily: fonts.semiBold,
  },
  bold: {
    fontFamily: fonts.bold,
  },
  h1: {
    fontSize: sizes.h1,
    lineHeight: lineHeights.h1,
  },
  h2: {
    fontSize: sizes.h2,
    lineHeight: lineHeights.h2,
  },
  h3: {
    fontSize: sizes.h3,
    lineHeight: lineHeights.h3,
  },
  h4: {
    fontSize: sizes.h4,
    lineHeight: lineHeights.h4,
  },
  h5: {
    fontSize: sizes.h5,
    lineHeight: lineHeights.h5,
  },
  h6: {
    fontSize: sizes.h6,
    lineHeight: lineHeights.h6,
  },
  h7: {
    fontSize: sizes.h7,
    lineHeight: lineHeights.h7,
  },
});
