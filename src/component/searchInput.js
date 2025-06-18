 import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import Card from './card';
import useTheme from '../hooks/useTheme';
import Icon from './icon';
import { fonts, sizes } from '../config/fonts';
import Voice from '@react-native-voice/voice';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

if (
  NativeModules.VoiceModule &&
  (!NativeModules.VoiceModule.addListener || !NativeModules.VoiceModule.removeListeners)
) {
  NativeModules.VoiceModule.addListener = NativeModules.VoiceModule.addListener || (() => {});
  NativeModules.VoiceModule.removeListeners = NativeModules.VoiceModule.removeListeners || (() => {});
}

const Search = (props) => {
  const {
    containerStyle,
    inputContainerStyle,
    inputContentStyle,
    inputStyle,
    showLoading,
    loadingProps,
    value,
    onChangeText,
    autoFocus,
      placeholder = "Search",
  } = props;

  const { theme: colors } = useTheme();
  const input = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState(false);

  const onType = (text) => {
    onChangeText && onChangeText(text);
  };

  const SpeechStartHandler = (err) => {
    console.log("Speech started", err);
  };

  const SpeechEndHandler = (err) => {
    setRecording(false);
    console.log("Speech End", err);
  };

  const SpeechResultsHandler = (Result) => {
    console.log("Speech Result", Result.value);
    if (Result.value && Result.value.length > 0) {
      onChangeText(Result.value[0]);
    }
  };

  const SpeechErrorHandler = (err) => {
    console.log("Speech Error", err);
  };

  const startReacording = async () => {
    setRecording(true);
    try {
      await Voice.start("en-US");
    } catch (err) {
      console.log("Error in starting voice", err);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
    } catch (err) {
      console.log("Error in stopping voice", err);
    }
  };

  const requestMicPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (result === RESULTS.GRANTED) {
      console.log("Microphone permission granted");
    } else {
      console.log("Microphone permission denied");
    }
  };

  useEffect(() => {
    requestMicPermission();
  }, []);

  useEffect(() => {
    Voice.onSpeechStart = SpeechStartHandler;
    Voice.onSpeechEnd = SpeechEndHandler;
    Voice.onSpeechResults = SpeechResultsHandler;
    Voice.onSpeechError = SpeechErrorHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      <Card
        third
        style={[
          styles.inputContainer,
          inputContainerStyle,
          { borderColor: colors.$lightText, backgroundColor: '#F2F3F4' },
        ]}
      >
        {/* Search Icon */}
        <Icon name="search" type="material" size={22} color="grey" style={styles.searchIcon} />

        <View style={[styles.inputContent, inputContentStyle]}>
          <TextInput
            testID="searchInput"
            placeholder={placeholder}
            placeholderTextColor={"black"}
            ref={input}
            style={[
              styles.input,
              inputStyle,
              { color: "black" },
            ]}
            onChangeText={onType}
            autoFocus={autoFocus || false}
            value={value}
          />
        </View>

        {/* Loading Indicator */}
        {showLoading ? loadingProps : null}

        {/* Clear Text Icon */}
        {value?.length > 0 && (
          <TouchableOpacity onPress={() => onType('')} style={styles.iconButton}>
            <Icon name="close-circle" type="material-community" size={22} color="grey" />
          </TouchableOpacity>
        )}

        {/* Mic Icon for Voice Input */}
        <TouchableOpacity onPress={recording ? stopRecording : startReacording} style={styles.iconButton}>
          <Icon name={recording ? "mic-off" : "mic"} type="material" size={22} color="grey" />
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default Search;

Search.defaultProps = {
  value: '',
  showLoading: false,
  onChangeText: () => null,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    height: 50,
  },
  inputContent: {
    flex: 1,
  },
  input: {
    paddingHorizontal: 6,
    fontSize: 13,
    paddingVertical: 4,
  },
  searchIcon: {
    marginRight: 6,
  },
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
});
