import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './icon';
import useTheme from '../hooks/useTheme';

const Checkbox = ({ checked, onPress, customStyle }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.checkboxContainer, customStyle]}>
      <View style={styles.checkbox}>
        <Icon
          name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
          color={checked ? "black" : "grey"}
          size={24}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Checkbox;
