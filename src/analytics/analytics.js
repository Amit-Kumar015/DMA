import analytics from '@react-native-firebase/analytics';

// can pass method as parameter
export const predefinedFunc = async () => {
  try {
    await analytics().logEvent({
      method: 'email_password',
    });
    console.log("event sent")
  } catch (error) {
    console.error('Error logging predefined event:', error);
  }
};

export const customFunc = async ({ id, item, description }) => {
  try {
    await analytics().logEvent('products', {
      id: id,
      item: item,
      description: description,
    });
    console.log("event sent")
  } catch (error) {
    console.error('Error logging custom event:', error);
  }
};
