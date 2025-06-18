import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Text from './Text';
import { Avatar } from 'react-native-elements';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import useTheme from '../hooks/useTheme';

const CommentInterface = ({
  visible,
  onClose,
  comments,
  onAddComment,
  renderItem, // <-- Render logic passed from parent
}) => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();
  const {theme}=useTheme()

  const handleSend = () => {
    if (!inputText.trim()) return;
    onAddComment(inputText);
    setInputText('');
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
   <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
  <View style={styles.modalBackground}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <View style={styles.inner}>
        {/* Header with X and Title */}
        <View style={styles.header}>
          <View style={{ flex: 1 }} />
          <Text  h4 bold customColor={"black"} style={styles.headerTitle}>Comments</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text h3 bold  customColor={"black"} style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {comments?.length === 0 ? (
          <View style={styles.noCommentsContainer}>
            <Text style={styles.noCommentsText}>No comments yet</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 15, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* Comment Input */}
        <View style={styles.inputContainer}>
          <Avatar
  size={wp('10%')}
  rounded
  overlayContainerStyle={{
    backgroundColor: '#D9D9D9',
    borderColor: theme.$secondaryText,
    borderWidth: 1,
  }}
  source={{
    uri: 'https://i.pravatar.cc/150?img=3', // 👈 Any fixed avatar URL
  }}
/>

          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  </View>
</Modal>

  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    justifyContent: 'flex-end',
  },
 header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 15,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderColor: '#eee',
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
},

headerTitle: {
  position: 'absolute',
  left: 0,
  right: 0,
  textAlign: 'center',
},

closeButton: {
  zIndex: 1,
},

closeText: {
 
},

noCommentsContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 30,
},

noCommentsText: {
  fontSize: 16,
  color: '#999',
  textAlign: 'center',
},

inner: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  height: '70%', // 👈 height set to 70% of screen
  overflow: 'hidden',
},

  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CommentInterface;
