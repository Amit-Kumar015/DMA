import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

// Sample video URLs
const videos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
];

const ReelScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== currentIndex) {
        // Pause the previous video before switching to new one
        setIsPaused(true);
        setCurrentIndex(index);
        //  setIsPaused(false);
      }
    }
  }).current;

  const renderItem = ({ item, index }) => {
    const isCurrent = index === currentIndex;

    return (
      <View style={styles.reelContainer}>
        <Video
          source={{ uri: item }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={!isCurrent || isPaused}
          onBuffer={() => isCurrent && setIsBuffering(true)}
          onReadyForDisplay={() => isCurrent && setIsBuffering(false)}
          onError={(error) => console.error('Video Error:', error)}
          onEnd={() => {
            // Handle video end event if needed
            setIsPaused(true);
          }
          }
        />

        {isBuffering && (
          <ActivityIndicator 
            size="large" 
            color="#fff" 
            style={styles.loader}
          />
        )}

        <TouchableOpacity
          activeOpacity={1}
          style={styles.touchableOverlay}
          onPress={() => setIsPaused(prev => !prev)}
        >
          {isPaused && isCurrent && (
            <Icon name="play-circle-filled" size={60} color="#fff" style={styles.pauseIcon} />
          )}

          <View style={styles.bottomInfo}>
            <View style={styles.userRow}>
              <View style={styles.profileImage} />
              <Text style={styles.username}>demo_user</Text>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.caption}>Check out this awesome video! #fun</Text>
          </View>

          <View style={styles.rightIcons}>
            <Icon name="favorite" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.iconText}>24.5k</Text>
            <Icon name="chat-bubble" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.iconText}>1.2k</Text>
            <Icon name="send" size={30} color="#fff" style={styles.icon} />
            <Icon name="more-vert" size={30} color="#fff" style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelContainer: {
    width,
    height,
    backgroundColor: '#000',
  },
  video: {
    width,
    height,
  },
  touchableOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseIcon: {
    position: 'absolute',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#555',
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  followButton: {
    marginLeft: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#0095f6',
    borderRadius: 5,
  },
  followText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  rightIcons: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 15,
  },
});

export default ReelScreen;