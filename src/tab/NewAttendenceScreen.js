import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Text from '../component/Text';
import useTheme from '../hooks/useTheme';
import BatchScreen from './BatchScreen';
import AttendenceScreen from './AttendenceScreen';
import Header from '../component/header';

const NewAttendenceScreen = () => {
  const [tab, setTab] = useState('batch');
  const { theme } = useTheme(); // { $primary, $background, $lightText, etc. }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$background }]}>
        <View style={{paddingHorizontal:16}}>
      <Header showBack={true} title={tab === 'batch' ? 'Batch' : 'Attendance'} />
</View>
      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: theme.$background }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            tab === 'batch' && {
              borderBottomColor: theme.$lightText,
              borderBottomWidth: 3,
            
            },
          ]}
          onPress={() => setTab('batch')}
        >
          <Text h5 semiBold >
            Batch
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            tab === 'attendance' && {
              borderBottomColor: theme.$lightText,
              borderBottomWidth: 3,
            },
          ]}
          onPress={() => setTab('attendance')}
        >
          <Text h5 semiBold >
            Attendance
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={{ flex: 1 }}>
        {tab === 'batch' ? <BatchScreen /> : <AttendenceScreen />}
      </View>
    </SafeAreaView>
  );
};

export default NewAttendenceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal:16
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp(1),
  },
  tab: {
    paddingVertical: hp(1),
    width: wp(40),
    alignItems: 'center',
  },
});
