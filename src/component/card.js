import React from 'react';
import { StyleSheet, View } from 'react-native';
import useTheme from '../hooks/useTheme';

const Card = ({ children, style = {}, third = false, secondary = false ,borderWidth=0, borderRadius=0,}) => {
  const { theme } = useTheme();

  const bgColor = third
    ? theme.$surface
    : secondary
    ? theme.$secondaryCard
    : theme.$background;

  return <View style={[styles.card, { backgroundColor: bgColor, borderWidth,borderRadius }, style]}>{children}</View>;
};

export default Card;

const styles = StyleSheet.create({
  card: {
    // borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    // borderWidth:1,
        // overflow: 'hidden',
      

  },
});
