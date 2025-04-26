import { showMessage as showText } from 'react-native-flash-message';
import { Toast, toast, ToastPosition } from '@backpackapp-io/react-native-toast';

export const showMessage = (props) => {
  const { type, theme, duration, ...rest } = props;
  const backgroundColor =
    type === 'danger'
      ? theme.$danger
      : type === 'warning'
      ? theme.$background
      : type === 'success'
      ? theme.$accent
      : theme.$background;
  
  showText({
    backgroundColor,
    color: theme.$background,
    ...rest,
    type: type || 'default',
    titleStyle: { fontSize: 18, fontWeight: 'bold',top:10 }, 
    duration: duration || 6000,
    // position: { top:5, left: 0, right: 0 },
  });
};

export const showTost = (props) => {
  const {
    message,
    icon,
    position = ToastPosition.BOTTOM,
    type,
    tostId,
    styles,
    customToast,
    isSwipeable = true,
    duration = 4000,
  } = props;

  const typeOption = {
    duration,
    position,
    icon,
    styles,
    isSwipeable,
    id: tostId,
    customToast,
  };

  switch (type) {
    case 'success':
      toast.success(message || '', typeOption);
      break;
    case 'error':
      toast.error(message || '', typeOption);
      break;
    default:
      toast(message || '', typeOption);
      break;
  }
};

export const hideTost = (tostId) => {
  if (tostId) {
    toast.remove(tostId);
  } else {
    toast.dismiss();
  }
};
