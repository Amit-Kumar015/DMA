// AnalyticsButtonDemo.js

import React from 'react';
import { Text } from 'react-native';
import { customFunc } from './analytics.js'; // adjust path as needed
import ButtonWithPushBack from '../component/Button.js';

const AnalyticsButtonDemo = () => {
  const handlePress = () => {
    customFunc({
      id: 'p101',
      item: 'Smart Watch',
      description: 'Touchscreen smart fitness watch',
    });
  };

  return (
    <ButtonWithPushBack
      onPress={handlePress}
      customContainerStyle={{
        backgroundColor: '#5c6bc0',
        padding: 14,
        borderRadius: 10,
        margin: 16,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
        Log Product View
      </Text>
    </ButtonWithPushBack>
  );
};

export default AnalyticsButtonDemo;
