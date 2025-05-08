// import { StyleSheet, View } from 'react-native';
// import React from 'react';
// import useTheme from '../hooks/useTheme';
// import { inputMinHeight } from '../utils/theme';
// import SelectList from './selectList';

// const SingleSelect = ({
//   arrayData,
//   selected,
//   search,
//   selectedCb,
//   uniqueId,
//   placeholder = "Select Option",   // 🟢 Default placeholder
//   noDataText = "No data found",    // 🟢 Default empty state text
//   boxStyles = {},  
//   dropdownStyles = {}, 
// }) => {
//   const { theme } = useTheme();

//   return (
//     <SelectList
//       setSelected={() => {}}
//       setSelectedValFN={(val) => selectedCb(uniqueId, { value: val?.value, key: val?.key })}
//       data={arrayData}
//       save="value"
//       defaultOption={selected}
//       search={search}
//       placeholder={placeholder}   // 🟢 Passing placeholder to SelectList
//       noDataText={noDataText}     // 🟢 Passing noDataText to SelectList
//       boxStyles={{
//         ...styles.defaultBox,
//         borderColor: theme.$lightText,
//         backgroundColor: theme.$surface,
//         minHeight: inputMinHeight,
//         ...boxStyles,  
//       }}
//       dropdownStyles={{
//         borderColor: theme.$lightText,
//         backgroundColor: theme.$surface,
//         ...dropdownStyles,  
//       }}
//     />
//   );
// };

// export default SingleSelect;

// const styles = StyleSheet.create({
//   defaultBox: {
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//     paddingVertical: 10,
//     marginVertical: 6,
//   },
// });
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
  placeholder = "Select Option",
  noDataText = "No data found",
  boxStyles = {},
  dropdownStyles = {},
}) => {
  const { theme } = useTheme();

  // ✅ Find the selected item to pass as defaultOption
  const selectedOption = arrayData.find(item => item.key === selected);

  return (
    <SelectList
      setSelected={() => {}}
      setSelectedValFN={(val) => selectedCb(uniqueId, { value: val?.value, key: val?.key })}
      data={arrayData}
      save="value"
      defaultOption={selectedOption}  // ✅ Proper selected object
      search={search}
      placeholder={placeholder}
      noDataText={noDataText}
      boxStyles={{
        ...styles.defaultBox,
        borderColor: theme.$lightText,
        backgroundColor: theme.$surface,
        minHeight: inputMinHeight,
        ...boxStyles,
      }}
      dropdownStyles={{
        borderColor: theme.$lightText,
        backgroundColor: theme.$surface,
        ...dropdownStyles,
      }}
    />
  );
};
export default SingleSelect;

const styles = StyleSheet.create({
  defaultBox: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 10,
    marginVertical: 6,
  },
});