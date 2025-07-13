import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';


const AlertPopUp = ({
    visible,
    title,
    message,
    okText,
    onCancel,
    onPress,
    inform
}) => {
    
    return (
        <Modal visible={visible} transparent animationType='fade'>
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    {inform ?
                    <TouchableOpacity style={styles.informBtn}>
                      <Text style={styles.okText}>OK</Text>
                    </TouchableOpacity> :
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.okBtn} onPress={onPress}>
                            {okText ? 
                                <Text style={styles.okText}>{okText}</Text> :
                                <Text style={styles.okText}>OK</Text>
                            }
                        </TouchableOpacity>
                    </View>}
                </View>
            </View>
        </Modal>
    )
}

export default AlertPopUp

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: { color: 'black', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  message: { color: 'black', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    backgroundColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
  },
  okBtn: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 10,
    backgroundColor: '#2196F3',
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelText: { color: '#000' },
  okText: { color: '#fff' },
  informBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#2196F3',
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 100,
}
});
