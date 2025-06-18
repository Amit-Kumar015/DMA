import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Modal from "react-native-modal";

const MenuModal = ({ isVisible, onClose, options = [], position = { x: 0, y: 0 } }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropOpacity={0}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={{ margin: 0 }}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.container, { top: position.y, left: position.x, position: 'absolute' }]}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  option.onPress();
                  onClose();
                }}
              >
                <Text style={styles.option}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MenuModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 5,
    minWidth: 150,
  },
  option: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
});
