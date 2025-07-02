import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Header from '../component/header';
import Icon from '../component/icon';
import Custominput from '../component/Custominput';
import Slide from '../assets/slide';
import AuthStorage from '../utils/authStorage';
import {showMessage} from '../utils/messages/message';
import useTheme from '../hooks/useTheme';
import Text from '../component/Text';
import Card from '../component/card';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const PerformanceUpdate = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.$background}, // ✅ dynamic background color
      ]}>
      {step === 0 && <Header showBack={true} title="Tournament Update" />}
      {step === 0 && (
        <ButtonWithPushBack customContainerStyle={[styles.buttonContainer]}>
          <View style={styles.buttonRow}>
            <PrimaryButton title="Reports" onPress={() => setStep(1)} />
            <PrimaryButton
              title="Test"
              onPress={() => navigation.navigate('TestScreen')} // Navigate to TestScreen
              customContainerStyle={{marginTop: 12}}
            />
          </View>
        </ButtonWithPushBack>
      )}
    </SafeAreaView>
  );
};

export default PerformanceUpdate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  buttonRow: {
    gap: 10,
  },
});
