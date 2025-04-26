import React, { useEffect } from 'react';
import {
  StatusBar,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../hooks/useTheme';
import Text from './Text';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Search from './searchInput';

const Header = ({
  title,
  rightComponent,
  showBack = false,
  customBackEvent,
  showSearchInput = false,
  searchProps = {},

}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('white');
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(false);
    }
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" hidden={false} />
      <View style={[styles.headerContainer,]}>
        {showBack && (
          <TouchableOpacity
            style={styles.touchableContainer}
            onPress={customBackEvent ? customBackEvent : navigation.goBack}
          >
            <Icon name="keyboard-backspace" size={28} color="black" />
          </TouchableOpacity>
        )}

        {/* Title or Search */}
        <View style={[styles.centerContainer, { marginLeft: showBack ? 16 : 0, alignItems: showBack ? 'center' : 'flex-start' }]}>
          {showSearchInput ? (
            <Search
              containerStyle={{ marginVertical: 0 }}
              placeholder="Search..."
              inputContainerStyle={{
                backgroundColor: '#f0f0f0',
                height: 35,
                borderRadius: 10,
                paddingHorizontal: 10,
              }}
              searchIcon={{}}
              {...searchProps}
            />
          ) : (
            <Text h4 bold numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        {rightComponent || <View style={styles.touchableContainer} />}
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: Platform.OS === 'android' ? 15 : 0,
    paddingHorizontal :16
  },
  touchableContainer: {
    width: wp('5%'),
    height: wp('9%'),
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideContainer: {
    width: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    // You can also adjust padding here if necessary
  },
});
