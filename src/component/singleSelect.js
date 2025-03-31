import { StyleSheet, View } from 'react-native';
import React from 'react';
import useTheme from '../hooks/useTheme';
import { inputMinHeight } from '../utils/theme';
import SelectList from './selectList';

const SingleSelect = ({
  arrayData,
  selected,
  search,
  selectedCb,
  uniqueId,
  boxStyles = {},  // 🟢 Allowing custom styles from props
  dropdownStyles = {}, 
}) => {
  const { theme } = useTheme();

  return (
    <SelectList
      setSelected={() => {}}
      setSelectedValFN={(val) => selectedCb(uniqueId, { value: val?.value, key: val?.key })}
      data={arrayData}
      save="value"
      defaultOption={selected}
      search={search}
      boxStyles={{
        ...styles.defaultBox,
        borderColor: theme.$lightText,
        backgroundColor: theme.$surface,
        minHeight: inputMinHeight,
        ...boxStyles,  // 🟢 Override default styles
      }}
      dropdownStyles={{
        borderColor: theme.$lightText,
        backgroundColor: theme.$surface,
        ...dropdownStyles,  // 🟢 Override dropdown styles
      }}
    />
  );
};

export default SingleSelect;

const styles = StyleSheet.create({
  defaultBox: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8, // 🟢 More rounded corners for better UI
    paddingVertical: 10,
    marginVertical: 6,
  },
});
