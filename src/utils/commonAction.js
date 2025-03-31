import AsyncStorage from '@react-native-async-storage/async-storage';
// import Sound from 'react-native-sound';
import {showMessage} from 'react-native-flash-message';
// import {THEMES} from '../assets/theme';
// import {STATUSES} from '../constants/constants';
import moment from 'moment';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {Alert} from 'react-native';

export function flashMessage(message, description, type) {
  showMessage({
    message,
    description,
    type,
    icon: type,
    duration: 3000,
  });
}

export const setDataInLocalStorage = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getDataFromLocalStorage = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    let dataObj = await JSON.parse(data);
    if (dataObj) {
      return dataObj;
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

export const clearStorageData = async () => {
  await AsyncStorage.clear();
};

export const clearItemFromStorage = async key => {
  await AsyncStorage.removeItem(key);
};

export const getColorCodeByStatus = status => {
  switch (status) {
    case STATUSES.PENDING:
      return THEMES.light.colors.pending;
    case STATUSES.SHIPPED:
      return THEMES.light.colors.shipped;
    case STATUSES.DELIVERED:
      return THEMES.light.colors.delivered;
    default:
      return THEMES.light.colors.delivered;
  }
};

export const getCapitalisedFormattedString = string => {
  const formattedString = string?.replace(/_/g, ' ');
  const formattedArray = formattedString?.split(' ');
  for (let i = 0; i < formattedArray?.length; i++) {
    formattedArray[i] =
      formattedArray[i][0]?.toUpperCase() +
      formattedArray[i]?.substr(1)?.toLowerCase();
  }
  return formattedArray?.join(' ');
};

function generateDateArray(startDate, numberOfDays) {
  const dateArray = [];
  const currentDate = new Date(startDate);
  for (let i = 0; i < numberOfDays; i++) {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - i);
    dateArray.push(moment(newDate).format('DD'));
  }
  return dateArray;
}

export const getArray = historyData => {
  let object;

  const TodayDate = new Date();
  const specificDate = moment(TodayDate).format('YYYY-MM-DD'); // Replace this with your specific date
  const numberOfDays = 7;
  const result = generateDateArray(specificDate, numberOfDays);
  historyData?.map(item => {
    let num = moment(item?.createdDate).format('DD');
    if (result?.includes(num)) {
      object = {
        date: num,
        status: true,
      };
    } else {
      object = {
        date: num,
        status: false,
      };
    }
    return object;
  });
  console.log('object', object);
  return result;
};

export const formattedTimes = () => {
  const time = new Date();
  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${ampm}`;
};

export const formattedTime = () => {
  const time = new Date();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
export const formatDate = (date) => {
  return date ? moment(date).format('ddd, DD-MMM-YYYY') : "No Date Selected";
};

export const calculateTime = clockInDate => {
  if (!clockInDate) {
    return '';
  }

  const currentTime = moment();
  const clockInMoment = moment(clockInDate);

  const duration = moment.duration(currentTime.diff(clockInMoment));

  const hoursDiff = duration.hours().toString().padStart(2, '0');
  const minutesDiff = duration.minutes().toString().padStart(2, '0');
  const secondsDiff = duration.seconds().toString().padStart(2, '0');

  return `${hoursDiff}:${minutesDiff}:${secondsDiff}`;
};

export const checkCameraPermissions = async () => {
  try {
    const result = await check(PERMISSIONS.ANDROID.CAMERA);
    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
    } else {
      const permissionResult = await request(PERMISSIONS.ANDROID.CAMERA);
      if (permissionResult === RESULTS.GRANTED || result === RESULTS.LIMITED) {
      } else {
        throw new Error('Camera Permission not granted!');
      }
    }
  } catch (error) {
    Alert.alert(
      'Attention!',
      error?.message || 'Permission is set to never ask',
      [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ],
    );
  }
};

export const playDingSound = sound => {
  Sound.setCategory('Playback');
  const whoosh = new Sound(sound, Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    whoosh.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  });
};

export function validObject(obj) {
  return !!obj && typeof obj === 'object' && Object.keys(obj)?.length > 0;
}

export function validArray(arr) {
  return (
    !!arr && typeof arr === 'object' && Array.isArray(arr) && arr?.length > 0
  );
}

export function validNumber(number) {
  return !isNaN(number) && !isNaN(parseFloat(number));
}
