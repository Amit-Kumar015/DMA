import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from './Text';
import useTheme from '../hooks/useTheme';
import ErrorText from './ErrorTetx';
import moment from 'moment';

export default function CustomDatePicker({
  onChange,
  value,
  title,
  isError = false,
  errorMessage = '',
}) {
  const [dialog, showDialog] = useState(false);
  const { theme } = useTheme();

  return (
    <View style={styles.root}>
      {/* 🔹 Title Display */}
      {title && <Text h5 bold style={styles.title}>{title}</Text>}

      {/* 🔹 Date Picker Button */}
      <TouchableOpacity
        style={[styles.inputSelection, { borderColor: "black", borderWidth: 1, backgroundColor: "#f2f3f4" }]}
        activeOpacity={0.5}
        onPress={() => showDialog(true)}
      >
        <Icon name="date-range" size={20} color={isError ? theme.$danger : 'black'} />
        {/* <Text h5 style={styles.inputSelectionText}>
          {value ? moment(value).format('DD/MM/YYYY') : 'Select Date'}
        </Text> */}
        <Text h5 style={styles.inputSelectionText}>
  {value ? moment(value).format('dddd, DD/MM/YYYY') : 'Select Date'}
</Text>
      </TouchableOpacity>

      {/* 🔹 Error Message */}
      {isError && errorMessage ? <ErrorText errorMessage={errorMessage} /> : null}

      {/* 🔹 Date Picker Modal */}
      <DatePicker
        modal
        title={title}
        open={dialog}
        date={value ? new Date(value) : new Date()}
        onConfirm={date => {
          showDialog(false);
          onChange(date);
        }}
        onCancel={() => showDialog(false)}
        mode="date"
        androidVariant="iosClone"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    // marginHorizontal: 10,
  },
  title: {
    marginBottom: 5,
    fontSize: 16,
  },
  inputSelection: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputSelectionText: {
    flex: 1,
    marginStart: 10,
    fontSize: 14,
    color: 'black', // Ensure text is visible
  },
});
